package sanitize

import "testing"

func TestHTML(t *testing.T) {
	in := `<p>Hello</p><script>alert(1)</script><a href="javascript:alert(1)">x</a><a href="https://ok.com">ok</a>`
	out := HTML(in)
	t.Logf("out=%q", out)
	if contains(out, "<script") {
		t.Fatalf("script remained: %q", out)
	}
	if !contains(out, "<p>") || !contains(out, "Hello") {
		t.Fatalf("expected paragraph kept: %q", out)
	}
	if !contains(out, `href="https://ok.com"`) {
		t.Fatalf("expected safe link: %q", out)
	}
	if contains(out, "javascript:") {
		t.Fatalf("javascript href kept: %q", out)
	}
}

func contains(s, sub string) bool {
	return len(s) >= len(sub) && (s == sub || len(sub) == 0 || indexOf(s, sub) >= 0)
}
func indexOf(s, sub string) int {
	for i := 0; i+len(sub) <= len(s); i++ {
		if s[i:i+len(sub)] == sub {
			return i
		}
	}
	return -1
}
