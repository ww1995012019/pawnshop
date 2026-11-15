# Approved comic reference — final implementation QA

Source visual truth: `/workspace/generated_images/exec-cb94836f-d9e8-4983-928f-8509c343c80a.png`.
The production `approved-reference.png` is byte-identical (SHA256 prefix
`fd64f2a98f6ad27e`) and imported losslessly.

Implementation: real Godot Web build in Chromium/SwiftShader, 1920×1080 CSS px,
DPR 1. Source: **1671×941 px**. Running capture: 1920×1080 px, normalized to
1671×941 for comparison. Main state: day 25, 979081 Cr, AP 10, attention 100,
33 stock items, CHR-021, WCH-059 asking 170, seven shop originals and one visitor
original. The shop's 95 Cr item is hovered while the visitor's 170 Cr item stays
selected, matching the source. Fixture saves use isolated browser/native data.

Full-view combined evidence: `work/exact-reference/comparison-final.png`.
Running capture: `work/strict-reference/main-reference.png`.
Focused combined evidence: `work/exact-reference/final-focus-{actor,hud,right,table,stock,cabinet}.png`.
Workspace contact sheet: `work/exact-reference/workspaces-final.png`.
Additional states: `work/strict-reference/{idle,own-original,closed-muted,merchant,landlord,desktop-1440,desktop-2560}.png`.
Both artifacts were opened in the same combined full-view and focused images;
this review is based on rendered pixels, not build/test counts.

## Findings and comparison history

1. **P1 — Different artwork in the prior implementation.** Different faces,
   watches and room linework did not reproduce the approved design. Replaced
   reference-covered imagery, shadows, HUD, paper and control skins with the
   supplied source pixels. The cleaned-room donor reconstructs occluded scenery and continuous cabinet
   backing; runtime controls draw the actual visitor, items and prices.
   Evidence: `comparison-01.png` through `comparison-final.png` and actor/table
   focused comparisons. No remaining substitute artwork for reference assets.
2. **P1 — Baked dynamic objects and old values.** An RGB/RGBA donor mismatch
   initially prevented clearing. Fixed format conversion, removed full visitor
   bounds and cleared all dynamic UI content. Empty, departed-visitor, special
   visit and own-item screenshots now have independent live content.
3. **P2 — Typography, label proportions and stock clipping.** Matched Latin
   numeral family, CJK optical weight, sizes/line metrics, native sprite sizes,
   rounded price skins and source margins. Stock uses six 63×91 cells with
   2 px horizontal and 3 px vertical gaps; viewport is two complete rows.
   Evidence: focused HUD/right/stock/table images. No stray third-row sliver.
4. **P2 — Input/state regressions.** Fixed double letterbox offset, overlapping
   action hitboxes, draft quote submission, button recreation during gestures,
   special-visit stock routing, stale item references and layout refresh keys.
   Also fixed business/rent state, actual preview list price, no-item icons,
   mute indicator and dynamic special-visit captions. Native regressions and
   real browser actions verify the current state, not sample painted values.
5. **P2 — Rectangular repair seams in an empty cabinet.** The last empty-state
   review exposed watch-sized donor patch boundaries. Clear each continuous
   cabinet backing, fitted between original wooden shelves, rather than
   leaving individual patch edges. Final empty/filled cabinet captures and
   the refreshed focused comparison show no remaining rectangular repair seams.

6. **P2 — Extra PC proportions and long special-visit copy.** A 1440×900
   capture exposed the legacy pixel room in the letterbox and a landlord line
   exceeding the folio. Added an independent solid ink matte behind this
   desktop view; special-visit explanations wrap to two lines within the
   unused quote area, and ordinary financial lines fit their actual width. Both
   native regressions failed before the correction and passed after it.
   Evidence: `final-edge-before.log`, `final-edge-after.log` and the final
   landlord/desktop captures.

## Required fidelity surfaces

- **Fonts/typography:** Noto CJK with tuned native weight, DejaVu Sans for Latin
  and numerals; original painted static captions/icons retained in skins.
  Font licensing is included. Dynamic labels fit/clip deliberately, long real
  dialogue scrolls inside the original tailed bubble. Native glyph rasterization
  differs slightly from the painted sample; classified P3.
- **Spacing/layout:** all persistent regions follow measured 1671×941 source
  coordinates; right folio is 1186,68 / 485×791. No duplicate global offset.
  Source paper corners, source price frames, shadows and icon sizes preserved.
  Scrolling occurs only with actual overflow; no empty cabinet plus controls.
- **Colors/tokens:** original raster palette for paper/wood/green felt/red ink;
  live UI uses ink #20241e, paper #f7e5c3 and red #b84e37. Hover/disabled colors
  communicate actual eligibility, rather than forcing sample enabled states.
- **Image quality:** lossless approved illustration, independent sprite masks,
  source scene crop for the resident's hair/ink, and original cast shadows.
  No screenshot overlay, code-drawn replacement art or generic product shapes.
  Evidence-bearing technical close-ups keep their canonical specimen renderer.
- **Copy/content:** actual database name 茉婆 and 静湾, true appraisal 11–230 and
  real cash arithmetic 979081−170=978911 are preserved. The generated reference
  contains 荣婆/静海/121–230/979811; those content discrepancies are intentional
  corrections to sample text, not hardcoded fake game values. Counts, quotes,
  prices, rent, cash, AP, sound and visit actions remain live.

## Functional verification

- Full native run covered 127 groups: 126 initially passed; its sole quote
  hitbox failure was corrected and passed on rerun. The final 12 relevant groups
  (asset/state/strict view/quote/bell/readability/mobile/alignment/workspace/table/
  showroom/compact workspace) all passed. No unresolved native failure.
  Logs and combined history: `work/exact-reference/verification-results.json`.
- One font coverage test and seven packaging tests passed.
- Real Chromium mouse/keyboard: all main workspaces; people, ledger, handbook,
  settings; typed 173 without Enter; one checkout deducting exactly 173 Cr and
  1 AP; one exact UID transferred; flip; table drag; cabinet transfer/swap;
  own-item inspection/return; arrangement retained after reload.
  `work/strict-reference/browser-results.json`: passed, errors `[]`.
- Additional browser captures check closed/mute, merchant, landlord, and PC
  1440×900 / 2560×1440 layouts. No sample transaction icons over idle text.
  `state-browser-results.json`: passed, errors `[]`, on final build
  `2c35db7028a74226` / `workbench-a96565faf903ddc8.pck`.
- Source review found no remaining reproducible P0/P1/P2 logic defect.

## Follow-up polish

P3 only: native text antialiasing and tiny scaling softness differ from painted
lettering. Reconstructed hidden scenery and the continuous cabinet backing
have small texture differences. Views/models absent from the supplied image use the matching comic
asset family. Technical evidence art remains deliberately canonical.

## Implementation checklist

- [x] Source imagery, measured layout and independent live controls.
- [x] Same-state full-view plus readable focused comparisons.
- [x] Workspaces and actual transactions/drag/return/reload verified.
- [x] Final cabinet correction, long copy and PC letterboxing recaptured and
  visually checked. No actionable P0/P1/P2 remains.

final result: passed

Publication verification is separate from this local design gate: the runtime
proxy rejects the public Pages domain (HTTP tunnel 403), and the cloud browser
is unavailable. Do not report live-site testing as completed from Git pushes.
