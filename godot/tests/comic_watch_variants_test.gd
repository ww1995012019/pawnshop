extends SceneTree
## Exercises the art actually consumed by catalogue/warehouse/counter controls.
var Art
var Kit
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	if not ok:
		push_error(message)
		failures += 1
func pixels(texture: Texture2D) -> Image:
	var image := texture.get_image()
	if image.is_compressed(): image.decompress()
	image.convert(Image.FORMAT_RGBA8)
	return image
func thumbnail(id: String) -> Image:
	var image := pixels(Kit.item_icon(id))
	var used := image.get_used_rect()
	image = image.get_region(used)
	var factor := minf(36.0 / image.get_width(), 52.0 / image.get_height())
	image.resize(maxi(1,roundi(image.get_width()*factor)),maxi(1,roundi(image.get_height()*factor)),Image.INTERPOLATE_LANCZOS)
	var result := Image.create(48,64,false,Image.FORMAT_RGBA8)
	result.fill(Color("e7d6b5"))
	result.blend_rect(image,Rect2i(Vector2i.ZERO,image.get_size()),(Vector2i(48,64)-image.get_size())/2)
	return result
func run() -> void:
	GameData.ensure()
	Kit=load("res://scripts/app/ui_kit.gd")
	Art=load("res://scripts/ui/comic_assets.gd")
	var signatures := {}
	for definition in GameData.item_list:
		var image := pixels(Kit.item_icon(definition.id))
		var signature := image.get_data().hex_encode().sha256_text()
		check(not signatures.has(signature),"actual comic icon is independently drawn: "+definition.id+" duplicates "+str(signatures.get(signature,"")))
		signatures[signature] = definition.id
	# Shared silhouettes must still differ visibly at their real thumbnail size.
	for family in [["WCH-039","WCH-040","WCH-041","WCH-042","WCH-043"],["WCH-049","WCH-050","WCH-051","WCH-052","WCH-053"],["WCH-054","WCH-055","WCH-056","WCH-057","WCH-058"],["WCH-059","WCH-060","WCH-061","WCH-062","WCH-063"],["WCH-064","WCH-065","WCH-066","WCH-067","WCH-068"],["WCH-069","WCH-070","WCH-071","WCH-072","WCH-073"]]:
		for a in family.size():
			for b in range(a+1,family.size()):
				var first := thumbnail(family[a])
				var second := thumbnail(family[b])
				var changed := 0
				for y in 64:
					for x in 48:
						var p := first.get_pixel(x,y)
						var q := second.get_pixel(x,y)
						if absf(p.r-q.r)+absf(p.g-q.g)+absf(p.b-q.b)>.18: changed += 1
				check(changed>120,"thumbnail has visible palette/structural differences: "+family[a]+" / "+family[b]+" changed="+str(changed))
	var item := {"defId":"WCH-054","watch":{},"forgery":{"targetId":"WCH-056","methods":{"case":{"targetId":"WCH-056","removed":false}}}}
	check(WatchForgery.appearance_id(item)=="WCH-056","case fixture installs a compatible higher-value model")
	check(pixels(Kit.physical_icon(item)).get_data()==pixels(Kit.item_icon("WCH-056")).get_data(),"physical comic appearance follows installed target case")
	for id in ["WCH-001","WCH-004","WCH-007","WCH-014","WCH-059"]:
		check(Art.watch({"defId":id,"watch":{}})==load("res://scripts/ui/reference_atlas.gd").watch_for({"defId":id,"watch":{}}),"approved exemplar remains the exact original texture: "+id)
	var contact := Image.create(48*6,64*13,false,Image.FORMAT_RGBA8)
	for index in GameData.item_list.size():
		contact.blit_rect(thumbnail(GameData.item_list[index].id),Rect2i(0,0,48,64),Vector2i(index%6*48,index/6*64))
	DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path("res://../work/watch-ui-polish"))
	contact.save_png("res://../work/watch-ui-polish/comic-thumbnails.png")
	print("COMIC WATCH VARIANTS failures=",failures)
	quit(1 if failures else 0)
