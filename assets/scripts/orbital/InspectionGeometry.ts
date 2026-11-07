/** Geometry only: screen coordinates are +x right / +y down; x/y identify the rotation centre.
 * Angles follow Creator (+degrees counterclockwise), so the screen-space y rotation is inverted.
 */
export interface InspectionRect {x:number;y:number;width:number;height:number}
export interface InspectionPose {x:number;y:number;angle:number;zoom:number;mirrorX:boolean;mirrorY:boolean}
export interface InspectionZoomLimits {minZoom?:number;maxZoom?:number}
export interface InspectionConstraintOptions extends InspectionZoomLimits {
  defaults?:Partial<InspectionPose>;
  /** Inset from each edge of the work mat, in screen units. */
  padding?:number;
}
export interface InspectionConstraint {
  pose:InspectionPose;
  aabb:InspectionRect;
  /** Applied zoom / requested, normalized zoom. Can be below minZoom to guarantee containment. */
  fitScale:number;
  shrunk:boolean;
  /** True if the centre was moved to keep the transformed object inside the mat. */
  clamped:boolean;
}

const finite=(n:number|undefined,fallback:number):number=>typeof n==='number'&&Number.isFinite(n)?n:fallback;
const clamp=(n:number,lo:number,hi:number):number=>Math.max(lo,Math.min(hi,n));
const positive=(n:number|undefined,fallback:number):number=>finite(n,fallback)>0?finite(n,fallback):fallback;
const degrees=(n:number):number=>((n%360)+360)%360;

/** Removes invalid numbers; zoom is a positive magnitude and mirroring is explicit. */
export function normalizePose(input:Partial<InspectionPose>={},defaults:Partial<InspectionPose>={},limits:InspectionZoomLimits={}):InspectionPose {
  const a=positive(limits.minZoom,.65),b=positive(limits.maxZoom,1.35),min=Math.min(a,b),max=Math.max(a,b);
  const defaultZoom=positive(defaults.zoom,1);
  return {
    x:finite(input.x,finite(defaults.x,0)),
    y:finite(input.y,finite(defaults.y,0)),
    angle:degrees(finite(input.angle,finite(defaults.angle,0))),
    zoom:clamp(finite(input.zoom,defaultZoom),min,max),
    mirrorX:typeof input.mirrorX==='boolean'?input.mirrorX:defaults.mirrorX===true,
    mirrorY:typeof input.mirrorY==='boolean'?input.mirrorY:defaults.mirrorY===true,
  };
}

/** Canonicalizes negative rectangle sizes and restores non-finite values to a finite unit rect. */
function rect(input:InspectionRect):InspectionRect {
  const x=finite(input.x,0),y=finite(input.y,0),w=finite(input.width,1),h=finite(input.height,1);
  return {x:x+Math.min(0,w),y:y+Math.min(0,h),width:Math.abs(w),height:Math.abs(h)};
}

function rotation(angle:number):{c:number;s:number} {
  const r=angle*Math.PI/180,c=Math.cos(r),s=Math.sin(r);
  // Avoid false overflows at exact quarter turns from sin/cos roundoff.
  return {c:Math.abs(c)<1e-12?0:c,s:Math.abs(s)<1e-12?0:s};
}

/**
 * localRect is the visible object's bounds relative to its centre pivot, BEFORE zoom/mirroring.
 * For a centred 600×390 object use {x:-300,y:-195,width:600,height:390}.
 * An off-centre sprite is also supported: its rotated offset is included when clamping the pivot.
 * Every drag/rotation/zoom update should use the returned pose before updating the scene node.
 */
export function constrain(input:Partial<InspectionPose>,localRect:InspectionRect,workMatRect:InspectionRect,options:InspectionConstraintOptions={}):InspectionConstraint {
  const pose=normalizePose(input,options.defaults,options),local=rect(localRect),mat=rect(workMatRect);
  const requestedZoom=pose.zoom,originalX=pose.x,originalY=pose.y;
  const padding=clamp(finite(options.padding,0),0,Math.min(mat.width,mat.height)/2);
  const left=mat.x+padding,top=mat.y+padding,width=mat.width-2*padding,height=mat.height-2*padding;
  const {c,s}=rotation(pose.angle),ac=Math.abs(c),as=Math.abs(s);
  const rotatedWidth=ac*local.width+as*local.height,rotatedHeight=as*local.width+ac*local.height;
  const fit=Math.min(rotatedWidth>0?width/rotatedWidth:Infinity,rotatedHeight>0?height/rotatedHeight:Infinity);
  // Fit takes precedence over minZoom: otherwise a large/rotated object could still cover HUD.
  if(pose.zoom>fit)pose.zoom=Math.max(0,fit*(1-1e-12));
  const halfWidth=rotatedWidth*pose.zoom/2,halfHeight=rotatedHeight*pose.zoom/2;
  const cx=(local.x+local.width/2)*pose.zoom*(pose.mirrorX?-1:1);
  const cy=(local.y+local.height/2)*pose.zoom*(pose.mirrorY?-1:1);
  const offsetX=c*cx+s*cy,offsetY=-s*cx+c*cy;
  pose.x=clamp(pose.x,left+halfWidth-offsetX,left+width-halfWidth-offsetX);
  pose.y=clamp(pose.y,top+halfHeight-offsetY,top+height-halfHeight-offsetY);
  const aabb={x:pose.x+offsetX-halfWidth,y:pose.y+offsetY-halfHeight,width:halfWidth*2,height:halfHeight*2};
  return {pose,aabb,fitScale:pose.zoom/requestedZoom,shrunk:pose.zoom<requestedZoom,clamped:pose.x!==originalX||pose.y!==originalY};
}
