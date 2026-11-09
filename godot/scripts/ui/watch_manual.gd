extends RefCounted
## Reference only: opening or changing pages never inspects the player's lot.

static func open(shell: Node, def_id := "") -> void:
	var sheet: Array = shell.modal("手表检验说明书", 1000)
	var body: VBoxContainer = sheet[0]
	var picker := OptionButton.new()
	picker.name = "manual_model"
	picker.custom_minimum_size = Vector2(0, 50)
	picker.add_theme_font_size_override("font_size", 20)
	var selected := 0
	for i in GameData.item_list.size():
		var definition: Dictionary = GameData.item_list[i]
		picker.add_item(definition.name)
		picker.set_item_metadata(i, definition.id)
		if definition.id == def_id: selected = i
	picker.select(selected)
	body.add_child(picker)
	var scroll := ScrollContainer.new()
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	scroll.custom_minimum_size = Vector2(0, minf(500, shell.get_viewport().get_visible_rect().size.y - 230))
	scroll.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.follow_focus = true
	body.add_child(scroll)
	var content := UIKit.vbox(12)
	content.name = "manual_reference"
	content.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.add_child(content)
	var show := func(index: int) -> void:
		UIKit.clear(content)
		var id: String = picker.get_item_metadata(index)
		var d: Dictionary = GameData.def(id)
		var reference: Dictionary = WatchRules.model_reference(id)
		content.add_child(UIKit.label(d.name, 26, UIKit.AMBER))
		var art_row := UIKit.hbox(22)
		for back in [false, true]:
			var image := TextureRect.new()
			image.texture = UIKit.item_icon(id, back)
			image.custom_minimum_size = Vector2(140, 170)
			image.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			image.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
			art_row.add_child(image)
		var logo = load("res://scripts/world/watch_logo.gd").new()
		logo.setup(id, 0)
		logo.custom_minimum_size = Vector2(160, 110)
		art_row.add_child(logo)
		content.add_child(art_row)
		content.add_child(UIKit.label("标准 logo：%s" % reference.get("logo", "按型号图样对照"), 20, UIKit.TEXT, false, true))
		content.add_child(UIKit.label("编号规则：%s" % reference.get("serial_format", "%s 四位批次 六位流水号" % reference.get("serial_prefix", "")), 20, UIKit.TEXT, false, true))
		content.add_child(UIKit.label("紫外编号位置：%s" % reference.get("serial_location", "后盖内侧标记区；翻到背面，用紫外灯照亮。"), 19, UIKit.MUTED, false, true))
		content.add_child(UIKit.label("完整重量：%.1f ± %.1f g" % [float(reference.get("nominal_mass", 0)), float(reference.get("tolerance", 1))], 22, UIKit.AMBER))
		content.add_child(UIKit.label("标准配置：%s" % reference.get("configuration", reference.get("strap", "原装表带")), 19, UIKit.TEXT, false, true))
		if float(reference.get("link_mass", 0)) > 0:
			content.add_child(UIKit.label("每节可拆表节：%.1f g；按实际表节数量修正完整重量，调短表带不等于内部缺件。" % float(reference.link_mass), 19, UIKit.MUTED, false, true))
		if reference.get("logo_exception", "") != "":
			content.add_child(UIKit.label("正规变体：%s" % reference.logo_exception, 19, UIKit.MUTED, false, true))
		content.add_child(UIKit.rule())
		content.add_child(UIKit.label("对照提示\n• 放大镜比较图形、字形与刻印位置，磨损可能遮住细节。\n• 紫外编号要核对品牌和型号码。规则符合也可能是复制号；编号异常也可能来自更换后盖。\n• 偏轻可能是缺件、少表节或替换机芯；重量正常仍可能是仿品或配重。三项结果要结合判断。", 19, UIKit.TEXT, false, true))
		content.add_child(UIKit.label("完好品参考行情：%d–%d Cr。此区间只供查阅，不是当前实物的检测定价。" % [roundi(float(d.value) * 0.8), roundi(float(d.value) * 1.2)], 19, UIKit.AMBER, false, true))
		content.add_child(UIKit.label("本手册不验证走时精度、防水性能或所有内部故障。查看手册不消耗行动点，也不会自动告诉来客你的检验结果。", 18, UIKit.MUTED, false, true))
		scroll.scroll_vertical = 0
	picker.item_selected.connect(show)
	show.call(selected)
