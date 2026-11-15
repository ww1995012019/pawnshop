extends SceneTree
var failures := 0
func _initialize(): call_deferred("run")
func check(ok: bool, text: String):
 print("LAYOUT ","PASS " if ok else "FAIL ",text)
 if not ok: failures+=1
func run():
 var s=Model.create("SHOWROOM-LAYOUT")
 s.inventory=[]
 for i in 3:
  var it=Model.new_item(s,"WCH-007",{"condition":1.0,"working":true,"evidence":["TOL-001","TOL-002"]})
  it.sourceVerified=true
  Model.put_in(s,it)
 var uid: String=s.inventory[0].uid
 var other: String=s.inventory[1].uid
 var next=Model.reduce(s,{"type":"SHOWROOM_PLACE","uid":uid,"location":"display","slot":4})
 check(Model.find_inventory(next,uid).location=="display","placing on shelf uses real display transition")
 check(next.get("showroomLayout",{}).get("display",{}).get(uid,-1)==4,"selected shelf slot is canonical")
 if next.has("showroomLayout"):
  next=Model.reduce(next,{"type":"SHOWROOM_PLACE","uid":other,"location":"display","slot":4})
  check(next.showroomLayout.display[other]==4 and next.showroomLayout.display[uid]!=4,"occupied shelf swaps without duplicate slot")
  var stable=next.showroomLayout.display[uid]
  next.inventory=next.inventory.filter(func(it):return it.uid!=other)
  var game=root.get_node("Game")
  game.ensure_shop_state(next)
  check(next.showroomLayout.display[uid]==stable and not next.showroomLayout.display.has(other),"sold original leaves empty slot without compacting remaining goods")
  game.state=next;game.save()
  var saved=JSON.parse_string(FileAccess.get_file_as_string(game.SAVE_PATH))
  check(saved.showroomLayout.display[uid]==stable,"layout persists")
 var before=JSON.stringify(s)
 var invalid=Model.reduce(s,{"type":"SHOWROOM_PLACE","uid":uid,"location":"display","slot":999})
 check(JSON.stringify(invalid)==before,"out of range placement cannot move original")
 s.inventory[0].sealed=true
 invalid=Model.reduce(s,{"type":"SHOWROOM_PLACE","uid":uid,"location":"display","slot":0})
 check(Model.find_inventory(invalid,uid).location=="warehouse","sealed original cannot be dragged onto shelf")
 print("LAYOUT failures=",failures)
 quit(1 if failures else 0)
