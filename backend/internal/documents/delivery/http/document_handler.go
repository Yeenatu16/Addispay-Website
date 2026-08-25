package http

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	authhttp "github.com/addispay/backend/internal/auth/delivery/http"
	"github.com/addispay/backend/internal/documents/domain"
	"github.com/addispay/backend/internal/response"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const maxDocumentBytes = 25 * 1024 * 1024 // 25 MB

type DocumentHandler struct {
	usecase   domain.DocumentUsecase
	uploadDir string
}

func NewDocumentHandler(usecase domain.DocumentUsecase, uploadDir string) *DocumentHandler {
	return &DocumentHandler{usecase: usecase, uploadDir: uploadDir}
}

type CreateDocumentRequest struct {
	Title       string `json:"title" binding:"required,max=255"`
	Category    string `json:"category" binding:"required,max=100"`
	Description string `json:"description" binding:"required"`
	FileURL     string `json:"fileUrl" binding:"required,max=500"`
	FileSize    string `json:"fileSize" binding:"required,max=50"`
	DateLabel   string `json:"dateLabel" binding:"omitempty,max=100"`
	Pages       int    `json:"pages" binding:"omitempty,min=0"`
	SortOrder   int    `json:"sortOrder"`
	IsPublished *bool  `json:"isPublished"`
}

type UpdateDocumentRequest struct {
	Title       *string `json:"title" binding:"omitempty,max=255"`
	Category    *string `json:"category" binding:"omitempty,max=100"`
	Description *string `json:"description"`
	FileURL     *string `json:"fileUrl" binding:"omitempty,max=500"`
	FileSize    *string `json:"fileSize" binding:"omitempty,max=50"`
	DateLabel   *string `json:"dateLabel" binding:"omitempty,max=100"`
	Pages       *int    `json:"pages" binding:"omitempty,min=0"`
	SortOrder   *int    `json:"sortOrder"`
	IsPublished *bool   `json:"isPublished"`
}

func (h *DocumentHandler) ListPublic(c *gin.Context) {
	docs, err := h.usecase.ListPublished(c.Request.Context())
	if err != nil {
		response.FromError(c, err)
		return
	}
	response.Success(c, http.StatusOK, map[string]interface{}{"documents": docs})
}

func (h *DocumentHandler) ListAdmin(c *gin.Context) {
	docs, err := h.usecase.ListAll(c.Request.Context())
	if err != nil {
		response.FromError(c, err)
		return
	}
	response.Success(c, http.StatusOK, map[string]interface{}{"documents": docs})
}

func (h *DocumentHandler) ListCategories(c *gin.Context) {
	cats, err := h.usecase.ListCategories(c.Request.Context())
	if err != nil {
		response.FromError(c, err)
		return
	}
	response.Success(c, http.StatusOK, map[string]interface{}{"categories": cats})
}

func (h *DocumentHandler) Create(c *gin.Context) {
	actorID, ok := currentUserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}
	var req CreateDocumentRequest
	if !response.BindJSON(c, &req) {
		return
	}
	published := true
	if req.IsPublished != nil {
		published = *req.IsPublished
	}
	doc, err := h.usecase.Create(c.Request.Context(), actorID, domain.CreateDocumentInput{
		Title:       req.Title,
		Category:    req.Category,
		Description: req.Description,
		FileURL:     req.FileURL,
		FileSize:    req.FileSize,
		DateLabel:   req.DateLabel,
		Pages:       req.Pages,
		SortOrder:   req.SortOrder,
		IsPublished: published,
	})
	if err != nil {
		response.FromError(c, err)
		return
	}
	response.Success(c, http.StatusCreated, doc)
}

func (h *DocumentHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "invalid document id")
		return
	}
	var req UpdateDocumentRequest
	if !response.BindJSON(c, &req) {
		return
	}
	doc, err := h.usecase.Update(c.Request.Context(), id, domain.UpdateDocumentInput{
		Title:       req.Title,
		Category:    req.Category,
		Description: req.Description,
		FileURL:     req.FileURL,
		FileSize:    req.FileSize,
		DateLabel:   req.DateLabel,
		Pages:       req.Pages,
		SortOrder:   req.SortOrder,
		IsPublished: req.IsPublished,
	})
	if err != nil {
		response.FromError(c, err)
		return
	}
	response.Success(c, http.StatusOK, doc)
}

func (h *DocumentHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "invalid document id")
		return
	}
	if err := h.usecase.Delete(c.Request.Context(), id); err != nil {
		response.FromError(c, err)
		return
	}
	response.Success(c, http.StatusOK, map[string]string{"message": "Document deleted"})
}

func (h *DocumentHandler) Upload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		response.Error(c, http.StatusBadRequest, "file is required")
		return
	}
	if file.Size <= 0 || file.Size > maxDocumentBytes {
		response.Error(c, http.StatusBadRequest, "PDF must be between 1 byte and 25 MB")
		return
	}

	src, err := file.Open()
	if err != nil {
		response.FromError(c, err)
		return
	}
	defer src.Close()

	head := make([]byte, 512)
	n, _ := io.ReadFull(src, head)
	contentType := http.DetectContentType(head[:n])
	if contentType != "application/pdf" && !strings.EqualFold(filepath.Ext(file.Filename), ".pdf") {
		response.Error(c, http.StatusBadRequest, "only PDF files are allowed")
		return
	}
	if _, err := src.Seek(0, io.SeekStart); err != nil {
		response.Error(c, http.StatusBadRequest, "could not read uploaded file")
		return
	}

	dir := filepath.Join(h.uploadDir, "documents")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		response.Error(c, http.StatusInternalServerError, "could not prepare upload directory")
		return
	}

	name := fmt.Sprintf("%d_%s.pdf", time.Now().UnixNano(), uuid.NewString()[:8])
	destPath := filepath.Join(dir, name)
	dst, err := os.Create(destPath)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "could not save file")
		return
	}
	defer dst.Close()

	written, err := io.Copy(dst, src)
	if err != nil {
		_ = os.Remove(destPath)
		response.Error(c, http.StatusInternalServerError, "could not save file")
		return
	}

	url := "/uploads/documents/" + name
	response.Success(c, http.StatusOK, map[string]interface{}{
		"url":      url,
		"filename": name,
		"fileSize": formatBytes(written),
	})
}

func currentUserID(c *gin.Context) (uuid.UUID, bool) {
	raw, exists := c.Get(string(authhttp.UserIDKey))
	if !exists {
		return uuid.Nil, false
	}
	id, err := uuid.Parse(raw.(string))
	if err != nil {
		return uuid.Nil, false
	}
	return id, true
}

func formatBytes(n int64) string {
	const (
		kb = 1024
		mb = 1024 * kb
	)
	switch {
	case n >= mb:
		return fmt.Sprintf("%.1f MB", float64(n)/float64(mb))
	case n >= kb:
		return fmt.Sprintf("%.0f KB", float64(n)/float64(kb))
	default:
		return fmt.Sprintf("%d B", n)
	}
}
