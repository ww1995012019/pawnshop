# Mobile Landscape Implementation Plan

**Goal:** Implement the approved three-column mobile counter and expanded workbench with real existing animations.
**Architecture:** A mobile-only presentation places backgrounds below the real world layer and controls above it. Existing customer/item/controller instances and model reducers remain authoritative; wide workbenches reflow their tool rest and useful drawing area without deforming watch art.
**Tech Stack:** Godot 4.6.3, GDScript, existing mobile raster skins and Web touch bridge.
**Spec:** docs/superpowers/specs/2026-11-11-mobile-landscape-animation-design.md

## Global Constraints
- Main screen never scrolls; controls target 44 CSS px.
- Preserve actual sprites, tools, phases, partial progress and original accounting.
- Keep desktop and portrait compatible; distinguish intentional legacy landscape tests from new mobile presentation checks.
- Close during an animated workbench segment waits for its stable boundary; closing never submits a transaction.

## Review Focus
- Camera/input coordinates and canonical tabletop positions survive resizing.
- Bills, handoffs and receipt remain visible across panel boundaries.
- No duplicate controllers, state mutation or charges from view changes.
- Workbench closing saves progress and releases touch capture.
- Expanded workbench contains live contact targets, tool rest and parts tray.

### Task 1: Native landscape counter
- [x] Add failing mobile landscape test for native sprites and live flip.
- [x] Add CSS-pixel mobile viewport and mobile counter presenter with separate background layer.
- [x] Map tabletop presentation coordinates reversibly, keeping original model positions.
- [x] Anchor visitor, cash, goods and receipts to mobile layout; verify actual animations.

### Task 2: Expanded operation workspaces
- [x] Add failing test for expanded viewport, wide live art and close-at-boundary.
- [x] Fit inspector and workbench controls around the live surface; use separate selection/details views.
- [x] Reflow tool rest and visible working area while keeping canonical animation state and hit mapping.
- [x] Save and close safely; pause background processing without replaying accounting.

### Task 3: Verification and delivery
- [x] Run native suite and mobile browser journeys with real animation enabled.
- [x] Capture screenshots, short video and animation/closure evidence; review diff.
- [ ] Commit reviewed changes and update existing deployment after checks.

## Execution ledger
- Pre-flight: presenter consumes Shell.landscape_mode and original CounterPage; workspaces consume the same mobile viewport. Model rules and identifiers remain unchanged.
- Scope: user approved the design and requested implementation; execute inline without another approval gate.

- Implemented: CSS-pixel landscape counter with original actor/item/cash nodes, live workspaces, reversible coordinates, background pause and stable-boundary close/reflow.
- Review: independent reviewer checked UID routing, scale geometry, navigation guards, slow-close actions, handoff canvas and restoration.
- Verification: full npm/native suite plus current 29 landscape assertions, phone journey, three tools, five refurbishment jobs, mechanical service, four target-forgery jobs and complete receipt recording passed. See docs/verification/2026-11-11-mobile-landscape.md.
