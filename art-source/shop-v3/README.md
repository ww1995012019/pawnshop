# Interactive pixel shop — original source art

Original generated masters created for this game on 2026-11-08. The reference informed the intimate front-facing shop composition and pixel language; no reference game assets, logos, or characters are included.

`shop-master.png`: empty shop devices, service window, cabinets and countertop.
`residents-master.png`: nine distinct residents, in NPC ID order, 3×3 transparent atlas.
`hud-master.png`: 28 HUD symbols in the established 8×4 cell order.
`tools-master.png`: six inspection instruments in tool ID order, 3×2.
`quotation-master.png`: original blank sage-metal quotation machine; all readouts and keys are live controls.
`wall-extension-master.png`: device-free modular wall for non-16:9 viewports.

Run `python godot/tools/prepare_shop_art.py` to import a 1920×1080 crisp background and 256-pixel portrait cells. The masters are preserved. Runtime labels, goods, visitor and all hit targets are live Godot controls, not painted buttons.
