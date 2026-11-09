extends SceneTree
## Run against the exported PCK, not the source tree, to catch missing dynamic art.
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	if not ok:
		failures += 1
		push_error(message)
func run() -> void:
	GameData.ensure()
	# External --script files compile before exported autoload globals are
	# registered. Resolve the UI script after the deferred run has begun.
	var kit = load("res://scripts/app/ui_kit.gd")
	kit.ensure()
	check(GameData.items.size() == 33, "Export contains exactly thirty-three watch models")
	check(GameData.tool_ids == ["TOL-001", "TOL-002", "TOL-005"], "Export contains exactly three watch tools")
	for index in 33:
		var id := "WCH-%03d" % (index + 1)
		check(GameData.items.has(id) and GameData.def(id).category == "watch", "Missing exported watch: " + id)
		for back in [false, true]:
			var icon = kit.item_icon(id, back)
			check(icon != null and icon.atlas != null, "Missing exported item face: " + id)
			var cell = kit.item_cell(id, back)
			check(kit.lit_atlas(cell.key).normal_texture != null, "Missing item normal: " + cell.key)
	for family in ["orbital-items", "orbital-expansion", "orbital-annex"]:
		for face in ["front", "back"]:
			for suffix in ["", "_n"]:
				var path := "res://assets/atlas/%s-%s%s.png" % [family, face, suffix]
				check(not ResourceLoader.exists(path), "Legacy item art should not ship: " + path)
	for npc in GameData.people():
		check(kit.npc_portrait(npc.id).atlas != null, "Missing resident: " + npc.id)
		var cell = kit.npc_cell(npc.id)
		check(kit.lit_atlas(cell.key).normal_texture != null, "Missing resident normal: " + npc.id)
	for tool in GameData.tools:
		check(kit.tool_icon(tool.id).atlas != null, "Missing instrument: " + tool.id)
	for path in ["res://assets/scene/shop_pixel.png", "res://assets/scene/shop_side_wall.png", "res://assets/ui/quotation-console.png"]:
		check(load(path) != null, "Missing room/UI: " + path)
	check(not ResourceLoader.exists("res://assets/scene/counter_bg.png"), "Legacy counter art should not ship")
	check(not ResourceLoader.exists("res://assets/atlas/orbital-characters.png"), "Unused legacy residents should not ship")
	for theme in ["shop", "workbench", "storeroom", "ledger"]:
		check(not ResourceLoader.exists("res://assets/music/%s.ogg" % theme), "Room theme must load outside the initial pack: " + theme)
	print("EXPORTED ASSETS: ", GameData.items.size(), " items, ", GameData.people().size(), " residents, ", GameData.tools.size(), " instruments; failures=", failures)
	quit(1 if failures else 0)
