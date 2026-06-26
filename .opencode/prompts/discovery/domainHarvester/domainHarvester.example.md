# Przykład użycia promptu `domainHarvester.md`

Poniżej znajduje się przykładowy rezultat, jaki AI powinno przygotować po zakończonym discovery klienta, gdy zespół musi pogłębić zrozumienie branży przed pisaniem user stories.

## Przykładowy kontekst po wcześniejszym discovery

Ten przykład jest świadomą kontynuacją projektu z `customerReview.example.md`.

Klient: Ewa Nowak, właścicielka prywatnego gabinetu fizjoterapii `Ruch bez bólu` w Gdańsku.

Najważniejsze informacje z wcześniejszego discovery:

- klientka pozyskuje większość pacjentów przez polecenia, Instagram i telefon,
- obecny proces zapisów jest ręczny, przez co część leadów przepada po godzinach pracy,
- celem strony jest budowanie zaufania, pokazywanie specjalizacji i zbieranie uporządkowanych zgłoszeń wizyt,
- grupą docelową są dorośli pacjenci 25-55 lat z bólami kręgosłupa, urazami sportowymi i potrzebą rehabilitacji pooperacyjnej,
- kluczowy cel biznesowy to minimum 20 poprawnych zgłoszeń miesięcznie z kanału online w ciągu 3 miesięcy od startu,
- MVP obejmuje stronę główną, opis usług, bio specjalistki, opinie, FAQ, formularz zgłoszenia wizyty, dane kontaktowe i politykę prywatności,
- poza zakresem MVP pozostają płatności online, portal pacjenta, konto użytkownika i integracja z EDM,
- wymagania niefunkcjonalne to mobile-first, szybkie ładowanie, dostępność formularza z klawiatury, zgodność z RODO i jasna komunikacja czasu odpowiedzi,
- zgłoszenia mają trafiać do właścicielki w ustalonym kanale operacyjnym, a pacjent po wysłaniu ma dostać jednoznaczne potwierdzenie,
- klientka nie ma jeszcze gotowej finalnej treści polityki prywatności i nie zdecydowała, czy formularz ma zbierać konkretny termin wizyty, czy tylko preferowany przedział.

Priorytetowe pytania badawcze do domain researchu:

- jak wygląda typowy proces od pierwszego kontaktu pacjenta do pierwszej wizyty w prywatnym gabinecie fizjoterapii,
- jakie informacje są realnie potrzebne do wstępnej kwalifikacji pacjenta, a jakie byłoby ryzykowne zbierać już na stronie,
- jakie są typowe red flags, sytuacje pilne i przypadki, których nie powinno się prowadzić przez zwykły formularz,
- jakie reguły operacyjne są krytyczne przy odwołaniach wizyt, braku odpowiedzi i no-show,
- jakie ograniczenia regulacyjne i prywatności mają znaczenie w Polsce i UE dla takiego przepływu.

Rynek / region: Polska, z uwzględnieniem wymagań UE dotyczących ochrony danych.

---

## Przykładowy wynik działania promptu

Przykład jest ułożony w tym samym rytmie co pozostałe pliki `.example.md` w discovery: klasyfikacja, synteza, stan wiedzy, handoff do `REQUIREMENTS.md`, artefakty domenowe i ryzyka. W `domainHarvester` część artefaktowa schodzi głębiej w proces domenowy, reguły biznesowe, edge case'y i punkty, które powinny później trafić do user stories oraz acceptance criteria.

### 1. Klasyfikacja researchu domenowego

- `Research Profile`: `Product`
- `Confidence Level`: `średni`
- `Jurisdiction Scope`: `Polska + UE (RODO); bez szczegółowej analizy rozliczeń publicznych i NFZ`
- `Client Position in Domain`: `prywatny gabinet fizjoterapii ambulatoryjnej; etap pozyskania pacjenta, wstępnej kwalifikacji, umawiania pierwszej wizyty i obsługi kontaktu przed świadczeniem`
- `Why this depth`: `zakres wdrożenia wygląda jak prosty website with lead capture, ale domena dotyka danych zdrowotnych, kwalifikacji pacjenta, odpowiedzialności zawodowej, komunikacji o stanach pilnych i operacyjnego ryzyka no-show. Bez researchu domenowego user stories byłyby zbyt płaskie i mogłyby traktować formularz jak zwykły kontakt marketingowy.`

### 2. Executive Summary

Domena prywatnej fizjoterapii ambulatoryjnej nie kończy się na samym pozyskaniu leada. Już na etapie pierwszego kontaktu istnieją decyzje domenowe: czy problem pacjenta mieści się w zakresie usługi, czy występują czerwone flagi wymagające innej ścieżki, ile danych wolno i warto zebrać, kto odpowiada za kontakt zwrotny i jak szybko powinien nastąpić. Dla klientki krytyczny jest nie tylko wzrost liczby zgłoszeń, ale także poprawne odsianie zgłoszeń niewłaściwych, zmniejszenie chaosu komunikacyjnego i niebudowanie fałszywego wrażenia, że formularz zastępuje konsultację medyczną.

Z perspektywy produktu najważniejsze procesy to: pozyskanie zgłoszenia, wstępna kwalifikacja do pierwszej wizyty, rozróżnienie pierwszej wizyty od kontynuacji terapii, obsługa odwołań i braków kontaktu oraz bezpieczna komunikacja o danych i czasie odpowiedzi. Największym ryzykiem backlogowym jest potraktowanie przepływu jako zwykłego formularza leadowego bez jawnych reguł triage, bez rozróżnienia stanów pacjenta i bez ograniczeń co do danych zdrowotnych.

### 3. Confirmed / Research-Backed Findings / Assumptions / Open Questions / Missing Evidence

#### Confirmed

- klientka prowadzi prywatny gabinet fizjoterapii i chce pozyskiwać uporządkowane zgłoszenia online,
- główny kanał operacyjny po stronie gabinetu jest nadal ręczny,
- MVP nie obejmuje płatności online, portalu pacjenta ani integracji z EDM,
- wymagane są mobile-first, zgodność z RODO i jednoznaczne potwierdzenie wysłania formularza,
- zespół chce ograniczyć liczbę telefonów z podstawowymi pytaniami i jednocześnie nie gubić leadów po godzinach pracy.

#### Research-Backed Findings

- w prywatnej fizjoterapii pierwsza interakcja zwykle nie służy jeszcze diagnozie, tylko ocenie dopasowania problemu pacjenta do zakresu pomocy i ustaleniu kolejnego kroku,
- typowy proces dla nowego pacjenta obejmuje: zgłoszenie problemu, wstępną kwalifikację, kontakt zwrotny, ustalenie terminu, pierwszą wizytę i dopiero potem plan terapii lub decyzję o przekierowaniu,
- domena jest wrażliwa na red flags, czyli objawy sugerujące, że pacjent powinien trafić do lekarza, SOR albo innego specjalisty zamiast do zwykłej fizjoterapii ambulatoryjnej,
- dla małych prywatnych gabinetów częstym problemem operacyjnym nie jest brak leadów, ale zła jakość zgłoszeń, duplikaty z wielu kanałów, no-show i brak spójnej polityki odpowiedzi,
- na etapie strony i formularza warto minimalizować zakres danych zdrowotnych; zbyt szeroki opis objawów w otwartym polu tekstowym zwiększa ryzyko prywatności i chaos analityczny,
- w praktyce rozróżnienie `pierwsza wizyta` vs `kontynuacja terapii` zmienia oczekiwany zestaw danych, czas wizyty i sposób obsługi zgłoszenia,
- w komunikacji cyfrowej gabinety zyskują, gdy jasno ustawiają oczekiwania: kiedy odpowiadają, czego formularz nie zastępuje i w jakich przypadkach pacjent nie powinien czekać na odpowiedź z formularza.

#### Assumptions

- gabinet obsługuje jedną główną specjalistkę i nie ma osobnej recepcji pracującej zmianowo,
- formularz w MVP ma wspierać ręczne umawianie wizyt, a nie automatyczne self-booking,
- klientka nie chce zbierać pełnej historii zdrowotnej ani dokumentacji medycznej na stronie,
- większość zgłoszeń dotyczy pierwszej wizyty lub pojedynczego zapytania o możliwość terapii,
- pacjenci zagraniczni nie są krytycznym segmentem MVP, więc język polski pozostaje domyślny.

#### Open Questions

- czy gabinet przyjmuje osoby niepełnoletnie i czy w formularzu trzeba uwzględnić opiekuna prawnego,
- czy klientka prowadzi tylko terapię stacjonarną, czy również konsultacje online,
- czy są typy usług wymagające skierowania, wcześniejszej dokumentacji albo dodatkowych pytań kwalifikacyjnych,
- jak wygląda realna polityka anulowania wizyt i czy no-show generuje koszt dla gabinetu,
- czy pacjent po pierwszej wizycie ma być dalej obsługiwany tym samym formularzem, czy inną ścieżką,
- czy gabinet planuje później integrację z kalendarzem, CRM albo systemem medycznym.

#### Missing Evidence

- brak opisanej przez klientkę rzeczywistej procedury weryfikacji zgłoszeń przed pierwszą wizytą,
- brak danych, jaki odsetek obecnych telefonów kończy się odrzuceniem pacjenta z powodów poza zakresem usługi,
- brak legal review potwierdzającego, jakie dokładnie dane zdrowotne klientka chce i może zbierać na etapie online,
- brak polityki retencji dla zgłoszeń odrzuconych, niekompletnych albo zdublowanych,
- brak danych o sezonowości popytu, no-show i najczęstszych powodach odwołań.

### 4. Szybki kontekst domeny i pozycja klienta

Z perspektywy użytkownika końcowego domena fizjoterapii ambulatoryjnej służy temu, żeby pacjent z bólem, ograniczeniem ruchu albo potrzebą rehabilitacji znalazł właściwą pomoc, został poprawnie zakwalifikowany do rodzaju świadczenia i bezpiecznie przeprowadzony przez pierwszą fazę kontaktu oraz leczenia ruchem. To domena, w której bardzo szybko krzyżują się trzy poziomy: zaufanie marketingowe, decyzja operacyjna o przyjęciu pacjenta i odpowiedzialność zawodowa związana z bezpieczeństwem.

Klientka pozycjonuje się w tym fragmencie domeny, który łączy pozyskanie pacjenta z kwalifikacją do pierwszej wizyty. Nie buduje na razie pełnego systemu medycznego; potrzebuje strony i formularza, które poprawią jakość wejścia do procesu. Dlatego in scope są: komunikacja oferty, warunki pierwszego kontaktu, wstępna kwalifikacja, obsługa zgłoszenia, informacja o czasie odpowiedzi i podstawowe granice bezpieczeństwa. Poza bieżącym zakresem pozostają: dokumentacja medyczna, plan terapii, rozliczenia, rozbudowane zarządzanie grafikiem, konto pacjenta i przebieg terapii po pierwszej wizycie.

### 5. Struktura domeny i ekosystem

#### Aktorzy, role i odpowiedzialności

| Aktor                               | Rola w domenie              | Kluczowa odpowiedzialność                                                    | Wpływ na projekt                                                  |
| ----------------------------------- | --------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Pacjent nowy                        | zgłaszający problem         | przekazuje podstawowy kontekst, oczekuje szybkiej oceny następnego kroku     | formularz musi być prosty, nie może wymagać wiedzy medycznej      |
| Pacjent powracający                 | kontynuacja terapii         | chce sprawnie ustalić dalszy termin lub przekazać zmianę planu               | warto rozróżnić jego ścieżkę od pierwszej wizyty                  |
| Fizjoterapeutka                     | specjalistka i właścicielka | ocenia dopasowanie zgłoszenia, oddzwania, prowadzi wizytę                    | system musi wspierać ręczną kwalifikację i szybki kontakt         |
| Recepcja / asystent administracyjny | opcjonalna rola operacyjna  | odbiera zgłoszenia, doprecyzowuje dane, ustala termin                        | jeśli pojawi się później, potrzebne będą role i odpowiedzialności |
| Lekarz / inny specjalista           | zewnętrzny partner domenowy | przejmuje pacjenta, gdy problem wykracza poza bezpieczny zakres fizjoterapii | trzeba komunikować granice usługi i red flags                     |
| Opiekun prawny                      | rola warunkowa              | reprezentuje pacjenta niepełnoletniego lub zależnego                         | wpływa na pola formularza i zgody                                 |

#### Obiekty domenowe, dane i dokumenty

- `Visit Request` — podstawowe zgłoszenie online zawierające dane kontaktowe, kontekst problemu i preferencję kontaktu lub terminu,
- `Patient Contact Record` — minimalny rekord operacyjny potrzebny do kontaktu zwrotnego,
- `Reason for Visit` — kategoria problemu zgłaszanego przez pacjenta, np. ból kręgosłupa, uraz sportowy, rehabilitacja pooperacyjna,
- `Triage Flag` — oznaczenie, że zgłoszenie wymaga pilniejszej reakcji albo nie mieści się w standardowej ścieżce,
- `Consent Record` — ślad zgody i informacji prywatności związanej z formularzem,
- `Appointment Proposal` — ustalony lub proponowany termin pierwszej wizyty,
- `Cancellation / No-show Event` — zdarzenie operacyjne ważne dla późniejszych procesów i polityk,
- `Referral / Medical Context` — opcjonalna informacja o skierowaniu, zabiegu, dokumentacji albo zaleceniu lekarza.

#### Słownik kluczowych pojęć

- `Pierwsza wizyta` — pierwszy kontakt terapeutyczny wymagający szerszego wywiadu i oceny,
- `Kontynuacja terapii` — kolejna wizyta po wcześniejszym rozpoznaniu sytuacji pacjenta przez gabinet,
- `Red flags` — objawy lub okoliczności sugerujące, że pacjent powinien skorzystać z innej ścieżki niż standardowa fizjoterapia ambulatoryjna,
- `No-show` — niepojawienie się pacjenta na ustalonym terminie bez skutecznego odwołania,
- `Triage` — wstępna kwalifikacja zgłoszenia do właściwego rodzaju reakcji.

#### Przepływy danych i granice systemu

- strona zbiera dane wejściowe od pacjenta i przekazuje je do kanału operacyjnego gabinetu,
- gabinet przetwarza tylko dane potrzebne do oddzwonienia, oceny dopasowania i ustalenia kolejnego kroku,
- część decyzji pozostaje poza systemem strony: ocena kliniczna, szczegółowy wywiad, dokumentacja świadczenia,
- granica systemu MVP kończy się na potwierdzeniu przyjęcia zgłoszenia i przekazaniu go do dalszej ręcznej obsługi,
- jeśli później dojdzie kalendarz lub CRM, pojawi się dodatkowa odpowiedzialność za synchronizację statusów zgłoszeń.

#### Integracje zewnętrzne i zależności operacyjne

- telefon jako główny kanał kontaktu zwrotnego,
- e-mail jako kanał powiadomienia operacyjnego lub potwierdzenia,
- opcjonalnie kalendarz gabinetu używany ręcznie poza stroną,
- polityka prywatności i treści zgód jako zależność prawna,
- przyszłe integracje możliwe, ale niepotwierdzone: CRM, prosty system rezerwacji, system EDM.

### 6. Typowe scenariusze, warianty i krytyczne punkty procesu

#### Scenariusz 1 — Nowy pacjent zgłasza problem i prosi o pierwszą wizytę

- `Cel procesu`: przechwycić poprawne zgłoszenie i przekazać je do bezpiecznej, ręcznej kwalifikacji,
- `Przebieg krok po kroku`:
  1. pacjent trafia na stronę z kanału polecenia, social media albo Google,
  2. ocenia, czy gabinet zajmuje się jego problemem,
  3. wypełnia formularz z minimalnym zestawem danych,
  4. system wyświetla potwierdzenie i czas odpowiedzi,
  5. fizjoterapeutka analizuje zgłoszenie i kontaktuje się z pacjentem,
  6. ustalany jest termin albo pacjent dostaje informację, że potrzebna jest inna ścieżka,
- `Główne decyzje i walidacje`: czy problem mieści się w zakresie usługi; czy dane kontaktowe są kompletne; czy opis nie zawiera sygnałów wymagających innej reakcji,
- `Warianty operacyjne`: pacjent prosi tylko o informację; pacjent chce jak najszybciej termin; pacjent pozostawia zbyt ogólny opis i wymaga doprecyzowania telefonicznego,
- `KPI / SLA`: czas odpowiedzi do 1 dnia roboczego; udział poprawnych zgłoszeń do wszystkich zgłoszeń; współczynnik zamiany zgłoszeń na realne wizyty,
- `Implikacja dla projektu`: formularz i treści strony muszą ustawiać oczekiwania co do czasu odpowiedzi, zakresu pomocy i tego, że zgłoszenie nie zastępuje diagnozy.

#### Scenariusz 2 — Pacjent zgłasza objawy, które mogą wymagać pilniejszej albo innej ścieżki

- `Cel procesu`: nie dopuścić, by formularz był interpretowany jako kanał dla sytuacji nagłych,
- `Przebieg krok po kroku`:
  1. pacjent czyta ofertę i formularz,
  2. opisuje problem, który może zawierać czerwone flagi,
  3. system lub treść formularza pokazuje ograniczenie zakresu i zalecenie innej ścieżki,
  4. zgłoszenie nadal może zostać wysłane, ale musi zostać oznaczone do szczególnej uwagi albo ograniczone,
  5. gabinet reaguje zgodnie z polityką odpowiedzialności,
- `Główne decyzje i walidacje`: czy komunikat ostrzegawczy jest wystarczająco jasny; czy pacjent nie jest zachęcany do czekania na odpowiedź online,
- `Warianty operacyjne`: pacjent rezygnuje i wybiera inną ścieżkę; pacjent wysyła zgłoszenie mimo ostrzeżenia; zgłoszenie przychodzi po godzinach,
- `KPI / SLA`: brak fałszywych obietnic co do czasu reakcji w stanach pilnych; pełna widoczność takich zgłoszeń w kanale operacyjnym,
- `Implikacja dla projektu`: potrzebne są komunikaty bezpieczeństwa, edge case'y do AC i jasne rozdzielenie między informacją marketingową a odpowiedzialnością kliniczną.

#### Scenariusz 3 — Pacjent powracający chce kontynuować terapię lub zmienić termin

- `Cel procesu`: obsłużyć prostszy wariant zgłoszenia bez przeciążania go pytaniami właściwymi dla pierwszej wizyty,
- `Przebieg krok po kroku`:
  1. pacjent powracający wraca na stronę lub kontaktuje się z gabinetem,
  2. wybiera ścieżkę kontynuacji albo sygnalizuje, że był już wcześniej,
  3. gabinet szybciej ocenia kontekst i proponuje termin,
  4. jeśli pacjent wraca po długiej przerwie lub z nowym problemem, ścieżka zmienia się z powrotem na pierwszą wizytę,
- `Główne decyzje i walidacje`: czy pacjent rzeczywiście jest już znany; czy kontynuacja dotyczy tego samego problemu; czy nie wymaga ponownej kwalifikacji,
- `Warianty operacyjne`: ciąg dalszy tego samego planu terapii; nowy epizod bólowy; powrót po wielu miesiącach,
- `KPI / SLA`: krótszy czas obsługi zgłoszenia powracającego; mniejsza liczba niepotrzebnych telefonów wyjaśniających,
- `Implikacja dla projektu`: nawet w prostym MVP warto przewidzieć co najmniej rozróżnienie `pierwsza wizyta / kontynuacja` lub uczynić to jawnym pytaniem w formularzu.

#### Scenariusz 4 — Pacjent odwołuje wizytę albo nie pojawia się

- `Cel procesu`: ograniczyć straty czasu i chaos w grafiku,
- `Przebieg krok po kroku`:
  1. termin zostaje ustalony poza stroną,
  2. pacjent próbuje odwołać lub przełożyć wizytę,
  3. gabinet potrzebuje jasnej polityki kontaktu i reakcji,
  4. zdarzenie jest odnotowane operacyjnie,
  5. wolny slot może zostać wykorzystany inaczej albo pozostaje stratą,
- `Główne decyzje i walidacje`: do kiedy można odwołać; który kanał jest akceptowany; kto odpowiada za aktualizację kalendarza,
- `Warianty operacyjne`: odwołanie z wyprzedzeniem; brak odpowiedzi pacjenta na potwierdzenie; no-show bez uprzedzenia,
- `KPI / SLA`: odsetek no-show; czas zwolnienia slotu przed wizytą; liczba wizyt utraconych przez błędy komunikacyjne,
- `Implikacja dla projektu`: nawet jeśli polityka odwołań nie jest jeszcze częścią UI, trzeba ją opisać w `Open Questions` i uwzględnić w artefaktach domenowych.

#### Scenariusz 5 — Zgłoszenie wpływa po godzinach pracy lub w weekend

- `Cel procesu`: nie tracić leadów przy jednoczesnym nieobiecywaniu natychmiastowej odpowiedzi,
- `Przebieg krok po kroku`:
  1. pacjent wysyła formularz poza godzinami pracy,
  2. system pokazuje potwierdzenie z realnym czasem odpowiedzi,
  3. zgłoszenie czeka w kanale operacyjnym,
  4. właścicielka odpowiada w kolejnym oknie pracy,
- `Główne decyzje i walidacje`: czy komunikat po wysyłce jasno rozróżnia dzień roboczy od czasu wolnego; czy zgłoszenie nie ginie w e-mailu,
- `Warianty operacyjne`: piątek wieczór; długi weekend; kilka zgłoszeń jednocześnie po kampanii,
- `KPI / SLA`: brak utraconych zgłoszeń; zgodność rzeczywistego czasu odpowiedzi z komunikowanym SLA,
- `Implikacja dla projektu`: success message i operacyjny routing zgłoszeń są równie ważne jak sam formularz.

### 7. Edge case'y i failure modes

#### Dane

| Etykieta                    | Warunki zajścia                                                      | Skutek                                          | Ryzyko dla backlogu albo produktu                | Ogólna strategia obsługi                                                              |
| --------------------------- | -------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Niepełne dane kontaktowe    | pacjent wpisuje błędny numer lub literówkę w e-mailu                 | gabinet nie może oddzwonić                      | fałszywie niska jakość leadów i utrata konwersji | walidacja formatu, komunikaty błędów, wymagany co najmniej jeden pewny kanał kontaktu |
| Zbyt szeroki opis zdrowotny | pacjent opisuje bardzo szczegółową historię medyczną w polu otwartym | wzrost ryzyka prywatności i trudniejsza obsługa | formularz zbiera więcej danych niż potrzeba      | ograniczenie pola, guidance copy, minimalizacja danych                                |
| Duplikat pacjenta           | pacjent wysyła formularz i dzwoni równolegle                         | dwie równoległe ścieżki obsługi                 | chaos operacyjny i błędne metryki                | jedno źródło statusu zgłoszenia lub procedura scalania ręcznego                       |

#### Użytkownik

| Etykieta                         | Warunki zajścia                                      | Skutek                                                        | Ryzyko dla backlogu albo produktu       | Ogólna strategia obsługi                                       |
| -------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------- |
| Pacjent oczekuje diagnozy online | formularz jest zbyt otwarty i sugeruje poradę zdalną | rozczarowanie lub ryzyko błędnych oczekiwań                   | niebezpieczne obietnice w copy i AC     | jasne ograniczenia komunikacji, brak obietnicy diagnozy        |
| Pacjent niepełnoletni            | zgłoszenie dotyczy dziecka lub nastolatka            | potrzebny opiekun i dodatkowe reguły zgody                    | brak obsługi tej ścieżki w user stories | dodać pytanie kwalifikacyjne lub oznaczyć jako `Open Question` |
| Pacjent z czerwonymi flagami     | objawy sugerują potrzebę innej ścieżki               | opóźnienie właściwej pomocy, jeśli formularz jest jedynym CTA | krytyczne ryzyko bezpieczeństwa         | ostrzeżenia, wyraźne wykluczenia, polityka eskalacji           |

#### Workflow i operacje

| Etykieta                                   | Warunki zajścia                                            | Skutek                               | Ryzyko dla backlogu albo produktu                    | Ogólna strategia obsługi                              |
| ------------------------------------------ | ---------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------- | ----------------------------------------------------- |
| Pierwsza wizyta potraktowana jak follow-up | formularz nie rozróżnia typu zgłoszenia                    | zły czas wizyty lub zła kwalifikacja | niedoszacowanie procesu w backlogu                   | osobne pole lub logika rozróżnienia                   |
| Brak właściciela zgłoszenia                | wiadomość trafia do skrzynki bez jasno przypisanego ownera | opóźniona odpowiedź                  | leady giną mimo poprawnego UI                        | zdefiniować ownera i SLA operacyjne                   |
| No-show bez polityki                       | brak zasad anulowania i potwierdzeń                        | straty czasu i frustracja gabinetu   | user stories nie obejmą procesu po umówieniu terminu | polityka odwołań, checklisty operacyjne, future story |

#### Integracje i kanały

| Etykieta                                         | Warunki zajścia                                      | Skutek                                  | Ryzyko dla backlogu albo produktu        | Ogólna strategia obsługi                           |
| ------------------------------------------------ | ---------------------------------------------------- | --------------------------------------- | ---------------------------------------- | -------------------------------------------------- |
| Powiadomienie e-mail nie dochodzi                | filtr spam, błąd skrzynki, zła konfiguracja          | gabinet nie widzi zgłoszenia            | niejawna utrata leadów                   | monitoring, testy kanału, alternatywny fallback    |
| Rozjazd między formularzem a kalendarzem ręcznym | pacjent oczekuje konkretnego terminu, którego nie ma | błędne oczekiwania i dodatkowe telefony | źle zaprojektowane AC dla terminu wizyty | komunikować preferencję, nie obietnicę dostępności |

#### Bezpieczeństwo i compliance

| Etykieta                                          | Warunki zajścia                                                             | Skutek                          | Ryzyko dla backlogu albo produktu    | Ogólna strategia obsługi                                       |
| ------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------- | ------------------------------------ | -------------------------------------------------------------- |
| Zbyt szerokie zgody                               | formularz łączy zgodę kontaktową z marketingową lub zbiera zbędne checkboxy | niejasna podstawa przetwarzania | błędna implementacja prawna          | rozdzielić zgody, zbierać minimum konieczne                    |
| Dane zdrowotne w zwykłym mailu do wielu odbiorców | obsługa zgłoszeń jest kopiowana szeroko                                     | ryzyko naruszenia poufności     | brak kontroli dostępu i traceability | ograniczyć dostęp, ustalić kanał operacyjny, politykę retencji |

#### Czas i skala

| Etykieta                                                   | Warunki zajścia                                 | Skutek                                              | Ryzyko dla backlogu albo produktu    | Ogólna strategia obsługi                                                   |
| ---------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------- |
| Szczyt zgłoszeń po kampanii                                | kilka lub kilkanaście zgłoszeń w krótkim czasie | opóźnienia odpowiedzi i spadek jakości kwalifikacji | backlog ignoruje potrzeby operacyjne | priorytetyzacja skrzynki, statusy zgłoszeń, prosty workflow                |
| Zgłoszenie w weekend z oczekiwaniem natychmiastowej pomocy | pacjent zakłada szybką odpowiedź                | rozczarowanie i złe review                          | brak jasnego SLA w komunikacji       | success message z realnym czasem reakcji i ograniczeniem odpowiedzialności |

### 8. Regulacje, compliance, bezpieczeństwo i ryzyko operacyjne

W polskim i unijnym kontekście ten projekt wchodzi co najmniej w obszar ochrony danych osobowych, a potencjalnie także danych dotyczących zdrowia, jeśli formularz zacznie zbierać opis problemu medycznego. To oznacza, że projekt nie może być traktowany jak zwykły landing bez refleksji nad minimalizacją danych, podstawą przetwarzania, zakresem dostępu i retencją.

Najbardziej prawdopodobnie relewantne obszary regulacyjne i odpowiedzialnościowe:

- `RODO / GDPR` — dla danych kontaktowych i potencjalnie danych o stanie zdrowia,
- polskie przepisy dotyczące praw pacjenta i odpowiedzialności za udzielanie świadczeń zdrowotnych, jeśli komunikacja wchodzi w obszar kwalifikacji do świadczenia,
- obowiązki zawodowe i ostrożność komunikacyjna wynikające z charakteru świadczeń fizjoterapeutycznych,
- obowiązek niewprowadzania pacjenta w błąd co do zakresu pomocy i czasu reakcji.

Implikacje praktyczne dla procesu, systemu i testów:

- formularz powinien zbierać tylko dane niezbędne do kontaktu i podstawowej kwalifikacji,
- treści UI powinny rozróżniać kontakt organizacyjny od porady medycznej,
- trzeba ustalić, kto ma dostęp do zgłoszeń, jak długo są przechowywane i co dzieje się ze zgłoszeniami odrzuconymi,
- jeśli pole opisu problemu zostaje w formularzu, powinno mieć guidance i ograniczenie zakresu,
- potrzebna jest ścieżka dla przypadków, które nie powinny być obsługiwane przez standardowy formularz,
- testy jakości powinny obejmować nie tylko walidację techniczną formularza, ale też scenariusze błędnej kwalifikacji, duplikatów, weekendowego SLA i red flags.

Obszary wymagające dalszego potwierdzenia przez klientkę lub konsultację prawną:

- czy opis objawów będzie kwalifikowany jako niezbędny element intake w MVP,
- jak ma wyglądać retencja i usuwanie zgłoszeń bez finalnej wizyty,
- czy komunikacja e-mailowa jest wystarczającym kanałem operacyjnym dla takich danych,
- czy klientka ma szczególne zasady dla niepełnoletnich, pooperacyjnych i pacjentów ze skierowaniami.

### 9. Wzorce, anty-wzorce i lekcje dla zespołu

#### Co w tej domenie zwykle działa dobrze

- prosty, krótki formularz z jasnym celem i czytelnym czasem odpowiedzi,
- wyraźne rozróżnienie między `pierwszą wizytą`, `kontynuacją` i `pytaniem ogólnym`,
- copy ustawiające oczekiwania, kiedy gabinet może pomóc, a kiedy potrzebna jest inna ścieżka,
- widoczne FAQ odpowiadające na pytania o przebieg pierwszej wizyty, przygotowanie, czas trwania, odwołanie i dostępność,
- manualny workflow operacyjny w MVP, ale z dobrze opisanymi regułami właściciela zgłoszenia i SLA.

#### Jakie uproszczenia są bezpieczne w MVP

- brak automatycznego kalendarza i płatności online,
- ręczne umawianie terminu po zgłoszeniu,
- jeden wspólny kanał odbioru zgłoszeń po stronie gabinetu,
- podstawowy podział tylko na `pierwsza wizyta / kontynuacja / pytanie` zamiast rozbudowanego triage engine.

#### Jakie uproszczenia są ryzykowne

- traktowanie formularza jak zwykłego kontaktu bez reguł dotyczących danych zdrowotnych,
- brak komunikatu o sytuacjach pilnych i czerwonych flagach,
- brak rozróżnienia typu pacjenta i typu wizyty,
- brak właściciela zgłoszenia oraz brak operacyjnego SLA,
- nieprzemyślane pole otwarte zachęcające do wpisywania pełnej historii medycznej.

#### Gdzie trzeba uważać przy user stories i acceptance criteria

- tam, gdzie story dotyczy formularza, trzeba opisać nie tylko `czy działa`, ale też `jakie dane są dopuszczalne` i `jakie oczekiwania ustawia użytkownikowi`,
- tam, gdzie story dotyczy success message, trzeba uwzględnić realny czas odpowiedzi i ograniczenia weekendowe,
- tam, gdzie pojawia się routing zgłoszeń, trzeba dopisać właściciela procesu, fallback i traceability,
- tam, gdzie pojawiają się FAQ i copy, trzeba sprawdzić zgodność z granicami usługi, a nie tylko poprawność marketingową.

### 10. Handoff do `REQUIREMENTS.md` i dokumentacji produktu

#### Mapowanie do `REQUIREMENTS.md`

#### `## Klient`

- doprecyzować, że projekt dotyczy prywatnego gabinetu fizjoterapii ambulatoryjnej, gdzie pierwszy kontakt online służy wstępnej kwalifikacji i ustaleniu następnego kroku, a nie diagnozie,
- dodać, że ważnym celem biznesowym jest poprawa jakości zgłoszeń, nie tylko ich liczby,
- zaznaczyć, że domena jest wrażliwa na bezpieczeństwo pacjenta, no-show i komunikację o czasie odpowiedzi.

#### `## Funkcjonalności`

- rozważyć rozróżnienie `pierwsza wizyta / kontynuacja / pytanie organizacyjne`,
- dodać wymóg minimalizacji danych w formularzu,
- dodać wymaganie jasnego success message z informacją o czasie odpowiedzi,
- dodać treści lub logikę ostrzegającą, że formularz nie służy sytuacjom pilnym,
- dodać regułę przekazywania zgłoszenia do jednego jasno określonego ownera.

#### `## Routing`

- obecny model jednej trasy nadal jest sensowny,
- jeśli pojawi się osobna polityka prywatności, FAQ lub strona potwierdzenia, trzeba ocenić to jako decyzję informacyjną, nie medyczną,
- nie należy projektować routingu sugerującego samodzielne „diagnozowanie ścieżki leczenia” po stronie pacjenta.

#### `## i18n`

- MVP po polsku jest uzasadnione,
- jeśli gabinet obsługuje także pacjentów zagranicznych, trzeba sprawdzić, czy tłumaczenie terminów medycznych nie wymaga dodatkowej walidacji,
- komunikaty bezpieczeństwa i prywatności nie powinny być tłumaczone automatycznie bez review.

#### `## Uwagi dodatkowe`

- strona nie może sugerować, że formularz zastępuje konsultację medyczną,
- należy ustawić realny czas odpowiedzi i ograniczenia kontaktu po godzinach pracy,
- polityka odwołań, no-show i obsługi zgłoszeń poza zakresem powinna zostać co najmniej opisana jako decyzja operacyjna do podjęcia,
- formularz powinien wspierać proces kwalifikacji, ale nie może zamieniać się w pełny intake medyczny.

#### Mapowanie do `docs/product`

- `02-scope/business-rules.md` — dodać zasady: pierwsza wizyta vs kontynuacja, wymagany minimalny zestaw danych, obsługa przypadków pilnych, owner zgłoszenia, polityka odpowiedzi i wstępne zasady no-show,
- `02-scope/non-functional-requirements.md` — dopisać bezpieczeństwo danych, traceability zgłoszeń, zgodność komunikowanego SLA z realnym procesem, dostępność formularza, niezawodność kanału powiadomień,
- `03-domain/user-journeys.md` — opisać ścieżki: nowy pacjent, pacjent powracający, przypadek poza zakresem, zgłoszenie po godzinach,
- `03-domain/process-flows.md` — rozpisać przepływ od formularza do kontaktu zwrotnego i ustalenia terminu,
- `03-domain/roles-and-permissions.md` — wystarczy lekka wersja: pacjent, właścicielka gabinetu, opcjonalna recepcja; artefakt nadal jest przydatny mimo małej skali,
- `03-domain/data-entities.md` — zdefiniować `Visit Request`, `Patient Contact Record`, `Triage Flag`, `Consent Record`, `Appointment Proposal`,
- `03-domain/integrations.md` — krótki dokument o e-mailu, telefonie i ewentualnym kalendarzu ręcznym; nie wymaga rozbudowanej warstwy technicznej,
- `04-backlog/epics.md` — dodać epiki związane z kwalifikacją zgłoszeń, bezpiecznym kontaktem i operacyjną obsługą terminu,
- `04-backlog/features.md` — wyodrębnić feature'y: struktura formularza, success message, komunikaty bezpieczeństwa, operacyjny routing leadu, FAQ kwalifikacyjne,
- `04-backlog/story-map.md` — rozdzielić journey pacjenta od workflow właścicielki gabinetu,
- `04-backlog/user-stories/*` — każde story formularzowe musi zawierać reguły danych, ograniczenia domenowe i scenariusze negatywne,
- `05-quality/test-scenarios.md` — dopisać scenariusze: błędne dane kontaktowe, zgłoszenie weekendowe, czerwone flagi, duplikat zgłoszenia, pacjent powracający, brak odpowiedzi w SLA,
- `07-compliance/compliance-requirements.md` — potrzebny krótki dokument, bo projekt dotyka danych osobowych i może dotknąć danych o zdrowiu,
- `07-compliance/security-and-privacy.md` — potrzebny dokument o minimalizacji danych, dostępie, retencji i bezpiecznej obsłudze zgłoszeń.

Żaden z powyższych artefaktów nie wydaje się zbędny, ale dla projektu tej skali część z nich powinna pozostać krótka i operacyjna, bez enterprise'owej nadbudowy.

### 11. Implikacje dla backlogu i user stories

#### Kandydaci na epiki i features wynikające z domeny

- `EP-001 Pozyskanie i kwalifikacja pacjenta` — feature'y: formularz pierwszej wizyty, rozróżnienie typu zgłoszenia, podstawowa kwalifikacja,
- `EP-002 Operacyjna obsługa zgłoszeń` — feature'y: routing do ownera, success message z SLA, procedura kontaktu zwrotnego,
- `EP-003 Bezpieczeństwo, prywatność i granice usługi` — feature'y: komunikaty o red flags, polityka prywatności, minimalizacja danych,
- `EP-004 Zmniejszenie chaosu komunikacyjnego` — feature'y: FAQ pierwszej wizyty, informacje o odwołaniach, ścieżka pacjenta powracającego.

#### Story Hotspots

- story o formularzu bez rozróżnienia pierwszej wizyty i kontynuacji,
- story o polu `Wiadomość` bez granic dla danych zdrowotnych,
- story o potwierdzeniu wysyłki bez realnego SLA i bez weekendowego edge case'u,
- story o kontakcie zwrotnym bez ownera i bez fallbacku na wypadek awarii e-maila,
- story o FAQ, które mówi tylko marketingowo, ale nie ustawia bezpiecznych oczekiwań pacjenta,
- story o pacjencie niepełnoletnim lub pooperacyjnym pominięte jako „rzadki przypadek”, choć wpływa na reguły zgłoszenia.

#### Reguły biznesowe i warunki brzegowe do acceptance criteria

- zgłoszenie musi zawierać wystarczające dane do kontaktu zwrotnego,
- użytkownik musi otrzymać jasną informację, że formularz nie służy sytuacjom pilnym,
- success message musi komunikować rzeczywisty czas odpowiedzi,
- system nie powinien wymuszać pełnego opisu historii medycznej,
- jeśli pacjent deklaruje kontynuację terapii, ścieżka może być uproszczona, ale tylko przy zachowaniu warunków domenowych,
- zgłoszenia z potencjalnymi red flags muszą być rozpoznawalne w procesie operacyjnym,
- projekt nie może sugerować gwarancji konkretnego terminu, jeśli termin ustalany jest ręcznie.

#### NFR, kontrole operacyjne i zależności

- dostępność formularza z klawiatury i na urządzeniach mobilnych,
- niezawodność dostarczenia zgłoszenia do kanału operacyjnego,
- traceability: kto i kiedy otrzymał zgłoszenie,
- minimalizacja i kontrola dostępu do danych,
- zgodność treści UI z polityką prywatności i realnym SLA,
- procedura fallback na wypadek awarii e-maila lub okresowej niedostępności właścicielki.

#### Pytania do zamknięcia przed refinementem

- czy klientka przyjmuje niepełnoletnich i jak chce to obsługiwać procesowo,
- czy formularz ma pozwalać wybrać preferowany termin, czy tylko wyrazić chęć kontaktu,
- jaki maksymalny zakres opisu problemu jest pożądany na etapie online,
- jaka jest polityka odpowiedzi po godzinach pracy i w weekendy,
- czy i kiedy klientka chce wdrożyć rozróżnienie na `pierwsza wizyta` i `kontynuacja`,
- jaka retencja ma dotyczyć zgłoszeń zakończonych brakiem wizyty lub błędnymi danymi.
