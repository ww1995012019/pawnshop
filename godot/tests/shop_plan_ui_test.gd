extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func frames(n := 12) -> void:
	for i in n: await process_frame
func check(ok: bool,text: String) -> void:
	print("SHOP UI ","PASS " if ok else "FAIL ",text)
	if not ok: failures+=1
func run() -> void:
	var game=root.get_node("Game")
	game.new_game("SHOP-UI")
	game.prefs.sound=false
	game.prefs.reduced_motion=true
	root.size=Vector2i(844,390)
	var shell=load("res://main.tscn").instantiate()
	shell.phone_override=true
	root.add_child(shell)
	await frames()
	shell._close_title()
	await frames()
	for dimensions in [Vector2i(844,390),Vector2i(568,320),Vector2i(390,844),Vector2i(1920,1080)]:
		shell.phone_override=dimensions.x<1000
		root.size=dimensions
		await frames()
		shell.open_shop_plan()
		await frames()
		var plan=shell.modal_layer.find_child("ShopPlan",true,false)
		check(plan!=null,"plan opens at %s" % str(dimensions))
		if plan==null: continue
		var summary = plan.find_child("OverviewSummary",true,false)
		check(summary != null,"overview shows separate status cards")
		if summary != null:
			for card in ["TodayCard","ResourcesCard","CostsCard"]:
				check(summary.find_child(card,true,false)!=null,"overview includes "+card)
		for section in ["overview","contracts","bulk","customers","history","upgrades"]:
			plan.tabs[section].pressed.emit()
			await frames()
			var sheet: Control=shell.modal_layer.find_child("ModalSheet",true,false)
			var area: Rect2=shell.safe_area()
			check(sheet.size.x<=area.size.x+1 and sheet.size.y<=area.size.y+1,"%s sheet stays inside %s" % [section,str(dimensions)])
			check(plan.get_combined_minimum_size().x<=sheet.size.x,"%s content wraps within sheet" % section)
		shell.close_top_modal()
		await frames()
	shell.queue_free()
	await frames()
	print("SHOP UI failures=",failures)
	quit(1 if failures else 0)
