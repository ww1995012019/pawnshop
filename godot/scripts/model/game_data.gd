class_name GameData
## Read-only game content exported from the TypeScript sources (tools/export_data.mjs).

static var raw: Dictionary = {}
static var items := {}
static var tools: Array = []
static var tool_ids: Array = []
static var materials: Array = []
static var npcs: Array = []
static var recipes: Array = []
static var orders: Array = []
static var order_earliest := {}
static var events: Array = []
static var content_clues := {}
static var faults := {}
static var art := {}
static var item_list: Array = []

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
	materials = raw.materials
	npcs = raw.npcs
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
	for n in npcs:
		if n.id == id:
			return n
	return {}

static func tool(id: String) -> Dictionary:
	ensure()
	for t in tools:
		if t.id == id:
			return t
	return {}

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
