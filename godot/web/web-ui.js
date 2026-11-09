/* Phone controls are a view of Godot state. Only Godot can commit a trade. */
(() => {
  'use strict';
  const coarse = matchMedia('(any-pointer: coarse)');
  const phone = () => coarse.matches && Math.min(innerWidth, innerHeight) <= 600;
  const portrait = () => phone() && innerHeight > innerWidth;
  const money = value => `${Number(value).toLocaleString('en-US', {maximumFractionDigits: 2, useGrouping: false})} Cr`;
  const guide = document.createElement('div');
  guide.id = 'phone-guide'; guide.hidden = true;
  guide.setAttribute('role', 'dialog'); guide.setAttribute('aria-modal', 'true');
  guide.setAttribute('aria-labelledby', 'phone-heading');
  guide.innerHTML = `<section><h2 id="phone-heading">横过来，柜台更好操作</h2><p>点一下屏幕，游戏会全屏并自动横过来；也可以直接把手机横放。横屏后会出现大按钮操作栏，接客、鉴定和报价都可以直接点。</p><button type="button" class="touch-button primary" id="phone-fullscreen">横屏开始</button><p id="phone-orientation-note">如有需要，请先关闭手机的方向锁定。</p></section>`;
  document.body.append(guide);
  const nav = document.createElement('nav');
  nav.id = 'touch-nav'; nav.hidden = true; nav.setAttribute('aria-label', '店铺快捷操作');
  nav.innerHTML = `<button type="button" data-command="start">开门营业</button><button type="button" data-command="arrive" data-playing>接客</button><button type="button" id="trade-open" data-playing>交易</button><button type="button" data-command="page" data-page="inspect" data-playing>鉴定</button><button type="button" data-command="page" data-page="repair" data-playing>维修</button><button type="button" data-command="page" data-page="warehouse" data-playing>仓储</button><button type="button" id="touch-forge" data-playing hidden>伪装</button><button type="button" data-command="page" data-page="orders" data-playing>订单</button><button type="button" data-command="page" data-page="report" data-playing>日结</button><button type="button" id="touch-detail-open" data-playing hidden>详情</button><button type="button" id="repair-supplies-open" data-playing hidden>材料</button><button type="button" id="touch-rotate" data-playing hidden>旋转</button><button type="button" data-command="close" data-playing>收起</button>`;
  document.body.append(nav);
  const tools = document.createElement('div');
  tools.id = 'touch-tools'; tools.hidden = true;
  tools.innerHTML = `<select aria-label="鉴定仪器"><option value="">选择仪器</option><option value="TOL-001">可变焦灯镜</option><option value="TOL-002">紫外检视灯</option><option value="TOL-003">轨道光谱台</option><option value="TOL-004">双触点万用探针</option><option value="TOL-005">微重力秤</option><option value="TOL-006">脉冲测试夹</option><option value="SPEC">专属检测</option></select><button type="button" class="touch-button" data-command="flip">翻面</button><button type="button" id="touch-specific" hidden></button>`;
  nav.append(tools);
  const trade = document.createElement('dialog');
  trade.id = 'touch-trade'; trade.setAttribute('aria-labelledby', 'trade-heading');
  trade.innerHTML = `<div class="trade-header"><h2 id="trade-heading">柜台交易</h2><button type="button" id="trade-close" aria-label="关闭交易操作">收起</button></div><p id="trade-item"></p><div id="trade-prices"><output id="trade-price"></output><output id="trade-cash"></output></div><div id="trade-draft"><label for="trade-offer-input">我的还价</label><button type="button" data-nudge="-10" aria-label="减十">−10</button><button type="button" data-nudge="-1" aria-label="减一">−1</button><input type="number" inputmode="numeric" id="trade-offer-input" min="1" step="1"><button type="button" data-nudge="1" aria-label="加一">+1</button><button type="button" data-nudge="10" aria-label="加十">+10</button></div><div id="trade-actions"><button type="button" id="trade-pick" data-command="page" data-page="warehouse" class="primary">去仓储选货</button><button type="button" id="trade-offer" data-command="offer">提交还价</button><button type="button" id="trade-accept" data-command="accept" class="primary">接受报价</button><button type="button" id="trade-deliver" data-command="deliver" class="primary">确认交割</button><button type="button" data-command="refuse">送客</button></div><p id="trade-note" role="status" aria-live="polite"></p>`;
  document.body.append(trade);
  const supplies = document.createElement('dialog');
  supplies.id = 'repair-supplies'; supplies.setAttribute('aria-labelledby', 'repair-supplies-title');
  supplies.innerHTML = `<div class="trade-header"><h2 id="repair-supplies-title">维修材料</h2><button type="button" id="repair-supplies-close" class="touch-button">收起</button></div><p id="repair-supplies-note"></p><div id="repair-supplies-list"></div>`;
  document.body.append(supplies);
  const detail = document.createElement('dialog');
  detail.id = 'touch-detail'; detail.setAttribute('aria-labelledby', 'touch-detail-title');
  detail.innerHTML = `<div class="trade-header"><h2 id="touch-detail-title">物品详情</h2><button type="button" id="touch-detail-close" class="touch-button">收起</button></div><div id="touch-detail-lines"></div><div id="touch-detail-actions"><button type="button" class="touch-button" id="detail-inspect">去鉴定</button><button type="button" class="touch-button" id="detail-supplies">材料</button><button type="button" class="touch-button primary" id="detail-repair">确认修复</button></div>`;
  document.body.append(detail);
  const materialRows = new Map();
  const merchant = document.createElement('dialog');
  merchant.id = 'touch-merchant'; merchant.setAttribute('aria-labelledby', 'merchant-heading');
  merchant.innerHTML = `<div class="trade-header"><h2 id="merchant-heading">流动商人的补给</h2><button type="button" id="merchant-close">收起</button></div><p id="merchant-summary"></p><div id="merchant-goods"></div><p id="merchant-note" role="status" aria-live="polite"></p><button type="button" id="merchant-leave">送客</button>`;
  document.body.append(merchant);
  const forge = document.createElement('dialog');
  forge.id = 'touch-forge-dialog'; forge.setAttribute('aria-labelledby', 'forge-heading');
  forge.innerHTML = `<h2 id="forge-heading">伪装造假</h2><p id="forge-description"></p><div class="forge-actions"><button type="button" id="forge-cancel">取消</button><button type="button" id="forge-confirm" class="primary">确认伪装</button></div>`;
  document.body.append(forge);
  const input = document.getElementById('trade-offer-input');
  let state = {ready: false};
  let pendingSpecific = null;
  let pendingRotation = null;
  let pendingRepair = null;
  let detailKey = '';
  let pendingForge = null;
  const send = data => {
    if (typeof window.orbitalTouchSend === 'function') window.orbitalTouchSend(JSON.stringify(data));
  };
  const setDraft = value => {
    const next = Number(value);
    if (Number.isFinite(next)) {
      const clamped = Math.max(state.min, Math.min(state.max, Math.round(next)));
      input.value = String(clamped);
      send({type: 'quote', value: clamped});
    }
  };
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
  document.getElementById('trade-open').addEventListener('click', () => {
    const target = state.merchant ? merchant : trade;
    if (!target.open) target.showModal();
  });
  document.getElementById('trade-close').addEventListener('click', () => trade.close());
  document.getElementById('repair-supplies-open').addEventListener('click', () => { if (!supplies.open) supplies.showModal(); });
  document.getElementById('repair-supplies-close').addEventListener('click', () => supplies.close());
  document.getElementById('touch-detail-open').addEventListener('click', () => { if (!detail.open) detail.showModal(); });
  document.getElementById('touch-detail-close').addEventListener('click', () => detail.close());
  document.getElementById('detail-inspect').addEventListener('click', () => {
    if (state.workspace !== 'repair' || !state.repair_uid) return;
    detail.close(); send({type: 'page', page: 'inspect'});
  });
  document.getElementById('detail-supplies').addEventListener('click', () => {
    if (state.workspace !== 'repair') return;
    detail.close(); if (!supplies.open) supplies.showModal();
  });
  document.getElementById('detail-repair').addEventListener('click', event => {
    if (!state.repair_can_finish || pendingRepair) return;
    pendingRepair = {uid: state.repair_uid, notice: state.notice};
    event.currentTarget.disabled = true;
    send({type: 'finish_repair', uid: state.repair_uid});
  });
  document.getElementById('touch-rotate').addEventListener('click', event => {
    if (!state.warehouse_can_rotate || pendingRotation) return;
    pendingRotation = {uid: state.warehouse_uid, rotated: state.warehouse_rotated};
    event.currentTarget.disabled = true;
    send({type: 'rotate_warehouse', uid: state.warehouse_uid});
  });
  document.getElementById('merchant-close').addEventListener('click', () => merchant.close());
  document.getElementById('merchant-leave').addEventListener('click', () => { merchant.close(); send({type: 'refuse'}); });
  merchant.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled) return;
    send({type: button.dataset.action, id: button.dataset.id, uid: button.dataset.uid});
  });
  document.getElementById('touch-forge').addEventListener('click', () => {
    if (!state.forge_uid || state.forge_reason) return;
    pendingForge = state.forge_uid;
    document.getElementById('forge-description').textContent = `对「${state.forge_name}」做伪装，消耗导电纤维×1、合规封签×1和1 AP。真实状态不会改变；顾客可能识破，导致关系下降、风险上升。`;
    if (!forge.open) forge.showModal();
  });
  document.getElementById('forge-cancel').addEventListener('click', () => forge.close());
  document.getElementById('forge-confirm').addEventListener('click', () => {
    if (pendingForge && pendingForge === state.forge_uid) send({type: 'forge', uid: pendingForge});
    pendingForge = null; forge.close();
  });
  input.addEventListener('change', () => setDraft(input.value));
  document.querySelectorAll('[data-nudge]').forEach(button => button.addEventListener('click', () => setDraft(Number(input.value) + Number(button.dataset.nudge))));
  tools.querySelector('select').addEventListener('change', event => send({type: 'tool', tool: event.target.value}));
  document.getElementById('touch-specific').addEventListener('click', event => {
    if (!state.specific_next || pendingSpecific) return;
    pendingSpecific = {uid: state.specific_uid, index: state.specific_index, feedback: state.specific_feedback};
    event.currentTarget.disabled = true;
    send({type: 'specific_step', uid: pendingSpecific.uid, index: pendingSpecific.index});
  });
  document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.command === 'page' && trade.open) trade.close();
    send({type: button.dataset.command, page: button.dataset.page});
  }));
  // Resize the actual render buffer as well as its CSS box. Godot's full-window
  // policy otherwise stretches behind the phone toolbar and hides controls.
  // A side rail only pays off when the shop then renders larger than it would
  // above a bottom bar; short or narrow phones keep the bar.
  const RAIL_WIDTH = 168, BAR_HEIGHT = 56;
  const useRail = () => !nav.hidden &&
    Math.min((innerWidth - RAIL_WIDTH) / 1920, innerHeight / 1080) > Math.min(innerWidth / 1920, (innerHeight - BAR_HEIGHT) / 1080);
  function fitCanvas() {
    const canvas = document.getElementById('canvas');
    const box = nav.getBoundingClientRect();
    const rail = !nav.hidden && nav.classList.contains('rail');
    const cssWidth = Math.max(1, innerWidth - (rail ? box.width : 0));
    const height = Math.max(1, innerHeight - (nav.hidden || rail ? 0 : box.height));
    const ratio = devicePixelRatio || 1;
    const width = Math.round(cssWidth * ratio), pixels = Math.round(height * ratio);
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== pixels) canvas.height = pixels;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${height}px`;
  }
  function renderMerchant(unavailable) {
    const list = document.getElementById('merchant-goods');
    const scroll = merchant.scrollTop;
    const focused = list.contains(document.activeElement) && document.activeElement.matches('button[data-action]')
      ? {...document.activeElement.dataset} : null;
    list.replaceChildren();
    const label = (text, tag = 'p') => { const node = document.createElement(tag); node.textContent = text; return node; };
    const action = (text, type, data, disabled = false) => {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = text; button.dataset.action = type;
      if (data.id) button.dataset.id = data.id;
      if (data.uid) button.dataset.uid = data.uid;
      button.disabled = unavailable || disabled;
      return button;
    };
    list.append(label('常用维修材料 · 买卖不消耗 AP', 'h3'));
    for (const good of state.merchant_goods || []) {
      const row = document.createElement('div'); row.className = 'merchant-row';
      row.append(label(`${good.name} · 商人 ${good.available} / 持有 ${good.owned}`));
      row.append(action(`购买 ${money(good.price)}`, 'merchant_buy', {id: good.id}, good.available < 1 || state.cash < good.price));
      row.append(action(`出售 ${money(good.sellPrice)}`, 'merchant_sell', {id: good.id}, good.owned < 1));
      list.append(row);
    }
    list.append(label('稀有货物', 'h3'));
    if (state.merchant_rare) {
      const rare = state.merchant_rare;
      list.append(action(`购买 ${rare.name} · ${money(rare.price)} · 1 AP`, 'merchant_rare', {}, state.cash < rare.price || state.ap < 1));
    } else list.append(label('本次没有可购买的稀有货。'));
    list.append(label('出售旧物 · 按真实估值回收，每件消耗 1 AP', 'h3'));
    for (const item of state.merchant_items || []) {
      list.append(action(`出售 ${item.name} · 收 ${money(item.price)}`, 'merchant_item', {uid: item.uid}, state.ap < 1));
    }
    if (!(state.merchant_items || []).length) list.append(label('没有可回收的自有货物。'));
    document.getElementById('merchant-summary').textContent = `${state.visitor} · 现金 ${money(state.cash)} · ${state.ap} AP`;
    document.getElementById('merchant-note').textContent = state.notice || '';
    document.getElementById('merchant-leave').disabled = unavailable;
    merchant.scrollTop = scroll;
    if (focused) {
      const buttons = [...list.querySelectorAll('button[data-action]')];
      const same = buttons.find(button => !button.disabled && button.dataset.action === focused.action &&
        button.dataset.id === focused.id && button.dataset.uid === focused.uid);
      const target = same || buttons.find(button => !button.disabled) || document.getElementById('merchant-close');
      target.focus({preventScroll: !!same});
    }
  }
  function render() {
    const vertical = portrait();
    guide.hidden = !vertical;
    document.getElementById('canvas').inert = vertical;
    nav.hidden = !phone() || vertical || !state.ready;
    nav.classList.toggle('rail', useRail());
    tools.hidden = nav.hidden || state.title || state.workspace !== 'inspect';
    if (Array.isArray(state.inspection_tools)) {
      const selector = tools.querySelector('select');
      for (const option of selector.options) {
        option.hidden = option.disabled = !!option.value && !state.inspection_tools.includes(option.value);
      }
      selector.querySelector('[value="SPEC"]').textContent = state.inspection_title || '专属检测';
      selector.value = state.inspection_current || '';
      selector.disabled = !!state.blocked || !!state.busy || !!state.inspection_busy;
    }
    const specific = document.getElementById('touch-specific');
    if (pendingSpecific && (state.blocked || state.busy || state.inspection_current !== 'SPEC' ||
        state.specific_uid !== pendingSpecific.uid || state.specific_index !== pendingSpecific.index ||
        state.specific_feedback !== pendingSpecific.feedback)) pendingSpecific = null;
    specific.hidden = tools.hidden || !state.specific_next;
    specific.textContent = state.specific_reason || state.specific_next || '';
    specific.disabled = !!state.blocked || !!state.busy || !!pendingSpecific || !state.specific_allowed;
    if (vertical && trade.open) trade.close();
    if ((vertical || state.workspace !== 'repair') && supplies.open) supplies.close();
    if ((vertical || !['inspect', 'repair'].includes(state.workspace)) && detail.open) detail.close();
    if ((vertical || !state.merchant) && merchant.open) merchant.close();
    if ((vertical || state.workspace !== 'warehouse' || state.forge_uid !== pendingForge) && forge.open) forge.close();
    nav.querySelector('[data-command=start]').hidden = !state.title;
    nav.querySelector('[data-command=start]').textContent = state.has_save ? `继续营业 · 第 ${state.day} 天` : '开门营业';
    nav.querySelectorAll('[data-playing]').forEach(button => { button.hidden = !!state.title; });
    nav.querySelectorAll('[data-command="page"]').forEach(button => {
      button.hidden = !!state.title || (!!state.workspace &&
        (button.dataset.page === state.workspace || ['orders', 'report'].includes(button.dataset.page)));
    });
    nav.querySelector('[data-page="inspect"]').textContent = state.workspace === 'repair' ? '去鉴定' : '鉴定';
    const unavailable = state.blocked || state.busy;
    nav.querySelectorAll('[data-command]').forEach(button => { button.disabled = unavailable && button.dataset.command !== 'close'; });
    nav.querySelector('[data-command=arrive]').disabled = !state.can_arrive;
    nav.querySelector('[data-command=arrive]').hidden = !!state.title || !!state.trade || !!state.workspace;
    document.getElementById('trade-open').hidden = !!state.title || !state.trade || !!state.workspace;
    document.getElementById('trade-open').textContent = state.merchant ? '商人' : (state.has_item ? '交易' : '选货');
    document.getElementById('trade-open').disabled = unavailable || !!state.workspace;
    const forgeButton = document.getElementById('touch-forge');
    forgeButton.hidden = !!state.title || state.workspace !== 'warehouse' || !state.forge_uid;
    forgeButton.textContent = state.forge_done ? '已伪装' : '伪装';
    forgeButton.title = state.forge_reason || '对选中货物做伪装';
    forgeButton.disabled = unavailable || !!state.forge_reason;
    nav.querySelector('[data-command=close]').hidden = !!state.title || (!state.workspace && !state.blocked);
    const suppliesOpen = document.getElementById('repair-supplies-open');
    suppliesOpen.hidden = !!state.title || state.workspace !== 'repair';
    suppliesOpen.disabled = !!unavailable;
    const detailOpen = document.getElementById('touch-detail-open');
    detailOpen.hidden = !!state.title || !['inspect', 'repair'].includes(state.workspace);
    detailOpen.disabled = !!unavailable;
    const nextDetailKey = JSON.stringify([state.detail_title, state.detail_lines]);
    if (nextDetailKey !== detailKey) {
      detailKey = nextDetailKey;
      document.getElementById('touch-detail-title').textContent = state.detail_title || '物品详情';
      const lines = (state.detail_lines || []).map(text => {
        const paragraph = document.createElement('p'); paragraph.textContent = text; return paragraph;
      });
      document.getElementById('touch-detail-lines').replaceChildren(...lines);
    }
    if (pendingRepair && (unavailable || state.workspace !== 'repair' || state.repair_uid !== pendingRepair.uid ||
        !state.repair_can_finish || state.notice !== pendingRepair.notice)) pendingRepair = null;
    const detailInspect = document.getElementById('detail-inspect');
    detailInspect.hidden = state.workspace !== 'repair' || !state.repair_uid;
    detailInspect.disabled = !!unavailable;
    const detailSupplies = document.getElementById('detail-supplies');
    detailSupplies.hidden = state.workspace !== 'repair';
    detailSupplies.disabled = !!unavailable;
    const finishRepair = document.getElementById('detail-repair');
    finishRepair.hidden = state.workspace !== 'repair';
    finishRepair.disabled = !!unavailable || !state.repair_can_finish || !!pendingRepair;
    const rotate = document.getElementById('touch-rotate');
    if (pendingRotation && (unavailable || state.workspace !== 'warehouse' || state.warehouse_uid !== pendingRotation.uid ||
        state.warehouse_rotated !== pendingRotation.rotated || !state.warehouse_can_rotate)) pendingRotation = null;
    rotate.hidden = !!state.title || state.workspace !== 'warehouse';
    rotate.disabled = !!unavailable || !state.warehouse_can_rotate || !!pendingRotation;
    rotate.textContent = state.warehouse_rotation_pending ? '已旋转·拖动' : '旋转';
    rotate.title = state.warehouse_rotation_pending ? '拖到可容纳的空位后放开' : (state.warehouse_can_rotate ? '旋转选中的货物' : '先选中可旋转且有空位的货物');
    const materials = state.repair_materials || [];
    document.getElementById('repair-supplies-note').textContent = state.merchant
      ? '商人正在柜台，可回柜台购买。' : '商人上门时才能购买维修材料。';
    for (const material of materials) {
      let row = materialRows.get(material.id);
      if (!row) {
        row = document.createElement('div');
        row.dataset.material = material.id;
        materialRows.set(material.id, row);
        document.getElementById('repair-supplies-list').append(row);
      }
      row.textContent = `${material.name} ×${material.quantity}`;
    }
    fitCanvas();
    if (!state.trade) { if (trade.open) trade.close(); return; }
    if (state.merchant) {
      if (trade.open) trade.close();
      renderMerchant(unavailable || !!state.workspace);
      return;
    }
    trade.querySelectorAll('[data-command], #trade-draft button, #trade-draft input').forEach(control => {
      control.disabled = unavailable || !!state.workspace;
    });
    document.getElementById('trade-item').textContent = `${state.visitor} · ${state.item}`;
    document.getElementById('trade-price').textContent = state.has_item ? `${state.locked ? '已锁定' : '对方报价'} ${money(state.price)}` : '待选货';
    document.getElementById('trade-cash').hidden = !state.has_item;
    document.getElementById('trade-cash').textContent = state.has_item ? `${state.buy ? '支出' : '收入'}后余额 ${money(state.projected_cash)} · 消耗 1 AP` : '';
    document.getElementById('trade-pick').hidden = state.has_item;
    if (document.activeElement !== input) input.value = String(state.offer);
    input.min = state.min; input.max = state.max;
    document.getElementById('trade-draft').hidden = state.locked || !state.has_item;
    const accept = document.getElementById('trade-accept');
    accept.textContent = `接受 ${money(state.price)}`;
    accept.hidden = state.locked || !state.has_item; accept.disabled = unavailable || !!state.workspace || !state.can_accept;
    const offer = document.getElementById('trade-offer');
    offer.textContent = `出价 ${money(state.offer)}`;
    offer.hidden = state.locked || !state.has_item; offer.disabled = unavailable || !!state.workspace || !state.has_item;
    const deliver = document.getElementById('trade-deliver');
    deliver.textContent = `${state.buy ? '支付' : '收款'} ${money(state.price)} 并交割`;
    deliver.hidden = !state.locked || !state.has_item; deliver.disabled = unavailable || !!state.workspace || !state.can_deliver;
    document.getElementById('trade-note').textContent = !state.has_item ? '先从仓储选择符合顾客需求的自有货，再核对报价与交割金额。' : (state.notice || '接受报价只是锁价，确认交割后才扣款、转移货物。');
  }
  window.OrbitalTouch = {
    state,
    update(next) { state = next; this.state = next; render(); },
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
  new ResizeObserver(fitCanvas).observe(nav);
  render();
})();
