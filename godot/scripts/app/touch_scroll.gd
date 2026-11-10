extends Node
## Let the native scroller receive pointer drags that begin over a list card
## or button. It owns inertia and cancels the button on SCROLL_BEGIN.
const ORIGINAL := "_scroll_pointer_settings"

func _ready() -> void:
	get_tree().node_added.connect(_prepare)
	_prepare_branch(get_tree().root)

func _prepare_branch(node: Node) -> void:
	_prepare(node)
	for child in node.get_children(): _prepare_branch(child)

func _prepare(node: Node) -> void:
	if not (node is BaseButton or node is PanelContainer) or node.has_meta(ORIGINAL): return
	var parent := node.get_parent()
	while parent != null:
		if parent is ScrollContainer:
			var original := {"filter":node.mouse_filter}
			if node is OptionButton:
				original.action_mode = node.action_mode
				# A swipe must not open the selector before it becomes a scroll.
				node.action_mode = BaseButton.ACTION_MODE_BUTTON_RELEASE
			node.set_meta(ORIGINAL,original)
			node.mouse_filter = Control.MOUSE_FILTER_PASS
			node.tree_exiting.connect(_restore.bind(node),CONNECT_ONE_SHOT)
			return
		parent = parent.get_parent()

func _restore(node: Node) -> void:
	if not node.has_meta(ORIGINAL): return
	var original: Dictionary = node.get_meta(ORIGINAL)
	node.mouse_filter = original.filter
	if node is OptionButton: node.action_mode = original.action_mode
	node.remove_meta(ORIGINAL)
