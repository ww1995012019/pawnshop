# Warehouse expansion verification

## Scope

Five consumable-watch upgrades (20/25/30/35/50 × 6), cumulative display capacity32/47/65/90/130, separate material/isolation/pawn cabinets, permanent pawn slots at5Cr and preservation of legacy originals.

## Verified

- `npm test`: all110 native regression groups, packaging, font and loading checks pass.
- Exported-resource smoke:78 item resources,33 residents and3 instruments load.
- Drawer layout and final-column reachability at1440×900,844×390,568×320 and390×844.
- Real pointer input for display/warehouse transfers, rejection of drops over non-grid controls, watch selection and consumption confirmation.
- Held-pointer confirmation also passes with button animation enabled; modal controls own cursor updates to prevent synthetic motion from canceling presses.
- Save failures preserve cash and originals; reload retains upgrades and purchased slots. Repeated commands cannot consume twice.
- Counter display scrolls beyond20 originals and excludes goods still in the warehouse.
- Native visual inspection confirms the three-panel drawer, readable material names, expansion conditions and bidirectional drag.
- Whole-branch review found a hidden-column drop issue and missing isolation capacity caption; both have reproducing regressions and are fixed.

## Release validation

Actual exported-browser input validates upgrade consumption, permanent slot purchase and persisted reload at1440×900,844×390 and390×844. Browser tests wait for IndexedDB persistence separately from live cash updates.

Mobile visual follow-up fixes unreadable narrow cabinet buttons, pawn controls below the visible grid and purchase-row overflow. Regressions cover minimum button width, every switched cabinet's bounds, non-overlap with item details and the initial visibility of the purchase button at all four native sizes. The final portrait export passes the full upgrade/purchase/reload flow.

Release artifact hashes and previous-release assets are verified before publishing. Deployment completion is recorded by the exact GitHub Pages workflow for the gh-pages commit.


## Published deployment

- Application source: `9312159ee6c13faebc02820b6537aca2bcd1caf6`.
- Published gh-pages commit: `983dc6b167090df9b5b8316c4cfd352123c302d8`.
- Release ID: `f54d7f45360fe349`; pack: `workbench-3449b2df6a840bf2.pck`.
- Exact [GitHub Pages deployment](https://github.com/ww1995012019/pawnshop/actions/runs/43276633010) completed successfully.
- Final portrait browser check confirms all cabinet controls remain stable when switching away from pawn storage; the expansion sheet opens and closes correctly.
- [Published game](https://ww1995012019.github.io/pawnshop/?v=983dc6b).
