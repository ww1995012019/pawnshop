# Watch Catalogue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add 18 watches and organize all 33 models into low, mid and luxury tiers visible in the manual and item details.
**Architecture:** Keep watch category and old IDs stable; add tier metadata, catalogue-derived atlas geometry, new model data and recipes. Existing market shuffling supplies the expanded catalogue.
**Tech Stack:** Godot 4.6, GDScript, JSON, Python/Pillow.
**Spec:** docs/superpowers/specs/2026-11-09-watch-catalogue-design.md

## Global Constraints
- New watches: six per tier, 18 total; old 15 remain compatible.
- Tier labels: 低等、中等、名贵. Tier is model information, not authentication.
- Work on user-selected feat/next-changes. No publish or remote push.

## Review Focus
- Old item IDs and saved physical measurements remain stable.
- Added watches have unique complete front/back cells and variant marks.
- Every new item can be generated, valued and repaired.
- Model selection after tier separators uses the correct item ID.
- Manual browsing changes neither game state nor evidence.

### Task 1: Expand and classify the playable catalogue
**Files:** data/game_data.json, data/watch_art.json, scripts/generate-watch-art.py, scripts/app/ui_kit.gd (Godot paths), tests/watch_catalogue_test.gd, tests/watch_rules_test.gd, tests/watch_art_test.gd, tests/export_assets_test.gd.
**Interfaces:** tier values low/mid/luxury; GameData.tier_label(id: String) -> String; itemArt geometry supplies all texture lookups.
- [x] Add failing catalogue/market/repair/save/atlas assertions and update expected size to 33; run and confirm missing expansion failure.
- [x] Add 18 complete definitions and recipes; classify old definitions without changing old values; expand deterministic art and data-driven texture lookup.
- [x] Run catalogue, rules and art regressions; require zero failures.

### Task 2: Expose organized tiers and validate integration
**Files:** godot/scripts/ui/watch_manual.gd, godot/scripts/pages/warehouse_page.gd, godot/scripts/pages/inspect_page.gd, godot/tests/watch_manual_test.gd, scripts/test-godot-native.py, godot/README.md.
**Interfaces:** Consume GameData.tier_label; manual groups low/mid/luxury while metadata always stores the exact model ID.
- [x] Add failing tier grouping, last-model selection and item detail assertions; confirm missing UI failure.
- [x] Group manual models and display model tier in manual, warehouse and inspection; update documentation and test runner.
- [x] Run npm test, web build/export assets, and inspect rendered manual/details screenshots. Review final diff for save compatibility and correct model mapping.
