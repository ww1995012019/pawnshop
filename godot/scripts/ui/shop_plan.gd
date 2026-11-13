extends VBoxContainer
## One compact entry for long-term decisions; physical work stays at the bench.
var host
var dismiss: Callable
var section := "overview"
var history_mode := "receipts"
var body: VBoxContainer
var status: Label
var tabs := {}
var journal_uid := ""
var market_details := false

func setup(shell: Node, close: Callable, initial := "overview") -> void:
	host = shell
	dismiss = close
	section = initial
	add_theme_constant_override("separation",6)
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var nav := UIKit.grid(3 if shell.portrait_mode() else 6,4)
	add_child(nav)
	for spec in [["overview","总览"],["contracts","委托"],["bulk","回收箱"],["customers","熟客"],["history","履历"],["upgrades","扩建"]]:
		var key: String = spec[0]
		var tab := UIKit.button(spec[1],"secondary",Vector2(0,38),16)
		tab.name = "shop_plan_"+key
		tab.custom_minimum_size.x = 62
		tab.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		tab.pressed.connect(func(): section=key;_render())
		nav.add_child(tab)
		tabs[key] = tab
	status = UIKit.label("",14,UIKit.AMBER,false,true)
	status.visible = false
	add_child(status)
	body = UIKit.vbox(8)
	body.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	add_child(body)
	Game.changed.connect(_changed)
	_render()

func _changed(_previous: Dictionary, next: Dictionary, _action: Dictionary) -> void:
	status.text = next.get("notice","")
	status.visible = status.text != ""
	_render()

func _render() -> void:
	if not is_instance_valid(body): return
	UIKit.clear(body)
	for key in tabs: UIKit.compact(tabs[key],"primary" if key==section else "secondary")
	match section:
		"overview": _overview()
		"contracts": _contracts()
		"bulk": _bulk()
		"customers": _customers()
		"history": _history()
		"upgrades": _upgrades()

func _text(parent: Node, text: String, color := UIKit.TEXT, size := 17) -> Label:
	var label := UIKit.label(text,size,color,false,true)
	label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	parent.add_child(label)
	return label

func _card(title: String, parent: Node = null) -> VBoxContainer:
	var plate := UIKit.plate(UIKit.inset_style(8))
	plate.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	(parent if parent != null else body).add_child(plate)
	var content := UIKit.vbox(5)
	plate.add_child(content)
	_text(content,title,UIKit.AMBER,17)
	return content

func _action(parent: Node, caption: String, action: Dictionary, problem := "", primary := false) -> Button:
	var key := UIKit.button(caption,"primary" if primary else "secondary",Vector2(0,36),15)
	key.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	key.disabled = problem != ""
	key.pressed.connect(func(): Game.dispatch(action))
	parent.add_child(key)
	if problem != "": _text(parent,problem,UIKit.MUTED,13)
	return key

func _navigate(parent: Node, caption: String, page: String, uid := "") -> void:
	var key := UIKit.button(caption,"secondary",Vector2(0,40),14,page if page in ["report","warehouse","inspect","repair"] else "next")
	key.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	key.pressed.connect(func(): dismiss.call();host.call_deferred("_plan_navigate",page,uid))
	parent.add_child(key)

func _overview() -> void:
	var s := Game.state
	var life = load("res://scripts/model/campaign_life.gd")
	var market = load("res://scripts/model/weekly_market.gd")
	var heading := "第 %d 天 · %s" % [int(s.day),"长期经营" if life.is_endless(s) else "21天阶段考核"]
	_text(body,heading,UIKit.AMBER,19)
	var summary := UIKit.grid(1 if host.mobile_mode() else 3,8)
	summary.name = "OverviewSummary"
	summary.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	body.add_child(summary)
	var plan := _card("今日待办",summary)
	plan.get_parent().name = "TodayCard"
	var stories:=UIKit.button("事件簿 · %d 件待处理" % ShopStories.pending(s),"primary",Vector2(0,40),16)
	stories.name="open_story_book"
	stories.pressed.connect(func():dismiss.call();host.call_deferred("_open_story_book_after_close"))
	plan.add_child(stories)
	var costs: Dictionary = StoreCosts.quote(s)
	var remaining := maxi(0,VisitSchedule.limit(s)-int(s.cursor))
	var resources := _card("今日资源",summary)
	resources.get_parent().name = "ResourcesCard"
	_text(resources,"剩余 %s AP" % Model.jnum(s.ap),UIKit.CYAN,18)
	_text(resources,"可接待 %d 位来客" % remaining,UIKit.TEXT,15)
	var expenses := _card("费用与租金",summary)
	expenses.get_parent().name = "CostsCard"
	_text(expenses,"预计费用 %s" % UIKit.money(costs.total),UIKit.TEXT,15)
	_text(expenses,"未付租金 %s" % UIKit.money(Landlord.outstanding(s)),UIKit.AMBER,15)
	_text(body,"先核对到期委托和资金，再安排鉴定、维修与采购。",UIKit.MUTED,15)
	if int(s.day)>=21 and s.phase in ["report","ending"] and not life.is_endless(s):
		var problem: String = life.continue_problem(s)
		_text(plan,"阶段成绩与旧物都将保留；继续经营从下一天开始，不会重扣本次结算。",UIKit.CYAN,14)
		_action(plan,"保留店铺 · 继续经营",{"type":"CONTINUE_CAMPAIGN"},problem,true)
	var assessment=life.summary(s).firstAssessment
	if assessment is Dictionary: _text(plan,"首轮第21天评估："+String(assessment.get("outcome","已完成"))+" · 原经营记录已保留。",UIKit.AMBER,14)
	var now: Dictionary = market.current(s)
	var future: Dictionary = market.forecast(s)
	var prices := _card("行情与下周预告")
	_text(prices,String(now.get("title","本周行情")),UIKit.CYAN)
	_text(prices,_market_summary(now),UIKit.TEXT,17)
	_text(prices,"下周："+String(future.get("title","行情预告")),UIKit.AMBER)
	_text(prices,_market_summary(future),UIKit.TEXT,17)
	var explanation := UIKit.vbox(5)
	explanation.visible = market_details
	_text(explanation,String(now.get("explanation","")),UIKit.MUTED,15)
	_text(explanation,"下周："+String(future.get("explanation","")),UIKit.MUTED,15)
	_text(explanation,"行情影响来客的交易判断；已经谈妥的价格保留。",UIKit.MUTED,15)
	var expand := UIKit.button("收起行情说明" if market_details else "查看行情说明","secondary",Vector2(0,36),16)
	expand.pressed.connect(func():
		market_details = not market_details
		explanation.visible = market_details
		expand.text = "收起行情说明" if market_details else "查看行情说明")
	prices.add_child(expand)
	prices.add_child(explanation)
	var shortcuts := _card("快捷操作")
	var quick := UIKit.grid(2,5)
	shortcuts.add_child(quick)
	_navigate(quick,"账本","report")
	_navigate(quick,"库存","warehouse")

func _market_summary(snapshot: Dictionary) -> String:
	var labels: Dictionary = load("res://scripts/model/weekly_market.gd").LABELS
	if String(snapshot.get("hotTier","")) == "": return "各档需求平稳 · 价格无额外浮动"
	return "%s ↑%d%%   ·   %s ↓%d%%" % [labels.get(snapshot.hotTier,"走热"),int(snapshot.hotPercent),labels.get(snapshot.coldTier,"走冷"),absi(int(snapshot.coldPercent))]

func _contracts() -> void:
	var jobs = load("res://scripts/model/service_contracts.gd")
	_text(body,"先接原物，实物诊断后报价，取得同意再维修；逾期仍可归还顾客原物。",UIKit.MUTED,14)
	var all: Array = jobs.contracts(Game.state)
	var visible_jobs := []
	for job in all:
		if job.status in ["available","diagnosis","quoting","declined","approved","ready"] or (job.status=="expired" and job.get("uid","")!="" and Game.item(job.uid)!=null): visible_jobs.append(job)
	if visible_jobs.is_empty(): _text(body,"今天的委修已全部处理，新的预约会在下个营业日出现。")
	var choices := _choices()
	for job in visible_jobs:
		var id: String = job.id
		var card := _card(String(job.title),choices)
		_object_icon(card,UIKit.item_icon(String(job.model)))
		_text(card,"%s · 第%d天前 · 预算不超过 %s" % [GameData.def(String(job.model)).name,int(job.dueDay),UIKit.money(job.budget)])
		_text(card,String(job.statusText),UIKit.CYAN)
		if job.originalParts: _text(card,"原装要求：保留顾客机芯、表壳与表带，不得替换或伪装。",UIKit.AMBER,13)
		if job.status=="available":
			var reason := "先结束当前接待再接委修。" if Game.state.trade!=null else Model.business_hours_problem(Game.state)
			var held := 0
			for existing in all:
				if existing.get("uid","")!="" and Game.item(existing.uid)!=null: held+=1
			if reason=="" and held>=3: reason="最多保管三件委修原物，请先交付或归还。"
			if reason=="" and Model.empty_cell(Game.state,{"uid":"","defId":job.model,"rotated":false})==null: reason="后仓没有保管原物的空间，请先整理。"
			_text(card,String(job.problem),UIKit.MUTED,14)
			_action(card,"接下委修原物",{"type":"TAKE_SERVICE_CONTRACT","id":id},reason,true)
			continue
		var uid: String = job.uid
		if uid != "":
			_navigate(card,"拿原物去鉴定","inspect",uid)
			if job.status in ["approved","ready"]: _navigate(card,"到维修台处理原物","repair",uid)
		if job.status in ["diagnosis","quoting","declined"]:
			var row := UIKit.hbox(5)
			card.add_child(row)
			var quote := SpinBox.new()
			quote.min_value=1
			quote.max_value=float(job.budget)
			quote.value=float(job.quote) if float(job.quote)>0 else floor(float(job.budget)*.75)
			quote.step=1
			quote.suffix=" Cr"
			quote.size_flags_horizontal=Control.SIZE_EXPAND_FILL
			quote.get_line_edit().virtual_keyboard_type=LineEdit.KEYBOARD_TYPE_NUMBER
			quote.get_line_edit().add_theme_font_size_override("font_size",14)
			row.add_child(quote)
			var send := UIKit.button("提交维修报价","primary",Vector2(120,34),14)
			send.custom_minimum_size.x=120
			send.disabled=job.status=="diagnosis" or Model.business_hours_problem(Game.state)!=""
			send.pressed.connect(func(): quote.apply();Game.dispatch({"type":"QUOTE_SERVICE_CONTRACT","id":id,"price":int(quote.value)}))
			row.add_child(send)
			_text(card,"报价前须在鉴定台取得本件原物的标识/品相记录。",UIKit.MUTED,13)
		if job.status in ["approved","ready"]:
			_action(card,"交还原物 · 收取 %s" % UIKit.money(job.quote),{"type":"DELIVER_SERVICE_CONTRACT","id":id},"实际维修与封盖复测尚未完成。" if not job.ready else Model.business_hours_problem(Game.state) if Model.business_hours_problem(Game.state)!="" else "交付需要1 AP。" if not Model.has_ap(Game.state,1) else "",true)
		var original=Game.item(uid)
		var return_problem: String=jobs._safe_problem(Game.state,original) if original!=null else "登记原物不在保管中，请先找回原物。"
		_action(card,"归还原物 · 取消本单",{"type":"RETURN_SERVICE_CONTRACT","id":id},return_problem)

func _bulk() -> void:
	var crates = load("res://scripts/model/bulk_crates.gd")
	var lot: Dictionary = crates.offer(Game.state)
	var card := _card(String(lot.get("title","商人的混装回收箱")))
	_text(card,"整箱 %d 件 · 报价 %s · 已抽查 %d / 2" % [int(lot.get("itemCount",4)),UIKit.money(lot.get("price",0)),int(lot.get("sampleCount",0))],UIKit.CYAN)
	_text(card,"每箱最多抽查两件，每次消耗1 AP；整箱购入消耗1 AP。报价与原物固定，重开页面不会换货。",UIKit.MUTED,14)
	for sample in lot.get("samples",[]):
		var item := _card("抽查记录 · 第%d件" % (int(sample.get("index",0))+1),card)
		_text(item,String(sample.get("model","已查原物")))
		_text(item,String(sample.get("observation","")),UIKit.MUTED,14)
	var samples := UIKit.grid(2 if host.portrait_mode() else 4,5)
	samples.name = "ManagementChoices"
	samples.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	card.add_child(samples)
	for choice in lot.get("sampleOptions",[]):
		var index: int=int(choice.get("index",0))
		var key:=UIKit.button("第%d件" % (index+1),"secondary",Vector2(0,70),14,"warehouse")
		key.icon = UIKit.item_icon(String(lot.items[index].defId))
		key.add_theme_constant_override("icon_max_width",42)
		key.size_flags_horizontal=Control.SIZE_EXPAND_FILL
		key.text_overrun_behavior=TextServer.OVERRUN_TRIM_ELLIPSIS
		key.tooltip_text=String(choice.get("label",""))
		key.disabled=String(choice.get("problem","")).length()>0
		key.pressed.connect(func(): Game.dispatch({"type":"SAMPLE_BULK_CRATE","index":index}))
		samples.add_child(key)
	if String(lot.get("sampleProblem",""))!="": _text(card,String(lot.sampleProblem),UIKit.MUTED,13)
	var buy := UIKit.button("购入整箱 · "+UIKit.money(lot.get("price",0)),"primary",Vector2(0,36),15)
	buy.disabled = String(lot.get("buyProblem","")).length()>0
	buy.pressed.connect(func():
		host.confirm("确认整箱收购","将支付 %s 并消耗1 AP，四件原物按现状一起入库；未抽查部分的内部情况仍未知。" % UIKit.money(lot.price),"确认购入",func(): Game.dispatch({"type":"BUY_BULK_CRATE","id":lot.id})))
	card.add_child(buy)
	if buy.disabled: _text(card,String(lot.get("buyProblem","")),UIKit.MUTED,13)

func _customers() -> void:
	var journal = load("res://scripts/model/shop_journal.gd")
	var memories: Dictionary = Game.state.get("shopJournal",{}).get("customers",{})
	if memories.is_empty(): _text(body,"接待与实际成交后，会在这里留下熟客记录。")
	for id in memories:
		var memory: Dictionary = journal.customer(Game.state,String(id))
		var person: Dictionary = GameData.npc(String(id))
		var card := _card(String(person.get("name","来客")))
		_text(card,"来访 %d 次 · 成交 %d 次 · 维修 %d 次 · 信任 %+d · 介绍 %d 人" % [int(memory.get("visits",0)),int(memory.get("deals",0)),int(memory.get("repairs",0)),int(memory.get("trust",0)),int(memory.get("referrals",0))])
		_text(card,String(memory.get("lastNote","")),UIKit.MUTED,14)
		var greeting: String = journal.greeting(Game.state,String(id))
		if greeting!="": _text(card,greeting,UIKit.CYAN,14)
	_text(body,"熟客会记住实际成交和维修；信任影响下一次议价，也可能带来回头客或介绍。",UIKit.MUTED,13)

func _history() -> void:
	var row := UIKit.hbox(4)
	body.add_child(row)
	for spec in [["receipts","成交回执"],["items","物品履历"],["collection","收藏进度"]]:
		var key: String=spec[0]
		var tab := UIKit.button(spec[1],"primary" if history_mode==key else "secondary",Vector2(0,32),14)
		tab.size_flags_horizontal=Control.SIZE_EXPAND_FILL
		tab.pressed.connect(func(): history_mode=key;_render())
		row.add_child(tab)
	var journal = load("res://scripts/model/shop_journal.gd")
	if history_mode=="receipts":
		var receipts: Array = journal.receipts(Game.state).duplicate()
		receipts.reverse()
		if receipts.is_empty(): _text(body,"成交或完成委修后，这里会保留费用与资金变化回执。")
		for receipt in receipts.slice(0,20): _receipt(receipt)
	elif history_mode=="collection":
		for definition in GameData.item_list:
			var progress: Dictionary = journal.collection(Game.state,String(definition.id))
			if not progress.get("handled",false): continue
			var card := _card(String(definition.name))
			_text(card,"已经手 · %s · %s" % ["已鉴定" if progress.get("inspected",false) else "待鉴定","已修复" if progress.get("repaired",false) else "待修复"],UIKit.CYAN,14)
		_text(body,"只记录你实际经手、鉴定与修复过的原物，不会揭示未知真伪。",UIKit.MUTED,13)
	else:
		var originals: Dictionary = Game.state.get("shopJournal",{}).get("originals",{})
		if originals.is_empty(): _text(body,"暂时没有实物履历。")
		for uid in originals:
			var original: Dictionary=originals[uid]
			var open := UIKit.button(String(original.get("name","实物"))+" · "+String(uid),"primary" if journal_uid==uid else "secondary",Vector2(0,32),14)
			var selected: String=uid
			open.pressed.connect(func(): journal_uid="" if journal_uid==selected else selected;_render())
			body.add_child(open)
			if journal_uid==uid:
				for entry in journal.timeline(Game.state,uid): _text(body,"第%d天 · %s" % [int(entry.get("day",0)),String(entry.get("text",""))],UIKit.MUTED,14)

func _receipt(receipt: Dictionary) -> void:
	var day := int(receipt.get("day",0))
	var card := _card("第%d天 · 成交回执" % day)
	var rows: Array = receipt.get("items",receipt.get("entries",[]))
	for item in rows:
		_text(card,String(item.get("name","原物"))+" · "+UIKit.money(item.get("price",0)),UIKit.CYAN)
		if item.get("direction","")=="acquisition":
			_text(card,"本次为购入，购入价计入原物成本；尚未形成售货利润。",UIKit.MUTED,13)
		else:
			_text(card,"购入成本 %s · 已记录材料 %s · 已记录用电 %s" % ["未完整记录" if item.get("acquisitionCost")==null else UIKit.money(item.acquisitionCost),UIKit.money(item.get("materialCost",0)),UIKit.money(item.get("electricityCost",0))],UIKit.MUTED,14)
			if item.get("recordedMargin")!=null: _text(card,"已记录费用后的毛收益 "+UIKit.money(item.recordedMargin),UIKit.AMBER)
		if String(item.get("note",""))!="": _text(card,String(item.note),UIKit.MUTED,13)
	_text(card,"现金变化 %s" % UIKit.money(receipt.get("cashImpact",0)),UIKit.AMBER)
	if String(receipt.get("note",""))!="": _text(card,String(receipt.note),UIKit.MUTED,13)

func _upgrades() -> void:
	var upgrades = load("res://scripts/model/shop_upgrades.gd")
	var storage:=UIKit.button("仓储扩建 · 五档仓库与展示位","primary",Vector2(0,40),16)
	storage.pressed.connect(func():host.open_warehouse_expansion())
	body.add_child(storage)
	_text(body,"仓储可独立升级五档。维修工坊与精品展区仍只能选择一项永久专精，工作灯和陈列架升级独立安排。",UIKit.MUTED,14)
	var choices := _choices()
	for option in upgrades.options(Game.state):
		var id: String=option.id
		var card := _card(String(option.name),choices)
		_object_icon(card,UIKit.icon("repair" if id == "workshop" else "warehouse"))
		_text(card,String(option.get("effect","")),UIKit.CYAN)
		_text(card,"费用 "+UIKit.money(option.cost))
		var buy := UIKit.button("确认选择这项扩建","primary",Vector2(0,36),15)
		buy.disabled = not bool(option.get("availability",false))
		buy.pressed.connect(func(): host.confirm("确认永久扩建","本轮经营只能选一项扩建。支付 %s 安排「%s」后，本轮不能改选。" % [UIKit.money(option.cost),String(option.name)],"确认扩建",func(): Game.dispatch({"type":"BUY_SHOP_EXTENSION","id":id})))
		card.add_child(buy)
		if buy.disabled: _text(card,String(option.get("problem","当前不可购买")),UIKit.MUTED,13)

func _choices() -> GridContainer:
	var choices := UIKit.grid(1 if host.portrait_mode() else 2,8)
	choices.name = "ManagementChoices"
	choices.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	body.add_child(choices)
	return choices

func _object_icon(parent: Node, texture: Texture2D) -> void:
	var icon := TextureRect.new()
	icon.texture = texture
	icon.custom_minimum_size = Vector2(0,48)
	icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	parent.add_child(icon)
	parent.move_child(icon,0)
