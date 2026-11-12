extends SceneTree
## Continuation keeps the settled campaign save and resumes ordinary daily rules.

const CrimeEvents = preload("res://scripts/model/crime_events.gd")
const Commerce = preload("res://scripts/model/commerce.gd")
var failures := 0
var life
var night

func _initialize() -> void:
	call_deferred("run")

func check(ok: bool, label: String) -> void:
	print("CAMPAIGN ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1

func settled_day_21() -> Dictionary:
	var s := Model.create("CONTINUE-SETTLED")
	s.day = 21
	s.risk = 0
	s.cash = 10000
	NightCrime.ensure_day(s)
	s = Landlord.reduce(s,{"type":"CALL_LANDLORD"})
	s = Landlord.reduce(s,{"type":"PAY_RENT","tradeId":s.trade.id})
	s = Landlord.reduce(s,{"type":"REFUSE"})
	return Model.reduce(s,{"type":"SETTLE"})

func run() -> void:
	if not ResourceLoader.exists("res://scripts/model/campaign_life.gd"):
		check(false,"continuation reducer is available")
		quit(1)
		return
	life = load("res://scripts/model/campaign_life.gd")
	night = load("res://scripts/model/night_crime.gd")
	var fresh := Model.create("CONTINUE-ENSURE")
	fresh.erase("campaignLife")
	var unchanged := fresh.duplicate(true)
	life.ensure(fresh)
	check(fresh.campaignLife == {"version":1,"endless":false,"assessments":[]},"legacy saves receive an additive campaign namespace")
	fresh.erase("campaignLife")
	check(fresh == unchanged,"ensure does not change legacy resources or originals")
	life.ensure(fresh)
	var ensured := JSON.stringify(fresh)
	life.ensure(fresh)
	check(JSON.stringify(fresh) == ensured,"ensure is idempotent")
	check(life.reduce(fresh,{"type":"UNKNOWN"}) == null,"unknown commands pass through the continuation reducer")
	var report := settled_day_21()
	check(report.phase == "report" and report.has("outcome"),"settling day21 still gives the campaign assessment")
	var original := Model.new_item(report,"WCH-004",{"owner":"customer","orderId":"LATE-CONTRACT","sealed":true,"location":"customer"})
	report.inventory.append(original)
	report.serviceContracts = {"version":1,"contracts":[{"id":"LATE-CONTRACT","uid":original.uid,"status":"active","deadline":25}]}
	var before := report.duplicate(true)
	var next: Dictionary = life.reduce(report,{"type":"CONTINUE_CAMPAIGN"})
	check(next.day == 22 and next.phase == "open" and next.ap == 12 and life.is_endless(next),"explicit continuation opens day22 through ordinary next-day rules")
	check(next.inventory == before.inventory and next.materials == before.materials and next.cash == before.cash and next.relations == before.relations and next.ledger == before.ledger and next.serviceContracts == before.serviceContracts,"continuation preserves originals, open contracts, materials, money, relations and ledger")
	check(report == before and not next.has("outcome"),"continuation preserves the prior snapshot and clears its old outcome")
	check(next.campaignLife.assessments.size() == 1 and next.campaignLife.assessments[0].outcome == before.outcome and next.campaignLife.assessments[0].day == 21,"first assessment is recorded once")
	var loaded: Dictionary = JSON.parse_string(JSON.stringify(next))
	var repeated: Dictionary = life.reduce(loaded,{"type":"CONTINUE_CAMPAIGN"})
	check(repeated == loaded and repeated.day == 22 and repeated.campaignLife.assessments.size() == 1,"repeated continue after reload cannot skip or duplicate a day")
	var legacy_end := Model.reduce(before,{"type":"NEXT"})
	check(legacy_end.phase == "ending" and legacy_end.day == 21,"ordinary legacy NEXT still ends on day21")
	legacy_end = JSON.parse_string(JSON.stringify(legacy_end))
	var continued_end: Dictionary = life.reduce(legacy_end,{"type":"CONTINUE_CAMPAIGN"})
	check(continued_end.day == 22 and continued_end.phase == "open" and continued_end.cash == before.cash,"a completed successful legacy save can continue without another settlement")
	var no_report := legacy_end.duplicate(true)
	no_report.report = null
	check(life.reduce(no_report,{"type":"CONTINUE_CAMPAIGN"}).day == 22,"a known successful day21 ending remains resumable without a retained report")
	for failure in ["无法支付租金，交还店面","限期清仓后仍无力支付店铺费用"]:
		var bankrupt := legacy_end.duplicate(true)
		bankrupt.outcome = failure
		check(life.reduce(bankrupt,{"type":"CONTINUE_CAMPAIGN"}) == bankrupt,"failed ending cannot continue: " + failure)
	var busy := before.duplicate(true)
	busy.trade = {"id":"pending","kind":"buy"}
	check(life.reduce(busy,{"type":"CONTINUE_CAMPAIGN"}) == busy,"continuation cannot discard an active visitor")
	var unsettled := before.duplicate(true)
	unsettled.phase = "open"
	check(life.reduce(unsettled,{"type":"CONTINUE_CAMPAIGN"}) == unsettled,"an unsettled day cannot continue")
	var stale := before.duplicate(true)
	stale.report.day = 20
	check(life.reduce(stale,{"type":"CONTINUE_CAMPAIGN"}) == stale,"a stale report cannot advance the campaign")
	var early := before.duplicate(true)
	early.day = 20
	early.report.day = 20
	check(life.reduce(early,{"type":"CONTINUE_CAMPAIGN"}) == early,"continuation does not bypass the initial campaign")
	var later_report := before.duplicate(true)
	later_report.day = 28
	later_report.report.day = 28
	later_report.erase("outcome")
	check(life.reduce(later_report,{"type":"CONTINUE_CAMPAIGN"}).day == 29,"an already settled post-campaign report can migrate into continuation")
	var with_old_outcome := next.duplicate(true)
	with_old_outcome.phase = "report"
	with_old_outcome.outcome = "可信赖维修店"
	var day23 := Model.reduce(with_old_outcome,{"type":"NEXT"})
	check(day23.day == 23 and day23.phase == "open","endless NEXT does not terminate on an old assessment")
	test_future_days(next)
	test_future_events(next)
	var summary_before := JSON.stringify(next)
	var summary: Dictionary = life.summary(next)
	check(summary.mode == "endless" and summary.week == 4 and summary.firstAssessment.outcome == before.outcome,"summary exposes mode, week and first campaign assessment")
	life.summary(next)
	CrimeEvents.event_for_day(next)
	NightCrime.ensure_day(next)
	VisitSchedule.limit(next)
	check(JSON.stringify(next) == summary_before,"repeated summary, event and saved visitor previews do not alter the save")
	print("CAMPAIGN failures=",failures)
	quit(1 if failures else 0)

func test_future_days(base: Dictionary) -> void:
	check(Model.rent_due(7) == 450 and Model.rent_due(14) == 495 and Model.rent_due(21) == 545,"campaign rent values remain unchanged")
	check(Model.rent_due(28) == 599 and Model.rent_due(35) == 659 and Model.rent_due(70) == 900 and Model.rent_due(7000) == 900,"future weekly rent grows to a stable 900 Cr cap")
	var reservations := true
	for day in [28,35]:
		for sample in 24:
			var s := Model.create("CONTINUE-SLOTS-%d" % sample)
			s.day = day
			life.ensure(s)
			s.campaignLife.endless = true
			NightCrime.ensure_day(s)
			var quota := VisitSchedule.limit(s)
			var landlord := VisitSchedule.landlord_slot(s)
			var merchant := Commerce.merchant_slot(s)
			var patrol := WantedCases.officer_slot(s,merchant)
			var crime: Dictionary = s.nightCrime.days[str(day)]
			reservations = reservations and landlord == quota-1 and merchant != landlord and patrol != landlord
			if crime.inspection: reservations = reservations and crime.inspectionSlot != landlord and crime.inspectionSlot != merchant
			if not crime.fence.is_empty(): reservations = reservations and crime.fence.slot not in [landlord,merchant,patrol]
	check(reservations,"day28 and day35 reserve separate landlord, merchant, patrol and crime appointments")
	var rent_day := base.duplicate(true)
	rent_day.day = 28
	rent_day.cash = 10000
	rent_day.risk = 0
	NightCrime.ensure_day(rent_day)
	rent_day = Landlord.reduce(rent_day,{"type":"CALL_LANDLORD"})
	check(rent_day.trade != null and rent_day.trade.kind == "landlord" and rent_day.trade.price == 599,"future landlord collects the same bounded weekly rent as settlement")
	rent_day = Landlord.reduce(rent_day,{"type":"PAY_RENT","tradeId":rent_day.trade.id})
	rent_day = Landlord.reduce(rent_day,{"type":"REFUSE"})
	rent_day = Model.reduce(rent_day,{"type":"SETTLE"})
	var rents := 0
	for entry in rent_day.ledger:
		if entry.kind == "rent" and entry.day == 28: rents += 1
	check(rent_day.phase == "report" and rent_day.report.settlementRent == 0 and rents == 1 and not rent_day.has("outcome"),"day28 settlement does not repeat rent or the campaign ending")
	var day29 := Model.reduce(rent_day,{"type":"NEXT"})
	check(day29.day == 29 and day29.phase == "open" and day29.nightCrime.nights["28"].applied,"future NEXT applies the settled night and opens the new visit schedule")
	var morning_save := JSON.stringify(day29)
	NightCrime.morning(day29,28)
	check(JSON.stringify(day29) == morning_save,"future morning is idempotent")
	var insured := base.duplicate(true)
	insured.day = 35
	check(NightCrime.insurance_problem(insured) == "","endless day35 can insure lawful stock")
	insured.campaignLife.endless = false
	check(NightCrime.insurance_problem(insured) != "","legacy day35 cannot buy post-campaign insurance")
	check(not NightCrime.theft_draw("FUTURE-DRAW",28,10000),"legacy theft draws stop after day20")
	check(night.theft_draw("FUTURE-DRAW",28,10000,true),"explicit endless theft draws remain active after day20")
	var old := base.duplicate(true)
	old.day = 35
	old.campaignLife.endless = false
	NightCrime.settle(old)
	check(not old.nightCrime.nights.has("35"),"legacy late-day saves do not create additional theft nights")
	var seed := ""
	for sample in 1000:
		if night.theft_draw("CONTINUE-THEFT-%d" % sample,35,300,true):
			seed = "CONTINUE-THEFT-%d" % sample
			break
	check(seed != "","future theft fixture finds a deterministic natural night")
	if seed == "": return
	var stolen := Model.create(seed)
	stolen.day = 35
	life.ensure(stolen)
	stolen.campaignLife.endless = true
	stolen.phase = "report"
	NightCrime.settle(stolen)
	check(stolen.nightCrime.nights.has("35") and not stolen.nightCrime.nights["35"].losses.is_empty(),"future settled night saves its physical theft selection")
	stolen = Model.reduce(stolen,{"type":"NEXT"})
	check(stolen.day == 36 and NightCrime._case(stolen,"NIGHT-35").get("lossDay",0) == 35,"future theft keeps deterministic case identity through NEXT")

func test_future_events(base: Dictionary) -> void:
	check(Model.event_for_day(base.seed,22) == null,"state-free legacy event lookup retains its campaign boundary")
	var ordinary := false
	var suspicious := false
	var repeat_safe := true
	for sample in 24:
		var s := base.duplicate(true)
		s.seed = "CONTINUE-EVENT-%d" % sample
		s.day = 28 + sample
		var event = CrimeEvents.event_for_day(s)
		if event == null:
			repeat_safe = false
			continue
		repeat_safe = repeat_safe and event.id not in ["EVT-020","EVT-021"]
		var choice: Dictionary = event.choices[-1]
		var next := Commerce.reduce(s,{"type":"CHOOSE_EVENT","eventId":event.id,"choiceId":choice.id})
		var today: Array = next.events.filter(func(row): return row.day == s.day)
		repeat_safe = repeat_safe and today.size() == 1 and today[0].eventId == event.id
		var repeated := Commerce.reduce(next,{"type":"CHOOSE_EVENT","eventId":event.id,"choiceId":choice.id})
		repeat_safe = repeat_safe and repeated.events == next.events and repeated.cash == next.cash and repeated.ap == next.ap
		if CrimeEvents.is_crime(event): suspicious = true
		else: ordinary = true
	check(ordinary and suspicious and repeat_safe,"future ordinary and crime events match displayed choices and apply once without finale repetition")
