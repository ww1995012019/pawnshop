extends Control
## Mobile presentation of the original counter; world actors remain authoritative.
var adapter
var desk
var shell
var cash_home: Control
var background: CanvasLayer
var panels: Array[Control] = []
var heading: Label
var balance: Label
var visitor_name: Label
var speech: PanelContainer
var dialogue_scroll: ScrollContainer
var speech_copy: Label
var item_name: Label
var hint: Label
var price: Label
var primary: Button
var more: Button
var flip: Button
var goods: Button
var put_aside: Button
var goods_strip: ScrollContainer
var goods_tiles: HBoxContainer
var goods_position: Label
var tile_buttons: Dictionary = {}
var strip_signature := ""
var strip_focus := ""
var tool_keys: Array[Button] = []
var dock_keys: Array[Button] = []
var active := false
var last_size := Vector2.ZERO
var inset := Vector2.ZERO
var mat := Rect2()
var wanted_paper: Button
var last_notice := false

func setup(owner_adapter) -> void:
	adapter = owner_adapter
	desk = adapter.desk
	shell = adapter.shell
	cash_home = desk.cash_tray.get_parent()
	name = "LandscapeCounter"
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	background = CanvasLayer.new()
	background.layer = -1
	add_child(background)
	for kind in ["wine","wine","felt","wine","wine"]:
		var panel := UIKit.plate(PortraitSkin.panel(kind,0))
		panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
		background.add_child(panel)
		panels.append(panel)
	# Crop the shop window and the empty felt/wood edge from the same room as the desktop.
	for region in [[1,Rect2(560,68,400,389)],[2,Rect2(495,465,626,312)]]:
		var surface := StyleBoxTexture.new()
		surface.texture = preload("res://assets/comic/reference-clean-room.png")
		surface.region_rect = region[1]
		panels[region[0]].add_theme_stylebox_override("panel",surface)
	# The dock also owns its gaps; nearby business actions must not attract them.
	panels[4].set_meta("touch_assist_no_expand",true)
	heading = _label("轨道旧货局",20,UIKit.TEXT)
	balance = _label("",18,UIKit.AMBER)
	visitor_name = _label("",15,UIKit.AMBER)
	speech = UIKit.plate(PortraitSkin.panel("wine",5))
	add_child(speech)
	dialogue_scroll = ScrollContainer.new()
	dialogue_scroll.name = "DialogueScroll"
	dialogue_scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	speech.add_child(dialogue_scroll)
	speech_copy = UIKit.label("",14,UIKit.TEXT,false,true)
	speech_copy.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	speech_copy.mouse_filter = Control.MOUSE_FILTER_PASS
	dialogue_scroll.add_child(speech_copy)
	item_name = _label("",17,UIKit.TEXT)
	hint = _label("拖动实物 · 轻点选中",14,UIKit.MUTED)
	price = _label("",18,UIKit.AMBER)
	price.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	price.max_lines_visible = 2
	primary = _key("",adapter._primary,true)
	primary.name = "landscape_primary"
	more = _key("顾客操作",func(): adapter._actions(put_aside.visible))
	more.name = "landscape_more"
	flip = _key("翻面",func():
		if is_instance_valid(desk.mat_item) and not desk.busy and not desk._scene_blocked(): desk.mat_item.flip())
	flip.name = "landscape_flip"
	goods = _key("选择货物",adapter._goods_popup)
	goods.name = "landscape_goods"
	put_aside = _key("取消本件锁价",func():
		if not desk.busy and not desk._scene_blocked():
			Game.dispatch(put_aside.get_meta("action",{})))
	put_aside.name = "landscape_put_aside"
	goods_strip = ScrollContainer.new()
	goods_strip.name = "landscape_goods_strip"
	goods_strip.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	goods_strip.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_SHOW_NEVER
	goods_strip.scroll_deadzone = 8
	goods_strip.follow_focus = true
	add_child(goods_strip)
	goods_tiles = UIKit.hbox(5)
	goods_strip.add_child(goods_tiles)
	goods_position = _label("",13,UIKit.MUTED)
	for label in [item_name,goods_position,hint,visitor_name]:
		label.add_theme_color_override("font_color",Color("fff0cd"))
		label.add_theme_color_override("font_outline_color",Color("3b2b21"))
		label.add_theme_constant_override("outline_size",4)
	wanted_paper=preload("res://scripts/ui/wanted_desk_paper.gd").new()
	wanted_paper.compact=true
	add_child(wanted_paper)
	wanted_paper.setup(shell)
	wanted_paper.name="wanted_inventory"
	for spec in [["放大镜","TOL-001"],["紫外灯","TOL-002"],["称重","TOL-005"]]:
		var id: String = spec[1]
		var key := _key(spec[0],func():
			if not desk.busy and not desk._scene_blocked(): adapter._open_instrument(id))
		key.name = "landscape_"+id
		key.tooltip_text = spec[0]
		tool_keys.append(key)
	for spec in [["柜台","counter"],["仓库","warehouse"],["展开工作台","repair"],["事务","tasks"],["设置","settings"]]:
		var target: String = spec[1]
		var key := _key(spec[0],func():
			if desk.busy: return
			if target == "tasks": adapter._tasks()
			elif target == "settings": shell.open_settings()
			elif target == "repair": desk._open_instrument("repair")
			else: shell.go(target),target=="counter")
		key.name = "landscape_nav_"+target
		key.set_meta("touch_assist_no_expand",true)
		dock_keys.append(key)

func _label(text: String, font_size: int, color: Color) -> Label:
	var label := UIKit.label(text,font_size,color)
	label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	label.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	add_child(label)
	return label

func _key(text: String, action: Callable, accent := false) -> Button:
	var button: Button = adapter._key(text,action,"primary" if accent else "secondary")
	PortraitSkin.button(button,accent,true)
	button.custom_minimum_size = Vector2(0,28)
	button.clip_text = true
	button.add_theme_font_size_override("font_size",14)
	add_child(button)
	return button

func _place(control: Control, rect: Rect2) -> void:
	control.position = rect.position+inset
	control.size = rect.size

func set_active(value: bool) -> void:
	visible = value
	background.visible = value
	if active != value:
		active = value
		last_size = Vector2.ZERO
		if active:
			desk.cash_tray.reparent(self,false)
		else:
			desk.cash_tray.reparent(cash_home,false)
			desk.cash_tray.position = Vector2(392,142)
			desk.cash_tray.size = Vector2(116,64)
			desk.cash_tray.visible = not desk.offer_panel.visible
		if not active:
			desk.resident_window.position = Vector2(644,124)
			desk.resident_window.size = Vector2(690,366)
			desk.STAND = Vector2(880,490)
			desk.MAT_POS = Vector2(990,575)
			desk.bell.position = inset+Vector2(540,650)
			desk.bell.resting_scale = Vector2.ONE
			desk.bell.scale = Vector2.ONE
			desk.counter_table.presentation_rect = Rect2()
			desk.counter_table.show_focused_only = false
			for node in desk.back_root.get_children():
				if node != desk.resident_window: node.show()
			if is_instance_valid(desk.customer): desk.customer.scale = Vector2.ONE*(320.0/desk.customer.size.y)
			desk._sync_table()
	if active:
		shell.bg.hide()
		for node in shell.scene_nodes: if is_instance_valid(node): node.hide()
		for node in desk.back_root.get_children():
			if node != desk.resident_window: node.hide()
		_layout()
	elif not shell.portrait_mode():
		shell.bg.show()
		for node in shell.scene_nodes: if is_instance_valid(node): node.show()

func _layout() -> void:
	# Keep committed originals available until their handoff animation ends.
	if desk.busy and last_size != Vector2.ZERO: return
	var area: Rect2 = shell.safe_area()
	var screen := area.size
	if screen == last_size and inset == area.position:return
	inset = area.position
	last_size = screen
	# This view may have been constructed before the browser acquired phone
	# dimensions. Apply its header metrics when it actually becomes visible.
	var header_style := UIKit.skin("graphite","xs",0)
	panels[0].add_theme_stylebox_override("panel",header_style)
	for label in [heading,balance]:
		label.add_theme_font_size_override("font_size",14)
		label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		label.clip_text = true
	var left := clampf(screen.x*.22,145,200)
	var right := clampf(screen.x*.22,150,200)
	var top := 36.0
	var dock_height := maxf(44.0,44.0/maxf(shell.touch_scale(),.01))
	var dock_band := dock_height+8
	var bottom := screen.y-dock_band
	var inner_h := bottom-top-6
	mat = Rect2(left+8,top,screen.x-left-right-16,inner_h)
	_place(panels[0],Rect2(0,0,screen.x,32))
	_place(panels[1],Rect2(4,top,left,inner_h))
	_place(panels[2],mat)
	_place(panels[3],Rect2(screen.x-right-4,top,right,inner_h))
	_place(panels[4],Rect2(0,bottom,screen.x,dock_band))
	_place(heading,Rect2(12,2,screen.x*.52-20,28))
	_place(balance,Rect2(screen.x*.52,2,screen.x*.48-12,28))
	balance.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	_place(visitor_name,Rect2(18,top+8,left-24,24))
	var customer_h := clampf(inner_h-108,80,180)
	desk.resident_window.position = inset+Vector2(12,top+32)
	desk.resident_window.size = Vector2(left-12,customer_h)
	desk.STAND = desk.resident_window.position + Vector2((left-12)*.5,customer_h)
	if is_instance_valid(desk.customer):
		desk.customer.scale = Vector2.ONE*(customer_h/desk.customer.size.y)
		if not desk.customer.walking: desk.customer.position = desk.STAND-desk.resident_window.position
	var visitors: Array = desk.resident_window.get_children().filter(func(node): return node is Customer and not node.is_queued_for_deletion())
	if visitors.size()>1:
		for actor in visitors:
			actor.scale=Vector2.ONE*minf(customer_h/actor.size.y,(left-12)*.46/actor.size.x)
			if not actor.walking: actor.position=Vector2((left-12)*(.25 if actor==desk.customer else .75),customer_h)
	_place(speech,Rect2(14,top+customer_h+34,left-16,inner_h-customer_h-40))
	_place(item_name,Rect2(mat.position+Vector2(8,4),Vector2(mat.size.x-76,24)))
	_place(flip,Rect2(mat.end.x-64,mat.position.y+4,58,28))
	_place(hint,Rect2(mat.position+Vector2(8,33),Vector2(mat.size.x-16,20)))
	_layout_paper_tools()

	var strip_y := mat.end.y-94.0
	var strip_width := mat.size.x-16.0
	var strip_resized := not is_equal_approx(goods_strip.size.x,strip_width)
	_place(goods_strip,Rect2(mat.position.x+8,strip_y,strip_width,50))
	if strip_resized and tile_buttons.has(strip_focus):
		goods_strip.ensure_control_visible.call_deferred(tile_buttons[strip_focus])
	_place(goods_position,Rect2(mat.position.x+8,strip_y-19,mat.size.x-16,18))
	var surface := Rect2(inset+mat.position+Vector2(20,55),Vector2(maxf(60,mat.size.x-40),maxf(34,strip_y-mat.position.y-74)))
	desk.MAT_POS = surface.get_center()
	desk.counter_table.presentation_rect = surface
	desk.counter_table.show_focused_only = true
	desk._sync_table()
	if is_instance_valid(desk.mat_item) and not CounterDialogue.active(Game.state):
		desk.mat_item.position = desk.MAT_POS
		desk.mat_item.bounds = desk.counter_table.presentation_rect
	var tx := screen.x-right+4
	desk.bell.position = inset+Vector2(tx+32,top+54)
	desk.bell.resting_scale = Vector2.ONE*(.55 if right<190 else .65)
	desk.bell.scale = desk.bell.resting_scale
	_place(desk.cash_tray,Rect2(tx+74,top+12,right-88,44))
	desk.cash_tray.show()
	desk.mobile_cash = desk.cash_tray.note_center()
	desk.mobile_goods = inset+Vector2(18+left*.5,bottom+22)
	goods.visible = screen.y >= 320
	var action_top := bottom-122 if goods.visible else bottom-84
	_place(price,Rect2(tx,action_top-38,right-12,36))
	_place(primary,Rect2(tx,action_top,right-12,32))
	_place(more,Rect2(tx,action_top+36,right-12,30))
	_place(put_aside,Rect2(mat.end.x-132,mat.position.y+35,126,30))
	if goods.visible: _place(goods,Rect2(tx,bottom-34,right-12,30))
	var dock_width := (screen.x-16)/5
	for i in 5: _place(dock_keys[i],Rect2(8+i*dock_width,bottom+4,dock_width-4,dock_height))

func _layout_paper_tools() -> void:
	# Paper ownership may change during a police handover. Reflow only the
	# document/tool controls; rebuilding the table would destroy the originals.
	var has_notice:=WantedCases.has_notice(Game.state)
	last_notice=has_notice
	var left := mat.position.x+6.0+(60.0 if has_notice else 0.0)
	var available := mat.end.x-6.0-left
	var width := minf(110.0,(available-8.0)/3.0)
	var start := left+(available-3.0*width-8.0)/2.0
	for i in 3:
		_place(tool_keys[i],Rect2(start+i*(width+4.0),mat.end.y-38,width,34))
	_place(wanted_paper,Rect2(mat.position.x+4,mat.end.y-38,56,34))

func _refresh_goods_strip(shown: Array) -> void:
	goods_strip.visible = not shown.is_empty()
	goods_position.visible = goods_strip.visible
	var focus := ""
	var index := 0
	var ids: Array = []
	for i in shown.size():
		ids.append(shown[i].uid)
		if shown[i].focused:
			focus = shown[i].uid
			index = i+1
	goods_position.text = ("第 %d / %d 件" % [index,shown.size()] if index > 0 else "请选择柜台上的货物") if not shown.is_empty() else ""
	var signature := str(Game.state.trade.id if Game.state.trade != null else "") + str(ids)
	var changed := signature != strip_signature
	if changed:
		strip_signature = signature
		UIKit.clear(goods_tiles)
		tile_buttons.clear()
		for entry in shown:
			var uid: String = entry.uid
			var item = TradeSession.item(Game.state,uid)
			if item == null: continue
			var button: Button = adapter._key("",func():
				if not desk.busy and not desk._scene_blocked(): desk._focus_table(uid),"secondary")
			PortraitSkin.button(button,false,true)
			button.name = "landscape_item_" + uid
			button.icon = UIKit.physical_icon(item)
			button.expand_icon = true
			button.add_theme_constant_override("icon_max_width",34)
			button.custom_minimum_size = Vector2(51,48)
			button.tooltip_text = WatchForgery.sale_name(item)
			goods_tiles.add_child(button)
			tile_buttons[uid] = button
	if changed or focus != strip_focus:
		for uid in tile_buttons:
			PortraitSkin.button(tile_buttons[uid],uid == focus,true)
		if tile_buttons.has(focus): goods_strip.ensure_control_visible.call_deferred(tile_buttons[focus])
		strip_focus = focus
	for button in tile_buttons.values(): button.disabled = desk.busy or desk._scene_blocked()

func _process(_delta: float) -> void:
	if not active: return
	_layout()
	if last_notice!=WantedCases.has_notice(Game.state):_layout_paper_tools()
	wanted_paper.refresh()
	desk.cash_tray.show()
	heading.text = "轨道旧货局 · 第 %02d 天" % Game.state.day
	balance.text = "%s Cr   ·   AP %s" % [Model.jnum(desk.cash_tray.cash if desk.busy else Game.state.cash),Game.state.ap]
	visitor_name.text = adapter.visitor_name.text
	if speech_copy.text != adapter.speech.text:
		if not adapter.speech.text.begins_with(speech_copy.text): dialogue_scroll.scroll_vertical = 0
		speech_copy.text = adapter.speech.text
	item_name.text = adapter.item_name.text
	var trade = Game.state.trade
	var problem := ""
	var dialogue := CounterDialogue.active(Game.state)
	var shown := CounterDialogue.table_items(Game.state) if dialogue else []
	_refresh_goods_strip(shown)
	primary.text = adapter.primary.text
	primary.disabled = adapter.primary.disabled
	if dialogue and trade.locked:
		primary.text = UIKit.batch_payment_caption(TradeSession.summary(Game.state))
		problem = TradeSession.checkout_problem(Game.state)
		if problem == "": problem = StoreCosts.device_problem(Game.state,"quote_terminal")
		primary.disabled = primary.disabled or problem != ""
	price.autowrap_mode = TextServer.AUTOWRAP_OFF if problem == "" else TextServer.AUTOWRAP_ARBITRARY
	price.add_theme_font_size_override("font_size",18 if problem == "" else 13)
	price.add_theme_color_override("font_color",UIKit.AMBER if problem == "" else UIKit.DANGER)
	price.text = adapter.price.text if problem == "" else problem.get_slice("，",0)
	primary.tooltip_text = problem
	put_aside.visible = dialogue and trade.locked
	put_aside.disabled = desk.dialogue_put_aside.disabled
	if put_aside.visible:
		var action := CounterDialogue.action_for(Game.state,"COUNTER_UNSELECT")
		if put_aside.get_meta("action",{}) != action: put_aside.set_meta("action",action)
	more.disabled = desk.busy
	more.text = "顾客操作" if trade != null else "柜台操作"
	goods.disabled = desk.busy
	goods.text = "货物 · %d 件" % shown.size() if dialogue else "选择货物"
	flip.disabled = desk.busy or not is_instance_valid(desk.mat_item)
	for key in tool_keys: key.disabled = flip.disabled
	for key in dock_keys: key.disabled = desk.busy
	var police: bool = desk.resident_window.has_node("counter_patrol")
	if police: visitor_name.text = "巡警 · 现场核对"
	hint.text = "巡警正在核对 · 请等候" if police else "正在交割 · 请等待钱货落稳" if desk.busy else "选中手表后可用工具鉴定" if not is_instance_valid(desk.mat_item) else ""
