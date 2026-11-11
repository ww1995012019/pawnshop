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
