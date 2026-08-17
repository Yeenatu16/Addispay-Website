package repository

import (
	"context"
	"time"

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

func (r *contentRepository) ListAuditLogs(ctx context.Context, limit, offset int, resource string) ([]domain.AuditLog, int64, error) {
	var logs []domain.AuditLog
	var total int64
	q := r.db.WithContext(ctx).Model(&domain.AuditLog{})
	if resource != "" {
		q = q.Where("resource = ?", resource)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := q.Order("created_at DESC").Limit(limit).Offset(offset).Find(&logs).Error
	return logs, total, err
}

func (r *contentRepository) GetSetting(ctx context.Context, key string) (*domain.SiteSetting, error) {
	var setting domain.SiteSetting
	if err := r.db.WithContext(ctx).First(&setting, "key = ?", key).Error; err != nil {
		return nil, err
	}
	return &setting, nil
}

func (r *contentRepository) UpsertSetting(ctx context.Context, key, value string) error {
	setting := domain.SiteSetting{
		Key:       key,
		Value:     value,
		UpdatedAt: time.Now(),
	}
	return r.db.WithContext(ctx).Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "key"}},
		DoUpdates: clause.AssignmentColumns([]string{"value", "updated_at"}),
	}).Create(&setting).Error
}
