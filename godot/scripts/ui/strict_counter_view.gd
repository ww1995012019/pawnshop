extends Control
## Reference-sized presentation. Every action delegates to the existing game.
const R = preload("res://scripts/ui/reference_atlas.gd")
const A = preload("res://scripts/ui/comic_assets.gd")
const PAPER = Color("f7e5c3")
const INK = Color("20241e")
const RED = Color("b84e37")
const GREEN = Color("243a30")
const ORANGE = Color("9a5326")
const ORANGE_LIGHT = Color("f4d5a4")
const ORANGE_INK = Color("40271b")
const REFERENCE_SIZE := Vector2(1671,941)
const PRESENTATION_SIZE := Vector2(1920,1080)
var desk
var detail_layer: Control
var quick_list: Control
var face: TextureRect
var speech: RichTextLabel
var name_key: Label
var business_label: Label
var ask_caption: Label
var day: Label
var rent: Label
var money: Label
var ap: Label
var risk: Label
var selected: TextureRect
var meta_cover: TextureRect
var cost_cover: TextureRect
var utility_buttons := {}
var item_name: Label
var item_meta: Label
var price_band: Label
var evidence: Label
var rounds: Label
var ask: Label
var quote: LineEdit
var cost: Label
var stage_hint: Label
var secondary: Button
var order_count: Label
var stock_count: Label
var trade_buttons: Array=[]
var quote_controls: Array=[]
var stock: GridContainer
var wanted_paper: Button
var shelves: Control
var table: Control
var detail_tools: VBoxContainer
var own: Control
var clock := 0.0
var dirty := true
var signature := ""
var stock_signature := ""
var last_npc := ""
var watch_sides := {}
var quote_dirty := false
var quote_syncing := false
var quoted_uid := ""
var period := 0.0
var stock_scroll: ScrollContainer
var display_scroll: ScrollContainer
var modal_bar: Control
var bell_art: TextureRect
var letterbox: ColorRect
var scenery: Array[TextureRect]=[]
var hud_art: TextureRect
var footer_art: TextureRect
var stock_art: NinePatchRect
var layout_rects := {}
var layout_extent := Vector2.ZERO
var extra_space := Vector2.ZERO
var last_visit := ""
var visitor_phase := "standing"
var face_offset := Vector2.ZERO
var visitor_tween: Tween
var departing_face: TextureRect
var departure_tween: Tween
var departure_started := false
var motion_ready := false
var watch_sources := {}
var drag_feedback := {}
var store_motion_versions := {}
var motion_serial := 0

class TradeWatch extends Button:
 var controller
 var uid := ""
 func _get_drag_data(_position: Vector2):
  if controller.desk.busy or controller.desk._scene_blocked():return null
  var it=TradeSession.item(Game.state,uid) if Game.state.trade!=null else Game.item(uid)
  if it==null:return null
  var ghost=TextureRect.new();ghost.expand_mode=TextureRect.EXPAND_IGNORE_SIZE
  ghost.texture=controller._watch_texture(uid,it);ghost.size=Vector2(56,80)
  ghost.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
  var holder=Control.new();holder.add_child(ghost);ghost.position=-ghost.size*.5;set_drag_preview(holder)
  ghost.position.y-=9;ghost.rotation=-.035
  var data={"kind":"strict_trade" if Game.state.trade!=null else "showroom_original","uid":uid}
  if Game.state.trade!=null:
   data.trade_id=Game.state.trade.id;data.version=TradeSession.session(Game.state).get("version",-1)
  return data

func setup(page) -> void:
 desk=page;name="StrictCounterView"
 mouse_filter=Control.MOUSE_FILTER_STOP
 scale=PRESENTATION_SIZE/REFERENCE_SIZE;size=REFERENCE_SIZE
 texture_filter=CanvasItem.TEXTURE_FILTER_LINEAR
 A.prewarm()
 _build()
 for node in get_children():
  if node is Control:layout_rects[node]=Rect2(node.position,node.size)
 _layout_desktop()
 Game.changed.connect(_model_changed)
 Game.prefs_changed.connect(func():dirty=true)
 desk.dial.changed.connect(func(_value):dirty=true)
 _refresh(true)
 motion_ready=true

func _style(fill: Color=PAPER,edge: Color=INK,radius := 7) -> StyleBox:
 var st=preload("res://scripts/ui/comic_paper.gd").new() if fill==PAPER else StyleBoxFlat.new()
 st.bg_color=fill;st.border_color=edge
 st.set_border_width_all(2 if edge.a>0 else 0);st.set_corner_radius_all(radius)
 st.set_content_margin_all(0)
 if fill==PAPER:st.paper=A.tex("paper.png")
 return st

func _panel(rect: Rect2,fill: Color=PAPER,border := true,radius := 8) -> Panel:
 var p=Panel.new();p.position=rect.position;p.size=rect.size
 p.add_theme_stylebox_override("panel",_style(fill,INK if border else Color.TRANSPARENT,radius))
 p.mouse_filter=Control.MOUSE_FILTER_IGNORE;add_child(p)
 if fill==RED:_image(p,A.tex("red_paper.png"),Rect2(3,3,rect.size.x-6,rect.size.y-6)).stretch_mode=TextureRect.STRETCH_SCALE
 return p

func _label(parent: Node,text: String,rect: Rect2,font_size := 24,color: Color=INK,bold := false) -> Label:
 var l=Label.new();l.text=text;l.position=rect.position;l.size=rect.size
 l.add_theme_font_override("font",R.font(bold))
 l.add_theme_font_size_override("font_size",font_size);l.add_theme_color_override("font_color",color)
 l.mouse_filter=Control.MOUSE_FILTER_IGNORE
 parent.add_child(l);return l

func _image(parent: Node,texture: Texture2D,rect: Rect2,tint:=Color.WHITE) -> TextureRect:
 var i=TextureRect.new();i.expand_mode=TextureRect.EXPAND_IGNORE_SIZE;i.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
 i.texture=texture;i.position=rect.position;i.size=rect.size
 i.modulate=tint;i.mouse_filter=Control.MOUSE_FILTER_IGNORE;parent.add_child(i);return i

func _button(parent: Node,text: String,rect: Rect2,fn: Callable,icon_name := "",fill: Color=PAPER,vertical := false) -> Button:
 var b=Button.new();b.position=rect.position;b.size=rect.size
 b.mouse_default_cursor_shape=Control.CURSOR_POINTING_HAND
 b.add_theme_font_override("font",UIKit.mono)
 b.add_theme_font_size_override("font_size",22)
 var ink=UIKit.AUX_LIGHT if fill in [RED,ORANGE] else INK
 for state in ["normal","hover","pressed","hover_pressed","disabled"]:
  var style=_style(UIKit.AUX_DISABLED if state=="disabled" else fill,INK,9)
  if state=="hover":
   style.border_color=UIKit.AUX_EDGE
  if state in ["pressed","hover_pressed"]:
   style.bg_color=fill.darkened(.08)
  b.add_theme_stylebox_override(state,style)
 for key in ["font_color","font_hover_color","font_pressed_color","font_hover_pressed_color","font_focus_color","icon_normal_color","icon_hover_color","icon_pressed_color","icon_hover_pressed_color","icon_focus_color"]:b.add_theme_color_override(key,ink)
 b.add_theme_color_override("font_disabled_color",UIKit.DISABLED_TEXT)
 b.add_theme_color_override("icon_disabled_color",UIKit.DISABLED_TEXT)
 b.add_theme_stylebox_override("focus",UIKit.focus_style())
 parent.add_child(b)
 if fill in [RED,ORANGE]:_image(b,UIKit.orange_art(A.tex("red_paper.png")) if fill==ORANGE else A.tex("red_paper.png"),Rect2(4,4,rect.size.x-8,rect.size.y-8)).stretch_mode=TextureRect.STRETCH_SCALE
 if vertical:
  b.tooltip_text=text
  b.clip_text=true
  for color_key in ["font_color","font_hover_color","font_pressed_color","font_hover_pressed_color","font_disabled_color","font_focus_color"]:b.add_theme_color_override(color_key,Color.TRANSPARENT)
  _image(b,A.icon(icon_name),Rect2((rect.size.x-34)/2,12,34,34),ink).name="ActionIcon"
  var caption=_label(b,text,Rect2(0,52,rect.size.x,34),23,ink,true)
  caption.name="ActionCaption"
  caption.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
 else:
  b.text=text
  if icon_name!="":
   b.icon=A.icon(icon_name);b.add_theme_constant_override("icon_max_width",26)
 b.pressed.connect(func():
  if desk.busy or desk._scene_blocked():return
  desk.shell.sound("click",-10);fn.call();dirty=true)
 _bind_button_feedback(b)
 return b

## A separate drawing layer survives empty styleboxes and later-painted skins.
## Native Button owns the pointer, focus and disabled state; geometry never moves.
func _bind_button_feedback(b: Button) -> void:
 if b.get_node_or_null("InteractionFeedback")!=null:return
 var feedback=ButtonFeedback.new()
 feedback.name="InteractionFeedback";feedback.button=b
 feedback.mouse_filter=Control.MOUSE_FILTER_IGNORE;feedback.z_index=8
 b.add_child(feedback)
 feedback.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)

class ButtonFeedback extends Panel:
 var button: Button
 var last_state := -1
 func _ready() -> void:
  _sync()
 func _process(_delta: float) -> void:
  _sync()
 func _sync() -> void:
  if not is_instance_valid(button):return
  var hover=button.is_hovered()
  var pressed=button.is_pressed()
  var focus=button.has_focus()
  var state=int(button.disabled)+int(hover)*2+int(pressed)*4+int(focus)*8
  if state==last_state:return
  last_state=state
  visible=not button.disabled and (hover or pressed or focus)
  var style=StyleBoxFlat.new()
  # Keep the wash light enough to preserve cream lettering on burnt orange.
  style.bg_color=Color(.30,.14,.04,.12) if pressed else Color(.94,.57,.22,.055 if hover else 0.0)
  style.border_color=Color("713b1d") if pressed or focus else Color("a66330")
  style.set_border_width_all(3 if focus else 2)
  style.set_corner_radius_all(4)
  style.set_content_margin_all(0)
  add_theme_stylebox_override("panel",style)
 func _draw() -> void:
  if is_instance_valid(button) and button.has_focus() and not button.disabled:
   # A light inner stroke remains visible on painted dark primary actions;
   # the dark outer stroke supplies the contrast on cream navigation art.
   draw_rect(Rect2(Vector2(3,3),size-Vector2(6,6)),Color("fff3d8"),false,1)

func _nav(text: String,icon: String,x: float,width: float,fn: Callable) -> Button:
 var b=_button(self,text,Rect2(x,876,width,48),fn,icon)
 b.name="StrictNav_"+icon
 b.add_theme_constant_override("icon_max_width",43)
 for state in ["normal","hover","pressed","hover_pressed","focus"]:
  b.add_theme_stylebox_override(state,StyleBoxEmpty.new())
 return b

func _legacy(key: String) -> void:
 if desk.fixture_buttons.has(key):desk.fixture_buttons[key].pressed.emit()

func _source_style(texture: Texture2D,cap := 6) -> StyleBoxTexture:
 var st=StyleBoxTexture.new();st.texture=texture
 for side in [SIDE_LEFT,SIDE_TOP,SIDE_RIGHT,SIDE_BOTTOM]:st.set_texture_margin(side,cap)
 return st

func _hit(parent: Node,text: String,rect: Rect2,fn: Callable) -> Button:
 var b=_button(parent,text,rect,fn)
 b.icon=null
 for state in ["normal","hover","pressed","hover_pressed","disabled","focus"]:b.add_theme_stylebox_override(state,StyleBoxEmpty.new())
 for key in ["font_color","font_hover_color","font_pressed_color","font_hover_pressed_color","font_disabled_color","font_focus_color"]:b.add_theme_color_override(key,Color.TRANSPARENT)
 return b

func _source_nav(text: String,key: String,rect: Rect2,fn: Callable) -> Button:
 var b=_hit(self,text,rect,fn);b.name="StrictNav_"+key;return b

func _build() -> void:
 letterbox=ColorRect.new();letterbox.name="StrictLetterbox";letterbox.color=INK
 letterbox.mouse_filter=Control.MOUSE_FILTER_IGNORE;add_child(letterbox)
 for rect in [Rect2(0,60,423,515),Rect2(423,60,763,403),Rect2(423,463,763,277),Rect2(423,740,763,126)]:
  var slice=AtlasTexture.new();slice.atlas=R.environment();slice.region=rect
  var art=_image(self,slice,rect);art.stretch_mode=TextureRect.STRETCH_SCALE;scenery.append(art)
 hud_art=_image(self,R.hud(),Rect2(0,0,1671,61));hud_art.stretch_mode=TextureRect.STRETCH_SCALE
 day=_label(self,"",Rect2(49,7,127,44),32,INK,true)
 business_label=_label(self,"",Rect2(184,7,90,46),31,Color("fff0d6"),false);business_label.name="StrictBusinessState";business_label.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
 rent=_label(self,"",Rect2(325,10,132,39),24,Color("705e49"),true)
 money=_label(self,"",Rect2(804,10,150,38),28,INK,true)
 ap=_label(self,"",Rect2(1000,10,92,38),28,INK,true)
 risk=_label(self,"",Rect2(1151,10,112,38),24,Color("705e49"),true)
 var ledger=_hit(self,"",Rect2(742,6,219,48),func():desk.shell.open_campaign_ledger());ledger.name="StrictCashLedger";ledger.tooltip_text="现金流水 · 查看账本"
 _hit(self,"事件",Rect2(476,8,101,43),func():_legacy("events"))
 for spec in [["手册","help","book-open"],["经营","plan","clipboard-list"],["声音","sound","volume-high"],["设置","settings","gear"]]:
  var key:String=spec[1]
  var b=_button(self,spec[0],Rect2(1294+utility_buttons.size()*92,4,84,52),func():desk._utility_clicked(key,null),spec[2])
  b.name="strict_utility_"+key;b.tooltip_text=spec[0]
  b.set_meta("touch_assist_no_expand",true)
  b.add_theme_font_override("font",R.font(true))
  b.add_theme_constant_override("h_separation",4)
  utility_buttons[key]=b
 display_scroll=ScrollContainer.new();display_scroll.name="StrictDisplayScroll"
 display_scroll.position=Vector2(34,159);display_scroll.size=Vector2(312,291)
 display_scroll.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_DISABLED;display_scroll.vertical_scroll_mode=ScrollContainer.SCROLL_MODE_AUTO;add_child(display_scroll)
 shelves=Control.new();shelves.custom_minimum_size=Vector2(304,286);display_scroll.add_child(shelves)
 face=_image(self,null,Rect2(474,94,383,362));face.stretch_mode=TextureRect.STRETCH_SCALE
 face.mouse_filter=Control.MOUSE_FILTER_STOP;face.mouse_default_cursor_shape=Control.CURSOR_POINTING_HAND
 face.gui_input.connect(func(event):
  if event is InputEventMouseButton and event.pressed and event.button_index==MOUSE_BUTTON_LEFT and Game.state.trade!=null and not desk._scene_blocked() and not desk.busy:
   if is_instance_valid(desk.customer):desk.customer.nod()
   desk.shell.open_people(Game.state.trade.npcId);face.accept_event())
 _image(self,R.name_skin(),Rect2(496,99,100,55)).name="StrictNamePaper"
 name_key=_label(self,"",Rect2(501,104,88,39),29,Color("fff0d6"),true);name_key.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
 var bubble=_image(self,R.bubble(),Rect2(760,157,285,101));bubble.name="StrictSpeechBubble";bubble.stretch_mode=TextureRect.STRETCH_SCALE
 speech=RichTextLabel.new();speech.position=Vector2(807,166);speech.size=Vector2(220,R.font(true).get_height(18)*3)
 speech.add_theme_font_override("normal_font",R.font(true));speech.add_theme_font_size_override("normal_font_size",18)
 speech.add_theme_color_override("default_color",INK);speech.add_theme_constant_override("line_separation",0);speech.scroll_active=true
 speech.mouse_filter=Control.MOUSE_FILTER_STOP;add_child(speech)
 bell_art=_image(self,R.bell(),Rect2(366,489,95,77));bell_art.stretch_mode=TextureRect.STRETCH_SCALE
 var bell_button=_hit(self,"",Rect2(366,489,95,77),func():desk._bell_clicked());bell_button.tooltip_text="接客铃 · 接待下一位来客"
 table=Control.new();table.mouse_filter=Control.MOUSE_FILTER_IGNORE;add_child(table)
 stock_art=NinePatchRect.new();stock_art.texture=R.stock_frame();stock_art.position=Vector2(5,575);stock_art.size=Vector2(418,278)
 stock_art.patch_margin_left=20;stock_art.patch_margin_right=20;stock_art.patch_margin_top=65;stock_art.patch_margin_bottom=20
 stock_art.mouse_filter=Control.MOUSE_FILTER_IGNORE;add_child(stock_art)
 stock_count=_label(self,"",Rect2(79,585,196,40),27,PAPER,true)
 _hit(self,"整理",Rect2(287,588,113,32),func():desk.shell.go("warehouse"))
 stock_scroll=ScrollContainer.new();stock_scroll.position=Vector2(20,640);stock_scroll.size=Vector2(393,185)
 stock_scroll.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_DISABLED;stock_scroll.vertical_scroll_mode=ScrollContainer.SCROLL_MODE_AUTO;add_child(stock_scroll)
 stock=GridContainer.new();stock.columns=6;stock.add_theme_constant_override("h_separation",2);stock.add_theme_constant_override("v_separation",3);stock_scroll.add_child(stock)
 wanted_paper=preload("res://scripts/ui/wanted_desk_paper.gd").new();add_child(wanted_paper)
 wanted_paper.setup(desk.shell);wanted_paper.position=Vector2(112,474);wanted_paper.size=Vector2(146,90)
 _bind_button_feedback(wanted_paper)
 var paper=Panel.new();paper.name="StrictTradePaper";paper.position=Vector2(1186,68);paper.size=Vector2(485,791)
 paper.mouse_filter=Control.MOUSE_FILTER_IGNORE;paper.add_theme_stylebox_override("panel",_style(PAPER,INK,8));add_child(paper)
 detail_layer=Control.new();detail_layer.name="TradeDetails";detail_layer.mouse_filter=Control.MOUSE_FILTER_IGNORE;add_child(detail_layer)
 meta_cover=_image(detail_layer,null,Rect2(1342,165,312,90))
 var item_plate=Panel.new();item_plate.position=Vector2(1218,108);item_plate.size=Vector2(110,146)
 item_plate.mouse_filter=Control.MOUSE_FILTER_IGNORE;item_plate.add_theme_stylebox_override("panel",_style(GREEN,INK,6));detail_layer.add_child(item_plate)
 selected=_image(detail_layer,null,Rect2(1231,119,83,122));selected.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
 item_name=_label(detail_layer,"",Rect2(1345,103,299,47),32,INK,true)
 item_name.add_theme_font_override("font",R.latin(true))
 item_meta=_label(detail_layer,"",Rect2(1384,168,108,36),22,INK,true)
 price_band=_label(detail_layer,"",Rect2(1531,168,120,36),22,INK,true)
 evidence=_label(detail_layer,"",Rect2(1384,210,110,37),22,INK,true)
 rounds=_label(detail_layer,"",Rect2(1530,210,122,37),22,INK,true)
 var evidence_key=_hit(detail_layer,"",Rect2(1344,210,145,37),_open_evidence);evidence_key.name="StrictEvidence";evidence_key.tooltip_text="选择用于议价的检验记录"
 var ribbon=Panel.new();ribbon.name="StrictAskRibbon";ribbon.position=Vector2(1208,276);ribbon.size=Vector2(440,63)
 ribbon.mouse_filter=Control.MOUSE_FILTER_IGNORE;ribbon.add_theme_stylebox_override("panel",_style(ORANGE,INK,6));detail_layer.add_child(ribbon)
 ask_caption=_label(detail_layer,"",Rect2(1255,290,113,44),27,PAPER,true);ask_caption.name="StrictAskCaption"
 ask=_label(detail_layer,"",Rect2(1498,284,137,46),32,Color("fff1d6"),false);ask.horizontal_alignment=HORIZONTAL_ALIGNMENT_RIGHT;ask.clip_text=true;ask.add_theme_font_override("font",R.latin())
 quote_controls.append(_image(detail_layer,R.region("quote-label",Rect2i(1210,359,88,49)),Rect2(1210,359,88,49)))
 quote=LineEdit.new();quote.position=Vector2(1298,355);quote.size=Vector2(144,57)
 quote.add_theme_constant_override("minimum_character_width",1);quote.alignment=HORIZONTAL_ALIGNMENT_LEFT
 quote.add_theme_font_override("font",R.latin(true));quote.add_theme_font_size_override("font_size",32);quote.add_theme_color_override("font_color",INK)
 quote.add_theme_color_override("font_uneditable_color",INK)
 quote.add_theme_color_override("font_selected_color",PAPER);quote.add_theme_color_override("selection_color",GREEN)
 quote.add_theme_color_override("caret_color",INK)
 var quote_style=_source_style(R.quote_skin(),8);quote_style.set_content_margin(SIDE_LEFT,17);quote_style.set_content_margin(SIDE_RIGHT,47)
 for state in ["normal","focus","read_only"]:quote.add_theme_stylebox_override(state,quote_style)
 _label(quote,"Cr",Rect2(88,8,47,39),32,INK,true).add_theme_font_override("font",R.latin(true))
 quote.text_changed.connect(func(_value):
  if not quote_syncing:quote_dirty=true)
 quote.text_submitted.connect(func(_value):
  if _commit_quote():quote.release_focus())
 detail_layer.add_child(quote);quote_controls.append(quote)
 for index in 4:
  var step:int=[-10,-1,1,10][index]
  var nudge_rect=Rect2(1448+index*51,361,51,44)
  var b=_hit(detail_layer,str(step),nudge_rect,func():_nudge(step))
  _image(b,R.region("nudge-"+str(index),Rect2i(nudge_rect)),Rect2(0,0,51,44));quote_controls.append(b)
 cost_cover=_image(detail_layer,null,Rect2(1207,419,443,44))
 cost=_label(detail_layer,"",Rect2(1253,420,394,41),22,INK,true)
 var rects=[Rect2(1201,489,96,108),Rect2(1297,490,91,106),Rect2(1389,490,90,106),Rect2(1480,490,88,106),Rect2(1569,490,90,106)]
 for index in 5:
  var slot:int=index
  var captions=["出价","接受","鉴定","抵押","送客"]
  var icons=["gavel","handshake","magnifying-glass","file-lines","right-from-bracket"]
  var b=_button(detail_layer,captions[index],rects[index],func():_trade_action(slot),icons[index],PAPER,true);b.name="StrictTradeAction_"+str(index)
  for state in ["normal","hover","pressed","disabled","focus"]:b.add_theme_stylebox_override(state,StyleBoxEmpty.new())
  var art=_image(b,UIKit.orange_art(R.source_button(index)),Rect2(Vector2.ZERO,R.source_button(index).get_size()));art.stretch_mode=TextureRect.STRETCH_SCALE;art.name="ActionSkin";b.move_child(art,0)
  b.get_node("ActionCaption").hide();b.get_node("ActionIcon").hide();trade_buttons.append(b)
 secondary=_hit(detail_layer,"",Rect2(1248,610,368,57),func():
  if not desk.dialogue_put_aside.disabled:desk.dialogue_put_aside.pressed.emit())
 _image(secondary,R.region("secondary",Rect2i(1248,610,368,57)),Rect2(0,0,368,57)).name="SecondarySkin"
 _label(secondary,"",Rect2(140,7,218,40),24,INK,true).name="SecondaryCaption"
 _image(secondary,R.region("secondary-icon",Rect2i(1334,623,40,31)),Rect2(86,13,40,31)).name="SecondaryIcon"
 stage_hint=_label(detail_layer,"",Rect2(1210,670,430,25),16,Color("70604a"))
 quick_list=preload("res://scripts/ui/quick_trade_list.gd").new();add_child(quick_list);quick_list.setup(self)
 var orders=_hit(self,"",Rect2(1198,711,233,113),func():desk.shell.go("orders"));orders.name="StrictOrders"
 _image(orders,R.orders_skin(),Rect2(0,0,233,113))
 order_count=_label(orders,"",Rect2(70,52,145,40),25,INK,true)
 var people=_hit(self,"人物档案",Rect2(1437,711,223,113),func():desk.shell.open_people());people.name="StrictPeople"
 _image(people,R.region("people",Rect2i(1437,711,223,113)),Rect2(0,0,223,113))
 footer_art=_image(self,R.region("footer",Rect2i(0,866,1671,75)),Rect2(0,866,1671,75));footer_art.stretch_mode=TextureRect.STRETCH_SCALE
 _source_nav("日结打烊","sun",Rect2(35,875,250,53),func():desk.shell.go("report"))
 _source_nav("报警","bell",Rect2(335,875,197,53),func():desk.alarm_button.pressed.emit())
 _source_nav("仓储隔离","box-archive",Rect2(568,875,243,53),func():desk.shell.go("warehouse"))
 _source_nav("鉴定仪","gauge-high",Rect2(856,875,184,53),func():desk._open_instrument("inspect"))
 _source_nav("维修台","screwdriver-wrench",Rect2(1104,875,194,53),func():desk._open_instrument("repair"))
 _hit(self,"返回",Rect2(1510,875,144,53),func():desk.shell.go("counter"))
 own=Control.new();own.mouse_filter=Control.MOUSE_FILTER_IGNORE;add_child(own)
 detail_tools=VBoxContainer.new();detail_tools.position=Vector2(1210,360);detail_tools.size=Vector2(430,310);detail_tools.add_theme_constant_override("separation",10);own.add_child(detail_tools)
 for spec in [["放大镜 · 查看标识","TOL-001"],["紫外灯 · 核对编号","TOL-002"],["电子秤 · 称量手表","TOL-005"]]:
  var tool:String=spec[1];var key=UIKit.button(spec[0],"secondary",Vector2(425,47),23);key.pressed.connect(func():desk.showroom.open_tool(tool));detail_tools.add_child(key)
 var ret=UIKit.button("放回原位","primary",Vector2(425,47),23);ret.pressed.connect(func():desk.showroom.return_original();dirty=true);detail_tools.add_child(ret)
 var arrange=UIKit.button("整理 / 调价","secondary",Vector2(425,47),23);arrange.pressed.connect(func():desk.shell.go("warehouse",desk.showroom.selected_uid));detail_tools.add_child(arrange)
 _configure_dialogue_actors()

func _layout_desktop() -> void:
 if desk.shell.mobile_mode():return
 var extent=get_viewport().get_visible_rect().size/scale
 position=-desk.shell.counter_offset()
 if extent.is_equal_approx(layout_extent):
  _layout_utilities()
  return
 layout_extent=extent;size=extent;extra_space=extent-REFERENCE_SIZE
 var wide=extent.x/REFERENCE_SIZE.x
 for node in layout_rects:
  if not is_instance_valid(node):continue
  var rect:Rect2=layout_rects[node]
  node.position=rect.position;node.size=rect.size
  if node is TextureRect and node in scenery:continue
  if node in [letterbox,hud_art,footer_art,stock_art,table] or node in utility_buttons.values():continue
  if node in [detail_layer,own]:node.position.x+=extra_space.x
  elif rect.position.y>=866:
   node.position+=Vector2(rect.position.x*(wide-1),extra_space.y);node.size.x*=wide
  elif rect.position.x>=1186:
   node.position.x+=extra_space.x
   if node in [quick_list,get_node("StrictTradePaper")]:node.size.y+=extra_space.y
   elif rect.position.y>=711:node.position.y+=extra_space.y
  elif rect.position.y<61 and rect.size.x>0:
   node.position.x*=wide;node.size.x*=wide
  elif rect.position.x>=423:node.position.x+=extra_space.x*.5
 letterbox.position=Vector2.ZERO;letterbox.size=extent
 hud_art.size.x=extent.x
 footer_art.position.y=866+extra_space.y;footer_art.size.x=extent.x
 scenery[1].size.x=763+extra_space.x
 scenery[2].size=Vector2(763+extra_space.x,277+extra_space.y)
 scenery[3].position.y=740+extra_space.y;scenery[3].size.x=763+extra_space.x
 stock_art.size.y=278+extra_space.y
 stock_scroll.size.y=185+extra_space.y
 quick_list.fit_height(791+extra_space.y)
 _layout_dialogue_actors()
 _layout_utilities()
 signature="";dirty=true

func _layout_utilities() -> void:
 # Layout visible skins and input together, independent of stretched HUD art.
 # touch_scale includes viewport scaling and Web DPR, so these are CSS sizes.
 var css=maxf(.01,desk.shell.touch_scale()*absf(get_global_transform_with_canvas().get_scale().x))
 var css_y=maxf(.01,desk.shell.touch_scale()*absf(get_global_transform_with_canvas().get_scale().y))
 var wide=size.x/REFERENCE_SIZE.x
 var width=maxf(84*wide,52/css)
 var gap=maxf(8*wide,6/css)
 var height=maxf(52,44/css_y)
 var start=size.x-12*wide-4*width-3*gap
 var index=0
 for key in utility_buttons:
  var b:Button=utility_buttons[key]
  b.position=Vector2(start+index*(width+gap),maxf(0,(61-height)*.5))
  b.size=Vector2(width,height)
  b.add_theme_font_size_override("font_size",maxi(17,ceili(13/css)))
  b.add_theme_constant_override("icon_max_width",maxi(20,ceili(16/css)))
  index+=1

func _table_project(point:Vector2) -> Vector2:
 return Vector2(423+(point.x-423)*(763+extra_space.x)/763,point.y+extra_space.y*(.18 if point.y<570 else .6))

func _trade_action(index: int) -> void:
 var keys=desk.actions.get_children()
 if index<keys.size() and not keys[index].disabled:
  if keys[index].text.begins_with("出价") and not _commit_quote():return
  keys[index].pressed.emit()

func _quick_valid(uid: String,trade_id: String,version: int,price: float) -> bool:
 if desk.busy or desk._scene_blocked() or not CounterDialogue.active(Game.state):return false
 if str(Game.state.trade.id)!=trade_id or int(TradeSession.session(Game.state).version)!=version:return false
 if uid=="":return is_equal_approx(TradeSession.summary(Game.state).net,price)
 if not CounterDialogue.table_items(Game.state).any(func(info):return info.uid==uid):return false
 var row=TradeSession.row(Game.state,uid)
 return not row.is_empty() and is_equal_approx(float(row.context.price),price)

func _quick_focus(uid: String) -> void:
 desk._focus_table(uid);desk._refresh();dirty=true

func _quick_action(verb: String,uid: String,trade_id: String,version: int,price: float) -> void:
 if not _quick_valid(uid,trade_id,version,price):dirty=true;return
 if verb=="checkout":
  if TradeSession.summary(Game.state).buy_count+TradeSession.summary(Game.state).sell_count>0:
   Game.dispatch(CounterDialogue.action_for(Game.state,"DELIVER"))
  return
 if verb=="send":Game.dispatch({"type":"REFUSE"});return
 _quick_focus(uid)
 var context={"uid":uid,"trade_id":trade_id,"version":int(TradeSession.session(Game.state).version),"price":float(TradeSession.row(Game.state,uid).context.price)}
 match verb:
  "toggle":
   if TradeSession.row(Game.state,uid).selected:Game.dispatch(CounterDialogue.action_for(Game.state,"COUNTER_UNSELECT"))
   else:desk._accept_with_source_risk()
  "inspect":desk.shell.go("inspect",uid)
  "offer":quick_list.offer_popup(context)
  "more":quick_list.more_popup(context)
 dirty=true

func _quick_offer(context: Dictionary,amount: int) -> void:
 if not _quick_valid(context.uid,context.trade_id,context.version,context.price):dirty=true;return
 _quick_focus(context.uid)
 if amount<desk.dial.min_value or amount>desk.dial.max_value:return
 desk.dial.set_value(amount)
 desk._offer(context.uid,int(TradeSession.session(Game.state).version));dirty=true

func _quick_source(context: Dictionary,caption: String) -> void:
 if not _quick_valid(context.uid,context.trade_id,context.version,context.price):dirty=true;return
 _quick_focus(context.uid)
 for source in desk.actions.get_children()+[desk.dialogue_put_aside]:
  if source.text==caption and not source.disabled:source.pressed.emit();dirty=true;return

func _process(delta: float) -> void:
 visible=not desk.shell.mobile_mode()
 if not visible:return
 var old=desk.find_child("DesktopCounter",true,false)
 if old!=null:old.hide()
 desk.stage_root.hide();desk.back_root.hide()
 desk.shell.hint_label.hide()
 _layout_desktop()
 clock+=delta;period+=delta
 if is_instance_valid(desk.bell) and not Game.prefs.reduced_motion:
  bell_art.pivot_offset=bell_art.size*.5
  bell_art.rotation=desk.bell.rotation
 if dirty or period>.10:
  _refresh(dirty);dirty=false;period=0.0
 _update_visitor_pose()
 _advance_visible_departure()
 speech.visible_ratio=desk.bubble_label.visible_ratio

func _refresh(force := false) -> void:
 if desk==null:return
 var s=Game.state;var t=s.trade
 day.text="第%d天"%int(s.day)
 utility_buttons.sound.icon=A.icon("volume-high" if Game.prefs.sound else "volume-xmark")
 business_label.text="营业" if s.phase=="open" else "休息" if s.phase=="closed" else "结束"
 if int(s.day)%7==0:rent.text="租金待交" if Landlord.outstanding(s)>0 else "租金已交"
 else:rent.text="租期余%d天"%(7-(int(s.day)%7))
 money.text=Model.jnum(s.cash)+" Cr";ap.text="AP %d"%int(s.ap);risk.text="关注 %d"%int(s.risk)
 var current=Model.trade_item(s) if t!=null else null
 var ordinary=t!=null and t.get("kind","") in ["buy","sell"]
 var preview=Game.item(desk.showroom.selected_uid) if t==null else null
 var it=preview if preview!=null else current
 own.visible=preview!=null
 for button in detail_tools.get_children():button.disabled=desk.busy or desk._scene_blocked()
 for child in trade_buttons:child.visible=preview==null
 for control in quote_controls:control.visible=preview==null and ordinary
 selected.texture=A.watch(it,false,"selected") if it!=null else A.icon("store" if t!=null and t.kind=="merchant" else "shield-halved" if t!=null and t.kind=="police" else "coins" if t!=null and t.kind=="landlord" else "bell")
 selected.modulate=Color.WHITE if it!=null else PAPER
 meta_cover.visible=it==null;cost_cover.visible=not ordinary and preview==null
 detail_layer.get_node("StrictEvidence").visible=it!=null and ordinary
 var fullname=GameData.def(it.defId).name if it!=null else ""
 var parts=fullname.split(" ")
 item_name.text=(parts[0]+" "+parts[1]) if parts.size()>1 else fullname if it!=null else desk.scr.head.text if t!=null else "等待来客"
 item_name.tooltip_text=fullname;item_name.clip_text=true
 price_band.visible=it!=null;evidence.visible=it!=null;rounds.visible=it!=null
 if it!=null:
  item_meta.tooltip_text=""
  var estimate=Model.estimate(it)
  item_meta.text=(parts[2]+"表") if parts.size()>2 else "手表"
  item_meta.position=Vector2(1384,168);item_meta.size=Vector2(108,36);item_meta.autowrap_mode=TextServer.AUTOWRAP_OFF;item_meta.max_lines_visible=-1
  price_band.text="%s–%s"%[Model.jnum(estimate.low),Model.jnum(estimate.high)]
  evidence.text="物证 %d"%Model.evidence_count(it)
  rounds.text="已商谈 %d次"%int(t.get("rounds",0) if t!=null else 0)
  selected.tooltip_text=fullname+" · 品相 "+UIKit.pct(it.condition)
  selected.mouse_filter=Control.MOUSE_FILTER_STOP
 else:
  item_meta.text=(desk.scr.line1.text+"\n"+desk.scr.line2.text) if t!=null else "整理货物\n按服务铃接待来客"
  item_meta.position=Vector2(1347,168);item_meta.size=Vector2(296,76);item_meta.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART;item_meta.max_lines_visible=2
  item_meta.tooltip_text=item_meta.text;selected.tooltip_text="";selected.mouse_filter=Control.MOUSE_FILTER_IGNORE
 ask_caption.text="挂牌" if preview!=null else "要价" if ordinary and t.kind=="buy" else "报价" if ordinary else "租金" if t!=null and t.kind=="landlord" else "商品" if t!=null and t.kind=="merchant" else "协查" if t!=null and t.kind=="police" else "今日接待"
 ask.text=(Model.jnum(preview.listPrice)+" Cr" if float(preview.get("listPrice",0))>0 else "未定价") if preview!=null else Model.jnum(t.get("price",0))+" Cr" if ordinary else desk.scr.price.text
 var ask_width=R.latin().get_string_size(ask.text,HORIZONTAL_ALIGNMENT_LEFT,-1,32).x
 ask.add_theme_font_size_override("font_size",mini(32,maxi(17,int(32*132/maxf(132,ask_width)))))
 var cash_width=R.font(true).get_string_size(money.text,HORIZONTAL_ALIGNMENT_LEFT,-1,25).x
 money.add_theme_font_size_override("font_size",mini(25,maxi(15,int(25*150/maxf(150,cash_width)))))
 quote.editable=ordinary and not t.get("locked",false) and not desk.busy
 for control in quote_controls:
  if control is Button:control.disabled=not ordinary or t.get("locked",false) or desk.busy
 var draft_key=str(t.get("id",""))+"/"+str(it.uid if it!=null else "") if t!=null else ""
 if draft_key!=quoted_uid or not quote.editable:
  quoted_uid=draft_key;quote_dirty=false
 if not quote.has_focus() and not quote_dirty:
  quote_syncing=true;quote.text=str(int(desk.dial.value));quote_syncing=false
 var draft_width=R.latin(true).get_string_size(quote.text,HORIZONTAL_ALIGNMENT_LEFT,-1,32).x
 quote.add_theme_font_size_override("font_size",mini(32,maxi(18,int(32*76/maxf(76,draft_width)))))
 cost.position=Vector2(1253,420) if ordinary else Vector2(1213,364)
 cost.text=desk.scr.line3.text.replace(" · ","  •  ") if desk.scr.line3.visible else ""
 cost.clip_text=true;cost.tooltip_text=cost.text
 cost.autowrap_mode=TextServer.AUTOWRAP_OFF if ordinary else TextServer.AUTOWRAP_WORD_SMART
 cost.max_lines_visible=1 if ordinary else 2;cost.size=Vector2(394,41) if ordinary else Vector2(434,90)
 var cost_width=R.font(true).get_string_size(cost.text,HORIZONTAL_ALIGNMENT_LEFT,-1,22).x
 var cost_font=mini(22,maxi(16,int(22*394/maxf(394,cost_width)))) if ordinary else 20
 cost.add_theme_font_size_override("font_size",cost_font)
 stage_hint.text=desk.footer.text
 stage_hint.visible=false
 secondary.tooltip_text=desk.footer.text+" · "+desk.dialogue_put_aside.text
 secondary.text=desk.dialogue_put_aside.text
 var same_secondary=secondary.text=="这件先不买"
 secondary.get_node("SecondaryCaption").visible=not same_secondary
 secondary.get_node("SecondaryIcon").visible=not same_secondary
 secondary.get_node("SecondaryCaption").text=secondary.text
 secondary.get_node("SecondarySkin").texture=R.region("secondary",Rect2i(1248,610,368,57)) if same_secondary else R.secondary_blank()
 secondary.visible=t!=null and CounterDialogue.active(s)
 secondary.disabled=desk.dialogue_put_aside.disabled
 order_count.text="%d 待办"%s.orders.filter(func(o):return o.status=="active").size()
 _sync_visitor(t)
 var speaking=t!=null and visitor_phase=="standing"
 name_key.visible=speaking;get_node("StrictNamePaper").visible=speaking
 var bubble=get_node("StrictSpeechBubble");bubble.visible=speaking;speech.visible=speaking
 if t!=null:
  name_key.text=GameData.npc(t.npcId).name
  var raw=desk.bubble_label.get_parsed_text()
  var boilerplate="这只%s我想出手，开价%s Cr。你先看看，价钱咱们可以谈。"%[fullname,Model.jnum(t.get("price",0))]
  _sync_speech(("这只表，%s Cr。\n你看看。"%Model.jnum(t.get("price",0))) if raw==boilerplate else raw)
  speech.tooltip_text=""
 for i in trade_buttons.size():
  var keys=desk.actions.get_children();trade_buttons[i].disabled=i>=keys.size() or keys[i].disabled or desk.busy
  trade_buttons[i].visible=preview==null and i<keys.size()
  if i<keys.size():
   var source_text: String=keys[i].text
   trade_buttons[i].tooltip_text=keys[i].tooltip_text
   trade_buttons[i].text=keys[i].text
   var caption="交割" if "交割" in source_text else "出价" if source_text.begins_with("出价") else "接受" if source_text.begins_with("接受") else "鉴定" if "鉴定" in source_text else "抵押" if "抵押" in source_text else "送客" if "送客" in source_text else "取消" if "取消" in source_text or "先不算" in source_text else "商品" if "商品" in source_text else "缴租" if "缴纳" in source_text else "稍后" if "筹钱" in source_text else "检查" if "检查" in source_text else "名单" if "名单" in source_text else "接待" if "接待" in source_text else "打烊" if "打烊" in source_text else source_text.left(4)
   trade_buttons[i].get_node("ActionCaption").text=caption
   var source_caption=["出价","接受","鉴定","抵押","送客"][i]
   var original_skin=caption==source_caption
   trade_buttons[i].get_node("ActionSkin").texture=UIKit.orange_art(R.source_button(i) if original_skin else R.blank_button(i))
   trade_buttons[i].get_node("ActionCaption").visible=not original_skin
   trade_buttons[i].get_node("ActionIcon").visible=not original_skin
   trade_buttons[i].get_node("ActionCaption").add_theme_color_override("font_color",Color("fff1d6") if i==0 else INK)
   trade_buttons[i].get_node("ActionIcon").modulate=Color("fff1d6") if i==0 else INK
   var glyph={"交割":"handshake","出价":"gavel","接受":"handshake","鉴定":"magnifying-glass","抵押":"file-lines","送客":"right-from-bracket","取消":"arrow-rotate-left","选货":"box-archive","商品":"store","缴租":"coins","检查":"shield-halved","名单":"clipboard-list","接待":"bell","打烊":"sun"}
   trade_buttons[i].get_node("ActionIcon").texture=A.icon(glyph.get(caption,"file-lines"))
  trade_buttons[i].modulate.a=1.0
 var inv_key=JSON.stringify([s.inventory,s.get("showroomLayout",{}),WantedCases.has_notice(s)])
 if inv_key!=stock_signature:
  stock_signature=inv_key;_inventory()
 var list_active=CounterDialogue.active(s) and ordinary
 detail_layer.visible=not list_active;quick_list.visible=list_active
 get_node("StrictTradePaper").visible=not list_active
 if list_active:quick_list.refresh(s)
 var backs=""
 for uid in desk.counter_table.sprites:backs+=str(desk.counter_table.sprites[uid].back)
 var table_key=str(CounterDialogue.table_items(s))+str(TradeSession.session(s).get("table_positions",{}))+str(desk.showroom.selected_uid)+str(desk.showroom.preview_back)+backs
 if table_key!=signature:
  signature=table_key;_table()

func _inventory() -> void:
 for container in [stock,shelves]:
  for c in container.get_children():c.free()
 var goods: Array=Game.state.inventory
 stock_count.text="本店库存 %d" % goods.size()
 wanted_paper.refresh()
 var layout=preload("res://scripts/model/showroom_layout.gd")
 layout.ensure(Game.state)
 var last_stock=-1
 for slot in Game.state.showroomLayout.warehouse.values():last_stock=maxi(last_stock,int(slot))
 for index in range(last_stock+1):
  var it=Game.item(layout.uid_at(Game.state,"warehouse",index))
  if it==null:
   var empty=preload("res://scripts/ui/showroom_slot.gd").new();empty.showroom=desk.showroom;empty.location="warehouse";empty.slot=index
   empty.name="strict_empty_warehouse_"+str(index);empty.custom_minimum_size=Vector2(63,91)
   for state in ["normal","hover","pressed","focus"]:empty.add_theme_stylebox_override(state,StyleBoxEmpty.new())
   _bind_button_feedback(empty)
   stock.add_child(empty)
  else:
   var key=_stock_button(it,false,Vector2(63,91));stock.add_child(key);UIKit.decorate_item(key,it,16)
   var crest=key.find_child("tier_crest",true,false)
   if crest!=null:crest.hide()
 var last_display=-1
 for slot in Game.state.showroomLayout.display.values():last_display=maxi(last_display,int(slot))
 var visible_slots=mini(layout.capacity(Game.state,"display"),maxi(6,ceili(float(last_display+2)/3.0)*3))
 shelves.custom_minimum_size=Vector2(276,_display_position(visible_slots-1).y+130)
 shelves.size_flags_horizontal=Control.SIZE_EXPAND_FILL
 for index in visible_slots:
  var uid=layout.uid_at(Game.state,"display",index)
  var it=Game.item(uid)
  if it==null:
   # Empty targets stay invisible until hovered, including the third place
   # on a partly filled row and the next available row.
   var empty=preload("res://scripts/ui/showroom_slot.gd").new();empty.showroom=desk.showroom;empty.location="display";empty.slot=index
   empty.name="strict_empty_display_"+str(index);empty.custom_minimum_size=Vector2(90,130);empty.size=Vector2(90,130);empty.position=_display_position(index)
   for state in ["normal","hover","pressed","focus"]:empty.add_theme_stylebox_override(state,StyleBoxEmpty.new())
   _bind_button_feedback(empty)
   shelves.add_child(empty)
  else:
   var key=_stock_button(it,true,Vector2(90,130));shelves.add_child(key);key.position=_display_position(index);key.size=Vector2(90,130);UIKit.decorate_item(key,it,16)

func _display_position(index: int) -> Vector2:
 # Reserve the bar even on a partly filled row so columns stay still when
 # the next row becomes scrollable, rather than clipping the third price.
 var width=maxf(276,display_scroll.size.x-display_scroll.get_v_scroll_bar().get_combined_minimum_size().x)
 return Vector2(3+(index%3)*(width-96)*.5,floori(index/3.0)*145)

func _stock_button(it,display: bool,extent: Vector2) -> Button:
 var b=preload("res://scripts/ui/showroom_slot.gd").new()
 b.name="strict_stock_"+str(it.uid);b.showroom=desk.showroom;b.uid=it.uid;b.location=it.location
 b.slot=int(Game.state.showroomLayout.get(it.location,{}).get(it.uid,-1));b.custom_minimum_size=extent
 for state in ["normal","hover","pressed","focus","disabled"]:
  b.add_theme_stylebox_override(state,StyleBoxEmpty.new() if display else _source_style(R.stock_slot(),5))
 var texture=A.watch(it,false,"display" if display else "stock")
 var picture_rect=Rect2(5,5,52,80)
 if display:
  picture_rect=Rect2(14,5,70,87)
  if texture.has_meta("approved_art"):picture_rect=Rect2(Vector2(14+maxf(0,(70-texture.get_width())*.5),5),texture.get_size())
 _image(b,texture,picture_rect)
 b.tooltip_text=GameData.def(it.defId).name+" · "+UIKit.pct(it.condition)
 if display:
  var price=_label(b,Model.jnum(it.get("listPrice",0))+" Cr",Rect2(3,90,84,39),20,INK,true)
  price.clip_text=true
  var label_width=price.get_theme_font("font").get_string_size(price.text,HORIZONTAL_ALIGNMENT_LEFT,-1,20).x
  price.add_theme_font_size_override("font_size",mini(20,maxi(12,floori(20.0*80/maxf(80,label_width)))))
  price.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER;var price_style=_source_style(R.price_tag(false,true),6);price_style.set_content_margin_all(0)
  price.add_theme_stylebox_override("normal",price_style)
 b.pressed.connect(func():
  if desk.busy or desk._scene_blocked():return
  var t=Game.state.trade
  var picking=CounterDialogue.active(Game.state) or (t!=null and t.kind=="sell" and not t.has("selectedUid") and not t.locked)
  var current=Game.item(str(it.uid))
  if current==null:return
  var why=Model.sale_eligibility(current,t.npcId) if picking else null
  desk._stock_clicked(str(current.uid),picking,why);dirty=true)
 _bind_button_feedback(b)
 return b

func _table_points(direction: String,count: int) -> Array[Vector2]:
 # Project the entire canonical slot range, including holes after checkout,
 # into the visible counter. The same projection is used for dragging.
 var capacity=CounterDialogue._table_slots(direction,count).size()
 var single=direction=="buy" and count==1
 var start=700.0 if single else 524.0 if direction=="buy" else 510.0
 var spacing=120.0 if single else (1107.0-start)/maxi(capacity-1,1)
 var points:Array[Vector2]=[]
 for index in capacity:points.append(_table_project(Vector2(start+index*spacing,501 if direction=="buy" else 625)))
 return points

func _table() -> void:
 var previous := {}
 for child in table.get_children():
  if child is TradeWatch:
   var visual=child.get_node("WatchVisual")
   previous[child.uid]=child.position+visual.position
 for c in table.get_children():c.free()
 var shown=CounterDialogue.table_items(Game.state)
 var buys=shown.filter(func(info):return info.direction=="buy")
 var sells=shown.filter(func(info):return info.direction!="buy")
 for group in [buys,sells]:
  if group.is_empty():continue
  var direction:String=group[0].direction
  var slots=CounterDialogue._table_slots(direction,group.size())
  var points=_table_points(direction,group.size())
  var visitor=direction=="buy"
  var tag_width=120.0 if visitor and group.size()==1 else 76.0 if slots.size()==8 else 108.0 if visitor else 90.0
  for index in group.size():
   var info=group[index];var it=TradeSession.item(Game.state,info.uid)
   if it==null:continue
   var slot_index=index
   var saved=TradeSession.session(Game.state).get("table_positions",{}).get(info.uid,[])
   if saved is Array and saved.size()==2:
    var found=slots.find(Vector2(float(saved[0]),float(saved[1])))
    if found>=0:slot_index=found
   var key=_table_watch(it,points[clampi(slot_index,0,points.size()-1)],info.price,info.focused,func():
    Game.dispatch({"type":"COUNTER_FOCUS","tradeId":Game.state.trade.id,"uid":info.uid});dirty=true,visitor,tag_width)
   _animate_table_watch(key,previous,visitor)
 if Game.state.trade==null and desk.showroom.selected_uid!="":
  var it=Game.item(desk.showroom.selected_uid)
  if it!=null:
   var key=_table_watch(it,_table_project(Vector2(700,505)),it.get("listPrice",0),true,func():desk.showroom.flip_original();dirty=true,true,120)
   _animate_table_watch(key,previous,false)
 watch_sources.clear()

func _table_watch(it,center: Vector2,price: float,focus: bool,fn: Callable,visitor:=false,tag_width:=90.0) -> Button:
 var b=TradeWatch.new();b.mouse_default_cursor_shape=Control.CURSOR_POINTING_HAND;b.controller=self;b.uid=it.uid;b.name="strict_table_"+str(it.uid)
 b.position=center-Vector2(tag_width/2,43);b.size=Vector2(tag_width,118 if visitor else 130)
 for state in ["normal","hover","pressed","focus"]:b.add_theme_stylebox_override(state,StyleBoxEmpty.new())
 table.add_child(b)
 var visual=Control.new();visual.name="WatchVisual";visual.mouse_filter=Control.MOUSE_FILTER_IGNORE;visual.size=b.size;b.add_child(visual)
 var is_back=desk.showroom.preview_back if Game.state.trade==null else desk.counter_table.sprites.has(it.uid) and desk.counter_table.sprites[it.uid].back
 var texture=A.watch(it,is_back,"visitor" if visitor else "table")
 var art_rect=Rect2((tag_width-56)/2,0,56,78 if visitor else 84)
 if not is_back and texture.has_meta("native_anchor"):
  art_rect=Rect2(Vector2(tag_width/2,43)-texture.get_meta("native_anchor"),texture.get_size())
  if visitor and art_rect.size.y>78:
   art_rect.size*=78.0/art_rect.size.y;art_rect.position=Vector2((tag_width-art_rect.size.x)/2,0)
 var shadow=R.shadow_for(it,visitor)
 if shadow!=null:_image(visual,shadow,Rect2(Vector2(tag_width/2,43)-shadow.get_meta("native_anchor"),shadow.get_size()))
 var art=_image(visual,texture,art_rect);art.name="WatchArt"
 if watch_sides.has(it.uid) and watch_sides[it.uid]!=is_back:
  if Game.prefs.reduced_motion:
   art.modulate.a=.55;art.create_tween().tween_property(art,"modulate:a",1.0,.16)
  else:
   art.pivot_offset=art.size*.5;art.scale.x=.04
   art.create_tween().tween_property(art,"scale:x",1.0,.18).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
 watch_sides[it.uid]=is_back
 b.gui_input.connect(func(event):
  if event is InputEventMouseButton and event.pressed and event.button_index==MOUSE_BUTTON_RIGHT and not desk.busy and not desk._scene_blocked():
   if Game.state.trade!=null:
    desk._focus_table(it.uid)
    if desk.counter_table.sprites.has(it.uid):desk.counter_table.sprites[it.uid].flip()
   else:desk.showroom.flip_original()
   dirty=true;b.accept_event())
 var tag_font=24 if visitor and tag_width>110 else 20
 var tag=_label(b,"未定价" if Game.state.trade==null and price<=0 else Model.jnum(price)+" Cr",Rect2(0,82 if visitor else 93,tag_width,34 if visitor else 37),tag_font,Color("f7e7c6"))
 tag.name="PriceTag";tag.clip_text=true
 var text_width=tag.get_theme_font("font").get_string_size(tag.text,HORIZONTAL_ALIGNMENT_LEFT,-1,tag_font).x
 tag.add_theme_font_size_override("font_size",mini(tag_font,maxi(14,int(tag_font*(tag_width-8)/maxf(tag_width-8,text_width)))))
 _decorate_original(b,it,tag_width<90)
 tag.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
 var normal_tag=_source_style(R.price_tag(true) if focus else R.visitor_tag() if visitor else R.price_tag(false),4);normal_tag.set_content_margin_all(0)
 tag.add_theme_stylebox_override("normal",normal_tag)
 if focus:tag.add_theme_color_override("font_color",Color("efb34f"))
 var arrow=_image(b,R.region("selection-arrow",Rect2i(996,565,18,11)),Rect2(tag_width/2-9,-17,18,11));arrow.visible=focus and not visitor
 b.mouse_entered.connect(func():
  var hover_tag=_source_style(R.price_tag(true),4);hover_tag.set_content_margin_all(0)
  tag.add_theme_stylebox_override("normal",hover_tag);tag.add_theme_color_override("font_color",Color("efb34f"));arrow.visible=center.y>560)
 b.mouse_exited.connect(func():
  tag.add_theme_stylebox_override("normal",normal_tag);tag.add_theme_color_override("font_color",Color("efb34f") if focus else Color("f7e7c6"));arrow.visible=focus and not visitor)
 b.pressed.connect(func():
  if not desk.busy and not desk._scene_blocked():fn.call())
 _bind_button_feedback(b)
 return b

func _decorate_original(button: Control,it,compact:=false) -> void:
 var inset=Vector2((button.size.x-64)/2,0)
 if UIKit.presentation_tier(it) in ["luxury","ultra"]:
  _image(button,R.crest(),Rect2(inset+Vector2(42,0),Vector2(24,25)) if compact else Rect2(inset+Vector2(41,0),Vector2(27,28))).name="tier_crest"
 if UIKit.is_modified(it):_image(button,R.modified(),Rect2(inset+Vector2(0,36),Vector2(22,22)) if compact else Rect2(inset+Vector2(-18,39),Vector2(33,31))).name="modified_badge"

func _unhandled_key_input(event: InputEvent) -> void:
 if not visible or quote.has_focus() or desk.busy or desk._scene_blocked():return
 if event is InputEventKey and event.pressed and not event.echo:
  match event.keycode:
   KEY_1:desk.shell.go("report");get_viewport().set_input_as_handled()
   KEY_2:desk.alarm_button.pressed.emit();get_viewport().set_input_as_handled()
   KEY_3:desk.shell.go("warehouse");get_viewport().set_input_as_handled()

func _can_drop_data(at_position: Vector2,data) -> bool:
 if desk.busy or desk._scene_blocked() or not data is Dictionary:return false
 if data.get("kind","") in ["strict_trade","showroom_original"] and stock_art.get_rect().has_point(at_position):
  return _stock_return_problem(data)==""
 if data.get("kind","")=="strict_trade":
  return Game.state.trade!=null and Rect2(430,463,750+extra_space.x,280+extra_space.y).has_point(at_position) and not TradeSession.row(Game.state,str(data.get("uid",""))).is_empty()
 if data.get("kind","")=="showroom_original":
  return Game.state.trade==null and desk.showroom.available(Game.item(str(data.get("uid","")))) and (Rect2(0,140,370,330).has_point(at_position) or Rect2(430,463,750+extra_space.x,280+extra_space.y).has_point(at_position))
 return false

func _stock_return_problem(data: Dictionary) -> String:
 var uid=str(data.get("uid",""))
 var why:=CounterDialogue.storage_problem(Game.state,uid)
 if why!="":return why
 if Game.state.trade!=null:
  if data.get("kind","")!="strict_trade" or data.get("trade_id","")!=Game.state.trade.id or data.get("version",-1)!=TradeSession.session(Game.state).get("version",-1):return "商谈内容已经变化，请重新取这只表。"
  var offered:=TradeSession.row(Game.state,uid)
  if offered.is_empty() or offered.get("direction","")!="sell" or not offered.get("included",false) or offered.get("status","")=="done":return "这只原物已不在当前商谈中。"
 elif data.get("kind","")!="showroom_original":return "这次来访已经结束，请重新取表。"
 return ""

func _return_table_original_to_stock(data: Dictionary) -> void:
 var uid=str(data.uid)
 var original=Game.item(uid)
 var from:=_watch_center(uid);var texture:=_watch_texture(uid,original)
 if Game.state.trade!=null:
  Game.dispatch({"type":"COUNTER_STORE","tradeId":data.trade_id,"uid":uid,"version":data.version})
  if Game.item(uid)!=null and Game.item(uid).location=="warehouse" and not TradeSession.row(Game.state,uid).get("included",false):
   _store_motion.call_deferred(uid,texture,from);desk.shell.sound("drop",-10)
 elif original.location=="warehouse":
  if desk.showroom.selected_uid==uid:desk.showroom.return_original()
 else:
  var layout=preload("res://scripts/model/showroom_layout.gd")
  for index in layout.capacity(Game.state,"warehouse"):
   if layout.uid_at(Game.state,"warehouse",index)=="":
    desk.showroom.place_original(uid,"warehouse",index);break
 dirty=true

func _drop_data(at_position: Vector2,data) -> void:
 if not _can_drop_data(at_position,data):return
 var uid=str(data.uid)
 if stock_art.get_rect().has_point(at_position):
  _return_table_original_to_stock(data)
  return
 if data.kind=="strict_trade":
  var shown=CounterDialogue.table_items(Game.state)
  var info=shown.filter(func(entry):return entry.uid==uid)[0]
  var count=shown.filter(func(entry):return entry.direction==info.direction).size()
  var slots=CounterDialogue._table_slots(info.direction,count)
  var points=_table_points(info.direction,count)
  var nearest=0
  for index in points.size():
   if points[index].distance_squared_to(at_position)<points[nearest].distance_squared_to(at_position):nearest=index
  Game.dispatch({"type":"COUNTER_MOVE","tradeId":Game.state.trade.id,"uid":uid,"position":[slots[nearest].x,slots[nearest].y]})
 elif at_position.x>430:
  desk.showroom.select_original(uid)
 elif at_position.y<500:
  var local=at_position-display_scroll.position+Vector2(0,display_scroll.scroll_vertical)
  var index=0;var best=INF
  for candidate in preload("res://scripts/model/showroom_layout.gd").capacity(Game.state,"display"):
   var distance=local.distance_squared_to(_display_position(candidate)+Vector2(45,65))
   if distance<best:best=distance;index=candidate
  desk.showroom.place_original(uid,"display",index)
 else:
  var layout=preload("res://scripts/model/showroom_layout.gd")
  for index in layout.capacity(Game.state,"warehouse"):
   if layout.uid_at(Game.state,"warehouse",index)=="":
    desk.showroom.place_original(uid,"warehouse",index);break
 dirty=true

const DialogueLayout = preload("res://scripts/ui/counter_dialogue_layout.gd")

func _configure_dialogue_actors() -> void:
 var bubble=get_node("StrictSpeechBubble")
 if bubble.get_node_or_null("BubbleSkin")==null:
  # Preserve the original tail and rounded ink edges while extending the
  # paper's center; the outer node remains the existing pointer boundary.
  var skin=NinePatchRect.new();skin.name="BubbleSkin";skin.texture=R.bubble()
  skin.patch_margin_left=47;skin.patch_margin_top=18;skin.patch_margin_right=28;skin.patch_margin_bottom=32
  skin.mouse_filter=Control.MOUSE_FILTER_IGNORE
  bubble.add_child(skin);skin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
  bubble.texture=null
 speech.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
 speech.fit_content=false;speech.scroll_following=false
 _layout_dialogue_actors()

func _sync_speech(text: String) -> void:
 if speech.text!=text:
  speech.text=text;speech.scroll_to_line(0)
 speech.tooltip_text=""
 _layout_speech()

func _layout_speech() -> void:
 if not is_instance_valid(speech):return
 var bubble=get_node("StrictSpeechBubble")
 var origin=Vector2(760+extra_space.x*.5,157)
 var right=get_node("StrictTradePaper").position.x-22.0
 var bottom=_table_project(Vector2(700,451)).y-14.0
 var top=hud_art.position.y+hud_art.size.y+12.0
 var font=speech.get_theme_font("normal_font")
 var font_size=speech.get_theme_font_size("normal_font_size")
 var key=[speech.text,origin,right,bottom,top,font.get_instance_id(),font_size]
 var geometry=bubble.get_meta("speech_geometry",{})
 if bubble.get_meta("speech_layout_key",[])!=key:
  geometry=DialogueLayout.speech_rects(font,font_size,speech.text,origin,right,bottom,top)
  bubble.set_meta("speech_layout_key",key);bubble.set_meta("speech_geometry",geometry)
 bubble.position=geometry.bubble.position;bubble.size=geometry.bubble.size
 speech.position=geometry.text.position;speech.size=geometry.text.size
 speech.scroll_active=geometry.scroll

func _actor_stage() -> Rect2:
 var stage:Rect2=layout_rects.get(face,Rect2(474,94,383,362))
 stage.position.x+=extra_space.x*.5
 return stage

func _face_anchor() -> Vector2:
 if face.texture==null:return _actor_stage().position
 return DialogueLayout.actor_rect(face.texture,_actor_stage()).position

func _layout_dialogue_actors() -> void:
 _layout_speech()
 _update_visitor_pose()
 if is_instance_valid(departing_face) and not departure_started:
  var rect=DialogueLayout.actor_rect(departing_face.texture,_actor_stage())
  departing_face.size=rect.size;departing_face.position=rect.position

func _update_visitor_pose() -> void:
 if not is_instance_valid(face) or face.texture==null:return
 var rect=DialogueLayout.actor_rect(face.texture,_actor_stage())
 face.size=rect.size
 # The old Customer rig still owns its gestures. A flat painted cutout
 # stands on one baseline; only its horizontal arrival/departure offset moves.
 face.position=rect.position+Vector2(face_offset.x,0)

func _sync_visitor(trade) -> void:
 face.visible=trade!=null
 if trade==null:return
 var visit=str(trade.get("id",""))
 if visit==last_visit:
  if visitor_phase=="settling" and not desk.busy:visitor_phase="standing"
  return
 last_visit=visit;last_npc=str(trade.npcId)
 if is_instance_valid(visitor_tween):visitor_tween.kill()
 _clear_departure()
 face.texture=DialogueLayout.portrait(last_npc);face.modulate.a=1.0;face_offset=Vector2.ZERO
 _update_visitor_pose()
 visitor_phase="standing"
 if not motion_ready:return
 visitor_phase="entering";face.modulate.a=.2 if Game.prefs.reduced_motion else 0.0
 face_offset=Vector2.ZERO if Game.prefs.reduced_motion else Vector2(84,0)
 visitor_tween=create_tween().set_parallel(true)
 var duration=.16 if Game.prefs.reduced_motion else .42
 visitor_tween.tween_property(face,"modulate:a",1.0,duration)
 visitor_tween.tween_property(self,"face_offset",Vector2.ZERO,duration).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
 visitor_tween.chain().tween_callback(func():visitor_phase="settling";dirty=true)
 face.position=_face_anchor()+face_offset

func _clear_departure() -> void:
 if is_instance_valid(departure_tween):departure_tween.kill()
 if is_instance_valid(departing_face):departing_face.queue_free()
 departing_face=null;departure_started=false

func _start_visible_departure() -> void:
 _clear_departure()
 if face.texture==null:return
 departing_face=_image(self,face.texture,Rect2(face.position,face.size))
 departing_face.name="DepartingVisitor";departing_face.stretch_mode=face.stretch_mode
 departing_face.modulate.a=face.modulate.a
 # This painted copy cannot retain the departed visit's click handlers.
 move_child(departing_face,face.get_index())
 if is_instance_valid(visitor_tween):visitor_tween.kill()
 face_offset=Vector2.ZERO

func _advance_visible_departure() -> void:
 if not is_instance_valid(departing_face) or departure_started:return
 # The reducer has already completed the transaction. Keep the painted
 # visitor through the existing goodbye/handovers, then follow its walk out.
 if desk.busy and is_instance_valid(desk.customer) and not desk.customer.walking:return
 departure_started=true
 var outgoing=departing_face
 departure_tween=create_tween().set_parallel(true)
 var duration=.16 if Game.prefs.reduced_motion else .42
 if not Game.prefs.reduced_motion:
  departure_tween.tween_property(outgoing,"position",outgoing.position+Vector2(-110,0),duration).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN)
 departure_tween.tween_property(outgoing,"modulate:a",0.0,duration)
 departure_tween.chain().tween_callback(func():
  outgoing.queue_free()
  if departing_face==outgoing:departing_face=null)

func _watch_center(uid: String) -> Vector2:
 var key=table.get_node_or_null("strict_table_"+uid)
 if key!=null:
  return key.position+key.get_node("WatchVisual").position+Vector2(key.size.x*.5,43)
 key=find_child("strict_stock_"+uid,true,false)
 if key!=null:return get_global_transform().affine_inverse()*key.get_global_rect().get_center()
 var it=Game.item(uid)
 return Vector2(170,300) if it!=null and it.location=="display" else Vector2(200,720)

func _watch_texture(uid: String,it) -> Texture2D:
 var art=table.get_node_or_null("strict_table_"+uid+"/WatchVisual/WatchArt")
 return art.texture if art!=null else A.watch(it)

func _animate_table_watch(key: Button,previous: Dictionary,visitor: bool) -> void:
 if not motion_ready:return
 var visual=key.get_node("WatchVisual")
 var start:Vector2=key.position
 var moved=false
 if watch_sources.has(key.uid):
  start=watch_sources[key.uid]-Vector2(key.size.x*.5,43);moved=true
 elif previous.has(key.uid):
  start=previous[key.uid];moved=start.distance_to(key.position)>1.0
 else:
  start=(_face_anchor()+Vector2(190,300) if visitor else _watch_center(key.uid))-Vector2(key.size.x*.5,43)
  moved=true
 if not moved:return
 if Game.prefs.reduced_motion:
  visual.modulate.a=.48
  var tween=visual.create_tween();visual.set_meta("motion_tween",tween)
  tween.tween_property(visual,"modulate:a",1.0,.16)
 else:
  visual.position=start-key.position;visual.pivot_offset=Vector2(key.size.x*.5,43)
  visual.scale=Vector2(1.06,1.06)
  var tween=visual.create_tween().set_parallel(true);visual.set_meta("motion_tween",tween)
  tween.tween_property(visual,"position",Vector2.ZERO,.3).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
  tween.tween_property(visual,"scale",Vector2.ONE,.3).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

func _watch_ghost(texture: Texture2D,from: Vector2,to: Vector2,invalid:=false) -> void:
 var ghost=_image(self,texture,Rect2(from-Vector2(28,42),Vector2(56,84)))
 motion_serial+=1;ghost.name="WatchMotionGhost_"+str(motion_serial);ghost.pivot_offset=ghost.size*.5
 var duration=.16 if Game.prefs.reduced_motion else .3
 var tween=ghost.create_tween().set_parallel(true)
 if not Game.prefs.reduced_motion:
  tween.tween_property(ghost,"position",to-ghost.size*.5,duration).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
  tween.tween_property(ghost,"scale",Vector2.ONE*.92,duration)
 tween.tween_property(ghost,"modulate:a",0.0,duration).from(.8)
 if invalid:
  var label=_label(ghost,"已归位",Rect2(-16,78,90,30),17,Color("243a30"),true)
  label.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
  label.add_theme_stylebox_override("normal",_style(Color("d8e8df"),Color("345c53"),5))
 tween.chain().tween_callback(ghost.queue_free)

func _store_motion(uid: String,texture: Texture2D,from: Vector2) -> void:
 # GridContainer establishes its new canonical hit rectangles next frame.
 # Waiting here only affects the mouse-ignoring picture, never the reducer.
 var version=int(store_motion_versions.get(uid,0))+1;store_motion_versions[uid]=version
 _refresh()
 await get_tree().process_frame
 if not is_inside_tree() or store_motion_versions.get(uid)!=version:return
 _watch_ghost(texture,from,_watch_center(uid))

func _notification(what: int) -> void:
 if what==NOTIFICATION_EXIT_TREE or what==NOTIFICATION_VISIBILITY_CHANGED and not is_visible_in_tree():
  _end_drag_feedback(false,false)
  return
 if not is_instance_valid(table):return
 # A native drag may end after the desktop is hidden by a portrait resize.
 # Restoration belongs to the drag lifecycle, independently of visibility.
 if what==NOTIFICATION_DRAG_BEGIN and is_visible_in_tree():
  _begin_drag_feedback(get_viewport().gui_get_drag_data())
 elif what==NOTIFICATION_DRAG_END:
  _end_drag_feedback(get_viewport().gui_is_drag_successful(),is_visible_in_tree())

func _begin_drag_feedback(data) -> void:
 if not data is Dictionary or data.get("kind","") not in ["strict_trade","showroom_original"]:return
 var uid=str(data.get("uid",""))
 var it=TradeSession.item(Game.state,uid) if Game.state.trade!=null else Game.item(uid)
 if it==null:return
 drag_feedback={"uid":uid,"from":_watch_center(uid),"texture":_watch_texture(uid,it),"data":data.duplicate(true)}
 var key=table.get_node_or_null("strict_table_"+uid)
 if key!=null:
  var visual=key.get_node("WatchVisual")
  var tween=visual.get_meta("motion_tween") if visual.has_meta("motion_tween") else null
  if tween is Tween and tween.is_valid():tween.kill()
  visual.position=Vector2.ZERO;visual.scale=Vector2.ONE;visual.modulate.a=.38
  drag_feedback.from=key.position+Vector2(key.size.x*.5,43)

func _end_drag_feedback(success: bool,animate:=true) -> void:
 if drag_feedback.is_empty():return
 var feedback=drag_feedback;drag_feedback={}
 var key=table.get_node_or_null("strict_table_"+feedback.uid) if is_instance_valid(table) else null
 if key!=null:
  var visual=key.get_node("WatchVisual");visual.modulate.a=1.0
  if not animate:
   var tween=visual.get_meta("motion_tween") if visual.has_meta("motion_tween") else null
   if tween is Tween and tween.is_valid():tween.kill()
   visual.position=Vector2.ZERO;visual.scale=Vector2.ONE
 if not animate:return
 if key!=null:
  var visual=key.get_node("WatchVisual")
  if success:
   var settle=visual.create_tween();visual.set_meta("motion_tween",settle)
   if Game.prefs.reduced_motion:
    visual.modulate.a=.48;settle.tween_property(visual,"modulate:a",1.0,.16)
   else:
    visual.scale=Vector2(1.07,.94);settle.tween_property(visual,"scale",Vector2.ONE,.18).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
 if not success:
  var from=get_local_mouse_position() if not Game.prefs.reduced_motion else feedback.from
  _watch_ghost(feedback.texture,from,feedback.from,true)
  if stock_art.get_rect().has_point(get_local_mouse_position()):
   var why:=_stock_return_problem(feedback.get("data",{}))
   if why!="":desk.shell.toast(why,"error")

func _model_changed(previous: Dictionary,next: Dictionary,action: Dictionary) -> void:
 dirty=true
 if not visible:return
 var verb=str(action.get("type",""))
 if previous.get("trade")!=null and next.get("trade")==null:_start_visible_departure()
 if verb=="COUNTER_PREVIEW":
  var before=str(previous.get("counterPreviewUid",""));var after=str(next.get("counterPreviewUid",""))
  if before!=after:
   if after!="":watch_sources[after]=_watch_center(after)
   elif before!="":
    var item=Model.find_inventory(previous,before)
    if item!=null:_store_motion.call_deferred(before,A.watch(item),_watch_center(before))
 if verb=="SELECT_TRADE":
  var uid=str(action.get("uid",""))
  if not CounterDialogue.table_items(previous).any(func(info):return info.uid==uid) and CounterDialogue.table_items(next).any(func(info):return info.uid==uid):
   watch_sources[uid]=_watch_center(uid)
 if verb=="SHOWROOM_PLACE":
  var uid=str(action.get("uid",""));var item=Model.find_inventory(previous,uid)
  if item!=null and int(next.get("showroomLayout",{}).get(str(action.get("location","")),{}).get(uid,-1))==int(action.get("slot",-2)):
   _store_motion.call_deferred(uid,A.watch(item),_watch_center(uid))
 if verb not in ["DELIVER","TRADE_CHECKOUT","PAWN","REFUSE","TRADE_END","COUNTER_CANCEL"]:return
 var remaining=CounterDialogue.table_items(next).map(func(info):return info.uid)
 for child in table.get_children():
  if not child is TradeWatch or child.uid in remaining:continue
  var it=TradeSession.item(previous,child.uid)
  if it==null:continue
  var buying=it.owner=="npc"
  if verb in ["REFUSE","TRADE_END","COUNTER_CANCEL"]:buying=not buying
  var target=Vector2(180,720) if buying else _face_anchor()+Vector2(190,260)
  _watch_ghost(A.watch(it),_watch_center(child.uid),target)

func _open_evidence() -> void:
 var popup=PopupPanel.new();popup.name="StrictEvidencePopup";popup.theme=UIKit.build_theme()
 var box=VBoxContainer.new();box.add_theme_constant_override("separation",6)
 popup.add_child(box);add_child(popup)
 box.add_child(UIKit.label("检验记录 · 选择后随出价提交",20,UIKit.INK))
 var count=0
 for source in desk.chips.get_children():
  if not source is Button:continue
  count+=1
  var button=UIKit.button(source.get_meta("evidence_caption",source.text),"secondary",Vector2(380,44),20)
  button.disabled=source.disabled;button.tooltip_text=source.tooltip_text
  button.pressed.connect(func():
   if is_instance_valid(source) and not source.disabled:source.pressed.emit()
   popup.hide();popup.queue_free();dirty=true)
  box.add_child(button)
 if count==0:box.add_child(UIKit.label("尚无可提交的检验记录",20,UIKit.MUTED))
 popup.popup_hide.connect(func():popup.queue_free())
 var point=get_global_transform_with_canvas()*Vector2(1205,255)
 popup.popup(Rect2i(Vector2i(point),Vector2i(410,70+count*50)))

func _commit_quote() -> bool:
 if not quote.editable or desk.busy or desk._scene_blocked():return false
 if not quote_dirty:return true
 var value=quote.text.strip_edges()
 if not value.is_valid_int() or int(value)<desk.dial.min_value or int(value)>desk.dial.max_value:
  desk.shell.toast("请输入 %d–%d Cr 范围内的整数报价"%[desk.dial.min_value,desk.dial.max_value]);return false
 desk.dial.set_value(int(value));quote_dirty=false;dirty=true;return true

func _nudge(step: int) -> void:
 if quote_dirty and not _commit_quote():return
 desk.dial.set_value(desk.dial.value+step);dirty=true
