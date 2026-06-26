# Backend Instructions

## Zakres

Stosuj te instrukcje dla plików backendowych, API, warstwy serwerowej, modeli danych, walidacji, auth i integracji danych.

## Zasady

- Jeśli projekt wymaga backendu, domyślną warstwą serwerową jest `NestJS` w najnowszej stabilnej wersji.
- Jeśli produkt używa promptów, RAG albo orkiestracji AI, utrzymuj prompt system po stronie serwera. Nie wystawiaj system promptu ani prompt assets do klienta.
- Domyślną bazą danych jest `PostgreSQL`.
- Jeśli projekt wymaga RAG, embedding retrieval albo wyszukiwania wektorowego, preferuj `PostgreSQL` z `pgvector`, chyba że użytkownik zatwierdzi inne rozwiązanie.
- Modele danych, migracje i dostęp do bazy buduj przez `Prisma ORM`.
- Jeśli projekt używa Prisma Client, generuj go przez `prisma-client` z jawnym `output` w kodzie repo. Nie używaj deprecated `prisma-client-js`.
- Dla Prisma ORM 7+ przenieś URL połączenia CLI do `prisma.config.*`; w `schema.prisma` zostaw w `datasource` tylko `provider`, bez `url`, `directUrl` i `shadowDatabaseUrl`.
- Preferuj `prisma.config.ts`, ale jeśli parser CLI lub toolchain wywala się na wariancie TS, użyj wspieranego `prisma.config.js` zamiast cofać się do starego `datasource.url` w schemie.
- Jeśli `prisma generate` ma działać bez gwarancji ustawionego `DATABASE_URL`, użyj w `prisma.config.*` `process.env.DATABASE_URL ?? ""` zamiast helpera `env()`.
- W tym repo referencyjnym poprawnym fallbackiem CLI jest `server/prisma.config.js` z `defineConfig({ datasource: { url: process.env.DATABASE_URL ?? "" } })`. Nie cofaj tego do `schema.prisma`.
- Dla bezpośredniego połączenia z PostgreSQL inicjalizuj `PrismaClient` z adapterem, zwykle `@prisma/adapter-pg`, zamiast polegać na starym connection config ze schemy.
- W kodzie aplikacji importuj klienta, enumy i typy z wygenerowanej ścieżki output, nie z `@prisma/client`.
- Walidację runtime buduj przez `Zod` i korzystaj z inferencji typów tam, gdzie to upraszcza kontrakty. Dla DTO `NestJS` na granicy HTTP `class-validator` + `class-transformer` są dozwolone i preferowane, jeśli repo używa `ValidationPipe`.
- Nie wprowadzaj dodatkowych backendowych bibliotek frameworkowych, ORM, validatorów ani baz danych spoza baseline'u bez jawnej zgody użytkownika.

## Secure-by-default foundation

- Konfigurację środowiska trzymaj centralnie i waliduj przy starcie aplikacji. Brak `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN` albo innych krytycznych env ma zatrzymywać boot procesu. Nie używaj fallback secretów hardcoded w kodzie.
- W `NestJS` zawsze uruchamiaj globalny `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`.
- Dla endpointów mutujących oraz dla query z filtrami, enumami lub paginacją używaj DTO zamiast surowych prymitywów z `@Body("pole")`, `@Query("pole")` albo `@Param("pole")`, jeśli kontrakt requestu da się zamknąć w klasie DTO.
- Normalizuj dane wejściowe na granicy API: `trim`, `toLowerCase()` dla e-maili, parsowanie liczb, ograniczenia długości i allowlisty enumów. Nie przepuszczaj niesformatowanego inputu bezpośrednio do serwisu albo ORM.
- Do logowania używaj `Logger` frameworka albo loggera strukturalnego. Nie buduj produkcyjnego backendu na luźnych `console.log`.
- Jeśli aplikacja stoi za reverse proxy, ustaw `trust proxy` na adapterze HTTP. `CORS` w produkcji ma korzystać z allowlisty originów z env, nie z wildcarda.
- Dla auth JWT jawnie ustaw algorytm, issuer, audience i TTL. Access token powinien być krótkotrwały, refresh token rotowany i unieważnialny po logout. `GET /api/auth/me` traktuj jako canonical auth source dla frontendu.
- Zamiast zwracać ad-hoc payloady typu `{ error: "Unauthorized" }`, rzucaj wyjątki HTTP i utrzymuj spójne kody odpowiedzi.
- Każdy backend produkcyjny ma mieć lekki endpoint health i globalny rate limiting. Auth endpoints, np. `login`, `register`, `refresh`, mają mieć ostrzejsze limity niż reszta API.

## Workflow AI i integracje modelowe

- Dla produktów typu workflow AI trzymaj orkiestrację domenową pod `server/src/project/`, a nie rozrzucaj jej po losowych serwisach.
- Podział bazowy dla modułu workflow to: `project.service.ts` dla CRUD projektu, `project/discovery/` dla etapów discovery, `project/plan/` dla planowania, `project/story-growth/` dla dalszego rafinowania oraz `project/openrouter/` dla integracji modelowej.
- Integrację z OpenRouter utrzymuj za jedną warstwą serwisową, która centralizuje nagłówki, retry dla `429/5xx`, streaming, plugin payloady i czytelne wyjątki HTTP. Kontrolery nie powinny wołać zewnętrznego API bezpośrednio.
- Jeśli wymagane jest API key do faz discovery albo plan, brak klucza ma kończyć request jawnym błędem serwerowym z instrukcją konfiguracji, a nie cichym fallbackiem po stronie klienta.
- Wyniki faz AI zapisuj w jawnych artefaktach domenowych albo rekordach projektu. Nie polegaj na samej historii sesji jako jedynym źródle prawdy.

## Docker i runtime

- Jeśli projekt jest full-stack i wymaga backendu produkcyjnego, przygotuj osobny kontener `server` oraz osobny `Dockerfile` dla backendu.
- Nie łącz frontendu i backendu do jednego kontenera runtime.
- Zakładaj root `docker-compose.yml`, w którym backend zależy od gotowej bazy, a frontend produkcyjny jest serwowany przez `Nginx` i proxuje `/api/*` do backendu.
- Jeśli backend używa `Prisma`, runtime kontenera ma zawierać katalog `prisma/` oraz deterministyczny krok inicjalizacji schematu:
  - preferuj `prisma migrate deploy`, jeśli repo zawiera migracje,
  - jeśli projekt jest bootstrapowany i migracji jeszcze nie ma, fallback `prisma db push` jest dopuszczalny.
- Jeśli runtime kontenera uruchamia Prisma CLI, kopiuj do obrazu także `prisma.config.*`, bo samo `prisma/` nie wystarcza w Prisma 7.
- Jeśli backend używa `Prisma`, build albo `postinstall` ma uruchamiać `prisma generate`, aby świeży checkout i build kontenera nie zależały od starego klienta w `node_modules`.
- Nie używaj przy `db push` ani `migrate dev` usuniętych w Prisma 7 flag `--skip-generate`; generację klienta dodaj jawnie do skryptów, gdy jest potrzebna.
- Build kontenera ma być reprodukowalny i nie może polegać na hostowych build artifacts, lokalnych `node_modules` ani przypadkowych plikach cache.
- Jeśli backend wymaga bazy do startu, oczekuj healthchecka bazy i zależności opartych o jej gotowość zamiast losowej kolejności uruchomienia.
- Runtime kontenera backendowego ma działać jako nieuprzywilejowany użytkownik i mieć `HEALTHCHECK` oparty o realny endpoint aplikacji, nie o sam proces.

## Autoryzacja

- Jeśli wymagania zawierają autoryzację, używaj `JWT` access token + refresh token.
- Dla aplikacji SPA z backendem `NestJS` domyślny kontrakt endpointów auth to `register`, `login`, `logout`, `refresh`, `me` pod `/api/auth/*`, chyba że user stories wymagają innego układu.
- Dla web auth preferuj cookie-based auth zamiast tokenów przechowywanych jawnie po stronie klienta.
- `GET /api/auth/me` traktuj jako canonical source of truth dla aktualnie zalogowanego użytkownika po stronie frontendu.
- Refresh token przechowuj w `HttpOnly` cookie z bezpiecznymi flagami zgodnymi ze środowiskiem.
- Jeśli architektura używa dwóch cookies, zawężaj ścieżkę refresh tokena do scope auth, gdy to upraszcza bezpieczeństwo i rotację.
- Dla referencyjnego cookie flow trzymaj access token w cookie scoped do `/api`, a refresh token w osobnym `HttpOnly` cookie scoped do `/api/auth`. Frontend ma odświeżać sesję wyłącznie przez request do `/api/auth/refresh` z `credentials: "include"`.
- Kontrolę dostępu, odczyt sesji i weryfikację tokenów prowadź w middleware, guardach albo odpowiadającej warstwie serwerowej, nie w samym UI.
- Role i uprawnienia muszą być egzekwowane po stronie backendu nawet wtedy, gdy frontend ukrywa elementy UI albo blokuje routing.
- Projektuj logout tak, aby mógł unieważnić aktywny refresh token i wyczyścić cookies bez polegania wyłącznie na ważnym access tokenie, jeśli user stories nie wymagają inaczej.
- Nie przechowuj tokenów auth w `localStorage` ani w jawnych zmiennych po stronie klienta.
- Jeśli używasz JWT, nie ufaj polu `alg` z nagłówka tokenu. Ogranicz dozwolone algorytmy jawnie po stronie serwera i waliduj standardowe claimy.

## Modularność serwera — struktura katalogów

- Kiedy `server/src/[moduł]/` przekracza kilka plików, grupuj je w podkatalogi według domeny biznesowej. Przykład dla modułu `project`:

  ```
  server/src/project/
    project.module.ts
    project.controller.ts
    project.service.ts
    dto/
    discovery/
      discovery-shared.ts
      discovery.service.ts
      discovery.controller.ts
      discovery-graph.service.ts
    plan/
      plan.controller.ts
      plan.service.ts
    story-growth/
      story-growth.controller.ts
      story-growth.service.ts
    openrouter/
      openrouter.service.ts
  ```

- Pliki główne modułu (`*.module.ts`, `*.controller.ts`, `*.service.ts`) zostają na poziomie katalogu modułu i importują z podkatalogów.
- Importy między podkatalogami: używaj relatywnych ścieżek liczonych od faktycznej lokalizacji pliku. Jeśli plik jest w `project/discovery/`, to import z `src/prisma/` to `../../prisma/`, nie `../prisma/`.

## Importy lokalne w NestJS — zasady ścieżek

- Dla lokalnych importów wewnątrz tego samego podkatalogu używaj **extensionless paths** (`./discovery-shared`, nie `./discovery-shared.js`). Pod `moduleResolution: "node16"` editor TypeScript może nie rozwiązać ścieżki z rozszerzeniem `.js` wskazującej na plik `.ts`.
- Dla importów serwisów NestJS, które są wstrzykiwane przez DI (`@Injectable`), utrzymuj normalny import runtime (nie `import type`). NestJS z `emitDecoratorMetadata` wymaga runtime reference dla klas wstrzykiwanych do konstruktora — `import type` złamie DI.
- Konsekwencja: `import type { Foo }` jest poprawne tylko dla typów, interfejsów i enumów używanych wyłącznie na poziomie TypeScript w kodzie serwerowym. Dla serwisów i klas Nest zawsze importuj przez zwykły `import`.

## Edge cases

- Jeśli requirements wskazują potrzebę bazy, kolejki, cache albo brokera spoza zatwierdzonego baseline'u, zatrzymaj implementację i zapytaj użytkownika o zgodę.
- Jeśli projekt jest czysto statyczny i nie wymaga backendu, nie dodawaj `NestJS` na siłę, ale nie przenoś przez to prompt systemu do klienta.
- Jeśli frontend `web/` korzysta z auth, pamiętaj o kompatybilnym `CORS` z `credentials: true`, `cookie-parser`, `trust proxy` i sensownym scope cookies, inaczej klientowy bootstrap `/api/auth/me` będzie zawodny mimo poprawnego UI.
