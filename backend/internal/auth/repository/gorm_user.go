package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/addispay/backend/internal/auth/domain"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) domain.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *domain.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *userRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	var user domain.User
	if err := r.db.WithContext(ctx).First(&user, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	var user domain.User
	if err := r.db.WithContext(ctx).Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) ListAll(ctx context.Context) ([]domain.User, error) {
	var users []domain.User
	err := r.db.WithContext(ctx).Order("created_at DESC").Find(&users).Error
	return users, err
}

func (r *userRepository) Count(ctx context.Context) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&domain.User{}).Count(&count).Error
	return count, err
}

func (r *userRepository) UpdatePassword(ctx context.Context, userID uuid.UUID, passwordHash string) error {
	return r.db.WithContext(ctx).
		Model(&domain.User{}).
		Where("id = ?", userID).
		Update("password_hash", passwordHash).Error
}

func (r *userRepository) SetActive(ctx context.Context, userID uuid.UUID, isActive bool) error {
	return r.db.WithContext(ctx).
		Model(&domain.User{}).
		Where("id = ?", userID).
		Update("is_active", isActive).Error
}

func (r *userRepository) CreatePasswordResetToken(ctx context.Context, token *domain.PasswordResetToken) error {
	return r.db.WithContext(ctx).Create(token).Error
}

func (r *userRepository) InvalidateActiveResetTokens(ctx context.Context, userID uuid.UUID) error {
	now := time.Now()
	return r.db.WithContext(ctx).
		Model(&domain.PasswordResetToken{}).
		Where("user_id = ? AND used_at IS NULL", userID).
		Update("used_at", now).Error
}

func (r *userRepository) GetValidPasswordResetToken(ctx context.Context, tokenHash string) (*domain.PasswordResetToken, error) {
	var token domain.PasswordResetToken
	err := r.db.WithContext(ctx).
		Where("token_hash = ? AND used_at IS NULL AND expires_at > ?", tokenHash, time.Now()).
		First(&token).Error
	if err != nil {
		return nil, err
	}
	return &token, nil
}

func (r *userRepository) MarkPasswordResetTokenUsed(ctx context.Context, tokenID uuid.UUID) error {
	now := time.Now()
	return r.db.WithContext(ctx).
		Model(&domain.PasswordResetToken{}).
		Where("id = ?", tokenID).
		Update("used_at", now).Error
}

func (r *userRepository) CreateInvitation(ctx context.Context, invite *domain.AdminInvitation) error {
	return r.db.WithContext(ctx).Create(invite).Error
}

func (r *userRepository) InvalidatePendingInvitations(ctx context.Context, email string) error {
	now := time.Now()
	return r.db.WithContext(ctx).
		Model(&domain.AdminInvitation{}).
		Where("email = ? AND accepted_at IS NULL AND revoked_at IS NULL", email).
		Update("revoked_at", now).Error
}

func (r *userRepository) GetValidInvitationByTokenHash(ctx context.Context, tokenHash string) (*domain.AdminInvitation, error) {
	var invite domain.AdminInvitation
	err := r.db.WithContext(ctx).
		Where(
			"token_hash = ? AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?",
			tokenHash,
			time.Now(),
		).
		First(&invite).Error
	if err != nil {
		return nil, err
	}
	return &invite, nil
}

func (r *userRepository) GetInvitationByID(ctx context.Context, id uuid.UUID) (*domain.AdminInvitation, error) {
	var invite domain.AdminInvitation
	if err := r.db.WithContext(ctx).First(&invite, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &invite, nil
}

func (r *userRepository) MarkInvitationAccepted(ctx context.Context, id uuid.UUID) error {
	now := time.Now()
	return r.db.WithContext(ctx).
		Model(&domain.AdminInvitation{}).
		Where("id = ?", id).
		Update("accepted_at", now).Error
}

func (r *userRepository) RevokeInvitation(ctx context.Context, id uuid.UUID) error {
	now := time.Now()
	return r.db.WithContext(ctx).
		Model(&domain.AdminInvitation{}).
		Where("id = ? AND accepted_at IS NULL AND revoked_at IS NULL", id).
		Update("revoked_at", now).Error
}

func (r *userRepository) ListPendingInvitations(ctx context.Context) ([]domain.AdminInvitation, error) {
	var invites []domain.AdminInvitation
	err := r.db.WithContext(ctx).
		Where("accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?", time.Now()).
		Order("created_at DESC").
		Find(&invites).Error
	return invites, err
}
