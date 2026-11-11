extends Control
## Portrait presentation only: every trade action delegates to the real counter.
var desk
var shell
var layout: VBoxContainer
var scroll: ScrollContainer
var body: VBoxContainer
var visitor: TextureRect
var speech: Label
var visitor_name: Label
var item_art: TextureRect
var item_name: Label
var item_hint: Label
var balance: Label
var day: Label
var price: Label
var primary: Button
var more: Button
var quote_box: HBoxContainer
var quote: SpinBox
var tools: HBoxContainer
var inventory: HBoxContainer
var flipped := false
var negotiating := false
var last_trade := ""
var last_item := ""
var desktop_ui: Control
var active := false
var refresh_time := 0.0

func setup(controller) -> void:
	desk = controller
	shell = desk.shell
	name = "PortraitCounter"
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	desktop_ui = Control.new()
	desktop_ui.name = "DesktopCounter"
	desktop_ui.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	desktop_ui.mouse_filter = Control.MOUSE_FILTER_IGNORE
	desk.add_child(desktop_ui)
	for child in desk.get_children():
		if child != self and child != desktop_ui and child is Control: child.reparent(desktop_ui)
	_build()
	_sync_layout()

func _picture(texture: Texture2D, height: float) -> TextureRect:
	var p := TextureRect.new()
	p.texture = texture
	p.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	p.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	p.custom_minimum_size.y = height
	p.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return p

func _key(text: String, action: Callable, kind := "secondary", icon := "") -> Button:
	var key := UIKit.button(text, kind, Vector2(0,48), 16, icon)
	PortraitSkin.button(key,kind == "primary")
	key.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	key.pressed.connect(action)
	return key

func _build() -> void:
	var backdrop := TextureRect.new()
	backdrop.texture = UIKit.tex("res://assets/scene/shop_pixel.png")
	backdrop.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	backdrop.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	backdrop.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	backdrop.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(backdrop)
	layout = UIKit.vbox(0)
	layout.name = "Layout"
	layout.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(layout)
	var header := UIKit.plate(PortraitSkin.panel("wine",10))
	header.name = "Header"
	layout.add_child(header)
	var head := UIKit.hbox(8)
	header.add_child(head)
	var brand := UIKit.vbox(2)
	brand.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	brand.add_child(UIKit.label("轨道旧货局", 23, UIKit.TEXT))
	day = UIKit.label("", 14, UIKit.AMBER)
	brand.add_child(day)
	head.add_child(brand)
	balance = UIKit.label("", 21, UIKit.AMBER)
	head.add_child(balance)
	var settings := _key("", func(): shell.open_settings(), "secondary", "settings")
	settings.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	settings.custom_minimum_size.x = 44
	settings.add_theme_constant_override("icon_max_width",26)
	settings.expand_icon = true
	head.add_child(settings)
	scroll = ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	layout.add_child(scroll)
	body = UIKit.vbox(6)
	body.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.add_child(body)
	var window_frame := UIKit.plate(PortraitSkin.panel("wine",14))
	body.add_child(window_frame)
	var window_row := UIKit.hbox(8)
	window_frame.add_child(window_row)
	visitor = _picture(null, 136)
	visitor.custom_minimum_size.x = 120
	visitor.size_flags_vertical = Control.SIZE_EXPAND_FILL
	window_row.add_child(visitor)
	var conversation := UIKit.vbox(8)
	conversation.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	conversation.alignment = BoxContainer.ALIGNMENT_CENTER
	window_row.add_child(conversation)
	visitor_name = UIKit.label("", 16, UIKit.AMBER, false, true)
	conversation.add_child(visitor_name)
	speech = UIKit.label("", 17, UIKit.TEXT, false, true)
	conversation.add_child(speech)
	var mat := UIKit.plate(PortraitSkin.panel("felt",14))
	body.add_child(mat)
	var mat_body := UIKit.vbox(4)
	mat.add_child(mat_body)
	var title_row := UIKit.hbox(6)
	item_name = UIKit.label("", 19, UIKit.TEXT)
	item_name.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	item_name.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	title_row.add_child(item_name)
	var flip := _key("翻面", func():
		flipped = not flipped
		_update_art(), "secondary", "flip")
	flip.size_flags_horizontal = Control.SIZE_SHRINK_END
	title_row.add_child(flip)
	mat_body.add_child(title_row)
	item_art = _picture(null, 152)
	mat_body.add_child(item_art)
	item_hint = UIKit.label("", 14, UIKit.MUTED, false, true)
	item_hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	mat_body.add_child(item_hint)
	inventory = UIKit.hbox(4)
	mat_body.add_child(inventory)
	tools = UIKit.hbox(6)
	mat_body.add_child(tools)
	for spec in [["放大镜","TOL-001"],["紫外灯","TOL-002"],["电子秤","TOL-005"]]:
		var id: String = spec[1]
		var button := _key(spec[0], func():
			shell.go("inspect")
			if shell.workspace_open(): shell.workspace_shell.page._set_tool(id))
		button.custom_minimum_size.y = 76
		button.tooltip_text = spec[0]
		button.text = ""
		_decorate_key(button,PortraitSkin.tool(id),spec[0],44)
		tools.add_child(button)
	var transaction := UIKit.plate(PortraitSkin.panel("wine",10))
	layout.add_child(transaction)
	var trade_body := UIKit.vbox(8)
	transaction.add_child(trade_body)
	price = UIKit.label("", 20, UIKit.AMBER, false, true)
	price.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	trade_body.add_child(price)
	quote_box = UIKit.hbox(8)
	trade_body.add_child(quote_box)
	quote_box.add_child(UIKit.label("我的报价",16))
	quote = SpinBox.new()
	quote.custom_minimum_size = Vector2(0,48)
	quote.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	quote.add_theme_font_size_override("font_size",22)
	quote.suffix = " Cr"
	quote.value_changed.connect(func(value): desk.dial.set_value(int(value)))
	quote_box.add_child(quote)
	primary = _key("", _primary, "primary")
	primary.custom_minimum_size.y = 56
	primary.add_theme_font_size_override("font_size",23)
	trade_body.add_child(primary)
	more = _key("更多交易操作", _actions)
	trade_body.add_child(more)
	var dock := UIKit.plate(PortraitSkin.panel("wine",10))
	layout.add_child(dock)
	var row := UIKit.hbox(4)
	dock.add_child(row)
	for spec in [["柜台","counter","counter"],["仓库","warehouse","warehouse"],["工作台","repair","repair"],["事务","tasks","orders"]]:
		var target: String = spec[1]
		var key := _key(spec[0], func():
			if target == "tasks": _tasks()
			else: shell.go(target), "primary" if target == "counter" else "secondary",spec[2])
		key.custom_minimum_size.y = 62
		key.icon = null
		key.tooltip_text = spec[0]
		key.text = ""
		_decorate_key(key,UIKit.icon(spec[2]),spec[0],26,target=="counter")
		row.add_child(key)

func _decorate_key(key: Button, icon: Texture2D, caption: String, height: float, dark := false) -> void:
	var stack := UIKit.vbox(2)
	stack.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	stack.offset_top = 6
	stack.offset_bottom = -5
	stack.mouse_filter = Control.MOUSE_FILTER_IGNORE
	stack.alignment = BoxContainer.ALIGNMENT_CENTER
	var picture := _picture(icon,height)
	stack.add_child(picture)
	var label := UIKit.label(caption,14,Color("382113") if dark else UIKit.TEXT)
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	stack.add_child(label)
	key.add_child(stack)

func _sync_layout() -> void:
	var next: bool = shell.portrait_mode()
	visible = next
	desktop_ui.visible = not next
	desk.back_root.visible = not next
	desk.stage_root.visible = not next
	active = next

func _process(delta: float) -> void:
	_sync_layout()
	if not active: return
	refresh_time += delta
	if refresh_time < 0.1: return
	refresh_time = 0.0
	_refresh()

func _update_art() -> void:
	var item = Model.trade_item(Game.state) if Game.state.trade != null else null
	item_art.texture = UIKit.physical_icon(item,flipped) if item != null else UIKit.icon("counter")

func _refresh() -> void:
	var s: Dictionary = Game.state
	var t = s.trade
	var item = Model.trade_item(s) if t != null else null
	var trade_id: String = str(t.id) if t != null else ""
	var uid: String = str(item.uid) if item != null else ""
	if trade_id != last_trade:
		negotiating = false
		last_trade = trade_id
	if uid != last_item:
		flipped = false
		last_item = uid
	_update_art()
	balance.text = "%s Cr" % Model.jnum(s.cash)
	day.text = "第 %02d 天 · %s · AP %s" % [s.day,"营业中" if s.phase == "open" else "已打烊",s.ap]
	visitor.texture = UIKit.npc_portrait(t.npcId) if t != null else null
	visitor_name.text = "%s · %s" % [GameData.npc(t.npcId).name,GameData.npc(t.npcId).title] if t != null else "服务铃 · 等候来客"
	var line: String = desk.bubble_label.get_parsed_text()
	speech.text = line if t != null and line != "" else "柜台已经准备好了。\n按响服务铃，接待下一位来客。"
	item_name.text = GameData.def(item.defId).name if item != null else "等候查验的旧物" if t == null else "请先挑选货物"
	item_hint.text = "已记录 %d 条物证 · 点击工具继续检验" % Model.evidence_count(item) if item != null else "仓储与维修各有独立工作页面"
	for key in tools.get_children():
		key.disabled = item == null or desk.busy
		key.modulate = Color(0.55,0.55,0.55) if key.disabled else Color.WHITE
	quote_box.visible = negotiating and t != null and not t.locked and item != null
	if quote_box.visible:
		quote.set_block_signals(true)
		quote.min_value = desk.dial.min_value
		quote.max_value = desk.dial.max_value
		if not quote.get_line_edit().has_focus(): quote.set_value_no_signal(desk.dial.value)
		quote.set_block_signals(false)
	price.text = "顾客%s %s Cr" % ["开价" if t.kind == "buy" else "出价", Model.jnum(t.price)] if t != null and item != null else desk.scr.line1.text
	primary.text = "开始议价" if t != null and item != null and not t.locked and not negotiating else "按铃接待来客"
	var buttons: Array = desk.actions.get_children()
	if t != null and (item == null or t.locked or negotiating):
		primary.text = buttons[0].text if not buttons.is_empty() else "等待顾客回应"
	elif t == null and not buttons.is_empty(): primary.text = buttons[0].text
	primary.disabled = desk.busy or desk._scene_blocked() or (not buttons.is_empty() and buttons[0].disabled)
	more.disabled = desk.busy
	more.text = "更多交易操作" if t != null else "店内事务与打烊"
	# Physical tabletop selection stays available for multi-item customers.
	var goods: Array = CounterDialogue.table_items(s) if CounterDialogue.active(s) else []
	var signature := str(goods.map(func(g): return g.get("uid", ""))) + uid
	if inventory.get_meta("goods", "") != signature:
		inventory.set_meta("goods",signature)
		UIKit.clear(inventory)
		for good in goods:
			var id: String = good.uid
			var b := _key(str(inventory.get_child_count()+1),func(): desk._focus_table(id),"primary" if id == uid else "secondary")
			b.icon = UIKit.physical_icon(TradeSession.item(s,id))
			b.expand_icon = true
			b.add_theme_constant_override("icon_max_width",24)
			inventory.add_child(b)
	inventory.visible = goods.size() > 1

func _primary() -> void:
	if desk.busy or desk._scene_blocked(): return
	var t = Game.state.trade
	if t != null and Model.trade_item(Game.state) != null and not t.locked and not negotiating:
		negotiating = true
		_refresh()
		return
	var buttons: Array = desk.actions.get_children()
	if not buttons.is_empty() and not buttons[0].disabled: buttons[0].pressed.emit()
	_refresh()

func _actions() -> void:
	var modal: Array = shell.modal("交易操作" if Game.state.trade != null else "柜台事务",360)
	for original in desk.actions.get_children():
		var ref: WeakRef = weakref(original)
		var b := _key(original.text,func():
			modal[1].call()
			call_deferred("_invoke",ref))
		b.disabled = original.disabled
		modal[0].add_child(b)

func _invoke(ref: WeakRef) -> void:
	# Closing tweens keep the modal alive briefly. Wait for its input boundary.
	await get_tree().create_timer(0.18).timeout
	var original = ref.get_ref()
	if is_instance_valid(original) and not original.disabled and not shell.modal_open(): original.pressed.emit()

func _tasks() -> void:
	var modal: Array = shell.modal("店内事务",360)
	for spec in [["委托订单","orders"],["营业账本 / 打烊","report"],["站内消息","events"],["经营手册","help"]]:
		var target: String = spec[1]
		modal[0].add_child(_key(spec[0],func():
			modal[1].call()
			if target == "events": shell.open_events()
			elif target == "help": shell.open_help()
			else: shell.go(target)))
