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
var document_zoom := 1.0
var logical_size := Vector2(720,760)
var geometry_key := ""
var last_viewport := Vector2.ZERO
var touches := {}
var pinch_distance := 0.0
var pinch_zoom := 1.0

func configure(title: String, key: String, dimensions := Vector2(720,760)) -> void:
	geometry_key = key
	logical_size = dimensions
	mouse_filter = Control.MOUSE_FILTER_STOP
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	add_theme_stylebox_override("panel", UIKit.paper_style(16))
	body = UIKit.vbox(8)
	add_child(body)
	header = UIKit.hbox(8)
	header.custom_minimum_size.y = 48
	header.mouse_filter = Control.MOUSE_FILTER_STOP
	header.gui_input.connect(_header_input)
	body.add_child(header)
	var heading := UIKit.label(title,23,UIKit.INK,true)
	heading.mouse_filter = Control.MOUSE_FILTER_IGNORE
	heading.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header.add_child(heading)
	for spec in [["−",-0.1],["+",0.1]]:
		var step: float = spec[1]
		var button := UIKit.button(spec[0],"secondary",Vector2(44,44),22)
		button.tooltip_text = "缩放纸张；也可拖动右下角"
		button.pressed.connect(func(): set_document_zoom(document_zoom+step))
		header.add_child(button)
	close_button = UIKit.button("X","secondary",Vector2(44,44),22)
	close_button.name = "document_close"
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
	var grip := UIKit.button("◢","secondary",Vector2(44,32),18)
	grip.name = "document_resize"
	grip.tooltip_text = "拖动缩放 · 双指也可缩放"
	grip.size_flags_horizontal = Control.SIZE_SHRINK_END
	grip.gui_input.connect(_resize_input)
	body.add_child(grip)
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
	# Logical content scrolls rather than stretching the document beyond the view.
	size = logical_size
	var fit := minf((last_viewport.x-16)/size.x,(last_viewport.y-16)/size.y)
	var applied := minf(document_zoom,fit)
	scale = Vector2.ONE * maxf(0.1,applied)
	position = _clamped(position)

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

func _resize_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index==MOUSE_BUTTON_LEFT:
		resizing = event.pressed
		resize_start = get_global_mouse_position()
		resize_zoom = document_zoom
		if not resizing: _store_geometry()
		accept_event()

func _input(event: InputEvent) -> void:
	if not is_visible_in_tree() or (is_instance_valid(document_shell) and document_shell.modal_open()): return
	if event is InputEventMouseMotion:
		if resizing:
			set_document_zoom(resize_zoom+(get_global_mouse_position()-resize_start).dot(Vector2.ONE)/1000.0,false)
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
	if is_visible_in_tree() and get_viewport_rect().size != last_viewport: relayout()
