(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))o(l);new MutationObserver(l=>{for(const u of l)if(u.type==="childList")for(const d of u.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function i(l){const u={};return l.integrity&&(u.integrity=l.integrity),l.referrerPolicy&&(u.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?u.credentials="include":l.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function o(l){if(l.ep)return;l.ep=!0;const u=i(l);fetch(l.href,u)}})();function my(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var Lh={exports:{}},El={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var W_;function X1(){if(W_)return El;W_=1;var r=Symbol.for("react.transitional.element"),t=Symbol.for("react.fragment");function i(o,l,u){var d=null;if(u!==void 0&&(d=""+u),l.key!==void 0&&(d=""+l.key),"key"in l){u={};for(var h in l)h!=="key"&&(u[h]=l[h])}else u=l;return l=u.ref,{$$typeof:r,type:o,key:d,ref:l!==void 0?l:null,props:u}}return El.Fragment=t,El.jsx=i,El.jsxs=i,El}var Z_;function q1(){return Z_||(Z_=1,Lh.exports=X1()),Lh.exports}var p=q1(),Oh={exports:{}},ct={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var K_;function Y1(){if(K_)return ct;K_=1;var r=Symbol.for("react.transitional.element"),t=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),u=Symbol.for("react.consumer"),d=Symbol.for("react.context"),h=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),v=Symbol.for("react.memo"),x=Symbol.for("react.lazy"),g=Symbol.for("react.activity"),S=Symbol.for("react.view_transition"),y=Symbol.iterator;function T(F){return F===null||typeof F!="object"?null:(F=y&&F[y]||F["@@iterator"],typeof F=="function"?F:null)}var C={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},E=Object.assign,M={};function O(F,he,ee){this.props=F,this.context=he,this.refs=M,this.updater=ee||C}O.prototype.isReactComponent={},O.prototype.setState=function(F,he){if(typeof F!="object"&&typeof F!="function"&&F!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,F,he,"setState")},O.prototype.forceUpdate=function(F){this.updater.enqueueForceUpdate(this,F,"forceUpdate")};function I(){}I.prototype=O.prototype;function D(F,he,ee){this.props=F,this.context=he,this.refs=M,this.updater=ee||C}var V=D.prototype=new I;V.constructor=D,E(V,O.prototype),V.isPureReactComponent=!0;var H=Array.isArray;function z(){}var X={H:null,A:null,T:null,S:null},w=Object.prototype.hasOwnProperty;function N(F,he,ee){var re=ee.ref;return{$$typeof:r,type:F,key:he,ref:re!==void 0?re:null,props:ee}}function B(F,he){return N(F.type,he,F.props)}function k(F){return typeof F=="object"&&F!==null&&F.$$typeof===r}function le(F){var he={"=":"=0",":":"=2"};return"$"+F.replace(/[=:]/g,function(ee){return he[ee]})}var pe=/\/+/g;function fe(F,he){return typeof F=="object"&&F!==null&&F.key!=null?le(""+F.key):he.toString(36)}function q(F){switch(F.status){case"fulfilled":return F.value;case"rejected":throw F.reason;default:switch(typeof F.status=="string"?F.then(z,z):(F.status="pending",F.then(function(he){F.status==="pending"&&(F.status="fulfilled",F.value=he)},function(he){F.status==="pending"&&(F.status="rejected",F.reason=he)})),F.status){case"fulfilled":return F.value;case"rejected":throw F.reason}}throw F}function se(F,he,ee,re,Ee){var we=typeof F;(we==="undefined"||we==="boolean")&&(F=null);var Q=!1;if(F===null)Q=!0;else switch(we){case"bigint":case"string":case"number":Q=!0;break;case"object":switch(F.$$typeof){case r:case t:Q=!0;break;case x:return Q=F._init,se(Q(F._payload),he,ee,re,Ee)}}if(Q)return Ee=Ee(F),Q=re===""?"."+fe(F,0):re,H(Ee)?(ee="",Q!=null&&(ee=Q.replace(pe,"$&/")+"/"),se(Ee,he,ee,"",function(P){return P})):Ee!=null&&(k(Ee)&&(Ee=B(Ee,ee+(Ee.key==null||F&&F.key===Ee.key?"":(""+Ee.key).replace(pe,"$&/")+"/")+Q)),he.push(Ee)),1;Q=0;var de=re===""?".":re+":";if(H(F))for(var je=0;je<F.length;je++)re=F[je],we=de+fe(re,je),Q+=se(re,he,ee,we,Ee);else if(je=T(F),typeof je=="function")for(F=je.call(F),je=0;!(re=F.next()).done;)re=re.value,we=de+fe(re,je++),Q+=se(re,he,ee,we,Ee);else if(we==="object"){if(typeof F.then=="function")return se(q(F),he,ee,re,Ee);throw he=String(F),Error("Objects are not valid as a React child (found: "+(he==="[object Object]"?"object with keys {"+Object.keys(F).join(", ")+"}":he)+"). If you meant to render a collection of children, use an array instead.")}return Q}function W(F,he,ee){if(F==null)return F;var re=[],Ee=0;return se(F,re,"","",function(we){return he.call(ee,we,Ee++)}),re}function xe(F){if(F._status===-1){var he=F._result,ee=he();ee.then(function(re){(F._status===0||F._status===-1)&&(F._status=1,F._result=re,ee.status===void 0&&(ee.status="fulfilled",ee.value=re))},function(re){(F._status===0||F._status===-1)&&(F._status=2,F._result=re,ee.status===void 0&&(ee.status="rejected",ee.reason=re))}),F._status===-1&&(F._status=0,F._result=ee)}if(F._status===1)return F._result.default;throw F._result}var Se=typeof reportError=="function"?reportError:function(F){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var he=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof F=="object"&&F!==null&&typeof F.message=="string"?String(F.message):String(F),error:F});if(!window.dispatchEvent(he))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",F);return}console.error(F)};function Pe(F){var he=X.T,ee={};ee.types=he!==null?he.types:null,X.T=ee;try{var re=F(),Ee=X.S;Ee!==null&&Ee(ee,re),typeof re=="object"&&re!==null&&typeof re.then=="function"&&re.then(z,Se)}catch(we){Se(we)}finally{he!==null&&ee.types!==null&&(he.types=ee.types),X.T=he}}function Je(F){var he=X.T;if(he!==null){var ee=he.types;ee===null?he.types=[F]:ee.indexOf(F)===-1&&ee.push(F)}else Pe(Je.bind(null,F))}var xt={map:W,forEach:function(F,he,ee){W(F,function(){he.apply(this,arguments)},ee)},count:function(F){var he=0;return W(F,function(){he++}),he},toArray:function(F){return W(F,function(he){return he})||[]},only:function(F){if(!k(F))throw Error("React.Children.only expected to receive a single React element child.");return F}};return ct.Activity=g,ct.Children=xt,ct.Component=O,ct.Fragment=i,ct.Profiler=l,ct.PureComponent=D,ct.StrictMode=o,ct.Suspense=m,ct.ViewTransition=S,ct.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=X,ct.__COMPILER_RUNTIME={__proto__:null,c:function(F){return X.H.useMemoCache(F)}},ct.addTransitionType=Je,ct.cache=function(F){return function(){return F.apply(null,arguments)}},ct.cacheSignal=function(){return null},ct.cloneElement=function(F,he,ee){if(F==null)throw Error("The argument must be a React element, but you passed "+F+".");var re=E({},F.props),Ee=F.key;if(he!=null)for(we in he.key!==void 0&&(Ee=""+he.key),he)!w.call(he,we)||we==="key"||we==="__self"||we==="__source"||we==="ref"&&he.ref===void 0||(re[we]=he[we]);var we=arguments.length-2;if(we===1)re.children=ee;else if(1<we){for(var Q=Array(we),de=0;de<we;de++)Q[de]=arguments[de+2];re.children=Q}return N(F.type,Ee,re)},ct.createContext=function(F){return F={$$typeof:d,_currentValue:F,_currentValue2:F,_threadCount:0,Provider:null,Consumer:null},F.Provider=F,F.Consumer={$$typeof:u,_context:F},F},ct.createElement=function(F,he,ee){var re,Ee={},we=null;if(he!=null)for(re in he.key!==void 0&&(we=""+he.key),he)w.call(he,re)&&re!=="key"&&re!=="__self"&&re!=="__source"&&(Ee[re]=he[re]);var Q=arguments.length-2;if(Q===1)Ee.children=ee;else if(1<Q){for(var de=Array(Q),je=0;je<Q;je++)de[je]=arguments[je+2];Ee.children=de}if(F&&F.defaultProps)for(re in Q=F.defaultProps,Q)Ee[re]===void 0&&(Ee[re]=Q[re]);return N(F,we,Ee)},ct.createRef=function(){return{current:null}},ct.forwardRef=function(F){return{$$typeof:h,render:F}},ct.isValidElement=k,ct.lazy=function(F){return{$$typeof:x,_payload:{_status:-1,_result:F},_init:xe}},ct.memo=function(F,he){return{$$typeof:v,type:F,compare:he===void 0?null:he}},ct.startTransition=Pe,ct.unstable_useCacheRefresh=function(){return X.H.useCacheRefresh()},ct.use=function(F){return X.H.use(F)},ct.useActionState=function(F,he,ee){return X.H.useActionState(F,he,ee)},ct.useCallback=function(F,he){return X.H.useCallback(F,he)},ct.useContext=function(F){return X.H.useContext(F)},ct.useDebugValue=function(){},ct.useDeferredValue=function(F,he){return X.H.useDeferredValue(F,he)},ct.useEffect=function(F,he){return X.H.useEffect(F,he)},ct.useEffectEvent=function(F){return X.H.useEffectEvent(F)},ct.useId=function(){return X.H.useId()},ct.useImperativeHandle=function(F,he,ee){return X.H.useImperativeHandle(F,he,ee)},ct.useInsertionEffect=function(F,he){return X.H.useInsertionEffect(F,he)},ct.useLayoutEffect=function(F,he){return X.H.useLayoutEffect(F,he)},ct.useMemo=function(F,he){return X.H.useMemo(F,he)},ct.useOptimistic=function(F,he){return X.H.useOptimistic(F,he)},ct.useReducer=function(F,he,ee){return X.H.useReducer(F,he,ee)},ct.useRef=function(F){return X.H.useRef(F)},ct.useState=function(F){return X.H.useState(F)},ct.useSyncExternalStore=function(F,he,ee){return X.H.useSyncExternalStore(F,he,ee)},ct.useTransition=function(){return X.H.useTransition()},ct.version="19.3.1",ct}var Q_;function Em(){return Q_||(Q_=1,Oh.exports=Y1()),Oh.exports}var dt=Em();const W1=my(dt);var zh={exports:{}},Tl={},Ph={exports:{}},Ih={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var J_;function Z1(){return J_||(J_=1,(function(r){function t(q,se){var W=q.length;q.push(se);e:for(;0<W;){var xe=W-1>>>1,Se=q[xe];if(0<l(Se,se))q[xe]=se,q[W]=Se,W=xe;else break e}}function i(q){return q.length===0?null:q[0]}function o(q){if(q.length===0)return null;var se=q[0],W=q.pop();if(W!==se){q[0]=W;e:for(var xe=0,Se=q.length,Pe=Se>>>1;xe<Pe;){var Je=2*(xe+1)-1,xt=q[Je],F=Je+1,he=q[F];if(0>l(xt,W))F<Se&&0>l(he,xt)?(q[xe]=he,q[F]=W,xe=F):(q[xe]=xt,q[Je]=W,xe=Je);else if(F<Se&&0>l(he,W))q[xe]=he,q[F]=W,xe=F;else break e}}return se}function l(q,se){var W=q.sortIndex-se.sortIndex;return W!==0?W:q.id-se.id}if(r.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var u=performance;r.unstable_now=function(){return u.now()}}else{var d=Date,h=d.now();r.unstable_now=function(){return d.now()-h}}var m=[],v=[],x=1,g=null,S=3,y=!1,T=!1,C=!1,E=!1,M=typeof setTimeout=="function"?setTimeout:null,O=typeof clearTimeout=="function"?clearTimeout:null,I=typeof setImmediate<"u"?setImmediate:null;function D(q){for(var se=i(v);se!==null;){if(se.callback===null)o(v);else if(se.startTime<=q)o(v),se.sortIndex=se.expirationTime,t(m,se);else break;se=i(v)}}function V(q){if(C=!1,D(q),!T)if(i(m)!==null)T=!0,H||(H=!0,k());else{var se=i(v);se!==null&&fe(V,se.startTime-q)}}var H=!1,z=-1,X=5,w=-1;function N(){return E?!0:!(r.unstable_now()-w<X)}function B(){if(E=!1,H){var q=r.unstable_now();w=q;var se=!0;try{e:{T=!1,C&&(C=!1,O(z),z=-1),y=!0;var W=S;try{t:{for(D(q),g=i(m);g!==null&&!(g.expirationTime>q&&N());){var xe=g.callback;if(typeof xe=="function"){g.callback=null,S=g.priorityLevel;var Se=xe(g.expirationTime<=q);if(q=r.unstable_now(),typeof Se=="function"){g.callback=Se,D(q),se=!0;break t}g===i(m)&&o(m),D(q)}else o(m);g=i(m)}if(g!==null)se=!0;else{var Pe=i(v);Pe!==null&&fe(V,Pe.startTime-q),se=!1}}break e}finally{g=null,S=W,y=!1}se=void 0}}finally{se?k():H=!1}}}var k;if(typeof I=="function")k=function(){I(B)};else if(typeof MessageChannel<"u"){var le=new MessageChannel,pe=le.port2;le.port1.onmessage=B,k=function(){pe.postMessage(null)}}else k=function(){M(B,0)};function fe(q,se){z=M(function(){q(r.unstable_now())},se)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(q){q.callback=null},r.unstable_forceFrameRate=function(q){0>q||125<q?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):X=0<q?Math.floor(1e3/q):5},r.unstable_getCurrentPriorityLevel=function(){return S},r.unstable_next=function(q){switch(S){case 1:case 2:case 3:var se=3;break;default:se=S}var W=S;S=se;try{return q()}finally{S=W}},r.unstable_requestPaint=function(){E=!0},r.unstable_runWithPriority=function(q,se){switch(q){case 1:case 2:case 3:case 4:case 5:break;default:q=3}var W=S;S=q;try{return se()}finally{S=W}},r.unstable_scheduleCallback=function(q,se,W){var xe=r.unstable_now();switch(typeof W=="object"&&W!==null?(W=W.delay,W=typeof W=="number"&&0<W?xe+W:xe):W=xe,q){case 1:var Se=-1;break;case 2:Se=250;break;case 5:Se=1073741823;break;case 4:Se=1e4;break;default:Se=5e3}return Se=W+Se,q={id:x++,callback:se,priorityLevel:q,startTime:W,expirationTime:Se,sortIndex:-1},W>xe?(q.sortIndex=W,t(v,q),i(m)===null&&q===i(v)&&(C?(O(z),z=-1):C=!0,fe(V,W-xe))):(q.sortIndex=Se,t(m,q),T||y||(T=!0,H||(H=!0,k()))),q},r.unstable_shouldYield=N,r.unstable_wrapCallback=function(q){var se=S;return function(){var W=S;S=se;try{return q.apply(this,arguments)}finally{S=W}}}})(Ih)),Ih}var $_;function K1(){return $_||($_=1,Ph.exports=Z1()),Ph.exports}var Bh={exports:{}},Dn={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ex;function Q1(){if(ex)return Dn;ex=1;var r=Em();function t(x){var g="https://react.dev/errors/"+x;if(1<arguments.length){g+="?args[]="+encodeURIComponent(arguments[1]);for(var S=2;S<arguments.length;S++)g+="&args[]="+encodeURIComponent(arguments[S])}return"Minified React error #"+x+"; visit "+g+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var o={d:{f:i,r:function(){throw Error(t(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal"),u=Symbol.for("react.recoverable"),d=Symbol.for("react.optimistic_key");function h(x,g,S){var y=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:y==null?null:y===d?d:""+y,children:x,containerInfo:g,implementation:S}}var m=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function v(x,g){if(x==="font")return"";if(typeof g=="string")return g==="use-credentials"?g:""}return Dn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=o,Dn.browser=function(x){return{$$typeof:u,_reason:x}},Dn.createPortal=function(x,g){var S=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!g||g.nodeType!==1&&g.nodeType!==9&&g.nodeType!==11)throw Error(t(299));return h(x,g,null,S)},Dn.flushSync=function(x){var g=m.T,S=o.p;try{if(m.T=null,o.p=2,x)return x()}finally{m.T=g,o.p=S,o.d.f()}},Dn.preconnect=function(x,g){typeof x=="string"&&(g?(g=g.crossOrigin,g=typeof g=="string"?g==="use-credentials"?g:"":void 0):g=null,o.d.C(x,g))},Dn.prefetchDNS=function(x){typeof x=="string"&&o.d.D(x)},Dn.preinit=function(x,g){if(typeof x=="string"&&g&&typeof g.as=="string"){var S=g.as,y=v(S,g.crossOrigin),T=typeof g.integrity=="string"?g.integrity:void 0,C=typeof g.fetchPriority=="string"?g.fetchPriority:void 0;S==="style"?o.d.S(x,typeof g.precedence=="string"?g.precedence:void 0,{crossOrigin:y,integrity:T,fetchPriority:C}):S==="script"&&o.d.X(x,{crossOrigin:y,integrity:T,fetchPriority:C,nonce:typeof g.nonce=="string"?g.nonce:void 0})}},Dn.preinitModule=function(x,g){if(typeof x=="string")if(typeof g=="object"&&g!==null){if(g.as==null||g.as==="script"){var S=v(g.as,g.crossOrigin);o.d.M(x,{crossOrigin:S,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0})}}else g==null&&o.d.M(x)},Dn.preload=function(x,g){if(typeof x=="string"&&typeof g=="object"&&g!==null&&typeof g.as=="string"){var S=g.as,y=v(S,g.crossOrigin);o.d.L(x,S,{crossOrigin:y,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,type:typeof g.type=="string"?g.type:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0,referrerPolicy:typeof g.referrerPolicy=="string"?g.referrerPolicy:void 0,imageSrcSet:typeof g.imageSrcSet=="string"?g.imageSrcSet:void 0,imageSizes:typeof g.imageSizes=="string"?g.imageSizes:void 0,media:typeof g.media=="string"?g.media:void 0})}},Dn.preloadModule=function(x,g){if(typeof x=="string")if(g){var S=v(g.as,g.crossOrigin);o.d.m(x,{as:typeof g.as=="string"&&g.as!=="script"?g.as:void 0,crossOrigin:S,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0})}else o.d.m(x)},Dn.requestFormReset=function(x){o.d.r(x)},Dn.unstable_batchedUpdates=function(x,g){return x(g)},Dn.useFormState=function(x,g,S){return m.H.useFormState(x,g,S)},Dn.useFormStatus=function(){return m.H.useHostTransitionStatus()},Dn.version="19.3.1",Dn}var tx;function J1(){if(tx)return Bh.exports;tx=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(t){console.error(t)}}return r(),Bh.exports=Q1(),Bh.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var nx;function $1(){if(nx)return Tl;nx=1;var r=K1(),t=Em(),i=J1();function o(e){var n="https://react.dev/errors/"+e;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function u(e){for(var n=e,a=n;a&&!a.alternate;)n=a,(n.flags&4098)!==0&&(e=n.return),a=n.return;for(;n.return;)n=n.return;return n.tag===3?e:null}function d(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function h(e){if(e.tag===31){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function m(e){if(u(e)!==e)throw Error(o(188))}function v(e){var n=e.alternate;if(!n){if(n=u(e),n===null)throw Error(o(188));return n!==e?null:e}for(var a=e,s=n;;){var c=a.return;if(c===null)break;var f=c.alternate;if(f===null){if(s=c.return,s!==null){a=s;continue}break}if(c.child===f.child){for(f=c.child;f;){if(f===a)return m(c),e;if(f===s)return m(c),n;f=f.sibling}throw Error(o(188))}if(a.return!==s.return)a=c,s=f;else{for(var _=!1,b=c.child;b;){if(b===a){_=!0,a=c,s=f;break}if(b===s){_=!0,s=c,a=f;break}b=b.sibling}if(!_){for(b=f.child;b;){if(b===a){_=!0,a=f,s=c;break}if(b===s){_=!0,s=f,a=c;break}b=b.sibling}if(!_)throw Error(o(189))}}if(a.alternate!==s)throw Error(o(190))}if(a.tag!==3)throw Error(o(188));return a.stateNode.current===a?e:n}function x(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e;for(e=e.child;e!==null;){if(n=x(e),n!==null)return n;e=e.sibling}return null}function g(e,n,a,s,c,f){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&a(e,s,c,f)||(e.tag!==22||e.memoizedState===null)&&(n||e.tag!==5&&e.tag!==27)&&g(e.child,n,a,s,c,f))return!0;e=e.sibling}return!1}function S(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function y(e){var n=!1;for(e=e.return;e!==null&&(e.tag===4&&(n=!0),!(e.tag===3||e.tag===5||e.tag===27));)e=e.return;return n}function T(e){var n=[null,null],a=S(e);return a===null||C(n,e,a.child,{foundSelf:!1}),n}function C(e,n,a,s){for(;a!==null;){if(a===n)s.foundSelf=!0;else if(a.tag===5||a.tag===27||a.tag===6){if(s.foundSelf)return e[1]=a,!0;e[0]=a}else if((a.tag!==22||a.memoizedState===null)&&C(e,n,a.child,s))return!0;a=a.sibling}return!1}function E(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(o(559))}}var M=null,O=null;function I(e,n,a){return e===a?!0:e===n?(M=e,!0):!1}function D(e,n,a){return e===a?(O=e,!1):e===n?(O!==null&&(M=e),!0):!1}function V(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function H(e,n,a){for(var s=0,c=e;c;c=a(c))s++;c=0;for(var f=n;f;f=a(f))c++;for(;0<s-c;)e=a(e),s--;for(;0<c-s;)n=a(n),c--;for(;s--;){if(e===n||n!==null&&e===n.alternate)return e;e=a(e),n=a(n)}return null}var z=Object.assign,X=Symbol.for("react.element"),w=Symbol.for("react.transitional.element"),N=Symbol.for("react.portal"),B=Symbol.for("react.fragment"),k=Symbol.for("react.strict_mode"),le=Symbol.for("react.profiler"),pe=Symbol.for("react.consumer"),fe=Symbol.for("react.context"),q=Symbol.for("react.forward_ref"),se=Symbol.for("react.suspense"),W=Symbol.for("react.suspense_list"),xe=Symbol.for("react.memo"),Se=Symbol.for("react.lazy"),Pe=Symbol.for("react.activity"),Je=Symbol.for("react.legacy_hidden"),xt=Symbol.for("react.memo_cache_sentinel"),F=Symbol.for("react.view_transition"),he=Symbol.for("react.recoverable"),ee=Symbol.iterator;function re(e){return e===null||typeof e!="object"?null:(e=ee&&e[ee]||e["@@iterator"],typeof e=="function"?e:null)}var Ee=Symbol.for("react.client.reference");function we(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Ee?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case B:return"Fragment";case le:return"Profiler";case k:return"StrictMode";case se:return"Suspense";case W:return"SuspenseList";case Pe:return"Activity";case F:return"ViewTransition"}if(typeof e=="object")switch(e.$$typeof){case N:return"Portal";case fe:return e.displayName||"Context";case pe:return(e._context.displayName||"Context")+".Consumer";case q:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case xe:return n=e.displayName||null,n!==null?n:we(e.type)||"Memo";case Se:n=e._payload,e=e._init;try{return we(e(n))}catch{}}return null}var Q=Array.isArray,de=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,je=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,P={pending:!1,data:null,method:null,action:null},Ne=[],ze=-1;function ke(e){return{current:e}}function De(e){0>ze||(e.current=Ne[ze],Ne[ze]=null,ze--)}function at(e,n){ze++,Ne[ze]=e.current,e.current=n}var Ge=ke(null),ot=ke(null),gt=ke(null),Ft=ke(null);function U(e,n){switch(at(gt,n),at(ot,e),at(Ge,null),n.nodeType){case 9:case 11:e=(e=n.documentElement)&&(e=e.namespaceURI)?i_(e):0;break;default:if(e=n.tagName,n=n.namespaceURI)n=i_(n),e=a_(n,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}De(Ge),at(Ge,e)}function A(){De(Ge),De(ot),De(gt)}function ie(e){var n=e.memoizedState;n!==null&&(Kr._currentValue=n.memoizedState,at(Ft,e)),n=Ge.current;var a=a_(n,e.type);n!==a&&(at(ot,e),at(Ge,a))}function ve(e){ot.current===e&&(De(Ge),De(ot)),Ft.current===e&&(De(Ft),Kr._currentValue=P)}var Me,me;function Ye(e){if(Me===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);Me=n&&n[1]||"",me=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Me+e+me}var Re=!1;function Qe(e,n){if(!e||Re)return"";Re=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var s={DetermineComponentFrameRoot:function(){try{if(n){var _e=function(){throw Error()};if(Object.defineProperty(_e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(_e,[])}catch(Oe){var Y=Oe}Reflect.construct(e,[],_e)}else{try{_e.call()}catch(Oe){Y=Oe}_e=!1;try{var ae=Object.getOwnPropertyDescriptor(e.prototype,"props");Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),_e=!0,new e}finally{_e&&(ae!==void 0?Object.defineProperty(e.prototype,"props",ae):delete e.prototype.props)}}}else{try{throw Error()}catch(Oe){Y=Oe}(_e=e())&&typeof _e.catch=="function"&&_e.catch(function(){})}}catch(Oe){if(Oe&&Y&&typeof Oe.stack=="string")return[Oe.stack,Y.stack]}return[null,null]}};s.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var c=Object.getOwnPropertyDescriptor(s.DetermineComponentFrameRoot,"name");c&&c.configurable&&Object.defineProperty(s.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=s.DetermineComponentFrameRoot(),_=f[0],b=f[1];if(_&&b){var L=_.split(`
`),K=b.split(`
`);for(c=s=0;s<L.length&&!L[s].includes("DetermineComponentFrameRoot");)s++;for(;c<K.length&&!K[c].includes("DetermineComponentFrameRoot");)c++;if(s===L.length||c===K.length)for(s=L.length-1,c=K.length-1;1<=s&&0<=c&&L[s]!==K[c];)c--;for(;1<=s&&0<=c;s--,c--)if(L[s]!==K[c]){if(s!==1||c!==1)do if(s--,c--,0>c||L[s]!==K[c]){var oe=`
`+L[s].replace(" at new "," at ");return e.displayName&&oe.includes("<anonymous>")&&(oe=oe.replace("<anonymous>",e.displayName)),oe}while(1<=s&&0<=c);break}}}finally{Re=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?Ye(a):""}function et(e,n){switch(e.tag){case 26:case 27:case 5:return Ye(e.type);case 16:return Ye("Lazy");case 13:return e.child!==n&&n!==null?Ye("Suspense Fallback"):Ye("Suspense");case 19:return Ye("SuspenseList");case 0:case 15:return Qe(e.type,!1);case 11:return Qe(e.type.render,!1);case 1:return Qe(e.type,!0);case 31:return Ye("Activity");case 30:return Ye("ViewTransition");default:return""}}function Ae(e){try{var n="",a=null;do n+=et(e,a),a=e,e=e.return;while(e);return n}catch(s){return`
Error generating stack: `+s.message+`
`+s.stack}}var Ie=Object.prototype.hasOwnProperty,rt=r.unstable_scheduleCallback,$e=r.unstable_cancelCallback,Be=r.unstable_shouldYield,ht=r.unstable_requestPaint,j=r.unstable_now,Ce=r.unstable_getCurrentPriorityLevel,Le=r.unstable_ImmediatePriority,qe=r.unstable_UserBlockingPriority,Te=r.unstable_NormalPriority,ye=r.unstable_LowPriority,Ke=r.unstable_IdlePriority,ut=r.log,qt=r.unstable_setDisableYieldValue,bt=null,tn=null;function vn(e){if(typeof ut=="function"&&qt(e),tn&&typeof tn.setStrictMode=="function")try{tn.setStrictMode(bt,e)}catch{}}var On=Math.clz32?Math.clz32:Xl,fa=Math.log,Lo=Math.LN2;function Xl(e){return e>>>=0,e===0?32:31-(fa(e)/Lo|0)|0}var Es=256,da=262144,Ts=4194304;function gi(e){var n=e&42;if(n!==0)return n;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function bs(e,n,a){var s=e.pendingLanes;if(s===0)return 0;var c=0,f=e.suspendedLanes,_=e.pingedLanes;e=e.warmLanes;var b=s&134217727;return b!==0?(s=b&~f,s!==0?c=gi(s):(_&=b,_!==0?c=gi(_):a||(a=b&~e,a!==0&&(c=gi(a))))):(b=s&~f,b!==0?c=gi(b):_!==0?c=gi(_):a||(a=s&~e,a!==0&&(c=gi(a)))),c===0?0:n!==0&&n!==c&&(n&f)===0&&(f=c&-c,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:c}function Ia(e,n){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&n)===0}function ql(e,n){(n&8)!==0&&(n|=n&32);var a=e.entangledLanes;if(a!==0)for(e=e.entanglements,a&=n;0<a;){var s=31-On(a),c=1<<s;n|=e[s],a&=~c}return n}function of(e,n){switch(e){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Yl(){var e=Ts;return Ts<<=1,(Ts&62914560)===0&&(Ts=4194304),e}function Oo(e){for(var n=[],a=0;31>a;a++)n.push(e);return n}function As(e,n){e.pendingLanes|=n,n!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function lf(e,n,a,s,c,f){var _=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var b=e.entanglements,L=e.expirationTimes,K=e.hiddenUpdates;for(a=_&~a;0<a;){var oe=31-On(a),_e=1<<oe;b[oe]=0,L[oe]=-1;var Y=K[oe];if(Y!==null)for(K[oe]=null,oe=0;oe<Y.length;oe++){var ae=Y[oe];ae!==null&&(ae.lane&=-536870913)}a&=~_e}s!==0&&R(e,s,0),f!==0&&c===0&&e.tag!==0&&(e.suspendedLanes|=f&~(_&~n))}function R(e,n,a){e.pendingLanes|=n,e.suspendedLanes&=~n;var s=31-On(n);e.entangledLanes|=n,e.entanglements[s]=e.entanglements[s]|1073741824|a&261930}function J(e,n){var a=e.entangledLanes|=n;for(e=e.entanglements;a;){var s=31-On(a),c=1<<s;c&n|e[s]&n&&(e[s]|=n),a&=~c}}function ce(e,n){var a=n&-n;return a=(a&42)!==0?1:ue(a),(a&(e.suspendedLanes|n))!==0?0:a}function ue(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function $(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function be(){var e=je.p;return e!==0?e:(e=window.event,e===void 0?32:G_(e.type))}function Fe(e,n){var a=je.p;try{return je.p=e,n()}finally{je.p=a}}var Ve=Math.random().toString(36).slice(2),Ue="__reactFiber$"+Ve,We="__reactProps$"+Ve,st="__reactContainer$"+Ve,nt="__reactEvents$"+Ve,Mt="__reactListeners$"+Ve,Ht="__reactHandles$"+Ve,$t="__reactResources$"+Ve,Pt="__reactMarker$"+Ve,Lt="__reactLoad$"+Ve;function it(e){delete e[Ue],delete e[We],delete e[Mt],delete e[Ht]}function It(e){var n;if(n=e[Ue])return n;for(var a=e.parentNode;a;){if(n=a[st]||a[Ue]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(e=S_(e);e!==null;){if(a=e[Ue])return a;e=S_(e)}return n}e=a,a=e.parentNode}return null}function yt(e){if(e=e[Ue]||e[st]){var n=e.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return e}return null}function _n(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e.stateNode;throw Error(o(33))}function ni(e){var n=e[$t];return n||(n=e[$t]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function Ot(e){e[Pt]=!0}function Ba(e){e[Lt]=void 0}var Kt=new Set,Hn={};function un(e,n){sn(e,n),sn(e+"Capture",n)}function sn(e,n){for(Hn[e]=n,e=0;e<n.length;e++)Kt.add(n[e])}var zn=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),hr={},Wi={};function uS(e){return Ie.call(Wi,e)?!0:Ie.call(hr,e)?!1:zn.test(e)?Wi[e]=!0:(hr[e]=!0,!1)}var zt=!1;function jm(){var e=zt;return zt=!1,e}function Wl(e,n,a){if(uS(n))if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(n);return;case"boolean":var s=n.toLowerCase().slice(0,5);if(s!=="data-"&&s!=="aria-"){e.removeAttribute(n);return}}e.setAttribute(n,a)}}function Zl(e,n,a){if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttribute(n,a)}}function ha(e,n,a,s){if(s===null)e.removeAttribute(a);else{switch(typeof s){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(n,a,s)}}function ii(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function km(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function fS(e,n,a){var s=Object.getOwnPropertyDescriptor(e.constructor.prototype,n);if(!e.hasOwnProperty(n)&&typeof s<"u"&&typeof s.get=="function"&&typeof s.set=="function"){var c=s.get,f=s.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return c.call(this)},set:function(_){a=""+_,f.call(this,_)}}),Object.defineProperty(e,n,{enumerable:s.enumerable}),{getValue:function(){return a},setValue:function(_){a=""+_},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function cf(e){if(!e._valueTracker){var n=km(e)?"checked":"value";e._valueTracker=fS(e,n,""+e[n])}}function Xm(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var a=n.getValue(),s="";return e&&(s=km(e)?e.checked?"true":"false":e.value),e=s,e!==a?(n.setValue(e),!0):!1}var dS=/[\n"\\]/g;function vi(e){return e.replace(dS,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function uf(e,n,a,s,c,f,_,b){e.name="",_!=null&&typeof _!="function"&&typeof _!="symbol"&&typeof _!="boolean"?e.type=_:e.removeAttribute("type"),n!=null?_==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+ii(n)):e.value!==""+ii(n)&&(e.value=""+ii(n)):_!=="submit"&&_!=="reset"||e.removeAttribute("value"),n!=null?_==="number"&&e.value==n?ff(e,ii(e.value)):ff(e,ii(n)):a!=null?ff(e,ii(a)):s!=null&&e.removeAttribute("value"),c==null&&f!=null&&(e.defaultChecked=!!f),c!=null&&(e.checked=c&&typeof c!="function"&&typeof c!="symbol"),b!=null&&typeof b!="function"&&typeof b!="symbol"&&typeof b!="boolean"?e.name=""+ii(b):e.removeAttribute("name")}function qm(e,n,a,s,c,f,_,b){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(e.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null)){cf(e);return}a=a!=null?""+ii(a):"",n=n!=null?""+ii(n):a,b||n===e.value||(e.value=n),e.defaultValue=n}s=s??c,s=typeof s!="function"&&typeof s!="symbol"&&!!s,e.checked=b?e.checked:!!s,e.defaultChecked=!!s,_!=null&&typeof _!="function"&&typeof _!="symbol"&&typeof _!="boolean"&&(e.name=_),cf(e)}function ff(e,n){e.defaultValue!==""+n&&(e.defaultValue=""+n)}function pr(e,n,a,s){if(e=e.options,n){n={};for(var c=0;c<a.length;c++)n["$"+a[c]]=!0;for(a=0;a<e.length;a++)c=n.hasOwnProperty("$"+e[a].value),e[a].selected!==c&&(e[a].selected=c),c&&s&&(e[a].defaultSelected=!0)}else{for(a=""+ii(a),n=null,c=0;c<e.length;c++){if(e[c].value===a){e[c].selected=!0,s&&(e[c].defaultSelected=!0);return}n!==null||e[c].disabled||(n=e[c])}n!==null&&(n.selected=!0)}}function Ym(e,n,a){if(n!=null&&(n=""+ii(n),n!==e.value&&(e.value=n),a==null)){e.defaultValue!==n&&(e.defaultValue=n);return}e.defaultValue=a!=null?""+ii(a):""}function Wm(e,n,a,s){if(n==null){if(s!=null){if(a!=null)throw Error(o(92));if(Q(s)){if(1<s.length)throw Error(o(93));s=s[0]}a=s}a==null&&(a=""),n=a}a=ii(n),e.defaultValue=a,s=e.textContent,s===a&&s!==""&&s!==null&&(e.value=s),cf(e)}function mr(e,n){if(n){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=n;return}}e.textContent=n}var hS=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Zm(e,n,a){var s=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?s?e.setProperty(n,""):n==="float"?e.cssFloat="":e[n]="":s?e.setProperty(n,a):typeof a!="number"||a===0||hS.has(n)?n==="float"?e.cssFloat=a:e[n]=(""+a).trim():e[n]=a+"px"}function Km(e,n,a){if(n!=null&&typeof n!="object")throw Error(o(62));if(e=e.style,a!=null){for(var s in a)!a.hasOwnProperty(s)||n!=null&&n.hasOwnProperty(s)||(s.indexOf("--")===0?e.setProperty(s,""):s==="float"?e.cssFloat="":e[s]="",zt=!0);for(var c in n)s=n[c],n.hasOwnProperty(c)&&a[c]!==s&&(Zm(e,c,s),zt=!0)}else for(var f in n)n.hasOwnProperty(f)&&Zm(e,f,n[f])}function df(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var pS=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),mS=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Kl(e){return mS.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Zi(){}var hf=null;function pf(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var gr=null,vr=null;function Qm(e){var n=yt(e);if(n&&(e=n.stateNode)){var a=e[We]||null;e:switch(e=n.stateNode,n.type){case"input":if(uf(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+vi(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var s=a[n];if(s!==e&&s.form===e.form){var c=s[We]||null;if(!c)throw Error(o(90));uf(s,c.value,c.defaultValue,c.defaultValue,c.checked,c.defaultChecked,c.type,c.name)}}for(n=0;n<a.length;n++)s=a[n],s.form===e.form&&Xm(s)}break e;case"textarea":Ym(e,a.value,a.defaultValue);break e;case"select":n=a.value,n!=null&&pr(e,!!a.multiple,n,!1)}}}var mf=!1;function Jm(e,n,a){if(mf)return e(n,a);mf=!0;try{var s=e(n);return s}finally{if(mf=!1,(gr!==null||vr!==null)&&(Kc(),gr&&(n=gr,e=vr,vr=gr=null,Qm(n),e)))for(n=0;n<e.length;n++)Qm(e[n])}}function zo(e,n){var a=e.stateNode;if(a===null)return null;var s=a[We]||null;if(s===null)return null;a=s[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(s=!s.disabled)||(e=e.type,s=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!s;break e;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(o(231,n,typeof a));return a}var pa=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),gf=!1;if(pa)try{var Po={};Object.defineProperty(Po,"passive",{get:function(){gf=!0}}),window.addEventListener("test",Po,Po),window.removeEventListener("test",Po,Po)}catch{gf=!1}var Fa=null,vf=null,Ql=null;function $m(){if(Ql)return Ql;var e,n=vf,a=n.length,s,c="value"in Fa?Fa.value:Fa.textContent,f=c.length;for(e=0;e<a&&n[e]===c[e];e++);var _=a-e;for(s=1;s<=_&&n[a-s]===c[f-s];s++);return Ql=c.slice(e,1<s?1-s:void 0)}function Jl(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function $l(){return!0}function eg(){return!1}function Gn(e){function n(a,s,c,f,_){this._reactName=a,this._targetInst=c,this.type=s,this.nativeEvent=f,this.target=_,this.currentTarget=null;for(var b in e)e.hasOwnProperty(b)&&(a=e[b],this[b]=a?a(f):f[b]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?$l:eg,this.isPropagationStopped=eg,this}return z(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=$l)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=$l)},persist:function(){},isPersistent:$l}),n}var Ha={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ec=Gn(Ha),Io=z({},Ha,{view:0,detail:0}),gS=Gn(Io),_f,xf,Bo,tc=z({},Io,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Sf,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Bo&&(Bo&&e.type==="mousemove"?(_f=e.screenX-Bo.screenX,xf=e.screenY-Bo.screenY):xf=_f=0,Bo=e),_f)},movementY:function(e){return"movementY"in e?e.movementY:xf}}),tg=Gn(tc),vS=z({},tc,{dataTransfer:0}),_S=Gn(vS),xS=z({},Io,{relatedTarget:0}),yf=Gn(xS),yS=z({},Ha,{animationName:0,elapsedTime:0,pseudoElement:0}),SS=Gn(yS),MS=z({},Ha,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),ES=Gn(MS),TS=z({},Ha,{data:0}),ng=Gn(TS),bS={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},AS={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},CS={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function RS(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=CS[e])?!!n[e]:!1}function Sf(){return RS}var wS=z({},Io,{key:function(e){if(e.key){var n=bS[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=Jl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?AS[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Sf,charCode:function(e){return e.type==="keypress"?Jl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Jl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),NS=Gn(wS),DS=z({},tc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ig=Gn(DS),US=z({},Ha,{submitter:0}),LS=Gn(US),OS=z({},Io,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Sf}),zS=Gn(OS),PS=z({},Ha,{propertyName:0,elapsedTime:0,pseudoElement:0}),IS=Gn(PS),BS=z({},tc,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),FS=Gn(BS),HS=z({},Ha,{newState:0,oldState:0,source:0}),GS=Gn(HS),VS=[9,13,27,32],Mf=pa&&"CompositionEvent"in window,Fo=null;pa&&"documentMode"in document&&(Fo=document.documentMode);var jS=pa&&"TextEvent"in window&&!Fo,ag=pa&&(!Mf||Fo&&8<Fo&&11>=Fo),sg=" ",rg=!1;function og(e,n){switch(e){case"keyup":return VS.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function lg(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var _r=!1;function kS(e,n){switch(e){case"compositionend":return lg(n);case"keypress":return n.which!==32?null:(rg=!0,sg);case"textInput":return e=n.data,e===sg&&rg?null:e;default:return null}}function XS(e,n){if(_r)return e==="compositionend"||!Mf&&og(e,n)?(e=$m(),Ql=vf=Fa=null,_r=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return ag&&n.locale!=="ko"?null:n.data;default:return null}}var qS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function cg(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!qS[e.type]:n==="textarea"}function ug(e,n,a,s){gr?vr?vr.push(s):vr=[s]:gr=s,n=nu(n,"onChange"),0<n.length&&(a=new ec("onChange","change",null,a,s),e.push({event:a,listeners:n}))}var Ho=null,Go=null;function YS(e){Qv(e,0)}function nc(e){var n=_n(e);if(Xm(n))return e}function fg(e,n){if(e==="change")return n}var dg=!1;if(pa){var Ef;if(pa){var Tf="oninput"in document;if(!Tf){var hg=document.createElement("div");hg.setAttribute("oninput","return;"),Tf=typeof hg.oninput=="function"}Ef=Tf}else Ef=!1;dg=Ef&&(!document.documentMode||9<document.documentMode)}function pg(){Ho&&(Ho.detachEvent("onpropertychange",mg),Go=Ho=null)}function mg(e){if(e.propertyName==="value"&&nc(Go)){var n=[];ug(n,Go,e,pf(e)),Jm(YS,n)}}function WS(e,n,a){e==="focusin"?(pg(),Ho=n,Go=a,Ho.attachEvent("onpropertychange",mg)):e==="focusout"&&pg()}function ZS(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return nc(Go)}function KS(e,n){if(e==="click")return nc(n)}function QS(e,n){if(e==="input"||e==="change")return nc(n)}function JS(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var ai=typeof Object.is=="function"?Object.is:JS;function Vo(e,n){if(ai(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var a=Object.keys(e),s=Object.keys(n);if(a.length!==s.length)return!1;for(s=0;s<a.length;s++){var c=a[s];if(!Ie.call(n,c)||!ai(e[c],n[c]))return!1}return!0}function bf(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function gg(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function vg(e,n){var a=gg(e);e=0;for(var s;a;){if(a.nodeType===3){if(s=e+a.textContent.length,e<=n&&s>=n)return{node:a,offset:n-e};e=s}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=gg(a)}}function _g(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?_g(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function xg(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var n=bf(e.document);n instanceof e.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)e=n.contentWindow;else break;n=bf(e.document)}return n}function Af(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}var $S=pa&&"documentMode"in document&&11>=document.documentMode,xr=null,Cf=null,jo=null,Rf=!1;function yg(e,n,a){var s=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Rf||xr==null||xr!==bf(s)||(s=xr,"selectionStart"in s&&Af(s)?s={start:s.selectionStart,end:s.selectionEnd}:(s=(s.ownerDocument&&s.ownerDocument.defaultView||window).getSelection(),s={anchorNode:s.anchorNode,anchorOffset:s.anchorOffset,focusNode:s.focusNode,focusOffset:s.focusOffset}),jo&&Vo(jo,s)||(jo=s,s=nu(Cf,"onSelect"),0<s.length&&(n=new ec("onSelect","select",null,n,a),e.push({event:n,listeners:s}),n.target=xr)))}function Cs(e,n){var a={};return a[e.toLowerCase()]=n.toLowerCase(),a["Webkit"+e]="webkit"+n,a["Moz"+e]="moz"+n,a}var yr={animationend:Cs("Animation","AnimationEnd"),animationiteration:Cs("Animation","AnimationIteration"),animationstart:Cs("Animation","AnimationStart"),transitionrun:Cs("Transition","TransitionRun"),transitionstart:Cs("Transition","TransitionStart"),transitioncancel:Cs("Transition","TransitionCancel"),transitionend:Cs("Transition","TransitionEnd")},wf={},Sg={};pa&&(Sg=document.createElement("div").style,"AnimationEvent"in window||(delete yr.animationend.animation,delete yr.animationiteration.animation,delete yr.animationstart.animation),"TransitionEvent"in window||delete yr.transitionend.transition);function Rs(e){if(wf[e])return wf[e];if(!yr[e])return e;var n=yr[e],a;for(a in n)if(n.hasOwnProperty(a)&&a in Sg)return wf[e]=n[a];return e}var Mg=Rs("animationend"),Eg=Rs("animationiteration"),Tg=Rs("animationstart"),eM=Rs("transitionrun"),tM=Rs("transitionstart"),nM=Rs("transitioncancel"),bg=Rs("transitionend"),Ag=new Map,Nf="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Nf.push("scrollEnd");function Ui(e,n){Ag.set(e,n),un(n,[e])}var iM=0;function ma(e,n){if(e.name!=null&&e.name!=="auto")return e.name;if(n.autoName!==null)return n.autoName;e=Pi.identifierPrefix;var a=iM++;return e="_"+e+"t_"+a.toString(32)+"_",n.autoName=e}function Cg(e){if(e==null||typeof e=="string")return e;var n=null,a=Hr;if(a!==null)for(var s=0;s<a.length;s++){var c=e[a[s]];if(c!=null){if(c==="none")return"none";n=n==null?c:n+(" "+c)}}return n??e.default}function ga(e,n){return e=Cg(e),n=Cg(n),n==null?e==="auto"?null:e:n==="auto"?null:n}var ic=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},_i=[],Sr=0,Df=0;function ac(){for(var e=Sr,n=Df=Sr=0;n<e;){var a=_i[n];_i[n++]=null;var s=_i[n];_i[n++]=null;var c=_i[n];_i[n++]=null;var f=_i[n];if(_i[n++]=null,s!==null&&c!==null){var _=s.pending;_===null?c.next=c:(c.next=_.next,_.next=c),s.pending=c}f!==0&&Rg(a,c,f)}}function sc(e,n,a,s){_i[Sr++]=e,_i[Sr++]=n,_i[Sr++]=a,_i[Sr++]=s,Df|=s,e.lanes|=s,e=e.alternate,e!==null&&(e.lanes|=s)}function Uf(e,n,a,s){return sc(e,n,a,s),rc(e)}function ws(e,n){return sc(e,null,null,n),rc(e)}function Rg(e,n,a){e.lanes|=a;var s=e.alternate;s!==null&&(s.lanes|=a);for(var c=!1,f=e.return;f!==null;)f.childLanes|=a,s=f.alternate,s!==null&&(s.childLanes|=a),f.tag===22&&(e=f.stateNode,e===null||e._visibility&1||(c=!0)),e=f,f=f.return;return e.tag===3?(f=e.stateNode,c&&n!==null&&(c=31-On(a),e=f.hiddenUpdates,s=e[c],s===null?e[c]=[n]:s.push(n),n.lane=a|536870912),f):null}function rc(e){if(50<fl)throw fl=0,Zc=null,Error(o(185));for(var n=e.return;n!==null;)e=n,n=e.return;return e.tag===3?e.stateNode:null}var Mr={};function aM(e,n,a,s){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=s,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Wn(e,n,a,s){return new aM(e,n,a,s)}function Lf(e){return e=e.prototype,!(!e||!e.isReactComponent)}function va(e,n){var a=e.alternate;return a===null?(a=Wn(e.tag,n,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=n,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&1206910976,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,n=e.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function wg(e,n){e.flags&=1206910978;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=n,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,n=a.dependencies,e.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),e}function oc(e,n,a,s,c,f){var _=0;if(s=e,typeof s=="function")Lf(s)&&(_=1);else if(typeof s=="string")_=U1(e,a,Ge.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(s){case Pe:return e=Wn(31,a,n,c),e.elementType=Pe,e.lanes=f,e;case B:return Ns(a.children,c,f,n);case k:_=8,c|=24;break;case le:return e=Wn(12,a,n,c|2),e.elementType=le,e.lanes=f,e;case se:return e=Wn(13,a,n,c),e.elementType=se,e.lanes=f,e;case W:return e=Wn(19,a,n,c),e.elementType=W,e.lanes=f,e;case Je:case F:return e=c|32,e=Wn(30,a,n,e),e.elementType=F,e.lanes=f,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof s=="object"&&s!==null)switch(s.$$typeof){case fe:_=10;break e;case pe:_=9;break e;case q:_=11;break e;case xe:_=14;break e;case Se:_=16,s=null;break e}_=29,a=Error(o(130,e===null?"null":typeof e,"")),s=null}return n=Wn(_,a,n,c),n.elementType=e,n.type=s,n.lanes=f,n}function Ns(e,n,a,s){return e=Wn(7,e,s,n),e.lanes=a,e}function Of(e,n,a){return e=Wn(6,e,null,n),e.lanes=a,e}function Ng(e){var n=Wn(18,null,null,0);return n.stateNode=e,n}function zf(e,n,a){return n=Wn(4,e.children!==null?e.children:[],e.key,n),n.lanes=a,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}var Dg=new WeakMap;function xi(e,n){if(typeof e=="object"&&e!==null){var a=Dg.get(e);return a!==void 0?a:(n={value:e,source:n,stack:Ae(n)},Dg.set(e,n),n)}return{value:e,source:n,stack:Ae(n)}}var Er=[],Tr=0,lc=null,ko=0,yi=[],Si=0,Ga=null,Ki=1,Qi="";function _a(e,n){Er[Tr++]=ko,Er[Tr++]=lc,lc=e,ko=n}function Ug(e,n,a){yi[Si++]=Ki,yi[Si++]=Qi,yi[Si++]=Ga,Ga=e;var s=Ki;e=Qi;var c=32-On(s)-1;s&=~(1<<c),a+=1;var f=32-On(n)+c;if(30<f){var _=c-c%5;f=(s&(1<<_)-1).toString(32),s>>=_,c-=_,Ki=1<<32-On(n)+c|a<<c|s,Qi=f+e}else Ki=1<<f|a<<c|s,Qi=e}function cc(e){e.return!==null&&(_a(e,1),Ug(e,1,0))}function Pf(e){for(;e===lc;)lc=Er[--Tr],Er[Tr]=null,ko=Er[--Tr],Er[Tr]=null;for(;e===Ga;)Ga=yi[--Si],yi[Si]=null,Qi=yi[--Si],yi[Si]=null,Ki=yi[--Si],yi[Si]=null}function Lg(e,n){yi[Si++]=Ki,yi[Si++]=Qi,yi[Si++]=Ga,Ki=n.id,Qi=n.overflow,Ga=e}var Mn=null,Qt=null,St=!1,Va=null,Mi=!1,If=Error(o(519));function ja(e){var n=Error(o(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Xo(xi(n,e)),If}function Og(e){var n=e.stateNode,a=e.type,s=e.memoizedProps;switch(n[Ue]=e,n[We]=s,a){case"dialog":Tt("cancel",n),Tt("close",n);break;case"iframe":case"object":case"embed":Tt("load",n);break;case"video":case"audio":for(a=0;a<hl.length;a++)Tt(hl[a],n);break;case"source":Tt("error",n);break;case"img":case"image":case"link":Tt("error",n),Tt("load",n);break;case"details":Tt("toggle",n);break;case"input":Tt("invalid",n),qm(n,s.value,s.defaultValue,s.checked,s.defaultChecked,s.type,s.name,!0);break;case"select":Tt("invalid",n);break;case"textarea":Tt("invalid",n),Wm(n,s.value,s.defaultValue,s.children)}a=s.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||s.suppressHydrationWarning===!0||t_(n.textContent,a)?(s.popover!=null&&(Tt("beforetoggle",n),Tt("toggle",n)),s.onScroll!=null&&Tt("scroll",n),s.onScrollEnd!=null&&Tt("scrollend",n),s.onClick!=null&&(n.onclick=Zi),n=!0):n=!1,n||ja(e,!0)}function uc(e){for(Mn=e.return;Mn;)switch(Mn.tag){case 5:case 31:case 13:Mi=!1;return;case 27:case 3:Mi=!0;return;default:Mn=Mn.return}}function br(e){if(e!==Mn)return!1;if(!St)return uc(e),St=!0,!1;var n=e.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||hh(e.type,e.memoizedProps)),a=!a),a&&Qt&&ja(e),uc(e),n===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(317));Qt=y_(e)}else if(n===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(317));Qt=y_(e)}else n===27?(n=Qt,ss(e.type)?(e=Mh,Mh=null,Qt=e):Qt=n):Qt=Mn?Ti(e.stateNode.nextSibling):null;return!0}function Ds(){Qt=Mn=null,St=!1}function Bf(){var e=Va;return e!==null&&(Qn===null?Qn=e:Qn.push.apply(Qn,e),Va=null),e}function Xo(e){Va===null?Va=[e]:Va.push(e)}var Ff=ke(null),Us=null,xa=null;function ka(e,n,a){at(Ff,n._currentValue),n._currentValue=a}function ya(e){e._currentValue=Ff.current,De(Ff)}function fc(e,n,a){for(;e!==null;){var s=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,s!==null&&(s.childLanes|=n)):s!==null&&(s.childLanes&n)!==n&&(s.childLanes|=n),e===a)break;e=e.return}}function Hf(e,n,a,s){var c=e.child;for(c!==null&&(c.return=e);c!==null;){var f=c.dependencies;if(f!==null){var _=c.child;f=f.firstContext;e:for(;f!==null;){var b=f;f=c;for(var L=0;L<n.length;L++)if(b.context===n[L]){f.lanes|=a,b=f.alternate,b!==null&&(b.lanes|=a),fc(f.return,a,e),s||(_=null);break e}f=b.next}}else if(c.tag===18){if(_=c.return,_===null)throw Error(o(341));_.lanes|=a,f=_.alternate,f!==null&&(f.lanes|=a),fc(_,a,e),_=null}else c.tag===13&&c.memoizedState!==null&&c.memoizedState.dehydrated===null?(c.lanes|=a,_=c.alternate,_!==null&&(_.lanes|=a),fc(c.return,a,e),_=c.child,_=_!==null?_.sibling:null):_=c.child;if(_!==null)_.return=c;else for(_=c;_!==null;){if(_===e){_=null;break}if(c=_.sibling,c!==null){c.return=_.return,_=c;break}_=_.return}c=_}}function Ls(e,n,a,s){e=null;for(var c=n,f=!1;c!==null;){if(!f){if((c.flags&524288)!==0)f=!0;else if((c.flags&262144)!==0)break}if(c.tag===10){var _=c.alternate;if(_===null)throw Error(o(387));if(_=_.memoizedProps,_!==null){var b=c.type;ai(c.pendingProps.value,_.value)||(e!==null?e.push(b):e=[b])}}else if(c===Ft.current){if(_=c.alternate,_===null)throw Error(o(387));_.memoizedState.memoizedState!==c.memoizedState.memoizedState&&(e!==null?e.push(Kr):e=[Kr])}c=c.return}return e!==null&&Hf(n,e,a,s),n.flags|=262144,e!==null}function dc(e){for(e=e.firstContext;e!==null;){if(!ai(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Os(e){Us=e,xa=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function An(e){return zg(Us,e)}function hc(e,n){return Us===null&&Os(e),zg(e,n)}function zg(e,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},xa===null){if(e===null)throw Error(o(308));xa=n,e.dependencies={lanes:0,firstContext:n},e.flags|=524288}else xa=xa.next=n;return a}var sM=typeof AbortController<"u"?AbortController:function(){var e=[],n=this.signal={aborted:!1,addEventListener:function(a,s){e.push(s)}};this.abort=function(){n.aborted=!0,e.forEach(function(a){return a()})}},rM=r.unstable_scheduleCallback,oM=r.unstable_NormalPriority,fn={$$typeof:fe,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Gf(){return{controller:new sM,data:new Map,refCount:0}}function qo(e){e.refCount--,e.refCount===0&&rM(oM,function(){e.controller.abort()})}function Pg(e,n){if((e.pendingLanes&4194048)!==0){var a=e.transitionTypes;for(a===null&&(a=e.transitionTypes=[]),e=0;e<n.length;e++){var s=n[e];a.indexOf(s)===-1&&a.push(s)}}}var Yo=null;function lM(e){var n=e.transitionTypes;return e.transitionTypes=null,n}var Wo=null,Vf=0,zs=0,Ar=null;function cM(e,n){if(Wo===null){var a=Wo=[];Vf=0,zs=ah(),Ar={status:"pending",value:void 0,then:function(s){a.push(s)}}}return Vf++,n.then(Ig,Ig),n}function Ig(){if(--Vf===0&&(Yo=null,Wo!==null)){Ar!==null&&(Ar.status="fulfilled");var e=Wo;Wo=null,zs=0,Ar=null;for(var n=0;n<e.length;n++)(0,e[n])()}}function uM(e,n){var a=[],s={status:"pending",value:null,reason:null,then:function(c){a.push(c)}};return e.then(function(){s.status="fulfilled",s.value=n;for(var c=0;c<a.length;c++)(0,a[c])(n)},function(c){for(s.status="rejected",s.reason=c,c=0;c<a.length;c++)(0,a[c])(void 0)}),s}var Bg=de.S;de.S=function(e,n){if(Nv=j(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&cM(e,n),Yo!==null)for(var a=kr;a!==null;)Pg(a,Yo),a=a.next;if(a=e.types,a!==null){for(var s=kr;s!==null;)Pg(s,a),s=s.next;if(zs!==0){s=Yo,s===null&&(s=Yo=[]);for(var c=0;c<a.length;c++){var f=a[c];s.indexOf(f)===-1&&s.push(f)}}}Bg!==null&&Bg(e,n)};var Ps=ke(null);function jf(){var e=Ps.current;return e!==null?e:Zt.pooledCache}function pc(e,n){n===null?at(Ps,Ps.current):at(Ps,n.pool)}function Fg(){var e=jf();return e===null?null:{parent:fn._currentValue,pool:e}}var Cr=Error(o(460)),kf=Error(o(474)),mc=Error(o(542)),gc={then:function(){}};function Hg(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Gg(e,n,a){switch(a=e[a],a===void 0?e.push(n):a!==n&&(n.then(Zi,Zi),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,jg(e),e===void 0&&!("reason"in n)?Error(o(600)):e;default:if(typeof n.status=="string")n.then(Zi,Zi);else{if(e=Zt,e!==null&&100<e.shellSuspendCounter)throw Error(o(482));e=n,e.status="pending",e.then(function(s){if(n.status==="pending"){var c=n;c.status="fulfilled",c.value=s}},function(s){if(n.status==="pending"){var c=n;c.status="rejected",c.reason=s}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,jg(e),e}throw Bs=n,Cr}}function Is(e){try{var n=e._init;return n(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(Bs=a,Cr):a}}var Bs=null;function Vg(){if(Bs===null)throw Error(o(459));var e=Bs;return Bs=null,e}function jg(e){if(e===Cr||e===mc)throw Error(o(483))}var Rr=null,Zo=0;function vc(e){var n=Zo;return Zo+=1,Rr===null&&(Rr=[]),Gg(Rr,e,n)}function Xa(e,n){n=n.props.ref,e.ref=n!==void 0?n:null}function _c(e,n){throw n.$$typeof===X?Error(o(525)):(e=Object.prototype.toString.call(n),Error(o(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)))}function kg(e){function n(Z,G){if(e){var te=Z.deletions;te===null?(Z.deletions=[G],Z.flags|=16):te.push(G)}}function a(Z,G){if(!e)return null;for(;G!==null;)n(Z,G),G=G.sibling;return null}function s(Z){for(var G=new Map;Z!==null;)Z.key===null?G.set(Z.index,Z):G.set(Z.key,Z),Z=Z.sibling;return G}function c(Z,G){return Z=va(Z,G),Z.index=0,Z.sibling=null,Z}function f(Z,G,te){return Z.index=te,e?(te=Z.alternate,te!==null?(te=te.index,te<G?(Z.flags|=2,G):te):(Z.flags|=134217730,G)):(Z.flags|=1048576,G)}function _(Z){return e&&Z.alternate===null&&(Z.flags|=134217730),Z}function b(Z,G,te,ge){return G===null||G.tag!==6?(G=Of(te,Z.mode,ge),G.return=Z,G):(G=c(G,te),G.return=Z,G)}function L(Z,G,te,ge){var Xe=te.type;return Xe===B?(Z=oe(Z,G,te.props.children,ge,te.key),Xa(Z,te),Z):G!==null&&(G.elementType===Xe||typeof Xe=="object"&&Xe!==null&&Xe.$$typeof===Se&&Is(Xe)===G.type)?(G=c(G,te.props),Xa(G,te),G.return=Z,G):(G=oc(te.type,te.key,te.props,null,Z.mode,ge),Xa(G,te),G.return=Z,G)}function K(Z,G,te,ge){return G===null||G.tag!==4||G.stateNode.containerInfo!==te.containerInfo||G.stateNode.implementation!==te.implementation?(G=zf(te,Z.mode,ge),G.return=Z,G):(G=c(G,te.children||[]),G.return=Z,G)}function oe(Z,G,te,ge,Xe){return G===null||G.tag!==7?(G=Ns(te,Z.mode,ge,Xe),G.return=Z,G):(G=c(G,te),G.return=Z,G)}function _e(Z,G,te){if(typeof G=="string"&&G!==""||typeof G=="number"||typeof G=="bigint")return G=Of(""+G,Z.mode,te),G.return=Z,G;if(typeof G=="object"&&G!==null){switch(G.$$typeof){case w:return te=oc(G.type,G.key,G.props,null,Z.mode,te),Xa(te,G),te.return=Z,te;case N:return G=zf(G,Z.mode,te),G.return=Z,G;case Se:return G=Is(G),_e(Z,G,te)}if(Q(G)||re(G))return G=Ns(G,Z.mode,te,null),G.return=Z,G;if(typeof G.then=="function")return _e(Z,vc(G),te);if(G.$$typeof===fe)return _e(Z,hc(Z,G),te);_c(Z,G)}return null}function Y(Z,G,te,ge){var Xe=G!==null?G.key:null;if(typeof te=="string"&&te!==""||typeof te=="number"||typeof te=="bigint")return Xe!==null?null:b(Z,G,""+te,ge);if(typeof te=="object"&&te!==null){switch(te.$$typeof){case w:return te.key===Xe?L(Z,G,te,ge):null;case N:return te.key===Xe?K(Z,G,te,ge):null;case Se:return te=Is(te),Y(Z,G,te,ge)}if(Q(te)||re(te))return Xe!==null?null:oe(Z,G,te,ge,null);if(typeof te.then=="function")return Y(Z,G,vc(te),ge);if(te.$$typeof===fe)return Y(Z,G,hc(Z,te),ge);_c(Z,te)}return null}function ae(Z,G,te,ge,Xe){if(typeof ge=="string"&&ge!==""||typeof ge=="number"||typeof ge=="bigint")return Z=Z.get(te)||null,b(G,Z,""+ge,Xe);if(typeof ge=="object"&&ge!==null){switch(ge.$$typeof){case w:return Z=Z.get(ge.key===null?te:ge.key)||null,L(G,Z,ge,Xe);case N:return Z=Z.get(ge.key===null?te:ge.key)||null,K(G,Z,ge,Xe);case Se:return ge=Is(ge),ae(Z,G,te,ge,Xe)}if(Q(ge)||re(ge))return Z=Z.get(te)||null,oe(G,Z,ge,Xe,null);if(typeof ge.then=="function")return ae(Z,G,te,vc(ge),Xe);if(ge.$$typeof===fe)return ae(Z,G,te,hc(G,ge),Xe);_c(G,ge)}return null}function Oe(Z,G,te,ge){for(var Xe=null,Ct=null,tt=G,lt=G=0,pn=null;tt!==null&&lt<te.length;lt++){tt.index>lt?(pn=tt,tt=null):pn=tt.sibling;var Dt=Y(Z,tt,te[lt],ge);if(Dt===null){tt===null&&(tt=pn);break}e&&tt&&Dt.alternate===null&&n(Z,tt),G=f(Dt,G,lt),Ct===null?Xe=Dt:Ct.sibling=Dt,Ct=Dt,tt=pn}if(lt===te.length)return a(Z,tt),St&&_a(Z,lt),Xe;if(tt===null){for(;lt<te.length;lt++)tt=_e(Z,te[lt],ge),tt!==null&&(G=f(tt,G,lt),Ct===null?Xe=tt:Ct.sibling=tt,Ct=tt);return St&&_a(Z,lt),Xe}for(tt=s(tt);lt<te.length;lt++)pn=ae(tt,Z,lt,te[lt],ge),pn!==null&&(e&&(Dt=pn.alternate,Dt!==null&&tt.delete(Dt.key===null?lt:Dt.key)),G=f(pn,G,lt),Ct===null?Xe=pn:Ct.sibling=pn,Ct=pn);return e&&tt.forEach(function(us){return n(Z,us)}),St&&_a(Z,lt),Xe}function Ze(Z,G,te,ge){if(te==null)throw Error(o(151));for(var Xe=null,Ct=null,tt=G,lt=G=0,pn=null,Dt=te.next();tt!==null&&!Dt.done;lt++,Dt=te.next()){tt.index>lt?(pn=tt,tt=null):pn=tt.sibling;var us=Y(Z,tt,Dt.value,ge);if(us===null){tt===null&&(tt=pn);break}e&&tt&&us.alternate===null&&n(Z,tt),G=f(us,G,lt),Ct===null?Xe=us:Ct.sibling=us,Ct=us,tt=pn}if(Dt.done)return a(Z,tt),St&&_a(Z,lt),Xe;if(tt===null){for(;!Dt.done;lt++,Dt=te.next())Dt=_e(Z,Dt.value,ge),Dt!==null&&(G=f(Dt,G,lt),Ct===null?Xe=Dt:Ct.sibling=Dt,Ct=Dt);return St&&_a(Z,lt),Xe}for(tt=s(tt);!Dt.done;lt++,Dt=te.next())Dt=ae(tt,Z,lt,Dt.value,ge),Dt!==null&&(e&&(pn=Dt.alternate,pn!==null&&tt.delete(pn.key===null?lt:pn.key)),G=f(Dt,G,lt),Ct===null?Xe=Dt:Ct.sibling=Dt,Ct=Dt);return e&&tt.forEach(function(k1){return n(Z,k1)}),St&&_a(Z,lt),Xe}function mt(Z,G,te,ge){if(typeof te=="object"&&te!==null&&te.type===B&&te.key===null&&te.props.ref===void 0&&(te=te.props.children),typeof te=="object"&&te!==null){switch(te.$$typeof){case w:e:{for(var Xe=te.key;G!==null;){if(G.key===Xe){if(Xe=te.type,Xe===B){if(G.tag===7){a(Z,G.sibling),ge=c(G,te.props.children),Xa(ge,te),ge.return=Z,Z=ge;break e}}else if(G.elementType===Xe||typeof Xe=="object"&&Xe!==null&&Xe.$$typeof===Se&&Is(Xe)===G.type){a(Z,G.sibling),ge=c(G,te.props),Xa(ge,te),ge.return=Z,Z=ge;break e}a(Z,G);break}else n(Z,G);G=G.sibling}te.type===B?(ge=Ns(te.props.children,Z.mode,ge,te.key),Xa(ge,te),ge.return=Z,Z=ge):(ge=oc(te.type,te.key,te.props,null,Z.mode,ge),Xa(ge,te),ge.return=Z,Z=ge)}return _(Z);case N:e:{for(Xe=te.key;G!==null;){if(G.key===Xe)if(G.tag===4&&G.stateNode.containerInfo===te.containerInfo&&G.stateNode.implementation===te.implementation){a(Z,G.sibling),ge=c(G,te.children||[]),ge.return=Z,Z=ge;break e}else{a(Z,G);break}else n(Z,G);G=G.sibling}ge=zf(te,Z.mode,ge),ge.return=Z,Z=ge}return _(Z);case Se:return te=Is(te),mt(Z,G,te,ge)}if(Q(te))return Oe(Z,G,te,ge);if(re(te)){if(Xe=re(te),typeof Xe!="function")throw Error(o(150));return te=Xe.call(te),Ze(Z,G,te,ge)}if(typeof te.then=="function")return mt(Z,G,vc(te),ge);if(te.$$typeof===fe)return mt(Z,G,hc(Z,te),ge);_c(Z,te)}return typeof te=="string"&&te!==""||typeof te=="number"||typeof te=="bigint"?(te=""+te,G!==null&&G.tag===6?(a(Z,G.sibling),ge=c(G,te),ge.return=Z,Z=ge):(a(Z,G),ge=Of(te,Z.mode,ge),ge.return=Z,Z=ge),_(Z)):a(Z,G)}return function(Z,G,te,ge){try{Zo=0;var Xe=mt(Z,G,te,ge);return Rr=null,Xe}catch(tt){if(tt===Cr||tt===mc)throw tt;var Ct=Wn(29,tt,null,Z.mode);return Ct.lanes=ge,Ct.return=Z,Ct}finally{}}}var Fs=kg(!0),Xg=kg(!1),qa=!1;function Xf(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function qf(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Ya(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Wa(e,n,a){var s=e.updateQueue;if(s===null)return null;if(s=s.shared,(Bt&2)!==0){var c=s.pending;return c===null?n.next=n:(n.next=c.next,c.next=n),s.pending=n,n=rc(e),Rg(e,null,a),n}return sc(e,s,n,a),rc(e)}function Ko(e,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var s=n.lanes;s&=e.pendingLanes,a|=s,n.lanes=a,J(e,a)}}function Yf(e,n){var a=e.updateQueue,s=e.alternate;if(s!==null&&(s=s.updateQueue,a===s)){var c=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var _={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?c=f=_:f=f.next=_,a=a.next}while(a!==null);f===null?c=f=n:f=f.next=n}else c=f=n;a={baseState:s.baseState,firstBaseUpdate:c,lastBaseUpdate:f,shared:s.shared,callbacks:s.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=n:e.next=n,a.lastBaseUpdate=n}var Wf=!1;function Qo(){if(Wf){var e=Ar;if(e!==null)throw e}}function Jo(e,n,a,s){Wf=!1;var c=e.updateQueue;qa=!1;var f=c.firstBaseUpdate,_=c.lastBaseUpdate,b=c.shared.pending;if(b!==null){c.shared.pending=null;var L=b,K=L.next;L.next=null,_===null?f=K:_.next=K,_=L;var oe=e.alternate;oe!==null&&(oe=oe.updateQueue,b=oe.lastBaseUpdate,b!==_&&(b===null?oe.firstBaseUpdate=K:b.next=K,oe.lastBaseUpdate=L))}if(f!==null){var _e=c.baseState;_=0,oe=K=L=null,b=f;do{var Y=b.lane&-536870913,ae=Y!==b.lane;if(ae?(At&Y)===Y:(s&Y)===Y){Y!==0&&Y===zs&&(Wf=!0),oe!==null&&(oe=oe.next={lane:0,tag:b.tag,payload:b.payload,callback:null,next:null});e:{var Oe=e,Ze=b;Y=n;var mt=a;switch(Ze.tag){case 1:if(Oe=Ze.payload,typeof Oe=="function"){_e=Oe.call(mt,_e,Y);break e}_e=Oe;break e;case 3:Oe.flags=Oe.flags&-65537|128;case 0:if(Oe=Ze.payload,Y=typeof Oe=="function"?Oe.call(mt,_e,Y):Oe,Y==null)break e;_e=z({},_e,Y);break e;case 2:qa=!0}}Y=b.callback,Y!==null&&(e.flags|=64,ae&&(e.flags|=8192),ae=c.callbacks,ae===null?c.callbacks=[Y]:ae.push(Y))}else ae={lane:Y,tag:b.tag,payload:b.payload,callback:b.callback,next:null},oe===null?(K=oe=ae,L=_e):oe=oe.next=ae,_|=Y;if(b=b.next,b===null){if(b=c.shared.pending,b===null)break;ae=b,b=ae.next,ae.next=null,c.lastBaseUpdate=ae,c.shared.pending=null}}while(!0);oe===null&&(L=_e),c.baseState=L,c.firstBaseUpdate=K,c.lastBaseUpdate=oe,f===null&&(c.shared.lanes=0),ts|=_,e.lanes=_,e.memoizedState=_e}}function qg(e,n){if(typeof e!="function")throw Error(o(191,e));e.call(n)}function Yg(e,n){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)qg(a[e],n)}var Za=ke(null),xc=ke(0);function Wg(e,n){e=ba,at(xc,e),at(Za,n),ba=e|n.baseLanes}function Zf(){at(xc,ba),at(Za,Za.current)}function Kf(){ba=xc.current,De(Za),De(xc)}var Cn=ke(null),Pn=null;function Ka(e){var n=e.alternate;at(Rn,Rn.current&1),at(Cn,e),Pn===null&&(n===null||Za.current!==null||n.memoizedState!==null)&&(Pn=e)}function Qf(e){at(Rn,Rn.current),at(Cn,e),Pn===null&&(Pn=e)}function Zg(e){e.tag===22?(at(Rn,Rn.current),at(Cn,e),Pn===null&&(Pn=e)):Qa()}function Qa(){at(Rn,Rn.current),at(Cn,Cn.current)}function si(e){De(Cn),Pn===e&&(Pn=null),De(Rn)}var Rn=ke(0);function $o(e,n){at(Cn,Cn.current),at(Rn,n)}function Jf(e){De(Rn),De(Cn),Pn===e&&(Pn=null)}function yc(e){for(var n=e;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||yh(a)||Sh(a)))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!=="independent"){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var Sa=0,pt=null,Yt=null,dn=null,Sc=!1,wr=!1,Hs=!1,Mc=0,el=0,Nr=null,fM=0;function rn(){throw Error(o(321))}function $f(e,n){if(n===null)return!1;for(var a=0;a<n.length&&a<e.length;a++)if(!ai(e[a],n[a]))return!1;return!0}function ed(e,n,a,s,c,f){return Sa=f,pt=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,de.H=e===null||e.memoizedState===null?U0:L0,Hs=!1,f=a(s,c),Hs=!1,wr&&(f=Qg(n,a,s,c)),Kg(e),f}function Kg(e){de.H=wc;var n=Yt!==null&&Yt.next!==null;if(Sa=0,dn=Yt=pt=null,Sc=!1,el=0,Nr=null,n)throw Error(o(300));e===null||hn||(e=e.dependencies,e!==null&&dc(e)&&(hn=!0))}function Qg(e,n,a,s){pt=e;var c=0;do{if(wr&&(Nr=null),el=0,wr=!1,25<=c)throw Error(o(301));if(c+=1,dn=Yt=null,e.updateQueue!=null){var f=e.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}de.H=xM,f=n(a,s)}while(wr);return f}function dM(){var e=de.H,n=e.useState()[0];return n=typeof n.then=="function"?tl(n):n,e=e.useState()[0],(Yt!==null?Yt.memoizedState:null)!==e&&(pt.flags|=1024),n}function td(){var e=Mc!==0;return Mc=0,e}function nd(e,n,a){n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~a}function id(e){if(Sc){for(e=e.memoizedState;e!==null;){var n=e.queue;n!==null&&(n.pending=null),e=e.next}Sc=!1}Sa=0,dn=Yt=pt=null,wr=!1,el=Mc=0,Nr=null}function Vn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return dn===null?pt.memoizedState=dn=e:dn=dn.next=e,dn}function cn(){if(Yt===null){var e=pt.alternate;e=e!==null?e.memoizedState:null}else e=Yt.next;var n=dn===null?pt.memoizedState:dn.next;if(n!==null)dn=n,Yt=e;else{if(e===null)throw pt.alternate===null?Error(o(467)):Error(o(310));Yt=e,e={memoizedState:Yt.memoizedState,baseState:Yt.baseState,baseQueue:Yt.baseQueue,queue:Yt.queue,next:null},dn===null?pt.memoizedState=dn=e:dn=dn.next=e}return dn}function Ec(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function tl(e){var n=el;return el+=1,Nr===null&&(Nr=[]),e=Gg(Nr,e,n),n=pt,(dn===null?n.memoizedState:dn.next)===null&&(n=n.alternate,de.H=n===null||n.memoizedState===null?U0:L0),e}function Tc(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return tl(e);if(e.$$typeof===he)return;if(e.$$typeof===fe)return An(e)}throw Error(o(438,String(e)))}function ad(e){var n=null,a=pt.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var s=pt.alternate;s!==null&&(s=s.updateQueue,s!==null&&(s=s.memoCache,s!=null&&(n={data:s.data.map(function(c){return c.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=Ec(),pt.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(e),s=0;s<e;s++)a[s]=xt;return n.index++,a}function Ma(e,n){return typeof n=="function"?n(e):n}function bc(e){var n=cn();return sd(n,Yt,e)}function sd(e,n,a){var s=e.queue;if(s===null)throw Error(o(311));s.lastRenderedReducer=a;var c=e.baseQueue,f=s.pending;if(f!==null){if(c!==null){var _=c.next;c.next=f.next,f.next=_}n.baseQueue=c=f,s.pending=null}if(f=e.baseState,c===null)e.memoizedState=f;else{n=c.next;var b=_=null,L=null,K=n,oe=!1;do{var _e=K.lane&-536870913;if(_e!==K.lane?(At&_e)===_e:(Sa&_e)===_e){var Y=K.revertLane;if(Y===0)L!==null&&(L=L.next={lane:0,revertLane:0,gesture:null,action:K.action,hasEagerState:K.hasEagerState,eagerState:K.eagerState,next:null}),_e===zs&&(oe=!0);else if((Sa&Y)===Y){K=K.next,Y===zs&&(oe=!0);continue}else _e={lane:0,revertLane:K.revertLane,gesture:null,action:K.action,hasEagerState:K.hasEagerState,eagerState:K.eagerState,next:null},L===null?(b=L=_e,_=f):L=L.next=_e,pt.lanes|=Y,ts|=Y;_e=K.action,Hs&&a(f,_e),f=K.hasEagerState?K.eagerState:a(f,_e)}else Y={lane:_e,revertLane:K.revertLane,gesture:K.gesture,action:K.action,hasEagerState:K.hasEagerState,eagerState:K.eagerState,next:null},L===null?(b=L=Y,_=f):L=L.next=Y,pt.lanes|=_e,ts|=_e;K=K.next}while(K!==null&&K!==n);if(L===null?_=f:L.next=b,!ai(f,e.memoizedState)&&(hn=!0,oe&&(a=Ar,a!==null)))throw a;e.memoizedState=f,e.baseState=_,e.baseQueue=L,s.lastRenderedState=f}return c===null&&(s.lanes=0),[e.memoizedState,s.dispatch]}function rd(e){var n=cn(),a=n.queue;if(a===null)throw Error(o(311));a.lastRenderedReducer=e;var s=a.dispatch,c=a.pending,f=n.memoizedState;if(c!==null){a.pending=null;var _=c=c.next;do f=e(f,_.action),_=_.next;while(_!==c);ai(f,n.memoizedState)||(hn=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,s]}function Jg(e,n,a){var s=pt,c=cn(),f=St;if(f){if(a===void 0)throw Error(o(407));a=a()}else a=n();var _=!ai((Yt||c).memoizedState,a);if(_&&(c.memoizedState=a,hn=!0),c=c.queue,cd(t0.bind(null,s,c,e),[e]),e=c.getSnapshot!==n||_||dn!==null&&(dn.memoizedState.tag&1)!==0,Dr(e?9:8,{destroy:void 0},e0.bind(null,s,c,a,n),null),e){if(s.flags|=2048,Zt===null)throw Error(o(349));f||(Sa&127)!==0||$g(s,n,a)}return a}function $g(e,n,a){e.flags|=16384,e={getSnapshot:n,value:a},n=pt.updateQueue,n===null?(n=Ec(),pt.updateQueue=n,n.stores=[e]):(a=n.stores,a===null?n.stores=[e]:a.push(e))}function e0(e,n,a,s){n.value=a,n.getSnapshot=s,n0(n)&&i0(e)}function t0(e,n,a){return a(function(){n0(n)&&i0(e)})}function n0(e){var n=e.getSnapshot;e=e.value;try{var a=n();return!ai(e,a)}catch{return!0}}function i0(e){var n=ws(e,2);n!==null&&Jn(n,e,2)}function od(e){var n=Vn();if(typeof e=="function"){var a=e;if(e=a(),Hs){vn(!0);try{a()}finally{vn(!1)}}}return n.memoizedState=n.baseState=e,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ma,lastRenderedState:e},n}function a0(e,n,a,s){return e.baseState=a,sd(e,Yt,typeof s=="function"?s:Ma)}function hM(e,n,a,s,c){if(Rc(e))throw Error(o(485));if(e=n.action,e!==null){var f={payload:c,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(_){f.listeners.push(_)}};de.T!==null?a(!0):f.isTransition=!1,s(f),a=n.pending,a===null?(f.next=n.pending=f,s0(n,f)):(f.next=a.next,n.pending=a.next=f)}}function s0(e,n){var a=n.action,s=n.payload,c=e.state;if(n.isTransition){var f=de.T,_={};_.types=f!==null?f.types:null,de.T=_;try{var b=a(c,s),L=de.S;L!==null&&L(_,b),r0(e,n,b)}catch(K){ld(e,n,K)}finally{f!==null&&_.types!==null&&(f.types=_.types),de.T=f}}else try{f=a(c,s),r0(e,n,f)}catch(K){ld(e,n,K)}}function r0(e,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(s){o0(e,n,s)},function(s){return ld(e,n,s)}):o0(e,n,a)}function o0(e,n,a){n.status="fulfilled",n.value=a,l0(n),e.state=a,n=e.pending,n!==null&&(a=n.next,a===n?e.pending=null:(a=a.next,n.next=a,s0(e,a)))}function ld(e,n,a){var s=e.pending;if(e.pending=null,s!==null){s=s.next;do n.status="rejected",n.reason=a,l0(n),n=n.next;while(n!==s)}e.action=null}function l0(e){e=e.listeners;for(var n=0;n<e.length;n++)(0,e[n])()}function c0(e,n){return n}function u0(e,n){if(St){var a=Zt.formState;if(a!==null){e:{var s=pt;if(St){if(Qt){t:{for(var c=Qt,f=Mi;c.nodeType!==8;){if(!f){c=null;break t}if(c=Ti(c.nextSibling),c===null){c=null;break t}}f=c.data,c=f==="F!"||f==="F"?c:null}if(c){Qt=Ti(c.nextSibling),s=c.data==="F!";break e}}ja(s)}s=!1}s&&(n=a[0])}}return a=Vn(),a.memoizedState=a.baseState=n,s={pending:null,lanes:0,dispatch:null,lastRenderedReducer:c0,lastRenderedState:n},a.queue=s,a=w0.bind(null,pt,s),s.dispatch=a,s=od(!1),f=pd.bind(null,pt,!1,s.queue),s=Vn(),c={state:n,dispatch:null,action:e,pending:null},s.queue=c,a=hM.bind(null,pt,c,f,a),c.dispatch=a,s.memoizedState=e,[n,a,!1]}function f0(e){var n=cn();return d0(n,Yt,e)}function d0(e,n,a){if(n=sd(e,n,c0)[0],e=bc(Ma)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var s=tl(n)}catch(_){throw _===Cr?mc:_}else s=n;n=cn();var c=n.queue,f=c.dispatch;return a!==n.memoizedState&&(pt.flags|=2048,Dr(9,{destroy:void 0},pM.bind(null,c,a),null)),[s,f,e]}function pM(e,n){e.action=n}function h0(e){var n=cn(),a=Yt;if(a!==null)return d0(n,a,e);cn(),n=n.memoizedState,a=cn();var s=a.queue.dispatch;return a.memoizedState=e,[n,s,!1]}function Dr(e,n,a,s){return e={tag:e,create:a,deps:s,inst:n,next:null},n=pt.updateQueue,n===null&&(n=Ec(),pt.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=e.next=e:(s=a.next,a.next=e,e.next=s,n.lastEffect=e),e}function p0(){return cn().memoizedState}function Ac(e,n,a,s){var c=Vn();pt.flags|=e,c.memoizedState=Dr(1|n,{destroy:void 0},a,s===void 0?null:s)}function Cc(e,n,a,s){var c=cn();s=s===void 0?null:s;var f=c.memoizedState.inst;Yt!==null&&s!==null&&$f(s,Yt.memoizedState.deps)?c.memoizedState=Dr(n,f,a,s):(pt.flags|=e,c.memoizedState=Dr(1|n,f,a,s))}function m0(e,n){Ac(8390656,8,e,n)}function cd(e,n){Cc(2048,8,e,n)}function mM(e){pt.flags|=4;var n=pt.updateQueue;if(n===null)n=Ec(),pt.updateQueue=n,n.events=[e];else{var a=n.events;a===null?n.events=[e]:a.push(e)}}function g0(e){var n=cn().memoizedState;return mM({ref:n,nextImpl:e}),function(){if((Bt&2)!==0)throw Error(o(440));return n.impl.apply(void 0,arguments)}}function v0(e,n){return Cc(4,2,e,n)}function _0(e,n){return Cc(4,4,e,n)}function x0(e,n){if(typeof n=="function"){e=e();var a=n(e);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function y0(e,n,a){a=a!=null?a.concat([e]):null,Cc(4,4,x0.bind(null,n,e),a)}function ud(){}function S0(e,n){var a=cn();n=n===void 0?null:n;var s=a.memoizedState;return n!==null&&$f(n,s[1])?s[0]:(a.memoizedState=[e,n],e)}function M0(e,n){var a=cn();n=n===void 0?null:n;var s=a.memoizedState;if(n!==null&&$f(n,s[1]))return s[0];if(s=e(),Hs){vn(!0);try{e()}finally{vn(!1)}}return a.memoizedState=[s,n],s}function fd(e,n,a){return a===void 0||(Sa&1073741824)!==0&&(At&261930)===0?e.memoizedState=n:(e.memoizedState=a,e=Uv(),pt.lanes|=e,ts|=e,a)}function E0(e,n,a,s){return ai(a,n)?a:Za.current!==null?(e=fd(e,a,s),ai(e,n)||(hn=!0),e):(Sa&106)===0||(Sa&1073741824)!==0&&(At&261930)===0?(hn=!0,e.memoizedState=a):(e=Uv(),pt.lanes|=e,ts|=e,n)}function T0(e,n,a,s,c){var f=je.p;je.p=f!==0&&8>f?f:8;var _=de.T,b={};b.types=_!==null?_.types:null,de.T=b,pd(e,!1,n,a);try{var L=c(),K=de.S;if(K!==null&&K(b,L),L!==null&&typeof L=="object"&&typeof L.then=="function"){var oe=uM(L,s);nl(e,n,oe,ci(e))}else nl(e,n,s,ci(e))}catch(_e){nl(e,n,{then:function(){},status:"rejected",reason:_e},ci())}finally{je.p=f,_!==null&&b.types!==null&&(_.types=b.types),de.T=_}}function gM(){}function dd(e,n,a,s){if(e.tag!==5)throw Error(o(476));var c=b0(e).queue;T0(e,c,n,P,a===null?gM:function(){return A0(e),a(s)})}function b0(e){var n=e.memoizedState;if(n!==null)return n;n={memoizedState:P,baseState:P,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ma,lastRenderedState:P},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ma,lastRenderedState:a},next:null},e.memoizedState=n,e=e.alternate,e!==null&&(e.memoizedState=n),n}function A0(e){var n=b0(e);n.next===null&&(n=e.alternate.memoizedState),nl(e,n.next.queue,{},ci())}function hd(){return An(Kr)}function C0(){return cn().memoizedState}function R0(){return cn().memoizedState}function vM(e){for(var n=e.return;n!==null;){switch(n.tag){case 24:case 3:var a=ci();e=Ya(a);var s=Wa(n,e,a);s!==null&&(Jn(s,n,a),Ko(s,n,a)),n={cache:Gf()},e.payload=n;return}n=n.return}}function _M(e,n,a){var s=ci();a={lane:s,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Rc(e)?N0(n,a):(a=Uf(e,n,a,s),a!==null&&(Jn(a,e,s),D0(a,n,s)))}function w0(e,n,a){var s=ci();nl(e,n,a,s)}function nl(e,n,a,s){var c={lane:s,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Rc(e))N0(n,c);else{var f=e.alternate;if(e.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var _=n.lastRenderedState,b=f(_,a);if(c.hasEagerState=!0,c.eagerState=b,ai(b,_))return sc(e,n,c,0),Zt===null&&ac(),!1}catch{}finally{}if(a=Uf(e,n,c,s),a!==null)return Jn(a,e,s),D0(a,n,s),!0}return!1}function pd(e,n,a,s){if(s={lane:2,revertLane:ah(),gesture:null,action:s,hasEagerState:!1,eagerState:null,next:null},Rc(e)){if(n)throw Error(o(479))}else n=Uf(e,a,s,2),n!==null&&Jn(n,e,2)}function Rc(e){var n=e.alternate;return e===pt||n!==null&&n===pt}function N0(e,n){wr=Sc=!0;var a=e.pending;a===null?n.next=n:(n.next=a.next,a.next=n),e.pending=n}function D0(e,n,a){if((a&4194048)!==0){var s=n.lanes;s&=e.pendingLanes,a|=s,n.lanes=a,J(e,a)}}var wc={readContext:An,use:Tc,useCallback:rn,useContext:rn,useEffect:rn,useImperativeHandle:rn,useLayoutEffect:rn,useInsertionEffect:rn,useMemo:rn,useReducer:rn,useRef:rn,useState:rn,useDebugValue:rn,useDeferredValue:rn,useTransition:rn,useSyncExternalStore:rn,useId:rn,useHostTransitionStatus:rn,useFormState:rn,useActionState:rn,useOptimistic:rn,useMemoCache:rn,useCacheRefresh:rn,useEffectEvent:rn},U0={readContext:An,use:Tc,useCallback:function(e,n){return Vn().memoizedState=[e,n===void 0?null:n],e},useContext:An,useEffect:m0,useImperativeHandle:function(e,n,a){a=a!=null?a.concat([e]):null,Ac(4194308,4,x0.bind(null,n,e),a)},useLayoutEffect:function(e,n){return Ac(4194308,4,e,n)},useInsertionEffect:function(e,n){Ac(4,2,e,n)},useMemo:function(e,n){var a=Vn();n=n===void 0?null:n;var s=e();if(Hs){vn(!0);try{e()}finally{vn(!1)}}return a.memoizedState=[s,n],s},useReducer:function(e,n,a){var s=Vn();if(a!==void 0){var c=a(n);if(Hs){vn(!0);try{a(n)}finally{vn(!1)}}}else c=n;return s.memoizedState=s.baseState=c,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:c},s.queue=e,e=e.dispatch=_M.bind(null,pt,e),[s.memoizedState,e]},useRef:function(e){var n=Vn();return e={current:e},n.memoizedState=e},useState:function(e){e=od(e);var n=e.queue,a=w0.bind(null,pt,n);return n.dispatch=a,[e.memoizedState,a]},useDebugValue:ud,useDeferredValue:function(e,n){var a=Vn();return fd(a,e,n)},useTransition:function(){var e=od(!1);return e=T0.bind(null,pt,e.queue,!0,!1),Vn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,n,a){var s=pt,c=Vn();if(St){if(a===void 0)throw Error(o(407));a=a()}else{if(a=n(),Zt===null)throw Error(o(349));(At&127)!==0||$g(s,n,a)}c.memoizedState=a;var f={value:a,getSnapshot:n};return c.queue=f,m0(t0.bind(null,s,f,e),[e]),s.flags|=2048,Dr(9,{destroy:void 0},e0.bind(null,s,f,a,n),null),a},useId:function(){var e=Vn(),n=Zt.identifierPrefix;if(St){var a=Qi,s=Ki;a=(s&~(1<<32-On(s)-1)).toString(32)+a,n="_"+n+"R_"+a,a=Mc++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=fM++,n="_"+n+"r_"+a.toString(32)+"_";return e.memoizedState=n},useHostTransitionStatus:hd,useFormState:u0,useActionState:u0,useOptimistic:function(e){var n=Vn();n.memoizedState=n.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=pd.bind(null,pt,!0,a),a.dispatch=n,[e,n]},useMemoCache:ad,useCacheRefresh:function(){return Vn().memoizedState=vM.bind(null,pt)},useEffectEvent:function(e){var n=Vn(),a={impl:e};return n.memoizedState=a,function(){if((Bt&2)!==0)throw Error(o(440));return a.impl.apply(void 0,arguments)}}},L0={readContext:An,use:Tc,useCallback:S0,useContext:An,useEffect:cd,useImperativeHandle:y0,useInsertionEffect:v0,useLayoutEffect:_0,useMemo:M0,useReducer:bc,useRef:p0,useState:function(){return bc(Ma)},useDebugValue:ud,useDeferredValue:function(e,n){var a=cn();return E0(a,Yt.memoizedState,e,n)},useTransition:function(){var e=bc(Ma)[0],n=cn().memoizedState;return[typeof e=="boolean"?e:tl(e),n]},useSyncExternalStore:Jg,useId:C0,useHostTransitionStatus:hd,useFormState:f0,useActionState:f0,useOptimistic:function(e,n){var a=cn();return a0(a,Yt,e,n)},useMemoCache:ad,useCacheRefresh:R0,useEffectEvent:g0},xM={readContext:An,use:Tc,useCallback:S0,useContext:An,useEffect:cd,useImperativeHandle:y0,useInsertionEffect:v0,useLayoutEffect:_0,useMemo:M0,useReducer:rd,useRef:p0,useState:function(){return rd(Ma)},useDebugValue:ud,useDeferredValue:function(e,n){var a=cn();return Yt===null?fd(a,e,n):E0(a,Yt.memoizedState,e,n)},useTransition:function(){var e=rd(Ma)[0],n=cn().memoizedState;return[typeof e=="boolean"?e:tl(e),n]},useSyncExternalStore:Jg,useId:C0,useHostTransitionStatus:hd,useFormState:h0,useActionState:h0,useOptimistic:function(e,n){var a=cn();return Yt!==null?a0(a,Yt,e,n):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:ad,useCacheRefresh:R0,useEffectEvent:g0};function md(e,n,a,s){n=e.memoizedState,a=a(s,n),a=a==null?n:z({},n,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var gd={enqueueSetState:function(e,n,a){e=e._reactInternals;var s=ci(),c=Ya(s);c.payload=n,a!=null&&(c.callback=a),n=Wa(e,c,s),n!==null&&(Jn(n,e,s),Ko(n,e,s))},enqueueReplaceState:function(e,n,a){e=e._reactInternals;var s=ci(),c=Ya(s);c.tag=1,c.payload=n,a!=null&&(c.callback=a),n=Wa(e,c,s),n!==null&&(Jn(n,e,s),Ko(n,e,s))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var a=ci(),s=Ya(a);s.tag=2,n!=null&&(s.callback=n),n=Wa(e,s,a),n!==null&&(Jn(n,e,a),Ko(n,e,a))}};function O0(e,n,a,s,c,f,_){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(s,f,_):n.prototype&&n.prototype.isPureReactComponent?!Vo(a,s)||!Vo(c,f):!0}function z0(e,n,a,s){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,s),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,s),n.state!==e&&gd.enqueueReplaceState(n,n.state,null)}function Gs(e,n){var a=n;if("ref"in n){a={};for(var s in n)s!=="ref"&&(a[s]=n[s])}if(e=e.defaultProps){a===n&&(a=z({},a));for(var c in e)a[c]===void 0&&(a[c]=e[c])}return a}function P0(e){ic(e)}function I0(e){console.error(e)}function B0(e){ic(e)}function Nc(e,n){try{var a=e.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(s){setTimeout(function(){throw s})}}function F0(e,n,a){try{var s=e.onCaughtError;s(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(c){setTimeout(function(){throw c})}}function vd(e,n,a){return a=Ya(a),a.tag=3,a.payload={element:null},a.callback=function(){Nc(e,n)},a}function H0(e){return e=Ya(e),e.tag=3,e}function G0(e,n,a,s){var c=a.type.getDerivedStateFromError;if(typeof c=="function"){var f=s.value;e.payload=function(){return c(f)},e.callback=function(){F0(n,a,s)}}var _=a.stateNode;_!==null&&typeof _.componentDidCatch=="function"&&(e.callback=function(){F0(n,a,s),typeof c!="function"&&(ns===null?ns=new Set([this]):ns.add(this));var b=s.stack;this.componentDidCatch(s.value,{componentStack:b!==null?b:""})})}function yM(e,n,a,s,c){if(a.flags|=32768,s!==null&&typeof s=="object"&&typeof s.then=="function"){if(n=a.alternate,n!==null&&Ls(n,a,c,!0),a=Cn.current,a!==null){switch(a.tag){case 31:case 13:case 19:return Pn===null?Qc():a.alternate===null&&on===0&&(on=3),a.flags&=-257,a.flags|=65536,a.lanes=c,s===gc?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([s]):n.add(s),th(e,s,c)),!1;case 22:return a.flags|=65536,s===gc?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([s])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([s]):a.add(s)),th(e,s,c)),!1}throw Error(o(435,a.tag))}return th(e,s,c),Qc(),!1}if(St)return n=Cn.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=c,s!==If&&(e=Error(o(422),{cause:s}),Xo(xi(e,a)))):(s!==If&&(n=Error(o(423),{cause:s}),Xo(xi(n,a))),e=e.current.alternate,e.flags|=65536,c&=-c,e.lanes|=c,s=xi(s,a),c=vd(e.stateNode,s,c),Yf(e,c),on!==4&&(on=2)),!1;var f=Error(o(520),{cause:s});if(f=xi(f,a),ul===null?ul=[f]:ul.push(f),on!==4&&(on=2),n===null)return!0;s=xi(s,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,e=c&-c,a.lanes|=e,e=vd(a.stateNode,s,e),Yf(a,e),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(ns===null||!ns.has(f))))return a.flags|=65536,c&=-c,a.lanes|=c,c=H0(c),G0(c,e,a,s),Yf(a,c),!1;break;case 22:if(a.memoizedState!==null)return a.flags|=65536,!1}a=a.return}while(a!==null);return!1}var _d=Error(o(461)),hn=!1;function xn(e,n,a,s){n.child=e===null?Xg(n,null,a,s):Fs(n,e.child,a,s)}function V0(e,n,a,s,c){a=a.render;var f=n.ref;if("ref"in s){var _={};for(var b in s)b!=="ref"&&(_[b]=s[b])}else _=s;return Os(n),s=ed(e,n,a,_,f,c),b=td(),e!==null&&!hn?(nd(e,n,c),Ea(e,n,c)):(St&&b&&cc(n),n.flags|=1,xn(e,n,s,c),n.child)}function j0(e,n,a,s,c){if(e===null){var f=a.type;return typeof f=="function"&&!Lf(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,k0(e,n,f,s,c)):(e=oc(a.type,null,s,n,n.mode,c),e.ref=n.ref,e.return=n,n.child=e)}if(f=e.child,!Ad(e,c)){var _=f.memoizedProps;if(a=a.compare,a=a!==null?a:Vo,a(_,s)&&e.ref===n.ref)return Ea(e,n,c)}return n.flags|=1,e=va(f,s),e.ref=n.ref,e.return=n,n.child=e}function k0(e,n,a,s,c){if(e!==null){var f=e.memoizedProps;if(Vo(f,s)&&e.ref===n.ref)if(hn=!1,n.pendingProps=s=f,Ad(e,c))(e.flags&131072)!==0&&(hn=!0);else return n.lanes=e.lanes,Ea(e,n,c)}return xd(e,n,a,s,c)}function X0(e,n,a,s){var c=s.children,f=e!==null?e.memoizedState:null;if(e===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),s.mode==="hidden"){if((n.flags&128)!==0){if(f=f!==null?f.baseLanes|a:a,e!==null){for(s=n.child=e.child,c=0;s!==null;)c=c|s.lanes|s.childLanes,s=s.sibling;s=c&~f}else s=0,n.child=null;return q0(e,n,f,a,s)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},e!==null&&pc(n,f!==null?f.cachePool:null),f!==null?Wg(n,f):Zf(),Zg(n);else return s=n.lanes=536870912,q0(e,n,f!==null?f.baseLanes|a:a,a,s)}else f!==null?(pc(n,f.cachePool),Wg(n,f),Qa(),n.memoizedState=null):(e!==null&&pc(n,null),Zf(),Qa());return xn(e,n,c,a),n.child}function il(e,n){return e!==null&&e.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function q0(e,n,a,s,c){var f=jf();return f=f===null?null:{parent:fn._currentValue,pool:f},n.memoizedState={baseLanes:a,cachePool:f},e!==null&&pc(n,null),Zf(),Zg(n),e!==null&&Ls(e,n,s,!0),n.childLanes=c,null}function Dc(e,n){return n=Uc({mode:n.mode,children:n.children},e.mode),n.ref=e.ref,e.child=n,n.return=e,n}function Y0(e,n,a){return Fs(n,e.child,null,a),e=Dc(n,n.pendingProps),e.flags|=2,si(n),n.memoizedState=null,e}function SM(e,n,a){var s=n.pendingProps,c=(n.flags&128)!==0;if(n.flags&=-129,e===null){if(St){if(s.mode==="hidden")return e=Dc(n,s),n.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},il(null,e);if(Qf(n),(e=Qt)?(e=x_(e,Mi),e=e!==null&&e.data==="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Ga!==null?{id:Ki,overflow:Qi}:null,retryLane:536870912,hydrationErrors:null},a=Ng(e),a.return=n,n.child=a,Mn=n,Qt=null)):e=null,e===null)throw ja(n);return n.lanes=536870912,null}return Dc(n,s)}var f=e.memoizedState;if(f!==null){var _=f.dehydrated;if(Qf(n),c)if(n.flags&256)n.flags&=-257,n=Y0(e,n,a);else if(n.memoizedState!==null)n.child=e.child,n.flags|=128,n=null;else throw Error(o(558));else if(hn||Ls(e,n,a,!1),c=(a&e.childLanes)!==0,hn||c){if(Za.current===null){if(s=Zt,s!==null&&(_=ce(s,a),_!==0&&_!==f.retryLane))throw f.retryLane=_,ws(e,_),Jn(s,e,_),_d;Qc()}n=Y0(e,n,a)}else e=f.treeContext,Qt=Ti(_.nextSibling),Mn=n,St=!0,Va=null,Mi=!1,e!==null&&Lg(n,e),n=Dc(n,s),n.flags|=134221824;return n}return e=va(e.child,{mode:s.mode,children:s.children}),e.ref=n.ref,n.child=e,e.return=n,e}function Ur(e,n){var a=n.ref;if(a===null)e!==null&&e.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(o(284));(e===null||e.ref!==a)&&(n.flags|=4194816)}}function xd(e,n,a,s,c){return Os(n),a=ed(e,n,a,s,void 0,c),s=td(),e!==null&&!hn?(nd(e,n,c),Ea(e,n,c)):(St&&s&&cc(n),n.flags|=1,xn(e,n,a,c),n.child)}function W0(e,n,a,s,c,f){return Os(n),n.updateQueue=null,a=Qg(n,s,a,c),Kg(e),s=td(),e!==null&&!hn?(nd(e,n,f),Ea(e,n,f)):(St&&s&&cc(n),n.flags|=1,xn(e,n,a,f),n.child)}function Z0(e,n,a,s,c){if(Os(n),n.stateNode===null){var f=Mr,_=a.contextType;typeof _=="object"&&_!==null&&(f=An(_)),f=new a(s,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=gd,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=s,f.state=n.memoizedState,f.refs={},Xf(n),_=a.contextType,f.context=typeof _=="object"&&_!==null?An(_):Mr,f.state=n.memoizedState,_=a.getDerivedStateFromProps,typeof _=="function"&&(md(n,a,_,s),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(_=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),_!==f.state&&gd.enqueueReplaceState(f,f.state,null),Jo(n,s,f,c),Qo(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),s=!0}else if(e===null){f=n.stateNode;var b=n.memoizedProps,L=Gs(a,b);f.props=L;var K=f.context,oe=a.contextType;_=Mr,typeof oe=="object"&&oe!==null&&(_=An(oe));var _e=a.getDerivedStateFromProps;oe=typeof _e=="function"||typeof f.getSnapshotBeforeUpdate=="function",b=n.pendingProps!==b,oe||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(b||K!==_)&&z0(n,f,s,_),qa=!1;var Y=n.memoizedState;f.state=Y,Jo(n,s,f,c),Qo(),K=n.memoizedState,b||Y!==K||qa?(typeof _e=="function"&&(md(n,a,_e,s),K=n.memoizedState),(L=qa||O0(n,a,L,s,Y,K,_))?(oe||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=s,n.memoizedState=K),f.props=s,f.state=K,f.context=_,s=L):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),s=!1)}else{f=n.stateNode,qf(e,n),_=n.memoizedProps,oe=Gs(a,_),f.props=oe,_e=n.pendingProps,Y=f.context,K=a.contextType,L=Mr,typeof K=="object"&&K!==null&&(L=An(K)),b=a.getDerivedStateFromProps,(K=typeof b=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(_!==_e||Y!==L)&&z0(n,f,s,L),qa=!1,Y=n.memoizedState,f.state=Y,Jo(n,s,f,c),Qo();var ae=n.memoizedState;_!==_e||Y!==ae||qa||e!==null&&e.dependencies!==null&&dc(e.dependencies)?(typeof b=="function"&&(md(n,a,b,s),ae=n.memoizedState),(oe=qa||O0(n,a,oe,s,Y,ae,L)||e!==null&&e.dependencies!==null&&dc(e.dependencies))?(K||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(s,ae,L),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(s,ae,L)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||_===e.memoizedProps&&Y===e.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||_===e.memoizedProps&&Y===e.memoizedState||(n.flags|=1024),n.memoizedProps=s,n.memoizedState=ae),f.props=s,f.state=ae,f.context=L,s=oe):(typeof f.componentDidUpdate!="function"||_===e.memoizedProps&&Y===e.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||_===e.memoizedProps&&Y===e.memoizedState||(n.flags|=1024),s=!1)}return f=s,Ur(e,n),s=(n.flags&128)!==0,f||s?(f=n.stateNode,a=s&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,e!==null&&s?(n.child=Fs(n,e.child,null,c),n.child=Fs(n,null,a,c)):xn(e,n,a,c),n.memoizedState=f.state,e=n.child):e=Ea(e,n,c),e}function K0(e,n,a,s){return Ds(),n.flags|=256,xn(e,n,a,s),n.child}var yd={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Sd(e){return{baseLanes:e,cachePool:Fg()}}function Md(e,n,a){return e=e!==null?e.childLanes&~a:0,n&&(e|=li),e}function Q0(e,n,a){var s=n.pendingProps,c=!1,f=(n.flags&128)!==0,_;if((_=f)||(_=e!==null&&e.memoizedState===null?!1:(Rn.current&2)!==0),_&&(c=!0,n.flags&=-129),_=(n.flags&32)!==0,n.flags&=-33,e===null){if(St){if(c?Ka(n):Qa(),(e=Qt)?(e=x_(e,Mi),e=e!==null&&e.data!=="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Ga!==null?{id:Ki,overflow:Qi}:null,retryLane:536870912,hydrationErrors:null},a=Ng(e),a.return=n,n.child=a,Mn=n,Qt=null)):e=null,e===null)throw ja(n);return Sh(e)?n.lanes=32:n.lanes=536870912,null}return f=s.children,s=s.fallback,c?(Qa(),c=n.mode,f=Uc({mode:"hidden",children:f},c),s=Ns(s,c,a,null),f.return=n,s.return=n,f.sibling=s,n.child=f,s=n.child,s.memoizedState=Sd(a),s.childLanes=Md(e,_,a),n.memoizedState=yd,il(null,s)):(Ka(n),Ed(n,f))}var b=e.memoizedState;if(b!==null){var L=b.dehydrated;if(L!==null)return MM(e,n,f,_,s,L,b,a)}return c?(Qa(),c=s.fallback,f=n.mode,b=e.child,L=b.sibling,s=va(b,{mode:"hidden",children:s.children}),s.subtreeFlags=b.subtreeFlags&1206910976,L!==null?c=va(L,c):(c=Ns(c,f,a,null),c.flags|=2),c.return=n,s.return=n,s.sibling=c,n.child=s,il(null,s),s=n.child,c=e.child.memoizedState,c===null?c=Sd(a):(f=c.cachePool,f!==null?(b=fn._currentValue,f=f.parent!==b?{parent:b,pool:b}:f):f=Fg(),c={baseLanes:c.baseLanes|a,cachePool:f}),s.memoizedState=c,s.childLanes=Md(e,_,a),n.memoizedState=yd,il(e.child,s)):(Ka(n),a=e.child,e=a.sibling,a=va(a,{mode:"visible",children:s.children}),a.return=n,a.sibling=null,e!==null&&(_=n.deletions,_===null?(n.deletions=[e],n.flags|=16):_.push(e)),n.child=a,n.memoizedState=null,a)}function Ed(e,n){return n=Uc({mode:"visible",children:n},e.mode),n.return=e,e.child=n}function Uc(e,n){return e=Wn(22,e,null,n),e.lanes=0,e}function Lc(e,n,a){return Fs(n,e.child,null,a),e=Ed(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function MM(e,n,a,s,c,f,_,b){if(a)return n.flags&256?(Ka(n),n.flags&=-257,Lc(e,n,b)):n.memoizedState!==null?(Qa(),n.child=e.child,n.flags|=128,null):(Qa(),f=c.fallback,_=n.mode,c=Uc({mode:"visible",children:c.children},_),f=Ns(f,_,b,null),f.flags|=2,c.return=n,f.return=n,c.sibling=f,n.child=c,Fs(n,e.child,null,b),c=n.child,c.memoizedState=Sd(b),c.childLanes=Md(e,s,b),n.memoizedState=yd,il(null,c));if(Ka(n),Sh(f)){if(s=f.nextSibling&&f.nextSibling.dataset,s)var L=s.dgst;return s=L,s!==""&&(c=Error(o(419)),c.stack="",c.digest=s,Xo({value:c,source:null,stack:null})),Lc(e,n,b)}if(hn||Ls(e,n,b,!1),s=(b&e.childLanes)!==0,hn||s){if(Za.current!==null)return Lc(e,n,b);if(s=Zt,s!==null&&(c=ce(s,b),c!==0&&c!==_.retryLane))throw _.retryLane=c,ws(e,c),Jn(s,e,c),_d;return yh(f)||Qc(),Lc(e,n,b)}return yh(f)?(n.flags|=192,n.child=e.child,null):(e=_.treeContext,Qt=Ti(f.nextSibling),Mn=n,St=!0,Va=null,Mi=!1,e!==null&&Lg(n,e),n=Ed(n,c.children),n.flags|=134221824,n)}function J0(e,n,a){e.lanes|=n;var s=e.alternate;s!==null&&(s.lanes|=n),fc(e.return,n,a)}function $0(e){for(var n=null;e!==null;){var a=e.alternate;a!==null&&yc(a)===null&&(n=e),e=e.sibling}return n}function Oc(e,n,a,s,c,f){var _=e.memoizedState;_===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:s,tail:a,tailMode:c,treeForkCount:f}:(_.isBackwards=n,_.rendering=null,_.renderingStartTime=0,_.last=s,_.tail=a,_.tailMode=c,_.treeForkCount=f)}function Td(e){var n=e.child;for(e.child=null;n!==null;){var a=n.sibling;n.sibling=e.child,e.child=n,n=a}}function bd(e,n,a){var s=n.pendingProps,c=s.revealOrder,f=s.tail;s=s.children;var _=Rn.current;if(n.flags&128)return $o(n,_),null;var b=(_&2)!==0;if(b?(_=_&1|2,n.flags|=128):_&=1,$o(n,_),c==="backwards"&&e!==null?(Td(e),xn(e,n,s,a),Td(e)):xn(e,n,s,a),s=St?ko:0,!b&&e!==null&&(e.flags&128)!==0)e:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&J0(e,a,n);else if(e.tag===19)J0(e,a,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break e;for(;e.sibling===null;){if(e.return===null||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(c){case"backwards":a=$0(n.child),a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null,Td(n)),Oc(n,!0,c,null,f,s);break;case"unstable_legacy-backwards":for(a=null,c=n.child,n.child=null;c!==null;){if(e=c.alternate,e!==null&&yc(e)===null){n.child=c;break}e=c.sibling,c.sibling=a,a=c,c=e}Oc(n,!0,a,null,f,s);break;case"together":Oc(n,!1,null,null,void 0,s);break;case"independent":n.memoizedState=null;break;default:a=$0(n.child),a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null),Oc(n,!1,c,a,f,s)}return n.child}function ev(e,n,a){var s=n.pendingProps;return ka(n,n.type,s.value),xn(e,n,s.children,a),n.child}function Ea(e,n,a){if(e!==null&&(n.dependencies=e.dependencies),ts|=n.lanes,(a&n.childLanes)===0)if(e!==null){if(Ls(e,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(e!==null&&n.child!==e.child)throw Error(o(153));if(n.child!==null){for(e=n.child,a=va(e,e.pendingProps),n.child=a,a.return=n;e.sibling!==null;)e=e.sibling,a=a.sibling=va(e,e.pendingProps),a.return=n;a.sibling=null}return n.child}function Ad(e,n){return(e.lanes&n)!==0?!0:(e=e.dependencies,!!(e!==null&&dc(e)))}function EM(e,n,a){switch(n.tag){case 3:U(n,n.stateNode.containerInfo),ka(n,fn,e.memoizedState.cache),Ds();break;case 27:case 5:ie(n);break;case 4:U(n,n.stateNode.containerInfo);break;case 10:ka(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,Qf(n),null;break;case 13:var s=n.memoizedState;if(s!==null){if(s.dehydrated!==null)return Ka(n),n.flags|=128,null;s=Ls(e,n,a,!1);var c=n.child.childLanes;return s||(a&c)!==0?Q0(e,n,a):(Ka(n),e=Ea(e,n,a),e!==null?e.sibling:null)}Ka(n);break;case 19:if(n.flags&128)return bd(e,n,a);if(c=(e.flags&128)!==0,s=(a&n.childLanes)!==0,s||(Ls(e,n,a,!1),s=(a&n.childLanes)!==0),c){if(s)return bd(e,n,a);n.flags|=128}if(c=n.memoizedState,c!==null&&(c.rendering=null,c.tail=null,c.lastEffect=null),$o(n,Rn.current),s)break;return null;case 22:return n.lanes=0,X0(e,n,a,n.pendingProps);case 24:ka(n,fn,e.memoizedState.cache)}return Ea(e,n,a)}function tv(e,n,a){if(e!==null)if(e.memoizedProps!==n.pendingProps)hn=!0;else{if(!Ad(e,a)&&(n.flags&128)===0)return hn=!1,EM(e,n,a);hn=(e.flags&131072)!==0}else hn=!1,St&&(n.flags&1048576)!==0&&Ug(n,ko,n.index);switch(n.lanes=0,n.tag){case 16:e:{var s=n.pendingProps;if(e=Is(n.elementType),n.type=e,typeof e=="function")Lf(e)?(s=Gs(e,s),n.tag=1,n=Z0(null,n,e,s,a)):(n.tag=0,n=xd(null,n,e,s,a));else{if(e!=null){var c=e.$$typeof;if(c===q){n.tag=11,n=V0(null,n,e,s,a);break e}else if(c===xe){n.tag=14,n=j0(null,n,e,s,a);break e}else if(c===fe){n.tag=10,n.type=e,n=ev(null,n,a);break e}}throw n=we(e)||e,Error(o(306,n,""))}}return n;case 0:return xd(e,n,n.type,n.pendingProps,a);case 1:return s=n.type,c=Gs(s,n.pendingProps),Z0(e,n,s,c,a);case 3:e:{if(U(n,n.stateNode.containerInfo),e===null)throw Error(o(387));s=n.pendingProps;var f=n.memoizedState;c=f.element,qf(e,n),Jo(n,s,null,a);var _=n.memoizedState;if(s=_.cache,ka(n,fn,s),s!==f.cache&&Hf(n,[fn],a,!0),Qo(),s=_.element,f.isDehydrated)if(f={element:s,isDehydrated:!1,cache:_.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=K0(e,n,s,a);break e}else if(s!==c){c=xi(Error(o(424)),n),Xo(c),n=K0(e,n,s,a);break e}else{switch(e=n.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(Qt=Ti(e.firstChild),Mn=n,St=!0,Va=null,Mi=!0,a=Xg(n,null,s,a),n.child=a;a;)a.flags=a.flags&-3|134221824,a=a.sibling}else{if(Ds(),s===c){n=Ea(e,n,a);break e}xn(e,n,s,a)}n=n.child}return n;case 26:return Ur(e,n),e===null?(a=A_(n.type,null,n.pendingProps,null))?n.memoizedState=a:St||(n.stateNode=s_(n.type,n.pendingProps,gt.current,n)):n.memoizedState=A_(n.type,e.memoizedProps,n.pendingProps,e.memoizedState),null;case 27:return ie(n),e===null&&St&&(s=n.stateNode=M_(n.type,n.pendingProps,gt.current),Mn=n,Mi=!0,c=Qt,ss(n.type)?(Mh=c,Qt=Ti(s.firstChild)):Qt=c),xn(e,n,n.pendingProps.children,a),Ur(e,n),e===null&&(n.flags|=4194304),n.child;case 5:return e===null&&St&&((c=s=Qt)&&(s=v1(s,n.type,n.pendingProps,Mi),s!==null?(n.stateNode=s,Mn=n,Qt=Ti(s.firstChild),Mi=!1,c=!0):c=!1),c||ja(n)),ie(n),c=n.type,f=n.pendingProps,_=e!==null?e.memoizedProps:null,s=f.children,hh(c,f)?s=null:_!==null&&hh(c,_)&&(n.flags|=32),n.memoizedState!==null&&(c=ed(e,n,dM,null,null,a),Kr._currentValue=c),Ur(e,n),xn(e,n,s,a),n.child;case 6:return e===null&&St&&((e=a=Qt)&&(a=_1(a,n.pendingProps,Mi),a!==null?(n.stateNode=a,Mn=n,Qt=null,e=!0):e=!1),e||ja(n)),null;case 13:return Q0(e,n,a);case 4:return U(n,n.stateNode.containerInfo),s=n.pendingProps,e===null?n.child=Fs(n,null,s,a):xn(e,n,s,a),n.child;case 11:return V0(e,n,n.type,n.pendingProps,a);case 7:return s=n.pendingProps,Ur(e,n),xn(e,n,s,a),n.child;case 8:return xn(e,n,n.pendingProps.children,a),n.child;case 12:return xn(e,n,n.pendingProps.children,a),n.child;case 10:return ev(e,n,a);case 9:return c=n.type._context,s=n.pendingProps.children,Os(n),c=An(c),s=s(c),n.flags|=1,xn(e,n,s,a),n.child;case 14:return j0(e,n,n.type,n.pendingProps,a);case 15:return k0(e,n,n.type,n.pendingProps,a);case 19:return bd(e,n,a);case 31:return SM(e,n,a);case 22:return X0(e,n,a,n.pendingProps);case 24:return Os(n),s=An(fn),e===null?(c=jf(),c===null&&(c=Zt,f=Gf(),c.pooledCache=f,f.refCount++,f!==null&&(c.pooledCacheLanes|=a),c=f),n.memoizedState={parent:s,cache:c},Xf(n),ka(n,fn,c)):((e.lanes&a)!==0&&(qf(e,n),Jo(n,null,null,a),Qo()),c=e.memoizedState,f=n.memoizedState,c.parent!==s?(c={parent:s,cache:s},n.memoizedState=c,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=c),ka(n,fn,s)):(s=f.cache,ka(n,fn,s),s!==c.cache&&Hf(n,[fn],a,!0))),xn(e,n,n.pendingProps.children,a),n.child;case 30:return n.stateNode===null&&(n.stateNode={autoName:null,paired:null,clones:null,ref:null}),s=n.pendingProps,s.name!=null&&s.name!=="auto"?n.flags|=e===null?18882560:18874368:St&&cc(n),e!==null&&e.memoizedProps.name!==s.name?n.flags|=4194816:Ur(e,n),xn(e,n,s.children,a),n.child;case 29:throw n.pendingProps}throw Error(o(156,n.tag))}function Ta(e){e.flags|=4}function Cd(e,n,a,s,c){var f;if((f=(e.mode&32)!==0)&&(f=a===null?N_(n,s):N_(n,s)&&(s.src!==a.src||s.srcSet!==a.srcSet)),f){if(e.flags|=16777216,(c&335544128)===c)if(e.stateNode.complete)e.flags|=8192;else if(Pv())e.flags|=8192;else throw Bs=gc,kf}else e.flags&=-16777217}function nv(e,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!D_(n))if(Pv())e.flags|=8192;else throw Bs=gc,kf}function zc(e,n){n!==null&&(e.flags|=4),e.flags&16384&&(n=e.tag!==22?Yl():536870912,e.lanes|=n,Ir|=n)}function al(e,n){if(!St)switch(e.tailMode){case"visible":break;case"collapsed":for(var a=e.tail,s=null;a!==null;)a.alternate!==null&&(s=a),a=a.sibling;s===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:s.sibling=null;break;default:for(n=e.tail,a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?e.tail=null:a.sibling=null}}function Jt(e){var n=e.alternate!==null&&e.alternate.child===e.child,a=0,s=0;if(n)for(var c=e.child;c!==null;)a|=c.lanes|c.childLanes,s|=c.subtreeFlags&1206910976,s|=c.flags&1206910976,c.return=e,c=c.sibling;else for(c=e.child;c!==null;)a|=c.lanes|c.childLanes,s|=c.subtreeFlags,s|=c.flags,c.return=e,c=c.sibling;return e.subtreeFlags|=s,e.childLanes=a,n}function TM(e,n,a){var s=n.pendingProps;switch(Pf(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Jt(n),null;case 1:return Jt(n),null;case 3:return a=n.stateNode,s=null,e!==null&&(s=e.memoizedState.cache),n.memoizedState.cache!==s&&(n.flags|=2048),ya(fn),A(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(br(n)?Ta(n):e===null||e.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,Bf())),Jt(n),null;case 26:var c=n.type,f=n.memoizedState;return e===null?(Ta(n),f!==null?(Jt(n),nv(n,f)):(Jt(n),Cd(n,c,null,s,a))):f?f!==e.memoizedState?(Ta(n),Jt(n),nv(n,f)):(Jt(n),n.flags&=-16777217):(e=e.memoizedProps,e!==s&&Ta(n),Jt(n),Cd(n,c,e,s,a)),null;case 27:if(ve(n),a=gt.current,c=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==s&&Ta(n);else{if(!s){if(n.stateNode===null)throw Error(o(166));return Jt(n),n.subtreeFlags&=-33554433,null}e=Ge.current,br(n)?Og(n):(e=M_(c,s,a),n.stateNode=e,Ta(n))}return Jt(n),n.subtreeFlags&=-33554433,null;case 5:if(ve(n),c=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==s&&Ta(n);else{if(!s){if(n.stateNode===null)throw Error(o(166));return Jt(n),n.subtreeFlags&=-33554433,null}if(f=Ge.current,br(n))Og(n);else{var _=ml(gt.current);switch(f){case 1:f=_.createElementNS("http://www.w3.org/2000/svg",c);break;case 2:f=_.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;default:switch(c){case"svg":f=_.createElementNS("http://www.w3.org/2000/svg",c);break;case"math":f=_.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;case"script":f=_.createElement("div"),f.innerHTML="<script><\/script>",f=f.removeChild(f.firstChild);break;case"select":f=typeof s.is=="string"?_.createElement("select",{is:s.is}):_.createElement("select"),s.multiple?f.multiple=!0:s.size&&(f.size=s.size);break;default:f=typeof s.is=="string"?_.createElement(c,{is:s.is}):_.createElement(c)}}f[Ue]=n,f[We]=s;e:for(_=n.child;_!==null;){if(_.tag===5||_.tag===6)f.appendChild(_.stateNode);else if(_.tag!==4&&_.tag!==27&&_.child!==null){_.child.return=_,_=_.child;continue}if(_===n)break e;for(;_.sibling===null;){if(_.return===null||_.return===n)break e;_=_.return}_.sibling.return=_.return,_=_.sibling}n.stateNode=f;e:switch(Nn(f,c,s),c){case"button":case"input":case"select":case"textarea":s=!!s.autoFocus;break e;case"img":s=!0;break e;default:s=!1}s&&Ta(n)}}return Jt(n),n.subtreeFlags&=-33554433,Cd(n,n.type,e===null?null:e.memoizedProps,n.pendingProps,a),null;case 6:if(e&&n.stateNode!=null)e.memoizedProps!==s&&Ta(n);else{if(typeof s!="string"&&n.stateNode===null)throw Error(o(166));if(e=gt.current,br(n)){if(e=n.stateNode,a=n.memoizedProps,s=null,c=Mn,c!==null)switch(c.tag){case 27:case 5:s=c.memoizedProps}e[Ue]=n,e=!!(e.nodeValue===a||s!==null&&s.suppressHydrationWarning===!0||t_(e.nodeValue,a)),e||ja(n,!0)}else e=ml(e).createTextNode(s),e[Ue]=n,n.stateNode=e}return Jt(n),null;case 31:if(a=n.memoizedState,e===null||e.memoizedState!==null){if(s=br(n),a!==null){if(e===null){if(!s)throw Error(o(318));if(e=n.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(557));e[Ue]=n}else Ds(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Jt(n),e=!1}else a=Bf(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return n.flags&256?(si(n),n):(si(n),null);if((n.flags&128)!==0)throw Error(o(558))}return Jt(n),null;case 13:if(s=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(c=br(n),s!==null&&s.dehydrated!==null){if(e===null){if(!c)throw Error(o(318));if(c=n.memoizedState,c=c!==null?c.dehydrated:null,!c)throw Error(o(317));c[Ue]=n}else Ds(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Jt(n),c=!1}else c=Bf(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=c),c=!0;if(!c)return n.flags&256?(si(n),n):(si(n),null)}return si(n),(n.flags&128)!==0?(n.lanes=a,n):(a=s!==null,e=e!==null&&e.memoizedState!==null,a&&(s=n.child,c=null,s.alternate!==null&&s.alternate.memoizedState!==null&&s.alternate.memoizedState.cachePool!==null&&(c=s.alternate.memoizedState.cachePool.pool),f=null,s.memoizedState!==null&&s.memoizedState.cachePool!==null&&(f=s.memoizedState.cachePool.pool),f!==c&&(s.flags|=2048)),a!==e&&a&&(n.child.flags|=8192),zc(n,n.updateQueue),Jt(n),null);case 4:return A(),e===null&&lh(n.stateNode.containerInfo),n.flags|=67108864,Jt(n),null;case 10:return ya(n.type),Jt(n),null;case 19:if(Jf(n),s=n.memoizedState,s===null)return Jt(n),null;if(c=(n.flags&128)!==0,f=s.rendering,f===null)if(c)al(s,!1);else{if(on!==0||e!==null&&(e.flags&128)!==0)for(e=n.child;e!==null;){if(f=yc(e),f!==null){for(n.flags|=128,al(s,!1),e=f.updateQueue,n.updateQueue=e,zc(n,e),n.subtreeFlags=0,e=a,a=n.child;a!==null;)wg(a,e),a=a.sibling;return $o(n,Rn.current&1|2),St&&_a(n,s.treeForkCount),n.child}e=e.sibling}s.tail!==null&&j()>Yc&&(n.flags|=128,c=!0,al(s,!1),n.lanes=4194304)}else{if(!c)if(e=yc(f),e!==null){if(n.flags|=128,c=!0,e=e.updateQueue,n.updateQueue=e,zc(n,e),al(s,!0),s.tail===null&&s.tailMode!=="collapsed"&&s.tailMode!=="visible"&&!f.alternate&&!St)return Jt(n),null}else 2*j()-s.renderingStartTime>Yc&&a!==536870912&&(n.flags|=128,c=!0,al(s,!1),n.lanes=4194304);s.isBackwards?(f.sibling=n.child,n.child=f):(e=s.last,e!==null?e.sibling=f:n.child=f,s.last=f)}if(s.tail!==null){e=s.tail;e:{for(a=e;a!==null;){if(a.alternate!==null){a=!1;break e}a=a.sibling}a=!0}return s.rendering=e,s.tail=e.sibling,s.renderingStartTime=j(),e.sibling=null,f=Rn.current,f=c?f&1|2:f&1,s.tailMode==="visible"||s.tailMode==="collapsed"||!a||St?$o(n,f):(a=f,at(Cn,n),at(Rn,a),Pn===null&&(Pn=n)),St&&_a(n,s.treeForkCount),e}return Jt(n),null;case 22:case 23:return si(n),Kf(),s=n.memoizedState!==null,e!==null?e.memoizedState!==null!==s&&(n.flags|=8192):s&&(n.flags|=8192),s?(a&536870912)!==0&&(n.flags&128)===0&&(Jt(n),n.subtreeFlags&6&&(n.flags|=8192)):Jt(n),a=n.updateQueue,a!==null&&zc(n,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),s=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(s=n.memoizedState.cachePool.pool),s!==a&&(n.flags|=2048),e!==null&&De(Ps),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),ya(fn),Jt(n),null;case 25:return null;case 30:return n.flags|=33554432,Jt(n),null}throw Error(o(156,n.tag))}function bM(e,n){switch(Pf(n),n.tag){case 1:return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return ya(fn),A(),e=n.flags,(e&65536)!==0&&(e&128)===0?(n.flags=e&-65537|128,n):null;case 26:case 27:case 5:return ve(n),null;case 31:if(n.memoizedState!==null){if(si(n),n.alternate===null)throw Error(o(340));Ds()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 13:if(si(n),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(o(340));Ds()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return Jf(n),e=n.flags,e&65536?(n.flags=e&-65537|128,e=n.memoizedState,e!==null&&(e.rendering=null,e.tail=null),n.flags|=4,n):null;case 4:return A(),null;case 10:return ya(n.type),null;case 22:case 23:return si(n),Kf(),e!==null&&De(Ps),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 24:return ya(fn),null;case 25:return null;default:return null}}function iv(e,n){switch(Pf(n),n.tag){case 3:ya(fn),A();break;case 26:case 27:case 5:ve(n);break;case 4:A();break;case 31:n.memoizedState!==null&&si(n);break;case 13:si(n);break;case 19:Jf(n);break;case 10:ya(n.type);break;case 22:case 23:si(n),Kf(),e!==null&&De(Ps);break;case 24:ya(fn)}}function sl(e,n){try{var a=n.updateQueue,s=a!==null?a.lastEffect:null;if(s!==null){var c=s.next;a=c;do{if((a.tag&e)===e){s=void 0;var f=a.create,_=a.inst;s=f(),_.destroy=s}a=a.next}while(a!==c)}}catch(b){jt(n,n.return,b)}}function Ja(e,n,a){try{var s=n.updateQueue,c=s!==null?s.lastEffect:null;if(c!==null){var f=c.next;s=f;do{if((s.tag&e)===e){var _=s.inst,b=_.destroy;if(b!==void 0){_.destroy=void 0,c=n;var L=a,K=b;try{K()}catch(oe){jt(c,L,oe)}}}s=s.next}while(s!==f)}}catch(oe){jt(n,n.return,oe)}}function av(e){var n=e.updateQueue;if(n!==null){var a=e.stateNode;try{Yg(n,a)}catch(s){jt(e,e.return,s)}}}function sv(e,n,a){a.props=Gs(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(s){jt(e,n,s)}}function Ji(e,n){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var s=e.stateNode;break;case 30:var c=e.stateNode,f=ma(e.memoizedProps,c);(c.ref===null||c.ref.name!==f)&&(c.ref=d_(f)),s=c.ref;break;case 7:if(e.stateNode===null){var _=new ui(e);g(e.child,!1,m1,_,void 0,void 0),e.stateNode=_}s=e.stateNode;break;default:s=e.stateNode}typeof a=="function"?e.refCleanup=a(s):a.current=s}}catch(b){jt(e,n,b)}}function wn(e,n){var a=e.ref,s=e.refCleanup;if(a!==null)if(typeof s=="function")try{s()}catch(c){jt(e,n,c)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(c){jt(e,n,c)}else a.current=null}function Pc(e,n){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&n!==null)for(var a=0;a<n.length;a++)__(e.stateNode,n[a])}function rv(e){for(var n=e.return;n!==null&&(wd(n)&&__(e.stateNode,n.stateNode),!Rd(n));)n=n.return}function rl(e){for(var n=e.return;n!==null&&(wd(n)&&g1(e.stateNode,n.stateNode),!Rd(n));)n=n.return}function Rd(e){return e.tag===5||e.tag===3||e.tag===27}function wd(e){return e&&e.tag===7&&e.stateNode!==null}function Nd(e){var n=e.type,a=e.memoizedProps,s=e.stateNode;try{e:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&s.focus();break e;case"img":a.src?s.src=a.src:a.srcSet&&(s.srcset=a.srcSet)}}catch(c){jt(e,e.return,c)}}function Dd(e,n,a){try{var s=e.stateNode;QM(s,e.type,a,n),s[We]=n}catch(c){jt(e,e.return,c)}}function ov(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&ss(e.type)||e.tag===4}function Ud(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||ov(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&ss(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ld(e,n,a,s){var c=e.tag;if(c===5||c===6)c=e.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(c,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(c),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=Zi)),Pc(e,s),zt=!0;else if(c!==4&&(c===27&&(Pc(e,s),s=null,ss(e.type)&&(a=e.stateNode,n=null)),e=e.child,e!==null))for(Ld(e,n,a,s),e=e.sibling;e!==null;)Ld(e,n,a,s),e=e.sibling}function Ic(e,n,a,s){var c=e.tag;if(c===5||c===6)c=e.stateNode,n?a.insertBefore(c,n):a.appendChild(c),Pc(e,s),zt=!0;else if(c!==4&&(c===27&&(Pc(e,s),s=null,ss(e.type)&&(a=e.stateNode)),e=e.child,e!==null))for(Ic(e,n,a,s),e=e.sibling;e!==null;)Ic(e,n,a,s),e=e.sibling}function lv(e){var n=e.stateNode,a=e.memoizedProps;try{for(var s=e.type,c=n.attributes;c.length;)n.removeAttributeNode(c[0]);Nn(n,s,a),n[Ue]=e,n[We]=a}catch(f){jt(e,e.return,f)}}var Bc=!1,ri=null;function cv(e){(e.tag===30||(e.subtreeFlags&33554432)!==0)&&(Bc=!0)}var $i=null;function uv(){var e=$i;return $i=null,e}var Zn=0;function Lr(e,n,a,s,c){return Zn=0,fv(e.child,n,a,s,c)}function fv(e,n,a,s,c){for(var f=!1;e!==null;){if(e.tag===5){var _=e.stateNode;if(s!==null){var b=gh(_);s.push(b),b.view&&(f=!0)}else f||gh(_).view&&(f=!0);Bc=!0,u_(_,Zn===0?n:n+"_"+Zn,a),Zn++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&c||fv(e.child,n,a,s,c)&&(f=!0));e=e.sibling}return f}function ea(e,n){for(;e!==null;)e.tag===5?f_(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&n||ea(e.child,n)),e=e.sibling}function Fc(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Fc(e),e.tag===30&&(e.flags&18874368)!==0&&e.stateNode.paired)){var n=e.memoizedProps;if(n.name==null||n.name==="auto")throw Error(o(544));var a=n.name;n=ga(n.default,n.share),n!=="none"&&(Lr(e,a,n,null,!1)||ea(e.child,!1))}e=e.sibling}}function Od(e,n){if(e.tag===30){var a=e.stateNode,s=e.memoizedProps,c=ma(s,a),f=ga(s.default,a.paired?s.share:s.enter);f!=="none"?Lr(e,c,f,null,!1)?(Fc(e),a.paired||n||Gr(e,s.onEnter)):ea(e.child,!1):Fc(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Od(e,n),e=e.sibling;else Fc(e)}function zd(e){if(ri!==null&&ri.size!==0){var n=ri;if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var a=e.memoizedProps,s=a.name;if(s!=null&&s!=="auto"){var c=n.get(s);if(c!==void 0){var f=ga(a.default,a.share);if(f!=="none"&&(Lr(e,s,f,null,!1)?(f=e.stateNode,c.paired=f,f.paired=c,Gr(e,a.onShare)):ea(e.child,!1)),n.delete(s),n.size===0)break}}}zd(e)}e=e.sibling}}}function Pd(e){if(e.tag===30){var n=e.memoizedProps,a=ma(n,e.stateNode),s=ri!==null?ri.get(a):void 0,c=ga(n.default,s!==void 0?n.share:n.exit);c!=="none"&&(Lr(e,a,c,null,!1)?s!==void 0?(c=e.stateNode,s.paired=c,c.paired=s,ri.delete(a),Gr(e,n.onShare)):Gr(e,n.onExit):ea(e.child,!1)),ri!==null&&zd(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Pd(e),e=e.sibling;else ri!==null&&zd(e)}function dv(e){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,a=ma(n,e.stateNode);n=ga(n.default,n.update),e.flags&=-5,n!=="none"&&Lr(e,a,n,e.memoizedState=[],!1)}else(e.subtreeFlags&33554432)!==0&&dv(e);e=e.sibling}}function Id(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var n=e.stateNode;n.paired!==null&&(n.paired=null,ea(e.child,!1))}Id(e)}e=e.sibling}}function Hc(e){if(e.tag===30)e.stateNode.paired=null,ea(e.child,!1),Id(e);else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Hc(e),e=e.sibling;else Id(e)}function hv(e){for(e=e.child;e!==null;)e.tag===30?ea(e.child,!1):(e.subtreeFlags&33554432)!==0&&hv(e),e=e.sibling}function Bd(e,n,a,s,c,f,_){for(var b=!1;n!==null;){if(n.tag===5){var L=n.stateNode;if(f!==null&&Zn<f.length){var K=f[Zn],oe=gh(L);(K.view||oe.view)&&(b=!0);var _e;if(_e=(e.flags&4)===0)if(oe.clip)_e=!0;else{_e=K.rect;var Y=oe.rect;_e=_e.y!==Y.y||_e.x!==Y.x||_e.height!==Y.height||_e.width!==Y.width}_e&&(e.flags|=4),oe.abs?oe=!K.abs:(K=K.rect,oe=oe.rect,oe=K.height!==oe.height||K.width!==oe.width),oe&&(e.flags|=32)}else e.flags|=32;(e.flags&4)!==0&&u_(L,Zn===0?a:a+"_"+Zn,c),b&&(e.flags&4)!==0||($i===null&&($i=[]),$i.push(L,Zn===0?s:s+"_"+Zn,n.memoizedProps)),Zn++}else(n.tag!==22||n.memoizedState===null)&&(n.tag===30&&_?e.flags|=n.flags&32:Bd(e,n.child,a,s,c,f,_)&&(b=!0));n=n.sibling}return b}function pv(e,n){for(e=e.child;e!==null;){if(e.tag===30){var a=e.memoizedProps,s=e.stateNode,c=ma(a,s),f=ga(a.default,a.update),_;_=e.memoizedState,e.memoizedState=null,s=e;var b=e.child;Zn=0,c=Bd(s,b,c,c,f,_,!1),(e.flags&4)!==0&&c&&Gr(e,a.onUpdate)}else(e.subtreeFlags&33554432)!==0&&pv(e);e=e.sibling}}var En=!1,Gt=!1,ta=!1,Fd=!1,mv=typeof WeakSet=="function"?WeakSet:Set,Tn=null,na=!1,ol=!1,Gc=!1,Hd=!1;function AM(e,n,a){if(e=e.containerInfo,fh=Qr,e=xg(e),Af(e)){if("selectionStart"in e)var s={start:e.selectionStart,end:e.selectionEnd};else e:{s=(s=e.ownerDocument)&&s.defaultView||window;var c=s.getSelection&&s.getSelection();if(c&&c.rangeCount!==0){s=c.anchorNode;var f=c.anchorOffset,_=c.focusNode;c=c.focusOffset;try{s.nodeType,_.nodeType}catch{s=null;break e}var b=0,L=-1,K=-1,oe=0,_e=0,Y=e,ae=null;t:for(;;){for(var Oe;Y!==s||f!==0&&Y.nodeType!==3||(L=b+f),Y!==_||c!==0&&Y.nodeType!==3||(K=b+c),Y.nodeType===3&&(b+=Y.nodeValue.length),(Oe=Y.firstChild)!==null;)ae=Y,Y=Oe;for(;;){if(Y===e)break t;if(ae===s&&++oe===f&&(L=b),ae===_&&++_e===c&&(K=b),(Oe=Y.nextSibling)!==null)break;Y=ae,ae=Y.parentNode}Y=Oe}s=L===-1||K===-1?null:{start:L,end:K}}else s=null}s=s||{start:0,end:0}}else s=null;for(dh={focusedElem:e,selectionRange:s},Qr=!1,a=(a&335544064)===a,Tn=n,n=a?9270:1024;Tn!==null;){if(e=Tn,a&&(s=e.deletions,s!==null))for(f=0;f<s.length;f++)a&&Pd(s[f]);if(e.alternate===null&&(e.flags&2)!==0)a&&cv(e),Vc(a);else{if(e.tag===22){if(s=e.alternate,e.memoizedState!==null){s!==null&&s.memoizedState===null&&a&&Pd(s),Vc(a);continue}else if(s!==null&&s.memoizedState!==null){a&&cv(e),Vc(a);continue}}s=e.child,(e.subtreeFlags&n)!==0&&s!==null?(s.return=e,Tn=s):(a&&dv(e),Vc(a))}}ri=null}function Vc(e){for(;Tn!==null;){var n=Tn,a=e,s=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 15:break;case 1:if((c&1024)!==0&&s!==null){a=void 0,c=s.memoizedProps,s=s.memoizedState;var f=n.stateNode;try{var _=Gs(n.type,c);a=f.getSnapshotBeforeUpdate(_,s),f.__reactInternalSnapshotBeforeUpdate=a}catch(b){jt(n,n.return,b)}}break;case 3:if((c&1024)!==0){if(s=n.stateNode.containerInfo,a=s.nodeType,a===9)xh(s);else if(a===1)switch(s.nodeName){case"HEAD":case"HTML":case"BODY":xh(s);break;default:s.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:a&&s!==null&&(a=ma(s.memoizedProps,s.stateNode),c=n.memoizedProps,c=ga(c.default,c.update),c!=="none"&&Lr(s,a,c,s.memoizedState=[],!0));break;default:if((c&1024)!==0)throw Error(o(163))}if(s=n.sibling,s!==null){s.return=n.return,Tn=s;break}Tn=n.return}}function gv(e,n,a){var s=a.flags;switch(a.tag){case 0:case 11:case 15:ia(e,a),s&4&&sl(5,a);break;case 1:if(ia(e,a),s&4)if(e=a.stateNode,n===null)try{e.componentDidMount()}catch(_){jt(a,a.return,_)}else{var c=Gs(a.type,n.memoizedProps);n=n.memoizedState;try{e.componentDidUpdate(c,n,e.__reactInternalSnapshotBeforeUpdate)}catch(_){jt(a,a.return,_)}}s&64&&av(a),s&512&&Ji(a,a.return);break;case 3:if(ia(e,a),s&64&&(e=a.updateQueue,e!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{Yg(e,n)}catch(_){jt(a,a.return,_)}}break;case 27:n===null&&s&4&&lv(a);case 26:case 5:ia(e,a),n===null&&s&4&&Nd(a),s&512&&Ji(a,a.return);break;case 12:ia(e,a);break;case 31:ia(e,a),s&4&&yv(e,a);break;case 13:ia(e,a),s&4&&Sv(e,a),s&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=BM.bind(null,a),x1(e,a))));break;case 22:if(s=a.memoizedState!==null||En,!s){var f=n!==null&&n.memoizedState!==null||Gt;n=En,c=Gt,En=s,(Gt=f)&&!c?(s=2,(a.subtreeFlags&8772)!==0&&(s|=1),zi(e,a,s)):ia(e,a),En=n,Gt=c}break;case 30:ia(e,a),s&512&&Ji(a,a.return);break;case 7:s&512&&Ji(a,a.return);default:ia(e,a)}}function Gd(e,n){for(e=e.child;e!==null;)vv(e,n),e=e.sibling}function vv(e,n){switch(e.tag){case 5:case 26:try{var a=e.stateNode;if(n){var s=a.style;typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"}else{var c=e.stateNode,f=e.memoizedProps.style,_=f!=null&&f.hasOwnProperty("display")?f.display:null;c.style.display=_==null||typeof _=="boolean"?"":(""+_).trim()}}catch(L){jt(e,e.return,L)}Vd(e,n);break;case 6:try{e.stateNode.nodeValue=n?"":e.memoizedProps,zt=!0}catch(L){jt(e,e.return,L)}break;case 18:try{var b=e.stateNode;n?c_(b,!0):c_(e.stateNode,!1)}catch(L){jt(e,e.return,L)}break;case 22:case 23:e.memoizedState===null&&Gd(e,n);break;default:Gd(e,n)}}function Vd(e,n){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){e:{var a=e,s=n;switch(a.tag){case 4:vv(a,s);break e;case 22:a.memoizedState===null&&Vd(a,s);break e;default:Vd(a,s)}}e=e.sibling}}function _v(e){var n=e.alternate;n!==null&&(e.alternate=null,_v(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&it(n)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var en=null,Kn=!1;function Li(e,n,a){for(a=a.child;a!==null;)xv(e,n,a),a=a.sibling}function xv(e,n,a){if(tn&&typeof tn.onCommitFiberUnmount=="function")try{tn.onCommitFiberUnmount(bt,a)}catch{}switch(a.tag){case 26:Gt||wn(a,n),Li(e,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&!Gt&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:Gt||wn(a,n),rl(a);var s=en,c=Kn;ss(a.type)&&(en=a.stateNode,Kn=!1),Li(e,n,a),E_(a.stateNode,a.type,a.memoizedProps),en=s,Kn=c;break;case 5:Gt||wn(a,n),rl(a);case 6:if(a.tag===6&&rl(a),s=en,c=Kn,en=null,Li(e,n,a),en=s,Kn=c,en!==null)if(Kn)try{(en.nodeType===9?en.body:en.nodeName==="HTML"?en.ownerDocument.body:en).removeChild(a.stateNode),zt=!0}catch(f){jt(a,n,f)}else try{en.removeChild(a.stateNode),zt=!0}catch(f){jt(a,n,f)}break;case 18:en!==null&&(Kn?(e=en,l_(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),Jr(e)):l_(en,a.stateNode));break;case 4:s=en,c=Kn,en=a.stateNode.containerInfo,Kn=!0,Li(e,n,a),en=s,Kn=c;break;case 0:case 11:case 14:case 15:Ja(2,a,n),Gt||Ja(4,a,n),Li(e,n,a);break;case 1:Gt||(wn(a,n),s=a.stateNode,typeof s.componentWillUnmount=="function"&&sv(a,n,s)),Li(e,n,a);break;case 21:Li(e,n,a);break;case 22:Gt=(s=Gt)||a.memoizedState!==null,Li(e,n,a),Gt=s;break;case 30:wn(a,n),Li(e,n,a);break;case 7:Gt||wn(a,n),Li(e,n,a);break;default:Li(e,n,a)}}function yv(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Jr(e)}catch(a){jt(n,n.return,a)}}}function Sv(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Jr(e)}catch(a){jt(n,n.return,a)}}function CM(e){switch(e.tag){case 31:case 13:case 19:var n=e.stateNode;return n===null&&(n=e.stateNode=new mv),n;case 22:return e=e.stateNode,n=e._retryCache,n===null&&(n=e._retryCache=new mv),n;default:throw Error(o(435,e.tag))}}function jc(e,n){var a=CM(e);n.forEach(function(s){if(!a.has(s)){a.add(s);var c=FM.bind(null,e,s);s.then(c,c)}})}function jn(e,n,a){var s=n.deletions;if(s!==null)for(var c=0;c<s.length;c++){var f=s[c],_=e,b=n,L=b;e:for(;L!==null;){switch(L.tag){case 27:if(ss(L.type)){en=L.stateNode,Kn=!1;break e}break;case 5:en=L.stateNode,Kn=!1;break e;case 3:case 4:en=L.stateNode.containerInfo,Kn=!0;break e}L=L.return}if(en===null)throw Error(o(160));xv(_,b,f),en=null,Kn=!1,_=f.alternate,_!==null&&(_.return=null),f.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)Mv(n,e,a),n=n.sibling}var Oi=null;function Mv(e,n,a){var s=e.alternate,c=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(c&4&&(s=e.updateQueue,s=s!==null?s.events:null,s!==null))for(var f=0;f<s.length;f++){var _=s[f];_.ref.impl=_.nextImpl}jn(n,e,a),kn(e),c&4&&(Ja(3,e,e.return),sl(3,e),Ja(5,e,e.return));break;case 1:jn(n,e,a),kn(e),c&512&&(Gt||s===null||wn(s,s.return)),c&64&&En&&(e=e.updateQueue,e!==null&&(n=e.callbacks,n!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?n:a.concat(n))));break;case 26:if(f=Oi,jn(n,e,a),kn(e),c&512&&(Gt||s===null||wn(s,s.return)),c&4)if(c=s!==null?s.memoizedState:null,a=e.memoizedState,s===null)if(a===null)if(e.stateNode===null)if(En)e.stateNode=s_(e.type,e.memoizedProps,n.containerInfo,e);else{e:{n=e.type,a=e.memoizedProps,c=f.ownerDocument||f;t:switch(n){case"title":s=c.getElementsByTagName("title")[0],(!s||s[Pt]||s[Ue]||s.namespaceURI==="http://www.w3.org/2000/svg"||s.hasAttribute("itemprop"))&&(s=c.createElement(n),c.head.insertBefore(s,c.querySelector("head > title"))),Nn(s,n,a),s[Ue]=e,Ot(s),n=s;break e;case"link":if(f=w_("link","href",c).get(n+(a.href||""))){for(_=0;_<f.length;_++)if(s=f[_],s.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&s.getAttribute("rel")===(a.rel==null?null:a.rel)&&s.getAttribute("title")===(a.title==null?null:a.title)&&s.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){f.splice(_,1);break t}}s=c.createElement(n),Nn(s,n,a),c.head.appendChild(s);break;case"meta":if(f=w_("meta","content",c).get(n+(a.content||""))){for(_=0;_<f.length;_++)if(s=f[_],s.getAttribute("content")===(a.content==null?null:""+a.content)&&s.getAttribute("name")===(a.name==null?null:a.name)&&s.getAttribute("property")===(a.property==null?null:a.property)&&s.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&s.getAttribute("charset")===(a.charSet==null?null:a.charSet)){f.splice(_,1);break t}}s=c.createElement(n),Nn(s,n,a),c.head.appendChild(s);break;default:throw Error(o(468,n))}s[Ue]=e,Ot(s),n=s}e.stateNode=n}else En||Ah(f,e.type,e.stateNode);else e.stateNode=R_(f,a,e.memoizedProps);else c!==a?(c===null?(n=s.stateNode,n===null||Gt||n.parentNode.removeChild(n)):c.count--,a===null?En||Ah(f,e.type,e.stateNode):R_(f,a,e.memoizedProps)):a===null&&e.stateNode!==null&&Dd(e,e.memoizedProps,s.memoizedProps);break;case 27:jn(n,e,a),kn(e),c&512&&(Gt||s===null||wn(s,s.return)),s!==null&&c&4&&Dd(e,e.memoizedProps,s.memoizedProps);break;case 5:if(f=ta,ta=!1,jn(n,e,a),ta=f,kn(e),c&512&&(Gt||s===null||wn(s,s.return)),e.flags&32){n=e.stateNode;try{mr(n,""),zt=!0}catch(oe){jt(e,e.return,oe)}}c&4&&e.stateNode!=null&&(n=e.memoizedProps,Dd(e,n,s!==null?s.memoizedProps:n)),c&1024&&(Fd=!0);break;case 6:if(jn(n,e,a),kn(e),c&4){if(e.stateNode===null)throw Error(o(162));n=e.memoizedProps,a=e.stateNode;try{a.nodeValue=n,zt=!0}catch(oe){jt(e,e.return,oe)}}break;case 3:if(zt=!1,au=null,f=Oi,Oi=gl(n.containerInfo),jn(n,e,a),Oi=f,kn(e),c&4&&s!==null&&s.memoizedState.isDehydrated)try{Jr(n.containerInfo)}catch(oe){jt(e,e.return,oe)}Fd&&(Fd=!1,Ev(e)),zt=!1;break;case 4:c=ta,ta=En,s=jm(),f=Oi,Oi=gl(e.stateNode.containerInfo),jn(n,e,a),kn(e),Oi=f,zt&&ol&&(Gc=!0),zt=s,ta=c;break;case 12:jn(n,e,a),kn(e);break;case 31:jn(n,e,a),kn(e),c&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,jc(e,n)));break;case 13:jn(n,e,a),kn(e),e.child.flags&8192&&e.memoizedState!==null!=(s!==null&&s.memoizedState!==null)&&(qc=j()),c&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,jc(e,n)));break;case 22:f=e.memoizedState!==null,_=s!==null&&s.memoizedState!==null;var b=En,L=Gt,K=ta;En=b||f,ta=K||f,Gt=L||_,jn(n,e,a),Gt=L,ta=K,En=b,kn(e),c&8192&&(n=e.stateNode,n._visibility=f?n._visibility&-2:n._visibility|1,!f||s===null||_||En||Gt||(n=_||Gt,a=En,s=Gt,En=f||En,Gt=n,$a(e,2),En=a,Gt=s),!f&&ta||Gd(e,f)),c&4&&(n=e.updateQueue,n!==null&&(a=n.retryQueue,a!==null&&(n.retryQueue=null,jc(e,a))));break;case 19:jn(n,e,a),kn(e),c&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,jc(e,n)));break;case 30:c&512&&(Gt||s===null||wn(s,s.return)),c=jm(),f=ol,_=(a&335544064)===a,b=e.memoizedProps,ol=_&&ga(b.default,b.update)!=="none",jn(n,e,a),kn(e),_&&s!==null&&zt&&(e.flags|=4),ol=f,zt=c;break;case 21:break;case 7:c&512&&(Gt||s===null||wn(s,s.return)),s&&s.stateNode!==null&&(s.stateNode._fragmentFiber=e);default:jn(n,e,a),kn(e)}}function kn(e){var n=e.flags;if(n&2){try{for(var a,s=e.return;s!==null;){if(ov(s)){a=s;break}s=s.return}s=null;for(var c=e.return;c!==null;){if(wd(c)){var f=c.stateNode;s===null?s=[f]:s.push(f)}if(Rd(c))break;c=c.return}var _=s;if(a==null)throw Error(o(160));switch(a.tag){case 27:var b=a.stateNode,L=Ud(e);Ic(e,L,b,_);break;case 5:var K=a.stateNode;a.flags&32&&(mr(K,""),a.flags&=-33);var oe=Ud(e);Ic(e,oe,K,_);break;case 3:case 4:var _e=a.stateNode.containerInfo,Y=Ud(e);Ld(e,Y,_e,_);break;default:throw Error(o(161))}}catch(ae){jt(e,e.return,ae)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function Ev(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var n=e;Ev(n),n.tag===5&&n.flags&1024&&(n=n.stateNode,Qr=!0,n.reset(),Qr=!1),e=e.sibling}}function Or(e,n){if(n.subtreeFlags&9270)for(n=n.child;n!==null;)Tv(n,e),n=n.sibling;else pv(n)}function Tv(e,n){var a=e.alternate;if(a===null)Od(e,!1);else switch(e.tag){case 3:if(Hd=na=!1,uv(),Or(n,e),!na&&!Gc){if(e=$i,e!==null)for(var s=0;s<e.length;s+=3){a=e[s];var c=e[s+1];f_(a,e[s+2]),a=a.ownerDocument.documentElement,a!==null&&a.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+c+")"})}e=n.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===""&&(e.style.viewTransitionName="none",e.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),Hd=!0}$i=null;break;case 5:Or(n,e);break;case 4:s=na,na=!1,Or(n,e),na&&(Gc=!0),na=s;break;case 22:e.memoizedState===null&&(a.memoizedState!==null?Od(e,!1):Or(n,e));break;case 30:s=na,c=uv(),na=!1,Or(n,e),na&&(e.flags|=4);var f=e.memoizedProps,_=e.stateNode;n=ma(f,_),_=ma(a.memoizedProps,_);var b=ga(f.default,f.update);b==="none"?n=!1:(f=a.memoizedState,a.memoizedState=null,a=e.child,Zn=0,n=Bd(e,a,n,_,b,f,!0),Zn!==(f===null?0:f.length)&&(e.flags|=32)),(e.flags&4)!==0&&n?(Gr(e,e.memoizedProps.onUpdate),$i=c):c!==null&&(c.push.apply(c,$i),$i=c),na=(e.flags&32)!==0?!0:s;break;default:Or(n,e)}}function ia(e,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)gv(e,n.alternate,n),n=n.sibling}function $a(e,n){for(e=e.child;e!==null;){var a=e,s=n;switch(a.tag){case 0:case 11:case 14:case 15:Ja(4,a,a.return),$a(a,s);break;case 1:wn(a,a.return);var c=a.stateNode;typeof c.componentWillUnmount=="function"&&sv(a,a.return,c),$a(a,s);break;case 27:(s&2)!==0&&E_(a.stateNode,a.type,a.memoizedProps);case 5:wn(a,a.return),a.tag!==5&&a.tag!==27||rl(a),$a(a,s);break;case 6:rl(a);break;case 26:wn(a,a.return),c=a.stateNode,a.memoizedState!==null||c===null||Gt||c.parentNode.removeChild(c),$a(a,s);break;case 22:a.memoizedState===null&&$a(a,s);break;case 30:wn(a,a.return),$a(a,s);break;case 7:wn(a,a.return);default:$a(a,s)}e=e.sibling}}function zi(e,n,a){for(a=(n.subtreeFlags&8772)!==0?a:a&-2,n=n.child;n!==null;){var s=n.alternate,c=e,f=n,_=f.flags,b=(a&1)!==0;switch(f.tag){case 0:case 11:case 15:zi(c,f,a),sl(4,f);break;case 1:if(zi(c,f,a),s=f,c=s.stateNode,typeof c.componentDidMount=="function")try{c.componentDidMount()}catch(oe){jt(s,s.return,oe)}if(s=f,c=s.updateQueue,c!==null){var L=s.stateNode;try{var K=c.shared.hiddenCallbacks;if(K!==null)for(c.shared.hiddenCallbacks=null,c=0;c<K.length;c++)qg(K[c],L)}catch(oe){jt(s,s.return,oe)}}b&&_&64&&av(f),Ji(f,f.return);break;case 27:(a&2)!==0&&lv(f);case 5:f.tag!==5&&f.tag!==27||rv(f),zi(c,f,a),b&&s===null&&_&4&&Nd(f),Ji(f,f.return);break;case 6:rv(f);break;case 26:L=f.stateNode,f.memoizedState!==null||L===null||En||Ah(gl(L.ownerDocument),f.type,L),zi(c,f,a),b&&s===null&&_&4&&Nd(f),Ji(f,f.return);break;case 12:zi(c,f,a);break;case 31:zi(c,f,a),b&&_&4&&yv(c,f);break;case 13:zi(c,f,a),b&&_&4&&Sv(c,f);break;case 22:f.memoizedState===null&&zi(c,f,a),Ji(f,f.return);break;case 30:zi(c,f,a),Ji(f,f.return);break;case 7:Ji(f,f.return);default:zi(c,f,a)}n=n.sibling}}function jd(e,n){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(e=n.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&qo(a))}function kd(e,n){e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&qo(e))}function Ei(e,n,a,s){var c=(a&335544064)===a;if(n.subtreeFlags&(c?10262:10256))for(n=n.child;n!==null;)bv(e,n,a,s),n=n.sibling;else c&&hv(n)}function bv(e,n,a,s){var c=(a&335544064)===a;c&&n.alternate===null&&n.return!==null&&n.return.alternate!==null&&Hc(n);var f=n.flags;switch(n.tag){case 0:case 11:case 15:Ei(e,n,a,s),f&2048&&sl(9,n);break;case 1:Ei(e,n,a,s);break;case 3:Ei(e,n,a,s),c&&Hd&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,e.style.viewTransitionName==="root"&&(e.style.viewTransitionName=""),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName==="none"&&(e.style.viewTransitionName="")),f&2048&&(f=null,n.alternate!==null&&(f=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==f&&(n.refCount++,f!=null&&qo(f)));break;case 12:if(f&2048){Ei(e,n,a,s),f=n.stateNode;try{var _=n.memoizedProps,b=_.id,L=_.onPostCommit;typeof L=="function"&&L(b,n.alternate===null?"mount":"update",f.passiveEffectDuration,-0)}catch(K){jt(n,n.return,K)}}else Ei(e,n,a,s);break;case 31:Ei(e,n,a,s);break;case 13:Ei(e,n,a,s);break;case 23:break;case 22:_=n.stateNode,b=n.alternate,n.memoizedState!==null?(c&&b!==null&&b.memoizedState===null&&Hc(b),_._visibility&2?Ei(e,n,a,s):ll(e,n)):(c&&b!==null&&b.memoizedState!==null&&Hc(n),_._visibility&2?Ei(e,n,a,s):(_._visibility|=2,zr(e,n,a,s,(n.subtreeFlags&10256)!==0||!1))),f&2048&&jd(b,n);break;case 24:Ei(e,n,a,s),f&2048&&kd(n.alternate,n);break;case 30:c&&(f=n.alternate,f!==null&&(ea(f.child,!0),ea(n.child,!0))),Ei(e,n,a,s);break;default:Ei(e,n,a,s)}}function zr(e,n,a,s,c){for(c=c&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var f=e,_=n,b=a,L=s,K=_.flags;switch(_.tag){case 0:case 11:case 15:zr(f,_,b,L,c),sl(8,_);break;case 23:break;case 22:var oe=_.stateNode;_.memoizedState!==null?oe._visibility&2?zr(f,_,b,L,c):ll(f,_):(oe._visibility|=2,zr(f,_,b,L,c)),c&&K&2048&&jd(_.alternate,_);break;case 24:zr(f,_,b,L,c),c&&K&2048&&kd(_.alternate,_);break;default:zr(f,_,b,L,c)}n=n.sibling}}function ll(e,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=e,s=n,c=s.flags;switch(s.tag){case 22:ll(a,s),c&2048&&jd(s.alternate,s);break;case 24:ll(a,s),c&2048&&kd(s.alternate,s);break;default:ll(a,s)}n=n.sibling}}var Vs=8192;function js(e,n,a){if(e.subtreeFlags&Vs)for(e=e.child;e!==null;)Av(e,n,a),e=e.sibling}function Av(e,n,a){switch(e.tag){case 26:js(e,n,a),e.flags&Vs&&(e.memoizedState!==null?L1(a,Oi,e.memoizedState,e.memoizedProps):(e=e.stateNode,(n&335544128)===n&&L_(a,e)));break;case 5:js(e,n,a),e.flags&Vs&&(e=e.stateNode,(n&335544128)===n&&L_(a,e));break;case 3:case 4:var s=Oi;Oi=gl(e.stateNode.containerInfo),js(e,n,a),Oi=s;break;case 22:e.memoizedState===null&&(s=e.alternate,s!==null&&s.memoizedState!==null?(s=Vs,Vs=16777216,js(e,n,a),Vs=s):js(e,n,a));break;case 30:if((e.flags&Vs)!==0&&(s=e.memoizedProps.name,s!=null&&s!=="auto")){var c=e.stateNode;c.paired=null,ri===null&&(ri=new Map),ri.set(s,c)}js(e,n,a);break;default:js(e,n,a)}}function Cv(e){var n=e.alternate;if(n!==null&&(e=n.child,e!==null)){n.child=null;do n=e.sibling,e.sibling=null,e=n;while(e!==null)}}function cl(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];Tn=s,wv(s,e)}Cv(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Rv(e),e=e.sibling}function Rv(e){switch(e.tag){case 0:case 11:case 15:cl(e),e.flags&2048&&Ja(9,e,e.return);break;case 3:cl(e);break;case 12:cl(e);break;case 22:var n=e.stateNode;e.memoizedState!==null&&n._visibility&2&&(e.return===null||e.return.tag!==13)?(n._visibility&=-3,kc(e)):cl(e);break;default:cl(e)}}function kc(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];Tn=s,wv(s,e)}Cv(e)}for(e=e.child;e!==null;){switch(n=e,n.tag){case 0:case 11:case 15:Ja(8,n,n.return),kc(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,kc(n));break;default:kc(n)}e=e.sibling}}function wv(e,n){for(;Tn!==null;){var a=Tn;switch(a.tag){case 0:case 11:case 15:Ja(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var s=a.memoizedState.cachePool.pool;s!=null&&s.refCount++}break;case 24:qo(a.memoizedState.cache)}if(s=a.child,s!==null)s.return=a,Tn=s;else e:for(a=e;Tn!==null;){s=Tn;var c=s.sibling,f=s.return;if(_v(s),s===a){Tn=null;break e}if(c!==null){c.return=f,Tn=c;break e}Tn=f}}}var RM={getCacheForType:function(e){var n=An(fn),a=n.data.get(e);return a===void 0&&(a=e(),n.data.set(e,a)),a},cacheSignal:function(){return An(fn).controller.signal}},wM=typeof WeakMap=="function"?WeakMap:Map,Bt=0,Zt=null,Et=null,At=0,Vt=0,oi=null,es=!1,Pr=!1,Xd=!1,ba=0,on=0,ts=0,ks=0,Xc=0,li=0,Ir=0,ul=null,Qn=null,qd=!1,qc=0,Nv=0,Yc=1/0,Wc=null,ns=null,nn=0,Pi=null,Xs=null,aa=0,Yd=0,Wd=null,Dv=null,Br=null,Fr=null,Hr=null,fl=0,Zc=null;function ci(){return(Bt&2)!==0&&At!==0?At&-At:de.T!==null?ah():be()}function Uv(){if(li===0)if((At&536870912)===0||St){var e=da;da<<=1,(da&3932160)===0&&(da=262144),li=e}else li=536870912;return e=Cn.current,e!==null&&(e.flags|=32),li}function Gr(e,n){if(n!=null){var a=e.stateNode,s=a.ref;s===null&&(s=a.ref=d_(ma(e.memoizedProps,a))),Fr===null&&(Fr=[]),Fr.push(n.bind(null,s))}}function Jn(e,n,a){(e===Zt&&(Vt===2||Vt===9)||e.cancelPendingCommit!==null)&&(Vr(e,0),is(e,At,li,!1)),As(e,a),((Bt&2)===0||e!==Zt)&&(e===Zt&&((Bt&2)===0&&(ks|=a),on===4&&is(e,At,li,!1)),sa(e))}function Lv(e,n,a){if((Bt&6)!==0)throw Error(o(327));var s=!a&&(n&127)===0&&(n&e.expiredLanes)===0||Ia(e,n),c=s?UM(e,n):Kd(e,n,!0),f=s;do{if(c===0){Pr&&!s&&is(e,n,0,!1);break}else{if(a=e.current.alternate,f&&!NM(a)){c=Kd(e,n,!1),f=!1;continue}if(c===2){if(f=n,e.errorRecoveryDisabledLanes&f)var _=0;else _=e.pendingLanes&-536870913,_=_!==0?_:_&536870912?536870912:0;if(_!==0){n=_;e:{var b=e;c=ul;var L=b.current.memoizedState.isDehydrated;if(L&&(Vr(b,_).flags|=256),_=Kd(b,_,!1),_!==2&&_!==6){if(Xd&&!L){b.errorRecoveryDisabledLanes|=f,ks|=f,c=4;break e}f=Qn,Qn=c,f!==null&&(Qn===null?Qn=f:Qn.push.apply(Qn,f))}c=_}if(f=!1,c!==2)continue}}if(c===1){Vr(e,0),is(e,n,0,!0);break}e:{switch(s=e,f=c,f){case 0:case 1:throw Error(o(345));case 4:if((n&4194048)!==n&&(n&62914560)!==n)break;case 6:is(s,n,li,!es);break e;case 2:Qn=null;break;case 3:case 5:break;default:throw Error(o(329))}if((n&62914560)===n&&(c=qc+300-j(),10<c)){if(is(s,n,li,!es),bs(s,0,!0)!==0)break e;aa=n,s.timeoutHandle=mh(Ov.bind(null,s,a,Qn,Wc,qd,n,li,ks,Ir,es,f,"Throttled",-0,0),c);break e}Ov(s,a,Qn,Wc,qd,n,li,ks,Ir,es,f,null,-0,0)}}break}while(!0);sa(e)}function Ov(e,n,a,s,c,f,_,b,L,K,oe,_e,Y,ae){e.timeoutHandle=-1;var Oe=n.subtreeFlags,Ze=(f&335544064)===f;if(_e=null,(Ze||Oe&8192||(Oe&16785408)===16785408)&&(_e={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Zi},ri=null,Av(n,f,_e),Ze&&(Oe=_e,Ze=e.containerInfo,Ze=(Ze.nodeType===9?Ze:Ze.ownerDocument).__reactViewTransition,Ze!=null&&(Oe.count++,Oe.waitingForViewTransition=!0,Oe=xl.bind(Oe),Ze.finished.then(Oe,Oe))),Oe=(f&62914560)===f?qc-j():(f&4194048)===f?Nv-j():0,Oe=O1(_e,Oe),Oe!==null)){aa=f,e.cancelPendingCommit=Oe(Vv.bind(null,e,n,f,a,s,c,_,b,L,K,oe,_e,null,Y,ae)),is(e,f,_,!K);return}Vv(e,n,f,a,s,c,_,b,L,K,oe,_e)}function NM(e){for(var n=e;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var s=0;s<a.length;s++){var c=a[s],f=c.getSnapshot;c=c.value;try{if(!ai(f(),c))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function is(e,n,a,s){n=ql(e,n),n&=~Xc,n&=~ks,e.suspendedLanes|=n,e.pingedLanes&=~n,s&&(e.warmLanes|=n),s=e.expirationTimes;for(var c=n;0<c;){var f=31-On(c),_=1<<f;s[f]=-1,c&=~_}a!==0&&R(e,a,n)}function Kc(){return(Bt&6)===0?(dl(0),!1):!0}function Zd(){if(Et!==null){if(Vt===0)var e=Et.return;else e=Et,xa=Us=null,id(e),Rr=null,Zo=0,e=Et;for(;e!==null;)iv(e.alternate,e),e=e.return;Et=null}}function Vr(e,n){var a=e.timeoutHandle;return a!==-1&&(e.timeoutHandle=-1,e1(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),aa=0,Zd(),Zt=e,Et=a=va(e.current,null),At=n,Vt=0,oi=null,es=!1,Pr=Ia(e,n),Xd=!1,Ir=li=Xc=ks=ts=on=0,Qn=ul=null,qd=!1,ba=ql(e,n),ac(),a}function zv(e,n){pt=null,de.H=wc,n===Cr||n===mc?(n=Vg(),Vt=3):n===kf?(n=Vg(),Vt=4):Vt=n===_d?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,oi=n,Et===null&&(on=1,Nc(e,xi(n,e.current)))}function Pv(){var e=Cn.current;return e===null?!0:(At&4194048)===At?Pn===null:(At&62914560)===At||(At&536870912)!==0?e===Pn:!1}function Iv(){var e=de.H;return de.H=wc,e===null?wc:e}function Bv(){var e=de.A;return de.A=RM,e}function Qc(){on=4,es||(At&4194048)!==At&&Cn.current!==null||(Pr=!0),(ts&134217727)===0&&(ks&134217727)===0||Zt===null||is(Zt,At,li,!1)}function Kd(e,n,a){var s=Bt;Bt|=2;var c=Iv(),f=Bv();(Zt!==e||At!==n)&&(Wc=null,Vr(e,n)),n=!1;var _=on;e:do try{if(Vt!==0&&Et!==null){var b=Et,L=oi;switch(Vt){case 8:Zd(),_=6;break e;case 3:case 2:case 9:case 6:Cn.current===null&&(n=!0);var K=Vt;if(Vt=0,oi=null,jr(e,b,L,K),a&&Pr){_=0;break e}break;default:K=Vt,Vt=0,oi=null,jr(e,b,L,K)}}DM(),_=on;break}catch(oe){zv(e,oe)}while(!0);return n&&e.shellSuspendCounter++,xa=Us=null,Bt=s,de.H=c,de.A=f,Et===null&&(Zt=null,At=0,ac()),_}function DM(){for(;Et!==null;)Fv(Et)}function UM(e,n){var a=Bt;Bt|=2;var s=Iv(),c=Bv();Zt!==e||At!==n?(Wc=null,Yc=j()+500,Vr(e,n)):Pr=Ia(e,n);e:do try{if(Vt!==0&&Et!==null){n=Et;var f=oi;t:switch(Vt){case 1:Vt=0,oi=null,jr(e,n,f,1);break;case 2:case 9:if(Hg(f)){Vt=0,oi=null,Hv(n);break}n=function(){Vt!==2&&Vt!==9||Zt!==e||(Vt=7),sa(e)},f.then(n,n);break e;case 3:Vt=7;break e;case 4:Vt=5;break e;case 7:Hg(f)?(Vt=0,oi=null,Hv(n)):(Vt=0,oi=null,jr(e,n,f,7));break;case 5:var _=null;switch(Et.tag){case 26:_=Et.memoizedState;case 5:case 27:var b=Et;if(_?D_(_):b.stateNode.complete){Vt=0,oi=null;var L=b.sibling;if(L!==null)Et=L;else{var K=b.return;K!==null?(Et=K,Jc(K)):Et=null}break t}}Vt=0,oi=null,jr(e,n,f,5);break;case 6:Vt=0,oi=null,jr(e,n,f,6);break;case 8:Zd(),on=6;break e;default:throw Error(o(462))}}LM();break}catch(oe){zv(e,oe)}while(!0);return xa=Us=null,de.H=s,de.A=c,Bt=a,Et!==null?0:(Zt=null,At=0,ac(),on)}function LM(){for(;Et!==null&&!Be();)Fv(Et)}function Fv(e){var n=tv(e.alternate,e,ba);e.memoizedProps=e.pendingProps,n===null?Jc(e):Et=n}function Hv(e){var n=e,a=n.alternate;switch(n.tag){case 15:case 0:n=W0(a,n,n.pendingProps,n.type,void 0,At);break;case 11:n=W0(a,n,n.pendingProps,n.type.render,n.ref,At);break;case 5:id(n);var s=n;s===Mn&&(St?(uc(s),s.tag===5&&s.stateNode!=null&&(Qt=s.stateNode)):(uc(s),St=!0));default:iv(a,n),n=Et=wg(n,ba),n=tv(a,n,ba)}e.memoizedProps=e.pendingProps,n===null?Jc(e):Et=n}function jr(e,n,a,s){xa=Us=null,id(n),Rr=null,Zo=0;var c=n.return;try{if(yM(e,c,n,a,At)){on=1,Nc(e,xi(a,e.current)),Et=null;return}}catch(f){if(c!==null)throw Et=c,f;on=1,Nc(e,xi(a,e.current)),Et=null;return}n.flags&32768?(St||s===1?e=!0:Pr||(At&536870912)!==0?e=!1:(es=e=!0,(s===2||s===9||s===3||s===6)&&(s=Cn.current,s!==null&&s.tag===13&&(s.flags|=16384))),Gv(n,e)):Jc(n)}function Jc(e){var n=e;do{if((n.flags&32768)!==0){Gv(n,es);return}e=n.return;var a=TM(n.alternate,n,ba);if(a!==null){Et=a;return}if(n=n.sibling,n!==null){Et=n;return}Et=n=e}while(n!==null);on===0&&(on=5)}function Gv(e,n){do{var a=bM(e.alternate,e);if(a!==null){a.flags&=32767,Et=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(e=e.sibling,e!==null)){Et=e;return}Et=e=a}while(e!==null);on=6,Et=null}function Vv(e,n,a,s,c,f,_,b,L,K,oe,_e){e.cancelPendingCommit=null;do $c();while(nn!==0);if((Bt&6)!==0)throw Error(o(327));if(n!==null){if(n===e.current)throw Error(o(177));e===Zt&&(Et=Zt=null,At=0),Xs=n,Pi=e,aa=a,Wd=c,Dv=s,OM(e,n,a,_,b,L,_e)}}function OM(e,n,a,s,c,f,_){var b=n.lanes|n.childLanes;if(Yd=b,b|=Df,lf(e,a,b,s,c,f),Fr=null,(a&335544064)===a?(Hr=lM(e),s=10262):(Hr=null,s=10256),(n.subtreeFlags&s)!==0||(n.flags&s)!==0?(e.callbackNode=null,e.callbackPriority=0,HM(Te,function(){return eh(),null})):(e.callbackNode=null,e.callbackPriority=0),Bc=!1,s=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||s){s=de.T,de.T=null,c=je.p,je.p=2,f=Bt,Bt|=4;try{AM(e,n,a)}finally{Bt=f,je.p=c,de.T=s}}nn=1,Bc?Br=r1(_,e.containerInfo,Hr,Qd,Jd,PM,$d,eh,zM):(Qd(),Jd(),$d())}function zM(e){if(nn!==0){var n=Pi.onRecoverableError;n(e,{componentStack:null})}}function PM(){nn===3&&(nn=0,Tv(Xs,Pi),nn=4)}function Qd(){if(nn===1){nn=0;var e=Pi,n=Xs,a=aa,s=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||s){s=de.T,de.T=null;var c=je.p;je.p=2;var f=Bt;Bt|=4;try{ol=Gc=!1,Mv(n,e,a),a=dh;var _=xg(e.containerInfo),b=a.focusedElem,L=a.selectionRange;if(_!==b&&b&&b.ownerDocument&&_g(b.ownerDocument.documentElement,b)){if(L!==null&&Af(b)){var K=L.start,oe=L.end;if(oe===void 0&&(oe=K),"selectionStart"in b)b.selectionStart=K,b.selectionEnd=Math.min(oe,b.value.length);else{var _e=b.ownerDocument||document,Y=_e&&_e.defaultView||window;if(Y.getSelection){var ae=Y.getSelection(),Oe=b.textContent.length,Ze=Math.min(L.start,Oe),mt=L.end===void 0?Ze:Math.min(L.end,Oe);!ae.extend&&Ze>mt&&(_=mt,mt=Ze,Ze=_);var Z=vg(b,Ze),G=vg(b,mt);if(Z&&G&&(ae.rangeCount!==1||ae.anchorNode!==Z.node||ae.anchorOffset!==Z.offset||ae.focusNode!==G.node||ae.focusOffset!==G.offset)){var te=_e.createRange();te.setStart(Z.node,Z.offset),ae.removeAllRanges(),Ze>mt?(ae.addRange(te),ae.extend(G.node,G.offset)):(te.setEnd(G.node,G.offset),ae.addRange(te))}}}}for(_e=[],ae=b;ae=ae.parentNode;)ae.nodeType===1&&_e.push({element:ae,left:ae.scrollLeft,top:ae.scrollTop});for(typeof b.focus=="function"&&b.focus(),b=0;b<_e.length;b++){var ge=_e[b];ge.element.scrollLeft=ge.left,ge.element.scrollTop=ge.top}}Qr=!!fh,dh=fh=null}finally{Bt=f,je.p=c,de.T=s}}e.current=n,nn=2}}function Jd(){if(nn===2){nn=0;var e=Pi,n=Xs,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=de.T,de.T=null;var s=je.p;je.p=2;var c=Bt;Bt|=4;try{gv(e,n.alternate,n)}finally{Bt=c,je.p=s,de.T=a}}nn=3}}function $d(){if(nn===4||nn===3){nn=0;var e=Br;Br=null,ht();var n=Pi,a=Xs,s=aa,c=Dv,f=(s&335544064)===s?10262:10256;if((a.subtreeFlags&f)!==0||(a.flags&f)!==0?nn=5:(nn=0,Xs=Pi=null,jv(n,n.pendingLanes)),f=n.pendingLanes,f===0&&(ns=null),$(s),a=a.stateNode,tn&&typeof tn.onCommitFiberRoot=="function")try{tn.onCommitFiberRoot(bt,a,void 0,(a.current.flags&128)===128)}catch{}if(c!==null){a=de.T,f=je.p,je.p=2,de.T=null;try{for(var _=n.onRecoverableError,b=0;b<c.length;b++){var L=c[b];_(L.value,{componentStack:L.stack})}}finally{de.T=a,je.p=f}}if(c=Fr,_=Hr,Hr=null,c!==null&&(Fr=null,_===null&&(_=[]),e!==null))for(L=0;L<c.length;L++)a=(0,c[L])(_),a!==void 0&&e.finished.finally(a);(aa&3)!==0&&$c(),sa(n),f=n.pendingLanes,(s&261930)!==0&&(f&42)!==0?n===Zc?fl++:(fl=0,Zc=n):(fl=0,Zc=null),dl(0)}}function jv(e,n){(e.pooledCacheLanes&=n)===0&&(n=e.pooledCache,n!=null&&(e.pooledCache=null,qo(n)))}function $c(){return Br!==null&&(Br.skipTransition(),Br=null),Qd(),Jd(),$d(),eh()}function eh(){if(nn!==5)return!1;var e=Pi,n=Yd;Yd=0;var a=$(aa),s=de.T,c=je.p;try{je.p=32>a?32:a,de.T=null,a=Wd,Wd=null;var f=Pi,_=aa;if(nn=0,Xs=Pi=null,aa=0,(Bt&6)!==0)throw Error(o(331));var b=Bt;if(Bt|=4,Rv(f.current),bv(f,f.current,_,a),Bt=b,dl(0,!1),tn&&typeof tn.onPostCommitFiberRoot=="function")try{tn.onPostCommitFiberRoot(bt,f)}catch{}return!0}finally{je.p=c,de.T=s,jv(e,n)}}function kv(e,n,a){n=xi(a,n),n=vd(e.stateNode,n,2),e=Wa(e,n,2),e!==null&&(As(e,2),sa(e))}function jt(e,n,a){if(e.tag===3)kv(e,e,a);else for(;n!==null;){if(n.tag===3){kv(n,e,a);break}else if(n.tag===1){var s=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof s.componentDidCatch=="function"&&(ns===null||!ns.has(s))){e=xi(a,e),a=H0(2),s=Wa(n,a,2),s!==null&&(G0(a,s,n,e),As(s,2),sa(s));break}}n=n.return}}function th(e,n,a){var s=e.pingCache;if(s===null){s=e.pingCache=new wM;var c=new Set;s.set(n,c)}else c=s.get(n),c===void 0&&(c=new Set,s.set(n,c));c.has(a)||(Xd=!0,c.add(a),e=IM.bind(null,e,n,a),n.then(e,e))}function IM(e,n,a){var s=e.pingCache;s!==null&&s.delete(n),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,Zt===e&&(At&a)===a&&((on===4||on===3&&(At&62914560)===At&&300>j()-qc)&&(Bt&2)===0?Vr(e,0):Xc|=a,Ir===At&&(Ir=0)),sa(e)}function Xv(e,n){n===0&&(n=Yl()),e=ws(e,n),e!==null&&(As(e,n),sa(e))}function BM(e){var n=e.memoizedState,a=0;n!==null&&(a=n.retryLane),Xv(e,a)}function FM(e,n){var a=0;switch(e.tag){case 31:case 13:var s=e.stateNode,c=e.memoizedState;c!==null&&(a=c.retryLane);break;case 19:s=e.stateNode;break;case 22:s=e.stateNode._retryCache;break;default:throw Error(o(314))}s!==null&&s.delete(n),Xv(e,a)}function HM(e,n){return rt(e,n)}var kr=null,Xr=null,nh=!1,eu=!1,ih=!1,as=0;function sa(e){e!==Xr&&e.next===null&&(Xr===null?kr=Xr=e:Xr=Xr.next=e),eu=!0,nh||(nh=!0,VM())}function dl(e,n){if(!ih&&eu){ih=!0;do for(var a=!1,s=kr;s!==null;){if(e!==0){var c=s.pendingLanes;if(c===0)var f=0;else{var _=s.suspendedLanes,b=s.pingedLanes;f=(1<<31-On(42|e)+1)-1,f&=c&~(_&~b),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,Zv(s,f))}else f=At,f=bs(s,s===Zt?f:0,s.cancelPendingCommit!==null||s.timeoutHandle!==-1),(f&3)===0||Ia(s,f)||(a=!0,Zv(s,f));s=s.next}while(a);ih=!1}}function GM(){qv()}function qv(){eu=nh=!1;var e=0;as!==0&&$M()&&(e=as);for(var n=j(),a=null,s=kr;s!==null;){var c=s.next,f=Yv(s,n);f===0?(s.next=null,a===null?kr=c:a.next=c,c===null&&(Xr=a)):(a=s,(e!==0||(f&3)!==0)&&(eu=!0)),s=c}nn!==0&&nn!==5||dl(e),as!==0&&(as=0)}function Yv(e,n){for(var a=e.suspendedLanes,s=e.pingedLanes,c=e.expirationTimes,f=e.pendingLanes&-62914561;0<f;){var _=31-On(f),b=1<<_,L=c[_];L===-1?((b&a)===0||(b&s)!==0)&&(c[_]=of(b,n)):L<=n&&(e.expiredLanes|=b),f&=~b}if(n=Zt,a=At,a=bs(e,e===n?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),s=e.callbackNode,a===0||e===n&&(Vt===2||Vt===9)||e.cancelPendingCommit!==null)return s!==null&&s!==null&&$e(s),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||Ia(e,a)){if(n=a&-a,n===e.callbackPriority)return n;switch(s!==null&&$e(s),$(a)){case 2:case 8:a=qe;break;case 32:a=Te;break;case 268435456:a=Ke;break;default:a=Te}return s=Wv.bind(null,e),a=rt(a,s),e.callbackPriority=n,e.callbackNode=a,n}return s!==null&&s!==null&&$e(s),e.callbackPriority=2,e.callbackNode=null,2}function Wv(e,n){if(nn!==0&&nn!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if($c()&&e.callbackNode!==a)return null;var s=At;return s=bs(e,e===Zt?s:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),s===0?null:(Lv(e,s,n),Yv(e,j()),e.callbackNode!=null&&e.callbackNode===a?Wv.bind(null,e):null)}function Zv(e,n){if($c())return null;Lv(e,n,!0)}function VM(){t1(function(){(Bt&6)!==0?rt(Le,GM):qv()})}function ah(){if(as===0){var e=zs;e===0&&(e=Es,Es<<=1,(Es&261888)===0&&(Es=256)),as=e}return as}function Kv(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Kl(e)}function jM(e,n,a,s,c){if(n==="submit"&&a&&a.stateNode===c){var f=Kv((c[We]||null).action),_=s.submitter;_&&(n=(n=_[We]||null)?Kv(n.formAction):_.getAttribute("formAction"),n!==null&&(f=n,_=null));var b=new ec("action","action",null,s,c);e.push({event:b,listeners:[{instance:null,listener:function(){if(s.defaultPrevented){if(as!==0){var L=new FormData(c,_);dd(a,{pending:!0,data:L,method:c.method,action:f},null,L)}}else typeof f=="function"&&(b.preventDefault(),L=new FormData(c,_),dd(a,{pending:!0,data:L,method:c.method,action:f},f,L))},currentTarget:c}]})}}for(var sh=0;sh<Nf.length;sh++){var rh=Nf[sh],kM=rh.toLowerCase(),XM=rh[0].toUpperCase()+rh.slice(1);Ui(kM,"on"+XM)}Ui(Mg,"onAnimationEnd"),Ui(Eg,"onAnimationIteration"),Ui(Tg,"onAnimationStart"),Ui("dblclick","onDoubleClick"),Ui("focusin","onFocus"),Ui("focusout","onBlur"),Ui(eM,"onTransitionRun"),Ui(tM,"onTransitionStart"),Ui(nM,"onTransitionCancel"),Ui(bg,"onTransitionEnd"),sn("onMouseEnter",["mouseout","mouseover"]),sn("onMouseLeave",["mouseout","mouseover"]),sn("onPointerEnter",["pointerout","pointerover"]),sn("onPointerLeave",["pointerout","pointerover"]),un("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),un("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),un("onBeforeInput",["compositionend","keypress","textInput","paste"]),un("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),un("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),un("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var hl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),qM=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(hl));function Qv(e,n){n=(n&4)!==0;for(var a=0;a<e.length;a++){var s=e[a],c=s.event;s=s.listeners;e:{var f=void 0;if(n)for(var _=s.length-1;0<=_;_--){var b=s[_],L=b.instance,K=b.currentTarget;if(b=b.listener,L!==f&&c.isPropagationStopped())break e;f=b,c.currentTarget=K;try{f(c)}catch(oe){ic(oe)}c.currentTarget=null,f=L}else for(_=0;_<s.length;_++){if(b=s[_],L=b.instance,K=b.currentTarget,b=b.listener,L!==f&&c.isPropagationStopped())break e;f=b,c.currentTarget=K;try{f(c)}catch(oe){ic(oe)}c.currentTarget=null,f=L}}}}function Tt(e,n){var a=n[nt];a===void 0&&(a=n[nt]=new Set);var s=e+"__bubble";a.has(s)||(Jv(n,e,2,!1),a.add(s))}function oh(e,n,a){var s=0;n&&(s|=4),Jv(a,e,s,n)}var tu="_reactListening"+Math.random().toString(36).slice(2);function lh(e){if(!e[tu]){e[tu]=!0,Kt.forEach(function(a){a!=="selectionchange"&&(qM.has(a)||oh(a,!1,e),oh(a,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[tu]||(n[tu]=!0,oh("selectionchange",!1,n))}}function Jv(e,n,a,s){switch(G_(n)){case 2:var c=B1;break;case 8:c=F1;break;default:c=Rh}a=c.bind(null,n,a,e),c=void 0,!gf||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(c=!0),s?c!==void 0?e.addEventListener(n,a,{capture:!0,passive:c}):e.addEventListener(n,a,!0):c!==void 0?e.addEventListener(n,a,{passive:c}):e.addEventListener(n,a,!1)}function ch(e,n,a,s,c){var f=s;if((n&1)===0&&(n&2)===0&&s!==null)e:for(;;){if(s===null)return;var _=s.tag;if(_===3||_===4){var b=s.stateNode.containerInfo;if(b===c)break;if(_===4)for(_=s.return;_!==null;){var L=_.tag;if((L===3||L===4)&&_.stateNode.containerInfo===c)return;_=_.return}for(;b!==null;){if(_=It(b),_===null)return;if(L=_.tag,L===5||L===6||L===26||L===27){s=f=_;continue e}b=b.parentNode}}s=s.return}Jm(function(){var K=f,oe=pf(a),_e=[];e:{var Y=Ag.get(e);if(Y!==void 0){var ae=ec,Oe=e;switch(e){case"keypress":if(Jl(a)===0)break e;case"keydown":case"keyup":ae=NS;break;case"focusin":Oe="focus",ae=yf;break;case"focusout":Oe="blur",ae=yf;break;case"beforeblur":case"afterblur":ae=yf;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ae=tg;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ae=_S;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ae=zS;break;case Mg:case Eg:case Tg:ae=SS;break;case bg:ae=IS;break;case"scroll":case"scrollend":ae=gS;break;case"wheel":ae=FS;break;case"copy":case"cut":case"paste":ae=ES;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ae=ig;break;case"submit":ae=LS;break;case"toggle":case"beforetoggle":ae=GS}var Ze=(n&4)!==0,mt=!Ze&&(e==="scroll"||e==="scrollend"),Z=Ze?Y!==null?Y+"Capture":null:Y;Ze=[];for(var G=K,te;G!==null;){var ge=G;if(te=ge.stateNode,ge=ge.tag,ge!==5&&ge!==26&&ge!==27||te===null||Z===null||(ge=zo(G,Z),ge!=null&&Ze.push(pl(G,ge,te))),mt)break;G=G.return}0<Ze.length&&(Y=new ae(Y,Oe,null,a,oe),_e.push({event:Y,listeners:Ze}))}}if((n&7)===0){e:{if(ae=e==="mouseover"||e==="pointerover",Y=e==="mouseout"||e==="pointerout",ae&&a!==hf&&(Oe=a.relatedTarget||a.fromElement)&&(It(Oe)||Oe[st]))break e;(Y||ae)&&(Oe=oe.window===oe?oe:(ae=oe.ownerDocument)?ae.defaultView||ae.parentWindow:window,Y?(ae=a.relatedTarget||a.toElement,Y=K,ae=ae?It(ae):null,ae!==null&&(mt=u(ae),Ze=ae.tag,ae!==mt||Ze!==5&&Ze!==27&&Ze!==6)&&(ae=null)):(Y=null,ae=K),Y!==ae&&(Ze=tg,ge="onMouseLeave",Z="onMouseEnter",G="mouse",(e==="pointerout"||e==="pointerover")&&(Ze=ig,ge="onPointerLeave",Z="onPointerEnter",G="pointer"),mt=Y==null?Oe:_n(Y),te=ae==null?Oe:_n(ae),Oe=new Ze(ge,G+"leave",Y,a,oe),Oe.target=mt,Oe.relatedTarget=te,ge=null,It(oe)===K&&(Ze=new Ze(Z,G+"enter",ae,a,oe),Ze.target=te,Ze.relatedTarget=mt,ge=Ze),mt=ge,Ze=Y&&ae?H(Y,ae,YM):null,Y!==null&&$v(_e,Oe,Y,Ze,!1),ae!==null&&mt!==null&&$v(_e,mt,ae,Ze,!0)))}e:{if(Y=K?_n(K):window,ae=Y.nodeName&&Y.nodeName.toLowerCase(),ae==="select"||ae==="input"&&Y.type==="file")var Xe=fg;else if(cg(Y))if(dg)Xe=QS;else{Xe=ZS;var Ct=WS}else ae=Y.nodeName,!ae||ae.toLowerCase()!=="input"||Y.type!=="checkbox"&&Y.type!=="radio"?K&&df(K.elementType)&&(Xe=fg):Xe=KS;if(Xe&&(Xe=Xe(e,K))){ug(_e,Xe,a,oe);break e}Ct&&Ct(e,Y,K)}switch(Ct=K?_n(K):window,e){case"focusin":(cg(Ct)||Ct.contentEditable==="true")&&(xr=Ct,Cf=K,jo=null);break;case"focusout":jo=Cf=xr=null;break;case"mousedown":Rf=!0;break;case"contextmenu":case"mouseup":case"dragend":Rf=!1,yg(_e,a,oe);break;case"selectionchange":if($S)break;case"keydown":case"keyup":yg(_e,a,oe)}var tt;if(Mf)e:{switch(e){case"compositionstart":var lt="onCompositionStart";break e;case"compositionend":lt="onCompositionEnd";break e;case"compositionupdate":lt="onCompositionUpdate";break e}lt=void 0}else _r?og(e,a)&&(lt="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(lt="onCompositionStart");lt&&(ag&&a.locale!=="ko"&&(_r||lt!=="onCompositionStart"?lt==="onCompositionEnd"&&_r&&(tt=$m()):(Fa=oe,vf="value"in Fa?Fa.value:Fa.textContent,_r=!0)),Ct=nu(K,lt),0<Ct.length&&(lt=new ng(lt,e,null,a,oe),_e.push({event:lt,listeners:Ct}),tt?lt.data=tt:(tt=lg(a),tt!==null&&(lt.data=tt)))),(tt=jS?kS(e,a):XS(e,a))&&(lt=nu(K,"onBeforeInput"),0<lt.length&&(Ct=new ng("onBeforeInput","beforeinput",null,a,oe),_e.push({event:Ct,listeners:lt}),Ct.data=tt)),jM(_e,e,K,a,oe)}Qv(_e,n)})}function pl(e,n,a){return{instance:e,listener:n,currentTarget:a}}function nu(e,n){for(var a=n+"Capture",s=[];e!==null;){var c=e,f=c.stateNode;if(c=c.tag,c!==5&&c!==26&&c!==27||f===null||(c=zo(e,a),c!=null&&s.unshift(pl(e,c,f)),c=zo(e,n),c!=null&&s.push(pl(e,c,f))),e.tag===3)return s;e=e.return}return[]}function YM(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function $v(e,n,a,s,c){for(var f=n._reactName,_=[];a!==null&&a!==s;){var b=a,L=b.alternate,K=b.stateNode;if(b=b.tag,L!==null&&L===s)break;b!==5&&b!==26&&b!==27||K===null||(L=K,c?(K=zo(a,f),K!=null&&_.unshift(pl(a,K,L))):c||(K=zo(a,f),K!=null&&_.push(pl(a,K,L)))),a=a.return}_.length!==0&&e.push({event:n,listeners:_})}var WM=/\r\n?/g,ZM=/\u0000|\uFFFD/g;function e_(e){return(typeof e=="string"?e:""+e).replace(WM,`
`).replace(ZM,"")}function t_(e,n){return n=e_(n),e_(e)===n}function kt(e,n,a,s,c,f){switch(a){case"children":if(typeof s=="string")n==="body"||n==="textarea"&&s===""||mr(e,s);else if(typeof s=="number"||typeof s=="bigint")n!=="body"&&mr(e,""+s);else return;break;case"className":Zl(e,"class",s);break;case"tabIndex":Zl(e,"tabindex",s);break;case"dir":case"role":case"viewBox":case"width":case"height":Zl(e,a,s);break;case"style":Km(e,s,f);return;case"data":if(n!=="object"){Zl(e,"data",s);break}case"src":case"href":if(s===""&&(n!=="a"||a!=="href")){e.removeAttribute(a);break}if(s==null||typeof s=="function"||typeof s=="symbol"||typeof s=="boolean"){e.removeAttribute(a);break}s=Kl(s),e.setAttribute(a,s);break;case"action":case"formAction":if(typeof s=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&kt(e,n,"name",c.name,c,null),kt(e,n,"formEncType",c.formEncType,c,null),kt(e,n,"formMethod",c.formMethod,c,null),kt(e,n,"formTarget",c.formTarget,c,null)):(kt(e,n,"encType",c.encType,c,null),kt(e,n,"method",c.method,c,null),kt(e,n,"target",c.target,c,null)));if(s==null||typeof s=="symbol"||typeof s=="boolean"){e.removeAttribute(a);break}s=Kl(s),e.setAttribute(a,s);break;case"onClick":s!=null&&(e.onclick=Zi);return;case"onScroll":s!=null&&Tt("scroll",e);return;case"onScrollEnd":s!=null&&Tt("scrollend",e);return;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(o(61));if(a=s.__html,a!=null){if(c.children!=null)throw Error(o(60));(f!=null?f.__html:void 0)!==a&&(e.innerHTML=a)}}break;case"multiple":e.multiple=s&&typeof s!="function"&&typeof s!="symbol";break;case"muted":e.muted=s&&typeof s!="function"&&typeof s!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(s==null||typeof s=="function"||typeof s=="boolean"||typeof s=="symbol"){e.removeAttribute("xlink:href");break}a=Kl(s),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":s!=null&&typeof s!="function"&&typeof s!="symbol"?e.setAttribute(a,s):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":s&&typeof s!="function"&&typeof s!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":s===!0?e.setAttribute(a,""):s!==!1&&s!=null&&typeof s!="function"&&typeof s!="symbol"?e.setAttribute(a,s):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":s!=null&&typeof s!="function"&&typeof s!="symbol"&&!isNaN(s)&&1<=s?e.setAttribute(a,s):e.removeAttribute(a);break;case"rowSpan":case"start":s==null||typeof s=="function"||typeof s=="symbol"||isNaN(s)?e.removeAttribute(a):e.setAttribute(a,s);break;case"popover":Tt("beforetoggle",e),Tt("toggle",e),Wl(e,"popover",s);break;case"xlinkActuate":ha(e,"http://www.w3.org/1999/xlink","xlink:actuate",s);break;case"xlinkArcrole":ha(e,"http://www.w3.org/1999/xlink","xlink:arcrole",s);break;case"xlinkRole":ha(e,"http://www.w3.org/1999/xlink","xlink:role",s);break;case"xlinkShow":ha(e,"http://www.w3.org/1999/xlink","xlink:show",s);break;case"xlinkTitle":ha(e,"http://www.w3.org/1999/xlink","xlink:title",s);break;case"xlinkType":ha(e,"http://www.w3.org/1999/xlink","xlink:type",s);break;case"xmlBase":ha(e,"http://www.w3.org/XML/1998/namespace","xml:base",s);break;case"xmlLang":ha(e,"http://www.w3.org/XML/1998/namespace","xml:lang",s);break;case"xmlSpace":ha(e,"http://www.w3.org/XML/1998/namespace","xml:space",s);break;case"is":Wl(e,"is",s);break;case"innerText":case"textContent":return;default:if(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")a=pS.get(a)||a,Wl(e,a,s);else return}zt=!0}function uh(e,n,a,s,c,f){switch(a){case"style":Km(e,s,f);return;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(o(61));if(a=s.__html,a!=null){if(c.children!=null)throw Error(o(60));(f!=null?f.__html:void 0)!==a&&(e.innerHTML=a)}}break;case"children":if(typeof s=="string")mr(e,s);else if(typeof s=="number"||typeof s=="bigint")mr(e,""+s);else return;break;case"onScroll":s!=null&&Tt("scroll",e);return;case"onScrollEnd":s!=null&&Tt("scrollend",e);return;case"onClick":s!=null&&(e.onclick=Zi);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!Hn.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(c=a.endsWith("Capture"),f=a.slice(2,c?a.length-7:void 0),n=e[We]||null,n=n!=null?n[a]:null,typeof n=="function"&&e.removeEventListener(f,n,c),typeof s=="function")){typeof n!="function"&&n!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(f,s,c);break e}zt=!0,a in e?e[a]=s:s===!0?e.setAttribute(a,""):Wl(e,a,s)}return}zt=!0}function Nn(e,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Tt("error",e),Tt("load",e);var s=!1,c=!1,f;for(f in a)if(a.hasOwnProperty(f)){var _=a[f];if(_!=null)switch(f){case"src":s=!0;break;case"srcSet":c=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(o(137,n));default:kt(e,n,f,_,a,null)}}c&&kt(e,n,"srcSet",a.srcSet,a,null),s&&kt(e,n,"src",a.src,a,null);return;case"input":Tt("invalid",e);var b=f=_=c=null,L=null,K=null;for(s in a)if(a.hasOwnProperty(s)){var oe=a[s];if(oe!=null)switch(s){case"name":c=oe;break;case"type":_=oe;break;case"checked":L=oe;break;case"defaultChecked":K=oe;break;case"value":f=oe;break;case"defaultValue":b=oe;break;case"children":case"dangerouslySetInnerHTML":if(oe!=null)throw Error(o(137,n));break;default:kt(e,n,s,oe,a,null)}}qm(e,f,b,L,K,_,c,!1);return;case"select":Tt("invalid",e),s=_=f=null;for(c in a)if(a.hasOwnProperty(c)&&(b=a[c],b!=null))switch(c){case"value":f=b;break;case"defaultValue":_=b;break;case"multiple":s=b;default:kt(e,n,c,b,a,null)}n=f,a=_,e.multiple=!!s,n!=null?pr(e,!!s,n,!1):a!=null&&pr(e,!!s,a,!0);return;case"textarea":Tt("invalid",e),f=c=s=null;for(_ in a)if(a.hasOwnProperty(_)&&(b=a[_],b!=null))switch(_){case"value":s=b;break;case"defaultValue":c=b;break;case"children":f=b;break;case"dangerouslySetInnerHTML":if(b!=null)throw Error(o(91));break;default:kt(e,n,_,b,a,null)}Wm(e,s,c,f);return;case"option":for(L in a)if(a.hasOwnProperty(L)&&(s=a[L],s!=null))switch(L){case"selected":e.selected=s&&typeof s!="function"&&typeof s!="symbol";break;default:kt(e,n,L,s,a,null)}return;case"dialog":Tt("beforetoggle",e),Tt("toggle",e),Tt("cancel",e),Tt("close",e);break;case"iframe":case"object":Tt("load",e);break;case"video":case"audio":for(s=0;s<hl.length;s++)Tt(hl[s],e);break;case"image":Tt("error",e),Tt("load",e);break;case"details":Tt("toggle",e);break;case"embed":case"source":case"link":Tt("error",e),Tt("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(K in a)if(a.hasOwnProperty(K)&&(s=a[K],s!=null))switch(K){case"children":case"dangerouslySetInnerHTML":throw Error(o(137,n));default:kt(e,n,K,s,a,null)}return;default:if(df(n)){for(oe in a)a.hasOwnProperty(oe)&&(s=a[oe],s!==void 0&&uh(e,n,oe,s,a,void 0));return}}for(b in a)a.hasOwnProperty(b)&&(s=a[b],s!=null&&kt(e,n,b,s,a,null))}var KM={};function QM(e,n,a,s){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var c=null,f=null,_=null,b=null,L=null,K=null,oe=null;for(ae in a){var _e=a[ae];if(a.hasOwnProperty(ae)&&_e!=null)switch(ae){case"checked":break;case"value":break;case"defaultValue":L=_e;default:s.hasOwnProperty(ae)||kt(e,n,ae,null,s,_e)}}for(var Y in s){var ae=s[Y];if(_e=a[Y],s.hasOwnProperty(Y)&&(ae!=null||_e!=null))switch(Y){case"type":ae!==_e&&(zt=!0),f=ae;break;case"name":ae!==_e&&(zt=!0),c=ae;break;case"checked":ae!==_e&&(zt=!0),K=ae;break;case"defaultChecked":ae!==_e&&(zt=!0),oe=ae;break;case"value":ae!==_e&&(zt=!0),_=ae;break;case"defaultValue":ae!==_e&&(zt=!0),b=ae;break;case"children":case"dangerouslySetInnerHTML":if(ae!=null)throw Error(o(137,n));break;default:ae!==_e&&kt(e,n,Y,ae,s,_e)}}uf(e,_,b,L,K,oe,f,c);return;case"select":ae=_=b=Y=null;for(f in a)if(L=a[f],a.hasOwnProperty(f)&&L!=null)switch(f){case"value":break;case"multiple":ae=L;default:s.hasOwnProperty(f)||kt(e,n,f,null,s,L)}for(c in s)if(f=s[c],L=a[c],s.hasOwnProperty(c)&&(f!=null||L!=null))switch(c){case"value":f!==L&&(zt=!0),Y=f;break;case"defaultValue":f!==L&&(zt=!0),b=f;break;case"multiple":f!==L&&(zt=!0),_=f;default:f!==L&&kt(e,n,c,f,s,L)}n=b,a=_,s=ae,Y!=null?pr(e,!!a,Y,!1):!!s!=!!a&&(n!=null?pr(e,!!a,n,!0):pr(e,!!a,a?[]:"",!1));return;case"textarea":ae=Y=null;for(b in a)if(c=a[b],a.hasOwnProperty(b)&&c!=null&&!s.hasOwnProperty(b))switch(b){case"value":break;case"children":break;default:kt(e,n,b,null,s,c)}for(_ in s)if(c=s[_],f=a[_],s.hasOwnProperty(_)&&(c!=null||f!=null))switch(_){case"value":c!==f&&(zt=!0),Y=c;break;case"defaultValue":c!==f&&(zt=!0),ae=c;break;case"children":break;case"dangerouslySetInnerHTML":if(c!=null)throw Error(o(91));break;default:c!==f&&kt(e,n,_,c,s,f)}Ym(e,Y,ae);return;case"option":for(var Oe in a)if(Y=a[Oe],a.hasOwnProperty(Oe)&&Y!=null&&!s.hasOwnProperty(Oe))switch(Oe){case"selected":e.selected=!1;break;default:kt(e,n,Oe,null,s,Y)}for(L in s)if(Y=s[L],ae=a[L],s.hasOwnProperty(L)&&Y!==ae&&(Y!=null||ae!=null))switch(L){case"selected":Y!==ae&&(zt=!0),e.selected=Y&&typeof Y!="function"&&typeof Y!="symbol";break;default:kt(e,n,L,Y,s,ae)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var Ze in a)Y=a[Ze],a.hasOwnProperty(Ze)&&Y!=null&&!s.hasOwnProperty(Ze)&&kt(e,n,Ze,null,s,Y);for(K in s)if(Y=s[K],ae=a[K],s.hasOwnProperty(K)&&Y!==ae&&(Y!=null||ae!=null))switch(K){case"children":case"dangerouslySetInnerHTML":if(Y!=null)throw Error(o(137,n));break;default:kt(e,n,K,Y,s,ae)}return;default:if(df(n)){for(var mt in a)Y=a[mt],a.hasOwnProperty(mt)&&Y!==void 0&&!s.hasOwnProperty(mt)&&uh(e,n,mt,void 0,s,Y);for(oe in s)Y=s[oe],ae=a[oe],!s.hasOwnProperty(oe)||Y===ae||Y===void 0&&ae===void 0||uh(e,n,oe,Y,s,ae);return}}for(var Z in a)Y=a[Z],a.hasOwnProperty(Z)&&Y!=null&&!s.hasOwnProperty(Z)&&kt(e,n,Z,null,s,Y);for(_e in s)Y=s[_e],ae=a[_e],!s.hasOwnProperty(_e)||Y===ae||Y==null&&ae==null||kt(e,n,_e,Y,s,ae)}function n_(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function JM(){if(typeof performance.getEntriesByType=="function"){for(var e=0,n=0,a=performance.getEntriesByType("resource"),s=0;s<a.length;s++){var c=a[s],f=c.transferSize,_=c.initiatorType,b=c.duration;if(f&&b&&n_(_)){for(_=0,b=c.responseEnd,s+=1;s<a.length;s++){var L=a[s],K=L.startTime;if(K>b)break;var oe=L.transferSize,_e=L.initiatorType;oe&&n_(_e)&&(L=L.responseEnd,_+=oe*(L<b?1:(b-K)/(L-K)))}if(--s,n+=8*(f+_)/(c.duration/1e3),e++,10<e)break}}if(0<e)return n/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var fh=null,dh=null;function ml(e){return e.nodeType===9?e:e.ownerDocument}function i_(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function a_(e,n){if(e===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&n==="foreignObject"?0:e}function s_(e,n,a,s){return a=ml(a).createElement(e),a[Ue]=s,a[We]=n,Nn(a,e,n),Ot(a),a}function hh(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var ph=null;function $M(){var e=window.event;return e&&e.type==="popstate"?e===ph?!1:(ph=e,!0):(ph=null,!1)}var mh=typeof setTimeout=="function"?setTimeout:void 0,e1=typeof clearTimeout=="function"?clearTimeout:void 0,r_=typeof Promise=="function"?Promise:void 0,o_=typeof requestAnimationFrame=="function"?requestAnimationFrame:mh,t1=typeof queueMicrotask=="function"?queueMicrotask:typeof r_<"u"?function(e){return r_.resolve(null).then(e).catch(n1)}:mh;function n1(e){setTimeout(function(){throw e})}function ss(e){return e==="head"}function l_(e,n){var a=n,s=0;do{var c=a.nextSibling;if(e.removeChild(a),c&&c.nodeType===8)if(a=c.data,a==="/$"||a==="/&"){if(s===0){e.removeChild(c),Jr(n);return}s--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")s++;else if(a==="html")Eh(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,Eh(a);for(var f=a.firstChild;f;){var _=f.nextSibling,b=f.nodeName;f[Pt]||b==="SCRIPT"||b==="STYLE"||b==="LINK"&&f.rel.toLowerCase()==="stylesheet"||a.removeChild(f),f=_}}else a==="body"&&Eh(e.ownerDocument.body);a=c}while(a);Jr(n)}function c_(e,n){var a=e;e=0;do{var s=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),s&&s.nodeType===8)if(a=s.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=s}while(a)}function u_(e,n,a){if(n=CSS.escape(n)!==n?"r-"+btoa(n).replace(/=/g,""):n,e.style.viewTransitionName=n,a!=null&&(e.style.viewTransitionClass=a),a=getComputedStyle(e),a.display==="inline"){if(n=e.getClientRects(),n.length===1)var s=1;else for(var c=s=0;c<n.length;c++){var f=n[c];0<f.width&&0<f.height&&s++}s===1&&(e=e.style,e.display=n.length===1?"inline-block":"block",e.marginTop="-"+a.paddingTop,e.marginBottom="-"+a.paddingBottom)}}function f_(e,n){e=e.style,n=n.style;var a=n!=null?n.hasOwnProperty("viewTransitionName")?n.viewTransitionName:n.hasOwnProperty("view-transition-name")?n["view-transition-name"]:null:null;e.viewTransitionName=a==null||typeof a=="boolean"?"":(""+a).trim(),a=n!=null?n.hasOwnProperty("viewTransitionClass")?n.viewTransitionClass:n.hasOwnProperty("view-transition-class")?n["view-transition-class"]:null:null,e.viewTransitionClass=a==null||typeof a=="boolean"?"":(""+a).trim(),e.display==="inline-block"&&(n==null?e.display=e.margin="":(a=n.display,e.display=a==null||typeof a=="boolean"?"":a,a=n.margin,a!=null?e.margin=a:(a=n.hasOwnProperty("marginTop")?n.marginTop:n["margin-top"],e.marginTop=a==null||typeof a=="boolean"?"":a,n=n.hasOwnProperty("marginBottom")?n.marginBottom:n["margin-bottom"],e.marginBottom=n==null||typeof n=="boolean"?"":n)))}function i1(e,n,a){return a=a.ownerDocument.defaultView,{rect:e,abs:n.position==="absolute"||n.position==="fixed",clip:n.clipPath!=="none"||n.overflow!=="visible"||n.filter!=="none"||n.mask!=="none"||n.mask!=="none"||n.borderRadius!=="0px",view:0<=e.bottom&&0<=e.right&&e.top<=a.innerHeight&&e.left<=a.innerWidth}}function gh(e){var n=e.getBoundingClientRect(),a=getComputedStyle(e);return i1(n,a,e)}function a1(e){return e.documentElement.clientHeight}function s1(e){this.addEventListener("load",e),this.addEventListener("error",e)}function r1(e,n,a,s,c,f,_,b,L){var K=n.nodeType===9?n:n.ownerDocument;try{var oe=K.startViewTransition({update:function(){var Y=K.defaultView,ae=Y.navigation&&Y.navigation.transition,Oe=K.fonts.status;s();var Ze=[];if(Oe==="loaded"&&(a1(K),K.fonts.status==="loading"&&Ze.push(K.fonts.ready)),Oe=Ze.length,e!==null)for(var mt=e.suspenseyImages,Z=0,G=0;G<mt.length;G++){var te=mt[G];if(!te.complete){var ge=te.getBoundingClientRect();if(0<ge.bottom&&0<ge.right&&ge.top<Y.innerHeight&&ge.left<Y.innerWidth){if(Z+=U_(te),Z>su){Ze.length=Oe;break}te=new Promise(s1.bind(te)),Ze.push(te)}}}if(0<Ze.length)return Y=Promise.race([Promise.all(Ze),new Promise(function(Xe){return setTimeout(Xe,500)})]).then(c,c),(ae?Promise.allSettled([ae.finished,Y]):Y).then(f,f);if(c(),ae)return ae.finished.then(f,f);f()},types:a});K.__reactViewTransition=oe;var _e=[];return oe.ready.then(function(){for(var Y=K.documentElement.getAnimations({subtree:!0}),ae=0;ae<Y.length;ae++){var Oe=Y[ae],Ze=Oe.effect,mt=Ze.pseudoElement;if(mt!=null&&mt.startsWith("::view-transition")){_e.push(Oe),Oe=Ze.getKeyframes();for(var Z=mt=void 0,G=!0,te=0;te<Oe.length;te++){var ge=Oe[te],Xe=ge.width;if(mt===void 0)mt=Xe;else if(mt!==Xe){G=!1;break}if(Xe=ge.height,Z===void 0)Z=Xe;else if(Z!==Xe){G=!1;break}delete ge.width,delete ge.height,ge.transform==="none"&&delete ge.transform}G&&mt!==void 0&&Z!==void 0&&(Ze.setKeyframes(Oe),G=getComputedStyle(Ze.target,Ze.pseudoElement),G.width!==mt||G.height!==Z)&&(G=Oe[0],G.width=mt,G.height=Z,G=Oe[Oe.length-1],G.width=mt,G.height=Z,Ze.setKeyframes(Oe))}}_()},function(Y){K.__reactViewTransition===oe&&(K.__reactViewTransition=null);try{if(typeof Y=="object"&&Y!==null)switch(Y.name){case"InvalidStateError":(Y.message==="View transition was skipped because document visibility state is hidden."||Y.message==="Skipping view transition because document visibility state has become hidden."||Y.message==="Skipping view transition because viewport size changed."||Y.message==="Transition was aborted because of invalid state")&&(Y=null)}Y!==null&&L(Y)}finally{s(),c(),_()}}),oe.finished.finally(function(){for(var Y=0;Y<_e.length;Y++)_e[Y].cancel();K.__reactViewTransition===oe&&(K.__reactViewTransition=null),b()}),oe}catch{return s(),c(),_(),null}}function qs(e,n){this._scope=document.documentElement,this._selector="::view-transition-"+e+"("+n+")"}qs.prototype.animate=function(e,n){return n=typeof n=="number"?{duration:n}:z({},n),n.pseudoElement=this._selector,this._scope.animate(e,n)},qs.prototype.getAnimations=function(){for(var e=this._scope,n=this._selector,a=e.getAnimations({subtree:!0}),s=[],c=0;c<a.length;c++){var f=a[c].effect;f!==null&&f.target===e&&f.pseudoElement===n&&s.push(a[c])}return s},qs.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function d_(e){return{name:e,group:new qs("group",e),imagePair:new qs("image-pair",e),old:new qs("old",e),new:new qs("new",e)}}function ui(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}ui.prototype.addEventListener=function(e,n,a){var s=null,c=null;if(!(a!=null&&typeof a!="boolean"&&(s=a.signal||null,s!==null&&s.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var f=this._eventListeners;if(p_(f,e,n,a)===-1){var _=this,b=n;a!=null&&typeof a!="boolean"&&a.once===!0&&(b=function(L){_.removeEventListener(e,n,a),typeof n=="function"?n.call(this,L):n.handleEvent(L)}),s!==null&&(c=_.removeEventListener.bind(_,e,n,a),s.addEventListener("abort",c,{once:!0}),c=s.removeEventListener.bind(s,"abort",c)),s=qr(a),f.push({type:e,listener:n,optionsOrUseCapture:a,attachedListener:b,cleanup:c}),g(this._fragmentFiber.child,!1,o1,e,b,s)}this._eventListeners=f}};function o1(e,n,a,s){return E(e).addEventListener(n,a,s),!1}ui.prototype.removeEventListener=function(e,n,a){var s=this._eventListeners;if(s!==null&&(n=p_(s,e,n,a),n!==-1)){var c=s[n];a=c.attachedListener;var f=c.cleanup;c=qr(c.optionsOrUseCapture),g(this._fragmentFiber.child,!1,l1,e,a,c),s.splice(n,1),f!==null&&f()}};function l1(e,n,a,s){return E(e).removeEventListener(n,a,s),!1}function qr(e){return e!=null&&typeof e!="boolean"&&(e.once===!0||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function h_(e){return e==null?"c=0":typeof e=="boolean"?"c="+(e?"1":"0"):"c="+(e.capture?"1":"0")}function p_(e,n,a,s){if(e.length===0)return-1;s=h_(s);for(var c=0;c<e.length;c++){var f=e[c];if(f.type===n&&f.listener===a&&h_(f.optionsOrUseCapture)===s)return c}return-1}ui.prototype.dispatchEvent=function(e){var n=S(this._fragmentFiber);if(n===null)return!0;n=E(n);var a=this._eventListeners;if(a!==null&&0<a.length||!e.bubbles){var s=n.nodeType===9?n.createComment(""):document.createTextNode("");if(a)for(var c=0;c<a.length;c++){var f=a[c];s.addEventListener(f.type,f.attachedListener,qr(f.optionsOrUseCapture))}if(n.appendChild(s),e=s.dispatchEvent(e),a)for(c=0;c<a.length;c++)f=a[c],s.removeEventListener(f.type,f.attachedListener,qr(f.optionsOrUseCapture));return n.removeChild(s),e}return n.dispatchEvent(e)},ui.prototype.focus=function(e){g(this._fragmentFiber.child,!0,m_,e,void 0,void 0)};function m_(e,n){return e.tag===6?!1:(e=E(e),y1(e,n))}ui.prototype.focusLast=function(e){var n=[];g(this._fragmentFiber.child,!0,vh,n,void 0,void 0);for(var a=n.length-1;0<=a&&!m_(n[a],e);a--);};function vh(e,n){return n.push(e),!1}ui.prototype.blur=function(){var e=S(this._fragmentFiber);e!==null&&(e=E(e),e=ml(e).activeElement,e!==null&&g(this._fragmentFiber.child,!1,c1,e,void 0,void 0))};function c1(e,n){return e.tag===6?!1:(e=E(e),e===n||e.contains(n)?(n.blur(),!0):!1)}ui.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),g(this._fragmentFiber.child,!1,u1,e,void 0,void 0)};function u1(e,n){return e.tag===6||(e=E(e),n.observe(e)),!1}ui.prototype.unobserveUsing=function(e){var n=this._observers;if(n!==null&&n.has(e)){n.delete(e),g(this._fragmentFiber.child,!1,f1,e,void 0,void 0);for(var a=n=0;a<Ii.length;a++){var s=Ii[a];s.fragmentInstance===this&&s.observer===e?e.unobserve(s.instance):Ii[n++]=s}Ii.length=n}};function f1(e,n){return e.tag===6||(e=E(e),n.unobserve(e)),!1}var Ii=[],_h=!1;function d1(e,n,a){Ii.push({fragmentInstance:e,observer:n,instance:a}),_h||(_h=!0,S1(function(){_h=!1;var s=Ii;Ii=[];for(var c=0;c<s.length;c++){var f=s[c];f.observer.unobserve(f.instance)}}))}ui.prototype.getClientRects=function(){var e=[];return g(this._fragmentFiber.child,!1,h1,e,void 0,void 0),e};function h1(e,n){if(e.tag===6){e=e.stateNode;var a=e.ownerDocument.createRange();a.selectNodeContents(e),n.push.apply(n,a.getClientRects())}else e=E(e),n.push.apply(n,e.getClientRects());return!1}ui.prototype.getRootNode=function(e){var n=S(this._fragmentFiber);return n===null?this:E(n).getRootNode(e)},ui.prototype.compareDocumentPosition=function(e){var n=S(this._fragmentFiber);if(n===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var a=[];g(this._fragmentFiber.child,!1,vh,a,void 0,void 0);var s=E(n);if(a.length===0){if(a=s,y(this._fragmentFiber)){e:{for(n=this._fragmentFiber.return;n!==null;){if(n.tag===4){n=n.stateNode.containerInfo;break e}if(n.tag===3||n.tag===5||n.tag===27)break;n=n.return}n=null}n!=null&&(a=n)}n=this._fragmentFiber;var c=s=a.compareDocumentPosition(e);return a===e?c=Node.DOCUMENT_POSITION_CONTAINS:s&Node.DOCUMENT_POSITION_CONTAINED_BY&&(a=T(n)[1],a===null?c=Node.DOCUMENT_POSITION_PRECEDING:(e=E(a).compareDocumentPosition(e),c=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),c|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}n=E(a[0]),c=E(a[a.length-1]);var f=y(this._fragmentFiber)?n.parentElement:s;if(f==null)return Node.DOCUMENT_POSITION_DISCONNECTED;s=f.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_CONTAINED_BY,f=f.compareDocumentPosition(c)&Node.DOCUMENT_POSITION_CONTAINED_BY;var _=n.compareDocumentPosition(e),b=c.compareDocumentPosition(e),L=_&Node.DOCUMENT_POSITION_CONTAINED_BY||b&Node.DOCUMENT_POSITION_CONTAINED_BY;return b=s&&f&&_&Node.DOCUMENT_POSITION_FOLLOWING&&b&Node.DOCUMENT_POSITION_PRECEDING,n=s&&n===e||f&&c===e||L||b?Node.DOCUMENT_POSITION_CONTAINED_BY:!s&&n===e||!f&&c===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:_,n&Node.DOCUMENT_POSITION_DISCONNECTED||n&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||p1(n,this._fragmentFiber,a[0],a[a.length-1],e)?n:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function p1(e,n,a,s,c){var f=It(c);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(a=!!f)e:{for(;f!==null;){if(f.tag===7&&(f===n||f.alternate===n)){a=!0;break e}f=f.return}a=!1}return a}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(f===null)return f=c.ownerDocument,c===f||c===f.documentElement||c===f.body;e:{for(f=n,n=S(n);f!==null;){if(!(f.tag!==5&&f.tag!==3&&f.tag!==27||f!==n&&f.alternate!==n)){f=!0;break e}f=f.return}f=!1}return f}return e&Node.DOCUMENT_POSITION_PRECEDING?((n=!!f)&&!(n=f===a)&&(n=H(a,f,V),n===null?n=!1:(g(n,!0,I,f,a),f=M,M=null,n=f!==null)),n):e&Node.DOCUMENT_POSITION_FOLLOWING?((n=!!f)&&!(n=f===s)&&(n=H(s,f,V),n===null?n=!1:(g(n,!0,D,f,s),f=M,O=M=null,n=f!==null)),n):!1}function g_(e,n){var a=e.ownerDocument.createRange();a.selectNodeContents(e),e=a.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,n?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}ui.prototype.scrollIntoView=function(e){if(typeof e=="object")throw Error(o(566));var n=[];g(this._fragmentFiber.child,!1,vh,n,void 0,void 0);var a=e!==!1;if(n.length===0){var s=T(this._fragmentFiber);if(s=a?s[1]||s[0]||S(this._fragmentFiber):s[0]||s[1],s===null)return;if(s.tag===6){e=E(s),g_(e,a);return}if(s=E(s),s.nodeType!==9){if(s.nodeType===11){a="host"in s?s.host:null,a!==null&&a.scrollIntoView(e);return}s.scrollIntoView(e)}}for(s=a?n.length-1:0;s!==(a?-1:n.length);){var c=n[s];c.tag===6?(c=E(c),g_(c,a)):E(c).scrollIntoView(e),s+=a?-1:1}};function m1(e,n){return e=E(e),v_(e,n),!1}function v_(e,n){e.reactFragments==null&&(e.reactFragments=new Set),e.reactFragments.add(n)}function __(e,n){var a=n._eventListeners;if(a!==null)for(var s=0;s<a.length;s++){var c=a[s];e.addEventListener(c.type,c.attachedListener,qr(c.optionsOrUseCapture))}e.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(f){for(var _=0,b=0;b<Ii.length;b++){var L=Ii[b];(L.fragmentInstance!==n||L.observer!==f||L.instance!==e)&&(Ii[_++]=L)}Ii.length=_,f.observe(e)}),v_(e,n))}function g1(e,n){var a=n._eventListeners;if(a!==null)for(var s=0;s<a.length;s++){var c=a[s];e.removeEventListener(c.type,c.attachedListener,qr(c.optionsOrUseCapture))}e.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(f){typeof f.rootMargin=="string"?d1(n,f,e):f.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(n))}function xh(e){var n=e.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":xh(a),it(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function v1(e,n,a,s){for(;e.nodeType===1;){var c=a;if(e.nodeName.toLowerCase()!==n.toLowerCase()){if(!s&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(s){if(!e[Pt])switch(n){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(f=e.getAttribute("rel"),f==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(f!==c.rel||e.getAttribute("href")!==(c.href==null||c.href===""?null:c.href)||e.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin)||e.getAttribute("title")!==(c.title==null?null:c.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(f=e.getAttribute("src"),(f!==(c.src==null?null:c.src)||e.getAttribute("type")!==(c.type==null?null:c.type)||e.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin))&&f&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(n==="input"&&e.type==="hidden"){var f=c.name==null?null:""+c.name;if(c.type==="hidden"&&e.getAttribute("name")===f)return e}else return e;if(e=Ti(e.nextSibling),e===null)break}return null}function _1(e,n,a){if(n==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=Ti(e.nextSibling),e===null))return null;return e}function x_(e,n){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Ti(e.nextSibling),e===null))return null;return e}function yh(e){return e.data==="$?"||e.data==="$~"}function Sh(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function x1(e,n){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=n;else if(e.data!=="$?"||a.readyState!=="loading")n();else{var s=function(){n(),a.removeEventListener("DOMContentLoaded",s)};a.addEventListener("DOMContentLoaded",s),e._reactRetry=s}}function Ti(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return e}var Mh=null;function y_(e){e=e.nextSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(n===0)return Ti(e.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}e=e.nextSibling}return null}function S_(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return e;n--}else a!=="/$"&&a!=="/&"||n++}e=e.previousSibling}return null}function y1(e,n){function a(){s=!0}if(e.ownerDocument.activeElement===e)return!0;var s=!1;try{e.ownerDocument.addEventListener("focus",a,!0),(e.focus||HTMLElement.prototype.focus).call(e,n)}finally{e.ownerDocument.removeEventListener("focus",a,!0)}return s}function S1(e){o_(function(){o_(function(n){return e(n)})})}function M_(e,n,a){switch(n=ml(a),e){case"html":if(e=n.documentElement,!e)throw Error(o(452));return e;case"head":if(e=n.head,!e)throw Error(o(453));return e;case"body":if(e=n.body,!e)throw Error(o(454));return e;default:throw Error(o(451))}}function E_(e,n,a){for(var s in a){var c=a[s];a.hasOwnProperty(s)&&c!=null&&kt(e,n,s,null,KM,c)}a.dangerouslySetInnerHTML!=null&&(e.textContent=""),e.onclick===Zi&&(e.onclick=null),it(e)}function Eh(e){for(var n=e.attributes;n.length;)e.removeAttributeNode(n[0]);it(e)}var bi=new Map,T_=new Set;function gl(e){if(typeof e.getRootNode=="function"){var n=e.getRootNode();if(n.nodeType===9||n.nodeType===11)return n}return e.nodeType===9?e:e.ownerDocument}var Aa=je.d;je.d={f:M1,r:E1,D:T1,C:b1,L:A1,m:C1,X:w1,S:R1,M:N1};function M1(){var e=Aa.f(),n=Kc();return e||n}function E1(e){var n=yt(e);n!==null&&n.tag===5&&n.type==="form"?A0(n):Aa.r(e)}var Yr=typeof document>"u"?null:document;function b_(e,n,a){var s=Yr;if(s&&typeof n=="string"&&n){var c=vi(n);c='link[rel="'+e+'"][href="'+c+'"]',typeof a=="string"&&(c+='[crossorigin="'+a+'"]'),T_.has(c)||(T_.add(c),e={rel:e,crossOrigin:a,href:n},s.querySelector(c)===null&&(n=s.createElement("link"),Nn(n,"link",e),Ot(n),s.head.appendChild(n)))}}function T1(e){Aa.D(e),b_("dns-prefetch",e,null)}function b1(e,n){Aa.C(e,n),b_("preconnect",e,n)}function A1(e,n,a){Aa.L(e,n,a);var s=Yr;if(s&&e&&n){var c='link[rel="preload"][as="'+vi(n)+'"]';n==="image"&&a&&a.imageSrcSet?(c+='[imagesrcset="'+vi(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(c+='[imagesizes="'+vi(a.imageSizes)+'"]')):c+='[href="'+vi(e)+'"]';var f=c;switch(n){case"style":f=Wr(e);break;case"script":f=Zr(e)}if(!(bi.has(f)||(e=z({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:e,as:n},a),bi.set(f,e),s.querySelector(c)!==null||n==="style"&&s.querySelector(vl(f))||n==="script"&&s.querySelector(_l(f))))){var _=s.createElement("link");Nn(_,"link",e),n==="style"&&(_[Lt]=!0,_.onload=_.onerror=function(){Ba(_)}),Ot(_),s.head.appendChild(_)}}}function C1(e,n){Aa.m(e,n);var a=Yr;if(a&&e){var s=n&&typeof n.as=="string"?n.as:"script",c='link[rel="modulepreload"][as="'+vi(s)+'"][href="'+vi(e)+'"]',f=c;switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=Zr(e)}if(!bi.has(f)&&(e=z({rel:"modulepreload",href:e},n),bi.set(f,e),a.querySelector(c)===null)){switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(_l(f)))return}s=a.createElement("link"),Nn(s,"link",e),Ot(s),a.head.appendChild(s)}}}function R1(e,n,a){Aa.S(e,n,a);var s=Yr;if(s&&e){var c=ni(s).hoistableStyles,f=Wr(e);n=n||"default";var _=c.get(f);if(!_){var b={loading:0,preload:null};if(_=s.querySelector(vl(f)))b.loading=5;else{e=z({rel:"stylesheet",href:e,"data-precedence":n},a),(a=bi.get(f))&&Th(e,a);var L=_=s.createElement("link");Ot(L),Nn(L,"link",e),L._p=new Promise(function(K,oe){L.onload=K,L.onerror=oe}),L.addEventListener("load",function(){b.loading|=1}),L.addEventListener("error",function(){b.loading|=2}),b.loading|=4,iu(_,n,s)}_={type:"stylesheet",instance:_,count:1,state:b},c.set(f,_)}}}function w1(e,n){Aa.X(e,n);var a=Yr;if(a&&e){var s=ni(a).hoistableScripts,c=Zr(e),f=s.get(c);f||(f=a.querySelector(_l(c)),f||(e=z({src:e,async:!0},n),(n=bi.get(c))&&bh(e,n),f=a.createElement("script"),Ot(f),Nn(f,"link",e),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},s.set(c,f))}}function N1(e,n){Aa.M(e,n);var a=Yr;if(a&&e){var s=ni(a).hoistableScripts,c=Zr(e),f=s.get(c);f||(f=a.querySelector(_l(c)),f||(e=z({src:e,async:!0,type:"module"},n),(n=bi.get(c))&&bh(e,n),f=a.createElement("script"),Ot(f),Nn(f,"link",e),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},s.set(c,f))}}function A_(e,n,a,s){var c=(c=gt.current)?gl(c):null;if(!c)throw Error(o(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(a=Wr(a.href),n=ni(c).hoistableStyles,s=n.get(a),s||(s={type:"style",instance:null,count:0,state:null},n.set(a,s)),s):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=Wr(a.href);var f=ni(c).hoistableStyles,_=f.get(e);if(_||(c=c.ownerDocument||c,_={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(e,_),(f=c.querySelector(vl(e)))?f._p||(_.instance=f,_.state.loading=5):(f=bi.get(e),f||(f={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},bi.set(e,f)),D1(c,e,f,_.state))),n&&s===null)throw Error(o(528,""));return _}if(n&&s!==null)throw Error(o(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(a=Zr(a),n=ni(c).hoistableScripts,s=n.get(a),s||(s={type:"script",instance:null,count:0,state:null},n.set(a,s)),s):{type:"void",instance:null,count:0,state:null};default:throw Error(o(444,e))}}function Wr(e){return'href="'+vi(e)+'"'}function vl(e){return'link[rel="stylesheet"]['+e+"]"}function C_(e){return z({},e,{"data-precedence":e.precedence,precedence:null})}function D1(e,n,a,s){if(n=e.querySelector('link[rel="preload"][as="style"]['+n+"]")){if(n[Lt]!==!0){s.loading=1;return}}else n=e.createElement("link"),n[Lt]=!0,n.onload=n.onerror=Ba.bind(null,n),Nn(n,"link",a),Ot(n),e.head.appendChild(n);s.preload=n,n.addEventListener("load",function(){return s.loading|=1}),n.addEventListener("error",function(){return s.loading|=2})}function Zr(e){return'[src="'+vi(e)+'"]'}function _l(e){return"script[async]"+e}function R_(e,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var s=e.querySelector('style[data-href~="'+vi(a.href)+'"]');if(s)return n.instance=s,Ot(s),s;var c=z({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return s=(e.ownerDocument||e).createElement("style"),Ot(s),Nn(s,"style",c),iu(s,a.precedence,e),n.instance=s;case"stylesheet":c=Wr(a.href);var f=e.querySelector(vl(c));if(f)return n.state.loading|=4,n.instance=f,Ot(f),f;s=C_(a),(c=bi.get(c))&&Th(s,c),f=(e.ownerDocument||e).createElement("link"),Ot(f);var _=f;return _._p=new Promise(function(b,L){_.onload=b,_.onerror=L}),Nn(f,"link",s),n.state.loading|=4,iu(f,a.precedence,e),n.instance=f;case"script":return f=Zr(a.src),(c=e.querySelector(_l(f)))?(n.instance=c,Ot(c),c):(s=a,(c=bi.get(f))&&(s=z({},a),bh(s,c)),e=e.ownerDocument||e,c=e.createElement("script"),Ot(c),Nn(c,"link",s),e.head.appendChild(c),n.instance=c);case"void":return null;default:throw Error(o(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(s=n.instance,n.state.loading|=4,iu(s,a.precedence,e));return n.instance}function iu(e,n,a){for(var s=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),c=s.length?s[s.length-1]:null,f=c,_=0;_<s.length;_++){var b=s[_];if(b.dataset.precedence===n)f=b;else if(f!==c)break}f?f.parentNode.insertBefore(e,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(e,n.firstChild))}function Th(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.title==null&&(e.title=n.title)}function bh(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.integrity==null&&(e.integrity=n.integrity)}var au=null;function w_(e,n,a){if(au===null){var s=new Map,c=au=new Map;c.set(a,s)}else c=au,s=c.get(a),s||(s=new Map,c.set(a,s));if(s.has(e))return s;for(s.set(e,null),a=a.getElementsByTagName(e),c=0;c<a.length;c++){var f=a[c];if(!(f[Pt]||f[Ue]||e==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var _=f.getAttribute(n)||"";_=e+_;var b=s.get(_);b?b.push(f):s.set(_,[f])}}return s}function Ah(e,n,a){e=e.ownerDocument||e,e.head.insertBefore(a,n==="title"?e.querySelector("head > title"):null)}function U1(e,n,a){if(a===1||n.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;switch(n.rel){case"stylesheet":return e=n.disabled,typeof n.precedence=="string"&&e==null;default:return!0}case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function N_(e,n){return e==="img"&&n.src!=null&&n.src!==""&&n.onLoad==null&&n.loading!=="lazy"}function D_(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function U_(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function L_(e,n){typeof n.decode=="function"&&(e.imgCount++,n.complete||(e.imgBytes+=U_(n),e.suspenseyImages.push(n)),e=z1.bind(e),n.decode().then(e,e))}function L1(e,n,a,s){if(a.type==="stylesheet"&&(typeof s.media!="string"||matchMedia(s.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var c=Wr(s.href),f=n.querySelector(vl(c));if(f){n=f._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(e.count++,e=xl.bind(e),n.then(e,e)),a.state.loading|=4,a.instance=f,Ot(f);return}f=n.ownerDocument||n,s=C_(s),(c=bi.get(c))&&Th(s,c),f=f.createElement("link"),Ot(f);var _=f;_._p=new Promise(function(b,L){_.onload=b,_.onerror=L}),Nn(f,"link",s),a.instance=f}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=xl.bind(e),n.addEventListener("load",a),n.addEventListener("error",a))}}var su=0;function O1(e,n){return e.stylesheets&&e.count===0&&ou(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var s=setTimeout(function(){if(e.stylesheets&&ou(e,e.stylesheets),e.unsuspend){var f=e.unsuspend;e.unsuspend=null,f()}},6e4+n);0<e.imgBytes&&su===0&&(su=62500*JM());var c=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&ou(e,e.stylesheets),e.unsuspend)){var f=e.unsuspend;e.unsuspend=null,f()}},(e.imgBytes>su?50:800)+n);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(s),clearTimeout(c)}}:null}function O_(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)ou(e,e.stylesheets);else if(e.unsuspend){var n=e.unsuspend;e.unsuspend=null,n()}}}function xl(){this.count--,O_(this)}function z1(){this.imgCount--,O_(this)}var ru=null;function ou(e,n){e.stylesheets=null,e.unsuspend!==null&&(e.count++,ru=new Map,n.forEach(P1,e),ru=null,xl.call(e))}function P1(e,n){if(!(n.state.loading&4)){var a=ru.get(e);if(a)var s=a.get(null);else{a=new Map,ru.set(e,a);for(var c=e.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<c.length;f++){var _=c[f];(_.nodeName==="LINK"||_.getAttribute("media")!=="not all")&&(a.set(_.dataset.precedence,_),s=_)}s&&a.set(null,s)}c=n.instance,_=c.getAttribute("data-precedence"),f=a.get(_)||s,f===s&&a.set(null,c),a.set(_,c),this.count++,s=xl.bind(this),c.addEventListener("load",s),c.addEventListener("error",s),f?f.parentNode.insertBefore(c,f.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(c,e.firstChild)),n.state.loading|=4}}var Kr={$$typeof:fe,Provider:null,Consumer:null,_currentValue:P,_currentValue2:P,_threadCount:0};function I1(e,n,a,s,c,f,_,b,L){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Oo(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Oo(0),this.hiddenUpdates=Oo(null),this.identifierPrefix=s,this.onUncaughtError=c,this.onCaughtError=f,this.onRecoverableError=_,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=L,this.transitionTypes=null,this.incompleteTransitions=new Map}function z_(e,n,a,s,c,f,_,b,L,K,oe,_e){return e=new I1(e,n,a,_,L,K,oe,_e,b),n=1,f===!0&&(n|=24),f=Wn(3,null,null,n),e.current=f,f.stateNode=e,n=Gf(),n.refCount++,e.pooledCache=n,n.refCount++,f.memoizedState={element:s,isDehydrated:a,cache:n},Xf(f),e}function P_(e){return e?(e=Mr,e):Mr}function I_(e,n,a,s,c,f){c=P_(c),s.context===null?s.context=c:s.pendingContext=c,s=Ya(n),s.payload={element:a},f=f===void 0?null:f,f!==null&&(s.callback=f),a=Wa(e,s,n),a!==null&&(Jn(a,e,n),Ko(a,e,n))}function B_(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<n?a:n}}function Ch(e,n){B_(e,n),(e=e.alternate)&&B_(e,n)}function F_(e){if(e.tag===13||e.tag===31){var n=ws(e,67108864);n!==null&&Jn(n,e,67108864),Ch(e,67108864)}}function H_(e){if(e.tag===13||e.tag===31){var n=ci();n=ue(n);var a=ws(e,n);a!==null&&Jn(a,e,n),Ch(e,n)}}var Qr=!0;function B1(e,n,a,s){var c=de.T;de.T=null;var f=je.p;try{je.p=2,Rh(e,n,a,s)}finally{je.p=f,de.T=c}}function F1(e,n,a,s){var c=de.T;de.T=null;var f=je.p;try{je.p=8,Rh(e,n,a,s)}finally{je.p=f,de.T=c}}function Rh(e,n,a,s){if(Qr){var c=wh(s);if(c===null)ch(e,n,s,lu,a),V_(e,s);else if(G1(c,e,n,a,s))s.stopPropagation();else if(V_(e,s),n&4&&-1<H1.indexOf(e)){for(;c!==null;){var f=yt(c);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var _=gi(f.pendingLanes);if(_!==0){var b=f;for(b.pendingLanes|=2,b.entangledLanes|=2;_;){var L=1<<31-On(_);b.entanglements[1]|=L,_&=~L}sa(f),(Bt&6)===0&&(Yc=j()+500,dl(0))}}break;case 31:case 13:b=ws(f,2),b!==null&&Jn(b,f,2),Kc(),Ch(f,2)}if(f=wh(s),f===null&&ch(e,n,s,lu,a),f===c)break;c=f}c!==null&&s.stopPropagation()}else ch(e,n,s,null,a)}}function wh(e){return e=pf(e),Nh(e)}var lu=null;function Nh(e){if(lu=null,e=It(e),e!==null){var n=u(e);if(n===null)e=null;else{var a=n.tag;if(a===13){if(e=d(n),e!==null)return e;e=null}else if(a===31){if(e=h(n),e!==null)return e;e=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null)}}return lu=e,null}function G_(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Ce()){case Le:return 2;case qe:return 8;case Te:case ye:return 32;case Ke:return 268435456;default:return 32}default:return 32}}var Dh=!1,rs=null,os=null,ls=null,yl=new Map,Sl=new Map,cs=[],H1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function V_(e,n){switch(e){case"focusin":case"focusout":rs=null;break;case"dragenter":case"dragleave":os=null;break;case"mouseover":case"mouseout":ls=null;break;case"pointerover":case"pointerout":yl.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Sl.delete(n.pointerId)}}function Ml(e,n,a,s,c,f){return e===null||e.nativeEvent!==f?(e={blockedOn:n,domEventName:a,eventSystemFlags:s,nativeEvent:f,targetContainers:[c]},n!==null&&(n=yt(n),n!==null&&F_(n)),e):(e.eventSystemFlags|=s,n=e.targetContainers,c!==null&&n.indexOf(c)===-1&&n.push(c),e)}function G1(e,n,a,s,c){switch(n){case"focusin":return rs=Ml(rs,e,n,a,s,c),!0;case"dragenter":return os=Ml(os,e,n,a,s,c),!0;case"mouseover":return ls=Ml(ls,e,n,a,s,c),!0;case"pointerover":var f=c.pointerId;return yl.set(f,Ml(yl.get(f)||null,e,n,a,s,c)),!0;case"gotpointercapture":return f=c.pointerId,Sl.set(f,Ml(Sl.get(f)||null,e,n,a,s,c)),!0}return!1}function j_(e){var n=It(e.target);if(n!==null){var a=u(n);if(a!==null){if(n=a.tag,n===13){if(n=d(a),n!==null){e.blockedOn=n,Fe(e.priority,function(){H_(a)});return}}else if(n===31){if(n=h(a),n!==null){e.blockedOn=n,Fe(e.priority,function(){H_(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function cu(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var a=wh(e.nativeEvent);if(a===null){a=e.nativeEvent;var s=new a.constructor(a.type,a);hf=s,a.target.dispatchEvent(s),hf=null}else return n=yt(a),n!==null&&F_(n),e.blockedOn=a,!1;n.shift()}return!0}function k_(e,n,a){cu(e)&&a.delete(n)}function V1(){Dh=!1,rs!==null&&cu(rs)&&(rs=null),os!==null&&cu(os)&&(os=null),ls!==null&&cu(ls)&&(ls=null),yl.forEach(k_),Sl.forEach(k_)}function uu(e,n){e.blockedOn===n&&(e.blockedOn=null,Dh||(Dh=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,V1)))}var fu=null;function X_(e){fu!==e&&(fu=e,r.unstable_scheduleCallback(r.unstable_NormalPriority,function(){fu===e&&(fu=null);for(var n=0;n<e.length;n+=3){var a=e[n],s=e[n+1],c=e[n+2];if(typeof s!="function"){if(Nh(s||a)===null)continue;break}var f=yt(a);f!==null&&(e.splice(n,3),n-=3,dd(f,{pending:!0,data:c,method:a.method,action:s},s,c))}}))}function Jr(e){function n(L){return uu(L,e)}rs!==null&&uu(rs,e),os!==null&&uu(os,e),ls!==null&&uu(ls,e),yl.forEach(n),Sl.forEach(n);for(var a=0;a<cs.length;a++){var s=cs[a];s.blockedOn===e&&(s.blockedOn=null)}for(;0<cs.length&&(a=cs[0],a.blockedOn===null);)j_(a),a.blockedOn===null&&cs.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(s=0;s<a.length;s+=3){var c=a[s],f=a[s+1],_=c[We]||null;if(typeof f=="function")_||X_(a);else if(_){var b=null;if(f&&f.hasAttribute("formAction")){if(c=f,_=f[We]||null)b=_.formAction;else if(Nh(c)!==null)continue}else b=_.action;typeof b=="function"?a[s+1]=b:(a.splice(s,3),s-=3),X_(a)}}}function q_(){function e(f){f.canIntercept&&f.info==="react-transition"&&f.intercept({handler:function(){return new Promise(function(_){return c=_})},focusReset:"manual",scroll:"manual"})}function n(){c!==null&&(c(),c=null),s||setTimeout(a,20)}function a(){if(!s&&!navigation.transition){var f=navigation.currentEntry;f&&f.url!=null&&navigation.navigate(f.url,{state:f.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var s=!1,c=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){s=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),c!==null&&(c(),c=null)}}}function Uh(e){this._internalRoot=e}du.prototype.render=Uh.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(o(409));var a=n.current,s=ci();I_(a,s,e,n,null,null)},du.prototype.unmount=Uh.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;I_(e.current,2,null,e,null,null),Kc(),n[st]=null}};function du(e){this._internalRoot=e}du.prototype.unstable_scheduleHydration=function(e){if(e){var n=be();e={blockedOn:null,target:e,priority:n};for(var a=0;a<cs.length&&n!==0&&n<cs[a].priority;a++);cs.splice(a,0,e),a===0&&j_(e)}};var Y_=t.version;if(Y_!=="19.3.1")throw Error(o(527,Y_,"19.3.1"));je.findDOMNode=function(e){var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(o(188)):(e=Object.keys(e).join(","),Error(o(268,e)));return e=v(n),e=e!==null?x(e):null,e=e===null?null:e.stateNode,e};var j1={bundleType:0,version:"19.3.1",rendererPackageName:"react-dom",currentDispatcherRef:de,reconcilerVersion:"19.3.1"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var hu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!hu.isDisabled&&hu.supportsFiber)try{bt=hu.inject(j1),tn=hu}catch{}}return Tl.createRoot=function(e,n){if(!l(e))throw Error(o(299));var a=!1,s="",c=P0,f=I0,_=B0;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onUncaughtError!==void 0&&(c=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(_=n.onRecoverableError)),n=z_(e,1,!1,null,null,a,s,null,c,f,_,q_),e[st]=n.current,lh(e),new Uh(n)},Tl.hydrateRoot=function(e,n,a){if(!l(e))throw Error(o(299));var s=!1,c="",f=P0,_=I0,b=B0,L=null;return a!=null&&(a.unstable_strictMode===!0&&(s=!0),a.identifierPrefix!==void 0&&(c=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(_=a.onCaughtError),a.onRecoverableError!==void 0&&(b=a.onRecoverableError),a.formState!==void 0&&(L=a.formState)),n=z_(e,1,!0,n,a??null,s,c,L,f,_,b,q_),n.context=P_(null),a=n.current,s=ci(),s=ue(s),c=Ya(s),c.callback=null,Wa(a,c,s),a=s,n.current.lanes=a,As(n,a),sa(n),e[st]=n.current,lh(e),new du(n)},Tl.version="19.3.1",Tl}var ix;function eE(){if(ix)return zh.exports;ix=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(t){console.error(t)}}return r(),zh.exports=$1(),zh.exports}var tE=eE();const nE=my(tE);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iE=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),gy=(...r)=>r.filter((t,i,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===i).join(" ").trim();/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var aE={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sE=dt.forwardRef(({color:r="currentColor",size:t=24,strokeWidth:i=2,absoluteStrokeWidth:o,className:l="",children:u,iconNode:d,...h},m)=>dt.createElement("svg",{ref:m,...aE,width:t,height:t,stroke:r,strokeWidth:o?Number(i)*24/Number(t):i,className:gy("lucide",l),...h},[...d.map(([v,x])=>dt.createElement(v,x)),...Array.isArray(u)?u:[u]]));/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nt=(r,t)=>{const i=dt.forwardRef(({className:o,...l},u)=>dt.createElement(sE,{ref:u,iconNode:t,className:gy(`lucide-${iE(r)}`,o),...l}));return i.displayName=`${r}`,i};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rE=Nt("ArrowDownLeft",[["path",{d:"M17 7 7 17",key:"15tmo1"}],["path",{d:"M17 17H7V7",key:"1org7z"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ys=Nt("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oE=Nt("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ax=Nt("Bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lE=Nt("BookOpen",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _s=Nt("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sr=Nt("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cE=Nt("CircleHelp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ll=Nt("Clock3",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16.5 12",key:"1aq6pp"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tm=Nt("Coins",[["circle",{cx:"8",cy:"8",r:"6",key:"3yglwk"}],["path",{d:"M18.09 10.37A6 6 0 1 1 10.34 18",key:"t5s6rm"}],["path",{d:"M7 6h1v4",key:"1obek4"}],["path",{d:"m16.71 13.88.7.71-2.82 2.82",key:"1rbuyh"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ap=Nt("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bm=Nt("FileCheck2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",key:"1pf5j1"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"m3 15 2 2 4-4",key:"1lhrkk"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cp=Nt("Fingerprint",[["path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",key:"1nerag"}],["path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88",key:"o46ks0"}],["path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02",key:"ptglia"}],["path",{d:"M2 12a10 10 0 0 1 18-6",key:"ydlgp0"}],["path",{d:"M2 16h.01",key:"1gqxmh"}],["path",{d:"M21.8 16c.2-2 .131-5.354 0-6",key:"drycrb"}],["path",{d:"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",key:"1tidbn"}],["path",{d:"M8.65 22c.21-.66.45-1.32.57-2",key:"13wd9y"}],["path",{d:"M9 6.8a6 6 0 0 1 9 5.2v2",key:"1fr1j5"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sx=Nt("Flag",[["path",{d:"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z",key:"i9b6wo"}],["line",{x1:"4",x2:"4",y1:"22",y2:"15",key:"1cm3nv"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rx=Nt("LayoutGrid",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fh=Nt("Leaf",[["path",{d:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",key:"nnexq3"}],["path",{d:"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",key:"mt58a7"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uE=Nt("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hh=Nt("Minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ox=Nt("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cr=Nt("Package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["path",{d:"m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7",key:"yx3hmr"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fE=Nt("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gh=Nt("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dE=Nt("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qu=Nt("ScanLine",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["path",{d:"M7 12h10",key:"b7w52i"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lx=Nt("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vh=Nt("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vy=Nt("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cx=Nt("Store",[["path",{d:"m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7",key:"ztvudi"}],["path",{d:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",key:"1b2hhj"}],["path",{d:"M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4",key:"2ebpfo"}],["path",{d:"M2 7h20",key:"1fcdvo"}],["path",{d:"M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7",key:"6c3vgh"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jh=Nt("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hE=Nt("TrendingDown",[["polyline",{points:"22 17 13.5 8.5 8.5 13.5 2 7",key:"1r2t7k"}],["polyline",{points:"16 17 22 17 22 11",key:"11uiuu"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ux=Nt("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pE=Nt("Volume2",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mE=Nt("VolumeX",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hu=Nt("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gu=Nt("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Am="180",gE=0,fx=1,vE=2,_y=1,_E=2,Ua=3,Ms=0,ti=1,oa=2,Oa=0,vo=1,Rp=2,dx=3,hx=4,xE=5,ir=100,yE=101,SE=102,ME=103,EE=104,TE=200,bE=201,AE=202,CE=203,wp=204,Np=205,RE=206,wE=207,NE=208,DE=209,UE=210,LE=211,OE=212,zE=213,PE=214,Dp=0,Up=1,Lp=2,Mo=3,Op=4,zp=5,Pp=6,Ip=7,xy=0,IE=1,BE=2,ys=0,yy=1,Sy=2,My=3,Cm=4,Ey=5,Ty=6,by=7,Ay=300,Eo=301,To=302,Bp=303,Fp=304,nf=306,Hp=1e3,rr=1001,Gp=1002,Ni=1003,FE=1004,pu=1005,ji=1006,kh=1007,or=1008,ca=1009,Cy=1010,Ry=1011,Ol=1012,Rm=1013,fr=1014,La=1015,za=1016,wm=1017,Nm=1018,zl=1020,wy=35902,Ny=35899,Dy=1021,Uy=1022,ki=1023,Pl=1026,Il=1027,Ly=1028,Dm=1029,Oy=1030,Um=1031,Lm=1033,Vu=33776,ju=33777,ku=33778,Xu=33779,Vp=35840,jp=35841,kp=35842,Xp=35843,qp=36196,Yp=37492,Wp=37496,Zp=37808,Kp=37809,Qp=37810,Jp=37811,$p=37812,em=37813,tm=37814,nm=37815,im=37816,am=37817,sm=37818,rm=37819,om=37820,lm=37821,cm=36492,um=36494,fm=36495,dm=36283,hm=36284,pm=36285,mm=36286,HE=3200,GE=3201,zy=0,VE=1,xs="",ei="srgb",bo="srgb-linear",Ju="linear",Xt="srgb",$r=7680,px=519,jE=512,kE=513,XE=514,Py=515,qE=516,YE=517,WE=518,ZE=519,mx=35044,gx="300 es",la=2e3,$u=2001;class Ro{addEventListener(t,i){this._listeners===void 0&&(this._listeners={});const o=this._listeners;o[t]===void 0&&(o[t]=[]),o[t].indexOf(i)===-1&&o[t].push(i)}hasEventListener(t,i){const o=this._listeners;return o===void 0?!1:o[t]!==void 0&&o[t].indexOf(i)!==-1}removeEventListener(t,i){const o=this._listeners;if(o===void 0)return;const l=o[t];if(l!==void 0){const u=l.indexOf(i);u!==-1&&l.splice(u,1)}}dispatchEvent(t){const i=this._listeners;if(i===void 0)return;const o=i[t.type];if(o!==void 0){t.target=this;const l=o.slice(0);for(let u=0,d=l.length;u<d;u++)l[u].call(this,t);t.target=null}}}const In=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Xh=Math.PI/180,gm=180/Math.PI;function Gl(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0,o=Math.random()*4294967295|0;return(In[r&255]+In[r>>8&255]+In[r>>16&255]+In[r>>24&255]+"-"+In[t&255]+In[t>>8&255]+"-"+In[t>>16&15|64]+In[t>>24&255]+"-"+In[i&63|128]+In[i>>8&255]+"-"+In[i>>16&255]+In[i>>24&255]+In[o&255]+In[o>>8&255]+In[o>>16&255]+In[o>>24&255]).toLowerCase()}function wt(r,t,i){return Math.max(t,Math.min(i,r))}function KE(r,t){return(r%t+t)%t}function qh(r,t,i){return(1-i)*r+i*t}function bl(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function $n(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}class ft{constructor(t=0,i=0){ft.prototype.isVector2=!0,this.x=t,this.y=i}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,i){return this.x=t,this.y=i,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const i=this.x,o=this.y,l=t.elements;return this.x=l[0]*i+l[3]*o+l[6],this.y=l[1]*i+l[4]*o+l[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,i){return this.x=wt(this.x,t.x,i.x),this.y=wt(this.y,t.y,i.y),this}clampScalar(t,i){return this.x=wt(this.x,t,i),this.y=wt(this.y,t,i),this}clampLength(t,i){const o=this.length();return this.divideScalar(o||1).multiplyScalar(wt(o,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const o=this.dot(t)/i;return Math.acos(wt(o,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,o=this.y-t.y;return i*i+o*o}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this}lerpVectors(t,i,o){return this.x=t.x+(i.x-t.x)*o,this.y=t.y+(i.y-t.y)*o,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this}rotateAround(t,i){const o=Math.cos(i),l=Math.sin(i),u=this.x-t.x,d=this.y-t.y;return this.x=u*o-d*l+t.x,this.y=u*l+d*o+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Vl{constructor(t=0,i=0,o=0,l=1){this.isQuaternion=!0,this._x=t,this._y=i,this._z=o,this._w=l}static slerpFlat(t,i,o,l,u,d,h){let m=o[l+0],v=o[l+1],x=o[l+2],g=o[l+3];const S=u[d+0],y=u[d+1],T=u[d+2],C=u[d+3];if(h===0){t[i+0]=m,t[i+1]=v,t[i+2]=x,t[i+3]=g;return}if(h===1){t[i+0]=S,t[i+1]=y,t[i+2]=T,t[i+3]=C;return}if(g!==C||m!==S||v!==y||x!==T){let E=1-h;const M=m*S+v*y+x*T+g*C,O=M>=0?1:-1,I=1-M*M;if(I>Number.EPSILON){const V=Math.sqrt(I),H=Math.atan2(V,M*O);E=Math.sin(E*H)/V,h=Math.sin(h*H)/V}const D=h*O;if(m=m*E+S*D,v=v*E+y*D,x=x*E+T*D,g=g*E+C*D,E===1-h){const V=1/Math.sqrt(m*m+v*v+x*x+g*g);m*=V,v*=V,x*=V,g*=V}}t[i]=m,t[i+1]=v,t[i+2]=x,t[i+3]=g}static multiplyQuaternionsFlat(t,i,o,l,u,d){const h=o[l],m=o[l+1],v=o[l+2],x=o[l+3],g=u[d],S=u[d+1],y=u[d+2],T=u[d+3];return t[i]=h*T+x*g+m*y-v*S,t[i+1]=m*T+x*S+v*g-h*y,t[i+2]=v*T+x*y+h*S-m*g,t[i+3]=x*T-h*g-m*S-v*y,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,i,o,l){return this._x=t,this._y=i,this._z=o,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,i=!0){const o=t._x,l=t._y,u=t._z,d=t._order,h=Math.cos,m=Math.sin,v=h(o/2),x=h(l/2),g=h(u/2),S=m(o/2),y=m(l/2),T=m(u/2);switch(d){case"XYZ":this._x=S*x*g+v*y*T,this._y=v*y*g-S*x*T,this._z=v*x*T+S*y*g,this._w=v*x*g-S*y*T;break;case"YXZ":this._x=S*x*g+v*y*T,this._y=v*y*g-S*x*T,this._z=v*x*T-S*y*g,this._w=v*x*g+S*y*T;break;case"ZXY":this._x=S*x*g-v*y*T,this._y=v*y*g+S*x*T,this._z=v*x*T+S*y*g,this._w=v*x*g-S*y*T;break;case"ZYX":this._x=S*x*g-v*y*T,this._y=v*y*g+S*x*T,this._z=v*x*T-S*y*g,this._w=v*x*g+S*y*T;break;case"YZX":this._x=S*x*g+v*y*T,this._y=v*y*g+S*x*T,this._z=v*x*T-S*y*g,this._w=v*x*g-S*y*T;break;case"XZY":this._x=S*x*g-v*y*T,this._y=v*y*g-S*x*T,this._z=v*x*T+S*y*g,this._w=v*x*g+S*y*T;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+d)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,i){const o=i/2,l=Math.sin(o);return this._x=t.x*l,this._y=t.y*l,this._z=t.z*l,this._w=Math.cos(o),this._onChangeCallback(),this}setFromRotationMatrix(t){const i=t.elements,o=i[0],l=i[4],u=i[8],d=i[1],h=i[5],m=i[9],v=i[2],x=i[6],g=i[10],S=o+h+g;if(S>0){const y=.5/Math.sqrt(S+1);this._w=.25/y,this._x=(x-m)*y,this._y=(u-v)*y,this._z=(d-l)*y}else if(o>h&&o>g){const y=2*Math.sqrt(1+o-h-g);this._w=(x-m)/y,this._x=.25*y,this._y=(l+d)/y,this._z=(u+v)/y}else if(h>g){const y=2*Math.sqrt(1+h-o-g);this._w=(u-v)/y,this._x=(l+d)/y,this._y=.25*y,this._z=(m+x)/y}else{const y=2*Math.sqrt(1+g-o-h);this._w=(d-l)/y,this._x=(u+v)/y,this._y=(m+x)/y,this._z=.25*y}return this._onChangeCallback(),this}setFromUnitVectors(t,i){let o=t.dot(i)+1;return o<1e-8?(o=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=o):(this._x=0,this._y=-t.z,this._z=t.y,this._w=o)):(this._x=t.y*i.z-t.z*i.y,this._y=t.z*i.x-t.x*i.z,this._z=t.x*i.y-t.y*i.x,this._w=o),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(wt(this.dot(t),-1,1)))}rotateTowards(t,i){const o=this.angleTo(t);if(o===0)return this;const l=Math.min(1,i/o);return this.slerp(t,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,i){const o=t._x,l=t._y,u=t._z,d=t._w,h=i._x,m=i._y,v=i._z,x=i._w;return this._x=o*x+d*h+l*v-u*m,this._y=l*x+d*m+u*h-o*v,this._z=u*x+d*v+o*m-l*h,this._w=d*x-o*h-l*m-u*v,this._onChangeCallback(),this}slerp(t,i){if(i===0)return this;if(i===1)return this.copy(t);const o=this._x,l=this._y,u=this._z,d=this._w;let h=d*t._w+o*t._x+l*t._y+u*t._z;if(h<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,h=-h):this.copy(t),h>=1)return this._w=d,this._x=o,this._y=l,this._z=u,this;const m=1-h*h;if(m<=Number.EPSILON){const y=1-i;return this._w=y*d+i*this._w,this._x=y*o+i*this._x,this._y=y*l+i*this._y,this._z=y*u+i*this._z,this.normalize(),this}const v=Math.sqrt(m),x=Math.atan2(v,h),g=Math.sin((1-i)*x)/v,S=Math.sin(i*x)/v;return this._w=d*g+this._w*S,this._x=o*g+this._x*S,this._y=l*g+this._y*S,this._z=u*g+this._z*S,this._onChangeCallback(),this}slerpQuaternions(t,i,o){return this.copy(t).slerp(i,o)}random(){const t=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),o=Math.random(),l=Math.sqrt(1-o),u=Math.sqrt(o);return this.set(l*Math.sin(t),l*Math.cos(t),u*Math.sin(i),u*Math.cos(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,i=0){return this._x=t[i],this._y=t[i+1],this._z=t[i+2],this._w=t[i+3],this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._w,t}fromBufferAttribute(t,i){return this._x=t.getX(i),this._y=t.getY(i),this._z=t.getZ(i),this._w=t.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class ne{constructor(t=0,i=0,o=0){ne.prototype.isVector3=!0,this.x=t,this.y=i,this.z=o}set(t,i,o){return o===void 0&&(o=this.z),this.x=t,this.y=i,this.z=o,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}applyEuler(t){return this.applyQuaternion(vx.setFromEuler(t))}applyAxisAngle(t,i){return this.applyQuaternion(vx.setFromAxisAngle(t,i))}applyMatrix3(t){const i=this.x,o=this.y,l=this.z,u=t.elements;return this.x=u[0]*i+u[3]*o+u[6]*l,this.y=u[1]*i+u[4]*o+u[7]*l,this.z=u[2]*i+u[5]*o+u[8]*l,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const i=this.x,o=this.y,l=this.z,u=t.elements,d=1/(u[3]*i+u[7]*o+u[11]*l+u[15]);return this.x=(u[0]*i+u[4]*o+u[8]*l+u[12])*d,this.y=(u[1]*i+u[5]*o+u[9]*l+u[13])*d,this.z=(u[2]*i+u[6]*o+u[10]*l+u[14])*d,this}applyQuaternion(t){const i=this.x,o=this.y,l=this.z,u=t.x,d=t.y,h=t.z,m=t.w,v=2*(d*l-h*o),x=2*(h*i-u*l),g=2*(u*o-d*i);return this.x=i+m*v+d*g-h*x,this.y=o+m*x+h*v-u*g,this.z=l+m*g+u*x-d*v,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const i=this.x,o=this.y,l=this.z,u=t.elements;return this.x=u[0]*i+u[4]*o+u[8]*l,this.y=u[1]*i+u[5]*o+u[9]*l,this.z=u[2]*i+u[6]*o+u[10]*l,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,i){return this.x=wt(this.x,t.x,i.x),this.y=wt(this.y,t.y,i.y),this.z=wt(this.z,t.z,i.z),this}clampScalar(t,i){return this.x=wt(this.x,t,i),this.y=wt(this.y,t,i),this.z=wt(this.z,t,i),this}clampLength(t,i){const o=this.length();return this.divideScalar(o||1).multiplyScalar(wt(o,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this}lerpVectors(t,i,o){return this.x=t.x+(i.x-t.x)*o,this.y=t.y+(i.y-t.y)*o,this.z=t.z+(i.z-t.z)*o,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,i){const o=t.x,l=t.y,u=t.z,d=i.x,h=i.y,m=i.z;return this.x=l*m-u*h,this.y=u*d-o*m,this.z=o*h-l*d,this}projectOnVector(t){const i=t.lengthSq();if(i===0)return this.set(0,0,0);const o=t.dot(this)/i;return this.copy(t).multiplyScalar(o)}projectOnPlane(t){return Yh.copy(this).projectOnVector(t),this.sub(Yh)}reflect(t){return this.sub(Yh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const o=this.dot(t)/i;return Math.acos(wt(o,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,o=this.y-t.y,l=this.z-t.z;return i*i+o*o+l*l}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,i,o){const l=Math.sin(i)*t;return this.x=l*Math.sin(o),this.y=Math.cos(i)*t,this.z=l*Math.cos(o),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,i,o){return this.x=t*Math.sin(i),this.y=o,this.z=t*Math.cos(i),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(t){const i=this.setFromMatrixColumn(t,0).length(),o=this.setFromMatrixColumn(t,1).length(),l=this.setFromMatrixColumn(t,2).length();return this.x=i,this.y=o,this.z=l,this}setFromMatrixColumn(t,i){return this.fromArray(t.elements,i*4)}setFromMatrix3Column(t,i){return this.fromArray(t.elements,i*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,i=Math.random()*2-1,o=Math.sqrt(1-i*i);return this.x=o*Math.cos(t),this.y=i,this.z=o*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Yh=new ne,vx=new Vl;class vt{constructor(t,i,o,l,u,d,h,m,v){vt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,i,o,l,u,d,h,m,v)}set(t,i,o,l,u,d,h,m,v){const x=this.elements;return x[0]=t,x[1]=l,x[2]=h,x[3]=i,x[4]=u,x[5]=m,x[6]=o,x[7]=d,x[8]=v,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const i=this.elements,o=t.elements;return i[0]=o[0],i[1]=o[1],i[2]=o[2],i[3]=o[3],i[4]=o[4],i[5]=o[5],i[6]=o[6],i[7]=o[7],i[8]=o[8],this}extractBasis(t,i,o){return t.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),o.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const i=t.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const o=t.elements,l=i.elements,u=this.elements,d=o[0],h=o[3],m=o[6],v=o[1],x=o[4],g=o[7],S=o[2],y=o[5],T=o[8],C=l[0],E=l[3],M=l[6],O=l[1],I=l[4],D=l[7],V=l[2],H=l[5],z=l[8];return u[0]=d*C+h*O+m*V,u[3]=d*E+h*I+m*H,u[6]=d*M+h*D+m*z,u[1]=v*C+x*O+g*V,u[4]=v*E+x*I+g*H,u[7]=v*M+x*D+g*z,u[2]=S*C+y*O+T*V,u[5]=S*E+y*I+T*H,u[8]=S*M+y*D+T*z,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[3]*=t,i[6]*=t,i[1]*=t,i[4]*=t,i[7]*=t,i[2]*=t,i[5]*=t,i[8]*=t,this}determinant(){const t=this.elements,i=t[0],o=t[1],l=t[2],u=t[3],d=t[4],h=t[5],m=t[6],v=t[7],x=t[8];return i*d*x-i*h*v-o*u*x+o*h*m+l*u*v-l*d*m}invert(){const t=this.elements,i=t[0],o=t[1],l=t[2],u=t[3],d=t[4],h=t[5],m=t[6],v=t[7],x=t[8],g=x*d-h*v,S=h*m-x*u,y=v*u-d*m,T=i*g+o*S+l*y;if(T===0)return this.set(0,0,0,0,0,0,0,0,0);const C=1/T;return t[0]=g*C,t[1]=(l*v-x*o)*C,t[2]=(h*o-l*d)*C,t[3]=S*C,t[4]=(x*i-l*m)*C,t[5]=(l*u-h*i)*C,t[6]=y*C,t[7]=(o*m-v*i)*C,t[8]=(d*i-o*u)*C,this}transpose(){let t;const i=this.elements;return t=i[1],i[1]=i[3],i[3]=t,t=i[2],i[2]=i[6],i[6]=t,t=i[5],i[5]=i[7],i[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const i=this.elements;return t[0]=i[0],t[1]=i[3],t[2]=i[6],t[3]=i[1],t[4]=i[4],t[5]=i[7],t[6]=i[2],t[7]=i[5],t[8]=i[8],this}setUvTransform(t,i,o,l,u,d,h){const m=Math.cos(u),v=Math.sin(u);return this.set(o*m,o*v,-o*(m*d+v*h)+d+t,-l*v,l*m,-l*(-v*d+m*h)+h+i,0,0,1),this}scale(t,i){return this.premultiply(Wh.makeScale(t,i)),this}rotate(t){return this.premultiply(Wh.makeRotation(-t)),this}translate(t,i){return this.premultiply(Wh.makeTranslation(t,i)),this}makeTranslation(t,i){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,i,0,0,1),this}makeRotation(t){const i=Math.cos(t),o=Math.sin(t);return this.set(i,-o,0,o,i,0,0,0,1),this}makeScale(t,i){return this.set(t,0,0,0,i,0,0,0,1),this}equals(t){const i=this.elements,o=t.elements;for(let l=0;l<9;l++)if(i[l]!==o[l])return!1;return!0}fromArray(t,i=0){for(let o=0;o<9;o++)this.elements[o]=t[o+i];return this}toArray(t=[],i=0){const o=this.elements;return t[i]=o[0],t[i+1]=o[1],t[i+2]=o[2],t[i+3]=o[3],t[i+4]=o[4],t[i+5]=o[5],t[i+6]=o[6],t[i+7]=o[7],t[i+8]=o[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Wh=new vt;function Iy(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function Bl(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function QE(){const r=Bl("canvas");return r.style.display="block",r}const _x={};function Fl(r){r in _x||(_x[r]=!0,console.warn(r))}function JE(r,t,i){return new Promise(function(o,l){function u(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:l();break;case r.TIMEOUT_EXPIRED:setTimeout(u,i);break;default:o()}}setTimeout(u,i)})}const xx=new vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),yx=new vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function $E(){const r={enabled:!0,workingColorSpace:bo,spaces:{},convert:function(l,u,d){return this.enabled===!1||u===d||!u||!d||(this.spaces[u].transfer===Xt&&(l.r=Pa(l.r),l.g=Pa(l.g),l.b=Pa(l.b)),this.spaces[u].primaries!==this.spaces[d].primaries&&(l.applyMatrix3(this.spaces[u].toXYZ),l.applyMatrix3(this.spaces[d].fromXYZ)),this.spaces[d].transfer===Xt&&(l.r=_o(l.r),l.g=_o(l.g),l.b=_o(l.b))),l},workingToColorSpace:function(l,u){return this.convert(l,this.workingColorSpace,u)},colorSpaceToWorking:function(l,u){return this.convert(l,u,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===xs?Ju:this.spaces[l].transfer},getToneMappingMode:function(l){return this.spaces[l].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(l,u=this.workingColorSpace){return l.fromArray(this.spaces[u].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,u,d){return l.copy(this.spaces[u].toXYZ).multiply(this.spaces[d].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(l,u){return Fl("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(l,u)},toWorkingColorSpace:function(l,u){return Fl("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(l,u)}},t=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],o=[.3127,.329];return r.define({[bo]:{primaries:t,whitePoint:o,transfer:Ju,toXYZ:xx,fromXYZ:yx,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:ei},outputColorSpaceConfig:{drawingBufferColorSpace:ei}},[ei]:{primaries:t,whitePoint:o,transfer:Xt,toXYZ:xx,fromXYZ:yx,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:ei}}}),r}const Ut=$E();function Pa(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function _o(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let eo;class eT{static getDataURL(t,i="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let o;if(t instanceof HTMLCanvasElement)o=t;else{eo===void 0&&(eo=Bl("canvas")),eo.width=t.width,eo.height=t.height;const l=eo.getContext("2d");t instanceof ImageData?l.putImageData(t,0,0):l.drawImage(t,0,0,t.width,t.height),o=eo}return o.toDataURL(i)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const i=Bl("canvas");i.width=t.width,i.height=t.height;const o=i.getContext("2d");o.drawImage(t,0,0,t.width,t.height);const l=o.getImageData(0,0,t.width,t.height),u=l.data;for(let d=0;d<u.length;d++)u[d]=Pa(u[d]/255)*255;return o.putImageData(l,0,0),i}else if(t.data){const i=t.data.slice(0);for(let o=0;o<i.length;o++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[o]=Math.floor(Pa(i[o]/255)*255):i[o]=Pa(i[o]);return{data:i,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let tT=0;class Om{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:tT++}),this.uuid=Gl(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const i=this.data;return typeof HTMLVideoElement<"u"&&i instanceof HTMLVideoElement?t.set(i.videoWidth,i.videoHeight,0):i instanceof VideoFrame?t.set(i.displayHeight,i.displayWidth,0):i!==null?t.set(i.width,i.height,i.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const o={uuid:this.uuid,url:""},l=this.data;if(l!==null){let u;if(Array.isArray(l)){u=[];for(let d=0,h=l.length;d<h;d++)l[d].isDataTexture?u.push(Zh(l[d].image)):u.push(Zh(l[d]))}else u=Zh(l);o.url=u}return i||(t.images[this.uuid]=o),o}}function Zh(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?eT.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let nT=0;const Kh=new ne;class Yn extends Ro{constructor(t=Yn.DEFAULT_IMAGE,i=Yn.DEFAULT_MAPPING,o=rr,l=rr,u=ji,d=or,h=ki,m=ca,v=Yn.DEFAULT_ANISOTROPY,x=xs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:nT++}),this.uuid=Gl(),this.name="",this.source=new Om(t),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=o,this.wrapT=l,this.magFilter=u,this.minFilter=d,this.anisotropy=v,this.format=h,this.internalFormat=null,this.type=m,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=x,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Kh).x}get height(){return this.source.getSize(Kh).y}get depth(){return this.source.getSize(Kh).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const i in t){const o=t[i];if(o===void 0){console.warn(`THREE.Texture.setValues(): parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Texture.setValues(): property '${i}' does not exist.`);continue}l&&o&&l.isVector2&&o.isVector2||l&&o&&l.isVector3&&o.isVector3||l&&o&&l.isMatrix3&&o.isMatrix3?l.copy(o):this[i]=o}}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const o={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(o.userData=this.userData),i||(t.textures[this.uuid]=o),o}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ay)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Hp:t.x=t.x-Math.floor(t.x);break;case rr:t.x=t.x<0?0:1;break;case Gp:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Hp:t.y=t.y-Math.floor(t.y);break;case rr:t.y=t.y<0?0:1;break;case Gp:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Yn.DEFAULT_IMAGE=null;Yn.DEFAULT_MAPPING=Ay;Yn.DEFAULT_ANISOTROPY=1;class Wt{constructor(t=0,i=0,o=0,l=1){Wt.prototype.isVector4=!0,this.x=t,this.y=i,this.z=o,this.w=l}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,i,o,l){return this.x=t,this.y=i,this.z=o,this.w=l,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this.w=t.w+i.w,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this.w+=t.w*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this.w=t.w-i.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const i=this.x,o=this.y,l=this.z,u=this.w,d=t.elements;return this.x=d[0]*i+d[4]*o+d[8]*l+d[12]*u,this.y=d[1]*i+d[5]*o+d[9]*l+d[13]*u,this.z=d[2]*i+d[6]*o+d[10]*l+d[14]*u,this.w=d[3]*i+d[7]*o+d[11]*l+d[15]*u,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const i=Math.sqrt(1-t.w*t.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/i,this.y=t.y/i,this.z=t.z/i),this}setAxisAngleFromRotationMatrix(t){let i,o,l,u;const m=t.elements,v=m[0],x=m[4],g=m[8],S=m[1],y=m[5],T=m[9],C=m[2],E=m[6],M=m[10];if(Math.abs(x-S)<.01&&Math.abs(g-C)<.01&&Math.abs(T-E)<.01){if(Math.abs(x+S)<.1&&Math.abs(g+C)<.1&&Math.abs(T+E)<.1&&Math.abs(v+y+M-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const I=(v+1)/2,D=(y+1)/2,V=(M+1)/2,H=(x+S)/4,z=(g+C)/4,X=(T+E)/4;return I>D&&I>V?I<.01?(o=0,l=.707106781,u=.707106781):(o=Math.sqrt(I),l=H/o,u=z/o):D>V?D<.01?(o=.707106781,l=0,u=.707106781):(l=Math.sqrt(D),o=H/l,u=X/l):V<.01?(o=.707106781,l=.707106781,u=0):(u=Math.sqrt(V),o=z/u,l=X/u),this.set(o,l,u,i),this}let O=Math.sqrt((E-T)*(E-T)+(g-C)*(g-C)+(S-x)*(S-x));return Math.abs(O)<.001&&(O=1),this.x=(E-T)/O,this.y=(g-C)/O,this.z=(S-x)/O,this.w=Math.acos((v+y+M-1)/2),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,i){return this.x=wt(this.x,t.x,i.x),this.y=wt(this.y,t.y,i.y),this.z=wt(this.z,t.z,i.z),this.w=wt(this.w,t.w,i.w),this}clampScalar(t,i){return this.x=wt(this.x,t,i),this.y=wt(this.y,t,i),this.z=wt(this.z,t,i),this.w=wt(this.w,t,i),this}clampLength(t,i){const o=this.length();return this.divideScalar(o||1).multiplyScalar(wt(o,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this.w+=(t.w-this.w)*i,this}lerpVectors(t,i,o){return this.x=t.x+(i.x-t.x)*o,this.y=t.y+(i.y-t.y)*o,this.z=t.z+(i.z-t.z)*o,this.w=t.w+(i.w-t.w)*o,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this.w=t.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class iT extends Ro{constructor(t=1,i=1,o={}){super(),o=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ji,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},o),this.isRenderTarget=!0,this.width=t,this.height=i,this.depth=o.depth,this.scissor=new Wt(0,0,t,i),this.scissorTest=!1,this.viewport=new Wt(0,0,t,i);const l={width:t,height:i,depth:o.depth},u=new Yn(l);this.textures=[];const d=o.count;for(let h=0;h<d;h++)this.textures[h]=u.clone(),this.textures[h].isRenderTargetTexture=!0,this.textures[h].renderTarget=this;this._setTextureOptions(o),this.depthBuffer=o.depthBuffer,this.stencilBuffer=o.stencilBuffer,this.resolveDepthBuffer=o.resolveDepthBuffer,this.resolveStencilBuffer=o.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=o.depthTexture,this.samples=o.samples,this.multiview=o.multiview}_setTextureOptions(t={}){const i={minFilter:ji,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(i.mapping=t.mapping),t.wrapS!==void 0&&(i.wrapS=t.wrapS),t.wrapT!==void 0&&(i.wrapT=t.wrapT),t.wrapR!==void 0&&(i.wrapR=t.wrapR),t.magFilter!==void 0&&(i.magFilter=t.magFilter),t.minFilter!==void 0&&(i.minFilter=t.minFilter),t.format!==void 0&&(i.format=t.format),t.type!==void 0&&(i.type=t.type),t.anisotropy!==void 0&&(i.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(i.colorSpace=t.colorSpace),t.flipY!==void 0&&(i.flipY=t.flipY),t.generateMipmaps!==void 0&&(i.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(i.internalFormat=t.internalFormat);for(let o=0;o<this.textures.length;o++)this.textures[o].setValues(i)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,i,o=1){if(this.width!==t||this.height!==i||this.depth!==o){this.width=t,this.height=i,this.depth=o;for(let l=0,u=this.textures.length;l<u;l++)this.textures[l].image.width=t,this.textures[l].image.height=i,this.textures[l].image.depth=o,this.textures[l].isArrayTexture=this.textures[l].image.depth>1;this.dispose()}this.viewport.set(0,0,t,i),this.scissor.set(0,0,t,i)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,o=t.textures.length;i<o;i++){this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},t.textures[i].image);this.textures[i].source=new Om(l)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Xi extends iT{constructor(t=1,i=1,o={}){super(t,i,o),this.isWebGLRenderTarget=!0}}class By extends Yn{constructor(t=null,i=1,o=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:i,height:o,depth:l},this.magFilter=Ni,this.minFilter=Ni,this.wrapR=rr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class aT extends Yn{constructor(t=null,i=1,o=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:i,height:o,depth:l},this.magFilter=Ni,this.minFilter=Ni,this.wrapR=rr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class jl{constructor(t=new ne(1/0,1/0,1/0),i=new ne(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=i}set(t,i){return this.min.copy(t),this.max.copy(i),this}setFromArray(t){this.makeEmpty();for(let i=0,o=t.length;i<o;i+=3)this.expandByPoint(Bi.fromArray(t,i));return this}setFromBufferAttribute(t){this.makeEmpty();for(let i=0,o=t.count;i<o;i++)this.expandByPoint(Bi.fromBufferAttribute(t,i));return this}setFromPoints(t){this.makeEmpty();for(let i=0,o=t.length;i<o;i++)this.expandByPoint(t[i]);return this}setFromCenterAndSize(t,i){const o=Bi.copy(i).multiplyScalar(.5);return this.min.copy(t).sub(o),this.max.copy(t).add(o),this}setFromObject(t,i=!1){return this.makeEmpty(),this.expandByObject(t,i)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,i=!1){t.updateWorldMatrix(!1,!1);const o=t.geometry;if(o!==void 0){const u=o.getAttribute("position");if(i===!0&&u!==void 0&&t.isInstancedMesh!==!0)for(let d=0,h=u.count;d<h;d++)t.isMesh===!0?t.getVertexPosition(d,Bi):Bi.fromBufferAttribute(u,d),Bi.applyMatrix4(t.matrixWorld),this.expandByPoint(Bi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),mu.copy(t.boundingBox)):(o.boundingBox===null&&o.computeBoundingBox(),mu.copy(o.boundingBox)),mu.applyMatrix4(t.matrixWorld),this.union(mu)}const l=t.children;for(let u=0,d=l.length;u<d;u++)this.expandByObject(l[u],i);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,i){return i.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Bi),Bi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let i,o;return t.normal.x>0?(i=t.normal.x*this.min.x,o=t.normal.x*this.max.x):(i=t.normal.x*this.max.x,o=t.normal.x*this.min.x),t.normal.y>0?(i+=t.normal.y*this.min.y,o+=t.normal.y*this.max.y):(i+=t.normal.y*this.max.y,o+=t.normal.y*this.min.y),t.normal.z>0?(i+=t.normal.z*this.min.z,o+=t.normal.z*this.max.z):(i+=t.normal.z*this.max.z,o+=t.normal.z*this.min.z),i<=-t.constant&&o>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Al),gu.subVectors(this.max,Al),to.subVectors(t.a,Al),no.subVectors(t.b,Al),io.subVectors(t.c,Al),fs.subVectors(no,to),ds.subVectors(io,no),Ws.subVectors(to,io);let i=[0,-fs.z,fs.y,0,-ds.z,ds.y,0,-Ws.z,Ws.y,fs.z,0,-fs.x,ds.z,0,-ds.x,Ws.z,0,-Ws.x,-fs.y,fs.x,0,-ds.y,ds.x,0,-Ws.y,Ws.x,0];return!Qh(i,to,no,io,gu)||(i=[1,0,0,0,1,0,0,0,1],!Qh(i,to,no,io,gu))?!1:(vu.crossVectors(fs,ds),i=[vu.x,vu.y,vu.z],Qh(i,to,no,io,gu))}clampPoint(t,i){return i.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Bi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Bi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ca[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ca[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ca[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ca[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ca[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ca[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ca[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ca[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ca),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Ca=[new ne,new ne,new ne,new ne,new ne,new ne,new ne,new ne],Bi=new ne,mu=new jl,to=new ne,no=new ne,io=new ne,fs=new ne,ds=new ne,Ws=new ne,Al=new ne,gu=new ne,vu=new ne,Zs=new ne;function Qh(r,t,i,o,l){for(let u=0,d=r.length-3;u<=d;u+=3){Zs.fromArray(r,u);const h=l.x*Math.abs(Zs.x)+l.y*Math.abs(Zs.y)+l.z*Math.abs(Zs.z),m=t.dot(Zs),v=i.dot(Zs),x=o.dot(Zs);if(Math.max(-Math.max(m,v,x),Math.min(m,v,x))>h)return!1}return!0}const sT=new jl,Cl=new ne,Jh=new ne;class af{constructor(t=new ne,i=-1){this.isSphere=!0,this.center=t,this.radius=i}set(t,i){return this.center.copy(t),this.radius=i,this}setFromPoints(t,i){const o=this.center;i!==void 0?o.copy(i):sT.setFromPoints(t).getCenter(o);let l=0;for(let u=0,d=t.length;u<d;u++)l=Math.max(l,o.distanceToSquared(t[u]));return this.radius=Math.sqrt(l),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const i=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=i*i}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,i){const o=this.center.distanceToSquared(t);return i.copy(t),o>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Cl.subVectors(t,this.center);const i=Cl.lengthSq();if(i>this.radius*this.radius){const o=Math.sqrt(i),l=(o-this.radius)*.5;this.center.addScaledVector(Cl,l/o),this.radius+=l}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Jh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Cl.copy(t.center).add(Jh)),this.expandByPoint(Cl.copy(t.center).sub(Jh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Ra=new ne,$h=new ne,_u=new ne,hs=new ne,ep=new ne,xu=new ne,tp=new ne;class Fy{constructor(t=new ne,i=new ne(0,0,-1)){this.origin=t,this.direction=i}set(t,i){return this.origin.copy(t),this.direction.copy(i),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,i){return i.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ra)),this}closestPointToPoint(t,i){i.subVectors(t,this.origin);const o=i.dot(this.direction);return o<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,o)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const i=Ra.subVectors(t,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(t):(Ra.copy(this.origin).addScaledVector(this.direction,i),Ra.distanceToSquared(t))}distanceSqToSegment(t,i,o,l){$h.copy(t).add(i).multiplyScalar(.5),_u.copy(i).sub(t).normalize(),hs.copy(this.origin).sub($h);const u=t.distanceTo(i)*.5,d=-this.direction.dot(_u),h=hs.dot(this.direction),m=-hs.dot(_u),v=hs.lengthSq(),x=Math.abs(1-d*d);let g,S,y,T;if(x>0)if(g=d*m-h,S=d*h-m,T=u*x,g>=0)if(S>=-T)if(S<=T){const C=1/x;g*=C,S*=C,y=g*(g+d*S+2*h)+S*(d*g+S+2*m)+v}else S=u,g=Math.max(0,-(d*S+h)),y=-g*g+S*(S+2*m)+v;else S=-u,g=Math.max(0,-(d*S+h)),y=-g*g+S*(S+2*m)+v;else S<=-T?(g=Math.max(0,-(-d*u+h)),S=g>0?-u:Math.min(Math.max(-u,-m),u),y=-g*g+S*(S+2*m)+v):S<=T?(g=0,S=Math.min(Math.max(-u,-m),u),y=S*(S+2*m)+v):(g=Math.max(0,-(d*u+h)),S=g>0?u:Math.min(Math.max(-u,-m),u),y=-g*g+S*(S+2*m)+v);else S=d>0?-u:u,g=Math.max(0,-(d*S+h)),y=-g*g+S*(S+2*m)+v;return o&&o.copy(this.origin).addScaledVector(this.direction,g),l&&l.copy($h).addScaledVector(_u,S),y}intersectSphere(t,i){Ra.subVectors(t.center,this.origin);const o=Ra.dot(this.direction),l=Ra.dot(Ra)-o*o,u=t.radius*t.radius;if(l>u)return null;const d=Math.sqrt(u-l),h=o-d,m=o+d;return m<0?null:h<0?this.at(m,i):this.at(h,i)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const i=t.normal.dot(this.direction);if(i===0)return t.distanceToPoint(this.origin)===0?0:null;const o=-(this.origin.dot(t.normal)+t.constant)/i;return o>=0?o:null}intersectPlane(t,i){const o=this.distanceToPlane(t);return o===null?null:this.at(o,i)}intersectsPlane(t){const i=t.distanceToPoint(this.origin);return i===0||t.normal.dot(this.direction)*i<0}intersectBox(t,i){let o,l,u,d,h,m;const v=1/this.direction.x,x=1/this.direction.y,g=1/this.direction.z,S=this.origin;return v>=0?(o=(t.min.x-S.x)*v,l=(t.max.x-S.x)*v):(o=(t.max.x-S.x)*v,l=(t.min.x-S.x)*v),x>=0?(u=(t.min.y-S.y)*x,d=(t.max.y-S.y)*x):(u=(t.max.y-S.y)*x,d=(t.min.y-S.y)*x),o>d||u>l||((u>o||isNaN(o))&&(o=u),(d<l||isNaN(l))&&(l=d),g>=0?(h=(t.min.z-S.z)*g,m=(t.max.z-S.z)*g):(h=(t.max.z-S.z)*g,m=(t.min.z-S.z)*g),o>m||h>l)||((h>o||o!==o)&&(o=h),(m<l||l!==l)&&(l=m),l<0)?null:this.at(o>=0?o:l,i)}intersectsBox(t){return this.intersectBox(t,Ra)!==null}intersectTriangle(t,i,o,l,u){ep.subVectors(i,t),xu.subVectors(o,t),tp.crossVectors(ep,xu);let d=this.direction.dot(tp),h;if(d>0){if(l)return null;h=1}else if(d<0)h=-1,d=-d;else return null;hs.subVectors(this.origin,t);const m=h*this.direction.dot(xu.crossVectors(hs,xu));if(m<0)return null;const v=h*this.direction.dot(ep.cross(hs));if(v<0||m+v>d)return null;const x=-h*hs.dot(tp);return x<0?null:this.at(x/d,u)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class an{constructor(t,i,o,l,u,d,h,m,v,x,g,S,y,T,C,E){an.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,i,o,l,u,d,h,m,v,x,g,S,y,T,C,E)}set(t,i,o,l,u,d,h,m,v,x,g,S,y,T,C,E){const M=this.elements;return M[0]=t,M[4]=i,M[8]=o,M[12]=l,M[1]=u,M[5]=d,M[9]=h,M[13]=m,M[2]=v,M[6]=x,M[10]=g,M[14]=S,M[3]=y,M[7]=T,M[11]=C,M[15]=E,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new an().fromArray(this.elements)}copy(t){const i=this.elements,o=t.elements;return i[0]=o[0],i[1]=o[1],i[2]=o[2],i[3]=o[3],i[4]=o[4],i[5]=o[5],i[6]=o[6],i[7]=o[7],i[8]=o[8],i[9]=o[9],i[10]=o[10],i[11]=o[11],i[12]=o[12],i[13]=o[13],i[14]=o[14],i[15]=o[15],this}copyPosition(t){const i=this.elements,o=t.elements;return i[12]=o[12],i[13]=o[13],i[14]=o[14],this}setFromMatrix3(t){const i=t.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(t,i,o){return t.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),o.setFromMatrixColumn(this,2),this}makeBasis(t,i,o){return this.set(t.x,i.x,o.x,0,t.y,i.y,o.y,0,t.z,i.z,o.z,0,0,0,0,1),this}extractRotation(t){const i=this.elements,o=t.elements,l=1/ao.setFromMatrixColumn(t,0).length(),u=1/ao.setFromMatrixColumn(t,1).length(),d=1/ao.setFromMatrixColumn(t,2).length();return i[0]=o[0]*l,i[1]=o[1]*l,i[2]=o[2]*l,i[3]=0,i[4]=o[4]*u,i[5]=o[5]*u,i[6]=o[6]*u,i[7]=0,i[8]=o[8]*d,i[9]=o[9]*d,i[10]=o[10]*d,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(t){const i=this.elements,o=t.x,l=t.y,u=t.z,d=Math.cos(o),h=Math.sin(o),m=Math.cos(l),v=Math.sin(l),x=Math.cos(u),g=Math.sin(u);if(t.order==="XYZ"){const S=d*x,y=d*g,T=h*x,C=h*g;i[0]=m*x,i[4]=-m*g,i[8]=v,i[1]=y+T*v,i[5]=S-C*v,i[9]=-h*m,i[2]=C-S*v,i[6]=T+y*v,i[10]=d*m}else if(t.order==="YXZ"){const S=m*x,y=m*g,T=v*x,C=v*g;i[0]=S+C*h,i[4]=T*h-y,i[8]=d*v,i[1]=d*g,i[5]=d*x,i[9]=-h,i[2]=y*h-T,i[6]=C+S*h,i[10]=d*m}else if(t.order==="ZXY"){const S=m*x,y=m*g,T=v*x,C=v*g;i[0]=S-C*h,i[4]=-d*g,i[8]=T+y*h,i[1]=y+T*h,i[5]=d*x,i[9]=C-S*h,i[2]=-d*v,i[6]=h,i[10]=d*m}else if(t.order==="ZYX"){const S=d*x,y=d*g,T=h*x,C=h*g;i[0]=m*x,i[4]=T*v-y,i[8]=S*v+C,i[1]=m*g,i[5]=C*v+S,i[9]=y*v-T,i[2]=-v,i[6]=h*m,i[10]=d*m}else if(t.order==="YZX"){const S=d*m,y=d*v,T=h*m,C=h*v;i[0]=m*x,i[4]=C-S*g,i[8]=T*g+y,i[1]=g,i[5]=d*x,i[9]=-h*x,i[2]=-v*x,i[6]=y*g+T,i[10]=S-C*g}else if(t.order==="XZY"){const S=d*m,y=d*v,T=h*m,C=h*v;i[0]=m*x,i[4]=-g,i[8]=v*x,i[1]=S*g+C,i[5]=d*x,i[9]=y*g-T,i[2]=T*g-y,i[6]=h*x,i[10]=C*g+S}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(t){return this.compose(rT,t,oT)}lookAt(t,i,o){const l=this.elements;return fi.subVectors(t,i),fi.lengthSq()===0&&(fi.z=1),fi.normalize(),ps.crossVectors(o,fi),ps.lengthSq()===0&&(Math.abs(o.z)===1?fi.x+=1e-4:fi.z+=1e-4,fi.normalize(),ps.crossVectors(o,fi)),ps.normalize(),yu.crossVectors(fi,ps),l[0]=ps.x,l[4]=yu.x,l[8]=fi.x,l[1]=ps.y,l[5]=yu.y,l[9]=fi.y,l[2]=ps.z,l[6]=yu.z,l[10]=fi.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const o=t.elements,l=i.elements,u=this.elements,d=o[0],h=o[4],m=o[8],v=o[12],x=o[1],g=o[5],S=o[9],y=o[13],T=o[2],C=o[6],E=o[10],M=o[14],O=o[3],I=o[7],D=o[11],V=o[15],H=l[0],z=l[4],X=l[8],w=l[12],N=l[1],B=l[5],k=l[9],le=l[13],pe=l[2],fe=l[6],q=l[10],se=l[14],W=l[3],xe=l[7],Se=l[11],Pe=l[15];return u[0]=d*H+h*N+m*pe+v*W,u[4]=d*z+h*B+m*fe+v*xe,u[8]=d*X+h*k+m*q+v*Se,u[12]=d*w+h*le+m*se+v*Pe,u[1]=x*H+g*N+S*pe+y*W,u[5]=x*z+g*B+S*fe+y*xe,u[9]=x*X+g*k+S*q+y*Se,u[13]=x*w+g*le+S*se+y*Pe,u[2]=T*H+C*N+E*pe+M*W,u[6]=T*z+C*B+E*fe+M*xe,u[10]=T*X+C*k+E*q+M*Se,u[14]=T*w+C*le+E*se+M*Pe,u[3]=O*H+I*N+D*pe+V*W,u[7]=O*z+I*B+D*fe+V*xe,u[11]=O*X+I*k+D*q+V*Se,u[15]=O*w+I*le+D*se+V*Pe,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[4]*=t,i[8]*=t,i[12]*=t,i[1]*=t,i[5]*=t,i[9]*=t,i[13]*=t,i[2]*=t,i[6]*=t,i[10]*=t,i[14]*=t,i[3]*=t,i[7]*=t,i[11]*=t,i[15]*=t,this}determinant(){const t=this.elements,i=t[0],o=t[4],l=t[8],u=t[12],d=t[1],h=t[5],m=t[9],v=t[13],x=t[2],g=t[6],S=t[10],y=t[14],T=t[3],C=t[7],E=t[11],M=t[15];return T*(+u*m*g-l*v*g-u*h*S+o*v*S+l*h*y-o*m*y)+C*(+i*m*y-i*v*S+u*d*S-l*d*y+l*v*x-u*m*x)+E*(+i*v*g-i*h*y-u*d*g+o*d*y+u*h*x-o*v*x)+M*(-l*h*x-i*m*g+i*h*S+l*d*g-o*d*S+o*m*x)}transpose(){const t=this.elements;let i;return i=t[1],t[1]=t[4],t[4]=i,i=t[2],t[2]=t[8],t[8]=i,i=t[6],t[6]=t[9],t[9]=i,i=t[3],t[3]=t[12],t[12]=i,i=t[7],t[7]=t[13],t[13]=i,i=t[11],t[11]=t[14],t[14]=i,this}setPosition(t,i,o){const l=this.elements;return t.isVector3?(l[12]=t.x,l[13]=t.y,l[14]=t.z):(l[12]=t,l[13]=i,l[14]=o),this}invert(){const t=this.elements,i=t[0],o=t[1],l=t[2],u=t[3],d=t[4],h=t[5],m=t[6],v=t[7],x=t[8],g=t[9],S=t[10],y=t[11],T=t[12],C=t[13],E=t[14],M=t[15],O=g*E*v-C*S*v+C*m*y-h*E*y-g*m*M+h*S*M,I=T*S*v-x*E*v-T*m*y+d*E*y+x*m*M-d*S*M,D=x*C*v-T*g*v+T*h*y-d*C*y-x*h*M+d*g*M,V=T*g*m-x*C*m-T*h*S+d*C*S+x*h*E-d*g*E,H=i*O+o*I+l*D+u*V;if(H===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const z=1/H;return t[0]=O*z,t[1]=(C*S*u-g*E*u-C*l*y+o*E*y+g*l*M-o*S*M)*z,t[2]=(h*E*u-C*m*u+C*l*v-o*E*v-h*l*M+o*m*M)*z,t[3]=(g*m*u-h*S*u-g*l*v+o*S*v+h*l*y-o*m*y)*z,t[4]=I*z,t[5]=(x*E*u-T*S*u+T*l*y-i*E*y-x*l*M+i*S*M)*z,t[6]=(T*m*u-d*E*u-T*l*v+i*E*v+d*l*M-i*m*M)*z,t[7]=(d*S*u-x*m*u+x*l*v-i*S*v-d*l*y+i*m*y)*z,t[8]=D*z,t[9]=(T*g*u-x*C*u-T*o*y+i*C*y+x*o*M-i*g*M)*z,t[10]=(d*C*u-T*h*u+T*o*v-i*C*v-d*o*M+i*h*M)*z,t[11]=(x*h*u-d*g*u-x*o*v+i*g*v+d*o*y-i*h*y)*z,t[12]=V*z,t[13]=(x*C*l-T*g*l+T*o*S-i*C*S-x*o*E+i*g*E)*z,t[14]=(T*h*l-d*C*l-T*o*m+i*C*m+d*o*E-i*h*E)*z,t[15]=(d*g*l-x*h*l+x*o*m-i*g*m-d*o*S+i*h*S)*z,this}scale(t){const i=this.elements,o=t.x,l=t.y,u=t.z;return i[0]*=o,i[4]*=l,i[8]*=u,i[1]*=o,i[5]*=l,i[9]*=u,i[2]*=o,i[6]*=l,i[10]*=u,i[3]*=o,i[7]*=l,i[11]*=u,this}getMaxScaleOnAxis(){const t=this.elements,i=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],o=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],l=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(i,o,l))}makeTranslation(t,i,o){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,i,0,0,1,o,0,0,0,1),this}makeRotationX(t){const i=Math.cos(t),o=Math.sin(t);return this.set(1,0,0,0,0,i,-o,0,0,o,i,0,0,0,0,1),this}makeRotationY(t){const i=Math.cos(t),o=Math.sin(t);return this.set(i,0,o,0,0,1,0,0,-o,0,i,0,0,0,0,1),this}makeRotationZ(t){const i=Math.cos(t),o=Math.sin(t);return this.set(i,-o,0,0,o,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,i){const o=Math.cos(i),l=Math.sin(i),u=1-o,d=t.x,h=t.y,m=t.z,v=u*d,x=u*h;return this.set(v*d+o,v*h-l*m,v*m+l*h,0,v*h+l*m,x*h+o,x*m-l*d,0,v*m-l*h,x*m+l*d,u*m*m+o,0,0,0,0,1),this}makeScale(t,i,o){return this.set(t,0,0,0,0,i,0,0,0,0,o,0,0,0,0,1),this}makeShear(t,i,o,l,u,d){return this.set(1,o,u,0,t,1,d,0,i,l,1,0,0,0,0,1),this}compose(t,i,o){const l=this.elements,u=i._x,d=i._y,h=i._z,m=i._w,v=u+u,x=d+d,g=h+h,S=u*v,y=u*x,T=u*g,C=d*x,E=d*g,M=h*g,O=m*v,I=m*x,D=m*g,V=o.x,H=o.y,z=o.z;return l[0]=(1-(C+M))*V,l[1]=(y+D)*V,l[2]=(T-I)*V,l[3]=0,l[4]=(y-D)*H,l[5]=(1-(S+M))*H,l[6]=(E+O)*H,l[7]=0,l[8]=(T+I)*z,l[9]=(E-O)*z,l[10]=(1-(S+C))*z,l[11]=0,l[12]=t.x,l[13]=t.y,l[14]=t.z,l[15]=1,this}decompose(t,i,o){const l=this.elements;let u=ao.set(l[0],l[1],l[2]).length();const d=ao.set(l[4],l[5],l[6]).length(),h=ao.set(l[8],l[9],l[10]).length();this.determinant()<0&&(u=-u),t.x=l[12],t.y=l[13],t.z=l[14],Fi.copy(this);const v=1/u,x=1/d,g=1/h;return Fi.elements[0]*=v,Fi.elements[1]*=v,Fi.elements[2]*=v,Fi.elements[4]*=x,Fi.elements[5]*=x,Fi.elements[6]*=x,Fi.elements[8]*=g,Fi.elements[9]*=g,Fi.elements[10]*=g,i.setFromRotationMatrix(Fi),o.x=u,o.y=d,o.z=h,this}makePerspective(t,i,o,l,u,d,h=la,m=!1){const v=this.elements,x=2*u/(i-t),g=2*u/(o-l),S=(i+t)/(i-t),y=(o+l)/(o-l);let T,C;if(m)T=u/(d-u),C=d*u/(d-u);else if(h===la)T=-(d+u)/(d-u),C=-2*d*u/(d-u);else if(h===$u)T=-d/(d-u),C=-d*u/(d-u);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+h);return v[0]=x,v[4]=0,v[8]=S,v[12]=0,v[1]=0,v[5]=g,v[9]=y,v[13]=0,v[2]=0,v[6]=0,v[10]=T,v[14]=C,v[3]=0,v[7]=0,v[11]=-1,v[15]=0,this}makeOrthographic(t,i,o,l,u,d,h=la,m=!1){const v=this.elements,x=2/(i-t),g=2/(o-l),S=-(i+t)/(i-t),y=-(o+l)/(o-l);let T,C;if(m)T=1/(d-u),C=d/(d-u);else if(h===la)T=-2/(d-u),C=-(d+u)/(d-u);else if(h===$u)T=-1/(d-u),C=-u/(d-u);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+h);return v[0]=x,v[4]=0,v[8]=0,v[12]=S,v[1]=0,v[5]=g,v[9]=0,v[13]=y,v[2]=0,v[6]=0,v[10]=T,v[14]=C,v[3]=0,v[7]=0,v[11]=0,v[15]=1,this}equals(t){const i=this.elements,o=t.elements;for(let l=0;l<16;l++)if(i[l]!==o[l])return!1;return!0}fromArray(t,i=0){for(let o=0;o<16;o++)this.elements[o]=t[o+i];return this}toArray(t=[],i=0){const o=this.elements;return t[i]=o[0],t[i+1]=o[1],t[i+2]=o[2],t[i+3]=o[3],t[i+4]=o[4],t[i+5]=o[5],t[i+6]=o[6],t[i+7]=o[7],t[i+8]=o[8],t[i+9]=o[9],t[i+10]=o[10],t[i+11]=o[11],t[i+12]=o[12],t[i+13]=o[13],t[i+14]=o[14],t[i+15]=o[15],t}}const ao=new ne,Fi=new an,rT=new ne(0,0,0),oT=new ne(1,1,1),ps=new ne,yu=new ne,fi=new ne,Sx=new an,Mx=new Vl;class ua{constructor(t=0,i=0,o=0,l=ua.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=i,this._z=o,this._order=l}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,i,o,l=this._order){return this._x=t,this._y=i,this._z=o,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,i=this._order,o=!0){const l=t.elements,u=l[0],d=l[4],h=l[8],m=l[1],v=l[5],x=l[9],g=l[2],S=l[6],y=l[10];switch(i){case"XYZ":this._y=Math.asin(wt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-x,y),this._z=Math.atan2(-d,u)):(this._x=Math.atan2(S,v),this._z=0);break;case"YXZ":this._x=Math.asin(-wt(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(h,y),this._z=Math.atan2(m,v)):(this._y=Math.atan2(-g,u),this._z=0);break;case"ZXY":this._x=Math.asin(wt(S,-1,1)),Math.abs(S)<.9999999?(this._y=Math.atan2(-g,y),this._z=Math.atan2(-d,v)):(this._y=0,this._z=Math.atan2(m,u));break;case"ZYX":this._y=Math.asin(-wt(g,-1,1)),Math.abs(g)<.9999999?(this._x=Math.atan2(S,y),this._z=Math.atan2(m,u)):(this._x=0,this._z=Math.atan2(-d,v));break;case"YZX":this._z=Math.asin(wt(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-x,v),this._y=Math.atan2(-g,u)):(this._x=0,this._y=Math.atan2(h,y));break;case"XZY":this._z=Math.asin(-wt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(S,v),this._y=Math.atan2(h,u)):(this._x=Math.atan2(-x,y),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,o===!0&&this._onChangeCallback(),this}setFromQuaternion(t,i,o){return Sx.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Sx,i,o)}setFromVector3(t,i=this._order){return this.set(t.x,t.y,t.z,i)}reorder(t){return Mx.setFromEuler(this),this.setFromQuaternion(Mx,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ua.DEFAULT_ORDER="XYZ";class Hy{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let lT=0;const Ex=new ne,so=new Vl,wa=new an,Su=new ne,Rl=new ne,cT=new ne,uT=new Vl,Tx=new ne(1,0,0),bx=new ne(0,1,0),Ax=new ne(0,0,1),Cx={type:"added"},fT={type:"removed"},ro={type:"childadded",child:null},np={type:"childremoved",child:null};class Ln extends Ro{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lT++}),this.uuid=Gl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ln.DEFAULT_UP.clone();const t=new ne,i=new ua,o=new Vl,l=new ne(1,1,1);function u(){o.setFromEuler(i,!1)}function d(){i.setFromQuaternion(o,void 0,!1)}i._onChange(u),o._onChange(d),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:o},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new an},normalMatrix:{value:new vt}}),this.matrix=new an,this.matrixWorld=new an,this.matrixAutoUpdate=Ln.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ln.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Hy,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,i){this.quaternion.setFromAxisAngle(t,i)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,i){return so.setFromAxisAngle(t,i),this.quaternion.multiply(so),this}rotateOnWorldAxis(t,i){return so.setFromAxisAngle(t,i),this.quaternion.premultiply(so),this}rotateX(t){return this.rotateOnAxis(Tx,t)}rotateY(t){return this.rotateOnAxis(bx,t)}rotateZ(t){return this.rotateOnAxis(Ax,t)}translateOnAxis(t,i){return Ex.copy(t).applyQuaternion(this.quaternion),this.position.add(Ex.multiplyScalar(i)),this}translateX(t){return this.translateOnAxis(Tx,t)}translateY(t){return this.translateOnAxis(bx,t)}translateZ(t){return this.translateOnAxis(Ax,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(wa.copy(this.matrixWorld).invert())}lookAt(t,i,o){t.isVector3?Su.copy(t):Su.set(t,i,o);const l=this.parent;this.updateWorldMatrix(!0,!1),Rl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wa.lookAt(Rl,Su,this.up):wa.lookAt(Su,Rl,this.up),this.quaternion.setFromRotationMatrix(wa),l&&(wa.extractRotation(l.matrixWorld),so.setFromRotationMatrix(wa),this.quaternion.premultiply(so.invert()))}add(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Cx),ro.child=t,this.dispatchEvent(ro),ro.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let o=0;o<arguments.length;o++)this.remove(arguments[o]);return this}const i=this.children.indexOf(t);return i!==-1&&(t.parent=null,this.children.splice(i,1),t.dispatchEvent(fT),np.child=t,this.dispatchEvent(np),np.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),wa.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),wa.multiply(t.parent.matrixWorld)),t.applyMatrix4(wa),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Cx),ro.child=t,this.dispatchEvent(ro),ro.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,i){if(this[t]===i)return this;for(let o=0,l=this.children.length;o<l;o++){const d=this.children[o].getObjectByProperty(t,i);if(d!==void 0)return d}}getObjectsByProperty(t,i,o=[]){this[t]===i&&o.push(this);const l=this.children;for(let u=0,d=l.length;u<d;u++)l[u].getObjectsByProperty(t,i,o);return o}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Rl,t,cT),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Rl,uT,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return t.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(t){t(this);const i=this.children;for(let o=0,l=i.length;o<l;o++)i[o].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const i=this.children;for(let o=0,l=i.length;o<l;o++)i[o].traverseVisible(t)}traverseAncestors(t){const i=this.parent;i!==null&&(t(i),i.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const i=this.children;for(let o=0,l=i.length;o<l;o++)i[o].updateMatrixWorld(t)}updateWorldMatrix(t,i){const o=this.parent;if(t===!0&&o!==null&&o.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let u=0,d=l.length;u<d;u++)l[u].updateWorldMatrix(!1,!0)}}toJSON(t){const i=t===void 0||typeof t=="string",o={};i&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},o.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.geometryInfo=this._geometryInfo.map(h=>({...h,boundingBox:h.boundingBox?h.boundingBox.toJSON():void 0,boundingSphere:h.boundingSphere?h.boundingSphere.toJSON():void 0})),l.instanceInfo=this._instanceInfo.map(h=>({...h})),l.availableInstanceIds=this._availableInstanceIds.slice(),l.availableGeometryIds=this._availableGeometryIds.slice(),l.nextIndexStart=this._nextIndexStart,l.nextVertexStart=this._nextVertexStart,l.geometryCount=this._geometryCount,l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.matricesTexture=this._matricesTexture.toJSON(t),l.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(l.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(l.boundingBox=this.boundingBox.toJSON()));function u(h,m){return h[m.uuid]===void 0&&(h[m.uuid]=m.toJSON(t)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=u(t.geometries,this.geometry);const h=this.geometry.parameters;if(h!==void 0&&h.shapes!==void 0){const m=h.shapes;if(Array.isArray(m))for(let v=0,x=m.length;v<x;v++){const g=m[v];u(t.shapes,g)}else u(t.shapes,m)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(u(t.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const h=[];for(let m=0,v=this.material.length;m<v;m++)h.push(u(t.materials,this.material[m]));l.material=h}else l.material=u(t.materials,this.material);if(this.children.length>0){l.children=[];for(let h=0;h<this.children.length;h++)l.children.push(this.children[h].toJSON(t).object)}if(this.animations.length>0){l.animations=[];for(let h=0;h<this.animations.length;h++){const m=this.animations[h];l.animations.push(u(t.animations,m))}}if(i){const h=d(t.geometries),m=d(t.materials),v=d(t.textures),x=d(t.images),g=d(t.shapes),S=d(t.skeletons),y=d(t.animations),T=d(t.nodes);h.length>0&&(o.geometries=h),m.length>0&&(o.materials=m),v.length>0&&(o.textures=v),x.length>0&&(o.images=x),g.length>0&&(o.shapes=g),S.length>0&&(o.skeletons=S),y.length>0&&(o.animations=y),T.length>0&&(o.nodes=T)}return o.object=l,o;function d(h){const m=[];for(const v in h){const x=h[v];delete x.metadata,m.push(x)}return m}}clone(t){return new this.constructor().copy(this,t)}copy(t,i=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),i===!0)for(let o=0;o<t.children.length;o++){const l=t.children[o];this.add(l.clone())}return this}}Ln.DEFAULT_UP=new ne(0,1,0);Ln.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ln.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Hi=new ne,Na=new ne,ip=new ne,Da=new ne,oo=new ne,lo=new ne,Rx=new ne,ap=new ne,sp=new ne,rp=new ne,op=new Wt,lp=new Wt,cp=new Wt;class Vi{constructor(t=new ne,i=new ne,o=new ne){this.a=t,this.b=i,this.c=o}static getNormal(t,i,o,l){l.subVectors(o,i),Hi.subVectors(t,i),l.cross(Hi);const u=l.lengthSq();return u>0?l.multiplyScalar(1/Math.sqrt(u)):l.set(0,0,0)}static getBarycoord(t,i,o,l,u){Hi.subVectors(l,i),Na.subVectors(o,i),ip.subVectors(t,i);const d=Hi.dot(Hi),h=Hi.dot(Na),m=Hi.dot(ip),v=Na.dot(Na),x=Na.dot(ip),g=d*v-h*h;if(g===0)return u.set(0,0,0),null;const S=1/g,y=(v*m-h*x)*S,T=(d*x-h*m)*S;return u.set(1-y-T,T,y)}static containsPoint(t,i,o,l){return this.getBarycoord(t,i,o,l,Da)===null?!1:Da.x>=0&&Da.y>=0&&Da.x+Da.y<=1}static getInterpolation(t,i,o,l,u,d,h,m){return this.getBarycoord(t,i,o,l,Da)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(u,Da.x),m.addScaledVector(d,Da.y),m.addScaledVector(h,Da.z),m)}static getInterpolatedAttribute(t,i,o,l,u,d){return op.setScalar(0),lp.setScalar(0),cp.setScalar(0),op.fromBufferAttribute(t,i),lp.fromBufferAttribute(t,o),cp.fromBufferAttribute(t,l),d.setScalar(0),d.addScaledVector(op,u.x),d.addScaledVector(lp,u.y),d.addScaledVector(cp,u.z),d}static isFrontFacing(t,i,o,l){return Hi.subVectors(o,i),Na.subVectors(t,i),Hi.cross(Na).dot(l)<0}set(t,i,o){return this.a.copy(t),this.b.copy(i),this.c.copy(o),this}setFromPointsAndIndices(t,i,o,l){return this.a.copy(t[i]),this.b.copy(t[o]),this.c.copy(t[l]),this}setFromAttributeAndIndices(t,i,o,l){return this.a.fromBufferAttribute(t,i),this.b.fromBufferAttribute(t,o),this.c.fromBufferAttribute(t,l),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Hi.subVectors(this.c,this.b),Na.subVectors(this.a,this.b),Hi.cross(Na).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Vi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,i){return Vi.getBarycoord(t,this.a,this.b,this.c,i)}getInterpolation(t,i,o,l,u){return Vi.getInterpolation(t,this.a,this.b,this.c,i,o,l,u)}containsPoint(t){return Vi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Vi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,i){const o=this.a,l=this.b,u=this.c;let d,h;oo.subVectors(l,o),lo.subVectors(u,o),ap.subVectors(t,o);const m=oo.dot(ap),v=lo.dot(ap);if(m<=0&&v<=0)return i.copy(o);sp.subVectors(t,l);const x=oo.dot(sp),g=lo.dot(sp);if(x>=0&&g<=x)return i.copy(l);const S=m*g-x*v;if(S<=0&&m>=0&&x<=0)return d=m/(m-x),i.copy(o).addScaledVector(oo,d);rp.subVectors(t,u);const y=oo.dot(rp),T=lo.dot(rp);if(T>=0&&y<=T)return i.copy(u);const C=y*v-m*T;if(C<=0&&v>=0&&T<=0)return h=v/(v-T),i.copy(o).addScaledVector(lo,h);const E=x*T-y*g;if(E<=0&&g-x>=0&&y-T>=0)return Rx.subVectors(u,l),h=(g-x)/(g-x+(y-T)),i.copy(l).addScaledVector(Rx,h);const M=1/(E+C+S);return d=C*M,h=S*M,i.copy(o).addScaledVector(oo,d).addScaledVector(lo,h)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Gy={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ms={h:0,s:0,l:0},Mu={h:0,s:0,l:0};function up(r,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?r+(t-r)*6*i:i<1/2?t:i<2/3?r+(t-r)*6*(2/3-i):r}class Rt{constructor(t,i,o){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,i,o)}set(t,i,o){if(i===void 0&&o===void 0){const l=t;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(t,i,o);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,i=ei){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Ut.colorSpaceToWorking(this,i),this}setRGB(t,i,o,l=Ut.workingColorSpace){return this.r=t,this.g=i,this.b=o,Ut.colorSpaceToWorking(this,l),this}setHSL(t,i,o,l=Ut.workingColorSpace){if(t=KE(t,1),i=wt(i,0,1),o=wt(o,0,1),i===0)this.r=this.g=this.b=o;else{const u=o<=.5?o*(1+i):o+i-o*i,d=2*o-u;this.r=up(d,u,t+1/3),this.g=up(d,u,t),this.b=up(d,u,t-1/3)}return Ut.colorSpaceToWorking(this,l),this}setStyle(t,i=ei){function o(u){u!==void 0&&parseFloat(u)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(t)){let u;const d=l[1],h=l[2];switch(d){case"rgb":case"rgba":if(u=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return o(u[4]),this.setRGB(Math.min(255,parseInt(u[1],10))/255,Math.min(255,parseInt(u[2],10))/255,Math.min(255,parseInt(u[3],10))/255,i);if(u=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return o(u[4]),this.setRGB(Math.min(100,parseInt(u[1],10))/100,Math.min(100,parseInt(u[2],10))/100,Math.min(100,parseInt(u[3],10))/100,i);break;case"hsl":case"hsla":if(u=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return o(u[4]),this.setHSL(parseFloat(u[1])/360,parseFloat(u[2])/100,parseFloat(u[3])/100,i);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(t)){const u=l[1],d=u.length;if(d===3)return this.setRGB(parseInt(u.charAt(0),16)/15,parseInt(u.charAt(1),16)/15,parseInt(u.charAt(2),16)/15,i);if(d===6)return this.setHex(parseInt(u,16),i);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,i);return this}setColorName(t,i=ei){const o=Gy[t.toLowerCase()];return o!==void 0?this.setHex(o,i):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Pa(t.r),this.g=Pa(t.g),this.b=Pa(t.b),this}copyLinearToSRGB(t){return this.r=_o(t.r),this.g=_o(t.g),this.b=_o(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ei){return Ut.workingToColorSpace(Bn.copy(this),t),Math.round(wt(Bn.r*255,0,255))*65536+Math.round(wt(Bn.g*255,0,255))*256+Math.round(wt(Bn.b*255,0,255))}getHexString(t=ei){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,i=Ut.workingColorSpace){Ut.workingToColorSpace(Bn.copy(this),i);const o=Bn.r,l=Bn.g,u=Bn.b,d=Math.max(o,l,u),h=Math.min(o,l,u);let m,v;const x=(h+d)/2;if(h===d)m=0,v=0;else{const g=d-h;switch(v=x<=.5?g/(d+h):g/(2-d-h),d){case o:m=(l-u)/g+(l<u?6:0);break;case l:m=(u-o)/g+2;break;case u:m=(o-l)/g+4;break}m/=6}return t.h=m,t.s=v,t.l=x,t}getRGB(t,i=Ut.workingColorSpace){return Ut.workingToColorSpace(Bn.copy(this),i),t.r=Bn.r,t.g=Bn.g,t.b=Bn.b,t}getStyle(t=ei){Ut.workingToColorSpace(Bn.copy(this),t);const i=Bn.r,o=Bn.g,l=Bn.b;return t!==ei?`color(${t} ${i.toFixed(3)} ${o.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(o*255)},${Math.round(l*255)})`}offsetHSL(t,i,o){return this.getHSL(ms),this.setHSL(ms.h+t,ms.s+i,ms.l+o)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,i){return this.r=t.r+i.r,this.g=t.g+i.g,this.b=t.b+i.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,i){return this.r+=(t.r-this.r)*i,this.g+=(t.g-this.g)*i,this.b+=(t.b-this.b)*i,this}lerpColors(t,i,o){return this.r=t.r+(i.r-t.r)*o,this.g=t.g+(i.g-t.g)*o,this.b=t.b+(i.b-t.b)*o,this}lerpHSL(t,i){this.getHSL(ms),t.getHSL(Mu);const o=qh(ms.h,Mu.h,i),l=qh(ms.s,Mu.s,i),u=qh(ms.l,Mu.l,i);return this.setHSL(o,l,u),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const i=this.r,o=this.g,l=this.b,u=t.elements;return this.r=u[0]*i+u[3]*o+u[6]*l,this.g=u[1]*i+u[4]*o+u[7]*l,this.b=u[2]*i+u[5]*o+u[8]*l,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,i=0){return this.r=t[i],this.g=t[i+1],this.b=t[i+2],this}toArray(t=[],i=0){return t[i]=this.r,t[i+1]=this.g,t[i+2]=this.b,t}fromBufferAttribute(t,i){return this.r=t.getX(i),this.g=t.getY(i),this.b=t.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Bn=new Rt;Rt.NAMES=Gy;let dT=0;class wo extends Ro{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:dT++}),this.uuid=Gl(),this.name="",this.type="Material",this.blending=vo,this.side=Ms,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wp,this.blendDst=Np,this.blendEquation=ir,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Rt(0,0,0),this.blendAlpha=0,this.depthFunc=Mo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=px,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=$r,this.stencilZFail=$r,this.stencilZPass=$r,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const i in t){const o=t[i];if(o===void 0){console.warn(`THREE.Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(o):l&&l.isVector3&&o&&o.isVector3?l.copy(o):this[i]=o}}toJSON(t){const i=t===void 0||typeof t=="string";i&&(t={textures:{},images:{}});const o={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.color&&this.color.isColor&&(o.color=this.color.getHex()),this.roughness!==void 0&&(o.roughness=this.roughness),this.metalness!==void 0&&(o.metalness=this.metalness),this.sheen!==void 0&&(o.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(o.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(o.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(o.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(o.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(o.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(o.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(o.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(o.shininess=this.shininess),this.clearcoat!==void 0&&(o.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(o.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(o.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(o.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(o.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,o.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(o.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(o.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(o.dispersion=this.dispersion),this.iridescence!==void 0&&(o.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(o.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(o.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(o.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(o.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(o.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(o.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(o.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(o.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(o.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(o.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(o.lightMap=this.lightMap.toJSON(t).uuid,o.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(o.aoMap=this.aoMap.toJSON(t).uuid,o.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(o.bumpMap=this.bumpMap.toJSON(t).uuid,o.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(o.normalMap=this.normalMap.toJSON(t).uuid,o.normalMapType=this.normalMapType,o.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(o.displacementMap=this.displacementMap.toJSON(t).uuid,o.displacementScale=this.displacementScale,o.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(o.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(o.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(o.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(o.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(o.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(o.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(o.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(o.combine=this.combine)),this.envMapRotation!==void 0&&(o.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(o.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(o.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(o.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(o.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(o.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(o.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(o.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(o.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(o.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(o.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(o.size=this.size),this.shadowSide!==null&&(o.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(o.sizeAttenuation=this.sizeAttenuation),this.blending!==vo&&(o.blending=this.blending),this.side!==Ms&&(o.side=this.side),this.vertexColors===!0&&(o.vertexColors=!0),this.opacity<1&&(o.opacity=this.opacity),this.transparent===!0&&(o.transparent=!0),this.blendSrc!==wp&&(o.blendSrc=this.blendSrc),this.blendDst!==Np&&(o.blendDst=this.blendDst),this.blendEquation!==ir&&(o.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(o.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(o.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(o.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(o.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(o.blendAlpha=this.blendAlpha),this.depthFunc!==Mo&&(o.depthFunc=this.depthFunc),this.depthTest===!1&&(o.depthTest=this.depthTest),this.depthWrite===!1&&(o.depthWrite=this.depthWrite),this.colorWrite===!1&&(o.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(o.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==px&&(o.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(o.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(o.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==$r&&(o.stencilFail=this.stencilFail),this.stencilZFail!==$r&&(o.stencilZFail=this.stencilZFail),this.stencilZPass!==$r&&(o.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(o.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(o.rotation=this.rotation),this.polygonOffset===!0&&(o.polygonOffset=!0),this.polygonOffsetFactor!==0&&(o.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(o.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(o.linewidth=this.linewidth),this.dashSize!==void 0&&(o.dashSize=this.dashSize),this.gapSize!==void 0&&(o.gapSize=this.gapSize),this.scale!==void 0&&(o.scale=this.scale),this.dithering===!0&&(o.dithering=!0),this.alphaTest>0&&(o.alphaTest=this.alphaTest),this.alphaHash===!0&&(o.alphaHash=!0),this.alphaToCoverage===!0&&(o.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(o.premultipliedAlpha=!0),this.forceSinglePass===!0&&(o.forceSinglePass=!0),this.wireframe===!0&&(o.wireframe=!0),this.wireframeLinewidth>1&&(o.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(o.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(o.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(o.flatShading=!0),this.visible===!1&&(o.visible=!1),this.toneMapped===!1&&(o.toneMapped=!1),this.fog===!1&&(o.fog=!1),Object.keys(this.userData).length>0&&(o.userData=this.userData);function l(u){const d=[];for(const h in u){const m=u[h];delete m.metadata,d.push(m)}return d}if(i){const u=l(t.textures),d=l(t.images);u.length>0&&(o.textures=u),d.length>0&&(o.images=d)}return o}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const i=t.clippingPlanes;let o=null;if(i!==null){const l=i.length;o=new Array(l);for(let u=0;u!==l;++u)o[u]=i[u].clone()}return this.clippingPlanes=o,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class xo extends wo{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ua,this.combine=xy,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const mn=new ne,Eu=new ft;let hT=0;class qi{constructor(t,i,o=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:hT++}),this.name="",this.array=t,this.itemSize=i,this.count=t!==void 0?t.length/i:0,this.normalized=o,this.usage=mx,this.updateRanges=[],this.gpuType=La,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,i,o){t*=this.itemSize,o*=i.itemSize;for(let l=0,u=this.itemSize;l<u;l++)this.array[t+l]=i.array[o+l];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let i=0,o=this.count;i<o;i++)Eu.fromBufferAttribute(this,i),Eu.applyMatrix3(t),this.setXY(i,Eu.x,Eu.y);else if(this.itemSize===3)for(let i=0,o=this.count;i<o;i++)mn.fromBufferAttribute(this,i),mn.applyMatrix3(t),this.setXYZ(i,mn.x,mn.y,mn.z);return this}applyMatrix4(t){for(let i=0,o=this.count;i<o;i++)mn.fromBufferAttribute(this,i),mn.applyMatrix4(t),this.setXYZ(i,mn.x,mn.y,mn.z);return this}applyNormalMatrix(t){for(let i=0,o=this.count;i<o;i++)mn.fromBufferAttribute(this,i),mn.applyNormalMatrix(t),this.setXYZ(i,mn.x,mn.y,mn.z);return this}transformDirection(t){for(let i=0,o=this.count;i<o;i++)mn.fromBufferAttribute(this,i),mn.transformDirection(t),this.setXYZ(i,mn.x,mn.y,mn.z);return this}set(t,i=0){return this.array.set(t,i),this}getComponent(t,i){let o=this.array[t*this.itemSize+i];return this.normalized&&(o=bl(o,this.array)),o}setComponent(t,i,o){return this.normalized&&(o=$n(o,this.array)),this.array[t*this.itemSize+i]=o,this}getX(t){let i=this.array[t*this.itemSize];return this.normalized&&(i=bl(i,this.array)),i}setX(t,i){return this.normalized&&(i=$n(i,this.array)),this.array[t*this.itemSize]=i,this}getY(t){let i=this.array[t*this.itemSize+1];return this.normalized&&(i=bl(i,this.array)),i}setY(t,i){return this.normalized&&(i=$n(i,this.array)),this.array[t*this.itemSize+1]=i,this}getZ(t){let i=this.array[t*this.itemSize+2];return this.normalized&&(i=bl(i,this.array)),i}setZ(t,i){return this.normalized&&(i=$n(i,this.array)),this.array[t*this.itemSize+2]=i,this}getW(t){let i=this.array[t*this.itemSize+3];return this.normalized&&(i=bl(i,this.array)),i}setW(t,i){return this.normalized&&(i=$n(i,this.array)),this.array[t*this.itemSize+3]=i,this}setXY(t,i,o){return t*=this.itemSize,this.normalized&&(i=$n(i,this.array),o=$n(o,this.array)),this.array[t+0]=i,this.array[t+1]=o,this}setXYZ(t,i,o,l){return t*=this.itemSize,this.normalized&&(i=$n(i,this.array),o=$n(o,this.array),l=$n(l,this.array)),this.array[t+0]=i,this.array[t+1]=o,this.array[t+2]=l,this}setXYZW(t,i,o,l,u){return t*=this.itemSize,this.normalized&&(i=$n(i,this.array),o=$n(o,this.array),l=$n(l,this.array),u=$n(u,this.array)),this.array[t+0]=i,this.array[t+1]=o,this.array[t+2]=l,this.array[t+3]=u,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==mx&&(t.usage=this.usage),t}}class Vy extends qi{constructor(t,i,o){super(new Uint16Array(t),i,o)}}class jy extends qi{constructor(t,i,o){super(new Uint32Array(t),i,o)}}class Di extends qi{constructor(t,i,o){super(new Float32Array(t),i,o)}}let pT=0;const Ai=new an,fp=new Ln,co=new ne,di=new jl,wl=new jl,bn=new ne;class Yi extends Ro{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:pT++}),this.uuid=Gl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Iy(t)?jy:Vy)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,i){return this.attributes[t]=i,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,i,o=0){this.groups.push({start:t,count:i,materialIndex:o})}clearGroups(){this.groups=[]}setDrawRange(t,i){this.drawRange.start=t,this.drawRange.count=i}applyMatrix4(t){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(t),i.needsUpdate=!0);const o=this.attributes.normal;if(o!==void 0){const u=new vt().getNormalMatrix(t);o.applyNormalMatrix(u),o.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(t),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ai.makeRotationFromQuaternion(t),this.applyMatrix4(Ai),this}rotateX(t){return Ai.makeRotationX(t),this.applyMatrix4(Ai),this}rotateY(t){return Ai.makeRotationY(t),this.applyMatrix4(Ai),this}rotateZ(t){return Ai.makeRotationZ(t),this.applyMatrix4(Ai),this}translate(t,i,o){return Ai.makeTranslation(t,i,o),this.applyMatrix4(Ai),this}scale(t,i,o){return Ai.makeScale(t,i,o),this.applyMatrix4(Ai),this}lookAt(t){return fp.lookAt(t),fp.updateMatrix(),this.applyMatrix4(fp.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(co).negate(),this.translate(co.x,co.y,co.z),this}setFromPoints(t){const i=this.getAttribute("position");if(i===void 0){const o=[];for(let l=0,u=t.length;l<u;l++){const d=t[l];o.push(d.x,d.y,d.z||0)}this.setAttribute("position",new Di(o,3))}else{const o=Math.min(t.length,i.count);for(let l=0;l<o;l++){const u=t[l];i.setXYZ(l,u.x,u.y,u.z||0)}t.length>i.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new jl);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new ne(-1/0,-1/0,-1/0),new ne(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),i)for(let o=0,l=i.length;o<l;o++){const u=i[o];di.setFromBufferAttribute(u),this.morphTargetsRelative?(bn.addVectors(this.boundingBox.min,di.min),this.boundingBox.expandByPoint(bn),bn.addVectors(this.boundingBox.max,di.max),this.boundingBox.expandByPoint(bn)):(this.boundingBox.expandByPoint(di.min),this.boundingBox.expandByPoint(di.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new af);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new ne,1/0);return}if(t){const o=this.boundingSphere.center;if(di.setFromBufferAttribute(t),i)for(let u=0,d=i.length;u<d;u++){const h=i[u];wl.setFromBufferAttribute(h),this.morphTargetsRelative?(bn.addVectors(di.min,wl.min),di.expandByPoint(bn),bn.addVectors(di.max,wl.max),di.expandByPoint(bn)):(di.expandByPoint(wl.min),di.expandByPoint(wl.max))}di.getCenter(o);let l=0;for(let u=0,d=t.count;u<d;u++)bn.fromBufferAttribute(t,u),l=Math.max(l,o.distanceToSquared(bn));if(i)for(let u=0,d=i.length;u<d;u++){const h=i[u],m=this.morphTargetsRelative;for(let v=0,x=h.count;v<x;v++)bn.fromBufferAttribute(h,v),m&&(co.fromBufferAttribute(t,v),bn.add(co)),l=Math.max(l,o.distanceToSquared(bn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,i=this.attributes;if(t===null||i.position===void 0||i.normal===void 0||i.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const o=i.position,l=i.normal,u=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qi(new Float32Array(4*o.count),4));const d=this.getAttribute("tangent"),h=[],m=[];for(let X=0;X<o.count;X++)h[X]=new ne,m[X]=new ne;const v=new ne,x=new ne,g=new ne,S=new ft,y=new ft,T=new ft,C=new ne,E=new ne;function M(X,w,N){v.fromBufferAttribute(o,X),x.fromBufferAttribute(o,w),g.fromBufferAttribute(o,N),S.fromBufferAttribute(u,X),y.fromBufferAttribute(u,w),T.fromBufferAttribute(u,N),x.sub(v),g.sub(v),y.sub(S),T.sub(S);const B=1/(y.x*T.y-T.x*y.y);isFinite(B)&&(C.copy(x).multiplyScalar(T.y).addScaledVector(g,-y.y).multiplyScalar(B),E.copy(g).multiplyScalar(y.x).addScaledVector(x,-T.x).multiplyScalar(B),h[X].add(C),h[w].add(C),h[N].add(C),m[X].add(E),m[w].add(E),m[N].add(E))}let O=this.groups;O.length===0&&(O=[{start:0,count:t.count}]);for(let X=0,w=O.length;X<w;++X){const N=O[X],B=N.start,k=N.count;for(let le=B,pe=B+k;le<pe;le+=3)M(t.getX(le+0),t.getX(le+1),t.getX(le+2))}const I=new ne,D=new ne,V=new ne,H=new ne;function z(X){V.fromBufferAttribute(l,X),H.copy(V);const w=h[X];I.copy(w),I.sub(V.multiplyScalar(V.dot(w))).normalize(),D.crossVectors(H,w);const B=D.dot(m[X])<0?-1:1;d.setXYZW(X,I.x,I.y,I.z,B)}for(let X=0,w=O.length;X<w;++X){const N=O[X],B=N.start,k=N.count;for(let le=B,pe=B+k;le<pe;le+=3)z(t.getX(le+0)),z(t.getX(le+1)),z(t.getX(le+2))}}computeVertexNormals(){const t=this.index,i=this.getAttribute("position");if(i!==void 0){let o=this.getAttribute("normal");if(o===void 0)o=new qi(new Float32Array(i.count*3),3),this.setAttribute("normal",o);else for(let S=0,y=o.count;S<y;S++)o.setXYZ(S,0,0,0);const l=new ne,u=new ne,d=new ne,h=new ne,m=new ne,v=new ne,x=new ne,g=new ne;if(t)for(let S=0,y=t.count;S<y;S+=3){const T=t.getX(S+0),C=t.getX(S+1),E=t.getX(S+2);l.fromBufferAttribute(i,T),u.fromBufferAttribute(i,C),d.fromBufferAttribute(i,E),x.subVectors(d,u),g.subVectors(l,u),x.cross(g),h.fromBufferAttribute(o,T),m.fromBufferAttribute(o,C),v.fromBufferAttribute(o,E),h.add(x),m.add(x),v.add(x),o.setXYZ(T,h.x,h.y,h.z),o.setXYZ(C,m.x,m.y,m.z),o.setXYZ(E,v.x,v.y,v.z)}else for(let S=0,y=i.count;S<y;S+=3)l.fromBufferAttribute(i,S+0),u.fromBufferAttribute(i,S+1),d.fromBufferAttribute(i,S+2),x.subVectors(d,u),g.subVectors(l,u),x.cross(g),o.setXYZ(S+0,x.x,x.y,x.z),o.setXYZ(S+1,x.x,x.y,x.z),o.setXYZ(S+2,x.x,x.y,x.z);this.normalizeNormals(),o.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let i=0,o=t.count;i<o;i++)bn.fromBufferAttribute(t,i),bn.normalize(),t.setXYZ(i,bn.x,bn.y,bn.z)}toNonIndexed(){function t(h,m){const v=h.array,x=h.itemSize,g=h.normalized,S=new v.constructor(m.length*x);let y=0,T=0;for(let C=0,E=m.length;C<E;C++){h.isInterleavedBufferAttribute?y=m[C]*h.data.stride+h.offset:y=m[C]*x;for(let M=0;M<x;M++)S[T++]=v[y++]}return new qi(S,x,g)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new Yi,o=this.index.array,l=this.attributes;for(const h in l){const m=l[h],v=t(m,o);i.setAttribute(h,v)}const u=this.morphAttributes;for(const h in u){const m=[],v=u[h];for(let x=0,g=v.length;x<g;x++){const S=v[x],y=t(S,o);m.push(y)}i.morphAttributes[h]=m}i.morphTargetsRelative=this.morphTargetsRelative;const d=this.groups;for(let h=0,m=d.length;h<m;h++){const v=d[h];i.addGroup(v.start,v.count,v.materialIndex)}return i}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const v in m)m[v]!==void 0&&(t[v]=m[v]);return t}t.data={attributes:{}};const i=this.index;i!==null&&(t.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const o=this.attributes;for(const m in o){const v=o[m];t.data.attributes[m]=v.toJSON(t.data)}const l={};let u=!1;for(const m in this.morphAttributes){const v=this.morphAttributes[m],x=[];for(let g=0,S=v.length;g<S;g++){const y=v[g];x.push(y.toJSON(t.data))}x.length>0&&(l[m]=x,u=!0)}u&&(t.data.morphAttributes=l,t.data.morphTargetsRelative=this.morphTargetsRelative);const d=this.groups;d.length>0&&(t.data.groups=JSON.parse(JSON.stringify(d)));const h=this.boundingSphere;return h!==null&&(t.data.boundingSphere=h.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=t.name;const o=t.index;o!==null&&this.setIndex(o.clone());const l=t.attributes;for(const v in l){const x=l[v];this.setAttribute(v,x.clone(i))}const u=t.morphAttributes;for(const v in u){const x=[],g=u[v];for(let S=0,y=g.length;S<y;S++)x.push(g[S].clone(i));this.morphAttributes[v]=x}this.morphTargetsRelative=t.morphTargetsRelative;const d=t.groups;for(let v=0,x=d.length;v<x;v++){const g=d[v];this.addGroup(g.start,g.count,g.materialIndex)}const h=t.boundingBox;h!==null&&(this.boundingBox=h.clone());const m=t.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const wx=new an,Ks=new Fy,Tu=new af,Nx=new ne,bu=new ne,Au=new ne,Cu=new ne,dp=new ne,Ru=new ne,Dx=new ne,wu=new ne;class pi extends Ln{constructor(t=new Yi,i=new xo){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,o=Object.keys(i);if(o.length>0){const l=i[o[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,d=l.length;u<d;u++){const h=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[h]=u}}}}getVertexPosition(t,i){const o=this.geometry,l=o.attributes.position,u=o.morphAttributes.position,d=o.morphTargetsRelative;i.fromBufferAttribute(l,t);const h=this.morphTargetInfluences;if(u&&h){Ru.set(0,0,0);for(let m=0,v=u.length;m<v;m++){const x=h[m],g=u[m];x!==0&&(dp.fromBufferAttribute(g,t),d?Ru.addScaledVector(dp,x):Ru.addScaledVector(dp.sub(i),x))}i.add(Ru)}return i}raycast(t,i){const o=this.geometry,l=this.material,u=this.matrixWorld;l!==void 0&&(o.boundingSphere===null&&o.computeBoundingSphere(),Tu.copy(o.boundingSphere),Tu.applyMatrix4(u),Ks.copy(t.ray).recast(t.near),!(Tu.containsPoint(Ks.origin)===!1&&(Ks.intersectSphere(Tu,Nx)===null||Ks.origin.distanceToSquared(Nx)>(t.far-t.near)**2))&&(wx.copy(u).invert(),Ks.copy(t.ray).applyMatrix4(wx),!(o.boundingBox!==null&&Ks.intersectsBox(o.boundingBox)===!1)&&this._computeIntersections(t,i,Ks)))}_computeIntersections(t,i,o){let l;const u=this.geometry,d=this.material,h=u.index,m=u.attributes.position,v=u.attributes.uv,x=u.attributes.uv1,g=u.attributes.normal,S=u.groups,y=u.drawRange;if(h!==null)if(Array.isArray(d))for(let T=0,C=S.length;T<C;T++){const E=S[T],M=d[E.materialIndex],O=Math.max(E.start,y.start),I=Math.min(h.count,Math.min(E.start+E.count,y.start+y.count));for(let D=O,V=I;D<V;D+=3){const H=h.getX(D),z=h.getX(D+1),X=h.getX(D+2);l=Nu(this,M,t,o,v,x,g,H,z,X),l&&(l.faceIndex=Math.floor(D/3),l.face.materialIndex=E.materialIndex,i.push(l))}}else{const T=Math.max(0,y.start),C=Math.min(h.count,y.start+y.count);for(let E=T,M=C;E<M;E+=3){const O=h.getX(E),I=h.getX(E+1),D=h.getX(E+2);l=Nu(this,d,t,o,v,x,g,O,I,D),l&&(l.faceIndex=Math.floor(E/3),i.push(l))}}else if(m!==void 0)if(Array.isArray(d))for(let T=0,C=S.length;T<C;T++){const E=S[T],M=d[E.materialIndex],O=Math.max(E.start,y.start),I=Math.min(m.count,Math.min(E.start+E.count,y.start+y.count));for(let D=O,V=I;D<V;D+=3){const H=D,z=D+1,X=D+2;l=Nu(this,M,t,o,v,x,g,H,z,X),l&&(l.faceIndex=Math.floor(D/3),l.face.materialIndex=E.materialIndex,i.push(l))}}else{const T=Math.max(0,y.start),C=Math.min(m.count,y.start+y.count);for(let E=T,M=C;E<M;E+=3){const O=E,I=E+1,D=E+2;l=Nu(this,d,t,o,v,x,g,O,I,D),l&&(l.faceIndex=Math.floor(E/3),i.push(l))}}}}function mT(r,t,i,o,l,u,d,h){let m;if(t.side===ti?m=o.intersectTriangle(d,u,l,!0,h):m=o.intersectTriangle(l,u,d,t.side===Ms,h),m===null)return null;wu.copy(h),wu.applyMatrix4(r.matrixWorld);const v=i.ray.origin.distanceTo(wu);return v<i.near||v>i.far?null:{distance:v,point:wu.clone(),object:r}}function Nu(r,t,i,o,l,u,d,h,m,v){r.getVertexPosition(h,bu),r.getVertexPosition(m,Au),r.getVertexPosition(v,Cu);const x=mT(r,t,i,o,bu,Au,Cu,Dx);if(x){const g=new ne;Vi.getBarycoord(Dx,bu,Au,Cu,g),l&&(x.uv=Vi.getInterpolatedAttribute(l,h,m,v,g,new ft)),u&&(x.uv1=Vi.getInterpolatedAttribute(u,h,m,v,g,new ft)),d&&(x.normal=Vi.getInterpolatedAttribute(d,h,m,v,g,new ne),x.normal.dot(o.direction)>0&&x.normal.multiplyScalar(-1));const S={a:h,b:m,c:v,normal:new ne,materialIndex:0};Vi.getNormal(bu,Au,Cu,S.normal),x.face=S,x.barycoord=g}return x}class No extends Yi{constructor(t=1,i=1,o=1,l=1,u=1,d=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:i,depth:o,widthSegments:l,heightSegments:u,depthSegments:d};const h=this;l=Math.floor(l),u=Math.floor(u),d=Math.floor(d);const m=[],v=[],x=[],g=[];let S=0,y=0;T("z","y","x",-1,-1,o,i,t,d,u,0),T("z","y","x",1,-1,o,i,-t,d,u,1),T("x","z","y",1,1,t,o,i,l,d,2),T("x","z","y",1,-1,t,o,-i,l,d,3),T("x","y","z",1,-1,t,i,o,l,u,4),T("x","y","z",-1,-1,t,i,-o,l,u,5),this.setIndex(m),this.setAttribute("position",new Di(v,3)),this.setAttribute("normal",new Di(x,3)),this.setAttribute("uv",new Di(g,2));function T(C,E,M,O,I,D,V,H,z,X,w){const N=D/z,B=V/X,k=D/2,le=V/2,pe=H/2,fe=z+1,q=X+1;let se=0,W=0;const xe=new ne;for(let Se=0;Se<q;Se++){const Pe=Se*B-le;for(let Je=0;Je<fe;Je++){const xt=Je*N-k;xe[C]=xt*O,xe[E]=Pe*I,xe[M]=pe,v.push(xe.x,xe.y,xe.z),xe[C]=0,xe[E]=0,xe[M]=H>0?1:-1,x.push(xe.x,xe.y,xe.z),g.push(Je/z),g.push(1-Se/X),se+=1}}for(let Se=0;Se<X;Se++)for(let Pe=0;Pe<z;Pe++){const Je=S+Pe+fe*Se,xt=S+Pe+fe*(Se+1),F=S+(Pe+1)+fe*(Se+1),he=S+(Pe+1)+fe*Se;m.push(Je,xt,he),m.push(xt,F,he),W+=6}h.addGroup(y,W,w),y+=W,S+=se}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new No(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ao(r){const t={};for(const i in r){t[i]={};for(const o in r[i]){const l=r[i][o];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[i][o]=null):t[i][o]=l.clone():Array.isArray(l)?t[i][o]=l.slice():t[i][o]=l}}return t}function Xn(r){const t={};for(let i=0;i<r.length;i++){const o=Ao(r[i]);for(const l in o)t[l]=o[l]}return t}function gT(r){const t=[];for(let i=0;i<r.length;i++)t.push(r[i].clone());return t}function ky(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Ut.workingColorSpace}const Hl={clone:Ao,merge:Xn};var vT=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,_T=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class qn extends wo{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=vT,this.fragmentShader=_T,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ao(t.uniforms),this.uniformsGroups=gT(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const i=super.toJSON(t);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const d=this.uniforms[l].value;d&&d.isTexture?i.uniforms[l]={type:"t",value:d.toJSON(t).uuid}:d&&d.isColor?i.uniforms[l]={type:"c",value:d.getHex()}:d&&d.isVector2?i.uniforms[l]={type:"v2",value:d.toArray()}:d&&d.isVector3?i.uniforms[l]={type:"v3",value:d.toArray()}:d&&d.isVector4?i.uniforms[l]={type:"v4",value:d.toArray()}:d&&d.isMatrix3?i.uniforms[l]={type:"m3",value:d.toArray()}:d&&d.isMatrix4?i.uniforms[l]={type:"m4",value:d.toArray()}:i.uniforms[l]={value:d}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const o={};for(const l in this.extensions)this.extensions[l]===!0&&(o[l]=!0);return Object.keys(o).length>0&&(i.extensions=o),i}}class Xy extends Ln{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new an,this.projectionMatrix=new an,this.projectionMatrixInverse=new an,this.coordinateSystem=la,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,i){return super.copy(t,i),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,i){super.updateWorldMatrix(t,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const gs=new ne,Ux=new ft,Lx=new ft;class Ri extends Xy{constructor(t=50,i=1,o=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=o,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const i=.5*this.getFilmHeight()/t;this.fov=gm*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Xh*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return gm*2*Math.atan(Math.tan(Xh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,i,o){gs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(gs.x,gs.y).multiplyScalar(-t/gs.z),gs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),o.set(gs.x,gs.y).multiplyScalar(-t/gs.z)}getViewSize(t,i){return this.getViewBounds(t,Ux,Lx),i.subVectors(Lx,Ux)}setViewOffset(t,i,o,l,u,d){this.aspect=t/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=o,this.view.offsetY=l,this.view.width=u,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let i=t*Math.tan(Xh*.5*this.fov)/this.zoom,o=2*i,l=this.aspect*o,u=-.5*l;const d=this.view;if(this.view!==null&&this.view.enabled){const m=d.fullWidth,v=d.fullHeight;u+=d.offsetX*l/m,i-=d.offsetY*o/v,l*=d.width/m,o*=d.height/v}const h=this.filmOffset;h!==0&&(u+=t*h/this.getFilmWidth()),this.projectionMatrix.makePerspective(u,u+l,i,i-o,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const uo=-90,fo=1;class xT extends Ln{constructor(t,i,o){super(),this.type="CubeCamera",this.renderTarget=o,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new Ri(uo,fo,t,i);l.layers=this.layers,this.add(l);const u=new Ri(uo,fo,t,i);u.layers=this.layers,this.add(u);const d=new Ri(uo,fo,t,i);d.layers=this.layers,this.add(d);const h=new Ri(uo,fo,t,i);h.layers=this.layers,this.add(h);const m=new Ri(uo,fo,t,i);m.layers=this.layers,this.add(m);const v=new Ri(uo,fo,t,i);v.layers=this.layers,this.add(v)}updateCoordinateSystem(){const t=this.coordinateSystem,i=this.children.concat(),[o,l,u,d,h,m]=i;for(const v of i)this.remove(v);if(t===la)o.up.set(0,1,0),o.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),u.up.set(0,0,-1),u.lookAt(0,1,0),d.up.set(0,0,1),d.lookAt(0,-1,0),h.up.set(0,1,0),h.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(t===$u)o.up.set(0,-1,0),o.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),u.up.set(0,0,1),u.lookAt(0,1,0),d.up.set(0,0,-1),d.lookAt(0,-1,0),h.up.set(0,-1,0),h.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const v of i)this.add(v),v.updateMatrixWorld()}update(t,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:o,activeMipmapLevel:l}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[u,d,h,m,v,x]=this.children,g=t.getRenderTarget(),S=t.getActiveCubeFace(),y=t.getActiveMipmapLevel(),T=t.xr.enabled;t.xr.enabled=!1;const C=o.texture.generateMipmaps;o.texture.generateMipmaps=!1,t.setRenderTarget(o,0,l),t.render(i,u),t.setRenderTarget(o,1,l),t.render(i,d),t.setRenderTarget(o,2,l),t.render(i,h),t.setRenderTarget(o,3,l),t.render(i,m),t.setRenderTarget(o,4,l),t.render(i,v),o.texture.generateMipmaps=C,t.setRenderTarget(o,5,l),t.render(i,x),t.setRenderTarget(g,S,y),t.xr.enabled=T,o.texture.needsPMREMUpdate=!0}}class qy extends Yn{constructor(t=[],i=Eo,o,l,u,d,h,m,v,x){super(t,i,o,l,u,d,h,m,v,x),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class yT extends Xi{constructor(t=1,i={}){super(t,t,i),this.isWebGLCubeRenderTarget=!0;const o={width:t,height:t,depth:1},l=[o,o,o,o,o,o];this.texture=new qy(l),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const o={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new No(5,5,5),u=new qn({name:"CubemapFromEquirect",uniforms:Ao(o.uniforms),vertexShader:o.vertexShader,fragmentShader:o.fragmentShader,side:ti,blending:Oa});u.uniforms.tEquirect.value=i;const d=new pi(l,u),h=i.minFilter;return i.minFilter===or&&(i.minFilter=ji),new xT(1,10,this).update(t,d),i.minFilter=h,d.geometry.dispose(),d.material.dispose(),this}clear(t,i=!0,o=!0,l=!0){const u=t.getRenderTarget();for(let d=0;d<6;d++)t.setRenderTarget(this,d),t.clear(i,o,l);t.setRenderTarget(u)}}class Du extends Ln{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ST={type:"move"};class hp{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Du,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Du,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new ne,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new ne),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Du,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new ne,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new ne),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const i=this._hand;if(i)for(const o of t.hand.values())this._getHandJoint(i,o)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,i,o){let l=null,u=null,d=null;const h=this._targetRay,m=this._grip,v=this._hand;if(t&&i.session.visibilityState!=="visible-blurred"){if(v&&t.hand){d=!0;for(const C of t.hand.values()){const E=i.getJointPose(C,o),M=this._getHandJoint(v,C);E!==null&&(M.matrix.fromArray(E.transform.matrix),M.matrix.decompose(M.position,M.rotation,M.scale),M.matrixWorldNeedsUpdate=!0,M.jointRadius=E.radius),M.visible=E!==null}const x=v.joints["index-finger-tip"],g=v.joints["thumb-tip"],S=x.position.distanceTo(g.position),y=.02,T=.005;v.inputState.pinching&&S>y+T?(v.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!v.inputState.pinching&&S<=y-T&&(v.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else m!==null&&t.gripSpace&&(u=i.getPose(t.gripSpace,o),u!==null&&(m.matrix.fromArray(u.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,u.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(u.linearVelocity)):m.hasLinearVelocity=!1,u.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(u.angularVelocity)):m.hasAngularVelocity=!1));h!==null&&(l=i.getPose(t.targetRaySpace,o),l===null&&u!==null&&(l=u),l!==null&&(h.matrix.fromArray(l.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,l.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(l.linearVelocity)):h.hasLinearVelocity=!1,l.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(l.angularVelocity)):h.hasAngularVelocity=!1,this.dispatchEvent(ST)))}return h!==null&&(h.visible=l!==null),m!==null&&(m.visible=u!==null),v!==null&&(v.visible=d!==null),this}_getHandJoint(t,i){if(t.joints[i.jointName]===void 0){const o=new Du;o.matrixAutoUpdate=!1,o.visible=!1,t.joints[i.jointName]=o,t.add(o)}return t.joints[i.jointName]}}class MT extends Ln{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ua,this.environmentIntensity=1,this.environmentRotation=new ua,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,i){return super.copy(t,i),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const i=super.toJSON(t);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}const pp=new ne,ET=new ne,TT=new vt;class tr{constructor(t=new ne(1,0,0),i=0){this.isPlane=!0,this.normal=t,this.constant=i}set(t,i){return this.normal.copy(t),this.constant=i,this}setComponents(t,i,o,l){return this.normal.set(t,i,o),this.constant=l,this}setFromNormalAndCoplanarPoint(t,i){return this.normal.copy(t),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(t,i,o){const l=pp.subVectors(o,i).cross(ET.subVectors(t,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,i){return i.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,i){const o=t.delta(pp),l=this.normal.dot(o);if(l===0)return this.distanceToPoint(t.start)===0?i.copy(t.start):null;const u=-(t.start.dot(this.normal)+this.constant)/l;return u<0||u>1?null:i.copy(t.start).addScaledVector(o,u)}intersectsLine(t){const i=this.distanceToPoint(t.start),o=this.distanceToPoint(t.end);return i<0&&o>0||o<0&&i>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,i){const o=i||TT.getNormalMatrix(t),l=this.coplanarPoint(pp).applyMatrix4(t),u=this.normal.applyMatrix3(o).normalize();return this.constant=-l.dot(u),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Qs=new af,bT=new ft(.5,.5),Uu=new ne;class zm{constructor(t=new tr,i=new tr,o=new tr,l=new tr,u=new tr,d=new tr){this.planes=[t,i,o,l,u,d]}set(t,i,o,l,u,d){const h=this.planes;return h[0].copy(t),h[1].copy(i),h[2].copy(o),h[3].copy(l),h[4].copy(u),h[5].copy(d),this}copy(t){const i=this.planes;for(let o=0;o<6;o++)i[o].copy(t.planes[o]);return this}setFromProjectionMatrix(t,i=la,o=!1){const l=this.planes,u=t.elements,d=u[0],h=u[1],m=u[2],v=u[3],x=u[4],g=u[5],S=u[6],y=u[7],T=u[8],C=u[9],E=u[10],M=u[11],O=u[12],I=u[13],D=u[14],V=u[15];if(l[0].setComponents(v-d,y-x,M-T,V-O).normalize(),l[1].setComponents(v+d,y+x,M+T,V+O).normalize(),l[2].setComponents(v+h,y+g,M+C,V+I).normalize(),l[3].setComponents(v-h,y-g,M-C,V-I).normalize(),o)l[4].setComponents(m,S,E,D).normalize(),l[5].setComponents(v-m,y-S,M-E,V-D).normalize();else if(l[4].setComponents(v-m,y-S,M-E,V-D).normalize(),i===la)l[5].setComponents(v+m,y+S,M+E,V+D).normalize();else if(i===$u)l[5].setComponents(m,S,E,D).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Qs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const i=t.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),Qs.copy(i.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Qs)}intersectsSprite(t){Qs.center.set(0,0,0);const i=bT.distanceTo(t.center);return Qs.radius=.7071067811865476+i,Qs.applyMatrix4(t.matrixWorld),this.intersectsSphere(Qs)}intersectsSphere(t){const i=this.planes,o=t.center,l=-t.radius;for(let u=0;u<6;u++)if(i[u].distanceToPoint(o)<l)return!1;return!0}intersectsBox(t){const i=this.planes;for(let o=0;o<6;o++){const l=i[o];if(Uu.x=l.normal.x>0?t.max.x:t.min.x,Uu.y=l.normal.y>0?t.max.y:t.min.y,Uu.z=l.normal.z>0?t.max.z:t.min.z,l.distanceToPoint(Uu)<0)return!1}return!0}containsPoint(t){const i=this.planes;for(let o=0;o<6;o++)if(i[o].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Yy extends wo{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Rt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Ox=new an,vm=new Fy,Lu=new af,Ou=new ne;class AT extends Ln{constructor(t=new Yi,i=new Yy){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,i){const o=this.geometry,l=this.matrixWorld,u=t.params.Points.threshold,d=o.drawRange;if(o.boundingSphere===null&&o.computeBoundingSphere(),Lu.copy(o.boundingSphere),Lu.applyMatrix4(l),Lu.radius+=u,t.ray.intersectsSphere(Lu)===!1)return;Ox.copy(l).invert(),vm.copy(t.ray).applyMatrix4(Ox);const h=u/((this.scale.x+this.scale.y+this.scale.z)/3),m=h*h,v=o.index,g=o.attributes.position;if(v!==null){const S=Math.max(0,d.start),y=Math.min(v.count,d.start+d.count);for(let T=S,C=y;T<C;T++){const E=v.getX(T);Ou.fromBufferAttribute(g,E),zx(Ou,E,m,l,t,i,this)}}else{const S=Math.max(0,d.start),y=Math.min(g.count,d.start+d.count);for(let T=S,C=y;T<C;T++)Ou.fromBufferAttribute(g,T),zx(Ou,T,m,l,t,i,this)}}updateMorphTargets(){const i=this.geometry.morphAttributes,o=Object.keys(i);if(o.length>0){const l=i[o[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,d=l.length;u<d;u++){const h=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[h]=u}}}}}function zx(r,t,i,o,l,u,d){const h=vm.distanceSqToPoint(r);if(h<i){const m=new ne;vm.closestPointToPoint(r,m),m.applyMatrix4(o);const v=l.ray.origin.distanceTo(m);if(v<l.near||v>l.far)return;u.push({distance:v,distanceToRay:Math.sqrt(h),point:m,index:t,face:null,faceIndex:null,barycoord:null,object:d})}}class Wy extends Yn{constructor(t,i,o=fr,l,u,d,h=Ni,m=Ni,v,x=Pl,g=1){if(x!==Pl&&x!==Il)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const S={width:t,height:i,depth:g};super(S,l,u,d,h,m,x,o,v),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Om(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const i=super.toJSON(t);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class Zy extends Yn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Pm extends Yi{constructor(t=1,i=32,o=0,l=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:i,thetaStart:o,thetaLength:l},i=Math.max(3,i);const u=[],d=[],h=[],m=[],v=new ne,x=new ft;d.push(0,0,0),h.push(0,0,1),m.push(.5,.5);for(let g=0,S=3;g<=i;g++,S+=3){const y=o+g/i*l;v.x=t*Math.cos(y),v.y=t*Math.sin(y),d.push(v.x,v.y,v.z),h.push(0,0,1),x.x=(d[S]/t+1)/2,x.y=(d[S+1]/t+1)/2,m.push(x.x,x.y)}for(let g=1;g<=i;g++)u.push(g,g+1,0);this.setIndex(u),this.setAttribute("position",new Di(d,3)),this.setAttribute("normal",new Di(h,3)),this.setAttribute("uv",new Di(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pm(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class kl extends Yi{constructor(t=1,i=1,o=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:i,widthSegments:o,heightSegments:l};const u=t/2,d=i/2,h=Math.floor(o),m=Math.floor(l),v=h+1,x=m+1,g=t/h,S=i/m,y=[],T=[],C=[],E=[];for(let M=0;M<x;M++){const O=M*S-d;for(let I=0;I<v;I++){const D=I*g-u;T.push(D,-O,0),C.push(0,0,1),E.push(I/h),E.push(1-M/m)}}for(let M=0;M<m;M++)for(let O=0;O<h;O++){const I=O+v*M,D=O+v*(M+1),V=O+1+v*(M+1),H=O+1+v*M;y.push(I,D,H),y.push(D,V,H)}this.setIndex(y),this.setAttribute("position",new Di(T,3)),this.setAttribute("normal",new Di(C,3)),this.setAttribute("uv",new Di(E,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new kl(t.width,t.height,t.widthSegments,t.heightSegments)}}class CT extends qn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class mp extends wo{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Rt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zy,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ua,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class RT extends wo{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=HE,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class wT extends wo{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const gp={enabled:!1,files:{},add:function(r,t){this.enabled!==!1&&(this.files[r]=t)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class NT{constructor(t,i,o){const l=this;let u=!1,d=0,h=0,m;const v=[];this.onStart=void 0,this.onLoad=t,this.onProgress=i,this.onError=o,this.abortController=new AbortController,this.itemStart=function(x){h++,u===!1&&l.onStart!==void 0&&l.onStart(x,d,h),u=!0},this.itemEnd=function(x){d++,l.onProgress!==void 0&&l.onProgress(x,d,h),d===h&&(u=!1,l.onLoad!==void 0&&l.onLoad())},this.itemError=function(x){l.onError!==void 0&&l.onError(x)},this.resolveURL=function(x){return m?m(x):x},this.setURLModifier=function(x){return m=x,this},this.addHandler=function(x,g){return v.push(x,g),this},this.removeHandler=function(x){const g=v.indexOf(x);return g!==-1&&v.splice(g,2),this},this.getHandler=function(x){for(let g=0,S=v.length;g<S;g+=2){const y=v[g],T=v[g+1];if(y.global&&(y.lastIndex=0),y.test(x))return T}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const DT=new NT;class Im{constructor(t){this.manager=t!==void 0?t:DT,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,i){const o=this;return new Promise(function(l,u){o.load(t,l,i,u)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}Im.DEFAULT_MATERIAL_NAME="__DEFAULT";const ho=new WeakMap;class UT extends Im{constructor(t){super(t)}load(t,i,o,l){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const u=this,d=gp.get(`image:${t}`);if(d!==void 0){if(d.complete===!0)u.manager.itemStart(t),setTimeout(function(){i&&i(d),u.manager.itemEnd(t)},0);else{let g=ho.get(d);g===void 0&&(g=[],ho.set(d,g)),g.push({onLoad:i,onError:l})}return d}const h=Bl("img");function m(){x(),i&&i(this);const g=ho.get(this)||[];for(let S=0;S<g.length;S++){const y=g[S];y.onLoad&&y.onLoad(this)}ho.delete(this),u.manager.itemEnd(t)}function v(g){x(),l&&l(g),gp.remove(`image:${t}`);const S=ho.get(this)||[];for(let y=0;y<S.length;y++){const T=S[y];T.onError&&T.onError(g)}ho.delete(this),u.manager.itemError(t),u.manager.itemEnd(t)}function x(){h.removeEventListener("load",m,!1),h.removeEventListener("error",v,!1)}return h.addEventListener("load",m,!1),h.addEventListener("error",v,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(h.crossOrigin=this.crossOrigin),gp.add(`image:${t}`,h),u.manager.itemStart(t),h.src=t,h}}class LT extends Im{constructor(t){super(t)}load(t,i,o,l){const u=new Yn,d=new UT(this.manager);return d.setCrossOrigin(this.crossOrigin),d.setPath(this.path),d.load(t,function(h){u.image=h,u.needsUpdate=!0,i!==void 0&&i(u)},o,l),u}}class Bm extends Ln{constructor(t,i=1){super(),this.isLight=!0,this.type="Light",this.color=new Rt(t),this.intensity=i}dispose(){}copy(t,i){return super.copy(t,i),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const i=super.toJSON(t);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,this.groundColor!==void 0&&(i.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(i.object.distance=this.distance),this.angle!==void 0&&(i.object.angle=this.angle),this.decay!==void 0&&(i.object.decay=this.decay),this.penumbra!==void 0&&(i.object.penumbra=this.penumbra),this.shadow!==void 0&&(i.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(i.object.target=this.target.uuid),i}}const vp=new an,Px=new ne,Ix=new ne;class Ky{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.mapType=ca,this.map=null,this.mapPass=null,this.matrix=new an,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zm,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new Wt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const i=this.camera,o=this.matrix;Px.setFromMatrixPosition(t.matrixWorld),i.position.copy(Px),Ix.setFromMatrixPosition(t.target.matrixWorld),i.lookAt(Ix),i.updateMatrixWorld(),vp.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vp,i.coordinateSystem,i.reversedDepth),i.reversedDepth?o.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):o.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),o.multiply(vp)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Bx=new an,Nl=new ne,_p=new ne;class OT extends Ky{constructor(){super(new Ri(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ft(4,2),this._viewportCount=6,this._viewports=[new Wt(2,1,1,1),new Wt(0,1,1,1),new Wt(3,1,1,1),new Wt(1,1,1,1),new Wt(3,0,1,1),new Wt(1,0,1,1)],this._cubeDirections=[new ne(1,0,0),new ne(-1,0,0),new ne(0,0,1),new ne(0,0,-1),new ne(0,1,0),new ne(0,-1,0)],this._cubeUps=[new ne(0,1,0),new ne(0,1,0),new ne(0,1,0),new ne(0,1,0),new ne(0,0,1),new ne(0,0,-1)]}updateMatrices(t,i=0){const o=this.camera,l=this.matrix,u=t.distance||o.far;u!==o.far&&(o.far=u,o.updateProjectionMatrix()),Nl.setFromMatrixPosition(t.matrixWorld),o.position.copy(Nl),_p.copy(o.position),_p.add(this._cubeDirections[i]),o.up.copy(this._cubeUps[i]),o.lookAt(_p),o.updateMatrixWorld(),l.makeTranslation(-Nl.x,-Nl.y,-Nl.z),Bx.multiplyMatrices(o.projectionMatrix,o.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bx,o.coordinateSystem,o.reversedDepth)}}class zT extends Bm{constructor(t,i,o=0,l=2){super(t,i),this.isPointLight=!0,this.type="PointLight",this.distance=o,this.decay=l,this.shadow=new OT}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,i){return super.copy(t,i),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class sf extends Xy{constructor(t=-1,i=1,o=1,l=-1,u=.1,d=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=i,this.top=o,this.bottom=l,this.near=u,this.far=d,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,i,o,l,u,d){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=o,this.view.offsetY=l,this.view.width=u,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),o=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let u=o-t,d=o+t,h=l+i,m=l-i;if(this.view!==null&&this.view.enabled){const v=(this.right-this.left)/this.view.fullWidth/this.zoom,x=(this.top-this.bottom)/this.view.fullHeight/this.zoom;u+=v*this.view.offsetX,d=u+v*this.view.width,h-=x*this.view.offsetY,m=h-x*this.view.height}this.projectionMatrix.makeOrthographic(u,d,h,m,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class PT extends Ky{constructor(){super(new sf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class IT extends Bm{constructor(t,i){super(t,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ln.DEFAULT_UP),this.updateMatrix(),this.target=new Ln,this.shadow=new PT}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class BT extends Bm{constructor(t,i){super(t,i),this.isAmbientLight=!0,this.type="AmbientLight"}}class FT extends Ri{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Qy{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const i=performance.now();t=(i-this.oldTime)/1e3,this.oldTime=i,this.elapsedTime+=t}return t}}function Fx(r,t,i,o){const l=HT(o);switch(i){case Dy:return r*t;case Ly:return r*t/l.components*l.byteLength;case Dm:return r*t/l.components*l.byteLength;case Oy:return r*t*2/l.components*l.byteLength;case Um:return r*t*2/l.components*l.byteLength;case Uy:return r*t*3/l.components*l.byteLength;case ki:return r*t*4/l.components*l.byteLength;case Lm:return r*t*4/l.components*l.byteLength;case Vu:case ju:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case ku:case Xu:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case jp:case Xp:return Math.max(r,16)*Math.max(t,8)/4;case Vp:case kp:return Math.max(r,8)*Math.max(t,8)/2;case qp:case Yp:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case Wp:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Zp:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Kp:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case Qp:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case Jp:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case $p:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case em:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case tm:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case nm:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case im:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case am:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case sm:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case rm:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case om:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case lm:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case cm:case um:case fm:return Math.ceil(r/4)*Math.ceil(t/4)*16;case dm:case hm:return Math.ceil(r/4)*Math.ceil(t/4)*8;case pm:case mm:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function HT(r){switch(r){case ca:case Cy:return{byteLength:1,components:1};case Ol:case Ry:case za:return{byteLength:2,components:1};case wm:case Nm:return{byteLength:2,components:4};case fr:case Rm:case La:return{byteLength:4,components:1};case wy:case Ny:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Am}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Am);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Jy(){let r=null,t=!1,i=null,o=null;function l(u,d){i(u,d),o=r.requestAnimationFrame(l)}return{start:function(){t!==!0&&i!==null&&(o=r.requestAnimationFrame(l),t=!0)},stop:function(){r.cancelAnimationFrame(o),t=!1},setAnimationLoop:function(u){i=u},setContext:function(u){r=u}}}function GT(r){const t=new WeakMap;function i(h,m){const v=h.array,x=h.usage,g=v.byteLength,S=r.createBuffer();r.bindBuffer(m,S),r.bufferData(m,v,x),h.onUploadCallback();let y;if(v instanceof Float32Array)y=r.FLOAT;else if(typeof Float16Array<"u"&&v instanceof Float16Array)y=r.HALF_FLOAT;else if(v instanceof Uint16Array)h.isFloat16BufferAttribute?y=r.HALF_FLOAT:y=r.UNSIGNED_SHORT;else if(v instanceof Int16Array)y=r.SHORT;else if(v instanceof Uint32Array)y=r.UNSIGNED_INT;else if(v instanceof Int32Array)y=r.INT;else if(v instanceof Int8Array)y=r.BYTE;else if(v instanceof Uint8Array)y=r.UNSIGNED_BYTE;else if(v instanceof Uint8ClampedArray)y=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+v);return{buffer:S,type:y,bytesPerElement:v.BYTES_PER_ELEMENT,version:h.version,size:g}}function o(h,m,v){const x=m.array,g=m.updateRanges;if(r.bindBuffer(v,h),g.length===0)r.bufferSubData(v,0,x);else{g.sort((y,T)=>y.start-T.start);let S=0;for(let y=1;y<g.length;y++){const T=g[S],C=g[y];C.start<=T.start+T.count+1?T.count=Math.max(T.count,C.start+C.count-T.start):(++S,g[S]=C)}g.length=S+1;for(let y=0,T=g.length;y<T;y++){const C=g[y];r.bufferSubData(v,C.start*x.BYTES_PER_ELEMENT,x,C.start,C.count)}m.clearUpdateRanges()}m.onUploadCallback()}function l(h){return h.isInterleavedBufferAttribute&&(h=h.data),t.get(h)}function u(h){h.isInterleavedBufferAttribute&&(h=h.data);const m=t.get(h);m&&(r.deleteBuffer(m.buffer),t.delete(h))}function d(h,m){if(h.isInterleavedBufferAttribute&&(h=h.data),h.isGLBufferAttribute){const x=t.get(h);(!x||x.version<h.version)&&t.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}const v=t.get(h);if(v===void 0)t.set(h,i(h,m));else if(v.version<h.version){if(v.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(v.buffer,h,m),v.version=h.version}}return{get:l,remove:u,update:d}}var VT=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,jT=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,kT=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,XT=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qT=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,YT=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,WT=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,ZT=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,KT=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,QT=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,JT=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$T=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,eb=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,tb=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,nb=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ib=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,ab=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,sb=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,rb=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ob=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,lb=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,cb=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ub=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,fb=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,db=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,hb=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,pb=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,mb=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,gb=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,vb=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_b="gl_FragColor = linearToOutputTexel( gl_FragColor );",xb=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,yb=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Sb=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Mb=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Eb=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Tb=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,bb=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ab=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Cb=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Rb=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wb=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Nb=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Db=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ub=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Lb=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ob=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,zb=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Pb=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ib=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Bb=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Fb=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Hb=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Gb=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Vb=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,jb=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,kb=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xb=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qb=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yb=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Wb=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Zb=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Kb=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Qb=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jb=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$b=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,eA=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,tA=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,nA=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,iA=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,aA=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sA=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,rA=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,oA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cA=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,uA=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,fA=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,dA=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,hA=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,pA=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,mA=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,gA=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,vA=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,_A=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,xA=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,yA=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,SA=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,MA=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,EA=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,TA=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,bA=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,AA=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,CA=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,RA=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,wA=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,NA=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,DA=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,UA=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,LA=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,OA=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,zA=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,PA=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,IA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,BA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,FA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,HA=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const GA=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,VA=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kA=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,XA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qA=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,YA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,WA=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ZA=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,KA=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,QA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,JA=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$A=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,e2=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,t2=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,n2=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,i2=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,a2=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s2=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,r2=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,o2=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,l2=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,c2=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,u2=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f2=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,d2=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,h2=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,p2=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,m2=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,g2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,v2=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_2=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,x2=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,y2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,_t={alphahash_fragment:VT,alphahash_pars_fragment:jT,alphamap_fragment:kT,alphamap_pars_fragment:XT,alphatest_fragment:qT,alphatest_pars_fragment:YT,aomap_fragment:WT,aomap_pars_fragment:ZT,batching_pars_vertex:KT,batching_vertex:QT,begin_vertex:JT,beginnormal_vertex:$T,bsdfs:eb,iridescence_fragment:tb,bumpmap_pars_fragment:nb,clipping_planes_fragment:ib,clipping_planes_pars_fragment:ab,clipping_planes_pars_vertex:sb,clipping_planes_vertex:rb,color_fragment:ob,color_pars_fragment:lb,color_pars_vertex:cb,color_vertex:ub,common:fb,cube_uv_reflection_fragment:db,defaultnormal_vertex:hb,displacementmap_pars_vertex:pb,displacementmap_vertex:mb,emissivemap_fragment:gb,emissivemap_pars_fragment:vb,colorspace_fragment:_b,colorspace_pars_fragment:xb,envmap_fragment:yb,envmap_common_pars_fragment:Sb,envmap_pars_fragment:Mb,envmap_pars_vertex:Eb,envmap_physical_pars_fragment:Ob,envmap_vertex:Tb,fog_vertex:bb,fog_pars_vertex:Ab,fog_fragment:Cb,fog_pars_fragment:Rb,gradientmap_pars_fragment:wb,lightmap_pars_fragment:Nb,lights_lambert_fragment:Db,lights_lambert_pars_fragment:Ub,lights_pars_begin:Lb,lights_toon_fragment:zb,lights_toon_pars_fragment:Pb,lights_phong_fragment:Ib,lights_phong_pars_fragment:Bb,lights_physical_fragment:Fb,lights_physical_pars_fragment:Hb,lights_fragment_begin:Gb,lights_fragment_maps:Vb,lights_fragment_end:jb,logdepthbuf_fragment:kb,logdepthbuf_pars_fragment:Xb,logdepthbuf_pars_vertex:qb,logdepthbuf_vertex:Yb,map_fragment:Wb,map_pars_fragment:Zb,map_particle_fragment:Kb,map_particle_pars_fragment:Qb,metalnessmap_fragment:Jb,metalnessmap_pars_fragment:$b,morphinstance_vertex:eA,morphcolor_vertex:tA,morphnormal_vertex:nA,morphtarget_pars_vertex:iA,morphtarget_vertex:aA,normal_fragment_begin:sA,normal_fragment_maps:rA,normal_pars_fragment:oA,normal_pars_vertex:lA,normal_vertex:cA,normalmap_pars_fragment:uA,clearcoat_normal_fragment_begin:fA,clearcoat_normal_fragment_maps:dA,clearcoat_pars_fragment:hA,iridescence_pars_fragment:pA,opaque_fragment:mA,packing:gA,premultiplied_alpha_fragment:vA,project_vertex:_A,dithering_fragment:xA,dithering_pars_fragment:yA,roughnessmap_fragment:SA,roughnessmap_pars_fragment:MA,shadowmap_pars_fragment:EA,shadowmap_pars_vertex:TA,shadowmap_vertex:bA,shadowmask_pars_fragment:AA,skinbase_vertex:CA,skinning_pars_vertex:RA,skinning_vertex:wA,skinnormal_vertex:NA,specularmap_fragment:DA,specularmap_pars_fragment:UA,tonemapping_fragment:LA,tonemapping_pars_fragment:OA,transmission_fragment:zA,transmission_pars_fragment:PA,uv_pars_fragment:IA,uv_pars_vertex:BA,uv_vertex:FA,worldpos_vertex:HA,background_vert:GA,background_frag:VA,backgroundCube_vert:jA,backgroundCube_frag:kA,cube_vert:XA,cube_frag:qA,depth_vert:YA,depth_frag:WA,distanceRGBA_vert:ZA,distanceRGBA_frag:KA,equirect_vert:QA,equirect_frag:JA,linedashed_vert:$A,linedashed_frag:e2,meshbasic_vert:t2,meshbasic_frag:n2,meshlambert_vert:i2,meshlambert_frag:a2,meshmatcap_vert:s2,meshmatcap_frag:r2,meshnormal_vert:o2,meshnormal_frag:l2,meshphong_vert:c2,meshphong_frag:u2,meshphysical_vert:f2,meshphysical_frag:d2,meshtoon_vert:h2,meshtoon_frag:p2,points_vert:m2,points_frag:g2,shadow_vert:v2,shadow_frag:_2,sprite_vert:x2,sprite_frag:y2},He={common:{diffuse:{value:new Rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new vt},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new vt}},envmap:{envMap:{value:null},envMapRotation:{value:new vt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new vt},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0},uvTransform:{value:new vt}},sprite:{diffuse:{value:new Rt(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new vt},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0}}},ra={basic:{uniforms:Xn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.fog]),vertexShader:_t.meshbasic_vert,fragmentShader:_t.meshbasic_frag},lambert:{uniforms:Xn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.fog,He.lights,{emissive:{value:new Rt(0)}}]),vertexShader:_t.meshlambert_vert,fragmentShader:_t.meshlambert_frag},phong:{uniforms:Xn([He.common,He.specularmap,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.fog,He.lights,{emissive:{value:new Rt(0)},specular:{value:new Rt(1118481)},shininess:{value:30}}]),vertexShader:_t.meshphong_vert,fragmentShader:_t.meshphong_frag},standard:{uniforms:Xn([He.common,He.envmap,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.roughnessmap,He.metalnessmap,He.fog,He.lights,{emissive:{value:new Rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:_t.meshphysical_vert,fragmentShader:_t.meshphysical_frag},toon:{uniforms:Xn([He.common,He.aomap,He.lightmap,He.emissivemap,He.bumpmap,He.normalmap,He.displacementmap,He.gradientmap,He.fog,He.lights,{emissive:{value:new Rt(0)}}]),vertexShader:_t.meshtoon_vert,fragmentShader:_t.meshtoon_frag},matcap:{uniforms:Xn([He.common,He.bumpmap,He.normalmap,He.displacementmap,He.fog,{matcap:{value:null}}]),vertexShader:_t.meshmatcap_vert,fragmentShader:_t.meshmatcap_frag},points:{uniforms:Xn([He.points,He.fog]),vertexShader:_t.points_vert,fragmentShader:_t.points_frag},dashed:{uniforms:Xn([He.common,He.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:_t.linedashed_vert,fragmentShader:_t.linedashed_frag},depth:{uniforms:Xn([He.common,He.displacementmap]),vertexShader:_t.depth_vert,fragmentShader:_t.depth_frag},normal:{uniforms:Xn([He.common,He.bumpmap,He.normalmap,He.displacementmap,{opacity:{value:1}}]),vertexShader:_t.meshnormal_vert,fragmentShader:_t.meshnormal_frag},sprite:{uniforms:Xn([He.sprite,He.fog]),vertexShader:_t.sprite_vert,fragmentShader:_t.sprite_frag},background:{uniforms:{uvTransform:{value:new vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:_t.background_vert,fragmentShader:_t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new vt}},vertexShader:_t.backgroundCube_vert,fragmentShader:_t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:_t.cube_vert,fragmentShader:_t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:_t.equirect_vert,fragmentShader:_t.equirect_frag},distanceRGBA:{uniforms:Xn([He.common,He.displacementmap,{referencePosition:{value:new ne},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:_t.distanceRGBA_vert,fragmentShader:_t.distanceRGBA_frag},shadow:{uniforms:Xn([He.lights,He.fog,{color:{value:new Rt(0)},opacity:{value:1}}]),vertexShader:_t.shadow_vert,fragmentShader:_t.shadow_frag}};ra.physical={uniforms:Xn([ra.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new vt},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new vt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new vt},sheen:{value:0},sheenColor:{value:new Rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new vt},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new vt},attenuationDistance:{value:0},attenuationColor:{value:new Rt(0)},specularColor:{value:new Rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new vt},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new vt}}]),vertexShader:_t.meshphysical_vert,fragmentShader:_t.meshphysical_frag};const zu={r:0,b:0,g:0},Js=new ua,S2=new an;function M2(r,t,i,o,l,u,d){const h=new Rt(0);let m=u===!0?0:1,v,x,g=null,S=0,y=null;function T(I){let D=I.isScene===!0?I.background:null;return D&&D.isTexture&&(D=(I.backgroundBlurriness>0?i:t).get(D)),D}function C(I){let D=!1;const V=T(I);V===null?M(h,m):V&&V.isColor&&(M(V,1),D=!0);const H=r.xr.getEnvironmentBlendMode();H==="additive"?o.buffers.color.setClear(0,0,0,1,d):H==="alpha-blend"&&o.buffers.color.setClear(0,0,0,0,d),(r.autoClear||D)&&(o.buffers.depth.setTest(!0),o.buffers.depth.setMask(!0),o.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function E(I,D){const V=T(D);V&&(V.isCubeTexture||V.mapping===nf)?(x===void 0&&(x=new pi(new No(1,1,1),new qn({name:"BackgroundCubeMaterial",uniforms:Ao(ra.backgroundCube.uniforms),vertexShader:ra.backgroundCube.vertexShader,fragmentShader:ra.backgroundCube.fragmentShader,side:ti,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),x.geometry.deleteAttribute("normal"),x.geometry.deleteAttribute("uv"),x.onBeforeRender=function(H,z,X){this.matrixWorld.copyPosition(X.matrixWorld)},Object.defineProperty(x.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(x)),Js.copy(D.backgroundRotation),Js.x*=-1,Js.y*=-1,Js.z*=-1,V.isCubeTexture&&V.isRenderTargetTexture===!1&&(Js.y*=-1,Js.z*=-1),x.material.uniforms.envMap.value=V,x.material.uniforms.flipEnvMap.value=V.isCubeTexture&&V.isRenderTargetTexture===!1?-1:1,x.material.uniforms.backgroundBlurriness.value=D.backgroundBlurriness,x.material.uniforms.backgroundIntensity.value=D.backgroundIntensity,x.material.uniforms.backgroundRotation.value.setFromMatrix4(S2.makeRotationFromEuler(Js)),x.material.toneMapped=Ut.getTransfer(V.colorSpace)!==Xt,(g!==V||S!==V.version||y!==r.toneMapping)&&(x.material.needsUpdate=!0,g=V,S=V.version,y=r.toneMapping),x.layers.enableAll(),I.unshift(x,x.geometry,x.material,0,0,null)):V&&V.isTexture&&(v===void 0&&(v=new pi(new kl(2,2),new qn({name:"BackgroundMaterial",uniforms:Ao(ra.background.uniforms),vertexShader:ra.background.vertexShader,fragmentShader:ra.background.fragmentShader,side:Ms,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),v.geometry.deleteAttribute("normal"),Object.defineProperty(v.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(v)),v.material.uniforms.t2D.value=V,v.material.uniforms.backgroundIntensity.value=D.backgroundIntensity,v.material.toneMapped=Ut.getTransfer(V.colorSpace)!==Xt,V.matrixAutoUpdate===!0&&V.updateMatrix(),v.material.uniforms.uvTransform.value.copy(V.matrix),(g!==V||S!==V.version||y!==r.toneMapping)&&(v.material.needsUpdate=!0,g=V,S=V.version,y=r.toneMapping),v.layers.enableAll(),I.unshift(v,v.geometry,v.material,0,0,null))}function M(I,D){I.getRGB(zu,ky(r)),o.buffers.color.setClear(zu.r,zu.g,zu.b,D,d)}function O(){x!==void 0&&(x.geometry.dispose(),x.material.dispose(),x=void 0),v!==void 0&&(v.geometry.dispose(),v.material.dispose(),v=void 0)}return{getClearColor:function(){return h},setClearColor:function(I,D=1){h.set(I),m=D,M(h,m)},getClearAlpha:function(){return m},setClearAlpha:function(I){m=I,M(h,m)},render:C,addToRenderList:E,dispose:O}}function E2(r,t){const i=r.getParameter(r.MAX_VERTEX_ATTRIBS),o={},l=S(null);let u=l,d=!1;function h(N,B,k,le,pe){let fe=!1;const q=g(le,k,B);u!==q&&(u=q,v(u.object)),fe=y(N,le,k,pe),fe&&T(N,le,k,pe),pe!==null&&t.update(pe,r.ELEMENT_ARRAY_BUFFER),(fe||d)&&(d=!1,D(N,B,k,le),pe!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(pe).buffer))}function m(){return r.createVertexArray()}function v(N){return r.bindVertexArray(N)}function x(N){return r.deleteVertexArray(N)}function g(N,B,k){const le=k.wireframe===!0;let pe=o[N.id];pe===void 0&&(pe={},o[N.id]=pe);let fe=pe[B.id];fe===void 0&&(fe={},pe[B.id]=fe);let q=fe[le];return q===void 0&&(q=S(m()),fe[le]=q),q}function S(N){const B=[],k=[],le=[];for(let pe=0;pe<i;pe++)B[pe]=0,k[pe]=0,le[pe]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:k,attributeDivisors:le,object:N,attributes:{},index:null}}function y(N,B,k,le){const pe=u.attributes,fe=B.attributes;let q=0;const se=k.getAttributes();for(const W in se)if(se[W].location>=0){const Se=pe[W];let Pe=fe[W];if(Pe===void 0&&(W==="instanceMatrix"&&N.instanceMatrix&&(Pe=N.instanceMatrix),W==="instanceColor"&&N.instanceColor&&(Pe=N.instanceColor)),Se===void 0||Se.attribute!==Pe||Pe&&Se.data!==Pe.data)return!0;q++}return u.attributesNum!==q||u.index!==le}function T(N,B,k,le){const pe={},fe=B.attributes;let q=0;const se=k.getAttributes();for(const W in se)if(se[W].location>=0){let Se=fe[W];Se===void 0&&(W==="instanceMatrix"&&N.instanceMatrix&&(Se=N.instanceMatrix),W==="instanceColor"&&N.instanceColor&&(Se=N.instanceColor));const Pe={};Pe.attribute=Se,Se&&Se.data&&(Pe.data=Se.data),pe[W]=Pe,q++}u.attributes=pe,u.attributesNum=q,u.index=le}function C(){const N=u.newAttributes;for(let B=0,k=N.length;B<k;B++)N[B]=0}function E(N){M(N,0)}function M(N,B){const k=u.newAttributes,le=u.enabledAttributes,pe=u.attributeDivisors;k[N]=1,le[N]===0&&(r.enableVertexAttribArray(N),le[N]=1),pe[N]!==B&&(r.vertexAttribDivisor(N,B),pe[N]=B)}function O(){const N=u.newAttributes,B=u.enabledAttributes;for(let k=0,le=B.length;k<le;k++)B[k]!==N[k]&&(r.disableVertexAttribArray(k),B[k]=0)}function I(N,B,k,le,pe,fe,q){q===!0?r.vertexAttribIPointer(N,B,k,pe,fe):r.vertexAttribPointer(N,B,k,le,pe,fe)}function D(N,B,k,le){C();const pe=le.attributes,fe=k.getAttributes(),q=B.defaultAttributeValues;for(const se in fe){const W=fe[se];if(W.location>=0){let xe=pe[se];if(xe===void 0&&(se==="instanceMatrix"&&N.instanceMatrix&&(xe=N.instanceMatrix),se==="instanceColor"&&N.instanceColor&&(xe=N.instanceColor)),xe!==void 0){const Se=xe.normalized,Pe=xe.itemSize,Je=t.get(xe);if(Je===void 0)continue;const xt=Je.buffer,F=Je.type,he=Je.bytesPerElement,ee=F===r.INT||F===r.UNSIGNED_INT||xe.gpuType===Rm;if(xe.isInterleavedBufferAttribute){const re=xe.data,Ee=re.stride,we=xe.offset;if(re.isInstancedInterleavedBuffer){for(let Q=0;Q<W.locationSize;Q++)M(W.location+Q,re.meshPerAttribute);N.isInstancedMesh!==!0&&le._maxInstanceCount===void 0&&(le._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Q=0;Q<W.locationSize;Q++)E(W.location+Q);r.bindBuffer(r.ARRAY_BUFFER,xt);for(let Q=0;Q<W.locationSize;Q++)I(W.location+Q,Pe/W.locationSize,F,Se,Ee*he,(we+Pe/W.locationSize*Q)*he,ee)}else{if(xe.isInstancedBufferAttribute){for(let re=0;re<W.locationSize;re++)M(W.location+re,xe.meshPerAttribute);N.isInstancedMesh!==!0&&le._maxInstanceCount===void 0&&(le._maxInstanceCount=xe.meshPerAttribute*xe.count)}else for(let re=0;re<W.locationSize;re++)E(W.location+re);r.bindBuffer(r.ARRAY_BUFFER,xt);for(let re=0;re<W.locationSize;re++)I(W.location+re,Pe/W.locationSize,F,Se,Pe*he,Pe/W.locationSize*re*he,ee)}}else if(q!==void 0){const Se=q[se];if(Se!==void 0)switch(Se.length){case 2:r.vertexAttrib2fv(W.location,Se);break;case 3:r.vertexAttrib3fv(W.location,Se);break;case 4:r.vertexAttrib4fv(W.location,Se);break;default:r.vertexAttrib1fv(W.location,Se)}}}}O()}function V(){X();for(const N in o){const B=o[N];for(const k in B){const le=B[k];for(const pe in le)x(le[pe].object),delete le[pe];delete B[k]}delete o[N]}}function H(N){if(o[N.id]===void 0)return;const B=o[N.id];for(const k in B){const le=B[k];for(const pe in le)x(le[pe].object),delete le[pe];delete B[k]}delete o[N.id]}function z(N){for(const B in o){const k=o[B];if(k[N.id]===void 0)continue;const le=k[N.id];for(const pe in le)x(le[pe].object),delete le[pe];delete k[N.id]}}function X(){w(),d=!0,u!==l&&(u=l,v(u.object))}function w(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:X,resetDefaultState:w,dispose:V,releaseStatesOfGeometry:H,releaseStatesOfProgram:z,initAttributes:C,enableAttribute:E,disableUnusedAttributes:O}}function T2(r,t,i){let o;function l(v){o=v}function u(v,x){r.drawArrays(o,v,x),i.update(x,o,1)}function d(v,x,g){g!==0&&(r.drawArraysInstanced(o,v,x,g),i.update(x,o,g))}function h(v,x,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(o,v,0,x,0,g);let y=0;for(let T=0;T<g;T++)y+=x[T];i.update(y,o,1)}function m(v,x,g,S){if(g===0)return;const y=t.get("WEBGL_multi_draw");if(y===null)for(let T=0;T<v.length;T++)d(v[T],x[T],S[T]);else{y.multiDrawArraysInstancedWEBGL(o,v,0,x,0,S,0,g);let T=0;for(let C=0;C<g;C++)T+=x[C]*S[C];i.update(T,o,1)}}this.setMode=l,this.render=u,this.renderInstances=d,this.renderMultiDraw=h,this.renderMultiDrawInstances=m}function b2(r,t,i,o){let l;function u(){if(l!==void 0)return l;if(t.has("EXT_texture_filter_anisotropic")===!0){const z=t.get("EXT_texture_filter_anisotropic");l=r.getParameter(z.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function d(z){return!(z!==ki&&o.convert(z)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function h(z){const X=z===za&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(z!==ca&&o.convert(z)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&z!==La&&!X)}function m(z){if(z==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";z="mediump"}return z==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let v=i.precision!==void 0?i.precision:"highp";const x=m(v);x!==v&&(console.warn("THREE.WebGLRenderer:",v,"not supported, using",x,"instead."),v=x);const g=i.logarithmicDepthBuffer===!0,S=i.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),y=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),T=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),C=r.getParameter(r.MAX_TEXTURE_SIZE),E=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),M=r.getParameter(r.MAX_VERTEX_ATTRIBS),O=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),I=r.getParameter(r.MAX_VARYING_VECTORS),D=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),V=T>0,H=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:u,getMaxPrecision:m,textureFormatReadable:d,textureTypeReadable:h,precision:v,logarithmicDepthBuffer:g,reversedDepthBuffer:S,maxTextures:y,maxVertexTextures:T,maxTextureSize:C,maxCubemapSize:E,maxAttributes:M,maxVertexUniforms:O,maxVaryings:I,maxFragmentUniforms:D,vertexTextures:V,maxSamples:H}}function A2(r){const t=this;let i=null,o=0,l=!1,u=!1;const d=new tr,h=new vt,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(g,S){const y=g.length!==0||S||o!==0||l;return l=S,o=g.length,y},this.beginShadows=function(){u=!0,x(null)},this.endShadows=function(){u=!1},this.setGlobalState=function(g,S){i=x(g,S,0)},this.setState=function(g,S,y){const T=g.clippingPlanes,C=g.clipIntersection,E=g.clipShadows,M=r.get(g);if(!l||T===null||T.length===0||u&&!E)u?x(null):v();else{const O=u?0:o,I=O*4;let D=M.clippingState||null;m.value=D,D=x(T,S,I,y);for(let V=0;V!==I;++V)D[V]=i[V];M.clippingState=D,this.numIntersection=C?this.numPlanes:0,this.numPlanes+=O}};function v(){m.value!==i&&(m.value=i,m.needsUpdate=o>0),t.numPlanes=o,t.numIntersection=0}function x(g,S,y,T){const C=g!==null?g.length:0;let E=null;if(C!==0){if(E=m.value,T!==!0||E===null){const M=y+C*4,O=S.matrixWorldInverse;h.getNormalMatrix(O),(E===null||E.length<M)&&(E=new Float32Array(M));for(let I=0,D=y;I!==C;++I,D+=4)d.copy(g[I]).applyMatrix4(O,h),d.normal.toArray(E,D),E[D+3]=d.constant}m.value=E,m.needsUpdate=!0}return t.numPlanes=C,t.numIntersection=0,E}}function C2(r){let t=new WeakMap;function i(d,h){return h===Bp?d.mapping=Eo:h===Fp&&(d.mapping=To),d}function o(d){if(d&&d.isTexture){const h=d.mapping;if(h===Bp||h===Fp)if(t.has(d)){const m=t.get(d).texture;return i(m,d.mapping)}else{const m=d.image;if(m&&m.height>0){const v=new yT(m.height);return v.fromEquirectangularTexture(r,d),t.set(d,v),d.addEventListener("dispose",l),i(v.texture,d.mapping)}else return null}}return d}function l(d){const h=d.target;h.removeEventListener("dispose",l);const m=t.get(h);m!==void 0&&(t.delete(h),m.dispose())}function u(){t=new WeakMap}return{get:o,dispose:u}}const mo=4,Hx=[.125,.215,.35,.446,.526,.582],ar=20,xp=new sf,Gx=new Rt;let yp=null,Sp=0,Mp=0,Ep=!1;const nr=(1+Math.sqrt(5))/2,po=1/nr,Vx=[new ne(-nr,po,0),new ne(nr,po,0),new ne(-po,0,nr),new ne(po,0,nr),new ne(0,nr,-po),new ne(0,nr,po),new ne(-1,1,-1),new ne(1,1,-1),new ne(-1,1,1),new ne(1,1,1)],R2=new ne;class jx{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,i=0,o=.1,l=100,u={}){const{size:d=256,position:h=R2}=u;yp=this._renderer.getRenderTarget(),Sp=this._renderer.getActiveCubeFace(),Mp=this._renderer.getActiveMipmapLevel(),Ep=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(d);const m=this._allocateTargets();return m.depthBuffer=!0,this._sceneToCubeUV(t,o,l,m,h),i>0&&this._blur(m,0,0,i),this._applyPMREM(m),this._cleanup(m),m}fromEquirectangular(t,i=null){return this._fromTexture(t,i)}fromCubemap(t,i=null){return this._fromTexture(t,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qx(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Xx(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(yp,Sp,Mp),this._renderer.xr.enabled=Ep,t.scissorTest=!1,Pu(t,0,0,t.width,t.height)}_fromTexture(t,i){t.mapping===Eo||t.mapping===To?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),yp=this._renderer.getRenderTarget(),Sp=this._renderer.getActiveCubeFace(),Mp=this._renderer.getActiveMipmapLevel(),Ep=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const o=i||this._allocateTargets();return this._textureToCubeUV(t,o),this._applyPMREM(o),this._cleanup(o),o}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,o={magFilter:ji,minFilter:ji,generateMipmaps:!1,type:za,format:ki,colorSpace:bo,depthBuffer:!1},l=kx(t,i,o);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=kx(t,i,o);const{_lodMax:u}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=w2(u)),this._blurMaterial=N2(u,t,i)}return l}_compileMaterial(t){const i=new pi(this._lodPlanes[0],t);this._renderer.compile(i,xp)}_sceneToCubeUV(t,i,o,l,u){const m=new Ri(90,1,i,o),v=[1,-1,1,1,1,1],x=[1,1,1,-1,-1,-1],g=this._renderer,S=g.autoClear,y=g.toneMapping;g.getClearColor(Gx),g.toneMapping=ys,g.autoClear=!1,g.state.buffers.depth.getReversed()&&(g.setRenderTarget(l),g.clearDepth(),g.setRenderTarget(null));const C=new xo({name:"PMREM.Background",side:ti,depthWrite:!1,depthTest:!1}),E=new pi(new No,C);let M=!1;const O=t.background;O?O.isColor&&(C.color.copy(O),t.background=null,M=!0):(C.color.copy(Gx),M=!0);for(let I=0;I<6;I++){const D=I%3;D===0?(m.up.set(0,v[I],0),m.position.set(u.x,u.y,u.z),m.lookAt(u.x+x[I],u.y,u.z)):D===1?(m.up.set(0,0,v[I]),m.position.set(u.x,u.y,u.z),m.lookAt(u.x,u.y+x[I],u.z)):(m.up.set(0,v[I],0),m.position.set(u.x,u.y,u.z),m.lookAt(u.x,u.y,u.z+x[I]));const V=this._cubeSize;Pu(l,D*V,I>2?V:0,V,V),g.setRenderTarget(l),M&&g.render(E,m),g.render(t,m)}E.geometry.dispose(),E.material.dispose(),g.toneMapping=y,g.autoClear=S,t.background=O}_textureToCubeUV(t,i){const o=this._renderer,l=t.mapping===Eo||t.mapping===To;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=qx()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Xx());const u=l?this._cubemapMaterial:this._equirectMaterial,d=new pi(this._lodPlanes[0],u),h=u.uniforms;h.envMap.value=t;const m=this._cubeSize;Pu(i,0,0,3*m,2*m),o.setRenderTarget(i),o.render(d,xp)}_applyPMREM(t){const i=this._renderer,o=i.autoClear;i.autoClear=!1;const l=this._lodPlanes.length;for(let u=1;u<l;u++){const d=Math.sqrt(this._sigmas[u]*this._sigmas[u]-this._sigmas[u-1]*this._sigmas[u-1]),h=Vx[(l-u-1)%Vx.length];this._blur(t,u-1,u,d,h)}i.autoClear=o}_blur(t,i,o,l,u){const d=this._pingPongRenderTarget;this._halfBlur(t,d,i,o,l,"latitudinal",u),this._halfBlur(d,t,o,o,l,"longitudinal",u)}_halfBlur(t,i,o,l,u,d,h){const m=this._renderer,v=this._blurMaterial;d!=="latitudinal"&&d!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const x=3,g=new pi(this._lodPlanes[l],v),S=v.uniforms,y=this._sizeLods[o]-1,T=isFinite(u)?Math.PI/(2*y):2*Math.PI/(2*ar-1),C=u/T,E=isFinite(u)?1+Math.floor(x*C):ar;E>ar&&console.warn(`sigmaRadians, ${u}, is too large and will clip, as it requested ${E} samples when the maximum is set to ${ar}`);const M=[];let O=0;for(let z=0;z<ar;++z){const X=z/C,w=Math.exp(-X*X/2);M.push(w),z===0?O+=w:z<E&&(O+=2*w)}for(let z=0;z<M.length;z++)M[z]=M[z]/O;S.envMap.value=t.texture,S.samples.value=E,S.weights.value=M,S.latitudinal.value=d==="latitudinal",h&&(S.poleAxis.value=h);const{_lodMax:I}=this;S.dTheta.value=T,S.mipInt.value=I-o;const D=this._sizeLods[l],V=3*D*(l>I-mo?l-I+mo:0),H=4*(this._cubeSize-D);Pu(i,V,H,3*D,2*D),m.setRenderTarget(i),m.render(g,xp)}}function w2(r){const t=[],i=[],o=[];let l=r;const u=r-mo+1+Hx.length;for(let d=0;d<u;d++){const h=Math.pow(2,l);i.push(h);let m=1/h;d>r-mo?m=Hx[d-r+mo-1]:d===0&&(m=0),o.push(m);const v=1/(h-2),x=-v,g=1+v,S=[x,x,g,x,g,g,x,x,g,g,x,g],y=6,T=6,C=3,E=2,M=1,O=new Float32Array(C*T*y),I=new Float32Array(E*T*y),D=new Float32Array(M*T*y);for(let H=0;H<y;H++){const z=H%3*2/3-1,X=H>2?0:-1,w=[z,X,0,z+2/3,X,0,z+2/3,X+1,0,z,X,0,z+2/3,X+1,0,z,X+1,0];O.set(w,C*T*H),I.set(S,E*T*H);const N=[H,H,H,H,H,H];D.set(N,M*T*H)}const V=new Yi;V.setAttribute("position",new qi(O,C)),V.setAttribute("uv",new qi(I,E)),V.setAttribute("faceIndex",new qi(D,M)),t.push(V),l>mo&&l--}return{lodPlanes:t,sizeLods:i,sigmas:o}}function kx(r,t,i){const o=new Xi(r,t,i);return o.texture.mapping=nf,o.texture.name="PMREM.cubeUv",o.scissorTest=!0,o}function Pu(r,t,i,o,l){r.viewport.set(t,i,o,l),r.scissor.set(t,i,o,l)}function N2(r,t,i){const o=new Float32Array(ar),l=new ne(0,1,0);return new qn({name:"SphericalGaussianBlur",defines:{n:ar,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:o},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:Fm(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Oa,depthTest:!1,depthWrite:!1})}function Xx(){return new qn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fm(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Oa,depthTest:!1,depthWrite:!1})}function qx(){return new qn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fm(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Oa,depthTest:!1,depthWrite:!1})}function Fm(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function D2(r){let t=new WeakMap,i=null;function o(h){if(h&&h.isTexture){const m=h.mapping,v=m===Bp||m===Fp,x=m===Eo||m===To;if(v||x){let g=t.get(h);const S=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==S)return i===null&&(i=new jx(r)),g=v?i.fromEquirectangular(h,g):i.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),g.texture;if(g!==void 0)return g.texture;{const y=h.image;return v&&y&&y.height>0||x&&y&&l(y)?(i===null&&(i=new jx(r)),g=v?i.fromEquirectangular(h):i.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),h.addEventListener("dispose",u),g.texture):null}}}return h}function l(h){let m=0;const v=6;for(let x=0;x<v;x++)h[x]!==void 0&&m++;return m===v}function u(h){const m=h.target;m.removeEventListener("dispose",u);const v=t.get(m);v!==void 0&&(t.delete(m),v.dispose())}function d(){t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:o,dispose:d}}function U2(r){const t={};function i(o){if(t[o]!==void 0)return t[o];let l;switch(o){case"WEBGL_depth_texture":l=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":l=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":l=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":l=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:l=r.getExtension(o)}return t[o]=l,l}return{has:function(o){return i(o)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(o){const l=i(o);return l===null&&Fl("THREE.WebGLRenderer: "+o+" extension not supported."),l}}}function L2(r,t,i,o){const l={},u=new WeakMap;function d(g){const S=g.target;S.index!==null&&t.remove(S.index);for(const T in S.attributes)t.remove(S.attributes[T]);S.removeEventListener("dispose",d),delete l[S.id];const y=u.get(S);y&&(t.remove(y),u.delete(S)),o.releaseStatesOfGeometry(S),S.isInstancedBufferGeometry===!0&&delete S._maxInstanceCount,i.memory.geometries--}function h(g,S){return l[S.id]===!0||(S.addEventListener("dispose",d),l[S.id]=!0,i.memory.geometries++),S}function m(g){const S=g.attributes;for(const y in S)t.update(S[y],r.ARRAY_BUFFER)}function v(g){const S=[],y=g.index,T=g.attributes.position;let C=0;if(y!==null){const O=y.array;C=y.version;for(let I=0,D=O.length;I<D;I+=3){const V=O[I+0],H=O[I+1],z=O[I+2];S.push(V,H,H,z,z,V)}}else if(T!==void 0){const O=T.array;C=T.version;for(let I=0,D=O.length/3-1;I<D;I+=3){const V=I+0,H=I+1,z=I+2;S.push(V,H,H,z,z,V)}}else return;const E=new(Iy(S)?jy:Vy)(S,1);E.version=C;const M=u.get(g);M&&t.remove(M),u.set(g,E)}function x(g){const S=u.get(g);if(S){const y=g.index;y!==null&&S.version<y.version&&v(g)}else v(g);return u.get(g)}return{get:h,update:m,getWireframeAttribute:x}}function O2(r,t,i){let o;function l(S){o=S}let u,d;function h(S){u=S.type,d=S.bytesPerElement}function m(S,y){r.drawElements(o,y,u,S*d),i.update(y,o,1)}function v(S,y,T){T!==0&&(r.drawElementsInstanced(o,y,u,S*d,T),i.update(y,o,T))}function x(S,y,T){if(T===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(o,y,0,u,S,0,T);let E=0;for(let M=0;M<T;M++)E+=y[M];i.update(E,o,1)}function g(S,y,T,C){if(T===0)return;const E=t.get("WEBGL_multi_draw");if(E===null)for(let M=0;M<S.length;M++)v(S[M]/d,y[M],C[M]);else{E.multiDrawElementsInstancedWEBGL(o,y,0,u,S,0,C,0,T);let M=0;for(let O=0;O<T;O++)M+=y[O]*C[O];i.update(M,o,1)}}this.setMode=l,this.setIndex=h,this.render=m,this.renderInstances=v,this.renderMultiDraw=x,this.renderMultiDrawInstances=g}function z2(r){const t={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function o(u,d,h){switch(i.calls++,d){case r.TRIANGLES:i.triangles+=h*(u/3);break;case r.LINES:i.lines+=h*(u/2);break;case r.LINE_STRIP:i.lines+=h*(u-1);break;case r.LINE_LOOP:i.lines+=h*u;break;case r.POINTS:i.points+=h*u;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",d);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:t,render:i,programs:null,autoReset:!0,reset:l,update:o}}function P2(r,t,i){const o=new WeakMap,l=new Wt;function u(d,h,m){const v=d.morphTargetInfluences,x=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=x!==void 0?x.length:0;let S=o.get(h);if(S===void 0||S.count!==g){let N=function(){X.dispose(),o.delete(h),h.removeEventListener("dispose",N)};var y=N;S!==void 0&&S.texture.dispose();const T=h.morphAttributes.position!==void 0,C=h.morphAttributes.normal!==void 0,E=h.morphAttributes.color!==void 0,M=h.morphAttributes.position||[],O=h.morphAttributes.normal||[],I=h.morphAttributes.color||[];let D=0;T===!0&&(D=1),C===!0&&(D=2),E===!0&&(D=3);let V=h.attributes.position.count*D,H=1;V>t.maxTextureSize&&(H=Math.ceil(V/t.maxTextureSize),V=t.maxTextureSize);const z=new Float32Array(V*H*4*g),X=new By(z,V,H,g);X.type=La,X.needsUpdate=!0;const w=D*4;for(let B=0;B<g;B++){const k=M[B],le=O[B],pe=I[B],fe=V*H*4*B;for(let q=0;q<k.count;q++){const se=q*w;T===!0&&(l.fromBufferAttribute(k,q),z[fe+se+0]=l.x,z[fe+se+1]=l.y,z[fe+se+2]=l.z,z[fe+se+3]=0),C===!0&&(l.fromBufferAttribute(le,q),z[fe+se+4]=l.x,z[fe+se+5]=l.y,z[fe+se+6]=l.z,z[fe+se+7]=0),E===!0&&(l.fromBufferAttribute(pe,q),z[fe+se+8]=l.x,z[fe+se+9]=l.y,z[fe+se+10]=l.z,z[fe+se+11]=pe.itemSize===4?l.w:1)}}S={count:g,texture:X,size:new ft(V,H)},o.set(h,S),h.addEventListener("dispose",N)}if(d.isInstancedMesh===!0&&d.morphTexture!==null)m.getUniforms().setValue(r,"morphTexture",d.morphTexture,i);else{let T=0;for(let E=0;E<v.length;E++)T+=v[E];const C=h.morphTargetsRelative?1:1-T;m.getUniforms().setValue(r,"morphTargetBaseInfluence",C),m.getUniforms().setValue(r,"morphTargetInfluences",v)}m.getUniforms().setValue(r,"morphTargetsTexture",S.texture,i),m.getUniforms().setValue(r,"morphTargetsTextureSize",S.size)}return{update:u}}function I2(r,t,i,o){let l=new WeakMap;function u(m){const v=o.render.frame,x=m.geometry,g=t.get(m,x);if(l.get(g)!==v&&(t.update(g),l.set(g,v)),m.isInstancedMesh&&(m.hasEventListener("dispose",h)===!1&&m.addEventListener("dispose",h),l.get(m)!==v&&(i.update(m.instanceMatrix,r.ARRAY_BUFFER),m.instanceColor!==null&&i.update(m.instanceColor,r.ARRAY_BUFFER),l.set(m,v))),m.isSkinnedMesh){const S=m.skeleton;l.get(S)!==v&&(S.update(),l.set(S,v))}return g}function d(){l=new WeakMap}function h(m){const v=m.target;v.removeEventListener("dispose",h),i.remove(v.instanceMatrix),v.instanceColor!==null&&i.remove(v.instanceColor)}return{update:u,dispose:d}}const $y=new Yn,Yx=new Wy(1,1),eS=new By,tS=new aT,nS=new qy,Wx=[],Zx=[],Kx=new Float32Array(16),Qx=new Float32Array(9),Jx=new Float32Array(4);function Do(r,t,i){const o=r[0];if(o<=0||o>0)return r;const l=t*i;let u=Wx[l];if(u===void 0&&(u=new Float32Array(l),Wx[l]=u),t!==0){o.toArray(u,0);for(let d=1,h=0;d!==t;++d)h+=i,r[d].toArray(u,h)}return u}function yn(r,t){if(r.length!==t.length)return!1;for(let i=0,o=r.length;i<o;i++)if(r[i]!==t[i])return!1;return!0}function Sn(r,t){for(let i=0,o=t.length;i<o;i++)r[i]=t[i]}function rf(r,t){let i=Zx[t];i===void 0&&(i=new Int32Array(t),Zx[t]=i);for(let o=0;o!==t;++o)i[o]=r.allocateTextureUnit();return i}function B2(r,t){const i=this.cache;i[0]!==t&&(r.uniform1f(this.addr,t),i[0]=t)}function F2(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(yn(i,t))return;r.uniform2fv(this.addr,t),Sn(i,t)}}function H2(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else if(t.r!==void 0)(i[0]!==t.r||i[1]!==t.g||i[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),i[0]=t.r,i[1]=t.g,i[2]=t.b);else{if(yn(i,t))return;r.uniform3fv(this.addr,t),Sn(i,t)}}function G2(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(yn(i,t))return;r.uniform4fv(this.addr,t),Sn(i,t)}}function V2(r,t){const i=this.cache,o=t.elements;if(o===void 0){if(yn(i,t))return;r.uniformMatrix2fv(this.addr,!1,t),Sn(i,t)}else{if(yn(i,o))return;Jx.set(o),r.uniformMatrix2fv(this.addr,!1,Jx),Sn(i,o)}}function j2(r,t){const i=this.cache,o=t.elements;if(o===void 0){if(yn(i,t))return;r.uniformMatrix3fv(this.addr,!1,t),Sn(i,t)}else{if(yn(i,o))return;Qx.set(o),r.uniformMatrix3fv(this.addr,!1,Qx),Sn(i,o)}}function k2(r,t){const i=this.cache,o=t.elements;if(o===void 0){if(yn(i,t))return;r.uniformMatrix4fv(this.addr,!1,t),Sn(i,t)}else{if(yn(i,o))return;Kx.set(o),r.uniformMatrix4fv(this.addr,!1,Kx),Sn(i,o)}}function X2(r,t){const i=this.cache;i[0]!==t&&(r.uniform1i(this.addr,t),i[0]=t)}function q2(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(yn(i,t))return;r.uniform2iv(this.addr,t),Sn(i,t)}}function Y2(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(yn(i,t))return;r.uniform3iv(this.addr,t),Sn(i,t)}}function W2(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(yn(i,t))return;r.uniform4iv(this.addr,t),Sn(i,t)}}function Z2(r,t){const i=this.cache;i[0]!==t&&(r.uniform1ui(this.addr,t),i[0]=t)}function K2(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(yn(i,t))return;r.uniform2uiv(this.addr,t),Sn(i,t)}}function Q2(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(yn(i,t))return;r.uniform3uiv(this.addr,t),Sn(i,t)}}function J2(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(yn(i,t))return;r.uniform4uiv(this.addr,t),Sn(i,t)}}function $2(r,t,i){const o=this.cache,l=i.allocateTextureUnit();o[0]!==l&&(r.uniform1i(this.addr,l),o[0]=l);let u;this.type===r.SAMPLER_2D_SHADOW?(Yx.compareFunction=Py,u=Yx):u=$y,i.setTexture2D(t||u,l)}function eC(r,t,i){const o=this.cache,l=i.allocateTextureUnit();o[0]!==l&&(r.uniform1i(this.addr,l),o[0]=l),i.setTexture3D(t||tS,l)}function tC(r,t,i){const o=this.cache,l=i.allocateTextureUnit();o[0]!==l&&(r.uniform1i(this.addr,l),o[0]=l),i.setTextureCube(t||nS,l)}function nC(r,t,i){const o=this.cache,l=i.allocateTextureUnit();o[0]!==l&&(r.uniform1i(this.addr,l),o[0]=l),i.setTexture2DArray(t||eS,l)}function iC(r){switch(r){case 5126:return B2;case 35664:return F2;case 35665:return H2;case 35666:return G2;case 35674:return V2;case 35675:return j2;case 35676:return k2;case 5124:case 35670:return X2;case 35667:case 35671:return q2;case 35668:case 35672:return Y2;case 35669:case 35673:return W2;case 5125:return Z2;case 36294:return K2;case 36295:return Q2;case 36296:return J2;case 35678:case 36198:case 36298:case 36306:case 35682:return $2;case 35679:case 36299:case 36307:return eC;case 35680:case 36300:case 36308:case 36293:return tC;case 36289:case 36303:case 36311:case 36292:return nC}}function aC(r,t){r.uniform1fv(this.addr,t)}function sC(r,t){const i=Do(t,this.size,2);r.uniform2fv(this.addr,i)}function rC(r,t){const i=Do(t,this.size,3);r.uniform3fv(this.addr,i)}function oC(r,t){const i=Do(t,this.size,4);r.uniform4fv(this.addr,i)}function lC(r,t){const i=Do(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,i)}function cC(r,t){const i=Do(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,i)}function uC(r,t){const i=Do(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,i)}function fC(r,t){r.uniform1iv(this.addr,t)}function dC(r,t){r.uniform2iv(this.addr,t)}function hC(r,t){r.uniform3iv(this.addr,t)}function pC(r,t){r.uniform4iv(this.addr,t)}function mC(r,t){r.uniform1uiv(this.addr,t)}function gC(r,t){r.uniform2uiv(this.addr,t)}function vC(r,t){r.uniform3uiv(this.addr,t)}function _C(r,t){r.uniform4uiv(this.addr,t)}function xC(r,t,i){const o=this.cache,l=t.length,u=rf(i,l);yn(o,u)||(r.uniform1iv(this.addr,u),Sn(o,u));for(let d=0;d!==l;++d)i.setTexture2D(t[d]||$y,u[d])}function yC(r,t,i){const o=this.cache,l=t.length,u=rf(i,l);yn(o,u)||(r.uniform1iv(this.addr,u),Sn(o,u));for(let d=0;d!==l;++d)i.setTexture3D(t[d]||tS,u[d])}function SC(r,t,i){const o=this.cache,l=t.length,u=rf(i,l);yn(o,u)||(r.uniform1iv(this.addr,u),Sn(o,u));for(let d=0;d!==l;++d)i.setTextureCube(t[d]||nS,u[d])}function MC(r,t,i){const o=this.cache,l=t.length,u=rf(i,l);yn(o,u)||(r.uniform1iv(this.addr,u),Sn(o,u));for(let d=0;d!==l;++d)i.setTexture2DArray(t[d]||eS,u[d])}function EC(r){switch(r){case 5126:return aC;case 35664:return sC;case 35665:return rC;case 35666:return oC;case 35674:return lC;case 35675:return cC;case 35676:return uC;case 5124:case 35670:return fC;case 35667:case 35671:return dC;case 35668:case 35672:return hC;case 35669:case 35673:return pC;case 5125:return mC;case 36294:return gC;case 36295:return vC;case 36296:return _C;case 35678:case 36198:case 36298:case 36306:case 35682:return xC;case 35679:case 36299:case 36307:return yC;case 35680:case 36300:case 36308:case 36293:return SC;case 36289:case 36303:case 36311:case 36292:return MC}}class TC{constructor(t,i,o){this.id=t,this.addr=o,this.cache=[],this.type=i.type,this.setValue=iC(i.type)}}class bC{constructor(t,i,o){this.id=t,this.addr=o,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=EC(i.type)}}class AC{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,i,o){const l=this.seq;for(let u=0,d=l.length;u!==d;++u){const h=l[u];h.setValue(t,i[h.id],o)}}}const Tp=/(\w+)(\])?(\[|\.)?/g;function $x(r,t){r.seq.push(t),r.map[t.id]=t}function CC(r,t,i){const o=r.name,l=o.length;for(Tp.lastIndex=0;;){const u=Tp.exec(o),d=Tp.lastIndex;let h=u[1];const m=u[2]==="]",v=u[3];if(m&&(h=h|0),v===void 0||v==="["&&d+2===l){$x(i,v===void 0?new TC(h,r,t):new bC(h,r,t));break}else{let g=i.map[h];g===void 0&&(g=new AC(h),$x(i,g)),i=g}}}class qu{constructor(t,i){this.seq=[],this.map={};const o=t.getProgramParameter(i,t.ACTIVE_UNIFORMS);for(let l=0;l<o;++l){const u=t.getActiveUniform(i,l),d=t.getUniformLocation(i,u.name);CC(u,d,this)}}setValue(t,i,o,l){const u=this.map[i];u!==void 0&&u.setValue(t,o,l)}setOptional(t,i,o){const l=i[o];l!==void 0&&this.setValue(t,o,l)}static upload(t,i,o,l){for(let u=0,d=i.length;u!==d;++u){const h=i[u],m=o[h.id];m.needsUpdate!==!1&&h.setValue(t,m.value,l)}}static seqWithValue(t,i){const o=[];for(let l=0,u=t.length;l!==u;++l){const d=t[l];d.id in i&&o.push(d)}return o}}function ey(r,t,i){const o=r.createShader(t);return r.shaderSource(o,i),r.compileShader(o),o}const RC=37297;let wC=0;function NC(r,t){const i=r.split(`
`),o=[],l=Math.max(t-6,0),u=Math.min(t+6,i.length);for(let d=l;d<u;d++){const h=d+1;o.push(`${h===t?">":" "} ${h}: ${i[d]}`)}return o.join(`
`)}const ty=new vt;function DC(r){Ut._getMatrix(ty,Ut.workingColorSpace,r);const t=`mat3( ${ty.elements.map(i=>i.toFixed(4))} )`;switch(Ut.getTransfer(r)){case Ju:return[t,"LinearTransferOETF"];case Xt:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function ny(r,t,i){const o=r.getShaderParameter(t,r.COMPILE_STATUS),u=(r.getShaderInfoLog(t)||"").trim();if(o&&u==="")return"";const d=/ERROR: 0:(\d+)/.exec(u);if(d){const h=parseInt(d[1]);return i.toUpperCase()+`

`+u+`

`+NC(r.getShaderSource(t),h)}else return u}function UC(r,t){const i=DC(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}function LC(r,t){let i;switch(t){case yy:i="Linear";break;case Sy:i="Reinhard";break;case My:i="Cineon";break;case Cm:i="ACESFilmic";break;case Ty:i="AgX";break;case by:i="Neutral";break;case Ey:i="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),i="Linear"}return"vec3 "+r+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const Iu=new ne;function OC(){Ut.getLuminanceCoefficients(Iu);const r=Iu.x.toFixed(4),t=Iu.y.toFixed(4),i=Iu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function zC(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ul).join(`
`)}function PC(r){const t=[];for(const i in r){const o=r[i];o!==!1&&t.push("#define "+i+" "+o)}return t.join(`
`)}function IC(r,t){const i={},o=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let l=0;l<o;l++){const u=r.getActiveAttrib(t,l),d=u.name;let h=1;u.type===r.FLOAT_MAT2&&(h=2),u.type===r.FLOAT_MAT3&&(h=3),u.type===r.FLOAT_MAT4&&(h=4),i[d]={type:u.type,location:r.getAttribLocation(t,d),locationSize:h}}return i}function Ul(r){return r!==""}function iy(r,t){const i=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function ay(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const BC=/^[ \t]*#include +<([\w\d./]+)>/gm;function _m(r){return r.replace(BC,HC)}const FC=new Map;function HC(r,t){let i=_t[t];if(i===void 0){const o=FC.get(t);if(o!==void 0)i=_t[o],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,o);else throw new Error("Can not resolve #include <"+t+">")}return _m(i)}const GC=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function sy(r){return r.replace(GC,VC)}function VC(r,t,i,o){let l="";for(let u=parseInt(t);u<parseInt(i);u++)l+=o.replace(/\[\s*i\s*\]/g,"[ "+u+" ]").replace(/UNROLLED_LOOP_INDEX/g,u);return l}function ry(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function jC(r){let t="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===_y?t="SHADOWMAP_TYPE_PCF":r.shadowMapType===_E?t="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===Ua&&(t="SHADOWMAP_TYPE_VSM"),t}function kC(r){let t="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case Eo:case To:t="ENVMAP_TYPE_CUBE";break;case nf:t="ENVMAP_TYPE_CUBE_UV";break}return t}function XC(r){let t="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case To:t="ENVMAP_MODE_REFRACTION";break}return t}function qC(r){let t="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case xy:t="ENVMAP_BLENDING_MULTIPLY";break;case IE:t="ENVMAP_BLENDING_MIX";break;case BE:t="ENVMAP_BLENDING_ADD";break}return t}function YC(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const i=Math.log2(t)-2,o=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:o,maxMip:i}}function WC(r,t,i,o){const l=r.getContext(),u=i.defines;let d=i.vertexShader,h=i.fragmentShader;const m=jC(i),v=kC(i),x=XC(i),g=qC(i),S=YC(i),y=zC(i),T=PC(u),C=l.createProgram();let E,M,O=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(E=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter(Ul).join(`
`),E.length>0&&(E+=`
`),M=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter(Ul).join(`
`),M.length>0&&(M+=`
`)):(E=[ry(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+x:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ul).join(`
`),M=[ry(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+v:"",i.envMap?"#define "+x:"",i.envMap?"#define "+g:"",S?"#define CUBEUV_TEXEL_WIDTH "+S.texelWidth:"",S?"#define CUBEUV_TEXEL_HEIGHT "+S.texelHeight:"",S?"#define CUBEUV_MAX_MIP "+S.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor||i.batchingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==ys?"#define TONE_MAPPING":"",i.toneMapping!==ys?_t.tonemapping_pars_fragment:"",i.toneMapping!==ys?LC("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",_t.colorspace_pars_fragment,UC("linearToOutputTexel",i.outputColorSpace),OC(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(Ul).join(`
`)),d=_m(d),d=iy(d,i),d=ay(d,i),h=_m(h),h=iy(h,i),h=ay(h,i),d=sy(d),h=sy(h),i.isRawShaderMaterial!==!0&&(O=`#version 300 es
`,E=[y,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+E,M=["#define varying in",i.glslVersion===gx?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===gx?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+M);const I=O+E+d,D=O+M+h,V=ey(l,l.VERTEX_SHADER,I),H=ey(l,l.FRAGMENT_SHADER,D);l.attachShader(C,V),l.attachShader(C,H),i.index0AttributeName!==void 0?l.bindAttribLocation(C,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(C,0,"position"),l.linkProgram(C);function z(B){if(r.debug.checkShaderErrors){const k=l.getProgramInfoLog(C)||"",le=l.getShaderInfoLog(V)||"",pe=l.getShaderInfoLog(H)||"",fe=k.trim(),q=le.trim(),se=pe.trim();let W=!0,xe=!0;if(l.getProgramParameter(C,l.LINK_STATUS)===!1)if(W=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(l,C,V,H);else{const Se=ny(l,V,"vertex"),Pe=ny(l,H,"fragment");console.error("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(C,l.VALIDATE_STATUS)+`

Material Name: `+B.name+`
Material Type: `+B.type+`

Program Info Log: `+fe+`
`+Se+`
`+Pe)}else fe!==""?console.warn("THREE.WebGLProgram: Program Info Log:",fe):(q===""||se==="")&&(xe=!1);xe&&(B.diagnostics={runnable:W,programLog:fe,vertexShader:{log:q,prefix:E},fragmentShader:{log:se,prefix:M}})}l.deleteShader(V),l.deleteShader(H),X=new qu(l,C),w=IC(l,C)}let X;this.getUniforms=function(){return X===void 0&&z(this),X};let w;this.getAttributes=function(){return w===void 0&&z(this),w};let N=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=l.getProgramParameter(C,RC)),N},this.destroy=function(){o.releaseStatesOfProgram(this),l.deleteProgram(C),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=wC++,this.cacheKey=t,this.usedTimes=1,this.program=C,this.vertexShader=V,this.fragmentShader=H,this}let ZC=0;class KC{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const i=t.vertexShader,o=t.fragmentShader,l=this._getShaderStage(i),u=this._getShaderStage(o),d=this._getShaderCacheForMaterial(t);return d.has(l)===!1&&(d.add(l),l.usedTimes++),d.has(u)===!1&&(d.add(u),u.usedTimes++),this}remove(t){const i=this.materialCache.get(t);for(const o of i)o.usedTimes--,o.usedTimes===0&&this.shaderCache.delete(o.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const i=this.materialCache;let o=i.get(t);return o===void 0&&(o=new Set,i.set(t,o)),o}_getShaderStage(t){const i=this.shaderCache;let o=i.get(t);return o===void 0&&(o=new QC(t),i.set(t,o)),o}}class QC{constructor(t){this.id=ZC++,this.code=t,this.usedTimes=0}}function JC(r,t,i,o,l,u,d){const h=new Hy,m=new KC,v=new Set,x=[],g=l.logarithmicDepthBuffer,S=l.vertexTextures;let y=l.precision;const T={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function C(w){return v.add(w),w===0?"uv":`uv${w}`}function E(w,N,B,k,le){const pe=k.fog,fe=le.geometry,q=w.isMeshStandardMaterial?k.environment:null,se=(w.isMeshStandardMaterial?i:t).get(w.envMap||q),W=se&&se.mapping===nf?se.image.height:null,xe=T[w.type];w.precision!==null&&(y=l.getMaxPrecision(w.precision),y!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",y,"instead."));const Se=fe.morphAttributes.position||fe.morphAttributes.normal||fe.morphAttributes.color,Pe=Se!==void 0?Se.length:0;let Je=0;fe.morphAttributes.position!==void 0&&(Je=1),fe.morphAttributes.normal!==void 0&&(Je=2),fe.morphAttributes.color!==void 0&&(Je=3);let xt,F,he,ee;if(xe){const bt=ra[xe];xt=bt.vertexShader,F=bt.fragmentShader}else xt=w.vertexShader,F=w.fragmentShader,m.update(w),he=m.getVertexShaderID(w),ee=m.getFragmentShaderID(w);const re=r.getRenderTarget(),Ee=r.state.buffers.depth.getReversed(),we=le.isInstancedMesh===!0,Q=le.isBatchedMesh===!0,de=!!w.map,je=!!w.matcap,P=!!se,Ne=!!w.aoMap,ze=!!w.lightMap,ke=!!w.bumpMap,De=!!w.normalMap,at=!!w.displacementMap,Ge=!!w.emissiveMap,ot=!!w.metalnessMap,gt=!!w.roughnessMap,Ft=w.anisotropy>0,U=w.clearcoat>0,A=w.dispersion>0,ie=w.iridescence>0,ve=w.sheen>0,Me=w.transmission>0,me=Ft&&!!w.anisotropyMap,Ye=U&&!!w.clearcoatMap,Re=U&&!!w.clearcoatNormalMap,Qe=U&&!!w.clearcoatRoughnessMap,et=ie&&!!w.iridescenceMap,Ae=ie&&!!w.iridescenceThicknessMap,Ie=ve&&!!w.sheenColorMap,rt=ve&&!!w.sheenRoughnessMap,$e=!!w.specularMap,Be=!!w.specularColorMap,ht=!!w.specularIntensityMap,j=Me&&!!w.transmissionMap,Ce=Me&&!!w.thicknessMap,Le=!!w.gradientMap,qe=!!w.alphaMap,Te=w.alphaTest>0,ye=!!w.alphaHash,Ke=!!w.extensions;let ut=ys;w.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(ut=r.toneMapping);const qt={shaderID:xe,shaderType:w.type,shaderName:w.name,vertexShader:xt,fragmentShader:F,defines:w.defines,customVertexShaderID:he,customFragmentShaderID:ee,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:y,batching:Q,batchingColor:Q&&le._colorsTexture!==null,instancing:we,instancingColor:we&&le.instanceColor!==null,instancingMorph:we&&le.morphTexture!==null,supportsVertexTextures:S,outputColorSpace:re===null?r.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:bo,alphaToCoverage:!!w.alphaToCoverage,map:de,matcap:je,envMap:P,envMapMode:P&&se.mapping,envMapCubeUVHeight:W,aoMap:Ne,lightMap:ze,bumpMap:ke,normalMap:De,displacementMap:S&&at,emissiveMap:Ge,normalMapObjectSpace:De&&w.normalMapType===VE,normalMapTangentSpace:De&&w.normalMapType===zy,metalnessMap:ot,roughnessMap:gt,anisotropy:Ft,anisotropyMap:me,clearcoat:U,clearcoatMap:Ye,clearcoatNormalMap:Re,clearcoatRoughnessMap:Qe,dispersion:A,iridescence:ie,iridescenceMap:et,iridescenceThicknessMap:Ae,sheen:ve,sheenColorMap:Ie,sheenRoughnessMap:rt,specularMap:$e,specularColorMap:Be,specularIntensityMap:ht,transmission:Me,transmissionMap:j,thicknessMap:Ce,gradientMap:Le,opaque:w.transparent===!1&&w.blending===vo&&w.alphaToCoverage===!1,alphaMap:qe,alphaTest:Te,alphaHash:ye,combine:w.combine,mapUv:de&&C(w.map.channel),aoMapUv:Ne&&C(w.aoMap.channel),lightMapUv:ze&&C(w.lightMap.channel),bumpMapUv:ke&&C(w.bumpMap.channel),normalMapUv:De&&C(w.normalMap.channel),displacementMapUv:at&&C(w.displacementMap.channel),emissiveMapUv:Ge&&C(w.emissiveMap.channel),metalnessMapUv:ot&&C(w.metalnessMap.channel),roughnessMapUv:gt&&C(w.roughnessMap.channel),anisotropyMapUv:me&&C(w.anisotropyMap.channel),clearcoatMapUv:Ye&&C(w.clearcoatMap.channel),clearcoatNormalMapUv:Re&&C(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Qe&&C(w.clearcoatRoughnessMap.channel),iridescenceMapUv:et&&C(w.iridescenceMap.channel),iridescenceThicknessMapUv:Ae&&C(w.iridescenceThicknessMap.channel),sheenColorMapUv:Ie&&C(w.sheenColorMap.channel),sheenRoughnessMapUv:rt&&C(w.sheenRoughnessMap.channel),specularMapUv:$e&&C(w.specularMap.channel),specularColorMapUv:Be&&C(w.specularColorMap.channel),specularIntensityMapUv:ht&&C(w.specularIntensityMap.channel),transmissionMapUv:j&&C(w.transmissionMap.channel),thicknessMapUv:Ce&&C(w.thicknessMap.channel),alphaMapUv:qe&&C(w.alphaMap.channel),vertexTangents:!!fe.attributes.tangent&&(De||Ft),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!fe.attributes.color&&fe.attributes.color.itemSize===4,pointsUvs:le.isPoints===!0&&!!fe.attributes.uv&&(de||qe),fog:!!pe,useFog:w.fog===!0,fogExp2:!!pe&&pe.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:g,reversedDepthBuffer:Ee,skinning:le.isSkinnedMesh===!0,morphTargets:fe.morphAttributes.position!==void 0,morphNormals:fe.morphAttributes.normal!==void 0,morphColors:fe.morphAttributes.color!==void 0,morphTargetsCount:Pe,morphTextureStride:Je,numDirLights:N.directional.length,numPointLights:N.point.length,numSpotLights:N.spot.length,numSpotLightMaps:N.spotLightMap.length,numRectAreaLights:N.rectArea.length,numHemiLights:N.hemi.length,numDirLightShadows:N.directionalShadowMap.length,numPointLightShadows:N.pointShadowMap.length,numSpotLightShadows:N.spotShadowMap.length,numSpotLightShadowsWithMaps:N.numSpotLightShadowsWithMaps,numLightProbes:N.numLightProbes,numClippingPlanes:d.numPlanes,numClipIntersection:d.numIntersection,dithering:w.dithering,shadowMapEnabled:r.shadowMap.enabled&&B.length>0,shadowMapType:r.shadowMap.type,toneMapping:ut,decodeVideoTexture:de&&w.map.isVideoTexture===!0&&Ut.getTransfer(w.map.colorSpace)===Xt,decodeVideoTextureEmissive:Ge&&w.emissiveMap.isVideoTexture===!0&&Ut.getTransfer(w.emissiveMap.colorSpace)===Xt,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===oa,flipSided:w.side===ti,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Ke&&w.extensions.clipCullDistance===!0&&o.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ke&&w.extensions.multiDraw===!0||Q)&&o.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:o.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return qt.vertexUv1s=v.has(1),qt.vertexUv2s=v.has(2),qt.vertexUv3s=v.has(3),v.clear(),qt}function M(w){const N=[];if(w.shaderID?N.push(w.shaderID):(N.push(w.customVertexShaderID),N.push(w.customFragmentShaderID)),w.defines!==void 0)for(const B in w.defines)N.push(B),N.push(w.defines[B]);return w.isRawShaderMaterial===!1&&(O(N,w),I(N,w),N.push(r.outputColorSpace)),N.push(w.customProgramCacheKey),N.join()}function O(w,N){w.push(N.precision),w.push(N.outputColorSpace),w.push(N.envMapMode),w.push(N.envMapCubeUVHeight),w.push(N.mapUv),w.push(N.alphaMapUv),w.push(N.lightMapUv),w.push(N.aoMapUv),w.push(N.bumpMapUv),w.push(N.normalMapUv),w.push(N.displacementMapUv),w.push(N.emissiveMapUv),w.push(N.metalnessMapUv),w.push(N.roughnessMapUv),w.push(N.anisotropyMapUv),w.push(N.clearcoatMapUv),w.push(N.clearcoatNormalMapUv),w.push(N.clearcoatRoughnessMapUv),w.push(N.iridescenceMapUv),w.push(N.iridescenceThicknessMapUv),w.push(N.sheenColorMapUv),w.push(N.sheenRoughnessMapUv),w.push(N.specularMapUv),w.push(N.specularColorMapUv),w.push(N.specularIntensityMapUv),w.push(N.transmissionMapUv),w.push(N.thicknessMapUv),w.push(N.combine),w.push(N.fogExp2),w.push(N.sizeAttenuation),w.push(N.morphTargetsCount),w.push(N.morphAttributeCount),w.push(N.numDirLights),w.push(N.numPointLights),w.push(N.numSpotLights),w.push(N.numSpotLightMaps),w.push(N.numHemiLights),w.push(N.numRectAreaLights),w.push(N.numDirLightShadows),w.push(N.numPointLightShadows),w.push(N.numSpotLightShadows),w.push(N.numSpotLightShadowsWithMaps),w.push(N.numLightProbes),w.push(N.shadowMapType),w.push(N.toneMapping),w.push(N.numClippingPlanes),w.push(N.numClipIntersection),w.push(N.depthPacking)}function I(w,N){h.disableAll(),N.supportsVertexTextures&&h.enable(0),N.instancing&&h.enable(1),N.instancingColor&&h.enable(2),N.instancingMorph&&h.enable(3),N.matcap&&h.enable(4),N.envMap&&h.enable(5),N.normalMapObjectSpace&&h.enable(6),N.normalMapTangentSpace&&h.enable(7),N.clearcoat&&h.enable(8),N.iridescence&&h.enable(9),N.alphaTest&&h.enable(10),N.vertexColors&&h.enable(11),N.vertexAlphas&&h.enable(12),N.vertexUv1s&&h.enable(13),N.vertexUv2s&&h.enable(14),N.vertexUv3s&&h.enable(15),N.vertexTangents&&h.enable(16),N.anisotropy&&h.enable(17),N.alphaHash&&h.enable(18),N.batching&&h.enable(19),N.dispersion&&h.enable(20),N.batchingColor&&h.enable(21),N.gradientMap&&h.enable(22),w.push(h.mask),h.disableAll(),N.fog&&h.enable(0),N.useFog&&h.enable(1),N.flatShading&&h.enable(2),N.logarithmicDepthBuffer&&h.enable(3),N.reversedDepthBuffer&&h.enable(4),N.skinning&&h.enable(5),N.morphTargets&&h.enable(6),N.morphNormals&&h.enable(7),N.morphColors&&h.enable(8),N.premultipliedAlpha&&h.enable(9),N.shadowMapEnabled&&h.enable(10),N.doubleSided&&h.enable(11),N.flipSided&&h.enable(12),N.useDepthPacking&&h.enable(13),N.dithering&&h.enable(14),N.transmission&&h.enable(15),N.sheen&&h.enable(16),N.opaque&&h.enable(17),N.pointsUvs&&h.enable(18),N.decodeVideoTexture&&h.enable(19),N.decodeVideoTextureEmissive&&h.enable(20),N.alphaToCoverage&&h.enable(21),w.push(h.mask)}function D(w){const N=T[w.type];let B;if(N){const k=ra[N];B=Hl.clone(k.uniforms)}else B=w.uniforms;return B}function V(w,N){let B;for(let k=0,le=x.length;k<le;k++){const pe=x[k];if(pe.cacheKey===N){B=pe,++B.usedTimes;break}}return B===void 0&&(B=new WC(r,N,w,u),x.push(B)),B}function H(w){if(--w.usedTimes===0){const N=x.indexOf(w);x[N]=x[x.length-1],x.pop(),w.destroy()}}function z(w){m.remove(w)}function X(){m.dispose()}return{getParameters:E,getProgramCacheKey:M,getUniforms:D,acquireProgram:V,releaseProgram:H,releaseShaderCache:z,programs:x,dispose:X}}function $C(){let r=new WeakMap;function t(d){return r.has(d)}function i(d){let h=r.get(d);return h===void 0&&(h={},r.set(d,h)),h}function o(d){r.delete(d)}function l(d,h,m){r.get(d)[h]=m}function u(){r=new WeakMap}return{has:t,get:i,remove:o,update:l,dispose:u}}function eR(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function oy(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function ly(){const r=[];let t=0;const i=[],o=[],l=[];function u(){t=0,i.length=0,o.length=0,l.length=0}function d(g,S,y,T,C,E){let M=r[t];return M===void 0?(M={id:g.id,object:g,geometry:S,material:y,groupOrder:T,renderOrder:g.renderOrder,z:C,group:E},r[t]=M):(M.id=g.id,M.object=g,M.geometry=S,M.material=y,M.groupOrder=T,M.renderOrder=g.renderOrder,M.z=C,M.group=E),t++,M}function h(g,S,y,T,C,E){const M=d(g,S,y,T,C,E);y.transmission>0?o.push(M):y.transparent===!0?l.push(M):i.push(M)}function m(g,S,y,T,C,E){const M=d(g,S,y,T,C,E);y.transmission>0?o.unshift(M):y.transparent===!0?l.unshift(M):i.unshift(M)}function v(g,S){i.length>1&&i.sort(g||eR),o.length>1&&o.sort(S||oy),l.length>1&&l.sort(S||oy)}function x(){for(let g=t,S=r.length;g<S;g++){const y=r[g];if(y.id===null)break;y.id=null,y.object=null,y.geometry=null,y.material=null,y.group=null}}return{opaque:i,transmissive:o,transparent:l,init:u,push:h,unshift:m,finish:x,sort:v}}function tR(){let r=new WeakMap;function t(o,l){const u=r.get(o);let d;return u===void 0?(d=new ly,r.set(o,[d])):l>=u.length?(d=new ly,u.push(d)):d=u[l],d}function i(){r=new WeakMap}return{get:t,dispose:i}}function nR(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let i;switch(t.type){case"DirectionalLight":i={direction:new ne,color:new Rt};break;case"SpotLight":i={position:new ne,direction:new ne,color:new Rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new ne,color:new Rt,distance:0,decay:0};break;case"HemisphereLight":i={direction:new ne,skyColor:new Rt,groundColor:new Rt};break;case"RectAreaLight":i={color:new Rt,position:new ne,halfWidth:new ne,halfHeight:new ne};break}return r[t.id]=i,i}}}function iR(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let i;switch(t.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=i,i}}}let aR=0;function sR(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function rR(r){const t=new nR,i=iR(),o={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let v=0;v<9;v++)o.probe.push(new ne);const l=new ne,u=new an,d=new an;function h(v){let x=0,g=0,S=0;for(let w=0;w<9;w++)o.probe[w].set(0,0,0);let y=0,T=0,C=0,E=0,M=0,O=0,I=0,D=0,V=0,H=0,z=0;v.sort(sR);for(let w=0,N=v.length;w<N;w++){const B=v[w],k=B.color,le=B.intensity,pe=B.distance,fe=B.shadow&&B.shadow.map?B.shadow.map.texture:null;if(B.isAmbientLight)x+=k.r*le,g+=k.g*le,S+=k.b*le;else if(B.isLightProbe){for(let q=0;q<9;q++)o.probe[q].addScaledVector(B.sh.coefficients[q],le);z++}else if(B.isDirectionalLight){const q=t.get(B);if(q.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){const se=B.shadow,W=i.get(B);W.shadowIntensity=se.intensity,W.shadowBias=se.bias,W.shadowNormalBias=se.normalBias,W.shadowRadius=se.radius,W.shadowMapSize=se.mapSize,o.directionalShadow[y]=W,o.directionalShadowMap[y]=fe,o.directionalShadowMatrix[y]=B.shadow.matrix,O++}o.directional[y]=q,y++}else if(B.isSpotLight){const q=t.get(B);q.position.setFromMatrixPosition(B.matrixWorld),q.color.copy(k).multiplyScalar(le),q.distance=pe,q.coneCos=Math.cos(B.angle),q.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),q.decay=B.decay,o.spot[C]=q;const se=B.shadow;if(B.map&&(o.spotLightMap[V]=B.map,V++,se.updateMatrices(B),B.castShadow&&H++),o.spotLightMatrix[C]=se.matrix,B.castShadow){const W=i.get(B);W.shadowIntensity=se.intensity,W.shadowBias=se.bias,W.shadowNormalBias=se.normalBias,W.shadowRadius=se.radius,W.shadowMapSize=se.mapSize,o.spotShadow[C]=W,o.spotShadowMap[C]=fe,D++}C++}else if(B.isRectAreaLight){const q=t.get(B);q.color.copy(k).multiplyScalar(le),q.halfWidth.set(B.width*.5,0,0),q.halfHeight.set(0,B.height*.5,0),o.rectArea[E]=q,E++}else if(B.isPointLight){const q=t.get(B);if(q.color.copy(B.color).multiplyScalar(B.intensity),q.distance=B.distance,q.decay=B.decay,B.castShadow){const se=B.shadow,W=i.get(B);W.shadowIntensity=se.intensity,W.shadowBias=se.bias,W.shadowNormalBias=se.normalBias,W.shadowRadius=se.radius,W.shadowMapSize=se.mapSize,W.shadowCameraNear=se.camera.near,W.shadowCameraFar=se.camera.far,o.pointShadow[T]=W,o.pointShadowMap[T]=fe,o.pointShadowMatrix[T]=B.shadow.matrix,I++}o.point[T]=q,T++}else if(B.isHemisphereLight){const q=t.get(B);q.skyColor.copy(B.color).multiplyScalar(le),q.groundColor.copy(B.groundColor).multiplyScalar(le),o.hemi[M]=q,M++}}E>0&&(r.has("OES_texture_float_linear")===!0?(o.rectAreaLTC1=He.LTC_FLOAT_1,o.rectAreaLTC2=He.LTC_FLOAT_2):(o.rectAreaLTC1=He.LTC_HALF_1,o.rectAreaLTC2=He.LTC_HALF_2)),o.ambient[0]=x,o.ambient[1]=g,o.ambient[2]=S;const X=o.hash;(X.directionalLength!==y||X.pointLength!==T||X.spotLength!==C||X.rectAreaLength!==E||X.hemiLength!==M||X.numDirectionalShadows!==O||X.numPointShadows!==I||X.numSpotShadows!==D||X.numSpotMaps!==V||X.numLightProbes!==z)&&(o.directional.length=y,o.spot.length=C,o.rectArea.length=E,o.point.length=T,o.hemi.length=M,o.directionalShadow.length=O,o.directionalShadowMap.length=O,o.pointShadow.length=I,o.pointShadowMap.length=I,o.spotShadow.length=D,o.spotShadowMap.length=D,o.directionalShadowMatrix.length=O,o.pointShadowMatrix.length=I,o.spotLightMatrix.length=D+V-H,o.spotLightMap.length=V,o.numSpotLightShadowsWithMaps=H,o.numLightProbes=z,X.directionalLength=y,X.pointLength=T,X.spotLength=C,X.rectAreaLength=E,X.hemiLength=M,X.numDirectionalShadows=O,X.numPointShadows=I,X.numSpotShadows=D,X.numSpotMaps=V,X.numLightProbes=z,o.version=aR++)}function m(v,x){let g=0,S=0,y=0,T=0,C=0;const E=x.matrixWorldInverse;for(let M=0,O=v.length;M<O;M++){const I=v[M];if(I.isDirectionalLight){const D=o.directional[g];D.direction.setFromMatrixPosition(I.matrixWorld),l.setFromMatrixPosition(I.target.matrixWorld),D.direction.sub(l),D.direction.transformDirection(E),g++}else if(I.isSpotLight){const D=o.spot[y];D.position.setFromMatrixPosition(I.matrixWorld),D.position.applyMatrix4(E),D.direction.setFromMatrixPosition(I.matrixWorld),l.setFromMatrixPosition(I.target.matrixWorld),D.direction.sub(l),D.direction.transformDirection(E),y++}else if(I.isRectAreaLight){const D=o.rectArea[T];D.position.setFromMatrixPosition(I.matrixWorld),D.position.applyMatrix4(E),d.identity(),u.copy(I.matrixWorld),u.premultiply(E),d.extractRotation(u),D.halfWidth.set(I.width*.5,0,0),D.halfHeight.set(0,I.height*.5,0),D.halfWidth.applyMatrix4(d),D.halfHeight.applyMatrix4(d),T++}else if(I.isPointLight){const D=o.point[S];D.position.setFromMatrixPosition(I.matrixWorld),D.position.applyMatrix4(E),S++}else if(I.isHemisphereLight){const D=o.hemi[C];D.direction.setFromMatrixPosition(I.matrixWorld),D.direction.transformDirection(E),C++}}}return{setup:h,setupView:m,state:o}}function cy(r){const t=new rR(r),i=[],o=[];function l(x){v.camera=x,i.length=0,o.length=0}function u(x){i.push(x)}function d(x){o.push(x)}function h(){t.setup(i)}function m(x){t.setupView(i,x)}const v={lightsArray:i,shadowsArray:o,camera:null,lights:t,transmissionRenderTarget:{}};return{init:l,state:v,setupLights:h,setupLightsView:m,pushLight:u,pushShadow:d}}function oR(r){let t=new WeakMap;function i(l,u=0){const d=t.get(l);let h;return d===void 0?(h=new cy(r),t.set(l,[h])):u>=d.length?(h=new cy(r),d.push(h)):h=d[u],h}function o(){t=new WeakMap}return{get:i,dispose:o}}const lR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,cR=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function uR(r,t,i){let o=new zm;const l=new ft,u=new ft,d=new Wt,h=new RT({depthPacking:GE}),m=new wT,v={},x=i.maxTextureSize,g={[Ms]:ti,[ti]:Ms,[oa]:oa},S=new qn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:lR,fragmentShader:cR}),y=S.clone();y.defines.HORIZONTAL_PASS=1;const T=new Yi;T.setAttribute("position",new qi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const C=new pi(T,S),E=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_y;let M=this.type;this.render=function(H,z,X){if(E.enabled===!1||E.autoUpdate===!1&&E.needsUpdate===!1||H.length===0)return;const w=r.getRenderTarget(),N=r.getActiveCubeFace(),B=r.getActiveMipmapLevel(),k=r.state;k.setBlending(Oa),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const le=M!==Ua&&this.type===Ua,pe=M===Ua&&this.type!==Ua;for(let fe=0,q=H.length;fe<q;fe++){const se=H[fe],W=se.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",se,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;l.copy(W.mapSize);const xe=W.getFrameExtents();if(l.multiply(xe),u.copy(W.mapSize),(l.x>x||l.y>x)&&(l.x>x&&(u.x=Math.floor(x/xe.x),l.x=u.x*xe.x,W.mapSize.x=u.x),l.y>x&&(u.y=Math.floor(x/xe.y),l.y=u.y*xe.y,W.mapSize.y=u.y)),W.map===null||le===!0||pe===!0){const Pe=this.type!==Ua?{minFilter:Ni,magFilter:Ni}:{};W.map!==null&&W.map.dispose(),W.map=new Xi(l.x,l.y,Pe),W.map.texture.name=se.name+".shadowMap",W.camera.updateProjectionMatrix()}r.setRenderTarget(W.map),r.clear();const Se=W.getViewportCount();for(let Pe=0;Pe<Se;Pe++){const Je=W.getViewport(Pe);d.set(u.x*Je.x,u.y*Je.y,u.x*Je.z,u.y*Je.w),k.viewport(d),W.updateMatrices(se,Pe),o=W.getFrustum(),D(z,X,W.camera,se,this.type)}W.isPointLightShadow!==!0&&this.type===Ua&&O(W,X),W.needsUpdate=!1}M=this.type,E.needsUpdate=!1,r.setRenderTarget(w,N,B)};function O(H,z){const X=t.update(C);S.defines.VSM_SAMPLES!==H.blurSamples&&(S.defines.VSM_SAMPLES=H.blurSamples,y.defines.VSM_SAMPLES=H.blurSamples,S.needsUpdate=!0,y.needsUpdate=!0),H.mapPass===null&&(H.mapPass=new Xi(l.x,l.y)),S.uniforms.shadow_pass.value=H.map.texture,S.uniforms.resolution.value=H.mapSize,S.uniforms.radius.value=H.radius,r.setRenderTarget(H.mapPass),r.clear(),r.renderBufferDirect(z,null,X,S,C,null),y.uniforms.shadow_pass.value=H.mapPass.texture,y.uniforms.resolution.value=H.mapSize,y.uniforms.radius.value=H.radius,r.setRenderTarget(H.map),r.clear(),r.renderBufferDirect(z,null,X,y,C,null)}function I(H,z,X,w){let N=null;const B=X.isPointLight===!0?H.customDistanceMaterial:H.customDepthMaterial;if(B!==void 0)N=B;else if(N=X.isPointLight===!0?m:h,r.localClippingEnabled&&z.clipShadows===!0&&Array.isArray(z.clippingPlanes)&&z.clippingPlanes.length!==0||z.displacementMap&&z.displacementScale!==0||z.alphaMap&&z.alphaTest>0||z.map&&z.alphaTest>0||z.alphaToCoverage===!0){const k=N.uuid,le=z.uuid;let pe=v[k];pe===void 0&&(pe={},v[k]=pe);let fe=pe[le];fe===void 0&&(fe=N.clone(),pe[le]=fe,z.addEventListener("dispose",V)),N=fe}if(N.visible=z.visible,N.wireframe=z.wireframe,w===Ua?N.side=z.shadowSide!==null?z.shadowSide:z.side:N.side=z.shadowSide!==null?z.shadowSide:g[z.side],N.alphaMap=z.alphaMap,N.alphaTest=z.alphaToCoverage===!0?.5:z.alphaTest,N.map=z.map,N.clipShadows=z.clipShadows,N.clippingPlanes=z.clippingPlanes,N.clipIntersection=z.clipIntersection,N.displacementMap=z.displacementMap,N.displacementScale=z.displacementScale,N.displacementBias=z.displacementBias,N.wireframeLinewidth=z.wireframeLinewidth,N.linewidth=z.linewidth,X.isPointLight===!0&&N.isMeshDistanceMaterial===!0){const k=r.properties.get(N);k.light=X}return N}function D(H,z,X,w,N){if(H.visible===!1)return;if(H.layers.test(z.layers)&&(H.isMesh||H.isLine||H.isPoints)&&(H.castShadow||H.receiveShadow&&N===Ua)&&(!H.frustumCulled||o.intersectsObject(H))){H.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,H.matrixWorld);const le=t.update(H),pe=H.material;if(Array.isArray(pe)){const fe=le.groups;for(let q=0,se=fe.length;q<se;q++){const W=fe[q],xe=pe[W.materialIndex];if(xe&&xe.visible){const Se=I(H,xe,w,N);H.onBeforeShadow(r,H,z,X,le,Se,W),r.renderBufferDirect(X,null,le,Se,H,W),H.onAfterShadow(r,H,z,X,le,Se,W)}}}else if(pe.visible){const fe=I(H,pe,w,N);H.onBeforeShadow(r,H,z,X,le,fe,null),r.renderBufferDirect(X,null,le,fe,H,null),H.onAfterShadow(r,H,z,X,le,fe,null)}}const k=H.children;for(let le=0,pe=k.length;le<pe;le++)D(k[le],z,X,w,N)}function V(H){H.target.removeEventListener("dispose",V);for(const X in v){const w=v[X],N=H.target.uuid;N in w&&(w[N].dispose(),delete w[N])}}}const fR={[Dp]:Up,[Lp]:Pp,[Op]:Ip,[Mo]:zp,[Up]:Dp,[Pp]:Lp,[Ip]:Op,[zp]:Mo};function dR(r,t){function i(){let j=!1;const Ce=new Wt;let Le=null;const qe=new Wt(0,0,0,0);return{setMask:function(Te){Le!==Te&&!j&&(r.colorMask(Te,Te,Te,Te),Le=Te)},setLocked:function(Te){j=Te},setClear:function(Te,ye,Ke,ut,qt){qt===!0&&(Te*=ut,ye*=ut,Ke*=ut),Ce.set(Te,ye,Ke,ut),qe.equals(Ce)===!1&&(r.clearColor(Te,ye,Ke,ut),qe.copy(Ce))},reset:function(){j=!1,Le=null,qe.set(-1,0,0,0)}}}function o(){let j=!1,Ce=!1,Le=null,qe=null,Te=null;return{setReversed:function(ye){if(Ce!==ye){const Ke=t.get("EXT_clip_control");ye?Ke.clipControlEXT(Ke.LOWER_LEFT_EXT,Ke.ZERO_TO_ONE_EXT):Ke.clipControlEXT(Ke.LOWER_LEFT_EXT,Ke.NEGATIVE_ONE_TO_ONE_EXT),Ce=ye;const ut=Te;Te=null,this.setClear(ut)}},getReversed:function(){return Ce},setTest:function(ye){ye?re(r.DEPTH_TEST):Ee(r.DEPTH_TEST)},setMask:function(ye){Le!==ye&&!j&&(r.depthMask(ye),Le=ye)},setFunc:function(ye){if(Ce&&(ye=fR[ye]),qe!==ye){switch(ye){case Dp:r.depthFunc(r.NEVER);break;case Up:r.depthFunc(r.ALWAYS);break;case Lp:r.depthFunc(r.LESS);break;case Mo:r.depthFunc(r.LEQUAL);break;case Op:r.depthFunc(r.EQUAL);break;case zp:r.depthFunc(r.GEQUAL);break;case Pp:r.depthFunc(r.GREATER);break;case Ip:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}qe=ye}},setLocked:function(ye){j=ye},setClear:function(ye){Te!==ye&&(Ce&&(ye=1-ye),r.clearDepth(ye),Te=ye)},reset:function(){j=!1,Le=null,qe=null,Te=null,Ce=!1}}}function l(){let j=!1,Ce=null,Le=null,qe=null,Te=null,ye=null,Ke=null,ut=null,qt=null;return{setTest:function(bt){j||(bt?re(r.STENCIL_TEST):Ee(r.STENCIL_TEST))},setMask:function(bt){Ce!==bt&&!j&&(r.stencilMask(bt),Ce=bt)},setFunc:function(bt,tn,vn){(Le!==bt||qe!==tn||Te!==vn)&&(r.stencilFunc(bt,tn,vn),Le=bt,qe=tn,Te=vn)},setOp:function(bt,tn,vn){(ye!==bt||Ke!==tn||ut!==vn)&&(r.stencilOp(bt,tn,vn),ye=bt,Ke=tn,ut=vn)},setLocked:function(bt){j=bt},setClear:function(bt){qt!==bt&&(r.clearStencil(bt),qt=bt)},reset:function(){j=!1,Ce=null,Le=null,qe=null,Te=null,ye=null,Ke=null,ut=null,qt=null}}}const u=new i,d=new o,h=new l,m=new WeakMap,v=new WeakMap;let x={},g={},S=new WeakMap,y=[],T=null,C=!1,E=null,M=null,O=null,I=null,D=null,V=null,H=null,z=new Rt(0,0,0),X=0,w=!1,N=null,B=null,k=null,le=null,pe=null;const fe=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,se=0;const W=r.getParameter(r.VERSION);W.indexOf("WebGL")!==-1?(se=parseFloat(/^WebGL (\d)/.exec(W)[1]),q=se>=1):W.indexOf("OpenGL ES")!==-1&&(se=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),q=se>=2);let xe=null,Se={};const Pe=r.getParameter(r.SCISSOR_BOX),Je=r.getParameter(r.VIEWPORT),xt=new Wt().fromArray(Pe),F=new Wt().fromArray(Je);function he(j,Ce,Le,qe){const Te=new Uint8Array(4),ye=r.createTexture();r.bindTexture(j,ye),r.texParameteri(j,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(j,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Ke=0;Ke<Le;Ke++)j===r.TEXTURE_3D||j===r.TEXTURE_2D_ARRAY?r.texImage3D(Ce,0,r.RGBA,1,1,qe,0,r.RGBA,r.UNSIGNED_BYTE,Te):r.texImage2D(Ce+Ke,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Te);return ye}const ee={};ee[r.TEXTURE_2D]=he(r.TEXTURE_2D,r.TEXTURE_2D,1),ee[r.TEXTURE_CUBE_MAP]=he(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[r.TEXTURE_2D_ARRAY]=he(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),ee[r.TEXTURE_3D]=he(r.TEXTURE_3D,r.TEXTURE_3D,1,1),u.setClear(0,0,0,1),d.setClear(1),h.setClear(0),re(r.DEPTH_TEST),d.setFunc(Mo),ke(!1),De(fx),re(r.CULL_FACE),Ne(Oa);function re(j){x[j]!==!0&&(r.enable(j),x[j]=!0)}function Ee(j){x[j]!==!1&&(r.disable(j),x[j]=!1)}function we(j,Ce){return g[j]!==Ce?(r.bindFramebuffer(j,Ce),g[j]=Ce,j===r.DRAW_FRAMEBUFFER&&(g[r.FRAMEBUFFER]=Ce),j===r.FRAMEBUFFER&&(g[r.DRAW_FRAMEBUFFER]=Ce),!0):!1}function Q(j,Ce){let Le=y,qe=!1;if(j){Le=S.get(Ce),Le===void 0&&(Le=[],S.set(Ce,Le));const Te=j.textures;if(Le.length!==Te.length||Le[0]!==r.COLOR_ATTACHMENT0){for(let ye=0,Ke=Te.length;ye<Ke;ye++)Le[ye]=r.COLOR_ATTACHMENT0+ye;Le.length=Te.length,qe=!0}}else Le[0]!==r.BACK&&(Le[0]=r.BACK,qe=!0);qe&&r.drawBuffers(Le)}function de(j){return T!==j?(r.useProgram(j),T=j,!0):!1}const je={[ir]:r.FUNC_ADD,[yE]:r.FUNC_SUBTRACT,[SE]:r.FUNC_REVERSE_SUBTRACT};je[ME]=r.MIN,je[EE]=r.MAX;const P={[TE]:r.ZERO,[bE]:r.ONE,[AE]:r.SRC_COLOR,[wp]:r.SRC_ALPHA,[UE]:r.SRC_ALPHA_SATURATE,[NE]:r.DST_COLOR,[RE]:r.DST_ALPHA,[CE]:r.ONE_MINUS_SRC_COLOR,[Np]:r.ONE_MINUS_SRC_ALPHA,[DE]:r.ONE_MINUS_DST_COLOR,[wE]:r.ONE_MINUS_DST_ALPHA,[LE]:r.CONSTANT_COLOR,[OE]:r.ONE_MINUS_CONSTANT_COLOR,[zE]:r.CONSTANT_ALPHA,[PE]:r.ONE_MINUS_CONSTANT_ALPHA};function Ne(j,Ce,Le,qe,Te,ye,Ke,ut,qt,bt){if(j===Oa){C===!0&&(Ee(r.BLEND),C=!1);return}if(C===!1&&(re(r.BLEND),C=!0),j!==xE){if(j!==E||bt!==w){if((M!==ir||D!==ir)&&(r.blendEquation(r.FUNC_ADD),M=ir,D=ir),bt)switch(j){case vo:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Rp:r.blendFunc(r.ONE,r.ONE);break;case dx:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case hx:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}else switch(j){case vo:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Rp:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case dx:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case hx:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}O=null,I=null,V=null,H=null,z.set(0,0,0),X=0,E=j,w=bt}return}Te=Te||Ce,ye=ye||Le,Ke=Ke||qe,(Ce!==M||Te!==D)&&(r.blendEquationSeparate(je[Ce],je[Te]),M=Ce,D=Te),(Le!==O||qe!==I||ye!==V||Ke!==H)&&(r.blendFuncSeparate(P[Le],P[qe],P[ye],P[Ke]),O=Le,I=qe,V=ye,H=Ke),(ut.equals(z)===!1||qt!==X)&&(r.blendColor(ut.r,ut.g,ut.b,qt),z.copy(ut),X=qt),E=j,w=!1}function ze(j,Ce){j.side===oa?Ee(r.CULL_FACE):re(r.CULL_FACE);let Le=j.side===ti;Ce&&(Le=!Le),ke(Le),j.blending===vo&&j.transparent===!1?Ne(Oa):Ne(j.blending,j.blendEquation,j.blendSrc,j.blendDst,j.blendEquationAlpha,j.blendSrcAlpha,j.blendDstAlpha,j.blendColor,j.blendAlpha,j.premultipliedAlpha),d.setFunc(j.depthFunc),d.setTest(j.depthTest),d.setMask(j.depthWrite),u.setMask(j.colorWrite);const qe=j.stencilWrite;h.setTest(qe),qe&&(h.setMask(j.stencilWriteMask),h.setFunc(j.stencilFunc,j.stencilRef,j.stencilFuncMask),h.setOp(j.stencilFail,j.stencilZFail,j.stencilZPass)),Ge(j.polygonOffset,j.polygonOffsetFactor,j.polygonOffsetUnits),j.alphaToCoverage===!0?re(r.SAMPLE_ALPHA_TO_COVERAGE):Ee(r.SAMPLE_ALPHA_TO_COVERAGE)}function ke(j){N!==j&&(j?r.frontFace(r.CW):r.frontFace(r.CCW),N=j)}function De(j){j!==gE?(re(r.CULL_FACE),j!==B&&(j===fx?r.cullFace(r.BACK):j===vE?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Ee(r.CULL_FACE),B=j}function at(j){j!==k&&(q&&r.lineWidth(j),k=j)}function Ge(j,Ce,Le){j?(re(r.POLYGON_OFFSET_FILL),(le!==Ce||pe!==Le)&&(r.polygonOffset(Ce,Le),le=Ce,pe=Le)):Ee(r.POLYGON_OFFSET_FILL)}function ot(j){j?re(r.SCISSOR_TEST):Ee(r.SCISSOR_TEST)}function gt(j){j===void 0&&(j=r.TEXTURE0+fe-1),xe!==j&&(r.activeTexture(j),xe=j)}function Ft(j,Ce,Le){Le===void 0&&(xe===null?Le=r.TEXTURE0+fe-1:Le=xe);let qe=Se[Le];qe===void 0&&(qe={type:void 0,texture:void 0},Se[Le]=qe),(qe.type!==j||qe.texture!==Ce)&&(xe!==Le&&(r.activeTexture(Le),xe=Le),r.bindTexture(j,Ce||ee[j]),qe.type=j,qe.texture=Ce)}function U(){const j=Se[xe];j!==void 0&&j.type!==void 0&&(r.bindTexture(j.type,null),j.type=void 0,j.texture=void 0)}function A(){try{r.compressedTexImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ie(){try{r.compressedTexImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ve(){try{r.texSubImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Me(){try{r.texSubImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function me(){try{r.compressedTexSubImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ye(){try{r.compressedTexSubImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Re(){try{r.texStorage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Qe(){try{r.texStorage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function et(){try{r.texImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ae(){try{r.texImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ie(j){xt.equals(j)===!1&&(r.scissor(j.x,j.y,j.z,j.w),xt.copy(j))}function rt(j){F.equals(j)===!1&&(r.viewport(j.x,j.y,j.z,j.w),F.copy(j))}function $e(j,Ce){let Le=v.get(Ce);Le===void 0&&(Le=new WeakMap,v.set(Ce,Le));let qe=Le.get(j);qe===void 0&&(qe=r.getUniformBlockIndex(Ce,j.name),Le.set(j,qe))}function Be(j,Ce){const qe=v.get(Ce).get(j);m.get(Ce)!==qe&&(r.uniformBlockBinding(Ce,qe,j.__bindingPointIndex),m.set(Ce,qe))}function ht(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),d.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),x={},xe=null,Se={},g={},S=new WeakMap,y=[],T=null,C=!1,E=null,M=null,O=null,I=null,D=null,V=null,H=null,z=new Rt(0,0,0),X=0,w=!1,N=null,B=null,k=null,le=null,pe=null,xt.set(0,0,r.canvas.width,r.canvas.height),F.set(0,0,r.canvas.width,r.canvas.height),u.reset(),d.reset(),h.reset()}return{buffers:{color:u,depth:d,stencil:h},enable:re,disable:Ee,bindFramebuffer:we,drawBuffers:Q,useProgram:de,setBlending:Ne,setMaterial:ze,setFlipSided:ke,setCullFace:De,setLineWidth:at,setPolygonOffset:Ge,setScissorTest:ot,activeTexture:gt,bindTexture:Ft,unbindTexture:U,compressedTexImage2D:A,compressedTexImage3D:ie,texImage2D:et,texImage3D:Ae,updateUBOMapping:$e,uniformBlockBinding:Be,texStorage2D:Re,texStorage3D:Qe,texSubImage2D:ve,texSubImage3D:Me,compressedTexSubImage2D:me,compressedTexSubImage3D:Ye,scissor:Ie,viewport:rt,reset:ht}}function hR(r,t,i,o,l,u,d){const h=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),v=new ft,x=new WeakMap;let g;const S=new WeakMap;let y=!1;try{y=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function T(U,A){return y?new OffscreenCanvas(U,A):Bl("canvas")}function C(U,A,ie){let ve=1;const Me=Ft(U);if((Me.width>ie||Me.height>ie)&&(ve=ie/Math.max(Me.width,Me.height)),ve<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const me=Math.floor(ve*Me.width),Ye=Math.floor(ve*Me.height);g===void 0&&(g=T(me,Ye));const Re=A?T(me,Ye):g;return Re.width=me,Re.height=Ye,Re.getContext("2d").drawImage(U,0,0,me,Ye),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Me.width+"x"+Me.height+") to ("+me+"x"+Ye+")."),Re}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Me.width+"x"+Me.height+")."),U;return U}function E(U){return U.generateMipmaps}function M(U){r.generateMipmap(U)}function O(U){return U.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?r.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function I(U,A,ie,ve,Me=!1){if(U!==null){if(r[U]!==void 0)return r[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let me=A;if(A===r.RED&&(ie===r.FLOAT&&(me=r.R32F),ie===r.HALF_FLOAT&&(me=r.R16F),ie===r.UNSIGNED_BYTE&&(me=r.R8)),A===r.RED_INTEGER&&(ie===r.UNSIGNED_BYTE&&(me=r.R8UI),ie===r.UNSIGNED_SHORT&&(me=r.R16UI),ie===r.UNSIGNED_INT&&(me=r.R32UI),ie===r.BYTE&&(me=r.R8I),ie===r.SHORT&&(me=r.R16I),ie===r.INT&&(me=r.R32I)),A===r.RG&&(ie===r.FLOAT&&(me=r.RG32F),ie===r.HALF_FLOAT&&(me=r.RG16F),ie===r.UNSIGNED_BYTE&&(me=r.RG8)),A===r.RG_INTEGER&&(ie===r.UNSIGNED_BYTE&&(me=r.RG8UI),ie===r.UNSIGNED_SHORT&&(me=r.RG16UI),ie===r.UNSIGNED_INT&&(me=r.RG32UI),ie===r.BYTE&&(me=r.RG8I),ie===r.SHORT&&(me=r.RG16I),ie===r.INT&&(me=r.RG32I)),A===r.RGB_INTEGER&&(ie===r.UNSIGNED_BYTE&&(me=r.RGB8UI),ie===r.UNSIGNED_SHORT&&(me=r.RGB16UI),ie===r.UNSIGNED_INT&&(me=r.RGB32UI),ie===r.BYTE&&(me=r.RGB8I),ie===r.SHORT&&(me=r.RGB16I),ie===r.INT&&(me=r.RGB32I)),A===r.RGBA_INTEGER&&(ie===r.UNSIGNED_BYTE&&(me=r.RGBA8UI),ie===r.UNSIGNED_SHORT&&(me=r.RGBA16UI),ie===r.UNSIGNED_INT&&(me=r.RGBA32UI),ie===r.BYTE&&(me=r.RGBA8I),ie===r.SHORT&&(me=r.RGBA16I),ie===r.INT&&(me=r.RGBA32I)),A===r.RGB&&(ie===r.UNSIGNED_INT_5_9_9_9_REV&&(me=r.RGB9_E5),ie===r.UNSIGNED_INT_10F_11F_11F_REV&&(me=r.R11F_G11F_B10F)),A===r.RGBA){const Ye=Me?Ju:Ut.getTransfer(ve);ie===r.FLOAT&&(me=r.RGBA32F),ie===r.HALF_FLOAT&&(me=r.RGBA16F),ie===r.UNSIGNED_BYTE&&(me=Ye===Xt?r.SRGB8_ALPHA8:r.RGBA8),ie===r.UNSIGNED_SHORT_4_4_4_4&&(me=r.RGBA4),ie===r.UNSIGNED_SHORT_5_5_5_1&&(me=r.RGB5_A1)}return(me===r.R16F||me===r.R32F||me===r.RG16F||me===r.RG32F||me===r.RGBA16F||me===r.RGBA32F)&&t.get("EXT_color_buffer_float"),me}function D(U,A){let ie;return U?A===null||A===fr||A===zl?ie=r.DEPTH24_STENCIL8:A===La?ie=r.DEPTH32F_STENCIL8:A===Ol&&(ie=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===fr||A===zl?ie=r.DEPTH_COMPONENT24:A===La?ie=r.DEPTH_COMPONENT32F:A===Ol&&(ie=r.DEPTH_COMPONENT16),ie}function V(U,A){return E(U)===!0||U.isFramebufferTexture&&U.minFilter!==Ni&&U.minFilter!==ji?Math.log2(Math.max(A.width,A.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?A.mipmaps.length:1}function H(U){const A=U.target;A.removeEventListener("dispose",H),X(A),A.isVideoTexture&&x.delete(A)}function z(U){const A=U.target;A.removeEventListener("dispose",z),N(A)}function X(U){const A=o.get(U);if(A.__webglInit===void 0)return;const ie=U.source,ve=S.get(ie);if(ve){const Me=ve[A.__cacheKey];Me.usedTimes--,Me.usedTimes===0&&w(U),Object.keys(ve).length===0&&S.delete(ie)}o.remove(U)}function w(U){const A=o.get(U);r.deleteTexture(A.__webglTexture);const ie=U.source,ve=S.get(ie);delete ve[A.__cacheKey],d.memory.textures--}function N(U){const A=o.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),o.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let ve=0;ve<6;ve++){if(Array.isArray(A.__webglFramebuffer[ve]))for(let Me=0;Me<A.__webglFramebuffer[ve].length;Me++)r.deleteFramebuffer(A.__webglFramebuffer[ve][Me]);else r.deleteFramebuffer(A.__webglFramebuffer[ve]);A.__webglDepthbuffer&&r.deleteRenderbuffer(A.__webglDepthbuffer[ve])}else{if(Array.isArray(A.__webglFramebuffer))for(let ve=0;ve<A.__webglFramebuffer.length;ve++)r.deleteFramebuffer(A.__webglFramebuffer[ve]);else r.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&r.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&r.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ve=0;ve<A.__webglColorRenderbuffer.length;ve++)A.__webglColorRenderbuffer[ve]&&r.deleteRenderbuffer(A.__webglColorRenderbuffer[ve]);A.__webglDepthRenderbuffer&&r.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const ie=U.textures;for(let ve=0,Me=ie.length;ve<Me;ve++){const me=o.get(ie[ve]);me.__webglTexture&&(r.deleteTexture(me.__webglTexture),d.memory.textures--),o.remove(ie[ve])}o.remove(U)}let B=0;function k(){B=0}function le(){const U=B;return U>=l.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+l.maxTextures),B+=1,U}function pe(U){const A=[];return A.push(U.wrapS),A.push(U.wrapT),A.push(U.wrapR||0),A.push(U.magFilter),A.push(U.minFilter),A.push(U.anisotropy),A.push(U.internalFormat),A.push(U.format),A.push(U.type),A.push(U.generateMipmaps),A.push(U.premultiplyAlpha),A.push(U.flipY),A.push(U.unpackAlignment),A.push(U.colorSpace),A.join()}function fe(U,A){const ie=o.get(U);if(U.isVideoTexture&&ot(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&ie.__version!==U.version){const ve=U.image;if(ve===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ve.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ee(ie,U,A);return}}else U.isExternalTexture&&(ie.__webglTexture=U.sourceTexture?U.sourceTexture:null);i.bindTexture(r.TEXTURE_2D,ie.__webglTexture,r.TEXTURE0+A)}function q(U,A){const ie=o.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&ie.__version!==U.version){ee(ie,U,A);return}i.bindTexture(r.TEXTURE_2D_ARRAY,ie.__webglTexture,r.TEXTURE0+A)}function se(U,A){const ie=o.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&ie.__version!==U.version){ee(ie,U,A);return}i.bindTexture(r.TEXTURE_3D,ie.__webglTexture,r.TEXTURE0+A)}function W(U,A){const ie=o.get(U);if(U.version>0&&ie.__version!==U.version){re(ie,U,A);return}i.bindTexture(r.TEXTURE_CUBE_MAP,ie.__webglTexture,r.TEXTURE0+A)}const xe={[Hp]:r.REPEAT,[rr]:r.CLAMP_TO_EDGE,[Gp]:r.MIRRORED_REPEAT},Se={[Ni]:r.NEAREST,[FE]:r.NEAREST_MIPMAP_NEAREST,[pu]:r.NEAREST_MIPMAP_LINEAR,[ji]:r.LINEAR,[kh]:r.LINEAR_MIPMAP_NEAREST,[or]:r.LINEAR_MIPMAP_LINEAR},Pe={[jE]:r.NEVER,[ZE]:r.ALWAYS,[kE]:r.LESS,[Py]:r.LEQUAL,[XE]:r.EQUAL,[WE]:r.GEQUAL,[qE]:r.GREATER,[YE]:r.NOTEQUAL};function Je(U,A){if(A.type===La&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===ji||A.magFilter===kh||A.magFilter===pu||A.magFilter===or||A.minFilter===ji||A.minFilter===kh||A.minFilter===pu||A.minFilter===or)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(U,r.TEXTURE_WRAP_S,xe[A.wrapS]),r.texParameteri(U,r.TEXTURE_WRAP_T,xe[A.wrapT]),(U===r.TEXTURE_3D||U===r.TEXTURE_2D_ARRAY)&&r.texParameteri(U,r.TEXTURE_WRAP_R,xe[A.wrapR]),r.texParameteri(U,r.TEXTURE_MAG_FILTER,Se[A.magFilter]),r.texParameteri(U,r.TEXTURE_MIN_FILTER,Se[A.minFilter]),A.compareFunction&&(r.texParameteri(U,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(U,r.TEXTURE_COMPARE_FUNC,Pe[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Ni||A.minFilter!==pu&&A.minFilter!==or||A.type===La&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||o.get(A).__currentAnisotropy){const ie=t.get("EXT_texture_filter_anisotropic");r.texParameterf(U,ie.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,l.getMaxAnisotropy())),o.get(A).__currentAnisotropy=A.anisotropy}}}function xt(U,A){let ie=!1;U.__webglInit===void 0&&(U.__webglInit=!0,A.addEventListener("dispose",H));const ve=A.source;let Me=S.get(ve);Me===void 0&&(Me={},S.set(ve,Me));const me=pe(A);if(me!==U.__cacheKey){Me[me]===void 0&&(Me[me]={texture:r.createTexture(),usedTimes:0},d.memory.textures++,ie=!0),Me[me].usedTimes++;const Ye=Me[U.__cacheKey];Ye!==void 0&&(Me[U.__cacheKey].usedTimes--,Ye.usedTimes===0&&w(A)),U.__cacheKey=me,U.__webglTexture=Me[me].texture}return ie}function F(U,A,ie){return Math.floor(Math.floor(U/ie)/A)}function he(U,A,ie,ve){const me=U.updateRanges;if(me.length===0)i.texSubImage2D(r.TEXTURE_2D,0,0,0,A.width,A.height,ie,ve,A.data);else{me.sort((Ae,Ie)=>Ae.start-Ie.start);let Ye=0;for(let Ae=1;Ae<me.length;Ae++){const Ie=me[Ye],rt=me[Ae],$e=Ie.start+Ie.count,Be=F(rt.start,A.width,4),ht=F(Ie.start,A.width,4);rt.start<=$e+1&&Be===ht&&F(rt.start+rt.count-1,A.width,4)===Be?Ie.count=Math.max(Ie.count,rt.start+rt.count-Ie.start):(++Ye,me[Ye]=rt)}me.length=Ye+1;const Re=r.getParameter(r.UNPACK_ROW_LENGTH),Qe=r.getParameter(r.UNPACK_SKIP_PIXELS),et=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,A.width);for(let Ae=0,Ie=me.length;Ae<Ie;Ae++){const rt=me[Ae],$e=Math.floor(rt.start/4),Be=Math.ceil(rt.count/4),ht=$e%A.width,j=Math.floor($e/A.width),Ce=Be,Le=1;r.pixelStorei(r.UNPACK_SKIP_PIXELS,ht),r.pixelStorei(r.UNPACK_SKIP_ROWS,j),i.texSubImage2D(r.TEXTURE_2D,0,ht,j,Ce,Le,ie,ve,A.data)}U.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,Re),r.pixelStorei(r.UNPACK_SKIP_PIXELS,Qe),r.pixelStorei(r.UNPACK_SKIP_ROWS,et)}}function ee(U,A,ie){let ve=r.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ve=r.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ve=r.TEXTURE_3D);const Me=xt(U,A),me=A.source;i.bindTexture(ve,U.__webglTexture,r.TEXTURE0+ie);const Ye=o.get(me);if(me.version!==Ye.__version||Me===!0){i.activeTexture(r.TEXTURE0+ie);const Re=Ut.getPrimaries(Ut.workingColorSpace),Qe=A.colorSpace===xs?null:Ut.getPrimaries(A.colorSpace),et=A.colorSpace===xs||Re===Qe?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,A.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,A.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,et);let Ae=C(A.image,!1,l.maxTextureSize);Ae=gt(A,Ae);const Ie=u.convert(A.format,A.colorSpace),rt=u.convert(A.type);let $e=I(A.internalFormat,Ie,rt,A.colorSpace,A.isVideoTexture);Je(ve,A);let Be;const ht=A.mipmaps,j=A.isVideoTexture!==!0,Ce=Ye.__version===void 0||Me===!0,Le=me.dataReady,qe=V(A,Ae);if(A.isDepthTexture)$e=D(A.format===Il,A.type),Ce&&(j?i.texStorage2D(r.TEXTURE_2D,1,$e,Ae.width,Ae.height):i.texImage2D(r.TEXTURE_2D,0,$e,Ae.width,Ae.height,0,Ie,rt,null));else if(A.isDataTexture)if(ht.length>0){j&&Ce&&i.texStorage2D(r.TEXTURE_2D,qe,$e,ht[0].width,ht[0].height);for(let Te=0,ye=ht.length;Te<ye;Te++)Be=ht[Te],j?Le&&i.texSubImage2D(r.TEXTURE_2D,Te,0,0,Be.width,Be.height,Ie,rt,Be.data):i.texImage2D(r.TEXTURE_2D,Te,$e,Be.width,Be.height,0,Ie,rt,Be.data);A.generateMipmaps=!1}else j?(Ce&&i.texStorage2D(r.TEXTURE_2D,qe,$e,Ae.width,Ae.height),Le&&he(A,Ae,Ie,rt)):i.texImage2D(r.TEXTURE_2D,0,$e,Ae.width,Ae.height,0,Ie,rt,Ae.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){j&&Ce&&i.texStorage3D(r.TEXTURE_2D_ARRAY,qe,$e,ht[0].width,ht[0].height,Ae.depth);for(let Te=0,ye=ht.length;Te<ye;Te++)if(Be=ht[Te],A.format!==ki)if(Ie!==null)if(j){if(Le)if(A.layerUpdates.size>0){const Ke=Fx(Be.width,Be.height,A.format,A.type);for(const ut of A.layerUpdates){const qt=Be.data.subarray(ut*Ke/Be.data.BYTES_PER_ELEMENT,(ut+1)*Ke/Be.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Te,0,0,ut,Be.width,Be.height,1,Ie,qt)}A.clearLayerUpdates()}else i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Te,0,0,0,Be.width,Be.height,Ae.depth,Ie,Be.data)}else i.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Te,$e,Be.width,Be.height,Ae.depth,0,Be.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else j?Le&&i.texSubImage3D(r.TEXTURE_2D_ARRAY,Te,0,0,0,Be.width,Be.height,Ae.depth,Ie,rt,Be.data):i.texImage3D(r.TEXTURE_2D_ARRAY,Te,$e,Be.width,Be.height,Ae.depth,0,Ie,rt,Be.data)}else{j&&Ce&&i.texStorage2D(r.TEXTURE_2D,qe,$e,ht[0].width,ht[0].height);for(let Te=0,ye=ht.length;Te<ye;Te++)Be=ht[Te],A.format!==ki?Ie!==null?j?Le&&i.compressedTexSubImage2D(r.TEXTURE_2D,Te,0,0,Be.width,Be.height,Ie,Be.data):i.compressedTexImage2D(r.TEXTURE_2D,Te,$e,Be.width,Be.height,0,Be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):j?Le&&i.texSubImage2D(r.TEXTURE_2D,Te,0,0,Be.width,Be.height,Ie,rt,Be.data):i.texImage2D(r.TEXTURE_2D,Te,$e,Be.width,Be.height,0,Ie,rt,Be.data)}else if(A.isDataArrayTexture)if(j){if(Ce&&i.texStorage3D(r.TEXTURE_2D_ARRAY,qe,$e,Ae.width,Ae.height,Ae.depth),Le)if(A.layerUpdates.size>0){const Te=Fx(Ae.width,Ae.height,A.format,A.type);for(const ye of A.layerUpdates){const Ke=Ae.data.subarray(ye*Te/Ae.data.BYTES_PER_ELEMENT,(ye+1)*Te/Ae.data.BYTES_PER_ELEMENT);i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,ye,Ae.width,Ae.height,1,Ie,rt,Ke)}A.clearLayerUpdates()}else i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Ae.width,Ae.height,Ae.depth,Ie,rt,Ae.data)}else i.texImage3D(r.TEXTURE_2D_ARRAY,0,$e,Ae.width,Ae.height,Ae.depth,0,Ie,rt,Ae.data);else if(A.isData3DTexture)j?(Ce&&i.texStorage3D(r.TEXTURE_3D,qe,$e,Ae.width,Ae.height,Ae.depth),Le&&i.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Ae.width,Ae.height,Ae.depth,Ie,rt,Ae.data)):i.texImage3D(r.TEXTURE_3D,0,$e,Ae.width,Ae.height,Ae.depth,0,Ie,rt,Ae.data);else if(A.isFramebufferTexture){if(Ce)if(j)i.texStorage2D(r.TEXTURE_2D,qe,$e,Ae.width,Ae.height);else{let Te=Ae.width,ye=Ae.height;for(let Ke=0;Ke<qe;Ke++)i.texImage2D(r.TEXTURE_2D,Ke,$e,Te,ye,0,Ie,rt,null),Te>>=1,ye>>=1}}else if(ht.length>0){if(j&&Ce){const Te=Ft(ht[0]);i.texStorage2D(r.TEXTURE_2D,qe,$e,Te.width,Te.height)}for(let Te=0,ye=ht.length;Te<ye;Te++)Be=ht[Te],j?Le&&i.texSubImage2D(r.TEXTURE_2D,Te,0,0,Ie,rt,Be):i.texImage2D(r.TEXTURE_2D,Te,$e,Ie,rt,Be);A.generateMipmaps=!1}else if(j){if(Ce){const Te=Ft(Ae);i.texStorage2D(r.TEXTURE_2D,qe,$e,Te.width,Te.height)}Le&&i.texSubImage2D(r.TEXTURE_2D,0,0,0,Ie,rt,Ae)}else i.texImage2D(r.TEXTURE_2D,0,$e,Ie,rt,Ae);E(A)&&M(ve),Ye.__version=me.version,A.onUpdate&&A.onUpdate(A)}U.__version=A.version}function re(U,A,ie){if(A.image.length!==6)return;const ve=xt(U,A),Me=A.source;i.bindTexture(r.TEXTURE_CUBE_MAP,U.__webglTexture,r.TEXTURE0+ie);const me=o.get(Me);if(Me.version!==me.__version||ve===!0){i.activeTexture(r.TEXTURE0+ie);const Ye=Ut.getPrimaries(Ut.workingColorSpace),Re=A.colorSpace===xs?null:Ut.getPrimaries(A.colorSpace),Qe=A.colorSpace===xs||Ye===Re?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,A.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,A.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Qe);const et=A.isCompressedTexture||A.image[0].isCompressedTexture,Ae=A.image[0]&&A.image[0].isDataTexture,Ie=[];for(let ye=0;ye<6;ye++)!et&&!Ae?Ie[ye]=C(A.image[ye],!0,l.maxCubemapSize):Ie[ye]=Ae?A.image[ye].image:A.image[ye],Ie[ye]=gt(A,Ie[ye]);const rt=Ie[0],$e=u.convert(A.format,A.colorSpace),Be=u.convert(A.type),ht=I(A.internalFormat,$e,Be,A.colorSpace),j=A.isVideoTexture!==!0,Ce=me.__version===void 0||ve===!0,Le=Me.dataReady;let qe=V(A,rt);Je(r.TEXTURE_CUBE_MAP,A);let Te;if(et){j&&Ce&&i.texStorage2D(r.TEXTURE_CUBE_MAP,qe,ht,rt.width,rt.height);for(let ye=0;ye<6;ye++){Te=Ie[ye].mipmaps;for(let Ke=0;Ke<Te.length;Ke++){const ut=Te[Ke];A.format!==ki?$e!==null?j?Le&&i.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ke,0,0,ut.width,ut.height,$e,ut.data):i.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ke,ht,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):j?Le&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ke,0,0,ut.width,ut.height,$e,Be,ut.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ke,ht,ut.width,ut.height,0,$e,Be,ut.data)}}}else{if(Te=A.mipmaps,j&&Ce){Te.length>0&&qe++;const ye=Ft(Ie[0]);i.texStorage2D(r.TEXTURE_CUBE_MAP,qe,ht,ye.width,ye.height)}for(let ye=0;ye<6;ye++)if(Ae){j?Le&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,Ie[ye].width,Ie[ye].height,$e,Be,Ie[ye].data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,ht,Ie[ye].width,Ie[ye].height,0,$e,Be,Ie[ye].data);for(let Ke=0;Ke<Te.length;Ke++){const qt=Te[Ke].image[ye].image;j?Le&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ke+1,0,0,qt.width,qt.height,$e,Be,qt.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ke+1,ht,qt.width,qt.height,0,$e,Be,qt.data)}}else{j?Le&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,$e,Be,Ie[ye]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,ht,$e,Be,Ie[ye]);for(let Ke=0;Ke<Te.length;Ke++){const ut=Te[Ke];j?Le&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ke+1,0,0,$e,Be,ut.image[ye]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ke+1,ht,$e,Be,ut.image[ye])}}}E(A)&&M(r.TEXTURE_CUBE_MAP),me.__version=Me.version,A.onUpdate&&A.onUpdate(A)}U.__version=A.version}function Ee(U,A,ie,ve,Me,me){const Ye=u.convert(ie.format,ie.colorSpace),Re=u.convert(ie.type),Qe=I(ie.internalFormat,Ye,Re,ie.colorSpace),et=o.get(A),Ae=o.get(ie);if(Ae.__renderTarget=A,!et.__hasExternalTextures){const Ie=Math.max(1,A.width>>me),rt=Math.max(1,A.height>>me);Me===r.TEXTURE_3D||Me===r.TEXTURE_2D_ARRAY?i.texImage3D(Me,me,Qe,Ie,rt,A.depth,0,Ye,Re,null):i.texImage2D(Me,me,Qe,Ie,rt,0,Ye,Re,null)}i.bindFramebuffer(r.FRAMEBUFFER,U),Ge(A)?h.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ve,Me,Ae.__webglTexture,0,at(A)):(Me===r.TEXTURE_2D||Me>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Me<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,ve,Me,Ae.__webglTexture,me),i.bindFramebuffer(r.FRAMEBUFFER,null)}function we(U,A,ie){if(r.bindRenderbuffer(r.RENDERBUFFER,U),A.depthBuffer){const ve=A.depthTexture,Me=ve&&ve.isDepthTexture?ve.type:null,me=D(A.stencilBuffer,Me),Ye=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Re=at(A);Ge(A)?h.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Re,me,A.width,A.height):ie?r.renderbufferStorageMultisample(r.RENDERBUFFER,Re,me,A.width,A.height):r.renderbufferStorage(r.RENDERBUFFER,me,A.width,A.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Ye,r.RENDERBUFFER,U)}else{const ve=A.textures;for(let Me=0;Me<ve.length;Me++){const me=ve[Me],Ye=u.convert(me.format,me.colorSpace),Re=u.convert(me.type),Qe=I(me.internalFormat,Ye,Re,me.colorSpace),et=at(A);ie&&Ge(A)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,et,Qe,A.width,A.height):Ge(A)?h.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,et,Qe,A.width,A.height):r.renderbufferStorage(r.RENDERBUFFER,Qe,A.width,A.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Q(U,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(i.bindFramebuffer(r.FRAMEBUFFER,U),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ve=o.get(A.depthTexture);ve.__renderTarget=A,(!ve.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),fe(A.depthTexture,0);const Me=ve.__webglTexture,me=at(A);if(A.depthTexture.format===Pl)Ge(A)?h.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Me,0,me):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Me,0);else if(A.depthTexture.format===Il)Ge(A)?h.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Me,0,me):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Me,0);else throw new Error("Unknown depthTexture format")}function de(U){const A=o.get(U),ie=U.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==U.depthTexture){const ve=U.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ve){const Me=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ve.removeEventListener("dispose",Me)};ve.addEventListener("dispose",Me),A.__depthDisposeCallback=Me}A.__boundDepthTexture=ve}if(U.depthTexture&&!A.__autoAllocateDepthBuffer){if(ie)throw new Error("target.depthTexture not supported in Cube render targets");const ve=U.texture.mipmaps;ve&&ve.length>0?Q(A.__webglFramebuffer[0],U):Q(A.__webglFramebuffer,U)}else if(ie){A.__webglDepthbuffer=[];for(let ve=0;ve<6;ve++)if(i.bindFramebuffer(r.FRAMEBUFFER,A.__webglFramebuffer[ve]),A.__webglDepthbuffer[ve]===void 0)A.__webglDepthbuffer[ve]=r.createRenderbuffer(),we(A.__webglDepthbuffer[ve],U,!1);else{const Me=U.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,me=A.__webglDepthbuffer[ve];r.bindRenderbuffer(r.RENDERBUFFER,me),r.framebufferRenderbuffer(r.FRAMEBUFFER,Me,r.RENDERBUFFER,me)}}else{const ve=U.texture.mipmaps;if(ve&&ve.length>0?i.bindFramebuffer(r.FRAMEBUFFER,A.__webglFramebuffer[0]):i.bindFramebuffer(r.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=r.createRenderbuffer(),we(A.__webglDepthbuffer,U,!1);else{const Me=U.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,me=A.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,me),r.framebufferRenderbuffer(r.FRAMEBUFFER,Me,r.RENDERBUFFER,me)}}i.bindFramebuffer(r.FRAMEBUFFER,null)}function je(U,A,ie){const ve=o.get(U);A!==void 0&&Ee(ve.__webglFramebuffer,U,U.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),ie!==void 0&&de(U)}function P(U){const A=U.texture,ie=o.get(U),ve=o.get(A);U.addEventListener("dispose",z);const Me=U.textures,me=U.isWebGLCubeRenderTarget===!0,Ye=Me.length>1;if(Ye||(ve.__webglTexture===void 0&&(ve.__webglTexture=r.createTexture()),ve.__version=A.version,d.memory.textures++),me){ie.__webglFramebuffer=[];for(let Re=0;Re<6;Re++)if(A.mipmaps&&A.mipmaps.length>0){ie.__webglFramebuffer[Re]=[];for(let Qe=0;Qe<A.mipmaps.length;Qe++)ie.__webglFramebuffer[Re][Qe]=r.createFramebuffer()}else ie.__webglFramebuffer[Re]=r.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){ie.__webglFramebuffer=[];for(let Re=0;Re<A.mipmaps.length;Re++)ie.__webglFramebuffer[Re]=r.createFramebuffer()}else ie.__webglFramebuffer=r.createFramebuffer();if(Ye)for(let Re=0,Qe=Me.length;Re<Qe;Re++){const et=o.get(Me[Re]);et.__webglTexture===void 0&&(et.__webglTexture=r.createTexture(),d.memory.textures++)}if(U.samples>0&&Ge(U)===!1){ie.__webglMultisampledFramebuffer=r.createFramebuffer(),ie.__webglColorRenderbuffer=[],i.bindFramebuffer(r.FRAMEBUFFER,ie.__webglMultisampledFramebuffer);for(let Re=0;Re<Me.length;Re++){const Qe=Me[Re];ie.__webglColorRenderbuffer[Re]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,ie.__webglColorRenderbuffer[Re]);const et=u.convert(Qe.format,Qe.colorSpace),Ae=u.convert(Qe.type),Ie=I(Qe.internalFormat,et,Ae,Qe.colorSpace,U.isXRRenderTarget===!0),rt=at(U);r.renderbufferStorageMultisample(r.RENDERBUFFER,rt,Ie,U.width,U.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Re,r.RENDERBUFFER,ie.__webglColorRenderbuffer[Re])}r.bindRenderbuffer(r.RENDERBUFFER,null),U.depthBuffer&&(ie.__webglDepthRenderbuffer=r.createRenderbuffer(),we(ie.__webglDepthRenderbuffer,U,!0)),i.bindFramebuffer(r.FRAMEBUFFER,null)}}if(me){i.bindTexture(r.TEXTURE_CUBE_MAP,ve.__webglTexture),Je(r.TEXTURE_CUBE_MAP,A);for(let Re=0;Re<6;Re++)if(A.mipmaps&&A.mipmaps.length>0)for(let Qe=0;Qe<A.mipmaps.length;Qe++)Ee(ie.__webglFramebuffer[Re][Qe],U,A,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Qe);else Ee(ie.__webglFramebuffer[Re],U,A,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0);E(A)&&M(r.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(Ye){for(let Re=0,Qe=Me.length;Re<Qe;Re++){const et=Me[Re],Ae=o.get(et);let Ie=r.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Ie=U.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(Ie,Ae.__webglTexture),Je(Ie,et),Ee(ie.__webglFramebuffer,U,et,r.COLOR_ATTACHMENT0+Re,Ie,0),E(et)&&M(Ie)}i.unbindTexture()}else{let Re=r.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Re=U.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(Re,ve.__webglTexture),Je(Re,A),A.mipmaps&&A.mipmaps.length>0)for(let Qe=0;Qe<A.mipmaps.length;Qe++)Ee(ie.__webglFramebuffer[Qe],U,A,r.COLOR_ATTACHMENT0,Re,Qe);else Ee(ie.__webglFramebuffer,U,A,r.COLOR_ATTACHMENT0,Re,0);E(A)&&M(Re),i.unbindTexture()}U.depthBuffer&&de(U)}function Ne(U){const A=U.textures;for(let ie=0,ve=A.length;ie<ve;ie++){const Me=A[ie];if(E(Me)){const me=O(U),Ye=o.get(Me).__webglTexture;i.bindTexture(me,Ye),M(me),i.unbindTexture()}}}const ze=[],ke=[];function De(U){if(U.samples>0){if(Ge(U)===!1){const A=U.textures,ie=U.width,ve=U.height;let Me=r.COLOR_BUFFER_BIT;const me=U.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ye=o.get(U),Re=A.length>1;if(Re)for(let et=0;et<A.length;et++)i.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+et,r.RENDERBUFFER,null),i.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+et,r.TEXTURE_2D,null,0);i.bindFramebuffer(r.READ_FRAMEBUFFER,Ye.__webglMultisampledFramebuffer);const Qe=U.texture.mipmaps;Qe&&Qe.length>0?i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ye.__webglFramebuffer[0]):i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ye.__webglFramebuffer);for(let et=0;et<A.length;et++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(Me|=r.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(Me|=r.STENCIL_BUFFER_BIT)),Re){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Ye.__webglColorRenderbuffer[et]);const Ae=o.get(A[et]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Ae,0)}r.blitFramebuffer(0,0,ie,ve,0,0,ie,ve,Me,r.NEAREST),m===!0&&(ze.length=0,ke.length=0,ze.push(r.COLOR_ATTACHMENT0+et),U.depthBuffer&&U.resolveDepthBuffer===!1&&(ze.push(me),ke.push(me),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,ke)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ze))}if(i.bindFramebuffer(r.READ_FRAMEBUFFER,null),i.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Re)for(let et=0;et<A.length;et++){i.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+et,r.RENDERBUFFER,Ye.__webglColorRenderbuffer[et]);const Ae=o.get(A[et]).__webglTexture;i.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+et,r.TEXTURE_2D,Ae,0)}i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ye.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&m){const A=U.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[A])}}}function at(U){return Math.min(l.maxSamples,U.samples)}function Ge(U){const A=o.get(U);return U.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function ot(U){const A=d.render.frame;x.get(U)!==A&&(x.set(U,A),U.update())}function gt(U,A){const ie=U.colorSpace,ve=U.format,Me=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||ie!==bo&&ie!==xs&&(Ut.getTransfer(ie)===Xt?(ve!==ki||Me!==ca)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",ie)),A}function Ft(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(v.width=U.naturalWidth||U.width,v.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(v.width=U.displayWidth,v.height=U.displayHeight):(v.width=U.width,v.height=U.height),v}this.allocateTextureUnit=le,this.resetTextureUnits=k,this.setTexture2D=fe,this.setTexture2DArray=q,this.setTexture3D=se,this.setTextureCube=W,this.rebindTextures=je,this.setupRenderTarget=P,this.updateRenderTargetMipmap=Ne,this.updateMultisampleRenderTarget=De,this.setupDepthRenderbuffer=de,this.setupFrameBufferTexture=Ee,this.useMultisampledRTT=Ge}function pR(r,t){function i(o,l=xs){let u;const d=Ut.getTransfer(l);if(o===ca)return r.UNSIGNED_BYTE;if(o===wm)return r.UNSIGNED_SHORT_4_4_4_4;if(o===Nm)return r.UNSIGNED_SHORT_5_5_5_1;if(o===wy)return r.UNSIGNED_INT_5_9_9_9_REV;if(o===Ny)return r.UNSIGNED_INT_10F_11F_11F_REV;if(o===Cy)return r.BYTE;if(o===Ry)return r.SHORT;if(o===Ol)return r.UNSIGNED_SHORT;if(o===Rm)return r.INT;if(o===fr)return r.UNSIGNED_INT;if(o===La)return r.FLOAT;if(o===za)return r.HALF_FLOAT;if(o===Dy)return r.ALPHA;if(o===Uy)return r.RGB;if(o===ki)return r.RGBA;if(o===Pl)return r.DEPTH_COMPONENT;if(o===Il)return r.DEPTH_STENCIL;if(o===Ly)return r.RED;if(o===Dm)return r.RED_INTEGER;if(o===Oy)return r.RG;if(o===Um)return r.RG_INTEGER;if(o===Lm)return r.RGBA_INTEGER;if(o===Vu||o===ju||o===ku||o===Xu)if(d===Xt)if(u=t.get("WEBGL_compressed_texture_s3tc_srgb"),u!==null){if(o===Vu)return u.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===ju)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===ku)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===Xu)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(u=t.get("WEBGL_compressed_texture_s3tc"),u!==null){if(o===Vu)return u.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===ju)return u.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===ku)return u.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===Xu)return u.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===Vp||o===jp||o===kp||o===Xp)if(u=t.get("WEBGL_compressed_texture_pvrtc"),u!==null){if(o===Vp)return u.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===jp)return u.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===kp)return u.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===Xp)return u.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===qp||o===Yp||o===Wp)if(u=t.get("WEBGL_compressed_texture_etc"),u!==null){if(o===qp||o===Yp)return d===Xt?u.COMPRESSED_SRGB8_ETC2:u.COMPRESSED_RGB8_ETC2;if(o===Wp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:u.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===Zp||o===Kp||o===Qp||o===Jp||o===$p||o===em||o===tm||o===nm||o===im||o===am||o===sm||o===rm||o===om||o===lm)if(u=t.get("WEBGL_compressed_texture_astc"),u!==null){if(o===Zp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:u.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===Kp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:u.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===Qp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:u.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===Jp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:u.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===$p)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:u.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===em)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:u.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===tm)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:u.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===nm)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:u.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===im)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:u.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===am)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:u.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===sm)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:u.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===rm)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:u.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===om)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:u.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===lm)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:u.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===cm||o===um||o===fm)if(u=t.get("EXT_texture_compression_bptc"),u!==null){if(o===cm)return d===Xt?u.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:u.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===um)return u.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===fm)return u.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===dm||o===hm||o===pm||o===mm)if(u=t.get("EXT_texture_compression_rgtc"),u!==null){if(o===dm)return u.COMPRESSED_RED_RGTC1_EXT;if(o===hm)return u.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===pm)return u.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===mm)return u.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===zl?r.UNSIGNED_INT_24_8:r[o]!==void 0?r[o]:null}return{convert:i}}const mR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,gR=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class vR{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,i){if(this.texture===null){const o=new Zy(t.texture);(t.depthNear!==i.depthNear||t.depthFar!==i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=o}}getMesh(t){if(this.texture!==null&&this.mesh===null){const i=t.cameras[0].viewport,o=new qn({vertexShader:mR,fragmentShader:gR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new pi(new kl(20,20),o)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class _R extends Ro{constructor(t,i){super();const o=this;let l=null,u=1,d=null,h="local-floor",m=1,v=null,x=null,g=null,S=null,y=null,T=null;const C=typeof XRWebGLBinding<"u",E=new vR,M={},O=i.getContextAttributes();let I=null,D=null;const V=[],H=[],z=new ft;let X=null;const w=new Ri;w.viewport=new Wt;const N=new Ri;N.viewport=new Wt;const B=[w,N],k=new FT;let le=null,pe=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let re=V[ee];return re===void 0&&(re=new hp,V[ee]=re),re.getTargetRaySpace()},this.getControllerGrip=function(ee){let re=V[ee];return re===void 0&&(re=new hp,V[ee]=re),re.getGripSpace()},this.getHand=function(ee){let re=V[ee];return re===void 0&&(re=new hp,V[ee]=re),re.getHandSpace()};function fe(ee){const re=H.indexOf(ee.inputSource);if(re===-1)return;const Ee=V[re];Ee!==void 0&&(Ee.update(ee.inputSource,ee.frame,v||d),Ee.dispatchEvent({type:ee.type,data:ee.inputSource}))}function q(){l.removeEventListener("select",fe),l.removeEventListener("selectstart",fe),l.removeEventListener("selectend",fe),l.removeEventListener("squeeze",fe),l.removeEventListener("squeezestart",fe),l.removeEventListener("squeezeend",fe),l.removeEventListener("end",q),l.removeEventListener("inputsourceschange",se);for(let ee=0;ee<V.length;ee++){const re=H[ee];re!==null&&(H[ee]=null,V[ee].disconnect(re))}le=null,pe=null,E.reset();for(const ee in M)delete M[ee];t.setRenderTarget(I),y=null,S=null,g=null,l=null,D=null,he.stop(),o.isPresenting=!1,t.setPixelRatio(X),t.setSize(z.width,z.height,!1),o.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ee){u=ee,o.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){h=ee,o.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return v||d},this.setReferenceSpace=function(ee){v=ee},this.getBaseLayer=function(){return S!==null?S:y},this.getBinding=function(){return g===null&&C&&(g=new XRWebGLBinding(l,i)),g},this.getFrame=function(){return T},this.getSession=function(){return l},this.setSession=async function(ee){if(l=ee,l!==null){if(I=t.getRenderTarget(),l.addEventListener("select",fe),l.addEventListener("selectstart",fe),l.addEventListener("selectend",fe),l.addEventListener("squeeze",fe),l.addEventListener("squeezestart",fe),l.addEventListener("squeezeend",fe),l.addEventListener("end",q),l.addEventListener("inputsourceschange",se),O.xrCompatible!==!0&&await i.makeXRCompatible(),X=t.getPixelRatio(),t.getSize(z),C&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ee=null,we=null,Q=null;O.depth&&(Q=O.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,Ee=O.stencil?Il:Pl,we=O.stencil?zl:fr);const de={colorFormat:i.RGBA8,depthFormat:Q,scaleFactor:u};g=this.getBinding(),S=g.createProjectionLayer(de),l.updateRenderState({layers:[S]}),t.setPixelRatio(1),t.setSize(S.textureWidth,S.textureHeight,!1),D=new Xi(S.textureWidth,S.textureHeight,{format:ki,type:ca,depthTexture:new Wy(S.textureWidth,S.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,Ee),stencilBuffer:O.stencil,colorSpace:t.outputColorSpace,samples:O.antialias?4:0,resolveDepthBuffer:S.ignoreDepthValues===!1,resolveStencilBuffer:S.ignoreDepthValues===!1})}else{const Ee={antialias:O.antialias,alpha:!0,depth:O.depth,stencil:O.stencil,framebufferScaleFactor:u};y=new XRWebGLLayer(l,i,Ee),l.updateRenderState({baseLayer:y}),t.setPixelRatio(1),t.setSize(y.framebufferWidth,y.framebufferHeight,!1),D=new Xi(y.framebufferWidth,y.framebufferHeight,{format:ki,type:ca,colorSpace:t.outputColorSpace,stencilBuffer:O.stencil,resolveDepthBuffer:y.ignoreDepthValues===!1,resolveStencilBuffer:y.ignoreDepthValues===!1})}D.isXRRenderTarget=!0,this.setFoveation(m),v=null,d=await l.requestReferenceSpace(h),he.setContext(l),he.start(),o.isPresenting=!0,o.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return E.getDepthTexture()};function se(ee){for(let re=0;re<ee.removed.length;re++){const Ee=ee.removed[re],we=H.indexOf(Ee);we>=0&&(H[we]=null,V[we].disconnect(Ee))}for(let re=0;re<ee.added.length;re++){const Ee=ee.added[re];let we=H.indexOf(Ee);if(we===-1){for(let de=0;de<V.length;de++)if(de>=H.length){H.push(Ee),we=de;break}else if(H[de]===null){H[de]=Ee,we=de;break}if(we===-1)break}const Q=V[we];Q&&Q.connect(Ee)}}const W=new ne,xe=new ne;function Se(ee,re,Ee){W.setFromMatrixPosition(re.matrixWorld),xe.setFromMatrixPosition(Ee.matrixWorld);const we=W.distanceTo(xe),Q=re.projectionMatrix.elements,de=Ee.projectionMatrix.elements,je=Q[14]/(Q[10]-1),P=Q[14]/(Q[10]+1),Ne=(Q[9]+1)/Q[5],ze=(Q[9]-1)/Q[5],ke=(Q[8]-1)/Q[0],De=(de[8]+1)/de[0],at=je*ke,Ge=je*De,ot=we/(-ke+De),gt=ot*-ke;if(re.matrixWorld.decompose(ee.position,ee.quaternion,ee.scale),ee.translateX(gt),ee.translateZ(ot),ee.matrixWorld.compose(ee.position,ee.quaternion,ee.scale),ee.matrixWorldInverse.copy(ee.matrixWorld).invert(),Q[10]===-1)ee.projectionMatrix.copy(re.projectionMatrix),ee.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const Ft=je+ot,U=P+ot,A=at-gt,ie=Ge+(we-gt),ve=Ne*P/U*Ft,Me=ze*P/U*Ft;ee.projectionMatrix.makePerspective(A,ie,ve,Me,Ft,U),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert()}}function Pe(ee,re){re===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(re.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(l===null)return;let re=ee.near,Ee=ee.far;E.texture!==null&&(E.depthNear>0&&(re=E.depthNear),E.depthFar>0&&(Ee=E.depthFar)),k.near=N.near=w.near=re,k.far=N.far=w.far=Ee,(le!==k.near||pe!==k.far)&&(l.updateRenderState({depthNear:k.near,depthFar:k.far}),le=k.near,pe=k.far),k.layers.mask=ee.layers.mask|6,w.layers.mask=k.layers.mask&3,N.layers.mask=k.layers.mask&5;const we=ee.parent,Q=k.cameras;Pe(k,we);for(let de=0;de<Q.length;de++)Pe(Q[de],we);Q.length===2?Se(k,w,N):k.projectionMatrix.copy(w.projectionMatrix),Je(ee,k,we)};function Je(ee,re,Ee){Ee===null?ee.matrix.copy(re.matrixWorld):(ee.matrix.copy(Ee.matrixWorld),ee.matrix.invert(),ee.matrix.multiply(re.matrixWorld)),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.updateMatrixWorld(!0),ee.projectionMatrix.copy(re.projectionMatrix),ee.projectionMatrixInverse.copy(re.projectionMatrixInverse),ee.isPerspectiveCamera&&(ee.fov=gm*2*Math.atan(1/ee.projectionMatrix.elements[5]),ee.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(S===null&&y===null))return m},this.setFoveation=function(ee){m=ee,S!==null&&(S.fixedFoveation=ee),y!==null&&y.fixedFoveation!==void 0&&(y.fixedFoveation=ee)},this.hasDepthSensing=function(){return E.texture!==null},this.getDepthSensingMesh=function(){return E.getMesh(k)},this.getCameraTexture=function(ee){return M[ee]};let xt=null;function F(ee,re){if(x=re.getViewerPose(v||d),T=re,x!==null){const Ee=x.views;y!==null&&(t.setRenderTargetFramebuffer(D,y.framebuffer),t.setRenderTarget(D));let we=!1;Ee.length!==k.cameras.length&&(k.cameras.length=0,we=!0);for(let P=0;P<Ee.length;P++){const Ne=Ee[P];let ze=null;if(y!==null)ze=y.getViewport(Ne);else{const De=g.getViewSubImage(S,Ne);ze=De.viewport,P===0&&(t.setRenderTargetTextures(D,De.colorTexture,De.depthStencilTexture),t.setRenderTarget(D))}let ke=B[P];ke===void 0&&(ke=new Ri,ke.layers.enable(P),ke.viewport=new Wt,B[P]=ke),ke.matrix.fromArray(Ne.transform.matrix),ke.matrix.decompose(ke.position,ke.quaternion,ke.scale),ke.projectionMatrix.fromArray(Ne.projectionMatrix),ke.projectionMatrixInverse.copy(ke.projectionMatrix).invert(),ke.viewport.set(ze.x,ze.y,ze.width,ze.height),P===0&&(k.matrix.copy(ke.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),we===!0&&k.cameras.push(ke)}const Q=l.enabledFeatures;if(Q&&Q.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&C){g=o.getBinding();const P=g.getDepthInformation(Ee[0]);P&&P.isValid&&P.texture&&E.init(P,l.renderState)}if(Q&&Q.includes("camera-access")&&C){t.state.unbindTexture(),g=o.getBinding();for(let P=0;P<Ee.length;P++){const Ne=Ee[P].camera;if(Ne){let ze=M[Ne];ze||(ze=new Zy,M[Ne]=ze);const ke=g.getCameraImage(Ne);ze.sourceTexture=ke}}}}for(let Ee=0;Ee<V.length;Ee++){const we=H[Ee],Q=V[Ee];we!==null&&Q!==void 0&&Q.update(we,re,v||d)}xt&&xt(ee,re),re.detectedPlanes&&o.dispatchEvent({type:"planesdetected",data:re}),T=null}const he=new Jy;he.setAnimationLoop(F),this.setAnimationLoop=function(ee){xt=ee},this.dispose=function(){}}}const $s=new ua,xR=new an;function yR(r,t){function i(E,M){E.matrixAutoUpdate===!0&&E.updateMatrix(),M.value.copy(E.matrix)}function o(E,M){M.color.getRGB(E.fogColor.value,ky(r)),M.isFog?(E.fogNear.value=M.near,E.fogFar.value=M.far):M.isFogExp2&&(E.fogDensity.value=M.density)}function l(E,M,O,I,D){M.isMeshBasicMaterial||M.isMeshLambertMaterial?u(E,M):M.isMeshToonMaterial?(u(E,M),g(E,M)):M.isMeshPhongMaterial?(u(E,M),x(E,M)):M.isMeshStandardMaterial?(u(E,M),S(E,M),M.isMeshPhysicalMaterial&&y(E,M,D)):M.isMeshMatcapMaterial?(u(E,M),T(E,M)):M.isMeshDepthMaterial?u(E,M):M.isMeshDistanceMaterial?(u(E,M),C(E,M)):M.isMeshNormalMaterial?u(E,M):M.isLineBasicMaterial?(d(E,M),M.isLineDashedMaterial&&h(E,M)):M.isPointsMaterial?m(E,M,O,I):M.isSpriteMaterial?v(E,M):M.isShadowMaterial?(E.color.value.copy(M.color),E.opacity.value=M.opacity):M.isShaderMaterial&&(M.uniformsNeedUpdate=!1)}function u(E,M){E.opacity.value=M.opacity,M.color&&E.diffuse.value.copy(M.color),M.emissive&&E.emissive.value.copy(M.emissive).multiplyScalar(M.emissiveIntensity),M.map&&(E.map.value=M.map,i(M.map,E.mapTransform)),M.alphaMap&&(E.alphaMap.value=M.alphaMap,i(M.alphaMap,E.alphaMapTransform)),M.bumpMap&&(E.bumpMap.value=M.bumpMap,i(M.bumpMap,E.bumpMapTransform),E.bumpScale.value=M.bumpScale,M.side===ti&&(E.bumpScale.value*=-1)),M.normalMap&&(E.normalMap.value=M.normalMap,i(M.normalMap,E.normalMapTransform),E.normalScale.value.copy(M.normalScale),M.side===ti&&E.normalScale.value.negate()),M.displacementMap&&(E.displacementMap.value=M.displacementMap,i(M.displacementMap,E.displacementMapTransform),E.displacementScale.value=M.displacementScale,E.displacementBias.value=M.displacementBias),M.emissiveMap&&(E.emissiveMap.value=M.emissiveMap,i(M.emissiveMap,E.emissiveMapTransform)),M.specularMap&&(E.specularMap.value=M.specularMap,i(M.specularMap,E.specularMapTransform)),M.alphaTest>0&&(E.alphaTest.value=M.alphaTest);const O=t.get(M),I=O.envMap,D=O.envMapRotation;I&&(E.envMap.value=I,$s.copy(D),$s.x*=-1,$s.y*=-1,$s.z*=-1,I.isCubeTexture&&I.isRenderTargetTexture===!1&&($s.y*=-1,$s.z*=-1),E.envMapRotation.value.setFromMatrix4(xR.makeRotationFromEuler($s)),E.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1,E.reflectivity.value=M.reflectivity,E.ior.value=M.ior,E.refractionRatio.value=M.refractionRatio),M.lightMap&&(E.lightMap.value=M.lightMap,E.lightMapIntensity.value=M.lightMapIntensity,i(M.lightMap,E.lightMapTransform)),M.aoMap&&(E.aoMap.value=M.aoMap,E.aoMapIntensity.value=M.aoMapIntensity,i(M.aoMap,E.aoMapTransform))}function d(E,M){E.diffuse.value.copy(M.color),E.opacity.value=M.opacity,M.map&&(E.map.value=M.map,i(M.map,E.mapTransform))}function h(E,M){E.dashSize.value=M.dashSize,E.totalSize.value=M.dashSize+M.gapSize,E.scale.value=M.scale}function m(E,M,O,I){E.diffuse.value.copy(M.color),E.opacity.value=M.opacity,E.size.value=M.size*O,E.scale.value=I*.5,M.map&&(E.map.value=M.map,i(M.map,E.uvTransform)),M.alphaMap&&(E.alphaMap.value=M.alphaMap,i(M.alphaMap,E.alphaMapTransform)),M.alphaTest>0&&(E.alphaTest.value=M.alphaTest)}function v(E,M){E.diffuse.value.copy(M.color),E.opacity.value=M.opacity,E.rotation.value=M.rotation,M.map&&(E.map.value=M.map,i(M.map,E.mapTransform)),M.alphaMap&&(E.alphaMap.value=M.alphaMap,i(M.alphaMap,E.alphaMapTransform)),M.alphaTest>0&&(E.alphaTest.value=M.alphaTest)}function x(E,M){E.specular.value.copy(M.specular),E.shininess.value=Math.max(M.shininess,1e-4)}function g(E,M){M.gradientMap&&(E.gradientMap.value=M.gradientMap)}function S(E,M){E.metalness.value=M.metalness,M.metalnessMap&&(E.metalnessMap.value=M.metalnessMap,i(M.metalnessMap,E.metalnessMapTransform)),E.roughness.value=M.roughness,M.roughnessMap&&(E.roughnessMap.value=M.roughnessMap,i(M.roughnessMap,E.roughnessMapTransform)),M.envMap&&(E.envMapIntensity.value=M.envMapIntensity)}function y(E,M,O){E.ior.value=M.ior,M.sheen>0&&(E.sheenColor.value.copy(M.sheenColor).multiplyScalar(M.sheen),E.sheenRoughness.value=M.sheenRoughness,M.sheenColorMap&&(E.sheenColorMap.value=M.sheenColorMap,i(M.sheenColorMap,E.sheenColorMapTransform)),M.sheenRoughnessMap&&(E.sheenRoughnessMap.value=M.sheenRoughnessMap,i(M.sheenRoughnessMap,E.sheenRoughnessMapTransform))),M.clearcoat>0&&(E.clearcoat.value=M.clearcoat,E.clearcoatRoughness.value=M.clearcoatRoughness,M.clearcoatMap&&(E.clearcoatMap.value=M.clearcoatMap,i(M.clearcoatMap,E.clearcoatMapTransform)),M.clearcoatRoughnessMap&&(E.clearcoatRoughnessMap.value=M.clearcoatRoughnessMap,i(M.clearcoatRoughnessMap,E.clearcoatRoughnessMapTransform)),M.clearcoatNormalMap&&(E.clearcoatNormalMap.value=M.clearcoatNormalMap,i(M.clearcoatNormalMap,E.clearcoatNormalMapTransform),E.clearcoatNormalScale.value.copy(M.clearcoatNormalScale),M.side===ti&&E.clearcoatNormalScale.value.negate())),M.dispersion>0&&(E.dispersion.value=M.dispersion),M.iridescence>0&&(E.iridescence.value=M.iridescence,E.iridescenceIOR.value=M.iridescenceIOR,E.iridescenceThicknessMinimum.value=M.iridescenceThicknessRange[0],E.iridescenceThicknessMaximum.value=M.iridescenceThicknessRange[1],M.iridescenceMap&&(E.iridescenceMap.value=M.iridescenceMap,i(M.iridescenceMap,E.iridescenceMapTransform)),M.iridescenceThicknessMap&&(E.iridescenceThicknessMap.value=M.iridescenceThicknessMap,i(M.iridescenceThicknessMap,E.iridescenceThicknessMapTransform))),M.transmission>0&&(E.transmission.value=M.transmission,E.transmissionSamplerMap.value=O.texture,E.transmissionSamplerSize.value.set(O.width,O.height),M.transmissionMap&&(E.transmissionMap.value=M.transmissionMap,i(M.transmissionMap,E.transmissionMapTransform)),E.thickness.value=M.thickness,M.thicknessMap&&(E.thicknessMap.value=M.thicknessMap,i(M.thicknessMap,E.thicknessMapTransform)),E.attenuationDistance.value=M.attenuationDistance,E.attenuationColor.value.copy(M.attenuationColor)),M.anisotropy>0&&(E.anisotropyVector.value.set(M.anisotropy*Math.cos(M.anisotropyRotation),M.anisotropy*Math.sin(M.anisotropyRotation)),M.anisotropyMap&&(E.anisotropyMap.value=M.anisotropyMap,i(M.anisotropyMap,E.anisotropyMapTransform))),E.specularIntensity.value=M.specularIntensity,E.specularColor.value.copy(M.specularColor),M.specularColorMap&&(E.specularColorMap.value=M.specularColorMap,i(M.specularColorMap,E.specularColorMapTransform)),M.specularIntensityMap&&(E.specularIntensityMap.value=M.specularIntensityMap,i(M.specularIntensityMap,E.specularIntensityMapTransform))}function T(E,M){M.matcap&&(E.matcap.value=M.matcap)}function C(E,M){const O=t.get(M).light;E.referencePosition.value.setFromMatrixPosition(O.matrixWorld),E.nearDistance.value=O.shadow.camera.near,E.farDistance.value=O.shadow.camera.far}return{refreshFogUniforms:o,refreshMaterialUniforms:l}}function SR(r,t,i,o){let l={},u={},d=[];const h=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function m(O,I){const D=I.program;o.uniformBlockBinding(O,D)}function v(O,I){let D=l[O.id];D===void 0&&(T(O),D=x(O),l[O.id]=D,O.addEventListener("dispose",E));const V=I.program;o.updateUBOMapping(O,V);const H=t.render.frame;u[O.id]!==H&&(S(O),u[O.id]=H)}function x(O){const I=g();O.__bindingPointIndex=I;const D=r.createBuffer(),V=O.__size,H=O.usage;return r.bindBuffer(r.UNIFORM_BUFFER,D),r.bufferData(r.UNIFORM_BUFFER,V,H),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,I,D),D}function g(){for(let O=0;O<h;O++)if(d.indexOf(O)===-1)return d.push(O),O;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function S(O){const I=l[O.id],D=O.uniforms,V=O.__cache;r.bindBuffer(r.UNIFORM_BUFFER,I);for(let H=0,z=D.length;H<z;H++){const X=Array.isArray(D[H])?D[H]:[D[H]];for(let w=0,N=X.length;w<N;w++){const B=X[w];if(y(B,H,w,V)===!0){const k=B.__offset,le=Array.isArray(B.value)?B.value:[B.value];let pe=0;for(let fe=0;fe<le.length;fe++){const q=le[fe],se=C(q);typeof q=="number"||typeof q=="boolean"?(B.__data[0]=q,r.bufferSubData(r.UNIFORM_BUFFER,k+pe,B.__data)):q.isMatrix3?(B.__data[0]=q.elements[0],B.__data[1]=q.elements[1],B.__data[2]=q.elements[2],B.__data[3]=0,B.__data[4]=q.elements[3],B.__data[5]=q.elements[4],B.__data[6]=q.elements[5],B.__data[7]=0,B.__data[8]=q.elements[6],B.__data[9]=q.elements[7],B.__data[10]=q.elements[8],B.__data[11]=0):(q.toArray(B.__data,pe),pe+=se.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,k,B.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function y(O,I,D,V){const H=O.value,z=I+"_"+D;if(V[z]===void 0)return typeof H=="number"||typeof H=="boolean"?V[z]=H:V[z]=H.clone(),!0;{const X=V[z];if(typeof H=="number"||typeof H=="boolean"){if(X!==H)return V[z]=H,!0}else if(X.equals(H)===!1)return X.copy(H),!0}return!1}function T(O){const I=O.uniforms;let D=0;const V=16;for(let z=0,X=I.length;z<X;z++){const w=Array.isArray(I[z])?I[z]:[I[z]];for(let N=0,B=w.length;N<B;N++){const k=w[N],le=Array.isArray(k.value)?k.value:[k.value];for(let pe=0,fe=le.length;pe<fe;pe++){const q=le[pe],se=C(q),W=D%V,xe=W%se.boundary,Se=W+xe;D+=xe,Se!==0&&V-Se<se.storage&&(D+=V-Se),k.__data=new Float32Array(se.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=D,D+=se.storage}}}const H=D%V;return H>0&&(D+=V-H),O.__size=D,O.__cache={},this}function C(O){const I={boundary:0,storage:0};return typeof O=="number"||typeof O=="boolean"?(I.boundary=4,I.storage=4):O.isVector2?(I.boundary=8,I.storage=8):O.isVector3||O.isColor?(I.boundary=16,I.storage=12):O.isVector4?(I.boundary=16,I.storage=16):O.isMatrix3?(I.boundary=48,I.storage=48):O.isMatrix4?(I.boundary=64,I.storage=64):O.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",O),I}function E(O){const I=O.target;I.removeEventListener("dispose",E);const D=d.indexOf(I.__bindingPointIndex);d.splice(D,1),r.deleteBuffer(l[I.id]),delete l[I.id],delete u[I.id]}function M(){for(const O in l)r.deleteBuffer(l[O]);d=[],l={},u={}}return{bind:m,update:v,dispose:M}}class MR{constructor(t={}){const{canvas:i=QE(),context:o=null,depth:l=!0,stencil:u=!1,alpha:d=!1,antialias:h=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:v=!1,powerPreference:x="default",failIfMajorPerformanceCaveat:g=!1,reversedDepthBuffer:S=!1}=t;this.isWebGLRenderer=!0;let y;if(o!==null){if(typeof WebGLRenderingContext<"u"&&o instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");y=o.getContextAttributes().alpha}else y=d;const T=new Uint32Array(4),C=new Int32Array(4);let E=null,M=null;const O=[],I=[];this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ys,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const D=this;let V=!1;this._outputColorSpace=ei;let H=0,z=0,X=null,w=-1,N=null;const B=new Wt,k=new Wt;let le=null;const pe=new Rt(0);let fe=0,q=i.width,se=i.height,W=1,xe=null,Se=null;const Pe=new Wt(0,0,q,se),Je=new Wt(0,0,q,se);let xt=!1;const F=new zm;let he=!1,ee=!1;const re=new an,Ee=new ne,we=new Wt,Q={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let de=!1;function je(){return X===null?W:1}let P=o;function Ne(R,J){return i.getContext(R,J)}try{const R={alpha:!0,depth:l,stencil:u,antialias:h,premultipliedAlpha:m,preserveDrawingBuffer:v,powerPreference:x,failIfMajorPerformanceCaveat:g};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${Am}`),i.addEventListener("webglcontextlost",Le,!1),i.addEventListener("webglcontextrestored",qe,!1),i.addEventListener("webglcontextcreationerror",Te,!1),P===null){const J="webgl2";if(P=Ne(J,R),P===null)throw Ne(J)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let ze,ke,De,at,Ge,ot,gt,Ft,U,A,ie,ve,Me,me,Ye,Re,Qe,et,Ae,Ie,rt,$e,Be,ht;function j(){ze=new U2(P),ze.init(),$e=new pR(P,ze),ke=new b2(P,ze,t,$e),De=new dR(P,ze),ke.reversedDepthBuffer&&S&&De.buffers.depth.setReversed(!0),at=new z2(P),Ge=new $C,ot=new hR(P,ze,De,Ge,ke,$e,at),gt=new C2(D),Ft=new D2(D),U=new GT(P),Be=new E2(P,U),A=new L2(P,U,at,Be),ie=new I2(P,A,U,at),Ae=new P2(P,ke,ot),Re=new A2(Ge),ve=new JC(D,gt,Ft,ze,ke,Be,Re),Me=new yR(D,Ge),me=new tR,Ye=new oR(ze),et=new M2(D,gt,Ft,De,ie,y,m),Qe=new uR(D,ie,ke),ht=new SR(P,at,ke,De),Ie=new T2(P,ze,at),rt=new O2(P,ze,at),at.programs=ve.programs,D.capabilities=ke,D.extensions=ze,D.properties=Ge,D.renderLists=me,D.shadowMap=Qe,D.state=De,D.info=at}j();const Ce=new _R(D,P);this.xr=Ce,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const R=ze.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=ze.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(R){R!==void 0&&(W=R,this.setSize(q,se,!1))},this.getSize=function(R){return R.set(q,se)},this.setSize=function(R,J,ce=!0){if(Ce.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=R,se=J,i.width=Math.floor(R*W),i.height=Math.floor(J*W),ce===!0&&(i.style.width=R+"px",i.style.height=J+"px"),this.setViewport(0,0,R,J)},this.getDrawingBufferSize=function(R){return R.set(q*W,se*W).floor()},this.setDrawingBufferSize=function(R,J,ce){q=R,se=J,W=ce,i.width=Math.floor(R*ce),i.height=Math.floor(J*ce),this.setViewport(0,0,R,J)},this.getCurrentViewport=function(R){return R.copy(B)},this.getViewport=function(R){return R.copy(Pe)},this.setViewport=function(R,J,ce,ue){R.isVector4?Pe.set(R.x,R.y,R.z,R.w):Pe.set(R,J,ce,ue),De.viewport(B.copy(Pe).multiplyScalar(W).round())},this.getScissor=function(R){return R.copy(Je)},this.setScissor=function(R,J,ce,ue){R.isVector4?Je.set(R.x,R.y,R.z,R.w):Je.set(R,J,ce,ue),De.scissor(k.copy(Je).multiplyScalar(W).round())},this.getScissorTest=function(){return xt},this.setScissorTest=function(R){De.setScissorTest(xt=R)},this.setOpaqueSort=function(R){xe=R},this.setTransparentSort=function(R){Se=R},this.getClearColor=function(R){return R.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor(...arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha(...arguments)},this.clear=function(R=!0,J=!0,ce=!0){let ue=0;if(R){let $=!1;if(X!==null){const be=X.texture.format;$=be===Lm||be===Um||be===Dm}if($){const be=X.texture.type,Fe=be===ca||be===fr||be===Ol||be===zl||be===wm||be===Nm,Ve=et.getClearColor(),Ue=et.getClearAlpha(),We=Ve.r,st=Ve.g,nt=Ve.b;Fe?(T[0]=We,T[1]=st,T[2]=nt,T[3]=Ue,P.clearBufferuiv(P.COLOR,0,T)):(C[0]=We,C[1]=st,C[2]=nt,C[3]=Ue,P.clearBufferiv(P.COLOR,0,C))}else ue|=P.COLOR_BUFFER_BIT}J&&(ue|=P.DEPTH_BUFFER_BIT),ce&&(ue|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(ue)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",Le,!1),i.removeEventListener("webglcontextrestored",qe,!1),i.removeEventListener("webglcontextcreationerror",Te,!1),et.dispose(),me.dispose(),Ye.dispose(),Ge.dispose(),gt.dispose(),Ft.dispose(),ie.dispose(),Be.dispose(),ht.dispose(),ve.dispose(),Ce.dispose(),Ce.removeEventListener("sessionstart",vn),Ce.removeEventListener("sessionend",On),fa.stop()};function Le(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),V=!0}function qe(){console.log("THREE.WebGLRenderer: Context Restored."),V=!1;const R=at.autoReset,J=Qe.enabled,ce=Qe.autoUpdate,ue=Qe.needsUpdate,$=Qe.type;j(),at.autoReset=R,Qe.enabled=J,Qe.autoUpdate=ce,Qe.needsUpdate=ue,Qe.type=$}function Te(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function ye(R){const J=R.target;J.removeEventListener("dispose",ye),Ke(J)}function Ke(R){ut(R),Ge.remove(R)}function ut(R){const J=Ge.get(R).programs;J!==void 0&&(J.forEach(function(ce){ve.releaseProgram(ce)}),R.isShaderMaterial&&ve.releaseShaderCache(R))}this.renderBufferDirect=function(R,J,ce,ue,$,be){J===null&&(J=Q);const Fe=$.isMesh&&$.matrixWorld.determinant()<0,Ve=ql(R,J,ce,ue,$);De.setMaterial(ue,Fe);let Ue=ce.index,We=1;if(ue.wireframe===!0){if(Ue=A.getWireframeAttribute(ce),Ue===void 0)return;We=2}const st=ce.drawRange,nt=ce.attributes.position;let Mt=st.start*We,Ht=(st.start+st.count)*We;be!==null&&(Mt=Math.max(Mt,be.start*We),Ht=Math.min(Ht,(be.start+be.count)*We)),Ue!==null?(Mt=Math.max(Mt,0),Ht=Math.min(Ht,Ue.count)):nt!=null&&(Mt=Math.max(Mt,0),Ht=Math.min(Ht,nt.count));const $t=Ht-Mt;if($t<0||$t===1/0)return;Be.setup($,ue,Ve,ce,Ue);let Pt,Lt=Ie;if(Ue!==null&&(Pt=U.get(Ue),Lt=rt,Lt.setIndex(Pt)),$.isMesh)ue.wireframe===!0?(De.setLineWidth(ue.wireframeLinewidth*je()),Lt.setMode(P.LINES)):Lt.setMode(P.TRIANGLES);else if($.isLine){let it=ue.linewidth;it===void 0&&(it=1),De.setLineWidth(it*je()),$.isLineSegments?Lt.setMode(P.LINES):$.isLineLoop?Lt.setMode(P.LINE_LOOP):Lt.setMode(P.LINE_STRIP)}else $.isPoints?Lt.setMode(P.POINTS):$.isSprite&&Lt.setMode(P.TRIANGLES);if($.isBatchedMesh)if($._multiDrawInstances!==null)Fl("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Lt.renderMultiDrawInstances($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount,$._multiDrawInstances);else if(ze.get("WEBGL_multi_draw"))Lt.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const it=$._multiDrawStarts,It=$._multiDrawCounts,yt=$._multiDrawCount,_n=Ue?U.get(Ue).bytesPerElement:1,ni=Ge.get(ue).currentProgram.getUniforms();for(let Ot=0;Ot<yt;Ot++)ni.setValue(P,"_gl_DrawID",Ot),Lt.render(it[Ot]/_n,It[Ot])}else if($.isInstancedMesh)Lt.renderInstances(Mt,$t,$.count);else if(ce.isInstancedBufferGeometry){const it=ce._maxInstanceCount!==void 0?ce._maxInstanceCount:1/0,It=Math.min(ce.instanceCount,it);Lt.renderInstances(Mt,$t,It)}else Lt.render(Mt,$t)};function qt(R,J,ce){R.transparent===!0&&R.side===oa&&R.forceSinglePass===!1?(R.side=ti,R.needsUpdate=!0,gi(R,J,ce),R.side=Ms,R.needsUpdate=!0,gi(R,J,ce),R.side=oa):gi(R,J,ce)}this.compile=function(R,J,ce=null){ce===null&&(ce=R),M=Ye.get(ce),M.init(J),I.push(M),ce.traverseVisible(function($){$.isLight&&$.layers.test(J.layers)&&(M.pushLight($),$.castShadow&&M.pushShadow($))}),R!==ce&&R.traverseVisible(function($){$.isLight&&$.layers.test(J.layers)&&(M.pushLight($),$.castShadow&&M.pushShadow($))}),M.setupLights();const ue=new Set;return R.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const be=$.material;if(be)if(Array.isArray(be))for(let Fe=0;Fe<be.length;Fe++){const Ve=be[Fe];qt(Ve,ce,$),ue.add(Ve)}else qt(be,ce,$),ue.add(be)}),M=I.pop(),ue},this.compileAsync=function(R,J,ce=null){const ue=this.compile(R,J,ce);return new Promise($=>{function be(){if(ue.forEach(function(Fe){Ge.get(Fe).currentProgram.isReady()&&ue.delete(Fe)}),ue.size===0){$(R);return}setTimeout(be,10)}ze.get("KHR_parallel_shader_compile")!==null?be():setTimeout(be,10)})};let bt=null;function tn(R){bt&&bt(R)}function vn(){fa.stop()}function On(){fa.start()}const fa=new Jy;fa.setAnimationLoop(tn),typeof self<"u"&&fa.setContext(self),this.setAnimationLoop=function(R){bt=R,Ce.setAnimationLoop(R),R===null?fa.stop():fa.start()},Ce.addEventListener("sessionstart",vn),Ce.addEventListener("sessionend",On),this.render=function(R,J){if(J!==void 0&&J.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(V===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),J.parent===null&&J.matrixWorldAutoUpdate===!0&&J.updateMatrixWorld(),Ce.enabled===!0&&Ce.isPresenting===!0&&(Ce.cameraAutoUpdate===!0&&Ce.updateCamera(J),J=Ce.getCamera()),R.isScene===!0&&R.onBeforeRender(D,R,J,X),M=Ye.get(R,I.length),M.init(J),I.push(M),re.multiplyMatrices(J.projectionMatrix,J.matrixWorldInverse),F.setFromProjectionMatrix(re,la,J.reversedDepth),ee=this.localClippingEnabled,he=Re.init(this.clippingPlanes,ee),E=me.get(R,O.length),E.init(),O.push(E),Ce.enabled===!0&&Ce.isPresenting===!0){const be=D.xr.getDepthSensingMesh();be!==null&&Lo(be,J,-1/0,D.sortObjects)}Lo(R,J,0,D.sortObjects),E.finish(),D.sortObjects===!0&&E.sort(xe,Se),de=Ce.enabled===!1||Ce.isPresenting===!1||Ce.hasDepthSensing()===!1,de&&et.addToRenderList(E,R),this.info.render.frame++,he===!0&&Re.beginShadows();const ce=M.state.shadowsArray;Qe.render(ce,R,J),he===!0&&Re.endShadows(),this.info.autoReset===!0&&this.info.reset();const ue=E.opaque,$=E.transmissive;if(M.setupLights(),J.isArrayCamera){const be=J.cameras;if($.length>0)for(let Fe=0,Ve=be.length;Fe<Ve;Fe++){const Ue=be[Fe];Es(ue,$,R,Ue)}de&&et.render(R);for(let Fe=0,Ve=be.length;Fe<Ve;Fe++){const Ue=be[Fe];Xl(E,R,Ue,Ue.viewport)}}else $.length>0&&Es(ue,$,R,J),de&&et.render(R),Xl(E,R,J);X!==null&&z===0&&(ot.updateMultisampleRenderTarget(X),ot.updateRenderTargetMipmap(X)),R.isScene===!0&&R.onAfterRender(D,R,J),Be.resetDefaultState(),w=-1,N=null,I.pop(),I.length>0?(M=I[I.length-1],he===!0&&Re.setGlobalState(D.clippingPlanes,M.state.camera)):M=null,O.pop(),O.length>0?E=O[O.length-1]:E=null};function Lo(R,J,ce,ue){if(R.visible===!1)return;if(R.layers.test(J.layers)){if(R.isGroup)ce=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(J);else if(R.isLight)M.pushLight(R),R.castShadow&&M.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||F.intersectsSprite(R)){ue&&we.setFromMatrixPosition(R.matrixWorld).applyMatrix4(re);const Fe=ie.update(R),Ve=R.material;Ve.visible&&E.push(R,Fe,Ve,ce,we.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||F.intersectsObject(R))){const Fe=ie.update(R),Ve=R.material;if(ue&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),we.copy(R.boundingSphere.center)):(Fe.boundingSphere===null&&Fe.computeBoundingSphere(),we.copy(Fe.boundingSphere.center)),we.applyMatrix4(R.matrixWorld).applyMatrix4(re)),Array.isArray(Ve)){const Ue=Fe.groups;for(let We=0,st=Ue.length;We<st;We++){const nt=Ue[We],Mt=Ve[nt.materialIndex];Mt&&Mt.visible&&E.push(R,Fe,Mt,ce,we.z,nt)}}else Ve.visible&&E.push(R,Fe,Ve,ce,we.z,null)}}const be=R.children;for(let Fe=0,Ve=be.length;Fe<Ve;Fe++)Lo(be[Fe],J,ce,ue)}function Xl(R,J,ce,ue){const $=R.opaque,be=R.transmissive,Fe=R.transparent;M.setupLightsView(ce),he===!0&&Re.setGlobalState(D.clippingPlanes,ce),ue&&De.viewport(B.copy(ue)),$.length>0&&da($,J,ce),be.length>0&&da(be,J,ce),Fe.length>0&&da(Fe,J,ce),De.buffers.depth.setTest(!0),De.buffers.depth.setMask(!0),De.buffers.color.setMask(!0),De.setPolygonOffset(!1)}function Es(R,J,ce,ue){if((ce.isScene===!0?ce.overrideMaterial:null)!==null)return;M.state.transmissionRenderTarget[ue.id]===void 0&&(M.state.transmissionRenderTarget[ue.id]=new Xi(1,1,{generateMipmaps:!0,type:ze.has("EXT_color_buffer_half_float")||ze.has("EXT_color_buffer_float")?za:ca,minFilter:or,samples:4,stencilBuffer:u,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ut.workingColorSpace}));const be=M.state.transmissionRenderTarget[ue.id],Fe=ue.viewport||B;be.setSize(Fe.z*D.transmissionResolutionScale,Fe.w*D.transmissionResolutionScale);const Ve=D.getRenderTarget(),Ue=D.getActiveCubeFace(),We=D.getActiveMipmapLevel();D.setRenderTarget(be),D.getClearColor(pe),fe=D.getClearAlpha(),fe<1&&D.setClearColor(16777215,.5),D.clear(),de&&et.render(ce);const st=D.toneMapping;D.toneMapping=ys;const nt=ue.viewport;if(ue.viewport!==void 0&&(ue.viewport=void 0),M.setupLightsView(ue),he===!0&&Re.setGlobalState(D.clippingPlanes,ue),da(R,ce,ue),ot.updateMultisampleRenderTarget(be),ot.updateRenderTargetMipmap(be),ze.has("WEBGL_multisampled_render_to_texture")===!1){let Mt=!1;for(let Ht=0,$t=J.length;Ht<$t;Ht++){const Pt=J[Ht],Lt=Pt.object,it=Pt.geometry,It=Pt.material,yt=Pt.group;if(It.side===oa&&Lt.layers.test(ue.layers)){const _n=It.side;It.side=ti,It.needsUpdate=!0,Ts(Lt,ce,ue,it,It,yt),It.side=_n,It.needsUpdate=!0,Mt=!0}}Mt===!0&&(ot.updateMultisampleRenderTarget(be),ot.updateRenderTargetMipmap(be))}D.setRenderTarget(Ve,Ue,We),D.setClearColor(pe,fe),nt!==void 0&&(ue.viewport=nt),D.toneMapping=st}function da(R,J,ce){const ue=J.isScene===!0?J.overrideMaterial:null;for(let $=0,be=R.length;$<be;$++){const Fe=R[$],Ve=Fe.object,Ue=Fe.geometry,We=Fe.group;let st=Fe.material;st.allowOverride===!0&&ue!==null&&(st=ue),Ve.layers.test(ce.layers)&&Ts(Ve,J,ce,Ue,st,We)}}function Ts(R,J,ce,ue,$,be){R.onBeforeRender(D,J,ce,ue,$,be),R.modelViewMatrix.multiplyMatrices(ce.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),$.onBeforeRender(D,J,ce,ue,R,be),$.transparent===!0&&$.side===oa&&$.forceSinglePass===!1?($.side=ti,$.needsUpdate=!0,D.renderBufferDirect(ce,J,ue,$,R,be),$.side=Ms,$.needsUpdate=!0,D.renderBufferDirect(ce,J,ue,$,R,be),$.side=oa):D.renderBufferDirect(ce,J,ue,$,R,be),R.onAfterRender(D,J,ce,ue,$,be)}function gi(R,J,ce){J.isScene!==!0&&(J=Q);const ue=Ge.get(R),$=M.state.lights,be=M.state.shadowsArray,Fe=$.state.version,Ve=ve.getParameters(R,$.state,be,J,ce),Ue=ve.getProgramCacheKey(Ve);let We=ue.programs;ue.environment=R.isMeshStandardMaterial?J.environment:null,ue.fog=J.fog,ue.envMap=(R.isMeshStandardMaterial?Ft:gt).get(R.envMap||ue.environment),ue.envMapRotation=ue.environment!==null&&R.envMap===null?J.environmentRotation:R.envMapRotation,We===void 0&&(R.addEventListener("dispose",ye),We=new Map,ue.programs=We);let st=We.get(Ue);if(st!==void 0){if(ue.currentProgram===st&&ue.lightsStateVersion===Fe)return Ia(R,Ve),st}else Ve.uniforms=ve.getUniforms(R),R.onBeforeCompile(Ve,D),st=ve.acquireProgram(Ve,Ue),We.set(Ue,st),ue.uniforms=Ve.uniforms;const nt=ue.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(nt.clippingPlanes=Re.uniform),Ia(R,Ve),ue.needsLights=Yl(R),ue.lightsStateVersion=Fe,ue.needsLights&&(nt.ambientLightColor.value=$.state.ambient,nt.lightProbe.value=$.state.probe,nt.directionalLights.value=$.state.directional,nt.directionalLightShadows.value=$.state.directionalShadow,nt.spotLights.value=$.state.spot,nt.spotLightShadows.value=$.state.spotShadow,nt.rectAreaLights.value=$.state.rectArea,nt.ltc_1.value=$.state.rectAreaLTC1,nt.ltc_2.value=$.state.rectAreaLTC2,nt.pointLights.value=$.state.point,nt.pointLightShadows.value=$.state.pointShadow,nt.hemisphereLights.value=$.state.hemi,nt.directionalShadowMap.value=$.state.directionalShadowMap,nt.directionalShadowMatrix.value=$.state.directionalShadowMatrix,nt.spotShadowMap.value=$.state.spotShadowMap,nt.spotLightMatrix.value=$.state.spotLightMatrix,nt.spotLightMap.value=$.state.spotLightMap,nt.pointShadowMap.value=$.state.pointShadowMap,nt.pointShadowMatrix.value=$.state.pointShadowMatrix),ue.currentProgram=st,ue.uniformsList=null,st}function bs(R){if(R.uniformsList===null){const J=R.currentProgram.getUniforms();R.uniformsList=qu.seqWithValue(J.seq,R.uniforms)}return R.uniformsList}function Ia(R,J){const ce=Ge.get(R);ce.outputColorSpace=J.outputColorSpace,ce.batching=J.batching,ce.batchingColor=J.batchingColor,ce.instancing=J.instancing,ce.instancingColor=J.instancingColor,ce.instancingMorph=J.instancingMorph,ce.skinning=J.skinning,ce.morphTargets=J.morphTargets,ce.morphNormals=J.morphNormals,ce.morphColors=J.morphColors,ce.morphTargetsCount=J.morphTargetsCount,ce.numClippingPlanes=J.numClippingPlanes,ce.numIntersection=J.numClipIntersection,ce.vertexAlphas=J.vertexAlphas,ce.vertexTangents=J.vertexTangents,ce.toneMapping=J.toneMapping}function ql(R,J,ce,ue,$){J.isScene!==!0&&(J=Q),ot.resetTextureUnits();const be=J.fog,Fe=ue.isMeshStandardMaterial?J.environment:null,Ve=X===null?D.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:bo,Ue=(ue.isMeshStandardMaterial?Ft:gt).get(ue.envMap||Fe),We=ue.vertexColors===!0&&!!ce.attributes.color&&ce.attributes.color.itemSize===4,st=!!ce.attributes.tangent&&(!!ue.normalMap||ue.anisotropy>0),nt=!!ce.morphAttributes.position,Mt=!!ce.morphAttributes.normal,Ht=!!ce.morphAttributes.color;let $t=ys;ue.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&($t=D.toneMapping);const Pt=ce.morphAttributes.position||ce.morphAttributes.normal||ce.morphAttributes.color,Lt=Pt!==void 0?Pt.length:0,it=Ge.get(ue),It=M.state.lights;if(he===!0&&(ee===!0||R!==N)){const sn=R===N&&ue.id===w;Re.setState(ue,R,sn)}let yt=!1;ue.version===it.__version?(it.needsLights&&it.lightsStateVersion!==It.state.version||it.outputColorSpace!==Ve||$.isBatchedMesh&&it.batching===!1||!$.isBatchedMesh&&it.batching===!0||$.isBatchedMesh&&it.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&it.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&it.instancing===!1||!$.isInstancedMesh&&it.instancing===!0||$.isSkinnedMesh&&it.skinning===!1||!$.isSkinnedMesh&&it.skinning===!0||$.isInstancedMesh&&it.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&it.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&it.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&it.instancingMorph===!1&&$.morphTexture!==null||it.envMap!==Ue||ue.fog===!0&&it.fog!==be||it.numClippingPlanes!==void 0&&(it.numClippingPlanes!==Re.numPlanes||it.numIntersection!==Re.numIntersection)||it.vertexAlphas!==We||it.vertexTangents!==st||it.morphTargets!==nt||it.morphNormals!==Mt||it.morphColors!==Ht||it.toneMapping!==$t||it.morphTargetsCount!==Lt)&&(yt=!0):(yt=!0,it.__version=ue.version);let _n=it.currentProgram;yt===!0&&(_n=gi(ue,J,$));let ni=!1,Ot=!1,Ba=!1;const Kt=_n.getUniforms(),Hn=it.uniforms;if(De.useProgram(_n.program)&&(ni=!0,Ot=!0,Ba=!0),ue.id!==w&&(w=ue.id,Ot=!0),ni||N!==R){De.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),Kt.setValue(P,"projectionMatrix",R.projectionMatrix),Kt.setValue(P,"viewMatrix",R.matrixWorldInverse);const zn=Kt.map.cameraPosition;zn!==void 0&&zn.setValue(P,Ee.setFromMatrixPosition(R.matrixWorld)),ke.logarithmicDepthBuffer&&Kt.setValue(P,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(ue.isMeshPhongMaterial||ue.isMeshToonMaterial||ue.isMeshLambertMaterial||ue.isMeshBasicMaterial||ue.isMeshStandardMaterial||ue.isShaderMaterial)&&Kt.setValue(P,"isOrthographic",R.isOrthographicCamera===!0),N!==R&&(N=R,Ot=!0,Ba=!0)}if($.isSkinnedMesh){Kt.setOptional(P,$,"bindMatrix"),Kt.setOptional(P,$,"bindMatrixInverse");const sn=$.skeleton;sn&&(sn.boneTexture===null&&sn.computeBoneTexture(),Kt.setValue(P,"boneTexture",sn.boneTexture,ot))}$.isBatchedMesh&&(Kt.setOptional(P,$,"batchingTexture"),Kt.setValue(P,"batchingTexture",$._matricesTexture,ot),Kt.setOptional(P,$,"batchingIdTexture"),Kt.setValue(P,"batchingIdTexture",$._indirectTexture,ot),Kt.setOptional(P,$,"batchingColorTexture"),$._colorsTexture!==null&&Kt.setValue(P,"batchingColorTexture",$._colorsTexture,ot));const un=ce.morphAttributes;if((un.position!==void 0||un.normal!==void 0||un.color!==void 0)&&Ae.update($,ce,_n),(Ot||it.receiveShadow!==$.receiveShadow)&&(it.receiveShadow=$.receiveShadow,Kt.setValue(P,"receiveShadow",$.receiveShadow)),ue.isMeshGouraudMaterial&&ue.envMap!==null&&(Hn.envMap.value=Ue,Hn.flipEnvMap.value=Ue.isCubeTexture&&Ue.isRenderTargetTexture===!1?-1:1),ue.isMeshStandardMaterial&&ue.envMap===null&&J.environment!==null&&(Hn.envMapIntensity.value=J.environmentIntensity),Ot&&(Kt.setValue(P,"toneMappingExposure",D.toneMappingExposure),it.needsLights&&of(Hn,Ba),be&&ue.fog===!0&&Me.refreshFogUniforms(Hn,be),Me.refreshMaterialUniforms(Hn,ue,W,se,M.state.transmissionRenderTarget[R.id]),qu.upload(P,bs(it),Hn,ot)),ue.isShaderMaterial&&ue.uniformsNeedUpdate===!0&&(qu.upload(P,bs(it),Hn,ot),ue.uniformsNeedUpdate=!1),ue.isSpriteMaterial&&Kt.setValue(P,"center",$.center),Kt.setValue(P,"modelViewMatrix",$.modelViewMatrix),Kt.setValue(P,"normalMatrix",$.normalMatrix),Kt.setValue(P,"modelMatrix",$.matrixWorld),ue.isShaderMaterial||ue.isRawShaderMaterial){const sn=ue.uniformsGroups;for(let zn=0,hr=sn.length;zn<hr;zn++){const Wi=sn[zn];ht.update(Wi,_n),ht.bind(Wi,_n)}}return _n}function of(R,J){R.ambientLightColor.needsUpdate=J,R.lightProbe.needsUpdate=J,R.directionalLights.needsUpdate=J,R.directionalLightShadows.needsUpdate=J,R.pointLights.needsUpdate=J,R.pointLightShadows.needsUpdate=J,R.spotLights.needsUpdate=J,R.spotLightShadows.needsUpdate=J,R.rectAreaLights.needsUpdate=J,R.hemisphereLights.needsUpdate=J}function Yl(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(R,J,ce){const ue=Ge.get(R);ue.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,ue.__autoAllocateDepthBuffer===!1&&(ue.__useRenderToTexture=!1),Ge.get(R.texture).__webglTexture=J,Ge.get(R.depthTexture).__webglTexture=ue.__autoAllocateDepthBuffer?void 0:ce,ue.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,J){const ce=Ge.get(R);ce.__webglFramebuffer=J,ce.__useDefaultFramebuffer=J===void 0};const Oo=P.createFramebuffer();this.setRenderTarget=function(R,J=0,ce=0){X=R,H=J,z=ce;let ue=!0,$=null,be=!1,Fe=!1;if(R){const Ue=Ge.get(R);if(Ue.__useDefaultFramebuffer!==void 0)De.bindFramebuffer(P.FRAMEBUFFER,null),ue=!1;else if(Ue.__webglFramebuffer===void 0)ot.setupRenderTarget(R);else if(Ue.__hasExternalTextures)ot.rebindTextures(R,Ge.get(R.texture).__webglTexture,Ge.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const nt=R.depthTexture;if(Ue.__boundDepthTexture!==nt){if(nt!==null&&Ge.has(nt)&&(R.width!==nt.image.width||R.height!==nt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ot.setupDepthRenderbuffer(R)}}const We=R.texture;(We.isData3DTexture||We.isDataArrayTexture||We.isCompressedArrayTexture)&&(Fe=!0);const st=Ge.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(st[J])?$=st[J][ce]:$=st[J],be=!0):R.samples>0&&ot.useMultisampledRTT(R)===!1?$=Ge.get(R).__webglMultisampledFramebuffer:Array.isArray(st)?$=st[ce]:$=st,B.copy(R.viewport),k.copy(R.scissor),le=R.scissorTest}else B.copy(Pe).multiplyScalar(W).floor(),k.copy(Je).multiplyScalar(W).floor(),le=xt;if(ce!==0&&($=Oo),De.bindFramebuffer(P.FRAMEBUFFER,$)&&ue&&De.drawBuffers(R,$),De.viewport(B),De.scissor(k),De.setScissorTest(le),be){const Ue=Ge.get(R.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ue.__webglTexture,ce)}else if(Fe){const Ue=J;for(let We=0;We<R.textures.length;We++){const st=Ge.get(R.textures[We]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+We,st.__webglTexture,ce,Ue)}}else if(R!==null&&ce!==0){const Ue=Ge.get(R.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ue.__webglTexture,ce)}w=-1},this.readRenderTargetPixels=function(R,J,ce,ue,$,be,Fe,Ve=0){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ue=Ge.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Fe!==void 0&&(Ue=Ue[Fe]),Ue){De.bindFramebuffer(P.FRAMEBUFFER,Ue);try{const We=R.textures[Ve],st=We.format,nt=We.type;if(!ke.textureFormatReadable(st)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ke.textureTypeReadable(nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}J>=0&&J<=R.width-ue&&ce>=0&&ce<=R.height-$&&(R.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Ve),P.readPixels(J,ce,ue,$,$e.convert(st),$e.convert(nt),be))}finally{const We=X!==null?Ge.get(X).__webglFramebuffer:null;De.bindFramebuffer(P.FRAMEBUFFER,We)}}},this.readRenderTargetPixelsAsync=async function(R,J,ce,ue,$,be,Fe,Ve=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ue=Ge.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Fe!==void 0&&(Ue=Ue[Fe]),Ue)if(J>=0&&J<=R.width-ue&&ce>=0&&ce<=R.height-$){De.bindFramebuffer(P.FRAMEBUFFER,Ue);const We=R.textures[Ve],st=We.format,nt=We.type;if(!ke.textureFormatReadable(st))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ke.textureTypeReadable(nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Mt=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Mt),P.bufferData(P.PIXEL_PACK_BUFFER,be.byteLength,P.STREAM_READ),R.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Ve),P.readPixels(J,ce,ue,$,$e.convert(st),$e.convert(nt),0);const Ht=X!==null?Ge.get(X).__webglFramebuffer:null;De.bindFramebuffer(P.FRAMEBUFFER,Ht);const $t=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await JE(P,$t,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Mt),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,be),P.deleteBuffer(Mt),P.deleteSync($t),be}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,J=null,ce=0){const ue=Math.pow(2,-ce),$=Math.floor(R.image.width*ue),be=Math.floor(R.image.height*ue),Fe=J!==null?J.x:0,Ve=J!==null?J.y:0;ot.setTexture2D(R,0),P.copyTexSubImage2D(P.TEXTURE_2D,ce,0,0,Fe,Ve,$,be),De.unbindTexture()};const As=P.createFramebuffer(),lf=P.createFramebuffer();this.copyTextureToTexture=function(R,J,ce=null,ue=null,$=0,be=null){be===null&&($!==0?(Fl("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),be=$,$=0):be=0);let Fe,Ve,Ue,We,st,nt,Mt,Ht,$t;const Pt=R.isCompressedTexture?R.mipmaps[be]:R.image;if(ce!==null)Fe=ce.max.x-ce.min.x,Ve=ce.max.y-ce.min.y,Ue=ce.isBox3?ce.max.z-ce.min.z:1,We=ce.min.x,st=ce.min.y,nt=ce.isBox3?ce.min.z:0;else{const un=Math.pow(2,-$);Fe=Math.floor(Pt.width*un),Ve=Math.floor(Pt.height*un),R.isDataArrayTexture?Ue=Pt.depth:R.isData3DTexture?Ue=Math.floor(Pt.depth*un):Ue=1,We=0,st=0,nt=0}ue!==null?(Mt=ue.x,Ht=ue.y,$t=ue.z):(Mt=0,Ht=0,$t=0);const Lt=$e.convert(J.format),it=$e.convert(J.type);let It;J.isData3DTexture?(ot.setTexture3D(J,0),It=P.TEXTURE_3D):J.isDataArrayTexture||J.isCompressedArrayTexture?(ot.setTexture2DArray(J,0),It=P.TEXTURE_2D_ARRAY):(ot.setTexture2D(J,0),It=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,J.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,J.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,J.unpackAlignment);const yt=P.getParameter(P.UNPACK_ROW_LENGTH),_n=P.getParameter(P.UNPACK_IMAGE_HEIGHT),ni=P.getParameter(P.UNPACK_SKIP_PIXELS),Ot=P.getParameter(P.UNPACK_SKIP_ROWS),Ba=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,Pt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Pt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,We),P.pixelStorei(P.UNPACK_SKIP_ROWS,st),P.pixelStorei(P.UNPACK_SKIP_IMAGES,nt);const Kt=R.isDataArrayTexture||R.isData3DTexture,Hn=J.isDataArrayTexture||J.isData3DTexture;if(R.isDepthTexture){const un=Ge.get(R),sn=Ge.get(J),zn=Ge.get(un.__renderTarget),hr=Ge.get(sn.__renderTarget);De.bindFramebuffer(P.READ_FRAMEBUFFER,zn.__webglFramebuffer),De.bindFramebuffer(P.DRAW_FRAMEBUFFER,hr.__webglFramebuffer);for(let Wi=0;Wi<Ue;Wi++)Kt&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ge.get(R).__webglTexture,$,nt+Wi),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ge.get(J).__webglTexture,be,$t+Wi)),P.blitFramebuffer(We,st,Fe,Ve,Mt,Ht,Fe,Ve,P.DEPTH_BUFFER_BIT,P.NEAREST);De.bindFramebuffer(P.READ_FRAMEBUFFER,null),De.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if($!==0||R.isRenderTargetTexture||Ge.has(R)){const un=Ge.get(R),sn=Ge.get(J);De.bindFramebuffer(P.READ_FRAMEBUFFER,As),De.bindFramebuffer(P.DRAW_FRAMEBUFFER,lf);for(let zn=0;zn<Ue;zn++)Kt?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,un.__webglTexture,$,nt+zn):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,un.__webglTexture,$),Hn?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,sn.__webglTexture,be,$t+zn):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,sn.__webglTexture,be),$!==0?P.blitFramebuffer(We,st,Fe,Ve,Mt,Ht,Fe,Ve,P.COLOR_BUFFER_BIT,P.NEAREST):Hn?P.copyTexSubImage3D(It,be,Mt,Ht,$t+zn,We,st,Fe,Ve):P.copyTexSubImage2D(It,be,Mt,Ht,We,st,Fe,Ve);De.bindFramebuffer(P.READ_FRAMEBUFFER,null),De.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else Hn?R.isDataTexture||R.isData3DTexture?P.texSubImage3D(It,be,Mt,Ht,$t,Fe,Ve,Ue,Lt,it,Pt.data):J.isCompressedArrayTexture?P.compressedTexSubImage3D(It,be,Mt,Ht,$t,Fe,Ve,Ue,Lt,Pt.data):P.texSubImage3D(It,be,Mt,Ht,$t,Fe,Ve,Ue,Lt,it,Pt):R.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,be,Mt,Ht,Fe,Ve,Lt,it,Pt.data):R.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,be,Mt,Ht,Pt.width,Pt.height,Lt,Pt.data):P.texSubImage2D(P.TEXTURE_2D,be,Mt,Ht,Fe,Ve,Lt,it,Pt);P.pixelStorei(P.UNPACK_ROW_LENGTH,yt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,_n),P.pixelStorei(P.UNPACK_SKIP_PIXELS,ni),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ot),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ba),be===0&&J.generateMipmaps&&P.generateMipmap(It),De.unbindTexture()},this.initRenderTarget=function(R){Ge.get(R).__webglFramebuffer===void 0&&ot.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?ot.setTextureCube(R,0):R.isData3DTexture?ot.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?ot.setTexture2DArray(R,0):ot.setTexture2D(R,0),De.unbindTexture()},this.resetState=function(){H=0,z=0,X=null,De.reset(),Be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return la}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const i=this.getContext();i.drawingBufferColorSpace=Ut._getDrawingBufferColorSpace(t),i.unpackColorSpace=Ut._getUnpackColorSpace()}}const Yu={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Uo{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ER=new sf(-1,1,1,-1,0,1);class TR extends Yi{constructor(){super(),this.setAttribute("position",new Di([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Di([0,2,0,0,2,0],2))}}const bR=new TR;class Hm{constructor(t){this._mesh=new pi(bR,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,ER)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class iS extends Uo{constructor(t,i="tDiffuse"){super(),this.textureID=i,this.uniforms=null,this.material=null,t instanceof qn?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Hl.clone(t.uniforms),this.material=new qn({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Hm(this.material)}render(t,i,o){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=o.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class uy extends Uo{constructor(t,i){super(),this.scene=t,this.camera=i,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,i,o){const l=t.getContext(),u=t.state;u.buffers.color.setMask(!1),u.buffers.depth.setMask(!1),u.buffers.color.setLocked(!0),u.buffers.depth.setLocked(!0);let d,h;this.inverse?(d=0,h=1):(d=1,h=0),u.buffers.stencil.setTest(!0),u.buffers.stencil.setOp(l.REPLACE,l.REPLACE,l.REPLACE),u.buffers.stencil.setFunc(l.ALWAYS,d,4294967295),u.buffers.stencil.setClear(h),u.buffers.stencil.setLocked(!0),t.setRenderTarget(o),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),u.buffers.color.setLocked(!1),u.buffers.depth.setLocked(!1),u.buffers.color.setMask(!0),u.buffers.depth.setMask(!0),u.buffers.stencil.setLocked(!1),u.buffers.stencil.setFunc(l.EQUAL,1,4294967295),u.buffers.stencil.setOp(l.KEEP,l.KEEP,l.KEEP),u.buffers.stencil.setLocked(!0)}}class AR extends Uo{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class CR{constructor(t,i){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),i===void 0){const o=t.getSize(new ft);this._width=o.width,this._height=o.height,i=new Xi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:za}),i.texture.name="EffectComposer.rt1"}else this._width=i.width,this._height=i.height;this.renderTarget1=i,this.renderTarget2=i.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new iS(Yu),this.copyPass.material.blending=Oa,this.clock=new Qy}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,i){this.passes.splice(i,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const i=this.passes.indexOf(t);i!==-1&&this.passes.splice(i,1)}isLastEnabledPass(t){for(let i=t+1;i<this.passes.length;i++)if(this.passes[i].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const i=this.renderer.getRenderTarget();let o=!1;for(let l=0,u=this.passes.length;l<u;l++){const d=this.passes[l];if(d.enabled!==!1){if(d.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(l),d.render(this.renderer,this.writeBuffer,this.readBuffer,t,o),d.needsSwap){if(o){const h=this.renderer.getContext(),m=this.renderer.state.buffers.stencil;m.setFunc(h.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),m.setFunc(h.EQUAL,1,4294967295)}this.swapBuffers()}uy!==void 0&&(d instanceof uy?o=!0:d instanceof AR&&(o=!1))}}this.renderer.setRenderTarget(i)}reset(t){if(t===void 0){const i=this.renderer.getSize(new ft);this._pixelRatio=this.renderer.getPixelRatio(),this._width=i.width,this._height=i.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,i){this._width=t,this._height=i;const o=this._width*this._pixelRatio,l=this._height*this._pixelRatio;this.renderTarget1.setSize(o,l),this.renderTarget2.setSize(o,l);for(let u=0;u<this.passes.length;u++)this.passes[u].setSize(o,l)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class RR extends Uo{constructor(t,i,o=null,l=null,u=null){super(),this.scene=t,this.camera=i,this.overrideMaterial=o,this.clearColor=l,this.clearAlpha=u,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Rt}render(t,i,o){const l=t.autoClear;t.autoClear=!1;let u,d;this.overrideMaterial!==null&&(d=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(u=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:o),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(u),this.overrideMaterial!==null&&(this.scene.overrideMaterial=d),t.autoClear=l}}const wR={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Rt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Co extends Uo{constructor(t,i=1,o,l){super(),this.strength=i,this.radius=o,this.threshold=l,this.resolution=t!==void 0?new ft(t.x,t.y):new ft(256,256),this.clearColor=new Rt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let u=Math.round(this.resolution.x/2),d=Math.round(this.resolution.y/2);this.renderTargetBright=new Xi(u,d,{type:za}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let x=0;x<this.nMips;x++){const g=new Xi(u,d,{type:za});g.texture.name="UnrealBloomPass.h"+x,g.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(g);const S=new Xi(u,d,{type:za});S.texture.name="UnrealBloomPass.v"+x,S.texture.generateMipmaps=!1,this.renderTargetsVertical.push(S),u=Math.round(u/2),d=Math.round(d/2)}const h=wR;this.highPassUniforms=Hl.clone(h.uniforms),this.highPassUniforms.luminosityThreshold.value=l,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new qn({uniforms:this.highPassUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader}),this.separableBlurMaterials=[];const m=[3,5,7,9,11];u=Math.round(this.resolution.x/2),d=Math.round(this.resolution.y/2);for(let x=0;x<this.nMips;x++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(m[x])),this.separableBlurMaterials[x].uniforms.invSize.value=new ft(1/u,1/d),u=Math.round(u/2),d=Math.round(d/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=i,this.compositeMaterial.uniforms.bloomRadius.value=.1;const v=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=v,this.bloomTintColors=[new ne(1,1,1),new ne(1,1,1),new ne(1,1,1),new ne(1,1,1),new ne(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Hl.clone(Yu.uniforms),this.blendMaterial=new qn({uniforms:this.copyUniforms,vertexShader:Yu.vertexShader,fragmentShader:Yu.fragmentShader,blending:Rp,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Rt,this._oldClearAlpha=1,this._basic=new xo,this._fsQuad=new Hm(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,i){let o=Math.round(t/2),l=Math.round(i/2);this.renderTargetBright.setSize(o,l);for(let u=0;u<this.nMips;u++)this.renderTargetsHorizontal[u].setSize(o,l),this.renderTargetsVertical[u].setSize(o,l),this.separableBlurMaterials[u].uniforms.invSize.value=new ft(1/o,1/l),o=Math.round(o/2),l=Math.round(l/2)}render(t,i,o,l,u){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const d=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),u&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=o.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=o.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let h=this.renderTargetBright;for(let m=0;m<this.nMips;m++)this._fsQuad.material=this.separableBlurMaterials[m],this.separableBlurMaterials[m].uniforms.colorTexture.value=h.texture,this.separableBlurMaterials[m].uniforms.direction.value=Co.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[m]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[m].uniforms.colorTexture.value=this.renderTargetsHorizontal[m].texture,this.separableBlurMaterials[m].uniforms.direction.value=Co.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[m]),t.clear(),this._fsQuad.render(t),h=this.renderTargetsVertical[m];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,u&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(o),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=d}_getSeparableBlurMaterial(t){const i=[];for(let o=0;o<t;o++)i.push(.39894*Math.exp(-.5*o*o/(t*t))/t);return new qn({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new ft(.5,.5)},direction:{value:new ft(.5,.5)},gaussianCoefficients:{value:i}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(t){return new qn({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Co.BlurDirectionX=new ft(1,0);Co.BlurDirectionY=new ft(0,1);const Bu={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class NR extends Uo{constructor(){super(),this.uniforms=Hl.clone(Bu.uniforms),this.material=new CT({name:Bu.name,uniforms:this.uniforms,vertexShader:Bu.vertexShader,fragmentShader:Bu.fragmentShader}),this._fsQuad=new Hm(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,i,o){this.uniforms.tDiffuse.value=o.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Ut.getTransfer(this._outputColorSpace)===Xt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===yy?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Sy?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===My?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Cm?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ty?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===by?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Ey&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const Wu=r=>`./${r.replace(/^\/+/,"")}`,mi={repair:{name:"维修器具",en:"WORKSHOP",color:"#95afa3"},life:{name:"生活用品",en:"EVERYDAY",color:"#d4b77f"},collect:{name:"旧世珍藏",en:"RELICS",color:"#bf9d98"}},aS=r=>({.5:"破损",.75:"磨损",.8:"可用",.9:"良好",1:"近新"})[r]??"未知",DR=r=>r===1?"原装":r===.65?"兼容替代":"仿制纪念品",yo={condition:{name:"外观检查",minutes:4,hint:"寻找三处使用痕迹，确认真实品相。"},function:{name:"功能测试",minutes:8,hint:"启动密闭测试台，检查性能档位。"},authenticity:{name:"编号核验",minutes:12,hint:"对照旧站档案，辨认出厂与维修印记。"}},Fn=[{id:"I01",name:"磁扣工具盒",category:"repair",base:60,sprite:0,imitation:!1,subtitle:"南站维修班 · 制式工具",lore:"内盖刻着历任维修工的名字。盒子传了四双手，最小的那把扳手始终没有离开过它的位置。",appearance:["锁扣边缘被磨得发亮","内衬留下不齐的工具压痕","提手缠过两层旧帆布"],functionClue:["磁扣连续吸合，锁定机构可靠。","磁扣吸力衰减，需要反复按压才能扣牢。"],code:"NS–03 / △",originalClue:"内盖三角维修印与南站第三批目录一致。",alternateClue:"内盖为后配板，维修印来自兼容批次。"},{id:"I02",name:"旧式蓄电池",category:"repair",base:60,sprite:1,imitation:!1,subtitle:"旧陆工厂 · 储能单元",lore:"壳体上还贴着一张褪色的值班表。停电之后，有人用它守过整整一夜的站台信号灯。",appearance:["接线座有暗绿色氧化层","外壳侧面留着旧补胶","底部有搬运留下的擦痕"],functionClue:["密闭测试台显示：容量档位正常。","密闭测试台显示：容量仅余六成，降级可用。"],code:"DL–60 / B14",originalClue:"型号与第十四批出厂记录相符。",alternateClue:"壳体原装，内部为后期兼容储能单元。"},{id:"I03",name:"折叠测距镜",category:"repair",base:120,sprite:2,imitation:!1,subtitle:"铁路测绘所 · 光学仪器",lore:"一块蓝布塞在镜筒缝里，用来挡住风沙。镜片里最后测过的路，如今已经不在地图上。",appearance:["折叠镜架略有歪斜","镜片边缘有细小划痕","校准环上沾着灰白粉末"],functionClue:["标尺在测试轨上准确对齐。","标尺偏移，测距效率下降到六成。"],code:"CL–12 / 7",originalClue:"镜筒校准位与原厂登记编号相合。",alternateClue:"校准环来自民间兼容维修件。"},{id:"I04",name:"黄铜压力表",category:"repair",base:80,sprite:3,imitation:!1,subtitle:"东泵站 · 仪表备件",lore:"铜圈上的小凹痕像一弯月亮。原主人说，那是泵站恢复供水那天，大家太高兴留下的。",appearance:["表盘外圈有月牙压痕","指针轴稍微松动","铜背板的颜色深浅不一"],functionClue:["标准气囊台：偏差在正常范围。","标准气囊台：指针偏差较大，降级可用。"],code:"DB–08 / 22",originalClue:"背面泵站维修印与二十二号档案一致。",alternateClue:"背板是兼容件，原厂封印已被替换。"},{id:"I05",name:"保温水壶",category:"life",base:80,sprite:4,imitation:!1,subtitle:"北线运输队 · 随行物资",lore:"壶底被敲平了两次，仍能稳稳放在桌上。把手缠着蓝布，内侧藏着一个名字的首字。",appearance:["内胆有不规则暗斑","壶盖边缘有细裂纹","蓝色布条包住了提手"],functionClue:["密封台：保温与密封档位正常。","密封台：保温效率下降，仍可使用。"],code:"BX–08 / 41",originalClue:"壶底工厂码与运输队物资目录相符。",alternateClue:"壶底编码来自后期兼容生产批次。"},{id:"I06",name:"长明台灯",category:"life",base:100,sprite:5,imitation:!1,subtitle:"站务室旧藏 · 夜班的光",lore:"开关被一代代夜班人磨得发亮。灯罩内侧写着一句小字：末班车到站，再熄灯。",appearance:["灯罩边缘有一处缺角","开关被手指磨得光滑","底座还粘着半张纸条"],functionClue:["灯光稳定，续航达到原设计档位。","灯光偏暗，续航降至正常的六成。"],code:"ZW–10 / L3",originalClue:"底座线序与站务原装电路图一致。",alternateClue:"底座线序是后配兼容电路。"},{id:"I07",name:"手摇应急电台",category:"life",base:100,sprite:6,imitation:!1,subtitle:"旧陆防务 · 短波接收机",lore:"它陪跑腿员走过三次沙暴。调到最左边的频段，偶尔还能听见远处有人报平安。",appearance:["摇柄握位留下浅浅指痕","天线接口曾经仔细补焊","皮革提手边缘略微起毛"],functionClue:["摇柄转动顺畅，信号指示达到三格。","摇柄空转，信号只能维持一格。"],code:"YL–10 / R09",originalClue:"防拆封签完整，生产批次与旧陆目录吻合。",alternateClue:"封签重贴，接收模块为兼容替代。"},{id:"I08",name:"陶芯滤水壶",category:"life",base:110,sprite:7,imitation:!1,subtitle:"聚落水务 · 家庭净水器",lore:"奶白色的滤芯外套着一只手缝布袋。卖家说孩子把它叫作“小水塔”，从不许别人碰倒。",appearance:["滤芯接口有反复旋拧痕迹","陶壳边缘有轻微磕碰","壶嘴下方积着白色水垢"],functionClue:["封闭检测台：过滤机构正常。","封闭检测台：流量效率下降至六成。"],code:"SW–11 / F6",originalClue:"滤芯封签日期与型号相互匹配。",alternateClue:"滤芯来自登记过的兼容工坊。"},{id:"I09",name:"车站翻页钟",category:"collect",base:90,sprite:8,imitation:!0,subtitle:"旧中央站 · 时间的残页",lore:"它曾挂在第三候车室。最后一班车离开之后，钟没有停，只是再也没人急着看它。",appearance:["翻页纸片有一角缺失","黑色面板已经褪成灰色","玻璃后面落着细细的沙"],functionClue:["翻页顺畅，每一格都准确落位。","翻页机构偶尔卡住，效率下降。"],code:"ZY–09 / T2",originalClue:"纸片字体与中央站原厂印版相同。",alternateClue:"纸片是后期补印，字体与原厂不同。"},{id:"I10",name:"发条鸣鸟",category:"collect",base:75,sprite:9,imitation:!0,subtitle:"旧城百货 · 会唱歌的小东西",lore:"尾巴的蓝漆掉了一半，旋律却还完整。没有人记得歌名，每个听过的人都说有点熟悉。",appearance:["尾部蓝色漆面部分剥落","底座边缘有一条旧焊缝","发条钥匙磨成了亮铜色"],functionClue:["上弦后完整奏出四小节旋律。","旋律断续，发条机构效率下降。"],code:"JC–75 / B5",originalClue:"底板冲压标记与旧城百货目录一致。",alternateClue:"底板为后压，属于复刻生产批次。"},{id:"I11",name:"旧城投影匣",category:"collect",base:150,sprite:10,imitation:!0,subtitle:"城市档案馆 · 一帧往日",lore:"匣子里装着一帧雨天的老街。如今聚落的孩子没见过下雨，却都认得画面里那把红伞。",appearance:["透镜表面有一层薄雾","插槽边缘被反复磨损","匣盖留着档案馆贴纸残片"],functionClue:["旧城街景投射清晰，进片稳定。","投影偏暗，进片偶有停顿。"],code:"DA–15 / P8",originalClue:"胶片序号与八型原装外壳匹配。",alternateClue:"胶片与外壳版本不符，是后配组合。"},{id:"I12",name:"铜轨纪念章盒",category:"collect",base:70,sprite:11,imitation:!0,subtitle:"铁路通车纪念 · 留给后来人",lore:"红绒盒衬换过一次，铜章还留着手心的光。背面刻着通车日期，那条铁路曾经通向海。",appearance:["铜章边缘的齿纹已变浅","盒衬是后来更换的红绒布","铰链附近有一圈油迹"],functionClue:["盒锁及展示机构正常开合。","盒锁松动，展示机构降级可用。"],code:"TL–70 / M1",originalClue:"压印年份与首次通车发行目录吻合。",alternateClue:"压印版式与原年份不符，是后来制作的。"}],ln=r=>Fn.find(t=>t.id===r);function sS(r){return r===6?{x:714,y:362,w:420,h:362}:{x:r%4*362,y:Math.floor(r/4)*362,w:362,h:362}}const Ci=[{id:"lin",name:"林鹭",title:"穿行沙海的跑腿员",sprite:0,preferences:["life","repair"],floor:.7,ask:1.1,budget:1,risk:!1,color:"#b88965",bio:"她记得每条小路，也记得路尽头的人。肩上的包，总比看起来更重一点。",lines:{intro:"门口这只铃铛真好听。你就是新来的店主吧？",revisit:["又碰面啦，我趁下一趟出发前绕过来。","路过南站，给你带了点新消息。"],sell:["这台{item}跟我跑了不少路，给它找个新主人吧。","包里装不下了。{item}，你收不收？"],buy:["下一趟要走得远，我想挑件能靠得住的东西。","找点{category}，好用比好看要紧。"],counter:["这个数，我还不够付今晚的车费呢。","再添一点吧，你知道好东西不常见。","最后这口价了，我真该赶路了。"],deal:["好，就这么定。它跟着你，我放心。","票子收好了。下次有好东西先来找你。"],refuse:["没事，买卖不成，路上见。","那我再背一程，说不定有人正需要。"],noStock:"没找到合适的，明天我再来看看。",inspect:["慢慢看。摇柄的地方是我自己补过的。","有问题问我，别看我记不住那些编号。"],special:"它陪我穿过三次沙暴。卖家说法，你听听就好。"}},{id:"zhou",name:"周砾",title:"南站的老维修工",sprite:1,preferences:["repair"],floor:.78,ask:1.08,budget:1.05,risk:!0,color:"#779b8f",bio:"不爱解释，擅长修复。他总说，零件有脾气，听懂就不难相处。",lines:{intro:"周砾。南站修东西的，有事去机房找我。",revisit:["手头活儿做完了，过来转转。","刚擦过手，不弄脏你柜台。"],sell:["{item}。换下来的，还能用，自己检查。","这件{item}腾出来了，你看着给。"],buy:["要件维修器具，能干活就行。","兼容件也收。标清来路，我自己会判断。"],counter:["太低。材料都不止这个数。","这个价不行，再想想。","最后一次。机房还有活等着。"],deal:["成。说好的数，不改了。","东西拿稳。要修，来找我。"],refuse:["不合适就算了，省得彼此耽误。","行，我带回去。"],noStock:"没合适的零件。我先回机房。",inspect:["测吧。用台子，别拿手碰接头。","看功能，再看编号。两回事。"],special:"原装也有坏的，替代件也有顶用的。"}},{id:"tao",name:"陶叔",title:"公共厨房的掌勺人",sprite:2,preferences:["life","collect"],floor:.68,ask:1.12,budget:1.1,risk:!1,color:"#c8b17c",bio:"掌着六十个人的饭勺，也记着六十个人的口味。他不愿意浪费任何东西。",lines:{intro:"小店主，叫我陶叔就成。饿了来厨房。",revisit:["趁锅里慢炖着，出来走动走动。","又来叨扰你了，今天生意怎么样？"],sell:["收拾库房找到的{item}，放着怪可惜。","{item}还挺好，给需要的人用吧。"],buy:["厨房缺点生活用品，耐用最要紧。","想找件{category}，用得顺手就好。"],counter:["再商量商量，厨房的预算紧呀。","这个数，叔心里还有点舍不得。","就到这儿吧，汤可不能熬过了。"],deal:["好，好。东西总算找着用处了。","说定了。晚上来喝碗热汤。"],refuse:["没关系，生意不急这一回。","那就先放着，回头再说。"],noStock:"不凑合，叔改天再来。",inspect:["细看是好事，做饭也得看火候。","后来配的地方，你都给我标清楚。"],special:"我买的是能亮一晚的灯，不是墙上的影子。"}},{id:"wen",name:"闻苇",title:"为旧世界做注的人",sprite:3,preferences:["collect","repair"],floor:.8,ask:1.22,budget:1.15,risk:!1,color:"#8ca8ad",bio:"随身带着卡片簿，正在整理一座不再存在的城市。她相信记得也是一种修复。",lines:{intro:"我是闻苇，在整理车站旧档案。很高兴这里又亮灯了。",revisit:["上回的条目补好了，顺便来看看。","又有一页空白等着填，今天有新东西吗？"],sell:["这件{item}有重复藏品，愿意转给你。","{item}的出身值得记，你先看实物。"],buy:["想找件编号清楚的旧物，版本很重要。","今天在查{category}的目录，有合适的吗？"],counter:["这个价格，还没有把完整性算进去。","我理解你的考量，但得再接近一些。","这是最后的余地，我不急着出手。"],deal:["谢谢。它的故事会留在档案里。","成交。我会记下今天的日期。"],refuse:["没关系，好的去处值得等一等。","那留给下一位有缘的人吧。"],noStock:"没有合适的版本。我下次再来。",inspect:["编号和功能要分别看，别被外壳带偏。","这里有一处细节，目录上恰好有。"],special:"我记录旧物，不代表我相信每一个故事。"}},{id:"que",name:"鹊姐",title:"跟着商队来的掮客",sprite:4,preferences:["collect","life"],floor:.82,ask:1.25,budget:.95,risk:!1,color:"#b18381",bio:"敲两下柜台是她的习惯。她谈价寸步不让，谈好的事却从不失约。",lines:{intro:"鹊姐。商队过路，顺便认识一下新邻居。",revisit:["又见面了，看看你有没有练出眼力。","商队还没走，咱们再做一笔？"],sell:["这件{item}，路上已经有人问过价了。","给你先看{item}，别让我白跑一趟。"],buy:["找点好转手的{category}，你的货架呢？","我不靠故事吃饭，拿实物出来说。"],counter:["这可不叫还价，这叫让我做慈善。","再往中间走一步，别兜圈子。","最后一口，大家都省点时间。"],deal:["痛快。说定的事，鹊姐从不反悔。","成交。票子当面点，交情慢慢处。"],refuse:["眼光不同，各走各的路。","好，改天再做买卖。"],noStock:"今天的货不对路，回见。",inspect:["尽管查。做生意，明白比好听重要。","这点时间我等得起，别光听故事。"],special:"价钱明着谈，来路写清楚，咱们就能长久。"}},{id:"kou",name:"阿扣",title:"总有新点子的杂工",sprite:5,preferences:["repair","life","collect"],floor:.62,ask:1.05,budget:.9,risk:!0,color:"#b4a482",bio:"成年以后接过的第一份活，是把站台的钟修好。修没修好另说，他从不轻易放弃。",lines:{intro:"我叫阿扣，什么活都接。你这儿缺帮手吗？",revisit:["又是我！今天捡到个有意思的东西。","活干完啦，过来看看你的新货。"],sell:["{item}，我本来想留着自己研究的。","这件{item}你看看，我保证没乱拆。"],buy:["想挑件{category}，不过我口袋不太鼓。","不确定的也行，标出来让我自己选。"],counter:["再高一点？我就能把欠的饭钱还上。","差一点点，真的就一点点。","最后一次啦，我得去接活了。"],deal:["成交！我就知道能谈成。","谢啦，回头帮你把门轴上点油。"],refuse:["好吧，我先抱回去研究。","没事，下回再来碰运气。"],noStock:"没有合适的呀，那我先去干活。",inspect:["这个我没试过，你测测看？","编号不认识。我只知道它能不能动。"],special:"旧的也有旧的好嘛，修修还能陪人很久。"}}],Gi=r=>Ci.find(t=>t.id===r),bp=[["风从旧站台吹来","灰线旧货铺重新亮灯了。先做一笔踏实的生意，让这间屋子慢慢热闹起来。"],["有人记住了你的招牌","商队带来了新的消息。注意今日行情，手里的旧物，也许正是别人缺少的东西。"],["第一张租金单","今晚需支付 90 票租金。别把所有现金压在货架上；门口的社区委托也能帮上忙。"],["沙尘里的午后","午后有一场小沙尘，来客会带着满身风沙。好在灯还亮着，热水也还有。"],["旧物找到了新家","聚落开始习惯来这里找东西。每一件诚实标注的商品，都让招牌多一分可信。"],["最后一班商队","商队明天清早出发。留意货架上的珍藏，路过的人，也许会愿意带它们走远一点。"],["为明天留一盏灯","七日试营业的最后一天。结清 210 票租金，留足 120 票周转金，让故事继续。"]],UR={uniforms:{tDiffuse:{value:null},time:{value:0},texel:{value:new ft(.001,.001)}},vertexShader:"varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",fragmentShader:`uniform sampler2D tDiffuse; uniform float time; uniform vec2 texel; varying vec2 vUv;
    void main(){
      float edge=pow(abs(vUv.y-0.5)*2.0,4.0);
      vec2 d=texel*edge*1.3;
      vec4 col=texture2D(tDiffuse,vUv)*0.6;
      col+=texture2D(tDiffuse,vUv+vec2(d.x,d.y))*0.1;
      col+=texture2D(tDiffuse,vUv-vec2(d.x,d.y))*0.1;
      col+=texture2D(tDiffuse,vUv+vec2(-d.x,d.y))*0.1;
      col+=texture2D(tDiffuse,vUv+vec2(d.x,-d.y))*0.1;
      float vignette=1.0-smoothstep(0.28,0.8,length((vUv-0.5)*vec2(0.85,1.)))*0.25;
      float grain=fract(sin(dot(vUv+time*.0001,vec2(12.9898,78.233)))*43758.5453)-.5;
      gl_FragColor=vec4(col.rgb*vignette+grain*.012,1.0);
    }`};function LR(r){const t=dt.useRef(null),i=dt.useRef(r);i.current=r;const[o,l]=dt.useState(!1);return dt.useEffect(()=>{const u=t.current;if(!u)return;let d;try{d=new MR({antialias:!1,alpha:!1,powerPreference:"low-power"})}catch{l(!0);return}let h=!1;d.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),d.outputColorSpace=ei,d.toneMapping=Cm,d.toneMappingExposure=1.12,d.setClearColor("#262a23"),d.domElement.setAttribute("aria-label","HD-2D 灰线旧货铺场景，人物与旧物立于暖光柜台前"),d.domElement.setAttribute("role","img"),u.appendChild(d.domElement);const m=new MT,v=new sf(-8,8,4.5,-4.5,.1,60);v.position.set(0,0,18),v.lookAt(0,0,0);const x=new LT,g=[];function S(Ne){const ze=x.load(Ne,void 0,void 0,()=>{h||l(!0)});return ze.colorSpace=ei,ze.magFilter=Ni,ze.minFilter=ji,g.push(ze),ze}const y=S(Wu("art/shop.png")),T=S(Wu("art/characters.png")),C=S(Wu("art/items.png"));function E(Ne,ze,ke,De,at,Ge){const ot=new kl(Ne,ze),gt=new pi(ot,ke);return gt.position.set(De,at,Ge),m.add(gt),g.push(ot,ke),gt}E(16.35,9.2,new xo({map:y}),0,0,-3);const M=y.clone();M.repeat.set(1,.22),M.offset.set(0,0),g.push(M),E(16.35,9.2*.22,new xo({map:M,transparent:!1}),0,-9.2*.39,2),m.add(new BT("#ffe2b9",2.3));const O=new IT("#ffe0a3",2.1);O.position.set(-7,4,6),m.add(O);const I=new zT("#ffad48",18,9,2);I.position.set(5.6,-1.6,4),m.add(I);const D=T.clone();D.repeat.set(1/6,1),g.push(D);const V=E(4.7,9.4,new mp({map:D,transparent:!0,alphaTest:.18,roughness:1,metalness:0,side:oa}),-2.5,-1.3,.4),H=new pi(new Pm(1.25,32),new xo({color:"#1a100a",transparent:!0,opacity:.25,depthWrite:!1}));H.scale.y=.16,H.position.set(-2.5,-3.3,.35),m.add(H),g.push(H.geometry,H.material);const z=[],X=[];for(let Ne=0;Ne<9;Ne++){const ze=C.clone();ze.repeat.set(.25,1/3),g.push(ze),X.push(ze);const ke=new mp({map:ze,transparent:!0,alphaTest:.12,roughness:.9,metalness:.05}),De=E(Ne===8?2.1:.93,Ne===8?2.1:.93,ke,Ne===8?.6:.85+Ne%4*1.02,Ne===8?-2.45:Ne<4?1.24:-.46,Ne===8?2.1:-2.4);z.push(De)}const w=new mp({color:"#b8813f",metalness:.75,roughness:.4}),N=new pi(new No(7,.022,.08),w);N.position.set(.2,-3.43,2.2),m.add(N),g.push(N.geometry,w);const B=new Yi,k=55,le=new Float32Array(k*3);for(let Ne=0;Ne<k;Ne++)le[Ne*3]=Math.sin(Ne*79.31)*8,le[Ne*3+1]=Math.cos(Ne*33.1)*4.5,le[Ne*3+2]=Math.sin(Ne)*2;B.setAttribute("position",new qi(le,3));const pe=new Yy({color:"#ffdf9c",size:.025,transparent:!0,opacity:.42,depthWrite:!1}),fe=new AT(B,pe);m.add(fe),g.push(B,pe);const q=new CR(d);q.addPass(new RR(m,v));const se=new Co(new ft(800,450),.19,.45,.85);q.addPass(se);const W=new iS(UR);q.addPass(W);const xe=new NR;q.addPass(xe);let Se=0,Pe=0;function Je(){Se=u.clientWidth,Pe=u.clientHeight,d.setSize(Se,Pe),q.setSize(Se,Pe);const Ne=Se/Pe,ze=Ne>16/9?8:4.5*Ne,ke=Ne>16/9?8/Ne:4.5;v.left=-ze,v.right=ze,v.top=ke,v.bottom=-ke,v.updateProjectionMatrix(),W.uniforms.texel.value.set(1/Se,1/Pe)}const xt=new ResizeObserver(Je);xt.observe(u),Je();let F=0,he=0;function ee(Ne){const ze=u.getBoundingClientRect();F=(Ne.clientX-ze.left)/ze.width-.5,he=(Ne.clientY-ze.top)/ze.height-.5}function re(){F=0,he=0}u.addEventListener("pointermove",ee),u.addEventListener("pointerleave",re);const Ee=new Qy;let we=0,Q="",de=0;function je(){if(we=requestAnimationFrame(je),document.hidden)return;const Ne=i.current,ze=Ee.getElapsedTime();pe.opacity=Ne.day===4?.58:.35;const ke=Ne.npc?Gi(Ne.npc).sprite:0;Q!==Ne.npc&&(Q=Ne.npc??"",de=ze),V.visible=!!Ne.npc,H.visible=!!Ne.npc,D.offset.set(ke/6,0);const De=Ne.reducedMotion?1:Math.min(1,(ze-de)*1.8),at=Ne.active?-2.7:-3.1;V.position.x=at-(1-De)*3,V.position.y=(Ne.active?-1.3:-.6)+(Ne.reducedMotion?0:Math.sin(ze*1.8)*.018),V.scale.setScalar(Ne.active?Math.min(1,(v.top+1.2)/4.7):Math.min(.64,(v.top+.5)/4.7)),V.position.z=Ne.active?.6:-.3,H.position.x=V.position.x;const Ge=Ne.inventory.filter(gt=>gt.displayed);for(let gt=0;gt<9;gt++){const Ft=gt===8?Ne.item:Ge[gt],U=z[gt];if(U.visible=!!Ft,Ft){const A=sS(ln(Ft.defId).sprite);X[gt].repeat.set(A.w/1448,A.h/1086),X[gt].offset.set(A.x/1448,1-(A.y+A.h)/1086);const ie=Math.max(A.w,A.h);U.scale.set(A.w/ie,A.h/ie,1)}}const ot=Ne.minute/360;d.toneMappingExposure=1.1-ot*.15,I.intensity=18+(Ne.reducedMotion?0:Math.sin(ze*3)*.5),Ne.reducedMotion?(v.position.set(0,0,18),v.lookAt(0,0,0)):(v.position.x+=(F*.2-v.position.x)*.025,v.position.y+=(-he*.12-v.position.y)*.025,v.lookAt(0,0,0),fe.position.y=ze*.025%3,fe.position.x=Math.sin(ze*.08)*.2),W.uniforms.time.value=Ne.reducedMotion?0:ze,q.render()}je();const P=Ne=>{Ne.preventDefault(),h||l(!0)};return d.domElement.addEventListener("webglcontextlost",P),()=>{h=!0,cancelAnimationFrame(we),xt.disconnect(),u.removeEventListener("pointermove",ee),u.removeEventListener("pointerleave",re),d.domElement.removeEventListener("webglcontextlost",P);for(const Ne of g)Ne.dispose();q.dispose(),se.dispose(),W.dispose(),xe.dispose(),d.dispose(),d.domElement.remove()}},[]),p.jsx("div",{ref:t,className:`shop-render ${o?"fallback":""}`,children:o&&p.jsxs(p.Fragment,{children:[p.jsx("div",{className:"fallback-room"}),r.npc&&p.jsx("div",{className:"fallback-person",style:{backgroundPositionX:`${Gi(r.npc).sprite*20}%`}}),r.item&&p.jsx("div",{className:"fallback-item item-sprite",style:{backgroundPosition:`${ln(r.item.defId).sprite%4*100/3}% ${Math.floor(ln(r.item.defId).sprite/4)*50}%`}})]})})}const xm=[{name:"旧铜线",category:"repair"},{name:"搪瓷杯",category:"life"},{name:"旧站车票",category:"collect"},{name:"齿轮零件",category:"repair"},{name:"棉布手套",category:"life"},{name:"褪色明信片",category:"collect"}],OR=()=>({condition:!0,function:!0,authenticity:!0});function zR(r){let t=2166136261;for(const i of r)t=Math.imul(t^i.charCodeAt(0),16777619);return t>>>0||1}function lr(r){let t=r.rng;return t^=t<<13,t^=t>>>17,t^=t<<5,r.rng=t>>>0,r.rng/4294967296}function vs(r,t){return t[Math.floor(lr(r)*t.length)]}function Ss(r,t){const i=ln(r.defId);return Math.max(5,Math.floor(i.base*r.condition*r.function*r.authenticity*t[i.category]+.5+1e-9))}function ef(r,t){const i=ln(r.defId),o=i.base*(r.revealed.condition?r.condition:r.claimed.condition)*(r.revealed.function?r.function:r.claimed.function)*(r.revealed.authenticity?r.authenticity:r.claimed.authenticity)*t[i.category],l=Object.values(r.revealed).every(Boolean);return{center:o,exact:l,low:Math.max(5,Math.floor(o*.7+.5)),high:Math.max(5,Math.floor(o*1.3+.5)),price:Ss(r,t)}}function dr(r){var t;return((t=r.trade)==null?void 0:t.role)==="seller"?r.trade.item:r.inventory.find(i=>{var o;return i.uid===((o=r.trade)==null?void 0:o.selected)})}function tf(r){if(!r.trade||r.trade.role!=="buyer")return[];const t=Gi(r.trade.npc);return r.inventory.filter(i=>i.displayed&&ln(i.defId).category===r.trade.category&&(i.revealed.authenticity||i.riskLabel&&t.risk))}function rS(r,t){if(!r.trade)return 0;const i=Gi(r.trade.npc),o=Ss(t,r.market);return r.trade.role==="seller"?Math.ceil(o*i.floor-1e-9):Math.floor(o*i.budget*(t.revealed.authenticity?1:.8)+1e-9)}const ym=r=>`${String(10+Math.floor(r/60)).padStart(2,"0")}:${String(r%60).padStart(2,"0")}`,go=r=>r===3?90:r===7?210:0,Un=r=>360-r.minute;function Sm(r){var t;return(t=r.trade)!=null&&t.locked?Un(r)<6?"剩余营业时间不足 6 分钟":r.trade.role==="seller"&&r.cash<r.trade.price?"现金不足，不能完成收购":r.trade.role==="seller"&&r.inventory.length>=12?"库存已满，需要一个空格":dr(r)?"":"商品已不在柜台":"请先谈定价格"}function So(r,t,i,o,l,u=0,d=!1){return{uid:`item-${r.nextId++}`,defId:t,condition:i,function:o,authenticity:l,cost:u,displayed:d,riskLabel:!1,listPrice:0,claimed:{condition:.9,function:1,authenticity:1},revealed:d?OR():{condition:!1,function:!1,authenticity:!1}}}function oS(r){r.minute=0,r.cursor=0,r.trade=null,r.report=null,r.phase="open",r.commission="available",r.sorted=[],r.recycled=0,r.inspection=null;const t=[1.15,1,.85];for(let l=t.length-1;l>0;l--){const u=Math.floor(lr(r)*(l+1));[t[l],t[u]]=[t[u],t[l]]}r.market=r.day===1?{repair:1,life:1,collect:1}:{repair:t[0],life:t[1],collect:t[2]};const i=Ci.flatMap(l=>[l.id,l.id]);r.queue=[];const o=r.day===1?["lin","tao","zhou"]:[];for(const l of o)r.queue.push(l),i.splice(i.indexOf(l),1);for(;r.queue.length<(r.day===1?6:8);){const l=Math.floor(lr(r)*i.length);r.queue.push(i.splice(l,1)[0])}r.notice=r.day===1?"瓶盖门铃响了。第一位客人已经等在门边。":`第 ${r.day} 天，开门营业。今日行情已更新。`}function Zu(r="TUTORIAL-001"){const t={version:1,seed:r,rng:zR(r),day:1,minute:0,cash:180,reputation:50,sold:0,phase:"open",inventory:[],market:{repair:1,life:1,collect:1},queue:[],cursor:0,trade:null,ledger:[],report:null,commission:"available",sorted:[],recycled:0,inspection:null,discovered:["I01","I05","I06"],notice:"",nextId:1};t.inventory=[So(t,"I01",.8,1,1,25,!0),So(t,"I05",.75,1,1,35,!0),So(t,"I06",.9,1,1,55,!0)];for(const i of t.inventory)i.listPrice=Math.round(Ss(i,t.market)*1.1);return oS(t),t}function Dl(r,t,i,o,l,u){r.cash+=o,r.ledger.push({id:r.nextId++,day:r.day,minute:r.minute,kind:t,label:i,amount:o,cost:l,risk:u})}function gn(r,t){return r.notice=t,r}function Fu(r,t){return r.trade=null,r.inspection=null,r.cursor++,(r.minute>=360||r.cursor>=r.queue.length)&&(r.phase="closing"),gn(r,t)}function fy(r,t,i){return r.replaceAll("{item}",t).replaceAll("{category}",mi[i].name)}function dy(r,t){const i=r.trade,o=tf(r).find(l=>l.uid===t);!o||i.locked||(i.selected=t,i.price=i.offers[t]??Math.floor(rS(r,o)*.78),i.offers[t]=i.price)}function Mm(r,t){const i=dr(r);if(!i||!r.trade||r.trade.offended)return!1;const o=r.trade.role==="seller"?Math.min(t,r.trade.price):Math.max(t,r.trade.price),l=ef(i,r.market).center;return r.trade.role==="seller"?o<l*.35:o>l*1.8}function PR(r,t){var o,l,u,d,h,m,v,x,g,S;const i=structuredClone(r);if(i.phase==="ending")return r;if(t.type==="BACK")return i.phase==="closing"&&i.minute<360&&(i.phase="open"),i;if(t.type==="NEXT")return i.phase!=="report"?r:i.outcome||i.day===7?(i.phase="ending",i):(i.day++,oS(i),i);if(t.type==="SETTLE"){if(i.phase!=="closing")return r;if(i.inspection||i.commission==="active")return gn(i,"请先完成进行中的鉴定或委托。");i.trade&&Fu(i,"打烊了，客人向你道别。");const y=i.ledger.filter(C=>C.day===i.day),T={day:i.day,income:y.filter(C=>C.amount>0).reduce((C,E)=>C+E.amount,0),purchases:-y.filter(C=>C.kind==="purchase").reduce((C,E)=>C+E.amount,0),gross:y.filter(C=>C.kind==="sale").reduce((C,E)=>C+E.amount-(E.cost??0),0),fees:0,cash:i.cash,missing:0};for(const[C,E,M]of[["supplies","每日耗材",15],["rent",`第 ${i.day} 天租金`,go(i.day)]])if(M){if(i.cash<M){T.missing=M-i.cash,i.outcome="bankrupt";break}Dl(i,C,E,-M),T.fees+=M}return T.cash=i.cash,i.report=T,!i.outcome&&i.day===7&&(i.outcome=i.cash>=120&&i.reputation>=40&&i.sold>=12?"win":"survive"),i.phase="report",i}if(i.phase!=="open")return r;if(t.type==="CLOSE")return i.inspection||i.commission==="active"?gn(i,"先完成手头的鉴定或分拣，再打烊吧。"):(i.phase="closing",i);if(t.type==="ARRIVE"){if(i.trade||i.inspection||i.commission==="active"||i.cursor>=i.queue.length)return r;if(Un(i)<6)return gn(i,"剩余时间不足以接待新客人，可以打烊了。");i.minute+=6;const y=Gi(i.queue[i.cursor]),T=i.cursor%2===0?"seller":"buyer",C=i.queue.slice(0,i.cursor).includes(y.id);i.trade={id:`trade-${i.nextId++}`,npc:y.id,role:T,category:vs(i,y.preferences),price:0,rounds:0,locked:!1,offended:!1,offers:{},line:"",repeat:C};const E=i.trade;if(T==="seller"){let O;if(i.day===1&&i.cursor===0)O=So(i,"I07",.9,1,1);else if(i.day===1&&i.cursor===2)O=So(i,"I02",.8,.6,1),O.claimed.condition=1;else{const I=vs(i,Fn),D=lr(i),V=D<.7?1:D<.9||!I.imitation?.65:.3,H=lr(i),z=H<.1?.5:H<.3?.75:H<.6?.8:H<.85?.9:1;O=So(i,I.id,z,lr(i)<.8?1:.6,V)}E.item=O,E.category=ln(O.defId).category,E.price=Math.ceil(Ss(O,i.market)*y.ask-1e-9),E.line=fy(vs(i,y.lines.sell),ln(O.defId).name,E.category),i.discovered.includes(O.defId)||i.discovered.push(O.defId)}else{const O=i.inventory.filter(D=>D.displayed&&(D.revealed.authenticity||y.risk&&D.riskLabel));E.category=i.day===1&&i.cursor===1?"life":O.length&&lr(i)<.7?ln(vs(i,O).defId).category:vs(i,Object.keys(mi)),E.line=fy(vs(i,y.lines.buy),"",E.category);const I=tf(i);I.length&&dy(i,I[0].uid)}const M=C?vs(i,y.lines.revisit):i.day===1?y.lines.intro:"";return gn(i,M||E.line)}if(t.type==="SELECT")return((o=i.trade)==null?void 0:o.role)==="buyer"&&!i.inspection&&dy(i,t.uid),i;if(t.type==="START_CHECK"){if(i.inspection||i.commission==="active"||(l=i.trade)!=null&&l.locked)return r;const y=((d=(u=i.trade)==null?void 0:u.item)==null?void 0:d.uid)===t.uid?i.trade.item:i.inventory.find(T=>T.uid===t.uid);return!y||y.revealed[t.check]?r:Un(i)<yo[t.check].minutes?gn(i,"营业时间不足，无法开始这项检查。"):(i.minute+=yo[t.check].minutes,i.trade&&(i.trade.line=Gi(i.trade.npc).lines.inspect[t.check==="authenticity"?1:0]),i.inspection={uid:y.uid,check:t.check,progress:0},i)}if(t.type==="CHECK_STEP"){const y=i.inspection;if(!y)return r;if(y.progress++,y.progress>=(y.check==="condition"?3:1)){const T=((m=(h=i.trade)==null?void 0:h.item)==null?void 0:m.uid)===y.uid?i.trade.item:i.inventory.find(C=>C.uid===y.uid);return T&&(T.revealed[y.check]=!0),i.inspection=null,i.minute>=360&&(i.phase="closing"),gn(i,`${yo[y.check].name}完成。证据已记入物品档案。`)}return i}if(t.type==="OFFER"||t.type==="ACCEPT"){const y=i.trade,T=dr(i);if(!y||!T||y.locked||i.inspection||y.rounds>=3)return r;if(Un(i)<10)return gn(i,"报价和交割共需至少 10 分钟。");const C=t.type==="ACCEPT"?y.price:t.price;if(!Number.isFinite(C)||C<1||!Number.isInteger(C))return gn(i,"请输入大于零的整数价格。");const E=y.role==="seller"?Math.min(C,y.price):Math.max(C,y.price);if(t.type==="OFFER"&&Mm(i,E)&&!t.acknowledge)return r;t.type==="OFFER"&&Mm(i,E)&&(i.reputation=Math.max(0,i.reputation-2),y.offended=!0),i.minute+=4,y.rounds++;const M=rS(i,T),O=Gi(y.npc);return t.type==="ACCEPT"||(y.role==="seller"?E>=M:E<=M)?(y.price=E,y.locked=!0,y.line="价钱谈妥了。确认交割后，票子和旧物才会易手。",gn(i,`双方同意 ${E} 票。请确认交割。`)):y.rounds===3?Fu(i,`${O.name}：${O.lines.refuse[0]}（三轮报价结束）`):(y.price=y.role==="seller"?Math.ceil((y.price+M)/2):Math.floor((y.price+M)/2),y.selected&&(y.offers[y.selected]=y.price),y.line=O.lines.counter[y.rounds-1],gn(i,`${O.name}还价 ${y.price} 票。`))}if(t.type==="DELIVER"){const y=i.trade;if(!y||y.id!==t.tradeId||!y.locked)return r;const T=Sm(i);if(T)return gn(i,T);const C=dr(i),E=ln(C.defId).name;i.minute+=6,y.role==="seller"?(C.cost=y.price,C.listPrice=Math.round(Ss(C,i.market)*1.1),C.displayed=!1,i.inventory.push(C),Dl(i,"purchase",`收购 · ${E}`,-y.price)):(i.inventory=i.inventory.filter(O=>O.uid!==C.uid),i.sold++,Object.values(C.revealed).every(Boolean)&&(i.reputation=Math.min(100,i.reputation+1)),Dl(i,"sale",`出售 · ${E}`,y.price,C.cost,!C.revealed.authenticity));const M=`${Gi(y.npc).name}：${vs(i,Gi(y.npc).lines.deal)}`;return Fu(i,M)}if(t.type==="DISMISS"){if(!i.trade||i.inspection)return r;const y=Gi(i.trade.npc).name;return i.minute=Math.min(360,i.minute+2),Fu(i,`${y}收好行囊，向你道别。没有成交，也没有信誉损失。`)}if(t.type==="DISPLAY"){const y=i.inventory.find(T=>T.uid===t.uid);return!y||((v=i.trade)==null?void 0:v.selected)===y.uid||((x=i.inspection)==null?void 0:x.uid)===y.uid?r:y.displayed?(y.displayed=!1,gn(i,"已移回仓库。")):i.inventory.filter(T=>T.displayed).length>=8?gn(i,"8 个陈列位已满，请先撤下一件商品。"):!y.revealed.authenticity&&!t.riskLabel?gn(i,"请先核验编号，或明确使用“未核验”标签。"):(y.riskLabel=!y.revealed.authenticity,y.displayed=!0,gn(i,`已上架${y.riskLabel?"，标签：未核验":"，标签与已知属性一致"}。`))}if(t.type==="PRICE"){const y=i.inventory.find(T=>T.uid===t.uid);return y&&Number.isInteger(t.price)&&t.price>0&&((g=i.trade)==null?void 0:g.selected)!==y.uid&&(y.listPrice=t.price),i}if(t.type==="RECYCLE"){if(i.recycled>=2||Un(i)<6||i.inspection||i.commission==="active")return r;const y=i.inventory.find(C=>C.uid===t.uid);if(!y||((S=i.trade)==null?void 0:S.selected)===y.uid)return r;i.inventory=i.inventory.filter(C=>C.uid!==y.uid),i.minute+=6,i.recycled++;const T=Math.floor(Ss(y,i.market)*.35);return Dl(i,"recycle",`回收 · ${ln(y.defId).name}`,T,y.cost),i.minute>=360&&(i.phase="closing"),gn(i,`回收箱入账 ${T} 票。回收不计入售出成绩。`)}if(t.type==="COMMISSION")return i.trade||i.inspection||i.commission!=="available"||Un(i)<90?r:(i.minute+=90,i.commission="active",i.sorted=[],gn(i,"将六件物资分入对应类别，完成可得 40 票。"));if(t.type==="SORT"||t.type==="SORT_ALL"){if(i.commission!=="active")return r;if(t.type==="SORT_ALL")i.sorted=xm.map((y,T)=>T);else{const y=xm[t.index];if(!y||y.category!==t.category)return gn(i,"再想一想，这件物资更适合另一个类别。不会扣钱或信誉。");i.sorted.includes(t.index)||i.sorted.push(t.index)}return i.sorted.length===6?(i.commission="done",Dl(i,"commission","社区分拣委托",40),i.minute>=360&&(i.phase="closing"),gn(i,"分拣完成！社区支付了 40 票报酬。")):i}return r}const Ku="greyline-save-v1";function lS(r){var t,i;if(!r)return null;try{let o=function(m){return!!m&&typeof m.uid=="string"&&Fn.some(v=>v.id===m.defId)&&!!m.claimed&&!!m.revealed&&h(m.condition,[.5,.75,.8,.9,1])&&h(m.function,[.6,1])&&h(m.authenticity,[.3,.65,1])&&h(m.claimed.condition,[.5,.75,.8,.9,1])&&h(m.claimed.function,[.6,1])&&h(m.claimed.authenticity,[.3,.65,1])&&["condition","function","authenticity"].every(v=>typeof m.revealed[v]=="boolean")&&d(m.cost,0)&&d(m.listPrice,0)&&typeof m.displayed=="boolean"&&typeof m.riskLabel=="boolean"};const l=JSON.parse(r),u=["open","closing","report","ending"],d=(m,v,x=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(m)&&m>=v&&m<=x,h=(m,v)=>v.includes(m);if(l.version!==1||typeof l.seed!="string"||!d(l.day,1,7)||!u.includes(l.phase)||!d(l.cash,0)||!d(l.reputation,0,100)||!d(l.sold,0,54)||!d(l.minute,0,360)||!Array.isArray(l.inventory)||l.inventory.length>12||!l.inventory.every(o)||new Set(l.inventory.map(m=>m.uid)).size!==l.inventory.length||!Array.isArray(l.ledger)||!l.ledger.every(m=>m&&d(m.id,1)&&d(m.day,1,7)&&d(m.minute,0,360)&&Number.isSafeInteger(m.amount)&&typeof m.label=="string"&&["purchase","sale","commission","recycle","supplies","rent"].includes(m.kind)&&(m.cost===void 0||d(m.cost,0)))||!Array.isArray(l.queue)||l.queue.length!==(l.day===1?6:8)||!l.queue.every(m=>Ci.some(v=>v.id===m))||!d(l.cursor,0,l.queue.length)||!l.market||!["repair","life","collect"].every(m=>h(l.market[m],[.85,1,1.15]))||!Array.isArray(l.sorted)||!l.sorted.every(m=>d(m,0,5))||new Set(l.sorted).size!==l.sorted.length||!["available","active","done"].includes(l.commission)||!d(l.recycled,0,2)||!Array.isArray(l.discovered)||!l.discovered.every(m=>Fn.some(v=>v.id===m))||!d(l.nextId,1)||!d(l.rng,0,4294967295)||typeof l.notice!="string")return null;if(l.trade){const m=l.trade;if(!Ci.some(v=>v.id===m.npc)||!["seller","buyer"].includes(m.role)||!Object.hasOwn(mi,m.category)||typeof m.id!="string"||typeof m.line!="string"||typeof m.locked!="boolean"||typeof m.offended!="boolean"||!m.offers||!Object.values(m.offers).every(v=>d(v,0))||!d(m.price,0)||!d(m.rounds,0,3)||m.role==="seller"&&!o(m.item)||m.selected&&!l.inventory.some(v=>v.uid===m.selected))return null}return l.inspection&&(!Object.hasOwn(yo,l.inspection.check)||!d(l.inspection.progress,0,l.inspection.check==="condition"?2:0)||!(((i=(t=l.trade)==null?void 0:t.item)==null?void 0:i.uid)===l.inspection.uid||l.inventory.some(m=>m.uid===l.inspection.uid)))||l.outcome&&!["win","survive","bankrupt"].includes(l.outcome)||l.report&&!["day","income","purchases","gross","fees","cash","missing"].every(m=>Number.isSafeInteger(l.report[m]))||l.phase==="report"&&!l.report||l.phase==="ending"&&!l.outcome?null:l}catch{return null}}function ur({id:r,className:t=""}){const i=sS(ln(r).sprite),o=dt.useId();return p.jsx("span",{role:"img","aria-label":ln(r).name,className:`item-sprite ${t}`,children:p.jsxs("svg",{"aria-hidden":"true",viewBox:`${i.x} ${i.y} ${i.w} ${i.h}`,preserveAspectRatio:"xMidYMid meet",children:[p.jsx("defs",{children:p.jsx("clipPath",{id:o,children:p.jsx("rect",{x:i.x,y:i.y,width:i.w,height:i.h})})}),p.jsx("image",{href:Wu("art/items.png"),width:"1448",height:"1086",clipPath:`url(#${o})`})]})})}function cS({index:r,className:t=""}){return p.jsx("span",{"aria-hidden":"true",className:`portrait ${t}`,style:{backgroundPositionX:`${r*20}%`}})}function wi({amount:r}){return p.jsxs("span",{className:"money",children:[r.toLocaleString(),p.jsx("small",{children:"票"})]})}function hi({title:r,subtitle:t,children:i,onClose:o,wide:l=!1,dismissible:u=!0}){const d=dt.useRef(null),h=dt.useRef(o);return h.current=o,dt.useEffect(()=>{var x;const m=document.activeElement;(x=d.current)==null||x.focus();function v(g){var S;if(g.key==="Escape"&&u&&(g.stopPropagation(),h.current()),g.key==="Tab"){const y=Array.from(((S=d.current)==null?void 0:S.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]'))??[]),T=y[0],C=y[y.length-1];g.shiftKey&&(document.activeElement===T||document.activeElement===d.current)?(g.preventDefault(),C==null||C.focus()):!g.shiftKey&&document.activeElement===C&&(g.preventDefault(),T==null||T.focus())}}return document.addEventListener("keydown",v),()=>{document.removeEventListener("keydown",v),m==null||m.focus()}},[u]),p.jsx("div",{className:"modal-backdrop",onMouseDown:m=>{m.target===m.currentTarget&&u&&o()},children:p.jsxs("div",{ref:d,tabIndex:-1,role:"dialog","aria-modal":"true","aria-label":r,className:`modal ${l?"modal-wide":""}`,children:[p.jsxs("header",{className:"modal-heading",children:[p.jsxs("div",{children:[p.jsx("span",{className:"eyebrow",children:t??"GREYLINE TRADING POST"}),p.jsx("h2",{children:r})]}),u&&p.jsx("button",{className:"icon-button","aria-label":"关闭窗口",onClick:o,children:p.jsx(Hu,{size:22})})]}),p.jsx("div",{className:"modal-content",children:i})]})})}function Gm({item:r,state:t}){const i=ef(r,t.market);return p.jsxs("div",{className:"valuation",children:[p.jsxs("div",{children:[p.jsx("span",{children:i.exact?"今日参考价值":"当前估值区间"}),p.jsx("span",{className:i.exact?"verified-text":"",children:i.exact?p.jsxs(p.Fragment,{children:[p.jsx(bm,{size:12})," 已核验"]}):"未经完整验证"})]}),p.jsxs("strong",{children:[i.exact?i.price:`${i.low} – ${i.high}`,p.jsx("small",{children:"票"})]}),!i.exact&&p.jsx("p",{children:"检查实物，缩小信息差。故事不等于证据。"})]})}function Vm({item:r}){return p.jsxs("div",{className:"evidence-list",children:[p.jsxs("div",{children:[p.jsx("span",{children:"品相"}),p.jsx("b",{className:r.revealed.condition?"":"unknown",children:r.revealed.condition?aS(r.condition):"待检查"})]}),p.jsxs("div",{children:[p.jsx("span",{children:"功能"}),p.jsx("b",{className:r.revealed.function?"":"unknown",children:r.revealed.function?r.function===1?"正常":"降级可用 · 60%":"待测试"})]}),p.jsxs("div",{children:[p.jsx("span",{children:"来源"}),p.jsx("b",{className:r.revealed.authenticity?"":"unknown",children:r.revealed.authenticity?DR(r.authenticity):"待核验"})]})]})}function IR({state:r,targetUid:t,send:i,onClose:o,assist:l}){var M,O,I,D,V,H,z,X;const[u,d]=dt.useState("condition"),[h,m]=dt.useState([]),v=((M=r.inspection)==null?void 0:M.uid)??t,x=((I=(O=r.trade)==null?void 0:O.item)==null?void 0:I.uid)===v?r.trade.item:r.inventory.find(w=>w.uid===v)??dr(r),g=((D=r.inspection)==null?void 0:D.check)??u;if(dt.useEffect(()=>{m([])},[(V=r.inspection)==null?void 0:V.uid,(H=r.inspection)==null?void 0:H.check]),!x)return p.jsx("p",{children:"请先在货架或柜台选择一件物品。"});const S=ln(x.defId),y=((z=r.inspection)==null?void 0:z.uid)===x.uid;function T(w){h.includes(w)||(m(N=>[...N,w]),i({type:"CHECK_STEP"}))}function C(w){d(w),i({type:"START_CHECK",uid:x.uid,check:w})}function E(){var N;const w=g==="condition"?3-(((N=r.inspection)==null?void 0:N.progress)??0):1;for(let B=0;B<w;B++)i({type:"CHECK_STEP"})}return p.jsxs("div",{className:"inspection-layout",children:[p.jsxs("div",{className:"inspection-art",children:[p.jsx("div",{className:"workbench-grid"}),p.jsxs("span",{className:"eyebrow",children:[S.id," / INSPECTION TABLE"]}),p.jsx(ur,{id:x.defId,className:"inspection-sprite"}),y&&g==="condition"&&!l&&p.jsx("div",{className:"hotspots",children:[0,1,2].map(w=>p.jsx("button",{disabled:h.includes(w),className:`hotspot hotspot-${w}`,onClick:()=>T(w),"aria-label":`检查第 ${w+1} 处痕迹`,children:h.includes(w)?p.jsx(_s,{size:17}):w+1},w))}),y&&g!=="condition"&&p.jsxs("div",{className:"test-instrument",children:[p.jsx("span",{children:g==="function"?"密闭功能检测台":"旧站档案 · 编号比对"}),p.jsx("strong",{children:g==="function"?"READY":S.code}),p.jsxs("button",{className:"button primary",onClick:E,children:[g==="function"?p.jsx(Gu,{size:16}):p.jsx(Qu,{size:16}),g==="function"?"启动检测":"与目录比对"]})]}),p.jsx("div",{className:"inspection-art-caption",children:y?"检查进行中 · 已扣除耗时，退出后可继续":"轻拿轻放，每一道划痕都有来处"})]}),p.jsxs("div",{className:"inspection-info",children:[p.jsx("span",{className:"category-label",children:mi[S.category].name}),p.jsx("h3",{children:S.name}),p.jsx(Gm,{item:x,state:r}),p.jsx(Vm,{item:x}),p.jsx("div",{className:"inspection-actions",children:Object.keys(yo).map(w=>{var k;const N=yo[w],B=x.revealed[w];return p.jsxs("button",{className:`check-button ${B?"done":""} ${g===w&&y?"active":""}`,disabled:B||!!r.inspection||Un(r)<N.minutes||!!((k=r.trade)!=null&&k.locked),onClick:()=>C(w),children:[p.jsxs("span",{children:[w==="condition"?p.jsx(Ap,{size:18}):w==="function"?p.jsx(Gu,{size:18}):p.jsx(Cp,{size:18}),N.name]}),p.jsx("small",{children:B?p.jsx(_s,{size:15}):`${N.minutes} 分钟`})]},w)})}),y&&g==="condition"&&p.jsxs("div",{className:"inspection-guide",children:[p.jsxs("p",{children:["点击旧物上的三处标记，查看使用痕迹。",((X=r.inspection)==null?void 0:X.progress)??0," / 3"]}),p.jsxs("button",{className:"text-button",onClick:E,children:["辅助完成检查 ",p.jsx(sr,{size:14})]})]}),p.jsxs("div",{className:"clue-notes",children:[x.revealed.condition&&p.jsxs("p",{children:[p.jsx(Ap,{size:14}),S.appearance.join("；"),"。品相：",aS(x.condition),"。"]}),x.revealed.function&&p.jsxs("p",{children:[p.jsx(Gu,{size:14}),S.functionClue[x.function===1?0:1]]}),x.revealed.authenticity&&p.jsxs("p",{children:[p.jsx(Cp,{size:14}),x.authenticity===1?S.originalClue:x.authenticity===.3?"材质和压印与原厂不同，是仿制纪念品。":S.alternateClue]})]}),p.jsxs("button",{className:"button secondary full",onClick:o,children:["返回柜台",y?" · 保留检查进度":""]})]})]})}function BR({state:r,send:t,inspect:i,confirm:o}){var x,g,S,y;const[l,u]=dt.useState(((x=r.inventory[0])==null?void 0:x.uid)??""),d=r.inventory.find(T=>T.uid===l),h=d&&ln(d.defId),m=d&&(((g=r.trade)==null?void 0:g.selected)===d.uid||((S=r.inspection)==null?void 0:S.uid)===d.uid),v=r.inventory.filter(T=>T.displayed);return p.jsxs("div",{className:"inventory-layout",children:[p.jsxs("div",{children:[p.jsxs("div",{className:"section-heading",children:[p.jsxs("h3",{children:["全部库存 ",p.jsxs("small",{children:[r.inventory.length," / 12"]})]}),p.jsx("span",{children:"选中旧物，查看详情"})]}),p.jsx("div",{className:"inventory-grid",children:Array.from({length:12},(T,C)=>{const E=r.inventory[C];return E?p.jsxs("button",{className:`inventory-cell ${l===E.uid?"selected":""}`,onClick:()=>u(E.uid),children:[p.jsx("span",{className:"slot-number",children:String(C+1).padStart(2,"0")}),p.jsx(ur,{id:E.defId}),p.jsx("b",{children:ln(E.defId).name}),p.jsxs("span",{className:`stock-status ${E.displayed?"on-shelf":""}`,children:[E.displayed?"● 陈列中":"仓库存放",E.revealed.authenticity?"":" · 未核验"]})]},E.uid):p.jsxs("div",{className:"inventory-cell empty",children:[p.jsx("span",{className:"slot-number",children:String(C+1).padStart(2,"0")}),p.jsx(cr,{size:24,strokeWidth:1}),p.jsx("span",{children:"空置"})]},C)})}),p.jsxs("div",{className:"section-heading shelf-title",children:[p.jsxs("h3",{children:["店内陈列 ",p.jsxs("small",{children:[v.length," / 8"]})]}),p.jsx("span",{children:"只有陈列中的商品会被买家选中"})]}),p.jsx("div",{className:"shelf-slots",children:Array.from({length:8},(T,C)=>p.jsx("button",{"aria-label":v[C]?`选择陈列商品 ${ln(v[C].defId).name}`:`陈列位 ${C+1}`,onClick:()=>{v[C]?u(v[C].uid):d&&!d.displayed&&t({type:"DISPLAY",uid:d.uid,riskLabel:!0})},children:v[C]?p.jsx(ur,{id:v[C].defId}):p.jsx("span",{children:"＋"})},C))})]}),p.jsx("aside",{className:"inventory-detail",children:d&&h?p.jsxs(p.Fragment,{children:[p.jsxs("span",{className:"category-label",children:[h.id," · ",mi[h.category].name]}),p.jsx("h3",{children:h.name}),p.jsx("p",{className:"item-lore",children:h.lore}),p.jsx(Vm,{item:d}),p.jsx(Gm,{item:d,state:r}),p.jsxs("div",{className:"cost-row",children:[p.jsx("span",{children:"实际购入成本"}),p.jsx(wi,{amount:d.cost})]}),p.jsxs("label",{className:"list-price",children:["建议挂牌价"," ",p.jsxs("div",{children:[p.jsx("input",{"aria-label":"建议挂牌价",type:"number",min:"1",max:"9999",disabled:!!m,value:d.listPrice,onChange:T=>t({type:"PRICE",uid:d.uid,price:Number(T.target.value)})}),p.jsx("span",{children:"票"})]})]}),p.jsx("p",{className:"muted small",children:"挂牌价可作为你的起始要价，不保证买家接受。"}),p.jsx("button",{className:"button primary full",disabled:!!m||r.inventory.filter(T=>T.displayed).length>=8&&!d.displayed,onClick:()=>t({type:"DISPLAY",uid:d.uid,riskLabel:!0}),children:d.displayed?"撤下陈列":d.revealed.authenticity?"诚实标注 · 上架":"标记“未核验”并上架"}),!d.revealed.authenticity&&p.jsx("p",{className:"muted small",children:"未核验商品仅周砾、阿扣接收，预算降低 20%。"}),p.jsxs("button",{className:"button secondary full",disabled:!!r.inspection||Object.values(d.revealed).every(Boolean)||!!((y=r.trade)!=null&&y.locked),onClick:()=>i(d.uid),children:[p.jsx(Qu,{size:16}),"送到鉴定台"]}),p.jsxs("button",{className:"text-button danger-text",disabled:!!m||r.recycled>=2||Un(r)<6||!!r.inspection||r.commission==="active",onClick:()=>o(d.uid),children:["回收变现 · ",Math.floor(Ss(d,r.market)*.35)," 票"," ",p.jsx(sr,{size:14})]}),p.jsxs("p",{className:"muted small",children:["今日已回收 ",r.recycled," / 2 件 · 耗时 6 分钟"]})]}):p.jsxs("div",{className:"empty-detail",children:[p.jsx(cr,{size:36}),p.jsx("h3",{children:"货架在等新的故事"}),p.jsx("p",{children:"接待卖家，收购第一件旧物。"})]})})]})}function FR({state:r}){const[t,i]=dt.useState("today"),o=r.ledger.filter(h=>t==="all"||h.day===r.day),u=r.ledger.filter(h=>h.kind==="sale").reduce((h,m)=>h+m.amount-(m.cost??0),0),d=r.inventory.reduce((h,m)=>h+m.cost,0);return p.jsxs(p.Fragment,{children:[p.jsxs("div",{className:"ledger-stats",children:[p.jsxs("div",{children:[p.jsx("span",{children:"可用现金"}),p.jsx(wi,{amount:r.cash})]}),p.jsxs("div",{children:[p.jsx("span",{children:"已实现销售毛利"}),p.jsx(wi,{amount:u})]}),p.jsxs("div",{children:[p.jsx("span",{children:"未售库存成本"}),p.jsx(wi,{amount:d})]}),p.jsxs("div",{children:[p.jsx("span",{children:"今日到期费用"}),p.jsx(wi,{amount:15+go(r.day)})]})]}),p.jsxs("div",{className:"tabs",children:[p.jsx("button",{className:t==="today"?"active":"",onClick:()=>i("today"),children:"今日流水"}),p.jsx("button",{className:t==="all"?"active":"",onClick:()=>i("all"),children:"全部流水"}),p.jsx("span",{children:"库存价值不计入现金"})]}),p.jsxs("div",{className:"ledger-table",children:[p.jsxs("div",{className:"ledger-row table-head",children:[p.jsx("span",{children:"时间"}),p.jsx("span",{children:"项目"}),p.jsx("span",{children:"金额"})]}),o.length===0?p.jsxs("div",{className:"empty-ledger",children:[p.jsx(Tm,{size:30}),p.jsx("p",{children:"账本的第一页，等你写下。"}),p.jsx("span",{children:"初始现金 180 票；3 件原有存货不再扣款。"})]}):o.slice().reverse().map(h=>p.jsxs("div",{className:"ledger-row",children:[p.jsxs("span",{children:["第 ",h.day," 天 · ",ym(h.minute)]}),p.jsxs("span",{children:[h.amount>0?p.jsx(rE,{size:15}):p.jsx(oE,{size:15}),h.label,h.risk&&p.jsx("small",{children:"未核验成交"})]}),p.jsxs("b",{className:h.amount>0?"income":"",children:[h.amount>0?"+":"−",Math.abs(h.amount),p.jsx("small",{children:"票"})]})]},h.id))]}),p.jsxs("div",{className:"ledger-note",children:[p.jsx(bm,{size:20}),p.jsxs("p",{children:[p.jsx("b",{children:"七日租约"}),"每日耗材 15 票；第 3 天租金 90 票，第 7 天租金 210 票。结清后，保留 120 票现金、信誉 40 以上并累计售出 12 件，就能正式续业。"]})]})]})}function HR({state:r}){const[t,i]=dt.useState("objects"),[o,l]=dt.useState(0),[u,d]=dt.useState("all");return p.jsxs(p.Fragment,{children:[p.jsxs("div",{className:"tabs",children:[p.jsx("button",{className:t==="objects"?"active":"",onClick:()=>{i("objects"),l(0)},children:"旧物档案 · 12"}),p.jsx("button",{className:t==="people"?"active":"",onClick:()=>{i("people"),l(0)},children:"聚落居民 · 6"}),p.jsx("span",{children:"编号可查，故事慢慢听"})]}),t==="objects"?p.jsxs(p.Fragment,{children:[p.jsx("div",{className:"filter-chips",children:["all","repair","life","collect"].map(h=>p.jsx("button",{className:u===h?"active":"",onClick:()=>{d(h),l(Fn.findIndex(m=>h==="all"||m.category===h))},children:h==="all"?"全部旧物":mi[h].name},h))}),p.jsxs("div",{className:"codex-layout",children:[p.jsx("div",{className:"codex-grid",children:Fn.filter(h=>u==="all"||h.category===u).map(h=>{var m;return p.jsxs("button",{className:((m=Fn[o])==null?void 0:m.id)===h.id?"active":"",onClick:()=>l(Fn.indexOf(h)),children:[p.jsx("span",{className:"slot-number",children:h.id}),p.jsx(ur,{id:h.id}),p.jsx("b",{children:h.name}),p.jsx("small",{children:r.discovered.includes(h.id)?"已遇见":"目录记录"})]},h.id)})}),p.jsxs("div",{className:"codex-entry",children:[p.jsxs("span",{className:"eyebrow",children:["FIELD NOTES / ",Fn[o].id]}),p.jsx("h3",{children:Fn[o].name}),p.jsx("p",{className:"item-subtitle",children:Fn[o].subtitle}),p.jsx("p",{className:"item-lore",children:Fn[o].lore}),p.jsxs("div",{className:"definition-row",children:[p.jsx("span",{children:"原始基础价"}),p.jsx(wi,{amount:Fn[o].base})]}),p.jsx("h4",{children:"可核验的证据"}),p.jsxs("p",{className:"clue-text",children:[p.jsx(Ap,{size:15}),Fn[o].appearance[0],"。"]}),p.jsxs("p",{className:"clue-text",children:[p.jsx(Gu,{size:15}),Fn[o].functionClue[0]]}),p.jsxs("p",{className:"clue-text",children:[p.jsx(Cp,{size:15}),Fn[o].originalClue]}),p.jsx("div",{className:"field-stamp",children:"灰线旧站 · 旧物档案"})]})]})]}):p.jsxs("div",{className:"people-layout",children:[p.jsx("div",{className:"people-list",children:Ci.map((h,m)=>p.jsxs("button",{className:o===m?"active":"",onClick:()=>l(m),children:[p.jsx(cS,{index:h.sprite}),p.jsxs("span",{children:[p.jsx("b",{children:h.name}),p.jsx("small",{children:h.title})]}),p.jsx(sr,{size:16})]},h.id))}),p.jsxs("div",{className:"people-entry",children:[p.jsx("div",{className:"full-character",style:{backgroundPositionX:`${Ci[o].sprite*20}%`}}),p.jsxs("div",{children:[p.jsx("span",{className:"eyebrow",children:"PEOPLE OF GREYLINE"}),p.jsx("h3",{children:Ci[o].name}),p.jsx("p",{className:"item-subtitle",children:Ci[o].title}),p.jsx("p",{className:"item-lore",children:Ci[o].bio}),p.jsxs("blockquote",{children:["“",Ci[o].lines.special,"”"]}),p.jsx("div",{className:"preference-list",children:Ci[o].preferences.map(h=>p.jsx("span",{children:mi[h].name},h))}),p.jsx("p",{className:"muted small",children:Ci[o].risk?"愿意购买明确标注的未核验商品，预算会有所降低。":"只购买来源已经核验、诚实标注的商品。"})]})]})]})]})}function GR({state:r,send:t}){const[i,o]=dt.useState(null),l=r.commission==="active";return p.jsxs("div",{className:"community",children:[p.jsxs("div",{className:"community-intro",children:[p.jsx("span",{className:"eyebrow",children:"GREYLINE COMMUNITY BOARD"}),p.jsx("h3",{children:"给旧物分个家"}),p.jsx("p",{children:"南站仓库缺一双帮忙的手。把六件回收物资送到对应的箱子，不需要本钱，也不占库存。"}),p.jsxs("div",{children:[p.jsxs("span",{children:[p.jsx(Ll,{size:16}),"90 分钟"]}),p.jsxs("span",{children:[p.jsx(Tm,{size:16}),"报酬 40 票"]}),p.jsx("span",{children:"每日一次"})]})]}),l?p.jsxs(p.Fragment,{children:[p.jsx("p",{className:"muted small",children:"拖动卡片，或先选卡片再点分类箱。分错不会产生惩罚。"}),p.jsx("div",{className:"sort-cards",children:xm.map((u,d)=>p.jsxs("button",{draggable:!r.sorted.includes(d),onDragStart:h=>h.dataTransfer.setData("text/plain",String(d)),disabled:r.sorted.includes(d),className:`${i===d?"selected":""} ${r.sorted.includes(d)?"sorted":""}`,onClick:()=>o(d),children:[r.sorted.includes(d)?p.jsx(_s,{size:20}):p.jsx(cr,{size:20}),p.jsx("span",{children:u.name})]},d))}),p.jsx("div",{className:"sort-bins",children:Object.keys(mi).map(u=>p.jsxs("button",{onDragOver:d=>d.preventDefault(),onDrop:d=>{d.preventDefault();const h=Number(d.dataTransfer.getData("text/plain"));Number.isInteger(h)&&t({type:"SORT",index:h,category:u})},onClick:()=>{i!==null&&(t({type:"SORT",index:i,category:u}),o(null))},children:[p.jsx(cr,{size:28}),p.jsx("b",{children:mi[u].name}),p.jsx("small",{children:"将卡片放入此箱"})]},u))}),p.jsxs("div",{className:"community-footer",children:[p.jsxs("span",{children:["已分拣 ",r.sorted.length," / 6"]}),p.jsxs("button",{className:"text-button",onClick:()=>t({type:"SORT_ALL"}),children:[p.jsx(vy,{size:15}),"辅助完成"]})]})]}):r.commission==="done"?p.jsxs("div",{className:"community-complete",children:[p.jsx(bm,{size:42}),p.jsx("h3",{children:"今天的委托完成了"}),p.jsx("p",{children:"40 票已经入账。仓库的伙伴托我说一声：谢谢。"})]}):p.jsx("button",{className:"button primary full",disabled:Un(r)<90||!!r.trade||!!r.inspection,onClick:()=>t({type:"COMMISSION"}),children:r.trade?"请先结束当前接待":Un(r)<90?"剩余时间不足 90 分钟":"领取分拣委托"})]})}function VR(){return p.jsxs("div",{className:"help-content",children:[p.jsx("p",{className:"help-lead",children:"在沙尘里留住一家小店，也为旧物找个新家。"}),p.jsx("div",{className:"help-steps",children:[["01","接待与鉴定","卖家带来旧物，买家寻找陈列商品。外观、功能、编号各揭示一类证据，只消耗游戏时间，不收鉴定费。"],["02","报价与交割","每次接待最多报价三轮。价格谈妥后，还需确认交割，现金和物品才会转移。报价 4 分钟，交割 6 分钟。"],["03","入库与陈列","新收购的货物先进入仓库，记得打开货架上架。未核验商品须明确标注，仅周砾和阿扣愿意接收。"],["04","周转与租金","现金不够时，可做每日社区分拣委托，或回收两件旧物。每天 15 票耗材，第 3 天与第 7 天另付租金。"],["05","保住这间店","七日内结清所有费用，期末现金至少 120、信誉至少 40，累计售出 12 件。普通拒绝和还价失败不会扣信誉。"]].map(([r,t,i])=>p.jsxs("div",{children:[p.jsx("span",{children:r}),p.jsxs("section",{children:[p.jsx("h3",{children:t}),p.jsx("p",{children:i})]})]},r))}),p.jsxs("div",{className:"ledger-note",children:[p.jsx(Ll,{size:21}),p.jsx("p",{children:"阅读、停留、打开菜单都不推进时间。所有进度自动保存在本浏览器。空格接待，Esc 暂停，I 货架，B 账本，H 指南。"})]})]})}let er=null;function hy(r,t){if(t)try{er??(er=new AudioContext),er.state==="suspended"&&er.resume(),(r==="bell"?[830,1245,1660]:r==="coin"?[880,1174,1568]:r==="check"?[392,523]:[260]).forEach((o,l)=>{const u=er.currentTime+l*.075,d=er.createOscillator(),h=er.createGain();d.type=r==="click"?"triangle":"sine",d.frequency.value=o,h.gain.setValueAtTime(0,u),h.gain.linearRampToValueAtTime(r==="click"?.035:.065,u+.008),h.gain.exponentialRampToValueAtTime(.001,u+(r==="bell"?.8:.25)),d.connect(h).connect(er.destination),d.start(u),d.stop(u+1)})}catch{}}const py={sound:!1,largeText:!1,reducedMotion:!1,assist:!1};function jR(){try{return{...py,...JSON.parse(localStorage.getItem("greyline-prefs")??"{}")}}catch{return py}}function kR(){try{const r=new URLSearchParams(window.location.search);return r.has("seed")?Zu(r.get("seed")||"TUTORIAL-001"):lS(localStorage.getItem(Ku))??Zu()}catch{return Zu()}}function XR(){var Ee,we;const[r,t]=dt.useReducer((Q,de)=>de.type==="RESET"?Zu(de.seed):PR(Q,de),void 0,kR),[i,o]=dt.useState(jR),[l,u]=dt.useState(null),[d,h]=dt.useState(""),[m,v]=dt.useState(""),[x,g]=dt.useState(null),[S,y]=dt.useState(null),[T,C]=dt.useState(!1),[E,M]=dt.useState(!1),[O,I]=dt.useState(""),[D,V]=dt.useState(!1),[H,z]=dt.useState("TUTORIAL-001"),[X,w]=dt.useState(""),N=dt.useRef(i);N.current=i;const B=dt.useCallback(Q=>{hy(Q.type==="ARRIVE"?"bell":Q.type==="DELIVER"||Q.type==="SORT_ALL"?"coin":Q.type==="CHECK_STEP"?"check":"click",N.current.sound),t(Q)},[]);dt.useEffect(()=>{try{localStorage.setItem(Ku,JSON.stringify(r)),C(!1)}catch{C(!0)}},[r]),dt.useEffect(()=>{try{localStorage.setItem("greyline-prefs",JSON.stringify(i))}catch{}document.documentElement.classList.toggle("large-text",i.largeText),document.documentElement.classList.toggle("reduced-motion",i.reducedMotion)},[i]),dt.useEffect(()=>{function Q(de){if(!(de.ctrlKey||de.metaKey||de.altKey||de.target instanceof HTMLElement&&/INPUT|TEXTAREA|SELECT/.test(de.target.tagName))){if(de.key==="Escape"&&!l&&r.phase==="open"){u("settings");return}l||r.phase!=="open"||x!==null||S||(de.code==="Space"&&(de.preventDefault(),r.trade||B({type:"ARRIVE"})),de.key.toLowerCase()==="i"&&u("inventory"),de.key.toLowerCase()==="b"&&u("ledger"),de.key.toLowerCase()==="h"&&u("help"))}}return window.addEventListener("keydown",Q),()=>window.removeEventListener("keydown",Q)},[l,r.phase,r.trade,x,S,B]),dt.useEffect(()=>{r.notice&&w(r.notice)},[r.notice]),dt.useEffect(()=>{if(!X)return;const Q=setTimeout(()=>w(""),5500);return()=>clearTimeout(Q)},[X]),dt.useEffect(()=>{var de;const Q=dr(r);v(Q?String(((de=r.trade)==null?void 0:de.role)==="seller"?Math.max(1,Math.floor(ef(Q,r.market).center*.7+1e-9)):Q.listPrice||Math.round(ef(Q,r.market).center*1.1)):"")},[(Ee=r.trade)==null?void 0:Ee.id,(we=r.trade)==null?void 0:we.selected]);const k=r.trade,le=dr(r),pe=k?Gi(k.npc):null,fe=r.cursor<r.queue.length?r.queue[r.cursor]:null,q=Math.min(100,r.sold/12*100),se=go(r.day),W=r.phase==="report"||r.phase==="ending",xe=r.inventory.find(Q=>Q.uid===S),Se=r.day<=3?3:7;function Pe(Q){h(Q),u("inspect")}function Je(){u(null)}function xt(){const Q=Number(m);if(Mm(r,Q)&&Number.isFinite(Q)&&Q>0){g(Q);return}B({type:"OFFER",price:Q})}function F(){try{localStorage.setItem(Ku,JSON.stringify(r)),C(!1),M(!0),setTimeout(()=>M(!1),2e3)}catch{C(!0)}}function he(Q){t({type:"RESET",seed:Q.trim()||"TUTORIAL-001"});const de=new URL(window.location.href);de.searchParams.delete("seed"),window.history.replaceState({},"",de),u(null),V(!0),h(""),g(null),y(null)}async function ee(Q){if(Q)try{if(Q.size>5e5){I("文件过大，请选择灰线旧货铺导出的 JSON 存档。");return}const de=lS(await Q.text());if(!de){I("存档无法读取：格式不正确或版本不兼容。原进度未改动。");return}localStorage.setItem(Ku,JSON.stringify(de)),window.location.assign(window.location.pathname)}catch{I("浏览器无法读取或保存这个文件，请检查本地存储权限。")}}const re=!!r.inspection||r.commission==="active";return p.jsxs("div",{className:"game-app",children:[p.jsxs("header",{className:"topbar",children:[p.jsxs("button",{className:"brand",onClick:()=>u("help"),"aria-label":"灰线旧货铺 · 查看游戏指南",children:[p.jsx("span",{className:"brand-symbol",children:p.jsx(cx,{size:26,strokeWidth:1.4})}),p.jsxs("span",{children:[p.jsx("strong",{children:"灰线旧货铺"}),p.jsx("small",{children:"GREYLINE TRADING POST"})]})]}),p.jsxs("div",{className:"top-stats",children:[p.jsxs("div",{className:"stat day-stat",children:[p.jsx(jh,{size:21}),p.jsxs("div",{children:[p.jsx("small",{children:"试营业"}),p.jsxs("strong",{children:["第 ",r.day," 天 ",p.jsx("em",{children:"/ 07"})]})]})]}),p.jsxs("div",{className:"stat",children:[p.jsx(Tm,{size:23}),p.jsxs("div",{children:[p.jsx("small",{children:"可用现金"}),p.jsxs("strong",{"data-testid":"cash",children:[r.cash.toLocaleString(),p.jsx("em",{children:"票"})]})]})]}),p.jsxs("div",{className:"stat reputation-stat",children:[p.jsx(Vh,{size:22}),p.jsxs("div",{children:[p.jsx("small",{children:"店铺信誉"}),p.jsxs("strong",{children:[r.reputation,p.jsx("em",{children:"/ 100"})]})]})]})]}),p.jsxs("div",{className:"top-actions",children:[p.jsxs("span",{className:"autosave-label",title:T?"浏览器存储不可用，请导出存档":"进度保存在此浏览器",children:[p.jsx("span",{className:T?"save-dot warning":"save-dot"}),T?"存档未保存":"自动存档"]}),p.jsx("button",{className:"icon-button",title:i.sound?"关闭声音":"开启声音","aria-label":i.sound?"关闭声音":"开启声音",onClick:()=>{hy("bell",!i.sound),o(Q=>({...Q,sound:!Q.sound}))},children:i.sound?p.jsx(pE,{size:20}):p.jsx(mE,{size:20})}),p.jsx("button",{className:"icon-button","aria-label":"暂停与设置",title:"暂停与设置 · Esc",onClick:()=>u("settings"),children:p.jsx(lx,{size:20})})]})]}),p.jsxs("div",{className:"game-body",children:[p.jsxs("nav",{className:"sidebar","aria-label":"店铺导航",children:[p.jsxs("div",{className:"nav-main",children:[p.jsxs("button",{className:l?"nav-item":"nav-item active",onClick:Je,children:[p.jsx(cx,{size:23,strokeWidth:1.5}),p.jsx("span",{children:"店铺"}),p.jsx("i",{})]}),p.jsxs("button",{className:l==="inventory"?"nav-item active":"nav-item",onClick:()=>u("inventory"),children:[p.jsx(rx,{size:23,strokeWidth:1.5}),p.jsx("span",{children:"货架"}),p.jsx("i",{})]}),p.jsxs("button",{className:l==="codex"?"nav-item active":"nav-item",onClick:()=>u("codex"),children:[p.jsx(lE,{size:23,strokeWidth:1.5}),p.jsx("span",{children:"图鉴"}),p.jsx("i",{})]}),p.jsxs("button",{className:l==="ledger"?"nav-item active":"nav-item",onClick:()=>u("ledger"),children:[p.jsx(uE,{size:23,strokeWidth:1.5}),p.jsx("span",{children:"账本"}),p.jsx("i",{})]})]}),p.jsxs("div",{className:"nav-bottom",children:[p.jsxs("button",{className:"nav-item",onClick:()=>u("help"),children:[p.jsx(cE,{size:22,strokeWidth:1.5}),p.jsx("span",{children:"指南"})]}),p.jsxs("span",{className:"nav-edition",children:["EST.",p.jsx("br",{}),"2086"]})]})]}),p.jsxs("main",{className:"workspace",children:[p.jsxs("div",{className:"workspace-heading",children:[p.jsxs("div",{className:"location",children:[p.jsx("span",{className:"eyebrow",children:"THE OLD STATION · 灰线聚落"}),p.jsxs("h1",{children:["旧物有价，故事无价",p.jsx("span",{children:"。"})]})]}),p.jsxs("div",{className:"day-weather",children:[p.jsx(jh,{size:17}),p.jsxs("span",{children:[r.day===4?"沙尘渐起":"晴，微风",p.jsx("small",{children:"旧站台以西"})]})]})]}),p.jsxs("div",{className:"play-layout",children:[p.jsxs("section",{className:"counter-section","aria-label":"柜台场景",children:[p.jsxs("div",{className:"scene-frame",children:[p.jsxs("div",{className:"scene-inner",children:[p.jsx(LR,{npc:W?null:(k==null?void 0:k.npc)??fe,active:!!k,inventory:r.inventory,item:(k==null?void 0:k.role)==="seller"?le:void 0,reducedMotion:i.reducedMotion,day:r.day,minute:r.minute}),p.jsxs("div",{className:"scene-topline",children:[p.jsxs("span",{className:"scene-place",children:[p.jsx("span",{className:"open-dot"}),"灰线旧货铺 ",p.jsx("i",{children:" / "})," 旧站务室"]}),p.jsxs("span",{className:"scene-clock",children:[p.jsx(Ll,{size:13}),ym(r.minute)]})]}),p.jsxs("button",{className:"shelf-hotspot scene-hotspot",onClick:()=>u("inventory"),children:[p.jsx(cr,{size:14}),p.jsxs("span",{children:["陈列 ",r.inventory.filter(Q=>Q.displayed).length,"/8"]}),p.jsx(sr,{size:12})]}),pe&&p.jsxs("div",{className:"npc-nameplate",children:[p.jsx("span",{children:(k==null?void 0:k.role)==="seller"?"来售旧物":"寻一件好物"}),p.jsx("strong",{children:pe.name}),p.jsx("small",{children:pe.title})]}),!k&&fe&&!W&&p.jsxs("span",{className:"visitor-bubble",children:[p.jsx(ax,{size:14}),"有客人来了"]}),p.jsx("span",{className:"scene-vignette"})]}),p.jsxs("div",{className:"day-strip",children:[p.jsx("span",{className:"day-strip-label",children:"七日试营业"}),p.jsx("div",{className:"day-track",children:[1,2,3,4,5,6,7].map(Q=>p.jsxs("div",{className:`day-mark ${Q<r.day?"past":Q===r.day?"current":""}`,title:`第 ${Q} 天${go(Q)?` · 租金 ${go(Q)} 票`:""}`,children:[p.jsx("span",{children:Q<r.day?p.jsx(_s,{size:10}):String(Q).padStart(2,"0")}),go(Q)>0&&p.jsx("i",{})]},Q))}),p.jsxs("span",{className:"rent-note",children:[p.jsx(sx,{size:12}),se?"今晚结租":`${Se-r.day} 天后结租`]})]})]}),p.jsxs("section",{className:"dialogue-panel","aria-label":"人物对话",children:[p.jsx("div",{className:"dialogue-portrait",children:pe?p.jsx(cS,{index:pe.sprite}):p.jsx("span",{className:"shopkeeper-icon",children:p.jsx(Fh,{size:30,strokeWidth:1})})}),p.jsxs("div",{className:"dialogue-text",children:[p.jsxs("div",{children:[p.jsx("b",{children:(pe==null?void 0:pe.name)??"店主手记"}),p.jsx("span",{children:pe?k!=null&&k.repeat?"又见面了":pe.title:`第 ${r.day} 天 · ${bp[r.day-1][0]}`})]}),p.jsx("p",{"data-testid":"dialogue",children:pe?k.line:r.notice}),!k&&p.jsx("small",{children:r.cursor>=r.queue.length?"今日客人已全部接待，可以整理货架、完成委托或打烊。":"门铃轻响，远道而来的人总有些故事。"})]}),p.jsx("span",{className:"dialogue-quote",children:"”"})]}),p.jsxs("div",{className:"counter-actions",children:[k?p.jsxs(p.Fragment,{children:[p.jsxs("button",{className:"button secondary inspect-action",disabled:!le||!!k.locked||Object.values((le==null?void 0:le.revealed)??{}).every(Boolean),onClick:()=>le&&Pe(le.uid),children:[p.jsx(Qu,{size:18}),r.inspection?"继续检查":"检查旧物",p.jsx("small",{children:"4 – 12 分钟"})]}),p.jsxs("button",{className:"button secondary",disabled:!!r.inspection,onClick:()=>B({type:"DISMISS"}),children:[p.jsx(Hu,{size:17}),k.locked?"取消交易":"礼貌送客",p.jsx("small",{children:"2 分钟"})]})]}):p.jsxs(p.Fragment,{children:[p.jsxs("button",{className:"button primary greet-button","data-testid":"greet",disabled:!fe||Un(r)<6||re||r.phase!=="open",onClick:()=>{V(!1),B({type:"ARRIVE"})},children:[p.jsx(ax,{size:19}),"招呼顾客",p.jsx("small",{children:"6 分钟"}),p.jsx(Ys,{size:18})]}),r.inspection?p.jsxs("button",{className:"button secondary",onClick:()=>Pe(r.inspection.uid),children:[p.jsx(Qu,{size:18}),"继续鉴定"]}):r.commission==="active"?p.jsx("button",{className:"button secondary",onClick:()=>u("community"),children:"继续分拣"}):p.jsxs("button",{className:"button secondary",onClick:()=>u("inventory"),children:[p.jsx(rx,{size:18}),"整理货架"]})]}),p.jsxs("button",{className:"close-shop",disabled:re||r.phase!=="open",onClick:()=>B({type:"CLOSE"}),children:[p.jsx(ox,{size:17}),"打烊"]})]})]}),p.jsxs("aside",{className:"right-panel",children:[p.jsxs("div",{className:"panel-top",children:[p.jsxs("span",{children:[p.jsx("span",{className:"tiny-diamond"}),k?"柜台交易":"今日营业"]}),p.jsx("small",{children:k?"AT THE COUNTER":"A NEW DAY, AN OLD STORY"})]}),k?p.jsxs("div",{className:"trade-content",children:[p.jsxs("div",{className:"trade-header",children:[p.jsx("span",{className:"trade-role",children:k.role==="seller"?"收购委托":"顾客求购"}),p.jsxs("span",{className:"round-indicators",children:[[0,1,2].map(Q=>p.jsx("i",{className:Q<k.rounds?"used":""},Q)),p.jsxs("small",{children:[3-k.rounds," 轮机会"]})]})]}),k.role==="buyer"&&p.jsxs("div",{className:"buyer-selection",children:[p.jsxs("p",{children:["想找 ",p.jsx("b",{children:mi[k.category].name}),(pe==null?void 0:pe.risk)&&p.jsx("span",{children:"接受未核验"})]}),tf(r).length?p.jsx("div",{className:"candidate-list",children:tf(r).map(Q=>p.jsxs("button",{"aria-label":`选择商品 ${ln(Q.defId).name}`,className:k.selected===Q.uid?"selected":"",onClick:()=>B({type:"SELECT",uid:Q.uid}),disabled:k.locked||!!r.inspection,children:[p.jsx(ur,{id:Q.defId}),k.selected===Q.uid&&p.jsx(_s,{size:12})]},Q.uid))}):p.jsxs("div",{className:"no-stock",children:[p.jsx(cr,{size:30}),p.jsx("p",{children:"货架上暂无合适的商品"}),p.jsxs("button",{className:"text-button",onClick:()=>u("inventory"),children:["查看库存、调整陈列 ",p.jsx(sr,{size:14})]}),p.jsx("small",{children:"缺货送客不会扣除信誉。"})]})]}),le&&p.jsxs(p.Fragment,{children:[p.jsxs("div",{className:`item-showcase ${k.role==="buyer"?"compact":""}`,children:[p.jsx("span",{className:"item-watermark",children:le.defId}),p.jsx(ur,{id:le.defId}),p.jsx("span",{className:"item-category",children:mi[ln(le.defId).category].en})]}),p.jsxs("div",{className:"item-title",children:[p.jsx("h2",{children:ln(le.defId).name}),p.jsx("p",{children:ln(le.defId).subtitle})]}),p.jsx(Vm,{item:le}),p.jsx(Gm,{item:le,state:r}),p.jsxs("div",{className:"asking-price",children:[p.jsx("span",{children:k.locked?"双方已谈定":k.role==="seller"?`${pe==null?void 0:pe.name}的要价`:`${pe==null?void 0:pe.name}的出价`}),p.jsx(wi,{amount:k.price})]}),k.locked?p.jsxs("div",{className:"locked-trade",children:[p.jsxs("div",{children:[p.jsx(Vh,{size:17}),"钱货尚未交割"]}),p.jsxs("button",{className:"button primary full","data-testid":"deliver",disabled:!!Sm(r),onClick:()=>B({type:"DELIVER",tradeId:k.id}),children:[k.role==="seller"?"确认收购":"确认出售"," · ",k.price," 票",p.jsx(Ys,{size:16})]}),p.jsx("p",{children:Sm(r)||"交割耗时 6 分钟，成交后自动记账。"})]}):p.jsxs("div",{className:"bargain-controls",children:[p.jsxs("div",{className:"offer-label",children:[p.jsx("label",{htmlFor:"offer-price",children:k.role==="seller"?"你的收购报价":"你的出售要价"}),p.jsx("span",{children:"每轮 4 分钟"})]}),p.jsxs("form",{onSubmit:Q=>{Q.preventDefault(),xt()},children:[p.jsxs("div",{className:"offer-input",children:[p.jsx("button",{type:"button","aria-label":"报价减少 5 票",disabled:!!r.inspection,onClick:()=>v(String(Math.max(1,Number(m)-5))),children:p.jsx(Hh,{size:16})}),p.jsx("input",{id:"offer-price","aria-label":"你的报价",type:"number",min:"1",max:"9999",step:"1",value:m,disabled:!!r.inspection,onChange:Q=>v(Q.target.value)}),p.jsx("span",{children:"票"}),p.jsx("button",{type:"button","aria-label":"报价增加 5 票",disabled:!!r.inspection,onClick:()=>v(String(Math.min(9999,Number(m)+5))),children:p.jsx(fE,{size:16})})]}),p.jsxs("button",{className:"button primary",disabled:!!r.inspection||Un(r)<10||!Number.isInteger(Number(m))||Number(m)<1,type:"submit","data-testid":"offer",children:["报价 ",p.jsx(Ys,{size:15})]})]}),p.jsxs("button",{className:"text-button accept-current",disabled:!!r.inspection||Un(r)<10,onClick:()=>B({type:"ACCEPT"}),children:["接受对方当前价格"," ",p.jsxs("span",{children:[k.price," 票 ",p.jsx(sr,{size:13})]})]})]})]})]}):p.jsxs("div",{className:"day-content",children:[p.jsxs("div",{className:"day-intro",children:[p.jsxs("span",{className:"eyebrow",children:["CHAPTER ",String(r.day).padStart(2,"0")]}),p.jsx("h2",{children:bp[r.day-1][0]}),p.jsx("p",{children:bp[r.day-1][1]})]}),p.jsxs("div",{className:"market-section",children:[p.jsxs("div",{className:"small-heading",children:[p.jsx(ux,{size:15}),p.jsx("h3",{children:"今日行情"}),p.jsx("span",{children:"每日开店锁定"})]}),Object.keys(mi).map((Q,de)=>p.jsxs("div",{className:"market-row",children:[p.jsx("span",{className:"market-icon",children:de===0?p.jsx(lx,{size:17}):de===1?p.jsx(jh,{size:17}):p.jsx(vy,{size:17})}),p.jsx("span",{children:mi[Q].name}),p.jsxs("b",{className:r.market[Q]>1?"market-up":r.market[Q]<1?"market-down":"",children:[r.market[Q]>1?p.jsx(ux,{size:13}):r.market[Q]<1?p.jsx(hE,{size:13}):p.jsx(Hh,{size:13}),r.market[Q]===1?"平稳":`${r.market[Q]>1?"+":"−"}15%`]})]},Q))]}),p.jsxs("div",{className:"lease-card",children:[p.jsxs("div",{children:[p.jsx(sx,{size:16}),p.jsx("b",{children:"一间店，一个新开始"})]}),p.jsx("p",{children:"七日试营业 · 保住这盏灯"}),p.jsxs("div",{className:"goal-line",children:[p.jsx("span",{children:"售出旧物"}),p.jsxs("strong",{children:[r.sold,p.jsx("small",{children:" / 12 件"})]})]}),p.jsx("div",{className:"goal-progress",children:p.jsx("span",{style:{width:`${q}%`}})}),p.jsxs("div",{className:"lease-figures",children:[p.jsxs("span",{children:["期末现金 ",p.jsx("b",{children:"≥ 120"})]}),p.jsxs("span",{children:["店铺信誉 ",p.jsx("b",{children:"≥ 40"})]})]}),p.jsxs("div",{className:"lease-footer",children:[p.jsx(Ll,{size:13}),se?`今晚租金 ${se} 票 + 耗材 15 票`:`第 ${Se} 天结租 ${Se===3?90:210} 票`]})]}),D&&r.day===1&&r.cursor===0&&p.jsxs("div",{className:"first-tip",children:[p.jsx("button",{"aria-label":"收起新手提示",onClick:()=>V(!1),children:p.jsx(Hu,{size:13})}),p.jsxs("span",{children:[p.jsx(Fh,{size:15}),"新店主的小提示"]}),p.jsx("p",{children:"先招呼门边的客人。别急着付钱，看看旧物再谈价。"})]}),p.jsxs("button",{className:"community-card",onClick:()=>u("community"),children:[p.jsx("span",{className:"community-icon",children:p.jsx(cr,{size:23,strokeWidth:1.3})}),p.jsxs("span",{children:[p.jsx("b",{children:r.commission==="done"?"今日委托已完成":r.commission==="active"?"继续分拣委托":"社区分拣委托"}),p.jsx("small",{children:r.commission==="done"?"报酬已记入账本":"帮一点小忙，赚 40 票"})]}),r.commission==="done"?p.jsx(_s,{size:17}):p.jsx(sr,{size:17})]})]}),p.jsxs("div",{className:"panel-foot",children:[p.jsx("span",{className:"open-dot"}),r.cursor>=r.queue.length?"今日来客已接待完毕":`今日还有 ${r.queue.length-r.cursor} 位来客`]})]})]}),p.jsxs("footer",{className:"bottom-bar",children:[p.jsxs("div",{className:"business-time",children:[p.jsx(Ll,{size:14}),p.jsx("b",{children:ym(r.minute)}),p.jsx("div",{className:"time-progress",children:p.jsx("span",{style:{width:`${r.minute/360*100}%`}})}),p.jsx("span",{children:"16:00 打烊"})]}),p.jsx("span",{className:"bottom-note",children:"旧物有来处，买卖有分寸。"}),p.jsxs("button",{onClick:F,className:"save-button",children:[p.jsx(dE,{size:14}),E?"已保存":"保存进度"]})]})]})]}),X&&!l&&!W&&r.phase!=="closing"&&p.jsxs("div",{className:"toast",role:"status",children:[p.jsx(_s,{size:15}),p.jsx("span",{children:X}),p.jsx("button",{"aria-label":"收起通知",onClick:()=>w(""),children:p.jsx(Hu,{size:13})})]}),l==="inventory"&&p.jsx(hi,{title:"库存与陈列",subtitle:"THE SHELVES · 给旧物一个位置",wide:!0,onClose:Je,children:p.jsx(BR,{state:r,send:B,inspect:Pe,confirm:y})}),l==="ledger"&&p.jsx(hi,{title:"店铺账本",subtitle:"EVERY TICKET COUNTS · 每一票都有来处",wide:!0,onClose:Je,children:p.jsx(FR,{state:r})}),l==="codex"&&p.jsx(hi,{title:"灰线见闻录",subtitle:"THINGS & PEOPLE · 旧物与故人",wide:!0,onClose:Je,children:p.jsx(HR,{state:r})}),l==="help"&&p.jsx(hi,{title:"新店主手册",subtitle:"A LITTLE GUIDE TO YOUR NEW LIFE",onClose:Je,children:p.jsx(VR,{})}),l==="community"&&p.jsx(hi,{title:"社区告示板",subtitle:"A HELPING HAND · 聚落的日常",onClose:Je,children:p.jsx(GR,{state:r,send:B})}),l==="inspect"&&p.jsx(hi,{title:"旧物鉴定台",subtitle:"LOOK CLOSER · 让证据说话",wide:!0,onClose:Je,children:p.jsx(IR,{state:r,targetUid:d,send:B,onClose:Je,assist:i.assist})}),l==="settings"&&p.jsxs(hi,{title:"歇一歇，再开张",subtitle:"PAUSED · 时间不会偷偷溜走",onClose:Je,children:[p.jsx("div",{className:"settings-list",children:[["sound","游戏音效","门铃、纸页与成交的声音。"],["largeText","放大字号","让对白与物品说明更容易阅读。"],["reducedMotion","减少动态","关闭镜头视差、浮尘位移和角色呼吸。"],["assist","鉴定辅助","允许直接完成检查动作，耗时不变。"]].map(([Q,de,je])=>p.jsxs("button",{className:"setting-row",role:"switch","aria-checked":i[Q],onClick:()=>o(P=>({...P,[Q]:!P[Q]})),children:[p.jsxs("span",{children:[p.jsx("b",{children:de}),p.jsx("small",{children:je})]}),p.jsx("i",{className:`toggle ${i[Q]?"on":""}`})]},Q))}),p.jsxs("div",{className:"settings-actions",children:[p.jsxs("button",{className:"button primary full",onClick:Je,children:[p.jsx(Ys,{size:17}),"继续营业"]}),p.jsxs("button",{className:"button secondary full",onClick:()=>u("restart"),children:[p.jsx(Gh,{size:16}),"开始新的七日"]}),p.jsxs("div",{className:"save-tools",children:[p.jsx("button",{className:"text-button",onClick:()=>{const Q=new Blob([JSON.stringify(r)],{type:"application/json"}),de=document.createElement("a");de.href=URL.createObjectURL(Q),de.download=`greyline-day${r.day}.json`,de.click(),setTimeout(()=>URL.revokeObjectURL(de.href),1e3)},children:"导出存档"}),p.jsxs("label",{className:"text-button import-save",children:["导入存档",p.jsx("input",{type:"file",accept:"application/json,.json",onChange:Q=>{var de;ee((de=Q.target.files)==null?void 0:de[0]),Q.target.value=""}})]})]}),O&&p.jsx("p",{className:"danger-text",role:"status",children:O}),p.jsxs("p",{className:"muted small centered",children:["种子 ",r.seed," · 无联网、无广告 · 进度保存在当前浏览器"]}),T&&p.jsx("p",{className:"danger-text",children:"本地存储不可用，请导出存档以免丢失进度。"})]})]}),l==="restart"&&p.jsx(hi,{title:"新的七日，新的故事",subtitle:"A NEW BEGINNING",onClose:()=>u("settings"),children:p.jsxs("div",{className:"restart-content",children:[p.jsx(Gh,{size:38,strokeWidth:1}),p.jsx("p",{children:"重新开店会替换本浏览器的当前进度。需要保留时，请先在设置中导出存档。"}),p.jsxs("label",{children:["经营种子",p.jsx("input",{value:H,maxLength:64,onChange:Q=>z(Q.target.value)})]}),p.jsx("p",{className:"muted small",children:"前两笔交易固定教学，之后的货物、行情与来客随种子变化。同一种子可复现同一过程。"}),p.jsxs("button",{className:"button primary full",onClick:()=>he(H),children:["确认新开局 ",p.jsx(Ys,{size:17})]}),p.jsx("button",{className:"button secondary full",onClick:()=>{const Q=`GREYLINE-${Date.now().toString(36).toUpperCase()}`;z(Q),he(Q)},children:"随机种子开局"})]})}),x!==null&&p.jsx(hi,{title:"再斟酌一下报价？",subtitle:"REPUTATION MATTERS",onClose:()=>g(null),children:p.jsxs("div",{className:"confirmation-content",children:[p.jsx(Vh,{size:40}),p.jsxs("p",{children:["这个价格明显偏离你当前看到的估值。提交会使信誉下降 ",p.jsx("b",{children:"2 点"}),"，本次接待最多扣一次。"]}),p.jsxs("div",{className:"confirm-price",children:[p.jsx("span",{children:"即将提交的报价"}),p.jsx(wi,{amount:x})]}),p.jsx("button",{className:"button primary full",onClick:()=>{B({type:"OFFER",price:x,acknowledge:!0}),g(null)},children:"仍然提交报价"}),p.jsx("button",{className:"button secondary full",onClick:()=>g(null),children:"返回修改 · 不消耗时间"})]})}),xe&&p.jsx(hi,{title:"交给聚落回收箱？",subtitle:"A SECOND USE · 应急变现",onClose:()=>y(null),children:p.jsxs("div",{className:"confirmation-content",children:[p.jsx(ur,{id:xe.defId,className:"confirm-sprite"}),p.jsx("h3",{children:ln(xe.defId).name}),p.jsxs("div",{className:"confirm-price",children:[p.jsxs("span",{children:["购入成本 ",xe.cost," 票"]}),p.jsx(wi,{amount:Math.floor(Ss(xe,r.market)*.35)})]}),p.jsxs("p",{children:["耗时 6 分钟，完成后无法取回。不计入售出件数，不增加信誉。今日剩余 ",2-r.recycled," ","次。"]}),p.jsx("button",{className:"button primary full",onClick:()=>{B({type:"RECYCLE",uid:xe.uid}),y(null)},children:"确认回收变现"})]})}),r.phase==="closing"&&p.jsx(hi,{title:"今天，就到这里吧",subtitle:`CLOSING TIME · 第 ${r.day} 天`,dismissible:Un(r)>0,onClose:()=>B({type:"BACK"}),children:p.jsxs("div",{className:"closing-content",children:[p.jsx(ox,{size:38,strokeWidth:1.2}),p.jsx("p",{children:"合上账本前，再看一眼今天的收支。"}),p.jsxs("div",{className:"closing-rows",children:[p.jsxs("div",{children:[p.jsx("span",{children:"手头现金"}),p.jsx(wi,{amount:r.cash})]}),p.jsxs("div",{children:[p.jsx("span",{children:"每日耗材"}),p.jsx("span",{children:"−15 票"})]}),se>0&&p.jsxs("div",{children:[p.jsx("span",{children:"今日到期租金"}),p.jsxs("span",{children:["−",se," 票"]})]}),p.jsxs("div",{className:"total",children:[p.jsx("span",{children:"结算后现金"}),r.cash>=15+se?p.jsx(wi,{amount:r.cash-15-se}):p.jsx("span",{className:"danger-text",children:"无法结清"})]})]}),r.cash<15+se&&p.jsxs("div",{className:"closing-warning",children:["距今日费用还差 ",15+se-r.cash," 票。现在结算将无法续业。",Un(r)>0?"可以返回营业，尝试委托或回收变现。":"营业时间已经用尽。"]}),r.commission==="available"&&Un(r)>=90&&p.jsx("p",{className:"muted small",children:"今日社区委托尚未完成，仍可返回赚取 40 票。"}),k&&p.jsx("p",{className:"muted small",children:"当前未交割的交易将取消，不付款、不转移货物。"}),p.jsxs("button",{className:"button primary full",onClick:()=>{u(null),B({type:"SETTLE"})},children:["确认打烊并结算 ",p.jsx(Ys,{size:17})]}),Un(r)>0&&p.jsx("button",{className:"button secondary full",onClick:()=>B({type:"BACK"}),children:"再营业一会儿"})]})}),r.phase==="report"&&r.report&&p.jsx(hi,{title:`第 ${r.day} 天 · 营业札记`,subtitle:"THE DAY IN NUMBERS",dismissible:!1,onClose:()=>{},children:p.jsxs("div",{className:"report-content",children:[p.jsx("span",{className:"report-stamp",children:r.outcome==="bankrupt"?"未能结清":"已结清"}),p.jsx("p",{children:"灯光慢慢暗下来，今天的故事都留在账本里。"}),p.jsxs("div",{className:"report-rows",children:[p.jsxs("div",{children:[p.jsxs("span",{children:["营业收入 ",p.jsx("small",{children:"销售、委托与回收"})]}),p.jsxs("b",{children:["+",r.report.income," 票"]})]}),p.jsxs("div",{children:[p.jsx("span",{children:"收购支出"}),p.jsxs("b",{children:["−",r.report.purchases," 票"]})]}),p.jsxs("div",{children:[p.jsx("span",{children:"已付固定费用"}),p.jsxs("b",{children:["−",r.report.fees," 票"]})]}),p.jsxs("div",{className:"gross-row",children:[p.jsx("span",{children:"其中：已实现销售毛利"}),p.jsxs("span",{children:[r.report.gross," 票"]})]}),p.jsxs("div",{className:"total",children:[p.jsx("span",{children:"期末现金"}),p.jsx(wi,{amount:r.cash})]})]}),r.report.missing>0&&p.jsxs("p",{className:"danger-text",children:["到期费用仍缺 ",r.report.missing," 票，租约未能继续。"]}),p.jsx("p",{className:"report-tomorrow",children:r.outcome?"七日之约，走到了这一页。":`明日提醒：${r.day+1===3?"准备 90 票租金，别忘了留出耗材。":r.day+1===7?"最后一天，准备 210 票租金与周转金。":"行情将更新，记得把新收的旧物上架。"}`}),p.jsxs("button",{className:"button primary full",onClick:()=>B({type:"NEXT"}),children:[r.outcome?"翻到故事的最后一页":`迎接第 ${r.day+1} 天`,p.jsx(Ys,{size:17})]})]})}),r.phase==="ending"&&!l&&p.jsx(hi,{title:r.outcome==="win"?"这盏灯，会继续亮着":r.outcome==="survive"?"小店还在，故事待续":"暂时，把门轻轻带上",subtitle:r.outcome==="win"?"ENDING 01 · 长明的旧货铺":r.outcome==="survive"?"ENDING 02 · 勉强续业":"ENDING 03 · 来日再开张",dismissible:!1,wide:!0,onClose:()=>{},children:p.jsxs("div",{className:"ending-content",children:[p.jsxs("div",{className:"ending-art",children:[p.jsx("div",{}),p.jsx(Fh,{size:38}),p.jsx("blockquote",{children:r.outcome==="win"?`旧物找到了新家，
你也一样。`:r.outcome==="survive"?`站台还有来客，
明天还有机会。`:`每一次重新开门，
都是新的开始。`})]}),p.jsxs("div",{className:"ending-story",children:[p.jsx("p",{children:r.outcome==="win"?"第七天的夜里，陶叔送来一碗热汤，周砾替门轴上了油。林鹭说，远处的商队已经记住了你的招牌。你把新的租约压在台灯下，门口的瓶盖铃铛，明天还会响。":r.outcome==="survive"?"租金结清了，但柜台上的票子和货架上的空位提醒你，经营还需要一点耐心。聚落愿意再给你一次机会。下一回，旧物会找到更合适的人。":"票子没能凑够，租约暂时停在了这一页。你把没卖出的旧物仔细收好，擦净台灯。门外仍有风，下一次，你会更懂得怎么和这座聚落做生意。"}),p.jsx("div",{className:"ending-goals",children:[[r.cash>=120,"期末现金",`${r.cash} / 120 票`],[r.reputation>=40,"店铺信誉",`${r.reputation} / 40`],[r.sold>=12,"累计售出",`${r.sold} / 12 件`]].map(([Q,de,je])=>p.jsxs("div",{children:[Q?p.jsx(_s,{size:17}):p.jsx(Hh,{size:17}),p.jsx("span",{children:de}),p.jsx("b",{children:je})]},String(de)))}),p.jsxs("p",{className:"muted small",children:["经营种子：",r.seed," · 已经营 ",r.day," 天"]}),p.jsxs("button",{className:"button primary full",onClick:()=>he(`GREYLINE-${Date.now().toString(36).toUpperCase()}`),children:[p.jsx(Gh,{size:16}),"再开一次店"]}),p.jsx("button",{className:"button secondary full",onClick:()=>u("ledger"),children:"翻阅这次的账本"})]})]})})]})}nE.createRoot(document.getElementById("root")).render(p.jsx(W1.StrictMode,{children:p.jsx(XR,{})}));
