# Frontend — Architektura Expo

## Stack

| Technologia | Wersja | Zastosowanie |
|---|---|---|
| Expo | 56 | Framework uniwersalny |
| React | 19.2.3 | UI |
| React Native | 0.85.3 | Natywny runtime |
| Expo Router | 4 | Routing i nawigacja |
| TanStack Query | 5 | Fetchowanie danych, cache, mutacje |
| Zustand | 5 | Stan UI + persisted store |
| Axios | — | HTTP client |
| react-native-web | — | Web support |
| i18next | — | Tłumaczenia (w trakcie) |

## Routing — Expo Router (`src/app/`)

```
src/app/
├── _layout.tsx              # Root: QueryClientProvider + Stack
├── index.tsx                # Redirect → /(auth)/login
├── (auth)/
│   ├── _layout.tsx          # Stack (headerShown: false)
│   ├── login.tsx            # Logowanie
│   ├── register.tsx         # Rejestracja z wyborem partnera
│   └── onboarding.tsx       # 3-etapowe wprowadzenie
├── (mobile)/
│   ├── _layout.tsx          # Bottom tabs + web maxWidth 480
│   └── *.tsx                # 14 ekranów mobilnych
└── admin/
    ├── _layout.tsx          # Web-only guard
    └── index.tsx            # Panel admina
```

### Root layout (`_layout.tsx`)

- Montuje `QueryClientProvider` z TanStack Query
- Konfiguruje `Stack` z `headerShown: false`
- Wszystkie providery globalne

### Auth group (`(auth)/`)

- `headerShown: false` — czysty ekran logowania/rejestracji
- `register.tsx`: wybór firmy (Intel / ERGO) przed formularzem
- `onboarding.tsx`: 3 kroki (powitanie → zgoda → pierwszy cel kroków)

### Mobile group (`(mobile)/`)

- Bottom tab navigator z 4 ikonami: Dom, Rynek, Ranking, Profil
- Wiele ekranów poza tabami: activity, declarations, challenge, history, notifications, achievements, settings, edit-profile
- Na webie: wrapper `maxWidth: 480, margin: "auto", height: "100vh"`

### Admin group (`admin/`)

- Guard: `Platform.OS !== "web"` → renderuje fallback "Panel dostępny tylko na desktopie"
- Docelowo: dashboard z metrykami, zarządzanie użytkownikami, nagrodami

## Design tokeny (`src/styles/tokens.ts`)

```typescript
export const colors = {
  primary: "#22C55E",           // Zielony — główny akcent
  primaryLight: "#86EFAC",      // Jasny zielony (tła, badge)
  primaryDark: "#15803D",       // Ciemny zielony (hover)
  secondary: "#3B82F6",         // Niebieski (linki, akcenty)
  background: "#0F172A",        // Ciemne tło (dark mode)
  surface: "#1E293B",           // Karty, sekcje
  surfaceLight: "#334155",      // Inputy, border
  textPrimary: "#F8FAFC",       // Główny tekst
  textSecondary: "#94A3B8",     // Secondary text
  success: "#22C55E",
  error: "#EF4444",
  warning: "#F59E0B",
  white: "#FFFFFF",
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 };
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 };
export const typography = { /* fontSizes + fontWeights + lineHeights */ };
export const shadows = { sm: { ... }, md: { ... }, lg: { ... }, xl: { ... } };
```

## i18n (`src/i18n/`)

Obecnie minimalne tłumaczenia (4 klucze PL/EN). Docelowo:

- Namespace'y: `common`, `auth`, `nav`, `mobile`, `admin`, `footer`
- `src/i18n/messages/{pl,en}.json`
- Klucze angielskie, wartości w języku docelowym
- `i18next` + `react-i18next` do integracji
- Fallback: angielski

## Store — Zustand (`src/store/useAppStore.ts`)

Persisted store (AsyncStorage) zawierający:

| Sekcja | Klucze | Cel |
|---|---|---|
| Auth | `isAuthenticated`, `user` | Stan logowania (mock → JWT) |
| Onboarding | `hasCompletedOnboarding` | Czy onboarding zakończony |
| Wallet | `balance`, `transactions` | Stan portfela |
| Activities | `activities`, `todaySteps`, `streak` | Aktywności + streak |
| Marketplace | `rewards`, `categories` | Lista nagród |
| Notifications | `notifications`, `unreadCount` | Powiadomienia |
| Rankings | `rankings`, `userRank` | Rankingi |
