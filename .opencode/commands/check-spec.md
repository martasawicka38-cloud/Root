---
description: Podaje status warstwy frontendowej czytając tylko src/spec/ i sprawdzając istnienie plików implementacyjnych bez ładowania kodu źródłowego.
agent: planning
---

# Status frontendowej warstwy ze specyfikacji

Twoim zadaniem jest podanie zwięzłego statusu warstwy frontendowej na podstawie wyłącznie `src/spec/`. Zero plików source code.

## Krok 1 — Przeczytaj frontend spec (tylko spec)

Przeczytaj następujące pliki jeśli istnieją:

- `@src/spec/pages.md`
- `@src/spec/sections.md`
- `@src/spec/design-tokens.md`
- `@src/spec/i18n.md`
- `@src/spec/routing.md`
- `@src/spec/components.md`

Nie czytaj żadnych plików poza `src/spec/`.

## Krok 2 — Sprawdź które pliki implementacyjne istnieją

Użyj narzędzia do listowania plików (nie czytaj ich zawartości) aby sprawdzić:

- Czy istnieje `src/app/_layout.tsx`?
- Czy istnieje `src/app/(mobile)/_layout.tsx`?
- Czy istnieje `src/app/admin/_layout.tsx`?
- Czy istnieje `src/lib/api.ts`?
- Czy istnieje `src/i18n/messages/pl.json`?
- Czy istnieją pliki sekcji z `sections.md` (tylko sprawdź istnienie, nie czytaj)?
- Czy istnieją pliki stron z `pages.md`?

## Krok 3 — Podaj raport statusu

Zwróć raport w tym formacie:

```
## Status projektu — [data]

### Strony ([N] zaspecyfikowanych)
- ✅ HomePage — [liczba sekcji] sekcji
- ⏳ ContactPage — spec gotowy, brak pliku src/features/mobile/
- ❌ brak spec dla [X]

### Sekcje ([N zaspec] / [N zaimplementowanych])
- ✅ NavbarSection — plik istnieje
- ⏳ HeroSection — spec gotowy, brak pliku
- ⏳ AboutSection — spec gotowy, brak pliku

### Routing
- [N] tras w spec
- app/_layout.tsx: ✅/❌
- app/(mobile)/_layout.tsx: ✅/❌
- app/admin/_layout.tsx: ✅/❌

### Platform Guards
- admin web-only guard: ✅/❌
- mobile web-constrained container: ✅/❌

### i18n
- pl.json: ✅/❌
- en.json: ✅/❌
- Oczekiwane klucze: [N] (z i18n.md)

### Komponenty shared/ui (z components.md)
- [lista z ✅/⏳/❌]

---
### Następne kroki (priorytet)
1. [co należy zrobić jako pierwsze]
2. [co dalej]
```

## Zasady

- Zero odczytów z `src/` poza listowaniem istnienia plików.
- Jeśli spec nie istnieje w ogóle — powiedz to wprost i zatrzymaj się.
- Jeśli spec jest niekompletny — wskaż brakujące sekcje spec przed podaniem statusu.
- Raport ma być krótki i skanowany wzrokiem, nie esej.
