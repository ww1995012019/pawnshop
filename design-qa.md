# Comic presentation QA

Source visual truth: `/workspace/generated_images/exec-cb94836f-d9e8-4983-928f-8509c343c80a.png` (1672×941).
Implementation: `work/comic-review/trade.png`, `warehouse.png`, `inspect.png`, `repair.png`, `orders.png`, `report.png`.
Chromium viewport: 1920×1080 CSS pixels, deviceScaleFactor 1. Full-view comparison: `work/comic-review/comparison.png`, source and capture normalized to 960×540 each. Source and running game use different NPCs, inventory counts, prices and dialogue; these values must remain live.

## Scope and visual differences

This is a native Godot adaptation of the approved comic direction, preserving the actual simulation and the original small watch presentation the user explicitly selected. It is not a pixel-identical recreation of the generated art. Existing dynamic NPC, watch, evidence and modification atlases remain in use. The backdrop is a newly generated independent illustration, not a baked screenshot of the game. These asset differences remain visible and must be stated in the handoff.

## Comparison history

- Initial capture: light text on light controls, legacy quotation artwork, and inspector/terminal overlap. Fixed ink overrides, replaced quotation background with live paper controls and made preview/terminal regions mutually exclusive.
- Second capture: tabletop/background anchor mismatch and excessive actor-to-desk gap. Fixed Sprite2D center-relative anchor and moved the actor and table presentation region.
- Third capture: oversized old dialogue card. Moved trade guidance and secondary action into transaction column; limited speech surface to a rounded 325×160 region with scroll for real long lines.
- Review: stale saved preview UID could hide both inspector and terminal. Visibility now follows validated showroom details. Regression covers removal and terminal restoration.
- Review: mobile primary text inherited the former light ink. PortraitSkin now uses dark ink. Desktop-only additions share DesktopCounter visibility and reuse nodes after refresh.

## Required surfaces

- Typography: native CJK font remains available and subset test passes; ink lettering is readable on paper. Small price tags use explicit light ink over dark counter labels. Existing exact dynamic captions and tooltips retain real amounts and enabled states.
- Layout: left stock and display, central multi-item desk, right quotation/details, bottom commands. Desktop controls stay separate from mobile presentation; native layout regressions pass. Long speech scrolls rather than discarding gameplay text.
- Colors: paper #f1dfbc, ink #302b25, brick/rust accents and muted olive work surfaces applied centrally, including all six main pages and common documents/dialogs. Mobile selected captions pass contrast regression.
- Images: independent comic backdrop inspected. Canonical animated actors and item atlases retained intentionally; they are visibly less detailed than the mock's illustrations. No full-screen screenshot is used as interactive UI.
- Copy: all live amounts, names, evidence, ownership and actions continue to come from the game. No employee system, XP or other generated-mock features were introduced.

## Verification

124 native regression groups passed across the initial run and targeted reruns after fixes. Final counter/dialogue/mobile reruns cover the final layout. Chromium opened counter, warehouse, orders, repair, inspection and report; closing returned to counter. Actual mouse test covers cabinet-to-counter-to-cabinet drag, occupied swap, flip, exact-item tool entry, return and reload persistence, with unchanged AP/cash and zero script errors. Packaging: 7 tests passed; font: 1 test passed. Build and diff checks passed.

## Follow-up polish

- Original animated portraits, watches and small equipment icons are retained, rather than fully redrawn comic asset sets.
- The runtime faithfully preserves dynamic text, so its text density varies from the short sample dialogue in the mock.

final result: passed
