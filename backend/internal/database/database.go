package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect(databaseURL string) (*gorm.DB, error) {
	if databaseURL == "" {
		return nil, nil
	}

	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return db, nil
}