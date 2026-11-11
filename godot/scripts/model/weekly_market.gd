class_name WeeklyMarket
extends RefCounted
## Saved public demand, independent of a watch's hidden authenticity or value.
const VERSION := 1
const TIERS := ["low","mid","luxury","ultra"]
const LABELS := {"low":"低等","mid":"中等","luxury":"名贵","ultra":"珍稀"}

static func week(s: Dictionary) -> int:
	return int((maxi(1,int(s.get("day",1))) - 1) / 7) + 1

static func _hash(value: String) -> int:
	var result := 2166136261
	for character in value.length():
		result = ((result ^ value.unicode_at(character)) * 16777619) & 0xFFFFFFFF
	return result

static func _schedule(seed: String, number: int) -> Dictionary:
	if number <= 1:
		return {"week":1,"title":"第1周 · 平稳开市","hotTier":"","coldTier":"","hotPercent":0,"coldPercent":0,"explanation":"开业首周各档手表需求平稳，需求不加价也不减价。"}
	var draw := _hash("%s/weekly-market-v1/%d" % [seed,number])
	var hot := int(draw % TIERS.size())
	var cold := (hot + 1 + int((draw >> 8) % (TIERS.size()-1))) % TIERS.size()
	return {"week":number,"title":"第%d周 · %s走热" % [number,LABELS[TIERS[hot]]],"hotTier":TIERS[hot],"coldTier":TIERS[cold],"hotPercent":20,"coldPercent":-15,"explanation":"本周%s档需求上涨20%%，%s档需求下降15%%；其他档不变。按可见外观档次判断，只影响新的顾客报价。" % [LABELS[TIERS[hot]],LABELS[TIERS[cold]]]}

static func ensure(s: Dictionary) -> void:
	if not s.get("weeklyMarket") is Dictionary:
		s.weeklyMarket = {"version":VERSION,"seed":String(s.get("seed","")),"weeks":{}}
	var market: Dictionary = s.weeklyMarket
	if not market.has("version"): market.version = VERSION
	if not market.has("seed"): market.seed = String(s.get("seed",""))
	if not market.get("weeks") is Dictionary: market.weeks = {}
	for number in [week(s),week(s)+1]:
		var key := str(number)
		if not market.weeks.has(key): market.weeks[key] = _schedule(String(market.seed),number)

static func _snapshot(s: Dictionary, number: int) -> Dictionary:
	ensure(s)
	var snapshot: Dictionary = s.weeklyMarket.weeks[str(number)].duplicate(true)
	# Godot's JSON parser restores all numbers as floats. Keep the public API
	# identical before and after loading without rewriting saved snapshots.
	for key in ["week","hotPercent","coldPercent"]: snapshot[key] = int(snapshot[key])
	return snapshot

static func current(s: Dictionary) -> Dictionary:
	return _snapshot(s,week(s))

static func forecast(s: Dictionary) -> Dictionary:
	return _snapshot(s,week(s)+1)

static func multiplier(s: Dictionary, it: Dictionary) -> float:
	if not s.get("weeklyMarket") is Dictionary: return 1.0
	if int(s.weeklyMarket.get("version",0)) != VERSION or not s.weeklyMarket.get("enabled",true) or week(s) == 1: return 1.0
	var demand := current(s)
	# appearance_id reads completed physical case changes, never the true tier.
	var tier := String(GameData.items.get(WatchForgery.appearance_id(it),{}).get("tier",""))
	if tier == "": return 1.0
	if tier == demand.hotTier: return 1.2
	if tier == demand.coldTier: return 0.85
	return 1.0
