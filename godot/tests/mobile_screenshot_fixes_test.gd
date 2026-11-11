extends SceneTree
## Regression cases from the user's three screenshots.
var failures := 0
func _initialize() -> void: call_deferred("run")
func frames() -> void:
	for i in 12: await process_frame
func check(ok: bool, message: String) -> void:
	print("SCREENSHOT FIX ","PASS " if ok else "FAIL ",message)
	if not ok: failures += 1
func run() -> void:
	var game = root.get_node("Game")
	game.new_game("SCREENSHOT-FIXES")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	game.state.trade = {"id":"picker-visit","npcId":"CHR-004","kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[],"line":""}
	game.state.ledger = [
		{"id":"sale","day":21,"kind":"sale","label":"售出 澄川 D05 夜航（原表：澄川 D03 流光）","amount":197,"cost":0},
		{"id":"event","day":21,"kind":"station-event","label":"第三期租金与回环之约 · 封装邻里账目副本","amount":50,"cost":0},
		{"id":"buy","day":20,"kind":"purchase","label":"收购 北辰 N01 通勤","amount":-180,"cost":180}]
	root.size = Vector2i(1440,900)
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	shell.phone_override = true
	for dimensions in [Vector2i(945,514),Vector2i(844,390),Vector2i(568,320),Vector2i(390,844)]:
		root.size = dimensions
		shell._fit()
		await frames()
		var view = shell.page.find_child("LandscapeCounter",true,false)
		if shell.landscape_mode():
			check(not view.panels[0].get_theme_stylebox("panel") is StyleBoxTexture,"header uses a stable phone surface after desktop initialization")
			check(view.heading.get_combined_minimum_size().y <= view.panels[0].size.y-8,"header text fits with vertical breathing room")
			check(not view.heading.get_global_rect().intersects(view.balance.get_global_rect()),"title and balance columns never overlap")
		var before: Dictionary = game.state.duplicate(true)
		shell.page._pick_goods()
		await frames()
		var grids: Array = shell.modal_layer.find_children("*","GridContainer",true,false)
		var grid: GridContainer = grids[0]
		check(grid.columns == 4,"pick goods lays out exactly four cards per row at " + str(dimensions))
		if grid.get_child_count() >= 4:
			var y: float = grid.get_child(0).get_global_rect().position.y
			check(absf(grid.get_child(3).get_global_rect().position.y-y)<1,"first four goods share the same row")
		var scrolls: Array = shell.modal_layer.find_children("*","ScrollContainer",true,false)
		check(scrolls.size()==1,"phone picker has a single vertical scroller")
		var picker_scroll: ScrollContainer = shell.modal_layer.find_child("ModalScroll",true,false)
		for i in mini(4,grid.get_child_count()):
			var button: Button = grid.get_child(i).find_children("*","Button",true,false)[0]
			check(picker_scroll.get_global_rect().grow(1).encloses(button.get_global_rect()),"first-row recommendations fit without scrolling at " + str(dimensions))
		check(game.state==before,"opening the picker leaves items and money unchanged")
		shell.close_top_modal()
		await frames()
		load("res://scripts/ui/campaign_ledger.gd").open(shell)
		await frames()
		var header: HBoxContainer = shell.modal_layer.find_child("ledger_table_header",true,false)
		var entries: VBoxContainer = shell.modal_layer.find_child("ledger_entries",true,false)
		check(header != null and header.get_child_count()==4,"ledger has Date / Type / Description / Amount column headers")
		if header != null:
			for row in entries.get_children():
				check(row is HBoxContainer and row.get_child_count()==4,"each transaction is one four-column table row")
				if row.get_child_count()!=4: continue
				for i in 4:
					check(absf(row.get_child(i).get_global_rect().position.x-header.get_child(i).get_global_rect().position.x)<1,"ledger columns align with their headers")
			var sheet: Control = shell.modal_layer.find_child("ModalSheet",true,false)
			check(shell.safe_area().grow(1).encloses(sheet.get_global_rect()),"ledger table fits the phone width")
		shell.close_top_modal()
		await frames()
	shell.queue_free()
	await frames()
	quit(1 if failures else 0)
