# Warehouse Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Ship five consumable-watch warehouse upgrades and a compact three-module drawer with independent display, material, isolation and pawn storage.

**Architecture:** A focused WarehouseExpansion model owns capacities, eligibility, upgrade settlement, completed-order tracking and legacy migration. Existing Model placement and cabinet actions consume that model; Game dispatch saves expansion transactions before publishing them. Reuse the physical shop art, responsive workspace and modal controls for the drawer, upgrade selector and permanent slot purchase.

**Tech Stack:** Godot 4.6.3, GDScript, JSON-shaped saves, native regressions and Godot Web export.

**Spec:** docs/superpowers/specs/2026-11-12-warehouse-expansion-design.md

## Global Constraints

- Five target widths 20/25/30/35/50, six rows; display initial20 and totals32/47/65/90/130.
- Upgrade cash200/300/400/600/0 and completed orders0/0/0/10/35. The final step charges no unrequested cash.
- Use real current item value; respect explicitly specified tiers, permit higher tiers only where requested. A UID cannot fill multiple requirement slots. Exclude fakes, active forgery, non-shop and committed/unsafe originals.
- Material capacity initial20; increments20/20/20/0/50. Isolation initial20; increments20/20/20/20/50. These resolve unspecified mapping while preserving the supplied material increments.
- Pawn initial20; extra slots5Cr each, permanent, separately billed from nightly insurance. No extra AP or construction delay.
- Count distinct successful ordinary orders and service contracts; preserve counts and originals across saves. Legacy10x8 receives level1 with no extra cost; preserve other shop extensions.
- Implement in /workspace/pawnshop-warehouse; merge to main and publish GitHub Pages after review and verification.

## Review Focus

- Failed persistence must not consume selected watches, cash or slots.
- Restoring/debugging a save must not repeat migration, upgrade settlement or commission credit.
- 50-column horizontal scrolling and cross-panel drag must keep first/last cells reachable on phones.
- Old dense10x8 layouts and >20 displayed originals must migrate without losing or duplicating UIDs.
- Explicit drag destinations must enforce ownership/evidence/capacity and must not accidentally toggle an already-correct location.

### Task 1: Capacity and consumable upgrade model

**Files:** new model/warehouse_expansion.gd and tests/warehouse_expansion_test.gd; model/model.gd, model/shop_upgrades.gd, app/game.gd, model/commerce.gd, ui/merchant_materials.gd.

**Interfaces:** WarehouseExpansion.ensure/default_state/columns/rows/capacity/completed_count/requirements/candidates/problem/reduce; actions EXPAND_WAREHOUSE(level,uids), BUY_PAWN_SLOTS(quantity,requestId), STORE_ITEM(uid,location,x,y,rotated). Only upgrade and slot actions use checked save-before-commit dispatch.

- [x] Write and run RED cases for distinct watches, forgery rejection, literal capacity boundaries, affordability, consumed UIDs, cumulative display, commission count, permanent slot fees and legacy migration.
- [x] Implement model and connect all actual placement/cabinet/material purchases; preserve existing workshop/display effects.
- [x] Verify targeted new tests and affected commerce/extension tests; adjust old extension tests to the replacement product behavior.

Expected: rejected commands preserve funds/originals; every accepted upgrade settles once and uses the correct dynamic capacities.

### Task 2: Compact drawer and guarded cabinet drag

**Files:** pages/warehouse_page.gd, new ui/warehouse_expansion_panel.gd and ui/warehouse_location_grid.gd, app/shell.gd, ui/shop_plan.gd, tests/warehouse_expansion_ui_test.gd.

**Interfaces:** Drawer exposes display_panel, holder, detail_panel, grid, cabinet buttons and fixed expansion button; expansion panel uses selected UID array plus expected next level; drop commands use explicit STORE_ITEM destination.

- [x] Write and run RED layout/interaction checks for desktop1440x900, landscape844x390/568x320 and portrait390x844, including full/forged upgrades and drag rejection.
- [x] Implement left display, central horizontally scrolling storage and right detail, with independent material/isolation/pawn tab buttons and compact touch fallback.
- [x] Implement real selected-watch requirements and confirmation, dynamic capacities, safe cross-panel mouse drag and edge scrolling; retain rotation and first-column clipping protections.
- [x] Run UI tests and existing warehouse/mobile/gesture regressions.

Expected: visible fixed entry opens a reviewable cost/UID dialog; no panel overflows the safe area and invalid drops keep originals in place.

### Task 3: Counter display and permanent slot purchase

**Files:** pages/counter_page.gd, pages/report_page.gd, tests/warehouse_expansion_ui_test.gd, scripts/test-godot-native.py.

- [x] Add RED behavior checks for scrollable counter display showing only actually displayed goods and independent persistent slot purchase at5Cr.
- [x] Implement clipped cabinet scrolling inside existing artwork and purchase controls in pawn storage and the insurance section.
- [x] Verify real Game.dispatch save failures, reload and unchanged insurance premiums/ownership; register new groups.

Expected: more than20 displayed goods remain accessible; nightly policy expiry never removes purchased pawn capacity.

### Task 4: Verify, review and publish

- [x] Build Web export, run npm test and exported-resource smoke check; visually inspect native drawer, expansion selection and high-capacity scrolling.
- [x] Obtain fresh whole-branch review, fix material issues with reproducing tests and verify the resulting tree.
- [ ] Commit, merge main, generate deployment manifests with hashes and previous assets, push main and gh-pages, wait for the exact Pages run to succeed.

Expected: complete feature is available at the existing pawnshop GitHub Pages URL, with old saves preserved.
