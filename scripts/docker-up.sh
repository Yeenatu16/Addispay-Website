#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example — edit secrets before production use."
fi

docker compose up --build -d
docker compose ps
echo
echo "Website:  ${FRONTEND_URL:-http://localhost:3000}"
echo "API:      http://localhost:${BACKEND_PORT:-8080}/api/v1/health"
