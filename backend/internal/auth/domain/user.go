package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type Role string

const (
	RoleSuperAdmin Role = "Super_Admin"
	RoleMarketer   Role = "Marketer"
	RoleHR         Role = "HR"
)

func (r Role) IsInvitable() bool {
	return r == RoleMarketer || r == RoleHR
}

func (r Role) IsValid() bool {
	switch r {
	case RoleSuperAdmin, RoleMarketer, RoleHR:
		return true
	default:
		return false
	}
}

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Email        string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	PasswordHash string    `gorm:"type:varchar(255);not null" json:"-"`
	FullName     string    `gorm:"type:varchar(255);not null" json:"fullName"`
	Role         Role      `gorm:"type:varchar(50);not null;default:'Marketer'" json:"role"`
	IsActive     bool      `gorm:"default:true" json:"isActive"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// PasswordResetToken stores a hashed, single-use reset token.
type PasswordResetToken struct {
	ID        uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID    uuid.UUID  `gorm:"type:uuid;not null;index" json:"userId"`
	TokenHash string     `gorm:"type:varchar(64);uniqueIndex;not null" json:"-"`
	ExpiresAt time.Time  `gorm:"not null;index" json:"expiresAt"`
	UsedAt    *time.Time `json:"usedAt,omitempty"`
	CreatedAt time.Time  `json:"createdAt"`
}

// AdminInvitation is sent by Super Admin so Marketer/HR can create their account.
type AdminInvitation struct {
	ID          uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Email       string     `gorm:"type:varchar(255);not null;index" json:"email"`
	Role        Role       `gorm:"type:varchar(50);not null" json:"role"`
	TokenHash   string     `gorm:"type:varchar(64);uniqueIndex;not null" json:"-"`
	InvitedByID uuid.UUID  `gorm:"type:uuid;not null;index" json:"invitedById"`
	ExpiresAt   time.Time  `gorm:"not null;index" json:"expiresAt"`
	AcceptedAt  *time.Time `json:"acceptedAt,omitempty"`
	RevokedAt   *time.Time `json:"revokedAt,omitempty"`
	CreatedAt   time.Time  `json:"createdAt"`
}

func (i *AdminInvitation) IsPending() bool {
	return i.AcceptedAt == nil && i.RevokedAt == nil && time.Now().Before(i.ExpiresAt)
}

type UserRepository interface {
	Create(ctx context.Context, user *User) error
	GetByID(ctx context.Context, id uuid.UUID) (*User, error)
	GetByEmail(ctx context.Context, email string) (*User, error)
	ListAll(ctx context.Context) ([]User, error)
	Count(ctx context.Context) (int64, error)
	UpdatePassword(ctx context.Context, userID uuid.UUID, passwordHash string) error
	SetActive(ctx context.Context, userID uuid.UUID, isActive bool) error

	CreatePasswordResetToken(ctx context.Context, token *PasswordResetToken) error
	InvalidateActiveResetTokens(ctx context.Context, userID uuid.UUID) error
	GetValidPasswordResetToken(ctx context.Context, tokenHash string) (*PasswordResetToken, error)
	MarkPasswordResetTokenUsed(ctx context.Context, tokenID uuid.UUID) error

	CreateInvitation(ctx context.Context, invite *AdminInvitation) error
	InvalidatePendingInvitations(ctx context.Context, email string) error
	GetValidInvitationByTokenHash(ctx context.Context, tokenHash string) (*AdminInvitation, error)
	GetInvitationByID(ctx context.Context, id uuid.UUID) (*AdminInvitation, error)
	MarkInvitationAccepted(ctx context.Context, id uuid.UUID) error
	RevokeInvitation(ctx context.Context, id uuid.UUID) error
	ListPendingInvitations(ctx context.Context) ([]AdminInvitation, error)
}

// Mailer delivers auth-related emails.
type Mailer interface {
	SendPasswordReset(ctx context.Context, toEmail, fullName, resetURL string) error
	SendAdminInvitation(ctx context.Context, toEmail string, role Role, inviteURL string) error
}

type AuthUsecase interface {
	Register(ctx context.Context, fullName, email, password string, role Role) (*User, error)
	Login(ctx context.Context, email, password string) (string, *User, error)
	GetProfile(ctx context.Context, id uuid.UUID) (*User, error)
	ForgotPassword(ctx context.Context, email string) error
	ResetPassword(ctx context.Context, token, newPassword string) error

	InviteAdmin(ctx context.Context, invitedBy uuid.UUID, email string, role Role) (*AdminInvitation, error)
	AcceptInvitation(ctx context.Context, token, fullName, password string) (*User, error)
	GetInvitationByToken(ctx context.Context, token string) (*AdminInvitation, error)
	ListPendingInvitations(ctx context.Context) ([]AdminInvitation, error)
	CancelInvitation(ctx context.Context, invitationID uuid.UUID) error
	ListAdministrators(ctx context.Context) ([]User, error)
	RevokeAdministrator(ctx context.Context, actorID, targetID uuid.UUID) error
	RestoreAdministrator(ctx context.Context, actorID, targetID uuid.UUID) error
}
