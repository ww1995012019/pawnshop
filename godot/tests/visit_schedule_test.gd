extends SceneTree
const Commerce = preload("res://scripts/model/commerce.gd")
var failures := 0
func _initialize() -> void:
	call_deferred("run")
func check(ok: bool, label: String) -> void:
	print("VISITS ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func run() -> void:
	# A fixed-six reducer loses both quiet and busy days, even without special NPCs.
	var totals := {}
	for n in 32:
		var s := Model.create("QUOTA-%d" % n)
		s.day = 4
		var count := 0
		for slot in 11:
			s = Model.reduce(s,{"type":"ARRIVE"})
			if s.trade == null: break
			count += 1
			s = Model.reduce(s,{"type":"REFUSE"})
		totals[count] = true
	check(totals.size() == 8 and totals.has(3) and totals.has(10),"ordinary arrivals cover every daily quota from three through ten")
	if failures:
		quit(1)
		return
	var schedule = load("res://scripts/model/visit_schedule.gd")
	var stable := Model.create("STABLE-VISITS")
	stable.day = 8
	var limit: int = schedule.limit(stable)
	var saved := JSON.stringify(stable)
	var loaded: Dictionary = JSON.parse_string(saved)
	loaded.seed = "changed-after-save"
	check(schedule.limit(loaded) == limit and loaded.visitSchedule.days.has("8") and int(loaded.visitSchedule.days["8"].limit) == limit,"saved quota survives reload without refreshing from seed")
	check(schedule.limit(stable) == limit and JSON.stringify(stable) == saved,"repeated previews do not refresh the schedule")
	var introductory := true
	var collision_free := true
	var previews_match := true
	var exhausted := true
	for n in 24:
		for day in [1,2,3,4,7,14,21]:
			var s := Model.create("SLOTS-%d" % n)
			s.day = day
			NightCrime.ensure_day(s)
			var quota: int = schedule.limit(s)
			if day <= 3: introductory = introductory and quota >= 6
			var landlord: int = schedule.landlord_slot(s)
			var merchant: int = Commerce.merchant_slot(s)
			var patrol: int = WantedCases.officer_slot(s,merchant)
			var d: Dictionary = s.nightCrime.days[str(day)]
			collision_free = collision_free and quota >= 3 and quota <= 10 and (landlord == -1 or landlord == quota-1)
			collision_free = collision_free and (merchant < 0 or merchant < quota and merchant != landlord)
			collision_free = collision_free and (patrol < 0 or patrol < quota and patrol != merchant and patrol != landlord)
			if d.inspection: collision_free = collision_free and d.inspectionSlot < quota and d.inspectionSlot != merchant and d.inspectionSlot != landlord
			if not d.fence.is_empty(): collision_free = collision_free and d.fence.slot < quota and d.fence.slot not in [merchant,patrol,landlord] and (not d.inspection or d.fence.slot != d.inspectionSlot)
			# Rent visitation itself belongs to the landlord integration regression.
			if day in [7,14,21]: continue
			for slot in quota:
				var predicted: String = Commerce.next_visitor(s)
				s = Commerce.reduce(s,{"type":"ARRIVE"})
				if s.trade == null:
					previews_match = false
					break
				previews_match = previews_match and predicted == s.trade.npcId
				if s.trade.get("inspectionVisit",false): s = Commerce.reduce(s,{"type":"RESOLVE_INSPECTION","tradeId":s.trade.id})
				else: s = Commerce.reduce(s,{"type":"REFUSE"})
			exhausted = exhausted and not NightCrime.can_arrive(s)
			var next := Commerce.reduce(s,{"type":"ARRIVE"})
			exhausted = exhausted and next.trade == null and next.cursor == quota
	check(introductory,"first three days preserve four tutorial visitors plus merchant and police slots")
	check(collision_free,"landlord, merchant, patrol, inspection and fence reservations fit without collisions")
	check(previews_match,"every available visitor preview matches the actual arrival")
	check(exhausted,"quota exhaustion blocks new arrivals without advancing the cursor")
	var early := Model.create("EARLY-INSPECTION")
	early.day = 4
	for n in 100:
		early = Model.create("EARLY-INSPECTION-%d" % n)
		early.day = 4
		NightCrime.ensure_day(early)
		if NightCrime.inspection_pending(early): break
	early = Commerce.reduce(early,{"type":"ARRIVE_INSPECTION"})
	check(early.trade != null and early.trade.get("inspectionVisit",false),"pending inspection can be requested before its appointment")
	if early.trade != null:
		early = Commerce.reduce(early,{"type":"RESOLVE_INSPECTION","tradeId":early.trade.id})
		check(early.cursor == 1,"an early inspection consumes one appointment in the daily total")
	var old := Model.create("OLD-VISITS")
	old.day = 7
	old.cursor = 6
	old.erase("visitSchedule")
	old.nightCrime.days["7"] = {"inspection":true,"inspectionDone":false,"inspectionSlot":5,"inspectionStarted":false,"leniency":false,"fence":{"slot":3},"fenceDone":false}
	var old_day := JSON.stringify(old.nightCrime.days["7"])
	check(schedule.limit(old) == 7 and schedule.landlord_slot(old) == 6,"legacy rent day keeps all six prior appointments and adds a reserved landlord slot")
	NightCrime.ensure_day(old)
	check(old.cursor == 6 and JSON.stringify(old.nightCrime.days["7"]) == old_day,"legacy saved crime schedule and arrival cursor are never truncated or rerolled")
	# Calling the landlord in a merchant appointment must postpone that visitor,
	# rather than consuming the merchant's only chance to sell supplies.
	var swapped := Model.create("REVIEW-3")
	swapped.day = 7
	swapped.cash = 10000
	swapped.cursor = 1
	NightCrime.ensure_day(swapped)
	check(schedule.limit(swapped) == 3 and Commerce.merchant_slot(swapped) == 1,"early-landlord regression starts in the three-visit merchant appointment")
	swapped = Commerce.reduce(swapped,{"type":"CALL_LANDLORD"})
	if swapped.trade != null and swapped.trade.kind == "landlord":
		swapped = Commerce.reduce(swapped,{"type":"PAY_RENT","tradeId":swapped.trade.id})
		swapped = Commerce.reduce(swapped,{"type":"REFUSE"})
	check(swapped.cursor == 2 and schedule.landlord_slot(swapped) == 1 and Commerce.merchant_slot(swapped) == 2,"early paid landlord exchanges appointments with the merchant")
	var swapped_loaded: Dictionary = JSON.parse_string(JSON.stringify(swapped))
	check(schedule.landlord_slot(swapped_loaded) == 1 and Commerce.merchant_slot(swapped_loaded) == 2,"landlord appointment exchange survives reload without remapping twice")
	swapped_loaded = Commerce.reduce(swapped_loaded,{"type":"ARRIVE"})
	check(swapped_loaded.trade != null and swapped_loaded.trade.kind == "merchant","merchant still arrives after early landlord payment and departure")
	var inspection_swap := Model.create("REVIEW-I-8")
	inspection_swap.day = 5
	inspection_swap.cursor = 3
	NightCrime.ensure_day(inspection_swap)
	check(schedule.limit(inspection_swap) == 6 and Commerce.merchant_slot(inspection_swap) == 3 and inspection_swap.nightCrime.days["5"].inspectionSlot == 4,"early-inspection regression starts before its merchant appointment")
	inspection_swap = Commerce.reduce(inspection_swap,{"type":"ARRIVE_INSPECTION"})
	if inspection_swap.trade != null and inspection_swap.trade.get("inspectionVisit",false):
		inspection_swap = Commerce.reduce(inspection_swap,{"type":"RESOLVE_INSPECTION","tradeId":inspection_swap.trade.id})
	check(inspection_swap.cursor == 4 and Commerce.merchant_slot(inspection_swap) == 4 and inspection_swap.nightCrime.days["5"].inspectionSlot == 3,"early inspection exchanges appointments with the postponed merchant")
	inspection_swap = JSON.parse_string(JSON.stringify(inspection_swap))
	inspection_swap = Commerce.reduce(inspection_swap,{"type":"ARRIVE"})
	check(inspection_swap.trade != null and inspection_swap.trade.kind == "merchant","postponed merchant still arrives after early inspection and reload")
	var combined := Model.create("COMBINED-SWAPS-5")
	combined.day = 7
	combined.cash = 10000
	combined.cursor = 2
	NightCrime.ensure_day(combined)
	combined.nightCrime.days["7"].inspection = true
	combined.nightCrime.days["7"].inspectionSlot = 3
	combined.nightCrime.days["7"].fence = {}
	check(schedule.limit(combined) == 7 and Commerce.merchant_slot(combined) == 2,"combined exchange fixture keeps seven appointments and merchant slot two")
	combined = Commerce.reduce(combined,{"type":"ARRIVE_INSPECTION"})
	combined = Commerce.reduce(combined,{"type":"RESOLVE_INSPECTION","tradeId":combined.trade.id})
	combined = JSON.parse_string(JSON.stringify(combined))
	combined = Commerce.reduce(combined,{"type":"CALL_LANDLORD"})
	combined = Commerce.reduce(combined,{"type":"PAY_RENT","tradeId":combined.trade.id})
	combined = Commerce.reduce(combined,{"type":"REFUSE"})
	combined = JSON.parse_string(JSON.stringify(combined))
	check(combined.cursor == 4 and schedule.limit(combined) == 7 and schedule.landlord_slot(combined) == 3 and Commerce.merchant_slot(combined) == 6 and combined.nightCrime.days["7"].inspectionSlot == 2,"inspection and landlord exchanges compose across two reloads without losing the merchant")
	var saved_exchanges := JSON.stringify(combined.visitSchedule.days["7"])
	schedule.reserve_landlord(combined)
	NightCrime.ensure_day(combined)
	check(JSON.stringify(combined.visitSchedule.days["7"]) == saved_exchanges and Commerce.merchant_slot(combined) == 6,"repeated reservation and loaded schedule checks never remap a saved exchange twice")
	combined.cursor = 6
	combined = Commerce.reduce(combined,{"type":"ARRIVE"})
	check(combined.trade != null and combined.trade.kind == "merchant","merchant occupies the remaining final appointment after both early services")
	var fence_swap := Model.create("COMBINED-SWAPS-5")
	fence_swap.day = 7
	fence_swap.cursor = 4
	NightCrime.ensure_day(fence_swap)
	fence_swap.nightCrime.days["7"].fence = {"slot":4}
	schedule.reserve_landlord(fence_swap)
	check(fence_swap.nightCrime.days["7"].fence.slot == 6,"saved fence appointment moves to the vacated landlord appointment")
	fence_swap = JSON.parse_string(JSON.stringify(fence_swap))
	schedule.reserve_landlord(fence_swap)
	check(fence_swap.nightCrime.days["7"].fence.slot == 6,"saved fence appointment survives repeat reservation after reload")
	var overdue := Model.create("REVIEW-I-8")
	overdue.day = 5
	overdue.cursor = 3
	NightCrime.ensure_day(overdue)
	overdue.nightCrime.days["5"].inspectionSlot = 1
	overdue = Commerce.reduce(overdue,{"type":"ARRIVE_INSPECTION"})
	overdue = Commerce.reduce(overdue,{"type":"RESOLVE_INSPECTION","tradeId":overdue.trade.id})
	check(overdue.cursor == 3 and Commerce.merchant_slot(overdue) == 3,"overdue legacy inspection cannot send the current merchant into a consumed appointment")
	overdue = Commerce.reduce(overdue,{"type":"ARRIVE"})
	check(overdue.trade != null and overdue.trade.kind == "merchant","merchant remains available after an overdue legacy inspection")
	var patrol_combo := Model.create("COMBINED-PATROL-3")
	patrol_combo.day = 7
	patrol_combo.cash = 10000
	NightCrime.ensure_day(patrol_combo)
	check(schedule.limit(patrol_combo) == 5 and Commerce.merchant_slot(patrol_combo) == 0 and WantedCases.officer_slot(patrol_combo,0) == 1,"combined patrol fixture starts with separate merchant and officer appointments")
	patrol_combo.nightCrime.days["7"].inspection = true
	patrol_combo = Commerce.reduce(patrol_combo,{"type":"ARRIVE_INSPECTION"})
	patrol_combo = Commerce.reduce(patrol_combo,{"type":"RESOLVE_INSPECTION","tradeId":patrol_combo.trade.id})
	patrol_combo = Commerce.reduce(patrol_combo,{"type":"CALL_LANDLORD"})
	patrol_combo = Commerce.reduce(patrol_combo,{"type":"PAY_RENT","tradeId":patrol_combo.trade.id})
	patrol_combo = Commerce.reduce(patrol_combo,{"type":"REFUSE"})
	patrol_combo = JSON.parse_string(JSON.stringify(patrol_combo))
	check(Commerce.merchant_slot(patrol_combo) == 4 and WantedCases.officer_slot(patrol_combo,4) == 0 and schedule.landlord_slot(patrol_combo) == 1,"merchant and patrol map their original identities once through composed saved exchanges")
	print("VISITS failures=",failures)
	quit(1 if failures else 0)
