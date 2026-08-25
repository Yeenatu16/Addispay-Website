FROM golang:1.24-bookworm AS builder
WORKDIR /src

# go.mod may request a newer toolchain; auto-download when available.
ENV GOTOOLCHAIN=auto \
    CGO_ENABLED=0

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -ldflags="-s -w" -o /out/api ./cmd/api

FROM debian:bookworm-slim AS runtime
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/* \
  && useradd --system --create-home --uid 10001 addispay

WORKDIR /app
COPY --from=builder /out/api /app/api
COPY --from=builder /src/seed /app/seed

RUN mkdir -p /app/uploads/news /app/uploads/cv /app/uploads/documents /app/uploads/brochure \
  && chown -R addispay:addispay /app

USER addispay
ENV PORT=8080 \
    UPLOAD_DIR=/app/uploads \
    DB_SSLMODE=disable \
    GIN_MODE=release

EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/api/v1/health" || exit 1

CMD ["/app/api"]
