# Root API (NestJS + Prisma + PostgreSQL)

## 1. Start PostgreSQL

```bash
cd server
docker compose up -d
```

## 2. Configure env

```bash
cp .env.example .env
```

## 3. Install and generate Prisma client

```bash
npm install
npm run prisma:generate
```

## 4. Run migrations and seed

```bash
npm run prisma:migrate -- --name init
npm run prisma:seed
```

## 5. Start API

```bash
npm run dev
```

API runs on `http://localhost:3001`.

## 6. Main endpoints

- `GET /api/me`
- `GET /api/wallet`
- `GET /api/history?type=all|earned|spent`
- `GET /api/market`
- `POST /api/market/redeem`
- `GET /api/activity`
- `POST /api/activity`
- `PATCH /api/activity/:id`
- `DELETE /api/activity/:id`
- `GET /api/declarations`
- `POST /api/declarations`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `POST /api/notifications/read-all`
- `GET /api/achievements`
- `GET /api/ranking`
- `GET /api/challenge/current`
- `PATCH /api/profile`
- `PATCH /api/settings`
