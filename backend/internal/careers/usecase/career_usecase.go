package usecase

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/addispay/backend/internal/apperr"
	"github.com/addispay/backend/internal/careers/domain"
	"github.com/addispay/backend/internal/sanitize"
	"github.com/addispay/backend/internal/validate"
)

type careerUsecase struct {
	repo  domain.CareerRepository
	audit domain.AuditLogger
}

func NewCareerUsecase(repo domain.CareerRepository, audit domain.AuditLogger) domain.CareerUsecase {
	return &careerUsecase{repo: repo, audit: audit}
}

func (u *careerUsecase) PostJob(
	ctx context.Context,
	createdBy uuid.UUID,
	actorName, title, department, location, desc, reqs string,
	jobType domain.JobType,
) (*domain.JobPosting, error) {
	title = sanitize.Text(title)
	department = sanitize.Text(department)
	location = sanitize.Text(location)
	desc = sanitize.Text(desc)
	reqs = sanitize.Text(reqs)

	for _, check := range []struct {
		v, name string
		max     int
	}{
		{title, "title", validate.MaxTitle},
		{department, "department", validate.MaxTitle},
		{location, "location", validate.MaxTitle},
		{desc, "description", validate.MaxLongText},
		{reqs, "requirements", validate.MaxLongText},
	} {
		if err := validate.Required(check.v, check.name); err != nil {
			return nil, err
		}
		if err := validate.MaxLen(check.v, check.name, check.max); err != nil {
			return nil, err
		}
	}

	if jobType == "" {
		jobType = domain.JobTypeFullTime
	}
	if !jobType.IsValid() {
		return nil, apperr.BadRequest("jobType must be FULL_TIME, PART_TIME, or REMOTE")
	}

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
		return nil, apperr.Internal(err)
	}
	if u.audit != nil {
		_ = u.audit.LogCareerAction(ctx, createdBy, actorName, domain.AuditCreate, job.Title)
	}
	return job, nil
}

func (u *careerUsecase) UpdateJob(
	ctx context.Context,
	actorID uuid.UUID,
	actorName string,
	id uuid.UUID,
	input domain.UpdateJobInput,
) (*domain.JobPosting, error) {
	job, err := u.repo.GetJobByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperr.NotFound("job not found")
		}
		return nil, apperr.Internal(err)
	}

	wasOpen := job.IsOpen

	if input.Title != nil {
		title := sanitize.Text(*input.Title)
		if err := validate.Required(title, "title"); err != nil {
			return nil, err
		}
		job.Title = title
	}
	if input.Department != nil {
		v := sanitize.Text(*input.Department)
		if err := validate.Required(v, "department"); err != nil {
			return nil, err
		}
		job.Department = v
	}
	if input.Location != nil {
		v := sanitize.Text(*input.Location)
		if err := validate.Required(v, "location"); err != nil {
			return nil, err
		}
		job.Location = v
	}
	if input.JobType != nil {
		if !input.JobType.IsValid() || *input.JobType == "" {
			return nil, apperr.BadRequest("jobType must be FULL_TIME, PART_TIME, or REMOTE")
		}
		job.JobType = *input.JobType
	}
	if input.Description != nil {
		v := sanitize.Text(*input.Description)
		if err := validate.Required(v, "description"); err != nil {
			return nil, err
		}
		job.Description = v
	}
	if input.Requirements != nil {
		v := sanitize.Text(*input.Requirements)
		if err := validate.Required(v, "requirements"); err != nil {
			return nil, err
		}
		job.Requirements = v
	}
	if input.IsOpen != nil {
		job.IsOpen = *input.IsOpen
	}

	if err := u.repo.UpdateJob(ctx, job); err != nil {
		return nil, apperr.Internal(err)
	}

	action := domain.AuditEdit
	if wasOpen && !job.IsOpen {
		action = domain.AuditClose
	} else if !wasOpen && job.IsOpen {
		action = domain.AuditOpen
	}
	if u.audit != nil {
		_ = u.audit.LogCareerAction(ctx, actorID, actorName, action, job.Title)
	}
	return job, nil
}

func (u *careerUsecase) DeleteJob(ctx context.Context, actorID uuid.UUID, actorName string, id uuid.UUID) error {
	job, err := u.repo.GetJobByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return apperr.NotFound("job not found")
		}
		return apperr.Internal(err)
	}
	if err := u.repo.DeleteJob(ctx, id); err != nil {
		return apperr.Internal(err)
	}
	if u.audit != nil {
		_ = u.audit.LogCareerAction(ctx, actorID, actorName, domain.AuditDelete, job.Title)
	}
	return nil
}

func (u *careerUsecase) GetJobByID(ctx context.Context, id uuid.UUID) (*domain.JobPosting, error) {
	job, err := u.repo.GetJobByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperr.NotFound("job not found")
		}
		return nil, apperr.Internal(err)
	}
	return job, nil
}

func (u *careerUsecase) GetOpenJobs(ctx context.Context) ([]domain.JobPosting, error) {
	jobs, err := u.repo.ListOpenJobs(ctx)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return jobs, nil
}

func (u *careerUsecase) ListAllJobs(ctx context.Context) ([]domain.JobPosting, error) {
	jobs, err := u.repo.ListAllJobs(ctx)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return jobs, nil
}

func (u *careerUsecase) SubmitApplication(
	ctx context.Context,
	jobID uuid.UUID,
	fullName, email, phone, coverLetter, cvURL, linkedin, portfolio string,
) (*domain.JobApplication, error) {
	job, err := u.repo.GetJobByID(ctx, jobID)
	if err != nil || !job.IsOpen {
		return nil, apperr.BadRequest("job posting is not open for applications")
	}

	fullName = sanitize.Text(fullName)
	phone = sanitize.Text(phone)
	coverLetter = sanitize.Text(coverLetter)
	email, err = validate.Email(email)
	if err != nil {
		return nil, err
	}
	if err := validate.Required(fullName, "fullName"); err != nil {
		return nil, err
	}
	if err := validate.Required(phone, "phoneNumber"); err != nil {
		return nil, err
	}
	if err := validate.MaxLen(phone, "phoneNumber", validate.MaxPhone); err != nil {
		return nil, err
	}
	if err := validate.Required(coverLetter, "coverLetter"); err != nil {
		return nil, err
	}
	if err := validate.MaxLen(coverLetter, "coverLetter", validate.MaxLongText); err != nil {
		return nil, err
	}
	cvURL, err = validate.OptionalURL(cvURL, "cvUrl")
	if err != nil {
		return nil, err
	}
	if cvURL == "" {
		return nil, apperr.BadRequest("cvUrl is required")
	}
	linkedin, err = validate.OptionalURL(linkedin, "linkedinUrl")
	if err != nil {
		return nil, err
	}
	portfolio, err = validate.OptionalURL(portfolio, "portfolioUrl")
	if err != nil {
		return nil, err
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
		AppliedAt:    time.Now(),
	}
	if err := u.repo.ApplyForJob(ctx, app); err != nil {
		return nil, apperr.Internal(err)
	}
	return app, nil
}

func (u *careerUsecase) ListApplications(ctx context.Context, jobID *uuid.UUID) ([]domain.JobApplication, error) {
	var (
		apps []domain.JobApplication
		err  error
	)
	if jobID != nil {
		apps, err = u.repo.ListApplicationsByJob(ctx, *jobID)
	} else {
		apps, err = u.repo.ListAllApplications(ctx)
	}
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return apps, nil
}

func (u *careerUsecase) UpdateApplicationStatus(
	ctx context.Context,
	actorID uuid.UUID,
	actorName string,
	appID uuid.UUID,
	status domain.ApplicationStatus,
) (*domain.JobApplication, error) {
	switch status {
	case domain.AppPending, domain.AppReviewed, domain.AppShortlisted, domain.AppRejected:
	default:
		return nil, apperr.BadRequest("status must be PENDING, REVIEWED, SHORTLISTED, or REJECTED")
	}

	app, err := u.repo.GetApplicationByID(ctx, appID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperr.NotFound("application not found")
		}
		return nil, apperr.Internal(err)
	}
	if err := u.repo.UpdateApplicationStatus(ctx, appID, status); err != nil {
		return nil, apperr.Internal(err)
	}
	app.Status = status
	if u.audit != nil {
		_ = u.audit.LogCareerAction(ctx, actorID, actorName, domain.AuditEdit, "application:"+app.Email+"→"+string(status))
	}
	return app, nil
}
