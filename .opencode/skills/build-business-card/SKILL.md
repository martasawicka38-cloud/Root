---
name: build-business-card
description: Wewnętrzny helper fazy build dla front-only path. Weryfikuje build-ready REQUIREMENTS.md i artefakty planu, generuje web/src/spec/ i scaffolduje bazowy frontend w web/ po przejściu kontraktu /build-app.
compatibility: opencode
metadata:
  arguments: tylko-spec | tylko-scaffold
  context: fork
---

# Build Business Card — Low-Level Build Helper

Wykonujesz niski poziom przepływu od finalnych user stories i build-ready `REQUIREMENTS.md` do gotowego szkieletu frontendu `web/`.
Szablony formatów spec znajdziesz w `@.opencode/skills/build-business-card/spec-templates.md`.

Publicznym wejściem do fazy build pozostaje `/build-app` z promptem `.opencode/prompts/build/build-app.md`.
Ten skill jest executorem niskiego poziomu wybieranym przez build orchestrator wtedy, gdy projekt pasuje do ścieżki business-card lub landing-page.

Ten skill nie zastępuje fazy discovery ani planowania. Zakłada, że projekt ma już discovery-ready dokumenty, plan artifacts, finalne user stories i build-ready brief. Jeśli backlog albo `REQUIREMENTS.md` nie są build-ready albo nie wynikają z discovery/plan, zatrzymaj się zamiast zgadywać.

Ten skill jest wyłącznie dla route front-only. Jeśli user stories wymagają backendu, auth, trwałych danych, RAG, integracji serwerowych albo prompt execution po stronie produkcyjnej, zatrzymaj się i oddaj decyzję z powrotem do build orchestratora, zamiast rozszerzać ten skill poza jego zakres.

## Hierarchia źródeł prawdy w tym skillu

- finalne user stories z `docs/product/04-backlog/user-stories/` są nadrzędnym kontraktem funkcjonalnym,
- `features.md` i `epics.md` nadają grupowanie i release context,
- `REQUIREMENTS.md` pozostaje syntetycznym briefem dla warstwy wizualnej, routingu, i18n i ograniczeń przekrojowych,
- jeśli user story jest sprzeczne z `REQUIREMENTS.md`, zatrzymaj się i zwróć blocker do `/plan-app` zamiast implementować konflikt.

## Tryb pracy dla tego skilla

- Pracuj etapami i nie eksploruj szeroko repo, jeśli pliki sterujące są znane.
- Dla scaffoldingu strony wizytówki jakość wizualna jest częścią definition of done. Nie kończ pracy na samym JSX, strukturze folderów i danych.
- Nie generuj plików-placeholderów ani komponentów, które nie będą użyte w finalnym widoku.
- Jeśli tworzysz stronę, sekcję albo komponent z własnym wyglądem, umieszczaj go w katalogu o tej samej nazwie i używaj pary plików `Name.tsx` + `Name.module.css`. Nie zostawiaj layoutu jako surowego tekstu w `tsx`.
- W `web/src/pages/`, `web/src/shared/` i `web/src/router/` nie używaj inline styles. Zakazane są `style={...}`, `React.CSSProperties` i mutowanie `element.style` w eventach.
- Nie renderuj tagów, badge, metadanych, linków i pól formularza jako zlepionych stringów. Każdy element musi mieć wrapper i spacing.
- Jeśli wymagania zawierają efekt wizualny albo zachowanie interaktywne, np. sticky navbar, mobile drawer, hover glow, matrix rain, zaimplementuj minimalną produkcyjną wersję od razu. Nie zostawiaj TODO.
- Instaluj zależności tylko wtedy, gdy są realnie potrzebne przez nowe importy. Zawsze sprawdź `package.json` najpierw i grupuj brakujące paczki w jedną komendę na etap.
- Zanim oprzesz scaffold na istniejących `PageContainers`, shared hookach albo wrapperach współdzielonych, przeczytaj ich publiczny entrypoint i sprawdź, czy wszystkie bezpośrednie lokalne importy resolve'ują się do realnych plików.
- Nie deleguj rdzenia scaffoldingu stron, sekcji i `shared/ui` do generycznych task-agentów. Implementuj te pliki bezpośrednio w bieżącej sesji, żeby zachować poprawne ścieżki importów.
- Relatywne importy wyliczaj z faktycznej lokalizacji pliku albo używaj istniejącego barrel export. Nigdy ich nie zgaduj.
- Po każdym większym batchu nowych plików wykonaj build albo typecheck. Jeśli wykryjesz błąd, napraw bieżący batch przed przejściem dalej.
- Jeśli package manager wywali się na błędzie uprawnień do katalogu tymczasowego, retry wykonaj z user-writable `TMPDIR`, zamiast ponawiać identyczną komendę.
- Jeśli `.opencode/plugins` używają wyłącznie Node built-ins, usuń `.opencode/package.json` i lockfile zamiast utrzymywać osobny install path dla prompt systemu.
- Kontrast kluczowych treści i UI ma spełniać podstawowe WCAG AA. Nie akceptuj sekcji, w których finalny kolor tekstu po zblendowaniu z tłem jest zbyt jasny albo zbyt słaby.
- Dla stanów sterowanych klasą w CSS Modules używaj jawnych eksportowanych klas typu `drawerOpen` albo `isOpen`. Nie polegaj na samym `.drawer.open`, jeśli JSX przełącza `styles.open` bez odrębnego exportu.
- Jeśli scaffoldujesz projekt z bazowego szablonu Vite, usuń albo zastąp stare `web/src/App.tsx`, `web/src/App.css` i `web/src/index.css`, a potem sprawdź `web/src/main.tsx`, żeby nie importował martwego global CSS.
- Jeśli projekt potrzebuje stanu UI, używaj `zustand`. Jeśli potrzebuje pobierania danych z backendu, używaj `TanStack Query`. Nie dodawaj alternatyw spoza baseline'u bez zgody użytkownika.

## Krok 1 — Walidacja build-ready REQUIREMENTS.md

Najpierw sprawdź obecność artefaktów planowania:

- `docs/product/04-backlog/epics.md`
- `docs/product/04-backlog/features.md`
- co najmniej jednego pliku w `docs/product/04-backlog/user-stories/`

Jeśli któregoś z tych artefaktów brakuje, zatrzymaj się. Ten skill działa wyłącznie po przejściu kontraktu `/build-app`.

Przeczytaj relewantne user stories z `docs/product/04-backlog/user-stories/`, a następnie `docs/product/04-backlog/features.md` i `docs/product/04-backlog/epics.md`.
Przeczytaj `REQUIREMENTS.md` z katalogu głównego projektu.

Jeśli z user stories wynika potrzeba backendu, auth, bazy danych, RAG albo prompt execution po stronie serwera, zatrzymaj się i zwróć `BLOCKED` z rekomendacją przejścia na full-stack route zamiast kontynuować ten skill.

Sprawdź obecność każdej z obowiązkowych sekcji:

| Sekcja                      | Wymagane pola                                     |
| --------------------------- | ------------------------------------------------- |
| `## Klient`                 | branża, cel strony                                |
| `## Identyfikacja wizualna` | kolory (min. primary), font nagłówka, font treści |
| `## Sekcje strony`          | lista sekcji, kolejność, HTML tag                 |
| `## Routing`                | czy SPA czy wielostronicowa, lista tras           |
| `## i18n`                   | języki, domyślny język                            |
| `## Deployment`             | środowisko docelowe                               |

Jeśli brakuje sekcji lub kluczowych pól, zatrzymaj się, wylistuj braki i poproś użytkownika o uzupełnienie. Nie kontynuuj bez kompletnych danych.

Jeśli `REQUIREMENTS.md` nie istnieje, zatrzymaj się i poinformuj użytkownika. Ten skill zakłada obecność build-ready briefu i nie zastępuje `/discovery` ani `/plan-app`.

## Krok 2 — Generuj web/src/spec/

Użyj formatów z `@.opencode/skills/build-business-card/spec-templates.md` jako wzorców.

Utwórz lub zaktualizuj wszystkie 6 plików spec:

- `web/src/spec/pages.md`
- `web/src/spec/sections.md`
- `web/src/spec/design-tokens.md`
- `web/src/spec/i18n.md`
- `web/src/spec/routing.md`
- `web/src/spec/components.md`

Zasady:

- Jeśli plik już istnieje, zaktualizuj go zamiast zerować.
- Mapuj funkcjonalność, acceptance i release slices najpierw z user stories, a `REQUIREMENTS.md` wykorzystuj do briefu, visual direction, routingu, i18n i ograniczeń przekrojowych.
- Nie twórz specyfikacji dla rzeczy, których nie ma w user stories albo w spójnym `REQUIREMENTS.md`.
- W `web/src/spec/sections.md` zapisuj nie tylko strukturę, ale też konkretne oczekiwania layoutowe i wizualne: typ układu, stan mobile, efekty hover, media oraz kluczowe komponenty UI.
- W `web/src/spec/components.md` wpisuj wyłącznie komponenty naprawdę potrzebne do wyrenderowania strony. Nie twórz ogólnych kart i wrapperów na zapas.

## Krok 3 — Zatrzymaj się jeśli argument to `tylko-spec`

Jeśli użytkownik poda argument `tylko-spec`, zakończ po wygenerowaniu `web/src/spec/` i przygotuj raport.

## Krok 4 — Generuj web/src/styles/

Na podstawie `web/src/spec/design-tokens.md` wygeneruj lub uzupełnij:

- `web/src/styles/reset.css`
- `web/src/styles/tokens.css`
- `web/src/styles/typography.css`
- `web/src/styles/global.css`

Po tym kroku zdefiniuj krótko docelowy kierunek wizualny w 3–5 punktach na podstawie `REQUIREMENTS.md` i trzymaj go konsekwentnie w dalszym scaffoldingu.

W tym kroku dopilnuj też baseline layout safety:

- `reset.css` ma zawierać `html { scrollbar-gutter: stable; }` oraz `html, body, #root { width: 100%; min-height: 100%; }`.
- `body` ma mieć `overflow-x: clip` jako bezpiecznik, ale szerokie komponenty muszą nadal zamykać overflow lokalnie.
- Globalny baseline ma też ustawić domyślne tło i kolor tekstu zgodne z visual direction projektu. Dla projektów dark-only body nie może zostać białe.
- `global.css` ma utrzymać `width: 100%` dla `.page-container`, `.page-body` i `.page-section-container`.
- Jeśli istnieje `ContentSection.module.css`, jego `.wrapper` ma zachować jednocześnie `width: 100%` i `max-width: var(--content-max-width)`.
- Przy subtelnych tintach i przezroczystościach oceń finalny kontrast sekcji, nie sam source token.
- Po wygenerowaniu stylów sprawdź też entrypoint: `web/src/main.tsx` nie może importować starego `web/src/index.css` z szablonu, jeśli projekt przeszedł na `web/src/styles/*`.

## Krok 5 — Generuj web/src/router/

Na podstawie `web/src/spec/routing.md`:

- utwórz `web/src/router/RootLayout.tsx`, jeśli nie istnieje,
- utwórz `web/src/router/index.tsx` z `createBrowserRouter` i `errorElement` na root route.

## Krok 6 — Generuj web/src/i18n/

Na podstawie `web/src/spec/i18n.md`:

- wygeneruj `web/src/i18n/messages/pl.json`,
- wygeneruj `web/src/i18n/messages/en.json`,
- przygotuj `web/src/i18n/index.ts`.

Jeśli paczka i18n nie jest zainstalowana, doinstaluj ją tylko raz i tylko razem z innymi faktycznie potrzebnymi zależnościami.

## Krok 6.5 — Zbuduj referencyjny pierwszy ekran

Zanim wygenerujesz wszystkie pozostałe sekcje:

1. Doprowadź `NavbarSection`, `HeroSection` i `FooterSection` do jakości docelowej.
2. Upewnij się, że pierwszy ekran ma poprawną hierarchię typografii, spacing, CTA, kontrast i mobile layout.
3. Jeśli na stronie jest hamburger, drawer mobilny ma być częścią definition of done dla pierwszego ekranu.
4. Jeśli pierwszy ekran wygląda jak wireframe albo surowy scaffold, nie przechodź dalej.
5. Jeśli drawer jest sterowany przez CSS Modules, użyj jawnej klasy eksportowanej, np. `drawerOpen`, i potwierdź, że JSX przełącza dokładnie tę klasę.

## Krok 6.75 — Zwaliduj pierwszy ekran

Po pierwszym ekranie obowiązkowo:

1. Uruchom build albo typecheck.
2. Sprawdź, czy nie ma poziomego overflow strony na desktopie i w mobile około 375px.
3. Sprawdź kontrast kluczowych treści i UI względem tła. Body text, linki, pola formularza i sekcyjne headingi mają pozostać czytelne bez zgadywania.
4. Jeśli na stronie jest hamburger, kliknij go przy około 375px i upewnij się, że drawer realnie pokazuje wszystkie linki, CTA i language switch.
5. Jeśli masz terminale, snippet blocks albo długie linki, upewnij się, że scrollują się lokalnie albo zawijają bez poszerzania strony.
6. Jeśli walidacja nie przechodzi, napraw ten slice przed generowaniem kolejnych sekcji.
7. Jeśli package operations w środowisku opencode nadal zgłaszają EACCES, pierwszym retry ma być komenda z `TMPDIR="$HOME/tmp"`, nie kolejne gołe `pnpm`.

## Krok 7 — Generuj sekcje stron

Na podstawie `web/src/spec/sections.md` i `web/src/spec/pages.md`:

1. Utwórz `web/src/pages/[NazwaStrony]/[NazwaStrony].tsx` dla każdej strony.
2. Jeśli strona ma własne style, utwórz `web/src/pages/[NazwaStrony]/[NazwaStrony].module.css`.
3. Utwórz katalog `web/src/pages/[NazwaStrony]/sections/[NazwaSekcji]/` dla każdej sekcji.
4. W każdej sekcji używaj `NazwaSekcji.tsx` oraz `NazwaSekcji.module.css`, jeśli sekcja ma własne style.
5. Zachowaj poprawną hierarchię `PageContainers`.
6. Dla każdej sekcji dostarcz finalny layout, a nie tylko placeholder treści.
7. Dla każdego nowego komponentu z własnym wyglądem dodaj odpowiadające style w tym samym katalogu co komponent.
8. Nie nadpisuj istniejących, niepustych plików implementacyjnych, chyba że są wyraźnie szkieletem wygenerowanym wcześniej przez ten sam workflow i wymagają doprowadzenia do stanu docelowego.
9. Dla układów flex i grid z potencjalnie szeroką treścią dopilnuj `min-width: 0` na dzieciach albo wrapperach, żeby nie generować poziomego overflow.
10. Jeśli sekcja zawiera szerokie elementy, np. terminal, tabelę, embed albo chip listę, zamknij overflow lokalnie w tej sekcji albo komponencie.
11. Dla widoczności sterowanej stanem w CSS Modules twórz jawne klasy eksportowane, np. `drawerOpen`, `drawerVisible`, `isActive`, i przełączaj dokładnie je w JSX.
12. Jeśli sekcja używa subtelnego tła przez alpha token, oceń kontrast wobec realnego body background po zblendowaniu, a nie tylko wobec nazwy sekcji w spec.
13. Przed zamknięciem batcha UI wykonaj `rg -n 'style=' web/src/pages web/src/shared web/src/router`; wynik ma być pusty.

## Krok 8 — Raport końcowy

Przygotuj raport z listą:

- wygenerowanych plików,
- braków wymagających ręcznego uzupełnienia,
- kolejnych kroków.

Przed raportem końcowym wykonaj build i krótki sanity check jakości UI. Jeśli efekt nadal wygląda jak surowy scaffold, popraw go zamiast kończyć.

Raport końcowy wolno zamknąć dopiero wtedy, gdy ostatni build albo typecheck przechodzi.

## Zasady nadrzędne

- Nie wymyślaj danych. Wszystko ma pochodzić z finalnych user stories, backlogu, `REQUIREMENTS.md` albo ze spójnej specyfikacji.
- Nie dodawaj bibliotek spoza zatwierdzonego baseline'u bez jawnej zgody użytkownika.
- Jeśli wymagania są niekompletne, zatrzymaj się na Kroku 1.
- Pliki sekcji traktuj jako finalne jednostki implementacji, a nie jako szkielety do późniejszego dopieszczenia.
- Nie zostawiaj nieużywanych komponentów, pustych plików, surowych list bez layoutu ani sekcji bez stylowania.
