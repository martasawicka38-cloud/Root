---
description: Publiczne wejście do fazy planowania aplikacji. Zamienia discovery i REQUIREMENTS.md w scope docs, backlog i user stories.
agent: plan-app-orchestrator
subtask: true
---

Argument użytkownika: $ARGUMENTS

To jest publiczna komenda fazy planowania aplikacji.

## Zasady

- Zawsze przeczytaj `@docs/product/00-governance/app-phase-workflow.md`.
- Zawsze przeczytaj `@docs/product/00-governance/requirements-contract.md`.
- Zawsze przeczytaj `@.opencode/prompts/plan/plan-app.md`.
- Następnie przeczytaj `@docs/product/01-discovery/discovery-state.md` oraz `@docs/product/01-discovery/stages/sokrates.md`, jeśli istnieje.
- Najpierw zwaliduj, czy discovery naprawdę zakończyło się handoffem do `/plan-app`.
- Jeśli discovery nie jest gotowe, zatrzymaj się i wskaż dokładnie, który etap discovery musi zostać domknięty przez `/discovery`.
- Jeśli discovery jest gotowe, utwórz albo zaktualizuj scope docs, backlog, user stories i `REQUIREMENTS.md` zgodnie z kontraktem fazy plan.
- Finalne user stories wyprodukowane w tej fazie są nadrzędnym kontraktem funkcjonalnym dla `/build-app`; `REQUIREMENTS.md` pozostaje ich syntetycznym briefem.
- Jeśli produkt jest full-stack albo workflow-driven, dopilnuj, aby backlog i user stories rozdzielały odpowiedzialności frontendowe (`web/`), backendowe (`server/`) i deployowe (root compose / Nginx / Docker).

## Co masz zwrócić

Zwróć krótki raport w tym formacie:

```md
## Plan Phase Status

- Discovery Ready: yes|no
- Blocking Stage: ...
- Current Status: done | in_progress | blocked

## Expected Outputs Of /plan-app

- docs/product/02-scope/\*
- docs/product/03-domain/\* when needed
- docs/product/04-backlog/epics.md
- docs/product/04-backlog/features.md
- docs/product/04-backlog/backlog-priority.md
- docs/product/04-backlog/user-stories/\*.md
- update of REQUIREMENTS.md as build-ready executive summary

## Next Action

- run /discovery ...
  or
- continue toward /build-app
```
