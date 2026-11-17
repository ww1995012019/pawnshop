# Landscape Input and Shared UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Deliver the approved landscape-only mobile flow, accurate top navigation, centered icon-only closes and readable dropdowns.

**Architecture:** Keep the existing Godot interfaces and Web bridge. The Web shell supplies a landscape canvas and transforms physical touch coordinates; the game uses the corresponding landscape layout. Replace baked utility artwork with controls sharing their visible and input geometry, and centralize close/menu styling in UIKit.

**Tech Stack:** Godot 4.6.3, GDScript, browser JavaScript/CSS, Python/Playwright.

**Spec:** `docs/superpowers/specs/2026-11-17-landscape-input-ui-design.md`

## Global Constraints

- Keep game rules, saved state and existing navigation/close behavior intact.
- Top utility and close touch targets must be at least 44×44 CSS px.
- Mobile always uses landscape; unsupported orientation lock uses a rotated canvas.
- Only window close buttons lose their visible text; content folding and business actions retain semantics.
- Agents own disjoint files, do not commit or change another task's files; the controller integrates shell close calls after Task 1 releases shell.gd.

## Review Focus

- Physical upright touch must map correctly through canvas rotation and DPR, including nested workspaces and dragging.
- Opening fullscreen during a touch must not change its release into a second action or change its target.
- Utility hit areas must remain aligned across different aspect ratios, with inactive gaps even under touch assist.
- Close nested windows once, restore focus and preserve selected goods and unfinished-work safeguards.
- Popup menus must remain readable while actually expanded, and retain disabled behavior and scroll-to-last-item access.

---

### Task 1: Mobile landscape canvas and coordinates

**Files:** `godot/web/web-ui.js`, `godot/web/web-ui.css`, orientation-related sections of `godot/scripts/app/shell.gd`, `scripts/test-godot-phone.py`, `scripts/test-portrait-web.py`, targeted native tests.

**Interfaces:** Keep OrbitalTouch.phone(), turned(), safeInsets and bridge commands. Supply effective landscape canvas dimensions; portrait_mode() must not select a mobile portrait flow. shell.gd belongs only to this task until handoff.

- [x] Add/adjust a behavioral regression for upright phone landscape rendering and physical touch mapping; confirm failure on the current behavior.
- [x] Implement landscape canvas rotation and safe inset mapping; request orientation lock when allowed. Preserve consistent pointer coordinates and state across resizing/fullscreen.
- [x] Update game orientation detection and landscape logical sizing to use effective canvas dimensions; retain existing desktop behavior and temporary layout deferral during active gestures.
- [x] Update obsolete native-portrait expectations and run targeted orientation/native checks. Report any remaining legacy assertions to the controller.

### Task 2: Accurate utility navigation

**Files:** `godot/scripts/ui/strict_counter_view.gd`, `godot/scripts/ui/reference_atlas.gd`, `godot/scripts/app/touch_assist.gd`, targeted native tests.

**Interfaces:** Keep desk._utility_clicked(key, null), existing busy/modal guards and utility semantics. Touch assist must support explicit no-expansion controls without altering other controls.

- [x] Add a regression for disjoint utility rectangles and aligned visible geometry at narrow/base/wide aspect ratios; confirm it fails first.
- [x] Clear the baked utility strip and create four real visible buttons with one icon each and matching actual bounds. Keep the scene artwork and other HUD values.
- [x] Keep utility targets at least 44 CSS px and stable inactive gaps, including under touch assist. Verify sound on/off and blockers.
- [x] Run targeted native geometry/input tests and report CSS sizing assumptions for browser verification.

### Task 3: Shared closes and readable dropdowns

**Files:** `godot/scripts/app/ui_kit.gd`, `godot/scripts/ui/floating_document.gd`, `godot/scripts/pages/warehouse_page.gd`, targeted native tests. Controller applies the three close creation changes and title hint in shell.gd after Task 1.

**Interfaces:** Provide `UIKit.close_button(min_size := Vector2(44,44)) -> Button` with centered close icon, empty visible text and tooltip/accessibility name. Preserve existing call-site signals. Configure OptionButton and its actual PopupMenu for all theme states.

- [x] Add a failing regression for close centering/minimum size and expanded menu theme/state readability.
- [x] Implement a dedicated close factory and migrate FloatingDocument and independent warehouse close, without changing text+icon business buttons.
- [x] Define complete OptionButton/PopupMenu colors and selected/radio markers with visible disabled distinction and bounded menu dimensions.
- [x] Run targeted native tests. Report the exact shell.gd migration instructions and avoid editing it concurrently.

### Task 4: Integration, rendered checks and review

**Files:** `godot/scripts/app/shell.gd`, `scripts/test-godot-native.py`, `scripts/test-landscape-ui-web.py`, related obsolete test expectations, this plan.

**Interfaces:** Integrate Tasks 1–3, preserving all existing bridge locators; register new regression tests in the standard runner.

- [x] Migrate workspace/modal close calls and Esc hint to the shared factory after Task 1. Check pending-close logic cannot restore visible close text.
- [x] Build the web pack and serve locally. Verify desktop, landscape phone and upright phone physical touch, top-button edges/gaps, all five workspaces, nested closes, expanded dropdown first/last items, sound and modal blocking. Save representative screenshots.
- [x] Run the native/packaging standard checks and relevant browser tests; fix regressions and update superseded portrait/close-label assertions with behavioral equivalents.
- [x] Request an independent final code/spec review, address actionable findings, verify the final diff and report tested coverage and remaining limitations.

## Verification results

- Native regressions:144/144groups verified. The parallel run passed143groups; bell_test was rechecked after replacing phase-dependent timer sampling with actual Tween peak sampling and a realistic desktop fixture.
- Browser input/screenshot cases passed:1280×720desktop,1720×800wide,844×390touch phone atDPR2,390×844upright phone atDPR2 including open-workspace rotation and preserved original UID.
- Exact utility edges and inactive gaps, single sound toggles/persistence, five workspaces, nested night history closes, readable expanded dropdown and final-row selection passed.
- Source shell tests passedDPR1/2/3physical mapping, resize/release ordering, safe insets and wheel axes. Real upright counter/workspace taps passed.
- Idle counter regression:oldpack24DPRbridge reads/12frames; finalpack0reads.
- Packaging7tests,font1test,loading layout4tests passed. Release manifest hashes and bytes verified for29files.
- Independent code review has no outstanding actionable findings;git diff --check passes.
- Built preview release: `54681e2433fb4c06`; screenshots in `work/landscape-ui/`. Native report:`work/godot-tests-final/result.json`.
