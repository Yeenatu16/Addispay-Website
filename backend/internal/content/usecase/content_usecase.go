package usecase

import (
	"context"
	"errors"
	"strconv"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/addispay/backend/internal/content/domain"
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
	return u.repo.SubscribeNewsletter(ctx, email)
}

func (u *contentUsecase) SendContactMessage(ctx context.Context, fullName, email, reason, message string) error {
	msg := &domain.ContactMessage{
		FullName: fullName,
		Email:    email,
		Reason:   reason,
		Message:  message,
	}
	return u.repo.SaveContactMessage(ctx, msg)
}

func (u *contentUsecase) ListAuditLogs(ctx context.Context, page, limit int) ([]domain.AuditLog, int64, error) {
	if limit <= 0 {
		limit = 20
	}
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit
	return u.repo.ListAuditLogs(ctx, limit, offset)
}

func (u *contentUsecase) GetNewsSettings(ctx context.Context) (int, string, error) {
	limit := defaultHomepageLimit
	if setting, err := u.repo.GetSetting(ctx, domain.SettingHomepageNewsLimit); err == nil {
		if n, convErr := strconv.Atoi(setting.Value); convErr == nil && n > 0 {
			limit = n
		}
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return 0, "", err
	}

	msg := defaultEmptyMessage
	if setting, err := u.repo.GetSetting(ctx, domain.SettingNewsEmptyMessage); err == nil {
		if strings.TrimSpace(setting.Value) != "" {
			msg = setting.Value
		}
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return 0, "", err
	}

	return limit, msg, nil
}

func (u *contentUsecase) UpdateNewsSettings(ctx context.Context, homepageLimit *int, emptyMessage *string) error {
	if homepageLimit != nil {
		if *homepageLimit < 1 || *homepageLimit > 20 {
			return errors.New("homepageLimit must be between 1 and 20")
		}
		if err := u.repo.UpsertSetting(ctx, domain.SettingHomepageNewsLimit, strconv.Itoa(*homepageLimit)); err != nil {
			return err
		}
	}
	if emptyMessage != nil {
		msg := strings.TrimSpace(*emptyMessage)
		if msg == "" {
			return errors.New("emptyMessage cannot be empty")
		}
		if err := u.repo.UpsertSetting(ctx, domain.SettingNewsEmptyMessage, msg); err != nil {
			return err
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
