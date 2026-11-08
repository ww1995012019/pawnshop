# Loading, viewport and counter verification

The initial Web loading page now uses the pixel shop artwork and a matching progress panel. The standalone `loading-shop.png` is published alongside the HTML so it can appear before the game pack is downloaded.

The canvas uses Godot's `expand` mode: the original 1920×1080 shop and its interactive controls retain their proportions, while original pixel-wall art and floor edges fill the extra viewport. Counter UI, world sprites, pointer positions and notifications share the same centering offset. The counter surface is deeper, the physical item is reduced from 135 to 105 logical pixels, and its drag bounds allow movement on both axes. The current transaction model still handles one current lot; the extra work surface reserves room for future multiple-item workflows.

After incorporating upstream audio changes through commit `9fe01fd`, native input and workspace checks passed (ten trade/device checks and 40 workspace checks); quote-console geometry and six quote/title regressions passed. The audio test and the full npm suite passed. Chromium checked the final build at 1920×910 and 1280×800: the loading artwork loaded independently, the canvas filled the viewport, real clicks opened the customer and inspection, and no browser errors were recorded. A WebAudio analyser recorded audible output after the user gesture (peak 0.203). Existing Godot resource warnings occur during test process shutdown.

Tested Web pack: `workbench-9105fb288e9f.pck`, 20,133,664 bytes. Original side-wall master is preserved in `art-source/shop-v3/`; `prepare_shop_art.py` recreates the runtime wall texture.
