extends Control
## Portrait presentation only: every trade action delegates to the real counter.
var desk
var shell
var layout: VBoxContainer
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
var quote: SpinBox
var tools: HBoxContainer
var goods_button: Button
var window_frame: PanelContainer
var flipped := false
var last_item := ""
var desktop_ui: Control
var active := false
var landscape: Control
var backdrop: TextureRect
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
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	_build()
	landscape = preload("res://scripts/ui/landscape_counter.gd").new()
	add_child(landscape)
	landscape.setup(self)
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
	if shell.landscape_mode():
		key.custom_minimum_size.y = 30
		key.add_theme_font_size_override("font_size",14)
	key.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	key.pressed.connect(action)
	return key

func _build() -> void:
	backdrop = TextureRect.new()
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
	body = UIKit.vbox(6)
	body.size_flags_vertical = Control.SIZE_EXPAND_FILL
	layout.add_child(body)
	window_frame = UIKit.plate(PortraitSkin.panel("wine",12))
	body.add_child(window_frame)
	var window_row := UIKit.hbox(8)
	window_frame.add_child(window_row)
	visitor = _picture(null, 80)
	visitor.custom_minimum_size.x = 100
	visitor.size_flags_vertical = Control.SIZE_EXPAND_FILL
	window_row.add_child(visitor)
	var conversation := UIKit.vbox(2)
	conversation.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	conversation.alignment = BoxContainer.ALIGNMENT_CENTER
	window_row.add_child(conversation)
	visitor_name = UIKit.label("",16,UIKit.AMBER)
	visitor_name.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	conversation.add_child(visitor_name)
	speech = UIKit.label("", 17, UIKit.TEXT, false, true)
	speech.max_lines_visible = 2
	speech.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	conversation.add_child(speech)
	conversation.add_child(UIKit.label("点此查看完整对话",13,UIKit.AMBER))
	var expand := Button.new()
	for state in ["normal","hover","pressed","disabled"]: expand.add_theme_stylebox_override(state,StyleBoxEmpty.new())
	expand.pressed.connect(_dialogue_popup)
	window_frame.add_child(expand)
	var mat := UIKit.plate(PortraitSkin.panel("felt",14))
	mat.size_flags_vertical = Control.SIZE_EXPAND_FILL
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
	item_art = _picture(null,0)
	item_art.size_flags_vertical = Control.SIZE_EXPAND_FILL
	item_art.mouse_filter = Control.MOUSE_FILTER_STOP
	item_art.gui_input.connect(func(event: InputEvent):
		if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
			_item_popup())
	mat_body.add_child(item_art)
	item_hint = UIKit.label("",14,UIKit.MUTED)
	item_hint.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	item_hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	mat_body.add_child(item_hint)
	tools = UIKit.hbox(6)
	mat_body.add_child(tools)
	tools.add_child(_key("鉴定工具",_tools_popup,"secondary","inspect"))
	goods_button = _key("选择货物",_goods_popup)
	tools.add_child(goods_button)
	var transaction := UIKit.plate(PortraitSkin.panel("wine",10))
	layout.add_child(transaction)
	var trade_body := UIKit.vbox(8)
	transaction.add_child(trade_body)
	price = UIKit.label("",20,UIKit.AMBER)
	price.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	price.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	trade_body.add_child(price)
	var trade_row := UIKit.hbox(6)
	trade_body.add_child(trade_row)
	primary = _key("",_primary,"primary")
	primary.custom_minimum_size.y = 56
	primary.clip_text = true
	primary.add_theme_font_size_override("font_size",22)
	trade_row.add_child(primary)
	more = _key("更多",_actions)
	more.size_flags_horizontal = Control.SIZE_SHRINK_END
	more.custom_minimum_size = Vector2(68,56)
	trade_row.add_child(more)
	var dock := UIKit.plate(PortraitSkin.panel("wine",6))
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
	var wide: bool = shell.landscape_mode()
	visible = next or wide
	layout.visible = next
	backdrop.visible = next
	desktop_ui.visible = not (next or wide)
	desk.back_root.visible = not next
	desk.stage_root.visible = not next
	landscape.set_active(wide)
	active = next or wide
	if next:
		# Only the illustration flexes; text and touch controls retain their size.
		window_frame.custom_minimum_size.y = clampf(get_viewport_rect().size.y*0.18,110,154)

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
	var uid: String = str(item.uid) if item != null else ""
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
	item_hint.text = "点实物查看详情 · 已有 %d 条物证" % Model.evidence_count(item) if item != null else "鉴定旧物 · 商议价格 · 经营柜台"
	if t != null and t.kind in ["buy", "sell"]:
		item_hint.text = "价格已谈妥 · 确认交割" if t.locked else ("鉴定 → 出价 · %d 条物证" % Model.evidence_count(item) if item != null else "选货 → 鉴定 → 出价")
	var robbed:bool=item!=null and load("res://scripts/model/robbery.gd").marked(s,item)
	if robbed:item_hint.text="本店被抢物品 · 可直接报警追回"
	item_hint.add_theme_color_override("font_color",UIKit.DANGER if robbed else UIKit.MUTED)
	tools.get_child(0).disabled = item == null or desk.busy
	if is_instance_valid(quote):
		quote.set_block_signals(true)
		quote.min_value = desk.dial.min_value
		quote.max_value = desk.dial.max_value
		if not quote.get_line_edit().has_focus(): quote.set_value_no_signal(desk.dial.value)
		quote.set_block_signals(false)
	price.text = "顾客%s %s Cr" % ["开价" if t.kind == "buy" else "出价", Model.jnum(t.price)] if t != null and item != null else desk.scr.line1.text
	if t != null and t.kind == "landlord":
		item_name.text = "本期店面租金"
		item_hint.text = "当面核对租金 · 付款后收好回执"
		item_art.texture = UIKit.icon("credits")
		price.text = "本期租金已结清" if Landlord.outstanding(s)==0 else "本期应交 %d Cr" % Landlord.outstanding(s)
	primary.text = "开始议价" if is_instance_valid(desk.offer_button) else "按铃接待来客"
	var buttons: Array = desk.actions.get_children()
	if t != null and (item == null or t.locked or not is_instance_valid(desk.offer_button)):
		primary.text = buttons[0].text if not buttons.is_empty() else "等待顾客回应"
	elif t == null and not buttons.is_empty(): primary.text = buttons[0].text
	if t != null and t.locked: primary.text = "确认交割"
	primary.tooltip_text = ""
	primary.disabled = desk.busy or desk._scene_blocked() or (not buttons.is_empty() and buttons[0].disabled)
	more.disabled = desk.busy
	more.text = "更多"
	var goods: Array = CounterDialogue.table_items(s) if CounterDialogue.active(s) else []
	goods_button.text = "货物 · %d 件" % goods.size()
	goods_button.visible = goods.size() > 1

func _primary() -> void:
	if desk.busy or desk._scene_blocked(): return
	var t = Game.state.trade
	if t != null and not t.locked and is_instance_valid(desk.offer_button):
		_quote_popup()
		return
	var buttons: Array = desk.actions.get_children()
	if not buttons.is_empty() and not buttons[0].disabled: buttons[0].pressed.emit()
	_refresh()

func _dialogue_popup() -> void:
	var modal: Array = shell.modal("顾客对话",360)
	modal[0].add_child(UIKit.label(visitor_name.text,20,UIKit.AMBER,false,true))
	modal[0].add_child(UIKit.label(desk.bubble_label.get_parsed_text() if Game.state.trade != null else speech.text,19,UIKit.TEXT,false,true))

func _item_popup() -> void:
	var item = Model.trade_item(Game.state) if Game.state.trade != null else null
	if item == null: return
	var modal: Array = shell.modal("物品详情",360)
	modal[0].add_child(UIKit.label(GameData.def(item.defId).name,22,UIKit.AMBER,false,true))
	modal[0].add_child(_picture(UIKit.physical_icon(item,flipped),220))
	modal[0].add_child(UIKit.label(Model.appraisal_text(item),18,UIKit.TEXT,false,true))
	modal[0].add_child(UIKit.label(GameData.def(item.defId).description,18,UIKit.TEXT,false,true))

func _tools_popup() -> void:
	var modal: Array = shell.modal("鉴定工具",360)
	var row := UIKit.hbox(6)
	modal[0].add_child(row)
	for spec in [["放大镜","TOL-001"],["紫外灯","TOL-002"],["电子秤","TOL-005"]]:
		var id: String = spec[1]
		var key := _key("",func():
			modal[1].call()
			_open_instrument.call_deferred(id))
		key.tooltip_text = spec[0]
		key.custom_minimum_size.y = 88
		_decorate_key(key,PortraitSkin.tool(id),spec[0],48)
		row.add_child(key)

func _open_instrument(id: String) -> void:
	if not await _wait_for_sheet_close() or desk.busy: return
	desk._open_instrument("inspect")
	if shell.workspace_open(): shell.workspace_shell.page._set_tool(id)

func _goods_popup() -> void:
	var modal: Array = shell.modal("柜台货物 / 店内库存",520)
	var table_grid := UIKit.grid(4 if shell.landscape_mode() else 3,6)
	table_grid.name = "table_goods_grid"
	modal[0].add_child(table_grid)
	for good in CounterDialogue.table_items(Game.state):
		var uid: String = good.uid
		var item = TradeSession.item(Game.state,uid)
		if item == null: continue
		var key := _key(GameData.def(item.defId).name,func():
			modal[1].call()
			desk._focus_table(uid))
		key.name = "table_good_"+uid
		_goods_tile(key,UIKit.physical_icon(item),GameData.def(item.defId).name)
		table_grid.add_child(key)

	modal[0].add_child(UIKit.label("店内库存 · 点击推荐 / 查看",14,UIKit.AMBER))
	var stock := UIKit.grid(4 if shell.landscape_mode() else 3,6)
	stock.name = "stock_goods_grid"
	modal[0].add_child(stock)
	for original in desk.stock_grid.get_children():
		if not original is Button or not (String(original.name).begins_with("stock_recommend_") or original.name == "wanted_inventory"): continue
		var ref: WeakRef = weakref(original)
		var key := _key(original.tooltip_text.get_slice("\n",0),func():
			modal[1].call()
			_invoke.call_deferred(ref))
		key.name = "mobile_"+String(original.name)
		key.disabled = original.disabled
		_goods_tile(key,original.icon,original.tooltip_text.get_slice("\n",0))
		stock.add_child(key)

func _goods_tile(key: Button, texture: Texture2D, caption: String) -> void:
	key.tooltip_text = caption
	key.text = ""
	key.custom_minimum_size = Vector2(0,92)
	var stack := UIKit.vbox(2)
	stack.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	stack.offset_left = 5
	stack.offset_right = -5
	stack.offset_top = 5
	stack.offset_bottom = -5
	stack.mouse_filter = Control.MOUSE_FILTER_IGNORE
	stack.add_child(_picture(texture,44))
	var title := UIKit.label(caption,12,UIKit.TEXT,false,true)
	title.name = "TileCaption"
	title.max_lines_visible = 2
	title.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.mouse_filter = Control.MOUSE_FILTER_IGNORE
	stack.add_child(title)
	key.add_child(stack)

func _quote_popup() -> void:
	var modal: Array = shell.modal("议价",360)
	modal[0].add_child(UIKit.label(price.text,22,UIKit.AMBER,false,true))
	modal[0].add_child(UIKit.label("我的报价",17,UIKit.TEXT))
	quote = SpinBox.new()
	quote.min_value = desk.dial.min_value
	quote.max_value = desk.dial.max_value
	quote.set_value_no_signal(desk.dial.value)
	quote.custom_minimum_size.y = 34 if shell.landscape_mode() else 56
	quote.name = "mobile_quote"
	quote.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	quote.get_line_edit().virtual_keyboard_type = LineEdit.KEYBOARD_TYPE_NUMBER
	quote.suffix = " Cr"
	quote.get_line_edit().add_theme_font_size_override("font_size",17 if shell.landscape_mode() else 24)
	var quote_row := UIKit.hbox(4)
	modal[0].add_child(quote_row)
	for step in [-5,-1,0,1,5]:
		if step == 0:
			quote_row.add_child(quote)
			continue
		var amount: int = step
		var nudge := _key(("+" if step>0 else "−") + str(absi(step)),func():
			quote.apply()
			quote.value += amount)
		nudge.name = "quote_step_"+str(step)
		nudge.custom_minimum_size = Vector2(36,34)
		nudge.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
		quote_row.add_child(nudge)
	var original_item = Model.trade_item(Game.state)
	if original_item != null:
		var evidence_row := HFlowContainer.new()
		evidence_row.name = "MobileEvidenceChoices"
		evidence_row.add_theme_constant_override("h_separation",4)
		evidence_row.add_theme_constant_override("v_separation",4)
		var evidence_hint := UIKit.label("证据随下一次出价提交",12,UIKit.MUTED)
		evidence_hint.name = "MobileEvidenceSelectionHint"
		var evidence_uid: String = original_item.uid
		for tool in original_item.evidence:
			if not GameData.relevant_tool(original_item.defId,tool): continue
			var tool_id: String = tool
			var caption: String = GameData.evidence_short(original_item.defId,tool_id)
			var evidence_key := UIKit.button(caption,"chip",Vector2(0,30 if shell.landscape_mode() else 36),14)
			evidence_key.name = "mobile_evidence_" + tool_id
			evidence_key.set_meta("evidence_tool",tool_id)
			evidence_key.set_meta("evidence_caption",caption)
			evidence_key.toggle_mode = true
			evidence_key.pressed.connect(func():
				var current = Model.trade_item(Game.state)
				if current == null or current.uid != evidence_uid: return
				desk.chosen_evidence = "" if desk.chosen_evidence == tool_id else tool_id
				desk.chosen_evidence_uid = evidence_uid
				desk._sync_evidence_selection()
				_sync_quote_evidence(evidence_row,evidence_hint))
			evidence_row.add_child(evidence_key)
		if evidence_row.get_child_count() > 0:
			modal[0].add_child(evidence_row)
			modal[0].add_child(evidence_hint)
			_sync_quote_evidence(evidence_row,evidence_hint)
		else:
			# Empty evidence controls never enter the tree and therefore do not
			# inherit the modal's cleanup when a new arrival has no readings.
			evidence_row.free()
			evidence_hint.free()
	var buttons: Array = desk.actions.get_children()
	for original in buttons:
		if original != desk.offer_button and not String(original.text).begins_with("接受 "): continue
		var ref: WeakRef = weakref(original)
		var key := _key(original.text,func():
			quote.apply()
			modal[1].call()
			_invoke.call_deferred(ref),"primary" if original == desk.offer_button else "secondary")
		key.disabled = original.disabled
		modal[0].add_child(key)
		if original == desk.offer_button:
			var preview: WeakRef = weakref(key)
			quote.value_changed.connect(func(value):
				desk.dial.set_value(int(value),false)
				desk._update_offer_value(desk.dial.value)
				if is_instance_valid(preview.get_ref()): preview.get_ref().text = "出价 " + UIKit.money(value))

func _sync_quote_evidence(row: HFlowContainer, hint: Label) -> void:
	var selected_caption := ""
	for child in row.get_children():
		if not child is Button: continue
		var selected: bool = String(child.get_meta("evidence_tool","")) == desk.chosen_evidence
		var caption: String = child.get_meta("evidence_caption","")
		child.set_pressed_no_signal(selected)
		child.text = ("✓ " if selected else "") + caption
		child.tooltip_text = "已选 · 证据随下一次出价提交" if selected else "随下一次出价提交；再次点击可取消"
		if selected: selected_caption = caption
	hint.text = "证据随下一次出价提交" + (" · 已选" + selected_caption if selected_caption != "" else "")

func _actions() -> void:
	var modal: Array = shell.modal("交易操作" if Game.state.trade != null else "柜台事务",360)
	for original in desk.actions.get_children():
		var ref: WeakRef = weakref(original)
		var b := _key(original.text,func():
			modal[1].call()
			call_deferred("_invoke",ref))
		b.disabled = original.disabled
		modal[0].add_child(b)

	if is_instance_valid(desk.alarm_button):
		var alarm_ref: WeakRef = weakref(desk.alarm_button)
		var alarm := _key(desk.alarm_button.text,func():
			modal[1].call()
			_invoke.call_deferred(alarm_ref))
		alarm.name = "mobile_alarm_button"
		alarm.disabled = desk.alarm_button.disabled
		modal[0].add_child(alarm)
	modal[0].add_child(_key("选择货物 / 推荐库存",func():
		modal[1].call()
		_open_goods_after_close.call_deferred()))
	modal[0].add_child(_key("成交回执",func():
		modal[1].call()
		_open_shop_plan_after_close.call_deferred("history")))

func _open_shop_plan_after_close(tab: String = "") -> void:
	if await _wait_for_sheet_close():
		if tab == "": shell.open_shop_plan()
		else: shell.open_shop_plan(tab)

func _open_goods_after_close() -> void:
	if await _wait_for_sheet_close(): _goods_popup()

func _wait_for_sheet_close() -> bool:
	# Queue the chosen action behind the real close boundary, including slow
	# rendering frames. A different, newly opened sheet cancels this choice.
	while shell.modal_open():
		for dim in shell.modal_layer.get_children():
			if not dim.get_meta("closing",false): return false
		await get_tree().process_frame
	return true

func _invoke(ref: WeakRef) -> void:
	if not await _wait_for_sheet_close(): return
	var original = ref.get_ref()
	if is_instance_valid(original) and not original.disabled: original.pressed.emit()

func _tasks() -> void:
	var modal: Array = shell.modal("店内事务",360)
	for spec in [["经营计划","shop_plan"],["事件簿","stories"],["成交回执","history"],["委托订单","orders"],["营业账本 / 打烊","report"],["站内消息","events"],["经营手册","help"]]:
		var target: String = spec[1]
		modal[0].add_child(_key(spec[0],func():
			modal[1].call()
			if target in ["shop_plan","history"]: _open_shop_plan_after_close.call_deferred("history" if target == "history" else "")
			elif target == "stories": shell._open_story_book_after_close.call_deferred()
			elif target == "events": shell.open_events()
			elif target == "help": shell.open_help()
			else: shell.go(target)))
