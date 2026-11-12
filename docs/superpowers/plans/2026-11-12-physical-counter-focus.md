# Physical counter focus

Goal: Make the selected original the center of hands-on trading, retaining existing goods, prices, drag state, mobile layout, and handoff animation.

- Display the same selected sprite on a central work mat at 144 scene pixels high; arrange remaining originals in compact trays on each side. Canonical inventory/table positions remain in model coordinates.
- Preserve UID, selection, flip state and saved placement; translate desktop drags back to their original model positions. First click selects, subsequent drag moves the focused original.
- Put an instrument-shaped inspection key below the work mat, with keyboard focus and an explicit accessible label. Hide it behind workspaces or during handoffs.
- Verify all originals have separate hit targets with eight visitor and eight player goods, focus switching retains sprites, and mobile presentation remains bounded. Run existing trade, handoff and layout regressions and inspect native game screenshots.
