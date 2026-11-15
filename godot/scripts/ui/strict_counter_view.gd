extends Control
## Reference-sized presentation. Every action delegates to the existing game.
const A = preload("res://scripts/ui/comic_assets.gd")
const PAPER = Color("f7e5c3")
const INK = Color("20241e")
const RED = Color("b84e37")
const GREEN = Color("243a30")
const S := 1920.0/1672.0
var desk
var face: TextureRect
var speech: RichTextLabel
var name_key: Label
var day: Label
var rent: Label
var money: Label
var ap: Label
var risk: Label
var selected: TextureRect
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
var shelves: GridContainer
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

class TradeWatch extends Button:
 var controller
 var uid := ""
 func _get_drag_data(_position: Vector2):
  if controller.desk.busy or controller.desk._scene_blocked():return null
  var it=TradeSession.item(Game.state,uid) if Game.state.trade!=null else Game.item(uid)
  if it==null:return null
  var ghost=TextureRect.new();ghost.expand_mode=TextureRect.EXPAND_IGNORE_SIZE
  ghost.texture=A.watch(it);ghost.size=Vector2(56,80)
  ghost.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
  var holder=Control.new();holder.add_child(ghost);ghost.position=-ghost.size*.5;set_drag_preview(holder)
  return {"kind":"strict_trade" if Game.state.trade!=null else "showroom_original","uid":uid}

func setup(page) -> void:
 desk=page;name="StrictCounterView"
 mouse_filter=Control.MOUSE_FILTER_STOP
 scale=Vector2.ONE*S;size=Vector2(1672,941)
 texture_filter=CanvasItem.TEXTURE_FILTER_LINEAR
 A.prewarm()
 _build()
 Game.changed.connect(_model_changed)
 Game.prefs_changed.connect(func():dirty=true)
 desk.dial.changed.connect(func(_value):dirty=true)
 _refresh(true)

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
 l.add_theme_font_override("font",UIKit.mono if bold else UIKit.font)
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
 for state in ["normal","hover","pressed","disabled","focus"]:
  var style=_style(fill,INK,9)
  if state=="hover":
   style.border_color=RED
   if style is StyleBoxTexture:style.modulate_color=Color(1.03,1.0,.94)
  if state=="pressed":
   style.bg_color=fill.darkened(.08)
   if style is StyleBoxTexture:style.modulate_color=Color(.94,.9,.83)
  b.add_theme_stylebox_override(state,style)
  b.add_theme_color_override("font_color" if state=="normal" else "font_"+state+"_color",Color("fff1d6") if fill==RED else INK)
 parent.add_child(b)
 if fill==RED:_image(b,A.tex("red_paper.png"),Rect2(4,4,rect.size.x-8,rect.size.y-8)).stretch_mode=TextureRect.STRETCH_SCALE
 if vertical:
  b.tooltip_text=text
  b.clip_text=true
  for color_key in ["font_color","font_hover_color","font_pressed_color","font_disabled_color","font_focus_color"]:b.add_theme_color_override(color_key,Color.TRANSPARENT)
  _image(b,A.icon(icon_name),Rect2((rect.size.x-34)/2,12,34,34),Color("fff1d6") if fill==RED else INK).name="ActionIcon"
  var caption=_label(b,text,Rect2(0,52,rect.size.x,34),23,Color("fff1d6") if fill==RED else INK,true)
  caption.name="ActionCaption"
  caption.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
 else:
  b.text=text
  if icon_name!="":
   b.icon=A.icon(icon_name);b.add_theme_constant_override("icon_max_width",26)
   b.add_theme_color_override("icon_normal_color",INK)
   b.add_theme_color_override("icon_hover_color",INK)
 b.pressed.connect(func():
  if desk.busy or desk._scene_blocked():return
  desk.shell.sound("click",-10);fn.call();dirty=true)
 return b

func _nav(text: String,icon: String,x: float,width: float,fn: Callable) -> Button:
 var b=_button(self,text,Rect2(x,876,width,48),fn,icon)
 b.name="StrictNav_"+icon
 b.add_theme_constant_override("icon_max_width",43)
 for state in ["normal","hover","pressed","focus"]:
  b.add_theme_stylebox_override(state,StyleBoxEmpty.new())
 return b

func _legacy(key: String) -> void:
 if desk.fixture_buttons.has(key):desk.fixture_buttons[key].pressed.emit()

func _build() -> void:
 _image(self,A.tex("room.png"),Rect2(0,0,1672,941)).stretch_mode=TextureRect.STRETCH_SCALE
 # The source frame is a compact, continuous 60px paper status strip.
 _panel(Rect2(2,2,1668,57),PAPER,false,1)
 _panel(Rect2(3,3,270,50),RED,false,2)
 day=_label(self,"第25天",Rect2(49,7,125,41),29,INK,true)
 _panel(Rect2(20,4,152,48),PAPER,false,1)
 move_child(day,-1)
 _label(self,"营业",Rect2(190,8,76,40),29,Color("fff0d6"),true)
 rent=_label(self,"租期余3天",Rect2(326,12,139,35),24,INK,true)
 var event_button=_button(self,"事件",Rect2(480,9,77,40),func():_legacy("events"))
 for state in ["normal","hover","pressed","focus"]:event_button.add_theme_stylebox_override(state,StyleBoxEmpty.new())
 _image(self,A.icon("circle-exclamation"),Rect2(560,11,24,27),RED)
 for divider_x in [306,715,1276]:_panel(Rect2(divider_x,15,2,31),INK,false,0)
 _image(self,A.icon("coins"),Rect2(747,14,38,32),INK)
 money=_label(self,"979081 Cr",Rect2(805,10,155,38),25,INK,true)
 var ledger=_button(self,"",Rect2(741,7,220,46),func():desk.shell.open_campaign_ledger())
 ledger.name="StrictCashLedger";ledger.tooltip_text="现金流水 · 查看账本"
 for state in ["normal","hover","pressed","focus"]:ledger.add_theme_stylebox_override(state,StyleBoxEmpty.new())
 _image(self,A.icon("bolt"),Rect2(968,13,25,33),INK)
 ap=_label(self,"AP 10",Rect2(1002,11,94,35),24,INK,true)
 _image(self,A.icon("eye"),Rect2(1107,15,34,27),INK)
 risk=_label(self,"关注 100",Rect2(1152,11,123,35),24,INK,true)
 for spec in [["手册","book-open",1304,"help"],["经营","store",1390,"plan"],["声音","volume-high",1476,"sound"],["设置","gear",1564,"settings"]]:
  var key: String=spec[3]
  var b=_button(self,spec[0],Rect2(spec[2],10,88,39),func():desk._utility_clicked(key,null),spec[1])
  for state in ["normal","hover","pressed","focus"]:b.add_theme_stylebox_override(state,StyleBoxEmpty.new())
  b.add_theme_font_size_override("font_size",22)
 _label(self,"陈列",Rect2(22,76,100,44),30,INK,true).add_theme_stylebox_override("normal",_style())
 display_scroll=ScrollContainer.new();display_scroll.name="StrictDisplayScroll"
 display_scroll.position=Vector2(34,160);display_scroll.size=Vector2(304,286)
 display_scroll.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_DISABLED
 display_scroll.vertical_scroll_mode=ScrollContainer.SCROLL_MODE_AUTO;add_child(display_scroll)
 shelves=GridContainer.new();shelves.columns=3;shelves.add_theme_constant_override("h_separation",20)
 shelves.add_theme_constant_override("v_separation",27);display_scroll.add_child(shelves)
 _panel(Rect2(779,67,139,97),RED,false,1)
 _label(self,"当",Rect2(793,65,108,93),78,Color("e5ad64"),true).horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
 face=_image(self,null,Rect2(470,91,390,370))
 face.mouse_filter=Control.MOUSE_FILTER_STOP;face.mouse_default_cursor_shape=Control.CURSOR_POINTING_HAND
 face.gui_input.connect(func(event):
  if event is InputEventMouseButton and event.pressed and event.button_index==MOUSE_BUTTON_LEFT and Game.state.trade!=null and not desk._scene_blocked() and not desk.busy:
   if is_instance_valid(desk.customer):desk.customer.nod()
   desk.shell.open_people(Game.state.trade.npcId);face.accept_event())
 name_key=_label(self,"",Rect2(499,104,92,44),26,Color("fff0d6"),true)
 name_key.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
 name_key.add_theme_stylebox_override("normal",_style(RED,INK,3))
 var bubble=_image(self,A.region("speech_bubble.png",Rect2(196,120,1630,537)),Rect2(765,160,280,96));bubble.name="StrictSpeechBubble"
 bubble.stretch_mode=TextureRect.STRETCH_SCALE
 speech=RichTextLabel.new();speech.position=Vector2(804,169);speech.size=Vector2(219,78)
 speech.add_theme_font_override("normal_font",UIKit.mono);speech.add_theme_font_size_override("normal_font_size",24)
 speech.add_theme_color_override("default_color",INK);speech.add_theme_constant_override("line_separation",-5);speech.scroll_active=true
 speech.mouse_filter=Control.MOUSE_FILTER_STOP;add_child(speech)
 # Bell and trading goods are independent, clickable assets.
 bell_art=_image(self,A.region("bell.png",Rect2(250,300,750,660)),Rect2(363,486,99,77))
 var bell_button=_button(self,"",Rect2(363,486,99,77),func():desk._bell_clicked())
 bell_button.tooltip_text="接客铃 · 接待下一位来客"
 for state in ["normal","hover","pressed","focus"]:bell_button.add_theme_stylebox_override(state,StyleBoxEmpty.new())
 table=Control.new();table.position=Vector2.ZERO;table.mouse_filter=Control.MOUSE_FILTER_IGNORE;add_child(table)
 # Stock tray: exactly six columns, with scrolling only for real overflow.
 _panel(Rect2(7,577,413,273))
 _panel(Rect2(10,580,407,45),GREEN,true,7)
 _image(self,A.icon("box-archive"),Rect2(29,588,31,30),PAPER)
 stock_count=_label(self,"在库 33",Rect2(78,588,190,35),27,PAPER,true)
 _button(self,"整理",Rect2(289,589,111,27),func():desk.shell.go("warehouse"),"list").add_theme_font_size_override("font_size",19)
 stock_scroll=ScrollContainer.new();stock_scroll.position=Vector2(17,639);stock_scroll.size=Vector2(397,193)
 stock_scroll.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_DISABLED
 stock_scroll.vertical_scroll_mode=ScrollContainer.SCROLL_MODE_AUTO;add_child(stock_scroll)
 stock=GridContainer.new();stock.columns=6;stock.add_theme_constant_override("h_separation",4)
 stock.add_theme_constant_override("v_separation",7);stock_scroll.add_child(stock)
 # Right paper folio: measured from the approved source image.
 _panel(Rect2(1187,69,479,789),PAPER,true,16).name="StrictTradePaper"
 selected=_image(self,null,Rect2(1215,112,117,139))
 _panel(Rect2(1214,112,119,140),GREEN,true,10)
 move_child(selected,-1)
 item_name=_label(self,"",Rect2(1347,111,286,43),28,INK,true)
 item_meta=_label(self,"",Rect2(1378,174,105,30),21,INK,false)
 price_band=_label(self,"",Rect2(1519,174,135,30),21,INK,false)
 evidence=_label(self,"",Rect2(1378,216,113,30),21,INK,false)
 rounds=_label(self,"",Rect2(1525,216,128,30),21,INK,false)
 _image(self,A.icon("link"),Rect2(1490,176,21,21),INK)
 _image(self,A.icon("check"),Rect2(1490,218,21,21),INK)
 var evidence_key=_button(self,"",Rect2(1343,210,140,36),_open_evidence)
 evidence_key.name="StrictEvidence";evidence_key.tooltip_text="选择用于议价的检验记录"
 for state in ["normal","hover","pressed","focus"]:evidence_key.add_theme_stylebox_override(state,StyleBoxEmpty.new())
 _image(self,A.icon("gear"),Rect2(1350,176,21,21),INK)
 _image(self,A.icon("box-archive"),Rect2(1350,218,21,21),INK)
 _panel(Rect2(1204,285,450,54),RED,false,8)
 _image(self,A.icon("tag"),Rect2(1217,299,29,29),INK)
 _label(self,"要价",Rect2(1256,292,110,41),27,INK,true)
 ask=_label(self,"170 Cr",Rect2(1460,292,183,42),30,Color("fff1d6"),true)
 ask.horizontal_alignment=HORIZONTAL_ALIGNMENT_RIGHT
 quote_controls.append(_label(self,"出价",Rect2(1244,366,65,36),24,INK,true))
 quote_controls.append(_image(self,A.icon("coins"),Rect2(1215,370,26,27),INK))
 quote=LineEdit.new();quote.position=Vector2(1310,357);quote.size=Vector2(130,50)
 quote.add_theme_constant_override("minimum_character_width",1)
 quote.alignment=HORIZONTAL_ALIGNMENT_LEFT;quote.add_theme_font_override("font",UIKit.mono)
 quote.add_theme_font_size_override("font_size",31);quote.add_theme_color_override("font_color",INK)
 var quote_style=_style();quote_style.set_content_margin(SIDE_LEFT,12);quote_style.set_content_margin(SIDE_RIGHT,42)
 var quote_focus=_style(PAPER,RED);quote_focus.set_content_margin(SIDE_LEFT,12);quote_focus.set_content_margin(SIDE_RIGHT,42)
 quote.add_theme_stylebox_override("normal",quote_style);quote.add_theme_stylebox_override("focus",quote_focus)
 _label(quote,"Cr",Rect2(88,9,37,32),23,INK,true)
 quote.text_changed.connect(func(_value):
  if not quote_syncing:quote_dirty=true)
 quote.text_submitted.connect(func(_value):
  if _commit_quote():quote.release_focus())
 add_child(quote);quote_controls.append(quote)
 var x=1449.0
 for amount in [-10,-1,1,10]:
  var step: int=amount
  quote_controls.append(_button(self,("+" if amount>0 else "")+str(amount),Rect2(x,364,48,39),func():_nudge(step)))
  x+=52
 cost=_label(self,"",Rect2(1216,427,434,34),20,INK,true)
 _panel(Rect2(1204,466,450,2),INK,false,0)
 for index in 5:
  var slot: int=index
  var captions=["出价","接受","鉴定","抵押","送客"]
  var icons=["gavel","handshake","magnifying-glass","file-lines","right-from-bracket"]
  var b=_button(self,captions[index],Rect2(1205+index*91,492,86,99),func():_trade_action(slot),icons[index],RED if index==0 else PAPER,true)
  b.name="StrictTradeAction_"+str(index)
  trade_buttons.append(b)
 secondary=_button(self,"这件先不买",Rect2(1253,612,365,49),func():
  var b=desk.dialogue_put_aside
  if not b.disabled:b.pressed.emit(),"arrow-rotate-left")
 secondary.icon=null
 for color_key in ["font_color","font_hover_color","font_pressed_color","font_disabled_color","font_focus_color"]:secondary.add_theme_color_override(color_key,Color.TRANSPARENT)
 _image(secondary,A.icon("arrow-rotate-left"),Rect2(84,11,27,27),INK)
 _label(secondary,"这件先不买",Rect2(122,7,220,35),23,INK,true).name="SecondaryCaption"
 stage_hint=_label(self,"",Rect2(1210,670,430,25),16,Color("70604a"))
 _panel(Rect2(1203,686,450,2),INK,false,0)
 var orders=_button(self,"",Rect2(1205,715,224,105),func():desk.shell.go("orders"));orders.name="StrictOrders"
 _image(orders,A.icon("clipboard-list"),Rect2(15,21,39,54),INK)
 _label(orders,"委托订单",Rect2(66,15,153,36),25,INK,true)
 order_count=_label(orders,"0 待办",Rect2(66,56,151,32),22)
 var people=_button(self,"",Rect2(1438,715,217,105),func():desk.shell.open_people());people.name="StrictPeople"
 _image(people,A.icon("address-book"),Rect2(17,24,43,50),INK)
 _label(people,"人物档案",Rect2(70,33,142,37),25,INK,true)
 _panel(Rect2(1,867,1670,72),PAPER,false,1)
 _nav("日结打烊","sun",39,220,func():desk.shell.go("report"))
 _nav("报警","bell",321,174,func():desk.alarm_button.pressed.emit())
 _nav("仓储隔离","box-archive",563,220,func():desk.shell.go("warehouse"))
 _nav("鉴定仪","gauge-high",839,209,func():desk._open_instrument("inspect"))
 _nav("维修台","screwdriver-wrench",1105,236,func():desk._open_instrument("repair"))
 var back=_button(self,"返回",Rect2(1590,878,76,45),func():desk.shell.go("counter"))
 for state in ["normal","hover","pressed","focus"]:back.add_theme_stylebox_override(state,StyleBoxEmpty.new())
 for divider_x in [300,544,816,1080,1520]:_panel(Rect2(divider_x,883,1,43),INK,false,0)
 for hint in [["1",252],["2",488],["3",755],["Esc",1532]]:
  var key_hint=_label(self,hint[0],Rect2(hint[1],883,32,31),18,INK,true)
  key_hint.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
  key_hint.add_theme_stylebox_override("normal",_style())
 own=Control.new();own.mouse_filter=Control.MOUSE_FILTER_IGNORE;add_child(own)
 detail_tools=VBoxContainer.new();detail_tools.position=Vector2(1210,360);detail_tools.size=Vector2(430,310)
 detail_tools.add_theme_constant_override("separation",10);own.add_child(detail_tools)
 for spec in [["放大镜 · 查看标识","TOL-001"],["紫外灯 · 核对编号","TOL-002"],["电子秤 · 称量手表","TOL-005"]]:
  var tool: String=spec[1]
  var key=UIKit.button(spec[0],"secondary",Vector2(425,47),23)
  key.pressed.connect(func():desk.showroom.open_tool(tool));detail_tools.add_child(key)
 var ret=UIKit.button("放回原位","primary",Vector2(425,47),23)
 ret.pressed.connect(func():desk.showroom.return_original();dirty=true);detail_tools.add_child(ret)
 var arrange=UIKit.button("整理 / 调价","secondary",Vector2(425,47),23)
 arrange.pressed.connect(func():desk.shell.go("warehouse",desk.showroom.selected_uid));detail_tools.add_child(arrange)

func _trade_action(index: int) -> void:
 var keys=desk.actions.get_children()
 if index<keys.size() and not keys[index].disabled:
  if keys[index].text.begins_with("出价") and not _commit_quote():return
  keys[index].pressed.emit()

func _process(delta: float) -> void:
 visible=not desk.shell.mobile_mode()
 if not visible:return
 var old=desk.find_child("DesktopCounter",true,false)
 if old!=null:old.hide()
 desk.stage_root.hide();desk.back_root.hide()
 desk.shell.hint_label.hide()
 position=desk.shell.counter_offset()
 clock+=delta;period+=delta
 if is_instance_valid(desk.bell) and not Game.prefs.reduced_motion:
  bell_art.pivot_offset=bell_art.size*.5
  bell_art.rotation=desk.bell.rotation
 if dirty or period>.10:
  _refresh(dirty);dirty=false;period=0.0
 if face.visible and not Game.prefs.reduced_motion:
  face.position.y=91+sin(clock*1.7)*.65
  if is_instance_valid(desk.customer):
   face.position.y+=float(desk.customer.gesture.get("nod",0))*2.0-float(desk.customer.gesture.get("lean",0))*1.5
 speech.visible_ratio=desk.bubble_label.visible_ratio

func _refresh(force := false) -> void:
 if desk==null:return
 var s=Game.state;var t=s.trade
 day.text="第%d天"%int(s.day)
 rent.text="租期余%d天"%(7-(int(s.day)%7))
 money.text=Model.jnum(s.cash)+" Cr";ap.text="AP %d"%int(s.ap);risk.text="关注 %d"%int(s.risk)
 var current=Model.trade_item(s) if t!=null else null
 var ordinary=t!=null and t.get("kind","") in ["buy","sell"]
 var preview=Game.item(desk.showroom.selected_uid) if t==null else null
 var it=preview if preview!=null else current
 own.visible=preview!=null
 for child in trade_buttons:child.visible=preview==null
 for control in quote_controls:control.visible=preview==null and ordinary
 selected.texture=A.watch(it)
 var fullname=GameData.def(it.defId).name if it!=null else ""
 var parts=fullname.split(" ")
 item_name.text=(parts[0]+" "+parts[1]) if parts.size()>1 else fullname if it!=null else desk.scr.head.text if t!=null else "等待来客"
 item_name.tooltip_text=fullname;item_name.clip_text=true
 price_band.visible=it!=null;evidence.visible=it!=null;rounds.visible=it!=null
 if it!=null:
  var estimate=Model.estimate(it)
  item_meta.text=(parts[2]+"表") if parts.size()>2 else "手表"
  item_meta.size=Vector2(105,30)
  price_band.text="%s–%s"%[Model.jnum(estimate.low),Model.jnum(estimate.high)]
  evidence.text="物证 %d"%Model.evidence_count(it)
  rounds.text="已商谈 %d次"%int(t.get("rounds",0) if t!=null else 0)
  selected.tooltip_text=fullname+" · 品相 "+UIKit.pct(it.condition)
  selected.mouse_filter=Control.MOUSE_FILTER_STOP
 else:
  item_meta.text=(desk.scr.line1.text+"\n"+desk.scr.line2.text) if t!=null else "整理货物 · 接待来客"
  item_meta.size=Vector2(270,72)
 ask.text=Model.jnum(t.get("price",0))+" Cr" if ordinary else desk.scr.price.text
 quote.editable=ordinary and not t.get("locked",false) and not desk.busy
 for control in quote_controls:
  if control is Button:control.disabled=not ordinary or t.get("locked",false) or desk.busy
 var draft_key=str(t.get("id",""))+"/"+str(it.uid if it!=null else "") if t!=null else ""
 if draft_key!=quoted_uid or not quote.editable:
  quoted_uid=draft_key;quote_dirty=false
 if not quote.has_focus() and not quote_dirty:
  quote_syncing=true;quote.text=str(int(desk.dial.value));quote_syncing=false
 cost.text=desk.scr.line3.text if desk.scr.line3.visible else ""
 stage_hint.text=desk.footer.text
 stage_hint.visible=false
 secondary.tooltip_text=desk.footer.text+" · "+desk.dialogue_put_aside.text
 secondary.text=desk.dialogue_put_aside.text
 secondary.get_node("SecondaryCaption").text=secondary.text
 secondary.visible=t!=null and CounterDialogue.active(s)
 secondary.disabled=desk.dialogue_put_aside.disabled
 order_count.text="%d 待办"%s.orders.filter(func(o):return o.status=="active").size()
 face.visible=t!=null;name_key.visible=t!=null
 var bubble=get_node("StrictSpeechBubble");bubble.visible=t!=null;speech.visible=t!=null
 if t!=null:
  if str(t.npcId)!=last_npc:
   last_npc=str(t.npcId);face.texture=A.portrait(last_npc)
   if not Game.prefs.reduced_motion:
    face.modulate.a=0.0;create_tween().tween_property(face,"modulate:a",1.0,.25)
  name_key.text=GameData.npc(t.npcId).name
  var raw=desk.bubble_label.get_parsed_text()
  speech.text=("这只表，%s Cr。\n你看看。"%Model.jnum(t.get("price",0))) if "我想出手" in raw and "开价" in raw else raw
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
   var glyph={"交割":"handshake","出价":"gavel","接受":"handshake","鉴定":"magnifying-glass","抵押":"file-lines","送客":"right-from-bracket","取消":"arrow-rotate-left","选货":"box-archive","商品":"store","缴租":"coins","检查":"shield-halved","名单":"clipboard-list","接待":"bell","打烊":"sun"}
   trade_buttons[i].get_node("ActionIcon").texture=A.icon(glyph.get(caption,"file-lines"))
  trade_buttons[i].modulate.a=.45 if trade_buttons[i].disabled else 1.0
 var inv_key=JSON.stringify([s.inventory,s.get("showroomLayout",{}),WantedCases.has_notice(s)])
 if inv_key!=stock_signature:
  stock_signature=inv_key;_inventory()
 var backs=""
 for uid in desk.counter_table.sprites:backs+=str(desk.counter_table.sprites[uid].back)
 var table_key=str(CounterDialogue.table_items(s))+str(TradeSession.session(s).get("table_positions",{}))+str(desk.showroom.selected_uid)+str(desk.showroom.preview_back)+backs
 if table_key!=signature:
  signature=table_key;_table()

func _inventory() -> void:
 for container in [stock,shelves]:
  for c in container.get_children():c.free()
 var goods: Array=Game.state.inventory
 stock_count.text="在库 %d"%(goods.size()+int(WantedCases.has_notice(Game.state)))
 var layout=preload("res://scripts/model/showroom_layout.gd")
 layout.ensure(Game.state)
 var last_stock=-1
 for slot in Game.state.showroomLayout.warehouse.values():last_stock=maxi(last_stock,int(slot))
 for index in range(last_stock+1):
  var it=Game.item(layout.uid_at(Game.state,"warehouse",index))
  if it==null:
   var empty=preload("res://scripts/ui/showroom_slot.gd").new();empty.showroom=desk.showroom;empty.location="warehouse";empty.slot=index
   empty.name="strict_empty_warehouse_"+str(index);empty.custom_minimum_size=Vector2(61,87)
   for state in ["normal","hover","pressed","focus"]:empty.add_theme_stylebox_override(state,StyleBoxEmpty.new())
   stock.add_child(empty)
  else:
   var key=_stock_button(it,false,Vector2(61,87));stock.add_child(key);UIKit.decorate_item(key,it,16)
 if WantedCases.has_notice(Game.state):
  var document=UIKit.button("","secondary",Vector2(61,87),16,"orders")
  document.name="strict_wanted_inventory";document.tooltip_text="库存档案 · 取出或收起通缉名单"
  document.pressed.connect(func():desk.shell.toggle_wanted_notice());stock.add_child(document)
 for index in layout.capacity(Game.state,"display"):
  var uid=layout.uid_at(Game.state,"display",index)
  var it=Game.item(uid)
  if it==null:
   # No visible pluses/frames; only retain holes up to the last real item.
   var last=-1
   for v in Game.state.showroomLayout.display.values():last=maxi(last,int(v))
   if index>last:break
   var empty=preload("res://scripts/ui/showroom_slot.gd").new();empty.showroom=desk.showroom;empty.location="display";empty.slot=index
   empty.name="strict_empty_display_"+str(index);empty.custom_minimum_size=Vector2(85,108)
   for state in ["normal","hover","pressed","focus"]:empty.add_theme_stylebox_override(state,StyleBoxEmpty.new())
   shelves.add_child(empty)
  else:
   var key=_stock_button(it,true,Vector2(85,108));shelves.add_child(key);UIKit.decorate_item(key,it,16)

func _stock_button(it,display: bool,extent: Vector2) -> Button:
 var b=preload("res://scripts/ui/showroom_slot.gd").new()
 b.name="strict_stock_"+str(it.uid);b.showroom=desk.showroom;b.uid=it.uid;b.location=it.location
 b.slot=int(Game.state.showroomLayout.get(it.location,{}).get(it.uid,-1));b.custom_minimum_size=extent
 for state in ["normal","hover","pressed","focus","disabled"]:
  b.add_theme_stylebox_override(state,StyleBoxEmpty.new() if display else _style(PAPER,INK,7))
 _image(b,A.watch(it),Rect2(8,0,extent.x-16,extent.y-(23 if display else 6)))
 b.tooltip_text=GameData.def(it.defId).name+" · "+UIKit.pct(it.condition)
 if display:
  var price=_label(b,Model.jnum(it.get("listPrice",0))+" Cr",Rect2(0,extent.y-24,extent.x,24),16,INK,true)
  price.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER;price.add_theme_stylebox_override("normal",_style())
 b.pressed.connect(func():
  if desk.busy or desk._scene_blocked():return
  var t=Game.state.trade
  var picking=CounterDialogue.active(Game.state) or (t!=null and t.kind=="sell" and not t.has("selectedUid") and not t.locked)
  var current=Game.item(str(it.uid))
  if current==null:return
  var why=Model.sale_eligibility(current,t.npcId) if picking else null
  desk._stock_clicked(str(current.uid),picking,why);dirty=true)
 return b

func _table() -> void:
 for c in table.get_children():c.free()
 var shown=CounterDialogue.table_items(Game.state)
 var buys=shown.filter(func(info):return info.direction=="buy")
 var sells=shown.filter(func(info):return info.direction!="buy")
 for group in [buys,sells]:
  for index in group.size():
   var info=group[index];var it=TradeSession.item(Game.state,info.uid)
   if it==null:continue
   var x=700.0 if group.size()==1 and info.direction=="buy" else 500.0+index*(640.0/maxi(group.size()-1,6))
   var y=504.0 if info.direction=="buy" else 625.0
   var slots=CounterDialogue._table_slots(info.direction,group.size())
   var saved=TradeSession.session(Game.state).get("table_positions",{}).get(info.uid,[])
   if saved is Array and saved.size()==2:
    var unit=slots[1].x-slots[0].x
    var target_unit=120.0 if group.size()==1 and info.direction=="buy" else 640.0/maxi(group.size()-1,6)
    x=(700.0 if group.size()==1 and info.direction=="buy" else 500.0)+(float(saved[0])-slots[0].x)/unit*target_unit
   _table_watch(it,Vector2(x,y),info.price,info.focused,func():
    Game.dispatch({"type":"COUNTER_FOCUS","tradeId":Game.state.trade.id,"uid":info.uid});dirty=true)
 if Game.state.trade==null and desk.showroom.selected_uid!="":
  var it=Game.item(desk.showroom.selected_uid)
  if it!=null:_table_watch(it,Vector2(700,505),it.get("listPrice",0),true,func():desk.showroom.flip_original();dirty=true)

func _table_watch(it,center: Vector2,price: float,focus: bool,fn: Callable) -> void:
 var b=TradeWatch.new();b.mouse_default_cursor_shape=Control.CURSOR_POINTING_HAND;b.controller=self;b.uid=it.uid;b.name="strict_table_"+str(it.uid)
 b.position=center-Vector2(30,42);b.size=Vector2(60,108)
 for state in ["normal","hover","pressed","focus"]:b.add_theme_stylebox_override(state,StyleBoxEmpty.new())
 table.add_child(b)
 var is_back=desk.showroom.preview_back if Game.state.trade==null else desk.counter_table.sprites.has(it.uid) and desk.counter_table.sprites[it.uid].back
 var art=_image(b,A.watch(it,is_back),Rect2(5,0,50,77))
 if watch_sides.has(it.uid) and watch_sides[it.uid]!=is_back and not Game.prefs.reduced_motion:
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
 var tag_width=112 if center.y<560 else 86
 var tag=_label(b,Model.jnum(price)+" Cr",Rect2((60-tag_width)/2.0,80 if center.y<560 else 95,tag_width,26),17,Color("f7e7c6"))
 UIKit.decorate_item(b,it,17)
 tag.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
 tag.add_theme_stylebox_override("normal",_style(GREEN,Color("e8b75c") if focus else Color("6c7960"),0))
 b.mouse_entered.connect(func():tag.add_theme_stylebox_override("normal",_style(GREEN,Color("e8b75c"),0)))
 b.mouse_exited.connect(func():tag.add_theme_stylebox_override("normal",_style(GREEN,Color("e8b75c") if focus else Color("6c7960"),0)))
 b.pressed.connect(func():
  if not desk.busy and not desk._scene_blocked():fn.call())

func _unhandled_key_input(event: InputEvent) -> void:
 if not visible or quote.has_focus() or desk.busy or desk._scene_blocked():return
 if event is InputEventKey and event.pressed and not event.echo:
  match event.keycode:
   KEY_1:desk.shell.go("report");get_viewport().set_input_as_handled()
   KEY_2:desk.alarm_button.pressed.emit();get_viewport().set_input_as_handled()
   KEY_3:desk.shell.go("warehouse");get_viewport().set_input_as_handled()

func _can_drop_data(at_position: Vector2,data) -> bool:
 if desk.busy or desk._scene_blocked() or not data is Dictionary:return false
 if data.get("kind","")=="strict_trade":
  return Game.state.trade!=null and Rect2(430,463,750,280).has_point(at_position) and not TradeSession.row(Game.state,str(data.get("uid",""))).is_empty()
 if data.get("kind","")=="showroom_original":
  return Game.state.trade==null and desk.showroom.available(Game.item(str(data.get("uid","")))) and (Rect2(0,140,370,330).has_point(at_position) or Rect2(0,630,420,210).has_point(at_position) or Rect2(430,463,750,280).has_point(at_position))
 return false

func _drop_data(at_position: Vector2,data) -> void:
 if not _can_drop_data(at_position,data):return
 var uid=str(data.uid)
 if data.kind=="strict_trade":
  var shown=CounterDialogue.table_items(Game.state)
  var info=shown.filter(func(entry):return entry.uid==uid)[0]
  var count=shown.filter(func(entry):return entry.direction==info.direction).size()
  var slots=CounterDialogue._table_slots(info.direction,count)
  var origin=700.0 if count==1 and info.direction=="buy" else 500.0
  var spacing=120.0 if count==1 and info.direction=="buy" else 640.0/maxi(count-1,6)
  var x=slots[0].x+(at_position.x-origin)/spacing*(slots[1].x-slots[0].x)
  Game.dispatch({"type":"COUNTER_MOVE","tradeId":Game.state.trade.id,"uid":uid,"position":[x,slots[0].y]})
 elif at_position.x>430:
  desk.showroom.select_original(uid)
 elif at_position.y<500:
  var index=clampi(floori((at_position.y-160)/135)*3+floori((at_position.x-34)/105),0,preload("res://scripts/model/showroom_layout.gd").capacity(Game.state,"display")-1)
  desk.showroom.place_original(uid,"display",index)
 else:
  var layout=preload("res://scripts/model/showroom_layout.gd")
  for index in layout.capacity(Game.state,"warehouse"):
   if layout.uid_at(Game.state,"warehouse",index)=="":
    desk.showroom.place_original(uid,"warehouse",index);break
 dirty=true

func _model_changed(previous: Dictionary,next: Dictionary,action: Dictionary) -> void:
 dirty=true
 if not visible or Game.prefs.reduced_motion or action.get("type","") not in ["DELIVER","TRADE_CHECKOUT"]:return
 var remaining=CounterDialogue.table_items(next).map(func(info):return info.uid)
 for child in table.get_children():
  if not child is TradeWatch or child.uid in remaining:continue
  var it=TradeSession.item(previous,child.uid)
  if it==null:continue
  var ghost=_image(self,A.watch(it),Rect2(child.position,Vector2(60,85)))
  var target=Vector2(150,705) if it.owner=="npc" else Vector2(690,250)
  var tw=create_tween().set_parallel(true)
  tw.tween_property(ghost,"position",target,.4).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_IN)
  tw.tween_property(ghost,"modulate:a",0.0,.4)
  tw.chain().tween_callback(ghost.queue_free)

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
