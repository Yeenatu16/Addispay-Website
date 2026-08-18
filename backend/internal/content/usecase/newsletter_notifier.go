package usecase

import (
	"context"
	"fmt"
	"log"
	"strings"

	authMailer "github.com/addispay/backend/internal/auth/mailer"
	"github.com/addispay/backend/internal/content/domain"
	"github.com/addispay/backend/internal/sanitize"
)

// ArticleNotifier emails active newsletter subscribers when a story is published.
type ArticleNotifier struct {
	repo    domain.ContentRepository
	mail    authMailer.Sender
	siteURL string
}

func NewArticleNotifier(repo domain.ContentRepository, mail authMailer.Sender, siteURL string) *ArticleNotifier {
	return &ArticleNotifier{repo: repo, mail: mail, siteURL: strings.TrimRight(strings.TrimSpace(siteURL), "/")}
}

func (n *ArticleNotifier) NotifyArticlePublished(ctx context.Context, slug, title, summary string) {
	if n == nil || n.mail == nil || n.repo == nil {
		return
	}

	emails, err := n.repo.ListActiveSubscriberEmails(ctx)
	if err != nil {
		log.Printf("[newsletter] failed to load subscribers: %v", err)
		return
	}
	if len(emails) == 0 {
		return
	}

	title = sanitize.Text(title)
	summary = sanitize.Text(summary)
	articleURL := n.siteURL + "/blog/" + slug
	subject := "New from AddisPay: " + title
	body := fmt.Sprintf(
		"Hello,\n\n"+
			"AddisPay just published a new article.\n\n"+
			"%s\n\n"+
			"%s\n\n"+
			"Read it here:\n%s\n\n"+
			"You received this because you subscribed on the AddisPay website.\n\n"+
			"- AddisPay\n",
		title,
		summary,
		articleURL,
	)

	copied := append([]string(nil), emails...)
	go func() {
		sent := 0
		for _, email := range copied {
			if err := n.mail.SendPlain(context.Background(), email, subject, body); err != nil {
				log.Printf("[newsletter] send failed for <%s>: %v", email, err)
				continue
			}
			sent++
		}
		log.Printf("[newsletter] notified %d/%d subscribers about %q", sent, len(copied), title)
	}()
}
