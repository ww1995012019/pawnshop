extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func run() -> void:
 var state := Model.create("REFURB-ART")
 var script = load("res://scripts/ui/watch_refurb_art.gd")
 for definition in GameData.item_list:
  var it := Model.new_item(state,definition.id,{"condition":0.5,"working":false})
  for job in WatchRefurbishment.JOBS:
   var art = script.new()
   root.add_child(art)
   art.size = Vector2(640,460)
   art.configure(it,"refurb_"+job)
   art.set_process(false)
   for step in 30:
    if art.progress_snapshot().complete: break
    art.advance()
    art._process(20.0)
   var result: Dictionary = art.progress_snapshot()
   if not result.complete or result.opened or result.task != "refurb_"+job:
    print("REFURB ART FAIL ",definition.id," ",job," ",result)
    failures += 1
   var wire: Dictionary = JSON.parse_string(JSON.stringify(result))
   art.configure(it,"refurb_"+job,wire)
   if not art.progress_snapshot().complete:
    print("REFURB ART FAIL saved completion ",definition.id," ",job)
    failures += 1
   art.free()
 print("REFURB ART ","PASS all 33 models × 5 independent jobs" if failures == 0 else "FAIL", " failures=",failures)
 quit(1 if failures else 0)
