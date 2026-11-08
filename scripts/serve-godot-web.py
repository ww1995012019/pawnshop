#!/usr/bin/env python3
"""Preview a release with the same compression/cache policy expected in hosting."""
import argparse
from functools import partial
import hashlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import mimetypes
from pathlib import Path
import re


class ReleaseHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        path = Path(self.translate_path(self.path))
        if path.is_dir():
            path = path / "index.html"
        if not path.is_file():
            return super().send_head()
        mime = mimetypes.guess_type(str(path))[0] or "application/octet-stream"
        gzip_path = path.with_name(path.name + ".gz")
        encodings = self.headers.get("Accept-Encoding", "")
        accepts_gzip = any(part.strip().split(";", 1)[0] == "gzip" and not re.search(r";\s*q=0(?:\.0*)?(?:\s|$)", part)
                           for part in encodings.split(","))
        compressed = accepts_gzip and gzip_path.is_file()
        data = (gzip_path if compressed else path).read_bytes()
        etag = '"' + hashlib.sha256(data).hexdigest()[:24] + '"'
        immutable = bool(re.search(r"-[0-9a-f]{16}\.", path.name))
        self.send_response(304 if self.headers.get("If-None-Match") == etag else 200)
        self.send_header("Content-Type", mime)
        self.send_header("Cache-Control", "public, max-age=31536000, immutable" if immutable else "no-cache")
        self.send_header("ETag", etag)
        self.send_header("Vary", "Accept-Encoding")
        self.send_header("X-Content-Type-Options", "nosniff")
        if compressed:
            self.send_header("Content-Encoding", "gzip")
        if self.headers.get("If-None-Match") == etag:
            self.end_headers()
            return None
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        from io import BytesIO
        return BytesIO(data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--directory", type=Path, default=Path(__file__).resolve().parents[1] / "play-godot")
    parser.add_argument("--port", type=int, default=4174)
    args = parser.parse_args()
    handler = partial(ReleaseHandler, directory=str(args.directory))
    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    print(f"Godot Web preview: http://127.0.0.1:{args.port}/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
