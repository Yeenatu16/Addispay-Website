package server

import (
	"github.com/addispay/backend/internal/news/delivery"
	"github.com/addispay/backend/internal/news/repository"
	"github.com/addispay/backend/internal/news/usecase"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
	router := gin.Default()

	// News
	newsRepository := repository.NewNewsRepository(db)
	newsUsecase := usecase.NewNewsUsecase(newsRepository)
	newsHandler := delivery.NewNewsHandler(newsUsecase)

	api := router.Group("/api/v1")

	news := api.Group("/news")
	{
		news.POST("", newsHandler.Create)
		news.GET("", newsHandler.GetAll)
		news.GET("/:id", newsHandler.GetByID)
		news.PUT("/:id", newsHandler.Update)
		news.DELETE("/:id", newsHandler.Delete)
	}

	api.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"success": true,
			"message": "AddisPay API is running",
		})
	})

	return router
}