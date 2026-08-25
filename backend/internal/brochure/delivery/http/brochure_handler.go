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
	"github.com/addispay/backend/internal/brochure/domain"
	"github.com/addispay/backend/internal/response"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const maxBrochureBytes = 8 * 1024 * 1024 // 8 MB

var allowedBrochureTypes = map[string]string{
	"image/jpeg": ".jpg",
	"image/jpg":  ".jpg",
	"image/png":  ".png",
	"image/webp": ".webp",
}

type BrochureHandler struct {
	usecase   domain.BrochureUsecase
	uploadDir string
}

func NewBrochureHandler(usecase domain.BrochureUsecase, uploadDir string) *BrochureHandler {
	return &BrochureHandler{usecase: usecase, uploadDir: uploadDir}
}

type CreateBrochureRequest struct {
	Title       string `json:"title" binding:"omitempty,max=255"`
	ImageURL    string `json:"imageUrl" binding:"required,max=500"`
	SortOrder   int    `json:"sortOrder"`
	IsPublished *bool  `json:"isPublished"`
}

type UpdateBrochureRequest struct {
	Title       *string `json:"title" binding:"omitempty,max=255"`
	ImageURL    *string `json:"imageUrl" binding:"omitempty,max=500"`
	SortOrder   *int    `json:"sortOrder"`
	IsPublished *bool   `json:"isPublished"`
}

func (h *BrochureHandler) ListPublic(c *gin.Context) {
	imgs, err := h.usecase.ListPublished(c.Request.Context())
	if err != nil {
		response.FromError(c, err)
		return
	}
	response.Success(c, http.StatusOK, map[string]interface{}{"images": imgs})
}

func (h *BrochureHandler) ListAdmin(c *gin.Context) {
	imgs, err := h.usecase.ListAll(c.Request.Context())
	if err != nil {
		response.FromError(c, err)
		return
	}
	response.Success(c, http.StatusOK, map[string]interface{}{"images": imgs})
}

func (h *BrochureHandler) Create(c *gin.Context) {
	actorID, ok := currentUserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}
	var req CreateBrochureRequest
	if !response.BindJSON(c, &req) {
		return
	}
	published := true
	if req.IsPublished != nil {
		published = *req.IsPublished
	}
	img, err := h.usecase.Create(c.Request.Context(), actorID, domain.CreateBrochureInput{
		Title:       req.Title,
		ImageURL:    req.ImageURL,
		SortOrder:   req.SortOrder,
		IsPublished: published,
	})
	if err != nil {
		response.FromError(c, err)
		return
	}
	response.Success(c, http.StatusCreated, img)
}

func (h *BrochureHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "invalid brochure image id")
		return
	}
	var req UpdateBrochureRequest
	if !response.BindJSON(c, &req) {
		return
	}
	img, err := h.usecase.Update(c.Request.Context(), id, domain.UpdateBrochureInput{
		Title:       req.Title,
		ImageURL:    req.ImageURL,
		SortOrder:   req.SortOrder,
		IsPublished: req.IsPublished,
	})
	if err != nil {
		response.FromError(c, err)
		return
	}
	response.Success(c, http.StatusOK, img)
}

func (h *BrochureHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "invalid brochure image id")
		return
	}
	if err := h.usecase.Delete(c.Request.Context(), id); err != nil {
		response.FromError(c, err)
		return
	}
	response.Success(c, http.StatusOK, map[string]string{"message": "Brochure image deleted"})
}

func (h *BrochureHandler) Upload(c *gin.Context) {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		response.Error(c, http.StatusBadRequest, "file is required")
		return
	}
	if fileHeader.Size <= 0 || fileHeader.Size > maxBrochureBytes {
		response.Error(c, http.StatusBadRequest, "image must be between 1 byte and 8 MB")
		return
	}

	src, err := fileHeader.Open()
	if err != nil {
		response.FromError(c, err)
		return
	}
	defer src.Close()

	head := make([]byte, 512)
	n, _ := io.ReadFull(src, head)
	contentType := http.DetectContentType(head[:n])
	ext, ok := allowedBrochureTypes[contentType]
	if !ok {
		switch strings.ToLower(filepath.Ext(fileHeader.Filename)) {
		case ".jpg", ".jpeg":
			ext = ".jpg"
		case ".png":
			ext = ".png"
		case ".webp":
			ext = ".webp"
		default:
			response.Error(c, http.StatusBadRequest, "only JPG, PNG, or WebP images are allowed")
			return
		}
	}
	if _, err := src.Seek(0, io.SeekStart); err != nil {
		response.Error(c, http.StatusBadRequest, "could not read uploaded file")
		return
	}

	dir := filepath.Join(h.uploadDir, "brochure")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		response.Error(c, http.StatusInternalServerError, "could not prepare upload directory")
		return
	}

	name := fmt.Sprintf("%d_%s%s", time.Now().UnixNano(), uuid.NewString()[:8], ext)
	destPath := filepath.Join(dir, name)
	dst, err := os.Create(destPath)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "could not save file")
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		_ = os.Remove(destPath)
		response.Error(c, http.StatusInternalServerError, "could not save file")
		return
	}

	response.Success(c, http.StatusOK, map[string]interface{}{
		"url":      "/uploads/brochure/" + name,
		"filename": name,
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
