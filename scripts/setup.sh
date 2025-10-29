#!/bin/bash
# the primary goal of this script is create/update all the files
# necessary for build process. For example: .env

echo "Setting up.."
source ./.env

# ============================
# Frontend
# ============================
echo "Working on frontend.."
cd ./apps/frontend/ && echo "NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL" >> .env.development && echo "NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL" >> .env.development && cd -
echo "Finished frontend!"

# ============================
# Postgres
# ============================
echo "Working on postgres.."
cd ./packages/postgres_db && echo "DATABASE_URL=$DATABASE_URL" >> .env && cd -
echo "Finished postgres!"

echo "Finished setting up.."
exit 0