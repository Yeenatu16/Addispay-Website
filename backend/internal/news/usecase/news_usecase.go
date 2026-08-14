package usecase

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/addispay/backend/internal/news/domain"
)

type newsUsecase struct {
	repo domain.NewsRepository
}

func NewNewsUsecase(repo domain.NewsRepository) domain.NewsUsecase {
	return &newsUsecase{repo: repo}
}

func (u *newsUsecase) CreateArticle(ctx context.Context, authorID uuid.UUID, title, shortDesc, fullContent, coverURL string, isFeatured bool, status domain.PublicationStatus) (*domain.NewsArticle, error) {
	slug := strings.ToLower(strings.ReplaceAll(title, " ", "-"))

	if isFeatured {
		_ = u.repo.UnsetFeatured(ctx)
	}

	var pubDate *time.Time
	if status == domain.StatusPublished {
		now := time.Now()
		pubDate = &now
	}

	article := &domain.NewsArticle{
		Title:            title,
		Slug:             slug,
		ShortDescription: shortDesc,
		FullContent:      fullContent,
		CoverImageURL:    coverURL,
		IsFeatured:       isFeatured,
		Status:           status,
		AuthorID:         authorID,
		PublishedAt:      pubDate,
	}

	if err := u.repo.Create(ctx, article); err != nil {
		return nil, err
	}

	return article, nil
}

func (u *newsUsecase) GetPublishedNews(ctx context.Context, page, limit int, search string) ([]domain.NewsArticle, int64, error) {
	if limit <= 0 {
		limit = 9
	}
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit
	return u.repo.ListPublished(ctx, limit, offset, search)
}

func (u *newsUsecase) GetHomepageNews(ctx context.Context) (*domain.NewsArticle, []domain.NewsArticle, error) {
	featured, _ := u.repo.GetFeatured(ctx)
	latest, _, err := u.repo.ListPublished(ctx, 4, 0, "")
	return featured, latest, err
}

func (u *newsUsecase) GetBySlug(ctx context.Context, slug string) (*domain.NewsArticle, error) {
	return u.repo.GetBySlug(ctx, slug)
}

func (u *newsUsecase) DeleteArticle(ctx context.Context, id uuid.UUID) error {
	return u.repo.Delete(ctx, id)
}
