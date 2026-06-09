#!/bin/sh
set -e

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"

echo "Aguardando PostgreSQL em ${DB_HOST}:${DB_PORT}..."

until python - <<'PY'
import os
import sys

import psycopg2

try:
    conn = psycopg2.connect(
        dbname=os.environ["DB_NAME"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        host=os.environ.get("DB_HOST", "db"),
        port=os.environ.get("DB_PORT", "5432"),
        connect_timeout=3,
    )
    conn.close()
except psycopg2.OperationalError:
    sys.exit(1)
PY
do
  echo "PostgreSQL indisponível. Tentando novamente em 2s..."
  sleep 2
done

echo "PostgreSQL pronto. Aplicando migrations..."
python manage.py migrate

echo "Iniciando servidor Django..."
exec python manage.py runserver 0.0.0.0:8000
