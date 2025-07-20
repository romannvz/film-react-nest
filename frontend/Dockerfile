# === build frontend ===
FROM node:20-alpine AS builder
WORKDIR /app

COPY frontend/package*.json ./
COPY docker/prod/.env.prod .env

RUN npm ci

COPY frontend/ .

RUN npm run build
