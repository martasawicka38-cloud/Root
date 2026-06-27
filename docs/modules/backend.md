# Backend NestJS — Architektura

## Stack

| Technologia | Wersja | Zastosowanie |
|---|---|---|
| NestJS | 10 | Framework backendowy |
| TypeScript | 6.0 | Język |
| Prisma | 7 | ORM + migracje |
| @prisma/adapter-pg | — | Adapter PostgreSQL |
| class-validator | — | DTO walidacja |
| class-transformer | — | Serializacja DTO |
| PostgreSQL | 16 | Baza danych |

## Struktura modułów

```
server/src/
├── main.ts                 # Bootstrap: CORS, ValidationPipe, port 3001
├── app.module.ts           # Root module (AppController, AppService, PrismaService)
├── app.controller.ts       # 18 REST endpoints
├── app.service.ts          # Business logic
├── prisma.service.ts       # PrismaClient + @prisma/adapter-pg
```

### main.ts — konfiguracja startowa

```typescript
const app = await NestFactory.create(AppModule);

app.enableCors({
  origin: process.env.CORS_ORIGIN || "http://localhost:8081",
  credentials: true,
});

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  })
);

await app.listen(process.env.PORT || 3001);
```

### PrismaService (`prisma.service.ts`)

- Inicjalizuje `PrismaClient` z `@prisma/adapter-pg` przy użyciu `pg`Pool
- `DATABASE_URL` pobierana z `process.env`
- Singleton serwis wstrzykiwany do `AppService`

### AppService (`app.service.ts`)

Centralny serwis biznesowy. Zawiera logikę dla wszystkich 18 endpointów. Kluczowe operacje:

- **Pobieranie użytkownika:** `findFirst()` (single-user mode — zawsze pierwszy user)
- **Zliczanie kroków:** sumuje aktywności z bieżącego dnia
- **Obliczanie streaka:** dni z rzędu z udokumentowaną aktywnością
- **Zarządzanie Eco-Coinami:** dodawanie/wydawanie z walidacją salda
- **Redeem nagrody:** sprawdza saldo, odejmuje monety, zapisuje transakcję
- **Rankingi:** agregacja aktywności + pozycja użytkownika

## Endpointy (18 REST)

Szczegółowa specyfikacja → [API Endpoints](api-endpoints.md)

## Plany rozwoju

- [ ] Prawdziwy moduł auth (JWT + guards)
- [ ] Podział `app.service.ts` na dedykowane serwisy domenowe
- [ ] Rate limiting na endpointach auth
- [ ] Healthcheck endpoint
- [ ] Logger strukturalny zamiast console.log
