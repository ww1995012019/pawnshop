extends RefCounted
## Describe the current interaction layer using the same controls that own its actions.
var shell
var scope: Node
var companion_key: Control
var candidates: Array[Control] = []
var targets := {}
var dirty := true

func _init(owner_shell: Node) -> void:
	shell = owner_shell
	shell.get_tree().node_added.connect(_topology_changed)
	shell.get_tree().node_removed.connect(_topology_changed)

func _topology_changed(node: Node) -> void:
	if node is BaseButton or node is Range or node is LineEdit or node is Label or node is RichTextLabel:
		dirty = true

func _popup(viewport: Viewport) -> Window:
	for window in viewport.get_embedded_subwindows():
		if window is Popup and window.visible and not window.is_queued_for_deletion():
			return window
	return null

func active_scope() -> Node:
	var active: Node = shell.active_shell()
	var top: Node
	if shell.modal_open():
		top = shell.modal_layer.get_child(-1)
	elif active.modal_open():
		top = active.modal_layer.get_child(-1)
	var popup := _popup(top.get_viewport() if top != null else active.get_viewport())
	if popup != null and (top == null or top.is_ancestor_of(popup)):
		return popup
	if top != null:
		return top
	# The manual and wanted poster deliberately live outside the modal layer.
	for index in range(shell.root_ui.get_child_count() - 1, -1, -1):
		var paper: Node = shell.root_ui.get_child(index)
		if paper is FloatingDocument and paper.is_visible_in_tree() and not paper.is_queued_for_deletion():
			return paper
	if shell.workspace_open():
		return active.page
	if is_instance_valid(shell.title) and not shell.title.is_queued_for_deletion():
		return shell.title
	if shell.page.receipt_reading and is_instance_valid(shell.page.filed_receipt) and shell.page.filed_receipt.is_visible_in_tree():
		return shell.page.filed_receipt
	return shell.page

func _collect(node: Node, include_copy: bool) -> void:
	if node.is_queued_for_deletion() or node.has_meta("opens_web_reader") or (node is Viewport and node != scope):
		return
	if node is SpinBox:
		candidates.append(node.get_line_edit())
		return
	if node is Button or node is Slider or node is LineEdit:
		candidates.append(node)
		return
	if include_copy and (node is Label or node is RichTextLabel):
		candidates.append(node)
		return
	for child in node.get_children():
		_collect(child, include_copy)

func _caption(control: Control) -> String:
	if control.accessibility_name != "":
		return control.accessibility_name
	if control is Button and control.text.strip_edges() != "":
		return control.text.strip_edges()
	if control is LineEdit and control.placeholder_text != "":
		return control.placeholder_text
	return control.tooltip_text.strip_edges()

func _describe(control: Control) -> Dictionary:
	var caption := _caption(control)
	if caption.is_empty():
		return {}
	var item := {"id": str(control.get_instance_id()), "name": caption}
	if control is OptionButton:
		item.kind = "select"
		item.options = []
		for index in control.item_count:
			item.options.append({"name":control.get_item_text(index), "disabled":control.is_item_disabled(index) or control.is_item_separator(index)})
		item.value = control.selected
		item.disabled = control.disabled
	elif control is Button:
		item.kind = "button"
		item.disabled = control.disabled
		if control.toggle_mode:
			item.pressed = control.button_pressed
	elif control is Slider:
		item.merge({"kind":"range", "value":control.value, "min":control.min_value, "max":control.max_value, "step":control.step, "disabled":not control.editable})
	elif control is LineEdit:
		var numeric: bool = control.virtual_keyboard_type in [LineEdit.KEYBOARD_TYPE_NUMBER, LineEdit.KEYBOARD_TYPE_NUMBER_DECIMAL]
		var spin := control.get_parent() as SpinBox
		var raw: String = control.text
		if spin != null:
			# HTML number fields cannot display Godot's visible currency suffix.
			raw = raw.strip_edges().trim_prefix(spin.prefix).trim_suffix(spin.suffix).strip_edges()
			numeric = true
			item.step = spin.step
			if not spin.allow_lesser: item.min = spin.min_value
			if not spin.allow_greater: item.max = spin.max_value
		item.merge({"kind":"number" if numeric else "text", "value":raw, "disabled":not control.editable})
	else:
		return {}
	return item

func snapshot(status: Dictionary) -> Dictionary:
	var current := active_scope()
	var active: Node = shell.active_shell()
	var title := "柜台"
	var dialog := false
	if current is Popup:
		title = current.accessibility_name if current.accessibility_name != "" else "物品操作"
		dialog = true
	elif current is FloatingDocument or current == shell.page.filed_receipt or shell.modal_open() or active.modal_open():
		title = current.accessibility_name
		dialog = true
	elif shell.workspace_open():
		title = shell.WORKSPACE_LABELS.get(active.page_name, "工作台")
	elif current == shell.title:
		title = "轨道旧货局"
	if dirty or not is_instance_valid(scope) or current != scope:
		scope = current
		dirty = false
		candidates.clear()
		companion_key = null
		if current == shell.page.filed_receipt:
			companion_key = shell.page.receipt_tab
		elif shell.workspace_open() and current == active.page:
			companion_key = shell.workspace_close
		if is_instance_valid(companion_key): candidates.append(companion_key)
		_collect(scope, dialog or shell.workspace_open())
	var view := {"id": str(scope.get_instance_id()), "title": title, "dialog": dialog, "controls": [], "copy": []}
	targets.clear()
	if scope.is_queued_for_deletion() or scope.has_meta("closing") or (current == shell.page and status.busy):
		return view
	var owner: Control = scope.get_viewport().gui_get_focus_owner()
	for control in candidates:
		if not is_instance_valid(control) or control.is_queued_for_deletion() or not control.is_visible_in_tree():
			continue
		if control is Label or control is RichTextLabel:
			var words: String = control.get_parsed_text() if control is RichTextLabel else control.text
			words = words.strip_edges()
			if words != "" and words != title and not view.copy.has(words):
				view.copy.append(words)
			continue
		var item := _describe(control)
		if item.is_empty():
			continue
		targets[item.id] = control
		view.controls.append(item)
		if control == owner and control is LineEdit:
			view.editing = item.id
	return view

func interact(data: Dictionary) -> void:
	# A queued click from the previous sheet must not activate an obscured control.
	if not is_instance_valid(scope) or scope != active_scope() or scope.has_meta("closing"):
		return
	if data.get("dismiss", false) and str(data.get("id", "")) == str(scope.get_instance_id()):
		if scope is Popup:
			scope.hide()
		elif scope is FloatingDocument:
			scope.close_document()
		elif scope == shell.page.filed_receipt:
			shell.page.dismiss_context_menu()
		elif shell.modal_open():
			shell.close_top_modal()
		elif shell.active_shell().modal_open():
			shell.active_shell().close_top_modal()
		return
	var node = targets.get(str(data.get("id", "")))
	if not is_instance_valid(node) or node.is_queued_for_deletion() or not node.is_visible_in_tree():
		return
	if node != companion_key and not scope.is_ancestor_of(node):
		return
	if scope == shell.page and (shell.page.busy or shell.wanted_notice_blocked()):
		return
	var value = data.get("value")
	if node is OptionButton and not node.disabled and value is float:
		var index := int(value)
		if index >= 0 and index < node.item_count and not node.is_item_disabled(index) and not node.is_item_separator(index):
			node.select(index)
			node.item_selected.emit(index)
	elif node is Button and not node.disabled and not data.has("value"):
		if node.toggle_mode:
			node.button_pressed = not node.button_pressed
		node.pressed.emit()
	elif node is Slider and node.editable and value is float and is_finite(value):
		node.value = value
		node.drag_ended.emit(true)
	elif node is LineEdit and node.editable and value is String:
		node.text = value
		node.text_changed.emit(node.text)
		var spin := node.get_parent() as SpinBox
		if spin != null and value.is_valid_float():
			var amount := float(value)
			if is_finite(amount) and amount >= spin.min_value and amount <= spin.max_value:
				spin.apply()
