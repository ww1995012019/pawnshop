# Night theft insurance and police implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Implement approved persisted overnight theft, optional daily insurance, thief resale and police cooperation/inspection loop.
**Architecture:** A dedicated NightCrime rule module owns saved cases, policies, theft draws, visits, inspection and cooperation. Commerce/Model call it at successful lifecycle boundaries. UI consumes public projections and actions rather than exposing hidden truth.
**Tech Stack:** Godot 4.6 GDScript; native tests; Chromium real input.
**Spec:** docs/superpowers/specs/2026-11-10-night-theft-insurance-police-design.md

## Global Constraints
3% night theft days3–20; usually1 item,10%2 whenavailable; olddaytheftremoved. Insurance min5 ceil(total*.005+max*.03), no automaticrenewal, confirmeditemlimits, min(lossvalue,confirmedvalue), 100% coveredvalue; dailyvisit20% returnlostitem fromsecondbusinessdayafterloss,10% externalfence. Inspection8/15/25% riskbands0–29/30–59/60–100; once/day,0AP, mandatory beforeclose with bonusvisit ifslotsfull. Cooperation2/4/6 grants30/60/80%leniency; confirmedstolenoriginalstillreturned, penaltieswaived. No repeateddraws, duplicateitems/payouts/rewards. No newdebt. Keep currentfees/appraisal/refurbishment/permissions. Source+matchingwebpublish already authorized.

## Review Focus
Same physicalitem must have only one holder; receipt/ack/reload must not reroll or repay. Pendinginspection cannot block0AP forever. Insurance qualification uses knownproof, not hiddenstolentruth; rejectionatclaim mayrevealcase. Recoveredinsureditem goesinsurer. No expired/arrested thief returns. Existingwanted/cooperationcredits dedup percase/target.

### Task1 Complete crime rules and native verification
Files create godot/scripts/model/night_crime.gd, godot/tests/night_crime_test.gd; modify model.gd,commerce.gd,wanted_cases.gd,crime_events.gd,game.gd and native runner as needed.
- [x] Write failing tests for night boundaries/3% distribution, exactpolicyprices/coverageupdates, noeligibleloss, safeguardedowners/openwork, settledonce/morningonce, insured/uninsuredloss, sourcehiddeneligibility/claimrejection, actualresaleUID/rejection/recovery, arrestedabsence, overflowinspection0AP, riskbands, leniencythresholds, punishmentcashcap, samecasecredit and JSON/oldsave migration.
- [x] Observe RED before writing implementation.
- [x] Implement class_name NightCrime with ensure(s), insurance_quote(s)->Dictionary, insurance_problem(s)->String, public_report(s)->Dictionary, inspection_pending(s)->bool, can_arrive(s)->bool, reduce(previous,action)->Variant null whenunhandled. Define remaining UI actions/publicprojections and document in work/night-crime/backend-report.md. All new state under s.nightCrime, publicprojection must hide culprit/stolenflags until revealed.
- [x] Integrate actual SETTLE/NEXT/ARRIVE/trade/police report paths, not test-only helpers. Successful morning removes inventory and pays once, settlementlocksdrawandstock; insurance quote/record cap perapprovedspec. Existing old crime theft removed; preserve suspiciousgoods event without duplicate stolenitems. Add realgrayroute action, provenance and informedrisk gating, neverlaunder viaREGISTER.
- [x] Run targeted tests including oldcrimeupdated, wanted, commerce; commit ownedfiles, report API and evidence. No UI edits or deployment.

### Task2 UI and native layout
Files report_page, counter_page, warehouse_page, shell, web_touch, campaign_ledger plus native crime_ui_test/fixture.
- [x] Add failing tests for policybuy/update affordances, same-model losslist/reopen/ack, visible coverage/exclusions, riskygraytradeconfirmation, thiefreport/recovery, inspectionarrival/resolve0AP, cooperation/leniencyoutcome, disabledactions and mobilebounds.
- [x] Implement insurance/report/persistentcases readable in existingpaperretroUI; immediatepurchase costs explicit, nightlypolicy noauto-renew. Morningloss modal confirmed and laterreopenable; nocases nointrusivedialog. Nextday notices nevercoverbuttons. Controls use backend eligibility. Currentexactinsurancevaluation is approved; no automatic evidence additions. Police receipt shows confiscations/finewaived/cooperation.
- [x] Support latebonusinspection on counter/phone even0AP/6visitors; all new dialogs actualtouchscrollwork. Root may add webcompanionpublicstate only if meaningful UIprintedinfo, not hidden/testtelemetry.
- [x] Run native UI/layout tests, commitownedfiles and report.

### Task3 Review verify and publication
- [x] Per-task review clean, integrated wholebranch review, full npm test, webbuild, desktop+mobile actualinput tests with deterministic realrules fixtures, reload/ack idempotence.
- [ ] Reconcile concurrentremote withoutforce, commit, publish source and fingerprintedwebpackage, verifybytes/retainedpreviouspack, wait Pages success.
