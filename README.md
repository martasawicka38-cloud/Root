# Root - uruchomienie projektu

## 1. Wymagania

- Node.js 20+ (zalecane)
- npm 10+
- Docker + Docker Compose
- Expo Go na telefonie (iPhone/Android) albo emulator/symulator

## 2. Pierwszy setup (jednorazowo)

Wykonaj w katalogu projektu:

1. Zainstaluj zaleznosci frontendu:
   npm install
2. Zainstaluj zaleznosci backendu:
   npm --prefix server install
3. Skopiuj pliki env:
   - .env.example -> .env
   - server/.env.example -> server/.env

Domyslne wartosci:

- .env:
  EXPO_PUBLIC_API_URL=http://localhost:3001/api
- server/.env:
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/root_app?schema=public"
  PORT=3001

## 3. Start bazy i Prisma

1. Uruchom PostgreSQL:
   cd server
   docker compose up -d
   cd ..

2. Wygeneruj klienta Prisma:
   npm run server:prisma:generate

3. Wykonaj migracje:
   npm run server:prisma:migrate

4. Zasil baze danymi testowymi:
   npm run server:prisma:seed

## 4. Uruchomienie projektu lokalnie

Uruchom 2 terminale.

Terminal A (backend):

- npm run server:dev

Terminal B (frontend Expo):

- npx expo start --clear

Po starcie Expo zobaczysz:

- Metro URL (exp://...)
- QR code do Expo Go
- Web URL (http://localhost:8081)

## 5. iPhone (Expo Go)

1. iPhone i komputer musza byc w tej samej sieci Wi-Fi.
2. Uruchom backend: npm run server:dev
3. Ustaw API na adres LAN komputera w pliku .env, np.:
   EXPO_PUBLIC_API_URL=http://192.168.1.50:3001/api
4. Zrestartuj Expo z czyszczeniem cache:
   npx expo start --clear
5. Otworz Expo Go na iPhone i zeskanuj QR.

Uwagi:

- localhost na telefonie oznacza telefon, nie komputer.
- Jesli API nie odpowiada, sprawdz firewall i czy backend nasluchuje na porcie 3001.

## 6. Android (Expo Go)

1. Android i komputer musza byc w tej samej sieci Wi-Fi.
2. Uruchom backend: npm run server:dev
3. Ustaw API na adres LAN komputera w .env, np.:
   EXPO_PUBLIC_API_URL=http://192.168.1.50:3001/api
4. Uruchom Expo:
   npx expo start --clear
5. Otworz Expo Go na Androidzie i zeskanuj QR.

Alternatywnie emulator Android:

- uruchom emulator
- odpal: npm run android

## 7. iOS Simulator (macOS)

Jesli pracujesz na macOS z Xcode:

- npm run ios

## 8. Build/check kompilacji

Frontend TypeScript:

- npx tsc --noEmit

Backend build:

- npm run server:build

## 9. Najczestsze problemy

1. Brak polaczenia z API na telefonie

- Uzyj adresu LAN w EXPO_PUBLIC_API_URL (nie localhost)
- Sprawdz, czy backend dziala: http://localhost:3001/api

2. Problem z cache Expo

- npx expo start --clear
- zamknij i otworz projekt ponownie w Expo Go

3. Bledy Prisma

- Upewnij sie, ze docker compose up -d jest uruchomione
- Powtorz: generate -> migrate -> seed

Widoki:

Login | register_employer | register_user | register_company | onboarding | home | market | ranking | profile | superadmin | companyAdminPanel

Problem firmy:

1. Firma potrzebuje poświęcic czas na wygenerowanie materiałów marketingowych budujących dobry employer branding
   Rozwiązanie: generowanie postów na linkedina + certyfikatów w pdf

The best value: Vouchery za aktywność

- zintegrować dane z garmina - stravy
- workday - aplikacja HR'owas

2. Bayer nie zaproponuje wartości jako swojego produktu bo produkuje leki - ale potrzebuje ubezpeiczenia
3. Dać na prezkę w pipeline agenta

- flow,
- podział ról,
- korporacyjne zadanie

- zastanowić sie, czy nie wywalić zwykłego usera

```me

```
