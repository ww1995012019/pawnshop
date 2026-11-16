# Comic loading and complete desktop framing

**Goal:** Use existing comic art while loading; keep the complete desktop HUD and bottom controls visible.

**Scope:** The user requested the loading-page update and identified the clipped upper/lower bars. Keep the existing desktop composition, resident quotes, progress/error behavior and mobile layouts. Work in this chat's clean Cloud checkout on `work`.

**Approach:** Package lightweight scenery and transparent portraits from existing comic assets. Retain content hashes and release retention. Remove the obsolete desktop crop of the old room's ceiling/floor, now occupied by the comic interface.

- [x] Add comic asset-output regressions and a real Godot transform regression at 1920×1080, 2048×1018, 1920×900, 2560×1080 and 1440×900. Observe failures before fixes.
- [x] Update `scripts/build-godot-web.py` and `godot/web/shell.html` to package comic art with smooth scaling. Retain 33 names/quotes, transparency, progress, errors and reduced motion. Keep background plus portraits below 1 MB.
- [x] Correct desktop framing in `godot/scripts/app/shell.gd`, keeping mobile branches intact. Run focused native checks.
- [x] Build the actual Web game. Verify loading, desktop edge geometry, actual top/bottom mouse actions, resize, DPR 2 and phone startup; inspect screenshots. Run project tests and review the diff.

**Review focus:** Desktop aspect ratios; repeated resize/fullscreen; phone orientation; content hashes on changed art; loading progress, rotation and failure.

**Delivery:** Local code and tested Web build. The user subsequently explicitly requested pushing and publishing to the existing GitHub Pages site; retain the preceding release assets and verify the exact deployment commit.

## Evidence

- Before: two loading-art assertions failed; the desktop transform test showed top `y=-41.738` and height `1099.44` in a `2048×1018` window. Both edge controls failed visibility checks.
- After: all four loading checks and all five native desktop dimensions pass. The same window now shows top `y=0` and height `1018`.
- Built comic background is 239,114 B; cast sheet is 460,906 B; all 33 resident identities and quotes remain present.
- Real Chromium: six desktop sizes plus DPR 2 pass complete control bounds and mouse clicks near the upper/lower edges. Opening settings/storage preserves cash and AP. Results: `work/loading-comic/desktop-results.json`.
- Loading UI desktop/landscape/portrait, cast rotation, progress, startup, reduced motion and failure checks pass. Static gzip/cache/corruption/private-storage/legacy-fallback checks pass. DPR 2 phone startup/touch checks pass.
- Independent code review found no actionable issue.
- `npm test` exits 0: all 129 native groups, seven packaging checks, one font check and four loading checks pass. Final `git diff --check` passes. Build and test logs are in `work/loading-comic/`.
- An additional existing `scripts/test-portrait-web.py` check stops because it searches for a Button caption `查看完整对话`. The unchanged portrait code puts that copy in a Label and leaves its overlay Button unnamed/without a tooltip. This check is not a pass; no unrelated portrait changes were added. Native portrait coverage and the separate real phone startup/touch check pass.
