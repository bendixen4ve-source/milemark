---
name: milemark-figma-to-code
description: Convert the approved MILEMARK Figma desktop and mobile designs into a faithful, accessible, responsive, static four-page Danish website using Figma MCP, semantic HTML, CSS, and minimal vanilla JavaScript. Use when analyzing Figma frames, extracting assets and tokens, implementing or refining pages, or auditing visual fidelity and functionality.
---

# MILEMARK — Figma-to-Code Implementation Skill

> **Purpose:** Transform MILEMARK's approved Figma design into a refined, genuinely usable production-ready static site. This skill defines the execution procedure; `AGENTS.md` remains the project-wide authority. **Read `AGENTS.md` first.**

## 0. Activation and boundaries

Activate this skill for: Figma inspection, asset extraction, layout mapping, desktop/mobile implementation, design-to-code review, responsive repair, interaction implementation, and visual QA.

Do not activate for unrelated requests. Do not override explicit user instructions, the school assignment, or `AGENTS.md`. Never invent missing Figma values, assets, browser test results, or functioning third-party integrations. If MCP access is unavailable, say so and ask for Figma node links or exported assets/screenshots as appropriate; distinguish screenshot estimates from inspected node properties.

**Output target:** Four real HTML pages (`index.html`, `kom-i-gang.html`, `cykel-og-udstyr.html`, `din-forste-tur.html`) with a shared responsive design system and lightweight JavaScript only where meaningful. No frameworks, backend, or invented functionality.

## 1. Mandatory intake and discovery

1. Read `AGENTS.md`, repository structure, current code, assets, and any existing documentation.
2. Identify Figma MCP tools actually available; verify access before claiming to inspect a file.
3. Obtain the exact Figma file and relevant frame/node links from the user or existing repository context. Do not guess node IDs.
4. Identify all **eight** target frames: Forside, Kom i gang, Cykel & udstyr, Din første tur — desktop and mobile for each.
5. Inspect the presentation moodboard and Style Tile if accessible; these establish brand direction and tokens.
6. Before coding, produce a concise implementation map: routes, sections, reusable components, assets, interactions, uncertainties, and order of work.
7. If any critical frame is inaccessible, clearly identify which one and what substitute information is available. Do not silently pretend all eight were inspected.

### Figma inspection order (for each page)

- **First:** Desktop and mobile screenshots to understand composition, hierarchy, imagery, and overall rhythm.
- **Second:** Node hierarchy and dimensions: frame size, groups, auto-layout, constraints, padding, gaps, alignment, and layering.
- **Third:** Typography: family, weight, size, line-height, letter spacing, capitalization, alignment.
- **Fourth:** Appearance: fills, gradients if present, strokes, corner radius, shadows, image crop/position, overlays.
- **Fifth:** Assets and semantics: logo, hero image, guide imagery, icons, copy, navigation labels, and CTAs.
- **Sixth:** Compare desktop and mobile and infer responsive transformations; do not merely scale coordinates.

Use the exact MCP tool signatures exposed in the environment. Never invent MCP commands or fabricate extraction results.

## 2. Create an evidence-based design inventory

Record a compact design specification, preferably in `docs/figma-implementation-notes.md` if this fits the repository:

| Field | Record |
|---|---|
| Page + frame | Exact name and Figma node link/ID |
| Viewport | Actual frame width and height |
| Sections | Top-to-bottom ordering |
| Containers | Width, margins, padding, grid, gaps |
| Typography | Styles and measured sizes |
| Colors | Actual fills/HEX and semantic roles |
| Assets | Figma source and exported filename |
| Interactions | Intended destination/action and status |
| Mobile differences | Stack order, spacing, type scaling, visibility |
| Deviations | Reason for any implementation change |

Distinguish **measured from Figma**, **inferred from visual evidence**, and **proposed by agent**. Do not mislabel inference as a measured property. Keep the inventory useful, not bureaucratic.

## 3. Brand contract and visual fidelity

MILEMARK is a calm, premium, outdoors-oriented beginner cycling guide. Preserve the actual approved wordmark; **do not generate a replacement logo**. Preserve Danish copy when it is sensible; fix obvious typos without altering intent.

Style Tile fallback tokens, subordinate to actual Figma values:

```css
:root {
  --color-background: #F5F2EA;
  --color-primary: #344B3F;
  --color-ink: #252A27;
  --color-accent: #D9A36C;
  --color-sage: #D9E0D3;
  --color-white: #FFFFFF;
}
```

Headlines: Manrope Bold/ExtraBold. UI/body: DM Sans Regular/Medium. If these fonts are not available, use legitimate approved loading or system fallbacks, and report substitutions. Centralize spacing, radii, container widths, shadows, breakpoints, and motion in CSS tokens. Prefer real design assets; never substitute unrelated generic photography if approved images are available.

**Fidelity hierarchy:** (1) brand and visual identity, (2) content structure, (3) imagery and cropping, (4) spacing and typography, (5) polish and interaction. No arbitrary redesign. Make intentional UX corrections to cramped mobile cards, illegible text, weak hero contrast, and missing focus/touch states, and log them.

## 4. Asset pipeline

1. Inventory assets before implementation. Check whether the repo already contains originals.
2. Export from Figma via available MCP capabilities, or use user-provided files. Preserve descriptive filenames (`hero-forside.webp`, `milemark-logo.svg`) where applicable.
3. Use SVG for actual vector logos/icons where legitimately available; do not redraw a distinctive approved logo from memory.
4. For photographs, optimize to appropriate formats and dimensions without degrading visual quality; preserve focal point using `object-fit`/`object-position`.
5. Provide intrinsic `width`/`height` or `aspect-ratio` to prevent layout shift. Do not lazy-load the primary hero/LCP image; lazy-load below-the-fold imagery.
6. Give informative images meaningful Danish alt text; decorative images `alt=""`.
7. Never hotlink an unstable temporary MCP image URL as a permanent production asset.
8. Never claim an asset was exported or optimized unless it actually was.

## 5. Page implementation sequence

Implement shared foundation first: `tokens.css`, shared styles, header, navigation, footer if present, buttons, guide cards, icons, responsive containers, and script entry point.

Then implement pages in this order, validating each at desktop **and** mobile before advancing:

### A. Forside
- Preserve logo, navigation, hero photography, “Din første tur starter her.”, introduction, and prominent “Kom i gang” CTA.
- Reproduce the beginner-benefits strip and three guide cards with relevant destinations.
- Keep closing motivational block readable and purposeful.
- Avoid false video controls: if there is no playable intro video, replace with a real useful link or omit and record the deviation.

### B. Kom i gang
- Hero: progression from curiosity to first ride.
- Four steps, visibly numbered and ordered.
- Each step should link to the relevant existing page or anchor with real guidance.
- Maintain the beginner-advice panel, without unsupported claims.

### C. Cykel & udstyr
- Hero and guide cards about selecting a bike, necessary gear, and practical purchase/maintenance advice.
- Prioritize safety, fit, comfort, and essential equipment over expensive accessories.
- Do not invent product reviews, prices, affiliate links, or professional endorsements.

### D. Din første tur
- Hero, checklist, first-ride planning guidance, and route examples.
- Use real semantic checkboxes with visible states and keyboard operation.
- If route cards in Figma include specific distances/elevation/times that have not been verified, mark them as illustrative or replace with general route-planning guidance; never present fabricated route data as factual.
- Provide an honest next action that the visitor can actually perform.

## 6. Responsive translation procedure

**Target comparison widths:** desktop around 1440px and mobile around 402px. Also inspect 320, 375, 768, and 1024px and any content-driven intermediate widths.

For every section:
1. Identify what is preserved (hierarchy, image, action, tone).
2. Identify what transforms (columns, order, type size, image crop, gaps, controls).
3. Implement fluid containers using CSS Grid/Flexbox, `clamp()`, `min()`, and `max()` where useful.
4. Reflow desktop multi-column guide cards into legible mobile stacks or grids; avoid tiny desktop cards scaled down.
5. Adjust hero image positioning to protect subject and text contrast; use an overlay where justified.
6. Prevent horizontal scrolling, clipped text, overlapping navigation, and inaccessible touch targets.
7. Keep headings naturally wrapping; avoid brittle manual `<br>` layout fixes unless deliberate and responsive.
8. Recheck at 200% zoom or equivalent where feasible.

Never use the entire Figma frame as a raster background, hardcoded absolute positioning for page layout, or separate duplicated desktop/mobile DOM trees unless unavoidable and justified.

## 7. Functional interaction specification

Every visually interactive element must have a real purpose.

**Navigation:** Logo → home; all four page links resolve; current page marked with `aria-current="page"`. Mobile menu toggles using a real button with an accessible name and `aria-expanded`; support touch and keyboard, Escape close where practical, and sensible focus handling.

**CTAs/cards:** Use `<a>` for navigation and `<button>` for actions. Link to actual pages or anchored sections. No `href="#"`, inert buttons, fake search field, or invented video player.

**Checklist:** Native checkbox inputs associated with labels; click and keyboard toggles; visual checked state; optional lightweight progress count. `localStorage` persistence is optional and must fail gracefully. Do not imply accounts or syncing.

**Hover/motion:** Subtle 150–300ms transitions, restrained image scale, arrow movement, and active/hover/focus states. Respect `prefers-reduced-motion: reduce`; no essential content hidden behind scroll reveal; avoid scroll-jacking, autoplay, and excessive parallax.

**Missing icons:** Replace with consistent inline SVG or approved Figma icons. Never use icon-font dependency just to solve a handful of icons. SVG icon buttons need accessible names.

## 8. Engineering standards

- Semantic HTML5: one `h1` per page, coherent heading order, `header`, `nav`, `main`, `section`, `footer` as appropriate.
- Shared CSS classes and tokens, not copied styling for each page.
- Vanilla JS only for genuine interactions; initialize after DOM is ready, use defensive element checks, avoid duplicate listeners and global pollution.
- Relative paths compatible with direct static hosting on Simply.com. Direct navigation to each `.html` file must work.
- Avoid unnecessary dependencies, bundlers, API keys, and server requirements.
- Accessible visible focus, meaningful labels, reasonable contrast, and ~44px interactive touch targets.
- Prioritize readable Danish copy and credible beginner guidance.
- No unverified claims, fictional interviews, fabricated test metrics, or fake routes.

### Suggested file architecture

```text
index.html
kom-i-gang.html
cykel-og-udstyr.html
din-forste-tur.html
assets/images/
assets/icons/
assets/fonts/       # only when legitimately available
css/tokens.css
css/styles.css
js/main.js
AGENTS.md
README.md
docs/figma-implementation-notes.md  # optional
```

Adapt to existing repository conventions instead of replacing existing work.

## 9. Iteration and visual QA loop

For each page, follow **inspect → implement → render → compare → fix → verify**.

1. Render or preview the actual coded page if browser/screenshot tools are available.
2. Compare coded desktop/mobile output with the corresponding Figma frames.
3. Check section order, content, image choice/crop, widths, typography, padding, card sizing, and interaction states.
4. Prioritize fixes: **broken function → mobile readability/overflow → structural mismatch → visual polish → optional animation**.
5. Repeat until major mismatches are addressed or time constraints require a documented stopping point.
6. Validate cross-page consistency after shared CSS changes.

**Never say “pixel perfect” or “tested” without real comparison/testing evidence.** If preview tooling is unavailable, report what was checked statically and give concrete manual checks.

### Minimum QA matrix

- 4 pages × 2 reference sizes = 8 primary visual comparisons.
- Additional widths: 320, 375, 768, 1024 (as practical).
- All navigation and card links; no 404s.
- Mobile menu: open, close, Escape, keyboard focus.
- Checklist: mouse/touch, Space key, visible state, refresh behavior if persistence enabled.
- No horizontal overflow, broken images, illegible overlays, console errors, or missing assets.
- Reduced-motion behavior and visible focus indicators.
- Direct static `.html` URLs and relative assets work without a SPA router.

## 10. Reporting, traceability, and handoff

Keep a brief implementation log containing:
- Which Figma frames and assets were actually inspected.
- Important design decisions and mobile deviations, with reasons.
- Three significant AI prompts and what changed (for school documentation).
- Real tools used (MCP, skill, Codex) and genuine challenges/fixes.
- Two explainable code excerpts: one semantic HTML pattern and one CSS layout/responsive pattern.
- Checks actually performed, outcomes, and unresolved items.

Make Git commits only if permitted, with meaningful names. Do not upload to GitHub or deploy to Simply.com without the required access and authorization. Do not claim a deployment succeeded until the live site was checked.

### Completion response format

1. **Implemented:** pages/components and user-visible behavior.
2. **Design fidelity:** what matched Figma and what was intentionally improved.
3. **Verification:** exact checks performed and results.
4. **Limitations:** missing assets, unverified routes, or untested interactions.
5. **Next step:** the single most valuable remaining action.

## 11. Stop conditions and escalation

Stop and ask a targeted question only when a genuinely critical dependency is missing: inaccessible required Figma frames, unavailable logo/assets that cannot be faithfully reconstructed, contradictory instructions, or a request for irreversible action. Otherwise make conservative, reversible choices and proceed.

Never bypass user approval for destructive file changes, account actions, or production deployment. Never fake external data, capabilities, or tests.

---

**Definition of done:** A first-time cyclist can move through four beautiful, readable Danish pages, understand the essentials, interact with working controls, and confidently prepare for a manageable first ride. The implementation is faithful to MILEMARK, responsive, accessible, maintainable, and honest about what it can and cannot do.
