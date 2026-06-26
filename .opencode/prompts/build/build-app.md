# Build App Prompt

To jest prompt nadrzędny fazy `/build-app`.

Ma uporządkować build tak, aby publiczna komenda build phase była zawsze jedna, a niski poziom implementacji był delegowany do właściwych helperów, agentów read-only i skilli.

## Cel

Zamień build-ready `REQUIREMENTS.md` oraz backlog z `docs/product/04-backlog/` w działający kod aplikacji, bez omijania kontraktu fazy plan.

W tej fazie finalne user stories są nadrzędnym kontraktem funkcjonalnym. `REQUIREMENTS.md` pozostaje executive summary i briefem przekrojowym.

## Architektura build phase

Obowiązuje model:

`/build-app` -> `build-orchestrator` -> `.opencode/prompts/build/build-app.md` -> helpery niższego poziomu

Warstwy pomocnicze mają konkretne role:

- `.opencode/instructions/*.md` — globalne zasady jakości, stylu implementacji i stacku,
- `.opencode/agents/planning.md` — read-only diagnoza braków briefu, backlogu albo `src/spec/`,
- `.opencode/agents/review.md` — read-only audit sekcji albo findings-first code review po pierwszym ekranie, po stworzeniu aplikacji albo przed zamknięciem build slice'a,
- `.opencode/skills/build-business-card/SKILL.md` — optional executor niskiego poziomu tylko dla ścieżki business-card,
- helper commands `/check-spec`, `/fill-tokens`, `/scaffold-project`, `/scaffold-section`, `/audit-section`, `/update-brain` — precyzyjne narzędzia dla węższych kroków builda.

## Konwencje ścieżek w tym repo

- frontend Expo żyje pod `src/` i używa `src/app/` jako warstwy routingu,
- backend (jeśli obecny w repo) żyje pod `server/src/`,
- `src/spec/` opisuje warstwę frontendową i nie zastępuje backendowych kontraktów DTO ani modułów NestJS.

## Zatwierdzony baseline stacku

W build phase domyślnie rozwiązuj problemy wyłącznie tym stackiem:

- `NestJS` jako backend (REST/GraphQL),
- `Expo` (Managed Workflow) + `Expo Router` po stronie frontendu,
- `TypeScript`,
- `Axios` + `TanStack React Query` dla danych,
- `zustand` dla UI state,
- `react-native-web` dla web support.

Komendy inicjalizacji i bazowych zależności (używaj dokładnie):

1. `npx create-expo-app@latest my-app`
2. `npx expo install react-dom react-native-web @expo/metro-runtime`
3. `npm install axios @tanstack/react-query zustand`

Jeśli projekt wymaga autoryzacji, używaj `JWT` access token + refresh token, przy czym refresh token ma być w `HttpOnly` cookie, a autoryzacja ma być spięta przez middleware/guards warstwy serwerowej.

Jeśli prompty albo logika AI są częścią produktu, trzymaj je po stronie serwera `NestJS`. Nie wystawiaj system promptu do klienta.

Jeśli do realizacji brakuje biblioteki spoza tego baseline'u i nie ma jej już w repo, zatrzymaj implementację i zapytaj użytkownika o zgodę albo o preferowaną alternatywę.

## Routing builda

### Route A — Expo Universal App + NestJS

Wybierz ten route domyślnie, gdy projekt wymaga aplikacji mobilnej i panelu admina web w jednym frontendzie Expo.

W tej ścieżce:

1. Najpierw ustal, które slice'e dotykają `src/`, `server/src/` i dokumentacji produktu.
2. Jeśli `src/spec/` nie istnieje albo jest niekompletne, utwórz lub zaktualizuj je przed szerokim scaffoldem frontendu.
3. W `src/app/admin/*` egzekwuj web-only guard oparty o `Platform.OS`.
4. W `src/app/(mobile)/*` na webie egzekwuj zwężony kontener mobilny (`maxWidth: 480`, `height: 100vh`).
5. Trzymaj routing w `src/app/*`, a logikę domenową w `src/features/*`.
6. Warstwę API i query providers osadzaj centralnie (np. `src/lib/api.ts` + provider w `src/app/_layout.tsx`).
7. Po każdym większym batchu plików wykonuj build albo typecheck.

### Route B — business-card / landing / portfolio

Wybierz `build-business-card`, gdy projekt jest wyłącznie marketingowy i nie wymaga app-flow Expo (mobile + admin).

W tej ścieżce:

1. Zwaliduj kontrakt build phase.
2. Jeśli brief lub backlog są niejednoznaczne, uruchom najpierw read-only `planning`.
3. Przeczytaj `.opencode/skills/build-business-card/SKILL.md` oraz `.opencode/skills/build-business-card/spec-templates.md`.
4. Deleguj low-level wykonanie do `build-business-card`.
5. Po pierwszym ekranie wykonaj build albo typecheck.
6. Jeśli zmieniałeś UI, uruchom `review` przed końcem sesji i napraw blokery. Jeśli zamknąłeś większy slice albo całą aplikację, użyj `review` także jako code review findings-first.

### Route C — backend-only / API / workflow service

Wybierz ten route, gdy deliverable nie obejmuje frontendu Expo, ale nadal potrzebujesz backendu NestJS.

W tej ścieżce:

1. Zacznij od secure-by-default foundation backendu.
2. Buduj moduły `NestJS`, DTO, Prisma i integracje modelowe w `server/src/`.
3. Jeśli auth istnieje, utrzymuj ten sam cookie/JWT contract co w Route A.
4. Domknij Dockerfile, healthchecki, migracje i runtime security.
5. Po każdym większym batchu plików wykonuj build albo typecheck pakietu `server/`.

## Forwardowanie argumentów

Jeśli argument użytkownika jest zgodny z niskim helperem, np. `tylko-spec` albo `tylko-scaffold`, możesz przekazać go do `build-business-card`, ale tylko wtedy, gdy wybrany build route rzeczywiście jest business-card.

## Zasady nadrzędne

- `/build-app` pozostaje jedynym publicznym wejściem do fazy build.
- `build-business-card` nie zastępuje promptu build phase; jest executorem niższego poziomu.
- Nie pomijaj `REQUIREMENTS.md`, epik, feature'ów ani user stories.
- Funkcjonalność, architektura i dobór narzędzi mają wynikać przede wszystkim z finalnych user stories oraz ich acceptance criteria.
- `REQUIREMENTS.md` służy do utrzymania spójnego briefu biznesowego, visual direction, routingu, i18n i NFR.
- Jeśli user stories są sprzeczne z `REQUIREMENTS.md`, zatrzymaj implementację i wróć z blockerem do `/plan-app`.
- Nie wprowadzaj dodatkowych bibliotek spoza zatwierdzonego baseline'u bez jawnej zgody użytkownika.
- Nie zostawiaj full-stack route bez secure defaults: env validation, request validation, DTO boundaries, health, throttling, auth claim verification, non-root Docker i healthchecków.
- Nie traktuj projektu Expo Universal App jako front-only marketing scaffold bez jawnego sygnału z wymagań.
- Jeśli build contract nie przechodzi, zakończ jako `BLOCKED`.
- Jeśli implementacja zmienia kod produktu, kończ sesję dopiero po przejściu builda albo typechecka dla bieżącego slice'a.

## Oczekiwany raport

```md
## Build Phase Status

- Outcome: DONE | IN PROGRESS | BLOCKED
- Build Route: expo-universal | build-business-card | backend-only | mixed
- Helpers Used: ...
- Files Updated: ...
- Validation: ...
- Remaining Gaps: ...
```
