import { game, Game, director, Scene, Node, ResolutionPolicy } from 'cc';
import { CreatorMain } from '../assets/scripts/CreatorMain';
import { registerBuiltins } from './register-builtins';

const host=globalThis as typeof globalThis & {__GREYLINE_WEB__?:boolean;__GREYLINE_ART_EXT__?:string;__ORBITAL_TOUCH__?:'phone'|'tablet'|''};
host.__GREYLINE_WEB__=true;
host.__GREYLINE_ART_EXT__='__ART_EXT__';
// H5: phones and tablets get a touch layout (larger small text, visible icon captions).
const coarse=typeof matchMedia==='function'&&matchMedia('(pointer: coarse)').matches;
host.__ORBITAL_TOUCH__=!coarse?'':Math.min(screen.width,screen.height)<600?'phone':'tablet';

async function main():Promise<void> {
  const status=document.querySelector('#load-status');
  if(status)status.textContent='正在准备场景与旧物…';
  // Cocos' system-font Label can use the same font as Creator's TTF resource.
  await Promise.all([document.fonts.load('24px "Orbital Sans SC"'),document.fonts.load('24px "Orbital Mono"'),document.fonts.ready]);
  await registerBuiltins('./builtin-effects.json');
  await game.init({
    debugMode:0,
    overrideSettings:{
      rendering:{renderMode:0,customPipeline:false},
      // Landscape-only game: on a phone held upright Cocos rotates the frame and remaps touches.
      screen:{frameRate:60,orientation:'landscape',designResolution:{width:1600,height:900,policy:ResolutionPolicy.SHOW_ALL}},
      splashScreen:{totalTime:0},
      assets:{preloadBundles:[]},
    },
  });
  game.run(()=>{
    const scene=new Scene('OrbitalExchange');
    const root=new Node('Bootstrap');scene.addChild(root);root.addComponent<CreatorMain>(CreatorMain);
    director.runSceneImmediate(scene);
  });
}
document.addEventListener('greyline-ready',()=>{document.getElementById('loading')?.remove();document.getElementById('GameCanvas')?.focus();},{once:true});
// Android browsers allow fullscreen + landscape lock after a user gesture; iOS ignores this
// (use “添加到主屏幕” for a chrome-less window there).
if(host.__ORBITAL_TOUCH__&&document.fullscreenEnabled&&/Android/i.test(navigator.userAgent)){
  const enter=()=>{document.documentElement.requestFullscreen({navigationUI:'hide'}).then(()=>{
    const o=screen.orientation as ScreenOrientation&{lock?:(t:string)=>Promise<void>};o.lock?.('landscape').catch(()=>{});
  }).catch(()=>{});};
  document.addEventListener('touchend',enter,{once:true,passive:true});
}
document.addEventListener('keydown',event=>{if(document.activeElement?.id==='GameCanvas'&&['Tab','Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.code))event.preventDefault();});
main().catch(error=>{
  console.error('Cannot start Creator game',error);
  const loading=document.getElementById('loading');
  if(loading){loading.classList.add('failed');loading.innerHTML='<h1>空间站暂时未能接通</h1><p>请检查网络和浏览器 WebGL 支持后重试。</p><button onclick="location.reload()">重新打开</button>';}
});
