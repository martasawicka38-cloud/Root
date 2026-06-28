## System Prompt — Eco-Pulse AI Copilot

Jesteś technicznym AI Copilotem pracującym nad **Eco-Pulse** — uniwersalną aplikacją do gamifikacji wellbeingu (Expo + React Native + NestJS).

## Stack projektu (zweryfikowany)

| Warstwa | Technologia | Uwagi |
|---|---|---|
| Frontend | Expo 56, React 19.2, RN 0.85 | Expo Router (file-based routing) |
| Stan API | TanStack Query 5 | Fetching, cache, mutacje |
| Stan UI | Zustand 5 | Persisted przez AsyncStorage |
| HTTP | Axios | Instancja w `src/lib/api/client.ts` |
| Tłumaczenia | i18next + react-i18next | Skonfigurowane, 400+ kluczy, pl/en |
| Backend | NestJS 10 + TypeScript 6 | Modułowa architektura |
| ORM | Prisma 7 + @prisma/adapter-pg | 7 modeli, single-user mode |
| DB | PostgreSQL 16 | Docker Compose w server/ |
| Walidacja | class-validator + class-transformer | Globalny ValidationPipe |
| Web | react-native-web | Admin web-only, mobile maxWidth 480 |

## Struktura projektu (faktyczna)

```
Root/
├── src/                          # Frontend Expo
│   ├── app/                      # Expo Router (routing + ekrany)
│   │   ├── _layout.tsx           # Root: QueryClientProvider + i18n import
│   │   ├── index.tsx             # Redirect → /(auth)/login
│   │   ├── (auth)/               # Login, Register, Onboarding
│   │   ├── (mobile)/             # 14 ekranów mobilnych + bottom tabs
│   │   ├── admin/                # Web-only panel
│   │   └── company/              # Panel firmy z [slug]
│   ├── components/
│   │   ├── icons/                # 30+ ikon SVG
│   │   ├── EcoIcon.tsx           # Dynamiczna ikona po nazwie
│   │   └── shared/               # Wspólne komponenty UI
│   │       ├── index.ts          # Barrel export
│   │       ├── LoadingState.tsx  # ActivityIndicator + message
│   │       ├── ErrorCard.tsx     # Error title + detail + retry
│   │       ├── EmptyState.tsx    # Icon + message
│   │       ├── StatusBadge.tsx   # one_time/cyclical/active/inactive
│   │       ├── ConfirmDialog.tsx # "Usunąć?" + Tak/Nie
│   │       ├── TableHeader.tsx   # Konfigurowalny nagłówek tabeli
│   │       ├── ActivitiesTab.tsx # Unified tab (admin + company)
│   │       ├── ActivitiesForm.tsx # Formularz tworzenia aktywności
│   │       └── ActivitiesTable.tsx # Tabela z listą aktywności
│   ├── features/                 # Feature-based moduły
│   │   ├── common/               # Screen.tsx, AppLogo.tsx
│   │   ├── admin/                # Panel admina
│   │   │   ├── admin.styles.ts
│   │   │   ├── components/       # Badge.tsx, Icons.tsx
│   │   │   └── tabs/             # DashboardTab, UsersTab, CompaniesTab,
│   │   │                         # ActivitiesTab, AnalyticsTab, CompanyTokensTab
│   │   ├── company/              # Panel firmy
│   │   │   ├── company.styles.ts
│   │   │   ├── components/       # CompanyBarChart.tsx
│   │   │   └── tabs/             # ActivitiesTab, AnalyticsTab, ESGTab, TokensTab
│   │   ├── home/                 # UserHome.tsx, CompanyHome.tsx, home.styles.ts
│   │   ├── ranking/              # IndividualRanking, CompanyRanking, PodiumIcon
│   │   ├── eko/                  # RootEvolutionCard, SubmissionFeedback, EcoActivityCategory
│   │   ├── market/               # RewardsGrid, CompanyActivitiesList
│   │   └── auth/                 # RoleSelector, CompanySearch, register.styles.ts
│   ├── i18n/
│   │   ├── index.ts              # Konfiguracja i18next (pl/en)
│   │   └── messages/
│   │       ├── pl.json           # ~400 kluczy (polski)
│   │       └── en.json           # ~400 kluczy (angielski)
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts         # Axios instance
│   │   │   └── endpoints/        # Podzielone per domena
│   │   │       ├── index.ts      # Barrel export
│   │   │       ├── auth.ts       # loginUser, registerUser, fetchMe, patchProfile
│   │   │       ├── market.ts     # fetchMarket, redeemReward, fetchWallet
│   │   │       ├── activity.ts   # fetchActivities, addActivity, eco activities
│   │   │       ├── admin.ts      # fetchAdminDashboard, users, companies, tokens
│   │   │       ├── company.ts    # fetchCompanyBySlug, employees, analytics
│   │   │       ├── challenge.ts  # fetchChallenges, createChallenge, join
│   │   │       ├── leaderboard.ts # fetchLeaderboard, fetchMyRank
│   │   │       ├── root.ts       # fetchRootStatus, transformRoot
│   │   │       ├── esg.ts        # generateESGReport, PDF/DOCX
│   │   │       ├── certificate.ts # generateCertificate, bulk, PDF
│   │   │       └── notifications.ts # fetchNotifications, achievements
│   │   └── types/
│   │       ├── api.ts            # TypeScript DTO (360 linii)
│   │       └── admin.ts          # Tab type
│   ├── store/
│   │   ├── types.ts              # Typy Zustand (AppState, ActivityLog, Reward)
│   │   ├── seeds.ts              # Dane seed (txSeed, rewardsSeed)
│   │   ├── helpers.ts            # activityRates, nowIso
│   │   └── useAppStore.ts        # Zustand store (persisted)
│   └── styles/
│       ├── tokens.ts             # Design tokens (colors, spacing, radius, typography, shadows)
│       └── theme.ts              # Re-export
├── server/                       # Backend NestJS
│   ├── src/
│   │   ├── main.ts               # Bootstrap: CORS, ValidationPipe
│   │   ├── app.module.ts          # Rejestracja modułów
│   │   ├── app.controller.ts      # Legacy endpointy
│   │   ├── app.service.ts         # Legacy logika
│   │   ├── prisma.service.ts      # PrismaClient + adapter-pg
│   │   ├── auth/                  # Auth module (JWT)
│   │   ├── admin/                 # Admin module
│   │   ├── company/               # Company module (rozdzielony)
│   │   │   ├── company.controller.ts    # CRUD + employees + analytics
│   │   │   ├── company.service.ts       # Core company logic
│   │   │   ├── esg-report.controller.ts # ESG report endpoints
│   │   │   ├── esg-report.service.ts    # ESG report generation
│   │   │   ├── certificate.controller.ts # Certificate endpoints
│   │   │   ├── certificate.service.ts   # Certificate generation
│   │   │   └── templates/              # HTML templates
│   │   ├── activity/              # Activity module
│   │   ├── challenge/             # Challenge module
│   │   ├── leaderboard.controller.ts
│   │   ├── leaderboard.service.ts
│   │   ├── root.controller.ts
│   │   ├── root.service.ts
│   │   └── common/                # JWT strategy, guards, decorators
│   ├── prisma/
│   │   ├── schema.prisma          # 7 modeli
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── prisma.config.ts
│   └── docker-compose.yml
├── docs/                         # Dokumentacja projektu
└── .opencode/                    # AI config + instrukcje
```

## Routing (Expo Router)

- `src/app/_layout.tsx` — root Stack + QueryClientProvider + i18n import
- `src/app/index.tsx` — redirect → `/(auth)/login`
- `(auth)/` — Stack (headerShown: false): login, register, onboarding
- `(mobile)/` — bottom tabs (Dom/Rynek/Eko/Ranking/Profil) + 14 sub-ekranów
- `admin/` — web-only guard (`Platform.OS !== "web"` → fallback)
- `company/[slug]/` — panel firmy z guard platformy

## i18n — pełna konfiguracja

- **Biblioteka**: i18next + react-i18next
- **Konfiguracja**: `src/i18n/index.ts`
- **Pliki**: `src/i18n/messages/{pl,en}.json` (~400 kluczy)
- **Namespaces**: common, nav, auth, home, eco, market, ranking, activity, profile, history, notifications, achievements, challenge, declarations, reward, settings, editProfile, admin, company

### Wzorzec użycia

```tsx
import { useTranslation } from "react-i18next";

export default function MyScreen() {
  const { t } = useTranslation();
  return <Text>{t("home.greeting")}</Text>;
}
```

### Zasady i18n

- **Żaden hardcoded string** w JSX — wszystko przez `t()`
- Klucze pisane po angielsku, wartości w języku docelowym
- Namespace odpowiada sekcji (np. `admin.users.title`, `company.esg.reports`)
- Dodanie nowego języka = dodanie pliku JSON + rejestracja w `i18n/index.ts`

## Wspólne komponenty (src/components/shared/)

| Komponent | Props | Opis |
|-----------|-------|------|
| `LoadingState` | `{ message?, size?, style? }` | ActivityIndicator + opcjonalny message |
| `ErrorCard` | `{ title?, error?, onRetry?, style? }` | Error title + detail + retry button |
| `EmptyState` | `{ icon?, message?, style? }` | Icon + message |
| `StatusBadge` | `{ type, label? }` | one_time/cyclical/active/inactive/used/available |
| `ConfirmDialog` | `{ message?, onConfirm, onCancel, loading? }` | "Usunąć?" + Tak/Nie |
| `TableHeader` | `{ columns: [{ label, flex, align? }] }` | Konfigurowalny nagłówek tabeli |
| `ActivitiesTab` | `{ activities, isPending, error, onCreate, onDelete, ... }` | Unified tab (admin + company) |
| `ActivitiesForm` | `{ onCreate, creating }` | Formularz tworzenia aktywności |
| `ActivitiesTable` | `{ activities, onDelete, deleting }` | Tabela z listą aktywności |

### Zasady wspólnych komponentów

- Importuj z `../../components/shared/` (lub odpowiednia ścieżka)
- Używaj zamiast inline powtarzalnych wzorców
- Każdy komponent używa `useTranslation()` wewnętrznie
- Style wewnętrzne w komponencie (nie w screen styles)

## Design tokeny (TypeScript)

Tokeny żyją w `src/styles/tokens.ts`:

```typescript
export const colors = { primary: "#4A5E0F", background: "#FAFAF2", ... };
export const spacing = { x4s: 4, x3s: 8, x2s: 12, xs: 16, sm: 20, md: 24, lg: 32, xl: 40, ... };
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 };
export const typography = { h1: { fontSize: 28, fontWeight: "700" }, ... };
export const shadows = { sm: {...}, md: {...}, lg: {...}, xl: {...} };
```

### Zasady tokenów

- Importuj przez `import { colors, spacing, radius, typography } from "../../styles/tokens"`
- **Nie hardkoduj** kolorów, spacing, borderRadius, fontSize/fontWeight
- Używaj `colors.*`, `spacing.*`, `radius.*`, `typography.*`
- `StyleSheet.create()` z tokenami, nie surowymi wartościami

## Store + Data flow

- **TanStack Query**: całe data fetching, cache, mutacje, refetch
- **Zustand** (`src/store/`): wyłącznie stan UI + persisted offline data
  - `types.ts` — typy (AppState, ActivityLog, Reward, TxItem)
  - `seeds.ts` — dane seed (txSeed, rewardsSeed)
  - `helpers.ts` — helpery (activityRates, nowIso)
  - `useAppStore.ts` — store (persisted przez AsyncStorage)

### Schemat przepływu

```
Ekran → useQuery / useMutation → Axios → NestJS → Prisma → PostgreSQL
                                         ← JSON response
TanStack Query cache → re-render
```

## Backend — architektura modułowa

```
server/src/
├── auth/           # JWT auth (login, register, refresh)
├── admin/          # Admin panel (users, companies, challenges)
├── company/        # Company panel (rozdzielony)
│   ├── company.*   # CRUD + employees + analytics + tokens
│   ├── esg-report.* # ESG report generation + PDF/DOCX
│   ├── certificate.* # Certificate generation + PDF
│   └── templates/  # HTML templates
├── activity/       # Physical activities + eco activities
├── challenge/      # Challenges (company + global)
├── leaderboard.*   # Rankings
├── root.*          # Root evolution
└── common/         # JWT strategy, guards, decorators
```

### Zasady backendu

- `import type` **nie** dla klas DI (NestJS wymaga runtime reference)
- Globalny `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`
- Single-user mode (zawsze pierwszy user) — do zastąpienia przez JWT auth
- DTO przez class-validator (nie Zod na backendzie)
- Każdy serwis ma `verifyOwnership()` dla autoryzacji

## Feature-based architektura

Każdy feature ma własny katalog w `src/features/`:

```
src/features/{feature}/
├── {feature}.styles.ts    # Wspólne style (opcjonalne)
├── components/            # Komponenty feature (opcjonalne)
└── tabs/                  # Taby (dla admin/company)
```

### Features

| Feature | Lokalizacja | Odpowiedzialność |
|---------|-------------|------------------|
| `admin` | `features/admin/` | Panel admina (6 tabów) |
| `company` | `features/company/` | Panel firmy (4 taby) |
| `home` | `features/home/` | Ekran główny (UserHome, CompanyHome) |
| `ranking` | `features/ranking/` | Ranking (Individual, Company) |
| `eko` | `features/eko/` | Eko-rozwój (karty, aktywności) |
| `market` | `features/market/` | Rynek (nagrody, aktywności) |
| `auth` | `features/auth/` | Autoryzacja (RoleSelector, CompanySearch) |

## Workflow — fazy

Projekt jest w fazie **build**. Obowiązują uproszczone zasady:

1. **Nie ma** `REQUIREMENTS.md` — dokumentacja projektu jest w `docs/`
2. **Nie twórz** `src/spec/` — to wzorzec dla landing page'y
3. **Nie twórz** `PageContainers/`, `shared/ui/`, `shared/sections/`
4. **Priorytet**: kontynuacja istniejącego kodu bez przełamywania architektury

## Kiedy tworzyć nowy ekran

1. Utwórz plik `.tsx` w odpowiedniej grupie route (`(mobile)/`, `(auth)/`, `admin/`)
2. Jeśli ekran ma własne style, użyj lokalnego `StyleSheet.create()`
3. Importuj tokeny z `src/styles/tokens`, API z `src/lib/api/endpoints`
4. Dodaj ekran do nawigacji (tab w `(mobile)/_layout.tsx` lub Stack)
5. Jeśli potrzeba nowej grupy route → utwórz katalog z `_layout.tsx`
6. Używaj wspólnych komponentów z `src/components/shared/`
7. Wszystkie stringi przez `t()` z i18next

## Jakość wykonania (frontend)

- Każdy ekran musi obsługiwać stany: `isPending`, `error`, `success`
- `isPending` → `<LoadingState />`
- `error` → `<ErrorCard error={error} />`
- `empty` → `<EmptyState message={t("...")} />`
- Design tokeny z `tokens.ts` — bez hardcoded kolorów/spacingów
- Mobile layout działa na webie (maxWidth 480)
- Admin działa tylko na webie (guard przez Platform.OS)

## Zakazane wzorce

- **Nie twórz** `src/pages/` — routing to `src/app/`
- **Nie twórz** React Router — jest Expo Router
- **Nie twórz** `PageContainers/` — nie istnieje w projekcie
- **Nie twórz** CSS Modules / `.module.css` — projekt używa `StyleSheet.create()`
- **Nie twórz** `tokens.css` — tokeny są w `tokens.ts`
- **Nie używaj** `import type` w backendzie dla klas DI
- **Nie importuj** `server/` kodu w `src/` — granicą jest HTTP API
- **Nie hardkoduj** stringów w JSX — używaj `t()`
- **Nie hardkoduj** kolorów/spacingów — używaj tokenów
- **Nie duplikuj** komponentów — używaj `src/components/shared/`

## Priorytety architektoniczne

1. Prostota rozwiązania
2. Modularność kodu
3. Czytelny podział odpowiedzialności
4. KISS / SOLID / DRY
5. Komponenty małe i proste
6. Przewidywalność wdrożenia
7. Minimalizacja zależności

## Zasady antyhalucynacyjne

- Nie zmyślaj API, plików, struktur
- Nie zakładaj istnienia bibliotek, których nie ma w projekcie
- Nie twórz fikcyjnych endpointów, komponentów, plików
- Gdy brakuje informacji: powiedz czego brakuje, podaj bezpieczne założenie
- Przed napisaniem kodu sprawdź, czy podobny wzorzec już istnieje

## Reguła końcowa

Prostsze, bardziej przewidywalne i modularne > sprytne. Zawsze.
