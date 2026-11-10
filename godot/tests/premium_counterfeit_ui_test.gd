extends SceneTree
var failures := 0
func _initialize(): call_deferred("run")
func frames():
 for i in 8: await process_frame
func check(ok, message):
 print("PREMIUM UI ","PASS " if ok else "FAIL ",message)
 if not ok: failures+=1
func run():
 root.size=Vector2i(1920,1080)
 var game=root.get_node("Game")
 game.prefs.sound=false
 game.prefs.reduced_motion=true
 game.new_game("PREMIUM-UI")
 game.state.ap=20
 for material in GameData.materials: game.state.materials[material.id]=20
 var it=Model.new_item(game.state,"WCH-023",{"condition":0.8,"working":true,"authentic":true})
 game.state.inventory=[it]
 game.focus_uid=it.uid
 var shell=load("res://main.tscn").instantiate()
 root.add_child(shell);await frames();shell._close_title()
 shell.go("repair");await frames()
 var page=shell.workspace_shell.page if shell.workspace_open() else shell.page
 page.open_forgery();await frames()
 check(page.find_child("counterfeit_target_picker",true,false)!=null,"workbench has compatible target picker")
 page.call("_choose_target","WCH-033");await frames()
 check(WatchForgery.target_id(game.item(it.uid))=="WCH-033","target picker dispatches persistent selection")
 check(page.find_child("counterfeit_summary",true,false)!=null,"original and target remain visible in workbench summary")
 for method in WatchForgery.TARGET_METHODS:
  check(page.find_child("counterfeit_job_"+method,true,false)!=null,"distinct selectable operation: "+method)
 page.open_forgery("serial");await frames()
 check(page.instruction.text.contains("换壳"),"missing prerequisite is visible beside action rather than only tooltip")
 var physical=game.item(it.uid)
 WatchForgery.apply(physical,"logo")
 var sprite=load("res://scripts/world/item_sprite.gd").new();sprite.setup(physical.defId,physical.uid,200);page.add_child(sprite)
 check(sprite.body.texture==load("res://scripts/app/ui_kit.gd").physical_texture(physical,false),"world sprite uses channel-specific counterfeit artwork")
 var bench=load("res://scripts/ui/watch_refurb_art.gd").new();page.add_child(bench)
 bench.configure(physical,"forge_case",{})
 check(bench._plan.size()>5,"counterfeit shell uses real disassembly and installation actions")
 var exterior=Model.new_item(game.state,"WCH-023",{"condition":0.8,"working":true,"authentic":true})
 exterior.forgery={"targetId":"WCH-028","methods":{}}
 WatchForgery.apply(exterior,"case")
 WatchForgery.restore_exterior(exterior,"strap")
 bench.configure(exterior,"open",{})
 check(bench._appearance.strap==bench.STRAP_TYPES[WatchForgery.template(exterior.defId)],"bench renders restored strap independently from target shell")
 shell.queue_free();await frames()
 print("PREMIUM UI failures=",failures)
 quit(1 if failures else 0)
