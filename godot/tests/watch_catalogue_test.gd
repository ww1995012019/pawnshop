extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	if not ok:
		push_error(message)
		failures += 1
func run() -> void:
	GameData.ensure()
	check(GameData.items.size() == 78, "78 playable watches")
	var counts := {"low": 0, "mid": 0, "luxury": 0, "ultra": 0}
	var added := {"low": 0, "mid": 0, "luxury": 0, "ultra": 0}
	var prices := {"low": [], "mid": [], "luxury": [], "ultra": []}
	var s := Model.create("WATCH-CATALOGUE")
	for d in GameData.item_list:
		var tier: String = d.get("tier", "")
		check(counts.has(tier), d.id + " has a tier")
		if not counts.has(tier): continue
		counts[tier] += 1
		prices[tier].append(d.value)
		var number := int(String(d.id).trim_prefix("WCH-"))
		if number <= 15:
			check(d.value == 90 + number * 19, d.id + " retains old price")
		else:
			added[tier] += 1
			var marked := Model.new_item(s, d.id, {"watch": {"mass": d.watch.nominal_mass, "serial": "TEST", "logo_variant": 1}})
			check(WatchRules.reading(marked, "TOL-001").contains("道短刻线"), d.id + " altered mark reading matches its own artwork")
			if d.watch.strap == "金属带":
				var missing_found := false
				for sample_index in 40:
					var sample := Model.new_item(s, d.id)
					if sample.watch.missing_part != "":
						missing_found = true
						check(is_equal_approx(float(sample.watch.part_mass), float(d.watch.link_mass)), d.id + " missing link matches model reference")
				check(missing_found, d.id + " exercised a missing link")
			check(int(d.sprite) == number - 1 and GameData.art.has(d.id), d.id + " has deterministic sprite mapping")
		check(d.category == "watch", d.id + " retains watch category")
		var recipe: Dictionary = GameData.recipe(d.recipeId)
		check(recipe.get("itemId") == d.id and recipe.get("kind") == "repair", d.id + " matching repair recipe")
		var it := Model.new_item(s, d.id, {"working": false})
		check(WatchRules.serial(it).begins_with(d.watch.serial_prefix), d.id + " physical serial")
		check(WatchRules.mass(it) > 0 and not WatchLogo.pixels(d.id).is_empty(), d.id + " weight and logo")
		var restored: Dictionary = JSON.parse_string(JSON.stringify(it))
		check(restored.uid == it.uid and restored.defId == it.defId and WatchRules.serial(restored) == WatchRules.serial(it) and is_equal_approx(WatchRules.mass(restored), WatchRules.mass(it)) and WatchRules.logo_variant(restored) == WatchRules.logo_variant(it), d.id + " physical identity survives save")
		var repair_state := Model.create("REPAIR-" + d.id)
		it = Model.new_item(repair_state,d.id,{"condition":0.55,"working":false,"evidence":["TOL-005"],"watch":{"mass":float(d.watch.nominal_mass)-2.0,"serial":"REPAIR TEST","logo_variant":0,"missing_part":"固定部件","part_mass":2.0}})
		Model.put_in(repair_state, it)
		repair_state = service_all(repair_state,it.uid)
		var repaired: Dictionary = Model.find_inventory(repair_state, it.uid)
		check(repaired.repaired and repaired.working and is_equal_approx(WatchRules.mass(repaired), float(d.watch.nominal_mass)), d.id + " real repair restores parts")
		check(Model.estimate(it).high > 0, d.id + " can be valued")
	check(added == {"low": 21, "mid": 21, "luxury": 16, "ultra": 5}, "all appended watches classified")
	check(counts == {"low": 27, "mid": 27, "luxury": 19, "ultra": 5}, "old and new watches classified")
	if not prices.low.is_empty() and not prices.mid.is_empty() and not prices.luxury.is_empty() and not prices.ultra.is_empty():
		check(prices.low.max() < prices.mid.min() and prices.mid.max() < prices.luxury.min() and prices.luxury.max() < prices.ultra.min(), "tier price ranges do not overlap")
	print("WATCH CATALOGUE failures=", failures)
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	await process_frame
	quit(1 if failures else 0)

func service_all(s: Dictionary, uid: String) -> Dictionary:
	s = Model.reduce(s,{"type":"SERVICE_BEGIN","uid":uid})
	for step in 6:
		var task := WatchService.current(Model.find_inventory(s,uid))
		if task == "": break
		s = Model.reduce(s,{"type":"SERVICE_PROGRESS","uid":uid,"task":task,"progress":{"complete":true}})
		s = Model.reduce(s,{"type":"SERVICE_COMPLETE","uid":uid,"task":task})
	return Model.reduce(s,{"type":"SERVICE_FINISH","uid":uid})
