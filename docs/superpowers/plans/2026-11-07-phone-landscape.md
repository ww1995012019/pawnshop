# Landscape Phone Controls Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans. Implement in this existing task checkout and preserve reviewable source changes.

**Goal:** Make the landscape phone game readable and reliably tappable.

**Architecture:** Add a small native Cocos phone UI helper and phone workspace renderer. Integrate these into the existing host; all mutations continue through the original reducer and existing validation helpers. Desktop rendering remains the existing path.

**Tech Stack:** Cocos Creator 3.8.8, TypeScript, existing esbuild pipeline and Playwright touch acceptance.

**Spec:** `docs/superpowers/specs/2026-11-07-phone-landscape-design.md`

## Global Constraints

- Retain Cocos, current art, schema 3 saves, model actions and economic/ownership checks.
- At least 44 CSS pixels for primary touch controls at 667×375 and 844×390.
- Large phone UI only for the existing phone/coarse-pointer classification; preserve desktop and tablet paths.
- Keep generated `play/` in sync through the build pipeline, never hand-edit its JavaScript.

## Review Focus

- Modals isolate background actions and cannot duplicate trade/order commits.
- Touch-assisted instrument interactions retain actual completion conditions and first-inspection AP semantics.
- Inventory pagination keeps selected UID and exact ownership, including customer originals and paired deliveries.
- Reduced motion, title/new-player help, and large-text settings remain usable.
- Rotated portrait and wide/narrow landscape frames keep controls inside the canvas with safe margins.

### Task 1: Shared phone surfaces and navigation

**Files:** Create `assets/scripts/orbital/PhoneUI.ts`; modify `OrbitalUI.ts`, `OrbitalMain.ts`, `Guide.ts`.

- [x] Add touch browser acceptance assertions for minimum primary target size; run against the original build and observe failure.
- [x] Add shared 108/110-high native controls, full-size sheets and paginated item selection.
- [x] Add phone header, footer, title, help and safe margins without changing desktop.
- [x] Verify native touch navigation and modal close/cancel at both phone sizes.

### Task 2: Phone workspaces and instrument actions

**Files:** Create `assets/scripts/orbital/PhonePanels.ts`; modify `OrbitalPanels.ts`, `OrbitalMain.ts`.

- [x] Implement counter/quote and inspection controls using original state, drafts and actions.
- [x] Implement phone inventory, repair, orders, daily report and preferences; reuse original order-reason and companion validation.
- [x] Verify touch-assisted evidence gathering, correct AP, locked quote handoff, exact item order delivery, and no mutation on cancelled confirmation.

### Task 3: Integration and delivery

**Files:** Update `README.md`, `docs/validation.md`, `scripts/build-web.mjs`, generated `play/`.

- [x] Run `npm test`, `npm run typecheck`, `npm run build:pages` and inspect outputs.
- [x] Capture fresh 667×375, 844×390, portrait-rotated and desktop evidence; inspect screenshots and fix observed clipping/overlap.
- [x] Obtain final code review, resolve material issues, and report verified scope and real-device limitations.

## Execution record

User selected landscape in response to the concrete mobile-layout proposal. Execution continues without another confirmation round. The existing `work` checkout is clean and already dedicated to this task; retain it for visible edits. Browser evidence and execution logs are in `/workspace/scratch/mobile-audit/`.


Verification record: minimum-target regression failed on v13 navigation, then passed on phone controls. Native UV redraw regression reproduced background navigation above the modal; craft-stage regression reproduced inaccessible prerequisites. Both passed after fixes. Full native touch flow, exact-UID customer delivery, typed quote, craft consumption, pawn redemption, portrait remapping/drag, DPR2 and desktop checks passed. Final focused checks cover first-phone help and stale notification cleanup. Independent review: three Important issues fixed; phone-specific manual copy updated. No model/save-schema changes or deferred review findings.
