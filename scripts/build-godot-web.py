#!/usr/bin/env python3
"""Build only the game pack; stage it with the pinned, content-addressed engine."""
import argparse
import gzip
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def digest(data):
    return hashlib.sha256(data).hexdigest()


def package_web(pack, runtime, output):
    pack, runtime, output = Path(pack), Path(runtime), Path(output)
    output.mkdir(parents=True, exist_ok=True)
    old = {}
    if (output / "release.json").exists():
        old = json.loads((output / "release.json").read_text())
    runtime_files = sorted(p for p in runtime.glob("index.*") if p.is_file())
    if not (runtime / "index.js").is_file() or not (runtime / "index.wasm").is_file():
        raise ValueError("Pinned runtime needs index.js and index.wasm")
    engine_hash = hashlib.sha256()
    for path in runtime_files:
        engine_hash.update(path.name.encode())
        engine_hash.update(path.read_bytes())
    engine = "engine-" + engine_hash.hexdigest()[:16]
    pack_data = pack.read_bytes()
    pack_name = "workbench-" + digest(pack_data)[:16] + ".pck"
    assets = {pack_name: pack_data}
    for path in runtime_files:
        assets[engine + path.name[len("index"):]] = path.read_bytes()
    if (runtime / "LICENSE.txt").is_file():
        assets["godot-license.txt"] = (runtime / "LICENSE.txt").read_bytes()
    music = {}
    for theme in ("shop", "workbench", "storeroom", "ledger"):
        data = (ROOT / "godot/assets/music" / (theme + ".ogg")).read_bytes()
        name = "music-" + digest(data)[:16] + ".ogg"
        assets[name] = data
        music[theme] = name
    loader = (ROOT / "godot/web/asset-loader.js").read_bytes()
    loader_name = "assets-" + digest(loader)[:16] + ".js"
    assets[loader_name] = loader
    transport = {}
    for name in (pack_name, engine + ".wasm", *music.values()):
        data = assets[name]
        compressed = name.endswith((".pck", ".wasm"))
        transport[name] = {"sha256": digest(data), "bytes": len(data),
                           "type": "application/wasm" if name.endswith(".wasm") else "audio/ogg" if name.endswith(".ogg") else "application/octet-stream",
                           "gzip": name + ".gz" if compressed else None,
                           "gzipBytes": len(gzip.compress(data, compresslevel=9, mtime=0)) if compressed else len(data)}
    for name in ("web-ui.js", "web-ui.css"):
        data = (ROOT / "godot/web" / name).read_bytes()
        assets["touch-" + digest(data)[:16] + Path(name).suffix] = data
    js_name = next(name for name in assets if name.startswith("touch-") and name.endswith(".js"))
    css_name = next(name for name in assets if name.startswith("touch-") and name.endswith(".css"))
    loading = (ROOT / "godot/web/loading-shop.png").read_bytes()
    loading_name = "loading-shop-" + digest(loading)[:16] + ".png"
    assets[loading_name] = loading
    # Resolve the background URL before hashing its CSS filename.
    css_data = assets.pop(css_name).replace(b"loading-shop.png", loading_name.encode())
    css_name = "touch-" + digest(css_data)[:16] + ".css"
    assets[css_name] = css_data
    previous_assets = old.get("previous_assets", []) if transport == old.get("transport") else list(old.get("transport", {}))
    config = {"args": [], "canvasResizePolicy": 0, "executable": engine,
              "mainPack": pack_name, "fileSizes": {pack_name: len(pack_data),
              engine + ".wasm": len(assets[engine + ".wasm"])}, "focusCanvas": True,
              "gdextensionLibs": [], "ensureCrossOriginIsolationHeaders": False,
              "transport": transport, "music": music,
              "previousAssets": previous_assets}
    html = (ROOT / "godot/web/shell.html").read_text()
    head = f'<link rel="icon" href="{engine}.icon.png">' if (runtime / "index.icon.png").exists() else ""
    for placeholder, value in {"$GODOT_CONFIG": json.dumps(config, separators=(",", ":")),
                               "$GODOT_THREADS_ENABLED": "false", "$GODOT_URL": engine + ".js",
                               "$GODOT_HEAD_INCLUDE": head}.items():
        html = html.replace(placeholder, value)
    html = html.replace('"web-ui.js"', f'"{js_name}"').replace('"web-ui.css"', f'"{css_name}"')
    html = html.replace("loading-shop.png", loading_name)
    html = html.replace("asset-loader.js", loader_name)
    assets["index.html"] = html.encode()
    assets[".nojekyll"] = b""
    for name, data in list(assets.items()):
        if Path(name).suffix in (".wasm", ".pck", ".js", ".css"):
            assets[name + ".gz"] = gzip.compress(data, compresslevel=9, mtime=0)
    for name, data in assets.items():
        target = output / name
        if target.is_file() and target.read_bytes() == data:
            continue
        temp = target.with_name(target.name + ".tmp")
        temp.write_bytes(data)
        temp.replace(target)
    # Retain the last release's immutable assets for existing tabs. Prune only
    # files explicitly recorded by our own manifest, never unrelated files.
    release_id = digest(json.dumps({name: digest(data) for name, data in sorted(assets.items())}, sort_keys=True).encode())[:16]
    previous = old.get("current_files", []) if old.get("release_id") != release_id else old.get("previous_files", [])
    previous = [name for name in previous if Path(name).name == name and name not in assets and (output / name).is_file()]
    retained = set(assets) | set(previous)
    for name in old.get("files", {}):
        if Path(name).name == name and name not in retained and re.match(r"^(workbench|engine|touch|loading-shop|assets|music)-[0-9a-f]+\.", name):
            (output / name).unlink(missing_ok=True)
    files = {name: {"bytes": (output / name).stat().st_size,
                    "sha256": digest((output / name).read_bytes())} for name in sorted(retained)}
    result = {"release_id": release_id, "pack": pack_name, "engine": engine, "current_files": sorted(assets),
              "previous_files": sorted(previous), "files": files, "transport": transport, "music": music, "previous_assets": previous_assets,
              "initial_raw_bytes": len(pack_data) + len(assets[engine + ".wasm"]),
              "initial_gzip_bytes": len(assets[pack_name + ".gz"]) + len(assets[engine + ".wasm.gz"])}
    (output / "release.json").write_text(json.dumps(result, indent=2) + "\n")
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "play-godot")
    parser.add_argument("--pack", type=Path, help="Stage an already exported pack")
    parser.add_argument("--godot", default=os.environ.get("GODOT_BIN", "godot"))
    args = parser.parse_args()
    runtime = ROOT / "vendor/godot-web"
    pinned = json.loads((runtime / "runtime.json").read_text())
    for name, expected in pinned["files"].items():
        if digest((runtime / name).read_bytes()) != expected:
            raise ValueError("Pinned Web engine checksum mismatch: " + name)
    pack = args.pack
    if pack is None:
        version = subprocess.check_output([args.godot, "--version"], text=True).strip()
        if not version.startswith(pinned["version"] + "."):
            raise ValueError(f"Use Godot {pinned['version']} with this pinned Web engine; found {version}")
        build = ROOT / "build/godot"
        build.mkdir(parents=True, exist_ok=True)
        pack = build / "game.pck"
        subprocess.run(["python3", str(ROOT / "scripts/subset-game-font.py")], check=True)
        for extra in (["--editor", "--import"], ["--export-pack", "Web", str(pack)]):
            subprocess.run([args.godot, "--headless", "--path", str(ROOT / "godot"), *extra], check=True)
    result = package_web(pack, runtime, args.output)
    print(f"Godot Web ready: {args.output}")
    print(f"Engine + pack: {result['initial_raw_bytes'] / 1e6:.2f} MB raw, {result['initial_gzip_bytes'] / 1e6:.2f} MB gzip")


if __name__ == "__main__":
    main()
