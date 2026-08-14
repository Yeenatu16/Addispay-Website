package http

import (
	"context"
	"net/http"
	"strings"

	"github.com/addispay/backend/internal/auth/domain"
	"github.com/addispay/backend/internal/response"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const (
	UserIDKey contextKey = "user_id"
	RoleKey   contextKey = "user_role"
)

// GinAuthMiddleware validates JWT and stores identity on Gin + request context.
func GinAuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Error(c, http.StatusUnauthorized, "Missing authorization header")
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.Error(c, http.StatusUnauthorized, "Invalid authorization header format")
			c.Abort()
			return
		}

		token, err := jwt.Parse(parts[1], func(t *jwt.Token) (interface{}, error) {
			if t.Method != jwt.SigningMethodHS256 {
				return nil, jwt.ErrTokenSignatureInvalid
			}
			return []byte(jwtSecret), nil
		})
		if err != nil || !token.Valid {
			response.Error(c, http.StatusUnauthorized, "Invalid or expired token")
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			response.Error(c, http.StatusUnauthorized, "Invalid token claims")
			c.Abort()
			return
		}

		userID, _ := claims["sub"].(string)
		userRole, _ := claims["role"].(string)
		if userID == "" || userRole == "" {
			response.Error(c, http.StatusUnauthorized, "Invalid token claims")
			c.Abort()
			return
		}

		c.Set(string(UserIDKey), userID)
		c.Set(string(RoleKey), userRole)

		ctx := context.WithValue(c.Request.Context(), UserIDKey, userID)
		ctx = context.WithValue(ctx, RoleKey, userRole)
		c.Request = c.Request.WithContext(ctx)

		c.Next()
	}
}

// RequireRoles allows only the listed roles after JWT auth.
func RequireRoles(roles ...domain.Role) gin.HandlerFunc {
	allowed := make(map[domain.Role]struct{}, len(roles))
	for _, role := range roles {
		allowed[role] = struct{}{}
	}

	return func(c *gin.Context) {
		roleVal, exists := c.Get(string(RoleKey))
		if !exists {
			response.Error(c, http.StatusForbidden, "Missing role in context")
			c.Abort()
			return
		}

		role := domain.Role(roleVal.(string))
		if _, ok := allowed[role]; !ok {
			response.Error(c, http.StatusForbidden, "Insufficient permissions")
			c.Abort()
			return
		}

		c.Next()
	}
}
