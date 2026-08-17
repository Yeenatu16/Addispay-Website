package sanitize

import (
	"bytes"
	"strings"

	"golang.org/x/net/html"
	"golang.org/x/net/html/atom"
)

// Allowed tags for news rich text (NFR-SEC-002). Covers the full editor feature
// set required by FR-ADM-008: headings, lists, links, images, tables and quotes.
var allowedTags = map[atom.Atom]bool{
	atom.P: true, atom.Br: true, atom.Hr: true, atom.Strong: true, atom.B: true,
	atom.Em: true, atom.I: true, atom.U: true, atom.S: true, atom.Strike: true,
	atom.Sub: true, atom.Sup: true, atom.Mark: true,
	atom.Ul: true, atom.Ol: true, atom.Li: true,
	atom.H1: true, atom.H2: true, atom.H3: true, atom.H4: true, atom.H5: true, atom.H6: true,
	atom.Blockquote: true, atom.A: true, atom.Code: true, atom.Pre: true,
	atom.Span: true, atom.Div: true, atom.Img: true,
	atom.Figure: true, atom.Figcaption: true,
	atom.Table: true, atom.Thead: true, atom.Tbody: true, atom.Tfoot: true,
	atom.Tr: true, atom.Th: true, atom.Td: true, atom.Caption: true,
}

var voidTags = map[atom.Atom]bool{atom.Br: true, atom.Hr: true, atom.Img: true}

// Alignment is the only style declaration preserved; everything else is dropped
// so authored content cannot smuggle in positioning or url() payloads.
var allowedTextAlign = map[string]bool{"left": true, "center": true, "right": true, "justify": true}

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

		// Images without a safe source would render as broken placeholders.
		if !allowedTags[tagAtom] || (tagAtom == atom.Img && !hasSafeSrc(n)) {
			for c := n.FirstChild; c != nil; c = c.NextSibling {
				writeSafe(buf, c)
			}
			return
		}

		buf.WriteByte('<')
		buf.WriteString(tagName)
		writeAttrs(buf, n, tagAtom)

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

// writeAttrs emits the allowlisted attributes for an element. Anything not named
// here (including every event handler) is discarded.
func writeAttrs(buf *bytes.Buffer, n *html.Node, tagAtom atom.Atom) {
	var align string
	attrs := map[string]string{}

	for _, attr := range n.Attr {
		key := strings.ToLower(attr.Key)
		val := strings.TrimSpace(attr.Val)

		switch key {
		case "style":
			if a := textAlignFromStyle(val); a != "" {
				align = a
			}
		case "align":
			if allowedTextAlign[strings.ToLower(val)] {
				align = strings.ToLower(val)
			}
		case "href":
			if tagAtom == atom.A && safeURL(val) {
				attrs["href"] = val
			}
		case "src":
			if tagAtom == atom.Img && safeURL(val) {
				attrs["src"] = val
			}
		case "alt":
			if tagAtom == atom.Img {
				attrs["alt"] = val
			}
		case "title":
			attrs["title"] = val
		case "width", "height":
			if tagAtom == atom.Img && isDigits(val) {
				attrs[key] = val
			}
		case "colspan", "rowspan":
			if (tagAtom == atom.Td || tagAtom == atom.Th) && isDigits(val) {
				attrs[key] = val
			}
		}
	}

	for _, key := range []string{"href", "src", "alt", "title", "width", "height", "colspan", "rowspan"} {
		if val, ok := attrs[key]; ok && val != "" {
			buf.WriteByte(' ')
			buf.WriteString(key)
			buf.WriteString(`="`)
			buf.WriteString(html.EscapeString(val))
			buf.WriteByte('"')
		}
	}

	if align != "" {
		buf.WriteString(` style="text-align:`)
		buf.WriteString(align)
		buf.WriteByte('"')
	}

	if tagAtom == atom.A {
		buf.WriteString(` rel="noopener noreferrer nofollow"`)
	}
}

func hasSafeSrc(n *html.Node) bool {
	for _, attr := range n.Attr {
		if strings.EqualFold(attr.Key, "src") && safeURL(strings.TrimSpace(attr.Val)) {
			return true
		}
	}
	return false
}

func textAlignFromStyle(style string) string {
	for _, decl := range strings.Split(style, ";") {
		name, value, ok := strings.Cut(decl, ":")
		if !ok || strings.ToLower(strings.TrimSpace(name)) != "text-align" {
			continue
		}
		value = strings.ToLower(strings.TrimSpace(value))
		if allowedTextAlign[value] {
			return value
		}
	}
	return ""
}

func isDigits(s string) bool {
	if s == "" || len(s) > 5 {
		return false
	}
	for _, r := range s {
		if r < '0' || r > '9' {
			return false
		}
	}
	return true
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
