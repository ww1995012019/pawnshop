#!/usr/bin/env python3
"""Run non-rendering Godot regressions with separate saves and bounded timeouts."""
import argparse
import os
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
TESTS = ("ownership_claims_test", "auction_nights_test", "warranty_cases_test", "story_receipts_test", "story_events_integration_test", "story_book_ui_test", "repair_contract_guard_test", "bulk_crates_test", "campaign_life_test", "service_contracts_test", "shop_journal_test", "shop_upgrades_test", "weekly_market_test", "shop_feedback_test", "shop_integration_test", "shop_plan_ui_test", "report_continuation_test", "mobile_screenshot_fixes_test", "mobile_density_test", "contraband_inspection_test", "contraband_inspection_ui_test", "mobile_panels_test", "mobile_quote_input_test", "landscape_title_size_test", "landscape_mobile_test", "visit_schedule_test", "contextual_negotiation_test", "watch_screw_groups_test", "landlord_test", "landlord_ui_test", "merchant_materials_ui_test", "portrait_counter_test", "watch_forgery_composite_test", "watch_bench_geometry_test", "optical_document_test", "star_watch_economy_test", "counter_lifecycle_ui_test", "watch_supply_test", "watch_rare_animation_test", "night_report_popup_test", "counter_table_test", "counter_table_ui_test", "session_crime_integration_test", "session_crime_integration_ui_test", "counter_dialogue_test", "counter_dialogue_ui_test", "multi_item_trade_test", "premium_counterfeit_test", "premium_counterfeit_ui_test", "document_resize_hit_test", "closed_action_feedback_test", "store_costs_test", "workbench_permissions_test", "watch_refurbishment_test", "watch_refurbishment_ui_test", "watch_refurbishment_art_test", "mobile_gesture_test", "watch_cleaning_test", "watch_cleaning_input_test", "watch_service_test", "watch_bench_art_test", "watch_service_ui_test", "document_views_test", "campaign_ledger_test", "ui_regression", "quote_console_test", "counter_payment_test", "orders_ui_test", "report_layout_test", "workspace_test",
         "workbench_layout_test", "instrument_layout_test", "audio_test", "web_touch_test", "touch_assist_test", "item_art_test",
         "merchant_test", "residents_test", "forgery_test", "commerce_ui_test", "commerce_phone_test", "crime_event_test", "night_crime_test", "night_crime_ui_test", "wanted_cases_test", "wanted_art_test", "wanted_ui_test", "watch_rules_test", "watch_catalogue_test", "watch_appraisal_test", "watch_forgery_methods_test", "watch_art_test", "watch_inspection_test", "inspection_usability_test", "watch_manual_test", "watch_save_test", "bell_test", "watch_optical_face_test", "watch_evidence_refresh_test")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--godot", default=os.environ.get("GODOT_BIN", "godot"))
    args = parser.parse_args()
    logs = ROOT / "work/godot-tests"
    logs.mkdir(parents=True, exist_ok=True)
    failed = []
    with tempfile.TemporaryDirectory(prefix="godot-tests-", dir=logs) as saves:
        for name in TESTS:
            path = logs / (name + ".log")
            env = dict(os.environ, XDG_DATA_HOME=str(Path(saves) / name))
            try:
                with path.open("w") as log:
                    result = subprocess.run([args.godot, "--headless", "--path", str(ROOT / "godot"),
                                             "--script", f"res://tests/{name}.gd"],
                                            env=env, stdout=log, stderr=subprocess.STDOUT, timeout=90)
                text = path.read_text()
                bad = result.returncode != 0 or any(marker in text for marker in
                      ("SCRIPT ERROR:", "Parse Error:", "Failed loading resource:",
                       'Condition "!is_inside_tree()"'))
                bad = bad or any(line.startswith("ERROR:") and "resources still in use at exit" not in line
                                 for line in text.splitlines())
            except subprocess.TimeoutExpired:
                bad = True
            print(("FAIL " if bad else "PASS ") + name, flush=True)
            if bad:
                failed.append(name)
                print(path.read_text()[-4000:])
    print(f"Godot native: {len(TESTS) - len(failed)}/{len(TESTS)} groups passed; logs: {logs}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
