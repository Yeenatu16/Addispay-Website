package validate

import (
	"net/mail"
	"net/url"
	"strings"
	"unicode/utf8"

	"github.com/addispay/backend/internal/apperr"
)

const (
	MaxName       = 255
	MaxEmail      = 255
	MaxTitle      = 255
	MaxShortText  = 2000
	MaxLongText   = 100_000
	MaxPhone      = 50
	MaxURL        = 500
	MaxPassword   = 128
	MinPassword   = 8
)

func Required(value, field string) error {
	if strings.TrimSpace(value) == "" {
		return apperr.BadRequest(field + " is required")
	}
	return nil
}

func MaxLen(value, field string, max int) error {
	if utf8.RuneCountInString(value) > max {
		return apperr.BadRequest(field + " is too long")
	}
	return nil
}

func Email(value string) (string, error) {
	value = strings.TrimSpace(strings.ToLower(value))
	if value == "" {
		return "", apperr.BadRequest("email is required")
	}
	if utf8.RuneCountInString(value) > MaxEmail {
		return "", apperr.BadRequest("email is too long")
	}
	addr, err := mail.ParseAddress(value)
	if err != nil || addr.Address != value {
		return "", apperr.BadRequest("email must be a valid email address")
	}
	return value, nil
}

func Password(value string) error {
	n := utf8.RuneCountInString(value)
	if n < MinPassword {
		return apperr.BadRequest("password must be at least 8 characters")
	}
	if n > MaxPassword {
		return apperr.BadRequest("password is too long")
	}
	return nil
}

func OptionalURL(value, field string) (string, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return "", nil
	}
	if utf8.RuneCountInString(value) > MaxURL {
		return "", apperr.BadRequest(field + " is too long")
	}
	u, err := url.ParseRequestURI(value)
	if err != nil || (u.Scheme != "http" && u.Scheme != "https") {
		return "", apperr.BadRequest(field + " must be a valid http(s) URL")
	}
	return value, nil
}
