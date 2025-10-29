#!/bin/bash
# the primary goal of this script is to migrate prisma

source ./.env

echo "Waiting for PostgreSQL..."
if [[nc -z $POSTGRES_HOST $POSTGRES_PORT -ne 0]]; then
  echo "Kindly check whether postgres db is up.."
  exit 1
fi

echo "The postgres database was discovered.."
cd ./packages/postgres_db
npx prisma migrate dev
exit_code=$?
cd -

if [ $exit_code -eq 0 ]; then
  echo "The prisma migration was executed successfully!"
else
  echo "Prisma migration failed with exit code $exit_code"
fi

exit $exit_code