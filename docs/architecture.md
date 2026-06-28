# Architektura systemu

## Diagram warstw

```
┌──────────────────────────────────────────────────────────────┐
│                     Expo Universal App                       │
│  ┌──────────────────────┐  ┌──────────────────────────────┐  │
│  │    (mobile)          │  │         admin                │  │
│  │    Expo Router       │  │    web-only guard            │  │
│  │    maxWidth 480 web  │  │    6 tabów (dashboard,       │  │
│  │    14 ekranów        │  │    users, companies, tokens, │  │
│  │                      │  │    activities, analytics)    │  │
│  └──────┬───────────────┘  └────────┬─────────────────────┘  │
│         │                           │                        │
│  ┌──────┴───────────────────────────┴─────────────────────┐  │
│  │              Features (src/features/)                   │  │
│  │   admin/ | company/ | home/ | ranking/ | eko/ | market/ │  │
│  │   auth/  | common/                                       │  │
│  └──────────────────────────┬─────────────────────────────┘  │
│                             │                                │
│  ┌──────────────────────────┴─────────────────────────────┐  │
│  │         Shared Components (src/components/shared/)      │  │
│  │   LoadingState | ErrorCard | EmptyState | StatusBadge   │  │
│  │   ConfirmDialog | TableHeader | ActivitiesTab           │  │
│  └──────────────────────────┬─────────────────────────────┘  │
│                             │                                │
│  ┌──────────────────────────┴─────────────────────────────┐  │
│  │              Warstwa API (Axios + TanStack Query)      │  │
│  │              src/lib/api/endpoints/                     │  │
│  │   auth | market | activity | admin | company | challenge│  │
│  │   leaderboard | root | esg | certificate | notifications│  │
│  └──────────────────────────┬─────────────────────────────┘  │
│                             │                                │
│  ┌──────────────────────────┴─────────────────────────────┐  │
│  │              i18n (i18next + react-i18next)            │  │
│  │              src/i18n/messages/{pl,en}.json             │  │
│  │              ~400 kluczy, 19 namespace'ów               │  │
│  └──────────────────────────┬─────────────────────────────┘  │
└─────────────────────────────┼────────────────────────────────┘
                              │ HTTP REST (JSON)
                              │ localhost:3001/api/*
                              │ CORS: credentials: "include"
┌─────────────────────────────┼────────────────────────────────┐
│                    NestJS Backend                             │
│  ┌──────────────────────────┴─────────────────────────────┐  │
│  │            Moduły (rozdzielone):                        │  │
│  │   auth/ | admin/ | company/ | activity/ | challenge/    │  │
│  │   company/ zawiera: company.*, esg-report.*, certificate.*│  │
│  │   leaderboard.* | root.* | common/                      │  │
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

### 3. Feature-first z shared components

Projekt wydziela wspólne komponenty UI w `src/components/shared/` oraz feature-specific komponenty w `src/features/{feature}/`. Każdy feature ma własny katalog z opcjonalnymi `components/`, `tabs/` i `{feature}.styles.ts`.

### 4. i18n — pełne tłumaczenia

Wszystkie stringi UI są w `src/i18n/messages/{pl,en}.json` (~400 kluczy). Komponenty używają `useTranslation()` z react-i18next. Żaden hardcoded string w JSX.

### 5. Mock auth z migracją do JWT

Obecnie autoryzacja jest symulowana (Zustand store ustawia `isAuthenticated: true`). Docelowo:

- JWT access + refresh token
- Refresh token w HttpOnly cookie (scoped do `/api/auth`)
- Access token w cookie scoped do `/api`
- `GET /api/auth/me` jako canonical auth check
- Endpointy: `register`, `login`, `logout`, `refresh`, `me` pod `/api/auth/*`

### 6. Backend single-user mode

Obecnie backend zawsze zwraca dane pierwszego użytkownika w bazie (brak prawdziwej sesji). Po wdrożeniu JWT każdy request będzie identyfikowany przez token.

## Struktura katalogów

```
Root/
├── src/                      # Frontend (Expo)
│   ├── app/                  # Expo Router — routing i layouty
│   ├── components/           # Wspólne komponenty UI + ikony
│   │   ├── shared/           # LoadingState, ErrorCard, EmptyState, itp.
│   │   └── icons/            # 30+ ikon SVG
│   ├── features/             # Feature-based moduły
│   │   ├── admin/            # Panel admina (6 tabów)
│   │   ├── company/          # Panel firmy (4 taby)
│   │   ├── home/             # Ekran główny
│   │   ├── ranking/          # Ranking indywidualny i firmowy
│   │   ├── eko/              # Eko-rozwój
│   │   ├── market/           # Rynek nagród
│   │   └── auth/             # Autoryzacja
│   ├── i18n/                 # Tłumaczenia (pl/en, ~400 kluczy)
│   ├── lib/
│   │   ├── api/              # Axios + endpoint functions (per domena)
│   │   └── types/            # TypeScript types (DTO backendu)
│   ├── store/                # Zustand store (types, seeds, helpers)
│   └── styles/               # Design tokens + theme
├── server/                   # Backend (NestJS)
│   ├── src/                  # Moduły (rozdzielone per domena)
│   ├── prisma/               # Schema, migracje, seed
│   └── docker-compose.yml    # PostgreSQL
├── docs/                     # Dokumentacja
└── .opencode/                # AI configuration
```
