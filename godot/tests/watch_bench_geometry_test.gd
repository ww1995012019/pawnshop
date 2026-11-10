extends SceneTree
## Geometry consumed by drawing and real mouse/touch targets, with independent dimensions.
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	if not ok:
		push_error(message)
		failures += 1
func close_to(actual: Vector2, expected: Vector2, message: String) -> void:
	check(actual.distance_to(expected)<0.002,message+" actual="+str(actual))
func bench(id: String, back := "screw", task := "open"):
	var it := {"uid":"GEOMETRY-"+id,"defId":id,"watch":{"serial":"GEOMETRY","logo_variant":0},"evidence":[],"service":{"profile":{"movement":"quartz","caseback":back},"opened":false,"faults":[]}}
	var art = load("res://scripts/ui/watch_bench_art.gd").new()
	root.add_child(art)
	art.size=Vector2(640,460)
	art.configure(it,task)
	art.set_process(false)
	return art
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.sound=false
	var oval = bench("WCH-075")
	close_to(oval.interaction_targets()[0].position,Vector2(370.85,227),"oval safe action contacts attached crown")
	oval.size=Vector2(320,230)
	close_to(oval.interaction_targets()[0].position,Vector2(185.425,113.5),"phone crown target follows actual scaled hardware")
	oval.size=Vector2(640,460)
	check(oval.has_method("_case_offset") and oval.has_method("_case_hatch_spans"),"bench exposes contour primitives consumed by drawing")
	if not oval.has_method("_case_offset"):
		oval.free()
		await finish()
		return
	close_to(oval._case_offset(98,0),Vector2(83.3,0),"oval outer dial tick fits dial")
	close_to(oval._case_offset(87,0),Vector2(73.95,0),"oval major tick inner edge follows contour")
	close_to(oval._case_offset(94,0),Vector2(79.9,0),"oval inner cover ring fits cover")
	var spans: Array = oval._case_hatch_spans(95,0)
	check(spans.size()==1,"oval center hatch is one continuous span")
	if spans.size()==1: close_to(spans[0],Vector2(-80.75,80.75),"oval hatching fits inset cover")
	close_to(oval._crown_rect().position,Vector2(346.85,216),"oval crown overlaps body by four pixels")
	var contacts: PackedVector2Array=oval._opener_contacts()
	close_to(contacts[0],Vector2(-83.3,0),"left opener tip lies in oval slot")
	close_to(contacts[1],Vector2(83.3,0),"right opener tip lies in oval slot")
	for radius in [104.0,51.0]:
		for n in range(60):
			var p: Vector2=oval._case_offset(radius-3,float(n)*TAU/60)
			check(pow(p.x/(radius*0.85),2)+pow(p.y/(radius*1.05),2)<1.001,"oval overlay remains inside seated/detached cover")
		for row in range(-50,51,5):
			for span in oval._case_hatch_spans(radius-9,float(row)):
				for x in [span.x,span.y]:
					check(pow(x/(radius*0.85),2)+pow(float(row)/(radius*1.05),2)<1.001,"hatch endpoints stay inside oval cover")
	var snap=bench("WCH-075","snap")
	snap._state.step=1
	var notch: PackedVector2Array=snap._snap_notch(104)
	close_to(snap.interaction_targets()[0].position,Vector2(248,227)+(notch[0]+notch[1])*0.5,"snap action touches drawn notch")
	for id in ["WCH-001","WCH-007"]:
		var legacy=bench(id,"snap")
		close_to(legacy.interaction_targets()[0].position,Vector2(389,227),id+" legacy crown position unchanged")
		legacy._state.step=1
		close_to(legacy.interaction_targets()[0].position,Vector2(339,289),id+" legacy snap position unchanged")
		close_to(legacy._case_offset(98,0),Vector2(98,0),id+" legacy ticks unchanged")
		legacy.free()
	var bolts=bench("WCH-075","bolts")
	var bolt_points=[Vector2(183.6533,162.6533),Vector2(312.3467,162.6533),Vector2(312.3467,291.3467),Vector2(183.6533,291.3467)]
	for i in 4:
		close_to(bolts._screw_pos(i),bolt_points[i],"original diagonal bolt retained")
		bolts._state.step=i+1
		close_to(bolts.interaction_targets()[0].position,bolt_points[i],"bolt action retains shared diagonal anchor")
	var quartz_test=bench("WCH-075","screw","test")
	for action in quartz_test._plan:
		if action.id=="set_crown": close_to(quartz_test._v(action.at),Vector2(370.85,227),"quartz setting uses attached crown")
	# A non-elliptical corner and sun valley must not become an unscaled circle.
	var octagon=bench("WCH-076")
	close_to(octagon._case_offset(100,PI/8),Vector2(85.35534,35.35534),"octagon overlay follows straight bevel")
	var sun=bench("WCH-074")
	close_to(sun._case_offset(100,PI/8),Vector2(81.3014,33.6761),"sun overlay follows concave valley")
	var cushion=bench("WCH-077")
	check(cushion._case_offset(100,PI/4).length()>120,"cushion diagonal follows rounded square rather than circle")
	for art in [oval,snap,bolts,quartz_test,octagon,sun,cushion]: art.free()
	await finish()
func finish() -> void:
	for player in root.find_children("*","AudioStreamPlayer",true,false):
		player.stop()
		player.stream=null
	await process_frame
	print("WATCH BENCH GEOMETRY failures=",failures)
	quit(1 if failures else 0)
