# Comic presentation implementation

Approved reference: `exec-cb94836f-d9e8-4983-928f-8509c343c80a.png` (1672×941).

PC now uses `strict_counter_view.gd`: a native 1672×941 scene scaled into the
existing Godot viewport. The measured HUD, shelves, stock tray, counter,
tailed speech bubble, transaction folio and bottom commands are independent
controls. The original counter remains the transaction controller; visible
buttons invoke its existing guards and reducer actions. Mobile keeps its
existing adaptive layouts and shares the paper/ink palette.

`comic_assets.gd` provides independent room, portrait, watch, bell and paper
artwork. Interface icons use Lucide outlines and a few retained Font Awesome
icons; their licenses are in the asset directory. Technical watch specimens,
markings and counterfeit clues retain the canonical renderer. UI illustration
redraws differ in details from the reference; this is not a pixel-identical
asset reproduction. See `design-qa.md` and the running-game comparison.

Inventory and table controls refresh on their actual content and canonical
layout signatures, so an unchanged inventory button survives quote updates.
Click-time eligibility resolves the current UID, not a captured item snapshot.
Quote drafts commit before Offer or nudges. All movement and checkout use the
same persisted model; browsing, flipping and placement do not spend cash/AP.

Animations are tied to existing actions: the service bell, visitor gestures,
watch flip and completed handover. Reduced-motion preferences are respected.
The removed cabinet-door, lamp and cash-box fixture animations stay removed.

Verification: 125 native groups (full run plus focused reruns), seven packaging
checks, font coverage, and actual Chromium pointer/keyboard input through
quote, payment, page navigation, flip, table drag, cabinet swaps, own-item tools
and reload persistence. `python3 scripts/test-counter-scene-web.py` runs the
browser checks against the preview on port 4174 and writes screenshots to
`work/strict-reference`. The current revision has not been published.
