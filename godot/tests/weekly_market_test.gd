extends SceneTree
var failures := 0
var market
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
	print("WEEKLY MARKET ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func loaded(s: Dictionary) -> Dictionary: return JSON.parse_string(JSON.stringify(s))
func item_for(tier: String) -> Dictionary:
	for definition in GameData.item_list:
		if definition.get("tier","") == tier: return {"defId":definition.id,"authentic":true}
	return {}
func model_pricing() -> void:
	var s := Model.create("MODEL-MARKET")
	for key in ["weeklyMarket","shopUpgrades","shopJournal"]: s.erase(key)
	s.day = 8
	var it: Dictionary = s.inventory[0]
	var known := {"condition":0.8,"working":true,"authentic":true,"marketFactor":1.0,"risk":0.0,"evidence":{},"appraisedValue":100,"forgerySignature":"","provenance":"verified"}
	var base_trade := {"id":"market-model-quote","npcId":"CHR-004","kind":"sell","price":1,"locked":false,"npcKnowledge":{it.uid:known}}
	var neutral := Model.trade_terms(s,base_trade.duplicate(true),it)
	market.ensure(s)
	s.weeklyMarket.weeks["2"].hotTier = GameData.def(it.defId).tier
	s.weeklyMarket.weeks["2"].coldTier = "ultra"
	var fresh := base_trade.duplicate(true)
	var hot := Model.trade_terms(s,fresh,it)
	check(hot.value == 120,"model applies demand after NPC appraisedValue override")
	check(Model.item_value(it) == Model.item_value(s.inventory[0]) and known.appraisedValue == 100,"model market does not rewrite appraisal knowledge")
	s.weeklyMarket.weeks["2"].hotTier = "ultra"
	s.weeklyMarket.weeks["2"].coldTier = GameData.def(it.defId).tier
	check(Model.trade_terms(s,fresh,it) == hot,"existing trade keeps its first economic factors")
	var locked := base_trade.duplicate(true)
	locked.locked = true
	check(Model.trade_terms(s,locked,it) == neutral,"legacy locked agreement cannot acquire new market factors")
	s.erase("weeklyMarket")
	s.shopUpgrades = {"version":1,"extension":"display"}
	var journal = load("res://scripts/model/shop_journal.gd")
	journal.ensure(s)
	journal.customer(s,"CHR-004")
	s.shopJournal.customers["CHR-004"].trust = 6
	s.shopJournal.customers["CHR-004"].deals = 2
	var boosted := Model.trade_terms(s,base_trade.duplicate(true),it)
	check(boosted.ceiling == maxf(1,floor(neutral.ceiling*1.08*1.03)) and boosted.opening == maxf(1,floor(neutral.opening*1.08*1.03)),"display and customer memory boost only new NPC purchase ceilings and openings")
	var buy := base_trade.duplicate(true)
	buy.kind = "buy"
	check(Model.trade_terms(s,buy,it) == neutral,"display and memory never raise NPC sell-to-player terms")
	var matching := true
	for day in range(4,24):
		var preview := s.duplicate(true)
		preview.day = day
		preview.cursor = day%6
		var without_journal := preview.duplicate(true)
		without_journal.erase("shopJournal")
		var fallback := Model.market_npc_id(without_journal)
		matching = matching and Model.market_npc_id(s,day,day%6) == journal.preferred_npc(preview,fallback)
	check(matching,"ordinary model fallback uses saved customer memory and requested day/slot")
	check(Model.market_npc_id(s,1,0) == "CHR-004","customer memory cannot replace tutorial appointments")
func run() -> void:
	for player in root.find_children("*","AudioStreamPlayer",true,false):
		player.stop()
		player.stream = null
	GameData.ensure()
	if not ResourceLoader.exists("res://scripts/model/weekly_market.gd"):
		check(false,"WeeklyMarket module exists")
		quit(1)
		return
	market = load("res://scripts/model/weekly_market.gd")
	model_pricing()
	var legacy := Model.create("MARKET-LEGACY")
	legacy.erase("weeklyMarket")
	var untouched := JSON.stringify(legacy)
	check(market.multiplier(legacy,legacy.inventory[0]) == 1.0 and JSON.stringify(legacy) == untouched,"absent namespace preserves baseline without enabling itself")
	market.ensure(legacy)
	check(legacy.weeklyMarket.version == 1 and legacy.cash == 1200 and legacy.ap == 12,"ensure is additive and cannot spend")
	for day in range(1,8):
		legacy.day = day
		var neutral: Dictionary = market.current(legacy)
		check(neutral.week == 1 and neutral.hotTier == "" and neutral.coldTier == "" and neutral.hotPercent == 0 and neutral.coldPercent == 0 and market.multiplier(legacy,legacy.inventory[0]) == 1.0,"day%d onboarding market stays neutral" % day)
	var forecast_two: Dictionary = market.forecast(legacy)
	legacy.day = 8
	check(market.current(legacy) == forecast_two and market.week(legacy) == 2,"first forecast exactly matches week2 opening")
	for day in [8,15,148,1000]:
		legacy.day = day
		var snapshot: Dictionary = market.current(legacy)
		var tomorrow: Dictionary = market.forecast(legacy)
		var before := JSON.stringify(legacy)
		check(snapshot.hotTier in ["low","mid","luxury","ultra"] and snapshot.coldTier in ["low","mid","luxury","ultra"] and snapshot.hotTier != snapshot.coldTier and snapshot.hotPercent == 20 and snapshot.coldPercent == -15,"day%d schedules different visible tiers with exact demand percentages" % day)
		check(snapshot.explanation.contains("20%") and snapshot.explanation.contains("15%") and snapshot.title != "","day%d offers plain Chinese market explanation" % day)
		check(market.current(legacy) == snapshot and market.forecast(legacy) == tomorrow and JSON.stringify(legacy) == before,"day%d repeated previews have no state effects" % day)
		var restored := loaded(legacy)
		restored.seed = "must-not-reroll-saved-schedule"
		check(market.current(restored) == snapshot and market.forecast(restored) == tomorrow,"day%d current and forecast survive JSON reload" % day)
		var hot := item_for(snapshot.hotTier)
		var cold := item_for(snapshot.coldTier)
		check(market.multiplier(legacy,hot) == 1.2 and market.multiplier(legacy,cold) == 0.85,"day%d demand factors are exact" % day)
		hot.authentic = false
		hot.watch = {"actualTier":snapshot.coldTier,"serial":"hidden"}
		check(market.multiplier(legacy,hot) == 1.2,"day%d demand never depends on hidden authenticity or watch truth" % day)
		check(market.multiplier(legacy,{"defId":"unknown"}) == 1.0,"unknown visible tier is neutral")
		legacy.day = (int(snapshot.week))*7 + 1
		check(market.current(legacy) == tomorrow,"day%d forecast remains exact at next week boundary" % day)
	var disguised := {"defId":"WCH-001","authentic":true,"forgery":{"targetId":"WCH-003","methods":{"case":{"active":true,"targetId":"WCH-003"}}}}
	# Match the real completed-case treatment shape, and verify this fixture is visible.
	disguised.forgery.methods.case.merge({"completed":true,"removed":false})
	check(WatchForgery.appearance_id(disguised) == "WCH-003","fixture uses visible higher tier case")
	legacy.day = 8
	var week_two: Dictionary = market.current(legacy)
	week_two.hotTier = GameData.def("WCH-003").tier
	week_two.coldTier = GameData.def("WCH-001").tier
	legacy.weeklyMarket.weeks["2"] = week_two
	var physical := JSON.stringify(disguised)
	check(market.multiplier(legacy,disguised) == 1.2 and JSON.stringify(disguised) == physical,"visible case tier wins over actual original tier without material mutation")
	legacy.weeklyMarket.enabled = false
	check(market.multiplier(legacy,disguised) == 1.0,"explicitly disabled namespace remains neutral")
	print("WEEKLY MARKET RESULT ",failures)
	market = null
	await process_frame
	quit(1 if failures else 0)
