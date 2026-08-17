package server

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

// SecurityHeaders applies baseline browser security headers (NFR-SEC-001/002).
// TLS is expected at the reverse proxy. When FORCE_HTTPS=true and the proxy
// forwards X-Forwarded-Proto: http, requests are redirected to HTTPS.
func SecurityHeaders() gin.HandlerFunc {
	forceHTTPS := strings.EqualFold(os.Getenv("FORCE_HTTPS"), "true") ||
		os.Getenv("FORCE_HTTPS") == "1"

	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Header("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
		c.Header("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'")

		proto := strings.ToLower(c.GetHeader("X-Forwarded-Proto"))
		if forceHTTPS && proto == "http" {
			host := c.Request.Host
			target := "https://" + host + c.Request.URL.RequestURI()
			c.Redirect(http.StatusMovedPermanently, target)
			c.Abort()
			return
		}

		if proto == "https" || c.Request.TLS != nil {
			c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		}

		c.Next()
	}
}
