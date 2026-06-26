# Eco-Pulse — Design Spec
## Wariant: Wellbeing dla 300 OS (ERGO Hestia)

---

## 1. Kierunek wizualny

### Mood
"Spokojna natura spotyka nowoczesny tech" — kalifornijski minimalizm z ciepłem skandynawskim.

| Cechy | Unikamy |
|---|---|
| Czysty, przestronny layout | Przeładowania informacjami |
| Natura jako metafora (liście, fale, kamienie) | Plastikowych, sztucznych grafik |
| Ciepłe, zachęcające kolory | Agresywnych, krzykliwych barw |
| Miękkie zaokrąglenia (16px+) | Ostrych, kanciastych elementów |
| Mikro-interakcje (subtle) | Ciężkich animacji |

---

## 2. Design System

### Paleta kolorów

```
Podstawowa
├── Deep Forest  #1B4332     ← tekst, nagłówki, primary
├── Moss Green   #2D6A4F     ← buttony, akcenty, CTA
├── Sage         #95D5B2     ← tła, ilustracje
├── Mist         #D8F3DC     ← tła sekcji, karty

Akcentowa
├── Warm Gold    #D4A373     ← Eco-Coins, achievementy, wyróżnienia
├── Sunset       #E07A5F     ← streak fire, alerty

Neutralna
├── Slate 900    #1E293B     ← tekst
├── Slate 600    #64748B     ← label, placeholder
├── Slate 300    #CBD5E1     ← border, divider
├── Slate 100    #F1F5F9     ← tło ekranów
├── White        #FFFFFF     ← karty, modale

Semantyczna
├── Success      #40916C     ← cele osiągnięte
├── Warning      #E9C46A     ← blisko celu
├── Error        #D62828     ← błędy, alerty
```

### Typografia

| Styl | Font | Size | Weight | Use |
|---|---|---|---|---|
| H1 | Inter | 28px | 700 | Nagłówek dashboard |
| H2 | Inter | 20px | 600 | Nagłówki sekcji |
| H3 | Inter | 16px | 600 | Karty, tytuły |
| Body | Inter | 15px | 400 | Teksty |
| Body small | Inter | 13px | 400 | Opisy, metadane |
| Caption | Inter | 11px | 600 | Label, statystyki |
| Points | Inter | 34px | 800 | Liczba Eco-Coins |
| Steps | Inter | 24px | 700 | Liczba kroków |

- Line height: body 1.5, headers 1.2
- Letter spacing: 0px (domyślnie), captions +0.5px

### Spacing (8-punktowy grid)

| Token | px |
|---|---|
| 4xs | 4 |
| 3xs | 8 |
| 2xs | 12 |
| xs | 16 |
| sm | 20 |
| md | 24 |
| lg | 32 |
| xl | 40 |
| 2xl | 48 |
| 3xl | 64 |

### Border radius

| Token | px | Użycie |
|---|---|---|
| sm | 8 | małe karty, inputy |
| md | 12 | karty, modale |
| lg | 16 | główne kontenery |
| xl | 24 | bottom sheet |
| full | 9999 | avatary, badge |

### Cienie

```
shadow-sm:   0 1px 2px rgba(0,0,0,0.04)
shadow-md:   0 4px 12px rgba(0,0,0,0.06)
shadow-lg:   0 8px 24px rgba(0,0,0,0.08)
shadow-xl:   0 16px 40px rgba(0,0,0,0.10)
```

### Ikonografia
- Styl: feather/phosphor — thin line, rounded caps, 24px default
- Eco: liść, drzewo, rower, woda, słońce, fala
- Aktywność: buty, serce, ogień (streak), medal
- UI: strzałki, krzyżyk, hamburger, profil

---

## 3. Ekrany — szczegółowy opis

### 3.1 Splash + Onboarding (3 ekrany)

**Splash** (2s)
- Tło: gradient Mist → Deep Forest
- Logo: liść (linia) + "Eco-Pulse" (Inter Light 32px, White)
- Subtelna animacja: liść pojawia się od dołu

**Onboarding 1/3** — "Ruszaj się"
- Ilustracja: postać idąca przez las (plaski styl, organiczny)
- Nagłówek: "Każdy krok ma znaczenie"
- Body: "Zamień swoją codzienną aktywność w punkty. Spacer, bieganie, joga — wszystko się liczy."
- Button: "Dalej" (Moss Green, full-width)
- Pager: ● ○ ○

**Onboarding 2/3** — "Dbaj o planetę"
- Ilustracja: dłonie sadzące drzewo
- Nagłówek: "Wybieraj eko na co dzień"
- Body: " Deklaruj dobre działania: mniej plastiku, rower zamiast auta, lokalne zakupy."
- Button: "Dalej"
- Pager: ○ ● ○

**Onboarding 3/3** — "Zbieraj nagrody"
- Ilustracja: skrzynia ze złotem (eko-wersja)
- Nagłówek: "Nagrody czekają"
- Body: "Wymieniaj Eco-Coins na karty podarunkowe, zniżki i benefity od swojego pracodawcy."
- Button: "Dołącz do programu" (→ kod invite)
- Pager: ○ ○ ●

### 3.2 Rejestracja — kod invite

- Nagłówek: "Dołącz do [Nazwa firmy]"
- Input: kod (8 znaków, uppercase)
- Alternatywnie: scan QR kodu
- Po poprawnym kodzie: formularz (imię, cel kroków)
- Zgoda RODO: checkbox + link do polityki prywatności
- Button: "Rozpocznij przygodę"

### 3.3 Dashboard (główny ekran)

```
┌──────────────────────────────────┐
│ 🔍                      [👤]     │  ← top bar (przezroczysty)
│                                  │
│  Dzień dobry, Kasiu 🌿           │  ← H1, Deep Forest
│  5-dniowa passa!        [🔥]     │  ← badge, Warm Gold
│                                  │
│  ┌──────────────────────────────┐│
│  │  6 200       z 8 000        ││  ← Steps, Deep Forest
│  │  ████████░░░░░░░░░░░  78%   ││  ← progress bar (Moss → Sage)
│  │  31 Eco-Coins dzisiaj       ││  ← Caption, Slate 600
│  └──────────────────────────────┘│  ← card, White, shadow-md
│                                  │
│  [🌱 Eko-deklaracje]  [🏪 Rynek] │  ← quick actions
│  [🏆 Ranking]         [📊 Mój   │
│                         profil] │
│                                  │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐       │
│  │🌳 │ │🚲 │ │♻️ │ │🛒 │       │  ← paged eko-deklaracje
│  │   │ │   │ │   │ │   │       │     każda z +10
│  │   │ │   │ │   │ │   │       │
│  └───┘ └───┘ └───┘ └───┘       │
│                                  │
│  ┌──────────────────────────────┐│
│  │  Saldo: 450 Eco-Coins    [→] ││  ← card, Sage tint
│  └──────────────────────────────┘│
│                                  │
│  [🏅] Nowe wyzwanie dostępne!    │  ← banner (jeśli aktywne)
│                                  │
└──────────────────────────────────┘
└─────────── tab bar ──────────────┘
  [🏠 Dom] [🏪 Rynek] [🏆 Ranking] [👤 Profil]
```

**Główne komponenty dashboardu:**

1. **Progress ring** (koło postępu kroków) — zamiast paska, ring z animowanym wypełnieniem od Mist do Moss Green
2. **Eko-deklaracje** — karuzela poziomych kart, każda z emoji + nazwa + punkty, swipe do oznaczenia "zrobiłem"
3. **Saldo Eco-Coins** — karta z delikatnym gradientem, duża liczba, przycisk "Do sklepu"
4. **Passa (streak)** — ikona ognia + liczba dni, logic (7 dni → bonus)
5. **Quick actions** — 4 przyciski w grid 2×2

### 3.4 Rynek nagród

```
┌──────────────────────────────────┐
│  ← Rynek nagród                  │
│  Saldo: 450 Eco-Coins     💰     │
│                                  │
│  ┌──────────────────────────────┐│
│  │ ☕ Kawa w sieciówce          ││
│  │ 200 Eco-Coins                ││
│  │ [Wymień]                     ││  ← button, Moss Green
│  └──────────────────────────────┘│
│                                  │
│  ┌──────────────────────────────┐│
│  │ 🌿 Zniżka 20% w sklepie eko ││
│  │ 500 Eco-Coins                ││
│  │ [Wymień]                     ││
│  └──────────────────────────────┘│
│                                  │
│  ┌──────────────────────────────┐│
│  │ 📚 Voucher do księgarni      ││
│  │ 1 000 Eco-Coins              ││
│  │ [Wymień]                     ││
│  └──────────────────────────────┘│
│                                  │
│  ┌──────────────────────────────┐│
│  │ 🏖 Dzień wolny               ││
│  │ 5 000 Eco-Coins              ││
│  │ [Wymień]                     ││
│  └──────────────────────────────┘│
│                                  │
└──────────────────────────────────┘
```

- Karty: White, border-radius 12, shadow-sm
- Po wymianie: modal sukcesu z kodem (duży, wyśrodkowany)
- Jeśli brakuje EC: przycisk nieaktywny (Slate 300) + "Brakuje 50 EC"

### 3.5 Panel HR (web) — dark mode opcjonalny

**Dashboard:**
- 4 karty w grid: aktywni użytkownicy (%), średnie kroki, EC w obiegu, top streak
- Wykres liniowy (Chart.js lub Recharts): 7/30/90 dni
- Tabela: lista pracowników (sortowalna)

**Nagrody:**
- Formularz dodawania: nazwa, koszt EC, opis, limit, ikona
- Lista z przełącznikiem aktywny/nieaktywny
- Budżet: miesięczny limit + wydano + zostało

**Ustawienia:**
- Logo firmy (upload PNG/SVG, max 2MB)
- Cele domyślne
- Kody invite (generuj + lista)

---

## 4. User Flows

### Flow A: Pierwsze uruchomienie
```
Splash (2s) → Onboarding 1 → 2 → 3 → Ekran kodu invite
  → Wpisz kod → Formularz imienia + celu → Dashboard (pusty, pierwszy raz)
```

### Flow B: Codzienne użycie (rano)
```
Otwórz app → Dashboard → Progress ring pokazuje wczorajszy wynik
  → Sprawdź passę → Zrobione kroki (auto-sync) → Eko-deklaracje (1-3)
  → Sprawdź saldo EC → Zamknij app (15s sesja)
```

### Flow C: Wymiana punktów
```
Dashboard → Klik "Rynek" (lub tab) → Przeglądaj nagrody
  → Klik "Wymień" na wybranej → Modal potwierdzenia
  → Sukces → Kod QR → Zrzut ekranu
```

### Flow D: Wyzwanie (Faza 2)
```
Push: "Nowe wyzwanie: Tydzień bez samochodu!" → Klik
  → Widok wyzwania: cel, czas, nagroda → "Dołącz"
  → Progress w dashboard (pasek wyzwania)
  → Po zakończeniu: modal sukcesu + bonus EC
```

---

## 5. Mikro-interakcje i animacje

| Element | Animacja | Czas |
|---|---|---|
| Progress ring | Łagodne wypełnienie od 0 do targetu | 0.8s |
| Eco-Coins +n | Liczba wyskakuje + skaluje się | 0.3s |
| Streak fire | Subtelne pulsowanie ognia | 2s loop |
| Karta nagrody | Hover: lekki lift + shadow | 0.2s |
| Przejścia ekranów | Slide up (iOS) / Fade (Android) | 0.3s |
| Toast po deklaracji | Wsuwa się z dołu, znika po 2s | 0.3s + 2s |
| Button CTA | Hover: scale 1.02, tap: scale 0.98 | 0.15s |
| Modal wymiany | Fade in + scale up (0.95 → 1) | 0.25s |

---

## 6. Loading i empty states

| Stan | Komponent |
|---|---|
| Loading dashboard | Skeleton: 3 prostokąty z shimmer effect |
| Loading nagród | Skeleton: 4 karty z shimmer |
| Brak aktywności (pierwszy dzień) | Ilustracja + "Zacznij od spaceru!" |
| Brak nagród (puste) | Ilustracja + "Brak nagród — poproś HR o dodanie" |
| Brak deklaracji (wszystkie zrobione) | "Świetnie! Wykorzystałaś limit na dziś. Wróć jutro 🌿" |
| Error (no internet) | Ilustracja + "Brak połączenia" + button "Spróbuj ponownie" |
| Error serwera | Ilustracja + "Coś poszło nie tak" + button |

---

## 7. Responsywność (Panel HR)

| Breakpoint | Zachowanie |
|---|---|
| >1024px | Full layout, sidebar nawigacja |
| 768-1024px | Sidebar zwija się do ikon |
| <768px | Mobile layout, bottom nav, karty stacking |

---

## 8. Accessibility

- Kontrast: wszystkie teksty ≥ 4.5:1 (WCAG AA)
- Touch targets: ≥ 44px
- Font scaling: wsparcie dla systemowego Dynamic Type
- VoiceOver / TalkBack: wszystkie elementy mają accessibilityLabel
- Reduced motion: wyłączyć animacje (prefers-reduced-motion)
- Colorblind: nie polegać wyłącznie na kolorze (ikonki + label)

---

## 9. Design workflow

1. **Figma** — przygotować Design System (kolory, typografia, komponenty)
2. **Wireframes** → High-fidelity mockups (3 ekrany kluczowe: onboarding, dashboard, rynek)
3. **Prototype** — klikalny prototyp w Figmie (flow A + B)
4. **Handoff** — export assets + design tokens (JSON z kolorami, spacingiem)

### Priorytet mockupów do pokazania Hestii
1. Splash + Onboarding (3 ekrany) — pierwsze wrażenie
2. Dashboard — główny ekran, najwięcej czasu użytkownika
3. Rynek nagród — monetyzacja, wartość dla partnera
4. Panel HR — dowód że to gotowy produkt B2B
5. Rejestracja + kod invite

---

## 10. Design tokens do developmentu (JSON)

```json
{
  "colors": {
    "deepForest": "#1B4332",
    "mossGreen": "#2D6A4F",
    "sage": "#95D5B2",
    "mist": "#D8F3DC",
    "warmGold": "#D4A373",
    "sunset": "#E07A5F",
    "slate900": "#1E293B",
    "slate600": "#64748B",
    "slate300": "#CBD5E1",
    "slate100": "#F1F5F9",
    "white": "#FFFFFF",
    "success": "#40916C",
    "warning": "#E9C46A",
    "error": "#D62828"
  },
  "typography": {
    "h1": { "size": 28, "weight": 700, "lineHeight": 1.2 },
    "h2": { "size": 20, "weight": 600, "lineHeight": 1.2 },
    "h3": { "size": 16, "weight": 600, "lineHeight": 1.3 },
    "body": { "size": 15, "weight": 400, "lineHeight": 1.5 },
    "bodySmall": { "size": 13, "weight": 400, "lineHeight": 1.5 },
    "caption": { "size": 11, "weight": 600, "lineHeight": 1.4 },
    "points": { "size": 34, "weight": 800, "lineHeight": 1.1 },
    "steps": { "size": 24, "weight": 700, "lineHeight": 1.1 }
  },
  "spacing": [4, 8, 12, 16, 20, 24, 32, 40, 48, 64],
  "borderRadius": {
    "sm": 8,
    "md": 12,
    "lg": 16,
    "xl": 24,
    "full": 9999
  },
  "shadows": [
    { "name": "sm", "value": "0 1px 2px rgba(0,0,0,0.04)" },
    { "name": "md", "value": "0 4px 12px rgba(0,0,0,0.06)" },
    { "name": "lg", "value": "0 8px 24px rgba(0,0,0,0.08)" },
    { "name": "xl", "value": "0 16px 40px rgba(0,0,0,0.10)" }
  ]
}
```

---

## 11. Dashboard — pixel-level spec

### Kontener
- **Wymiary**: 390 × 844 px (iPhone 14 Pro)
- **Tło**: #F1F5F9 (Slate 100)
- **Padding content**: 0 20px (left/right)
- **Scroll**: vertical, ukryty scrollbar

### Status Bar
- **Wysokość**: 54px (14px top + 8px bottom padding)
- **Zawartość**: czas (lewo), icon + battery (prawo)
- **Font**: 11px/600, #1E293B
- **Notch**: 150 × 30px, #1E293B, border-radius 0 0 16px 16px, absolute, center

### Top Bar
- **Padding**: 4px top, 16px bottom
- **H1**: "Dzień dobry,<br>Kasiu 🌿" — 22px/700, #1B4332 + span 400 #64748B
- **Avatar**: 40 × 40px, okrągły, gradient 135° #95D5B2 → #2D6A4F, litera "K" center, 16px/600 white
- **Dot online**: 10 × 10px, #40916C, border 2px #F1F5F9, position absolute bottom -2px right -2px

### Streak Row
- **Margin-bottom**: 16px
- **Badge**: 🔥 + "5-dniowa passa! +20%", 12px, #64748B, strong #1E293B
- **Bell button**: 36 × 36px, okrągły, biały, shadow-sm

### Progress Card
- **Background**: #fff, border-radius 16px, padding 20px, shadow-sm
- **Margin-bottom**: 16px
- **Steps number**: 36px/800, #1B4332, letter-spacing -1px
- **Steps goal**: "z 8 000 kroków" — 13px, #94a3b8
- **Eco earned**: "31 dzisiaj" — 12px, #64748B; strong 15px/700 #D4A373
- **Progress track**: wysokość 8px, #E2E8F0, border-radius 999px, overflow hidden
- **Progress fill**: 78%, gradient 90° #95D5B2 → #2D6A4F, border-radius 999px, transition .8s
- **Progress stats**: flex space-between, 11px, #94a3b8
- **Streak bar**: margin-top 12px, padding-top 12px, border-top 1px #F1F5F9; 7 × 4px kropki, gap 4px, #E2E8F0 default / #D4A373 filled / gradient today

### Quick Actions
- **Grid**: 2×2, gap 10px
- **Karta**: background #fff, border 1px #E2E8F0, radius 12px, padding 14px center
- **Icon**: 24px
- **Label**: 11px/500, #64748B
- **Hover**: shadow + border #95D5B2 + translateY(-1px)

### Section Header "Eko-deklaracje"
- **H3**: 14px/600, #1E293B
- **Counter**: "zostało 2/3" — 11px, #94a3b8
- **Margin-bottom**: 10px

### Eko-deklaracje karuzela
- **Container**: flex, gap 10px, overflow-x auto, padding-bottom 4px
- **Karta**: min-width 110px, #fff, border 1px #E2E8F0, radius 12px, padding 12px, text-align center
- **Emoji**: 28px
- **Nazwa**: 10px/600, #1E293B, line-height 1.3
- **Punkty**: 9px/700, #D4A373
- **Stan done**: background #D8F3DC, border #95D5B2, nazwa #1B4332
- **Stan locked**: opacity 0.5
- **Margin-bottom**: 16px

### Balance Card
- **Background**: gradient 135° #D8F3DC → #F1F5F9, border-radius 14px, padding 16px 18px
- **Border**: 1px solid rgba(149,213,178,.3)
- **Icon container**: 44 × 44px, gradient 135° #D4A373 → #E07A5F, radius 12px, shadow z gold
- **Label**: "Twoje saldo" — 10px/600, uppercase, #64748B, letter-spacing .5px
- **Amount**: 26px/800, #1B4332, letter-spacing -1px
- **Arrow**: →, 20px, #2D6A4F, opacity .5
- **Margin-bottom**: 16px

### Challenge Banner
- **Background**: #fff, border-radius 12px, padding 14px 16px
- **Border**: 1px #E2E8F0
- **Icon**: 40 × 40px, #F1F5F9, radius 10px
- **Title**: 12px/600, #1E293B
- **Sub**: 11px, #64748B
- **Arrow**: ›, 16px, #94a3b8
- **Margin-bottom**: 16px

### Tab Bar
- **Position**: absolute bottom, full width
- **Background**: #fff, border-top 1px #E2E8F0
- **Padding**: 8px 0 24px (24px = safe area)
- **Item**: flex column, gap 2px, 10px, #94a3b8
- **Active**: #2D6A4F
- **Icon**: 22px

---

Otwórz `dashboard-mockup.html` — to działający, piksel po pikselu dashboard. Możesz go przeciągnąć na telefon przez AirDrop albo otworzyć w przeglądarce.

## 12. Następny krok

- Zatwierdź kierunek wizualny i paletę
- Przygotować Figmę z Design Systemem
- Mockupy 5 kluczowych ekranów (do pokazania Hestii)
- Klikalny prototyp flow A + B
