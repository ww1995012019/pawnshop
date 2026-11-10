extends SceneTree
func _initialize():
 var s=Model.create("MULTI-BROWSER");s.inventory.clear();s.ap=10;s.cash=1000
 for id in ["WCH-001","WCH-003","WCH-004"]: Model.put_in(s,Model.new_item(s,id,{"condition":0.9,"working":true,"authentic":true,"sourceVerified":true}))
 s.trade={"id":"browser-visit","npcId":"CHR-004","kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[],"line":"可以拿几件给我看看，我也带了旧货。"}
 TradeSession.ensure(s)
 var se=TradeSession.session(s);se.cash=5000;se.want_count=6;se.goods=[]
 for id in ["WCH-002","WCH-005"]: se.goods.append(Model.new_item(s,id,{"owner":"npc","condition":0.8,"working":true,"authentic":true,"sourceVerified":true}))
 var f=FileAccess.open("res://../work/multi-item-trade/fixture.json",FileAccess.WRITE)
 f.store_string(JSON.stringify(s));f.close();quit()
