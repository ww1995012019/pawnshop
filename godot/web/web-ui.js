/* The game always uses landscape on a touch phone. Upright browsers display
   the same canvas rotated clockwise and inputs use its unrotated CSS space. */
(() => {
  'use strict';
  const coarse = matchMedia('(any-pointer: coarse)');
  const phone = () => coarse.matches && Math.min(innerWidth, innerHeight) <= 600;
  const canvas = document.getElementById('canvas');
  let turned = false;
  let displayWidth = innerWidth, displayHeight = innerHeight;
  let pendingRender = false;
  const activeTouches = new Set();
  let state = {ready: false};
  const safeProbe = document.createElement('div');
  safeProbe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
  document.body.appendChild(safeProbe);

  // The engine reads clientX/clientY against the canvas box. Hand it positions
  // in the canvas's own landscape space while the canvas is turned, and move a
  // finger that lands just beside a small button onto it. The game decides
  // where each new touch lands; the same shift then follows that finger.
  const POINTER = /^(mouse|touch|pointer|wheel|contextmenu|click|dblclick)/;
  const LISTS = new Set(['touches', 'changedTouches', 'targetTouches']);
  const shifts = new Map();
  const toCanvas = (x, y) => turned ? [y, displayWidth - x] : [x, y];
  const toPhysical = (x, y) => turned ? [displayWidth - y, x] : [x, y];
  const inCanvas = point => toCanvas(point.clientX, point.clientY);
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
  canvas.addEventListener('touchstart', event => {
    for (const touch of event.changedTouches) { activeTouches.add(touch.identifier); place(touch); }
  }, true);
  for (const type of ['touchend', 'touchcancel']) {
    addEventListener(type, event => {
      const done = Array.from(event.changedTouches, touch => touch.identifier).filter(id => activeTouches.has(id));
      if (!done.length) return;
      // Engine listeners must receive the release using the original mapping.
      setTimeout(() => {
        done.forEach(id => { shifts.delete(id); activeTouches.delete(id); });
        if (!activeTouches.size) {
          if (pendingRender) render();
          if (type === 'touchend' && phone()) fullscreen();
        }
      });
    }, true);
  }
  function turnedPoint(point) {
    return new Proxy(point, {get(target, key) {
      if (key === 'clientX' || key === 'clientY') {
        const shift = shifts.get(target.identifier) || [0, 0];
        return key === 'clientX' ? inCanvas(target)[0] + shift[0] : inCanvas(target)[1] + shift[1];
      }
      if (turned && ['movementX', 'movementY', 'deltaX', 'deltaY'].includes(key)) {
        const horizontal = key.endsWith('X'), prefix = key.startsWith('delta') ? 'delta' : 'movement';
        return horizontal ? target[prefix + 'Y'] : -target[prefix + 'X'];
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
  canvas.getBoundingClientRect = () => turned ? new DOMRect(0, 0, displayHeight, displayWidth) : nativeRect();

  async function fullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    } catch { /* Fullscreen is optional; CSS rotation works without it. */ }
    try {
      await screen.orientation?.lock?.('landscape');
    } catch { /* Unsupported orientation locks use the rotated canvas. */ }
  }
  // Size the render buffer as well as the CSS box so the canvas stays sharp.
  function render() {
    if (activeTouches.size) { pendingRender = true; return; }
    pendingRender = false;
    displayWidth = innerWidth; displayHeight = innerHeight;
    turned = phone() && displayHeight > displayWidth;
    const safe = getComputedStyle(safeProbe);
    const insets = [safe.paddingLeft,safe.paddingTop,safe.paddingRight,safe.paddingBottom].map(value => parseFloat(value) || 0);
    window.OrbitalTouch.safeInsets = turned ? [insets[1], insets[2], insets[3], insets[0]] : insets;
    const ratio = devicePixelRatio || 1;
    const long = turned ? displayHeight : displayWidth, short = turned ? displayWidth : displayHeight;
    window.OrbitalTouch.effectiveSize = [long, short];
    const width = Math.round(long * ratio), height = Math.round(short * ratio);
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    canvas.style.width = `${long}px`;
    canvas.style.height = `${short}px`;
    canvas.style.transform = turned ? `translateX(${displayWidth}px) rotate(90deg)` : '';
    document.documentElement.classList.toggle('turned', turned);
  }
  window.OrbitalTouch = {
    state,
    update(next) { state = next; this.state = next; window.OrbitalReader?.update(next); },
    phone,
    toPhysical,
    toCanvas,
    turned: () => turned,
  };
  addEventListener('resize', render);
  document.addEventListener('fullscreenchange', render);
  screen.orientation?.addEventListener('change', render);
  coarse.addEventListener('change', render);
  render();
})();

// The reading view follows the active Godot sheet. Its controls keep their DOM
// identity while prices, dialogue, and enabled states change under keyboard focus.
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const host = byId('reader-ui');
  if (!host) return;
  const canvas = byId('canvas'), entry = byId('reader-entry'), panel = byId('reader-panel');
  const heading = byId('reader-heading'), exit = byId('reader-exit'), actions = byId('reader-actions');
  const copy = byId('reader-copy'), context = byId('reader-context'), balance = byId('reader-balance');
  const elements = new Map(), returnFocus = new Map();
  let view = null, opened = false, keyboardRow = null;

  function setText(element, value) {
    if (element.textContent !== value) element.textContent = value;
  }
  function open() {
    if (!view || opened) return;
    opened = true;
    host.classList.add('reading');
    canvas.setAttribute('inert', '');
    if (view.dialog) panel.setAttribute('aria-modal', 'true');
    exit.tabIndex = 0;
    for (const {control} of elements.values()) control.tabIndex = 0;
    heading.focus();
  }
  function close() {
    if (!opened) return;
    opened = false;
    host.classList.remove('reading');
    canvas.removeAttribute('inert');
    panel.removeAttribute('aria-modal');
    exit.tabIndex = -1;
    for (const {control} of elements.values()) control.tabIndex = -1;
    canvas.focus({preventScroll: true});
  }
  function send(id, change = {}) {
    window.orbitalTouchSend?.(JSON.stringify({type: 'reader', id, ...change}));
  }
  function create(item) {
    const button = item.kind === 'button';
    const control = document.createElement(button ? 'button' : item.kind === 'select' ? 'select' : 'input');
    const row = button ? control : document.createElement('label');
    const label = button ? control : document.createElement('span');
    if (!button) row.append(label, control);
    control.dataset.key = item.id;
    control.tabIndex = opened ? 0 : -1;
    if (button) {
      control.type = 'button';
      control.addEventListener('click', () => { open(); send(item.id); });
    } else if (item.kind === 'select') {
      control.addEventListener('change', () => send(item.id, {value: control.selectedIndex}));
    } else {
      control.type = item.kind;
      if (item.kind === 'number') control.inputMode = 'numeric';
      control.addEventListener('input', () => send(item.id, {value: item.kind === 'range' ? control.valueAsNumber : control.value}));
    }
    return {row, label, control};
  }
  function sync(item, element) {
    const {control, label} = element;
    setText(label, item.name);
    control.disabled = Boolean(item.disabled);
    if ('pressed' in item) control.setAttribute('aria-pressed', String(item.pressed));
    else control.removeAttribute('aria-pressed');
    if (item.kind === 'select') {
      const signature = JSON.stringify(item.options);
      if (element.options !== signature) {
        control.replaceChildren(...item.options.map(choice => {
          const option = new Option(choice.name);
          option.disabled = choice.disabled;
          return option;
        }));
        element.options = signature;
      }
      control.selectedIndex = item.value;
    } else if (item.kind !== 'button') {
      for (const attr of ['min', 'max', 'step']) if (attr in item) control[attr] = item[attr];
      if (control !== document.activeElement || item.kind === 'range') {
        if (control.value !== String(item.value)) control.value = item.value;
      }
    }
  }
  // The pinned engine sets a lower-case inputmode expando before focusing its
  // native keyboard field. Reflect it using the actual HTML attribute.
  function labelKeyboard(field) {
    let row = null;
    if ((field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) &&
        field.parentElement === canvas.parentElement) {
      if (typeof field.inputmode === 'string') field.inputMode = field.inputmode;
      const inputs = view?.controls.filter(i => i.kind === 'number' || i.kind === 'text') || [];
      const current = inputs.find(i => i.id === view.editing) || (inputs.length === 1 ? inputs[0] : null);
      if (current) {
        field.setAttribute('aria-label', current.name);
        if (!opened) row = elements.get(current.id)?.row;
      } else field.removeAttribute('aria-label');
    }
    if (row !== keyboardRow) {
      if (keyboardRow) keyboardRow.hidden = false;
      if (row) row.hidden = true;
      keyboardRow = row;
    }
  }
  document.addEventListener('focusin', event => labelKeyboard(event.target));
  document.addEventListener('focusout', () => queueMicrotask(() => labelKeyboard(document.activeElement)));
  actions.addEventListener('focusin', event => {
    if (view && event.target.dataset.key) returnFocus.set(view.id, event.target.dataset.key);
  });
  entry.addEventListener('click', open);
  exit.addEventListener('click', close);
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape' && opened) {
      event.preventDefault();
      event.stopPropagation();
      if (view.dialog) {
        send(view.id, {dismiss: true});
        return;
      }
      close();
    }
  });
  function update(state) {
    if (!state.reader) return;
    const next = state.reader, changed = next.id !== view?.id;
    const hadFocus = panel.contains(document.activeElement);
    view = next;
    host.hidden = false;
    host.classList.toggle('at-title', Boolean(state.title && !state.blocked));
    panel.setAttribute('role', next.dialog ? 'dialog' : 'region');
    if (next.dialog && opened) panel.setAttribute('aria-modal', 'true');
    else panel.removeAttribute('aria-modal');
    setText(heading, next.title);
    setText(balance, state.title ? '' : `第 ${state.day} 天 · 现金 ${state.cash} Cr · ${state.ap} AP`);
    setText(context, state.title || next.dialog ? '' : [state.visitor, state.dialogue_line || state.notice].filter(Boolean).join(' · '));
    setText(copy, next.copy.join('\n'));
    const ids = new Set(next.controls.map(i => i.id));
    for (const [id, {row}] of elements) {
      if (!ids.has(id)) { row.remove(); elements.delete(id); }
    }
    let position = actions.firstElementChild;
    for (const item of next.controls) {
      if (!elements.has(item.id)) elements.set(item.id, create(item));
      const element = elements.get(item.id);
      sync(item, element);
      if (element.row !== position) actions.insertBefore(element.row, position);
      position = element.row.nextElementSibling;
    }
    if (opened && (changed || (hadFocus && !panel.contains(document.activeElement)))) {
      const previous = elements.get(returnFocus.get(next.id))?.control;
      if (previous && !previous.disabled) previous.focus();
      else heading.focus();
      panel.scrollTop = 0;
    }
    if (returnFocus.size > 32) returnFocus.delete(returnFocus.keys().next().value);
    labelKeyboard(document.activeElement);
  }
  window.OrbitalReader = {open, update};
})();
