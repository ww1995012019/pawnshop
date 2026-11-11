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
var tool_keys: Array[Button] = []
var dock_keys: Array[Button] = []
var active := false
var last_size := Vector2.ZERO
var inset := Vector2.ZERO
var mat := Rect2()

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
	primary = _key("",adapter._primary,true)
	primary.name = "landscape_primary"
	more = _key("更多操作",adapter._actions)
	more.name = "landscape_more"
	flip = _key("翻面",func():
		if is_instance_valid(desk.mat_item) and not desk.busy and not desk._scene_blocked(): desk.mat_item.flip())
	flip.name = "landscape_flip"
	goods = _key("选择货物",adapter._goods_popup)
	goods.name = "landscape_goods"
	for spec in [["放大镜","TOL-001"],["紫外灯","TOL-002"],["电子秤","TOL-005"]]:
		var id: String = spec[1]
		var key := _key(spec[0],func():
			if not desk.busy and not desk._scene_blocked(): adapter._open_instrument(id))
		key.name = "landscape_"+id
		key.text = ""
		key.icon = UIKit.tool_icon(id)
		key.expand_icon = true
		key.add_theme_constant_override("icon_max_width",28)
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
	var area: Rect2 = shell.safe_area()
	var screen := area.size
	if screen == last_size and inset == area.position: return
	inset = area.position
	last_size = screen
	var left := clampf(screen.x*.22,145,200)
	var right := clampf(screen.x*.22,150,200)
	var top := 36.0
	var bottom := screen.y-40
	var inner_h := bottom-top-6
	mat = Rect2(left+8,top,screen.x-left-right-16,inner_h)
	_place(panels[0],Rect2(0,0,screen.x,32))
	_place(panels[1],Rect2(4,top,left,inner_h))
	_place(panels[2],mat)
	_place(panels[3],Rect2(screen.x-right-4,top,right,inner_h))
	_place(panels[4],Rect2(0,bottom,screen.x,40))
	_place(heading,Rect2(12,2,240,28))
	_place(balance,Rect2(screen.x-350,2,338,28))
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
	for i in 3:
		var width := 42.0
		var start := mat.get_center().x-(width*3+20)*0.5
		_place(tool_keys[i],Rect2(start+i*(width+10),mat.end.y-38,width,34))
	desk.MAT_POS = inset+Vector2(mat.get_center().x,mat.position.y+130)
	desk.counter_table.presentation_rect = Rect2(inset+mat.position+Vector2(42,96),Vector2(maxf(80,mat.size.x-84),maxf(30,inner_h-150)))
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
	_place(price,Rect2(tx,action_top-26,right-12,24))
	_place(primary,Rect2(tx,action_top,right-12,32))
	_place(more,Rect2(tx,action_top+36,right-12,30))
	if goods.visible: _place(goods,Rect2(tx,bottom-34,right-12,30))
	var dock_width := (screen.x-16)/5
	for i in 5: _place(dock_keys[i],Rect2(8+i*dock_width,bottom+4,dock_width-4,30))

func _process(_delta: float) -> void:
	if not active: return
	_layout()
	desk.cash_tray.show()
	heading.text = "轨道旧货局 · 第 %02d 天" % Game.state.day
	balance.text = "%s Cr   ·   AP %s" % [Model.jnum(desk.cash_tray.cash if desk.busy else Game.state.cash),Game.state.ap]
	visitor_name.text = adapter.visitor_name.text
	if speech_copy.text != adapter.speech.text:
		if not adapter.speech.text.begins_with(speech_copy.text): dialogue_scroll.scroll_vertical = 0
		speech_copy.text = adapter.speech.text
	item_name.text = adapter.item_name.text
	price.text = adapter.price.text
	primary.text = adapter.primary.text
	primary.disabled = adapter.primary.disabled
	more.disabled = desk.busy
	goods.disabled = desk.busy
	goods.text = "货物 · %d 件" % CounterDialogue.table_items(Game.state).size() if CounterDialogue.active(Game.state) else "选择货物"
	flip.disabled = desk.busy or not is_instance_valid(desk.mat_item)
	for key in tool_keys: key.disabled = flip.disabled
	for key in dock_keys: key.disabled = desk.busy
	var police: bool = desk.resident_window.has_node("counter_patrol")
	if police: visitor_name.text = "巡警 · 现场核对"
	hint.text = "巡警正在核对 · 请等候" if police else "正在交割 · 请等待钱货落稳" if desk.busy else "拖动实物 · 工具展开鉴定台"
