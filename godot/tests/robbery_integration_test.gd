extends "res://tests/warranty_cases_test.gd"
func run() -> void:
 rules=load("res://scripts/model/warranty_cases.gd")
 var game=root.get_node("Game")
 game.state=receipt()
 var s:Dictionary=game.state
 s.day=4;s.phase="report";s.cash=1
 var robbery=load("res://scripts/model/robbery.gd")
 robbery.ensure(s)
 s.robbery.entries=[{"id":"ROBBERY-2","day":2,"count":1,"culprit":"saved","onsite":false,"arrestChecked":true,"revenge":{"day":5,"percent":8,"done":false}}]
 # A payable asset remains, making the attack fee larger than the cash balance.
 s.inventory.append(Model.new_item(s,"WCH-015"))
 var jobs=load("res://scripts/model/service_contracts.gd")
 jobs.ensure(s)
 var job:Dictionary=s.serviceContracts.entries[0]
 job.status="declined";job.dueDay=5
 var job_id:String=job.id
 check(s.warrantyCases.entries[0].availableDay==3,"warranty final offer day coincides with forced closure")
 game.ensure_shop_state(s)
 game.dispatch({"type":"NEXT"})
 check(game.state.day==5 and game.state.phase=="report" and game.state.report.closed,"live dispatch enters closed day")
 check(game.state.cash<0,"live dispatch retains repair debt")
 check(jobs._find(game.state,job_id).dueDay==6,"declined renegotiable service deadline extended")
 var balance:float=game.state.cash
 game.dispatch({"type":"ARRIVE"})
 check(game.state.trade==null and game.state.cash==balance,"closed shop cannot admit visitors")
 game.dispatch({"type":"NEXT"})
 check(game.state.day==6 and game.state.phase=="open","live dispatch resumes business despite debt")
 check(jobs._find(game.state,job_id).status=="declined","renegotiation survives the closed day")
 check(game.state.warrantyCases.entries[0].status=="available","unaccepted warranty window survives closure")
 var fee_count:=0
 for row in game.state.ledger:
  if row.kind=="repair-expense":fee_count+=1
 check(fee_count==1,"live observers do not duplicate repair expense")
 print("ROBBERY INTEGRATION failures=",failures);quit(1 if failures else 0)
