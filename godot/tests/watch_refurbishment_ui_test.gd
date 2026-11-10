extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
 print("REFURB UI ","PASS " if ok else "FAIL ",message)
 if not ok: failures += 1
func settle() -> void:
 for frame in 8: await process_frame
func run() -> void:
 var game = root.get_node("Game")
 game.state = Model.create("REFURB-UI")
 game.prefs.sound = false
 game.prefs.reduced_motion = true
 var shell = load("res://main.tscn").instantiate()
 root.add_child(shell)
 await settle()
 shell._close_title()
 shell.go("repair",game.state.inventory[0].uid)
 await settle()
 var page = shell.active_shell().page
 if not page.has_method("open_refurb"):
  check(false,"refurbishment has an independent selectable mode")
  shell.queue_free()
  await settle()
  quit(1)
  return
 for material in GameData.materials: game.state.materials[material.id] = 20
 var ap: float = game.state.ap
 page.open_refurb("case")
 await settle()
 check(page.mode == "refurb" and page.task == "refurb_case" and page.art.visible,"case replacement is selectable before cleaning")
 check(game.state.ap == ap,"selecting a refurbishment job never charges")
 page.art.advance()
 page.art._process(0.03)
 page._save_operation()
 page.open_service()
 await settle()
 check(page.mode == "refurb" and page.task == "refurb_case","an unfinished case job retains its visible resume path")
 var uid: String = page.it_uid
 var saved: Dictionary = game.item(uid).get("refurbishment",{}).get("operations",{}).get("case",{})
 if saved.is_empty():
  shell.queue_free()
  await settle()
  quit(1)
  return
 shell.close_workspace()
 await settle()
 shell.go("repair",uid)
 await settle()
 page = shell.active_shell().page
 check(page.mode == "refurb" and page.task == "refurb_case" and page.art.progress_snapshot().step == saved.step,"returning resumes the independently saved case job")
 for count in 35:
  if game.item(uid).refurbishment.done.has("case"): break
  page.art.advance()
  page.art._process(10.0)
  await settle()
 check(game.item(uid).refurbishment.done.has("case") and not game.item(uid).service.opened,"case operation closes and commits through the actual native animation")
 page.open_refurb("blow")
 await settle()
 check(page.task == "refurb_blow" and page.art.interaction_targets().size() == 1,"blow-dusting is independently selectable after case replacement")
 game.item(uid).sourceVerified = false
 page._stage_ui()
 await settle()
 var before_blocked: Dictionary = page.art.progress_snapshot().duplicate(true)
 page.art.advance()
 page.art._process(2.0)
 check(page.art.progress_snapshot() == before_blocked and page.art.interaction_targets().is_empty() and page.action_button.disabled,"restricted refurbishment blocks pointer targets, animations and primary action together")
 game.item(uid).sourceVerified = true
 page._stage_ui()
 await settle()
 check(page.art.interaction_allowed and not page.action_button.disabled,"restoring permission resumes the selected independent job")
 shell.queue_free()
 await settle()
 print("REFURB UI failures=",failures)
 quit(1 if failures else 0)
