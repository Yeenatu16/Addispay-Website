#!/usr/bin/env python3
"""
End-to-end API smoke tests for AddisPay.

Usage:
  E2E_SUPER_EMAIL=... E2E_SUPER_PASSWORD=... \\
  E2E_MARKETER_EMAIL=... E2E_MARKETER_PASSWORD=... \\
  python3 scripts/e2e_test.py

Optional:
  API_BASE=http://localhost:8080/api/v1
  FRONTEND_BASE=http://localhost:3000
"""

from __future__ import annotations

import json
import os
import sys
import tempfile
import urllib.error
import urllib.request
from typing import Any

API = os.environ.get("API_BASE", "http://localhost:8080/api/v1").rstrip("/")
FRONTEND = os.environ.get("FRONTEND_BASE", "http://localhost:3000").rstrip("/")
SUPER_EMAIL = os.environ.get("E2E_SUPER_EMAIL", "")
SUPER_PASSWORD = os.environ.get("E2E_SUPER_PASSWORD", "")
MARKETER_EMAIL = os.environ.get("E2E_MARKETER_EMAIL", "")
MARKETER_PASSWORD = os.environ.get("E2E_MARKETER_PASSWORD", "")

passed = 0
failed = 0
skipped = 0


def log(ok: bool, name: str, detail: str = "") -> None:
    global passed, failed
    if ok:
        passed += 1
        print(f"  PASS  {name}" + (f" — {detail}" if detail else ""))
    else:
        failed += 1
        print(f"  FAIL  {name}" + (f" — {detail}" if detail else ""))


def skip(name: str, detail: str) -> None:
    global skipped
    skipped += 1
    print(f"  SKIP  {name} — {detail}")


def request(
    method: str,
    path: str,
    *,
    body: Any | None = None,
    token: str | None = None,
    files: dict[str, tuple[str, bytes, str]] | None = None,
    expect: int | None = 200,
    base: str | None = None,
    json_response: bool = True,
) -> tuple[int, Any]:
    url = path if path.startswith("http") else f"{(base or API)}{path}"
    headers: dict[str, str] = {"Accept": "application/json, text/html;q=0.9,*/*;q=0.8"}
    data = None
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if files:
        import uuid

        boundary = f"----AddisPayE2E{uuid.uuid4().hex}"
        parts: list[bytes] = []
        for field, (filename, content, ctype) in files.items():
            parts.append(
                (
                    f"--{boundary}\r\n"
                    f'Content-Disposition: form-data; name="{field}"; filename="{filename}"\r\n'
                    f"Content-Type: {ctype}\r\n\r\n"
                ).encode()
                + content
                + b"\r\n"
            )
        parts.append(f"--{boundary}--\r\n".encode())
        data = b"".join(parts)
        headers["Content-Type"] = f"multipart/form-data; boundary={boundary}"
    elif body is not None:
        data = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            raw = res.read().decode(errors="replace")
            status = res.status
            if not json_response:
                return status, raw[:200]
            payload = json.loads(raw) if raw.strip() else None
    except urllib.error.HTTPError as e:
        raw = e.read().decode(errors="replace") or ""
        status = e.code
        if not json_response:
            return status, raw[:200]
        try:
            payload = json.loads(raw) if raw.strip() else None
        except json.JSONDecodeError:
            payload = {"error": raw[:200]}
    except Exception as e:
        return 0, {"error": str(e)}

    if expect is not None and status != expect:
        return status, payload
    return status, payload


def unwrap(payload: Any) -> Any:
    if isinstance(payload, dict) and "data" in payload:
        return payload["data"]
    return payload


def login(email: str, password: str) -> str | None:
    status, payload = request(
        "POST",
        "/auth/login",
        body={"email": email, "password": password},
        expect=200,
    )
    if status != 200:
        return None
    data = unwrap(payload)
    return data.get("token") if isinstance(data, dict) else None


def main() -> int:
    print(f"\nAddisPay E2E  API={API}  FRONTEND={FRONTEND}\n")
    print("=== Public API ===")

    status, payload = request("GET", "/health")
    log(status == 200 and unwrap(payload).get("status") == "UP", "GET /health", str(status))

    for path, key in [
        ("/news/homepage", None),
        ("/news", "articles"),
        ("/careers", None),
        ("/documents", "documents"),
        ("/brochure", "images"),
        ("/content/homepage", "heroYoutubeId"),
    ]:
        status, payload = request("GET", path)
        data = unwrap(payload)
        ok = status == 200
        detail = str(status)
        if ok and key and isinstance(data, dict):
            detail = f"{key}={len(data.get(key, [])) if isinstance(data.get(key), list) else data.get(key)}"
        elif ok and isinstance(data, list):
            detail = f"count={len(data)}"
        log(ok, f"GET {path}", detail)

    # Newsletter + contact (unique email)
    uniq = os.urandom(4).hex()
    status, _ = request(
        "POST",
        "/content/subscribe",
        body={"email": f"e2e-{uniq}@example.com"},
        expect=200,
    )
    log(status == 200, "POST /content/subscribe", str(status))

    status, _ = request(
        "POST",
        "/content/contact",
        body={
            "fullName": "E2E Tester",
            "email": f"e2e-{uniq}@example.com",
            "reason": "General inquiry",
            "message": "Automated end-to-end contact form test.",
        },
        expect=201,
    )
    log(status in (200, 201), "POST /content/contact", str(status))

    print("\n=== Frontend pages ===")
    for path in ["/", "/doc", "/brochure", "/blog", "/careers", "/about", "/contact", "/admin/login"]:
        status, _ = request("GET", path, base=FRONTEND, expect=None, json_response=False)
        log(status == 200, f"GET {FRONTEND}{path}", str(status))

    print("\n=== Auth / Super Admin ===")
    if not SUPER_EMAIL or not SUPER_PASSWORD:
        skip("Super Admin flows", "Set E2E_SUPER_EMAIL and E2E_SUPER_PASSWORD")
        super_token = None
    else:
        super_token = login(SUPER_EMAIL, SUPER_PASSWORD)
        log(bool(super_token), "POST /auth/login (Super_Admin)")

    if super_token:
        status, payload = request("GET", "/admin/me", token=super_token)
        role = unwrap(payload).get("role") if status == 200 else None
        log(status == 200 and role == "Super_Admin", "GET /admin/me", f"role={role}")

        status, payload = request("GET", "/admin/users", token=super_token)
        users = unwrap(payload) if status == 200 else []
        log(status == 200 and isinstance(users, list), "GET /admin/users", f"count={len(users) if isinstance(users, list) else 0}")

        status, payload = request("GET", "/admin/documents", token=super_token)
        docs = unwrap(payload).get("documents", []) if status == 200 else []
        log(status == 200, "GET /admin/documents", f"count={len(docs)}")

        status, payload = request("GET", "/admin/documents/categories", token=super_token)
        cats = unwrap(payload).get("categories", []) if status == 200 else []
        log(status == 200, "GET /admin/documents/categories", f"count={len(cats)}")

        status, payload = request("GET", "/admin/homepage/settings", token=super_token)
        hero = unwrap(payload).get("heroYoutubeId") if status == 200 else None
        log(status == 200 and bool(hero), "GET /admin/homepage/settings", f"id={hero}")

        # Update hero then restore
        status, payload = request(
            "PUT",
            "/admin/homepage/settings",
            token=super_token,
            body={"heroYoutubeId": hero or "oHFAOehZBRc"},
        )
        log(status == 200, "PUT /admin/homepage/settings", str(status))

        # Document upload + create + delete cycle
        pdf = b"%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n"
        status, payload = request(
            "POST",
            "/admin/documents/upload",
            token=super_token,
            files={"file": ("e2e.pdf", pdf, "application/pdf")},
            expect=200,
        )
        upload = unwrap(payload) if status == 200 else {}
        log(status == 200 and bool(upload.get("url")), "POST /admin/documents/upload", str(status))

        doc_id = None
        if upload.get("url"):
            status, payload = request(
                "POST",
                "/admin/documents",
                token=super_token,
                body={
                    "title": f"E2E Document {uniq}",
                    "category": "E2E Category",
                    "description": "Temporary document created by e2e suite.",
                    "fileUrl": upload["url"],
                    "fileSize": upload.get("fileSize") or "1 KB",
                    "dateLabel": "E2E",
                    "pages": 1,
                    "sortOrder": 999,
                    "isPublished": True,
                },
                expect=201,
            )
            doc = unwrap(payload) if status in (200, 201) else {}
            doc_id = doc.get("id")
            log(bool(doc_id), "POST /admin/documents", str(status))

        if doc_id:
            status, _ = request("DELETE", f"/admin/documents/{doc_id}", token=super_token)
            log(status == 200, "DELETE /admin/documents/:id", str(status))

        # Careers as Super Admin
        status, payload = request("GET", "/admin/careers/jobs", token=super_token)
        jobs = unwrap(payload) if status == 200 else []
        log(status == 200, "GET /admin/careers/jobs", f"count={len(jobs) if isinstance(jobs, list) else 0}")

        status, payload = request(
            "POST",
            "/admin/careers/jobs",
            token=super_token,
            body={
                "title": f"E2E Role {uniq}",
                "department": "Engineering",
                "location": "Addis Ababa",
                "jobType": "FULL_TIME",
                "description": "Temporary job for e2e.",
                "requirements": "Go\nDocker",
                "isOpen": True,
            },
            expect=201,
        )
        job = unwrap(payload) if status in (200, 201) else {}
        job_id = job.get("id")
        log(bool(job_id), "POST /admin/careers/jobs", str(status))
        if job_id:
            status, _ = request("DELETE", f"/admin/careers/jobs/{job_id}", token=super_token)
            log(status == 200, "DELETE /admin/careers/jobs/:id", str(status))

        status, _ = request("GET", "/admin/invitations", token=super_token)
        log(status == 200, "GET /admin/invitations", str(status))

    print("\n=== Marketer / Brochure + News ===")
    marketer_token = None
    if MARKETER_EMAIL and MARKETER_PASSWORD:
        marketer_token = login(MARKETER_EMAIL, MARKETER_PASSWORD)
        log(bool(marketer_token), "POST /auth/login (Marketer)")
    elif super_token:
        marketer_token = super_token
        skip("Marketer login", "using Super Admin token for shared routes")
    else:
        skip("Marketer flows", "Set E2E_MARKETER_EMAIL/PASSWORD or Super Admin creds")

    if marketer_token:
        status, payload = request("GET", "/admin/brochure", token=marketer_token)
        images = unwrap(payload).get("images", []) if status == 200 else []
        log(status == 200, "GET /admin/brochure", f"count={len(images)}")

        # tiny PNG
        png = (
            b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
            b"\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00"
            b"\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82"
        )
        status, payload = request(
            "POST",
            "/admin/brochure/upload",
            token=marketer_token,
            files={"file": ("e2e.png", png, "image/png")},
        )
        upload = unwrap(payload) if status == 200 else {}
        log(status == 200 and bool(upload.get("url")), "POST /admin/brochure/upload", str(status))

        img_id = None
        if upload.get("url"):
            status, payload = request(
                "POST",
                "/admin/brochure",
                token=marketer_token,
                body={
                    "title": f"E2E Slide {uniq}",
                    "imageUrl": upload["url"],
                    "sortOrder": 9999,
                    "isPublished": True,
                },
                expect=201,
            )
            img = unwrap(payload) if status in (200, 201) else {}
            img_id = img.get("id")
            log(bool(img_id), "POST /admin/brochure", str(status))
        if img_id:
            status, _ = request("DELETE", f"/admin/brochure/{img_id}", token=marketer_token)
            log(status == 200, "DELETE /admin/brochure/:id", str(status))

        status, payload = request("GET", "/admin/news/articles", token=marketer_token)
        articles = unwrap(payload).get("articles", []) if status == 200 else []
        log(status == 200, "GET /admin/news/articles", f"count={len(articles)}")

        status, payload = request("GET", "/admin/news/settings", token=marketer_token)
        log(status == 200, "GET /admin/news/settings", str(status))

        status, payload = request(
            "POST",
            "/admin/news/articles",
            token=marketer_token,
            body={
                "title": f"E2E Article {uniq}",
                "shortDescription": "Temporary article for automated e2e.",
                "fullContent": "<p>E2E body</p>",
                "status": "DRAFT",
                "isFeatured": False,
            },
            expect=201,
        )
        article = unwrap(payload) if status in (200, 201) else {}
        article_id = article.get("id")
        log(bool(article_id), "POST /admin/news/articles", str(status))
        if article_id:
            status, _ = request("DELETE", f"/admin/news/articles/{article_id}", token=marketer_token)
            log(status == 200, "DELETE /admin/news/articles/:id", str(status))

        # Marketer must NOT access documents admin
        status, _ = request("GET", "/admin/documents", token=marketer_token, expect=None)
        if MARKETER_EMAIL and marketer_token != super_token:
            log(status == 403, "Marketer blocked from /admin/documents", str(status))
        else:
            skip("Marketer RBAC check", "need distinct marketer token")

    print("\n=== Summary ===")
    print(f"passed={passed} failed={failed} skipped={skipped}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
