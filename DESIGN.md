# Design System Document: TrackWallet High-End Digital Experience

## 1. Overview & Creative North Star: "The Neon Observatory"
The North Star for this design system is **"The Neon Observatory."** It is a visual philosophy that treats personal finance not as a spreadsheet, but as a high-tech flight deck. We move away from the "banking blue" clichés toward a sophisticated, obsidian-based environment where data doesn't just sit on a page—it glows with intent.

To break the "template" look, we embrace **Intentional Asymmetry**. Key financial metrics should not be trapped in rigid, equal-width columns. Instead, use overlapping glass layers and dramatic shifts in typography scale to create an editorial feel. The interface should feel like a premium, dark-mode terminal where the most important information "blooms" out of the darkness.

---

## 2. Colors & Surface Philosophy
The palette is built on a foundation of deep obsidian (`surface-dim`) contrasted against hyper-saturated neon accents.

### Color Roles
- **Primary (`#a1faff` - Cyan):** Reserved for high-velocity actions and positive financial trends. Use with a "bloom" (subtle outer glow) to signify liquid assets or growth.
- **Secondary (`#b6f700` - Lime):** Used for "Success" states, budgeting wins, or secondary CTAs that require high visibility without the dominance of Cyan.
- **Tertiary (`#c47fff` - Ultraviolet):** Used for "Future State" elements—investments, projections, or premium features.
- **Neutral/Surface:** A range of dark grays from `#000000` to `#262d33` that provide depth.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. Structural boundaries must be defined solely through background shifts. 
- *Instead of a border:* Place a `surface-container-high` element on top of a `surface` background.
- *Depth over Lines:* Use the contrast between `#0a0f13` (Background) and `#151a1f` (Container) to imply edges.

### The Glass & Gradient Rule
To achieve a "bespoke" feel, use **Glassmorphism** for all primary cards.
- **Recipe:** Apply `surface-container` at 60% opacity with a `backdrop-filter: blur(20px)`. 
- **Signature Texture:** For primary CTAs, use a linear gradient from `primary` (#a1faff) to `primary-container` (#00f4fe) at a 135-degree angle. This adds "soul" to the button that a flat hex code cannot achieve.

---

## 3. Typography: Editorial Authority
We utilize a pairing of **Manrope** for high-impact display moments and **Inter** for utility-driven data.

- **Display & Headlines (Manrope):** Use `display-lg` (3.5rem) for account balances. Apply a `-4%` letter spacing (tight tracking) to create a sleek, "tech-forward" density. 
- **Body & Labels (Inter):** Use `body-md` (0.875rem) for transactional data. Inter’s high x-height ensures readability against dark backgrounds.
- **Hierarchy through Scale:** Do not rely on bolding alone. Create hierarchy by jumping two steps in the scale (e.g., a `display-sm` headline followed by a `label-md` subhead).

---

## 4. Elevation & Depth: Tonal Layering
In "The Neon Observatory," depth is atmospheric, not structural.

- **The Layering Principle:** 
    1. Base: `surface-dim` (#0a0f13).
    2. Section: `surface-container-low` (#0f1418).
    3. Card: `surface-container-high` (#1b2026) with Glassmorphism.
- **Ambient Shadows:** Shadows are never black. Use a tinted shadow: `rgba(161, 250, 255, 0.08)` with a 40px blur for "floating" elements. This mimics the light "spill" from the neon accents.
- **The "Ghost Border" Fallback:** If accessibility requires a stroke, use `outline-variant` (#44484d) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Cards & Containers
- **Styling:** Use `rounded-xl` (1.5rem) or `rounded-2xl` for all containers. 
- **Constraint:** Never use dividers. Separate list items using `spacing-4` (1rem) of vertical whitespace or a subtle shift from `surface-container` to `surface-container-low`.

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-container`), black text (`on-primary`), `rounded-full`. Add a subtle `primary` glow on hover.
- **Secondary:** Ghost style. Transparent background with a `Ghost Border` (15% opacity `outline-variant`) and `primary` colored text.
- **Sizing:** Large buttons should use `spacing-6` horizontal padding to maintain a premium, airy feel.

### Input Fields
- **Default State:** `surface-container-highest` background, no border, `rounded-lg`.
- **Active State:** A 1px "bloom" glow using the `primary` color and a subtle interior gradient shift.
- **Helper Text:** Always use `label-sm` in `on-surface-variant` to keep the UI clean.

### Financial "Bloom" Data Points
For key metrics (e.g., +24% growth), wrap the text in a low-opacity `secondary-container` chip and apply a CSS drop-shadow with the `secondary` color to create a "neon sign" effect.

---

## 6. Do's and Don'ts

### Do:
- **Use Wide Margins:** Use `spacing-8` or `spacing-10` for page gutters to create an "expensive" editorial feel.
- **Embrace the Void:** Let the `surface-dim` background breathe. Not every pixel needs a container.
- **Subtle Motion:** Use 300ms "Ease-Out-Expo" transitions for glass cards appearing on screen.

### Don't:
- **Don't use pure white (#FFFFFF):** It is too harsh. Use `on-surface` (#f1f4fa) for primary text to maintain the sophisticated dark-mode atmosphere.
- **Don't use standard shadows:** Avoid the "dirty" look of gray shadows. If it doesn't glow, it shouldn't have a shadow.
- **Don't use sharp corners:** Anything sharper than `rounded-md` breaks the "premium tech" aesthetic. Stick to `xl` and `2xl` for the "TrackWallet" signature.

---

## 7. Signature Layout Patterns
For the dashboard, avoid the "Box Grid." Use a **Layered Hero** approach:
1. The Total Balance in `display-lg` sits directly on the `surface-dim` background (no card).
2. Recent Transactions sit in a `surface-container-low` tray that slides *under* the balance.
3. High-priority alerts float in `glassmorphic` cards with a `tertiary` (Ultraviolet) glow.