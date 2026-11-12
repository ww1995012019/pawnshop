extends SceneTree
var failures := 0
var rules
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("WARRANTY ","PASS " if ok else "FAIL ",message)
	if not ok: failures += 1
func state() -> Dictionary:
	var s := Model.create("WARRANTY")
	s.inventory = []
	s.ap = 100
	s.cash = 10000
	for id in s.materials: s.materials[id] = 50
	return s
func act(s: Dictionary, type: String, fields := {}) -> Dictionary:
	var a := fields.duplicate(true)
	a.type = type
	var result = rules.reduce(s,a)
	if result == null: result = Model.reduce(s,a)
	rules.observe(s,result,a)
	return result
func receipt() -> Dictionary:
	var prev := state()
	rules.ensure(prev)
	var it := Model.new_item(prev,"WCH-001",{"owner":"customer","serviceJobId":"real-job","condition":0.9,"repaired":true})
	it.service.finished = true
	Model.put_in(prev,it)
	var next := prev.duplicate(true)
	Model.ledger(next,"actual-paid","service-job","actual service",80)
	next.ledger.back().merge({"uid":it.uid,"npcId":"CHR-002","defId":it.defId})
	Model._remove_item(next,it.uid)
	rules.observe(prev,next,{"type":"DELIVER_SERVICE_CONTRACT","id":"real-job"})
	return next
func row(s: Dictionary) -> Dictionary: return rules.view(s)[0]
func accepted() -> Dictionary:
	var s := receipt()
	s.day += 2
	return act(s,"TAKE_WARRANTY_CASE",{"id":row(s).id})
func repair(s: Dictionary, uid: String) -> Dictionary:
	s = act(s,"SERVICE_BEGIN",{"uid":uid})
	for i in 8:
		var task := WatchService.current(Model.find_inventory(s,uid))
		if task == "": break
		s = act(s,"SERVICE_PROGRESS",{"uid":uid,"task":task,"progress":{"complete":true}})
		s = act(s,"SERVICE_COMPLETE",{"uid":uid,"task":task})
	return act(s,"SERVICE_FINISH",{"uid":uid})
func run() -> void:
	rules = load("res://scripts/model/warranty_cases.gd")
	check(rules != null,"warranty rules exist")
	if rules == null: quit(1); return
	var old := state()
	Model.ledger(old,"legacy","service-job","unprovable old repair",80)
	rules.ensure(old)
	check(rules.view(old).is_empty(),"no invented legacy repairs")
	var s := receipt()
	check(rules.view(s).is_empty(),"no immediate offer")
	s.day += 1
	var preview := row(s)
	check(preview.status == "upcoming" and preview.availableDay == s.day+1,"preview one day before delayed return")
	var unchanged := JSON.stringify(s)
	var public: Array = rules.view(s)
	public[0].clues.append("tamper")
	check(JSON.stringify(s) == unchanged,"detached views do not mutate physical original or resources")
	var early := act(s,"TAKE_WARRANTY_CASE",{"id":preview.id})
	check(early.inventory.is_empty(),"early acceptance blocked")
	s.day += 1
	var original: Dictionary = s.warrantyCases.entries[0].original.duplicate(true)
	var next_id: int = s.nextId
	s = act(s,"TAKE_WARRANTY_CASE",{"id":preview.id})
	var uid: String = row(s).uid
	var it: Dictionary = Model.find_inventory(s,uid)
	check(it.uid == original.uid and it.watch == original.watch and it.service.profile == original.service.profile,"same UID serial parts and movement profile return")
	check(not it.has("serviceJobId") and not it.has("orderId") and it.owner == "customer" and s.nextId == next_id,"new custody strips historical reservations without allocating UID")
	check(it.inspectionFacts.is_empty() and it.evidenceReadings.is_empty() and not it.repaired and not it.service.finished,"fresh issue and fresh inspection separate from baseline")
	var loaded: Dictionary = JSON.parse_string(JSON.stringify(s))
	rules.ensure(loaded)
	check(loaded.inventory[0].service == JSON.parse_string(JSON.stringify(it.service)),"reload never redraws repair")
	s = act(s,"FREE_WARRANTY_REPAIR",{"id":preview.id})
	check(row(s).status == "diagnosis","old readings cannot approve repair")
	var other := Model.new_item(s,"WCH-001")
	Model.put_in(s,other)
	s = act(s,"CHECK",{"uid":other.uid,"tool":"TOL-001"})
	s = act(s,"FREE_WARRANTY_REPAIR",{"id":preview.id})
	check(row(s).status == "diagnosis","different UID diagnosis cannot authorize warranty")
	s = act(s,"SERVICE_BEGIN",{"uid":uid})
	check(not Model.find_inventory(s,uid).service.active,"work requires approved resolution")
	s = act(s,"CHECK",{"uid":uid,"tool":"TOL-001"})
	s = act(s,"FREE_WARRANTY_REPAIR",{"id":preview.id})
	check(row(s).status == "approved","fresh observation authorizes free work")
	var cash: float = s.cash
	s = act(s,"DELIVER_WARRANTY_CASE",{"id":preview.id})
	check(Model.find_inventory(s,uid) != null,"approval does not fake completion")
	s = repair(s,uid)
	check(Model.find_inventory(s,uid).repaired and WatchService.finished(Model.find_inventory(s,uid)),"actual workbench clears actual issue")
	s = act(s,"DELIVER_WARRANTY_CASE",{"id":preview.id})
	check(row(s).status == "resolved" and s.cash == cash and Model.find_inventory(s,uid) == null,"free rework delivers without fee")
	check(s.warrantyCases.entries.size() == 1,"warranty delivery never loops new returns")
	var refund := accepted()
	var id: String = row(refund).id
	uid = row(refund).uid
	cash = refund.cash
	refund = act(refund,"REFUND_WARRANTY_CASE",{"id":id,"amount":81})
	check(refund.cash == cash,"refund cannot exceed actual prior fee")
	refund = act(refund,"REFUND_WARRANTY_CASE",{"id":id})
	refund = act(refund,"REFUND_WARRANTY_CASE",{"id":id})
	check(refund.cash == cash-80 and Model.find_inventory(refund,uid) == null and refund.ledger.filter(func(e):return e.kind == "service-refund").size() == 1,"refund once and return exact original")
	var cancel := accepted()
	uid = row(cancel).uid
	Model.find_inventory(cancel,uid).service.opened = true
	cancel = act(cancel,"RETURN_ITEM",{"uid":uid})
	check(Model.find_inventory(cancel,uid) != null,"legacy return cannot bypass open cover")
	Model.find_inventory(cancel,uid).service.opened = false
	cancel = act(cancel,"RETURN_ITEM",{"uid":uid})
	check(Model.find_inventory(cancel,uid) == null and row(cancel).resolution == "refused","safe legacy return records unresolved refusal")
	var full := receipt()
	full.day += 2
	for y in 6:
		for x in 10: full.inventory.append({"uid":"block-%d-%d"%[x,y],"defId":"WCH-001","location":"warehouse","rotated":false,"x":x,"y":y})
	cash = full.cash
	full = act(full,"TAKE_WARRANTY_CASE",{"id":row(full).id})
	check(full.inventory.size() == 60 and full.cash == cash and row(full).status == "available","capacity acceptance atomic")
	var expiry := accepted()
	id = row(expiry).id
	uid = row(expiry).uid
	expiry = act(expiry,"CHECK",{"uid":uid,"tool":"TOL-001"})
	expiry = act(expiry,"PAID_WARRANTY_REPAIR",{"id":id,"price":20})
	expiry.day = row(expiry).dueDay+1
	expiry = repair(expiry,uid)
	cash = expiry.cash
	expiry = act(expiry,"DELIVER_WARRANTY_CASE",{"id":id})
	check(expiry.cash == cash and Model.find_inventory(expiry,uid) != null,"expired work can close but never charge")
	expiry = act(expiry,"RETURN_WARRANTY_CASE",{"id":id})
	check(Model.find_inventory(expiry,uid) == null,"expired original safely returnable")
	var paid := accepted()
	id = row(paid).id
	uid = row(paid).uid
	paid = act(paid,"CHECK",{"uid":uid,"tool":"TOL-001"})
	paid = act(paid,"PAID_WARRANTY_REPAIR",{"id":id,"price":21})
	check(row(paid).status == "diagnosis","negotiated fee capped at twenty")
	paid = act(paid,"PAID_WARRANTY_REPAIR",{"id":id,"price":20})
	cash = paid.cash
	check(row(paid).status == "approved" and paid.cash == cash,"paid agreement takes no advance fee")
	paid = repair(paid,uid)
	paid = act(paid,"DELIVER_WARRANTY_CASE",{"id":id})
	paid = act(paid,"DELIVER_WARRANTY_CASE",{"id":id})
	var fees: Array = paid.ledger.filter(func(e):return e.get("warrantyCaseId","") == id and e.kind == "service-job")
	check(paid.cash == cash+20 and fees.size() == 1 and fees[0].uid == uid and fees[0].npcId == "CHR-002" and fees[0].defId == "WCH-001","paid completed physical work charges exact fee once with original metadata")
	check(paid.warrantyCases.entries.size() == 1,"paid warranty cannot seed a looping return")
	check(row(paid).has("trustDelta") and row(paid).has("resolution") and not row(paid).clues.is_empty(),"terminal public outcome available for memory hook")
	var duplicate := receipt()
	var repeat := duplicate.duplicate(true)
	rules.observe(duplicate,repeat,{"type":"CHECK"})
	check(repeat.warrantyCases.entries.size() == 1,"unchanged paid ledger never registers twice")
	var collide := receipt()
	collide.day += 2
	id = row(collide).id
	uid = row(collide).uid
	collide.inventory.append(collide.warrantyCases.entries[0].original.duplicate(true))
	collide = act(collide,"TAKE_WARRANTY_CASE",{"id":id})
	check(collide.inventory.size() == 1 and row(collide).status == "available","live original UID collision blocks new custody")
	collide.inventory = []
	collide.nightCrime = {"cases":[{"items":[{"uid":uid,"holder":"case","resolved":false}]}]}
	collide = act(collide,"TAKE_WARRANTY_CASE",{"id":id})
	check(collide.inventory.is_empty(),"crime-held original UID collision blocks duplication")
	var refuse := receipt()
	refuse.day += 2
	id = row(refuse).id
	refuse = act(refuse,"REJECT_WARRANTY_CASE",{"id":id})
	refuse = act(refuse,"TAKE_WARRANTY_CASE",{"id":id})
	check(row(refuse).status == "rejected" and refuse.inventory.is_empty(),"refusal cannot subsequently allocate an original")
	var missed := receipt()
	missed.day += 5
	missed = act(missed,"TAKE_WARRANTY_CASE",{"id":row(missed).id})
	check(row(missed).status == "expired" and missed.inventory.is_empty(),"three-day offer expires without generating a live original")
	var poor := accepted()
	id = row(poor).id
	uid = row(poor).uid
	poor.cash = 0
	poor = act(poor,"REFUND_WARRANTY_CASE",{"id":id})
	check(poor.cash == 0 and Model.find_inventory(poor,uid) != null,"insufficient refund funds preserve cash and original atomically")
	poor = act(poor,"RETURN_WARRANTY_CASE",{"id":id})
	check(Model.find_inventory(poor,uid) == null,"insolvent customer original remains safely returnable")
	var reserved := accepted()
	uid = row(reserved).uid
	reserved.trade = {"selectedUid":uid}
	reserved = act(reserved,"RETURN_ITEM",{"uid":uid})
	check(Model.find_inventory(reserved,uid) != null,"safe cancellation retains locked trade guard")
	reserved.trade = null
	Model.find_inventory(reserved,uid).stolen = true
	reserved = act(reserved,"RETURN_ITEM",{"uid":uid})
	check(Model.find_inventory(reserved,uid) != null,"safe cancellation retains crime ownership guard")
	for player in root.find_children("*","AudioStreamPlayer",true,false):
		player.stop()
		player.stream = null
	await create_timer(0.05).timeout
	print("WARRANTY failures=",failures)
	quit(1 if failures else 0)
