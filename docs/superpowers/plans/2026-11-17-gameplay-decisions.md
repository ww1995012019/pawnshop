# Gameplay Decisions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Connect shelf/list-price decisions to real commerce, derive player appraisals from evidence and make negotiation progress meaningful.

**Architecture:** Add focused pricing and evidence-appraisal helpers; Model remains the public compatibility facade. Negotiation owns the once-per-round counteroffer allowance. Implementers own disjoint helper/test files; controller alone edits model.gd and shared copy/runner integration.

**Tech Stack:** Godot4.6.3/GDScript, existing JSON saves, Python/Playwright verification.

**Spec:** `docs/superpowers/specs/2026-11-17-gameplay-decisions-design.md`

## Global Constraints

- Preserve all earlier UI work and existing saves/original UIDs; work in current managed cloud work branch.
- No new costs for quotation; keep atomic settlement and old confirmed prices.
- Shelf sale multiplier1.05 applies only to eligible displayed shop goods; list ask never raises NPC ceiling.
- Equal observable facts imply equal player estimate regardless of hidden truth or legacy appraisalValue. Unknown authenticity/function retain uncertainty; current-record count remains public.
- Each nonfresh negotiation turn costs at least1 willingness; fresh evidence helps only once. No hard3-round cap.
- Root alone edits model.gd, shell help/copy and native runner; agents do not commit shared state.

## Review Focus

- Repricing, removing/readding or reloading cannot refresh the same visitor's frozen ask or upgrade factors.
- NPC buy direction, merchant recovery, gray/forged goods and paid/locked promises retain their intended rules.
- Legacy snapshots retain readable evidence and cannot smuggle appraisalValue back into estimates.
- Normal readings can coexist with fake/stopped watches; output must not expose hidden fields through bounds or freshness.
- Duplicate OFFER/TRADE_REVIEW calls cannot increment counterquotes; legitimate evidence/concessions still support a useful multi-round discussion.

### Task 1: Commerce pricing

**Files:** new `godot/scripts/model/shop_pricing.gd`, relevant `godot/scripts/model/trade_session.gd` initialization, new `godot/tests/shop_pricing_test.gd`. Controller integrates pricing portions of model.gd.

**Interfaces:** helper `sale_multiplier(s,it)->float`, `listed_ask(it)->float`, `initial_quote(s,t,it,terms)->float`; keep Model.trade_terms public and freeze list ask with its shopPriceFactors snapshot. Helper can compose existing ShopUpgrades.sale_multiplier. Root applies Model instructions from report.

- [x] Write failing real reducer tests for5% actual sale increase, tag changes with fixed NPC ceilings, oversized ask safety, same-visit snapshot/reload, locked prices and exclusion cases.
- [x] Implement helper and batch initial quote integration; give root exact model hooks, without editing model.gd.
- [x] Run focused pricing/shop-upgrade/multi-item checks after root hooks land; preserve manually set listPrice on DISPLAY.

### Task 2: Evidence-only player appraisal

**Files:** new `godot/scripts/model/watch_appraisal.gd`, new `godot/tests/evidence_appraisal_test.gd`, directly superseded appraisal assertions in `godot/tests/watch_appraisal_test.gd`. Root integrates estimate/revision/record methods and explanatory copy in model.gd/shell/inspect page.

**Interfaces:** helper `estimate(it)->Dictionary` with existing low/high/exact/count; `revision(it)->String` contains observable state only; `observation(it,tool)->Dictionary` provides safe appraisal metadata as needed. Preserve nonappraisal snapshot fields consumed by provenance/NPC logic; do not rewrite NPC cognition.

- [x] Reproduce identical visible readings with changed hidden authenticity/function and assert equal estimates; poison old appraisalValue and verify ignored. Cover JSON reload and changed observed readings.
- [x] Implement conservative bounds from public model reference and recorded condition/physical observations, preserving ambiguity for authentic/function/hidden parts. No arbitrary binary cuts by tool count, no guaranteed shrink for redundant/normal evidence.
- [x] Keep unknown/legacy records safe; preserve existing private evidence/disclosure boundaries and free recheck behavior. Report exact root hooks and chosen bounds.
- [x] Run focused appraisal/forgery/evidence/inspection tests; update only obsolete strict-narrowing expectations with behavioral privacy/uncertainty checks.

### Task 3: Negotiation fatigue and contingent counters

**Files:** `godot/scripts/model/negotiation.gd`, new `godot/tests/negotiation_progress_test.gd`, directly obsolete expectations in `godot/tests/contextual_negotiation_test.gd`. Root replaces Model.counter_price body with delegation.

**Interfaces:** `counter_quote(s,t,it,terms)->float`; store once-per-valid-round movement/quote in existing per-UID negotiation state; missing legacy fields default conservatively.

- [x] Reproduce2Cr stepping exploit, then add stalled/duplicate/review-spam, both directions, new evidence and reload/locked cases.
- [x] Keep at least1 fatigue per nonfresh turn; bound counter movement by real relative concession (at most half player price movement and nominal3–6% cap) or one fresh-evidence allowance; first/stalled demands yield no free progression.
- [x] Cache each generated counterquote for its decision round so repeated reads/reviews are idempotent. Do not touch money/AP/ownership or other modules.
- [x] Run focused negotiation/counter-dialogue/batch tests after root hook integration.

### Task 4: Integration and verification

**Files:** `godot/scripts/model/model.gd`, explanatory text in `godot/scripts/app/shell.gd` and `godot/scripts/pages/inspect_page.gd` as needed, `scripts/test-godot-native.py`, targeted browser/fixture checks and plan record.

- [x] Integrate helper constants/methods and preserve old locked promises; inspect legacy snapshot freshness and NPC sharing interactions.
- [x] Update misleading copy about tool-count-only shrinking and shelf benefit to match actual mechanics.
- [x] Run all new tests and affected economic/negotiation/appraisal/atomicity groups; independently review implementation, fix actionable issues.
- [x] Run full native regression, rebuild Web preview, verify first-visitor inspection/quotation and shelf pricing using isolated saves; retain evidence and report precise limits.

## Final verification

- Full native suite:147/147 groups, zero failed, fresh run on final Godot source. Isolated saves and3 workers; same engine-error gate as repository runner. Evidence: `work/godot-tests-final/result.json` and per-group logs.
- New behavior regressions: pricing38 assertions, evidence appraisal20, negotiation59; all included in full suite.
- Independent review: both reproduced P2 issues resolved; unchanged literal old-format confirmed batches settle the original70Cr after JSON reload, changed originals remain blocked, A→B→batch preserves frozen70Cr. Scoped logo-compatibility review found no concrete issue.
- Web export succeeded; preview release `0eb60d3f778b5212`.
- Packaging7 tests, font1 and loading-layout4 all pass.
- Real first-visitor walkthrough at1440×900: initial/second recorded observations retain18–71Cr; AP12→11→11; offered20/22/24 produces counters46/45/45 and willingness6/5/4, with no cash movement. Evidence: `work/gameplay-first-batch`.
- Full appraisal/forgery/recheck/WebFS-reload flow passes at1600×900 desktop and844×390 touch phone. Evidence: `work/watch-appraisal-browser`, `/tmp/pawnshop-appraisal-scale-repro.log`, `/tmp/pawnshop-final-appraisal-phone.log`.
- One earlier concurrent browser run timed out at scale stabilization; exact cause was not reproduced. Final test uses named controls, waits for tool readiness, successful TARE and occupied-scale acknowledgement, and retains the same behavioral and persistence assertions. No product change was made for this isolated automation timeout.
- `git diff --check` passes. Changes remain in the existing work checkout; no commit, push or deployment was performed.
