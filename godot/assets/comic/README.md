# Comic presentation assets

`approved-reference.png` is the user's supplied 1671×941 approved design,
preserved unchanged and imported losslessly. `reference_atlas.gd` separates
its painted scenery, resident, watches, shadows and UI skins at runtime.
Dynamic text and objects are cleared from scenery before independent live
Godot nodes are rendered. `reference-clean-room.png` is an Image Gen donor for
occluded scenery and the continuous cabinet backing; exposed structural
woodwork and all foreground reference artwork are retained.

Existing generated residents, front/back watch sheets, paper and room art
remain as matching fallbacks for characters, models and views absent from the
reference. `comic_assets.gd` maps real model/appearance IDs to those sprites.
Technical inspection specimens, markings and counterfeit clues retain the
canonical renderer so illustration changes do not invent or remove evidence.

Controls, prices, dialogue and stock remain live game nodes. Static painted
captions/icons may remain in a control skin; changing actions use a cleared
skin and their current caption. No full-screen screenshot overlay is used.

Most interface SVGs are Lucide icons from
https://github.com/lucide-icons/lucide/tree/main/icons (2026-11-15), ISC license
in `icons/LUCIDE-LICENSE.txt`. Retained Font Awesome Free icons are covered by
`icons/LICENSE.txt`. `icons_ink` provides ink-colored existing UIKit aliases.
Font licensing is in `../fonts/`, including `reference-latin-LICENSE.txt`.
