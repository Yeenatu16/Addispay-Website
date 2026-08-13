package repository

import (
	"context"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"github.com/addispay/backend/internal/content/domain"
)

type contentRepository struct {
	db *gorm.DB
}

func NewContentRepository(db *gorm.DB) domain.ContentRepository {
	return &contentRepository{db: db}
}

func (r *contentRepository) SubscribeNewsletter(ctx context.Context, email string) error {
	sub := domain.NewsletterSubscriber{Email: email, IsSubscribed: true}
	return r.db.WithContext(ctx).Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "email"}},
		DoUpdates: clause.Assignments(map[string]interface{}{"is_subscribed": true}),
	}).Create(&sub).Error
}

func (r *contentRepository) SaveContactMessage(ctx context.Context, msg *domain.ContactMessage) error {
	return r.db.WithContext(ctx).Create(msg).Error
}

func (r *contentRepository) CreateAuditLog(ctx context.Context, log *domain.AuditLog) error {
	return r.db.WithContext(ctx).Create(log).Error
}