# Wanted Gameplay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Link identifiable visitors, a movable six-person police notice, dialogue clues and guarded alarm rewards/penalties.
**Architecture:** A dedicated wanted_cases.gd reducer owns saved case state and integrates through Commerce. NPC and wanted portrait metadata remain data-driven. A non-modal paper control and counter integration consume the same six saved IDs.
**Tech Stack:** Godot 4.6, GDScript, JSON, generated pixel art, Python/Pillow.
**Spec:** docs/superpowers/specs/2026-11-09-wanted-gameplay-design.md

## Global Constraints
- 20 additional live residents, including one officer; 50 wanted profiles including 31 non-visitor portraits.
- Six stable unique entries, replace only captured entry. No auto identity verdict in UI.
- Preserve first-day tutorial, merchant reservations, schema4 saves, existing crime deck and pending branch work.
- Documents are inventory records separate from tradable watch inventory; non-modal placement persists.

## Review Focus
- Repeat report / save reload cannot duplicate money or reshuffle a notice.
- Old saves and full warehouses can receive the document safely.
- Only real case/visitor matches pay, multiple false reports are bounded by cash.
- Dragging and closing papers cannot activate underlying controls or lose the document.
- Offstage mugshots remain distinct and never pretend to be live character identities.

### Task 1: Cases and actor content
**Files:** godot/scripts/model/wanted_cases.gd, commerce.gd, game_data.gd; godot/data/new_residents.json, wanted_profiles.json; godot/tests/wanted_cases_test.gd.
**Interfaces:** WantedCases.ensure(s), visitor_override(s,reserved_slot), reduce(previous,action), wanted_profile(id); state.documents and state.police are JSON-only.
- [x] Add failing tests for initial issue, six entries, idempotent arrests and penalties, local replacement, persistence and random encounter coverage.
- [x] Generate residents and profiles; implement pure action guards and deterministic schedules and dialogue; integrate Commerce and old-save normalization.
- [x] Run model tests and document choices in work/wanted-gameplay/progress.md.

### Task 2: Original portrait assets
**Files:** generated art-source masters; godot/tools/prepare_wanted_art.py; godot/assets/atlas/shop-residents-new*, wanted-faces*; ui_kit.gd; godot/tests/wanted_art_test.gd.
**Interfaces:** CHR-014..CHR-033 occupy 5x4 256px cells; 31 offstage faces use their own atlas. Every wanted profile resolves to an exact portrait.
- [x] Generate 20 matching character busts and 32 offstage faces (use 31), inspect and import with bounded silhouettes.
- [x] Add failing coverage/unique-cell checks, wire the two atlas families and cropped live face references.
- [x] Verify imported art, portrait identity links and packaged assets.

### Task 3: Alarm, dialogue and movable paper
**Files:** godot/scripts/ui/wanted_notice.gd; app/shell.gd, app/game.gd; pages/counter_page.gd, warehouse_page.gd; tests/wanted_ui_test.gd; native runner, font subset and docs.
**Interfaces:** shell.toggle_wanted_notice(), shared paper revision, police actions ISSUE_WANTED/REPORT_VISITOR/ASK_VISITOR/TOGGLE_NOTICE/MOVE_NOTICE.
- [x] Add failing issue/open/drag/close/dialogue/report and no-click-through tests.
- [x] Add officer presentation, on-counter alarm, document inventory access and paper drag/save behavior; arrest response finishes before next visitor.
- [x] Run full npm test, font coverage, Web build and browser checks for desktop and touch; inspect screenshots and review final diff.
