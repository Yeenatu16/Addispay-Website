package usecase

import (
	"context"
	"errors"
	"net/url"
	"strconv"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/addispay/backend/internal/apperr"
	"github.com/addispay/backend/internal/content/domain"
	"github.com/addispay/backend/internal/sanitize"
	"github.com/addispay/backend/internal/validate"
)

const (
	defaultHomepageLimit = 4
	defaultEmptyMessage  = "No news available at this time."
)

type contentUsecase struct {
	repo domain.ContentRepository
}

func NewContentUsecase(repo domain.ContentRepository) domain.ContentUsecase {
	return &contentUsecase{repo: repo}
}

func (u *contentUsecase) Subscribe(ctx context.Context, email string) error {
	email, err := validate.Email(email)
	if err != nil {
		return err
	}
	if err := u.repo.SubscribeNewsletter(ctx, email); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (u *contentUsecase) ListSubscribers(ctx context.Context, page, limit int) ([]domain.NewsletterSubscriber, int64, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if page <= 0 {
		page = 1
	}
	subs, total, err := u.repo.ListSubscribers(ctx, limit, (page-1)*limit)
	if err != nil {
		return nil, 0, apperr.Internal(err)
	}
	return subs, total, nil
}

func (u *contentUsecase) SendContactMessage(ctx context.Context, fullName, email, reason, message string) error {
	fullName = sanitize.Text(fullName)
	reason = sanitize.Text(reason)
	message = sanitize.Text(message)

	email, err := validate.Email(email)
	if err != nil {
		return err
	}
	if err := validate.Required(fullName, "fullName"); err != nil {
		return err
	}
	if err := validate.MaxLen(fullName, "fullName", validate.MaxName); err != nil {
		return err
	}
	if err := validate.Required(reason, "reason"); err != nil {
		return err
	}
	if err := validate.MaxLen(reason, "reason", validate.MaxTitle); err != nil {
		return err
	}
	if err := validate.Required(message, "message"); err != nil {
		return err
	}
	if err := validate.MaxLen(message, "message", validate.MaxLongText); err != nil {
		return err
	}

	msg := &domain.ContactMessage{
		FullName: fullName,
		Email:    email,
		Reason:   reason,
		Message:  message,
	}
	if err := u.repo.SaveContactMessage(ctx, msg); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (u *contentUsecase) ListAuditLogs(ctx context.Context, page, limit int, resource string) ([]domain.AuditLog, int64, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if page <= 0 {
		page = 1
	}
	resource = sanitize.Text(resource)
	logs, total, err := u.repo.ListAuditLogs(ctx, limit, (page-1)*limit, resource)
	if err != nil {
		return nil, 0, apperr.Internal(err)
	}
	return logs, total, nil
}

func (u *contentUsecase) GetNewsSettings(ctx context.Context) (int, string, error) {
	limit := defaultHomepageLimit
	if setting, err := u.repo.GetSetting(ctx, domain.SettingHomepageNewsLimit); err == nil {
		if n, convErr := strconv.Atoi(setting.Value); convErr == nil && n > 0 {
			limit = n
		}
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return 0, "", apperr.Internal(err)
	}

	msg := defaultEmptyMessage
	if setting, err := u.repo.GetSetting(ctx, domain.SettingNewsEmptyMessage); err == nil {
		if strings.TrimSpace(setting.Value) != "" {
			msg = sanitize.Text(setting.Value)
		}
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return 0, "", apperr.Internal(err)
	}

	return limit, msg, nil
}

func (u *contentUsecase) UpdateNewsSettings(ctx context.Context, homepageLimit *int, emptyMessage *string) error {
	if homepageLimit != nil {
		if *homepageLimit < 1 || *homepageLimit > 20 {
			return apperr.BadRequest("homepageLimit must be between 1 and 20")
		}
		if err := u.repo.UpsertSetting(ctx, domain.SettingHomepageNewsLimit, strconv.Itoa(*homepageLimit)); err != nil {
			return apperr.Internal(err)
		}
	}
	if emptyMessage != nil {
		msg := sanitize.Text(*emptyMessage)
		if msg == "" {
			return apperr.BadRequest("emptyMessage cannot be empty")
		}
		if err := validate.MaxLen(msg, "emptyMessage", validate.MaxShortText); err != nil {
			return err
		}
		if err := u.repo.UpsertSetting(ctx, domain.SettingNewsEmptyMessage, msg); err != nil {
			return apperr.Internal(err)
		}
	}
	return nil
}

func (u *contentUsecase) GetHeroYoutubeID(ctx context.Context) (string, error) {
	setting, err := u.repo.GetSetting(ctx, domain.SettingHeroYoutubeID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.DefaultHeroYoutubeID, nil
		}
		return "", apperr.Internal(err)
	}
	id := sanitize.Text(setting.Value)
	if id == "" {
		return domain.DefaultHeroYoutubeID, nil
	}
	return id, nil
}

func (u *contentUsecase) UpdateHeroYoutubeID(ctx context.Context, youtubeIDOrURL string) (string, error) {
	id, err := extractYouTubeID(sanitize.Text(youtubeIDOrURL))
	if err != nil {
		return "", err
	}
	if err := u.repo.UpsertSetting(ctx, domain.SettingHeroYoutubeID, id); err != nil {
		return "", apperr.Internal(err)
	}
	return id, nil
}

// extractYouTubeID accepts a raw 11-char ID or common YouTube URL forms.
func extractYouTubeID(raw string) (string, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return "", apperr.BadRequest("youtube video id or URL is required")
	}

	if isYouTubeID(raw) {
		return raw, nil
	}

	// Normalize protocol-relative and bare hosts.
	candidate := raw
	if strings.HasPrefix(candidate, "//") {
		candidate = "https:" + candidate
	}
	if !strings.Contains(candidate, "://") && (strings.Contains(candidate, "youtube.com") || strings.Contains(candidate, "youtu.be")) {
		candidate = "https://" + candidate
	}

	if u, err := url.Parse(candidate); err == nil {
		host := strings.ToLower(u.Host)
		switch {
		case strings.Contains(host, "youtu.be"):
			id := strings.Trim(strings.TrimPrefix(u.Path, "/"), "/")
			if i := strings.IndexAny(id, "?&/"); i >= 0 {
				id = id[:i]
			}
			if isYouTubeID(id) {
				return id, nil
			}
		case strings.Contains(host, "youtube.com"), strings.Contains(host, "youtube-nocookie.com"):
			if v := u.Query().Get("v"); isYouTubeID(v) {
				return v, nil
			}
			parts := strings.Split(strings.Trim(u.Path, "/"), "/")
			for i, p := range parts {
				if (p == "embed" || p == "shorts" || p == "live" || p == "v") && i+1 < len(parts) {
					id := parts[i+1]
					if isYouTubeID(id) {
						return id, nil
					}
				}
			}
		}
	}

	return "", apperr.BadRequest("provide a valid YouTube video ID or URL")
}

func isYouTubeID(id string) bool {
	if len(id) != 11 {
		return false
	}
	for _, r := range id {
		switch {
		case r >= 'a' && r <= 'z', r >= 'A' && r <= 'Z', r >= '0' && r <= '9', r == '-', r == '_':
		default:
			return false
		}
	}
	return true
}

// NewsAuditAdapter implements news/domain.AuditLogger using content audit logs.
type NewsAuditAdapter struct {
	repo domain.ContentRepository
}

func NewNewsAuditAdapter(repo domain.ContentRepository) *NewsAuditAdapter {
	return &NewsAuditAdapter{repo: repo}
}

func (a *NewsAuditAdapter) LogNewsAction(ctx context.Context, userID uuid.UUID, userName, action, articleTitle string) error {
	return a.repo.CreateAuditLog(ctx, &domain.AuditLog{
		UserID:   userID,
		UserName: userName,
		Action:   action,
		Resource: "news",
		Details:  articleTitle,
	})
}

// CareerAuditAdapter implements careers/domain.AuditLogger.
type CareerAuditAdapter struct {
	repo domain.ContentRepository
}

func NewCareerAuditAdapter(repo domain.ContentRepository) *CareerAuditAdapter {
	return &CareerAuditAdapter{repo: repo}
}

func (a *CareerAuditAdapter) LogCareerAction(ctx context.Context, userID uuid.UUID, userName, action, jobTitle string) error {
	return a.repo.CreateAuditLog(ctx, &domain.AuditLog{
		UserID:   userID,
		UserName: userName,
		Action:   action,
		Resource: "careers",
		Details:  jobTitle,
	})
}

// NewsSettingsAdapter implements news/domain.SiteSettings.
type NewsSettingsAdapter struct {
	usecase domain.ContentUsecase
}

func NewNewsSettingsAdapter(usecase domain.ContentUsecase) *NewsSettingsAdapter {
	return &NewsSettingsAdapter{usecase: usecase}
}

func (a *NewsSettingsAdapter) GetHomepageNewsLimit(ctx context.Context) (int, error) {
	limit, _, err := a.usecase.GetNewsSettings(ctx)
	return limit, err
}

func (a *NewsSettingsAdapter) GetNewsEmptyMessage(ctx context.Context) (string, error) {
	_, msg, err := a.usecase.GetNewsSettings(ctx)
	return msg, err
}

func (a *NewsSettingsAdapter) SetHomepageNewsLimit(ctx context.Context, limit int) error {
	return a.usecase.UpdateNewsSettings(ctx, &limit, nil)
}

func (a *NewsSettingsAdapter) SetNewsEmptyMessage(ctx context.Context, message string) error {
	return a.usecase.UpdateNewsSettings(ctx, nil, &message)
}
