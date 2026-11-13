extends VBoxContainer
const Commerce = preload("res://scripts/model/commerce.gd")
## Selection is local UI state. Only the separate action requests a transfer.
signal selection_changed(uid: String)
signal transaction_requested(action: Dictionary)
var focus_targets := {}
var selected_uid := ""
var actions: HBoxContainer
var _state: Dictionary
var _items := {}
var _cards := {}
var _grid: GridContainer
var _detail: Label
var _sell: Button
func setup(state: Dictionary, uid: String) -> void:
	_state = state
	selected_uid = uid
	add_theme_constant_override("separation", 8)
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_detail = UIKit.label("", 16, UIKit.TEXT, false, true)
	_detail.name = "merchant_watch_detail"
	add_child(_detail)
	actions = UIKit.hbox(6)
	actions.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_sell = UIKit.button("出售所选", "primary", Vector2(180,44), 16)
	_sell.custom_minimum_size.x = 240
	_sell.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_sell.name = "merchant_sell_selected"
	_sell.pressed.connect(func(): transaction_requested.emit({"type":"SELL_MERCHANT_ITEM", "uid":selected_uid}))
	actions.add_child(_sell)
	add_child(actions)
	_grid = UIKit.grid(4,6)
	_grid.name = "merchant_watch_grid"
	_grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	add_child(_grid)
	for item in state.inventory:
		if item.owner != "shop" or item.has("orderId") or item.sealed or item.location == "isolation" or not item.sourceVerified: continue
		var item_uid: String = item.uid
		_items[item_uid] = item
		var card := UIKit.button("", "secondary", Vector2(76,88),13)
		card.name = "merchant_watch_" + item_uid
		card.tooltip_text = WatchForgery.sale_name(item) + "\n选择查看报价"
		card.set_meta("merchant_focus", "item:" + item_uid)
		focus_targets["item:" + item_uid] = card
		var column := UIKit.vbox(2)
		column.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		var picture := TextureRect.new()
		picture.texture = UIKit.physical_icon(item)
		picture.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		picture.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		picture.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		picture.custom_minimum_size = Vector2(70,60)
		column.add_child(picture)
		var label := UIKit.label(String(GameData.def(item.defId).name).left(5),12,UIKit.TEXT)
		label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		column.add_child(label)
		card.add_child(column)
		_ignore_pointer(column)
		card.pressed.connect(func():
			selected_uid = item_uid
			_refresh()
			selection_changed.emit(selected_uid)
			_reveal_detail())
		_cards[item_uid] = card
		_grid.add_child(card)
	if not _items.has(selected_uid): selected_uid = String(_items.keys()[0]) if not _items.is_empty() else ""
	resized.connect(_layout_grid)
	_refresh()
	call_deferred("_layout_grid")
func _ignore_pointer(control: Control) -> void:
	control.mouse_filter = Control.MOUSE_FILTER_IGNORE
	for child in control.get_children():
		if child is Control: _ignore_pointer(child)
func _layout_grid() -> void:
	_grid.columns = clampi(floori((maxf(size.x,76) + 6) / 82),1,10)
func _refresh() -> void:
	for key in focus_targets.keys():
		if String(key).begins_with("sell-item:"): focus_targets.erase(key)
	if selected_uid == "":
		_detail.text = "没有可回收的自有货物。"
		_sell.disabled = true
		return
	var item: Dictionary = _items[selected_uid]
	var modified: bool = not WatchForgery.summary(item).is_empty() or not item.get("refurbishment",{}).get("done",[]).is_empty()
	var status := "已加工 / 改装" if modified else "原样"
	var price: int = Commerce.recovery_price(_state,item)
	_detail.text = "%s\n%s · 报价 %s · 1 AP" % [WatchForgery.sale_name(item),status,UIKit.money(price)]
	_sell.text = "出售所选 · %s · 1 AP" % UIKit.money(price)
	_sell.set_meta("merchant_focus", "sell-item:" + selected_uid)
	focus_targets["sell-item:" + selected_uid] = _sell
	_sell.disabled = _state.ap < 1 or Commerce.forgery_rejected(_state,item) or _state.cash + price > 1000000000
	_sell.tooltip_text = "本轮商人已识破这只表的加工。" if Commerce.forgery_rejected(_state,item) else "行动点不足" if _state.ap < 1 else "现金已达到保存上限" if _state.cash + price > 1000000000 else "出售所选手表"
	for uid in _cards:
		for state in ["normal","hover","pressed"]:
			_cards[uid].add_theme_stylebox_override(state,UIKit.key_style("primary" if uid == selected_uid else "secondary",state,true))

func _reveal_detail() -> void:
	var ancestor := get_parent()
	while ancestor != null:
		if ancestor is ScrollContainer:
			ancestor.ensure_control_visible(_detail)
			return
		ancestor = ancestor.get_parent()
