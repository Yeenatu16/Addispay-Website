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
	usecase  domain.CareerUsecase
	userName func(*gin.Context) string
}

func NewCareerHandler(usecase domain.CareerUsecase) *CareerHandler {
	return &CareerHandler{
		usecase:  usecase,
		userName: func(*gin.Context) string { return "Administrator" },
	}
}

func (h *CareerHandler) SetUserNameResolver(fn func(*gin.Context) string) {
	if fn != nil {
		h.userName = fn
	}
}

type PostJobRequest struct {
	Title        string         `json:"title" binding:"required,max=255"`
	Department   string         `json:"department" binding:"required,max=255"`
	Location     string         `json:"location" binding:"required,max=255"`
	JobType      domain.JobType `json:"jobType" binding:"omitempty,oneof=FULL_TIME PART_TIME REMOTE"`
	Description  string         `json:"description" binding:"required"`
	Requirements string         `json:"requirements" binding:"required"`
}

type UpdateJobRequest struct {
	Title        *string         `json:"title" binding:"omitempty,max=255"`
	Department   *string         `json:"department" binding:"omitempty,max=255"`
	Location     *string         `json:"location" binding:"omitempty,max=255"`
	JobType      *domain.JobType `json:"jobType" binding:"omitempty,oneof=FULL_TIME PART_TIME REMOTE"`
	Description  *string         `json:"description"`
	Requirements *string         `json:"requirements"`
	IsOpen       *bool           `json:"isOpen"`
}

type ApplyJobRequest struct {
	JobID        string `json:"jobId" binding:"required,uuid"`
	FullName     string `json:"fullName" binding:"required,max=255"`
	Email        string `json:"email" binding:"required,email,max=255"`
	PhoneNumber  string `json:"phoneNumber" binding:"required,max=50"`
	CoverLetter  string `json:"coverLetter" binding:"required"`
	CvURL        string `json:"cvUrl" binding:"required,url,max=500"`
	LinkedinURL  string `json:"linkedinUrl" binding:"omitempty,url,max=500"`
	PortfolioURL string `json:"portfolioUrl" binding:"omitempty,url,max=500"`
}

type UpdateApplicationStatusRequest struct {
	Status domain.ApplicationStatus `json:"status" binding:"required,oneof=PENDING REVIEWED SHORTLISTED REJECTED"`
}

func (h *CareerHandler) CreateJob(c *gin.Context) {
	actorID, ok := currentUserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	var req PostJobRequest
	if !response.BindJSON(c, &req) {
		return
	}

	job, err := h.usecase.PostJob(
		c.Request.Context(),
		actorID,
		h.userName(c),
		req.Title,
		req.Department,
		req.Location,
		req.Description,
		req.Requirements,
		req.JobType,
	)
	if err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, job)
}

func (h *CareerHandler) UpdateJob(c *gin.Context) {
	actorID, ok := currentUserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid job ID")
		return
	}

	var req UpdateJobRequest
	if !response.BindJSON(c, &req) {
		return
	}

	job, err := h.usecase.UpdateJob(c.Request.Context(), actorID, h.userName(c), id, domain.UpdateJobInput{
		Title:        req.Title,
		Department:   req.Department,
		Location:     req.Location,
		JobType:      req.JobType,
		Description:  req.Description,
		Requirements: req.Requirements,
		IsOpen:       req.IsOpen,
	})
	if err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusOK, job)
}

func (h *CareerHandler) DeleteJob(c *gin.Context) {
	actorID, ok := currentUserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid job ID")
		return
	}

	if err := h.usecase.DeleteJob(c.Request.Context(), actorID, h.userName(c), id); err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusOK, map[string]string{"message": "Job deleted"})
}

func (h *CareerHandler) GetAdminJob(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid job ID")
		return
	}

	job, err := h.usecase.GetJobByID(c.Request.Context(), id)
	if err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusOK, job)
}

func (h *CareerHandler) ListAdminJobs(c *gin.Context) {
	jobs, err := h.usecase.ListAllJobs(c.Request.Context())
	if err != nil {
		response.FromError(c, err)
		return
	}
	response.Success(c, http.StatusOK, jobs)
}

func (h *CareerHandler) GetOpenJobs(c *gin.Context) {
	jobs, err := h.usecase.GetOpenJobs(c.Request.Context())
	if err != nil {
		response.FromError(c, err)
		return
	}
	response.Success(c, http.StatusOK, jobs)
}

func (h *CareerHandler) ApplyForJob(c *gin.Context) {
	var req ApplyJobRequest
	if !response.BindJSON(c, &req) {
		return
	}

	jobUUID, err := uuid.Parse(req.JobID)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid Job ID")
		return
	}

	app, err := h.usecase.SubmitApplication(
		c.Request.Context(),
		jobUUID,
		req.FullName,
		req.Email,
		req.PhoneNumber,
		req.CoverLetter,
		req.CvURL,
		req.LinkedinURL,
		req.PortfolioURL,
	)
	if err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, app)
}

func (h *CareerHandler) ListApplications(c *gin.Context) {
	var jobID *uuid.UUID
	if raw := c.Query("jobId"); raw != "" {
		id, err := uuid.Parse(raw)
		if err != nil {
			response.Error(c, http.StatusBadRequest, "Invalid jobId")
			return
		}
		jobID = &id
	}

	apps, err := h.usecase.ListApplications(c.Request.Context(), jobID)
	if err != nil {
		response.FromError(c, err)
		return
	}
	response.Success(c, http.StatusOK, apps)
}

func (h *CareerHandler) UpdateApplicationStatus(c *gin.Context) {
	actorID, ok := currentUserID(c)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	appID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid application ID")
		return
	}

	var req UpdateApplicationStatusRequest
	if !response.BindJSON(c, &req) {
		return
	}

	app, err := h.usecase.UpdateApplicationStatus(c.Request.Context(), actorID, h.userName(c), appID, req.Status)
	if err != nil {
		response.FromError(c, err)
		return
	}

	response.Success(c, http.StatusOK, app)
}

func currentUserID(c *gin.Context) (uuid.UUID, bool) {
	raw, exists := c.Get(string(authhttp.UserIDKey))
	if !exists {
		return uuid.Nil, false
	}
	id, err := uuid.Parse(raw.(string))
	if err != nil {
		return uuid.Nil, false
	}
	return id, true
}
