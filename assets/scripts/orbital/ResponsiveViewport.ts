import {ResolutionPolicy,view} from 'cc';

const WIDTH=1600,HEIGHT=900;
export type ViewportBounds={x:number;y:number;width:number;height:number};

/** Fill the engine frame without stretching or clipping the centered legacy UI. */
export function configureViewport():void {
  // Cocos has already swapped this size when a portrait phone uses landscape rotation.
  // Raw innerWidth/innerHeight would select the wrong policy in that orientation.
  const frame=view.getCanvasSize();
  if(!(frame.width>0&&frame.height>0))return;
  const wide=frame.width*HEIGHT>=frame.height*WIDTH;
  const strategy=wide?ResolutionPolicy.ContentStrategy.FIXED_HEIGHT:ResolutionPolicy.ContentStrategy.FIXED_WIDTH;
  const design=view.getDesignResolutionSize();
  view.resizeWithBrowserSize(true);
  // setDesignResolutionSize emits design-resolution-changed synchronously, even if unchanged.
  if(design.width===WIDTH&&design.height===HEIGHT&&view.getResolutionPolicy().getContentStrategy()===strategy)return;
  view.setDesignResolutionSize(WIDTH,HEIGHT,wide?ResolutionPolicy.FIXED_HEIGHT:ResolutionPolicy.FIXED_WIDTH);
}

/** Top-left, y-down coordinates relative to a 1600×900 root placed at (-800,450). */
export function viewportBounds():ViewportBounds {
  const visible=view.getVisibleSize();
  const width=Number.isFinite(visible.width)&&visible.width>0?visible.width:WIDTH;
  const height=Number.isFinite(visible.height)&&visible.height>0?visible.height:HEIGHT;
  return{x:(WIDTH-width)/2,y:(HEIGHT-height)/2,width,height};
}

/** Reapply the safe axis after engine resize, then redraw only when scene bounds change. */
export function bindResponsiveViewport(onChange:()=>void):()=>void {
  let disposed=false,refreshing=false,previous:ViewportBounds|undefined;
  const refresh=()=>{
    if(disposed||refreshing)return;
    refreshing=true;
    try{
      configureViewport();
      const next=viewportBounds();
      if(!previous||next.width!==previous.width||next.height!==previous.height){
        previous=next;
        onChange();
      }
    }finally{refreshing=false;}
  };
  view.on('canvas-resize',refresh);
  view.on('design-resolution-changed',refresh);
  refresh();
  return()=>{
    if(disposed)return;
    disposed=true;
    view.off('canvas-resize',refresh);
    view.off('design-resolution-changed',refresh);
  };
}

/** Call directly from a real input gesture; denied/unsupported requests resolve false. */
export async function toggleBrowserFullscreen():Promise<boolean> {
  if(typeof document==='undefined')return false;
  try{
    if(document.fullscreenElement){
      if(typeof document.exitFullscreen!=='function')return false;
      await document.exitFullscreen();
      return !document.fullscreenElement;
    }
    const element=document.documentElement;
    if(document.fullscreenEnabled===false||typeof element.requestFullscreen!=='function')return false;
    await element.requestFullscreen({navigationUI:'hide'});
    // Rotation lock is optional; Cocos still rotates and remaps an upright phone itself.
    if(typeof navigator!=='undefined'&&/Android/i.test(navigator.userAgent)){
      const orientation=globalThis.screen?.orientation as ScreenOrientation&{lock?:(value:string)=>Promise<void>};
      try{await orientation?.lock?.('landscape');}catch{}
    }
    return document.fullscreenElement===element;
  }catch{return false;}
}
