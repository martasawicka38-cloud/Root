# Expo Router Instructions

## Zakres

Stosuj te instrukcje dla routingu w Expo Router pod `src/app/`.

## Zasady nadrzędne

- `src/app/` zawiera wyłącznie pliki routingu i layouty.
- Nie umieszczaj logiki domenowej w plikach tras.
- Route groups (np. `(mobile)`) służą tylko organizacji i nie pojawiają się w URL.
- Globalne providery (np. QueryClientProvider) montuj w `src/app/_layout.tsx`.

## Obowiązkowa struktura

```text
src/app/
  _layout.tsx
  (mobile)/
    _layout.tsx
    index.tsx
  admin/
    _layout.tsx
    index.tsx
```

## Reguły platformowe tras

- `admin/*` musi działać tylko na webie.
- W `src/app/admin/_layout.tsx` dodaj guard platformy:
  - `Platform.OS === "web"`: render `Slot`.
  - pozostałe platformy: fallback lub redirect do mobile.
- W `src/app/(mobile)/_layout.tsx` na webie opakuj `Slot` kontenerem symulującym ekran telefonu (`maxWidth: 480`, `margin: auto`, `height: 100vh`, `overflow: hidden`, `backgroundColor: #fff`).

## Dane i mutacje

- Routing Expo Router nie zastępuje warstwy danych.
- Fetch i mutacje realizuj przez Axios + TanStack Query w feature hooks.
- Nie buduj fetchowania ekranów przez gołe `useEffect`, jeśli dany ekran może użyć query hooka.

## Edge cases

- Jeśli nowa trasa jest tylko dla admina, trzymaj ją pod `src/app/admin/`.
- Jeśli trasa ma działać dla usera mobilnego, umieszczaj ją pod `src/app/(mobile)/`.
