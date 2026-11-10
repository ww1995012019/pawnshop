extends "res://scripts/ui/floating_document.gd"
var owner_shell: Node
var last_signature := ""

func setup(shell: Node) -> void:
	owner_shell = shell
	document_shell = shell
	name = "wanted_notice"
	configure("旧港巡警 · 协查名单", "wanted", Vector2(720,760))
	close_button.name = "wanted_close"
	closed.connect(func(): Game.dispatch({"type":"TOGGLE_NOTICE","visible":false}))
	refresh()

func _read_geometry() -> Dictionary:
	return WantedCases.case_state(Game.state).paper

func _store_geometry() -> void:
	var view := get_viewport_rect().size
	var saved_point := [position.x/view.x,position.y/view.y]
	var saved_zoom := document_zoom
	Game.dispatch({"type":"RESIZE_NOTICE","scale":saved_zoom})
	Game.dispatch({"type":"MOVE_NOTICE","position":saved_point})

func refresh() -> void:
	if not WantedCases.has_notice(Game.state): hide(); return
	var state := WantedCases.case_state(Game.state)
	visible = bool(state.paper.visible)
	var signature := String(Game.state.seed)+":"+str(state.revision)+":"+JSON.stringify(state.wanted)
	if signature != last_signature:
		last_signature = signature
		_build()
	if not dragging and not resizing and touches.is_empty():
		document_zoom = float(state.paper.get("scale",1.0))
		var point: Array = state.paper.position
		position = Vector2(float(point[0]),float(point[1])) * get_viewport_rect().size
		relayout()

func relayout() -> void:
	if not dragging and not resizing and touches.is_empty():
		var point: Array = WantedCases.case_state(Game.state).paper.position
		position = Vector2(float(point[0]),float(point[1])) * get_viewport_rect().size
	super.relayout()

func store_position() -> void:
	move_document(position)

func _build() -> void:
	UIKit.clear(content)
	content.add_child(UIKit.label("照片、衣着与口供一起核对 · 拖动标题移动 · 拖动四角缩放",16,UIKit.INK,false,true))
	var grid := UIKit.grid(3,10)
	grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content.add_child(grid)
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
	var footer:=UIKit.label("抓获后巡警收回整份名单，下次到访再交付 · 正确报警有报酬，多次误报受处罚",15,UIKit.RUST,false,true)
	footer.mouse_filter=Control.MOUSE_FILTER_IGNORE
	content.add_child(footer)
	call_deferred("relayout")
