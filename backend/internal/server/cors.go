package server

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// CORS allows the Addispay web frontend to call the API from a different origin.
// Only origins listed in CORS_ALLOWED_ORIGINS are echoed back; unknown origins
// receive no CORS headers and are blocked by the browser (NFR-SEC-001).
func CORS(allowedOrigins []string) gin.HandlerFunc {
	allowed := make(map[string]struct{}, len(allowedOrigins))
	for _, origin := range allowedOrigins {
		if trimmed := strings.TrimRight(strings.TrimSpace(origin), "/"); trimmed != "" {
			allowed[strings.ToLower(trimmed)] = struct{}{}
		}
	}
	_, allowAny := allowed["*"]

	return func(c *gin.Context) {
		origin := strings.TrimRight(c.GetHeader("Origin"), "/")
		_, ok := allowed[strings.ToLower(origin)]

		if origin != "" && (ok || allowAny) {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Access-Control-Allow-Credentials", "true")
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, Origin, X-Requested-With")
			c.Header("Access-Control-Max-Age", "600")
			c.Header("Vary", "Origin")
		}

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
