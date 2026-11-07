import {Button,EventMouse,EventTouch,game,Node} from 'cc';

export interface PointerBindingOptions {
  cursor?:'pointer'|'grab'|'default'|'text';
  draggable?:boolean;
  disabled?:()=>boolean;
}
interface PointerBinding {
  node:Node;options:PointerBindingOptions;hovered:boolean;order:number;
  events:Array<[string,(event?:EventTouch|EventMouse)=>void]>;
}

/** One cursor owner for the native Creator canvas; no DOM interface or input geometry. */
export class PointerCursor {
  private readonly bindings=new Map<Node,PointerBinding>();
  private canvas:HTMLCanvasElement|null=null;
  private drag:PointerBinding|null=null;
  private order=0;
  private disposed=false;
  private readonly resetFromWindow=()=>this.reset();
  private readonly finishFromWindow=()=>{this.drag=null;this.apply();};
  private readonly visibilityChanged=()=>{if(document.hidden)this.reset();};
  private readonly canvasMoved=(event:PointerEvent)=>{if(this.drag&&event.buttons===0){this.drag=null;this.apply();}};

  constructor(private readonly root:Node){
    this.connectCanvas();
    if(typeof window!=='undefined'){
      window.addEventListener('blur',this.resetFromWindow);
      window.addEventListener('pointerup',this.finishFromWindow);
      window.addEventListener('pointercancel',this.resetFromWindow);
      document.addEventListener('visibilitychange',this.visibilityChanged);
    }
    root.once(Node.EventType.NODE_DESTROYED,()=>this.dispose());
  }

  bind(node:Node,options:PointerBindingOptions={}):()=>void {
    this.unbind(node);
    if(this.disposed)return()=>{};
    const binding:PointerBinding={node,options,hovered:false,order:0,events:[]};
    const listen=(event:string,callback:(event?:EventTouch|EventMouse)=>void)=>{node.on(event,callback);binding.events.push([event,callback]);};
    const enter=()=>{binding.hovered=true;binding.order=++this.order;this.apply();};
    const leave=()=>{binding.hovered=false;this.apply();};
    const press=(event?:EventTouch|EventMouse)=>{
      // Native touch/mouse events bubble from hotspot buttons inside the object.
      // Those keep their button cursor instead of starting the parent's drag.
      if(this.interactiveDescendant(event?.target,node))return;
      if(options.draggable&&!options.disabled?.()&&this.eligible(binding))this.drag=binding;
      this.apply();
    };
    const release=()=>{if(this.drag===binding)this.drag=null;this.apply();};
    listen(Node.EventType.MOUSE_ENTER,enter);listen(Node.EventType.MOUSE_MOVE,enter);listen(Node.EventType.MOUSE_LEAVE,leave);
    if(options.draggable){
      listen(Node.EventType.TOUCH_START,press);listen(Node.EventType.MOUSE_DOWN,press);
      listen(Node.EventType.TOUCH_END,release);listen(Node.EventType.MOUSE_UP,release);
      listen(Node.EventType.TOUCH_CANCEL,()=>{binding.hovered=false;release();});
    }
    listen(Node.EventType.PARENT_CHANGED,()=>{if(!this.within(node,this.root))this.unbind(node);});
    listen(Node.EventType.ACTIVE_IN_HIERARCHY_CHANGED,()=>{
      if(!node.activeInHierarchy){binding.hovered=false;if(this.drag===binding)this.drag=null;}
      this.apply();
    });
    listen(Node.EventType.NODE_DESTROYED,()=>this.unbind(node));
    this.bindings.set(node,binding);this.connectCanvas();
    return()=>{if(this.bindings.get(node)===binding)this.unbind(node);};
  }

  /** Re-evaluate dynamic disabled state without moving the pointer. */
  refresh():void {this.apply();}

  /** Clear a render subtree before deferred Creator destruction dispatches its events. */
  clearSubtree(parent:Node):void {
    for(const node of [...this.bindings.keys()])if(this.within(node,parent))this.unbind(node);
    this.apply();
  }

  reset():void {
    this.drag=null;for(const binding of this.bindings.values())binding.hovered=false;
    if(this.canvas)this.canvas.style.cursor='default';
  }

  dispose():void {
    if(this.disposed)return;this.reset();this.disposed=true;
    for(const node of [...this.bindings.keys()])this.unbind(node);
    this.disconnectCanvas();
    if(typeof window!=='undefined'){
      window.removeEventListener('blur',this.resetFromWindow);
      window.removeEventListener('pointerup',this.finishFromWindow);
      window.removeEventListener('pointercancel',this.resetFromWindow);
      document.removeEventListener('visibilitychange',this.visibilityChanged);
    }
  }

  private unbind(node:Node):void {
    const binding=this.bindings.get(node);if(!binding)return;
    for(const[event,callback]of binding.events)node.off(event,callback);
    this.bindings.delete(node);if(this.drag===binding)this.drag=null;this.apply();
  }

  private within(node:Node,parent:Node):boolean {
    for(let current:Node|null=node;current;current=current.parent)if(current===parent)return true;
    return false;
  }

  private interactiveDescendant(target:unknown,owner:Node):boolean {
    for(let node:Node|null=target instanceof Node?target:null;node&&node!==owner;node=node.parent){
      if(node.getComponent(Button)||typeof(node as Node&{__action?:unknown}).__action==='function')return true;
    }
    return false;
  }

  private eligible(binding:PointerBinding):boolean {
    if(!binding.node.isValid||!binding.node.activeInHierarchy||!this.within(binding.node,this.root))return false;
    const modal=[...this.root.children].reverse().find(node=>node.isValid&&node.activeInHierarchy&&node.name==='modal-overlay');
    return !modal||this.within(binding.node,modal);
  }

  private apply():void {
    if(this.disposed)return;this.connectCanvas();if(!this.canvas)return;
    if(this.drag&&(!this.eligible(this.drag)||this.drag.options.disabled?.()))this.drag=null;
    if(this.drag){this.canvas.style.cursor='grabbing';return;}
    let chosen:PointerBinding|undefined;
    for(const binding of this.bindings.values()){
      const rank=this.hoverRank(binding),chosenRank=chosen?this.hoverRank(chosen):-1;
      if(binding.hovered&&this.eligible(binding)&&(!chosen||rank>chosenRank||(rank===chosenRank&&binding.order>chosen.order)))chosen=binding;
    }
    this.canvas.style.cursor=chosen?(chosen.options.disabled?.()?'not-allowed':chosen.options.cursor??'pointer'):'default';
  }

  private hoverRank(binding:PointerBinding):number {
    const cursor=binding.options.cursor??'pointer';
    return cursor==='pointer'||cursor==='text'?20:cursor==='grab'?10:0;
  }

  private connectCanvas():void {
    if(this.disposed||this.canvas===game.canvas)return;
    this.disconnectCanvas();this.canvas=game.canvas;
    if(this.canvas){
      this.canvas.style.cursor='default';
      this.canvas.addEventListener('pointerleave',this.resetFromWindow);
      this.canvas.addEventListener('mouseleave',this.resetFromWindow);
      this.canvas.addEventListener('lostpointercapture',this.resetFromWindow);
      this.canvas.addEventListener('pointermove',this.canvasMoved);
    }
  }

  private disconnectCanvas():void {
    if(!this.canvas)return;
    this.canvas.style.cursor='default';
    this.canvas.removeEventListener('pointerleave',this.resetFromWindow);
    this.canvas.removeEventListener('mouseleave',this.resetFromWindow);
    this.canvas.removeEventListener('lostpointercapture',this.resetFromWindow);
    this.canvas.removeEventListener('pointermove',this.canvasMoved);
    this.canvas=null;
  }
}
