extends SceneTree
var failures: Array[String] = []
func _initialize():
	call_deferred('audit')
func check(ok: bool, message: String):
	print('AUDIT ', 'PASS ' if ok else 'FAIL ', message)
	if not ok: failures.append(message)
func audit():
	var game = root.get_node('Game')
	game.prefs.reduced_motion = true
	var shell = load('res://main.tscn').instantiate()
	root.add_child(shell)
	await process_frame
	shell._close_title()
	game.new_game('ORBITAL-P0')
	game.state = Model.reduce(game.state, {'type':'ARRIVE'})
	shell.go('counter')
	await process_frame
	var page = shell.page
	page.dial.set_value(137)
	var offer_button = page.actions.get_child(0)
	check(offer_button.text.contains('137'), 'Offer button matches chosen amount: '+offer_button.text)
	offer_button.pressed.emit()
	await process_frame
	check(game.state.trade != null and game.state.trade.price == 137, 'Offer submits chosen amount')
	game.new_game('ORBITAL-P0')
	game.state = Model.reduce(game.state, {'type':'ARRIVE'})
	shell.go('counter')
	await process_frame
	shell.page.dial.set_value(121)
	shell.go('inspect')
	await process_frame
	shell.go('counter')
	await process_frame
	check(shell.page.dial.value == 121, 'Chosen quote survives page navigation: '+str(shell.page.dial.value))
	game.new_game('OTHER-SESSION')
	game.dispatch({'type':'ARRIVE'})
	shell.go('counter')
	await process_frame
	var initial_quote := int(game.state.trade.price * 0.8)
	check(shell.page.dial.value == initial_quote, 'New game does not reuse the previous session quote')
	shell._show_title()
	await process_frame
	shell.open_help()
	await process_frame
	check(shell.root_ui.get_children().find(shell.modal_layer) > shell.root_ui.get_children().find(shell.title), 'Opening-screen help is above the title overlay')
	for child in shell.modal_layer.get_children():
		child.queue_free()
	shell._close_title()
	await process_frame
	check(shell.page_host.visible and not shell.nav.visible, 'Starting restores the interactive shop without a navigation overlay')
	print('AUDIT failures=', failures.size())
	quit(1 if not failures.is_empty() else 0)
