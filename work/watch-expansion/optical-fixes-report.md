# Floating papers and optical tools

Scope: optical follow-up on base `63c6d9f`. No catalogue, art, economy, counter/police, or watch-bench contour changes. All native builds/tests and Chromium runs were sequential across those environments; no native/Chromium overlap. No publication.

## Root causes and fixes

1. `FloatingDocument._process` called `_layout_grips` every visible frame. That crossed `JavaScriptBridge.eval` for devicePixelRatio and assigned every corner's geometry; corner drawing also queried DPI again. The test-only subclass measured **120 scale reads / 120 unchanged native frames**. Actual WebGL showed **13 DPR reads / 13 frames** with either paper open, versus **0 / 13** closed. Grip layout now caches projected scale, size, and the corner container origin, refreshes on viewport/document/screen-transform changes and browser resize events, and draws from the cached CSS scale. A per-document resize listener also covers CSS/DPR changes with constant backing pixels; it is registered once on tree entry and removed on tree exit before releasing its callback. Position changes need no corner relayout. Four corners, scroll, move, pinch, and persisted geometry remain.
2. The embedded workbench stops receiving pointer events when a root paper owns input, but inspection continued following its last world coordinate. A real-input native RED left that coordinate at the logo, moved onto paper, and completed evidence underneath it. The shell now answers pointer availability using both root workspace ownership and local GUI ownership. Unpinned tools hide their glass/light and reveal masks and pause progress over UI, resuming outside. Earned evidence and partial progress remain. Explicit pin still works beside non-modal papers; actual parent/child modals pause and hide it.
3. The loupe sampled the already-lit screen and then participated in the workbench lights again, with an extra 1.1 gain. Asserted C05 screenshots reproduced the user's white face while dark logo/hands remained. The loupe is now unshaded, removes the gain, and uses linear magnification without requesting a mip chain. GPU magnification, rim refraction/fringe, and sheen remain; no CPU texture captures/rebuilds were added to production.

The WebGL `generateMipmap` interceptor recorded zero calls on both packs, so it does **not** establish a mipmap GPU-cost root cause. Godot can implement screen-texture work through other paths. Removing the unused mip request is appropriate for magnification, but no FPS gain is attributed to that change.

## RED / GREEN evidence

- Native RED: `XDG_DATA_HOME=/tmp/optical-red godot --headless --path godot --script res://tests/optical_document_test.gd`; [native-red.log](optical/native-red.log): 120 idle reads, stale loupe/reveal under paper, and evidence/AP mutation; four expected failures.
- Parent-modal RED after the first pointer fix: same script with isolated `XDG_DATA_HOME`; [modal-red.log](optical/modal-red.log): pinned UV continued beneath parent settings; one expected failure.
- Final native: same script with fresh `/tmp/optical-final-native-2`; [native-final.log](optical/native-final.log): **0 reads / 120 idle frames, zero failures**. Covers changing zoom/viewport, actual outside-paper pointer motion at successive positions, paper hover masks, evidence/AP/storeCosts invariants, UV metering, explicit pin, parent modal pause/resume, and no repeated charges.
- Browser RED: `python3 scripts/test-optical-documents-web.py --record-red --output work/watch-expansion/optical/red-web`; [red-focused-web.log](optical/red-focused-web.log), [results](optical/red-web/results.json). Diagnostic mode records expected failures while retaining all artifacts. Every model's public title/UID was inspected against its normal save fixture; corrected harness now explicitly waits for both.
- Seven affected native groups pass: `watch_optical_face_test`, `document_resize_hit_test`, `document_views_test`, `inspection_usability_test`, `watch_evidence_refresh_test`, `mobile_gesture_test`, `watch_inspection_test`. Individual logs are in [optical/](optical/). Existing headless exit warnings about ObjectDB/resources remain (also present in baseline tests); no script/parse errors or failed assertions in these completed runs.
- Three older native tests used direct `optical_fixed=true` without a real pointer or explicit pin. After ownership became correct, that setup was rightly suspended; the face test subsequently accessed missing evidence. Those setups now press the existing pin button, preserving all original face, animation, masking, per-instance, legacy-save, forgery-invalidation, and AP retry assertions. The initially timed-out face run is not counted as a passing run.
- Build: `python3 scripts/build-godot-web.py`, [build-green.log](optical/build-green.log), success; 41.35 MB raw / 12.59 MB gzip. Root retains responsibility for the regenerated font, integrated full suite, final build and release.

## Rendering and performance

Real Chromium WebGL via ANGLE/SwiftShader, 1440x900 desktop; touch portrait runs at DPR2. Test fixtures use public UI commands and normal WebFS saves, not production test flags. Each fixture asserts the public model title plus UID before sampling.

Initial color comparison intentionally revealed the white bug, but its first sample band also intersected the source's masked logo mosaic. The first GREEN color run therefore reported false mismatches while the actual face was preserved. The final regression samples below that protected band, inside the lens and away from the rim/sheen, with corresponding 2.2x source coordinates. Source masks were not relaxed. The original diagnostic captures and intermediate failed log are retained for transparency.

Final desktop color and timing results follow below. Touch and DPI results are appended after their final verification.

## Limits and integration

This environment's software GPU has low, variable frame rates. Measurements establish removal of per-frame cross-runtime grip work and correct pointer/rendering behavior; they do not promise a production-device FPS. Native mask/flip/evidence contracts remain authoritative alongside WebGL pixels. No general GPU profiling claim is made.

New native test is registered in `scripts/test-godot-native.py`; desktop/landscape/portrait browser regression is registered in `package.json` and `.github/workflows/godot-web.yml`. Existing document browser coverage retains the original DPR1 gestures and adds a fresh real initial DPR2 context and adds a real 21-CSS-pixel outside-corner resize after a viewport change, unchanged-backing resize-event invalidation, single-listener reopen, and exact listener removal during intentional engine teardown. No dependencies were added. The 78-model catalogue, first33 art, save identity, supply/night rules, and financial reducers are untouched. The unrelated dirty font remains for root to commit.

## Final desktop verification

`python3 scripts/test-optical-documents-web.py --desktop-only --output work/watch-expansion/optical/green-final-web` passed, no browser/script/shader errors. [Final results](optical/green-final-web/results.json), [log](optical/green-final-focused-web.log).

Mean absolute RGB-channel error, median of five face samples (0–255 scale), with identical source/lens sample coordinates applied to retained RED screenshots:

| Model | RED | GREEN |
|---|---:|---:|
| WCH-003 dark N03 | 43.3 | 0.7 |
| WCH-020 light C05 | 46.3 | 2.0 |
| WCH-028 luxury X01 | 30.3 | 2.3 |
| WCH-074 ultra Q01, full animation | 58.3 | 1.3 |

All final samples avoid white clipping; [comparison pixels/coordinates](optical/color-comparison.json). The original C05 upper interior reproduction had 5/5 samples clipped to white; final lower-face comparison has 0/5. Actual pictures:

- C05: [original white loupe](optical/red-web/desktop-WCH-020-lens.png), [final source](optical/green-final-web/desktop-WCH-020-source.png), [final loupe](optical/green-final-web/desktop-WCH-020-lens.png).
- Dark: [source](optical/green-final-web/desktop-WCH-003-source.png), [loupe](optical/green-final-web/desktop-WCH-003-lens.png).
- Luxury: [source](optical/green-final-web/desktop-WCH-028-source.png), [loupe](optical/green-final-web/desktop-WCH-028-lens.png).
- Ultra: [source](optical/green-final-web/desktop-WCH-074-source.png), [loupe](optical/green-final-web/desktop-WCH-074-lens.png).

| Desktop mode, 12 actual pointer moves | RED DPR reads / frames | GREEN DPR reads / frames | RED median frame interval | GREEN median frame interval |
|---|---:|---:|---:|---:|
| Wanted open | 13 / 13 | 0 / 13 | 316.7 ms | 266.6 ms |
| Both closed | 0 / 13 | 0 / 13 | 300.0 ms | 266.6 ms |
| Manual open | 13 / 13 | 0 / 14 | 366.6 ms | 300.0 ms |

These are one before/after VM samples, influenced by software rendering and browser input scheduling. The closed baseline also varies; the reliable causal count is the removed per-frame DPR work. No native renderer ran during either browser measurement. Wanted/manual remain open during actual outside-paper motion and screenshots; native tests additionally assert the tool follows each real pointer coordinate without closing the paper.


## Touch, resize, and lifecycle verification

- `python3 scripts/test-optical-documents-web.py --landscape-only --output work/watch-expansion/optical/green-landscape-final`: PASS; [log](optical/green-landscape-final.log), [results](optical/green-landscape-final/results.json), [loupe](optical/green-landscape-final/landscape-WCH-020-touch-lens.png), [manual comparison](optical/green-landscape-final/landscape-manual-moving.png).
- `python3 scripts/test-optical-documents-web.py --phone-only --output work/watch-expansion/optical/green-portrait-final`: PASS; [log](optical/green-portrait-final.log), [results](optical/green-portrait-final/results.json), [rotated loupe](optical/green-portrait-final/portrait-WCH-020-touch-lens.png), [manual comparison](optical/green-portrait-final/portrait-manual-moving.png).
- Both DPR2 touch views: wanted and manual have **0 reads / 3 idle frames**. During actual taps/CDP drags, each mode (including closed) makes 26 legitimate input DPR reads; the final test separates these from idle reads. The first landscape assertion mixed input reads with idle reads and failed; corrected runs pass without changing production pointer behavior.
- Initial cache verification exposed the corner container's deferred 16-logical-pixel origin. The first 21-CSS-pixel outside-corner press missed because only scale/size were cached. [Native origin RED](optical/origin-red.log) proves center misalignment, and [final native GREEN](optical/native-final.log) asserts correct actual center alignment as well as all previous optical contracts. Parent-origin invalidation fixes this introduced cache edge.
- Pinned-engine CDP mid-context DPR emulation produced inconsistent public locate coordinates (e.g. x840 became x1680 while the rendered button stayed at x840). That probe is retained in [zoom-probe-red-2.log](optical/zoom-probe-red-2.log), but is not treated as a valid production pointer regression. Real initial DPR2 contexts, ordinary viewport changes, and an explicit unchanged-backing resize event are the reliable coverage here. Physical monitor transfers/browser zoom on hardware were not directly exercised.

- Lifecycle scope: normal paper hide/reopen and resize events are asserted error-free. Papers normally remain in the root UI and are hidden/reused, so browser teardown proof intentionally quits the owning engine, asserts the exact tracked paper callback was removed, and closes that context immediately. An exploratory post-engine-quit resize/500ms wait hit a pinned-runtime AudioSampleNode `currentTime=null` error after the paper listener-removal assertion had already passed ([document-verified.log](optical/document-verified.log)). The standard test does not claim whole-engine quit+resize is error-free and does not suppress generic errors during normal paper use. No production free hook or audio shutdown change was introduced.

- Strict outside-corner coverage uses a point 21 CSS pixels beyond the visible corner, not an interior near miss. The full gesture sequence first pinched the paper to viewport height, leaving its top corner only about5 CSS pixels from the canvas edge; that old test point was off-canvas. The standard DPR1 test shrinks using real header-wheel input before checking that reach, and the separate fresh DPR2 context checks on-canvas bounds explicitly. [Fresh DPR2 coordinate probe](optical/dpr2-resize-probe.log) succeeded both before and after ordinary resize (width30→27.73 and19.93→17.66).

## Final handoff

`python3 scripts/test-document-web.py` passed: [document-final-green.log](optical/document-final-green.log). Original DPR1 gesture, workbench overlay, catalogue, constant-backing resize invalidation, one-listener reopening, and exact callback removal checks pass. A separate fresh DPR2 context passes ordinary resize, a real 21-CSS-pixel outside-corner gesture, reopen, and exact listener removal. [DPR1 resized paper](../documents-web/guide-dpr1-resized.png), [fresh DPR2 resized paper](../documents-web/guide-fresh-dpr2-resized.png).

After the final origin-cache change, `document_resize_hit_test` and `document_views_test` were rerun against the final source and both passed, with zero script errors/failed assertions ([grips](optical/document_resize_hit_test-final.log), [views](optical/document_views_test-final.log)). `optical_document_test` also passes against that source, including actual grip-center alignment and zero/120 idle CSS reads. Build succeeded after the final production change. `git diff --check` passes. No full npm suite was repeated, per root's explicit instruction; root owns integrated verification and release.

All browser/native test processes are stopped at handoff. The existing port4174 preview server remains for root. The only unrelated working-tree change intentionally excluded from this commit is the regenerated font.

## Slow-host idle sampling follow-up

The final current-pack regression on the restarted host reported manual `3 reads / 2 frames` after a 350ms open delay and a 900ms measurement ([original failure log](final-web-optical.log), retained unchanged). Wanted/closed measured zero and the following twelve manual-open motion frames also measured zero. This was a test scheduling failure: `WebTouch` defers the manual command, and cold `configure`/open/container layout still legitimately query CSS scale. Wall-clock delays did not establish that those initial rendered frames had finished.

A fresh C05 trace samples in a task after all callbacks for each animation frame: **frame1 has3 reads; frames2–14 each have0**, with no browser errors ([trace](optical/idle-followup/per-frame-startup.json), [diagnostic command](optical/idle-followup/diagnose.py)). No production cache change was necessary.

Test-only commit `6223337` replaces that wall-clock idle interval with a bounded rendered-frame gate: at least6 warmup frames and3 consecutive read-free frames, failing if no quiescence appears within30 frames or45 seconds. It then requires **exactly0 reads across8 actual frames**, including the closed baseline. Per-frame deltas and settlement failures are retained in the normal results JSON. The old allowance of up to2 reads was removed; no error suppression or relaxed threshold was added.

Fault verification uses the actual current C05 WebGL scene. Healthy sampling passes0/8; an injected continuous DPR read loop produces thirty successive deltas of1 and is rejected as not settled; after removing the injection, sampling again passes0/8. Browser errors remain empty ([fault verification](optical/idle-followup/guard-fault-verification.json), [log](optical/idle-followup/guard-fault-verification.log)). This proves an ongoing per-frame loop cannot be hidden by the settlement gate. The injection is test-side only; no production flag was added.

Final current-pack desktop verification: `python3 scripts/test-optical-documents-web.py --desktop-only --output work/watch-expansion/optical/idle-followup/desktop-green` exited0. Wanted, closed, and manual each pass six read-free warmup frames followed by **0/8 idle reads**; all8 individual sample deltas are0. All4 color checks pass (003 error0.3, C05 error1.0, luxury028 error0.0, ultra074 error0.3; no white samples), hidden UV/AP checks and resume/pin pass, browser/script/shader errors are empty. [Final log](optical/idle-followup/desktop-green.log), [results](optical/idle-followup/desktop-green/results.json). Default model/view coverage is unchanged. Python syntax compilation and `git diff --check` pass. No production source/build or full native suite was repeated for this test-only correction; the production PCK is unchanged. Native/Chromium testing ownership is returned after this completed run.
