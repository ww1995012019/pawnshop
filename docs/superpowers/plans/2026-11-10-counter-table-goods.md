# Simultaneous counter goods correction

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** NPC and player originals stay physically arranged together on the existing counter; focusing one original never replaces the others.

**Architecture:** Preserve TradeSession originals, item-level quotes and atomic settlement. CounterDialogue exposes the currently presented originals and a focus action. A dedicated CounterTable renders and hits all those originals while counter_page retains its original quotation device, NPC conversation, and mat_item compatibility alias.

**Tech Stack:** Godot 4.6 / GDScript, existing native and Playwright regression runners.

**Spec:** docs/superpowers/specs/2026-11-10-multi-item-npc-trading-design.md; latest user correction explicitly requires simultaneous physical display.

## Global Constraints

- NPC offers its actual 0–3 goods on arrival; no repeated next-item requests.
- Player can add 1–6 originals by clicking existing stock; additional goods do not displace earlier proposals.
- Clicking a table original focuses its quote/inspection, without accepting it, moving ownership, charging AP, or rerolling judgement.
- Preserve existing per-item pricing, refusal, risk consent, custody, batch settlement, continued visit, and explicit send-off.
- Existing desk art, equipment mounting, mobile workspace capture and saved identity protections remain.

## Review Focus

- Focused UID must never be confused with all visible originals or all confirmed originals.
- Six player goods plus three NPC goods must have separate reachable hit regions on desktop and phone.
- Returning from inspection/reload preserves table contents, item-level facts, quotes and positions.
- Partial settlement animates only the agreed originals, in each original's ownership direction; all unbought goods stay.
- Drag, workspace/modal capture, removal and visit end must not leave stale sprites or duplicate goods.

### Task 1: Preserve the presented originals

Files: counter_dialogue.gd, counter_dialogue_test.gd and counter_table_test.gd.

- [x] Add RED assertions: all NPC originals are available without cycling; two unconfirmed player proposals remain included; focus changes preserve histories and funds; remove only one original; six-item bound and reloaded contents.
- [x] Implement `CounterDialogue.table_items(s: Dictionary) -> Array`, `COUNTER_FOCUS`, `COUNTER_MOVE` and additive SELECT_TRADE; initialize NPC rows at begin. Store optional desk positions on the visit.
- [x] GREEN targeted rules, existing multi-item and night-custody integration.

### Task 2: Physical desk rendering and input

Files: new scripts/world/counter_table.gd, counter_page.gd, web_touch.gd, new counter_table_ui_test.gd; update test runner/browser regression.

- [x] RED real-input assertions for simultaneous NPC+player originals, independent hit regions, focus without replacement, inspection return, partial handover and send-off.
- [x] Render each uid once with a persistent ItemSprite, owner/status/price tag and focused outline. Use two desk rows and all visible originals for hit testing, drag, flip and handover.
- [x] Remove next-item dialogue requirement; clicking stock adds to desk; desk focus binds original price/inspection controls.
- [x] GREEN desktop/phone native, full npm suite, export checks, real browser multi-item tabletop scenario.
- [x] Fresh whole-branch review and repair material issues.
- [x] Publish verified package using existing authorization and confirm exact-SHA Pages success.

Ruling: This corrects the authorized multi-item implementation following the user's explicit physical-display requirement; it does not introduce bundle pricing or a new selection modal. Existing approved per-original negotiation remains.

Verification: RED rules reproduced one-at-a-time NPC presentation, replacement of earlier player proposals and wrong focus; UI RED showed the missing multi-original surface. Final full npm suite passes 59/59 native groups plus packaging 7, font 1 and loading layout 2. Exported 33 watches/33 residents/3 instruments pass. Final real desktop and phone browsers show two NPC plus three player originals simultaneously, direct physical selection, inspection return, partial four-original settlement leaving the fifth original on the desk, continued reception and saved continuation.

Independent review issues were reproduced RED and fixed GREEN: excluded seventh original cannot steal focus after failed addition; right-click flips the pointed original; removed/reintroduced and partially settled goods reuse only vacant positions; nearest-empty-slot drops cannot overlap; successive normal-motion settling clears its cached destination and checks optional metadata safely. Max nine-original native UI, independent hit regions, mixed-direction partial handover, later addition and send-off all pass. Reviewer concluded no outstanding findings.

Deployment confirmed: source `5dd2d433e29d0928a033f5f35e8390810f40d0fc`, release `17e8acf53fbd9bf7`, Pages commit `30e728083f3ca9984a9cebe8642a928650ff6642`; exact-SHA Pages workflow [42848476696](https://github.com/ww1995012019/pawnshop/actions/runs/42848476696) completed successfully.
