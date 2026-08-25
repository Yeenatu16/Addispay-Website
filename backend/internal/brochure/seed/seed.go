package seed

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"

	authDomain "github.com/addispay/backend/internal/auth/domain"
	"github.com/addispay/backend/internal/brochure/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var legacyBrochureFiles = []string{
	"doc_1.jpg",
	"doc_2.jpg",
	"doc_3.jpg",
	"doc_4.jpg",
	"doc_5.jpg",
	"doc_6.jpg",
	"doc_7.jpg",
	"doc_8.jpg",
	"doc_9.jpg",
	"doc_10.jpg",
	"doc_11.jpg",
	"doc_12.jpg",
	"posHero.png",
	"gatewayHero.png",
}

// BrochureImages seeds the former hardcoded /brochure gallery when empty.
func BrochureImages(db *gorm.DB, uploadDir string, sourceDirs []string) error {
	var count int64
	if err := db.Model(&domain.BrochureImage{}).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	actorID := uuid.Nil
	var admin authDomain.User
	if err := db.Where("role = ? AND is_active = ?", authDomain.RoleSuperAdmin, true).
		Order("created_at ASC").First(&admin).Error; err == nil {
		actorID = admin.ID
	} else if err := db.Order("created_at ASC").First(&admin).Error; err == nil {
		actorID = admin.ID
	}
	if actorID == uuid.Nil {
		log.Println("brochure seed skipped: no administrator account found")
		return nil
	}

	destDir := filepath.Join(uploadDir, "brochure")
	if err := os.MkdirAll(destDir, 0o755); err != nil {
		return err
	}

	seeded := 0
	for i, filename := range legacyBrochureFiles {
		src, err := findSource(filename, sourceDirs)
		if err != nil {
			log.Printf("brochure seed: skip %s (%v)", filename, err)
			continue
		}
		name := fmt.Sprintf("seed_%s", filename)
		dest := filepath.Join(destDir, name)
		if err := copyFile(src, dest); err != nil {
			log.Printf("brochure seed: copy failed for %s: %v", filename, err)
			continue
		}
		title := strings.TrimSuffix(filename, filepath.Ext(filename))
		img := domain.BrochureImage{
			Title:       title,
			ImageURL:    "/uploads/brochure/" + name,
			SortOrder:   i + 1,
			IsPublished: true,
			CreatedByID: actorID,
		}
		if err := db.WithContext(context.Background()).Create(&img).Error; err != nil {
			log.Printf("brochure seed: insert failed for %s: %v", filename, err)
			continue
		}
		seeded++
	}
	log.Printf("brochure seed: inserted %d images", seeded)
	return nil
}

func findSource(filename string, dirs []string) (string, error) {
	for _, dir := range dirs {
		path := filepath.Join(dir, filename)
		if st, err := os.Stat(path); err == nil && !st.IsDir() && st.Size() > 0 {
			return path, nil
		}
	}
	return "", fmt.Errorf("file not found")
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
