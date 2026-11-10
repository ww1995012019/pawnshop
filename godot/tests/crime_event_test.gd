extends SceneTree
## Crime events use the same daily choice path and keep stolen property quarantined.

var failures := 0

func _initialize() -> void:
	call_deferred("run")

func check(ok: bool, label: String) -> void:
	print("CRIME ", "PASS " if ok else "FAIL ", label)
	if not ok:
		failures += 1

func find_day(game, kind: String) -> Dictionary:
	for sample in 30:
		var seed := "CRIME-%d" % sample
		for day in range(3, 20):
			game.state = Model.create(seed)
			game.state.day = day
			var event = game.today_event()
			if event != null and event.id == kind:
				return {"seed": seed, "day": day, "event": event}
	return {}

func run() -> void:
	var game = root.get_node("Game")
	var theft := find_day(game, "CRIME-THEFT")
	var goods := find_day(game, "CRIME-GOODS")
	check(theft.is_empty() and not goods.is_empty(), "old daytime theft is removed while suspicious-goods event remains")
	if goods.is_empty():
		quit(1)
		return
	game.state = Model.create(goods.seed)
	game.state.day = goods.day
	var stock: int = game.state.inventory.size()
	game.dispatch({"type": "CHOOSE_EVENT", "eventId": goods.event.id, "choiceId": "CRIME-GOODS-hold"})
	check(game.state.inventory.size() == stock + 1, "holding suspicious goods adds an actual item")
	var item: Dictionary = game.state.inventory[-1]
	var uid: String = item.uid
	check(item.get("stolen", false) and not item.sourceVerified and item.sealed and item.location == "isolation",
		"stolen property is identified and quarantined")
	item.evidence = ["TOL-001", "TOL-002"]
	game.state.scanned.append(uid)
	var cash: float = game.state.cash
	game.dispatch({"type": "REGISTER", "uid": uid})
	check(not game.item(uid).sourceVerified and game.state.cash == cash, "ordinary registration cannot launder stolen goods")
	var risk: float = game.state.risk
	var station: float = game.state.relations.station
	game.dispatch({"type": "REPORT_STOLEN", "uid": uid})
	check(game.item(uid) == null and game.state.risk < risk and game.state.relations.station > station,
		"reporting stolen goods removes them and improves the shop's standing")
	check(game.state.nightCrime.cooperation.count == 1,"active suspicious-goods case handover earns one cooperation credit")
	var saved = JSON.parse_string(JSON.stringify(game.state))
	check(saved.events.size() == 1 and saved.events[0].eventId == "CRIME-GOODS", "crime decisions survive JSON saves")
	print("CRIME failures=", failures)
	quit(1 if failures else 0)
