extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func frames() -> void:
	for i in 12: await process_frame
func check(ok: bool,text: String) -> void:
	print("STORY UI ","PASS " if ok else "FAIL ",text)
	if not ok: failures+=1
func run() -> void:
	var game=root.get_node("Game")
	game.new_game("STORY-UI")
	game.state.day=5
	game.state.cash=10000
	game.save()
	game.prefs.sound=false
	game.prefs.reduced_motion=true
	var shell=load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	check(shell.has_method("open_story_book"),"story book is reachable from the live shell")
	if failures: shell.queue_free();await frames();quit(1);return
	for dimensions in [Vector2i(844,390),Vector2i(568,320),Vector2i(390,844),Vector2i(1280,800)]:
		shell.phone_override=dimensions.x<1000
		root.size=dimensions
		await frames()
		shell.open_story_book()
		await frames()
		var book=shell.modal_layer.find_child("StoryBook",true,false)
		check(book!=null,"event book opens at %s" % str(dimensions))
		if book==null:continue
		for group in ["active","upcoming","archive"]:
			book.filters[group].pressed.emit()
			await frames()
			var sheet:Control=shell.modal_layer.find_child("ModalSheet",true,false)
			check(sheet.size.x<=shell.safe_area().size.x+1 and sheet.size.y<=shell.safe_area().size.y+1,"%s respects viewport" % group)
			check(book.get_combined_minimum_size().x<=sheet.size.x,"%s fits without horizontal scrolling" % group)
			var submit=book.find_child("story_budget_submit",true,false)
			if submit!=null:check(submit.size.x>=120,"budget submission remains a readable touch target")
		shell.close_top_modal()
		await frames()
	var jobs=load("res://scripts/model/service_contracts.gd")
	for job in jobs.contracts(game.state):
		if job.status=="available":game.dispatch({"type":"TAKE_SERVICE_CONTRACT","id":job.id});break
	shell.phone_override=true
	root.size=Vector2i(568,320)
	await frames()
	shell.open_shop_plan("contracts")
	await frames()
	for button in shell.modal_layer.find_children("*","Button",true,false):
		if button.text=="提交维修报价":check(button.size.x>=100,"service quote submission remains readable beside numeric input")
	shell.close_top_modal()
	await frames()
	shell.queue_free()
	await frames()
	for node in root.get_node("Audio").get_children():
		if node is AudioStreamPlayer:node.stop()
	print("STORY UI failures=",failures)
	quit(1 if failures else 0)
