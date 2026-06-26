---
description: Scaffolduje frontend Expo Universal App na podstawie src/spec/, generując routing Expo Router, warstwę API, i18n oraz bazową strukturę feature-first.
agent: build
---

Argument użytkownika: $ARGUMENTS

# Scaffolduj frontend Expo ze specyfikacji

Twoim zadaniem jest wygenerowanie pełnego szkieletu frontendu Expo na podstawie plików `src/spec/`. Nie wymyślasz — czytasz spec i przekładasz 1:1 na pliki.

## Krok 1 — Przeczytaj całą specyfikację

Przeczytaj następujące pliki (jeśli istnieją):

- `@src/spec/pages.md`
- `@src/spec/sections.md`
- `@src/spec/design-tokens.md`
- `@src/spec/i18n.md`
- `@src/spec/routing.md`
- `@src/spec/components.md`

Jeśli któryś nie istnieje, pomiń go i kontynuuj z tym co masz. Jeśli żaden nie istnieje — zatrzymaj się i poinformuj użytkownika, że spec jest wymagany przed scaffoldem.

## Krok 2 — Sprawdź co już istnieje w src/

Przejrzyj aktualną strukturę `src/`, aby nie nadpisywać istniejących plików. Scaffolduj tylko brakujące pliki.

Zanim zaczniesz scaffold:

- potwierdź, że `src/app/` zawiera tylko pliki routingu Expo Router,
- nie umieszczaj logiki biznesowej poza `src/features/*`,
- nie deleguj rdzenia scaffoldingu do generycznych task-agentów.

## Krok 3 — Generuj routing Expo i warstwę API

Na podstawie `routing.md` i `pages.md`:

- przygotuj `src/app/_layout.tsx` jako główny provider (np. React Query),
- przygotuj `src/app/(mobile)/_layout.tsx` i `src/app/(mobile)/index.tsx`,
- przygotuj `src/app/admin/_layout.tsx` i `src/app/admin/index.tsx`.

Krytyczne:

- `src/app/admin/_layout.tsx` blokuje iOS/Android (`Platform.OS !== "web"`).
- `src/app/(mobile)/_layout.tsx` na webie zawęża viewport do mobilnego kontenera (`maxWidth: 480`, `height: 100vh`, `overflow: hidden`).
- utwórz `src/lib/api.ts` ze skonfigurowaną instancją Axios do backendu NestJS.

## Krok 4 — Generuj src/i18n/

Na podstawie `i18n.md`:

**`src/i18n/messages/pl.json`** — wszystkie klucze z i18n.md, wartości jako pusty string `""`. Zachowaj dokładną strukturę namespace'ów z spec.

**`src/i18n/messages/en.json`** — identyczna struktura kluczy, wartości `""`.

**`src/i18n/index.ts`** — konfiguracja `i18next` + `react-i18next` zgodnie z zatwierdzonym tech stackiem. Jeśli biblioteka nie jest zainstalowana i nie ma jej jeszcze w repo, zatrzymaj się i poproś użytkownika o zgodę przed doinstalowaniem.

## Krok 5 — Zbuduj i zwaliduj pierwszy ekran

Zanim wygenerujesz wszystkie feature'y:

1. Doprowadź `(mobile)` i `admin` layout do jakości docelowej.
2. Uruchom build albo typecheck.
3. Sprawdź separację platform (admin web-only, mobile web-constrained).
4. Jeśli walidacja nie przechodzi, napraw ten slice przed dalszym scaffoldem.

## Krok 6 — Generuj feature-first moduły

Na podstawie `sections.md`, `pages.md` i `components.md`:

1. Utwórz lub uzupełnij moduły w `src/features/auth`, `src/features/mobile`, `src/features/admin`.
2. Utwórz współdzielone komponenty UI w `src/components/`.
3. Utwórz store'y w `src/store/` tylko jeśli wynikają ze spec.
4. Nie umieszczaj logiki domenowej w `src/app/*`.

## Krok 7 — Raport

Po zakończeniu podaj:

```
## Wygenerowano

- src/app/ — [lista plików]
- src/features/ — [lista modułów]
- src/lib/ — [lista plików]
- src/i18n/ — [lista plików z liczbą kluczy]

## Pominięto (już istniało)

- [lista plików]

## Wymaga ręcznego uzupełnienia

- i18n — wszystkie wartości tłumaczeń
- feature'y — tylko dane, których nie było w spec albo REQUIREMENTS
```

## Zasady nadrzędne

- Nie wymyślaj danych spoza spec.
- Nie nadpisuj plików, które już istnieją.
- Instaluj nowe paczki tylko wtedy, gdy są realnie potrzebne przez nowe importy i grupuj je w jedną komendę na etap.
- Jeśli spec jest niekompletny, scaffolduj to co możesz i opisz co brakuje.
- Nie kończ pracy na placeholderach, TODO ani pustych sekcjach, jeśli spec i wymagania są kompletne.
- Nie zamykaj scaffoldingu bez przechodzącego builda albo typechecku.
- Jeśli środowisko opencode ma pluginy oparte wyłącznie na Node built-ins, nie utrzymuj lokalnego `.opencode/package.json` ani lockfile, bo generują niepotrzebny install churn.
