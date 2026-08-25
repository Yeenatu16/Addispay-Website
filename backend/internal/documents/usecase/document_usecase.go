package usecase

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/addispay/backend/internal/apperr"
	"github.com/addispay/backend/internal/documents/domain"
	"github.com/addispay/backend/internal/sanitize"
	"github.com/addispay/backend/internal/validate"
)

type documentUsecase struct {
	repo domain.DocumentRepository
}

func NewDocumentUsecase(repo domain.DocumentRepository) domain.DocumentUsecase {
	return &documentUsecase{repo: repo}
}

func (u *documentUsecase) Create(ctx context.Context, actorID uuid.UUID, in domain.CreateDocumentInput) (*domain.OfficialDocument, error) {
	title := sanitize.Text(in.Title)
	category := sanitize.Text(in.Category)
	description := sanitize.Text(in.Description)
	fileURL := sanitize.Text(in.FileURL)
	fileSize := sanitize.Text(in.FileSize)
	dateLabel := sanitize.Text(in.DateLabel)

	if err := validate.Required(title, "title"); err != nil {
		return nil, err
	}
	if err := validate.MaxLen(title, "title", validate.MaxTitle); err != nil {
		return nil, err
	}
	if err := validate.Required(category, "category"); err != nil {
		return nil, err
	}
	if err := validate.MaxLen(category, "category", 100); err != nil {
		return nil, err
	}
	if err := validate.Required(description, "description"); err != nil {
		return nil, err
	}
	if err := validate.MaxLen(description, "description", validate.MaxShortText); err != nil {
		return nil, err
	}
	if err := validate.Required(fileURL, "fileUrl"); err != nil {
		return nil, err
	}
	if err := validate.MaxLen(fileURL, "fileUrl", validate.MaxURL); err != nil {
		return nil, err
	}
	if err := validate.Required(fileSize, "fileSize"); err != nil {
		return nil, err
	}
	if dateLabel == "" {
		dateLabel = "Official"
	}
	if in.Pages < 0 {
		return nil, apperr.BadRequest("pages cannot be negative")
	}

	doc := &domain.OfficialDocument{
		Title:       title,
		Category:    category,
		Description: description,
		FileURL:     fileURL,
		FileSize:    fileSize,
		DateLabel:   dateLabel,
		Pages:       in.Pages,
		SortOrder:   in.SortOrder,
		IsPublished: in.IsPublished,
		CreatedByID: actorID,
	}
	if err := u.repo.Create(ctx, doc); err != nil {
		return nil, apperr.Internal(err)
	}
	return doc, nil
}

func (u *documentUsecase) Update(ctx context.Context, id uuid.UUID, in domain.UpdateDocumentInput) (*domain.OfficialDocument, error) {
	doc, err := u.repo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperr.NotFound("document not found")
		}
		return nil, apperr.Internal(err)
	}

	if in.Title != nil {
		title := sanitize.Text(*in.Title)
		if err := validate.Required(title, "title"); err != nil {
			return nil, err
		}
		doc.Title = title
	}
	if in.Category != nil {
		category := sanitize.Text(*in.Category)
		if err := validate.Required(category, "category"); err != nil {
			return nil, err
		}
		if err := validate.MaxLen(category, "category", 100); err != nil {
			return nil, err
		}
		doc.Category = category
	}
	if in.Description != nil {
		desc := sanitize.Text(*in.Description)
		if err := validate.Required(desc, "description"); err != nil {
			return nil, err
		}
		doc.Description = desc
	}
	if in.FileURL != nil {
		url := sanitize.Text(*in.FileURL)
		if err := validate.Required(url, "fileUrl"); err != nil {
			return nil, err
		}
		doc.FileURL = url
	}
	if in.FileSize != nil {
		doc.FileSize = sanitize.Text(*in.FileSize)
	}
	if in.DateLabel != nil {
		doc.DateLabel = sanitize.Text(*in.DateLabel)
	}
	if in.Pages != nil {
		if *in.Pages < 0 {
			return nil, apperr.BadRequest("pages cannot be negative")
		}
		doc.Pages = *in.Pages
	}
	if in.SortOrder != nil {
		doc.SortOrder = *in.SortOrder
	}
	if in.IsPublished != nil {
		doc.IsPublished = *in.IsPublished
	}

	if err := u.repo.Update(ctx, doc); err != nil {
		return nil, apperr.Internal(err)
	}
	return doc, nil
}

func (u *documentUsecase) Delete(ctx context.Context, id uuid.UUID) error {
	if _, err := u.repo.GetByID(ctx, id); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return apperr.NotFound("document not found")
		}
		return apperr.Internal(err)
	}
	if err := u.repo.Delete(ctx, id); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (u *documentUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.OfficialDocument, error) {
	doc, err := u.repo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperr.NotFound("document not found")
		}
		return nil, apperr.Internal(err)
	}
	return doc, nil
}

func (u *documentUsecase) ListPublished(ctx context.Context) ([]domain.OfficialDocument, error) {
	docs, err := u.repo.ListPublished(ctx)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return docs, nil
}

func (u *documentUsecase) ListAll(ctx context.Context) ([]domain.OfficialDocument, error) {
	docs, err := u.repo.ListAll(ctx)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return docs, nil
}

func (u *documentUsecase) ListCategories(ctx context.Context) ([]string, error) {
	cats, err := u.repo.ListCategories(ctx)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return cats, nil
}
