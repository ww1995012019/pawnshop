extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func frames() -> void:
	for i in 12: await process_frame
func check(ok: bool,message: String) -> void:
	print("SHOP FEEDBACK ","PASS " if ok else "FAIL ",message)
	if not ok: failures += 1
func run() -> void:
	var game = root.get_node("Game")
	game.new_game("SHOP-FEEDBACK")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	var item: Dictionary = Model.new_item(game.state,"WCH-001",{"owner":"npc","condition":0.8})
	item.evidence = ["TOL-001","TOL-002"]
	game.state.trade = {"id":"feedback","npcId":"CHR-004","kind":"buy","item":item,"price":100,"rounds":0,"locked":false,"evidenceUsed":[],"line":"请验货。"}
	root.size = Vector2i(844,390)
	var shell = load("res://main.tscn").instantiate()
	shell.phone_override = true
	root.add_child(shell)
	await frames()
	shell._close_title()
	await frames()
	var desk = shell.page
	var first: Button = desk.chips.get_child(0)
	first.pressed.emit()
	await frames()
	var hint: Label = desk.chips.find_child("EvidenceSelectionHint",true,false)
	check(hint != null and hint.text.contains("下次出价"),"selecting evidence explains when it will be used")
	var adapter = desk.find_child("PortraitCounter",true,false)
	adapter._quote_popup()
	await frames()
	check(shell.modal_layer.find_child("mobile_evidence_TOL-001",true,false) != null,"phone quote sheet exposes existing evidence rather than hiding the mechanic")
	shell.close_top_modal()
	await frames()
	shell.queue_free()
	await frames()
	quit(1 if failures else 0)
