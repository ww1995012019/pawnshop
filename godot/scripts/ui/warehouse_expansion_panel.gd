extends VBoxContainer
var host
var close_panel:Callable
var level:=0
var selected_uids:Array=[]
var selectors:Array=[]
var apply_button:Button
var message:Label

func setup(shell,close: Callable) -> void:
 host=shell;close_panel=close
 size_flags_horizontal=Control.SIZE_EXPAND_FILL
 add_theme_constant_override("separation",8)
 level=int(Game.state.storageExpansion.level)+1
 if level>5:
  add_child(UIKit.label("仓储已满级 · %d × %d · 展示位 %d"%[WarehouseExpansion.columns(Game.state),WarehouseExpansion.rows(Game.state),WarehouseExpansion.capacity(Game.state,"display")],20,UIKit.AMBER,false,true))
  apply_button=UIKit.button("已达到最高档","secondary",Vector2(0,40),18);apply_button.disabled=true;add_child(apply_button);return
 var next:=WarehouseExpansion.default_state(level)
 add_child(UIKit.label("第 %d / 5 档 · 后仓 %d × %d → %d × %d"%[level,WarehouseExpansion.columns(Game.state),WarehouseExpansion.rows(Game.state),next.columns,next.rows],22,UIKit.AMBER,false,true))
 add_child(UIKit.label("展示位 %d → %d · 材料种类 %d → %d · 隔离位 %d → %d"%[WarehouseExpansion.capacity(Game.state,"display"),next.displayCapacity,WarehouseExpansion.capacity(Game.state,"materials"),next.materialCapacity,WarehouseExpansion.capacity(Game.state,"isolation"),next.isolationCapacity],16,UIKit.CYAN,false,true))
 add_child(UIKit.label("现金 %s / %d Cr · 累计委托 %d / %d 单"%[Model.jnum(Game.state.cash),WarehouseExpansion.FEES[level-1],WarehouseExpansion.completed_count(Game.state),WarehouseExpansion.ORDERS[level-1]],18,UIKit.TEXT,false,true))
 add_child(UIKit.label("扩仓将消耗所选原表和本档现金；仅接受未伪造的自有原物。价值按当前实际价值判定。",16,UIKit.DANGER,false,true))
 var rules:=WarehouseExpansion.requirements(level)
 for index in rules.size():
  var rule:Dictionary=rules[index]
  var title: String="星冕品牌或珍稀档原表" if rule.get("star",false) else "%s%s · 价值 ≥%d Cr"%[{"mid":"中等","luxury":"名贵"}.get(rule.tier,rule.tier),"及以上" if rule.higher else "",rule.value]
  add_child(UIKit.label("交付 %d：%s"%[index+1,title],17,UIKit.TEXT,false,true))
  var picker:=UIKit.option_button()
  picker.name="expansion_watch_%d"%index;picker.size_flags_horizontal=Control.SIZE_EXPAND_FILL
  picker.add_item("请选择将被消耗的原表");picker.set_item_metadata(0,"")
  for it in WarehouseExpansion.candidates(Game.state,rule):
   picker.add_item("%s · %s · %s Cr"%[GameData.def(it.defId).name,it.uid,Model.jnum(Model.item_value(it))])
   picker.set_item_metadata(picker.item_count-1,it.uid)
  var slot:int=index
  picker.item_selected.connect(func(option):set_selection(slot,String(picker.get_item_metadata(option))))
  selectors.append(picker);selected_uids.append("");add_child(picker)
 message=UIKit.label("",16,UIKit.MUTED,false,true);add_child(message)
 apply_button=UIKit.button("交付手表并扩仓","primary",Vector2(0,44),18)
 apply_button.name="confirm_expansion";apply_button.pressed.connect(_confirm);add_child(apply_button)
 _sync()

func set_selection(slot: int,uid: String) -> void:
 selected_uids[slot]=uid
 var picker:OptionButton=selectors[slot]
 for i in picker.item_count:
  if picker.get_item_metadata(i)==uid:picker.select(i);break
 _sync()

func _sync() -> void:
 var reason:=WarehouseExpansion.problem(Game.state,level,selected_uids)
 message.text=reason if reason!="" else "条件已满足。确认后所选原表会被交付消耗。"
 apply_button.disabled=reason!=""

func _confirm() -> void:
 _sync()
 if apply_button.disabled:return
 var ids:=selected_uids.duplicate()
 var labels:Array[String]=[]
 for uid in ids:
  var it=Game.item(uid)
  if it!=null:labels.append(GameData.def(it.defId).name+" · "+String(uid))
 host.confirm("交付原表并扩仓","将消耗以下原表：\n%s\n\n另支付 %d Cr，扩至 10 × %d。"%["\n".join(labels),WarehouseExpansion.FEES[level-1],WarehouseExpansion.ROWS[level]],"确认交付并扩仓",func():
  Game.dispatch({"type":"EXPAND_WAREHOUSE","level":level,"uids":ids})
  if int(Game.state.storageExpansion.level)==level:close_panel.call()
  else:_sync())
