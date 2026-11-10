# Task 2 report — shared watch supply and weighted night theft

Status: implemented and committed as `27990b0` (`feat: balance fresh watch supply and tier-weighted night theft`). Base was `7905333`. No whole-suite or Chromium run was performed by this task; the coordinator owns final full verification. Native testing was released to the coordinator after the final focused run.

## Result

- Added `WatchSupply.pick(seed, key, pool=[])` and `WatchSupply.authentic(seed, key)`. Rarity, model choice and authenticity have independent deterministic SHA-256 hash domains. With ordinary and ultra candidates present, the ultra branch is 50/10,000 across all five models; counterfeit rate is 2,000/10,000. A constrained source pool cannot escape its candidates. A pool containing only ultras necessarily selects one of those candidates; no current procedural source uses an ultra-only pool.
- Routed ordinary procedural market offers, merchant special descriptors, counter extra goods (including the collector constraint), and fresh external fence originals through the shared sampler. Merchant special-offer opportunity remains 40%. The old campaign shuffle/finite all-model supply guarantee was removed.
- Merchant descriptors persist authenticity. Both direct purchase and counter conversion preserve it; descriptors from old saves without this field default genuine. Provenance verification remains independent from authenticity. Public merchant snapshot still exposes only name and price (the snapshot code was untouched).
- Existing fixed opening stock, scripted tutorial offers, quest items, inventory, sessions, retained NPC originals, and existing stolen originals are not regenerated. Session creation retains its existing guard and NPC original reuse. Counter dialogue and canonical crime-holder mechanics were left intact.
- Added `NightCrime.theft_chance_bp(s)` with `min(10000, 300 + 8×luxury + 10×ultra)` over eligible owned goods, using visible appearance tiers. `theft_draw` retains the default 300 bp argument and original day 3–20 boundary.
- Theft picks present tiers with weights 80/15/4/1, then picks an item within that tier. It removes the selected original before a potential second selection, re-evaluating present tiers. Inventory count within a tier cannot dilute another tier's chance.
- Settled nights store `chanceBp` and `effectiveChanceBp`. The latter is zero when no eligible goods or no remaining thieves exist. Morning receipts carry the saved values; historical records render the saved effective exposure without exposing hidden case fields. Existing settled nights remain idempotent and are not rerolled. Old morning records without a stored chance do not receive an invented display line.
- Insurance continues to use real-item valuation. Insurance UI shows current risk/formula, first-two-night grace, no-eligible-stock/no-thief cases, and settled snapshots. Merchant UI now calls its optional offer “随行货” because it may belong to any model tier.

## Changed files

Production:

- `godot/scripts/model/watch_supply.gd` and `.uid` (new)
- `godot/scripts/model/model.gd`
- `godot/scripts/model/commerce.gd`
- `godot/scripts/model/trade_session.gd`
- `godot/scripts/model/night_crime.gd`
- `godot/scripts/pages/report_page.gd`
- `godot/scripts/pages/counter_page.gd`
- `godot/scripts/app/shell.gd`

Tests/runner:

- `godot/tests/watch_supply_test.gd` and `.uid` (new)
- `godot/tests/night_crime_test.gd`
- `godot/tests/night_crime_ui_test.gd`
- `scripts/test-godot-native.py` (now 62 groups)

The coordinator-owned `scripts/test-watch-expansion-web.py` was not changed.

## TDD and verification

All native commands were run sequentially, with no Chromium running concurrently and with isolated `XDG_DATA_HOME` directories. Test invocation pattern:

```sh
XDG_DATA_HOME=/tmp/task2-<run>-<name> godot --headless --path godot --script res://tests/<name>.gd
```

Python wrappers ran the listed names sequentially, captured complete logs under `work/godot-tests/`, enforced 90-second per-test timeouts (initial RED used 45 seconds), and checked process exit status plus script/parse/error markers. The repository runner explicitly permits the existing resource-in-use-at-exit diagnostic; no other errors remain in the final passing logs.

Initial RED (`*-task2-red.log`):

- `watch_supply_test`: exit 1, shared sampler absent.
- `night_crime_test`: exit 1, inventory-sensitive threshold absent.
- `night_crime_ui_test`: exit 1, missing 3.18% current-risk line and grace explanation.

First implementation run (`*-task2-green.log`): probability and UI assertions passed. The new direct-merchant test fixture omitted `item:null`, producing script errors despite a zero exit status. The fixture was corrected, and this run was not treated as a clean verification pass.

Clean focused integration run (`*-task2-targeted.log`): **12/12 passed**, no script/parse errors:

1. `watch_supply_test`
2. `night_crime_test`
3. `merchant_test`
4. `multi_item_trade_test`
5. `session_crime_integration_test`
6. `counter_dialogue_test`
7. `watch_rules_test`
8. `watch_save_test`
9. `campaign_ledger_test`
10. `night_crime_ui_test`
11. `session_crime_integration_ui_test`
12. `report_layout_test`

Boundary/report RED (`*-task2-boundary-red.log`): night tests correctly failed the uncapped formula; native UI correctly failed the missing previous-night snapshot line. After implementing both, `night_crime_test`, `night_crime_ui_test`, `night_report_popup_test`, and `report_layout_test` all passed (`*-task2-final.log`).

Eligibility RED (`night_crime_test-task2-eligibility-red.log`): correctly failed zero effective exposure for protected-only stock and for all thieves caught. Final GREEN (`*-task2-eligibility-green.log`): `night_crime_test`, `night_crime_ui_test`, and `night_report_popup_test` all passed, exit 0, no script/parse errors.

In total, **13 distinct focused native groups passed**. Full 62-group suite remains assigned to the coordinator. `godot --headless --path godot --editor --quit` successfully registered the new class and UIDs (`task2-import.log`). `git diff --check` and staged diff checks passed.

### Deterministic sampling evidence

| Real source | Items | Ultras | Counterfeits | Luxury/ultra items | Luxury/ultra counterfeits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Shared helper | 100,000 | 495 | 19,862 | 26,286 | 5,274 |
| Ordinary offers | 10,000 | 58 | 1,968 | 2,615 | 519 |
| Merchant offers (6,000 visits) | 2,418 | 9 | 491 | 662 | 130 |
| Counter extra goods | 2,250 | 9 | 471 | 593 | 131 |
| Fresh external fence originals | 1,500 | 7 | 296 | 375 | 73 |

All five ultra IDs appeared in the helper cohort. Ultra-only counterfeit share passed the independent 10–30% bound; every real source's combined luxury/ultra cohort exceeded the requested 5% counterfeit floor. Source tests instantiate bounded real paths rather than 100,000 full model states. Constrained pool sampling preserves the same rarity branch and collector limits.

Theft tier sampling across 20,000 draws produced low **15,991**, mid **2,993**, luxury **818**, ultra **198**, matching 80/15/4/1. Additional tests cover 300/308/310/318 bp, the 10,000-bp cap, extra draws at the custom threshold, visible forged tiers, protected goods, no eligible goods/no thieves, absent-tier renormalization, many-low-item dilution resistance, no duplicate second loss, and stored chance snapshots. Existing suite coverage verifies insurance payouts, repeat-loss restitution, police reports, natural counter sessions, original UIDs, and settled-night idempotency.

## Self-review and concerns

No known unresolved functional issue. Reviewed each fresh-generation site, both merchant materialization routes, old descriptor fallback, the existing stock/session guards, visible-tier selection, saved thresholds, and public report/snapshot boundaries. No data/art definitions were changed.

The intended behavior change means an unopened procedural offer generated after loading an old save can differ from the former shuffle. Already-created physical goods and established counter quotes remain stored originals. Final whole-suite, exported-web verification, and publishing remain with the coordinator, as assigned. Standard Godot shutdown resource-use warnings remain and are explicitly ignored by the native runner; there are no remaining script errors in the clean runs.
