package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	authDelivery "github.com/addispay/backend/internal/auth/delivery/http"
	authMailer "github.com/addispay/backend/internal/auth/mailer"
	authRepo "github.com/addispay/backend/internal/auth/repository"
	authUseCase "github.com/addispay/backend/internal/auth/usecase"

	careersDelivery "github.com/addispay/backend/internal/careers/delivery/http"
	careerRepo "github.com/addispay/backend/internal/careers/repository"
	careerUseCase "github.com/addispay/backend/internal/careers/usecase"

	brochureDelivery "github.com/addispay/backend/internal/brochure/delivery/http"
	brochureRepo "github.com/addispay/backend/internal/brochure/repository"
	brochureSeed "github.com/addispay/backend/internal/brochure/seed"
	brochureUseCase "github.com/addispay/backend/internal/brochure/usecase"

	contentDelivery "github.com/addispay/backend/internal/content/delivery/http"
	contentRepo "github.com/addispay/backend/internal/content/repository"
	contentUseCase "github.com/addispay/backend/internal/content/usecase"

	documentsDelivery "github.com/addispay/backend/internal/documents/delivery/http"
	documentsRepo "github.com/addispay/backend/internal/documents/repository"
	documentsSeed "github.com/addispay/backend/internal/documents/seed"
	documentsUseCase "github.com/addispay/backend/internal/documents/usecase"

	newsDelivery "github.com/addispay/backend/internal/news/delivery/http"
	newsRepo "github.com/addispay/backend/internal/news/repository"
	newsUseCase "github.com/addispay/backend/internal/news/usecase"

	"github.com/addispay/backend/internal/config"
	"github.com/addispay/backend/internal/database"
	"github.com/addispay/backend/internal/server"
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

	seedDirs := []string{
		filepath.Join("..", "frontend", "public", "documents"),
		filepath.Join("seed", "documents"),
		"./seed/documents",
	}
	if err := documentsSeed.OfficialDocuments(db, cfg.UploadDir, seedDirs); err != nil {
		log.Printf("documents seed warning: %v", err)
	}

	brochureSeedDirs := []string{
		filepath.Join("..", "frontend", "public", "images", "documents"),
		filepath.Join("seed", "brochure"),
		"./seed/brochure",
	}
	if err := brochureSeed.BrochureImages(db, cfg.UploadDir, brochureSeedDirs); err != nil {
		log.Printf("brochure seed warning: %v", err)
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
	notifier := contentUseCase.NewArticleNotifier(cntRepo, authMailer.AsSender(mailer), cfg.FrontendURL)
	nUsecase := newsUseCase.NewNewsUsecase(nRepo, audit, settings, notifier)
	nHandler := newsDelivery.NewNewsHandler(nUsecase, cfg.UploadDir)
	nHandler.SetUserNameResolver(authDelivery.ActorName)

	cRepo := careerRepo.NewCareerRepository(db)
	careerAudit := contentUseCase.NewCareerAuditAdapter(cntRepo)
	cUsecase := careerUseCase.NewCareerUsecase(cRepo, careerAudit)
	cHandler := careersDelivery.NewCareerHandler(cUsecase, cfg.UploadDir)
	cHandler.SetUserNameResolver(authDelivery.ActorName)

	dRepo := documentsRepo.NewDocumentRepository(db)
	dUsecase := documentsUseCase.NewDocumentUsecase(dRepo)
	dHandler := documentsDelivery.NewDocumentHandler(dUsecase, cfg.UploadDir)

	bRepo := brochureRepo.NewBrochureRepository(db)
	bUsecase := brochureUseCase.NewBrochureUsecase(bRepo)
	bHandler := brochureDelivery.NewBrochureHandler(bUsecase, cfg.UploadDir)

	router := server.NewRouter(cfg.JWTSecret, cfg.UploadDir, cfg.CORSAllowedOrigins, uRepo, aHandler, nHandler, cHandler, cntHandler, dHandler, bHandler)

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           router,
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       30 * time.Second,
		WriteTimeout:      60 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	go func() {
		log.Printf("Addispay Backend Server running on port %s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server failed: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("server forced to shutdown: %v", err)
	}
	log.Println("Server stopped")
}
