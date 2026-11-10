# Electricity and cleaning implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Implement approved electricity/cleaning pricing and non-overlapping day-end notices.
**Architecture:** StoreCosts owns device registration, daily usage and shared quote; reducer records successful operations and posts atomic charges; report renders quote and receipts and owns inline status.
**Tech Stack:** Godot 4.6 GDScript, native and Chromium tests.
**Spec:** docs/superpowers/specs/2026-11-10-electricity-cleaning-design.md

## Global Constraints
Preserve old saves and current gameplay permissions. Cleaning 8 Cr, baseline electricity 8 Cr, ceil once. No per-frame billing. No real-time charging. Existing old-save day uses 20 Cr, new scheme next day.

## Review Focus
Old-save activation must persist once; repeated CHECK must deduplicate; item removal cannot erase usage; failed settlement permits additional metered work; report scrolling must not overlap notices/buttons.

### Task 1 Costs and rules
- [ ] Write failing godot/tests/store_costs_test.gd covering baseline16, daily22, dedup, repair state/count, failed/retried settlement, item removal, old saves.
- [ ] Create godot/scripts/model/store_costs.gd class StoreCosts with ensure(state), quote(state)->Dictionary {electricity,cleaning,maintenance,total,details,legacy}, record(state,device,key,cr), device_problem(state,device)->String. quote excludes rent; maintenance is legacy20 or zero. Record usage and enabled-instance charges in integer cents. Support installed devices, current day, status and quantity per spec.
- [ ] Integrate successful CHECK/SCAN/SERVICE_COMPLETE/FORGE and SETTLE/NEXT/load/create; common quote for atomic charges, receipt details and relief. Add test to native runner; run targeted tests.

### Task 2 Report UI
- [ ] Reproduce/test no toast-button overlap in report_layout_test.gd.
- [ ] Report owns inline wrapping status label; no global overlay for report notices. Render StoreCosts.quote with fees, cash after rent, tap expandable detailed charges, old report maintenance fallback, upgrade lamp daily cost. Update ledger kinds, help and repair/inspection marginal cost instructions. No pricing logic duplicated in UI.
- [ ] Run report layout and relevant UI tests.

### Task 3 Integration
- [ ] Review changes, full npm test, web build, browser report verification; correct failures.
- [ ] Commit and publish tested source and matching generated build; confirm Pages success.
