# Panel admina — Web-only dashboard

## Platform guard

Panel admina działa wyłącznie na web. Komponent sprawdza `Platform.OS !== "web"` i renderuje fallback na iOS/Android.

## Dashboard z metrykami (API)

`GET /api/admin/dashboard` — zwraca zagregowane dane dla panelu admina.

### Response

```ts
{
  users: {
    total: number;                  // liczba użytkowników
    activeDeclarations: number;     // liczba deklaracji
    participationRate: number;      // % użytkowników z min. 1 aktywnością
  },
  economy: {
    totalEcInCirculation: number;   // suma sald wszystkich użytkowników
    totalEarned: number;            // suma zarobionych EC
    totalSpent: number;             // suma wydanych EC
  },
  activity: {
    totalActivities: number;        // liczba aktywności
    totalSteps: number;             // suma kroków
    avgStepsPerActivity: number;    // średnia kroków na aktywność
    weeklySteps: { day: string; steps: number }[];  // ostatnie 7 dni
  },
  recentActivity: {                 // ostatnie 10 aktywności (wszyscy userzy)
    id: string;
    userName: string;
    type: string;
    points: number;
    createdAt: string;
  }[]
}
```

## Obecny stan

| Funkcjonalność | Status |
|---|---|
| Web-only guard | ✅ |
| Placeholder dashboard | ✅ |
| Dashboard z metrykami (API) | ✅ |
| Zarządzanie użytkownikami | ✅ |
| Zarządzanie nagrodami | ❌ |
| Zarządzanie deklaracjami | ❌ |
| Podgląd rankingów | ❌ |
| Raporty i export | ❌ |
| Konfiguracja challenge'ów | ❌ |

## Frontend

- `src/app/admin/index.tsx` — ekran dashboardu z TanStack Query (useQuery)
- Dane pobierane przez `fetchAdminDashboard()` z `src/lib/api/endpoints.ts`
- Typ `AdminDashboard` w `src/lib/types/api.ts`

## Backend

- Endpoint w `AppController.get("/api/admin/dashboard")`
- Logika w `AppService.adminDashboard()`
- Wykorzystuje istniejące modele Prisma (User, Activity, Declaration, Transaction)

## Planowane endpointy

- `GET /api/admin/users` — lista użytkowników
- `GET /api/admin/rewards` — zarządzanie nagrodami
- `GET /api/admin/declarations` — moderacja deklaracji
- `GET /api/admin/ranking` — podgląd rankingów

## Zasady

- Nie dodawać tras admin do `(mobile)` — są wyłącznie webowe
- Nie renderować komponentów admin na mobile — guard w komponencie
- UI admina może być responsywne, ale priorytetem jest desktop
- Wszystkie dane admin pobierane przez dedykowane endpointy API (`/api/admin/*`)
