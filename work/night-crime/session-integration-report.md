# Night crime / multi-item session integration

Merged the known `origin/main` commit `bc3ef87` into night-crime HEAD `854f562`, retaining premium counterfeit work, two-way multi-item trading, and the complete night insurance/theft/police loop. No further fetch or merge was performed. Workflow checks include night, premium and multi-item browser checks. Both counter helper sets are retained. The font conflict temporarily takes origin/main; root must regenerate the combined glyph subset before final packaging.

## Transaction and ownership contract

`TRADE_CHECKOUT` is the atomic crime-handling boundary. Only newly completed rows update case provenance and holder (`inventory` for purchases, `buyer` for sales), preserving original UID, insurance title and unresolved handling liability. Replayed/failed batches do not charge gray risk or change holders. Later NPC storage and subsequent sessions use that exact original; entering a session marks the tracked live holder `trade`. Unsold case-held visitor originals return to their case once at `TRADE_END`, never also to NPC storage. Recoveries remove the UID from inventory, visitor goods, acquired stock and persistent NPC storage before returning an uninsured lawful shop original or transferring paid property to the insurer. The legacy `trade.item` mirror is cleared when a session takes ownership.

All selected unverified rows require their own captured quote authorization. Batch `GRAY_TRADE` takes `{tradeId, uid, price, version, quote, confirmed:true}`, where `quote=NightCrime.gray_quote(item, price)`. It checks current session version, original fingerprint and quoted price. `TRADE_OFFER`, `TRADE_CONFIRM` and checkout enforce authorization. Adding/reviewing a row does not authorize its sale. A changed quote or changed original requires renewed consent. Prior single-item `GRAY_TRADE` and ACCEPT/DELIVER paths continue to work.

Root-confirmed ruling: from day 3 onward a successful atomic batch containing gray goods charges **+8 risk once per batch**, after every included gray row has explicit consent. Multiple rows and replayed batches do not multiply that charge. The preexisting day 1–2 unverified purchase rule remains +12, preserving the existing multi-item regression. Premium surface appearance still affects customer belief, while insurance and fines continue to use `Model.item_value` based on the real underlying item.

Mandatory police inspection cannot open a trade session or be dismissed with TRADE_END/REFUSE. Police remain a distinct visit. Exact lost-original reporting follows the focused physical UID, including later NPC reappearance, rather than relying on the first fence wrapper.

## UI

The optional multi-item list preserves recommendation/negotiation/confirmation/checkout/end controls. Per-row confirmation and OFFER show the existing `承担风险并锁价` control, capture the intended action and quote, then resume it after consent. Risk copy states once per batch. Warehouse `灰色收售`/`推荐给顾客` joins an already active batch and returns to its list; the normal no-session warehouse flow and labels remain intact. The list also exposes `失物报警` after actual serial evidence and uses the existing `核对原编号并报警` confirmation, with no purchase. Insurance, history, inspection and existing counter controls remain intact. Closing the nested risk dialog previously attempted to restore focus to a rebuilt button; the real pointer regression reproduced the error and a validity guard now prevents it.

## RED → GREEN and verification

Observed initial integration RED: batch purchase bypassed risk consent, failed to update the tracked case holder and charged the old +12 rule; gray originals could not enter sale recommendations. Additional RED: the actual batch confirmation button lacked risk consent; warehouse recommendations attempted the legacy SELECT_TRADE during a session; nested modal focus restoration emitted invalid-instance errors. Focused production fixes made these real reducer/pointer paths pass.

New regression groups exercise:

- Unconfirmed gray batch purchase blocked; quote and row consent isolation; two gray purchases charge +8 only once; duplicate checkout does not repeat cash or risk.
- Actual tracked batch purchase then sale, saved case holder/history and later naturally scheduled inspector liability.
- Inspector cannot become a normal trade session or leave through batch controls.
- JSON-reloaded unpurchased fence returns one original to its case, without NPC duplication.
- Insured original purchase/sale, one persistent NPC holder, later NPC resale into one trade holder, then insurer recovery without a live duplicate.
- Premium external appearance does not inflate the true insurance quote.
- Real pointer consent → row confirmation → checkout; warehouse joining the existing list; serial-qualified lost-original reporting from the list without purchase.

Final focused command: each listed test ran as `XDG_DATA_HOME=/tmp/integration-final-<name> godot --headless --path godot --script res://tests/<name>.gd` with a 90-second subprocess bound. **15/15 groups passed**: session_crime_integration_test, session_crime_integration_ui_test, night_crime_test, night_crime_ui_test, multi_item_trade_test, multi_item_trade_ui_test, premium_counterfeit_test, premium_counterfeit_ui_test, merchant_test, commerce_ui_test, counter_payment_test, forgery_test, wanted_cases_test, crime_event_test, report_layout_test. Each returned exit 0; no gameplay script/parse errors or unexpected ERROR lines. Existing accepted ObjectDB/resource shutdown warnings remain. Results are in `session-integration-results.json`; logs are `*-integration-final.log`. `git diff --check` passed. The native runner now includes both new integration groups. Existing test assertions were not weakened or removed.

Root owns the complete suite, combined font regeneration, build/packaging, final browser input checks and publication. No full suite, web build, deployment, push or additional remote synchronization was done here. Known remote browser CI failure in watch-appraisal navigation was reported by root; this task did not investigate that unrelated browser path.
