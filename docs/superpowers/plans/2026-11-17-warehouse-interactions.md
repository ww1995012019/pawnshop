# Warehouse interaction implementation plan

> **For agentic workers:** Execute inline with test-driven development.

**Goal:** Show watch actions next to a right-clicked original and keep its translucent image visible while dragging across cabinets.

**Architecture:** Keep the existing Godot inventory rules and custody receipt. Share the current action builder between a desktop context menu and the existing mobile details. Draw drag previews above the scroll containers and convert their coordinates explicitly.

**Tech Stack:** Godot 4.6.3, GDScript, native UI tests, Chromium.

**Spec:** The user's two screenshots and request in this chat: right-click a watch to show nearby options; dragging must show the watch image.

## Constraints

- Work on the user-requested local branch `codex/local-20261116`.
- Preserve ownership, evidence, provenance, device and trade restrictions.
- Keep mobile touch actions and right-click rotation during a drag.
- Keep receipt information in the details panel; show desktop action buttons only on demand.

## Review focus

- Menus near viewport edges must fit and scroll.
- Right-clicking display, isolation and pawn originals must target that original.
- Clicking outside or pressing Escape must dismiss the menu.
- A drag preview must remain visible over the display and outside warehouse clipping.
- Invalid drops must preserve the original and remove the preview.

## Task 1: Context menu and drag preview

**Files:** `godot/scripts/pages/warehouse_page.gd`, `godot/scripts/ui/warehouse_location_grid.gd`, `godot/tests/warehouse_interactions_test.gd`, `scripts/test-godot-native.py`.

- [x] Add native regressions for right-click selection/menu targeting, placement/dismissal, action eligibility, cross-panel preview visibility, rotation and invalid-drop cleanup.
- [x] Run the regression before implementation; confirm failures reproduce the requested missing interactions.
- [x] Extract the existing action controls into a shared builder; put desktop actions in a nearby, bounded, scrollable menu.
- [x] Route right-clicks from warehouse and cabinet slots; retain touch controls.
- [x] Move warehouse drag previews to the page overlay and preserve grid-local drop geometry.
- [x] Run the new native regression and existing warehouse/mobile/action regressions; update older tests to open the desktop menu where their interaction contract changed.
- [x] Run `npm test`, build the web version, inspect actual right-click/drag behavior in Chromium, and review the final diff.

## Execution record

- Existing checkout is clean on the local branch created in this chat; work stays there.
- Root cause: desktop actions are built unconditionally inside the receipt; the warehouse ghost is clipped by its ancestor ScrollContainer.
- The new native regression reproduced five original failures before implementation and now passes.
- The independent review identified hidden cabinet slots being eligible for retargeting after switching to materials. A regression reproduced the error; checking the grid's visibility fixes it.
- Browser testing found duplicate Escape handling between the root and embedded viewports. A native regression reproduced it; the root shell now owns Escape handling.
- Real Chromium pointer tests pass at 1440×900 and 1160×700, including action execution, visible watch pixels during cross-cabinet dragging, persisted drops and Escape precedence. Screenshots are in `work/warehouse-interactions/browser/`.
- Existing desktop action tests now open the menu before using their original actions. Mobile controls and inventory permissions retain their existing behavior.
- Feature branch verification: `npm test` exited 0, including 129/129 native groups and all packaging/font/loading checks. The web build and both Chromium viewport checks exited 0. `git diff --check` passed.
- Integration retains the two newer `main` commits and their paper/framing tests. The native runner now includes all 131 groups.
- Additional integration checks reproduced wheel events dismissing the menu at the scroll boundary. Wheel events are now ignored by the outside-click handler, and the new pointer regression passes. Desktop appraisal and workspace-navigation browser scripts now open the right-click menu before invoking warehouse actions.
- Final merged-tree verification: `npm test` exited 0 with 131/131 native groups and all packaging/font/loading checks. Chromium appraisal/forgery, workspace return, and both watch-menu/drag viewport checks exited 0. The web build and Git whitespace/conflict checks passed.
