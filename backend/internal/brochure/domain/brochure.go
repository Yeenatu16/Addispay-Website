package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type BrochureImage struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Title       string    `gorm:"type:varchar(255);not null" json:"title"`
	ImageURL    string    `gorm:"type:varchar(500);not null" json:"imageUrl"`
	SortOrder   int       `gorm:"default:0;index" json:"sortOrder"`
	IsPublished bool      `gorm:"default:true;index" json:"isPublished"`
	CreatedByID uuid.UUID `gorm:"type:uuid;not null" json:"createdById"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type CreateBrochureInput struct {
	Title       string
	ImageURL    string
	SortOrder   int
	IsPublished bool
}

type UpdateBrochureInput struct {
	Title       *string
	ImageURL    *string
	SortOrder   *int
	IsPublished *bool
}

type BrochureRepository interface {
	Create(ctx context.Context, img *BrochureImage) error
	GetByID(ctx context.Context, id uuid.UUID) (*BrochureImage, error)
	ListPublished(ctx context.Context) ([]BrochureImage, error)
	ListAll(ctx context.Context) ([]BrochureImage, error)
	Update(ctx context.Context, img *BrochureImage) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type BrochureUsecase interface {
	Create(ctx context.Context, actorID uuid.UUID, in CreateBrochureInput) (*BrochureImage, error)
	Update(ctx context.Context, id uuid.UUID, in UpdateBrochureInput) (*BrochureImage, error)
	Delete(ctx context.Context, id uuid.UUID) error
	ListPublished(ctx context.Context) ([]BrochureImage, error)
	ListAll(ctx context.Context) ([]BrochureImage, error)
}
