package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type JobType string

const (
	JobTypeFullTime JobType = "FULL_TIME"
	JobTypePartTime JobType = "PART_TIME"
	JobTypeRemote   JobType = "REMOTE"
)

type ApplicationStatus string

const (
	AppPending    ApplicationStatus = "PENDING"
	AppReviewed   ApplicationStatus = "REVIEWED"
	AppShortlisted ApplicationStatus = "SHORTLISTED"
	AppRejected   ApplicationStatus = "REJECTED"
)

type JobPosting struct {
	ID           uuid.UUID        `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Title        string           `gorm:"type:varchar(255);not null" json:"title"`
	Department   string           `gorm:"type:varchar(255);not null" json:"department"`
	Location     string           `gorm:"type:varchar(255);not null" json:"location"`
	JobType      JobType          `gorm:"type:varchar(50);default:'FULL_TIME'" json:"jobType"`
	Description  string           `gorm:"type:text;not null" json:"description"`
	Requirements string           `gorm:"type:text;not null" json:"requirements"`
	IsOpen       bool             `gorm:"default:true" json:"isOpen"`
	CreatedByID  uuid.UUID        `gorm:"type:uuid;not null" json:"createdById"`
	CreatedAt    time.Time        `json:"createdAt"`
	UpdatedAt    time.Time        `json:"updatedAt"`
	Applications []JobApplication `gorm:"foreignKey:JobID;constraint:OnDelete:CASCADE" json:"applications,omitempty"`
}

type JobApplication struct {
	ID           uuid.UUID         `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	JobID        uuid.UUID         `gorm:"type:uuid;not null;index" json:"jobId"`
	FullName     string            `gorm:"type:varchar(255);not null" json:"fullName"`
	Email        string            `gorm:"type:varchar(255);not null" json:"email"`
	PhoneNumber  string            `gorm:"type:varchar(50);not null" json:"phoneNumber"`
	CoverLetter  string            `gorm:"type:text;not null" json:"coverLetter"`
	CvURL        string            `gorm:"type:varchar(500);not null" json:"cvUrl"`
	LinkedinURL  string            `gorm:"type:varchar(500)" json:"linkedinUrl"`
	PortfolioURL string            `gorm:"type:varchar(500)" json:"portfolioUrl"`
	Status       ApplicationStatus `gorm:"type:varchar(50);default:'PENDING'" json:"status"`
	AppliedAt    time.Time         `json:"appliedAt"`
}

type CareerRepository interface {
	CreateJob(ctx context.Context, job *JobPosting) error
	GetJobByID(ctx context.Context, id uuid.UUID) (*JobPosting, error)
	ListOpenJobs(ctx context.Context) ([]JobPosting, error)
	ApplyForJob(ctx context.Context, app *JobApplication) error
}

type CareerUsecase interface {
	PostJob(ctx context.Context, createdBy uuid.UUID, title, department, location, desc, reqs string, jobType JobType) (*JobPosting, error)
	GetOpenJobs(ctx context.Context) ([]JobPosting, error)
	SubmitApplication(ctx context.Context, jobID uuid.UUID, fullName, email, phone, coverLetter, cvURL, linkedin, portfolio string) (*JobApplication, error)
}