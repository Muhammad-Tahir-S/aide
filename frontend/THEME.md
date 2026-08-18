# Forest Floor

This is the visual language of the frontend. One light theme. No dark mode.

The product should feel like a **calm place to work**: a desk under the trees, not a dashboard. Warm earth, verdant green, mushroom beige. Quiet chrome. Nothing fluorescent, nothing cool-gray, nothing indigo.

If a new screen, component, or illustration fights that, it is wrong for this app.

## Intent

- **Mood:** chill, grounded, unhurried. Work that can wait a breath.
- **Place:** woodland floor — bark, lichen, duff after rain, a cabin desk.
- **Light:** always day. Cream-to-beige canvas, never near-black UI.
- **Motion:** rare and slow. Atmosphere, not entertainment.
- **Voice in the UI:** storybook headings, practical body type. Soft, not cute.

Rejected directions (do not drift back toward them): Moss Garden, Olive Grove, Matcha Cream, Fern & Clay, and the original indigo/orange system.

## How to apply it

Use the CSS tokens in `frontend/src/index.css` (`:root`). Prefer Tailwind classes that already map to those tokens:

| Role | Tokens | Typical classes |
| --- | --- | --- |
| Page canvas | `--background` `#EFE8DC` | `bg-background` |
| Raised surface | `--base-light` `#F7F1E6` | `bg-base-light` |
| Verdant (primary) | `--primary-main` `#3E5648` | `bg-primary-main`, `text-primary-main` |
| Earth (secondary) | `--secondary-main` `#8A6748` | `bg-secondary-main`, `text-secondary-700` |
| Ink | `--gray-700` `#4A433A` | `text-gray-700` |
| Quiet text | `--gray-500` `#71675B` | `text-gray-500` |
| Hairline | `--gray-200` `#C1B8AB` | `border-gray-200-borders` |
| Soft fill | `--primary-50` `#DEDED3` | `bg-primary-50`, sidebar |

Do **not** introduce raw `#fff`, Tailwind default `gray-*` that is cool, indigo, violet, or neon green. If you need a new shade, mix it from the scales below and add a token — do not one-off hex in a component.

There is **no dark mode**. Keep `color-scheme: light`. Do not add `.dark` palettes or `dark:` as a product feature.

## Color scale

### Canvas and ink

| Token | Hex | Use |
| --- | --- | --- |
| `--background` | `#EFE8DC` | App field (mushroom beige) |
| `--base-light` | `#F7F1E6` | Cards, inputs, raised panels |
| `--base-dark` / `--gray-900` | `#26221B` | Deepest ink, never a page background |
| `--foreground` / `--gray-700` | `#4A433A` | Primary text |

### Verdant (primary)

Deep forest, not mint and not lime.

| Step | Hex |
| --- | --- |
| 25 | `#E9E7DD` |
| 50 | `#DEDED3` |
| 100 | `#C8CBC0` |
| 200 | `#ABB2A7` |
| 300 | `#879487` |
| 400 | `#627568` |
| **main** | **`#3E5648`** |
| hover | `#384E41` |
| pressed | `#32463B` |
| 800 | `#2A3930` |
| 900 | `#222F28` |
| 920 | `#1C2621` |
| 950 | `#18201B` |

### Earth (secondary)

Bark brown. Accents, tags, secondary actions — terracotta-adjacent but still woodland.

| Step | Hex |
| --- | --- |
| 25 | `#F0E8DD` |
| 50 | `#EAE0D3` |
| 100 | `#DDCFC0` |
| 200 | `#CBB9A7` |
| 300 | `#B69E87` |
| 400 | `#A08268` |
| **main** | **`#8A6748`** |
| 600 | `#7C5D41` |
| 700 | `#6E523A` |

### Warm stone (gray)

Every “gray” is taupe. If text looks blue-gray, the token was skipped.

| Step | Hex |
| --- | --- |
| 25 | `#EFE8DC` |
| 50 | `#E8E1D5` |
| 100 | `#D8D0C4` |
| 200 | `#C1B8AB` |
| 300 | `#AAA093` |
| 400 | `#8E8476` |
| 500 | `#71675B` |
| 600 | `#5C5449` |
| 700 | `#4A433A` |
| 800 | `#38332B` |
| 850 | `#2F2A23` |
| 900 | `#26221B` |

Semantic colors (success, warning, error, info) already exist. Keep them; do not restyle the forest with them. Success may be used for true success states only — it should not become a second primary green.

## Type

| Role | Family | How |
| --- | --- | --- |
| UI, labels, body | **Instrument Sans** | `--font-ui`, default on `*` |
| Titles, logo, display | **Source Serif 4** | `--font-display-family`, class `font-serif` |

Heading tracking is `0` (`--heading-tracking`). Do not tighten display type into a tech-product look. Space Grotesk is loaded historically — do not start using it for new UI.

## Shape, depth, air

- **Radius:** `--radius: 0.4rem` — wood, slightly rectangular. Not pills, not squircles.
- **Shadow:** `--custom-shadow` — warm, low, mixed from `--primary-950`. No cool drop-shadow black.
- **Grain:** body overlay, `--grain-opacity: 0.07`. Leave it. Do not add extra noise in components.
- **Washes:** quiet green/earth radials on the canvas (`--wash-tl`, `--wash-br`).
- **Chrome:** quieter than a typical SaaS app. Sidebar and header sit on `--primary-50`, not white.

## Atmosphere (botanicals)

Corner botanicals are part of the theme, not decoration to strip.

- **Files:** SVGs in `frontend/src/shared/assets/icons/` (`fern-fronds`, `fiddlehead`, `olive-branch`, `pine-mushrooms`, `tea-leaves`).
- **Registry:** `frontend/src/shared/components/atmosphere.ts`.
- **Behavior:** `frontend/src/shared/theme/atmosphere.tsx` and `atmosphere-provider.tsx`.

Rules:

1. Cycle all five motifs from a **shuffled deck**. Never show the same motif twice in a row. Default motif is `fern-fronds`.
2. Change **about once an hour**, not on a polling interval. Check on navigation, tab visibility, and a single timeout while the tab is visible.
3. Morph with **mist dissolve** only: ~2.8s opacity + blur + tiny drift. Transform and opacity only. Honor `prefers-reduced-motion` (instant swap, no animation).
4. **Placement:** when the sidebar is open, the active motif lives **in the sidebar** (behind the profile block). When the sidebar closes, fade it into the workspace corner (viewport bottom-left on mobile; inner content corner on desktop so the rail does not cover it). Top-right motif stays on the page except when the mobile sidebar is full-screen.
5. Do not add a persistent timer, a theme picker, or a second transition style (no drift-only, no fog bloom, no path morphing).
6. Keep animations cheap. No layout thrash, no filters on idle frames.

## Motion elsewhere

Idle botanical sway/float/breathe already in CSS is enough. New UI motion should be short, opacity/transform only, and slower than a typical product. Do not add celebratory or high-frequency animation.

## Checklist for frontend changes

- [ ] New surfaces use `background` / `base-light` / `primary-50`, not white or cool gray.
- [ ] Interactive green is `primary-*`; brown accent is `secondary-*`.
- [ ] Body type is Instrument Sans; titles that should feel like the product use `font-serif`.
- [ ] Corners follow `--radius` (about `0.4rem`), not `9999px`.
- [ ] No new dark theme, no indigo/violet leftovers, no “fresh mint” primary.
- [ ] Atmosphere still visible, mist-only, and not covered by new opaque chrome without a placement plan.
- [ ] Reduced motion still respected.
