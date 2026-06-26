# Plan wdrożenia migracji do Expo (ready-to-build)

Data: 2026-06-27
Status: Build-ready
Cel: w kolejnym kroku rozpocząć implementację migracji 1:1 z obecnego prototypu do Expo Universal App bez ponownego discovery.

## 1. Zakres migracji (co przenosimy 1:1)

Migracja obejmuje pełną funkcjonalność prototypu z plików:

- prototyp.html
- script.js
- style.css

Zakres ekranów:

- Auth (login/register)
- Password reset modal
- Onboarding (3 kroki + zgody)
- Home/Dashboard
- Activity log
- Eko-deklaracje + modal potwierdzenia
- Rynek nagród
- Szczegóły nagrody + redeem + kod QR/fallback
- Ranking (team/individual)
- Profil
- Historia transakcji
- Challenge detail
- Powiadomienia
- Edycja profilu
- Osiągnięcia
- Ustawienia

## 2. Docelowy stack i komendy startowe (wymagane)

1. npx create-expo-app@latest my-app
2. npx expo install react-dom react-native-web @expo/metro-runtime
3. npm install axios @tanstack/react-query zustand

Założenie architektoniczne:

- Expo Managed Workflow + Expo Router
- src/app tylko routing/layout
- Logika domenowa w src/features
- Integracje API w src/lib/api
- Admin web-only (Platform.OS === "web")
- Mobile screens na web zamknięte w kontenerze max 480px

## 3. Struktura docelowa katalogów

src/

- app/
  - \_layout.tsx
  - (mobile)/
    - \_layout.tsx
    - home.tsx
    - activity.tsx
    - declarations.tsx
    - market.tsx
    - reward.tsx
    - ranking.tsx
    - profile.tsx
    - history.tsx
    - challenge.tsx
    - notifications.tsx
    - edit-profile.tsx
    - achievements.tsx
    - settings.tsx
  - (auth)/
    - login.tsx
    - register.tsx
    - onboarding.tsx
  - admin/
    - index.tsx
- features/
  - auth/
  - onboarding/
  - activity/
  - declarations/
  - market/
  - ranking/
  - profile/
  - history/
  - notifications/
  - achievements/
  - settings/
  - challenge/
  - wallet/
- shared/
  - ui/
  - layout/
  - hooks/
- lib/
  - api/
  - storage/
  - constants/
  - utils/
- store/
- i18n/
  - messages/
    - pl.json
    - en.json
- styles/
  - tokens.ts
  - theme.ts

## 4. Mapa ekranów: prototyp -> Expo Router

- auth -> /login, /register
- onboarding -> /onboarding
- screen-home -> /(mobile)/home
- screen-activity -> /(mobile)/activity
- screen-declarations -> /(mobile)/declarations
- screen-market -> /(mobile)/market
- screen-reward -> /(mobile)/reward
- screen-rank -> /(mobile)/ranking
- screen-profile -> /(mobile)/profile
- screen-history -> /(mobile)/history
- screen-challenge -> /(mobile)/challenge
- screen-notifications -> /(mobile)/notifications
- screen-edit -> /(mobile)/edit-profile
- screen-achievements -> /(mobile)/achievements
- screen-settings -> /(mobile)/settings

## 5. Mapa logiki: script.js -> moduły feature

Auth/Onboarding:

- switchAuth, authLogin, authRegister -> features/auth
- renderOnboarding, nextOb, finishOnboarding -> features/onboarding
- openResetPw, closeResetPw, sendResetLink -> features/auth/resetPassword

Navigation/UI shell:

- navigate, moveTabIndicator -> app layouts + shared tab navigation

Eko-deklaracje:

- loadDeclareCount, saveDeclareCount, renderDeclarations -> features/declarations/state
- openModal, togglePhoto, confirmDecl, closeModal -> features/declarations/ui

Rynek i nagrody:

- filterMarket -> features/market/list
- openReward, redeemReward, hideDetail, generateFallbackQR -> features/market/reward

Saldo i transakcje:

- updateBalanceDisplay, deductBalance, earnBalance -> features/wallet
- addToTxHistory, renderTx, filterHistory -> features/history

Aktywność:

- selectActivity, toggleApp, toggleManual, toggleActPhoto
- calcEstimate, logActivity, renderActivityLog
- editActivity, saveEditActivity, cancelEditActivity, deleteActivity
- updateDashboardSteps
  => features/activity

Powiadomienia:

- openNotifications, renderNotifications, markNotifRead, clearAllNotifs
  => features/notifications

Profil/Ustawienia/Osiągnięcia:

- switchPartner, cycleAvatar, saveProfile -> features/profile
- openSettings, logoutApp -> features/settings
- openAchievements, renderAchievements, getAchStatus -> features/achievements

Challenge/Ranking:

- openChallenge, switchRankTab -> features/challenge + features/ranking

## 6. Model stanu (Zustand)

Utworzyć jeden root store z slice-ami:

- authSlice
- onboardingSlice
- partnerSlice
- walletSlice
- declarationsSlice
- activitySlice
- marketSlice
- historySlice
- notificationsSlice
- achievementsSlice
- profileSlice
- settingsSlice
- challengeSlice
- rankingSlice

Persistencja (local storage adapter):

- balance
- txHistory
- declareData
- partner
- actLog
- achievements

Wymaganie: usunąć niespójność kluczy balance/userBalance i zostawić tylko balance.

## 7. Warstwa API (przygotowanie pod NestJS)

Na etapie migracji UI można trzymać dane mock, ale kontrakty API mają być przygotowane od razu:

- GET /api/me
- GET /api/wallet
- GET /api/history
- GET /api/market
- POST /api/market/redeem
- GET /api/activity
- POST /api/activity
- PATCH /api/activity/:id
- DELETE /api/activity/:id
- GET /api/declarations
- POST /api/declarations
- GET /api/notifications
- PATCH /api/notifications/:id/read
- POST /api/notifications/read-all
- GET /api/achievements
- GET /api/ranking
- GET /api/challenge/current
- PATCH /api/profile
- PATCH /api/settings

## 8. Plan implementacji (kolejność prac)

Faza 1: bootstrap i routing

- Scaffold Expo
- Dodać dependency
- Utworzyć route groups (auth/mobile/admin)
- Dodać web mobile container
- Dodać guard web-only dla admin

Faza 2: design system i shell

- tokens.ts + theme.ts
- Podstawowe komponenty UI (Button, Card, Badge, Input, Toggle, Modal)
- Bottom tab shell dla mobile

Faza 3: stan i dane

- Root store + slices
- Adapter persistencji
- Seed danych startowych 1:1 z prototypu

Faza 4: ekrany krytyczne

- login/register
- onboarding
- home
- activity
- declarations

Faza 5: moduły marketplace i wallet

- market
- reward detail + redeem + QR fallback
- history

Faza 6: social i account

- ranking
- challenge
- notifications
- profile/edit
- achievements
- settings/logout

Faza 7: hardening

- Ujednolicenie i18n (pl/en)
- Testy smoke web + mobile
- Refactor duplikatów logiki
- Przygotowanie integracji z NestJS

## 9. Kryteria akceptacji (Definition of Done)

Funkcjonalne:

- Wszystkie ekrany z prototypu dostępne i działające
- Flow end-to-end: login -> onboarding -> aktywność/deklaracje -> nagroda -> historia
- Limity i przeliczenia punktów zgodne z prototypem
- Powiadomienia, osiągnięcia, ranking i ustawienia działają

Techniczne:

- Brak inline styli i inline logiki na ekranach
- Brak duplikatów funkcji (szczególnie notifications)
- Jeden spójny klucz salda (balance)
- Feature-first struktura zachowana
- Admin route zablokowany poza web
- Mobile container na web działa i nie powoduje overflow

Jakościowe:

- Brak regresji wizualnej krytycznych ekranów
- Dane persistują między restartami aplikacji
- Brak crashy przy pustych listach i trybie offline

## 10. Ryzyka i zabezpieczenia

Ryzyko 1: Rozjazd logiki punktów między activity/declarations/redeem.

- Zabezpieczenie: centralny wallet service + testy jednostkowe dla kalkulacji.

Ryzyko 2: Niespójność stanu po edycji/usuwaniu aktywności.

- Zabezpieczenie: single source of truth w store, bez lokalnych kopii stanu.

Ryzyko 3: Rozjazd web vs mobile layout.

- Zabezpieczenie: wspólny layout wrapper + snapshoty UI dla szerokości mobilnej.

Ryzyko 4: Duplikacja logiki z legacy script.js.

- Zabezpieczenie: jedna funkcja domenowa na odpowiedzialność, rozdział przez feature modules.

## 11. Checklista startowa do kolejnego kroku (implementacja)

- [ ] Utworzyć nową gałąź migracji.
- [ ] Wykonać 3 komendy stacku (Expo + web runtime + axios/query/zustand).
- [ ] Postawić strukturę src/app, src/features, src/lib, src/store, src/i18n.
- [ ] Zaimplementować root layout + route groups.
- [ ] Dodać store z persistencją i seed danych.
- [ ] Dostarczyć pierwszy pionowy slice: login -> onboarding -> home -> activity.

## 12. Minimalny pionowy slice (pierwszy commit migracyjny)

Zakres pierwszego commita:

- auth (login/register)
- onboarding
- home
- activity
- wallet state + tx history append

Warunek zaliczenia:

- użytkownik loguje się, przechodzi onboarding, dodaje aktywność, saldo rośnie, wpis pojawia się w historii.

---

Ten dokument jest przygotowany jako wykonawczy build brief. Następny krok to bezpośrednia implementacja zgodnie z kolejnością z sekcji 8 i checklistą z sekcji 11.
