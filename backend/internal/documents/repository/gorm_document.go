package repository

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/addispay/backend/internal/documents/domain"
)

type documentRepository struct {
	db *gorm.DB
}

func NewDocumentRepository(db *gorm.DB) domain.DocumentRepository {
	return &documentRepository{db: db}
}

func (r *documentRepository) Create(ctx context.Context, doc *domain.OfficialDocument) error {
	return r.db.WithContext(ctx).Create(doc).Error
}

func (r *documentRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.OfficialDocument, error) {
	var doc domain.OfficialDocument
	if err := r.db.WithContext(ctx).First(&doc, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &doc, nil
}

func (r *documentRepository) ListPublished(ctx context.Context) ([]domain.OfficialDocument, error) {
	var docs []domain.OfficialDocument
	err := r.db.WithContext(ctx).
		Where("is_published = ?", true).
		Order("sort_order ASC, created_at DESC").
		Find(&docs).Error
	return docs, err
}

func (r *documentRepository) ListAll(ctx context.Context) ([]domain.OfficialDocument, error) {
	var docs []domain.OfficialDocument
	err := r.db.WithContext(ctx).
		Order("sort_order ASC, created_at DESC").
		Find(&docs).Error
	return docs, err
}

func (r *documentRepository) ListCategories(ctx context.Context) ([]string, error) {
	var cats []string
	err := r.db.WithContext(ctx).
		Model(&domain.OfficialDocument{}).
		Distinct("category").
		Where("category <> ''").
		Order("category ASC").
		Pluck("category", &cats).Error
	return cats, err
}

func (r *documentRepository) Update(ctx context.Context, doc *domain.OfficialDocument) error {
	return r.db.WithContext(ctx).Save(doc).Error
}

func (r *documentRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.OfficialDocument{}, "id = ?", id).Error
}
