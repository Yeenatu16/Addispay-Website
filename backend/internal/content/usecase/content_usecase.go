package usecase

import (
	"context"

	"github.com/addispay/backend/internal/content/domain"
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