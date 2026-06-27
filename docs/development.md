# Poradnik dewelopera

## Wymagania

- Node.js 20+
- npm 10+
- Docker + Docker Compose
- Expo CLI (`npx expo`)
- Android Studio / Xcode (opcjonalnie, dla symulatorów)

## Pierwsze uruchomienie

### 1. Backend

```bash
cd server
cp .env.example .env    # edytuj jeśli potrzeba
docker compose up -d    # PostgreSQL na :5432
npm install
npx prisma migrate dev  # aplikuje migracje
npx prisma db seed      # seed danych testowych
npm run start:dev       # NestJS na http://localhost:3001
```

### 2. Frontend

```bash
# w katalogu głównym
cp .env.example .env    # EXPO_PUBLIC_API_URL=http://localhost:3001/api
npm install
npx expo start          # Expo dev server
```

### 3. Uruchomienie

- `w` → otwiera w przeglądarce (mobile view max 480px)
- `a` → otwiera na Android emulatorze
- `i` → otwiera na iOS symulatorze
- `http://localhost:8081` → web

## Linki dla admina

Panel admina dostępny na:
- Web: `http://localhost:8081/admin`
- Mobile: komunikat "Panel dostępny tylko na desktopie"

## Dane testowe

Po reseedzie:
- **Email:** jan@intel.com
- **Cel kroków:** 10 000
- **Partner:** Intel
- **Eco-Coiny:** 120
- **Nagrody w marketplace:** 4

## Komendy Prisma

```bash
# backend/server/
npx prisma migrate dev          # nowa migracja + apply
npx prisma migrate deploy       # apply migracji w produkcji
npx prisma db push              # push schematu bez migracji
npx prisma db seed              # seed danych
npx prisma studio               # GUI do bazy (localhost:5555)
npx prisma generate             # generacja klienta
```

## Konwencje kodowania

### Frontend

- Pliki: PascalCase dla komponentów, camelCase dla funkcji
- Routing: kebab-case w ścieżkach Expo Router
- Typy: w `src/lib/types/api.ts`, import przez `import type { ... }`
- Store: Zustand z persisted AsyncStorage
- API: Axios + TanStack Query (żadnych gołych fetch/useEffect)

### Backend

- NestJS moduły: jeden controller + service + module per feature (docelowo)
- DTO: class-validator + class-transformer
- Walidacja: globalny ValidationPipe (whitelist, forbidNonWhitelisted, transform)
- Nie importować przez `import type` dla klas DI (NestJS wymaga runtime ref)

## Troubleshooting

| Problem | Rozwiązanie |
|---|---|
| `EACCES` na `/tmp` | `export TMPDIR="$HOME/tmp" && mkdir -p "$HOME/tmp"` |
| Backend nie łączy z DB | Sprawdź `docker ps`, `docker compose logs` |
| CORS error | Sprawdź `EXPO_PUBLIC_API_URL` i port backendu |
| Prisma Client not found | Uruchom `npx prisma generate` w `server/` |
