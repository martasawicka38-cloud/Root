# Ekrany mobilne — Szczegółowy opis

## Lista ekranów

| Ścieżka | Plik | Typ | Opis |
|---|---|---|---|
| `(mobile)/home` | `home.tsx` | Tab | Dashboard: kroki, streak, deklaracje, challenge |
| `(mobile)/activity` | `activity.tsx` | Modal | Logowanie aktywności (6 typów sportu) |
| `(mobile)/declarations` | `declarations.tsx` | Stack | Eko-deklaracje (limit 3/dzień) |
| `(mobile)/market` | `market.tsx` | Tab | Marketplace nagród z filtrami |
| `(mobile)/reward` | `reward.tsx` | Stack | Szczegóły nagrody + redeem |
| `(mobile)/ranking` | `ranking.tsx` | Tab | Ranking team/individual + podium |
| `(mobile)/profile` | `profile.tsx` | Tab | Profil: avatar, statystyki, menu |
| `(mobile)/history` | `history.tsx` | Stack | Historia transakcji z filtrami |
| `(mobile)/challenge` | `challenge.tsx` | Stack | Szczegóły aktualnego wyzwania |
| `(mobile)/notifications` | `notifications.tsx` | Stack | Lista powiadomień, "read all" |
| `(mobile)/achievements` | `achievements.tsx` | Stack | Achievementy + status odblokowania |
| `(mobile)/edit-profile` | `edit-profile.tsx` | Modal | Edycja imienia i celu kroków |
| `(mobile)/settings` | `settings.tsx` | Stack | Informacje o partnerze, wersja, logout |

## Szczegóły ekranów

### Home (`home.tsx`)

**Źródło danych:** `useFetchMe`, `useFetchWallet`, `useFetchTodayActivity`

**Stany:**
- `isPending` → szkieletowe placeholder (3-4 bloki)
- `error` → komunikat z przyciskiem "Spróbuj ponownie"
- `success` → dashboard z sekcjami:
  - Licznik kroków (progress bar)
  - Streak (ciągła liczba dni)
  - Karuzela deklaracji (horizontal FlatList)
  - Banner aktualnego wyzwania

### Activity (`activity.tsx`)

**Źródło danych:** `useRecordActivity` (mutacja)

**Stany:**
- `isPending` → pusty formularz
- Wybór typu: walking, running, cycling, swimming, yoga, gym
- Input wartości (kroki / dystans / czas)
- `error` → inline błąd walidacji
- `success` → toast + przekierowanie do home

### Market (`market.tsx`)

**Źródło danych:** `useFetchMarketplace`

**Stany:**
- `isPending` → skeleton (grid kart)
- `error` → retry button
- `success` → grid nagród z kategoriami (filtrowanie)
  - Category pills (horizontal scroll)
  - Karta nagrody: image, nazwa, cena w Eco-Coinach

### Ranking (`ranking.tsx`)

**Źródło danych:** `useFetchRankings`

**Stany:**
- `isPending` → skeleton podium + listy
- `error` → retry
- `success`:
  - Tabs: Team / Individual
  - Podium (top 3)
  - Lista rankingowa z pozycją użytkownika

### Profile (`profile.tsx`)

**Źródło danych:** `useFetchMe`, `useFetchWallet`

**Stany:**
- `isPending` → skeleton avatara + statystyk
- `success`:
  - Avatar (inicjały na kolorowym tle)
  - Statystyki: kroki, streak, Eco-Coiny, poziom
  - Menu: Historia, Osiągnięcia, Powiadomienia, Ustawienia

## Stan globalny UI (bottom tabs)

Bottom tab bar zawiera 4 ikony:
1. **Dom** (`home`) — aktywny zielony akcent
2. **Rynek** (`market`) — aktywny zielony akcent
3. **Ranking** (`ranking`) — aktywny zielony akcent
4. **Profil** (`profile`) — aktywny zielony akcent
