extends SceneTree
## A disguise must affect a sale without rewriting the item's real attributes.

var failures := 0

func _initialize() -> void:
	call_deferred("run")

func check(condition: bool, message: String) -> void:
	print("FORGERY ", "PASS " if condition else "FAIL ", message)
	if not condition:
		failures += 1

func run() -> void:
	var game = root.get_node("Game")
	game.state = Model.create("FORGE-TEST")
	var item: Dictionary = game.state.inventory[0]
	item.authentic = false
	item.working = false
	item.condition = 0.55
	item.watch.logo_variant = 1
	var uid: String = item.uid
	var original: Dictionary = item.duplicate(true)
	var materials: Dictionary = game.state.materials.duplicate(true)
	var ap: float = game.state.ap
	game.dispatch({"type": "FORGE", "uid": uid})
	item = Model.find_inventory(game.state, uid)
	check(item.get("forgery", null) is Dictionary and game.state.ap == ap - 1 and
		game.state.materials["MAT-001"] == materials["MAT-001"] - 1 and
		game.state.materials["MAT-006"] == materials["MAT-006"] - 1,
		"disguising owned goods consumes the announced materials and one AP")
	check(item.authentic == original.authentic and item.working == original.working and
		item.condition == original.condition and item.uid == original.uid,
		"disguise does not alter authenticity, function, condition or identity")
	if item.has("forgery"):
		var copy: Dictionary = item.duplicate(true)
		copy.erase("forgery")
		var trade := {"id": "compare-sale", "npcId": "CHR-003", "kind": "sell", "evidenceUsed": []}
		check(Model.sale_eligibility(copy, "CHR-003") != null and Model.sale_eligibility(item, "CHR-003") != null,
			"logo repainting cannot hide poor condition or repair functional requirements")
		check(Model.item_value(item) == Model.item_value(copy) and WatchRules.logo_variant(item) == 0 and WatchRules.logo_variant(copy) == 1,
			"the visible mark changes while true value and wear stay unchanged")
		trade.kind = "buy"
		var purchase_quote := Model.trade_terms(game.state, trade, item)
		var hidden_change: Dictionary = item.duplicate(true)
		hidden_change.authentic = not hidden_change.authentic
		hidden_change.working = not hidden_change.working
		check(Model.trade_terms(game.state, trade, hidden_change) == purchase_quote,
			"purchase quote stays tied to NPC knowledge when hidden truth changes")
		ap = game.state.ap
		materials = game.state.materials.duplicate(true)
		game.dispatch({"type": "FORGE", "uid": uid})
		check(game.state.ap == ap and game.state.materials == materials,
			"repeating the same disguise does not consume materials again")

	game.state = Model.create("PROTECTED")
	item = game.state.inventory[0]
	item.owner = "customer"
	uid = item.uid
	ap = game.state.ap
	materials = game.state.materials.duplicate(true)
	game.dispatch({"type": "FORGE", "uid": uid})
	check(not Model.find_inventory(game.state, uid).has("forgery") and game.state.ap == ap and game.state.materials == materials,
		"customer-owned property cannot be forged")
	game.state.inventory[0].owner = "shop"
	game.state.materials["MAT-001"] = 0
	game.dispatch({"type": "FORGE", "uid": uid})
	check(not Model.find_inventory(game.state, uid).has("forgery") and game.state.ap == ap,
		"insufficient materials leave the item and AP unchanged")

	var commerce = load("res://scripts/model/commerce.gd")
	var locked_state := Model.create("FORGED-LOCKED")
	var forged_uid: String = locked_state.inventory[0].uid
	locked_state = commerce.reduce(locked_state, {"type": "FORGE", "uid": forged_uid})
	var old_uid: String = locked_state.inventory[1].uid
	locked_state.trade = {"id": "locked-sale", "npcId": "CHR-003", "kind": "sell", "item": null,
		"price": 30, "rounds": 0, "locked": true, "evidenceUsed": [], "line": "", "selectedUid": old_uid}
	var locked_result: Dictionary = commerce.reduce(locked_state, {"type": "SELECT_TRADE", "uid": forged_uid})
	check(locked_result.trade.get("selectedUid", "") == old_uid and not locked_result.trade.has("forgeryChecks") and
		locked_result.risk == locked_state.risk,
		"a locked agreement cannot trigger a new forgery check or switch goods")
	var caught := 0
	var passed := 0
	for index in 100:
		var state := Model.create("forge-risk-%d" % index)
		item = state.inventory[0]
		item.authentic = false
		item.working = false
		item.condition = 0.75
		uid = item.uid
		state = commerce.reduce(state, {"type": "FORGE", "uid": uid})
		state.trade = {"id": "buyer-%d" % index, "npcId": "CHR-003", "kind": "sell", "item": null,
			"price": 0, "rounds": 0, "locked": false, "evidenceUsed": [], "line": "",
			"selectedUid": state.inventory[1].uid}
		var before: Dictionary = state.duplicate(true)
		var after: Dictionary = commerce.reduce(state, {"type": "SELECT_TRADE", "uid": uid})
		item = Model.find_inventory(after, uid)
		if item.get("forgery", {}).get("exposed", false):
			caught += 1
			check(after.cash == before.cash and after.risk > before.risk and
				after.relations.station < before.relations.station and not after.trade.has("selectedUid"),
				"discovery rejects the fraudulent sale and damages risk and relationship")
			var second: Dictionary = commerce.reduce(after, {"type": "SELECT_TRADE", "uid": uid})
			check(second.risk == after.risk and second.relations.station == after.relations.station,
				"reselecting the same exposed item cannot repeat the penalty")
		elif after.trade.get("selectedUid", "") == uid:
			passed += 1
			var reloaded: Dictionary = JSON.parse_string(JSON.stringify(after))
			var retried: Dictionary = commerce.reduce(reloaded, {"type": "SELECT_TRADE", "uid": uid})
			check(not Model.find_inventory(retried, uid).forgery.exposed and retried.risk == after.risk,
				"a buyer's completed check is stable after save and reload")
			var price: float = after.trade.price
			var trade_id: String = after.trade.id
			var locked: Dictionary = commerce.reduce(after, {"type": "ACCEPT"})
			var sold: Dictionary = commerce.reduce(locked, {"type": "DELIVER", "tradeId": trade_id})
			check(locked.trade.locked and sold.trade == null and sold.cash == after.cash + price and
				Model.find_inventory(sold, uid) == null,
				"an undetected disguise can complete one real sale at the apparent price")
			var repeated: Dictionary = commerce.reduce(sold, {"type": "DELIVER", "tradeId": trade_id})
			check(repeated.cash == sold.cash and repeated.inventory.size() == sold.inventory.size(),
				"the same disguised item cannot be sold twice")
		if caught > 0 and passed > 0:
			break
	check(caught > 0 and passed > 0, "buyers can either detect or miss a disguise")
	print("FORGERY failures=", failures)
	quit(1 if failures else 0)
