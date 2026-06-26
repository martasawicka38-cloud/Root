---
description: Wewnętrzny helper discovery. Uruchamia jeden etap discovery w izolowanym subtasku i opiera następny krok wyłącznie o zapisane artefakty etapów.
agent: discovery-orchestrator
subtask: true
---

Argument użytkownika: $ARGUMENTS

Uruchom dokładnie jeden etap discovery.

## Zasady

- Jeśli `$ARGUMENTS` jest puste albo równe `auto`, wybierz etap z `docs/product/01-discovery/discovery-state.md`.
- Jeśli `$ARGUMENTS` wskazuje etap, uruchom tylko ten etap po walidacji prerequisites.
- Zawsze przeczytaj `@docs/product/01-discovery/discovery-orchestration.md`.
- Używaj tylko zapisanych artefaktów discovery i promptu źródłowego bieżącego etapu.
- Nie przenoś pełnej historii rozmowy do następnego etapu. Następny etap ma startować z `discovery-state.md` i plików w `docs/product/01-discovery/stages/`.
- Aktualizuj `docs/product/01-discovery/discovery-state.md` oraz artefakt bieżącego etapu.
- Finalne user stories i backlog implementacyjny nie należą do discovery. Jeśli prompt etapu schodzi w tę stronę, zapisz tylko input do `/plan-app`.
- Nie przechodź do następnego etapu w tej samej sesji. Zakończ po osiągnięciu `DONE`, `IN PROGRESS` albo `BLOCKED`.

## Dozwolone nazwy etapów

- `smallTalk`
- `businessMode`
- `adaptability`
- `persona`
- `customerReview`
- `domainHarvester`
- `visualIdentification`
- `sokrates`

## Oczekiwany wynik sesji

Na końcu zwróć jawnie:

- `Stage`
- `Outcome`
- `Artifacts Updated`
- `Recommended Next Stage`
- `Next Phase Command`
- `First Question For Next Stage` albo `Next Question`
