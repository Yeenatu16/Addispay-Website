#!/bin/sh
set -eu

UPLOAD_DIR="${UPLOAD_DIR:-/app/uploads}"

# Render Persistent Disks are root-owned. Create the upload tree as root, then
# hand ownership to the runtime user before dropping privileges.
mkdir -p \
  "${UPLOAD_DIR}/news" \
  "${UPLOAD_DIR}/cv" \
  "${UPLOAD_DIR}/documents" \
  "${UPLOAD_DIR}/brochure"

if [ "$(id -u)" = "0" ] && id addispay >/dev/null 2>&1; then
  chown -R addispay:addispay "${UPLOAD_DIR}" || true
  exec su -s /bin/sh addispay -c 'exec /app/api'
fi

exec /app/api
