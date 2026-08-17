package sanitize

import (
	"strings"
	"testing"
)

func TestHTML(t *testing.T) {
	in := `<p>Hello</p><script>alert(1)</script><a href="javascript:alert(1)">x</a><a href="https://ok.com">ok</a>`
	out := HTML(in)
	t.Logf("out=%q", out)
	if strings.Contains(out, "<script") {
		t.Fatalf("script remained: %q", out)
	}
	if !strings.Contains(out, "<p>") || !strings.Contains(out, "Hello") {
		t.Fatalf("expected paragraph kept: %q", out)
	}
	if !strings.Contains(out, `href="https://ok.com"`) {
		t.Fatalf("expected safe link: %q", out)
	}
	if strings.Contains(out, "javascript:") {
		t.Fatalf("javascript href kept: %q", out)
	}
}

// The editor in the admin dashboard can emit tables, images, headings and
// alignment (FR-ADM-008); all of it must survive sanitization.
func TestHTMLKeepsRichEditorMarkup(t *testing.T) {
	in := `<h5>Sub</h5>` +
		`<p style="text-align:center;color:red">Centered</p>` +
		`<table><thead><tr><th colspan="2">H</th></tr></thead><tbody><tr><td>A</td><td>B</td></tr></tbody></table>` +
		`<img src="/uploads/news/pic.jpg" alt="Pic" width="800">` +
		`<hr>`

	out := HTML(in)
	t.Logf("out=%q", out)

	for _, want := range []string{
		"<h5>", "<table>", "<thead>", "<th colspan=\"2\">", "<td>",
		`<img src="/uploads/news/pic.jpg" alt="Pic" width="800"`,
		"<hr", `style="text-align:center"`,
	} {
		if !strings.Contains(out, want) {
			t.Errorf("expected %q in output", want)
		}
	}
	if strings.Contains(out, "color:red") {
		t.Errorf("non-alignment style leaked: %q", out)
	}
}

func TestHTMLDropsUnsafeAttributesAndSources(t *testing.T) {
	in := `<p onclick="steal()">hi</p>` +
		`<img src="javascript:alert(1)" alt="bad">` +
		`<img src="data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=" alt="inline">` +
		`<iframe src="https://evil.example"></iframe>` +
		`<td style="position:fixed">cell</td>`

	out := HTML(in)
	t.Logf("out=%q", out)

	for _, unwanted := range []string{"onclick", "javascript:", "data:image", "<iframe", "position:fixed"} {
		if strings.Contains(out, unwanted) {
			t.Errorf("unsafe content %q remained: %q", unwanted, out)
		}
	}
	if !strings.Contains(out, "hi") {
		t.Errorf("expected text content preserved: %q", out)
	}
}

func TestTextStripsMarkup(t *testing.T) {
	if got := Text(`<p>Hello <strong>world</strong></p><script>alert(1)</script>`); got != "Hello world" {
		t.Fatalf("got %q", got)
	}
}
