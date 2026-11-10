extends SceneTree
func _initialize() -> void:
 var fixtures := {}
 for id in ["WCH-020","WCH-003","WCH-028","WCH-074"]:
  var state := Model.create("OPTICAL-PAPER")
  state.inventory = []
  state.trade = WantedCases.new_officer_trade(state)
  state = WantedCases.reduce(state,{"type":"ISSUE_WANTED","tradeId":state.trade.id})
  state.trade = null
  state.police.paper.visible = true
  state.police.paper.scale = .45
  state.police.paper.position = [.02,.18]
  state.ap = 100
  Model.put_in(state,Model.new_item(state,id,{"authentic":true,"condition":1.0,"working":true,"sourceVerified":true}))
  fixtures[id] = state
 var file := FileAccess.open("res://../work/watch-expansion/optical/fixtures.json",FileAccess.WRITE)
 file.store_string(JSON.stringify(fixtures));file.close()
 quit()
