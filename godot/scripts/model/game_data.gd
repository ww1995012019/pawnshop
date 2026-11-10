class_name GameData
## Read-only game content loaded from data/game_data.json.

static var raw: Dictionary = {}
static var items := {}
static var tools: Array = []
static var tool_ids: Array = []
static var materials: Array = []
static var npcs: Array = []
static var extra_npcs: Array = []
static var new_residents: Array = []
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
	tools = raw.tools
	for t in tools:
		tool_ids.append(t.id)
	inspection_profiles = {}
	inspection_motions = {}
	materials = raw.materials
	npcs = raw.npcs
	extra_npcs = JSON.parse_string(FileAccess.get_file_as_string("res://data/extra_residents.json"))
	new_residents = JSON.parse_string(FileAccess.get_file_as_string("res://data/new_residents.json"))
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
	for n in npcs + extra_npcs + new_residents:
		if n.id == id:
			return n
	return {}

static func people() -> Array:
	ensure()
	return npcs + extra_npcs + new_residents

static func tool(id: String) -> Dictionary:
	ensure()
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
	return tool_ids.duplicate() if items.has(id) else []

static func relevant_tool(id: String, tool_id: String) -> bool:
	return applicable_tools(id).has(tool_id)

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

## Model tier is reference information, never an authentication verdict.
static func tier_label(id: String) -> String:
	return {"low": "低等", "mid": "中等", "luxury": "名贵", "ultra": "珍稀"}.get(def(id).get("tier", ""), "未分类")
