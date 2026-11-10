# Natural Counter Dialogue Correction

> Required workflow: superpowers:executing-plans, inline; preserve the previously verified transaction engine.

User correction supersedes the earlier list-modal design: ordinary NPC buying/selling must happen naturally in the original counter conversation, without opening a trade mode/list. On arrival the NPC presents a lot or asks to see stock; presenting another shop lot prompts immediate dialogue. NPC goods are offered one at a time in the same conversation. Each original retains its own quote/rounds/knowledge and rejected reason. Agreed lots can be remembered and settled together using the original console, and checkout keeps the NPC present until explicitly sent away. No new start-trading/list button or trade-management modal.

Architecture: CounterDialogue adapts familiar SELECT_TRADE/OFFER/ACCEPT/DELIVER/REFUSE to TradeSession's validated item rows and atomic settlement. Synchronize the active original to the legacy console fields, keep bulk/session safety rules behind the dialogue, migrate already-active list saves. Police and material-merchant flows remain special; original single-item legacy reducer fixtures remain readable. Pawn handling preserves its original ownership/payment semantics.

- [x] RED native rules and UI checks for automatic arrival, direct stock presentation, immediate refusal/counteroffer, sequential NPC offers, multiple agreed originals, atomic checkout/duplicate and stay-at-counter, old session migration, no modal entry.
- [x] Implement dialogue adapter and console/current-item integration; remove list entry/return-to-list behavior; NPC words explain outcomes. Keep original key order/frame bounds and cash/item handover animation.
- [x] GREEN targeted plus complete native/packaging/font/layout checks; real desktop/phone continuous conversation, bidirectional lots, inspection return and saved continuation.
- [x] Fresh independent review, fix material regressions with tests, reconcile main, publish tested artifact and await exact-SHA Pages success.

Review focus: no remaining list gateway, no hidden selected-goods loss when switching topics, per-original rounds and recognition retained, cross-visit/repeat guards, NPC stays through payment/inspection and only leaves on send-off, locked old saves and pawn compatibility.

Verification:53/53 native groups plus packaging7/font/layout pass. Fresh independent review identified stale delivery, locked offers, hidden evidence leakage, net-funded pricing, physical handover and cancellation recovery; native reproductions observed RED then GREEN. Original payment animation tests and exported33 watches/33 residents/3 tools pass. Actual desktop and phone conversations cover3 direct stock presentations +1 NPC lot, inspection/return with no modal, four-item payment with same person staying, saved continuation and explicit send-off. Final visual-only total readout change verified by native UI and fresh export.
