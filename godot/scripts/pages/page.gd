class_name Page
extends Control
## Base for one screen: UI lives in this Control; world nodes it adds to the
## shell's layers are freed when the page is left.

var shell
var world_nodes: Array[Node] = []
var _layout_pending := false
var portrait_tabs: HBoxContainer
var portrait_section := 0

func _init() -> void:
	set_anchors_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_IGNORE

func scene_name() -> String:
	return "counter"

func hint_text() -> String:
	return ""

func add_world(n: Node, layer_name := "fg") -> Node:
	shell.layer(layer_name).add_child(n)
	world_nodes.append(n)
	return n

func enter() -> void:
	pass

func relayout() -> void:
	pass

func queue_relayout() -> void:
	if not _layout_pending:
		_layout_pending = true
		call_deferred("_settle_layout")

func _settle_layout() -> void:
	_layout_pending = false
	relayout()

## One set of edges for the rack, item surface and detail column. The shelf
## takes only the height its current instrument controls require.
func layout_workbench(left: Control, right: Control, bench: Control, left_width: float, right_width := 470.0) -> Rect2:
	var r: Rect2 = shell.content_rect()
	if shell.mobile_mode():
		if not is_instance_valid(portrait_tabs):
			if shell.landscape_mode(): portrait_section = 1
			portrait_tabs = UIKit.hbox(4)
			add_child(portrait_tabs)
			for i in 3:
				var key := UIKit.button(["选择工序","操作实物","物品档案"][i],"secondary",Vector2(0,48),16)
				key.size_flags_horizontal = Control.SIZE_EXPAND_FILL
				key.pressed.connect(func():
					if has_method("can_close_workspace") and not call("can_close_workspace"): return
					portrait_section=i;relayout())
				portrait_tabs.add_child(key)
		portrait_tabs.show()
		portrait_tabs.position = r.position
		var tabs_height := 34.0 if shell.landscape_mode() else 48.0
		portrait_tabs.size = Vector2(r.size.x,tabs_height)
		var offset := tabs_height+6.0
		var area := Rect2(r.position+Vector2(0,offset),r.size-Vector2(0,offset))
		for panel in [left,right]:
			panel.position = area.position
			panel.size = area.size
		left.visible = portrait_section == 0
		right.visible = portrait_section == 2
		bench.visible = portrait_section == 1
		for node in world_nodes:
			if is_instance_valid(node) and node is CanvasItem: node.visible = portrait_section == 1
		for i in 3:
			portrait_tabs.get_child(i).custom_minimum_size.y = tabs_height
			portrait_tabs.get_child(i).add_theme_font_size_override("font_size",14 if shell.landscape_mode() else 16)
			portrait_tabs.get_child(i).add_theme_stylebox_override("normal",UIKit.key_style("primary" if i==portrait_section else "secondary","normal"))
		var height := maxf(52 if shell.landscape_mode() else 100,bench.get_combined_minimum_size().y)
		bench.position = Vector2(area.position.x,area.end.y-height)
		bench.size = Vector2(area.size.x,height)
		var mat := Rect2(area.position,Vector2(area.size.x,area.size.y-height-8))
		shell.work_surface.set_mat(mat)
		return mat
	if is_instance_valid(portrait_tabs):
		portrait_tabs.hide()
		left.show()
		right.show()
		bench.show()
		for node in world_nodes:
			if is_instance_valid(node) and node is CanvasItem: node.show()
	var gap := 20.0
	left.position = r.position
	left.size = Vector2(left_width, r.size.y)
	right.position = Vector2(r.end.x - right_width, r.position.y)
	right.size = Vector2(right_width, r.size.y)
	var middle := Rect2(r.position.x + left_width + gap, r.position.y, r.size.x - left_width - right_width - gap * 2, r.size.y)
	bench.size.x = middle.size.x
	var height := maxf(84.0, bench.get_combined_minimum_size().y)
	bench.size = Vector2(middle.size.x, height)
	bench.position = Vector2(middle.position.x, middle.end.y - height)
	var mat := Rect2(middle.position, Vector2(middle.size.x, middle.size.y - height - gap))
	shell.work_surface.set_mat(mat)
	return mat

## Fit the complete sprite, including unusually wide goods, inside the mat.
func fit_workbench_item(item: ItemSprite, mat: Rect2) -> Vector2:
	var footprint := item.tex_size()
	var margin := 28.0 if shell.landscape_mode() else 100.0
	var height := maxf(20,minf(360.0, minf(mat.size.y - margin, (mat.size.x - 80.0 if shell.landscape_mode() else mat.size.x - 144.0) * footprint.y / footprint.x)))
	var scale := height / footprint.y
	if not is_equal_approx(item.display_scale, scale):
		# A landing tween captures its original scale. Stop it before fitting a
		# resized workbench so it cannot grow the item back beyond the mat.
		if item.land_tween != null and item.land_tween.is_valid():
			item.land_tween.kill()
			item.lift = 0.0
			item.lift_target = 0.0
			item.body.position = Vector2.ZERO
			item.body.scale = Vector2.ONE * item.display_scale
		item.body.scale *= scale / item.display_scale
		item.display_scale = scale
	var half := footprint * scale * 0.5 + Vector2(32, 36)
	var usable := Rect2(mat.position + half, mat.size - half * 2)
	item.bounds = Rect2(shell.ui_to_world(usable.position), usable.size)
	return shell.ui_to_world(mat.get_center())

func leave() -> void:
	for n in world_nodes:
		if is_instance_valid(n):
			n.queue_free()
	world_nodes.clear()

func on_changed(_prev: Dictionary, _next: Dictionary, _action: Dictionary) -> void:
	pass

## Cursor over world-space objects; controls supply their own cursor shapes.
func world_cursor_shape(_world_point: Vector2) -> int:
	return Input.CURSOR_ARROW

## Where notices stack; zero size = default (top centre).
func toast_rect() -> Rect2:
	return Rect2()

## Right-hand panel area (UI coordinates) shared by pages so edges line up.
func side_panel(width := 470.0) -> PanelContainer:
	var r: Rect2 = shell.content_rect()
	var p := UIKit.plate()
	p.position = Vector2(r.end.x - width, r.position.y)
	p.size = Vector2(width, r.size.y)
	add_child(p)
	return p

func left_panel(width := 420.0) -> PanelContainer:
	var r: Rect2 = shell.content_rect()
	var p := UIKit.plate()
	p.position = r.position
	p.size = Vector2(width, r.size.y)
	add_child(p)
	return p
