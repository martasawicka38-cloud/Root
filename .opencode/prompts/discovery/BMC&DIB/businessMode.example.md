# Przykład użycia promptu `businessMode.md`

Poniżej znajduje się przykładowy rezultat, jaki AI powinno przygotować po rozmowie discovery z klientem.

## Przykładowy kontekst rozmowy z klientem

Klient: Marta Zielinska, współzałożycielka firmy `ColdMap`, która buduje usługę B2B dla właścicieli i zarządców sieci sklepów spożywczych oraz małych magazynów z chłodniami.

Najważniejsze informacje z rozmowy:

- firma oferuje system do monitorowania temperatury urządzeń chłodniczych, zgłaszania awarii i planowania serwisu,
- głównym klientem są sieci od 5 do 80 lokalizacji oraz operatorzy małych magazynów, którzy dziś polegają na ręcznych checklistach, telefonach i arkuszach,
- biznes jest po etapie pilotażu; ma 6 płacących klientów i chce uporządkować model przed dalszą sprzedażą,
- główny problem klienta to brak bieżącej widoczności temperatur, reaktywne usuwanie awarii i ryzyko strat towaru,
- wartość oferty polega na wcześniejszym wykrywaniu problemów, dokumentowaniu zgodności i skróceniu czasu reakcji serwisu,
- model przychodów jest abonamentowy: opłata wdrożeniowa za lokalizację oraz miesięczna opłata za aktywne urządzenie i dashboard,
- kanały sprzedaży to outbound founder-led sales, partnerzy serwisowi HVAC/chłodnictwa oraz polecenia po pilotażach,
- kluczowe zasoby to software, integracje z czujnikami IoT, relacje z partnerami serwisowymi i know-how operacyjne,
- koszty koncentrują się wokół developmentu, utrzymania infrastruktury, onboardingu i wsparcia wdrożeniowego,
- firma zbiera dane z czujników temperatury, statusy alarmów, czas reakcji serwisu, historię incydentów, podstawowe dane użytkowników i konfigurację lokalizacji,
- dane są już zbierane automatycznie, ale raportowanie dla klientów i wewnętrzne alerting rules są jeszcze niedojrzałe,
- zespół ma kompetencje software'owe, ale nie ma jeszcze formalnego data ownera ani spisanych zasad retencji i jakości danych,
- część klientów oczekuje raportów zgodności i przewidywania awarii, ale firma nie ma jeszcze gotowego produktu predykcyjnego,
- biznes przetwarza głównie dane operacyjne, ale ma też dane osobowe użytkowników systemu i kontaktów serwisowych,
- największa szansa biznesowa to wejście w model `monitoring + predictive maintenance + compliance reporting`,
- największe ryzyko to zbyt duża zależność od founder-led sales i niedoszacowanie kosztu onboardingu urządzeń.

---

## Przykładowy wynik działania promptu

Przykład jest ułożony w tym samym rytmie co pozostałe pliki `.example.md` w discovery: klasyfikacja, synteza, stan wiedzy, główna struktura wynikowa, ryzyka i handoff do `REQUIREMENTS.md` oraz `docs/product/`.

### 1. Klasyfikacja inicjatywy

- `Business Stage`: `Operating`
- `Data Maturity`: `Managed Data`
- `Confidence Level`: `średni`
- `Model Readiness`: model jest wystarczająco ukształtowany, aby przejść do dalszego scope'u produktu i walidacji przewagi danych, ale nadal wymaga doprecyzowania ekonomii onboardingu, partner channel fit i ownership danych

Uzasadnienie: biznes ma już pierwszych klientów, płatne wdrożenia i wyraźny problem rynkowy, więc nie jest na etapie czystej hipotezy. Jednocześnie dane są zbierane w sposób operacyjny, ale nie są jeszcze zarządzane jako aktywo strategiczne, a część kluczowych elementów modelu wciąż zależy od pracy founderów i manualnych działań.

### 2. Executive Summary

`ColdMap` rozwiązuje konkretny problem operacyjny: pomaga sieciom sklepów i operatorom małych chłodni ograniczyć ryzyko strat towaru, poprawić reakcję na awarie i uporządkować dokumentację związaną z temperaturą oraz serwisem. Model biznesowy opiera się na połączeniu software'u, urządzeń IoT i procesów obsługi incydentów, a jego przewaga wynika z połączenia monitoringu, alertów i wiedzy operacyjnej o chłodnictwie.

Największa siła modelu to wysoka dotkliwość problemu klienta i realna wartość w redukcji strat. Największe napięcia dotyczą skalowalności sprzedaży, kosztu wdrożenia oraz tego, czy firma zdoła zamienić zebrane dane w trwałą przewagę produktową, np. raporty zgodności, benchmarking i predykcję awarii.

### 3. Business Model Canvas

#### Segmenty klientów

- główny segment to sieci spożywcze i operatorzy chłodni z rozproszonymi lokalizacjami, którzy mają urządzenia chłodnicze krytyczne dla ciągłości sprzedaży lub magazynowania,
- użytkownikiem operacyjnym jest zwykle manager obiektu, maintenance coordinator albo osoba odpowiedzialna za jakość i infrastrukturę,
- nabywcą lub sponsorem budżetu bywa COO, operations manager, właściciel sieci albo dyrektor techniczny,
- najważniejszy segment na obecnym etapie to firmy z 5-80 lokalizacjami, bo są już zbyt duże na ręczne zarządzanie, ale nadal podejmują decyzje szybciej niż duży enterprise,
- `Open Question`: czy osobnym segmentem powinny być partnerzy serwisowi jako kanał dystrybucji, czy jako niezależny typ klienta z własnym panelem i ofertą white-label.

#### Propozycja wartości

- ciągły monitoring temperatury i stanu urządzeń zamiast ręcznych kontroli,
- szybsze wykrywanie odchyleń i awarii zanim doprowadzą do strat towaru,
- uporządkowana historia incydentów, alarmów i interwencji serwisowych,
- możliwość pokazania zgodności operacyjnej i raportowania bez ręcznego składania danych,
- przewaga nad alternatywami wynika z połączenia monitoringu, workflow reagowania i docelowo warstwy analitycznej,
- `Assumption`: dla części klientów najmocniejszą wartością nie jest sam monitoring, ale obniżenie kosztu chaosu operacyjnego i presji audytowej.

#### Kanały

- founder-led outbound sales do sieci i operatorów lokalizacji,
- partnerstwa z firmami serwisowymi HVAC/chłodnictwo, które mogą rekomendować system jako rozszerzenie opieki serwisowej,
- referencje po wdrożeniach pilotażowych,
- proces dostarczenia wartości odbywa się przez onboarding lokalizacji, konfigurację urządzeń i wdrożenie dashboardów oraz alertów,
- `Open Question`: który kanał jest bardziej skalowalny ekonomicznie w horyzoncie 12 miesięcy: sprzedaż bezpośrednia czy partnerzy serwisowi.

#### Relacje z klientami

- relacja sprzedażowa jest dziś high-touch i founder-led,
- onboarding wymaga bliskiej współpracy operacyjnej z klientem i często z partnerem serwisowym,
- utrzymanie klienta opiera się na regularnym korzystaniu z alertów, dashboardów i raportów,
- retencję może zwiększać efekt wdrożenia danych historycznych, integracji i raportów compliance,
- `Risk`: jeśli onboarding pozostanie zbyt ręczny i niestandaryzowany, wzrost liczby klientów będzie kosztowny i trudny do utrzymania.

#### Strumienie przychodów

- opłata wdrożeniowa za lokalizację i konfigurację,
- miesięczny abonament za aktywne urządzenie / lokalizację / dostęp do dashboardu,
- potencjalny przyszły przychód z modułów premium: predykcja awarii, raporty zgodności, benchmarki wielolokalizacyjne,
- przychód jest częściowo powtarzalny, ale jego rentowność zależy od kosztu pozyskania i wdrożenia klienta,
- `Open Question`: czy model cenowy powinien być liczony per urządzenie, per lokalizacja czy hybrydowo z minimum miesięcznym.

#### Kluczowe zasoby

- platforma software'owa i infrastruktura do zbierania danych z urządzeń,
- kompetencje zespołu w software, IoT i procesach operacyjnych chłodnictwa,
- relacje z partnerami serwisowymi i dostawcami hardware,
- dane historyczne o alarmach, temperaturach i czasach reakcji,
- zaufanie klientów do poprawności alertów i raportów,
- `Gap`: brak formalnego ownera danych i dojrzałego governance osłabia wykorzystanie jednego z najcenniejszych zasobów.

#### Kluczowe działania

- rozwój i utrzymanie platformy,
- integracja urządzeń i konfiguracja lokalizacji,
- obsługa alarmów, workflow incydentów i logiki powiadomień,
- sprzedaż i edukacja rynku,
- wdrożenia klientów oraz support operacyjny,
- rozwój warstwy raportowej i analitycznej,
- `Risk`: jeśli firma nie zautomatyzuje części onboardingu i konfiguracji, kluczowe działania będą zjadały zbyt dużo czasu zespołu.

#### Kluczowi partnerzy

- partnerzy serwisowi HVAC/chłodnictwo,
- dostawcy czujników i hardware'u,
- dostawcy infrastruktury chmurowej i komunikacji urządzeń,
- kluczowi klienci pilotażowi pełniący rolę źródła feedbacku i referencji,
- potencjalnie kancelaria / konsultant privacy-compliance przy skalowaniu danych i raportowania,
- `Open Question`: jak silna jest zależność modelu od konkretnych vendorów hardware i czy można ją obniżyć.

#### Struktura kosztów

- development produktu i utrzymanie infrastruktury,
- onboarding lokalizacji i konfiguracja urządzeń,
- sprzedaż bezpośrednia prowadzona przez founderów,
- wsparcie klienta i obsługa incydentów,
- partnerstwa, logistyka hardware'u i ewentualne koszty wymiany urządzeń,
- przyszłe koszty compliance, bezpieczeństwa i raportowania,
- model jest dziś bardziej `value-driven`, ale bez kontroli kosztów wdrożenia może mieć słabą ekonomię skali.

### 4. Data Innovation Board

#### Dane jako zasób

- `Score 1-5`: `4`
- `Current State`: firma zbiera ciągły strumień danych o temperaturze, alarmach, incydentach i interwencjach oraz posiada kontekst lokalizacji i użytkowników.
- `Strengths`: dane powstają naturalnie w trakcie korzystania z produktu; są bezpośrednio związane z wartością biznesową klienta.
- `Gaps`: nie wszystkie dane są jeszcze jednoznacznie zmapowane na use case'y produktowe i komercyjne.
- `Recommended Next Move`: zdefiniować katalog kluczowych datasetów i powiązać je z roadmapą: compliance reporting, SLA tracking, predictive maintenance.

#### Jakość i dostępność danych

- `Score 1-5`: `3`
- `Current State`: dane są zbierane automatycznie, ale ich jakość, kompletność i ownership nie są jeszcze formalnie zarządzane.
- `Strengths`: automatyczne źródła danych ograniczają ręczne błędy i dają potencjał do skalowalnego raportowania.
- `Gaps`: brak formalnych standardów jakości, brak data ownera, niepełne zasady retencji i niewystarczająca widoczność braków danych.
- `Recommended Next Move`: wdrożyć podstawowy data governance layer: ownership, schematy jakości, alerty braków danych i politykę retencji.

#### Wartość z danych

- `Score 1-5`: `3`
- `Current State`: dane wspierają monitoring i reakcję na incydenty, ale nie zostały jeszcze w pełni opakowane jako produktowa przewaga premium.
- `Strengths`: istnieją wyraźne use case'y o wysokiej wartości: raporty zgodności, analiza czasów reakcji, wykrywanie wzorców awarii.
- `Gaps`: brakuje wyceny tych use case'ów, priorytetyzacji i jasnej narracji sprzedażowej wokół danych.
- `Recommended Next Move`: wybrać jeden use case o najwyższej wartości biznesowej i dostarczyć go jako płatny lub wyróżniający moduł, zamiast rozpraszać się na kilka pomysłów naraz.

#### Gotowość organizacji

- `Score 1-5`: `3`
- `Current State`: zespół ma mocne kompetencje produktowo-techniczne, ale governance danych i operacyjna odpowiedzialność są jeszcze niedojrzałe.
- `Strengths`: founderzy rozumieją problem domenowy i potrafią budować software pod realny workflow klienta.
- `Gaps`: brak przypisanego ownera danych, brak formalnych rytmów analitycznych i ryzyko przeciążenia founderów.
- `Recommended Next Move`: przypisać odpowiedzialność za dane oraz ustalić cykl kwartalny dla decyzji produktowych opartych na danych z wdrożeń.

#### Ryzyka i regulacje

- `Score 1-5`: `2`
- `Current State`: firma operuje głównie na danych operacyjnych, ale ma też dane osobowe użytkowników i kontaktów, bez w pełni uporządkowanych zasad compliance.
- `Strengths`: profil ryzyka jest niższy niż w sektorach medycznych czy finansowych; główne dane biznesowe nie są szczególnie wrażliwe.
- `Gaps`: brak spisanych zasad retencji, brak pełnej mapy dostępu i obowiązków wobec danych osobowych użytkowników oraz kontaktów serwisowych.
- `Recommended Next Move`: przygotować minimum compliance pack: mapa danych, role dostępu, retencja, podstawa przetwarzania, umowy z vendorami i polityka incydentów.

#### Innowacje oparte na danych

- `Score 1-5`: `4`
- `Current State`: istnieje realny potencjał przejścia z samego monitoringu do predykcji, benchmarków i pakietów raportowych.
- `Strengths`: dane są blisko procesu biznesowego klienta i mogą przełożyć się zarówno na oszczędności, jak i dodatkowy przychód premium.
- `Gaps`: firma nie wybrała jeszcze jednej strategicznej ścieżki innowacji opartej na danych.
- `Recommended Next Move`: przetestować produktowo i handlowo jeden moduł premium oparty na danych, np. miesięczny raport ryzyka awarii i zgodności dla sieci wielolokalizacyjnych.

### 5. Confirmed / Assumptions / Open Questions / Missing Evidence

#### Confirmed

- biznes rozwiązuje kosztowny i operacyjnie istotny problem związany z chłodnictwem,
- firma ma pierwszych płacących klientów i działa po fazie pilotażu,
- model przychodów obejmuje wdrożenie i abonament,
- dane z urządzeń są już zbierane automatycznie,
- klienci sygnalizują wartość raportów i funkcji predykcyjnych,
- koszty onboardingu i wsparcia są ważnym elementem ekonomii modelu.

#### Assumptions

- średni klient będzie skłonny dopłacić za warstwę analityczną lub raportową, jeśli pokaże ona realne obniżenie ryzyka strat,
- partnerzy serwisowi mogą stać się skutecznym kanałem wzrostu, jeśli dostaną prosty model współpracy,
- dane historyczne po osiągnięciu odpowiedniej skali będą wystarczające do sensownej predykcji awarii na wybranych typach urządzeń.

#### Open Questions

- jaki jest rzeczywisty koszt pozyskania i onboardingu klienta w podziale na kanały,
- jak wygląda retencja i churn po pierwszych 6-12 miesiącach,
- który model cenowy daje najlepszą równowagę między prostotą sprzedaży a marżą,
- czy partnerzy serwisowi mają interes ekonomiczny w promowaniu rozwiązania, które może ograniczyć awarie awaryjne,
- jakie dokładnie wskaźniki i raporty są dla klientów na tyle cenne, że zwiększą gotowość do płacenia.

#### Missing Evidence

- brak twardych danych o unit economics dla różnych segmentów klientów,
- brak porównania skuteczności partner channel vs founder-led outbound,
- brak formalnej analizy jakości danych i braków telemetrycznych,
- brak dowodu, który use case danych najszybciej przełoży się na dodatkowy przychód.

### 6. Największe ryzyka i największe szanse

#### 3 największe ryzyka

- founder-led sales i onboarding mogą ograniczyć skalę, jeśli proces nie zostanie uproszczony i częściowo ustandaryzowany,
- koszty wdrożenia oraz zależność od hardware'u mogą obniżyć rentowność modelu przy szybszym wzroście,
- brak governance danych i compliance może zablokować rozwój funkcji premium i wejście do większych klientów.

#### 3 największe szanse

- wejście w warstwę premium: predictive maintenance i raporty zgodności,
- zbudowanie mocnego partner channel z firmami serwisowymi,
- wykorzystanie danych wielolokalizacyjnych do benchmarków operacyjnych i wyższej retencji klientów.

Najpilniejsze są obecnie dwa tematy: policzenie ekonomii wdrożenia oraz wybór jednego use case'u danych, który da się sprzedać jako przewagę, a nie tylko obietnicę roadmapy.

### 7. Następne kroki

- policzyć rzeczywisty koszt pozyskania, wdrożenia i utrzymania klienta dla co najmniej dwóch segmentów,
- zmapować onboarding lokalizacji i wskazać elementy do standaryzacji lub automatyzacji,
- wybrać jeden moduł premium oparty na danych i zweryfikować go z obecnymi klientami,
- przypisać ownership danych i wdrożyć minimalne standardy jakości oraz retencji,
- doprecyzować segmenty klientów i role decyzyjne przez `persona.md`,
- przejść do `customerReview.md`, jeśli celem jest rozpisanie produktu na zakres, epiki i user stories,
- przygotować materiał do `REQUIREMENTS.md` jako executive summary dla kolejnego etapu produktu.

### 8. Handoff do artefaktów repo

#### `REQUIREMENTS.md -> ## Klient`

- klientem są operatorzy sieci sklepów i chłodni z problemem monitoringu temperatur, awarii i zgodności operacyjnej,
- główną wartością jest ograniczanie strat, poprawa reakcji serwisu i lepsza widoczność operacyjna,
- obecny etap biznesu: po pilotażu, z pierwszymi płacącymi klientami.

#### `REQUIREMENTS.md -> ## Funkcjonalności`

- monitoring urządzeń i temperatur,
- alerty i workflow incydentów,
- dashboardy operacyjne,
- historia incydentów i interwencji,
- docelowo raporty zgodności i moduły analityczne premium.

#### `REQUIREMENTS.md -> ## Deployment`

- rozwiązanie wymaga stabilnej infrastruktury do zbierania telemetrii i obsługi alertów,
- wdrożenie musi uwzględniać integrację urządzeń, onboarding lokalizacji i role dostępu,
- potrzebne są minimalne zasady bezpieczeństwa, retencji i vendor management.

#### `REQUIREMENTS.md -> ## Uwagi dodatkowe`

- trzeba policzyć unit economics i koszt onboardingu,
- governance danych jest warunkiem wejścia w bardziej zaawansowane use case'y,
- partner channel wymaga osobnej walidacji ekonomicznej i operacyjnej.

#### `docs/product/01-discovery/interview-summary.md`

- opis problemu klienta, obecnego procesu monitoringu i wartości biznesowej rozwiązania,
- wnioski z rozmowy o etapie biznesu, modelu sprzedaży i głównych napięciach wzrostowych.

#### `docs/product/02-scope/business-goals.md`

- cele biznesowe: skalowalny wzrost przychodu abonamentowego, redukcja kosztu chaosu operacyjnego u klientów, rozwój warstwy danych jako przewagi konkurencyjnej.

#### `docs/product/03-domain/data-entities.md`

- urządzenia, lokalizacje, odczyty temperatury, alarmy, incydenty, interwencje serwisowe, użytkownicy, partnerzy serwisowi, raporty.

#### `docs/product/03-domain/integrations.md`

- integracje z czujnikami / gatewayami IoT, systemami powiadomień, partnerami serwisowymi i ewentualnymi systemami raportowymi klientów.

#### `docs/product/06-delivery/risks.md`

- ryzyko kosztownego onboardingu,
- ryzyko zależności od founder-led sales,
- ryzyko niedostatecznego governance danych przy skalowaniu.

#### `docs/product/07-compliance/security-and-privacy.md`

- dane osobowe użytkowników i kontaktów serwisowych,
- role dostępu,
- retencja,
- vendor risk,
- zasady obsługi incydentów i podstawowego privacy compliance.

Jeśli kolejnym krokiem ma być rozpisanie realnego produktu, naturalnym handoffem po tym discovery są `persona.md` oraz `customerReview.md`.
