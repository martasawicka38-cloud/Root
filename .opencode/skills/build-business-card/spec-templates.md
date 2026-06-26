# Spec Templates — Szablony formatów plików web/src/spec/

Ten plik jest zasobem referencyjnym dla skilla `build-business-card`.
Zawiera dokładne formaty wszystkich 6 plików specyfikacji.

---

## Format: web/src/spec/pages.md

```md
# HomePage

- trasa: / (index)
- komponent: web/src/pages/HomePage/HomePage.tsx
- sekcje (w kolejności):
  1. NavbarSection
  2. HeroSection
  3. AboutSection
  4. ServicesSection
  5. ContactSection
  6. FooterSection

# ContactPage

- trasa: /kontakt
- komponent: web/src/pages/ContactPage/ContactPage.tsx
- sekcje (w kolejności):
  1. NavbarSection (shared)
  2. ContactFormSection
  3. FooterSection (shared)
```

---

## Format: web/src/spec/sections.md

```md
## NavbarSection

- selector: nav
- backgroundColor: surface
- layout: 1 kolumna
- zawartość: logo, linki nawigacyjne, CTA button
- i18n keys: nav.home, nav.about, nav.services, nav.contact, nav.cta
- plik: web/src/shared/sections/NavbarSection/NavbarSection.tsx
- style: web/src/shared/sections/NavbarSection/NavbarSection.module.css

## HeroSection

- selector: header
- backgroundColor: brandSubtle
- layout: 2 kolumny (ratio 1:1), stackAt: mobile, reverseOnStack: false
- zawartość: H1 (hero.heading), podtytuł (hero.subheading), CTA button (hero.cta), zdjęcie
- i18n keys: hero.heading, hero.subheading, hero.cta
- plik: web/src/pages/HomePage/sections/HeroSection/HeroSection.tsx
- style: web/src/pages/HomePage/sections/HeroSection/HeroSection.module.css

## AboutSection

- selector: section
- backgroundColor: surface
- layout: 2 kolumny (ratio 2:1), stackAt: mobile
- zawartość: H2 (about.heading), opis (about.description), lista cech (about.feature1, about.feature2, about.feature3), zdjęcie
- i18n keys: about.heading, about.description, about.feature1, about.feature2, about.feature3
- plik: web/src/pages/HomePage/sections/AboutSection/AboutSection.tsx
- style: web/src/pages/HomePage/sections/AboutSection/AboutSection.module.css

## ServicesSection

- selector: section
- backgroundColor: brandSubtle
- layout: 1 kolumna + 3 karty w rzędzie
- zawartość: H2 (services.heading), 3x karta usługi (services.card1.title, services.card1.description, ...)
- i18n keys: services.heading, services.card1.title, services.card1.description, services.card2.title, services.card2.description, services.card3.title, services.card3.description
- plik: web/src/pages/HomePage/sections/ServicesSection/ServicesSection.tsx
- style: web/src/pages/HomePage/sections/ServicesSection/ServicesSection.module.css

## ContactSection

- selector: section
- backgroundColor: surface
- layout: 1 kolumna
- zawartość: H2 (contact.heading), formularz (contact.form.name, contact.form.email, contact.form.message, contact.form.submit)
- i18n keys: contact.heading, contact.form.name, contact.form.email, contact.form.message, contact.form.submit, contact.form.success, contact.form.error
- plik: web/src/pages/HomePage/sections/ContactSection/ContactSection.tsx
- style: web/src/pages/HomePage/sections/ContactSection/ContactSection.module.css

## FooterSection

- selector: footer
- backgroundColor: strong
- layout: 1 kolumna
- zawartość: copyright (footer.copyright), linki socjalne (footer.linkedin, footer.github)
- i18n keys: footer.copyright, footer.linkedin, footer.github
- plik: web/src/shared/sections/FooterSection/FooterSection.tsx
- style: web/src/shared/sections/FooterSection/FooterSection.module.css
```

---

## Format: web/src/spec/design-tokens.md

```md
# Design Tokens

## Kolory

- primary: #2563eb
- primary-subtle: #dbeafe
- secondary: #7c3aed
- neutral-100: #f8fafc
- neutral-900: #0f172a
- success: #16a34a
- error: #dc2626

## Tła (używane przez PageContainers)

- bg-surface: #ffffff
- bg-strong: #0f172a
- bg-brand-subtle: #eff6ff
- bg-scrim: rgba(0, 0, 0, 0.5)

## Typografia

- font-heading: 'Playfair Display', Georgia, serif
- font-body: 'Inter', system-ui, sans-serif
- font-ui: 'Inter', system-ui, sans-serif

## Skala typograficzna

- text-xs: 0.75rem
- text-sm: 0.875rem
- text-md: 1rem
- text-lg: 1.125rem
- text-xl: 1.25rem
- text-2xl: 1.5rem
- text-3xl: 2rem

## Radius

- radius-sm: 4px
- radius-md: 8px
- radius-lg: 16px

## Shadow

- shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12)
- shadow-md: 0 4px 16px rgba(0, 0, 0, 0.16)
```

---

## Format: web/src/spec/i18n.md

```md
# i18n Specification

- języki: pl, en
- domyślny: pl
- biblioteka: i18next + react-i18next
- przełącznik: tak

## Klucze per sekcja

### nav

- nav.home → "Strona główna" / "Home"
- nav.about → "O mnie" / "About"
- nav.services → "Usługi" / "Services"
- nav.contact → "Kontakt" / "Contact"
- nav.cta → "Skontaktuj się" / "Get in touch"

### hero

- hero.heading → "" / ""
- hero.subheading → "" / ""
- hero.cta → "" / ""

### about

- about.heading → "" / ""
- about.description → "" / ""
- about.feature1 → "" / ""
- about.feature2 → "" / ""
- about.feature3 → "" / ""

### services

- services.heading → "" / ""
- services.card1.title → "" / ""
- services.card1.description → "" / ""
- services.card2.title → "" / ""
- services.card2.description → "" / ""
- services.card3.title → "" / ""
- services.card3.description → "" / ""

### contact

- contact.heading → "" / ""
- contact.form.name → "" / ""
- contact.form.email → "" / ""
- contact.form.message → "" / ""
- contact.form.submit → "" / ""
- contact.form.success → "" / ""
- contact.form.error → "" / ""

### footer

- footer.copyright → "" / ""
- footer.linkedin → "LinkedIn" / "LinkedIn"
- footer.github → "GitHub" / "GitHub"
```

---

## Format: web/src/spec/routing.md

```md
# Routing

- tryb: SPA (jedna strona) | wielostronicowa
- router: createBrowserRouter — React Router Data Mode

## Drzewo tras

/
└── RootLayout (web/src/router/RootLayout.tsx)
├── / → HomePage (index route)
├── /kontakt → ContactPage
└── \* → 404 (errorElement na root route)

## Pliki

- web/src/router/index.tsx
- web/src/router/RootLayout.tsx

## Uwagi

- errorElement: tak (root route)
- loader/action: brak dla wizytówki (SPA bez fetchowania)
```

---

## Format: web/src/spec/components.md

```md
# Komponenty shared/ui

## Do zbudowania

### Button

- plik: web/src/shared/ui/Button/Button.tsx
- warianty: primary, secondary, ghost
- propsy: children, variant, href (opcjonalnie — renderuje <a> zamiast <button>), disabled
- użycie: hero.cta, nav.cta, contact.form.submit

### Heading

- plik: web/src/shared/ui/Heading/Heading.tsx
- warianty: h1, h2, h3 (prop `as`)
- propsy: as, children, align (left|center|right)
- użycie: każda sekcja z tytułem

### ServiceCard

- plik: web/src/shared/ui/ServiceCard/ServiceCard.tsx
- propsy: title, description, icon (opcjonalnie)
- użycie: ServicesSection — 3 karty

## Gotowe (PageContainers — nie modyfikuj)

- PageContainer — web/src/PageContainers/PageContainer/
- PageBody — web/src/PageContainers/PageBody/
- SectionContainer — web/src/PageContainers/SectionContainer/
- ColumnSection — web/src/PageContainers/ColumnSection/
- InnerColumnSection — web/src/PageContainers/InnerColumnSection/
- ContentSection — web/src/PageContainers/ContentSection/
```
