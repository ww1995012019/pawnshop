class_name GameData
## Read-only game content loaded from data/game_data.json.

static var raw: Dictionary = {}
static var items := {}
static var tools: Array = []
static var tool_ids: Array = []
static var materials: Array = []
static var npcs: Array = []
static var extra_npcs: Array = []
static var recipes: Array = []
static var orders: Array = []
static var order_earliest := {}
static var events: Array = []
static var content_clues := {}
static var faults := {}
static var art := {}
static var item_list: Array = []
static var inspection_profiles := {}
static var inspection_motions := {}

static func ensure() -> void:
	if not raw.is_empty():
		return
	raw = JSON.parse_string(FileAccess.get_file_as_string("res://data/game_data.json"))
	item_list = raw.itemDefs
	for d in raw.itemDefs:
		items[d.id] = d
	items[raw.bundleDef.id] = raw.bundleDef
	tools = raw.tools
	for t in tools:
		tool_ids.append(t.id)
	# Specific checks are evidence, but not a seventh physical instrument.
	tool_ids.append("SPEC")
	inspection_profiles = JSON.parse_string(FileAccess.get_file_as_string("res://data/inspection_profiles.json"))
	inspection_motions = JSON.parse_string(FileAccess.get_file_as_string("res://data/inspection_motion.json"))
	materials = raw.materials
	npcs = raw.npcs
	extra_npcs = JSON.parse_string(FileAccess.get_file_as_string("res://data/extra_residents.json"))
	recipes = raw.recipes
	orders = raw.orderDefs
	order_earliest = raw.orderEarliest
	events = raw.stationEvents
	content_clues = raw.contentClues
	faults = raw.functionFaults
	art = raw.itemArt

static func def(id: String) -> Dictionary:
	ensure()
	return items[id]

static func npc(id: String) -> Dictionary:
	ensure()
	for n in npcs + extra_npcs:
		if n.id == id:
			return n
	return {}

static func people() -> Array:
	ensure()
	return npcs + extra_npcs

static func tool(id: String) -> Dictionary:
	ensure()
	if id == "SPEC":
		return {"id": "SPEC", "name": "专属检测", "short": "专检", "instruction": "按物品的实际用途逐步测试。"}
	for t in tools:
		if t.id == id:
			return t
	return {}

static func inspection_profile(id: String) -> Dictionary:
	ensure()
	return inspection_profiles.get(id, {})

static func motion_profile(id: String) -> Dictionary:
	ensure()
	return inspection_motions.get(id, {})

static func applicable_tools(id: String) -> Array:
	ensure()
	var extra: Array = inspection_profile(id).get("extra", [])
	var out: Array = []
	for t in tools:
		if t.id not in ["TOL-004", "TOL-006"] or extra.has(t.id):
			out.append(t.id)
	if not inspection_profile(id).is_empty():
		out.append("SPEC")
	return out

static func relevant_tool(id: String, tool_id: String) -> bool:
	return (tool_id == "SPEC" and not inspection_profile(id).is_empty()) or def(id).tools.has(tool_id)

static func evidence_name(id: String, tool_id: String) -> String:
	if not applicable_tools(id).has(tool_id):
		return "旧版检测记录"
	return tool(tool_id).name

static func evidence_short(id: String, tool_id: String) -> String:
	return "旧证" if not applicable_tools(id).has(tool_id) else tool(tool_id).short

static func recipe(id: String) -> Dictionary:
	ensure()
	for r in recipes:
		if r.id == id:
			return r
	return {}

static func order(id: String) -> Dictionary:
	ensure()
	for o in orders:
		if o.id == id:
			return o
	return {}

static func material(id: String) -> Dictionary:
	ensure()
	for m in materials:
		if m.id == id:
			return m
	return {}
