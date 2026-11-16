# Continuous paper and responsive counter

**Goal:** Remove the reported paper color blocks, repeated drawer borders and desktop black bars while retaining complete controls and undistorted live actors/items.

**Evidence:** Current counter and warehouse reproduced and captured at `work/continuous-paper/01-before-counter.png` and `02-before-warehouse.png`. Narrow donor strips are tiled into folio backgrounds; the same full framed texture is stretched into nested workspace panels. Fixed desktop artwork leaves large side bars at 1920×910.

**Approach:** Separate plain paper grain from panel outlines, reuse existing clean comic paper assets, and keep one border per panel. Reflow the desktop's paper column and center counter space to the viewport; stretch decorative wall/felt/header backgrounds only, preserving live portrait/watch proportions and canonical saved slot coordinates. Retain mobile layouts and transaction rules. Continue the user's authorized push/publication workflow after verification.

- [x] Add regressions proving the plain paper has no baked frame and the desktop fills the viewport while retaining full edge controls.
- [x] Correct shared paper rendering, clean quick-list backgrounds, and warehouse drawer chrome. Check all main workspaces for unintended nested frames and overflow.
- [x] Reflow desktop scenery, folio, footer, table positions and drop targets. Keep actual inputs and saved item positions consistent through resize.
- [x] Build and capture before/after at 1920×910, 2048×1018, 1920×1080, 1440×900, 2560×1080 and DPR 2. Check populated/empty/single/many-item trade states, drawer selection/scroll/drag, and other workspaces. Run native and browser checks and independent review.
- [ ] Push source and matching tested release, retain prior published assets, and verify the exact Pages deployment succeeds.

## Verification notes

- Paper/frame and full-viewport regressions reproduced the original defects before changes.
- Independent review found two additional important issues: stretching the old non-trade folio misaligned painted/live content, and an RGB/RGBA stock-background blit failed. Both have new regressions observed failing before correction and passing after it.
- The source-coordinate native test now explicitly uses its documented 1920×1080 reference viewport. The default headless window is 64×64, which intentionally gets an expanded vertical layout and is not a source-coordinate reference.
- Actual blank trade-paper bands differ by at most 0.70/255 RGB units at 1920×910, 2048×1018 and 1440×900. Both footer edges reach the viewport. Populated warehouse, inspection, repair, orders and ledger screenshots were inspected; opening/closing them preserves cash/AP. Evidence: `work/continuous-paper/visual-results.json` and `final-*.png`.
- Final `npm test` exits 0: 130 native groups, seven packaging checks, one font check and four loading checks. The exact staged release passes all seven desktop/DPR browser checks, including both outer footer edges and real mouse actions.
- Actual two-original quote/select/inspect/checkout/reload, 0/1/4/15/16-item lists, explicit withdrawal and closed/merchant/landlord states pass. A real mouse drag at 1920×910 moves the chosen original into an empty canonical slot; reload retains that slot, cash and AP. Native mobile coverage and the DPR 2 phone startup/touch check pass.
