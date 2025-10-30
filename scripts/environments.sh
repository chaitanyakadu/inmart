#!/bin/bash
# the primary goal of this script is to create environment file
# with all the essential variables.

echo "Creating .env file.."

if [[ -e ".env" ]]; then
  echo "File .env already exits."
  > .env
  echo "File .env cleared."
fi

# ============================
# Root Section
# ============================
echo "# Root" >> .env

read -p "Postgres username (default: postgres): " POSTGRES_USER
POSTGRES_USER=${POSTGRES_USER:-postgres}
echo "POSTGRES_USER=$POSTGRES_USER" >> .env

read -p "Postgres password (default: 1rq42tw53e): " POSTGRES_PASSWORD
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-1rq42tw53e}
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> .env

read -p "Postgres database name (default: inmart): " POSTGRES_DB
POSTGRES_DB=${POSTGRES_DB:-inmart}
echo "POSTGRES_DB=$POSTGRES_DB" >> .env

read -p "Postgres port (default: 5432): " POSTGRES_PORT
POSTGRES_PORT=${POSTGRES_PORT:-5432}
echo "POSTGRES_PORT=$POSTGRES_PORT" >> .env

read -p "Postgres host (default: localhost): " POSTGRES_HOST
POSTGRES_HOST=${POSTGRES_HOST:-localhost}
echo "POSTGRES_HOST=$POSTGRES_HOST" >> .env

echo "" >> .env


# ============================
# Backend Section
# ============================
echo "# Backend" >> .env

read -p "Backend port (default: 4000): " BACKEND_PORT
BACKEND_PORT=${BACKEND_PORT:-4000}
echo "BACKEND_PORT=$BACKEND_PORT" >> .env

read -p "Backend hostname (default: localhost): " BACKEND_HOSTNAME
BACKEND_HOSTNAME=${BACKEND_HOSTNAME:-localhost}
echo "BACKEND_HOSTNAME=$BACKEND_HOSTNAME" >> .env

read -p "Google client ID: " GOOGLE_CLIENT_ID
echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> .env

read -p "Google client secret: " GOOGLE_CLIENT_SECRET
echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> .env

read -p "Google redirect URI (default: http://localhost:4000/auth/login/callback): " GOOGLE_REDIRECT_URI
GOOGLE_REDIRECT_URI=${GOOGLE_REDIRECT_URI:-http://localhost:4000/auth/login/callback}
echo "GOOGLE_REDIRECT_URI=$GOOGLE_REDIRECT_URI" >> .env

read -p "Frontend URL (default: http://localhost:3000): " FRONTEND_URL
FRONTEND_URL=${FRONTEND_URL:-http://localhost:3000}
echo "FRONTEND_URL=\"$FRONTEND_URL\"" >> .env

read -p "Domain (default: localhost): " DOMAIN
DOMAIN=${DOMAIN:-localhost}
echo "DOMAIN=\"$DOMAIN\"" >> .env

read -p "Redis host (default: localhost): " REDIS_HOST
REDIS_HOST=${REDIS_HOST:-localhost}
echo "REDIS_HOST=\"$REDIS_HOST\"" >> .env

read -p "Node environment (default: DEVELOPMENT): " NODE_ENV
NODE_ENV=${NODE_ENV:-DEVELOPMENT}
echo "NODE_ENV=\"$NODE_ENV\"" >> .env

echo "" >> .env


# ============================
# Frontend Section
# ============================
echo "# Frontend" >> .env

read -p "Backend URL for frontend (default: http://localhost:4000): " NEXT_PUBLIC_BACKEND_URL
NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL:-http://localhost:4000}
echo "NEXT_PUBLIC_BACKEND_URL=\"$NEXT_PUBLIC_BACKEND_URL\"" >> .env

read -p "Socket URL for frontend (default: http://localhost:8080): " NEXT_PUBLIC_SOCKET_URL
NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL:-http://localhost:8080}
echo "NEXT_PUBLIC_SOCKET_URL=\"$NEXT_PUBLIC_SOCKET_URL\"" >> .env

echo "" >> .env


# ============================
# Task Handler
# ============================
echo "# Task Handler" >> .env

read -p "Mailjet API Key Public: " MJ_APIKEY_PUBLIC
echo "MJ_APIKEY_PUBLIC=$MJ_APIKEY_PUBLIC" >> .env

read -p "Mailjet API Key Private: " MJ_APIKEY_PRIVATE
echo "MJ_APIKEY_PRIVATE=$MJ_APIKEY_PRIVATE" >> .env

read -p "GOOGLE API Key: " GOOGLE_API_KEY
echo "GOOGLE_API_KEY=$GOOGLE_API_KEY" >> .env

read -p "Cron Time (default: * * * * * *): " CRON_TIME
CRON_TIME=${CRON_TIME:-"* * * * * *"}
echo "CRON_TIME=$CRON_TIME" >> .env

echo "" >> .env


# ============================
# Postgres URL
# ============================
echo "# Postgres" >> .env
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env

echo ""
echo "✅ .env file created successfully!"
echo "------------------------------------"
echo "Done."
exit 0