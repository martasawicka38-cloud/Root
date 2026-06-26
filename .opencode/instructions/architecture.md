# App Architecture Instructions

## Zakres

Stosuj te instrukcje, gdy decyzja dotyczy struktury projektu Expo, podziału odpowiedzialności między frontendem i backendem NestJS oraz reguł separacji platform (mobile vs web admin).

## Kontekst hackathonowy

- Projekt powstaje pod silną presją czasu (40h).
- Priorytet: szybkość dostarczania, modularność, ponowne użycie kodu i prosty onboarding.
- Backend (`NestJS`) jest budowany oddzielnie albo już istnieje.
- Frontend i panel admina działają w jednym projekcie Expo.

## Kanoniczna struktura frontendu

Trzymaj architekturę feature-first pod `src/` i traktuj `src/app/` jako warstwę nawigacji Expo Router.

```text
my-app/
	src/
		app/
			(mobile)/
				_layout.tsx
				index.tsx
			admin/
				_layout.tsx
				index.tsx
			_layout.tsx
		components/
		features/
			auth/
			admin/
			mobile/
		lib/
			api.ts
		store/
		types/
```

## Podział odpowiedzialności

- `src/app/`: wyłącznie routing i layouty Expo Router, bez logiki biznesowej.
- `src/features/`: logika domenowa i widoki złożone per obszar produktu.
- `src/components/`: współdzielone, proste komponenty UI.
- `src/lib/api.ts`: jedna skonfigurowana instancja Axios do API NestJS.
- `src/store/`: globalny stan UI i lekki stan klienta (Zustand).
- `src/types/`: typy dopasowane do DTO backendu.

## Krytyczne reguły platformowe

- Trasy `admin/*` działają wyłącznie na webie (`Platform.OS === "web"`).
- Jeśli `admin/*` jest otwarte na iOS/Android, pokaż ekran informacyjny albo natychmiastowe przekierowanie do części mobilnej.
- Trasy `(mobile)/*` działają na iOS, Android i web.
- Dla `(mobile)/*` na webie wymuś kontener symulujący ekran telefonu z limitem szerokości:

```ts
{ maxWidth: 480, margin: "auto", height: "100vh", overflow: "hidden", backgroundColor: "#fff" }
```

- Warunkowe renderowanie i style platformowe rób wyłącznie przez `Platform` z `react-native`.

## Integracja z backendem

- Frontend nie importuje runtime kodu backendu bezpośrednio.
- Komunikacja wyłącznie przez HTTP (REST lub GraphQL) do backendu NestJS.
- Dane pobieraj przez Axios + TanStack Query.

## Domyślna kolejność prac

1. Potwierdź kontrakt wymagań i zakres funkcji.
2. Skonfiguruj bazowy routing Expo Router (`src/app/_layout.tsx`, grupy `(mobile)` i `admin`).
3. Dodaj warstwę API (`src/lib/api.ts`) i provider React Query.
4. Zaimplementuj separację platform (`admin` web-only, `mobile` constrained na webie).
5. Buduj feature-first w `src/features/*`.

## Anti-patterny

- Nie umieszczaj logiki biznesowej w `src/app/*`.
- Nie buduj osobnej aplikacji web admin jako drugi frontend, jeśli scope mieści się w Expo for Web.
- Nie mieszaj komponentów admin i mobile bez jawnych guardów platformowych.
