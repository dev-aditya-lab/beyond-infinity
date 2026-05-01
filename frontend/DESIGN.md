# OpsPulse Design System (SpaceX-Inspired)

## 1. Visual Theme & Atmosphere

OpsPulse's interface is a full-screen cinematic experience that treats incident response like a live mission — every section is a system state, every visual is a real-time snapshot, and the interface disappears entirely behind operational imagery. The design is pure black (`#000000`) with visuals of infrastructure, servers, dashboards, and network systems occupying 100% of the viewport. Text overlays sit directly on these visuals with no background panels, cards, or containers — just critical information on top of system context.

The typography system uses Bebas Neue for display and headings, providing an industrial geometric feel, and Barlow for body text and UI elements. The defining characteristic is that virtually ALL text is uppercase with positive letter-spacing (e.g., 0.05em for headings, up to 0.28em for micro text), creating a command-line / control-room labeling system where every word feels like a system instruction or alert. Bebas Neue at 48px+ with uppercase and tracking for the hero creates headlines that feel like mission-critical alerts. Even body text at smaller scales using Barlow maintains the uppercase/tracked treatment.

What makes OpsPulse distinctive is its radical minimalism: no shadows, no borders (except one ghost button border at `rgba(240,240,250,0.35)`), no color (only black and a spectral near-white `#f0f0fa` or Tailwind `brand-offwhite`), no cards, no grids. The only visual element is system imagery + text. The ghost button with `rgba(240,240,250,0.1)` background and 32px radius is the sole interactive element — barely visible, floating like a heads-up display. This isn't a traditional UI — it's a real-time operational interface with a type system and a single action layer.

**Key Characteristics:**
- Pure black canvas with full-viewport system visuals — the interface is invisible
- Bebas Neue / Barlow — industrial control-system typography
- Universal uppercase + positive letter-spacing — command-line aesthetic
- Near-white spectral text (`#f0f0fa` / `text-brand-offwhite`) — high visibility in dark environments
- Zero shadows, zero cards, zero containers — text on visuals only
- Utility-first styling with Tailwind CSS — ensuring consistent design tokens and responsive scaling
- GSAP-powered animations — specifically for high-end staggered navigation elements
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
- **Display/Heading**: `Bebas Neue` (Tailwind class: `font-bebas`)
- **Body/UI**: `Barlow` (Tailwind class: `font-barlow`)

### Hierarchy

| Role | Font | Size / Tailwind Class | Line Height | Letter Spacing | Notes |
|------|------|-----------------------|-------------|----------------|-------|
| Display Hero | Bebas Neue | `text-[clamp(52px,8vw,108px)]` | `leading-[0.95]` | `tracking-[0.05em]` | `uppercase` |
| Section Heading | Bebas Neue | `text-[clamp(42px,6vw,84px)]` | `leading-[0.95]` | `tracking-[0.05em]` | `uppercase` |
| Stat Number | Bebas Neue | `text-[48px]` | default | `tracking-[0.06em]` | `text-brand-offwhite` |
| SubText / Body | Barlow | `text-[13px]` | `leading-[1.7]` | `tracking-[0.18em]` | `uppercase`, text opacity 50% |
| Section Label | Barlow | `text-[10px]` | default | `tracking-[0.28em]` | `uppercase`, text opacity 40% |
| Nav Link | Barlow / inherit | `text-[2.5rem] md:text-5xl`| `leading-[1.15]` | `tracking-[0.96px]` | `uppercase`, GSAP animated |
| System Link | Barlow / inherit | `text-[0.81rem]` | default | `tracking-[1.17px]` | `uppercase`, `font-normal` |

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
- **Staggered Sidebar Menu** powered by GSAP
- Fixed toggle button with interactive label swapping ("MENU" to "CLOSE")
- Blur-backdrop pre-layers (`bg-black/50 backdrop-blur-[16px]`)
- Large uppercase navigation links (`text-5xl`, tracking `0.96px`)
- System Links with smaller typography (`text-[0.81rem]`, tracking `1.17px`)
- Smooth scroll integration to internal page sections

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
- Text: Signal White (`#f0f0fa`) / Tailwind config: `text-brand-offwhite`
- Button background: Ghost (`rgba(240, 240, 250, 0.1)`)
- Button border: Ghost Border (`rgba(240, 240, 250, 0.35)`)
- Overlay: `rgba(0, 0, 0, 0.5)` / Tailwind: `bg-black/50`

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