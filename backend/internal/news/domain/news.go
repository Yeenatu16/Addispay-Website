package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type PublicationStatus string

const (
	StatusDraft     PublicationStatus = "DRAFT"
	StatusPublished PublicationStatus = "PUBLISHED"
)

type NewsArticle struct {
	ID               uuid.UUID         `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Title            string            `gorm:"type:varchar(255);not null" json:"title"`
	Slug             string            `gorm:"type:varchar(255);uniqueIndex;not null" json:"slug"`
	ShortDescription string            `gorm:"type:text;not null" json:"shortDescription"`
	FullContent      string            `gorm:"type:text;not null" json:"fullContent"`
	CoverImageURL    string            `gorm:"type:varchar(500)" json:"coverImageUrl"`
	Status           PublicationStatus `gorm:"type:varchar(50);default:'DRAFT'" json:"status"`
	IsFeatured       bool              `gorm:"default:false;index" json:"isFeatured"`
	AuthorID         uuid.UUID         `gorm:"type:uuid;not null" json:"authorId"`
	PublishedAt      *time.Time        `json:"publishedAt"`
	CreatedAt        time.Time         `json:"createdAt"`
	UpdatedAt        time.Time         `json:"updatedAt"`
}

type NewsRepository interface {
	Create(ctx context.Context, article *NewsArticle) error
	GetByID(ctx context.Context, id uuid.UUID) (*NewsArticle, error)
	GetBySlug(ctx context.Context, slug string) (*NewsArticle, error)
	ListPublished(ctx context.Context, limit, offset int, search string) ([]NewsArticle, int64, error)
	GetFeatured(ctx context.Context) (*NewsArticle, error)
	UnsetFeatured(ctx context.Context) error
	Update(ctx context.Context, article *NewsArticle) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type NewsUsecase interface {
	CreateArticle(ctx context.Context, authorID uuid.UUID, title, shortDesc, fullContent, coverURL string, isFeatured bool, status PublicationStatus) (*NewsArticle, error)
	GetPublishedNews(ctx context.Context, page, limit int, search string) ([]NewsArticle, int64, error)
	GetHomepageNews(ctx context.Context) (*NewsArticle, []NewsArticle, error)
	GetBySlug(ctx context.Context, slug string) (*NewsArticle, error)
	DeleteArticle(ctx context.Context, id uuid.UUID) error
}
