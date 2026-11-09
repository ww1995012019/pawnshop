"""Release contracts: references, compression, asset retention and cache headers."""
import gzip
import http.client
import importlib.util
import json
from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path
import tempfile
import threading
import unittest

ROOT = Path(__file__).resolve().parents[1]


class PackagingTests(unittest.TestCase):
    def setUp(self):
        path = ROOT / "scripts/build-godot-web.py"
        if not path.exists():
            self.fail("Godot Web release packaging is not implemented")
        spec = importlib.util.spec_from_file_location("godot_build", path)
        self.build = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.build)
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.runtime = self.root / "runtime"
        self.runtime.mkdir()
        for name, data in {"index.js": b"/* engine */", "index.wasm": b"wasm" * 1024,
                           "index.audio.worklet.js": b"/* audio */"}.items():
            (self.runtime / name).write_bytes(data)
        self.pack = self.root / "test.pck"
        self.pack.write_bytes(b"game-data" * 4096)
        self.out = self.root / "release"

    def test_loader_references_only_existing_content_addressed_files(self):
        result = self.build.package_web(self.pack, self.runtime, self.out)
        html = (self.out / "index.html").read_text()
        self.assertIn(result["pack"], html)
        self.assertIn(result["engine"] + ".wasm", html)
        self.assertEqual((self.out / result["pack"]).read_bytes(), self.pack.read_bytes())
        manifest = json.loads((self.out / "release.json").read_text())
        self.assertEqual(manifest["files"][result["pack"]]["bytes"], 36864)
        for name in manifest["files"]:
            self.assertTrue((self.out / name).is_file(), name)

    def test_explicit_compressed_transport_has_integrity_and_deferred_music(self):
        result = self.build.package_web(self.pack, self.runtime, self.out)
        transport = result["transport"]
        for name in (result["pack"], result["engine"] + ".wasm"):
            self.assertEqual(transport[name]["sha256"], self.build.digest((self.out / name).read_bytes()))
            self.assertEqual(transport[name]["gzip"], name + ".gz")
        self.assertEqual(set(result["music"]), {"shop", "workbench", "storeroom", "ledger"})
        for name in result["music"].values():
            self.assertTrue((self.out / name).is_file())
        html = (self.out / "index.html").read_text()
        self.assertIn("OrbitalAssets.install", html)
        self.assertTrue(any(name.startswith("assets-") and name.endswith(".js") for name in result["current_files"]))

    def test_compressed_files_round_trip_and_have_small_transfer_size(self):
        result = self.build.package_web(self.pack, self.runtime, self.out)
        for name in (result["pack"], result["engine"] + ".wasm"):
            compressed = (self.out / (name + ".gz")).read_bytes()
            self.assertEqual(gzip.decompress(compressed), (self.out / name).read_bytes())
            self.assertLess(len(compressed), (self.out / name).stat().st_size)

    def test_rebuild_keeps_one_previous_pack_and_preserves_other_files(self):
        first = self.build.package_web(self.pack, self.runtime, self.out)
        (self.out / "notes.txt").write_text("keep this")
        self.pack.write_bytes(b"second version")
        second = self.build.package_web(self.pack, self.runtime, self.out)
        self.pack.write_bytes(b"third version")
        third = self.build.package_web(self.pack, self.runtime, self.out)
        self.assertFalse((self.out / first["pack"]).exists())
        self.assertTrue((self.out / second["pack"]).exists())
        self.assertTrue((self.out / third["pack"]).exists())
        self.assertEqual((self.out / "notes.txt").read_text(), "keep this")

    def test_identical_restage_keeps_previous_release_and_release_id(self):
        first = self.build.package_web(self.pack, self.runtime, self.out)
        self.pack.write_bytes(b"next game")
        second = self.build.package_web(self.pack, self.runtime, self.out)
        repeated = self.build.package_web(self.pack, self.runtime, self.out)
        self.assertEqual(second["release_id"], repeated["release_id"])
        self.assertTrue((self.out / first["pack"]).exists())

    def test_engine_update_retains_previous_engine_even_when_pack_is_unchanged(self):
        first = self.build.package_web(self.pack, self.runtime, self.out)
        (self.runtime / "index.js").write_bytes(b"/* next engine */")
        second = self.build.package_web(self.pack, self.runtime, self.out)
        self.assertNotEqual(first["engine"], second["engine"])
        self.assertTrue((self.out / (first["engine"] + ".wasm")).is_file())

    def test_server_negotiates_compression_and_revalidates_html(self):
        result = self.build.package_web(self.pack, self.runtime, self.out)
        spec = importlib.util.spec_from_file_location("release_server", ROOT / "scripts/serve-godot-web.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        class QuietHandler(module.ReleaseHandler):
            def log_message(self, *_args):
                pass
        server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(self.out)))
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            conn = http.client.HTTPConnection("127.0.0.1", server.server_port)
            conn.request("GET", "/" + result["engine"] + ".wasm", headers={"Accept-Encoding":"gzip"})
            response = conn.getresponse()
            self.assertEqual(response.getheader("Content-Type"), "application/wasm")
            self.assertEqual(response.getheader("Content-Encoding"), "gzip")
            self.assertIn("immutable", response.getheader("Cache-Control"))
            self.assertEqual(gzip.decompress(response.read()), b"wasm" * 1024)
            conn.request("GET", "/" + result["pack"], headers={"Accept-Encoding":"gzip;q=0"})
            response = conn.getresponse()
            self.assertIsNone(response.getheader("Content-Encoding"))
            self.assertEqual(response.read(), self.pack.read_bytes())
            conn.request("GET", "/index.html")
            response = conn.getresponse()
            self.assertEqual(response.getheader("Cache-Control"), "no-cache")
            etag = response.getheader("ETag")
            response.read()
            conn.request("GET", "/index.html", headers={"If-None-Match":etag})
            response = conn.getresponse()
            self.assertEqual(response.status, 304)
            response.read()
            conn.close()
        finally:
            server.shutdown()
            server.server_close()
            thread.join()


if __name__ == "__main__":
    unittest.main()
