extends SceneTree
const Commerce = preload("res://scripts/model/commerce.gd")
var failures := 0
func _initialize() -> void:
	call_deferred("run")
func check(ok: bool, label: String) -> void:
	print("NIGHT ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func fresh(seed := "NIGHT-0", day := 3) -> Dictionary:
	var s := Model.create(seed)
	s.day = day
	s.cash = 10000
	s.inspection = "cleared"
	return s
func act(s: Dictionary, type: String, extra := {}) -> Dictionary:
	var a := {"type":type}
	a.merge(extra)
	# Keep explicit legacy single-original coverage alongside natural-session integration.
	if type=="ARRIVE":
		var legacy=NightCrime.reduce(s,a)
		if legacy!=null: return legacy
	return Commerce.reduce(s,a)
func theft_seed() -> String:
	for n in 10000:
		var seed := "NIGHT-%d" % n
		if Model.fnv("%s/night/theft/3" % seed) % 10000 < 300:
			return seed
	return ""
func close(s: Dictionary) -> Dictionary:
	# Resolve actual pending police visits, not a test-only force flag.
	s = act(s,"ARRIVE_INSPECTION")
	if s.trade != null and s.trade.get("inspectionVisit",false): s = act(s,"RESOLVE_INSPECTION",{"tradeId":s.trade.id})
	return act(s,"SETTLE")
func return_seed() -> String:
	for n in 100000:
		var seed := "LOOP-%d" % n
		if Model.fnv("%s/night/theft/3" % seed)%10000 < 300 and Model.fnv("%s/fence/return/5" % seed)%100 < 20:
			return seed
	return ""
func find_fence(s: Dictionary) -> Dictionary:
	while s.cursor < 6:
		s = act(s,"ARRIVE")
		if s.trade == null: break
		if s.trade.has("crimeCaseId"): return s
		if s.trade.get("inspectionVisit",false): s = act(s,"RESOLVE_INSPECTION",{"tradeId":s.trade.id})
		else: s = act(s,"REFUSE")
	return s
func theft_campaign(insured: bool) -> Dictionary:
	var s := fresh(return_seed())
	s.inventory = [s.inventory[1]]
	if insured: s = act(s,"BUY_INSURANCE")
	s = act(close(s),"NEXT")
	s = act(close(s),"NEXT")
	return s
func loop_tests(night) -> void:
	var s := theft_campaign(false)
	var uid: String = s.nightCrime.cases[0].items[0].uid
	var cash: float = s.cash
	s = find_fence(s)
	check(s.trade != null and s.trade.item.uid == uid,"thief resells same uninsured physical UID from second business day after theft")
	if s.trade == null: return
	check(night.public_report(s).cases[0].items[0].uid == uid,"public case remains readable while original is on counter")
	s = act(s,"REFUSE")
	check(s.nightCrime.cases[0].items[0].holder == "case" and s.cash == cash,"refusing thief returns exact original to case without arrest or payment")
	while s.day < 20:
		s = act(close(s),"NEXT")
		s = find_fence(s)
		if s.trade != null and s.trade.item.uid == uid: break
		if s.trade != null: s = act(s,"REFUSE")
	check(s.trade != null and s.trade.item.uid == uid,"refused original may return on later eligible day")
	if s.trade == null: return
	check(night.lost_item_problem(s) != "","model match alone is insufficient without actual serial check")
	s = act(s,"CHECK",{"uid":uid,"tool":"TOL-002"})
	check(night.lost_item_problem(s) == "","serial inspection unlocks exact lost-original report")
	var trade_id: String = s.trade.id
	cash = s.cash
	s = act(s,"REPORT_LOST_ITEM",{"tradeId":trade_id})
	check(Model.find_inventory(s,uid) != null and s.cash == cash and s.nightCrime.cooperation.count == 1,"uninsured reported original restored without purchase and one cooperation credit")
	var count: int = s.inventory.filter(func(it): return it.uid == uid).size()
	s = act(s,"REPORT_LOST_ITEM",{"tradeId":trade_id})
	check(count == 1 and s.inventory.filter(func(it): return it.uid == uid).size() == 1 and s.nightCrime.cooperation.count == 1,"repeat report cannot duplicate original or credit")
	var culprit: String = s.nightCrime.cases[0].culprit
	check(not night.thieves(s).has(culprit),"arrested thief excluded from all future crime draws")
	# Insured recovery must not deliver the paid original to the shop.
	s = theft_campaign(true)
	uid = s.nightCrime.cases[0].items[0].uid
	s = find_fence(s)
	if s.trade == null:
		check(false,"insured resale fixture arrives")
		return
	s = act(s,"CHECK",{"uid":uid,"tool":"TOL-002"})
	cash = s.cash
	s = act(s,"REPORT_LOST_ITEM",{"tradeId":s.trade.id})
	check(Model.find_inventory(s,uid) == null and s.cash == cash and s.nightCrime.cases[0].items[0].holder == "insurer","insured recovered original transfers to insurer without second payout")
	# Buying the stolen original requires explicit gray-route consent.
	s = theft_campaign(false)
	uid = s.nightCrime.cases[0].items[0].uid
	s = find_fence(s)
	if s.trade == null: return
	trade_id = s.trade.id
	s = act(s,"ACCEPT")
	check(not s.trade.locked,"unverified purchase is blocked until risk confirmation")
	s = act(s,"GRAY_TRADE",{"tradeId":trade_id,"confirmed":true})
	s = act(s,"ACCEPT")
	var risk: float = s.risk
	s = act(s,"DELIVER",{"tradeId":trade_id})
	check(Model.find_inventory(s,uid) != null and s.risk == mini(100,risk+8) and s.nightCrime.cases[0].items[0].holder == "inventory","actual gray purchase transfers one original and adds eight risk")
	cash = s.cash
	s = act(s,"REGISTER",{"uid":uid})
	check(not Model.find_inventory(s,uid).sourceVerified and s.cash == cash,"registration never launders true stolen provenance")
	# Find a real buyer and sell through the ordinary quote and delivery path.
	while s.cursor < 6:
		s = act(s,"ARRIVE")
		if s.trade == null: break
		if s.trade.get("inspectionVisit",false): s = act(s,"RESOLVE_INSPECTION",{"tradeId":s.trade.id})
		elif s.trade.kind == "sell": break
		else: s = act(s,"REFUSE")
	if s.trade != null and s.trade.kind == "sell":
		trade_id = s.trade.id
		s = act(s,"SELECT_TRADE",{"uid":uid})
		var price=CounterDialogue.current(s).context.price
		s = act(s,"GRAY_TRADE",{"tradeId":trade_id,"uid":uid,"confirmed":true,"version":TradeSession.summary(s).version,"price":price,"quote":NightCrime.gray_quote(Model.trade_item(s),price)})
		s = Commerce.reduce(s,CounterDialogue.action_for(s,"ACCEPT"))
		risk = s.risk
		s = Commerce.reduce(s,CounterDialogue.action_for(s,"DELIVER"))
		check(Model.find_inventory(s,uid) == null and s.nightCrime.cases[0].items[0].holder == "buyer" and s.risk == mini(100,risk+8),"gray resale preserves provenance, records historic handling and charges risk once")
	else: check(false,"real gray-route buyer fixture available")
	# Voluntary same-case handover followed by arrest cannot create a second credit.
	var handed := s.duplicate(true)
	var original_case: Dictionary = handed.nightCrime.cases[0]
	var surrendered := Model.new_item(handed,"WCH-002",{"stolen":true,"crimeCaseId":original_case.id,"sourceVerified":false})
	handed.inventory.append(surrendered)
	handed = act(handed,"REPORT_STOLEN",{"uid":surrendered.uid})
	var credits: int = handed.nightCrime.cooperation.count
	NightCrime.arrest(handed,original_case.culprit)
	check(credits == 1 and handed.nightCrime.cooperation.count == 1,"same case handover then culprit arrest cannot double cooperation")
	# Normal wanted reporting must also recover this thief's other cases and credit once.
	s = theft_campaign(false)
	culprit = s.nightCrime.cases[0].culprit
	uid = s.nightCrime.cases[0].items[0].uid
	WantedCases.ensure(s)
	s.police.issued = true
	s.police.wanted = [culprit]
	s.trade = {"id":"known-wanted-visit","npcId":WantedCases.profile(culprit).npcId,"kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[]}
	s = act(s,"REPORT_VISITOR",{"tradeId":"known-wanted-visit"})
	check(s.nightCrime.cases[0].arrested and Model.find_inventory(s,uid) != null and s.nightCrime.cooperation.count == 1,"existing wanted arrest recovers linked stolen originals and deduplicates case/target credit")
func additional_tests(night) -> void:
	# The paid inventory cap survives repairs unless updated; loss draw ignores policy.
	var seed := theft_seed()
	var s := fresh(seed)
	s.inventory = [s.inventory[1]]
	var before: float = Model.item_value(s.inventory[0])
	s = act(s,"BUY_INSURANCE")
	s.inventory[0].condition = 1
	s = act(close(s),"NEXT")
	check(night.public_report(s).morning.payout == before,"unconfirmed repair appreciation capped at originally confirmed value")
	var uninsured := fresh(seed)
	uninsured.inventory = [uninsured.inventory[1]]
	uninsured = act(close(uninsured),"NEXT")
	check(uninsured.nightCrime.cases[0].items[0].uid == s.nightCrime.cases[0].items[0].uid,"insurance does not change night loss identity")
	var poor := fresh(seed)
	poor.inventory = []
	poor.cash = 0
	poor = act(poor,"SETTLE")
	check(poor.phase == "open" and poor.nightCrime.nights.is_empty(),"failed fee settlement never creates night draw")
	# Known case goods cannot enter pawn storage and remain for duplicate resale.
	s = theft_campaign(false)
	s = find_fence(s)
	var uid: String = s.trade.item.uid
	var trade_id: String = s.trade.id
	s = act(s,"GRAY_TRADE",{"tradeId":trade_id,"confirmed":true})
	s = act(s,"CHECK",{"uid":uid,"tool":"TOL-001"})
	s = act(s,"CHECK",{"uid":uid,"tool":"TOL-002"})
	var cash: float = s.cash
	s = act(s,"PAWN",{"tradeId":trade_id})
	check(s.cash == cash and Model.find_inventory(s,uid) == null and s.trade != null,"case original cannot be pawned into a second physical holder")
	# A hidden illegal loss is rejected and cannot become lawful upon recovery.
	s = fresh(seed)
	s.inventory = [s.inventory[1]]
	s.inventory[0].stolen = true
	s = act(s,"BUY_INSURANCE")
	s = act(close(s),"NEXT")
	var c: Dictionary = s.nightCrime.cases[0]
	uid = c.items[0].uid
	NightCrime.arrest(s,c.culprit)
	check(Model.find_inventory(s,uid) == null and c.items[0].holder == "police","claim-rejected illegal original remains rightful owner's property on recovery")
	# Deterministic real external fence, then next-day lenient police inspection.
	seed = ""
	for n in 20000:
		var candidate := "LENIENT-%d" % n
		if Model.fnv("%s/fence/external/3" % candidate)%100 < 10 and Model.fnv("%s/police/inspection/3" % candidate)%100 >= 8 and Model.fnv("%s/police/inspection/4" % candidate)%100 < 8 and Model.fnv("%s/police/leniency/4" % candidate)%100 < 80:
			var fixture := fresh(candidate)
			fixture.risk = 0
			night.ensure_day(fixture)
			if fixture.nightCrime.days["3"].fence.get("caseId","").begins_with("EXTERNAL-"):
				seed = candidate
				break
	check(seed != "","lenient external-fence seed fixture found without production force flags")
	s = fresh(seed)
	s.risk = 0
	s.erase("nightCrime")
	s.police = {"caught":["WNT-001","WNT-002","WNT-003","WNT-004","WNT-005","WNT-006"]}
	night.ensure(s)
	s = find_fence(s)
	check(s.trade != null and s.trade.get("crimeCaseId","").begins_with("EXTERNAL-"),"ordinary external fence uses actual generated original and case")
	if s.trade == null: return
	uid = s.trade.item.uid
	trade_id = s.trade.id
	s = act(s,"GRAY_TRADE",{"tradeId":trade_id,"confirmed":true})
	s = act(s,"ACCEPT")
	s = act(s,"DELIVER",{"tradeId":trade_id})
	check(Model.find_inventory(s,uid) != null,"external fenced original can actually be acquired")
	s = act(close(s),"NEXT")
	s = act(s,"ARRIVE_INSPECTION")
	check(s.trade != null and s.trade.get("inspectionVisit",false),"next-day police arrives through saved risk draw")
	if s.trade == null: return
	cash = s.cash
	var risk: float = s.risk
	var station: float = s.relations.station
	trade_id = s.trade.id
	var saved: Dictionary = JSON.parse_string(JSON.stringify(s))
	s = act(s,"RESOLVE_INSPECTION",{"tradeId":trade_id})
	var replay := act(saved,"RESOLVE_INSPECTION",{"tradeId":trade_id})
	check(s.nightCrime.lastInspection.waived and s.cash == cash and s.risk == risk and s.relations.station == station and Model.find_inventory(s,uid) == null,"earned leniency waives every penalty but confiscates exact external stolen original")
	check(replay.cash == s.cash and replay.nightCrime.lastInspection.waived == s.nightCrime.lastInspection.waived,"inspection reload preserves leniency draw and payment outcome")
	s = act(s,"RESOLVE_INSPECTION",{"tradeId":trade_id})
	check(s.cash == cash and s.nightCrime.lastInspection.finePaid == 0,"repeat inspection resolution cannot levy another fine")
func repeat_loss_test(night) -> void:
	# Seed found by deterministic search: insured theft3, return5, theft18;
	# no intervening selected police visit takes the original first.
	var s := fresh("LOOP-63")
	s.inventory = [s.inventory[1]]
	s = act(s,"BUY_INSURANCE")
	s = act(close(s),"NEXT")
	s = act(close(s),"NEXT")
	s = find_fence(s)
	check(s.trade != null,"repeat-loss fixture offers insured original")
	if s.trade == null: return
	var uid: String = s.trade.item.uid
	var id: String = s.trade.id
	s = act(s,"GRAY_TRADE",{"tradeId":id,"confirmed":true})
	s = act(s,"ACCEPT")
	s = act(s,"DELIVER",{"tradeId":id})
	while s.day<=20 and Model.find_inventory(s,uid) != null:
		s = act(close(s),"NEXT")
	check(s.nightCrime.cases.size()==2,"same physical insured original can be lost again through actual night lifecycle")
	if s.nightCrime.cases.size()<2: return
	var first: Dictionary = s.nightCrime.cases[0].items[0]
	var second: Dictionary = s.nightCrime.cases[1].items[0]
	check(first.holder == "case-transfer" and second.holder == "case" and second.paid,"repeat loss moves sole holder and preserves insurer restitution rights")
	check(night.public_report(s).morning.payout == 0,"repeat loss cannot obtain a second payout for already-stolen original")
	NightCrime.arrest(s,s.nightCrime.cases[1].culprit)
	check(second.holder == "insurer" and Model.find_inventory(s,uid) == null,"second case recovery still transfers original to original insurer")
func return_terminal_test() -> void:
	var s := fresh("LOOP-63")
	s.inventory = [s.inventory[1]]
	s = act(close(s),"NEXT")
	s = act(close(s),"NEXT")
	s = find_fence(s)
	if s.trade == null:
		check(false,"terminal return fixture arrives")
		return
	var uid: String = s.trade.item.uid
	var id: String = s.trade.id
	s = act(s,"GRAY_TRADE",{"tradeId":id,"confirmed":true})
	s = act(s,"ACCEPT")
	s = act(s,"DELIVER",{"tradeId":id})
	s = act(s,"RETURN_ITEM",{"uid":uid})
	var c: Dictionary = s.nightCrime.cases[0]
	check(c.items[0].resolved and c.items[0].holder == "police","return action records terminal actual original disposition")
	NightCrime.arrest(s,c.culprit)
	check(Model.find_inventory(s,uid) == null and s.nightCrime.cooperation.count == 1,"later arrest cannot resurrect returned original or duplicate handover credit")
func run() -> void:
	weighted_theft_tests()
	var s := fresh()
	check(s.has("nightCrime"),"new games have saved night state")
	var night = load("res://scripts/model/night_crime.gd")
	if night == null:
		check(false,"night rule module exists")
		quit(1)
		return
	var quote: Dictionary = night.insurance_quote(s)
	var values := []
	for item in s.inventory: values.append(Model.item_value(item))
	var total := 0.0
	var highest := 0.0
	for value in values:
		total += value
		highest = maxf(highest,value)
	check(quote.premium == maxi(5,ceili(total*.005+highest*.03)),"exact insurance formula uses physical market values")
	var cash: float = s.cash
	s = act(s,"BUY_INSURANCE")
	check(s.cash == cash-quote.premium,"policy charged immediately")
	var once := s.duplicate(true)
	s = act(s,"BUY_INSURANCE")
	check(s.cash == once.cash,"repeat purchase cannot charge twice")
	var added := Model.new_item(s,"WCH-015")
	s.inventory.append(added)
	check(not night.insurance_quote(s).items[-1].covered,"new stock not covered until confirmed update")
	s = act(s,"UPDATE_INSURANCE")
	check(night.insurance_quote(s).items[-1].covered,"update covers added stock")
	var paid: float = s.nightCrime.policies["3"].paid
	s.inventory.pop_back()
	s = act(s,"UPDATE_INSURANCE")
	check(s.nightCrime.policies["3"].paid == paid,"decreasing stock never refunds premium")
	for day in [1,2,21]:
		var no := fresh("NO",day)
		check(night.insurance_problem(no) != "","no insurance outside risk nights %d" % day)
		no = close(no)
		check(no.nightCrime.nights.is_empty(),"no night theft on boundary %d" % day)
	var draws := 0
	for n in 10000:
		if night.theft_draw("DIST-%d" % n,3): draws += 1
	check(draws > 240 and draws < 360,"night theft frequency approximately three percent")
	var seed := theft_seed()
	s = fresh(seed)
	s = act(s,"BUY_INSURANCE")
	s = close(s)
	check(s.phase == "report" and s.nightCrime.nights["3"].settled,"successful settlement locks the night")
	var stock: int = s.inventory.size()
	var night_saved: Dictionary = s.nightCrime.nights.duplicate(true)
	s = act(s,"SETTLE")
	check(s.nightCrime.nights == night_saved and s.inventory.size() == stock,"repeated close does not reroll or remove yet")
	s = act(s,"NEXT")
	check(s.inventory.size() < stock and not s.nightCrime.cases.is_empty(),"morning moves actual inventory into a saved case")
	var report: Dictionary = night.public_report(s)
	check(report.unread and report.morning.losses.size() > 0 and report.morning.payout > 0,"morning exposes persistent losses and actual payout")
	check(not JSON.stringify(report).contains("culprit") and not JSON.stringify(report).contains('"stolen":'),"public projection conceals culprit and hidden stolen truth")
	cash = s.cash
	stock = s.inventory.size()
	s = act(s,"NEXT")
	s = act(s,"ACK_NIGHT_REPORT")
	s = act(s,"ACK_NIGHT_REPORT")
	check(s.cash == cash and s.inventory.size() == stock and not night.public_report(s).unread,"morning and acknowledgement never pay or lose twice")
	var restored: Dictionary = JSON.parse_string(JSON.stringify(s))
	night.ensure(restored)
	check(JSON.parse_string(JSON.stringify(restored.nightCrime)) == JSON.parse_string(JSON.stringify(s.nightCrime)),"night records round-trip through JSON")
	var old := fresh()
	old.erase("nightCrime")
	old.phase = "report"
	old.police = {"caught":["WNT-001","WNT-002"]}
	night.ensure(old)
	check(old.nightCrime.cases.is_empty() and old.nightCrime.nights.is_empty() and old.nightCrime.cooperation.count == 2,"old save migration credits distinct arrests without retroactive theft")
	old = act(old,"NEXT")
	check(old.nightCrime.cases.is_empty(),"old closed save does not invent past losses")
	# All owners and unfinished objects are safeguarded, including external open work.
	s = fresh(seed)
	for item in s.inventory: item.owner = "customer"
	s.inventory[0].owner = "shop"
	s.inventory[0].service.opened = true
	s = act(close(s),"NEXT")
	check(s.nightCrime.cases.is_empty(),"no eligible physical object means no loss or claim")
	s = fresh(seed)
	s.inventory = [s.inventory[1]]
	s.inventory[0].refurbishment = {"operations":{"clean":{"complete":false,"task":"refurb_clean"}},"done":[],"active_case":false}
	s = act(close(s),"NEXT")
	check(s.nightCrime.cases.is_empty(),"ongoing exterior progress protects the physical object overnight")
	# A source-qualified hidden stolen object may be accepted but rejected on claim.
	s = fresh(seed)
	s.inventory = [s.inventory[0]]
	s.inventory[0].stolen = true
	check(night.insurance_quote(s).items.size() == 1,"insurance does not act as a hidden stolen-goods detector")
	s = act(s,"BUY_INSURANCE")
	s = act(close(s),"NEXT")
	check(night.public_report(s).morning.payout == 0 and night.public_report(s).morning.losses[0].claimReason != "","illegal loss rejected with claim evidence")
	# Inspecting at capacity and zero AP must remain completable.
	for risk in [0,29,30,59,60,100]:
		check(night.inspection_chance(risk) == (8 if risk < 30 else 15 if risk < 60 else 25),"inspection risk band %d" % risk)
	for count in [0,1,2,3,4,5,6,10]:
		check(night.leniency_chance(count) == (0 if count < 2 else 30 if count < 4 else 60 if count < 6 else 80),"leniency threshold %d" % count)
	for n in 100:
		s = fresh("INSPECT-%d" % n)
		s.risk = 100
		s.cursor = 6
		s.ap = 0
		night.ensure_day(s)
		if night.inspection_pending(s): break
	check(night.inspection_pending(s),"deterministic fixture finds scheduled police")
	s = act(s,"ARRIVE")
	check(s.trade != null and s.trade.get("inspectionVisit",false) and s.ap == 0,"bonus inspection arrives at six visitors and zero AP")
	var held := Model.new_item(s,"WCH-003",{"stolen":true,"sourceVerified":false,"source":"外部失窃案","crimeCaseId":"EXTERNAL-ONE"})
	s.inventory.append(held)
	s.cash = 7
	var uid: String = held.uid
	s = act(s,"RESOLVE_INSPECTION",{"tradeId":s.trade.id})
	check(s.cash == 0 and s.cursor == 6 and s.ap == 0 and Model.find_inventory(s,uid) == null,"inspection confiscates exact original, caps fine and preserves bonus cursor/AP")
	check(night.public_report(s).lastInspection.fineDue >= 30 and night.public_report(s).lastInspection.finePaid == 7,"receipt reports assessed and paid fine separately")
	loop_tests(night)
	additional_tests(night)
	repeat_loss_test(night)
	return_terminal_test()
	print("NIGHT failures=",failures)
	quit(1 if failures else 0)

# These fixtures catch per-item weighting, hidden-tier use and protected-stock risk.
func weighted_theft_tests() -> void:
	var night = load("res://scripts/model/night_crime.gd")
	check(night.has_method("theft_chance_bp"),"inventory-sensitive theft threshold exists")
	if not night.has_method("theft_chance_bp"): return
	var s := fresh("RISK-FORMULA")
	s.inventory=[]
	check(night.theft_chance_bp(s)==300,"empty stock formula is 300 bp")
	var luxury := Model.new_item(s,"WCH-015")
	var ultra := Model.new_item(s,"WCH-074")
	s.inventory=[luxury]
	check(night.theft_chance_bp(s)==308,"one luxury adds 8 bp")
	s.inventory=[ultra]
	check(night.theft_chance_bp(s)==310,"one ultra adds 10 bp")
	s.inventory=[luxury,ultra]
	check(night.theft_chance_bp(s)==318,"luxury and ultra total 318 bp")
	var overflow: Dictionary=s.duplicate(true)
	overflow.inventory=[]
	for i in 1000: overflow.inventory.append(Model.new_item(overflow,"WCH-074"))
	check(night.theft_chance_bp(overflow)==10000,"inventory formula caps probability at 10000 bp")
	var protected := []
	for options in [{"sealed":true},{"orderId":"customer"},{"owner":"customer"},{"service":{"opened":true}},{"refurbishment":{"active_case":true}},{"location":"isolation"}]:
		protected.append(Model.new_item(s,"WCH-074",options))
	s.inventory.append_array(protected)
	check(night.theft_chance_bp(s)==318,"protected originals never raise exposure")
	var boundary_seed := ""
	for i in 10000:
		var candidate := "BOUNDARY-%d" % i
		var draw := Model.fnv("%s/night/theft/3" % candidate)%10000
		if draw>=300 and draw<318: boundary_seed=candidate; break
	check(boundary_seed!="" and not night.theft_draw(boundary_seed,3) and night.theft_draw(boundary_seed,3,318),"custom threshold activates additional 300..317 basis-point draws")
	var guarded := {"seed":theft_seed(),"day":3,"inventory":protected.duplicate(true),"police":{"caught":[]},"trade":null}
	night.settle(guarded)
	check(guarded.nightCrime.nights["3"].losses.is_empty(),"successful theft draw cannot take protected inventory")
	check(guarded.nightCrime.nights["3"].get("effectiveChanceBp",-1)==0,"settled protected inventory records zero actual exposure")
	var safe := {"seed":theft_seed(),"day":3,"inventory":[luxury],"police":{"caught":NightCrime.thieves(s)},"trade":null}
	night.settle(safe)
	check(safe.nightCrime.nights["3"].losses.is_empty() and safe.nightCrime.nights["3"].get("effectiveChanceBp",-1)==0,"all thieves caught records zero actual exposure")
	var disguised := Model.new_item(s,"WCH-008",{"forgery":{"targetId":"WCH-074","methods":{"case":{"targetId":"WCH-074","active":true}}}})
	if WatchForgery.appearance_id(disguised)!="WCH-074":
		check(false,"visible-tier fixture is valid")
	else:
		s.inventory=[disguised]
		check(night.theft_chance_bp(s)==310,"risk follows visible appearance instead of underlying truth")
		var apparent_ultra := 0
		var low := Model.new_item(s,"WCH-001")
		for i in 10000:
			var visible_pool := [low,disguised]
			if night._take_weighted("APPEARANCE-%d" % i,3,0,visible_pool).uid==disguised.uid: apparent_ultra+=1
		check(apparent_ultra>90 and apparent_ultra<160,"theft weights follow disguised visible ultra tier")
	var pool := []
	for id in ["WCH-001","WCH-008","WCH-015","WCH-074"]: pool.append(Model.new_item(s,id))
	var weights := {"low":0,"mid":0,"luxury":0,"ultra":0}
	for i in 20000:
		var candidates: Array=pool.duplicate(true)
		var picked: Dictionary=night._take_weighted("TIER-SAMPLE-%d" % i,3,0,candidates)
		weights[GameData.def(picked.defId).tier]+=1
	check(weights.low>15600 and weights.low<16400 and weights.mid>2700 and weights.mid<3300 and weights.luxury>650 and weights.luxury<950 and weights.ultra>130 and weights.ultra<270,"large deterministic tier cohort follows 80/15/4/1")
	print("NIGHT tier cohort ",weights)
	var counts := {"low":0,"mid":0,"luxury":0,"ultra":0}
	var duplicate := false
	var eligible := true
	var snapshots := true
	for i in 10000:
		var seed := "WEIGHTED-%d" % i
		# Force a successful draw through real settlement by retaining only winning seeds.
		if Model.fnv("%s/night/theft/3" % seed)%10000>=318: continue
		var fixture := {"seed":seed,"day":3,"inventory":pool.duplicate(true),"police":{"caught":[]},"trade":null}
		night.settle(fixture)
		var n: Dictionary=fixture.nightCrime.nights["3"]
		snapshots=snapshots and int(n.get("chanceBp",0))==318
		if n.losses.is_empty(): continue
		counts[GameData.def(n.losses[0].defId).tier]+=1
		if n.losses.size()==2: duplicate=duplicate or n.losses[0].uid==n.losses[1].uid
		for lot in n.losses: eligible=eligible and not protected.has(lot)
	check(counts.low>210 and counts.mid>20 and counts.luxury>2 and counts.ultra>0,"tier-first draws approximately 80/15/4/1")
	check(not duplicate and eligible,"second selection cannot duplicate the first original")
	check(snapshots,"settled nights store actual formula threshold")
	# Adding many lows cannot increase their aggregate tier chance for the same seed.
	var stable := true
	var renormalized := 0
	for i in 2000:
		var seed := "DILUTION-%d" % i
		if Model.fnv("%s/night/theft/3" % seed)%10000>=318: continue
		var a := {"seed":seed,"day":3,"inventory":pool.duplicate(true),"police":{"caught":[]},"trade":null}
		var b: Dictionary=a.duplicate(true)
		for j in 60: b.inventory.append(Model.new_item(s,"WCH-001"))
		night.settle(a);night.settle(b)
		stable=stable and GameData.def(a.nightCrime.nights["3"].losses[0].defId).tier==GameData.def(b.nightCrime.nights["3"].losses[0].defId).tier
	check(stable,"many low items cannot dilute luxury or ultra tier weight")
	for i in 10000:
		var seed := "ABSENT-%d" % i
		if Model.fnv("%s/night/theft/3" % seed)%10000>=318: continue
		var fixture := {"seed":seed,"day":3,"inventory":[luxury.duplicate(true),ultra.duplicate(true)],"police":{"caught":[]},"trade":null}
		night.settle(fixture)
		if fixture.nightCrime.nights["3"].losses[0].defId=="WCH-015": renormalized+=1
	check(renormalized>200 and renormalized<280,"absent low/mid tiers renormalize luxury/ultra to 4:1")
