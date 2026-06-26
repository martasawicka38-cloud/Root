# Przykład użycia promptu `persona.md`

Poniżej znajduje się przykładowy rezultat, jaki AI powinno przygotować po rozmowie discovery z klientem.

## Przykładowy kontekst rozmowy z klientem

Projekt dotyczy oferty tworzenia prostych stron internetowych dla lokalnych fachowców. Klient zauważył, że najlepiej rokującymi leadami są właściciele jednoosobowych działalności technicznych, którzy chcą wyglądać bardziej profesjonalnie i uniezależnić się od OLX, Facebooka oraz przypadkowych poleceń.

Najważniejsze informacje z rozmowy:

- główni odbiorcy oferty to właściciele małych lokalnych firm usługowych,
- zwykle są bardzo praktyczni, nie interesują ich szczegóły technologiczne i nie chcą uczyć się CMS-ów,
- zależy im głównie na telefonach od klientów i prostym pokazaniu realizacji,
- obawiają się, że strona internetowa będzie droga, skomplikowana albo nie przyniesie efektu,
- często podejmują decyzję szybko, ale chcą jasnej ceny i krótkiej rozmowy bez „lania wody”,
- większość z nich działa głównie na telefonie i używa laptopa sporadycznie,
- ważną rolę w decyzji czasem odgrywa współmałżonek lub zaufany znajomy, ale główny użytkownik i decydent to zwykle właściciel firmy.

---

## Przykładowy wynik działania promptu

Przykład jest ułożony w tym samym rytmie co pozostałe pliki `.example.md` w discovery: klasyfikacja, synteza, stan wiedzy, handoff do `REQUIREMENTS.md`, artefakty domenowe i ryzyka. W `persona` część artefaktowa skupia się na modelu odbiorcy i jego implikacjach dla UX, copy i backlogu.

### 1. Klasyfikacja modelu odbiorców

- `Persona Model`: `Single Persona Lite`
- `Confidence Level`: `wysoki`
- `Primary Persona`: `Solidny Sławek`
- `Secondary Personas`: brak osobnej persony drugorzędnej w MVP; występuje jedynie lekki wpływ żony jako konsultantki przy większym wydatku

Uzasadnienie: projekt dotyczy prostej oferty usługowej z jednym wyraźnie dominującym typem odbiorcy. Wpływ drugiej osoby na decyzję istnieje, ale nie jest na tyle silny, żeby budować osobną, pełnoprawną personę dla MVP.

### 2. Executive Summary

Najważniejszym odbiorcą oferty jest właściciel lokalnej firmy usługowej, który nie szuka „marketingu”, tylko konkretnego narzędzia do zdobywania lepszych klientów. Jest zmęczony walką cenową na marketplace'ach i chce wyglądać profesjonalnie bez wchodzenia w techniczne szczegóły. Ceni prostotę, uczciwość, szybki kontakt i jasne warunki współpracy.

Dla tej persony najważniejsze są zaufanie, szybkość zrozumienia oferty i niskie tarcie decyzyjne. To bezpośrednio wpływa na UX i copy: strona sprzedażowa musi być prosta, mobilna, konkretna, oparta o widoczne realizacje, jasne CTA telefoniczne i czytelne argumenty biznesowe, a nie rozbudowane opisy funkcji.

### 3. Confirmed / Assumptions / Open Questions / Missing Evidence

#### Confirmed

- głównym odbiorcą są właściciele jednoosobowych lub bardzo małych firm usługowych,
- najważniejszym celem tej grupy jest pozyskanie większej liczby telefonów i lepszych leadów,
- odbiorcy preferują prostą, konkretną rozmowę i nie chcą zagłębiać się w technikalia,
- telefon jest dla nich głównym urządzeniem do przeglądania oferty i kontaktu,
- wysoka wrażliwość cenowa nie oznacza, że wybierają najtańszą opcję; ważne jest poczucie uczciwości i sensu inwestycji,
- zaufanie budują referencje, konkret, prosty język i przewidywalny zakres usługi.

#### Assumptions

- większość takich klientów nie będzie chciała samodzielnie edytować strony regularnie,
- pierwszym oczekiwanym efektem po wdrożeniu jest poprawa wizerunku i większa liczba telefonów, a nie rozbudowana analityka,
- decyzja zakupowa zwykle zamyka się w kilku dniach, jeśli rozmowa jest konkretna i cena czytelna,
- abonament miesięczny może być gorzej odbierany niż jednorazowy koszt wdrożenia.

#### Open Questions

- czy warto wydzielić osobną personę dla firm, które chcą nie tylko strony, ale też wsparcia w Google Maps i lokalnym SEO,
- jak często drugi decydent faktycznie blokuje zakup, a jak często tylko konsultuje wydatek,
- czy w tej grupie ważniejsze są realizacje fotograficzne, opinie klientów, czy bardzo prosty cennik,
- jaki poziom samodzielnej obsługi po wdrożeniu jest realnie oczekiwany.

#### Missing Evidence

- brak nagrań lub transkrypcji realnych rozmów sprzedażowych z tą grupą,
- brak danych ilościowych o tym, które argumenty najczęściej zamykają sprzedaż,
- brak porównania między fachowcami z branż technicznych a np. beauty lub lokalną gastronomią,
- brak walidacji, czy komunikacja „bez technikaliów” działa tak samo dobrze dla wszystkich segmentów lokalnych usług.

### 4. Handoff do `REQUIREMENTS.md`

- `## Klient` — grupą docelową są właściciele małych firm usługowych o niskiej tolerancji na technikalia, wysokiej potrzebie zaufania i silnym fokusie na efekcie biznesowym.
- `## Funkcjonalności` — priorytet mają szybki kontakt telefoniczny, widoczne realizacje, prosta oferta, FAQ ograniczające podstawowe pytania i formularz o niskim tarciu.
- `## i18n` — w MVP wystarczy język polski; lokalny charakter oferty jest ważniejszy niż wielojęzyczność.
- `## Uwagi dodatkowe` — mobile-first jest krytyczne, treść musi być maksymalnie konkretna, CTA powinny prowadzić do telefonu lub krótkiego formularza, a elementy zaufania muszą pojawiać się wcześnie.

### 5. Karty person

## Solidny Sławek

### 1. Bio i Podsumowanie

- **Krótki opis (Bio):** Sławek to 41-letni elektryk z Bydgoszczy, który od 12 lat prowadzi własną działalność. Specjalizuje się w instalacjach elektrycznych w domach jednorodzinnych i małych firmach. Większość klientów trafia do niego przez OLX, grupy na Facebooku lub polecenia, ale coraz częściej słyszy pytanie, czy ma własną stronę. Woli być na budowie niż przy komputerze, dlatego chce zamówić stronę raz, dobrze i bez niepotrzebnej komplikacji. Zależy mu na tym, żeby internet pracował na jego wiarygodność i pomagał zdobywać lepsze zlecenia.
- **Motto życiowe / Cytat:** "Jak coś robię, to robię to porządnie, żeby nie wracać dwa razy."
- **Tag line:** Fachowiec z zasadami, który chce, żeby internet pracował za niego.

### 2. Dane Demograficzne i Zawodowe

- **Podstawowe informacje:** 41 lat, mężczyzna, Bydgoszcz, żonaty, troje dzieci, mieszka i działa lokalnie.
- **Wykształcenie:** Technikum elektryczne, uprawnienia SEP do 1 kV.
- **Praca i Kariera:** Właściciel jednoosobowej działalności, czasem pracuje z pomocnikiem; sam robi wyceny, realizacje, kontakt z klientem i zakupy materiałów.

### 3. Profil Psychograficzny i Osobowość

- **Cechy charakteru:** konkretny, rzetelny, punktualny, małomówny, praktyczny, nieufny wobec marketingowego nadmuchania.
- **Osobowość:** introwertyczny pragmatyk; dobrze rozmawia jeden na jeden, ale nie lubi się „sprzedawać” i unika niepotrzebnej abstrakcji.
- **Wartości i Ambicje:** ceni uczciwość, terminowość i fachowość; sukces oznacza pełny kalendarz zleceń bez ścigania się ceną; chce wejść na poziom bardziej przewidywalnych i lepszych jakościowo klientów.

### 4. Dzień z Życia i Rytuały

- **Typowy dzień:** rano sprawdza telefon, potem jedzie na budowę; w ciągu dnia pracuje fizycznie i odbiera telefony; popołudniami robi wyceny, zakupy i formalności; wieczorem odpisuje na wiadomości i zajmuje się domem.
- **Hobby i Zainteresowania:** motoryzacja, wędkarstwo, sport, praktyczne filmy na YouTube.
- **Ważne osoby:** żona konsultująca większe wydatki, brat z branży budowlanej polecający klientów, zaufani dostawcy.

### 5. Cele i Motywacje

- **Cele:** mieć stały napływ klientów spoza OLX i Facebooka, wyglądać profesjonalnie, oszczędzać czas na jałowych rozmowach i wycenach, docierać do bardziej wartościowych zleceń.
- **Motywacje:** zmęczenie wojną cenową, potrzeba odróżnienia się od szarej strefy, chęć pokazania realizacji i zbudowania wiarygodności.
- **Job to be Done:** "Pomóż mi wyglądać jak solidna firma i spraw, żeby klient szybciej do mnie zadzwonił, zamiast szukać tańszego wykonawcy w ogłoszeniach."

### 6. Wyzwania i Problemy (Punkty Bólu)

- **Bóle i Frustracje:** leady z OLX pytają tylko o cenę, klienci znikają po darmowych wycenach, brak miejsca do pokazania realizacji, niska cierpliwość do technicznego żargonu z branży webowej.
- **Obawy i Strachy:** że zapłaci za stronę, która nie da efektu; że wykonawca zniknie po wdrożeniu; że efekt będzie wyglądał tanio lub sztucznie.
- **Deal-breakery:** niejasny cennik, abonament bez jasnej wartości, długie prezentacje, nadmiar technikaliów, skomplikowany proces wdrożenia.

### 7. Zachowania Zakupowe i Relacja z Marką

- **Proces decyzyjny:** krótki research, kilka porównań, szybki telefon, decyzja po tym, czy druga strona mówi konkretnie i uczciwie.
- **Punkty styku (Touchpoints):** Google lokalnie, Facebook, polecenie od znajomego, czasem YouTube lub WhatsApp.
- **Preferencje zakupowe:** preferuje telefon nad e-mail, oczekuje jasnej ceny i prostego zakresu, bardziej ufa jednorazowej opłacie niż złożonemu modelowi abonamentowemu.
- **Rola w procesie:** główny użytkownik, nabywca i decydent; przy wyższej kwocie konsultuje wydatek z żoną.

### 8. Technologie i Kanały

- **Technologie:** smartfon z Androidem jako główne narzędzie, stary laptop używany sporadycznie, WhatsApp, OLX, aplikacja do faktur, Facebook, YouTube.
- **Konsumpcja treści:** preferuje krótkie i konkretne komunikaty, case'y pokazane wizualnie, proste porównania i przykłady; nie czyta długich ofert tekstowych.

### 9. Identyfikatory (dla Sprzedaży i UX)

- **Jak ją rozpoznać?:** zaczyna od pytania o cenę i zakres, mówi że nie chce nic skomplikowanego, często narzeka na jakość leadów z ogłoszeń i chce po prostu „mieć porządną stronę”.
- **Jakim językiem mówi?:** prostym, praktycznym, bez marketingowych słów; używa języka efektu, nie funkcji: "żeby klient zadzwonił", "żeby było profesjonalnie", "żeby nie trzeba było się bawić".
- **Co buduje zaufanie?:** jasny zakres, przykłady realizacji, prosty proces, możliwość szybkiego kontaktu, brak technicznego nadęcia, poczucie, że druga strona rozumie realia małej firmy.

### 6. Macierz ról decyzyjnych

| Rola              | Kto to jest    | Wpływ na decyzję | Czego potrzebuje                                   | Ryzyko pomyłki                    |
| ----------------- | -------------- | ---------------- | -------------------------------------------------- | --------------------------------- |
| Główny decydent   | Solidny Sławek | Wysoki           | Jasnej ceny, prostego procesu, efektu biznesowego  | Przegadanie oferty i utrata uwagi |
| Konsultant domowy | Żona Sławka    | Średni           | Poczucia bezpieczeństwa wydatku i sensu inwestycji | Zbyt wysoka cena bez uzasadnienia |

### 7. Implikacje dla UX, copy i backlogu

- Sekcje krytyczne: hero z jasną obietnicą, blok "co dostajesz", realizacje, opinie, FAQ, szybki kontakt.
- Copy powinno mówić językiem efektów: więcej telefonów, profesjonalny wygląd, mniej straconego czasu, prosty proces.
- Nie warto eksponować szczegółów technicznych, nazw narzędzi, architektury ani długich opisów procesu bez kontekstu biznesowego.
- Formularze muszą być krótkie i nie mogą wymagać dużego wysiłku na mobile.
- Ryzykiem jest zbyt agencyjny, marketingowy ton komunikacji, który obniży zaufanie tej persony.
- Do walidacji pozostaje, czy warto wydzielić drugą personę dla bardziej ambitnych firm, które oczekują dodatkowo wsparcia w widoczności lokalnej.

### 8. Ryzyka i hipotezy do walidacji

- Jeśli komunikacja oferty będzie zbyt techniczna lub zbyt „agencyjna”, persona może odpaść już na pierwszym ekranie.
- Jeśli CTA nie będą prowadziły szybko do telefonu lub prostego formularza, odbiorca może wrócić do znanych kanałów typu OLX lub Facebook.
- Nadal wymaga potwierdzenia, czy w tej grupie mocniej działa prosty cennik, zestaw realizacji czy społeczny dowód słuszności w postaci opinii.
- W dalszym discovery warto sprawdzić, czy segment bardziej ambitnych właścicieli firm potrzebuje osobnej persony i innego języka oferty.
