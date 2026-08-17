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

const (
	SettingHomepageNewsLimit = "news.homepage_limit"
	SettingNewsEmptyMessage  = "news.empty_message"
)

type SiteSetting struct {
	Key       string    `gorm:"type:varchar(100);primaryKey" json:"key"`
	Value     string    `gorm:"type:text;not null" json:"value"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type ContentRepository interface {
	SubscribeNewsletter(ctx context.Context, email string) error
	SaveContactMessage(ctx context.Context, msg *ContactMessage) error
	CreateAuditLog(ctx context.Context, log *AuditLog) error
	ListAuditLogs(ctx context.Context, limit, offset int, resource string) ([]AuditLog, int64, error)

	GetSetting(ctx context.Context, key string) (*SiteSetting, error)
	UpsertSetting(ctx context.Context, key, value string) error
}

type ContentUsecase interface {
	Subscribe(ctx context.Context, email string) error
	SendContactMessage(ctx context.Context, fullName, email, reason, message string) error
	ListAuditLogs(ctx context.Context, page, limit int, resource string) ([]AuditLog, int64, error)
	GetNewsSettings(ctx context.Context) (homepageLimit int, emptyMessage string, err error)
	UpdateNewsSettings(ctx context.Context, homepageLimit *int, emptyMessage *string) error
}
