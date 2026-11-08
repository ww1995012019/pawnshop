# Interactive pixel shop verification

The Godot home is now a persistent, front-facing pixel shop. Scene equipment opens one in-shop workspace rather than replacing the counter. Closing it retains the live visitor, physical lot and pending quotation. Latest upstream catalogue and resident-dossier changes from `b8cb4e1` were integrated before the final build.

Original shop, nine resident portraits, 28 HUD symbols and six inspection tools are retained under `art-source/shop-v3/`, with a repeatable pixel importer. Existing 57 catalogue entries keep all 114 unique item faces. The default customer/item shaders no longer multiply authored texture colour twice.

## Functional evidence

- `npm test`: complete suite passed after installing the existing locked dependencies; package and lockfile unchanged.
- Godot reducer replay: 16 freshly generated traces, 6,394 steps, zero divergence.
- Item art validation: 57 entries, 114 front/back faces, zero failures.
- Native input trade at 1280×800: actual bell, object drag, wheel quote, equipment entry/close, quote retention, accept, delivery, orders and ledger passed.
- Native workspace suite: 40 assertions passed, including cross-viewport Tab/Shift+Tab/Enter, exclusive focus, two nested embedded popups, root popup precedence, focus return, captured-Dial cancellation and live visitor/lot/quote retention.
- Native instrument layout suite: seven assertions passed. Both probes remain clear of panels, real pointer input connects both and records circuit evidence; all scale weights fit, and the last 100g button receives an actual click.
- Native cursor suite: 16 checks passed, including disabled actions, world drag across controls, text input, magnifier crosshair and stock dragging.
- Native colour regression: both default shaders exactly reproduce the source test colour (delta 0).
- Quote/title regression: six assertions passed. Order acceptance, original-object delivery, counts and exact 1 AP expenditure passed.

## Visual and Web evidence

Final versioned pack: `workbench-c7f845cc799f.pck` (16,832,720 bytes). Loader configuration, content hash and pack size agree.

The exported Web build was run in Chromium at 1280×800 and 1280×720. Title, idle shop, trade, all five equipment workspaces, selected magnifier and latest resident dossier were visually inspected. Real browser Tab/Enter activated the magnifier without dismissing its drawer; Shift+Tab/Enter returned to the same counter. No browser or GDScript console errors were recorded.

A full task review and whole-branch review were completed. The captured Dial, wrapped speech minimum, compact Dial minimum, keyboard focus boundary and instrument geometry findings were reproduced, fixed and checked again. Final scoped review found no remaining blocking issue.

Tests use isolated save directories and ephemeral browser contexts. Some headless regression shutdowns retain the existing unfinished shutter timer/resource warning; the final native workspace run had no script errors or resource cleanup warning. No production audio/timer behavior or game/save rules were changed.

## Deployment

Source implementation: `8bea691`. Published branch commit: `bdae48adfae189ca292279b7ebfa381a79267de6`. GitHub Actions [42489521948](https://github.com/ww1995012019/pawnshop/actions/runs/42489521948) reports all three jobs (`build`, `deploy`, `report-build-status`) completed successfully, including `Deploy to GitHub Pages`. The deployed HTML, PCK and versioned PCK are byte-identical to the tested release.

Live game: https://ww1995012019.github.io/pawnshop/?v=c7f845cc799f
