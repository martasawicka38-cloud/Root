# Eco-Pulse — Dokumentacja Projektu

> **Status:** Hackathon (faza build)  
> **Stack:** Expo 56 + React 19 + NestJS 10 + PostgreSQL 16 + Prisma 7  
> **Typ aplikacji:** Uniwersalna aplikacja mobilno-webowa (B2B2C gamifikacja wellbeingu)

## Spis treści

| Dokument | Opis |
|---|---|
| [Architektura systemu](architecture.md) | Ogólny diagram warstw, decyzje architektoniczne, podział na platformy |
| **Moduły** | |
| [Frontend](modules/frontend.md) | Expo Router, struktura plików, design tokeny, i18n |
| [Ekrany mobilne](modules/mobile-screens.md) | Spis ekranów, routing, stany UI |
| [Panel admina](modules/admin.md) | Web-only admin, platform guards |
| [Backend NestJS](modules/backend.md) | Moduły, serwisy, konfiguracja |
| [API Endpoints](modules/api-endpoints.md) | REST API — pełna specyfikacja endpointów |
| [Baza danych](modules/database.md) | Schemat Prisma, modele, migracje |
| [Przepływ danych](modules/data-flow.md) | TanStack Query, Zustand, Axios |
| **Operacje** | |
| [Poradnik dewelopera](development.md) | Setup, uruchamianie, konwencje |
| [Deployment](deployment.md) | Docker, Nginx, CI/CD |

## Krótki opis produktu

Eco-Pulse to platforma well-beingowa dla firm, w której pracownicy:

- Zapisują aktywność fizyczną (kroki, sporty)
- Składają eko-deklaracje (eco-friendly actions)
- Zdobywają Eco-Coiny
- Rywalizują w rankingach (indywidualnym i zespołowym)
- Wymieniają monety na nagrody w marketplace
- Osiągają kolejne poziomy (achievementy)

Model biznesowy: B2B2C — firma klient (np. Intel, ERGO) kupuje dostęp dla pracowników.

## Kluczowe technologie

- **Frontend:** Expo 56, React 19.2, React Native 0.85, Expo Router 4, TanStack Query 5, Zustand 5, Axios
- **Backend:** NestJS 10, TypeScript 6.0, Prisma 7, PostgreSQL 16
- **UI:** react-native-web, design tokens (`src/styles/tokens.ts`)
- **Auth:** JWT (access + refresh token w HttpOnly cookie) — w trakcie implementacji
- **i18n:** i18next + react-i18next — skonfigurowane, ~400 kluczy, pl/en

## Architektura frontendu

```
src/
├── app/                  # Expo Router (routing + ekrany)
├── components/
│   ├── shared/           # Wspólne komponenty UI (9 komponentów)
│   └── icons/            # 30+ ikon SVG
├── features/             # Feature-based moduły
│   ├── admin/            # Panel admina (6 tabów)
│   ├── company/          # Panel firmy (4 taby)
│   ├── home/             # Ekran główny
│   ├── ranking/          # Ranking
│   ├── eko/              # Eko-rozwój
│   ├── market/           # Rynek nagród
│   └── auth/             # Autoryzacja
├── i18n/                 # Tłumaczenia (pl/en)
├── lib/api/endpoints/    # API podzielone per domena (11 plików)
├── store/                # Zustand (types, seeds, helpers)
└── styles/               # Design tokens
```

## Wspólne komponenty

| Komponent | Opis |
|-----------|------|
| `LoadingState` | ActivityIndicator + message |
| `ErrorCard` | Error title + detail + retry |
| `EmptyState` | Icon + message |
| `StatusBadge` | one_time/cyclical/active/inactive |
| `ConfirmDialog` | "Usunąć?" + Tak/Nie |
| `TableHeader` | Konfigurowalny nagłówek tabeli |
| `ActivitiesTab` | Unified tab (admin + company) |
| `ActivitiesForm` | Formularz tworzenia aktywności |
| `ActivitiesTable` | Tabela z listą aktywności |

## i18n

- **Biblioteka:** i18next + react-i18next
- **Pliki:** `src/i18n/messages/{pl,en}.json` (~400 kluczy)
- **Namespaces:** common, nav, auth, home, eco, market, ranking, activity, profile, history, notifications, achievements, challenge, declarations, reward, settings, editProfile, admin, company
- **Wzorzec:** `const { t } = useTranslation(); <Text>{t("home.greeting")}</Text>`

## Uruchomienie

```bash
# Backend
cd server
docker compose up -d     # PostgreSQL
npx prisma migrate dev   # Schemat bazy
npx prisma db seed       # Dane testowe
npm run start:dev        # NestJS na :3001

# Frontend
cd ..
npx expo start           # Expo dev server
```
