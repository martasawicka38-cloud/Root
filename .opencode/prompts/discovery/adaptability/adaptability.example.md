# Przykład użycia promptu `adaptability.md`

Poniżej znajduje się przykładowy rezultat, jaki AI powinno przygotować po rozmowie discovery z klientem.

## Przykładowy kontekst rozmowy z klientem

Klient: Tomasz Nowicki, właściciel firmy `Nowicki Remonty Premium`, zatrudniającej 11 osób i realizującej wykończenia mieszkań pod klucz w Trójmieście.

Najważniejsze informacje z rozmowy:

- klient chce `wdrożyć AI`, które ma odpowiadać na zapytania, kwalifikować leady, pilnować statusów wycen i pomagać umawiać terminy,
- większość zapytań wpada dziś z telefonu, Facebooka, formularza kontaktowego i poleceń,
- nie istnieje jeden wspólny system do obsługi leadów; część informacji jest w telefonie właściciela, część w Messengerze, część w mailach, a część w arkuszu Google prowadzonym nieregularnie przez biuro,
- proces przygotowania wyceny zależy głównie od właściciela i jednej koordynatorki, która `wie, co i jak`, ale nie ma spisanego SOP-u,
- w firmie nie ma działu IT; stroną internetową i formularzem zajmuje się zewnętrzny freelancer `od czasu do czasu`,
- poprzednia próba wdrożenia CRM zakończyła się porzuceniem narzędzia po 3 tygodniach, bo handlowcy i biuro wrócili do telefonu i Messengera,
- właściciel jest bardzo decyzyjny i otwarty na eksperymenty, ale zespół operacyjny obawia się dodatkowej kontroli i podwójnego wpisywania danych,
- firma korzysta już nieformalnie z ChatGPT do pisania wiadomości i ofert, ale nie ma zasad, polityki ani wspólnego sposobu użycia,
- klient nie potrafi dziś jednoznacznie odpowiedzieć, kiedy lead jest `zakwalifikowany`, a kiedy `zamknięty bez szans`,
- koszt błędu jest istotny, bo źle obsłużony lead może oznaczać utratę zlecenia wartego kilkadziesiąt tysięcy złotych,
- klient początkowo chce `agenta end-to-end`, ale w rozmowie wychodzi, że nie ma jeszcze stabilnego procesu, danych ani jasnego ownera po wdrożeniu.

---

## Przykładowy wynik działania promptu

Przykład jest ułożony w tym samym rytmie co pozostałe pliki `.example.md` w discovery, ale z rozdziałem na część neutralną i prywatną. W `adaptability` bot zbiera dane i porządkuje diagnozę, natomiast rekomendacja dla dalszych działań trafia do notatki wewnętrznej dla prowadzącego rozmowę, a nie do komunikatu dla przedsiębiorcy.

### 1. Klasyfikacja gotowości

- `Assessment Scope`: `Organization Baseline`
- `Automation Ambition`: `Program`
- `Confidence Level`: `średni`

Uzasadnienie: klient myśli o szerokiej automatyzacji procesu sprzedażowo-operacyjnego, ale organizacja nie ma jeszcze stabilnego przepływu pracy, jednego źródła prawdy, jednoznacznych statusów ani wdrożonej kultury pracy na wspólnym narzędziu. Jednocześnie istnieje umiarkowana otwartość właściciela i pojedyncze doświadczenia z AI, co uzasadnia dalszą diagnozę, ale nie jest komunikowane respondentowi jako gotowa rekomendacja.

### 2. Executive Summary

Obecny obraz organizacji pokazuje wysoki poziom zależności od ludzi, rozproszone kanały pracy i brak jednego źródła prawdy dla leadów. Największe napięcia pojawiają się na styku właściciela, biura i przygotowania wycen. Dane i decyzje są rozproszone, a wcześniejsze wdrożenie narzędzia nie utrzymało się w codziennej praktyce zespołu.

### 3. Tabela scoringu

| Wymiar                      | Ocena       | Dowody / obserwacje                                                                                                                               | Znaczenie dla wdrożenia                                                                        |
| --------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Powtarzalność procesów      | `1/5`       | Brak spisanego procesu; przebieg wyceny zależy od właściciela i koordynatorki; nie istnieją stabilne statusy leadu ani kryteria zamknięcia sprawy | Bez stabilnego procesu automatyzacja będzie utrwalać wyjątki i ręczne obejścia                 |
| Dostępność danych           | `1/5`       | Dane są rozrzucone między telefonem, Messengerem, mailem i nieregularnym arkuszem Google; brak jednego źródła prawdy                              | AI nie ma wiarygodnego wejścia; wysokie ryzyko błędnych odpowiedzi i utraty kontekstu          |
| Otwartość zespołu na zmiany | `2/5`       | Właściciel jest entuzjastyczny, ale zespół po nieudanym wdrożeniu CRM obawia się dodatkowej pracy i kontroli                                      | Wysokie ryzyko sabotowania nowego narzędzia przez powrót do starych kanałów                    |
| Zasoby techniczne           | `2/5`       | Brak IT i brak wewnętrznego ownera technicznego; wsparcie zapewnia okazjonalnie freelancer                                                        | Nawet dobre rozwiązanie będzie kruche bez właściciela utrzymania i szybkiego wsparcia          |
| Decyzyjność                 | `4/5`       | Właściciel może szybko podjąć decyzję budżetową i operacyjną                                                                                      | To jedyny mocny filar, który może przyspieszyć uporządkowanie procesu i test małego wdrożenia  |
| Świadomość AI               | `1/5`       | AI jest używane doraźnie do pisania wiadomości, ale bez zasad, granic odpowiedzialności i realnego rozumienia ryzyk                               | Organizacja ma ciekawość, ale nie ma jeszcze dojrzałości operacyjnej do bezpiecznego wdrożenia |
| **Suma**                    | **`11/30`** | Organizacja ma wysoką motywację właściciela, ale niską gotowość operacyjną                                                                        | Wniosek do notatki prywatnej dla prowadzącego                                                  |

### 4. Confirmed / Assumptions / Open Questions / Missing Evidence

#### Confirmed

- firma chce usprawnić obsługę leadów, wycen i pierwszego kontaktu z klientem,
- obecny proces jest silnie zależny od właściciela i jednej koordynatorki,
- dane są rozproszone i nie istnieje jedno źródło prawdy,
- wcześniejsze wdrożenie CRM nie utrzymało się operacyjnie,
- właściciel jest gotowy inwestować i szybko podejmować decyzje,
- zespół operacyjny ma opór wobec narzędzi, które zwiększają formalizację pracy,
- koszt błędu jest wysoki, bo dotyczy leadów wysokiej wartości.

#### Assumptions

- część chaosu wynika nie tylko z narzędzi, ale też z braku jasnego podziału odpowiedzialności między biurem, właścicielem i handlowcami,
- gdyby powstał jeden prosty rejestr leadów z jasnymi statusami, zespół byłby w stanie utrzymać go przy dobrym wdrożeniu,
- największą wartość na tym etapie dałoby skrócenie czasu reakcji i ograniczenie gubienia zapytań, a nie pełna automatyzacja wyceny,
- wdrożenie `agenta` bez uporządkowania procesu zakończyłoby się szybkim spadkiem zaufania do narzędzia.

#### Open Questions

- kto powinien być faktycznym ownerem procesu leadowego po uporządkowaniu: właściciel, koordynatorka czy biuro,
- jakie minimalne statusy leadu są potrzebne, żeby proces był mierzalny,
- które kanały wejścia można ustandaryzować najpierw, a które trzeba jeszcze zostawić ręcznie,
- jaki czas reakcji na lead firma uznaje za akceptowalny,
- czy firma jest gotowa ograniczyć Messenger i telefon jako główne źródła aktualnego statusu sprawy,
- czy istnieją wymagania prawne lub branżowe dotyczące przechowywania danych klientów i nagrywania ustaleń.

#### Missing Evidence

- brak rozpisanego procesu `od zapytania do wyceny` na konkretnych krokach,
- brak danych liczbowych: ile leadów miesięcznie wpada, ile się gubi, ile trwa odpowiedź i ile trwa przygotowanie wyceny,
- brak dowodu, czy zespół zaakceptuje choćby prosty wspólny rejestr leadów,
- brak decyzji, kto będzie właścicielem utrzymania nowego narzędzia,
- brak ustalonego fallbacku na wypadek błędnej kwalifikacji albo złej odpowiedzi AI.

### 5. Diagnoza operacyjna

#### Proces i wyjątki

Proces leadowy nie jest dziś procesem w sensie operacyjnym, tylko zbiorem praktyk zależnych od ludzi i kanału, z którego przyszło zapytanie. Nie ma wspólnego początku, nie ma jednego miejsca, w którym lead dostaje status, ani reguł przejścia do etapu wyceny. Najwięcej chaosu powstaje przy przekazywaniu informacji między właścicielem, biurem i osobami przygotowującymi kosztorys.

#### Dane i źródła prawdy

Firma nie ma dziś warunków do zaufanej automatyzacji. Informacje o kliencie, budżecie, terminie, lokalizacji i zakresie prac są duplikowane albo tracone przy przepisywaniu z telefonu do maila albo z Messengera do arkusza. Z perspektywy AI oznacza to brak stabilnego wejścia i bardzo wysokie ryzyko błędnej kwalifikacji sprawy.

#### Kultura i adopcja

Kultura zmiany jest asymetryczna: właściciel jest bardzo otwarty, ale reszta organizacji nie ufa wdrożeniom, bo poprzednie narzędzie nie zakorzeniło się w codziennej pracy. Zespół może potraktować nowe rozwiązanie jako dodatkowy obowiązek, jeśli nie zobaczy szybkiej ulgi operacyjnej i jeśli będzie musiał równolegle prowadzić stare kanały i nowe narzędzie.

#### Decyzyjność i governance

Mocną stroną firmy jest szybka ścieżka decyzyjna właściciela. Słabą stroną jest brak formalnego ownera procesu i brak osoby odpowiedzialnej za utrzymanie narzędzia po wdrożeniu. Bez tego nawet dobry system będzie dryfował organizacyjnie po pierwszych tygodniach.

#### Technika i ryzyko

Środowisko techniczne jest zbyt słabe na szeroki program automatyzacji. Brakuje osoby, która ogarnie integracje, konta, uprawnienia, logi i obsługę wyjątków. Ponieważ koszt błędu jest wysoki, firma nie powinna zaczynać od narzędzia wykonującego działania autonomicznie bez człowieka w pętli.

### 6. Wewnętrzna ocena gotowości

- `Primary Recommendation`: `process cleanup first`

- `Automation Readiness Profile`: `Pionier`
- `Overall Score`: `11/30`

Uzasadnienie dla prowadzącego: organizacja nie ma jeszcze dość stabilnego procesu ani dość dobrych danych, żeby uzasadnić budowę agenta lub aplikacji automatyzującej cały przepływ. Najpierw trzeba wprowadzić minimum operacyjnego porządku, które stworzy warunki do sensownego pilotażu. W przeciwnym razie rozwiązanie technologiczne stanie się kolejną warstwą nad istniejącym chaosem.

### 7. Prywatna ścieżka działania

Co powiedzieć prywatnie przedsiębiorcy: zanim powstanie sensowna automatyzacja, firma potrzebuje jednego uporządkowanego przebiegu obsługi leadu, wspólnych statusów i prostego rejestru danych. Dopiero na takim fundamencie warto pokazywać mały use case z AI, który realnie odciąży zespół, zamiast dołożyć kolejne miejsce do pracy.

Co robić teraz:

- rozpisać jeden docelowy proces obsługi leada od pierwszego kontaktu do decyzji o wycenie,
- ustalić 5-7 statusów leadu i jednoznaczne kryteria przejścia między nimi,
- wskazać jednego ownera procesu i jednego ownera utrzymania narzędzia,
- uruchomić jeden wspólny rejestr leadów z minimalnym zakresem pól i obowiązkiem aktualizacji,
- zmierzyć przez 2-4 tygodnie czas reakcji, liczbę zgubionych zapytań i czas przygotowania wyceny,
- dopiero potem przetestować mały quick win, np. AI do tworzenia draftu odpowiedzi lub do wstępnego uporządkowania zapytania przed akceptacją człowieka,
- przygotować jasny manualny fallback, jeśli AI źle sklasyfikuje sprawę albo nie ma kompletu danych.

Czego nie automatyzować jeszcze:

- automatycznego umawiania terminów bez potwierdzenia człowieka,
- autonomicznej kwalifikacji wszystkich leadów bez wspólnych statusów i danych wejściowych,
- generowania finalnych wycen bez ręcznej walidacji,
- pełnego workflow łączącego lead, kosztorys, kalendarz i komunikację z klientem,
- wielokanałowego agenta odpowiadającego jednocześnie na telefon, formularz, Messenger i e-mail.

Warunki wejścia do kolejnego etapu:

- jeden stabilny przebieg procesu leadowego,
- wspólne statusy i minimalny standard danych dla każdego zapytania,
- potwierdzony owner procesu i owner wdrożenia,
- minimum 2-4 tygodnie danych z prostego rejestru leadów,
- zgoda zespołu na pracę w jednym narzędziu przynajmniej w ograniczonym pilotażu,
- zdefiniowany miernik sukcesu dla kolejnego etapu.

### 8. Handoff do `REQUIREMENTS.md`

#### `## Klient`

- firma remontowo-wykończeniowa z 11-osobowym zespołem,
- właściciel jest silnym sponsorem zmiany, ale organizacja ma niską dojrzałość procesową,
- obszarem krytycznym jest obsługa leadów i przejście od zapytania do decyzji o wycenie,
- poziom gotowości organizacyjnej: `Pionier`, z dużą zależnością od ludzi i rozproszonych kanałów komunikacji.

#### `## Funkcjonalności`

- jeśli powstanie produkt, powinien najpierw wspierać uporządkowanie pracy, a nie pełną automatyzację,
- priorytetem jest wspólny intake leadów, statusowanie spraw i widoczność aktualnego etapu,
- AI na tym etapie może pełnić rolę wspierającą: draft odpowiedzi, streszczenie zgłoszenia, checklistę brakujących informacji,
- wszystkie działania o wysokim koszcie błędu powinny mieć manualną akceptację.

#### `## Deployment`

- rozwiązanie powinno mieć prosty model wdrożenia i niski koszt utrzymania,
- trzeba jawnie wskazać ownera systemu, zasady dostępu i kanał wsparcia po wdrożeniu,
- integracje powinny być ograniczone do minimum, dopóki nie ustabilizuje się proces,
- wymagany jest fallback manualny oraz historia zmian dla kluczowych decyzji w procesie.

#### `## Uwagi dodatkowe`

- przed właściwym buildem produktu potrzebne jest `process cleanup first`,
- rollout musi uwzględniać zmianę nawyków zespołu i prosty onboarding,
- sukces pierwszego etapu powinien być mierzony przez czas reakcji na lead, liczbę zgubionych zapytań i jakość danych wejściowych,
- nie należy obiecywać pełnej autonomii AI na etapie MVP.

#### Dodatkowy handoff do dokumentacji

- `docs/product/01-discovery/current-state.md` — aktualny przebieg leadu, wyjątki, ręczne obejścia i punkty utraty informacji,
- `docs/product/01-discovery/assumptions-and-open-questions.md` — brakujące statusy, brak ownera i luki w danych,
- `docs/product/02-scope/constraints.md` — niski porządek danych, brak IT, opór zespołu, wysoki koszt błędu,
- `docs/product/06-delivery/risks.md` — ryzyka adopcji, utrzymania, porzucenia narzędzia i błędnej automatyzacji.

### 9. Reguły dalszego discovery wg profilu

Ponieważ firma wpada do profilu `Pionier`, notatka wewnętrzna dla prowadzącego powinna zatrzymać zbyt wczesne przejście do pełnego `customerReview.md` dla dużego systemu. Następny krok powinien dotyczyć uporządkowania procesu i wybrania jednego, ograniczonego use case'u. Dopiero po potwierdzeniu, że zespół potrafi pracować na wspólnych statusach i danych, można przejść do discovery konkretnego narzędzia lub pilotażu.

### 10. Ryzyka i decyzje do potwierdzenia

- Największym ryzykiem jest wdrożenie narzędzia ponad chaosem procesowym, co zwiększy liczbę wyjątków zamiast je ograniczyć.
- Drugim ryzykiem jest brak ownera utrzymania, przez co rozwiązanie zostanie porzucone tak jak poprzedni CRM.
- Trzecim ryzykiem jest opór zespołu, jeśli nowe narzędzie będzie wymagało podwójnego wpisywania danych albo nie skróci realnie czasu pracy.
- Nie wolno zgadywać docelowych statusów leadu, ownera procesu ani poziomu autonomii AI bez kolejnej rozmowy roboczej.
- Do walidacji pozostaje, czy firma zaakceptuje jeden wspólny kanał rejestracji spraw i czy jest gotowa ograniczyć komunikację rozproszoną.
- Do walidacji pozostaje również to, czy po 2-4 tygodniach uporządkowanego intake'u pojawi się wystarczająca jakość danych, by planować quick win wspierany przez AI.
