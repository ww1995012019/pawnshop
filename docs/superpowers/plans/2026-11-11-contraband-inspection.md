# Contraband Inspection Implementation Plan

**Goal:** Attention×0.03 percent daily inspection probability, player-controlled preparation, hidden isolation stock, and a flat30Cr assessment for visible stolen originals.

**Spec:** docs/superpowers/specs/2026-11-11-contraband-inspection.md

**Architecture:** Preserve NightCrime's saved daily draw and real inventory/case reducer. Update its inspection calculation and settlement; CounterPage supplies preparation and explicit confirmation controls. No separate inventory or shadow inspection model.

**Constraints:** Current published source plus latest mobile sizing updates must remain intact. Existing completed inspection receipts and daily draws stay stable. No AP consumption for preparation/checking; no counterfeit confiscation, historical inventory search, isolation scan, proportional fine or cooperation waiver in this inspection.

## Task 1 Model and regression tests

Owner files: night_crime.gd, dedicated new inspection model test, affected existing crime/schedule test fixtures.

- [x] Write failing tests for probability0/12/100 = 0%/0.36%/3%, daily save stability, hidden/visible stolen items, non-stolen fakes, fixed30 fine across item counts and prices, insufficient cash, no repeated penalty and canonical original removal.
- [x] Generate daily hash on10000 resolution with threshold attention×3, record chance in day state; inspection_chance returns percentage float.
- [x] Check only current visible shop-owned stolen originals. Leave isolation and non-stolen originals unchanged; remove found originals and resolve their case custody without readding them to inventory.
- [x] Update legacy tests whose risk bands, leniency, historical penalties or isolated confiscation expectations are superseded.
- [x] Run focused model and schedule regressions.

## Task 2 Preparation UI and integration

Owner root: counter_page.gd, report_page.gd, shell inspection report/manual, dedicated UI test/browser fixture and harness, test runner.

- [x] Test that the real inspector waits, warehouse can open, isolation works and checking happens only on explicit confirmation.
- [x] Provide preparation action and clear confirmation caption; show percentage and fixed fine scope, remove obsolete leniency copy.
- [x] Verify portrait/landscape controls, result receipt, readback/save stability and no AP charges.
- [x] Run native suite, web build, browser inspection journey and focused review; keep changes isolated on feature branch until publication is requested.

## Verification

- `npm test`: exit 0; Godot native 78/78 groups plus packaging, font and loading checks passed.
- `python3 scripts/build-godot-web.py`: exit 0.
- `python3 scripts/test-contraband-inspection-web.py`: desktop and landscape passed; portrait passed with `INSPECTION_WEB_VIEW=portrait` after correcting the harness to scroll within the warehouse detail pane. Real input covers preparation, moving stolen stock to isolation, explicit confirmation, fixed30 payment at zero AP and reload stability.
- Focused code review found no material issues; `git diff --check` passed.
- Kept on `codex/contraband-inspection`; no merge or publication for this change.
