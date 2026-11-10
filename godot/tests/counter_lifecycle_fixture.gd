extends SceneTree
static func build() -> Dictionary:
 var s=Model.create("COUNTER-LIFECYCLE")
 s.day=2;s.ap=10;s.cash=2000
 s.trade=WantedCases.new_officer_trade(s)
 s=WantedCases.reduce(s,{"type":"ISSUE_WANTED","tradeId":s.trade.id})
 var target:=""
 for id in s.police.wanted:
  if WantedCases.profile(id).npcId!="": target=WantedCases.profile(id).npcId;break
 s.trade={"id":"lifecycle-visit","npcId":target,"kind":"buy","item":Model.new_item(s,"WCH-002",{"owner":"npc","sourceVerified":true}),"price":80,"rounds":0,"locked":false,"evidenceUsed":[],"line":"我带了旧货，想和你谈谈。"}
 TradeSession.ensure(s)
 var se=TradeSession.session(s)
 se.goods.append(Model.new_item(s,"WCH-005",{"owner":"npc","sourceVerified":true}))
 s=CounterDialogue.begin(s)
 var false_report=s.duplicate(true)
 false_report.trade.npcId="CHR-004";false_report.trade.id="lifecycle-false";false_report.police.falseReports=2
 false_report.npcTrade["CHR-004"]=s.npcTrade[s.trade.npcId].duplicate(true)
 for row in TradeSession.session(false_report).lines: row.context.npcId="CHR-004"
 var capacity=s.duplicate(true)
 capacity.trade.id="lifecycle-capacity"
 capacity.police.paper.visible=false
 TradeSession.session(capacity).want_count=0
 var original=capacity.inventory.filter(func(it):return TradeSession._stock_problem(capacity,it,"sell")=="")[0]
 capacity=CounterDialogue.reduce(capacity,{"type":"SELECT_TRADE","uid":original.uid})
 var pending=s.duplicate(true)
 pending.police.paper.visible=false
 pending=CounterDialogue.reduce(pending,CounterDialogue.action_for(pending,"ACCEPT"))
 TradeSession.session(pending).want_count=0
 pending=CounterDialogue.reduce(pending,{"type":"SELECT_TRADE","uid":original.uid})
 var forged=Model.create("COUNTER-FORGERY")
 forged.inventory=[];forged.ap=10
 var fake=Model.new_item(forged,"WCH-023",{"condition":0.8,"working":true,"authentic":true,"sourceVerified":true})
 Model.put_in(forged,fake)
 var commerce=load("res://scripts/model/commerce.gd")
 forged=commerce.reduce(forged,{"type":"FORGE_TARGET","uid":fake.uid,"target":"WCH-033"})
 WatchForgery.apply(Model.find_inventory(forged,fake.uid),"logo")
 forged.trade={"id":"lifecycle-forgery","npcId":"CHR-004","kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[],"line":"拿来看看。"}
 forged=CounterDialogue.begin(forged)
 var expert=GameData.npc("CHR-004")
 var expertise=expert.expertise.watch.duplicate(true)
 expert.expertise.watch={"logo":100,"serial":100,"structure":100,"market":100}
 forged=CounterDialogue.reduce(forged,{"type":"SELECT_TRADE","uid":fake.uid})
 expert.expertise.watch=expertise
 return {"arrest":s,"false_report":false_report,"capacity":capacity,"pending":pending,"forgery":forged}
func _initialize() -> void:
 var f=FileAccess.open("res://../work/watch-expansion/counter-lifecycle-fixture.json",FileAccess.WRITE)
 f.store_string(JSON.stringify(build()));f.close();quit()
