# Trade and workbench clarity corrections

**Goal:** Apply the user's marked corrections to accepted-offer delivery, scale controls, operation targets/parts visibility, completed operations, modified-watch presentation and repair layout.

**Architecture:** Keep canonical originals, current pricing/custody protection, and existing workbench operation state. Correct the transition from accepted player offer to confirmed row. Reuse shared player-facing presentation helpers for physical appearance and modification marks. Move mode selection above a shorter work area and make action availability visible.

**Execution:** Parallel independent quote-model and item-presentation fixes; parent owns repair/inspection UI and integration.

## Constraints

- Player's accepted exact offer locks that item without an extra Accept; a real NPC counteroffer still needs explicit acceptance. Delivery remains explicit and atomic.
- Remove the separate scale '取回手表' button; keep tare/place and reliable dragging/automatic removal transitions.
- Improve operation target contrast/weight; don't draw a replacement case or component when no relevant part is present.
- Completed fabrication actions are disabled and visibly gray, with completion status preserved.
- Player-visible modified items have an explicit 改 marker. Luxury-or-above appearance follows the actually installed target exterior; never change original identity/value/truth or NPC knowledge to achieve styling.
- Repair/refurbishment/fabrication selectors sit above the center work surface at the marked guidance header; shorten the oversized surface slightly without hiding controls, hints, tools or stock.
- Preserve desktop/phone hit regions, workspace/modal capture, active work progress and reload behavior.

## Tasks

- [x] Quote transition: meaningful RED accepted-offer/counteroffer checks, then GREEN with budget/risk/stale-action protection retained.
- [x] Shared appearance helpers and clear item markers in stock, shelf, table and warehouse; reuse them in repair list.
- [x] Main UI: remove redundant scale control; strengthen operation rings; hide absent replacement drawings; gray/disable finished fabrication; move mode selectors and compact work surface.
- [x] Run targeted rules and existing meaningful UI/layout/art tests, complete npm suite, fresh exported pack checks, actual desktop/phone repair and trading browser flows with screenshots.
- [x] Independent review: no material findings; final header/notice geometry and visibility checked.
- [x] Merge main and publish the verified pack using existing authorization; exact-SHA Pages success confirmed.

Review focus: counteroffers must never be auto-confirmed; unavailable part art must not misrepresent possession; disabled controls must really block execution; physical tier/marker must be consistent while original truth remains unchanged; smaller workbench must retain reachable operation targets and controls on phone.

Verification: exact-price agreement regression observed RED→GREEN in both directions; original guards/counters/replays/round limits covered. Scale control regression observed RED→GREEN, including reweigh and automatic empty-pan tare of the same original. Complete npm suite: 60/60 native groups plus packaging 7, font 1 and loading-layout 2. Final persistent-hint visibility change additionally passed targeted service UI and fresh desktop/mobile visual probes. Export check: 33 watches, 33 residents, 3 instruments, failures=0. Desktop and phone full premium forgery and independent refurbishment workflows passed, including partial case resume and unchanged movement/truth. Updated actual-input tabletop browser passes OFFER→locked→DELIVER with no intervening ACCEPT or early cash/AP movement. Dedicated desktop/mobile visuals pass installed luxury/改 markers, top mode selectors, completed disabled controls, absent replacement-case tray, and two-control scale.

Rulings: 改 indicates completed forgery history, including subsequently removed/restored forged parts; ordinary lawful refurbishment alone is not labelled forged. Tiers follow the currently installed appearance. Scale tare/reweigh internally handle removal so a separate return-watch button is unnecessary. Workbench mode bar is persistent above the rebuilt guidance, with a small inset to compact the art without losing operation targets. Supplies only hide absent tray replacements; installed originals remain visible after materials are charged.

Published source `53ec4b5881c2c50039d98e11a4e612442d522591`, release `84173ebbc60b133c`, Pages commit `f6a0c361fd6bb19fca4fd11e98751e1bfdd1a231`; [workflow 42858214015](https://github.com/ww1995012019/pawnshop/actions/runs/42858214015) completed successfully.
