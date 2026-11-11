# Cross-day Shop Events Implementation Plan
> **For agentic workers:** Use the parallel-domain workflow for independent model modules and root integration, then independent final review.
**Goal:** Deliver playable claim, warranty and auction event chains with previews, ongoing status, refusal, cooldown and deployment.
**Architecture:** Three isolated saved-state reducers compose in Game before Commerce. Root integrates a compact event book, shared notifications, journal and native/Web regressions.
**Tech Stack:** Godot4.6.3/GDScript, native regression runner and Playwright.
**Spec:** docs/superpowers/specs/2026-11-11-story-events-design.md
## Global Constraints
Preserve save path, original UIDs/serials/parts, financial/AP truth, customer ownership and locked trades. No truth leaks or view/reload side effects. No new permanent toolbar or forced daily popup. Both phone orientations must fit one vertical scroller.
## Review Focus
- Repeat/refused/expired actions and reload: no duplicated goods, deposits, refunds or rewards.
- Full warehouse or money spent between bid and settlement: atomic original/cash state, cancellation remains possible.
- Historical/returning customer original: identity and service provenance remain exact; no invented prior service.
- Physical work before resolution/after expiry: safe closure and honest guard reasons, no free completion.
- Existing day21/report/CrimeEvents/merchant/customer flows continue unchanged.
## Tasks
- [x] T1 Claims module: claims ensure/view/reduce/observe, failed-first tests then green for identity evidence, two claimants, refusal and safe station handoff.
- [x] T2 Warranty module: completed-service snapshot observation, exact-original return, fresh reinspection, free/paid/refund/refuse resolution, repeat/ownership tests RED→GREEN.
- [x] T3 Auction module: saved preview/original, two paid tool observations, budget/rival rounds/deposit/purchase/refund, capacity and replay tests RED→GREEN.
- [x] T4 Root composition/UI: Game bootstrap/reducers/observers and journal, event book preview/ongoing/archive, counter discoverability. Fail-first integration/UI tests then phone+desktop checks.
- [x] T5 Independent review, fix important findings, full native suite + packaging/fonts/loading, real Web touches and screenshots.
- [ ] T6 Commit source, immutable pack, retain published assets, atomically push main/gh-pages and verify Pages success.

## Verified
Complete npm test:99/99native groups, art2, packaging7, font1, loading2 pass. Final focused integration and populated UI checks pass after review and input-width fixes. Final Web pack: paid physical preview inspection, budget admission, three actual bids, exact-original purchase/full-price/deposit accounting, and populated active/upcoming/archive controls at844×390,568×320,390×844,1280×800 pass with no script/shader errors.
