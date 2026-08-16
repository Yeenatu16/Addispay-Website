package repository

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/addispay/backend/internal/news/domain"
)

type newsRepository struct {
	db *gorm.DB
}

func NewNewsRepository(db *gorm.DB) domain.NewsRepository {
	return &newsRepository{db: db}
}

func (r *newsRepository) Create(ctx context.Context, article *domain.NewsArticle) error {
	return r.db.WithContext(ctx).Create(article).Error
}

func (r *newsRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.NewsArticle, error) {
	var article domain.NewsArticle
	if err := r.db.WithContext(ctx).First(&article, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &article, nil
}

func (r *newsRepository) GetBySlug(ctx context.Context, slug string) (*domain.NewsArticle, error) {
	var article domain.NewsArticle
	if err := r.db.WithContext(ctx).Where("slug = ?", slug).First(&article).Error; err != nil {
		return nil, err
	}
	return &article, nil
}

func (r *newsRepository) ListPublished(ctx context.Context, limit, offset int, search string) ([]domain.NewsArticle, int64, error) {
	var articles []domain.NewsArticle
	var total int64

	q := r.db.WithContext(ctx).Model(&domain.NewsArticle{}).Where("status = ?", domain.StatusPublished)
	if search != "" {
		like := "%" + search + "%"
		q = q.Where(
			"title ILIKE ? OR short_description ILIKE ? OR full_content ILIKE ?",
			like, like, like,
		)
	}

	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := q.Order("published_at DESC").Limit(limit).Offset(offset).Find(&articles).Error
	return articles, total, err
}

func (r *newsRepository) ListAdmin(ctx context.Context, filter domain.NewsListFilter) ([]domain.NewsArticle, int64, error) {
	var articles []domain.NewsArticle
	var total int64

	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	page := filter.Page
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit

	q := r.db.WithContext(ctx).Model(&domain.NewsArticle{})
	if filter.Status != nil {
		q = q.Where("status = ?", *filter.Status)
	}
	if filter.Search != "" {
		like := "%" + filter.Search + "%"
		q = q.Where(
			"title ILIKE ? OR short_description ILIKE ? OR full_content ILIKE ?",
			like, like, like,
		)
	}

	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := q.Order("updated_at DESC").Limit(limit).Offset(offset).Find(&articles).Error
	return articles, total, err
}

func (r *newsRepository) GetFeatured(ctx context.Context) (*domain.NewsArticle, error) {
	var article domain.NewsArticle
	err := r.db.WithContext(ctx).
		Where("status = ? AND is_featured = ?", domain.StatusPublished, true).
		First(&article).Error
	if err != nil {
		return nil, err
	}
	return &article, nil
}

func (r *newsRepository) UnsetFeatured(ctx context.Context) error {
	return r.db.WithContext(ctx).
		Model(&domain.NewsArticle{}).
		Where("is_featured = ?", true).
		Update("is_featured", false).Error
}

func (r *newsRepository) Update(ctx context.Context, article *domain.NewsArticle) error {
	return r.db.WithContext(ctx).Save(article).Error
}

func (r *newsRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.NewsArticle{}, "id = ?", id).Error
}
