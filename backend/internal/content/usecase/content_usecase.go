package usecase

import (
	"context"
	"errors"
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
