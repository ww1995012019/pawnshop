extends SceneTree
## Breaks if quote cash is detached from the agreed fee, trust is earned before
## delivery, public bands inspect hidden faults, or migration rewrites agreements.
var failures := 0
var contracts
const Journal = preload("res://scripts/model/shop_journal.gd")

func _initialize() -> void: call_deferred("run")

func check(ok: bool, label: String) -> void:
	print("SERVICE QUOTE ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1

func state(seed := "SERVICE-QUOTE-TRADEOFF") -> Dictionary:
	var s := Model.create(seed)
	s.inventory = []
	s.ap = 100
	s.cash = 10000
	for material in s.materials: s.materials[material] = 50
	contracts.ensure(s)
	# A hand-checked public budget exercises nonintegral percentage thresholds.
	s.serviceContracts.entries[0].budget = 101
	Journal.ensure(s)
	return s

func act(s: Dictionary, type: String, fields := {}) -> Dictionary:
	var action: Dictionary = fields.duplicate(true)
	action.type = type
	var prepared := s.duplicate(true)
	contracts.ensure(prepared)
	Journal.ensure(prepared)
	var next = contracts.reduce(prepared,action)
	if next == null: next = Model.reduce(prepared,action)
	contracts.observe(prepared,next,action)
	Journal.observe(prepared,next,action)
	return next

func job(s: Dictionary) -> Dictionary:
	return s.serviceContracts.entries[0]

func trust(s: Dictionary) -> int:
	return int(Journal.customer(s,String(job(s).npcId)).trust)

func quoted(price: int) -> Dictionary:
	var s := state()
	s = act(s,"TAKE_SERVICE_CONTRACT",{"id":job(s).id})
	s = act(s,"CHECK",{"uid":job(s).uid,"tool":"TOL-001"})
	return act(s,"QUOTE_SERVICE_CONTRACT",{"id":job(s).id,"price":price})

func repair(s: Dictionary, uid := "") -> Dictionary:
	if uid == "": uid = job(s).uid
	s = act(s,"SERVICE_BEGIN",{"uid":uid})
	for step in 8:
		var original = Model.find_inventory(s,uid)
		var task := WatchService.current(original)
		if task == "": break
		s = act(s,"SERVICE_PROGRESS",{"uid":uid,"task":task,"progress":{"complete":true,"opened":false}})
		s = act(s,"SERVICE_COMPLETE",{"uid":uid,"task":task})
	return act(s,"SERVICE_FINISH",{"uid":uid})

func legacy(s: Dictionary) -> Dictionary:
	# Represents an existing save before the pricing version/terms fields existed.
	for entry in s.serviceContracts.entries:
		entry.erase("pricingVersion")
		entry.erase("quoteTerms")
	s.serviceContracts.version = 1
	return JSON.parse_string(JSON.stringify(s))

func dispatched_repair(game, uid: String) -> void:
	game.dispatch({"type":"SERVICE_BEGIN","uid":uid})
	for step in 8:
		var task := WatchService.current(game.item(uid))
		if task == "": break
		game.dispatch({"type":"SERVICE_PROGRESS","uid":uid,"task":task,"progress":{"complete":true,"opened":false}})
		game.dispatch({"type":"SERVICE_COMPLETE","uid":uid,"task":task})
	game.dispatch({"type":"SERVICE_FINISH","uid":uid})

func run() -> void:
	contracts = load("res://scripts/model/service_contracts.gd")
	var preview := state()
	var public: Dictionary = contracts.contracts(preview)[0]
	check(public.get("goodwillMax",0) == 75 and public.get("standardMax",0) == 90,"budget 101 publicly offers goodwill through 75 and standard through 90")
	for example in [[1,"goodwill",2],[75,"goodwill",2],[76,"standard",1],[90,"standard",1],[91,"premium",0],[101,"premium",0]]:
		var terms: Dictionary = contracts.call("quote_terms",job(preview),example[0]) if contracts.has_method("quote_terms") else {}
		check(terms.get("band","") == example[1] and terms.get("trust",-1) == example[2],"price %d selects the public %s delivery reward" % [example[0],example[1]])
	var copy := preview.duplicate(true)
	copy.inventory.append({"uid":"private","authentic":false,"working":true,"cost":90000,"service":{"faults":[{"id":"battery"}]}})
	job(copy).faults = ["private draw"]
	var same := true
	if contracts.has_method("quote_terms"):
		same = contracts.call("quote_terms",job(preview),76) == contracts.call("quote_terms",job(copy),76)
	check(same and contracts.contracts(copy)[0] == public,"changing hidden work/truth/cost cannot alter public quote terms")
	for invalid in [0,-1,75.5,INF,NAN]:
		var terms: Dictionary = contracts.call("quote_terms",job(preview),invalid) if contracts.has_method("quote_terms") else {}
		check(not terms.get("valid",false),"invalid price cannot preview an earned trust reward")
	for example in [[75,2],[90,1],[101,0]]:
		var s := state()
		s = act(s,"TAKE_SERVICE_CONTRACT",{"id":job(s).id})
		s = act(s,"CHECK",{"uid":job(s).uid,"tool":"TOL-001"})
		var uid: String = job(s).uid
		var before_cash: float = s.cash
		var before_ap: float = s.ap
		var before_next: int = s.nextId
		s = act(s,"QUOTE_SERVICE_CONTRACT",{"id":job(s).id,"price":example[0]})
		var approved := JSON.stringify(job(s).get("quoteTerms",{}))
		check(s.cash == before_cash and s.ap == before_ap and s.nextId == before_next and trust(s) == 0 and job(s).status == "approved" and Model.find_inventory(s,uid) != null,"quote %d approves without cash, AP, trust or custody settlement" % example[0])
		s = act(s,"QUOTE_SERVICE_CONTRACT",{"id":job(s).id,"price":1})
		check(s.cash == before_cash and s.ap == before_ap and s.nextId == before_next and job(s).quote == example[0] and JSON.stringify(job(s).get("quoteTerms",{})) == approved,"an approved quote cannot be repriced for a different reward")
		s = repair(s)
		check(trust(s) == 0 and Journal.customer(s,String(job(s).npcId)).repairs == 1 and job(s).status == "ready","completed new-rule repair retains history but grants no pre-delivery trust")
		s = JSON.parse_string(JSON.stringify(s))
		before_cash = s.cash
		before_ap = s.ap
		s = act(s,"DELIVER_SERVICE_CONTRACT",{"id":job(s).id})
		check(s.cash == before_cash+example[0] and s.ap == before_ap-1 and trust(s) == example[1] and Model.find_inventory(s,uid) == null,"delivery at %d pays that fee and total trust %d" % [example[0],example[1]])
		var settled: Dictionary = s.duplicate(true)
		s = JSON.parse_string(JSON.stringify(s))
		s = act(s,"DELIVER_SERVICE_CONTRACT",{"id":job(s).id})
		contracts.ensure(s)
		contracts.ensure(s)
		check(s.cash == settled.cash and s.ap == settled.ap and trust(s) == example[1] and s.ledger.filter(func(row):return row.kind == "service-job").size() == 1,"repeat/reload cannot duplicate fee or trust")
		var restored: Dictionary = settled.duplicate(true)
		restored.erase("shopJournal")
		Journal.ensure(restored)
		Journal.ensure(restored)
		check(trust(restored) == example[1] and Journal.customer(restored,String(job(restored).npcId)).deals == 1,"receipt recovery preserves the frozen %d-point reward once" % example[1])
	var capped := quoted(75)
	Journal._memory(capped.shopJournal,String(job(capped).npcId)).trust = 5
	capped = repair(capped)
	capped = act(capped,"DELIVER_SERVICE_CONTRACT",{"id":job(capped).id})
	check(trust(capped) == 6,"goodwill trust respects the existing customer cap")
	for terminal in ["cancel","expire"]:
		var abandoned := repair(quoted(75))
		var abandoned_cash: float = abandoned.cash
		if terminal == "expire":
			abandoned.day = int(job(abandoned).dueDay)+1
			contracts.ensure(abandoned)
			abandoned = act(abandoned,"DELIVER_SERVICE_CONTRACT",{"id":job(abandoned).id})
		abandoned = act(abandoned,"RETURN_SERVICE_CONTRACT",{"id":job(abandoned).id})
		check(trust(abandoned) == 0 and abandoned.cash == abandoned_cash and Journal.customer(abandoned,String(job(abandoned).npcId)).repairs == 1,"%s after actual repair keeps history but earns no contract trust" % terminal)
	var retry := quoted(102)
	var retry_cash: float = retry.cash
	var retry_ap: float = retry.ap
	var retry_uid: String = job(retry).uid
	retry = act(retry,"QUOTE_SERVICE_CONTRACT",{"id":job(retry).id,"price":102})
	retry = act(retry,"QUOTE_SERVICE_CONTRACT",{"id":job(retry).id,"price":90})
	check(job(retry).quote == 90 and job(retry).get("quoteTerms",{}).get("trust",-1) == 1 and retry.cash == retry_cash and retry.ap == retry_ap and job(retry).uid == retry_uid and trust(retry) == 0,"over-budget retries never reroll terms or spend resources")
	var frozen := quoted(91)
	job(frozen).budget = 200
	contracts.ensure(frozen)
	var frozen_public: Dictionary = contracts.contracts(frozen)[0]
	check(frozen_public.get("quoteTerms",{}).get("trust",-1) == 0 and frozen_public.get("quoteTerms",{}).get("price",0) == 91 and frozen_public.get("quoteTerms",{}).get("budget",0) == 101,"approval freezes original budget, fee, band and delivery reward")
	for stage in ["approved","ready","expired"]:
		var old := legacy(quoted(101))
		if stage != "approved": old = repair(old)
		if stage == "expired":
			old.day = int(job(old).dueDay)+1
			job(old).status = "expired"
		# Stage ready/expired work was produced through real reducers; remove the
		# migration metadata again so each saved stage enters migration unversioned.
		old = legacy(old)
		var before_original: Dictionary = Model.find_inventory(old,job(old).uid).duplicate(true)
		var before_id: int = old.nextId
		contracts.ensure(old)
		contracts.ensure(old)
		check(job(old).get("pricingVersion",0) == 1 and job(old).quote == 101 and old.nextId == before_id and Model.find_inventory(old,job(old).uid) == before_original,"legacy %s migration preserves exact agreement and original" % stage)
		if stage == "approved": old = repair(old)
		if stage != "expired":
			var old_cash: float = old.cash
			old = act(old,"DELIVER_SERVICE_CONTRACT",{"id":job(old).id})
			check(old.cash == old_cash+101 and trust(old) == 2,"legacy %s keeps repair-stage and delivery trust despite premium fee" % stage)
		else:
			var old_cash: float = old.cash
			old = act(old,"DELIVER_SERVICE_CONTRACT",{"id":job(old).id})
			old = act(old,"RETURN_SERVICE_CONTRACT",{"id":job(old).id})
			check(old.cash == old_cash and trust(old) == 1,"legacy expired job keeps only its original repair-stage trust")
	var unapproved := legacy(quoted(102))
	unapproved = act(unapproved,"QUOTE_SERVICE_CONTRACT",{"id":job(unapproved).id,"price":101})
	unapproved = repair(unapproved)
	unapproved = act(unapproved,"DELIVER_SERVICE_CONTRACT",{"id":job(unapproved).id})
	check(trust(unapproved) == 0,"old unapproved offer can adopt the new public pricing terms")
	var ordinary := state("ORDINARY-REPAIR-TRUST")
	var ordinary_item := Model.new_item(ordinary,"WCH-001",{"owner":"customer","working":false,"condition":0.6,"sourceVerified":true})
	Model.put_in(ordinary,ordinary_item)
	Journal.ensure(ordinary)
	ordinary.shopJournal.originals[ordinary_item.uid].npcId = job(ordinary).npcId
	ordinary = repair(ordinary,ordinary_item.uid)
	check(trust(ordinary) == 1 and Journal.customer(ordinary,String(job(ordinary).npcId)).repairs == 1,"ordinary completed repair retains its existing repair-stage trust")
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.state = repair(quoted(101))
	var warranty_uid: String = job(game.state).uid
	var warranty_npc: String = job(game.state).npcId
	game.dispatch({"type":"DELIVER_SERVICE_CONTRACT","id":job(game.state).id})
	var warranty: Dictionary = game.state.warrantyCases.entries[0]
	game.state.day = int(warranty.availableDay)
	game.dispatch({"type":"TAKE_WARRANTY_CASE","id":warranty.id})
	game.dispatch({"type":"CHECK","uid":warranty_uid,"tool":"TOL-001"})
	game.dispatch({"type":"FREE_WARRANTY_REPAIR","id":warranty.id})
	var warranty_trust: int = Journal.customer(game.state,warranty_npc).trust
	dispatched_repair(game,warranty_uid)
	check(game.item(warranty_uid).service.finished and not game.item(warranty_uid).has("serviceJobId") and Journal.customer(game.state,warranty_npc).trust == warranty_trust+1,"a later warranty repair of the same UID retains its separate existing repair trust")
	for player in root.find_children("*","AudioStreamPlayer",true,false):
		player.stop()
		player.stream = null
	await process_frame
	print("SERVICE QUOTE failures=",failures)
	quit(1 if failures else 0)
