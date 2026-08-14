package http

import (
	"net/http"

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