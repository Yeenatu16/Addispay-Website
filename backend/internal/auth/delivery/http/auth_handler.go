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
	Email    string `json:"email" binding:"required,email,max=255"`
	Password string `json:"password" binding:"required,min=1,max=128"`
}

type RegisterRequest struct {
	FullName string      `json:"fullName" binding:"required,max=255"`
	Email    string      `json:"email" binding:"required,email,max=255"`
	Password string      `json:"password" binding:"required,min=8,max=128"`
	Role     domain.Role `json:"role" binding:"required"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email,max=255"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required,min=8,max=128"`
}

type InviteAdminRequest struct {
	Email string      `json:"email" binding:"required,email,max=255"`
	Role  domain.Role `json:"role" binding:"required"`
}

type AcceptInvitationRequest struct {
	Token    string `json:"token" binding:"required"`
	FullName string `json:"fullName" binding:"required,max=255"`
	Password string `json:"password" binding:"required,min=8,max=128"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if !response.BindJSON(c, &req) {
		return
	}

	token, user, err := h.usecase.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusOK, map[string]interface{}{
		"token": token,
		"user":  user,
	})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if !response.BindJSON(c, &req) {
		return
	}

	user, err := h.usecase.Register(c.Request.Context(), req.FullName, req.Email, req.Password, req.Role)
	if err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, user)
}

func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if !response.BindJSON(c, &req) {
		return
	}

	if err := h.usecase.ForgotPassword(c.Request.Context(), req.Email); err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusOK, map[string]string{
		"message": "If an account exists for that email, a password reset link has been sent",
	})
}

func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if !response.BindJSON(c, &req) {
		return
	}

	if err := h.usecase.ResetPassword(c.Request.Context(), req.Token, req.NewPassword); err != nil {
		response.FromError(c, err)
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
	if !response.BindJSON(c, &req) {
		return
	}

	invite, err := h.usecase.InviteAdmin(c.Request.Context(), actorID, req.Email, req.Role)
	if err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, invite)
}

func (h *AuthHandler) ListInvitations(c *gin.Context) {
	invites, err := h.usecase.ListPendingInvitations(c.Request.Context())
	if err != nil {
		response.FromError(c, err)
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
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusOK, map[string]string{
		"message": "Invitation cancelled",
	})
}

func (h *AuthHandler) GetInvitation(c *gin.Context) {
	token := strings.TrimSpace(c.Query("token"))
	if token == "" {
		token = strings.TrimSpace(c.Param("token"))
	}

	invite, err := h.usecase.GetInvitationByToken(c.Request.Context(), token)
	if err != nil {
		response.FromError(c, err)
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
	if !response.BindJSON(c, &req) {
		return
	}

	user, err := h.usecase.AcceptInvitation(c.Request.Context(), req.Token, req.FullName, req.Password)
	if err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, user)
}

func (h *AuthHandler) ListAdministrators(c *gin.Context) {
	users, err := h.usecase.ListAdministrators(c.Request.Context())
	if err != nil {
		response.FromError(c, err)
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
		response.FromError(c, err)
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
		response.FromError(c, err)
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
