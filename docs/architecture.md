# Architektura systemu

## Diagram warstw

```
┌──────────────────────────────────────────────────────────────┐
│                     Expo Universal App                       │
│  ┌──────────────────────┐  ┌──────────────────────────────┐  │
│  │    (mobile)          │  │         admin                │  │
│  │    Expo Router       │  │    web-only guard            │  │
│  │    maxWidth 480 web  │  │    placeholder dashboard     │  │
│  └──────┬───────────────┘  └────────┬─────────────────────┘  │
│         │                           │                        │
│  ┌──────┴───────────────────────────┴─────────────────────┐  │
│  │              Warstwa API (Axios + TanStack Query)      │  │
│  │              src/lib/api/client.ts                     │  │
│  │              src/lib/api/endpoints.ts                  │  │
│  └──────────────────────────┬─────────────────────────────┘  │
└─────────────────────────────┼────────────────────────────────┘
                              │ HTTP REST (JSON)
                              │ localhost:3001/api/*
                              │ CORS: credentials: "include"
┌─────────────────────────────┼────────────────────────────────┐
│                    NestJS Backend                             │
│  ┌──────────────────────────┴─────────────────────────────┐  │
│  │            AppController (18 REST endpoints)            │  │
│  │            AppService (business logic)                  │  │
│  │            PrismaService (DB adapter)                   │  │
│  └──────────────────────────┬─────────────────────────────┘  │
│                             │                                │
│  ┌──────────────────────────┴─────────────────────────────┐  │
│  │              PostgreSQL 16 (pgvector)                   │  │
│  │              7 models, Prisma ORM                      │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Decyzje architektoniczne

### 1. Uniwersalna aplikacja (nie dwa fronty)

Zdecydowano się na jedno repo Expo z routingiem platformowym zamiast dwóch osobnych aplikacji (React SPA dla admina + React Native dla mobile). Uzasadnienie:

- Współdzielenie komponentów, typów, API clienta i store'a
- Szybszy onboarding dla zespołu hackathonowego
- Expo Web zapewnia wystarczającą jakość dla prostego panelu admina

### 2. Platform separation

- `src/app/admin/*` — działa wyłącznie na `Platform.OS === "web"`. Na iOS/Android renderuje fallback z informacją o niedostępności.
- `src/app/(mobile)/*` — działa na wszystkich platformach. Na webie wymuszony kontener `maxWidth: 480` symulujący ekran telefonu.

### 3. Feature-first bez shared UI warstwy

Projekt nie wydziela osobnej warstwy `shared/ui` — komponenty są lekkie, a ekrany budowane bezpośrednio w plikach tras. To świadoma decyzja dla fazy hackathonowej: redukcja abstrakcji kosztem potencjalnego duplikowania kodu.

### 4. Mock auth z migracją do JWT

Obecnie autoryzacja jest symulowana (Zustand store ustawia `isAuthenticated: true`). Docelowo:

- JWT access + refresh token
- Refresh token w HttpOnly cookie (scoped do `/api/auth`)
- Access token w cookie scoped do `/api`
- `GET /api/auth/me` jako canonical auth check
- Endpointy: `register`, `login`, `logout`, `refresh`, `me` pod `/api/auth/*`

### 5. Backend single-user mode

Obecnie backend zawsze zwraca dane pierwszego użytkownika w bazie (brak prawdziwej sesji). Po wdrożeniu JWT każdy request będzie identyfikowany przez token.

## Struktura katalogów

```
Root/
├── src/                      # Frontend (Expo)
│   ├── app/                  # Expo Router — routing i layouty
│   ├── features/             # Współdzielone komponenty domenowe
│   ├── i18n/                 # Tłumaczenia (JSON messages)
│   ├── lib/
│   │   ├── api/              # Axios + endpoint functions
│   │   └── types/            # TypeScript types (DTO backendu)
│   ├── store/                # Zustand store (persisted)
│   └── styles/               # Design tokens + theme
├── server/                   # Backend (NestJS)
│   ├── src/                  # Kontrolery, serwisy, moduły
│   ├── prisma/               # Schema, migracje, seed
│   └── docker-compose.yml    # PostgreSQL
├── docs/                     # Dokumentacja
└── .opencode/                # AI configuration
```
