package database

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	authDomain "github.com/addispay/backend/internal/auth/domain"
	careersDomain "github.com/addispay/backend/internal/careers/domain"
	contentDomain "github.com/addispay/backend/internal/content/domain"
	newsDomain "github.com/addispay/backend/internal/news/domain"
)

func NewDatabase(host, port, user, password, dbName, sslMode string) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Africa/Addis_Ababa",
		host, user, password, dbName, port, sslMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to postgresql database: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("Successfully connected to PostgreSQL database via GORM")
	return db, nil
}

func AutoMigrate(db *gorm.DB) error {
	log.Println("Executing GORM database migrations...")
	return db.AutoMigrate(
		&authDomain.User{},
		&newsDomain.NewsArticle{},
		&careersDomain.JobPosting{},
		&careersDomain.JobApplication{},
		&contentDomain.NewsletterSubscriber{},
		&contentDomain.ContactMessage{},
		&contentDomain.AuditLog{},
	)
}