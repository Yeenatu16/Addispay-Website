package usecase

import (
	"github.com/addispay/backend/internal/news/domain"
	"github.com/addispay/backend/internal/news/repository"
)

type NewsUsecase struct {
	repository *repository.NewsRepository
}

func NewNewsUsecase(repository *repository.NewsRepository) *NewsUsecase {
	return &NewsUsecase{
		repository: repository,
	}
}

func (u *NewsUsecase) Create(news *domain.News) error {
	return u.repository.Create(news)
}

func (u *NewsUsecase) GetAll() ([]domain.News, error) {
	return u.repository.FindAll()
}

func (u *NewsUsecase) GetByID(id uint) (*domain.News, error) {
	return u.repository.FindByID(id)
}

func (u *NewsUsecase) Update(news *domain.News) error {
	return u.repository.Update(news)
}

func (u *NewsUsecase) Delete(id uint) error {
	return u.repository.Delete(id)
}