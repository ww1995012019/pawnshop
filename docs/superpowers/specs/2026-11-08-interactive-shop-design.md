# Interactive shop UI design

The user wants the entire Godot interface to work like a shop, grounded in the supplied Deep Space Pawn Shop screenshot. They explicitly chose: click equipment and open drawers/operation panels inside the main scene.

The front-facing pixel shop is the permanent home. Display cabinet, service window, terminal, bell, instrument table, repair cabinet, stock drawer, archive and day sign are real interactive targets. Hovering shows a restrained highlight, matching cursor and a short functional label. Keyboard focus and Tab should make the same targets reachable.

Keep the existing 56 goods, 9 residents, 21-day rules and saves. Integrate the new item art. Create an original pixel shop backdrop and matching resident portraits; do not reproduce the reference's exact scene, logos or characters.

Features open as framed in-scene workspaces; close/Escape returns to the same visitor, physical lot and pending quote. Inspection and repair retain the existing hands-on mechanics. Warehouse, orders and ledger remain functional. Transitions respect reduced motion. Underlying shop input is blocked while a workspace or modal is active.

Architecture: the root Shell retains its home page and hosts one embedded SubViewport Shell for the current workspace. The embedded Shell shares the Game autoload, uses a 1600x900 logical viewport, suppresses title/HUD/nav/ambient audio, and closes through its host when returning to counter. This reuses the verified page mechanics without changing their world-coordinate assumptions.

Alternatives: full separate screens would violate the selected interaction; rewriting every instrument into a new small widget would risk the existing mechanics. Reusing pages in an embedded workspace preserves working behavior while changing how it is presented.

Acceptance: visible targets correspond to their actual functions; a visitor/quote survives opening and closing a workspace; no click-through; Escape closes the top interaction; all functional pages, real item dragging/flipping, trading and orders pass; screenshots at 1280x720 and 1280x800; export and publish to the established GitHub Pages URL after validation.
