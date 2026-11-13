# Portrait counter design QA

final result: passed

## Evidence and scope
- Source visual truth: `/workspace/generated_images/exec-04fb47e6-d67b-4f48-a59d-daaa89064d84.png` (852×1846).
- Implementation: `work/mobile-ui/trade.png`, `inspect.png`, `warehouse.png`, `repair.png`, `orders.png`, `report.png`, `records.png`.
- CSS viewport: 390×844, deviceScaleFactor 1. Source normalized to 390×844 in `work/mobile-ui/comparison.png` for direct combined comparison.
- State: active visitor selling a watch. Exact character, item and price differ because the implementation uses the existing game's real assets and reducer, rather than the concept's fictional mock data. The user requested implementing the design direction, not replacing the game's artwork.
- Combined full-view comparison: `work/mobile-ui/comparison.png`; inspected source and implementation together. Individual 390×844 captures provide readable focused tool, control and text evidence.
- Additional viewports: 320×568 fixed navigation, 1440×900 desktop restoration.

## Findings and resolved iterations
- P1: forced landscape rotation on portrait phones. Removed rotation and landscape locking; native portrait viewport and counter now render upright.
- P2: additional quote controls pushed transaction buttons under the dock. Moved the transaction region out of the scroll area so primary and secondary actions remain above persistent navigation. Verified with actual touchscreen events.
- P2: desktop order tabs overflowed narrow pages. Reduced minimum widths and used short labels; native minimum-width assertion passes.
- P2: inspection evidence notes could lose space to controls. Added a dedicated scrollable portrait inspection-records sheet and exercised opening/closing it in the browser.
- P2: rotation could lose visitor bubble visibility and inspection-tool placement. Hid the complete desktop presentation instead of mutating each control's visibility; restored instrument parents/styles when switching orientation. Native rotation assertions pass.
- Implementation regression: workbench visual masking intercepted desktop cloth input. Restored task-specific art/item visibility. Both `watch_cleaning_input_test` and `watch_service_ui_test` pass after failing in the full suite.

## Fidelity surfaces
- Typography: existing Chinese game font, 17px dialogue, 19px object title, 22px primary action; hierarchy is readable at the primary viewport. Source lettering is illustrative; actual text remains live and selectable by the game input system.
- Layout: customer above the item; tools near the object; transaction area and four destinations at the bottom. Short screens scroll the content rather than shrinking the entire PC layout.
- Colors: original burgundy painted room, green work mat, brass framing and amber primary action are retained through existing image assets.
- Assets: existing NPC, watch and instrument sprites remain authoritative and sharp. Concept-only characters and watches were intentionally not substituted for real game entities.
- Copy: live names, dialogue, money, evidence and enabled actions come from the existing game. More actions uses the existing source-risk and trade validation.

## Verification
- Chromium/Playwright actual touch input: title/start, arrival, quote, accepting the counteroffer, delivery (cash 1200 → 1155), all five workspaces, inspection records, short viewport dock and desktop restoration. Browser console: no errors.
- Native full suite: initially 66/68 groups passed; two desktop cloth-input regressions were corrected and both failed groups were rerun successfully.
- Post-change focused regressions: portrait, counter lifecycle, counter dialogue, workspace, UI, commerce phone, workbench layout and orders passed.
- Latest portrait regression additionally passes open-workspace rotation in both directions and active dialogue preservation.
- Web pack built successfully; `git diff --check` passes.

## Follow-up polish (P3)
- Concept uses richer illustrated instrument tiles and navigation icons. This iteration retains the game's existing smaller icons and button skins; custom mobile art can be refined after feedback.
- Special event and merchant dialogs still reuse existing content layouts and were not exhaustively exercised through the full 21-day campaign.


## Authorized visual-polish iteration
- User reviewed the first screenshots and requested continued visual refinement.
- New source artwork: `/workspace/generated_images/exec-2fec7881-ff78-419c-a84c-32dc6adc8ef2.png`; actual runtime atlas: `godot/assets/ui/portrait-atlas.png` (1536×1024 RGBA).
- Before: `work/mobile-polish/before-counter.png`; after: `work/mobile-polish/trade.png`. Combined same-state 390×844 comparison: `work/mobile-polish/comparison.png`, opened and inspected together.
- Resolved P2: noisy room crops stretched into header, dialogue, transaction and dock frames. Dedicated nine-slice burgundy/copper panels now preserve uniform corners and edge thickness.
- Resolved P2: small inline tool icons and text-only navigation obscured visual hierarchy. Larger dedicated tool artwork and labeled navigation icons now separate these destinations.
- Resolved P2: the main action looked too similar to secondary buttons. Amber enamel art and dark lettering give it a clear primary emphasis.
- Resolved P2: a cramped duplicated inspection information scroller exposed a partial line. Portrait inspection now uses the dedicated readable records sheet, preserving the full original notes on desktop.
- Typography: existing game font, live labels retained; main action 23px, object title 19px, dialogue 17px, secondary captions 14px. Warm cream and dark amber-button text were checked in actual screenshots.
- Spacing/layout: original portrait ordering and fixed transaction controls retained. 390×844 full-view comparison checks all main controls; 320×568 checks persistent dock.
- Colors/assets: dedicated raster artwork uses burgundy enamel, brass and green felt; tool silhouettes remain distinct at displayed sizes. Live watch and visitor sprites remain the real game entities.
- Content: names, price, dialogue and gameplay copy unchanged by the polish. Navigation and tool controls retain existing actions and disabled states.
- Validation: native portrait/rotation regression passes; touch arrival/quote/accept/delivery, five workspaces, records sheet, short-screen navigation and desktop restoration passed; browser console clean. Latest final smoke is recorded in `work/mobile-polish/web-final.log`.
- Final visual review: no remaining P0/P1/P2 in the polished counter. P3: future character-specific dialogue line balancing could reduce short final lines for some long item names.


## Fixed main page and closable sheets
User superseded the earlier scrolling treatment: main counter must fit a single screen. Removed the main ScrollContainer and moved full dialogue, item details, tools, multiple-goods choice and quotation inputs to sheets. Only the illustration flexes with height. Primary transaction and More share one row above the fixed dock. Modal headers have explicit X + 关闭 controls; portrait workspace headers say 关闭 and return to the counter.

Evidence: `work/fixed-counter/trade.png`, `fixed-320.png`, `negotiation.png`, `tools.png`, `item-details.png`. Reviewed fixed 320×568 and 390×844 captures: main object, dialogue summary, price/actions and navigation are fully visible; quotation sheet has a persistent, reachable close control. Intentional change from the original concept: three tool tiles now appear on demand in a sheet so main controls never require scrolling. Full dialogue is readable through the summary's detail action.

Verification: native long-dialogue and 320/360/390/430 px layout assertions pass; no main ScrollContainer; closing quotation does not submit; open-workspace rotation remains supported. Complete native suite: 68/68 groups; packaging/font/loading checks passed. Browser regression uses actual wheel/finger input to confirm the main screen stays fixed, opens/closes dialogue/item/tool/quote/records sheets with their real close buttons, and completes quote/accept/delivery. See `work/fixed-counter/web-final.log` and `suite.log`.

Final result for this follow-up: passed.

## Merchant materials panel — 2026-11-13

Final result: passed.

The supplied merchant screenshot mixed unlabeled icons, ambiguous owned counts,
selected material stock and a long purchase button in the same dense section.
The material cards now show short names and explicit owned quantities. A single
divider separates browsing from the selected material summary and the aligned
quantity, purchase and sale controls. Each transaction shows its unit price and
total; full material names and descriptions remain in tooltips. Existing game
artwork, compact modal width and transaction rules are retained.

Actual browser captures reviewed: `work/icon-layout/1920-merchant-materials.png`,
`1440-merchant-materials.png`, `844-merchant-materials.png` and
`390-merchant-materials.png`. Names fit the cards, the quantity is centered,
and purchase/sale buttons share an aligned row. On phones, the selected material
summary remains with the fixed transaction controls while the material grid can
scroll. No remaining P0/P1/P2 findings in the changed panel.

Validation: native material transactions/layout, compact merchant and commerce UI
tests pass. Browser tests pass at 1440×900, 844×390 and 390×844 using actual mouse
or touch input, covering material purchase, watch selection and sale, and saved
inventory persistence after reload. No script errors were reported. Web export
passes. This follow-up covers the merchant panel only.

## Warehouse receipt, workspace return and cloth input — 2026-11-13

Final result: passed.

The warehouse receipt now uses a fixed-size watch/name header and full-width
metadata. The previous narrow desktop image could stretch to 363px tall; the
same modified luxury fixture now has an 88px header. Actual browser captures
reviewed at `work/workspace-return/1595-receipt.png`, `844-receipt.png` and
`390-receipt.png`: tier, ownership, condition and valuation lines use the paper
width, and the image marks remain with the watch. The phone receipt stays
scrollable inside its existing detail panel.

Linked workspace navigation preserves the original page and its selected item,
scroll position and focus. Hidden workspaces stop rendering, processing and
receiving input. Close/Escape pops one workspace; explicit counter navigation
and game resets discard the whole history. Resume refreshes current saved work
and UV markings so older pages cannot restore stale progress or serials.

Held cloth strokes no longer serialize the full save every 0.4 seconds or rebuild
all counter inventory controls. Mouse release, navigation, completion and
backgrounding flush the current mask. The physical button state also handles
releases consumed by GUI controls. With an 81-item fixture, native progress
notification overhead fell from 19.01ms to 0.044ms.

The 81-item Chromium/SwiftShader profile confirms held input has the same median
frame time as idle (183ms in this software-rendered environment). Absolute frame
times remain renderer-limited; this is not evidence of a hardware 60fps result.
The GUI-release persistence check passed after waiting for asynchronous WebFS
to reach IndexedDB.

Validation: full native run passed 114/120 groups initially; the six affected
groups were corrected and rerun successfully, along with cleaning-input,
cleaning-performance and optical-face tests. Browser workspace return tests pass
at 1595×860, 844×390 and 390×844. Desktop and phone actual cloth input tests pass
continuous fading, release, page/reload persistence and cleaning completion.
Web export passes. No remaining P0/P1/P2 in the changed surfaces.

## Movable workspace and dialog title bars — 2026-11-13

Final result: passed.

All five workspace frames and shared root/embedded dialogs now move by their
title bars. The same drag handler converts pointer coordinates through the
actual parent transform, including scaled and high-DPI embedded viewports.
Body controls and Close retain native GUI input. Opening animations settle on
drag; later content/layout changes preserve a moved window's position. Returning
from a linked workspace restores the original frame and its moved position.
The screen edge retains a reachable portion of the title bar so large windows
can be moved aside and dragged back. Existing floating papers keep their drag
and resize behavior.

Evidence reviewed: `work/window-drag/1440-warehouse-moved.png`,
`844-modal-moved.png` and `390-modal-moved.png`. Native actual-input tests pass
for all five workspaces, root/embedded dialogs, content refresh, body and Close
buttons, history restoration, extreme movement and viewport resize. Thirteen
focused native regression groups plus the font check pass. Browser mouse/touch
tests pass at 1440×900, 844×390 and 390×844 (phone DPR 2), including nested repair
dialogs and unchanged cash/AP. No script errors. Web export and independent
code review pass; no remaining P0/P1/P2 in this change.
