# Counter lifecycle corrective work

Implementation scope: `counter_page.gd`, `counter_dialogue.gd`, explicit initial table glow uniform, and focused native/WebGL regressions. No optical/manual/shader changes and no publication.

## Root cause and reproduced evidence

The reported browser `RuntimeError: null function` was reproduced on the existing pinned Godot Web runtime using Chromium WebGL/SwiftShader, full animations (the default), an ordinary persisted wanted visitor with two original NPC watches, and actual in-scene alarm/confirmation buttons. No force/debug flags were used. The fixture was generated using the normal model/session/wanted reducers and loaded through IndexedDB.

- RED command: `python scripts/test-counter-lifecycle-web.py --red`; `work/watch-expansion/counter-lifecycle-red.log` ends with `AssertionError: ['null function']`.
- Corresponding animated native RED: `godot --headless --path godot --script res://tests/counter_lifecycle_ui_test.gd`, with isolated `XDG_DATA_HOME`; `counter-lifecycle-native-red.log` repeatedly reports `Invalid access to property or key 'body' on a base object of type 'previously freed'` at `counter_table.gd:134`.
- The police path queued only `mat_item` for deletion directly. For natural multi-item conversations that sprite still belonged to `counter_table.sprites`; its dictionary and card were never removed. Subsequent `_process` frames accessed the freed sprite, and later refresh could dispose it again. Other originals were also left unanimated. Existing wanted UI coverage used reduced motion, which compressed the interval and concealed this lifecycle failure.
- The smallest runtime correction takes every displayed original through `counter_table.take(uid)` before animating/freeing it, reparents it to the stage, and binds its transfer tween to that sprite. The very next full-animation WebGL reproduction completed arrest, waited beyond all tweens, and served the next visitor with `errors []`: `counter-lifecycle-ownership-green.log`. No JS exception catching, reload recovery, or model ownership changes were introduced.
- Animated native verification also exposed `float(null)` in the headless table glow: the rendering backend does not supply the shader's default uniform through `get_shader_parameter`. Explicitly initializing `strength=0.0` when creating the material preserves the Web visual default and permits full-animation native checks.

## Dialogue and departure changes

The duplicate cream tooltip was caused by `_say` assigning the entire already-visible speech to `bubble_label.tooltip_text`; the footer also repeated its already-visible note as a tooltip. Both duplicates are removed. The complete bubble now stops GUI input, and world cursor/hover/unhandled input paths respect its rectangle. Useful unrelated equipment/item tooltips remain intact. Hidden/faded bubbles are hidden as Controls so the new input ownership does not cover an empty region.

Per the user's latest screenshots, the bulky police result bubble is hidden throughout patrol arrival and escort. The existing standard top status displays the outcome outside both faces. The officer's existing physical position is fully visible once that redundant bubble is removed; no speculative portrait relocation was needed.

Terminal quantity/budget/forgery rejection exits after approximately three readable seconds. The countdown begins only once typewriter text is fully visible, pauses behind active modals/workspaces/title and while animation is busy, and is keyed to trade ID/session version/focus/status. Deliberate trade actions reset/recompute it. Automatic volunteered clues cannot replace a terminal refusal. Manual departure remains available.

A confirmed-undelivered batch always suppresses automatic departure, even when the focused alternative is rejected. Ordinary natural multi-item sessions and partial checkout retain the visitor while other meaningful trading remains. Completed interactions with no remaining visitor originals or valid buyer demand can finish automatically. Ordinary patrol delivery also finishes once the owned notice has been issued; inspection visits and merchant shopping are excluded.

Automatic departure uses the existing `REFUSE`/`TRADE_END` finish path, preserving unsold shop originals and NPC holdings, with no new AP, cash, ledger, source, insurance, or canonical police-case rules.

## RED/GREEN and verification

Before the dialogue changes, native checks failed specifically for duplicated speech tooltip, ignored bubble input region, and missing terminal automatic departure: `counter-dialogue-red.log` (three failures). They are now green.

Verified focused native set: **15/15 groups passed**, `counter-focused-native.log` and `counter-native/*.log`:

- counter lifecycle, table/model and UI, dialogue/model and UI;
- session/crime integration/model and UI, multi-item trade;
- premium counterfeit/model and UI, wanted cases/UI, counter payment;
- watch supply and rare animation.

The lifecycle test additionally verifies original UID retention, repeat-report reward/AP idempotence, arrest/next visitor after every tween, no bulky result bubble, real dialogue hover without a tooltip popup, enabled dialogue controls, quantity/forgery auto-exit without financial/original loss, safe pending agreements, deliberate next-original cancellation, workspace pause/fresh reading delay, stale next-visitor protection, full typewriter reading time, officer delivery completion, and shell closure during goods transfer. Full animation and reduced motion are both exercised.

Final browser scenarios: **10/10 passed across desktop and phone runs**. Desktop five scenarios and phone arrest are recorded in `counter-lifecycle-web-green.log`; phone arrest/false-report success is also in `counter-lifecycle-phone-green.log`; the final four-case phone run exited 0: `COUNTER_WEB_CASES=false_report,capacity,forgery,pending python scripts/test-counter-lifecycle-web.py --phone-only`, `counter-lifecycle-phone-final-green.log`. Matrix covers desktop 1440×900 and touch phone 844×390 at DPR 2, each with animated arrest, third false report/fine, next-visitor service after all tweens, quantity refusal, real expert forgery refusal, and an undelivered agreement that must remain open.

Two browser harness assumptions were corrected during final verification, without production workarounds: the first combined run stopped with the phone false-report confirmation still open after a tap during modal layout/transition (no runtime errors or financial change); the helper now uses bounded real modal scrolling, full button bounds, logged coordinates, and a post-confirm condition. An initial phone rerun then observed the correctly auto-departed quantity visitor before its “before” snapshot; the test now compares final AP/cash/originals to the fixture instead of assuming the visitor must still be present after screenshot/paper-closing work. Both affected phone scenarios subsequently passed. The final false-report confirmation landed inside its visible button at CSS (421.95,273), size (302.58,21.27).

The title guard is centralized in `_scene_blocked`, so ordinary automatic chatter and hidden counter interactions also pause before Start. Native regressions explicitly check both restored-terminal departure and ordinary chatter behind the title.

Build command: `python scripts/build-godot-web.py`; `counter-lifecycle-build.log` records successful pinned-runtime export/package. `git diff --check` passed.

## Evidence artifacts and remaining limits

Screenshots: `work/watch-expansion/counter-lifecycle-browser/` contains each viewport's `*-before.png`, `*-patrol.png`, `*-next-visitor.png`, `*-departed.png`, and desktop `*-dialogue-hover.png`. Desktop patrol evidence shows both complete faces and the unobtrusive top status, with no result speech bubble.

The initial and title-follow-up native runs overlapped Chromium before the parent reiterated an environment-specific wrong-thread/signal-11 risk under mixed load. No such error occurred in those passing runs. After the final phone process exited 0, all browser/build/native processes were checked closed, and the affected lifecycle/title test was rerun alone; final isolated result: **PASS (32 assertions, failures=0, exit 0)**, `counter-native/counter_lifecycle_ui_test-sequential.log`. Nearby 14-group follow-up after the title change passed 14/14 in `counter-focused-native-final.log`. Parent owns final fully sequential integrated checks.

Native shutdown logs retain the project's familiar ObjectDB/resource-in-use warnings (also present in existing dialogue UI tests); no SCRIPT ERROR, parse/resource-load error, active tween error, or non-exempt ERROR occurred in the green focused checks. The existing native runner explicitly exempts only the final resource-in-use shutdown line, and its same marker rules were applied here.

No whole npm suite was run because the parent requested focused regressions and owns final integration verification. Local build regenerated `godot/assets/fonts/orbital-sans.ttf`; it is left unstaged for the parent's combined final build/artifact decision. Logs/screenshots/generated fixture JSON are local work artifacts; the report and focused regression sources are committed.

## Commit

Implementation and focused regressions: `0e2bfdb` — `fix(counter): preserve police sprite ownership and finish terminal dialogue` (parent `de6869d`). This report is committed separately immediately afterward as `docs: record counter lifecycle corrective evidence`. No push/publication was performed.
