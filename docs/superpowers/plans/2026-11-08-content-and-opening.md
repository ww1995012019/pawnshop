# Content Expansion and Shutter Opening Implementation Plan

> **For agentic workers:** Use disjoint parallel tasks under superpowers:dispatching-parallel-agents. Preserve all existing v14 working-tree changes. Root integrates and verifies; no push or publication is requested.

**Goal:** Deliver 20 usable goods, richer people, daily choice events and a day-shutter opening screen.

**Architecture:** Extend native Cocos presentation and existing typed content. Keep economic mutations inside the reducer, centralize shared event eligibility, reuse shutter drawing for opening and day change.

**Tech Stack:** TypeScript, Cocos Creator 3.8.8, pinned build chain, generated transparent PNG atlases and Playwright acceptance.

**Spec:** `docs/superpowers/specs/2026-11-08-content-and-opening-design.md`

## Global constraints

- Retain v14 phone layout, schema 3, six visitors / day and existing economic / ownership rules.
- New item IDs ITM-081…ITM-100, new NPC IDs CHR-006…CHR-009, new orders ORD-025…ORD-032.
- Existing unfinished code belongs to earlier authorized work; never reset or overwrite it.
- Do not hand-edit generated play/game.js; use build:pages at integration.

## Review focus

- Old 12 / 24-order saves retain records, customer originals, locked quotes and money.
- Event affordability, material capacity, phase and current trade gates apply atomically; duplicate / stale choices do nothing.
- New portraits use their own art; item faces occupy unique, nonempty cells and stay within inspection bounds.
- NPC purchase conditions agree in UI, selection, acceptance and handoff.
- Opening shows saved day and keeps accessible start/new/help/settings controls on phone and desktop.

### Task 1: Root — goods, people, assets and UI integration

**Files:** `data.ts`, new `ContentExpansion.ts`, `People.ts`, `Negotiation.ts`, `Market.ts`, `ItemReadings.ts`, `OrbitalUI.ts`, relevant Main methods outside opening; item / people PNG and metadata.

- [x] Write content reachability, NPC conditions, art and migration tests; observe old content counts fail.
- [x] Generate, inspect and integrate 20 front/back sprites plus four new character portraits.
- [x] Add definitions, eight repairs/orders, character profiles and phase-specific dialogue; preserve original visitor slots.
- [x] Integrate event sheet and people dossier in native UI; run relevant tests and screenshots.

### Task 2: Event worker — daily choice model

**Files:** new `StationEvents.ts`, event fields/action in `types.ts`, `model.ts`, new `scripts/test-station-events.mjs`.

**Interfaces:** `stationEvents`, `eventForDay(seed:string,day:number)`, `eventAvailability(state,choice):string|null`, `StationEventChoice`, `StationEventRecord`; action `{type:'CHOOSE_EVENT';eventId:string;choiceId:string}` and `state.events:StationEventRecord[]`.

- [x] Implement 21 distinct days with three explicit choices each, with explicit effects and result text.
- [x] Test atomic costs/rewards, duplicate/stale selection, active trade, bounds and 12/24-order schema 3 migration.
- [x] Implement and verify; do not touch data.ts or UI files.

### Task 3: Opening worker — shared shutter

**Files:** new `DayShutter.ts`, `OrbitalMotion.ts:dayTransition`, `OrbitalMain.ts:showTitle/startFromTitle` only.

- [x] Extract reusable metal shutter / hazard edge / day-plate drawing.
- [x] Replace title composition with day-shutter style, saved day and current phone control sizes.
- [x] Preserve existing actions and confirmation; verify typecheck and provide a browser acceptance check.

### Task 4: Root — integrate and verify

- [x] Run all tests, typecheck, build:pages and native phone workflows.
- [x] Inspect new sprite grid, new visitors, day/event sheet and opening on desktop and phone.
- [x] Obtain fresh code review, fix material issues, record outcomes and update version / docs.


## Execution and verification — 2026-11-08

- Pulled the remote baseline first; preserved the complete v14 phone worktree throughout this expansion. No commit, push or deployment was requested during implementation; the subsequent user turn requests the existing GitHub Pages target.
- Baseline tests observed the original 36-goods count, incomplete 21-day reachability and missing new-customer conditions before implementation. Final content tests cover 56 goods, nine characters, 32 orders, eight new repairs, model-specific readings, stable dialogue and old saves.
- Event worker delivered 21 seeded daily events, three choices per event, shared availability and atomic reducer effects. All 19 targeted event cases and the complete npm test chain pass; schema 3 migrations preserve customer originals and valid locked quotes.
- Shared shutter opening passed 1600×900, 667×375 and 844×390 checks for saved day, title actions, reset cancellation, help/settings, Enter, skip, day change and reduced motion.
- Independent review found uneven character source rows and faint transparent background residue. The importer now locates the true transparent gutter and removes alpha below 16 before trimming/padding. A regression first reproduced cut crowns and now passes. Root also reproduced the fallback item hit bounds caused by missing ID zero-padding, corrected the generator and verified all 112 faces.
- Actual Cocos production-browser acceptance passed event costs/results/history/reload, dossiers and needs, new goods front/back and all four visitors. Final phone acceptance passed full business workflows, 667×375 / 844×390 touch targets, desktop layout, portrait input/drag and pawn redemption.
- `npm test`, `npm run typecheck`, `npm run build:pages` and `git diff --check` succeeded. dist/play v15 entry, bundle, version and all new WebP files match byte for byte. Evidence: `/workspace/scratch/content-v15/review.html`, logs alongside it and `/workspace/scratch/shutter-opening/`.
- Physical mobile hardware, editor import and new skeletal/face animation are outside the verified scope.
