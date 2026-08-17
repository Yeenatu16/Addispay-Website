package response

import (
	"errors"
	"log"
	"net/http"
	"strings"

	"github.com/addispay/backend/internal/apperr"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

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

// FromError maps errors to user-friendly JSON responses (NFR-REL-002).
// Unexpected/internal errors are logged and never returned verbatim.
func FromError(c *gin.Context, err error) {
	if err == nil {
		return
	}

	if ae, ok := apperr.As(err); ok {
		if ae.Kind == apperr.KindInternal && ae.Unwrap() != nil {
			log.Printf("[api] internal error: %v", ae.Unwrap())
		}
		Error(c, ae.HTTPStatus(), ae.Message)
		return
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		Error(c, http.StatusNotFound, "Resource not found")
		return
	}

	var ve validator.ValidationErrors
	if errors.As(err, &ve) {
		Error(c, http.StatusBadRequest, validationMessage(ve))
		return
	}

	log.Printf("[api] unexpected error: %v", err)
	Error(c, http.StatusInternalServerError, "Something went wrong. Please try again later.")
}

// BindJSON binds and validates the request body. On failure it writes a 400 response.
func BindJSON(c *gin.Context, dst any) bool {
	if err := c.ShouldBindJSON(dst); err != nil {
		var ve validator.ValidationErrors
		if errors.As(err, &ve) {
			Error(c, http.StatusBadRequest, validationMessage(ve))
			return false
		}
		Error(c, http.StatusBadRequest, "Invalid request payload")
		return false
	}
	return true
}

func validationMessage(ve validator.ValidationErrors) string {
	if len(ve) == 0 {
		return "Invalid request payload"
	}
	field := ve[0]
	name := field.Field()
	switch field.Tag() {
	case "required":
		return name + " is required"
	case "email":
		return name + " must be a valid email address"
	case "min":
		return name + " is too short"
	case "max":
		return name + " is too long"
	case "oneof":
		return name + " has an invalid value"
	case "url":
		return name + " must be a valid URL"
	default:
		return "Invalid " + strings.ToLower(name)
	}
}
