# DevOps Instructions

## Zakres

Stosuj te instrukcje dla plików związanych z Dockerem, Dockerfile, Nginx, CI/CD i deploymentem.

## Zasady

- Domyślnie zakładaj prostą, przewidywalną i łatwą w utrzymaniu konteneryzację.
- Dla każdej uruchamialnej instancji albo usługi zawsze przygotowuj osobny, czytelny i produkcyjny `Dockerfile`.
- Domyślną warstwą spinającą usługi jest `Docker Compose`.
- Nie dodawaj skomplikowanych warstw builda, jeśli nie są potrzebne.
- `Nginx` traktuj jako domyślny reverse proxy dla ruchu HTTP.
- Przy frontendzie React możesz nadal używać `Nginx` jako serwera statycznego za reverse proxy, jeśli architektura nie wymaga innego wariantu.
- Jeśli produkt zawiera backend albo prompt execution, nie wystawiaj prompt systemu do klienta. Trzymaj tę warstwę po stronie serwera.
- Pipeline CI/CD ma być prosty, czytelny i powtarzalny.
- Nie dodawaj ciężkich automatyzacji bez realnej potrzeby.
- Jeśli brakuje danych o środowisku, oddziel założenia od faktów.
- Jeśli do deployu potrzebujesz infrastruktury spoza zatwierdzonego baseline'u, np. innego reverse proxy, orkiestratora albo PaaS-specific runtime, zatrzymaj się i zapytaj użytkownika o zgodę.
- W monorepo z osobnymi pakietami `server/` i `web/` nie zakładaj wspólnego root `package.json` jako miejsca builda aplikacji. Build i zależności uruchamiaj w odpowiednich katalogach pakietów, a root compose traktuj jako warstwę orkiestracji.

## Secure runtime defaults

- Każdy produkcyjny kontener runtime ma działać jako nieuprzywilejowany użytkownik. Dla frontendu preferuj obrazy `nginx` unprivileged albo jawne `USER`; dla backendu twórz własnego użytkownika runtime.
- Każda usługa runtime ma mieć `HEALTHCHECK` sprawdzający realną gotowość procesu, np. `/api/health` dla backendu i `/healthz` dla reverse proxy/statycznego frontendu.
- W `docker-compose.yml` opieraj zależności usług na `condition: service_healthy`, gdy gotowość backendu albo bazy ma znaczenie dla kolejnego serwisu.
- Nie wpisuj dev secretów jako bezpiecznych defaultów do `docker-compose.yml`. Ładuj env przez `env_file`, wymagane zmienne środowiskowe albo jawnie dokumentowany kontrakt startowy i pozwól aplikacji fail-fast, jeśli sekretu brakuje.
- Build obrazu ma być reprodukowalny: bez hostowych `node_modules`, bez lokalnych artefaktów builda, bez zależności od cache z poprzedniej sesji.
- Reverse proxy ma nie tylko proxować `/api`, ale też wystawiać własny lekki endpoint health oraz forwardować wymagane nagłówki proxy.
- Jeśli projekt używa `Prisma` albo innego narzędzia CLI w runtime, upewnij się, że obraz zawiera wszystkie pliki konfiguracyjne wymagane przez tę wersję toolchainu, np. `prisma.config.*`.
- Dla stacku `postgres + server + frontend` preferuj osobny one-shot kontener migracyjny, np. `server-migrate`, który odpala `prisma migrate deploy` przed startem runtime backendu.
- Rozróżniaj health endpointy warstw: backend zwykle pod `/api/health`, reverse proxy albo frontend statyczny pod `/healthz`.
- Dla backendu `NestJS` trzymaj `env_file` przy serwisie `server`, a krytyczne override, np. `DATABASE_URL` wewnątrz compose, zapisuj jawnie tylko wtedy, gdy wynikają z topologii kontenerów.

## Edge cases

- Jeśli nie ma pewności co do targetu deploymentu, zaproponuj bezpieczny wariant domyślny.
- Jeśli proces można uprościć do jednego builda i jednego deploya, preferuj ten wariant.
