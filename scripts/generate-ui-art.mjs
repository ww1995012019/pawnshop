// Generates the v12 game-UI atlases from vector sources so they stay editable:
//   assets/resources/art/orbital-hud.png    8×3 icon atlas, 128px cells
//   assets/resources/art/orbital-ui-kit.png 2×1 surface atlas, 512px cells (thermal paper, CRT bezel)
// Run: node scripts/generate-ui-art.mjs
import sharp from 'sharp';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const art=resolve(root,'assets/resources/art');

const INK='#150F0B';
const defs=`<defs>
  <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF2D6"/><stop offset=".45" stop-color="#E9BC7E"/><stop offset="1" stop-color="#9C6534"/></linearGradient>
  <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF1EA"/><stop offset=".5" stop-color="#AEB8B4"/><stop offset="1" stop-color="#5F6B6B"/></linearGradient>
  <linearGradient id="cyan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4FFFB"/><stop offset=".45" stop-color="#6FE0DA"/><stop offset="1" stop-color="#1F807D"/></linearGradient>
  <linearGradient id="rust" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC9A0"/><stop offset=".5" stop-color="#E07F4A"/><stop offset="1" stop-color="#8E3D1E"/></linearGradient>
  <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF9EC"/><stop offset="1" stop-color="#D9CDB3"/></linearGradient>
  <radialGradient id="lens" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#E8FFFD"/><stop offset=".4" stop-color="#7FD9D6"/><stop offset="1" stop-color="#1D5F66"/></radialGradient>
</defs>`;

/** Every glyph is painted as: drop shadow, dark ink outline, gradient body, soft top highlight. */
function glyph(d,fill='brass',extra=''){
  return `<path d="${d}" transform="translate(0 5)" fill="#000" fill-opacity=".45"/>`
    +`<path d="${d}" fill="${INK}" stroke="${INK}" stroke-width="11" stroke-linejoin="round"/>`
    +`<path d="${d}" fill="url(#${fill})" ${extra}/>`
    +`<path d="${d}" fill="none" stroke="#FFFFFF" stroke-opacity=".28" stroke-width="2" stroke-linejoin="round"/>`;
}
const circle=(cx,cy,r)=>`M${cx-r} ${cy}a${r} ${r} 0 1 0 ${r*2} 0a${r} ${r} 0 1 0 ${-r*2} 0Z`;
const rect=(x,y,w,h,r=0)=>r?`M${x+r} ${y}h${w-2*r}a${r} ${r} 0 0 1 ${r} ${r}v${h-2*r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w-2*r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h-2*r)}a${r} ${r} 0 0 1 ${r} ${-r}Z`:`M${x} ${y}h${w}v${h}h${-w}Z`;
const ink=(d,w=6)=>`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const line=(d,color,w=4,op=1)=>`<path d="${d}" fill="none" stroke="${color}" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

function gearPath(cx,cy,outer,inner,teeth){
  const pts=[];const step=Math.PI*2/teeth;
  for(let i=0;i<teeth;i++){
    const a=i*step-Math.PI/2;
    for(const [da,r] of [[-.30,inner],[-.17,outer],[.17,outer],[.30,inner]])pts.push([cx+Math.cos(a+da*step*1.6)*r,cy+Math.sin(a+da*step*1.6)*r]);
  }
  return 'M'+pts.map(p=>p.map(v=>v.toFixed(1)).join(' ')).join('L')+'Z';
}

const icons=[
  // 0 credits: two stacked coins
  ()=>glyph(circle(54,70,34),'brass')+glyph(circle(74,56,36),'brass')+line(circle(74,56,24),'#7A4A22',4,.8)+`<path d="M74 42 86 49v14L74 70 62 63V49Z" fill="#8A5428" stroke="#5B3315" stroke-width="3" stroke-linejoin="round"/>`,
  // 1 energy / action point
  ()=>glyph('M74 12 34 72h28l-10 46 46-64H70l12-42Z','cyan'),
  // 2 day calendar
  ()=>glyph(rect(20,28,88,80,12),'paper')+`<path d="${rect(20,28,88,26,12)}" fill="url(#rust)"/>`+glyph(rect(36,16,12,26,5),'steel')+glyph(rect(80,16,12,26,5),'steel')
    +[0,1,2].map(r=>[0,1,2].map(c=>`<rect x="${36+c*22}" y="${64+r*14}" width="12" height="8" rx="2" fill="#6A5A48"/>`).join('')).join(''),
  // 3 settings gear
  ()=>glyph(gearPath(64,64,48,36,9),'steel')+glyph(circle(64,64,15),'brass'),
  // 4 handbook
  ()=>glyph('M14 34c18-8 34-6 50 6c16-12 32-14 50-6v70c-18-8-34-6-50 6c-16-12-32-14-50-6Z','paper')+ink('M64 40v68',5)+line('M26 52c10-3 20-2 28 3M26 66c10-3 20-2 28 3M26 80c10-3 20-2 28 3M74 55c8-5 18-6 28-3M74 69c8-5 18-6 28-3','#8B7356',3.5),
  // 5 station alert
  ()=>glyph('M64 14 116 106H12Z','rust')+`<rect x="58" y="44" width="12" height="36" rx="5" fill="${INK}"/><circle cx="64" cy="92" r="7" fill="${INK}"/>`,
  // 6 sound on
  ()=>glyph('M18 50h20l26-22v72L38 78H18Z','steel')+line('M80 46c8 10 8 26 0 36M94 34c16 18 16 42 0 60',INK,13)+line('M80 46c8 10 8 26 0 36M94 34c16 18 16 42 0 60','#7CE3DD',6),
  // 7 sound off
  ()=>glyph('M18 50h20l26-22v72L38 78H18Z','steel')+line('M82 48l30 32M112 48 82 80',INK,13)+line('M82 48l30 32M112 48 82 80','#E98A5A',6),
  // 8 counter: service bell
  ()=>glyph(rect(14,92,100,16,6),'steel')+glyph('M22 92c0-30 18-50 42-50s42 20 42 50Z','brass')+glyph(rect(56,24,16,14,5),'brass')+line('M44 62c4-8 10-12 18-14','#FFF6DE',4,.7),
  // 9 inspect: magnifier
  ()=>glyph('M74 78l12-12 32 32-12 12Z','rust')+glyph(circle(52,52,38),'steel')+`<path d="${circle(52,52,26)}" fill="url(#lens)"/>`+line('M38 40c4-6 10-9 16-9','#FFFFFF',4,.8),
  // 10 repair: wrench
  ()=>glyph('M88 14a26 26 0 0 0-28 34L18 90a12 12 0 0 0 0 18l2 2a12 12 0 0 0 18 0l42-42a26 26 0 0 0 34-28L98 56 82 50 76 34Z','steel')+`<circle cx="30" cy="98" r="6" fill="${INK}"/>`,
  // 11 warehouse: crate
  ()=>glyph('M64 14 112 38v54L64 116 16 92V38Z','brass')+`<path d="M64 62 112 38v54L64 116Z" fill="#000" fill-opacity=".22"/><path d="M64 14 112 38 64 62 16 38Z" fill="#FFF" fill-opacity=".18"/>`+ink('M64 62v54M16 38l48 24 48-24',5)+line('M30 58v38M46 66v38M82 66v38M98 58v38','#6E4724',3,.7),
  // 12 orders: clipboard
  ()=>glyph(rect(22,20,84,98,10),'rust')+glyph(rect(32,34,64,74,4),'paper')+glyph(rect(44,12,40,20,6),'steel')+line('M42 54h44M42 70h44M42 86h28','#7D6A55',5),
  // 13 report: receipt + coin
  ()=>glyph('M28 12h60v100l-10-8-10 8-10-8-10 8-10-8-10 8Z','paper')+line('M40 34h36M40 50h36M40 66h24','#7D6A55',5)+glyph(circle(92,90,22),'brass')+line('M98 82a10 10 0 1 0 0 16','#5B3315',5),
  // 14 close
  ()=>glyph('M30 20 64 54 98 20l10 10-34 34 34 34-10 10-34-34-34 34-10-10 34-34-34-34Z','steel'),
  // 15 speech bubble
  ()=>glyph('M20 22h88a10 10 0 0 1 10 10v50a10 10 0 0 1-10 10H58l-26 22 4-22H20a10 10 0 0 1-10-10V32a10 10 0 0 1 10-10Z','paper')+`<circle cx="42" cy="57" r="7" fill="#7D6A55"/><circle cx="64" cy="57" r="7" fill="#7D6A55"/><circle cx="86" cy="57" r="7" fill="#7D6A55"/>`,
  // 16 check
  ()=>glyph('M14 66l16-16 22 22 46-50 16 16-62 66Z','cyan'),
  // 17 lock
  ()=>line('M40 58V42a24 24 0 0 1 48 0v16',INK,20)+line('M40 58V42a24 24 0 0 1 48 0v16','url(#steel)',10)+glyph(rect(26,56,76,58,10),'brass')+`<circle cx="64" cy="80" r="8" fill="${INK}"/><rect x="60" y="82" width="8" height="18" rx="3" fill="${INK}"/>`,
  // 18 save disk
  ()=>glyph('M20 20h72l16 16v72H20Z','steel')+glyph(rect(36,20,48,30,3),'paper')+glyph(rect(34,68,60,40,4),'paper')+`<rect x="66" y="26" width="10" height="18" fill="${INK}"/>`,
  // 19 rotate
  ()=>line('M98 64a34 34 0 1 1-12-26',INK,20)+line('M98 64a34 34 0 1 1-12-26','url(#steel)',10)+glyph('M78 16l34 10-26 26Z','cyan'),
  // 20 flip
  ()=>glyph('M10 64 46 30v20h12v28H46v20Z','steel')+glyph('M118 64 82 30v20H70v28h12v20Z','cyan')+line('M64 18v92',INK,8)+line('M64 18v92','#DDE4DF',3),
  // 21 recentre target
  ()=>line(circle(64,64,36),INK,18)+line(circle(64,64,36),'url(#steel)',8)+glyph(circle(64,64,12),'brass')+line('M64 8v24M64 96v24M8 64h24M96 64h24',INK,14)+line('M64 8v24M64 96v24M8 64h24M96 64h24','#DDE4DF',6),
  // 22 plus
  ()=>glyph('M54 18h20v36h36v20H74v36H54V74H18V54h36Z','steel'),
  // 23 minus
  ()=>glyph('M18 54h92v20H18Z','steel'),
];

const CELL=128,COLS=8,ROWS=3;
const cells=await Promise.all(icons.map(async(draw,i)=>({
  input:await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CELL}" height="${CELL}" viewBox="0 0 128 128">${defs}${draw()}</svg>`)).png().toBuffer(),
  left:(i%COLS)*CELL,top:Math.floor(i/COLS)*CELL,
})));
await sharp({create:{width:CELL*COLS,height:CELL*ROWS,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(cells).png({compressionLevel:9}).toFile(resolve(art,'orbital-hud.png'));

// Surface kit: cell 0 thermal paper (inset 64), cell 1 CRT bezel (inset 72).
const noise=(seed,freq,op)=>`<filter id="n${seed}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${seed}"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .27  0 0 0 0 .18  0 0 0 ${op} 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;
const paper=`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
<defs>${noise(3,.9,.22)}${noise(7,.035,.14)}
<linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBF5E8"/><stop offset=".6" stop-color="#F2E9D4"/><stop offset="1" stop-color="#E4D7BB"/></linearGradient></defs>
<rect x="8" y="8" width="496" height="496" rx="6" fill="url(#pg)"/>
<rect x="8" y="8" width="496" height="496" rx="6" fill="#fff" filter="url(#n3)"/>
<rect x="8" y="8" width="496" height="496" rx="6" fill="#fff" filter="url(#n7)"/>
<rect x="8.5" y="8.5" width="495" height="495" rx="6" fill="none" stroke="#8C7A5C" stroke-opacity=".55"/>
<rect x="30" y="30" width="452" height="452" rx="2" fill="none" stroke="#B9A580" stroke-opacity=".5" stroke-dasharray="2 6"/>
</svg>`;
const crt=`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
<defs>
<linearGradient id="bz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A5452"/><stop offset=".5" stop-color="#262E30"/><stop offset="1" stop-color="#121719"/></linearGradient>
<radialGradient id="glass" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#123A3A"/><stop offset=".7" stop-color="#0A2226"/><stop offset="1" stop-color="#040C0F"/></radialGradient>
<linearGradient id="glare" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".16"/><stop offset=".35" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
</defs>
<rect x="6" y="6" width="500" height="500" rx="26" fill="#0A0D0E"/>
<rect x="10" y="10" width="492" height="492" rx="24" fill="url(#bz)"/>
<rect x="10.5" y="10.5" width="491" height="491" rx="24" fill="none" stroke="#9BA6A0" stroke-opacity=".45"/>
<rect x="34" y="34" width="444" height="444" rx="18" fill="#030708"/>
<rect x="40" y="40" width="432" height="432" rx="16" fill="url(#glass)"/>
<rect x="40" y="40" width="432" height="432" rx="16" fill="url(#glare)"/>
<rect x="40.5" y="40.5" width="431" height="431" rx="16" fill="none" stroke="#6EE0DA" stroke-opacity=".22"/>
</svg>`;
const kit=await Promise.all([paper,crt].map(async(svg,i)=>({input:await sharp(Buffer.from(svg)).png().toBuffer(),left:i*512,top:0})));
await sharp({create:{width:1024,height:512,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(kit).png({compressionLevel:9}).toFile(resolve(art,'orbital-ui-kit.png'));
console.log('UI art written: orbital-hud.png (24 icons), orbital-ui-kit.png (paper, CRT).');
