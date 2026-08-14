package config

import (
	"os"

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

	SMTPHost     string
	SMTPPort     string
	SMTPUsername string
	SMTPPassword string
	SMTPFrom     string
}

func LoadConfig() *Config {
	_ = godotenv.Load()

	return &Config{
		Port:        getEnv("PORT", "8000"),
		DBHost:      getEnv("DB_HOST", "localhost"),
		DBPort:      getEnv("DB_PORT", "5432"),
		DBUser:      getEnv("DB_USER", ""),
		DBPassword:  getEnv("DB_PASSWORD", ""),
		DBName:      getEnv("DB_NAME", ""),
		DBSSLMode:   getEnv("DB_SSLMODE", "verify-full"),
		JWTSecret:   getEnv("ADDISPAY_JWT_SUPER_SECRET_KEY_2026", ""),
		UploadDir:   getEnv("UPLOAD_DIR", "./uploads"),
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:3000"),

		SMTPHost:     getEnv("SMTP_HOST", ""),
		SMTPPort:     getEnv("SMTP_PORT", "587"),
		SMTPUsername: getEnv("SMTP_USERNAME", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
		SMTPFrom:     getEnv("SMTP_FROM", ""),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
