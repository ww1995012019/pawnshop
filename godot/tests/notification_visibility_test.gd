extends SceneTree
var failures:=0
func _initialize():call_deferred("run")
func frames(n:=12):
	for i in n:await process_frame
func check(ok:bool,message:String):
	print("NOTICE VISIBILITY ","PASS " if ok else "FAIL ",message)
	if not ok:failures+=1
func luminance(c:Color)->float:
	return c.srgb_to_linear().get_luminance()
func contrast(a:Color,b:Color)->float:
	return (maxf(luminance(a),luminance(b))+.05)/(minf(luminance(a),luminance(b))+.05)
func run():
	root.size=Vector2i(1440,900)
	var game=root.get_node("Game")
	game.new_game("NOTICE-VISIBILITY");game.prefs.sound=false;game.prefs.reduced_motion=true
	var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title()
	shell.go("warehouse");await frames()
	var owner=shell.active_shell()
	owner.toast("放置会重叠或越界，货物已回到原位。","error");await frames()
	var banner:PanelContainer=owner.toast_box.get_child(0)
	var label:Label=banner.get_child(0)
	var paper:StyleBox=banner.get_theme_stylebox("panel")
	check(contrast(label.get_theme_color("font_color"),paper.get("bg_color"))>=4.5,"warning text has readable contrast against its actual panel")
	await create_timer(4.2).timeout
	check(is_instance_valid(banner) and banner.is_visible_in_tree(),"a warning remains visible long enough to read after a failed move")
	shell.go("counter");await frames()
	for dimensions in [Vector2i(1440,900),Vector2i(844,390),Vector2i(390,844)]:
		root.size=dimensions;shell.phone_override=dimensions.x<1000;shell._fit();await frames()
		shell.go("repair");await frames()
		owner=shell.active_shell()
		shell.toast("维修工单已保存：只处理本件实际故障。","info");await frames()
		check(owner.toast_box.get_child_count()==1,"repair status uses its own workspace notice area at "+str(dimensions))
		if owner.toast_box.get_child_count()>0:
			var notice:Control=owner.toast_box.get_child(0)
			if not owner.page.toast_rect().grow(2).encloses(notice.get_global_rect()):print("NOTICE GEOMETRY ",dimensions," slot=",owner.page.toast_rect()," notice=",notice.get_global_rect())
			check(owner.page.toast_rect().grow(2).encloses(notice.get_global_rect()),"visible repair notice fits the reserved slot at "+str(dimensions))
		shell.go("counter");await frames()
	root.size=Vector2i(1440,900);shell.phone_override=false;shell._fit();await frames()
	shell.go("inspect");await frames()
	owner=shell.active_shell()
	owner.toast("稳定质量：54.5 g。按实际表带配置与说明书比较。估价 11–117 Cr。","info");await frames()
	var inspection_notice:Control=owner.toast_box.get_child(0)
	var manual:Control=owner.page.get_node("watch_manual")
	check(not inspection_notice.get_global_rect().intersects(manual.get_global_rect()),"inspection notice leaves its manual button and text unobstructed")
	shell.queue_free();await frames()
	quit(1 if failures else 0)
