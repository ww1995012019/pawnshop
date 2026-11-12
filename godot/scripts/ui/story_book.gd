extends VBoxContainer
## One scrollable case list. Actions remain the authoritative model descriptors.
var host
var dismiss: Callable
var selected := "active"
var filters := {}
var body: VBoxContainer
var status: Label
var Stories = preload("res://scripts/model/shop_stories.gd")
func setup(shell: Node, close: Callable, initial := "active") -> void:
	host=shell
	dismiss=close
	selected=initial
	size_flags_horizontal=Control.SIZE_EXPAND_FILL
	add_theme_constant_override("separation",6)
	var nav:=UIKit.grid(3,4)
	add_child(nav)
	for spec in [["active","进行中"],["upcoming","预告"],["archive","已结束"]]:
		var group: String=spec[0]
		var key:=UIKit.button(spec[1],"secondary",Vector2(0,32),14)
		key.name="story_filter_"+group
		key.size_flags_horizontal=Control.SIZE_EXPAND_FILL
		key.pressed.connect(func():selected=group;render())
		nav.add_child(key)
		filters[group]=key
	status=UIKit.label("",13,UIKit.AMBER,false,true)
	status.visible=false
	add_child(status)
	body=UIKit.vbox(7)
	body.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	add_child(body)
	Game.changed.connect(_changed)
	render()
func _changed(_prev: Dictionary,next: Dictionary,_action: Dictionary) -> void:
	status.text=next.get("notice","")
	status.visible=status.text!=""
	render()
func text(parent:Node,copy:String,color:=UIKit.TEXT,size:=14) -> void:
	var label:=UIKit.label(copy,size,color,false,true)
	label.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	parent.add_child(label)
func render() -> void:
	UIKit.clear(body)
	for group in filters: UIKit.compact(filters[group],"primary" if selected==group else "secondary")
	text(body,"预告不会扣费；接下的原物会跨天保管。可拒绝事件，过期后的顾客原物仍须安全归还。",UIKit.MUTED,13)
	var shown:=0
	for event in Stories.view(Game.state):
		if Stories.group(Game.state,event)!=selected:continue
		if shown>=16 and selected=="archive":break
		shown+=1
		card(event)
	if shown==0:
		if selected=="upcoming" and int(Game.state.day)<int(Game.state.ownershipClaims.startDay)+2:
			text(body,"初次安排：第%d天开放失物寻主，第%d天开放旧货拍卖；各提前一天公布预告。" % [int(Game.state.ownershipClaims.startDay)+2,int(Game.state.auctionNights.startDay)+4],UIKit.CYAN)
		text(body,{"active":"目前没有待处理事件。新的寻主与拍卖会先出现在预告中；实际完成委修后可能收到返修回访。","upcoming":"暂时没有新的事件预告。同类寻主与拍卖间隔至少12天，返修只关联实际交付的原物。","archive":"事件结束后，会在这里保留处理结果。"}.get(selected,"暂无事件。"),UIKit.MUTED)
func card(event:Dictionary) -> void:
	var plate:=UIKit.plate(UIKit.inset_style(7))
	plate.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	body.add_child(plate)
	var content:=UIKit.vbox(5)
	plate.add_child(content)
	text(content,String(event.get("title","跨天事件")),UIKit.AMBER,16)
	text(content,"%s · 第%d天开放 / 第%d天截止" % [String(event.get("statusText","")),int(event.get("availableDay",0)),int(event.get("dueDay",0))],UIKit.CYAN,13)
	text(content,String(event.get("description","")))
	if Stories.resolution_text(event)!="":text(content,"处理方式："+Stories.resolution_text(event),UIKit.AMBER)
	for clue in event.get("clues",[]):text(content,String(clue),UIKit.MUTED,13)
	for claimant in event.get("claimants",[]):text(content,String(claimant.get("name","认领人"))+"："+String(claimant.get("statement","")),UIKit.CYAN,13)
	if event.get("type","")=="auction":
		text(content,"当前价 %s · 预算 %s · 押金 %s · 第%d轮" % [UIKit.money(event.get("price",0)),UIKit.money(event.get("budget",0)),UIKit.money(event.get("deposit",0)),int(event.get("round",0))],UIKit.AMBER,13)
	for destination in event.get("navigation",[]):
		var target:Dictionary=destination
		var key:=UIKit.button(String(target.get("label","查看原物")),"secondary",Vector2(0,32),14)
		key.pressed.connect(func():dismiss.call();host.call_deferred("_plan_navigate",String(target.get("page","inspect")),String(target.get("uid",event.get("uid","")))))
		content.add_child(key)
	var input: Dictionary=event.get("input",{})
	if not input.is_empty():
		input=input.duplicate(true)
		for choice in event.get("actions",[]):
			if choice.get("action",{}).get("type","")==input.get("action",{}).get("type",""):input.problem=choice.get("problem","")
		budget_input(content,input)
	for choice in event.get("actions",[]):
		var action: Dictionary=choice.get("action",{})
		if action.is_empty() or (not input.is_empty() and action.get("type","")==input.get("action",{}).get("type","")):continue
		var key:=UIKit.button(String(choice.get("label","处理")),"secondary",Vector2(0,32),14)
		key.size_flags_horizontal=Control.SIZE_EXPAND_FILL
		key.name="story_action_"+String(action.get("type",""))
		var problem:String=choice.get("problem","")
		key.disabled=problem!=""
		key.pressed.connect(func():Game.dispatch(action))
		content.add_child(key)
		if problem!="":text(content,problem,UIKit.MUTED,12)
func budget_input(parent:Node,config:Dictionary) -> void:
	text(parent,String(config.get("label","最高预算")),UIKit.AMBER,13)
	var row:=UIKit.hbox(5)
	parent.add_child(row)
	var amount:=SpinBox.new()
	amount.min_value=float(config.get("min",1))
	amount.max_value=maxf(amount.min_value,float(config.get("max",99999)))
	amount.value=float(config.get("value",amount.min_value))
	amount.suffix=" Cr"
	amount.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	amount.get_line_edit().virtual_keyboard_type=LineEdit.KEYBOARD_TYPE_NUMBER
	amount.get_line_edit().add_theme_font_size_override("font_size",14)
	row.add_child(amount)
	var send:=UIKit.button("确认预算并入场","primary",Vector2(0,34),14)
	send.name="story_budget_submit"
	send.custom_minimum_size.x=140
	send.disabled=String(config.get("problem","")).length()>0
	var action: Dictionary=config.get("action",{}).duplicate(true)
	send.pressed.connect(func():amount.apply();var a=action.duplicate(true);a.price=int(amount.value);Game.dispatch(a))
	row.add_child(send)
	if send.disabled:text(parent,String(config.get("problem","")),UIKit.MUTED,12)
