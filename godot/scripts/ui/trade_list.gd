extends VBoxContainer
## The scrollable goods are separate from the persistent checkout footer.
var shell: Node
var close_dialog: Callable
var scroll: ScrollContainer
var lists: VBoxContainer
var totals: Label
var notice: Label
var checkout: Button
var expanded := ""
var refresh_pending := false
var first_refresh := true
static func open(owner_shell: Node) -> void:
 if Game.state.trade==null: return
 Game.dispatch({"type":"TRADE_OPEN"})
 if TradeSession.session(Game.state).is_empty(): return
 var modal: Array=owner_shell.modal("多件买卖 · "+GameData.npc(Game.state.trade.npcId).name,1120)
 var content=load("res://scripts/ui/trade_list.gd").new()
 modal[0].add_child(content)
 content.setup(owner_shell,modal[1])
func setup(owner_shell: Node, closer: Callable) -> void:
 shell=owner_shell;close_dialog=closer
 name="multi_trade_list"
 add_theme_constant_override("separation",10)
 notice=UIKit.label("",18,UIKit.AMBER,false,true);add_child(notice)
 var top=UIKit.hbox(10);add_child(top)
 var review=UIKit.button("请 NPC 看看推荐清单","primary",Vector2(0,48),18)
 review.size_flags_horizontal=Control.SIZE_EXPAND_FILL
 review.pressed.connect(func(): _send({"type":"TRADE_REVIEW"}))
 top.add_child(review)
 var end=UIKit.button("结束接待","danger",Vector2(160,48),18);end.name="trade_end_visit"
 end.pressed.connect(func(): Game.dispatch({"type":"TRADE_END"});close_dialog.call())
 top.add_child(end)
 scroll=ScrollContainer.new()
 scroll.custom_minimum_size=Vector2(0,minf(510,get_viewport_rect().size.y*0.48))
 scroll.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_DISABLED
 add_child(scroll)
 lists=UIKit.vbox(12);lists.size_flags_horizontal=Control.SIZE_EXPAND_FILL;scroll.add_child(lists)
 add_child(UIKit.rule())
 totals=UIKit.label("",19,UIKit.CYAN,false,true);totals.name="trade_totals";add_child(totals)
 checkout=UIKit.button("交割已确认商品 · 1 AP","good",Vector2(0,52),20);checkout.name="trade_checkout"
 checkout.pressed.connect(func():
  var summary=TradeSession.summary(Game.state)
  _send({"type":"TRADE_CHECKOUT","version":summary.version,"batch":"batch-"+str(summary.version)}))
 add_child(checkout)
 Game.changed.connect(_changed)
 _refresh()
func _send(action: Dictionary) -> void:
 Game.dispatch(action)
func _changed(_before: Dictionary,_after: Dictionary,_action: Dictionary) -> void:
 if refresh_pending: return
 refresh_pending=true
 call_deferred("_refresh")
func _refresh() -> void:
 refresh_pending=false
 if TradeSession.session(Game.state).is_empty(): return
 var saved_scroll=int(TradeSession.session(Game.state).get("view_scroll",0)) if first_refresh else scroll.scroll_vertical
 first_refresh=false
 UIKit.clear(lists)
 var se=TradeSession.session(Game.state)
 notice.text=Game.state.notice
 lists.add_child(UIKit.label("推荐给 NPC · 最多6件 · 逐件判断",22,UIKit.AMBER))
 var stock=UIKit.vbox(6);stock.name="trade_stock";lists.add_child(stock)
 for it in Game.state.inventory:
  var existing=TradeSession.row(Game.state,it.uid)
  if not existing.is_empty() and existing.included: continue
  var why=Model.sale_eligibility(it,Game.state.trade.npcId)
  var uid: String=it.uid
  var button=UIKit.button("推荐 "+WatchForgery.sale_name(it),"secondary",Vector2(0,50),18)
  button.icon=UIKit.physical_icon(it);button.expand_icon=true;button.add_theme_constant_override("icon_max_width",40)
  button.disabled=why!=null
  button.pressed.connect(func(): _send({"type":"TRADE_ADD","uid":uid,"direction":"sell"}))
  stock.add_child(button)
  if why!=null: stock.add_child(UIKit.label(String(why),16,UIKit.AMBER,false,true))
 if stock.get_child_count()==0: stock.add_child(UIKit.label("没有其他可推荐的库存。",17,UIKit.MUTED))
 lists.add_child(UIKit.rule())
 lists.add_child(UIKit.label("NPC 带来的 · 可鉴定、还价和购买",22,UIKit.AMBER))
 var visitor=UIKit.vbox(6);visitor.name="trade_visitor_goods";lists.add_child(visitor)
 for it in se.goods:
  var existing=TradeSession.row(Game.state,it.uid)
  if not existing.is_empty() and existing.included: continue
  var uid: String=it.uid
  var box=UIKit.hbox(8);visitor.add_child(box)
  var choose=UIKit.button("购买 "+Game.def_name(it.defId),"secondary",Vector2(0,50),18)
  choose.size_flags_horizontal=Control.SIZE_EXPAND_FILL
  choose.icon=UIKit.physical_icon(it);choose.expand_icon=true;choose.add_theme_constant_override("icon_max_width",40)
  choose.pressed.connect(func(): _send({"type":"TRADE_ADD","uid":uid,"direction":"buy"}))
  box.add_child(choose)
  var inspect=UIKit.button("鉴定","secondary",Vector2(100,50),18)
  inspect.pressed.connect(func(): _inspect(uid));box.add_child(inspect)
 if visitor.get_child_count()==0: visitor.add_child(UIKit.label("其余商品已加入清单，或本次没有随身待售货。",17,UIKit.MUTED,false,true))
 lists.add_child(UIKit.rule())
 lists.add_child(UIKit.label("本次商谈清单 · 未确认不会扣款",22,UIKit.AMBER))
 for line in se.lines:
  if not line.included: continue
  _line(line)
 var summary=TradeSession.summary(Game.state)
 var why=TradeSession.checkout_problem(Game.state)
 totals.text="售出 %d 件 · 收入 %s Cr　买入 %d 件 · 支出 %s Cr\n%s %s Cr · 交割 1 AP%s" % [summary.sell_count,Model.jnum(summary.income),summary.buy_count,Model.jnum(summary.expense),"实收" if summary.net>=0 else "实付",Model.jnum(absf(summary.net)),"\n"+why if why!="" else ""]
 checkout.disabled=why!=""
 scroll.set_deferred("scroll_vertical",saved_scroll)
func _line(line: Dictionary) -> void:
 var it=TradeSession.item(Game.state,line.uid)
 var card=UIKit.plate(UIKit.inset_style(10));card.name="trade_line_"+line.uid;lists.add_child(card)
 var col=UIKit.vbox(6);card.add_child(col)
 var label=WatchForgery.sale_name(it) if it!=null else "已移交的原物"
 if it==null:
  for transferred in TradeSession.session(Game.state).acquired:
   if transferred.uid==line.uid: label=WatchForgery.sale_name(transferred)
 var status: String={"queued":"待查看","ready":"愿意成交","counter":"还价中","rejected":"NPC 拒绝","blocked":"暂不能交易","confirmed":"已确认","done":"已交割"}.get(line.status,line.status)
 col.add_child(UIKit.label(("卖给 NPC · " if line.direction=="sell" else "向 NPC 买 · ")+label,20,UIKit.TEXT,false,true))
 col.add_child(UIKit.label("%s · 当前 %s Cr · 本件议价 %d/3" % [status,Model.jnum(line.context.price),int(line.context.rounds)],18,UIKit.CYAN if line.status in ["ready","confirmed","done"] else UIKit.AMBER,false,true))
 col.add_child(UIKit.label(line.reason,17,UIKit.MUTED,false,true))
 if line.status=="done": return
 var uid: String=line.uid
 var buttons=UIKit.hbox(6);col.add_child(buttons)
 var confirm=UIKit.button("确认出售" if line.direction=="sell" else "确认购买","good",Vector2(0,44),18)
 confirm.name="trade_confirm_"+uid;confirm.size_flags_horizontal=Control.SIZE_EXPAND_FILL
 confirm.disabled=line.status not in ["ready","counter"]
 confirm.pressed.connect(func(): _send({"type":"TRADE_CONFIRM","uid":uid}));buttons.add_child(confirm)
 var detail=UIKit.button("议价 / 物证","secondary",Vector2(170,44),18)
 detail.pressed.connect(func(): expanded="" if expanded==uid else uid;_refresh());buttons.add_child(detail)
 if line.direction=="sell":
  var up=UIKit.button("上移","secondary",Vector2(86,44),17)
  up.pressed.connect(func(): _send({"type":"TRADE_REORDER","uid":uid,"shift":-1}));buttons.add_child(up)
 var remove=UIKit.button("移出","secondary",Vector2(92,44),18)
 remove.pressed.connect(func(): _send({"type":"TRADE_REMOVE","uid":uid}));buttons.add_child(remove)
 if expanded!=uid or it==null: return
 var edit=UIKit.hbox(8);col.add_child(edit)
 var price=LineEdit.new();price.text=Model.jnum(line.context.price);price.placeholder_text="本件报价 Cr";price.size_flags_horizontal=Control.SIZE_EXPAND_FILL;price.custom_minimum_size.y=48
 price.add_theme_font_size_override("font_size",20);edit.add_child(price)
 var submit=UIKit.button("提交本件报价","primary",Vector2(190,48),18)
 submit.pressed.connect(func():
  if not price.text.is_valid_int(): notice.text="请输入本件的正整数报价。";return
  _send({"type":"TRADE_OFFER","uid":uid,"price":price.text.to_int()}))
 edit.add_child(submit)
 var inspect=UIKit.button("送这件到鉴定台","secondary",Vector2(0,46),18)
 inspect.pressed.connect(func(): _inspect(uid));col.add_child(inspect)
 var estimate=Model.estimate(it)
 col.add_child(UIKit.label("本件估值区间 %s–%s Cr；私人检查不会自动传给对方。" % [Model.jnum(estimate.low),Model.jnum(estimate.high)],17,UIKit.MUTED,false,true))
 for evidence in it.evidence:
  var tool: String=evidence
  var show=UIKit.button("出示本件物证 · "+GameData.evidence_short(it.defId,tool),"secondary",Vector2(0,44),17)
  show.pressed.connect(func(): _send({"type":"TRADE_OFFER","uid":uid,"price":line.context.price,"evidence":tool}))
  col.add_child(show)
func _inspect(uid: String) -> void:
 Game.dispatch({"type":"TRADE_FOCUS","uid":uid,"scroll":scroll.scroll_vertical})
 Game.focus_uid=uid
 close_dialog.call()
 shell.call_deferred("go","inspect",uid)
