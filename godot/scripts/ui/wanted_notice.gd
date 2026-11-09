extends PanelContainer
## A movable inventory document, not a modal or a transaction target.
var owner_shell: Node
var body: VBoxContainer
var dragging := false
var drag_offset := Vector2.ZERO
var last_signature := ""
var last_viewport := Vector2.ZERO
var close_button: Button

func setup(shell: Node) -> void:
	owner_shell=shell
	name="wanted_notice"
	mouse_filter=Control.MOUSE_FILTER_STOP
	texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST
	add_theme_stylebox_override("panel",UIKit.paper_style(16))
	body=UIKit.vbox(10)
	add_child(body)
	refresh()

func refresh() -> void:
	if not WantedCases.has_notice(Game.state): hide();return
	var state:=WantedCases.case_state(Game.state)
	visible=bool(state.paper.visible)
	var signature:=String(Game.state.seed)+":"+str(state.revision)+":"+JSON.stringify(state.wanted)
	if signature!=last_signature:
		last_signature=signature
		_build()
	if not dragging: relayout()

func _build() -> void:
	UIKit.clear(body)
	var header:=UIKit.hbox(10)
	header.custom_minimum_size.y=48
	var title:=UIKit.label("旧港巡警 · 协查名单",24,UIKit.INK,true)
	title.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	title.mouse_filter=Control.MOUSE_FILTER_IGNORE
	header.add_child(title)
	close_button=UIKit.button("X","secondary",Vector2(48,44),22)
	close_button.name="wanted_close"
	close_button.tooltip_text="收回库存；下次仍是这份名单"
	close_button.pressed.connect(func(): Game.dispatch({"type":"TOGGLE_NOTICE","visible":false}))
	header.add_child(close_button)
	body.add_child(header)
	var note:=UIKit.label("拖动纸张上沿可摆放 · 照片、衣着与口供一起核对",16,Color("6b5a40"),false,true)
	note.mouse_filter=Control.MOUSE_FILTER_IGNORE
	body.add_child(note)
	var scroll:=ScrollContainer.new()
	scroll.size_flags_vertical=Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_DISABLED
	scroll.follow_focus=true
	body.add_child(scroll)
	var gutter:=MarginContainer.new()
	gutter.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	gutter.add_theme_constant_override("margin_right",16)
	scroll.add_child(gutter)
	var grid:=UIKit.grid(3,10)
	grid.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	gutter.add_child(grid)
	for id in WantedCases.case_state(Game.state).wanted:
		var p:=WantedCases.profile(id)
		if p.is_empty(): continue
		var card:=UIKit.plate(UIKit.box(Color("d7c8a4"),Color("a18d65"),0,1,9))
		card.name="case_"+id
		card.size_flags_horizontal=Control.SIZE_EXPAND_FILL
		var col:=UIKit.vbox(4)
		card.add_child(col)
		var photo:=TextureRect.new()
		photo.name="wanted_photo_"+id
		photo.texture=UIKit.wanted_portrait(p)
		photo.custom_minimum_size=Vector2(0,96)
		photo.expand_mode=TextureRect.EXPAND_IGNORE_SIZE
		photo.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		photo.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST
		col.add_child(photo)
		col.add_child(UIKit.label("%s · %s" % [p.name,p.id],16,UIKit.INK,true,false))
		col.add_child(UIKit.label("别称："+String(p.alias),14,Color("594b36"),false,true))
		col.add_child(UIKit.label(p.features,14,Color("594b36"),false,true))
		col.add_child(UIKit.label("线索：%s\n%s" % [p.lastSeen,String(p.clue).split("，")[0]],14,Color("594b36"),false,true))
		col.add_child(UIKit.label("协查报酬 %d Cr" % int(p.reward),16,UIKit.RUST,true))
		grid.add_child(card)
	var footer:=UIKit.label("抓获后仅替换被捕者 · 正确报警有报酬，多次误报受处罚",15,UIKit.RUST,false,true)
	footer.mouse_filter=Control.MOUSE_FILTER_IGNORE
	body.add_child(footer)
	call_deferred("relayout")

func relayout() -> void:
	var viewport_size:=get_viewport_rect().size
	last_viewport=viewport_size
	size=Vector2(minf(720,viewport_size.x-32),minf(760,viewport_size.y-48))
	var point: Array=WantedCases.case_state(Game.state).paper.position
	position=_clamped(Vector2(float(point[0]),float(point[1]))*viewport_size)

func _clamped(point: Vector2) -> Vector2:
	var view:=get_viewport_rect().size
	return Vector2(clampf(point.x,12,maxf(12,view.x-size.x-12)),clampf(point.y,12,maxf(12,view.y-size.y-12)))

func store_position() -> void:
	position=_clamped(position)
	var view:=get_viewport_rect().size
	Game.dispatch({"type":"MOVE_NOTICE","position":[position.x/view.x,position.y/view.y]})

func _gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index==MOUSE_BUTTON_LEFT:
		if event.pressed and event.position.y<72:
			dragging=true
			drag_offset=get_global_mouse_position()-global_position
			get_parent().move_child(self,-1)
			if owner_shell.modal_layer.get_child_count()>0: get_parent().move_child(owner_shell.modal_layer,-1)
			accept_event()
		elif not event.pressed and dragging:
			dragging=false
			store_position()
			accept_event()
	elif event is InputEventMouseMotion and dragging:
		position=_clamped(get_global_mouse_position()-drag_offset)
		accept_event()

func _process(_delta: float) -> void:
	if not is_visible_in_tree() or dragging:return
	var view:=get_viewport_rect().size
	var desired:=Vector2(minf(720,view.x-32),minf(760,view.y-48))
	if view!=last_viewport or size.distance_to(desired)>1.0:relayout()
