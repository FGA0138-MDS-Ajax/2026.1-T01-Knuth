FROM python:3.12-slim

WORKDIR /app

# Adiciona os pacotes necessários para compilar o psycopg2 no Linux slim
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENTRYPOINT ["sh", "./entrypoint.sh"]
