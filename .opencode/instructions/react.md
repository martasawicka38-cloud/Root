# React Native + Expo Instructions

## Zakres

Stosuj te instrukcje dla plików frontendowych Expo w `src/`.

## Stack i domyślne biblioteki

- Frontend budujemy w React Native przez Expo (Managed Workflow) + Expo Router.
- Dane: Axios + TanStack React Query.
- UI state: Zustand.
- Web: `react-native-web`.
- Nie dodawaj alternatywnych bibliotek stanu i fetchingu bez zgody użytkownika.

## Inicjalizacja i paczki bazowe

Gdy użytkownik prosi o start projektu lub bazowe zależności, użyj dokładnie:

1. `npx create-expo-app@latest my-app`
2. `npx expo install react-dom react-native-web @expo/metro-runtime`
3. `npm install axios @tanstack/react-query zustand`

## Zasady kodu

- Trzymaj komponenty małe i jednoodpowiedzialne.
- Logika biznesowa żyje w `src/features/*`, nie w plikach nawigacji Expo Router.
- `src/app/*` to tylko routing, layouty i providery.
- Nie duplikuj requestów do API w wielu ekranach; buduj hooki per feature.
- Używaj TanStack Query do pobierania i mutacji danych zamiast ręcznego fetchowania przez `useEffect`.

## Krytyczne reguły platformowe

- Dla panelu admina (`src/app/admin/*`) wymagaj `Platform.OS === "web"`.
- Na iOS/Android dla ścieżek admin renderuj fallback lub redirect do mobile.
- Dla mobile (`src/app/(mobile)/*`) na webie zawsze zawężaj viewport kontenerem:

```ts
{ maxWidth: 480, margin: "auto", height: "100vh", overflow: "hidden", backgroundColor: "#fff" }
```

- Warunkowe UI i style platformowe opieraj o `Platform` z `react-native`.

## Konwencja struktury

- `src/app/`: pliki Expo Router (`_layout.tsx`, ekrany tras).
- `src/components/`: proste komponenty współdzielone.
- `src/features/`: moduły domenowe (`auth`, `admin`, `mobile`).
- `src/lib/api.ts`: instancja Axios.
- `src/store/`: Zustand stores.
- `src/types/`: typy zgodne z DTO backendu.

## Edge cases

- Jeśli ekran ma działać na mobile i web, nie zakładaj identycznego layoutu; mobile ma pozostać czytelny i wąski na webie.
- Jeśli admin wymaga tabel lub sidebaru, utrzymuj je wyłącznie w gałęzi web-admin.
- Jeśli logika zaczyna mieszać role admin i user, rozdziel ją na osobne moduły feature.
