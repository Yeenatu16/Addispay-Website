package usecase

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"net/url"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"github.com/addispay/backend/internal/auth/domain"
)

const (
	resetTokenBytes   = 32
	resetTokenTTL     = time.Hour
	inviteTokenTTL    = 7 * 24 * time.Hour
	minPasswordLength = 8
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

// Register bootstraps the first Super Admin only. Later admins must be invited.
func (u *authUsecase) Register(ctx context.Context, fullName, email, password string, role domain.Role) (*domain.User, error) {
	email = strings.TrimSpace(strings.ToLower(email))
	count, err := u.repo.Count(ctx)
	if err != nil {
		return nil, err
	}
	if count > 0 {
		return nil, errors.New("public registration is disabled; ask a Super Admin for an invitation")
	}
	if role != domain.RoleSuperAdmin {
		return nil, errors.New("the first account must be Super_Admin")
	}

	if len(password) < minPasswordLength {
		return nil, fmt.Errorf("password must be at least %d characters", minPasswordLength)
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		FullName:     fullName,
		Email:        email,
		PasswordHash: string(hashedPassword),
		Role:         domain.RoleSuperAdmin,
		IsActive:     true,
	}

	if err := u.repo.Create(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}

func (u *authUsecase) Login(ctx context.Context, email, password string) (string, *domain.User, error) {
	email = strings.TrimSpace(strings.ToLower(email))
	user, err := u.repo.GetByEmail(ctx, email)
	if err != nil {
		return "", nil, errors.New("invalid email or password")
	}
	if !user.IsActive {
		return "", nil, errors.New("account access has been revoked")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", nil, errors.New("invalid email or password")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   user.ID.String(),
		"email": user.Email,
		"role":  string(user.Role),
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(u.jwtSecret))
	if err != nil {
		return "", nil, err
	}

	return tokenString, user, nil
}

func (u *authUsecase) GetProfile(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	return u.repo.GetByID(ctx, id)
}

func (u *authUsecase) ForgotPassword(ctx context.Context, email string) error {
	email = strings.TrimSpace(strings.ToLower(email))
	if email == "" {
		return errors.New("email is required")
	}

	user, err := u.repo.GetByEmail(ctx, email)
	if err != nil || user == nil || !user.IsActive {
		return nil
	}

	rawToken, err := generateSecureToken()
	if err != nil {
		return err
	}

	if err := u.repo.InvalidateActiveResetTokens(ctx, user.ID); err != nil {
		return err
	}

	resetToken := &domain.PasswordResetToken{
		UserID:    user.ID,
		TokenHash: hashToken(rawToken),
		ExpiresAt: time.Now().Add(resetTokenTTL),
	}
	if err := u.repo.CreatePasswordResetToken(ctx, resetToken); err != nil {
		return err
	}

	resetURL := u.buildURL("/reset-password", rawToken)
	return u.mailer.SendPasswordReset(ctx, user.Email, user.FullName, resetURL)
}

func (u *authUsecase) ResetPassword(ctx context.Context, token, newPassword string) error {
	token = strings.TrimSpace(token)
	if token == "" {
		return errors.New("reset token is required")
	}
	if len(newPassword) < minPasswordLength {
		return fmt.Errorf("password must be at least %d characters", minPasswordLength)
	}

	stored, err := u.repo.GetValidPasswordResetToken(ctx, hashToken(token))
	if err != nil {
		return errors.New("invalid or expired reset token")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	if err := u.repo.UpdatePassword(ctx, stored.UserID, string(hashedPassword)); err != nil {
		return err
	}

	if err := u.repo.MarkPasswordResetTokenUsed(ctx, stored.ID); err != nil {
		return err
	}

	_ = u.repo.InvalidateActiveResetTokens(ctx, stored.UserID)
	return nil
}

func (u *authUsecase) InviteAdmin(ctx context.Context, invitedBy uuid.UUID, email string, role domain.Role) (*domain.AdminInvitation, error) {
	email = strings.TrimSpace(strings.ToLower(email))
	if email == "" {
		return nil, errors.New("email is required")
	}
	if !role.IsInvitable() {
		return nil, errors.New("only Marketer and HR roles can be invited")
	}

	if existing, err := u.repo.GetByEmail(ctx, email); err == nil && existing != nil {
		return nil, errors.New("a user with this email already exists")
	}

	rawToken, err := generateSecureToken()
	if err != nil {
		return nil, err
	}

	if err := u.repo.InvalidatePendingInvitations(ctx, email); err != nil {
		return nil, err
	}

	invite := &domain.AdminInvitation{
		Email:       email,
		Role:        role,
		TokenHash:   hashToken(rawToken),
		InvitedByID: invitedBy,
		ExpiresAt:   time.Now().Add(inviteTokenTTL),
	}
	if err := u.repo.CreateInvitation(ctx, invite); err != nil {
		return nil, err
	}

	inviteURL := u.buildURL("/accept-invitation", rawToken)
	if err := u.mailer.SendAdminInvitation(ctx, email, role, inviteURL); err != nil {
		// The invitee never received the token, so keep no pending invitation behind.
		_ = u.repo.RevokeInvitation(ctx, invite.ID)
		return nil, fmt.Errorf("could not send the invitation email: %w", err)
	}

	return invite, nil
}

func (u *authUsecase) GetInvitationByToken(ctx context.Context, token string) (*domain.AdminInvitation, error) {
	token = strings.TrimSpace(token)
	if token == "" {
		return nil, errors.New("invitation token is required")
	}
	invite, err := u.repo.GetValidInvitationByTokenHash(ctx, hashToken(token))
	if err != nil {
		return nil, errors.New("invalid or expired invitation")
	}
	return invite, nil
}

func (u *authUsecase) AcceptInvitation(ctx context.Context, token, fullName, password string) (*domain.User, error) {
	token = strings.TrimSpace(token)
	fullName = strings.TrimSpace(fullName)
	if token == "" {
		return nil, errors.New("invitation token is required")
	}
	if fullName == "" {
		return nil, errors.New("full name is required")
	}
	if len(password) < minPasswordLength {
		return nil, fmt.Errorf("password must be at least %d characters", minPasswordLength)
	}

	invite, err := u.repo.GetValidInvitationByTokenHash(ctx, hashToken(token))
	if err != nil {
		return nil, errors.New("invalid or expired invitation")
	}

	if existing, err := u.repo.GetByEmail(ctx, invite.Email); err == nil && existing != nil {
		return nil, errors.New("a user with this email already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		Email:        invite.Email,
		FullName:     fullName,
		PasswordHash: string(hashedPassword),
		Role:         invite.Role,
		IsActive:     true,
	}
	if err := u.repo.Create(ctx, user); err != nil {
		return nil, err
	}

	if err := u.repo.MarkInvitationAccepted(ctx, invite.ID); err != nil {
		return nil, err
	}

	return user, nil
}

func (u *authUsecase) ListPendingInvitations(ctx context.Context) ([]domain.AdminInvitation, error) {
	return u.repo.ListPendingInvitations(ctx)
}

func (u *authUsecase) CancelInvitation(ctx context.Context, invitationID uuid.UUID) error {
	invite, err := u.repo.GetInvitationByID(ctx, invitationID)
	if err != nil {
		return errors.New("invitation not found")
	}
	if !invite.IsPending() {
		return errors.New("invitation is no longer pending")
	}
	return u.repo.RevokeInvitation(ctx, invitationID)
}

func (u *authUsecase) ListAdministrators(ctx context.Context) ([]domain.User, error) {
	return u.repo.ListAll(ctx)
}

func (u *authUsecase) RevokeAdministrator(ctx context.Context, actorID, targetID uuid.UUID) error {
	if actorID == targetID {
		return errors.New("you cannot revoke your own access")
	}

	target, err := u.repo.GetByID(ctx, targetID)
	if err != nil {
		return errors.New("user not found")
	}
	if target.Role == domain.RoleSuperAdmin {
		return errors.New("cannot revoke a Super Admin")
	}
	if !target.IsActive {
		return errors.New("user access is already revoked")
	}

	return u.repo.SetActive(ctx, targetID, false)
}

func (u *authUsecase) RestoreAdministrator(ctx context.Context, actorID, targetID uuid.UUID) error {
	if actorID == targetID {
		return errors.New("invalid restore target")
	}

	target, err := u.repo.GetByID(ctx, targetID)
	if err != nil {
		return errors.New("user not found")
	}
	if target.Role == domain.RoleSuperAdmin {
		return errors.New("cannot change Super Admin status this way")
	}
	if target.IsActive {
		return errors.New("user access is already active")
	}

	return u.repo.SetActive(ctx, targetID, true)
}

func (u *authUsecase) buildURL(path, rawToken string) string {
	base := u.frontendURL
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
