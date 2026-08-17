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

const (
	AuditCreate    = "CREATE"
	AuditEdit      = "EDIT"
	AuditPublish   = "PUBLISH"
	AuditUnpublish = "UNPUBLISH"
	AuditDelete    = "DELETE"
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

type NewsListFilter struct {
	Page   int
	Limit  int
	Search string
	Status *PublicationStatus // nil = all (admin)
}

type NewsRepository interface {
	Create(ctx context.Context, article *NewsArticle) error
	GetByID(ctx context.Context, id uuid.UUID) (*NewsArticle, error)
	GetBySlug(ctx context.Context, slug string) (*NewsArticle, error)
	ListPublished(ctx context.Context, limit, offset int, search string) ([]NewsArticle, int64, error)
	ListAdmin(ctx context.Context, filter NewsListFilter) ([]NewsArticle, int64, error)
	GetFeatured(ctx context.Context) (*NewsArticle, error)
	UnsetFeatured(ctx context.Context) error
	Update(ctx context.Context, article *NewsArticle) error
	Delete(ctx context.Context, id uuid.UUID) error
}

// AuditLogger records news management activities (FR-ADM-010).
type AuditLogger interface {
	LogNewsAction(ctx context.Context, userID uuid.UUID, userName, action, articleTitle string) error
}

// SiteSettings provides configurable homepage news count and empty-state message.
type SiteSettings interface {
	GetHomepageNewsLimit(ctx context.Context) (int, error)
	GetNewsEmptyMessage(ctx context.Context) (string, error)
	SetHomepageNewsLimit(ctx context.Context, limit int) error
	SetNewsEmptyMessage(ctx context.Context, message string) error
}

type CreateArticleInput struct {
	Title            string
	ShortDescription string
	FullContent      string
	CoverImageURL    string
	IsFeatured       bool
	Status           PublicationStatus
	// PublishedAt overrides the publish date (FR-ADM-002). Nil means "now" for
	// published articles and no date for drafts.
	PublishedAt *time.Time
}

type UpdateArticleInput struct {
	Title            *string
	ShortDescription *string
	FullContent      *string
	CoverImageURL    *string
	IsFeatured       *bool
	Status           *PublicationStatus
	PublishedAt      *time.Time
}

type NewsUsecase interface {
	CreateArticle(ctx context.Context, authorID uuid.UUID, authorName string, input CreateArticleInput) (*NewsArticle, error)
	UpdateArticle(ctx context.Context, actorID uuid.UUID, actorName string, id uuid.UUID, input UpdateArticleInput) (*NewsArticle, error)
	DeleteArticle(ctx context.Context, actorID uuid.UUID, actorName string, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*NewsArticle, error)
	GetBySlug(ctx context.Context, slug string) (*NewsArticle, error)
	GetPublishedNews(ctx context.Context, page, limit int, search string) ([]NewsArticle, int64, error)
	GetHomepageNews(ctx context.Context) (*NewsArticle, []NewsArticle, string, error)
	ListAdminArticles(ctx context.Context, filter NewsListFilter) ([]NewsArticle, int64, error)
}
