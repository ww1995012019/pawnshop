extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("WANTED UI ","PASS " if ok else "FAIL ",message)
	if not ok: failures += 1
func frames() -> void:
	for i in 8: await process_frame
func pointer(point:Vector2, pressed:int=-1)->void:
	var physical:=root.get_final_transform()*point
	if pressed<0:
		var event:=InputEventMouseMotion.new()
		event.position=physical
		event.global_position=physical
		Input.parse_input_event(event)
	else:
		var event:=InputEventMouseButton.new()
		event.position=physical
		event.global_position=physical
		event.button_index=MOUSE_BUTTON_LEFT
		event.pressed=pressed==1
		Input.parse_input_event(event)
	await frames()
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion=true
	game.prefs.sound=false
	game.new_game("WANTED-UI")
	game.state.day=2
	game.state.trade=WantedCases.new_officer_trade(game.state)
	var shell=load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	if not shell.has_method("toggle_wanted_notice"):
		check(false,"shell can open the physical inventory notice")
		shell.queue_free();await frames();quit(1);return
	check(shell.page.get("alarm_button") != null,"counter has a dedicated alarm at the front edge")
	check(shell.page.get("talk_button") != null,"visitor conversations have a separate physical control")
	game.dispatch({"type":"ISSUE_WANTED","tradeId":game.state.trade.id})
	await frames()
	var paper=shell.get("wanted_notice")
	check(paper != null and paper.visible,"officer delivery displays an inventory-owned paper")
	check(shell.get_viewport().get_visible_rect().grow(-8).encloses(paper.get_global_rect()),"newly opened paper stays fully inside the screen")
	check(not shell.modal_open(),"paper is non-modal and leaves outside shop controls accessible")
	check(paper.find_children("wanted_photo_*","TextureRect",true,false).size()==6,"paper shows exactly six photographs")
	for photo in paper.find_children("wanted_photo_*","TextureRect",true,false):
		check(paper.get_global_rect().encloses(photo.get_global_rect()),"all six portraits are visible inside the desktop paper")
	var ids: Array=game.state.police.wanted.duplicate()
	var original:Vector2=paper.position
	var header:Vector2=paper.global_position+Vector2(100,38)
	await pointer(header)
	await pointer(header,1)
	await pointer(header+Vector2(170,90))
	await pointer(header+Vector2(170,90),0)
	check(paper.position.distance_to(original)>100,"real pointer input drags the paper header and saves placement")
	var saved: Array=game.state.police.paper.position.duplicate()
	var underneath:Vector2=shell.page.fixture_buttons.people.get_global_rect().get_center()
	paper.global_position=underneath-Vector2(210,180)
	await frames()
	await pointer(underneath)
	await pointer(underneath,1)
	await pointer(underneath,0)
	check(not shell.modal_open(),"clicking paper content does not open an underlying shop control")
	paper.relayout()
	await frames()
	var close: Button=paper.find_child("wanted_close",true,false)
	close.pressed.emit()
	await frames()
	check(not paper.visible and game.state.documents.size()==1,"X stores paper without deleting the inventory document")
	var inventory_button:Button=shell.page.find_child("wanted_inventory",true,false)
	await pointer(inventory_button.get_global_rect().get_center())
	await pointer(inventory_button.get_global_rect().get_center(),1)
	await pointer(inventory_button.get_global_rect().get_center(),0)
	check(paper.visible,"real inventory button input reopens the stored paper")
	if not paper.visible: shell.toggle_wanted_notice()
	await frames()
	check(paper.visible and game.state.police.wanted==ids and game.state.police.paper.position==saved,"reopening restores placement and the same wanted people")
	game.dispatch({"type":"TOGGLE_NOTICE","visible":false})
	shell.queue_free()
	await frames()
	game.state=JSON.parse_string(JSON.stringify(game.state))
	WantedCases.ensure(game.state)
	shell=load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	await frames()
	paper=shell.get("wanted_notice")
	var restored_button:Button=shell.page.find_child("wanted_inventory",true,false)
	await pointer(restored_button.get_global_rect().get_center())
	await pointer(restored_button.get_global_rect().get_center(),1)
	await pointer(restored_button.get_global_rect().get_center(),0)
	check(paper.visible and game.state.police.wanted==ids,"inventory button works after recreating the shell from a saved state")
	game.new_game("NEW-CAMPAIGN-FRESH-PAPER")
	game.state.trade=WantedCases.new_officer_trade(game.state)
	shell.go("counter")
	await frames()
	game.dispatch({"type":"ISSUE_WANTED","tradeId":game.state.trade.id})
	await frames()
	paper=shell.get("wanted_notice")
	ids=game.state.police.wanted.duplicate()
	var visible_cases:=[]
	for card in paper.find_children("case_*","PanelContainer",true,false):visible_cases.append(String(card.name).trim_prefix("case_"))
	visible_cases.sort()
	var expected: Array=ids.duplicate()
	expected.sort()
	check(visible_cases==expected,"starting another campaign replaces old paper photographs with the new saved six")
	var target=""
	for id in ids:
		if WantedCases.profile(id).npcId != "": target=id;break
	game.state.trade={"id":"ui-suspect","npcId":WantedCases.profile(target).npcId,"kind":"buy","item":Model.new_item(game.state,"WCH-002"),"price":80,"rounds":0,"locked":false,"evidenceUsed":[],"line":"我来看看。"}
	shell.go("counter")
	await frames()
	var before: float=game.state.ap
	game.dispatch({"type":"ASK_VISITOR","tradeId":"ui-suspect","topic":"origin"})
	await frames()
	check(game.state.trade.talkLog.size()==1 and game.state.ap==before,"conversation saves a clue without using AP")
	var cash: float=game.state.cash
	game.dispatch({"type":"REPORT_VISITOR","tradeId":"ui-suspect"})
	await frames()
	check(game.state.cash>cash and game.state.police.caught.has(target),"physical reporting triggers the real bounty")
	check(paper.find_children("wanted_photo_*","TextureRect",true,false).size()==6 and not game.state.police.wanted.has(target),"visible paper refreshes exactly after arrest")
	await create_timer(.2).timeout
	check(not shell.page.busy,"reduced-motion police response finishes without trapping the counter")
	shell.go("warehouse")
	await frames()
	var document=shell.active_shell().page.find_child("wanted_inventory",true,false)
	check(document != null,"warehouse has an explicit document inventory entry")
	shell.queue_free();await frames()
	for player in root.find_children("*","AudioStreamPlayer",true,false): player.stop();player.stream=null
	await process_frame
	print("WANTED UI failures=",failures)
	quit(1 if failures else 0)
