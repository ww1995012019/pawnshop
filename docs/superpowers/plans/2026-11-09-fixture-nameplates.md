# Equipment Nameplate Placement

User request: inspect all similar labels and keep them within the physical borders that can accommodate them. Preserve the current retro shop style and publish the fix.

- Inspect fresh desktop and phone screenshots of the counter, customer state, all five workspaces, and representative modals.
- Replace the shared `button bottom - 32` label offset with explicit mounting strips for each illustrated fixture. Ledger uses the counter front rail; storage uses the door plinth; display uses its bottom frame; inspection uses the gauge lower bezel; repair uses its base; terminal/archive use their existing front bezel/spine. Hover-only bell label uses its own section of the counter rail.
- Keep the active item identification slip on one horizontal line within the same counter front rail; its previous two-line card crossed the lower edge.
- Fit type and padding inside those mounting strips. Highlight the mounted plate rather than drawing large corner markers across unrelated scenery. Keep the visible plate inside its clickable equipment area.
- Run existing layout/input/game/browser checks and inspect desktop/phone screenshots after the change. This is a reversible visual adjustment; use existing regressions and visual evidence rather than adding tests that repeat coordinates.
- Commit and publish with the previous live pack retained; confirm Pages deployment success.

Verification: fresh counter/customer/workspace captures at 1600×900, 1366×768, 844×390 and 667×375; all eight fixture hover plates and five representative modals inspected. The active-item slip now remains inside the rail. Existing native 24/24 groups, packaging 7/7 and font coverage pass. Existing real-browser desktop/audio and full phone-control/rotation regressions pass; final visual captures cover the subsequent typography and item-strip adjustment. Independent read-only review found no important issues.

Publication integration: remote main gained the 33-watch catalogue while this change was being prepared. Rebased this visual-only change onto that update, rebuilt the pack, and reran the integrated native and browser checks; do not deploy the earlier 15-watch build.
