package repository

import (
	"context"

	"github.com/addispay/backend/internal/careers/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type careerRepository struct {
	db *gorm.DB
}

func NewCareerRepository(db *gorm.DB) domain.CareerRepository {
	return &careerRepository{db: db}
}

func (r *careerRepository) CreateJob(ctx context.Context, job *domain.JobPosting) error {
	return r.db.WithContext(ctx).Create(job).Error
}

func (r *careerRepository) GetJobByID(ctx context.Context, id uuid.UUID) (*domain.JobPosting, error) {
	var job domain.JobPosting
	if err := r.db.WithContext(ctx).First(&job, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &job, nil
}

func (r *careerRepository) ListOpenJobs(ctx context.Context) ([]domain.JobPosting, error) {
	var jobs []domain.JobPosting
	err := r.db.WithContext(ctx).Where("is_open = ?", true).Order("created_at DESC").Find(&jobs).Error
	return jobs, err
}

func (r *careerRepository) ListAllJobs(ctx context.Context) ([]domain.JobPosting, error) {
	var jobs []domain.JobPosting
	err := r.db.WithContext(ctx).Order("created_at DESC").Find(&jobs).Error
	return jobs, err
}

func (r *careerRepository) UpdateJob(ctx context.Context, job *domain.JobPosting) error {
	return r.db.WithContext(ctx).Save(job).Error
}

func (r *careerRepository) DeleteJob(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.JobPosting{}, "id = ?", id).Error
}

func (r *careerRepository) ApplyForJob(ctx context.Context, app *domain.JobApplication) error {
	return r.db.WithContext(ctx).Create(app).Error
}

func (r *careerRepository) ListApplicationsByJob(ctx context.Context, jobID uuid.UUID) ([]domain.JobApplication, error) {
	var apps []domain.JobApplication
	err := r.db.WithContext(ctx).Where("job_id = ?", jobID).Order("applied_at DESC").Find(&apps).Error
	return apps, err
}

func (r *careerRepository) ListAllApplications(ctx context.Context) ([]domain.JobApplication, error) {
	var apps []domain.JobApplication
	err := r.db.WithContext(ctx).Order("applied_at DESC").Find(&apps).Error
	return apps, err
}

func (r *careerRepository) GetApplicationByID(ctx context.Context, id uuid.UUID) (*domain.JobApplication, error) {
	var app domain.JobApplication
	if err := r.db.WithContext(ctx).First(&app, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &app, nil
}

func (r *careerRepository) UpdateApplicationStatus(ctx context.Context, appID uuid.UUID, status domain.ApplicationStatus) error {
	return r.db.WithContext(ctx).
		Model(&domain.JobApplication{}).
		Where("id = ?", appID).
		Update("status", status).Error
}
