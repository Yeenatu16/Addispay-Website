package repository

import (
	"github.com/addispay/backend/internal/news/domain"
	"gorm.io/gorm"
)

type NewsRepository struct {
	db *gorm.DB
}

func NewNewsRepository(db *gorm.DB) *NewsRepository {
	return &NewsRepository{db: db}
}

func (r *NewsRepository) Create(news *domain.News) error {
	return r.db.Create(news).Error
}

func (r *NewsRepository) FindAll() ([]domain.News, error) {
	var news []domain.News

	err := r.db.Order("created_at DESC").Find(&news).Error

	return news, err
}

func (r *NewsRepository) FindByID(id uint) (*domain.News, error) {
	var news domain.News

	err := r.db.First(&news, id).Error
	if err != nil {
		return nil, err
	}

	return &news, nil
}

func (r *NewsRepository) Update(news *domain.News) error {
	return r.db.Save(news).Error
}

func (r *NewsRepository) Delete(id uint) error {
	return r.db.Delete(&domain.News{}, id).Error
}