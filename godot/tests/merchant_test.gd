extends SceneTree
## Exercise the live dispatch path: stock and money change only with a visiting merchant.

var failures := 0

func _initialize() -> void:
	call_deferred("run")

func check(condition: bool, message: String) -> void:
	print("MERCHANT ", "PASS " if condition else "FAIL ", message)
	if not condition:
		failures += 1

func run() -> void:
	var game = root.get_node("Game")
	game.state = Model.create("MERCHANT-TEST")
	var cash: float = game.state.cash
	var owned: float = game.state.materials["MAT-001"]
	game.dispatch({"type": "BUY_MATERIAL", "id": "MAT-001", "qty": 1})
	check(game.state.cash == cash and game.state.materials["MAT-001"] == owned,
		"materials cannot be bought when no merchant is present")

	# The first merchant visits after the introductory four customers.
	game.state.cursor = 4
	game.dispatch({"type": "ARRIVE"})
	var trade = game.state.trade
	var visiting: bool = trade != null and trade.kind == "merchant"
	check(visiting, "a supply merchant arrives during the first business day")
	if visiting:
		var offered: int = int(trade.stock.get("MAT-001", 0))
		check(offered >= 2, "the merchant offers ordinary repair supplies")
		cash = game.state.cash
		owned = game.state.materials["MAT-001"]
		game.dispatch({"type": "BUY_MATERIAL", "id": "MAT-001", "qty": 2})
		check(game.state.materials["MAT-001"] == owned + 2 and game.state.cash == cash - 16,
			"purchasing supplies transfers the requested quantity and price")
		check(game.state.trade.stock["MAT-001"] == offered - 2,
			"purchased supplies are deducted from merchant stock")
		var before: Dictionary = game.state.duplicate(true)
		game.dispatch({"type": "BUY_MATERIAL", "id": "MAT-001", "qty": 0})
		game.dispatch({"type": "BUY_MATERIAL", "id": "MAT-001", "qty": 999})
		check(game.state.cash == before.cash and game.state.materials == before.materials and game.state.trade.stock == before.trade.stock,
			"invalid quantities cannot consume cash or change stock")
		var saved_cash: float = game.state.cash
		game.state.cash = 0
		var stock_left: float = game.state.trade.stock["MAT-001"]
		owned = game.state.materials["MAT-001"]
		game.dispatch({"type": "BUY_MATERIAL", "id": "MAT-001", "qty": 1})
		check(game.state.cash == 0 and game.state.materials["MAT-001"] == owned and game.state.trade.stock["MAT-001"] == stock_left,
			"insufficient cash cannot reduce stock or grant materials")
		game.state.cash = saved_cash
		game.state.materials["MAT-001"] = 99999
		game.dispatch({"type": "BUY_MATERIAL", "id": "MAT-001", "qty": 1})
		check(game.state.cash == saved_cash and game.state.materials["MAT-001"] == 99999 and game.state.trade.stock["MAT-001"] == stock_left,
			"material storage limit cannot be exceeded by a merchant purchase")
		game.state.materials["MAT-001"] = owned
		game.state.cash = 1000000000
		game.dispatch({"type": "SELL_MATERIAL", "id": "MAT-001", "qty": 1})
		check(game.state.cash == 1000000000 and game.state.materials["MAT-001"] == owned,
			"selling materials cannot overflow the cash limit or lose stock")
		game.state.cash = saved_cash
		cash = game.state.cash
		owned = game.state.materials["MAT-001"]
		game.dispatch({"type": "SELL_MATERIAL", "id": "MAT-001", "qty": 1})
		check(game.state.materials["MAT-001"] == owned - 1 and game.state.cash == cash + 4,
			"surplus materials can be sold for their stated recovery value")
		game.dispatch({"type": "REFUSE"})
		cash = game.state.cash
		owned = game.state.materials["MAT-001"]
		game.dispatch({"type": "BUY_MATERIAL", "id": "MAT-001", "qty": 1})
		check(game.state.trade == null and game.state.cash == cash and game.state.materials["MAT-001"] == owned,
			"the merchant's supplies become unavailable after departure")

	var commerce = load("res://scripts/model/commerce.gd")
	var with_rare := 0
	var without_rare := 0
	var rare_state: Dictionary = {}
	for index in 80:
		var candidate := Model.create("rare-sample-%d" % index)
		candidate.cursor = 4
		candidate = commerce.reduce(candidate, {"type": "ARRIVE"})
		if candidate.trade.rare == null:
			without_rare += 1
		else:
			with_rare += 1
			rare_state = candidate
	check(with_rare > 0 and without_rare > 0, "rare goods appear on some visits but not every visit")
	if not rare_state.is_empty():
		var restored: Dictionary = JSON.parse_string(JSON.stringify(rare_state))
		var same_stock := true
		for id in rare_state.trade.stock:
			same_stock = same_stock and float(restored.trade.stock[id]) == float(rare_state.trade.stock[id])
		check(same_stock and restored.trade.rare.defId == rare_state.trade.rare.defId and
			float(restored.trade.rare.price) == float(rare_state.trade.rare.price) and restored.trade.rare.available,
			"saving and loading retains the same merchant inventory")
		var no_cash: Dictionary = restored.duplicate(true)
		no_cash.cash = no_cash.trade.rare.price - 1
		var blocked_cash: Dictionary = commerce.reduce(no_cash, {"type": "BUY_RARE_ITEM"})
		check(blocked_cash.cash == no_cash.cash and blocked_cash.inventory.size() == no_cash.inventory.size() and blocked_cash.trade.rare.available,
			"insufficient cash cannot buy or consume the rare item")
		var no_ap: Dictionary = restored.duplicate(true)
		no_ap.ap = 0
		var blocked_ap: Dictionary = commerce.reduce(no_ap, {"type": "BUY_RARE_ITEM"})
		check(blocked_ap.cash == no_ap.cash and blocked_ap.inventory.size() == no_ap.inventory.size() and blocked_ap.trade.rare.available,
			"insufficient AP cannot buy or consume the rare item")
		var no_room: Dictionary = restored.duplicate(true)
		no_room.inventory.clear()
		for slot in 30:
			var filler := Model.new_item(no_room, "WCH-002")
			Model.put_in(no_room, filler)
		var blocked: Dictionary = commerce.reduce(no_room, {"type": "BUY_RARE_ITEM"})
		check(blocked.inventory.size() == 30 and blocked.cash == no_room.cash and blocked.ap == no_room.ap and
			blocked.trade.rare.available and blocked.nextId == no_room.nextId,
			"a full warehouse does not spend money, AP or consume a rare item")
		game.state = restored
		var rare_id: String = game.state.trade.rare.defId
		var rare_price: int = int(game.state.trade.rare.price)
		var item_count: int = game.state.inventory.size()
		cash = game.state.cash
		game.dispatch({"type": "BUY_RARE_ITEM"})
		check(game.state.cash == cash - rare_price and game.state.inventory.size() == item_count + 1 and
			game.state.inventory[-1].defId == rare_id and not game.state.trade.rare.available,
			"buying rare stock transfers one actual item and deducts the listed price")
		cash = game.state.cash
		item_count = game.state.inventory.size()
		game.dispatch({"type": "BUY_RARE_ITEM"})
		check(game.state.cash == cash and game.state.inventory.size() == item_count,
			"the same rare item cannot be purchased twice")

	game.state = Model.create("SELL-OWNED")
	game.state.cursor = 4
	game.dispatch({"type": "ARRIVE"})
	var selected: Dictionary = game.state.inventory[0]
	var selected_uid: String = selected.uid
	var total: int = game.state.inventory.size()
	cash = game.state.cash
	var ap: float = game.state.ap
	game.dispatch({"type": "SELL_MERCHANT_ITEM", "uid": selected_uid})
	check(game.state.inventory.size() == total - 1 and game.state.cash > cash and game.state.ap == ap - 1,
		"the merchant buys an owned old item, paying once and consuming one AP")
	cash = game.state.cash
	game.dispatch({"type": "SELL_MERCHANT_ITEM", "uid": selected_uid})
	check(game.state.cash == cash and game.state.inventory.size() == total - 1,
		"selling an already transferred item cannot pay a second time")

	selected = game.state.inventory[0]
	selected.sourceVerified = false
	selected_uid = selected.uid
	cash = game.state.cash
	total = game.state.inventory.size()
	game.dispatch({"type": "SELL_MERCHANT_ITEM", "uid": selected_uid})
	check(game.state.cash == cash and game.state.inventory.size() == total,
		"unverified goods cannot bypass the existing source checks through the merchant")
	Model.find_inventory(game.state, selected_uid).sourceVerified = true
	game.state.cash = 1000000000
	game.dispatch({"type": "SELL_MERCHANT_ITEM", "uid": selected_uid})
	check(game.state.cash == 1000000000 and game.state.inventory.size() == total,
		"selling goods cannot overflow the cash limit or transfer the item")

	var merchant_days := 0
	var other_days := 0
	var visits_match := true
	for day in range(1, 22):
		var daily := Model.create("TWENTY-ONE-DAYS")
		daily.day = day
		var visited := false
		for slot in Model.daily_visit_limit():
			var predicted: String = commerce.next_visitor(daily)
			daily = commerce.reduce(daily, {"type": "ARRIVE"})
			if daily.trade == null or daily.trade.npcId != predicted:
				visits_match = false
				break
			visited = visited or daily.trade.kind == "merchant"
			daily = commerce.reduce(daily, {"type": "REFUSE"})
		if visited:
			merchant_days += 1
		else:
			other_days += 1
	check(visits_match and merchant_days > 0 and other_days > 0,
		"over a full game, counter previews match intermittent merchant and customer arrivals")
	print("MERCHANT failures=", failures)
	quit(1 if failures else 0)
