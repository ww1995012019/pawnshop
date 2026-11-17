extends Button
## One physical desk document; ownership remains in the existing police/save model.
var owner_shell: Node
var signature := ""
var portraits: HBoxContainer
var caption: Label
var compact := false

func setup(shell: Node) -> void:
	owner_shell=shell
	name="wanted_desk_paper"
	text=""
	tooltip_text="桌面通缉令 · 点击展开或收起六人协查名单"
	custom_minimum_size=Vector2(70,44) if compact else Vector2(132,86)
	mouse_default_cursor_shape=Control.CURSOR_POINTING_HAND
	for state in ["normal","hover","pressed","hover_pressed","disabled"]:
		var fill=UIKit.PAPER if state=="normal" else UIKit.AUX_PAPER.darkened(.08) if state in ["pressed","hover_pressed"] else UIKit.AUX_PAPER
		var style=UIKit.box(fill,UIKit.AUX_EDGE,2,2,4,3)
		style.bg_color=fill
		add_theme_stylebox_override(state,style)
	add_theme_stylebox_override("focus",UIKit.focus_style())
	var body=UIKit.vbox(1)
	if compact:body.alignment=BoxContainer.ALIGNMENT_CENTER
	body.mouse_filter=Control.MOUSE_FILTER_IGNORE
	body.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	body.offset_left=7;body.offset_right=-7;body.offset_top=3;body.offset_bottom=-3
	add_child(body)
	var title=UIKit.label("通缉令" if compact else "通 缉 令",16 if compact else 22,UIKit.AUX_INK,true)
	title.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	title.mouse_filter=Control.MOUSE_FILTER_IGNORE
	body.add_child(title)
	portraits=UIKit.hbox(2)
	portraits.mouse_filter=Control.MOUSE_FILTER_IGNORE
	portraits.alignment=BoxContainer.ALIGNMENT_CENTER
	portraits.visible=not compact
	body.add_child(portraits)
	caption=UIKit.label("六人协查 · 点击核对",12,UIKit.AUX_INK)
	caption.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
	caption.mouse_filter=Control.MOUSE_FILTER_IGNORE
	caption.visible=not compact
	body.add_child(caption)
	pressed.connect(func():owner_shell.toggle_wanted_notice())
	if not Game.changed.is_connected(_notice_changed):Game.changed.connect(_notice_changed)
	refresh()

func _notice_changed(_previous:Dictionary,_next:Dictionary,_action:Dictionary) -> void:
	refresh()

func refresh() -> void:
	var owned=WantedCases.has_notice(Game.state)
	if not owned:hide();return
	var state=WantedCases.case_state(Game.state)
	# The feedback child draws above sibling canvas items. Hide the entire
	# miniature while its full document is open, including that higher-z layer.
	visible=not bool(state.paper.visible)
	var next=String(Game.state.seed)+":"+str(state.revision)+":"+JSON.stringify(state.wanted)
	if next!=signature:
		signature=next
		UIKit.clear(portraits)
		for id in state.wanted:
			var picture=TextureRect.new()
			picture.name="desk_wanted_photo_"+id
			picture.texture=UIKit.wanted_portrait(WantedCases.profile(id))
			picture.custom_minimum_size=Vector2(17,26)
			picture.expand_mode=TextureRect.EXPAND_IGNORE_SIZE
			picture.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
			picture.mouse_filter=Control.MOUSE_FILTER_IGNORE
			portraits.add_child(picture)
	caption.text="点击收起 · 六人协查" if state.paper.visible else "六人协查 · 点击核对"
