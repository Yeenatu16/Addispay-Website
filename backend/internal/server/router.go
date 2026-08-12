package server

import "github.com/gin-gonic/gin"

func SetupRouter() *gin.Engine {
	router := gin.Default()

	api := router.Group("/api/v1")

	api.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"success": true,
			"message": "AddisPay API is running",
		})
	})

	return router
}