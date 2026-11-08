import {mkdir,rm,cp,readFile,writeFile,readdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {build} from 'esbuild';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const engine=join(root,'.cache/cocos/runtime/cc.js');
if(!existsSync(engine)){
  const r=spawnSync(process.execPath,[join(root,'scripts/prepare-engine.mjs')],{cwd:root,stdio:'inherit'});
  if(r.status!==0)process.exit(r.status||1);
}
const dist=join(root,'dist');await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
await cp(join(root,'assets/resources'),join(dist,'resources'),{recursive:true,filter:p=>{
  if(p.endsWith('.meta'))return false;
  const name=p.split('/').pop();
  if(p.includes('/art/')&&!name.startsWith('orbital-')&&name!=='hands.png')return false;
  if(p.includes('/fonts/')&&name.startsWith('greyline-'))return false;
  return true;
}});
let artExt='png';
try {
  const {default:sharp}=await import('sharp');
  const art=join(dist,'resources/art');
  // Full-window scenes are drawn at up to ~1.7× their painted size on high-DPI screens.
  // A Lanczos pre-scale with a light sharpen keeps edges crisper than GPU bilinear does.
  const scenes=new Set(['orbital-counter.png','orbital-workbench.png','orbital-warehouse.png']);
  for(const f of await readdir(art))if(f.endsWith('.png')){
    let image=sharp(join(art,f));
    if(scenes.has(f)){
      const {width,height}=await image.metadata();
      image=sharp(await image.resize(Math.round(width*1.5),Math.round(height*1.5),{kernel:'lanczos3'}).sharpen({sigma:.8,m1:.6,m2:1.2}).toBuffer());
    }
    await image.webp({quality:94,alphaQuality:100,smartSubsample:true,effort:5}).toFile(join(art,f.replace(/\.png$/,'.webp')));
    await rm(join(art,f));
  }
  artExt='webp';
}catch(error){console.warn('PNG assets retained (optional sharp unavailable):',error.code||error.message);}
await cp(join(root,'vendor/cc-builtin-effects.json'),join(dist,'builtin-effects.json'));
await mkdir(join(dist,'licenses'),{recursive:true});
await cp(join(root,'vendor/COCOS-LICENSE.txt'),join(dist,'licenses/COCOS-LICENSE.txt'));
await cp(join(root,'favicon.svg'),join(dist,'favicon.svg'));
await cp(join(root,'web/index.html'),join(dist,'index.html'));
const source=(await readFile(join(root,'web/entry.ts'),'utf8')).replace('__ART_EXT__',artExt);
await build({stdin:{contents:source,resolveDir:join(root,'web'),sourcefile:'entry.ts',loader:'ts'},bundle:true,format:'esm',platform:'browser',target:'es2020',alias:{cc:engine},outfile:join(dist,'game.js'),minify:true,sourcemap:'external',tsconfig:join(root,'tsconfig.web.json'),legalComments:'linked',define:{'process.env.NODE_ENV':'"production"'}});
const codeHash=createHash('sha256').update(await readFile(join(dist,'game.js'))).digest('hex').slice(0,12);
await writeFile(join(dist,'index.html'),(await readFile(join(root,'web/index.html'),'utf8')).replace('src="./game.js"',`src="./game.js?v=${codeHash}"`));
await writeFile(join(dist,'version.json'),JSON.stringify({ui:'orbital-p0-v18',engine:'Cocos Creator 3.8.8',sourceEngine:'411f98df047c25902f93440d4b22925c2fb65461',art:artExt,features:['场景灯光蒸汽屏幕与舷窗驳船环境动效','台灯咖啡杯显示器舷窗样品管可点按道具','服务铃接客与后货架库存陈列','贴图三线性mipmap与场景高清预缩放','自适应全画布场景与手动全屏入口','真实库存陈列柜与原物拿取拖放','水芯保温杯台灯十二个分层部件交互','按原物UID保留检视姿态与正常物证计费','初始化加载页改为金属闸门日期牌','手机实物仪器预览与逐步动作反馈','手机递物维修扫描与成交动画位置修正','新增20件独立正反面道具与8张委托','4位新人物及采购偏好与来访对白','21类可选择的每日经营事件','开场与换天共享舱门日期风格','横屏手机大按钮与原生触屏操作面板','新手引导与经营手册','工具/扫描/维修/交割/换天动作动画','标题画面与游戏化HUD','金属铭牌面板/CRT读数/热敏纸票据UI','台后半身人物与实体仪器UI','空间站三场景','56类货物与112张正反面图格','六种不同鉴定操作','维修拆解组装','占格仓库与安检','订单交付与升级','顾客底价预算与三轮议价','种子货源每日六客','32张错峰订单','12AP与Cr经济','21日经营']},null,2));
await writeFile(join(dist,'.nojekyll'),'');
console.log('Creator Web build ready: dist/');
