package usecase

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"
	"unicode"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/addispay/backend/internal/apperr"
	"github.com/addispay/backend/internal/news/domain"
	"github.com/addispay/backend/internal/sanitize"
	"github.com/addispay/backend/internal/validate"
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
	authorName string,
	in domain.CreateArticleInput,
) (*domain.NewsArticle, error) {
	title := sanitize.Text(in.Title)
	shortDesc := sanitize.Text(in.ShortDescription)
	fullContent := sanitize.HTML(in.FullContent)
	coverURL := strings.TrimSpace(in.CoverImageURL)
	isFeatured := in.IsFeatured
	status := in.Status

	if err := validate.Required(title, "title"); err != nil {
		return nil, err
	}
	if err := validate.MaxLen(title, "title", validate.MaxTitle); err != nil {
		return nil, err
	}
	if err := validate.Required(shortDesc, "shortDescription"); err != nil {
		return nil, err
	}
	if err := validate.MaxLen(shortDesc, "shortDescription", validate.MaxShortText); err != nil {
		return nil, err
	}
	if err := validate.Required(fullContent, "fullContent"); err != nil {
		return nil, err
	}
	if err := validate.MaxLen(fullContent, "fullContent", validate.MaxLongText); err != nil {
		return nil, err
	}
	if coverURL != "" {
		if err := validate.MaxLen(coverURL, "coverImageUrl", validate.MaxURL); err != nil {
			return nil, err
		}
	}
	if status != domain.StatusDraft && status != domain.StatusPublished {
		return nil, apperr.BadRequest("status must be DRAFT or PUBLISHED")
	}

	if isFeatured && status != domain.StatusPublished {
		return nil, apperr.BadRequest("only published articles can be featured")
	}
	if isFeatured {
		_ = u.repo.UnsetFeatured(ctx)
	}

	pubDate := in.PublishedAt
	if status == domain.StatusPublished && pubDate == nil {
		now := time.Now()
		pubDate = &now
	}
	if status == domain.StatusDraft {
		pubDate = nil
	}

	article := &domain.NewsArticle{
		Title:            title,
		Slug:             u.uniqueSlug(ctx, title, uuid.Nil),
		ShortDescription: shortDesc,
		FullContent:      fullContent,
		CoverImageURL:    coverURL,
		IsFeatured:       isFeatured,
		Status:           status,
		AuthorID:         authorID,
		PublishedAt:      pubDate,
	}

	if err := u.repo.Create(ctx, article); err != nil {
		return nil, apperr.Internal(err)
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
			return nil, apperr.NotFound("article not found")
		}
		return nil, apperr.Internal(err)
	}

	previousStatus := article.Status

	if input.Title != nil {
		title := sanitize.Text(*input.Title)
		if err := validate.Required(title, "title"); err != nil {
			return nil, err
		}
		if err := validate.MaxLen(title, "title", validate.MaxTitle); err != nil {
			return nil, err
		}
		article.Title = title
		article.Slug = u.uniqueSlug(ctx, title, article.ID)
	}
	if input.ShortDescription != nil {
		desc := sanitize.Text(*input.ShortDescription)
		if err := validate.Required(desc, "shortDescription"); err != nil {
			return nil, err
		}
		if err := validate.MaxLen(desc, "shortDescription", validate.MaxShortText); err != nil {
			return nil, err
		}
		article.ShortDescription = desc
	}
	if input.FullContent != nil {
		content := sanitize.HTML(*input.FullContent)
		if err := validate.Required(content, "fullContent"); err != nil {
			return nil, err
		}
		if err := validate.MaxLen(content, "fullContent", validate.MaxLongText); err != nil {
			return nil, err
		}
		article.FullContent = content
	}
	if input.CoverImageURL != nil {
		cover := strings.TrimSpace(*input.CoverImageURL)
		if cover != "" {
			if err := validate.MaxLen(cover, "coverImageUrl", validate.MaxURL); err != nil {
				return nil, err
			}
		}
		article.CoverImageURL = cover
	}
	if input.IsFeatured != nil {
		if *input.IsFeatured {
			_ = u.repo.UnsetFeatured(ctx)
		}
		article.IsFeatured = *input.IsFeatured
	}
	if input.Status != nil {
		if *input.Status != domain.StatusDraft && *input.Status != domain.StatusPublished {
			return nil, apperr.BadRequest("status must be DRAFT or PUBLISHED")
		}
		article.Status = *input.Status
		if *input.Status == domain.StatusPublished && article.PublishedAt == nil {
			now := time.Now()
			article.PublishedAt = &now
		}
		if *input.Status == domain.StatusDraft {
			article.IsFeatured = false
			article.PublishedAt = nil
		}
	}
	if input.PublishedAt != nil && article.Status == domain.StatusPublished {
		article.PublishedAt = input.PublishedAt
	}

	if err := u.repo.Update(ctx, article); err != nil {
		return nil, apperr.Internal(err)
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
			return apperr.NotFound("article not found")
		}
		return apperr.Internal(err)
	}
	if err := u.repo.Delete(ctx, id); err != nil {
		return apperr.Internal(err)
	}
	_ = u.audit.LogNewsAction(ctx, actorID, actorName, domain.AuditDelete, article.Title)
	return nil
}

func (u *newsUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.NewsArticle, error) {
	article, err := u.repo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperr.NotFound("article not found")
		}
		return nil, apperr.Internal(err)
	}
	return article, nil
}

func (u *newsUsecase) GetBySlug(ctx context.Context, slug string) (*domain.NewsArticle, error) {
	article, err := u.repo.GetBySlug(ctx, slug)
	if err != nil {
		return nil, apperr.NotFound("article not found")
	}
	if article.Status != domain.StatusPublished {
		return nil, apperr.NotFound("article not found")
	}
	return article, nil
}

func (u *newsUsecase) GetPublishedNews(ctx context.Context, page, limit int, search string) ([]domain.NewsArticle, int64, error) {
	if limit <= 0 {
		limit = 9
	}
	if limit > 50 {
		limit = 50
	}
	if page <= 0 {
		page = 1
	}
	search = sanitize.Text(search)
	articles, total, err := u.repo.ListPublished(ctx, limit, (page-1)*limit, search)
	if err != nil {
		return nil, 0, apperr.Internal(err)
	}
	return articles, total, nil
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
			emptyMsg = sanitize.Text(msg)
		}
	}

	featured, _ := u.repo.GetFeatured(ctx)
	latest, _, err := u.repo.ListPublished(ctx, limit, 0, "")
	if err != nil {
		return nil, nil, "", apperr.Internal(err)
	}
	return featured, latest, emptyMsg, nil
}

func (u *newsUsecase) ListAdminArticles(ctx context.Context, filter domain.NewsListFilter) ([]domain.NewsArticle, int64, error) {
	if filter.Limit <= 0 {
		filter.Limit = 20
	}
	if filter.Limit > 100 {
		filter.Limit = 100
	}
	if filter.Page <= 0 {
		filter.Page = 1
	}
	filter.Search = sanitize.Text(filter.Search)
	articles, total, err := u.repo.ListAdmin(ctx, filter)
	if err != nil {
		return nil, 0, apperr.Internal(err)
	}
	return articles, total, nil
}

// uniqueSlug derives a URL-safe slug and appends a counter when another article
// already owns it, keeping /blog/<slug> resolvable for same-titled articles.
func (u *newsUsecase) uniqueSlug(ctx context.Context, title string, selfID uuid.UUID) string {
	base := slugify(title)
	candidate := base
	for i := 2; i < 100; i++ {
		existing, err := u.repo.GetBySlug(ctx, candidate)
		if err != nil || existing == nil || existing.ID == selfID {
			return candidate
		}
		candidate = fmt.Sprintf("%s-%d", base, i)
	}
	return fmt.Sprintf("%s-%d", base, time.Now().Unix())
}

func slugify(title string) string {
	var b strings.Builder
	lastDash := false
	for _, r := range strings.ToLower(strings.TrimSpace(title)) {
		switch {
		case (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9'):
			b.WriteRune(r)
			lastDash = false
		case r > unicode.MaxASCII && unicode.IsLetter(r):
			// Preserve Amharic and other non-Latin titles rather than dropping them.
			b.WriteRune(r)
			lastDash = false
		case !lastDash && b.Len() > 0:
			b.WriteByte('-')
			lastDash = true
		}
	}

	slug := strings.Trim(b.String(), "-")
	if slug == "" {
		return fmt.Sprintf("article-%d", time.Now().UnixNano())
	}
	if len(slug) > 200 {
		slug = strings.Trim(slug[:200], "-")
	}
	return slug
}
