import {Color,Graphics,Mask,Node,UIOpacity,UITransform,Vec3} from 'cc';
import type {OrbitalUI} from './OrbitalUI';
import {getItemHitBounds} from './ItemHitBounds';

export type WorkbenchStage='cover'|'insert'|'circuit'|'calibrate';
interface Point {x:number;y:number}
interface Beat {elapsed:number;duration:number;parent:Node;object:Node;origin:Vec3;scale:Vec3;front:Node|null;frontY:number;overlay:Node|null;part:Node|null;ink:Graphics|null;kind:WorkbenchStage;devices:Node[];contact:Point|null;start:Point|null;end:Point|null}
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>1-Math.pow(1-clamp(v),3);

/** Short, local contact beats. These never submit gameplay actions. */
export class WorkbenchFeedback {
  private beat:Beat|null=null;
  constructor(private readonly ui:OrbitalUI){}

  play(kind:WorkbenchStage,parent:Node,object:Node,itemId:string,materialId:string,reducedMotion:boolean,devices:Node[]=[]):void {
    this.clear();
    if(reducedMotion||!object.isValid||!parent.activeInHierarchy){this.dropDevices(devices);return;}
    // Old controls were detached and made inert before the reducer redraw. They
    // remain the same Sprite/Graphics nodes at the same world positions here.
    for(const device of devices)if(device.isValid){device.setParent(parent,true);device.active=true;}
    const find=(name:string):Node|undefined=>{const visit=(node:Node):Node|undefined=>node.name===name?node:node.children.map(visit).find(Boolean);return devices.map(visit).find(Boolean);};
    const point=(node:Node|undefined,center=false):Point|null=>{
      const transform=node?.getComponent<UITransform>(UITransform),target=parent.getComponent<UITransform>(UITransform);if(!node||!transform||!target)return null;
      const local=center?new Vec3(transform.width/2,-transform.height/2,0):new Vec3();
      const q=target.convertToNodeSpaceAR(transform.convertToWorldSpaceAR(local));return{x:q.x,y:-q.y};
    };
    const contact=point(find(kind==='calibrate'?'calibration-contact':'repair-slot-contact'));
    const start=point(find('weld-start'),true),end=point(find('weld-end'),true);
    if((kind==='insert'||kind==='calibrate')&&!contact||kind==='circuit'&&(!start||!end)){this.dropDevices(devices);return;}
    const origin=object.position.clone(),scale=object.scale.clone();
    let front:Node|null=null,overlay:Node|null=null,part:Node|null=null,ink:Graphics|null=null,frontY=-origin.y;
    if(kind==='cover'){
      const visible=getItemHitBounds(itemId,false,336);frontY=584-(168+visible.y+visible.height);
      front=this.ui.object(parent,itemId,origin.x,frontY,516,336,{back:false});front.name='workbench-cover-front';
      object.setScale(.06,scale.y,scale.z);object.setPosition(origin.x+258*(1-.06),origin.y,origin.z);
    }else{
      overlay=this.ui.container(parent,334,286,790,316,`workbench-${kind}-contact`);
      overlay.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
      const canvas=this.ui.container(overlay,-334,-286,1600,900,'workbench-contact-coordinates');
      ink=this.ui.container(canvas,0,0,1600,900,'workbench-contact-ink').addComponent<Graphics>(Graphics);
      if(kind==='insert'){
        part=this.ui.materialIcon(canvas,materialId,contact!.x-61,contact!.y-31,74,62);part.name='workbench-insert-last-24px';
      }
    }
    this.beat={elapsed:0,duration:kind==='cover'?.18:kind==='insert'?.22:.42,parent,object,origin,scale,front,frontY,overlay,part,ink,kind,devices,contact,start,end};
    this.paint(this.beat,0);
  }

  update(dt:number,reducedMotion:boolean):void {
    const b=this.beat;if(!b)return;
    if(reducedMotion||!b.object.isValid||!b.parent.isValid||!b.parent.activeInHierarchy||b.object.parent!==b.parent){this.clear();return;}
    b.elapsed+=Math.max(0,Math.min(.1,dt));const p=clamp(b.elapsed/b.duration);this.paint(b,p);if(p>=1)this.clear();
  }

  clear():void {
    const b=this.beat;this.beat=null;if(!b)return;
    if(b.object.isValid){b.object.setPosition(b.origin);b.object.setScale(b.scale);}
    for(const node of [b.front,b.overlay])if(node?.isValid){node.removeFromParent();node.destroy();}
    this.dropDevices(b.devices);
  }

  private dropDevices(devices:Node[]):void {
    for(const node of devices)if(node.isValid){node.removeFromParent();node.destroy();}
  }

  private paint(b:Beat,p:number):void {
    if(b.kind==='cover'){
      const frontHalf=p<.48;
      if(b.front?.isValid){
        b.front.active=frontHalf;
        const x=1-.94*ease(p/.48);b.front.setScale(x,b.scale.y,b.scale.z);b.front.setPosition(b.origin.x+258*(1-x),-b.frontY,b.origin.z);
      }
      const x=frontHalf?.06:.06+.94*ease((p-.48)/.52);
      b.object.setScale(x,b.scale.y,b.scale.z);b.object.setPosition(b.origin.x+258*(1-x),b.origin.y,b.origin.z);return;
    }
    const g=b.ink;if(!g)return;g.clear();
    const fade=1-clamp((p-.76)/.24),cyan=new Color('#76BABB'),amber=new Color('#D7A167');
    if(b.kind==='insert'){
      const anchor=b.contact!;
      if(b.part?.isValid){
        b.part.setPosition(anchor.x-61+24*ease(p),-anchor.y+31+3*(1-ease(p)));
        (b.part.getComponent<UIOpacity>(UIOpacity)||b.part.addComponent<UIOpacity>(UIOpacity)).opacity=Math.round(255*(1-clamp((p-.68)/.32)));
      }
      g.strokeColor=new Color(118,186,187,Math.round(180*fade));g.lineWidth=2;
      const close=10*(1-ease(p));g.moveTo(anchor.x-38-close,-anchor.y+18.5);g.lineTo(anchor.x-38-close,-anchor.y-18.5);g.moveTo(anchor.x+38+close,-anchor.y+18.5);g.lineTo(anchor.x+38+close,-anchor.y-18.5);g.stroke();
      if(p>.45){g.strokeColor=amber;g.lineWidth=2;g.moveTo(anchor.x-16,-anchor.y-27.5);g.lineTo(anchor.x-1,-anchor.y-31.5);g.lineTo(anchor.x+15,-anchor.y-27.5);g.stroke();}return;
    }
    if(b.kind==='calibrate'){
      const cx=b.contact!.x,cy=-b.contact!.y,offset=24*(1-ease(p));
      g.strokeColor=new Color(118,186,187,Math.round(190*fade));g.lineWidth=2;
      for(const sign of [-1,1]){g.moveTo(cx+sign*offset-18,cy);g.lineTo(cx+sign*offset+18,cy);g.moveTo(cx+sign*offset,cy-18);g.lineTo(cx+sign*offset,cy+18);}g.stroke();
      if(p>.5){g.strokeColor=amber;g.circle(cx,cy,7);g.stroke();}return;
    }
    const from=b.start!,to=b.end!,dx=to.x-from.x;
    const c1={x:from.x+dx*.28,y:from.y+55},c2={x:from.x+dx*.53,y:to.y-41};
    const point=(t:number)=>{const v=1-t;return{x:v*v*v*from.x+3*v*v*t*c1.x+3*v*t*t*c2.x+t*t*t*to.x,y:-(v*v*v*from.y+3*v*v*t*c1.y+3*v*t*t*c2.y+t*t*t*to.y)};};
    g.strokeColor=new Color(118,186,187,Math.round(85*fade));g.lineWidth=3;g.moveTo(from.x,-from.y);g.bezierCurveTo(c1.x,-c1.y,c2.x,-c2.y,to.x,-to.y);g.stroke();
    const end=clamp(p/.72);g.strokeColor=new Color(118,186,187,Math.round(235*fade));g.lineWidth=3;
    for(let i=0;i<=32;i++){const q=point(i/32*end);if(i===0)g.moveTo(q.x,q.y);else g.lineTo(q.x,q.y);}g.stroke();
    const head=point(end);g.fillColor=new Color(224,211,167,Math.round(255*fade));g.circle(head.x,head.y,3.5);g.fill();
    for(const q of [from,to]){g.strokeColor=cyan;g.lineWidth=1.5;g.circle(q.x,-q.y,6+3*(1-end));g.stroke();}
  }
}
