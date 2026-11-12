# Shop Expansion Implementation Plan

**Goal:** Implement all accepted ideas: understandable evidence/disabled-action feedback, post-day-21 play, customer memory/referrals, bulk salvage purchases, staged repair contracts, weekly market forecasts, collection/item history, meaningful shop expansion choices, and settlement receipts.

**Architecture:** Keep the existing reducers and physical-item rules authoritative. New focused model modules expose `ensure`, pure previews and reducer actions; Game routes new commands and records journal events. Root integrates a compact ShopPlan modal plus existing counter/report/catalogue views. Legacy saves migrate additively. Legacy reducer-only states retain their original 21-day semantics until continuation is explicitly chosen.

**Tech Stack:** Godot 4.6.3 / GDScript; native tests and Playwright Web regressions.

**Spec:** User accepted the complete proposal in the conversation on 2026-11-12 ("都做一下吧").

## Global constraints
- Preserve inventories, cash, originals, outstanding contracts, forensic observations and existing save paths.
- No truth leaks: collection/history/NPC knowledge only show recorded or publicly visible facts.
- No payment, AP use, preview reroll, duplicate receipt or item duplication from opening a view, reloading, repeating an action, or invalid input.
- Keep law/provenance and customer-owned repair restrictions intact.
- Keep phone controls compact and long content in one vertical scroller; do not add a permanent strip of buttons.
- Publish after native, Web, migration and independent review checks under ongoing deployment authorization.

## Review focus
- Existing day-21 report/ending save resumes without charging settlement twice; bankrupt endings cannot resume.
- Weekly boundaries, repeated previews and reloads preserve offers and explicit forecasts.
- Bulk capacity/cash failure is atomic; sampled originals remain the exact purchased originals.
- Expired/declined repair jobs return the customer's original and cannot become saleable stock.
- Mixed checkout receipts allocate acquisition/material/power costs per original without double-counting ledger expenses or fabricating historical costs.

## Tasks
- [x] T1 (root): additive campaign continuation, integration hooks, contextual feedback and planning UI. Endless state namespace `campaignLife`.
- [x] T2 (journal agent): ShopJournal model for remembered customers/referrals, collection, item timeline and honest receipts; tests.
- [x] T3 (market/growth agent): WeeklyMarket and ShopUpgrades models, exact preview and persistent exclusive extension effects; tests.
- [x] T4 (bulk agent): BulkCrates model for deterministic merchant lots, two paid samples and atomic purchase; tests.
- [x] T5 (contracts agent): ServiceContracts model for diagnosis, approval, physical repair and return stages; tests.
- [x] T6 (root): wire new systems into Game/Model, storage geometry, NPC prices/visits and a compact ShopPlan modal; evidence and disabled-action feedback; catalogue/journal and receipts.
- [x] T7: per-module review, cross-system integration tests, full project tests, Web screenshots at phone/desktop sizes and save/continuation tests; fix findings.
- [ ] T8: commit source, build immutable release retaining prior assets, atomic push main/gh-pages and verify Pages deployment success.

## Execution
Parallel module work is authorized by the applicable dispatching-parallel-agents and subagent-driven-development skill workflows. Workers own only their new modules/tests and never edit shared integration files, commit others' changes or spawn agents. Root owns integration; progress/briefs/reports are in `work/shop-expansion/`.

## Verification evidence
93 native groups pass using the complete suite and corrected/new focused reruns. Packaging (7), font coverage (1), loading layout (2) pass. Final Web planning controls and six sections pass real touch checks at 844×390, 568×320, 390×844 and the 1280×800 desktop layout. Independent review and follow-up report no remaining blockers. Fixed findings include workshop event AP truncation, endless rent countdown, contract approval UI, bulk receipt attribution and empty evidence-control cleanup.
