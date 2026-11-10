extends SceneTree
func _initialize() -> void:
 var s := Model.create("REFURB-BROWSER")
 s.inventory.clear()
 for material in GameData.materials: s.materials[material.id] = 20
 for id in ["WCH-007","WCH-008"]:
  Model.put_in(s,Model.new_item(s,id,{"condition":0.45,"working":false,"authentic":false,"sourceVerified":true}))
 var path := ProjectSettings.globalize_path("res://../work/independent-refurb/fixture.json")
 var file := FileAccess.open(path,FileAccess.WRITE)
 file.store_string(JSON.stringify(s));file.close()
 quit()
