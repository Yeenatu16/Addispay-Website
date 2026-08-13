package http

import (
	"net/http"

	authhttp "github.com/addispay/backend/internal/auth/delivery/http"
	"github.com/addispay/backend/internal/careers/domain"
	"github.com/addispay/backend/internal/response"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CareerHandler struct {
	usecase domain.CareerUsecase
}

func NewCareerHandler(usecase domain.CareerUsecase) *CareerHandler {
	return &CareerHandler{usecase: usecase}
}

type PostJobRequest struct {
	Title        string         `json:"title"`
	Department   string         `json:"department"`
	Location     string         `json:"location"`
	JobType      domain.JobType `json:"jobType"`
	Description  string         `json:"description"`
	Requirements string         `json:"requirements"`
}

type ApplyJobRequest struct {
	JobID        string `json:"jobId"`
	FullName     string `json:"fullName"`
	Email        string `json:"email"`
	PhoneNumber  string `json:"phoneNumber"`
	CoverLetter  string `json:"coverLetter"`
	CvURL        string `json:"cvUrl"`
	LinkedinURL  string `json:"linkedinUrl"`
	PortfolioURL string `json:"portfolioUrl"`
}

func (h *CareerHandler) CreateJob(c *gin.Context) {
	userIDVal, exists := c.Get(string(authhttp.UserIDKey))
	if !exists {
		response.Error(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	userIDStr := userIDVal.(string)
	createdBy, err := uuid.Parse(userIDStr)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	var req PostJobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	job, err := h.usecase.PostJob(c.Request.Context(), createdBy, req.Title, req.Department, req.Location, req.Description, req.Requirements, req.JobType)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, job)
}

func (h *CareerHandler) GetOpenJobs(c *gin.Context) {
	jobs, err := h.usecase.GetOpenJobs(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, jobs)
}

func (h *CareerHandler) ApplyForJob(c *gin.Context) {
	var req ApplyJobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	jobUUID, err := uuid.Parse(req.JobID)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid Job ID")
		return
	}

	app, err := h.usecase.SubmitApplication(c.Request.Context(), jobUUID, req.FullName, req.Email, req.PhoneNumber, req.CoverLetter, req.CvURL, req.LinkedinURL, req.PortfolioURL)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, app)
}