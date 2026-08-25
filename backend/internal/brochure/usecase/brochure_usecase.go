package usecase

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/addispay/backend/internal/apperr"
	"github.com/addispay/backend/internal/brochure/domain"
	"github.com/addispay/backend/internal/sanitize"
	"github.com/addispay/backend/internal/validate"
)

type brochureUsecase struct {
	repo domain.BrochureRepository
}

func NewBrochureUsecase(repo domain.BrochureRepository) domain.BrochureUsecase {
	return &brochureUsecase{repo: repo}
}

func (u *brochureUsecase) Create(ctx context.Context, actorID uuid.UUID, in domain.CreateBrochureInput) (*domain.BrochureImage, error) {
	title := sanitize.Text(in.Title)
	imageURL := sanitize.Text(in.ImageURL)

	if title == "" {
		title = "Brochure image"
	}
	if err := validate.MaxLen(title, "title", validate.MaxTitle); err != nil {
		return nil, err
	}
	if err := validate.Required(imageURL, "imageUrl"); err != nil {
		return nil, err
	}
	if err := validate.MaxLen(imageURL, "imageUrl", validate.MaxURL); err != nil {
		return nil, err
	}

	img := &domain.BrochureImage{
		Title:       title,
		ImageURL:    imageURL,
		SortOrder:   in.SortOrder,
		IsPublished: in.IsPublished,
		CreatedByID: actorID,
	}
	if err := u.repo.Create(ctx, img); err != nil {
		return nil, apperr.Internal(err)
	}
	return img, nil
}

func (u *brochureUsecase) Update(ctx context.Context, id uuid.UUID, in domain.UpdateBrochureInput) (*domain.BrochureImage, error) {
	img, err := u.repo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperr.NotFound("brochure image not found")
		}
		return nil, apperr.Internal(err)
	}

	if in.Title != nil {
		title := sanitize.Text(*in.Title)
		if title == "" {
			title = "Brochure image"
		}
		img.Title = title
	}
	if in.ImageURL != nil {
		url := sanitize.Text(*in.ImageURL)
		if err := validate.Required(url, "imageUrl"); err != nil {
			return nil, err
		}
		img.ImageURL = url
	}
	if in.SortOrder != nil {
		img.SortOrder = *in.SortOrder
	}
	if in.IsPublished != nil {
		img.IsPublished = *in.IsPublished
	}

	if err := u.repo.Update(ctx, img); err != nil {
		return nil, apperr.Internal(err)
	}
	return img, nil
}

func (u *brochureUsecase) Delete(ctx context.Context, id uuid.UUID) error {
	if _, err := u.repo.GetByID(ctx, id); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return apperr.NotFound("brochure image not found")
		}
		return apperr.Internal(err)
	}
	if err := u.repo.Delete(ctx, id); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (u *brochureUsecase) ListPublished(ctx context.Context) ([]domain.BrochureImage, error) {
	imgs, err := u.repo.ListPublished(ctx)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return imgs, nil
}

func (u *brochureUsecase) ListAll(ctx context.Context) ([]domain.BrochureImage, error) {
	imgs, err := u.repo.ListAll(ctx)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return imgs, nil
}
