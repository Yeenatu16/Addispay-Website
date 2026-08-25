package seed

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"

	authDomain "github.com/addispay/backend/internal/auth/domain"
	"github.com/addispay/backend/internal/documents/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type seedDoc struct {
	Title       string
	Category    string
	Description string
	SourceFile  string
	FileSize    string
	DateLabel   string
	Pages       int
	SortOrder   int
}

// officialLibrary is the former hardcoded /doc catalog.
var officialLibrary = []seedDoc{
	{
		Title:       "Addispay Official Memorandum & Articles of Association",
		Category:    "Governance & Legal",
		Description: "Official establishing charter and legal Memorandum of Association for Addispay Financial Technology S.C.",
		SourceFile:  "memorandum.pdf",
		FileSize:    "3.2 MB",
		DateLabel:   "Official Charter",
		Pages:       18,
		SortOrder:   1,
	},
	{
		Title:       "Addispay Board of Directors Annual Executive Report",
		Category:    "Governance & Legal",
		Description: "Executive progress report by the Board of Directors detailing payment system operator performance and expansion.",
		SourceFile:  "AddispayBoard2025Report.pdf",
		FileSize:    "20 MB",
		DateLabel:   "2025 Annual",
		Pages:       42,
		SortOrder:   2,
	},
	{
		Title:       "Addispay Financial & External Audit Report 2024",
		Category:    "Audit & Financial",
		Description: "Complete audited financial statements, ledger reconciliations, and independent external auditor report for 2024.",
		SourceFile:  "2024auditreport.pdf",
		FileSize:    "809 KB",
		DateLabel:   "2024 Financials",
		Pages:       24,
		SortOrder:   3,
	},
	{
		Title:       "Addispay Financial & Audit Report 2025",
		Category:    "Audit & Financial",
		Description: "Official 2025 financial report and regulatory submission prepared for National Bank of Ethiopia oversight.",
		SourceFile:  "2025auditreport.pdf",
		FileSize:    "3.8 MB",
		DateLabel:   "2025 Financials",
		Pages:       30,
		SortOrder:   4,
	},
	{
		Title:       "1st Annual General Shareholders Meeting Document",
		Category:    "Shareholders",
		Description: "Official resolutions, meeting minutes, and corporate decisions from the 1st Annual General Shareholders Meeting.",
		SourceFile:  "1stmeeting.pdf",
		FileSize:    "565 KB",
		DateLabel:   "1st Assembly",
		Pages:       14,
		SortOrder:   5,
	},
	{
		Title:       "2nd Annual Shareholders Assembly General Report",
		Category:    "Shareholders",
		Description: "Comprehensive report and decisions approved during the 2nd General Assembly of Addispay shareholders.",
		SourceFile:  "2ndmeeting.pdf",
		FileSize:    "235 KB",
		DateLabel:   "2nd Assembly",
		Pages:       12,
		SortOrder:   6,
	},
	{
		Title:       "Board of Directors Election Rules & Voting Regulations",
		Category:    "Governance & Legal",
		Description: "Regulatory guidelines, candidate qualifications, and voting procedures for Board of Directors elections.",
		SourceFile:  "election.pdf",
		FileSize:    "726 KB",
		DateLabel:   "Governance",
		Pages:       16,
		SortOrder:   7,
	},
	{
		Title:       "Shareholders Assembly Official Meeting Call & Notice",
		Category:    "Shareholders",
		Description: "Formal announcement call notice for the General Assembly of Shareholders of Addispay S.C.",
		SourceFile:  "2ndcall.pdf",
		FileSize:    "200 KB",
		DateLabel:   "Official Notice",
		Pages:       6,
		SortOrder:   8,
	},
	{
		Title:       "General Shareholders Convocation Notice PDF",
		Category:    "Shareholders",
		Description: "Published convocation notice for extraordinary general shareholder assembly.",
		SourceFile:  "call.pdf",
		FileSize:    "531 KB",
		DateLabel:   "Notice",
		Pages:       4,
		SortOrder:   9,
	},
	{
		Title:       "NBE Payment System Operator License Certificate PDF",
		Category:    "NBE Regulatory",
		Description: "License Certificate NPS/PSO/007/2022 authorizing Addispay Financial Technology S.C. as a Payment System Operator.",
		SourceFile:  "nbe_payment_operator_license.pdf",
		FileSize:    "820 KB",
		DateLabel:   "NBE License",
		Pages:       2,
		SortOrder:   10,
	},
	{
		Title:       "Addispay Official Merchant Service Agreement (53 Articles PDF)",
		Category:    "Governance & Legal",
		Description: "Legal binding framework governing merchant acquiring, transaction fees, payouts, chargebacks, and NBE compliance.",
		SourceFile:  "addispay_merchant_service_agreement.pdf",
		FileSize:    "1.4 MB",
		DateLabel:   "2024-2026",
		Pages:       14,
		SortOrder:   11,
	},
}

// OfficialDocuments copies legacy frontend PDFs into uploads and inserts rows
// when the official_documents table is empty.
func OfficialDocuments(db *gorm.DB, uploadDir string, sourceDirs []string) error {
	var count int64
	if err := db.Model(&domain.OfficialDocument{}).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	actorID := uuid.Nil
	var admin authDomain.User
	if err := db.Where("role = ? AND is_active = ?", authDomain.RoleSuperAdmin, true).
		Order("created_at ASC").
		First(&admin).Error; err == nil {
		actorID = admin.ID
	} else if err := db.Order("created_at ASC").First(&admin).Error; err == nil {
		actorID = admin.ID
	}
	if actorID == uuid.Nil {
		log.Println("documents seed skipped: no administrator account found")
		return nil
	}

	destDir := filepath.Join(uploadDir, "documents")
	if err := os.MkdirAll(destDir, 0o755); err != nil {
		return err
	}

	seeded := 0
	for _, item := range officialLibrary {
		src, err := findSource(item.SourceFile, sourceDirs)
		if err != nil {
			log.Printf("documents seed: skip %s (%v)", item.SourceFile, err)
			continue
		}

		name := fmt.Sprintf("seed_%s", item.SourceFile)
		dest := filepath.Join(destDir, name)
		if err := copyFile(src, dest); err != nil {
			log.Printf("documents seed: copy failed for %s: %v", item.SourceFile, err)
			continue
		}

		doc := domain.OfficialDocument{
			Title:       item.Title,
			Category:    item.Category,
			Description: item.Description,
			FileURL:     "/uploads/documents/" + name,
			FileSize:    item.FileSize,
			DateLabel:   item.DateLabel,
			Pages:       item.Pages,
			SortOrder:   item.SortOrder,
			IsPublished: true,
			CreatedByID: actorID,
		}
		if err := db.WithContext(context.Background()).Create(&doc).Error; err != nil {
			log.Printf("documents seed: insert failed for %s: %v", item.Title, err)
			continue
		}
		seeded++
	}

	log.Printf("documents seed: inserted %d official documents", seeded)
	return nil
}

func findSource(filename string, dirs []string) (string, error) {
	for _, dir := range dirs {
		path := filepath.Join(dir, filename)
		if st, err := os.Stat(path); err == nil && !st.IsDir() && st.Size() > 0 {
			return path, nil
		}
	}
	return "", fmt.Errorf("file not found in seed directories")
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	if _, err := io.Copy(out, in); err != nil {
		return err
	}
	return out.Close()
}
