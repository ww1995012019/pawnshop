import {Color,Graphics,Node} from 'cc';
import type {OrbitalUI} from './OrbitalUI';
import {viewportBounds} from './ResponsiveViewport';

export interface DayShutterView {layer:Node;top:Node;bottom:Node;plate:Node;dayLabel:Node}

/** The same closed shop shutter is used for the opening and every new day. */
export function createDayShutter(ui:OrbitalUI,parent:Node,day:number,caption:string,options:{name?:string;shopSign?:boolean}={}):DayShutterView {
  const layer=ui.container(parent,0,0,1600,900,options.name??'day-shutter');
  const screen=viewportBounds(),topH=450-screen.y,bottomH=screen.y+screen.height-450;
  const top=ui.container(layer,screen.x,screen.y,screen.width,topH,'shutter-top'),bottom=ui.container(layer,screen.x,450,screen.width,bottomH,'shutter-bottom');
  const color=(hex:string):Color=>new Color().fromHEX(hex);
  for(const [panel,flip] of [[top,false],[bottom,true]] as [Node,boolean][]){
    const height=flip?bottomH:topH,width=screen.width,g=panel.addComponent<Graphics>(Graphics);
    g.fillColor=color('#1A2124');g.rect(0,-height,width,height);g.fill();
    g.fillColor=color('#232C30');for(let y=18;y<height;y+=64)g.rect(0,-y-30,width,30);g.fill();
    g.strokeColor=color('#0B0F11');g.lineWidth=3;for(let y=18;y<height;y+=64){g.moveTo(0,-y);g.lineTo(width,-y);}g.stroke();
    const edge=flip?-4:-height+4;
    g.fillColor=color('#E0A16C');g.rect(0,edge-4,width,8);g.fill();
    g.fillColor=color('#141414');for(let x=-40;x<width+40;x+=56){g.moveTo(x,edge+4);g.lineTo(x+24,edge+4);g.lineTo(x+44,edge-4);g.lineTo(x+20,edge-4);g.close();}g.fill();
    g.fillColor=color('#5A666A');for(let x=60;x<width;x+=240)g.circle(x,flip?-40:-height+40,7);g.fill();
  }
  if(options.shopSign){
    ui.label(top,'轨道旧货局',320-screen.x,144-screen.y,960,100,{size:ui.phone?80:72,bold:true,color:'#E3E0D5',align:'center',verticalAlign:'center',wrap:false,outline:'#0B0F11',outlineWidth:3});
    ui.label(top,'每件旧物，都有下一程。',320-screen.x,254-screen.y,960,48,{size:ui.phone?32:28,color:'#ABB7B5',align:'center',verticalAlign:'center',wrap:false});
  }
  const plate=ui.container(layer,560,372,480,156,'shutter-day-plate');
  const g=plate.addComponent<Graphics>(Graphics);
  g.fillColor=color('#0A0E10E8');g.roundRect(-6,-162,492,168,14);g.fill();
  g.fillColor=color('#2B1A0E');g.roundRect(0,-156,480,156,12);g.fill();
  g.strokeColor=color('#E0A16C');g.lineWidth=3;g.roundRect(3,-153,474,150,10);g.stroke();
  const dayLabel=ui.label(plate,`第 ${day} 天`,0,22,480,72,{size:ui.phone?64:56,bold:true,color:'#FFE3BC',align:'center',verticalAlign:'center',wrap:false});
  ui.label(plate,caption,0,98,480,36,{size:ui.phone?28:20,color:'#E9C9A0',align:'center',verticalAlign:'center',wrap:false});
  return {layer,top,bottom,plate,dayLabel};
}
