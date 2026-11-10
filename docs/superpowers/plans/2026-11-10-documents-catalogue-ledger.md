# Documents, catalogue and ledger implementation plan

Goal: implement the user-approved nine-part design from this conversation.
Architecture: reusable non-modal floating document, saved police document state, separate reference catalogue and ledger views. Godot 4.6.3, no new runtime dependencies.

## Approved scope
- Illustrated wanted inventory icon; draggable/scalable/closable wanted paper.
- Successful arrest withdraws entire paper, next officer visit issues a new six-person paper. False reports retain paper and penalties/history persist.
- Inspection manual at upper right: draggable/scalable/closable, reference only.
- Separate operating manual, inspection guide and all-watch icon-grid catalogue in settings. No dropdown selector, no NPC catalogue.
- Cash stack opens complete campaign ledger, daily/type filters and accurate cash-flow totals.
- Uninspected physical logo is mosaicked, lens reveals locally and successful observation reveals that instance permanently until logo modification.
- Counter notices move above portraits and dialogue, desktop and phone.

## Tasks
1. Police lifecycle: model/wanted_cases.gd and corresponding native tests. Verify withdrawal, invalid reports, reissue, old saves.
2. Physical logo: item sprite/shader/inspection integration and native tests. Verify partial lens reveal, completed evidence and re-forgery reset.
3. Shared floating document and wanted paper: desktop drag/wheel/resize controls plus touch pinch, bounded geometry and persisted zoom/position.
4. Split inspection guide and icon-grid watch catalogue, integrate upper-right guide and settings catalogue; preserve reference data and no evidence side effects.
5. Campaign ledger with cash-stack entry and filters; move toast above service window. Verify accounting identity, no double posting, no overlap.
6. Full native/package/font suite, exported resource check, desktop and phone browser tests, focused fresh review and fixes.

## Review focus
Small viewport reachable close/resize handles; touch gesture does not activate underlying controls; old saves without paper scale; cash ledger initial balance is derived without adding transactions; forging invalidates revealed physical logo.

## Progress
- Planning: approved conversation is binding spec; implementation authorized by user. Use current checkout on feature branch to preserve existing environment and build cache.

## Completion record
- Tasks 1–5 implemented, including backward-compatible saved paper scale and logo-specific observation fingerprints.
- Fresh independent review found three important issues: reentrant wanted zoom save, cash/quote overlap, unrelated appraisal revision hiding logo. Fixed all three; zoom and logo regressions demonstrated RED then GREEN, real cash click opens ledger. Cash is shown only in empty/locked quotation space so it never competes with price controls.
- Ruling: preserve current checkout and use a feature branch, no main merge or deployment in this implementation-only turn.
- Ruling: save continuous gesture geometry on release, not on every input frame, to avoid repeated synchronous save writes.
- Validation: npm test passed 35/35 native groups, 7 packaging tests, 1 font test; exported resources 33 watches / 33 residents / 3 instruments, failures=0. Desktop/audio and phone browser regressions passed. Floating paper browser regression passed actual mouse drag, plus/minus, touch pinch and reopen; all-watch grid/detail/back navigation passed. Logo rendered regression: 165 checks across all 33 models.
- Existing Godot resource-at-exit diagnostics remain as on baseline; no script/parse errors in passing runs.
