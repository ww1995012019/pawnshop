extends "res://tests/night_crime_ui_test.gd"
func run() -> void:
	var game = root.get_node("Game")
	game.new_game("CABINET-CENTER")
	game.prefs.sound=false
	game.prefs.reduced_motion=true
	game.state.inventory=[]
	for id in ["WCH-001","WCH-057","WCH-058","WCH-059","WCH-063","WCH-078"]:
		game.state.inventory.append(Model.new_item(game.state,id,{"location":"display","owner":"shop"}))
	var shell=load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	for dimensions in [Vector2i(1440,900),Vector2i(844,390)]:
		root.size=dimensions
		shell.phone_override=dimensions.x<1000
		shell.go("warehouse")
		await frames()
		var page=shell.active_shell().page
		for slot in page.display_grid.get_children():
			if slot.uid=="": continue
			check(slot.icon_alignment==HORIZONTAL_ALIGNMENT_CENTER and slot.vertical_icon_alignment==VERTICAL_ALIGNMENT_CENTER,"cabinet explicitly centers original "+slot.uid)
			var previous := Vector4(-1,-1,-1,-1)
			for state in ["normal","hover","pressed","hover_pressed","disabled"]:
				var style:StyleBox=slot.get_theme_stylebox(state)
				var margins:=Vector4(style.get_margin(SIDE_LEFT),style.get_margin(SIDE_TOP),style.get_margin(SIDE_RIGHT),style.get_margin(SIDE_BOTTOM))
				check(margins.x==margins.z and margins.y==margins.w,"cabinet state has symmetric padding: "+state)
				if previous.x>=0: check(previous==margins,"cabinet icon does not shift or shrink across states: "+state)
				previous=margins
			var image:Image=slot.icon.get_image()
			if image.is_compressed():image.decompress()
			# The strap establishes the body axis; a right-side crown must not move it.
			var used:=image.get_used_rect()
			var row:=used.position.y+maxi(1,int(used.size.y*.1))
			var left:=image.get_width()
			var right:=-1
			for x in image.get_width():
				if image.get_pixel(x,row).a>.5:left=mini(left,x);right=maxi(right,x)
			check(right>=left and absf(float(left+right+1)*.5-image.get_width()*.5)<=2.0,"cabinet centers strap/body rather than crown or transparent crop: "+game.item(slot.uid).defId+" edges="+str(Vector2i(left,right)))
		shell.close_workspace()
		await frames()
	shell.queue_free()
	await frames()
	print("CABINET ICON CENTER failures=",failures)
	quit(1 if failures else 0)
