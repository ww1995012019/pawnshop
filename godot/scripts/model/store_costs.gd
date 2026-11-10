class_name StoreCosts
extends RefCounted
## Persisted business-day activations and successful operations, all in cents.
## Devices are individual instances; add another unique id of a type for quantity.
const VERSION := 1
const DEVICES := {
	"lighting":{"name":"店面基础照明组","cents":200},
	"quote_terminal":{"name":"柜台报价机","cents":200},
	"order_terminal":{"name":"订单终端","cents":100},
	"scanner":{"name":"来源核验扫描设备","cents":100},
	"uv":{"name":"紫外检视灯","cents":50},
	"scale":{"name":"电子秤","cents":50},
	"repair_tester":{"name":"维修测试仪组","cents":100},
	"lamp":{"name":"可变焦工作灯","cents":100}}

static func _factor(status: String) -> int:
	return 120 if status == "maintenance" else (100 if status == "normal" else 0)

static func _available(s: Dictionary, entry: Dictionary) -> bool:
	return DEVICES.has(entry.get("type", "")) and bool(entry.get("installed",true)) and bool(entry.get("enabled",true)) and int(entry.get("installedDay",1)) <= int(s.day) and _factor(String(entry.get("status","normal"))) > 0

static func _instance(kind: String, day: int) -> Dictionary:
	return {"id":kind,"type":kind,"status":"normal","installed":true,"enabled":true,"installedDay":day}

static func ensure(s: Dictionary) -> void:
	if not s.has("storeCosts"):
		# Old saves retain today's complete old tariff. Never recalculate this date.
		s.storeCosts = {"version":VERSION,"fromDay":int(s.day) + 1}
	var costs: Dictionary = s.storeCosts
	if not costs.has("devices"):
		costs.devices = []
		for kind in DEVICES:
			if kind != "lamp": costs.devices.append(_instance(kind,1))
	if not costs.has("days"): costs.days = {}
	if s.get("upgrades",{}).get("lamp",false):
		var found := false
		for entry in costs.devices:
			if entry.type == "lamp": found = true
		if not found:
			costs.devices.append(_instance("lamp",int(s.day) + (0 if s.get("phase","open") == "open" else 1)))
	if int(s.day) < int(costs.fromDay): return
	var day := str(int(s.day))
	if not costs.days.has(day): costs.days[day] = {"devices":{},"usage":{}}
	if s.get("phase","open") != "open": return
	var entries: Dictionary = costs.days[day].devices
	for entry in costs.devices:
		if not _available(s,entry) or entries.has(String(entry.id)): continue
		var kind := String(entry.type)
		entries[String(entry.id)] = {"device":String(entry.id),"type":kind,"name":DEVICES[kind].name,"status":String(entry.get("status","normal")),"count":1,"cents":int(DEVICES[kind].cents) * _factor(String(entry.get("status","normal"))) / 100}

static func device_problem(s: Dictionary, device: String) -> String:
	ensure(s)
	for entry in s.storeCosts.devices:
		if (entry.type == device or entry.id == device) and _available(s,entry): return ""
	return "%s未安装、未启用或正在停机维修，暂不能操作。" % DEVICES.get(device,{"name":device}).name

static func _usage_device(s: Dictionary, device: String) -> Dictionary:
	ensure(s)
	for entry in s.storeCosts.devices:
		if (entry.type == device or entry.id == device) and _available(s,entry): return entry
	return {}

static func _usage_cents(entry: Dictionary, cr: float) -> int:
	return int(round(cr * 100.0)) * _factor(String(entry.get("status","normal"))) / 100

## Preview the next successful use without recording or rounding the day total.
static func usage_quote(s: Dictionary, device: String, cr: float) -> float:
	var entry := _usage_device(s,device)
	if entry.is_empty() or int(s.day) < int(s.storeCosts.fromDay) or s.get("phase","open") != "open" or cr <= 0: return 0.0
	return float(_usage_cents(entry,cr)) / 100.0

static func record(s: Dictionary, device: String, key: String, cr: float) -> void:
	var entry := _usage_device(s,device)
	if entry.is_empty() or int(s.day) < int(s.storeCosts.fromDay) or s.get("phase","open") != "open" or cr <= 0: return
	var usage: Dictionary = s.storeCosts.days[str(int(s.day))].usage
	var identity := device + "|" + key
	if usage.has(identity): return
	var kind := String(entry.type)
	usage[identity] = {"device":String(entry.id),"type":kind,"name":DEVICES[kind].name,"status":String(entry.get("status","normal")),"key":key,"count":1,"cr":cr,"cents":_usage_cents(entry,cr)}

static func quote(s: Dictionary) -> Dictionary:
	ensure(s)
	if s.get("report") is Dictionary and s.report.get("day",-1) == s.day and s.report.has("costs") and s.get("phase","") != "open":
		return s.report.costs.duplicate(true)
	var details := {"devices":[],"usage":[],"dailyCents":0,"usageCents":0,"totalCents":0}
	var legacy := int(s.day) < int(s.storeCosts.fromDay)
	if not legacy:
		var day: Dictionary = s.storeCosts.days[str(int(s.day))]
		for entry in day.devices.values():
			details.devices.append(entry.duplicate(true))
			details.dailyCents += int(entry.cents)
		for entry in day.usage.values():
			details.usage.append(entry.duplicate(true))
			details.usageCents += int(entry.cents)
		details.totalCents = details.dailyCents + details.usageCents
	var electricity := int(ceil(float(details.totalCents) / 100.0))
	var cleaning := 0 if legacy else 8
	var maintenance := 20 if legacy else 0
	return {"electricity":electricity,"cleaning":cleaning,"maintenance":maintenance,"total":electricity+cleaning+maintenance,"details":details,"legacy":legacy}
