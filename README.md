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
