extends SceneTree
var failures := 0
var rules
func _initialize() -> void: call_deferred("run")
func check(ok: bool, text: String) -> void:
	print("CONTRACTS ", "PASS " if ok else "FAIL ", text)
	if not ok: failures += 1
func state(seed := "CONTRACTS") -> Dictionary:
	var s := Model.create(seed)
	s.inventory = []
	s.ap = 100
	s.cash = 10000
	for id in s.materials: s.materials[id] = 50
	return s
func act(s: Dictionary, type: String, fields := {}) -> Dictionary:
	var a: Dictionary = fields.duplicate(true)
	a.type = type
	var result = rules.reduce(s,a)
	if result == null: result = Model.reduce(s,a)
	rules.observe(s,result,a)
	return result
func row(s: Dictionary, id: String) -> Dictionary:
	for c in rules.contracts(s):
		if c.id == id: return c
	return {}
func take(s: Dictionary) -> Dictionary:
	var id: String = rules.contracts(s).filter(func(c):return c.status == "available")[0].id
	return act(s,"TAKE_SERVICE_CONTRACT",{"id":id})
func repair(s: Dictionary, uid: String) -> Dictionary:
	s = act(s,"SERVICE_BEGIN",{"uid":uid})
	for i in 8:
		var it = Model.find_inventory(s,uid)
		var task := WatchService.current(it)
		if task == "": break
		s = act(s,"SERVICE_PROGRESS",{"uid":uid,"task":task,"progress":{"complete":true,"opened":false}})
		s = act(s,"SERVICE_COMPLETE",{"uid":uid,"task":task})
	return act(s,"SERVICE_FINISH",{"uid":uid})
func run() -> void:
	rules = load("res://scripts/model/service_contracts.gd")
	check(rules != null,"contract rules exist")
	if rules == null: quit(1); return
	var s := state()
	var cash: float = s.cash
	var ap: float = s.ap
	var next_id: int = s.nextId
	var offers: Array = rules.contracts(s)
	check(offers.size() == 2 and s.cash == cash and s.ap == ap and s.nextId == next_id,"two previews spend nothing and allocate no item UID")
	var repeat := state()
	check(rules.contracts(repeat) == offers,"seed and day repeat the saved board")
	var reload: Dictionary = JSON.parse_string(JSON.stringify(s))
	check(rules.contracts(reload) == JSON.parse_string(JSON.stringify(offers)),"migration and JSON retain offers")
	check(offers.any(func(c):return c.originalParts) and offers.any(func(c):return c.dueDay == s.day+2),"daily board includes original-parts and urgent choices")
	check(offers.all(func(c):return c.budget >= 80 and c.budget <= 160 and not c.has("faults") and not c.has("working")),"public previews carry bounded terms without private faults")
	var id: String = offers[0].id
	var blocked := s.duplicate(true)
	blocked.phase = "report"
	blocked = act(blocked,"TAKE_SERVICE_CONTRACT",{"id":id})
	check(blocked.inventory.is_empty() and blocked.nextId == next_id,"closed shop refuses acceptance")
	blocked = s.duplicate(true)
	blocked.trade = {"id":"visitor"}
	blocked = act(blocked,"TAKE_SERVICE_CONTRACT",{"id":id})
	check(blocked.inventory.is_empty(),"visitor must leave before acceptance")
	blocked = s.duplicate(true)
	for y in 6:
		for x in 10:
			blocked.inventory.append({"uid":"block-%d-%d" % [x,y],"defId":"WCH-001","location":"warehouse","rotated":false,"x":x,"y":y})
	blocked = act(blocked,"TAKE_SERVICE_CONTRACT",{"id":id})
	check(blocked.nextId == next_id and blocked.cash == cash and blocked.ap == ap and blocked.inventory.size() == 60 and row(blocked,id).status == "available","full capacity rolls back UID, money, AP and terms")
	s = act(s,"TAKE_SERVICE_CONTRACT",{"id":id})
	var c := row(s,id)
	var uid: String = c.uid
	var it = Model.find_inventory(s,uid)
	check(s.inventory.size() == 1 and it.owner == "customer" and it.serviceJobId == id and not it.working and s.cash == cash and s.ap == ap,"acceptance stores one faulty customer original without payment")
	var original_save: Dictionary = JSON.parse_string(JSON.stringify(s))
	rules.ensure(original_save)
	rules.ensure(original_save)
	check(Model.find_inventory(original_save,uid).service == JSON.parse_string(JSON.stringify(it.service)) and original_save.nextId == s.nextId and original_save.inventory.size() == 1,"repeated migration and reload never redraw accepted original faults")
	var accepted_id: int = s.nextId
	s = act(s,"TAKE_SERVICE_CONTRACT",{"id":id})
	check(s.inventory.size() == 1 and s.nextId == accepted_id,"repeated acceptance never creates another original")
	s = act(s,"QUOTE_SERVICE_CONTRACT",{"id":id,"price":80})
	check(row(s,id).quote == 0,"quotation needs a recorded observation")
	s = act(s,"SERVICE_BEGIN",{"uid":uid})
	check(not Model.find_inventory(s,uid).service.active,"physical work requires approved quote")
	Model.find_inventory(s,uid).evidence.append("TOL-001")
	s = act(s,"QUOTE_SERVICE_CONTRACT",{"id":id,"price":80})
	check(row(s,id).quote == 0,"bare evidence token is not a recorded diagnosis")
	s = act(s,"CHECK",{"uid":uid,"tool":"TOL-001"})
	s = act(s,"QUOTE_SERVICE_CONTRACT",{"id":id,"price":80.5})
	check(row(s,id).quote == 0,"fractional quote is rejected")
	s = act(s,"QUOTE_SERVICE_CONTRACT",{"id":id,"price":10000001})
	check(row(s,id).status == "declined","any positive integer over budget is an explicit customer refusal")
	s = act(s,"QUOTE_SERVICE_CONTRACT",{"id":id,"price":c.budget+1})
	check(row(s,id).status == "declined" and s.cash == cash and Model.find_inventory(s,uid).owner == "customer","over-budget quote explicitly declined without losing original")
	s = act(s,"QUOTE_SERVICE_CONTRACT",{"id":id,"price":80})
	check(row(s,id).status == "approved" and row(s,id).quote == 80 and s.cash == cash,"accepted affordable re-quote authorizes work without payment")
	var before_delivery: float = s.ap
	s = act(s,"DELIVER_SERVICE_CONTRACT",{"id":id})
	check(s.ap == before_delivery and Model.find_inventory(s,uid) != null,"unrepaired original cannot deliver")
	var substitute := Model.new_item(s,c.model,{"owner":"customer","serviceJobId":id,"repaired":true})
	Model.put_in(s,substitute)
	s = repair(s,uid)
	check(row(s,id).ready and Model.find_inventory(s,uid).repaired and WatchService.finished(Model.find_inventory(s,uid)),"actual physical work makes the original ready")
	var wrong := s.duplicate(true)
	Model._remove_item(wrong,uid)
	wrong = act(wrong,"DELIVER_SERVICE_CONTRACT",{"id":id})
	check(wrong.cash == cash and row(wrong,id).status != "complete","same-model substitution cannot settle original UID")
	wrong = s.duplicate(true)
	WatchForgery.apply(Model.find_inventory(wrong,uid),"logo")
	wrong = act(wrong,"DELIVER_SERVICE_CONTRACT",{"id":id})
	check(wrong.cash == cash,"original-parts delivery rejects forgery")
	wrong = s.duplicate(true)
	Model.find_inventory(wrong,uid).refurbishment = {"done":["case"]}
	wrong = act(wrong,"DELIVER_SERVICE_CONTRACT",{"id":id})
	check(wrong.cash == cash,"original-parts delivery rejects substituted exterior")
	wrong = s.duplicate(true)
	wrong.trade = {"selectedUid":uid}
	wrong = act(wrong,"DELIVER_SERVICE_CONTRACT",{"id":id})
	check(wrong.cash == cash,"reserved original cannot settle")
	wrong = s.duplicate(true)
	wrong.ap = 0
	wrong = act(wrong,"DELIVER_SERVICE_CONTRACT",{"id":id})
	check(wrong.cash == cash and Model.find_inventory(wrong,uid) != null,"delivery without one AP cannot settle or remove original")
	before_delivery = s.ap
	s = act(s,"DELIVER_SERVICE_CONTRACT",{"id":id})
	check(s.cash == cash+80 and s.ap == before_delivery-1 and Model.find_inventory(s,uid) == null and row(s,id).status == "complete","delivery charges exactly one AP, pays agreed fee, removes original")
	var receipts: Array = s.ledger.filter(func(e):return e.kind == "service-job")
	check(receipts.size() == 1 and receipts[0].amount == 80 and receipts[0].uid == uid and receipts[0].npcId == c.npcId and receipts[0].get("defId","") == c.model,"receipt records exact fee and original/customer metadata")
	s = JSON.parse_string(JSON.stringify(s))
	s = act(s,"DELIVER_SERVICE_CONTRACT",{"id":id})
	check(s.cash == cash+80 and s.ap == before_delivery-1 and s.ledger.filter(func(e):return e.kind == "service-job").size() == 1,"settlement remains idempotent after JSON reload")
	var expired := take(state("EXPIRED"))
	c = rules.contracts(expired).filter(func(x):return x.uid != "")[0]
	expired.day = c.dueDay+1
	rules.ensure(expired)
	check(row(expired,c.id).status == "expired" and Model.find_inventory(expired,c.uid).owner == "customer" and Model.sale_eligibility(Model.find_inventory(expired,c.uid),"CHR-002") != null,"expiry preserves unsaleable customer original")
	expired.phase = "report"
	var returned := act(expired,"RETURN_SERVICE_CONTRACT",{"id":c.id})
	check(Model.find_inventory(returned,c.uid) == null and returned.cash == expired.cash and row(returned,c.id).status == "expired","expired original can return even after closing without income")
	var declined := take(state("DECLINED"))
	c = rules.contracts(declined).filter(func(x):return x.uid != "")[0]
	declined = act(declined,"CHECK",{"uid":c.uid,"tool":"TOL-001"})
	declined = act(declined,"QUOTE_SERVICE_CONTRACT",{"id":c.id,"price":c.budget+1})
	returned = act(declined,"RETURN_SERVICE_CONTRACT",{"id":c.id})
	check(Model.find_inventory(returned,c.uid) == null and row(returned,c.id).status == "cancelled" and returned.cash == declined.cash,"declined original returns without payment or conversion")
	var opened := take(state("OPENED"))
	c = rules.contracts(opened).filter(func(x):return x.uid != "")[0]
	Model.find_inventory(opened,c.uid).service.opened = true
	returned = act(opened,"RETURN_SERVICE_CONTRACT",{"id":c.id})
	check(Model.find_inventory(returned,c.uid) != null,"opened watch must be closed before returning")
	Model.find_inventory(opened,c.uid).service.opened = false
	Model.find_inventory(opened,c.uid).service.operations = {"open":{"step":1,"complete":false}}
	returned = act(opened,"RETURN_SERVICE_CONTRACT",{"id":c.id})
	check(Model.find_inventory(returned,c.uid) != null,"unfinished physical operation blocks return")
	Model.find_inventory(opened,c.uid).service.operations = {}
	opened.trade = {"selectedUid":c.uid}
	returned = act(opened,"RETURN_SERVICE_CONTRACT",{"id":c.id})
	check(Model.find_inventory(returned,c.uid) != null,"reserved original cannot return")
	var closure := take(state("EXPIRED-CLOSURE"))
	c = rules.contracts(closure).filter(func(x):return x.uid != "")[0]
	closure = act(closure,"CHECK",{"uid":c.uid,"tool":"TOL-001"})
	closure = act(closure,"QUOTE_SERVICE_CONTRACT",{"id":c.id,"price":80})
	closure = act(closure,"SERVICE_BEGIN",{"uid":c.uid})
	for task in ["dust","open"]:
		closure = act(closure,"SERVICE_PROGRESS",{"uid":c.uid,"task":task,"progress":{"complete":true}})
		closure = act(closure,"SERVICE_COMPLETE",{"uid":c.uid,"task":task})
	closure.day = c.dueDay+1
	closure = repair(closure,c.uid)
	var closure_cash: float = closure.cash
	closure = act(closure,"DELIVER_SERVICE_CONTRACT",{"id":c.id})
	check(closure.cash == closure_cash and Model.find_inventory(closure,c.uid).working and not Model.find_inventory(closure,c.uid).service.opened,"approved opened job may close safely after expiry but cannot earn income")
	closure = act(closure,"RETURN_SERVICE_CONTRACT",{"id":c.id})
	check(Model.find_inventory(closure,c.uid) == null and row(closure,c.id).status == "expired","safely closed expired job returns original")
	c = rules.contracts(opened).filter(func(x):return x.uid != "")[0]
	opened.trade = null
	Model.find_inventory(opened,c.uid).service.opened = true
	returned = act(opened,"RETURN_ITEM",{"uid":c.uid})
	check(Model.find_inventory(returned,c.uid) != null,"legacy return action cannot bypass safe closure")
	Model.find_inventory(opened,c.uid).service.opened = false
	returned = act(opened,"RETURN_ITEM",{"uid":c.uid})
	check(Model.find_inventory(returned,c.uid) == null and row(returned,c.id).status == "cancelled","legacy return action records contract cancellation")
	var cap := take(state("CAP"))
	cap = take(cap)
	cap.day += 1
	cap = take(cap)
	var fourth: Dictionary = rules.contracts(cap).filter(func(x):return x.status == "available")[0]
	var cap_next: int = cap.nextId
	cap = act(cap,"TAKE_SERVICE_CONTRACT",{"id":fourth.id})
	check(cap.inventory.size() == 3 and cap.nextId == cap_next and row(cap,fourth.id).status == "available","three held originals cap acceptance without UID allocation")
	var late := state("LATE")
	late.day = 22
	var later: Array = rules.contracts(late)
	check(later.filter(func(x):return x.status == "available").size() == 2 and later.all(func(x):return x.dueDay > 22),"fresh daily contracts continue beyond day 21")
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	await create_timer(0.05).timeout
	print("CONTRACTS failures=",failures)
	quit(1 if failures else 0)
