---
description: Generuje kompletny moduł sekcji/ekranu na podstawie src/spec/sections.md i src/spec/i18n.md, bez skanowania całego projektu.
agent: planning
---

Argument użytkownika: $ARGUMENTS

# Generuj sekcję/ekran ze specyfikacji

Twoim zadaniem jest wygenerowanie jednego kompletnego pliku sekcji/ekranu na podstawie specyfikacji. Ładujesz tylko dwa pliki i nie skanujesz całego kodu aplikacji.

## Krok 1 — Odczytaj spec

Przeczytaj wyłącznie:

- `@src/spec/sections.md` — znajdź wpis dla żądanej sekcji
- `@src/spec/i18n.md` — znajdź klucze i18n dla tej sekcji

Jeśli argument nie pasuje do żadnej sekcji w spec, wylistuj dostępne sekcje i zatrzymaj się.

## Krok 2 — Wygeneruj plik sekcji

Na podstawie danych ze spec:

Mapowanie spec -> kod:

| Pole w spec     | Użycie w kodzie                                     |
| --------------- | --------------------------------------------------- |
| `platformScope` | `mobile`, `admin` albo `shared`                     |
| `routeGroup`    | ścieżka pod `src/app/(mobile)` albo `src/app/admin` |
| `featureModule` | plik pod `src/features/*`                           |
| `i18n keys`     | `t("namespace.key")`                                |
| `plik`          | ścieżka pliku do wygenerowania                      |

Szablon dla ekranu feature-first:

```tsx
// [ścieżka z spec]
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

export function [NazwaSekcji]() {
  const { t } = useTranslation();
  return (
    <View>
      <Text>{t("[namespace.title]")}</Text>
    </View>
  );
}
```

## Krok 3 — Podaj wynik

Zwróć:

1. Kompletny plik TSX gotowy do wklejenia lub zapisu.
2. Ścieżkę pliku z spec.
3. Listę kluczy i18n użytych w sekcji (do ręcznego uzupełnienia w messages JSON).

Nie zapisuj pliku automatycznie — zapytaj użytkownika czy ma go zapisać, czy tylko pokazać.

## Zasady nadrzędne

- Ładujesz tylko `sections.md` i `i18n.md`.
- Nie wymyślasz danych spoza spec.
- Zachowuj separację platform: `admin` web-only, `mobile` kompatybilne z iOS/Android/Web.
