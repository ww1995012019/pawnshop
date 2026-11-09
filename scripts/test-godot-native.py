#!/usr/bin/env python3
"""Run non-rendering Godot regressions with separate saves and bounded timeouts."""
import argparse
import os
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
TESTS = ("ui_regression", "quote_console_test", "orders_ui_test", "workspace_test",
         "workbench_layout_test", "instrument_layout_test", "audio_test", "web_touch_test", "item_art_test")


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
