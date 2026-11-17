extends SceneTree
## A police document is desk paperwork, never an additional watch or storage tile.
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool,message: String) -> void:
	print("WANTED DESK ","PASS " if ok else "FAIL ",message)
	if not ok:failures+=1
func frames(count := 8) -> void:
	for i in count:await process_frame
func has_text(node: Node,text: String) -> bool:
	for label in node.find_children("*","Label",true,false):
		if label.text.contains(text):return true
	return false
func modal_button(host:Node,text:String) -> Button:
	for button in host.modal_layer.find_children("*","Button",true,false):
		if button.text==text and button.is_visible_in_tree():return button
	return null
func click_real(button:Button) -> void:
	check(button!=null,"confirmation has its real cancel target")
	if button==null:return
	var transform:Transform2D=button.get_viewport().get_screen_transform()*button.get_global_transform_with_canvas()
	var at:Vector2=transform*(button.size*.5)
	var motion=InputEventMouseMotion.new();motion.position=at;motion.global_position=at
	Input.parse_input_event(motion);await frames(2)
	for pressed in [true,false]:
		var event=InputEventMouseButton.new();event.button_index=MOUSE_BUTTON_LEFT;event.pressed=pressed;event.position=at;event.global_position=at
		Input.parse_input_event(event);await frames(3)
func run() -> void:
	root.size=Vector2i(1440,900)
	var game=root.get_node("Game")
	game.new_game("DESK-WANTED")
	game.prefs.reduced_motion=true;game.prefs.sound=false
	game.state.day=2;game.state.trade=WantedCases.new_officer_trade(game.state)
	var shell=load("res://main.tscn").instantiate();root.add_child(shell)
	await frames();shell._close_title()
	var before_inventory=JSON.stringify(game.state.inventory)
	game.dispatch({"type":"ISSUE_WANTED","tradeId":game.state.trade.id})
	await frames()
	check(JSON.stringify(game.state.inventory)==before_inventory,"receiving desk paperwork preserves every watch slot and original")
	check(shell.page.stock_count.text.begins_with(str(game.state.inventory.size())+" 件"),"legacy counter watch total excludes paperwork")
	check(shell.page.stock_grid.find_child("wanted_inventory",false,false)==null,"legacy watch grid contains no paperwork tile")
	var poster=shell.wanted_notice
	check(has_text(poster,"通缉令"),"expanded paper has an unmistakable wanted-poster heading")
	for id in game.state.police.wanted:
		var profile:Dictionary=WantedCases.profile(id)
		check(has_text(poster,profile.clue),"poster prints the complete saved clue: "+id)
		check(has_text(poster,profile.features) and has_text(poster,str(int(profile.reward))+" Cr"),"poster preserves physical features and bounty: "+id)
	var mini=shell.page.strict_view.wanted_paper
	poster.close_document();await frames()
	check(mini.is_visible_in_tree(),"folded notice leaves its physical desk paper available")
	await click_real(mini)
	check(poster.visible and poster.get_global_rect().intersects(mini.get_global_rect()),"real desk-paper click opens a poster over the same screen area")
	check(not mini.is_visible_in_tree(),"expanded poster suppresses the mini paper and its higher-z feedback over profile text")
	var feedback=mini.get_node_or_null("InteractionFeedback")
	check(feedback==null or not feedback.is_visible_in_tree(),"mini interaction feedback cannot paint over the expanded document")
	await click_real(poster.close_button)
	check(not poster.visible and mini.is_visible_in_tree(),"real poster close restores the original desk-paper target")
	game.dispatch({"type":"TOGGLE_NOTICE","visible":true});await frames()
	var helper_path="res://scripts/ui/wanted_desk_paper.gd"
	check(ResourceLoader.exists(helper_path),"small physical desk paper exists independently of stock")
	if ResourceLoader.exists(helper_path):
		var helper=load(helper_path).new();shell.root_ui.add_child(helper);helper.setup(shell)
		helper.position=Vector2(100,500);helper.size=Vector2(146,90);helper.refresh();await frames()
		poster.close_document();await frames();helper.refresh()
		check(helper.visible and helper.find_children("desk_wanted_photo_*","TextureRect",true,false).size()==6,"small desk paper shows the same six saved faces")
		var saved=game.state.police.wanted.duplicate()
		poster.close_document();await frames();helper.pressed.emit();await frames()
		check(poster.visible and game.state.police.wanted==saved,"desk paper reopens the same notice after close")
		poster.close_document();await frames()
		check(not poster.visible and helper.visible and game.state.documents.size()==1,"poster close restores its miniature without discarding the document")
		helper.pressed.emit();await frames()
		helper.queue_free()
	# An already-open nonmodal poster must remain above each newly created drawer.
	shell.go("inspect");await frames()
	check(poster.get_index()>shell.workspace_overlay.get_index(),"open poster remains above a newly created equipment overlay")
	root.size=Vector2i(1920,1080);await frames();shell._fit();await frames()
	var paper_before=game.state.police.paper.duplicate(true)
	var documents_before=game.state.documents.duplicate(true)
	var active=shell.active_shell()
	active.confirm("核对原物","请核对本件实物，再选择是否继续。","确认",func():pass)
	await frames()
	check(not poster.visible and game.state.police.paper.visible,"child confirmation temporarily suspends the expanded paper without closing its saved preference")
	poster.refresh();await frames(2)
	check(not poster.visible,"ordinary document refresh cannot lift paper over an active child confirmation")
	await click_real(modal_button(active,"取消"))
	check(not active.modal_open(),"real cancel click reaches the child confirmation instead of the poster")
	# Keep later assertions bounded even when running the original red behavior.
	if active.modal_open():active.close_top_modal();await frames()
	check(poster.visible,"closing child confirmation restores the already-open saved paper")
	active.confirm("子层确认","先保留这张子层确认。","确认",func():pass);await frames()
	shell.confirm("外层确认","根确认同样拥有优先输入。","确认",func():pass);await frames()
	check(not poster.visible,"root and child modal stack both take priority over the desk paper")
	await click_real(modal_button(shell,"取消"))
	check(not shell.modal_open() and active.modal_open() and not poster.visible,"closing the root modal leaves the child modal above hidden paperwork")
	await click_real(modal_button(active,"取消"))
	if active.modal_open():active.close_top_modal();await frames()
	check(poster.visible,"paper returns only after the final active modal closes")
	check(game.state.police.paper==paper_before and game.state.documents==documents_before,"modal priority never changes paper geometry, preference or document custody")
	game.dispatch({"type":"TOGGLE_NOTICE","visible":false});await frames()
	active.confirm("收起状态","已收起的纸张不应自动展开。","确认",func():pass);await frames()
	await click_real(modal_button(active,"取消"))
	check(not poster.visible and not game.state.police.paper.visible,"closing a modal respects a previously folded notice")
	game.dispatch({"type":"TOGGLE_NOTICE","visible":true});await frames()
	game.prefs.reduced_motion=false
	active.confirm("普通动态确认","关闭动画结束后再恢复纸张。","确认",func():pass);await frames()
	await click_real(modal_button(active,"取消"))
	if active.modal_open():check(not poster.visible,"paper stays suspended through the confirmation closing animation")
	await create_timer(.35).timeout
	check(not active.modal_open() and poster.visible,"native modal exit restores paper after a normal closing animation without a model action")
	game.prefs.reduced_motion=true
	shell.go("repair");await frames()
	shell.close_workspace();await frames()
	check(poster.get_index()>shell.workspace_overlay.get_index(),"restoring a suspended drawer cannot cover the open poster")
	while shell.workspace_open():shell.close_workspace();await frames()
	var desktop_geometry=game.state.police.paper.duplicate(true)
	for dimensions in [Vector2i(390,844),Vector2i(844,390)]:
		root.size=dimensions;shell.phone_override=true;await frames();shell._fit();poster.refresh();await frames()
		check(poster.scale.is_equal_approx(Vector2.ONE),"mobile poster uses native readable text: "+str(dimensions))
		check(shell.safe_area().encloses(poster.get_global_rect()),"mobile poster stays inside safe viewport")
		for label in poster.find_children("*","Label",true,false):
			if label.text=="协 查":
				var stamp=label.get_parent() as Control
				var ink_width=label.get_theme_font("font").get_string_size(label.text,HORIZONTAL_ALIGNMENT_LEFT,-1,label.get_theme_font_size("font_size")).x
				check(stamp.size.x>=ink_width+10 and label.get_line_count()==1,"wanted stamp stays wide enough for a single horizontal line")
				check(stamp.get_parent().size.y<=56,"poster masthead never stretches into a tall stamp column")
		var grid=poster.find_child("WantedProfiles",true,false)
		check(grid!=null and grid.columns==(1 if dimensions.x<dimensions.y else 2),"mobile poster reflows profile columns: "+str(dimensions))
		for label in poster.find_children("*","Label",true,false):
			check(label.get_theme_font_size("font_size")>=16,"mobile poster text remains at least16 native pixels")
		poster.document_scroll.scroll_vertical=10000;await frames()
		var last=poster.find_child("case_"+String(game.state.police.wanted[-1]),true,false)
		check(last!=null and poster.document_scroll.get_global_rect().intersects(last.get_global_rect()),"scroll reaches the sixth saved profile")
		var adapter=shell.page.find_child("PortraitCounter",true,false)
		poster.close_document();await frames()
		if dimensions.x<dimensions.y:
			var paper=adapter.find_child("wanted_inventory",true,false)
			check(paper!=null and paper.is_visible_in_tree() and shell.safe_area().encloses(paper.get_global_rect()),"portrait has its own visible desk-document entry")
			check(shell.safe_area().encloses(adapter.primary.get_global_rect()),"portrait paperwork leaves the real trade action on screen")
			check(adapter.item_art.size.y>=48,"portrait paperwork leaves room for the real watch illustration")
			adapter._goods_popup();await frames()
			check(shell.modal_layer.find_child("mobile_wanted_inventory",true,false)==null,"phone goods picker contains watches without a paperwork tile")
			shell.close_top_modal();game.dispatch({"type":"TOGGLE_NOTICE","visible":true});await frames()
		else:
			var paper=adapter.landscape.wanted_paper
			check(paper.visible and paper.size.y>=44 and shell.safe_area().encloses(paper.get_global_rect()),"landscape desk-document target stays on its own surface")
			for key in adapter.landscape.tool_keys:check(not paper.get_global_rect().intersects(key.get_global_rect()),"landscape paperwork never overlaps a tool target")
		poster.close_document();await frames()
		check(game.state.police.paper.position==desktop_geometry.position and game.state.police.paper.scale==desktop_geometry.scale,"closing mobile reflow preserves the saved desktop paper placement")
		game.dispatch({"type":"TOGGLE_NOTICE","visible":true});await frames()
	shell.queue_free();await frames()
	for player in root.find_children("*","AudioStreamPlayer",true,false):player.stop();player.stream=null
	await frames(1)
	print("WANTED DESK failures=",failures)
	quit(1 if failures else 0)
