package http

import (
	"net/http"
	"strconv"

	authhttp "github.com/addispay/backend/internal/auth/delivery/http"
	"github.com/addispay/backend/internal/news/domain"
	"github.com/addispay/backend/internal/response"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type NewsHandler struct {
	usecase domain.NewsUsecase
}

func NewNewsHandler(usecase domain.NewsUsecase) *NewsHandler {
	return &NewsHandler{usecase: usecase}
}

type CreateArticleRequest struct {
	Title            string                   `json:"title"`
	ShortDescription string                   `json:"shortDescription"`
	FullContent      string                   `json:"fullContent"`
	CoverImageURL    string                   `json:"coverImageUrl"`
	IsFeatured       bool                     `json:"isFeatured"`
	Status           domain.PublicationStatus `json:"status"`
}

func (h *NewsHandler) CreateArticle(c *gin.Context) {
	userIDVal, exists := c.Get(string(authhttp.UserIDKey))
	if !exists {
		response.Error(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	userIDStr := userIDVal.(string)
	authorID, err := uuid.Parse(userIDStr)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	var req CreateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	article, err := h.usecase.CreateArticle(c.Request.Context(), authorID, req.Title, req.ShortDescription, req.FullContent, req.CoverImageURL, req.IsFeatured, req.Status)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, article)
}

func (h *NewsHandler) GetHomepageNews(c *gin.Context) {
	featured, latest, err := h.usecase.GetHomepageNews(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, map[string]interface{}{
		"featured": featured,
		"latest":   latest,
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