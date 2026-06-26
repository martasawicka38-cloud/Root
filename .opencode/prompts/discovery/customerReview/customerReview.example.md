# Przykład użycia promptu `customerReview.md`

Poniżej znajduje się przykładowy rezultat, jaki AI powinno przygotować po rozmowie discovery z klientem.

## Przykładowy kontekst rozmowy z klientem

Klient: Ewa Nowak, właścicielka gabinetu fizjoterapii `Ruch bez bolu` w Gdańsku.

Najważniejsze informacje z rozmowy:

- klientka pozyskuje większość pacjentów przez polecenia, Instagram i telefon
- obecny proces zapisów jest ręczny, przez co część leadów przepada po godzinach pracy
- strona ma budować zaufanie, pokazać specjalizacje i umożliwić wysłanie zgłoszenia wizyty
- grupą docelową są dorośli pacjenci 25-55 lat z bólami kręgosłupa, urazami sportowymi i potrzebą rehabilitacji pooperacyjnej
- kluczowy cel biznesowy: minimum 20 poprawnych zgłoszeń miesięcznie z kanału online w ciągu 3 miesięcy od startu
- klientka chce ograniczyć liczbę telefonów z podstawowymi pytaniami o zakres usług i dostępność
- w MVP zakres obejmuje: stronę główną, opis usług, bio specjalistki, opinie, FAQ, formularz zgłoszenia wizyty, dane kontaktowe i politykę prywatności
- poza zakresem MVP są: płatności online, portal pacjenta, konto użytkownika i integracja z EDM
- wymagania niefunkcjonalne: mobile-first, szybkie ładowanie, formularz dostępny z klawiatury, zgodność z RODO, jasna komunikacja czasu odpowiedzi
- zgłoszenia mają trafiać do właścicielki w ustalonym kanale operacyjnym, a klient po wysłaniu ma dostać jednoznaczne potwierdzenie
- klientka nie ma jeszcze gotowej finalnej treści polityki prywatności i nie zdecydowała, czy w formularzu ma być wybór konkretnej godziny czy tylko preferowany przedział

---

## Przykładowy wynik działania promptu

Przykład jest ułożony w tym samym rytmie co pozostałe pliki `.example.md` w discovery: klasyfikacja, synteza, stan wiedzy, handoff do `REQUIREMENTS.md`, artefakty domenowe i ryzyka. W `customerReview` część artefaktowa schodzi dodatkowo do backlogu i user stories.

### 1. Executive Summary

Projekt dotyczy strony internetowej dla gabinetu fizjoterapii `Ruch bez bolu`, której głównym celem jest zamiana ruchu z poleceń i social media na uporządkowane zgłoszenia wizyt online. System ma jednocześnie odpowiadać na najczęstsze pytania pacjentów, budować wiarygodność specjalistki i zmniejszyć liczbę ręcznych kontaktów telefonicznych.

Zakres MVP obejmuje prezentację oferty, specjalizacji, opinii i danych kontaktowych oraz formularz zgłoszenia wizyty. Poza MVP pozostają płatności online, portal pacjenta i integracja z systemem medycznym. Krytyczne obszary jakościowe to mobile UX, czytelność oferty, zgodność z RODO i niezawodna obsługa zgłoszeń.

### 2. Project Profile / System Type / Criticality

- Project Profile: `Lite`
- System Type: `website with lead capture`
- Criticality: `medium`
- Uzasadnienie: projekt ma niski poziom złożoności architektonicznej i mało integracji, ale obsługuje dane osobowe oraz proces pozyskania pacjenta, więc wymaga formalnego podejścia do jakości i prywatności

### 3. Confirmed / Assumptions / Open Questions / Out of Scope

#### Confirmed

- celem biznesowym jest minimum 20 poprawnych zgłoszeń miesięcznie z kanału online
- główną grupą docelową są dorośli pacjenci 25-55 lat
- MVP obejmuje ofertę, bio, opinie, FAQ, kontakt i formularz zgłoszenia wizyty
- poza MVP są płatności online, portal pacjenta i integracja z EDM
- strona ma być mobile-first i zgodna z RODO
- po wysłaniu zgłoszenia użytkownik musi dostać jasne potwierdzenie

#### Assumptions

- gabinet obsługuje jeden główny punkt kontaktu operacyjnego na etapie MVP
- czas odpowiedzi na zgłoszenie nie powinien przekraczać jednego dnia roboczego
- formularz ma zbierać tylko dane niezbędne do pierwszego kontaktu i kwalifikacji zgłoszenia

#### Open Questions

- czy formularz ma przyjmować konkretną godzinę, czy tylko preferowany dzień i zakres czasowy
- kto dostarcza finalną treść polityki prywatności i klauzul zgód
- czy w MVP ma być wersja angielska strony
- czy gabinet chce przyjmować zgłoszenia wyłącznie lokalne, czy również online

#### Out of Scope

- płatności online
- konto pacjenta
- historia wizyt
- integracja z systemem EDM
- automatyczny kalendarz rezerwacji w czasie rzeczywistym

### 4. Handoff do `REQUIREMENTS.md`

#### Mapowanie sekcji

#### `## Klient`

- branża: gabinet fizjoterapii,
- cel strony: przechwytywanie i porządkowanie zgłoszeń wizyt online,
- grupa docelowa: dorośli pacjenci 25-55 lat z problemami bólowymi, urazami sportowymi i potrzebą rehabilitacji pooperacyjnej,
- kontekst biznesowy: ograniczenie liczby telefonów z podstawowymi pytaniami oraz zwiększenie liczby poprawnych zgłoszeń.

#### `## Sekcje strony`

- strona główna,
- opis usług i specjalizacji,
- bio specjalistki,
- opinie,
- FAQ,
- formularz zgłoszenia wizyty,
- kontakt,
- polityka prywatności.

#### `## Funkcjonalności`

- formularz zgłoszenia wizyty online,
- jasne potwierdzenie po wysłaniu formularza,
- prezentacja usług i problemów pacjenta w języku zrozumiałym dla odbiorcy,
- sekcje zaufania: bio, opinie, FAQ,
- zgodność z RODO i obsługa wymaganych zgód,
- uporządkowany kanał przekazywania leadów do właścicielki.

#### `## Routing`

- rekomendowany model: prosta strona marketingowa typu `Lite`, najprawdopodobniej z jedną główną trasą i osobną polityką prywatności,
- brak potrzeby konta użytkownika, panelu pacjenta i workflow wieloekranowego w MVP.

#### `## i18n`

- MVP: język polski,
- wersja angielska pozostaje `Open Question` i nie powinna być zakładana bez potwierdzenia.

#### `## Deployment`

- brak potwierdzonego środowiska docelowego w rozmowie,
- do uzupełnienia: hosting, domena, obsługa formularza i kanał operacyjny odbioru zgłoszeń.

#### `## Uwagi dodatkowe`

- mobile-first jest wymaganiem krytycznym,
- formularz musi być dostępny z klawiatury,
- trzeba jasno komunikować czas odpowiedzi,
- UX ma redukować niepewność pacjenta i ograniczać podstawowe pytania telefoniczne.

#### Dalszy handoff discovery

- `persona.md` — zalecany, bo obecna grupa docelowa jest szeroka i może wymagać rozdzielenia na bardziej precyzyjne segmenty, np. pacjent bólowy, pacjent sportowy, pacjent pooperacyjny.
- `visualIdentification.md` — zalecany, bo projekt ma budować zaufanie i spokój, ale rozmowa nie zawiera jeszcze operacyjnych decyzji o kolorach, typografii, stylu zdjęć i tokenach.

### 5. Artifact Plan

#### Obowiązkowe artefakty

- `REQUIREMENTS.md` jako executive summary
- discovery i scope dla potwierdzenia celu biznesowego, zakresu i ograniczeń
- backlog z epikami, features i osobnymi user stories
- quality gate z DoR, DoD i zasadami AC

#### Rozszerzenia dołączone świadomie

- `business-rules.md`, bo formularz i obsługa leadu mają reguły walidacyjne i operacyjne
- `security-and-privacy.md`, bo projekt przetwarza dane osobowe i musi być zgodny z RODO
- `test-scenarios.md`, bo krytyczny jest przepływ zgłoszenia wizyty

#### Artefakty pominięte świadomie

- pełny `00-governance`, bo projekt nie wymaga osobnej warstwy zarządczej i wielozespołowej
- `03-domain/process-flows.md` i `roles-and-permissions.md`, bo w MVP nie ma złożonych ról ani rozbudowanego workflow
- `06-delivery/release-plan.md`, bo zakres MVP jest mały i wdrażany w jednym strumieniu

### 6. Lista Epiców

| Epic ID | Nazwa                              | Cel biznesowy                                                           | KPI / Success Metric                                             | Priorytet | Owner         |
| ------- | ---------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------- | --------- | ------------- |
| EP-001  | Pozyskanie i kwalifikacja pacjenta | Ułatwić nowemu pacjentowi ocenę, czy gabinet odpowiada na jego potrzebę | Współczynnik przejścia z hero lub oferty do CTA powyżej 5%       | Must      | Product Owner |
| EP-002  | Zgłoszenie wizyty online           | Umożliwić wysłanie kompletnego zgłoszenia bez telefonu                  | Minimum 20 poprawnych zgłoszeń miesięcznie                       | Must      | Product Owner |
| EP-003  | Wiarygodność i zgodność            | Zwiększyć zaufanie i ograniczyć ryzyka prawne                           | Spadek pytań podstawowych oraz brak zgłoszeń bez wymaganych zgód | Must      | Product Owner |

### 7. Lista Features

| Feature ID | Epic ID | Nazwa                                              | Wartość biznesowa                                      | Zależności                       | Release |
| ---------- | ------- | -------------------------------------------------- | ------------------------------------------------------ | -------------------------------- | ------- |
| FEAT-001   | EP-001  | Prezentacja specjalizacji i problemów pacjenta     | Pacjent szybciej rozumie, czy gabinet może mu pomóc    | Content od klientki              | MVP     |
| FEAT-002   | EP-003  | Sekcja zaufania: bio, opinie, FAQ                  | Zmniejsza niepewność i liczbę pytań telefonicznych     | Opinie, materiały o specjalistce | MVP     |
| FEAT-003   | EP-002  | Formularz zgłoszenia wizyty                        | Pozwala przechwycić lead poza godzinami pracy          | Zgody, proces obsługi leadu      | MVP     |
| FEAT-004   | EP-002  | Obsługa zgłoszenia przez recepcję lub właścicielkę | Umożliwia szybki kontakt zwrotny i porządek operacyjny | Ustalony kanał odbioru zgłoszeń  | MVP     |
| FEAT-005   | EP-003  | Polityka prywatności i zgody                       | Ogranicza ryzyko prawne i porządkuje dane osobowe      | Finalna treść prawna             | MVP     |

### 8. Proponowana struktura katalogów

```text
REQUIREMENTS.md
docs/product/
	README.md
	01-discovery/
		interview-summary.md
		assumptions-and-open-questions.md
	02-scope/
		business-goals.md
		scope-in-out.md
		constraints.md
		non-functional-requirements.md
		business-rules.md
	04-backlog/
		epics.md
		features.md
		story-map.md
		backlog-priority.md
		user-stories/
			US-001-patient-can-assess-service-fit.md
			US-002-patient-can-submit-visit-request.md
			US-003-staff-can-receive-structured-request.md
	05-quality/
		definition-of-ready.md
		definition-of-done.md
		acceptance-criteria-rules.md
		test-scenarios.md
	07-compliance/
		security-and-privacy.md
```

### 9. Lista plików do utworzenia lub aktualizacji

- `REQUIREMENTS.md`
- `docs/product/README.md`
- `docs/product/01-discovery/interview-summary.md`
- `docs/product/01-discovery/assumptions-and-open-questions.md`
- `docs/product/02-scope/business-goals.md`
- `docs/product/02-scope/scope-in-out.md`
- `docs/product/02-scope/constraints.md`
- `docs/product/02-scope/non-functional-requirements.md`
- `docs/product/02-scope/business-rules.md`
- `docs/product/04-backlog/epics.md`
- `docs/product/04-backlog/features.md`
- `docs/product/04-backlog/story-map.md`
- `docs/product/04-backlog/backlog-priority.md`
- `docs/product/04-backlog/user-stories/US-001-patient-can-assess-service-fit.md`
- `docs/product/04-backlog/user-stories/US-002-patient-can-submit-visit-request.md`
- `docs/product/04-backlog/user-stories/US-003-staff-can-receive-structured-request.md`
- `docs/product/05-quality/definition-of-ready.md`
- `docs/product/05-quality/definition-of-done.md`
- `docs/product/05-quality/acceptance-criteria-rules.md`
- `docs/product/05-quality/test-scenarios.md`
- `docs/product/07-compliance/security-and-privacy.md`

### 10. User Stories

#### `docs/product/04-backlog/user-stories/US-001-patient-can-assess-service-fit.md`

```md
---
id: US-001
artifact_type: story
status: draft
epic_id: EP-001
feature_id: FEAT-001
persona: Potencjalny pacjent
priority: Must
story_points: 3
dependencies: []
compliance: []
nfr_tags: [mobile, accessibility, content]
source: client-interview
last_updated: 2026-05-13
---

# US-001 — Pacjent ocenia dopasowanie uslugi

## User Story

Jako potencjalny pacjent
Chce szybko sprawdzic, czy gabinet zajmuje sie moim problemem zdrowotnym
Aby zdecydowac, czy warto wyslac zgloszenie wizyty

## Kontekst biznesowy

- Epic: EP-001
- Feature: FEAT-001
- Cel biznesowy: zwiekszyc odsetek osob przechodzacych z wejscia na strone do kontaktu
- Wskaznik sukcesu: co najmniej 5% odwiedzajacych przechodzi do CTA kontaktowego lub formularza

## Acceptance Criteria

### AC-1

Given uzytkownik trafia na strone gabinetu
When przeglada sekcje oferty lub specjalizacji
Then widzi jasny podzial problemow i uslug opisanych jezykiem zrozumialym dla pacjenta

### AC-2

Given uzytkownik rozpoznaje swoj problem w ofercie
When otwiera szczegoly uslugi
Then otrzymuje jasna informacje, dla kogo jest usluga oraz widoczny kolejny krok prowadzacy do kontaktu

### AC-3 — scenariusz negatywny lub edge case

Given uzytkownik nie znajduje swojego przypadku w ofercie
When konczy przeglad strony
Then dostaje jasna alternatywe w postaci kontaktu ogolnego zamiast mylacej obietnicy dopasowania

## Definition of Ready

- [ ] wartosc biznesowa jest jasna
- [ ] story jest niezalezne lub zaleznosci sa jawne
- [ ] story miesci sie w jednym sprincie
- [ ] acceptance criteria sa gotowe
- [ ] dane, integracje i role sa zrozumiale
- [ ] brak krytycznych niewiadomych blokujacych implementacje

## Definition of Done

- [ ] acceptance criteria zostaly spelnione
- [ ] testy jednostkowe i integracyjne przeszly
- [ ] code review zostalo zakonczone
- [ ] dokumentacja zostala zaktualizowana
- [ ] Product Owner zaakceptowal rezultat

## Zaleznosci

- content o specjalizacjach dostarczony przez klientke

## Ryzyka

- zbyt ogolne opisy uslug beda nadal generowac telefony z podstawowymi pytaniami

## Open Questions

- czy gabinet chce komunikowac wykluczenia, czyli przypadki nieobslugiwane w MVP

## Notatki i zalozenia

- tresc oferty ma byc pisana jezykiem pacjenta, nie jezykiem medycznego slangu
```

#### `docs/product/04-backlog/user-stories/US-002-patient-can-submit-visit-request.md`

```md
---
id: US-002
artifact_type: story
status: draft
epic_id: EP-002
feature_id: FEAT-003
persona: Potencjalny pacjent
priority: Must
story_points: 5
dependencies: [FEAT-005]
compliance: [RODO]
nfr_tags: [mobile, accessibility, form-validation]
source: client-interview
last_updated: 2026-05-13
---

# US-002 — Pacjent wysyla zgloszenie wizyty

## User Story

Jako potencjalny pacjent
Chce wyslac zgloszenie wizyty online bez wykonywania telefonu
Aby skontaktowac sie z gabinetem rowniez po godzinach pracy

## Kontekst biznesowy

- Epic: EP-002
- Feature: FEAT-003
- Cel biznesowy: przechwycic leady, ktore dzisiaj przepadaja poza godzinami pracy
- Wskaznik sukcesu: minimum 20 poprawnych zgloszen miesiecznie z formularza

## Acceptance Criteria

### AC-1

Given pacjent chce umowic pierwsza konsultacje
When wypelnia formularz zgloszenia
Then moze podac niezbedne dane kontaktowe, krotki opis problemu oraz preferowany termin kontaktu lub wizyty

### AC-2

Given pacjent poprawnie wypelnil formularz i zaakceptowal wymagana zgode
When wysyla zgloszenie
Then otrzymuje jednoznaczne potwierdzenie przyjecia z informacja o przewidywanym czasie odpowiedzi

### AC-3 — scenariusz negatywny lub edge case

Given pacjent nie uzupelnil wymaganych pol albo nie zaakceptowal wymaganej zgody
When probuje wyslac formularz
Then zgloszenie nie zostaje przyjete, a uzytkownik dostaje jasna informacje co musi poprawic

## Definition of Ready

- [ ] wartosc biznesowa jest jasna
- [ ] story jest niezalezne lub zaleznosci sa jawne
- [ ] story miesci sie w jednym sprincie
- [ ] acceptance criteria sa gotowe
- [ ] dane, integracje i role sa zrozumiale
- [ ] brak krytycznych niewiadomych blokujacych implementacje

## Definition of Done

- [ ] acceptance criteria zostaly spelnione
- [ ] testy jednostkowe i integracyjne przeszly
- [ ] code review zostalo zakonczone
- [ ] dokumentacja zostala zaktualizowana
- [ ] Product Owner zaakceptowal rezultat

## Zaleznosci

- finalna tresc zgody i polityki prywatnosci
- ustalony proces obslugi leadu po stronie gabinetu

## Ryzyka

- zbyt dlugi formularz obnizy konwersje na mobile
- brak deklarowanego czasu odpowiedzi oslabii zaufanie uzytkownika

## Open Questions

- czy preferowany termin ma byc wybierany jako dzien, przedzial czasowy czy konkretna godzina

## Notatki i zalozenia

- formularz ma zbierac minimum danych potrzebnych do pierwszego kontaktu i kwalifikacji zgloszenia
```

#### `docs/product/04-backlog/user-stories/US-003-staff-can-receive-structured-request.md`

```md
---
id: US-003
artifact_type: story
status: draft
epic_id: EP-002
feature_id: FEAT-004
persona: Wlascicielka gabinetu
priority: Must
story_points: 3
dependencies: [US-002]
compliance: [RODO]
nfr_tags: [operational-readiness, reliability]
source: client-interview
last_updated: 2026-05-13
---

# US-003 — Zespol odbiera kompletne zgloszenie

## User Story

Jako wlascicielka gabinetu
Chce otrzymywac kompletne i uporzadkowane zgloszenia od pacjentow
Aby moc szybko oddzwonic lub odpisac bez recznego zbierania podstawowych danych

## Kontekst biznesowy

- Epic: EP-002
- Feature: FEAT-004
- Cel biznesowy: skrocic czas obslugi nowego leadu i ograniczyc utrate zgloszen
- Wskaznik sukcesu: 100% poprawnych zgloszen trafia do ustalonego kanalu operacyjnego z kompletem danych wymaganych w MVP

## Acceptance Criteria

### AC-1

Given pacjent poprawnie wyslal formularz
When zgloszenie zostaje przyjete przez system procesu biznesowego
Then wlascicielka gabinetu otrzymuje komplet informacji potrzebnych do pierwszego kontaktu z pacjentem

### AC-2

Given zgoda na kontakt i przetwarzanie danych jest wymagana
When wlascicielka otwiera nowe zgloszenie
Then widzi, ze zgloszenie zawiera potwierdzenie wymaganej zgody oraz kontekst sprawy pacjenta

### AC-3 — scenariusz negatywny lub edge case

Given zgloszenie nie moze zostac przekazane do ustalonego kanalu obslugi
When wystapi blad procesu
Then organizacja ma jasno zdefiniowany stan bledu do dalszej obslugi, a zgloszenie nie znika bez sladu

## Definition of Ready

- [ ] wartosc biznesowa jest jasna
- [ ] story jest niezalezne lub zaleznosci sa jawne
- [ ] story miesci sie w jednym sprincie
- [ ] acceptance criteria sa gotowe
- [ ] dane, integracje i role sa zrozumiale
- [ ] brak krytycznych niewiadomych blokujacych implementacje

## Definition of Done

- [ ] acceptance criteria zostaly spelnione
- [ ] testy jednostkowe i integracyjne przeszly
- [ ] code review zostalo zakonczone
- [ ] dokumentacja zostala zaktualizowana
- [ ] Product Owner zaakceptowal rezultat

## Zaleznosci

- ustalony kanal odbioru zgloszen
- zdefiniowany proces odpowiedzi na lead po stronie klientki

## Ryzyka

- brak uzgodnionego SLA odpowiedzi utrudni domkniecie procesu operacyjnego

## Open Questions

- kto odbiera zgloszenia podczas urlopu lub nieobecnosci wlascicielki

## Notatki i zalozenia

- zakres MVP obejmuje obsluge pierwszego kontaktu, ale nie obejmuje pelnego workflow medycznego
```

### 11. Ryzyka i zależności

#### Ryzyka

- brak finalnej polityki prywatnosci moze zablokowac wdrozenie formularza
- niejasny proces po stronie klientki po otrzymaniu zgloszenia obnizy wartosc biznesowa formularza
- zbyt szeroki zakres tresci oferty bez priorytetyzacji spowolni przygotowanie MVP
- jesli strona nie bedzie czytelna na mobile, glowny kanal leadowy nie osiagnie celu

#### Zależności

- klientka musi dostarczyc opisy uslug, bio, opinie i tresci prawne
- trzeba ustalic docelowy kanal odbioru zgloszen
- potrzebna jest decyzja, czy MVP obejmuje tylko jezyk polski
- wymagany jest uzgodniony komunikat o przewidywanym czasie odpowiedzi
