extends SceneTree
var failures:=0
func _initialize() -> void:call_deferred("run")
func check(ok:bool,message:String)->void:
	if not ok:push_error(message);failures+=1
func run()->void:
	var kit=load("res://scripts/app/ui_kit.gd")
	GameData.ensure()
	check(GameData.people().size()==33,"33 total residents after 20 new arrivals")
	var cells:={}
	var signatures:={}
	for npc in GameData.new_residents:
		var cell:Dictionary=kit.npc_cell(npc.id)
		var key:=String(cell.key)+str(cell.region)
		check(not cells.has(key),"new residents need unique cells")
		cells[key]=true
		var portrait:AtlasTexture=kit.npc_portrait(npc.id)
		var image:=portrait.atlas.get_image().get_region(Rect2i(portrait.region))
		check(image.get_used_rect().size.y>180,"complete visible resident bust")
		var signature:=image.get_data().hex_encode().sha256_text()
		check(not signatures.has(signature),"new residents use different original faces")
		signatures[signature]=true
		check(kit.lit_atlas(cell.key).normal_texture!=null,"resident has a normal map")
	var mugshots:={}
	for profile in WantedCases.profiles():
		var photo:AtlasTexture=kit.wanted_portrait(profile)
		check(photo!=null and photo.atlas!=null,"wanted photograph is present")
		var used:=photo.atlas.get_image().get_region(Rect2i(photo.region)).get_used_rect()
		check(used.size.x>70 and used.size.y>70,"wanted photograph has a visible recognizable face")
		var key:=str(photo.atlas.resource_path)+str(photo.region)
		check(not mugshots.has(key),"fifty profiles cannot reuse photograph cells")
		mugshots[key]=true
		if profile.npcId!="":
			check(photo==kit.npc_icon(profile.npcId),"wanted face exactly matches visiting character")
	check(mugshots.size()==50,"50 independent wanted photographs")
	print("WANTED ART: residents=",cells.size()," wanted=",mugshots.size()," failures=",failures)
	for player in root.find_children("*","AudioStreamPlayer",true,false):player.stop();player.stream=null
	await process_frame
	quit(1 if failures else 0)
