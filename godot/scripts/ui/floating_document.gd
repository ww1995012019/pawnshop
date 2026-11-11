class_name FloatingDocument
extends PanelContainer
## Non-modal paper. Geometry is stored independently of inspection/game actions.
signal geometry_changed
signal closed
var document_shell: Node
var body: VBoxContainer
var content: VBoxContainer
var document_scroll: ScrollContainer
var header: HBoxContainer
var close_button: Button
var dragging := false
var drag_offset := Vector2.ZERO
var resizing := false
var resize_start := Vector2.ZERO
var resize_zoom := 1.0
var resize_direction := Vector2.ONE
var resize_anchor := Vector2.ZERO
var resize_anchor_corner := Vector2.ZERO
var corner_handles: Array[Control] = []
var document_zoom := 1.0
var logical_size := Vector2(720,760)
var geometry_key := ""
var last_viewport := Vector2.ZERO

func compact_mobile() -> bool:
	return is_instance_valid(document_shell) and document_shell.landscape_mode()

var touches := {}
var pinch_distance := 0.0
var pinch_zoom := 1.0
const RESIZE_HIT_PIXELS := 48.0
var last_css_scale := 0.0
var last_grip_scale := Vector2.ZERO
var last_grip_size := Vector2.ZERO
var last_grip_origin := Vector2.ZERO
var browser_window: JavaScriptObject
var browser_resize_callback: JavaScriptObject

func _enter_tree() -> void:
	if OS.has_feature("web") and browser_resize_callback == null:
		browser_window = JavaScriptBridge.get_interface("window")
		browser_resize_callback = JavaScriptBridge.create_callback(_browser_resized)
		browser_window.addEventListener("resize",browser_resize_callback)

func _exit_tree() -> void:
	if browser_window != null and browser_resize_callback != null:
		browser_window.removeEventListener("resize",browser_resize_callback)
	browser_resize_callback = null
	browser_window = null

func _browser_resized(_args: Array) -> void:
	# Browser zoom can change DPR/CSS size while backing pixels stay constant.
	# Invalidate even hidden papers; the next visible process refreshes once.
	last_grip_scale = Vector2.ZERO

func configure(title: String, key: String, dimensions := Vector2(720,760)) -> void:
	geometry_key = key
	logical_size = dimensions
	mouse_filter = Control.MOUSE_FILTER_STOP
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	add_theme_stylebox_override("panel", UIKit.paper_style(6 if compact_mobile() else 16))
	body = UIKit.vbox(8)
	add_child(body)
	header = UIKit.hbox(8)
	header.custom_minimum_size.y = 28 if compact_mobile() else 48
	header.mouse_filter = Control.MOUSE_FILTER_STOP
	header.mouse_default_cursor_shape = Control.CURSOR_CAN_DROP
	header.gui_input.connect(_header_input)
	body.add_child(header)
	var heading := UIKit.label(title,23,UIKit.INK,true)
	heading.mouse_filter = Control.MOUSE_FILTER_IGNORE
	heading.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header.add_child(heading)
	close_button = UIKit.button("","secondary",Vector2(28,28) if compact_mobile() else Vector2(44,44),14,"close")
	close_button.name = "document_close"
	close_button.add_theme_constant_override("icon_max_width",16)
	close_button.tooltip_text = "关闭"
	close_button.pressed.connect(close_document)
	header.add_child(close_button)
	document_scroll = ScrollContainer.new()
	document_scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	document_scroll.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	document_scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	body.add_child(document_scroll)
	content = UIKit.vbox(10)
	content.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	document_scroll.add_child(content)
	var corners := Control.new()
	corners.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(corners)
	for entry in [["tl",Vector2(0,0)],["tr",Vector2(1,0)],["bl",Vector2(0,1)],["br",Vector2(1,1)]]:
		var corner: Vector2 = entry[1]
		var handle := ResizeGrip.new()
		handle.document = self
		handle.corner = corner
		handle.name = "document_corner_"+entry[0]
		handle.mouse_filter = Control.MOUSE_FILTER_STOP
		handle.mouse_default_cursor_shape = Control.CURSOR_FDIAGSIZE if corner.x==corner.y else Control.CURSOR_BDIAGSIZE
		handle.tooltip_text = "拖动纸张角落缩放"
		handle.set_meta("corner",corner)
		handle.gui_input.connect(func(event: InputEvent): _corner_input(event,corner))
		corners.add_child(handle)
		corner_handles.append(handle)
	var saved: Dictionary = _read_geometry()
	document_zoom = float(saved.get("scale",1.0))
	var point: Array = saved.get("position",[0.08,0.08])
	position = Vector2(float(point[0]),float(point[1])) * get_viewport_rect().size
	relayout()

func _read_geometry() -> Dictionary:
	var fallback := {}
	if geometry_key == "inspection_guide":
		var view := get_viewport_rect().size
		fallback = {"position":[maxf(0.0,(view.x-logical_size.x-24)/view.x),0.08]}
	return Game.prefs.get("documents",{}).get(geometry_key,fallback)

func _store_geometry() -> void:
	if geometry_key == "": return
	if not Game.prefs.has("documents"): Game.prefs.documents = {}
	var view := get_viewport_rect().size
	Game.prefs.documents[geometry_key] = {"scale":document_zoom,"position":[position.x/view.x,position.y/view.y]}
	Game.save_prefs()
	geometry_changed.emit()

func set_document_zoom(value: float, persist := true) -> void:
	if not is_finite(value): return
	document_zoom = clampf(value,0.35,1.6)
	relayout()
	if persist: _store_geometry()

func _clamped(point: Vector2) -> Vector2:
	var view := get_viewport_rect().size
	return Vector2(clampf(point.x,8,maxf(8,view.x-size.x*scale.x-8)),clampf(point.y,8,maxf(8,view.y-size.y*scale.y-8)))

func move_document(point: Vector2) -> void:
	position = _clamped(point)
	_store_geometry()

func relayout() -> void:
	last_viewport = get_viewport_rect().size
	# Mobile papers reflow at native size instead of scaling down a desktop page.
	if compact_mobile():
		var area: Rect2 = document_shell.safe_area()
		size = Vector2(minf(650,area.size.x-16),area.size.y-16)
		scale = Vector2.ONE
		position = area.position+Vector2((area.size.x-size.x)*0.5,8)
		for handle in corner_handles: handle.hide()
		_layout_grips()
		return
	for handle in corner_handles: handle.show()
	# Logical content scrolls rather than stretching the document beyond the view.
	size = logical_size
	var fit := minf((last_viewport.x-16)/size.x,(last_viewport.y-16)/size.y)
	var applied := minf(document_zoom,fit)
	scale = Vector2.ONE * maxf(0.1,applied)
	position = _clamped(position)
	_layout_grips()

func _css_scale() -> float:
	var ratio := float(JavaScriptBridge.eval("devicePixelRatio || 1",true)) if OS.has_feature("web") else 1.0
	return maxf(0.01,absf((get_viewport().get_screen_transform()*get_global_transform_with_canvas()).get_scale().x)/ratio)

func _layout_grips() -> void:
	last_grip_scale = (get_viewport().get_screen_transform()*get_global_transform_with_canvas()).get_scale()
	last_grip_size = size
	if not corner_handles.is_empty(): last_grip_origin = (corner_handles[0].get_parent() as Control).position
	last_css_scale = _css_scale()
	var extent := minf(RESIZE_HIT_PIXELS/last_css_scale,minf(size.x,size.y)*0.3)
	for handle in corner_handles:
		handle.size = Vector2.ONE*extent
		handle.position = size*(handle.get_meta("corner") as Vector2)-handle.size*0.5-(handle.get_parent() as Control).position
		handle.queue_redraw()

func resize_cursor_shape() -> int:
	return Control.CURSOR_FDIAGSIZE if resize_anchor_corner.x == resize_anchor_corner.y else Control.CURSOR_BDIAGSIZE

func cursor_at(_point: Vector2) -> int:
	return resize_cursor_shape() if resizing else (Control.CURSOR_DRAG if dragging else Control.CURSOR_ARROW)

## A visible brass corner with a larger, screen-sized mouse/touch target.
class ResizeGrip extends Control:
	var document: FloatingDocument
	var corner := Vector2.ZERO
	var hovered := false
	func _ready() -> void:
		resized.connect(queue_redraw)
		mouse_entered.connect(func(): hovered = true; queue_redraw())
		mouse_exited.connect(func(): hovered = false; queue_redraw())
	func _has_point(point: Vector2) -> bool:
		if not Rect2(Vector2.ZERO,size).has_point(point): return false
		# The close key retains every pixel of its own clickable rectangle.
		if is_instance_valid(document.close_button) and document.close_button.get_global_rect().has_point(get_global_transform()*point): return false
		return true
	func _draw() -> void:
		if not is_instance_valid(document): return
		var unit := 1.0/maxf(document.last_css_scale,0.01)
		var inward := Vector2.ONE-corner*2.0
		var c := size*0.5
		var a := c+inward*1.5*unit
		var points := [a+Vector2(inward.x*16*unit,0),a,a+Vector2(0,inward.y*16*unit)]
		var color := UIKit.AMBER if hovered or document.resizing else UIKit.AMBER_DEEP
		draw_polyline(PackedVector2Array(points),UIKit.INK,4.0*unit,false)
		draw_polyline(PackedVector2Array(points),color,2.0*unit,false)
		draw_line(a+Vector2(inward.x*5*unit,0),a+Vector2(inward.x*12*unit,0),Color("f1deb3"),unit,false)

func close_document() -> void:
	_store_geometry()
	hide()
	closed.emit()

func _header_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_WHEEL_UP or event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
			if event.pressed: set_document_zoom(document_zoom + (0.1 if event.button_index==MOUSE_BUTTON_WHEEL_UP else -0.1))
			accept_event()
		elif event.button_index == MOUSE_BUTTON_LEFT:
			dragging = event.pressed
			drag_offset = get_global_mouse_position()-position
			if not dragging: _store_geometry()
			accept_event()
	elif event is InputEventMouseMotion and dragging:
		position = _clamped(get_global_mouse_position()-drag_offset)
		accept_event()

func _begin_corner_resize(corner: Vector2, pointer: Vector2) -> void:
	resizing = true
	dragging = false
	resize_start = pointer
	resize_zoom = scale.x
	resize_direction = (corner*2.0-Vector2.ONE)*logical_size
	resize_anchor_corner = Vector2.ONE-corner
	resize_anchor = position+size*scale*resize_anchor_corner

func _gui_input(event: InputEvent) -> void:
	if compact_mobile(): return
	if event is InputEventMouseButton and event.button_index==MOUSE_BUTTON_LEFT and event.pressed:
		var point: Vector2 = event.position
		var margin := minf(RESIZE_HIT_PIXELS*0.5/_css_scale(),minf(size.x,size.y)*0.15)
		if (point.x<margin or point.x>size.x-margin) and (point.y<margin or point.y>size.y-margin):
			_begin_corner_resize(Vector2(1 if point.x>size.x/2 else 0,1 if point.y>size.y/2 else 0),get_global_mouse_position())
			accept_event()

func _corner_input(event: InputEvent, corner: Vector2) -> void:
	if event is InputEventMouseButton and event.button_index==MOUSE_BUTTON_LEFT:
		if event.pressed: _begin_corner_resize(corner,get_global_mouse_position())
		accept_event()

func _resize_to(pointer: Vector2) -> void:
	var amount := (pointer-resize_start).dot(resize_direction)/resize_direction.length_squared()
	set_document_zoom(resize_zoom+amount,false)
	position = _clamped(resize_anchor-size*scale*resize_anchor_corner)

func _input(event: InputEvent) -> void:
	if compact_mobile() or not is_visible_in_tree() or (is_instance_valid(document_shell) and document_shell.modal_open()): return
	if event is InputEventMouseMotion:
		if resizing:
			_resize_to(get_global_mouse_position())
			get_viewport().set_input_as_handled()
		elif dragging:
			position = _clamped(get_global_mouse_position()-drag_offset)
			get_viewport().set_input_as_handled()
	elif event is InputEventMouseButton and not event.pressed and event.button_index==MOUSE_BUTTON_LEFT:
		if dragging or resizing:
			dragging = false
			resizing = false
			_store_geometry()
			get_viewport().set_input_as_handled()
	elif event is InputEventScreenTouch:
		if event.pressed and get_global_rect().has_point(event.position):
			touches[event.index] = event.position
			if touches.size()==2:
				dragging = false
				resizing = false
				var points: Array = touches.values()
				pinch_distance = points[0].distance_to(points[1])
				pinch_zoom = document_zoom
				get_viewport().set_input_as_handled()
		elif not event.pressed and touches.has(event.index):
			touches.erase(event.index)
			if pinch_distance>0:
				get_viewport().set_input_as_handled()
				_store_geometry()
			if touches.is_empty(): pinch_distance = 0.0
	elif event is InputEventScreenDrag and touches.has(event.index):
		touches[event.index] = event.position
		if touches.size()==2 and pinch_distance>0:
			var points: Array = touches.values()
			set_document_zoom(pinch_zoom*points[0].distance_to(points[1])/pinch_distance,false)
			get_viewport().set_input_as_handled()

func _process(_delta: float) -> void:
	if is_visible_in_tree():
		if get_viewport_rect().size != last_viewport:
			relayout()
		else:
			# Native transforms also change when browser DPI/zoom changes. Only
			# cross the JS bridge and resize controls when their CSS extent changes.
			var projected := (get_viewport().get_screen_transform()*get_global_transform_with_canvas()).get_scale()
			var origin: Vector2 = (corner_handles[0].get_parent() as Control).position if not corner_handles.is_empty() else Vector2.ZERO
			if not projected.is_equal_approx(last_grip_scale) or size != last_grip_size or origin != last_grip_origin:
				_layout_grips()
