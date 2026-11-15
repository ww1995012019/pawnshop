extends Control
## Ordinary-trade presentation. All mutations are routed through the view's
## trade/UID/version guard and the existing counter controller.
const R=preload("res://scripts/ui/reference_atlas.gd")
const A=preload("res://scripts/ui/comic_assets.gd")
const INK=Color("20241e")
const PAPER=Color("f7e5c3")
const RED=Color("b84e37")
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

func key(parent: Node,text: String,rect: Rect2,fn: Callable,icon:="",primary:=false) -> Button:
 var b=view._button(parent,text,rect,fn,icon)
 b.add_theme_font_override("font",R.font(true));b.add_theme_font_size_override("font_size",19)
 b.add_theme_constant_override("icon_max_width",23)
 skin(b,primary,false)
 return b

func skin(b: Button,primary: bool,selected: bool) -> void:
 for state in ["normal","hover","pressed","disabled","focus"]:
  var st=view._source_style(R.blank_button(0 if primary and state!="disabled" else 1),8)
  st.set_content_margin_all(5)
  if selected:st.modulate_color=Color(.15,.26,.26)
  elif state=="hover":st.modulate_color=Color(1,.97,.9)
  elif state=="pressed":st.modulate_color=Color(.92,.9,.84)
  b.add_theme_stylebox_override(state,st)
 for color in ["font_color","font_hover_color","font_pressed_color","font_focus_color","font_disabled_color","icon_normal_color","icon_hover_color","icon_pressed_color","icon_focus_color","icon_disabled_color"]:
  b.add_theme_color_override(color,PAPER if primary or selected else INK)
 b.add_theme_color_override("font_disabled_color",Color("867866"));b.add_theme_color_override("icon_disabled_color",Color("867866"))

func setup(controller) -> void:
 view=controller;name="QuickTradeList";position=Vector2(1186,68);size=Vector2(485,791)
 mouse_filter=Control.MOUSE_FILTER_STOP
 var paper=Panel.new();paper.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
 paper.add_theme_stylebox_override("panel",view._source_style(R.quick_list_paper(),10));paper.mouse_filter=Control.MOUSE_FILTER_IGNORE;add_child(paper)
 view._image(self,A.icon("clipboard-list"),Rect2(20,20,28,32),INK)
 heading=view._label(self,"本次物品",Rect2(58,17,245,38),26,INK,true)
 subtitle=view._label(self,"",Rect2(22,54,441,23),16,Color("70604a"))
 scroll=ScrollContainer.new();scroll.name="QuickTradeScroll";scroll.position=Vector2(18,84);scroll.size=Vector2(449,425)
 scroll.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_DISABLED;scroll.vertical_scroll_mode=ScrollContainer.SCROLL_MODE_AUTO;add_child(scroll)
 rows=VBoxContainer.new();rows.size_flags_horizontal=Control.SIZE_EXPAND_FILL;rows.add_theme_constant_override("separation",7);scroll.add_child(rows)
 empty_hint=view._label(self,"暂无待看物品\n从库存挑一件摆上柜台",Rect2(50,220,385,110),22,Color("70604a"))
 empty_hint.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
 summary=view._label(self,"",Rect2(22,522,441,30),21,INK,true)
 balance=view._label(self,"",Rect2(22,552,441,24),16,Color("70604a"));balance.clip_text=true
 checkout=key(self,"统一结算",Rect2(18,582,310,52),func():request("checkout",""),"handshake",true);checkout.name="QuickCheckout"
 sendoff=key(self,"送客",Rect2(338,582,130,52),func():request("send",""),"right-from-bracket");sendoff.name="QuickSendOff"
 visibility_changed.connect(func():
  if not is_visible_in_tree():close_popup())

func request(verb: String,uid: String) -> void:
 if snapshot.is_empty():return
 var price:float=snapshot.net if uid=="" else row_views.get(uid,{}).get("shown_price",INF)
 view._quick_action(verb,uid,snapshot.trade_id,snapshot.version,price)

func add_row(uid: String) -> void:
 var panel=Control.new();panel.name="quick_row_"+uid;panel.custom_minimum_size=Vector2(425,100);panel.size_flags_horizontal=Control.SIZE_EXPAND_FILL;rows.add_child(panel)
 var focus=key(panel,"",Rect2(0,0,425,100),func():request("focus",uid));focus.name="quick_focus_"+uid
 focus.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
 var thumb=view._image(panel,null,Rect2(17,10,44,78))
 var title=view._label(panel,"",Rect2(72,7,224,29),20,INK,true);title.clip_text=true
 var price=view._label(panel,"",Rect2(72,38,224,28),20,INK,true);price.clip_text=true
 var state=view._label(panel,"",Rect2(72,72,224,21),14,Color("70604a"));state.clip_text=true
 var choose=key(panel,"选购",Rect2(308,9,108,37),func():request("toggle",uid),"coins");choose.name="quick_select_"+uid
 var inspect=key(panel,"",Rect2(308,56,34,35),func():request("inspect",uid),"magnifying-glass");inspect.name="quick_inspect_"+uid;inspect.tooltip_text="鉴定这件原物"
 var offer=key(panel,"",Rect2(345,56,34,35),func():request("offer",uid),"gavel");offer.name="quick_offer_"+uid;offer.tooltip_text="详情与议价"
 var more=key(panel,"",Rect2(382,56,34,35),func():request("more",uid),"list");more.name="quick_more_"+uid;more.tooltip_text="更多操作：抵押、报警或收回"
 row_views[uid]={"panel":panel,"focus":focus,"thumb":thumb,"title":title,"price":price,"state":state,"choose":choose,"inspect":inspect,"offer":offer,"more":more,"shown_price":INF}

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
 var blocked=view.desk.busy or view.desk._scene_blocked()
 heading.text="本次物品 · %d 件"%ids.size()
 subtitle.text="%s  ·  来客 %d  /  本店 %d"%[GameData.npc(t.npcId).name,shown.filter(func(info):return info.direction=="buy").size(),shown.filter(func(info):return info.direction=="sell").size()]
 for info in shown:
  var it=TradeSession.item(s,info.uid)
  if it==null:continue
  var row:Dictionary=row_views[info.uid];var line=TradeSession.row(s,info.uid)
  var selected=bool(line.get("selected",false)) and line.get("status","")=="confirmed"
  row.shown_price=float(info.price);row.thumb.texture=A.watch(it)
  row.title.text=GameData.def(WatchForgery.appearance_id(it)).name;row.title.tooltip_text=row.title.text
  row.title.add_theme_color_override("font_color",RED if info.focused else INK)
  row.price.text=("要价 " if info.direction=="buy" else "报价 ")+Model.jnum(info.price)+" Cr"
  row.state.text="已选 · 价格锁定" if selected else "物证 %d · 已商谈 %d次"%[Model.evidence_count(it),int(line.get("context",{}).get("rounds",0))]
  row.state.tooltip_text=line.get("reason","")
  row.choose.text="已选" if selected else "选购" if info.direction=="buy" else "出售"
  row.choose.icon=A.icon("check" if selected else "coins");skin(row.choose,false,selected)
  row.choose.tooltip_text="取消这件选择" if selected else "按当前价选入待结算；此时不扣钱、不消耗 AP"
  row.choose.disabled=blocked or not selected and line.get("status","") in ["blocked","rejected"]
  if row.choose.disabled and not blocked:row.choose.tooltip_text=line.get("reason","")
  for button in [row.focus,row.inspect,row.offer,row.more]:button.disabled=blocked
 summary.text="已选 %d 件  ·  %s %s Cr"%[count,"待付" if totals.net<0 else "待收",Model.jnum(absf(totals.net))]
 var problem=TradeSession.checkout_problem(s) if count>0 else ""
 if problem=="" and count>0:problem=StoreCosts.device_problem(s,"quote_terminal")
 balance.text=problem if problem!="" else "结算后余 %s Cr · 整批 1 AP"%Model.jnum(s.cash+totals.net) if count>0 else "逐件选中，统一交割 · 整批 1 AP"
 balance.tooltip_text=balance.text;balance.add_theme_color_override("font_color",RED if problem!="" else Color("70604a"))
 checkout.text="统一结算 · %d 件"%count;checkout.disabled=blocked or count==0 or problem!="";checkout.tooltip_text=problem
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
 popup.add_theme_stylebox_override("panel",view._source_style(R.quick_list_paper(),10));add_child(popup)
 var margin=MarginContainer.new()
 for side in ["margin_left","margin_top","margin_right","margin_bottom"]:margin.add_theme_constant_override(side,14)
 popup.add_child(margin)
 var box=VBoxContainer.new();box.add_theme_constant_override("separation",9);margin.add_child(box)
 return box

func show_popup() -> void:
 var at=view.get_global_transform_with_canvas()*Vector2(1210,235)
 popup.popup(Rect2i(Vector2i(at),Vector2i(435,0)))

func offer_popup(context: Dictionary) -> void:
 var it=TradeSession.item(Game.state,context.uid)
 if it==null:return
 var box=make_popup();var header=HBoxContainer.new();box.add_child(header)
 var title=view._label(header,GameData.def(WatchForgery.appearance_id(it)).name,Rect2(0,0,340,34),23,INK,true);title.size_flags_horizontal=Control.SIZE_EXPAND_FILL
 key(header,"",Rect2(0,0,36,36),close_popup,"xmark").custom_minimum_size=Vector2(36,36)
 var estimate=Model.estimate(it)
 box.add_child(UIKit.label("当前价 %s Cr · 估价 %s–%s"%[Model.jnum(context.price),Model.jnum(estimate.low),Model.jnum(estimate.high)],17,INK))
 var line=HBoxContainer.new();line.add_theme_constant_override("separation",6);box.add_child(line)
 var edit=LineEdit.new();edit.name="QuickOfferValue";edit.custom_minimum_size=Vector2(140,49)
 edit.add_theme_font_override("font",R.latin(true));edit.add_theme_font_size_override("font_size",28)
 for color in ["font_color","font_uneditable_color","caret_color"]:edit.add_theme_color_override(color,INK)
 edit.add_theme_color_override("font_selected_color",PAPER);edit.add_theme_color_override("selection_color",Color("243a30"))
 var style=view._source_style(R.quote_skin(),8);style.set_content_margin_all(10)
 for state in ["normal","focus","read_only"]:edit.add_theme_stylebox_override(state,style)
 edit.text=str(int(view.desk.dial.value));edit.editable=not CounterDialogue.current(Game.state).get("selected",false)
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
 for source in view.desk.chips.get_children():
  if not source is Button:continue
  var origin:Button=source
  var chip=key(evidence,str(source.get_meta("evidence_caption",source.text)),Rect2(0,0,120,34),func():
   if view._quick_valid(context.uid,context.trade_id,context.version,context.price) and is_instance_valid(origin) and not origin.disabled:
    origin.pressed.emit()
    sync_evidence(evidence))
  chip.custom_minimum_size=Vector2(120,34);chip.add_theme_font_size_override("font_size",16)
  chip.set_meta("evidence_tool",source.get_meta("evidence_tool",""))
 sync_evidence(evidence)
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

func sync_evidence(box: Control) -> void:
 for child in box.get_children():
  if child is Button:skin(child,false,str(child.get_meta("evidence_tool",""))==view.desk.chosen_evidence)

func more_popup(context: Dictionary) -> void:
 var box=make_popup();box.add_child(UIKit.label("这件物品 · 更多操作",23,INK))
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
