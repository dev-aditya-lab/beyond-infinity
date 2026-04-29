# OpsPulse Design System (SpaceX-Inspired)

## 1. Visual Theme & Atmosphere

OpsPulse's interface is a full-screen cinematic experience that treats incident response like a live mission — every section is a system state, every visual is a real-time snapshot, and the interface disappears entirely behind operational imagery. The design is pure black (`#000000`) with visuals of infrastructure, servers, dashboards, and network systems occupying 100% of the viewport. Text overlays sit directly on these visuals with no background panels, cards, or containers — just critical information on top of system context.

The typography system uses D-DIN, an industrial geometric typeface with DIN heritage. The defining characteristic is that virtually ALL text is uppercase with positive letter-spacing (0.96px–1.17px), creating a command-line / control-room labeling system where every word feels like a system instruction or alert. D-DIN-Bold at 48px with uppercase and 0.96px tracking for the hero creates headlines that feel like mission-critical alerts. Even body text at 16px maintains the uppercase/tracked treatment at smaller scales.

What makes OpsPulse distinctive is its radical minimalism: no shadows, no borders (except one ghost button border at `rgba(240,240,250,0.35)`), no color (only black and a spectral near-white `#f0f0fa`), no cards, no grids. The only visual element is system imagery + text. The ghost button with `rgba(240,240,250,0.1)` background and 32px radius is the sole interactive element — barely visible, floating like a heads-up display. This isn't a traditional UI — it's a real-time operational interface with a type system and a single action layer.

**Key Characteristics:**
- Pure black canvas with full-viewport system visuals — the interface is invisible
- D-DIN / D-DIN-Bold — industrial control-system typeface
- Universal uppercase + positive letter-spacing (0.96px–1.17px) — command-line aesthetic
- Near-white spectral text (`#f0f0fa`) — high visibility in dark environments
- Zero shadows, zero cards, zero containers — text on visuals only
- Single ghost button: `rgba(240,240,250,0.1)` background with spectral border
- Full-viewport sections — each section is a system "state"
- No decorative elements — every pixel serves operational clarity

## 2. Color Palette & Roles

### Primary
- **Ops Black** (`#000000`): Page background, control room environment — at 50% opacity for overlay gradient
- **Signal White** (`#f0f0fa`): Text color — high-contrast system visibility

### Interactive
- **Ghost Surface** (`rgba(240, 240, 250, 0.1)`): Button background — nearly invisible, 10% opacity
- **Ghost Border** (`rgba(240, 240, 250, 0.35)`): Button border — spectral, 35% opacity
- **Hover White** (`var(--white-100)`): Link hover state — full signal white

### Gradient
- **Dark Overlay** (`rgba(0, 0, 0, 0.5)`): Gradient overlay on visuals to ensure text readability

## 3. Typography Rules

### Font Families
- **Display**: `D-DIN-Bold` — bold industrial geometric
- **Body / UI**: `D-DIN`, fallbacks: `Arial, Verdana`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero | D-DIN-Bold | 48px (3.00rem) | 700 | 1.00 (tight) | 0.96px | `text-transform: uppercase` |
| Body | D-DIN | 16px (1.00rem) | 400 | 1.50–1.70 | normal | System information text |
| Nav Link Bold | D-DIN | 13px (0.81rem) | 700 | 0.94 (tight) | 1.17px | `text-transform: uppercase` |
| Nav Link | D-DIN | 12px (0.75rem) | 400 | 2.00 (relaxed) | normal | `text-transform: uppercase` |
| Caption Bold | D-DIN | 13px (0.81rem) | 700 | 0.94 (tight) | 1.17px | `text-transform: uppercase` |
| Caption | D-DIN | 12px (0.75rem) | 400 | 1.00 (tight) | normal | `text-transform: uppercase` |
| Micro | D-DIN | 10px (0.63rem) | 400 | 0.94 (tight) | 1px | `text-transform: uppercase` |

### Principles
- **Universal uppercase**: All text behaves like system alerts or commands
- **Positive letter-spacing as identity**: Creates clarity and readability in high-pressure environments
- **Two weights, strict hierarchy**: Bold for alerts, regular for information
- **Tight line-heights**: Efficient, fast-scanning communication

## 4. Component Stylings

### Buttons

**Ghost Button**
- Background: `rgba(240, 240, 250, 0.1)`
- Text: Signal White (`#f0f0fa`)
- Padding: 18px
- Radius: 32px
- Border: `1px solid rgba(240, 240, 250, 0.35)`
- Hover: background brightens, text to `var(--white-100)`
- Use: Primary actions — "VIEW INCIDENT", "ACKNOWLEDGE", "RESOLVE"

### Cards & Containers
- **None.** OpsPulse does not use cards or panels. All content is overlayed directly on system visuals.

### Inputs & Forms
- Not present in landing experience. Focus is on monitoring and visibility.

### Navigation
- Transparent overlay nav on visuals
- D-DIN 13px weight 700, uppercase, 1.17px tracking
- Signal white text
- Logo: OpsPulse wordmark
- Mobile: hamburger collapse

### Image Treatment
- Full-viewport (100vh) system visuals
- Infrastructure, dashboards, alerts, networks
- Dark gradient overlays for readability
- Each section = one operational state
- Edge-to-edge visuals

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 3px, 5px, 12px, 15px, 18px, 20px, 24px, 30px
- Minimal scale — visuals drive layout

### Grid & Container
- No traditional grid — each section is full-viewport
- Text overlays on visuals
- Left-aligned content
- No max-width container

### Whitespace Philosophy
- **System visuals ARE the whitespace**
- Empty space is filled with operational context
- **Vertical pacing through viewport**: each section = one system stage

### Border Radius Scale
- Sharp (4px): utilities
- Button (32px): ghost buttons

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Background (Level 0) | Full-viewport visuals | System layer |
| Overlay (Level 1) | `rgba(0, 0, 0, 0.5)` | Readability |
| Text (Level 2) | Signal white text | Information |
| Ghost (Level 3) | `rgba(240, 240, 250, 0.1)` | Interaction |

**Shadow Philosophy**: ZERO shadows. Depth comes from real system visuals and context.

## 7. Do's and Don'ts

### Do
- Use full-viewport system visuals
- Keep everything uppercase
- Maintain minimal UI
- Use ghost buttons only
- Focus on clarity and urgency

### Don't
- Don’t use cards or panels
- Don’t add colors
- Don’t clutter UI
- Don’t break cinematic flow

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <600px | Stacked, reduced padding, smaller type |
| Tablet Small | 600–960px | Adjusted layout |
| Tablet | 960–1280px | Standard scaling |
| Desktop | 1280–1350px | Full layout |
| Large Desktop | 1350–1500px | Expanded |
| Ultra-wide | >1500px | Maximum viewport |

### Touch Targets
- Ghost buttons: 18px padding
- Navigation readable with spacing

### Collapsing Strategy
- Visuals remain full-screen
- Navigation → hamburger
- Text repositions

### Image Behavior
- Full responsive visuals
- Cover + center positioning
- Same visuals across devices

## 9. Agent Prompt Guide

### Quick Color Reference
- Background: Ops Black (`#000000`)
- Text: Signal White (`#f0f0fa`)
- Button background: Ghost (`rgba(240, 240, 250, 0.1)`)
- Button border: Ghost Border (`rgba(240, 240, 250, 0.35)`)
- Overlay: `rgba(0, 0, 0, 0.5)`

### Example Component Prompts
- "Create a full-viewport hero showing system alerts with overlay and uppercase heading"
- "Design navigation with uppercase control-style links"
- "Build a section showing monitoring state with overlay text"
- "Create alert label with micro typography"

### Iteration Guide
1. Start with system visuals
2. Keep all text uppercase
3. Use only black and white
4. Keep UI minimal
5. Use ghost buttons only
6. Maintain full-screen sections