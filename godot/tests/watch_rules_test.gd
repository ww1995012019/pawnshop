extends SceneTree
const Commerce = preload("res://scripts/model/commerce.gd")
const CrimeEvents = preload("res://scripts/model/crime_events.gd")
var failures := 0
func check(ok: bool, message: String) -> void:
	print("WATCH ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func _initialize() -> void:
	call_deferred("run")
func run() -> void:
	GameData.ensure()
	check(GameData.item_list.size() == 15 and GameData.items.size() == 15, "exactly 15 playable definitions")
	check(GameData.tool_ids == ["TOL-001", "TOL-002", "TOL-005"], "only three tools")
	var s := Model.create("WATCH-RULES")
	check(s.schema == 4 and s.inventory.all(func(it): return String(it.defId).begins_with("WCH-")), "v4 watch-only opening stock")
	var it: Dictionary = s.inventory[0]
	it.evidence = ["TOL-001", "TOL-002", "TOL-005"]
	check(not Model.estimate(it).exact and Model.estimate(it).low < Model.estimate(it).high, "inspection never gives exact price")
	var t := {"id":"test-trade", "kind":"buy", "npcId":"CHR-002", "evidenceUsed":[]}
	var terms := Model.trade_terms(s, t, it).duplicate(true)
	var recovery := Commerce.recovery_price(s, it)
	it.authentic = not it.authentic
	it.working = not it.working
	it.evidence = []
	check(Model.trade_terms(s, t, it) == terms and Commerce.recovery_price(s, it) == recovery, "NPC quotes ignore private truth and CHECK records")
	var initial_mass := WatchRules.mass(it)
	var initial_serial := WatchRules.serial(it)
	var restored: Dictionary = JSON.parse_string(JSON.stringify(it))
	check(is_equal_approx(WatchRules.mass(restored), initial_mass) and WatchRules.serial(restored) == initial_serial, "actual mass and serial survive JSON save and retries")
	var original_missing := false
	var copy_normal := false
	for index in 180:
		var sample := Model.new_item(s, "WCH-002", {"authentic": index % 2 == 0})
		if sample.authentic and sample.watch.missing_part != "": original_missing = true
		if not sample.authentic and absf(WatchRules.mass(sample) - 112.0) <= 1.5: copy_normal = true
	check(original_missing and copy_normal, "genuine watches can miss links; copies can match mass")
	var repair_item := Model.new_item(s, "WCH-002", {"watch":{"mass":108.9,"serial":"HX TEST", "logo_variant":0,"missing_part":"一节可拆表节","part_mass":3.1},"evidence":["TOL-005"]})
	Model.put_in(s, repair_item)
	s.repairProgress[repair_item.uid] = 3
	s = Model.reduce(s, {"type":"REPAIR", "uid":repair_item.uid,"recipeId":"REC-002"})
	check(is_equal_approx(WatchRules.mass(Model.find_inventory(s, repair_item.uid)),112.0), "repair restores same watch's missing physical mass")
	var anomaly := Model.new_item(s,"WCH-008",{"watch":{"mass":65.8,"serial":"HG X00 2401 123456","logo_variant":1}})
	var expert := {"id":"expert","kind":"buy","npcId":"CHR-002","evidenceUsed":[]}
	var novice := {"id":"novice","kind":"buy","npcId":"CHR-004","evidenceUsed":[]}
	Model.trade_terms(s,expert,anomaly)
	var hidden_before: Dictionary = expert.npcKnowledge.duplicate(true)
	anomaly.evidence.append("TOL-005")
	Model.trade_terms(s,expert,anomaly)
	check(expert.npcKnowledge == hidden_before, "private inspection cannot update NPC knowledge")
	Model.disclose_evidence(expert,anomaly,"TOL-005")
	Model.disclose_evidence(novice,anomaly,"TOL-005")
	check(expert.npcKnowledge[anomaly.uid].risk > novice.npcKnowledge[anomaly.uid].risk, "repairer interprets disclosed mass evidence more strongly")
	var learned: Dictionary = expert.npcKnowledge.duplicate(true)
	Model.disclose_evidence(expert,anomaly,"TOL-005")
	check(expert.npcKnowledge == learned, "repeated disclosure does not reroll or multiply judgement")
	var closure := true
	for day in range(1,22):
		for slot in 6: closure = closure and GameData.items.has(Model.market_stock(s,day,slot).defId)
	for recipe in GameData.recipes: closure = closure and GameData.items.has(recipe.itemId) and recipe.kind == "repair"
	for order in GameData.orders: closure = closure and GameData.items.has(order.itemId)
	for id in Commerce.RARE_ITEMS: closure = closure and GameData.items.has(id)
	check(closure,"daily stock, merchant, orders and repairs remain inside watch catalogue")
	var crime_found := false
	for day in range(3,20):
		var state := Model.create("CRIME-CLOSURE")
		state.day = day
		var event = CrimeEvents.event_for_day(state)
		if event != null and event.id == "CRIME-GOODS":
			state = CrimeEvents.reduce(state,{"type":"CHOOSE_EVENT","eventId":event.id,"choiceId":"CRIME-GOODS-hold"})
			crime_found = state.inventory.all(func(item):return GameData.items.has(item.defId))
	check(crime_found,"crime rewards remain inside watch catalogue")
	var trade_state := Model.reduce(Model.create("TRANSACTION"),{"type":"ARRIVE"})
	var bought_uid: String = trade_state.trade.item.uid
	trade_state = Model.reduce(trade_state,{"type":"OFFER","price":int(Model.trade_terms(trade_state,trade_state.trade,trade_state.trade.item).floor)})
	var trade_id: String = trade_state.trade.id
	trade_state = Model.reduce(trade_state,{"type":"DELIVER","tradeId":trade_id})
	check(Model.find_inventory(trade_state,bought_uid) != null and trade_state.trade == null,"ordinary buy transaction still transfers same watch")
	quit(1 if failures else 0)
