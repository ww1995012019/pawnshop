extends SceneTree
## Real report controls keep the campaign ending and offer explicit continuation.

const Life = preload("res://scripts/model/campaign_life.gd")
var failures := 0

func _initialize() -> void:
	call_deferred("run")

func check(ok: bool, label: String) -> void:
	print("REPORT CONTINUE ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1

func frames() -> void:
	for i in 12: await process_frame

func text_of(node: Node) -> String:
	var result := ""
	for label in node.find_children("*","Label",true,false): result += label.text + "\n"
	return result

func button(node: Node, caption: String) -> Button:
	for control in node.find_children("*","Button",true,false):
		if control.text == caption: return control
	return null

func settled(day: int, mode := "legacy21") -> Dictionary:
	var s := Model.create("REPORT-CONTINUATION")
	s.day = day
	s.risk = 0
	s.cash = 10000
	s.campaignLife = {"mode":mode}
	NightCrime.ensure_day(s)
	if Landlord.outstanding(s) > 0:
		s = Landlord.reduce(s,{"type":"CALL_LANDLORD"})
		s = Landlord.reduce(s,{"type":"PAY_RENT","tradeId":s.trade.id})
		s = Landlord.reduce(s,{"type":"REFUSE"})
	return Model.reduce(s,{"type":"SETTLE"})

func run() -> void:
	var game = root.get_node("Game")
	var kit=load("res://scripts/app/ui_kit.gd")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	game.state = settled(21)
	var initial: Dictionary = game.state.duplicate(true)
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	shell.go("report")
	await frames()
	var page = shell.active_shell().page
	var continue_button := button(page,"保留店铺，继续经营")
	check(continue_button != null and not continue_button.disabled,"day21 report offers an explicit keep-shop continuation")
	check(button(page,"续接 90 天故事") != null,"legacy day21 report offers story continuation alongside endless play")
	check(button(page,"查看结局") != null,"day21 report retains the original ending action")
	check(text_of(page).contains("完成维修") and text_of(page).contains("维修交付") and text_of(page).contains("净现金流") and text_of(page).contains("不代表利润"),"day21 report displays recorded achievements and honest business results")
	check(text_of(page).contains("至少3") and page.find_child("campaign_evaluation",true,false)!=null,"day21 report explains specialty thresholds in a scrollable evaluation")
	check(text_of(page).contains("保留现金、库存、耗材、关系与账本") and page.hint_text().contains("继续经营"),"report explains retained shop progress and the continuation choice")
	var ending := button(page,"查看结局")
	if ending != null: ending.pressed.emit()
	await frames()
	check(game.state.phase == "ending" and game.state.day == 21,"original report action still opens the day21 ending")
	page = shell.active_shell().page
	continue_button = button(page,"保留店铺，继续经营")
	check(continue_button != null and button(page,"新开一家店") != null,"successful ending offers continuation alongside a new shop")
	check(page.find_child("campaign_evaluation",true,false)!=null,"ending retains the same recorded evaluation")
	if continue_button != null:
		continue_button.pressed.emit()
		await frames()
		check(game.state.day == 22 and game.state.phase == "open" and Life.is_endless(game.state),"report continuation dispatch opens the next business day")
		check(game.state.cash == initial.cash and game.state.inventory == initial.inventory and game.state.materials == initial.materials and game.state.ledger == initial.ledger,"native report action preserves settled shop resources")
	else:
		game.state = Life.reduce(initial,{"type":"CONTINUE_CAMPAIGN"})
	shell.go("report")
	await frames()
	page = shell.active_shell().page
	game.state.day = 28
	game.state.risk = 0
	game.state.cash+=7777
	NightCrime.ensure_day(game.state)
	page._refresh()
	await frames()
	var endless_text := text_of(page)
	check(endless_text.contains("持续经营") and endless_text.contains("ENDLESS / 28") and page.hint_text().contains("第 4 周"),"endless report header, serial and hint identify the current week")
	var assessment_panel=page.find_child("campaign_evaluation",true,false)
	check(assessment_panel!=null and text_of(assessment_panel).contains("评估现金 "+kit.money(initial.report.evaluation.cash)),"endless report displays the saved assessment cash instead of later shop results")
	check(not endless_text.contains("夜间失窃时段已结束") and button(page,"购买今晚保险") != null and not button(page,"购买今晚保险").disabled,"day28 endless insurance stays actionable without an expired-campaign message")
	var late: Dictionary = initial.duplicate(true)
	late.day = 28
	late.report.day = 28
	late.erase("outcome")
	Life.set_mode(late,Life.ENDLESS)
	game.state = late
	page._refresh()
	await frames()
	check(button(page,"迎接第 29 天") != null and button(page,"查看结局") == null and button(page,"保留店铺，继续经营") == null,"endless reports use ordinary NEXT rather than another campaign choice")
	var advance := button(page,"迎接第 29 天")
	if advance != null: advance.pressed.emit()
	await frames()
	check(game.state.day == 29 and game.state.phase == "open","endless report NEXT dispatch advances normally")
	game.state = initial.duplicate(true)
	shell.go("report")
	await frames()
	var active = shell.active_shell()
	page = active.page
	shell.workspace_container.stretch = false
	for extent in [Vector2i(1600,900),Vector2i(600,900)]:
		active.get_viewport().size_2d_override = extent
		active.get_viewport().size = extent
		page.relayout()
		await frames()
		continue_button = button(page,"保留店铺，继续经营")
		if continue_button != null:
			var scroll: ScrollContainer = page.find_child("report_scroll",true,false)
			scroll.ensure_control_visible(continue_button)
			await frames()
			check(active.content_rect().encloses(page.sheet.get_rect()) and active.get_viewport().get_visible_rect().encloses(continue_button.get_global_rect()),"continuation remains reachable inside the report at " + str(extent))
		assessment_panel=page.find_child("campaign_evaluation",true,false)
		check(assessment_panel!=null and assessment_panel.size.x<=page.sheet.size.x,"evaluation wraps inside the report width at "+str(extent))
	var failed: Dictionary = initial.duplicate(true)
	failed.day = 35
	failed.phase = "ending"
	failed.outcome = "无法支付租金，交还店面"
	game.state = failed
	page._refresh()
	await frames()
	check(button(page,"保留店铺，继续经营") == null and button(page,"新开一家店") != null,"failed ending never offers continuation")
	check(text_of(page).contains("CLOSE / 35") and not text_of(page).contains("CLOSE / 21"),"late failed ending prints its actual closing day")
	game.state = Model.create("EARLY-REPORT-UI")
	page._refresh()
	await frames()
	check(button(page,"保留店铺，继续经营") == null,"ordinary early reports do not offer a campaign shortcut")
	await test_story_reports(game,shell)
	shell.queue_free()
	await frames()
	for player in root.find_children("*","AudioStreamPlayer",true,false):
		player.stop()
		player.stream = null
	await process_frame
	print("REPORT CONTINUE failures=",failures)
	quit(1 if failures else 0)

func test_story_reports(game, shell) -> void:
	game.state = settled(21,"story90")
	shell.go("report")
	await frames()
	var page = shell.active_shell().page
	var next := button(page,"迎接第 22 天")
	check(next != null and not next.disabled and button(page,"查看结局") == null and button(page,"保留店铺，继续经营") == null,"story day21 report permits ordinary next day without a finale choice")
	check(text_of(page).contains("第 21 / 90 天") and page.find_child("campaign_evaluation",true,false)!=null,"story day21 report identifies the campaign length and checkpoint")
	check(text_of(page).contains("第 28 天应付租金") and text_of(page).contains("599 Cr"),"the paid day21 story report previews the next installment")
	shell.open_shop_plan()
	await frames()
	var costs: Node = shell.modal_layer.find_child("CostsCard",true,false)
	check(costs != null and text_of(costs).contains("第 28 天应付租金 599 Cr"),"the story overview displays the same next unpaid rent")
	shell.close_top_modal()
	await frames()
	if next != null:
		next.pressed.emit()
		await frames()
		check(game.state.day == 22 and game.state.phase == "open","story checkpoint action opens day22")
	game.state = settled(90,"story90")
	shell.go("report")
	await frames()
	page = shell.active_shell().page
	var ending := button(page,"查看结局")
	check(ending != null and not ending.disabled and button(page,"迎接第 91 天") == null,"story day90 report offers a read-only finale instead of ordinary next day")
	check(text_of(page).contains("第 90 / 90 天") and text_of(page).contains("第90天经营评估"),"story day90 report displays the final frozen assessment")
	check(not text_of(page).contains("第 91 天应付租金"),"day90 report has no upcoming rent inside the story")
	if ending != null:
		ending.pressed.emit()
		check(ending.is_inside_tree() and game.state.phase == "report", "the ending control stays attached until the touch signal returns")
		await frames()
		check(game.state.phase == "ending" and game.state.day == 90,"reading the ending stays on day90")
	page = shell.active_shell().page
	var resume := button(page,"保留店铺，继续经营")
	check(resume != null and not resume.disabled,"story finale offers explicit endless continuation")
	if resume != null:
		resume.pressed.emit()
		check(resume.is_inside_tree() and game.state.phase == "ending", "the continuation control stays attached until the touch signal returns")
		await frames()
		check(game.state.phase == "open" and game.state.day == 91 and Life.is_endless(game.state),"story continuation button opens the retained shop on day91")
