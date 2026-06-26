---
description: Aktualizuje AGENTS.md i pliki instrukcji opencode na podstawie git diff i opisu zmian od użytkownika.
agent: build
---

Argument użytkownika: $ARGUMENTS

# Aktualizuj mózg Copilota

Twoim zadaniem jest przeanalizowanie ostatnich zmian w projekcie i zaktualizowanie plików konfiguracyjnych agenta, tak aby odzwierciedlały aktualny stan architektury, wzorców i konwencji projektu.

## Krok 1 — Zbierz kontekst z gita

Uruchom poniższe komendy i zapamiętaj wyniki:

```
git diff HEAD~1 HEAD --stat
git diff HEAD~1 HEAD
git log --oneline -10
git status
```

Jeśli użytkownik podał zakres diffów (np. branch lub hash), użyj go zamiast `HEAD~1 HEAD`.

## Krok 2 — Przeczytaj aktualny stan mózgu

Przeczytaj w całości następujące pliki:

- `@AGENTS.md` — główny system prompt projektu
- `@.opencode/instructions/architecture.md`
- `@.opencode/instructions/react.md`
- `@.opencode/instructions/router-data.md`
- `@.opencode/instructions/design-system.md`
- `@.opencode/instructions/i18n.md`
- `@.opencode/instructions/typescript.md`
- `@.opencode/instructions/backend.md`
- `@.opencode/instructions/devops.md`

## Krok 3 — Przeanalizuj diff pod kątem zmian architektonicznych

Na podstawie diffs i opisu użytkownika zidentyfikuj:

1. **Nowe wzorce lub komponenty** — czy pojawił się nowy sposób rozwiązywania problemów, który powinien stać się regułą?
2. **Zmiany w strukturze katalogów** — czy zmienił się układ folderów lub naming conventions?
3. **Zmiany w stacku** — nowe paczki, usunięte zależności, zmiana wersji?
4. **Zmiany w designie/UI** — nowe tokeny, nowe komponenty PageContainers, nowe wzorce stylowania?
5. **Zmiany w routingu** — nowe strony, zmiana struktury tras, nowe loadery lub akcje?
6. **Zmiany w i18n** — nowe namespace'y, zmiana struktury kluczy, zmiana biblioteki?
7. **Zmiany w deploymencie** — Dockerfile, Nginx, CI/CD?

## Krok 4 — Zdecyduj które pliki wymagają aktualizacji

Mapowanie: co zmienić → gdzie:

| Co się zmieniło                            | Plik do aktualizacji                      |
| ------------------------------------------ | ----------------------------------------- |
| Ogólna architektura, priorytety, workflow  | `AGENTS.md`                               |
| Struktura monorepo, boundaries, build map  | `.opencode/instructions/architecture.md`  |
| Wzorce React, hooki, komponenty, React 19+ | `.opencode/instructions/react.md`         |
| Routing, loadery, akcje, RootLayout        | `.opencode/instructions/router-data.md`   |
| Tokeny, CSS, PageContainers, design system | `.opencode/instructions/design-system.md` |
| Struktura JSON, namespace'y, hooki i18n    | `.opencode/instructions/i18n.md`          |
| Typy TypeScript, kontrakty, generyki       | `.opencode/instructions/typescript.md`    |
| DTO, Prisma, auth, AI orchestration        | `.opencode/instructions/backend.md`       |
| Dockerfile, Nginx, GitHub Actions          | `.opencode/instructions/devops.md`        |

## Krok 5 — Zaktualizuj pliki

Dla każdego pliku wymagającego aktualizacji:

1. Wprowadź minimalne, precyzyjne zmiany — **nie przepisuj** tego, co jest poprawne.
2. Dodaj nowe reguły jako konkretne punkty lub przykłady kodu.
3. Usuń lub zaktualizuj reguły, które są sprzeczne z nowym stanem projektu.
4. Zachowaj istniejącą strukturę sekcji — nie zmieniaj nagłówków bez powodu.
5. Jeśli dodajesz przykład kodu, użyj rzeczywistych nazw z projektu (nie `MyComponent`).

## Krok 6 — Raport zmian

Po zakończeniu podaj zwięzły raport:

```
## Zaktualizowano

- [nazwa pliku] — co zmieniono i dlaczego
- [nazwa pliku] — co zmieniono i dlaczego

## Nie zmieniono

- [nazwa pliku] — dlaczego nie wymagał zmian

## Uwagi

- Jeśli coś w diffie jest niejasne lub wymaga decyzji architektonicznej — wskaż to tutaj.
```

## Zasady nadrzędne

- **Nie nadpisuj** reguł, które nadal obowiązują.
- **Nie dodawaj** reguł dla jednorazowych przypadków — tylko wzorce, które będą się powtarzać.
- **Nie zgaduj** intencji diffs — jeśli coś jest niejasne, zapytaj użytkownika przed aktualizacją.
- **Zachowaj** styl i język istniejących plików (polski, ultra-techniczny, bez lania wody).
- **REQUIREMENTS.md pozostaje executive summary projektu** — nie przenoś do instrukcji decyzji, które powinny być w wymaganiach projektu, ale nie nadpisuj też roli finalnych user stories jako kontraktu funkcjonalnego builda.
