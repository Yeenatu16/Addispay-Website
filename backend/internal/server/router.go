<<<<<<< Updated upstream
=======
package server

import (
	"net/http"

	authDelivery "github.com/addispay/backend/internal/auth/delivery/http"
	careersDelivery "github.com/addispay/backend/internal/careers/delivery/http"
	contentDelivery "github.com/addispay/backend/internal/content/delivery/http"
	newsDelivery "github.com/addispay/backend/internal/news/delivery/http"
	"github.com/gin-gonic/gin"
)

func NewRouter(
	jwtSecret string,
	authH *authDelivery.AuthHandler,
	newsH *newsDelivery.NewsHandler,
	careersH *careersDelivery.CareerHandler,
	contentH *contentDelivery.ContentHandler,
) *gin.Engine {
	r := gin.Default()

	// Public Routes
	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "UP", "engine": "GORM"})
		})

		// Auth
		v1.POST("/auth/login", authH.Login)
		v1.POST("/auth/register", authH.Register)

		// Dynamic Public Website APIs
		v1.GET("/news/homepage", newsH.GetHomepageNews)
		v1.GET("/news", newsH.GetNewsListing)
		v1.GET("/news/:slug", newsH.GetArticleBySlug)

		v1.GET("/careers", careersH.GetOpenJobs)
		v1.POST("/careers/apply", careersH.ApplyForJob)

		v1.POST("/content/subscribe", contentH.Subscribe)
		v1.POST("/content/contact", contentH.ContactUs)

		// Protected Admin Routes (JWT Required)
		admin := v1.Group("")
		admin.Use(authDelivery.GinAuthMiddleware(jwtSecret))
		{
			admin.POST("/news/articles", newsH.CreateArticle)

			admin.POST("/careers/jobs", careersH.CreateJob)
		}
	}

	return r
}
>>>>>>> Stashed changes
