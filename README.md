# AddisPay Fullstack Project

This repository contains the AddisPay website frontend and backend codebases.
The root contains two main folders:

- `frontend/` — Next.js frontend application
- `backend/` — Go backend API server

## Prerequisites

Make sure the team has these installed locally:

- Node.js 24.x or later
- npm 10.x or later
- Go 1.26 or later
- Git

## Backend Setup

1. Open a terminal and change into the backend folder:

```bash
cd /home/LILAD/Desktop/All Projects/AddisPay/backend
```

2. Download and verify Go module dependencies:

```bash
go mod tidy
```

3. Run the backend server:

```bash
go run ./cmd/api
```

4. Expected backend API base URL:

```text
http://localhost:8080/api/v1
```

## Frontend Setup

1. Open a separate terminal and change into the frontend folder:

```bash
cd /home/LILAD/Desktop/All Projects/AddisPay/frontend
```

2. Install frontend dependencies:

```bash
npm install
```

3. Create or verify environment variables in `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

4. Start the frontend development server:

```bash
npm run dev
```

5. Open the app in the browser:

```text
http://localhost:3000
```

## Docker deployment

The repo includes a production-oriented Compose stack: Postgres, Go API, and Next.js.

1. Copy env defaults and set secrets:

```bash
cp .env.example .env
```

Edit `.env` with production URLs, DB password, JWT secret, and SMTP. See `.env.example` for the full list.

2. Build and start everything:

```bash
docker compose up --build -d
```

3. Open:

- Website: http://localhost:3000
- API health: http://localhost:8080/api/v1/health

4. First Super Admin (only when the database has no users):

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"fullName":"Super Admin","email":"admin@example.com","password":"ChangeMe123!","role":"Super_Admin"}'
```

5. Stop:

```bash
docker compose down
```

Uploaded files persist in the `backend_uploads` volume; database data persists in `postgres_data`.

## Deploy on Render (free, no Blueprint)

Create **three** resources manually (Blueprint not required):

1. **PostgreSQL** — database  
2. **Web Service** — Go API (`backend/Dockerfile`)  
3. **Static Site** — frontend (`frontend/`, publish `out/`)

Full click-by-click guide: **[docs/RENDER.md](docs/RENDER.md)**

Short version:

1. Create Postgres → copy Internal Database URL.  
2. Create API Web Service (Docker, context `backend`) + disk at `/var/data` → set `DATABASE_URL`, JWT, SMTP, `UPLOAD_DIR=/var/data/uploads`.  
3. Create Static Site (root `frontend`):
   - Build: `npm ci && npm run build:static`
   - Publish: `out`
   - Env: `NEXT_OUTPUT=export`, `NEXT_PUBLIC_API_BASE_URL=https://<api>.onrender.com/api/v1`  
4. Set API `FRONTEND_URL` + `CORS_ALLOWED_ORIGINS` to the Static Site URL; redeploy API.  
5. Rebuild Static Site if URLs changed.  
6. Register first Super Admin via `POST /api/v1/auth/register`.

### End-to-end smoke test

With local API + frontend running:

```bash
E2E_SUPER_EMAIL=you@example.com E2E_SUPER_PASSWORD='your-password' \
E2E_MARKETER_EMAIL=marketer@example.com E2E_MARKETER_PASSWORD='your-password' \
python3 scripts/e2e_test.py
```

## Frontend Build and Lint

To verify the frontend build and lint configuration:

```bash
npm run build
npm run lint
```

## Backend Validation

To verify backend packages and build integrity:

```bash
go test ./...
```

## Project Structure

### Frontend

- `frontend/src/app` — Next.js app routes and layout
- `frontend/src/components` — shared UI components
- `frontend/src/lib` — shared utilities and API client
- `frontend/postcss.config.mjs` — Tailwind/PostCSS configuration
- `frontend/next.config.mjs` — Next.js configuration

### Backend

- `backend/cmd/api` — backend server entrypoint
- `backend/internal` — domain packages, delivery, use cases, and server router
- `backend/internal/server/router.go` — route registration

## Team Guidelines

- Keep common setup steps in the root README.
- Frontend developers should focus on `frontend/src` and use the backend API URL from `.env.local`.
- Backend developers should focus on `backend/internal` and expose API routes under `/api/v1`.
- Avoid adding hardcoded API endpoints in components; use shared client utilities.

## Notes

- The current frontend uses Tailwind CSS with `@tailwindcss/postcss` and default Tailwind v4 configuration.
- The backend is designed as a Go API server; additional routes should be added under `backend/internal/*/delivery`.
- For local development, run backend first, then frontend.
- Docker image builds need outbound access to Docker Hub (`golang`, `node`, `postgres`, `debian` base images).
- Frontend Docker builds set `output: "standalone"` and bake `NEXT_PUBLIC_API_BASE_URL` at image build time — rebuild the frontend image if the public API URL changes.
