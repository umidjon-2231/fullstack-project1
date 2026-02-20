# CALCUL8R — Codebase Documentation

> Satirical calculator landing page. Angular 21, standalone components, Signals API, cyberpunk neon aesthetic.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Architecture Patterns](#4-architecture-patterns)
5. [Design System](#5-design-system)
6. [Component Catalog](#6-component-catalog)
7. [Page Architecture](#7-page-architecture)
8. [Routing](#8-routing)
9. [Adding New Things](#9-adding-new-things)
10. [Special Features & Easter Eggs](#10-special-features--easter-eggs)
11. [Tooling & Scripts](#11-tooling--scripts)

---

## 1. Project Overview

CALCUL8R is a satirical single-page landing page for a fictional over-engineered calculator product. The entire content is a joke — quantum tunnels, blockchain NFTs per calculation, $999,999 enterprise pricing. The *actual* calculator widget in the middle is fully functional.

**What the page contains (top to bottom):**

| # | Section | Purpose |
|---|---------|---------|
| 1 | Boot Overlay | Fake terminal boot sequence on first load |
| 2 | Cursor Glow | Radial neon glow that follows the mouse |
| 3 | Confetti | Canvas burst (triggered by special calc results) |
| 4 | Hero | Main headline, CTA scroll button |
| 5 | Stats Bar | Animated counters (fake impressive metrics) |
| 6 | Press Bar | Fake press quotes |
| 7 | Features | 4-card feature grid (satire) |
| 8 | Testimonials | 6-card testimonials grid (satire) |
| 9 | Awards | Trophy display (satire) |
| 10 | Calculator Widget | **The real, functional calculator** |
| 11 | Comparison | Competitor comparison table (satire) |
| 12 | Pricing | 3 pricing tiers ($9k / $49k / $999k) |
| 13 | Team | 4 team member cards |
| 14 | FAQ | Accordion FAQ |
| 15 | Changelog | Version history (satire) |
| 16 | Countdown | Live 30-day countdown timer |
| 17 | Newsletter | Email signup form |
| 18 | Footer | Site footer |

---

## 2. Tech Stack

| Technology | Version | Role |
|------------|---------|------|
| Angular | ^21.1 | Framework |
| TypeScript | ~5.9 | Language (strict mode) |
| SCSS | — | Styling |
| lucide-angular | ^0.566 | Icons |
| RxJS | ~7.8 | Available (not heavily used; Signals preferred) |
| Vitest | ^4.0 | Unit testing |
| pnpm | 10.13.1 | Package manager |
| Angular CLI | ^21.1.4 | Build tooling |

**Angular-specific choices:**
- **Standalone components** everywhere — no `NgModule` at all
- **Signals API** for all reactive state (`signal()`, `computed()`)
- **`@for` / `@if`** control flow syntax (not `*ngFor` / `*ngIf`)
- **`output()`** function API (not `@Output() EventEmitter`)
- **`viewChild()`** function API (not `@ViewChild()`)
- **`inject()`** function API (not constructor injection)
- **`host` property** in `@Component` decorator for host bindings/listeners (not `@HostBinding` / `@HostListener` decorators where avoidable — though `@HostListener` is still used in some components)

---

## 3. Directory Structure

```
src/
├── index.html                    # Root HTML — fonts loaded here
├── main.ts                       # Bootstrap entry point
├── styles.scss                   # Global styles, CSS variables, shared classes
└── app/
    ├── app.ts                    # Root component (just <router-outlet>)
    ├── app.html
    ├── app.scss
    ├── app.config.ts             # Application providers
    ├── app.routes.ts             # Route definitions
    ├── app.spec.ts               # Root component tests
    ├── pages/
    │   └── calculator/           # The only page (lazy-loaded)
    │       ├── calculator-page.ts
    │       ├── calculator-page.html
    │       └── calculator-page.scss
    └── components/               # All reusable/section components
        ├── awards-section/
        ├── boot-overlay/
        ├── calculator-widget/
        ├── changelog-section/
        ├── comparison-section/
        ├── confetti/
        ├── countdown-section/
        ├── cursor-glow/
        ├── faq-section/
        ├── features-section/
        ├── hero-section/
        ├── newsletter-section/
        ├── press-bar/
        ├── pricing-section/
        ├── site-footer/
        ├── stats-bar/
        ├── team-section/
        └── testimonials-section/
```

**Every component folder contains exactly:**
- `component-name.ts` — class + decorator
- `component-name.html` — template (except fully inline-template components)
- `component-name.scss` — scoped styles

---

## 4. Architecture Patterns

### 4.1 Standalone Components

Every component is standalone — it explicitly lists its `imports` array. No `NgModule` exists anywhere.

```typescript
@Component({
  selector: 'app-example',
  imports: [LucideAngularModule],   // list everything consumed in the template
  templateUrl: './example.html',
  styleUrl: './example.scss',
})
export class ExampleComponent { }
```

### 4.2 Signals for State

All component-local reactive state uses Angular Signals:

```typescript
protected readonly count = signal(0);
protected readonly doubled = computed(() => this.count() * 2);

increment() {
  this.count.update(c => c + 1);
}
```

- `signal()` for mutable state
- `computed()` for derived values
- Never use `BehaviorSubject` or class properties for UI state — use Signals

### 4.3 Output API

Use the `output()` function, not `@Output() new EventEmitter()`:

```typescript
readonly confettiTrigger = output<void>();

// emit:
this.confettiTrigger.emit();
```

### 4.4 ViewChild API

Use the `viewChild()` function:

```typescript
protected readonly statsRef = viewChild<ElementRef>('statsRef');

// access:
const el = this.statsRef()?.nativeElement;
```

### 4.5 Dependency Injection

Use `inject()` at field-declaration level, not constructor parameters:

```typescript
private readonly doc = inject(DOCUMENT);
private readonly elRef = inject(ElementRef);
```

### 4.6 Host Bindings

Use the `host` property in `@Component` for simple host bindings and listeners:

```typescript
@Component({
  host: {
    '[class.konami-active]': 'konamiActive()',   // class binding
    '(window:mousemove)': 'onMove($event)',       // event listener
  },
})
```

For complex keyboard listeners attached to `window`, `@HostListener` on a method is acceptable:

```typescript
@HostListener('window:keydown', ['$event'])
handleKey(e: KeyboardEvent) { ... }
```

### 4.7 Template Control Flow

Always use the new block syntax, never structural directives:

```html
@for (item of items; track item.id) { ... }
@if (condition()) { ... }
```

### 4.8 Lucide Icons Pattern

Every component that uses icons declares a typed map at the top:

```typescript
import { LucideAngularModule, Star, Quote, type LucideIconData } from 'lucide-angular';

protected readonly icons: Record<string, LucideIconData> = {
  star: Star,
  quote: Quote,
};
```

Then in the template, reference by key:

```html
<i-lucide [img]="icons['star']" [size]="24" />
```

The `imports` array must include `LucideAngularModule`.

### 4.9 Lifecycle & Memory Management

Components that create timers, observers, or animation frames must clean them up:

- `IntersectionObserver` → disconnect in `ngOnDestroy()`
- `setInterval` / `setTimeout` → clear in `ngOnDestroy()`
- `requestAnimationFrame` → cancel via `cancelAnimationFrame()` in `ngOnDestroy()`
- Canvas elements appended to `document.body` → remove in `ngOnDestroy()`

Pattern:

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
```

### 4.10 Data as Protected Class Properties

Static display data (arrays of items) lives as `protected readonly` class properties — not a service, not a separate file. This keeps components self-contained:

```typescript
protected readonly pricing = [
  { name: 'Basic', price: '$9,999', features: [...] },
  ...
];
```

---

## 5. Design System

### 5.1 CSS Custom Properties (Design Tokens)

Defined in `src/styles.scss` on `:root`. **Always use these variables — never hard-code colors.**

| Variable | Value | Usage |
|----------|-------|-------|
| `--neon-cyan` | `#00fff2` | Primary accent, titles, glows |
| `--neon-magenta` | `#ff00e6` | Secondary accent, hover states |
| `--neon-green` | `#39ff14` | Tertiary accent |
| `--neon-amber` | `#ffaa00` | Star ratings, warm highlights |
| `--bg-dark` | `#0a0a0f` | Page background |
| `--bg-card` | `#12121a` | Card backgrounds |
| `--bg-surface` | `#1a1a2e` | Elevated surface backgrounds |
| `--text-primary` | `#e0e0e0` | Body text |
| `--text-muted` | `#888` | Secondary/hint text |
| `--font-display` | `'Orbitron', sans-serif` | Headings, titles |
| `--font-mono` | `'JetBrains Mono', monospace` | Body, all UI text |

### 5.2 Typography

Both fonts are loaded from Google Fonts in `src/index.html`:
- **Orbitron** — weights 400–900 — used for all section titles, logo, display text
- **JetBrains Mono** — weights 300–700 — used for everything else (body is set to mono)

Rules:
- Section titles → `font-family: var(--font-display)` + `color: var(--neon-cyan)` + `text-shadow: 0 0 10px var(--neon-cyan)`
- Body/labels → `font-family: var(--font-mono)` (inherited from `body`)

### 5.3 Shared Global Classes

Defined in `src/styles.scss`, available to all components:

| Class | Purpose |
|-------|---------|
| `.section-title` | Standard `<h2>` for any section — Orbitron, cyan glow |
| `.section-subtitle` | Muted subheading below section title |
| `.reveal` | Scroll-reveal start state (opacity 0, translated down) |
| `.reveal.revealed` | Triggered state (full opacity, natural position) |

**Every section component that should animate in on scroll must add `class="reveal"` in `calculator-page.html`.** The `CalculatorPage` wires up the `IntersectionObserver` automatically.

### 5.4 Global Decorative Effects

Applied globally via `src/styles.scss`:
- **Scanline overlay** — `body::after` with a repeating linear-gradient for a CRT effect (pointer-events: none, z-index: 9999)
- **Neon scrollbar** — custom `::-webkit-scrollbar` styled cyan/magenta
- **Smooth scroll** — `html { scroll-behavior: smooth }`

### 5.5 Component-Level Scoping

All component SCSS starts with `:host { display: block; }` to ensure the component's host element participates in layout flow.

Section components typically use this structure:
```scss
:host { display: block; }

.section-name {
  padding: 6rem 2rem;
  max-width: 1200px;   // or 900px / 1000px depending on content
  margin: 0 auto;
}
```

### 5.6 Neon Color Application Pattern

When applying neon color variants to cards/avatars dynamically, use a modifier class convention:

```scss
.avatar-cyan    { border-color: var(--neon-cyan);    color: var(--neon-cyan);    background: rgba(0,255,242,0.08); }
.avatar-magenta { border-color: var(--neon-magenta); color: var(--neon-magenta); background: rgba(255,0,230,0.08); }
.avatar-green   { border-color: var(--neon-green);   color: var(--neon-green);   background: rgba(57,255,20,0.08); }
.avatar-amber   { border-color: var(--neon-amber);   color: var(--neon-amber);   background: rgba(255,170,0,0.08); }
```

And bind dynamically in template:
```html
<div [class]="'prefix-' + item.color">...</div>
```

---

## 6. Component Catalog

### Utility / Overlay Components

| Component | Selector | Description |
|-----------|----------|-------------|
| `BootOverlayComponent` | `app-boot-overlay` | Full-screen terminal animation on load. Displays 8 lines of fake boot output at 300ms intervals, then fades out. No inputs/outputs. |
| `CursorGlowComponent` | `app-cursor-glow` | Tracks `window:mousemove` via `host` binding, updates `mouseX`/`mouseY` signals, renders a fixed radial gradient div. No inputs/outputs. |
| `ConfettiComponent` | `app-confetti` | Imperatively appends a `<canvas>` to `document.body`, animates 90 particles falling, auto-removes on completion. No template, no inputs/outputs. Spawned conditionally with `@if`. |

### Section Components (pure display, no inputs/outputs)

| Component | Selector | Key Implementation Detail |
|-----------|----------|--------------------------|
| `HeroSectionComponent` | `app-hero-section` | 8 particle divs (array index 1–8) for CSS animation; `scrollToCalculator()` uses `document.getElementById('calculator')`. |
| `PressBarComponent` | `app-press-bar` | Static logos/quotes. |
| `FeaturesSectionComponent` | `app-features-section` | 4-item feature array with Lucide icons map. |
| `TestimonialsSectionComponent` | `app-testimonials-section` | 6 testimonials; star rendering via `starRange = [1,2,3,4,5]` + `[class.filled]` binding. |
| `AwardsSectionComponent` | `app-awards-section` | Static award cards. |
| `ComparisonSectionComponent` | `app-comparison-section` | Static comparison table. |
| `PricingSectionComponent` | `app-pricing-section` | 3-tier pricing array with color variants. |
| `TeamSectionComponent` | `app-team-section` | 4 members array with `initial` + `color` for avatar rendering. |
| `ChangelogSectionComponent` | `app-changelog-section` | Simple `version` + `note` array, timeline-style. |
| `SiteFooterComponent` | `app-site-footer` | Static footer. |

### Interactive Section Components

| Component | Selector | Key Details |
|-----------|----------|-------------|
| `StatsBarComponent` | `app-stats-bar` | `IntersectionObserver` on `#statsRef` to trigger count-up animation only when visible. Uses `requestAnimationFrame` with cubic ease-out. After animation completes, first stat (calculations) enters a live incrementing loop. Implements `AfterViewInit` + `OnDestroy`. |
| `FaqSectionComponent` | `app-faq-section` | `faqOpen = signal<number \| null>(null)`. Toggle: set to index or null if already open (accordion). |
| `CountdownSectionComponent` | `app-countdown-section` | Target = `Date.now() + 30 days` at construction time. `setInterval` every 1000ms updates a `display` signal with `{ days, hours, mins, secs }` strings padded to 2 chars. |
| `NewsletterSectionComponent` | `app-newsletter-section` | `email` signal bound to input. `submit()` sets `submitted` signal to show confirmation state. No real network call. |

### Core Widget

| Component | Selector | Key Details |
|-----------|----------|-------------|
| `CalculatorWidgetComponent` | `app-calculator-widget` | Full calculator logic. See section below. |

#### Calculator Widget Deep Dive

**State signals:**
- `display` — current display string
- `previousOperand` — `number | null` — left-hand value
- `currentOperator` — `string | null` — pending operator (`+`, `-`, `*`, `/`)
- `waitingForOperand` — boolean flag — next digit replaces display
- `lastExpression` — string shown above the display
- `easterEgg` — string shown as a sub-display message
- `divideByZeroGlitch` — boolean — triggers glitch CSS animation
- `history` — array of `{ expression, result }` (max 20 entries)

**Computed:**
- `displayFormatted` — formats display with `toLocaleString('en-US')` for thousands commas

**Output:**
- `confettiTrigger` — emitted when result is `69`, `420`, `1337`, or `42`

**Keyboard support:**
- Full `@HostListener('window:keydown')` covering digits, operators, Enter, Escape, Delete, Backspace, `%`

**Buttons array:**
- Static array of `{ label, type, action }` objects — `type` maps to CSS classes (`digit`, `operator`, `function`, `equals`, `digit zero`)

**Easter eggs triggered by display value:**
- `42` → "THE ANSWER TO EVERYTHING"
- `1337` → "LEET MODE ACTIVATED"
- `404` → "NUMBER NOT FOUND"
- `666` → "DEMONIC CALCULATION DETECTED"
- `314` / `3.14159` → "MMMMM... PIE"

**Divide by zero:**
- Shows `ERR`, triggers `divideByZeroGlitch` signal for 1.5s, adds to history as `ERR`

---

## 7. Page Architecture

There is one page: `CalculatorPage` (`src/app/pages/calculator/`).

**Responsibilities of the page:**
1. **Imports and orchestrates all section components** in the template
2. **Scroll reveal** — `ngAfterViewInit` sets up a single `IntersectionObserver` that watches all `.reveal` elements and adds `.revealed` when they enter the viewport
3. **Konami code** — `@HostListener('window:keydown')` tracks the sequence ↑↑↓↓←→←→BA; on success, sets `konamiActive` signal for 5s, which applies a rainbow CSS animation via `[class.konami-active]` host binding
4. **Confetti orchestration** — listens to `(confettiTrigger)` output from `CalculatorWidgetComponent`; sets `showConfetti` signal true for 3s, which shows/destroys `<app-confetti>`

**Sections that scroll-reveal** (have `class="reveal"` in the template):
- press-bar, features-section, testimonials-section, awards-section, calculator-widget, comparison-section, pricing-section, team-section, faq-section, changelog-section, countdown-section, newsletter-section

**Sections that do NOT scroll-reveal:**
- cursor-glow, confetti, boot-overlay, hero-section, stats-bar, site-footer

---

## 8. Routing

Defined in `src/app/app.routes.ts`. Single route with lazy loading:

```typescript
{
  path: '',
  loadComponent: () =>
    import('./pages/calculator/calculator-page').then(m => m.CalculatorPage),
}
```

**When adding a new page:**
1. Create `src/app/pages/your-page/your-page.ts` (+ `.html`, `.scss`)
2. Add a route entry to `app.routes.ts` using `loadComponent`
3. Use a unique `path` string

---

## 9. Adding New Things

### 9.1 Adding a New Section Component

1. **Create the folder** under `src/app/components/your-section/`
2. **Create three files:**
   - `your-section.ts` — follow this boilerplate:
     ```typescript
     import { Component } from '@angular/core';

     @Component({
       selector: 'app-your-section',
       templateUrl: './your-section.html',
       styleUrl: './your-section.scss',
     })
     export class YourSectionComponent {
       // static data arrays go here as protected readonly
     }
     ```
   - `your-section.html` — use `.section-title` and `.section-subtitle` for the heading
   - `your-section.scss` — always start with `:host { display: block; }` then a max-width centered container
3. **Register in `calculator-page.ts`** — add to the `imports` array
4. **Add to `calculator-page.html`** — add `class="reveal"` unless it's an overlay/utility component
5. **Position** — place in the logical scroll order within the template

### 9.2 Adding Icons to a Component

```typescript
// 1. Import from lucide-angular
import { LucideAngularModule, YourIcon, type LucideIconData } from 'lucide-angular';

// 2. Add to icons map
protected readonly icons: Record<string, LucideIconData> = {
  'your-icon': YourIcon,
};

// 3. Add LucideAngularModule to imports array in @Component
```

```html
<!-- 4. Use in template -->
<i-lucide [img]="icons['your-icon']" [size]="20" />
```

### 9.3 Adding Interactive State

Use Signals:
```typescript
protected readonly isOpen = signal(false);
protected readonly items = signal<string[]>([]);
protected readonly count = computed(() => this.items().length);

toggle() { this.isOpen.update(v => !v); }
```

### 9.4 Adding a Timer / Observer

Always implement `OnDestroy` and store the handle:
```typescript
export class MyComponent implements OnInit, OnDestroy {
  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
```

### 9.5 Adding a New Page

```typescript
// app.routes.ts
{
  path: 'your-path',
  loadComponent: () =>
    import('./pages/your-page/your-page').then(m => m.YourPageComponent),
}
```

The page component is responsible for setting up scroll-reveal if needed (same pattern as `CalculatorPage.ngAfterViewInit`).

### 9.6 Naming Conventions

| Thing | Convention | Example |
|-------|------------|---------|
| Component class | `PascalCase` + suffix | `FeaturesSectionComponent` |
| Component file | `kebab-case` (no suffix) | `features-section.ts` |
| Component selector | `app-` prefix + kebab | `app-features-section` |
| Page class | `PascalCase` + `Page` | `CalculatorPage` |
| Signal | `camelCase`, `protected readonly` | `protected readonly isOpen = signal(false)` |
| Output | `camelCase`, no `on` prefix | `confettiTrigger = output<void>()` |
| Static data | `protected readonly` array | `protected readonly items = [...]` |
| Icon map | always named `icons` | `protected readonly icons: Record<string, LucideIconData> = {...}` |

---

## 10. Special Features & Easter Eggs

### Konami Code
Sequence: `↑ ↑ ↓ ↓ ← → ← → B A`

Handled in `CalculatorPage`. Activates `konamiActive` signal for 5 seconds, which applies the `konami-active` CSS class to the page host, triggering a continuous `hue-rotate(0deg → 360deg)` rainbow animation on the entire page.

### Confetti
Triggered when calculator result equals `69`, `420`, `1337`, or `42`.

Flow: `CalculatorWidgetComponent.checkConfetti()` → emits `confettiTrigger` → `CalculatorPage.onConfettiTrigger()` → sets `showConfetti` signal true → `@if (showConfetti())` renders `<app-confetti>` → component auto-destroys canvas after particles fall off screen → `showConfetti` set back to false after 3s timeout.

### Calculator Easter Eggs
Display-value-triggered messages in `CalculatorWidgetComponent.checkEasterEgg()`:
- `42` → "THE ANSWER TO EVERYTHING"
- `1337` → "LEET MODE ACTIVATED"
- `404` → "NUMBER NOT FOUND"
- `666` → "DEMONIC CALCULATION DETECTED"
- `314` or `3.14159` → "MMMMM... PIE"

### Divide by Zero Glitch
Dividing by zero triggers a `divideByZeroGlitch` signal that applies a CSS glitch animation for 1.5 seconds and shows "QUANTUM INSTABILITY DETECTED".

### Stats Bar Live Counter
After the initial count-up animation finishes, the "Calculations Performed" stat continues incrementing at ~3–8 per millisecond via a live `requestAnimationFrame` loop to simulate real-time usage.

---

## 11. Tooling & Scripts

```bash
pnpm start          # Dev server at localhost:4200
pnpm build          # Production build → dist/
pnpm test           # Vitest unit tests
pnpm run watch      # Dev build with watch
```

**Key configuration files:**
- `angular.json` — build targets, SCSS default style, output hashing
- `tsconfig.json` — strict TypeScript (strict, noImplicitReturns, noFallthroughCasesInSwitch, strictTemplates)
- `.editorconfig` — 2-space indent, single quotes for TS
- `package.json > prettier` — printWidth 100, single quotes, angular HTML parser

**Testing:**
- Test runner: Vitest (configured via `@angular/build:unit-test`)
- Test file: `src/app/app.spec.ts` for the root component
- Spec files use `tsconfig.spec.json` which includes `vitest/globals` types

**Bundle budget (production):**
- Initial: warn at 500kB, error at 1MB
- Any component style: warn at 4kB, error at 8kB
