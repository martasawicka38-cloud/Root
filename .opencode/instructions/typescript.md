# TypeScript Instructions

## Zakres

Stosuj te instrukcje dla plików TypeScript, typów, interfejsów, kontraktów i logiki wymagającej typowania.

## Zasady

- Zakładaj TypeScript jako domyślny język implementacji.
- Typuj jawnie propsy, dane wejściowe, odpowiedzi, loader data i action payloady.
- Unikaj `any`, jeśli nie jest absolutnie konieczne.
- Nie twórz nadmiarowych typów bez potrzeby.
- Jeśli typ da się opisać prościej, opisz go prościej.
- Używaj typów tak, aby poprawiały czytelność kodu, a nie ją zaciemniały.
- Preferuj proste kontrakty między warstwami.
- Jeśli typowanie komplikuje implementację bez zysku, uprość model danych.
- Nie duplikuj tego samego typu w wielu miejscach bez potrzeby.
- Jeśli trzeba, wydziel wspólny kontrakt w jednej lokalizacji.

## Zasady praktyczne

- Typuj komponenty React jawnie.
- Typuj zwroty z funkcji, gdy poprawia to czytelność.
- Typuj dane z router loaderów i actionów.
- Typuj utility functions, jeśli ich kontrakt nie jest oczywisty.
- Nie twórz type hell dla prostych obiektów.
- Dla walidacji runtime i inferencji typów preferuj `Zod`.
- Jeśli projekt używa `Prisma`, opieraj kontrakty danych na modelach i wygenerowanych typach zamiast ręcznie duplikować te same struktury.
- Dla `NestJS` DTO na granicy HTTP `class-validator` i `class-transformer` są dozwolone, jeśli repo używa `ValidationPipe`. Poza tym przypadkiem nie dodawaj ich bez realnej potrzeby.
- Nie używaj `as any` jako skrótu do obchodzenia enumów, filtrów `Prisma`, DTO payloadów albo niezgodnych kontraktów. Zawężaj typ na boundary albo popraw model danych.
- Dla filtrów i danych ORM preferuj wygenerowane typy, np. enumy i `WhereInput`, zamiast `Record<string, unknown>` albo luźnych map bez kontraktu.

## Granice warstw

- W tym repo frontendowe TS/TSX żyje w `src/**`, a backendowe TS w `server/src/**` (jeśli backend jest częścią workspace).
- `src/**` nie importuje runtime code z `server/src/**` bezpośrednio. Granicą między warstwami jest HTTP API.
- Jeśli potrzebujesz współdzielonego kontraktu danych między frontendem i backendem, wynieś go do jednej jawnej lokalizacji zamiast kopiować typy po obu stronach.

## Nieużywane typy i martwy kod typów

- Nie definiuj `type X = z.infer<typeof schema>` jeśli `X` nigdzie nie pojawia się w sygnaturach funkcji, propsach, DTO ani JSX. Nieużywane type aliasy to martwy kod — usuń je.
- Przy refactoringu funkcji lub node'ów grafu sprawdź, czy wszystkie lokalne type aliasy nadal mają referencje. Jeśli nie — usuń od razu.

## import type — kiedy używać, kiedy nie

### Frontend (Expo / React Native / `src/**`)

- Używaj `import type { Foo }` dla każdego symbolu, który jest używany wyłącznie jako typ TypeScript (nie jest potrzebny w runtime). Jest to wymagane przez regułę `@typescript-eslint/consistent-type-imports` aktywną dla `src/**`.
- Mieszane importy rozdzielaj: `import { runtimeFn } from "./module"` + `import type { FooType } from "./module"`.

Uwaga: reguły ESLint konfiguruj zgodnie z realnym rootem frontendu (`src/**`).

### Backend NestJS (`server/**`)

- **Nie** używaj `import type` dla klas wstrzykiwanych przez NestJS DI (`@Injectable`, `@Controller` itp.). `emitDecoratorMetadata` emituje runtime metadata wyłącznie dla zwykłych importów — `import type` złamie rozwiązywanie zależności.
- `import type` w kodzie serverowym jest poprawne tylko dla interfejsów, type aliases i enumów, które nie są klasami DI.
- Reguła `@typescript-eslint/consistent-type-imports` jest aktywna **tylko** dla `src/**` (frontend). Nie włączaj jej dla `server/**`.

## ESLint — konfiguracja dla projektów full-stack

Domyślna konfiguracja `eslint.config.js` dla projektu Expo + NestJS powinna mieć oddzielne bloki per zakres:

```js
export default defineConfig([
  globalIgnores([
    "dist",
    "server/dist",
    "server/node_modules",
    "server/src/generated",
  ]),
  // Globalny blok — nieużywane zmienne dla całego TS/TSX
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  // Frontend — Expo/React Native + consistent-type-imports
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
    },
  },
  // Backend — Node globals
  {
    files: ["server/**/*.ts"],
    languageOptions: { globals: globals.node },
  },
]);
```

Kluczowe zasady:

- `consistent-type-imports` tylko dla `src/**`, nigdy dla `server/**`.
- W repo-level komunikacji i dokumentacji używaj ścieżek `src/**` i `server/src/**`.
- Backend dostaje osobny blok z `globals.node`, żeby `__dirname`, `process` itp. nie były flagowane jako undefined.

## Edge cases

- Jeśli nie wiesz, czy użyć `type` czy `interface`, wybierz wariant prostszy i spójny z istniejącym kodem.
- Jeśli typ staje się zbyt rozbudowany, rozbij go na mniejsze części.
- Jeśli typ nie wnosi wartości, usuń go.
