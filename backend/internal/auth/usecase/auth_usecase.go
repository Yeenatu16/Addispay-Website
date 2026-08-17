package usecase

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/url"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"github.com/addispay/backend/internal/apperr"
	"github.com/addispay/backend/internal/auth/domain"
	"github.com/addispay/backend/internal/sanitize"
	"github.com/addispay/backend/internal/validate"
)

const (
	resetTokenBytes = 32
	resetTokenTTL   = time.Hour
	inviteTokenTTL  = 7 * 24 * time.Hour
	jwtTTL          = 4 * time.Hour
)

type authUsecase struct {
	repo        domain.UserRepository
	mailer      domain.Mailer
	jwtSecret   string
	frontendURL string
}

func NewAuthUsecase(repo domain.UserRepository, mailer domain.Mailer, jwtSecret, frontendURL string) domain.AuthUsecase {
	return &authUsecase{
		repo:        repo,
		mailer:      mailer,
		jwtSecret:   jwtSecret,
		frontendURL: strings.TrimRight(frontendURL, "/"),
	}
}

func (u *authUsecase) Register(ctx context.Context, fullName, email, password string, role domain.Role) (*domain.User, error) {
	fullName = sanitize.Text(fullName)
	if err := validate.Required(fullName, "fullName"); err != nil {
		return nil, err
	}
	if err := validate.MaxLen(fullName, "fullName", validate.MaxName); err != nil {
		return nil, err
	}
	email, err := validate.Email(email)
	if err != nil {
		return nil, err
	}
	if err := validate.Password(password); err != nil {
		return nil, err
	}

	count, err := u.repo.Count(ctx)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if count > 0 {
		return nil, apperr.BadRequest("public registration is disabled; ask a Super Admin for an invitation")
	}
	if role != domain.RoleSuperAdmin {
		return nil, apperr.BadRequest("the first account must be Super_Admin")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	user := &domain.User{
		FullName:     fullName,
		Email:        email,
		PasswordHash: string(hashedPassword),
		Role:         domain.RoleSuperAdmin,
		IsActive:     true,
	}
	if err := u.repo.Create(ctx, user); err != nil {
		return nil, apperr.Internal(err)
	}
	return user, nil
}

func (u *authUsecase) Login(ctx context.Context, email, password string) (string, *domain.User, error) {
	email, err := validate.Email(email)
	if err != nil {
		return "", nil, apperr.Unauthorized("invalid email or password")
	}
	if strings.TrimSpace(password) == "" {
		return "", nil, apperr.Unauthorized("invalid email or password")
	}

	user, err := u.repo.GetByEmail(ctx, email)
	if err != nil {
		return "", nil, apperr.Unauthorized("invalid email or password")
	}
	if !user.IsActive {
		return "", nil, apperr.Unauthorized("account access has been revoked")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", nil, apperr.Unauthorized("invalid email or password")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   user.ID.String(),
		"email": user.Email,
		"role":  string(user.Role),
		"exp":   time.Now().Add(jwtTTL).Unix(),
	})
	tokenString, err := token.SignedString([]byte(u.jwtSecret))
	if err != nil {
		return "", nil, apperr.Internal(err)
	}
	return tokenString, user, nil
}

func (u *authUsecase) GetProfile(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	user, err := u.repo.GetByID(ctx, id)
	if err != nil {
		return nil, apperr.NotFound("user not found")
	}
	return user, nil
}

func (u *authUsecase) ForgotPassword(ctx context.Context, email string) error {
	email, err := validate.Email(email)
	if err != nil {
		// Avoid email enumeration — treat invalid format as success after validation at HTTP layer.
		return nil
	}

	user, err := u.repo.GetByEmail(ctx, email)
	if err != nil || user == nil || !user.IsActive {
		return nil
	}

	rawToken, err := generateSecureToken()
	if err != nil {
		return apperr.Internal(err)
	}
	if err := u.repo.InvalidateActiveResetTokens(ctx, user.ID); err != nil {
		return apperr.Internal(err)
	}

	resetToken := &domain.PasswordResetToken{
		UserID:    user.ID,
		TokenHash: hashToken(rawToken),
		ExpiresAt: time.Now().Add(resetTokenTTL),
	}
	if err := u.repo.CreatePasswordResetToken(ctx, resetToken); err != nil {
		return apperr.Internal(err)
	}

	resetURL := u.buildURL("/admin/reset-password", rawToken)
	if err := u.mailer.SendPasswordReset(ctx, user.Email, user.FullName, resetURL); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (u *authUsecase) ResetPassword(ctx context.Context, token, newPassword string) error {
	token = strings.TrimSpace(token)
	if token == "" {
		return apperr.BadRequest("reset token is required")
	}
	if err := validate.Password(newPassword); err != nil {
		return err
	}

	stored, err := u.repo.GetValidPasswordResetToken(ctx, hashToken(token))
	if err != nil {
		return apperr.BadRequest("invalid or expired reset token")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return apperr.Internal(err)
	}
	if err := u.repo.UpdatePassword(ctx, stored.UserID, string(hashedPassword)); err != nil {
		return apperr.Internal(err)
	}
	if err := u.repo.MarkPasswordResetTokenUsed(ctx, stored.ID); err != nil {
		return apperr.Internal(err)
	}
	_ = u.repo.InvalidateActiveResetTokens(ctx, stored.UserID)
	return nil
}

func (u *authUsecase) InviteAdmin(ctx context.Context, invitedBy uuid.UUID, email string, role domain.Role) (*domain.AdminInvitation, error) {
	email, err := validate.Email(email)
	if err != nil {
		return nil, err
	}
	if !role.IsInvitable() {
		return nil, apperr.BadRequest("only Marketer and HR roles can be invited")
	}
	if existing, err := u.repo.GetByEmail(ctx, email); err == nil && existing != nil {
		return nil, apperr.Conflict("a user with this email already exists")
	}

	rawToken, err := generateSecureToken()
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if err := u.repo.InvalidatePendingInvitations(ctx, email); err != nil {
		return nil, apperr.Internal(err)
	}

	invite := &domain.AdminInvitation{
		Email:       email,
		Role:        role,
		TokenHash:   hashToken(rawToken),
		InvitedByID: invitedBy,
		ExpiresAt:   time.Now().Add(inviteTokenTTL),
	}
	if err := u.repo.CreateInvitation(ctx, invite); err != nil {
		return nil, apperr.Internal(err)
	}

	inviteURL := u.buildURL("/admin/accept-invitation", rawToken)
	if err := u.mailer.SendAdminInvitation(ctx, email, role, inviteURL); err != nil {
		_ = u.repo.RevokeInvitation(ctx, invite.ID)
		return nil, apperr.BadRequest("could not send the invitation email; check SMTP configuration")
	}
	return invite, nil
}

func (u *authUsecase) GetInvitationByToken(ctx context.Context, token string) (*domain.AdminInvitation, error) {
	token = strings.TrimSpace(token)
	if token == "" {
		return nil, apperr.BadRequest("invitation token is required")
	}
	invite, err := u.repo.GetValidInvitationByTokenHash(ctx, hashToken(token))
	if err != nil {
		return nil, apperr.BadRequest("invalid or expired invitation")
	}
	return invite, nil
}

func (u *authUsecase) AcceptInvitation(ctx context.Context, token, fullName, password string) (*domain.User, error) {
	token = strings.TrimSpace(token)
	fullName = sanitize.Text(fullName)
	if token == "" {
		return nil, apperr.BadRequest("invitation token is required")
	}
	if err := validate.Required(fullName, "fullName"); err != nil {
		return nil, err
	}
	if err := validate.MaxLen(fullName, "fullName", validate.MaxName); err != nil {
		return nil, err
	}
	if err := validate.Password(password); err != nil {
		return nil, err
	}

	invite, err := u.repo.GetValidInvitationByTokenHash(ctx, hashToken(token))
	if err != nil {
		return nil, apperr.BadRequest("invalid or expired invitation")
	}
	if existing, err := u.repo.GetByEmail(ctx, invite.Email); err == nil && existing != nil {
		return nil, apperr.Conflict("a user with this email already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	user := &domain.User{
		Email:        invite.Email,
		FullName:     fullName,
		PasswordHash: string(hashedPassword),
		Role:         invite.Role,
		IsActive:     true,
	}
	if err := u.repo.Create(ctx, user); err != nil {
		return nil, apperr.Internal(err)
	}
	if err := u.repo.MarkInvitationAccepted(ctx, invite.ID); err != nil {
		return nil, apperr.Internal(err)
	}
	return user, nil
}

func (u *authUsecase) ListPendingInvitations(ctx context.Context) ([]domain.AdminInvitation, error) {
	invites, err := u.repo.ListPendingInvitations(ctx)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return invites, nil
}

func (u *authUsecase) CancelInvitation(ctx context.Context, invitationID uuid.UUID) error {
	invite, err := u.repo.GetInvitationByID(ctx, invitationID)
	if err != nil {
		return apperr.NotFound("invitation not found")
	}
	if !invite.IsPending() {
		return apperr.BadRequest("invitation is no longer pending")
	}
	if err := u.repo.RevokeInvitation(ctx, invitationID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (u *authUsecase) ListAdministrators(ctx context.Context) ([]domain.User, error) {
	users, err := u.repo.ListAll(ctx)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return users, nil
}

func (u *authUsecase) RevokeAdministrator(ctx context.Context, actorID, targetID uuid.UUID) error {
	if actorID == targetID {
		return apperr.BadRequest("you cannot revoke your own access")
	}
	target, err := u.repo.GetByID(ctx, targetID)
	if err != nil {
		return apperr.NotFound("user not found")
	}
	if target.Role == domain.RoleSuperAdmin {
		return apperr.BadRequest("cannot revoke a Super Admin")
	}
	if !target.IsActive {
		return apperr.BadRequest("user access is already revoked")
	}
	if err := u.repo.SetActive(ctx, targetID, false); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (u *authUsecase) RestoreAdministrator(ctx context.Context, actorID, targetID uuid.UUID) error {
	if actorID == targetID {
		return apperr.BadRequest("invalid restore target")
	}
	target, err := u.repo.GetByID(ctx, targetID)
	if err != nil {
		return apperr.NotFound("user not found")
	}
	if target.Role == domain.RoleSuperAdmin {
		return apperr.BadRequest("cannot change Super Admin status this way")
	}
	if target.IsActive {
		return apperr.BadRequest("user access is already active")
	}
	if err := u.repo.SetActive(ctx, targetID, true); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (u *authUsecase) buildURL(path, rawToken string) string {
	base := strings.TrimRight(u.frontendURL, "/")
	if base == "" {
		base = "http://localhost:3000"
	}
	return fmt.Sprintf("%s%s?token=%s", base, path, url.QueryEscape(rawToken))
}

func generateSecureToken() (string, error) {
	buf := make([]byte, resetTokenBytes)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return hex.EncodeToString(buf), nil
}

func hashToken(raw string) string {
	sum := sha256.Sum256([]byte(raw))
	return hex.EncodeToString(sum[:])
}
