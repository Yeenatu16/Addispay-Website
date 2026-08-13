package main

import (
	"log"

	"github.com/addispay/backend/internal/config"
	"github.com/addispay/backend/internal/database"
	"github.com/addispay/backend/internal/news/domain"
	"github.com/addispay/backend/internal/server"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Database connected successfully")

	if err := db.AutoMigrate(&domain.News{}); err != nil {
		log.Fatal(err)
	}

	router := server.SetupRouter(db)

	log.Printf("AddisPay API running on :%s", cfg.Port)

	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}