FROM golang:1.24-bookworm AS builder
WORKDIR /src

# go.mod may request a newer toolchain; auto-download when available.
ENV GOTOOLCHAIN=auto \
    CGO_ENABLED=0

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ .
RUN go build -ldflags="-s -w" -o /out/api ./cmd/api

FROM debian:bookworm-slim AS runtime
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/* \
  && useradd --system --create-home --uid 10001 addispay

WORKDIR /app
COPY --from=builder /out/api /app/api
COPY --from=builder /src/seed /app/seed

RUN printf '#!/bin/sh\n\
set -eu\n\
\n\
UPLOAD_DIR="${UPLOAD_DIR:-/app/uploads}"\n\
\n\
mkdir -p \\\n\
  "${UPLOAD_DIR}/news" \\\n\
  "${UPLOAD_DIR}/cv" \\\n\
  "${UPLOAD_DIR}/documents" \\\n\
  "${UPLOAD_DIR}/brochure"\n\
\n\
if [ "$(id -u)" = "0" ] && id addispay >/dev/null 2>&1; then\n\
  chown -R addispay:addispay "${UPLOAD_DIR}" || true\n\
  exec su -s /bin/sh addispay -c "exec /app/api"\n\
fi\n\
\n\
exec /app/api\n' > /app/docker-entrypoint.sh \
  && chmod +x /app/docker-entrypoint.sh \
  && mkdir -p /app/uploads/news /app/uploads/cv /app/uploads/documents /app/uploads/brochure \
  && chown -R addispay:addispay /app

# Start as root so we can chown Render disk mounts, then drop to addispay.
USER root
ENV PORT=8080 \
    UPLOAD_DIR=/app/uploads \
    DB_SSLMODE=disable \
    GIN_MODE=release

EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/api/v1/health" || exit 1

ENTRYPOINT ["/app/docker-entrypoint.sh"]
