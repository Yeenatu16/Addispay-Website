package server

import (
	"net/http"
	"path/filepath"

	authDelivery "github.com/addispay/backend/internal/auth/delivery/http"
	"github.com/addispay/backend/internal/auth/domain"
	careersDelivery "github.com/addispay/backend/internal/careers/delivery/http"
	contentDelivery "github.com/addispay/backend/internal/content/delivery/http"
	newsDelivery "github.com/addispay/backend/internal/news/delivery/http"
	"github.com/gin-gonic/gin"
)

func NewRouter(
	jwtSecret string,
	uploadDir string,
	users authDelivery.UserLookup,
	authH *authDelivery.AuthHandler,
	newsH *newsDelivery.NewsHandler,
	careersH *careersDelivery.CareerHandler,
	contentH *contentDelivery.ContentHandler,
) *gin.Engine {
	r := gin.Default()
	r.Use(SecurityHeaders())

	// Serve uploaded cover images
	r.Static("/uploads", filepath.Clean(uploadDir))

	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "UP", "engine": "GORM"})
		})

		// Auth (public)
		v1.POST("/auth/login", authH.Login)
		v1.POST("/auth/register", authH.Register)
		v1.POST("/auth/forgot-password", authH.ForgotPassword)
		v1.POST("/auth/reset-password", authH.ResetPassword)
		v1.GET("/auth/invitations", authH.GetInvitation)
		v1.POST("/auth/accept-invitation", authH.AcceptInvitation)

		// Public website APIs
		v1.GET("/news/homepage", newsH.GetHomepageNews)
		v1.GET("/news", newsH.GetNewsListing)
		v1.GET("/news/:slug", newsH.GetArticleBySlug)

		v1.GET("/careers", careersH.GetOpenJobs)
		v1.POST("/careers/apply", careersH.ApplyForJob)

		v1.POST("/content/subscribe", contentH.Subscribe)
		v1.POST("/content/contact", contentH.ContactUs)

		// Protected admin routes
		admin := v1.Group("admin")
		admin.Use(authDelivery.GinAuthMiddleware(jwtSecret, users))
		{
			// News — Super Admin + Marketer
			newsAdmin := admin.Group("")
			newsAdmin.Use(authDelivery.RequireRoles(domain.RoleSuperAdmin, domain.RoleMarketer))
			{
				newsAdmin.GET("/news/articles", newsH.ListAdminArticles)
				newsAdmin.GET("/news/articles/:id", newsH.GetAdminArticle)
				newsAdmin.POST("/news/articles", newsH.CreateArticle)
				newsAdmin.PUT("/news/articles/:id", newsH.UpdateArticle)
				newsAdmin.DELETE("/news/articles/:id", newsH.DeleteArticle)
				newsAdmin.POST("/news/upload", newsH.UploadCoverImage)

				newsAdmin.GET("/news/settings", contentH.GetNewsSettings)
				newsAdmin.PUT("/news/settings", contentH.UpdateNewsSettings)
				newsAdmin.GET("/news/audit-logs", contentH.ListNewsAuditLogs)
			}

			// Careers — Super Admin + HR (Career Manager)
			careersAdmin := admin.Group("")
			careersAdmin.Use(authDelivery.RequireRoles(domain.RoleSuperAdmin, domain.RoleHR))
			{
				careersAdmin.GET("/careers/jobs", careersH.ListAdminJobs)
				careersAdmin.GET("/careers/jobs/:id", careersH.GetAdminJob)
				careersAdmin.POST("/careers/jobs", careersH.CreateJob)
				careersAdmin.PUT("/careers/jobs/:id", careersH.UpdateJob)
				careersAdmin.DELETE("/careers/jobs/:id", careersH.DeleteJob)

				careersAdmin.GET("/careers/applications", careersH.ListApplications)
				careersAdmin.PUT("/careers/applications/:id/status", careersH.UpdateApplicationStatus)

				careersAdmin.GET("/careers/audit-logs", contentH.ListCareersAuditLogs)
			}

			// User / invitation management — Super Admin only
			super := admin.Group("")
			super.Use(authDelivery.RequireRoles(domain.RoleSuperAdmin))
			{
				super.POST("/invitations", authH.InviteAdmin)
				super.GET("/invitations", authH.ListInvitations)
				super.DELETE("/invitations/:id", authH.CancelInvitation)

				super.GET("/users", authH.ListAdministrators)
				super.POST("/users/:id/revoke", authH.RevokeAdministrator)
				super.POST("/users/:id/restore", authH.RestoreAdministrator)
			}
		}
	}

	return r
}
