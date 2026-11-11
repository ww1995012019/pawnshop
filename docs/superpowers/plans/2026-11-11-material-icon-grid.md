# Material Icon Grid Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace long material rows with selectable icon cards and one quantity/buy/sell area.

**Architecture:** A MerchantMaterials VBoxContainer owns selection and layout; counter_page forwards its transaction signal into the existing dispatch/refresh flow. State stays in the existing model, while selection and quantity survive modal refresh through contents metadata.

**Tech Stack:** Godot 4.6.3, GDScript, generated transparent PNG atlas.

**Spec:** docs/superpowers/specs/2026-11-11-material-icon-grid-design.md

## Global Constraints

- Preserve all 13 current materials and the existing rare-goods and owned-watch actions.
- Maximum five equally sized columns, reflow on smaller viewports.
- Use existing reducer, UI skins, and material prices; no AP charge for materials.
- Local branch only; no deployment.

## Review Focus

- Changing selection must not transact or reset quantity unexpectedly.
- Repeated purchases retain selection and keyboard focus while stock updates.
- Zero inventory, insufficient cash, storage/cash limits disable invalid actions.
- Phone and resized modal content fit horizontally and remain scrollable.
- A departed merchant cannot accept stale actions.

### Task 1: Selectable material grid and real transactions

**Files:** Create godot/scripts/ui/merchant_materials.gd and godot/assets/ui/materials.png; modify godot/scripts/pages/counter_page.gd; add godot/tests/merchant_materials_ui_test.gd to scripts/test-godot-native.py.

**Interfaces:** MerchantMaterials.setup(state, selected_id, quantity); signals selection_changed(id, quantity) and transaction_requested(action); focus_targets maps merchant focus keys to buttons.

- [x] Add an integration test that opens the actual merchant modal, selects another material without spending cash, purchases two ceramic patches for 20 Cr, retains selection/focus, and sells them for 10 Cr with no AP spent.
- [x] Cover missing stock, insufficient owned materials/cash and departed merchant. Check all 13 cards fit modal width at desktop and phone sizes.
- [x] Observe the test fail against the current material rows.
- [x] Implement the grid, pixel icons, quantity controls, and transaction integration.
- [x] Run the focused native tests and existing commerce UI/phone tests.

### Task 2: Build and visual verification

- [x] Build the Godot web package, run the native suite and packaging checks.
- [x] Exercise merchant selection and batch transactions in Chromium at desktop and phone sizes; save screenshots.
- [x] Review the diff for scope and state/focus regressions, record verification and any limitations.


## Verification

- `npm test`: passed; 69/69 native groups, seven packaging checks, font and loading checks passed.
- Final card-width adjustment: material-grid UI, existing commerce UI and phone bridge regressions passed; packaging checks rerun and passed.
- `python3 scripts/build-godot-web.py`: passed with Godot 4.6.3.
- Chromium: desktop 1440×900, landscape phone 844×390, and portrait 390×844 material selection and two-unit purchase passed, including total price and retained quantity. Portrait merchant fixture is established on desktop before changing viewport and opening the modal.
- Review: independent reviewer found that quantities above 99 were incompatible with Commerce; fixed and verified RED → GREEN. Visibility and two-column portrait checks also verified RED → GREEN.
- `git diff --check`: passed. Changes remain local and uncommitted on `codex/material-icon-grid`.
