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

  // The engine reads clientX/clientY against the canvas box. Hand it positions
  // in the canvas's own landscape space while the canvas is turned, and move a
  // finger that lands just beside a small button onto it. The game decides
  // where each new touch lands; the same shift then follows that finger.
  const POINTER = /^(mouse|touch|pointer|wheel|contextmenu|click|dblclick)/;
  const LISTS = new Set(['touches', 'changedTouches', 'targetTouches']);
  const shifts = new Map();
  const inCanvas = point => turned ? [point.clientY, innerWidth - point.clientX] : [point.clientX, point.clientY];
  function place(touch) {
    const [x, y] = inCanvas(touch);
    let shift = [0, 0];
    try {
      window.orbitalPlacedX = window.orbitalPlacedY = null;
      window.orbitalTouchPlace?.(x, y);
      if (Number.isFinite(window.orbitalPlacedX) && Number.isFinite(window.orbitalPlacedY)) shift = [window.orbitalPlacedX - x, window.orbitalPlacedY - y];
    } catch { /* The game is still loading: leave the touch where it is. */ }
    shifts.set(touch.identifier, shift);
  }
  canvas.addEventListener('touchstart', event => { for (const touch of event.changedTouches) place(touch); }, true);
  for (const type of ['touchend', 'touchcancel']) {
    addEventListener(type, event => {
      const done = Array.from(event.changedTouches, touch => touch.identifier);
      setTimeout(() => done.forEach(id => shifts.delete(id)));
    }, true);
  }
  function turnedPoint(point) {
    return new Proxy(point, {get(target, key) {
      if (key === 'clientX' || key === 'clientY') {
        const shift = shifts.get(target.identifier) || [0, 0];
        return key === 'clientX' ? inCanvas(target)[0] + shift[0] : inCanvas(target)[1] + shift[1];
      }
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
      if (!byType.has(key)) byType.set(key, event => listener.call(target, turned || shifts.size ? turnedPoint(event) : event));
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
