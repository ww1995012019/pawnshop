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
var actions: HFlowContainer
var _picture: TextureRect
var _name: Label
var _stock: Label
var _description: Label
var _quantity_label: Label
var _minus: Button
var _plus: Button
var _buy: Button
var _sell: Button
var _detail: PanelContainer

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
		var card := UIKit.button("", "secondary", Vector2(64, 64), 17)
		card.name = "material_" + material_id
		card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		card.tooltip_text = "%s\n%s" % [material.name, material.description]
		card.set_meta("merchant_focus", "material:" + material_id)
		focus_targets["material:" + material_id] = card
		var margin := MarginContainer.new()
		margin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		for side in ["left", "right", "top", "bottom"]:
			margin.add_theme_constant_override("margin_" + side, 3)
		var column := UIKit.vbox(4)
		margin.add_child(column)
		column.add_child(_icon(material_id, 36))
		var title := UIKit.label(material.name, 13, UIKit.TEXT)
		title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		title.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
		title.custom_minimum_size.x = 0
		title.hide()
		column.add_child(title)
		var counts := UIKit.label("×%d" % int(state.materials.get(material_id, 0)), 14, UIKit.TEXT)
		counts.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
		counts.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
		counts.custom_minimum_size.x = 0
		column.add_child(counts)
		card.add_child(margin)
		_ignore_pointer(margin)
		card.pressed.connect(func(): _select(material_id))
		_cards[material_id] = card
		_grid.add_child(card)
	var detail := UIKit.plate(UIKit.inset_style(4))
	_detail = detail
	detail.name = "material_detail"
	add_child(detail)
	var details := UIKit.vbox(4)
	detail.add_child(details)
	var heading := UIKit.hbox(12)
	details.add_child(heading)
	_picture = _icon(selected_id, 36)
	_picture.custom_minimum_size.x = 40
	_picture.hide()
	heading.add_child(_picture)
	var labels := UIKit.hbox(8)
	labels.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	heading.add_child(labels)
	_name = UIKit.label("", 17, UIKit.AMBER)
	labels.add_child(_name)
	_stock = UIKit.label("", 14, UIKit.TEXT, false, true)
	_stock.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	labels.add_child(_stock)
	_description = UIKit.label("", 14, UIKit.MUTED, false, true)
	_description.hide()
	details.add_child(_description)
	actions = HFlowContainer.new()
	actions.name = "merchant_material_actions"
	actions.add_theme_constant_override("h_separation", 10)
	actions.add_theme_constant_override("v_separation", 8)
	details.add_child(actions)
	var quantity_row := UIKit.hbox(6)
	actions.add_child(quantity_row)
	_minus = UIKit.button("−", "secondary", Vector2(40, 44), 20)
	_minus.custom_minimum_size.x = 44
	_minus.tooltip_text = "减少数量"
	_minus.set_meta("merchant_focus", "qty:minus")
	focus_targets["qty:minus"] = _minus
	_minus.pressed.connect(func(): _set_quantity(quantity - 1))
	quantity_row.add_child(_minus)
	_quantity_label = UIKit.label("", 20, UIKit.TEXT, true)
	_quantity_label.custom_minimum_size = Vector2(30, 0)
	quantity_row.add_child(_quantity_label)
	_plus = UIKit.button("+", "secondary", Vector2(40, 44), 20)
	_plus.custom_minimum_size.x = 44
	_plus.tooltip_text = "增加数量"
	_plus.set_meta("merchant_focus", "qty:plus")
	focus_targets["qty:plus"] = _plus
	_plus.pressed.connect(func(): _set_quantity(quantity + 1))
	quantity_row.add_child(_plus)
	_buy = UIKit.button("", "primary", Vector2(154, 44), 16)
	_buy.custom_minimum_size.x = 200
	_buy.pressed.connect(func(): transaction_requested.emit({"type": "BUY_MATERIAL", "id": selected_id, "qty": quantity}))
	actions.add_child(_buy)
	_sell = UIKit.button("", "secondary", Vector2(100, 44), 16)
	_sell.custom_minimum_size.x = 110
	_sell.pressed.connect(func(): transaction_requested.emit({"type": "SELL_MATERIAL", "id": selected_id, "qty": quantity}))
	actions.add_child(_sell)
	resized.connect(_layout_grid)
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

func _select(id: String) -> void:
	selected_id = id
	_refresh()
	selection_changed.emit(selected_id, quantity)
	var ancestor := get_parent()
	while ancestor != null:
		if ancestor is ScrollContainer:
			ancestor.ensure_control_visible(_detail)
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
	_stock.text = "商人库存 %d / 已持有 %d" % [available, owned]
	_description.text = material.description
	_detail.tooltip_text = material.name + "：" + material.description
	_picture.texture = _texture(selected_id)
	_quantity_label.text = str(quantity)
	_minus.disabled = quantity <= 1
	_plus.disabled = quantity >= 99
	for key in focus_targets.keys():
		if String(key).begins_with("buy:") or String(key).begins_with("sell:"): focus_targets.erase(key)
	_buy.set_meta("merchant_focus", "buy:" + selected_id)
	_sell.set_meta("merchant_focus", "sell:" + selected_id)
	focus_targets["buy:" + selected_id] = _buy
	focus_targets["sell:" + selected_id] = _sell
	_buy.text = "购买 %s · %s" % [material.name, UIKit.money(buy_total)]
	_sell.text = "出售 · %s" % UIKit.money(sell_total)
	# Mobile buttons clip their label by default; reserve the measured text width
	# so FlowContainer can wrap whole usable actions instead of shrinking them.
	for action in [_buy, _sell]:
		var font: Font = action.get_theme_font("font")
		var font_size: int = action.get_theme_font_size("font_size")
		var width := font.get_string_size(action.text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size).x
		action.custom_minimum_size.x = maxf(110, width + 20)
	var capacity_problem:=WarehouseExpansion.material_problem(_state,selected_id)
	_buy.disabled = available < quantity or _state.cash < buy_total or owned + quantity > 99999 or capacity_problem!=""
	_sell.disabled = owned < quantity or _state.cash + sell_total > 1000000000
	_buy.tooltip_text = "库存不足" if available < quantity else "现金不足" if _state.cash < buy_total else "材料库存已满" if owned + quantity > 99999 else "购买 %d 件，共 %s" % [quantity, UIKit.money(buy_total)]
	if capacity_problem!="":_buy.tooltip_text=capacity_problem
	_sell.tooltip_text = "持有数量不足" if owned < quantity else "现金已达到保存上限" if _state.cash + sell_total > 1000000000 else "出售 %d 件，共 %s" % [quantity, UIKit.money(sell_total)]
