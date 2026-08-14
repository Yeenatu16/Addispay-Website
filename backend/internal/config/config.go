package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port       string
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string
	JWTSecret  string
	UploadDir  string
}

func LoadConfig() *Config {
	_ = godotenv.Load()

	return &Config{
		Port:       getEnv("PORT", "8000"),
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER",""),
		DBPassword: getEnv("DB_PASSWORD",""),
		DBName:     getEnv("DB_NAME",""),
		DBSSLMode:  getEnv("DB_SSLMODE", "verify-full"),
		JWTSecret:  getEnv("ADDISPAY_JWT_SUPER_SECRET_KEY_2026",""),
		UploadDir:  getEnv("UPLOAD_DIR", "./uploads"),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
