---
description: Publiczne wejście do fazy discovery. Uruchamia dokładnie jeden etap discovery i zapisuje wynik do docs/product/01-discovery/.
agent: discovery-orchestrator
subtask: true
---

Argument użytkownika: $ARGUMENTS

To jest publiczna komenda fazy discovery.

## Zasady

- Jeśli `$ARGUMENTS` jest puste albo równe `auto`, kontynuuj discovery od etapu wskazanego w `docs/product/01-discovery/discovery-state.md`.
- Jeśli `$ARGUMENTS` wskazuje etap, uruchom tylko ten etap po walidacji prerequisites.
- Zawsze przeczytaj `@docs/product/00-governance/app-phase-workflow.md`, `@docs/product/00-governance/requirements-contract.md` oraz `@docs/product/01-discovery/discovery-orchestration.md`.
- Discovery produkuje `REQUIREMENTS.md` oraz discovery-owned dokumenty w `docs/product/`.
- Jeśli `REQUIREMENTS.md` jeszcze nie istnieje, discovery ma go utworzyć z bootstrap skeleton z `requirements-contract.md`, a potem wypełniać treścią z rozmowy z klientem.
- Każdy etap discovery aktualizuje tylko te sekcje `REQUIREMENTS.md`, które są przypisane do niego w `requirements-contract.md`.
- Discovery nie kończy się finalnymi user stories ani backlogiem implementacyjnym. Jeśli prompt discovery schodzi w tę stronę, zapisz candidate epics, candidate features, candidate user stories i planning handoff do `/plan-app`.
- Nie przechodź do kolejnego etapu discovery w tej samej sesji po osiągnięciu `DONE`.

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
