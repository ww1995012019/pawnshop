# Interactive Shop Implementation Plan

> For agentic workers: use subagent-driven-development for the isolated counter task; the coordinator owns assets, shell integration and verification.

**Goal:** A coherent pixel shop whose equipment opens functional in-scene workspaces.
**Architecture:** A permanent home Shell plus one embedded workspace Shell sharing Game. Original pixel scene/portrait art and one UI visual system.
**Tech Stack:** Godot 4.6.3, GDScript, generated source art, Python atlas import, Playwright Web validation.
**Spec:** docs/superpowers/specs/2026-11-08-interactive-shop-design.md

## Global Constraints
- Preserve game rules, item IDs, saves and the established GitHub Pages deployment.
- Main scene equipment opens drawers/panels inside the shop, as explicitly selected by the user.
- No input passes through an open workspace; reduced motion, Escape and keyboard focus work.
- Root implementation and counter worker have disjoint files; workers do not spawn agents or deploy.

## Review Focus
- Closing a workspace retains the visitor, lot and pending quote.
- Nested modals and Escape dismiss only the top layer.
- Embedded world input maps correctly at different window aspects.
- Hover highlights never cover controls or replace meaningful hit areas.
- Shared Game signals do not duplicate trade dispatch or reset saves.

### Task 1: Visual sources (coordinator)
- [x] Generate and inspect original front-facing shop and nine matching portraits.
- [x] Import exact backdrop bounds and crisp atlas art; retain masters.

### Task 2: Persistent workspaces (coordinator)
- [x] Add failing persistence/click-through tests.
- [x] Shell supports workspace_mode, workspace_parent, initial_page; root go(feature) opens one embedded 1600x900 workspace and go(counter) closes it.
- [x] Root content/background/visitor persist; embedded UI has no title/nav/ambient loop.
- [x] Verify inspection, repair, warehouse, orders and report plus Escape and nested modals.

### Task 3: Interactive counter (worker, counter_page.gd only)
- [x] Place functional scene targets using the approved backdrop coordinates supplied in the brief.
- [x] Preserve transaction semantics and physical item behavior.
- [x] Expose fixture_buttons dictionary for real-pointer tests; all fixtures have hover/focus hints.
- [x] Guard underlying input with shell.workspace_open(). Review before integration.

### Task 4: Unified UI and residents (coordinator)
- [x] Consistent compact pixel frames, readable Chinese labels, button states and close affordances.
- [x] Render matching resident portraits behind the customer window at a controlled size.
- [x] Verify each page and modal on real screenshots.

### Task 5: Review, export, publish (coordinator)
- [x] Run real-input, workspace, item art, quote and order checks; inspect browser output.
- [x] Review diff and concurrent remote changes, commit source, export versioned PCK.
- [x] Publish to existing gh-pages branch and confirm deployment success.
