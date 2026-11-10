/* Phone shell around the Godot canvas: the game always plays in landscape.
   A phone held upright shows the same landscape picture turned a quarter turn,
   with touch positions turned back for the engine. All shop controls live in
   the game itself. */
(() => {
  'use strict';
  const coarse = matchMedia('(any-pointer: coarse)');
  const phone = () => coarse.matches && Math.min(innerWidth, innerHeight) <= 600;
  const canvas = document.getElementById('canvas');
  let turned = false;
  let state = {ready: false};

  // The engine reads clientX/clientY against the canvas box. While the canvas
  // is turned, hand it positions in the canvas's own landscape space.
  const POINTER = /^(mouse|touch|pointer|wheel|contextmenu|click|dblclick)/;
  const LISTS = new Set(['touches', 'changedTouches', 'targetTouches']);
  function turnedPoint(point) {
    return new Proxy(point, {get(target, key) {
      if (key === 'clientX') return target.clientY;
      if (key === 'clientY') return innerWidth - target.clientX;
      if (LISTS.has(key)) return Array.from(target[key], turnedPoint);
      const value = target[key];
      return typeof value === 'function' ? value.bind(target) : value;
    }});
  }
  for (const target of [canvas, window]) {
    const add = target.addEventListener.bind(target), remove = target.removeEventListener.bind(target);
    const wrapped = new Map();
    target.addEventListener = (type, listener, options) => {
      if (typeof listener !== 'function' || !POINTER.test(type)) return add(type, listener, options);
      const key = type + (options === true || options?.capture ? ':capture' : '');
      if (!wrapped.has(listener)) wrapped.set(listener, new Map());
      const byType = wrapped.get(listener);
      if (!byType.has(key)) byType.set(key, event => listener.call(target, turned ? turnedPoint(event) : event));
      return add(type, byType.get(key), options);
    };
    target.removeEventListener = (type, listener, options) => {
      const key = type + (options === true || options?.capture ? ':capture' : '');
      return remove(type, wrapped.get(listener)?.get(key) || listener, options);
    };
  }
  const nativeRect = canvas.getBoundingClientRect.bind(canvas);
  canvas.getBoundingClientRect = () => turned ? new DOMRect(0, 0, innerHeight, innerWidth) : nativeRect();

  async function fullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
      if (screen.orientation?.lock) await screen.orientation.lock('landscape');
    } catch { /* Not every browser allows it; the turned canvas still plays. */ }
  }
  // Phones always play fullscreen and landscape where the browser allows it.
  // Browsers only allow this from a user gesture, so every tap re-enters it
  // (e.g. after a back gesture).
  addEventListener('pointerup', event => {
    if (event.pointerType !== 'mouse' && phone() && !document.fullscreenElement) fullscreen();
  }, true);
  // Size the render buffer as well as the CSS box so the canvas stays sharp.
  function render() {
    turned = phone() && innerHeight > innerWidth;
    const ratio = devicePixelRatio || 1;
    const long = turned ? innerHeight : innerWidth, short = turned ? innerWidth : innerHeight;
    const width = Math.round(long * ratio), height = Math.round(short * ratio);
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    canvas.style.width = `${long}px`;
    canvas.style.height = `${short}px`;
    canvas.style.transform = turned ? `translateX(${innerWidth}px) rotate(90deg)` : '';
    document.documentElement.classList.toggle('turned', turned);
  }
  window.OrbitalTouch = {
    state,
    update(next) { state = next; this.state = next; },
    phone,
    turned: () => turned,
  };
  addEventListener('resize', render);
  coarse.addEventListener('change', render);
  render();
})();
