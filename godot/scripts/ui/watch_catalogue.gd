extends RefCounted
## All standard watch references, never the truth of a player's physical lot.
static func open(shell: Node) -> void:
	var modal: Array = shell.modal("全图鉴 · 全部手表",1080)
	var body: VBoxContainer = modal[0]
	var scroll := ScrollContainer.new()
	scroll.custom_minimum_size = Vector2(0,560)
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	body.add_child(scroll)
	var index := UIKit.vbox(16)
	index.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.add_child(index)
	var detail := UIKit.vbox(12)
	detail.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var back := UIKit.button("← 返回全部手表", "secondary",Vector2(0,48),19)
	back.name = "catalogue_back"
	detail.add_child(back)
	var reference := UIKit.vbox(12)
	reference.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	detail.add_child(reference)
	var saved_scroll := [0]
	back.pressed.connect(func():
		scroll.remove_child(detail)
		scroll.add_child(index)
		scroll.set_deferred("scroll_vertical",saved_scroll[0]))
	for tier in ["low","mid","luxury"]:
		index.add_child(UIKit.module_header({"low":"低等手表","mid":"中等手表","luxury":"名贵手表"}[tier],"点击手表查看标准参考资料","CATALOGUE"))
		var grid := GridContainer.new()
		grid.columns = 4
		grid.add_theme_constant_override("h_separation",10)
		grid.add_theme_constant_override("v_separation",10)
		grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		index.add_child(grid)
		grid.resized.connect(func(): grid.columns = maxi(1,mini(4,int(grid.size.x/180))))
		for definition in GameData.item_list:
			if definition.get("tier","") != tier: continue
			var id: String = definition.id
			var card := UIKit.button(definition.name,"secondary",Vector2(170,165),17)
			card.name = "catalogue_model_"+id
			card.icon = UIKit.item_icon(id)
			card.expand_icon = true
			card.vertical_icon_alignment = VERTICAL_ALIGNMENT_TOP
			card.icon_alignment = HORIZONTAL_ALIGNMENT_CENTER
			card.add_theme_constant_override("icon_max_width",100)
			card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			card.pressed.connect(func():
				saved_scroll[0] = scroll.scroll_vertical
				scroll.remove_child(index)
				scroll.add_child(detail)
				UIKit.clear(reference)
				load("res://scripts/ui/watch_manual.gd").populate_reference(reference,id)
				scroll.scroll_vertical = 0)
			grid.add_child(card)
	# Detached index/detail are explicitly freed with the modal.
	body.tree_exiting.connect(func():
		if is_instance_valid(index) and index.get_parent()==null: index.queue_free()
		if is_instance_valid(detail) and detail.get_parent()==null: detail.queue_free())
