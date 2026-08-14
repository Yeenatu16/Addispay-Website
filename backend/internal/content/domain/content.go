package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type NewsletterSubscriber struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Email        string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	IsSubscribed bool      `gorm:"default:true" json:"isSubscribed"`
	SubscribedAt time.Time `json:"subscribedAt"`
}

type ContactMessage struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	FullName  string    `gorm:"type:varchar(255);not null" json:"fullName"`
	Email     string    `gorm:"type:varchar(255);not null" json:"email"`
	Reason    string    `gorm:"type:varchar(255);not null" json:"reason"`
	Message   string    `gorm:"type:text;not null" json:"message"`
	CreatedAt time.Time `json:"createdAt"`
}

type AuditLog struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null" json:"userId"`
	UserName  string    `gorm:"type:varchar(255);not null" json:"userName"`
	Action    string    `gorm:"type:varchar(100);not null" json:"action"`
	Resource  string    `gorm:"type:varchar(255);not null" json:"resource"`
	Details   string    `gorm:"type:text" json:"details"`
	CreatedAt time.Time `json:"createdAt"`
}

type ContentRepository interface {
	SubscribeNewsletter(ctx context.Context, email string) error
	SaveContactMessage(ctx context.Context, msg *ContactMessage) error
	CreateAuditLog(ctx context.Context, log *AuditLog) error
}

type ContentUsecase interface {
	Subscribe(ctx context.Context, email string) error
	SendContactMessage(ctx context.Context, fullName, email, reason, message string) error
}
