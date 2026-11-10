# Night crime UI implementation

Implemented the full player loop in the existing counter, ledger and warehouse. Insurance has exact current quotes, confirmed per-UID coverage, immediate purchase, update including zero incremental premium, visible exclusions, and separate cash ledger types. Coverage details collapse to preserve the desktop receipt and next-day controls.

Unread losses open after the title/shutter/workspace boundary is clear. The shell checks saved report flags only between frames, opens once per session after dismissal, and persists ACK. The scrollable public-history sheet prints per-UID names/thumbnails, condition, location, market and confirmed values, payouts, case records, recovery/insurance rights, cooperation, leniency probability and the latest actual inspection receipt. History reopening never changes cash or inventory. It uses public projections; warehouse source labels no longer read hidden stolen flags.

Counter ACCEPT and negotiated OFFER both show explicit gray-risk confirmation, capture the chosen action/price before any refresh, authorize only that trade and then execute the existing transaction. Warehouse gray sale confirmation is per selected item and returns to the actual counter. A serial-qualified original lost item gets a real alarm confirmation without buying it. Pending police have a dedicated arrival control even after six visits at zero AP; inspection resolution costs no AP and shows the receipt.

Root-authorized narrow backend changes: initialize the saved day schedule in Model.create and Game load so opening the UI does not lazily mutate read-only state; include OFFER in the source-consent guard to prevent an unverified offer locking before authorization.

## Verification

Observed initial RED for missing real insurance control. Observed negotiated OFFER RED for locking without a risk prompt, then GREEN after the shared consent flow and reducer guard. Final native UI test passed with real pointer input for buy, zero-cost update, ACK/history/reload, late inspection, gray ACCEPT and OFFER delivery, warehouse sale, and serial-qualified lost-original reporting/recovery. It also checks disabled insurance reasons and bounded readable report controls at desktop, short and mobile logical viewports.

Targeted final groups passed: night_crime_test, night_crime_ui_test, report_layout_test, campaign_ledger_test, commerce_ui_test, web_touch_test, counter_payment_test, document_resize_hit_test. Prior targeted wanted_ui_test also passed. git diff --check passed. Logs are work/night-crime/*-ui-final.log. The existing ObjectDB/resource shutdown warning remains; no gameplay script errors or FAIL markers in the final UI run.

The deterministic tests/night_crime_fixture.gd writes work/night-crime/browser-fixture.json with before_insurance, insured_report, inspection_pending and meta. Insurance fixture uses a real searched seed with two actual losses (premium 5 Cr, payout 189 Cr), BUY_INSURANCE→SETTLE→NEXT via normal reducers. The late inspector uses the natural scheduled inspection draw with ordinary cursor6/AP0 save resources; no forced outcomes, hidden production telemetry or test-only production actions.

Visible labels / browser meta:
- buyButton: 购买今晚保险
- update control: 更新保障
- ackButton: 确认夜间记录
- historyButton: 夜间失窃与查货记录
- inspectionButton: 接待查货警察
- resolveButton: 配合查货
- gray consent: 承担风险并锁价 / 承担风险并选货
- lost-original report: 失物报警 → 核对原编号并报警

Root owns full-suite verification, final browser builds/input checks and publication. No deployment performed by this task.
