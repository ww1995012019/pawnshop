extends SceneTree
var failures := 0
var rules
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
	print("CLAIMS ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func state() -> Dictionary:
	var s := Model.create("CLAIMS")
	s.inventory = []
	s.ap = 100
	return s
func act(s: Dictionary, type: String, fields := {}) -> Dictionary:
	var a: Dictionary = fields.duplicate(true)
	a.type = type
	var n = rules.reduce(s,a)
	if n == null: n = Model.reduce(s,a)
	rules.observe(s,n,a)
	return n
func row(s: Dictionary, id: String) -> Dictionary:
	for c in rules.view(s):
		if c.id == id: return c
	return {}
func run() -> void:
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	if not ResourceLoader.exists("res://scripts/model/ownership_claims.gd"):
		check(false,"ownership claim module exists")
		quit(1)
		return
	rules = load("res://scripts/model/ownership_claims.gd")
	var s := state()
	rules.ensure(s)
	check(rules.view(s).is_empty(),"install day has no immediate claim")
	s.day = 2
	var v: Array = rules.view(s)
	check(v.size() == 1 and v[0].status == "preview" and v[0].availableDay == 3,"one day preview follows install schedule")
	var id: String = v[0].id
	var before := s.duplicate(true)
	v[0].claimants.clear()
	rules.view(s)
	check(s == before,"view detached and allocates no UID, cash, AP or contents")
	check(rules.reduce(s,{"type":"UNKNOWN"}) == null,"unknown actions unhandled")
	check(rules.reduce(s,{"type":"ACCEPT_OWNERSHIP_CLAIM","id":"missing"}) == s,"unknown event is a no-op")
	s.day = 3
	for field in ["ap","trade","phase"]:
		var blocked := s.duplicate(true)
		blocked[field] = 0 if field == "ap" else {"id":"visitor"} if field == "trade" else "report"
		blocked = act(blocked,"ACCEPT_OWNERSHIP_CLAIM",{"id":id})
		check(blocked.inventory.is_empty() and blocked.nextId == s.nextId,"acceptance atomic guard "+field)
	var full := s.duplicate(true)
	for y in 6:
		for x in 10: full.inventory.append({"uid":"b%d-%d" % [x,y],"defId":"WCH-001","location":"warehouse","rotated":false,"x":x,"y":y})
	full = act(full,"ACCEPT_OWNERSHIP_CLAIM",{"id":id})
	check(full.inventory.size() == 60 and full.nextId == s.nextId and full.ap == s.ap,"full warehouse acceptance atomic")
	var cash: float = s.cash
	var ap: float = s.ap
	s = act(s,"ACCEPT_OWNERSHIP_CLAIM",{"id":id})
	var c := row(s,id)
	var uid: String = c.uid
	var it = Model.find_inventory(s,uid)
	check(it != null and it.owner == "customer" and it.eventClaimId == id and s.ap == ap-1 and s.cash == cash and c.dueDay == 7,"accept exact entrusted original")
	var next_id = s.nextId
	s = act(s,"ACCEPT_OWNERSHIP_CLAIM",{"id":id})
	check(s.nextId == next_id and s.inventory.size() == 1,"acceptance deduped")
	check(rules.work_problem(s,it) != "","unauthorized work blocked")
	var right := ""
	var wrong := ""
	for person in c.claimants:
		if person.statement.contains(WatchRules.serial(it)): right = person.id
		else: wrong = person.id
	s = act(s,"HANDOFF_OWNERSHIP_CLAIM",{"id":id,"claimantId":right})
	check(Model.find_inventory(s,uid) != null and s.cash == cash,"uninspected handoff blocked")
	var other := Model.new_item(s,it.defId)
	Model.put_in(s,other)
	s = act(s,"CHECK",{"uid":other.uid,"tool":"TOL-001"})
	s = act(s,"CHECK",{"uid":other.uid,"tool":"TOL-002"})
	check(row(s,id).status == "investigating","other UID evidence cannot establish match")
	s = act(s,"CHECK",{"uid":uid,"tool":"TOL-001"})
	s = act(s,"CHECK",{"uid":uid,"tool":"TOL-002"})
	check(row(s,id).status == "ready","actual original fresh tools establish match")
	s = act(s,"HANDOFF_OWNERSHIP_CLAIM",{"id":id,"claimantId":wrong})
	check(Model.find_inventory(s,uid) != null and s.cash == cash,"wrong claimant cannot receive original")
	var reloaded: Dictionary = JSON.parse_string(JSON.stringify(s))
	check(row(reloaded,id).status == "ready" and reloaded.nextId == s.nextId,"JSON numeric facts preserve ready original")
	var bare := s.duplicate(true)
	Model.find_inventory(bare,uid).inspectionFacts = {}
	check(row(bare,id).status == "investigating","tool tokens alone cannot establish match")
	var ready := s.duplicate(true)
	Model.find_inventory(s,uid).condition = 0.2
	check(row(s,id).status == "investigating","stale condition evidence blocks match")
	s = ready.duplicate(true)
	Model.find_inventory(s,uid).service.opened = true
	s = act(s,"RETURN_ITEM",{"uid":uid})
	check(Model.find_inventory(s,uid) != null and s.notice.contains("封盖"),"legacy return respects safe closure")
	Model.find_inventory(s,uid).service.opened = false
	s = act(s,"HANDOFF_OWNERSHIP_CLAIM",{"id":id,"claimantId":right})
	check(Model.find_inventory(s,uid) == null and s.cash == cash+35 and row(s,id).status == "completed","rightful handoff settles bounded reward")
	s = JSON.parse_string(JSON.stringify(s))
	s = act(s,"HANDOFF_OWNERSHIP_CLAIM",{"id":id,"claimantId":right})
	check(s.cash == cash+35 and s.ledger.filter(func(e):return e.get("eventClaimId","") == id).size() == 1,"JSON numeric replay cannot duplicate reward")
	var expired := ready.duplicate(true)
	expired.day = 8
	expired.phase = "report"
	check(row(expired,id).status == "expired" and Model.find_inventory(expired,uid) != null,"deadline preserves entrusted original")
	expired = act(expired,"RETURN_ITEM",{"uid":uid})
	check(Model.find_inventory(expired,uid) == null and expired.cash == cash and row(expired,id).status == "expired","closed expired original safely handed to station without reward")
	var station := ready.duplicate(true)
	var lawful := Model.new_item(station,"WCH-001",{"owner":"shop"})
	Model.put_in(station,lawful)
	station = act(station,"STATION_OWNERSHIP_CLAIM",{"id":id})
	check(Model.find_inventory(station,uid) == null and Model.find_inventory(station,lawful.uid) != null and station.cash == cash,"station handoff preserves lawful stock without reward")
	var unsafe := ready.duplicate(true)
	Model.find_inventory(unsafe,uid).service.operations = {"open":{"complete":false}}
	var station_button: Dictionary = row(unsafe,id).actions.back()
	unsafe = act(unsafe,"STATION_OWNERSHIP_CLAIM",{"id":id})
	check(Model.find_inventory(unsafe,uid) != null and station_button.problem == unsafe.notice,"public safe closure guard exactly matches reducer")
	var guarded := ready.duplicate(true)
	for kind in ["SERVICE_BEGIN","SERVICE_PROGRESS","SERVICE_COMPLETE","REFURB_COMPLETE","FORGE","FORGE_TARGET","DISMANTLE"]:
		var result := act(guarded,kind,{"uid":uid})
		check(result.inventory == guarded.inventory and result.cash == guarded.cash and result.ap == guarded.ap,"unauthorized action guarded "+kind)
	var declined := state()
	rules.ensure(declined)
	declined.day = 2
	rules.ensure(declined)
	declined = act(declined,"DECLINE_OWNERSHIP_CLAIM",{"id":id})
	check(row(declined,id).status == "declined" and declined.inventory.is_empty(),"refusal before custody creates no item")
	declined.day = 14
	check(rules.view(declined).size() == 2 and rules.view(declined)[1].availableDay == 15,"recurs on twelve-day cadence")
	var migrated := state()
	migrated.day = 22
	rules.ensure(migrated)
	migrated.day = 23
	check(rules.view(migrated)[0].availableDay == 24,"old save schedule begins on install day")
	rules = null
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	await create_timer(0.05).timeout
	print("CLAIMS failures=",failures)
	quit(1 if failures else 0)
