# Complete interactive PC shop

Execute inline; continuation explicitly authorized by user.

Goal: Complete the previously described counter interactions, reusing existing customer, bell, inspection, payment and receipt animation systems.
Architecture: A canonical showroom layout stores stable UID slots for cabinet/counter; actual ownership and storage transitions still use existing reducers. A PC scene-props component owns lamp, terminal feedback and cash-drawer visuals. Existing controls retain their behavior and economic rules.

- [x] Model: stable display/counter slots, swaps and validated cross-location placement; persistence, occupied slot, sold original and restricted inventory tests.
- [x] UI: drag original onto empty/occupied slots, cabinet on/off drop gating, paginated counter, direct shelf/return actions and physical movement animations.
- [x] Props: interactive lamp and terminal, cash drawer opening/closing tied to payment, customer click feedback; reduced-motion and modal/workspace guards.
- [x] Verify: focused tests, full native suite, real browser interactions and desktop screenshots, web export. No publish.

Review risks: stale drag payload, trade starts mid-drag, unavailable originals, closed cabinet, mobile orientation and rapid interactions. Preserve previous uncommitted changes.

Implementation notes:
- Cabinet/counter arrangement uses canonical UIDs. Cross-location placement delegates to DISPLAY so ownership, evidence, source and capacity restrictions are preserved. Existing saves receive stable slots; removing an original frees its slot without shifting neighbors.
- Existing customer, bell, inspection, cash-transfer and receipt animations were reused; lamp, drawer, drag/drop and terminal feedback were added. No fabricated inventory or visual-only purchases.
- Independent review found two issues: a closed-source cabinet bypass and controls covered by terminal housing. Both were reproduced and fixed; mouse events now reach the embedded drawer key, and closed-source/stale drag payloads are rejected. Existing cash-stack click still opens the ledger.
- The warehouse UI regression now counts actual original buttons separately from intentionally empty drop targets.
- Browser tests use an isolated generated save, real mouse drags and durable IndexedDB assertions. Cross-cabinet transfer, occupied-slot swap, tools and reload passed with no script errors. Seven packaging tests passed. Final full native run is recorded in work/counter-complete/suite-final.log.
- Return to a closed source cabinet opens its door before the original lands; the regression failed before the fix and passes after it.
- Shared Chrome preview opening was unavailable due to its tool sandbox error. Local server and independent Chromium verification succeeded.

Final verification: full native suite 124/124 passed; added closed-cabinet return regression passed afterward; real Chromium scene interaction checks passed; web export and 7 packaging tests passed; git diff --check clean. Changes remain in the current work branch without push or deployment.
