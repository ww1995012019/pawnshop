extends SceneTree
var failures := 0
var upgrades
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
	print("SHOP UPGRADES ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func ready() -> Dictionary:
	var s := Model.create("SHOP-EXTENSION")
	s.day = 3
	return s
func loaded(s: Dictionary) -> Dictionary: return JSON.parse_string(JSON.stringify(s))
func unchanged_failure(s: Dictionary, id: String, label: String) -> void:
	var original := JSON.stringify(s)
	var result: Dictionary = upgrades.reduce(s,{"type":"BUY_SHOP_EXTENSION","id":id})
	check(JSON.stringify(s) == original and result.cash == s.cash and result.ap == s.ap and result.ledger == s.ledger and result.inventory == s.inventory and result.materials == s.materials and result.get("shopUpgrades",{}) == s.get("shopUpgrades",{}) and result.notice != "",label)
func model_helpers() -> void:
	var s := ready()
	s.inventory.clear()
	var it := Model.new_item(s,"WCH-001")
	s.inventory.append(it)
	check(not Model.can_place(s,it.uid,0,6),"base model placement retains six warehouse rows")
	s.shopUpgrades = {"version":1,"extension":"storage"}
	check(Model.can_place(s,it.uid,0,6),"storage extension enables model placement in added rows")
	s.inventory.clear()
	var dimensions := Model.dimensions(it)
	for y in range(0,6,int(dimensions[1])):
		for x in range(0,10,int(dimensions[0])):
			var block := Model.new_item(s,"WCH-001")
			block.x = x
			block.y = y
			s.inventory.append(block)
	var spare := Model.new_item(s,"WCH-001")
	var position = Model.empty_cell(s,spare)
	check(position != null and position.y == 6,"storage packing searches added rows after base rows fill")
	s.shopUpgrades.extension = "workshop"
	s.phase = "report"
	s.report = {"cash":s.cash}
	var next := Model.reduce(s,{"type":"NEXT"})
	check(next.ap == 14 and next.day == 4,"workshop refills14 AP through real next-day reducer")
func run() -> void:
	for player in root.find_children("*","AudioStreamPlayer",true,false):
		player.stop()
		player.stream = null
	if not ResourceLoader.exists("res://scripts/model/shop_upgrades.gd"):
		check(false,"ShopUpgrades module exists")
		quit(1)
		return
	upgrades = load("res://scripts/model/shop_upgrades.gd")
	model_helpers()
	var s := ready()
	s.erase("shopUpgrades")
	var before_cash: float = s.cash
	upgrades.ensure(s)
	check(s.shopUpgrades == {"version":1,"extension":""} and s.cash == before_cash,"legacy extension migration never spends funds")
	var initial := JSON.stringify(s)
	check(upgrades.reduce(s,{"type":"NO_EXTENSION_ACTION"}) == null and JSON.stringify(s) == initial,"unknown actions are unhandled without mutation")
	var cards: Array = upgrades.options(s)
	check(cards.size() == 3 and JSON.stringify(s) == initial,"three extension previews do not mutate")
	for card in cards:
		check(card.availability and card.problem == "" and card.name != "" and card.effect.contains("只能选择一项") and card.effect.contains("永久"),"%s clearly describes permanent exclusive choice" % card.id)
	check(upgrades.storage_rows(s) == 6 and upgrades.daily_ap(s) == 12 and upgrades.sale_multiplier(s,s.inventory[0]) == 1.0,"unselected campaign keeps all base effects")
	unchanged_failure(s,"unknown","unknown ID fails atomically")
	var early := s.duplicate(true)
	early.day = 2
	unchanged_failure(early,"storage","day2 purchase fails atomically")
	var poor := s.duplicate(true)
	poor.cash = 239
	unchanged_failure(poor,"storage","insufficient cash fails atomically")
	var visitor := s.duplicate(true)
	visitor.trade = {"id":"visitor","kind":"buy"}
	unchanged_failure(visitor,"workshop","active visitor blocks purchase atomically")
	var ended := s.duplicate(true)
	ended.phase = "ending"
	unchanged_failure(ended,"display","business ending blocks purchase")
	ended.phase = "report"
	ended.report = {"cash":ended.cash}
	ended.outcome = "closed"
	unchanged_failure(ended,"display","finished campaign report blocks purchase")
	var closed := s.duplicate(true)
	closed.phase = "closed"
	unchanged_failure(closed,"display","other closed phases block purchase")
	closed.phase = "report"
	closed.report = null
	unchanged_failure(closed,"display","unsettled report cannot buy")
	var costs := {"storage":240,"workshop":300,"display":280}
	for id in costs:
		var previous := ready()
		previous.upgrades.lamp = true
		previous.upgrades.shelf = true
		var original := JSON.stringify(previous)
		var bought: Dictionary = upgrades.reduce(previous,{"type":"BUY_SHOP_EXTENSION","id":id})
		check(JSON.stringify(previous) == original and bought.cash == previous.cash - costs[id] and bought.ap == previous.ap and bought.nextId == previous.nextId,"%s purchase charges once without AP or ID changes" % id)
		check(bought.shopUpgrades.extension == id and bought.ledger.size() == previous.ledger.size()+1 and bought.ledger.back().kind == "upgrade" and bought.ledger.back().amount == -costs[id],"%s purchase posts exactly one upgrade ledger entry" % id)
		check(bought.inventory == previous.inventory and bought.materials == previous.materials and bought.upgrades == previous.upgrades,"%s preserves originals, stock, materials, and independent upgrades" % id)
		unchanged_failure(loaded(bought),id,"%s duplicate request cannot spend twice after reload" % id)
		unchanged_failure(loaded(bought),"display" if id != "display" else "storage","%s permanently excludes the other extensions" % id)
		check(upgrades.storage_rows(loaded(bought)) == (8 if id == "storage" else 6) and upgrades.daily_ap(loaded(bought)) == (14 if id == "workshop" else 12),"%s retained effects survive reload" % id)
		check(upgrades.sale_multiplier(bought,bought.inventory[0]) == (1.08 if id == "display" else 1.0),"%s has only its intended sale effect" % id)
	var settled := Model.reduce(ready(),{"type":"SETTLE"})
	var paid: Dictionary = upgrades.reduce(settled,{"type":"BUY_SHOP_EXTENSION","id":"display"})
	check(paid.shopUpgrades.extension == "display" and paid.report.cash == paid.cash and paid.report.upgraded == settled.report.upgraded,"settled report cash updates without consuming independent lamp/shelf upgrade")
	for changes in [{"owner":"customer"},{"owner":"pawn"},{"sourceVerified":false},{"sealed":true},{"location":"isolation"},{"orderId":"reserved"},{"graySale":true}]:
		var item: Dictionary = paid.inventory[0].duplicate(true)
		item.merge(changes,true)
		var untouched := JSON.stringify(item)
		check(upgrades.sale_multiplier(paid,item) == 1.0 and JSON.stringify(item) == untouched,"display excludes restricted goods %s" % str(changes))
	var workshop: Dictionary=upgrades.reduce(ready(),{"type":"BUY_SHOP_EXTENSION","id":"workshop"})
	workshop.ap=14
	var event=Model.event_for_state(workshop)
	if event!=null:
		var choice: Dictionary=event.choices[0]
		var changed: Dictionary=Model.reduce(workshop,{"type":"CHOOSE_EVENT","eventId":event.id,"choiceId":choice.id})
		check(changed.ap==clampf(14+float(choice.effects.get("ap",0)),0,14),"station event preserves workshop daily AP capacity")
	print("SHOP UPGRADES RESULT ",failures)
	upgrades = null
	await process_frame
	quit(1 if failures else 0)
