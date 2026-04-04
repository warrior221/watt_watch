# Design System Strategy: The Obsidian Pulse

## 1. Overview & Creative North Star
**Creative North Star: The Sentinel's Vigil**
This design system moves away from the "cluttered dashboard" trope and toward a high-fidelity, cinematic monitoring experience. The aesthetic is "The Sentinel's Vigil"—an interface that feels like a quiet, powerful engine room. We achieve this by prioritizing spatial depth over structural lines. By utilizing intentional asymmetry, we draw the eye to critical data anomalies while letting healthy infrastructure recede into a sophisticated, dark-mode atmosphere.

The layout breaks the rigid grid through "Layered Technicality"—where maps and node-graphs act as a living basement layer, with data widgets floating above them like glass HUD elements.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep midnight tones (`surface`), using vibrant, luminous accents for status-critical information.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Traditional borders create visual noise that distracts from technical data. Boundaries must be defined solely through:
- **Tonal Shifts:** Placing a `surface_container_high` widget on a `surface_dim` background.
- **Luminosity:** Using a subtle `surface_tint` (10% opacity) to suggest a boundary.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-transparent materials.
- **Base Layer:** `surface_dim` (#0b1326) – The infinite void.
- **Secondary Containers:** `surface_container` (#171f33) – For persistent sidebars or global navigation.
- **Interaction Layer:** `surface_container_highest` (#2d3449) – For active widgets or prioritized data panels.

### The "Glass & Gradient" Rule
To achieve the "Phantom" aesthetic, all floating panels should utilize **Glassmorphism**:
- **Background:** `surface_container_low` at 80% opacity.
- **Backdrop-blur:** 12px to 20px.
- **Gradients:** Use a linear gradient from `primary` (#adc6ff) to `primary_container` (#4d8eff) at 15% opacity as a subtle "sheen" on the top-left corner of active widgets.

---

## 3. Typography
The system uses a dual-font approach to balance editorial authority with technical precision.

- **The Voice (Inter):** All `display`, `headline`, and `title` roles use **Inter**. It is neutral, legible, and authoritative. Use `headline-lg` for critical system-wide metrics to create an "editorial impact" against the darker background.
- **The Data (Space Grotesk):** All `label` roles use **Space Grotesk**. This mono-esque sans-serif provides a "coded" feel for timestamps, IP addresses, and node IDs, reinforcing the high-tech monitoring context.

**Hierarchy Tip:** Keep `body-sm` for secondary metadata, but ensure `label-md` (Space Grotesk) is used for all "live" data readouts to distinguish human-written text from machine-generated data.

---

## 4. Elevation & Depth
In this system, depth is a functional tool, not a stylistic flourish.

- **Tonal Layering:** Achieve hierarchy by "stacking." A `surface_container_lowest` card placed on a `surface_container_low` section creates a recessed effect, perfect for secondary logs.
- **Ambient Shadows:** For floating HUD elements, use extra-diffused shadows.
    - **Shadow Color:** `#000000` at 40% opacity.
    - **Blur:** 40px.
    - **Spread:** -10px.
- **The "Ghost Border" Fallback:** If a separation is required for accessibility, use the `outline_variant` (#424754) at **15% opacity**. This creates a "glint" on the edge rather than a hard line.
- **Glowing Accents:** For alerts (Success, Warning, Error), apply a 2px outer glow (`box-shadow`) using the respective token color at 30% opacity to simulate a light-emitting diode.

---

## 5. Components

### Buttons
- **Primary:** `primary` background with `on_primary` text. No border. Soft `xl` (0.75rem) corner radius.
- **Secondary (Ghost):** `outline` ghost border (20% opacity) with `primary` text.
- **States:** On hover, increase the `surface_tint` overlay by 10%.

### Data Widgets (Cards)
Forbid divider lines. Use `surface_container_high` for the header area and `surface_container` for the body. The transition between these two tones is the only "divider" allowed.

### Chips (Node Status)
- **Selection Chips:** Use `secondary_container` with `on_secondary_container` text.
- **Action Chips:** Interactive icons only, utilizing `primary_fixed_dim` for the icon color.

### Input Fields
- **Background:** `surface_container_lowest`.
- **Active State:** Change border to a "Ghost Border" of `primary` at 40% opacity.
- **Typography:** Labels must be `label-sm` in `on_surface_variant`.

### Infrastructure-Specific Components
- **The Node Edge:** Lines connecting nodes in the map view should use `outline_variant` at 30% opacity. When a path is "active," animate a gradient stroke of `primary` to `tertiary`.
- **The Pulsing Alert:** For critical failures, use a `error_container` background with a repeating 2s pulse animation on the `box-shadow`.

---

## 6. Do's and Don'ts

### Do
- **Do** use `spaceGrotesk` for all numerical data to give it a technical, "monospaced" feel.
- **Do** allow the map background to peek through widgets using 85% opacity on `surface_container` tiers.
- **Do** use intentional asymmetry—place a large metric on the left and several small logs on the right to break the "standard grid" feel.

### Don't
- **Don't** use pure white (#FFFFFF) for body text. Use `on_surface_variant` (#c2c6d6) to reduce eye strain in dark environments.
- **Don't** use 1px solid borders for containment. It breaks the "Obsidian" illusion.
- **Don't** use standard shadows. If it doesn't look like an ambient glow, it's too heavy.
- **Don't** crowd the interface. If a widget isn't providing "critical" or "contextual" data, it should be moved to a secondary layer.