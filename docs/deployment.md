# Deployment i DevOps

## Obecny stan

- `docker-compose.yml` istnieje tylko w `server/` (uruchamia PostgreSQL)
- **Brak** produkcyjnych Dockerfile'ów dla NestJS i frontendu
- **Brak** konfiguracji Nginx
- **Brak** CI/CD pipeline

## Planowany stack produkcyjny

```
Internet → Nginx (reverse proxy, port 443)
  ├── /api/* → NestJS (port 3001)
  └── /* → Frontend (Expo Web, statyczne pliki)
```

## Docelowa struktura Docker

```
docker-compose.yml (root)
├── postgres         → PostgreSQL 16 (image)
├── server           → NestJS (build: ./server/Dockerfile)
│   └── depends_on: postgres (healthy)
├── server-migrate   → One-shot: prisma migrate deploy
│   └── depends_on: postgres (healthy)
└── frontend         → Nginx z buildem Expo Web
    └── depends_on: server (healthy)
```

### Backend Dockerfile (szkic)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma/ prisma/
COPY prisma.config.* ./
RUN npm ci && npx prisma generate
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.* ./
USER appuser
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://localhost:3001/api/health')"
CMD ["node", "dist/main"]
```

### Frontend Dockerfile (szkic)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx expo export --platform web

FROM nginx:alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost/healthz || exit 1
```

### Nginx config (szkic)

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location /api/ {
        proxy_pass http://server:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /healthz {
        return 200 "OK";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## CI/CD (GitHub Actions — szkic)

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker compose -f docker-compose.yml build
      - run: docker compose -f docker-compose.yml push
      # deploy na VPS przez SSH / docker stack deploy
```

## Zmienne środowiskowe (produkcja)

| Zmienna | Opis |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Sekret do podpisu JWT |
| `CORS_ORIGIN` | Domena frontendu (np. https://app.ecopulse.com) |
| `EXPO_PUBLIC_API_URL` | URL API (np. https://api.ecopulse.com) |
| `PORT` | Port NestJS (domyślnie 3001) |

## Uwagi

- Wszystkie kontenery runtime jako nieuprzywilejowany użytkownik
- Healthchecki na każdej usłudze
- Zależności między usługami przez `condition: service_healthy`
- Migracje jako osobny one-shot container przed startem serwera
- Brak secretów w docker-compose.yml — ładowane przez env_file
