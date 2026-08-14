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

type UserRepository interface {
	Create(ctx context.Context, user *User) error
	GetByID(ctx context.Context, id uuid.UUID) (*User, error)
	GetByEmail(ctx context.Context, email string) (*User, error)
	ListAll(ctx context.Context) ([]User, error)
}

type AuthUsecase interface {
	Register(ctx context.Context, fullName, email, password string, role Role) (*User, error)
	Login(ctx context.Context, email, password string) (string, *User, error)
	GetProfile(ctx context.Context, id uuid.UUID) (*User, error)
	
}