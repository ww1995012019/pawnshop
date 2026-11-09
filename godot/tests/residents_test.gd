extends SceneTree
## New characters must be real, distinct visitors with usable portraits.

var failures := 0

func _initialize() -> void:
	call_deferred("run")

func check(condition: bool, message: String) -> void:
	print("RESIDENTS ", "PASS " if condition else "FAIL ", message)
	if not condition:
		failures += 1

func run() -> void:
	GameData.ensure()
	var ids := ["CHR-010", "CHR-011", "CHR-012", "CHR-013"]
	var names := []
	var cells := []
	var kit = load("res://scripts/app/ui_kit.gd")
	for id in ids:
		var npc := GameData.npc(id)
		if not npc.is_empty():
			names.append(npc.get("name", ""))
		var cell: Dictionary = kit.npc_cell(id)
		cells.append("%s:%s" % [cell.key, cell.region])
	check(names.size() == 4 and Model.uniq(names).size() == 4 and not names.has(""),
		"four additional residents have distinct names and profiles")
	var supplier := GameData.npc("CHR-010")
	check(not supplier.is_empty() and Model.customer_need("CHR-010") == supplier.get("desire", ""),
		"the merchant's dossier describes her actual supply and recovery services")
	check(Model.uniq(cells).size() == 4 and not cells[0].begins_with("shop-residents:"),
		"all four residents use their own portraits")
	var commerce = load("res://scripts/model/commerce.gd")
	var seen := []
	for seed in 60:
		var s := Model.create("visitor-%d" % seed)
		s.day = 5
		s.cursor = 1
		if commerce.merchant_due(s):
			continue
		var result: Dictionary = commerce.reduce(s, {"type": "ARRIVE"})
		if result.trade.npcId in ids and result.trade.npcId != "CHR-010":
			seen.append(result.trade.npcId)
	check(Model.uniq(seen).size() >= 3, "new recycler, appraiser and engineer can all visit during normal play")
	print("RESIDENTS failures=", failures)
	quit(1 if failures else 0)
