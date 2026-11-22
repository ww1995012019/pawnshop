extends Control
## Ordinary-trade presentation. All mutations are routed through the view's
## trade/UID/version guard and the existing counter controller.
const R=preload("res://scripts/ui/reference_atlas.gd")
const A=preload("res://scripts/ui/comic_assets.gd")
const INK=Color("20241e")
const PAPER=Color("f7e5c3")
const MUTED=Color("70604a")
const RED=Color("b84e37")
const ROW_HEIGHT := 64.0
const ACTIVE_HEIGHT := 122.0
var view
var rows: VBoxContainer
var scroll: ScrollContainer
var row_views: Dictionary={}
var heading: Label
var subtitle: Label
var summary: Label
var balance: Label
var checkout: Button
var sendoff: Button
var snapshot: Dictionary={}
var empty_hint: Label
var last_focus:=""
var last_trade:=""
var popup: PopupPanel
var bottom_rects := {}

func key(parent: Node,text: String,rect: Rect2,fn: Callable,icon:="",primary:=false) -> Button:
 var b=view._button(parent,text,rect,fn,icon)
 b.add_theme_font_override("font",R.font(true));b.add_theme_font_size_override("font_size",19)
 b.add_theme_constant_override("icon_max_width",23)
 skin(b,primary,false)
 return b

func skin(b: Button,primary: bool,selected: bool) -> void:
 UIKit.context_button(b,"primary" if primary or selected else "secondary")
 for state in ["normal","hover","pressed","hover_pressed","disabled"]:
  var st=b.get_theme_stylebox(state)
  st.set_content_margin_all(5)

func setup(controller) -> void:
 view=controller;name="QuickTradeList";position=Vector2(1186,68);size=Vector2(485,791)
 mouse_filter=Control.MOUSE_FILTER_STOP
 var paper=Panel.new();paper.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
 paper.add_theme_stylebox_override("panel",view._style(PAPER,INK,8));paper.mouse_filter=Control.MOUSE_FILTER_IGNORE;add_child(paper)
 view._image(self,A.icon("clipboard-list"),Rect2(20,20,28,32),INK)
 heading=view._label(self,"本次物品",Rect2(58,17,245,38),26,INK,true)
 subtitle=view._label(self,"",Rect2(22,54,441,23),16,Color("70604a"))
 scroll=ScrollContainer.new();scroll.name="QuickTradeScroll";scroll.position=Vector2(18,84);scroll.size=Vector2(449,425)
 scroll.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_DISABLED;scroll.vertical_scroll_mode=ScrollContainer.SCROLL_MODE_AUTO
 scroll.follow_focus=true;add_child(scroll)
 rows=VBoxContainer.new();rows.size_flags_horizontal=Control.SIZE_EXPAND_FILL;rows.add_theme_constant_override("separation",3);scroll.add_child(rows)
 empty_hint=view._label(self,"暂无待看物品\n从库存挑一件摆上柜台",Rect2(50,220,385,110),22,Color("70604a"))
 empty_hint.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
 summary=view._label(self,"",Rect2(22,522,441,30),21,INK,true)
 balance=view._label(self,"",Rect2(22,552,441,24),16,Color("70604a"));balance.clip_text=true
 checkout=key(self,"统一结算",Rect2(18,582,310,52),func():request("checkout",""),"handshake",true);checkout.name="QuickCheckout";checkout.clip_text=true
 sendoff=key(self,"送客",Rect2(338,582,130,52),func():request("send",""),"right-from-bracket");sendoff.name="QuickSendOff"
 for node in [summary,balance,checkout,sendoff]:bottom_rects[node]=node.position
 visibility_changed.connect(func():
  if not is_visible_in_tree():close_popup())

func fit_height(height:float) -> void:
 size.y=height
 var extra=height-791.0
 scroll.size.y=425.0+extra
 for node in bottom_rects:node.position=bottom_rects[node]+Vector2(0,extra)

func request(verb: String,uid: String) -> void:
 if snapshot.is_empty():return
 var price:float=snapshot.net if uid=="" else row_views.get(uid,{}).get("shown_price",INF)
 view._quick_action(verb,uid,snapshot.trade_id,snapshot.version,price)

func add_row(uid: String) -> void:
 var panel := Control.new()
 panel.name = "quick_row_" + uid
 panel.custom_minimum_size = Vector2(425,ROW_HEIGHT)
 panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
 rows.add_child(panel)
 var focus := key(panel,"",Rect2(0,0,425,ROW_HEIGHT),func():request("focus",uid))
 focus.name = "quick_focus_" + uid
 focus.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
 var thumb = view._image(panel,null,Rect2(12,5,38,51))
 var title = view._label(panel,"",Rect2(62,5,216,28),20,INK,true)
 title.clip_text = true
 var state = view._label(panel,"",Rect2(62,33,346,23),16,MUTED)
 state.clip_text = true
 var price = view._label(panel,"",Rect2(280,5,129,28),19,INK,true)
 price.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
 price.clip_text = true
 var divider := UIKit.rule()
 divider.position = Vector2(7,ROW_HEIGHT-2)
 divider.size = Vector2(411,1)
 divider.mouse_filter = Control.MOUSE_FILTER_IGNORE
 panel.add_child(divider)
 var inspect := key(panel,"鉴定",Rect2(12,71,106,38),func():request("inspect",uid),"magnifying-glass")
 inspect.name = "quick_inspect_" + uid
 var offer := key(panel,"议价",Rect2(125,71,88,38),func():request("offer",uid))
 offer.name = "quick_offer_" + uid
 var choose := key(panel,"锁价",Rect2(220,71,119,38),func():request("toggle",uid))
 choose.name = "quick_select_" + uid
 var more := key(panel,"更多",Rect2(346,71,67,38),func():request("more",uid))
 more.name = "quick_more_" + uid
 more.tooltip_text = "抵押、报警或收回"
 row_views[uid] = {
  "panel":panel,"focus":focus,"thumb":thumb,"title":title,"price":price,
  "state":state,"divider":divider,"choose":choose,"inspect":inspect,"offer":offer,
  "more":more,"shown_price":INF
 }

func refresh(s: Dictionary) -> void:
 var t=s.get("trade")
 if t==null:return
 var shown=CounterDialogue.table_items(s);var ids=shown.map(func(info):return String(info.uid))
 if last_trade!=str(t.id):
  last_trade=str(t.id);last_focus="";close_popup();scroll.scroll_vertical=0
 for uid in row_views.keys():
  if uid not in ids:row_views[uid].panel.free();row_views.erase(uid)
 for i in ids.size():
  var uid:String=ids[i]
  if not row_views.has(uid):add_row(uid)
  rows.move_child(row_views[uid].panel,i)
 empty_hint.visible=ids.is_empty()
 var totals=TradeSession.summary(s);var count=int(totals.buy_count)+int(totals.sell_count)
 snapshot={"trade_id":str(t.id),"version":int(totals.version),"net":float(totals.net)}
 var blocked: bool = view.desk.busy or view.desk._scene_blocked()
 heading.text="本次物品 · %d 件"%ids.size()
 subtitle.text="%s  ·  来客 %d  /  本店 %d"%[GameData.npc(t.npcId).name,shown.filter(func(info):return info.direction=="buy").size(),shown.filter(func(info):return info.direction=="sell").size()]
 for info in shown:
  var it=TradeSession.item(s,info.uid)
  if it==null:continue
  var row:Dictionary=row_views[info.uid];var line=TradeSession.row(s,info.uid)
  var selected=bool(line.get("selected",false)) and line.get("status","")=="confirmed"
  row.shown_price=float(info.price);row.thumb.texture=A.watch(it)
  var focused: bool = info.focused
  row.title.text = WatchForgery.sale_name(it)
  row.title.tooltip_text = row.title.text
  row.focus.tooltip_text = row.title.text
  row.price.text = ("要价 " if info.direction == "buy" else "出价 ") + UIKit.money(info.price)
  row.price.tooltip_text = row.price.text
  row.state.text = "已锁价 · 待结算" if selected else "物证 %d · 已商谈 %d 次" % [Model.evidence_count(it),int(line.get("context",{}).get("rounds",0))]
  row.state.tooltip_text = line.get("reason","")
  row.choose.text = "取消锁价" if selected else "按此价锁定"
  for action in [row.inspect,row.offer,row.choose,row.more]:
   action.accessibility_name = "%s · %s" % [action.text,row.title.text]
  row.choose.accessibility_name += " · " + UIKit.money(info.price)
  row.choose.tooltip_text = "取消这件的锁价" if selected else "加入待结算，此时不扣款、不消耗 AP"
  row.choose.disabled = blocked or not selected and line.get("status","") in ["blocked","rejected"]
  if row.choose.disabled and not blocked: row.choose.tooltip_text = line.get("reason","")
  row.focus.disabled = blocked
  row.inspect.disabled = blocked
  row.more.disabled = blocked
  row.offer.disabled = blocked or selected
  row.offer.tooltip_text = "请先取消这件的锁价，再议价" if selected else ""
  if row.get("focused") != focused:
   row.focused = focused
   row.panel.custom_minimum_size.y = ACTIVE_HEIGHT if focused else ROW_HEIGHT
   row.divider.visible = not focused
   for button in [row.inspect,row.offer,row.choose,row.more]: button.visible = focused
   for face in ["normal","hover","pressed","hover_pressed","disabled"]:
    var fill := Color("f4d6a1") if focused else Color("ffecc6") if face == "hover" else Color.TRANSPARENT
    var edge := Color("a56832") if focused else Color.TRANSPARENT
    row.focus.add_theme_stylebox_override(face,view._style(fill,edge,5))
  var guide_inspection: bool = focused and not selected and info.direction == "buy" and Model.evidence_count(it) == 0
  if row.get("guide_inspection") != guide_inspection:
   row.guide_inspection = guide_inspection
   skin(row.inspect,guide_inspection,false)
 summary.text = "已锁价 %d 件" % count if count > 0 else "逐件锁价后可统一结算"
 var problem=TradeSession.checkout_problem(s) if count>0 else ""
 if problem=="" and count>0:problem=StoreCosts.device_problem(s,"quote_terminal")
 balance.text=problem if problem!="" else "结算后余 %s Cr · 整批 1 AP"%Model.jnum(s.cash+totals.net) if count>0 else "结算一次消耗 1 AP"
 balance.tooltip_text=balance.text;balance.add_theme_color_override("font_color",RED if problem!="" else Color("70604a"))
 checkout.text = UIKit.batch_payment_caption(totals)
 checkout.disabled = blocked or count == 0 or problem != ""
 checkout.tooltip_text = problem
 sendoff.disabled=blocked;sendoff.tooltip_text="送客；取消尚未结算的选择"
 var focus_uid:String=TradeSession.session(s).get("focus","")
 if focus_uid!=last_focus:
  last_focus=focus_uid
  if row_views.has(focus_uid):scroll.call_deferred("ensure_control_visible",row_views[focus_uid].panel)

func close_popup() -> void:
 if is_instance_valid(popup):popup.hide();popup.queue_free()
 popup=null

func make_popup() -> VBoxContainer:
 close_popup();popup=PopupPanel.new();popup.theme=UIKit.build_theme();popup.wrap_controls=true
 popup.add_theme_stylebox_override("panel",view._style(PAPER,INK,8));add_child(popup)
 var margin=MarginContainer.new()
 for side in ["margin_left","margin_top","margin_right","margin_bottom"]:margin.add_theme_constant_override(side,14)
 popup.add_child(margin)
 var box=VBoxContainer.new();box.add_theme_constant_override("separation",9);margin.add_child(box)
 return box

func show_popup() -> void:
 var at=view.get_global_transform_with_canvas()*(position+Vector2(24,167))
 popup.popup(Rect2i(Vector2i(at),Vector2i(435,0)))

func offer_popup(context: Dictionary) -> void:
 var it=TradeSession.item(Game.state,context.uid)
 if it==null or TradeSession.row(Game.state,context.uid).get("selected",false):return
 var box=make_popup();var header=HBoxContainer.new();box.add_child(header)
 popup.accessibility_name="议价"
 var title=view._label(header,GameData.def(WatchForgery.appearance_id(it)).name,Rect2(0,0,340,34),23,INK,true);title.size_flags_horizontal=Control.SIZE_EXPAND_FILL
 var close_button=key(header,"",Rect2(0,0,36,36),close_popup,"xmark")
 close_button.custom_minimum_size=Vector2(36,36)
 close_button.accessibility_name="关闭议价"
 var estimate=Model.estimate(it)
 box.add_child(UIKit.label("当前价 %s Cr · 估价 %s–%s"%[Model.jnum(context.price),Model.jnum(estimate.low),Model.jnum(estimate.high)],17,INK))
 var line=HBoxContainer.new();line.add_theme_constant_override("separation",6);box.add_child(line)
 var edit=LineEdit.new();edit.name="QuickOfferValue";edit.custom_minimum_size=Vector2(140,49)
 edit.accessibility_name="我的报价（Cr）"
 edit.virtual_keyboard_type=LineEdit.KEYBOARD_TYPE_NUMBER
 edit.add_theme_font_override("font",R.latin(true));edit.add_theme_font_size_override("font_size",28)
 for color in ["font_color","font_uneditable_color","caret_color"]:edit.add_theme_color_override(color,INK)
 edit.add_theme_color_override("font_selected_color",PAPER);edit.add_theme_color_override("selection_color",Color("243a30"))
 var style=view._source_style(R.quote_skin(),8);style.set_content_margin_all(10)
 for state in ["normal","focus","read_only"]:edit.add_theme_stylebox_override(state,style)
 edit.text=str(int(view.desk.dial.value))
 for amount in [-10,-1]:
  var step:int=amount
  key(line,str(step),Rect2(0,0,42,43),func():
   if edit.editable and edit.text.is_valid_int():edit.text=str(clampi(int(edit.text)+step,view.desk.dial.min_value,view.desk.dial.max_value))).custom_minimum_size=Vector2(42,43)
 line.add_child(edit)
 for amount in [1,10]:
  var step:int=amount
  key(line,"+"+str(step),Rect2(0,0,42,43),func():
   if edit.editable and edit.text.is_valid_int():edit.text=str(clampi(int(edit.text)+step,view.desk.dial.min_value,view.desk.dial.max_value))).custom_minimum_size=Vector2(42,43)
 var evidence=HFlowContainer.new();evidence.add_theme_constant_override("h_separation",6);box.add_child(evidence)
 var reading=UIKit.label("",17,INK,false,true)
 # Measure the wrapped note at the width of the quote before opening the popup.
 reading.custom_minimum_size.x=390
 reading.size.x=390
 box.add_child(reading)
 for tool_id in it.evidence:
  var tool:=String(tool_id)
  if not GameData.relevant_tool(it.defId,tool):continue
  var chip=key(evidence,GameData.evidence_short(it.defId,tool),Rect2(0,0,120,34),func():
   if view._quick_valid(context.uid,context.trade_id,context.version,context.price) and view.desk.toggle_quote_evidence(context.uid,tool):
    sync_evidence(evidence,reading,TradeSession.item(Game.state,context.uid)))
  chip.custom_minimum_size=Vector2(120,34);chip.add_theme_font_size_override("font_size",16)
  chip.name="QuickEvidence_"+tool
  chip.set_meta("evidence_tool",tool)
  if view.desk.is_latest_inspection(it,tool):
   chip.text="新录 · "+chip.text
 sync_evidence(evidence,reading,it)
 var hint=UIKit.label("物证 %d · 已商谈 %d 次"%[Model.evidence_count(it),int(CounterDialogue.current(Game.state).context.rounds)],16,INK);box.add_child(hint)
 var submit=key(box,"出价",Rect2(0,0,390,48),func():
  if not edit.text.is_valid_int() or int(edit.text)<view.desk.dial.min_value or int(edit.text)>view.desk.dial.max_value:
   hint.text="请输入 %d–%d Cr 的整数"%[view.desk.dial.min_value,view.desk.dial.max_value];return
  var amount=int(edit.text);close_popup();view._quick_offer(context,amount),"gavel",true)
 submit.name="QuickOfferSubmit";submit.custom_minimum_size=Vector2(390,48);submit.disabled=not edit.editable
 edit.text_submitted.connect(func(_text):
  if not submit.disabled:submit.pressed.emit())
 show_popup()
 edit.call_deferred("grab_focus");edit.call_deferred("select_all")

func sync_evidence(box: Control,reading: Label,it: Dictionary) -> void:
 reading.visible=box.get_child_count()>0
 reading.text="挑一条物证，随报价出示给客人。"
 for child in box.get_children():
  if not child is Button:continue
  var tool:String=child.get_meta("evidence_tool","")
  var selected:bool=tool==view.desk.chosen_evidence
  skin(child,false,selected)
  if selected:
   reading.text=Model.displayed_clue(it,tool)

func more_popup(context: Dictionary) -> void:
 var box=make_popup()
 popup.accessibility_name="更多操作"
 var header=HBoxContainer.new();box.add_child(header)
 var title=UIKit.label("这件物品 · 更多操作",23,INK);title.size_flags_horizontal=Control.SIZE_EXPAND_FILL
 header.add_child(title)
 var close=UIKit.close_button(Vector2(40,40));close.accessibility_name="关闭更多操作"
 close.pressed.connect(close_popup);header.add_child(close)
 var count=0
 for source in view.desk.actions.get_children()+[view.desk.dialogue_put_aside]:
  var caption:String=source.text
  if caption.begins_with("出价 ") or caption.begins_with("接受 ") or "拿去鉴定" in caption or caption=="送客":continue
  count+=1
  var display_caption="收回本件" if source==view.desk.dialogue_put_aside and TradeSession.row(Game.state,context.uid).direction=="sell" else caption
  var b=key(box,display_caption,Rect2(0,0,390,44),func():close_popup();view._quick_source(context,caption),"arrow-rotate-left" if source==view.desk.dialogue_put_aside else "list")
  b.custom_minimum_size=Vector2(390,44);b.disabled=source.disabled;b.tooltip_text=source.tooltip_text
 if count==0:box.add_child(UIKit.label("当前没有额外操作",18,INK))
 show_popup()
