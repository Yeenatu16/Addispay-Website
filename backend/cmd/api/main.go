package main

import (
	"log"
	"os"

	authDelivery "github.com/addispay/backend/internal/auth/delivery/http"
	authMailer "github.com/addispay/backend/internal/auth/mailer"
	authRepo "github.com/addispay/backend/internal/auth/repository"
	authUseCase "github.com/addispay/backend/internal/auth/usecase"

	careersDelivery "github.com/addispay/backend/internal/careers/delivery/http"
	careerRepo "github.com/addispay/backend/internal/careers/repository"
	careerUseCase "github.com/addispay/backend/internal/careers/usecase"

	contentDelivery "github.com/addispay/backend/internal/content/delivery/http"
	contentRepo "github.com/addispay/backend/internal/content/repository"
	contentUseCase "github.com/addispay/backend/internal/content/usecase"

	newsDelivery "github.com/addispay/backend/internal/news/delivery/http"
	newsRepo "github.com/addispay/backend/internal/news/repository"
	newsUseCase "github.com/addispay/backend/internal/news/usecase"

	"github.com/addispay/backend/internal/config"
	"github.com/addispay/backend/internal/database"
	"github.com/addispay/backend/internal/server"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()

	if err := os.MkdirAll(cfg.UploadDir, 0o755); err != nil {
		log.Fatalf("Failed to create upload directory: %v", err)
	}

	db, err := database.NewDatabase(cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	if err := database.AutoMigrate(db); err != nil {
		log.Fatalf("Database migration failed: %v", err)
	}

	uRepo := authRepo.NewUserRepository(db)
	mailer := authMailer.NewMailer(authMailer.SMTPConfig{
		Host:     cfg.SMTPHost,
		Port:     cfg.SMTPPort,
		Username: cfg.SMTPUsername,
		Password: cfg.SMTPPassword,
		From:     cfg.SMTPFrom,
	})
	aUsecase := authUseCase.NewAuthUsecase(uRepo, mailer, cfg.JWTSecret, cfg.FrontendURL)
	aHandler := authDelivery.NewAuthHandler(aUsecase)

	cntRepo := contentRepo.NewContentRepository(db)
	cntUsecase := contentUseCase.NewContentUsecase(cntRepo)
	cntHandler := contentDelivery.NewContentHandler(cntUsecase)

	nRepo := newsRepo.NewNewsRepository(db)
	audit := contentUseCase.NewNewsAuditAdapter(cntRepo)
	settings := contentUseCase.NewNewsSettingsAdapter(cntUsecase)
	nUsecase := newsUseCase.NewNewsUsecase(nRepo, audit, settings)
	nHandler := newsDelivery.NewNewsHandler(nUsecase, cfg.UploadDir)
	nHandler.SetUserNameResolver(func(c *gin.Context) string {
		if email, ok := c.Get(string(authDelivery.UserEmailKey)); ok {
			if s, ok := email.(string); ok && s != "" {
				return s
			}
		}
		return "Administrator"
	})

	cRepo := careerRepo.NewCareerRepository(db)
	cUsecase := careerUseCase.NewCareerUsecase(cRepo)
	cHandler := careersDelivery.NewCareerHandler(cUsecase)

	router := server.NewRouter(cfg.JWTSecret, cfg.UploadDir, aHandler, nHandler, cHandler, cntHandler)

	log.Printf("Addispay Backend Server running on port %s", cfg.Port)
	log.Fatal(router.Run(":" + cfg.Port))
}
