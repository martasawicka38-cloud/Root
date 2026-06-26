---
description: Audytuje pojedynczą sekcję pod kątem błędów: hardcoded stringi, brakujące klucze i18n, zła hierarchia PageContainers, hardcoded kolory i spacing. Ładuje tylko jeden plik sekcji i jego wpis w spec.
agent: review
---

Argument użytkownika: $ARGUMENTS

# Audytuj sekcję

Twoim zadaniem jest audyt jednej konkretnej sekcji. Ładujesz **tylko trzy pliki** — nie skanujesz workspace.

## Krok 1 — Zlokalizuj i przeczytaj plik sekcji

Na podstawie argumentu użytkownika:

1. Jeśli podano nazwę (np. `HeroSection`) — znajdź plik przez wyszukiwanie `HeroSection.tsx` w `src/`.
2. Jeśli podano ścieżkę — przeczytaj bezpośrednio.

Przeczytaj **tylko ten jeden plik**.

## Krok 2 — Przeczytaj spec dla tej sekcji

Przeczytaj wyłącznie wpis dla tej sekcji z:

- `@web/src/spec/sections.md` — znajdź tylko wpis `## [NazwaSekcji]`
- `@web/src/spec/i18n.md` — znajdź tylko klucze dla tej sekcji

**Nie czytaj całych plików spec jeśli nie jest to konieczne.**

## Krok 3 — Wykonaj audyt

Sprawdź plik sekcji pod kątem poniższych problemów:

### A. Hardcoded stringi (krytyczne)

Szukaj literałów tekstowych widocznych dla użytkownika bezpośrednio w JSX:

- `<h1>Jakiś tekst</h1>` — powinno być `<h1>{t("hero.heading")}</h1>`
- Atrybuty `aria-label="tekst"`, `placeholder="tekst"`, `alt="tekst"` bez tłumaczenia
- `title="tekst"` bez tłumaczenia

### B. Brakujące klucze i18n

Porównaj klucze z `i18n.md` spec z kluczami użytymi w komponencie.

- Które klucze ze spec nie są używane w kodzie?
- Które klucze są używane ale nie ma ich w spec?

### C. Hierarchia PageContainers

Sprawdź czy używana hierarchia jest poprawna:

- `SectionContainer` jako root sekcji ✓/✗
- `ColumnSection` tylko dla wielokolumnowego layoutu ✓/✗
- `ContentSection` do grupowania treści ✓/✗
- `selector` zgodny z spec ✓/✗
- `backgroundColor` zgodny z spec ✓/✗

### D. Hardcoded wartości wizualne (ostrzeżenie)

Szukaj:

- Hardcoded kolorów: `#fff`, `rgb(...)`, nazw kolorów
- Hardcoded spacing: `style={{ padding: "16px" }}` zamiast CSS modułu z tokenem
- Hardcoded font-size, border-radius w inline style

### E. Niezgodność ze spec

- `selector` inny niż w spec?
- `backgroundColor` inny niż w spec?
- Layout inny niż w spec (np. spec mówi 2 kolumny, kod ma 1)?

## Krok 4 — Raport audytu

```
## Audyt: [NazwaSekcji]

### Krytyczne (blokują poprawność)
- ❌ [opis problemu] — linia [N]
- ❌ [opis problemu]

### Ostrzeżenia (powinny być naprawione)
- ⚠️ [opis problemu] — linia [N]

### Niezgodności ze spec
- ⚠️ selector: kod używa "[X]", spec wymaga "[Y]"
- ⚠️ brakujące klucze i18n: [lista]

### OK
- ✅ Hierarchia PageContainers poprawna
- ✅ Brak hardcoded stringów
- ✅ [co jest poprawne]

---
Czy naprawić znalezione problemy? [tak/nie]
```

## Krok 5 — Napraw (opcjonalnie)

Jeśli użytkownik potwierdzi — napraw wszystkie **krytyczne** problemy w pliku sekcji. Ostrzeżeń nie naprawiaj bez wyraźnej prośby.

## Zasady

- Ładujesz **maksymalnie 3 pliki**: plik sekcji + sections.md + i18n.md.
- Nie ładujesz tokens.css, router/, innych sekcji, package.json.
- Nie naprawiasz automatycznie — najpierw raport, potem pytanie.
- Jeśli spec nie istnieje, audytuj bez porównania ze spec i zaznacz to.
