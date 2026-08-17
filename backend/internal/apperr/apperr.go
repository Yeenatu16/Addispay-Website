package apperr

import (
	"errors"
	"fmt"
	"net/http"
)

// Kind classifies client-safe application errors.
type Kind int

const (
	KindBadRequest Kind = iota
	KindUnauthorized
	KindForbidden
	KindNotFound
	KindConflict
	KindInternal
)

// Error is a client-safe API error. Unexpected failures should wrap an internal cause
// without exposing it via Message.
type Error struct {
	Kind    Kind
	Message string
	cause   error
}

func (e *Error) Error() string {
	if e == nil {
		return ""
	}
	return e.Message
}

func (e *Error) Unwrap() error {
	if e == nil {
		return nil
	}
	return e.cause
}

func (e *Error) HTTPStatus() int {
	if e == nil {
		return http.StatusInternalServerError
	}
	switch e.Kind {
	case KindBadRequest:
		return http.StatusBadRequest
	case KindUnauthorized:
		return http.StatusUnauthorized
	case KindForbidden:
		return http.StatusForbidden
	case KindNotFound:
		return http.StatusNotFound
	case KindConflict:
		return http.StatusConflict
	default:
		return http.StatusInternalServerError
	}
}

func BadRequest(msg string) error {
	return &Error{Kind: KindBadRequest, Message: msg}
}

func Unauthorized(msg string) error {
	return &Error{Kind: KindUnauthorized, Message: msg}
}

func Forbidden(msg string) error {
	return &Error{Kind: KindForbidden, Message: msg}
}

func NotFound(msg string) error {
	return &Error{Kind: KindNotFound, Message: msg}
}

func Conflict(msg string) error {
	return &Error{Kind: KindConflict, Message: msg}
}

func Internal(cause error) error {
	return &Error{
		Kind:    KindInternal,
		Message: "Something went wrong. Please try again later.",
		cause:   cause,
	}
}

func Internalf(cause error, msg string, args ...any) error {
	return &Error{
		Kind:    KindInternal,
		Message: fmt.Sprintf(msg, args...),
		cause:   cause,
	}
}

func As(err error) (*Error, bool) {
	var ae *Error
	if errors.As(err, &ae) {
		return ae, true
	}
	return nil, false
}
