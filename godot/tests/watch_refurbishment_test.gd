extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
 print("REFURB ", "PASS " if ok else "FAIL ", message)
 if not ok: failures += 1
func complete_job(s: Dictionary, uid: String, job: String) -> Dictionary:
 var progress := {"version":1,"task":"refurb_"+job,"phase":"idle","step":20,"complete":true,"opened":false}
 s = Model.reduce(s,{"type":"REFURB_PROGRESS","uid":uid,"job":job,"progress":progress})
 return Model.reduce(s,{"type":"REFURB_COMPLETE","uid":uid,"job":job})
func run() -> void:
 if not ResourceLoader.exists("res://scripts/model/watch_refurbishment.gd"):
  check(false,"independent refurbishment jobs are available")
  quit(1)
  return
 var Refurb = load("res://scripts/model/watch_refurbishment.gd")
 var s := Model.create("REFURB")
 var it := Model.new_item(s,"WCH-001",{"working":false,"condition":0.45,"authentic":false})
 Model.put_in(s,it)
 var uid: String = it.uid
 for material in GameData.materials: s.materials[material.id] = 20
 var before: Dictionary = it.duplicate(true)
 check(Refurb.problem(s,it,"case") == "", "case replacement is available before dusting or movement repair")
 var ap: float = s.ap
 s = Model.reduce(s,{"type":"REFURB_COMPLETE","uid":uid,"job":"case"})
 check(s.ap == ap and Model.find_inventory(s,uid).condition == 0.45,"unperformed job cannot charge or improve condition")
 s = Model.reduce(s,{"type":"REFURB_PROGRESS","uid":uid,"job":"case","progress":{"version":1,"task":"refurb_case","phase":"act","step":1,"complete":false,"opened":true}})
 it = Model.find_inventory(s,uid)
 check(it.service.opened and Refurb.problem(s,it,"blow") != "", "open replacement case blocks other jobs and sales until safely closed")
 var saved: Dictionary = JSON.parse_string(JSON.stringify(s))
 check(Model.find_inventory(saved,uid).refurbishment.operations.case.phase == "act", "unfinished refurbishment progress survives save/reload")
 s = complete_job(saved,uid,"case")
 it = Model.find_inventory(s,uid)
 check(it.refurbishment.done.has("case") and not it.service.opened and it.condition > 0.45 and s.ap < ap,"finishing a case job improves condition and closes its own case")
 check(not it.working and not it.authentic and it.watch == JSON.parse_string(JSON.stringify(before.watch)),"new case does not repair movement, authenticate the watch or fabricate readings")
 check(WatchRules.reading(it,"TOL-001").contains("替换表壳"),"case replacement leaves a discoverable physical trace")
 var paid_ap: float = s.ap
 var paid_stock: Dictionary = s.materials.duplicate(true)
 var condition: float = it.condition
 var completed_state := s
 s = complete_job(s,uid,"case")
 check(is_same(s,completed_state),"late completion or progress callbacks cannot replace the success notice or mutate a finished job")
 check(s.ap == paid_ap and s.materials == paid_stock and Model.find_inventory(s,uid).condition == condition,"repeating a completed job cannot charge again or farm condition")
 s = complete_job(s,uid,"strap")
 s = complete_job(s,uid,"blow")
 s = complete_job(s,uid,"polish")
 s = complete_job(s,uid,"clean")
 it = Model.find_inventory(s,uid)
 check(it.refurbishment.done.size() == 5 and not it.working and not it.authentic,"all cosmetic jobs work in chosen order without fixing real movement faults")
 check(it.condition <= 0.95 and WatchRules.reading(it,"TOL-001").contains("替换表带"),"refurbishment preserves wear ceiling and strap evidence")
 check(it.service.done.has("dust"),"completed external cleaning also resolves the existing dust fault without a second reward")
 var other := Model.new_item(s,"WCH-002",{"condition":0.5})
 Model.put_in(s,other)
 var other_uid: String = other.uid
 s.materials["MAT-011"] = 0
 var remaining_ap: float = s.ap
 s = complete_job(s,other_uid,"case")
 check(s.ap == remaining_ap and not Model.find_inventory(s,other_uid).get("refurbishment",{}).get("done",[]).has("case"),"missing matching case stock prevents the atomic completion")
 s.materials["MAT-011"] = 2
 s.ap = 0
 s = complete_job(s,other_uid,"case")
 check(s.materials["MAT-011"] == 2 and Model.find_inventory(s,other_uid).refurbishment.operations.case.complete,"no-AP completion retains finished work without charging materials")
 s.ap = 2
 s = Model.reduce(s,{"type":"REFURB_COMPLETE","uid":other_uid,"job":"case"})
 check(Model.find_inventory(s,other_uid).refurbishment.done.has("case"),"saved finished work can be committed after replenishing AP")
 var external := Model.new_item(s,"WCH-002",{"condition":0.5,"working":true,"authentic":true,"watch":{"mass":108.9,"serial":"LINK","logo_variant":0,"missing_part":"一节可拆表节","part_mass":3.1}})
 WatchForgery.apply(external,"weight")
 Model.put_in(s,external)
 s.materials["MAT-012"] = 2
 s.ap = 3
 s = complete_job(s,external.uid,"strap")
 external = Model.find_inventory(s,external.uid)
 check(external.watch.missing_part == "" and is_equal_approx(external.watch.mass,112.0),"a complete replacement band restores its missing external link and real mass")
 check(WatchForgery.active(external,"weight") and is_equal_approx(WatchRules.mass(external),115.1),"external strap work cannot silently remove hidden ballast inside the case")
 print("REFURB failures=", failures)
 quit(1 if failures else 0)
