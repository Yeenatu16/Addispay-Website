package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type OfficialDocument struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Title       string    `gorm:"type:varchar(255);not null" json:"title"`
	Category    string    `gorm:"type:varchar(100);not null;index" json:"category"`
	Description string    `gorm:"type:text;not null" json:"description"`
	FileURL     string    `gorm:"type:varchar(500);not null" json:"fileUrl"`
	FileSize    string    `gorm:"type:varchar(50);not null" json:"fileSize"`
	DateLabel   string    `gorm:"type:varchar(100);not null" json:"dateLabel"`
	Pages       int       `gorm:"default:0" json:"pages"`
	SortOrder   int       `gorm:"default:0;index" json:"sortOrder"`
	IsPublished bool      `gorm:"default:true;index" json:"isPublished"`
	CreatedByID uuid.UUID `gorm:"type:uuid;not null" json:"createdById"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type CreateDocumentInput struct {
	Title       string
	Category    string
	Description string
	FileURL     string
	FileSize    string
	DateLabel   string
	Pages       int
	SortOrder   int
	IsPublished bool
}

type UpdateDocumentInput struct {
	Title       *string
	Category    *string
	Description *string
	FileURL     *string
	FileSize    *string
	DateLabel   *string
	Pages       *int
	SortOrder   *int
	IsPublished *bool
}

type DocumentRepository interface {
	Create(ctx context.Context, doc *OfficialDocument) error
	GetByID(ctx context.Context, id uuid.UUID) (*OfficialDocument, error)
	ListPublished(ctx context.Context) ([]OfficialDocument, error)
	ListAll(ctx context.Context) ([]OfficialDocument, error)
	ListCategories(ctx context.Context) ([]string, error)
	Update(ctx context.Context, doc *OfficialDocument) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type DocumentUsecase interface {
	Create(ctx context.Context, actorID uuid.UUID, in CreateDocumentInput) (*OfficialDocument, error)
	Update(ctx context.Context, id uuid.UUID, in UpdateDocumentInput) (*OfficialDocument, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*OfficialDocument, error)
	ListPublished(ctx context.Context) ([]OfficialDocument, error)
	ListAll(ctx context.Context) ([]OfficialDocument, error)
	ListCategories(ctx context.Context) ([]string, error)
}
