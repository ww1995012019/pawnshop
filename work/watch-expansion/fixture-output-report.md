# Browser fixture output directory correction

Scope: eight browser fixture writers and one 18-line test-only JSON output helper. No production source, browser assertions, fixture values, timeouts, or exported pack changed.

## Reproduction and cause

Upstream CI `629df69` and the root integration run both stopped in the 30-second `multi_item_trade_fixture.gd` subprocess before trade Chromium launched. The Python harness creates `work/natural-dialogue/browser`, while the fixture writes to `work/multi-item-trade/fixture.json`. It never created that different parent and did not check `FileAccess.open`.

With `work/multi-item-trade` genuinely absent, an isolated-save baseline invocation of `godot --headless --path godot --script res://tests/multi_item_trade_fixture.gd` reproduced the failure in five seconds: `SCRIPT ERROR: Attempt to call function 'store_string' in base 'null instance' on a null instance` at fixture line 10. The script exception skipped `quit()`, leaving SceneTree alive until the caller timeout. This shorter diagnostic timeout exposed the same failure without swallowing stdout/stderr; no application/test timeout was changed. Full evidence: `work/watch-expansion/fixture-output/red-missing-parent.log`.

The other seven current fixture writers also assumed their output parents existed and dereferenced an unchecked file. Their usual browser callers often create the right parent first, so local ignored directories concealed the shared direct-invocation risk.

## Minimal correction

`godot/tests/fixture_output.gd` creates the output parent recursively, checks open and write/flush errors, and reports an explicit path/error diagnostic. Each writer calls it and exits 1 immediately on failure, preserving its existing success path and validation. Existing fixture contents and normal reducers are unchanged.

Updated writers: multi-item trade, counter lifecycle, premium counterfeit, watch refurbishment, optical documents, watch service, watch bench polish, and night crime.

## Verification

Native checks ran serially and finished before Chromium started:

- All eight current writers were invoked in separate temporary project roots with genuinely absent `work`/output directories. All exited 0 and produced parseable JSON.
- Each output was compared with the pre-fix writer's output from a separate temporary project with the expected directory precreated. Payloads matched exactly in all eight cases.
- A regular file blocking the output directory made the corrected multi-item fixture exit nonzero immediately, with the explicit `Cannot create fixture directory` diagnostic and no null-instance SCRIPT ERROR.
- Result: **8/8 missing-parent GREEN, 8/8 exact payload parity, 1/1 failure-path GREEN**. Logs and the local one-off verifier: `work/watch-expansion/fixture-output/green-writers.log` and `verify-writers.py`. No new fixture framework was introduced into the repository.

The first browser attempt stopped before loading the app with `ERR_CONNECTION_REFUSED`; the root-owned preview server had exited. Root restarted the same port 4174 preview and this unchanged browser test was rerun.

Current-pack trade browser command: `python scripts/test-multi-item-trade-web.py` (desktop 1440×900 and phone 844×390/DPR2, all original assertions retained). Result: **PASS on desktop and phone, exit 0**, with no pageerror/SCRIPT ERROR; `work/watch-expansion/fixture-output/trade-web-green.log`. Existing screenshots remain under `work/natural-dialogue/browser/`.

`git diff --check` passed. Baseline and corrected immediate-initializer logs have the same existing one-resource shutdown warning; there were no new SCRIPT ERRORs or non-exempt runtime errors in the green checks. No full native suite, optical browser suite, pack build, or publication was performed for this fixture-only correction.

Source/helper commit: `d5f5664` — `test: create browser fixture output directories and fail cleanly` (parent `ea1d689`).
