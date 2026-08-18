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
	Email string `json:"email" binding:"required,email,max=255"`
}

type ContactRequest struct {
	FullName string `json:"fullName" binding:"required,max=255"`
	Email    string `json:"email" binding:"required,email,max=255"`
	Reason   string `json:"reason" binding:"required,max=255"`
	Message  string `json:"message" binding:"required"`
}

type UpdateNewsSettingsRequest struct {
	HomepageLimit *int    `json:"homepageLimit" binding:"omitempty,min=1,max=20"`
	EmptyMessage  *string `json:"emptyMessage" binding:"omitempty,max=2000"`
}

func (h *ContentHandler) Subscribe(c *gin.Context) {
	var req SubscribeRequest
	if !response.BindJSON(c, &req) {
		return
	}

	if err := h.usecase.Subscribe(c.Request.Context(), req.Email); err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusOK, map[string]string{"message": "Newsletter subscription successful"})
}

func (h *ContentHandler) ContactUs(c *gin.Context) {
	var req ContactRequest
	if !response.BindJSON(c, &req) {
		return
	}

	if err := h.usecase.SendContactMessage(c.Request.Context(), req.FullName, req.Email, req.Reason, req.Message); err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, map[string]string{"message": "Message sent successfully"})
}

func (h *ContentHandler) ListAuditLogs(c *gin.Context) {
	h.listAuditLogs(c, c.Query("resource"))
}

func (h *ContentHandler) ListNewsAuditLogs(c *gin.Context) {
	h.listAuditLogs(c, "news")
}

func (h *ContentHandler) ListCareersAuditLogs(c *gin.Context) {
	h.listAuditLogs(c, "careers")
}

func (h *ContentHandler) listAuditLogs(c *gin.Context, resource string) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	logs, total, err := h.usecase.ListAuditLogs(c.Request.Context(), page, limit, resource)
	if err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusOK, map[string]interface{}{
		"logs":     logs,
		"total":    total,
		"resource": resource,
	})
}

func (h *ContentHandler) GetNewsSettings(c *gin.Context) {
	limit, message, err := h.usecase.GetNewsSettings(c.Request.Context())
	if err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusOK, map[string]interface{}{
		"homepageLimit": limit,
		"emptyMessage":  message,
	})
}

func (h *ContentHandler) UpdateNewsSettings(c *gin.Context) {
	var req UpdateNewsSettingsRequest
	if !response.BindJSON(c, &req) {
		return
	}
	if req.HomepageLimit == nil && req.EmptyMessage == nil {
		response.Error(c, http.StatusBadRequest, "provide homepageLimit and/or emptyMessage")
		return
	}

	if err := h.usecase.UpdateNewsSettings(c.Request.Context(), req.HomepageLimit, req.EmptyMessage); err != nil {
		response.FromError(c, err)
		return
	}

	limit, message, _ := h.usecase.GetNewsSettings(c.Request.Context())
	response.Success(c, http.StatusOK, map[string]interface{}{
		"homepageLimit": limit,
		"emptyMessage":  message,
	})
}

func (h *ContentHandler) ListSubscribers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	subs, total, err := h.usecase.ListSubscribers(c.Request.Context(), page, limit)
	if err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusOK, map[string]interface{}{
		"subscribers": subs,
		"total":       total,
	})
}
