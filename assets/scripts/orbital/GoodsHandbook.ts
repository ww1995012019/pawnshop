import type {Node} from 'cc';
import {itemDefs,getDef,getRecipe,getTool} from './data';
import {cataloguePage,remainingStock} from './HandbookCatalogue';
import {ORBITAL_PALETTE as C} from './OrbitalUI';
import type {OrbitalHost} from './ui-types';
import {PhoneUI} from './PhoneUI';

/** A visual catalogue and announced arrivals, independent of hidden appraisal readings. */
export function openGoodsHandbook(h:OrbitalHost):void {
  if(h.ui.phone){openPhoneHandbook(h);return;}
  const modal=h.ui.modal('旧港货物图鉴',{width:1460,height:824});
  let page=0,selected=itemDefs[0].id,back=false,tab:'catalogue'|'arrivals'='catalogue';
  const text=(parent:Node,value:string,x:number,y:number,w:number,ht:number,size=18,color=C.text)=>h.ui.label(parent,value,x,y,w,ht,{size,color,verticalAlign:'center',wrap:false});
  const choose=(id:string)=>{selected=id;back=false;draw();};
  const draw=()=>{
    const p=modal.body;h.ui.clear(p);
    const stock=remainingStock(h.state),catalogue=cataloguePage(itemDefs,page);
    page=catalogue.page;
    h.button(p,`货物目录  ${itemDefs.length}`,0,0,218,44,()=>{tab='catalogue';draw();},{tone:'quiet',selected:tab==='catalogue',size:18,name:'button-图鉴货物目录'});
    h.button(p,`到货预告  ${stock.length} 批`,230,0,218,44,()=>{tab='arrivals';if(stock[0])selected=stock[0].stock.defId;back=false;draw();},{tone:'quiet',selected:tab==='arrivals',size:18,name:'button-图鉴到货预告'});
    text(p,tab==='catalogue'?'每件旧物都有正反两面。参考价以全新真品计，收购前仍需实物鉴定。':`第 ${h.state.day} 日 / 供货预约。只公布型号与大致报价，品相与真伪需要现场检测。`,0,52,874,30,15,C.muted);
    if(tab==='catalogue'){
      catalogue.items.forEach((def,index)=>{
        const x=(index%3)*292,y=94+Math.floor(index/3)*258;
        const card=h.button(p,'',x,y,276,240,()=>choose(def.id),{tone:'quiet',selected: def.id===selected,name:`button-图鉴-${def.id}`});
        const face=card.getChildByName('tech-button-surface')||card;
        h.ui.panel(face,14,12,248,145,{fill:'#061219BB',stroke:'#7FB9B123',lineWidth:1,radius:3,name:'handbook-sprite-well'});
        h.ui.object(face,def.id,45,13,186,142);
        if(def.art)text(face,'新入港',190,18,63,23,12,C.orange);
        text(face,def.name,17,163,242,30,19);
        text(face,def.category,17,199,142,22,12,C.muted);
        h.ui.label(face,`${def.value} Cr`,159,197,99,27,{size:18,color:C.cyan,align:'right',verticalAlign:'center',wrap:false});
      });
      h.button(p,'← 上一页',0,627,168,44,()=>{page--;const next=cataloguePage(itemDefs,page);selected=next.items[0]?.id||selected;back=false;draw();},{tone:'quiet',disabled:page===0,size:16,name:'button-图鉴上一页'});
      text(p,`${String(page+1).padStart(2,'0')} / ${String(catalogue.pages).padStart(2,'0')}   ·   每页 6 件`,290,630,300,36,16,C.muted);
      h.button(p,'下一页 →',692,627,168,44,()=>{page++;const next=cataloguePage(itemDefs,page);selected=next.items[0]?.id||selected;back=false;draw();},{tone:'quiet',disabled:page===catalogue.pages-1,size:16,name:'button-图鉴下一页'});
    }else if(stock.length){
      stock.forEach(({slot,stock:entry},index)=>{
        const def=getDef(entry.defId),y=99+index*173;
        const card=h.button(p,'',0,y,860,156,()=>choose(def.id),{tone:'quiet',selected:def.id===selected,name:`button-预告-${slot}`});
        const face=card.getChildByName('tech-button-surface')||card;
        h.ui.panel(face,13,12,139,132,{fill:'#061219D0',stroke:'#7FB9B123',lineWidth:1,radius:3});
        h.ui.object(face,def.id,23,18,119,118);
        text(face,`第 ${slot+1} 位预约 · 供货`,175,15,418,25,13,C.orange);
        text(face,def.name,175,46,418,36,24);
        text(face,`预计叫价 ${entry.priceBand[0]}–${entry.priceBand[1]} Cr`,610,49,228,32,19,C.cyan);
        h.ui.label(face,entry.source.split(' · ')[0],175,96,642,38,{size:15,color:C.muted,wrap:false,verticalAlign:'center'});
      });
      text(p,'供货与求购交替到访 · 每日 6 位预约 · 明日更换批次',0,635,860,35,15,C.muted);
    }else{
      h.ui.texturePanel(p,0,100,860,514,{skin:'socket',fill:'#0B1821',stroke:C.line});
      h.ui.object(p,'ITM-050',300,149,260,220);
      text(p,'今日供货预约已处理完毕',160,405,540,44,26,C.text);
      text(p,'可以继续检测、维修和履约。明日会有新的回收批次到港。',100,467,660,40,17,C.muted);
    }
    const def=getDef(selected),detail=h.ui.texturePanel(p,898,0,502,680,{skin:'glass',fill:'#0D1B24',stroke:'#7FB9B14A',name:'handbook-item-detail'});
    text(detail,def.category,24,14,318,26,12,C.orange);
    text(detail,def.name,24,52,454,39,28);
    text(detail,'型录展示 · 检测前不代表当前批次状况',24,96,454,25,13,C.muted);
    h.ui.texturePanel(detail,24,137,454,229,{skin:'socket',fill:'#07151D',stroke:'#71908B40',name:'handbook-preview-well'});
    h.ui.object(detail,def.id,116,143,270,215,{back,name:`handbook-preview-${def.id}`});
    h.button(detail,back?'查看正面':'查看背面',333,322,131,34,()=>{back=!back;draw();},{tone:'quiet',size:14,name:'button-图鉴翻面'});
    h.ui.label(detail,def.description,24,385,454,71,{size:17,color:C.text,lineHeight:25,wrap:true,verticalAlign:'top'});
    text(detail,'全新参考价',24,470,196,24,14,C.muted);
    h.ui.label(detail,`${def.value} Cr`,239,464,239,40,{size:29,color:C.cyan,align:'right',wrap:false,verticalAlign:'center'});
    h.ui.line(detail,24,516,478,516,'#8BA19A35',1);
    text(detail,'建议交叉检测',24,531,454,25,14,C.muted);
    const toolWidth=Math.min(112,454/Math.max(1,def.tools.length));
    def.tools.forEach((id,index)=>{
      const x=24+index*toolWidth;
      h.ui.toolIcon(detail,id,x,565,36,43);
      text(detail,getTool(id).short,x+40,572,toolWidth-42,28,14,C.text);
    });
    const recipe=def.recipeId?getRecipe(def.recipeId):undefined;
    h.ui.panel(detail,24,629,454,31,{fill:recipe?'#214338A0':'#26333B90',lineWidth:0,radius:3});
    text(detail,recipe?`可维修  ·  ${recipe.name}`:'无专用维修配方 · 可作为贸易或订单货物',36,628,430,33,13,recipe?C.green:C.muted);
  };
  draw();
}

function openPhoneHandbook(h:OrbitalHost):void {
  const u=new PhoneUI(h),m=u.sheet('旧港货物图鉴');let page=0,selected=itemDefs[0].id,back=false,arrivals=false;
  const draw=()=>{
    h.ui.clear(m.body);const stock=remainingStock(h.state),defs=arrivals?stock.map(s=>getDef(s.stock.defId)):itemDefs,catalogue=cataloguePage(defs,page,3);
    page=catalogue.page;if(!defs.some(d=>d.id===selected))selected=defs[0]?.id||itemDefs[0].id;
    u.button(m.body,'货物目录',16,0,440,()=>{arrivals=false;page=0;draw();},{selected:!arrivals,name:'button-图鉴货物目录'});
    u.button(m.body,'到货预告',504,0,440,()=>{arrivals=true;page=0;draw();},{selected:arrivals,name:'button-图鉴到货预告'});
    u.button(m.body,back?'查看正面':'查看背面',992,0,440,()=>{back=!back;draw();},{name:'button-图鉴翻面'});
    catalogue.items.forEach((def,i)=>{
      const b=h.button(m.body,'',16,126+i*132,440,120,()=>{selected=def.id;back=false;draw();},{selected:def.id===selected,name:`button-图鉴-${def.id}`});
      h.ui.object(b,def.id,8,6,112,108);u.row(b,def.name,132,4,296,108,30);
    });
    if(!defs.length)u.text(m.body,'今日供货预约已处理完毕。',16,160,440,310,36);
    const def=getDef(selected),detail=u.panel(m.body,480,126,952,396);
    h.ui.object(detail,def.id,16,10,300,260,{back});
    u.row(detail,def.name,336,6,600,66,40);
    const entry=arrivals?stock.find(s=>s.stock.defId===def.id)?.stock:undefined;
    u.text(detail,`${entry?`预计叫价 ${entry.priceBand[0]}–${entry.priceBand[1]} Cr`:`全新参考价 ${def.value} Cr`}\n${def.description}`,336,86,600,216,30);
    u.text(detail,`建议检测：${def.tools.map(id=>getTool(id).short).join('、')}\n${def.recipeId?`维修配方：${getRecipe(def.recipeId).name}`:'无专用维修配方'}`,20,282,912,106,28,C.cyan);
    u.button(m.body,'上一页',16,536,440,()=>{page--;draw();},{disabled:page===0,name:'button-图鉴上一页'});
    u.row(m.body,`${page+1} / ${catalogue.pages} · 检测前不代表当前批次状况`,504,536,440,108,28,C.muted);
    u.button(m.body,'下一页',992,536,440,()=>{page++;draw();},{disabled:page+1>=catalogue.pages,name:'button-图鉴下一页'});
  };draw();
}
