extends SceneTree
func _initialize() -> void: call_deferred("run")
func run() -> void:
 var bench_script = load("res://scripts/ui/watch_bench_art.gd")
 var bench = bench_script.new()
 root.add_child(bench)
 var a = bench.panel_style(Color.RED,Color.BLUE,4)
 var b = bench.panel_style(Color.RED,Color.BLUE,4)
 if not is_same(a,b): push_error("identical panel styles must share resource");quit(1);return
 if is_same(a,bench.panel_style(Color.GREEN,Color.BLUE,4)): push_error("different styles must stay independent");quit(1);return
 var kit = load("res://scripts/app/ui_kit.gd")
 var front = kit.lit_atlas("watches-front").normal_texture
 var back = kit.lit_atlas("watches-back").normal_texture
 if not is_same(front,back) or front.get_size() != Vector2(1,1): push_error("watch faces must share a flat one-pixel normal");quit(1);return
 var customer_script = load("res://scripts/customer.gd")
 var first = customer_script.new()
 var second = customer_script.new()
 root.add_child(first);root.add_child(second)
 first.setup("CHR-001");second.setup("CHR-001")
 if not is_same(first.current.mesh,second.current.mesh): push_error("residents must share immutable meshes");quit(1);return
 if is_same(first.mat,second.mat): push_error("resident animation materials must remain independent");quit(1);return
 first.free();second.free()
 var game = root.get_node("Game")
 game.new_game("OPTIMIZED-FLIP")
 var item = Model.new_item(game.state,"WCH-001",{"authentic":false,"watch":{"logo_variant":1}})
 game.state.inventory.append(item)
 var sprite = load("res://scripts/world/item_sprite.gd").new()
 root.add_child(sprite);sprite.setup(item.defId,item.uid,300)
 var height: float = sprite.tex_size().y*sprite.display_scale
 sprite.back=true;sprite._apply_face()
 if not is_equal_approx(sprite.tex_size().y*sprite.display_scale,height): push_error("face changes must preserve physical display size");quit(1);return
 var center: Vector2 = sprite.reveal.get_global_transform()*(sprite.reveal.size*0.5)
 if sprite.reveal_center().distance_to(center)>0.001: push_error("UV text center must apply scale exactly once");quit(1);return
 game.prefs.reduced_motion=false
 sprite.back=false;sprite._apply_face()
 sprite.flip()
 await create_timer(0.8).timeout
 if not is_equal_approx(sprite.tex_size().y*sprite.body.scale.y,height): push_error("animated flip must preserve height after landing");quit(1);return
 var wall = load("res://scripts/ui/wall_status.gd").new()
 root.add_child(wall)
 var expected: Image = kit.tex("res://assets/scene/shop_pixel.png").get_image().get_region(Rect2i(412,12,56,28))
 expected.resize(224,112,Image.INTERPOLATE_NEAREST)
 if wall.get_child(0).texture.get_image().get_data()!=expected.get_data(): push_error("wall bezel must retain canonical border pixels");quit(1);return
 var held: Texture2D
 for definition in GameData.item_list:
  var lot = Model.new_item(game.state,definition.id)
  var texture = kit.physical_texture(lot).diffuse_texture
  if held == null: held=texture
 var count := 0
 for key in kit._cache:
  if String(key).begins_with("physical:"): count+=1
 if count>64: push_error("composite cache must retain at most 64 textures");quit(1);return
 if held.get_image().is_empty(): push_error("cache eviction cannot invalidate live textures");quit(1);return
 wall.free()
 sprite.free()
 bench.free()
 print("PASS animation resource reuse")
 quit()
