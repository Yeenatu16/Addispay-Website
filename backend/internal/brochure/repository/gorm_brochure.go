package repository

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/addispay/backend/internal/brochure/domain"
)

type brochureRepository struct {
	db *gorm.DB
}

func NewBrochureRepository(db *gorm.DB) domain.BrochureRepository {
	return &brochureRepository{db: db}
}

func (r *brochureRepository) Create(ctx context.Context, img *domain.BrochureImage) error {
	return r.db.WithContext(ctx).Create(img).Error
}

func (r *brochureRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.BrochureImage, error) {
	var img domain.BrochureImage
	if err := r.db.WithContext(ctx).First(&img, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &img, nil
}

func (r *brochureRepository) ListPublished(ctx context.Context) ([]domain.BrochureImage, error) {
	var imgs []domain.BrochureImage
	err := r.db.WithContext(ctx).
		Where("is_published = ?", true).
		Order("sort_order ASC, created_at ASC").
		Find(&imgs).Error
	return imgs, err
}

func (r *brochureRepository) ListAll(ctx context.Context) ([]domain.BrochureImage, error) {
	var imgs []domain.BrochureImage
	err := r.db.WithContext(ctx).
		Order("sort_order ASC, created_at ASC").
		Find(&imgs).Error
	return imgs, err
}

func (r *brochureRepository) Update(ctx context.Context, img *domain.BrochureImage) error {
	return r.db.WithContext(ctx).Save(img).Error
}

func (r *brochureRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.BrochureImage{}, "id = ?", id).Error
}
