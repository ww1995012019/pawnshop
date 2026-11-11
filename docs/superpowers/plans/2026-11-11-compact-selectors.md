# Compact selectors

The user highlighted oversized ledger date/type filters and requested smaller controls plus a careful audit.

- [x] Replace independent OptionButton sizing with a shared UIKit factory: 30px/14pt in phone landscape, 36px/15pt in portrait, compact padding, and menus with matching typography and bounded dimensions.
- [x] Use 160px-wide ledger filters with an 8px gap; convert order and inspection selectors to the same sizing rules.
- [x] Refresh existing selectors on shell relayout as well as control resize and menu opening; clamp desktop-created selectors to phone widths after rotation.
- [x] Verify 154 focused native geometry/rotation assertions, existing mobile panel and portrait regressions, and the project test command (82/82 native groups plus packaging/font/layout tests).
- [x] Inspect real Web screenshots at four phone sizes using DPR 2 and 319 ledger records. Date/type menus open, touch selection reduces the table to 40/319 entries, and the final portrait rotation smoke check confirms 36px filter height.
- [x] Independent read-only review found no actionable issue, including the final relayout refresh.

Publish the correction to the existing GitHub Pages deployment under the user's ongoing deployment authorization.
