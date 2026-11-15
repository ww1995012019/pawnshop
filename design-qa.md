# Approved comic reference — implementation QA

Source: `/workspace/generated_images/exec-cb94836f-d9e8-4983-928f-8509c343c80a.png`.
Actual running capture: `work/strict-reference/main.png`.
Side-by-side: `work/strict-reference/comparison.png`.
Chromium: 1920×1080 CSS pixels, DPR 1, real Godot Web build.
The isolated reference fixture uses day 25, cash 979081, AP 10, 33 stock items,
CHR-021, WCH-059, the sample shelf prices and eight tabletop originals.
Names, estimates and transaction calculations remain real game values.

## Visual result

The desktop structure has been rebuilt from the source coordinates rather
than reskinning the old desktop controls. The main measured regions, in the
1672×941 reference coordinate system, are:

| Region | Implemented bounds |
| --- | --- |
| Status strip | 2, 2 — 1668×57 |
| Stock tray | 7, 577 — 413×273 |
| Transaction folio | 1187, 69 — 479×789 |
| Speech bubble including tail | 765, 160 — 280×96 |
| Bottom rail | 1, 867 — 1670×72 |

Manual screenshot review covered typography, paper surfaces, borders, icon
weight, character/table placement, watch/price-tag scale, dialogue tail,
transaction actions, overlapping windows and overflow scrolling. The same
paper/ink system is applied to warehouse, inspection, repair, orders, report,
people, ledger, handbook and settings. Empty cabinet plus signs are absent;
scrollbars appear for actual overflowing contents.

## Differences still visible

This is not a pixel-identical copy of every painted detail. The independent
room and resident/watch illustrations have different linework and some pose,
face, color and strap details. A further background-removal attempt still
redrew the original face; that candidate was rejected rather than called an
exact extraction. Fonts and library icon paths are native equivalents, not
the exact raster lettering/strokes in the generated source. The technical
inspection specimen intentionally keeps its existing evidence-bearing art.
These differences mean **strict artwork fidelity is not marked passed**.
The actual capture and comparison are the evidence, not the test count.

## Issues found and corrected during checks

- Oversized paper corner caps collapsed short labels; use a 256px import,
  8px caps and a separate native ink outline.
- Two-line speech overflowed because of CJK line metrics; adjusted line
  separation and content height, retaining scrolling for longer real dialogue.
- Raised action text leaked over workspaces; removed the global z-index lift.
- The quote field's default character width overlapped the first nudge;
  constrained its theme minimum while retaining editable currency input.
- Refresh rebuilt live inventory controls mid-gesture; retain nodes until
  inventory/layout content changes.
- Typed quotes could submit the old dial value; commit drafts before Offer.
- Special-visit stock clicks could enter sale selection; use the original
  eligibility/routing condition.
- Same-cabinet layout changes and trade-table positions were missing from
  refresh signatures; both canonical layouts now update the visible positions.
- Eligibility used a captured item dictionary; resolve the current UID when
  clicked after source verification or repair sealing.
- First-use portrait decoding could stall the bell animation; prewarm assets.

## Verification evidence

- Latest logs for all **125 native regression groups** have no failure/script
  error markers. A full run was followed by targeted reruns after fixes.
  `strict_counter_view_test` adds quote draft, retained-button identity,
  merchant routing, canonical cabinet swap, current-item eligibility and
  immediate trade-table placement regressions.
- **Seven packaging tests** and **one font coverage test** passed.
- `test-strict-counter-web.py` passed with actual mouse/keyboard input:
  right-click flip, trade-table drag, all main workspaces, people/ledger/help/
  settings, typing 173 without Enter, one checkout, exactly 173 cash and 1 AP,
  exact UID ownership transfer, cabinet drag and same-cabinet swap, own-item
  tool entry/return, and persisted arrangement after browser reload.
- Browser script errors: **0**. Results: `browser-results.json`.
- Build completed; engine + pack: 54.33 MB raw / 25.43 MB gzip.
- Current revision is local and has not been pushed or deployed.

Functional verification: passed. Measured desktop layout: checked against the
reference. Pixel-identical artwork: not achieved; do not claim strict visual
approval or publish this as an exact approved copy.
