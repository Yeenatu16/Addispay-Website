# Deploy AddisPay on Render (free tier, no Blueprint)

Blueprint is optional/paid. Create each resource manually:

1. **PostgreSQL** (database)
2. **Web Service** (Go API)
3. **Static Site** (Next.js frontend → `out/`)

---

## Architecture

```text
Browser
  │
  ├─ Static Site  (addispay-web)  ── HTML/JS from /out
  │         │
  │         └─ fetch ──►  Web Service (addispay-api)  ──►  PostgreSQL
  │                              │
  │                              └─ /app/uploads (ephemeral on free plan)
```

---

## Step 0 — Push the repo

Push this project to GitHub/GitLab so Render can build from it.

---

## Step 1 — PostgreSQL (free)

1. Render Dashboard → **New** → **PostgreSQL**
2. Name: `addispay-db`
3. Database / User: `addispay_db` / `addispay` (or defaults)
4. Region: pick one and reuse it for the API
5. Create
6. Open the DB → copy **Internal Database URL**  
   (use Internal when the API is in the same region)

---

## Step 2 — API Web Service (free)

1. **New** → **Web Service** → connect the same repo  
2. Settings:

| Field | Value |
|--------|--------|
| Name | `addispay-api` |
| Language / Runtime | **Docker** |
| Root Directory | *(leave empty)* |
| Dockerfile Path | `backend/Dockerfile` (or `Dockerfile`) |
| Docker Context | *(leave empty / default)* |
| Instance type | **Free** |
| Health Check Path | `/api/v1/health` |

3. **Disk** — skip on the free plan (Persistent Disks are paid).

4. **Environment** variables:

| Key | Value |
|-----|--------|
| `DATABASE_URL` | paste **Internal Database URL** |
| `DB_SSLMODE` | `require` |
| `UPLOAD_DIR` | `/app/uploads` |
| `GIN_MODE` | `release` |
| `ADDISPAY_JWT_SUPER_SECRET_KEY_2026` | long random string (Generate) |
| `FRONTEND_URL` | temporarily `https://placeholder` — update in Step 4 |
| `CORS_ALLOWED_ORIGINS` | same as `FRONTEND_URL` for now |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USERNAME` | your Gmail |
| `SMTP_PASSWORD` | Gmail App Password |
| `SMTP_FROM` | `AddisPay <your@gmail.com>` |

> **Free plan:** do **not** attach a Persistent Disk and do **not** set `/var/data`.  
> Use `UPLOAD_DIR=/app/uploads`. Files work, but they are wiped when the service redeploys or restarts.  
> Upgrade later if you need durable uploads.

5. **Create Web Service** → wait until healthy  
6. Copy the API URL, e.g. `https://addispay-api.onrender.com`  
7. Test: open `https://addispay-api.onrender.com/api/v1/health`

---

## Step 3 — Frontend Static Site (free)

1. **New** → **Static Site** → same repo  
2. Settings:

| Field | Value |
|--------|--------|
| Name | `addispay-web` |
| Root Directory | `frontend` |
| Build Command | `npm ci && NEXT_OUTPUT=export NEXT_PUBLIC_API_BASE_URL=https://addispay-api.onrender.com/api/v1 NEXT_PUBLIC_SITE_URL=https://addispay-web.onrender.com npm run build:static` |
| Publish Directory | `out` |

Replace the two URLs with your real API URL and the Static Site URL Render shows (you can update and rebuild once you know the web URL).

3. **Environment** (Static Site → Environment):

| Key | Value |
|-----|--------|
| `NEXT_OUTPUT` | `export` |
| `NEXT_PUBLIC_API_BASE_URL` | `https://addispay-api.onrender.com/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | `https://addispay-web.onrender.com` |

> `NEXT_PUBLIC_*` are baked in at **build** time. After changing them, trigger a new deploy.

4. Create Static Site → wait for build.

**Simpler build command** (if env vars are set in the dashboard):

```bash
npm ci && npm run build:static
```

---

## Step 4 — Wire CORS + frontend URL on the API

1. Open **addispay-api** → Environment  
2. Set:

```text
FRONTEND_URL=https://addispay-web.onrender.com
CORS_ALLOWED_ORIGINS=https://addispay-web.onrender.com
```

3. Save → service restarts  
4. If the Static Site URL changed, update `NEXT_PUBLIC_SITE_URL` / build command and **Manual Deploy** the Static Site again.

---

## Step 5 — First Super Admin

Only works when the database has **no** users yet:

```bash
curl -X POST https://addispay-api.onrender.com/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "fullName": "Super Admin",
    "email": "you@example.com",
    "password": "ChooseAStrongPassword1!",
    "role": "Super_Admin"
  }'
```

Then open:

`https://addispay-web.onrender.com/admin/login`

---

## Step 6 — Verify

- [ ] `GET …/api/v1/health` → UP  
- [ ] Homepage / brochure / documents load from API  
- [ ] Admin login works  
- [ ] Upload a brochure image + PDF (OK on free plan; files may disappear after redeploy)  
- [ ] SMTP invite / reset works  

---

## Build order (important)

1. Postgres  
2. API (so health + DB work)  
3. Static Site (build can call API for blog `generateStaticParams` if articles exist)  
4. Fix CORS / public URLs  
5. Rebuild Static Site once URLs are final  

If the Static Site builds **before** the API is up, blog slug pages may be empty until you rebuild after content exists.

---

## Optional: Frontend as Web Service instead of Static

If static export ever fails (dynamic routes, etc.), create a **free Web Service** instead of Static Site:

| Field | Value |
|--------|--------|
| Runtime | Docker |
| Dockerfile Path | `frontend/Dockerfile` |
| Docker Context | `frontend` |
| Docker Build Args | `NEXT_PUBLIC_API_BASE_URL=https://…/api/v1` |

No Blueprint required for this either.

---

## What not to use

- **Blueprint / `render.yaml`** — skip if you want to avoid paid Blueprint features; create the three resources above by hand.  
- Do **not** put secrets in the repo; only in Render Environment.

---

## Local static preview

```bash
cd frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1 npm run build:static
npx serve out
```
