package repository

import (
	"context"

	"github.com/addispay/backend/internal/careers/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CareerRepository struct {
	db *gorm.DB
}

func NewCareerRepository(db *gorm.DB) domain.CareerRepository {
	return &CareerRepository{db: db}
}

func (r *CareerRepository) CreateJob(ctx context.Context, job *domain.JobPosting) error {
	return r.db.WithContext(ctx).Create(job).Error
}

func (r *CareerRepository) GetJobByID(ctx context.Context, id uuid.UUID) (*domain.JobPosting, error) {
	var job domain.JobPosting
	err := r.db.WithContext(ctx).First(&job, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &job, nil
}

func (r *CareerRepository) ListOpenJobs(ctx context.Context) ([]domain.JobPosting, error) {
	var jobs []domain.JobPosting
	err := r.db.WithContext(ctx).Where("is_open = ?", true).Find(&jobs).Error
	if err != nil {
		return nil, err
	}
	return jobs, nil
}

func (r *CareerRepository) ApplyForJob(ctx context.Context, app *domain.JobApplication) error {
	return r.db.WithContext(ctx).Create(app).Error
}
