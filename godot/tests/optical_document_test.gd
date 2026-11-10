extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
 print("OPTICAL PAPER ","PASS " if ok else "FAIL ",label)
 if not ok: failures += 1
func frames(n := 6) -> void:
 for i in n: await process_frame
func pointer(point: Vector2) -> void:
 var event := InputEventMouseMotion.new()
 event.position = root.get_final_transform()*point
 event.global_position = event.position
 Input.parse_input_event(event)
 await frames()
func run() -> void:
 root.size = Vector2i(1920,1080)
 var game = root.get_node("Game")
 game.prefs.sound = false
 game.prefs.reduced_motion = false
 game.new_game("OPTICAL-DOCUMENT")
 var shell = load("res://main.tscn").instantiate()
 root.add_child(shell)
 await frames()
 shell._close_title()
 var doc = load("res://tests/counting_floating_document.gd").new()
 shell.root_ui.add_child(doc)
 doc.configure("TEST PAPER","optical_test",Vector2(400,500))
 await frames()
 var grip: Control = doc.corner_handles[1]
 var expected_corner: Vector2 = doc.get_global_transform()*Vector2(doc.size.x,0)
 check((grip.get_global_transform()*(grip.size*.5)).distance_to(expected_corner)<1,"grip center follows its container's deferred layout origin")
 doc.css_reads = 0
 await frames(120)
 print("OPTICAL PAPER idle_css_reads=",doc.css_reads)
 check(doc.css_reads <= 1,"idle paper does not cross the runtime every frame")
 var old_extent: Vector2 = doc.corner_handles[0].size
 doc.set_document_zoom(.5,false)
 await frames()
 check(doc.corner_handles[0].size.x > old_extent.x*1.8,"zoom refreshes CSS-sized corner targets")
 var reads: int = doc.css_reads
 root.size = Vector2i(1280,720)
 await frames()
 check(doc.css_reads > reads,"viewport resize refreshes grips")
 doc.hide()
 shell.go("inspect")
 await frames(25)
 var active = shell.active_shell()
 var page = active.page
 page._set_tool("TOL-001")
 await frames(25)
 var target: Vector2 = page.item.logo_world_position()
 var root_target: Vector2 = root.get_screen_transform().affine_inverse()*active.get_viewport().get_screen_transform()*active.world_to_ui(target)
 await pointer(root_target)
 await frames(8)
 print("OPTICAL POINTER target=",target," root=",root_target," actual=",page.lens.global_position," mouse=",active.world_mouse())
 check(page.lens.visible and page.lens.global_position.distance_to(target)<3,"outside paper follows actual pointer")
 shell.open_watch_manual(page.item.def_id)
 await frames()
 var paper = shell.root_ui.find_child("inspection_guide",true,false)
 paper.set_document_zoom(.45,false)
 paper.move_document(Vector2(20,20))
 await frames()
 var before: String = JSON.stringify(game.item(page.it_uid).evidence)
 var ap: int = game.state.ap
 var power: String = JSON.stringify(game.state.storeCosts)
 await pointer(paper.position+Vector2(160,220)*paper.scale)
 await create_timer(1.1).timeout
 check(not page.lens.visible,"root paper hides unpinned loupe despite stale nested pointer")
 check(is_zero_approx(float(page.item.mat.get_shader_parameter("lens_r"))),"root paper cannot reveal an underlying logo")
 check(JSON.stringify(game.item(page.it_uid).evidence)==before and game.state.ap==ap and JSON.stringify(game.state.storeCosts)==power,"paper hover earns no evidence and spends no AP or electricity")
 await pointer(root_target)
 await frames()
 check(page.lens.visible,"leaving paper resumes loupe without closing paper")
 for offset in [Vector2(-55,85),Vector2(0,85),Vector2(55,85)]:
  var moving_target: Vector2 = target+offset
  var root_moving: Vector2 = root.get_screen_transform().affine_inverse()*active.get_viewport().get_screen_transform()*active.world_to_ui(moving_target)
  await pointer(root_moving)
  check(paper.visible and not shell.modal_open() and page.lens.visible and page.lens.global_position.distance_to(moving_target)<3,"continuous outside-paper motion follows actual input with paper open")
 page.optical_pin_button.pressed.emit()
 await pointer(paper.position+Vector2(160,220)*paper.scale)
 await create_timer(1.1).timeout
 check(page.lens.visible and game.item(page.it_uid).evidence.has("TOL-001"),"explicit pin retains observation beside paper")
 # The same ownership contract applies to UV, including usage metering.
 page._set_tool("TOL-002")
 await create_timer(.8).timeout
 target = page.item.reveal_center()
 root_target = root.get_screen_transform().affine_inverse()*active.get_viewport().get_screen_transform()*active.world_to_ui(target)
 await pointer(root_target)
 before = JSON.stringify(game.item(page.it_uid).evidence)
 ap = game.state.ap
 power = JSON.stringify(game.state.storeCosts)
 await pointer(paper.position+Vector2(160,220)*paper.scale)
 await create_timer(1.1).timeout
 check(not page.wand.visible and not page.uv_light.visible and is_zero_approx(float(page.item.reveal.material.get_shader_parameter("uv_r"))),"paper hover hides UV light and serial reveal")
 check(JSON.stringify(game.item(page.it_uid).evidence)==before and game.state.ap==ap and JSON.stringify(game.state.storeCosts)==power,"paper hover cannot record UV evidence or spend electricity")
 page.optical_pin_button.pressed.emit()
 shell.open_settings()
 await create_timer(1.1).timeout
 check(not page.wand.visible and JSON.stringify(game.item(page.it_uid).evidence)==before and game.state.ap==ap and JSON.stringify(game.state.storeCosts)==power,"parent modal hides and pauses an explicitly pinned UV tool")
 shell.close_top_modal()
 await create_timer(1.1).timeout
 check(page.wand.visible and game.item(page.it_uid).evidence.has("TOL-002"),"closing parent modal resumes explicit pin beside paper")
 var costs: String = JSON.stringify(game.state.storeCosts)
 var paid_ap: int = game.state.ap
 await create_timer(1.1).timeout
 check(game.state.ap==paid_ap and JSON.stringify(game.state.storeCosts)==costs,"resumed observation never double charges AP or electricity")
 for player in root.find_children("*","AudioStreamPlayer",true,false):
  player.stop();player.stream=null
 shell.queue_free()
 await frames()
 print("OPTICAL PAPER failures=",failures)
 quit(1 if failures else 0)
