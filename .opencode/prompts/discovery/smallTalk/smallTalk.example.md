# Przykład użycia promptu `smallTalk.md`

Poniżej znajduje się przykładowy rezultat, jaki AI powinno przygotować po etapie smalltalku z przedsiębiorcą.

## Przykładowy kontekst rozmowy z przedsiębiorcą

Klient: Marek Krawiec, współwłaściciel firmy instalacyjno-serwisowej obsługującej monitoring, alarmy i kontrolę dostępu dla małych firm oraz wspólnot mieszkaniowych.

Najważniejsze informacje z rozmowy:

- biznes urósł głównie z poleceń i działa już od 9 lat,
- Marek wszedł w ten obszar od strony operacyjnej; najpierw sam montował i serwisował systemy, dopiero później zbudował zespół,
- dziś firmę najbardziej boli chaos operacyjny: zgłoszenia wpadają przez telefon, WhatsApp i SMS-y, a część ustaleń nadal żyje w głowach ludzi,
- rozmówca jest konkretny, rzeczowy i nie ma cierpliwości do długich wstępów ani modnych buzzwordów,
- nie jest programistą, ale nie boi się technologii, jeśli szybko widzi sens biznesowy i prostotę użycia,
- motywuje go bardziej porządek, przewidywalność i odciążenie zespołu niż sama „innowacja”,
- obawia się wdrożenia systemu, który będzie ładnie wyglądał na demo, ale w praktyce spowolni pracę,
- w rozmowie dobrze reagował na krótkie pytania, konkretne kontrasty i odwołania do realnych sytuacji z dnia pracy.

---

## Przykładowy wynik działania promptu

Przykład jest ułożony w tym samym rytmie co pozostałe pliki `.example.md` w discovery: klasyfikacja rozmowy, synteza, stan wiedzy, prywatny profil przedsiębiorcy i handoff do kolejnego etapu.

### 1. Klasyfikacja rozmowy

- `Smalltalk Depth`: `Flash Warm-up`
- `Founder Profile Depth`: `Working Style Profile`
- `Confidence Level`: `wysoki`
- `Recommended Next Prompt`: `adaptability.md`

Uzasadnienie: rozmówca był konkretny i zadaniowy, więc smalltalk należało utrzymać krótko, ale nadal wydobyć jego styl działania, relację z technologią i główną obawę. Z rozmowy najmocniej wybił się temat chaosu operacyjnego i gotowości firmy do uporządkowania procesu, dlatego najlepszym kolejnym krokiem jest diagnoza z `adaptability.md`, zanim projekt zostanie rozpisany na funkcjonalności.

### 2. Krótka synteza

Marek jest przedsiębiorcą z operatorskim doświadczeniem. Nie wszedł w biznes z wizją budowania technologicznego produktu, tylko z praktyki terenowej i stopniowego rozwoju firmy. Dziś patrzy na projekt głównie przez pryzmat odciążenia zespołu, porządku operacyjnego i ograniczenia chaosu informacyjnego.

To rozmówca konkretny, szybki w ocenie i dość wyczulony na lanie wody. Nie trzeba go prowadzić sztywnym, korporacyjnym tonem, ale trzeba szanować jego czas i mówić językiem efektu. Lepiej reaguje na pytania osadzone w codziennych sytuacjach niż na ogólne rozważania strategiczne.

Jego relacja z technologią jest pragmatyczna. Nie chce wchodzić głęboko w szczegóły techniczne, ale nie jest wobec nich zamknięty. Jeśli widzi, że narzędzie realnie skróci obieg informacji, ograniczy pomyłki i nie będzie wymagało od ludzi skomplikowanej zmiany nawyków, jest gotów je rozważyć.

Największe napięcie dotyczy wdrożeń, które dobrze brzmią w teorii, ale w praktyce generują dodatkową pracę. To oznacza, że dalsze discovery powinno iść w stronę realnych procesów, wyjątków, ownerów i gotowości organizacyjnej, a nie od razu w backlog funkcjonalny.

### 3. Confirmed / Assumptions / Open Questions / Missing Evidence

#### Confirmed

- biznes działa od kilku lat i wyrósł z praktyki operacyjnej,
- Marek jest nastawiony na konkret, skrót i sens biznesowy,
- główną motywacją nie jest sam wzrost technologiczny, tylko większy porządek i mniej chaosu w pracy,
- firma ma problem z rozproszoną komunikacją i niespójnym obiegiem zgłoszeń,
- rozmówca nie chce projektu, który zwiększy tarcie po stronie zespołu,
- najlepszy styl rozmowy z nim to krótki, rzeczowy i osadzony w realnych przykładach.

#### Assumptions

- wdrożenie będzie musiało mieć bardzo niski próg wejścia dla pracowników terenowych,
- Marek prawdopodobnie lepiej zareaguje na pilotaż lub mały wycinek procesu niż na szeroką transformację od razu,
- decyzje inwestycyjne podejmuje przede wszystkim przez pryzmat oszczędności czasu i zmniejszenia liczby błędów,
- jeśli dalsza rozmowa stanie się zbyt abstrakcyjna, jego zaangażowanie szybko spadnie.

#### Open Questions

- jak dokładnie wygląda dziś pełny obieg zgłoszenia od telefonu klienta do zamknięcia serwisu,
- kto w firmie realnie pilnuje procesu, a kto tylko gasi pożary,
- jak zespół reaguje na nowe narzędzia i czy istnieją wcześniejsze nieudane wdrożenia,
- czy problem dotyczy jednego procesu, czy szerzej całego sposobu pracy firmy,
- jak duży jest koszt błędów, opóźnień i niedomkniętych ustaleń.

#### Missing Evidence

- brak konkretnej mapy procesu i wyjątków,
- brak informacji o używanych narzędziach oraz tym, które z nich są realnie używane, a które tylko istnieją,
- brak danych o gotowości zespołu do zmiany i o sponsorze wdrożenia,
- brak potwierdzenia, czy firma szuka aplikacji dla klientów, narzędzia wewnętrznego, czy obu rzeczy naraz.

### 4. Prywatny profil przedsiębiorcy

## 1. Founder Snapshot

- **Kim jest i czym się zajmuje:** Marek jest współwłaścicielem firmy instalacyjno-serwisowej. Myśli przede wszystkim kategoriami wykonania, terminów, zgłoszeń i odpowiedzialności operacyjnej.
- **Etap biznesu / projektu:** działająca firma z realnym problemem operacyjnym; projekt ma charakter usprawnienia, nie czystej eksploracji pomysłu.
- **Geneza pomysłu:** potrzeba uporządkowania rosnącej liczby zgłoszeń i ustaleń, które przestały mieścić się w ręcznym modelu komunikacji.
- **Aktualny kontekst:** firma działa, ale przepływ informacji jest rozproszony i zależny od ludzi oraz improwizacji.

## 2. Archetyp działania

- **Dominujący archetyp:** `Pragmatyk / Operator`
- **Uzasadnienie:** Marek patrzy na projekt przez efekt operacyjny. Nie kupuje wizji dla samej wizji; interesuje go, czy coś uprości pracę i zmniejszy liczbę pomyłek.
- **Tempo działania:** szybkie, ale nie impulsywne; chętnie przejdzie dalej, jeśli widzi konkret.
- **Styl decyzyjny:** miks doświadczenia i praktycznych dowodów.

## 3. Relacja z technologią

- **Poziom techniczności:** `świadomy partner`
- **Aktualne narzędzia lub nawyki technologiczne:** telefon, WhatsApp, kalendarze, arkusze, podstawowe systemy używane zadaniowo, bez potrzeby głębokiego zanurzania się w technikalia.
- **Preferowany poziom szczegółu:** operacyjny z krótkim uzasadnieniem biznesowym.

## 4. Motywacja i ambicja

- **Co go napędza:** większy porządek, mniej gaszenia pożarów, lepsza przewidywalność pracy zespołu.
- **Co chce osiągnąć w 1-2 lata:** uporządkować operacje tak, żeby firma mniej zależała od bieżącego chaosu i ręcznych ustaleń.
- **Jak definiuje sukces:** mniej pomyłek, mniej telefonów „co było ustalone”, szybszy i czytelniejszy obieg zgłoszeń.

## 5. Obawy i napięcia

- **Największe obawy:** wdrożenie systemu, który jest zbyt ciężki, zbyt skomplikowany albo niepasujący do realnej pracy ludzi w terenie.
- **Blokery lub złe doświadczenia:** niski poziom zaufania do rozwiązań, które dobrze wyglądają tylko na prezentacji.
- **Czego chce uniknąć:** przepalenia czasu i pieniędzy na projekt, który zwiększy biurokrację.

## 6. Styl współpracy

- **Jak z nim rozmawiać:** krótko, rzeczowo, bez marketingowego nadmuchania i bez zbyt szerokich dygresji.
- **Jak dostroić ton i pytania:** utrzymywać konkretny rytm, pytać przez prawdziwe sytuacje z dnia pracy, ograniczać długie wprowadzenia, częściej używać pytań kontrastowych niż szerokich abstrakcji.
- **Preferowana forma pytań:** kontrastowe i oparte na przykładach.
- **Co buduje zaufanie:** szybkie łapanie sedna, znajomość realiów operacyjnych, prosty język, jasne przejście od problemu do decyzji.
- **Czego unikać w komunikacji:** buzzwordów, obietnic bez zakotwiczenia w praktyce, przesadnie wizjonerskiego tonu.
- **Zalecane tempo dalszego discovery:** krótkie bloki pytań, szybkie podsumowania, sprawne przejścia do konkretu.

## 7. Implikacje dla dalszego flow

- **Najlepszy następny prompt:** `adaptability.md`
- **Dlaczego właśnie ten:** bo kluczowe napięcie dotyczy gotowości firmy do uporządkowania procesu i wdrożenia zmiany, a nie jeszcze samej listy funkcjonalności.
- **Pierwsze pytanie kolejnego etapu:** `Gdybyśmy wzięli jedno konkretne zgłoszenie serwisowe z ostatnich dni, to jak wygląda jego droga od pierwszego kontaktu klienta do momentu zamknięcia sprawy?`

## 8. Stan wiedzy

- **Confirmed:** styl rozmowy Marka jest bezpośredni i praktyczny; główny ból ma charakter operacyjny; technologia jest dla niego środkiem, nie celem.
- **Assumptions:** firma może nie być gotowa na szeroką zmianę bez pilotażu; zespół może mieć mieszane nastawienie do nowych narzędzi.
- **Open Questions:** proces, ownership, dane, narzędzia, gotowość zespołu.
- **Missing Evidence:** brak rozpisanego current state i dowodów na to, jak duża jest skala chaosu w liczbach.

### 5. Handoff do artefaktów repo

#### `REQUIREMENTS.md -> ## Klient`

- przedsiębiorca prowadzi działającą firmę usługowo-serwisową i szuka sposobu na uporządkowanie rosnącego chaosu operacyjnego,
- inicjatywa wynika z praktycznej potrzeby biznesowej, a nie z samej chęci „wdrożenia nowoczesnej technologii”,
- główną motywacją jest usprawnienie przepływu informacji, odciążenie zespołu i większa przewidywalność pracy,
- dalsze discovery powinno być prowadzone konkretnie, na przykładach i bez zbędnej abstrakcji.

#### `docs/product/01-discovery/interview-summary.md`

- rozmowa pokazała, że founder jest pragmatyczny, operacyjny i ma niski próg tolerancji na fluff,
- kluczowy problem dotyczy rozproszonej komunikacji i ręcznego obiegu informacji,
- ton dalszego discovery powinien być krótki, konkretny i oparty na realnych przypadkach,
- przed wejściem w backlog produktu trzeba sprawdzić gotowość firmy do zmiany procesu,
- rekomendowany następny krok to `adaptability.md`, a nie od razu `customerReview.md`.

---

## Drugi przykład — founderka narracyjna i wizjonerska

## Przykładowy kontekst rozmowy z przedsiębiorcą

Klientka: Alicja Wrona, założycielka butikowej marki mentoringowej dla freelancerek i kobiet budujących własną działalność ekspercką. Myśli o platformie, która połączy treści, proces pracy własnej i kameralną społeczność.

Najważniejsze informacje z rozmowy:

- Alicja przyszła do projektu z własnej historii zmęczenia kulturą ciągłego sprintu i potrzeby budowania bardziej spokojnego modelu pracy,
- bardzo swobodnie opowiada o sensie projektu, wartościach i tym, jakie doświadczenie chce dać ludziom,
- nie jest techniczna i nie chce zanurzać się w stack ani architekturę, ale jest bardzo wrażliwa na ton, doświadczenie użytkownika i spójność marki,
- mówi szeroko o swoich odbiorczyniach, ale opis segmentu jest jeszcze intuicyjny i nie do końca rozdzielony,
- dobrze reaguje na pytania otwarte, parafrazę i spokojne pogłębianie, a gorzej na zbyt ostre kontrasty i mechaniczne zawężanie,
- w projekcie najbardziej napędza ją wpływ, jakość relacji i poczucie sensu, a nie sama skala,
- obawia się, że technologia spłaszczy charakter marki albo zamieni żywy proces w zimny, schematyczny produkt,
- chce rosnąć, ale bez utraty autentyczności i bez wejścia w model, który będzie wymagał agresywnej sprzedaży.

---

## Przykładowy wynik działania promptu

Ten przykład pokazuje odwrotny biegun niż case Marka: rozmówczyni jest bardziej refleksyjna, narracyjna i wrażliwa na sens, język oraz doświadczenie marki. Smalltalk powinien być tu dłuższy, spokojniejszy i mniej kontrastowy, a jednocześnie nadal kończyć się konkretnym routingiem do następnego etapu.

### 1. Klasyfikacja rozmowy

- `Smalltalk Depth`: `Deep Warm-up`
- `Founder Profile Depth`: `Strategic Founder Profile`
- `Confidence Level`: `średni`
- `Recommended Next Prompt`: `persona.md`

Uzasadnienie: rozmówczyni była otwarta, szeroko opowiadała o motywacji, wartościach i wizji doświadczenia, więc smalltalk mógł wejść głębiej. Jednocześnie najsłabszym punktem po rozmowie nie był ani model operacyjny, ani backlog funkcjonalny, tylko precyzja odbiorcy i ról, bo Alicja mówi o swojej grupie bardzo intuicyjnie. Dlatego najwłaściwszym następnym krokiem jest `persona.md`, zanim rozmowa przejdzie do konkretnych funkcji lub modelu produktu.

### 2. Krótka synteza

Alicja buduje projekt bardzo osobiście. Nie traktuje go jak neutralnej usługi cyfrowej, tylko jak rozszerzenie własnej filozofii pracy i sposobu bycia z klientkami. To founderka, która dużo widzi i czuje na poziomie tonu, zaufania, relacji i jakości doświadczenia, a dopiero potem myśli o narzędziu jako takim.

To rozmówczyni narracyjna, refleksyjna i dość intuicyjna. Nie oznacza to braku konkretu, tylko inny próg wejścia do konkretu: zanim zejdzie do decyzji, potrzebuje poczuć sens, spójność i kierunek. Zbyt twarde pytania zadane za wcześnie mogłyby zamknąć rozmowę albo spłaszczyć ważne sygnały o wartościach i motywacji.

Jej relacja z technologią jest delegująca, ale nie bierna. Alicja nie chce rozumieć wszystkich detali technicznych, jednak chce mieć poczucie, że produkt nie zdradza charakteru marki i nie psuje jakości relacji z odbiorczyniami. To oznacza, że w dalszym discovery trzeba łączyć konkret z językiem doświadczenia, a nie prowadzić rozmowy wyłącznie przez funkcje i procesy.

Największe napięcie dotyczy niedoprecyzowanej grupy odbiorczej. Alicja wie, z jaką energią i dla jakiego typu przemiany chce pracować, ale na tym etapie nie ma jeszcze ostrej segmentacji. To sugeruje, że zanim projekt przejdzie do wymagań, trzeba lepiej nazwać persony, ich moment życiowy, bariery i język problemu.

### 3. Confirmed / Assumptions / Open Questions / Missing Evidence

#### Confirmed

- projekt wynika z osobistego doświadczenia i silnie osadzonej motywacji founderki,
- Alicja jest bardziej wizjonerska i refleksyjna niż operacyjna,
- nie chce zanurzać się w technikalia, ale bardzo dba o ton, doświadczenie i spójność marki,
- ważniejsze od szybkiej skali są dla niej sens, autentyczność i jakość relacji,
- rozmowa z nią powinna być spokojniejsza, bardziej partnerska i oparta na pytaniach otwartych,
- grupa odbiorcza jest opisywana intuicyjnie i wymaga doprecyzowania przed dalszym discovery produktu.

#### Assumptions

- decyzje produktowe Alicji będą silnie filtrowane przez zgodność z marką i osobistymi wartościami,
- zbyt techniczna albo zbyt transakcyjna narracja obniży jej zaufanie do procesu,
- platforma prawdopodobnie będzie miała komponent społecznościowy lub relacyjny, nawet jeśli nie zostanie tak nazwana na początku,
- w dalszej rozmowie może pojawić się napięcie między kameralnością a skalowaniem oferty.

#### Open Questions

- kim dokładnie jest główna odbiorczyni: początkująca freelancerka, ekspertka po kilku latach, solo founderka czy osoba na etapie zmiany zawodowej,
- kto realnie kupuje ofertę i co jest dla tej osoby głównym triggerem decyzji,
- jaki problem odbiorczyni chce rozwiązać w pierwszej kolejności: chaos, brak struktury, samotność, wypalenie czy brak monetyzacji,
- jak bardzo produkt ma być wspólnotowy, a jak bardzo narzędziowy,
- jakie elementy doświadczenia marki są absolutnie nienaruszalne.

#### Missing Evidence

- brak rozdzielenia segmentów odbiorczyń i ról decyzyjnych,
- brak walidacji, jakie komunikaty i obietnice najmocniej rezonują z realnymi klientkami,
- brak danych o tym, czy projekt ma być premium, szeroko dostępny czy hybrydowy,
- brak wiedzy, które elementy marki są rzeczywiście krytyczne dla odbiorczyń, a które są głównie ważne dla samej founderki.

### 4. Prywatny profil przedsiębiorcy

## 1. Founder Snapshot

- **Kim jest i czym się zajmuje:** Alicja prowadzi markę mentoringową i rozwija ofertę dla kobiet budujących własną działalność ekspercką. Projekt widzi jako rozszerzenie swojej pracy i wartości, a nie tylko kolejny produkt cyfrowy.
- **Etap biznesu / projektu:** istniejąca marka osobista / ekspercka na etapie przekładania doświadczenia i relacji na bardziej uporządkowany produkt cyfrowy.
- **Geneza pomysłu:** osobiste doświadczenie przeciążenia i potrzeby stworzenia innego sposobu pracy oraz rozwoju dla podobnych kobiet.
- **Aktualny kontekst:** jest silna wizja sensu i doświadczenia, ale nadal brakuje ostrej segmentacji odbiorczyń.

## 2. Archetyp działania

- **Dominujący archetyp:** `Wizjoner / Hybryda`
- **Uzasadnienie:** Alicja mocno myśli przez znaczenie, zmianę i jakość doświadczenia. Nie unika konkretu, ale wchodzi w niego przez sens i obraz całości.
- **Tempo działania:** wyważone; potrzebuje poczuć spójność kierunku przed dalszym domykaniem.
- **Styl decyzyjny:** intuicja wsparta zaufaniem i jakościową oceną zgodności z marką.

## 3. Relacja z technologią

- **Poziom techniczności:** `delegująca`
- **Aktualne narzędzia lub nawyki technologiczne:** korzysta z narzędzi online użytkowo, ale nie chce ich analizować technicznie; bardziej interesuje ją doświadczenie, prostota i lekkość korzystania.
- **Preferowany poziom szczegółu:** strategiczny i doświadczeniowy z umiarkowanym zejściem do konkretu.

## 4. Motywacja i ambicja

- **Co ją napędza:** wpływ na ludzi, tworzenie spokojniejszego modelu pracy i budowanie marki opartej na jakości relacji.
- **Co chce osiągnąć w 1-2 lata:** zbudować spójny, bardziej skalowalny produkt bez utraty autentyczności i bliskości z odbiorczyniami.
- **Jak definiuje sukces:** projekt, który działa biznesowo, ale nadal czuje się „jej”, pomaga właściwym osobom i nie zamienia się w masową, bezosobową machinę.

## 5. Obawy i napięcia

- **Największe obawy:** że technologia uprości projekt do zbyt chłodnej formy i rozbije zaufanie budowane przez markę osobistą.
- **Blokery lub złe doświadczenia:** ostrożność wobec modeli wzrostu, które wymuszają presję, agresywny marketing albo utratę jakości relacji.
- **Czego chce uniknąć:** produktu, który wygląda dobrze od strony biznesowej, ale nie pasuje do jej wartości i języka.

## 6. Styl współpracy

- **Jak z nią rozmawiać:** spokojnie, partnersko, z uważnością na sens, doświadczenie i język.
- **Jak dostroić ton i pytania:** dawać więcej przestrzeni na opowieść, parafrazować, pytać szerzej i dopiero potem zawężać; nie wchodzić za szybko w twarde decyzje binarne.
- **Preferowana forma pytań:** otwarte i oparte na znaczeniu, z delikatnym doprecyzowaniem przykładami.
- **Co buduje zaufanie:** uważność, spójność, brak pośpiechu, poczucie zrozumienia marki oraz człowieka za projektem.
- **Czego unikać w komunikacji:** zbyt ostrych skrótów, technicznego żargonu, nadmiernie sprzedażowego tonu i wciskania gotowych formatów.
- **Zalecane tempo dalszego discovery:** wolniejsze wejście, ale z czytelnym kierunkiem; po każdym większym bloku warto robić miękkie podsumowanie i pokazywać sens kolejnych pytań.

## 7. Implikacje dla dalszego flow

- **Najlepszy następny prompt:** `persona.md`
- **Dlaczego właśnie ten:** bo największa luka dotyczy nie samej wizji founderki, ale precyzji modelu odbiorczyni i jej faktycznych potrzeb, obaw oraz języka.
- **Pierwsze pytanie kolejnego etapu:** `Kiedy myślisz o tej jednej najważniejszej osobie, której ten projekt ma naprawdę pomóc, to w jakim momencie życia lub pracy ona do Ciebie przychodzi?`

## 8. Stan wiedzy

- **Confirmed:** Alicja jest founderką wizjonerską, silnie związaną emocjonalnie z projektem; technologia ma dla niej wspierać doświadczenie, nie dominować nad nim.
- **Assumptions:** będzie potrzebowała procesu discovery, który utrzyma równowagę między strukturą a swobodą; w projekcie ważne będą elementy wspólnoty i tonu marki.
- **Open Questions:** segment odbiorczyń, ich motywacje zakupowe, granice między doświadczeniem premium a skalowaniem.
- **Missing Evidence:** brak dowodów z rozmów z klientkami i brak ostrego modelu person.

### 5. Handoff do artefaktów repo

#### `REQUIREMENTS.md -> ## Klient`

- founderka buduje projekt z silnej osobistej motywacji i chce przełożyć wartości marki na produkt cyfrowy,
- inicjatywa jest na etapie porządkowania wizji i dopasowania jej do realnych odbiorczyń,
- główną motywacją jest stworzenie wartościowego, autentycznego doświadczenia bez utraty jakości relacji,
- dalsze discovery powinno być prowadzone spokojnie, partnersko i z dużą uważnością na język oraz sens projektu.

#### `docs/product/01-discovery/interview-summary.md`

- rozmowa ujawniła founderkę refleksyjną, narracyjną i mocno osadzoną w wartościach marki,
- technologia jest dla niej ważna o tyle, o ile wspiera doświadczenie i autentyczność,
- ton dalszego discovery powinien być mniej kontrastowy, bardziej otwarty i oparty na parafrazie,
- przed rozmową o funkcjach trzeba doprecyzować odbiorczynię i jej sytuację życiowo-zawodową,
- rekomendowany następny krok to `persona.md`, bo to właśnie model odbiorcy jest dziś najbardziej niedookreślony.

---

## Trzeci przykład — founder techniczny i analityczny

## Przykładowy kontekst rozmowy z przedsiębiorcą

Klient: Tomasz Biel, technical founder budujący narzędzie SaaS dla zespołów sprzedaży B2B, które ma porządkować kwalifikację leadów, historię kontaktu i priorytety follow-upów.

Najważniejsze informacje z rozmowy:

- Tomasz ma mocne zaplecze techniczne i wcześniej budował już wewnętrzne narzędzia dla zespołów sprzedażowych,
- od początku dość szybko schodzi do konkretu: mówi o tarciu w procesie, stratach czasu, powtarzalnych zadaniach i słabych danych wejściowych,
- jest otwarty na smalltalk, ale w praktyce najlepiej reaguje wtedy, gdy rozmowa szybko pokazuje sens i nie odpływa za daleko od problemu,
- myśli dość analitycznie i lubi porządkować rzeczy w modelach: co jest problemem użytkownika, co problemem biznesowym, a co tylko symptomem,
- nie trzeba go chronić przed technologią, ale smalltalk nadal nie powinien wpadać w rozmowę o architekturze ani backlogu,
- motywuje go zbudowanie produktu, który daje mierzalny efekt i broni się w danych, a nie tylko „wygląda sensownie na slajdach”,
- obawia się powierzchownych discovery, w których dużo mówi się o wizji, a mało o mechanice decyzji użytkownika i procesie kupującego,
- w rozmowie najlepiej działały krótkie parafrazy, pytania precyzujące i lekkie rozdzielanie poziomów: founder, użytkownik, kupujący, proces.

---

## Przykładowy wynik działania promptu

Ten przykład pokazuje rozmówcę technicznego, który łatwo wciąga rozmowę w stronę produktu i systemu. Smalltalk musi tu być zwarty, inteligentny i szanujący jego poziom świadomości, ale nadal ma wydobywać człowieka, styl działania i logikę współpracy, zamiast przeskoczyć od razu do discovery funkcjonalnego.

### 1. Klasyfikacja rozmowy

- `Smalltalk Depth`: `Standard Warm-up`
- `Founder Profile Depth`: `Working Style Profile`
- `Confidence Level`: `wysoki`
- `Recommended Next Prompt`: `businessMode.md`

Uzasadnienie: rozmówca był techniczny i bardzo szybko przechodził do mechaniki problemu, więc smalltalk musiał być bardziej zwarty i precyzyjny niż w przypadku Alicji, ale nie aż tak skrócony jak przy Marku. Z rozmowy najmocniej wybiły się pytania o wartość biznesową, model decyzji i sens produktu na tle obecnych sposobów pracy, dlatego najlepszym następnym krokiem jest `businessMode.md`, zanim temat zostanie rozpisany na backlog.

### 2. Krótka synteza

Tomasz jest founderm technicznym, który myśli przez problem, mechanizm i efekt. Ma niski próg tolerancji na rozmyte ogólniki, ale nie oznacza to, że interesuje go wyłącznie technologia. W praktyce zależy mu na sensownym połączeniu trzech warstw: realnego bólu użytkownika, logicznego modelu biznesowego i produktu, który da się obronić danymi.

To rozmówca analityczny, szybki i dobrze zorientowany w logice budowy narzędzi. Nie potrzebuje prostego języka dlatego, że nie rozumie technologii, tylko dlatego, że nie chce marnować energii na rzeczy, które niczego nie wyjaśniają. Lepiej reaguje na pytania precyzyjne, dobrze zakotwiczone i rozdzielające poziomy problemu niż na szerokie, miękkie eksploracje bez struktury.

Jego relacja z technologią jest hands-on, ale nie fetyszyzuje samej implementacji. Interesuje go, czy produkt trafi w realny mechanizm pracy klientów i czy model będzie miał sens poza samą sprawnością techniczną. To ważne, bo dalsze discovery nie powinno utknąć na funkcjach, tylko przejść przez logikę wartości, kanałów i decyzji zakupowych.

Największe napięcie dotyczy ryzyka budowania rozwiązania, które jest zbyt dobrze przemyślane od strony produktu, ale zbyt słabo zakotwiczone w ekonomii i zachowaniach klienta. To wskazuje, że kolejny etap powinien uporządkować model biznesowy, segment klienta i sposób podejmowania decyzji zakupowej.

### 3. Confirmed / Assumptions / Open Questions / Missing Evidence

#### Confirmed

- Tomasz jest founderem technicznym z wysoką świadomością produktową,
- w rozmowie dobrze reaguje na precyzyjne pytania i logiczne rozdzielanie poziomów problemu,
- jego motywacja jest mocno związana z mierzalnym efektem i produktem, który broni się nie tylko technicznie, ale też biznesowo,
- nie chce discovery opartego wyłącznie na ogólnych deklaracjach wizji,
- technologia jest dla niego naturalnym środowiskiem, ale nie jest celem samym w sobie,
- najlepszy styl rozmowy z nim to rzeczowy, inteligentny i dobrze uporządkowany.

#### Assumptions

- Tomasz może mieć tendencję do zbyt szybkiego przechodzenia do rozwiązań, zanim dopnie model klienta i decyzji zakupowej,
- dalsze discovery powinno pomagać mu utrzymać balans między precyzją techniczną a walidacją biznesową,
- jeśli rozmowa stanie się zbyt miękka lub zbyt marketingowa, szybko straci do niej cierpliwość,
- produkt może wymagać rozdzielenia użytkownika operacyjnego od osoby kupującej lub zarządzającej sprzedażą.

#### Open Questions

- kto jest głównym użytkownikiem narzędzia, a kto faktycznie płaci i podejmuje decyzję,
- jaki jest dziś alternatywny sposób rozwiązywania problemu u klientów: CRM, arkusze, chaos w pipeline, notatki handlowców czy coś innego,
- jaka część wartości produktu wynika z samego uporządkowania procesu, a jaka z lepszego scoringu i priorytetyzacji,
- czy rynek jest już wystarczająco zawężony, czy produkt nadal celuje zbyt szeroko,
- jaki jest najmocniejszy dowód, że ten problem jest dla klienta kosztowny i pilny.

#### Missing Evidence

- brak uporządkowanego modelu segmentu klienta i procesu zakupowego,
- brak danych o kanałach dotarcia i o tym, kto jest sponsorem budżetu po stronie klienta,
- brak walidacji, czy problem jest na tyle bolesny, żeby uzasadnić zmianę narzędzia lub procesu,
- brak informacji o unit economics i o tym, co realnie tworzy przewagę produktu względem obecnych alternatyw.

### 4. Prywatny profil przedsiębiorcy

## 1. Founder Snapshot

- **Kim jest i czym się zajmuje:** Tomasz jest founderem technicznym budującym SaaS dla sprzedaży B2B. Naturalnie myśli przez model procesu, dane i decyzje użytkownika.
- **Etap biznesu / projektu:** produkt na etapie dopinania logiki wartości i modelu biznesowego przed głębszym zejściem do zakresu.
- **Geneza pomysłu:** obserwacja powtarzalnych problemów w kwalifikacji leadów i zarządzaniu follow-upami oraz doświadczenie pracy z podobnymi procesami od strony technicznej.
- **Aktualny kontekst:** silny ogląd problemu i możliwego rozwiązania, ale nadal potrzeba mocniejszego domknięcia strony biznesowej i zakupowej.

## 2. Archetyp działania

- **Dominujący archetyp:** `Pragmatyk / Detalista / Hybryda`
- **Uzasadnienie:** Tomasz łączy techniczne rozumienie systemu z analitycznym podejściem do problemu. Szuka spójności między mechanizmem produktu a realnym use case'em biznesowym.
- **Tempo działania:** szybkie, ale uporządkowane; dobrze działa w rytmie krótkich iteracji z jasnym sensem.
- **Styl decyzyjny:** dowody wspierane doświadczeniem.

## 3. Relacja z technologią

- **Poziom techniczności:** `hands-on`
- **Aktualne narzędzia lub nawyki technologiczne:** swobodnie porusza się po tematach produktowych i technicznych, sam modeluje problem i naturalnie przechodzi do logiki systemu.
- **Preferowany poziom szczegółu:** operacyjno-strategiczny z możliwością szybkiego zejścia do konkretu.

## 4. Motywacja i ambicja

- **Co go napędza:** zbudowanie rozwiązania, które realnie poprawia decyzje sprzedażowe i broni się w danych.
- **Co chce osiągnąć w 1-2 lata:** doprowadzić do czytelnego product-market fit i zbudować narzędzie, które nie tylko działa, ale ma twardy sens ekonomiczny.
- **Jak definiuje sukces:** produkt używany w realnym procesie sprzedaży, dający mierzalny efekt i uzasadniający zmianę zachowania po stronie klienta.

## 5. Obawy i napięcia

- **Największe obawy:** zbudowanie rozwiązania dopracowanego produktowo, ale niedostatecznie osadzonego w prawdziwej ekonomii problemu.
- **Blokery lub złe doświadczenia:** niska tolerancja na discovery oparte o powierzchowne hasła bez mechaniki i dowodów.
- **Czego chce uniknąć:** wpadnięcia w budowę funkcji bez twardego zrozumienia, kto kupuje, dlaczego kupuje i co dokładnie zmienia się po wdrożeniu.

## 6. Styl współpracy

- **Jak z nim rozmawiać:** konkretnie, logicznie i bez nadmiernego upraszczania.
- **Jak dostroić ton i pytania:** utrzymywać zwięzłość, zadawać pytania dobrze osadzone w modelu problemu, pilnować rozróżnienia między użytkownikiem, nabywcą i objawem problemu.
- **Preferowana forma pytań:** precyzyjne, analityczne i rozdzielające poziomy problemu.
- **Co buduje zaufanie:** klarowna logika rozmowy, dobra segmentacja problemu, umiejętność szybkiego dojścia do sedna bez chaosu.
- **Czego unikać w komunikacji:** marketingowego słownictwa, rozwleczonych pytań bez celu, zbyt ogólnych deklaracji o wizji i innowacji.
- **Zalecane tempo dalszego discovery:** sprawne, uporządkowane, z krótkimi syntezami i szybkim przechodzeniem do kolejnych warstw modelu biznesowego.

## 7. Implikacje dla dalszego flow

- **Najlepszy następny prompt:** `businessMode.md`
- **Dlaczego właśnie ten:** bo najważniejsza luka dotyczy teraz logiki biznesowej produktu: segmentu klienta, decyzji zakupowej, propozycji wartości i dowodów ekonomicznych.
- **Pierwsze pytanie kolejnego etapu:** `Jeśli miałbyś wskazać jedną rolę po stronie klienta, dla której ten problem jest dziś najbardziej kosztowny, to kto to jest i co dokładnie traci w obecnym sposobie pracy?`

## 8. Stan wiedzy

- **Confirmed:** Tomasz jest founderem technicznym, analitycznym i zorientowanym na sens biznesowy; najlepiej pracuje w rozmowie precyzyjnej i logicznie poprowadzonej.
- **Assumptions:** będzie potrzebował discovery, które pilnuje walidacji biznesowej równie mocno jak logiki produktu; może mieć naturalną skłonność do zbyt szybkiego projektowania rozwiązania.
- **Open Questions:** segment klienta, sponsor budżetu, koszt problemu, kanały dotarcia, alternatywy rynkowe.
- **Missing Evidence:** brak twardych danych o zakupie, przewadze i sile bólu po stronie klienta.

### 5. Handoff do artefaktów repo

#### `REQUIREMENTS.md -> ## Klient`

- founder techniczny buduje SaaS dla sprzedaży B2B i patrzy na projekt przez mechanikę problemu, danych i decyzji użytkownika,
- inicjatywa jest na etapie dopinania logiki biznesowej i segmentacji przed rozpisaniem pełnego zakresu produktu,
- główną motywacją jest stworzenie rozwiązania o mierzalnym efekcie i realnym sensie ekonomicznym,
- dalsze discovery powinno być prowadzone precyzyjnie, logicznie i bez marketingowego rozmycia.

#### `docs/product/01-discovery/interview-summary.md`

- rozmowa ujawniła foundera technicznego, analitycznego i dobrze osadzonego w logice produktu,
- smalltalk musiał być zwarty, konkretny i inteligentnie ograniczony, żeby nie zamienił się od razu w rozmowę o funkcjach,
- ton dalszego discovery powinien pozostać rzeczowy i uporządkowany, z silnym rozdzieleniem warstw problemu,
- przed wejściem w backlog trzeba uporządkować model biznesowy, segment klienta i decyzję zakupową,
- rekomendowany następny krok to `businessMode.md`, bo to właśnie warstwa modelu biznesowego wymaga teraz najmocniejszego domknięcia.
