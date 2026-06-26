---
description: Publiczne wejście do fazy build. Waliduje artefakty planowania i dopiero potem uruchamia właściwy workflow implementacyjny.
agent: build-orchestrator
subtask: true
---

Argument użytkownika: $ARGUMENTS

To jest publiczna komenda fazy build.

## Zasady

- Zawsze przeczytaj `@docs/product/00-governance/app-phase-workflow.md`.
- Zawsze przeczytaj `@docs/product/00-governance/requirements-contract.md`.
- Zawsze przeczytaj `@.opencode/prompts/build/build-app.md`.
- Najpierw zwaliduj, czy istnieją artefakty planowania wymagane przez build:
  - `REQUIREMENTS.md`
  - `docs/product/04-backlog/epics.md`
  - `docs/product/04-backlog/features.md`
  - przynajmniej jeden plik w `docs/product/04-backlog/user-stories/`
- Jeśli brakuje któregokolwiek z wymaganych artefaktów, zatrzymaj się. Nie omijaj `/plan-app` i nie syntetyzuj brakującego `REQUIREMENTS.md` w fazie build.
- Jeśli wszystkie artefakty istnieją, traktuj finalne user stories jako nadrzędne wejście funkcjonalne, a `REQUIREMENTS.md` jako syntetyczny brief projektu, który musi pozostać spójny z backlogiem.
- Jeśli user stories i `REQUIREMENTS.md` są sprzeczne, zatrzymaj się i skieruj temat do `/plan-app` zamiast implementować na zgadywaniu.
- W fazie build używaj wyłącznie zatwierdzonego baseline'u stacku z promptu build phase. Jeśli potrzebna jest dodatkowa biblioteka albo narzędzie spoza listy i nie ma go jeszcze w repo, zatrzymaj się i poproś użytkownika o zgodę.
- Publicznym wejściem do fazy build jest `/build-app`, a nie niski helper.
- Dla aplikacji hackathonowej domyślną ścieżką jest `expo-universal` (Expo + Expo Router + web-only admin). Helper `build-business-card` jest wyłącznie opcjonalnym executorem dla front-only marketing path.
- Jeśli projekt pasuje do istniejącego helpera `build-business-card`, możesz użyć go jako niskopoziomowego kroku scaffoldingu delegowanego z build promptu. Nie traktuj go jako wejścia do całej fazy.
- Jeśli brief albo aktualne `src/spec/` są niejednoznaczne, możesz przed implementacją użyć read-only agenta `planning`.
- Po pierwszym ekranie, po stworzeniu aplikacji albo przed zamknięciem sesji możesz użyć read-only agenta `review` do audytu sekcji React albo do pełnego code review stworzonego kodu.

## Zachowanie przy brakach

- Jeśli `/plan-app` nie jest jeszcze zaimplementowane i build artifacts nie istnieją, powiedz to wprost i zakończ bez edycji kodu.
- W raporcie wskaż dokładnie, których artefaktów build contractu brakuje.
