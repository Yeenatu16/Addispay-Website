package response

import "github.com/gin-gonic/gin"

func Error(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{
		"success": false,
		"error":   message,
	})
}

func Success(c *gin.Context, status int, data any) {
	c.JSON(status, gin.H{
		"success": true,
		"data":    data,
	})
}