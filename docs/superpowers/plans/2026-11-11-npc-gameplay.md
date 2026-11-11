# NPC Gameplay Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development and superpowers:executing-plans for the scoped tasks below. Work in place on codex/material-icon-grid; do not commit or push existing uncommitted work.

**Goal:** Interactive rent collection, persisted daily NPC quotas, contextual negotiation, and fewer screw operations.

**Architecture:** Keep the existing Commerce/Model reducers and physical counter. Add small model modules for daily visit scheduling, landlord state, and negotiation decisions. Shared files have explicit non-overlapping ownership.

**Tech Stack:** Godot 4.6.3, GDScript, existing native and Chromium tests.

**Spec:** docs/superpowers/specs/2026-11-11-npc-visits-rent-negotiation-repair-draft.md (approved in chat).

## Global Constraints

- Preserve the material icon grid, original transactions, source/forgery checks, and completed ledger entries.
- Rent remains 450/495/545 Cr on days 7/14/21, paid only through the visiting landlord; no duplicate settlement charge.
- Daily total visits are 3–10, persisted. Introductory days may reserve enough slots for existing mandatory teaching; ordinary days cover the full range.
- NPC decisions use NPC-known information and explicit evidence, not private item truth. No fixed negotiation round cap.
- Screw covers use two unscrew groups and two fastening groups; old action progress remains recoverable.
- Local changes only. No merge, commit, push, or deployment.

## Review Focus

- Save/load must not refresh daily quota, reroll a reaction, duplicate rent, or reset repair work.
- Mandatory landlord/police/merchant visits must not collide or exceed the quota.
- Negotiation refusal must not transfer goods or erase completed sales.
- Poor cash, zero AP and early settlement must still permit landlord contact and fund raising.
- Desktop and portrait counter must expose real payable-rent and negotiation states.

### Task 1: Daily visit schedule

Owner files: new model/visit_schedule.gd; Model.daily_visit_limit and its callers; commerce.merchant_slot; NightCrime scheduling/arrival limits; WantedCases.officer_slot; visit count labels. Do not change Model negotiation or rent settlement blocks.

Interface: Model.daily_visit_limit(s: Dictionary = {}) -> int, default no-state calls may retain legacy six for compatibility; live paths pass state. VisitSchedule.landlord_slot(s) -> int reserves the final slot on rent days (day divisible by seven); paid landlord handling belongs to root's Landlord service.

- [x] Add failing schedule tests covering 3–10 distribution, save stability, required slots and next-visitor accuracy.
- [x] Implement persistent per-day quota, compatible existing saves and required-visitor reservations.
- [x] Replace all runtime fixed-six assumptions and test affected scheduling rules.

### Task 2: Contextual negotiation

Owner files: new negotiation module; Model.trade_terms/counter_price and OFFER branch only; trade_session.gd; counter_dialogue.gd; counter_page.gd negotiation count line only. Do not change daily quota functions or SETTLE.

- [x] Test sane discussion beyond three rounds, immediate extreme refusal, evidence/provenance effects, no private-knowledge leak, and completed-trade preservation.
- [x] Replace fixed three-round caps with persistent per-item willingness, contextual counteroffers and explicit leave/refuse reasons in both paths.
- [x] Preserve valid price/budget validation, evidence identity, forgery detection, transaction consent and save compatibility.

Negotiation balance is deterministic and saved per physical item: station/merchant/salvage visitors start with 6/7/8 willingness. A concession of at least 2% of the NPC-known value offsets fatigue; a fresh relevant disclosed snapshot adds two willingness once (maximum ten). Ordinary stalled offers cost one; gaps over 50% cost two; extreme asks above twice the known ceiling or bids below 25% of the known floor cost three. Station visitors or contradictory known provenance can trigger immediate whole-visit departure on an extreme unsupported quote; salvage visitors normally warn once, and another distinct extreme quote ends the visit. Ordinary exhaustion refuses only that original. Known verified provenance adds 3% of known value to the ceiling; unverified/contradictory provenance subtracts 3%/6%. Public source statements are treated as claims, never automatic verification; inspection evidence does not certify legal origin. Repeated quote/snapshot requests are neutral and saved across reloads.

### Task 3: Screw groups

Owner files: watch_bench_art.gd and dedicated tests only.

- [x] Test two opening and two closing groups and progress restoration from old individual screw actions.
- [x] Implement grouped actions, correct screw visual state, cross fastening and existing operation guards.
- [x] Verify service, refurbishment and forgery consumers.

### Task 4: Landlord collection and integration

Owner: root. New landlord.gd; Model create/load and SETTLE/clearance blocks; Commerce interception before ARRIVE; landlord counter/report UI and dedicated tests. Do not modify Task 1 quota function or Task 2 negotiation blocks.

- [x] Test no silent/duplicate rent charge, landlord arrival, explicit payment, insufficient cash and same-day raising-funds flow, reload, and day 21 settlement.
- [x] Add a named landlord visitor, reserve final scheduled slot, allow settlement to request the landlord early, and keep existing same-day financial relief behavior.
- [x] Render payment/receipt/leave controls in the counter and rent status in the report.
- [x] Register new regressions and update obsolete fixed-rule tests.
- [x] Run full native suite, web build, focused desktop/phone scenarios and independent code review.


## Integration verification and decisions

- Full `npm test`: 74/74 native groups passed, plus seven packaging tests and font/loading checks.
- New focused groups cover 28 schedule assertions, 24 negotiation assertions, 384 grouped-screw/legacy-progress assertions, and landlord model/UI behavior.
- Chromium landlord arrival, payment at zero AP, single rent posting and departure passed on desktop1440×900, landscape844×390 and portrait390×844.
- Independent review found early landlord/inspection appointments could displace a merchant permanently. Both were fixed using persisted ordered slot exchanges; combined exchanges, old pending inspections and JSON reloads pass focused regressions.
- First three teaching days retain at least six slots; ordinary days use every quota3–10. Existing generated schedules retain their current appointments; rent-day legacy schedules reserve a seventh slot only where needed for new landlord handling.
- Rent uses existing 450/495/545 Cr dates. Deferral is within the current business day, enables legal emergency clearance without AP, and allows recalling the same landlord without another visit count. Explicit inability-to-renew is a player action, not an automatic debit or silent ending.
- In-flight individual legacy screw actions finish their current trajectory; remaining actions regroup without replay. Fresh bolt operations use exactly two opening/two closing groups.
- Rules remain in local uncommitted branch codex/material-icon-grid; no deployment or push.

- Final Chromium mechanical service walkthrough passed through cleaning, oiling, calibration, cover return and final closure. The existing recording-enabled harness lacked its optional ffmpeg binary; the same walkthrough ran without video recording. Final font check, Python compile and whitespace checks passed.
