class_name WatchService
extends Object
## Persistent physical work orders. Only the reducer commits resource/part changes.
const TASKS := ["dust", "open", "wash", "replace", "assemble", "test"]
const LABELS := {"dust":"清洁除尘", "open":"开盖拆检", "wash":"零件清洗与干燥", "replace":"故障件修复与更换", "assemble":"定点润滑与回装", "test":"走时校验与交工"}

static func profile(it: Dictionary) -> Dictionary:
	return it.get("service", {}).get("profile", WatchRules.model_reference(it.defId)).duplicate(true)

static func _fault(id: String, text: String, internal: bool, functional := false) -> Dictionary:
	return {"id":id,"kind":id,"label":text,"internal":internal,"functional":functional,"resolved":false,"discovered":not internal}

static func ensure(it: Dictionary, seed := "") -> void:
	if it.has("service"): return
	WatchRules.initialize(it, seed)
	var ref := WatchRules.model_reference(it.defId)
	var p := {"movement":ref.movement,"caseback":ref.caseback,"parts":ref.parts.duplicate()}
	var faults := []
	var order := []
	# Completed old repairs are historical facts, never a reason to draw new work.
	if not it.get("repaired",false):
		if float(it.get("condition",1.0)) < 0.78:
			faults.append(_fault("dust","表面有可清洁的积灰；擦拭不能消除划痕。",false))
		var missing := String(it.watch.get("missing_part",""))
		if missing != "":
			var external: bool = ref.strap == "金属带" and (missing.contains("表节") or missing.contains("链节"))
			var fault := _fault("missing_link" if external else "missing_fixing", "缺少" + missing, not external)
			fault.part = missing
			fault.part_mass = float(it.watch.get("part_mass",0))
			faults.append(fault)
		if not it.get("working",true):
			var draw := Model.fnv(seed + "/" + String(it.uid) + "/" + String(it.defId) + "/service-v1")
			if p.movement == "quartz":
				faults.append(_fault("battery","停走：电池供电不足，需确认后更换匹配电池。",true,true))
			elif draw % 2 == 0:
				faults.append(_fault("movement_part","停走：传动部件失效，需定位并修复匹配部件。",true,true))
			else:
				faults.append(_fault("old_oil","停走：旧油积污阻碍轮系，需拆洗、干燥与润滑。",true,true))
	var internal := false
	var washing := false
	var replacing := false
	for f in faults:
		internal = internal or f.internal
		washing = washing or f.id == "old_oil"
		replacing = replacing or f.id in ["battery","movement_part","missing_link","missing_fixing"]
	if faults.any(func(f):return f.id == "dust"): order.append("dust")
	if internal: order.append("open")
	if washing: order.append("wash")
	if replacing: order.append("replace")
	if internal:
		order.append("assemble")
		order.append("test")
	it.service = {"version":1,"profile":p,"faults":faults,"tasks":order,"done":[],"opened":false,"operations":{},"paid":{},"active":false,"finished":false}

static func tasks(it: Dictionary) -> Array:
	ensure(it)
	return it.service.tasks.duplicate()

static func current(it: Dictionary) -> String:
	ensure(it)
	for task in it.service.tasks:
		if not it.service.done.has(task): return task
	return ""

static func label(task: String, it := {}) -> String:
	if task == "assemble" and not it.is_empty() and profile(it).movement == "quartz": return "必要回装与供能恢复"
	if task == "test" and not it.is_empty() and profile(it).movement == "quartz": return "供电步进检查与封盖"
	return LABELS.get(task, WatchForgery.LABELS.get(task.trim_prefix("forge_"),task))

static func _has_fault(it: Dictionary, ids: Array, unresolved := true) -> bool:
	for fault in it.service.faults:
		if ids.has(fault.id) and (not unresolved or not fault.resolved): return true
	return false

static func step_cost(task: String, it: Dictionary) -> Dictionary:
	ensure(it)
	match task:
		"dust": return {"ap":0.25,"materials":{}}
		"open": return {"ap":0.25,"materials":{}}
		"wash": return {"ap":0.5,"materials":{"MAT-007":1}}
		"replace":
			var mats := {}
			if _has_fault(it,["battery"]): mats["MAT-010"] = 1
			if _has_fault(it,["movement_part","missing_link","missing_fixing"]): mats["MAT-008"] = 1
			return {"ap":0.75,"materials":mats}
		"assemble": return {"ap":0.5,"materials":{"MAT-009":1} if _has_fault(it,["old_oil"]) else {}}
		"test": return {"ap":0.5,"materials":{}}
	return {"ap":0.0,"materials":{}}

static func finished(it: Dictionary) -> bool:
	ensure(it)
	return current(it) == "" and not it.service.opened

static func available(state: Dictionary, it: Dictionary) -> String:
	if state.get("phase","") != "open": return "打烊后不能操作工作台。"
	if Model.trade_reserved(state,it) or it.owner == "pawn" or it.location == "isolation" or it.sealed or not it.sourceVerified:
		return "保管、交易占用、来源未核或隔离货物不能加工。"
	if not ["shop","customer"].has(it.owner): return "这件手表不在店铺或委修保管中。"
	return ""

static func progress_problem(state: Dictionary, it: Dictionary, task := "") -> String:
	# Physical progress can be saved before the separate, atomic cost commit.
	ensure(it)
	var unavailable := available(state,it)
	if unavailable != "": return unavailable
	if it.service.get("forge_task","") != "": return "请先收妥当前伪装加工并封盖。"
	if task == "": task = current(it)
	if task == "": return "" if not it.service.opened else "后盖尚未封回。"
	if it.service.done.has(task): return "这道工序已完成，不能重复扣料或修复。"
	if task != current(it): return "请先完成：" + label(current(it),it)
	return ""

static func problem(state: Dictionary, it: Dictionary, task := "") -> String:
	var blocked := progress_problem(state,it,task)
	if blocked != "": return blocked
	if task == "": task = current(it)
	if task == "": return ""
	var cost := step_cost(task,it)
	if not Model.has_ap(state,cost.ap): return "行动点不足：本工序需要%s AP。" % Model.jnum(cost.ap)
	for id in cost.materials:
		if state.materials.get(id,0) < cost.materials[id]: return "维修材料不足：%s×%s，尚未扣料。" % [GameData.material(id).name,Model.jnum(cost.materials[id])]
	return ""

static func valid_progress(value, depth := 0) -> bool:
	if depth > 24: return false
	match typeof(value):
		TYPE_NIL, TYPE_BOOL, TYPE_INT, TYPE_STRING: return true
		TYPE_FLOAT: return is_finite(value)
		TYPE_ARRAY:
			for entry in value:
				if not valid_progress(entry,depth+1): return false
			return true
		TYPE_DICTIONARY:
			for key in value:
				if not key is String or not valid_progress(value[key],depth+1): return false
			return true
	return false

static func _resolve(it: Dictionary, ids: Array) -> void:
	for fault in it.service.faults:
		if ids.has(fault.id): fault.resolved = true

static func _restore_function(it: Dictionary) -> void:
	for fault in it.service.faults:
		if fault.get("functional",false) and not fault.resolved: return
	it.working = true

static func commit(it: Dictionary, task: String) -> void:
	# Called once by SERVICE_COMPLETE after dependencies, animation and cost validation.
	match task:
		"dust":
			_resolve(it,["dust"])
			it.condition = maxf(float(it.condition),minf(0.95,float(it.condition)+0.1))
		"open":
			it.service.opened = true
			for fault in it.service.faults:
				if fault.internal: fault.discovered = true
		"wash":
			# Old oil remains a functional fault until the clean parts are lubricated.
			for fault in it.service.faults:
				if fault.id == "old_oil": fault.cleaned = true
			it.condition = maxf(float(it.condition),minf(0.95,float(it.condition)+0.08))
		"replace":
			if _has_fault(it,["missing_link","missing_fixing"]): WatchRules.restore_parts(it)
			_resolve(it,["battery","movement_part","missing_link","missing_fixing"])
			_restore_function(it)
			it.condition = maxf(float(it.condition),minf(0.95,float(it.condition)+0.15))
		"assemble":
			if it.service.done.has("wash"):
				_resolve(it,["old_oil"])
				it.condition = maxf(float(it.condition),minf(0.95,float(it.condition)+0.07))
			_restore_function(it)
		"test":
			it.service.opened = false
			it.condition = maxf(float(it.condition),minf(0.95,float(it.condition)+0.05))
	it.service.done.append(task)
