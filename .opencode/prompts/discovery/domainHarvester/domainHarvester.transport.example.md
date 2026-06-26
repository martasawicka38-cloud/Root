# Przykład użycia promptu `domainHarvester.md` — wariant enterprise transport

Poniżej znajduje się przykładowy rezultat, jaki AI powinno przygotować po zakończonym discovery klienta, gdy zespół buduje system dla złożonej, regulowanej domeny operacyjnej i potrzebuje researchu domenowego przed przygotowaniem backlogu.

## Przykładowy kontekst po wcześniejszym discovery

Klient: Marta Lis, COO w firmie `FleetCore`, która buduje B2B SaaS dla średnich i dużych firm transportu drogowego działających w Polsce i częściowo w DACH.

Najważniejsze informacje z wcześniejszego discovery:

- produkt ma uporządkować planowanie tras, przypisanie kierowców i pojazdów, kontrolę czasu pracy kierowców, rozliczenie delegacji oraz przygotowanie danych dla payroll i compliance,
- obecnie firmy docelowe korzystają z Excela, komunikatorów, osobnych paneli telematycznych oraz ręcznych korekt na etapie rozliczeń,
- główne role użytkowników to dispatcher, fleet manager, compliance specialist, payroll specialist i kierowca,
- kluczowy cel biznesowy MVP to skrócenie czasu planowania tras o 40%, zmniejszenie liczby korekt payrollowych o 60% i ograniczenie naruszeń czasu pracy kierowców,
- produkt ma integrować się z dostawcami telematyki i tachografów oraz eksportować dane do systemów księgowych i kadrowych,
- MVP obejmuje: planowanie zleceń i tras, przypisanie kierowców i pojazdów, import danych z telematyki, alerty naruszeń, podgląd zdarzeń trasy, ręczne korekty z audytem i podstawowe rozliczenie przejazdu,
- poza MVP pozostają: automatyczna optymalizacja tras, rozliczenia paliwowe, pełne TMS, obsługa celna, faktoring i rozbudowana aplikacja mobilna offline-first,
- wymagania niefunkcjonalne to: audit trail, role-based access, zgodność z przepisami UE i lokalnymi regulacjami pracy kierowców, traceability zmian, odporność na opóźnione dane z urządzeń oraz wysoka czytelność stanów wyjątkowych,
- klientka podkreśla, że największym problemem nie jest sam plan, ale rozjazd między planem a rzeczywistym przebiegiem trasy oraz koszt ręcznej rekonstrukcji zdarzeń po fakcie,
- nie jest jeszcze potwierdzone, czy MVP ma uwzględniać kierowców etatowych i kontraktowych w tym samym modelu oraz jak głęboko ma wspierać reguły dla przewozów międzynarodowych.

Priorytetowe pytania badawcze do domain researchu:

- jakie są krytyczne obiekty domenowe i decyzje w procesie od planu trasy do rozliczenia wykonania,
- które reguły czasu pracy kierowców i odpoczynków mają realny wpływ na backlog MVP,
- jakie wyjątki i failure modes pojawiają się najczęściej przy danych z telematyki i tachografów,
- gdzie przebiega granica między wspieraniem compliance a podejmowaniem prawnie istotnej decyzji,
- jakie role i poziomy odpowiedzialności trzeba rozdzielić w systemie, żeby zachować auditability i ograniczyć ryzyko operacyjne.

Rynek / region: Polska, UE, z uwzględnieniem przewozów międzynarodowych i wybranych operacji DACH.

---

## Przykładowy wynik działania promptu

Przykład jest ułożony w tym samym rytmie co pozostałe pliki `.example.md` w discovery: klasyfikacja, synteza, stan wiedzy, handoff do `REQUIREMENTS.md`, artefakty domenowe i ryzyka. W tym wariancie nacisk pada na role operacyjne, stany danych, traceability, compliance i miejsca, gdzie zbyt płaskie user stories mogłyby narazić produkt na błędy rozliczeniowe albo prawne.

### 1. Klasyfikacja researchu domenowego

- `Research Profile`: `Enterprise`
- `Confidence Level`: `średni`
- `Jurisdiction Scope`: `Polska + UE; szczególna uwaga na rozporządzenia UE dotyczące czasu jazdy i odpoczynków oraz lokalne implikacje payrollowe`
- `Client Position in Domain`: `B2B operational SaaS pomiędzy planowaniem transportu, monitoringiem wykonania, compliance czasu pracy i rozliczeniem operacyjnym`
- `Why this depth`: `na poziomie UI produkt może wyglądać jak zwykły planner z alertami, ale domena w rzeczywistości łączy logistykę, telematykę, prawo pracy, audyt i rozliczenia. Pominięcie stanów wyjątkowych albo ról odpowiedzialności grozi błędnymi user stories, naruszeniami przepisów i kosztownymi korektami po wdrożeniu.`

### 2. Executive Summary

Domena transportu drogowego w ujęciu operacyjnym nie sprowadza się do przypisania kierowcy do trasy. Kluczowe jest ciągłe porównywanie planu do rzeczywistego wykonania, interpretacja zdarzeń z tachografów i telematyki, pilnowanie ograniczeń czasu jazdy i odpoczynków oraz przełożenie tych danych na decyzje dyspozytorskie, compliance i payroll. W praktyce problemy pojawiają się nie tylko wtedy, gdy kierowca przekroczy limit, ale też wtedy, gdy dane przychodzą z opóźnieniem, wymagają ręcznej korekty lub różne role w organizacji inaczej interpretują to samo zdarzenie.

Dla klientki krytyczne jest zbudowanie systemu, który nie obiecuje pełnej automatycznej zgodności prawnej, ale porządkuje zdarzenia, pokazuje wyjątki, wspiera decyzje i zostawia ślad audytowy. Największym ryzykiem dla backlogu jest potraktowanie produktu jak prostego dashboardu telemetrycznego bez jawnego modelu stanów, reguł nadpisywania danych, ownerów procesów i granicy między rekomendacją systemu a decyzją człowieka.

### 3. Confirmed / Research-Backed Findings / Assumptions / Open Questions / Missing Evidence

#### Confirmed

- produkt jest kierowany do firm transportowych, które dziś pracują na rozproszonych narzędziach i ręcznych korektach,
- MVP ma objąć planowanie, monitoring wykonania, import danych z urządzeń, alerty, ręczne korekty i podstawowe rozliczenie przejazdu,
- kluczowe role to dispatcher, fleet manager, compliance specialist, payroll specialist i kierowca,
- klientka oczekuje audit trail, kontroli ról i wysokiej czytelności wyjątków,
- zakres obejmuje przewozy w środowisku UE i wymaga uwzględnienia przepisów dotyczących czasu pracy kierowców.

#### Research-Backed Findings

- w tej domenie plan i wykonanie niemal zawsze się rozjeżdżają: korki, postoje, zmiany zleceń, opóźnione załadunki, awarie, zmiany kierowcy i błędne dane z urządzeń są normą, nie wyjątkiem,
- dane z telematyki i tachografów mają charakter częściowo techniczny, częściowo interpretacyjny; to samo zdarzenie może wymagać walidacji lub korekty przez człowieka,
- compliance w transporcie drogowym nie jest jednorazową walidacją przy zapisie zlecenia, lecz procesem ciągłym: część naruszeń można przewidzieć na etapie planu, część ujawnia się dopiero w trakcie lub po wykonaniu,
- duża część wartości systemów klasy fleet / transport ops nie polega na "automatycznym policzeniu wszystkiego", tylko na szybkim wykrywaniu wyjątków, pokazaniu ich właściwej roli i zachowaniu śladu decyzji,
- ręczne korekty są nieuniknione, ale w systemach produkcyjnych muszą być jawnie typowane, uzasadnione i audytowalne; ukryte nadpisanie danych jest poważnym anty-wzorcem,
- rozdzielenie roli dispatchera, compliance i payroll jest domenowo istotne, bo te role pracują na tych samych danych, ale podejmują inne decyzje i mają inne ryzyka błędu,
- kluczowym obiektem nie jest sama trasa, lecz relacja między zleceniem, przypisaniem, zdarzeniami wykonania, limitami kierowcy i finalnym rozliczeniem.

#### Assumptions

- MVP nie ma jeszcze automatycznie podejmować decyzji prawnej o zgodności, tylko wspierać analizę i workflow wyjątków,
- dane z różnych dostawców telematyki będą miały różną jakość i poziom normalizacji,
- organizacje docelowe będą potrzebowały ręcznych korekt także po zamknięciu przejazdu,
- kierowca w MVP nie będzie głównym pełnoprawnym użytkownikiem webowego systemu backoffice, a raczej źródłem danych i odbiorcą wybranych komunikatów,
- część klientów docelowych będzie wymagała eksportu danych do zewnętrznego payrollu zamiast pełnego payrollu w systemie.

#### Open Questions

- czy MVP ma wspierać różne modele zatrudnienia kierowców i czy wpływa to na logikę rozliczeń,
- jak głęboko produkt ma wchodzić w reguły przewozów międzynarodowych, posting i cabotage,
- czy system ma dopuszczać korekty po zamknięciu okresu rozliczeniowego i kto ma do nich uprawnienie,
- czy klientka oczekuje jedynie alertów compliance, czy również workflow akceptacji działań korygujących,
- jaki jest oczekiwany model pracy przy braku danych z urządzenia: blokada, ostrzeżenie czy warunkowe dopuszczenie dalszej obsługi,
- czy w MVP trzeba wspierać podmianę kierowcy lub pojazdu w trakcie trasy jako pełnoprawny scenariusz,
- czy potrzebne będzie formalne rozdzielenie tenantów i data residency dla klientów z różnych krajów.

#### Missing Evidence

- brak potwierdzonej listy dostawców telematyki i tachografów dla pierwszych integracji,
- brak polityki, jak firmy docelowe dziś zatwierdzają i uzasadniają ręczne korekty,
- brak decyzji, które alerty compliance mają charakter informacyjny, a które blokujący,
- brak potwierdzenia, czy produkt ma wspierać kontrole drogowe i raporty dla inspekcji, czy tylko przygotowanie danych pośrednich,
- brak uzgodnionego modelu retencji i archiwizacji dla zdarzeń, korekt i eksportów,
- brak informacji, jak często firmy docelowe zmieniają plan trasy w trakcie dnia i które zmiany są domenowo najdroższe.

### 4. Szybki kontekst domeny i pozycja klienta

Z perspektywy użytkownika końcowego domena operacyjnego transportu drogowego polega na tym, żeby przewieźć ładunek właściwym pojazdem, we właściwym czasie, zgodnie z ograniczeniami kierowcy i regulacjami, a następnie poprawnie rozliczyć wykonanie. Dla zespołu produktowego kluczowe jest to, że "transport" nie jest jednym procesem. To łańcuch współzależnych decyzji: planowanie, przypisanie zasobów, monitoring realizacji, obsługa wyjątków, compliance, rozliczenie i analiza po fakcie.

FleetCore pozycjonuje się w środku tego łańcucha. Nie buduje pełnego TMS ani systemu księgowego, ale chce być systemem operacyjnej prawdy dla tego, co zaplanowano, co naprawdę się wydarzyło i jak to przełożyć na decyzje compliance oraz rozliczenie. In scope są więc: plan trasy, przypisania, import i normalizacja zdarzeń, alerty, wyjątki, korekty i eksport do dalszych systemów. Poza bieżącym zakresem pozostają: pełna optymalizacja tras, billing finansowy, paliwa, cła oraz pełna obsługa mobilna offline.

### 5. Struktura domeny i ekosystem

#### Aktorzy, role i odpowiedzialności

| Aktor                           | Rola w domenie                 | Kluczowa odpowiedzialność                                   | Wpływ na projekt                                                                          |
| ------------------------------- | ------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Dispatcher                      | planowanie i bieżąca operacja  | przypisuje kierowcę, pojazd, reaguje na odchylenia w trasie | potrzebuje szybkiego widoku wyjątków i zmian planu                                        |
| Fleet Manager                   | nadzór zasobów                 | zarządza dostępnością floty, obłożeniem i efektywnością     | potrzebuje przekroju między planem a wykonaniem                                           |
| Compliance Specialist           | zgodność operacji              | analizuje naruszenia i ryzyka regulacyjne                   | potrzebuje wiarygodnych danych źródłowych, wyjaśnień i historii korekt                    |
| Payroll Specialist              | rozliczenie czasu i należności | wykorzystuje dane operacyjne do przygotowania rozliczeń     | potrzebuje stabilnych, zamkniętych danych i jasnego statusu korekt                        |
| Kierowca                        | wykonawca operacji             | realizuje trasę, generuje zdarzenia i wyjątki               | część jego działań jest źródłem danych, ale nie zawsze bezpośrednią interakcją z systemem |
| Inspektor / audytor             | rola zewnętrzna                | kontroluje zgodność lub wymaga dowodów                      | wymusza traceability, retencję i nieusuwalność krytycznych śladów                         |
| System telematyczny / tachograf | zewnętrzne źródło zdarzeń      | dostarcza sygnały o ruchu, pracy, postojach i lokalizacji   | musi być modelowany jako źródło nie zawsze kompletne ani bezbłędne                        |
| ERP / Payroll                   | system docelowy dla eksportów  | przejmuje dane rozliczeniowe                                | wymaga stabilnego modelu eksportu i statusów danych                                       |

#### Obiekty domenowe, dane i dokumenty

- `Transport Order` — zlecenie przewozowe lub operacyjne,
- `Route Plan` — zaplanowany przebieg z przypisaniem kolejności, okien czasowych i zasobów,
- `Driver Assignment` — przypisanie kierowcy do planu i pojazdu,
- `Vehicle Assignment` — przypisanie jednostki taborowej do przejazdu,
- `Trip Execution` — rzeczywisty przebieg przejazdu,
- `Event Stream` — sekwencja zdarzeń z telematyki, tachografu lub ręcznych wpisów,
- `Compliance Alert` — wykryte ryzyko lub naruszenie wymagające interpretacji,
- `Manual Correction` — jawna ingerencja człowieka w klasyfikację lub dane operacyjne,
- `Settlement Item` — element rozliczeniowy wyprowadzony z danych wykonania,
- `Exception Case` — przypadek wymagający eskalacji, doprecyzowania lub decyzji ręcznej,
- `Export Batch` — paczka danych przekazywana do zewnętrznego payrollu lub ERP,
- `Audit Record` — ślad kto, co, kiedy i dlaczego zmienił albo zatwierdził.

#### Słownik kluczowych pojęć

- `Plan` — intencja operacyjna przed realizacją,
- `Execution` — faktyczny przebieg trasy i pracy kierowcy,
- `Driving Time` — czas jazdy wynikający z rejestrowanych zdarzeń,
- `Break` — przerwa wymagana lub wykorzystana w przebiegu dnia,
- `Rest` — odpoczynek dzienny lub tygodniowy,
- `Violation` — stan wskazujący przekroczenie reguł lub wysokie ryzyko ich złamania,
- `Posting / Cabotage` — operacje międzynarodowe wpływające na dodatkowe obowiązki regulacyjne,
- `Correction Reason` — ustandaryzowany powód zmiany danych lub klasyfikacji,
- `Locked Period` — zamknięty zakres danych, po którym korekta wymaga specjalnych uprawnień.

#### Przepływy danych i granice systemu

- dispatcher tworzy plan i przypisuje zasoby,
- system zbiera zdarzenia z urządzeń i porównuje je z planem,
- role operacyjne interpretują wyjątki i wprowadzają korekty,
- system wyprowadza alerty, statusy i paczki rozliczeniowe,
- finalne rozliczenie finansowe może pozostawać poza systemem w ERP lub payrollu,
- granica systemu MVP kończy się na wiarygodnym przygotowaniu i przekazaniu danych oraz workflow wyjątków, a nie na pełnej automatyzacji całej organizacji transportowej.

#### Integracje zewnętrzne i zależności operacyjne

- dostawcy telematyki i GPS,
- źródła danych z tachografów,
- ERP / systemy kadrowo-płacowe,
- e-mail lub kolejka powiadomień dla alertów i wyjątków,
- potencjalnie system dokumentów przewozowych,
- przyszłe, ale niepotwierdzone: optymalizatory tras, aplikacje mobilne kierowcy, systemy paliwowe.

### 6. Typowe scenariusze, warianty i krytyczne punkty procesu

#### Scenariusz 1 — Dispatcher planuje trasę i przypisuje kierowcę oraz pojazd

- `Cel procesu`: zbudować wykonalny plan z uwzględnieniem dostępności zasobów i ograniczeń kierowcy,
- `Przebieg krok po kroku`:
  1. dispatcher tworzy lub importuje zlecenie,
  2. przypisuje pojazd i kierowcę,
  3. system ocenia podstawowe konflikty dostępności i ryzyka zgodności,
  4. plan zostaje zapisany jako wersja robocza lub potwierdzona,
  5. plan staje się punktem odniesienia dla dalszego monitoringu,
- `Główne decyzje i walidacje`: czy kierowca ma dostępną pulę czasu, czy pojazd jest dostępny, czy plan narusza podstawowe ograniczenia już na starcie,
- `Warianty operacyjne`: przypisanie jednego kierowcy, zmiana kierowcy przed startem, ręczne nadpisanie ostrzeżenia z uzasadnieniem,
- `KPI / SLA`: czas przygotowania planu, liczba wykrytych konfliktów przed startem, odsetek planów wymagających późniejszej korekty,
- `Implikacja dla projektu`: planner nie może być tylko kalendarzem; potrzebuje statusów ryzyka, wersjonowania planu i jawnej decyzji override.

#### Scenariusz 2 — Trasa jest realizowana, a dane spływają z opóźnieniem lub niekompletnie

- `Cel procesu`: zachować widoczność wykonania i nie zgubić wyjątków mimo niedoskonałych danych,
- `Przebieg krok po kroku`:
  1. kierowca rozpoczyna trasę,
  2. system odbiera zdarzenia z urządzeń,
  3. część danych przychodzi z opóźnieniem albo ma luki,
  4. system pokazuje stan niepewności lub braków,
  5. dispatcher albo compliance ocenia, czy trzeba reagować natychmiast, czy czekać na pełniejsze dane,
- `Główne decyzje i walidacje`: czy brak danych oznacza awarię, brak synchronizacji, czy realny wyjątek; czy wolno podjąć decyzję operacyjną na niepełnym obrazie,
- `Warianty operacyjne`: krótkie opóźnienie danych, pełna utrata sygnału, rozjazd między dwoma źródłami,
- `KPI / SLA`: czas wykrycia luki danych, odsetek zdarzeń wymagających ręcznej rekonstrukcji, czas rozwiązania wyjątku,
- `Implikacja dla projektu`: system potrzebuje stanów typu `partial`, `delayed`, `needs review`, a nie binarnego `ok/error`.

#### Scenariusz 3 — Compliance specialist analizuje alert naruszenia czasu pracy

- `Cel procesu`: odróżnić realne naruszenie od błędu danych lub sytuacji wymagającej interpretacji,
- `Przebieg krok po kroku`:
  1. system wykrywa alert,
  2. specialist otwiera szczegóły zdarzeń i kontekst planu,
  3. porównuje dane źródłowe, wcześniejsze korekty i status trasy,
  4. podejmuje decyzję: potwierdzenie alertu, odrzucenie albo korekta klasyfikacji,
  5. decyzja zostaje zapisana z uzasadnieniem i śladem audytowym,
- `Główne decyzje i walidacje`: kto ma prawo zamknąć alert, czy potrzebne jest uzasadnienie, czy alert wpływa na payroll lub raporty,
- `Warianty operacyjne`: alert informacyjny, alert blokujący, alert wynikający z błędnych danych źródłowych,
- `KPI / SLA`: czas obsługi alertu, liczba alertów fałszywie pozytywnych, odsetek alertów kończących się korektą danych,
- `Implikacja dla projektu`: workflow alertów musi mieć statusy, ownera, powód decyzji i wpływ na downstream data.

#### Scenariusz 4 — Payroll przygotowuje rozliczenie po zamknięciu przejazdu

- `Cel procesu`: dostać stabilny zestaw danych rozliczeniowych bez ręcznego polowania na wyjątki,
- `Przebieg krok po kroku`:
  1. przejazd osiąga stan gotowości do rozliczenia,
  2. system sprawdza otwarte alerty i nierozstrzygnięte korekty,
  3. payroll generuje podgląd danych rozliczeniowych,
  4. dane są eksportowane do systemu zewnętrznego,
  5. po eksporcie okres może zostać zablokowany lub wymaga specjalnej ścieżki korekty,
- `Główne decyzje i walidacje`: kiedy przejazd jest `ready for settlement`; kto może odblokować okres; jak oznaczane są korekty po eksporcie,
- `Warianty operacyjne`: czyste zamknięcie, zamknięcie z ostrzeżeniem, korekta po eksporcie,
- `KPI / SLA`: liczba korekt po eksporcie, czas zamknięcia okresu, liczba rekordów z brakami,
- `Implikacja dla projektu`: trzeba modelować lifecycle danych, a nie tylko raport końcowy.

#### Scenariusz 5 — Kontrola lub audyt wymaga wyjaśnienia decyzji operacyjnej

- `Cel procesu`: móc odtworzyć, co system wiedział i kto podjął decyzję,
- `Przebieg krok po kroku`:
  1. organizacja identyfikuje sporne zdarzenie lub otrzymuje zapytanie audytowe,
  2. użytkownik otwiera historię planu, zdarzeń, alertów i korekt,
  3. system pokazuje wersje danych i uzasadnienia decyzji,
  4. powstaje materiał dowodowy lub raport pomocniczy,
- `Główne decyzje i walidacje`: czy dane źródłowe są nienaruszone; czy korekty są powiązane z użytkownikiem i czasem; czy raport obejmuje pełen kontekst,
- `Warianty operacyjne`: kontrola wewnętrzna, spór payrollowy, audyt zewnętrzny,
- `KPI / SLA`: czas odtworzenia przypadku, kompletność śladu, liczba brakujących uzasadnień,
- `Implikacja dla projektu`: audit trail nie jest dodatkiem; jest jednym z głównych feature'ów domenowych.

### 7. Edge case'y i failure modes

#### Dane

| Etykieta                           | Warunki zajścia                                    | Skutek                                  | Ryzyko dla backlogu albo produktu         | Ogólna strategia obsługi                                            |
| ---------------------------------- | -------------------------------------------------- | --------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------- |
| Duplikat zdarzenia telemetrycznego | to samo zdarzenie przychodzi dwa razy z integracji | błędna klasyfikacja czasu lub alertów   | fałszywe naruszenia i zła jakość raportów | deduplikacja, identyfikatory źródłowe, status niepewności           |
| Luka w danych tachografu           | urządzenie nie przesłało pełnego zakresu           | nie da się wiarygodnie policzyć limitów | błędne decyzje compliance                 | oznaczenie `incomplete`, blokada niektórych akcji lub ręczny review |
| Rozjazd dwóch źródeł               | GPS i tachograf pokazują sprzeczny przebieg        | konflikt interpretacyjny                | niejawne nadpisanie jednej prawdy drugą   | polityka priorytetu źródeł i workflow wyjaśnień                     |

#### Użytkownik i role

| Etykieta                                      | Warunki zajścia                                      | Skutek                                   | Ryzyko dla backlogu albo produktu      | Ogólna strategia obsługi                                   |
| --------------------------------------------- | ---------------------------------------------------- | ---------------------------------------- | -------------------------------------- | ---------------------------------------------------------- |
| Dispatcher nadpisuje alert bez uzasadnienia   | szybka presja operacyjna i zbyt szerokie uprawnienia | utrata śladu decyzji                     | brak audytu i spory downstream         | wymagać powodu korekty i ograniczyć role                   |
| Payroll eksportuje dane z otwartymi wyjątkami | presja zamknięcia okresu                             | błędne rozliczenie                       | korekty po eksporcie i utrata zaufania | status `ready for settlement`, blokady i ostrzeżenia       |
| Kierowca został podmieniony w trakcie trasy   | operacyjna zmiana bez pełnego odnotowania            | błędne przypisanie zdarzeń i czasu pracy | poważne błędy compliance i payrollowe  | modelowanie zmiany zasobu jako pierwszoklasowego zdarzenia |

#### Workflow i proces

| Etykieta                                       | Warunki zajścia                                              | Skutek                             | Ryzyko dla backlogu albo produktu              | Ogólna strategia obsługi                        |
| ---------------------------------------------- | ------------------------------------------------------------ | ---------------------------------- | ---------------------------------------------- | ----------------------------------------------- |
| Plan zatwierdzony, ale niewykonalny w praktyce | zmieniły się okna czasowe lub sytuacja na drodze             | lawina wyjątków podczas realizacji | system tworzy fałszywe poczucie bezpieczeństwa | odróżnić walidację planu od gwarancji wykonania |
| Korekta po zamknięciu okresu                   | błąd wykryty po eksporcie do payrollu                        | różne wersje prawdy w systemach    | brak modelu lifecycle i re-open workflow       | locked periods, re-open policy, pełen audit     |
| Alert nie ma ownera                            | system wygenerował wyjątek, ale nikt nie jest odpowiedzialny | alert zalega i psuje dane dalej    | martwe wyjątki i narastający bałagan           | przypisanie ownera, SLA i kolejki pracy         |

#### Integracje

| Etykieta                              | Warunki zajścia                     | Skutek                            | Ryzyko dla backlogu albo produktu         | Ogólna strategia obsługi                             |
| ------------------------------------- | ----------------------------------- | --------------------------------- | ----------------------------------------- | ---------------------------------------------------- |
| Integracja opóźniona o kilka godzin   | dostawca zewnętrzny ma lag          | operacja działa na starych danych | złe decyzje w trakcie dnia                | timestamp freshness, komunikacja poziomu zaufania    |
| Błędna mapa kodów zdarzeń             | różni dostawcy mają różną semantykę | zła normalizacja eventów          | system liczy inaczej dla różnych klientów | warstwa mapowania i testy kontraktowe                |
| Eksport do ERP częściowo się nie udał | paczka przeszła tylko w części      | niespójne rozliczenie downstream  | podwójne eksporty lub luki                | idempotentne eksporty, status paczki, retry workflow |

#### Compliance i bezpieczeństwo

| Etykieta                                        | Warunki zajścia                               | Skutek                                | Ryzyko dla backlogu albo produktu   | Ogólna strategia obsługi                                              |
| ----------------------------------------------- | --------------------------------------------- | ------------------------------------- | ----------------------------------- | --------------------------------------------------------------------- |
| System sugeruje zgodność, choć dane są niepełne | zbyt agresywna automatyzacja UX               | użytkownik ufa fałszywemu statusowi   | odpowiedzialność biznesowa i prawna | jasne poziomy pewności i brak kategorycznych komunikatów bez podstawy |
| Nadmiernie szeroki dostęp do korekt             | zbyt wielu użytkowników może modyfikować dane | trudność w audycie i ryzyko nadużycia | utrata wiarygodności danych         | RBAC, segregation of duties, pełny audit log                          |

#### Czas i skala

| Etykieta                                    | Warunki zajścia                                       | Skutek                                  | Ryzyko dla backlogu albo produktu           | Ogólna strategia obsługi                                    |
| ------------------------------------------- | ----------------------------------------------------- | --------------------------------------- | ------------------------------------------- | ----------------------------------------------------------- |
| Nagromadzenie wyjątków na koniec okresu     | większość review dzieje się tuż przed payroll closing | wąskie gardło operacyjne                | zespół nie nadąża, rosną błędy              | priorytetyzacja work queue, statusy, bulk review z kontrolą |
| Zdarzenia przekraczają granice dni i krajów | trasa wielodniowa, przekroczenie granicy              | trudna interpretacja limitów i dodatków | spłaszczenie domeny do jednego "dnia pracy" | modelowanie czasu, stref, granic i odcinków                 |

### 8. Regulacje, compliance, bezpieczeństwo i ryzyko operacyjne

W tym kontekście produkt działa w otoczeniu silnie regulowanym. Nawet jeśli sam nie jest formalnym systemem prawnym ani księgowym, wspiera procesy, które podlegają kontroli i mają realne skutki finansowe oraz compliance. Oznacza to, że architektura backlogu musi brać pod uwagę nie tylko UX i wydajność, ale też dowodowość, odpowiedzialność ról i interpretowalność decyzji.

Najbardziej relewantne obszary:

- regulacje UE dotyczące czasu jazdy, przerw i odpoczynków kierowców oraz powiązane obowiązki operacyjne,
- obowiązki związane z wykorzystaniem danych z tachografów i telematyki,
- lokalne implikacje czasu pracy i rozliczeń pracowniczych lub kontraktowych,
- GDPR / RODO dla danych osobowych kierowców i historii aktywności,
- wymagania audytowe wynikające z kontroli wewnętrznych, sporów pracowniczych i zewnętrznych kontroli.

Implikacje dla procesu, systemu i testów:

- system powinien rozróżniać dane źródłowe od danych zinterpretowanych lub skorygowanych,
- każda istotna korekta musi być powiązana z użytkownikiem, czasem i powodem,
- UI nie powinien używać komunikatów sugerujących całkowitą zgodność, jeśli istnieją luki danych albo niezamknięte wyjątki,
- potrzebne są polityki zamykania okresów, ponownego otwierania i eksportu,
- uprawnienia muszą odzwierciedlać rozdział odpowiedzialności między operacją, compliance i payroll,
- testy powinny obejmować nie tylko happy path, ale też opóźnione dane, korekty po eksporcie, częściowe awarie integracji, zmiany zasobów w trakcie trasy i rozjazdy między źródłami.

Obszary wymagające dalszego potwierdzenia:

- które konkretne przepisy mają być zakodowane jako twarde reguły MVP, a które jedynie jako alerty lub materiały pomocnicze,
- czy klientka potrzebuje formalnego workflow approvals dla korekt i zamknięć okresu,
- jaki poziom retencji i nieusuwalności danych jest oczekiwany przez klientów docelowych,
- czy dla poszczególnych rynków potrzebne będą różne konfiguracje compliance.

### 9. Wzorce, anty-wzorce i lekcje dla zespołu

#### Co w tej domenie zwykle działa dobrze

- jawne rozdzielenie `plan`, `execution`, `review`, `settlement`,
- normalizacja źródeł danych z zachowaniem widoczności ich pochodzenia i świeżości,
- workflow wyjątków z ownerem, statusem, priorytetem i śladem decyzji,
- twarde ograniczenie, kto może korygować które dane i na jakim etapie lifecycle,
- projektowanie dashboardów pod wyjątki i niepewność, a nie tylko pod idealny przebieg dnia.

#### Jakie uproszczenia są bezpieczne w MVP

- brak automatycznej optymalizacji tras,
- ograniczona liczba integracji startowych,
- eksport do zewnętrznego payrollu zamiast pełnego payroll engine,
- wspieranie alertów i review zamiast pełnej automatycznej interpretacji prawnej.

#### Jakie uproszczenia są ryzykowne

- jeden wspólny model uprawnień dla dispatchera, compliance i payroll,
- ukryte nadpisywanie danych bez audytu,
- statusy binarne `ok / problem` bez poziomu pewności i bez rozróżnienia typu wyjątku,
- brak lifecycle danych po eksporcie,
- brak modelu dla opóźnionych, częściowych albo sprzecznych danych źródłowych.

#### Gdzie trzeba uważać przy user stories i acceptance criteria

- story o alertach compliance nie może kończyć się na "system pokazuje alert"; trzeba określić ownera, status, wpływ downstream i warunki zamknięcia,
- story o ręcznej korekcie musi zawierać powód, audit log i reguły uprawnień,
- story o eksporcie do ERP musi obejmować idempotencję, częściowe błędy i status paczki,
- story o plannerze musi rozróżniać konflikt blokujący, ostrzegawczy i override z uzasadnieniem,
- story o dashboardzie musi uwzględniać stany `partial`, `stale`, `awaiting review`, a nie tylko szczęśliwe dane pełne.

### 10. Handoff do `REQUIREMENTS.md` i dokumentacji produktu

#### Mapowanie do `REQUIREMENTS.md`

#### `## Klient`

- doprecyzować, że produkt działa w domenie operacyjnego transportu drogowego z silnym komponentem compliance i rozliczeń,
- dodać, że system ma wspierać decyzje i workflow wyjątków, a nie tylko prezentować telemetrię,
- zaznaczyć, że krytyczna wartość biznesowa to redukcja ręcznych korekt oraz lepsza audytowalność decyzji.

#### `## Funkcjonalności`

- dodać lifecycle obiektów: plan, execution, review, settlement,
- dodać workflow alertów i ownerów wyjątków,
- dopisać ręczne korekty z uzasadnieniem i audit trail,
- dopisać status świeżości i kompletności danych integracyjnych,
- dopisać blokady lub ostrzeżenia przed eksportem przy otwartych wyjątkach.

#### `## Routing`

- routing powinien odzwierciedlać główne konteksty pracy: planowanie, monitoring, review wyjątków, rozliczenie, administracja,
- nie należy projektować routingu wyłącznie wokół modułów UI; trzeba odzwierciedlić lifecycle danych i role użytkowników,
- warto przewidzieć oddzielne wejścia dla alert queues, korekt i eksportów.

#### `## i18n`

- jeśli produkt ma wejść do DACH, trzeba od początku założyć wielojęzyczność komunikatów operacyjnych i compliance,
- słownik domenowy powinien być kontrolowany centralnie, bo dosłowne tłumaczenia pojęć mogą zmieniać znaczenie operacyjne,
- komunikaty statusów i poziomów pewności nie powinny być tłumaczone ad hoc bez walidacji domenowej.

#### `## Uwagi dodatkowe`

- system nie może obiecywać pełnej zgodności prawnej bez jasno określonego poziomu pewności,
- traceability i audit log są wymaganiami rdzeniowymi, nie dodatkowymi,
- model uprawnień musi odzwierciedlać segregation of duties,
- projekt musi obsługiwać dane opóźnione, częściowe i sprzeczne,
- wyjątki operacyjne są podstawową ścieżką projektową, a nie skrajnym dodatkiem.

#### Mapowanie do `docs/product`

- `02-scope/business-rules.md` — opisać reguły przypisania, override, zamykania okresu, ręcznych korekt, właścicieli alertów i wpływu wyjątków na eksport,
- `02-scope/non-functional-requirements.md` — dopisać auditability, traceability, idempotencję eksportów, świeżość danych, odporność na opóźnienia i role-based access,
- `03-domain/user-journeys.md` — rozpisać journeys dla dispatchera, compliance specialist i payroll specialist,
- `03-domain/process-flows.md` — dodać flow od planu do settlement oraz osobny flow dla review wyjątku,
- `03-domain/roles-and-permissions.md` — dokument obowiązkowy; domena wymaga wyraźnego rozdziału ról i uprawnień,
- `03-domain/data-entities.md` — zdefiniować `Route Plan`, `Trip Execution`, `Event Stream`, `Compliance Alert`, `Manual Correction`, `Settlement Item`, `Export Batch`, `Audit Record`,
- `03-domain/integrations.md` — obowiązkowo opisać źródła danych, poziom zaufania, retry i mapowanie zdarzeń,
- `04-backlog/epics.md` — wydzielić epiki dla planning, execution visibility, compliance review, settlement i integrations,
- `04-backlog/features.md` — rozbić feature'y według lifecycle i ról, nie tylko wg ekranów,
- `04-backlog/story-map.md` — obowiązkowo pokazać zależność między scenariuszami planowania, wykonania, review i eksportu,
- `04-backlog/user-stories/*` — każde story integracyjne, korekcyjne lub compliance musi zawierać AC dla wyjątków i audytu,
- `05-quality/test-scenarios.md` — dodać testy dla opóźnionych danych, konfliktów źródeł, korekt po eksporcie, override z uzasadnieniem, częściowych awarii integracji, zamkniętego okresu,
- `07-compliance/compliance-requirements.md` — dokument obowiązkowy; wskazać zakres odpowiedzialności systemu versus człowieka,
- `07-compliance/security-and-privacy.md` — obowiązkowo opisać dostęp do danych kierowców, retencję, audit trail i zasady modyfikacji.

Żaden z tych artefaktów nie powinien być pominięty. To klasyczny przypadek, w którym zbyt lekka dokumentacja prowadzi do pozornie szybkiego backlogu, ale bardzo wolnej i ryzykownej implementacji.

### 11. Implikacje dla backlogu i user stories

#### Kandydaci na epiki i features wynikające z domeny

- `EP-001 Planning and Assignment` — feature'y: plan zlecenia, przypisanie kierowcy i pojazdu, walidacje konfliktów, override workflow,
- `EP-002 Execution Visibility` — feature'y: event stream, status świeżości danych, widok rozjazdu plan vs execution,
- `EP-003 Compliance Review` — feature'y: alert queue, szczegóły alertu, decyzja, uzasadnienie, owner, audit trail,
- `EP-004 Settlement Readiness` — feature'y: status gotowości do eksportu, blokady okresu, korekta po eksporcie,
- `EP-005 Integrations and Data Trust` — feature'y: ingest, mapowanie zdarzeń, idempotencja eksportów, monitoring jakości danych,
- `EP-006 Security and Governance` — feature'y: role, permissions, segregation of duties, access audit.

#### Story Hotspots

- story o plannerze bez modelu konfliktów i override,
- story o alertach bez lifecycle i ownera,
- story o manual correction bez powodu i audytu,
- story o eksporcie bez statusów paczki, retry i idempotencji,
- story o dashboardzie bez rozróżnienia danych świeżych, opóźnionych i niekompletnych,
- story o roli użytkownika napisane jako "admin może wszystko",
- story o zgodności prawnej, które sugeruje automatyczny werdykt bez zdefiniowania poziomu pewności i granicy odpowiedzialności.

#### Reguły biznesowe i warunki brzegowe do acceptance criteria

- system musi odróżniać dane źródłowe od danych skorygowanych,
- każda istotna korekta wymaga powodu, autora i czasu wykonania,
- eksport nie może przejść jako `successful`, jeśli tylko część danych została przekazana,
- zamknięty okres nie może być modyfikowany bez specjalnej ścieżki i audytu,
- alert musi mieć status, ownera i warunki zamknięcia,
- konflikt planowania może być blokujący albo ostrzegawczy; oba typy wymagają różnych AC,
- status zgodności nie może być kategoryczny przy niekompletnych danych,
- system musi sygnalizować świeżość danych z integracji.

#### NFR, kontrole operacyjne i zależności

- audit trail dla planu, korekt, decyzji i eksportów,
- wysoka czytelność wyjątków przy dużej liczbie rekordów,
- traceability między planem, wykonaniem, alertem i eksportem,
- role-based access oraz segregation of duties,
- odporność na opóźnione i częściowe dane,
- idempotentny eksport i retry workflow,
- kontrola retencji i archiwizacji danych,
- monitoring jakości danych integracyjnych.

#### Pytania do zamknięcia przed refinementem

- które reguły compliance mają być twardymi walidacjami, a które tylko alertami,
- jakie role mogą zamykać alerty i wykonywać korekty po eksporcie,
- jakie źródła danych są źródłem prawdy dla pierwszego release'u,
- jak ma wyglądać polityka dla okresów zamkniętych i re-open,
- czy MVP obejmuje scenariusz zmiany kierowcy lub pojazdu w trakcie trasy,
- jaki poziom wielojęzyczności i lokalizacji regulacyjnej jest wymagany na start,
- jaki jest oczekiwany SLA dla przetwarzania danych z integracji i widoczności wyjątków.
