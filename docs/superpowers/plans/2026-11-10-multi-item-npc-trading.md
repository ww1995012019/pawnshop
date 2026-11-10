# Multi-item NPC Trading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for inline implementation.

**Goal:** Multiple individually negotiated goods in both directions with atomic batches and persistent NPC sessions.
**Architecture:** Add TradeSession model attached to an existing ordinary trade. Preserve legacy single-item entry points until the player explicitly enters the multi-item list; import existing offers without resetting rounds/recognition. A dedicated UI list reuses inspection and underlying valuation without duplicating item truth.
**Tech Stack:** Godot4.6.3, native GDScript tests and browser Playwright.
**Spec:** docs/superpowers/specs/2026-11-10-multi-item-npc-trading-design.md (approved).

## Global Constraints
- Up to6 recommendations and0–3 NPC goods,3 valid offers per line,1AP per successful batch.
- Fixed per-encounter goods/preferences/draws, finite shared cash and quantity, gross ledger with net cash settlement.
- No transfer until a complete preflight succeeds; no duplicate batch effects; remain in session after checkout.
- Special police/orders/pawns and material merchant flows preserved. Prior counterfeit identity, recognition and physical state preserved.

## Review Focus
- Stale versions and goods modified after confirmation cannot partially transfer.
- Reordering/removing lines/reloading cannot reroll recognition or refresh budget/rounds.
- Post-sale fitting must include all incoming items; reject a whole batch if any do not fit.
- NPC archive goods retain uid and cannot be immediately resold in the same visit.
- Phone rows, reasons, return from inspection and bottom checkout remain accessible.

### Task1: Sessions and atomic batches
**Files:** model/trade_session.gd, commerce.gd, model.gd, tests/multi_item_trade_test.gd.
**Interfaces:** TradeSession.ensure/reduce/item/summary, action types TRADE_OPEN, TRADE_ADD, TRADE_REVIEW, TRADE_OFFER, TRADE_CONFIRM, TRADE_REMOVE, TRADE_FOCUS, TRADE_CHECKOUT, TRADE_END.
- [ ] Add RED native tests for partial/all/refused choices, immutable originals, budget/quantity reservations, per-line negotiation, cached recognition, net checkout, final packing, duplicate/stale/closed/unauthorized actions and reload.
- [ ] Implement fixed session stock, per-line contexts, atomic candidate-state validation, gross ledger and NPC owned archive.
- [ ] GREEN targeted plus existing commerce/forgery/order regressions; commit and ledger.

### Task2: Player UI and inspection continuity
**Files:** ui/trade_list.gd, counter_page.gd, game.gd, web_touch.gd; tests/multi_item_trade_ui_test.gd and scripts/test-multi-item-trade-web.py.
**Interfaces:** TradeList.open(shell), snapshot via TradeSession.summary, Model.find_item/trade_item resolve focused visitor goods.
- [ ] RED UI tests for prominent access, multiple stock rows, separate visitor goods, line prices/reasons/confirm states, net totals and checkout/finish separation.
- [ ] Add responsive scroll list and per-line detail, invoke true tool inspection preserving session, fixed footer and explicit blocked reasons; update help and save migration lazily on list open.
- [ ] GREEN UI/native tests and real desktop/phone two-direction multi-item checkout/reload; commit.

### Task3: Integration, review and release
- [ ] Run complete native/packaging/font/layout suite, export and real browser regressions for counterfeit and multi-item transactions.
- [ ] Obtain fresh whole-branch review per executing-plans; reproduce and fix material findings with tests.
- [ ] Reconcile remote main, merge/push, stage tested pack and verify hashes, publish preserving prior assets; await exact Pages SHA success.
