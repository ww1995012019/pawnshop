# Task 3 bench-polish report

Implementation: `867acb07292a5e0d3705bddcbc368f59fbdd56a3` — fit authored watch bench overlays and hardware to case contours.

Scope followed `task-3-polish-brief.md` and the focused design, plus root's explicit follow-up request for the new oval casing/strap composite defect. Base was `0dd652a`; root's intervening `80558cc` package/CI change was left intact. No optical, counter, data, supply/night/finance or atlas change. Root's dirty font remains unstaged. No subagents used.

## Changes

- `godot/scripts/ui/watch_bench_art.gd`: shared normalized authored contours for oval/crescent/octagon/sun/tonneau/cushion, contour-fitting highlight/ring paths, intersected cover-hatch spans, and contour-fitting tick/numeral positions. Seated, moving and detached covers use the same scaled geometry. Normalized contours are cached by shape; fixed-angle ray intersections are cached per bench and reused at different radii. No per-frame textures or JavaScript were added.
- Crown rectangle, ridges, power indication, safe action and quartz set-crown action share the attached hardware anchor. Screw-cover slots and opener prongs share opposing contour points; prongs remain seated during torque while grip accents indicate movement. Snap notch and lever contact share the actual notch midpoint.
- Legacy round/square drawing branches and original crown/snap coordinates remain unchanged. `_screw_pos` and the existing diagonal bolt/action ordering are unchanged. Glyph drawing, observation masks, instructions, permissions and reducer-owned costs/state were not altered.
- `godot/scripts/app/ui_kit.gd`: root's additional pixel check reproduced top-edge loss when WCH-023's original strap was restored under an installed WCH-075 shell. Appended model cases/lugs start at y54, so their top strap composite now stops at y54. Original33 retain the prior height65 contract; the bottom band is unchanged. No atlas/compositing redesign.
- Added `watch_bench_geometry_test.gd` and `watch_forgery_composite_test.gd` to the existing native runner, with their Godot UID files.
- Added `watch_bench_polish_fixture.gd` as a normal isolated-save fixture and `scripts/test-watch-bench-polish-web.py` as a browser-only focused check. The fixture generator runs before Chromium. The browser unloads the live game to same-origin `godot-license.txt` before writing IndexedDB and asserts actual selected UID/title before exercising work.

## RED / GREEN

`work/watch-expansion/task-3-geometry-red.log`: expected **3 failures** against the old bench: oval crown contact remained `(389,227)` instead of `(370.85,227)`, phone target likewise remained at the old location, and contour drawing primitives were absent. After implementation, `task-3-geometry-green.log` and the final `task-3-watch_bench_geometry_test.log` report **failures=0**.

The geometry regression uses independent literal dimensions, rather than metadata equality: oval radius98 tick endpoint83.3, radius87 endpoint73.95, radius94 ring extent79.9, radius95 hatch ±80.75, crown rect x346.85, and crown contact x370.85. It also checks seated/detached oval containment, scaled phone hit targets, the actual snap-plan target, quartz crown target, unchanged legacy round/square anchors, all four diagonal bolt/action positions, an octagonal bevel, sun valley and cushion diagonal.

`work/watch-expansion/task-3-composite-red.log`: expected **2 failures**, front and back, comparing actual composed pixels at y54..64 against the retained target oval shell. The new-art boundary fix makes `task-3-composite-green.log` report **failures=0**. The same test verifies the actual restored source strap and the original WCH-033 height65 contract.

An initial standalone composite test used an eager global UIKit reference that exposed a test-loading dependency; deferring its script load, consistent with existing art tests, produced the clean two-failure RED above. The first browser harness bootstrap had no save yet; creating an ordinary arrival before reading WebFS fixed the harness setup. Neither setup failure was counted as a successful feature regression.

## Commands and results

Godot executable: `/opt/godot/4.6.3/Godot_v4.6.3-stable_linux.x86_64`. All native runs used isolated `XDG_DATA_HOME` locations. Native/fixture/build processes completed before Chromium launched; no overlap.

Focused command pattern:

```sh
XDG_DATA_HOME=/tmp/<isolated-test> /opt/godot/4.6.3/Godot_v4.6.3-stable_linux.x86_64 --headless --path godot --script res://tests/<group>.gd
```

**Nine unique focused native groups passed** (exit0, no script errors):

- `watch_bench_geometry_test`
- `watch_forgery_composite_test`
- `watch_bench_art_test`
- `watch_rare_animation_test`
- `watch_service_test`
- `workbench_permissions_test`
- `watch_service_ui_test`
- `premium_counterfeit_test`
- `premium_counterfeit_ui_test`

Logs: `work/watch-expansion/task-3-<group>.log`, plus the explicit geometry/composite RED/GREEN logs. Existing service/bench regressions cover saved progress, reducer-owned state/costs, protected work and unchanged workflow completion; no duplicate exhaustive workflow was added. Some established headless groups emit the baseline one-resource shutdown warning already permitted by the repository runner.

```sh
XDG_DATA_HOME=/tmp/bench-polish-fixture <godot> --headless --path godot --script res://tests/watch_bench_polish_fixture.gd
GODOT_BIN=<godot> python3 scripts/build-godot-web.py
python3 scripts/test-watch-bench-polish-web.py
python3 -m py_compile scripts/test-watch-bench-polish-web.py
git diff --check
```

All completed successfully. Fixture/build logs: `task-3-fixture.log`, `task-3-build.log`. The Web export completed with engine+pack41.36 MB raw /12.59 MB gzip. Python compile and whitespace checks passed.

`work/watch-expansion/task-3-browser.log` reports both **desktop1440×900** and **phone844×390 touch, DPR2** passed. Each verifies WCH-075 **穹铸 Q02 极光 / item-7**, opens its actual front forgery view, returns to normal service, then uses real crown/opener/lift targets to detach the cover. The front, seated cover, crown contact, opener contact and detached cover were captured. No script/shader/browser errors occurred.

## Inspected image evidence

Under `work/watch-expansion/bench-polish-web/`:

- `desktop-oval-front.png` — dial ticks and case highlights follow the oval, masked mark remains concealed.
- `desktop-oval-opener-contact.png` — two-prong tool sits in the opposing shaped-cover slots.
- `desktop-oval-cover-detached.png` — hatch/ring details remain inside the small detached oval; case crown stays attached.
- `phone-oval-cover-detached.png` — actual phone input reached the detached-cover state with selected identity intact.
- Additional desktop/phone `*-oval-cover-seated.png`, `*-oval-crown-contact.png`, `*-oval-front.png`, `*-oval-opener-contact.png` are retained.

I opened and inspected the desktop front/opener/detached and phone detached screenshots. Fitted ticks/rings/hatching, the attached crown, seated opener and scaled cover are visible. The earlier `desktop-failure.png` is only the prefixture bootstrap failure and is not validation evidence.

## Self-review and limits

Reviewed the final diff for original round/square coordinates, bolt locations, action IDs/order/durations, current instruction text, mark/evidence handling, cache bounds and restoration of the original strap. Contour ray caches use fixed drawing angles and are cleared on configure; hatching works from cached normalized boundaries and supports paired spans. No production debug interface, per-frame texture work, JS or new state/cost ownership was introduced.

Actual browser evidence intentionally focuses on the reviewed oval defect and real phone hardware input. Polygon/cushion geometry has independent focused native checks; there is no claim of exhaustive rendered screenshots for every model or a repeated full npm suite. Root owns final full-suite, integrated review/build and publication.

**Testing ownership released:** native and Chromium processes exited, and root was explicitly notified after the desktop/phone pass. No further tests/builds will run from this agent. No known blocker remains.
