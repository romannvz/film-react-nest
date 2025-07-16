# === build frontend ===
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# === build nginx-server ===
FROM nginx:1.25-alpine AS production

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/film.conf /etc/nginx/conf.d/film.conf
COPY --from=builder /app/dist /usr/share/nginx/film/

CMD ["nginx", "-g", "daemon off;"]
