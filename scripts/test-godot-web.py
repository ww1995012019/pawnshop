#!/usr/bin/env python3
"""Check an actual Web release, including audible output after a user gesture."""
import argparse
import json
import os
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright


PROBE = """mute => {
  window.__audioProbe = {levels: [], state: 'uninitialized'};
  const connect = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function(destination, ...args) {
    if (destination instanceof AudioDestinationNode && !this.__observed) {
      this.__observed = true;
      const analyser = this.context.createAnalyser();
      analyser.fftSize = 2048;
      if (mute) {
        const gain = this.context.createGain(); gain.gain.value = 0;
        connect.call(this, gain); connect.call(gain, analyser);
        connect.call(analyser, destination);
      } else {
        connect.call(this, analyser);
        connect.call(this, destination, ...args);
      }
      const buffer = new Float32Array(2048);
      setInterval(() => {
        analyser.getFloatTimeDomainData(buffer);
        let sum = 0; for (const value of buffer) sum += value * value;
        window.__audioProbe.levels.push(Math.sqrt(sum / buffer.length));
        if (window.__audioProbe.levels.length > 200) window.__audioProbe.levels.shift();
        window.__audioProbe.state = this.context.state;
      }, 100);
      return destination;
    }
    return connect.call(this, destination, ...args);
  };
}"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url", nargs="?", default="http://127.0.0.1:4174/")
    parser.add_argument("--mute-output", action="store_true", help="Fault injection: must fail the audio assertion")
    parser.add_argument("--screenshots", type=Path, default=Path("work/godot-browser"))
    args = parser.parse_args()
    args.screenshots.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get("CHROMIUM_EXECUTABLE") or shutil.which("chromium"),
            args=["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
        try:
            context = browser.new_context(viewport={"width":1600,"height":900})
            page = context.new_page()
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("console", lambda message: errors.append(message.text) if
                    (message.type == 'error' or 'SCRIPT ERROR' in message.text) and
                    'browser metadata to extension' not in message.text else None)
            page.add_init_script(f"({PROBE})({str(args.mute_output).lower()});")
            page.goto(args.url)
            page.wait_for_function("window.OrbitalTouch?.state?.ready", timeout=90000)
            page.wait_for_function("document.getElementById('loader') === null", timeout=10000)
            assert page.locator('#touch-nav').is_hidden(), "Phone navigation must not cover the desktop"
            page.screenshot(path=str(args.screenshots / '01-desktop-title.png'))
            page.mouse.click(800,551)
            page.wait_for_function("!window.OrbitalTouch.state.title && !window.OrbitalTouch.state.busy",timeout=15000)
            page.wait_for_timeout(2500)
            audio = page.evaluate("({state:__audioProbe.state,max:Math.max(0,...__audioProbe.levels.slice(-20)),samples:__audioProbe.levels.length})")
            print('Audio output:',json.dumps(audio),flush=True)
            assert audio['state'] == 'running', 'AudioContext did not resume after the user gesture'
            assert audio['samples'] >= 10 and audio['max'] > 0.0001, 'Audio output is silent (RMS <= 0.0001)'
            page.screenshot(path=str(args.screenshots / '02-desktop-shop.png'))
            page.mouse.click(450,525)
            page.wait_for_function("window.OrbitalTouch.state.trade && !window.OrbitalTouch.state.busy",timeout=15000)
            page.mouse.move(800,650)
            page.screenshot(path=str(args.screenshots / '03-desktop-quote.png'))
            page.mouse.click(1370,532)
            page.wait_for_function("window.OrbitalTouch.state.workspace === 'inspect'",timeout=10000)
            page.screenshot(path=str(args.screenshots / '04-desktop-inspection.png'))
            page.keyboard.press('Escape')
            page.wait_for_function("window.OrbitalTouch.state.workspace === ''")
            assert page.evaluate("window.OrbitalTouch.state.trade"), 'Closing equipment lost the visitor'
            assert not errors, 'Browser/Godot errors: ' + '\n'.join(errors[:10])
            resources = page.evaluate("performance.getEntriesByType('resource').filter(r=>/\\.wasm|\\.pck/.test(r.name)).map(r=>({name:r.name.split('/').pop(),transfer:r.encodedBodySize,decoded:r.decodedBodySize}))")
            print('Web resources:',json.dumps(resources),flush=True)
            print('WEB desktop, workspace and real audio output pass')
        finally:
            browser.close()


if __name__ == "__main__":
    main()
