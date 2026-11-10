# Task 1 implementation report

Implementation commit: `ce6b21ef18579adde2faa7420a3a8f61ce5e90fc` — expand watch catalogue with authored rare models and previews.

## Delivered behavior

- Catalogue has 78 playable definitions: 27 low, 27 mid, 19 luxury, 5 ultra. Appended WCH-034 through WCH-078 without changing the original 33 definitions or their repair recipes.
- New families: low 苇原 / 石岚 / 港灯; mid 晴衡 / 霁轮 / 玄汐; luxury 曜廷 / 珀宸; ultra 穹铸. Ultra names 环日 / 极光 / 星仪 / 赤冕 / 月蚀 have values 1200 / 1450 / 1700 / 1950 / 2200.
- New price ranges are within the brief: low 85–210, mid 220–330, luxury 420–1100. Full catalogue price ranges remain disjoint: low 80–210, mid 220–330, luxury 337–1100, ultra 1200–2200.
- Every new model includes its own serial reference, nominal mass, movement, caseback, compatible parts, repair recipe, sprite mapping, authentic mark and altered mark description.
- Deterministic artwork generator keeps the original renderer path for indices 0–32 and adds a separate authored path for 33–77. Both atlases and normal maps are 1280×4096 (five columns, sixteen rows); every itemArt row count is sixteen. New back manufacturing codes use a bounded 6×2 binary field, rather than an increasing unbounded sequence.
- New cases include square, octagonal, oval, cushion and tonneau families. Five rare bodies use sun, oval, octagonal, cushion and crescent silhouettes with individually authored solar / aurora / instrument / red-radiance / eclipse lower-dial details.
- New appearance metadata also supplies repair-bench case geometry, strap material and palette. WatchForgery.template supports appended models instead of clamping them to WCH-033; its established binary compatible-shape contract stays intact while bench rendering retains the richer authored shape.
- Four catalogue sections have persistent wrapping tier navigation (`catalogue_tier_low/mid/luxury/ultra`). Existing card names and `catalogue_back` remain valid. Cards use static icons. Selected rare references expose `rare_reference_preview`, with a static reverse reference.
- Each rare model has a restrained distinct shader effect; physical effects derive from WatchForgery.appearance_id rather than authenticity or original definition. Genuine and counterfeit visible exteriors therefore share the same effect. Back faces and reduced motion disable it. The logo field and lens footprint are excluded; existing alpha, separated-part masks, grime and optical evidence remain authoritative.
- Ultra is labelled 珍稀 in GameData and reference/detail displays. Existing luxury badges remain available, with rare distinction in warehouse, inspection and counter presentation.
- Regenerated the existing font subset for new Chinese names. Registered the new native animation test and the deterministic Python art test in npm/CI.

## RED / GREEN evidence

Tests were added before their related feature work. Regressions were also rerun against original/baseline behavior, then restored and rerun GREEN.

- `work/watch-expansion/task-1-art-red.log`: Python art test failed with `33 != 78`; the original33 render/crop fixture already passed. Final Python run: 2/2 tests pass.
- `work/watch-expansion/task-1-watch_catalogue_test-red.log`: clean original33 definition/recipe baseline produced exactly three expected failures: 78 playable watches, appended classification, total tier classification. Restored expanded data then produced `WATCH CATALOGUE failures=0`.
- `work/watch-expansion/task-1-watch_rare_animation_test-red.log`: original ItemSprite / WatchBenchArt / WatchForgery code against new data produced 111 expected failures for missing animation and new appearance palettes. Final result `WATCH RARE ANIMATION failures=0`.
- `work/watch-expansion/task-1-bench-shape-red.log`: new bench shape assertions caught 30 authored shapes being collapsed to round. Authored geometry support then passed the same test.
- `work/watch-expansion/task-1-watch_manual_test-red.log`: old three-section UI produced two failures (78-card availability and fourth-tier navigation). Expanded UI passes, including all five selected rare previews, correct effect IDs, advancing selected clocks, reduced motion and static cards.
- Initial native setup exposed the post-merge stale class import and an incomplete test price dictionary (missing ultra). These were corrected; the final catalogue baseline RED is a clean expected-assertion failure, not a parser/runtime error.

## Verification

`GODOT_BIN=/opt/godot/4.6.3/Godot_v4.6.3-stable_linux.x86_64 npm test` completed with exit 0. Log: `work/watch-expansion/task-1-npm-test.log`.

- Godot native: **61/61 groups passed**, including catalogue, art, rare animation, manual, bench, service, repair/refurbishment, save migration, forgery, optics, trade, commerce, crime and existing UI coverage.
- Deterministic Python art: **2/2**.
- Packaging: **7/7**.
- Font: **1/1**.
- Loading layout: **2/2**.

After the full suite, final focused runs passed catalogue, rare-animation (including five distinct silhouettes), and cleaning expanded to all 78 actual alpha silhouettes. Python art test and `git diff --check` also passed. Python compile checks passed for the generator and art regression script.

The original33 fixture freezes definitions, corresponding repair recipes, and SHA-256 hashes of all 66 shipped front/back crops. It checks both committed atlas crops and fresh output from the authoritative generator. All remain unchanged.

`watch_logo_render_test.gd` now covers all78 models. Its existing full-frame “removing lens restores complete mosaic” comparison needs a fixed visual clock: the test disables automatic per-sprite processing while leaving rare_effect enabled, then explicitly processes at delta zero after evidence updates. Thus it continues to compare the complete frame and still exercises the rare shader's logo exclusion; it does not weaken that assertion to a smaller crop.

The real-renderer logo test was invoked headless and explicitly **skipped**, because no real rendering display is available in this environment. Root reported the real WebGL desktop run passed all four tiers, all five rare previews and reduced motion, with no script/shader errors; the screenshot was inspected and rendering accepted. Portrait verification is still running. No native test overlapped Chromium.

Some established headless groups report a one-resource shutdown warning (also present in baseline runs), which the repository runner explicitly permits. Final rare-animation and verbose manual reruns had no such warning. No unreported test failures remain.

## Visual review

- `work/watch-expansion/task-1-contact-sheet.jpg`: full78 front contact sheet.
- `work/watch-expansion/task-1-rare-strip.png`: last8 atlas cells, including allfive rare watches.

Inspected the generated strip directly. Root inspected both images and accepted the family/rare silhouette direction. Root accepted the real desktop shader rendering after inspecting the browser screenshot; portrait navigation is being checked.

## Scope and concerns

Task 2 supply/counterfeit rates, ultra probability, tier-first theft selection and revised theft risk were intentionally not changed. Those model/reducer changes remain root/Task2 work. This commit only enables the data/art/appearance contracts they consume.

Remaining integration validation: root's portrait WebGL browser run and subsequent Task2 integration checks. The native rendered optical test is a documented skip, not a passing rendered assertion. No other known implementation blocker.

The unrelated root-authored `scripts/test-watch-expansion-web.py` was left untracked and excluded from this commit.

## Changed files

- `.github/workflows/godot-web.yml`
- `godot/assets/atlas/watches-back.png`
- `godot/assets/atlas/watches-back_n.png`
- `godot/assets/atlas/watches-front.png`
- `godot/assets/atlas/watches-front_n.png`
- `godot/assets/fonts/orbital-sans.ttf`
- `godot/data/game_data.json`
- `godot/data/watch_art.json`
- `godot/scripts/model/game_data.gd`
- `godot/scripts/model/watch_forgery.gd`
- `godot/scripts/pages/counter_page.gd`
- `godot/scripts/pages/inspect_page.gd`
- `godot/scripts/pages/warehouse_page.gd`
- `godot/scripts/ui/watch_bench_art.gd`
- `godot/scripts/ui/watch_catalogue.gd`
- `godot/scripts/ui/watch_manual.gd`
- `godot/scripts/ui/watch_rare_preview.gd`
- `godot/scripts/ui/watch_rare_preview.gd.uid`
- `godot/scripts/world/item_sprite.gd`
- `godot/shaders/item.gdshader`
- `godot/tests/export_assets_test.gd`
- `godot/tests/fixtures/watch-original-33.json`
- `godot/tests/watch_art_test.gd`
- `godot/tests/watch_catalogue_test.gd`
- `godot/tests/watch_cleaning_test.gd`
- `godot/tests/watch_logo_render_test.gd`
- `godot/tests/watch_manual_test.gd`
- `godot/tests/watch_rare_animation_test.gd`
- `godot/tests/watch_rare_animation_test.gd.uid`
- `godot/tests/watch_refurbishment_art_test.gd`
- `godot/tests/watch_rules_test.gd`
- `godot/tests/watch_service_test.gd`
- `package.json`
- `scripts/generate-watch-art.py`
- `scripts/test-godot-native.py`
- `scripts/test-watch-expansion-art.py`
