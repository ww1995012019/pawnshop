import {Color,EventTouch,Graphics,Node,UIOpacity,UITransform,Vec3,tween} from 'cc';
import type {OrbitalUI} from './OrbitalUI';
import {viewportBounds} from './ResponsiveViewport';

/** Painted background size; every fixture below is in these source pixels. */
const AW=1672,AH=941;
export type LifeScene='counter'|'workbench'|'warehouse';
export interface ShelfGood {uid:string;defId:string;name:string;repaired:boolean;take:(()=>void)|null}
export interface SceneLifeHost {
  ui:OrbitalUI;
  reducedMotion():boolean;
  sound(key:string):void;
  /** True while a modal, the title, an animation or the tutorial owns input. */
  blocked():boolean;
  /** Ring the service bell: performs the real "next visitor" action, or says why not. */
  bell():string|null;
}
export interface SceneLifeOptions {hotspots:boolean;bell:boolean;shelf:ShelfGood[]}
interface Pt {x:number;y:number}
interface Spot {id:string;x:number;y:number;w:number;h:number}
interface Ship {p:number;speed:number;v0:number;v1:number;size:number;dir:1|-1}
interface Mote {u:number;v:number;vu:number;vv:number;ph:number;life:number}
interface Shelved {node:Node;x:number;y:number;size:number;hover:number;target:number}
interface Caption {node:Node;age:number;y:number}

const rand=(seed:number)=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const clamp=(n:number,lo=0,hi=1)=>Math.max(lo,Math.min(hi,n));

/**
 * Presentation-only life in the painted rooms: light, steam, screens, traffic and a few
 * fixtures the player can touch. Nothing here changes money, AP or ownership, except the
 * service bell and shelf goods, which call the same actions as their on-screen buttons.
 */
export class SceneLife {
  private layer:Node|null=null;
  private under:Graphics|null=null;
  private over:Graphics|null=null;
  private scene:LifeScene='counter';
  private clock=0;
  private scale=1;
  private origin:Pt={x:0,y:0};
  private lampOn=true;
  private monitor=0;
  private surge=0;
  private puff=0;
  private ceiling=0;
  private readonly tubeFlicker=new Map<string,number>();
  private ships:Ship[]=[];
  private nextShip=4;
  private readonly motes:Mote[]=[];
  private sparks:{x:number;y:number;vx:number;vy:number;age:number;life:number;c:[number,number,number]}[]=[];
  private spots:Spot[]=[];
  private hovered='';
  private hint={id:'',age:9};
  private nextHint=6;
  private bellInk:Node|null=null;
  private bellAt:Pt={x:0,y:0};
  private bellShake=0;
  private waves:number[]=[];
  private shelved:Shelved[]=[];
  private captions:Caption[]=[];
  private readonly ink=new Color();
  private readonly stars:{u:number;v:number;f:number;ph:number}[]=[];

  constructor(private readonly host:SceneLifeHost){
    const r=rand(9);
    for(let i=0;i<22;i++){
      const upper=i<16;
      this.stars.push({u:upper?770+r()*290:500+r()*130,v:upper?126+r()*74:128+r()*40,f:.6+r()*1.8,ph:r()*6.3});
    }
    for(let i=0;i<34;i++)this.motes.push(this.spawnMote(r));
  }

  /** Recreate the layer right above the painted background; the page UI stays above it. */
  bind(shell:Node,scene:LifeScene,options:SceneLifeOptions):void {
    this.scene=scene;this.spots=[];this.shelved=[];this.bellInk=null;this.hovered='';
    const ui=this.host.ui,b=viewportBounds();
    this.scale=Math.max(b.width/AW,b.height/AH);
    this.origin={x:b.x+b.width/2-AW/2*this.scale,y:b.y+b.height/2-AH/2*this.scale};
    const layer=ui.container(shell,0,0,1600,900,`scene-life-${scene}`);this.layer=layer;
    this.under=ui.container(layer,0,0,1600,900,'scene-life-light').addComponent<Graphics>(Graphics);
    if(scene==='counter'){
      if(options.shelf.length)this.shelf(layer,options.shelf);
      if(options.bell)this.makeBell(layer);
      if(options.hotspots){
        this.spot(layer,'lamp',140,262,294,382,'台灯 · 点按开关',()=>{
          this.lampOn=!this.lampOn;this.host.sound('click');this.say('lamp',this.lampOn?'灯亮了，柜台又暖起来。':'关灯省电，只剩窗外的星光。');
        });
        this.spot(layer,'mug',106,524,228,624,'合成咖啡',()=>{this.puff=2.2;this.host.sound('drop');this.say('mug',['还温着，抿一口提提神。','杯底沉着一层可疑的渣。','第三杯了，今天的客人不少。'][Math.floor(this.clock*7)%3]);});
        this.spot(layer,'monitor',182,410,276,506,'站内频道',()=>{this.monitor=(this.monitor+1)%3;this.host.sound('check');this.say('monitor',['频道待机。','舱段电力波形，平稳。','近港雷达：三艘驳船排队进港。'][this.monitor]);});
        this.spot(layer,'window',480,122,1095,182,'舷窗 · 招一艘驳船',()=>{this.launchShip(true);this.host.sound('open');});
        this.spot(layer,'tube',1150,190,1248,345,'样品管',()=>{this.surge=1.8;this.host.sound('coin');this.burst(1200,300,[190,130,255],14);this.say('tube','紫色样液翻起一串气泡。');});
      }
    }
    this.over=ui.container(layer,0,0,1600,900,'scene-life-air').addComponent<Graphics>(Graphics);
    this.draw();
  }

  update(dt:number):void {
    if(!this.layer?.isValid){this.layer=null;return;}
    const d=Math.min(.1,Math.max(0,dt));this.clock+=d;
    const still=this.host.reducedMotion();
    this.surge=Math.max(0,this.surge-d);this.puff=Math.max(0,this.puff-d);this.ceiling=Math.max(0,this.ceiling-d);this.bellShake=Math.max(0,this.bellShake-d);
    this.waves=this.waves.map(w=>w+d).filter(w=>w<.7);
    for(const [k,v] of this.tubeFlicker)if(v-d<=0)this.tubeFlicker.delete(k);else this.tubeFlicker.set(k,v-d);
    if(!still){
      if(Math.random()<d*.09)this.tubeFlicker.set(`s${Math.floor(Math.random()*6)}`,.25+Math.random()*.5);
      if(Math.random()<d*.03)this.ceiling=.6;
      this.nextShip-=d;if(this.nextShip<=0)this.launchShip(false);
      for(const s of this.ships)s.p+=s.speed*d;this.ships=this.ships.filter(s=>s.p<1);
      const r=Math.random;for(let i=0;i<this.motes.length;i++){const m=this.motes[i];m.u+=m.vu*d;m.v+=m.vv*d;m.life-=d;if(m.life<=0||m.u<40||m.u>1150||m.v<120||m.v>640)this.motes[i]=this.spawnMote(r);}
    }
    this.sparks=this.sparks.map(s=>({...s,x:s.x+s.vx*d,y:s.y+s.vy*d,vy:s.vy-18*d,age:s.age+d})).filter(s=>s.age<s.life);
    // Discoverability: now and then one touchable fixture glints.
    this.hint.age+=d;this.nextHint-=d;
    if(this.nextHint<=0&&this.spots.length&&!still){this.hint={id:this.spots[Math.floor(Math.random()*this.spots.length)].id,age:0};this.nextHint=7+Math.random()*5;}
    for(const s of this.shelved)this.updateShelved(s,d,still);
    for(const c of this.captions){c.age+=d;if(!c.node.isValid)continue;const o=c.node.getComponent<UIOpacity>(UIOpacity)!;o.opacity=Math.round(255*clamp(Math.min(c.age/.15,(2.4-c.age)/.5)));c.node.setPosition(c.node.position.x,-(c.y-Math.min(1,c.age/.4)*14));}
    this.captions=this.captions.filter(c=>{if(c.age<2.4)return true;if(c.node.isValid){c.node.removeFromParent();c.node.destroy();}return false;});
    if(this.bellInk?.isValid)this.bellInk.angle=still?0:Math.sin(this.bellShake*55)*this.bellShake*16;
    this.draw();
  }

  /** Design-space point (y down) for a painted source pixel. */
  private at(u:number,v:number):Pt{return{x:this.origin.x+u*this.scale,y:this.origin.y+v*this.scale};}
  private col(g:Graphics,r:number,gg:number,b:number,a:number,stroke=false):void{this.ink.set(r,gg,b,Math.round(clamp(a)*255));if(stroke)g.strokeColor=this.ink;else g.fillColor=this.ink;}
  /** Soft radial light from stacked translucent discs. */
  private glow(g:Graphics,u:number,v:number,radius:number,c:[number,number,number],a:number,squash=1):void {
    const p=this.at(u,v),r=radius*this.scale;
    for(let i=0;i<6;i++){const k=1-i*.16;this.col(g,c[0],c[1],c[2],a/5);g.ellipse(p.x,-p.y,r*k,r*k*squash);g.fill();}
  }

  private draw():void {
    const g=this.under,o=this.over;if(!g?.isValid||!o?.isValid)return;
    g.clear();o.clear();
    const t=this.clock,still=this.host.reducedMotion();
    if(this.scene==='counter')this.drawCounter(g,o,t,still);
    else if(this.scene==='workbench')this.drawWorkbench(g,o,t,still);
    else this.drawWarehouse(g,o,t,still);
    for(const s of this.sparks){const a=1-s.age/s.life;this.col(o,s.c[0],s.c[1],s.c[2],a*.9);o.circle(s.x,-s.y,2.2*this.scale*(.6+a*.6));o.fill();}
    this.drawSpots(o,t,still);
  }

  private flick(t:number,seed:number):number{return .9+.06*Math.sin(t*11+seed)*Math.sin(t*6.7+seed*3)+.04*Math.sin(t*1.3+seed);}
  private tube(g:Graphics,id:string,u:number,v:number,len:number,c:[number,number,number],t:number,still:boolean):void {
    const off=!still&&this.tubeFlicker.has(id)&&Math.sin(t*70)>-.2;
    const p=this.at(u,v),s=this.scale;
    if(off){this.col(g,6,12,16,.72);g.roundRect(p.x-len*s/2,-p.y-5*s,len*s,10*s,4*s);g.fill();return;}
    const a=still?.16:.14+.04*Math.sin(t*1.7+u);
    this.glow(g,u,v+10,len*.75,c,a,.42);
  }

  private drawCounter(g:Graphics,o:Graphics,t:number,still:boolean):void {
    const s=this.scale,warm:[number,number,number]=[255,186,110],teal:[number,number,number]=[110,230,235];
    // Ceiling fluorescent bars and their spill on the deck.
    const ceilOff=!still&&this.ceiling>0&&Math.sin(t*48)>0;
    for(const [u,v,len] of [[742,58,190],[1000,96,160]] as const){
      if(ceilOff){const p=this.at(u,v);this.col(g,4,10,14,.7);g.roundRect(p.x-len*s/2,-p.y-9*s,len*s,18*s,5*s);g.fill();}
      else this.glow(g,u,v+14,len*.7,teal,still?.14:.12+.03*Math.sin(t*2.1+u),.35);
    }
    // Shelf tubes, each with its own occasional brown-out.
    ([[1323,207,70],[1495,160,105],[1323,301,70],[1495,280,105],[1323,382,70],[1495,387,105]] as const).forEach(([u,v,len],i)=>this.tube(g,`s${i}`,u,v,len,teal,t,still));
    // Hanging cage lamps and the corridor beacons.
    const f=still?1:this.flick(t,1.7);
    this.glow(g,1195,34,62,warm,.26*f);this.glow(g,1600,26,58,warm,.24*this.flick(t,4.1));
    this.glow(g,290,215,26,warm,still?.3:.18+.14*(Math.sin(t*2.4)>.2?1:.35));this.glow(g,355,280,22,warm,.2*f);
    // Specimen tube and the glowing jar under the plant.
    const pulse=still?.5:.5+.5*Math.sin(t*1.6);
    this.glow(g,1200,288,72,[175,105,255],.2+.12*pulse+this.surge*.25);
    this.glow(g,1600,560,58,[90,235,215],.16+.1*pulse);
    // Window: stars and passing barges.
    for(const st of this.stars){const p=this.at(st.u,st.v),a=still?.6:.25+.7*Math.max(0,Math.sin(t*st.f+st.ph));this.col(o,225,235,255,a);o.circle(p.x,-p.y,1.15*s);o.fill();}
    for(const ship of this.ships)this.drawShip(o,ship);
    // Desk lamp: cone, pool and bulb; a darkened bulb when switched off.
    if(this.lampOn){
      const lf=still?1:this.flick(t,.3)*(Math.random()<.004?.55:1);
      const a=this.at(176,358),b=this.at(266,348),c=this.at(420,700),d=this.at(20,700);
      this.col(g,255,190,120,.08*lf);g.moveTo(a.x,-a.y);g.lineTo(b.x,-b.y);g.lineTo(c.x,-c.y);g.lineTo(d.x,-d.y);g.close();g.fill();
      this.glow(g,210,650,190,warm,.16*lf,.2);
      this.glow(g,165,570,70,warm,.09*lf);
      this.glow(g,218,346,92,warm,.46*lf);
    }else{
      const p=this.at(218,346);this.col(o,8,6,5,.62);o.ellipse(p.x,-p.y,44*s,20*s);o.fill();
      this.glow(o,200,480,330,[4,6,10],.5,.9);
    }
    // Dust drifting through the light.
    if(!still)for(const m of this.motes){
      const p=this.at(m.u,m.v),near=this.lampOn&&m.u<420&&m.v>350?1.6:1;
      this.col(o,255,232,200,clamp(Math.sin(m.life*1.3+m.ph)*.5+.5)*.38*near);o.circle(p.x,-p.y,1.4*s*near);o.fill();
    }
    // Steam over the mug.
    const wisps=this.puff>0?6:3;
    for(let i=0;i<wisps;i++){
      const ph=still?.35+i*.2:((t*(.32+i*.03)+i/wisps)%1),boost=this.puff>0?1.8:1;
      const base=this.at(165+(i%3-1)*14,540);let x=base.x,y=base.y;
      this.col(o,236,232,226,Math.sin(ph*Math.PI)*.26*boost,true);o.lineWidth=(3.5+ph*5)*s;o.moveTo(x,-y);
      for(let k=1;k<=7;k++){const q=k/7,h=(ph*66+q*22)*s*boost;x=base.x+Math.sin(q*4+t*2+i)*7*s*(.4+q);y=base.y-h;o.lineTo(x,-y);}
      o.stroke();
    }
    this.drawMonitor(o,t,still);
    // Bell sound waves.
    for(const w of this.waves){const r=(12+w*90)*s,a=(1-w/.7)*.7;this.col(o,255,214,150,a,true);o.lineWidth=2.2;o.arc(this.bellAt.x,-this.bellAt.y,r,Math.PI*.15,Math.PI*.85,true);o.stroke();}
  }

  private drawMonitor(o:Graphics,t:number,still:boolean):void {
    const a=this.at(202,432),b=this.at(256,494),w=b.x-a.x,h=b.y-a.y,s=this.scale;
    const flicker=still?1:.85+.15*Math.sin(t*31)*Math.sin(t*3);
    this.col(o,90,255,215,.1*flicker);o.rect(a.x,-b.y,w,h);o.fill();
    if(this.monitor===0){
      if(still||Math.sin(t*5)>0){this.col(o,170,255,230,.85);o.rect(a.x+w*.14,-(a.y+h*.78),w*.14,h*.12);o.fill();}
      this.col(o,170,255,230,.5);for(let i=0;i<3;i++){o.rect(a.x+w*.14,-(a.y+h*(.2+i*.16)),w*(.7-i*.18),h*.05);o.fill();}
    }else if(this.monitor===1){
      this.col(o,150,255,225,.9,true);o.lineWidth=1.4*s;
      for(let k=0;k<=24;k++){const q=k/24,x=a.x+w*(.08+q*.84),y=a.y+h*(.52-.26*Math.sin(q*Math.PI*4-t*5)*Math.exp(-Math.pow(q-.5,2)*3));if(k)o.lineTo(x,-y);else o.moveTo(x,-y);}
      o.stroke();
    }else{
      const cx=a.x+w/2,cy=a.y+h/2,r=Math.min(w,h)*.4,ang=still?0:t*2.4;
      this.col(o,150,255,225,.55,true);o.lineWidth=1*s;o.circle(cx,-cy,r);o.stroke();o.circle(cx,-cy,r*.5);o.stroke();
      this.col(o,150,255,225,.9,true);o.lineWidth=1.6*s;o.moveTo(cx,-cy);o.lineTo(cx+Math.cos(ang)*r,-(cy+Math.sin(ang)*r));o.stroke();
      for(const [bx,by,k] of [[.3,-.2,0],[-.25,.25,2],[.1,.32,4]] as const){const fade=still?1:clamp(1-((ang-k+100)%6.28)/6.28);this.col(o,255,210,140,fade);o.circle(cx+bx*r,-(cy+by*r),1.8*s);o.fill();}
    }
    // Rolling scan band.
    if(!still){const y=a.y+((t*.45)%1)*h;this.col(o,200,255,240,.12);o.rect(a.x,-(y+h*.08),w,h*.08);o.fill();}
  }

  private drawShip(o:Graphics,ship:Ship):void {
    const u=ship.dir<0?1095-ship.p*620:475+ship.p*620,v=ship.v0+(ship.v1-ship.v0)*ship.p;
    if(u<478||u>1094)return;
    const edge=clamp(Math.min(u-478,1094-u)/40),p=this.at(u,v),k=ship.size*this.scale,d=ship.dir;
    // Engine trail, hull, lit ports, nav light.
    this.col(o,120,220,255,.28*edge,true);o.lineWidth=2*k;o.moveTo(p.x-d*14*k,-p.y);o.lineTo(p.x-d*60*k,-p.y-2*k);o.stroke();
    this.col(o,130,230,255,.55*edge);o.circle(p.x-d*15*k,-p.y,3.4*k);o.fill();
    this.col(o,72,84,98,.95*edge);o.ellipse(p.x,-p.y,16*k,4.2*k);o.fill();
    this.col(o,104,116,130,.95*edge);o.roundRect(p.x-6*k,-p.y,12*k,5*k,2*k);o.fill();
    this.col(o,255,214,150,.9*edge);for(let i=-1;i<=1;i++){o.circle(p.x+i*5*k,-p.y+.4*k,.9*k);o.fill();}
    if(Math.sin(this.clock*6+ship.v0)>.3){this.col(o,255,90,80,edge);o.circle(p.x+d*15*k,-p.y,1.2*k);o.fill();}
  }

  private drawWorkbench(g:Graphics,o:Graphics,t:number,still:boolean):void {
    const teal:[number,number,number]=[110,230,235],s=this.scale;
    this.tube(g,'w0',482,30,215,teal,t,still);this.tube(g,'w1',1245,30,180,teal,t,still);
    const pulse=still?.5:.5+.5*Math.sin(t*1.4);
    this.glow(g,335,196,120,[255,190,120],.16+.06*pulse);
    this.glow(g,1090,232,70,[175,105,255],.18+.1*pulse,.45);
    for(const st of this.stars){const u=740+(st.u-770)*.9,v=12+(st.v-126)*1.3;if(Math.hypot(u-880,v-95)>135)continue;const p=this.at(u,v),a=still?.6:.25+.7*Math.max(0,Math.sin(t*st.f+st.ph));this.col(o,225,235,255,a);o.circle(p.x,-p.y,1.1*s);o.fill();}
    // Oscilloscope trace and multimeter read-out.
    const a=this.at(1370,150),b=this.at(1510,240);this.col(o,120,255,220,.85,true);o.lineWidth=1.4*s;
    for(let k=0;k<=30;k++){const q=k/30,x=a.x+(b.x-a.x)*q,y=a.y+(b.y-a.y)*(.62-.3*Math.sin(q*Math.PI*6-(still?0:t*4))*Math.exp(-Math.pow(q-.6,2)*8));if(k)o.lineTo(x,-y);else o.moveTo(x,-y);}o.stroke();
    this.glow(g,1577,405,34,[190,255,170],.14+.08*pulse);
  }

  private drawWarehouse(g:Graphics,o:Graphics,t:number,still:boolean):void {
    const teal:[number,number,number]=[110,230,235],warm:[number,number,number]=[255,186,110],s=this.scale;
    this.tube(g,'h0',210,160,170,teal,t,still);this.tube(g,'h1',685,188,150,teal,t,still);
    const f=still?1:this.flick(t,2.2);
    this.glow(g,925,228,40,warm,.26*f);this.glow(g,1625,140,40,warm,.24*this.flick(t,5.5));this.glow(g,1070,318,70,warm,.2*f,.4);
    const pulse=still?.5:.5+.5*Math.sin(t*1.5);
    this.glow(g,1533,226,60,[175,105,255],.18+.1*pulse);
    for(const [u,v] of [[1324,316],[1417,316],[1491,316],[1576,316],[1324,404],[1417,404],[1491,404],[1576,404]] as const)this.glow(g,u,v,26,teal,.1+.08*Math.max(0,Math.sin(t*2+u*.03)),.5);
    for(const st of this.stars.slice(0,14)){const p=this.at(1110+(st.u-770)*1.05,40+(st.v-128)*1.0),a=still?.6:.25+.7*Math.max(0,Math.sin(t*st.f+st.ph));this.col(o,225,235,255,a);o.circle(p.x,-p.y,1.1*s);o.fill();}
  }

  private drawSpots(o:Graphics,t:number,still:boolean):void {
    for(const spot of this.spots){
      const hovered=spot.id===this.hovered,hinted=spot.id===this.hint.id&&this.hint.age<1;
      if(hovered){
        const a=still?.5:.35+.2*Math.sin(t*6);
        this.col(o,255,206,140,a,true);o.lineWidth=2;o.roundRect(spot.x-3,-(spot.y+spot.h+3),spot.w+6,spot.h+6,10);o.stroke();
      }
      if(hinted){
        const k=Math.sin(this.hint.age*Math.PI),cx=spot.x+spot.w*.72,cy=spot.y+spot.h*.3,r=12*k;
        this.col(o,255,240,210,.9*k);o.moveTo(cx,-(cy-r));o.lineTo(cx+r*.22,-cy);o.lineTo(cx,-(cy+r));o.lineTo(cx-r*.22,-cy);o.close();o.fill();
        o.moveTo(cx-r,-cy);o.lineTo(cx,-(cy-r*.22));o.lineTo(cx+r,-cy);o.lineTo(cx,-(cy+r*.22));o.close();o.fill();
      }
    }
  }

  private spot(layer:Node,id:string,u0:number,v0:number,u1:number,v1:number,label:string,act:()=>void):void {
    const a=this.at(u0,v0),b=this.at(u1,v1),ui=this.host.ui;
    const node=ui.container(layer,a.x,a.y,b.x-a.x,b.y-a.y,`scene-prop-${id}`);
    this.spots.push({id,x:a.x,y:a.y,w:b.x-a.x,h:b.y-a.y});
    ui.bindPointer(node,{cursor:'pointer',disabled:()=>this.host.blocked()});
    ui.tooltip(node,label,'above');
    node.on(Node.EventType.MOUSE_ENTER,()=>{if(!this.host.blocked())this.hovered=id;});
    node.on(Node.EventType.MOUSE_LEAVE,()=>{if(this.hovered===id)this.hovered='';});
    node.on(Node.EventType.TOUCH_END,(e:EventTouch)=>{if(this.host.blocked())return;e.propagationStopped=true;this.hint.age=9;act();});
  }

  /** A short line of thought beside the touched fixture, rising and fading. */
  private say(id:string,text:string):void {
    const spot=this.spots.find(s=>s.id===id);if(!spot||!this.layer?.isValid)return;
    for(const c of this.captions)if(c.node.isValid){c.node.removeFromParent();c.node.destroy();}
    this.captions=[];
    const w=Math.max(150,text.length*19+34),x=Math.max(12,Math.min(1588-w,spot.x+spot.w/2-w/2)),y=Math.max(100,spot.y-44);
    const ui=this.host.ui,node=ui.container(ui.root,x,y,w,36,'scene-prop-caption');
    const g=node.addComponent<Graphics>(Graphics);
    g.fillColor=new Color('#0A0D10D8');g.roundRect(0,-36,w,36,8);g.fill();
    g.strokeColor=new Color('#E0A16CB0');g.lineWidth=1.2;g.roundRect(.6,-35.4,w-1.2,34.8,8);g.stroke();
    ui.label(node,text,0,0,w,36,{size:17,color:'#F4E7CF',align:'center',verticalAlign:'center',wrap:false});
    node.addComponent<UIOpacity>(UIOpacity).opacity=0;
    this.captions.push({node,age:this.host.reducedMotion()?.15:0,y});
  }

  private burst(u:number,v:number,c:[number,number,number],n:number):void {
    if(this.host.reducedMotion())return;
    const p=this.at(u,v);
    for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,sp=20+Math.random()*50;this.sparks.push({x:p.x+(Math.random()-.5)*20*this.scale,y:p.y,vx:Math.cos(a)*sp*.5,vy:-Math.abs(Math.sin(a))*sp-20,age:0,life:.8+Math.random()*.7,c});}
  }

  private launchShip(asked:boolean):void {
    this.nextShip=9+Math.random()*9;
    if(this.host.reducedMotion()&&!asked)return;
    const dir:1|-1=Math.random()<.5?1:-1,v0=150+Math.random()*150;
    this.ships.push({p:0,speed:asked?.16:.06+Math.random()*.04,v0,v1:v0+(Math.random()-.5)*60,size:asked?1.25:.7+Math.random()*.5,dir});
    if(this.ships.length>4)this.ships.shift();
  }
  private spawnMote(r:()=>number):Mote{return{u:60+r()*1080,v:150+r()*480,vu:(r()-.5)*6,vv:-2-r()*5,ph:r()*6,life:6+r()*10};}

  private makeBell(layer:Node):void {
    // Sits on the counter top between the broadcast and the till.
    const ui=this.host.ui,x=1058,y=724,w=72,h=62;
    const hit=ui.container(layer,x,y,w,h,'scene-prop-bell');
    this.spots.push({id:'bell',x,y,w,h});this.bellAt={x:x+w/2,y:y+14};
    const ink=new Node('service-bell-ink');ink.layer=hit.layer;hit.addChild(ink);ink.addComponent<UITransform>(UITransform).setContentSize(w,h);ink.setPosition(w/2,-h+6);this.bellInk=ink;
    const g=ink.addComponent<Graphics>(Graphics);
    // Contact shadow, iron base with a brass rim, then a shaded dome and plunger.
    g.fillColor=new Color('#00000088');g.ellipse(3,-3,36,8);g.fill();
    g.fillColor=new Color('#1E1915');g.ellipse(0,0,33,9);g.fill();
    g.fillColor=new Color('#3A2E24');g.ellipse(0,3,33,8);g.fill();
    g.strokeColor=new Color('#B88E52');g.lineWidth=1.6;g.ellipse(0,3,32,7.5);g.stroke();
    const dome=(r:number,top:number,c:string)=>{g.fillColor=new Color(c);g.moveTo(-r,6);g.bezierCurveTo(-r,top,r,top,r,6);g.close();g.fill();};
    dome(26,44,'#6E4A22');dome(24.5,42,'#A3712F');dome(21,39,'#C9913F');dome(15,35,'#E2AE5A');
    g.fillColor=new Color('#8A5E2A');g.ellipse(0,6.5,26,3.2);g.fill();
    g.fillColor=new Color('#FFF1CC');g.ellipse(-9,22,4.2,7.5);g.fill();
    g.fillColor=new Color('#FFF1CC80');g.ellipse(-4,29,7,2.6);g.fill();
    g.strokeColor=new Color('#5A3E1E');g.lineWidth=1;g.moveTo(-24,8);g.bezierCurveTo(-18,10,18,10,24,8);g.stroke();
    g.fillColor=new Color('#4A3520');g.rect(-2.5,33,5,8);g.fill();
    g.fillColor=new Color('#B88A45');g.ellipse(0,42,7,3.6);g.fill();
    g.fillColor=new Color('#F0C878');g.ellipse(0,43.5,6,3);g.fill();
    g.fillColor=new Color('#FFF6DC');g.circle(-2,44.2,1.4);g.fill();
    ui.bindPointer(hit,{cursor:'pointer',disabled:()=>this.host.blocked()});
    ui.tooltip(hit,'服务铃 · 请下一位来客','above');
    hit.on(Node.EventType.MOUSE_ENTER,()=>{if(!this.host.blocked())this.hovered='bell';});
    hit.on(Node.EventType.MOUSE_LEAVE,()=>{if(this.hovered==='bell')this.hovered='';});
    hit.on(Node.EventType.TOUCH_START,(e:EventTouch)=>{if(this.host.blocked())return;e.propagationStopped=true;if(!this.host.reducedMotion())tween<Node>(ink).to(.05,{scale:new Vec3(1.04,.9,1)}).to(.12,{scale:new Vec3(1,1,1)},{easing:'backOut'}).start();});
    hit.on(Node.EventType.TOUCH_END,(e:EventTouch)=>{
      if(this.host.blocked())return;e.propagationStopped=true;
      this.bellShake=.6;this.waves.push(0);this.host.sound('check');
      const reason=this.host.bell();if(reason)this.say('bell',reason);
    });
  }

  private shelf(layer:Node,goods:ShelfGood[]):void {
    // Plank tops of the painted rack (bottom-centre of each object, source pixels).
    const slots:[number,number,number][]=[[1322,302,74],[1462,278,74],[1532,278,70],[1322,380,64],[1462,368,70],[1532,368,66],[1322,457,58]];
    const ui=this.host.ui,b=viewportBounds();
    let i=0;
    for(const good of goods){
      while(i<slots.length){const [u,v,size]=slots[i];const p=this.at(u,v),k=size*this.scale;if(p.x+k/2<b.x+b.width-4&&p.y-k>b.y+96)break;i++;}
      if(i>=slots.length)break;
      const [u,v,size]=slots[i++],p=this.at(u,v),k=size*this.scale,x=p.x-k/2,y=p.y-k*.96;
      const shadow=this.at(u,v-2);this.shelfShadow(shadow,k);
      const node=ui.container(layer,x,y,k,k,`shelf-good-${good.uid}`);
      ui.object(node,good.defId,0,0,k,k,{repaired:good.repaired});
      const entry:Shelved={node,x,y,size:k,hover:0,target:0};this.shelved.push(entry);
      ui.bindPointer(node,{cursor:'pointer',disabled:()=>this.host.blocked()});
      ui.tooltip(node,good.take?`${good.name} · 点按拿到柜台`:good.name,'below');
      node.on(Node.EventType.MOUSE_ENTER,()=>{if(!this.host.blocked())entry.target=1;});
      node.on(Node.EventType.MOUSE_LEAVE,()=>{entry.target=0;});
      node.on(Node.EventType.TOUCH_END,(e:EventTouch)=>{
        if(this.host.blocked())return;e.propagationStopped=true;
        if(good.take){this.host.sound('drop');good.take();}
        else{entry.hover=1.6;this.host.sound('click');this.flash(node,'先招呼眼前的客人，再去拿架上的货。');}
      });
    }
  }
  private shelfShadow(p:Pt,k:number):void {
    // Drawn once into the light layer, which is redrawn each frame; keep it as a node instead.
    const ui=this.host.ui,node=ui.container(this.layer!,p.x-k*.42,p.y-6,k*.84,12,'shelf-good-shadow');
    const g=node.addComponent<Graphics>(Graphics);g.fillColor=new Color('#02060880');g.ellipse(k*.42,-6,k*.4,5);g.fill();
  }
  private flash(node:Node,text:string):void {
    const t=node.getComponent<UITransform>(UITransform)!;
    this.spots.push({id:'__flash',x:node.position.x,y:-node.position.y,w:t.width,h:t.height});
    this.say('__flash',text);this.spots=this.spots.filter(s=>s.id!=='__flash');
  }
  private updateShelved(s:Shelved,d:number,still:boolean):void {
    if(!s.node.isValid)return;
    s.hover+=(s.target-s.hover)*Math.min(1,d*12);if(s.hover>1)s.hover=Math.max(1,s.hover-d*4);
    const k=1+.12*s.hover,lift=6*s.hover;
    s.node.setScale(k,k,1);s.node.setPosition(s.x-(k-1)*s.size/2,-(s.y-(k-1)*s.size*.96-lift));
    s.node.angle=still?0:Math.sin(this.clock*9)*s.hover*1.2;
  }
}
