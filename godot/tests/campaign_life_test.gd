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
	return settle_day(s)

func settle_day(s: Dictionary) -> Dictionary:
	NightCrime.ensure_day(s)
	if Landlord.outstanding(s) > 0:
		s = Landlord.reduce(s,{"type":"CALL_LANDLORD"})
		s = Landlord.reduce(s,{"type":"PAY_RENT","tradeId":s.trade.id})
		s = Landlord.reduce(s,{"type":"REFUSE"})
	return Model.reduce(s,{"type":"SETTLE"})

func story_day(day: int) -> Dictionary:
	var s := Model.create("STORY-LIFECYCLE")
	s.campaignLife = {"mode":"story90"}
	s.day = day
	s.risk = 0
	s.cash = 10000
	return s

func stored_checkpoint(s: Dictionary, day: int) -> Dictionary:
	return s.get("campaignLife",{}).get("checkpoints",{}).get(str(day),{})

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
	check(fresh.campaignLife == {"version":1,"mode":"legacy21","endless":false,"assessments":[],"checkpoints":{}},"legacy saves receive an additive campaign namespace")
	fresh.erase("campaignLife")
	check(fresh == unchanged,"ensure does not change legacy resources or originals")
	life.ensure(fresh)
	var ensured := JSON.stringify(fresh)
	life.ensure(fresh)
	check(JSON.stringify(fresh) == ensured,"ensure is idempotent")
	var old_endless := Model.create("CONTINUE-HISTORICAL")
	old_endless.day = 117
	old_endless.campaignLife = {"version":1,"endless":true,"assessments":[{"day":21,"outcome":"稳健旧货铺","report":null}]}
	life.ensure(old_endless)
	check(saved_mode(old_endless) == "endless" and life.end_day(old_endless) == 0 and stored_checkpoint(old_endless,21) == old_endless.campaignLife.assessments[0],"saved endless flag and first assessment migrate without changing the end date")
	var explicit := story_day(35)
	explicit.campaignLife.endless = true
	life.ensure(explicit)
	check(saved_mode(explicit) == "story90" and not explicit.campaignLife.endless,"explicit story mode controls the migrated compatibility flag")
	check(life.reduce(fresh,{"type":"UNKNOWN"}) == null,"unknown commands pass through the continuation reducer")
	var report := settled_day_21()
	check(report.phase == "report" and report.has("outcome"),"settling day21 still gives the campaign assessment")
	check(report.report.get("evaluation") is Dictionary,"day21 settlement freezes detailed achievements before continuation")
	var original := Model.new_item(report,"WCH-004",{"owner":"customer","orderId":"LATE-CONTRACT","sealed":true,"location":"customer"})
	report.inventory.append(original)
	report.serviceContracts = {"version":1,"contracts":[{"id":"LATE-CONTRACT","uid":original.uid,"status":"active","deadline":25}]}
	var before := report.duplicate(true)
	var next: Dictionary = life.reduce(report,{"type":"CONTINUE_CAMPAIGN"})
	check(next.day == 22 and next.phase == "open" and next.ap == 12 and life.is_endless(next),"explicit continuation opens day22 through ordinary next-day rules")
	check(next.inventory == before.inventory and next.materials == before.materials and next.cash == before.cash and next.relations == before.relations and next.ledger == before.ledger and next.serviceContracts == before.serviceContracts,"continuation preserves originals, open contracts, materials, money, relations and ledger")
	check(report == before and not next.has("outcome"),"continuation preserves the prior snapshot and clears its old outcome")
	check(next.campaignLife.assessments.size() == 1 and next.campaignLife.assessments[0].outcome == before.outcome and next.campaignLife.assessments[0].day == 21,"first assessment is recorded once")
	check(next.campaignLife.assessments[0].get("evaluation")==before.report.evaluation,"continuation retains the settled evaluation snapshot alongside its report")
	var achieved_after: Dictionary=next.duplicate(true)
	achieved_after.cash+=1000
	achieved_after.shopJournal={"histories":{"future":[{"id":"repair/future/22"}]}}
	check(life.summary(achieved_after).firstAssessment.evaluation==before.report.evaluation,"later work and cash cannot rewrite the first assessment")
	var generic_end:=before.duplicate(true)
	generic_end.phase="ending"
	generic_end.outcome="稳健旧货铺"
	check(life.continue_problem(generic_end)=="" and life.reduce(generic_end,{"type":"CONTINUE_CAMPAIGN"}).day==22,"the generic successful shop ending can continue normally")
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
	no_report.erase("campaignLife")
	var old_resume: Dictionary=life.reduce(no_report,{"type":"CONTINUE_CAMPAIGN"})
	check(old_resume.day == 22,"a known successful day21 ending remains resumable without a retained report")
	check(not old_resume.campaignLife.assessments[0].has("evaluation"),"legacy continuation does not reconstruct missing historical evaluation from later evidence")
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
	var with_old_outcome := settle_day(next.duplicate(true))
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
	test_story_checkpoint()
	test_story_finale()
	test_legacy_story_opt_in(before,legacy_end)
	test_closed_story_finale()
	test_explicit_new_game()
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
			life.set_mode(s,"endless")
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
	life.set_mode(insured,"legacy21")
	check(NightCrime.insurance_problem(insured) != "","legacy day35 cannot buy post-campaign insurance")
	check(not NightCrime.theft_draw("FUTURE-DRAW",28,10000),"legacy theft draws stop after day20")
	check(night.theft_draw("FUTURE-DRAW",28,10000,true),"explicit endless theft draws remain active after day20")
	var old := base.duplicate(true)
	old.day = 35
	life.set_mode(old,"legacy21")
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
	life.set_mode(stolen,"endless")
	stolen.risk = 0
	stolen.cash = 10000
	stolen = settle_day(stolen)
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

func test_story_checkpoint() -> void:
	var first := settle_day(story_day(21))
	var checkpoint := stored_checkpoint(first,21)
	var summary: Dictionary = life.summary(first)
	check(first.phase == "report" and not first.has("outcome"),"story day21 settles as a checkpoint without a terminal outcome")
	check(summary.get("mode") == "story90" and summary.get("endDay") == 90 and not checkpoint.is_empty() and summary.get("checkpoint") == checkpoint,"story summary projects the day21 checkpoint and day90 boundary")
	check(checkpoint.get("evaluation") == first.report.get("evaluation") and checkpoint.get("evaluation",{}).get("cash") == 9439,"day21 freezes the actual evaluation after rent and day fees")
	check(life.reduce(first,{"type":"CONTINUE_CAMPAIGN"}) == first,"story day21 cannot switch early to endless")
	var loaded: Dictionary = JSON.parse_string(JSON.stringify(first))
	var repeat := Model.reduce(loaded,{"type":"SETTLE"})
	check(repeat.ledger == loaded.ledger and repeat.cash == loaded.cash and stored_checkpoint(repeat,21) == stored_checkpoint(loaded,21),"reloading and settling day21 cannot duplicate fees or change the checkpoint")
	var stale := loaded.duplicate(true)
	stale.report.day = 20
	check(Model.reduce(stale,{"type":"NEXT"}) == stale,"NEXT never accepts another day's settlement")
	var busy := loaded.duplicate(true)
	busy.trade = {"id":"pending","kind":"buy"}
	check(Model.reduce(busy,{"type":"NEXT"}) == busy,"NEXT cannot discard an active visitor")
	var day22 := Model.reduce(loaded,{"type":"NEXT"})
	check(day22.day == 22 and day22.phase == "open" and life.summary(day22).get("mode") == "story90","ordinary NEXT opens day22 in the same story campaign")
	check(day22.nightCrime.nights.get("21",{}).get("applied",false),"day21's settled night is applied on day22")
	check(Model.reduce(day22,{"type":"NEXT"}) == day22 and life.summary(day22).get("firstAssessment") == stored_checkpoint(loaded,21),"day22 preserves the first assessment and a repeated NEXT cannot advance")

func test_story_finale() -> void:
	var operating := story_day(90)
	check(NightCrime.insurance_problem(operating) == "","day90 still allows tonight's insurance before settlement")
	check(NightCrime.insurance_problem(story_day(91)) != "","story-mode insurance closes at the same boundary as the campaign")
	var final := settle_day(operating)
	var checkpoint := stored_checkpoint(final,90)
	check(final.phase == "report" and final.get("outcome") == "稳健旧货铺" and checkpoint.get("evaluation",{}).get("cash") == 9984,"day90 settlement freezes its own successful ending after costs")
	var upgrade := Model.reduce(final,{"type":"UPGRADE","id":"lamp"})
	check(upgrade.cash == final.cash and upgrade.upgrades == final.upgrades,"the final report cannot spend settlement cash on an upgrade")
	var loaded: Dictionary = JSON.parse_string(JSON.stringify(final))
	var repeat := Model.reduce(loaded,{"type":"SETTLE"})
	check(repeat.ledger == loaded.ledger and repeat.cash == loaded.cash and stored_checkpoint(repeat,90) == stored_checkpoint(loaded,90),"reloaded day90 cannot debit costs again or replace its conclusion")
	var ending := Model.reduce(loaded,{"type":"NEXT"})
	check(ending.day == 90 and ending.phase == "ending" and Model.reduce(ending,{"type":"NEXT"}) == ending,"viewing the day90 ending cannot open day91")
	var resumed: Dictionary = life.reduce(ending,{"type":"CONTINUE_CAMPAIGN"})
	check(resumed.day == 91 and resumed.phase == "open" and saved_mode(resumed) == "endless" and Landlord.outstanding(resumed) == 900,"only explicit continuation opens day91 and its next 900 Cr rent")
	check(resumed.nightCrime.nights.get("90",{}).get("applied",false) and life.reduce(resumed,{"type":"CONTINUE_CAMPAIGN"}) == resumed,"continuation applies the final night and consumes the choice once")
	check(stored_checkpoint(resumed,90) == stored_checkpoint(loaded,90),"endless operations retain the frozen story conclusion")
	var insolvent := story_day(90)
	insolvent.day = 89
	Model.ledger(insolvent,"relief-previous","relief-window","Saved relief",0)
	insolvent.day = 90
	insolvent.cash = 0
	insolvent = Model.reduce(insolvent,{"type":"SETTLE"})
	check(insolvent.phase == "ending" and stored_checkpoint(insolvent,90).is_empty() and life.reduce(insolvent,{"type":"CONTINUE_CAMPAIGN"}) == insolvent,"insolvent day90 closes without a successful conclusion or continuation")

func saved_mode(s: Dictionary) -> String:
	return String(life.summary(s).get("mode",""))

func test_legacy_story_opt_in(report: Dictionary, ending: Dictionary) -> void:
	var loaded: Dictionary = JSON.parse_string(JSON.stringify(report))
	var started: Variant = life.reduce(loaded,{"type":"START_STORY_90"})
	check(started != null and started.day == 22 and started.phase == "open" and saved_mode(started) == "story90","explicit story continuation opens a settled legacy day21 save on day22")
	if started != null:
		check(started.cash == loaded.cash and started.ledger == loaded.ledger and started.inventory == loaded.inventory and started.get("campaignStory",{}).get("startDay") == 22,"legacy migration retains resources and starts history at day22")
		check(stored_checkpoint(started,21).get("evaluation") == loaded.report.evaluation and life.reduce(started,{"type":"START_STORY_90"}) == started,"legacy migration preserves the saved assessment once")
	var missing := ending.duplicate(true)
	missing.erase("report")
	missing.erase("campaignLife")
	var migrated: Variant = life.reduce(missing,{"type":"START_STORY_90"})
	check(migrated != null and migrated.day == 22 and migrated.phase == "open" and not stored_checkpoint(migrated,21).has("evaluation"),"known legacy success without a report can resume with historical detail left unknown")
	var stale := ending.duplicate(true)
	stale.report.day = 20
	check(life.reduce(stale,{"type":"START_STORY_90"}) == stale and life.reduce(stale,{"type":"CONTINUE_CAMPAIGN"}) == stale,"explicit continuation rejects a stale legacy ending report")
	var failed := missing.duplicate(true)
	failed.outcome = "无法支付租金，交还店面"
	check(life.reduce(failed,{"type":"START_STORY_90"}) == failed and Model.reduce(failed,{"type":"NEXT"}) == failed,"legacy liquidation cannot be undone by story continuation or NEXT")
	var past := loaded.duplicate(true)
	past.day = 28
	past.report.day = 28
	check(life.reduce(past,{"type":"START_STORY_90"}) == past,"post-campaign legacy days cannot backfill the story")

func test_closed_story_finale() -> void:
	var eve := settle_day(story_day(89))
	eve.robbery = {"days":{},"entries":[{"id":"ROBBERY-87","revenge":{"day":90,"percent":5,"done":false}}]}
	var closed := Model.reduce(eve,{"type":"NEXT"})
	check(closed.day == 90 and closed.phase == "report" and closed.report.get("closed",false),"a scheduled retaliation can close the final business day after charging expenses")
	check(Model.reduce(closed,{"type":"NEXT"}) == closed,"the final closed-day report waits for its own conclusion")
	var final := Model.reduce(closed,{"type":"SETTLE"})
	check(final.cash == closed.cash and final.ledger == closed.ledger and stored_checkpoint(final,90).has("evaluation"),"settling the already charged final closure records the outcome without another fee")

func test_explicit_new_game() -> void:
	var game = root.get_node("Game")
	game.new_game("DEFAULT-RELEASE-CAMPAIGN")
	check(saved_mode(game.state) == "legacy21","standard new games keep the released legacy campaign")
	var story_override: bool = game.get_method_argument_count("new_game") >= 2
	check(story_override,"the normal Game entry accepts an explicit campaign choice")
	if not story_override: return
	game.new_game("EXPLICIT-STORY-CAMPAIGN","story90")
	var saved: Dictionary = JSON.parse_string(FileAccess.get_file_as_string(game.SAVE_PATH))
	check(saved_mode(game.state) == "story90" and saved_mode(saved) == "story90" and saved.day == 1,"explicit new game saves a day1 story campaign")
