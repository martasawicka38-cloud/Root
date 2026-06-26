# Przykład użycia promptu `sokrates.md`

Poniżej znajduje się przykładowy rezultat, jaki AI powinno przygotować po etapie walidacji sokratejskiej już zebranych wymagań.

## Przykładowy materiał wejściowy

### [CONTEXT]

Klient: Marek Krawiec, współwłaściciel firmy instalacyjno-serwisowej obsługującej monitoring, alarmy i kontrolę dostępu dla małych firm oraz wspólnot mieszkaniowych.

Celem inicjatywy jest uporządkowanie obsługi zgłoszeń serwisowych i nowych zapytań tak, aby firma przestała gubić informacje między telefonem, WhatsAppem, SMS-ami i ustnymi ustaleniami.

### [CURRENT_REQUIREMENTS]

Aktualna lista wymagań i hipotez po wcześniejszym discovery:

- aplikacja mobilna dla techników,
- panel klienta z historią zgłoszeń i statusem sprawy,
- AI chatbot do przyjmowania zgłoszeń po godzinach pracy,
- kalendarz z wyborem dokładnej daty i godziny wizyty,
- dashboard właściciela z podglądem wszystkich spraw,
- powiadomienia SMS i e-mail,
- integracja z obecnym systemem handlowym w pierwszej fazie,
- wersja polska i angielska,
- wszystkie powyższe elementy oznaczone przez klienta jako `must`.

### [CLIENT_INTERVIEW]

Najważniejsze informacje z rozmów:

- najwięcej problemów powoduje to, że zgłoszenia przychodzą różnymi kanałami i część informacji ginie,
- klientom często trudno od razu opisać problem; część wysyła zdjęcia lub dzwoni ponownie z doprecyzowaniem,
- technicy pracują głównie w terenie i nie chcą instalować kolejnego ciężkiego narzędzia,
- dokładna godzina wizyty zwykle i tak nie może być potwierdzona od razu, bo zależy od trasy, dostępności ludzi i priorytetu awarii,
- właściciel chce ograniczyć liczbę telefonów typu `czy już wiadomo, kiedy ktoś przyjedzie?`,
- firma miała kiedyś nieudane wdrożenie zbyt rozbudowanego systemu i ma niski poziom zaufania do wielkiego MVP,
- około 90% klientów to lokalni polskojęzyczni klienci B2B i wspólnoty mieszkaniowe,
- zespół biurowy jest mały i nie ma osobnej osoby tylko do obsługi wdrożenia lub administracji systemem.

### [SPECIALIST_OUTPUTS]

Wnioski z wcześniejszych etapów:

- `smallTalk.md`: founder jest pragmatyczny, operacyjny i ma niski próg tolerancji na fluff,
- `adaptability.md`: największym ryzykiem nie jest brak pomysłów na funkcje, tylko gotowość zespołu do używania nowego procesu,
- `customerReview.md`: discovery zebrało szeroki wishlist funkcjonalny, ale bez jasnego rozdzielenia `must now` vs `not now`.

### [KNOWN_CONSTRAINTS]

- budżet pierwszej fazy: około 45 000 PLN,
- oczekiwany termin startu: 8 tygodni,
- brak dedykowanego PM-a po stronie klienta,
- rozwiązanie musi dobrze działać na telefonie, ale bez wymuszania instalacji aplikacji,
- firma nie chce powtarzać wdrożenia, które wymaga długich szkoleń i dużej zmiany nawyków.

---

## Przykładowy wynik działania promptu

Przykład jest ułożony w tym samym rytmie co pozostałe pliki `.example.md` w discovery: klasyfikacja walidacji, synteza, mapa prawdy o wymaganiach, delta do `REQUIREMENTS.md` i następne kroki.

### 1. Klasyfikacja walidacji

- `Validation Profile`: `Product Pressure Test`
- `Confidence Level`: `wysoki`
- `Coverage`: intake zgłoszeń, kanały kontaktu, potrzeba mobile, planowanie wizyt, self-service klienta, integracje, i18n, priorytety MVP
- `Main Risks`:
  - zespół techników odrzuci rozwiązanie, jeśli będzie wymagało nowej ciężkiej aplikacji,
  - brak ownera procesu triage może zabić nawet dobre narzędzie,
  - próba dostarczenia wszystkiego w 8 tygodni rozbije scope i obniży jakość,
  - dokładne sloty wizyt mogą obiecywać coś, czego operacyjnie nie da się utrzymać,
  - integracja w pierwszej fazie może zużyć budżet bez rozwiązania głównego problemu.

### 2. Executive Summary

Walidacja sokratejska pokazała, że klient nie potrzebuje na start szerokiej platformy self-service z aplikacją, chatbotem i pełnym portalem klienta. Prawdziwy problem jest prostszy i bardziej operacyjny: firma traci informacje na wejściu, zbyt późno porządkuje zgłoszenia i nie ma spójnego sposobu przekazywania statusu między klientem, biurem i technikami.

Najmocniej potwierdzona potrzeba to jedno uporządkowane wejście dla zgłoszenia oraz prosty proces triage, który ograniczy chaos bez dokładania ciężaru wdrożeniowego. Część wymagań z listy `must` okazała się skrótem myślowym albo próbą zabezpieczenia się `na wszelki wypadek`, a nie faktycznym MVP. W wyniku walidacji zakres pierwszej fazy powinien zostać odchudzony, a priorytety przesunięte w stronę prostego mobile web, jasnego ownershipu procesu i czytelnej komunikacji statusu.

### 3. Requirement Truth Map

#### Confirmed Truths

- firma potrzebuje jednego uporządkowanego kanału przyjmowania zgłoszeń,
- największy koszt biznesowy powoduje dziś utrata informacji, a nie brak zaawansowanych funkcji self-service,
- rozwiązanie musi działać dobrze na telefonie po stronie techników i biura,
- klient końcowy potrzebuje jasnego potwierdzenia, że zgłoszenie zostało przyjęte i kiedy może spodziewać się odpowiedzi,
- technicy potrzebują szybkiego podglądu kontekstu zgłoszenia, ale nie chcą kolejnej rozbudowanej aplikacji,
- pełna obietnica dokładnej godziny wizyty nie jest zgodna z realnym procesem operacyjnym.

#### Reframed Needs

- `aplikacja mobilna dla techników` -> prawdziwa potrzeba to `lekki mobile-first widok zgłoszenia bez instalacji aplikacji`,
- `panel klienta` -> prawdziwa potrzeba to `potwierdzenie przyjęcia zgłoszenia i podstawowy status komunikacyjny`, nie pełny portal samoobsługowy,
- `kalendarz z dokładną godziną` -> prawdziwa potrzeba to `zebranie preferowanego terminu i późniejsze potwierdzenie przez firmę`,
- `dashboard właściciela` -> prawdziwa potrzeba to `prosta kolejka spraw i ich statusów`, a nie szeroki dashboard zarządczy,
- `wersja angielska` -> prawdziwa potrzeba jest obecnie słaba; na dziś to raczej opcja wzrostowa niż wymaganie MVP.

#### Weak Assumptions

- że chatbot AI realnie rozwiąże problem utraty informacji lepiej niż prosty ustrukturyzowany formularz i triage,
- że wszyscy użytkownicy potrzebują własnego panelu już w pierwszej fazie,
- że integracja z obecnym systemem handlowym jest konieczna przed uporządkowaniem podstawowego procesu,
- że klient końcowy najbardziej potrzebuje samodzielnego śledzenia sprawy, a nie szybkiej odpowiedzi i jasnego kontaktu,
- że wersja angielska ma uzasadnienie biznesowe już teraz.

#### Contradictions

- `chcemy niski próg wejścia dla zespołu` vs `wdrażamy pełną aplikację mobilną z nowym procesem`,
- `musimy dowieźć w 8 tygodni` vs `wszystko ma być must`,
- `nie chcemy przepalić się na zbyt dużym wdrożeniu` vs `AI + portal klienta + integracja + dashboard w pierwszym etapie`,
- `dokładna godzina wizyty` vs rzeczywistość pracy zależnej od trasy, priorytetu awarii i zmian w terenie.

#### Open Questions

- kto dokładnie jest ownerem triage zgłoszeń w dni robocze i po godzinach,
- czy załączniki, np. zdjęcia usterek, są krytyczne już w MVP,
- czy klient powinien widzieć tylko potwierdzenie przyjęcia, czy również uproszczony status typu `w trakcie planowania`,
- czy SMS jest naprawdę potrzebny, czy wystarczy e-mail i kontakt telefoniczny w krytycznych przypadkach,
- jaka liczba zgłoszeń tygodniowo realnie przechodzi przez system i które typy zgłoszeń są najpilniejsze.

#### Missing Evidence

- brak danych o realnej skali utraconych lub niepełnych zgłoszeń,
- brak pomiaru, ilu klientów rzeczywiście potrzebowałoby wersji angielskiej,
- brak potwierdzenia, czy technicy zaakceptują mobile web bez dodatkowego oporu,
- brak rozpisanych kategorii zgłoszeń i zasad priorytetyzacji,
- brak decyzji, czy status dla klienta ma charakter informacyjny czy operacyjnie zobowiązujący.

### 4. Requirement Delta Log

#### New Requirements

- `Triage ownership i SLA odpowiedzi` — `confirmed`
  - Uzasadnienie biznesowe: bez właściciela procesu nawet dobre narzędzie nie zamknie chaosu.
  - Wpływ na zakres: trzeba dopisać regułę operacyjną, kto i w jakim czasie obsługuje nowe zgłoszenie.

- `Lekki mobile-first podgląd sprawy dla technika` — `confirmed`
  - Uzasadnienie biznesowe: technik potrzebuje szybkiego dostępu do danych w terenie bez bariery instalacji.
  - Wpływ na zakres: wymusza prosty interfejs webowy zamiast ciężkiej aplikacji natywnej.

#### Refined Requirements

- `Planowanie terminu wizyty` — `refined`
  - Uzasadnienie biznesowe: firma nie może wiarygodnie obiecać dokładnego slotu na etapie pierwszego zgłoszenia.
  - Wpływ na zakres: zamiast wyboru konkretnej godziny MVP zbiera preferowany dzień i przedział oraz potwierdza termin później.

- `Dashboard właściciela` — `refined`
  - Uzasadnienie biznesowe: główną wartością jest widok kolejki i statusów, nie analityka zarządcza.
  - Wpływ na zakres: redukcja do prostego panelu operacyjnego.

- `Powiadomienia` — `refined`
  - Uzasadnienie biznesowe: trzeba potwierdzić przyjęcie i ewentualnie ważne zmiany, ale nie budować od razu rozbudowanego silnika komunikacji.
  - Wpływ na zakres: ograniczenie automatyzacji do kilku kluczowych momentów procesu.

#### Split Requirements

- `Panel klienta` — `split`
  - Uzasadnienie biznesowe: pod jednym hasłem kryją się co najmniej trzy potrzeby: potwierdzenie zgłoszenia, status komunikacyjny i historia spraw.
  - Wpływ na zakres: do MVP wchodzi tylko potwierdzenie i ewentualnie prosty status; historia zgłoszeń zostaje osobnym kandydatem na później.

- `Integracja z systemem handlowym` — `split`
  - Uzasadnienie biznesowe: trzeba oddzielić prosty eksport lub przekazanie danych od pełnej integracji dwukierunkowej.
  - Wpływ na zakres: MVP może działać bez głębokiej integracji, jeśli proces triage zostanie uporządkowany.

#### Deferred Requirements

- `Wersja angielska` — `deferred`
  - Uzasadnienie biznesowe: brak dowodu, że dziś odpowiada za istotną część przychodu lub utraconych leadów.
  - Wpływ na zakres: nie powinna blokować MVP.

- `Pełna historia zgłoszeń po stronie klienta` — `deferred`
  - Uzasadnienie biznesowe: to rozszerzenie wygody, nie rdzeń obecnego problemu.
  - Wpływ na zakres: kandydat do etapu 2 po sprawdzeniu, czy klienci rzeczywiście tego chcą.

- `Rozbudowane raporty właścicielskie` — `deferred`
  - Uzasadnienie biznesowe: najpierw trzeba zebrać dane w spójny sposób.
  - Wpływ na zakres: raporty mają sens dopiero po ustabilizowaniu procesu wejścia.

#### Rejected or Removed Requirements

- `AI chatbot do przyjmowania zgłoszeń` — `rejected`
  - Uzasadnienie biznesowe: nie ma dowodu, że chatbot rozwiąże problem lepiej niż prosty, czytelny formularz z dobrym triage.
  - Wpływ na zakres: usuwa kosztowny i ryzykowny eksperyment z MVP.

- `Obowiązkowa instalacja aplikacji mobilnej przez techników` — `rejected`
  - Uzasadnienie biznesowe: stoi w sprzeczności z niskim progiem wejścia i ryzykiem adopcji.
  - Wpływ na zakres: kierunek techniczny powinien pozostać web-first.

### 5. Priorytety po walidacji

#### Must

- jedno ustrukturyzowane wejście dla zgłoszeń,
- jasny owner triage i odpowiedź w uzgodnionym czasie,
- mobile-first widok sprawy dla biura i techników,
- potwierdzenie przyjęcia zgłoszenia dla klienta,
- możliwość zebrania preferowanego terminu i podstawowych danych problemu.

#### Should

- uproszczony status sprawy dla klienta,
- podstawowe załączniki do zgłoszenia,
- minimalny panel operacyjny kolejki i priorytetów,
- ograniczone powiadomienia o kluczowych zmianach.

#### Could

- prosty eksport danych do obecnego systemu,
- dodatkowe kategorie zgłoszeń i reguły routingu,
- rozszerzone statusy klienta,
- angielska wersja wybranych elementów, jeśli potwierdzi się potrzeba.

#### Not Now

- AI chatbot,
- pełny portal klienta,
- dokładny self-booking z konkretnym slotem,
- pełna integracja dwukierunkowa z systemem handlowym,
- rozbudowany dashboard i raportowanie zarządcze.

### 6. Handoff do `REQUIREMENTS.md`

#### `## Klient`

- `Dodać`:
  - głównym celem projektu jest ograniczenie utraty informacji i skrócenie czasu od zgłoszenia do pierwszej odpowiedzi,
  - zespół operacyjny ma niski próg akceptacji dla ciężkich wdrożeń i nowych narzędzi wymagających dużej zmiany nawyków.
- `Zmienić`:
  - opisać główną wartość jako `porządek operacyjny i czytelny triage`, a nie `pełną cyfryzację całego procesu`.
- `Usunąć / Obniżyć priorytet`:
  - narrację, że od pierwszej fazy potrzebny jest pełny self-service klienta.

#### `## Funkcjonalności`

- `Dodać`:
  - ustrukturyzowane przyjmowanie zgłoszeń,
  - owner procesu i SLA odpowiedzi,
  - mobile-first podgląd sprawy,
  - potwierdzenie przyjęcia zgłoszenia,
  - preferowany termin zamiast dokładnego slotu.
- `Zmienić`:
  - `panel klienta` na `uproszczona komunikacja statusu`,
  - `dashboard` na `panel operacyjny kolejki`.
- `Usunąć / Obniżyć priorytet`:
  - AI chatbot,
  - obowiązkową aplikację mobilną,
  - pełną integrację w MVP.

#### `## Routing`

- `Dodać`:
  - prosty przepływ zgłoszenia i widoku sprawy,
  - osobny widok lub moduł dla kolejki operacyjnej.
- `Zmienić`:
  - nie zakładać od razu rozbudowanego portalu klienta z wieloma ścieżkami.

#### `## i18n`

- `Dodać`:
  - decyzję, że MVP domyślnie działa po polsku.
- `Usunąć / Obniżyć priorytet`:
  - pełną wersję angielską z pierwszego etapu, dopóki nie ma twardego uzasadnienia biznesowego.

#### `## Deployment`

- `Dodać`:
  - wymóg prostego utrzymania bez dedykowanego administratora po stronie klienta,
  - założenie, że rozwiązanie ma minimalizować koszt wsparcia i szkolenia.

#### `## Uwagi dodatkowe`

- `Dodać`:
  - adopcja zespołu jest ryzykiem krytycznym,
  - nie wolno obiecywać klientowi dokładnego slotu wizyty, jeśli proces terenowy tego nie gwarantuje,
  - MVP ma najpierw ustabilizować proces wejścia, dopiero później rozbudowywać self-service i raportowanie.

### 7. Handoff do `docs/product`

- `docs/product/01-discovery/interview-summary.md`
  - dopisać, że pierwotna lista `must` została odchudzona po walidacji i część pozycji była bardziej preferencją niż realną potrzebą.

- `docs/product/01-discovery/assumptions-and-open-questions.md`
  - przenieść tam kwestie SMS vs e-mail, potrzeby załączników, ownera triage i sensowności wersji angielskiej.

- `docs/product/02-scope/business-goals.md`
  - ustawić nadrzędny cel na porządek operacyjny i redukcję utraty informacji.

- `docs/product/02-scope/business-rules.md`
  - dodać reguły triage, potwierdzania zgłoszeń i sposobu komunikacji terminu.

- `docs/product/02-scope/non-functional-requirements.md`
  - dopisać mobile-first, niski próg wdrożenia i prostotę obsługi jako krytyczne NFR.

- `docs/product/03-domain/process-flows.md`
  - rozrysować aktualny i docelowy przepływ zgłoszenia od klienta do technika.

- `docs/product/04-backlog/features.md`
  - rozbić `panel klienta` i `integrację` na mniejsze, niezależne feature'y.

- `docs/product/04-backlog/backlog-priority.md`
  - zaktualizować priorytety według `Must / Should / Could / Not Now` po walidacji.

- `docs/product/06-delivery/risks.md`
  - dopisać ryzyko adopcji zespołu i ryzyko obietnic terminowych niewspieranych przez operacje.

### 8. Następne kroki

#### Pytania, które trzeba jeszcze zadać

- kto dokładnie bierze odpowiedzialność za pierwszą odpowiedź na nowe zgłoszenie,
- jakie minimalne pola musi zawierać zgłoszenie, żeby technik mógł ruszyć z diagnozą,
- czy załączniki są potrzebne od razu, czy mogą wejść w drugiej iteracji,
- jaki status może być pokazany klientowi bez generowania fałszywej obietnicy,
- czy istnieją typy zgłoszeń, które wymagają osobnej ścieżki priorytetu.

#### Zalecane warsztaty lub dalsze discovery

- krótki warsztat z osobą z biura, która dziś koordynuje zgłoszenia,
- rozmowa z 1-2 technikami o minimalnym akceptowalnym sposobie pracy mobilnej,
- jeśli nadal niejasna pozostaje gotowość zespołu do zmiany, wrócić jeszcze raz do `adaptability.md` dla doprecyzowania adopcji procesu.

#### Gotowość do dalszego etapu

Materiał jest gotowy do aktualizacji `REQUIREMENTS.md`, ale nie powinien jeszcze przejść do implementacji bez dopisania reguł triage i potwierdzenia minimalnego workflow operacyjnego. Po wprowadzeniu tej delty można przejść do aktualizacji backlogu i doprecyzowania feature'ów w `customerReview.md` lub dokumentach `docs/product/04-backlog/`.
