/* Phone shell around the Godot canvas: portrait guide, fullscreen landscape and
   a canvas that fills the screen. All shop controls live in the game itself. */
(() => {
  'use strict';
  const coarse = matchMedia('(any-pointer: coarse)');
  const phone = () => coarse.matches && Math.min(innerWidth, innerHeight) <= 600;
  const portrait = () => phone() && innerHeight > innerWidth;
  const guide = document.createElement('div');
  guide.id = 'phone-guide'; guide.hidden = true;
  guide.setAttribute('role', 'dialog'); guide.setAttribute('aria-modal', 'true');
  guide.setAttribute('aria-labelledby', 'phone-heading');
  guide.innerHTML = `<section><h2 id="phone-heading">横过来，柜台更好操作</h2><p>点一下屏幕，游戏会全屏并自动横过来；也可以直接把手机横放。店里的服务铃、报价机、鉴定仪和工作台都可以直接点。</p><button type="button" class="touch-button primary" id="phone-fullscreen">横屏开始</button><p id="phone-orientation-note">如有需要，请先关闭手机的方向锁定。</p></section>`;
  document.body.append(guide);
  let state = {ready: false};
  async function fullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
      if (screen.orientation?.lock) await screen.orientation.lock('landscape');
    } catch {
      document.getElementById('phone-orientation-note').textContent = '请关闭方向锁定后，将手机横放；当前浏览器可直接横屏游玩。';
    }
  }
  document.getElementById('phone-fullscreen').addEventListener('click', fullscreen);
  // Phones always play fullscreen and landscape. Browsers only allow this from
  // a user gesture, so every tap re-enters it (e.g. after a back gesture).
  addEventListener('pointerup', event => {
    if (event.pointerType !== 'mouse' && phone() && !document.fullscreenElement) fullscreen();
  }, true);
  // Size the render buffer as well as the CSS box so the canvas stays sharp.
  function fitCanvas() {
    const canvas = document.getElementById('canvas');
    const ratio = devicePixelRatio || 1;
    const width = Math.round(innerWidth * ratio), height = Math.round(innerHeight * ratio);
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
  }
  function render() {
    const vertical = portrait();
    guide.hidden = !vertical;
    document.getElementById('canvas').inert = vertical;
    fitCanvas();
  }
  window.OrbitalTouch = {
    state,
    update(next) { state = next; this.state = next; },
    whenLandscape() {
      render();
      if (!portrait()) return Promise.resolve();
      return new Promise(resolve => {
        const check = () => { render(); if (!portrait()) { removeEventListener('resize', check); resolve(); } };
        addEventListener('resize', check);
      });
    },
  };
  addEventListener('resize', render);
  coarse.addEventListener('change', render);
  render();
})();
