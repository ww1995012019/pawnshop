class_name WatchForgery
extends Object
## Physical surface treatments; never overwrite the watch's underlying truth.
const METHODS := ["logo", "serial", "weight"]
const TOOLS := {"logo":"TOL-001", "serial":"TOL-002", "weight":"TOL-005", "case":"TOL-001"}
const SKILLS := {"logo":"logo", "serial":"serial", "weight":"structure", "case":"structure"}
const LABELS := {"logo":"重描标识", "serial":"伪造紫外编号", "weight":"配重校准", "case":"改装目标外壳"}
const COSTS := {"logo":{"MAT-001":1,"MAT-006":1}, "serial":{"MAT-001":1,"MAT-004":1}, "weight":{"MAT-002":1,"MAT-004":1}, "case":{"MAT-011":1,"MAT-012":1}}

static func treatments(it: Dictionary) -> Dictionary:
	return it.get("forgery", {}).get("methods", {})

static func active(it: Dictionary, method: String) -> bool:
	return treatments(it).has(method) and not treatments(it)[method].get("removed", false)

static func exposed(it: Dictionary) -> bool:
	for entry in treatments(it).values():
		if entry.get("exposed", false) and not entry.get("removed", false): return true
	return false

static func trace(it: Dictionary, tool: String) -> String:
	for method in available_methods(it):
		if TOOLS[method] != tool or not active(it, method): continue
		match method:
			"logo": return "加工痕迹：标识边缘有重描漆层。"
			"serial": return "加工痕迹：紫外编号周围可见覆印晕边。"
			"weight": return "加工痕迹：稳定质量接近参考，但重心偏向后盖配重。"
			"case": return "加工痕迹：替换外壳与表带存在新旧件差异、壳耳装配痕。"
	return ""

static func target_serial(it: Dictionary) -> String:
	var ref: Dictionary = GameData.def(target_id(it) if target_id(it)!="" else it.defId).watch
	var bits := String(it.watch.serial).split(" ", false)
	var tail := " ".join(bits.slice(2)) if bits.size() >= 4 else "2400 000001"
	return "%s %s %s" % [ref.serial_prefix, ref.model, tail]

static func apply(it: Dictionary, method: String) -> void:
	var entries := treatments(it).duplicate(true)
	var entry := {"exposed":false,"targetId":target_id(it)}
	if method == "serial": entry.serial = target_serial(it)
	if method == "weight":
		var ref_id := target_id(it) if target_id(it)!="" else String(it.defId)
		entry.ballast = snappedf(maxf(0,float(GameData.def(ref_id).watch.nominal_mass)-float(it.watch.mass)-mass_delta(it)),0.1)
	if method == "case":
		var refurbishment: Dictionary=it.get("refurbishment",{})
		if not refurbishment.is_empty():
			if not refurbishment.has("history"): refurbishment.history=[]
			for job in ["case","strap"]:
				if refurbishment.get("done",[]).has(job):
					refurbishment.history.append({"job":job,"paid":refurbishment.get("paid",{}).get(job,{}).duplicate(true)})
					refurbishment.done.erase(job)
					refurbishment.get("operations",{}).erase(job)
		var delta := float(GameData.def(target_id(it)).watch.nominal_mass)-float(GameData.def(it.defId).watch.nominal_mass)
		entry.case_delta=delta*0.7
		entry.strap_delta=delta*0.3
		resolve_link(it)
		if entries.has("weight"): entries.weight.removed=true
	entries[method]=entry
	var record: Dictionary=it.get("forgery",{}).duplicate(true)
	record.methods=entries
	if target_id(it)!="": record.target_locked=true
	it.forgery=record
	it.forgery.exposed=exposed(it)

static func summary(it: Dictionary) -> String:
	var rows: Array[String] = []
	for method in available_methods(it):
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

const TARGET_METHODS := ["logo","case","serial","weight"]
const EXTRA_TEMPLATES := [0,6,2,9,1,3,6,3,7,10,11,8,12,14,7,13,10,8]
static func template(id: String) -> int:
	var authored: Dictionary = WatchLogo.art(id)
	if authored.has("template"): return int(authored.template)
	var index := clampi(id.get_slice("-",1).to_int()-1,0,32)
	return index if index < 15 else EXTRA_TEMPLATES[index-15]
static func shape(id: String) -> String:
	return "square" if WatchLogo.art(id).get("shape","")=="square" or template(id)==6 else "round"
static func compatible(it: Dictionary, id: String) -> bool:
	GameData.ensure()
	var source: Dictionary = GameData.items.get(it.get("defId",""),{})
	var target: Dictionary = GameData.items.get(id,{})
	return not target.is_empty() and not source.is_empty() and target.has("watch") and source.has("watch") and float(target.value)>float(source.value) and source.watch.movement==target.watch.movement and shape(it.defId)==shape(id)
static func compatible_targets(it: Dictionary) -> Array:
	var out := []
	for definition in GameData.item_list:
		if compatible(it,definition.id): out.append(definition.id)
	return out
static func target_id(it: Dictionary) -> String:
	var id := String(it.get("forgery",{}).get("targetId",""))
	return id if compatible(it,id) else ""
static func available_methods(it: Dictionary) -> Array:
	return TARGET_METHODS if target_id(it)!="" else METHODS
static func target_active(it: Dictionary, method: String) -> bool:
	var id := target_id(it)
	return id!="" and active(it,method) and treatments(it)[method].get("targetId","")==id
static func completed(it: Dictionary, method: String) -> bool:
	return treatments(it).has(method) and treatments(it)[method].get("targetId","")==target_id(it)
static func is_targeted(it: Dictionary) -> bool:
	for method in TARGET_METHODS:
		if target_active(it,method): return true
	return false
static func appearance_id(it: Dictionary) -> String:
	return target_id(it) if target_active(it,"case") and not treatments(it).case.get("case_removed",false) else String(it.defId)
static func logo_id(it: Dictionary) -> String:
	return target_id(it) if target_active(it,"logo") else String(it.defId)
static func matches(it: Dictionary) -> Dictionary:
	var id := target_id(it)
	if id=="": return {"logo":false,"serial":false,"case":false,"weight":false}
	var ref: Dictionary = GameData.def(id).watch
	return {"logo":target_active(it,"logo"),"serial":target_active(it,"serial"),"case":target_active(it,"case") and not treatments(it).case.get("case_removed",false) and not treatments(it).case.get("strap_removed",false),"weight":absf(WatchRules.mass(it)-float(ref.nominal_mass))<=float(ref.tolerance)}
static func similarity(it: Dictionary) -> int:
	var result := 0
	for matched in matches(it).values():
		if matched: result+=25
	return result
static func perceived_base(it: Dictionary) -> float:
	var base := float(GameData.def(it.defId).value)
	return lerpf(base,float(GameData.def(target_id(it)).value),float(similarity(it))/100.0) if is_targeted(it) else base
static func check_chance(skill: float, matched: bool) -> float:
	return clampf(skill*0.45,0,60) if matched else clampf(skill*1.1+15,15,100)
static func signature(it: Dictionary) -> String:
	return JSON.stringify([target_id(it),matches(it),treatments(it)])
static func sale_name(it: Dictionary) -> String:
	return "%s（原表：%s）" % [GameData.def(target_id(it)).name,GameData.def(it.defId).name] if is_targeted(it) else String(GameData.def(it.defId).name)
static func quality_text(it: Dictionary) -> String:
	var score := similarity(it)
	return "高度接近" if score>=75 else "部分接近" if score>=50 else "粗仿"
static func select_problem(s: Dictionary, it, id: String) -> String:
	if it==null: return "请选择自有手表。"
	if s.phase!="open": return "打烊后不能选择仿冒目标。"
	if it.owner!="shop" or it.has("orderId") or it.sealed or it.location=="isolation" or not it.sourceVerified or Model.trade_reserved(s,it): return "只能加工来源已核验、未被占用的店铺自有手表。"
	if it.get("service",{}).get("opened",false): return "请先收妥当前工序并封盖。"
	if not compatible(it,id): return "目标必须是外形、机芯兼容且目录价更高的型号。"
	if it.get("forgery",{}).get("target_locked",false) and target_id(it)!=id: return "已开始目标加工，不能更换冒充型号。"
	return ""
static func mass_delta(it: Dictionary) -> float:
	if not target_active(it,"case"): return 0.0
	var entry: Dictionary = treatments(it).case
	return (0.0 if entry.get("case_removed",false) else float(entry.get("case_delta",0)))+(0.0 if entry.get("strap_removed",false) else float(entry.get("strap_delta",0)))
static func restore_exterior(it: Dictionary, part: String) -> void:
	if not target_active(it,"case"): return
	treatments(it).case[part+"_removed"]=true
	if part=="case" and target_active(it,"serial"): treatments(it).serial.removed=true
static func resolve_link(it: Dictionary) -> void:
	if String(it.get("watch",{}).get("missing_part",""))!="一节可拆表节": return
	it.watch.mass=snappedf(float(it.watch.mass)+float(it.watch.get("part_mass",0)),0.1)
	it.watch.missing_part=""
	it.watch.part_mass=0.0
	for fault in it.get("service",{}).get("faults",[]):
		if fault.id=="missing_link": fault.resolved=true
	var service: Dictionary=it.get("service",{})
	if not service.is_empty() and service.faults.all(func(f): return f.resolved or not f.id in ["battery","movement_part","missing_link","missing_fixing"]):
		if service.tasks.has("replace") and not service.done.has("replace"): service.done.append("replace")

static func strap_id(it: Dictionary) -> String:
	return target_id(it) if target_active(it,"case") and not treatments(it).case.get("strap_removed",false) else String(it.defId)
