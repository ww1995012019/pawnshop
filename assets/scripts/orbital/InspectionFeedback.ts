import {Color,Graphics,Mask,Node,UIOpacity,UITransform,Vec3} from 'cc';
import type {OrbitalUI} from './OrbitalUI';

interface Point {x:number;y:number}
interface Cable {ink:Graphics;from:()=>Point;to:()=>Point;connected:()=>boolean;color:string}
interface Flash {node:Node;ink:Graphics;at:Point;elapsed:number;duration:number;color:string}
interface Flight {node:Node;from:Point;to:Point;elapsed:number}
interface Scan {node:Node;ink:Graphics;value:()=>number;enabled:()=>boolean}
const clamp=(n:number)=>Math.max(0,Math.min(1,n));

/** Immediate, non-blocking feedback. It never writes inspection or economy state. */
export class InspectionFeedback {
  private parent:Node|null=null;
  private layer:Node|null=null;
  private wires:Node|null=null;
  private cables:Cable[]=[];
  private flashes:Flash[]=[];
  private flights:Flight[]=[];
  private scans:Scan[]=[];
  private visual:Node|null=null;
  private visualBase=new Vec3();
  private shadow:Node|null=null;
  private held=false;
  private lift=0;
  private releaseTime=1;
  private clock=0;
  private area={x:212,y:200,width:1008,height:440};
  reducedMotion=false;

  constructor(private readonly ui:OrbitalUI){}

  bind(parent:Node,visual:Node,shadow:Node|null,area={x:212,y:200,width:1008,height:440}):void {
    this.clear();this.area={...area};this.parent=parent;this.visual=visual;this.visualBase=visual.position.clone();this.shadow=shadow;
    this.wires=this.ui.container(parent,0,0,1600,900,'inspection-live-cables');
    this.layer=this.ui.container(parent,0,0,1600,900,'inspection-contact-feedback');
    // Only contact flashes are clipped; real cable paths bridge the widget and item.
    const clip=this.ui.container(this.layer,area.x,area.y,area.width,area.height,'inspection-contact-clip');
    clip.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
  }

  point(node:Node,x?:number,y?:number):Point {
    if(!this.parent?.isValid||!node.isValid)return{x:0,y:0};
    const t=node.getComponent<UITransform>(UITransform)!;
    // API points use top-left/downward coordinates; Creator local Y points up.
    // With the shared (0,1) anchor, the centre is (+w/2,-h/2).
    const local=new Vec3((x??t.width/2)-t.anchorX*t.width,(1-t.anchorY)*t.height-(y??t.height/2));
    const world=t.convertToWorldSpaceAR(local),p=this.parent.getComponent<UITransform>(UITransform)!.convertToNodeSpaceAR(world);
    return{x:p.x,y:-p.y};
  }

  grab(held:boolean):void {
    this.held=held;if(!held)this.releaseTime=0;
    if(this.reducedMotion)this.lift=0;
  }

  contact(at:Point,color='#E0A16C',destination?:Point):void {
    if(!this.layer?.isValid)return;
    // Evidence must finish above the book it flies into; this layer has no input.
    this.layer.setSiblingIndex(this.parent!.children.length-1);
    const clip=this.layer.children[0];
    const node=this.ui.container(clip,at.x-this.area.x,at.y-this.area.y,1,1,'inspection-contact-spark');
    const ink=node.addComponent<Graphics>(Graphics);
    this.flashes.push({node,ink,at,elapsed:0,duration:.36,color});
    this.paintFlash(this.flashes[this.flashes.length-1],this.reducedMotion ? .7 : 0);
    if(destination&&!this.reducedMotion){
      // A small printed evidence slip flies from the contact point into the evidence book.
      const token=this.ui.container(this.layer,at.x,at.y,1,1,'inspection-evidence-transfer');
      const slip=this.ui.paperSlip(token,-30,-20,60,40,{name:'evidence-slip',torn:true,shadow:true});
      const g=slip.addComponent<Graphics>(Graphics);g.strokeColor=new Color('#8C7A5C');g.lineWidth=2;
      for(let i=0;i<3;i++){g.moveTo(10,-9-i*8);g.lineTo(i===2?32:50,-9-i*8);}g.stroke();
      g.fillColor=new Color(color);g.circle(50,-26,5);g.fill();
      this.flights.push({node:token,from:at,to:destination,elapsed:0});
    }
  }

  cable(from:()=>Point,to:()=>Point,connected:()=>boolean,color:string):void {
    if(!this.wires?.isValid)return;
    const ink=this.ui.container(this.wires,0,0,1600,900,'inspection-probe-cable').addComponent<Graphics>(Graphics);
    this.cables.push({ink,from,to,connected,color});this.paintCable(this.cables[this.cables.length-1]);
  }

  uv(object:Node,value:()=>number,enabled:()=>boolean):void {
    const node=this.ui.container(object,-181,-172,362,344,'inspection-uv-contact-band');
    const ink=node.addComponent<Graphics>(Graphics);this.scans.push({node,ink,value,enabled});
  }

  refresh():void {for(const cable of this.cables)if(cable.ink.node.isValid)this.paintCable(cable);}

  update(dt:number):void {
    const delta=Math.max(0,Math.min(.1,dt));this.clock+=delta;
    if(!this.parent?.isValid||!this.parent.activeInHierarchy){this.clear();return;}
    this.refresh();
    for(const scan of this.scans){
      if(!scan.node.isValid)continue;scan.ink.clear();if(!scan.enabled())continue;
      const x=clamp(scan.value())*344+9,g=scan.ink;
      g.fillColor=new Color('#AA8EDC18');g.rect(Math.max(0,x-15),-344,30,344);g.fill();
      g.strokeColor=new Color('#C8A4FFAA');g.lineWidth=2;g.moveTo(x,-10);g.lineTo(x,-334);g.stroke();
      g.strokeColor=new Color('#E9DBFC');g.lineWidth=1;for(let i=0;i<3;i++){const y=-112-i*30;g.moveTo(x-5,y);g.lineTo(x+5,y);g.stroke();}
    }
    this.releaseTime+=delta;
    const target=this.held&&!this.reducedMotion?1:0;
    this.lift+=(target-this.lift)*Math.min(1,delta*19);
    if(this.visual?.isValid){
      const settle=!this.held&&!this.reducedMotion&&this.releaseTime<.24?Math.sin(this.releaseTime/.24*Math.PI*2)*2.2*(1-this.releaseTime/.24):0;
      this.visual.setPosition(this.visualBase.x,this.visualBase.y+this.lift*5+settle,this.visualBase.z);
      if(this.shadow?.isValid)this.shadow.setScale(1-this.lift*.12,1-this.lift*.08,1);
    }
    for(const flash of [...this.flashes]){
      flash.elapsed+=delta;const p=this.reducedMotion?1:clamp(flash.elapsed/flash.duration);
      this.paintFlash(flash,p);
      if(p>=1){this.drop(flash.node);this.flashes.splice(this.flashes.indexOf(flash),1);}
    }
    for(const flight of [...this.flights]){
      flight.elapsed+=delta;const p=clamp(flight.elapsed/.75),t=1-Math.pow(1-p,3);
      flight.node.setPosition(flight.from.x+(flight.to.x-flight.from.x)*t,-flight.from.y-(flight.to.y-flight.from.y)*t+Math.sin(p*Math.PI)*90);
      flight.node.angle=-14+28*p;const sc=p<.15?.4+4*p:1-.45*clamp((p-.7)/.3);flight.node.setScale(sc,sc,1);
      if(p>=1){this.drop(flight.node);this.flights.splice(this.flights.indexOf(flight),1);}
    }
  }

  clear():void {
    if(this.visual?.isValid)this.visual.setPosition(this.visualBase);
    if(this.shadow?.isValid)this.shadow.setScale(1,1,1);
    this.drop(this.layer);this.drop(this.wires);this.layer=null;this.wires=null;
    this.flashes=[];this.flights=[];this.cables=[];this.scans=[];this.parent=null;this.visual=null;this.shadow=null;this.held=false;this.lift=0;
  }

  private paintCable(cable:Cable):void {
    const a=cable.from(),b=cable.to(),g=cable.ink,connected=cable.connected();g.clear();
    // A physical lead leaves the station upward, then bends towards its actual tip.
    const bend=Math.min(110,Math.max(48,Math.abs(a.y-b.y)*.28));
    for(const [width,color] of [[6,'#03090CC9'],[2.8,cable.color]] as [number,string][]){
      g.lineWidth=width;g.strokeColor=new Color(color);g.moveTo(a.x,-a.y);g.bezierCurveTo(a.x,-a.y+bend,b.x-25,-b.y-bend*.45,b.x,-b.y);g.stroke();
    }
    g.fillColor=new Color(connected?'#D8F0D9':cable.color);g.circle(b.x,-b.y,connected?3.2:2);g.fill();
    if(connected&&!this.reducedMotion){
      const r=5+Math.sin(this.clock*6)*1.1;g.strokeColor=new Color(cable.color+'66');g.lineWidth=1;g.circle(b.x,-b.y,r);g.stroke();
    }
  }

  private paintFlash(flash:Flash,p:number):void {
    const g=flash.ink;g.clear();const r=6+18*(1-Math.pow(1-p,3));
    g.strokeColor=new Color(flash.color);g.lineWidth=2.1*(1-p)+.6;g.circle(0,0,r);g.stroke();
    g.fillColor=new Color('#F0E2BE');g.circle(0,0,Math.max(0,3*(1-p)));g.fill();
    for(let i=0;i<4;i++){const angle=i*Math.PI/2+.4,d=9+p*21;g.moveTo(Math.cos(angle)*d*.6,Math.sin(angle)*d*.6);g.lineTo(Math.cos(angle)*d,Math.sin(angle)*d);g.stroke();}
    (flash.node.getComponent<UIOpacity>(UIOpacity)||flash.node.addComponent<UIOpacity>(UIOpacity)).opacity=Math.round(255*(1-p));
  }

  private drop(node:Node|null):void{if(node?.isValid){node.removeFromParent();node.destroy();}}
}
