# Gameplay Second Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox syntax for tracking.

**Goal:** Give service quotes a real cash/trust tradeoff, refresh only affected evidence, and base endings on recorded achievements.

**Architecture:** Extend existing contract/journal rules; centralize per-channel appraisal freshness; add a pure campaign evaluation helper. Controller alone integrates Model and shared UI files; independent helpers/tests are implemented in parallel.

**Tech Stack:** Godot4.6.3/GDScript, existing JSON saves, Python/Playwright.

**Spec:** `docs/superpowers/specs/2026-11-17-gameplay-second-batch-design.md`

## Global Constraints

- Preserve all dirty earlier UI/first-batch changes in this managed work checkout; no commits/pushes/deployment requested.
- Contract bands floor75%/floor90% budget yield total delivery trust2/1/0 within existing caps. Standard default; old approved contracts retain exact agreement and reward behavior.
- Only successful delivery earns new-contract trust; normal repair history persists; quoting never moves cash/AP/originals.
- Freshness contains only the corresponding public physical observation; condition is independently recorded, any free recheck can refresh it. Private trade_revision stays unchanged.
- Risk>=60 retains high-risk ending;3 completed repaired originals or3 inspected rare public model types establish specialties, larger count wins, repair wins ties; otherwise new successful ending稳健旧货铺. Existing saved outcomes never change.
- Evaluation is pure, UID-deduplicated and conservative for legacy evidence; net cash flow is not profit.

## Review Focus

- Approval/reload/expired legacy contracts cannot acquire or duplicate trust rewards; cancellation cannot farm repair-stage trust.
- Safe first-batch observations remain valid per channel without converting older hidden-value snapshots; no hidden-truth freshness side channel.
- Changing wear cannot invalidate unaffected channel counts or silently reuse obsolete recorded wear for narrow estimates.
- Sold/delivered originals count from retained records once; superficial refurbishment and customer/owned duplicate views do not inflate maintenance.
- A21-day saved assessment stays immutable in endless play; new generic success can continue and failures cannot.

### Task 1: Contract cash/trust terms

**Files:** service_contracts.gd, shop_journal.gd; new service_quote_tradeoff_test.gd and affected contracts/journal tests. Controller owns shop_plan.gd.
**Interfaces:** public `ServiceContracts.quote_terms(contract,price)->Dictionary` returns band/label/trust/thresholds; `contracts(s)` exposes frozen terms and public thresholds for UI. Keep existing reducer actions and ledger metadata.

- [x] Write real quote/repair/delivery tests: threshold boundaries,2/1/0 total trust, current-cash difference, cap, cancellation/expiry, duplicate/reload, hidden state parity and preserved old approvals.
- [x] Observe RED, implement deterministic terms and new-contract delivery-only trust, preserving repair history and ordinary/legacy repairs.
- [x] Verify contracts, journal, warranty, repair guards and integration groups with repository error gate; report exact UI dictionary fields and Model hooks if any.

### Task 2: Independent evidence channels

**Files:** watch_appraisal.gd; new inspection_channels_test.gd; affected native appraisal/inspection/evidence tests; test-watch-appraisal-web.py. Controller owns Model and InspectPage.
**Interfaces:** `WatchAppraisal.channel_revision(it,tool)->String`, `channel_current(it,tool)->bool`; existing estimate returns low/high/exact/count plus `conditionCurrent:bool`. Controller exposes Model.inspection_revision/current delegates.

- [x] Write RED tests for logo/serial/mass-only invalidation, safe legacy records, free single-channel refresh after wear, hidden truth parity, reloaded stale readings and explicit NPC disclosure.
- [x] Implement channel fingerprints from corresponding physical fields and visible trace; exclude global reading suffixes which describe unrelated channels. Keep aggregate revision compatibility and old trade signature intact.
- [x] Keep count of valid channels separate from recorded-current-wear; broad bounds if wear not recorded, tighten after any explicit recheck. Report exact Model/InspectPage hooks.
- [x] Update obsolete all-stale tests and web flow to recheck only loupe after logo forge, persist per-channel snapshots; verify focused appraisal/forgery/negotiation/evidence groups.

### Task 3: Recorded campaign achievements

**Files:** new campaign_evaluation.gd, campaign_life.gd, report_page.gd; new campaign_evaluation_test.gd and affected life/report tests. Controller owns Model and shop_plan.gd.
**Interfaces:** pure `CampaignEvaluation.summary(s)->Dictionary` with version, repairsCompleted, fulfilledOrders, repairDeliveries, inspectedModels, rareModels, netCashFlow, cash, risk, outcome, reason, evidenceNote; `outcome(s)->String`. `CampaignLife` preserves `report.evaluation` in first assessment. Controller calls summary at day21 settlement.

- [x] Write RED tests for real completed maintenance versus unfinished/refurb steps, UID deduplication across ledger/jobs/history, fixed/rolling fulfillment, rare public model breadth, route thresholds/ties/risk, ledger sum, pure JSON/repeated reads, and generic/legacy/endless continuation.
- [x] Implement conservative read-only metrics and explicit route selection; add generic success to continuation list, preserving saved old outcomes and first snapshot.
- [x] Show scrollable evaluation/criteria in report and ending; provide controller the shared shop-plan overview insertion. Verify evaluation/life/ledger/report groups.

### Task 4: Shared integration and verification

**Files:** model.gd, inspect_page.gd, shop_plan.gd, shell.gd/watch_manual.gd copy, native runner and docs.

- [x] Integrate channel delegates, explicit disclosure gates and UI freshness/attempt keys; show independent wear-record prompt and free single-tool update.
- [x] Integrate contract quote terms/form descriptions and default; overview evaluation/criteria; day21 outcome+evaluation snapshot. Update misleading help text.
- [x] Register3 new tests; inspect each task diff and reports, independently review final behavior and resolve actionable findings.
- [x] Run focused and full native checks, rebuild Web, packaging/font/loading checks and actual desktop/touch-phone regression; record exact coverage and limitations.

## Verification receipt

- All task behavioral RED→GREEN evidence and scoped review reports are in `.superpowers/sdd/gameplay-second-batch/`.
- `npm test` passed on the initial integrated implementation:150/150 native groups, animation/watch/comic asset checks, packaging7, font1, loading layout4. A subsequent real phone test exposed a UI lifecycle error not covered by that suite.
- Added `shop_plan_touch_lifecycle_test.gd`: a real ScreenTouch with mouse emulation reproduced `can_process` on a detached control, despite successful business assertions. Deferred/coalesced ShopPlan change rendering resolved it. Scoped reviewer verified RED→GREEN and final clean review.
- Final full native run on the corrected Godot source:151/151 groups, zero failed. Uses the same repository engine-error gate, separate XDG saves and3 independent workers. Evidence: `work/godot-tests-final/result.json`, `/tmp/pawnshop-second-final-native.log` and per-group logs. Known shutdown-resource notices remain accepted by the repository gate.
- Final Web export:2ae1d3028cc3b316. Packaging7, font1 and loading-layout4 rechecked after the final export, all pass. No Godot source changes followed this export/run.
- Desktop: real preset switching and approval, no cash/AP movement; loupe-only refresh retaining exact UV/weight snapshots; real repaired-original assessment despite opposing faction relation, continuation to day22 retaining exact evaluation/cash. Initial integrated walkthrough evidence: `/tmp/pawnshop-second-web-final.log`; post-lifecycle-fix desktop quote exit0: `/tmp/pawnshop-second-web-desktop-final.log`.
- Dedicated real desktop3-tool→animated logo forgery→only loupe recheck→WebFS persistence→reload flow exit0: `/tmp/pawnshop-second-appraisal-web.log`.
- Post-fix phone quotation is clean in `/tmp/pawnshop-second-web-phone-verified.log`. Its subsequent combined-fixture persistence wait timed out once and was not diagnosed from its uncaptured prior row. A fresh-context evidence/ending probe then exited0 with both persisted recheck and exact historical assessment assertions: `/tmp/pawnshop-second-evidence-probe.log`. No product save bypass or fault was demonstrated; Game.save writes/closes before observers.
- Browser harness now separates quote and follow-up WebFS lifetimes, waits for actual modal controls before using the general locator, reads the exact injected save key, and records the last save/step/key on timeout. It serves only the plain-text fixture page's automatic favicon fallback locally; all game asset/runtime errors remain failures. These setup changes do not modify product behavior.
- Screenshots: `work/gameplay-second-batch/browser/`; native-generated isolated saves: `work/gameplay-second-batch/fixtures.json`.
- `git diff --check` passes. Existing dirty UI/first-batch changes preserved; no commit, push or production deployment.

Final exact-key isolated phone follow-up command also exited0: `python3 scripts/test-gameplay-second-batch-web.py --phone-only --followup-only --reuse-fixtures`. Both persisted single-tool refresh and frozen assessment→day22 assertions pass without engine errors. Log: `/tmp/pawnshop-second-web-phone-followup-final.log`. The harness supports quote-only/followup-only modes and defaults to separate processes for their WebFS lifetimes.
