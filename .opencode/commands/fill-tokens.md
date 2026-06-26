---
description: Wypełnia web/src/styles/tokens.css wartościami z sekcji Identyfikacja wizualna w REQUIREMENTS.md, ładując tylko REQUIREMENTS.md i tokens.css.
agent: build
---

Argument użytkownika: $ARGUMENTS

# Wypełnij tokens.css

Twoim zadaniem jest wypełnienie `web/src/styles/tokens.css` na podstawie sekcji `## Identyfikacja wizualna` z `REQUIREMENTS.md`. Ładujesz **tylko dwa pliki**.

## Krok 1 — Przeczytaj wejście

Przeczytaj wyłącznie:

1. `REQUIREMENTS.md` — sekcja `## Identyfikacja wizualna` (kolory, typografia, spacing, radius, shadow, logo)
2. `web/src/styles/tokens.css` — aktualny stan (jeśli istnieje)

Jeśli `tokens.css` nie istnieje, stwórz go od zera.

## Krok 2 — Zmapuj wymagania na tokeny

**Mapowanie kolorów:**

| Wymaganie                    | Token                                        |
| ---------------------------- | -------------------------------------------- |
| Primary                      | `--color-primary`                            |
| Primary light/subtle         | `--color-primary-subtle`                     |
| Secondary                    | `--color-secondary`                          |
| Neutral jasny (tło, surface) | `--color-neutral-100` + `--color-bg-surface` |
| Neutral ciemny (tekst)       | `--color-neutral-900`                        |
| Success                      | `--color-success`                            |
| Error                        | `--color-error`                              |
| Tło mocne (dark bg)          | `--color-bg-strong`                          |
| Tło brand (accent bg)        | `--color-bg-brand-subtle`                    |
| Overlay/scrim                | `--color-bg-scrim`                           |

**Mapowanie typografii:**

| Wymaganie                 | Token                      |
| ------------------------- | -------------------------- |
| Font nagłówków            | `--font-heading`           |
| Font treści               | `--font-body`              |
| Font UI (buttony, labele) | `--font-ui`                |
| Skala typograficzna       | `--text-xs` … `--text-3xl` |

**Mapowanie spacing/radius/shadow:**

Jeśli REQUIREMENTS.md podaje konkretne wartości — użyj ich bezpośrednio.
Jeśli nie podaje — użyj poniższych defaults:

```
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 16px

--shadow-sm: 0 1px 3px rgba(0,0,0,0.12)
--shadow-md: 0 4px 16px rgba(0,0,0,0.16)
```

## Krok 3 — Napisz tokens.css

Użyj dokładnie tej struktury — nie zmieniaj kolejności sekcji ani nazw tokenów:

```css
:root {
  /* Kolory */
  --color-primary: [wartość];
  --color-primary-subtle: [wartość];
  --color-secondary: [wartość];
  --color-neutral-100: [wartość];
  --color-neutral-900: [wartość];
  --color-success: [wartość];
  --color-error: [wartość];

  /* Tła — używane przez PageContainers */
  --color-bg-surface: [wartość];
  --color-bg-strong: [wartość];
  --color-bg-brand-subtle: [wartość];
  --color-bg-scrim: [wartość];

  /* Typografia */
  --font-heading: [wartość];
  --font-body: [wartość];
  --font-ui: [wartość];

  --text-xs: [wartość];
  --text-sm: [wartość];
  --text-md: [wartość];
  --text-lg: [wartość];
  --text-xl: [wartość];
  --text-2xl: [wartość];
  --text-3xl: [wartość];

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* Radius */
  --radius-sm: [wartość];
  --radius-md: [wartość];
  --radius-lg: [wartość];

  /* Shadow */
  --shadow-sm: [wartość];
  --shadow-md: [wartość];
}
```

Jeśli wartość nie jest dostępna w REQUIREMENTS.md, zostaw pusty string po `: ` i dodaj komentarz `/* TODO */`.

## Krok 4 — Sprawdź spójność z PageContainers

PageContainers używa konkretnych tokenów tła. Upewnij się, że te tokeny mają wartości:

- `--color-bg-surface` — używany przez `backgroundColor="surface"`
- `--color-bg-strong` — używany przez `backgroundColor="strong"`
- `--color-bg-brand-subtle` — używany przez `backgroundColor="brandSubtle"`
- `--color-bg-scrim` — używany przez `backgroundColor="scrim"`

Jeśli REQUIREMENTS.md nie podaje ich wprost, wydedukuj je z koloru primary i neutral.

## Krok 5 — Raport

```
## Wypełniono

- [liczba] tokenów z wartościami

## Wymaga uzupełnienia

- [lista tokenów z TODO]

## Uwagi

- [np. "--font-heading: nie podano, użyto system-ui jako placeholder"]
```

## Zasady nadrzędne

- Ładujesz **tylko** `REQUIREMENTS.md` i `tokens.css`.
- Nie modyfikujesz żadnego innego pliku.
- Nie wymyślasz wartości — jeśli czegoś nie ma w REQUIREMENTS.md, zostaw TODO.
- Nie zmieniaj nazw tokenów — spójność z PageContainers jest wymagana.
