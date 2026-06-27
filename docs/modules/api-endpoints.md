# API REST — Specyfikacja endpointów

> **Base URL:** `http://localhost:3001/api`  
> **Auth:** Mock (single-user mode — zawsze zwraca pierwszy user z bazy)  
> **CORS:** `http://localhost:8081` (credentials: include)

## Endpointy

### 1. `GET /api/me`

Pobiera profil bieżącego użytkownika.

**Response:**
```json
{
  "id": 1,
  "email": "jan@intel.com",
  "name": "Jan",
  "stepGoal": 10000,
  "partner": "Intel",
  "avatarColor": "#22C55E",
  "level": 1
}
```

### 2. `GET /api/wallet`

Pobiera stan portfela i historię transakcji.

**Response:**
```json
{
  "balance": 120,
  "totalEarned": 250,
  "totalSpent": 130,
  "transactions": [
    {
      "id": 1,
      "type": "earned",
      "amount": 10,
      "description": "Nagroda za aktywność",
      "createdAt": "2026-06-26T..."
    }
  ]
}
```

### 3. `GET /api/history?type=all`

Filtrowana historia transakcji. `type`: `all` | `earned` | `spent`.

### 4. `POST /api/activity`

Zapisuje aktywność fizyczną i przyznaje Eco-Coiny.

**Body:**
```json
{
  "type": "walking",
  "value": 5000,
  "duration": 30
}
```

**Response:** `{ "ecoCoinsEarned": 10, "activity": { ... }, "streak": 5 }`

### 5. `GET /api/declarations`

Lista eko-deklaracji użytkownika.

### 6. `POST /api/declarations`

Nowa deklaracja (max 3/dzień).

**Body:** `{ "title": "string", "description": "string" }`

### 7. `GET /api/marketplace`

Lista dostępnych nagród.
**Query:** `?category=all|food|sport|tech|eco`

### 8. `GET /api/rewards/:id`

Szczegóły pojedynczej nagrody.

### 9. `POST /api/rewards/:id/redeem`

Wymiana Eco-Coinów na nagrodę.

**Response:** `{ "success": true, "newBalance": 50 }`

### 10. `GET /api/rankings?type=individual`

Ranking. `type`: `individual` | `team`.

**Response:**
```json
{
  "rankings": [ { "rank": 1, "name": "Anna", "steps": 12000 } ],
  "userRank": { "rank": 3, "name": "Jan", "steps": 8000 }
}
```

### 11. `GET /api/notifications`

Lista powiadomień.

### 12. `POST /api/notifications/:id/read`

Oznacza pojedyncze powiadomienie jako przeczytane.

### 13. `POST /api/notifications/read-all`

Oznacza wszystkie jako przeczytane.

### 14. `GET /api/achievements`

Lista achievementów z statusem odblokowania.

### 15. `GET /api/challenge`

Szczegóły aktualnego wyzwania.

### 16. `GET /api/profile`

Pełny profil użytkownika (statystyki + achievements).

### 17. `PATCH /api/profile`

Aktualizacja profilu (name, stepGoal).

**Body:** `{ "name": "Janek", "stepGoal": 12000 }`

### 18. `GET /api/settings`

Ustawienia: partner, wersja, funkcje.

## Kody błędów

| Status | Znaczenie |
|---|---|
| 200 | Sukces |
| 201 | Utworzono (activity, declarations) |
| 400 | Bad Request (nieprawidłowe dane, brak salda) |
| 404 | Not Found |
| 500 | Internal Server Error |
