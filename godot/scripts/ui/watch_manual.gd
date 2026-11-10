extends RefCounted
## Inspection guide is a non-modal paper; catalogue is a separate icon index.
static func open(shell: Node, def_id := "") -> void:
	var host: Node = shell.workspace_parent if shell.workspace_mode else shell
	var paper = host.root_ui.find_child("inspection_guide",false,false)
	if paper == null:
		paper = load("res://scripts/ui/floating_document.gd").new()
		paper.name = "inspection_guide"
		paper.document_shell = host
		host.root_ui.add_child(paper)
		paper.configure("检验说明书", "inspection_guide", Vector2(650,740))
		paper.set_meta("model", "")
	var id: String = def_id if def_id != "" else String(GameData.item_list[0].id)
	if paper.get_meta("model") != id:
		paper.set_meta("model",id)
		UIKit.clear(paper.content)
		paper.content.add_child(UIKit.note_card("工具操作", "放大镜：照住表盘标识并完成观察。紫外灯：翻到背面核对编号。电子秤：空秤归零，再放表，稳定后自动记录。仅打开说明书不会完成检验。"))
		var catalogue := UIKit.button("浏览全部手表图鉴", "secondary", Vector2(0,48),18)
		catalogue.pressed.connect(func(): host.open_watch_catalogue())
		paper.content.add_child(catalogue)
		populate_reference(paper.content,id,true)
		paper.document_scroll.scroll_vertical = 0
	paper.show()
	host.root_ui.move_child(paper,-1)
	host.root_ui.move_child(host.modal_layer,-1)
	paper.relayout()

static func populate_reference(content: VBoxContainer, id: String, paper := false) -> void:
	var d: Dictionary = GameData.def(id)
	var reference: Dictionary = WatchRules.model_reference(id)
	var heading := UIKit.module_header(d.name, "型号参考档案 · 对照实物逐项查阅", String(reference.get("model", "型号参考")))
	if paper:
		var nodes: Array = [heading]
		while not nodes.is_empty():
			var node: Node = nodes.pop_back()
			if node is Label: node.add_theme_color_override("font_color",UIKit.INK)
			nodes.append_array(node.get_children())
	content.add_child(heading)
	content.add_child(UIKit.label("型号档次：%s · 档次仅指型号行情，不代表本件真伪或品相。" % GameData.tier_label(id), 17, UIKit.RUST, false, true))
	if GameData.def(id).get("tier") == "luxury":
		var distinction := UIKit.hbox(8)
		distinction.add_child(UIKit.tier_badge(id))
		distinction.add_child(UIKit.label("名贵型号 · 金饰徽章", 18, UIKit.INK if paper else UIKit.AMBER))
		content.add_child(distinction)
	var art_card := UIKit.plate(UIKit.paper_style(12))
	var art_body := UIKit.vbox(8)
	art_card.add_child(art_body)
	art_body.add_child(UIKit.label("01 / 外观与标识图样", 18, UIKit.RUST))
	var art_row := HFlowContainer.new()
	art_row.add_theme_constant_override("h_separation", 16)
	art_row.add_theme_constant_override("v_separation", 10)
	art_row.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	for back in [false, true]:
		var figure := UIKit.vbox(4)
		var image := TextureRect.new()
		image.texture = UIKit.item_icon(id, back)
		image.custom_minimum_size = Vector2(140, 170)
		image.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		image.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		figure.add_child(image)
		var caption := UIKit.label("背面参考" if back else "正面参考", 16, UIKit.INK)
		caption.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		figure.add_child(caption)
		art_row.add_child(figure)
	var logo_figure := UIKit.vbox(4)
	var logo = load("res://scripts/world/watch_logo.gd").new()
	logo.setup(id, 0)
	logo.custom_minimum_size = Vector2(144, 154)
	var logo_mount := UIKit.plate(UIKit.screen_style(8))
	logo_mount.add_child(logo)
	logo_figure.add_child(logo_mount)
	var logo_caption := UIKit.label("标准 logo", 16, UIKit.INK)
	logo_caption.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	logo_figure.add_child(logo_caption)
	art_row.add_child(logo_figure)
	art_body.add_child(art_row)
	art_body.add_child(UIKit.label("标准 logo：%s" % reference.get("logo", "按型号图样对照"), 18, UIKit.INK, false, true))
	if reference.get("logo_exception", "") != "":
		art_body.add_child(UIKit.label("正规变体：%s" % reference.logo_exception, 18, UIKit.INK, false, true))
	content.add_child(art_card)
	content.add_child(UIKit.record_card("编号规则", "%s\n紫外编号位置：%s" % [reference.get("serial_format", "%s 四位批次 六位流水号" % reference.get("serial_prefix", "")), reference.get("serial_location", "后盖内侧标记区；翻到背面，用紫外灯照亮。")], "02 / 紫外编号"))
	var mass_text := "完整重量：%.1f ± %.1f g\n标准配置：%s" % [float(reference.get("nominal_mass", 0)), float(reference.get("tolerance", 1)), reference.get("configuration", reference.get("strap", "原装表带"))]
	if float(reference.get("link_mass", 0)) > 0:
		mass_text += "\n每节可拆表节：%.1f g；按实际表节数量修正完整重量，调短表带不等于内部缺件。" % float(reference.link_mass)
	content.add_child(UIKit.record_card("重量与配置", mass_text, "03 / 称重参考"))
	content.add_child(UIKit.note_card("对照提示", "• 放大镜比较图形、字形与刻印位置，磨损可能遮住细节。\n• 紫外编号要核对品牌和型号码。规则符合也可能是复制号；编号异常也可能来自更换后盖。\n• 偏轻可能是缺件、少表节或替换机芯；重量正常仍可能是仿品或配重。正常重量也可能来自人为配重；重心偏移是加工痕迹。三项结果要结合判断。"))
	content.add_child(UIKit.record_card("完好品参考行情", "%d–%d Cr。此区间只供查阅，不是当前实物的检测定价。" % [roundi(float(d.value) * 0.8), roundi(float(d.value) * 1.2)], "附录 / 行情摘录"))
	content.add_child(UIKit.note_card("检验估价与加工痕迹", "每项当前检验缩小估价范围；三项完成后显示准确参考市价，成交价仍需商议。维修、重描、覆印或配重后需复测更新记录，复测免费。\n重描标识留下漆层；伪造编号留下紫外晕边；配重改变重心却没有补齐缺件。专家更容易看懂对应痕迹。造假可能抬高外行买家的心理价，不提高真实市价；已判断准确的专家不会因此高估。"))
	content.add_child(UIKit.note_card("手册范围", "本手册不验证走时精度、防水性能或所有内部故障。查看手册不消耗行动点，也不会自动告诉来客你的检验结果。"))
