import {
  assetManager, BlockInputEvents, Button, Color, EventTouch, Font, Graphics,
  ImageAsset, Label, Layers, Node, Rect, resources, Size, Sprite, SpriteFrame,
  Texture2D, Tween, tween, UIOpacity, UITransform, Vec2, Vec3,
} from 'cc';

/** Native Creator UI. Every public rectangle uses a top-left origin, in design pixels. */
export type UIColour = string | Color;
export type ButtonTone = 'gold' | 'green' | 'danger' | 'quiet';
export interface UIAssets {
  frames?: Map<string, SpriteFrame>;
  font?: Font | null;
  remoteRoot?: string;
  /** Direct PNGs for the source-engine Web preview; editor builds use resources. */
  standalone?: boolean;
}
export interface NodeOptions { name?: string; opacity?: number }
export interface PanelOptions extends NodeOptions {
  fill?: UIColour; stroke?: UIColour; radius?: number; lineWidth?: number; shadow?: boolean;
}
export interface LabelOptions extends NodeOptions {
  size?: number; color?: UIColour; align?: 'left' | 'center' | 'right';
  bold?: boolean; lineHeight?: number; overflow?: 'shrink' | 'clamp' | 'resize';
  verticalAlign?: 'top' | 'center' | 'bottom'; wrap?: boolean;
}
export interface ButtonOptions extends NodeOptions {
  tone?: ButtonTone; size?: number; disabled?: boolean; selected?: boolean; focused?: boolean;
}
export interface ImageOptions extends NodeOptions {
  fit?: 'contain' | 'cover' | 'stretch'; tint?: UIColour;
}
export interface PortraitOptions extends ImageOptions { crop?: 'full' | 'head' }
export interface ModalOptions {
  width?: number; height?: number; onClose?: () => void; disableClose?: boolean;
}
export interface ModalHandle { overlay: Node; body: Node; close: () => void }
export interface PaperOptions extends NodeOptions { kind?: 'note' | 'receipt'; tint?: UIColour }
export type HandPose = 'left_open' | 'left_grip' | 'right_open' | 'right_grip';
export type UIIcon = 'watch' | 'purse' | 'keys' | 'seal' | 'inspect' | 'notes' | 'deal' | 'refuse';

interface ButtonView {
  component: Button; visual: Node; graphics: Graphics; edge: Graphics; skin: Sprite | null; text: Label;
  width: number; height: number; tone: ButtonTone;
  selected: boolean; focused: boolean; hovered: boolean; pressed: boolean; disabled: boolean;
}
interface AtlasRect { x: number; y: number; w: number; h: number }

export const UI_PALETTE = {
  ink: '#182A25', inkDeep: '#101E1B', panel: '#20382F', panelLight: '#2A4439',
  gold: '#D7AE66', goldLight: '#F1D291', paper: '#E7D5AC',
  text: '#F3E4BE', muted: '#B9B798', red: '#BA6650', line: '#89754A',
};

const ART_KEYS = [
  'shop', 'items', 'characters', 'cabinet', 'frame-dialogue', 'frame-actions',
  'folio', 'ui-icons', 'manual-book', 'notice-board', 'receipt-paper', 'commission', 'hands',
] as const;
const INITIAL_ART_KEYS = ['shop', 'items', 'characters', 'notice-board', 'frame-actions', 'frame-dialogue', 'receipt-paper', 'cabinet', 'ui-icons', 'hands'] as const;
const ICON_NAMES: UIIcon[] = ['watch', 'purse', 'keys', 'seal', 'inspect', 'notes', 'deal', 'refuse'];
const NPC_IDS = ['lin', 'zhou', 'tao', 'wen', 'que', 'kou'];
const ITEM_RECTS: AtlasRect[] = Array.from({ length: 12 }, (_, index) => ({
  x: index % 4 * 362, y: Math.floor(index / 4) * 362, w: 362, h: 362,
}));
// The old release intentionally gives the wide radio a larger crop.
ITEM_RECTS[6] = { x: 714, y: 362, w: 420, h: 362 };

/** Drawing components have no touch listeners. Only buttons and modal blockers intercept input. */
export class GameUI {
  readonly root: Node;
  readonly frames: Map<string, SpriteFrame>;
  font: Font | null;
  reducedMotion = false;
  private readonly remoteRoot: string;
  private readonly standalone: boolean;
  private readonly remoteArtExt: 'png' | 'webp';
  private readonly pendingFrames = new Map<string, Promise<SpriteFrame>>();
  private readonly buttons = new WeakMap<Node, ButtonView>();
  private readonly crops = new Map<string, SpriteFrame>();
  private readonly slicedFrames = new Map<string, SpriteFrame>();
  private readonly coverFrames = new WeakMap<SpriteFrame, Map<string, SpriteFrame>>();
  private readonly toastLayer: Node;
  private focusedButton: Node | null = null;
  private pendingToasts = 0;

  constructor(root: Node, assets: UIAssets = {}) {
    this.root = root;
    this.frames = assets.frames ?? new Map<string, SpriteFrame>();
    this.font = assets.font ?? null;
    this.remoteRoot = (assets.remoteRoot ?? './resources').replace(/\/$/, '');
    const host = globalThis as typeof globalThis & {
      __GREYLINE_WEB__?: boolean; __GREYLINE_ART_EXT__?: 'png' | 'webp';
    };
    this.standalone = assets.standalone ?? Boolean(host.__GREYLINE_WEB__);
    this.remoteArtExt = host.__GREYLINE_ART_EXT__ === 'webp' ? 'webp' : 'png';
    const transform = root.getComponent<UITransform>(UITransform) ?? root.addComponent<UITransform>(UITransform);
    transform.setAnchorPoint(0, 1);
    transform.setContentSize(1600, 900);
    root.layer = Layers.Enum.UI_2D;
    this.toastLayer = this.container(root, 0, 0, 1600, 900, '_ui-toasts');
  }

  async preload(): Promise<void> {
    await Promise.all(INITIAL_ART_KEYS.map(key => this.ensureFrame(key)));
    if (!this.font && !this.standalone) {
      // The standalone page waits for its CSS @font-face before starting the engine.
      this.font = await new Promise<Font | null>(resolve => {
        resources.load<Font>('fonts/greyline-serif', Font, (error, font) => resolve(error ? null : font));
      });
    }
  }

  /** Optional gallery / future screens can explicitly warm every retained art asset. */
  async preloadAll(): Promise<void> {
    await this.preload();
    await Promise.all(ART_KEYS.map(key => this.ensureFrame(key)));
  }

  container(parent: Node, x: number, y: number, width: number, height: number, name = 'container'): Node {
    const node = new Node(name);
    node.layer = Layers.Enum.UI_2D;
    node.parent = parent;
    node.addComponent<UITransform>(UITransform).setAnchorPoint(0, 1);
    this.translate(node, x, y, width, height);
    // Main redraws append a fresh background; keep existing notifications above it.
    if (this.toastLayer && parent === this.root) this.toastLayer.setSiblingIndex(parent.children.length - 1);
    return node;
  }

  translate(node: Node, x: number, y: number, width: number, height: number): Node {
    const transform = node.getComponent<UITransform>(UITransform) ?? node.addComponent<UITransform>(UITransform);
    transform.setAnchorPoint(0, 1);
    transform.setContentSize(width, height);
    node.setPosition(x, -y, 0);
    return node;
  }

  panel(parent: Node, x: number, y: number, width: number, height: number, options: PanelOptions = {}): Node {
    const node = this.container(parent, x, y, width, height, options.name ?? 'panel');
    const radius = options.radius ?? 9;
    const graphics = node.addComponent<Graphics>(Graphics);
    if (options.shadow) {
      graphics.fillColor = colour('#00000055');
      graphics.roundRect(4, -height - 6, width, height, radius);
      graphics.fill();
    }
    graphics.fillColor = colour(options.fill ?? UI_PALETTE.panel);
    graphics.roundRect(0, -height, width, height, radius);
    graphics.fill();
    const lineWidth = options.lineWidth ?? 1.5;
    if (lineWidth > 0) {
      graphics.lineWidth = lineWidth;
      graphics.strokeColor = colour(options.stroke ?? UI_PALETTE.line);
      graphics.roundRect(lineWidth / 2, -height + lineWidth / 2, width - lineWidth, height - lineWidth, radius);
      graphics.stroke();
    }
    if (lineWidth > 0 && radius > 0 && width >= 100 && height >= 45) this.panelDetail(node, width, height, colour(options.fill ?? UI_PALETTE.panel));
    this.opacity(node, options.opacity);
    return node;
  }

  label(parent: Node, text: string, x: number, y: number, width: number, height: number, options: LabelOptions = {}): Node {
    const node = this.container(parent, x, y, width, height, options.name ?? 'label');
    const label = node.addComponent<Label>(Label);
    label.string = text;
    label.fontSize = options.size ?? 22;
    label.lineHeight = options.lineHeight ?? Math.ceil(label.fontSize * 1.4);
    label.color = colour(options.color ?? UI_PALETTE.text);
    label.horizontalAlign = options.align === 'center' ? Label.HorizontalAlign.CENTER
      : options.align === 'right' ? Label.HorizontalAlign.RIGHT : Label.HorizontalAlign.LEFT;
    label.verticalAlign = options.verticalAlign === 'center' ? Label.VerticalAlign.CENTER
      : options.verticalAlign === 'bottom' ? Label.VerticalAlign.BOTTOM : Label.VerticalAlign.TOP;
    label.overflow = options.overflow === 'resize' ? Label.Overflow.RESIZE_HEIGHT
      : options.overflow === 'clamp' ? Label.Overflow.CLAMP : Label.Overflow.SHRINK;
    label.enableWrapText = options.wrap ?? true;
    label.isBold = options.bold ?? false;
    if (this.font) {
      label.font = this.font;
      label.useSystemFont = false;
    } else {
      label.useSystemFont = true;
      label.fontFamily = 'Greyline Serif, Noto Serif SC, serif';
    }
    this.opacity(node, options.opacity);
    return node;
  }

  button(parent: Node, text: string, x: number, y: number, width: number, height: number,
    onClick: (event?: EventTouch) => void, options: ButtonOptions = {}): Node {
    const node = this.container(parent, x, y, width, height, options.name ?? `button-${text}`);
    const visual = this.container(node, 0, 0, width, height, 'button-visual');
    const graphics = visual.addComponent<Graphics>(Graphics);
    const painted = width >= 104 && height >= 39 ? this.actionSkin(visual, options.tone ?? 'gold', width, height) : null;
    const edge = this.container(visual, 0, 0, width, height, 'button-edge').addComponent<Graphics>(Graphics);
    const inset = painted ? Math.min(width * 0.17, height * 0.4 + 5) : 10;
    const textNode = this.label(visual, text, inset, 0, width - inset * 2, height, {
      size: options.size ?? 22, bold: true, align: 'center', verticalAlign: 'center', wrap: false,
    });
    const label = textNode.getComponent<Label>(Label)!;
    const component = node.addComponent<Button>(Button);
    component.transition = Button.Transition.NONE;
    component.interactable = !options.disabled;
    const view: ButtonView = {
      component, visual, graphics, edge, skin: painted, text: label, width, height,
      tone: options.tone ?? 'gold', selected: options.selected ?? false,
      disabled: options.disabled ?? false, focused: options.focused ?? false, hovered: false, pressed: false,
    };
    this.buttons.set(node, view);
    this.drawButton(view);
    node.on(Node.EventType.MOUSE_ENTER, () => { if (!view.disabled) view.hovered = true; this.drawButton(view); });
    node.on(Node.EventType.MOUSE_LEAVE, () => { view.hovered = false; this.drawButton(view); });
    node.on(Node.EventType.TOUCH_START, () => {
      if (view.disabled) return;
      view.pressed = true;
      this.drawButton(view);
      this.pressButton(view, true);
    });
    const release = (): void => {
      view.pressed = false;
      this.drawButton(view);
      this.pressButton(view, false);
    };
    node.on(Node.EventType.TOUCH_CANCEL, release);
    node.on(Node.EventType.TOUCH_END, release);
    node.on(Button.EventType.CLICK, (_button: Button, event?: EventTouch) => {
      if (!view.disabled) onClick(event);
    });
    this.opacity(node, options.opacity);
    return node;
  }

  setButtonEnabled(node: Node, enabled: boolean): void {
    const view = this.buttons.get(node);
    if (!view) return;
    view.disabled = !enabled;
    view.component.interactable = enabled;
    view.pressed = false;
    if (!enabled) {
      view.hovered = false; view.focused = false;
      if (this.focusedButton === node) this.focusedButton = null;
    }
    this.pressButton(view, false);
    this.drawButton(view);
  }

  setButtonSelected(node: Node, selected: boolean): void {
    const view = this.buttons.get(node);
    if (!view) return;
    view.selected = selected;
    this.drawButton(view);
  }

  /** Native focus treatment for gamepad / keyboard navigation owned by the scene. */
  focusButton(node: Node | null): void {
    if (this.focusedButton?.isValid) {
      const previous = this.buttons.get(this.focusedButton);
      if (previous) { previous.focused = false; this.drawButton(previous); }
    }
    this.focusedButton = node && !this.buttons.get(node)?.disabled ? node : null;
    if (this.focusedButton) {
      const current = this.buttons.get(this.focusedButton);
      if (current) { current.focused = true; this.drawButton(current); }
    }
  }

  image(parent: Node, key: string, x: number, y: number, width: number, height: number, options: ImageOptions = {}): Node {
    const normalized = key.replace(/^art\//, '').replace(/\.(png|jpg|webp)$/, '');
    return this.frame(parent, this.frames.get(normalized), x, y, width, height, options);
  }

  imageSprite(parent: Node, key: string, x: number, y: number, width: number, height: number, options: ImageOptions = {}): Node {
    return this.image(parent, key, x, y, width, height, options);
  }

  item(parent: Node, itemId: string, x: number, y: number, width: number, height: number, options: ImageOptions = {}): Node {
    const index = Number(itemId.replace(/^I/i, '')) - 1;
    const rect = ITEM_RECTS[index];
    const frame = rect ? this.cropFrame('items', `item-${itemId}`, rect) : undefined;
    return this.frame(parent, frame, x, y, width, height, { name: `item-${itemId}`, ...options });
  }

  itemSprite(parent: Node, itemId: string, x: number, y: number, width: number, height: number, options: ImageOptions = {}): Node {
    return this.item(parent, itemId, x, y, width, height, options);
  }

  portrait(parent: Node, npc: number | string, x: number, y: number, width: number, height: number, options: PortraitOptions = {}): Node {
    const index = typeof npc === 'number' ? npc : NPC_IDS.indexOf(npc);
    const frame = index >= 0 && index < 6 ? this.cropFrame('characters', `npc-${index}-${options.crop ?? 'full'}`, {
      x: index * 362, y: 0, w: 362, h: options.crop === 'head' ? 390 : 724,
    }) : undefined;
    return this.frame(parent, frame, x, y, width, height, { name: `npc-${npc}`, ...options });
  }

  /** A native Sprite view with aspect-preserving fit. It never registers touch listeners. */
  frame(parent: Node, spriteFrame: SpriteFrame | undefined, x: number, y: number,
    width: number, height: number, options: ImageOptions = {}): Node {
    const node = this.container(parent, x, y, width, height, options.name ?? 'image');
    if (!spriteFrame) return node;
    let displayFrame = spriteFrame;
    let frameWidth = spriteFrame.rect.width;
    let frameHeight = spriteFrame.rect.height;
    const fit = options.fit ?? 'contain';
    if (fit === 'cover' && width > 0 && height > 0) {
      const targetRatio = width / height;
      const currentRatio = frameWidth / frameHeight;
      const cropWidth = currentRatio > targetRatio ? frameHeight * targetRatio : frameWidth;
      const cropHeight = currentRatio > targetRatio ? frameHeight : frameWidth / targetRatio;
      const cropKey = `${width}:${height}`;
      let sourceCrops = this.coverFrames.get(spriteFrame);
      if (!sourceCrops) { sourceCrops = new Map<string, SpriteFrame>(); this.coverFrames.set(spriteFrame, sourceCrops); }
      let coverFrame = sourceCrops.get(cropKey);
      if (!coverFrame) {
        coverFrame = this.makeFrame(spriteFrame.texture, {
          x: spriteFrame.rect.x + (frameWidth - cropWidth) / 2,
          y: spriteFrame.rect.y + (frameHeight - cropHeight) / 2,
          w: cropWidth, h: cropHeight,
        });
        sourceCrops.set(cropKey, coverFrame);
      }
      displayFrame = coverFrame;
      frameWidth = cropWidth;
      frameHeight = cropHeight;
    }
    const scale = fit === 'stretch' ? 1 : Math.min(width / frameWidth, height / frameHeight);
    const drawWidth = fit === 'stretch' ? width : frameWidth * scale;
    const drawHeight = fit === 'stretch' ? height : frameHeight * scale;
    const picture = this.container(node, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight, 'sprite');
    const sprite = picture.addComponent<Sprite>(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    sprite.spriteFrame = displayFrame;
    if (options.tint) sprite.color = colour(options.tint);
    this.opacity(node, options.opacity);
    return node;
  }

  line(parent: Node, x1: number, y1: number, x2: number, y2: number, color: UIColour = UI_PALETTE.line, width = 1): Node {
    const node = this.container(parent, 0, 0, 1600, 900, 'line');
    const graphics = node.addComponent<Graphics>(Graphics);
    graphics.lineWidth = width;
    graphics.strokeColor = colour(color);
    graphics.moveTo(x1, -y1);
    graphics.lineTo(x2, -y2);
    graphics.stroke();
    return node;
  }

  progress(parent: Node, value: number, x: number, y: number, width: number, height = 8, color: UIColour = UI_PALETTE.gold): Node {
    const node = this.panel(parent, x, y, width, height, { fill: '#0A1714', lineWidth: 0, radius: height / 2 });
    const amount = Math.min(1, Math.max(0, value));
    if (amount > 0) this.panel(node, 0, 0, Math.max(height, width * amount), height, { fill: color, lineWidth: 0, radius: height / 2 });
    return node;
  }

  /** Keep transient toast notifications alive when the main screen is rebuilt. */
  clear(parent: Node): void {
    for (const child of [...parent.children]) {
      if (child === this.toastLayer) continue;
      this.stopMotionTree(child);
      child.removeFromParent();
      child.destroy();
    }
    if (this.toastLayer.parent === parent) this.toastLayer.setSiblingIndex(parent.children.length - 1);
  }

  modal(title: string, options: ModalOptions = {}): ModalHandle {
    const width = options.width ?? 1500;
    const height = options.height ?? 830;
    const overlay = this.panel(this.root, 0, 0, 1600, 900, {
      name: 'modal-overlay', fill: '#07130EEB', lineWidth: 0, radius: 0,
    });
    overlay.addComponent<BlockInputEvents>(BlockInputEvents);
    const surface = this.panel(overlay, (1600 - width) / 2, (900 - height) / 2, width, height, {
      name: 'modal-surface', fill: '#152B24', stroke: '#C7A25E', radius: 11, lineWidth: 2, shadow: true,
    });
    this.actionSkin(surface, 'green', width - 12, 77, 6, 4);
    this.ornament(surface, 4, height - 29, 26, 26);
    this.ornament(surface, width - 30, height - 29, 26, 26);
    this.line(surface, 15, 91, 15, height - 22, '#815C31', 4);
    this.line(surface, width - 15, 91, width - 15, height - 22, '#815C31', 4);
    this.label(surface, title, 63, 17, width - 174, 43, { size: 30, bold: true, color: UI_PALETTE.goldLight });
    this.line(surface, 27, 79, width - 27, 79, '#D2B5716B');
    const body = this.container(surface, 32, 91, width - 64, height - 117, 'modal-body');
    let closed = false;
    const close = (): void => {
      if (closed) return;
      closed = true;
      this.animateOut(surface, () => {
        if (overlay.isValid) { overlay.removeFromParent(); overlay.destroy(); }
        options.onClose?.();
      });
    };
    if (!options.disableClose) this.button(surface, '×', width - 72, 19, 40, 38, close, { tone: 'quiet', size: 31 });
    this.animateIn(surface);
    return { overlay, body, close };
  }

  toast(message: string, tone: 'info' | 'success' | 'error' = 'info'): Node {
    this.toastLayer.setSiblingIndex(this.root.children.length - 1);
    const slot = this.pendingToasts++;
    const width = Math.min(960, Math.max(380, message.length * 23 + 64));
    const node = this.panel(this.toastLayer, (1600 - width) / 2, 86 + (slot % 4) * 66, width, 54, {
      name: 'toast', fill: '#162C25F5', stroke: tone === 'error' ? UI_PALETTE.red : UI_PALETTE.gold,
      radius: 8, shadow: true,
    });
    this.label(node, message, 22, 6, width - 44, 42, { size: 22, align: 'center', verticalAlign: 'center', color: UI_PALETTE.text });
    const opacity = node.getComponent<UIOpacity>(UIOpacity) ?? node.addComponent<UIOpacity>(UIOpacity);
    opacity.opacity = this.reducedMotion ? 255 : 0;
    const notification = tween<UIOpacity>(opacity);
    if (!this.reducedMotion) notification.to(0.16, { opacity: 255 });
    notification.delay(2.7).to(0.3, { opacity: 0 }).call(() => {
      if (node.isValid) node.destroy();
      this.pendingToasts = Math.max(0, this.pendingToasts - 1);
    }).start();
    return node;
  }

  animateIn(node: Node, delay = 0): void {
    const opacity = node.getComponent<UIOpacity>(UIOpacity) ?? node.addComponent<UIOpacity>(UIOpacity);
    if (this.reducedMotion) {
      Tween.stopAllByTarget(node);
      Tween.stopAllByTarget(opacity);
      opacity.opacity = 255;
      return;
    }
    opacity.opacity = 0;
    const destination = node.position.clone();
    node.setPosition(destination.x, destination.y - 24, destination.z);
    node.setScale(0.985, 0.985, 1);
    tween<Node>(node).delay(delay).to(0.26, { position: destination, scale: new Vec3(1, 1, 1) }, { easing: 'cubicOut' }).start();
    tween<UIOpacity>(opacity).delay(delay).to(0.22, { opacity: 255 }).start();
  }

  /** Native painted-paper note: the clip and seal are not stretched across a HUD label. */
  paper(parent: Node, x: number, y: number, width: number, height: number, options: PaperOptions = {}): Node {
    const node = this.container(parent, x, y, width, height, options.name ?? 'paper');
    const receipt = options.kind === 'receipt';
    const source = this.cropFrame('receipt-paper', receipt ? 'paper-receipt' : 'paper-note', receipt
      ? { x: 0, y: 0, w: 1122, h: 1402 } : { x: 105, y: 115, w: 900, h: 880 });
    if (source) this.sliced(node, source, 0, 0, width, height, receipt
      ? { left: 118, right: 118, top: 185, bottom: 265, scale: Math.min(width / 1122, height / 1402) }
      : { left: 70, right: 70, top: 70, bottom: 70, scale: Math.min(0.38, height / 260) }, options.tint);
    else this.panel(node, 0, 0, width, height, { fill: UI_PALETTE.paper, stroke: UI_PALETTE.gold, radius: 3 });
    this.opacity(node, options.opacity); return node;
  }

  icon(parent: Node, name: UIIcon, x: number, y: number, width: number, height: number): Node {
    const index = ICON_NAMES.indexOf(name);
    return this.frame(parent, this.cropFrame('ui-icons', `icon-${name}`, {
      x: index % 4 * 443.5, y: Math.floor(index / 4) * 443.5, w: 443.5, h: 443.5,
    }), x, y, width, height, { name: `icon-${name}`, fit: 'contain' });
  }

  /** Four illustrated glove poses, cropped at the source sheet's exact pixel boundaries. */
  hand(parent: Node, pose: HandPose, x: number, y: number, width: number, height: number, options: ImageOptions = {}): Node {
    const poses: Record<HandPose, AtlasRect> = {
      left_open: { x: 0, y: 0, w: 656, h: 599 },
      left_grip: { x: 656, y: 0, w: 656, h: 599 },
      right_open: { x: 0, y: 599, w: 656, h: 600 },
      right_grip: { x: 656, y: 599, w: 656, h: 600 },
    };
    return this.frame(parent, this.cropFrame('hands', `hand-${pose}`, poses[pose]), x, y, width, height,
      { name: `hand-${pose}`, fit: 'contain', ...options });
  }

  /** Keeps the oval cap, paper centre and ink bottle at their original proportions. */
  dialogueFrame(parent: Node, x: number, y: number, width: number, height: number): Node {
    const node = this.container(parent, x, y, width, height, 'dialogue-frame');
    const source = this.frames.get('frame-dialogue');
    if (source) this.sliced(node, source, 0, 0, width, height, { left: 650, right: 522, top: 185, bottom: 185, scale: height / 724 });
    else this.paper(node, 0, 0, width, height);
    return node;
  }

  cabinetCell(parent: Node, slot: number, x: number, y: number, width: number, height: number): Node {
    const index = Math.max(0, Math.min(11, slot));
    return this.frame(parent, this.cropFrame('cabinet', `cabinet-${index}`, {
      x: index % 4 * 362, y: Math.floor(index / 4) * 362, w: 362, h: 362,
    }), x, y, width, height, { name: `cabinet-cell-${slot}`, fit: 'stretch' });
  }

  ornament(parent: Node, x: number, y: number, width = 24, height = 24): Node {
    return this.frame(parent, this.cropFrame('frame-actions', 'brass-fixing', { x: 34, y: 32, w: 124, h: 124 }), x, y, width, height, { name: 'brass-fixing', fit: 'contain' });
  }

  animateOut(node: Node, completed: () => void, duration = 0.2): void {
    if (!node.isValid || this.reducedMotion) { completed(); return; }
    const opacity = node.getComponent<UIOpacity>(UIOpacity) ?? node.addComponent<UIOpacity>(UIOpacity);
    Tween.stopAllByTarget(node); Tween.stopAllByTarget(opacity);
    tween<Node>(node).to(duration, { position: new Vec3(node.position.x, node.position.y - 18, node.position.z), scale: new Vec3(0.985, 0.985, 1) }, { easing: 'quadIn' }).start();
    tween<UIOpacity>(opacity).to(duration, { opacity: 0 }).call(completed).start();
  }

  private stopMotionTree(node: Node): void {
    for (const child of node.children) this.stopMotionTree(child);
    Tween.stopAllByTarget(node);
    const opacity = node.getComponent<UIOpacity>(UIOpacity); if (opacity) Tween.stopAllByTarget(opacity);
  }

  private actionSkin(parent: Node, tone: ButtonTone, width: number, height: number, x = 0, y = 0): Sprite | null {
    const rows: Record<ButtonTone, number> = { green: 0, gold: 1, quiet: 2, danger: 3 };
    const source = this.cropFrame('frame-actions', `action-${tone}`, { x: 0, y: rows[tone] * 313.5, w: 1254, h: 313.5 });
    if (!source) return null;
    const skin = this.sliced(parent, source, x, y, width, height, { left: 172, right: 172, top: 63, bottom: 63, scale: height / 313.5 });
    return skin.getChildByName('sliced-sprite')?.getComponent<Sprite>(Sprite) ?? null;
  }

  private sliced(parent: Node, source: SpriteFrame, x: number, y: number, width: number, height: number,
    caps: { left: number; right: number; top: number; bottom: number; scale: number }, tint?: UIColour): Node {
    const key = `${source.rect.x}:${source.rect.y}:${source.rect.width}:${source.rect.height}:${caps.left}:${caps.right}:${caps.top}:${caps.bottom}`;
    let sliced = this.slicedFrames.get(key);
    if (!sliced) {
      sliced = this.makeFrame(source.texture, { x: source.rect.x, y: source.rect.y, w: source.rect.width, h: source.rect.height });
      sliced.insetLeft = caps.left; sliced.insetRight = caps.right; sliced.insetTop = caps.top; sliced.insetBottom = caps.bottom;
      this.slicedFrames.set(key, sliced);
    }
    const node = this.container(parent, x, y, width, height, 'painted-skin');
    const scale = Math.max(0.01, Math.min(caps.scale, width / (caps.left + caps.right + 1), height / (caps.top + caps.bottom + 1)));
    const picture = this.container(node, 0, 0, width / scale, height / scale, 'sliced-sprite'); picture.setScale(scale, scale, 1);
    const sprite = picture.addComponent<Sprite>(Sprite); sprite.type = Sprite.Type.SLICED; sprite.sizeMode = Sprite.SizeMode.CUSTOM; sprite.spriteFrame = sliced;
    if (tint) sprite.color = colour(tint);
    return node;
  }

  private panelDetail(node: Node, width: number, height: number, fill: Color): void {
    const paper = fill.r + fill.g + fill.b > 450;
    if (paper && width > 180 && height > 85 && this.frames.has('receipt-paper')) {
      this.frame(node, this.cropFrame('receipt-paper', 'panel-paper-grain', { x: 170, y: 170, w: 750, h: 780 }), 3, 3, width - 6, height - 6, { fit: 'cover', opacity: 0.23 });
    }
    const detail = this.container(node, 0, 0, width, height, 'panel-detail').addComponent<Graphics>(Graphics);
    detail.lineWidth = 1; detail.strokeColor = colour(paper ? '#87653538' : '#DAC28B35');
    detail.roundRect(5, -height + 5, width - 10, height - 10, 5); detail.stroke();
    const corner = Math.min(15, height * 0.18); detail.strokeColor = colour(paper ? '#8E6B3B88' : '#C8A56677');
    for (const [x, y, dx, dy] of [[9, -9, 1, -1], [width - 9, -9, -1, -1], [9, -height + 9, 1, 1], [width - 9, -height + 9, -1, 1]]) {
      detail.moveTo(x + dx * corner, y); detail.lineTo(x, y); detail.lineTo(x, y + dy * corner); detail.stroke();
      detail.fillColor = colour(paper ? '#A4834B88' : '#C9A66A'); detail.circle(x, y, 1.4); detail.fill();
    }
  }

  private opacity(node: Node, value?: number): void {
    if (value === undefined) return;
    (node.getComponent<UIOpacity>(UIOpacity) ?? node.addComponent<UIOpacity>(UIOpacity)).opacity = Math.round(value <= 1 ? value * 255 : value);
  }

  private pressButton(view: ButtonView, pressed: boolean): void {
    Tween.stopAllByTarget(view.visual);
    if (this.reducedMotion) {
      view.visual.setScale(1, 1, 1);
      view.visual.setPosition(0, 0, 0);
      return;
    }
    const scale = pressed ? 0.985 : 1;
    tween<Node>(view.visual).to(pressed ? 0.08 : 0.16, {
      scale: new Vec3(scale, scale, 1),
      position: new Vec3(view.width * (1 - scale) / 2, pressed ? -2 : 0, 0),
    }, { easing: 'quadOut' }).start();
  }

  private drawButton(view: ButtonView): void {
    const colors: Record<ButtonTone, [string, string, string]> = {
      gold: ['#9D6B2D', '#D6A65B', '#F8E5B7'],
      green: ['#3D6551', '#6B9172', '#F3E4BE'],
      danger: ['#744536', '#AE6D51', '#F7E2BA'],
      quiet: ['#24392F', '#3C5646', '#E1CEA4'],
    };
    const [normal, hover, text] = colors[view.tone];
    const fill = view.disabled ? '#364038' : view.pressed ? '#94723E' : view.hovered ? hover : normal;
    const border = view.disabled ? '#555D4E' : view.selected || view.focused || view.hovered ? '#F9E2A5' : '#9D8554';
    const graphics = view.graphics;
    graphics.clear();
    // Painted skins already contain their full textured interior and silhouette.
    // Keep the generated fill inset so alpha cut-outs around the metal stay clear.
    graphics.fillColor = colour(fill);
    if (view.skin) graphics.roundRect(12, -view.height + 9, view.width - 24, view.height - 18, 4);
    else graphics.roundRect(0, -view.height, view.width, view.height, 7);
    graphics.fill();
    if (!view.skin) {
      graphics.lineWidth = view.selected || view.focused || view.hovered ? 2.5 : 1.5;
      graphics.strokeColor = colour(border);
      graphics.roundRect(1, -view.height + 1, view.width - 2, view.height - 2, 7);
      graphics.stroke();
    }
    if (!view.skin && (view.selected || view.focused)) {
      graphics.lineWidth = 1;
      graphics.strokeColor = colour('#F9E2A588');
      graphics.roundRect(5, -view.height + 5, view.width - 10, view.height - 10, 4);
      graphics.stroke();
    }
    if (view.skin) view.skin.color = colour(view.disabled ? '#6F7665' : view.pressed ? '#C5A875' : view.hovered || view.focused || view.selected ? '#FFFFFF' : '#E2DEC7');
    const edge = view.edge; edge.clear();
    if (view.focused || view.selected || view.hovered) {
      edge.lineWidth = view.focused ? 2.5 : 1.5; edge.strokeColor = colour(view.focused ? '#FFF3BBDD' : '#F9E2A577');
      edge.roundRect(6, -view.height + 6, view.width - 12, view.height - 12, 4); edge.stroke();
    }
    view.text.color = colour(view.disabled ? '#A29C80' : text);
  }

  private cropFrame(key: string, name: string, rect: AtlasRect): SpriteFrame | undefined {
    const source = this.frames.get(key);
    if (!source) return undefined;
    let frame = this.crops.get(name);
    if (!frame) {
      frame = this.makeFrame(source.texture, rect);
      this.crops.set(name, frame);
    }
    return frame;
  }

  private makeFrame(texture: SpriteFrame['texture'], rect: AtlasRect): SpriteFrame {
    const frame = new SpriteFrame();
    frame.texture = texture;
    // Creator 3.8.8 SpriteFrame._calculateUV uses rect.y / texture.height as top UV.
    // atlas.json is also top-origin, so no height-y-h inversion belongs here.
    frame.rect = new Rect(rect.x, rect.y, rect.w, rect.h);
    frame.originalSize = new Size(rect.w, rect.h);
    frame.offset = new Vec2(0, 0);
    frame.rotated = false;
    frame.packable = false;
    return frame;
  }

  private async loadFrame(key: string): Promise<SpriteFrame> {
    if (!this.standalone) {
      const bundled = await new Promise<SpriteFrame | null>(resolve => {
        try {
          resources.load<SpriteFrame>(`art/${key}/spriteFrame`, SpriteFrame, (error, frame) => resolve(error ? null : frame));
        } catch { resolve(null); }
      });
      if (bundled) return bundled;
    }
    const image = await new Promise<ImageAsset>((resolve, reject) => {
      assetManager.loadRemote<ImageAsset>(`${this.remoteRoot}/art/${key}.${this.remoteArtExt}`, (error, imageAsset) => {
        if (error) reject(new Error(`无法加载美术资源 ${key}: ${error.message}`));
        else resolve(imageAsset);
      });
    });
    const texture = new Texture2D();
    texture.image = image;
    return this.makeFrame(texture, { x: 0, y: 0, w: image.width, h: image.height });
  }

  private ensureFrame(key: string): Promise<SpriteFrame> {
    const existing = this.frames.get(key);
    if (existing) return Promise.resolve(existing);
    const pending = this.pendingFrames.get(key);
    if (pending) return pending;
    const promise = this.loadFrame(key).then(frame => {
      this.frames.set(key, frame);
      return frame;
    }).finally(() => { this.pendingFrames.delete(key); });
    this.pendingFrames.set(key, promise);
    return promise;
  }
}

function colour(value: UIColour): Color {
  return typeof value === 'string' ? new Color().fromHEX(value) : value.clone();
}
