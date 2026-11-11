extends SceneTree
var failures := 0
func _initialize(): call_deferred("run")
func frames(n := 10):
 for i in n: await process_frame
func check(ok,message):
 print("LANDSCAPE ","PASS " if ok else "FAIL ",message)
 if not ok: failures += 1
func run():
 root.size = Vector2i(844,390)
 var game = root.get_node("Game")
 game.prefs.sound = false
 game.prefs.reduced_motion = false
 game.new_game("MOBILE-LANDSCAPE")
 var shell = load("res://main.tscn").instantiate()
 shell.phone_override = true
 root.add_child(shell)
 await frames()
 shell._close_title()
 await frames()
 var view = shell.page.find_child("LandscapeCounter",true,false)
 check(view != null and view.is_visible_in_tree(),"phone uses its dedicated landscape counter")
 if view == null:
  shell.queue_free();await frames();quit(1);return
 check(shell.page.cash_tray.is_visible_in_tree(),"the original cash stack stays visible in the cashier panel")
 check(shell.get_viewport().get_visible_rect().size.x < 1000,"landscape uses readable mobile logical pixels")
 shell.page._ring()
 await create_timer(2.4).timeout
 var page = shell.page
 check(is_instance_valid(page.customer) and page.customer.is_visible_in_tree(),"actual animated customer is visible")
 check(is_instance_valid(page.mat_item) and page.mat_item.is_visible_in_tree(),"actual animated original is visible")
 if is_instance_valid(page.mat_item):
  var before: bool = page.mat_item.back
  page.mat_item.flip()
  await frames(2)
  check(page.mat_item.busy,"real flip has an intermediate animated phase")
  root.size = Vector2i(390,844)
  await frames(2)
  check(view.visible,"rotation keeps the real flip visible until it lands")
  await create_timer(0.8).timeout
  check(page.mat_item.back != before,"flip finishes on the other face")
  root.size = Vector2i(844,390)
  await frames()
 var handed_uid: String = page.mat_item.uid
 page._handover(TradeSession.item(game.state,handed_uid),"buy")
 await frames(2)
 check(is_instance_valid(page.mat_item) and page.mat_item.get_canvas_layer_node()==shell.ui,"the actual original crosses panels above the mobile controls")
 await create_timer(.8).timeout
 page._sync_table()
 shell.open_people("CHR-004")
 await frames(14)
 var dossier = shell.modal_layer.find_child("ModalSheet",true,false)
 check(shell.get_viewport().get_visible_rect().encloses(dossier.get_global_rect()),"large legacy dossiers keep their close header inside the mobile screen")
 shell.close_top_modal()
 await create_timer(.4).timeout
 var adapter = shell.page.find_child("PortraitCounter",true,false)
 var deferred_button := Button.new()
 shell.page.add_child(deferred_button)
 var calls := [0]
 deferred_button.pressed.connect(func(): calls[0] += 1)
 shell.modal("Slow closing",350)
 var dim = shell.modal_layer.get_child(0)
 dim.set_meta("closing",true)
 adapter._invoke(weakref(deferred_button))
 await create_timer(.3).timeout
 check(calls[0]==0,"sheet actions stay blocked until the closing boundary")
 dim.queue_free()
 await frames()
 check(calls[0]==1,"a slow closing frame does not silently drop the chosen action")
 deferred_button.queue_free()
 shell.go("inspect")
 await frames()
 var inspector = shell.workspace_shell.page
 inspector._set_tool("TOL-005")
 await frames()
 var pan_rect: Rect2 = inspector.shell.get_viewport().get_canvas_transform() * inspector.scale_pan.global_transform * Rect2(-155,0,310,48)
 check(inspector.mat_rect.encloses(pan_rect),"actual scale pan fits the live surface above its controls")
 var closed_shell = shell.workspace_shell
 shell.close_workspace()
 check(closed_shell.process_mode==Node.PROCESS_MODE_DISABLED,"closing stops the workspace before its queued release")
 await frames()
 var uid: String = game.state.inventory[0].uid
 game.item(uid).condition = 0.5
 shell.go("repair",uid)
 await frames()
 check(shell.workspace_logical_size.x < 1000,"expanded workbench uses mobile dimensions")
 var repair = shell.workspace_shell.page
 repair.open_refurb("blow")
 await frames()
 repair.portrait_section = 0
 repair.relayout()
 await frames()
 check(repair.list_box.get_parent().size.y>=100,"item selection leaves room for readable touch rows")
 repair.portrait_section = 1
 repair.relayout()
 check(repair.art.is_visible_in_tree(),"refurbishment retains its real animated work surface")
 check(repair.art.get("wide_layout") == true,"operation art has a wide layout")
 repair.art.advance()
 await frames(2)
 check(repair.art.progress_snapshot().phase != "idle","tool animation is actually running")
 var before_size: Vector2 = repair.art.size
 var before_phase: String = repair.art.progress_snapshot().phase
 root.size = Vector2i(390,844)
 await frames(2)
 check(repair.art.wide_layout and repair.art.size == before_size,"rotation defers work-surface reflow during the current segment")
 repair.shell.go("inspect",uid)
 check(shell.workspace_shell.page == repair,"page switches cannot abandon an animated segment")
 shell.close_workspace()
 check(shell.workspace_open(),"close waits for current animation boundary")
 await create_timer(3.2).timeout
 check(not shell.workspace_open(),"workspace closes after current segment")
 check(not game.item(uid).refurbishment.operations.is_empty(),"partial operation remains saved without submitting")
 shell.queue_free()
 await frames()
 # The less frequent police scene must also use the visible mobile counter.
 root.size = Vector2i(844,390)
 game.state = load("res://tests/counter_lifecycle_fixture.gd").build().arrest
 shell = load("res://main.tscn").instantiate()
 shell.phone_override = true
 root.add_child(shell)
 await frames()
 shell._close_title()
 await frames()
 page = shell.page
 var mobile_adapter = page.find_child("PortraitCounter",true,false)
 mobile_adapter._actions()
 await frames()
 var alarm_key = shell.modal_layer.find_child("mobile_alarm_button",true,false)
 check(alarm_key != null and not alarm_key.disabled,"mobile more-actions exposes the real police-report entry")
 shell.close_top_modal()
 await create_timer(.3).timeout
 var originals: Array = page.counter_table.sprites.values().duplicate()
 game.dispatch({"type":"REPORT_VISITOR","tradeId":game.state.trade.id})
 await create_timer(1.4).timeout
 var patrol = page.resident_window.get_node_or_null("counter_patrol")
 check(patrol != null,"police response keeps a real patrol actor")
 if patrol != null:
  var extent: Vector2 = patrol.size*patrol.scale
  var portrait_rect := Rect2(patrol.position-Vector2(extent.x*.5,extent.y),extent)
  check(Rect2(Vector2.ZERO,page.resident_window.size).grow(1).encloses(portrait_rect),"both police-scene faces fit the mobile visitor window")
 check(originals.any(func(sprite): return is_instance_valid(sprite) and sprite.get_canvas_layer_node()==shell.ui),"police transfers move the actual original above interface cards")
 await create_timer(6.6).timeout
 check(not page.busy and game.state.trade==null,"mobile police animation finishes and releases the counter")
 shell.queue_free()
 await frames()
 quit(1 if failures else 0)
