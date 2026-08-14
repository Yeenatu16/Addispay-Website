package http

import (
	"net/http"
	"strings"

	"github.com/addispay/backend/internal/auth/domain"
	"github.com/addispay/backend/internal/response"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AuthHandler struct {
	usecase domain.AuthUsecase
}

func NewAuthHandler(usecase domain.AuthUsecase) *AuthHandler {
	return &AuthHandler{usecase: usecase}
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	FullName string      `json:"fullName"`
	Email    string      `json:"email"`
	Password string      `json:"password"`
	Role     domain.Role `json:"role"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token"`
	NewPassword string `json:"newPassword"`
}

type InviteAdminRequest struct {
	Email string      `json:"email"`
	Role  domain.Role `json:"role"`
}

type AcceptInvitationRequest struct {
	Token    string `json:"token"`
	FullName string `json:"fullName"`
	Password string `json:"password"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	token, user, err := h.usecase.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, err.Error())
		return
	}

	response.Success(c, http.StatusOK, map[string]interface{}{
		"token": token,
		"user":  user,
	})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	user, err := h.usecase.Register(c.Request.Context(), req.FullName, req.Email, req.Password, req.Role)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, user)
}

func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if strings.TrimSpace(req.Email) == "" {
		response.Error(c, http.StatusBadRequest, "email is required")
		return
	}

	if err := h.usecase.ForgotPassword(c.Request.Context(), req.Email); err != nil {
		response.Error(c, http.StatusInternalServerError, "Unable to process password reset request")
		return
	}

	response.Success(c, http.StatusOK, map[string]string{
		"message": "If an account exists for that email, a password reset link has been sent",
	})
}

func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.usecase.ResetPassword(c.Request.Context(), req.Token, req.NewPassword); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusOK, map[string]string{
		"message": "Password has been reset successfully",
	})
}

func (h *AuthHandler) InviteAdmin(c *gin.Context) {
	actorID, ok := currentUserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	var req InviteAdminRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	invite, err := h.usecase.InviteAdmin(c.Request.Context(), actorID, req.Email, req.Role)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, invite)
}

func (h *AuthHandler) ListInvitations(c *gin.Context) {
	invites, err := h.usecase.ListPendingInvitations(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, invites)
}

func (h *AuthHandler) CancelInvitation(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid invitation ID")
		return
	}

	if err := h.usecase.CancelInvitation(c.Request.Context(), id); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusOK, map[string]string{
		"message": "Invitation cancelled",
	})
}

func (h *AuthHandler) GetInvitation(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		token = c.Param("token")
	}

	invite, err := h.usecase.GetInvitationByToken(c.Request.Context(), token)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusOK, map[string]interface{}{
		"email":     invite.Email,
		"role":      invite.Role,
		"expiresAt": invite.ExpiresAt,
	})
}

func (h *AuthHandler) AcceptInvitation(c *gin.Context) {
	var req AcceptInvitationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	user, err := h.usecase.AcceptInvitation(c.Request.Context(), req.Token, req.FullName, req.Password)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, user)
}

func (h *AuthHandler) ListAdministrators(c *gin.Context) {
	users, err := h.usecase.ListAdministrators(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, users)
}

func (h *AuthHandler) RevokeAdministrator(c *gin.Context) {
	actorID, ok := currentUserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	targetID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	if err := h.usecase.RevokeAdministrator(c.Request.Context(), actorID, targetID); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusOK, map[string]string{
		"message": "Administrator access revoked",
	})
}

func (h *AuthHandler) RestoreAdministrator(c *gin.Context) {
	actorID, ok := currentUserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	targetID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	if err := h.usecase.RestoreAdministrator(c.Request.Context(), actorID, targetID); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusOK, map[string]string{
		"message": "Administrator access restored",
	})
}

func currentUserID(c *gin.Context) (uuid.UUID, bool) {
	raw, exists := c.Get(string(UserIDKey))
	if !exists {
		return uuid.Nil, false
	}
	id, err := uuid.Parse(raw.(string))
	if err != nil {
		return uuid.Nil, false
	}
	return id, true
}
