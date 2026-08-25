package config

import (
	"net/url"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DBHost      string
	DBPort      string
	DBUser      string
	DBPassword  string
	DBName      string
	DBSSLMode   string
	JWTSecret   string
	UploadDir   string
	FrontendURL string

	// CORSAllowedOrigins lists browser origins permitted to call the API.
	CORSAllowedOrigins []string

	SMTPHost     string
	SMTPPort     string
	SMTPUsername string
	SMTPPassword string
	SMTPFrom     string
}

func LoadConfig() *Config {
	_ = godotenv.Load()

	frontendURL := getEnv("FRONTEND_URL", "http://localhost:3000")

	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "")
	dbPassword := getEnv("DB_PASSWORD", "")
	dbName := getEnv("DB_NAME", "")
	dbSSLMode := getEnv("DB_SSLMODE", "disable")

	// Render / managed Postgres often provides a single DATABASE_URL.
	if raw := strings.TrimSpace(os.Getenv("DATABASE_URL")); raw != "" {
		if u, err := url.Parse(raw); err == nil && u.Host != "" {
			if u.Hostname() != "" {
				dbHost = u.Hostname()
			}
			if u.Port() != "" {
				dbPort = u.Port()
			}
			if u.User != nil {
				dbUser = u.User.Username()
				if pw, ok := u.User.Password(); ok {
					dbPassword = pw
				}
			}
			if name := strings.TrimPrefix(u.Path, "/"); name != "" {
				dbName = name
			}
			q := u.Query()
			if ssl := q.Get("sslmode"); ssl != "" {
				dbSSLMode = ssl
			} else if dbSSLMode == "" || dbSSLMode == "disable" {
				// Render Postgres requires TLS from external clients.
				dbSSLMode = "require"
			}
		}
	}

	return &Config{
		Port:        getEnv("PORT", "8080"),
		DBHost:      dbHost,
		DBPort:      dbPort,
		DBUser:      dbUser,
		DBPassword:  dbPassword,
		DBName:      dbName,
		DBSSLMode:   dbSSLMode,
		JWTSecret:   firstNonEmpty(os.Getenv("ADDISPAY_JWT_SUPER_SECRET_KEY_2026"), os.Getenv("JWT_SECRET")),
		UploadDir:   getEnv("UPLOAD_DIR", "./uploads"),
		FrontendURL: frontendURL,

		CORSAllowedOrigins: splitList(getEnv("CORS_ALLOWED_ORIGINS", frontendURL)),

		SMTPHost:     getEnv("SMTP_HOST", ""),
		SMTPPort:     getEnv("SMTP_PORT", "587"),
		SMTPUsername: getEnv("SMTP_USERNAME", ""),
		// Gmail App Passwords are often pasted with spaces; strip them.
		SMTPPassword: strings.ReplaceAll(getEnv("SMTP_PASSWORD", ""), " ", ""),
		SMTPFrom:     strings.TrimSpace(getEnv("SMTP_FROM", "")),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func firstNonEmpty(values ...string) string {
	for _, v := range values {
		if strings.TrimSpace(v) != "" {
			return v
		}
	}
	return ""
}

func splitList(raw string) []string {
	parts := strings.Split(raw, ",")
	out := make([]string, 0, len(parts))
	for _, part := range parts {
		if trimmed := strings.TrimSpace(part); trimmed != "" {
			out = append(out, trimmed)
		}
	}
	return out
}
