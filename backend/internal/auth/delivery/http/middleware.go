package http

import (
	"context"
	"net/http"
	"strings"

	"github.com/addispay/backend/internal/auth/domain"
	"github.com/addispay/backend/internal/response"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type contextKey string

const (
	UserIDKey    contextKey = "user_id"
	RoleKey      contextKey = "user_role"
	UserEmailKey contextKey = "user_email"
	UserNameKey  contextKey = "user_name"
)

// UserLookup loads the current administrator for authz checks.
type UserLookup interface {
	GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error)
}

// GinAuthMiddleware validates JWT, then reloads the user from the DB so revoke
// and role changes take effect immediately (NFR-SEC-004).
func GinAuthMiddleware(jwtSecret string, users UserLookup) gin.HandlerFunc {
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

		userIDRaw, _ := claims["sub"].(string)
		userID, err := uuid.Parse(userIDRaw)
		if err != nil || userID == uuid.Nil {
			response.Error(c, http.StatusUnauthorized, "Invalid token claims")
			c.Abort()
			return
		}

		user, err := users.GetByID(c.Request.Context(), userID)
		if err != nil || user == nil {
			response.Error(c, http.StatusUnauthorized, "Invalid or expired token")
			c.Abort()
			return
		}
		if !user.IsActive {
			response.Error(c, http.StatusUnauthorized, "Account access has been revoked")
			c.Abort()
			return
		}

		c.Set(string(UserIDKey), user.ID.String())
		c.Set(string(RoleKey), string(user.Role))
		c.Set(string(UserEmailKey), user.Email)
		c.Set(string(UserNameKey), user.FullName)

		ctx := context.WithValue(c.Request.Context(), UserIDKey, user.ID.String())
		ctx = context.WithValue(ctx, RoleKey, string(user.Role))
		ctx = context.WithValue(ctx, UserEmailKey, user.Email)
		ctx = context.WithValue(ctx, UserNameKey, user.FullName)
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
