#!/bin/sh
source ./.env

apt update
apt upgrade -y
apt install netcat-traditional -y

echo "⏳ Waiting for Postgres to be ready at $POSTGRES_HOST:$POSTGRES_PORT..."

until nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  sleep 2
done

./scripts/prisma.sh

echo "✅ Postgres is ready — starting the microservice..."

