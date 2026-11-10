extends RefCounted
## Finger-sized targets for small buttons on touch screens.
##
## The shop is drawn for a desktop monitor, so on a phone many buttons are only
## a few millimetres tall. A touch that lands just outside a small button is
## moved onto it. Touches inside any button, on a large fixture or on another
## small control (dial, slider, text) stay put.
##
## The Web page asks for the landing point when a finger goes down and shifts
## that finger's events before the engine reads them, so every part of the
## engine sees one consistent pointer position.

const TARGET := 44.0    # wanted target size, CSS px
const MAX_GROW := 14.0  # most a button's target grows on each side, CSS px

## Where a touch at `point` should land.
static func snap(point: Vector2, root: Control, scale: float) -> Vector2:
	if not is_instance_valid(root) or scale <= 0.0:
		return point
	var best := point
	var best_distance := INF
	var best_enabled := false
	var stack: Array = [[root, Rect2(-1e6, -1e6, 2e6, 2e6)]]
	while not stack.is_empty():
		var entry: Array = stack.pop_back()
		var node: Node = entry[0]
		var clip: Rect2 = entry[1]
		if node is CanvasItem and not (node as CanvasItem).visible:
			continue
		if node is Control:
			var control := node as Control
			var rect := (control.get_global_transform_with_canvas() * Rect2(Vector2.ZERO, control.size)).intersection(clip)
			if control.clip_contents:
				clip = rect
			if rect.has_area():
				if control is BaseButton:
					var grow := ((Vector2(TARGET, TARGET) - rect.size * scale) * 0.5).clamp(Vector2.ZERO, Vector2(MAX_GROW, MAX_GROW)) / scale
					if grow != Vector2.ZERO:
						if rect.has_point(point):
							return point
						if rect.grow_individual(grow.x, grow.y, grow.x, grow.y).has_point(point):
							var inner := rect.grow(-minf(2.0, minf(rect.size.x, rect.size.y) * 0.25))
							var target := point.clamp(inner.position, inner.end)
							var distance := point.distance_to(target)
							if distance < best_distance:
								best = target
								best_distance = distance
								best_enabled = not (control as BaseButton).disabled
				elif rect.has_point(point) and _keeps_touch(control, rect.size * scale):
					return point
		for child in node.get_children():
			stack.append([child, clip])
	return best if best_enabled else point

## Controls that use the touch themselves and must not lose it to a neighbour.
static func _keeps_touch(control: Control, css_size: Vector2) -> bool:
	if control is Range or control is LineEdit or control is TextEdit or control is SubViewportContainer:
		return true
	if control.mouse_filter != Control.MOUSE_FILTER_STOP:
		return false
	for child in control.get_children():
		if child is Control:
			return false
	return maxf(css_size.x, css_size.y) < 150.0
