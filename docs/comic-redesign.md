# Approved comic presentation

Visual truth: `exec-cb94836f-d9e8-4983-928f-8509c343c80a.png`, **1671×941**.
`strict_counter_view.gd` renders that measured PC composition as independent
native controls inside the existing 1920×1080 game canvas. The parent handles
letterboxing; the view must not add a second counter offset.

`reference_atlas.gd` separates the supplied lossless illustration into scenery,
resident/watch sprites, cast shadows, paper frames, labels and control skins.
The cleaned-room donor reconstructs hidden scenery and continuous empty
cabinet backplanes; exposed structural woodwork remains from the reference. Scenery contains no painted visitor, speech, watches or price tags.
The visible items, prices, dialogue, stock, status and actions are real nodes.
There is no full-screen reference overlay or fixed screenshot inventory.

The reference resident uses its original scene pixels to preserve every hair
and ink edge. Embedded name and speech are removed and rendered separately.
Other residents and models absent from the supplied design use the existing
matching comic art. Detailed inspection specimens retain their canonical
renderer, which carries the actual evidence. Fonts use Noto CJK plus DejaVu
Sans for reference Latin/numerals; their licenses are included.

The HUD, cabinet, stock tray, visitor, counter, speech bubble, right folio and
bottom commands follow the source coordinates. Cabinet empty-slot markers are
absent. Scrollbars appear only for overflowing items. The stock viewport shows
two complete rows. Shared workspace/dialog chrome uses the source paper frame
and ink palette across warehouse, inspection, repair, orders, people, report,
ledger, handbook and settings. Mobile retains its existing adaptive layouts.

The original counter remains the transaction controller. Visible controls
invoke its existing guards and reducer actions. Unchanged stock controls
survive quote refreshes; click-time eligibility resolves the current UID.
Quote drafts commit before Offer or nudges. Placement uses canonical persisted
slots/positions. Browsing, flipping and dragging do not spend cash or AP.
Own-item previews show the actual list price and retain inspection/return.
Idle, closed, merchant, landlord and mute states do not retain sample UI data.

Animations follow actual actions: bell, visitor fade/gestures, price highlight,
watch flip, button press and handover. Reduced-motion is respected. Removed
cabinet-door, lamp and cash-box animations remain removed.

Run `python scripts/build-godot-web.py`, start the preview on port 4174, then
`python scripts/test-counter-scene-web.py`. Real Chromium screenshots and
transaction/drag/reload evidence are written to `work/strict-reference`.
Native regressions include reference-asset and reference-state coverage.
See project-root `design-qa.md` for the final visual comparison and checks.

Dense desktop tables project all canonical slots, including vacancies after
checkout, into the visible felt. The display and drag/drop share this mapping.
Compact tags fit the available spacing and their complete area is clickable;
upper/lower pointer regions do not overlap. The existing speech bubble uses
18 px text and three complete font-height lines. Run
`python scripts/test-strict-multi-counter-web.py` for 7/16/15-original cases at
1920×1080, 1778×974 and 1440×900, including real focus, drag and reload checks.
