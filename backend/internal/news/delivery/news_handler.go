package delivery

import (
	"net/http"
	"strconv"

	"github.com/addispay/backend/internal/news/domain"
	"github.com/addispay/backend/internal/news/usecase"
	"github.com/gin-gonic/gin"
)

type NewsHandler struct {
	usecase *usecase.NewsUsecase
}

func NewNewsHandler(usecase *usecase.NewsUsecase) *NewsHandler {
	return &NewsHandler{
		usecase: usecase,
	}
}

func (h *NewsHandler) Create(c *gin.Context) {
	var news domain.News

	if err := c.ShouldBindJSON(&news); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body",
		})
		return
	}

	if err := h.usecase.Create(&news); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create news",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    news,
	})
}

func (h *NewsHandler) GetAll(c *gin.Context) {
	news, err := h.usecase.GetAll()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch news",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    news,
	})
}

func (h *NewsHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid news ID",
		})
		return
	}

	news, err := h.usecase.GetByID(uint(id))

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "News not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    news,
	})
}

func (h *NewsHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid news ID",
		})
		return
	}

	news, err := h.usecase.GetByID(uint(id))

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "News not found",
		})
		return
	}

	var input domain.News

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body",
		})
		return
	}

	news.Title = input.Title
	news.Slug = input.Slug
	news.Excerpt = input.Excerpt
	news.Content = input.Content
	news.CoverImage = input.CoverImage
	news.IsPublished = input.IsPublished
	news.IsFeatured = input.IsFeatured

	if err := h.usecase.Update(news); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to update news",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    news,
	})
}

func (h *NewsHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid news ID",
		})
		return
	}

	if err := h.usecase.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to delete news",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "News deleted successfully",
	})
}