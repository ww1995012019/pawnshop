class_name WatchRefurbishment
extends Object
## Optional exterior jobs; movement faults remain owned by WatchService.
const JOBS := ["blow", "clean", "polish", "case", "strap"]
const LABELS := {"blow":"吹除浮灰", "clean":"擦拭清洁", "polish":"表壳抛光", "case":"更换表壳", "strap":"更换表带"}
const GAINS := {"blow":0.03,"clean":0.10,"polish":0.12,"case":0.18,"strap":0.08}
const DESCRIPTIONS := {"blow":"气流带走浮灰，不会去掉油污或划痕。", "clean":"擦净表面污渍，不会修复机芯或深划痕。", "polish":"轻抛表壳表面，细划痕减淡并留下抛光纹。", "case":"换上同型号匹配壳体，原机芯、表盘与后盖保留。替换壳可被鉴定发现。", "strap":"换上同规格完整表带，机芯与缺失内件保持原状。替换表带可被鉴定发现。"}
static func ensure(it: Dictionary) -> void:
 if not it.get("refurbishment") is Dictionary: it.refurbishment = {"version":1,"done":[],"operations":{},"paid":{},"active_case":false}
static func cost(job: String) -> Dictionary:
 match job:
  "blow": return {"ap":0.15,"materials":{}}
  "clean": return {"ap":0.25,"materials":{"MAT-007":1}}
  "polish": return {"ap":0.5,"materials":{"MAT-013":1}}
  "case": return {"ap":1.0,"materials":{"MAT-011":1}}
  "strap": return {"ap":0.5,"materials":{"MAT-012":1}}
 return {"ap":0.0,"materials":{}}
static func progress_problem(s: Dictionary, it, job: String) -> String:
 if it == null: return "请选择手表。"
 if not JOBS.has(job): return "请选择翻新项目。"
 var unavailable := WatchService.available(s,it)
 if unavailable != "": return unavailable
 var ref: Dictionary = it.get("refurbishment",{})
 if ref.get("done",[]).has(job): return "本件已完成这项翻新，无需重复。"
 if ref.get("active_case",false) and job != "case": return "请先完成换壳并封盖，再切换其他操作。"
 if it.get("service",{}).get("forge_task","") != "": return "请先完成当前伪装加工并封盖。"
 if it.get("service",{}).get("opened",false) and not (job == "case" and ref.get("active_case",false)): return "请先收妥内部维修并封盖，再进行外观翻新。"
 if job == "clean" and it.get("service",{}).get("done",[]).has("dust"): return "表面已清洁，无需重复擦拭。"
 if job in ["blow","clean","polish"] and float(it.condition) >= 0.95: return "本件外观已足够完好，无需重复处理。"
 return ""
static func problem(s: Dictionary, it, job: String) -> String:
 var blocked := progress_problem(s,it,job)
 if blocked != "": return blocked
 var price := cost(job)
 if not Model.has_ap(s,price.ap): return "行动点不足：本项翻新需要 %s AP。" % Model.jnum(price.ap)
 for id in price.materials:
  if s.materials.get(id,0) < price.materials[id]: return "缺少%s ×%d；可向流动商人购买。" % [GameData.material(id).name,price.materials[id]]
 return ""
static func save_progress(s: Dictionary, it: Dictionary, job: String, progress) -> String:
 var blocked := progress_problem(s,it,job)
 if blocked != "": return blocked
 if not progress is Dictionary or not WatchService.valid_progress(progress) or progress.get("task","") != "refurb_"+job: return "翻新进度无效，原物保留。"
 ensure(it)
 it.refurbishment.operations[job] = progress.duplicate(true)
 if job == "case":
  it.refurbishment.active_case = true
  it.service.opened = true
 return ""
static func commit(s: Dictionary, it: Dictionary, job: String) -> String:
 var blocked := problem(s,it,job)
 if blocked != "": return blocked
 ensure(it)
 var operation: Dictionary = it.refurbishment.operations.get(job,{})
 if not operation.get("complete",false): return "请先完成这项翻新的实际操作。"
 if job == "case" and operation.get("opened",true): return "替换表壳尚未封盖，请先收妥。"
 var price := cost(job)
 for id in price.materials:
  s.materials[id] -= price.materials[id]
  it.cost += GameData.material(id).price * price.materials[id]
 Model.spend(s,price.ap)
 it.refurbishment.paid[job] = price.duplicate(true)
 it.refurbishment.done.append(job)
 it.condition = maxf(float(it.condition),minf(0.95,float(it.condition)+GAINS[job]))
 if job == "case":
  it.refurbishment.active_case = false
  it.service.opened = false
 if job == "strap":
  for fault in it.service.faults:
   if fault.id == "missing_link" and not fault.resolved:
    it.watch.mass = snappedf(float(it.watch.mass)+float(it.watch.get("part_mass",0)),0.1)
    it.watch.missing_part = ""
    it.watch.part_mass = 0.0
    fault.resolved = true
  var pending: bool = it.service.faults.any(func(f): return not f.resolved and f.id in ["battery","movement_part","missing_link","missing_fixing"])
  if not pending and it.service.tasks.has("replace") and not it.service.done.has("replace"): it.service.done.append("replace")
 if job == "clean":
  for fault in it.service.faults:
   if fault.id == "dust": fault.resolved = true
  if it.service.tasks.has("dust") and not it.service.done.has("dust"): it.service.done.append("dust")
 it.listPrice = Model.jround(GameData.def(it.defId).value * it.condition * 0.88)
 return ""
static func trace(it: Dictionary) -> String:
 var done: Array = it.get("refurbishment",{}).get("done",[])
 var notes := []
 if done.has("case"): notes.append("替换表壳：壳耳接缝与新旧件光泽存在差异")
 if done.has("strap"): notes.append("替换表带：生耳与带端有更换装配痕迹")
 if done.has("polish"): notes.append("表壳可见方向一致的细抛光纹")
 return "；".join(notes) + ("。" if not notes.is_empty() else "")
