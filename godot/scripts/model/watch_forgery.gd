class_name WatchForgery
extends Object
## Physical surface treatments; never overwrite the watch's underlying truth.
const METHODS := ["logo", "serial", "weight"]
const TOOLS := {"logo":"TOL-001", "serial":"TOL-002", "weight":"TOL-005"}
const SKILLS := {"logo":"logo", "serial":"serial", "weight":"structure"}
const LABELS := {"logo":"重描标识", "serial":"伪造紫外编号", "weight":"配重掩盖缺件"}
const COSTS := {"logo":{"MAT-001":1,"MAT-006":1}, "serial":{"MAT-001":1,"MAT-004":1}, "weight":{"MAT-002":1,"MAT-004":1}}

static func treatments(it: Dictionary) -> Dictionary:
	return it.get("forgery", {}).get("methods", {})

static func active(it: Dictionary, method: String) -> bool:
	return treatments(it).has(method) and not treatments(it)[method].get("removed", false)

static func exposed(it: Dictionary) -> bool:
	for entry in treatments(it).values():
		if entry.get("exposed", false) and not entry.get("removed", false): return true
	return false

static func trace(it: Dictionary, tool: String) -> String:
	for method in METHODS:
		if TOOLS[method] != tool or not active(it, method): continue
		match method:
			"logo": return "加工痕迹：标识边缘有重描漆层。"
			"serial": return "加工痕迹：紫外编号周围可见覆印晕边。"
			"weight": return "加工痕迹：稳定质量接近参考，但重心偏向后盖配重。"
	return ""

static func target_serial(it: Dictionary) -> String:
	var ref: Dictionary = GameData.def(it.defId).watch
	var bits := String(it.watch.serial).split(" ", false)
	var tail := " ".join(bits.slice(2)) if bits.size() >= 4 else "2400 000001"
	return "%s %s %s" % [ref.serial_prefix, ref.model, tail]

static func apply(it: Dictionary, method: String) -> void:
	var methods := treatments(it).duplicate(true)
	var entry := {"exposed":false}
	if method == "serial": entry.serial = target_serial(it)
	if method == "weight": entry.ballast = snappedf(maxf(0, float(GameData.def(it.defId).watch.nominal_mass) - float(it.watch.mass)), 0.1)
	methods[method] = entry
	it.forgery = {"methods":methods,"exposed":exposed(it)}

static func summary(it: Dictionary) -> String:
	var rows: Array[String] = []
	for method in METHODS:
		if treatments(it).has(method) and treatments(it)[method].get("removed", false):
			rows.append(LABELS[method] + "（维修已移除）")
			continue
		if not active(it, method): continue
		rows.append(LABELS[method] + ("（已被识破）" if treatments(it)[method].get("exposed", false) else "（留下加工痕迹）"))
	if rows.is_empty() and it.has("forgery"): return "旧版伪装记录 · 未改变真实状态，可选择具体加工方式。"
	return "；".join(rows)

static func cost_text(method: String) -> String:
	var parts: Array[String] = []
	for id in COSTS[method]: parts.append("%s×%d" % [GameData.material(id).name, COSTS[method][id]])
	return "、".join(parts) + " · 1 AP"
