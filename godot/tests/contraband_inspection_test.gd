extends SceneTree
const Commerce = preload("res://scripts/model/commerce.gd")
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
	print("CONTRABAND ","PASS " if ok else "FAIL ",label)
	if not ok: failures += 1
func fresh(seed := "INSPECTION-MODEL", risk := 12.0) -> Dictionary:
	var s := Model.create(seed)
	s.day=3; s.risk=risk; s.cash=1000; s.inspection="cleared"; s.inventory=[]
	return s
func inspector_seed(risk := 100.0) -> String:
	for n in 100000:
		var seed := "CONTRABAND-%d" % n
		if Model.fnv("%s/police/inspection/3" % seed)%10000 < roundi(risk*3): return seed
	return ""
func visiting() -> Dictionary:
	var s := fresh(inspector_seed(),100)
	s.ap=0; s.cursor=Model.daily_visit_limit(s)
	return Commerce.reduce(s,{"type":"ARRIVE_INSPECTION"})
func add(s: Dictionary, options := {}) -> Dictionary:
	var item := Model.new_item(s,"WCH-002",options)
	s.inventory.append(item)
	return item
func inspect(s: Dictionary) -> Dictionary:
	return Commerce.reduce(s,{"type":"RESOLVE_INSPECTION","tradeId":s.trade.id})
func probability_tests() -> void:
	for pair in [[-10,0.0],[0,0.0],[12,0.36],[100,3.0],[150,3.0]]:
		check(is_equal_approx(NightCrime.inspection_chance(pair[0]),pair[1]),"attention percent "+str(pair[0]))
	for risk in [0.0,12.0,100.0]:
		for n in 50:
			var s := fresh("DRAW-%d" % n,risk)
			NightCrime.ensure_day(s)
			var day: Dictionary=s.nightCrime.days["3"]
			var expected: bool=Model.fnv("%s/police/inspection/3" % s.seed)%10000<roundi(risk*3)
			check(day.inspection==expected,"saved draw uses basis points "+str(risk)+"/"+str(n))
	var s := fresh("SNAPSHOT",12)
	NightCrime.ensure_day(s)
	var saved: Dictionary=s.nightCrime.days["3"].duplicate(true)
	check(is_equal_approx(float(saved.get("inspectionChancePercent",-1)),0.36),"new day saves chance percent")
	s.risk=100
	s=JSON.parse_string(JSON.stringify(s))
	NightCrime.ensure_day(s)
	check(JSON.parse_string(JSON.stringify(s.nightCrime.days["3"]))==JSON.parse_string(JSON.stringify(saved)),"reload and risk changes never redraw current day")
	check(is_equal_approx(float(NightCrime.public_report(s).inspection.get("chancePercent",-1)),0.36),"public chance uses daily snapshot")
	var old := {"inspection":true,"inspectionDone":false,"inspectionStarted":true,"inspectionSlot":5,"leniency":true,"fence":{},"fenceDone":false}
	s.nightCrime.days["3"]=old.duplicate(true)
	NightCrime.ensure_day(s)
	check(s.nightCrime.days["3"]==old,"legacy scheduled day remains byte-for-byte stable")
	s.nightCrime.days["3"].inspectionDone=true
	s.nightCrime.lastInspection={"text":"old receipt","finePaid":99,"waived":true}
	var completed: Dictionary=s.nightCrime.duplicate(true)
	NightCrime.ensure_day(s)
	check(s.nightCrime==completed,"legacy completed day and receipt preserved")
func scope_tests() -> void:
	var s := visiting()
	check(s.trade!=null and s.trade.get("inspectionVisit",false),"natural scheduled inspector arrives")
	if s.trade==null: return
	var found := add(s,{"stolen":true,"sourceVerified":false,"location":"warehouse"})
	var displayed := add(s,{"stolen":true,"sourceVerified":true,"location":"display"})
	var hidden := add(s,{"stolen":true,"location":"isolation","sealed":true})
	var unsealed := add(s,{"stolen":true,"location":"isolation","sealed":false})
	var fake := add(s,{"authentic":false,"stolen":false,"sourceVerified":false})
	var uncertain := add(s,{"sourceVerified":false})
	var customer := add(s,{"stolen":true,"owner":"customer"})
	var ordered := add(s,{"stolen":true,"orderId":"held-order"})
	var retained := [hidden,unsealed,fake,uncertain,customer,ordered].duplicate(true)
	var uid: String=found.uid
	s.nightCrime.cases=[{"id":"NIGHT-ORIGINAL","origin":"shop","lossDay":1,"culprit":"WNT-001","revealed":false,"arrested":false,"items":[{"uid":uid,"item":found.duplicate(true),"holder":"inventory","paid":false,"originalLawful":true,"payout":0,"handled":true,"resolved":false,"recovery":""}]}]
	found.crimeCaseId="NIGHT-ORIGINAL"
	var cash: float=s.cash
	var risk: float=s.risk
	var relations: Dictionary=s.relations.duplicate(true)
	var stale := Commerce.reduce(s,{"type":"RESOLVE_INSPECTION","tradeId":"wrong"})
	check(stale.inventory==s.inventory and stale.cash==cash and stale.nightCrime.lastInspection.is_empty(),"stale confirmation cannot inspect")
	var opened := Commerce.reduce(s,{"type":"OPEN_NIGHT_REPORT"})
	check(opened.inventory==s.inventory and opened.nightCrime.lastInspection.is_empty(),"opening history never starts check")
	var trade_id: String=s.trade.id
	var prepared := Commerce.reduce(s,{"type":"PREPARE_INSPECTION","tradeId":trade_id})
	check(NightCrime.public_report(prepared).inspection.prepared and prepared.trade.get("inspectionPrepared",false) and prepared.cash==s.cash and prepared.inventory==s.inventory and prepared.ap==s.ap and prepared.nightCrime.lastInspection.is_empty(),"preparation persists without starting inspection")
	check(Commerce.reduce(prepared,{"type":"PREPARE_INSPECTION","tradeId":trade_id})==prepared,"preparation is idempotent")
	check(not Commerce.reduce(s,{"type":"PREPARE_INSPECTION","tradeId":"stale"}).trade.get("inspectionPrepared",false),"preparation rejects stale trade")
	s=JSON.parse_string(JSON.stringify(prepared))
	check(s.trade.inspectionPrepared and s.nightCrime.lastInspection.is_empty(),"prepared inspector waits through reload")
	s=inspect(s)
	check(Model.find_inventory(s,uid)==null and Model.find_inventory(s,displayed.uid)==null,"all visible stolen originals confiscated")
	check(JSON.parse_string(JSON.stringify(s.inventory))==JSON.parse_string(JSON.stringify(retained)),"isolation including unsealed, nonstolen fakes, unverified and entrusted originals unchanged")
	var row: Dictionary=s.nightCrime.cases[0].items[0]
	check(row.holder=="police" and row.resolved and row.get("liabilityResolved",false),"shop-origin original goes to police custody without resurrection")
	check(s.cash==cash-30 and s.nightCrime.lastInspection.fineDue==30 and s.nightCrime.lastInspection.finePaid==30,"many originals incur exactly 30 total")
	check(s.risk==risk and JSON.parse_string(JSON.stringify(s.relations))==JSON.parse_string(JSON.stringify(relations)) and s.ap==0,"check adds no risk relation or AP penalty")
	var replay := Commerce.reduce(s,{"type":"RESOLVE_INSPECTION","tradeId":trade_id})
	check(replay.cash==s.cash and replay.inventory==s.inventory and replay.nightCrime.lastInspection==s.nightCrime.lastInspection,"repeat confirmation cannot repeat penalty")
func fine_tests() -> void:
	for count in [0,1,4]:
		for cash in [0,7,1000]:
			var s := visiting()
			if s.trade==null: check(false,"fine fixture arrives"); return
			s.cash=cash; s.nightCrime.cooperation.count=20
			s.nightCrime.days["3"].leniency=true # Old pending saves cannot waive the new flat fine.
			for n in count:
				var item := add(s,{"stolen":true,"condition":1.0})
				item.defId="WCH-074" if n%2 else "WCH-001"
			var historical := add(s,{"stolen":true,"location":"isolation"})
			s.nightCrime.cases=[{"id":"HISTORY","origin":"external","lossDay":1,"culprit":"WNT-001","revealed":false,"arrested":false,"items":[{"uid":"sold-original","item":historical.duplicate(true),"holder":"buyer","handled":true,"resolved":false,"paid":false,"payout":0,"recovery":""},{"uid":historical.uid,"item":historical.duplicate(true),"holder":"inventory","handled":true,"resolved":false,"paid":false,"payout":0,"recovery":""}]}]
			historical.crimeCaseId="HISTORY"
			var prior_case: Dictionary=s.nightCrime.cases[0].duplicate(true)
			s=inspect(s)
			var due := 30 if count>0 else 0
			check(s.nightCrime.lastInspection.fineDue==due and s.nightCrime.lastInspection.finePaid==mini(cash,due) and s.cash==maxi(0,cash-due),"flat fine count=%d cash=%d" % [count,cash])
			check(s.nightCrime.cases[0]==prior_case,"historical sold original and isolation do not trigger case liability")
			check(not s.nightCrime.lastInspection.waived,"cooperation never waives new inspection fine")
func run() -> void:
	probability_tests()
	scope_tests()
	fine_tests()
	print("CONTRABAND failures=",failures)
	quit(1 if failures else 0)
