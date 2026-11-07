import { Color, Graphics, Mask, Node, Tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { GameUI } from './GameUI';

export interface MotionPoint { x: number; y: number }
export interface MotionRect extends MotionPoint { width: number; height: number }
export interface MotionSettings { reducedMotion?: boolean; speed?: number }
export interface AmbientBinding {
  parent?: Node; actor?: Node | null; lamp?: Node | null;
  area?: MotionRect; enabled?: boolean;
}
export interface HandoffOptions {
  size?: number; duration?: number; label?: string;
  kind?: 'arrive' | 'buy' | 'sell' | 'store';
  onPlaced?: () => void;
}
export interface DealOptions { itemId?: string; from?: MotionPoint; to?: MotionPoint }
export interface ScanOptions {
  mode?: 'magnify' | 'spectrum' | 'number'; duration?: number; label?: string;
}
interface Task {
  kind: string; elapsed: number; duration: number; ended: boolean;
  alive: () => boolean; frame: (progress: number) => void;
  complete: () => void; resolve: () => void;
}
interface TrackedNode { node: Node; kind: string }
interface Dust { node: Node; x: number; y: number; phase: number; speed: number }
const TAU = Math.PI * 2;
const GOLD = '#E7CB7F';
const TEAL = '#88D5B4';
const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));
const out = (n: number): number => 1 - Math.pow(1 - n, 3);
const smooth = (n: number): number => n * n * (3 - 2 * n);

/**
 * A presentation-only, update-driven animation director. Call update(dt) even
 * while an input gate or modal is open. No method changes inventory or money.
 * All public coordinates are top-left logical pixels at 1600 × 900. Handoff
 * from/to positions are item centres; NPC exit positions are portrait top-lefts.
 */
export class MotionDirector {
  reducedMotion = false;
  speed = 1;
  private readonly layer: Node;
  private readonly tasks: Task[] = [];
  private readonly tracked: TrackedNode[] = [];
  private readonly owned = new Set<Node>();
  private ambientParent: Node | null = null;
  private ambientLayer: Node | null = null;
  private actor: Node | null = null;
  private actorBase = new Vec3();
  private actorAngle = 0;
  private lamp: Node | null = null;
  private lampBase = 255;
  private dust: Dust[] = [];
  private glow: Node | null = null;
  private clock = 0;
  private disposed = false;

  constructor(private readonly ui: GameUI, private readonly root: Node = ui.root) {
    this.layer = ui.container(root, 0, 0, 1600, 900, 'motion-overlay');
  }

  configure(settings: MotionSettings): void {
    if (settings.speed !== undefined) this.speed = Math.min(4, Math.max(0.25, settings.speed));
    if (settings.reducedMotion !== undefined) {
      this.reducedMotion = settings.reducedMotion;
      if (this.reducedMotion) this.finish();
    }
  }

  /** Rebind after the main view redraws; the ambient clock deliberately persists. */
  bindAmbient(binding: AmbientBinding = {}): void {
    this.actor = binding.actor?.isValid ? binding.actor : null;
    if (this.actor) { this.actorBase = this.actor.position.clone(); this.actorAngle = this.actor.angle; }
    this.lamp = binding.lamp?.isValid ? binding.lamp : null;
    if (this.lamp) this.lampBase = this.opacity(this.lamp).opacity;
    const parent = binding.parent ?? this.actor?.parent ?? this.root;
    if (binding.enabled === false) { this.clearAmbient(); return; }
    if (this.ambientParent === parent && this.ambientLayer?.isValid && this.ambientLayer.parent === parent) return;
    this.clearAmbient();
    if (!parent.isValid) return;
    this.ambientParent = parent;
    const area = binding.area ?? { x: 430, y: 138, width: 690, height: 480 };
    this.ambientLayer = this.ui.container(parent, 0, 0, 1600, 900, 'shop-atmosphere');
    // A soft shaft of warm light and independent drifting dust make the scene
    // move without asking a character portrait to deform like a skeleton.
    this.glow = this.ui.container(this.ambientLayer, area.x + area.width * .66, area.y + 10, 1, 1, 'window-warmth');
    const light = this.glow.addComponent<Graphics>(Graphics);
    for (let radius = 145; radius >= 25; radius -= 20) {
      light.fillColor = this.color('#F2C46B05');
      light.ellipse(0, -80, radius * .7, radius);
      light.fill();
    }
    for (let i = 0; i < 22; i++) {
      const x = area.x + ((i * 173 + 29) % 997) / 997 * area.width;
      const y = area.y + ((i * 127 + 71) % 991) / 991 * area.height;
      const node = this.ui.container(this.ambientLayer, x, y, 4, 4, 'light-dust');
      const g = node.addComponent<Graphics>(Graphics);
      g.fillColor = this.color(i % 3 === 0 ? '#F1E7B9A0' : '#DFCB9260');
      g.circle(0, 0, i % 3 === 0 ? 1.8 : 1.1);g.fill();
      this.dust.push({ node, x, y, phase: i * 1.53, speed: 0.35 + (i % 5) * .07 });
    }
  }

  sceneEntry(): Promise<void> {
    this.top();
    const curtain = this.ui.panel(this.layer, 0, 0, 1600, 900, { fill: '#142B25', stroke: '#A98D4D', radius: 0, name: 'opening-shutter' });
    const slats = this.ui.container(curtain, 0, 0, 1600, 900, 'shutter-slats');
    const g = slats.addComponent<Graphics>(Graphics);
    for (let y = 28; y < 900; y += 48) {
      g.lineWidth = 2;g.strokeColor = this.color('#5B674944');g.moveTo(0, -y);g.lineTo(1600, -y);g.stroke();
      g.strokeColor = this.color('#061A1788');g.moveTo(0, -y - 4);g.lineTo(1600, -y - 4);g.stroke();
    }
    this.ui.label(curtain, '灰线旧货铺', 480, 340, 640, 90, { size: 58, color: '#E3CB91', align: 'center' });
    this.ui.label(curtain, '旧物有来处，灯火有归人', 480, 450, 640, 55, { size: 25, color: '#C1B889', align: 'center' });
    this.track(curtain, 'shop-shutter');
    return this.run('scene-entry', 1.05, () => curtain.isValid, p => {
      const reveal = out(clamp01((p - .15) / .85));
      curtain.setPosition(0, 980 * reveal);
      this.opacity(curtain).opacity = Math.round(255 * (1 - Math.max(0, p - .8) / .2));
    }, () => this.drop(curtain));
  }

  npcEnter(node: Node): Promise<void> {
    if (!node.isValid) return Promise.resolve();
    const destination = node.position.clone(), originalScale = node.scale.clone(), angle = node.angle;
    this.owned.add(node);this.track(node, 'npc-walk-in');
    return this.run('npc-enter', .84, () => node.isValid, p => {
      const step = Math.sin(p * Math.PI * 8) * 5 * (1 - p);
      const e = out(p);
      node.setPosition(destination.x - 230 * (1 - e), destination.y - 40 * (1 - e) + step, destination.z);
      node.setScale(originalScale.x * (.96 + .04 * e), originalScale.y * (.96 + .04 * e), originalScale.z);
      node.angle = angle + Math.sin(p * Math.PI * 8) * 1.6 * (1 - p);
      this.opacity(node).opacity = Math.round(255 * Math.min(1, p * 3));
    }, () => {
      if (node.isValid) { node.setPosition(destination);node.setScale(originalScale);node.angle = angle;this.opacity(node).opacity = 255;
        if(this.actor===node){this.actorBase=destination.clone();this.actorAngle=angle;} }
      this.owned.delete(node);this.untrack(node);
    });
  }

  npcExit(npc: number | string, from: MotionPoint = { x: 310, y: 202 }, to: MotionPoint = { x: -280, y: 245 }): Promise<void> {
    this.top();
    const actor = this.ui.portrait(this.layer, npc, from.x, from.y, 310, 465);
    this.track(actor, 'npc-walk-out');
    return this.run('npc-exit', .82, () => actor.isValid, p => {
      const e = smooth(p);
      actor.setPosition(from.x + (to.x - from.x) * e, -(from.y + (to.y - from.y) * e) + Math.sin(p * Math.PI * 8) * 4, 0);
      actor.angle = Math.sin(p * Math.PI * 8) * 1.7;
      this.opacity(actor).opacity = Math.round(255 * (1 - Math.max(0, p - .55) / .45));
    }, () => this.drop(actor));
  }

  handoff(itemId: string, from: MotionPoint, to: MotionPoint, options: HandoffOptions = {}): Promise<void> {
    this.top();
    const size = options.size ?? 180;
    const side = options.kind === 'buy' || options.kind === 'store' ? 'right' : 'left';
    const handWidth = Math.max(185, Math.min(255, size * 1.22));
    const handHeight = handWidth * 600 / 656;
    // The painted glove already includes a long, textured cuff. It reaches up
    // from below the counter; a scene-edge mask keeps the cuff off the controls.
    const rest: MotionPoint = { x: side === 'left' ? Math.min(410, from.x - 100) : Math.max(1100, to.x + 85), y: 785 };
    const shadow = this.ui.container(this.layer, from.x, from.y + size * .34, size, 20, 'moving-object-shadow');
    const sg = shadow.addComponent<Graphics>(Graphics);sg.fillColor = this.color('#0D160D88');sg.ellipse(0, 0, size * .37, size * .055);sg.fill();
    const handWindow = this.ui.container(this.layer, 0, 0, 1600, 670, 'counter-hand-window');
    handWindow.addComponent<Mask>(Mask).type = Mask.Type.GRAPHICS_RECT;
    const hand = this.ui.container(handWindow, 0, 0, handWidth, handHeight, 'handoff-glove');
    const openHand = this.ui.hand(hand, side === 'left' ? 'left_open' : 'right_open', 0, 0, handWidth, handHeight);
    const gripHand = this.ui.hand(hand, side === 'left' ? 'left_grip' : 'right_grip', 0, 0, handWidth, handHeight);
    const object = this.ui.item(this.layer, itemId, from.x - size / 2, from.y - size / 2, size, size);
    const caption = options.label ? this.ui.label(this.layer, options.label, from.x - 210, from.y + size / 2 + 8, 420, 34,
      { size: 22, color: '#F4E3AB', align: 'center' }) : null;
    this.track(object, `handoff-${options.kind ?? 'arrive'}`);this.track(shadow, 'object-contact-shadow');
    this.track(hand, `hand-${side}-open`);
    if (caption) this.track(caption, 'object-label');
    return this.run('handoff', options.duration ?? 1.04, () => object.isValid, p => {
      // Reach, grasp, carry and release have separate time segments. The object
      // starts moving only once the painted grip pose has closed around it.
      const travel = clamp01((p - .14) / .65), e = smooth(travel);
      const arc = Math.sin(travel * Math.PI) * 78;
      const x = from.x + (to.x - from.x) * e;
      const y = from.y + (to.y - from.y) * e - arc;
      object.setPosition(x - size / 2, -(y - size / 2));
      object.angle = Math.sin(travel * Math.PI) * (options.kind === 'sell' ? -7 : 6);
      const scale = 1 + Math.sin(travel * Math.PI) * .07;
      object.setScale(scale, scale, 1);
      shadow.setPosition(x, -(from.y + (to.y - from.y) * e + size * .34));
      shadow.setScale(1 - Math.sin(travel * Math.PI) * .35, 1, 1);
      this.opacity(shadow).opacity = Math.round(155 - Math.sin(travel * Math.PI) * 55);
      const contact = { x: x + (side === 'left' ? -size * .15 : size * .15), y: y + size * .18 };
      const reach = smooth(clamp01(p / .16));
      const retreat = smooth(clamp01((p - .82) / .18));
      let palmX = rest.x + (contact.x - rest.x) * reach;
      let palmY = rest.y + (contact.y - rest.y) * reach;
      palmX += (rest.x - palmX) * retreat;palmY += (rest.y - palmY) * retreat;
      const palmFractionX = side === 'left' ? .64 : .36;
      const hx = palmX - handWidth * palmFractionX;
      const hy = palmY - handHeight * .42;
      hand.setPosition(hx, -hy);
      const gripping = p >= .13 && p < .82;
      openHand.active = !gripping;gripHand.active = gripping;
      const record = this.tracked.find(r => r.node === hand);if (record)record.kind = `hand-${side}-${gripping ? 'grip' : 'open'}`;
      const handAlpha = Math.round(255 * Math.min(1, p * 10) * (1 - Math.max(0, p - .91) / .09));
      this.opacity(hand).opacity = handAlpha;
      if (caption) { caption.setPosition(x - 210, -(y + size / 2 + 12));this.opacity(caption).opacity = Math.round(255 * Math.min(1, p * 5)); }
    }, () => {
      options.onPlaced?.();
      this.drop(object);this.drop(shadow);this.drop(hand);this.drop(handWindow);
      if (caption)this.drop(caption);
    });
  }

  /** Cash, receipt and optional goods all follow visible paths after the model commits. */
  async deal(amount: number, options: DealOptions = {}): Promise<void> {
    this.top();
    const wallet = { x: 748, y: 58 }, counter = { x: 795, y: 533 };
    const from = amount >= 0 ? counter : wallet, to = amount >= 0 ? wallet : counter;
    const coins: Node[] = [];
    for (let i = 0; i < 7; i++) {
      const node = this.coin(from.x, from.y);this.track(node, 'credit-transfer');coins.push(node);
    }
    const value = this.ui.label(this.layer, `${amount > 0 ? '+' : ''}${amount} 票`, 610, 475, 370, 70,
      { size: 43, bold: true, color: amount >= 0 ? '#EBD28C' : '#E5B68A', align: 'center' });
    this.track(value, 'transaction-amount');
    const cash = this.run('cash-transfer', 1.02, () => value.isValid, p => {
      coins.forEach((coin, i) => {
        const t = clamp01((p - i * .035) / .66), e = smooth(t);
        const x = from.x + (to.x - from.x) * e + Math.sin(t * Math.PI) * (i - 3) * 17;
        const y = from.y + (to.y - from.y) * e - Math.sin(t * Math.PI) * 65;
        coin.setPosition(x, -y);coin.setScale(.8 + Math.sin(t * Math.PI) * .35, 1, 1);
        this.opacity(coin).opacity = Math.round(255 * (1 - Math.max(0, t - .88) / .12));
      });
      value.setPosition(610, -475 + out(p) * 88);
      this.opacity(value).opacity = Math.round(255 * Math.min(1, p * 6) * (1 - Math.max(0, p - .7) / .3));
    }, () => {coins.forEach(n => this.drop(n));this.drop(value);});
    const receipt = this.receipt(amount);
    const jobs = [cash, receipt];
    if (options.itemId) jobs.push(this.handoff(options.itemId, options.from ?? counter, options.to ?? { x: 975, y: 274 },
      { kind: amount >= 0 ? 'sell' : 'buy', duration: 1.02, label: amount >= 0 ? '旧物有归' : '旧物入库' }));
    await Promise.all(jobs);
  }

  stamp(text: string, at: MotionPoint = { x: 1070, y: 470 }, tone: 'success' | 'warning' = 'success'): Promise<void> {
    this.top();
    const node = this.ui.container(this.layer, at.x - 132, at.y - 55, 264, 110, 'evidence-stamp');
    const g = node.addComponent<Graphics>(Graphics);
    const c = tone === 'success' ? '#9E4B36' : '#C39145';
    g.strokeColor = this.color(c);g.lineWidth = 4;g.roundRect(4, -106, 256, 102, 13);g.stroke();
    g.lineWidth = 1;g.roundRect(13, -97, 238, 84, 8);g.stroke();
    this.ui.label(node, text, 18, 20, 228, 64, { size: 35, bold: true, color: c, align: 'center', verticalAlign: 'center' });
    this.track(node, 'evidence-stamp');
    return this.run('stamp', .94, () => node.isValid, p => {
      const land = out(clamp01(p / .22));
      node.setScale(1.55 - .55 * land, 1.55 - .55 * land, 1);node.angle = -14 + 8 * land;
      this.opacity(node).opacity = Math.round(255 * Math.min(1, p * 8) * (1 - Math.max(0, p - .72) / .28));
    }, () => this.drop(node));
  }

  scan(parent: Node, rect: MotionRect, options: ScanOptions = {}): Promise<void> {
    const node = this.ui.container(parent, rect.x, rect.y, rect.width, rect.height, 'tool-scan-effect');
    const g = node.addComponent<Graphics>(Graphics);
    const mode = options.mode ?? 'magnify';
    const label = this.ui.label(node, options.label ?? (mode === 'magnify' ? '侧光检查中' : mode === 'spectrum' ? '采样分析中' : '编号轨迹对照'), 0, rect.height + 5, rect.width, 28,
      { size: 18, color: '#CFE3B8', align: 'center' });
    this.track(node, `scan-${mode}`);
    return this.run(`scan-${mode}`, options.duration ?? 1.05, () => parent.isValid && node.isValid, p => {
      g.clear();
      const x = rect.width * (.08 + .84 * smooth(p));
      g.fillColor = this.color(mode === 'spectrum' ? '#9AC9E520' : '#D8E5A51C');
      g.rect(Math.max(0, x - 35), -rect.height, 70, rect.height);g.fill();
      g.strokeColor = this.color(mode === 'spectrum' ? '#9FE6E9' : '#EEE2A4');g.lineWidth = 2.2;
      g.moveTo(x, -9);g.lineTo(x, -rect.height + 9);g.stroke();
      // Calibrated reticle corners remain tied to the object, not the screen.
      g.lineWidth = 1.5;g.strokeColor = this.color('#DAE1ABAA');
      [[0,0,1,1],[rect.width,0,-1,1],[0,-rect.height,1,-1],[rect.width,-rect.height,-1,-1]].forEach(([a,b,sx,sy]) => {
        g.moveTo(a + sx * 22, b);g.lineTo(a, b);g.lineTo(a, b - sy * 22);g.stroke();
      });
      if (mode === 'magnify') {
        const cy = -rect.height * .51;
        g.fillColor = this.color('#CBDE9C14');g.circle(x, cy, 52);g.fill();
        g.lineWidth = 5;g.strokeColor = this.color('#E1C67D');g.circle(x, cy, 54);g.stroke();
        g.lineWidth = 9;g.moveTo(x + 38, cy - 39);g.lineTo(x + 72, cy - 74);g.stroke();
      } else if (mode === 'number') {
        for (let i = 0; i < 15; i++) {
          const lx = rect.width * .16 + i * rect.width * .045;
          g.lineWidth = i % 3 === 0 ? 4 : 2;g.strokeColor = this.color(lx <= x ? '#E2D193' : '#6A8C6E');
          g.moveTo(lx, -rect.height * .28);g.lineTo(lx, -rect.height * .72);g.stroke();
        }
      } else {
        for (let i = 0; i < 17; i++) {
          const height = 13 + Math.abs(Math.sin(i * 1.41 + p * 5)) * rect.height * .45;
          g.fillColor = this.color(i % 3 === 0 ? '#9CD6BD9F' : '#B5C58670');
          g.rect(rect.width * .08 + i * rect.width * .05, -rect.height * .85, rect.width * .027, height);g.fill();
        }
      }
      this.opacity(label).opacity = Math.round(185 + Math.sin(p * TAU) * 50);
    }, () => this.drop(node));
  }

  connect(parent: Node, from: MotionPoint, to: MotionPoint, options: { duration?: number; color?: string } = {}): Promise<void> {
    const node = this.ui.container(parent, 0, 0, 1600, 900, 'electrode-connection');
    const g = node.addComponent<Graphics>(Graphics);
    this.track(node, 'test-current');
    const control = { x: (from.x + to.x) * .5, y: Math.max(from.y, to.y) + 56 };
    const curve = (t: number): MotionPoint => ({ x: (1-t)*(1-t)*from.x+2*(1-t)*t*control.x+t*t*to.x,
      y: (1-t)*(1-t)*from.y+2*(1-t)*t*control.y+t*t*to.y });
    return this.run('wire-connect', options.duration ?? .82, () => parent.isValid && node.isValid, p => {
      g.clear();
      const length = Math.min(1, p * 2.7);
      g.lineWidth = 5;g.strokeColor = this.color('#182D24');g.moveTo(from.x,-from.y);
      for(let i=1;i<=34;i++){const c=curve(length*i/34);g.lineTo(c.x,-c.y);}g.stroke();
      g.lineWidth = 2.3;g.strokeColor = this.color(options.color ?? '#B0D5A0');g.moveTo(from.x,-from.y);
      for(let i=1;i<=34;i++){const c=curve(length*i/34);g.lineTo(c.x,-c.y);}g.stroke();
      for(let i=0;i<3;i++) {
        const t=(p*2.2+i*.3)%1;if(t>length)continue;const c=curve(t);
        g.fillColor=this.color('#F4E9A8');g.circle(c.x,-c.y,4.5);g.fill();
      }
      [from,to].forEach(c=>{g.fillColor=this.color('#D7B96C');g.circle(c.x,-c.y,8);g.fill();g.fillColor=this.color('#243F31');g.circle(c.x,-c.y,4);g.fill();});
    }, () => this.drop(node));
  }

  waveform(parent: Node, rect: MotionRect, options: { healthy?: boolean; duration?: number; label?: string } = {}): Promise<void> {
    const node=this.ui.panel(parent,rect.x,rect.y,rect.width,rect.height,{fill:'#10271EF0',stroke:'#7F9F69',radius:5,name:'load-test-waveform'});
    const wave=this.ui.container(node,0,0,rect.width,rect.height,'wave-lines');
    const g=wave.addComponent<Graphics>(Graphics);
    this.ui.label(node,options.label??'负载采样',9,5,rect.width-18,24,{size:15,color:'#D0D9A8'});
    this.track(node,'load-waveform');
    return this.run('waveform',options.duration??1.1,()=>parent.isValid&&node.isValid,p=>{
      g.clear();g.lineWidth=1;g.strokeColor=this.color('#75936B36');
      for(let x=10;x<rect.width;x+=20){g.moveTo(x,-30);g.lineTo(x,-rect.height+8);g.stroke();}
      for(let y=35;y<rect.height;y+=16){g.moveTo(8,-y);g.lineTo(rect.width-8,-y);g.stroke();}
      g.strokeColor=this.color(options.healthy===false?'#E3A169':TEAL);g.lineWidth=2.4;
      const mid=(rect.height+27)/2,amp=(rect.height-39)*.31,travel=p*TAU*2;
      for(let x=9;x<rect.width-9;x+=3){const v=Math.sin(x*.075-travel)*amp+(options.healthy===false?Math.sin(x*.27+travel)*amp*.48:0);if(x===9)g.moveTo(x,-mid-v);else g.lineTo(x,-mid-v);}g.stroke();
      const scan=9+(rect.width-18)*p;g.lineWidth=1;g.strokeColor=this.color('#F1DF9E');g.moveTo(scan,-30);g.lineTo(scan,-rect.height+8);g.stroke();
    },()=>this.drop(node));
  }

  dayTransition(day: number, closing = false): Promise<void> {
    this.top();
    const veil=this.ui.panel(this.layer,0,0,1600,900,{fill:'#101E18',stroke:'#7C754A',radius:0,name:'day-transition'});
    const title=this.ui.label(veil,closing?'今日打烊':`第 ${day} 天 · 开门营业`,350,330,900,95,{size:55,color:'#E1CA8D',align:'center'});
    this.ui.label(veil,closing?'把今天的故事，留在账本里':'窗外仍有风，柜台又有新的故事',350,448,900,60,{size:26,color:'#BDB68F',align:'center'});
    this.track(veil,'day-veil');
    return this.run('day-transition',1.18,()=>veil.isValid,p=>{
      const alpha=p<.24?p/.24:p>.76?(1-p)/.24:1;
      this.opacity(veil).opacity=Math.round(255*alpha);
      title.setPosition(350,-330-12*smooth(clamp01((p-.2)/.6)));
    },()=>this.drop(veil));
  }

  update(dt: number): void {
    if(this.disposed)return;
    const delta=Math.max(0,Math.min(.1,dt));this.clock+=delta;
    for(const task of [...this.tasks]){
      if(task.ended)continue;
      if(!task.alive()){this.end(task,false);continue;}
      task.elapsed+=delta*this.speed;
      const p=this.reducedMotion?1:Math.min(1,task.elapsed/task.duration);
      task.frame(p);if(p>=1)this.end(task,false);
    }
    this.updateAmbient();
  }

  /** Skip presentation to its final visual state; every pending promise resolves once. */
  finish(): void {for(const task of [...this.tasks])this.end(task,true);}

  reset(): void {
    this.finish();
    this.clearAmbient();this.actor=null;this.lamp=null;
    for(const child of [...this.layer.children])this.drop(child);
    this.tracked.length=0;this.owned.clear();
  }

  dispose(): void {
    if(this.disposed)return;
    this.reset();this.disposed=true;this.drop(this.layer);
  }

  snapshot(): { phase: string; activeCount: number; busy:boolean; nodes: {id:string;kind:string;x:number;y:number;opacity:number}[]; ambientClock:number } {
    const origin=this.root.worldPosition;
    const nodes=this.tracked.filter(record=>record.node.isValid).slice(0,60).map(record=>{
      const p=record.node.worldPosition;
      return {id:record.node.uuid,kind:record.kind,x:p.x-origin.x,y:origin.y-p.y,opacity:record.node.getComponent<UIOpacity>(UIOpacity)?.opacity??255};
    });
    if(this.actor?.isValid){const p=this.actor.worldPosition;nodes.push({id:this.actor.uuid,kind:'npc-breath',x:p.x-origin.x,y:origin.y-p.y,opacity:this.actor.getComponent<UIOpacity>(UIOpacity)?.opacity??255});}
    return {phase:this.tasks[this.tasks.length-1]?.kind??'idle',activeCount:this.tasks.length,busy:this.tasks.length>0,nodes,ambientClock:this.clock};
  }

  private run(kind:string,duration:number,alive:()=>boolean,frame:(p:number)=>void,complete:()=>void):Promise<void>{
    if(this.disposed){complete();return Promise.resolve();}
    let resolvePromise:()=>void=()=>{};
    const result=new Promise<void>(resolve=>{resolvePromise=resolve;});
    const task:Task={kind,duration:Math.max(.01,duration),elapsed:0,ended:false,alive,frame,complete,resolve:resolvePromise};
    this.tasks.push(task);
    if(this.reducedMotion)this.end(task,true);else if(alive())frame(0);else this.end(task,false);
    return result;
  }
  private end(task:Task,toEnd:boolean):void{
    if(task.ended)return;task.ended=true;
    if(toEnd&&task.alive())task.frame(1);
    try{task.complete();}finally{const index=this.tasks.indexOf(task);if(index>=0)this.tasks.splice(index,1);task.resolve();}
  }
  private top():void {if(this.layer.isValid)this.layer.setSiblingIndex(this.root.children.length-1);}
  private track(node:Node,kind:string):void{this.tracked.push({node,kind});}
  private untrack(node:Node):void{for(let i=this.tracked.length-1;i>=0;i--)if(this.tracked[i].node===node)this.tracked.splice(i,1);}
  private opacity(node:Node):UIOpacity{return node.getComponent<UIOpacity>(UIOpacity)??node.addComponent<UIOpacity>(UIOpacity);}
  private color(value:string):Color{return new Color().fromHEX(value);}
  private drop(node:Node):void{
    this.untrack(node);
    if(!node.isValid)return;
    this.stopTree(node);node.removeFromParent();node.destroy();
  }
  private stopTree(node:Node):void{
    Tween.stopAllByTarget(node);const opacity=node.getComponent<UIOpacity>(UIOpacity);if(opacity)Tween.stopAllByTarget(opacity);
    node.children.forEach(child=>this.stopTree(child));
  }
  private clearAmbient():void{
    if(this.ambientLayer?.isValid)this.drop(this.ambientLayer);
    this.ambientLayer=null;this.ambientParent=null;this.glow=null;this.dust=[];
  }
  private updateAmbient():void{
    if(this.actor?.isValid&&!this.owned.has(this.actor)){
      this.actor.setPosition(this.actorBase.x,this.actorBase.y+(this.reducedMotion?0:Math.sin(this.clock*1.75)*1.4),this.actorBase.z);
      this.actor.angle=this.actorAngle+(this.reducedMotion?0:Math.sin(this.clock*1.2)*.32);
    }
    if(this.lamp?.isValid)this.opacity(this.lamp).opacity=this.reducedMotion?this.lampBase:Math.round(this.lampBase*(.89+.11*Math.sin(this.clock*1.3)));
    if(this.glow?.isValid)this.opacity(this.glow).opacity=this.reducedMotion?160:Math.round(180+Math.sin(this.clock*.8)*52);
    this.dust.forEach(p=>{
      if(!p.node.isValid)return;
      p.node.active=!this.reducedMotion;
      if(!this.reducedMotion){p.node.setPosition(p.x+Math.sin(this.clock*p.speed+p.phase)*17,-p.y+Math.cos(this.clock*p.speed*.7+p.phase)*20);this.opacity(p.node).opacity=Math.round(130+Math.sin(this.clock*.5+p.phase)*90);}
    });
  }
  private coin(x:number,y:number):Node{
    const node=this.ui.container(this.layer,x,y,20,20,'credit-token');const g=node.addComponent<Graphics>(Graphics);
    g.fillColor=this.color('#A97C33');g.circle(0,-2,11);g.fill();g.fillColor=this.color('#E5C56E');g.circle(0,0,10);g.fill();
    g.lineWidth=1.5;g.strokeColor=this.color('#8D672D');g.circle(0,0,7);g.stroke();g.moveTo(0,-4);g.lineTo(0,4);g.stroke();return node;
  }
  private receipt(amount:number):Promise<void>{
    const receipt=this.ui.panel(this.layer,1225,115,285,212,{fill:'#EADAB3',stroke:'#927342',radius:2,name:'printed-receipt'});
    this.ui.label(receipt,'灰线商行 · 交易凭证',16,16,253,30,{size:20,color:'#69552E',align:'center'});
    this.ui.line(receipt,18,58,267,58,'#8D774C66',1);
    this.ui.label(receipt,`${amount>=0?'销售入账':'旧物收购'}\n${amount>0?'+':''}${amount} 票`,23,77,239,80,{size:26,color:'#40543A',align:'center'});
    const seal=this.ui.container(receipt,150,147,105,44,'receipt-seal');const sg=seal.addComponent<Graphics>(Graphics);
    sg.lineWidth=3;sg.strokeColor=this.color('#A34E39');sg.roundRect(1,-42,102,40,4);sg.stroke();
    this.ui.label(seal,'已结清',6,4,90,32,{size:23,color:'#A34E39',align:'center'});
    this.track(receipt,'receipt-print');
    return this.run('receipt-print',1.2,()=>receipt.isValid,p=>{
      const reveal=out(clamp01(p/.38));receipt.setPosition(1225,-115+(1-reveal)*145);receipt.angle=(1-reveal)*7;
      this.opacity(receipt).opacity=Math.round(255*Math.min(1,p*6)*(1-Math.max(0,p-.85)/.15));
      const stamp=out(clamp01((p-.44)/.14));seal.setScale(1.5-.5*stamp,1.5-.5*stamp,1);seal.angle=-8;
      this.opacity(seal).opacity=Math.round(255*stamp);
    },()=>this.drop(receipt));
  }
}
