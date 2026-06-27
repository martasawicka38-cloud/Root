# Przepływ danych — TanStack Query + Zustand + Axios

## Architektura warstw

```
┌──────────────────────────────────────────────────────────┐
│                     Ekran (screen.tsx)                    │
│  useQuery / useMutation                                   │
│  + lokalny stan UI (useState)                             │
└─────────────────────┬────────────────────────────────────┘
                      │
┌─────────────────────┴────────────────────────────────────┐
│              TanStack Query (cache)                       │
│  useFetchXxx() — hooki w src/features/common/             │
│  Automatyczny refetch, cache invalidation                 │
└─────────────────────┬────────────────────────────────────┘
                      │
┌─────────────────────┴────────────────────────────────────┐
│              Axios (src/lib/api/client.ts)                │
│  Instancja z baseURL = EXPO_PUBLIC_API_URL                │
│  withCredentials: true                                    │
└─────────────────────┬────────────────────────────────────┘
                      │ HTTP REST
                      ▼
┌──────────────────────────────────────────────────────────┐
│              NestJS Backend (port 3001)                   │
└──────────────────────────────────────────────────────────┘
```

## Klient Axios (`src/lib/api/client.ts`)

```typescript
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
```

## Endpoint functions (`src/lib/api/endpoints.ts`)

18 funkcji opakowujących wywołania API:

| Funkcja | Metoda | URL | Użycie |
|---|---|---|---|
| `fetchMe()` | GET | `/me` | Home, Profile |
| `fetchWallet()` | GET | `/wallet` | Home, Profile |
| `fetchHistory(type)` | GET | `/history?type=` | History |
| `recordActivity(data)` | POST | `/activity` | Activity |
| `fetchDeclarations()` | GET | `/declarations` | Declarations |
| `createDeclaration(data)` | POST | `/declarations` | Declarations |
| `fetchMarketplace(category)` | GET | `/marketplace?category=` | Market |
| `fetchReward(id)` | GET | `/rewards/:id` | Reward |
| `redeemReward(id)` | POST | `/rewards/:id/redeem` | Reward |
| `fetchRankings(type)` | GET | `/rankings?type=` | Ranking |
| `fetchNotifications()` | GET | `/notifications` | Notifications |
| `markNotificationRead(id)` | POST | `/notifications/:id/read` | Notifications |
| `markAllNotificationsRead()` | POST | `/notifications/read-all` | Notifications |
| `fetchAchievements()` | GET | `/achievements` | Achievements |
| `fetchChallenge()` | GET | `/challenge` | Challenge |
| `fetchProfile()` | GET | `/profile` | Profile |
| `updateProfile(data)` | PATCH | `/profile` | EditProfile |
| `fetchSettings()` | GET | `/settings` | Settings |

## TanStack Query — użycie w ekranach

Każdy ekran wywołuje hook zapytania bezpośrednio:

```typescript
// home.tsx
const { data: user, isPending, error } = useQuery({
  queryKey: ["me"],
  queryFn: fetchMe,
});
```

**Stany renderowane:**

| Stan | Render |
|---|---|
| `isPending` | Skeleton / ActivityIndicator |
| `error` | Komunikat błędu + przycisk "Spróbuj ponownie" |
| `success` | Właściwa treść |

**Mutacje:**

```typescript
// activity.tsx
const mutation = useMutation({
  mutationFn: recordActivity,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["me"] });
    queryClient.invalidateQueries({ queryKey: ["wallet"] });
    router.back();
  },
});
```

## Zustand Store — stan lokalny

Zustand używany **wyłącznie** do:

- Stanu autoryzacji (mock: `isAuthenticated`)
- Statusu onboardingu
- Cache offline (persisted przez AsyncStorage)
- UI state (np. wybrany filtr kategorii w market)

**Nie przechowuje danych z API** — to rola TanStack Query.

## Schemat przepływu dla typowej operacji

```
1. Ekran mount → useQuery odpala fetchMe()
2. Axios → GET /api/me → NestJS → Prisma → PostgreSQL
3. Response → TanStack Query cache → ekran re-render
4. User wykonuje akcję → useMutation → POST /api/activity
5. onSuccess → invalidateQueries(["me", "wallet"])
6. Ekran re-render z nowymi danymi
```
