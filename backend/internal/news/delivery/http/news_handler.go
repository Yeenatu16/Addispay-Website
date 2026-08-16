package http

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	authhttp "github.com/addispay/backend/internal/auth/delivery/http"
	"github.com/addispay/backend/internal/news/domain"
	"github.com/addispay/backend/internal/response"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const maxCoverImageBytes = 5 * 1024 * 1024 // 5 MB

var allowedCoverTypes = map[string]string{
	"image/jpeg": ".jpg",
	"image/jpg":  ".jpg",
	"image/png":  ".png",
	"image/webp": ".webp",
}

type NewsHandler struct {
	usecase   domain.NewsUsecase
	uploadDir string
	userName  func(ctx *gin.Context) string
}

func NewNewsHandler(usecase domain.NewsUsecase, uploadDir string) *NewsHandler {
	return &NewsHandler{
		usecase:   usecase,
		uploadDir: uploadDir,
		userName:  func(c *gin.Context) string { return "Administrator" },
	}
}

// SetUserNameResolver optionally resolves display names from JWT/context.
func (h *NewsHandler) SetUserNameResolver(fn func(*gin.Context) string) {
	if fn != nil {
		h.userName = fn
	}
}

type CreateArticleRequest struct {
	Title            string                   `json:"title"`
	ShortDescription string                   `json:"shortDescription"`
	FullContent      string                   `json:"fullContent"`
	CoverImageURL    string                   `json:"coverImageUrl"`
	IsFeatured       bool                     `json:"isFeatured"`
	Status           domain.PublicationStatus `json:"status"`
}

type UpdateArticleRequest struct {
	Title            *string                   `json:"title"`
	ShortDescription *string                   `json:"shortDescription"`
	FullContent      *string                   `json:"fullContent"`
	CoverImageURL    *string                   `json:"coverImageUrl"`
	IsFeatured       *bool                     `json:"isFeatured"`
	Status           *domain.PublicationStatus `json:"status"`
}

func (h *NewsHandler) CreateArticle(c *gin.Context) {
	actorID, ok := currentUserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	var req CreateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	article, err := h.usecase.CreateArticle(
		c.Request.Context(),
		actorID,
		h.userName(c),
		req.Title,
		req.ShortDescription,
		req.FullContent,
		req.CoverImageURL,
		req.IsFeatured,
		req.Status,
	)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, article)
}

func (h *NewsHandler) UpdateArticle(c *gin.Context) {
	actorID, ok := currentUserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid article ID")
		return
	}

	var req UpdateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	article, err := h.usecase.UpdateArticle(c.Request.Context(), actorID, h.userName(c), id, domain.UpdateArticleInput{
		Title:            req.Title,
		ShortDescription: req.ShortDescription,
		FullContent:      req.FullContent,
		CoverImageURL:    req.CoverImageURL,
		IsFeatured:       req.IsFeatured,
		Status:           req.Status,
	})
	if err != nil {
		status := http.StatusBadRequest
		if err.Error() == "article not found" {
			status = http.StatusNotFound
		}
		response.Error(c, status, err.Error())
		return
	}

	response.Success(c, http.StatusOK, article)
}

func (h *NewsHandler) DeleteArticle(c *gin.Context) {
	actorID, ok := currentUserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid article ID")
		return
	}

	if err := h.usecase.DeleteArticle(c.Request.Context(), actorID, h.userName(c), id); err != nil {
		status := http.StatusBadRequest
		if err.Error() == "article not found" {
			status = http.StatusNotFound
		}
		response.Error(c, status, err.Error())
		return
	}

	response.Success(c, http.StatusOK, map[string]string{"message": "Article deleted"})
}

func (h *NewsHandler) GetAdminArticle(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid article ID")
		return
	}

	article, err := h.usecase.GetByID(c.Request.Context(), id)
	if err != nil {
		response.Error(c, http.StatusNotFound, err.Error())
		return
	}

	response.Success(c, http.StatusOK, article)
}

func (h *NewsHandler) ListAdminArticles(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.Query("search")

	filter := domain.NewsListFilter{Page: page, Limit: limit, Search: search}
	if statusRaw := c.Query("status"); statusRaw != "" {
		status := domain.PublicationStatus(strings.ToUpper(statusRaw))
		filter.Status = &status
	}

	articles, total, err := h.usecase.ListAdminArticles(c.Request.Context(), filter)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, map[string]interface{}{
		"articles": articles,
		"total":    total,
	})
}

func (h *NewsHandler) GetHomepageNews(c *gin.Context) {
	featured, latest, emptyMessage, err := h.usecase.GetHomepageNews(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, map[string]interface{}{
		"featured":     featured,
		"latest":       latest,
		"emptyMessage": emptyMessage,
	})
}

func (h *NewsHandler) GetNewsListing(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")

	articles, total, err := h.usecase.GetPublishedNews(c.Request.Context(), page, limit, search)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, map[string]interface{}{
		"articles": articles,
		"total":    total,
	})
}

func (h *NewsHandler) GetArticleBySlug(c *gin.Context) {
	slug := c.Param("slug")
	article, err := h.usecase.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Article not found")
		return
	}

	response.Success(c, http.StatusOK, article)
}

// UploadCoverImage accepts JPG/JPEG/PNG/WebP up to 5MB (FR-ADM-009).
func (h *NewsHandler) UploadCoverImage(c *gin.Context) {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		response.Error(c, http.StatusBadRequest, "file is required (multipart field name: file)")
		return
	}
	if fileHeader.Size > maxCoverImageBytes {
		response.Error(c, http.StatusBadRequest, "file exceeds maximum size of 5 MB")
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		response.Error(c, http.StatusBadRequest, "unable to read uploaded file")
		return
	}
	defer file.Close()

	header := make([]byte, 512)
	n, _ := file.Read(header)
	contentType := http.DetectContentType(header[:n])
	if _, ok := allowedCoverTypes[contentType]; !ok {
		// Fallback to extension when DetectContentType is too generic.
		switch strings.ToLower(filepath.Ext(fileHeader.Filename)) {
		case ".jpg", ".jpeg", ".png", ".webp":
			// ok
		default:
			response.Error(c, http.StatusBadRequest, "unsupported format; allowed: JPG, JPEG, PNG, WebP")
			return
		}
	}

	if _, err := file.Seek(0, io.SeekStart); err != nil {
		response.Error(c, http.StatusInternalServerError, "unable to process uploaded file")
		return
	}

	// Decode, downscale, and re-encode to an optimized JPEG for web delivery.
	optimized, err := optimizeCoverImage(file)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "unable to process image; ensure it is a valid JPG, PNG, or WebP")
		return
	}

	dir := filepath.Join(h.uploadDir, "news")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		response.Error(c, http.StatusInternalServerError, "unable to create upload directory")
		return
	}

	filename := fmt.Sprintf("%d_%s.jpg", time.Now().UnixNano(), uuid.New().String()[:8])
	destPath := filepath.Join(dir, filename)
	if err := os.WriteFile(destPath, optimized, 0o644); err != nil {
		response.Error(c, http.StatusInternalServerError, "unable to save uploaded file")
		return
	}

	publicURL := "/uploads/news/" + filename
	response.Success(c, http.StatusCreated, map[string]interface{}{
		"url":           publicURL,
		"filename":      filename,
		"optimizedSize": len(optimized),
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
