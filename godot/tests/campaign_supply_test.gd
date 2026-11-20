extends SceneTree

var failures := 0

func _initialize() -> void:
	call_deferred("run")

func check(passed: bool, label: String) -> void:
	print("SUPPLY90 ", "PASS " if passed else "FAIL ", label)
	if not passed:
		failures += 1

func run() -> void:
	var s := Model.create("ORBITAL-90-SUPPLY")
	s.risk = 0
	CampaignLife.set_mode(s, "story90")
	check(not Model.market_stock(s, 7, 0).get("wholesale", false), "the opening week keeps its established goods and prices")
	s.day = 8
	check(Model.market_stock(s, s.day, 0).get("wholesale", false), "registered wholesale becomes available after the first rent day")
	s = CounterDialogue.begin(Model.reduce(s, {"type":"ARRIVE"}))
	var uid: String = TradeSession.session(s).focus
	var it = Model.find_item(s, uid)
	var price: float = s.trade.price
	s = Model.reduce(s, {"type":"CHECK", "uid":uid, "tool":"TOL-001"})
	it = Model.find_item(s, uid)
	check(it.sourceVerified and price + 15.0 <= Model.estimate(it).low, "a registered clearance original leaves visible room for resale after checking it")
	s = CounterDialogue.reduce(s, CounterDialogue.action_for(s, "ACCEPT"))
	s = CounterDialogue.reduce(s, CounterDialogue.action_for(s, "DELIVER"))
	var bought = Model.find_inventory(s, uid)
	check(bought != null and bought.cost == price, "the seller honors the posted wholesale price via ordinary checkout")
	s = CounterDialogue.reduce(s, {"type":"REFUSE"})
	var loaded: Dictionary = JSON.parse_string(JSON.stringify(s))
	loaded.cursor = 2
	var extra := Model.reduce(loaded, {"type":"ARRIVE"})
	check(not extra.trade.has("campaignWholesaleUid"), "later appointments cannot mint another clearance lot on the same date after reload")
	var legacy := Model.create("ORBITAL-90-SUPPLY")
	CampaignLife.set_mode(legacy, "endless")
	legacy.day = 28
	legacy.risk = 0
	legacy = Model.reduce(legacy, {"type":"ARRIVE"})
	check(not legacy.trade.has("campaignWholesaleUid"), "legacy ongoing saves keep their own suppliers")
	print("SUPPLY90 failures=", failures)
	quit(1 if failures else 0)
