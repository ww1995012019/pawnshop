extends VBoxContainer
var quantity:SpinBox
var buy:Button
var request_id: String
func setup() -> void:
 name="PawnSlotPurchase"
 add_theme_constant_override("separation",5)
 request_id="%s-%d-%d"%[Game.state.seed,Time.get_ticks_usec(),randi()]
 add_child(UIKit.label("永久抵押仓位 · 当前 %d 位 · 每位 5 Cr"%WarehouseExpansion.capacity(Game.state,"pawn"),15,UIKit.TEXT,false,true))
 var row:=UIKit.hbox(6);add_child(row)
 quantity=SpinBox.new();quantity.name="pawn_slot_quantity";quantity.min_value=1;quantity.max_value=100;quantity.step=1;quantity.value=1
 quantity.custom_minimum_size=Vector2(70,36);row.add_child(quantity)
 buy=UIKit.button("","primary",Vector2(0,36),15);buy.name="buy_pawn_slots";buy.size_flags_horizontal=Control.SIZE_EXPAND_FILL
 buy.pressed.connect(func():Game.dispatch({"type":"BUY_PAWN_SLOTS","quantity":int(quantity.value),"requestId":request_id}))
 quantity.value_changed.connect(func(_value):_sync())
 row.add_child(buy);_sync()
func _sync() -> void:
 buy.text="购买 · %d Cr"%(int(quantity.value)*5)
 buy.disabled=Game.state.phase!="open" or Game.state.has("outcome") or Game.state.cash<int(quantity.value)*5
