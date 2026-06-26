# Przykład użycia promptu `visualIdentification.md`

Poniżej znajduje się przykładowy rezultat, jaki AI powinno przygotować po rozmowie discovery z klientem.

## Przykładowy kontekst rozmowy z klientem

Klient: Adam Zagórski, fullstack developer budujący osobiste portfolio dla rekruterów IT, Tech Leadów i CTO.

Najważniejsze informacje z rozmowy:

- marka jest de facto marką osobistą i ma wspierać pozycjonowanie jako dojrzałego, produktowego developera,
- portfolio ma działać digital-first i być wdrożone jako modularna aplikacja SPA z design systemem oraz tokenami,
- klient lubi estetykę terminala i kodu, ale nie chce efektu cyberpunk, gamer ani „hackerskiego mema”,
- kierunek wizualny ma być ciemny, skupiony, techniczny, precyzyjny i subtelnie filmowy,
- dominujący akcent ma opierać się o neonowy Matrix Green, ale użyty oszczędnie i profesjonalnie,
- klient chce, żeby strona wyglądała jak dopracowane narzędzie albo ekran roboczy senior developera, a nie landing promocyjny agencji kreatywnej,
- język wizualny ma łączyć monospacowy charakter kodu z bardzo dobrą czytelnością body copy dla rekruterów,
- projekt ma być zawsze dark mode; light mode nie jest planowany,
- na stronie mają wystąpić sekcje z kartami projektów, timeline doświadczenia, stackiem technicznym, formularzem kontaktowym i sticky nawigacją,
- hero może mieć subtelny efekt Matrix Rain, ale tylko jako tło o niskiej opacity,
- logo nie istnieje jako osobny asset; klient chce prosty monogram `<AZ/>` osadzony inline w navbarze,
- klient chce zachować bardzo dobrą czytelność na mobile i nie dopuścić do kiczu ani nadmiaru efektów,
- preferowane fonty to `JetBrains Mono` dla akcentów terminalowych oraz czytelny grotesk dla body,
- klient nie ma pełnego brand booka; posiada tylko wstępny kierunek, kilka decyzji estetycznych i oczekiwanie, że system da się łatwo przełożyć na tokeny.

---

## Przykładowy wynik działania promptu

Przykład jest ułożony w tym samym rytmie co pozostałe pliki `.example.md` w discovery: klasyfikacja, synteza, stan wiedzy, handoff do `REQUIREMENTS.md`, artefakty domenowe i ryzyka. W `visualIdentification` część artefaktowa schodzi dalej do design systemu, tokenów i zasad layoutu.

### 1. Klasyfikacja discovery

- `Input Maturity`: `Partial System`
- `Visual Scope`: `Product UI`
- `Confidence Level`: `wysoki`

Uzasadnienie: klient ma już wyraźny kierunek estetyczny, zna klimat marki i kilka konkretnych decyzji, ale nie posiada jeszcze pełnego systemu wizualnego opisanego w formacie gotowym do implementacji. Zakres dotyczy strony typu portfolio, ale sposób budowy jest modularny, z osobnym design systemem, wrapperami layoutu i tokenami, więc discovery musi zejść do poziomu `Product UI`.

### 2. Executive Summary

Marka osobista Adama ma komunikować techniczną dojrzałość, sprawczość i produktowe myślenie. Kierunek wizualny opiera się na estetyce terminala i kodu, ale w wersji zdyscyplinowanej, profesjonalnej i czytelnej. System powinien łączyć ciemne tła, oszczędne neonowo-zielone akcenty, monospacową ekspresję w nagłówkach i etykietach oraz spokojny, wysoko czytelny font do treści.

To nie ma być stylizacja „hakerska”, tylko nowoczesne portfolio developera, który zna architekturę, deployment i pracę end-to-end. W praktyce oznacza to dark-only interface, ograniczoną liczbę kolorów, wyraźne role typograficzne, ostre lub lekko zaokrąglone formy, mało klasycznych cieni i głębię budowaną głównie przez kontrast, obramowania i subtelny glow.

### 3. Confirmed / Assumptions / Open Questions / Missing Assets

#### Confirmed

- marka ma wyglądać technicznie, nowocześnie i dojrzale, ale bez przesadnej stylizacji sci-fi,
- system jest digital-first i ma zasilać modularny frontend oparty o design tokens,
- interfejs ma działać wyłącznie w dark mode,
- dominującym akcentem jest Matrix Green używany oszczędnie jako kolor CTA, aktywnych elementów i stanów sukcesu,
- klient chce łączyć `JetBrains Mono` z czytelnym fontem bezszeryfowym do treści,
- logo ma być prostym, tekstowym monogramem `<AZ/>` osadzonym inline w navbarze,
- sekcje strony obejmują hero, about, stack, experience, projects, certificates, contact i footer,
- animacje mają być subtelne i muszą respektować `prefers-reduced-motion`,
- projekt ma wyglądać bardzo dobrze na mobile i nie może tracić czytelności przez ozdobniki.

#### Assumptions

- tło bazowe powinno być niemal czarne, ale nie absolutnie czarne, żeby zachować głębię i lepszą pracę z zielonym akcentem,
- zielony akcent pomocniczy powinien być ciemniejszy i bardziej kontrolowany niż główny neon,
- karty, formularze i timeliny będą korzystać z powierzchni lekko jaśniejszej niż body background,
- język layoutu powinien pozostać bardziej „contained product UI” niż full-bleed editorial,
- fotografię można ograniczyć lub całkowicie zastąpić interfejsowymi blokami terminalowymi i informacyjnymi, jeśli klient nie chce portretu,
- ikony powinny być proste, liniowe i niespektakularne, raczej wspierające niż dekoracyjne.

#### Open Questions

- czy klient chce używać własnego portretu lub zdjęć w sekcji hero albo about,
- czy system ma zawierać osobny token dla koloru `warning` i `info`, czy wystarczy `success` i `error`,
- czy favicon ma być uproszczonym wariantem monogramu `<AZ/>`,
- czy potrzebny jest dodatkowy akcent neutralny dla separatorów i delikatnych linii technicznych,
- jaka dokładnie szerokość contentu ma zostać uznana za docelową po wdrożeniu pierwszego ekranu,
- czy klient chce utrzymać wyłącznie tekstowe logo, czy w przyszłości rozwinąć je do bardziej formalnego sygnetu.

#### Missing Assets

- finalny plik CV do pobrania w `PDF`,
- finalna wersja monogramu `<AZ/>` jako referencyjny szkic lub decyzja, że pozostaje tylko inline SVG w kodzie,
- ewentualny zestaw ikon social i favicon,
- ewentualne zdjęcie portretowe lub decyzja o całkowitej rezygnacji z fotografii.

### 4. Handoff do `REQUIREMENTS.md`

#### Draft sekcji

```md
## Identyfikacja wizualna

> Motyw: **Matrix Green** — estetyka terminala / kodu przetłumaczona na dojrzały, produktowy interfejs. Dominujące jest bardzo ciemne, niemal czarne tło z oszczędnym neonowo-zielonym akcentem. Marka ma wyglądać technicznie, precyzyjnie i nowocześnie, ale bez cyberpunkowego kiczu. Typografia łączy monospacowy charakter nagłówków i etykiet z czytelnym groteskiem w treści. Atmosfera: dark, focused, precise, cinematic — jak dopracowane środowisko pracy developera.

### Kolory

| Token             | Wartość hex / rgb    | Uwagi                                                                      |
| ----------------- | -------------------- | -------------------------------------------------------------------------- |
| `primary`         | `#00ff41`            | Matrix green — główny akcent dla CTA, aktywnych elementów i sygnałów stanu |
| `primary-subtle`  | `#00b32c`            | Ciemniejszy zielony dla hover, borderów i akcentów drugoplanowych          |
| `secondary`       | `rgba(0,255,65,.15)` | Subtelny zielony tint do tagów, lekkich teł i akcentów sekcyjnych          |
| `neutral-100`     | `#e8ffe8`            | Bardzo jasna zieleń dla tekstu głównego i kontrastowego foregroundu        |
| `neutral-900`     | `#0a0d0a`            | Tło bazowe strony, prawie czarne, ale nie absolutnie czarne                |
| `success`         | `#00ff41`            | Stan sukcesu spójny z kierunkiem marki                                     |
| `error`           | `#ff3b3b`            | Błędy formularza i komunikaty krytyczne                                    |
| `bg-surface`      | `#0f130f`            | Powierzchnie kart, paneli i bloków treści                                  |
| `bg-strong`       | `#060806`            | Najciemniejsze tło dla nawigacji, stopki lub mocnych sekcji                |
| `bg-brand-subtle` | `rgba(0,255,65,.06)` | Bardzo delikatny zielony tint do sekcji akcentowych                        |

### Typografia

| Rola             | Font family                       | Wagi     | Uwagi                                                                           |
| ---------------- | --------------------------------- | -------- | ------------------------------------------------------------------------------- |
| Nagłówki (h1-h3) | `'JetBrains Mono'` (Google Fonts) | 700, 800 | Monospaced display z charakterem terminalowym, stosowany oszczędnie i świadomie |
| Treść (body)     | `'Inter'` (Google Fonts)          | 400, 500 | Czytelność dłuższych opisów, bio, list i formularzy                             |
| UI / etykiety    | `'JetBrains Mono'`                | 400, 500 | Tagi, labele, snippety kodu, meta, nawigacja, badge                             |

### Skala typografii

| Token      | Rozmiar (px/rem)  | Line-height | Użycie                         |
| ---------- | ----------------- | ----------- | ------------------------------ |
| `text-xs`  | `12px / 0.75rem`  | `16px`      | Tech tagi, captions, meta      |
| `text-sm`  | `14px / 0.875rem` | `20px`      | Linki nav, przyciski, etykiety |
| `text-md`  | `16px / 1rem`     | `24px`      | Body, opisy, bio, listy        |
| `text-lg`  | `18px / 1.125rem` | `28px`      | Tytuły kart projektów          |
| `text-xl`  | `24px / 1.5rem`   | `32px`      | H2 sekcji                      |
| `text-2xl` | `36px / 2.25rem`  | `44px`      | H1 pomocnicze i duże subheady  |
| `text-3xl` | `56px / 3.5rem`   | `64px`      | Hero heading                   |

### Spacing, radius, shadow

- **Bazowy spacing (grid):** 8px system — wartości: 4px, 8px, 16px, 24px, 32px, 48px, 64px, 96px
- **Border radius:** `4px` dla micro elementów, `8px` dla kart i inputów, `0px` tam, gdzie interfejs ma zachować ostrzejszy terminalowy charakter
- **Cienie / glow / border language:** brak klasycznych ciężkich box-shadowów; głębia budowana przez kontrast tła, cienkie bordery i subtelny glow w kolorze primary, np. `0 0 16px rgba(0,255,65,.18)` na hover i `0 0 2px rgba(0,255,65,.5)` dla aktywnych obramowań

### Logo

- **Format:** inline SVG lub tekstowy monogram `<AZ/>` stylizowany na kod JSX
- **Warianty:** podstawowy wordmark / monogram na ciemnym tle, uproszczony wariant pod faviconę jako osobna decyzja do potwierdzenia
- **Zasady użycia:** nawiasy ostre i akcent w kolorze `primary`, litery w `neutral-100`, bez ozdobników 3D i bez dodatkowych efektów poza ewentualnym bardzo subtelnym glow
- **Status assetów:** brak finalnego zewnętrznego assetu; implementacja może ruszyć na inline SVG w navbarze
```

### 5. Rozszerzenia do design systemu i specyfikacji

#### Layout Rules

- System powinien być `contained-first`, z wyraźną osią treści i czytelną strukturą sekcji.
- Docelowa szerokość contentu: `Proposal: 1200px-1280px`, do potwierdzenia po pierwszym ekranie.
- Sekcje mają być przestrzenne, ale nie luksusowo „puste”; rytm bardziej jak dopracowany produkt B2B niż editorial magazynowy.
- Hero może pracować pełną wysokością viewportu, ale pozostałe sekcje powinny być modularne, przewidywalne i łatwe do utrzymania.
- Karty, timeline i formularze powinny używać spójnej geometrii: ostre lub lekko zaokrąglone narożniki, cienkie zielone obramowania, minimum dekoracji.

#### Background Modes

- `base`: `#0a0d0a` jako główne tło strony.
- `surface`: `#0f130f` dla kart, bloków i formularzy.
- `strong`: `#060806` dla navbaru, stopki i sekcji wymagających większego ciężaru.
- `brand subtle`: `rgba(0,255,65,.06)` dla delikatnie akcentowanych sekcji.
- `scrim`: `TODO` — brak jawnej decyzji; rekomendacja: ciemny overlay do drawera i sticky states.

#### Interaction Rules

- CTA primary: wypełnienie `primary`, tekst ciemny lub bardzo ciemny dla czytelności.
- CTA secondary / outline: transparent background, border `primary`, tekst `primary`, hover z delikatnym fill.
- Focus states muszą być jawne i kontrastowe, najlepiej z cienkim glow lub outline opartym o `primary`.
- Hover na kartach: lekki `translateY(-4px)` oraz subtelny glow, bez dużych transformacji.
- Tagi technologii i badge mają opierać się na `brand subtle` + `primary-subtle` border.

#### Imagery Rules

- Priorytet mają elementy systemowe, terminalowe, kodowe i strukturalne nad klasyczną fotografią stockową.
- Jeśli pojawi się fotografia, powinna być stonowana, ciemna, techniczna i wspierająca wiarygodność, nie lifestyle.
- Ikony: liniowe, proste, neutralne, bez przesadnej dekoracyjności.
- Patterny i tekstury mogą pojawić się wyłącznie w tle i muszą być subtelne.

#### Motion Rules

- Ruch ma budować klimat technologiczny, ale nie może dominować nad treścią.
- Dozwolone: delikatny `fade-in`, `slide-up`, subtelny stagger, typing cursor, nisko kontrastowy Matrix Rain w tle hero.
- Niedozwolone: agresywny parallax, ciężkie glitch efekty, ciągłe pulsowanie większości elementów.
- Wszystkie animacje muszą respektować `prefers-reduced-motion: reduce`.

#### Accessibility Notes

- Priorytetem jest kontrast body text i formularzy zgodny z WCAG AA.
- Monospace ma budować charakter, ale nie może pogarszać czytelności dłuższych opisów.
- Mobile-first jest obowiązkowe; szczególnie ważne są brak poziomego overflow, czytelne CTA i kontrola szerokich terminalowych bloków.
- Glow i zielone tinty muszą być oceniane po zblendowaniu na ciemnym tle, nie tylko po nazwie koloru.

#### Asset Checklist

- finalny PDF CV,
- decyzja o faviconie,
- finalny szkic monogramu `<AZ/>`,
- decyzja, czy w projekcie będzie fotografia portretowa,
- decyzja o dodatkowych kolorach semantycznych `warning` i `info`.

### 6. Handoff do tokenów

| Token / parametr          | Wartość                                | Status        | Uwagi                             |
| ------------------------- | -------------------------------------- | ------------- | --------------------------------- |
| `--color-primary`         | `#00ff41`                              | Confirmed     | Główny akcent marki               |
| `--color-primary-subtle`  | `#00b32c`                              | Confirmed     | Hover, borders, secondary accents |
| `--color-secondary`       | `rgba(0,255,65,.15)`                   | Confirmed     | Tint i lekkie powierzchnie        |
| `--color-neutral-100`     | `#e8ffe8`                              | Confirmed     | Tekst główny                      |
| `--color-neutral-900`     | `#0a0d0a`                              | Confirmed     | Tło bazowe                        |
| `--color-success`         | `#00ff41`                              | Confirmed     | Tożsame z primary                 |
| `--color-error`           | `#ff3b3b`                              | Confirmed     | Błędy                             |
| `--color-bg-surface`      | `#0f130f`                              | Confirmed     | Karty i panele                    |
| `--color-bg-strong`       | `#060806`                              | Confirmed     | Navbar, footer, mocne sekcje      |
| `--color-bg-brand-subtle` | `rgba(0,255,65,.06)`                   | Confirmed     | Tło akcentowe                     |
| `--color-bg-scrim`        | `TODO`                                 | Open Question | Do ustalenia pod drawer i overlay |
| `--font-heading`          | `'JetBrains Mono', monospace`          | Confirmed     | Nagłówki                          |
| `--font-body`             | `'Inter', sans-serif`                  | Confirmed     | Treść                             |
| `--font-ui`               | `'JetBrains Mono', monospace`          | Confirmed     | UI, etykiety, badge               |
| `--text-xs`               | `0.75rem`                              | Confirmed     | `16px` line-height                |
| `--text-sm`               | `0.875rem`                             | Confirmed     | `20px` line-height                |
| `--text-md`               | `1rem`                                 | Confirmed     | `24px` line-height                |
| `--text-lg`               | `1.125rem`                             | Confirmed     | `28px` line-height                |
| `--text-xl`               | `1.5rem`                               | Confirmed     | `32px` line-height                |
| `--text-2xl`              | `2.25rem`                              | Confirmed     | `44px` line-height                |
| `--text-3xl`              | `3.5rem`                               | Confirmed     | `64px` line-height                |
| spacing scale             | `4, 8, 16, 24, 32, 48, 64, 96`         | Confirmed     | 8px system                        |
| radius scale              | `4px / 8px / 0px`                      | Confirmed     | Micro / cards / sharp hero logic  |
| glow rules                | `0 0 16px rgba(0,255,65,.18)`          | Confirmed     | Hover i highlight                 |
| active border glow        | `0 0 2px rgba(0,255,65,.5)`            | Confirmed     | Focus i active                    |
| `--content-max-width`     | `Proposal: 1200px-1280px`              | Proposal      | Do testu po pierwszym ekranie     |
| `--section-padding-y`     | `Proposal: var(--space-16)`            | Proposal      | Do walidacji po wdrożeniu hero    |
| `--section-padding-x`     | `Proposal: var(--space-8)`             | Proposal      | Spójność z wrapperami             |
| `--navbar-height`         | `Proposal: 72px desktop / 64px mobile` | Proposal      | Do walidacji z drawerem mobilnym  |

### 7. Ryzyka, luki i decyzje do potwierdzenia

- Największe ryzyko polega na przesunięciu estetyki w stronę cyberpunku albo „hackerskiego” stereotypu, co osłabi profesjonalny odbiór przez rekruterów i CTO.
- Zielony akcent wymaga kontroli kontrastu; łatwo przesadzić z nasyceniem i obniżyć czytelność formularzy, badge'y i subtelnych metadanych.
- Monospace w nadmiarze może zepsuć odbiór treści dłuższych niż krótkie etykiety i nagłówki.
- Brak finalnych assetów logo i favicony nie blokuje implementacji, ale oznacza, że część detali marki pozostanie tymczasowa.
- Dopóki nie zostaną potwierdzone `content width`, `navbar height` i `scrim`, część decyzji layoutowych pozostaje na poziomie propozycji, nie finalnego standardu.
