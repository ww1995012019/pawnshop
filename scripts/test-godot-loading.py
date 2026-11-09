#!/usr/bin/env python3
"""Real-browser loading contracts on a static host with NO gzip negotiation."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import shutil
import threading
import time
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

class StaticHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args): pass


def main():
    release = json.loads((ROOT / 'play-godot/release.json').read_text())
    core = [release['engine'] + '.wasm', release['pack']]
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(StaticHandler, directory=str(ROOT / 'play-godot')))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    url = f'http://127.0.0.1:{server.server_port}/'
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'), args=['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        try:
            context = browser.new_context(viewport={'width': 1280, 'height': 800})
            def ready(page):
                started = time.monotonic()
                page.goto(url)
                page.wait_for_function('window.OrbitalTouch?.state?.ready && !document.getElementById("loader")', timeout=90000)
                stats = page.evaluate('OrbitalAssets.stats')
                return time.monotonic() - started, [entry for entry in stats if entry['url'].split('/')[-1] in core]
            page = context.new_page()
            requests = []
            page.on('request', lambda request: requests.append(request.url))
            cold, stats = ready(page)
            assert len(stats) == 2 and all(not entry['cached'] for entry in stats), stats
            assert sum(entry['bytes'] for entry in stats) == release['initial_gzip_bytes'], stats
            assert all(url + name + '.gz' in requests and url + name not in requests for name in core), requests
            assert not any(url + release['music'][name] in requests for name in ('workbench', 'storeroom', 'ledger')), 'room music downloaded before visiting'
            page.wait_for_function('(name)=>OrbitalAssets.stats.some(entry=>entry.url.endsWith(name))', arg=release['music']['shop'], timeout=15000)
            for target, theme in [('inspect', 'workbench'), ('warehouse', 'storeroom'), ('report', 'ledger')]:
                page.evaluate('(data)=>window.orbitalTouchSend(JSON.stringify(data))', {'type': 'start'})
                page.wait_for_function('!OrbitalTouch.state.title && !OrbitalTouch.state.busy')
                page.evaluate('(data)=>window.orbitalTouchSend(JSON.stringify(data))', {'type': 'page', 'page': target})
                page.wait_for_function('(name)=>OrbitalAssets.stats.some(entry=>entry.url.endsWith(name))', arg=release['music'][theme], timeout=15000)
            page.close()
            page = context.new_page()
            requests = []
            page.on('request', lambda request: requests.append(request.url))
            warm, stats = ready(page)
            assert len(stats) == 2 and all(entry['cached'] and entry['bytes'] == 0 for entry in stats), stats
            assert not any(request.split('/')[-1] in core or request.split('/')[-1] in [name + '.gz' for name in core] for request in requests), requests
            # A corrupt persistent entry must be evicted and repaired, not booted.
            page.evaluate('(name)=>caches.open("orbital-binaries-v1").then(cache=>cache.put(new URL(name,document.baseURI),new Response("bad")))', core[1])
            _, stats = ready(page)
            assert stats[0]['cached'] != stats[1]['cached'], stats
            page.close()
            context.close()
            # Explicit compression failure falls back to the ordinary asset.
            context = browser.new_context(viewport={'width': 1280, 'height': 800})
            page = context.new_page()
            page.route('**/' + core[1] + '.gz', lambda route: route.fulfill(body=b'broken gzip', content_type='application/gzip'))
            _, stats = ready(page)
            assert any(entry['bytes'] > release['transport'][core[1]]['bytes'] for entry in stats), stats
            context.close()
            # Corrupt primary AND compressed downloads must fail visibly without cache poisoning.
            context = browser.new_context(viewport={'width': 1280, 'height': 800})
            page = context.new_page()
            page.route('**/' + core[1] + '*', lambda route: route.fulfill(body=b'broken', content_type='application/octet-stream'))
            page.goto(url)
            page.wait_for_selector('#loader.failed', timeout=90000)
            assert page.evaluate('(name)=>caches.open("orbital-binaries-v1").then(cache=>cache.match(new URL(name,document.baseURI))).then(Boolean)', core[1]) is False
            page.unroute('**/' + core[1] + '*')
            ready(page)
            context.close()
            # A failed theme must retry when returning to that same room.
            context = browser.new_context(viewport={'width': 1280, 'height': 800})
            page = context.new_page()
            attempts = []
            def theme_request(route):
                attempts.append(route.request.url)
                if len(attempts) == 1: route.fulfill(status=503, body=b'try later')
                else: route.continue_()
            page.route('**/' + release['music']['shop'], theme_request)
            ready(page)
            page.wait_for_timeout(800)
            page.evaluate('(data)=>window.orbitalTouchSend(JSON.stringify(data))', {'type': 'start'})
            page.wait_for_function('(name)=>OrbitalAssets.stats.some(entry=>entry.url.endsWith(name))', arg=release['music']['shop'], timeout=10000)
            assert len(attempts) >= 2, 'failed same-room theme never retried'
            context.close()
            # The vendor init Promise swallows a failed WASM load unless observed separately.
            context = browser.new_context(viewport={'width': 1280, 'height': 800})
            page = context.new_page()
            page.route('**/' + core[0] + '*', lambda route: route.fulfill(body=b'broken', content_type='application/octet-stream'))
            page.goto(url)
            page.wait_for_selector('#loader.failed', timeout=20000)
            context.close()
            # Private/storage-denied browsing still starts, using compressed transfers.
            context = browser.new_context(viewport={'width': 1280, 'height': 800})
            context.add_init_script('Object.defineProperty(window,"caches",{value:{open:()=>Promise.reject(new Error("denied"))}})')
            _, stats = ready(context.new_page())
            assert sum(entry['bytes'] for entry in stats) == release['initial_gzip_bytes'], stats
            context.close()
            # Older browsers without DecompressionStream retain the normal host path.
            context = browser.new_context(viewport={'width': 1280, 'height': 800})
            context.add_init_script('window.DecompressionStream = undefined')
            _, stats = ready(context.new_page())
            assert sum(entry['bytes'] for entry in stats) == release['initial_raw_bytes'], stats
            context.close()
            print(json.dumps({'cold_seconds': round(cold, 2), 'repeat_seconds': round(warm, 2), 'cold_binary_bytes': release['initial_gzip_bytes'], 'repeat_binary_bytes': 0}, ensure_ascii=False))
            print('LOADING static gzip, persistent cache, corruption recovery, denied cache and legacy fallback pass')
        finally:
            browser.close()
            server.shutdown()
            server.server_close()
            thread.join()

if __name__ == '__main__': main()
