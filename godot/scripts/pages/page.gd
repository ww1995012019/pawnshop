class_name Page
extends Control
## Base for one screen: UI lives in this Control; world nodes it adds to the
## shell's layers are freed when the page is left.

var shell
var world_nodes: Array[Node] = []

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
