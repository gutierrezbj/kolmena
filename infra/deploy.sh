#!/usr/bin/env bash
# Kolmena — Staging deploy script
# Usage: ./infra/deploy.sh [--no-migrate]
# Run from the repo root on the Mac Mini (bleu) or VPS staging.
set -euo pipefail

COMPOSE="docker compose -f infra/docker-compose.staging.yml"
ENV_FILE="infra/.env.staging"
SKIP_MIGRATE=false

for arg in "$@"; do
  [[ "$arg" == "--no-migrate" ]] && SKIP_MIGRATE=true
done

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found. Copy infra/.env.staging.example and fill in the values."
  exit 1
fi

echo "==> Pulling latest code"
git pull --ff-only

echo "==> Building images"
$COMPOSE --env-file "$ENV_FILE" build --no-cache kolmena-api kolmena-admin

echo "==> Starting infrastructure (db + redis)"
$COMPOSE --env-file "$ENV_FILE" up -d kolmena-db kolmena-redis

echo "==> Waiting for DB to be healthy..."
until $COMPOSE exec -T kolmena-db pg_isready -U kolmena -q; do
  sleep 2
done

if [[ "$SKIP_MIGRATE" == false ]]; then
  echo "==> Running migrations"
  $COMPOSE --env-file "$ENV_FILE" run --rm kolmena-api \
    node -e "import('./dist/shared/db/migrate.js').catch(e => { console.error(e); process.exit(1); })"
fi

echo "==> Deploying API and admin"
$COMPOSE --env-file "$ENV_FILE" up -d --remove-orphans kolmena-api kolmena-admin

echo "==> Cleaning up old images"
docker image prune -f

echo ""
echo "Deploy complete."
echo "  API:   http://127.0.0.1:4080/health"
echo "  Admin: http://127.0.0.1:3080"
