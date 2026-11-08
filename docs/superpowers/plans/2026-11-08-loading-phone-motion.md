# v16 corrective implementation plan

1. Capture the existing HTML loader and native phone actions; add behavioral regression checks before changing production code.
2. Replace initialization loader with the specified day-shutter theme, safe saved-day display, stage text, retry and reduced-motion support.
3. Give native phone instrument sheets a live item preview and localized existing instrument effects; preserve all tool completion rules and large targets.
4. Correct phone transfer/exit/repair/scan/coins regions; restore cash count-up, dialogue and item manipulation feedback without model mutations.
5. Verify real-engine motion frames, cleanup, reduced motion, phone workflows, rules, typecheck and final build. Review and publish v16 to the existing gh-pages root, then confirm Pages success.

No economic, ownership or save-schema change is intended. The previous v15 release remains the rollback commit.

## Verification record

- Baseline browser reproduced the initial blue loader, desktop-positioned phone handoff, absent phone tool preview and missing repair-step feedback.
- Initialization shutter passed saved-day, bounds and module-failure retry at three sizes. Native six-tool changing frames, preparation without economic changes, cleanup, arrival/exit geometry, three repair steps, exact transaction and reduced motion passed.
- Independent read-only review found no Critical/Important issues and reproduced AP float removal during ambient rebinding. Moved new floats after rebinding; native transaction regression now checks visible −1 AP and exact balances/ownership.
- Final typecheck, complete npm test, production phone workflow (667×375 / 844×390), desktop/portrait and pawn regression passed. dist/play v16 bundle, entry and version match; build hash b588efc98f2b2b7d8012f2209b12fd7ac8d2182f71cfedf116f45dc7ea8a9177.
- Physical mobile hardware remains unverified. Publication to the already authorized GitHub Pages target follows these checks.
