extends SceneTree
## Campaign routes use saved achievements, without posting or inventing history.
var failures := 0
var evaluation

func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("EVALUATION ","PASS " if ok else "FAIL ",message)
	if not ok: failures += 1

func maintenance(s: Dictionary, count: int) -> void:
	for index in count:
		var it := Model.new_item(s,"WCH-001",{"condition":0.6,"working":true,"watch":{"missing_part":""}})
		Model.put_in(s,it)
		var next := Model.reduce(s,{"type":"SERVICE_BEGIN","uid":it.uid})
		for step in 8:
			var task := WatchService.current(Model.find_inventory(next,it.uid))
			if task == "": break
			next=Model.reduce(next,{"type":"SERVICE_PROGRESS","uid":it.uid,"task":task,"progress":{"complete":true,"opened":false}})
			next=Model.reduce(next,{"type":"SERVICE_COMPLETE","uid":it.uid,"task":task})
		next=Model.reduce(next,{"type":"SERVICE_FINISH","uid":it.uid})
		check(Model.find_inventory(next,it.uid).repaired,"fixture completes actual maintenance")
		s.merge(next,true)

func rare_inspections(s: Dictionary, count: int) -> void:
	var ids: Array=[]
	for definition in GameData.item_list:
		if definition.tier in ["luxury","ultra"]: ids.append(definition.id)
	for index in count:
		var it := Model.new_item(s,ids[index],{"owner":"shop"})
		Model.put_in(s,it)
		var checked:=Model.reduce(s,{"type":"CHECK","uid":it.uid,"tool":"TOL-001"})
		s.merge(checked,true)

func run() -> void:
	GameData.ensure()
	if not ResourceLoader.exists("res://scripts/model/campaign_evaluation.gd"):
		check(false,"recorded campaign evaluation module exists")
		quit(1)
		return
	evaluation=load("res://scripts/model/campaign_evaluation.gd")
	var s := Model.create("EVALUATION-REAL")
	s.inventory=[]
	s.ap=100
	for id in s.materials: s.materials[id]=100
	maintenance(s,3)
	check(evaluation.summary(s).repairsCompleted==3 and evaluation.outcome(s)=="可信赖维修店","three actually completed originals establish the repair route")
	var original: Dictionary=s.inventory[0]
	var uid: String=original.uid
	s.shopJournal={"histories":{uid:[{"id":"repair/%s/1" % uid}]},"markers":{"repair/%s/1" % uid:true},"originals":{uid:{"defId":"WCH-001","repaired":true}}}
	s.serviceContracts={"entries":[{"id":"job-a","uid":uid,"status":"complete"},{"id":"unfinished","uid":"unfinished","status":"ready"}]}
	s.ledger.append({"id":"service-job-job-a","uid":uid,"serviceJobId":"job-a","kind":"service-job","amount":100,"day":1})
	check(evaluation.summary(s).repairsCompleted==3,"item, retained history, job and ledger credit the same original once")
	Model._remove_item(s,uid)
	check(evaluation.summary(s).repairsCompleted==3,"delivered originals remain credited through saved work records")
	var unfinished := Model.create("EVALUATION-UNFINISHED")
	unfinished.inventory=[]
	var part := Model.new_item(unfinished,"WCH-001",{"condition":0.6,"working":false})
	part.service.done=["dust"]
	part.refurbishment={"done":["polish"]}
	Model.put_in(unfinished,part)
	unfinished.shopJournal={"originals":{part.uid:{"defId":"WCH-001","repaired":true,"inspected":false}},"collection":{"WCH-001":{"repaired":1}}}
	check(evaluation.summary(unfinished).repairsCompleted==0,"unfinished work and superficial refurbishment never count as completed maintenance")
	var fulfilled := Model.create("EVALUATION-ORDERS")
	fulfilled.inventory=[]
	fulfilled.orders=[{"id":"ORD-001","status":"done","uid":"fixed-original"},{"id":"ORD-002","status":"done"},{"id":"ORD-003","status":"active","uid":"active-original"}]
	fulfilled.serviceContracts={"entries":[{"id":"rolling","uid":"rolling-original","status":"complete"},{"id":"cancelled","uid":"returned-original","status":"cancelled"}]}
	fulfilled.storageExpansion.completedOrderIds=["order:ORD-001","service:rolling"]
	fulfilled.ledger=[{"id":"order-ORD-001","kind":"service","amount":40,"day":1},{"id":"order-ORD-002","kind":"order","amount":50,"day":1},{"id":"service-job-rolling","serviceJobId":"rolling","uid":"rolling-original","kind":"service-job","amount":80,"day":1}]
	var done: Dictionary=evaluation.summary(fulfilled)
	check(done.fulfilledOrders==3 and done.repairDeliveries==2 and done.repairsCompleted==2,"fixed and rolling deliveries count once and distinguish repair work from procurement")
	var breadth := Model.create("EVALUATION-COLLECTION")
	breadth.inventory=[]
	rare_inspections(breadth,3)
	var same: Dictionary=breadth.inventory[0].duplicate(true)
	same.uid="duplicate-original";breadth.inventory.append(same)
	# A journal's recorded public identity is sufficient after the original departs.
	breadth.shopJournal={"originals":{"departed":{"defId":breadth.inventory[0].defId,"publicModelRecorded":true,"inspected":true,"inspectedModels":[breadth.inventory[0].defId]},"private-cache":{"defId":"WCH-078","publicModelRecorded":true,"inspected":true}}}
	check(evaluation.summary(breadth).rareModels==3 and evaluation.outcome(breadth)=="稀有收藏行","three inspected public rare model types establish collection without duplicate or unsafe cached identities")
	var mask:=Model.create("EVALUATION-PUBLIC-MODEL")
	mask.inventory=[]
	var disguised:=Model.new_item(mask,"WCH-023")
	Model.put_in(mask,disguised)
	mask=Model.reduce(mask,{"type":"CHECK","uid":disguised.uid,"tool":"TOL-001"})
	disguised=Model.find_inventory(mask,disguised.uid)
	disguised.forgery={"targetId":"WCH-033","methods":{}}
	for method in ["case","logo","serial","weight"]: WatchForgery.apply(disguised,method)
	check(evaluation.summary(mask).rareModels==0,"a past inspection of the underlying model cannot credit newly fitted rare casing")
	mask=Model.reduce(mask,{"type":"CHECK","uid":disguised.uid,"tool":"TOL-001"})
	check(evaluation.summary(mask).rareModels==1 and evaluation.summary(mask).inspectedModels==1,"masked item credits only the inspected public casing rather than exposing its hidden underlying model")
	var private_copy:=mask.duplicate(true)
	private_copy.inventory[0].authentic=not mask.inventory[0].authentic
	private_copy.inventory[0].working=not mask.inventory[0].working
	check(evaluation.summary(private_copy)==evaluation.summary(mask),"hidden authenticity and function do not alter public collection evaluation")
	var journal=load("res://scripts/model/shop_journal.gd")
	var archived:=mask.duplicate(true)
	journal.ensure(archived)
	var before_departure:=archived.duplicate(true)
	archived.ledger.append({"id":"public-original-sale","uid":disguised.uid,"kind":"sale","amount":100,"day":1})
	archived.inventory=[]
	journal.observe(before_departure,archived,{"type":"DELIVER","uid":disguised.uid})
	check(evaluation.summary(archived).rareModels==1,"journal observation retains the explicitly inspected public model after the real original leaves")
	var departed:=mask.duplicate(true)
	departed.inventory=[]
	departed.shopJournal={"originals":{disguised.uid:{"defId":"WCH-033","publicModelRecorded":true,"inspected":true,"inspectedModels":["WCH-033"]}}}
	check(evaluation.summary(departed).rareModels==1,"an exact saved public inspection model remains credited after departure")
	departed.shopJournal.originals[disguised.uid].erase("inspectedModels")
	check(evaluation.summary(departed).rareModels==0,"older lifetime-inspected flags cannot fabricate the public model inspected")
	var invalid_observation:=Model.create("EVALUATION-UNKNOWN-OBSERVATION")
	invalid_observation.inventory[0].evidence=["TOL-001"]
	invalid_observation.inventory[0].inspectionFacts={"TOL-001":{"appraisalObservation":{"schema":1,"tool":"TOL-002","unknown":true,"publicModel":"WCH-078"}}}
	check(evaluation.summary(invalid_observation).rareModels==0,"unknown or mismatched-tool records do not establish an inspected public model")
	maintenance(breadth,3)
	check(evaluation.outcome(breadth)=="可信赖维修店","repair wins a three-versus-three specialty tie")
	rare_inspections(breadth,4)
	check(evaluation.outcome(breadth)=="稀有收藏行","the larger qualifying specialty count wins")
	breadth.risk=60
	check(evaluation.outcome(breadth)=="高风险转运站","risk sixty retains its existing priority")
	var generic := Model.create("EVALUATION-GENERIC")
	generic.relations.merchant=100
	check(evaluation.outcome(generic)=="稳健旧货铺","faction standing cannot replace recorded achievements")
	generic.ledger=[{"id":"buy","amount":-100,"cost":100},{"id":"sale","amount":200,"cost":100},{"id":"principal","amount":50},{"id":"rent","amount":-40}]
	var before: String=JSON.stringify(generic)
	var totals: Dictionary=evaluation.summary(generic)
	check(totals.netCashFlow==110 and totals.cash==generic.cash,"net cash flow sums actual postings without subtracting cost again")
	check(totals.evidenceNote.contains("下限") and totals.reason.contains("3"),"legacy coverage and public route thresholds are explained")
	evaluation.summary(generic);evaluation.outcome(generic)
	check(JSON.stringify(generic)==before,"repeated evaluations never mutate resources, metadata or history")
	check(evaluation.summary(JSON.parse_string(before))==totals,"recorded results survive JSON round trip")
	var no_uid:=fulfilled.duplicate(true)
	no_uid.orders[0].erase("uid")
	no_uid.serviceContracts.entries[0].erase("uid")
	no_uid.ledger[2].erase("uid")
	check(evaluation.summary(no_uid).repairsCompleted==0 and evaluation.summary(no_uid).repairDeliveries==2,"legacy deliveries without original identity remain visible without fabricating unique repaired originals")
	var settled:=s.duplicate(true)
	settled.cash=10000;settled.day=21;settled.risk=0;settled.trade=null
	NightCrime.ensure_day(settled)
	settled=Landlord.reduce(settled,{"type":"CALL_LANDLORD"})
	settled=Landlord.reduce(settled,{"type":"PAY_RENT","tradeId":settled.trade.id})
	settled=Landlord.reduce(settled,{"type":"REFUSE"})
	settled=Model.reduce(settled,{"type":"SETTLE"})
	check(settled.outcome=="可信赖维修店" and settled.report.get("evaluation",{}).get("repairsCompleted")==3,"day21 settlement saves the actual specialty evaluation")
	check(settled.report.evaluation.cash==settled.cash and settled.report.evaluation.netCashFlow==evaluation.summary(settled).netCashFlow,"assessment snapshots include posted settlement fees without moving cash again")
	generic.outcome="稀有收藏行"
	check(evaluation.outcome(generic)=="稀有收藏行","already saved outcomes remain immutable under new criteria")
	print("EVALUATION failures=",failures)
	quit(1 if failures else 0)
