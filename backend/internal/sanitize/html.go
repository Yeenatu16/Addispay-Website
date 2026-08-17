package sanitize

import (
	"bytes"
	"strings"

	"golang.org/x/net/html"
	"golang.org/x/net/html/atom"
)

// Allowed tags for news rich text (NFR-SEC-002).
var allowedTags = map[atom.Atom]bool{
	atom.P: true, atom.Br: true, atom.Strong: true, atom.B: true, atom.Em: true, atom.I: true,
	atom.U: true, atom.S: true, atom.Ul: true, atom.Ol: true, atom.Li: true,
	atom.H1: true, atom.H2: true, atom.H3: true, atom.H4: true, atom.Blockquote: true,
	atom.A: true, atom.Code: true, atom.Pre: true, atom.Span: true, atom.Div: true,
}

var voidTags = map[atom.Atom]bool{atom.Br: true}

// HTML sanitizes rich HTML to a safe subset for storage/rendering.
func HTML(input string) string {
	input = strings.TrimSpace(input)
	if input == "" {
		return ""
	}

	doc, err := html.Parse(strings.NewReader("<div>" + input + "</div>"))
	if err != nil {
		return Text(input)
	}

	body := findBody(doc)
	if body == nil {
		return Text(input)
	}

	// The wrapper div is the first element child of body (after optional whitespace text).
	var wrapper *html.Node
	for c := body.FirstChild; c != nil; c = c.NextSibling {
		if c.Type == html.ElementNode && c.DataAtom == atom.Div {
			wrapper = c
			break
		}
	}
	if wrapper == nil {
		wrapper = body
	}

	var buf bytes.Buffer
	for c := wrapper.FirstChild; c != nil; c = c.NextSibling {
		writeSafe(&buf, c)
	}
	return strings.TrimSpace(buf.String())
}

// Text strips all HTML tags and returns plain text.
func Text(input string) string {
	input = strings.TrimSpace(input)
	if input == "" {
		return ""
	}
	doc, err := html.Parse(strings.NewReader(input))
	if err != nil {
		return stripTagsFallback(input)
	}
	var buf bytes.Buffer
	writeText(&buf, doc)
	return strings.Join(strings.Fields(buf.String()), " ")
}

func findBody(n *html.Node) *html.Node {
	if n.Type == html.ElementNode && n.DataAtom == atom.Body {
		return n
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if found := findBody(c); found != nil {
			return found
		}
	}
	return nil
}

func writeSafe(buf *bytes.Buffer, n *html.Node) {
	switch n.Type {
	case html.TextNode:
		buf.WriteString(html.EscapeString(n.Data))
	case html.ElementNode:
		tagAtom := n.DataAtom
		tagName := strings.ToLower(n.Data)

		// Never emit script/style contents.
		if tagAtom == atom.Script || tagAtom == atom.Style || tagName == "script" || tagName == "style" {
			return
		}

		if !allowedTags[tagAtom] {
			for c := n.FirstChild; c != nil; c = c.NextSibling {
				writeSafe(buf, c)
			}
			return
		}

		buf.WriteByte('<')
		buf.WriteString(tagName)

		if tagAtom == atom.A {
			href := ""
			title := ""
			for _, attr := range n.Attr {
				key := strings.ToLower(attr.Key)
				val := strings.TrimSpace(attr.Val)
				switch key {
				case "href":
					if safeURL(val) {
						href = val
					}
				case "title":
					title = val
				}
			}
			if href != "" {
				buf.WriteString(` href="`)
				buf.WriteString(html.EscapeString(href))
				buf.WriteByte('"')
			}
			if title != "" {
				buf.WriteString(` title="`)
				buf.WriteString(html.EscapeString(title))
				buf.WriteByte('"')
			}
			buf.WriteString(` rel="noopener noreferrer nofollow"`)
		}

		if voidTags[tagAtom] {
			buf.WriteString(" />")
			return
		}

		buf.WriteByte('>')
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			writeSafe(buf, c)
		}
		buf.WriteString("</")
		buf.WriteString(tagName)
		buf.WriteByte('>')
	}
}

func safeURL(val string) bool {
	lower := strings.ToLower(strings.TrimSpace(val))
	if lower == "" {
		return false
	}
	if strings.HasPrefix(lower, "javascript:") || strings.HasPrefix(lower, "data:") || strings.HasPrefix(lower, "vbscript:") {
		return false
	}
	return strings.HasPrefix(lower, "http://") ||
		strings.HasPrefix(lower, "https://") ||
		strings.HasPrefix(lower, "/") ||
		strings.HasPrefix(lower, "#") ||
		strings.HasPrefix(lower, "mailto:")
}

func writeText(buf *bytes.Buffer, n *html.Node) {
	switch n.Type {
	case html.TextNode:
		buf.WriteString(n.Data)
	case html.ElementNode:
		if n.DataAtom == atom.Script || n.DataAtom == atom.Style {
			return
		}
		fallthrough
	default:
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			writeText(buf, c)
		}
	}
}

func stripTagsFallback(s string) string {
	var b strings.Builder
	inTag := false
	for _, r := range s {
		switch {
		case r == '<':
			inTag = true
		case r == '>':
			inTag = false
		case !inTag:
			b.WriteRune(r)
		}
	}
	return strings.TrimSpace(b.String())
}
