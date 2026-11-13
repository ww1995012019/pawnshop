extends VBoxContainer
## Compact material selection; all transfers still go through Commerce.reduce.

signal selection_changed(id: String, quantity: int)
signal transaction_requested(action: Dictionary)

var selected_id := "MAT-001"
var quantity := 1
var focus_targets := {}
var _state: Dictionary
var _cards := {}
var _grid: GridContainer
var actions: VBoxContainer
var _name: Label
var _stock: Label
var _operations: BoxContainer
var _quantity_group: BoxContainer
var _buy_unit: Label
var _sell_unit: Label
var _quantity_label: Label
var _minus: Button
var _plus: Button
var _buy: Button
var _sell: Button
var _detail: Control

func setup(state: Dictionary, id: String, qty: int) -> void:
	_state = state
	selected_id = id if not GameData.material(id).is_empty() else "MAT-001"
	quantity = clampi(qty, 1, 99)
	add_theme_constant_override("separation", 12)
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_grid = GridContainer.new()
	_grid.name = "material_grid"
	_grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_grid.add_theme_constant_override("h_separation", 6)
	_grid.add_theme_constant_override("v_separation", 6)
	add_child(_grid)
	for material in GameData.materials:
		var material_id: String = material.id
		var card := UIKit.button("", "secondary", Vector2(64, 82), 17)
		card.name = "material_" + material_id
		card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		card.tooltip_text = "%s\n%s" % [material.name, material.description]
		card.set_meta("merchant_focus", "material:" + material_id)
		focus_targets["material:" + material_id] = card
		var margin := MarginContainer.new()
		margin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		for side in ["left", "right", "top", "bottom"]:
			margin.add_theme_constant_override("margin_" + side, 3)
		var column := UIKit.vbox(0)
		margin.add_child(column)
		column.add_child(_icon(material_id, 32))
		var title := UIKit.label(String(material.name).trim_prefix("匹配"), 12, UIKit.TEXT)
		title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		title.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
		title.custom_minimum_size.x = 0
		column.add_child(title)
		var counts := UIKit.label("持有 %d" % int(state.materials.get(material_id, 0)), 12, UIKit.MUTED)
		counts.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		counts.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
		counts.custom_minimum_size.x = 0
		column.add_child(counts)
		card.add_child(margin)
		_ignore_pointer(margin)
		card.pressed.connect(func(): _select(material_id))
		_cards[material_id] = card
		_grid.add_child(card)
	# The summary travels with the transaction controls into the phone footer.
	# Keep one flat section instead of nesting another framed panel.
	actions = UIKit.vbox(8)
	actions.name = "merchant_material_actions"
	actions.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_detail = actions
	add_child(actions)
	actions.add_child(UIKit.rule())
	var heading := UIKit.hbox(12)
	actions.add_child(heading)
	_name = UIKit.label("", 17, UIKit.AMBER)
	heading.add_child(_name)
	_stock = UIKit.label("", 13, UIKit.MUTED, false, true)
	_stock.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_stock.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	_stock.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	heading.add_child(_stock)
	_operations = BoxContainer.new()
	_operations.add_theme_constant_override("separation", 12)
	actions.add_child(_operations)
	_quantity_group = BoxContainer.new()
	_quantity_group.add_theme_constant_override("separation", 4)
	_quantity_group.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_operations.add_child(_quantity_group)
	var quantity_title := UIKit.label("交易数量", 12, UIKit.MUTED)
	quantity_title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_quantity_group.add_child(quantity_title)
	var quantity_row := UIKit.hbox(6)
	_quantity_group.add_child(quantity_row)
	_minus = UIKit.button("−", "secondary", Vector2(40, 44), 20)
	_minus.custom_minimum_size.x = 44
	_minus.tooltip_text = "减少数量"
	_minus.set_meta("merchant_focus", "qty:minus")
	focus_targets["qty:minus"] = _minus
	_minus.pressed.connect(func(): _set_quantity(quantity - 1))
	quantity_row.add_child(_minus)
	_quantity_label = UIKit.label("", 20, UIKit.TEXT, true)
	_quantity_label.custom_minimum_size = Vector2(30, 0)
	_quantity_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_quantity_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	_quantity_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	quantity_row.add_child(_quantity_label)
	_plus = UIKit.button("+", "secondary", Vector2(40, 44), 20)
	_plus.custom_minimum_size.x = 44
	_plus.tooltip_text = "增加数量"
	_plus.set_meta("merchant_focus", "qty:plus")
	focus_targets["qty:plus"] = _plus
	_plus.pressed.connect(func(): _set_quantity(quantity + 1))
	quantity_row.add_child(_plus)
	var trades := UIKit.hbox(8)
	trades.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	trades.size_flags_stretch_ratio = 2.5
	_operations.add_child(trades)
	var buying := UIKit.vbox(4)
	buying.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	trades.add_child(buying)
	_buy_unit = UIKit.label("", 12, UIKit.MUTED)
	buying.add_child(_buy_unit)
	_buy = UIKit.button("", "primary", Vector2(110, 44), 16)
	_buy.name = "material_buy"
	_buy.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_buy.pressed.connect(func(): transaction_requested.emit({"type": "BUY_MATERIAL", "id": selected_id, "qty": quantity}))
	buying.add_child(_buy)
	var selling := UIKit.vbox(4)
	selling.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	trades.add_child(selling)
	_sell_unit = UIKit.label("", 12, UIKit.MUTED)
	selling.add_child(_sell_unit)
	_sell = UIKit.button("", "secondary", Vector2(110, 44), 16)
	_sell.name = "material_sell"
	_sell.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_sell.pressed.connect(func(): transaction_requested.emit({"type": "SELL_MATERIAL", "id": selected_id, "qty": quantity}))
	selling.add_child(_sell)
	resized.connect(_layout_grid)
	actions.resized.connect(_layout_grid)
	get_viewport().size_changed.connect(_layout_grid)
	_refresh()
	call_deferred("_layout_grid")

func _icon(id: String, height: float) -> TextureRect:
	var picture := TextureRect.new()
	picture.texture = _texture(id)
	picture.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	picture.custom_minimum_size = Vector2(0, height)
	picture.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	picture.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	return picture

func _texture(id: String) -> AtlasTexture:
	var index := clampi(int(id.trim_prefix("MAT-")) - 1, 0, 12)
	var texture := AtlasTexture.new()
	texture.atlas = UIKit.tex("res://assets/ui/materials.png")
	var cell := texture.atlas.get_size() / 4.0
	texture.region = Rect2(Vector2(index % 4, index / 4) * cell, cell)
	return texture

func _ignore_pointer(node: Control) -> void:
	node.mouse_filter = Control.MOUSE_FILTER_IGNORE
	for child in node.get_children():
		if child is Control: _ignore_pointer(child)

func _layout_grid() -> void:
	if not is_inside_tree(): return
	var width := maxf(64.0, size.x)
	_grid.columns = clampi(floori((width + 6.0) / 70.0), 1, 7)
	var narrow := actions.size.x < 520
	_operations.vertical = narrow
	_quantity_group.vertical = not narrow

func _select(id: String) -> void:
	selected_id = id
	_refresh()
	selection_changed.emit(selected_id, quantity)
	var ancestor := get_parent()
	while ancestor != null:
		if ancestor is ScrollContainer:
			if ancestor.is_ancestor_of(_detail): ancestor.ensure_control_visible(_detail)
			break
		ancestor = ancestor.get_parent()

func _set_quantity(value: int) -> void:
	quantity = clampi(value, 1, 99)
	_refresh()
	selection_changed.emit(selected_id, quantity)

func _refresh() -> void:
	var material := GameData.material(selected_id)
	var available := int(_state.trade.stock.get(selected_id, 0))
	var owned := int(_state.materials.get(selected_id, 0))
	var buy_total := int(material.price) * quantity
	var sell_total := maxi(1, floori(float(material.price) * 0.5)) * quantity
	for id in _cards:
		var card: Button = _cards[id]
		for state in ["normal", "hover", "pressed"]:
			card.add_theme_stylebox_override(state, UIKit.key_style("primary" if id == selected_id else "secondary", state, true))
	_name.text = material.name
	_stock.text = "商人剩余 %d · 自己持有 %d" % [available, owned]
	_detail.tooltip_text = material.name + "：" + material.description
	_quantity_label.text = str(quantity)
	_minus.disabled = quantity <= 1
	_plus.disabled = quantity >= 99
	for key in focus_targets.keys():
		if String(key).begins_with("buy:") or String(key).begins_with("sell:"): focus_targets.erase(key)
	_buy.set_meta("merchant_focus", "buy:" + selected_id)
	_sell.set_meta("merchant_focus", "sell:" + selected_id)
	focus_targets["buy:" + selected_id] = _buy
	focus_targets["sell:" + selected_id] = _sell
	_buy_unit.text = "买入单价 %s" % UIKit.money(material.price)
	_sell_unit.text = "卖出单价 %s" % UIKit.money(maxi(1, floori(float(material.price) * 0.5)))
	_buy.text = "购买 · %s" % UIKit.money(buy_total)
	_sell.text = "出售 · %s" % UIKit.money(sell_total)
	# Reserve the measured label width even when phone buttons clip their text.
	for action in [_buy, _sell]:
		var font: Font = action.get_theme_font("font")
		var font_size: int = action.get_theme_font_size("font_size")
		var width := font.get_string_size(action.text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size).x
		action.custom_minimum_size.x = maxf(110, width + 20)
	var capacity_problem:=WarehouseExpansion.material_problem(_state,selected_id)
	_buy.disabled = available < quantity or _state.cash < buy_total or owned + quantity > 99999 or capacity_problem!=""
	_sell.disabled = owned < quantity or _state.cash + sell_total > 1000000000
	_buy.tooltip_text = "库存不足" if available < quantity else "现金不足" if _state.cash < buy_total else "材料库存已满" if owned + quantity > 99999 else "数量 %d，共 %s" % [quantity, UIKit.money(buy_total)]
	if capacity_problem!="":_buy.tooltip_text=capacity_problem
	_buy.tooltip_text = "购买 %s\n%s" % [material.name, _buy.tooltip_text]
	_sell.tooltip_text = "持有数量不足" if owned < quantity else "现金已达到保存上限" if _state.cash + sell_total > 1000000000 else "出售 %d 件，共 %s" % [quantity, UIKit.money(sell_total)]
