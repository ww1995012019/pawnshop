extends SceneTree

func _initialize() -> void:
	call_deferred("run_check")

func check(condition: bool, message: String) -> void:
	if not condition:
		push_error(message)
		quit(1)
		assert(condition, message)

func run_check() -> void:
	check(ResourceLoader.exists("res://scripts/ui/campaign_ledger.gd"), "Campaign ledger view must exist")
	if not ResourceLoader.exists("res://scripts/ui/campaign_ledger.gd"):
		return
	var ledger = load("res://scripts/ui/campaign_ledger.gd")
	var state := {"cash": 1285.0, "day": 3, "ap": 6.0, "ledger": [
		{"id": "buy", "day": 1, "kind": "purchase", "label": "收购", "amount": -400.0, "cost": 400.0},
		{"id": "pawn", "day": 1, "kind": "pawn-principal", "label": "抵押本金", "amount": -200.0},
		{"id": "return", "day": 2, "kind": "pawn-return", "label": "收回本金", "amount": 200.0},
		{"id": "fee", "day": 2, "kind": "pawn-fee", "label": "服务费", "amount": 25.0},
		{"id": "sale", "day": 3, "kind": "sale", "label": "售出", "amount": 700.0, "cost": 400.0},
		{"id": "rent", "day": 3, "kind": "rent", "label": "租金", "amount": -40.0},
		{"id": "event", "day": 3, "kind": "station-event", "label": "站务记录", "amount": 0.0}]}
	var before := state.duplicate(true)
	var totals: Dictionary = ledger.summary(state)
	check(totals.income == 925.0 and totals.expenses == 640.0, "Totals must include principal, fee and sale without subtracting cost twice")
	check(totals.net == 285.0 and totals.opening == 1000.0 and totals.cash == 1285.0, "Opening balance plus net cash flow must reconcile to cash")
	var rows: Array = ledger.filtered_entries(state)
	check(rows.size() == 7 and rows[0].id == "event" and rows[1].id == "rent" and rows[-1].id == "buy", "Newest first must preserve reverse posting order within a day and include zero records")
	var filtered: Array = ledger.filtered_entries(state, 2, "pawn-return")
	check(filtered.size() == 1 and filtered[0].id == "return", "Date and transaction-kind filters must intersect")
	check(ledger.filtered_entries(state, 1, "rent").is_empty(), "Unmatched filters must be empty")
	rows[0].label = "changed view copy"
	check(state == before, "Summary and filter results must not mutate source state")
	var empty: Dictionary = ledger.summary({"cash": 900.0, "ledger": []})
	check(empty.opening == 900.0 and empty.net == 0 and empty.expenses == 0 and empty.income == 0, "Empty ledger must preserve opening cash")
	var game = root.get_node("Game")
	game.new_game("CAMPAIGN-LEDGER")
	game.state.cash = state.cash
	game.state.ledger = state.ledger.duplicate(true)
	var game_before: Dictionary = game.state.duplicate(true)
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await process_frame
	shell._close_title()
	ledger.open(shell)
	await process_frame
	var day_picker: OptionButton = shell.modal_layer.find_child("ledger_day", true, false)
	var kind_picker: OptionButton = shell.modal_layer.find_child("ledger_kind", true, false)
	var entries: VBoxContainer = shell.modal_layer.find_child("ledger_entries", true, false)
	check(day_picker != null and kind_picker != null and entries != null, "Ledger must expose date and transaction-kind filters plus entries")
	check(entries.get_child_count() == 7, "Modal must display complete campaign instead of today's records")
	for i in day_picker.item_count:
		if day_picker.get_item_metadata(i) == 1:
			day_picker.select(i)
			day_picker.item_selected.emit(i)
	check(entries.get_child_count() == 2, "Changing the date filter must refresh visible entries")
	for i in kind_picker.item_count:
		if kind_picker.get_item_metadata(i) == "rent":
			kind_picker.select(i)
			kind_picker.item_selected.emit(i)
	check(entries.get_child_count() == 1 and entries.get_child(0) is Label and "没有" in entries.get_child(0).text, "No matches must show a readable empty state")
	ledger.open(shell)
	await process_frame
	check(game.state == game_before, "Opening repeatedly and filtering must never repost cash, spend AP or alter game state")
	shell.queue_free()
	await process_frame
	print("Campaign ledger: mixed cash totals, opening balance, ordering, filters and read-only modal passed")
	quit(0)
