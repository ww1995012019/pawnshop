extends RefCounted
static func fence() -> Dictionary:
 var r=load("res://scripts/model/robbery.gd")
 var s:=Model.create("ROBBERY-UI")
 s.day=5;s.phase="open";s.inventory=[];s.cash=100
 NightCrime.ensure(s)
 load("res://scripts/model/wanted_cases.gd").ensure(s)
 r.ensure(s)
 var target:String=NightCrime.thieves(s)[0]
 var item:=Model.new_item(s,"WCH-015",{"owner":"npc","evidence":[],"stolen":true,"sourceVerified":false,"crimeCaseId":"ROBBERY-3"})
 s.nightCrime.cases.append({"id":"ROBBERY-3","kind":"robbery","origin":"shop","lossDay":3,"culprit":target,"revealed":true,"arrested":false,"items":[{"uid":item.uid,"item":item.duplicate(true),"holder":"trade","paid":false,"payout":0,"handled":false,"resolved":false,"recovery":"","originalLawful":true}]})
 s.robbery.entries.append({"id":"ROBBERY-3","day":3,"culprit":target,"count":1,"onsite":false,"arrestChecked":false})
 s.trade={"id":"robbery-fence","kind":"buy","npcId":load("res://scripts/model/wanted_cases.gd").profile(target).npcId,"item":item,"price":50,"rounds":0,"locked":false,"evidenceUsed":[],"crimeCaseId":"ROBBERY-3","line":"这只旧表便宜出给你。"}
 return CounterDialogue.begin(s)
