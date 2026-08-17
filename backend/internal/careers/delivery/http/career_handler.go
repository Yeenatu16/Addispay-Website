package http

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	authhttp "github.com/addispay/backend/internal/auth/delivery/http"
	"github.com/addispay/backend/internal/careers/domain"
	"github.com/addispay/backend/internal/response"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const maxCVBytes = 5 * 1024 * 1024 // 5 MB

// Applicants upload documents, so the allowlist stays narrow and is checked
// against the sniffed content type rather than the client-supplied extension.
var allowedCVTypes = map[string]string{
	"application/pdf": ".pdf",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
	"application/msword": ".doc",
	"application/zip":    ".docx", // DOCX archives sniff as zip
}

type CareerHandler struct {
	usecase   domain.CareerUsecase
	uploadDir string
	userName  func(*gin.Context) string
}

func NewCareerHandler(usecase domain.CareerUsecase, uploadDir string) *CareerHandler {
	return &CareerHandler{
		usecase:   usecase,
		uploadDir: uploadDir,
		userName:  func(*gin.Context) string { return "Administrator" },
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

// UploadCV accepts an applicant's résumé and returns an absolute URL that can be
// submitted with the application. Public by necessity, so size and type are
// strictly bounded and the stored filename is server-generated (NFR-SEC-005).
func (h *CareerHandler) UploadCV(c *gin.Context) {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		response.Error(c, http.StatusBadRequest, "file is required (multipart field name: file)")
		return
	}
	if fileHeader.Size > maxCVBytes {
		response.Error(c, http.StatusBadRequest, "file exceeds maximum size of 5 MB")
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		response.Error(c, http.StatusBadRequest, "unable to read uploaded file")
		return
	}
	defer file.Close()

	sniff := make([]byte, 512)
	n, _ := file.Read(sniff)
	ext, ok := allowedCVTypes[http.DetectContentType(sniff[:n])]
	if !ok {
		response.Error(c, http.StatusBadRequest, "unsupported format; allowed: PDF, DOC, DOCX")
		return
	}
	if declared := strings.ToLower(filepath.Ext(fileHeader.Filename)); declared == ".pdf" || declared == ".doc" || declared == ".docx" {
		ext = declared
	}

	if _, err := file.Seek(0, io.SeekStart); err != nil {
		response.Error(c, http.StatusInternalServerError, "unable to process uploaded file")
		return
	}

	dir := filepath.Join(h.uploadDir, "cv")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		response.Error(c, http.StatusInternalServerError, "unable to create upload directory")
		return
	}

	filename := fmt.Sprintf("%d_%s%s", time.Now().UnixNano(), uuid.New().String()[:8], ext)
	dest, err := os.OpenFile(filepath.Join(dir, filename), os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0o644)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "unable to save uploaded file")
		return
	}
	defer dest.Close()

	if _, err := io.Copy(dest, io.LimitReader(file, maxCVBytes)); err != nil {
		response.Error(c, http.StatusInternalServerError, "unable to save uploaded file")
		return
	}

	path := "/uploads/cv/" + filename
	response.Success(c, http.StatusCreated, map[string]any{
		"url":      absoluteURL(c, path),
		"path":     path,
		"filename": fileHeader.Filename,
	})
}

// absoluteURL builds a fully-qualified media URL, required because application
// payloads validate cvUrl as an absolute http(s) URL.
func absoluteURL(c *gin.Context, path string) string {
	scheme := "http"
	if forwarded := c.GetHeader("X-Forwarded-Proto"); forwarded != "" {
		scheme = strings.ToLower(forwarded)
	} else if c.Request.TLS != nil {
		scheme = "https"
	}
	return scheme + "://" + c.Request.Host + path
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
