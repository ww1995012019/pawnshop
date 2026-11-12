class_name GameData
## Game content loaded from JSON, with optional local debug overrides.

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
	extra_npcs = JSON.parse_string(FileAccess.get_file_as_string("res://data/extra_residents.json"))
	new_residents = JSON.parse_string(FileAccess.get_file_as_string("res://data/new_residents.json"))
	_reindex()

static func _reindex() -> void:
	items = {}
	tool_ids = []
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
	recipes = raw.recipes
	orders = raw.orderDefs
	order_earliest = raw.orderEarliest
	events = raw.stationEvents
	content_clues = raw.contentClues
	faults = raw.functionFaults
	art = raw.itemArt


static func debug_snapshot() -> Dictionary:
	ensure()
	return {"content":raw.duplicate(true),"extra_npcs":extra_npcs.duplicate(true),"new_residents":new_residents.duplicate(true)}

static func apply_debug_data(bundle: Dictionary) -> void:
	raw = bundle.content.duplicate(true)
	extra_npcs = bundle.extra_npcs.duplicate(true)
	new_residents = bundle.new_residents.duplicate(true)
	_reindex()

static func def(id: String) -> Dictionary:
	ensure()
	return items[id]

static func npc(id: String) -> Dictionary:
	ensure()
	if id == "CHR-034":
		return {"id":"CHR-034","name":"梁叔","title":"店面房东","faction":"station","sprite":33,
			"line":"生意慢慢做，账要记清楚。今天来核对这一期租金。","bio":"旧港店面的房东，带着账簿与钥匙按期上门收租。",
			"desire":"核对租金并当面交付回执。","expertise":{"watch":{"logo":25,"serial":25,"structure":25,"market":40}},
			"conversations":{"identity":"叫我梁叔就好，我负责这间店面的租约。","origin":"刚从站务那边核对完租期，带账簿来收租。","goods":"今天不收旧表，只核对租金。付款后我给你回执。","destination":"收好账去隔壁维修铺，今天还有两家要拜访。"}}
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
