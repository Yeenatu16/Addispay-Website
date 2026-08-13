package domain

import "time"

type News struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `gorm:"not null" json:"title"`
	Slug        string    `gorm:"uniqueIndex;not null" json:"slug"`
	Excerpt     string    `json:"excerpt"`
	Content     string    `gorm:"type:text;not null" json:"content"`
	CoverImage  string    `json:"cover_image"`
	IsPublished bool      `gorm:"default:false" json:"is_published"`
	IsFeatured  bool      `gorm:"default:false" json:"is_featured"`
	PublishedAt *time.Time `json:"published_at,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}