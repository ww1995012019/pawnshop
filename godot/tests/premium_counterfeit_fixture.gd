extends SceneTree
func _initialize():
 var s=Model.create("PREMIUM-BROWSER")
 s.inventory.clear()
 s.ap=10
 for material in GameData.materials: s.materials[material.id]=20
 var it=Model.new_item(s,"WCH-023",{"condition":0.8,"working":true,"authentic":true,"watch":{"mass":100.0,"serial":"CC D02 2401 000123","logo_variant":0,"missing_part":"","part_mass":0.0}})
 Model.put_in(s,it)
 var file=FileAccess.open("res://../work/premium-counterfeit/fixture.json",FileAccess.WRITE)
 file.store_string(JSON.stringify(s));file.close();quit()
