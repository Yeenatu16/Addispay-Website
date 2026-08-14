package mailer

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/smtp"
	"strings"

	"github.com/addispay/backend/internal/auth/domain"
)

// LogMailer writes auth emails to the application log.
// Used when SMTP is not configured.
type LogMailer struct{}

func NewLogMailer() *LogMailer {
	return &LogMailer{}
}

func (m *LogMailer) SendPasswordReset(_ context.Context, toEmail, fullName, resetURL string) error {
	log.Printf(
		"[mailer:log] password reset for %s <%s>\nreset link: %s",
		fullName,
		toEmail,
		resetURL,
	)
	return nil
}

func (m *LogMailer) SendAdminInvitation(_ context.Context, toEmail string, role domain.Role, inviteURL string) error {
	log.Printf(
		"[mailer:log] admin invitation for <%s> as %s\ninvite link: %s",
		toEmail,
		role,
		inviteURL,
	)
	return nil
}

// SMTPConfig holds outbound mail settings.
type SMTPConfig struct {
	Host     string
	Port     string
	Username string
	Password string
	From     string // e.g. "AddisPay <noreply@addispay.com>" or "noreply@addispay.com"
}

func (c SMTPConfig) Enabled() bool {
	return strings.TrimSpace(c.Host) != "" &&
		strings.TrimSpace(c.Port) != "" &&
		strings.TrimSpace(c.From) != ""
}

// SMTPMailer sends email over SMTP (STARTTLS / PlainAuth via net/smtp).
type SMTPMailer struct {
	cfg SMTPConfig
}

func NewSMTPMailer(cfg SMTPConfig) *SMTPMailer {
	return &SMTPMailer{cfg: cfg}
}

func (m *SMTPMailer) SendPasswordReset(_ context.Context, toEmail, fullName, resetURL string) error {
	subject := "Reset your AddisPay password"
	body := fmt.Sprintf(
		"Hi %s,\n\n"+
			"We received a request to reset your AddisPay admin password.\n\n"+
			"Open this link to choose a new password (expires in 1 hour):\n%s\n\n"+
			"If you did not request this, you can ignore this email.\n\n"+
			"— AddisPay\n",
		fullName,
		resetURL,
	)
	return m.send(toEmail, subject, body)
}

func (m *SMTPMailer) SendAdminInvitation(_ context.Context, toEmail string, role domain.Role, inviteURL string) error {
	subject := "You're invited to AddisPay Admin"
	body := fmt.Sprintf(
		"Hello,\n\n"+
			"You have been invited to join the AddisPay admin dashboard as %s.\n\n"+
			"Open this link to set your password and activate your account (expires in 7 days):\n%s\n\n"+
			"If you were not expecting this invitation, you can ignore this email.\n\n"+
			"— AddisPay\n",
		role,
		inviteURL,
	)
	return m.send(toEmail, subject, body)
}

func (m *SMTPMailer) send(to, subject, body string) error {
	fromHeader := m.cfg.From
	fromAddr := extractEmail(fromHeader)
	if fromAddr == "" {
		return fmt.Errorf("invalid SMTP_FROM address: %q", m.cfg.From)
	}

	msg := strings.Builder{}
	msg.WriteString(fmt.Sprintf("From: %s\r\n", fromHeader))
	msg.WriteString(fmt.Sprintf("To: %s\r\n", to))
	msg.WriteString(fmt.Sprintf("Subject: %s\r\n", subject))
	msg.WriteString("MIME-Version: 1.0\r\n")
	msg.WriteString("Content-Type: text/plain; charset=\"UTF-8\"\r\n")
	msg.WriteString("\r\n")
	msg.WriteString(body)

	addr := net.JoinHostPort(m.cfg.Host, m.cfg.Port)

	var auth smtp.Auth
	if m.cfg.Username != "" {
		auth = smtp.PlainAuth("", m.cfg.Username, m.cfg.Password, m.cfg.Host)
	}

	if err := smtp.SendMail(addr, auth, fromAddr, []string{to}, []byte(msg.String())); err != nil {
		return fmt.Errorf("smtp send failed: %w", err)
	}

	log.Printf("[mailer:smtp] sent %q to <%s>", subject, to)
	return nil
}

// NewMailer returns SMTPMailer when SMTP is configured, otherwise LogMailer.
func NewMailer(cfg SMTPConfig) domain.Mailer {
	if cfg.Enabled() {
		log.Printf("[mailer] using SMTP %s:%s (from %s)", cfg.Host, cfg.Port, cfg.From)
		return NewSMTPMailer(cfg)
	}
	log.Printf("[mailer] SMTP not configured — using LogMailer (emails printed to logs)")
	return NewLogMailer()
}

func extractEmail(from string) string {
	from = strings.TrimSpace(from)
	if start := strings.LastIndex(from, "<"); start >= 0 {
		end := strings.LastIndex(from, ">")
		if end > start {
			return strings.TrimSpace(from[start+1 : end])
		}
	}
	if strings.Contains(from, "@") {
		return from
	}
	return ""
}
