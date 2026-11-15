# Counter Quick List Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline. Steps are tracked below.

**Goal:** Direct per-original list actions and one-AP batch checkout on PC.
**Architecture:** A separate native list component owns rows/popups; the existing
counter view routes guarded actions to existing controllers. No economy change.
**Tech Stack:** Godot 4.6.3 / GDScript / existing comic atlas and icon library.
**Spec:** docs/superpowers/specs/2026-11-15-counter-quick-list.md

## Global Constraints
- Choose several originals and settle the batch for 1 AP.
- Keep current comic art, physical originals and saved positions.
- Preserve UID/version/fingerprint, source-risk, AP, cash and capacity guards.
- Keep special visitors, own previews, mobile, orders and people functional.

## Review Focus
- Stale row or popup after visitor/quote/item changes must do nothing.
- Selecting/canceling must not change cash, AP or another original's status.
- Insufficient funds/AP/storage, stale evidence and source-risk confirmation.
- 1/8/16 rows, scroll/focus stability, inspect/return and resizing.
- Portrait padding and hand/counter contact for supplied and fallback residents.

### Task 1: Portrait contact
Files: comic_assets.gd, strict_counter_view.gd, reference_state_test.gd.
- [x] Add/render failing contact checks for CHR-008/019/034.
- [x] Add cached counter-only alpha bounds and bottom-aligned portrait layout.
- [x] Run reference_state_test; commit the verified fix.

### Task 2: Quick list and guarded operations
Files: new ui/quick_trade_list.gd, strict_counter_view.gd,
new tests/quick_trade_list_test.gd, scripts/test-godot-native.py.
Interfaces: list.setup(view), list.refresh(state); action requests carry
verb, UID, trade ID and rendered session version. The view validates and
focuses before invoking existing inspection, offer, consent, cancel or deliver.
- [ ] Add failing actual-node tests for list rows, selection/cancel, exact UID
  inspection, stale events and two-original checkout charging exactly 1 AP.
- [ ] Implement stable list rows, compact details/quote popup, fixed summary and
  checkout, and fallback view visibility. Guard busy/workspace and stale events.
- [ ] Run new and relevant counter/payment/native regressions; commit.

### Task 3: Browser and whole-change review
Files: browser regression, design-qa.md, presentation documentation.
- [ ] Run real Chromium with 1/8/16-item and partial-checkout fixtures: list
  focus/scroll, row selection, typed negotiation, inspect/return and settlement.
- [ ] Capture/review full PC, list, popup, empty and portrait-contact screenshots.
- [ ] Obtain one read-only final review; resolve important findings and verify.
- [ ] Commit and publish under the user's standing push/publish authorization.
