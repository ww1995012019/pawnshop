// Measures the Web build's real WebAudio output level (regression for a silent build).
// Usage: serve play-godot/ and run: node scripts/test-godot-web-audio.js http://localhost:PORT/index.html
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
  const p = await b.newPage({viewport:{width:1600,height:900}});
  const logs=[]; p.on('console', m=>logs.push(m.type()+': '+m.text())); p.on('pageerror', e=>logs.push('ERR '+e.message));
  await p.addInitScript(() => {
    window.__probe = { ctxs: 0, levels: [] };
    const origConnect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function (dest, ...rest) {
      if (dest instanceof AudioDestinationNode && !this.__tapped) {
        this.__tapped = true;
        const an = this.context.createAnalyser(); an.fftSize = 2048;
        origConnect.call(this, an);
        const buf = new Float32Array(2048);
        setInterval(() => { an.getFloatTimeDomainData(buf); let s = 0; for (const v of buf) s += v * v; window.__probe.levels.push(Math.sqrt(s / buf.length)); window.__probe.state = this.context.state; }, 250);
      }
      return origConnect.call(this, dest, ...rest);
    };
  });
  await p.goto(process.argv[2]);
  await p.waitForTimeout(40000);
  const before = await p.evaluate(() => ({ state: window.__probe.state, n: window.__probe.levels.length, max: Math.max(0, ...window.__probe.levels) }));
  await p.mouse.click(800, 551); await p.waitForTimeout(6000);
  const after = await p.evaluate(() => { const l = window.__probe.levels.slice(-20); return { state: window.__probe.state, recentMax: Math.max(0, ...l), recentMean: l.reduce((a, b) => a + b, 0) / Math.max(1, l.length) }; });
  console.log('before click', JSON.stringify(before));
  console.log('after click ', JSON.stringify(after));
  console.log(logs.filter(l => /audio|Audio|ERR|error/i.test(l)).slice(0, 10).join('\n'));
  await b.close();
})();
