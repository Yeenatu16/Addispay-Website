package main

import (
	"log"

	authDelivery "github.com/addispay/backend/internal/auth/delivery/http"
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
)

func main() {
	cfg := config.LoadConfig()

	// 1. Initialize PostgreSQL GORM Driver
	db, err := database.NewDatabase(cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// 2. Run GORM Migrations
	if err := database.AutoMigrate(db); err != nil {
		log.Fatalf("Database migration failed: %v", err)
	}

	// 3. Initialize Clean Architecture Layers (Repositories -> Usecases -> Delivery)
	uRepo := authRepo.NewUserRepository(db)
	aUsecase := authUseCase.NewAuthUsecase(uRepo, cfg.JWTSecret)
	aHandler := authDelivery.NewAuthHandler(aUsecase)

	nRepo := newsRepo.NewNewsRepository(db)
	nUsecase := newsUseCase.NewNewsUsecase(nRepo)
	nHandler := newsDelivery.NewNewsHandler(nUsecase)

	cRepo := careerRepo.NewCareerRepository(db)
	cUsecase := careerUseCase.NewCareerUsecase(cRepo)
	cHandler := careersDelivery.NewCareerHandler(cUsecase)

	cntRepo := contentRepo.NewContentRepository(db)
	cntUsecase := contentUseCase.NewContentUsecase(cntRepo)
	cntHandler := contentDelivery.NewContentHandler(cntUsecase)

	// 4. Wire Server Router
	router := server.NewRouter(cfg.JWTSecret, aHandler, nHandler, cHandler, cntHandler)

	log.Printf("Addispay Backend Server running on port %s", cfg.Port)
	log.Fatal(router.Run(":" + cfg.Port))
}
