# AGENTS.md — MILEMARK

> Project operating standard for AI coding agents. Read this file completely before inspecting, changing, or generating project code.

## 1. Mission and definition of success

Build **MILEMARK**, a premium, beginner-friendly Danish website that helps young adults move from curiosity about road cycling to feeling prepared for their first manageable ride.

The website must feel polished, confident, calm, outdoors-oriented, and editorial. It must also be genuinely usable, accessible, responsive, maintainable, and deployable as a static site.

**Success is not measured by animation count or code volume.** Success means a novice can understand where to begin, find essential equipment guidance, prepare safely, and take a realistic first step without being overwhelmed.

### Audience and product promise
- Primary audience: Danish young adults, approximately 18–30, curious about road cycling but inexperienced.
- Secondary audience: physically active beginners who need cycling-specific knowledge.
- Main barriers: information overload, equipment uncertainty, perceived expense, safety concerns, and uncertainty about the first ride.
- Promise: **“Din første tur starter her.”**
- Brand name: **MILEMARK**. Preserve the approved logo/wordmark as supplied in Figma/assets; do not invent a replacement.
- All public-facing copy must be in natural Danish.

## 2. Scope and non-negotiable constraints

Implement **exactly four primary pages**:
1. **Forside** — introduction, motivation, clear entry point.
2. **Kom i gang** — an approachable four-step progression.
3. **Cykel & udstyr** — bike selection, essential equipment, and practical beginner advice.
4. **Din første tur** — preparation checklist, first-ride guidance, and realistic route-planning advice.

Each page must work on desktop and mobile. The Figma project includes eight key frames: one desktop and one mobile design for each page.

### Technical constraints
- Use **semantic HTML5, modern CSS, and vanilla JavaScript only where needed**.
- **No frameworks**, CSS frameworks, frontend component libraries, or unnecessary dependencies.
- **No backend** or fake server integrations.
- The deliverable must run as a **static website**, suitable for deployment to Simply.com.
- Prefer local assets. Do not depend on a development server for production navigation or rendering.
- No unapproved tracking, analytics, cookies, or external API dependencies.
- Avoid inline styles, sprawling scripts, duplicated CSS, and unexplained magic numbers.
- Do not add new primary pages without explicit approval.

## 3. Instruction precedence and working method

When requirements conflict, follow this order:
1. Explicit instructions from the user in the current task.
2. Assignment requirements and the technical constraints in this file.
3. Approved Figma designs and design system.
4. Established repository conventions and existing working code.
5. Agent judgment for gaps not covered above.

**Before coding:**
1. Inspect repository structure, existing files, assets, README, and any skills or instructions provided.
2. Check available Figma MCP tools and inspect the exact user-supplied Figma file/node links. Do not claim Figma access if MCP is unavailable.
3. Identify the four desktop/mobile frame pairs and the reusable patterns across them.
4. Create a short implementation plan and a page/component inventory.
5. Surface critical ambiguities rather than silently inventing major functionality.

**While coding:**
- Implement in small, reviewable stages.
- Preserve working functionality; avoid unnecessary rewrites.
- Check desktop and mobile after each significant layout change.
- Use concise, meaningful commit messages if Git commits are requested or authorized.
- Keep a brief record of important implementation decisions, Figma deviations, and fixes for the school report.

**After coding:**
- Run available checks and inspect the actual output.
- Report what was implemented, what was tested, what could not be tested, and any remaining limitations.
- Never claim a page, feature, link, or deployment was tested when it was not.

## 4. Figma-to-code fidelity contract

Figma is the **primary visual specification**, not a pixel-perfect excuse for broken responsiveness.

### Preserve
- MILEMARK branding and wordmark.
- Layout hierarchy and content order.
- Overall proportions, section rhythm, spacing, and imagery.
- Typography, colors, borders, corner radii, and card language.
- Desktop/mobile intent and prominent calls to action.

### Improve deliberately when needed
- Legibility of text that is too small in mobile mockups.
- Crowded hero text and insufficient image contrast.
- Overly narrow cards or cramped multi-column layouts.
- Touch targets, navigation, focus indicators, and semantic structure.
- Missing icons, checkmarks, and functional states.
- Unclear or misleading interaction patterns.

Do **not** arbitrarily redesign the site. When a material deviation from Figma is necessary, preserve the brand language and document the reason.

### MCP workflow
- Read frame metadata, layout properties, styles, and available assets from Figma MCP.
- Inspect both desktop and mobile references before implementing a page.
- Use exported/approved assets when possible; preserve aspect ratios and appropriate cropping.
- Do not use screenshot-of-whole-page images as a substitute for real HTML/CSS.
- Do not treat generated sample content in mockups as verified facts.
- If MCP cannot provide a needed asset or detail, state the gap and choose a maintainable fallback only where reasonable.

## 5. Visual design system

The Figma Style Tile is authoritative for final values. Use the following **starting tokens** unless Figma specifies otherwise:

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

- Heading family: **Manrope** (bold/extrabold).
- Body and UI family: **DM Sans** (regular/medium).
- Use local font files if legitimately available, otherwise an approved web-font source or robust system fallback. Never assume a font is bundled.
- Strong editorial headlines, spacious composition, earthy color palette, high-quality outdoor/cycling imagery.
- Buttons: clear primary dark-green style, quieter outlined secondary style, subtle hover/active/focus states.
- Cards: consistent radii, crop behavior, readable overlays, purposeful whitespace.
- Icons: visually consistent weight and scale. Prefer accessible inline SVGs or CSS shapes when no approved icon asset exists; do not introduce an icon library just for convenience.
- Avoid neon colors, gratuitous gradients, glassmorphism, heavy shadows, excessive blur, and noisy decoration.

### Design tokens
Create a centralized token layer for colors, typography, spacing, radii, shadows, breakpoints, and transitions. Reuse tokens rather than hardcoding divergent values in each page.

## 6. Responsive implementation

Treat mobile as a first-class experience, not a compressed desktop screenshot.

- Match the provided mobile designs around **402px** and desktop designs around **1440px**.
- Also support intermediate widths and small phones without horizontal scrolling.
- Use fluid layouts with `min()`, `max()`, `clamp()`, CSS Grid, and Flexbox where appropriate.
- Prefer content-driven breakpoints; do not use arbitrary device-specific hacks.
- Convert desktop card rows into comfortable mobile stacks or grids based on available space.
- Hero imagery must keep the subject visible while leaving sufficient contrast behind text.
- Use `srcset`/`sizes` where appropriate and feasible; avoid downloading oversized imagery unnecessarily.
- Minimum practical interactive target: about **44 × 44 CSS pixels**.
- Do not allow fixed heights to clip copy when fonts wrap or text size changes.
- Respect safe areas and account for mobile browser viewport behavior when relevant.

## 7. Page-by-page functional expectations

### Forside
- Clear hero with value proposition and primary CTA to **Kom i gang**.
- Functional navigation to all four pages.
- Beginner benefit highlights and links to relevant guides.
- Closing motivational section with a meaningful CTA.

### Kom i gang
- Four clearly numbered steps, following the approved design.
- Each step must lead to meaningful content on the existing pages or an appropriate anchored section.
- No dead-end cards or decorative links that appear clickable.

### Cykel & udstyr
- Explain beginner-friendly bike choice, necessary gear, and basic purchase/maintenance considerations.
- Prioritize essential equipment over expensive upgrades.
- Make links and cards functional; avoid fake product listings or unsupported price claims.
- Do not invent endorsements, testing results, or commercial affiliations.

### Din første tur
- Implement a real, keyboard-accessible preparation checklist.
- Checkboxes must toggle visibly and expose their state semantically.
- Optional persistence may use localStorage, but the checklist must remain usable if storage is unavailable; do not claim cloud syncing.
- Offer beginner-appropriate route-planning guidance, not an unsupported promise that specific pictured routes exist.
- Any route card must either link to a real verified resource, provide genuine explanatory content, or be clearly marked as illustrative. Never fabricate precise distances, elevation gains, times, or maps.
- Encourage gradual effort, awareness of traffic rules, and appropriate safety preparation.

## 8. Interaction and motion standards

Add **subtle, purposeful polish**:
- Buttons: modest color/contrast change and possibly a restrained arrow movement.
- Cards: small visual response such as a controlled image scale or lift, never disruptive reflow.
- Navigation: clear active page state and responsive menu.
- Mobile menu: operable by keyboard and touch; proper `aria-expanded`, clear open/close labels, Escape-to-close where practical, and predictable focus behavior.
- Checklist: clear checked/unchecked states and optional progress feedback.
- Scroll reveals: optional, never essential to viewing content.

Use consistent transition timing (typically ~150–300 ms). Respect `prefers-reduced-motion: reduce`. Do not autoplay audio, invent videos, or display video controls without actual playable media. If Figma depicts an unavailable intro video, replace that control with an honest functional alternative or omit it, noting the decision.

## 9. Navigation and information architecture

- Use real working relative links between static pages.
- The logo links to Forside.
- Show the current page in navigation visually and with `aria-current="page"`.
- Provide clear CTA labels describing the destination or action.
- Avoid linking all cards to the same generic destination when a more relevant anchor or page exists.
- No `href="#"`, dead buttons, fake search boxes, or nonfunctional controls in the final release.
- If a feature is outside scope (for example, search, video hosting, interactive route maps), omit it or explicitly request approval rather than faking it.

## 10. Content and editorial integrity

- Write approachable, direct, encouraging Danish with no elitist cycling jargon.
- Explain technical terms briefly when first used.
- Keep headings concise and scannable; avoid filler copy.
- Use credible, non-alarmist beginner guidance.
- Never invent citations, interviews, measured user data, prices, route statistics, testimonials, or certifications.
- Do not frame design hypotheses as validated research findings.
- Ensure the copy follows the beginner journey: **interest → understanding → equipment → preparation → first ride**.
- Prefer concrete advice to marketing exaggeration.

## 11. Accessibility and semantics

Target WCAG 2.2 AA principles as far as feasible for this static project.

- Use proper landmarks: `header`, `nav`, `main`, `section`, `footer`.
- Exactly one meaningful `h1` per page; maintain logical heading hierarchy.
- All interactive elements must be real links, buttons, or form controls.
- Visible keyboard focus; no keyboard traps.
- Meaningful alt text for informative images; empty alt for purely decorative images.
- Check text and interactive contrast; do not rely on color alone to communicate state.
- Label form controls explicitly.
- Provide accessible names for icon-only buttons.
- Avoid unnecessary ARIA when native HTML is sufficient.
- Test keyboard navigation and at least basic screen-reader semantics where tooling permits.

## 12. Performance and robustness

- Optimize image dimensions and formats (WebP/AVIF when appropriate), keeping quality high.
- Lazy-load below-the-fold imagery; do not lazy-load the primary LCP hero image.
- Prevent cumulative layout shift with image dimensions or aspect-ratio containers.
- Keep JavaScript small and deferred; use CSS for simple visual transitions.
- Avoid blocking requests and unused dependencies.
- Handle missing assets and unavailable optional browser APIs gracefully.
- Avoid console errors and broken resource requests.
- Keep the site functional without JavaScript wherever reasonable; progressive enhancement is preferred.

## 13. Code quality and project structure

Prefer a simple, explicit structure such as:

```text
/
├── index.html
├── kom-i-gang.html
├── cykel-og-udstyr.html
├── din-forste-tur.html
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/              # only if legitimately available
├── css/
│   ├── tokens.css
│   └── styles.css
├── js/
│   └── main.js
├── AGENTS.md
└── README.md
```

Adapt to an existing repository rather than blindly replacing it.

- Consistent naming, formatting, and indentation.
- Use semantic, reusable CSS classes; avoid page-specific duplication where shared patterns exist.
- Prefer CSS custom properties for design tokens.
- Keep JavaScript modular, event-driven, and easy to understand.
- Comment non-obvious reasoning, not every trivial line.
- Avoid dead code, unused styles, redundant assets, and accidental global event listeners.
- Never delete or overwrite user-authored files without clear necessity.
- Keep build/deployment steps simple and documented.

## 14. Quality assurance: required checks

Before calling implementation complete, check:

### Visual
- [ ] All four pages resemble their desktop Figma references.
- [ ] All four pages resemble their mobile Figma references, with documented UX corrections.
- [ ] Layout works at approximately 320, 375, 402, 768, 1024, and 1440px.
- [ ] No horizontal overflow, clipped text, or unreadable overlays.
- [ ] Typography, colors, spacing, and card treatment are consistent.

### Functional
- [ ] All navigation links and CTAs have meaningful destinations.
- [ ] Mobile menu opens, closes, and works with keyboard.
- [ ] Checklist toggles and communicates state correctly.
- [ ] No dead links, placeholder anchors, fake search/video controls, or broken images.
- [ ] Page reloads and direct URL navigation work on a static host.

### Accessibility and technical
- [ ] Headings, landmarks, alt text, labels, and focus states are sensible.
- [ ] Reduced-motion preference is respected.
- [ ] No significant console errors or missing assets.
- [ ] Images are appropriately optimized.
- [ ] Any available automated HTML/CSS/JS checks pass, or failures are reported.

**Do not fabricate QA results.** If browser preview, screenshots, or automated testing tools are unavailable, explicitly say what remains unverified and give a concrete manual test plan.

## 15. Git, deployment, and documentation

- Use Git with meaningful, focused commits when permitted.
- Do not commit credentials, private tokens, secrets, or large unnecessary source files.
- Keep the site deployable via static file upload to Simply.com; use relative asset paths that survive hosting in the intended directory.
- Include a concise README with project purpose, four pages, local preview instructions, structure, and deployment notes.
- Maintain a brief decision log in the README or a separate notes file covering:
  - Figma-to-code decisions and justified deviations.
  - Three particularly useful AI prompts and what they changed.
  - AGENTS.md, skills, Figma MCP, and tools actually used.
  - Bugs discovered, iterations, and how they were resolved.
  - A suitable HTML snippet and CSS snippet that the student can explain line by line.
- This log supports the school report; **do not write fictional research or fictional test outcomes**.

## 16. Agent communication protocol

For substantial tasks, respond with:
1. **Understanding:** one short summary of the requested change.
2. **Plan:** concrete files/pages to inspect and edit.
3. **Execution:** implement the change; do not stop at a proposal when implementation is possible.
4. **Verification:** state what actually ran and what was observed.
5. **Summary:** changed files, key decisions, remaining issues, and next sensible step.

Ask questions only for genuinely blocking information, such as missing Figma access or an unspecified destination for a critical action. Otherwise make conservative decisions aligned with this file and proceed.

## 17. Anti-patterns — explicitly prohibited

- Screenshot-based websites instead of semantic HTML.
- Generic AI-looking templates that disregard MILEMARK’s approved design.
- Frameworks or large dependencies added without authorization.
- Decorative controls that do nothing.
- Invented videos, route data, product tests, or research findings.
- Aggressive animation, excessive parallax, and flashy transitions.
- Desktop-only implementation or mobile layouts that merely shrink everything.
- Inaccessible icon-only buttons and unlabelled inputs.
- Claiming a feature is finished without checking it.
- Arbitrary redesigns unrelated to a documented usability issue.
- Replacing existing project work without inspecting it.

---

**North star:** Make MILEMARK feel like a real, refined cycling publication and a genuinely useful first-ride companion. The code should be as considered as the visual design.
