import {npcs,getNpc} from './data';
import type {OrbitalHost} from './ui-types';
import {PhoneUI} from './PhoneUI';
import {ORBITAL_PALETTE as C} from './OrbitalUI';

/** The dossier is a native game sheet, usable from a visitor or the station menu. */
export function openPeople(h:OrbitalHost,selected=npcs[0].id,conversation=''):void {
 const u=new PhoneUI(h),m=u.sheet('旧港人物档案');
 let id=npcs.some(n=>n.id===selected)?selected:npcs[0].id,page=Math.floor(npcs.findIndex(n=>n.id===id)/4),section:'profile'|'needs'|'dialogue'=conversation?'dialogue':'profile';
 const speaker=selected;
 const draw=()=>{
  h.ui.clear(m.body);
  npcs.slice(page*4,page*4+4).forEach((npc,i)=>{
   const b=h.button(m.body,'',16,i*124,440,108,()=>{id=npc.id;section='profile';draw();},{tone:'quiet',selected:id===npc.id,name:`people-select-${npc.id}`});
   h.ui.portrait(b,npc.id,8,4,84,100,{crop:'head'});
   u.row(b,npc.name,108,3,316,54,34);u.row(b,npc.title.split(' · ')[0],108,60,316,44,26,C.muted);
  });
  const npc=getNpc(id),panel=u.panel(m.body,480,0,952,514,'people-dossier');
  h.ui.portrait(panel,npc.id,16,10,288,486);
  u.row(panel,npc.name,328,6,600,66,46,C.orange);
  u.text(panel,npc.title,328,82,600,74,30,C.cyan);
  const text=section==='dialogue'?(id===speaker&&conversation?conversation:npc.line):section==='needs'?(npc.desire||'店主负责采购、鉴定与经营，不作为来访买家。'):(npc.bio||npc.line);
  u.text(panel,text,328,166,600,330,30);
  u.button(m.body,'上一页',16,536,212,()=>{page--;draw();},{disabled:page===0,name:'people-prev',size:30});
  u.button(m.body,'下一页',244,536,212,()=>{page++;draw();},{disabled:(page+1)*4>=npcs.length,name:'people-next',size:30});
  for(const [i,key,label] of [[0,'profile','人物背景'],[1,'needs','采购需求'],[2,'dialogue','来访对白']] as const)u.button(m.body,label,480+i*324,536,304,()=>{section=key;draw();},{selected:section===key,tone:section===key?'gold':'quiet',name:`people-${key}`});
 };draw();
}
