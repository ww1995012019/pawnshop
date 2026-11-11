extends SceneTree

var failures := 0
var art_script
var refurb_script

func _initialize() -> void: call_deferred("run")

func check(ok: bool, label: String) -> void:
 print("SCREW GROUPS ", "PASS " if ok else "FAIL ", label)
 if not ok: failures += 1

func item(back := "bolts") -> Dictionary:
 return {"uid":"SCREW-GROUPS", "defId":"WCH-001", "watch":{}, "service":{"profile":{"movement":"quartz","caseback":back},"opened":false,"faults":[]}}

func bench(task: String, saved: Dictionary = {}, back := "bolts"):
 var art = (refurb_script if task in ["refurb_case", "forge_case"] else art_script).new()
 root.add_child(art)
 art.size = Vector2(640,460)
 art.configure(item(back),task,saved)
 art.set_process(false)
 return art

func ids(art, prefix: String) -> Array:
 var found := []
 for action in art._plan:
  if String(action.id).begins_with(prefix): found.append(action.id)
 return found

func finish_action(art) -> void:
 art.advance()
 art._process(20.0)

func advance_to(art, prefix: String) -> void:
 for n in 40:
  if art.progress_snapshot().complete or String(art._plan[art._state.step].id).begins_with(prefix): return
  finish_action(art)
 check(false,"bounded action lookup")

func same_state(a, b) -> bool:
 if (a is float or a is int) and (b is float or b is int): return absf(float(a) - float(b)) < 0.0001
 if a is Dictionary and b is Dictionary:
  if a.size() != b.size(): return false
  for key in a:
   if not b.has(key) or not same_state(a[key], b[key]): return false
  return true
 if a is Array and b is Array:
  if a.size() != b.size(): return false
  for n in range(a.size()):
   if not same_state(a[n], b[n]): return false
  return true
 return a == b

func run() -> void:
 art_script = load("res://scripts/ui/watch_bench_art.gd")
 refurb_script = load("res://scripts/ui/watch_refurb_art.gd")
 root.get_node("Game").prefs.reduced_motion = false
 root.get_node("Game").prefs.sound = false
 for task in ["open","test","forge_weight","refurb_case"]:
  var art = bench(task)
  if task != "test": check(ids(art,"unscrew_").size() == 2,"%s has two opening groups" % task)
  if task != "open": check(ids(art,"fasten_").size() == 2,"%s has two closing groups" % task)
  art.free()
 var opening = bench("open")
 advance_to(opening,"unscrew_")
 opening.advance()
 opening._state.phase = "act"
 opening._state.elapsed = opening._phase_duration() * 0.50
 opening._animate()
 check(opening._state.screws == [true,false,false,false],"first screw reaches tray before tool crosses to second screw")
 var mid: Dictionary = JSON.parse_string(JSON.stringify(opening.progress_snapshot()))
 var mid_copy = bench("open",mid)
 check(same_state(mid_copy.progress_snapshot(), mid),"second-screw tool transfer restores in flight")
 opening._process(20.0)
 mid_copy._process(20.0)
 check(same_state(opening.progress_snapshot(), mid_copy.progress_snapshot()),"resumed grouped turn reaches identical physical result")
 mid_copy.free()
 check(opening._state.screws == [true,true,false,false],"first input releases both first-group physical screws")
 var saved: Dictionary = JSON.parse_string(JSON.stringify(opening.progress_snapshot()))
 var restored = bench("open",saved)
 check(same_state(restored.progress_snapshot(), saved),"group boundary restores without replay")
 finish_action(restored)
 check(restored._state.screws == [true,true,true,true],"second opening input releases remaining physical screws")
 opening.free()
 restored.free()
 var closing = bench("test")
 advance_to(closing,"fasten_")
 check(closing._state.screws == [true,true,true,true],"open service case starts with four removed screws")
 finish_action(closing)
 check(closing._state.screws == [false,true,false,true] and closing._state.opened,"first closing group fastens opposite screws and keeps case unsafe")
 finish_action(closing)
 check(closing._state.screws == [false,false,false,false] and not closing._state.opened,"second cross group safely finishes fastening")
 closing.free()
 for back in ["snap","screw"]:
  var other = bench("forge_weight",{},back)
  check(ids(other,"fasten_").is_empty() and other.action_plan_signature().contains("press_snap" if back == "snap" else "tighten_cover"),"%s retains its own closing tool" % back)
  other.free()
 # A forged replacement can change the physical caseback structure.
 var target_id := ""
 for definition in GameData.item_list:
  if definition.get("watch", {}).get("caseback", "") == "bolts":
   target_id = definition.id
   break
 var replacement = refurb_script.new()
 root.add_child(replacement)
 replacement.set_process(false)
 var replacement_item := item("snap")
 replacement_item.forgery = {"targetId":target_id,"methods":{}}
 replacement.configure(replacement_item,"forge_case")
 advance_to(replacement,"fasten_")
 check(replacement._state.screws == [true,true,true,true],"new bolted replacement cover exposes all four screws before fastening")
 finish_action(replacement)
 check(replacement._state.screws == [false,true,false,true] and replacement._state.opened,"changed caseback preserves cross order and open guard")
 replacement.free()
 # Legacy snapshots contain numeric indices only. Build every historical boundary
 # explicitly, independent of the production action plan that is being changed.
 var old_ids := ["safe_quartz","unscrew_0","unscrew_1","unscrew_2","unscrew_3","lift_cover","place_ballast","secure_ballast","return_cover","fasten_0","fasten_2","fasten_1","fasten_3","move_to_scale","measure_ballast"]
 for step in range(old_ids.size()+1):
  for phase in ["idle","take","contact","act","release","result"]:
   if step == old_ids.size() and phase != "idle": continue
   var seed = bench("forge_weight")
   var old: Dictionary = seed.progress_snapshot()
   seed.free()
   old.erase("screw_layout")
   old.step = step
   old.phase = phase
   old.elapsed = 0.12 if phase != "idle" else 0.0
   old.complete = step == old_ids.size()
   old.screws = [false,false,false,false]
   for n in mini(step,old_ids.size()):
    var id: String = old_ids[n]
    if id.begins_with("unscrew_"): old.screws[id.trim_prefix("unscrew_").to_int()] = true
    if id.begins_with("fasten_"): old.screws[id.trim_prefix("fasten_").to_int()] = false
   if phase in ["release","result"]:
    var id: String = old_ids[step]
    if id.begins_with("unscrew_"): old.screws[id.trim_prefix("unscrew_").to_int()] = true
    if id.begins_with("fasten_"): old.screws[id.trim_prefix("fasten_").to_int()] = false
   old.opened = step > 1 and (step < 12 or (step == 12 and not phase in ["release","result"]))
   old.parts.cover = [510.0,150.0] if step > 5 and step < 9 else [248.0,227.0]
   var legacy = bench("forge_weight",old)
   check(legacy._state.screws == old.screws,"legacy %d/%s preserves individual screws" % [step,phase])
   if step < old_ids.size():
    var action: Dictionary = legacy._plan[legacy._state.step]
    var current: String = old_ids[step]
    if not current.begins_with("unscrew_") and not current.begins_with("fasten_"):
     check(action.id == current,"legacy %d/%s resumes exact essential action" % [step,phase])
    else:
     check(action.get("legacy_ids",[action.id]).has(current),"legacy %d/%s resumes pending screw without skipping" % [step,phase])
   else: check(legacy._state.complete,"legacy completion remains complete")
   var wire: Dictionary = JSON.parse_string(JSON.stringify(legacy.progress_snapshot()))
   var reload = bench("forge_weight",wire)
   check(same_state(reload.progress_snapshot(), wire) and reload.action_plan_signature() == legacy.action_plan_signature(),"migrated %d/%s remains stable on second reload" % [step,phase])
   for n in 40:
    if reload._state.complete: break
    if reload._state.phase == "idle": reload.advance()
    reload._process(20.0)
   check(reload._state.complete and not reload._state.opened and reload._state.screws == [false,false,false,false],"legacy %d/%s reaches safely closed result" % [step,phase])
   legacy.free()
   reload.free()
 root.get_node("Game").prefs.reduced_motion = true
 var reduced = bench("forge_weight")
 for n in 30:
  if reduced._state.complete: break
  finish_action(reduced)
 check(reduced._state.complete and reduced._state.screws == [false,false,false,false] and not reduced._state.opened,"reduced motion preserves every screw and safe final closure")
 reduced.free()
 print("SCREW GROUPS failures=",failures)
 quit(1 if failures else 0)
