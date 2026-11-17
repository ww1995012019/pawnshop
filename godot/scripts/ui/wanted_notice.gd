extends "res://scripts/ui/floating_document.gd"
## Live police poster: the saved six profiles remain authoritative.
var owner_shell: Node
var last_signature := ""
var built_layout := ""
var profile_grid: GridContainer

func setup(shell: Node) -> void:
	owner_shell=shell
	document_shell=shell
	name="wanted_notice"
	configure("通缉令 · 旧港巡警", "wanted", Vector2(760,800))
	close_button.name="wanted_close"
	close_button.custom_minimum_size=Vector2(44,44)
	header.custom_minimum_size.y=48
	closed.connect(func():Game.dispatch({"type":"TOGGLE_NOTICE","visible":false}))
	refresh()

func compact_mobile() -> bool:
	return is_instance_valid(owner_shell) and owner_shell.mobile_mode()

func _layout_key() -> String:
	if not compact_mobile():return "desktop"
	return "portrait" if owner_shell.portrait_mode() else "landscape"

func _read_geometry() -> Dictionary:
	return WantedCases.case_state(Game.state).paper

func _store_geometry() -> void:
	# Mobile is a readable full-size sheet; keep the desktop's saved placement.
	if compact_mobile():return
	var view=get_viewport_rect().size
	var saved_point=[position.x/view.x,position.y/view.y]
	var saved_zoom=document_zoom
	Game.dispatch({"type":"RESIZE_NOTICE","scale":saved_zoom})
	Game.dispatch({"type":"MOVE_NOTICE","position":saved_point})

func refresh() -> void:
	if not WantedCases.has_notice(Game.state):hide();return
	var state=WantedCases.case_state(Game.state)
	visible=bool(state.paper.visible) and not owner_shell.wanted_notice_blocked()
	var signature=String(Game.state.seed)+":"+str(state.revision)+":"+JSON.stringify(state.wanted)+":"+_layout_key()
	if signature!=last_signature:
		last_signature=signature
		_build()
	if not dragging and not resizing and touches.is_empty():
		document_zoom=float(state.paper.get("scale",1.0))
		var point:Array=state.paper.position
		position=Vector2(float(point[0]),float(point[1]))*get_viewport_rect().size
		relayout()

func relayout() -> void:
	if is_instance_valid(content) and built_layout!=_layout_key():_build()
	if compact_mobile():
		last_viewport=get_viewport_rect().size
		var area:Rect2=owner_shell.safe_area()
		size=Vector2(minf(760,area.size.x-16),area.size.y-16)
		scale=Vector2.ONE
		position=area.position+Vector2((area.size.x-size.x)*.5,8)
		for grip in corner_handles:grip.hide()
		_layout_grips()
	else:
		if not dragging and not resizing and touches.is_empty():
			var point:Array=WantedCases.case_state(Game.state).paper.position
			position=Vector2(float(point[0]),float(point[1]))*get_viewport_rect().size
		super.relayout()

func _header_input(event: InputEvent) -> void:
	if not compact_mobile():super._header_input(event)

func store_position() -> void:
	move_document(position)

func _copy(text: String,font_size := 16,color := UIKit.INK) -> Label:
	var label=UIKit.label(text,font_size,color,false,true)
	label.add_theme_font_size_override("font_size",font_size)
	label.mouse_filter=Control.MOUSE_FILTER_IGNORE
	return label

func _build() -> void:
	built_layout=_layout_key()
	UIKit.clear(content)
	var heading=header.get_child(0) as Label
	heading.add_theme_font_size_override("font_size",20 if compact_mobile() else 30)
	heading.add_theme_color_override("font_color",UIKit.AUX_INK)
	var masthead=UIKit.hbox(10)
	masthead.mouse_filter=Control.MOUSE_FILTER_IGNORE
	content.add_child(masthead)
	var office=_copy("旧港巡警署  /  六人协查通报",16,UIKit.AUX_INK)
	office.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	masthead.add_child(office)
	var stamp=UIKit.plate(UIKit.box(UIKit.AUX_PAPER,UIKit.AUX_EDGE,0,2,5,0))
	stamp.custom_minimum_size=Vector2(68,32)
	stamp.mouse_filter=Control.MOUSE_FILTER_IGNORE
	var stamp_copy=_copy("协 查",18,UIKit.AUX_INK)
	stamp_copy.autowrap_mode=TextServer.AUTOWRAP_OFF
	stamp_copy.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	stamp.add_child(stamp_copy)
	masthead.add_child(stamp)
	content.add_child(_copy("核对照片、外貌与来客口供；相似衣着不能单独定罪。",16,UIKit.AUX_INK))
	profile_grid=UIKit.grid(1 if built_layout=="portrait" else 2 if built_layout=="landscape" else 3,10)
	profile_grid.name="WantedProfiles"
	profile_grid.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	content.add_child(profile_grid)
	for id in WantedCases.case_state(Game.state).wanted:
		var profile=WantedCases.profile(id)
		if profile.is_empty():continue
		var style=UIKit.box(UIKit.PAPER,UIKit.AUX_EDGE,0,1,9,0)
		style.bg_color=UIKit.PAPER
		var card=UIKit.plate(style)
		card.name="case_"+id
		card.size_flags_horizontal=Control.SIZE_EXPAND_FILL
		profile_grid.add_child(card)
		var row:BoxContainer=UIKit.hbox(10) if compact_mobile() else UIKit.vbox(5)
		card.add_child(row)
		var photo=TextureRect.new()
		photo.name="wanted_photo_"+id
		photo.texture=UIKit.wanted_portrait(profile)
		photo.custom_minimum_size=Vector2(76,112) if compact_mobile() else Vector2(0,96)
		photo.expand_mode=TextureRect.EXPAND_IGNORE_SIZE
		photo.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		photo.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST
		photo.mouse_filter=Control.MOUSE_FILTER_IGNORE
		row.add_child(photo)
		var copy=UIKit.vbox(5)
		copy.size_flags_horizontal=Control.SIZE_EXPAND_FILL
		row.add_child(copy)
		var person=_copy("%s · %s"%[profile.name,profile.id],18,UIKit.AUX_INK)
		copy.add_child(person)
		copy.add_child(_copy("别称："+String(profile.alias)))
		copy.add_child(_copy(String(profile.features)))
		copy.add_child(_copy("最后目击："+String(profile.lastSeen)))
		copy.add_child(_copy("线索："+String(profile.clue)))
		copy.add_child(_copy("协查报酬 %d Cr"%int(profile.reward),18,UIKit.RUST))
	content.add_child(_copy("认准身份后报警。抓获后巡警收回整份通缉令；下次巡查交付新名单。前两次误报提醒，多次误报受罚。",16,UIKit.AUX_INK))
	if not compact_mobile():content.add_child(_copy("拖动报头移动 · 拖动纸角缩放 · 关闭后通缉令仍留在桌面",16,UIKit.MUTED))
	call_deferred("relayout")
