package usecase

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/addispay/backend/internal/careers/domain"
)

type careerUsecase struct {
	repo domain.CareerRepository
}

func NewCareerUsecase(repo domain.CareerRepository) domain.CareerUsecase {
	return &careerUsecase{repo: repo}
}

func (u *careerUsecase) PostJob(ctx context.Context, createdBy uuid.UUID, title, department, location, desc, reqs string, jobType domain.JobType) (*domain.JobPosting, error) {
	job := &domain.JobPosting{
		Title:        title,
		Department:   department,
		Location:     location,
		JobType:      jobType,
		Description:  desc,
		Requirements: reqs,
		IsOpen:       true,
		CreatedByID:  createdBy,
	}

	if err := u.repo.CreateJob(ctx, job); err != nil {
		return nil, err
	}

	return job, nil
}

func (u *careerUsecase) GetOpenJobs(ctx context.Context) ([]domain.JobPosting, error) {
	return u.repo.ListOpenJobs(ctx)
}

func (u *careerUsecase) SubmitApplication(ctx context.Context, jobID uuid.UUID, fullName, email, phone, coverLetter, cvURL, linkedin, portfolio string) (*domain.JobApplication, error) {
	job, err := u.repo.GetJobByID(ctx, jobID)
	if err != nil || !job.IsOpen {
		return nil, errors.New("job posting is not open for applications")
	}

	app := &domain.JobApplication{
		JobID:        jobID,
		FullName:     fullName,
		Email:        email,
		PhoneNumber:  phone,
		CoverLetter:  coverLetter,
		CvURL:        cvURL,
		LinkedinURL:  linkedin,
		PortfolioURL: portfolio,
		Status:       domain.AppPending,
	}

	if err := u.repo.ApplyForJob(ctx, app); err != nil {
		return nil, err
	}

	return app, nil
}