package main

import (
	"log"

	"github.com/addispay/backend/internal/config"
	"github.com/addispay/backend/internal/server"
)

func main() {
	cfg := config.Load()

	router := server.SetupRouter()

	log.Printf("AddisPay API running on :%s", cfg.Port)

	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}