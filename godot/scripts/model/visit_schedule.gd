class_name VisitSchedule
extends RefCounted
## One saved quota per campaign day. Days 1–3 keep at least six appointments:
## four teaching customers and separate merchant/patrol slots. Later days use
## every integer from 3–10 with equal hash probability, independently of AP.

static func _day(s: Dictionary) -> Dictionary:
	if not s.get("visitSchedule") is Dictionary: s.visitSchedule = {"version":1,"days":{}}
	if not s.visitSchedule.get("days") is Dictionary: s.visitSchedule.days = {}
	var key := str(int(s.day))
	if not s.visitSchedule.days.has(key):
		# Already generated crime days predate quotas. Preserve their six-slot
		# schedule, including special visitor hashes and the current cursor.
		var legacy: bool = s.get("nightCrime",{}).get("days",{}).has(key)
		var quota := 3 + Model.fnv("%s/visits/%s" % [s.seed,key]) % 8
		if int(s.day) <= 3: quota = maxi(6,quota)
		if legacy: quota = 7 if int(s.day) in [7,14,21] else 6
		quota = maxi(quota,mini(10,int(s.get("cursor",0)) + (1 if s.get("trade") is Dictionary else 0)))
		s.visitSchedule.days[key] = {"limit":quota,"legacy":legacy}
	return s.visitSchedule.days[key]

static func limit(s: Dictionary) -> int:
	if s.is_empty(): return 6 # Legacy reducer/replay callers without live state.
	return int(_day(s).limit)

static func landlord_slot(s: Dictionary) -> int:
	if int(s.day) not in [7,14,21]: return -1
	var record: Dictionary = s.get("rent",{}).get("days",{}).get(str(int(s.day)),{})
	return int(record.get("slot",remap_slot(s,limit(s)-1)))

static func merchant_slot(s: Dictionary) -> int:
	var day := int(s.day)
	var quota := limit(s)
	if day == 1: return 4
	var cycle := int((day-2)/2)
	var draw := Model.fnv("%s/merchant/%d" % [s.seed,cycle])
	if day != 2+cycle*2+draw%2: return -1
	var slot := 4+int((draw>>3)%2) if day <= 3 else int((draw>>3) % (6 if _day(s).legacy else quota))
	var final_slot := quota-1 if int(s.day) in [7,14,21] else -1
	return remap_slot(s,available_slot(s,slot,[final_slot]))

static func available_slot(s: Dictionary, preferred: int, reserved: Array) -> int:
	var quota := limit(s)
	for offset in quota:
		var slot := (preferred+offset)%quota
		if not reserved.has(slot): return slot
	return -1

static func legacy(s: Dictionary) -> bool:
	return bool(_day(s).legacy)

## Slot identities are chosen in the original schedule, then passed through
## the saved exchanges once. Saved physical appointments receive only a newly
## added exchange, so repeated previews and reloads cannot undo an exchange.
static func remap_slot(s: Dictionary, preferred: int) -> int:
	if preferred < 0: return preferred
	var result := preferred
	for pair in _day(s).get("swaps",[]): result = _swap_slot(result,int(pair[0]),int(pair[1]))
	return result

static func original_slot(s: Dictionary, mapped: int) -> int:
	if mapped < 0: return mapped
	var result := mapped
	var swaps: Array = _day(s).get("swaps",[])
	for index in range(swaps.size()-1,-1,-1):
		result = _swap_slot(result,int(swaps[index][0]),int(swaps[index][1]))
	return result

static func _swap_slot(slot: int, first: int, second: int) -> int:
	if slot == first: return second
	if slot == second: return first
	return slot

static func _exchange(s: Dictionary, current: int, scheduled: int) -> void:
	var quota := limit(s)
	if current == scheduled or current < 0 or scheduled < 0 or current >= quota or scheduled >= quota: return
	var daily := _day(s)
	if not daily.get("swaps") is Array: daily.swaps = []
	daily.swaps.append([current,scheduled])
	var crime_day: Dictionary = s.get("nightCrime",{}).get("days",{}).get(str(int(s.day)),{})
	if crime_day.has("inspectionSlot"):
		crime_day.inspectionSlot = _swap_slot(int(crime_day.inspectionSlot),current,scheduled)
	if crime_day.get("fence") is Dictionary and crime_day.fence.has("slot"):
		crime_day.fence.slot = _swap_slot(int(crime_day.fence.slot),current,scheduled)

## Called at the first actual landlord arrival, before creating its trade.
## The displaced visitor takes the landlord's remaining scheduled appointment.
static func reserve_landlord(s: Dictionary) -> int:
	if int(s.day) not in [7,14,21]: return -1
	var quota := limit(s)
	if not s.get("rent") is Dictionary: s.rent = {"version":1,"days":{}}
	if not s.rent.get("days") is Dictionary: s.rent.days = {}
	var key := str(int(s.day))
	if not s.rent.days.get(key) is Dictionary: s.rent.days[key] = {}
	var record: Dictionary = s.rent.days[key]
	if not record.has("slot"): record.slot = mini(int(s.cursor),quota-1)
	if not record.get("scheduleReserved",false):
		_exchange(s,int(record.slot),remap_slot(s,quota-1))
		record.scheduleReserved = true
	return int(record.slot)

## Early police service exchanges positions with the current appointment.
## An exhausted legacy schedule still uses its existing bonus-visit path.
static func reserve_inspection(s: Dictionary) -> void:
	var crime_day: Dictionary = s.get("nightCrime",{}).get("days",{}).get(str(int(s.day)),{})
	if crime_day.has("inspectionSlot") and int(s.cursor) < int(crime_day.inspectionSlot):
		_exchange(s,int(s.cursor),int(crime_day.inspectionSlot))
