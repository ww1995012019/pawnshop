# Backend contract and verification

`NightCrime` is a global class. Commerce.reduce remains the gameplay entry point. Model NEXT/SETTLE hooks apply the night only after successful lifecycle transitions. NightCrime.ensure migrates old saves; save/new/load paths call it. No force flags are used.

Actions:
- BUY_INSURANCE; UPDATE_INSURANCE. Query insurance_problem(s) for disabled reason and insurance_quote(s) for exact price rows. These actions immediately charge incremental due, cover confirmed item UID/value, and do not grant inspection evidence.
- OPEN_NIGHT_REPORT; ACK_NIGHT_REPORT {day?: morning day}. Without day, acknowledges all existing mornings. Opening never repeats losses or claims.
- ARRIVE: includes scheduled inspection/fence. ARRIVE_INSPECTION: explicitly summons pending inspector any time no trade is active, even at cursor6/AP0, as an independent bonus visit. inspection_pending(s) blocks close until resolved. can_arrive(s) handles ordinary plus overflow availability.
- RESOLVE_INSPECTION {tradeId}: resolves current inspection with zero AP; REFUSE cannot skip it. Bonus visit leaves ordinary cursor unchanged. Police is existing kind=police plus inspectionVisit=true and bonusVisit=bool; issue wanted can coexist.
- GRAY_TRADE {tradeId,uid?:selected inventory UID,confirmed:true}: must be explicit after showing risk. Buy uses current trade.item, sell uses uid. It authorizes only this trade ID. Unknown provenance remains unknown; complete gray trade incurs +8 risk. Customer/pawn/order/sealed/isolation/known-seized objects cannot use it. Existing ACCEPT/DELIVER remain the actual transaction actions.
- REPORT_LOST_ITEM {tradeId}: exact shop lost original. `lost_item_problem(s)` gives availability; requires actual TOL-002 serial evidence on current trade.item. Arrests and closes actual case, returns uninsured legitimate original or transfers insured original to insurer. No purchase necessary.
- Existing REPORT_STOLEN {uid} voluntarily hands over actual stolen inventory; credit deduplicates by case. Existing REPORT_VISITOR integrates arrest, case recovery and cooperation.

insurance_quote(s): {day,items:[{uid,defId,name,value,confirmedValue,covered}],total,maxValue,premium,paid,due,purchased,disclaimer}. Empty eligible inventory has premium0 and disabled reason. Eligibility deliberately never consults hidden stolen flag. Initial purchase and update publish accurate current physical market value without adding evidence. Higher prior confirmed value survives stock decrease; payout caps against current loss value.

public_report(s): {cases,mornings,morning,unread,reportOpen,policy,cooperation:int,leniencyChance:int,inspection:{pending,active},lastInspection}. `policy` is the insurance quote.
- morning/mornings: {day: opening day,night: theft night,losses:[{uid,defId,name,condition,location,value,confirmedValue,covered,payout,caseId,claimReason}],payout,acknowledged}. No-loss mornings have empty losses, acknowledged=true, no modal. `unread` is latest morning unread; `reportOpen` is explicit dialog state.
- cases: [{id,lossDay,origin, revealed,arrested,items:[{uid,defId,name,paid,payout,recovery,resolved}], suspect?:visible name}]. Before revealed, never show suspect. No hidden culprit IDs or stolen flags in public projection. External cases appear only once revealed.
- lastInspection: {day,confiscated:[UID],implicated:[UID],uncertain:[UID],fineDue,finePaid,waived,leniency,cooperation,text}. Leniency still returns confirmed stolen originals; it waives cash, risk and relation penalties.

Private state lives under nightCrime: policies/nights/cases/mornings/days/cooperation/lastInspection/reportOpen/version. Do not expose saved culprit or random schedule/fence internals to UI/phone. Physical case snapshots may remain historical records while a holder field identifies the only live holder. Only case-held records can re-enter a trade; no recreated UID or item copies enter inventory.

Native tests: initial RED observed (missing new-game night state and missing night rule module). Complete real-loop coverage and verification follow below.


## Verification and decisions

Fresh targeted verification passed six groups: night_crime_test (80 assertions, zero failures), crime_event_test, wanted_cases_test, merchant_test, residents_test, forgery_test. Each group ran through headless Godot 4.6.3 with isolated XDG_DATA_HOME, exit0, and no SCRIPT ERROR/Parse Error/FAIL markers. git diff --check passed. Native runner includes night_crime_test. Full suite, UI and web publication remain the root task's integration gate.

Observed RED before initial implementation: new games missing nightCrime and absent NightCrime module. Additional observed RED→GREEN coverage: incomplete exterior work safeguard, real gray purchase invalid low opening price, new suspicious-goods cooperation credit, two confirmed ownership findings (repeat theft insurer rights and terminal RETURN_ITEM preventing resurrection). The regression suite also exercises insured/uninsured real night settlement, failed fee settlement, exact formula/policy updates/no refund, repair appreciation cap, hidden-source qualification/claim rejection, JSON/old-save migration, purpose-separated theft draw frequency, exact-UID actual resale/refusal/later return/serial report, insurer-only recovery, gray buy and sale through ACCEPT/DELIVER, anti-laundering REGISTER, PAWN case guard, existing wanted arrest recovery, same-case handover/arrest dedup, risk/leniency thresholds, actual external fence acquisition, saved leniency/reload and AP0 cursor6 police cash cap.

Rulings: a physical case record keeps an immutable historical snapshot while its `holder` identifies the sole live location; only `holder=case` enters resale. Re-theft moves the preceding record to `case-transfer` and carries insurer title and provenance into the new case; it never creates a second claim. RETURN_ITEM is a terminal voluntary handover for case goods, not a sale or a recoverable case cache. Case goods cannot be pawned because the approved gray route authorizes buying/selling rather than creating customer custody rights. Incomplete service/refurbishment operations protect the object even when a caseback is closed. Ordinary ARRIVE itself has no AP charge in the existing Model; can_arrive follows that actual reducer behavior, while bonus inspector can always be explicitly summoned at AP0.

Existing merchant preview regression now resolves selected inspector visits rather than attempting to REFUSE mandatory inspection. Existing daytime crime regression asserts the old CRIME-THEFT path is absent and preserves the suspicious-goods event's actual sealed object, anti-laundering and handover paths. Newly generated suspicious-goods cases have explicit case IDs and deduplicated cooperation; old unknown historical handovers are not retroactively credited.

No UI edits or deployment performed. No remaining known Important backend gap after focused ownership reviewer recheck. Shutdown logs include an ObjectDB/script-resource warning accepted by the existing native runner (no gameplay script error); root should retain the normal complete-suite gate.
