# Watch inspection implementation plan

**Goal:** Replace the playable catalogue with 15 watches, make three evidence-based inspection tools and a manual, separate NPC knowledge from item truth, clean portrait debris and animate the service bell.
**Architecture:** Godot 4.6.3. Data-driven watch definitions, instance measurements, category-specific NPC knowledge and evidence; retain existing transaction lifecycle and layouts. Work in the current `work` checkout; no push/deployment until complete.
**Spec:** ../watch-design.md and user-provided portrait/bell screenshots.

## Global constraints

Exactly 15 playable watch models, hidden category `watch`; only TOL-001 (magnifier), TOL-002 (UV), TOL-005 (scale). No SPEC. No exact post-inspection value. NPC quotes must not read private inspection state or true item state. Manual provides model reference, logo, serial format and nominal mass/tolerance. Actual mass stable across retries; nonoriginal is not always overweight; legitimate missing links explained. Back up old saves, start independent v4 watch save. Remove all old item generators and rewards. Preserve main transaction, merchant, crime, orders, storage and watch repairs.

## Interface contract

- IDs: WCH-001 through WCH-015. Tool IDs retained as above. `GameData.item_list` exactly 15.
- Definition `watch` dictionary: `brand`, `model`, `logo`, `serial_prefix`, `nominal_mass`, `tolerance`, `strap` (string). Definition also existing name,value,size,tools,description and recipeId.
- New `class_name WatchRules` at scripts/model/watch_rules.gd. Methods: `model_reference(def_id:String)->Dictionary` (returns definition.watch); `mass(it:Dictionary)->float`; `serial(it:Dictionary)->String`; `logo_variant(it:Dictionary)->int` (0 reference,1 altered); `reading(it:Dictionary,tool:String)->String`; `logo_note(it:Dictionary)->String` (observable detail).
- Actual instance metadata stored in `it.watch` (mass,serial,logo_variant,missing_part optional). UI consumes WatchRules; no NPC reads private inspection.
- Inspection page retains `_set_tool`, `tool`, `tool_buttons`, `it_uid`, `item`, `bench`, `instrument_panel`, `detail_panel`, `picker` where useful for existing routing/layout. Manual opens via `shell.open_watch_manual(def_id)` root integrates this method.
- Watch artwork: keys `watches-front`, `watches-back`, 5 cols x 3 rows, 256px cells, index 0..14, inset .035. Flat normals. Runtime overlay handles altered logos/serial details.

## Review focus

- Reroll or private CHECK changes NPC quote: knowledge regression.
- Merchant rewards/order/repair or crime introduces removed IDs: catalogue closure tests.
- Scale can record before stable or tare occupied: UI input tests.
- Portrait disconnected pixels or atlas sampling leaks: mask tests and visual inspection.
- Bell triggers two arrivals or hidden animation: input tests both scene and action button.

## Task 1 Rules and content

Owned: data/game_data.json, extra_residents.json, game_data.gd, model.gd, commerce.gd, crime_events.gd, new watch_rules.gd, model-focused new tests. First write failing catalogue, measurement and NPC knowledge tests; run RED; implement 15 definitions and compatible sources/orders/repairs/events, stable physical states, no exact estimate, NPC category expertise/knowledge, new tests GREEN. Communicate contract additions. Do not edit app save or UI.

## Task 2 Inspection UI

Owned: pages/inspect_page.gd, new UI instrument helper files and focused inspection UI tests. First failing three-tool/scale tests; implement lens actual logo detail, UV actual serial, physical stable scale with empty tare/placement/record guards, manual shortcut, touch/desktop layout. Remove SPEC and unused instruments. Preserve item pose on manual/closing. Use contract above. No model or shared UI kit edits.

## Task 3 Watch art

Owned: new watch asset generator and watch atlas files, world/item_sprite.gd, ui_kit.gd item paths only, new art tests. Create distinct pixel watches with readable logo details, backs and flat normals. Preserve existing sprite drag/flip API. Actual altered logo rendered on same instance; emit actual serial under UV via inspection helper, avoid leaking true diagnosis. Follow contract above; coordinate with inspection agent on visible details.

## Task 4 Portrait and bell fixes

Owned: bell.gd, counter_page.gd bell-related sections only, portrait import scripts and regenerated resident atlases/normals, focused new tests. Reproduce detached connected components and hidden bell root cause. Remove debris in importer while preserving connected portrait/art source; animate original painted bell rather than duplicate it; both bell click and next-customer button trigger same visible press/wobble, no double arrivals; reduced motion works.

## Task 5 Integration

Root owns app/game.gd save v4/legacy backup, shell manual/people/help changes, scripts test runner and existing regression adaptations, docs. Integrate category expertise info, fully inspect storage/orders/merchant/repair and remove stale labels/IDs/generators. Update old tests to watch semantics (do not delete unrelated coverage). Run native suite, packaging, build, export asset tests and browser phone/desktop regression. Inspect screenshots of portraits, both bell inputs and each tool/manual. Independent full diff review then fix real issues. Finish local work; user authorized implementation, no new push requested this turn.
