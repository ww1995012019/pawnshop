extends SceneTree
func _initialize():call_deferred("run")
func run():
 var s:=Model.create("ICON-LAYOUT");s.day=3;s.cash=5000;s.inventory=[];s.storageExpansion=WarehouseExpansion.default_state(1)
 for i in 18:
  var it:=Model.new_item(s,["WCH-001","WCH-007","WCH-008","WCH-014"][i%4],{"condition":0.6,"working":false,"sourceVerified":true})
  if i<5:it.location="display";s.inventory.append(it)
  else:Model.put_in(s,it)
 for id in s.materials:s.materials[id]=9
 var destination:=ProjectSettings.globalize_path("res://../work/icon-layout")
 DirAccess.make_dir_recursive_absolute(destination)
 var file:=FileAccess.open(destination+"/base.json",FileAccess.WRITE);file.store_string(JSON.stringify(s));file.close()
 s.trade=load("res://scripts/model/commerce.gd")._new_merchant(s)
 file=FileAccess.open(destination+"/merchant.json",FileAccess.WRITE);file.store_string(JSON.stringify(s));file.close()
 quit()
