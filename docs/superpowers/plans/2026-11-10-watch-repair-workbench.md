# Watch repair workbench implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Replace fixed repair minigames with persistent fault-driven watch service, accurate cleaning, and animated forgery at the repair bench.
**Architecture:** A JSON-saveable WatchService model owns deterministic faults, tasks, operation state and atomic costs. A reusable WatchBenchArt Control owns precise procedural tool/part animation and pointer interactions. RepairPage connects these to the existing reducer, workspaces, inspection and storage.
**Tech Stack:** Godot 4.6 GDScript, native canvas drawing, Python/Playwright.
**Spec:** docs/superpowers/specs/2026-11-10-watch-repair-workbench-design.md

## Global Constraints

- Keep 33 watch models and the existing three inspection tools and retro shop.
- Keep cleaning and add exactly five service types; remove generic coil/green-zone games.
- Persist fault draws, cleaning and operation progress. Do not invent new functional defects during migration.
- No production publish or shared push. Work in current task branch `work`, preserving existing draft.
- Only corresponding real repairs change function/parts; forgery never changes authenticity or true condition.

## Review Focus

- Legacy repaired and working watches must not become broken or receive mandatory repeat work (Task 1).
- Low-FPS fast wipe paths, transparent pixels and page/reload interruption must not strand cleaning (Tasks 2/3).
- Shared cover actions in forgery must not repair faults or charge repair fees (Tasks 1/3).
- Small phone viewport and orientation changes must preserve hit alignment and operation state (Task 4).
- New value/parts changes must invalidate prior observations and unfinished opened watches cannot trade (Task 1).

## Interfaces

`WatchService.ensure(it: Dictionary, seed := "") -> void` initializes `it.service` with profile, faults, tasks, done, opened, operations.
`WatchService.profile(it) -> Dictionary` exposes movement (`quartz`/`mechanical`), caseback (`screw`/`snap`/`bolts`).
`WatchService.tasks(it) -> Array`, `current(it) -> String`, `label(task: String, it := {}) -> String`, `step_cost(task, it) -> Dictionary` ({ap,materials}), `problem(state,it,task := "") -> String`, `finished(it) -> bool`.
Task identifiers: `dust`, `open`, `wash`, `replace`, `assemble`, `test`. Skip irrelevant ones with dependencies retained.
Reducer actions: `SERVICE_BEGIN` initializes selected inventory watch; `SERVICE_PROGRESS` ({uid,task,progress:Dictionary}) saves operations[task], including forge_logo/forge_serial/forge_weight; `SERVICE_COMPLETE` ({uid,task}) commits current task exactly once with costs; `SERVICE_FINISH` closes completed job without free blanket repair. No legacy REPAIR bypass.
`WatchBenchArt.configure(it:Dictionary, task:String, progress:Dictionary) -> void`, signals `progressed(progress:Dictionary)` and `completed`; methods `advance()`, `action_text()->String`, `hint_text()->String`. The native action button is an accessible equivalent of the current physical action; each action animates tool/part transitions. It reads service.profile but never mutates game state directly. Supports open/wash/replace/assemble/test and forge_logo/forge_serial/forge_weight. Dust uses ItemSprite and actual-alpha mask in the page.

### Task 1: Persistent service rules and migration
Files: create model/watch_service.gd and tests/watch_service_test.gd; modify game.gd, model.gd, commerce.gd and game_data.json. Owner: model component worker.
- [x] Write and run failing tests for deterministic compatible tasks, legacy preservation, task-specific effects, costs/idempotence, serialization, unavailable stock and opened trade guard.
- [x] Implement interfaces above and backup/migration, explicit per-model movement/caseback data, safe operation persistence and reducer routing.
- [x] Update obsolete model repair tests to exercise new legitimate service path; run relevant native tests.

### Task 2: Detailed tool/part animation surface
Files: create ui/watch_bench_art.gd and tests/watch_bench_art_test.gd. Owner: independent animation component worker.
- [x] Write and run failing headless interaction/state tests for operation progression, restore and distinct movement/caseback paths.
- [x] Draw sharp layered case, cover, screws, quartz/gear movement, parts tray and tools with contact-driven native interactions and timed result transitions. Implement all task codes and three forge operations.
- [x] Verify reduced motion, resize, local persistence, completion exactly once and no universal success particles.

### Task 3: Repair page and actual-alpha cleaning
Files: replace pages/repair_page.gd; add model/watch_cleaning.gd, tests/watch_cleaning_test.gd and repair interaction test. Owner: root.
- [x] Reproduce invisible-mask mismatch and write failing alpha/path/persistence tests.
- [x] Implement alpha-derived seeded grime, distance-based interpolated strokes and simultaneous completion tolerance (<=2% -> full clear); update same mask used for display.
- [x] Build work order and forge modes around Task 1/2 interfaces, save progress without rebuilding active controls, and show only relevant tasks/costs/blocked reasons.
- [x] Verify real input wiping and operation completion, state across resize and page/reload.

### Task 4: Warehouse, accessible bridge, help and browser regression
Files: warehouse_page.gd, web_touch.gd, shell.gd help, scripts/test-watch-service-web.py, affected native/UI tests.
- [x] Move warehouse forge execution to selected repair bench. Remove direct Web bridge forge commit; route to physical workbench only.
- [x] Expose meaningful service status and current physical action for accessibility/testing; update obsolete fixed-3 tests.
- [x] Build web, run full native and packaging checks and Playwright desktop/phone workflows; record complete repair and forge video plus screenshots.

### Task 5: Review and final verification
- [x] Fresh read-only whole-change review against spec and the five Review Focus conditions.
- [x] Fix important findings with a reproducing test, run affected checks and full relevant suite, inspect rendered frames.
- [x] Update spec status and verification report with commands, artifacts and limitations. Leave ready changes in task branch without publishing.
