# Design System Instructions

## Zakres

Stosuj te instrukcje dla plików związanych z design systemem, tokenami, stylami i komponentami bazowymi w projekcie Expo Universal App.

## Zasady podstawowe

- Każda decyzja wizualna ma żyć jako token (np. `src/theme/tokens.ts`) albo we wspólnych stałych stylów.
- Nie hardcoduj wartości wizualnych rozrzuconych po ekranach. Używaj wspólnych tokenów i helperów stylów.
- Komponenty bazowe nie mogą zawierać logiki domenowej.
- W React Native preferuj `StyleSheet.create` i współdzielone style na poziomie modułów feature.
- Komponenty bazowe nie wiedzą nic o domenowych stronach ani sekcjach.
- Scaffold frontendowy nie jest ukończony, jeśli ekran ma tylko strukturę JSX bez docelowego layoutu, spacingu i stanów interaktywnych.
- Frontend nie jest gotowy, jeśli admin działa na platformach natywnych lub mobile layout na webie nie jest zawężony.
- Frontend nie jest gotowy, jeśli kluczowy tekst i UI nie spełniają podstawowego kontrastu WCAG AA.

## Kontrast i WCAG

- Dla tekstu body, linków, etykiet formularza, placeholderów o znaczeniu informacyjnym i tekstu na kartach celuj co najmniej w 4.5:1.
- Dla dużych headingów i istotnych badge możesz użyć 3:1, ale tylko jeśli nadal są jednoznacznie czytelne.
- Przy alfa-backgroundach i tintach licz finalny kontrast po zblendowaniu, a nie na podstawie samego tokenu źródłowego.
- Jeśli projekt jest dark-only, neutralne sekcje muszą inheritować dark background z body lub page-level tokena. Jeśli projekt ma light section, przełącz fg/border tokens na kontrastową parę dark-on-light.
- Dla dark-only projectów sprawdź bazowe kontenery ekranów i fallback views.

## Konwencja katalogów komponentów

- Jeśli komponent lub ekran ma własne style, trzymaj go w katalogu o tej samej nazwie.
- Preferuj układ `Name/Name.tsx` oraz `Name.styles.ts` albo `Name.tsx` + lokalny `StyleSheet`.
- Ta konwencja obowiązuje dla `src/features/*`, `src/components/*` i ekranów w `src/app/*`.

## Struktura plików

```text
src/
  theme/
    tokens.ts
  app/
    _layout.tsx
    (mobile)/
    admin/
  components/
  features/
```

## Tokeny wizualne

Tokeny mapują się 1:1 na sekcję identyfikacji wizualnej z `REQUIREMENTS.md`.

Minimalny baseline:

```ts
export const tokens = {
  color: {
    primary: "",
    secondary: "",
    neutral100: "",
    neutral900: "",
    success: "",
    error: "",
  },
  space: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
} as const;
```

Jeśli sekcja potrzebuje dodatkowych wartości motion, overlay lub sizing, najpierw dodaj odpowiedni token.

## Responsywność i breakpointy

- Najpierw preferuj wartości zapisane jako tokeny.
- Jeśli breakpoint jest potrzebny, trzymaj progi viewportu w jednej wspólnej abstrakcji.
- Nie rozsypuj `375px`, `768px` po wielu plikach.
- Przed zamknięciem tasku sprawdź layout co najmniej dla desktopu i wąskiego mobile około 375px.

## Zasady layoutu Expo

- `src/app/admin/*` ma być web-only.
- `src/app/(mobile)/*` na webie ma być zawężone do maksymalnej szerokości 480.
- Jeśli komponent ma własny scroll poziomy, overflow zamknij wewnątrz komponentu.

## Workflow: REQUIREMENTS.md → tokeny → komponenty

1. Przeczytaj `Identyfikacja wizualna` z `REQUIREMENTS.md`.
2. Wypełnij `src/theme/tokens.ts` wartościami z wymagań.
3. Najpierw ostyluj pierwszy ekran mobile i pierwszy ekran admin, dopiero potem buduj dalsze feature'y.
4. Przed zakończeniem tasku frontendowego zrób audit surowych wartości w `.module.css`.
5. Przed zakończeniem sprawdź, czy strona nie wygląda jak wireframe: pola formularza mają grid i odstępy, karty są faktycznie kartami, a tagi nie sklejają się wizualnie.
6. Przed zakończeniem zrób audit overflow: brak page-level poziomego scrolla, szerokie komponenty scrollują lokalnie, a newralgiczne children w flex/grid mają `min-width: 0`.
7. Przed zakończeniem zrób audit kontrastu: sprawdź neutralne sekcje, pola formularza, nav linki, badge i teksty na tintowanych tłach względem WCAG AA.
8. Przed zakończeniem sprawdź działanie mobile/admin na docelowych platformach.
