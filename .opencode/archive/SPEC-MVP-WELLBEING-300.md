# Eco-Pulse — Specyfikacja Funkcjonalna MVP
## Wariant: Wellbeing dla 300 pracowników (ERGO Hestia)

---

## 1. Role w systemie

| Rola | Opis | Liczba |
|---|---|---|
| **Pracownik** | użytkownik aplikacji mobilnej | do 300 |
| **HR Admin** | zarządza programem (panel web) | 1–3 |
| **Super Admin** | administracja platformą (my) | 1–2 |

---

## 2. Moduły — podział na fazy

### Faza 1 — Core MVP (tydzień 1–6)

#### A. Rejestracja i onboarding
- Logowanie przez email + hasło lub SSO (Google/Apple)
- Onboarding 3-ekranowy: (1) cel — "zmieniamy nawyki", (2) privacy — zgoda na przetwarzanie danych (RODO), (3) start — pierwsze wyzwanie
- Profil: imię, avatar, cel tygodniowy (kroki / eko-działania)
- Dołączenie do grupy firmowej po kodzie invite (unikalny kod dla ERGO Hestia)

#### B. Moduł aktywności — licznik kroków
- Automatyczny odczyt kroków z HealthKit (iOS) i Google Fit (Android)
- Ręczne dodanie aktywności (bieganie, rower, joga — przelicznik na kroki)
- Daily goal: domyślnie 8 000 kroków, możliwość zmiany przez użytkownika
- Progres bar na głównym ekranie: "udało Ci się 6 200 / 8 000 kroków"
- Synch co 15 min + manual pull-to-refresh

#### C. Moduł eko-deklaracji
- Lista prostych deklaracji eko:
  - "Nie kupiłem plastiku jednorazowego" (+10 pkt)
  - "Posadziłem roślinę/drzewo" (+30 pkt)
  - "Pojechałem rowerem zamiast autem" (+20 pkt)
  - "Oddałem elektrośmieci do recyklingu" (+25 pkt)
  - "Zrobiłem zakupy lokalne zamiast w supermarkecie" (+15 pkt)
- Potwierdzenie: zdjęcie (opcjonalnie) lub checkbox
- Limit: max 3 deklaracje dziennie (anty-spam)

#### D. System punktowy — Eco-Coins
- **Wzór**: 1 000 kroków = 5 Eco-Coins (max 40 dziennie z kroków)
- **Eko-deklaracje**: 10–30 Eco-Coins za deklarację (max 60 dziennie)
- **Streak bonus**: +20% jeśli 7 dni z rzędu, +50% jeśli 30 dni
- Dzienne maximum: ~100 Eco-Coins
- Saldo widoczne na głównym ekranie + historia transakcji

#### E. Rynek nagród
- Lista nagród w Eco-Coins (karty podarunkowe, zniżki):
  - Kawa w sieciówce: 200 EC
  - Zniżka 20% w sklepie eko: 500 EC
  - Voucher do księgarni: 1 000 EC
  - Dzień wolny od pracy (finansowany przez Hestię): 5 000 EC
- Po wymianie: kod QR lub kod alfanumeryczny do wykorzystania
- Admin HR dodaje/usuwa nagrody z panelu

#### F. Panel HR (web)
- Dashboard: liczba aktywnych użytkowników, średnia kroków/dzień, Eco-Coins w obiegu
- Lista pracowników: imię, status (aktywny/nieaktywny), ostatnia aktywność
- Zarządzanie nagrodami: dodawanie, edycja, budżet
- Raport CSV do pobrania (zaangażowanie tygodniowe, trendy)
- Ustawienia programu: nazwa firmy, grafika, cele domyślne

### Faza 2 — Gamifikacja (tydzień 7–10)

#### G. Wyzwania (questy)
- Wyzwania cykliczne: "Tydzień bez samochodu", "Weekend eko-rodzinny"
- Wyzwania firmowe: "Który dział zrobi najwięcej kroków w tym miesiącu?"
- Widok leaderboard: ranking indywidualny i drużynowy (tylko w obrębie firmy)
- Nagrody specjalne za wyzwania (dodatkowe EC lub bonusy)

#### H. Powiadomienia push
- "Zostało Ci 2 000 kroków do dziennego celu!"
- "Gratulacje! 7-dniowa passa — dostałeś bonus +20%"
- "Nowe wyzwanie: Tydzień bez plastiku — zdobądź 2x Eco-Coins"
- "Twój znajomy z pracy właśnie zasadził drzewo — dołącz do niego!"
- Konfigurowalne przez użytkownika (godziny ciszy nocnej)

---

## 3. Ekrany aplikacji (wireframe opisowy)

### Główny ekran (Dashboard)
```
┌──────────────────────────┐
│ [Avatar]  Dzień dobry,   │
│           Kasiu!         │
│  ┌────────────────────┐  │
│  │ 6 200 / 8 000 kroków│  │
│  │ ████████░░░░░░░░ 78%│  │
│  │ 31 Eco-Coins dzisiaj │  │
│  └────────────────────┘  │
│                          │
│  [🏆] Twoja passa: 5 dni │
│                          │
│  ┌────────────────────┐  │
│  │ Eko-deklaracje (2/3)│  │
│  │ ☐ Nie kupiłam       │  │
│  │   plastiku    +10   │  │
│  │ ☐ Rower zamiast     │  │
│  │   auta       +20   │  │
│  │ ☐ (...)             │  │
│  └────────────────────┘  │
│                          │
│  [SALDO: 450 Eco-Coins]  │
│  [➡ Rynek nagród]        │
└──────────────────────────┘
```

### Rynek nagród
```
┌──────────────────────────┐
│  Rynek nagród            │
│  Saldo: 450 EC           │
│                          │
│  ┌────────────────────┐  │
│  │ ☕ Kawa w sieciówce │  │
│  │ 200 EC          [→] │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ 🌿 Zniżka 20% eko   │  │
│  │ 500 EC          [→] │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ 📚 Voucher księgarnia│  │
│  │ 1 000 EC       [→] │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ 🏖 Dzień wolny      │  │
│  │ 5 000 EC       [→] │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

### Leaderboard (Faza 2)
```
┌──────────────────────────┐
│  Ranking — Twoja firma   │
│                          │
│  🥇 Anna K.   12 450 EC │
│  🥈 Piotr W.  11 200 EC │
│  🥉 Ty        10 800 EC │
│  4.  Marta L.  9 900 EC │
│  5.  Jan M.    9 100 EC │
│                          │
│  [🏢 Działy] [👤 Osoby]  │
└──────────────────────────┘
```

---

## 4. Panel HR (web) — widoki

### Dashboard
- Karta: "Aktywni użytkownicy" — liczba i %
- Karta: "Średnia kroków/firma" — wykres liniowy (7 dni / 30 dni)
- Karta: "Eco-Coins w obiegu" — łączna pula
- Karta: "Najbardziej aktywni" — top 5
- Przycisk: "Eksportuj raport CSV"

### Zarządzanie nagrodami
- Lista nagród (dodaj/edytuj/dezaktywuj)
- Budżet: limit miesięczny w EC
- Historia wymian: kto, co, kiedy

### Ustawienia
- Nazwa firmy, logo, kolorystyka
- Cele domyślne (kroki, deklaracje)
- Lista kodów invite (generuj/drukuj)
- Zarządzanie adminami HR

---

## 5. Wymagania techniczne

### Aplikacja mobilna
- **Platformy**: iOS 15+ i Android 12+ (native lub React Native)
- **Rekomendacja**: React Native (tańszy dev, jedno codebase)
- **Integracje**:
  - HealthKit (iOS) — odczyt kroków
  - Google Fit (Android) — odczyt kroków
  - Firebase Cloud Messaging — push notifications

### Panel web
- **Stack**: React + Tailwind (lub Next.js)
- **API**: REST lub GraphQL
- **Auth**: JWT + role-based access

### Backend
- **Stack**: Node.js (NestJS) lub Python (FastAPI)
- **DB**: PostgreSQL (użytkownicy, punkty, transakcje)
- **Cache**: Redis (szybki odczyt streaków, dziennych limitów)
- **Hosting**: AWS / DigitalOcean / Vercel + Railway

### Compliance
- RODO — zgoda na przetwarzanie przy rejestracji
- Dane zdrowotne: tylko kroki (nie choroby, nie leki)
- Prawo do bycia zapomnianym — usunięcie konta = usunięcie wszystkich danych
- Polityka prywatności + regulamin aplikacji (do przygotowania z prawnikiem)

---

## 6. Scope MVP — tabela priorytetów

| Feature | Priorytet | Szacunek (dni) |
|---|---|---|
| Rejestracja + onboarding | P0 | 5 |
| Licznik kroków (HealthKit/GFit) | P0 | 8 |
| Eco-deklaracje (checkbox) | P0 | 4 |
| System punktowy Eco-Coins | P0 | 6 |
| Rynek nagród (wymiana) | P0 | 6 |
| Panel HR dashboard | P0 | 8 |
| Panel HR — zarządzanie nagrodami | P0 | 4 |
| Raport CSV | P1 | 2 |
| Logowanie SSO | P1 | 3 |
| Powiadomienia push | P1 | 4 |
| Leaderboard | P2 | 4 |
| Wyzwania (questy) | P2 | 6 |
| Drużyny i ranking działów | P2 | 5 |
| **Razem P0** | | **41 dni** |
| **Z P1** | | **50 dni** |
| **Z P2** | | **65 dni** |

---

## 7. User Stories — kluczowe (format: As a… I want… So that…)

### Pracownik
1. Jako pracownik chcę zalogować się kodem invite, aby dołączyć do programu mojej firmy.
2. Jako pracownik chcę widzieć dzienny postęp kroków, aby wiedzieć czy osiągam cel.
3. Jako pracownik chcę deklarować eko-działania, aby zdobyć dodatkowe punkty.
4. Jako pracownik chcę wymieniać Eco-Coins na nagrody, aby czuć realną korzyść.
5. Jako pracownik chcę widzieć swoją passę (streak), aby utrzymywać regularność.
6. Jako pracownik chcę otrzymywać powiadomienia push, aby nie zapominać o celach.

### HR Admin
7. Jako HR admin chcę widzieć dashboard zaangażowania, aby raportować wpływ programu.
8. Jako HR admin chcę zarządzać nagrodami, aby kontrolować budżet.
9. Jako HR admin chcę eksportować dane do CSV, aby przygotować raport ESG.

### Super Admin (Eco-Pulse)
10. Jako super admin chcę dodawać nowych partnerów (firmy), aby skalować platformę.
11. Jako super admin chcę widzieć statystyki międzyfirmowe, aby mierzyć sukces platformy.

---

## 8. Definicja Done (DoD)

- Kod na GitHubie (branch `main` + PR)
- Testy: unit + integration (minimum 70% coverage)
- Działa na iOS 15+ i Android 12+
- Panel HR dostępny w Chrome/Firefox/Edge (2 ostatnie wersje)
- Brak krytycznych błędów (crash, utrata danych)
- RODO: zgoda i polityka prywatności podpięte
- Dokumentacja API (README lub Swagger)
- Deployment: staging (dev) + production

---

## 9. Następny krok

Zatwierdź scope MVP, a rozpiszę **Technical Spec** (model bazy danych, endpointy API, architektura) albo **Design Spec** (UI/UX w Figmie).
