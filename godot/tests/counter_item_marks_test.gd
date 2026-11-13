extends SceneTree
var failures:=0
func _initialize():call_deferred("run")
func frames():
 for i in 8:await process_frame
func check(ok:bool,label:String):
 print("ITEM MARKS ","PASS " if ok else "FAIL ",label)
 if not ok:failures+=1
func watch_bounds(sprite)->Rect2:
 return sprite.body.global_transform*Rect2(-sprite.tex_size()*0.5,sprite.tex_size())
func close_to_watch(crest:Control,sprite)->bool:
 var bounds:=watch_bounds(sprite)
 return crest.get_global_rect().get_center().distance_to(Vector2(bounds.end.x,bounds.position.y))<=24
func run():
 var game=root.get_node("Game");game.prefs.sound=false;game.prefs.reduced_motion=true
 var s:=Model.create("CROWN-ANCHOR")
 s.trade={"id":"crown-visit","npcId":"CHR-004","kind":"buy","item":Model.new_item(s,"WCH-013",{"owner":"npc","working":true,"sourceVerified":true}),"price":5032,"rounds":0,"locked":false,"evidenceUsed":[],"line":"看看这两件。"}
 s=CounterDialogue.begin(s)
 var session:=TradeSession.session(s)
 if session.goods.size()>2:session.goods.resize(2)
 while session.goods.size()<2:session.goods.append(Model.new_item(s,"WCH-001",{"owner":"npc","working":true,"sourceVerified":true}))
 s=CounterDialogue.begin(s);game.state=s
 if OS.get_cmdline_user_args().has("--fixture"):
  if preload("res://tests/fixture_output.gd").write_json("res://../work/crown-layout/fixture.json",s)!=OK:
   quit(1);return
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 var table=shell.page.counter_table
 var uid:String=session.goods[0].uid
 var card=table.cards[uid]
 var sprite=table.sprites[uid]
 var crest:Control=card.item_marks.get_node("item_decoration/tier_crest")
 check(close_to_watch(crest,sprite),"crown sits beside the watch upper-right corner in a wide two-item slot")
 check(card.width==178 and sprite.get_meta("hit_size").x==178,"wide selection target remains unchanged")
 var before:=crest.get_global_rect().get_center()
 card.width=70;card.show_item_marks(session.goods[0]);await frames()
 check(before.distance_to(crest.get_global_rect().get_center())<1,"price-card spacing cannot move the crown away from its watch")
 sprite.lift=30;sprite.body.position=Vector2(0,-30);await frames()
 check(close_to_watch(crest,sprite),"crown follows the raised watch rather than staying on the tabletop")
 sprite.body.scale*=1.4;await frames()
 check(close_to_watch(crest,sprite),"crown remains attached when the watch render size changes")
 print("ITEM MARKS failures=",failures)
 shell.queue_free();await frames();quit(1 if failures else 0)
