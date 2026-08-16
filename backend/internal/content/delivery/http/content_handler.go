package http

import (
	"net/http"
	"strconv"

	"github.com/addispay/backend/internal/content/domain"
	"github.com/addispay/backend/internal/response"
	"github.com/gin-gonic/gin"
)

type ContentHandler struct {
	usecase domain.ContentUsecase
}

func NewContentHandler(usecase domain.ContentUsecase) *ContentHandler {
	return &ContentHandler{usecase: usecase}
}

type SubscribeRequest struct {
	Email string `json:"email"`
}

type ContactRequest struct {
	FullName string `json:"fullName"`
	Email    string `json:"email"`
	Reason   string `json:"reason"`
	Message  string `json:"message"`
}

type UpdateNewsSettingsRequest struct {
	HomepageLimit *int    `json:"homepageLimit"`
	EmptyMessage  *string `json:"emptyMessage"`
}

func (h *ContentHandler) Subscribe(c *gin.Context) {
	var req SubscribeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.usecase.Subscribe(c.Request.Context(), req.Email); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, map[string]string{"message": "Newsletter subscription successful"})
}

func (h *ContentHandler) ContactUs(c *gin.Context) {
	var req ContactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.usecase.SendContactMessage(c.Request.Context(), req.FullName, req.Email, req.Reason, req.Message); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, map[string]string{"message": "Message sent successfully"})
}

func (h *ContentHandler) ListAuditLogs(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	logs, total, err := h.usecase.ListAuditLogs(c.Request.Context(), page, limit)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, map[string]interface{}{
		"logs":  logs,
		"total": total,
	})
}

func (h *ContentHandler) GetNewsSettings(c *gin.Context) {
	limit, message, err := h.usecase.GetNewsSettings(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, map[string]interface{}{
		"homepageLimit": limit,
		"emptyMessage":  message,
	})
}

func (h *ContentHandler) UpdateNewsSettings(c *gin.Context) {
	var req UpdateNewsSettingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}
	if req.HomepageLimit == nil && req.EmptyMessage == nil {
		response.Error(c, http.StatusBadRequest, "provide homepageLimit and/or emptyMessage")
		return
	}

	if err := h.usecase.UpdateNewsSettings(c.Request.Context(), req.HomepageLimit, req.EmptyMessage); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	limit, message, _ := h.usecase.GetNewsSettings(c.Request.Context())
	response.Success(c, http.StatusOK, map[string]interface{}{
		"homepageLimit": limit,
		"emptyMessage":  message,
	})
}
