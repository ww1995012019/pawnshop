# Quotation console polish

The floating quote rectangle and separate edge toolbar now belong to an original pixel-art quotation machine on the countertop. Its LCD contains the offer and estimate, its control deck holds the existing Dial and evidence controls, and its recessed key tray contains the transaction actions. All reducer calls and quote-draft behavior are retained. The pawn cap uses a shorter caption with its existing conditions/tooltip.

The original master is `art-source/shop-v3/quotation-master.png`; `prepare_shop_art.py` imports its 580×336 runtime sprite. Mouse hit testing follows its alpha silhouette, so invisible margins do not cover the inspection equipment. Orders and people nameplates sit above the machine.

Verification:

- New console test: 82 assertions passed across idle, buy, evidence, locked and sales states; controls stay inside the housing without overlapping. Native pointer red/green checks reproduce and fix the transparent-margin hit target and nameplate occlusion.
- Native input test: all ten trade and equipment interactions passed.
- Native workspace and cursor tests: 40 and 16 checks passed; quote/title regression: six checks passed.
- Complete npm suite passed; no package or rules changes.
- Chromium: final Web release inspected at 1280×800 and 1280×720. Real pointer opened inspection through the transparent machine margin; keyboard selected the magnifier and returned; actual acceptance and delivery changed cash from1200 to1066 and AP from12 to11. Browser errors: none.
- Scoped independent review and fix re-review approved; no remaining important findings. Existing native/headless shutdown resource warnings remain limited to test termination.

Tested pack: `workbench-3c5a681b8c34.pck`, 16,880,148 bytes. Published target remains the established GitHub Pages branch and URL.
