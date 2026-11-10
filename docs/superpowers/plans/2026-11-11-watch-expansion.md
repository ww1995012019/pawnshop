# Watch Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Expand to 78 coherent watches and implement confirmed rare supply and theft probabilities.
**Architecture:** Extend the existing procedural atlas and definition contracts; centralize fresh supply rarity/authenticity selection; extend night settlement without changing ownership or provenance.
**Tech Stack:** Godot 4.6.3, GDScript, Python/Pillow, Playwright.
**Spec:** docs/superpowers/specs/2026-11-11-watch-expansion.md

## Global Constraints

- Preserve original 33 definitions, identities, cropped art pixels, evidence and old saves, except the six explicitly repriced Star values from concurrent approved main7642914. Append WCH-034..078: low 15, mid 15, luxury 10, ultra 5. Totals 27/27/19/5.
- Ultra rarity is 0.5% per procedural fresh physical item, all five combined; counterfeit generation approximately 20%, independently sampled, including merchant luxury/ultra stock.
- Theft risk is 300 + 8 × luxury + 10 × ultra basis points; 1 each yields 318 basis points. Tier-first theft weights 80/15/4/1, absent tiers excluded.
- Protect customer/service/sealed goods and existing insurance/provenance/police/counter sessions. No rerolls of existing physical goods.
- Visual animations apply equally to genuine and fake visible models, obey reduced motion, preserve inspection visibility; static catalogue thumbnails.
- Native tests and Chromium must not run concurrently. No force pushes. Publishing is already authorized in the session.

## Review Focus

- Old atlas cells preserve old pixels despite new atlas rows (Task 1 regression).
- New model repairs, forged marks, mass and serial data remain usable (Task 1 all-model tests).
- Ultra frequency remains 0.5% across ordinary NPCs, collectors, merchants and extra goods (Task 2 deterministic sampling tests).
- Reloaded or resold originals retain truth and identity, merchant receipt does not prove authenticity (Task 2 integration tests).
- Missing target tiers and protected/customer goods do not create phantom theft or biased per-item tier weights (Task 2 tests).

### Task 1: Expand catalogue, authored artwork and rare previews

**Files:** godot/data/game_data.json; godot/data/watch_art.json; scripts/generate-watch-art.py; godot/assets/atlas/watches*; godot/scripts/model/game_data.gd (locate actual file); godot/scripts/app/ui_kit.gd; godot/scripts/ui/watch_catalogue.gd; godot/scripts/ui/watch_manual.gd; godot/scripts/world/item_sprite.gd; godot/shaders/item.gdshader; godot/tests/watch_*test.gd.

**Interfaces:** existing definition.tier gains string `ultra`; GameData.tier_label accepts it; IDs WCH-074..078 are ultra. Existing item/icon/manual interfaces remain valid. New animation metadata may live in watch_art.json and be read by ItemSprite/preview.

- [ ] Add failing catalogue/art/rare-animation tests for 78 models and tier counts 27/27/19/5; old 33 fixtures/crops unchanged; all new recipes/parts/serial/mass/altered logos usable. Replace finite-campaign assumption that every model appears with deterministic non-probability model validation (rarity distribution belongs Task 2).
- [ ] Run targeted tests and retain expected failures.
- [ ] Append data: three new low families with five models each (85–210), three mid families (220–330), two luxury families (420–1100), ultra family 穹铸 with five distinctive names 环日/极光/星仪/赤冕/月蚀 (15000/18000/22000/26000/32000; reconciled with latest Star ceiling 12000). Existing price tiers must remain nonoverlapping; current mid max 325 and luxury min 337. Complete corresponding repair recipes and sprite mappings.
- [ ] Extend deterministic generator without changing original 33 render paths. Author distinctive new cases/dials/straps and five individually recognizable rare silhouettes/materials. Atlas five columns, sixteen rows (1280×4096); update all row metadata and normal maps. Back markings stay bounded. Authentic and altered logo readings match generated marks.
- [ ] Add fourth catalogue section with tier navigation usable on mobile and animated rare detail preview. Integrate restrained distinct effects into selected physical appearance, respecting reduced motion, logo masking, forgery appearance and back face. No per-card animations.
- [ ] Run meaningful targeted tests, inspect generated art contact sheet, self-review and commit. Do not run full native suite while root Chromium runs; coordinate before tests.

### Task 2: Shared fresh supply and weighted night theft

**Files:** create godot/scripts/model/watch_supply.gd and uid; modify model.gd, commerce.gd, trade_session.gd, night_crime.gd; tier-related UI strings; add godot/tests/watch_supply_test.gd and uid, extend night_crime_test.gd; register native runner.

**Interfaces:** Task 1 provides 78 definitions and `ultra` tier. Produce `WatchSupply.pick(seed: String, key: String, pool: Array = []) -> String` and `WatchSupply.authentic(seed: String, key: String) -> bool`. Empty pool means all definitions; supplied pools preserve collector/source constraints; ultra branch sums to 0.5% if candidates exist, remainder non-ultra. Independent deterministic salts. Add `NightCrime.theft_chance_bp(s: Dictionary) -> int` and optional threshold on existing theft_draw preserving default 300.

- [ ] Write failing deterministic sampling tests for all five ultras, 0.5% combined across generated source paths, independent fake rate at least 5% in luxury/ultra cohorts, old stock unaffected, persistent NPC repeated opening unchanged; theft 300/308/310/318 bp and protected items excluded; tier-first weights unaffected by many low items, absent tiers renormalized, second selection no duplicates.
- [ ] Run and record expected failures.
- [ ] Route Model.market_stock, new merchant special stock, TradeSession extra goods/collector pool and external thief fresh stock through shared picks/authenticity. Preserve scripted opening, quests, existing inventory, merchant descriptors from old saves (missing authenticity defaults genuine), stolen originals and counter quotes. Never equate sourceVerified with authentic.
- [ ] Compute current theft threshold from eligible owned goods using visible appearance tier; preserve grace dates and settled-night idempotency. Store chance snapshot for clear reports, use tier-first sampling without replacement. Insurance continues real-item valuation; UI can show actual current risk and explain formula.
- [ ] Run targeted model/integration tests, self-review and commit. Coordinate native test use.

### Task 3: Integrated verification and publication

**Files:** scripts/test-watch-expansion-web.py if needed; build outputs via existing pipeline; release records under work/watch-expansion.

**Interfaces:** existing web touch/public state hooks and IndexedDB save fixtures; no production test-only flags.

- [ ] Full serial `npm test` with no Chromium processes. Build `npm run build:web`, regenerate font through pipeline.
- [ ] Browser verify desktop/portrait: fourth tier reachable, 78 counts, five rare preview visuals/animation and reduced motion; new stock/model physical inspection; updated night chance and existing purchase/session continuity. Use same-origin blank page before injecting saves.
- [ ] Whole-branch review; resolve important findings and rerun affected checks.
- [ ] Fetch latest remote, integrate compatible changes, push source main and stage latest gh-pages worktree with new fingerprinted pack retaining prior pack; verify artifact hashes and successful hosting workflow. No force pushes.
