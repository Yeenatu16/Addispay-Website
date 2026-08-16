package usecase

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/addispay/backend/internal/news/domain"
)

type newsUsecase struct {
	repo     domain.NewsRepository
	audit    domain.AuditLogger
	settings domain.SiteSettings
}

func NewNewsUsecase(repo domain.NewsRepository, audit domain.AuditLogger, settings domain.SiteSettings) domain.NewsUsecase {
	return &newsUsecase{repo: repo, audit: audit, settings: settings}
}

func (u *newsUsecase) CreateArticle(
	ctx context.Context,
	authorID uuid.UUID,
	authorName, title, shortDesc, fullContent, coverURL string,
	isFeatured bool,
	status domain.PublicationStatus,
) (*domain.NewsArticle, error) {
	title = strings.TrimSpace(title)
	shortDesc = strings.TrimSpace(shortDesc)
	fullContent = strings.TrimSpace(fullContent)
	if title == "" || shortDesc == "" || fullContent == "" {
		return nil, errors.New("title, short description, and full content are required")
	}
	if status != domain.StatusDraft && status != domain.StatusPublished {
		return nil, errors.New("status must be DRAFT or PUBLISHED")
	}

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
		Slug:             slugify(title),
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

	action := domain.AuditCreate
	if status == domain.StatusPublished {
		action = domain.AuditPublish
	}
	_ = u.audit.LogNewsAction(ctx, authorID, authorName, action, article.Title)

	return article, nil
}

func (u *newsUsecase) UpdateArticle(
	ctx context.Context,
	actorID uuid.UUID,
	actorName string,
	id uuid.UUID,
	input domain.UpdateArticleInput,
) (*domain.NewsArticle, error) {
	article, err := u.repo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("article not found")
		}
		return nil, err
	}

	previousStatus := article.Status

	if input.Title != nil {
		title := strings.TrimSpace(*input.Title)
		if title == "" {
			return nil, errors.New("title cannot be empty")
		}
		article.Title = title
		article.Slug = slugify(title)
	}
	if input.ShortDescription != nil {
		desc := strings.TrimSpace(*input.ShortDescription)
		if desc == "" {
			return nil, errors.New("short description cannot be empty")
		}
		article.ShortDescription = desc
	}
	if input.FullContent != nil {
		content := strings.TrimSpace(*input.FullContent)
		if content == "" {
			return nil, errors.New("full content cannot be empty")
		}
		article.FullContent = content
	}
	if input.CoverImageURL != nil {
		article.CoverImageURL = *input.CoverImageURL
	}
	if input.IsFeatured != nil {
		if *input.IsFeatured {
			_ = u.repo.UnsetFeatured(ctx)
		}
		article.IsFeatured = *input.IsFeatured
	}
	if input.Status != nil {
		if *input.Status != domain.StatusDraft && *input.Status != domain.StatusPublished {
			return nil, errors.New("status must be DRAFT or PUBLISHED")
		}
		article.Status = *input.Status
		if *input.Status == domain.StatusPublished && article.PublishedAt == nil {
			now := time.Now()
			article.PublishedAt = &now
		}
		if *input.Status == domain.StatusDraft {
			article.IsFeatured = false
		}
	}

	if err := u.repo.Update(ctx, article); err != nil {
		return nil, err
	}

	action := domain.AuditEdit
	if previousStatus != article.Status {
		if article.Status == domain.StatusPublished {
			action = domain.AuditPublish
		} else {
			action = domain.AuditUnpublish
		}
	}
	_ = u.audit.LogNewsAction(ctx, actorID, actorName, action, article.Title)

	return article, nil
}

func (u *newsUsecase) DeleteArticle(ctx context.Context, actorID uuid.UUID, actorName string, id uuid.UUID) error {
	article, err := u.repo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("article not found")
		}
		return err
	}

	if err := u.repo.Delete(ctx, id); err != nil {
		return err
	}

	_ = u.audit.LogNewsAction(ctx, actorID, actorName, domain.AuditDelete, article.Title)
	return nil
}

func (u *newsUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.NewsArticle, error) {
	article, err := u.repo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("article not found")
		}
		return nil, err
	}
	return article, nil
}

func (u *newsUsecase) GetBySlug(ctx context.Context, slug string) (*domain.NewsArticle, error) {
	article, err := u.repo.GetBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	if article.Status != domain.StatusPublished {
		return nil, errors.New("article not found")
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

func (u *newsUsecase) GetHomepageNews(ctx context.Context) (*domain.NewsArticle, []domain.NewsArticle, string, error) {
	limit := 4
	if u.settings != nil {
		if n, err := u.settings.GetHomepageNewsLimit(ctx); err == nil && n > 0 {
			limit = n
		}
	}

	emptyMsg := "No news available at this time."
	if u.settings != nil {
		if msg, err := u.settings.GetNewsEmptyMessage(ctx); err == nil && strings.TrimSpace(msg) != "" {
			emptyMsg = msg
		}
	}

	featured, _ := u.repo.GetFeatured(ctx)
	latest, _, err := u.repo.ListPublished(ctx, limit, 0, "")
	return featured, latest, emptyMsg, err
}

func (u *newsUsecase) ListAdminArticles(ctx context.Context, filter domain.NewsListFilter) ([]domain.NewsArticle, int64, error) {
	return u.repo.ListAdmin(ctx, filter)
}

func slugify(title string) string {
	slug := strings.ToLower(strings.TrimSpace(title))
	slug = strings.ReplaceAll(slug, " ", "-")
	for strings.Contains(slug, "--") {
		slug = strings.ReplaceAll(slug, "--", "-")
	}
	if slug == "" {
		slug = fmt.Sprintf("article-%d", time.Now().Unix())
	}
	return slug
}
