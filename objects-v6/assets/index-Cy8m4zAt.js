(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))o(l);new MutationObserver(l=>{for(const u of l)if(u.type==="childList")for(const h of u.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&o(h)}).observe(document,{childList:!0,subtree:!0});function i(l){const u={};return l.integrity&&(u.integrity=l.integrity),l.referrerPolicy&&(u.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?u.credentials="include":l.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function o(l){if(l.ep)return;l.ep=!0;const u=i(l);fetch(l.href,u)}})();function fy(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Ph={exports:{}},Tl={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Y_;function W1(){if(Y_)return Tl;Y_=1;var s=Symbol.for("react.transitional.element"),t=Symbol.for("react.fragment");function i(o,l,u){var h=null;if(u!==void 0&&(h=""+u),l.key!==void 0&&(h=""+l.key),"key"in l){u={};for(var p in l)p!=="key"&&(u[p]=l[p])}else u=l;return l=u.ref,{$$typeof:s,type:o,key:h,ref:l!==void 0?l:null,props:u}}return Tl.Fragment=t,Tl.jsx=i,Tl.jsxs=i,Tl}var W_;function Z1(){return W_||(W_=1,Ph.exports=W1()),Ph.exports}var d=Z1(),Ih={exports:{}},dt={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Z_;function K1(){if(Z_)return dt;Z_=1;var s=Symbol.for("react.transitional.element"),t=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),u=Symbol.for("react.consumer"),h=Symbol.for("react.context"),p=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),g=Symbol.for("react.memo"),x=Symbol.for("react.lazy"),v=Symbol.for("react.activity"),S=Symbol.for("react.view_transition"),E=Symbol.iterator;function b(j){return j===null||typeof j!="object"?null:(j=E&&j[E]||j["@@iterator"],typeof j=="function"?j:null)}var T={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,_={};function L(j,de,$){this.props=j,this.context=de,this.refs=_,this.updater=$||T}L.prototype.isReactComponent={},L.prototype.setState=function(j,de){if(typeof j!="object"&&typeof j!="function"&&j!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,j,de,"setState")},L.prototype.forceUpdate=function(j){this.updater.enqueueForceUpdate(this,j,"forceUpdate")};function z(){}z.prototype=L.prototype;function N(j,de,$){this.props=j,this.context=de,this.refs=_,this.updater=$||T}var V=N.prototype=new z;V.constructor=N,M(V,L.prototype),V.isPureReactComponent=!0;var H=Array.isArray;function I(){}var Y={H:null,A:null,T:null,S:null},U=Object.prototype.hasOwnProperty;function R(j,de,$){var oe=$.ref;return{$$typeof:s,type:j,key:de,ref:oe!==void 0?oe:null,props:$}}function G(j,de){return R(j.type,de,j.props)}function ie(j){return typeof j=="object"&&j!==null&&j.$$typeof===s}function ue(j){var de={"=":"=0",":":"=2"};return"$"+j.replace(/[=:]/g,function($){return de[$]})}var Z=/\/+/g;function B(j,de){return typeof j=="object"&&j!==null&&j.key!=null?ue(""+j.key):de.toString(36)}function O(j){switch(j.status){case"fulfilled":return j.value;case"rejected":throw j.reason;default:switch(typeof j.status=="string"?j.then(I,I):(j.status="pending",j.then(function(de){j.status==="pending"&&(j.status="fulfilled",j.value=de)},function(de){j.status==="pending"&&(j.status="rejected",j.reason=de)})),j.status){case"fulfilled":return j.value;case"rejected":throw j.reason}}throw j}function k(j,de,$,oe,Ee){var Le=typeof j;(Le==="undefined"||Le==="boolean")&&(j=null);var Ae=!1;if(j===null)Ae=!0;else switch(Le){case"bigint":case"string":case"number":Ae=!0;break;case"object":switch(j.$$typeof){case s:case t:Ae=!0;break;case x:return Ae=j._init,k(Ae(j._payload),de,$,oe,Ee)}}if(Ae)return Ee=Ee(j),Ae=oe===""?"."+B(j,0):oe,H(Ee)?($="",Ae!=null&&($=Ae.replace(Z,"$&/")+"/"),k(Ee,de,$,"",function(D){return D})):Ee!=null&&(ie(Ee)&&(Ee=G(Ee,$+(Ee.key==null||j&&j.key===Ee.key?"":(""+Ee.key).replace(Z,"$&/")+"/")+Ae)),de.push(Ee)),1;Ae=0;var Te=oe===""?".":oe+":";if(H(j))for(var Xe=0;Xe<j.length;Xe++)oe=j[Xe],Le=Te+B(oe,Xe),Ae+=k(oe,de,$,Le,Ee);else if(Xe=b(j),typeof Xe=="function")for(j=Xe.call(j),Xe=0;!(oe=j.next()).done;)oe=oe.value,Le=Te+B(oe,Xe++),Ae+=k(oe,de,$,Le,Ee);else if(Le==="object"){if(typeof j.then=="function")return k(O(j),de,$,oe,Ee);throw de=String(j),Error("Objects are not valid as a React child (found: "+(de==="[object Object]"?"object with keys {"+Object.keys(j).join(", ")+"}":de)+"). If you meant to render a collection of children, use an array instead.")}return Ae}function X(j,de,$){if(j==null)return j;var oe=[],Ee=0;return k(j,oe,"","",function(Le){return de.call($,Le,Ee++)}),oe}function ve(j){if(j._status===-1){var de=j._result,$=de();$.then(function(oe){(j._status===0||j._status===-1)&&(j._status=1,j._result=oe,$.status===void 0&&($.status="fulfilled",$.value=oe))},function(oe){(j._status===0||j._status===-1)&&(j._status=2,j._result=oe,$.status===void 0&&($.status="rejected",$.reason=oe))}),j._status===-1&&(j._status=0,j._result=$)}if(j._status===1)return j._result.default;throw j._result}var _e=typeof reportError=="function"?reportError:function(j){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var de=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof j=="object"&&j!==null&&typeof j.message=="string"?String(j.message):String(j),error:j});if(!window.dispatchEvent(de))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",j);return}console.error(j)};function He(j){var de=Y.T,$={};$.types=de!==null?de.types:null,Y.T=$;try{var oe=j(),Ee=Y.S;Ee!==null&&Ee($,oe),typeof oe=="object"&&oe!==null&&typeof oe.then=="function"&&oe.then(I,_e)}catch(Le){_e(Le)}finally{de!==null&&$.types!==null&&(de.types=$.types),Y.T=de}}function $e(j){var de=Y.T;if(de!==null){var $=de.types;$===null?de.types=[j]:$.indexOf(j)===-1&&$.push(j)}else He($e.bind(null,j))}var xt={map:X,forEach:function(j,de,$){X(j,function(){de.apply(this,arguments)},$)},count:function(j){var de=0;return X(j,function(){de++}),de},toArray:function(j){return X(j,function(de){return de})||[]},only:function(j){if(!ie(j))throw Error("React.Children.only expected to receive a single React element child.");return j}};return dt.Activity=v,dt.Children=xt,dt.Component=L,dt.Fragment=i,dt.Profiler=l,dt.PureComponent=N,dt.StrictMode=o,dt.Suspense=m,dt.ViewTransition=S,dt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Y,dt.__COMPILER_RUNTIME={__proto__:null,c:function(j){return Y.H.useMemoCache(j)}},dt.addTransitionType=$e,dt.cache=function(j){return function(){return j.apply(null,arguments)}},dt.cacheSignal=function(){return null},dt.cloneElement=function(j,de,$){if(j==null)throw Error("The argument must be a React element, but you passed "+j+".");var oe=M({},j.props),Ee=j.key;if(de!=null)for(Le in de.key!==void 0&&(Ee=""+de.key),de)!U.call(de,Le)||Le==="key"||Le==="__self"||Le==="__source"||Le==="ref"&&de.ref===void 0||(oe[Le]=de[Le]);var Le=arguments.length-2;if(Le===1)oe.children=$;else if(1<Le){for(var Ae=Array(Le),Te=0;Te<Le;Te++)Ae[Te]=arguments[Te+2];oe.children=Ae}return R(j.type,Ee,oe)},dt.createContext=function(j){return j={$$typeof:h,_currentValue:j,_currentValue2:j,_threadCount:0,Provider:null,Consumer:null},j.Provider=j,j.Consumer={$$typeof:u,_context:j},j},dt.createElement=function(j,de,$){var oe,Ee={},Le=null;if(de!=null)for(oe in de.key!==void 0&&(Le=""+de.key),de)U.call(de,oe)&&oe!=="key"&&oe!=="__self"&&oe!=="__source"&&(Ee[oe]=de[oe]);var Ae=arguments.length-2;if(Ae===1)Ee.children=$;else if(1<Ae){for(var Te=Array(Ae),Xe=0;Xe<Ae;Xe++)Te[Xe]=arguments[Xe+2];Ee.children=Te}if(j&&j.defaultProps)for(oe in Ae=j.defaultProps,Ae)Ee[oe]===void 0&&(Ee[oe]=Ae[oe]);return R(j,Le,Ee)},dt.createRef=function(){return{current:null}},dt.forwardRef=function(j){return{$$typeof:p,render:j}},dt.isValidElement=ie,dt.lazy=function(j){return{$$typeof:x,_payload:{_status:-1,_result:j},_init:ve}},dt.memo=function(j,de){return{$$typeof:g,type:j,compare:de===void 0?null:de}},dt.startTransition=He,dt.unstable_useCacheRefresh=function(){return Y.H.useCacheRefresh()},dt.use=function(j){return Y.H.use(j)},dt.useActionState=function(j,de,$){return Y.H.useActionState(j,de,$)},dt.useCallback=function(j,de){return Y.H.useCallback(j,de)},dt.useContext=function(j){return Y.H.useContext(j)},dt.useDebugValue=function(){},dt.useDeferredValue=function(j,de){return Y.H.useDeferredValue(j,de)},dt.useEffect=function(j,de){return Y.H.useEffect(j,de)},dt.useEffectEvent=function(j){return Y.H.useEffectEvent(j)},dt.useId=function(){return Y.H.useId()},dt.useImperativeHandle=function(j,de,$){return Y.H.useImperativeHandle(j,de,$)},dt.useInsertionEffect=function(j,de){return Y.H.useInsertionEffect(j,de)},dt.useLayoutEffect=function(j,de){return Y.H.useLayoutEffect(j,de)},dt.useMemo=function(j,de){return Y.H.useMemo(j,de)},dt.useOptimistic=function(j,de){return Y.H.useOptimistic(j,de)},dt.useReducer=function(j,de,$){return Y.H.useReducer(j,de,$)},dt.useRef=function(j){return Y.H.useRef(j)},dt.useState=function(j){return Y.H.useState(j)},dt.useSyncExternalStore=function(j,de,$){return Y.H.useSyncExternalStore(j,de,$)},dt.useTransition=function(){return Y.H.useTransition()},dt.version="19.3.1",dt}var K_;function Mm(){return K_||(K_=1,Ih.exports=K1()),Ih.exports}var ze=Mm();const Q1=fy(ze);var Bh={exports:{}},bl={},Fh={exports:{}},Hh={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Q_;function J1(){return Q_||(Q_=1,(function(s){function t(O,k){var X=O.length;O.push(k);e:for(;0<X;){var ve=X-1>>>1,_e=O[ve];if(0<l(_e,k))O[ve]=k,O[X]=_e,X=ve;else break e}}function i(O){return O.length===0?null:O[0]}function o(O){if(O.length===0)return null;var k=O[0],X=O.pop();if(X!==k){O[0]=X;e:for(var ve=0,_e=O.length,He=_e>>>1;ve<He;){var $e=2*(ve+1)-1,xt=O[$e],j=$e+1,de=O[j];if(0>l(xt,X))j<_e&&0>l(de,xt)?(O[ve]=de,O[j]=X,ve=j):(O[ve]=xt,O[$e]=X,ve=$e);else if(j<_e&&0>l(de,X))O[ve]=de,O[j]=X,ve=j;else break e}}return k}function l(O,k){var X=O.sortIndex-k.sortIndex;return X!==0?X:O.id-k.id}if(s.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var u=performance;s.unstable_now=function(){return u.now()}}else{var h=Date,p=h.now();s.unstable_now=function(){return h.now()-p}}var m=[],g=[],x=1,v=null,S=3,E=!1,b=!1,T=!1,M=!1,_=typeof setTimeout=="function"?setTimeout:null,L=typeof clearTimeout=="function"?clearTimeout:null,z=typeof setImmediate<"u"?setImmediate:null;function N(O){for(var k=i(g);k!==null;){if(k.callback===null)o(g);else if(k.startTime<=O)o(g),k.sortIndex=k.expirationTime,t(m,k);else break;k=i(g)}}function V(O){if(T=!1,N(O),!b)if(i(m)!==null)b=!0,H||(H=!0,ie());else{var k=i(g);k!==null&&B(V,k.startTime-O)}}var H=!1,I=-1,Y=5,U=-1;function R(){return M?!0:!(s.unstable_now()-U<Y)}function G(){if(M=!1,H){var O=s.unstable_now();U=O;var k=!0;try{e:{b=!1,T&&(T=!1,L(I),I=-1),E=!0;var X=S;try{t:{for(N(O),v=i(m);v!==null&&!(v.expirationTime>O&&R());){var ve=v.callback;if(typeof ve=="function"){v.callback=null,S=v.priorityLevel;var _e=ve(v.expirationTime<=O);if(O=s.unstable_now(),typeof _e=="function"){v.callback=_e,N(O),k=!0;break t}v===i(m)&&o(m),N(O)}else o(m);v=i(m)}if(v!==null)k=!0;else{var He=i(g);He!==null&&B(V,He.startTime-O),k=!1}}break e}finally{v=null,S=X,E=!1}k=void 0}}finally{k?ie():H=!1}}}var ie;if(typeof z=="function")ie=function(){z(G)};else if(typeof MessageChannel<"u"){var ue=new MessageChannel,Z=ue.port2;ue.port1.onmessage=G,ie=function(){Z.postMessage(null)}}else ie=function(){_(G,0)};function B(O,k){I=_(function(){O(s.unstable_now())},k)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(O){O.callback=null},s.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Y=0<O?Math.floor(1e3/O):5},s.unstable_getCurrentPriorityLevel=function(){return S},s.unstable_next=function(O){switch(S){case 1:case 2:case 3:var k=3;break;default:k=S}var X=S;S=k;try{return O()}finally{S=X}},s.unstable_requestPaint=function(){M=!0},s.unstable_runWithPriority=function(O,k){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var X=S;S=O;try{return k()}finally{S=X}},s.unstable_scheduleCallback=function(O,k,X){var ve=s.unstable_now();switch(typeof X=="object"&&X!==null?(X=X.delay,X=typeof X=="number"&&0<X?ve+X:ve):X=ve,O){case 1:var _e=-1;break;case 2:_e=250;break;case 5:_e=1073741823;break;case 4:_e=1e4;break;default:_e=5e3}return _e=X+_e,O={id:x++,callback:k,priorityLevel:O,startTime:X,expirationTime:_e,sortIndex:-1},X>ve?(O.sortIndex=X,t(g,O),i(m)===null&&O===i(g)&&(T?(L(I),I=-1):T=!0,B(V,X-ve))):(O.sortIndex=_e,t(m,O),b||E||(b=!0,H||(H=!0,ie()))),O},s.unstable_shouldYield=R,s.unstable_wrapCallback=function(O){var k=S;return function(){var X=S;S=k;try{return O.apply(this,arguments)}finally{S=X}}}})(Hh)),Hh}var J_;function $1(){return J_||(J_=1,Fh.exports=J1()),Fh.exports}var jh={exports:{}},Un={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var $_;function eE(){if($_)return Un;$_=1;var s=Mm();function t(x){var v="https://react.dev/errors/"+x;if(1<arguments.length){v+="?args[]="+encodeURIComponent(arguments[1]);for(var S=2;S<arguments.length;S++)v+="&args[]="+encodeURIComponent(arguments[S])}return"Minified React error #"+x+"; visit "+v+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var o={d:{f:i,r:function(){throw Error(t(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal"),u=Symbol.for("react.recoverable"),h=Symbol.for("react.optimistic_key");function p(x,v,S){var E=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:E==null?null:E===h?h:""+E,children:x,containerInfo:v,implementation:S}}var m=s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function g(x,v){if(x==="font")return"";if(typeof v=="string")return v==="use-credentials"?v:""}return Un.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=o,Un.browser=function(x){return{$$typeof:u,_reason:x}},Un.createPortal=function(x,v){var S=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!v||v.nodeType!==1&&v.nodeType!==9&&v.nodeType!==11)throw Error(t(299));return p(x,v,null,S)},Un.flushSync=function(x){var v=m.T,S=o.p;try{if(m.T=null,o.p=2,x)return x()}finally{m.T=v,o.p=S,o.d.f()}},Un.preconnect=function(x,v){typeof x=="string"&&(v?(v=v.crossOrigin,v=typeof v=="string"?v==="use-credentials"?v:"":void 0):v=null,o.d.C(x,v))},Un.prefetchDNS=function(x){typeof x=="string"&&o.d.D(x)},Un.preinit=function(x,v){if(typeof x=="string"&&v&&typeof v.as=="string"){var S=v.as,E=g(S,v.crossOrigin),b=typeof v.integrity=="string"?v.integrity:void 0,T=typeof v.fetchPriority=="string"?v.fetchPriority:void 0;S==="style"?o.d.S(x,typeof v.precedence=="string"?v.precedence:void 0,{crossOrigin:E,integrity:b,fetchPriority:T}):S==="script"&&o.d.X(x,{crossOrigin:E,integrity:b,fetchPriority:T,nonce:typeof v.nonce=="string"?v.nonce:void 0})}},Un.preinitModule=function(x,v){if(typeof x=="string")if(typeof v=="object"&&v!==null){if(v.as==null||v.as==="script"){var S=g(v.as,v.crossOrigin);o.d.M(x,{crossOrigin:S,integrity:typeof v.integrity=="string"?v.integrity:void 0,nonce:typeof v.nonce=="string"?v.nonce:void 0,fetchPriority:typeof v.fetchPriority=="string"?v.fetchPriority:void 0})}}else v==null&&o.d.M(x)},Un.preload=function(x,v){if(typeof x=="string"&&typeof v=="object"&&v!==null&&typeof v.as=="string"){var S=v.as,E=g(S,v.crossOrigin);o.d.L(x,S,{crossOrigin:E,integrity:typeof v.integrity=="string"?v.integrity:void 0,nonce:typeof v.nonce=="string"?v.nonce:void 0,type:typeof v.type=="string"?v.type:void 0,fetchPriority:typeof v.fetchPriority=="string"?v.fetchPriority:void 0,referrerPolicy:typeof v.referrerPolicy=="string"?v.referrerPolicy:void 0,imageSrcSet:typeof v.imageSrcSet=="string"?v.imageSrcSet:void 0,imageSizes:typeof v.imageSizes=="string"?v.imageSizes:void 0,media:typeof v.media=="string"?v.media:void 0})}},Un.preloadModule=function(x,v){if(typeof x=="string")if(v){var S=g(v.as,v.crossOrigin);o.d.m(x,{as:typeof v.as=="string"&&v.as!=="script"?v.as:void 0,crossOrigin:S,integrity:typeof v.integrity=="string"?v.integrity:void 0,nonce:typeof v.nonce=="string"?v.nonce:void 0,fetchPriority:typeof v.fetchPriority=="string"?v.fetchPriority:void 0})}else o.d.m(x)},Un.requestFormReset=function(x){o.d.r(x)},Un.unstable_batchedUpdates=function(x,v){return x(v)},Un.useFormState=function(x,v,S){return m.H.useFormState(x,v,S)},Un.useFormStatus=function(){return m.H.useHostTransitionStatus()},Un.version="19.3.1",Un}var ex;function dy(){if(ex)return jh.exports;ex=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(t){console.error(t)}}return s(),jh.exports=eE(),jh.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var tx;function tE(){if(tx)return bl;tx=1;var s=$1(),t=Mm(),i=dy();function o(e){var n="https://react.dev/errors/"+e;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function u(e){for(var n=e,a=n;a&&!a.alternate;)n=a,(n.flags&4098)!==0&&(e=n.return),a=n.return;for(;n.return;)n=n.return;return n.tag===3?e:null}function h(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function p(e){if(e.tag===31){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function m(e){if(u(e)!==e)throw Error(o(188))}function g(e){var n=e.alternate;if(!n){if(n=u(e),n===null)throw Error(o(188));return n!==e?null:e}for(var a=e,r=n;;){var c=a.return;if(c===null)break;var f=c.alternate;if(f===null){if(r=c.return,r!==null){a=r;continue}break}if(c.child===f.child){for(f=c.child;f;){if(f===a)return m(c),e;if(f===r)return m(c),n;f=f.sibling}throw Error(o(188))}if(a.return!==r.return)a=c,r=f;else{for(var y=!1,A=c.child;A;){if(A===a){y=!0,a=c,r=f;break}if(A===r){y=!0,r=c,a=f;break}A=A.sibling}if(!y){for(A=f.child;A;){if(A===a){y=!0,a=f,r=c;break}if(A===r){y=!0,r=f,a=c;break}A=A.sibling}if(!y)throw Error(o(189))}}if(a.alternate!==r)throw Error(o(190))}if(a.tag!==3)throw Error(o(188));return a.stateNode.current===a?e:n}function x(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e;for(e=e.child;e!==null;){if(n=x(e),n!==null)return n;e=e.sibling}return null}function v(e,n,a,r,c,f){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&a(e,r,c,f)||(e.tag!==22||e.memoizedState===null)&&(n||e.tag!==5&&e.tag!==27)&&v(e.child,n,a,r,c,f))return!0;e=e.sibling}return!1}function S(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function E(e){var n=!1;for(e=e.return;e!==null&&(e.tag===4&&(n=!0),!(e.tag===3||e.tag===5||e.tag===27));)e=e.return;return n}function b(e){var n=[null,null],a=S(e);return a===null||T(n,e,a.child,{foundSelf:!1}),n}function T(e,n,a,r){for(;a!==null;){if(a===n)r.foundSelf=!0;else if(a.tag===5||a.tag===27||a.tag===6){if(r.foundSelf)return e[1]=a,!0;e[0]=a}else if((a.tag!==22||a.memoizedState===null)&&T(e,n,a.child,r))return!0;a=a.sibling}return!1}function M(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(o(559))}}var _=null,L=null;function z(e,n,a){return e===a?!0:e===n?(_=e,!0):!1}function N(e,n,a){return e===a?(L=e,!1):e===n?(L!==null&&(_=e),!0):!1}function V(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function H(e,n,a){for(var r=0,c=e;c;c=a(c))r++;c=0;for(var f=n;f;f=a(f))c++;for(;0<r-c;)e=a(e),r--;for(;0<c-r;)n=a(n),c--;for(;r--;){if(e===n||n!==null&&e===n.alternate)return e;e=a(e),n=a(n)}return null}var I=Object.assign,Y=Symbol.for("react.element"),U=Symbol.for("react.transitional.element"),R=Symbol.for("react.portal"),G=Symbol.for("react.fragment"),ie=Symbol.for("react.strict_mode"),ue=Symbol.for("react.profiler"),Z=Symbol.for("react.consumer"),B=Symbol.for("react.context"),O=Symbol.for("react.forward_ref"),k=Symbol.for("react.suspense"),X=Symbol.for("react.suspense_list"),ve=Symbol.for("react.memo"),_e=Symbol.for("react.lazy"),He=Symbol.for("react.activity"),$e=Symbol.for("react.legacy_hidden"),xt=Symbol.for("react.memo_cache_sentinel"),j=Symbol.for("react.view_transition"),de=Symbol.for("react.recoverable"),$=Symbol.iterator;function oe(e){return e===null||typeof e!="object"?null:(e=$&&e[$]||e["@@iterator"],typeof e=="function"?e:null)}var Ee=Symbol.for("react.client.reference");function Le(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Ee?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case G:return"Fragment";case ue:return"Profiler";case ie:return"StrictMode";case k:return"Suspense";case X:return"SuspenseList";case He:return"Activity";case j:return"ViewTransition"}if(typeof e=="object")switch(e.$$typeof){case R:return"Portal";case B:return e.displayName||"Context";case Z:return(e._context.displayName||"Context")+".Consumer";case O:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ve:return n=e.displayName||null,n!==null?n:Le(e.type)||"Memo";case _e:n=e._payload,e=e._init;try{return Le(e(n))}catch{}}return null}var Ae=Array.isArray,Te=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Xe=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,D={pending:!1,data:null,method:null,action:null},Ce=[],Ve=-1;function Qe(e){return{current:e}}function Be(e){0>Ve||(e.current=Ce[Ve],Ce[Ve]=null,Ve--)}function lt(e,n){Ve++,Ce[Ve]=e.current,e.current=n}var ke=Qe(null),Me=Qe(null),it=Qe(null),At=Qe(null);function P(e,n){switch(lt(it,n),lt(Me,e),lt(ke,null),n.nodeType){case 9:case 11:e=(e=n.documentElement)&&(e=e.namespaceURI)?n_(e):0;break;default:if(e=n.tagName,n=n.namespaceURI)n=n_(n),e=i_(n,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}Be(ke),lt(ke,e)}function C(){Be(ke),Be(Me),Be(it)}function se(e){var n=e.memoizedState;n!==null&&(Qr._currentValue=n.memoizedState,lt(At,e)),n=ke.current;var a=i_(n,e.type);n!==a&&(lt(Me,e),lt(ke,a))}function pe(e){Me.current===e&&(Be(ke),Be(Me)),At.current===e&&(Be(At),Qr._currentValue=D)}var xe,he;function Ze(e){if(xe===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);xe=n&&n[1]||"",he=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+xe+e+he}var Ne=!1;function De(e,n){if(!e||Ne)return"";Ne=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(n){var ge=function(){throw Error()};if(Object.defineProperty(ge.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(ge,[])}catch(Fe){var K=Fe}Reflect.construct(e,[],ge)}else{try{ge.call()}catch(Fe){K=Fe}ge=!1;try{var re=Object.getOwnPropertyDescriptor(e.prototype,"props");Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),ge=!0,new e}finally{ge&&(re!==void 0?Object.defineProperty(e.prototype,"props",re):delete e.prototype.props)}}}else{try{throw Error()}catch(Fe){K=Fe}(ge=e())&&typeof ge.catch=="function"&&ge.catch(function(){})}}catch(Fe){if(Fe&&K&&typeof Fe.stack=="string")return[Fe.stack,K.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var c=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,"name");c&&c.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=r.DetermineComponentFrameRoot(),y=f[0],A=f[1];if(y&&A){var F=y.split(`
`),J=A.split(`
`);for(c=r=0;r<F.length&&!F[r].includes("DetermineComponentFrameRoot");)r++;for(;c<J.length&&!J[c].includes("DetermineComponentFrameRoot");)c++;if(r===F.length||c===J.length)for(r=F.length-1,c=J.length-1;1<=r&&0<=c&&F[r]!==J[c];)c--;for(;1<=r&&0<=c;r--,c--)if(F[r]!==J[c]){if(r!==1||c!==1)do if(r--,c--,0>c||F[r]!==J[c]){var le=`
`+F[r].replace(" at new "," at ");return e.displayName&&le.includes("<anonymous>")&&(le=le.replace("<anonymous>",e.displayName)),le}while(1<=r&&0<=c);break}}}finally{Ne=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?Ze(a):""}function Ye(e,n){switch(e.tag){case 26:case 27:case 5:return Ze(e.type);case 16:return Ze("Lazy");case 13:return e.child!==n&&n!==null?Ze("Suspense Fallback"):Ze("Suspense");case 19:return Ze("SuspenseList");case 0:case 15:return De(e.type,!1);case 11:return De(e.type.render,!1);case 1:return De(e.type,!0);case 31:return Ze("Activity");case 30:return Ze("ViewTransition");default:return""}}function Se(e){try{var n="",a=null;do n+=Ye(e,a),a=e,e=e.return;while(e);return n}catch(r){return`
Error generating stack: `+r.message+`
`+r.stack}}var Ue=Object.prototype.hasOwnProperty,at=s.unstable_scheduleCallback,Je=s.unstable_cancelCallback,Oe=s.unstable_shouldYield,ft=s.unstable_requestPaint,W=s.unstable_now,we=s.unstable_getCurrentPriorityLevel,Ie=s.unstable_ImmediatePriority,Ke=s.unstable_UserBlockingPriority,be=s.unstable_NormalPriority,ye=s.unstable_LowPriority,nt=s.unstable_IdlePriority,ht=s.log,qt=s.unstable_setDisableYieldValue,Ct=null,nn=null;function _n(e){if(typeof ht=="function"&&qt(e),nn&&typeof nn.setStrictMode=="function")try{nn.setStrictMode(Ct,e)}catch{}}var zn=Math.clz32?Math.clz32:Wl,ha=Math.log,Oo=Math.LN2;function Wl(e){return e>>>=0,e===0?32:31-(ha(e)/Oo|0)|0}var ws=256,pa=262144,Ns=4194304;function _i(e){var n=e&42;if(n!==0)return n;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Ds(e,n,a){var r=e.pendingLanes;if(r===0)return 0;var c=0,f=e.suspendedLanes,y=e.pingedLanes;e=e.warmLanes;var A=r&134217727;return A!==0?(r=A&~f,r!==0?c=_i(r):(y&=A,y!==0?c=_i(y):a||(a=A&~e,a!==0&&(c=_i(a))))):(A=r&~f,A!==0?c=_i(A):y!==0?c=_i(y):a||(a=r&~e,a!==0&&(c=_i(a)))),c===0?0:n!==0&&n!==c&&(n&f)===0&&(f=c&-c,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:c}function Ha(e,n){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&n)===0}function Zl(e,n){(n&8)!==0&&(n|=n&32);var a=e.entangledLanes;if(a!==0)for(e=e.entanglements,a&=n;0<a;){var r=31-zn(a),c=1<<r;n|=e[r],a&=~c}return n}function uf(e,n){switch(e){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Kl(){var e=Ns;return Ns<<=1,(Ns&62914560)===0&&(Ns=4194304),e}function zo(e){for(var n=[],a=0;31>a;a++)n.push(e);return n}function Us(e,n){e.pendingLanes|=n,n!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function ff(e,n,a,r,c,f){var y=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var A=e.entanglements,F=e.expirationTimes,J=e.hiddenUpdates;for(a=y&~a;0<a;){var le=31-zn(a),ge=1<<le;A[le]=0,F[le]=-1;var K=J[le];if(K!==null)for(J[le]=null,le=0;le<K.length;le++){var re=K[le];re!==null&&(re.lane&=-536870913)}a&=~ge}r!==0&&w(e,r,0),f!==0&&c===0&&e.tag!==0&&(e.suspendedLanes|=f&~(y&~n))}function w(e,n,a){e.pendingLanes|=n,e.suspendedLanes&=~n;var r=31-zn(n);e.entangledLanes|=n,e.entanglements[r]=e.entanglements[r]|1073741824|a&261930}function ee(e,n){var a=e.entangledLanes|=n;for(e=e.entanglements;a;){var r=31-zn(a),c=1<<r;c&n|e[r]&n&&(e[r]|=n),a&=~c}}function ce(e,n){var a=n&-n;return a=(a&42)!==0?1:fe(a),(a&(e.suspendedLanes|n))!==0?0:a}function fe(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function te(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Re(){var e=Xe.p;return e!==0?e:(e=window.event,e===void 0?32:H_(e.type))}function je(e,n){var a=Xe.p;try{return Xe.p=e,n()}finally{Xe.p=a}}var qe=Math.random().toString(36).slice(2),Pe="__reactFiber$"+qe,et="__reactProps$"+qe,ct="__reactContainer$"+qe,rt="__reactEvents$"+qe,Et="__reactListeners$"+qe,Ht="__reactHandles$"+qe,en="__reactResources$"+qe,It="__reactMarker$"+qe,Ot="__reactLoad$"+qe;function ot(e){delete e[Pe],delete e[et],delete e[Et],delete e[Ht]}function Bt(e){var n;if(n=e[Pe])return n;for(var a=e.parentNode;a;){if(n=a[ct]||a[Pe]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(e=y_(e);e!==null;){if(a=e[Pe])return a;e=y_(e)}return n}e=a,a=e.parentNode}return null}function yt(e){if(e=e[Pe]||e[ct]){var n=e.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return e}return null}function xn(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e.stateNode;throw Error(o(33))}function ai(e){var n=e[en];return n||(n=e[en]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function zt(e){e[It]=!0}function ja(e){e[Ot]=void 0}var Qt=new Set,jn={};function dn(e,n){rn(e,n),rn(e+"Capture",n)}function rn(e,n){for(jn[e]=n,e=0;e<n.length;e++)Qt.add(n[e])}var Pn=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),pr={},Ki={};function hS(e){return Ue.call(Ki,e)?!0:Ue.call(pr,e)?!1:Pn.test(e)?Ki[e]=!0:(pr[e]=!0,!1)}var Pt=!1;function Gm(){var e=Pt;return Pt=!1,e}function Ql(e,n,a){if(hS(n))if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(n);return;case"boolean":var r=n.toLowerCase().slice(0,5);if(r!=="data-"&&r!=="aria-"){e.removeAttribute(n);return}}e.setAttribute(n,a)}}function Jl(e,n,a){if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttribute(n,a)}}function ma(e,n,a,r){if(r===null)e.removeAttribute(a);else{switch(typeof r){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(n,a,r)}}function si(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Vm(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function pS(e,n,a){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,n);if(!e.hasOwnProperty(n)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var c=r.get,f=r.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return c.call(this)},set:function(y){a=""+y,f.call(this,y)}}),Object.defineProperty(e,n,{enumerable:r.enumerable}),{getValue:function(){return a},setValue:function(y){a=""+y},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function df(e){if(!e._valueTracker){var n=Vm(e)?"checked":"value";e._valueTracker=pS(e,n,""+e[n])}}function km(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var a=n.getValue(),r="";return e&&(r=Vm(e)?e.checked?"true":"false":e.value),e=r,e!==a?(n.setValue(e),!0):!1}var mS=/[\n"\\]/g;function xi(e){return e.replace(mS,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function hf(e,n,a,r,c,f,y,A){e.name="",y!=null&&typeof y!="function"&&typeof y!="symbol"&&typeof y!="boolean"?e.type=y:e.removeAttribute("type"),n!=null?y==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+si(n)):e.value!==""+si(n)&&(e.value=""+si(n)):y!=="submit"&&y!=="reset"||e.removeAttribute("value"),n!=null?y==="number"&&e.value==n?pf(e,si(e.value)):pf(e,si(n)):a!=null?pf(e,si(a)):r!=null&&e.removeAttribute("value"),c==null&&f!=null&&(e.defaultChecked=!!f),c!=null&&(e.checked=c&&typeof c!="function"&&typeof c!="symbol"),A!=null&&typeof A!="function"&&typeof A!="symbol"&&typeof A!="boolean"?e.name=""+si(A):e.removeAttribute("name")}function Xm(e,n,a,r,c,f,y,A){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(e.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null)){df(e);return}a=a!=null?""+si(a):"",n=n!=null?""+si(n):a,A||n===e.value||(e.value=n),e.defaultValue=n}r=r??c,r=typeof r!="function"&&typeof r!="symbol"&&!!r,e.checked=A?e.checked:!!r,e.defaultChecked=!!r,y!=null&&typeof y!="function"&&typeof y!="symbol"&&typeof y!="boolean"&&(e.name=y),df(e)}function pf(e,n){e.defaultValue!==""+n&&(e.defaultValue=""+n)}function mr(e,n,a,r){if(e=e.options,n){n={};for(var c=0;c<a.length;c++)n["$"+a[c]]=!0;for(a=0;a<e.length;a++)c=n.hasOwnProperty("$"+e[a].value),e[a].selected!==c&&(e[a].selected=c),c&&r&&(e[a].defaultSelected=!0)}else{for(a=""+si(a),n=null,c=0;c<e.length;c++){if(e[c].value===a){e[c].selected=!0,r&&(e[c].defaultSelected=!0);return}n!==null||e[c].disabled||(n=e[c])}n!==null&&(n.selected=!0)}}function qm(e,n,a){if(n!=null&&(n=""+si(n),n!==e.value&&(e.value=n),a==null)){e.defaultValue!==n&&(e.defaultValue=n);return}e.defaultValue=a!=null?""+si(a):""}function Ym(e,n,a,r){if(n==null){if(r!=null){if(a!=null)throw Error(o(92));if(Ae(r)){if(1<r.length)throw Error(o(93));r=r[0]}a=r}a==null&&(a=""),n=a}a=si(n),e.defaultValue=a,r=e.textContent,r===a&&r!==""&&r!==null&&(e.value=r),df(e)}function gr(e,n){if(n){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=n;return}}e.textContent=n}var gS=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Wm(e,n,a){var r=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?r?e.setProperty(n,""):n==="float"?e.cssFloat="":e[n]="":r?e.setProperty(n,a):typeof a!="number"||a===0||gS.has(n)?n==="float"?e.cssFloat=a:e[n]=(""+a).trim():e[n]=a+"px"}function Zm(e,n,a){if(n!=null&&typeof n!="object")throw Error(o(62));if(e=e.style,a!=null){for(var r in a)!a.hasOwnProperty(r)||n!=null&&n.hasOwnProperty(r)||(r.indexOf("--")===0?e.setProperty(r,""):r==="float"?e.cssFloat="":e[r]="",Pt=!0);for(var c in n)r=n[c],n.hasOwnProperty(c)&&a[c]!==r&&(Wm(e,c,r),Pt=!0)}else for(var f in n)n.hasOwnProperty(f)&&Wm(e,f,n[f])}function mf(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var vS=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),_S=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function $l(e){return _S.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Qi(){}var gf=null;function vf(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var vr=null,_r=null;function Km(e){var n=yt(e);if(n&&(e=n.stateNode)){var a=e[et]||null;e:switch(e=n.stateNode,n.type){case"input":if(hf(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+xi(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var r=a[n];if(r!==e&&r.form===e.form){var c=r[et]||null;if(!c)throw Error(o(90));hf(r,c.value,c.defaultValue,c.defaultValue,c.checked,c.defaultChecked,c.type,c.name)}}for(n=0;n<a.length;n++)r=a[n],r.form===e.form&&km(r)}break e;case"textarea":qm(e,a.value,a.defaultValue);break e;case"select":n=a.value,n!=null&&mr(e,!!a.multiple,n,!1)}}}var _f=!1;function Qm(e,n,a){if(_f)return e(n,a);_f=!0;try{var r=e(n);return r}finally{if(_f=!1,(vr!==null||_r!==null)&&($c(),vr&&(n=vr,e=_r,_r=vr=null,Km(n),e)))for(n=0;n<e.length;n++)Km(e[n])}}function Po(e,n){var a=e.stateNode;if(a===null)return null;var r=a[et]||null;if(r===null)return null;a=r[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(o(231,n,typeof a));return a}var ga=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),xf=!1;if(ga)try{var Io={};Object.defineProperty(Io,"passive",{get:function(){xf=!0}}),window.addEventListener("test",Io,Io),window.removeEventListener("test",Io,Io)}catch{xf=!1}var Ga=null,yf=null,ec=null;function Jm(){if(ec)return ec;var e,n=yf,a=n.length,r,c="value"in Ga?Ga.value:Ga.textContent,f=c.length;for(e=0;e<a&&n[e]===c[e];e++);var y=a-e;for(r=1;r<=y&&n[a-r]===c[f-r];r++);return ec=c.slice(e,1<r?1-r:void 0)}function tc(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function nc(){return!0}function $m(){return!1}function Gn(e){function n(a,r,c,f,y){this._reactName=a,this._targetInst=c,this.type=r,this.nativeEvent=f,this.target=y,this.currentTarget=null;for(var A in e)e.hasOwnProperty(A)&&(a=e[A],this[A]=a?a(f):f[A]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?nc:$m,this.isPropagationStopped=$m,this}return I(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=nc)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=nc)},persist:function(){},isPersistent:nc}),n}var Va={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ic=Gn(Va),Bo=I({},Va,{view:0,detail:0}),xS=Gn(Bo),Sf,Mf,Fo,ac=I({},Bo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Tf,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Fo&&(Fo&&e.type==="mousemove"?(Sf=e.screenX-Fo.screenX,Mf=e.screenY-Fo.screenY):Mf=Sf=0,Fo=e),Sf)},movementY:function(e){return"movementY"in e?e.movementY:Mf}}),eg=Gn(ac),yS=I({},ac,{dataTransfer:0}),SS=Gn(yS),MS=I({},Bo,{relatedTarget:0}),Ef=Gn(MS),ES=I({},Va,{animationName:0,elapsedTime:0,pseudoElement:0}),TS=Gn(ES),bS=I({},Va,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),AS=Gn(bS),CS=I({},Va,{data:0}),tg=Gn(CS),RS={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},wS={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},NS={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function DS(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=NS[e])?!!n[e]:!1}function Tf(){return DS}var US=I({},Bo,{key:function(e){if(e.key){var n=RS[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=tc(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?wS[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Tf,charCode:function(e){return e.type==="keypress"?tc(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?tc(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),LS=Gn(US),OS=I({},ac,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ng=Gn(OS),zS=I({},Va,{submitter:0}),PS=Gn(zS),IS=I({},Bo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Tf}),BS=Gn(IS),FS=I({},Va,{propertyName:0,elapsedTime:0,pseudoElement:0}),HS=Gn(FS),jS=I({},ac,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),GS=Gn(jS),VS=I({},Va,{newState:0,oldState:0,source:0}),kS=Gn(VS),XS=[9,13,27,32],bf=ga&&"CompositionEvent"in window,Ho=null;ga&&"documentMode"in document&&(Ho=document.documentMode);var qS=ga&&"TextEvent"in window&&!Ho,ig=ga&&(!bf||Ho&&8<Ho&&11>=Ho),ag=" ",sg=!1;function rg(e,n){switch(e){case"keyup":return XS.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function og(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var xr=!1;function YS(e,n){switch(e){case"compositionend":return og(n);case"keypress":return n.which!==32?null:(sg=!0,ag);case"textInput":return e=n.data,e===ag&&sg?null:e;default:return null}}function WS(e,n){if(xr)return e==="compositionend"||!bf&&rg(e,n)?(e=Jm(),ec=yf=Ga=null,xr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return ig&&n.locale!=="ko"?null:n.data;default:return null}}var ZS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function lg(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!ZS[e.type]:n==="textarea"}function cg(e,n,a,r){vr?_r?_r.push(r):_r=[r]:vr=r,n=su(n,"onChange"),0<n.length&&(a=new ic("onChange","change",null,a,r),e.push({event:a,listeners:n}))}var jo=null,Go=null;function KS(e){Kv(e,0)}function sc(e){var n=xn(e);if(km(n))return e}function ug(e,n){if(e==="change")return n}var fg=!1;if(ga){var Af;if(ga){var Cf="oninput"in document;if(!Cf){var dg=document.createElement("div");dg.setAttribute("oninput","return;"),Cf=typeof dg.oninput=="function"}Af=Cf}else Af=!1;fg=Af&&(!document.documentMode||9<document.documentMode)}function hg(){jo&&(jo.detachEvent("onpropertychange",pg),Go=jo=null)}function pg(e){if(e.propertyName==="value"&&sc(Go)){var n=[];cg(n,Go,e,vf(e)),Qm(KS,n)}}function QS(e,n,a){e==="focusin"?(hg(),jo=n,Go=a,jo.attachEvent("onpropertychange",pg)):e==="focusout"&&hg()}function JS(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return sc(Go)}function $S(e,n){if(e==="click")return sc(n)}function eM(e,n){if(e==="input"||e==="change")return sc(n)}function tM(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var ri=typeof Object.is=="function"?Object.is:tM;function Vo(e,n){if(ri(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var a=Object.keys(e),r=Object.keys(n);if(a.length!==r.length)return!1;for(r=0;r<a.length;r++){var c=a[r];if(!Ue.call(n,c)||!ri(e[c],n[c]))return!1}return!0}function Rf(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function mg(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function gg(e,n){var a=mg(e);e=0;for(var r;a;){if(a.nodeType===3){if(r=e+a.textContent.length,e<=n&&r>=n)return{node:a,offset:n-e};e=r}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=mg(a)}}function vg(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?vg(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function _g(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var n=Rf(e.document);n instanceof e.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)e=n.contentWindow;else break;n=Rf(e.document)}return n}function wf(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}var nM=ga&&"documentMode"in document&&11>=document.documentMode,yr=null,Nf=null,ko=null,Df=!1;function xg(e,n,a){var r=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Df||yr==null||yr!==Rf(r)||(r=yr,"selectionStart"in r&&wf(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),ko&&Vo(ko,r)||(ko=r,r=su(Nf,"onSelect"),0<r.length&&(n=new ic("onSelect","select",null,n,a),e.push({event:n,listeners:r}),n.target=yr)))}function Ls(e,n){var a={};return a[e.toLowerCase()]=n.toLowerCase(),a["Webkit"+e]="webkit"+n,a["Moz"+e]="moz"+n,a}var Sr={animationend:Ls("Animation","AnimationEnd"),animationiteration:Ls("Animation","AnimationIteration"),animationstart:Ls("Animation","AnimationStart"),transitionrun:Ls("Transition","TransitionRun"),transitionstart:Ls("Transition","TransitionStart"),transitioncancel:Ls("Transition","TransitionCancel"),transitionend:Ls("Transition","TransitionEnd")},Uf={},yg={};ga&&(yg=document.createElement("div").style,"AnimationEvent"in window||(delete Sr.animationend.animation,delete Sr.animationiteration.animation,delete Sr.animationstart.animation),"TransitionEvent"in window||delete Sr.transitionend.transition);function Os(e){if(Uf[e])return Uf[e];if(!Sr[e])return e;var n=Sr[e],a;for(a in n)if(n.hasOwnProperty(a)&&a in yg)return Uf[e]=n[a];return e}var Sg=Os("animationend"),Mg=Os("animationiteration"),Eg=Os("animationstart"),iM=Os("transitionrun"),aM=Os("transitionstart"),sM=Os("transitioncancel"),Tg=Os("transitionend"),bg=new Map,Lf="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Lf.push("scrollEnd");function zi(e,n){bg.set(e,n),dn(n,[e])}var rM=0;function va(e,n){if(e.name!=null&&e.name!=="auto")return e.name;if(n.autoName!==null)return n.autoName;e=Fi.identifierPrefix;var a=rM++;return e="_"+e+"t_"+a.toString(32)+"_",n.autoName=e}function Ag(e){if(e==null||typeof e=="string")return e;var n=null,a=jr;if(a!==null)for(var r=0;r<a.length;r++){var c=e[a[r]];if(c!=null){if(c==="none")return"none";n=n==null?c:n+(" "+c)}}return n??e.default}function _a(e,n){return e=Ag(e),n=Ag(n),n==null?e==="auto"?null:e:n==="auto"?null:n}var rc=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},yi=[],Mr=0,Of=0;function oc(){for(var e=Mr,n=Of=Mr=0;n<e;){var a=yi[n];yi[n++]=null;var r=yi[n];yi[n++]=null;var c=yi[n];yi[n++]=null;var f=yi[n];if(yi[n++]=null,r!==null&&c!==null){var y=r.pending;y===null?c.next=c:(c.next=y.next,y.next=c),r.pending=c}f!==0&&Cg(a,c,f)}}function lc(e,n,a,r){yi[Mr++]=e,yi[Mr++]=n,yi[Mr++]=a,yi[Mr++]=r,Of|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function zf(e,n,a,r){return lc(e,n,a,r),cc(e)}function zs(e,n){return lc(e,null,null,n),cc(e)}function Cg(e,n,a){e.lanes|=a;var r=e.alternate;r!==null&&(r.lanes|=a);for(var c=!1,f=e.return;f!==null;)f.childLanes|=a,r=f.alternate,r!==null&&(r.childLanes|=a),f.tag===22&&(e=f.stateNode,e===null||e._visibility&1||(c=!0)),e=f,f=f.return;return e.tag===3?(f=e.stateNode,c&&n!==null&&(c=31-zn(a),e=f.hiddenUpdates,r=e[c],r===null?e[c]=[n]:r.push(n),n.lane=a|536870912),f):null}function cc(e){if(50<dl)throw dl=0,Jc=null,Error(o(185));for(var n=e.return;n!==null;)e=n,n=e.return;return e.tag===3?e.stateNode:null}var Er={};function oM(e,n,a,r){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Zn(e,n,a,r){return new oM(e,n,a,r)}function Pf(e){return e=e.prototype,!(!e||!e.isReactComponent)}function xa(e,n){var a=e.alternate;return a===null?(a=Zn(e.tag,n,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=n,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&1206910976,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,n=e.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function Rg(e,n){e.flags&=1206910978;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=n,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,n=a.dependencies,e.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),e}function uc(e,n,a,r,c,f){var y=0;if(r=e,typeof r=="function")Pf(r)&&(y=1);else if(typeof r=="string")y=z1(e,a,ke.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(r){case He:return e=Zn(31,a,n,c),e.elementType=He,e.lanes=f,e;case G:return Ps(a.children,c,f,n);case ie:y=8,c|=24;break;case ue:return e=Zn(12,a,n,c|2),e.elementType=ue,e.lanes=f,e;case k:return e=Zn(13,a,n,c),e.elementType=k,e.lanes=f,e;case X:return e=Zn(19,a,n,c),e.elementType=X,e.lanes=f,e;case $e:case j:return e=c|32,e=Zn(30,a,n,e),e.elementType=j,e.lanes=f,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof r=="object"&&r!==null)switch(r.$$typeof){case B:y=10;break e;case Z:y=9;break e;case O:y=11;break e;case ve:y=14;break e;case _e:y=16,r=null;break e}y=29,a=Error(o(130,e===null?"null":typeof e,"")),r=null}return n=Zn(y,a,n,c),n.elementType=e,n.type=r,n.lanes=f,n}function Ps(e,n,a,r){return e=Zn(7,e,r,n),e.lanes=a,e}function If(e,n,a){return e=Zn(6,e,null,n),e.lanes=a,e}function wg(e){var n=Zn(18,null,null,0);return n.stateNode=e,n}function Bf(e,n,a){return n=Zn(4,e.children!==null?e.children:[],e.key,n),n.lanes=a,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}var Ng=new WeakMap;function Si(e,n){if(typeof e=="object"&&e!==null){var a=Ng.get(e);return a!==void 0?a:(n={value:e,source:n,stack:Se(n)},Ng.set(e,n),n)}return{value:e,source:n,stack:Se(n)}}var Tr=[],br=0,fc=null,Xo=0,Mi=[],Ei=0,ka=null,Ji=1,$i="";function ya(e,n){Tr[br++]=Xo,Tr[br++]=fc,fc=e,Xo=n}function Dg(e,n,a){Mi[Ei++]=Ji,Mi[Ei++]=$i,Mi[Ei++]=ka,ka=e;var r=Ji;e=$i;var c=32-zn(r)-1;r&=~(1<<c),a+=1;var f=32-zn(n)+c;if(30<f){var y=c-c%5;f=(r&(1<<y)-1).toString(32),r>>=y,c-=y,Ji=1<<32-zn(n)+c|a<<c|r,$i=f+e}else Ji=1<<f|a<<c|r,$i=e}function dc(e){e.return!==null&&(ya(e,1),Dg(e,1,0))}function Ff(e){for(;e===fc;)fc=Tr[--br],Tr[br]=null,Xo=Tr[--br],Tr[br]=null;for(;e===ka;)ka=Mi[--Ei],Mi[Ei]=null,$i=Mi[--Ei],Mi[Ei]=null,Ji=Mi[--Ei],Mi[Ei]=null}function Ug(e,n){Mi[Ei++]=Ji,Mi[Ei++]=$i,Mi[Ei++]=ka,Ji=n.id,$i=n.overflow,ka=e}var En=null,Jt=null,St=!1,Xa=null,Ti=!1,Hf=Error(o(519));function qa(e){var n=Error(o(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw qo(Si(n,e)),Hf}function Lg(e){var n=e.stateNode,a=e.type,r=e.memoizedProps;switch(n[Pe]=e,n[et]=r,a){case"dialog":bt("cancel",n),bt("close",n);break;case"iframe":case"object":case"embed":bt("load",n);break;case"video":case"audio":for(a=0;a<pl.length;a++)bt(pl[a],n);break;case"source":bt("error",n);break;case"img":case"image":case"link":bt("error",n),bt("load",n);break;case"details":bt("toggle",n);break;case"input":bt("invalid",n),Xm(n,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case"select":bt("invalid",n);break;case"textarea":bt("invalid",n),Ym(n,r.value,r.defaultValue,r.children)}a=r.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||r.suppressHydrationWarning===!0||e_(n.textContent,a)?(r.popover!=null&&(bt("beforetoggle",n),bt("toggle",n)),r.onScroll!=null&&bt("scroll",n),r.onScrollEnd!=null&&bt("scrollend",n),r.onClick!=null&&(n.onclick=Qi),n=!0):n=!1,n||qa(e,!0)}function hc(e){for(En=e.return;En;)switch(En.tag){case 5:case 31:case 13:Ti=!1;return;case 27:case 3:Ti=!0;return;default:En=En.return}}function Ar(e){if(e!==En)return!1;if(!St)return hc(e),St=!0,!1;var n=e.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||gh(e.type,e.memoizedProps)),a=!a),a&&Jt&&qa(e),hc(e),n===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(317));Jt=x_(e)}else if(n===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(317));Jt=x_(e)}else n===27?(n=Jt,ls(e.type)?(e=bh,bh=null,Jt=e):Jt=n):Jt=En?Ai(e.stateNode.nextSibling):null;return!0}function Is(){Jt=En=null,St=!1}function jf(){var e=Xa;return e!==null&&(Jn===null?Jn=e:Jn.push.apply(Jn,e),Xa=null),e}function qo(e){Xa===null?Xa=[e]:Xa.push(e)}var Gf=Qe(null),Bs=null,Sa=null;function Ya(e,n,a){lt(Gf,n._currentValue),n._currentValue=a}function Ma(e){e._currentValue=Gf.current,Be(Gf)}function pc(e,n,a){for(;e!==null;){var r=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,r!==null&&(r.childLanes|=n)):r!==null&&(r.childLanes&n)!==n&&(r.childLanes|=n),e===a)break;e=e.return}}function Vf(e,n,a,r){var c=e.child;for(c!==null&&(c.return=e);c!==null;){var f=c.dependencies;if(f!==null){var y=c.child;f=f.firstContext;e:for(;f!==null;){var A=f;f=c;for(var F=0;F<n.length;F++)if(A.context===n[F]){f.lanes|=a,A=f.alternate,A!==null&&(A.lanes|=a),pc(f.return,a,e),r||(y=null);break e}f=A.next}}else if(c.tag===18){if(y=c.return,y===null)throw Error(o(341));y.lanes|=a,f=y.alternate,f!==null&&(f.lanes|=a),pc(y,a,e),y=null}else c.tag===13&&c.memoizedState!==null&&c.memoizedState.dehydrated===null?(c.lanes|=a,y=c.alternate,y!==null&&(y.lanes|=a),pc(c.return,a,e),y=c.child,y=y!==null?y.sibling:null):y=c.child;if(y!==null)y.return=c;else for(y=c;y!==null;){if(y===e){y=null;break}if(c=y.sibling,c!==null){c.return=y.return,y=c;break}y=y.return}c=y}}function Fs(e,n,a,r){e=null;for(var c=n,f=!1;c!==null;){if(!f){if((c.flags&524288)!==0)f=!0;else if((c.flags&262144)!==0)break}if(c.tag===10){var y=c.alternate;if(y===null)throw Error(o(387));if(y=y.memoizedProps,y!==null){var A=c.type;ri(c.pendingProps.value,y.value)||(e!==null?e.push(A):e=[A])}}else if(c===At.current){if(y=c.alternate,y===null)throw Error(o(387));y.memoizedState.memoizedState!==c.memoizedState.memoizedState&&(e!==null?e.push(Qr):e=[Qr])}c=c.return}return e!==null&&Vf(n,e,a,r),n.flags|=262144,e!==null}function mc(e){for(e=e.firstContext;e!==null;){if(!ri(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Hs(e){Bs=e,Sa=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Cn(e){return Og(Bs,e)}function gc(e,n){return Bs===null&&Hs(e),Og(e,n)}function Og(e,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},Sa===null){if(e===null)throw Error(o(308));Sa=n,e.dependencies={lanes:0,firstContext:n},e.flags|=524288}else Sa=Sa.next=n;return a}var lM=typeof AbortController<"u"?AbortController:function(){var e=[],n=this.signal={aborted:!1,addEventListener:function(a,r){e.push(r)}};this.abort=function(){n.aborted=!0,e.forEach(function(a){return a()})}},cM=s.unstable_scheduleCallback,uM=s.unstable_NormalPriority,hn={$$typeof:B,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function kf(){return{controller:new lM,data:new Map,refCount:0}}function Yo(e){e.refCount--,e.refCount===0&&cM(uM,function(){e.controller.abort()})}function zg(e,n){if((e.pendingLanes&4194048)!==0){var a=e.transitionTypes;for(a===null&&(a=e.transitionTypes=[]),e=0;e<n.length;e++){var r=n[e];a.indexOf(r)===-1&&a.push(r)}}}var Wo=null;function fM(e){var n=e.transitionTypes;return e.transitionTypes=null,n}var Zo=null,Xf=0,js=0,Cr=null;function dM(e,n){if(Zo===null){var a=Zo=[];Xf=0,js=oh(),Cr={status:"pending",value:void 0,then:function(r){a.push(r)}}}return Xf++,n.then(Pg,Pg),n}function Pg(){if(--Xf===0&&(Wo=null,Zo!==null)){Cr!==null&&(Cr.status="fulfilled");var e=Zo;Zo=null,js=0,Cr=null;for(var n=0;n<e.length;n++)(0,e[n])()}}function hM(e,n){var a=[],r={status:"pending",value:null,reason:null,then:function(c){a.push(c)}};return e.then(function(){r.status="fulfilled",r.value=n;for(var c=0;c<a.length;c++)(0,a[c])(n)},function(c){for(r.status="rejected",r.reason=c,c=0;c<a.length;c++)(0,a[c])(void 0)}),r}var Ig=Te.S;Te.S=function(e,n){if(wv=W(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&dM(e,n),Wo!==null)for(var a=Xr;a!==null;)zg(a,Wo),a=a.next;if(a=e.types,a!==null){for(var r=Xr;r!==null;)zg(r,a),r=r.next;if(js!==0){r=Wo,r===null&&(r=Wo=[]);for(var c=0;c<a.length;c++){var f=a[c];r.indexOf(f)===-1&&r.push(f)}}}Ig!==null&&Ig(e,n)};var Gs=Qe(null);function qf(){var e=Gs.current;return e!==null?e:Kt.pooledCache}function vc(e,n){n===null?lt(Gs,Gs.current):lt(Gs,n.pool)}function Bg(){var e=qf();return e===null?null:{parent:hn._currentValue,pool:e}}var Rr=Error(o(460)),Yf=Error(o(474)),_c=Error(o(542)),xc={then:function(){}};function Fg(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Hg(e,n,a){switch(a=e[a],a===void 0?e.push(n):a!==n&&(n.then(Qi,Qi),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Gg(e),e===void 0&&!("reason"in n)?Error(o(600)):e;default:if(typeof n.status=="string")n.then(Qi,Qi);else{if(e=Kt,e!==null&&100<e.shellSuspendCounter)throw Error(o(482));e=n,e.status="pending",e.then(function(r){if(n.status==="pending"){var c=n;c.status="fulfilled",c.value=r}},function(r){if(n.status==="pending"){var c=n;c.status="rejected",c.reason=r}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Gg(e),e}throw ks=n,Rr}}function Vs(e){try{var n=e._init;return n(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(ks=a,Rr):a}}var ks=null;function jg(){if(ks===null)throw Error(o(459));var e=ks;return ks=null,e}function Gg(e){if(e===Rr||e===_c)throw Error(o(483))}var wr=null,Ko=0;function yc(e){var n=Ko;return Ko+=1,wr===null&&(wr=[]),Hg(wr,e,n)}function Wa(e,n){n=n.props.ref,e.ref=n!==void 0?n:null}function Sc(e,n){throw n.$$typeof===Y?Error(o(525)):(e=Object.prototype.toString.call(n),Error(o(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)))}function Vg(e){function n(Q,q){if(e){var ne=Q.deletions;ne===null?(Q.deletions=[q],Q.flags|=16):ne.push(q)}}function a(Q,q){if(!e)return null;for(;q!==null;)n(Q,q),q=q.sibling;return null}function r(Q){for(var q=new Map;Q!==null;)Q.key===null?q.set(Q.index,Q):q.set(Q.key,Q),Q=Q.sibling;return q}function c(Q,q){return Q=xa(Q,q),Q.index=0,Q.sibling=null,Q}function f(Q,q,ne){return Q.index=ne,e?(ne=Q.alternate,ne!==null?(ne=ne.index,ne<q?(Q.flags|=2,q):ne):(Q.flags|=134217730,q)):(Q.flags|=1048576,q)}function y(Q){return e&&Q.alternate===null&&(Q.flags|=134217730),Q}function A(Q,q,ne,me){return q===null||q.tag!==6?(q=If(ne,Q.mode,me),q.return=Q,q):(q=c(q,ne),q.return=Q,q)}function F(Q,q,ne,me){var We=ne.type;return We===G?(Q=le(Q,q,ne.props.children,me,ne.key),Wa(Q,ne),Q):q!==null&&(q.elementType===We||typeof We=="object"&&We!==null&&We.$$typeof===_e&&Vs(We)===q.type)?(q=c(q,ne.props),Wa(q,ne),q.return=Q,q):(q=uc(ne.type,ne.key,ne.props,null,Q.mode,me),Wa(q,ne),q.return=Q,q)}function J(Q,q,ne,me){return q===null||q.tag!==4||q.stateNode.containerInfo!==ne.containerInfo||q.stateNode.implementation!==ne.implementation?(q=Bf(ne,Q.mode,me),q.return=Q,q):(q=c(q,ne.children||[]),q.return=Q,q)}function le(Q,q,ne,me,We){return q===null||q.tag!==7?(q=Ps(ne,Q.mode,me,We),q.return=Q,q):(q=c(q,ne),q.return=Q,q)}function ge(Q,q,ne){if(typeof q=="string"&&q!==""||typeof q=="number"||typeof q=="bigint")return q=If(""+q,Q.mode,ne),q.return=Q,q;if(typeof q=="object"&&q!==null){switch(q.$$typeof){case U:return ne=uc(q.type,q.key,q.props,null,Q.mode,ne),Wa(ne,q),ne.return=Q,ne;case R:return q=Bf(q,Q.mode,ne),q.return=Q,q;case _e:return q=Vs(q),ge(Q,q,ne)}if(Ae(q)||oe(q))return q=Ps(q,Q.mode,ne,null),q.return=Q,q;if(typeof q.then=="function")return ge(Q,yc(q),ne);if(q.$$typeof===B)return ge(Q,gc(Q,q),ne);Sc(Q,q)}return null}function K(Q,q,ne,me){var We=q!==null?q.key:null;if(typeof ne=="string"&&ne!==""||typeof ne=="number"||typeof ne=="bigint")return We!==null?null:A(Q,q,""+ne,me);if(typeof ne=="object"&&ne!==null){switch(ne.$$typeof){case U:return ne.key===We?F(Q,q,ne,me):null;case R:return ne.key===We?J(Q,q,ne,me):null;case _e:return ne=Vs(ne),K(Q,q,ne,me)}if(Ae(ne)||oe(ne))return We!==null?null:le(Q,q,ne,me,null);if(typeof ne.then=="function")return K(Q,q,yc(ne),me);if(ne.$$typeof===B)return K(Q,q,gc(Q,ne),me);Sc(Q,ne)}return null}function re(Q,q,ne,me,We){if(typeof me=="string"&&me!==""||typeof me=="number"||typeof me=="bigint")return Q=Q.get(ne)||null,A(q,Q,""+me,We);if(typeof me=="object"&&me!==null){switch(me.$$typeof){case U:return Q=Q.get(me.key===null?ne:me.key)||null,F(q,Q,me,We);case R:return Q=Q.get(me.key===null?ne:me.key)||null,J(q,Q,me,We);case _e:return me=Vs(me),re(Q,q,ne,me,We)}if(Ae(me)||oe(me))return Q=Q.get(ne)||null,le(q,Q,me,We,null);if(typeof me.then=="function")return re(Q,q,ne,yc(me),We);if(me.$$typeof===B)return re(Q,q,ne,gc(q,me),We);Sc(q,me)}return null}function Fe(Q,q,ne,me){for(var We=null,wt=null,st=q,ut=q=0,gn=null;st!==null&&ut<ne.length;ut++){st.index>ut?(gn=st,st=null):gn=st.sibling;var Ut=K(Q,st,ne[ut],me);if(Ut===null){st===null&&(st=gn);break}e&&st&&Ut.alternate===null&&n(Q,st),q=f(Ut,q,ut),wt===null?We=Ut:wt.sibling=Ut,wt=Ut,st=gn}if(ut===ne.length)return a(Q,st),St&&ya(Q,ut),We;if(st===null){for(;ut<ne.length;ut++)st=ge(Q,ne[ut],me),st!==null&&(q=f(st,q,ut),wt===null?We=st:wt.sibling=st,wt=st);return St&&ya(Q,ut),We}for(st=r(st);ut<ne.length;ut++)gn=re(st,Q,ut,ne[ut],me),gn!==null&&(e&&(Ut=gn.alternate,Ut!==null&&st.delete(Ut.key===null?ut:Ut.key)),q=f(gn,q,ut),wt===null?We=gn:wt.sibling=gn,wt=gn);return e&&st.forEach(function(hs){return n(Q,hs)}),St&&ya(Q,ut),We}function tt(Q,q,ne,me){if(ne==null)throw Error(o(151));for(var We=null,wt=null,st=q,ut=q=0,gn=null,Ut=ne.next();st!==null&&!Ut.done;ut++,Ut=ne.next()){st.index>ut?(gn=st,st=null):gn=st.sibling;var hs=K(Q,st,Ut.value,me);if(hs===null){st===null&&(st=gn);break}e&&st&&hs.alternate===null&&n(Q,st),q=f(hs,q,ut),wt===null?We=hs:wt.sibling=hs,wt=hs,st=gn}if(Ut.done)return a(Q,st),St&&ya(Q,ut),We;if(st===null){for(;!Ut.done;ut++,Ut=ne.next())Ut=ge(Q,Ut.value,me),Ut!==null&&(q=f(Ut,q,ut),wt===null?We=Ut:wt.sibling=Ut,wt=Ut);return St&&ya(Q,ut),We}for(st=r(st);!Ut.done;ut++,Ut=ne.next())Ut=re(st,Q,ut,Ut.value,me),Ut!==null&&(e&&(gn=Ut.alternate,gn!==null&&st.delete(gn.key===null?ut:gn.key)),q=f(Ut,q,ut),wt===null?We=Ut:wt.sibling=Ut,wt=Ut);return e&&st.forEach(function(Y1){return n(Q,Y1)}),St&&ya(Q,ut),We}function gt(Q,q,ne,me){if(typeof ne=="object"&&ne!==null&&ne.type===G&&ne.key===null&&ne.props.ref===void 0&&(ne=ne.props.children),typeof ne=="object"&&ne!==null){switch(ne.$$typeof){case U:e:{for(var We=ne.key;q!==null;){if(q.key===We){if(We=ne.type,We===G){if(q.tag===7){a(Q,q.sibling),me=c(q,ne.props.children),Wa(me,ne),me.return=Q,Q=me;break e}}else if(q.elementType===We||typeof We=="object"&&We!==null&&We.$$typeof===_e&&Vs(We)===q.type){a(Q,q.sibling),me=c(q,ne.props),Wa(me,ne),me.return=Q,Q=me;break e}a(Q,q);break}else n(Q,q);q=q.sibling}ne.type===G?(me=Ps(ne.props.children,Q.mode,me,ne.key),Wa(me,ne),me.return=Q,Q=me):(me=uc(ne.type,ne.key,ne.props,null,Q.mode,me),Wa(me,ne),me.return=Q,Q=me)}return y(Q);case R:e:{for(We=ne.key;q!==null;){if(q.key===We)if(q.tag===4&&q.stateNode.containerInfo===ne.containerInfo&&q.stateNode.implementation===ne.implementation){a(Q,q.sibling),me=c(q,ne.children||[]),me.return=Q,Q=me;break e}else{a(Q,q);break}else n(Q,q);q=q.sibling}me=Bf(ne,Q.mode,me),me.return=Q,Q=me}return y(Q);case _e:return ne=Vs(ne),gt(Q,q,ne,me)}if(Ae(ne))return Fe(Q,q,ne,me);if(oe(ne)){if(We=oe(ne),typeof We!="function")throw Error(o(150));return ne=We.call(ne),tt(Q,q,ne,me)}if(typeof ne.then=="function")return gt(Q,q,yc(ne),me);if(ne.$$typeof===B)return gt(Q,q,gc(Q,ne),me);Sc(Q,ne)}return typeof ne=="string"&&ne!==""||typeof ne=="number"||typeof ne=="bigint"?(ne=""+ne,q!==null&&q.tag===6?(a(Q,q.sibling),me=c(q,ne),me.return=Q,Q=me):(a(Q,q),me=If(ne,Q.mode,me),me.return=Q,Q=me),y(Q)):a(Q,q)}return function(Q,q,ne,me){try{Ko=0;var We=gt(Q,q,ne,me);return wr=null,We}catch(st){if(st===Rr||st===_c)throw st;var wt=Zn(29,st,null,Q.mode);return wt.lanes=me,wt.return=Q,wt}finally{}}}var Xs=Vg(!0),kg=Vg(!1),Za=!1;function Wf(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Zf(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Ka(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Qa(e,n,a){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(Ft&2)!==0){var c=r.pending;return c===null?n.next=n:(n.next=c.next,c.next=n),r.pending=n,n=cc(e),Cg(e,null,a),n}return lc(e,r,n,a),cc(e)}function Qo(e,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var r=n.lanes;r&=e.pendingLanes,a|=r,n.lanes=a,ee(e,a)}}function Kf(e,n){var a=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,a===r)){var c=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var y={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?c=f=y:f=f.next=y,a=a.next}while(a!==null);f===null?c=f=n:f=f.next=n}else c=f=n;a={baseState:r.baseState,firstBaseUpdate:c,lastBaseUpdate:f,shared:r.shared,callbacks:r.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=n:e.next=n,a.lastBaseUpdate=n}var Qf=!1;function Jo(){if(Qf){var e=Cr;if(e!==null)throw e}}function $o(e,n,a,r){Qf=!1;var c=e.updateQueue;Za=!1;var f=c.firstBaseUpdate,y=c.lastBaseUpdate,A=c.shared.pending;if(A!==null){c.shared.pending=null;var F=A,J=F.next;F.next=null,y===null?f=J:y.next=J,y=F;var le=e.alternate;le!==null&&(le=le.updateQueue,A=le.lastBaseUpdate,A!==y&&(A===null?le.firstBaseUpdate=J:A.next=J,le.lastBaseUpdate=F))}if(f!==null){var ge=c.baseState;y=0,le=J=F=null,A=f;do{var K=A.lane&-536870913,re=K!==A.lane;if(re?(Rt&K)===K:(r&K)===K){K!==0&&K===js&&(Qf=!0),le!==null&&(le=le.next={lane:0,tag:A.tag,payload:A.payload,callback:null,next:null});e:{var Fe=e,tt=A;K=n;var gt=a;switch(tt.tag){case 1:if(Fe=tt.payload,typeof Fe=="function"){ge=Fe.call(gt,ge,K);break e}ge=Fe;break e;case 3:Fe.flags=Fe.flags&-65537|128;case 0:if(Fe=tt.payload,K=typeof Fe=="function"?Fe.call(gt,ge,K):Fe,K==null)break e;ge=I({},ge,K);break e;case 2:Za=!0}}K=A.callback,K!==null&&(e.flags|=64,re&&(e.flags|=8192),re=c.callbacks,re===null?c.callbacks=[K]:re.push(K))}else re={lane:K,tag:A.tag,payload:A.payload,callback:A.callback,next:null},le===null?(J=le=re,F=ge):le=le.next=re,y|=K;if(A=A.next,A===null){if(A=c.shared.pending,A===null)break;re=A,A=re.next,re.next=null,c.lastBaseUpdate=re,c.shared.pending=null}}while(!0);le===null&&(F=ge),c.baseState=F,c.firstBaseUpdate=J,c.lastBaseUpdate=le,f===null&&(c.shared.lanes=0),as|=y,e.lanes=y,e.memoizedState=ge}}function Xg(e,n){if(typeof e!="function")throw Error(o(191,e));e.call(n)}function qg(e,n){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)Xg(a[e],n)}var Ja=Qe(null),Mc=Qe(0);function Yg(e,n){e=Ca,lt(Mc,e),lt(Ja,n),Ca=e|n.baseLanes}function Jf(){lt(Mc,Ca),lt(Ja,Ja.current)}function $f(){Ca=Mc.current,Be(Ja),Be(Mc)}var Rn=Qe(null),In=null;function $a(e){var n=e.alternate;lt(wn,wn.current&1),lt(Rn,e),In===null&&(n===null||Ja.current!==null||n.memoizedState!==null)&&(In=e)}function ed(e){lt(wn,wn.current),lt(Rn,e),In===null&&(In=e)}function Wg(e){e.tag===22?(lt(wn,wn.current),lt(Rn,e),In===null&&(In=e)):es()}function es(){lt(wn,wn.current),lt(Rn,Rn.current)}function oi(e){Be(Rn),In===e&&(In=null),Be(wn)}var wn=Qe(0);function el(e,n){lt(Rn,Rn.current),lt(wn,n)}function td(e){Be(wn),Be(Rn),In===e&&(In=null)}function Ec(e){for(var n=e;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||Eh(a)||Th(a)))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!=="independent"){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var Ea=0,mt=null,Yt=null,pn=null,Tc=!1,Nr=!1,qs=!1,bc=0,tl=0,Dr=null,pM=0;function on(){throw Error(o(321))}function nd(e,n){if(n===null)return!1;for(var a=0;a<n.length&&a<e.length;a++)if(!ri(e[a],n[a]))return!1;return!0}function id(e,n,a,r,c,f){return Ea=f,mt=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,Te.H=e===null||e.memoizedState===null?D0:U0,qs=!1,f=a(r,c),qs=!1,Nr&&(f=Kg(n,a,r,c)),Zg(e),f}function Zg(e){Te.H=Uc;var n=Yt!==null&&Yt.next!==null;if(Ea=0,pn=Yt=mt=null,Tc=!1,tl=0,Dr=null,n)throw Error(o(300));e===null||mn||(e=e.dependencies,e!==null&&mc(e)&&(mn=!0))}function Kg(e,n,a,r){mt=e;var c=0;do{if(Nr&&(Dr=null),tl=0,Nr=!1,25<=c)throw Error(o(301));if(c+=1,pn=Yt=null,e.updateQueue!=null){var f=e.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}Te.H=MM,f=n(a,r)}while(Nr);return f}function mM(){var e=Te.H,n=e.useState()[0];return n=typeof n.then=="function"?nl(n):n,e=e.useState()[0],(Yt!==null?Yt.memoizedState:null)!==e&&(mt.flags|=1024),n}function ad(){var e=bc!==0;return bc=0,e}function sd(e,n,a){n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~a}function rd(e){if(Tc){for(e=e.memoizedState;e!==null;){var n=e.queue;n!==null&&(n.pending=null),e=e.next}Tc=!1}Ea=0,pn=Yt=mt=null,Nr=!1,tl=bc=0,Dr=null}function Vn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return pn===null?mt.memoizedState=pn=e:pn=pn.next=e,pn}function cn(){if(Yt===null){var e=mt.alternate;e=e!==null?e.memoizedState:null}else e=Yt.next;var n=pn===null?mt.memoizedState:pn.next;if(n!==null)pn=n,Yt=e;else{if(e===null)throw mt.alternate===null?Error(o(467)):Error(o(310));Yt=e,e={memoizedState:Yt.memoizedState,baseState:Yt.baseState,baseQueue:Yt.baseQueue,queue:Yt.queue,next:null},pn===null?mt.memoizedState=pn=e:pn=pn.next=e}return pn}function Ac(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function nl(e){var n=tl;return tl+=1,Dr===null&&(Dr=[]),e=Hg(Dr,e,n),n=mt,(pn===null?n.memoizedState:pn.next)===null&&(n=n.alternate,Te.H=n===null||n.memoizedState===null?D0:U0),e}function Cc(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return nl(e);if(e.$$typeof===de)return;if(e.$$typeof===B)return Cn(e)}throw Error(o(438,String(e)))}function od(e){var n=null,a=mt.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var r=mt.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(n={data:r.data.map(function(c){return c.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=Ac(),mt.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(e),r=0;r<e;r++)a[r]=xt;return n.index++,a}function Ta(e,n){return typeof n=="function"?n(e):n}function Rc(e){var n=cn();return ld(n,Yt,e)}function ld(e,n,a){var r=e.queue;if(r===null)throw Error(o(311));r.lastRenderedReducer=a;var c=e.baseQueue,f=r.pending;if(f!==null){if(c!==null){var y=c.next;c.next=f.next,f.next=y}n.baseQueue=c=f,r.pending=null}if(f=e.baseState,c===null)e.memoizedState=f;else{n=c.next;var A=y=null,F=null,J=n,le=!1;do{var ge=J.lane&-536870913;if(ge!==J.lane?(Rt&ge)===ge:(Ea&ge)===ge){var K=J.revertLane;if(K===0)F!==null&&(F=F.next={lane:0,revertLane:0,gesture:null,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null}),ge===js&&(le=!0);else if((Ea&K)===K){J=J.next,K===js&&(le=!0);continue}else ge={lane:0,revertLane:J.revertLane,gesture:null,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null},F===null?(A=F=ge,y=f):F=F.next=ge,mt.lanes|=K,as|=K;ge=J.action,qs&&a(f,ge),f=J.hasEagerState?J.eagerState:a(f,ge)}else K={lane:ge,revertLane:J.revertLane,gesture:J.gesture,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null},F===null?(A=F=K,y=f):F=F.next=K,mt.lanes|=ge,as|=ge;J=J.next}while(J!==null&&J!==n);if(F===null?y=f:F.next=A,!ri(f,e.memoizedState)&&(mn=!0,le&&(a=Cr,a!==null)))throw a;e.memoizedState=f,e.baseState=y,e.baseQueue=F,r.lastRenderedState=f}return c===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function cd(e){var n=cn(),a=n.queue;if(a===null)throw Error(o(311));a.lastRenderedReducer=e;var r=a.dispatch,c=a.pending,f=n.memoizedState;if(c!==null){a.pending=null;var y=c=c.next;do f=e(f,y.action),y=y.next;while(y!==c);ri(f,n.memoizedState)||(mn=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,r]}function Qg(e,n,a){var r=mt,c=cn(),f=St;if(f){if(a===void 0)throw Error(o(407));a=a()}else a=n();var y=!ri((Yt||c).memoizedState,a);if(y&&(c.memoizedState=a,mn=!0),c=c.queue,dd(e0.bind(null,r,c,e),[e]),e=c.getSnapshot!==n||y||pn!==null&&(pn.memoizedState.tag&1)!==0,Ur(e?9:8,{destroy:void 0},$g.bind(null,r,c,a,n),null),e){if(r.flags|=2048,Kt===null)throw Error(o(349));f||(Ea&127)!==0||Jg(r,n,a)}return a}function Jg(e,n,a){e.flags|=16384,e={getSnapshot:n,value:a},n=mt.updateQueue,n===null?(n=Ac(),mt.updateQueue=n,n.stores=[e]):(a=n.stores,a===null?n.stores=[e]:a.push(e))}function $g(e,n,a,r){n.value=a,n.getSnapshot=r,t0(n)&&n0(e)}function e0(e,n,a){return a(function(){t0(n)&&n0(e)})}function t0(e){var n=e.getSnapshot;e=e.value;try{var a=n();return!ri(e,a)}catch{return!0}}function n0(e){var n=zs(e,2);n!==null&&$n(n,e,2)}function ud(e){var n=Vn();if(typeof e=="function"){var a=e;if(e=a(),qs){_n(!0);try{a()}finally{_n(!1)}}}return n.memoizedState=n.baseState=e,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ta,lastRenderedState:e},n}function i0(e,n,a,r){return e.baseState=a,ld(e,Yt,typeof r=="function"?r:Ta)}function gM(e,n,a,r,c){if(Dc(e))throw Error(o(485));if(e=n.action,e!==null){var f={payload:c,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(y){f.listeners.push(y)}};Te.T!==null?a(!0):f.isTransition=!1,r(f),a=n.pending,a===null?(f.next=n.pending=f,a0(n,f)):(f.next=a.next,n.pending=a.next=f)}}function a0(e,n){var a=n.action,r=n.payload,c=e.state;if(n.isTransition){var f=Te.T,y={};y.types=f!==null?f.types:null,Te.T=y;try{var A=a(c,r),F=Te.S;F!==null&&F(y,A),s0(e,n,A)}catch(J){fd(e,n,J)}finally{f!==null&&y.types!==null&&(f.types=y.types),Te.T=f}}else try{f=a(c,r),s0(e,n,f)}catch(J){fd(e,n,J)}}function s0(e,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(r){r0(e,n,r)},function(r){return fd(e,n,r)}):r0(e,n,a)}function r0(e,n,a){n.status="fulfilled",n.value=a,o0(n),e.state=a,n=e.pending,n!==null&&(a=n.next,a===n?e.pending=null:(a=a.next,n.next=a,a0(e,a)))}function fd(e,n,a){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do n.status="rejected",n.reason=a,o0(n),n=n.next;while(n!==r)}e.action=null}function o0(e){e=e.listeners;for(var n=0;n<e.length;n++)(0,e[n])()}function l0(e,n){return n}function c0(e,n){if(St){var a=Kt.formState;if(a!==null){e:{var r=mt;if(St){if(Jt){t:{for(var c=Jt,f=Ti;c.nodeType!==8;){if(!f){c=null;break t}if(c=Ai(c.nextSibling),c===null){c=null;break t}}f=c.data,c=f==="F!"||f==="F"?c:null}if(c){Jt=Ai(c.nextSibling),r=c.data==="F!";break e}}qa(r)}r=!1}r&&(n=a[0])}}return a=Vn(),a.memoizedState=a.baseState=n,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:l0,lastRenderedState:n},a.queue=r,a=R0.bind(null,mt,r),r.dispatch=a,r=ud(!1),f=vd.bind(null,mt,!1,r.queue),r=Vn(),c={state:n,dispatch:null,action:e,pending:null},r.queue=c,a=gM.bind(null,mt,c,f,a),c.dispatch=a,r.memoizedState=e,[n,a,!1]}function u0(e){var n=cn();return f0(n,Yt,e)}function f0(e,n,a){if(n=ld(e,n,l0)[0],e=Rc(Ta)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var r=nl(n)}catch(y){throw y===Rr?_c:y}else r=n;n=cn();var c=n.queue,f=c.dispatch;return a!==n.memoizedState&&(mt.flags|=2048,Ur(9,{destroy:void 0},vM.bind(null,c,a),null)),[r,f,e]}function vM(e,n){e.action=n}function d0(e){var n=cn(),a=Yt;if(a!==null)return f0(n,a,e);cn(),n=n.memoizedState,a=cn();var r=a.queue.dispatch;return a.memoizedState=e,[n,r,!1]}function Ur(e,n,a,r){return e={tag:e,create:a,deps:r,inst:n,next:null},n=mt.updateQueue,n===null&&(n=Ac(),mt.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=e.next=e:(r=a.next,a.next=e,e.next=r,n.lastEffect=e),e}function h0(){return cn().memoizedState}function wc(e,n,a,r){var c=Vn();mt.flags|=e,c.memoizedState=Ur(1|n,{destroy:void 0},a,r===void 0?null:r)}function Nc(e,n,a,r){var c=cn();r=r===void 0?null:r;var f=c.memoizedState.inst;Yt!==null&&r!==null&&nd(r,Yt.memoizedState.deps)?c.memoizedState=Ur(n,f,a,r):(mt.flags|=e,c.memoizedState=Ur(1|n,f,a,r))}function p0(e,n){wc(8390656,8,e,n)}function dd(e,n){Nc(2048,8,e,n)}function _M(e){mt.flags|=4;var n=mt.updateQueue;if(n===null)n=Ac(),mt.updateQueue=n,n.events=[e];else{var a=n.events;a===null?n.events=[e]:a.push(e)}}function m0(e){var n=cn().memoizedState;return _M({ref:n,nextImpl:e}),function(){if((Ft&2)!==0)throw Error(o(440));return n.impl.apply(void 0,arguments)}}function g0(e,n){return Nc(4,2,e,n)}function v0(e,n){return Nc(4,4,e,n)}function _0(e,n){if(typeof n=="function"){e=e();var a=n(e);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function x0(e,n,a){a=a!=null?a.concat([e]):null,Nc(4,4,_0.bind(null,n,e),a)}function hd(){}function y0(e,n){var a=cn();n=n===void 0?null:n;var r=a.memoizedState;return n!==null&&nd(n,r[1])?r[0]:(a.memoizedState=[e,n],e)}function S0(e,n){var a=cn();n=n===void 0?null:n;var r=a.memoizedState;if(n!==null&&nd(n,r[1]))return r[0];if(r=e(),qs){_n(!0);try{e()}finally{_n(!1)}}return a.memoizedState=[r,n],r}function pd(e,n,a){return a===void 0||(Ea&1073741824)!==0&&(Rt&261930)===0?e.memoizedState=n:(e.memoizedState=a,e=Dv(),mt.lanes|=e,as|=e,a)}function M0(e,n,a,r){return ri(a,n)?a:Ja.current!==null?(e=pd(e,a,r),ri(e,n)||(mn=!0),e):(Ea&106)===0||(Ea&1073741824)!==0&&(Rt&261930)===0?(mn=!0,e.memoizedState=a):(e=Dv(),mt.lanes|=e,as|=e,n)}function E0(e,n,a,r,c){var f=Xe.p;Xe.p=f!==0&&8>f?f:8;var y=Te.T,A={};A.types=y!==null?y.types:null,Te.T=A,vd(e,!1,n,a);try{var F=c(),J=Te.S;if(J!==null&&J(A,F),F!==null&&typeof F=="object"&&typeof F.then=="function"){var le=hM(F,r);il(e,n,le,fi(e))}else il(e,n,r,fi(e))}catch(ge){il(e,n,{then:function(){},status:"rejected",reason:ge},fi())}finally{Xe.p=f,y!==null&&A.types!==null&&(y.types=A.types),Te.T=y}}function xM(){}function md(e,n,a,r){if(e.tag!==5)throw Error(o(476));var c=T0(e).queue;E0(e,c,n,D,a===null?xM:function(){return b0(e),a(r)})}function T0(e){var n=e.memoizedState;if(n!==null)return n;n={memoizedState:D,baseState:D,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ta,lastRenderedState:D},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ta,lastRenderedState:a},next:null},e.memoizedState=n,e=e.alternate,e!==null&&(e.memoizedState=n),n}function b0(e){var n=T0(e);n.next===null&&(n=e.alternate.memoizedState),il(e,n.next.queue,{},fi())}function gd(){return Cn(Qr)}function A0(){return cn().memoizedState}function C0(){return cn().memoizedState}function yM(e){for(var n=e.return;n!==null;){switch(n.tag){case 24:case 3:var a=fi();e=Ka(a);var r=Qa(n,e,a);r!==null&&($n(r,n,a),Qo(r,n,a)),n={cache:kf()},e.payload=n;return}n=n.return}}function SM(e,n,a){var r=fi();a={lane:r,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Dc(e)?w0(n,a):(a=zf(e,n,a,r),a!==null&&($n(a,e,r),N0(a,n,r)))}function R0(e,n,a){var r=fi();il(e,n,a,r)}function il(e,n,a,r){var c={lane:r,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Dc(e))w0(n,c);else{var f=e.alternate;if(e.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var y=n.lastRenderedState,A=f(y,a);if(c.hasEagerState=!0,c.eagerState=A,ri(A,y))return lc(e,n,c,0),Kt===null&&oc(),!1}catch{}finally{}if(a=zf(e,n,c,r),a!==null)return $n(a,e,r),N0(a,n,r),!0}return!1}function vd(e,n,a,r){if(r={lane:2,revertLane:oh(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},Dc(e)){if(n)throw Error(o(479))}else n=zf(e,a,r,2),n!==null&&$n(n,e,2)}function Dc(e){var n=e.alternate;return e===mt||n!==null&&n===mt}function w0(e,n){Nr=Tc=!0;var a=e.pending;a===null?n.next=n:(n.next=a.next,a.next=n),e.pending=n}function N0(e,n,a){if((a&4194048)!==0){var r=n.lanes;r&=e.pendingLanes,a|=r,n.lanes=a,ee(e,a)}}var Uc={readContext:Cn,use:Cc,useCallback:on,useContext:on,useEffect:on,useImperativeHandle:on,useLayoutEffect:on,useInsertionEffect:on,useMemo:on,useReducer:on,useRef:on,useState:on,useDebugValue:on,useDeferredValue:on,useTransition:on,useSyncExternalStore:on,useId:on,useHostTransitionStatus:on,useFormState:on,useActionState:on,useOptimistic:on,useMemoCache:on,useCacheRefresh:on,useEffectEvent:on},D0={readContext:Cn,use:Cc,useCallback:function(e,n){return Vn().memoizedState=[e,n===void 0?null:n],e},useContext:Cn,useEffect:p0,useImperativeHandle:function(e,n,a){a=a!=null?a.concat([e]):null,wc(4194308,4,_0.bind(null,n,e),a)},useLayoutEffect:function(e,n){return wc(4194308,4,e,n)},useInsertionEffect:function(e,n){wc(4,2,e,n)},useMemo:function(e,n){var a=Vn();n=n===void 0?null:n;var r=e();if(qs){_n(!0);try{e()}finally{_n(!1)}}return a.memoizedState=[r,n],r},useReducer:function(e,n,a){var r=Vn();if(a!==void 0){var c=a(n);if(qs){_n(!0);try{a(n)}finally{_n(!1)}}}else c=n;return r.memoizedState=r.baseState=c,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:c},r.queue=e,e=e.dispatch=SM.bind(null,mt,e),[r.memoizedState,e]},useRef:function(e){var n=Vn();return e={current:e},n.memoizedState=e},useState:function(e){e=ud(e);var n=e.queue,a=R0.bind(null,mt,n);return n.dispatch=a,[e.memoizedState,a]},useDebugValue:hd,useDeferredValue:function(e,n){var a=Vn();return pd(a,e,n)},useTransition:function(){var e=ud(!1);return e=E0.bind(null,mt,e.queue,!0,!1),Vn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,n,a){var r=mt,c=Vn();if(St){if(a===void 0)throw Error(o(407));a=a()}else{if(a=n(),Kt===null)throw Error(o(349));(Rt&127)!==0||Jg(r,n,a)}c.memoizedState=a;var f={value:a,getSnapshot:n};return c.queue=f,p0(e0.bind(null,r,f,e),[e]),r.flags|=2048,Ur(9,{destroy:void 0},$g.bind(null,r,f,a,n),null),a},useId:function(){var e=Vn(),n=Kt.identifierPrefix;if(St){var a=$i,r=Ji;a=(r&~(1<<32-zn(r)-1)).toString(32)+a,n="_"+n+"R_"+a,a=bc++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=pM++,n="_"+n+"r_"+a.toString(32)+"_";return e.memoizedState=n},useHostTransitionStatus:gd,useFormState:c0,useActionState:c0,useOptimistic:function(e){var n=Vn();n.memoizedState=n.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=vd.bind(null,mt,!0,a),a.dispatch=n,[e,n]},useMemoCache:od,useCacheRefresh:function(){return Vn().memoizedState=yM.bind(null,mt)},useEffectEvent:function(e){var n=Vn(),a={impl:e};return n.memoizedState=a,function(){if((Ft&2)!==0)throw Error(o(440));return a.impl.apply(void 0,arguments)}}},U0={readContext:Cn,use:Cc,useCallback:y0,useContext:Cn,useEffect:dd,useImperativeHandle:x0,useInsertionEffect:g0,useLayoutEffect:v0,useMemo:S0,useReducer:Rc,useRef:h0,useState:function(){return Rc(Ta)},useDebugValue:hd,useDeferredValue:function(e,n){var a=cn();return M0(a,Yt.memoizedState,e,n)},useTransition:function(){var e=Rc(Ta)[0],n=cn().memoizedState;return[typeof e=="boolean"?e:nl(e),n]},useSyncExternalStore:Qg,useId:A0,useHostTransitionStatus:gd,useFormState:u0,useActionState:u0,useOptimistic:function(e,n){var a=cn();return i0(a,Yt,e,n)},useMemoCache:od,useCacheRefresh:C0,useEffectEvent:m0},MM={readContext:Cn,use:Cc,useCallback:y0,useContext:Cn,useEffect:dd,useImperativeHandle:x0,useInsertionEffect:g0,useLayoutEffect:v0,useMemo:S0,useReducer:cd,useRef:h0,useState:function(){return cd(Ta)},useDebugValue:hd,useDeferredValue:function(e,n){var a=cn();return Yt===null?pd(a,e,n):M0(a,Yt.memoizedState,e,n)},useTransition:function(){var e=cd(Ta)[0],n=cn().memoizedState;return[typeof e=="boolean"?e:nl(e),n]},useSyncExternalStore:Qg,useId:A0,useHostTransitionStatus:gd,useFormState:d0,useActionState:d0,useOptimistic:function(e,n){var a=cn();return Yt!==null?i0(a,Yt,e,n):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:od,useCacheRefresh:C0,useEffectEvent:m0};function _d(e,n,a,r){n=e.memoizedState,a=a(r,n),a=a==null?n:I({},n,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var xd={enqueueSetState:function(e,n,a){e=e._reactInternals;var r=fi(),c=Ka(r);c.payload=n,a!=null&&(c.callback=a),n=Qa(e,c,r),n!==null&&($n(n,e,r),Qo(n,e,r))},enqueueReplaceState:function(e,n,a){e=e._reactInternals;var r=fi(),c=Ka(r);c.tag=1,c.payload=n,a!=null&&(c.callback=a),n=Qa(e,c,r),n!==null&&($n(n,e,r),Qo(n,e,r))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var a=fi(),r=Ka(a);r.tag=2,n!=null&&(r.callback=n),n=Qa(e,r,a),n!==null&&($n(n,e,a),Qo(n,e,a))}};function L0(e,n,a,r,c,f,y){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,f,y):n.prototype&&n.prototype.isPureReactComponent?!Vo(a,r)||!Vo(c,f):!0}function O0(e,n,a,r){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,r),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,r),n.state!==e&&xd.enqueueReplaceState(n,n.state,null)}function Ys(e,n){var a=n;if("ref"in n){a={};for(var r in n)r!=="ref"&&(a[r]=n[r])}if(e=e.defaultProps){a===n&&(a=I({},a));for(var c in e)a[c]===void 0&&(a[c]=e[c])}return a}function z0(e){rc(e)}function P0(e){console.error(e)}function I0(e){rc(e)}function Lc(e,n){try{var a=e.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(r){setTimeout(function(){throw r})}}function B0(e,n,a){try{var r=e.onCaughtError;r(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(c){setTimeout(function(){throw c})}}function yd(e,n,a){return a=Ka(a),a.tag=3,a.payload={element:null},a.callback=function(){Lc(e,n)},a}function F0(e){return e=Ka(e),e.tag=3,e}function H0(e,n,a,r){var c=a.type.getDerivedStateFromError;if(typeof c=="function"){var f=r.value;e.payload=function(){return c(f)},e.callback=function(){B0(n,a,r)}}var y=a.stateNode;y!==null&&typeof y.componentDidCatch=="function"&&(e.callback=function(){B0(n,a,r),typeof c!="function"&&(ss===null?ss=new Set([this]):ss.add(this));var A=r.stack;this.componentDidCatch(r.value,{componentStack:A!==null?A:""})})}function EM(e,n,a,r,c){if(a.flags|=32768,r!==null&&typeof r=="object"&&typeof r.then=="function"){if(n=a.alternate,n!==null&&Fs(n,a,c,!0),a=Rn.current,a!==null){switch(a.tag){case 31:case 13:case 19:return In===null?eu():a.alternate===null&&ln===0&&(ln=3),a.flags&=-257,a.flags|=65536,a.lanes=c,r===xc?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([r]):n.add(r),ah(e,r,c)),!1;case 22:return a.flags|=65536,r===xc?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([r])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([r]):a.add(r)),ah(e,r,c)),!1}throw Error(o(435,a.tag))}return ah(e,r,c),eu(),!1}if(St)return n=Rn.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=c,r!==Hf&&(e=Error(o(422),{cause:r}),qo(Si(e,a)))):(r!==Hf&&(n=Error(o(423),{cause:r}),qo(Si(n,a))),e=e.current.alternate,e.flags|=65536,c&=-c,e.lanes|=c,r=Si(r,a),c=yd(e.stateNode,r,c),Kf(e,c),ln!==4&&(ln=2)),!1;var f=Error(o(520),{cause:r});if(f=Si(f,a),fl===null?fl=[f]:fl.push(f),ln!==4&&(ln=2),n===null)return!0;r=Si(r,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,e=c&-c,a.lanes|=e,e=yd(a.stateNode,r,e),Kf(a,e),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(ss===null||!ss.has(f))))return a.flags|=65536,c&=-c,a.lanes|=c,c=F0(c),H0(c,e,a,r),Kf(a,c),!1;break;case 22:if(a.memoizedState!==null)return a.flags|=65536,!1}a=a.return}while(a!==null);return!1}var Sd=Error(o(461)),mn=!1;function yn(e,n,a,r){n.child=e===null?kg(n,null,a,r):Xs(n,e.child,a,r)}function j0(e,n,a,r,c){a=a.render;var f=n.ref;if("ref"in r){var y={};for(var A in r)A!=="ref"&&(y[A]=r[A])}else y=r;return Hs(n),r=id(e,n,a,y,f,c),A=ad(),e!==null&&!mn?(sd(e,n,c),ba(e,n,c)):(St&&A&&dc(n),n.flags|=1,yn(e,n,r,c),n.child)}function G0(e,n,a,r,c){if(e===null){var f=a.type;return typeof f=="function"&&!Pf(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,V0(e,n,f,r,c)):(e=uc(a.type,null,r,n,n.mode,c),e.ref=n.ref,e.return=n,n.child=e)}if(f=e.child,!wd(e,c)){var y=f.memoizedProps;if(a=a.compare,a=a!==null?a:Vo,a(y,r)&&e.ref===n.ref)return ba(e,n,c)}return n.flags|=1,e=xa(f,r),e.ref=n.ref,e.return=n,n.child=e}function V0(e,n,a,r,c){if(e!==null){var f=e.memoizedProps;if(Vo(f,r)&&e.ref===n.ref)if(mn=!1,n.pendingProps=r=f,wd(e,c))(e.flags&131072)!==0&&(mn=!0);else return n.lanes=e.lanes,ba(e,n,c)}return Md(e,n,a,r,c)}function k0(e,n,a,r){var c=r.children,f=e!==null?e.memoizedState:null;if(e===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode==="hidden"){if((n.flags&128)!==0){if(f=f!==null?f.baseLanes|a:a,e!==null){for(r=n.child=e.child,c=0;r!==null;)c=c|r.lanes|r.childLanes,r=r.sibling;r=c&~f}else r=0,n.child=null;return X0(e,n,f,a,r)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},e!==null&&vc(n,f!==null?f.cachePool:null),f!==null?Yg(n,f):Jf(),Wg(n);else return r=n.lanes=536870912,X0(e,n,f!==null?f.baseLanes|a:a,a,r)}else f!==null?(vc(n,f.cachePool),Yg(n,f),es(),n.memoizedState=null):(e!==null&&vc(n,null),Jf(),es());return yn(e,n,c,a),n.child}function al(e,n){return e!==null&&e.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function X0(e,n,a,r,c){var f=qf();return f=f===null?null:{parent:hn._currentValue,pool:f},n.memoizedState={baseLanes:a,cachePool:f},e!==null&&vc(n,null),Jf(),Wg(n),e!==null&&Fs(e,n,r,!0),n.childLanes=c,null}function Oc(e,n){return n=zc({mode:n.mode,children:n.children},e.mode),n.ref=e.ref,e.child=n,n.return=e,n}function q0(e,n,a){return Xs(n,e.child,null,a),e=Oc(n,n.pendingProps),e.flags|=2,oi(n),n.memoizedState=null,e}function TM(e,n,a){var r=n.pendingProps,c=(n.flags&128)!==0;if(n.flags&=-129,e===null){if(St){if(r.mode==="hidden")return e=Oc(n,r),n.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},al(null,e);if(ed(n),(e=Jt)?(e=__(e,Ti),e=e!==null&&e.data==="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:ka!==null?{id:Ji,overflow:$i}:null,retryLane:536870912,hydrationErrors:null},a=wg(e),a.return=n,n.child=a,En=n,Jt=null)):e=null,e===null)throw qa(n);return n.lanes=536870912,null}return Oc(n,r)}var f=e.memoizedState;if(f!==null){var y=f.dehydrated;if(ed(n),c)if(n.flags&256)n.flags&=-257,n=q0(e,n,a);else if(n.memoizedState!==null)n.child=e.child,n.flags|=128,n=null;else throw Error(o(558));else if(mn||Fs(e,n,a,!1),c=(a&e.childLanes)!==0,mn||c){if(Ja.current===null){if(r=Kt,r!==null&&(y=ce(r,a),y!==0&&y!==f.retryLane))throw f.retryLane=y,zs(e,y),$n(r,e,y),Sd;eu()}n=q0(e,n,a)}else e=f.treeContext,Jt=Ai(y.nextSibling),En=n,St=!0,Xa=null,Ti=!1,e!==null&&Ug(n,e),n=Oc(n,r),n.flags|=134221824;return n}return e=xa(e.child,{mode:r.mode,children:r.children}),e.ref=n.ref,n.child=e,e.return=n,e}function Lr(e,n){var a=n.ref;if(a===null)e!==null&&e.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(o(284));(e===null||e.ref!==a)&&(n.flags|=4194816)}}function Md(e,n,a,r,c){return Hs(n),a=id(e,n,a,r,void 0,c),r=ad(),e!==null&&!mn?(sd(e,n,c),ba(e,n,c)):(St&&r&&dc(n),n.flags|=1,yn(e,n,a,c),n.child)}function Y0(e,n,a,r,c,f){return Hs(n),n.updateQueue=null,a=Kg(n,r,a,c),Zg(e),r=ad(),e!==null&&!mn?(sd(e,n,f),ba(e,n,f)):(St&&r&&dc(n),n.flags|=1,yn(e,n,a,f),n.child)}function W0(e,n,a,r,c){if(Hs(n),n.stateNode===null){var f=Er,y=a.contextType;typeof y=="object"&&y!==null&&(f=Cn(y)),f=new a(r,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=xd,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=r,f.state=n.memoizedState,f.refs={},Wf(n),y=a.contextType,f.context=typeof y=="object"&&y!==null?Cn(y):Er,f.state=n.memoizedState,y=a.getDerivedStateFromProps,typeof y=="function"&&(_d(n,a,y,r),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(y=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),y!==f.state&&xd.enqueueReplaceState(f,f.state,null),$o(n,r,f,c),Jo(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),r=!0}else if(e===null){f=n.stateNode;var A=n.memoizedProps,F=Ys(a,A);f.props=F;var J=f.context,le=a.contextType;y=Er,typeof le=="object"&&le!==null&&(y=Cn(le));var ge=a.getDerivedStateFromProps;le=typeof ge=="function"||typeof f.getSnapshotBeforeUpdate=="function",A=n.pendingProps!==A,le||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(A||J!==y)&&O0(n,f,r,y),Za=!1;var K=n.memoizedState;f.state=K,$o(n,r,f,c),Jo(),J=n.memoizedState,A||K!==J||Za?(typeof ge=="function"&&(_d(n,a,ge,r),J=n.memoizedState),(F=Za||L0(n,a,F,r,K,J,y))?(le||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=r,n.memoizedState=J),f.props=r,f.state=J,f.context=y,r=F):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),r=!1)}else{f=n.stateNode,Zf(e,n),y=n.memoizedProps,le=Ys(a,y),f.props=le,ge=n.pendingProps,K=f.context,J=a.contextType,F=Er,typeof J=="object"&&J!==null&&(F=Cn(J)),A=a.getDerivedStateFromProps,(J=typeof A=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(y!==ge||K!==F)&&O0(n,f,r,F),Za=!1,K=n.memoizedState,f.state=K,$o(n,r,f,c),Jo();var re=n.memoizedState;y!==ge||K!==re||Za||e!==null&&e.dependencies!==null&&mc(e.dependencies)?(typeof A=="function"&&(_d(n,a,A,r),re=n.memoizedState),(le=Za||L0(n,a,le,r,K,re,F)||e!==null&&e.dependencies!==null&&mc(e.dependencies))?(J||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(r,re,F),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(r,re,F)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||y===e.memoizedProps&&K===e.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||y===e.memoizedProps&&K===e.memoizedState||(n.flags|=1024),n.memoizedProps=r,n.memoizedState=re),f.props=r,f.state=re,f.context=F,r=le):(typeof f.componentDidUpdate!="function"||y===e.memoizedProps&&K===e.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||y===e.memoizedProps&&K===e.memoizedState||(n.flags|=1024),r=!1)}return f=r,Lr(e,n),r=(n.flags&128)!==0,f||r?(f=n.stateNode,a=r&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,e!==null&&r?(n.child=Xs(n,e.child,null,c),n.child=Xs(n,null,a,c)):yn(e,n,a,c),n.memoizedState=f.state,e=n.child):e=ba(e,n,c),e}function Z0(e,n,a,r){return Is(),n.flags|=256,yn(e,n,a,r),n.child}var Ed={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Td(e){return{baseLanes:e,cachePool:Bg()}}function bd(e,n,a){return e=e!==null?e.childLanes&~a:0,n&&(e|=ui),e}function K0(e,n,a){var r=n.pendingProps,c=!1,f=(n.flags&128)!==0,y;if((y=f)||(y=e!==null&&e.memoizedState===null?!1:(wn.current&2)!==0),y&&(c=!0,n.flags&=-129),y=(n.flags&32)!==0,n.flags&=-33,e===null){if(St){if(c?$a(n):es(),(e=Jt)?(e=__(e,Ti),e=e!==null&&e.data!=="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:ka!==null?{id:Ji,overflow:$i}:null,retryLane:536870912,hydrationErrors:null},a=wg(e),a.return=n,n.child=a,En=n,Jt=null)):e=null,e===null)throw qa(n);return Th(e)?n.lanes=32:n.lanes=536870912,null}return f=r.children,r=r.fallback,c?(es(),c=n.mode,f=zc({mode:"hidden",children:f},c),r=Ps(r,c,a,null),f.return=n,r.return=n,f.sibling=r,n.child=f,r=n.child,r.memoizedState=Td(a),r.childLanes=bd(e,y,a),n.memoizedState=Ed,al(null,r)):($a(n),Ad(n,f))}var A=e.memoizedState;if(A!==null){var F=A.dehydrated;if(F!==null)return bM(e,n,f,y,r,F,A,a)}return c?(es(),c=r.fallback,f=n.mode,A=e.child,F=A.sibling,r=xa(A,{mode:"hidden",children:r.children}),r.subtreeFlags=A.subtreeFlags&1206910976,F!==null?c=xa(F,c):(c=Ps(c,f,a,null),c.flags|=2),c.return=n,r.return=n,r.sibling=c,n.child=r,al(null,r),r=n.child,c=e.child.memoizedState,c===null?c=Td(a):(f=c.cachePool,f!==null?(A=hn._currentValue,f=f.parent!==A?{parent:A,pool:A}:f):f=Bg(),c={baseLanes:c.baseLanes|a,cachePool:f}),r.memoizedState=c,r.childLanes=bd(e,y,a),n.memoizedState=Ed,al(e.child,r)):($a(n),a=e.child,e=a.sibling,a=xa(a,{mode:"visible",children:r.children}),a.return=n,a.sibling=null,e!==null&&(y=n.deletions,y===null?(n.deletions=[e],n.flags|=16):y.push(e)),n.child=a,n.memoizedState=null,a)}function Ad(e,n){return n=zc({mode:"visible",children:n},e.mode),n.return=e,e.child=n}function zc(e,n){return e=Zn(22,e,null,n),e.lanes=0,e}function Pc(e,n,a){return Xs(n,e.child,null,a),e=Ad(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function bM(e,n,a,r,c,f,y,A){if(a)return n.flags&256?($a(n),n.flags&=-257,Pc(e,n,A)):n.memoizedState!==null?(es(),n.child=e.child,n.flags|=128,null):(es(),f=c.fallback,y=n.mode,c=zc({mode:"visible",children:c.children},y),f=Ps(f,y,A,null),f.flags|=2,c.return=n,f.return=n,c.sibling=f,n.child=c,Xs(n,e.child,null,A),c=n.child,c.memoizedState=Td(A),c.childLanes=bd(e,r,A),n.memoizedState=Ed,al(null,c));if($a(n),Th(f)){if(r=f.nextSibling&&f.nextSibling.dataset,r)var F=r.dgst;return r=F,r!==""&&(c=Error(o(419)),c.stack="",c.digest=r,qo({value:c,source:null,stack:null})),Pc(e,n,A)}if(mn||Fs(e,n,A,!1),r=(A&e.childLanes)!==0,mn||r){if(Ja.current!==null)return Pc(e,n,A);if(r=Kt,r!==null&&(c=ce(r,A),c!==0&&c!==y.retryLane))throw y.retryLane=c,zs(e,c),$n(r,e,c),Sd;return Eh(f)||eu(),Pc(e,n,A)}return Eh(f)?(n.flags|=192,n.child=e.child,null):(e=y.treeContext,Jt=Ai(f.nextSibling),En=n,St=!0,Xa=null,Ti=!1,e!==null&&Ug(n,e),n=Ad(n,c.children),n.flags|=134221824,n)}function Q0(e,n,a){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n),pc(e.return,n,a)}function J0(e){for(var n=null;e!==null;){var a=e.alternate;a!==null&&Ec(a)===null&&(n=e),e=e.sibling}return n}function Ic(e,n,a,r,c,f){var y=e.memoizedState;y===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:r,tail:a,tailMode:c,treeForkCount:f}:(y.isBackwards=n,y.rendering=null,y.renderingStartTime=0,y.last=r,y.tail=a,y.tailMode=c,y.treeForkCount=f)}function Cd(e){var n=e.child;for(e.child=null;n!==null;){var a=n.sibling;n.sibling=e.child,e.child=n,n=a}}function Rd(e,n,a){var r=n.pendingProps,c=r.revealOrder,f=r.tail;r=r.children;var y=wn.current;if(n.flags&128)return el(n,y),null;var A=(y&2)!==0;if(A?(y=y&1|2,n.flags|=128):y&=1,el(n,y),c==="backwards"&&e!==null?(Cd(e),yn(e,n,r,a),Cd(e)):yn(e,n,r,a),r=St?Xo:0,!A&&e!==null&&(e.flags&128)!==0)e:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Q0(e,a,n);else if(e.tag===19)Q0(e,a,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break e;for(;e.sibling===null;){if(e.return===null||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(c){case"backwards":a=J0(n.child),a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null,Cd(n)),Ic(n,!0,c,null,f,r);break;case"unstable_legacy-backwards":for(a=null,c=n.child,n.child=null;c!==null;){if(e=c.alternate,e!==null&&Ec(e)===null){n.child=c;break}e=c.sibling,c.sibling=a,a=c,c=e}Ic(n,!0,a,null,f,r);break;case"together":Ic(n,!1,null,null,void 0,r);break;case"independent":n.memoizedState=null;break;default:a=J0(n.child),a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null),Ic(n,!1,c,a,f,r)}return n.child}function $0(e,n,a){var r=n.pendingProps;return Ya(n,n.type,r.value),yn(e,n,r.children,a),n.child}function ba(e,n,a){if(e!==null&&(n.dependencies=e.dependencies),as|=n.lanes,(a&n.childLanes)===0)if(e!==null){if(Fs(e,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(e!==null&&n.child!==e.child)throw Error(o(153));if(n.child!==null){for(e=n.child,a=xa(e,e.pendingProps),n.child=a,a.return=n;e.sibling!==null;)e=e.sibling,a=a.sibling=xa(e,e.pendingProps),a.return=n;a.sibling=null}return n.child}function wd(e,n){return(e.lanes&n)!==0?!0:(e=e.dependencies,!!(e!==null&&mc(e)))}function AM(e,n,a){switch(n.tag){case 3:P(n,n.stateNode.containerInfo),Ya(n,hn,e.memoizedState.cache),Is();break;case 27:case 5:se(n);break;case 4:P(n,n.stateNode.containerInfo);break;case 10:Ya(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,ed(n),null;break;case 13:var r=n.memoizedState;if(r!==null){if(r.dehydrated!==null)return $a(n),n.flags|=128,null;r=Fs(e,n,a,!1);var c=n.child.childLanes;return r||(a&c)!==0?K0(e,n,a):($a(n),e=ba(e,n,a),e!==null?e.sibling:null)}$a(n);break;case 19:if(n.flags&128)return Rd(e,n,a);if(c=(e.flags&128)!==0,r=(a&n.childLanes)!==0,r||(Fs(e,n,a,!1),r=(a&n.childLanes)!==0),c){if(r)return Rd(e,n,a);n.flags|=128}if(c=n.memoizedState,c!==null&&(c.rendering=null,c.tail=null,c.lastEffect=null),el(n,wn.current),r)break;return null;case 22:return n.lanes=0,k0(e,n,a,n.pendingProps);case 24:Ya(n,hn,e.memoizedState.cache)}return ba(e,n,a)}function ev(e,n,a){if(e!==null)if(e.memoizedProps!==n.pendingProps)mn=!0;else{if(!wd(e,a)&&(n.flags&128)===0)return mn=!1,AM(e,n,a);mn=(e.flags&131072)!==0}else mn=!1,St&&(n.flags&1048576)!==0&&Dg(n,Xo,n.index);switch(n.lanes=0,n.tag){case 16:e:{var r=n.pendingProps;if(e=Vs(n.elementType),n.type=e,typeof e=="function")Pf(e)?(r=Ys(e,r),n.tag=1,n=W0(null,n,e,r,a)):(n.tag=0,n=Md(null,n,e,r,a));else{if(e!=null){var c=e.$$typeof;if(c===O){n.tag=11,n=j0(null,n,e,r,a);break e}else if(c===ve){n.tag=14,n=G0(null,n,e,r,a);break e}else if(c===B){n.tag=10,n.type=e,n=$0(null,n,a);break e}}throw n=Le(e)||e,Error(o(306,n,""))}}return n;case 0:return Md(e,n,n.type,n.pendingProps,a);case 1:return r=n.type,c=Ys(r,n.pendingProps),W0(e,n,r,c,a);case 3:e:{if(P(n,n.stateNode.containerInfo),e===null)throw Error(o(387));r=n.pendingProps;var f=n.memoizedState;c=f.element,Zf(e,n),$o(n,r,null,a);var y=n.memoizedState;if(r=y.cache,Ya(n,hn,r),r!==f.cache&&Vf(n,[hn],a,!0),Jo(),r=y.element,f.isDehydrated)if(f={element:r,isDehydrated:!1,cache:y.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=Z0(e,n,r,a);break e}else if(r!==c){c=Si(Error(o(424)),n),qo(c),n=Z0(e,n,r,a);break e}else{switch(e=n.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(Jt=Ai(e.firstChild),En=n,St=!0,Xa=null,Ti=!0,a=kg(n,null,r,a),n.child=a;a;)a.flags=a.flags&-3|134221824,a=a.sibling}else{if(Is(),r===c){n=ba(e,n,a);break e}yn(e,n,r,a)}n=n.child}return n;case 26:return Lr(e,n),e===null?(a=b_(n.type,null,n.pendingProps,null))?n.memoizedState=a:St||(n.stateNode=a_(n.type,n.pendingProps,it.current,n)):n.memoizedState=b_(n.type,e.memoizedProps,n.pendingProps,e.memoizedState),null;case 27:return se(n),e===null&&St&&(r=n.stateNode=S_(n.type,n.pendingProps,it.current),En=n,Ti=!0,c=Jt,ls(n.type)?(bh=c,Jt=Ai(r.firstChild)):Jt=c),yn(e,n,n.pendingProps.children,a),Lr(e,n),e===null&&(n.flags|=4194304),n.child;case 5:return e===null&&St&&((c=r=Jt)&&(r=y1(r,n.type,n.pendingProps,Ti),r!==null?(n.stateNode=r,En=n,Jt=Ai(r.firstChild),Ti=!1,c=!0):c=!1),c||qa(n)),se(n),c=n.type,f=n.pendingProps,y=e!==null?e.memoizedProps:null,r=f.children,gh(c,f)?r=null:y!==null&&gh(c,y)&&(n.flags|=32),n.memoizedState!==null&&(c=id(e,n,mM,null,null,a),Qr._currentValue=c),Lr(e,n),yn(e,n,r,a),n.child;case 6:return e===null&&St&&((e=a=Jt)&&(a=S1(a,n.pendingProps,Ti),a!==null?(n.stateNode=a,En=n,Jt=null,e=!0):e=!1),e||qa(n)),null;case 13:return K0(e,n,a);case 4:return P(n,n.stateNode.containerInfo),r=n.pendingProps,e===null?n.child=Xs(n,null,r,a):yn(e,n,r,a),n.child;case 11:return j0(e,n,n.type,n.pendingProps,a);case 7:return r=n.pendingProps,Lr(e,n),yn(e,n,r,a),n.child;case 8:return yn(e,n,n.pendingProps.children,a),n.child;case 12:return yn(e,n,n.pendingProps.children,a),n.child;case 10:return $0(e,n,a);case 9:return c=n.type._context,r=n.pendingProps.children,Hs(n),c=Cn(c),r=r(c),n.flags|=1,yn(e,n,r,a),n.child;case 14:return G0(e,n,n.type,n.pendingProps,a);case 15:return V0(e,n,n.type,n.pendingProps,a);case 19:return Rd(e,n,a);case 31:return TM(e,n,a);case 22:return k0(e,n,a,n.pendingProps);case 24:return Hs(n),r=Cn(hn),e===null?(c=qf(),c===null&&(c=Kt,f=kf(),c.pooledCache=f,f.refCount++,f!==null&&(c.pooledCacheLanes|=a),c=f),n.memoizedState={parent:r,cache:c},Wf(n),Ya(n,hn,c)):((e.lanes&a)!==0&&(Zf(e,n),$o(n,null,null,a),Jo()),c=e.memoizedState,f=n.memoizedState,c.parent!==r?(c={parent:r,cache:r},n.memoizedState=c,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=c),Ya(n,hn,r)):(r=f.cache,Ya(n,hn,r),r!==c.cache&&Vf(n,[hn],a,!0))),yn(e,n,n.pendingProps.children,a),n.child;case 30:return n.stateNode===null&&(n.stateNode={autoName:null,paired:null,clones:null,ref:null}),r=n.pendingProps,r.name!=null&&r.name!=="auto"?n.flags|=e===null?18882560:18874368:St&&dc(n),e!==null&&e.memoizedProps.name!==r.name?n.flags|=4194816:Lr(e,n),yn(e,n,r.children,a),n.child;case 29:throw n.pendingProps}throw Error(o(156,n.tag))}function Aa(e){e.flags|=4}function Nd(e,n,a,r,c){var f;if((f=(e.mode&32)!==0)&&(f=a===null?w_(n,r):w_(n,r)&&(r.src!==a.src||r.srcSet!==a.srcSet)),f){if(e.flags|=16777216,(c&335544128)===c)if(e.stateNode.complete)e.flags|=8192;else if(zv())e.flags|=8192;else throw ks=xc,Yf}else e.flags&=-16777217}function tv(e,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!N_(n))if(zv())e.flags|=8192;else throw ks=xc,Yf}function Bc(e,n){n!==null&&(e.flags|=4),e.flags&16384&&(n=e.tag!==22?Kl():536870912,e.lanes|=n,Br|=n)}function sl(e,n){if(!St)switch(e.tailMode){case"visible":break;case"collapsed":for(var a=e.tail,r=null;a!==null;)a.alternate!==null&&(r=a),a=a.sibling;r===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null;break;default:for(n=e.tail,a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?e.tail=null:a.sibling=null}}function $t(e){var n=e.alternate!==null&&e.alternate.child===e.child,a=0,r=0;if(n)for(var c=e.child;c!==null;)a|=c.lanes|c.childLanes,r|=c.subtreeFlags&1206910976,r|=c.flags&1206910976,c.return=e,c=c.sibling;else for(c=e.child;c!==null;)a|=c.lanes|c.childLanes,r|=c.subtreeFlags,r|=c.flags,c.return=e,c=c.sibling;return e.subtreeFlags|=r,e.childLanes=a,n}function CM(e,n,a){var r=n.pendingProps;switch(Ff(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return $t(n),null;case 1:return $t(n),null;case 3:return a=n.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),n.memoizedState.cache!==r&&(n.flags|=2048),Ma(hn),C(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(Ar(n)?Aa(n):e===null||e.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,jf())),$t(n),null;case 26:var c=n.type,f=n.memoizedState;return e===null?(Aa(n),f!==null?($t(n),tv(n,f)):($t(n),Nd(n,c,null,r,a))):f?f!==e.memoizedState?(Aa(n),$t(n),tv(n,f)):($t(n),n.flags&=-16777217):(e=e.memoizedProps,e!==r&&Aa(n),$t(n),Nd(n,c,e,r,a)),null;case 27:if(pe(n),a=it.current,c=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==r&&Aa(n);else{if(!r){if(n.stateNode===null)throw Error(o(166));return $t(n),n.subtreeFlags&=-33554433,null}e=ke.current,Ar(n)?Lg(n):(e=S_(c,r,a),n.stateNode=e,Aa(n))}return $t(n),n.subtreeFlags&=-33554433,null;case 5:if(pe(n),c=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==r&&Aa(n);else{if(!r){if(n.stateNode===null)throw Error(o(166));return $t(n),n.subtreeFlags&=-33554433,null}if(f=ke.current,Ar(n))Lg(n);else{var y=gl(it.current);switch(f){case 1:f=y.createElementNS("http://www.w3.org/2000/svg",c);break;case 2:f=y.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;default:switch(c){case"svg":f=y.createElementNS("http://www.w3.org/2000/svg",c);break;case"math":f=y.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;case"script":f=y.createElement("div"),f.innerHTML="<script><\/script>",f=f.removeChild(f.firstChild);break;case"select":f=typeof r.is=="string"?y.createElement("select",{is:r.is}):y.createElement("select"),r.multiple?f.multiple=!0:r.size&&(f.size=r.size);break;default:f=typeof r.is=="string"?y.createElement(c,{is:r.is}):y.createElement(c)}}f[Pe]=n,f[et]=r;e:for(y=n.child;y!==null;){if(y.tag===5||y.tag===6)f.appendChild(y.stateNode);else if(y.tag!==4&&y.tag!==27&&y.child!==null){y.child.return=y,y=y.child;continue}if(y===n)break e;for(;y.sibling===null;){if(y.return===null||y.return===n)break e;y=y.return}y.sibling.return=y.return,y=y.sibling}n.stateNode=f;e:switch(Dn(f,c,r),c){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}r&&Aa(n)}}return $t(n),n.subtreeFlags&=-33554433,Nd(n,n.type,e===null?null:e.memoizedProps,n.pendingProps,a),null;case 6:if(e&&n.stateNode!=null)e.memoizedProps!==r&&Aa(n);else{if(typeof r!="string"&&n.stateNode===null)throw Error(o(166));if(e=it.current,Ar(n)){if(e=n.stateNode,a=n.memoizedProps,r=null,c=En,c!==null)switch(c.tag){case 27:case 5:r=c.memoizedProps}e[Pe]=n,e=!!(e.nodeValue===a||r!==null&&r.suppressHydrationWarning===!0||e_(e.nodeValue,a)),e||qa(n,!0)}else e=gl(e).createTextNode(r),e[Pe]=n,n.stateNode=e}return $t(n),null;case 31:if(a=n.memoizedState,e===null||e.memoizedState!==null){if(r=Ar(n),a!==null){if(e===null){if(!r)throw Error(o(318));if(e=n.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(557));e[Pe]=n}else Is(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;$t(n),e=!1}else a=jf(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return n.flags&256?(oi(n),n):(oi(n),null);if((n.flags&128)!==0)throw Error(o(558))}return $t(n),null;case 13:if(r=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(c=Ar(n),r!==null&&r.dehydrated!==null){if(e===null){if(!c)throw Error(o(318));if(c=n.memoizedState,c=c!==null?c.dehydrated:null,!c)throw Error(o(317));c[Pe]=n}else Is(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;$t(n),c=!1}else c=jf(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=c),c=!0;if(!c)return n.flags&256?(oi(n),n):(oi(n),null)}return oi(n),(n.flags&128)!==0?(n.lanes=a,n):(a=r!==null,e=e!==null&&e.memoizedState!==null,a&&(r=n.child,c=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(c=r.alternate.memoizedState.cachePool.pool),f=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(f=r.memoizedState.cachePool.pool),f!==c&&(r.flags|=2048)),a!==e&&a&&(n.child.flags|=8192),Bc(n,n.updateQueue),$t(n),null);case 4:return C(),e===null&&fh(n.stateNode.containerInfo),n.flags|=67108864,$t(n),null;case 10:return Ma(n.type),$t(n),null;case 19:if(td(n),r=n.memoizedState,r===null)return $t(n),null;if(c=(n.flags&128)!==0,f=r.rendering,f===null)if(c)sl(r,!1);else{if(ln!==0||e!==null&&(e.flags&128)!==0)for(e=n.child;e!==null;){if(f=Ec(e),f!==null){for(n.flags|=128,sl(r,!1),e=f.updateQueue,n.updateQueue=e,Bc(n,e),n.subtreeFlags=0,e=a,a=n.child;a!==null;)Rg(a,e),a=a.sibling;return el(n,wn.current&1|2),St&&ya(n,r.treeForkCount),n.child}e=e.sibling}r.tail!==null&&W()>Kc&&(n.flags|=128,c=!0,sl(r,!1),n.lanes=4194304)}else{if(!c)if(e=Ec(f),e!==null){if(n.flags|=128,c=!0,e=e.updateQueue,n.updateQueue=e,Bc(n,e),sl(r,!0),r.tail===null&&r.tailMode!=="collapsed"&&r.tailMode!=="visible"&&!f.alternate&&!St)return $t(n),null}else 2*W()-r.renderingStartTime>Kc&&a!==536870912&&(n.flags|=128,c=!0,sl(r,!1),n.lanes=4194304);r.isBackwards?(f.sibling=n.child,n.child=f):(e=r.last,e!==null?e.sibling=f:n.child=f,r.last=f)}if(r.tail!==null){e=r.tail;e:{for(a=e;a!==null;){if(a.alternate!==null){a=!1;break e}a=a.sibling}a=!0}return r.rendering=e,r.tail=e.sibling,r.renderingStartTime=W(),e.sibling=null,f=wn.current,f=c?f&1|2:f&1,r.tailMode==="visible"||r.tailMode==="collapsed"||!a||St?el(n,f):(a=f,lt(Rn,n),lt(wn,a),In===null&&(In=n)),St&&ya(n,r.treeForkCount),e}return $t(n),null;case 22:case 23:return oi(n),$f(),r=n.memoizedState!==null,e!==null?e.memoizedState!==null!==r&&(n.flags|=8192):r&&(n.flags|=8192),r?(a&536870912)!==0&&(n.flags&128)===0&&($t(n),n.subtreeFlags&6&&(n.flags|=8192)):$t(n),a=n.updateQueue,a!==null&&Bc(n,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),r=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(r=n.memoizedState.cachePool.pool),r!==a&&(n.flags|=2048),e!==null&&Be(Gs),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),Ma(hn),$t(n),null;case 25:return null;case 30:return n.flags|=33554432,$t(n),null}throw Error(o(156,n.tag))}function RM(e,n){switch(Ff(n),n.tag){case 1:return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return Ma(hn),C(),e=n.flags,(e&65536)!==0&&(e&128)===0?(n.flags=e&-65537|128,n):null;case 26:case 27:case 5:return pe(n),null;case 31:if(n.memoizedState!==null){if(oi(n),n.alternate===null)throw Error(o(340));Is()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 13:if(oi(n),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(o(340));Is()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return td(n),e=n.flags,e&65536?(n.flags=e&-65537|128,e=n.memoizedState,e!==null&&(e.rendering=null,e.tail=null),n.flags|=4,n):null;case 4:return C(),null;case 10:return Ma(n.type),null;case 22:case 23:return oi(n),$f(),e!==null&&Be(Gs),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 24:return Ma(hn),null;case 25:return null;default:return null}}function nv(e,n){switch(Ff(n),n.tag){case 3:Ma(hn),C();break;case 26:case 27:case 5:pe(n);break;case 4:C();break;case 31:n.memoizedState!==null&&oi(n);break;case 13:oi(n);break;case 19:td(n);break;case 10:Ma(n.type);break;case 22:case 23:oi(n),$f(),e!==null&&Be(Gs);break;case 24:Ma(hn)}}function rl(e,n){try{var a=n.updateQueue,r=a!==null?a.lastEffect:null;if(r!==null){var c=r.next;a=c;do{if((a.tag&e)===e){r=void 0;var f=a.create,y=a.inst;r=f(),y.destroy=r}a=a.next}while(a!==c)}}catch(A){Vt(n,n.return,A)}}function ts(e,n,a){try{var r=n.updateQueue,c=r!==null?r.lastEffect:null;if(c!==null){var f=c.next;r=f;do{if((r.tag&e)===e){var y=r.inst,A=y.destroy;if(A!==void 0){y.destroy=void 0,c=n;var F=a,J=A;try{J()}catch(le){Vt(c,F,le)}}}r=r.next}while(r!==f)}}catch(le){Vt(n,n.return,le)}}function iv(e){var n=e.updateQueue;if(n!==null){var a=e.stateNode;try{qg(n,a)}catch(r){Vt(e,e.return,r)}}}function av(e,n,a){a.props=Ys(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(r){Vt(e,n,r)}}function ea(e,n){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:var c=e.stateNode,f=va(e.memoizedProps,c);(c.ref===null||c.ref.name!==f)&&(c.ref=f_(f)),r=c.ref;break;case 7:if(e.stateNode===null){var y=new di(e);v(e.child,!1,_1,y,void 0,void 0),e.stateNode=y}r=e.stateNode;break;default:r=e.stateNode}typeof a=="function"?e.refCleanup=a(r):a.current=r}}catch(A){Vt(e,n,A)}}function Nn(e,n){var a=e.ref,r=e.refCleanup;if(a!==null)if(typeof r=="function")try{r()}catch(c){Vt(e,n,c)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(c){Vt(e,n,c)}else a.current=null}function Fc(e,n){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&n!==null)for(var a=0;a<n.length;a++)v_(e.stateNode,n[a])}function sv(e){for(var n=e.return;n!==null&&(Ud(n)&&v_(e.stateNode,n.stateNode),!Dd(n));)n=n.return}function ol(e){for(var n=e.return;n!==null&&(Ud(n)&&x1(e.stateNode,n.stateNode),!Dd(n));)n=n.return}function Dd(e){return e.tag===5||e.tag===3||e.tag===27}function Ud(e){return e&&e.tag===7&&e.stateNode!==null}function Ld(e){var n=e.type,a=e.memoizedProps,r=e.stateNode;try{e:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&r.focus();break e;case"img":a.src?r.src=a.src:a.srcSet&&(r.srcset=a.srcSet)}}catch(c){Vt(e,e.return,c)}}function Od(e,n,a){try{var r=e.stateNode;e1(r,e.type,a,n),r[et]=n}catch(c){Vt(e,e.return,c)}}function rv(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&ls(e.type)||e.tag===4}function zd(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||rv(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&ls(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Pd(e,n,a,r){var c=e.tag;if(c===5||c===6)c=e.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(c,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(c),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=Qi)),Fc(e,r),Pt=!0;else if(c!==4&&(c===27&&(Fc(e,r),r=null,ls(e.type)&&(a=e.stateNode,n=null)),e=e.child,e!==null))for(Pd(e,n,a,r),e=e.sibling;e!==null;)Pd(e,n,a,r),e=e.sibling}function Hc(e,n,a,r){var c=e.tag;if(c===5||c===6)c=e.stateNode,n?a.insertBefore(c,n):a.appendChild(c),Fc(e,r),Pt=!0;else if(c!==4&&(c===27&&(Fc(e,r),r=null,ls(e.type)&&(a=e.stateNode)),e=e.child,e!==null))for(Hc(e,n,a,r),e=e.sibling;e!==null;)Hc(e,n,a,r),e=e.sibling}function ov(e){var n=e.stateNode,a=e.memoizedProps;try{for(var r=e.type,c=n.attributes;c.length;)n.removeAttributeNode(c[0]);Dn(n,r,a),n[Pe]=e,n[et]=a}catch(f){Vt(e,e.return,f)}}var jc=!1,li=null;function lv(e){(e.tag===30||(e.subtreeFlags&33554432)!==0)&&(jc=!0)}var ta=null;function cv(){var e=ta;return ta=null,e}var Kn=0;function Or(e,n,a,r,c){return Kn=0,uv(e.child,n,a,r,c)}function uv(e,n,a,r,c){for(var f=!1;e!==null;){if(e.tag===5){var y=e.stateNode;if(r!==null){var A=xh(y);r.push(A),A.view&&(f=!0)}else f||xh(y).view&&(f=!0);jc=!0,c_(y,Kn===0?n:n+"_"+Kn,a),Kn++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&c||uv(e.child,n,a,r,c)&&(f=!0));e=e.sibling}return f}function na(e,n){for(;e!==null;)e.tag===5?u_(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&n||na(e.child,n)),e=e.sibling}function Gc(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Gc(e),e.tag===30&&(e.flags&18874368)!==0&&e.stateNode.paired)){var n=e.memoizedProps;if(n.name==null||n.name==="auto")throw Error(o(544));var a=n.name;n=_a(n.default,n.share),n!=="none"&&(Or(e,a,n,null,!1)||na(e.child,!1))}e=e.sibling}}function Id(e,n){if(e.tag===30){var a=e.stateNode,r=e.memoizedProps,c=va(r,a),f=_a(r.default,a.paired?r.share:r.enter);f!=="none"?Or(e,c,f,null,!1)?(Gc(e),a.paired||n||Gr(e,r.onEnter)):na(e.child,!1):Gc(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Id(e,n),e=e.sibling;else Gc(e)}function Bd(e){if(li!==null&&li.size!==0){var n=li;if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var a=e.memoizedProps,r=a.name;if(r!=null&&r!=="auto"){var c=n.get(r);if(c!==void 0){var f=_a(a.default,a.share);if(f!=="none"&&(Or(e,r,f,null,!1)?(f=e.stateNode,c.paired=f,f.paired=c,Gr(e,a.onShare)):na(e.child,!1)),n.delete(r),n.size===0)break}}}Bd(e)}e=e.sibling}}}function Fd(e){if(e.tag===30){var n=e.memoizedProps,a=va(n,e.stateNode),r=li!==null?li.get(a):void 0,c=_a(n.default,r!==void 0?n.share:n.exit);c!=="none"&&(Or(e,a,c,null,!1)?r!==void 0?(c=e.stateNode,r.paired=c,c.paired=r,li.delete(a),Gr(e,n.onShare)):Gr(e,n.onExit):na(e.child,!1)),li!==null&&Bd(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Fd(e),e=e.sibling;else li!==null&&Bd(e)}function fv(e){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,a=va(n,e.stateNode);n=_a(n.default,n.update),e.flags&=-5,n!=="none"&&Or(e,a,n,e.memoizedState=[],!1)}else(e.subtreeFlags&33554432)!==0&&fv(e);e=e.sibling}}function Hd(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var n=e.stateNode;n.paired!==null&&(n.paired=null,na(e.child,!1))}Hd(e)}e=e.sibling}}function Vc(e){if(e.tag===30)e.stateNode.paired=null,na(e.child,!1),Hd(e);else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Vc(e),e=e.sibling;else Hd(e)}function dv(e){for(e=e.child;e!==null;)e.tag===30?na(e.child,!1):(e.subtreeFlags&33554432)!==0&&dv(e),e=e.sibling}function jd(e,n,a,r,c,f,y){for(var A=!1;n!==null;){if(n.tag===5){var F=n.stateNode;if(f!==null&&Kn<f.length){var J=f[Kn],le=xh(F);(J.view||le.view)&&(A=!0);var ge;if(ge=(e.flags&4)===0)if(le.clip)ge=!0;else{ge=J.rect;var K=le.rect;ge=ge.y!==K.y||ge.x!==K.x||ge.height!==K.height||ge.width!==K.width}ge&&(e.flags|=4),le.abs?le=!J.abs:(J=J.rect,le=le.rect,le=J.height!==le.height||J.width!==le.width),le&&(e.flags|=32)}else e.flags|=32;(e.flags&4)!==0&&c_(F,Kn===0?a:a+"_"+Kn,c),A&&(e.flags&4)!==0||(ta===null&&(ta=[]),ta.push(F,Kn===0?r:r+"_"+Kn,n.memoizedProps)),Kn++}else(n.tag!==22||n.memoizedState===null)&&(n.tag===30&&y?e.flags|=n.flags&32:jd(e,n.child,a,r,c,f,y)&&(A=!0));n=n.sibling}return A}function hv(e,n){for(e=e.child;e!==null;){if(e.tag===30){var a=e.memoizedProps,r=e.stateNode,c=va(a,r),f=_a(a.default,a.update),y;y=e.memoizedState,e.memoizedState=null,r=e;var A=e.child;Kn=0,c=jd(r,A,c,c,f,y,!1),(e.flags&4)!==0&&c&&Gr(e,a.onUpdate)}else(e.subtreeFlags&33554432)!==0&&hv(e);e=e.sibling}}var Tn=!1,jt=!1,ia=!1,Gd=!1,pv=typeof WeakSet=="function"?WeakSet:Set,bn=null,aa=!1,ll=!1,kc=!1,Vd=!1;function wM(e,n,a){if(e=e.containerInfo,ph=Jr,e=_g(e),wf(e)){if("selectionStart"in e)var r={start:e.selectionStart,end:e.selectionEnd};else e:{r=(r=e.ownerDocument)&&r.defaultView||window;var c=r.getSelection&&r.getSelection();if(c&&c.rangeCount!==0){r=c.anchorNode;var f=c.anchorOffset,y=c.focusNode;c=c.focusOffset;try{r.nodeType,y.nodeType}catch{r=null;break e}var A=0,F=-1,J=-1,le=0,ge=0,K=e,re=null;t:for(;;){for(var Fe;K!==r||f!==0&&K.nodeType!==3||(F=A+f),K!==y||c!==0&&K.nodeType!==3||(J=A+c),K.nodeType===3&&(A+=K.nodeValue.length),(Fe=K.firstChild)!==null;)re=K,K=Fe;for(;;){if(K===e)break t;if(re===r&&++le===f&&(F=A),re===y&&++ge===c&&(J=A),(Fe=K.nextSibling)!==null)break;K=re,re=K.parentNode}K=Fe}r=F===-1||J===-1?null:{start:F,end:J}}else r=null}r=r||{start:0,end:0}}else r=null;for(mh={focusedElem:e,selectionRange:r},Jr=!1,a=(a&335544064)===a,bn=n,n=a?9270:1024;bn!==null;){if(e=bn,a&&(r=e.deletions,r!==null))for(f=0;f<r.length;f++)a&&Fd(r[f]);if(e.alternate===null&&(e.flags&2)!==0)a&&lv(e),Xc(a);else{if(e.tag===22){if(r=e.alternate,e.memoizedState!==null){r!==null&&r.memoizedState===null&&a&&Fd(r),Xc(a);continue}else if(r!==null&&r.memoizedState!==null){a&&lv(e),Xc(a);continue}}r=e.child,(e.subtreeFlags&n)!==0&&r!==null?(r.return=e,bn=r):(a&&fv(e),Xc(a))}}li=null}function Xc(e){for(;bn!==null;){var n=bn,a=e,r=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 15:break;case 1:if((c&1024)!==0&&r!==null){a=void 0,c=r.memoizedProps,r=r.memoizedState;var f=n.stateNode;try{var y=Ys(n.type,c);a=f.getSnapshotBeforeUpdate(y,r),f.__reactInternalSnapshotBeforeUpdate=a}catch(A){Vt(n,n.return,A)}}break;case 3:if((c&1024)!==0){if(r=n.stateNode.containerInfo,a=r.nodeType,a===9)Mh(r);else if(a===1)switch(r.nodeName){case"HEAD":case"HTML":case"BODY":Mh(r);break;default:r.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:a&&r!==null&&(a=va(r.memoizedProps,r.stateNode),c=n.memoizedProps,c=_a(c.default,c.update),c!=="none"&&Or(r,a,c,r.memoizedState=[],!0));break;default:if((c&1024)!==0)throw Error(o(163))}if(r=n.sibling,r!==null){r.return=n.return,bn=r;break}bn=n.return}}function mv(e,n,a){var r=a.flags;switch(a.tag){case 0:case 11:case 15:sa(e,a),r&4&&rl(5,a);break;case 1:if(sa(e,a),r&4)if(e=a.stateNode,n===null)try{e.componentDidMount()}catch(y){Vt(a,a.return,y)}else{var c=Ys(a.type,n.memoizedProps);n=n.memoizedState;try{e.componentDidUpdate(c,n,e.__reactInternalSnapshotBeforeUpdate)}catch(y){Vt(a,a.return,y)}}r&64&&iv(a),r&512&&ea(a,a.return);break;case 3:if(sa(e,a),r&64&&(e=a.updateQueue,e!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{qg(e,n)}catch(y){Vt(a,a.return,y)}}break;case 27:n===null&&r&4&&ov(a);case 26:case 5:sa(e,a),n===null&&r&4&&Ld(a),r&512&&ea(a,a.return);break;case 12:sa(e,a);break;case 31:sa(e,a),r&4&&xv(e,a);break;case 13:sa(e,a),r&4&&yv(e,a),r&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=jM.bind(null,a),M1(e,a))));break;case 22:if(r=a.memoizedState!==null||Tn,!r){var f=n!==null&&n.memoizedState!==null||jt;n=Tn,c=jt,Tn=r,(jt=f)&&!c?(r=2,(a.subtreeFlags&8772)!==0&&(r|=1),Bi(e,a,r)):sa(e,a),Tn=n,jt=c}break;case 30:sa(e,a),r&512&&ea(a,a.return);break;case 7:r&512&&ea(a,a.return);default:sa(e,a)}}function kd(e,n){for(e=e.child;e!==null;)gv(e,n),e=e.sibling}function gv(e,n){switch(e.tag){case 5:case 26:try{var a=e.stateNode;if(n){var r=a.style;typeof r.setProperty=="function"?r.setProperty("display","none","important"):r.display="none"}else{var c=e.stateNode,f=e.memoizedProps.style,y=f!=null&&f.hasOwnProperty("display")?f.display:null;c.style.display=y==null||typeof y=="boolean"?"":(""+y).trim()}}catch(F){Vt(e,e.return,F)}Xd(e,n);break;case 6:try{e.stateNode.nodeValue=n?"":e.memoizedProps,Pt=!0}catch(F){Vt(e,e.return,F)}break;case 18:try{var A=e.stateNode;n?l_(A,!0):l_(e.stateNode,!1)}catch(F){Vt(e,e.return,F)}break;case 22:case 23:e.memoizedState===null&&kd(e,n);break;default:kd(e,n)}}function Xd(e,n){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){e:{var a=e,r=n;switch(a.tag){case 4:gv(a,r);break e;case 22:a.memoizedState===null&&Xd(a,r);break e;default:Xd(a,r)}}e=e.sibling}}function vv(e){var n=e.alternate;n!==null&&(e.alternate=null,vv(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&ot(n)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var tn=null,Qn=!1;function Pi(e,n,a){for(a=a.child;a!==null;)_v(e,n,a),a=a.sibling}function _v(e,n,a){if(nn&&typeof nn.onCommitFiberUnmount=="function")try{nn.onCommitFiberUnmount(Ct,a)}catch{}switch(a.tag){case 26:jt||Nn(a,n),Pi(e,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&!jt&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:jt||Nn(a,n),ol(a);var r=tn,c=Qn;ls(a.type)&&(tn=a.stateNode,Qn=!1),Pi(e,n,a),M_(a.stateNode,a.type,a.memoizedProps),tn=r,Qn=c;break;case 5:jt||Nn(a,n),ol(a);case 6:if(a.tag===6&&ol(a),r=tn,c=Qn,tn=null,Pi(e,n,a),tn=r,Qn=c,tn!==null)if(Qn)try{(tn.nodeType===9?tn.body:tn.nodeName==="HTML"?tn.ownerDocument.body:tn).removeChild(a.stateNode),Pt=!0}catch(f){Vt(a,n,f)}else try{tn.removeChild(a.stateNode),Pt=!0}catch(f){Vt(a,n,f)}break;case 18:tn!==null&&(Qn?(e=tn,o_(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),$r(e)):o_(tn,a.stateNode));break;case 4:r=tn,c=Qn,tn=a.stateNode.containerInfo,Qn=!0,Pi(e,n,a),tn=r,Qn=c;break;case 0:case 11:case 14:case 15:ts(2,a,n),jt||ts(4,a,n),Pi(e,n,a);break;case 1:jt||(Nn(a,n),r=a.stateNode,typeof r.componentWillUnmount=="function"&&av(a,n,r)),Pi(e,n,a);break;case 21:Pi(e,n,a);break;case 22:jt=(r=jt)||a.memoizedState!==null,Pi(e,n,a),jt=r;break;case 30:Nn(a,n),Pi(e,n,a);break;case 7:jt||Nn(a,n),Pi(e,n,a);break;default:Pi(e,n,a)}}function xv(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{$r(e)}catch(a){Vt(n,n.return,a)}}}function yv(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{$r(e)}catch(a){Vt(n,n.return,a)}}function NM(e){switch(e.tag){case 31:case 13:case 19:var n=e.stateNode;return n===null&&(n=e.stateNode=new pv),n;case 22:return e=e.stateNode,n=e._retryCache,n===null&&(n=e._retryCache=new pv),n;default:throw Error(o(435,e.tag))}}function qc(e,n){var a=NM(e);n.forEach(function(r){if(!a.has(r)){a.add(r);var c=GM.bind(null,e,r);r.then(c,c)}})}function kn(e,n,a){var r=n.deletions;if(r!==null)for(var c=0;c<r.length;c++){var f=r[c],y=e,A=n,F=A;e:for(;F!==null;){switch(F.tag){case 27:if(ls(F.type)){tn=F.stateNode,Qn=!1;break e}break;case 5:tn=F.stateNode,Qn=!1;break e;case 3:case 4:tn=F.stateNode.containerInfo,Qn=!0;break e}F=F.return}if(tn===null)throw Error(o(160));_v(y,A,f),tn=null,Qn=!1,y=f.alternate,y!==null&&(y.return=null),f.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)Sv(n,e,a),n=n.sibling}var Ii=null;function Sv(e,n,a){var r=e.alternate,c=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(c&4&&(r=e.updateQueue,r=r!==null?r.events:null,r!==null))for(var f=0;f<r.length;f++){var y=r[f];y.ref.impl=y.nextImpl}kn(n,e,a),Xn(e),c&4&&(ts(3,e,e.return),rl(3,e),ts(5,e,e.return));break;case 1:kn(n,e,a),Xn(e),c&512&&(jt||r===null||Nn(r,r.return)),c&64&&Tn&&(e=e.updateQueue,e!==null&&(n=e.callbacks,n!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?n:a.concat(n))));break;case 26:if(f=Ii,kn(n,e,a),Xn(e),c&512&&(jt||r===null||Nn(r,r.return)),c&4)if(c=r!==null?r.memoizedState:null,a=e.memoizedState,r===null)if(a===null)if(e.stateNode===null)if(Tn)e.stateNode=a_(e.type,e.memoizedProps,n.containerInfo,e);else{e:{n=e.type,a=e.memoizedProps,c=f.ownerDocument||f;t:switch(n){case"title":r=c.getElementsByTagName("title")[0],(!r||r[It]||r[Pe]||r.namespaceURI==="http://www.w3.org/2000/svg"||r.hasAttribute("itemprop"))&&(r=c.createElement(n),c.head.insertBefore(r,c.querySelector("head > title"))),Dn(r,n,a),r[Pe]=e,zt(r),n=r;break e;case"link":if(f=R_("link","href",c).get(n+(a.href||""))){for(y=0;y<f.length;y++)if(r=f[y],r.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&r.getAttribute("rel")===(a.rel==null?null:a.rel)&&r.getAttribute("title")===(a.title==null?null:a.title)&&r.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){f.splice(y,1);break t}}r=c.createElement(n),Dn(r,n,a),c.head.appendChild(r);break;case"meta":if(f=R_("meta","content",c).get(n+(a.content||""))){for(y=0;y<f.length;y++)if(r=f[y],r.getAttribute("content")===(a.content==null?null:""+a.content)&&r.getAttribute("name")===(a.name==null?null:a.name)&&r.getAttribute("property")===(a.property==null?null:a.property)&&r.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&r.getAttribute("charset")===(a.charSet==null?null:a.charSet)){f.splice(y,1);break t}}r=c.createElement(n),Dn(r,n,a),c.head.appendChild(r);break;default:throw Error(o(468,n))}r[Pe]=e,zt(r),n=r}e.stateNode=n}else Tn||wh(f,e.type,e.stateNode);else e.stateNode=C_(f,a,e.memoizedProps);else c!==a?(c===null?(n=r.stateNode,n===null||jt||n.parentNode.removeChild(n)):c.count--,a===null?Tn||wh(f,e.type,e.stateNode):C_(f,a,e.memoizedProps)):a===null&&e.stateNode!==null&&Od(e,e.memoizedProps,r.memoizedProps);break;case 27:kn(n,e,a),Xn(e),c&512&&(jt||r===null||Nn(r,r.return)),r!==null&&c&4&&Od(e,e.memoizedProps,r.memoizedProps);break;case 5:if(f=ia,ia=!1,kn(n,e,a),ia=f,Xn(e),c&512&&(jt||r===null||Nn(r,r.return)),e.flags&32){n=e.stateNode;try{gr(n,""),Pt=!0}catch(le){Vt(e,e.return,le)}}c&4&&e.stateNode!=null&&(n=e.memoizedProps,Od(e,n,r!==null?r.memoizedProps:n)),c&1024&&(Gd=!0);break;case 6:if(kn(n,e,a),Xn(e),c&4){if(e.stateNode===null)throw Error(o(162));n=e.memoizedProps,a=e.stateNode;try{a.nodeValue=n,Pt=!0}catch(le){Vt(e,e.return,le)}}break;case 3:if(Pt=!1,ou=null,f=Ii,Ii=vl(n.containerInfo),kn(n,e,a),Ii=f,Xn(e),c&4&&r!==null&&r.memoizedState.isDehydrated)try{$r(n.containerInfo)}catch(le){Vt(e,e.return,le)}Gd&&(Gd=!1,Mv(e)),Pt=!1;break;case 4:c=ia,ia=Tn,r=Gm(),f=Ii,Ii=vl(e.stateNode.containerInfo),kn(n,e,a),Xn(e),Ii=f,Pt&&ll&&(kc=!0),Pt=r,ia=c;break;case 12:kn(n,e,a),Xn(e);break;case 31:kn(n,e,a),Xn(e),c&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,qc(e,n)));break;case 13:kn(n,e,a),Xn(e),e.child.flags&8192&&e.memoizedState!==null!=(r!==null&&r.memoizedState!==null)&&(Zc=W()),c&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,qc(e,n)));break;case 22:f=e.memoizedState!==null,y=r!==null&&r.memoizedState!==null;var A=Tn,F=jt,J=ia;Tn=A||f,ia=J||f,jt=F||y,kn(n,e,a),jt=F,ia=J,Tn=A,Xn(e),c&8192&&(n=e.stateNode,n._visibility=f?n._visibility&-2:n._visibility|1,!f||r===null||y||Tn||jt||(n=y||jt,a=Tn,r=jt,Tn=f||Tn,jt=n,ns(e,2),Tn=a,jt=r),!f&&ia||kd(e,f)),c&4&&(n=e.updateQueue,n!==null&&(a=n.retryQueue,a!==null&&(n.retryQueue=null,qc(e,a))));break;case 19:kn(n,e,a),Xn(e),c&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,qc(e,n)));break;case 30:c&512&&(jt||r===null||Nn(r,r.return)),c=Gm(),f=ll,y=(a&335544064)===a,A=e.memoizedProps,ll=y&&_a(A.default,A.update)!=="none",kn(n,e,a),Xn(e),y&&r!==null&&Pt&&(e.flags|=4),ll=f,Pt=c;break;case 21:break;case 7:c&512&&(jt||r===null||Nn(r,r.return)),r&&r.stateNode!==null&&(r.stateNode._fragmentFiber=e);default:kn(n,e,a),Xn(e)}}function Xn(e){var n=e.flags;if(n&2){try{for(var a,r=e.return;r!==null;){if(rv(r)){a=r;break}r=r.return}r=null;for(var c=e.return;c!==null;){if(Ud(c)){var f=c.stateNode;r===null?r=[f]:r.push(f)}if(Dd(c))break;c=c.return}var y=r;if(a==null)throw Error(o(160));switch(a.tag){case 27:var A=a.stateNode,F=zd(e);Hc(e,F,A,y);break;case 5:var J=a.stateNode;a.flags&32&&(gr(J,""),a.flags&=-33);var le=zd(e);Hc(e,le,J,y);break;case 3:case 4:var ge=a.stateNode.containerInfo,K=zd(e);Pd(e,K,ge,y);break;default:throw Error(o(161))}}catch(re){Vt(e,e.return,re)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function Mv(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var n=e;Mv(n),n.tag===5&&n.flags&1024&&(n=n.stateNode,Jr=!0,n.reset(),Jr=!1),e=e.sibling}}function zr(e,n){if(n.subtreeFlags&9270)for(n=n.child;n!==null;)Ev(n,e),n=n.sibling;else hv(n)}function Ev(e,n){var a=e.alternate;if(a===null)Id(e,!1);else switch(e.tag){case 3:if(Vd=aa=!1,cv(),zr(n,e),!aa&&!kc){if(e=ta,e!==null)for(var r=0;r<e.length;r+=3){a=e[r];var c=e[r+1];u_(a,e[r+2]),a=a.ownerDocument.documentElement,a!==null&&a.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+c+")"})}e=n.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===""&&(e.style.viewTransitionName="none",e.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),Vd=!0}ta=null;break;case 5:zr(n,e);break;case 4:r=aa,aa=!1,zr(n,e),aa&&(kc=!0),aa=r;break;case 22:e.memoizedState===null&&(a.memoizedState!==null?Id(e,!1):zr(n,e));break;case 30:r=aa,c=cv(),aa=!1,zr(n,e),aa&&(e.flags|=4);var f=e.memoizedProps,y=e.stateNode;n=va(f,y),y=va(a.memoizedProps,y);var A=_a(f.default,f.update);A==="none"?n=!1:(f=a.memoizedState,a.memoizedState=null,a=e.child,Kn=0,n=jd(e,a,n,y,A,f,!0),Kn!==(f===null?0:f.length)&&(e.flags|=32)),(e.flags&4)!==0&&n?(Gr(e,e.memoizedProps.onUpdate),ta=c):c!==null&&(c.push.apply(c,ta),ta=c),aa=(e.flags&32)!==0?!0:r;break;default:zr(n,e)}}function sa(e,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)mv(e,n.alternate,n),n=n.sibling}function ns(e,n){for(e=e.child;e!==null;){var a=e,r=n;switch(a.tag){case 0:case 11:case 14:case 15:ts(4,a,a.return),ns(a,r);break;case 1:Nn(a,a.return);var c=a.stateNode;typeof c.componentWillUnmount=="function"&&av(a,a.return,c),ns(a,r);break;case 27:(r&2)!==0&&M_(a.stateNode,a.type,a.memoizedProps);case 5:Nn(a,a.return),a.tag!==5&&a.tag!==27||ol(a),ns(a,r);break;case 6:ol(a);break;case 26:Nn(a,a.return),c=a.stateNode,a.memoizedState!==null||c===null||jt||c.parentNode.removeChild(c),ns(a,r);break;case 22:a.memoizedState===null&&ns(a,r);break;case 30:Nn(a,a.return),ns(a,r);break;case 7:Nn(a,a.return);default:ns(a,r)}e=e.sibling}}function Bi(e,n,a){for(a=(n.subtreeFlags&8772)!==0?a:a&-2,n=n.child;n!==null;){var r=n.alternate,c=e,f=n,y=f.flags,A=(a&1)!==0;switch(f.tag){case 0:case 11:case 15:Bi(c,f,a),rl(4,f);break;case 1:if(Bi(c,f,a),r=f,c=r.stateNode,typeof c.componentDidMount=="function")try{c.componentDidMount()}catch(le){Vt(r,r.return,le)}if(r=f,c=r.updateQueue,c!==null){var F=r.stateNode;try{var J=c.shared.hiddenCallbacks;if(J!==null)for(c.shared.hiddenCallbacks=null,c=0;c<J.length;c++)Xg(J[c],F)}catch(le){Vt(r,r.return,le)}}A&&y&64&&iv(f),ea(f,f.return);break;case 27:(a&2)!==0&&ov(f);case 5:f.tag!==5&&f.tag!==27||sv(f),Bi(c,f,a),A&&r===null&&y&4&&Ld(f),ea(f,f.return);break;case 6:sv(f);break;case 26:F=f.stateNode,f.memoizedState!==null||F===null||Tn||wh(vl(F.ownerDocument),f.type,F),Bi(c,f,a),A&&r===null&&y&4&&Ld(f),ea(f,f.return);break;case 12:Bi(c,f,a);break;case 31:Bi(c,f,a),A&&y&4&&xv(c,f);break;case 13:Bi(c,f,a),A&&y&4&&yv(c,f);break;case 22:f.memoizedState===null&&Bi(c,f,a),ea(f,f.return);break;case 30:Bi(c,f,a),ea(f,f.return);break;case 7:ea(f,f.return);default:Bi(c,f,a)}n=n.sibling}}function qd(e,n){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(e=n.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&Yo(a))}function Yd(e,n){e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&Yo(e))}function bi(e,n,a,r){var c=(a&335544064)===a;if(n.subtreeFlags&(c?10262:10256))for(n=n.child;n!==null;)Tv(e,n,a,r),n=n.sibling;else c&&dv(n)}function Tv(e,n,a,r){var c=(a&335544064)===a;c&&n.alternate===null&&n.return!==null&&n.return.alternate!==null&&Vc(n);var f=n.flags;switch(n.tag){case 0:case 11:case 15:bi(e,n,a,r),f&2048&&rl(9,n);break;case 1:bi(e,n,a,r);break;case 3:bi(e,n,a,r),c&&Vd&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,e.style.viewTransitionName==="root"&&(e.style.viewTransitionName=""),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName==="none"&&(e.style.viewTransitionName="")),f&2048&&(f=null,n.alternate!==null&&(f=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==f&&(n.refCount++,f!=null&&Yo(f)));break;case 12:if(f&2048){bi(e,n,a,r),f=n.stateNode;try{var y=n.memoizedProps,A=y.id,F=y.onPostCommit;typeof F=="function"&&F(A,n.alternate===null?"mount":"update",f.passiveEffectDuration,-0)}catch(J){Vt(n,n.return,J)}}else bi(e,n,a,r);break;case 31:bi(e,n,a,r);break;case 13:bi(e,n,a,r);break;case 23:break;case 22:y=n.stateNode,A=n.alternate,n.memoizedState!==null?(c&&A!==null&&A.memoizedState===null&&Vc(A),y._visibility&2?bi(e,n,a,r):cl(e,n)):(c&&A!==null&&A.memoizedState!==null&&Vc(n),y._visibility&2?bi(e,n,a,r):(y._visibility|=2,Pr(e,n,a,r,(n.subtreeFlags&10256)!==0||!1))),f&2048&&qd(A,n);break;case 24:bi(e,n,a,r),f&2048&&Yd(n.alternate,n);break;case 30:c&&(f=n.alternate,f!==null&&(na(f.child,!0),na(n.child,!0))),bi(e,n,a,r);break;default:bi(e,n,a,r)}}function Pr(e,n,a,r,c){for(c=c&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var f=e,y=n,A=a,F=r,J=y.flags;switch(y.tag){case 0:case 11:case 15:Pr(f,y,A,F,c),rl(8,y);break;case 23:break;case 22:var le=y.stateNode;y.memoizedState!==null?le._visibility&2?Pr(f,y,A,F,c):cl(f,y):(le._visibility|=2,Pr(f,y,A,F,c)),c&&J&2048&&qd(y.alternate,y);break;case 24:Pr(f,y,A,F,c),c&&J&2048&&Yd(y.alternate,y);break;default:Pr(f,y,A,F,c)}n=n.sibling}}function cl(e,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=e,r=n,c=r.flags;switch(r.tag){case 22:cl(a,r),c&2048&&qd(r.alternate,r);break;case 24:cl(a,r),c&2048&&Yd(r.alternate,r);break;default:cl(a,r)}n=n.sibling}}var Ws=8192;function Zs(e,n,a){if(e.subtreeFlags&Ws)for(e=e.child;e!==null;)bv(e,n,a),e=e.sibling}function bv(e,n,a){switch(e.tag){case 26:Zs(e,n,a),e.flags&Ws&&(e.memoizedState!==null?P1(a,Ii,e.memoizedState,e.memoizedProps):(e=e.stateNode,(n&335544128)===n&&U_(a,e)));break;case 5:Zs(e,n,a),e.flags&Ws&&(e=e.stateNode,(n&335544128)===n&&U_(a,e));break;case 3:case 4:var r=Ii;Ii=vl(e.stateNode.containerInfo),Zs(e,n,a),Ii=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Ws,Ws=16777216,Zs(e,n,a),Ws=r):Zs(e,n,a));break;case 30:if((e.flags&Ws)!==0&&(r=e.memoizedProps.name,r!=null&&r!=="auto")){var c=e.stateNode;c.paired=null,li===null&&(li=new Map),li.set(r,c)}Zs(e,n,a);break;default:Zs(e,n,a)}}function Av(e){var n=e.alternate;if(n!==null&&(e=n.child,e!==null)){n.child=null;do n=e.sibling,e.sibling=null,e=n;while(e!==null)}}function ul(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var r=n[a];bn=r,Rv(r,e)}Av(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Cv(e),e=e.sibling}function Cv(e){switch(e.tag){case 0:case 11:case 15:ul(e),e.flags&2048&&ts(9,e,e.return);break;case 3:ul(e);break;case 12:ul(e);break;case 22:var n=e.stateNode;e.memoizedState!==null&&n._visibility&2&&(e.return===null||e.return.tag!==13)?(n._visibility&=-3,Yc(e)):ul(e);break;default:ul(e)}}function Yc(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var r=n[a];bn=r,Rv(r,e)}Av(e)}for(e=e.child;e!==null;){switch(n=e,n.tag){case 0:case 11:case 15:ts(8,n,n.return),Yc(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,Yc(n));break;default:Yc(n)}e=e.sibling}}function Rv(e,n){for(;bn!==null;){var a=bn;switch(a.tag){case 0:case 11:case 15:ts(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var r=a.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:Yo(a.memoizedState.cache)}if(r=a.child,r!==null)r.return=a,bn=r;else e:for(a=e;bn!==null;){r=bn;var c=r.sibling,f=r.return;if(vv(r),r===a){bn=null;break e}if(c!==null){c.return=f,bn=c;break e}bn=f}}}var DM={getCacheForType:function(e){var n=Cn(hn),a=n.data.get(e);return a===void 0&&(a=e(),n.data.set(e,a)),a},cacheSignal:function(){return Cn(hn).controller.signal}},UM=typeof WeakMap=="function"?WeakMap:Map,Ft=0,Kt=null,Tt=null,Rt=0,Gt=0,ci=null,is=!1,Ir=!1,Wd=!1,Ca=0,ln=0,as=0,Ks=0,Wc=0,ui=0,Br=0,fl=null,Jn=null,Zd=!1,Zc=0,wv=0,Kc=1/0,Qc=null,ss=null,an=0,Fi=null,Qs=null,ra=0,Kd=0,Qd=null,Nv=null,Fr=null,Hr=null,jr=null,dl=0,Jc=null;function fi(){return(Ft&2)!==0&&Rt!==0?Rt&-Rt:Te.T!==null?oh():Re()}function Dv(){if(ui===0)if((Rt&536870912)===0||St){var e=pa;pa<<=1,(pa&3932160)===0&&(pa=262144),ui=e}else ui=536870912;return e=Rn.current,e!==null&&(e.flags|=32),ui}function Gr(e,n){if(n!=null){var a=e.stateNode,r=a.ref;r===null&&(r=a.ref=f_(va(e.memoizedProps,a))),Hr===null&&(Hr=[]),Hr.push(n.bind(null,r))}}function $n(e,n,a){(e===Kt&&(Gt===2||Gt===9)||e.cancelPendingCommit!==null)&&(Vr(e,0),rs(e,Rt,ui,!1)),Us(e,a),((Ft&2)===0||e!==Kt)&&(e===Kt&&((Ft&2)===0&&(Ks|=a),ln===4&&rs(e,Rt,ui,!1)),oa(e))}function Uv(e,n,a){if((Ft&6)!==0)throw Error(o(327));var r=!a&&(n&127)===0&&(n&e.expiredLanes)===0||Ha(e,n),c=r?zM(e,n):$d(e,n,!0),f=r;do{if(c===0){Ir&&!r&&rs(e,n,0,!1);break}else{if(a=e.current.alternate,f&&!LM(a)){c=$d(e,n,!1),f=!1;continue}if(c===2){if(f=n,e.errorRecoveryDisabledLanes&f)var y=0;else y=e.pendingLanes&-536870913,y=y!==0?y:y&536870912?536870912:0;if(y!==0){n=y;e:{var A=e;c=fl;var F=A.current.memoizedState.isDehydrated;if(F&&(Vr(A,y).flags|=256),y=$d(A,y,!1),y!==2&&y!==6){if(Wd&&!F){A.errorRecoveryDisabledLanes|=f,Ks|=f,c=4;break e}f=Jn,Jn=c,f!==null&&(Jn===null?Jn=f:Jn.push.apply(Jn,f))}c=y}if(f=!1,c!==2)continue}}if(c===1){Vr(e,0),rs(e,n,0,!0);break}e:{switch(r=e,f=c,f){case 0:case 1:throw Error(o(345));case 4:if((n&4194048)!==n&&(n&62914560)!==n)break;case 6:rs(r,n,ui,!is);break e;case 2:Jn=null;break;case 3:case 5:break;default:throw Error(o(329))}if((n&62914560)===n&&(c=Zc+300-W(),10<c)){if(rs(r,n,ui,!is),Ds(r,0,!0)!==0)break e;ra=n,r.timeoutHandle=_h(Lv.bind(null,r,a,Jn,Qc,Zd,n,ui,Ks,Br,is,f,"Throttled",-0,0),c);break e}Lv(r,a,Jn,Qc,Zd,n,ui,Ks,Br,is,f,null,-0,0)}}break}while(!0);oa(e)}function Lv(e,n,a,r,c,f,y,A,F,J,le,ge,K,re){e.timeoutHandle=-1;var Fe=n.subtreeFlags,tt=(f&335544064)===f;if(ge=null,(tt||Fe&8192||(Fe&16785408)===16785408)&&(ge={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Qi},li=null,bv(n,f,ge),tt&&(Fe=ge,tt=e.containerInfo,tt=(tt.nodeType===9?tt:tt.ownerDocument).__reactViewTransition,tt!=null&&(Fe.count++,Fe.waitingForViewTransition=!0,Fe=yl.bind(Fe),tt.finished.then(Fe,Fe))),Fe=(f&62914560)===f?Zc-W():(f&4194048)===f?wv-W():0,Fe=I1(ge,Fe),Fe!==null)){ra=f,e.cancelPendingCommit=Fe(jv.bind(null,e,n,f,a,r,c,y,A,F,J,le,ge,null,K,re)),rs(e,f,y,!J);return}jv(e,n,f,a,r,c,y,A,F,J,le,ge)}function LM(e){for(var n=e;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var r=0;r<a.length;r++){var c=a[r],f=c.getSnapshot;c=c.value;try{if(!ri(f(),c))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function rs(e,n,a,r){n=Zl(e,n),n&=~Wc,n&=~Ks,e.suspendedLanes|=n,e.pingedLanes&=~n,r&&(e.warmLanes|=n),r=e.expirationTimes;for(var c=n;0<c;){var f=31-zn(c),y=1<<f;r[f]=-1,c&=~y}a!==0&&w(e,a,n)}function $c(){return(Ft&6)===0?(hl(0),!1):!0}function Jd(){if(Tt!==null){if(Gt===0)var e=Tt.return;else e=Tt,Sa=Bs=null,rd(e),wr=null,Ko=0,e=Tt;for(;e!==null;)nv(e.alternate,e),e=e.return;Tt=null}}function Vr(e,n){var a=e.timeoutHandle;return a!==-1&&(e.timeoutHandle=-1,i1(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),ra=0,Jd(),Kt=e,Tt=a=xa(e.current,null),Rt=n,Gt=0,ci=null,is=!1,Ir=Ha(e,n),Wd=!1,Br=ui=Wc=Ks=as=ln=0,Jn=fl=null,Zd=!1,Ca=Zl(e,n),oc(),a}function Ov(e,n){mt=null,Te.H=Uc,n===Rr||n===_c?(n=jg(),Gt=3):n===Yf?(n=jg(),Gt=4):Gt=n===Sd?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,ci=n,Tt===null&&(ln=1,Lc(e,Si(n,e.current)))}function zv(){var e=Rn.current;return e===null?!0:(Rt&4194048)===Rt?In===null:(Rt&62914560)===Rt||(Rt&536870912)!==0?e===In:!1}function Pv(){var e=Te.H;return Te.H=Uc,e===null?Uc:e}function Iv(){var e=Te.A;return Te.A=DM,e}function eu(){ln=4,is||(Rt&4194048)!==Rt&&Rn.current!==null||(Ir=!0),(as&134217727)===0&&(Ks&134217727)===0||Kt===null||rs(Kt,Rt,ui,!1)}function $d(e,n,a){var r=Ft;Ft|=2;var c=Pv(),f=Iv();(Kt!==e||Rt!==n)&&(Qc=null,Vr(e,n)),n=!1;var y=ln;e:do try{if(Gt!==0&&Tt!==null){var A=Tt,F=ci;switch(Gt){case 8:Jd(),y=6;break e;case 3:case 2:case 9:case 6:Rn.current===null&&(n=!0);var J=Gt;if(Gt=0,ci=null,kr(e,A,F,J),a&&Ir){y=0;break e}break;default:J=Gt,Gt=0,ci=null,kr(e,A,F,J)}}OM(),y=ln;break}catch(le){Ov(e,le)}while(!0);return n&&e.shellSuspendCounter++,Sa=Bs=null,Ft=r,Te.H=c,Te.A=f,Tt===null&&(Kt=null,Rt=0,oc()),y}function OM(){for(;Tt!==null;)Bv(Tt)}function zM(e,n){var a=Ft;Ft|=2;var r=Pv(),c=Iv();Kt!==e||Rt!==n?(Qc=null,Kc=W()+500,Vr(e,n)):Ir=Ha(e,n);e:do try{if(Gt!==0&&Tt!==null){n=Tt;var f=ci;t:switch(Gt){case 1:Gt=0,ci=null,kr(e,n,f,1);break;case 2:case 9:if(Fg(f)){Gt=0,ci=null,Fv(n);break}n=function(){Gt!==2&&Gt!==9||Kt!==e||(Gt=7),oa(e)},f.then(n,n);break e;case 3:Gt=7;break e;case 4:Gt=5;break e;case 7:Fg(f)?(Gt=0,ci=null,Fv(n)):(Gt=0,ci=null,kr(e,n,f,7));break;case 5:var y=null;switch(Tt.tag){case 26:y=Tt.memoizedState;case 5:case 27:var A=Tt;if(y?N_(y):A.stateNode.complete){Gt=0,ci=null;var F=A.sibling;if(F!==null)Tt=F;else{var J=A.return;J!==null?(Tt=J,tu(J)):Tt=null}break t}}Gt=0,ci=null,kr(e,n,f,5);break;case 6:Gt=0,ci=null,kr(e,n,f,6);break;case 8:Jd(),ln=6;break e;default:throw Error(o(462))}}PM();break}catch(le){Ov(e,le)}while(!0);return Sa=Bs=null,Te.H=r,Te.A=c,Ft=a,Tt!==null?0:(Kt=null,Rt=0,oc(),ln)}function PM(){for(;Tt!==null&&!Oe();)Bv(Tt)}function Bv(e){var n=ev(e.alternate,e,Ca);e.memoizedProps=e.pendingProps,n===null?tu(e):Tt=n}function Fv(e){var n=e,a=n.alternate;switch(n.tag){case 15:case 0:n=Y0(a,n,n.pendingProps,n.type,void 0,Rt);break;case 11:n=Y0(a,n,n.pendingProps,n.type.render,n.ref,Rt);break;case 5:rd(n);var r=n;r===En&&(St?(hc(r),r.tag===5&&r.stateNode!=null&&(Jt=r.stateNode)):(hc(r),St=!0));default:nv(a,n),n=Tt=Rg(n,Ca),n=ev(a,n,Ca)}e.memoizedProps=e.pendingProps,n===null?tu(e):Tt=n}function kr(e,n,a,r){Sa=Bs=null,rd(n),wr=null,Ko=0;var c=n.return;try{if(EM(e,c,n,a,Rt)){ln=1,Lc(e,Si(a,e.current)),Tt=null;return}}catch(f){if(c!==null)throw Tt=c,f;ln=1,Lc(e,Si(a,e.current)),Tt=null;return}n.flags&32768?(St||r===1?e=!0:Ir||(Rt&536870912)!==0?e=!1:(is=e=!0,(r===2||r===9||r===3||r===6)&&(r=Rn.current,r!==null&&r.tag===13&&(r.flags|=16384))),Hv(n,e)):tu(n)}function tu(e){var n=e;do{if((n.flags&32768)!==0){Hv(n,is);return}e=n.return;var a=CM(n.alternate,n,Ca);if(a!==null){Tt=a;return}if(n=n.sibling,n!==null){Tt=n;return}Tt=n=e}while(n!==null);ln===0&&(ln=5)}function Hv(e,n){do{var a=RM(e.alternate,e);if(a!==null){a.flags&=32767,Tt=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(e=e.sibling,e!==null)){Tt=e;return}Tt=e=a}while(e!==null);ln=6,Tt=null}function jv(e,n,a,r,c,f,y,A,F,J,le,ge){e.cancelPendingCommit=null;do nu();while(an!==0);if((Ft&6)!==0)throw Error(o(327));if(n!==null){if(n===e.current)throw Error(o(177));e===Kt&&(Tt=Kt=null,Rt=0),Qs=n,Fi=e,ra=a,Qd=c,Nv=r,IM(e,n,a,y,A,F,ge)}}function IM(e,n,a,r,c,f,y){var A=n.lanes|n.childLanes;if(Kd=A,A|=Of,ff(e,a,A,r,c,f),Hr=null,(a&335544064)===a?(jr=fM(e),r=10262):(jr=null,r=10256),(n.subtreeFlags&r)!==0||(n.flags&r)!==0?(e.callbackNode=null,e.callbackPriority=0,VM(be,function(){return ih(),null})):(e.callbackNode=null,e.callbackPriority=0),jc=!1,r=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||r){r=Te.T,Te.T=null,c=Xe.p,Xe.p=2,f=Ft,Ft|=4;try{wM(e,n,a)}finally{Ft=f,Xe.p=c,Te.T=r}}an=1,jc?Fr=c1(y,e.containerInfo,jr,eh,th,FM,nh,ih,BM):(eh(),th(),nh())}function BM(e){if(an!==0){var n=Fi.onRecoverableError;n(e,{componentStack:null})}}function FM(){an===3&&(an=0,Ev(Qs,Fi),an=4)}function eh(){if(an===1){an=0;var e=Fi,n=Qs,a=ra,r=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||r){r=Te.T,Te.T=null;var c=Xe.p;Xe.p=2;var f=Ft;Ft|=4;try{ll=kc=!1,Sv(n,e,a),a=mh;var y=_g(e.containerInfo),A=a.focusedElem,F=a.selectionRange;if(y!==A&&A&&A.ownerDocument&&vg(A.ownerDocument.documentElement,A)){if(F!==null&&wf(A)){var J=F.start,le=F.end;if(le===void 0&&(le=J),"selectionStart"in A)A.selectionStart=J,A.selectionEnd=Math.min(le,A.value.length);else{var ge=A.ownerDocument||document,K=ge&&ge.defaultView||window;if(K.getSelection){var re=K.getSelection(),Fe=A.textContent.length,tt=Math.min(F.start,Fe),gt=F.end===void 0?tt:Math.min(F.end,Fe);!re.extend&&tt>gt&&(y=gt,gt=tt,tt=y);var Q=gg(A,tt),q=gg(A,gt);if(Q&&q&&(re.rangeCount!==1||re.anchorNode!==Q.node||re.anchorOffset!==Q.offset||re.focusNode!==q.node||re.focusOffset!==q.offset)){var ne=ge.createRange();ne.setStart(Q.node,Q.offset),re.removeAllRanges(),tt>gt?(re.addRange(ne),re.extend(q.node,q.offset)):(ne.setEnd(q.node,q.offset),re.addRange(ne))}}}}for(ge=[],re=A;re=re.parentNode;)re.nodeType===1&&ge.push({element:re,left:re.scrollLeft,top:re.scrollTop});for(typeof A.focus=="function"&&A.focus(),A=0;A<ge.length;A++){var me=ge[A];me.element.scrollLeft=me.left,me.element.scrollTop=me.top}}Jr=!!ph,mh=ph=null}finally{Ft=f,Xe.p=c,Te.T=r}}e.current=n,an=2}}function th(){if(an===2){an=0;var e=Fi,n=Qs,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=Te.T,Te.T=null;var r=Xe.p;Xe.p=2;var c=Ft;Ft|=4;try{mv(e,n.alternate,n)}finally{Ft=c,Xe.p=r,Te.T=a}}an=3}}function nh(){if(an===4||an===3){an=0;var e=Fr;Fr=null,ft();var n=Fi,a=Qs,r=ra,c=Nv,f=(r&335544064)===r?10262:10256;if((a.subtreeFlags&f)!==0||(a.flags&f)!==0?an=5:(an=0,Qs=Fi=null,Gv(n,n.pendingLanes)),f=n.pendingLanes,f===0&&(ss=null),te(r),a=a.stateNode,nn&&typeof nn.onCommitFiberRoot=="function")try{nn.onCommitFiberRoot(Ct,a,void 0,(a.current.flags&128)===128)}catch{}if(c!==null){a=Te.T,f=Xe.p,Xe.p=2,Te.T=null;try{for(var y=n.onRecoverableError,A=0;A<c.length;A++){var F=c[A];y(F.value,{componentStack:F.stack})}}finally{Te.T=a,Xe.p=f}}if(c=Hr,y=jr,jr=null,c!==null&&(Hr=null,y===null&&(y=[]),e!==null))for(F=0;F<c.length;F++)a=(0,c[F])(y),a!==void 0&&e.finished.finally(a);(ra&3)!==0&&nu(),oa(n),f=n.pendingLanes,(r&261930)!==0&&(f&42)!==0?n===Jc?dl++:(dl=0,Jc=n):(dl=0,Jc=null),hl(0)}}function Gv(e,n){(e.pooledCacheLanes&=n)===0&&(n=e.pooledCache,n!=null&&(e.pooledCache=null,Yo(n)))}function nu(){return Fr!==null&&(Fr.skipTransition(),Fr=null),eh(),th(),nh(),ih()}function ih(){if(an!==5)return!1;var e=Fi,n=Kd;Kd=0;var a=te(ra),r=Te.T,c=Xe.p;try{Xe.p=32>a?32:a,Te.T=null,a=Qd,Qd=null;var f=Fi,y=ra;if(an=0,Qs=Fi=null,ra=0,(Ft&6)!==0)throw Error(o(331));var A=Ft;if(Ft|=4,Cv(f.current),Tv(f,f.current,y,a),Ft=A,hl(0,!1),nn&&typeof nn.onPostCommitFiberRoot=="function")try{nn.onPostCommitFiberRoot(Ct,f)}catch{}return!0}finally{Xe.p=c,Te.T=r,Gv(e,n)}}function Vv(e,n,a){n=Si(a,n),n=yd(e.stateNode,n,2),e=Qa(e,n,2),e!==null&&(Us(e,2),oa(e))}function Vt(e,n,a){if(e.tag===3)Vv(e,e,a);else for(;n!==null;){if(n.tag===3){Vv(n,e,a);break}else if(n.tag===1){var r=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(ss===null||!ss.has(r))){e=Si(a,e),a=F0(2),r=Qa(n,a,2),r!==null&&(H0(a,r,n,e),Us(r,2),oa(r));break}}n=n.return}}function ah(e,n,a){var r=e.pingCache;if(r===null){r=e.pingCache=new UM;var c=new Set;r.set(n,c)}else c=r.get(n),c===void 0&&(c=new Set,r.set(n,c));c.has(a)||(Wd=!0,c.add(a),e=HM.bind(null,e,n,a),n.then(e,e))}function HM(e,n,a){var r=e.pingCache;r!==null&&r.delete(n),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,Kt===e&&(Rt&a)===a&&((ln===4||ln===3&&(Rt&62914560)===Rt&&300>W()-Zc)&&(Ft&2)===0?Vr(e,0):Wc|=a,Br===Rt&&(Br=0)),oa(e)}function kv(e,n){n===0&&(n=Kl()),e=zs(e,n),e!==null&&(Us(e,n),oa(e))}function jM(e){var n=e.memoizedState,a=0;n!==null&&(a=n.retryLane),kv(e,a)}function GM(e,n){var a=0;switch(e.tag){case 31:case 13:var r=e.stateNode,c=e.memoizedState;c!==null&&(a=c.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(o(314))}r!==null&&r.delete(n),kv(e,a)}function VM(e,n){return at(e,n)}var Xr=null,qr=null,sh=!1,iu=!1,rh=!1,os=0;function oa(e){e!==qr&&e.next===null&&(qr===null?Xr=qr=e:qr=qr.next=e),iu=!0,sh||(sh=!0,XM())}function hl(e,n){if(!rh&&iu){rh=!0;do for(var a=!1,r=Xr;r!==null;){if(e!==0){var c=r.pendingLanes;if(c===0)var f=0;else{var y=r.suspendedLanes,A=r.pingedLanes;f=(1<<31-zn(42|e)+1)-1,f&=c&~(y&~A),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,Wv(r,f))}else f=Rt,f=Ds(r,r===Kt?f:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),(f&3)===0||Ha(r,f)||(a=!0,Wv(r,f));r=r.next}while(a);rh=!1}}function kM(){Xv()}function Xv(){iu=sh=!1;var e=0;os!==0&&n1()&&(e=os);for(var n=W(),a=null,r=Xr;r!==null;){var c=r.next,f=qv(r,n);f===0?(r.next=null,a===null?Xr=c:a.next=c,c===null&&(qr=a)):(a=r,(e!==0||(f&3)!==0)&&(iu=!0)),r=c}an!==0&&an!==5||hl(e),os!==0&&(os=0)}function qv(e,n){for(var a=e.suspendedLanes,r=e.pingedLanes,c=e.expirationTimes,f=e.pendingLanes&-62914561;0<f;){var y=31-zn(f),A=1<<y,F=c[y];F===-1?((A&a)===0||(A&r)!==0)&&(c[y]=uf(A,n)):F<=n&&(e.expiredLanes|=A),f&=~A}if(n=Kt,a=Rt,a=Ds(e,e===n?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,a===0||e===n&&(Gt===2||Gt===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&Je(r),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||Ha(e,a)){if(n=a&-a,n===e.callbackPriority)return n;switch(r!==null&&Je(r),te(a)){case 2:case 8:a=Ke;break;case 32:a=be;break;case 268435456:a=nt;break;default:a=be}return r=Yv.bind(null,e),a=at(a,r),e.callbackPriority=n,e.callbackNode=a,n}return r!==null&&r!==null&&Je(r),e.callbackPriority=2,e.callbackNode=null,2}function Yv(e,n){if(an!==0&&an!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(nu()&&e.callbackNode!==a)return null;var r=Rt;return r=Ds(e,e===Kt?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(Uv(e,r,n),qv(e,W()),e.callbackNode!=null&&e.callbackNode===a?Yv.bind(null,e):null)}function Wv(e,n){if(nu())return null;Uv(e,n,!0)}function XM(){a1(function(){(Ft&6)!==0?at(Ie,kM):Xv()})}function oh(){if(os===0){var e=js;e===0&&(e=ws,ws<<=1,(ws&261888)===0&&(ws=256)),os=e}return os}function Zv(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:$l(e)}function qM(e,n,a,r,c){if(n==="submit"&&a&&a.stateNode===c){var f=Zv((c[et]||null).action),y=r.submitter;y&&(n=(n=y[et]||null)?Zv(n.formAction):y.getAttribute("formAction"),n!==null&&(f=n,y=null));var A=new ic("action","action",null,r,c);e.push({event:A,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(os!==0){var F=new FormData(c,y);md(a,{pending:!0,data:F,method:c.method,action:f},null,F)}}else typeof f=="function"&&(A.preventDefault(),F=new FormData(c,y),md(a,{pending:!0,data:F,method:c.method,action:f},f,F))},currentTarget:c}]})}}for(var lh=0;lh<Lf.length;lh++){var ch=Lf[lh],YM=ch.toLowerCase(),WM=ch[0].toUpperCase()+ch.slice(1);zi(YM,"on"+WM)}zi(Sg,"onAnimationEnd"),zi(Mg,"onAnimationIteration"),zi(Eg,"onAnimationStart"),zi("dblclick","onDoubleClick"),zi("focusin","onFocus"),zi("focusout","onBlur"),zi(iM,"onTransitionRun"),zi(aM,"onTransitionStart"),zi(sM,"onTransitionCancel"),zi(Tg,"onTransitionEnd"),rn("onMouseEnter",["mouseout","mouseover"]),rn("onMouseLeave",["mouseout","mouseover"]),rn("onPointerEnter",["pointerout","pointerover"]),rn("onPointerLeave",["pointerout","pointerover"]),dn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),dn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),dn("onBeforeInput",["compositionend","keypress","textInput","paste"]),dn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),dn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),dn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var pl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ZM=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(pl));function Kv(e,n){n=(n&4)!==0;for(var a=0;a<e.length;a++){var r=e[a],c=r.event;r=r.listeners;e:{var f=void 0;if(n)for(var y=r.length-1;0<=y;y--){var A=r[y],F=A.instance,J=A.currentTarget;if(A=A.listener,F!==f&&c.isPropagationStopped())break e;f=A,c.currentTarget=J;try{f(c)}catch(le){rc(le)}c.currentTarget=null,f=F}else for(y=0;y<r.length;y++){if(A=r[y],F=A.instance,J=A.currentTarget,A=A.listener,F!==f&&c.isPropagationStopped())break e;f=A,c.currentTarget=J;try{f(c)}catch(le){rc(le)}c.currentTarget=null,f=F}}}}function bt(e,n){var a=n[rt];a===void 0&&(a=n[rt]=new Set);var r=e+"__bubble";a.has(r)||(Qv(n,e,2,!1),a.add(r))}function uh(e,n,a){var r=0;n&&(r|=4),Qv(a,e,r,n)}var au="_reactListening"+Math.random().toString(36).slice(2);function fh(e){if(!e[au]){e[au]=!0,Qt.forEach(function(a){a!=="selectionchange"&&(ZM.has(a)||uh(a,!1,e),uh(a,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[au]||(n[au]=!0,uh("selectionchange",!1,n))}}function Qv(e,n,a,r){switch(H_(n)){case 2:var c=j1;break;case 8:c=G1;break;default:c=Dh}a=c.bind(null,n,a,e),c=void 0,!xf||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(c=!0),r?c!==void 0?e.addEventListener(n,a,{capture:!0,passive:c}):e.addEventListener(n,a,!0):c!==void 0?e.addEventListener(n,a,{passive:c}):e.addEventListener(n,a,!1)}function dh(e,n,a,r,c){var f=r;if((n&1)===0&&(n&2)===0&&r!==null)e:for(;;){if(r===null)return;var y=r.tag;if(y===3||y===4){var A=r.stateNode.containerInfo;if(A===c)break;if(y===4)for(y=r.return;y!==null;){var F=y.tag;if((F===3||F===4)&&y.stateNode.containerInfo===c)return;y=y.return}for(;A!==null;){if(y=Bt(A),y===null)return;if(F=y.tag,F===5||F===6||F===26||F===27){r=f=y;continue e}A=A.parentNode}}r=r.return}Qm(function(){var J=f,le=vf(a),ge=[];e:{var K=bg.get(e);if(K!==void 0){var re=ic,Fe=e;switch(e){case"keypress":if(tc(a)===0)break e;case"keydown":case"keyup":re=LS;break;case"focusin":Fe="focus",re=Ef;break;case"focusout":Fe="blur",re=Ef;break;case"beforeblur":case"afterblur":re=Ef;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":re=eg;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":re=SS;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":re=BS;break;case Sg:case Mg:case Eg:re=TS;break;case Tg:re=HS;break;case"scroll":case"scrollend":re=xS;break;case"wheel":re=GS;break;case"copy":case"cut":case"paste":re=AS;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":re=ng;break;case"submit":re=PS;break;case"toggle":case"beforetoggle":re=kS}var tt=(n&4)!==0,gt=!tt&&(e==="scroll"||e==="scrollend"),Q=tt?K!==null?K+"Capture":null:K;tt=[];for(var q=J,ne;q!==null;){var me=q;if(ne=me.stateNode,me=me.tag,me!==5&&me!==26&&me!==27||ne===null||Q===null||(me=Po(q,Q),me!=null&&tt.push(ml(q,me,ne))),gt)break;q=q.return}0<tt.length&&(K=new re(K,Fe,null,a,le),ge.push({event:K,listeners:tt}))}}if((n&7)===0){e:{if(re=e==="mouseover"||e==="pointerover",K=e==="mouseout"||e==="pointerout",re&&a!==gf&&(Fe=a.relatedTarget||a.fromElement)&&(Bt(Fe)||Fe[ct]))break e;(K||re)&&(Fe=le.window===le?le:(re=le.ownerDocument)?re.defaultView||re.parentWindow:window,K?(re=a.relatedTarget||a.toElement,K=J,re=re?Bt(re):null,re!==null&&(gt=u(re),tt=re.tag,re!==gt||tt!==5&&tt!==27&&tt!==6)&&(re=null)):(K=null,re=J),K!==re&&(tt=eg,me="onMouseLeave",Q="onMouseEnter",q="mouse",(e==="pointerout"||e==="pointerover")&&(tt=ng,me="onPointerLeave",Q="onPointerEnter",q="pointer"),gt=K==null?Fe:xn(K),ne=re==null?Fe:xn(re),Fe=new tt(me,q+"leave",K,a,le),Fe.target=gt,Fe.relatedTarget=ne,me=null,Bt(le)===J&&(tt=new tt(Q,q+"enter",re,a,le),tt.target=ne,tt.relatedTarget=gt,me=tt),gt=me,tt=K&&re?H(K,re,KM):null,K!==null&&Jv(ge,Fe,K,tt,!1),re!==null&&gt!==null&&Jv(ge,gt,re,tt,!0)))}e:{if(K=J?xn(J):window,re=K.nodeName&&K.nodeName.toLowerCase(),re==="select"||re==="input"&&K.type==="file")var We=ug;else if(lg(K))if(fg)We=eM;else{We=JS;var wt=QS}else re=K.nodeName,!re||re.toLowerCase()!=="input"||K.type!=="checkbox"&&K.type!=="radio"?J&&mf(J.elementType)&&(We=ug):We=$S;if(We&&(We=We(e,J))){cg(ge,We,a,le);break e}wt&&wt(e,K,J)}switch(wt=J?xn(J):window,e){case"focusin":(lg(wt)||wt.contentEditable==="true")&&(yr=wt,Nf=J,ko=null);break;case"focusout":ko=Nf=yr=null;break;case"mousedown":Df=!0;break;case"contextmenu":case"mouseup":case"dragend":Df=!1,xg(ge,a,le);break;case"selectionchange":if(nM)break;case"keydown":case"keyup":xg(ge,a,le)}var st;if(bf)e:{switch(e){case"compositionstart":var ut="onCompositionStart";break e;case"compositionend":ut="onCompositionEnd";break e;case"compositionupdate":ut="onCompositionUpdate";break e}ut=void 0}else xr?rg(e,a)&&(ut="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(ut="onCompositionStart");ut&&(ig&&a.locale!=="ko"&&(xr||ut!=="onCompositionStart"?ut==="onCompositionEnd"&&xr&&(st=Jm()):(Ga=le,yf="value"in Ga?Ga.value:Ga.textContent,xr=!0)),wt=su(J,ut),0<wt.length&&(ut=new tg(ut,e,null,a,le),ge.push({event:ut,listeners:wt}),st?ut.data=st:(st=og(a),st!==null&&(ut.data=st)))),(st=qS?YS(e,a):WS(e,a))&&(ut=su(J,"onBeforeInput"),0<ut.length&&(wt=new tg("onBeforeInput","beforeinput",null,a,le),ge.push({event:wt,listeners:ut}),wt.data=st)),qM(ge,e,J,a,le)}Kv(ge,n)})}function ml(e,n,a){return{instance:e,listener:n,currentTarget:a}}function su(e,n){for(var a=n+"Capture",r=[];e!==null;){var c=e,f=c.stateNode;if(c=c.tag,c!==5&&c!==26&&c!==27||f===null||(c=Po(e,a),c!=null&&r.unshift(ml(e,c,f)),c=Po(e,n),c!=null&&r.push(ml(e,c,f))),e.tag===3)return r;e=e.return}return[]}function KM(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Jv(e,n,a,r,c){for(var f=n._reactName,y=[];a!==null&&a!==r;){var A=a,F=A.alternate,J=A.stateNode;if(A=A.tag,F!==null&&F===r)break;A!==5&&A!==26&&A!==27||J===null||(F=J,c?(J=Po(a,f),J!=null&&y.unshift(ml(a,J,F))):c||(J=Po(a,f),J!=null&&y.push(ml(a,J,F)))),a=a.return}y.length!==0&&e.push({event:n,listeners:y})}var QM=/\r\n?/g,JM=/\u0000|\uFFFD/g;function $v(e){return(typeof e=="string"?e:""+e).replace(QM,`
`).replace(JM,"")}function e_(e,n){return n=$v(n),$v(e)===n}function kt(e,n,a,r,c,f){switch(a){case"children":if(typeof r=="string")n==="body"||n==="textarea"&&r===""||gr(e,r);else if(typeof r=="number"||typeof r=="bigint")n!=="body"&&gr(e,""+r);else return;break;case"className":Jl(e,"class",r);break;case"tabIndex":Jl(e,"tabindex",r);break;case"dir":case"role":case"viewBox":case"width":case"height":Jl(e,a,r);break;case"style":Zm(e,r,f);return;case"data":if(n!=="object"){Jl(e,"data",r);break}case"src":case"href":if(r===""&&(n!=="a"||a!=="href")){e.removeAttribute(a);break}if(r==null||typeof r=="function"||typeof r=="symbol"||typeof r=="boolean"){e.removeAttribute(a);break}r=$l(r),e.setAttribute(a,r);break;case"action":case"formAction":if(typeof r=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&kt(e,n,"name",c.name,c,null),kt(e,n,"formEncType",c.formEncType,c,null),kt(e,n,"formMethod",c.formMethod,c,null),kt(e,n,"formTarget",c.formTarget,c,null)):(kt(e,n,"encType",c.encType,c,null),kt(e,n,"method",c.method,c,null),kt(e,n,"target",c.target,c,null)));if(r==null||typeof r=="symbol"||typeof r=="boolean"){e.removeAttribute(a);break}r=$l(r),e.setAttribute(a,r);break;case"onClick":r!=null&&(e.onclick=Qi);return;case"onScroll":r!=null&&bt("scroll",e);return;case"onScrollEnd":r!=null&&bt("scrollend",e);return;case"dangerouslySetInnerHTML":if(r!=null){if(typeof r!="object"||!("__html"in r))throw Error(o(61));if(a=r.__html,a!=null){if(c.children!=null)throw Error(o(60));(f!=null?f.__html:void 0)!==a&&(e.innerHTML=a)}}break;case"multiple":e.multiple=r&&typeof r!="function"&&typeof r!="symbol";break;case"muted":e.muted=r&&typeof r!="function"&&typeof r!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(r==null||typeof r=="function"||typeof r=="boolean"||typeof r=="symbol"){e.removeAttribute("xlink:href");break}a=$l(r),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":r!=null&&typeof r!="function"&&typeof r!="symbol"?e.setAttribute(a,r):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":r&&typeof r!="function"&&typeof r!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":r===!0?e.setAttribute(a,""):r!==!1&&r!=null&&typeof r!="function"&&typeof r!="symbol"?e.setAttribute(a,r):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":r!=null&&typeof r!="function"&&typeof r!="symbol"&&!isNaN(r)&&1<=r?e.setAttribute(a,r):e.removeAttribute(a);break;case"rowSpan":case"start":r==null||typeof r=="function"||typeof r=="symbol"||isNaN(r)?e.removeAttribute(a):e.setAttribute(a,r);break;case"popover":bt("beforetoggle",e),bt("toggle",e),Ql(e,"popover",r);break;case"xlinkActuate":ma(e,"http://www.w3.org/1999/xlink","xlink:actuate",r);break;case"xlinkArcrole":ma(e,"http://www.w3.org/1999/xlink","xlink:arcrole",r);break;case"xlinkRole":ma(e,"http://www.w3.org/1999/xlink","xlink:role",r);break;case"xlinkShow":ma(e,"http://www.w3.org/1999/xlink","xlink:show",r);break;case"xlinkTitle":ma(e,"http://www.w3.org/1999/xlink","xlink:title",r);break;case"xlinkType":ma(e,"http://www.w3.org/1999/xlink","xlink:type",r);break;case"xmlBase":ma(e,"http://www.w3.org/XML/1998/namespace","xml:base",r);break;case"xmlLang":ma(e,"http://www.w3.org/XML/1998/namespace","xml:lang",r);break;case"xmlSpace":ma(e,"http://www.w3.org/XML/1998/namespace","xml:space",r);break;case"is":Ql(e,"is",r);break;case"innerText":case"textContent":return;default:if(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")a=vS.get(a)||a,Ql(e,a,r);else return}Pt=!0}function hh(e,n,a,r,c,f){switch(a){case"style":Zm(e,r,f);return;case"dangerouslySetInnerHTML":if(r!=null){if(typeof r!="object"||!("__html"in r))throw Error(o(61));if(a=r.__html,a!=null){if(c.children!=null)throw Error(o(60));(f!=null?f.__html:void 0)!==a&&(e.innerHTML=a)}}break;case"children":if(typeof r=="string")gr(e,r);else if(typeof r=="number"||typeof r=="bigint")gr(e,""+r);else return;break;case"onScroll":r!=null&&bt("scroll",e);return;case"onScrollEnd":r!=null&&bt("scrollend",e);return;case"onClick":r!=null&&(e.onclick=Qi);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!jn.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(c=a.endsWith("Capture"),f=a.slice(2,c?a.length-7:void 0),n=e[et]||null,n=n!=null?n[a]:null,typeof n=="function"&&e.removeEventListener(f,n,c),typeof r=="function")){typeof n!="function"&&n!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(f,r,c);break e}Pt=!0,a in e?e[a]=r:r===!0?e.setAttribute(a,""):Ql(e,a,r)}return}Pt=!0}function Dn(e,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":bt("error",e),bt("load",e);var r=!1,c=!1,f;for(f in a)if(a.hasOwnProperty(f)){var y=a[f];if(y!=null)switch(f){case"src":r=!0;break;case"srcSet":c=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(o(137,n));default:kt(e,n,f,y,a,null)}}c&&kt(e,n,"srcSet",a.srcSet,a,null),r&&kt(e,n,"src",a.src,a,null);return;case"input":bt("invalid",e);var A=f=y=c=null,F=null,J=null;for(r in a)if(a.hasOwnProperty(r)){var le=a[r];if(le!=null)switch(r){case"name":c=le;break;case"type":y=le;break;case"checked":F=le;break;case"defaultChecked":J=le;break;case"value":f=le;break;case"defaultValue":A=le;break;case"children":case"dangerouslySetInnerHTML":if(le!=null)throw Error(o(137,n));break;default:kt(e,n,r,le,a,null)}}Xm(e,f,A,F,J,y,c,!1);return;case"select":bt("invalid",e),r=y=f=null;for(c in a)if(a.hasOwnProperty(c)&&(A=a[c],A!=null))switch(c){case"value":f=A;break;case"defaultValue":y=A;break;case"multiple":r=A;default:kt(e,n,c,A,a,null)}n=f,a=y,e.multiple=!!r,n!=null?mr(e,!!r,n,!1):a!=null&&mr(e,!!r,a,!0);return;case"textarea":bt("invalid",e),f=c=r=null;for(y in a)if(a.hasOwnProperty(y)&&(A=a[y],A!=null))switch(y){case"value":r=A;break;case"defaultValue":c=A;break;case"children":f=A;break;case"dangerouslySetInnerHTML":if(A!=null)throw Error(o(91));break;default:kt(e,n,y,A,a,null)}Ym(e,r,c,f);return;case"option":for(F in a)if(a.hasOwnProperty(F)&&(r=a[F],r!=null))switch(F){case"selected":e.selected=r&&typeof r!="function"&&typeof r!="symbol";break;default:kt(e,n,F,r,a,null)}return;case"dialog":bt("beforetoggle",e),bt("toggle",e),bt("cancel",e),bt("close",e);break;case"iframe":case"object":bt("load",e);break;case"video":case"audio":for(r=0;r<pl.length;r++)bt(pl[r],e);break;case"image":bt("error",e),bt("load",e);break;case"details":bt("toggle",e);break;case"embed":case"source":case"link":bt("error",e),bt("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(J in a)if(a.hasOwnProperty(J)&&(r=a[J],r!=null))switch(J){case"children":case"dangerouslySetInnerHTML":throw Error(o(137,n));default:kt(e,n,J,r,a,null)}return;default:if(mf(n)){for(le in a)a.hasOwnProperty(le)&&(r=a[le],r!==void 0&&hh(e,n,le,r,a,void 0));return}}for(A in a)a.hasOwnProperty(A)&&(r=a[A],r!=null&&kt(e,n,A,r,a,null))}var $M={};function e1(e,n,a,r){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var c=null,f=null,y=null,A=null,F=null,J=null,le=null;for(re in a){var ge=a[re];if(a.hasOwnProperty(re)&&ge!=null)switch(re){case"checked":break;case"value":break;case"defaultValue":F=ge;default:r.hasOwnProperty(re)||kt(e,n,re,null,r,ge)}}for(var K in r){var re=r[K];if(ge=a[K],r.hasOwnProperty(K)&&(re!=null||ge!=null))switch(K){case"type":re!==ge&&(Pt=!0),f=re;break;case"name":re!==ge&&(Pt=!0),c=re;break;case"checked":re!==ge&&(Pt=!0),J=re;break;case"defaultChecked":re!==ge&&(Pt=!0),le=re;break;case"value":re!==ge&&(Pt=!0),y=re;break;case"defaultValue":re!==ge&&(Pt=!0),A=re;break;case"children":case"dangerouslySetInnerHTML":if(re!=null)throw Error(o(137,n));break;default:re!==ge&&kt(e,n,K,re,r,ge)}}hf(e,y,A,F,J,le,f,c);return;case"select":re=y=A=K=null;for(f in a)if(F=a[f],a.hasOwnProperty(f)&&F!=null)switch(f){case"value":break;case"multiple":re=F;default:r.hasOwnProperty(f)||kt(e,n,f,null,r,F)}for(c in r)if(f=r[c],F=a[c],r.hasOwnProperty(c)&&(f!=null||F!=null))switch(c){case"value":f!==F&&(Pt=!0),K=f;break;case"defaultValue":f!==F&&(Pt=!0),A=f;break;case"multiple":f!==F&&(Pt=!0),y=f;default:f!==F&&kt(e,n,c,f,r,F)}n=A,a=y,r=re,K!=null?mr(e,!!a,K,!1):!!r!=!!a&&(n!=null?mr(e,!!a,n,!0):mr(e,!!a,a?[]:"",!1));return;case"textarea":re=K=null;for(A in a)if(c=a[A],a.hasOwnProperty(A)&&c!=null&&!r.hasOwnProperty(A))switch(A){case"value":break;case"children":break;default:kt(e,n,A,null,r,c)}for(y in r)if(c=r[y],f=a[y],r.hasOwnProperty(y)&&(c!=null||f!=null))switch(y){case"value":c!==f&&(Pt=!0),K=c;break;case"defaultValue":c!==f&&(Pt=!0),re=c;break;case"children":break;case"dangerouslySetInnerHTML":if(c!=null)throw Error(o(91));break;default:c!==f&&kt(e,n,y,c,r,f)}qm(e,K,re);return;case"option":for(var Fe in a)if(K=a[Fe],a.hasOwnProperty(Fe)&&K!=null&&!r.hasOwnProperty(Fe))switch(Fe){case"selected":e.selected=!1;break;default:kt(e,n,Fe,null,r,K)}for(F in r)if(K=r[F],re=a[F],r.hasOwnProperty(F)&&K!==re&&(K!=null||re!=null))switch(F){case"selected":K!==re&&(Pt=!0),e.selected=K&&typeof K!="function"&&typeof K!="symbol";break;default:kt(e,n,F,K,r,re)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var tt in a)K=a[tt],a.hasOwnProperty(tt)&&K!=null&&!r.hasOwnProperty(tt)&&kt(e,n,tt,null,r,K);for(J in r)if(K=r[J],re=a[J],r.hasOwnProperty(J)&&K!==re&&(K!=null||re!=null))switch(J){case"children":case"dangerouslySetInnerHTML":if(K!=null)throw Error(o(137,n));break;default:kt(e,n,J,K,r,re)}return;default:if(mf(n)){for(var gt in a)K=a[gt],a.hasOwnProperty(gt)&&K!==void 0&&!r.hasOwnProperty(gt)&&hh(e,n,gt,void 0,r,K);for(le in r)K=r[le],re=a[le],!r.hasOwnProperty(le)||K===re||K===void 0&&re===void 0||hh(e,n,le,K,r,re);return}}for(var Q in a)K=a[Q],a.hasOwnProperty(Q)&&K!=null&&!r.hasOwnProperty(Q)&&kt(e,n,Q,null,r,K);for(ge in r)K=r[ge],re=a[ge],!r.hasOwnProperty(ge)||K===re||K==null&&re==null||kt(e,n,ge,K,r,re)}function t_(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function t1(){if(typeof performance.getEntriesByType=="function"){for(var e=0,n=0,a=performance.getEntriesByType("resource"),r=0;r<a.length;r++){var c=a[r],f=c.transferSize,y=c.initiatorType,A=c.duration;if(f&&A&&t_(y)){for(y=0,A=c.responseEnd,r+=1;r<a.length;r++){var F=a[r],J=F.startTime;if(J>A)break;var le=F.transferSize,ge=F.initiatorType;le&&t_(ge)&&(F=F.responseEnd,y+=le*(F<A?1:(A-J)/(F-J)))}if(--r,n+=8*(f+y)/(c.duration/1e3),e++,10<e)break}}if(0<e)return n/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var ph=null,mh=null;function gl(e){return e.nodeType===9?e:e.ownerDocument}function n_(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function i_(e,n){if(e===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&n==="foreignObject"?0:e}function a_(e,n,a,r){return a=gl(a).createElement(e),a[Pe]=r,a[et]=n,Dn(a,e,n),zt(a),a}function gh(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var vh=null;function n1(){var e=window.event;return e&&e.type==="popstate"?e===vh?!1:(vh=e,!0):(vh=null,!1)}var _h=typeof setTimeout=="function"?setTimeout:void 0,i1=typeof clearTimeout=="function"?clearTimeout:void 0,s_=typeof Promise=="function"?Promise:void 0,r_=typeof requestAnimationFrame=="function"?requestAnimationFrame:_h,a1=typeof queueMicrotask=="function"?queueMicrotask:typeof s_<"u"?function(e){return s_.resolve(null).then(e).catch(s1)}:_h;function s1(e){setTimeout(function(){throw e})}function ls(e){return e==="head"}function o_(e,n){var a=n,r=0;do{var c=a.nextSibling;if(e.removeChild(a),c&&c.nodeType===8)if(a=c.data,a==="/$"||a==="/&"){if(r===0){e.removeChild(c),$r(n);return}r--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")r++;else if(a==="html")Ah(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,Ah(a);for(var f=a.firstChild;f;){var y=f.nextSibling,A=f.nodeName;f[It]||A==="SCRIPT"||A==="STYLE"||A==="LINK"&&f.rel.toLowerCase()==="stylesheet"||a.removeChild(f),f=y}}else a==="body"&&Ah(e.ownerDocument.body);a=c}while(a);$r(n)}function l_(e,n){var a=e;e=0;do{var r=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),r&&r.nodeType===8)if(a=r.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=r}while(a)}function c_(e,n,a){if(n=CSS.escape(n)!==n?"r-"+btoa(n).replace(/=/g,""):n,e.style.viewTransitionName=n,a!=null&&(e.style.viewTransitionClass=a),a=getComputedStyle(e),a.display==="inline"){if(n=e.getClientRects(),n.length===1)var r=1;else for(var c=r=0;c<n.length;c++){var f=n[c];0<f.width&&0<f.height&&r++}r===1&&(e=e.style,e.display=n.length===1?"inline-block":"block",e.marginTop="-"+a.paddingTop,e.marginBottom="-"+a.paddingBottom)}}function u_(e,n){e=e.style,n=n.style;var a=n!=null?n.hasOwnProperty("viewTransitionName")?n.viewTransitionName:n.hasOwnProperty("view-transition-name")?n["view-transition-name"]:null:null;e.viewTransitionName=a==null||typeof a=="boolean"?"":(""+a).trim(),a=n!=null?n.hasOwnProperty("viewTransitionClass")?n.viewTransitionClass:n.hasOwnProperty("view-transition-class")?n["view-transition-class"]:null:null,e.viewTransitionClass=a==null||typeof a=="boolean"?"":(""+a).trim(),e.display==="inline-block"&&(n==null?e.display=e.margin="":(a=n.display,e.display=a==null||typeof a=="boolean"?"":a,a=n.margin,a!=null?e.margin=a:(a=n.hasOwnProperty("marginTop")?n.marginTop:n["margin-top"],e.marginTop=a==null||typeof a=="boolean"?"":a,n=n.hasOwnProperty("marginBottom")?n.marginBottom:n["margin-bottom"],e.marginBottom=n==null||typeof n=="boolean"?"":n)))}function r1(e,n,a){return a=a.ownerDocument.defaultView,{rect:e,abs:n.position==="absolute"||n.position==="fixed",clip:n.clipPath!=="none"||n.overflow!=="visible"||n.filter!=="none"||n.mask!=="none"||n.mask!=="none"||n.borderRadius!=="0px",view:0<=e.bottom&&0<=e.right&&e.top<=a.innerHeight&&e.left<=a.innerWidth}}function xh(e){var n=e.getBoundingClientRect(),a=getComputedStyle(e);return r1(n,a,e)}function o1(e){return e.documentElement.clientHeight}function l1(e){this.addEventListener("load",e),this.addEventListener("error",e)}function c1(e,n,a,r,c,f,y,A,F){var J=n.nodeType===9?n:n.ownerDocument;try{var le=J.startViewTransition({update:function(){var K=J.defaultView,re=K.navigation&&K.navigation.transition,Fe=J.fonts.status;r();var tt=[];if(Fe==="loaded"&&(o1(J),J.fonts.status==="loading"&&tt.push(J.fonts.ready)),Fe=tt.length,e!==null)for(var gt=e.suspenseyImages,Q=0,q=0;q<gt.length;q++){var ne=gt[q];if(!ne.complete){var me=ne.getBoundingClientRect();if(0<me.bottom&&0<me.right&&me.top<K.innerHeight&&me.left<K.innerWidth){if(Q+=D_(ne),Q>lu){tt.length=Fe;break}ne=new Promise(l1.bind(ne)),tt.push(ne)}}}if(0<tt.length)return K=Promise.race([Promise.all(tt),new Promise(function(We){return setTimeout(We,500)})]).then(c,c),(re?Promise.allSettled([re.finished,K]):K).then(f,f);if(c(),re)return re.finished.then(f,f);f()},types:a});J.__reactViewTransition=le;var ge=[];return le.ready.then(function(){for(var K=J.documentElement.getAnimations({subtree:!0}),re=0;re<K.length;re++){var Fe=K[re],tt=Fe.effect,gt=tt.pseudoElement;if(gt!=null&&gt.startsWith("::view-transition")){ge.push(Fe),Fe=tt.getKeyframes();for(var Q=gt=void 0,q=!0,ne=0;ne<Fe.length;ne++){var me=Fe[ne],We=me.width;if(gt===void 0)gt=We;else if(gt!==We){q=!1;break}if(We=me.height,Q===void 0)Q=We;else if(Q!==We){q=!1;break}delete me.width,delete me.height,me.transform==="none"&&delete me.transform}q&&gt!==void 0&&Q!==void 0&&(tt.setKeyframes(Fe),q=getComputedStyle(tt.target,tt.pseudoElement),q.width!==gt||q.height!==Q)&&(q=Fe[0],q.width=gt,q.height=Q,q=Fe[Fe.length-1],q.width=gt,q.height=Q,tt.setKeyframes(Fe))}}y()},function(K){J.__reactViewTransition===le&&(J.__reactViewTransition=null);try{if(typeof K=="object"&&K!==null)switch(K.name){case"InvalidStateError":(K.message==="View transition was skipped because document visibility state is hidden."||K.message==="Skipping view transition because document visibility state has become hidden."||K.message==="Skipping view transition because viewport size changed."||K.message==="Transition was aborted because of invalid state")&&(K=null)}K!==null&&F(K)}finally{r(),c(),y()}}),le.finished.finally(function(){for(var K=0;K<ge.length;K++)ge[K].cancel();J.__reactViewTransition===le&&(J.__reactViewTransition=null),A()}),le}catch{return r(),c(),y(),null}}function Js(e,n){this._scope=document.documentElement,this._selector="::view-transition-"+e+"("+n+")"}Js.prototype.animate=function(e,n){return n=typeof n=="number"?{duration:n}:I({},n),n.pseudoElement=this._selector,this._scope.animate(e,n)},Js.prototype.getAnimations=function(){for(var e=this._scope,n=this._selector,a=e.getAnimations({subtree:!0}),r=[],c=0;c<a.length;c++){var f=a[c].effect;f!==null&&f.target===e&&f.pseudoElement===n&&r.push(a[c])}return r},Js.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function f_(e){return{name:e,group:new Js("group",e),imagePair:new Js("image-pair",e),old:new Js("old",e),new:new Js("new",e)}}function di(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}di.prototype.addEventListener=function(e,n,a){var r=null,c=null;if(!(a!=null&&typeof a!="boolean"&&(r=a.signal||null,r!==null&&r.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var f=this._eventListeners;if(h_(f,e,n,a)===-1){var y=this,A=n;a!=null&&typeof a!="boolean"&&a.once===!0&&(A=function(F){y.removeEventListener(e,n,a),typeof n=="function"?n.call(this,F):n.handleEvent(F)}),r!==null&&(c=y.removeEventListener.bind(y,e,n,a),r.addEventListener("abort",c,{once:!0}),c=r.removeEventListener.bind(r,"abort",c)),r=Yr(a),f.push({type:e,listener:n,optionsOrUseCapture:a,attachedListener:A,cleanup:c}),v(this._fragmentFiber.child,!1,u1,e,A,r)}this._eventListeners=f}};function u1(e,n,a,r){return M(e).addEventListener(n,a,r),!1}di.prototype.removeEventListener=function(e,n,a){var r=this._eventListeners;if(r!==null&&(n=h_(r,e,n,a),n!==-1)){var c=r[n];a=c.attachedListener;var f=c.cleanup;c=Yr(c.optionsOrUseCapture),v(this._fragmentFiber.child,!1,f1,e,a,c),r.splice(n,1),f!==null&&f()}};function f1(e,n,a,r){return M(e).removeEventListener(n,a,r),!1}function Yr(e){return e!=null&&typeof e!="boolean"&&(e.once===!0||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function d_(e){return e==null?"c=0":typeof e=="boolean"?"c="+(e?"1":"0"):"c="+(e.capture?"1":"0")}function h_(e,n,a,r){if(e.length===0)return-1;r=d_(r);for(var c=0;c<e.length;c++){var f=e[c];if(f.type===n&&f.listener===a&&d_(f.optionsOrUseCapture)===r)return c}return-1}di.prototype.dispatchEvent=function(e){var n=S(this._fragmentFiber);if(n===null)return!0;n=M(n);var a=this._eventListeners;if(a!==null&&0<a.length||!e.bubbles){var r=n.nodeType===9?n.createComment(""):document.createTextNode("");if(a)for(var c=0;c<a.length;c++){var f=a[c];r.addEventListener(f.type,f.attachedListener,Yr(f.optionsOrUseCapture))}if(n.appendChild(r),e=r.dispatchEvent(e),a)for(c=0;c<a.length;c++)f=a[c],r.removeEventListener(f.type,f.attachedListener,Yr(f.optionsOrUseCapture));return n.removeChild(r),e}return n.dispatchEvent(e)},di.prototype.focus=function(e){v(this._fragmentFiber.child,!0,p_,e,void 0,void 0)};function p_(e,n){return e.tag===6?!1:(e=M(e),E1(e,n))}di.prototype.focusLast=function(e){var n=[];v(this._fragmentFiber.child,!0,yh,n,void 0,void 0);for(var a=n.length-1;0<=a&&!p_(n[a],e);a--);};function yh(e,n){return n.push(e),!1}di.prototype.blur=function(){var e=S(this._fragmentFiber);e!==null&&(e=M(e),e=gl(e).activeElement,e!==null&&v(this._fragmentFiber.child,!1,d1,e,void 0,void 0))};function d1(e,n){return e.tag===6?!1:(e=M(e),e===n||e.contains(n)?(n.blur(),!0):!1)}di.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),v(this._fragmentFiber.child,!1,h1,e,void 0,void 0)};function h1(e,n){return e.tag===6||(e=M(e),n.observe(e)),!1}di.prototype.unobserveUsing=function(e){var n=this._observers;if(n!==null&&n.has(e)){n.delete(e),v(this._fragmentFiber.child,!1,p1,e,void 0,void 0);for(var a=n=0;a<Hi.length;a++){var r=Hi[a];r.fragmentInstance===this&&r.observer===e?e.unobserve(r.instance):Hi[n++]=r}Hi.length=n}};function p1(e,n){return e.tag===6||(e=M(e),n.unobserve(e)),!1}var Hi=[],Sh=!1;function m1(e,n,a){Hi.push({fragmentInstance:e,observer:n,instance:a}),Sh||(Sh=!0,T1(function(){Sh=!1;var r=Hi;Hi=[];for(var c=0;c<r.length;c++){var f=r[c];f.observer.unobserve(f.instance)}}))}di.prototype.getClientRects=function(){var e=[];return v(this._fragmentFiber.child,!1,g1,e,void 0,void 0),e};function g1(e,n){if(e.tag===6){e=e.stateNode;var a=e.ownerDocument.createRange();a.selectNodeContents(e),n.push.apply(n,a.getClientRects())}else e=M(e),n.push.apply(n,e.getClientRects());return!1}di.prototype.getRootNode=function(e){var n=S(this._fragmentFiber);return n===null?this:M(n).getRootNode(e)},di.prototype.compareDocumentPosition=function(e){var n=S(this._fragmentFiber);if(n===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var a=[];v(this._fragmentFiber.child,!1,yh,a,void 0,void 0);var r=M(n);if(a.length===0){if(a=r,E(this._fragmentFiber)){e:{for(n=this._fragmentFiber.return;n!==null;){if(n.tag===4){n=n.stateNode.containerInfo;break e}if(n.tag===3||n.tag===5||n.tag===27)break;n=n.return}n=null}n!=null&&(a=n)}n=this._fragmentFiber;var c=r=a.compareDocumentPosition(e);return a===e?c=Node.DOCUMENT_POSITION_CONTAINS:r&Node.DOCUMENT_POSITION_CONTAINED_BY&&(a=b(n)[1],a===null?c=Node.DOCUMENT_POSITION_PRECEDING:(e=M(a).compareDocumentPosition(e),c=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),c|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}n=M(a[0]),c=M(a[a.length-1]);var f=E(this._fragmentFiber)?n.parentElement:r;if(f==null)return Node.DOCUMENT_POSITION_DISCONNECTED;r=f.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_CONTAINED_BY,f=f.compareDocumentPosition(c)&Node.DOCUMENT_POSITION_CONTAINED_BY;var y=n.compareDocumentPosition(e),A=c.compareDocumentPosition(e),F=y&Node.DOCUMENT_POSITION_CONTAINED_BY||A&Node.DOCUMENT_POSITION_CONTAINED_BY;return A=r&&f&&y&Node.DOCUMENT_POSITION_FOLLOWING&&A&Node.DOCUMENT_POSITION_PRECEDING,n=r&&n===e||f&&c===e||F||A?Node.DOCUMENT_POSITION_CONTAINED_BY:!r&&n===e||!f&&c===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:y,n&Node.DOCUMENT_POSITION_DISCONNECTED||n&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||v1(n,this._fragmentFiber,a[0],a[a.length-1],e)?n:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function v1(e,n,a,r,c){var f=Bt(c);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(a=!!f)e:{for(;f!==null;){if(f.tag===7&&(f===n||f.alternate===n)){a=!0;break e}f=f.return}a=!1}return a}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(f===null)return f=c.ownerDocument,c===f||c===f.documentElement||c===f.body;e:{for(f=n,n=S(n);f!==null;){if(!(f.tag!==5&&f.tag!==3&&f.tag!==27||f!==n&&f.alternate!==n)){f=!0;break e}f=f.return}f=!1}return f}return e&Node.DOCUMENT_POSITION_PRECEDING?((n=!!f)&&!(n=f===a)&&(n=H(a,f,V),n===null?n=!1:(v(n,!0,z,f,a),f=_,_=null,n=f!==null)),n):e&Node.DOCUMENT_POSITION_FOLLOWING?((n=!!f)&&!(n=f===r)&&(n=H(r,f,V),n===null?n=!1:(v(n,!0,N,f,r),f=_,L=_=null,n=f!==null)),n):!1}function m_(e,n){var a=e.ownerDocument.createRange();a.selectNodeContents(e),e=a.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,n?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}di.prototype.scrollIntoView=function(e){if(typeof e=="object")throw Error(o(566));var n=[];v(this._fragmentFiber.child,!1,yh,n,void 0,void 0);var a=e!==!1;if(n.length===0){var r=b(this._fragmentFiber);if(r=a?r[1]||r[0]||S(this._fragmentFiber):r[0]||r[1],r===null)return;if(r.tag===6){e=M(r),m_(e,a);return}if(r=M(r),r.nodeType!==9){if(r.nodeType===11){a="host"in r?r.host:null,a!==null&&a.scrollIntoView(e);return}r.scrollIntoView(e)}}for(r=a?n.length-1:0;r!==(a?-1:n.length);){var c=n[r];c.tag===6?(c=M(c),m_(c,a)):M(c).scrollIntoView(e),r+=a?-1:1}};function _1(e,n){return e=M(e),g_(e,n),!1}function g_(e,n){e.reactFragments==null&&(e.reactFragments=new Set),e.reactFragments.add(n)}function v_(e,n){var a=n._eventListeners;if(a!==null)for(var r=0;r<a.length;r++){var c=a[r];e.addEventListener(c.type,c.attachedListener,Yr(c.optionsOrUseCapture))}e.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(f){for(var y=0,A=0;A<Hi.length;A++){var F=Hi[A];(F.fragmentInstance!==n||F.observer!==f||F.instance!==e)&&(Hi[y++]=F)}Hi.length=y,f.observe(e)}),g_(e,n))}function x1(e,n){var a=n._eventListeners;if(a!==null)for(var r=0;r<a.length;r++){var c=a[r];e.removeEventListener(c.type,c.attachedListener,Yr(c.optionsOrUseCapture))}e.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(f){typeof f.rootMargin=="string"?m1(n,f,e):f.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(n))}function Mh(e){var n=e.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":Mh(a),ot(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function y1(e,n,a,r){for(;e.nodeType===1;){var c=a;if(e.nodeName.toLowerCase()!==n.toLowerCase()){if(!r&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(r){if(!e[It])switch(n){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(f=e.getAttribute("rel"),f==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(f!==c.rel||e.getAttribute("href")!==(c.href==null||c.href===""?null:c.href)||e.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin)||e.getAttribute("title")!==(c.title==null?null:c.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(f=e.getAttribute("src"),(f!==(c.src==null?null:c.src)||e.getAttribute("type")!==(c.type==null?null:c.type)||e.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin))&&f&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(n==="input"&&e.type==="hidden"){var f=c.name==null?null:""+c.name;if(c.type==="hidden"&&e.getAttribute("name")===f)return e}else return e;if(e=Ai(e.nextSibling),e===null)break}return null}function S1(e,n,a){if(n==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=Ai(e.nextSibling),e===null))return null;return e}function __(e,n){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Ai(e.nextSibling),e===null))return null;return e}function Eh(e){return e.data==="$?"||e.data==="$~"}function Th(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function M1(e,n){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=n;else if(e.data!=="$?"||a.readyState!=="loading")n();else{var r=function(){n(),a.removeEventListener("DOMContentLoaded",r)};a.addEventListener("DOMContentLoaded",r),e._reactRetry=r}}function Ai(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return e}var bh=null;function x_(e){e=e.nextSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(n===0)return Ai(e.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}e=e.nextSibling}return null}function y_(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return e;n--}else a!=="/$"&&a!=="/&"||n++}e=e.previousSibling}return null}function E1(e,n){function a(){r=!0}if(e.ownerDocument.activeElement===e)return!0;var r=!1;try{e.ownerDocument.addEventListener("focus",a,!0),(e.focus||HTMLElement.prototype.focus).call(e,n)}finally{e.ownerDocument.removeEventListener("focus",a,!0)}return r}function T1(e){r_(function(){r_(function(n){return e(n)})})}function S_(e,n,a){switch(n=gl(a),e){case"html":if(e=n.documentElement,!e)throw Error(o(452));return e;case"head":if(e=n.head,!e)throw Error(o(453));return e;case"body":if(e=n.body,!e)throw Error(o(454));return e;default:throw Error(o(451))}}function M_(e,n,a){for(var r in a){var c=a[r];a.hasOwnProperty(r)&&c!=null&&kt(e,n,r,null,$M,c)}a.dangerouslySetInnerHTML!=null&&(e.textContent=""),e.onclick===Qi&&(e.onclick=null),ot(e)}function Ah(e){for(var n=e.attributes;n.length;)e.removeAttributeNode(n[0]);ot(e)}var Ci=new Map,E_=new Set;function vl(e){if(typeof e.getRootNode=="function"){var n=e.getRootNode();if(n.nodeType===9||n.nodeType===11)return n}return e.nodeType===9?e:e.ownerDocument}var Ra=Xe.d;Xe.d={f:b1,r:A1,D:C1,C:R1,L:w1,m:N1,X:U1,S:D1,M:L1};function b1(){var e=Ra.f(),n=$c();return e||n}function A1(e){var n=yt(e);n!==null&&n.tag===5&&n.type==="form"?b0(n):Ra.r(e)}var Wr=typeof document>"u"?null:document;function T_(e,n,a){var r=Wr;if(r&&typeof n=="string"&&n){var c=xi(n);c='link[rel="'+e+'"][href="'+c+'"]',typeof a=="string"&&(c+='[crossorigin="'+a+'"]'),E_.has(c)||(E_.add(c),e={rel:e,crossOrigin:a,href:n},r.querySelector(c)===null&&(n=r.createElement("link"),Dn(n,"link",e),zt(n),r.head.appendChild(n)))}}function C1(e){Ra.D(e),T_("dns-prefetch",e,null)}function R1(e,n){Ra.C(e,n),T_("preconnect",e,n)}function w1(e,n,a){Ra.L(e,n,a);var r=Wr;if(r&&e&&n){var c='link[rel="preload"][as="'+xi(n)+'"]';n==="image"&&a&&a.imageSrcSet?(c+='[imagesrcset="'+xi(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(c+='[imagesizes="'+xi(a.imageSizes)+'"]')):c+='[href="'+xi(e)+'"]';var f=c;switch(n){case"style":f=Zr(e);break;case"script":f=Kr(e)}if(!(Ci.has(f)||(e=I({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:e,as:n},a),Ci.set(f,e),r.querySelector(c)!==null||n==="style"&&r.querySelector(_l(f))||n==="script"&&r.querySelector(xl(f))))){var y=r.createElement("link");Dn(y,"link",e),n==="style"&&(y[Ot]=!0,y.onload=y.onerror=function(){ja(y)}),zt(y),r.head.appendChild(y)}}}function N1(e,n){Ra.m(e,n);var a=Wr;if(a&&e){var r=n&&typeof n.as=="string"?n.as:"script",c='link[rel="modulepreload"][as="'+xi(r)+'"][href="'+xi(e)+'"]',f=c;switch(r){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=Kr(e)}if(!Ci.has(f)&&(e=I({rel:"modulepreload",href:e},n),Ci.set(f,e),a.querySelector(c)===null)){switch(r){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(xl(f)))return}r=a.createElement("link"),Dn(r,"link",e),zt(r),a.head.appendChild(r)}}}function D1(e,n,a){Ra.S(e,n,a);var r=Wr;if(r&&e){var c=ai(r).hoistableStyles,f=Zr(e);n=n||"default";var y=c.get(f);if(!y){var A={loading:0,preload:null};if(y=r.querySelector(_l(f)))A.loading=5;else{e=I({rel:"stylesheet",href:e,"data-precedence":n},a),(a=Ci.get(f))&&Ch(e,a);var F=y=r.createElement("link");zt(F),Dn(F,"link",e),F._p=new Promise(function(J,le){F.onload=J,F.onerror=le}),F.addEventListener("load",function(){A.loading|=1}),F.addEventListener("error",function(){A.loading|=2}),A.loading|=4,ru(y,n,r)}y={type:"stylesheet",instance:y,count:1,state:A},c.set(f,y)}}}function U1(e,n){Ra.X(e,n);var a=Wr;if(a&&e){var r=ai(a).hoistableScripts,c=Kr(e),f=r.get(c);f||(f=a.querySelector(xl(c)),f||(e=I({src:e,async:!0},n),(n=Ci.get(c))&&Rh(e,n),f=a.createElement("script"),zt(f),Dn(f,"link",e),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},r.set(c,f))}}function L1(e,n){Ra.M(e,n);var a=Wr;if(a&&e){var r=ai(a).hoistableScripts,c=Kr(e),f=r.get(c);f||(f=a.querySelector(xl(c)),f||(e=I({src:e,async:!0,type:"module"},n),(n=Ci.get(c))&&Rh(e,n),f=a.createElement("script"),zt(f),Dn(f,"link",e),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},r.set(c,f))}}function b_(e,n,a,r){var c=(c=it.current)?vl(c):null;if(!c)throw Error(o(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(a=Zr(a.href),n=ai(c).hoistableStyles,r=n.get(a),r||(r={type:"style",instance:null,count:0,state:null},n.set(a,r)),r):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=Zr(a.href);var f=ai(c).hoistableStyles,y=f.get(e);if(y||(c=c.ownerDocument||c,y={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(e,y),(f=c.querySelector(_l(e)))?f._p||(y.instance=f,y.state.loading=5):(f=Ci.get(e),f||(f={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Ci.set(e,f)),O1(c,e,f,y.state))),n&&r===null)throw Error(o(528,""));return y}if(n&&r!==null)throw Error(o(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(a=Kr(a),n=ai(c).hoistableScripts,r=n.get(a),r||(r={type:"script",instance:null,count:0,state:null},n.set(a,r)),r):{type:"void",instance:null,count:0,state:null};default:throw Error(o(444,e))}}function Zr(e){return'href="'+xi(e)+'"'}function _l(e){return'link[rel="stylesheet"]['+e+"]"}function A_(e){return I({},e,{"data-precedence":e.precedence,precedence:null})}function O1(e,n,a,r){if(n=e.querySelector('link[rel="preload"][as="style"]['+n+"]")){if(n[Ot]!==!0){r.loading=1;return}}else n=e.createElement("link"),n[Ot]=!0,n.onload=n.onerror=ja.bind(null,n),Dn(n,"link",a),zt(n),e.head.appendChild(n);r.preload=n,n.addEventListener("load",function(){return r.loading|=1}),n.addEventListener("error",function(){return r.loading|=2})}function Kr(e){return'[src="'+xi(e)+'"]'}function xl(e){return"script[async]"+e}function C_(e,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var r=e.querySelector('style[data-href~="'+xi(a.href)+'"]');if(r)return n.instance=r,zt(r),r;var c=I({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement("style"),zt(r),Dn(r,"style",c),ru(r,a.precedence,e),n.instance=r;case"stylesheet":c=Zr(a.href);var f=e.querySelector(_l(c));if(f)return n.state.loading|=4,n.instance=f,zt(f),f;r=A_(a),(c=Ci.get(c))&&Ch(r,c),f=(e.ownerDocument||e).createElement("link"),zt(f);var y=f;return y._p=new Promise(function(A,F){y.onload=A,y.onerror=F}),Dn(f,"link",r),n.state.loading|=4,ru(f,a.precedence,e),n.instance=f;case"script":return f=Kr(a.src),(c=e.querySelector(xl(f)))?(n.instance=c,zt(c),c):(r=a,(c=Ci.get(f))&&(r=I({},a),Rh(r,c)),e=e.ownerDocument||e,c=e.createElement("script"),zt(c),Dn(c,"link",r),e.head.appendChild(c),n.instance=c);case"void":return null;default:throw Error(o(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(r=n.instance,n.state.loading|=4,ru(r,a.precedence,e));return n.instance}function ru(e,n,a){for(var r=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),c=r.length?r[r.length-1]:null,f=c,y=0;y<r.length;y++){var A=r[y];if(A.dataset.precedence===n)f=A;else if(f!==c)break}f?f.parentNode.insertBefore(e,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(e,n.firstChild))}function Ch(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.title==null&&(e.title=n.title)}function Rh(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.integrity==null&&(e.integrity=n.integrity)}var ou=null;function R_(e,n,a){if(ou===null){var r=new Map,c=ou=new Map;c.set(a,r)}else c=ou,r=c.get(a),r||(r=new Map,c.set(a,r));if(r.has(e))return r;for(r.set(e,null),a=a.getElementsByTagName(e),c=0;c<a.length;c++){var f=a[c];if(!(f[It]||f[Pe]||e==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var y=f.getAttribute(n)||"";y=e+y;var A=r.get(y);A?A.push(f):r.set(y,[f])}}return r}function wh(e,n,a){e=e.ownerDocument||e,e.head.insertBefore(a,n==="title"?e.querySelector("head > title"):null)}function z1(e,n,a){if(a===1||n.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;switch(n.rel){case"stylesheet":return e=n.disabled,typeof n.precedence=="string"&&e==null;default:return!0}case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function w_(e,n){return e==="img"&&n.src!=null&&n.src!==""&&n.onLoad==null&&n.loading!=="lazy"}function N_(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function D_(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function U_(e,n){typeof n.decode=="function"&&(e.imgCount++,n.complete||(e.imgBytes+=D_(n),e.suspenseyImages.push(n)),e=B1.bind(e),n.decode().then(e,e))}function P1(e,n,a,r){if(a.type==="stylesheet"&&(typeof r.media!="string"||matchMedia(r.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var c=Zr(r.href),f=n.querySelector(_l(c));if(f){n=f._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(e.count++,e=yl.bind(e),n.then(e,e)),a.state.loading|=4,a.instance=f,zt(f);return}f=n.ownerDocument||n,r=A_(r),(c=Ci.get(c))&&Ch(r,c),f=f.createElement("link"),zt(f);var y=f;y._p=new Promise(function(A,F){y.onload=A,y.onerror=F}),Dn(f,"link",r),a.instance=f}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=yl.bind(e),n.addEventListener("load",a),n.addEventListener("error",a))}}var lu=0;function I1(e,n){return e.stylesheets&&e.count===0&&uu(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var r=setTimeout(function(){if(e.stylesheets&&uu(e,e.stylesheets),e.unsuspend){var f=e.unsuspend;e.unsuspend=null,f()}},6e4+n);0<e.imgBytes&&lu===0&&(lu=62500*t1());var c=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&uu(e,e.stylesheets),e.unsuspend)){var f=e.unsuspend;e.unsuspend=null,f()}},(e.imgBytes>lu?50:800)+n);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(c)}}:null}function L_(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)uu(e,e.stylesheets);else if(e.unsuspend){var n=e.unsuspend;e.unsuspend=null,n()}}}function yl(){this.count--,L_(this)}function B1(){this.imgCount--,L_(this)}var cu=null;function uu(e,n){e.stylesheets=null,e.unsuspend!==null&&(e.count++,cu=new Map,n.forEach(F1,e),cu=null,yl.call(e))}function F1(e,n){if(!(n.state.loading&4)){var a=cu.get(e);if(a)var r=a.get(null);else{a=new Map,cu.set(e,a);for(var c=e.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<c.length;f++){var y=c[f];(y.nodeName==="LINK"||y.getAttribute("media")!=="not all")&&(a.set(y.dataset.precedence,y),r=y)}r&&a.set(null,r)}c=n.instance,y=c.getAttribute("data-precedence"),f=a.get(y)||r,f===r&&a.set(null,c),a.set(y,c),this.count++,r=yl.bind(this),c.addEventListener("load",r),c.addEventListener("error",r),f?f.parentNode.insertBefore(c,f.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(c,e.firstChild)),n.state.loading|=4}}var Qr={$$typeof:B,Provider:null,Consumer:null,_currentValue:D,_currentValue2:D,_threadCount:0};function H1(e,n,a,r,c,f,y,A,F){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=zo(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=zo(0),this.hiddenUpdates=zo(null),this.identifierPrefix=r,this.onUncaughtError=c,this.onCaughtError=f,this.onRecoverableError=y,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=F,this.transitionTypes=null,this.incompleteTransitions=new Map}function O_(e,n,a,r,c,f,y,A,F,J,le,ge){return e=new H1(e,n,a,y,F,J,le,ge,A),n=1,f===!0&&(n|=24),f=Zn(3,null,null,n),e.current=f,f.stateNode=e,n=kf(),n.refCount++,e.pooledCache=n,n.refCount++,f.memoizedState={element:r,isDehydrated:a,cache:n},Wf(f),e}function z_(e){return e?(e=Er,e):Er}function P_(e,n,a,r,c,f){c=z_(c),r.context===null?r.context=c:r.pendingContext=c,r=Ka(n),r.payload={element:a},f=f===void 0?null:f,f!==null&&(r.callback=f),a=Qa(e,r,n),a!==null&&($n(a,e,n),Qo(a,e,n))}function I_(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<n?a:n}}function Nh(e,n){I_(e,n),(e=e.alternate)&&I_(e,n)}function B_(e){if(e.tag===13||e.tag===31){var n=zs(e,67108864);n!==null&&$n(n,e,67108864),Nh(e,67108864)}}function F_(e){if(e.tag===13||e.tag===31){var n=fi();n=fe(n);var a=zs(e,n);a!==null&&$n(a,e,n),Nh(e,n)}}var Jr=!0;function j1(e,n,a,r){var c=Te.T;Te.T=null;var f=Xe.p;try{Xe.p=2,Dh(e,n,a,r)}finally{Xe.p=f,Te.T=c}}function G1(e,n,a,r){var c=Te.T;Te.T=null;var f=Xe.p;try{Xe.p=8,Dh(e,n,a,r)}finally{Xe.p=f,Te.T=c}}function Dh(e,n,a,r){if(Jr){var c=Uh(r);if(c===null)dh(e,n,r,fu,a),j_(e,r);else if(k1(c,e,n,a,r))r.stopPropagation();else if(j_(e,r),n&4&&-1<V1.indexOf(e)){for(;c!==null;){var f=yt(c);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var y=_i(f.pendingLanes);if(y!==0){var A=f;for(A.pendingLanes|=2,A.entangledLanes|=2;y;){var F=1<<31-zn(y);A.entanglements[1]|=F,y&=~F}oa(f),(Ft&6)===0&&(Kc=W()+500,hl(0))}}break;case 31:case 13:A=zs(f,2),A!==null&&$n(A,f,2),$c(),Nh(f,2)}if(f=Uh(r),f===null&&dh(e,n,r,fu,a),f===c)break;c=f}c!==null&&r.stopPropagation()}else dh(e,n,r,null,a)}}function Uh(e){return e=vf(e),Lh(e)}var fu=null;function Lh(e){if(fu=null,e=Bt(e),e!==null){var n=u(e);if(n===null)e=null;else{var a=n.tag;if(a===13){if(e=h(n),e!==null)return e;e=null}else if(a===31){if(e=p(n),e!==null)return e;e=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null)}}return fu=e,null}function H_(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(we()){case Ie:return 2;case Ke:return 8;case be:case ye:return 32;case nt:return 268435456;default:return 32}default:return 32}}var Oh=!1,cs=null,us=null,fs=null,Sl=new Map,Ml=new Map,ds=[],V1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function j_(e,n){switch(e){case"focusin":case"focusout":cs=null;break;case"dragenter":case"dragleave":us=null;break;case"mouseover":case"mouseout":fs=null;break;case"pointerover":case"pointerout":Sl.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ml.delete(n.pointerId)}}function El(e,n,a,r,c,f){return e===null||e.nativeEvent!==f?(e={blockedOn:n,domEventName:a,eventSystemFlags:r,nativeEvent:f,targetContainers:[c]},n!==null&&(n=yt(n),n!==null&&B_(n)),e):(e.eventSystemFlags|=r,n=e.targetContainers,c!==null&&n.indexOf(c)===-1&&n.push(c),e)}function k1(e,n,a,r,c){switch(n){case"focusin":return cs=El(cs,e,n,a,r,c),!0;case"dragenter":return us=El(us,e,n,a,r,c),!0;case"mouseover":return fs=El(fs,e,n,a,r,c),!0;case"pointerover":var f=c.pointerId;return Sl.set(f,El(Sl.get(f)||null,e,n,a,r,c)),!0;case"gotpointercapture":return f=c.pointerId,Ml.set(f,El(Ml.get(f)||null,e,n,a,r,c)),!0}return!1}function G_(e){var n=Bt(e.target);if(n!==null){var a=u(n);if(a!==null){if(n=a.tag,n===13){if(n=h(a),n!==null){e.blockedOn=n,je(e.priority,function(){F_(a)});return}}else if(n===31){if(n=p(a),n!==null){e.blockedOn=n,je(e.priority,function(){F_(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function du(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var a=Uh(e.nativeEvent);if(a===null){a=e.nativeEvent;var r=new a.constructor(a.type,a);gf=r,a.target.dispatchEvent(r),gf=null}else return n=yt(a),n!==null&&B_(n),e.blockedOn=a,!1;n.shift()}return!0}function V_(e,n,a){du(e)&&a.delete(n)}function X1(){Oh=!1,cs!==null&&du(cs)&&(cs=null),us!==null&&du(us)&&(us=null),fs!==null&&du(fs)&&(fs=null),Sl.forEach(V_),Ml.forEach(V_)}function hu(e,n){e.blockedOn===n&&(e.blockedOn=null,Oh||(Oh=!0,s.unstable_scheduleCallback(s.unstable_NormalPriority,X1)))}var pu=null;function k_(e){pu!==e&&(pu=e,s.unstable_scheduleCallback(s.unstable_NormalPriority,function(){pu===e&&(pu=null);for(var n=0;n<e.length;n+=3){var a=e[n],r=e[n+1],c=e[n+2];if(typeof r!="function"){if(Lh(r||a)===null)continue;break}var f=yt(a);f!==null&&(e.splice(n,3),n-=3,md(f,{pending:!0,data:c,method:a.method,action:r},r,c))}}))}function $r(e){function n(F){return hu(F,e)}cs!==null&&hu(cs,e),us!==null&&hu(us,e),fs!==null&&hu(fs,e),Sl.forEach(n),Ml.forEach(n);for(var a=0;a<ds.length;a++){var r=ds[a];r.blockedOn===e&&(r.blockedOn=null)}for(;0<ds.length&&(a=ds[0],a.blockedOn===null);)G_(a),a.blockedOn===null&&ds.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(r=0;r<a.length;r+=3){var c=a[r],f=a[r+1],y=c[et]||null;if(typeof f=="function")y||k_(a);else if(y){var A=null;if(f&&f.hasAttribute("formAction")){if(c=f,y=f[et]||null)A=y.formAction;else if(Lh(c)!==null)continue}else A=y.action;typeof A=="function"?a[r+1]=A:(a.splice(r,3),r-=3),k_(a)}}}function X_(){function e(f){f.canIntercept&&f.info==="react-transition"&&f.intercept({handler:function(){return new Promise(function(y){return c=y})},focusReset:"manual",scroll:"manual"})}function n(){c!==null&&(c(),c=null),r||setTimeout(a,20)}function a(){if(!r&&!navigation.transition){var f=navigation.currentEntry;f&&f.url!=null&&navigation.navigate(f.url,{state:f.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var r=!1,c=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){r=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),c!==null&&(c(),c=null)}}}function zh(e){this._internalRoot=e}mu.prototype.render=zh.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(o(409));var a=n.current,r=fi();P_(a,r,e,n,null,null)},mu.prototype.unmount=zh.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;P_(e.current,2,null,e,null,null),$c(),n[ct]=null}};function mu(e){this._internalRoot=e}mu.prototype.unstable_scheduleHydration=function(e){if(e){var n=Re();e={blockedOn:null,target:e,priority:n};for(var a=0;a<ds.length&&n!==0&&n<ds[a].priority;a++);ds.splice(a,0,e),a===0&&G_(e)}};var q_=t.version;if(q_!=="19.3.1")throw Error(o(527,q_,"19.3.1"));Xe.findDOMNode=function(e){var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(o(188)):(e=Object.keys(e).join(","),Error(o(268,e)));return e=g(n),e=e!==null?x(e):null,e=e===null?null:e.stateNode,e};var q1={bundleType:0,version:"19.3.1",rendererPackageName:"react-dom",currentDispatcherRef:Te,reconcilerVersion:"19.3.1"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var gu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!gu.isDisabled&&gu.supportsFiber)try{Ct=gu.inject(q1),nn=gu}catch{}}return bl.createRoot=function(e,n){if(!l(e))throw Error(o(299));var a=!1,r="",c=z0,f=P0,y=I0;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(r=n.identifierPrefix),n.onUncaughtError!==void 0&&(c=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(y=n.onRecoverableError)),n=O_(e,1,!1,null,null,a,r,null,c,f,y,X_),e[ct]=n.current,fh(e),new zh(n)},bl.hydrateRoot=function(e,n,a){if(!l(e))throw Error(o(299));var r=!1,c="",f=z0,y=P0,A=I0,F=null;return a!=null&&(a.unstable_strictMode===!0&&(r=!0),a.identifierPrefix!==void 0&&(c=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(y=a.onCaughtError),a.onRecoverableError!==void 0&&(A=a.onRecoverableError),a.formState!==void 0&&(F=a.formState)),n=O_(e,1,!0,n,a??null,r,c,F,f,y,A,X_),n.context=z_(null),a=n.current,r=fi(),r=fe(r),c=Ka(r),c.callback=null,Qa(a,c,r),a=r,n.current.lanes=a,Us(n,a),oa(n),e[ct]=n.current,fh(e),new mu(n)},bl.version="19.3.1",bl}var nx;function nE(){if(nx)return Bh.exports;nx=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(t){console.error(t)}}return s(),Bh.exports=tE(),Bh.exports}var iE=nE();const aE=fy(iE);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sE=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),hy=(...s)=>s.filter((t,i,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===i).join(" ").trim();/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var rE={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oE=ze.forwardRef(({color:s="currentColor",size:t=24,strokeWidth:i=2,absoluteStrokeWidth:o,className:l="",children:u,iconNode:h,...p},m)=>ze.createElement("svg",{ref:m,...rE,width:t,height:t,stroke:s,strokeWidth:o?Number(i)*24/Number(t):i,className:hy("lucide",l),...p},[...h.map(([g,x])=>ze.createElement(g,x)),...Array.isArray(u)?u:[u]]));/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mt=(s,t)=>{const i=ze.forwardRef(({className:o,...l},u)=>ze.createElement(oE,{ref:u,iconNode:t,className:hy(`lucide-${sE(s)}`,o),...l}));return i.displayName=`${s}`,i};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lE=Mt("ArrowDownLeft",[["path",{d:"M17 7 7 17",key:"15tmo1"}],["path",{d:"M17 17H7V7",key:"1org7z"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const go=Mt("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cE=Mt("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ix=Mt("Bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uE=Mt("BookOpen",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fa=Mt("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fE=Mt("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ms=Mt("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dE=Mt("CircleHelp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hE=Mt("Clock3",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16.5 12",key:"1aq6pp"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const py=Mt("Coins",[["circle",{cx:"8",cy:"8",r:"6",key:"3yglwk"}],["path",{d:"M18.09 10.37A6 6 0 1 1 10.34 18",key:"t5s6rm"}],["path",{d:"M7 6h1v4",key:"1obek4"}],["path",{d:"m16.71 13.88.7.71-2.82 2.82",key:"1rbuyh"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tp=Mt("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const my=Mt("FileCheck2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",key:"1pf5j1"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"m3 15 2 2 4-4",key:"1lhrkk"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bp=Mt("Fingerprint",[["path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",key:"1nerag"}],["path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88",key:"o46ks0"}],["path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02",key:"ptglia"}],["path",{d:"M2 12a10 10 0 0 1 18-6",key:"ydlgp0"}],["path",{d:"M2 16h.01",key:"1gqxmh"}],["path",{d:"M21.8 16c.2-2 .131-5.354 0-6",key:"drycrb"}],["path",{d:"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",key:"1tidbn"}],["path",{d:"M8.65 22c.21-.66.45-1.32.57-2",key:"13wd9y"}],["path",{d:"M9 6.8a6 6 0 0 1 9 5.2v2",key:"1fr1j5"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pE=Mt("Flag",[["path",{d:"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z",key:"i9b6wo"}],["line",{x1:"4",x2:"4",y1:"22",y2:"15",key:"1cm3nv"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mE=Mt("FlipHorizontal2",[["path",{d:"m3 7 5 5-5 5V7",key:"couhi7"}],["path",{d:"m21 7-5 5 5 5V7",key:"6ouia7"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 14v2",key:"8jcxud"}],["path",{d:"M12 8v2",key:"1woqiv"}],["path",{d:"M12 2v2",key:"tus03m"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gE=Mt("Hand",[["path",{d:"M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2",key:"1fvzgz"}],["path",{d:"M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2",key:"1kc0my"}],["path",{d:"M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8",key:"10h0bg"}],["path",{d:"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",key:"1s1gnw"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ax=Mt("LayoutGrid",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gy=Mt("Leaf",[["path",{d:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",key:"nnexq3"}],["path",{d:"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",key:"mt58a7"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vE=Mt("Maximize",[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3",key:"1dcmit"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3",key:"1e4gt3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3",key:"wsl5sc"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3",key:"18trek"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _E=Mt("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Em=Mt("Minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vy=Mt("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _o=Mt("Package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["path",{d:"m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7",key:"yx3hmr"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _y=Mt("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ap=Mt("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xE=Mt("RotateCw",[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yE=Mt("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xy=Mt("ScanLine",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["path",{d:"M7 12h10",key:"b7w52i"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sx=Mt("ScrollText",[["path",{d:"M15 12h-5",key:"r7krc0"}],["path",{d:"M15 8h-5",key:"1khuty"}],["path",{d:"M19 17V5a2 2 0 0 0-2-2H4",key:"zz82l3"}],["path",{d:"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",key:"1ph1d7"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const SE=Mt("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ME=Mt("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const EE=Mt("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const TE=Mt("Store",[["path",{d:"m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7",key:"ztvudi"}],["path",{d:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",key:"1b2hhj"}],["path",{d:"M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4",key:"2ebpfo"}],["path",{d:"M2 7h20",key:"1fcdvo"}],["path",{d:"M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7",key:"6c3vgh"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bE=Mt("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const AE=Mt("Volume2",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const CE=Mt("VolumeX",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yy=Mt("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vu=Mt("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Tm="180",RE=0,rx=1,wE=2,Sy=1,NE=2,Oa=3,Cs=0,ii=1,ca=2,Pa=0,xo=1,Cp=2,ox=3,lx=4,DE=5,lr=100,UE=101,LE=102,OE=103,zE=104,PE=200,IE=201,BE=202,FE=203,Rp=204,wp=205,HE=206,jE=207,GE=208,VE=209,kE=210,XE=211,qE=212,YE=213,WE=214,Np=0,Dp=1,Up=2,Eo=3,Lp=4,Op=5,zp=6,Pp=7,My=0,ZE=1,KE=2,Es=0,Ey=1,Ty=2,by=3,bm=4,Ay=5,Cy=6,Ry=7,wy=300,To=301,bo=302,Ip=303,Bp=304,sf=306,Fp=1e3,ur=1001,Hp=1002,Li=1003,QE=1004,vu=1005,Xi=1006,Gh=1007,fr=1008,fa=1009,Ny=1010,Dy=1011,Pl=1012,Am=1013,hr=1014,za=1015,Ia=1016,Cm=1017,Rm=1018,Il=1020,Uy=35902,Ly=35899,Oy=1021,zy=1022,qi=1023,Bl=1026,Fl=1027,Py=1028,wm=1029,Iy=1030,Nm=1031,Dm=1033,ku=33776,Xu=33777,qu=33778,Yu=33779,jp=35840,Gp=35841,Vp=35842,kp=35843,Xp=36196,qp=37492,Yp=37496,Wp=37808,Zp=37809,Kp=37810,Qp=37811,Jp=37812,$p=37813,em=37814,tm=37815,nm=37816,im=37817,am=37818,sm=37819,rm=37820,om=37821,lm=36492,cm=36494,um=36495,fm=36283,dm=36284,hm=36285,pm=36286,JE=3200,$E=3201,By=0,eT=1,Ss="",ti="srgb",Ao="srgb-linear",Ju="linear",Xt="srgb",eo=7680,cx=519,tT=512,nT=513,iT=514,Fy=515,aT=516,sT=517,rT=518,oT=519,ux=35044,fx="300 es",ua=2e3,$u=2001;class wo{addEventListener(t,i){this._listeners===void 0&&(this._listeners={});const o=this._listeners;o[t]===void 0&&(o[t]=[]),o[t].indexOf(i)===-1&&o[t].push(i)}hasEventListener(t,i){const o=this._listeners;return o===void 0?!1:o[t]!==void 0&&o[t].indexOf(i)!==-1}removeEventListener(t,i){const o=this._listeners;if(o===void 0)return;const l=o[t];if(l!==void 0){const u=l.indexOf(i);u!==-1&&l.splice(u,1)}}dispatchEvent(t){const i=this._listeners;if(i===void 0)return;const o=i[t.type];if(o!==void 0){t.target=this;const l=o.slice(0);for(let u=0,h=l.length;u<h;u++)l[u].call(this,t);t.target=null}}}const Bn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Vh=Math.PI/180,mm=180/Math.PI;function kl(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0,o=Math.random()*4294967295|0;return(Bn[s&255]+Bn[s>>8&255]+Bn[s>>16&255]+Bn[s>>24&255]+"-"+Bn[t&255]+Bn[t>>8&255]+"-"+Bn[t>>16&15|64]+Bn[t>>24&255]+"-"+Bn[i&63|128]+Bn[i>>8&255]+"-"+Bn[i>>16&255]+Bn[i>>24&255]+Bn[o&255]+Bn[o>>8&255]+Bn[o>>16&255]+Bn[o>>24&255]).toLowerCase()}function Dt(s,t,i){return Math.max(t,Math.min(i,s))}function lT(s,t){return(s%t+t)%t}function kh(s,t,i){return(1-i)*s+i*t}function Al(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function ei(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class pt{constructor(t=0,i=0){pt.prototype.isVector2=!0,this.x=t,this.y=i}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,i){return this.x=t,this.y=i,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const i=this.x,o=this.y,l=t.elements;return this.x=l[0]*i+l[3]*o+l[6],this.y=l[1]*i+l[4]*o+l[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,i){return this.x=Dt(this.x,t.x,i.x),this.y=Dt(this.y,t.y,i.y),this}clampScalar(t,i){return this.x=Dt(this.x,t,i),this.y=Dt(this.y,t,i),this}clampLength(t,i){const o=this.length();return this.divideScalar(o||1).multiplyScalar(Dt(o,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const o=this.dot(t)/i;return Math.acos(Dt(o,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,o=this.y-t.y;return i*i+o*o}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this}lerpVectors(t,i,o){return this.x=t.x+(i.x-t.x)*o,this.y=t.y+(i.y-t.y)*o,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this}rotateAround(t,i){const o=Math.cos(i),l=Math.sin(i),u=this.x-t.x,h=this.y-t.y;return this.x=u*o-h*l+t.x,this.y=u*l+h*o+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Xl{constructor(t=0,i=0,o=0,l=1){this.isQuaternion=!0,this._x=t,this._y=i,this._z=o,this._w=l}static slerpFlat(t,i,o,l,u,h,p){let m=o[l+0],g=o[l+1],x=o[l+2],v=o[l+3];const S=u[h+0],E=u[h+1],b=u[h+2],T=u[h+3];if(p===0){t[i+0]=m,t[i+1]=g,t[i+2]=x,t[i+3]=v;return}if(p===1){t[i+0]=S,t[i+1]=E,t[i+2]=b,t[i+3]=T;return}if(v!==T||m!==S||g!==E||x!==b){let M=1-p;const _=m*S+g*E+x*b+v*T,L=_>=0?1:-1,z=1-_*_;if(z>Number.EPSILON){const V=Math.sqrt(z),H=Math.atan2(V,_*L);M=Math.sin(M*H)/V,p=Math.sin(p*H)/V}const N=p*L;if(m=m*M+S*N,g=g*M+E*N,x=x*M+b*N,v=v*M+T*N,M===1-p){const V=1/Math.sqrt(m*m+g*g+x*x+v*v);m*=V,g*=V,x*=V,v*=V}}t[i]=m,t[i+1]=g,t[i+2]=x,t[i+3]=v}static multiplyQuaternionsFlat(t,i,o,l,u,h){const p=o[l],m=o[l+1],g=o[l+2],x=o[l+3],v=u[h],S=u[h+1],E=u[h+2],b=u[h+3];return t[i]=p*b+x*v+m*E-g*S,t[i+1]=m*b+x*S+g*v-p*E,t[i+2]=g*b+x*E+p*S-m*v,t[i+3]=x*b-p*v-m*S-g*E,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,i,o,l){return this._x=t,this._y=i,this._z=o,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,i=!0){const o=t._x,l=t._y,u=t._z,h=t._order,p=Math.cos,m=Math.sin,g=p(o/2),x=p(l/2),v=p(u/2),S=m(o/2),E=m(l/2),b=m(u/2);switch(h){case"XYZ":this._x=S*x*v+g*E*b,this._y=g*E*v-S*x*b,this._z=g*x*b+S*E*v,this._w=g*x*v-S*E*b;break;case"YXZ":this._x=S*x*v+g*E*b,this._y=g*E*v-S*x*b,this._z=g*x*b-S*E*v,this._w=g*x*v+S*E*b;break;case"ZXY":this._x=S*x*v-g*E*b,this._y=g*E*v+S*x*b,this._z=g*x*b+S*E*v,this._w=g*x*v-S*E*b;break;case"ZYX":this._x=S*x*v-g*E*b,this._y=g*E*v+S*x*b,this._z=g*x*b-S*E*v,this._w=g*x*v+S*E*b;break;case"YZX":this._x=S*x*v+g*E*b,this._y=g*E*v+S*x*b,this._z=g*x*b-S*E*v,this._w=g*x*v-S*E*b;break;case"XZY":this._x=S*x*v-g*E*b,this._y=g*E*v-S*x*b,this._z=g*x*b+S*E*v,this._w=g*x*v+S*E*b;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+h)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,i){const o=i/2,l=Math.sin(o);return this._x=t.x*l,this._y=t.y*l,this._z=t.z*l,this._w=Math.cos(o),this._onChangeCallback(),this}setFromRotationMatrix(t){const i=t.elements,o=i[0],l=i[4],u=i[8],h=i[1],p=i[5],m=i[9],g=i[2],x=i[6],v=i[10],S=o+p+v;if(S>0){const E=.5/Math.sqrt(S+1);this._w=.25/E,this._x=(x-m)*E,this._y=(u-g)*E,this._z=(h-l)*E}else if(o>p&&o>v){const E=2*Math.sqrt(1+o-p-v);this._w=(x-m)/E,this._x=.25*E,this._y=(l+h)/E,this._z=(u+g)/E}else if(p>v){const E=2*Math.sqrt(1+p-o-v);this._w=(u-g)/E,this._x=(l+h)/E,this._y=.25*E,this._z=(m+x)/E}else{const E=2*Math.sqrt(1+v-o-p);this._w=(h-l)/E,this._x=(u+g)/E,this._y=(m+x)/E,this._z=.25*E}return this._onChangeCallback(),this}setFromUnitVectors(t,i){let o=t.dot(i)+1;return o<1e-8?(o=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=o):(this._x=0,this._y=-t.z,this._z=t.y,this._w=o)):(this._x=t.y*i.z-t.z*i.y,this._y=t.z*i.x-t.x*i.z,this._z=t.x*i.y-t.y*i.x,this._w=o),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Dt(this.dot(t),-1,1)))}rotateTowards(t,i){const o=this.angleTo(t);if(o===0)return this;const l=Math.min(1,i/o);return this.slerp(t,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,i){const o=t._x,l=t._y,u=t._z,h=t._w,p=i._x,m=i._y,g=i._z,x=i._w;return this._x=o*x+h*p+l*g-u*m,this._y=l*x+h*m+u*p-o*g,this._z=u*x+h*g+o*m-l*p,this._w=h*x-o*p-l*m-u*g,this._onChangeCallback(),this}slerp(t,i){if(i===0)return this;if(i===1)return this.copy(t);const o=this._x,l=this._y,u=this._z,h=this._w;let p=h*t._w+o*t._x+l*t._y+u*t._z;if(p<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,p=-p):this.copy(t),p>=1)return this._w=h,this._x=o,this._y=l,this._z=u,this;const m=1-p*p;if(m<=Number.EPSILON){const E=1-i;return this._w=E*h+i*this._w,this._x=E*o+i*this._x,this._y=E*l+i*this._y,this._z=E*u+i*this._z,this.normalize(),this}const g=Math.sqrt(m),x=Math.atan2(g,p),v=Math.sin((1-i)*x)/g,S=Math.sin(i*x)/g;return this._w=h*v+this._w*S,this._x=o*v+this._x*S,this._y=l*v+this._y*S,this._z=u*v+this._z*S,this._onChangeCallback(),this}slerpQuaternions(t,i,o){return this.copy(t).slerp(i,o)}random(){const t=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),o=Math.random(),l=Math.sqrt(1-o),u=Math.sqrt(o);return this.set(l*Math.sin(t),l*Math.cos(t),u*Math.sin(i),u*Math.cos(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,i=0){return this._x=t[i],this._y=t[i+1],this._z=t[i+2],this._w=t[i+3],this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._w,t}fromBufferAttribute(t,i){return this._x=t.getX(i),this._y=t.getY(i),this._z=t.getZ(i),this._w=t.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class ae{constructor(t=0,i=0,o=0){ae.prototype.isVector3=!0,this.x=t,this.y=i,this.z=o}set(t,i,o){return o===void 0&&(o=this.z),this.x=t,this.y=i,this.z=o,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}applyEuler(t){return this.applyQuaternion(dx.setFromEuler(t))}applyAxisAngle(t,i){return this.applyQuaternion(dx.setFromAxisAngle(t,i))}applyMatrix3(t){const i=this.x,o=this.y,l=this.z,u=t.elements;return this.x=u[0]*i+u[3]*o+u[6]*l,this.y=u[1]*i+u[4]*o+u[7]*l,this.z=u[2]*i+u[5]*o+u[8]*l,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const i=this.x,o=this.y,l=this.z,u=t.elements,h=1/(u[3]*i+u[7]*o+u[11]*l+u[15]);return this.x=(u[0]*i+u[4]*o+u[8]*l+u[12])*h,this.y=(u[1]*i+u[5]*o+u[9]*l+u[13])*h,this.z=(u[2]*i+u[6]*o+u[10]*l+u[14])*h,this}applyQuaternion(t){const i=this.x,o=this.y,l=this.z,u=t.x,h=t.y,p=t.z,m=t.w,g=2*(h*l-p*o),x=2*(p*i-u*l),v=2*(u*o-h*i);return this.x=i+m*g+h*v-p*x,this.y=o+m*x+p*g-u*v,this.z=l+m*v+u*x-h*g,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const i=this.x,o=this.y,l=this.z,u=t.elements;return this.x=u[0]*i+u[4]*o+u[8]*l,this.y=u[1]*i+u[5]*o+u[9]*l,this.z=u[2]*i+u[6]*o+u[10]*l,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,i){return this.x=Dt(this.x,t.x,i.x),this.y=Dt(this.y,t.y,i.y),this.z=Dt(this.z,t.z,i.z),this}clampScalar(t,i){return this.x=Dt(this.x,t,i),this.y=Dt(this.y,t,i),this.z=Dt(this.z,t,i),this}clampLength(t,i){const o=this.length();return this.divideScalar(o||1).multiplyScalar(Dt(o,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this}lerpVectors(t,i,o){return this.x=t.x+(i.x-t.x)*o,this.y=t.y+(i.y-t.y)*o,this.z=t.z+(i.z-t.z)*o,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,i){const o=t.x,l=t.y,u=t.z,h=i.x,p=i.y,m=i.z;return this.x=l*m-u*p,this.y=u*h-o*m,this.z=o*p-l*h,this}projectOnVector(t){const i=t.lengthSq();if(i===0)return this.set(0,0,0);const o=t.dot(this)/i;return this.copy(t).multiplyScalar(o)}projectOnPlane(t){return Xh.copy(this).projectOnVector(t),this.sub(Xh)}reflect(t){return this.sub(Xh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const o=this.dot(t)/i;return Math.acos(Dt(o,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,o=this.y-t.y,l=this.z-t.z;return i*i+o*o+l*l}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,i,o){const l=Math.sin(i)*t;return this.x=l*Math.sin(o),this.y=Math.cos(i)*t,this.z=l*Math.cos(o),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,i,o){return this.x=t*Math.sin(i),this.y=o,this.z=t*Math.cos(i),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(t){const i=this.setFromMatrixColumn(t,0).length(),o=this.setFromMatrixColumn(t,1).length(),l=this.setFromMatrixColumn(t,2).length();return this.x=i,this.y=o,this.z=l,this}setFromMatrixColumn(t,i){return this.fromArray(t.elements,i*4)}setFromMatrix3Column(t,i){return this.fromArray(t.elements,i*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,i=Math.random()*2-1,o=Math.sqrt(1-i*i);return this.x=o*Math.cos(t),this.y=i,this.z=o*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Xh=new ae,dx=new Xl;class vt{constructor(t,i,o,l,u,h,p,m,g){vt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,i,o,l,u,h,p,m,g)}set(t,i,o,l,u,h,p,m,g){const x=this.elements;return x[0]=t,x[1]=l,x[2]=p,x[3]=i,x[4]=u,x[5]=m,x[6]=o,x[7]=h,x[8]=g,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const i=this.elements,o=t.elements;return i[0]=o[0],i[1]=o[1],i[2]=o[2],i[3]=o[3],i[4]=o[4],i[5]=o[5],i[6]=o[6],i[7]=o[7],i[8]=o[8],this}extractBasis(t,i,o){return t.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),o.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const i=t.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const o=t.elements,l=i.elements,u=this.elements,h=o[0],p=o[3],m=o[6],g=o[1],x=o[4],v=o[7],S=o[2],E=o[5],b=o[8],T=l[0],M=l[3],_=l[6],L=l[1],z=l[4],N=l[7],V=l[2],H=l[5],I=l[8];return u[0]=h*T+p*L+m*V,u[3]=h*M+p*z+m*H,u[6]=h*_+p*N+m*I,u[1]=g*T+x*L+v*V,u[4]=g*M+x*z+v*H,u[7]=g*_+x*N+v*I,u[2]=S*T+E*L+b*V,u[5]=S*M+E*z+b*H,u[8]=S*_+E*N+b*I,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[3]*=t,i[6]*=t,i[1]*=t,i[4]*=t,i[7]*=t,i[2]*=t,i[5]*=t,i[8]*=t,this}determinant(){const t=this.elements,i=t[0],o=t[1],l=t[2],u=t[3],h=t[4],p=t[5],m=t[6],g=t[7],x=t[8];return i*h*x-i*p*g-o*u*x+o*p*m+l*u*g-l*h*m}invert(){const t=this.elements,i=t[0],o=t[1],l=t[2],u=t[3],h=t[4],p=t[5],m=t[6],g=t[7],x=t[8],v=x*h-p*g,S=p*m-x*u,E=g*u-h*m,b=i*v+o*S+l*E;if(b===0)return this.set(0,0,0,0,0,0,0,0,0);const T=1/b;return t[0]=v*T,t[1]=(l*g-x*o)*T,t[2]=(p*o-l*h)*T,t[3]=S*T,t[4]=(x*i-l*m)*T,t[5]=(l*u-p*i)*T,t[6]=E*T,t[7]=(o*m-g*i)*T,t[8]=(h*i-o*u)*T,this}transpose(){let t;const i=this.elements;return t=i[1],i[1]=i[3],i[3]=t,t=i[2],i[2]=i[6],i[6]=t,t=i[5],i[5]=i[7],i[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const i=this.elements;return t[0]=i[0],t[1]=i[3],t[2]=i[6],t[3]=i[1],t[4]=i[4],t[5]=i[7],t[6]=i[2],t[7]=i[5],t[8]=i[8],this}setUvTransform(t,i,o,l,u,h,p){const m=Math.cos(u),g=Math.sin(u);return this.set(o*m,o*g,-o*(m*h+g*p)+h+t,-l*g,l*m,-l*(-g*h+m*p)+p+i,0,0,1),this}scale(t,i){return this.premultiply(qh.makeScale(t,i)),this}rotate(t){return this.premultiply(qh.makeRotation(-t)),this}translate(t,i){return this.premultiply(qh.makeTranslation(t,i)),this}makeTranslation(t,i){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,i,0,0,1),this}makeRotation(t){const i=Math.cos(t),o=Math.sin(t);return this.set(i,-o,0,o,i,0,0,0,1),this}makeScale(t,i){return this.set(t,0,0,0,i,0,0,0,1),this}equals(t){const i=this.elements,o=t.elements;for(let l=0;l<9;l++)if(i[l]!==o[l])return!1;return!0}fromArray(t,i=0){for(let o=0;o<9;o++)this.elements[o]=t[o+i];return this}toArray(t=[],i=0){const o=this.elements;return t[i]=o[0],t[i+1]=o[1],t[i+2]=o[2],t[i+3]=o[3],t[i+4]=o[4],t[i+5]=o[5],t[i+6]=o[6],t[i+7]=o[7],t[i+8]=o[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const qh=new vt;function Hy(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Hl(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function cT(){const s=Hl("canvas");return s.style.display="block",s}const hx={};function jl(s){s in hx||(hx[s]=!0,console.warn(s))}function uT(s,t,i){return new Promise(function(o,l){function u(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:l();break;case s.TIMEOUT_EXPIRED:setTimeout(u,i);break;default:o()}}setTimeout(u,i)})}const px=new vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),mx=new vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function fT(){const s={enabled:!0,workingColorSpace:Ao,spaces:{},convert:function(l,u,h){return this.enabled===!1||u===h||!u||!h||(this.spaces[u].transfer===Xt&&(l.r=Ba(l.r),l.g=Ba(l.g),l.b=Ba(l.b)),this.spaces[u].primaries!==this.spaces[h].primaries&&(l.applyMatrix3(this.spaces[u].toXYZ),l.applyMatrix3(this.spaces[h].fromXYZ)),this.spaces[h].transfer===Xt&&(l.r=yo(l.r),l.g=yo(l.g),l.b=yo(l.b))),l},workingToColorSpace:function(l,u){return this.convert(l,this.workingColorSpace,u)},colorSpaceToWorking:function(l,u){return this.convert(l,u,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===Ss?Ju:this.spaces[l].transfer},getToneMappingMode:function(l){return this.spaces[l].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(l,u=this.workingColorSpace){return l.fromArray(this.spaces[u].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,u,h){return l.copy(this.spaces[u].toXYZ).multiply(this.spaces[h].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(l,u){return jl("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(l,u)},toWorkingColorSpace:function(l,u){return jl("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(l,u)}},t=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],o=[.3127,.329];return s.define({[Ao]:{primaries:t,whitePoint:o,transfer:Ju,toXYZ:px,fromXYZ:mx,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:ti},outputColorSpaceConfig:{drawingBufferColorSpace:ti}},[ti]:{primaries:t,whitePoint:o,transfer:Xt,toXYZ:px,fromXYZ:mx,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:ti}}}),s}const Lt=fT();function Ba(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function yo(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let to;class dT{static getDataURL(t,i="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let o;if(t instanceof HTMLCanvasElement)o=t;else{to===void 0&&(to=Hl("canvas")),to.width=t.width,to.height=t.height;const l=to.getContext("2d");t instanceof ImageData?l.putImageData(t,0,0):l.drawImage(t,0,0,t.width,t.height),o=to}return o.toDataURL(i)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const i=Hl("canvas");i.width=t.width,i.height=t.height;const o=i.getContext("2d");o.drawImage(t,0,0,t.width,t.height);const l=o.getImageData(0,0,t.width,t.height),u=l.data;for(let h=0;h<u.length;h++)u[h]=Ba(u[h]/255)*255;return o.putImageData(l,0,0),i}else if(t.data){const i=t.data.slice(0);for(let o=0;o<i.length;o++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[o]=Math.floor(Ba(i[o]/255)*255):i[o]=Ba(i[o]);return{data:i,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let hT=0;class Um{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:hT++}),this.uuid=kl(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const i=this.data;return typeof HTMLVideoElement<"u"&&i instanceof HTMLVideoElement?t.set(i.videoWidth,i.videoHeight,0):i instanceof VideoFrame?t.set(i.displayHeight,i.displayWidth,0):i!==null?t.set(i.width,i.height,i.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const o={uuid:this.uuid,url:""},l=this.data;if(l!==null){let u;if(Array.isArray(l)){u=[];for(let h=0,p=l.length;h<p;h++)l[h].isDataTexture?u.push(Yh(l[h].image)):u.push(Yh(l[h]))}else u=Yh(l);o.url=u}return i||(t.images[this.uuid]=o),o}}function Yh(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?dT.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let pT=0;const Wh=new ae;class Wn extends wo{constructor(t=Wn.DEFAULT_IMAGE,i=Wn.DEFAULT_MAPPING,o=ur,l=ur,u=Xi,h=fr,p=qi,m=fa,g=Wn.DEFAULT_ANISOTROPY,x=Ss){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:pT++}),this.uuid=kl(),this.name="",this.source=new Um(t),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=o,this.wrapT=l,this.magFilter=u,this.minFilter=h,this.anisotropy=g,this.format=p,this.internalFormat=null,this.type=m,this.offset=new pt(0,0),this.repeat=new pt(1,1),this.center=new pt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=x,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Wh).x}get height(){return this.source.getSize(Wh).y}get depth(){return this.source.getSize(Wh).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const i in t){const o=t[i];if(o===void 0){console.warn(`THREE.Texture.setValues(): parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Texture.setValues(): property '${i}' does not exist.`);continue}l&&o&&l.isVector2&&o.isVector2||l&&o&&l.isVector3&&o.isVector3||l&&o&&l.isMatrix3&&o.isMatrix3?l.copy(o):this[i]=o}}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const o={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(o.userData=this.userData),i||(t.textures[this.uuid]=o),o}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==wy)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Fp:t.x=t.x-Math.floor(t.x);break;case ur:t.x=t.x<0?0:1;break;case Hp:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Fp:t.y=t.y-Math.floor(t.y);break;case ur:t.y=t.y<0?0:1;break;case Hp:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Wn.DEFAULT_IMAGE=null;Wn.DEFAULT_MAPPING=wy;Wn.DEFAULT_ANISOTROPY=1;class Wt{constructor(t=0,i=0,o=0,l=1){Wt.prototype.isVector4=!0,this.x=t,this.y=i,this.z=o,this.w=l}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,i,o,l){return this.x=t,this.y=i,this.z=o,this.w=l,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this.w=t.w+i.w,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this.w+=t.w*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this.w=t.w-i.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const i=this.x,o=this.y,l=this.z,u=this.w,h=t.elements;return this.x=h[0]*i+h[4]*o+h[8]*l+h[12]*u,this.y=h[1]*i+h[5]*o+h[9]*l+h[13]*u,this.z=h[2]*i+h[6]*o+h[10]*l+h[14]*u,this.w=h[3]*i+h[7]*o+h[11]*l+h[15]*u,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const i=Math.sqrt(1-t.w*t.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/i,this.y=t.y/i,this.z=t.z/i),this}setAxisAngleFromRotationMatrix(t){let i,o,l,u;const m=t.elements,g=m[0],x=m[4],v=m[8],S=m[1],E=m[5],b=m[9],T=m[2],M=m[6],_=m[10];if(Math.abs(x-S)<.01&&Math.abs(v-T)<.01&&Math.abs(b-M)<.01){if(Math.abs(x+S)<.1&&Math.abs(v+T)<.1&&Math.abs(b+M)<.1&&Math.abs(g+E+_-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const z=(g+1)/2,N=(E+1)/2,V=(_+1)/2,H=(x+S)/4,I=(v+T)/4,Y=(b+M)/4;return z>N&&z>V?z<.01?(o=0,l=.707106781,u=.707106781):(o=Math.sqrt(z),l=H/o,u=I/o):N>V?N<.01?(o=.707106781,l=0,u=.707106781):(l=Math.sqrt(N),o=H/l,u=Y/l):V<.01?(o=.707106781,l=.707106781,u=0):(u=Math.sqrt(V),o=I/u,l=Y/u),this.set(o,l,u,i),this}let L=Math.sqrt((M-b)*(M-b)+(v-T)*(v-T)+(S-x)*(S-x));return Math.abs(L)<.001&&(L=1),this.x=(M-b)/L,this.y=(v-T)/L,this.z=(S-x)/L,this.w=Math.acos((g+E+_-1)/2),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,i){return this.x=Dt(this.x,t.x,i.x),this.y=Dt(this.y,t.y,i.y),this.z=Dt(this.z,t.z,i.z),this.w=Dt(this.w,t.w,i.w),this}clampScalar(t,i){return this.x=Dt(this.x,t,i),this.y=Dt(this.y,t,i),this.z=Dt(this.z,t,i),this.w=Dt(this.w,t,i),this}clampLength(t,i){const o=this.length();return this.divideScalar(o||1).multiplyScalar(Dt(o,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this.w+=(t.w-this.w)*i,this}lerpVectors(t,i,o){return this.x=t.x+(i.x-t.x)*o,this.y=t.y+(i.y-t.y)*o,this.z=t.z+(i.z-t.z)*o,this.w=t.w+(i.w-t.w)*o,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this.w=t.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class mT extends wo{constructor(t=1,i=1,o={}){super(),o=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},o),this.isRenderTarget=!0,this.width=t,this.height=i,this.depth=o.depth,this.scissor=new Wt(0,0,t,i),this.scissorTest=!1,this.viewport=new Wt(0,0,t,i);const l={width:t,height:i,depth:o.depth},u=new Wn(l);this.textures=[];const h=o.count;for(let p=0;p<h;p++)this.textures[p]=u.clone(),this.textures[p].isRenderTargetTexture=!0,this.textures[p].renderTarget=this;this._setTextureOptions(o),this.depthBuffer=o.depthBuffer,this.stencilBuffer=o.stencilBuffer,this.resolveDepthBuffer=o.resolveDepthBuffer,this.resolveStencilBuffer=o.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=o.depthTexture,this.samples=o.samples,this.multiview=o.multiview}_setTextureOptions(t={}){const i={minFilter:Xi,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(i.mapping=t.mapping),t.wrapS!==void 0&&(i.wrapS=t.wrapS),t.wrapT!==void 0&&(i.wrapT=t.wrapT),t.wrapR!==void 0&&(i.wrapR=t.wrapR),t.magFilter!==void 0&&(i.magFilter=t.magFilter),t.minFilter!==void 0&&(i.minFilter=t.minFilter),t.format!==void 0&&(i.format=t.format),t.type!==void 0&&(i.type=t.type),t.anisotropy!==void 0&&(i.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(i.colorSpace=t.colorSpace),t.flipY!==void 0&&(i.flipY=t.flipY),t.generateMipmaps!==void 0&&(i.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(i.internalFormat=t.internalFormat);for(let o=0;o<this.textures.length;o++)this.textures[o].setValues(i)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,i,o=1){if(this.width!==t||this.height!==i||this.depth!==o){this.width=t,this.height=i,this.depth=o;for(let l=0,u=this.textures.length;l<u;l++)this.textures[l].image.width=t,this.textures[l].image.height=i,this.textures[l].image.depth=o,this.textures[l].isArrayTexture=this.textures[l].image.depth>1;this.dispose()}this.viewport.set(0,0,t,i),this.scissor.set(0,0,t,i)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,o=t.textures.length;i<o;i++){this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},t.textures[i].image);this.textures[i].source=new Um(l)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Yi extends mT{constructor(t=1,i=1,o={}){super(t,i,o),this.isWebGLRenderTarget=!0}}class jy extends Wn{constructor(t=null,i=1,o=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:i,height:o,depth:l},this.magFilter=Li,this.minFilter=Li,this.wrapR=ur,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class gT extends Wn{constructor(t=null,i=1,o=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:i,height:o,depth:l},this.magFilter=Li,this.minFilter=Li,this.wrapR=ur,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ql{constructor(t=new ae(1/0,1/0,1/0),i=new ae(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=i}set(t,i){return this.min.copy(t),this.max.copy(i),this}setFromArray(t){this.makeEmpty();for(let i=0,o=t.length;i<o;i+=3)this.expandByPoint(ji.fromArray(t,i));return this}setFromBufferAttribute(t){this.makeEmpty();for(let i=0,o=t.count;i<o;i++)this.expandByPoint(ji.fromBufferAttribute(t,i));return this}setFromPoints(t){this.makeEmpty();for(let i=0,o=t.length;i<o;i++)this.expandByPoint(t[i]);return this}setFromCenterAndSize(t,i){const o=ji.copy(i).multiplyScalar(.5);return this.min.copy(t).sub(o),this.max.copy(t).add(o),this}setFromObject(t,i=!1){return this.makeEmpty(),this.expandByObject(t,i)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,i=!1){t.updateWorldMatrix(!1,!1);const o=t.geometry;if(o!==void 0){const u=o.getAttribute("position");if(i===!0&&u!==void 0&&t.isInstancedMesh!==!0)for(let h=0,p=u.count;h<p;h++)t.isMesh===!0?t.getVertexPosition(h,ji):ji.fromBufferAttribute(u,h),ji.applyMatrix4(t.matrixWorld),this.expandByPoint(ji);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),_u.copy(t.boundingBox)):(o.boundingBox===null&&o.computeBoundingBox(),_u.copy(o.boundingBox)),_u.applyMatrix4(t.matrixWorld),this.union(_u)}const l=t.children;for(let u=0,h=l.length;u<h;u++)this.expandByObject(l[u],i);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,i){return i.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ji),ji.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let i,o;return t.normal.x>0?(i=t.normal.x*this.min.x,o=t.normal.x*this.max.x):(i=t.normal.x*this.max.x,o=t.normal.x*this.min.x),t.normal.y>0?(i+=t.normal.y*this.min.y,o+=t.normal.y*this.max.y):(i+=t.normal.y*this.max.y,o+=t.normal.y*this.min.y),t.normal.z>0?(i+=t.normal.z*this.min.z,o+=t.normal.z*this.max.z):(i+=t.normal.z*this.max.z,o+=t.normal.z*this.min.z),i<=-t.constant&&o>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Cl),xu.subVectors(this.max,Cl),no.subVectors(t.a,Cl),io.subVectors(t.b,Cl),ao.subVectors(t.c,Cl),ps.subVectors(io,no),ms.subVectors(ao,io),$s.subVectors(no,ao);let i=[0,-ps.z,ps.y,0,-ms.z,ms.y,0,-$s.z,$s.y,ps.z,0,-ps.x,ms.z,0,-ms.x,$s.z,0,-$s.x,-ps.y,ps.x,0,-ms.y,ms.x,0,-$s.y,$s.x,0];return!Zh(i,no,io,ao,xu)||(i=[1,0,0,0,1,0,0,0,1],!Zh(i,no,io,ao,xu))?!1:(yu.crossVectors(ps,ms),i=[yu.x,yu.y,yu.z],Zh(i,no,io,ao,xu))}clampPoint(t,i){return i.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ji).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ji).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(wa[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),wa[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),wa[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),wa[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),wa[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),wa[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),wa[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),wa[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(wa),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const wa=[new ae,new ae,new ae,new ae,new ae,new ae,new ae,new ae],ji=new ae,_u=new ql,no=new ae,io=new ae,ao=new ae,ps=new ae,ms=new ae,$s=new ae,Cl=new ae,xu=new ae,yu=new ae,er=new ae;function Zh(s,t,i,o,l){for(let u=0,h=s.length-3;u<=h;u+=3){er.fromArray(s,u);const p=l.x*Math.abs(er.x)+l.y*Math.abs(er.y)+l.z*Math.abs(er.z),m=t.dot(er),g=i.dot(er),x=o.dot(er);if(Math.max(-Math.max(m,g,x),Math.min(m,g,x))>p)return!1}return!0}const vT=new ql,Rl=new ae,Kh=new ae;class rf{constructor(t=new ae,i=-1){this.isSphere=!0,this.center=t,this.radius=i}set(t,i){return this.center.copy(t),this.radius=i,this}setFromPoints(t,i){const o=this.center;i!==void 0?o.copy(i):vT.setFromPoints(t).getCenter(o);let l=0;for(let u=0,h=t.length;u<h;u++)l=Math.max(l,o.distanceToSquared(t[u]));return this.radius=Math.sqrt(l),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const i=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=i*i}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,i){const o=this.center.distanceToSquared(t);return i.copy(t),o>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Rl.subVectors(t,this.center);const i=Rl.lengthSq();if(i>this.radius*this.radius){const o=Math.sqrt(i),l=(o-this.radius)*.5;this.center.addScaledVector(Rl,l/o),this.radius+=l}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Kh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Rl.copy(t.center).add(Kh)),this.expandByPoint(Rl.copy(t.center).sub(Kh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Na=new ae,Qh=new ae,Su=new ae,gs=new ae,Jh=new ae,Mu=new ae,$h=new ae;class Gy{constructor(t=new ae,i=new ae(0,0,-1)){this.origin=t,this.direction=i}set(t,i){return this.origin.copy(t),this.direction.copy(i),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,i){return i.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Na)),this}closestPointToPoint(t,i){i.subVectors(t,this.origin);const o=i.dot(this.direction);return o<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,o)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const i=Na.subVectors(t,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(t):(Na.copy(this.origin).addScaledVector(this.direction,i),Na.distanceToSquared(t))}distanceSqToSegment(t,i,o,l){Qh.copy(t).add(i).multiplyScalar(.5),Su.copy(i).sub(t).normalize(),gs.copy(this.origin).sub(Qh);const u=t.distanceTo(i)*.5,h=-this.direction.dot(Su),p=gs.dot(this.direction),m=-gs.dot(Su),g=gs.lengthSq(),x=Math.abs(1-h*h);let v,S,E,b;if(x>0)if(v=h*m-p,S=h*p-m,b=u*x,v>=0)if(S>=-b)if(S<=b){const T=1/x;v*=T,S*=T,E=v*(v+h*S+2*p)+S*(h*v+S+2*m)+g}else S=u,v=Math.max(0,-(h*S+p)),E=-v*v+S*(S+2*m)+g;else S=-u,v=Math.max(0,-(h*S+p)),E=-v*v+S*(S+2*m)+g;else S<=-b?(v=Math.max(0,-(-h*u+p)),S=v>0?-u:Math.min(Math.max(-u,-m),u),E=-v*v+S*(S+2*m)+g):S<=b?(v=0,S=Math.min(Math.max(-u,-m),u),E=S*(S+2*m)+g):(v=Math.max(0,-(h*u+p)),S=v>0?u:Math.min(Math.max(-u,-m),u),E=-v*v+S*(S+2*m)+g);else S=h>0?-u:u,v=Math.max(0,-(h*S+p)),E=-v*v+S*(S+2*m)+g;return o&&o.copy(this.origin).addScaledVector(this.direction,v),l&&l.copy(Qh).addScaledVector(Su,S),E}intersectSphere(t,i){Na.subVectors(t.center,this.origin);const o=Na.dot(this.direction),l=Na.dot(Na)-o*o,u=t.radius*t.radius;if(l>u)return null;const h=Math.sqrt(u-l),p=o-h,m=o+h;return m<0?null:p<0?this.at(m,i):this.at(p,i)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const i=t.normal.dot(this.direction);if(i===0)return t.distanceToPoint(this.origin)===0?0:null;const o=-(this.origin.dot(t.normal)+t.constant)/i;return o>=0?o:null}intersectPlane(t,i){const o=this.distanceToPlane(t);return o===null?null:this.at(o,i)}intersectsPlane(t){const i=t.distanceToPoint(this.origin);return i===0||t.normal.dot(this.direction)*i<0}intersectBox(t,i){let o,l,u,h,p,m;const g=1/this.direction.x,x=1/this.direction.y,v=1/this.direction.z,S=this.origin;return g>=0?(o=(t.min.x-S.x)*g,l=(t.max.x-S.x)*g):(o=(t.max.x-S.x)*g,l=(t.min.x-S.x)*g),x>=0?(u=(t.min.y-S.y)*x,h=(t.max.y-S.y)*x):(u=(t.max.y-S.y)*x,h=(t.min.y-S.y)*x),o>h||u>l||((u>o||isNaN(o))&&(o=u),(h<l||isNaN(l))&&(l=h),v>=0?(p=(t.min.z-S.z)*v,m=(t.max.z-S.z)*v):(p=(t.max.z-S.z)*v,m=(t.min.z-S.z)*v),o>m||p>l)||((p>o||o!==o)&&(o=p),(m<l||l!==l)&&(l=m),l<0)?null:this.at(o>=0?o:l,i)}intersectsBox(t){return this.intersectBox(t,Na)!==null}intersectTriangle(t,i,o,l,u){Jh.subVectors(i,t),Mu.subVectors(o,t),$h.crossVectors(Jh,Mu);let h=this.direction.dot($h),p;if(h>0){if(l)return null;p=1}else if(h<0)p=-1,h=-h;else return null;gs.subVectors(this.origin,t);const m=p*this.direction.dot(Mu.crossVectors(gs,Mu));if(m<0)return null;const g=p*this.direction.dot(Jh.cross(gs));if(g<0||m+g>h)return null;const x=-p*gs.dot($h);return x<0?null:this.at(x/h,u)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class sn{constructor(t,i,o,l,u,h,p,m,g,x,v,S,E,b,T,M){sn.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,i,o,l,u,h,p,m,g,x,v,S,E,b,T,M)}set(t,i,o,l,u,h,p,m,g,x,v,S,E,b,T,M){const _=this.elements;return _[0]=t,_[4]=i,_[8]=o,_[12]=l,_[1]=u,_[5]=h,_[9]=p,_[13]=m,_[2]=g,_[6]=x,_[10]=v,_[14]=S,_[3]=E,_[7]=b,_[11]=T,_[15]=M,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new sn().fromArray(this.elements)}copy(t){const i=this.elements,o=t.elements;return i[0]=o[0],i[1]=o[1],i[2]=o[2],i[3]=o[3],i[4]=o[4],i[5]=o[5],i[6]=o[6],i[7]=o[7],i[8]=o[8],i[9]=o[9],i[10]=o[10],i[11]=o[11],i[12]=o[12],i[13]=o[13],i[14]=o[14],i[15]=o[15],this}copyPosition(t){const i=this.elements,o=t.elements;return i[12]=o[12],i[13]=o[13],i[14]=o[14],this}setFromMatrix3(t){const i=t.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(t,i,o){return t.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),o.setFromMatrixColumn(this,2),this}makeBasis(t,i,o){return this.set(t.x,i.x,o.x,0,t.y,i.y,o.y,0,t.z,i.z,o.z,0,0,0,0,1),this}extractRotation(t){const i=this.elements,o=t.elements,l=1/so.setFromMatrixColumn(t,0).length(),u=1/so.setFromMatrixColumn(t,1).length(),h=1/so.setFromMatrixColumn(t,2).length();return i[0]=o[0]*l,i[1]=o[1]*l,i[2]=o[2]*l,i[3]=0,i[4]=o[4]*u,i[5]=o[5]*u,i[6]=o[6]*u,i[7]=0,i[8]=o[8]*h,i[9]=o[9]*h,i[10]=o[10]*h,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(t){const i=this.elements,o=t.x,l=t.y,u=t.z,h=Math.cos(o),p=Math.sin(o),m=Math.cos(l),g=Math.sin(l),x=Math.cos(u),v=Math.sin(u);if(t.order==="XYZ"){const S=h*x,E=h*v,b=p*x,T=p*v;i[0]=m*x,i[4]=-m*v,i[8]=g,i[1]=E+b*g,i[5]=S-T*g,i[9]=-p*m,i[2]=T-S*g,i[6]=b+E*g,i[10]=h*m}else if(t.order==="YXZ"){const S=m*x,E=m*v,b=g*x,T=g*v;i[0]=S+T*p,i[4]=b*p-E,i[8]=h*g,i[1]=h*v,i[5]=h*x,i[9]=-p,i[2]=E*p-b,i[6]=T+S*p,i[10]=h*m}else if(t.order==="ZXY"){const S=m*x,E=m*v,b=g*x,T=g*v;i[0]=S-T*p,i[4]=-h*v,i[8]=b+E*p,i[1]=E+b*p,i[5]=h*x,i[9]=T-S*p,i[2]=-h*g,i[6]=p,i[10]=h*m}else if(t.order==="ZYX"){const S=h*x,E=h*v,b=p*x,T=p*v;i[0]=m*x,i[4]=b*g-E,i[8]=S*g+T,i[1]=m*v,i[5]=T*g+S,i[9]=E*g-b,i[2]=-g,i[6]=p*m,i[10]=h*m}else if(t.order==="YZX"){const S=h*m,E=h*g,b=p*m,T=p*g;i[0]=m*x,i[4]=T-S*v,i[8]=b*v+E,i[1]=v,i[5]=h*x,i[9]=-p*x,i[2]=-g*x,i[6]=E*v+b,i[10]=S-T*v}else if(t.order==="XZY"){const S=h*m,E=h*g,b=p*m,T=p*g;i[0]=m*x,i[4]=-v,i[8]=g*x,i[1]=S*v+T,i[5]=h*x,i[9]=E*v-b,i[2]=b*v-E,i[6]=p*x,i[10]=T*v+S}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(t){return this.compose(_T,t,xT)}lookAt(t,i,o){const l=this.elements;return hi.subVectors(t,i),hi.lengthSq()===0&&(hi.z=1),hi.normalize(),vs.crossVectors(o,hi),vs.lengthSq()===0&&(Math.abs(o.z)===1?hi.x+=1e-4:hi.z+=1e-4,hi.normalize(),vs.crossVectors(o,hi)),vs.normalize(),Eu.crossVectors(hi,vs),l[0]=vs.x,l[4]=Eu.x,l[8]=hi.x,l[1]=vs.y,l[5]=Eu.y,l[9]=hi.y,l[2]=vs.z,l[6]=Eu.z,l[10]=hi.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const o=t.elements,l=i.elements,u=this.elements,h=o[0],p=o[4],m=o[8],g=o[12],x=o[1],v=o[5],S=o[9],E=o[13],b=o[2],T=o[6],M=o[10],_=o[14],L=o[3],z=o[7],N=o[11],V=o[15],H=l[0],I=l[4],Y=l[8],U=l[12],R=l[1],G=l[5],ie=l[9],ue=l[13],Z=l[2],B=l[6],O=l[10],k=l[14],X=l[3],ve=l[7],_e=l[11],He=l[15];return u[0]=h*H+p*R+m*Z+g*X,u[4]=h*I+p*G+m*B+g*ve,u[8]=h*Y+p*ie+m*O+g*_e,u[12]=h*U+p*ue+m*k+g*He,u[1]=x*H+v*R+S*Z+E*X,u[5]=x*I+v*G+S*B+E*ve,u[9]=x*Y+v*ie+S*O+E*_e,u[13]=x*U+v*ue+S*k+E*He,u[2]=b*H+T*R+M*Z+_*X,u[6]=b*I+T*G+M*B+_*ve,u[10]=b*Y+T*ie+M*O+_*_e,u[14]=b*U+T*ue+M*k+_*He,u[3]=L*H+z*R+N*Z+V*X,u[7]=L*I+z*G+N*B+V*ve,u[11]=L*Y+z*ie+N*O+V*_e,u[15]=L*U+z*ue+N*k+V*He,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[4]*=t,i[8]*=t,i[12]*=t,i[1]*=t,i[5]*=t,i[9]*=t,i[13]*=t,i[2]*=t,i[6]*=t,i[10]*=t,i[14]*=t,i[3]*=t,i[7]*=t,i[11]*=t,i[15]*=t,this}determinant(){const t=this.elements,i=t[0],o=t[4],l=t[8],u=t[12],h=t[1],p=t[5],m=t[9],g=t[13],x=t[2],v=t[6],S=t[10],E=t[14],b=t[3],T=t[7],M=t[11],_=t[15];return b*(+u*m*v-l*g*v-u*p*S+o*g*S+l*p*E-o*m*E)+T*(+i*m*E-i*g*S+u*h*S-l*h*E+l*g*x-u*m*x)+M*(+i*g*v-i*p*E-u*h*v+o*h*E+u*p*x-o*g*x)+_*(-l*p*x-i*m*v+i*p*S+l*h*v-o*h*S+o*m*x)}transpose(){const t=this.elements;let i;return i=t[1],t[1]=t[4],t[4]=i,i=t[2],t[2]=t[8],t[8]=i,i=t[6],t[6]=t[9],t[9]=i,i=t[3],t[3]=t[12],t[12]=i,i=t[7],t[7]=t[13],t[13]=i,i=t[11],t[11]=t[14],t[14]=i,this}setPosition(t,i,o){const l=this.elements;return t.isVector3?(l[12]=t.x,l[13]=t.y,l[14]=t.z):(l[12]=t,l[13]=i,l[14]=o),this}invert(){const t=this.elements,i=t[0],o=t[1],l=t[2],u=t[3],h=t[4],p=t[5],m=t[6],g=t[7],x=t[8],v=t[9],S=t[10],E=t[11],b=t[12],T=t[13],M=t[14],_=t[15],L=v*M*g-T*S*g+T*m*E-p*M*E-v*m*_+p*S*_,z=b*S*g-x*M*g-b*m*E+h*M*E+x*m*_-h*S*_,N=x*T*g-b*v*g+b*p*E-h*T*E-x*p*_+h*v*_,V=b*v*m-x*T*m-b*p*S+h*T*S+x*p*M-h*v*M,H=i*L+o*z+l*N+u*V;if(H===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/H;return t[0]=L*I,t[1]=(T*S*u-v*M*u-T*l*E+o*M*E+v*l*_-o*S*_)*I,t[2]=(p*M*u-T*m*u+T*l*g-o*M*g-p*l*_+o*m*_)*I,t[3]=(v*m*u-p*S*u-v*l*g+o*S*g+p*l*E-o*m*E)*I,t[4]=z*I,t[5]=(x*M*u-b*S*u+b*l*E-i*M*E-x*l*_+i*S*_)*I,t[6]=(b*m*u-h*M*u-b*l*g+i*M*g+h*l*_-i*m*_)*I,t[7]=(h*S*u-x*m*u+x*l*g-i*S*g-h*l*E+i*m*E)*I,t[8]=N*I,t[9]=(b*v*u-x*T*u-b*o*E+i*T*E+x*o*_-i*v*_)*I,t[10]=(h*T*u-b*p*u+b*o*g-i*T*g-h*o*_+i*p*_)*I,t[11]=(x*p*u-h*v*u-x*o*g+i*v*g+h*o*E-i*p*E)*I,t[12]=V*I,t[13]=(x*T*l-b*v*l+b*o*S-i*T*S-x*o*M+i*v*M)*I,t[14]=(b*p*l-h*T*l-b*o*m+i*T*m+h*o*M-i*p*M)*I,t[15]=(h*v*l-x*p*l+x*o*m-i*v*m-h*o*S+i*p*S)*I,this}scale(t){const i=this.elements,o=t.x,l=t.y,u=t.z;return i[0]*=o,i[4]*=l,i[8]*=u,i[1]*=o,i[5]*=l,i[9]*=u,i[2]*=o,i[6]*=l,i[10]*=u,i[3]*=o,i[7]*=l,i[11]*=u,this}getMaxScaleOnAxis(){const t=this.elements,i=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],o=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],l=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(i,o,l))}makeTranslation(t,i,o){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,i,0,0,1,o,0,0,0,1),this}makeRotationX(t){const i=Math.cos(t),o=Math.sin(t);return this.set(1,0,0,0,0,i,-o,0,0,o,i,0,0,0,0,1),this}makeRotationY(t){const i=Math.cos(t),o=Math.sin(t);return this.set(i,0,o,0,0,1,0,0,-o,0,i,0,0,0,0,1),this}makeRotationZ(t){const i=Math.cos(t),o=Math.sin(t);return this.set(i,-o,0,0,o,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,i){const o=Math.cos(i),l=Math.sin(i),u=1-o,h=t.x,p=t.y,m=t.z,g=u*h,x=u*p;return this.set(g*h+o,g*p-l*m,g*m+l*p,0,g*p+l*m,x*p+o,x*m-l*h,0,g*m-l*p,x*m+l*h,u*m*m+o,0,0,0,0,1),this}makeScale(t,i,o){return this.set(t,0,0,0,0,i,0,0,0,0,o,0,0,0,0,1),this}makeShear(t,i,o,l,u,h){return this.set(1,o,u,0,t,1,h,0,i,l,1,0,0,0,0,1),this}compose(t,i,o){const l=this.elements,u=i._x,h=i._y,p=i._z,m=i._w,g=u+u,x=h+h,v=p+p,S=u*g,E=u*x,b=u*v,T=h*x,M=h*v,_=p*v,L=m*g,z=m*x,N=m*v,V=o.x,H=o.y,I=o.z;return l[0]=(1-(T+_))*V,l[1]=(E+N)*V,l[2]=(b-z)*V,l[3]=0,l[4]=(E-N)*H,l[5]=(1-(S+_))*H,l[6]=(M+L)*H,l[7]=0,l[8]=(b+z)*I,l[9]=(M-L)*I,l[10]=(1-(S+T))*I,l[11]=0,l[12]=t.x,l[13]=t.y,l[14]=t.z,l[15]=1,this}decompose(t,i,o){const l=this.elements;let u=so.set(l[0],l[1],l[2]).length();const h=so.set(l[4],l[5],l[6]).length(),p=so.set(l[8],l[9],l[10]).length();this.determinant()<0&&(u=-u),t.x=l[12],t.y=l[13],t.z=l[14],Gi.copy(this);const g=1/u,x=1/h,v=1/p;return Gi.elements[0]*=g,Gi.elements[1]*=g,Gi.elements[2]*=g,Gi.elements[4]*=x,Gi.elements[5]*=x,Gi.elements[6]*=x,Gi.elements[8]*=v,Gi.elements[9]*=v,Gi.elements[10]*=v,i.setFromRotationMatrix(Gi),o.x=u,o.y=h,o.z=p,this}makePerspective(t,i,o,l,u,h,p=ua,m=!1){const g=this.elements,x=2*u/(i-t),v=2*u/(o-l),S=(i+t)/(i-t),E=(o+l)/(o-l);let b,T;if(m)b=u/(h-u),T=h*u/(h-u);else if(p===ua)b=-(h+u)/(h-u),T=-2*h*u/(h-u);else if(p===$u)b=-h/(h-u),T=-h*u/(h-u);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+p);return g[0]=x,g[4]=0,g[8]=S,g[12]=0,g[1]=0,g[5]=v,g[9]=E,g[13]=0,g[2]=0,g[6]=0,g[10]=b,g[14]=T,g[3]=0,g[7]=0,g[11]=-1,g[15]=0,this}makeOrthographic(t,i,o,l,u,h,p=ua,m=!1){const g=this.elements,x=2/(i-t),v=2/(o-l),S=-(i+t)/(i-t),E=-(o+l)/(o-l);let b,T;if(m)b=1/(h-u),T=h/(h-u);else if(p===ua)b=-2/(h-u),T=-(h+u)/(h-u);else if(p===$u)b=-1/(h-u),T=-u/(h-u);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+p);return g[0]=x,g[4]=0,g[8]=0,g[12]=S,g[1]=0,g[5]=v,g[9]=0,g[13]=E,g[2]=0,g[6]=0,g[10]=b,g[14]=T,g[3]=0,g[7]=0,g[11]=0,g[15]=1,this}equals(t){const i=this.elements,o=t.elements;for(let l=0;l<16;l++)if(i[l]!==o[l])return!1;return!0}fromArray(t,i=0){for(let o=0;o<16;o++)this.elements[o]=t[o+i];return this}toArray(t=[],i=0){const o=this.elements;return t[i]=o[0],t[i+1]=o[1],t[i+2]=o[2],t[i+3]=o[3],t[i+4]=o[4],t[i+5]=o[5],t[i+6]=o[6],t[i+7]=o[7],t[i+8]=o[8],t[i+9]=o[9],t[i+10]=o[10],t[i+11]=o[11],t[i+12]=o[12],t[i+13]=o[13],t[i+14]=o[14],t[i+15]=o[15],t}}const so=new ae,Gi=new sn,_T=new ae(0,0,0),xT=new ae(1,1,1),vs=new ae,Eu=new ae,hi=new ae,gx=new sn,vx=new Xl;class da{constructor(t=0,i=0,o=0,l=da.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=i,this._z=o,this._order=l}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,i,o,l=this._order){return this._x=t,this._y=i,this._z=o,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,i=this._order,o=!0){const l=t.elements,u=l[0],h=l[4],p=l[8],m=l[1],g=l[5],x=l[9],v=l[2],S=l[6],E=l[10];switch(i){case"XYZ":this._y=Math.asin(Dt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-x,E),this._z=Math.atan2(-h,u)):(this._x=Math.atan2(S,g),this._z=0);break;case"YXZ":this._x=Math.asin(-Dt(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(p,E),this._z=Math.atan2(m,g)):(this._y=Math.atan2(-v,u),this._z=0);break;case"ZXY":this._x=Math.asin(Dt(S,-1,1)),Math.abs(S)<.9999999?(this._y=Math.atan2(-v,E),this._z=Math.atan2(-h,g)):(this._y=0,this._z=Math.atan2(m,u));break;case"ZYX":this._y=Math.asin(-Dt(v,-1,1)),Math.abs(v)<.9999999?(this._x=Math.atan2(S,E),this._z=Math.atan2(m,u)):(this._x=0,this._z=Math.atan2(-h,g));break;case"YZX":this._z=Math.asin(Dt(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-x,g),this._y=Math.atan2(-v,u)):(this._x=0,this._y=Math.atan2(p,E));break;case"XZY":this._z=Math.asin(-Dt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(S,g),this._y=Math.atan2(p,u)):(this._x=Math.atan2(-x,E),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,o===!0&&this._onChangeCallback(),this}setFromQuaternion(t,i,o){return gx.makeRotationFromQuaternion(t),this.setFromRotationMatrix(gx,i,o)}setFromVector3(t,i=this._order){return this.set(t.x,t.y,t.z,i)}reorder(t){return vx.setFromEuler(this),this.setFromQuaternion(vx,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}da.DEFAULT_ORDER="XYZ";class Vy{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let yT=0;const _x=new ae,ro=new Xl,Da=new sn,Tu=new ae,wl=new ae,ST=new ae,MT=new Xl,xx=new ae(1,0,0),yx=new ae(0,1,0),Sx=new ae(0,0,1),Mx={type:"added"},ET={type:"removed"},oo={type:"childadded",child:null},ep={type:"childremoved",child:null};class On extends wo{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:yT++}),this.uuid=kl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=On.DEFAULT_UP.clone();const t=new ae,i=new da,o=new Xl,l=new ae(1,1,1);function u(){o.setFromEuler(i,!1)}function h(){i.setFromQuaternion(o,void 0,!1)}i._onChange(u),o._onChange(h),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:o},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new sn},normalMatrix:{value:new vt}}),this.matrix=new sn,this.matrixWorld=new sn,this.matrixAutoUpdate=On.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=On.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vy,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,i){this.quaternion.setFromAxisAngle(t,i)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,i){return ro.setFromAxisAngle(t,i),this.quaternion.multiply(ro),this}rotateOnWorldAxis(t,i){return ro.setFromAxisAngle(t,i),this.quaternion.premultiply(ro),this}rotateX(t){return this.rotateOnAxis(xx,t)}rotateY(t){return this.rotateOnAxis(yx,t)}rotateZ(t){return this.rotateOnAxis(Sx,t)}translateOnAxis(t,i){return _x.copy(t).applyQuaternion(this.quaternion),this.position.add(_x.multiplyScalar(i)),this}translateX(t){return this.translateOnAxis(xx,t)}translateY(t){return this.translateOnAxis(yx,t)}translateZ(t){return this.translateOnAxis(Sx,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Da.copy(this.matrixWorld).invert())}lookAt(t,i,o){t.isVector3?Tu.copy(t):Tu.set(t,i,o);const l=this.parent;this.updateWorldMatrix(!0,!1),wl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Da.lookAt(wl,Tu,this.up):Da.lookAt(Tu,wl,this.up),this.quaternion.setFromRotationMatrix(Da),l&&(Da.extractRotation(l.matrixWorld),ro.setFromRotationMatrix(Da),this.quaternion.premultiply(ro.invert()))}add(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Mx),oo.child=t,this.dispatchEvent(oo),oo.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let o=0;o<arguments.length;o++)this.remove(arguments[o]);return this}const i=this.children.indexOf(t);return i!==-1&&(t.parent=null,this.children.splice(i,1),t.dispatchEvent(ET),ep.child=t,this.dispatchEvent(ep),ep.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Da.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Da.multiply(t.parent.matrixWorld)),t.applyMatrix4(Da),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Mx),oo.child=t,this.dispatchEvent(oo),oo.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,i){if(this[t]===i)return this;for(let o=0,l=this.children.length;o<l;o++){const h=this.children[o].getObjectByProperty(t,i);if(h!==void 0)return h}}getObjectsByProperty(t,i,o=[]){this[t]===i&&o.push(this);const l=this.children;for(let u=0,h=l.length;u<h;u++)l[u].getObjectsByProperty(t,i,o);return o}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wl,t,ST),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wl,MT,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return t.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(t){t(this);const i=this.children;for(let o=0,l=i.length;o<l;o++)i[o].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const i=this.children;for(let o=0,l=i.length;o<l;o++)i[o].traverseVisible(t)}traverseAncestors(t){const i=this.parent;i!==null&&(t(i),i.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const i=this.children;for(let o=0,l=i.length;o<l;o++)i[o].updateMatrixWorld(t)}updateWorldMatrix(t,i){const o=this.parent;if(t===!0&&o!==null&&o.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let u=0,h=l.length;u<h;u++)l[u].updateWorldMatrix(!1,!0)}}toJSON(t){const i=t===void 0||typeof t=="string",o={};i&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},o.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.geometryInfo=this._geometryInfo.map(p=>({...p,boundingBox:p.boundingBox?p.boundingBox.toJSON():void 0,boundingSphere:p.boundingSphere?p.boundingSphere.toJSON():void 0})),l.instanceInfo=this._instanceInfo.map(p=>({...p})),l.availableInstanceIds=this._availableInstanceIds.slice(),l.availableGeometryIds=this._availableGeometryIds.slice(),l.nextIndexStart=this._nextIndexStart,l.nextVertexStart=this._nextVertexStart,l.geometryCount=this._geometryCount,l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.matricesTexture=this._matricesTexture.toJSON(t),l.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(l.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(l.boundingBox=this.boundingBox.toJSON()));function u(p,m){return p[m.uuid]===void 0&&(p[m.uuid]=m.toJSON(t)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=u(t.geometries,this.geometry);const p=this.geometry.parameters;if(p!==void 0&&p.shapes!==void 0){const m=p.shapes;if(Array.isArray(m))for(let g=0,x=m.length;g<x;g++){const v=m[g];u(t.shapes,v)}else u(t.shapes,m)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(u(t.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const p=[];for(let m=0,g=this.material.length;m<g;m++)p.push(u(t.materials,this.material[m]));l.material=p}else l.material=u(t.materials,this.material);if(this.children.length>0){l.children=[];for(let p=0;p<this.children.length;p++)l.children.push(this.children[p].toJSON(t).object)}if(this.animations.length>0){l.animations=[];for(let p=0;p<this.animations.length;p++){const m=this.animations[p];l.animations.push(u(t.animations,m))}}if(i){const p=h(t.geometries),m=h(t.materials),g=h(t.textures),x=h(t.images),v=h(t.shapes),S=h(t.skeletons),E=h(t.animations),b=h(t.nodes);p.length>0&&(o.geometries=p),m.length>0&&(o.materials=m),g.length>0&&(o.textures=g),x.length>0&&(o.images=x),v.length>0&&(o.shapes=v),S.length>0&&(o.skeletons=S),E.length>0&&(o.animations=E),b.length>0&&(o.nodes=b)}return o.object=l,o;function h(p){const m=[];for(const g in p){const x=p[g];delete x.metadata,m.push(x)}return m}}clone(t){return new this.constructor().copy(this,t)}copy(t,i=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),i===!0)for(let o=0;o<t.children.length;o++){const l=t.children[o];this.add(l.clone())}return this}}On.DEFAULT_UP=new ae(0,1,0);On.DEFAULT_MATRIX_AUTO_UPDATE=!0;On.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Vi=new ae,Ua=new ae,tp=new ae,La=new ae,lo=new ae,co=new ae,Ex=new ae,np=new ae,ip=new ae,ap=new ae,sp=new Wt,rp=new Wt,op=new Wt;class ki{constructor(t=new ae,i=new ae,o=new ae){this.a=t,this.b=i,this.c=o}static getNormal(t,i,o,l){l.subVectors(o,i),Vi.subVectors(t,i),l.cross(Vi);const u=l.lengthSq();return u>0?l.multiplyScalar(1/Math.sqrt(u)):l.set(0,0,0)}static getBarycoord(t,i,o,l,u){Vi.subVectors(l,i),Ua.subVectors(o,i),tp.subVectors(t,i);const h=Vi.dot(Vi),p=Vi.dot(Ua),m=Vi.dot(tp),g=Ua.dot(Ua),x=Ua.dot(tp),v=h*g-p*p;if(v===0)return u.set(0,0,0),null;const S=1/v,E=(g*m-p*x)*S,b=(h*x-p*m)*S;return u.set(1-E-b,b,E)}static containsPoint(t,i,o,l){return this.getBarycoord(t,i,o,l,La)===null?!1:La.x>=0&&La.y>=0&&La.x+La.y<=1}static getInterpolation(t,i,o,l,u,h,p,m){return this.getBarycoord(t,i,o,l,La)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(u,La.x),m.addScaledVector(h,La.y),m.addScaledVector(p,La.z),m)}static getInterpolatedAttribute(t,i,o,l,u,h){return sp.setScalar(0),rp.setScalar(0),op.setScalar(0),sp.fromBufferAttribute(t,i),rp.fromBufferAttribute(t,o),op.fromBufferAttribute(t,l),h.setScalar(0),h.addScaledVector(sp,u.x),h.addScaledVector(rp,u.y),h.addScaledVector(op,u.z),h}static isFrontFacing(t,i,o,l){return Vi.subVectors(o,i),Ua.subVectors(t,i),Vi.cross(Ua).dot(l)<0}set(t,i,o){return this.a.copy(t),this.b.copy(i),this.c.copy(o),this}setFromPointsAndIndices(t,i,o,l){return this.a.copy(t[i]),this.b.copy(t[o]),this.c.copy(t[l]),this}setFromAttributeAndIndices(t,i,o,l){return this.a.fromBufferAttribute(t,i),this.b.fromBufferAttribute(t,o),this.c.fromBufferAttribute(t,l),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Vi.subVectors(this.c,this.b),Ua.subVectors(this.a,this.b),Vi.cross(Ua).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ki.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,i){return ki.getBarycoord(t,this.a,this.b,this.c,i)}getInterpolation(t,i,o,l,u){return ki.getInterpolation(t,this.a,this.b,this.c,i,o,l,u)}containsPoint(t){return ki.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ki.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,i){const o=this.a,l=this.b,u=this.c;let h,p;lo.subVectors(l,o),co.subVectors(u,o),np.subVectors(t,o);const m=lo.dot(np),g=co.dot(np);if(m<=0&&g<=0)return i.copy(o);ip.subVectors(t,l);const x=lo.dot(ip),v=co.dot(ip);if(x>=0&&v<=x)return i.copy(l);const S=m*v-x*g;if(S<=0&&m>=0&&x<=0)return h=m/(m-x),i.copy(o).addScaledVector(lo,h);ap.subVectors(t,u);const E=lo.dot(ap),b=co.dot(ap);if(b>=0&&E<=b)return i.copy(u);const T=E*g-m*b;if(T<=0&&g>=0&&b<=0)return p=g/(g-b),i.copy(o).addScaledVector(co,p);const M=x*b-E*v;if(M<=0&&v-x>=0&&E-b>=0)return Ex.subVectors(u,l),p=(v-x)/(v-x+(E-b)),i.copy(l).addScaledVector(Ex,p);const _=1/(M+T+S);return h=T*_,p=S*_,i.copy(o).addScaledVector(lo,h).addScaledVector(co,p)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const ky={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_s={h:0,s:0,l:0},bu={h:0,s:0,l:0};function lp(s,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?s+(t-s)*6*i:i<1/2?t:i<2/3?s+(t-s)*6*(2/3-i):s}class Nt{constructor(t,i,o){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,i,o)}set(t,i,o){if(i===void 0&&o===void 0){const l=t;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(t,i,o);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,i=ti){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Lt.colorSpaceToWorking(this,i),this}setRGB(t,i,o,l=Lt.workingColorSpace){return this.r=t,this.g=i,this.b=o,Lt.colorSpaceToWorking(this,l),this}setHSL(t,i,o,l=Lt.workingColorSpace){if(t=lT(t,1),i=Dt(i,0,1),o=Dt(o,0,1),i===0)this.r=this.g=this.b=o;else{const u=o<=.5?o*(1+i):o+i-o*i,h=2*o-u;this.r=lp(h,u,t+1/3),this.g=lp(h,u,t),this.b=lp(h,u,t-1/3)}return Lt.colorSpaceToWorking(this,l),this}setStyle(t,i=ti){function o(u){u!==void 0&&parseFloat(u)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(t)){let u;const h=l[1],p=l[2];switch(h){case"rgb":case"rgba":if(u=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return o(u[4]),this.setRGB(Math.min(255,parseInt(u[1],10))/255,Math.min(255,parseInt(u[2],10))/255,Math.min(255,parseInt(u[3],10))/255,i);if(u=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return o(u[4]),this.setRGB(Math.min(100,parseInt(u[1],10))/100,Math.min(100,parseInt(u[2],10))/100,Math.min(100,parseInt(u[3],10))/100,i);break;case"hsl":case"hsla":if(u=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return o(u[4]),this.setHSL(parseFloat(u[1])/360,parseFloat(u[2])/100,parseFloat(u[3])/100,i);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(t)){const u=l[1],h=u.length;if(h===3)return this.setRGB(parseInt(u.charAt(0),16)/15,parseInt(u.charAt(1),16)/15,parseInt(u.charAt(2),16)/15,i);if(h===6)return this.setHex(parseInt(u,16),i);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,i);return this}setColorName(t,i=ti){const o=ky[t.toLowerCase()];return o!==void 0?this.setHex(o,i):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ba(t.r),this.g=Ba(t.g),this.b=Ba(t.b),this}copyLinearToSRGB(t){return this.r=yo(t.r),this.g=yo(t.g),this.b=yo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ti){return Lt.workingToColorSpace(Fn.copy(this),t),Math.round(Dt(Fn.r*255,0,255))*65536+Math.round(Dt(Fn.g*255,0,255))*256+Math.round(Dt(Fn.b*255,0,255))}getHexString(t=ti){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,i=Lt.workingColorSpace){Lt.workingToColorSpace(Fn.copy(this),i);const o=Fn.r,l=Fn.g,u=Fn.b,h=Math.max(o,l,u),p=Math.min(o,l,u);let m,g;const x=(p+h)/2;if(p===h)m=0,g=0;else{const v=h-p;switch(g=x<=.5?v/(h+p):v/(2-h-p),h){case o:m=(l-u)/v+(l<u?6:0);break;case l:m=(u-o)/v+2;break;case u:m=(o-l)/v+4;break}m/=6}return t.h=m,t.s=g,t.l=x,t}getRGB(t,i=Lt.workingColorSpace){return Lt.workingToColorSpace(Fn.copy(this),i),t.r=Fn.r,t.g=Fn.g,t.b=Fn.b,t}getStyle(t=ti){Lt.workingToColorSpace(Fn.copy(this),t);const i=Fn.r,o=Fn.g,l=Fn.b;return t!==ti?`color(${t} ${i.toFixed(3)} ${o.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(o*255)},${Math.round(l*255)})`}offsetHSL(t,i,o){return this.getHSL(_s),this.setHSL(_s.h+t,_s.s+i,_s.l+o)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,i){return this.r=t.r+i.r,this.g=t.g+i.g,this.b=t.b+i.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,i){return this.r+=(t.r-this.r)*i,this.g+=(t.g-this.g)*i,this.b+=(t.b-this.b)*i,this}lerpColors(t,i,o){return this.r=t.r+(i.r-t.r)*o,this.g=t.g+(i.g-t.g)*o,this.b=t.b+(i.b-t.b)*o,this}lerpHSL(t,i){this.getHSL(_s),t.getHSL(bu);const o=kh(_s.h,bu.h,i),l=kh(_s.s,bu.s,i),u=kh(_s.l,bu.l,i);return this.setHSL(o,l,u),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const i=this.r,o=this.g,l=this.b,u=t.elements;return this.r=u[0]*i+u[3]*o+u[6]*l,this.g=u[1]*i+u[4]*o+u[7]*l,this.b=u[2]*i+u[5]*o+u[8]*l,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,i=0){return this.r=t[i],this.g=t[i+1],this.b=t[i+2],this}toArray(t=[],i=0){return t[i]=this.r,t[i+1]=this.g,t[i+2]=this.b,t}fromBufferAttribute(t,i){return this.r=t.getX(i),this.g=t.getY(i),this.b=t.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fn=new Nt;Nt.NAMES=ky;let TT=0;class No extends wo{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:TT++}),this.uuid=kl(),this.name="",this.type="Material",this.blending=xo,this.side=Cs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Rp,this.blendDst=wp,this.blendEquation=lr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Nt(0,0,0),this.blendAlpha=0,this.depthFunc=Eo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cx,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=eo,this.stencilZFail=eo,this.stencilZPass=eo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const i in t){const o=t[i];if(o===void 0){console.warn(`THREE.Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(o):l&&l.isVector3&&o&&o.isVector3?l.copy(o):this[i]=o}}toJSON(t){const i=t===void 0||typeof t=="string";i&&(t={textures:{},images:{}});const o={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.color&&this.color.isColor&&(o.color=this.color.getHex()),this.roughness!==void 0&&(o.roughness=this.roughness),this.metalness!==void 0&&(o.metalness=this.metalness),this.sheen!==void 0&&(o.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(o.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(o.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(o.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(o.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(o.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(o.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(o.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(o.shininess=this.shininess),this.clearcoat!==void 0&&(o.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(o.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(o.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(o.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(o.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,o.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(o.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(o.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(o.dispersion=this.dispersion),this.iridescence!==void 0&&(o.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(o.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(o.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(o.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(o.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(o.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(o.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(o.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(o.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(o.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(o.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(o.lightMap=this.lightMap.toJSON(t).uuid,o.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(o.aoMap=this.aoMap.toJSON(t).uuid,o.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(o.bumpMap=this.bumpMap.toJSON(t).uuid,o.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(o.normalMap=this.normalMap.toJSON(t).uuid,o.normalMapType=this.normalMapType,o.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(o.displacementMap=this.displacementMap.toJSON(t).uuid,o.displacementScale=this.displacementScale,o.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(o.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(o.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(o.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(o.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(o.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(o.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(o.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(o.combine=this.combine)),this.envMapRotation!==void 0&&(o.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(o.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(o.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(o.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(o.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(o.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(o.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(o.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(o.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(o.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(o.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(o.size=this.size),this.shadowSide!==null&&(o.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(o.sizeAttenuation=this.sizeAttenuation),this.blending!==xo&&(o.blending=this.blending),this.side!==Cs&&(o.side=this.side),this.vertexColors===!0&&(o.vertexColors=!0),this.opacity<1&&(o.opacity=this.opacity),this.transparent===!0&&(o.transparent=!0),this.blendSrc!==Rp&&(o.blendSrc=this.blendSrc),this.blendDst!==wp&&(o.blendDst=this.blendDst),this.blendEquation!==lr&&(o.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(o.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(o.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(o.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(o.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(o.blendAlpha=this.blendAlpha),this.depthFunc!==Eo&&(o.depthFunc=this.depthFunc),this.depthTest===!1&&(o.depthTest=this.depthTest),this.depthWrite===!1&&(o.depthWrite=this.depthWrite),this.colorWrite===!1&&(o.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(o.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==cx&&(o.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(o.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(o.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==eo&&(o.stencilFail=this.stencilFail),this.stencilZFail!==eo&&(o.stencilZFail=this.stencilZFail),this.stencilZPass!==eo&&(o.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(o.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(o.rotation=this.rotation),this.polygonOffset===!0&&(o.polygonOffset=!0),this.polygonOffsetFactor!==0&&(o.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(o.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(o.linewidth=this.linewidth),this.dashSize!==void 0&&(o.dashSize=this.dashSize),this.gapSize!==void 0&&(o.gapSize=this.gapSize),this.scale!==void 0&&(o.scale=this.scale),this.dithering===!0&&(o.dithering=!0),this.alphaTest>0&&(o.alphaTest=this.alphaTest),this.alphaHash===!0&&(o.alphaHash=!0),this.alphaToCoverage===!0&&(o.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(o.premultipliedAlpha=!0),this.forceSinglePass===!0&&(o.forceSinglePass=!0),this.wireframe===!0&&(o.wireframe=!0),this.wireframeLinewidth>1&&(o.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(o.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(o.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(o.flatShading=!0),this.visible===!1&&(o.visible=!1),this.toneMapped===!1&&(o.toneMapped=!1),this.fog===!1&&(o.fog=!1),Object.keys(this.userData).length>0&&(o.userData=this.userData);function l(u){const h=[];for(const p in u){const m=u[p];delete m.metadata,h.push(m)}return h}if(i){const u=l(t.textures),h=l(t.images);u.length>0&&(o.textures=u),h.length>0&&(o.images=h)}return o}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const i=t.clippingPlanes;let o=null;if(i!==null){const l=i.length;o=new Array(l);for(let u=0;u!==l;++u)o[u]=i[u].clone()}return this.clippingPlanes=o,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class So extends No{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new da,this.combine=My,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const vn=new ae,Au=new pt;let bT=0;class Wi{constructor(t,i,o=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:bT++}),this.name="",this.array=t,this.itemSize=i,this.count=t!==void 0?t.length/i:0,this.normalized=o,this.usage=ux,this.updateRanges=[],this.gpuType=za,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,i,o){t*=this.itemSize,o*=i.itemSize;for(let l=0,u=this.itemSize;l<u;l++)this.array[t+l]=i.array[o+l];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let i=0,o=this.count;i<o;i++)Au.fromBufferAttribute(this,i),Au.applyMatrix3(t),this.setXY(i,Au.x,Au.y);else if(this.itemSize===3)for(let i=0,o=this.count;i<o;i++)vn.fromBufferAttribute(this,i),vn.applyMatrix3(t),this.setXYZ(i,vn.x,vn.y,vn.z);return this}applyMatrix4(t){for(let i=0,o=this.count;i<o;i++)vn.fromBufferAttribute(this,i),vn.applyMatrix4(t),this.setXYZ(i,vn.x,vn.y,vn.z);return this}applyNormalMatrix(t){for(let i=0,o=this.count;i<o;i++)vn.fromBufferAttribute(this,i),vn.applyNormalMatrix(t),this.setXYZ(i,vn.x,vn.y,vn.z);return this}transformDirection(t){for(let i=0,o=this.count;i<o;i++)vn.fromBufferAttribute(this,i),vn.transformDirection(t),this.setXYZ(i,vn.x,vn.y,vn.z);return this}set(t,i=0){return this.array.set(t,i),this}getComponent(t,i){let o=this.array[t*this.itemSize+i];return this.normalized&&(o=Al(o,this.array)),o}setComponent(t,i,o){return this.normalized&&(o=ei(o,this.array)),this.array[t*this.itemSize+i]=o,this}getX(t){let i=this.array[t*this.itemSize];return this.normalized&&(i=Al(i,this.array)),i}setX(t,i){return this.normalized&&(i=ei(i,this.array)),this.array[t*this.itemSize]=i,this}getY(t){let i=this.array[t*this.itemSize+1];return this.normalized&&(i=Al(i,this.array)),i}setY(t,i){return this.normalized&&(i=ei(i,this.array)),this.array[t*this.itemSize+1]=i,this}getZ(t){let i=this.array[t*this.itemSize+2];return this.normalized&&(i=Al(i,this.array)),i}setZ(t,i){return this.normalized&&(i=ei(i,this.array)),this.array[t*this.itemSize+2]=i,this}getW(t){let i=this.array[t*this.itemSize+3];return this.normalized&&(i=Al(i,this.array)),i}setW(t,i){return this.normalized&&(i=ei(i,this.array)),this.array[t*this.itemSize+3]=i,this}setXY(t,i,o){return t*=this.itemSize,this.normalized&&(i=ei(i,this.array),o=ei(o,this.array)),this.array[t+0]=i,this.array[t+1]=o,this}setXYZ(t,i,o,l){return t*=this.itemSize,this.normalized&&(i=ei(i,this.array),o=ei(o,this.array),l=ei(l,this.array)),this.array[t+0]=i,this.array[t+1]=o,this.array[t+2]=l,this}setXYZW(t,i,o,l,u){return t*=this.itemSize,this.normalized&&(i=ei(i,this.array),o=ei(o,this.array),l=ei(l,this.array),u=ei(u,this.array)),this.array[t+0]=i,this.array[t+1]=o,this.array[t+2]=l,this.array[t+3]=u,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ux&&(t.usage=this.usage),t}}class Xy extends Wi{constructor(t,i,o){super(new Uint16Array(t),i,o)}}class qy extends Wi{constructor(t,i,o){super(new Uint32Array(t),i,o)}}class Oi extends Wi{constructor(t,i,o){super(new Float32Array(t),i,o)}}let AT=0;const Ri=new sn,cp=new On,uo=new ae,pi=new ql,Nl=new ql,An=new ae;class Zi extends wo{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:AT++}),this.uuid=kl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Hy(t)?qy:Xy)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,i){return this.attributes[t]=i,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,i,o=0){this.groups.push({start:t,count:i,materialIndex:o})}clearGroups(){this.groups=[]}setDrawRange(t,i){this.drawRange.start=t,this.drawRange.count=i}applyMatrix4(t){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(t),i.needsUpdate=!0);const o=this.attributes.normal;if(o!==void 0){const u=new vt().getNormalMatrix(t);o.applyNormalMatrix(u),o.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(t),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ri.makeRotationFromQuaternion(t),this.applyMatrix4(Ri),this}rotateX(t){return Ri.makeRotationX(t),this.applyMatrix4(Ri),this}rotateY(t){return Ri.makeRotationY(t),this.applyMatrix4(Ri),this}rotateZ(t){return Ri.makeRotationZ(t),this.applyMatrix4(Ri),this}translate(t,i,o){return Ri.makeTranslation(t,i,o),this.applyMatrix4(Ri),this}scale(t,i,o){return Ri.makeScale(t,i,o),this.applyMatrix4(Ri),this}lookAt(t){return cp.lookAt(t),cp.updateMatrix(),this.applyMatrix4(cp.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(uo).negate(),this.translate(uo.x,uo.y,uo.z),this}setFromPoints(t){const i=this.getAttribute("position");if(i===void 0){const o=[];for(let l=0,u=t.length;l<u;l++){const h=t[l];o.push(h.x,h.y,h.z||0)}this.setAttribute("position",new Oi(o,3))}else{const o=Math.min(t.length,i.count);for(let l=0;l<o;l++){const u=t[l];i.setXYZ(l,u.x,u.y,u.z||0)}t.length>i.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ql);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new ae(-1/0,-1/0,-1/0),new ae(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),i)for(let o=0,l=i.length;o<l;o++){const u=i[o];pi.setFromBufferAttribute(u),this.morphTargetsRelative?(An.addVectors(this.boundingBox.min,pi.min),this.boundingBox.expandByPoint(An),An.addVectors(this.boundingBox.max,pi.max),this.boundingBox.expandByPoint(An)):(this.boundingBox.expandByPoint(pi.min),this.boundingBox.expandByPoint(pi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new rf);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new ae,1/0);return}if(t){const o=this.boundingSphere.center;if(pi.setFromBufferAttribute(t),i)for(let u=0,h=i.length;u<h;u++){const p=i[u];Nl.setFromBufferAttribute(p),this.morphTargetsRelative?(An.addVectors(pi.min,Nl.min),pi.expandByPoint(An),An.addVectors(pi.max,Nl.max),pi.expandByPoint(An)):(pi.expandByPoint(Nl.min),pi.expandByPoint(Nl.max))}pi.getCenter(o);let l=0;for(let u=0,h=t.count;u<h;u++)An.fromBufferAttribute(t,u),l=Math.max(l,o.distanceToSquared(An));if(i)for(let u=0,h=i.length;u<h;u++){const p=i[u],m=this.morphTargetsRelative;for(let g=0,x=p.count;g<x;g++)An.fromBufferAttribute(p,g),m&&(uo.fromBufferAttribute(t,g),An.add(uo)),l=Math.max(l,o.distanceToSquared(An))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,i=this.attributes;if(t===null||i.position===void 0||i.normal===void 0||i.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const o=i.position,l=i.normal,u=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Wi(new Float32Array(4*o.count),4));const h=this.getAttribute("tangent"),p=[],m=[];for(let Y=0;Y<o.count;Y++)p[Y]=new ae,m[Y]=new ae;const g=new ae,x=new ae,v=new ae,S=new pt,E=new pt,b=new pt,T=new ae,M=new ae;function _(Y,U,R){g.fromBufferAttribute(o,Y),x.fromBufferAttribute(o,U),v.fromBufferAttribute(o,R),S.fromBufferAttribute(u,Y),E.fromBufferAttribute(u,U),b.fromBufferAttribute(u,R),x.sub(g),v.sub(g),E.sub(S),b.sub(S);const G=1/(E.x*b.y-b.x*E.y);isFinite(G)&&(T.copy(x).multiplyScalar(b.y).addScaledVector(v,-E.y).multiplyScalar(G),M.copy(v).multiplyScalar(E.x).addScaledVector(x,-b.x).multiplyScalar(G),p[Y].add(T),p[U].add(T),p[R].add(T),m[Y].add(M),m[U].add(M),m[R].add(M))}let L=this.groups;L.length===0&&(L=[{start:0,count:t.count}]);for(let Y=0,U=L.length;Y<U;++Y){const R=L[Y],G=R.start,ie=R.count;for(let ue=G,Z=G+ie;ue<Z;ue+=3)_(t.getX(ue+0),t.getX(ue+1),t.getX(ue+2))}const z=new ae,N=new ae,V=new ae,H=new ae;function I(Y){V.fromBufferAttribute(l,Y),H.copy(V);const U=p[Y];z.copy(U),z.sub(V.multiplyScalar(V.dot(U))).normalize(),N.crossVectors(H,U);const G=N.dot(m[Y])<0?-1:1;h.setXYZW(Y,z.x,z.y,z.z,G)}for(let Y=0,U=L.length;Y<U;++Y){const R=L[Y],G=R.start,ie=R.count;for(let ue=G,Z=G+ie;ue<Z;ue+=3)I(t.getX(ue+0)),I(t.getX(ue+1)),I(t.getX(ue+2))}}computeVertexNormals(){const t=this.index,i=this.getAttribute("position");if(i!==void 0){let o=this.getAttribute("normal");if(o===void 0)o=new Wi(new Float32Array(i.count*3),3),this.setAttribute("normal",o);else for(let S=0,E=o.count;S<E;S++)o.setXYZ(S,0,0,0);const l=new ae,u=new ae,h=new ae,p=new ae,m=new ae,g=new ae,x=new ae,v=new ae;if(t)for(let S=0,E=t.count;S<E;S+=3){const b=t.getX(S+0),T=t.getX(S+1),M=t.getX(S+2);l.fromBufferAttribute(i,b),u.fromBufferAttribute(i,T),h.fromBufferAttribute(i,M),x.subVectors(h,u),v.subVectors(l,u),x.cross(v),p.fromBufferAttribute(o,b),m.fromBufferAttribute(o,T),g.fromBufferAttribute(o,M),p.add(x),m.add(x),g.add(x),o.setXYZ(b,p.x,p.y,p.z),o.setXYZ(T,m.x,m.y,m.z),o.setXYZ(M,g.x,g.y,g.z)}else for(let S=0,E=i.count;S<E;S+=3)l.fromBufferAttribute(i,S+0),u.fromBufferAttribute(i,S+1),h.fromBufferAttribute(i,S+2),x.subVectors(h,u),v.subVectors(l,u),x.cross(v),o.setXYZ(S+0,x.x,x.y,x.z),o.setXYZ(S+1,x.x,x.y,x.z),o.setXYZ(S+2,x.x,x.y,x.z);this.normalizeNormals(),o.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let i=0,o=t.count;i<o;i++)An.fromBufferAttribute(t,i),An.normalize(),t.setXYZ(i,An.x,An.y,An.z)}toNonIndexed(){function t(p,m){const g=p.array,x=p.itemSize,v=p.normalized,S=new g.constructor(m.length*x);let E=0,b=0;for(let T=0,M=m.length;T<M;T++){p.isInterleavedBufferAttribute?E=m[T]*p.data.stride+p.offset:E=m[T]*x;for(let _=0;_<x;_++)S[b++]=g[E++]}return new Wi(S,x,v)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new Zi,o=this.index.array,l=this.attributes;for(const p in l){const m=l[p],g=t(m,o);i.setAttribute(p,g)}const u=this.morphAttributes;for(const p in u){const m=[],g=u[p];for(let x=0,v=g.length;x<v;x++){const S=g[x],E=t(S,o);m.push(E)}i.morphAttributes[p]=m}i.morphTargetsRelative=this.morphTargetsRelative;const h=this.groups;for(let p=0,m=h.length;p<m;p++){const g=h[p];i.addGroup(g.start,g.count,g.materialIndex)}return i}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const g in m)m[g]!==void 0&&(t[g]=m[g]);return t}t.data={attributes:{}};const i=this.index;i!==null&&(t.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const o=this.attributes;for(const m in o){const g=o[m];t.data.attributes[m]=g.toJSON(t.data)}const l={};let u=!1;for(const m in this.morphAttributes){const g=this.morphAttributes[m],x=[];for(let v=0,S=g.length;v<S;v++){const E=g[v];x.push(E.toJSON(t.data))}x.length>0&&(l[m]=x,u=!0)}u&&(t.data.morphAttributes=l,t.data.morphTargetsRelative=this.morphTargetsRelative);const h=this.groups;h.length>0&&(t.data.groups=JSON.parse(JSON.stringify(h)));const p=this.boundingSphere;return p!==null&&(t.data.boundingSphere=p.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=t.name;const o=t.index;o!==null&&this.setIndex(o.clone());const l=t.attributes;for(const g in l){const x=l[g];this.setAttribute(g,x.clone(i))}const u=t.morphAttributes;for(const g in u){const x=[],v=u[g];for(let S=0,E=v.length;S<E;S++)x.push(v[S].clone(i));this.morphAttributes[g]=x}this.morphTargetsRelative=t.morphTargetsRelative;const h=t.groups;for(let g=0,x=h.length;g<x;g++){const v=h[g];this.addGroup(v.start,v.count,v.materialIndex)}const p=t.boundingBox;p!==null&&(this.boundingBox=p.clone());const m=t.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Tx=new sn,tr=new Gy,Cu=new rf,bx=new ae,Ru=new ae,wu=new ae,Nu=new ae,up=new ae,Du=new ae,Ax=new ae,Uu=new ae;class gi extends On{constructor(t=new Zi,i=new So){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,o=Object.keys(i);if(o.length>0){const l=i[o[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,h=l.length;u<h;u++){const p=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[p]=u}}}}getVertexPosition(t,i){const o=this.geometry,l=o.attributes.position,u=o.morphAttributes.position,h=o.morphTargetsRelative;i.fromBufferAttribute(l,t);const p=this.morphTargetInfluences;if(u&&p){Du.set(0,0,0);for(let m=0,g=u.length;m<g;m++){const x=p[m],v=u[m];x!==0&&(up.fromBufferAttribute(v,t),h?Du.addScaledVector(up,x):Du.addScaledVector(up.sub(i),x))}i.add(Du)}return i}raycast(t,i){const o=this.geometry,l=this.material,u=this.matrixWorld;l!==void 0&&(o.boundingSphere===null&&o.computeBoundingSphere(),Cu.copy(o.boundingSphere),Cu.applyMatrix4(u),tr.copy(t.ray).recast(t.near),!(Cu.containsPoint(tr.origin)===!1&&(tr.intersectSphere(Cu,bx)===null||tr.origin.distanceToSquared(bx)>(t.far-t.near)**2))&&(Tx.copy(u).invert(),tr.copy(t.ray).applyMatrix4(Tx),!(o.boundingBox!==null&&tr.intersectsBox(o.boundingBox)===!1)&&this._computeIntersections(t,i,tr)))}_computeIntersections(t,i,o){let l;const u=this.geometry,h=this.material,p=u.index,m=u.attributes.position,g=u.attributes.uv,x=u.attributes.uv1,v=u.attributes.normal,S=u.groups,E=u.drawRange;if(p!==null)if(Array.isArray(h))for(let b=0,T=S.length;b<T;b++){const M=S[b],_=h[M.materialIndex],L=Math.max(M.start,E.start),z=Math.min(p.count,Math.min(M.start+M.count,E.start+E.count));for(let N=L,V=z;N<V;N+=3){const H=p.getX(N),I=p.getX(N+1),Y=p.getX(N+2);l=Lu(this,_,t,o,g,x,v,H,I,Y),l&&(l.faceIndex=Math.floor(N/3),l.face.materialIndex=M.materialIndex,i.push(l))}}else{const b=Math.max(0,E.start),T=Math.min(p.count,E.start+E.count);for(let M=b,_=T;M<_;M+=3){const L=p.getX(M),z=p.getX(M+1),N=p.getX(M+2);l=Lu(this,h,t,o,g,x,v,L,z,N),l&&(l.faceIndex=Math.floor(M/3),i.push(l))}}else if(m!==void 0)if(Array.isArray(h))for(let b=0,T=S.length;b<T;b++){const M=S[b],_=h[M.materialIndex],L=Math.max(M.start,E.start),z=Math.min(m.count,Math.min(M.start+M.count,E.start+E.count));for(let N=L,V=z;N<V;N+=3){const H=N,I=N+1,Y=N+2;l=Lu(this,_,t,o,g,x,v,H,I,Y),l&&(l.faceIndex=Math.floor(N/3),l.face.materialIndex=M.materialIndex,i.push(l))}}else{const b=Math.max(0,E.start),T=Math.min(m.count,E.start+E.count);for(let M=b,_=T;M<_;M+=3){const L=M,z=M+1,N=M+2;l=Lu(this,h,t,o,g,x,v,L,z,N),l&&(l.faceIndex=Math.floor(M/3),i.push(l))}}}}function CT(s,t,i,o,l,u,h,p){let m;if(t.side===ii?m=o.intersectTriangle(h,u,l,!0,p):m=o.intersectTriangle(l,u,h,t.side===Cs,p),m===null)return null;Uu.copy(p),Uu.applyMatrix4(s.matrixWorld);const g=i.ray.origin.distanceTo(Uu);return g<i.near||g>i.far?null:{distance:g,point:Uu.clone(),object:s}}function Lu(s,t,i,o,l,u,h,p,m,g){s.getVertexPosition(p,Ru),s.getVertexPosition(m,wu),s.getVertexPosition(g,Nu);const x=CT(s,t,i,o,Ru,wu,Nu,Ax);if(x){const v=new ae;ki.getBarycoord(Ax,Ru,wu,Nu,v),l&&(x.uv=ki.getInterpolatedAttribute(l,p,m,g,v,new pt)),u&&(x.uv1=ki.getInterpolatedAttribute(u,p,m,g,v,new pt)),h&&(x.normal=ki.getInterpolatedAttribute(h,p,m,g,v,new ae),x.normal.dot(o.direction)>0&&x.normal.multiplyScalar(-1));const S={a:p,b:m,c:g,normal:new ae,materialIndex:0};ki.getNormal(Ru,wu,Nu,S.normal),x.face=S,x.barycoord=v}return x}class Do extends Zi{constructor(t=1,i=1,o=1,l=1,u=1,h=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:i,depth:o,widthSegments:l,heightSegments:u,depthSegments:h};const p=this;l=Math.floor(l),u=Math.floor(u),h=Math.floor(h);const m=[],g=[],x=[],v=[];let S=0,E=0;b("z","y","x",-1,-1,o,i,t,h,u,0),b("z","y","x",1,-1,o,i,-t,h,u,1),b("x","z","y",1,1,t,o,i,l,h,2),b("x","z","y",1,-1,t,o,-i,l,h,3),b("x","y","z",1,-1,t,i,o,l,u,4),b("x","y","z",-1,-1,t,i,-o,l,u,5),this.setIndex(m),this.setAttribute("position",new Oi(g,3)),this.setAttribute("normal",new Oi(x,3)),this.setAttribute("uv",new Oi(v,2));function b(T,M,_,L,z,N,V,H,I,Y,U){const R=N/I,G=V/Y,ie=N/2,ue=V/2,Z=H/2,B=I+1,O=Y+1;let k=0,X=0;const ve=new ae;for(let _e=0;_e<O;_e++){const He=_e*G-ue;for(let $e=0;$e<B;$e++){const xt=$e*R-ie;ve[T]=xt*L,ve[M]=He*z,ve[_]=Z,g.push(ve.x,ve.y,ve.z),ve[T]=0,ve[M]=0,ve[_]=H>0?1:-1,x.push(ve.x,ve.y,ve.z),v.push($e/I),v.push(1-_e/Y),k+=1}}for(let _e=0;_e<Y;_e++)for(let He=0;He<I;He++){const $e=S+He+B*_e,xt=S+He+B*(_e+1),j=S+(He+1)+B*(_e+1),de=S+(He+1)+B*_e;m.push($e,xt,de),m.push(xt,j,de),X+=6}p.addGroup(E,X,U),E+=X,S+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Do(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Co(s){const t={};for(const i in s){t[i]={};for(const o in s[i]){const l=s[i][o];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[i][o]=null):t[i][o]=l.clone():Array.isArray(l)?t[i][o]=l.slice():t[i][o]=l}}return t}function qn(s){const t={};for(let i=0;i<s.length;i++){const o=Co(s[i]);for(const l in o)t[l]=o[l]}return t}function RT(s){const t=[];for(let i=0;i<s.length;i++)t.push(s[i].clone());return t}function Yy(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Lt.workingColorSpace}const Gl={clone:Co,merge:qn};var wT=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,NT=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Yn extends No{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=wT,this.fragmentShader=NT,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Co(t.uniforms),this.uniformsGroups=RT(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const i=super.toJSON(t);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const h=this.uniforms[l].value;h&&h.isTexture?i.uniforms[l]={type:"t",value:h.toJSON(t).uuid}:h&&h.isColor?i.uniforms[l]={type:"c",value:h.getHex()}:h&&h.isVector2?i.uniforms[l]={type:"v2",value:h.toArray()}:h&&h.isVector3?i.uniforms[l]={type:"v3",value:h.toArray()}:h&&h.isVector4?i.uniforms[l]={type:"v4",value:h.toArray()}:h&&h.isMatrix3?i.uniforms[l]={type:"m3",value:h.toArray()}:h&&h.isMatrix4?i.uniforms[l]={type:"m4",value:h.toArray()}:i.uniforms[l]={value:h}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const o={};for(const l in this.extensions)this.extensions[l]===!0&&(o[l]=!0);return Object.keys(o).length>0&&(i.extensions=o),i}}class Wy extends On{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new sn,this.projectionMatrix=new sn,this.projectionMatrixInverse=new sn,this.coordinateSystem=ua,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,i){return super.copy(t,i),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,i){super.updateWorldMatrix(t,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const xs=new ae,Cx=new pt,Rx=new pt;class Ni extends Wy{constructor(t=50,i=1,o=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=o,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const i=.5*this.getFilmHeight()/t;this.fov=mm*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Vh*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return mm*2*Math.atan(Math.tan(Vh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,i,o){xs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(xs.x,xs.y).multiplyScalar(-t/xs.z),xs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),o.set(xs.x,xs.y).multiplyScalar(-t/xs.z)}getViewSize(t,i){return this.getViewBounds(t,Cx,Rx),i.subVectors(Rx,Cx)}setViewOffset(t,i,o,l,u,h){this.aspect=t/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=o,this.view.offsetY=l,this.view.width=u,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let i=t*Math.tan(Vh*.5*this.fov)/this.zoom,o=2*i,l=this.aspect*o,u=-.5*l;const h=this.view;if(this.view!==null&&this.view.enabled){const m=h.fullWidth,g=h.fullHeight;u+=h.offsetX*l/m,i-=h.offsetY*o/g,l*=h.width/m,o*=h.height/g}const p=this.filmOffset;p!==0&&(u+=t*p/this.getFilmWidth()),this.projectionMatrix.makePerspective(u,u+l,i,i-o,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const fo=-90,ho=1;class DT extends On{constructor(t,i,o){super(),this.type="CubeCamera",this.renderTarget=o,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new Ni(fo,ho,t,i);l.layers=this.layers,this.add(l);const u=new Ni(fo,ho,t,i);u.layers=this.layers,this.add(u);const h=new Ni(fo,ho,t,i);h.layers=this.layers,this.add(h);const p=new Ni(fo,ho,t,i);p.layers=this.layers,this.add(p);const m=new Ni(fo,ho,t,i);m.layers=this.layers,this.add(m);const g=new Ni(fo,ho,t,i);g.layers=this.layers,this.add(g)}updateCoordinateSystem(){const t=this.coordinateSystem,i=this.children.concat(),[o,l,u,h,p,m]=i;for(const g of i)this.remove(g);if(t===ua)o.up.set(0,1,0),o.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),u.up.set(0,0,-1),u.lookAt(0,1,0),h.up.set(0,0,1),h.lookAt(0,-1,0),p.up.set(0,1,0),p.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(t===$u)o.up.set(0,-1,0),o.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),u.up.set(0,0,1),u.lookAt(0,1,0),h.up.set(0,0,-1),h.lookAt(0,-1,0),p.up.set(0,-1,0),p.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const g of i)this.add(g),g.updateMatrixWorld()}update(t,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:o,activeMipmapLevel:l}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[u,h,p,m,g,x]=this.children,v=t.getRenderTarget(),S=t.getActiveCubeFace(),E=t.getActiveMipmapLevel(),b=t.xr.enabled;t.xr.enabled=!1;const T=o.texture.generateMipmaps;o.texture.generateMipmaps=!1,t.setRenderTarget(o,0,l),t.render(i,u),t.setRenderTarget(o,1,l),t.render(i,h),t.setRenderTarget(o,2,l),t.render(i,p),t.setRenderTarget(o,3,l),t.render(i,m),t.setRenderTarget(o,4,l),t.render(i,g),o.texture.generateMipmaps=T,t.setRenderTarget(o,5,l),t.render(i,x),t.setRenderTarget(v,S,E),t.xr.enabled=b,o.texture.needsPMREMUpdate=!0}}class Zy extends Wn{constructor(t=[],i=To,o,l,u,h,p,m,g,x){super(t,i,o,l,u,h,p,m,g,x),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class UT extends Yi{constructor(t=1,i={}){super(t,t,i),this.isWebGLCubeRenderTarget=!0;const o={width:t,height:t,depth:1},l=[o,o,o,o,o,o];this.texture=new Zy(l),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const o={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},l=new Do(5,5,5),u=new Yn({name:"CubemapFromEquirect",uniforms:Co(o.uniforms),vertexShader:o.vertexShader,fragmentShader:o.fragmentShader,side:ii,blending:Pa});u.uniforms.tEquirect.value=i;const h=new gi(l,u),p=i.minFilter;return i.minFilter===fr&&(i.minFilter=Xi),new DT(1,10,this).update(t,h),i.minFilter=p,h.geometry.dispose(),h.material.dispose(),this}clear(t,i=!0,o=!0,l=!0){const u=t.getRenderTarget();for(let h=0;h<6;h++)t.setRenderTarget(this,h),t.clear(i,o,l);t.setRenderTarget(u)}}class Ou extends On{constructor(){super(),this.isGroup=!0,this.type="Group"}}const LT={type:"move"};class fp{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ou,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ou,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new ae,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new ae),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ou,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new ae,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new ae),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const i=this._hand;if(i)for(const o of t.hand.values())this._getHandJoint(i,o)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,i,o){let l=null,u=null,h=null;const p=this._targetRay,m=this._grip,g=this._hand;if(t&&i.session.visibilityState!=="visible-blurred"){if(g&&t.hand){h=!0;for(const T of t.hand.values()){const M=i.getJointPose(T,o),_=this._getHandJoint(g,T);M!==null&&(_.matrix.fromArray(M.transform.matrix),_.matrix.decompose(_.position,_.rotation,_.scale),_.matrixWorldNeedsUpdate=!0,_.jointRadius=M.radius),_.visible=M!==null}const x=g.joints["index-finger-tip"],v=g.joints["thumb-tip"],S=x.position.distanceTo(v.position),E=.02,b=.005;g.inputState.pinching&&S>E+b?(g.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!g.inputState.pinching&&S<=E-b&&(g.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else m!==null&&t.gripSpace&&(u=i.getPose(t.gripSpace,o),u!==null&&(m.matrix.fromArray(u.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,u.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(u.linearVelocity)):m.hasLinearVelocity=!1,u.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(u.angularVelocity)):m.hasAngularVelocity=!1));p!==null&&(l=i.getPose(t.targetRaySpace,o),l===null&&u!==null&&(l=u),l!==null&&(p.matrix.fromArray(l.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,l.linearVelocity?(p.hasLinearVelocity=!0,p.linearVelocity.copy(l.linearVelocity)):p.hasLinearVelocity=!1,l.angularVelocity?(p.hasAngularVelocity=!0,p.angularVelocity.copy(l.angularVelocity)):p.hasAngularVelocity=!1,this.dispatchEvent(LT)))}return p!==null&&(p.visible=l!==null),m!==null&&(m.visible=u!==null),g!==null&&(g.visible=h!==null),this}_getHandJoint(t,i){if(t.joints[i.jointName]===void 0){const o=new Ou;o.matrixAutoUpdate=!1,o.visible=!1,t.joints[i.jointName]=o,t.add(o)}return t.joints[i.jointName]}}class OT extends On{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new da,this.environmentIntensity=1,this.environmentRotation=new da,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,i){return super.copy(t,i),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const i=super.toJSON(t);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}const dp=new ae,zT=new ae,PT=new vt;class rr{constructor(t=new ae(1,0,0),i=0){this.isPlane=!0,this.normal=t,this.constant=i}set(t,i){return this.normal.copy(t),this.constant=i,this}setComponents(t,i,o,l){return this.normal.set(t,i,o),this.constant=l,this}setFromNormalAndCoplanarPoint(t,i){return this.normal.copy(t),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(t,i,o){const l=dp.subVectors(o,i).cross(zT.subVectors(t,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,i){return i.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,i){const o=t.delta(dp),l=this.normal.dot(o);if(l===0)return this.distanceToPoint(t.start)===0?i.copy(t.start):null;const u=-(t.start.dot(this.normal)+this.constant)/l;return u<0||u>1?null:i.copy(t.start).addScaledVector(o,u)}intersectsLine(t){const i=this.distanceToPoint(t.start),o=this.distanceToPoint(t.end);return i<0&&o>0||o<0&&i>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,i){const o=i||PT.getNormalMatrix(t),l=this.coplanarPoint(dp).applyMatrix4(t),u=this.normal.applyMatrix3(o).normalize();return this.constant=-l.dot(u),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const nr=new rf,IT=new pt(.5,.5),zu=new ae;class Lm{constructor(t=new rr,i=new rr,o=new rr,l=new rr,u=new rr,h=new rr){this.planes=[t,i,o,l,u,h]}set(t,i,o,l,u,h){const p=this.planes;return p[0].copy(t),p[1].copy(i),p[2].copy(o),p[3].copy(l),p[4].copy(u),p[5].copy(h),this}copy(t){const i=this.planes;for(let o=0;o<6;o++)i[o].copy(t.planes[o]);return this}setFromProjectionMatrix(t,i=ua,o=!1){const l=this.planes,u=t.elements,h=u[0],p=u[1],m=u[2],g=u[3],x=u[4],v=u[5],S=u[6],E=u[7],b=u[8],T=u[9],M=u[10],_=u[11],L=u[12],z=u[13],N=u[14],V=u[15];if(l[0].setComponents(g-h,E-x,_-b,V-L).normalize(),l[1].setComponents(g+h,E+x,_+b,V+L).normalize(),l[2].setComponents(g+p,E+v,_+T,V+z).normalize(),l[3].setComponents(g-p,E-v,_-T,V-z).normalize(),o)l[4].setComponents(m,S,M,N).normalize(),l[5].setComponents(g-m,E-S,_-M,V-N).normalize();else if(l[4].setComponents(g-m,E-S,_-M,V-N).normalize(),i===ua)l[5].setComponents(g+m,E+S,_+M,V+N).normalize();else if(i===$u)l[5].setComponents(m,S,M,N).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),nr.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const i=t.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),nr.copy(i.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(nr)}intersectsSprite(t){nr.center.set(0,0,0);const i=IT.distanceTo(t.center);return nr.radius=.7071067811865476+i,nr.applyMatrix4(t.matrixWorld),this.intersectsSphere(nr)}intersectsSphere(t){const i=this.planes,o=t.center,l=-t.radius;for(let u=0;u<6;u++)if(i[u].distanceToPoint(o)<l)return!1;return!0}intersectsBox(t){const i=this.planes;for(let o=0;o<6;o++){const l=i[o];if(zu.x=l.normal.x>0?t.max.x:t.min.x,zu.y=l.normal.y>0?t.max.y:t.min.y,zu.z=l.normal.z>0?t.max.z:t.min.z,l.distanceToPoint(zu)<0)return!1}return!0}containsPoint(t){const i=this.planes;for(let o=0;o<6;o++)if(i[o].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ky extends No{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Nt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const wx=new sn,gm=new Gy,Pu=new rf,Iu=new ae;class BT extends On{constructor(t=new Zi,i=new Ky){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,i){const o=this.geometry,l=this.matrixWorld,u=t.params.Points.threshold,h=o.drawRange;if(o.boundingSphere===null&&o.computeBoundingSphere(),Pu.copy(o.boundingSphere),Pu.applyMatrix4(l),Pu.radius+=u,t.ray.intersectsSphere(Pu)===!1)return;wx.copy(l).invert(),gm.copy(t.ray).applyMatrix4(wx);const p=u/((this.scale.x+this.scale.y+this.scale.z)/3),m=p*p,g=o.index,v=o.attributes.position;if(g!==null){const S=Math.max(0,h.start),E=Math.min(g.count,h.start+h.count);for(let b=S,T=E;b<T;b++){const M=g.getX(b);Iu.fromBufferAttribute(v,M),Nx(Iu,M,m,l,t,i,this)}}else{const S=Math.max(0,h.start),E=Math.min(v.count,h.start+h.count);for(let b=S,T=E;b<T;b++)Iu.fromBufferAttribute(v,b),Nx(Iu,b,m,l,t,i,this)}}updateMorphTargets(){const i=this.geometry.morphAttributes,o=Object.keys(i);if(o.length>0){const l=i[o[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,h=l.length;u<h;u++){const p=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[p]=u}}}}}function Nx(s,t,i,o,l,u,h){const p=gm.distanceSqToPoint(s);if(p<i){const m=new ae;gm.closestPointToPoint(s,m),m.applyMatrix4(o);const g=l.ray.origin.distanceTo(m);if(g<l.near||g>l.far)return;u.push({distance:g,distanceToRay:Math.sqrt(p),point:m,index:t,face:null,faceIndex:null,barycoord:null,object:h})}}class Qy extends Wn{constructor(t,i,o=hr,l,u,h,p=Li,m=Li,g,x=Bl,v=1){if(x!==Bl&&x!==Fl)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const S={width:t,height:i,depth:v};super(S,l,u,h,p,m,x,o,g),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Um(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const i=super.toJSON(t);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class Jy extends Wn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Om extends Zi{constructor(t=1,i=32,o=0,l=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:i,thetaStart:o,thetaLength:l},i=Math.max(3,i);const u=[],h=[],p=[],m=[],g=new ae,x=new pt;h.push(0,0,0),p.push(0,0,1),m.push(.5,.5);for(let v=0,S=3;v<=i;v++,S+=3){const E=o+v/i*l;g.x=t*Math.cos(E),g.y=t*Math.sin(E),h.push(g.x,g.y,g.z),p.push(0,0,1),x.x=(h[S]/t+1)/2,x.y=(h[S+1]/t+1)/2,m.push(x.x,x.y)}for(let v=1;v<=i;v++)u.push(v,v+1,0);this.setIndex(u),this.setAttribute("position",new Oi(h,3)),this.setAttribute("normal",new Oi(p,3)),this.setAttribute("uv",new Oi(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Om(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Yl extends Zi{constructor(t=1,i=1,o=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:i,widthSegments:o,heightSegments:l};const u=t/2,h=i/2,p=Math.floor(o),m=Math.floor(l),g=p+1,x=m+1,v=t/p,S=i/m,E=[],b=[],T=[],M=[];for(let _=0;_<x;_++){const L=_*S-h;for(let z=0;z<g;z++){const N=z*v-u;b.push(N,-L,0),T.push(0,0,1),M.push(z/p),M.push(1-_/m)}}for(let _=0;_<m;_++)for(let L=0;L<p;L++){const z=L+g*_,N=L+g*(_+1),V=L+1+g*(_+1),H=L+1+g*_;E.push(z,N,H),E.push(N,V,H)}this.setIndex(E),this.setAttribute("position",new Oi(b,3)),this.setAttribute("normal",new Oi(T,3)),this.setAttribute("uv",new Oi(M,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yl(t.width,t.height,t.widthSegments,t.heightSegments)}}class FT extends Yn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class hp extends No{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Nt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=By,this.normalScale=new pt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new da,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class HT extends No{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=JE,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class jT extends No{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const pp={enabled:!1,files:{},add:function(s,t){this.enabled!==!1&&(this.files[s]=t)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class GT{constructor(t,i,o){const l=this;let u=!1,h=0,p=0,m;const g=[];this.onStart=void 0,this.onLoad=t,this.onProgress=i,this.onError=o,this.abortController=new AbortController,this.itemStart=function(x){p++,u===!1&&l.onStart!==void 0&&l.onStart(x,h,p),u=!0},this.itemEnd=function(x){h++,l.onProgress!==void 0&&l.onProgress(x,h,p),h===p&&(u=!1,l.onLoad!==void 0&&l.onLoad())},this.itemError=function(x){l.onError!==void 0&&l.onError(x)},this.resolveURL=function(x){return m?m(x):x},this.setURLModifier=function(x){return m=x,this},this.addHandler=function(x,v){return g.push(x,v),this},this.removeHandler=function(x){const v=g.indexOf(x);return v!==-1&&g.splice(v,2),this},this.getHandler=function(x){for(let v=0,S=g.length;v<S;v+=2){const E=g[v],b=g[v+1];if(E.global&&(E.lastIndex=0),E.test(x))return b}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const VT=new GT;class zm{constructor(t){this.manager=t!==void 0?t:VT,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,i){const o=this;return new Promise(function(l,u){o.load(t,l,i,u)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}zm.DEFAULT_MATERIAL_NAME="__DEFAULT";const po=new WeakMap;class kT extends zm{constructor(t){super(t)}load(t,i,o,l){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const u=this,h=pp.get(`image:${t}`);if(h!==void 0){if(h.complete===!0)u.manager.itemStart(t),setTimeout(function(){i&&i(h),u.manager.itemEnd(t)},0);else{let v=po.get(h);v===void 0&&(v=[],po.set(h,v)),v.push({onLoad:i,onError:l})}return h}const p=Hl("img");function m(){x(),i&&i(this);const v=po.get(this)||[];for(let S=0;S<v.length;S++){const E=v[S];E.onLoad&&E.onLoad(this)}po.delete(this),u.manager.itemEnd(t)}function g(v){x(),l&&l(v),pp.remove(`image:${t}`);const S=po.get(this)||[];for(let E=0;E<S.length;E++){const b=S[E];b.onError&&b.onError(v)}po.delete(this),u.manager.itemError(t),u.manager.itemEnd(t)}function x(){p.removeEventListener("load",m,!1),p.removeEventListener("error",g,!1)}return p.addEventListener("load",m,!1),p.addEventListener("error",g,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(p.crossOrigin=this.crossOrigin),pp.add(`image:${t}`,p),u.manager.itemStart(t),p.src=t,p}}class XT extends zm{constructor(t){super(t)}load(t,i,o,l){const u=new Wn,h=new kT(this.manager);return h.setCrossOrigin(this.crossOrigin),h.setPath(this.path),h.load(t,function(p){u.image=p,u.needsUpdate=!0,i!==void 0&&i(u)},o,l),u}}class Pm extends On{constructor(t,i=1){super(),this.isLight=!0,this.type="Light",this.color=new Nt(t),this.intensity=i}dispose(){}copy(t,i){return super.copy(t,i),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const i=super.toJSON(t);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,this.groundColor!==void 0&&(i.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(i.object.distance=this.distance),this.angle!==void 0&&(i.object.angle=this.angle),this.decay!==void 0&&(i.object.decay=this.decay),this.penumbra!==void 0&&(i.object.penumbra=this.penumbra),this.shadow!==void 0&&(i.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(i.object.target=this.target.uuid),i}}const mp=new sn,Dx=new ae,Ux=new ae;class $y{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new pt(512,512),this.mapType=fa,this.map=null,this.mapPass=null,this.matrix=new sn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Lm,this._frameExtents=new pt(1,1),this._viewportCount=1,this._viewports=[new Wt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const i=this.camera,o=this.matrix;Dx.setFromMatrixPosition(t.matrixWorld),i.position.copy(Dx),Ux.setFromMatrixPosition(t.target.matrixWorld),i.lookAt(Ux),i.updateMatrixWorld(),mp.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(mp,i.coordinateSystem,i.reversedDepth),i.reversedDepth?o.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):o.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),o.multiply(mp)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Lx=new sn,Dl=new ae,gp=new ae;class qT extends $y{constructor(){super(new Ni(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new pt(4,2),this._viewportCount=6,this._viewports=[new Wt(2,1,1,1),new Wt(0,1,1,1),new Wt(3,1,1,1),new Wt(1,1,1,1),new Wt(3,0,1,1),new Wt(1,0,1,1)],this._cubeDirections=[new ae(1,0,0),new ae(-1,0,0),new ae(0,0,1),new ae(0,0,-1),new ae(0,1,0),new ae(0,-1,0)],this._cubeUps=[new ae(0,1,0),new ae(0,1,0),new ae(0,1,0),new ae(0,1,0),new ae(0,0,1),new ae(0,0,-1)]}updateMatrices(t,i=0){const o=this.camera,l=this.matrix,u=t.distance||o.far;u!==o.far&&(o.far=u,o.updateProjectionMatrix()),Dl.setFromMatrixPosition(t.matrixWorld),o.position.copy(Dl),gp.copy(o.position),gp.add(this._cubeDirections[i]),o.up.copy(this._cubeUps[i]),o.lookAt(gp),o.updateMatrixWorld(),l.makeTranslation(-Dl.x,-Dl.y,-Dl.z),Lx.multiplyMatrices(o.projectionMatrix,o.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Lx,o.coordinateSystem,o.reversedDepth)}}class YT extends Pm{constructor(t,i,o=0,l=2){super(t,i),this.isPointLight=!0,this.type="PointLight",this.distance=o,this.decay=l,this.shadow=new qT}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,i){return super.copy(t,i),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class of extends Wy{constructor(t=-1,i=1,o=1,l=-1,u=.1,h=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=i,this.top=o,this.bottom=l,this.near=u,this.far=h,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,i,o,l,u,h){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=o,this.view.offsetY=l,this.view.width=u,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),o=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let u=o-t,h=o+t,p=l+i,m=l-i;if(this.view!==null&&this.view.enabled){const g=(this.right-this.left)/this.view.fullWidth/this.zoom,x=(this.top-this.bottom)/this.view.fullHeight/this.zoom;u+=g*this.view.offsetX,h=u+g*this.view.width,p-=x*this.view.offsetY,m=p-x*this.view.height}this.projectionMatrix.makeOrthographic(u,h,p,m,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class WT extends $y{constructor(){super(new of(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ZT extends Pm{constructor(t,i){super(t,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(On.DEFAULT_UP),this.updateMatrix(),this.target=new On,this.shadow=new WT}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class KT extends Pm{constructor(t,i){super(t,i),this.isAmbientLight=!0,this.type="AmbientLight"}}class QT extends Ni{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class eS{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const i=performance.now();t=(i-this.oldTime)/1e3,this.oldTime=i,this.elapsedTime+=t}return t}}function Ox(s,t,i,o){const l=JT(o);switch(i){case Oy:return s*t;case Py:return s*t/l.components*l.byteLength;case wm:return s*t/l.components*l.byteLength;case Iy:return s*t*2/l.components*l.byteLength;case Nm:return s*t*2/l.components*l.byteLength;case zy:return s*t*3/l.components*l.byteLength;case qi:return s*t*4/l.components*l.byteLength;case Dm:return s*t*4/l.components*l.byteLength;case ku:case Xu:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case qu:case Yu:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Gp:case kp:return Math.max(s,16)*Math.max(t,8)/4;case jp:case Vp:return Math.max(s,8)*Math.max(t,8)/2;case Xp:case qp:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Yp:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Wp:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Zp:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Kp:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Qp:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Jp:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case $p:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case em:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case tm:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case nm:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case im:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case am:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case sm:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case rm:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case om:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case lm:case cm:case um:return Math.ceil(s/4)*Math.ceil(t/4)*16;case fm:case dm:return Math.ceil(s/4)*Math.ceil(t/4)*8;case hm:case pm:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function JT(s){switch(s){case fa:case Ny:return{byteLength:1,components:1};case Pl:case Dy:case Ia:return{byteLength:2,components:1};case Cm:case Rm:return{byteLength:2,components:4};case hr:case Am:case za:return{byteLength:4,components:1};case Uy:case Ly:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Tm}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Tm);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function tS(){let s=null,t=!1,i=null,o=null;function l(u,h){i(u,h),o=s.requestAnimationFrame(l)}return{start:function(){t!==!0&&i!==null&&(o=s.requestAnimationFrame(l),t=!0)},stop:function(){s.cancelAnimationFrame(o),t=!1},setAnimationLoop:function(u){i=u},setContext:function(u){s=u}}}function $T(s){const t=new WeakMap;function i(p,m){const g=p.array,x=p.usage,v=g.byteLength,S=s.createBuffer();s.bindBuffer(m,S),s.bufferData(m,g,x),p.onUploadCallback();let E;if(g instanceof Float32Array)E=s.FLOAT;else if(typeof Float16Array<"u"&&g instanceof Float16Array)E=s.HALF_FLOAT;else if(g instanceof Uint16Array)p.isFloat16BufferAttribute?E=s.HALF_FLOAT:E=s.UNSIGNED_SHORT;else if(g instanceof Int16Array)E=s.SHORT;else if(g instanceof Uint32Array)E=s.UNSIGNED_INT;else if(g instanceof Int32Array)E=s.INT;else if(g instanceof Int8Array)E=s.BYTE;else if(g instanceof Uint8Array)E=s.UNSIGNED_BYTE;else if(g instanceof Uint8ClampedArray)E=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+g);return{buffer:S,type:E,bytesPerElement:g.BYTES_PER_ELEMENT,version:p.version,size:v}}function o(p,m,g){const x=m.array,v=m.updateRanges;if(s.bindBuffer(g,p),v.length===0)s.bufferSubData(g,0,x);else{v.sort((E,b)=>E.start-b.start);let S=0;for(let E=1;E<v.length;E++){const b=v[S],T=v[E];T.start<=b.start+b.count+1?b.count=Math.max(b.count,T.start+T.count-b.start):(++S,v[S]=T)}v.length=S+1;for(let E=0,b=v.length;E<b;E++){const T=v[E];s.bufferSubData(g,T.start*x.BYTES_PER_ELEMENT,x,T.start,T.count)}m.clearUpdateRanges()}m.onUploadCallback()}function l(p){return p.isInterleavedBufferAttribute&&(p=p.data),t.get(p)}function u(p){p.isInterleavedBufferAttribute&&(p=p.data);const m=t.get(p);m&&(s.deleteBuffer(m.buffer),t.delete(p))}function h(p,m){if(p.isInterleavedBufferAttribute&&(p=p.data),p.isGLBufferAttribute){const x=t.get(p);(!x||x.version<p.version)&&t.set(p,{buffer:p.buffer,type:p.type,bytesPerElement:p.elementSize,version:p.version});return}const g=t.get(p);if(g===void 0)t.set(p,i(p,m));else if(g.version<p.version){if(g.size!==p.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(g.buffer,p,m),g.version=p.version}}return{get:l,remove:u,update:h}}var eb=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,tb=`#ifdef USE_ALPHAHASH
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
#endif`,nb=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ib=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ab=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,sb=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,rb=`#ifdef USE_AOMAP
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
#endif`,ob=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,lb=`#ifdef USE_BATCHING
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
#endif`,cb=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ub=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,fb=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,db=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,hb=`#ifdef USE_IRIDESCENCE
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
#endif`,pb=`#ifdef USE_BUMPMAP
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
#endif`,mb=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,gb=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vb=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,_b=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,xb=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,yb=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Sb=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Mb=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Eb=`#define PI 3.141592653589793
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
} // validated`,Tb=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,bb=`vec3 transformedNormal = objectNormal;
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
#endif`,Ab=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Cb=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Rb=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,wb=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Nb="gl_FragColor = linearToOutputTexel( gl_FragColor );",Db=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ub=`#ifdef USE_ENVMAP
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
#endif`,Lb=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ob=`#ifdef USE_ENVMAP
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
#endif`,zb=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Pb=`#ifdef USE_ENVMAP
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
#endif`,Ib=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Bb=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fb=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Hb=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jb=`#ifdef USE_GRADIENTMAP
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
}`,Gb=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Vb=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,kb=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Xb=`uniform bool receiveShadow;
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
#endif`,qb=`#ifdef USE_ENVMAP
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
#endif`,Yb=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Wb=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Zb=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Kb=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Qb=`PhysicalMaterial material;
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
#endif`,Jb=`struct PhysicalMaterial {
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
}`,$b=`
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
#endif`,eA=`#if defined( RE_IndirectDiffuse )
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
#endif`,tA=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,nA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,iA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,aA=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sA=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,rA=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,oA=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,lA=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,cA=`#if defined( USE_POINTS_UV )
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
#endif`,uA=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,fA=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,dA=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,hA=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,pA=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mA=`#ifdef USE_MORPHTARGETS
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
#endif`,gA=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vA=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,_A=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,xA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,SA=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,MA=`#ifdef USE_NORMALMAP
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
#endif`,EA=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,TA=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,bA=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,AA=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,CA=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,RA=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,wA=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,NA=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,DA=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,UA=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,LA=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,OA=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,zA=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,PA=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,IA=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,BA=`float getShadowMask() {
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
}`,FA=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,HA=`#ifdef USE_SKINNING
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
#endif`,jA=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,GA=`#ifdef USE_SKINNING
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
#endif`,VA=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,kA=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,XA=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qA=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,YA=`#ifdef USE_TRANSMISSION
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
#endif`,WA=`#ifdef USE_TRANSMISSION
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
#endif`,ZA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,KA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,QA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,JA=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const $A=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,e2=`uniform sampler2D t2D;
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
}`,t2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,n2=`#ifdef ENVMAP_TYPE_CUBE
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
}`,i2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,a2=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s2=`#include <common>
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
}`,r2=`#if DEPTH_PACKING == 3200
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
}`,o2=`#define DISTANCE
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
}`,l2=`#define DISTANCE
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
}`,c2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,u2=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,f2=`uniform float scale;
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
}`,d2=`uniform vec3 diffuse;
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
}`,h2=`#include <common>
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
}`,p2=`uniform vec3 diffuse;
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
}`,m2=`#define LAMBERT
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
}`,g2=`#define LAMBERT
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
}`,v2=`#define MATCAP
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
}`,_2=`#define MATCAP
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
}`,x2=`#define NORMAL
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
}`,y2=`#define NORMAL
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
}`,S2=`#define PHONG
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
}`,M2=`#define PHONG
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
}`,E2=`#define STANDARD
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
}`,T2=`#define STANDARD
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
}`,b2=`#define TOON
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
}`,A2=`#define TOON
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
}`,C2=`uniform float size;
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
}`,R2=`uniform vec3 diffuse;
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
}`,w2=`#include <common>
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
}`,N2=`uniform vec3 color;
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
}`,D2=`uniform float rotation;
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
}`,U2=`uniform vec3 diffuse;
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
}`,_t={alphahash_fragment:eb,alphahash_pars_fragment:tb,alphamap_fragment:nb,alphamap_pars_fragment:ib,alphatest_fragment:ab,alphatest_pars_fragment:sb,aomap_fragment:rb,aomap_pars_fragment:ob,batching_pars_vertex:lb,batching_vertex:cb,begin_vertex:ub,beginnormal_vertex:fb,bsdfs:db,iridescence_fragment:hb,bumpmap_pars_fragment:pb,clipping_planes_fragment:mb,clipping_planes_pars_fragment:gb,clipping_planes_pars_vertex:vb,clipping_planes_vertex:_b,color_fragment:xb,color_pars_fragment:yb,color_pars_vertex:Sb,color_vertex:Mb,common:Eb,cube_uv_reflection_fragment:Tb,defaultnormal_vertex:bb,displacementmap_pars_vertex:Ab,displacementmap_vertex:Cb,emissivemap_fragment:Rb,emissivemap_pars_fragment:wb,colorspace_fragment:Nb,colorspace_pars_fragment:Db,envmap_fragment:Ub,envmap_common_pars_fragment:Lb,envmap_pars_fragment:Ob,envmap_pars_vertex:zb,envmap_physical_pars_fragment:qb,envmap_vertex:Pb,fog_vertex:Ib,fog_pars_vertex:Bb,fog_fragment:Fb,fog_pars_fragment:Hb,gradientmap_pars_fragment:jb,lightmap_pars_fragment:Gb,lights_lambert_fragment:Vb,lights_lambert_pars_fragment:kb,lights_pars_begin:Xb,lights_toon_fragment:Yb,lights_toon_pars_fragment:Wb,lights_phong_fragment:Zb,lights_phong_pars_fragment:Kb,lights_physical_fragment:Qb,lights_physical_pars_fragment:Jb,lights_fragment_begin:$b,lights_fragment_maps:eA,lights_fragment_end:tA,logdepthbuf_fragment:nA,logdepthbuf_pars_fragment:iA,logdepthbuf_pars_vertex:aA,logdepthbuf_vertex:sA,map_fragment:rA,map_pars_fragment:oA,map_particle_fragment:lA,map_particle_pars_fragment:cA,metalnessmap_fragment:uA,metalnessmap_pars_fragment:fA,morphinstance_vertex:dA,morphcolor_vertex:hA,morphnormal_vertex:pA,morphtarget_pars_vertex:mA,morphtarget_vertex:gA,normal_fragment_begin:vA,normal_fragment_maps:_A,normal_pars_fragment:xA,normal_pars_vertex:yA,normal_vertex:SA,normalmap_pars_fragment:MA,clearcoat_normal_fragment_begin:EA,clearcoat_normal_fragment_maps:TA,clearcoat_pars_fragment:bA,iridescence_pars_fragment:AA,opaque_fragment:CA,packing:RA,premultiplied_alpha_fragment:wA,project_vertex:NA,dithering_fragment:DA,dithering_pars_fragment:UA,roughnessmap_fragment:LA,roughnessmap_pars_fragment:OA,shadowmap_pars_fragment:zA,shadowmap_pars_vertex:PA,shadowmap_vertex:IA,shadowmask_pars_fragment:BA,skinbase_vertex:FA,skinning_pars_vertex:HA,skinning_vertex:jA,skinnormal_vertex:GA,specularmap_fragment:VA,specularmap_pars_fragment:kA,tonemapping_fragment:XA,tonemapping_pars_fragment:qA,transmission_fragment:YA,transmission_pars_fragment:WA,uv_pars_fragment:ZA,uv_pars_vertex:KA,uv_vertex:QA,worldpos_vertex:JA,background_vert:$A,background_frag:e2,backgroundCube_vert:t2,backgroundCube_frag:n2,cube_vert:i2,cube_frag:a2,depth_vert:s2,depth_frag:r2,distanceRGBA_vert:o2,distanceRGBA_frag:l2,equirect_vert:c2,equirect_frag:u2,linedashed_vert:f2,linedashed_frag:d2,meshbasic_vert:h2,meshbasic_frag:p2,meshlambert_vert:m2,meshlambert_frag:g2,meshmatcap_vert:v2,meshmatcap_frag:_2,meshnormal_vert:x2,meshnormal_frag:y2,meshphong_vert:S2,meshphong_frag:M2,meshphysical_vert:E2,meshphysical_frag:T2,meshtoon_vert:b2,meshtoon_frag:A2,points_vert:C2,points_frag:R2,shadow_vert:w2,shadow_frag:N2,sprite_vert:D2,sprite_frag:U2},Ge={common:{diffuse:{value:new Nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new vt},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new vt}},envmap:{envMap:{value:null},envMapRotation:{value:new vt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new vt},normalScale:{value:new pt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0},uvTransform:{value:new vt}},sprite:{diffuse:{value:new Nt(16777215)},opacity:{value:1},center:{value:new pt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new vt},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0}}},la={basic:{uniforms:qn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.fog]),vertexShader:_t.meshbasic_vert,fragmentShader:_t.meshbasic_frag},lambert:{uniforms:qn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,Ge.lights,{emissive:{value:new Nt(0)}}]),vertexShader:_t.meshlambert_vert,fragmentShader:_t.meshlambert_frag},phong:{uniforms:qn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,Ge.lights,{emissive:{value:new Nt(0)},specular:{value:new Nt(1118481)},shininess:{value:30}}]),vertexShader:_t.meshphong_vert,fragmentShader:_t.meshphong_frag},standard:{uniforms:qn([Ge.common,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.roughnessmap,Ge.metalnessmap,Ge.fog,Ge.lights,{emissive:{value:new Nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:_t.meshphysical_vert,fragmentShader:_t.meshphysical_frag},toon:{uniforms:qn([Ge.common,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.gradientmap,Ge.fog,Ge.lights,{emissive:{value:new Nt(0)}}]),vertexShader:_t.meshtoon_vert,fragmentShader:_t.meshtoon_frag},matcap:{uniforms:qn([Ge.common,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,{matcap:{value:null}}]),vertexShader:_t.meshmatcap_vert,fragmentShader:_t.meshmatcap_frag},points:{uniforms:qn([Ge.points,Ge.fog]),vertexShader:_t.points_vert,fragmentShader:_t.points_frag},dashed:{uniforms:qn([Ge.common,Ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:_t.linedashed_vert,fragmentShader:_t.linedashed_frag},depth:{uniforms:qn([Ge.common,Ge.displacementmap]),vertexShader:_t.depth_vert,fragmentShader:_t.depth_frag},normal:{uniforms:qn([Ge.common,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,{opacity:{value:1}}]),vertexShader:_t.meshnormal_vert,fragmentShader:_t.meshnormal_frag},sprite:{uniforms:qn([Ge.sprite,Ge.fog]),vertexShader:_t.sprite_vert,fragmentShader:_t.sprite_frag},background:{uniforms:{uvTransform:{value:new vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:_t.background_vert,fragmentShader:_t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new vt}},vertexShader:_t.backgroundCube_vert,fragmentShader:_t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:_t.cube_vert,fragmentShader:_t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:_t.equirect_vert,fragmentShader:_t.equirect_frag},distanceRGBA:{uniforms:qn([Ge.common,Ge.displacementmap,{referencePosition:{value:new ae},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:_t.distanceRGBA_vert,fragmentShader:_t.distanceRGBA_frag},shadow:{uniforms:qn([Ge.lights,Ge.fog,{color:{value:new Nt(0)},opacity:{value:1}}]),vertexShader:_t.shadow_vert,fragmentShader:_t.shadow_frag}};la.physical={uniforms:qn([la.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new vt},clearcoatNormalScale:{value:new pt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new vt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new vt},sheen:{value:0},sheenColor:{value:new Nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new vt},transmissionSamplerSize:{value:new pt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new vt},attenuationDistance:{value:0},attenuationColor:{value:new Nt(0)},specularColor:{value:new Nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new vt},anisotropyVector:{value:new pt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new vt}}]),vertexShader:_t.meshphysical_vert,fragmentShader:_t.meshphysical_frag};const Bu={r:0,b:0,g:0},ir=new da,L2=new sn;function O2(s,t,i,o,l,u,h){const p=new Nt(0);let m=u===!0?0:1,g,x,v=null,S=0,E=null;function b(z){let N=z.isScene===!0?z.background:null;return N&&N.isTexture&&(N=(z.backgroundBlurriness>0?i:t).get(N)),N}function T(z){let N=!1;const V=b(z);V===null?_(p,m):V&&V.isColor&&(_(V,1),N=!0);const H=s.xr.getEnvironmentBlendMode();H==="additive"?o.buffers.color.setClear(0,0,0,1,h):H==="alpha-blend"&&o.buffers.color.setClear(0,0,0,0,h),(s.autoClear||N)&&(o.buffers.depth.setTest(!0),o.buffers.depth.setMask(!0),o.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function M(z,N){const V=b(N);V&&(V.isCubeTexture||V.mapping===sf)?(x===void 0&&(x=new gi(new Do(1,1,1),new Yn({name:"BackgroundCubeMaterial",uniforms:Co(la.backgroundCube.uniforms),vertexShader:la.backgroundCube.vertexShader,fragmentShader:la.backgroundCube.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),x.geometry.deleteAttribute("normal"),x.geometry.deleteAttribute("uv"),x.onBeforeRender=function(H,I,Y){this.matrixWorld.copyPosition(Y.matrixWorld)},Object.defineProperty(x.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(x)),ir.copy(N.backgroundRotation),ir.x*=-1,ir.y*=-1,ir.z*=-1,V.isCubeTexture&&V.isRenderTargetTexture===!1&&(ir.y*=-1,ir.z*=-1),x.material.uniforms.envMap.value=V,x.material.uniforms.flipEnvMap.value=V.isCubeTexture&&V.isRenderTargetTexture===!1?-1:1,x.material.uniforms.backgroundBlurriness.value=N.backgroundBlurriness,x.material.uniforms.backgroundIntensity.value=N.backgroundIntensity,x.material.uniforms.backgroundRotation.value.setFromMatrix4(L2.makeRotationFromEuler(ir)),x.material.toneMapped=Lt.getTransfer(V.colorSpace)!==Xt,(v!==V||S!==V.version||E!==s.toneMapping)&&(x.material.needsUpdate=!0,v=V,S=V.version,E=s.toneMapping),x.layers.enableAll(),z.unshift(x,x.geometry,x.material,0,0,null)):V&&V.isTexture&&(g===void 0&&(g=new gi(new Yl(2,2),new Yn({name:"BackgroundMaterial",uniforms:Co(la.background.uniforms),vertexShader:la.background.vertexShader,fragmentShader:la.background.fragmentShader,side:Cs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),g.geometry.deleteAttribute("normal"),Object.defineProperty(g.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(g)),g.material.uniforms.t2D.value=V,g.material.uniforms.backgroundIntensity.value=N.backgroundIntensity,g.material.toneMapped=Lt.getTransfer(V.colorSpace)!==Xt,V.matrixAutoUpdate===!0&&V.updateMatrix(),g.material.uniforms.uvTransform.value.copy(V.matrix),(v!==V||S!==V.version||E!==s.toneMapping)&&(g.material.needsUpdate=!0,v=V,S=V.version,E=s.toneMapping),g.layers.enableAll(),z.unshift(g,g.geometry,g.material,0,0,null))}function _(z,N){z.getRGB(Bu,Yy(s)),o.buffers.color.setClear(Bu.r,Bu.g,Bu.b,N,h)}function L(){x!==void 0&&(x.geometry.dispose(),x.material.dispose(),x=void 0),g!==void 0&&(g.geometry.dispose(),g.material.dispose(),g=void 0)}return{getClearColor:function(){return p},setClearColor:function(z,N=1){p.set(z),m=N,_(p,m)},getClearAlpha:function(){return m},setClearAlpha:function(z){m=z,_(p,m)},render:T,addToRenderList:M,dispose:L}}function z2(s,t){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),o={},l=S(null);let u=l,h=!1;function p(R,G,ie,ue,Z){let B=!1;const O=v(ue,ie,G);u!==O&&(u=O,g(u.object)),B=E(R,ue,ie,Z),B&&b(R,ue,ie,Z),Z!==null&&t.update(Z,s.ELEMENT_ARRAY_BUFFER),(B||h)&&(h=!1,N(R,G,ie,ue),Z!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(Z).buffer))}function m(){return s.createVertexArray()}function g(R){return s.bindVertexArray(R)}function x(R){return s.deleteVertexArray(R)}function v(R,G,ie){const ue=ie.wireframe===!0;let Z=o[R.id];Z===void 0&&(Z={},o[R.id]=Z);let B=Z[G.id];B===void 0&&(B={},Z[G.id]=B);let O=B[ue];return O===void 0&&(O=S(m()),B[ue]=O),O}function S(R){const G=[],ie=[],ue=[];for(let Z=0;Z<i;Z++)G[Z]=0,ie[Z]=0,ue[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:G,enabledAttributes:ie,attributeDivisors:ue,object:R,attributes:{},index:null}}function E(R,G,ie,ue){const Z=u.attributes,B=G.attributes;let O=0;const k=ie.getAttributes();for(const X in k)if(k[X].location>=0){const _e=Z[X];let He=B[X];if(He===void 0&&(X==="instanceMatrix"&&R.instanceMatrix&&(He=R.instanceMatrix),X==="instanceColor"&&R.instanceColor&&(He=R.instanceColor)),_e===void 0||_e.attribute!==He||He&&_e.data!==He.data)return!0;O++}return u.attributesNum!==O||u.index!==ue}function b(R,G,ie,ue){const Z={},B=G.attributes;let O=0;const k=ie.getAttributes();for(const X in k)if(k[X].location>=0){let _e=B[X];_e===void 0&&(X==="instanceMatrix"&&R.instanceMatrix&&(_e=R.instanceMatrix),X==="instanceColor"&&R.instanceColor&&(_e=R.instanceColor));const He={};He.attribute=_e,_e&&_e.data&&(He.data=_e.data),Z[X]=He,O++}u.attributes=Z,u.attributesNum=O,u.index=ue}function T(){const R=u.newAttributes;for(let G=0,ie=R.length;G<ie;G++)R[G]=0}function M(R){_(R,0)}function _(R,G){const ie=u.newAttributes,ue=u.enabledAttributes,Z=u.attributeDivisors;ie[R]=1,ue[R]===0&&(s.enableVertexAttribArray(R),ue[R]=1),Z[R]!==G&&(s.vertexAttribDivisor(R,G),Z[R]=G)}function L(){const R=u.newAttributes,G=u.enabledAttributes;for(let ie=0,ue=G.length;ie<ue;ie++)G[ie]!==R[ie]&&(s.disableVertexAttribArray(ie),G[ie]=0)}function z(R,G,ie,ue,Z,B,O){O===!0?s.vertexAttribIPointer(R,G,ie,Z,B):s.vertexAttribPointer(R,G,ie,ue,Z,B)}function N(R,G,ie,ue){T();const Z=ue.attributes,B=ie.getAttributes(),O=G.defaultAttributeValues;for(const k in B){const X=B[k];if(X.location>=0){let ve=Z[k];if(ve===void 0&&(k==="instanceMatrix"&&R.instanceMatrix&&(ve=R.instanceMatrix),k==="instanceColor"&&R.instanceColor&&(ve=R.instanceColor)),ve!==void 0){const _e=ve.normalized,He=ve.itemSize,$e=t.get(ve);if($e===void 0)continue;const xt=$e.buffer,j=$e.type,de=$e.bytesPerElement,$=j===s.INT||j===s.UNSIGNED_INT||ve.gpuType===Am;if(ve.isInterleavedBufferAttribute){const oe=ve.data,Ee=oe.stride,Le=ve.offset;if(oe.isInstancedInterleavedBuffer){for(let Ae=0;Ae<X.locationSize;Ae++)_(X.location+Ae,oe.meshPerAttribute);R.isInstancedMesh!==!0&&ue._maxInstanceCount===void 0&&(ue._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let Ae=0;Ae<X.locationSize;Ae++)M(X.location+Ae);s.bindBuffer(s.ARRAY_BUFFER,xt);for(let Ae=0;Ae<X.locationSize;Ae++)z(X.location+Ae,He/X.locationSize,j,_e,Ee*de,(Le+He/X.locationSize*Ae)*de,$)}else{if(ve.isInstancedBufferAttribute){for(let oe=0;oe<X.locationSize;oe++)_(X.location+oe,ve.meshPerAttribute);R.isInstancedMesh!==!0&&ue._maxInstanceCount===void 0&&(ue._maxInstanceCount=ve.meshPerAttribute*ve.count)}else for(let oe=0;oe<X.locationSize;oe++)M(X.location+oe);s.bindBuffer(s.ARRAY_BUFFER,xt);for(let oe=0;oe<X.locationSize;oe++)z(X.location+oe,He/X.locationSize,j,_e,He*de,He/X.locationSize*oe*de,$)}}else if(O!==void 0){const _e=O[k];if(_e!==void 0)switch(_e.length){case 2:s.vertexAttrib2fv(X.location,_e);break;case 3:s.vertexAttrib3fv(X.location,_e);break;case 4:s.vertexAttrib4fv(X.location,_e);break;default:s.vertexAttrib1fv(X.location,_e)}}}}L()}function V(){Y();for(const R in o){const G=o[R];for(const ie in G){const ue=G[ie];for(const Z in ue)x(ue[Z].object),delete ue[Z];delete G[ie]}delete o[R]}}function H(R){if(o[R.id]===void 0)return;const G=o[R.id];for(const ie in G){const ue=G[ie];for(const Z in ue)x(ue[Z].object),delete ue[Z];delete G[ie]}delete o[R.id]}function I(R){for(const G in o){const ie=o[G];if(ie[R.id]===void 0)continue;const ue=ie[R.id];for(const Z in ue)x(ue[Z].object),delete ue[Z];delete ie[R.id]}}function Y(){U(),h=!0,u!==l&&(u=l,g(u.object))}function U(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:p,reset:Y,resetDefaultState:U,dispose:V,releaseStatesOfGeometry:H,releaseStatesOfProgram:I,initAttributes:T,enableAttribute:M,disableUnusedAttributes:L}}function P2(s,t,i){let o;function l(g){o=g}function u(g,x){s.drawArrays(o,g,x),i.update(x,o,1)}function h(g,x,v){v!==0&&(s.drawArraysInstanced(o,g,x,v),i.update(x,o,v))}function p(g,x,v){if(v===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(o,g,0,x,0,v);let E=0;for(let b=0;b<v;b++)E+=x[b];i.update(E,o,1)}function m(g,x,v,S){if(v===0)return;const E=t.get("WEBGL_multi_draw");if(E===null)for(let b=0;b<g.length;b++)h(g[b],x[b],S[b]);else{E.multiDrawArraysInstancedWEBGL(o,g,0,x,0,S,0,v);let b=0;for(let T=0;T<v;T++)b+=x[T]*S[T];i.update(b,o,1)}}this.setMode=l,this.render=u,this.renderInstances=h,this.renderMultiDraw=p,this.renderMultiDrawInstances=m}function I2(s,t,i,o){let l;function u(){if(l!==void 0)return l;if(t.has("EXT_texture_filter_anisotropic")===!0){const I=t.get("EXT_texture_filter_anisotropic");l=s.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function h(I){return!(I!==qi&&o.convert(I)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function p(I){const Y=I===Ia&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(I!==fa&&o.convert(I)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==za&&!Y)}function m(I){if(I==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let g=i.precision!==void 0?i.precision:"highp";const x=m(g);x!==g&&(console.warn("THREE.WebGLRenderer:",g,"not supported, using",x,"instead."),g=x);const v=i.logarithmicDepthBuffer===!0,S=i.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),E=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),b=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),T=s.getParameter(s.MAX_TEXTURE_SIZE),M=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),_=s.getParameter(s.MAX_VERTEX_ATTRIBS),L=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),z=s.getParameter(s.MAX_VARYING_VECTORS),N=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),V=b>0,H=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:u,getMaxPrecision:m,textureFormatReadable:h,textureTypeReadable:p,precision:g,logarithmicDepthBuffer:v,reversedDepthBuffer:S,maxTextures:E,maxVertexTextures:b,maxTextureSize:T,maxCubemapSize:M,maxAttributes:_,maxVertexUniforms:L,maxVaryings:z,maxFragmentUniforms:N,vertexTextures:V,maxSamples:H}}function B2(s){const t=this;let i=null,o=0,l=!1,u=!1;const h=new rr,p=new vt,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(v,S){const E=v.length!==0||S||o!==0||l;return l=S,o=v.length,E},this.beginShadows=function(){u=!0,x(null)},this.endShadows=function(){u=!1},this.setGlobalState=function(v,S){i=x(v,S,0)},this.setState=function(v,S,E){const b=v.clippingPlanes,T=v.clipIntersection,M=v.clipShadows,_=s.get(v);if(!l||b===null||b.length===0||u&&!M)u?x(null):g();else{const L=u?0:o,z=L*4;let N=_.clippingState||null;m.value=N,N=x(b,S,z,E);for(let V=0;V!==z;++V)N[V]=i[V];_.clippingState=N,this.numIntersection=T?this.numPlanes:0,this.numPlanes+=L}};function g(){m.value!==i&&(m.value=i,m.needsUpdate=o>0),t.numPlanes=o,t.numIntersection=0}function x(v,S,E,b){const T=v!==null?v.length:0;let M=null;if(T!==0){if(M=m.value,b!==!0||M===null){const _=E+T*4,L=S.matrixWorldInverse;p.getNormalMatrix(L),(M===null||M.length<_)&&(M=new Float32Array(_));for(let z=0,N=E;z!==T;++z,N+=4)h.copy(v[z]).applyMatrix4(L,p),h.normal.toArray(M,N),M[N+3]=h.constant}m.value=M,m.needsUpdate=!0}return t.numPlanes=T,t.numIntersection=0,M}}function F2(s){let t=new WeakMap;function i(h,p){return p===Ip?h.mapping=To:p===Bp&&(h.mapping=bo),h}function o(h){if(h&&h.isTexture){const p=h.mapping;if(p===Ip||p===Bp)if(t.has(h)){const m=t.get(h).texture;return i(m,h.mapping)}else{const m=h.image;if(m&&m.height>0){const g=new UT(m.height);return g.fromEquirectangularTexture(s,h),t.set(h,g),h.addEventListener("dispose",l),i(g.texture,h.mapping)}else return null}}return h}function l(h){const p=h.target;p.removeEventListener("dispose",l);const m=t.get(p);m!==void 0&&(t.delete(p),m.dispose())}function u(){t=new WeakMap}return{get:o,dispose:u}}const vo=4,zx=[.125,.215,.35,.446,.526,.582],cr=20,vp=new of,Px=new Nt;let _p=null,xp=0,yp=0,Sp=!1;const or=(1+Math.sqrt(5))/2,mo=1/or,Ix=[new ae(-or,mo,0),new ae(or,mo,0),new ae(-mo,0,or),new ae(mo,0,or),new ae(0,or,-mo),new ae(0,or,mo),new ae(-1,1,-1),new ae(1,1,-1),new ae(-1,1,1),new ae(1,1,1)],H2=new ae;class Bx{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,i=0,o=.1,l=100,u={}){const{size:h=256,position:p=H2}=u;_p=this._renderer.getRenderTarget(),xp=this._renderer.getActiveCubeFace(),yp=this._renderer.getActiveMipmapLevel(),Sp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(h);const m=this._allocateTargets();return m.depthBuffer=!0,this._sceneToCubeUV(t,o,l,m,p),i>0&&this._blur(m,0,0,i),this._applyPMREM(m),this._cleanup(m),m}fromEquirectangular(t,i=null){return this._fromTexture(t,i)}fromCubemap(t,i=null){return this._fromTexture(t,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=jx(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hx(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(_p,xp,yp),this._renderer.xr.enabled=Sp,t.scissorTest=!1,Fu(t,0,0,t.width,t.height)}_fromTexture(t,i){t.mapping===To||t.mapping===bo?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),_p=this._renderer.getRenderTarget(),xp=this._renderer.getActiveCubeFace(),yp=this._renderer.getActiveMipmapLevel(),Sp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const o=i||this._allocateTargets();return this._textureToCubeUV(t,o),this._applyPMREM(o),this._cleanup(o),o}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,o={magFilter:Xi,minFilter:Xi,generateMipmaps:!1,type:Ia,format:qi,colorSpace:Ao,depthBuffer:!1},l=Fx(t,i,o);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fx(t,i,o);const{_lodMax:u}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=j2(u)),this._blurMaterial=G2(u,t,i)}return l}_compileMaterial(t){const i=new gi(this._lodPlanes[0],t);this._renderer.compile(i,vp)}_sceneToCubeUV(t,i,o,l,u){const m=new Ni(90,1,i,o),g=[1,-1,1,1,1,1],x=[1,1,1,-1,-1,-1],v=this._renderer,S=v.autoClear,E=v.toneMapping;v.getClearColor(Px),v.toneMapping=Es,v.autoClear=!1,v.state.buffers.depth.getReversed()&&(v.setRenderTarget(l),v.clearDepth(),v.setRenderTarget(null));const T=new So({name:"PMREM.Background",side:ii,depthWrite:!1,depthTest:!1}),M=new gi(new Do,T);let _=!1;const L=t.background;L?L.isColor&&(T.color.copy(L),t.background=null,_=!0):(T.color.copy(Px),_=!0);for(let z=0;z<6;z++){const N=z%3;N===0?(m.up.set(0,g[z],0),m.position.set(u.x,u.y,u.z),m.lookAt(u.x+x[z],u.y,u.z)):N===1?(m.up.set(0,0,g[z]),m.position.set(u.x,u.y,u.z),m.lookAt(u.x,u.y+x[z],u.z)):(m.up.set(0,g[z],0),m.position.set(u.x,u.y,u.z),m.lookAt(u.x,u.y,u.z+x[z]));const V=this._cubeSize;Fu(l,N*V,z>2?V:0,V,V),v.setRenderTarget(l),_&&v.render(M,m),v.render(t,m)}M.geometry.dispose(),M.material.dispose(),v.toneMapping=E,v.autoClear=S,t.background=L}_textureToCubeUV(t,i){const o=this._renderer,l=t.mapping===To||t.mapping===bo;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=jx()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hx());const u=l?this._cubemapMaterial:this._equirectMaterial,h=new gi(this._lodPlanes[0],u),p=u.uniforms;p.envMap.value=t;const m=this._cubeSize;Fu(i,0,0,3*m,2*m),o.setRenderTarget(i),o.render(h,vp)}_applyPMREM(t){const i=this._renderer,o=i.autoClear;i.autoClear=!1;const l=this._lodPlanes.length;for(let u=1;u<l;u++){const h=Math.sqrt(this._sigmas[u]*this._sigmas[u]-this._sigmas[u-1]*this._sigmas[u-1]),p=Ix[(l-u-1)%Ix.length];this._blur(t,u-1,u,h,p)}i.autoClear=o}_blur(t,i,o,l,u){const h=this._pingPongRenderTarget;this._halfBlur(t,h,i,o,l,"latitudinal",u),this._halfBlur(h,t,o,o,l,"longitudinal",u)}_halfBlur(t,i,o,l,u,h,p){const m=this._renderer,g=this._blurMaterial;h!=="latitudinal"&&h!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const x=3,v=new gi(this._lodPlanes[l],g),S=g.uniforms,E=this._sizeLods[o]-1,b=isFinite(u)?Math.PI/(2*E):2*Math.PI/(2*cr-1),T=u/b,M=isFinite(u)?1+Math.floor(x*T):cr;M>cr&&console.warn(`sigmaRadians, ${u}, is too large and will clip, as it requested ${M} samples when the maximum is set to ${cr}`);const _=[];let L=0;for(let I=0;I<cr;++I){const Y=I/T,U=Math.exp(-Y*Y/2);_.push(U),I===0?L+=U:I<M&&(L+=2*U)}for(let I=0;I<_.length;I++)_[I]=_[I]/L;S.envMap.value=t.texture,S.samples.value=M,S.weights.value=_,S.latitudinal.value=h==="latitudinal",p&&(S.poleAxis.value=p);const{_lodMax:z}=this;S.dTheta.value=b,S.mipInt.value=z-o;const N=this._sizeLods[l],V=3*N*(l>z-vo?l-z+vo:0),H=4*(this._cubeSize-N);Fu(i,V,H,3*N,2*N),m.setRenderTarget(i),m.render(v,vp)}}function j2(s){const t=[],i=[],o=[];let l=s;const u=s-vo+1+zx.length;for(let h=0;h<u;h++){const p=Math.pow(2,l);i.push(p);let m=1/p;h>s-vo?m=zx[h-s+vo-1]:h===0&&(m=0),o.push(m);const g=1/(p-2),x=-g,v=1+g,S=[x,x,v,x,v,v,x,x,v,v,x,v],E=6,b=6,T=3,M=2,_=1,L=new Float32Array(T*b*E),z=new Float32Array(M*b*E),N=new Float32Array(_*b*E);for(let H=0;H<E;H++){const I=H%3*2/3-1,Y=H>2?0:-1,U=[I,Y,0,I+2/3,Y,0,I+2/3,Y+1,0,I,Y,0,I+2/3,Y+1,0,I,Y+1,0];L.set(U,T*b*H),z.set(S,M*b*H);const R=[H,H,H,H,H,H];N.set(R,_*b*H)}const V=new Zi;V.setAttribute("position",new Wi(L,T)),V.setAttribute("uv",new Wi(z,M)),V.setAttribute("faceIndex",new Wi(N,_)),t.push(V),l>vo&&l--}return{lodPlanes:t,sizeLods:i,sigmas:o}}function Fx(s,t,i){const o=new Yi(s,t,i);return o.texture.mapping=sf,o.texture.name="PMREM.cubeUv",o.scissorTest=!0,o}function Fu(s,t,i,o,l){s.viewport.set(t,i,o,l),s.scissor.set(t,i,o,l)}function G2(s,t,i){const o=new Float32Array(cr),l=new ae(0,1,0);return new Yn({name:"SphericalGaussianBlur",defines:{n:cr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:o},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:Im(),fragmentShader:`

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
		`,blending:Pa,depthTest:!1,depthWrite:!1})}function Hx(){return new Yn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Im(),fragmentShader:`

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
		`,blending:Pa,depthTest:!1,depthWrite:!1})}function jx(){return new Yn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Im(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pa,depthTest:!1,depthWrite:!1})}function Im(){return`

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
	`}function V2(s){let t=new WeakMap,i=null;function o(p){if(p&&p.isTexture){const m=p.mapping,g=m===Ip||m===Bp,x=m===To||m===bo;if(g||x){let v=t.get(p);const S=v!==void 0?v.texture.pmremVersion:0;if(p.isRenderTargetTexture&&p.pmremVersion!==S)return i===null&&(i=new Bx(s)),v=g?i.fromEquirectangular(p,v):i.fromCubemap(p,v),v.texture.pmremVersion=p.pmremVersion,t.set(p,v),v.texture;if(v!==void 0)return v.texture;{const E=p.image;return g&&E&&E.height>0||x&&E&&l(E)?(i===null&&(i=new Bx(s)),v=g?i.fromEquirectangular(p):i.fromCubemap(p),v.texture.pmremVersion=p.pmremVersion,t.set(p,v),p.addEventListener("dispose",u),v.texture):null}}}return p}function l(p){let m=0;const g=6;for(let x=0;x<g;x++)p[x]!==void 0&&m++;return m===g}function u(p){const m=p.target;m.removeEventListener("dispose",u);const g=t.get(m);g!==void 0&&(t.delete(m),g.dispose())}function h(){t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:o,dispose:h}}function k2(s){const t={};function i(o){if(t[o]!==void 0)return t[o];let l;switch(o){case"WEBGL_depth_texture":l=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":l=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":l=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":l=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:l=s.getExtension(o)}return t[o]=l,l}return{has:function(o){return i(o)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(o){const l=i(o);return l===null&&jl("THREE.WebGLRenderer: "+o+" extension not supported."),l}}}function X2(s,t,i,o){const l={},u=new WeakMap;function h(v){const S=v.target;S.index!==null&&t.remove(S.index);for(const b in S.attributes)t.remove(S.attributes[b]);S.removeEventListener("dispose",h),delete l[S.id];const E=u.get(S);E&&(t.remove(E),u.delete(S)),o.releaseStatesOfGeometry(S),S.isInstancedBufferGeometry===!0&&delete S._maxInstanceCount,i.memory.geometries--}function p(v,S){return l[S.id]===!0||(S.addEventListener("dispose",h),l[S.id]=!0,i.memory.geometries++),S}function m(v){const S=v.attributes;for(const E in S)t.update(S[E],s.ARRAY_BUFFER)}function g(v){const S=[],E=v.index,b=v.attributes.position;let T=0;if(E!==null){const L=E.array;T=E.version;for(let z=0,N=L.length;z<N;z+=3){const V=L[z+0],H=L[z+1],I=L[z+2];S.push(V,H,H,I,I,V)}}else if(b!==void 0){const L=b.array;T=b.version;for(let z=0,N=L.length/3-1;z<N;z+=3){const V=z+0,H=z+1,I=z+2;S.push(V,H,H,I,I,V)}}else return;const M=new(Hy(S)?qy:Xy)(S,1);M.version=T;const _=u.get(v);_&&t.remove(_),u.set(v,M)}function x(v){const S=u.get(v);if(S){const E=v.index;E!==null&&S.version<E.version&&g(v)}else g(v);return u.get(v)}return{get:p,update:m,getWireframeAttribute:x}}function q2(s,t,i){let o;function l(S){o=S}let u,h;function p(S){u=S.type,h=S.bytesPerElement}function m(S,E){s.drawElements(o,E,u,S*h),i.update(E,o,1)}function g(S,E,b){b!==0&&(s.drawElementsInstanced(o,E,u,S*h,b),i.update(E,o,b))}function x(S,E,b){if(b===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(o,E,0,u,S,0,b);let M=0;for(let _=0;_<b;_++)M+=E[_];i.update(M,o,1)}function v(S,E,b,T){if(b===0)return;const M=t.get("WEBGL_multi_draw");if(M===null)for(let _=0;_<S.length;_++)g(S[_]/h,E[_],T[_]);else{M.multiDrawElementsInstancedWEBGL(o,E,0,u,S,0,T,0,b);let _=0;for(let L=0;L<b;L++)_+=E[L]*T[L];i.update(_,o,1)}}this.setMode=l,this.setIndex=p,this.render=m,this.renderInstances=g,this.renderMultiDraw=x,this.renderMultiDrawInstances=v}function Y2(s){const t={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function o(u,h,p){switch(i.calls++,h){case s.TRIANGLES:i.triangles+=p*(u/3);break;case s.LINES:i.lines+=p*(u/2);break;case s.LINE_STRIP:i.lines+=p*(u-1);break;case s.LINE_LOOP:i.lines+=p*u;break;case s.POINTS:i.points+=p*u;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",h);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:t,render:i,programs:null,autoReset:!0,reset:l,update:o}}function W2(s,t,i){const o=new WeakMap,l=new Wt;function u(h,p,m){const g=h.morphTargetInfluences,x=p.morphAttributes.position||p.morphAttributes.normal||p.morphAttributes.color,v=x!==void 0?x.length:0;let S=o.get(p);if(S===void 0||S.count!==v){let R=function(){Y.dispose(),o.delete(p),p.removeEventListener("dispose",R)};var E=R;S!==void 0&&S.texture.dispose();const b=p.morphAttributes.position!==void 0,T=p.morphAttributes.normal!==void 0,M=p.morphAttributes.color!==void 0,_=p.morphAttributes.position||[],L=p.morphAttributes.normal||[],z=p.morphAttributes.color||[];let N=0;b===!0&&(N=1),T===!0&&(N=2),M===!0&&(N=3);let V=p.attributes.position.count*N,H=1;V>t.maxTextureSize&&(H=Math.ceil(V/t.maxTextureSize),V=t.maxTextureSize);const I=new Float32Array(V*H*4*v),Y=new jy(I,V,H,v);Y.type=za,Y.needsUpdate=!0;const U=N*4;for(let G=0;G<v;G++){const ie=_[G],ue=L[G],Z=z[G],B=V*H*4*G;for(let O=0;O<ie.count;O++){const k=O*U;b===!0&&(l.fromBufferAttribute(ie,O),I[B+k+0]=l.x,I[B+k+1]=l.y,I[B+k+2]=l.z,I[B+k+3]=0),T===!0&&(l.fromBufferAttribute(ue,O),I[B+k+4]=l.x,I[B+k+5]=l.y,I[B+k+6]=l.z,I[B+k+7]=0),M===!0&&(l.fromBufferAttribute(Z,O),I[B+k+8]=l.x,I[B+k+9]=l.y,I[B+k+10]=l.z,I[B+k+11]=Z.itemSize===4?l.w:1)}}S={count:v,texture:Y,size:new pt(V,H)},o.set(p,S),p.addEventListener("dispose",R)}if(h.isInstancedMesh===!0&&h.morphTexture!==null)m.getUniforms().setValue(s,"morphTexture",h.morphTexture,i);else{let b=0;for(let M=0;M<g.length;M++)b+=g[M];const T=p.morphTargetsRelative?1:1-b;m.getUniforms().setValue(s,"morphTargetBaseInfluence",T),m.getUniforms().setValue(s,"morphTargetInfluences",g)}m.getUniforms().setValue(s,"morphTargetsTexture",S.texture,i),m.getUniforms().setValue(s,"morphTargetsTextureSize",S.size)}return{update:u}}function Z2(s,t,i,o){let l=new WeakMap;function u(m){const g=o.render.frame,x=m.geometry,v=t.get(m,x);if(l.get(v)!==g&&(t.update(v),l.set(v,g)),m.isInstancedMesh&&(m.hasEventListener("dispose",p)===!1&&m.addEventListener("dispose",p),l.get(m)!==g&&(i.update(m.instanceMatrix,s.ARRAY_BUFFER),m.instanceColor!==null&&i.update(m.instanceColor,s.ARRAY_BUFFER),l.set(m,g))),m.isSkinnedMesh){const S=m.skeleton;l.get(S)!==g&&(S.update(),l.set(S,g))}return v}function h(){l=new WeakMap}function p(m){const g=m.target;g.removeEventListener("dispose",p),i.remove(g.instanceMatrix),g.instanceColor!==null&&i.remove(g.instanceColor)}return{update:u,dispose:h}}const nS=new Wn,Gx=new Qy(1,1),iS=new jy,aS=new gT,sS=new Zy,Vx=[],kx=[],Xx=new Float32Array(16),qx=new Float32Array(9),Yx=new Float32Array(4);function Uo(s,t,i){const o=s[0];if(o<=0||o>0)return s;const l=t*i;let u=Vx[l];if(u===void 0&&(u=new Float32Array(l),Vx[l]=u),t!==0){o.toArray(u,0);for(let h=1,p=0;h!==t;++h)p+=i,s[h].toArray(u,p)}return u}function Sn(s,t){if(s.length!==t.length)return!1;for(let i=0,o=s.length;i<o;i++)if(s[i]!==t[i])return!1;return!0}function Mn(s,t){for(let i=0,o=t.length;i<o;i++)s[i]=t[i]}function lf(s,t){let i=kx[t];i===void 0&&(i=new Int32Array(t),kx[t]=i);for(let o=0;o!==t;++o)i[o]=s.allocateTextureUnit();return i}function K2(s,t){const i=this.cache;i[0]!==t&&(s.uniform1f(this.addr,t),i[0]=t)}function Q2(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(Sn(i,t))return;s.uniform2fv(this.addr,t),Mn(i,t)}}function J2(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else if(t.r!==void 0)(i[0]!==t.r||i[1]!==t.g||i[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),i[0]=t.r,i[1]=t.g,i[2]=t.b);else{if(Sn(i,t))return;s.uniform3fv(this.addr,t),Mn(i,t)}}function $2(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(Sn(i,t))return;s.uniform4fv(this.addr,t),Mn(i,t)}}function eC(s,t){const i=this.cache,o=t.elements;if(o===void 0){if(Sn(i,t))return;s.uniformMatrix2fv(this.addr,!1,t),Mn(i,t)}else{if(Sn(i,o))return;Yx.set(o),s.uniformMatrix2fv(this.addr,!1,Yx),Mn(i,o)}}function tC(s,t){const i=this.cache,o=t.elements;if(o===void 0){if(Sn(i,t))return;s.uniformMatrix3fv(this.addr,!1,t),Mn(i,t)}else{if(Sn(i,o))return;qx.set(o),s.uniformMatrix3fv(this.addr,!1,qx),Mn(i,o)}}function nC(s,t){const i=this.cache,o=t.elements;if(o===void 0){if(Sn(i,t))return;s.uniformMatrix4fv(this.addr,!1,t),Mn(i,t)}else{if(Sn(i,o))return;Xx.set(o),s.uniformMatrix4fv(this.addr,!1,Xx),Mn(i,o)}}function iC(s,t){const i=this.cache;i[0]!==t&&(s.uniform1i(this.addr,t),i[0]=t)}function aC(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(Sn(i,t))return;s.uniform2iv(this.addr,t),Mn(i,t)}}function sC(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(Sn(i,t))return;s.uniform3iv(this.addr,t),Mn(i,t)}}function rC(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(Sn(i,t))return;s.uniform4iv(this.addr,t),Mn(i,t)}}function oC(s,t){const i=this.cache;i[0]!==t&&(s.uniform1ui(this.addr,t),i[0]=t)}function lC(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(Sn(i,t))return;s.uniform2uiv(this.addr,t),Mn(i,t)}}function cC(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(Sn(i,t))return;s.uniform3uiv(this.addr,t),Mn(i,t)}}function uC(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(Sn(i,t))return;s.uniform4uiv(this.addr,t),Mn(i,t)}}function fC(s,t,i){const o=this.cache,l=i.allocateTextureUnit();o[0]!==l&&(s.uniform1i(this.addr,l),o[0]=l);let u;this.type===s.SAMPLER_2D_SHADOW?(Gx.compareFunction=Fy,u=Gx):u=nS,i.setTexture2D(t||u,l)}function dC(s,t,i){const o=this.cache,l=i.allocateTextureUnit();o[0]!==l&&(s.uniform1i(this.addr,l),o[0]=l),i.setTexture3D(t||aS,l)}function hC(s,t,i){const o=this.cache,l=i.allocateTextureUnit();o[0]!==l&&(s.uniform1i(this.addr,l),o[0]=l),i.setTextureCube(t||sS,l)}function pC(s,t,i){const o=this.cache,l=i.allocateTextureUnit();o[0]!==l&&(s.uniform1i(this.addr,l),o[0]=l),i.setTexture2DArray(t||iS,l)}function mC(s){switch(s){case 5126:return K2;case 35664:return Q2;case 35665:return J2;case 35666:return $2;case 35674:return eC;case 35675:return tC;case 35676:return nC;case 5124:case 35670:return iC;case 35667:case 35671:return aC;case 35668:case 35672:return sC;case 35669:case 35673:return rC;case 5125:return oC;case 36294:return lC;case 36295:return cC;case 36296:return uC;case 35678:case 36198:case 36298:case 36306:case 35682:return fC;case 35679:case 36299:case 36307:return dC;case 35680:case 36300:case 36308:case 36293:return hC;case 36289:case 36303:case 36311:case 36292:return pC}}function gC(s,t){s.uniform1fv(this.addr,t)}function vC(s,t){const i=Uo(t,this.size,2);s.uniform2fv(this.addr,i)}function _C(s,t){const i=Uo(t,this.size,3);s.uniform3fv(this.addr,i)}function xC(s,t){const i=Uo(t,this.size,4);s.uniform4fv(this.addr,i)}function yC(s,t){const i=Uo(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,i)}function SC(s,t){const i=Uo(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,i)}function MC(s,t){const i=Uo(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,i)}function EC(s,t){s.uniform1iv(this.addr,t)}function TC(s,t){s.uniform2iv(this.addr,t)}function bC(s,t){s.uniform3iv(this.addr,t)}function AC(s,t){s.uniform4iv(this.addr,t)}function CC(s,t){s.uniform1uiv(this.addr,t)}function RC(s,t){s.uniform2uiv(this.addr,t)}function wC(s,t){s.uniform3uiv(this.addr,t)}function NC(s,t){s.uniform4uiv(this.addr,t)}function DC(s,t,i){const o=this.cache,l=t.length,u=lf(i,l);Sn(o,u)||(s.uniform1iv(this.addr,u),Mn(o,u));for(let h=0;h!==l;++h)i.setTexture2D(t[h]||nS,u[h])}function UC(s,t,i){const o=this.cache,l=t.length,u=lf(i,l);Sn(o,u)||(s.uniform1iv(this.addr,u),Mn(o,u));for(let h=0;h!==l;++h)i.setTexture3D(t[h]||aS,u[h])}function LC(s,t,i){const o=this.cache,l=t.length,u=lf(i,l);Sn(o,u)||(s.uniform1iv(this.addr,u),Mn(o,u));for(let h=0;h!==l;++h)i.setTextureCube(t[h]||sS,u[h])}function OC(s,t,i){const o=this.cache,l=t.length,u=lf(i,l);Sn(o,u)||(s.uniform1iv(this.addr,u),Mn(o,u));for(let h=0;h!==l;++h)i.setTexture2DArray(t[h]||iS,u[h])}function zC(s){switch(s){case 5126:return gC;case 35664:return vC;case 35665:return _C;case 35666:return xC;case 35674:return yC;case 35675:return SC;case 35676:return MC;case 5124:case 35670:return EC;case 35667:case 35671:return TC;case 35668:case 35672:return bC;case 35669:case 35673:return AC;case 5125:return CC;case 36294:return RC;case 36295:return wC;case 36296:return NC;case 35678:case 36198:case 36298:case 36306:case 35682:return DC;case 35679:case 36299:case 36307:return UC;case 35680:case 36300:case 36308:case 36293:return LC;case 36289:case 36303:case 36311:case 36292:return OC}}class PC{constructor(t,i,o){this.id=t,this.addr=o,this.cache=[],this.type=i.type,this.setValue=mC(i.type)}}class IC{constructor(t,i,o){this.id=t,this.addr=o,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=zC(i.type)}}class BC{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,i,o){const l=this.seq;for(let u=0,h=l.length;u!==h;++u){const p=l[u];p.setValue(t,i[p.id],o)}}}const Mp=/(\w+)(\])?(\[|\.)?/g;function Wx(s,t){s.seq.push(t),s.map[t.id]=t}function FC(s,t,i){const o=s.name,l=o.length;for(Mp.lastIndex=0;;){const u=Mp.exec(o),h=Mp.lastIndex;let p=u[1];const m=u[2]==="]",g=u[3];if(m&&(p=p|0),g===void 0||g==="["&&h+2===l){Wx(i,g===void 0?new PC(p,s,t):new IC(p,s,t));break}else{let v=i.map[p];v===void 0&&(v=new BC(p),Wx(i,v)),i=v}}}class Wu{constructor(t,i){this.seq=[],this.map={};const o=t.getProgramParameter(i,t.ACTIVE_UNIFORMS);for(let l=0;l<o;++l){const u=t.getActiveUniform(i,l),h=t.getUniformLocation(i,u.name);FC(u,h,this)}}setValue(t,i,o,l){const u=this.map[i];u!==void 0&&u.setValue(t,o,l)}setOptional(t,i,o){const l=i[o];l!==void 0&&this.setValue(t,o,l)}static upload(t,i,o,l){for(let u=0,h=i.length;u!==h;++u){const p=i[u],m=o[p.id];m.needsUpdate!==!1&&p.setValue(t,m.value,l)}}static seqWithValue(t,i){const o=[];for(let l=0,u=t.length;l!==u;++l){const h=t[l];h.id in i&&o.push(h)}return o}}function Zx(s,t,i){const o=s.createShader(t);return s.shaderSource(o,i),s.compileShader(o),o}const HC=37297;let jC=0;function GC(s,t){const i=s.split(`
`),o=[],l=Math.max(t-6,0),u=Math.min(t+6,i.length);for(let h=l;h<u;h++){const p=h+1;o.push(`${p===t?">":" "} ${p}: ${i[h]}`)}return o.join(`
`)}const Kx=new vt;function VC(s){Lt._getMatrix(Kx,Lt.workingColorSpace,s);const t=`mat3( ${Kx.elements.map(i=>i.toFixed(4))} )`;switch(Lt.getTransfer(s)){case Ju:return[t,"LinearTransferOETF"];case Xt:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Qx(s,t,i){const o=s.getShaderParameter(t,s.COMPILE_STATUS),u=(s.getShaderInfoLog(t)||"").trim();if(o&&u==="")return"";const h=/ERROR: 0:(\d+)/.exec(u);if(h){const p=parseInt(h[1]);return i.toUpperCase()+`

`+u+`

`+GC(s.getShaderSource(t),p)}else return u}function kC(s,t){const i=VC(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}function XC(s,t){let i;switch(t){case Ey:i="Linear";break;case Ty:i="Reinhard";break;case by:i="Cineon";break;case bm:i="ACESFilmic";break;case Cy:i="AgX";break;case Ry:i="Neutral";break;case Ay:i="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),i="Linear"}return"vec3 "+s+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const Hu=new ae;function qC(){Lt.getLuminanceCoefficients(Hu);const s=Hu.x.toFixed(4),t=Hu.y.toFixed(4),i=Hu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function YC(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(zl).join(`
`)}function WC(s){const t=[];for(const i in s){const o=s[i];o!==!1&&t.push("#define "+i+" "+o)}return t.join(`
`)}function ZC(s,t){const i={},o=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let l=0;l<o;l++){const u=s.getActiveAttrib(t,l),h=u.name;let p=1;u.type===s.FLOAT_MAT2&&(p=2),u.type===s.FLOAT_MAT3&&(p=3),u.type===s.FLOAT_MAT4&&(p=4),i[h]={type:u.type,location:s.getAttribLocation(t,h),locationSize:p}}return i}function zl(s){return s!==""}function Jx(s,t){const i=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function $x(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const KC=/^[ \t]*#include +<([\w\d./]+)>/gm;function vm(s){return s.replace(KC,JC)}const QC=new Map;function JC(s,t){let i=_t[t];if(i===void 0){const o=QC.get(t);if(o!==void 0)i=_t[o],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,o);else throw new Error("Can not resolve #include <"+t+">")}return vm(i)}const $C=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ey(s){return s.replace($C,eR)}function eR(s,t,i,o){let l="";for(let u=parseInt(t);u<parseInt(i);u++)l+=o.replace(/\[\s*i\s*\]/g,"[ "+u+" ]").replace(/UNROLLED_LOOP_INDEX/g,u);return l}function ty(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function tR(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Sy?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===NE?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Oa&&(t="SHADOWMAP_TYPE_VSM"),t}function nR(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case To:case bo:t="ENVMAP_TYPE_CUBE";break;case sf:t="ENVMAP_TYPE_CUBE_UV";break}return t}function iR(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case bo:t="ENVMAP_MODE_REFRACTION";break}return t}function aR(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case My:t="ENVMAP_BLENDING_MULTIPLY";break;case ZE:t="ENVMAP_BLENDING_MIX";break;case KE:t="ENVMAP_BLENDING_ADD";break}return t}function sR(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const i=Math.log2(t)-2,o=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:o,maxMip:i}}function rR(s,t,i,o){const l=s.getContext(),u=i.defines;let h=i.vertexShader,p=i.fragmentShader;const m=tR(i),g=nR(i),x=iR(i),v=aR(i),S=sR(i),E=YC(i),b=WC(u),T=l.createProgram();let M,_,L=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(M=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b].filter(zl).join(`
`),M.length>0&&(M+=`
`),_=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b].filter(zl).join(`
`),_.length>0&&(_+=`
`)):(M=[ty(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+x:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(zl).join(`
`),_=[ty(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+g:"",i.envMap?"#define "+x:"",i.envMap?"#define "+v:"",S?"#define CUBEUV_TEXEL_WIDTH "+S.texelWidth:"",S?"#define CUBEUV_TEXEL_HEIGHT "+S.texelHeight:"",S?"#define CUBEUV_MAX_MIP "+S.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor||i.batchingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==Es?"#define TONE_MAPPING":"",i.toneMapping!==Es?_t.tonemapping_pars_fragment:"",i.toneMapping!==Es?XC("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",_t.colorspace_pars_fragment,kC("linearToOutputTexel",i.outputColorSpace),qC(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(zl).join(`
`)),h=vm(h),h=Jx(h,i),h=$x(h,i),p=vm(p),p=Jx(p,i),p=$x(p,i),h=ey(h),p=ey(p),i.isRawShaderMaterial!==!0&&(L=`#version 300 es
`,M=[E,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+M,_=["#define varying in",i.glslVersion===fx?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===fx?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const z=L+M+h,N=L+_+p,V=Zx(l,l.VERTEX_SHADER,z),H=Zx(l,l.FRAGMENT_SHADER,N);l.attachShader(T,V),l.attachShader(T,H),i.index0AttributeName!==void 0?l.bindAttribLocation(T,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(T,0,"position"),l.linkProgram(T);function I(G){if(s.debug.checkShaderErrors){const ie=l.getProgramInfoLog(T)||"",ue=l.getShaderInfoLog(V)||"",Z=l.getShaderInfoLog(H)||"",B=ie.trim(),O=ue.trim(),k=Z.trim();let X=!0,ve=!0;if(l.getProgramParameter(T,l.LINK_STATUS)===!1)if(X=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(l,T,V,H);else{const _e=Qx(l,V,"vertex"),He=Qx(l,H,"fragment");console.error("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(T,l.VALIDATE_STATUS)+`

Material Name: `+G.name+`
Material Type: `+G.type+`

Program Info Log: `+B+`
`+_e+`
`+He)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(O===""||k==="")&&(ve=!1);ve&&(G.diagnostics={runnable:X,programLog:B,vertexShader:{log:O,prefix:M},fragmentShader:{log:k,prefix:_}})}l.deleteShader(V),l.deleteShader(H),Y=new Wu(l,T),U=ZC(l,T)}let Y;this.getUniforms=function(){return Y===void 0&&I(this),Y};let U;this.getAttributes=function(){return U===void 0&&I(this),U};let R=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=l.getProgramParameter(T,HC)),R},this.destroy=function(){o.releaseStatesOfProgram(this),l.deleteProgram(T),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=jC++,this.cacheKey=t,this.usedTimes=1,this.program=T,this.vertexShader=V,this.fragmentShader=H,this}let oR=0;class lR{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const i=t.vertexShader,o=t.fragmentShader,l=this._getShaderStage(i),u=this._getShaderStage(o),h=this._getShaderCacheForMaterial(t);return h.has(l)===!1&&(h.add(l),l.usedTimes++),h.has(u)===!1&&(h.add(u),u.usedTimes++),this}remove(t){const i=this.materialCache.get(t);for(const o of i)o.usedTimes--,o.usedTimes===0&&this.shaderCache.delete(o.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const i=this.materialCache;let o=i.get(t);return o===void 0&&(o=new Set,i.set(t,o)),o}_getShaderStage(t){const i=this.shaderCache;let o=i.get(t);return o===void 0&&(o=new cR(t),i.set(t,o)),o}}class cR{constructor(t){this.id=oR++,this.code=t,this.usedTimes=0}}function uR(s,t,i,o,l,u,h){const p=new Vy,m=new lR,g=new Set,x=[],v=l.logarithmicDepthBuffer,S=l.vertexTextures;let E=l.precision;const b={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function T(U){return g.add(U),U===0?"uv":`uv${U}`}function M(U,R,G,ie,ue){const Z=ie.fog,B=ue.geometry,O=U.isMeshStandardMaterial?ie.environment:null,k=(U.isMeshStandardMaterial?i:t).get(U.envMap||O),X=k&&k.mapping===sf?k.image.height:null,ve=b[U.type];U.precision!==null&&(E=l.getMaxPrecision(U.precision),E!==U.precision&&console.warn("THREE.WebGLProgram.getParameters:",U.precision,"not supported, using",E,"instead."));const _e=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,He=_e!==void 0?_e.length:0;let $e=0;B.morphAttributes.position!==void 0&&($e=1),B.morphAttributes.normal!==void 0&&($e=2),B.morphAttributes.color!==void 0&&($e=3);let xt,j,de,$;if(ve){const Ct=la[ve];xt=Ct.vertexShader,j=Ct.fragmentShader}else xt=U.vertexShader,j=U.fragmentShader,m.update(U),de=m.getVertexShaderID(U),$=m.getFragmentShaderID(U);const oe=s.getRenderTarget(),Ee=s.state.buffers.depth.getReversed(),Le=ue.isInstancedMesh===!0,Ae=ue.isBatchedMesh===!0,Te=!!U.map,Xe=!!U.matcap,D=!!k,Ce=!!U.aoMap,Ve=!!U.lightMap,Qe=!!U.bumpMap,Be=!!U.normalMap,lt=!!U.displacementMap,ke=!!U.emissiveMap,Me=!!U.metalnessMap,it=!!U.roughnessMap,At=U.anisotropy>0,P=U.clearcoat>0,C=U.dispersion>0,se=U.iridescence>0,pe=U.sheen>0,xe=U.transmission>0,he=At&&!!U.anisotropyMap,Ze=P&&!!U.clearcoatMap,Ne=P&&!!U.clearcoatNormalMap,De=P&&!!U.clearcoatRoughnessMap,Ye=se&&!!U.iridescenceMap,Se=se&&!!U.iridescenceThicknessMap,Ue=pe&&!!U.sheenColorMap,at=pe&&!!U.sheenRoughnessMap,Je=!!U.specularMap,Oe=!!U.specularColorMap,ft=!!U.specularIntensityMap,W=xe&&!!U.transmissionMap,we=xe&&!!U.thicknessMap,Ie=!!U.gradientMap,Ke=!!U.alphaMap,be=U.alphaTest>0,ye=!!U.alphaHash,nt=!!U.extensions;let ht=Es;U.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(ht=s.toneMapping);const qt={shaderID:ve,shaderType:U.type,shaderName:U.name,vertexShader:xt,fragmentShader:j,defines:U.defines,customVertexShaderID:de,customFragmentShaderID:$,isRawShaderMaterial:U.isRawShaderMaterial===!0,glslVersion:U.glslVersion,precision:E,batching:Ae,batchingColor:Ae&&ue._colorsTexture!==null,instancing:Le,instancingColor:Le&&ue.instanceColor!==null,instancingMorph:Le&&ue.morphTexture!==null,supportsVertexTextures:S,outputColorSpace:oe===null?s.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:Ao,alphaToCoverage:!!U.alphaToCoverage,map:Te,matcap:Xe,envMap:D,envMapMode:D&&k.mapping,envMapCubeUVHeight:X,aoMap:Ce,lightMap:Ve,bumpMap:Qe,normalMap:Be,displacementMap:S&&lt,emissiveMap:ke,normalMapObjectSpace:Be&&U.normalMapType===eT,normalMapTangentSpace:Be&&U.normalMapType===By,metalnessMap:Me,roughnessMap:it,anisotropy:At,anisotropyMap:he,clearcoat:P,clearcoatMap:Ze,clearcoatNormalMap:Ne,clearcoatRoughnessMap:De,dispersion:C,iridescence:se,iridescenceMap:Ye,iridescenceThicknessMap:Se,sheen:pe,sheenColorMap:Ue,sheenRoughnessMap:at,specularMap:Je,specularColorMap:Oe,specularIntensityMap:ft,transmission:xe,transmissionMap:W,thicknessMap:we,gradientMap:Ie,opaque:U.transparent===!1&&U.blending===xo&&U.alphaToCoverage===!1,alphaMap:Ke,alphaTest:be,alphaHash:ye,combine:U.combine,mapUv:Te&&T(U.map.channel),aoMapUv:Ce&&T(U.aoMap.channel),lightMapUv:Ve&&T(U.lightMap.channel),bumpMapUv:Qe&&T(U.bumpMap.channel),normalMapUv:Be&&T(U.normalMap.channel),displacementMapUv:lt&&T(U.displacementMap.channel),emissiveMapUv:ke&&T(U.emissiveMap.channel),metalnessMapUv:Me&&T(U.metalnessMap.channel),roughnessMapUv:it&&T(U.roughnessMap.channel),anisotropyMapUv:he&&T(U.anisotropyMap.channel),clearcoatMapUv:Ze&&T(U.clearcoatMap.channel),clearcoatNormalMapUv:Ne&&T(U.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:De&&T(U.clearcoatRoughnessMap.channel),iridescenceMapUv:Ye&&T(U.iridescenceMap.channel),iridescenceThicknessMapUv:Se&&T(U.iridescenceThicknessMap.channel),sheenColorMapUv:Ue&&T(U.sheenColorMap.channel),sheenRoughnessMapUv:at&&T(U.sheenRoughnessMap.channel),specularMapUv:Je&&T(U.specularMap.channel),specularColorMapUv:Oe&&T(U.specularColorMap.channel),specularIntensityMapUv:ft&&T(U.specularIntensityMap.channel),transmissionMapUv:W&&T(U.transmissionMap.channel),thicknessMapUv:we&&T(U.thicknessMap.channel),alphaMapUv:Ke&&T(U.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(Be||At),vertexColors:U.vertexColors,vertexAlphas:U.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:ue.isPoints===!0&&!!B.attributes.uv&&(Te||Ke),fog:!!Z,useFog:U.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:U.flatShading===!0&&U.wireframe===!1,sizeAttenuation:U.sizeAttenuation===!0,logarithmicDepthBuffer:v,reversedDepthBuffer:Ee,skinning:ue.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:He,morphTextureStride:$e,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numSpotLightMaps:R.spotLightMap.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numSpotLightShadowsWithMaps:R.numSpotLightShadowsWithMaps,numLightProbes:R.numLightProbes,numClippingPlanes:h.numPlanes,numClipIntersection:h.numIntersection,dithering:U.dithering,shadowMapEnabled:s.shadowMap.enabled&&G.length>0,shadowMapType:s.shadowMap.type,toneMapping:ht,decodeVideoTexture:Te&&U.map.isVideoTexture===!0&&Lt.getTransfer(U.map.colorSpace)===Xt,decodeVideoTextureEmissive:ke&&U.emissiveMap.isVideoTexture===!0&&Lt.getTransfer(U.emissiveMap.colorSpace)===Xt,premultipliedAlpha:U.premultipliedAlpha,doubleSided:U.side===ca,flipSided:U.side===ii,useDepthPacking:U.depthPacking>=0,depthPacking:U.depthPacking||0,index0AttributeName:U.index0AttributeName,extensionClipCullDistance:nt&&U.extensions.clipCullDistance===!0&&o.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(nt&&U.extensions.multiDraw===!0||Ae)&&o.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:o.has("KHR_parallel_shader_compile"),customProgramCacheKey:U.customProgramCacheKey()};return qt.vertexUv1s=g.has(1),qt.vertexUv2s=g.has(2),qt.vertexUv3s=g.has(3),g.clear(),qt}function _(U){const R=[];if(U.shaderID?R.push(U.shaderID):(R.push(U.customVertexShaderID),R.push(U.customFragmentShaderID)),U.defines!==void 0)for(const G in U.defines)R.push(G),R.push(U.defines[G]);return U.isRawShaderMaterial===!1&&(L(R,U),z(R,U),R.push(s.outputColorSpace)),R.push(U.customProgramCacheKey),R.join()}function L(U,R){U.push(R.precision),U.push(R.outputColorSpace),U.push(R.envMapMode),U.push(R.envMapCubeUVHeight),U.push(R.mapUv),U.push(R.alphaMapUv),U.push(R.lightMapUv),U.push(R.aoMapUv),U.push(R.bumpMapUv),U.push(R.normalMapUv),U.push(R.displacementMapUv),U.push(R.emissiveMapUv),U.push(R.metalnessMapUv),U.push(R.roughnessMapUv),U.push(R.anisotropyMapUv),U.push(R.clearcoatMapUv),U.push(R.clearcoatNormalMapUv),U.push(R.clearcoatRoughnessMapUv),U.push(R.iridescenceMapUv),U.push(R.iridescenceThicknessMapUv),U.push(R.sheenColorMapUv),U.push(R.sheenRoughnessMapUv),U.push(R.specularMapUv),U.push(R.specularColorMapUv),U.push(R.specularIntensityMapUv),U.push(R.transmissionMapUv),U.push(R.thicknessMapUv),U.push(R.combine),U.push(R.fogExp2),U.push(R.sizeAttenuation),U.push(R.morphTargetsCount),U.push(R.morphAttributeCount),U.push(R.numDirLights),U.push(R.numPointLights),U.push(R.numSpotLights),U.push(R.numSpotLightMaps),U.push(R.numHemiLights),U.push(R.numRectAreaLights),U.push(R.numDirLightShadows),U.push(R.numPointLightShadows),U.push(R.numSpotLightShadows),U.push(R.numSpotLightShadowsWithMaps),U.push(R.numLightProbes),U.push(R.shadowMapType),U.push(R.toneMapping),U.push(R.numClippingPlanes),U.push(R.numClipIntersection),U.push(R.depthPacking)}function z(U,R){p.disableAll(),R.supportsVertexTextures&&p.enable(0),R.instancing&&p.enable(1),R.instancingColor&&p.enable(2),R.instancingMorph&&p.enable(3),R.matcap&&p.enable(4),R.envMap&&p.enable(5),R.normalMapObjectSpace&&p.enable(6),R.normalMapTangentSpace&&p.enable(7),R.clearcoat&&p.enable(8),R.iridescence&&p.enable(9),R.alphaTest&&p.enable(10),R.vertexColors&&p.enable(11),R.vertexAlphas&&p.enable(12),R.vertexUv1s&&p.enable(13),R.vertexUv2s&&p.enable(14),R.vertexUv3s&&p.enable(15),R.vertexTangents&&p.enable(16),R.anisotropy&&p.enable(17),R.alphaHash&&p.enable(18),R.batching&&p.enable(19),R.dispersion&&p.enable(20),R.batchingColor&&p.enable(21),R.gradientMap&&p.enable(22),U.push(p.mask),p.disableAll(),R.fog&&p.enable(0),R.useFog&&p.enable(1),R.flatShading&&p.enable(2),R.logarithmicDepthBuffer&&p.enable(3),R.reversedDepthBuffer&&p.enable(4),R.skinning&&p.enable(5),R.morphTargets&&p.enable(6),R.morphNormals&&p.enable(7),R.morphColors&&p.enable(8),R.premultipliedAlpha&&p.enable(9),R.shadowMapEnabled&&p.enable(10),R.doubleSided&&p.enable(11),R.flipSided&&p.enable(12),R.useDepthPacking&&p.enable(13),R.dithering&&p.enable(14),R.transmission&&p.enable(15),R.sheen&&p.enable(16),R.opaque&&p.enable(17),R.pointsUvs&&p.enable(18),R.decodeVideoTexture&&p.enable(19),R.decodeVideoTextureEmissive&&p.enable(20),R.alphaToCoverage&&p.enable(21),U.push(p.mask)}function N(U){const R=b[U.type];let G;if(R){const ie=la[R];G=Gl.clone(ie.uniforms)}else G=U.uniforms;return G}function V(U,R){let G;for(let ie=0,ue=x.length;ie<ue;ie++){const Z=x[ie];if(Z.cacheKey===R){G=Z,++G.usedTimes;break}}return G===void 0&&(G=new rR(s,R,U,u),x.push(G)),G}function H(U){if(--U.usedTimes===0){const R=x.indexOf(U);x[R]=x[x.length-1],x.pop(),U.destroy()}}function I(U){m.remove(U)}function Y(){m.dispose()}return{getParameters:M,getProgramCacheKey:_,getUniforms:N,acquireProgram:V,releaseProgram:H,releaseShaderCache:I,programs:x,dispose:Y}}function fR(){let s=new WeakMap;function t(h){return s.has(h)}function i(h){let p=s.get(h);return p===void 0&&(p={},s.set(h,p)),p}function o(h){s.delete(h)}function l(h,p,m){s.get(h)[p]=m}function u(){s=new WeakMap}return{has:t,get:i,remove:o,update:l,dispose:u}}function dR(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function ny(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function iy(){const s=[];let t=0;const i=[],o=[],l=[];function u(){t=0,i.length=0,o.length=0,l.length=0}function h(v,S,E,b,T,M){let _=s[t];return _===void 0?(_={id:v.id,object:v,geometry:S,material:E,groupOrder:b,renderOrder:v.renderOrder,z:T,group:M},s[t]=_):(_.id=v.id,_.object=v,_.geometry=S,_.material=E,_.groupOrder=b,_.renderOrder=v.renderOrder,_.z=T,_.group=M),t++,_}function p(v,S,E,b,T,M){const _=h(v,S,E,b,T,M);E.transmission>0?o.push(_):E.transparent===!0?l.push(_):i.push(_)}function m(v,S,E,b,T,M){const _=h(v,S,E,b,T,M);E.transmission>0?o.unshift(_):E.transparent===!0?l.unshift(_):i.unshift(_)}function g(v,S){i.length>1&&i.sort(v||dR),o.length>1&&o.sort(S||ny),l.length>1&&l.sort(S||ny)}function x(){for(let v=t,S=s.length;v<S;v++){const E=s[v];if(E.id===null)break;E.id=null,E.object=null,E.geometry=null,E.material=null,E.group=null}}return{opaque:i,transmissive:o,transparent:l,init:u,push:p,unshift:m,finish:x,sort:g}}function hR(){let s=new WeakMap;function t(o,l){const u=s.get(o);let h;return u===void 0?(h=new iy,s.set(o,[h])):l>=u.length?(h=new iy,u.push(h)):h=u[l],h}function i(){s=new WeakMap}return{get:t,dispose:i}}function pR(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let i;switch(t.type){case"DirectionalLight":i={direction:new ae,color:new Nt};break;case"SpotLight":i={position:new ae,direction:new ae,color:new Nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new ae,color:new Nt,distance:0,decay:0};break;case"HemisphereLight":i={direction:new ae,skyColor:new Nt,groundColor:new Nt};break;case"RectAreaLight":i={color:new Nt,position:new ae,halfWidth:new ae,halfHeight:new ae};break}return s[t.id]=i,i}}}function mR(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let i;switch(t.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=i,i}}}let gR=0;function vR(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function _R(s){const t=new pR,i=mR(),o={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let g=0;g<9;g++)o.probe.push(new ae);const l=new ae,u=new sn,h=new sn;function p(g){let x=0,v=0,S=0;for(let U=0;U<9;U++)o.probe[U].set(0,0,0);let E=0,b=0,T=0,M=0,_=0,L=0,z=0,N=0,V=0,H=0,I=0;g.sort(vR);for(let U=0,R=g.length;U<R;U++){const G=g[U],ie=G.color,ue=G.intensity,Z=G.distance,B=G.shadow&&G.shadow.map?G.shadow.map.texture:null;if(G.isAmbientLight)x+=ie.r*ue,v+=ie.g*ue,S+=ie.b*ue;else if(G.isLightProbe){for(let O=0;O<9;O++)o.probe[O].addScaledVector(G.sh.coefficients[O],ue);I++}else if(G.isDirectionalLight){const O=t.get(G);if(O.color.copy(G.color).multiplyScalar(G.intensity),G.castShadow){const k=G.shadow,X=i.get(G);X.shadowIntensity=k.intensity,X.shadowBias=k.bias,X.shadowNormalBias=k.normalBias,X.shadowRadius=k.radius,X.shadowMapSize=k.mapSize,o.directionalShadow[E]=X,o.directionalShadowMap[E]=B,o.directionalShadowMatrix[E]=G.shadow.matrix,L++}o.directional[E]=O,E++}else if(G.isSpotLight){const O=t.get(G);O.position.setFromMatrixPosition(G.matrixWorld),O.color.copy(ie).multiplyScalar(ue),O.distance=Z,O.coneCos=Math.cos(G.angle),O.penumbraCos=Math.cos(G.angle*(1-G.penumbra)),O.decay=G.decay,o.spot[T]=O;const k=G.shadow;if(G.map&&(o.spotLightMap[V]=G.map,V++,k.updateMatrices(G),G.castShadow&&H++),o.spotLightMatrix[T]=k.matrix,G.castShadow){const X=i.get(G);X.shadowIntensity=k.intensity,X.shadowBias=k.bias,X.shadowNormalBias=k.normalBias,X.shadowRadius=k.radius,X.shadowMapSize=k.mapSize,o.spotShadow[T]=X,o.spotShadowMap[T]=B,N++}T++}else if(G.isRectAreaLight){const O=t.get(G);O.color.copy(ie).multiplyScalar(ue),O.halfWidth.set(G.width*.5,0,0),O.halfHeight.set(0,G.height*.5,0),o.rectArea[M]=O,M++}else if(G.isPointLight){const O=t.get(G);if(O.color.copy(G.color).multiplyScalar(G.intensity),O.distance=G.distance,O.decay=G.decay,G.castShadow){const k=G.shadow,X=i.get(G);X.shadowIntensity=k.intensity,X.shadowBias=k.bias,X.shadowNormalBias=k.normalBias,X.shadowRadius=k.radius,X.shadowMapSize=k.mapSize,X.shadowCameraNear=k.camera.near,X.shadowCameraFar=k.camera.far,o.pointShadow[b]=X,o.pointShadowMap[b]=B,o.pointShadowMatrix[b]=G.shadow.matrix,z++}o.point[b]=O,b++}else if(G.isHemisphereLight){const O=t.get(G);O.skyColor.copy(G.color).multiplyScalar(ue),O.groundColor.copy(G.groundColor).multiplyScalar(ue),o.hemi[_]=O,_++}}M>0&&(s.has("OES_texture_float_linear")===!0?(o.rectAreaLTC1=Ge.LTC_FLOAT_1,o.rectAreaLTC2=Ge.LTC_FLOAT_2):(o.rectAreaLTC1=Ge.LTC_HALF_1,o.rectAreaLTC2=Ge.LTC_HALF_2)),o.ambient[0]=x,o.ambient[1]=v,o.ambient[2]=S;const Y=o.hash;(Y.directionalLength!==E||Y.pointLength!==b||Y.spotLength!==T||Y.rectAreaLength!==M||Y.hemiLength!==_||Y.numDirectionalShadows!==L||Y.numPointShadows!==z||Y.numSpotShadows!==N||Y.numSpotMaps!==V||Y.numLightProbes!==I)&&(o.directional.length=E,o.spot.length=T,o.rectArea.length=M,o.point.length=b,o.hemi.length=_,o.directionalShadow.length=L,o.directionalShadowMap.length=L,o.pointShadow.length=z,o.pointShadowMap.length=z,o.spotShadow.length=N,o.spotShadowMap.length=N,o.directionalShadowMatrix.length=L,o.pointShadowMatrix.length=z,o.spotLightMatrix.length=N+V-H,o.spotLightMap.length=V,o.numSpotLightShadowsWithMaps=H,o.numLightProbes=I,Y.directionalLength=E,Y.pointLength=b,Y.spotLength=T,Y.rectAreaLength=M,Y.hemiLength=_,Y.numDirectionalShadows=L,Y.numPointShadows=z,Y.numSpotShadows=N,Y.numSpotMaps=V,Y.numLightProbes=I,o.version=gR++)}function m(g,x){let v=0,S=0,E=0,b=0,T=0;const M=x.matrixWorldInverse;for(let _=0,L=g.length;_<L;_++){const z=g[_];if(z.isDirectionalLight){const N=o.directional[v];N.direction.setFromMatrixPosition(z.matrixWorld),l.setFromMatrixPosition(z.target.matrixWorld),N.direction.sub(l),N.direction.transformDirection(M),v++}else if(z.isSpotLight){const N=o.spot[E];N.position.setFromMatrixPosition(z.matrixWorld),N.position.applyMatrix4(M),N.direction.setFromMatrixPosition(z.matrixWorld),l.setFromMatrixPosition(z.target.matrixWorld),N.direction.sub(l),N.direction.transformDirection(M),E++}else if(z.isRectAreaLight){const N=o.rectArea[b];N.position.setFromMatrixPosition(z.matrixWorld),N.position.applyMatrix4(M),h.identity(),u.copy(z.matrixWorld),u.premultiply(M),h.extractRotation(u),N.halfWidth.set(z.width*.5,0,0),N.halfHeight.set(0,z.height*.5,0),N.halfWidth.applyMatrix4(h),N.halfHeight.applyMatrix4(h),b++}else if(z.isPointLight){const N=o.point[S];N.position.setFromMatrixPosition(z.matrixWorld),N.position.applyMatrix4(M),S++}else if(z.isHemisphereLight){const N=o.hemi[T];N.direction.setFromMatrixPosition(z.matrixWorld),N.direction.transformDirection(M),T++}}}return{setup:p,setupView:m,state:o}}function ay(s){const t=new _R(s),i=[],o=[];function l(x){g.camera=x,i.length=0,o.length=0}function u(x){i.push(x)}function h(x){o.push(x)}function p(){t.setup(i)}function m(x){t.setupView(i,x)}const g={lightsArray:i,shadowsArray:o,camera:null,lights:t,transmissionRenderTarget:{}};return{init:l,state:g,setupLights:p,setupLightsView:m,pushLight:u,pushShadow:h}}function xR(s){let t=new WeakMap;function i(l,u=0){const h=t.get(l);let p;return h===void 0?(p=new ay(s),t.set(l,[p])):u>=h.length?(p=new ay(s),h.push(p)):p=h[u],p}function o(){t=new WeakMap}return{get:i,dispose:o}}const yR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,SR=`uniform sampler2D shadow_pass;
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
}`;function MR(s,t,i){let o=new Lm;const l=new pt,u=new pt,h=new Wt,p=new HT({depthPacking:$E}),m=new jT,g={},x=i.maxTextureSize,v={[Cs]:ii,[ii]:Cs,[ca]:ca},S=new Yn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new pt},radius:{value:4}},vertexShader:yR,fragmentShader:SR}),E=S.clone();E.defines.HORIZONTAL_PASS=1;const b=new Zi;b.setAttribute("position",new Wi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const T=new gi(b,S),M=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sy;let _=this.type;this.render=function(H,I,Y){if(M.enabled===!1||M.autoUpdate===!1&&M.needsUpdate===!1||H.length===0)return;const U=s.getRenderTarget(),R=s.getActiveCubeFace(),G=s.getActiveMipmapLevel(),ie=s.state;ie.setBlending(Pa),ie.buffers.depth.getReversed()===!0?ie.buffers.color.setClear(0,0,0,0):ie.buffers.color.setClear(1,1,1,1),ie.buffers.depth.setTest(!0),ie.setScissorTest(!1);const ue=_!==Oa&&this.type===Oa,Z=_===Oa&&this.type!==Oa;for(let B=0,O=H.length;B<O;B++){const k=H[B],X=k.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",k,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;l.copy(X.mapSize);const ve=X.getFrameExtents();if(l.multiply(ve),u.copy(X.mapSize),(l.x>x||l.y>x)&&(l.x>x&&(u.x=Math.floor(x/ve.x),l.x=u.x*ve.x,X.mapSize.x=u.x),l.y>x&&(u.y=Math.floor(x/ve.y),l.y=u.y*ve.y,X.mapSize.y=u.y)),X.map===null||ue===!0||Z===!0){const He=this.type!==Oa?{minFilter:Li,magFilter:Li}:{};X.map!==null&&X.map.dispose(),X.map=new Yi(l.x,l.y,He),X.map.texture.name=k.name+".shadowMap",X.camera.updateProjectionMatrix()}s.setRenderTarget(X.map),s.clear();const _e=X.getViewportCount();for(let He=0;He<_e;He++){const $e=X.getViewport(He);h.set(u.x*$e.x,u.y*$e.y,u.x*$e.z,u.y*$e.w),ie.viewport(h),X.updateMatrices(k,He),o=X.getFrustum(),N(I,Y,X.camera,k,this.type)}X.isPointLightShadow!==!0&&this.type===Oa&&L(X,Y),X.needsUpdate=!1}_=this.type,M.needsUpdate=!1,s.setRenderTarget(U,R,G)};function L(H,I){const Y=t.update(T);S.defines.VSM_SAMPLES!==H.blurSamples&&(S.defines.VSM_SAMPLES=H.blurSamples,E.defines.VSM_SAMPLES=H.blurSamples,S.needsUpdate=!0,E.needsUpdate=!0),H.mapPass===null&&(H.mapPass=new Yi(l.x,l.y)),S.uniforms.shadow_pass.value=H.map.texture,S.uniforms.resolution.value=H.mapSize,S.uniforms.radius.value=H.radius,s.setRenderTarget(H.mapPass),s.clear(),s.renderBufferDirect(I,null,Y,S,T,null),E.uniforms.shadow_pass.value=H.mapPass.texture,E.uniforms.resolution.value=H.mapSize,E.uniforms.radius.value=H.radius,s.setRenderTarget(H.map),s.clear(),s.renderBufferDirect(I,null,Y,E,T,null)}function z(H,I,Y,U){let R=null;const G=Y.isPointLight===!0?H.customDistanceMaterial:H.customDepthMaterial;if(G!==void 0)R=G;else if(R=Y.isPointLight===!0?m:p,s.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0||I.alphaToCoverage===!0){const ie=R.uuid,ue=I.uuid;let Z=g[ie];Z===void 0&&(Z={},g[ie]=Z);let B=Z[ue];B===void 0&&(B=R.clone(),Z[ue]=B,I.addEventListener("dispose",V)),R=B}if(R.visible=I.visible,R.wireframe=I.wireframe,U===Oa?R.side=I.shadowSide!==null?I.shadowSide:I.side:R.side=I.shadowSide!==null?I.shadowSide:v[I.side],R.alphaMap=I.alphaMap,R.alphaTest=I.alphaToCoverage===!0?.5:I.alphaTest,R.map=I.map,R.clipShadows=I.clipShadows,R.clippingPlanes=I.clippingPlanes,R.clipIntersection=I.clipIntersection,R.displacementMap=I.displacementMap,R.displacementScale=I.displacementScale,R.displacementBias=I.displacementBias,R.wireframeLinewidth=I.wireframeLinewidth,R.linewidth=I.linewidth,Y.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const ie=s.properties.get(R);ie.light=Y}return R}function N(H,I,Y,U,R){if(H.visible===!1)return;if(H.layers.test(I.layers)&&(H.isMesh||H.isLine||H.isPoints)&&(H.castShadow||H.receiveShadow&&R===Oa)&&(!H.frustumCulled||o.intersectsObject(H))){H.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,H.matrixWorld);const ue=t.update(H),Z=H.material;if(Array.isArray(Z)){const B=ue.groups;for(let O=0,k=B.length;O<k;O++){const X=B[O],ve=Z[X.materialIndex];if(ve&&ve.visible){const _e=z(H,ve,U,R);H.onBeforeShadow(s,H,I,Y,ue,_e,X),s.renderBufferDirect(Y,null,ue,_e,H,X),H.onAfterShadow(s,H,I,Y,ue,_e,X)}}}else if(Z.visible){const B=z(H,Z,U,R);H.onBeforeShadow(s,H,I,Y,ue,B,null),s.renderBufferDirect(Y,null,ue,B,H,null),H.onAfterShadow(s,H,I,Y,ue,B,null)}}const ie=H.children;for(let ue=0,Z=ie.length;ue<Z;ue++)N(ie[ue],I,Y,U,R)}function V(H){H.target.removeEventListener("dispose",V);for(const Y in g){const U=g[Y],R=H.target.uuid;R in U&&(U[R].dispose(),delete U[R])}}}const ER={[Np]:Dp,[Up]:zp,[Lp]:Pp,[Eo]:Op,[Dp]:Np,[zp]:Up,[Pp]:Lp,[Op]:Eo};function TR(s,t){function i(){let W=!1;const we=new Wt;let Ie=null;const Ke=new Wt(0,0,0,0);return{setMask:function(be){Ie!==be&&!W&&(s.colorMask(be,be,be,be),Ie=be)},setLocked:function(be){W=be},setClear:function(be,ye,nt,ht,qt){qt===!0&&(be*=ht,ye*=ht,nt*=ht),we.set(be,ye,nt,ht),Ke.equals(we)===!1&&(s.clearColor(be,ye,nt,ht),Ke.copy(we))},reset:function(){W=!1,Ie=null,Ke.set(-1,0,0,0)}}}function o(){let W=!1,we=!1,Ie=null,Ke=null,be=null;return{setReversed:function(ye){if(we!==ye){const nt=t.get("EXT_clip_control");ye?nt.clipControlEXT(nt.LOWER_LEFT_EXT,nt.ZERO_TO_ONE_EXT):nt.clipControlEXT(nt.LOWER_LEFT_EXT,nt.NEGATIVE_ONE_TO_ONE_EXT),we=ye;const ht=be;be=null,this.setClear(ht)}},getReversed:function(){return we},setTest:function(ye){ye?oe(s.DEPTH_TEST):Ee(s.DEPTH_TEST)},setMask:function(ye){Ie!==ye&&!W&&(s.depthMask(ye),Ie=ye)},setFunc:function(ye){if(we&&(ye=ER[ye]),Ke!==ye){switch(ye){case Np:s.depthFunc(s.NEVER);break;case Dp:s.depthFunc(s.ALWAYS);break;case Up:s.depthFunc(s.LESS);break;case Eo:s.depthFunc(s.LEQUAL);break;case Lp:s.depthFunc(s.EQUAL);break;case Op:s.depthFunc(s.GEQUAL);break;case zp:s.depthFunc(s.GREATER);break;case Pp:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Ke=ye}},setLocked:function(ye){W=ye},setClear:function(ye){be!==ye&&(we&&(ye=1-ye),s.clearDepth(ye),be=ye)},reset:function(){W=!1,Ie=null,Ke=null,be=null,we=!1}}}function l(){let W=!1,we=null,Ie=null,Ke=null,be=null,ye=null,nt=null,ht=null,qt=null;return{setTest:function(Ct){W||(Ct?oe(s.STENCIL_TEST):Ee(s.STENCIL_TEST))},setMask:function(Ct){we!==Ct&&!W&&(s.stencilMask(Ct),we=Ct)},setFunc:function(Ct,nn,_n){(Ie!==Ct||Ke!==nn||be!==_n)&&(s.stencilFunc(Ct,nn,_n),Ie=Ct,Ke=nn,be=_n)},setOp:function(Ct,nn,_n){(ye!==Ct||nt!==nn||ht!==_n)&&(s.stencilOp(Ct,nn,_n),ye=Ct,nt=nn,ht=_n)},setLocked:function(Ct){W=Ct},setClear:function(Ct){qt!==Ct&&(s.clearStencil(Ct),qt=Ct)},reset:function(){W=!1,we=null,Ie=null,Ke=null,be=null,ye=null,nt=null,ht=null,qt=null}}}const u=new i,h=new o,p=new l,m=new WeakMap,g=new WeakMap;let x={},v={},S=new WeakMap,E=[],b=null,T=!1,M=null,_=null,L=null,z=null,N=null,V=null,H=null,I=new Nt(0,0,0),Y=0,U=!1,R=null,G=null,ie=null,ue=null,Z=null;const B=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,k=0;const X=s.getParameter(s.VERSION);X.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec(X)[1]),O=k>=1):X.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),O=k>=2);let ve=null,_e={};const He=s.getParameter(s.SCISSOR_BOX),$e=s.getParameter(s.VIEWPORT),xt=new Wt().fromArray(He),j=new Wt().fromArray($e);function de(W,we,Ie,Ke){const be=new Uint8Array(4),ye=s.createTexture();s.bindTexture(W,ye),s.texParameteri(W,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(W,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let nt=0;nt<Ie;nt++)W===s.TEXTURE_3D||W===s.TEXTURE_2D_ARRAY?s.texImage3D(we,0,s.RGBA,1,1,Ke,0,s.RGBA,s.UNSIGNED_BYTE,be):s.texImage2D(we+nt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,be);return ye}const $={};$[s.TEXTURE_2D]=de(s.TEXTURE_2D,s.TEXTURE_2D,1),$[s.TEXTURE_CUBE_MAP]=de(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[s.TEXTURE_2D_ARRAY]=de(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),$[s.TEXTURE_3D]=de(s.TEXTURE_3D,s.TEXTURE_3D,1,1),u.setClear(0,0,0,1),h.setClear(1),p.setClear(0),oe(s.DEPTH_TEST),h.setFunc(Eo),Qe(!1),Be(rx),oe(s.CULL_FACE),Ce(Pa);function oe(W){x[W]!==!0&&(s.enable(W),x[W]=!0)}function Ee(W){x[W]!==!1&&(s.disable(W),x[W]=!1)}function Le(W,we){return v[W]!==we?(s.bindFramebuffer(W,we),v[W]=we,W===s.DRAW_FRAMEBUFFER&&(v[s.FRAMEBUFFER]=we),W===s.FRAMEBUFFER&&(v[s.DRAW_FRAMEBUFFER]=we),!0):!1}function Ae(W,we){let Ie=E,Ke=!1;if(W){Ie=S.get(we),Ie===void 0&&(Ie=[],S.set(we,Ie));const be=W.textures;if(Ie.length!==be.length||Ie[0]!==s.COLOR_ATTACHMENT0){for(let ye=0,nt=be.length;ye<nt;ye++)Ie[ye]=s.COLOR_ATTACHMENT0+ye;Ie.length=be.length,Ke=!0}}else Ie[0]!==s.BACK&&(Ie[0]=s.BACK,Ke=!0);Ke&&s.drawBuffers(Ie)}function Te(W){return b!==W?(s.useProgram(W),b=W,!0):!1}const Xe={[lr]:s.FUNC_ADD,[UE]:s.FUNC_SUBTRACT,[LE]:s.FUNC_REVERSE_SUBTRACT};Xe[OE]=s.MIN,Xe[zE]=s.MAX;const D={[PE]:s.ZERO,[IE]:s.ONE,[BE]:s.SRC_COLOR,[Rp]:s.SRC_ALPHA,[kE]:s.SRC_ALPHA_SATURATE,[GE]:s.DST_COLOR,[HE]:s.DST_ALPHA,[FE]:s.ONE_MINUS_SRC_COLOR,[wp]:s.ONE_MINUS_SRC_ALPHA,[VE]:s.ONE_MINUS_DST_COLOR,[jE]:s.ONE_MINUS_DST_ALPHA,[XE]:s.CONSTANT_COLOR,[qE]:s.ONE_MINUS_CONSTANT_COLOR,[YE]:s.CONSTANT_ALPHA,[WE]:s.ONE_MINUS_CONSTANT_ALPHA};function Ce(W,we,Ie,Ke,be,ye,nt,ht,qt,Ct){if(W===Pa){T===!0&&(Ee(s.BLEND),T=!1);return}if(T===!1&&(oe(s.BLEND),T=!0),W!==DE){if(W!==M||Ct!==U){if((_!==lr||N!==lr)&&(s.blendEquation(s.FUNC_ADD),_=lr,N=lr),Ct)switch(W){case xo:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Cp:s.blendFunc(s.ONE,s.ONE);break;case ox:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case lx:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case xo:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Cp:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case ox:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case lx:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}L=null,z=null,V=null,H=null,I.set(0,0,0),Y=0,M=W,U=Ct}return}be=be||we,ye=ye||Ie,nt=nt||Ke,(we!==_||be!==N)&&(s.blendEquationSeparate(Xe[we],Xe[be]),_=we,N=be),(Ie!==L||Ke!==z||ye!==V||nt!==H)&&(s.blendFuncSeparate(D[Ie],D[Ke],D[ye],D[nt]),L=Ie,z=Ke,V=ye,H=nt),(ht.equals(I)===!1||qt!==Y)&&(s.blendColor(ht.r,ht.g,ht.b,qt),I.copy(ht),Y=qt),M=W,U=!1}function Ve(W,we){W.side===ca?Ee(s.CULL_FACE):oe(s.CULL_FACE);let Ie=W.side===ii;we&&(Ie=!Ie),Qe(Ie),W.blending===xo&&W.transparent===!1?Ce(Pa):Ce(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),h.setFunc(W.depthFunc),h.setTest(W.depthTest),h.setMask(W.depthWrite),u.setMask(W.colorWrite);const Ke=W.stencilWrite;p.setTest(Ke),Ke&&(p.setMask(W.stencilWriteMask),p.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),p.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),ke(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?oe(s.SAMPLE_ALPHA_TO_COVERAGE):Ee(s.SAMPLE_ALPHA_TO_COVERAGE)}function Qe(W){R!==W&&(W?s.frontFace(s.CW):s.frontFace(s.CCW),R=W)}function Be(W){W!==RE?(oe(s.CULL_FACE),W!==G&&(W===rx?s.cullFace(s.BACK):W===wE?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ee(s.CULL_FACE),G=W}function lt(W){W!==ie&&(O&&s.lineWidth(W),ie=W)}function ke(W,we,Ie){W?(oe(s.POLYGON_OFFSET_FILL),(ue!==we||Z!==Ie)&&(s.polygonOffset(we,Ie),ue=we,Z=Ie)):Ee(s.POLYGON_OFFSET_FILL)}function Me(W){W?oe(s.SCISSOR_TEST):Ee(s.SCISSOR_TEST)}function it(W){W===void 0&&(W=s.TEXTURE0+B-1),ve!==W&&(s.activeTexture(W),ve=W)}function At(W,we,Ie){Ie===void 0&&(ve===null?Ie=s.TEXTURE0+B-1:Ie=ve);let Ke=_e[Ie];Ke===void 0&&(Ke={type:void 0,texture:void 0},_e[Ie]=Ke),(Ke.type!==W||Ke.texture!==we)&&(ve!==Ie&&(s.activeTexture(Ie),ve=Ie),s.bindTexture(W,we||$[W]),Ke.type=W,Ke.texture=we)}function P(){const W=_e[ve];W!==void 0&&W.type!==void 0&&(s.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function C(){try{s.compressedTexImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function se(){try{s.compressedTexImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function pe(){try{s.texSubImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function xe(){try{s.texSubImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function he(){try{s.compressedTexSubImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ze(){try{s.compressedTexSubImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ne(){try{s.texStorage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function De(){try{s.texStorage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ye(){try{s.texImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Se(){try{s.texImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ue(W){xt.equals(W)===!1&&(s.scissor(W.x,W.y,W.z,W.w),xt.copy(W))}function at(W){j.equals(W)===!1&&(s.viewport(W.x,W.y,W.z,W.w),j.copy(W))}function Je(W,we){let Ie=g.get(we);Ie===void 0&&(Ie=new WeakMap,g.set(we,Ie));let Ke=Ie.get(W);Ke===void 0&&(Ke=s.getUniformBlockIndex(we,W.name),Ie.set(W,Ke))}function Oe(W,we){const Ke=g.get(we).get(W);m.get(we)!==Ke&&(s.uniformBlockBinding(we,Ke,W.__bindingPointIndex),m.set(we,Ke))}function ft(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),h.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),x={},ve=null,_e={},v={},S=new WeakMap,E=[],b=null,T=!1,M=null,_=null,L=null,z=null,N=null,V=null,H=null,I=new Nt(0,0,0),Y=0,U=!1,R=null,G=null,ie=null,ue=null,Z=null,xt.set(0,0,s.canvas.width,s.canvas.height),j.set(0,0,s.canvas.width,s.canvas.height),u.reset(),h.reset(),p.reset()}return{buffers:{color:u,depth:h,stencil:p},enable:oe,disable:Ee,bindFramebuffer:Le,drawBuffers:Ae,useProgram:Te,setBlending:Ce,setMaterial:Ve,setFlipSided:Qe,setCullFace:Be,setLineWidth:lt,setPolygonOffset:ke,setScissorTest:Me,activeTexture:it,bindTexture:At,unbindTexture:P,compressedTexImage2D:C,compressedTexImage3D:se,texImage2D:Ye,texImage3D:Se,updateUBOMapping:Je,uniformBlockBinding:Oe,texStorage2D:Ne,texStorage3D:De,texSubImage2D:pe,texSubImage3D:xe,compressedTexSubImage2D:he,compressedTexSubImage3D:Ze,scissor:Ue,viewport:at,reset:ft}}function bR(s,t,i,o,l,u,h){const p=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),g=new pt,x=new WeakMap;let v;const S=new WeakMap;let E=!1;try{E=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(P,C){return E?new OffscreenCanvas(P,C):Hl("canvas")}function T(P,C,se){let pe=1;const xe=At(P);if((xe.width>se||xe.height>se)&&(pe=se/Math.max(xe.width,xe.height)),pe<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const he=Math.floor(pe*xe.width),Ze=Math.floor(pe*xe.height);v===void 0&&(v=b(he,Ze));const Ne=C?b(he,Ze):v;return Ne.width=he,Ne.height=Ze,Ne.getContext("2d").drawImage(P,0,0,he,Ze),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+xe.width+"x"+xe.height+") to ("+he+"x"+Ze+")."),Ne}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+xe.width+"x"+xe.height+")."),P;return P}function M(P){return P.generateMipmaps}function _(P){s.generateMipmap(P)}function L(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function z(P,C,se,pe,xe=!1){if(P!==null){if(s[P]!==void 0)return s[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let he=C;if(C===s.RED&&(se===s.FLOAT&&(he=s.R32F),se===s.HALF_FLOAT&&(he=s.R16F),se===s.UNSIGNED_BYTE&&(he=s.R8)),C===s.RED_INTEGER&&(se===s.UNSIGNED_BYTE&&(he=s.R8UI),se===s.UNSIGNED_SHORT&&(he=s.R16UI),se===s.UNSIGNED_INT&&(he=s.R32UI),se===s.BYTE&&(he=s.R8I),se===s.SHORT&&(he=s.R16I),se===s.INT&&(he=s.R32I)),C===s.RG&&(se===s.FLOAT&&(he=s.RG32F),se===s.HALF_FLOAT&&(he=s.RG16F),se===s.UNSIGNED_BYTE&&(he=s.RG8)),C===s.RG_INTEGER&&(se===s.UNSIGNED_BYTE&&(he=s.RG8UI),se===s.UNSIGNED_SHORT&&(he=s.RG16UI),se===s.UNSIGNED_INT&&(he=s.RG32UI),se===s.BYTE&&(he=s.RG8I),se===s.SHORT&&(he=s.RG16I),se===s.INT&&(he=s.RG32I)),C===s.RGB_INTEGER&&(se===s.UNSIGNED_BYTE&&(he=s.RGB8UI),se===s.UNSIGNED_SHORT&&(he=s.RGB16UI),se===s.UNSIGNED_INT&&(he=s.RGB32UI),se===s.BYTE&&(he=s.RGB8I),se===s.SHORT&&(he=s.RGB16I),se===s.INT&&(he=s.RGB32I)),C===s.RGBA_INTEGER&&(se===s.UNSIGNED_BYTE&&(he=s.RGBA8UI),se===s.UNSIGNED_SHORT&&(he=s.RGBA16UI),se===s.UNSIGNED_INT&&(he=s.RGBA32UI),se===s.BYTE&&(he=s.RGBA8I),se===s.SHORT&&(he=s.RGBA16I),se===s.INT&&(he=s.RGBA32I)),C===s.RGB&&(se===s.UNSIGNED_INT_5_9_9_9_REV&&(he=s.RGB9_E5),se===s.UNSIGNED_INT_10F_11F_11F_REV&&(he=s.R11F_G11F_B10F)),C===s.RGBA){const Ze=xe?Ju:Lt.getTransfer(pe);se===s.FLOAT&&(he=s.RGBA32F),se===s.HALF_FLOAT&&(he=s.RGBA16F),se===s.UNSIGNED_BYTE&&(he=Ze===Xt?s.SRGB8_ALPHA8:s.RGBA8),se===s.UNSIGNED_SHORT_4_4_4_4&&(he=s.RGBA4),se===s.UNSIGNED_SHORT_5_5_5_1&&(he=s.RGB5_A1)}return(he===s.R16F||he===s.R32F||he===s.RG16F||he===s.RG32F||he===s.RGBA16F||he===s.RGBA32F)&&t.get("EXT_color_buffer_float"),he}function N(P,C){let se;return P?C===null||C===hr||C===Il?se=s.DEPTH24_STENCIL8:C===za?se=s.DEPTH32F_STENCIL8:C===Pl&&(se=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===hr||C===Il?se=s.DEPTH_COMPONENT24:C===za?se=s.DEPTH_COMPONENT32F:C===Pl&&(se=s.DEPTH_COMPONENT16),se}function V(P,C){return M(P)===!0||P.isFramebufferTexture&&P.minFilter!==Li&&P.minFilter!==Xi?Math.log2(Math.max(C.width,C.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?C.mipmaps.length:1}function H(P){const C=P.target;C.removeEventListener("dispose",H),Y(C),C.isVideoTexture&&x.delete(C)}function I(P){const C=P.target;C.removeEventListener("dispose",I),R(C)}function Y(P){const C=o.get(P);if(C.__webglInit===void 0)return;const se=P.source,pe=S.get(se);if(pe){const xe=pe[C.__cacheKey];xe.usedTimes--,xe.usedTimes===0&&U(P),Object.keys(pe).length===0&&S.delete(se)}o.remove(P)}function U(P){const C=o.get(P);s.deleteTexture(C.__webglTexture);const se=P.source,pe=S.get(se);delete pe[C.__cacheKey],h.memory.textures--}function R(P){const C=o.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),o.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let pe=0;pe<6;pe++){if(Array.isArray(C.__webglFramebuffer[pe]))for(let xe=0;xe<C.__webglFramebuffer[pe].length;xe++)s.deleteFramebuffer(C.__webglFramebuffer[pe][xe]);else s.deleteFramebuffer(C.__webglFramebuffer[pe]);C.__webglDepthbuffer&&s.deleteRenderbuffer(C.__webglDepthbuffer[pe])}else{if(Array.isArray(C.__webglFramebuffer))for(let pe=0;pe<C.__webglFramebuffer.length;pe++)s.deleteFramebuffer(C.__webglFramebuffer[pe]);else s.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&s.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&s.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let pe=0;pe<C.__webglColorRenderbuffer.length;pe++)C.__webglColorRenderbuffer[pe]&&s.deleteRenderbuffer(C.__webglColorRenderbuffer[pe]);C.__webglDepthRenderbuffer&&s.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const se=P.textures;for(let pe=0,xe=se.length;pe<xe;pe++){const he=o.get(se[pe]);he.__webglTexture&&(s.deleteTexture(he.__webglTexture),h.memory.textures--),o.remove(se[pe])}o.remove(P)}let G=0;function ie(){G=0}function ue(){const P=G;return P>=l.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+l.maxTextures),G+=1,P}function Z(P){const C=[];return C.push(P.wrapS),C.push(P.wrapT),C.push(P.wrapR||0),C.push(P.magFilter),C.push(P.minFilter),C.push(P.anisotropy),C.push(P.internalFormat),C.push(P.format),C.push(P.type),C.push(P.generateMipmaps),C.push(P.premultiplyAlpha),C.push(P.flipY),C.push(P.unpackAlignment),C.push(P.colorSpace),C.join()}function B(P,C){const se=o.get(P);if(P.isVideoTexture&&Me(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&se.__version!==P.version){const pe=P.image;if(pe===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(pe.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(se,P,C);return}}else P.isExternalTexture&&(se.__webglTexture=P.sourceTexture?P.sourceTexture:null);i.bindTexture(s.TEXTURE_2D,se.__webglTexture,s.TEXTURE0+C)}function O(P,C){const se=o.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&se.__version!==P.version){$(se,P,C);return}i.bindTexture(s.TEXTURE_2D_ARRAY,se.__webglTexture,s.TEXTURE0+C)}function k(P,C){const se=o.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&se.__version!==P.version){$(se,P,C);return}i.bindTexture(s.TEXTURE_3D,se.__webglTexture,s.TEXTURE0+C)}function X(P,C){const se=o.get(P);if(P.version>0&&se.__version!==P.version){oe(se,P,C);return}i.bindTexture(s.TEXTURE_CUBE_MAP,se.__webglTexture,s.TEXTURE0+C)}const ve={[Fp]:s.REPEAT,[ur]:s.CLAMP_TO_EDGE,[Hp]:s.MIRRORED_REPEAT},_e={[Li]:s.NEAREST,[QE]:s.NEAREST_MIPMAP_NEAREST,[vu]:s.NEAREST_MIPMAP_LINEAR,[Xi]:s.LINEAR,[Gh]:s.LINEAR_MIPMAP_NEAREST,[fr]:s.LINEAR_MIPMAP_LINEAR},He={[tT]:s.NEVER,[oT]:s.ALWAYS,[nT]:s.LESS,[Fy]:s.LEQUAL,[iT]:s.EQUAL,[rT]:s.GEQUAL,[aT]:s.GREATER,[sT]:s.NOTEQUAL};function $e(P,C){if(C.type===za&&t.has("OES_texture_float_linear")===!1&&(C.magFilter===Xi||C.magFilter===Gh||C.magFilter===vu||C.magFilter===fr||C.minFilter===Xi||C.minFilter===Gh||C.minFilter===vu||C.minFilter===fr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,ve[C.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,ve[C.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,ve[C.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,_e[C.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,_e[C.minFilter]),C.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,He[C.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===Li||C.minFilter!==vu&&C.minFilter!==fr||C.type===za&&t.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||o.get(C).__currentAnisotropy){const se=t.get("EXT_texture_filter_anisotropic");s.texParameterf(P,se.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,l.getMaxAnisotropy())),o.get(C).__currentAnisotropy=C.anisotropy}}}function xt(P,C){let se=!1;P.__webglInit===void 0&&(P.__webglInit=!0,C.addEventListener("dispose",H));const pe=C.source;let xe=S.get(pe);xe===void 0&&(xe={},S.set(pe,xe));const he=Z(C);if(he!==P.__cacheKey){xe[he]===void 0&&(xe[he]={texture:s.createTexture(),usedTimes:0},h.memory.textures++,se=!0),xe[he].usedTimes++;const Ze=xe[P.__cacheKey];Ze!==void 0&&(xe[P.__cacheKey].usedTimes--,Ze.usedTimes===0&&U(C)),P.__cacheKey=he,P.__webglTexture=xe[he].texture}return se}function j(P,C,se){return Math.floor(Math.floor(P/se)/C)}function de(P,C,se,pe){const he=P.updateRanges;if(he.length===0)i.texSubImage2D(s.TEXTURE_2D,0,0,0,C.width,C.height,se,pe,C.data);else{he.sort((Se,Ue)=>Se.start-Ue.start);let Ze=0;for(let Se=1;Se<he.length;Se++){const Ue=he[Ze],at=he[Se],Je=Ue.start+Ue.count,Oe=j(at.start,C.width,4),ft=j(Ue.start,C.width,4);at.start<=Je+1&&Oe===ft&&j(at.start+at.count-1,C.width,4)===Oe?Ue.count=Math.max(Ue.count,at.start+at.count-Ue.start):(++Ze,he[Ze]=at)}he.length=Ze+1;const Ne=s.getParameter(s.UNPACK_ROW_LENGTH),De=s.getParameter(s.UNPACK_SKIP_PIXELS),Ye=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,C.width);for(let Se=0,Ue=he.length;Se<Ue;Se++){const at=he[Se],Je=Math.floor(at.start/4),Oe=Math.ceil(at.count/4),ft=Je%C.width,W=Math.floor(Je/C.width),we=Oe,Ie=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,ft),s.pixelStorei(s.UNPACK_SKIP_ROWS,W),i.texSubImage2D(s.TEXTURE_2D,0,ft,W,we,Ie,se,pe,C.data)}P.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,Ne),s.pixelStorei(s.UNPACK_SKIP_PIXELS,De),s.pixelStorei(s.UNPACK_SKIP_ROWS,Ye)}}function $(P,C,se){let pe=s.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(pe=s.TEXTURE_2D_ARRAY),C.isData3DTexture&&(pe=s.TEXTURE_3D);const xe=xt(P,C),he=C.source;i.bindTexture(pe,P.__webglTexture,s.TEXTURE0+se);const Ze=o.get(he);if(he.version!==Ze.__version||xe===!0){i.activeTexture(s.TEXTURE0+se);const Ne=Lt.getPrimaries(Lt.workingColorSpace),De=C.colorSpace===Ss?null:Lt.getPrimaries(C.colorSpace),Ye=C.colorSpace===Ss||Ne===De?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,C.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,C.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ye);let Se=T(C.image,!1,l.maxTextureSize);Se=it(C,Se);const Ue=u.convert(C.format,C.colorSpace),at=u.convert(C.type);let Je=z(C.internalFormat,Ue,at,C.colorSpace,C.isVideoTexture);$e(pe,C);let Oe;const ft=C.mipmaps,W=C.isVideoTexture!==!0,we=Ze.__version===void 0||xe===!0,Ie=he.dataReady,Ke=V(C,Se);if(C.isDepthTexture)Je=N(C.format===Fl,C.type),we&&(W?i.texStorage2D(s.TEXTURE_2D,1,Je,Se.width,Se.height):i.texImage2D(s.TEXTURE_2D,0,Je,Se.width,Se.height,0,Ue,at,null));else if(C.isDataTexture)if(ft.length>0){W&&we&&i.texStorage2D(s.TEXTURE_2D,Ke,Je,ft[0].width,ft[0].height);for(let be=0,ye=ft.length;be<ye;be++)Oe=ft[be],W?Ie&&i.texSubImage2D(s.TEXTURE_2D,be,0,0,Oe.width,Oe.height,Ue,at,Oe.data):i.texImage2D(s.TEXTURE_2D,be,Je,Oe.width,Oe.height,0,Ue,at,Oe.data);C.generateMipmaps=!1}else W?(we&&i.texStorage2D(s.TEXTURE_2D,Ke,Je,Se.width,Se.height),Ie&&de(C,Se,Ue,at)):i.texImage2D(s.TEXTURE_2D,0,Je,Se.width,Se.height,0,Ue,at,Se.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){W&&we&&i.texStorage3D(s.TEXTURE_2D_ARRAY,Ke,Je,ft[0].width,ft[0].height,Se.depth);for(let be=0,ye=ft.length;be<ye;be++)if(Oe=ft[be],C.format!==qi)if(Ue!==null)if(W){if(Ie)if(C.layerUpdates.size>0){const nt=Ox(Oe.width,Oe.height,C.format,C.type);for(const ht of C.layerUpdates){const qt=Oe.data.subarray(ht*nt/Oe.data.BYTES_PER_ELEMENT,(ht+1)*nt/Oe.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,be,0,0,ht,Oe.width,Oe.height,1,Ue,qt)}C.clearLayerUpdates()}else i.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,be,0,0,0,Oe.width,Oe.height,Se.depth,Ue,Oe.data)}else i.compressedTexImage3D(s.TEXTURE_2D_ARRAY,be,Je,Oe.width,Oe.height,Se.depth,0,Oe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else W?Ie&&i.texSubImage3D(s.TEXTURE_2D_ARRAY,be,0,0,0,Oe.width,Oe.height,Se.depth,Ue,at,Oe.data):i.texImage3D(s.TEXTURE_2D_ARRAY,be,Je,Oe.width,Oe.height,Se.depth,0,Ue,at,Oe.data)}else{W&&we&&i.texStorage2D(s.TEXTURE_2D,Ke,Je,ft[0].width,ft[0].height);for(let be=0,ye=ft.length;be<ye;be++)Oe=ft[be],C.format!==qi?Ue!==null?W?Ie&&i.compressedTexSubImage2D(s.TEXTURE_2D,be,0,0,Oe.width,Oe.height,Ue,Oe.data):i.compressedTexImage2D(s.TEXTURE_2D,be,Je,Oe.width,Oe.height,0,Oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):W?Ie&&i.texSubImage2D(s.TEXTURE_2D,be,0,0,Oe.width,Oe.height,Ue,at,Oe.data):i.texImage2D(s.TEXTURE_2D,be,Je,Oe.width,Oe.height,0,Ue,at,Oe.data)}else if(C.isDataArrayTexture)if(W){if(we&&i.texStorage3D(s.TEXTURE_2D_ARRAY,Ke,Je,Se.width,Se.height,Se.depth),Ie)if(C.layerUpdates.size>0){const be=Ox(Se.width,Se.height,C.format,C.type);for(const ye of C.layerUpdates){const nt=Se.data.subarray(ye*be/Se.data.BYTES_PER_ELEMENT,(ye+1)*be/Se.data.BYTES_PER_ELEMENT);i.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ye,Se.width,Se.height,1,Ue,at,nt)}C.clearLayerUpdates()}else i.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Se.width,Se.height,Se.depth,Ue,at,Se.data)}else i.texImage3D(s.TEXTURE_2D_ARRAY,0,Je,Se.width,Se.height,Se.depth,0,Ue,at,Se.data);else if(C.isData3DTexture)W?(we&&i.texStorage3D(s.TEXTURE_3D,Ke,Je,Se.width,Se.height,Se.depth),Ie&&i.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Se.width,Se.height,Se.depth,Ue,at,Se.data)):i.texImage3D(s.TEXTURE_3D,0,Je,Se.width,Se.height,Se.depth,0,Ue,at,Se.data);else if(C.isFramebufferTexture){if(we)if(W)i.texStorage2D(s.TEXTURE_2D,Ke,Je,Se.width,Se.height);else{let be=Se.width,ye=Se.height;for(let nt=0;nt<Ke;nt++)i.texImage2D(s.TEXTURE_2D,nt,Je,be,ye,0,Ue,at,null),be>>=1,ye>>=1}}else if(ft.length>0){if(W&&we){const be=At(ft[0]);i.texStorage2D(s.TEXTURE_2D,Ke,Je,be.width,be.height)}for(let be=0,ye=ft.length;be<ye;be++)Oe=ft[be],W?Ie&&i.texSubImage2D(s.TEXTURE_2D,be,0,0,Ue,at,Oe):i.texImage2D(s.TEXTURE_2D,be,Je,Ue,at,Oe);C.generateMipmaps=!1}else if(W){if(we){const be=At(Se);i.texStorage2D(s.TEXTURE_2D,Ke,Je,be.width,be.height)}Ie&&i.texSubImage2D(s.TEXTURE_2D,0,0,0,Ue,at,Se)}else i.texImage2D(s.TEXTURE_2D,0,Je,Ue,at,Se);M(C)&&_(pe),Ze.__version=he.version,C.onUpdate&&C.onUpdate(C)}P.__version=C.version}function oe(P,C,se){if(C.image.length!==6)return;const pe=xt(P,C),xe=C.source;i.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+se);const he=o.get(xe);if(xe.version!==he.__version||pe===!0){i.activeTexture(s.TEXTURE0+se);const Ze=Lt.getPrimaries(Lt.workingColorSpace),Ne=C.colorSpace===Ss?null:Lt.getPrimaries(C.colorSpace),De=C.colorSpace===Ss||Ze===Ne?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,C.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,C.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);const Ye=C.isCompressedTexture||C.image[0].isCompressedTexture,Se=C.image[0]&&C.image[0].isDataTexture,Ue=[];for(let ye=0;ye<6;ye++)!Ye&&!Se?Ue[ye]=T(C.image[ye],!0,l.maxCubemapSize):Ue[ye]=Se?C.image[ye].image:C.image[ye],Ue[ye]=it(C,Ue[ye]);const at=Ue[0],Je=u.convert(C.format,C.colorSpace),Oe=u.convert(C.type),ft=z(C.internalFormat,Je,Oe,C.colorSpace),W=C.isVideoTexture!==!0,we=he.__version===void 0||pe===!0,Ie=xe.dataReady;let Ke=V(C,at);$e(s.TEXTURE_CUBE_MAP,C);let be;if(Ye){W&&we&&i.texStorage2D(s.TEXTURE_CUBE_MAP,Ke,ft,at.width,at.height);for(let ye=0;ye<6;ye++){be=Ue[ye].mipmaps;for(let nt=0;nt<be.length;nt++){const ht=be[nt];C.format!==qi?Je!==null?W?Ie&&i.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt,0,0,ht.width,ht.height,Je,ht.data):i.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt,ft,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):W?Ie&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt,0,0,ht.width,ht.height,Je,Oe,ht.data):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt,ft,ht.width,ht.height,0,Je,Oe,ht.data)}}}else{if(be=C.mipmaps,W&&we){be.length>0&&Ke++;const ye=At(Ue[0]);i.texStorage2D(s.TEXTURE_CUBE_MAP,Ke,ft,ye.width,ye.height)}for(let ye=0;ye<6;ye++)if(Se){W?Ie&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,Ue[ye].width,Ue[ye].height,Je,Oe,Ue[ye].data):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,ft,Ue[ye].width,Ue[ye].height,0,Je,Oe,Ue[ye].data);for(let nt=0;nt<be.length;nt++){const qt=be[nt].image[ye].image;W?Ie&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt+1,0,0,qt.width,qt.height,Je,Oe,qt.data):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt+1,ft,qt.width,qt.height,0,Je,Oe,qt.data)}}else{W?Ie&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,Je,Oe,Ue[ye]):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,ft,Je,Oe,Ue[ye]);for(let nt=0;nt<be.length;nt++){const ht=be[nt];W?Ie&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt+1,0,0,Je,Oe,ht.image[ye]):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,nt+1,ft,Je,Oe,ht.image[ye])}}}M(C)&&_(s.TEXTURE_CUBE_MAP),he.__version=xe.version,C.onUpdate&&C.onUpdate(C)}P.__version=C.version}function Ee(P,C,se,pe,xe,he){const Ze=u.convert(se.format,se.colorSpace),Ne=u.convert(se.type),De=z(se.internalFormat,Ze,Ne,se.colorSpace),Ye=o.get(C),Se=o.get(se);if(Se.__renderTarget=C,!Ye.__hasExternalTextures){const Ue=Math.max(1,C.width>>he),at=Math.max(1,C.height>>he);xe===s.TEXTURE_3D||xe===s.TEXTURE_2D_ARRAY?i.texImage3D(xe,he,De,Ue,at,C.depth,0,Ze,Ne,null):i.texImage2D(xe,he,De,Ue,at,0,Ze,Ne,null)}i.bindFramebuffer(s.FRAMEBUFFER,P),ke(C)?p.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,pe,xe,Se.__webglTexture,0,lt(C)):(xe===s.TEXTURE_2D||xe>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&xe<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,pe,xe,Se.__webglTexture,he),i.bindFramebuffer(s.FRAMEBUFFER,null)}function Le(P,C,se){if(s.bindRenderbuffer(s.RENDERBUFFER,P),C.depthBuffer){const pe=C.depthTexture,xe=pe&&pe.isDepthTexture?pe.type:null,he=N(C.stencilBuffer,xe),Ze=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ne=lt(C);ke(C)?p.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ne,he,C.width,C.height):se?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ne,he,C.width,C.height):s.renderbufferStorage(s.RENDERBUFFER,he,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ze,s.RENDERBUFFER,P)}else{const pe=C.textures;for(let xe=0;xe<pe.length;xe++){const he=pe[xe],Ze=u.convert(he.format,he.colorSpace),Ne=u.convert(he.type),De=z(he.internalFormat,Ze,Ne,he.colorSpace),Ye=lt(C);se&&ke(C)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ye,De,C.width,C.height):ke(C)?p.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ye,De,C.width,C.height):s.renderbufferStorage(s.RENDERBUFFER,De,C.width,C.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ae(P,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(i.bindFramebuffer(s.FRAMEBUFFER,P),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const pe=o.get(C.depthTexture);pe.__renderTarget=C,(!pe.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),B(C.depthTexture,0);const xe=pe.__webglTexture,he=lt(C);if(C.depthTexture.format===Bl)ke(C)?p.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,xe,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,xe,0);else if(C.depthTexture.format===Fl)ke(C)?p.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,xe,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,xe,0);else throw new Error("Unknown depthTexture format")}function Te(P){const C=o.get(P),se=P.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==P.depthTexture){const pe=P.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),pe){const xe=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,pe.removeEventListener("dispose",xe)};pe.addEventListener("dispose",xe),C.__depthDisposeCallback=xe}C.__boundDepthTexture=pe}if(P.depthTexture&&!C.__autoAllocateDepthBuffer){if(se)throw new Error("target.depthTexture not supported in Cube render targets");const pe=P.texture.mipmaps;pe&&pe.length>0?Ae(C.__webglFramebuffer[0],P):Ae(C.__webglFramebuffer,P)}else if(se){C.__webglDepthbuffer=[];for(let pe=0;pe<6;pe++)if(i.bindFramebuffer(s.FRAMEBUFFER,C.__webglFramebuffer[pe]),C.__webglDepthbuffer[pe]===void 0)C.__webglDepthbuffer[pe]=s.createRenderbuffer(),Le(C.__webglDepthbuffer[pe],P,!1);else{const xe=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,he=C.__webglDepthbuffer[pe];s.bindRenderbuffer(s.RENDERBUFFER,he),s.framebufferRenderbuffer(s.FRAMEBUFFER,xe,s.RENDERBUFFER,he)}}else{const pe=P.texture.mipmaps;if(pe&&pe.length>0?i.bindFramebuffer(s.FRAMEBUFFER,C.__webglFramebuffer[0]):i.bindFramebuffer(s.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=s.createRenderbuffer(),Le(C.__webglDepthbuffer,P,!1);else{const xe=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,he=C.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,he),s.framebufferRenderbuffer(s.FRAMEBUFFER,xe,s.RENDERBUFFER,he)}}i.bindFramebuffer(s.FRAMEBUFFER,null)}function Xe(P,C,se){const pe=o.get(P);C!==void 0&&Ee(pe.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),se!==void 0&&Te(P)}function D(P){const C=P.texture,se=o.get(P),pe=o.get(C);P.addEventListener("dispose",I);const xe=P.textures,he=P.isWebGLCubeRenderTarget===!0,Ze=xe.length>1;if(Ze||(pe.__webglTexture===void 0&&(pe.__webglTexture=s.createTexture()),pe.__version=C.version,h.memory.textures++),he){se.__webglFramebuffer=[];for(let Ne=0;Ne<6;Ne++)if(C.mipmaps&&C.mipmaps.length>0){se.__webglFramebuffer[Ne]=[];for(let De=0;De<C.mipmaps.length;De++)se.__webglFramebuffer[Ne][De]=s.createFramebuffer()}else se.__webglFramebuffer[Ne]=s.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){se.__webglFramebuffer=[];for(let Ne=0;Ne<C.mipmaps.length;Ne++)se.__webglFramebuffer[Ne]=s.createFramebuffer()}else se.__webglFramebuffer=s.createFramebuffer();if(Ze)for(let Ne=0,De=xe.length;Ne<De;Ne++){const Ye=o.get(xe[Ne]);Ye.__webglTexture===void 0&&(Ye.__webglTexture=s.createTexture(),h.memory.textures++)}if(P.samples>0&&ke(P)===!1){se.__webglMultisampledFramebuffer=s.createFramebuffer(),se.__webglColorRenderbuffer=[],i.bindFramebuffer(s.FRAMEBUFFER,se.__webglMultisampledFramebuffer);for(let Ne=0;Ne<xe.length;Ne++){const De=xe[Ne];se.__webglColorRenderbuffer[Ne]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,se.__webglColorRenderbuffer[Ne]);const Ye=u.convert(De.format,De.colorSpace),Se=u.convert(De.type),Ue=z(De.internalFormat,Ye,Se,De.colorSpace,P.isXRRenderTarget===!0),at=lt(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,at,Ue,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ne,s.RENDERBUFFER,se.__webglColorRenderbuffer[Ne])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(se.__webglDepthRenderbuffer=s.createRenderbuffer(),Le(se.__webglDepthRenderbuffer,P,!0)),i.bindFramebuffer(s.FRAMEBUFFER,null)}}if(he){i.bindTexture(s.TEXTURE_CUBE_MAP,pe.__webglTexture),$e(s.TEXTURE_CUBE_MAP,C);for(let Ne=0;Ne<6;Ne++)if(C.mipmaps&&C.mipmaps.length>0)for(let De=0;De<C.mipmaps.length;De++)Ee(se.__webglFramebuffer[Ne][De],P,C,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Ne,De);else Ee(se.__webglFramebuffer[Ne],P,C,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Ne,0);M(C)&&_(s.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(Ze){for(let Ne=0,De=xe.length;Ne<De;Ne++){const Ye=xe[Ne],Se=o.get(Ye);let Ue=s.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Ue=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),i.bindTexture(Ue,Se.__webglTexture),$e(Ue,Ye),Ee(se.__webglFramebuffer,P,Ye,s.COLOR_ATTACHMENT0+Ne,Ue,0),M(Ye)&&_(Ue)}i.unbindTexture()}else{let Ne=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Ne=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),i.bindTexture(Ne,pe.__webglTexture),$e(Ne,C),C.mipmaps&&C.mipmaps.length>0)for(let De=0;De<C.mipmaps.length;De++)Ee(se.__webglFramebuffer[De],P,C,s.COLOR_ATTACHMENT0,Ne,De);else Ee(se.__webglFramebuffer,P,C,s.COLOR_ATTACHMENT0,Ne,0);M(C)&&_(Ne),i.unbindTexture()}P.depthBuffer&&Te(P)}function Ce(P){const C=P.textures;for(let se=0,pe=C.length;se<pe;se++){const xe=C[se];if(M(xe)){const he=L(P),Ze=o.get(xe).__webglTexture;i.bindTexture(he,Ze),_(he),i.unbindTexture()}}}const Ve=[],Qe=[];function Be(P){if(P.samples>0){if(ke(P)===!1){const C=P.textures,se=P.width,pe=P.height;let xe=s.COLOR_BUFFER_BIT;const he=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ze=o.get(P),Ne=C.length>1;if(Ne)for(let Ye=0;Ye<C.length;Ye++)i.bindFramebuffer(s.FRAMEBUFFER,Ze.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ye,s.RENDERBUFFER,null),i.bindFramebuffer(s.FRAMEBUFFER,Ze.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ye,s.TEXTURE_2D,null,0);i.bindFramebuffer(s.READ_FRAMEBUFFER,Ze.__webglMultisampledFramebuffer);const De=P.texture.mipmaps;De&&De.length>0?i.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ze.__webglFramebuffer[0]):i.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ze.__webglFramebuffer);for(let Ye=0;Ye<C.length;Ye++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(xe|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(xe|=s.STENCIL_BUFFER_BIT)),Ne){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ze.__webglColorRenderbuffer[Ye]);const Se=o.get(C[Ye]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Se,0)}s.blitFramebuffer(0,0,se,pe,0,0,se,pe,xe,s.NEAREST),m===!0&&(Ve.length=0,Qe.length=0,Ve.push(s.COLOR_ATTACHMENT0+Ye),P.depthBuffer&&P.resolveDepthBuffer===!1&&(Ve.push(he),Qe.push(he),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Qe)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Ve))}if(i.bindFramebuffer(s.READ_FRAMEBUFFER,null),i.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Ne)for(let Ye=0;Ye<C.length;Ye++){i.bindFramebuffer(s.FRAMEBUFFER,Ze.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ye,s.RENDERBUFFER,Ze.__webglColorRenderbuffer[Ye]);const Se=o.get(C[Ye]).__webglTexture;i.bindFramebuffer(s.FRAMEBUFFER,Ze.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ye,s.TEXTURE_2D,Se,0)}i.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ze.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&m){const C=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[C])}}}function lt(P){return Math.min(l.maxSamples,P.samples)}function ke(P){const C=o.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function Me(P){const C=h.render.frame;x.get(P)!==C&&(x.set(P,C),P.update())}function it(P,C){const se=P.colorSpace,pe=P.format,xe=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||se!==Ao&&se!==Ss&&(Lt.getTransfer(se)===Xt?(pe!==qi||xe!==fa)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",se)),C}function At(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(g.width=P.naturalWidth||P.width,g.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(g.width=P.displayWidth,g.height=P.displayHeight):(g.width=P.width,g.height=P.height),g}this.allocateTextureUnit=ue,this.resetTextureUnits=ie,this.setTexture2D=B,this.setTexture2DArray=O,this.setTexture3D=k,this.setTextureCube=X,this.rebindTextures=Xe,this.setupRenderTarget=D,this.updateRenderTargetMipmap=Ce,this.updateMultisampleRenderTarget=Be,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=Ee,this.useMultisampledRTT=ke}function AR(s,t){function i(o,l=Ss){let u;const h=Lt.getTransfer(l);if(o===fa)return s.UNSIGNED_BYTE;if(o===Cm)return s.UNSIGNED_SHORT_4_4_4_4;if(o===Rm)return s.UNSIGNED_SHORT_5_5_5_1;if(o===Uy)return s.UNSIGNED_INT_5_9_9_9_REV;if(o===Ly)return s.UNSIGNED_INT_10F_11F_11F_REV;if(o===Ny)return s.BYTE;if(o===Dy)return s.SHORT;if(o===Pl)return s.UNSIGNED_SHORT;if(o===Am)return s.INT;if(o===hr)return s.UNSIGNED_INT;if(o===za)return s.FLOAT;if(o===Ia)return s.HALF_FLOAT;if(o===Oy)return s.ALPHA;if(o===zy)return s.RGB;if(o===qi)return s.RGBA;if(o===Bl)return s.DEPTH_COMPONENT;if(o===Fl)return s.DEPTH_STENCIL;if(o===Py)return s.RED;if(o===wm)return s.RED_INTEGER;if(o===Iy)return s.RG;if(o===Nm)return s.RG_INTEGER;if(o===Dm)return s.RGBA_INTEGER;if(o===ku||o===Xu||o===qu||o===Yu)if(h===Xt)if(u=t.get("WEBGL_compressed_texture_s3tc_srgb"),u!==null){if(o===ku)return u.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===Xu)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===qu)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===Yu)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(u=t.get("WEBGL_compressed_texture_s3tc"),u!==null){if(o===ku)return u.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===Xu)return u.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===qu)return u.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===Yu)return u.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===jp||o===Gp||o===Vp||o===kp)if(u=t.get("WEBGL_compressed_texture_pvrtc"),u!==null){if(o===jp)return u.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===Gp)return u.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===Vp)return u.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===kp)return u.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===Xp||o===qp||o===Yp)if(u=t.get("WEBGL_compressed_texture_etc"),u!==null){if(o===Xp||o===qp)return h===Xt?u.COMPRESSED_SRGB8_ETC2:u.COMPRESSED_RGB8_ETC2;if(o===Yp)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:u.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===Wp||o===Zp||o===Kp||o===Qp||o===Jp||o===$p||o===em||o===tm||o===nm||o===im||o===am||o===sm||o===rm||o===om)if(u=t.get("WEBGL_compressed_texture_astc"),u!==null){if(o===Wp)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:u.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===Zp)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:u.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===Kp)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:u.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===Qp)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:u.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===Jp)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:u.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===$p)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:u.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===em)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:u.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===tm)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:u.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===nm)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:u.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===im)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:u.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===am)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:u.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===sm)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:u.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===rm)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:u.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===om)return h===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:u.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===lm||o===cm||o===um)if(u=t.get("EXT_texture_compression_bptc"),u!==null){if(o===lm)return h===Xt?u.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:u.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===cm)return u.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===um)return u.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===fm||o===dm||o===hm||o===pm)if(u=t.get("EXT_texture_compression_rgtc"),u!==null){if(o===fm)return u.COMPRESSED_RED_RGTC1_EXT;if(o===dm)return u.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===hm)return u.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===pm)return u.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===Il?s.UNSIGNED_INT_24_8:s[o]!==void 0?s[o]:null}return{convert:i}}const CR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,RR=`
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

}`;class wR{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,i){if(this.texture===null){const o=new Jy(t.texture);(t.depthNear!==i.depthNear||t.depthFar!==i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=o}}getMesh(t){if(this.texture!==null&&this.mesh===null){const i=t.cameras[0].viewport,o=new Yn({vertexShader:CR,fragmentShader:RR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new gi(new Yl(20,20),o)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class NR extends wo{constructor(t,i){super();const o=this;let l=null,u=1,h=null,p="local-floor",m=1,g=null,x=null,v=null,S=null,E=null,b=null;const T=typeof XRWebGLBinding<"u",M=new wR,_={},L=i.getContextAttributes();let z=null,N=null;const V=[],H=[],I=new pt;let Y=null;const U=new Ni;U.viewport=new Wt;const R=new Ni;R.viewport=new Wt;const G=[U,R],ie=new QT;let ue=null,Z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let oe=V[$];return oe===void 0&&(oe=new fp,V[$]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function($){let oe=V[$];return oe===void 0&&(oe=new fp,V[$]=oe),oe.getGripSpace()},this.getHand=function($){let oe=V[$];return oe===void 0&&(oe=new fp,V[$]=oe),oe.getHandSpace()};function B($){const oe=H.indexOf($.inputSource);if(oe===-1)return;const Ee=V[oe];Ee!==void 0&&(Ee.update($.inputSource,$.frame,g||h),Ee.dispatchEvent({type:$.type,data:$.inputSource}))}function O(){l.removeEventListener("select",B),l.removeEventListener("selectstart",B),l.removeEventListener("selectend",B),l.removeEventListener("squeeze",B),l.removeEventListener("squeezestart",B),l.removeEventListener("squeezeend",B),l.removeEventListener("end",O),l.removeEventListener("inputsourceschange",k);for(let $=0;$<V.length;$++){const oe=H[$];oe!==null&&(H[$]=null,V[$].disconnect(oe))}ue=null,Z=null,M.reset();for(const $ in _)delete _[$];t.setRenderTarget(z),E=null,S=null,v=null,l=null,N=null,de.stop(),o.isPresenting=!1,t.setPixelRatio(Y),t.setSize(I.width,I.height,!1),o.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){u=$,o.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){p=$,o.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return g||h},this.setReferenceSpace=function($){g=$},this.getBaseLayer=function(){return S!==null?S:E},this.getBinding=function(){return v===null&&T&&(v=new XRWebGLBinding(l,i)),v},this.getFrame=function(){return b},this.getSession=function(){return l},this.setSession=async function($){if(l=$,l!==null){if(z=t.getRenderTarget(),l.addEventListener("select",B),l.addEventListener("selectstart",B),l.addEventListener("selectend",B),l.addEventListener("squeeze",B),l.addEventListener("squeezestart",B),l.addEventListener("squeezeend",B),l.addEventListener("end",O),l.addEventListener("inputsourceschange",k),L.xrCompatible!==!0&&await i.makeXRCompatible(),Y=t.getPixelRatio(),t.getSize(I),T&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ee=null,Le=null,Ae=null;L.depth&&(Ae=L.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,Ee=L.stencil?Fl:Bl,Le=L.stencil?Il:hr);const Te={colorFormat:i.RGBA8,depthFormat:Ae,scaleFactor:u};v=this.getBinding(),S=v.createProjectionLayer(Te),l.updateRenderState({layers:[S]}),t.setPixelRatio(1),t.setSize(S.textureWidth,S.textureHeight,!1),N=new Yi(S.textureWidth,S.textureHeight,{format:qi,type:fa,depthTexture:new Qy(S.textureWidth,S.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,Ee),stencilBuffer:L.stencil,colorSpace:t.outputColorSpace,samples:L.antialias?4:0,resolveDepthBuffer:S.ignoreDepthValues===!1,resolveStencilBuffer:S.ignoreDepthValues===!1})}else{const Ee={antialias:L.antialias,alpha:!0,depth:L.depth,stencil:L.stencil,framebufferScaleFactor:u};E=new XRWebGLLayer(l,i,Ee),l.updateRenderState({baseLayer:E}),t.setPixelRatio(1),t.setSize(E.framebufferWidth,E.framebufferHeight,!1),N=new Yi(E.framebufferWidth,E.framebufferHeight,{format:qi,type:fa,colorSpace:t.outputColorSpace,stencilBuffer:L.stencil,resolveDepthBuffer:E.ignoreDepthValues===!1,resolveStencilBuffer:E.ignoreDepthValues===!1})}N.isXRRenderTarget=!0,this.setFoveation(m),g=null,h=await l.requestReferenceSpace(p),de.setContext(l),de.start(),o.isPresenting=!0,o.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return M.getDepthTexture()};function k($){for(let oe=0;oe<$.removed.length;oe++){const Ee=$.removed[oe],Le=H.indexOf(Ee);Le>=0&&(H[Le]=null,V[Le].disconnect(Ee))}for(let oe=0;oe<$.added.length;oe++){const Ee=$.added[oe];let Le=H.indexOf(Ee);if(Le===-1){for(let Te=0;Te<V.length;Te++)if(Te>=H.length){H.push(Ee),Le=Te;break}else if(H[Te]===null){H[Te]=Ee,Le=Te;break}if(Le===-1)break}const Ae=V[Le];Ae&&Ae.connect(Ee)}}const X=new ae,ve=new ae;function _e($,oe,Ee){X.setFromMatrixPosition(oe.matrixWorld),ve.setFromMatrixPosition(Ee.matrixWorld);const Le=X.distanceTo(ve),Ae=oe.projectionMatrix.elements,Te=Ee.projectionMatrix.elements,Xe=Ae[14]/(Ae[10]-1),D=Ae[14]/(Ae[10]+1),Ce=(Ae[9]+1)/Ae[5],Ve=(Ae[9]-1)/Ae[5],Qe=(Ae[8]-1)/Ae[0],Be=(Te[8]+1)/Te[0],lt=Xe*Qe,ke=Xe*Be,Me=Le/(-Qe+Be),it=Me*-Qe;if(oe.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(it),$.translateZ(Me),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Ae[10]===-1)$.projectionMatrix.copy(oe.projectionMatrix),$.projectionMatrixInverse.copy(oe.projectionMatrixInverse);else{const At=Xe+Me,P=D+Me,C=lt-it,se=ke+(Le-it),pe=Ce*D/P*At,xe=Ve*D/P*At;$.projectionMatrix.makePerspective(C,se,pe,xe,At,P),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function He($,oe){oe===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(oe.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(l===null)return;let oe=$.near,Ee=$.far;M.texture!==null&&(M.depthNear>0&&(oe=M.depthNear),M.depthFar>0&&(Ee=M.depthFar)),ie.near=R.near=U.near=oe,ie.far=R.far=U.far=Ee,(ue!==ie.near||Z!==ie.far)&&(l.updateRenderState({depthNear:ie.near,depthFar:ie.far}),ue=ie.near,Z=ie.far),ie.layers.mask=$.layers.mask|6,U.layers.mask=ie.layers.mask&3,R.layers.mask=ie.layers.mask&5;const Le=$.parent,Ae=ie.cameras;He(ie,Le);for(let Te=0;Te<Ae.length;Te++)He(Ae[Te],Le);Ae.length===2?_e(ie,U,R):ie.projectionMatrix.copy(U.projectionMatrix),$e($,ie,Le)};function $e($,oe,Ee){Ee===null?$.matrix.copy(oe.matrixWorld):($.matrix.copy(Ee.matrixWorld),$.matrix.invert(),$.matrix.multiply(oe.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(oe.projectionMatrix),$.projectionMatrixInverse.copy(oe.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=mm*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return ie},this.getFoveation=function(){if(!(S===null&&E===null))return m},this.setFoveation=function($){m=$,S!==null&&(S.fixedFoveation=$),E!==null&&E.fixedFoveation!==void 0&&(E.fixedFoveation=$)},this.hasDepthSensing=function(){return M.texture!==null},this.getDepthSensingMesh=function(){return M.getMesh(ie)},this.getCameraTexture=function($){return _[$]};let xt=null;function j($,oe){if(x=oe.getViewerPose(g||h),b=oe,x!==null){const Ee=x.views;E!==null&&(t.setRenderTargetFramebuffer(N,E.framebuffer),t.setRenderTarget(N));let Le=!1;Ee.length!==ie.cameras.length&&(ie.cameras.length=0,Le=!0);for(let D=0;D<Ee.length;D++){const Ce=Ee[D];let Ve=null;if(E!==null)Ve=E.getViewport(Ce);else{const Be=v.getViewSubImage(S,Ce);Ve=Be.viewport,D===0&&(t.setRenderTargetTextures(N,Be.colorTexture,Be.depthStencilTexture),t.setRenderTarget(N))}let Qe=G[D];Qe===void 0&&(Qe=new Ni,Qe.layers.enable(D),Qe.viewport=new Wt,G[D]=Qe),Qe.matrix.fromArray(Ce.transform.matrix),Qe.matrix.decompose(Qe.position,Qe.quaternion,Qe.scale),Qe.projectionMatrix.fromArray(Ce.projectionMatrix),Qe.projectionMatrixInverse.copy(Qe.projectionMatrix).invert(),Qe.viewport.set(Ve.x,Ve.y,Ve.width,Ve.height),D===0&&(ie.matrix.copy(Qe.matrix),ie.matrix.decompose(ie.position,ie.quaternion,ie.scale)),Le===!0&&ie.cameras.push(Qe)}const Ae=l.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&T){v=o.getBinding();const D=v.getDepthInformation(Ee[0]);D&&D.isValid&&D.texture&&M.init(D,l.renderState)}if(Ae&&Ae.includes("camera-access")&&T){t.state.unbindTexture(),v=o.getBinding();for(let D=0;D<Ee.length;D++){const Ce=Ee[D].camera;if(Ce){let Ve=_[Ce];Ve||(Ve=new Jy,_[Ce]=Ve);const Qe=v.getCameraImage(Ce);Ve.sourceTexture=Qe}}}}for(let Ee=0;Ee<V.length;Ee++){const Le=H[Ee],Ae=V[Ee];Le!==null&&Ae!==void 0&&Ae.update(Le,oe,g||h)}xt&&xt($,oe),oe.detectedPlanes&&o.dispatchEvent({type:"planesdetected",data:oe}),b=null}const de=new tS;de.setAnimationLoop(j),this.setAnimationLoop=function($){xt=$},this.dispose=function(){}}}const ar=new da,DR=new sn;function UR(s,t){function i(M,_){M.matrixAutoUpdate===!0&&M.updateMatrix(),_.value.copy(M.matrix)}function o(M,_){_.color.getRGB(M.fogColor.value,Yy(s)),_.isFog?(M.fogNear.value=_.near,M.fogFar.value=_.far):_.isFogExp2&&(M.fogDensity.value=_.density)}function l(M,_,L,z,N){_.isMeshBasicMaterial||_.isMeshLambertMaterial?u(M,_):_.isMeshToonMaterial?(u(M,_),v(M,_)):_.isMeshPhongMaterial?(u(M,_),x(M,_)):_.isMeshStandardMaterial?(u(M,_),S(M,_),_.isMeshPhysicalMaterial&&E(M,_,N)):_.isMeshMatcapMaterial?(u(M,_),b(M,_)):_.isMeshDepthMaterial?u(M,_):_.isMeshDistanceMaterial?(u(M,_),T(M,_)):_.isMeshNormalMaterial?u(M,_):_.isLineBasicMaterial?(h(M,_),_.isLineDashedMaterial&&p(M,_)):_.isPointsMaterial?m(M,_,L,z):_.isSpriteMaterial?g(M,_):_.isShadowMaterial?(M.color.value.copy(_.color),M.opacity.value=_.opacity):_.isShaderMaterial&&(_.uniformsNeedUpdate=!1)}function u(M,_){M.opacity.value=_.opacity,_.color&&M.diffuse.value.copy(_.color),_.emissive&&M.emissive.value.copy(_.emissive).multiplyScalar(_.emissiveIntensity),_.map&&(M.map.value=_.map,i(_.map,M.mapTransform)),_.alphaMap&&(M.alphaMap.value=_.alphaMap,i(_.alphaMap,M.alphaMapTransform)),_.bumpMap&&(M.bumpMap.value=_.bumpMap,i(_.bumpMap,M.bumpMapTransform),M.bumpScale.value=_.bumpScale,_.side===ii&&(M.bumpScale.value*=-1)),_.normalMap&&(M.normalMap.value=_.normalMap,i(_.normalMap,M.normalMapTransform),M.normalScale.value.copy(_.normalScale),_.side===ii&&M.normalScale.value.negate()),_.displacementMap&&(M.displacementMap.value=_.displacementMap,i(_.displacementMap,M.displacementMapTransform),M.displacementScale.value=_.displacementScale,M.displacementBias.value=_.displacementBias),_.emissiveMap&&(M.emissiveMap.value=_.emissiveMap,i(_.emissiveMap,M.emissiveMapTransform)),_.specularMap&&(M.specularMap.value=_.specularMap,i(_.specularMap,M.specularMapTransform)),_.alphaTest>0&&(M.alphaTest.value=_.alphaTest);const L=t.get(_),z=L.envMap,N=L.envMapRotation;z&&(M.envMap.value=z,ar.copy(N),ar.x*=-1,ar.y*=-1,ar.z*=-1,z.isCubeTexture&&z.isRenderTargetTexture===!1&&(ar.y*=-1,ar.z*=-1),M.envMapRotation.value.setFromMatrix4(DR.makeRotationFromEuler(ar)),M.flipEnvMap.value=z.isCubeTexture&&z.isRenderTargetTexture===!1?-1:1,M.reflectivity.value=_.reflectivity,M.ior.value=_.ior,M.refractionRatio.value=_.refractionRatio),_.lightMap&&(M.lightMap.value=_.lightMap,M.lightMapIntensity.value=_.lightMapIntensity,i(_.lightMap,M.lightMapTransform)),_.aoMap&&(M.aoMap.value=_.aoMap,M.aoMapIntensity.value=_.aoMapIntensity,i(_.aoMap,M.aoMapTransform))}function h(M,_){M.diffuse.value.copy(_.color),M.opacity.value=_.opacity,_.map&&(M.map.value=_.map,i(_.map,M.mapTransform))}function p(M,_){M.dashSize.value=_.dashSize,M.totalSize.value=_.dashSize+_.gapSize,M.scale.value=_.scale}function m(M,_,L,z){M.diffuse.value.copy(_.color),M.opacity.value=_.opacity,M.size.value=_.size*L,M.scale.value=z*.5,_.map&&(M.map.value=_.map,i(_.map,M.uvTransform)),_.alphaMap&&(M.alphaMap.value=_.alphaMap,i(_.alphaMap,M.alphaMapTransform)),_.alphaTest>0&&(M.alphaTest.value=_.alphaTest)}function g(M,_){M.diffuse.value.copy(_.color),M.opacity.value=_.opacity,M.rotation.value=_.rotation,_.map&&(M.map.value=_.map,i(_.map,M.mapTransform)),_.alphaMap&&(M.alphaMap.value=_.alphaMap,i(_.alphaMap,M.alphaMapTransform)),_.alphaTest>0&&(M.alphaTest.value=_.alphaTest)}function x(M,_){M.specular.value.copy(_.specular),M.shininess.value=Math.max(_.shininess,1e-4)}function v(M,_){_.gradientMap&&(M.gradientMap.value=_.gradientMap)}function S(M,_){M.metalness.value=_.metalness,_.metalnessMap&&(M.metalnessMap.value=_.metalnessMap,i(_.metalnessMap,M.metalnessMapTransform)),M.roughness.value=_.roughness,_.roughnessMap&&(M.roughnessMap.value=_.roughnessMap,i(_.roughnessMap,M.roughnessMapTransform)),_.envMap&&(M.envMapIntensity.value=_.envMapIntensity)}function E(M,_,L){M.ior.value=_.ior,_.sheen>0&&(M.sheenColor.value.copy(_.sheenColor).multiplyScalar(_.sheen),M.sheenRoughness.value=_.sheenRoughness,_.sheenColorMap&&(M.sheenColorMap.value=_.sheenColorMap,i(_.sheenColorMap,M.sheenColorMapTransform)),_.sheenRoughnessMap&&(M.sheenRoughnessMap.value=_.sheenRoughnessMap,i(_.sheenRoughnessMap,M.sheenRoughnessMapTransform))),_.clearcoat>0&&(M.clearcoat.value=_.clearcoat,M.clearcoatRoughness.value=_.clearcoatRoughness,_.clearcoatMap&&(M.clearcoatMap.value=_.clearcoatMap,i(_.clearcoatMap,M.clearcoatMapTransform)),_.clearcoatRoughnessMap&&(M.clearcoatRoughnessMap.value=_.clearcoatRoughnessMap,i(_.clearcoatRoughnessMap,M.clearcoatRoughnessMapTransform)),_.clearcoatNormalMap&&(M.clearcoatNormalMap.value=_.clearcoatNormalMap,i(_.clearcoatNormalMap,M.clearcoatNormalMapTransform),M.clearcoatNormalScale.value.copy(_.clearcoatNormalScale),_.side===ii&&M.clearcoatNormalScale.value.negate())),_.dispersion>0&&(M.dispersion.value=_.dispersion),_.iridescence>0&&(M.iridescence.value=_.iridescence,M.iridescenceIOR.value=_.iridescenceIOR,M.iridescenceThicknessMinimum.value=_.iridescenceThicknessRange[0],M.iridescenceThicknessMaximum.value=_.iridescenceThicknessRange[1],_.iridescenceMap&&(M.iridescenceMap.value=_.iridescenceMap,i(_.iridescenceMap,M.iridescenceMapTransform)),_.iridescenceThicknessMap&&(M.iridescenceThicknessMap.value=_.iridescenceThicknessMap,i(_.iridescenceThicknessMap,M.iridescenceThicknessMapTransform))),_.transmission>0&&(M.transmission.value=_.transmission,M.transmissionSamplerMap.value=L.texture,M.transmissionSamplerSize.value.set(L.width,L.height),_.transmissionMap&&(M.transmissionMap.value=_.transmissionMap,i(_.transmissionMap,M.transmissionMapTransform)),M.thickness.value=_.thickness,_.thicknessMap&&(M.thicknessMap.value=_.thicknessMap,i(_.thicknessMap,M.thicknessMapTransform)),M.attenuationDistance.value=_.attenuationDistance,M.attenuationColor.value.copy(_.attenuationColor)),_.anisotropy>0&&(M.anisotropyVector.value.set(_.anisotropy*Math.cos(_.anisotropyRotation),_.anisotropy*Math.sin(_.anisotropyRotation)),_.anisotropyMap&&(M.anisotropyMap.value=_.anisotropyMap,i(_.anisotropyMap,M.anisotropyMapTransform))),M.specularIntensity.value=_.specularIntensity,M.specularColor.value.copy(_.specularColor),_.specularColorMap&&(M.specularColorMap.value=_.specularColorMap,i(_.specularColorMap,M.specularColorMapTransform)),_.specularIntensityMap&&(M.specularIntensityMap.value=_.specularIntensityMap,i(_.specularIntensityMap,M.specularIntensityMapTransform))}function b(M,_){_.matcap&&(M.matcap.value=_.matcap)}function T(M,_){const L=t.get(_).light;M.referencePosition.value.setFromMatrixPosition(L.matrixWorld),M.nearDistance.value=L.shadow.camera.near,M.farDistance.value=L.shadow.camera.far}return{refreshFogUniforms:o,refreshMaterialUniforms:l}}function LR(s,t,i,o){let l={},u={},h=[];const p=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function m(L,z){const N=z.program;o.uniformBlockBinding(L,N)}function g(L,z){let N=l[L.id];N===void 0&&(b(L),N=x(L),l[L.id]=N,L.addEventListener("dispose",M));const V=z.program;o.updateUBOMapping(L,V);const H=t.render.frame;u[L.id]!==H&&(S(L),u[L.id]=H)}function x(L){const z=v();L.__bindingPointIndex=z;const N=s.createBuffer(),V=L.__size,H=L.usage;return s.bindBuffer(s.UNIFORM_BUFFER,N),s.bufferData(s.UNIFORM_BUFFER,V,H),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,z,N),N}function v(){for(let L=0;L<p;L++)if(h.indexOf(L)===-1)return h.push(L),L;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function S(L){const z=l[L.id],N=L.uniforms,V=L.__cache;s.bindBuffer(s.UNIFORM_BUFFER,z);for(let H=0,I=N.length;H<I;H++){const Y=Array.isArray(N[H])?N[H]:[N[H]];for(let U=0,R=Y.length;U<R;U++){const G=Y[U];if(E(G,H,U,V)===!0){const ie=G.__offset,ue=Array.isArray(G.value)?G.value:[G.value];let Z=0;for(let B=0;B<ue.length;B++){const O=ue[B],k=T(O);typeof O=="number"||typeof O=="boolean"?(G.__data[0]=O,s.bufferSubData(s.UNIFORM_BUFFER,ie+Z,G.__data)):O.isMatrix3?(G.__data[0]=O.elements[0],G.__data[1]=O.elements[1],G.__data[2]=O.elements[2],G.__data[3]=0,G.__data[4]=O.elements[3],G.__data[5]=O.elements[4],G.__data[6]=O.elements[5],G.__data[7]=0,G.__data[8]=O.elements[6],G.__data[9]=O.elements[7],G.__data[10]=O.elements[8],G.__data[11]=0):(O.toArray(G.__data,Z),Z+=k.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,ie,G.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function E(L,z,N,V){const H=L.value,I=z+"_"+N;if(V[I]===void 0)return typeof H=="number"||typeof H=="boolean"?V[I]=H:V[I]=H.clone(),!0;{const Y=V[I];if(typeof H=="number"||typeof H=="boolean"){if(Y!==H)return V[I]=H,!0}else if(Y.equals(H)===!1)return Y.copy(H),!0}return!1}function b(L){const z=L.uniforms;let N=0;const V=16;for(let I=0,Y=z.length;I<Y;I++){const U=Array.isArray(z[I])?z[I]:[z[I]];for(let R=0,G=U.length;R<G;R++){const ie=U[R],ue=Array.isArray(ie.value)?ie.value:[ie.value];for(let Z=0,B=ue.length;Z<B;Z++){const O=ue[Z],k=T(O),X=N%V,ve=X%k.boundary,_e=X+ve;N+=ve,_e!==0&&V-_e<k.storage&&(N+=V-_e),ie.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),ie.__offset=N,N+=k.storage}}}const H=N%V;return H>0&&(N+=V-H),L.__size=N,L.__cache={},this}function T(L){const z={boundary:0,storage:0};return typeof L=="number"||typeof L=="boolean"?(z.boundary=4,z.storage=4):L.isVector2?(z.boundary=8,z.storage=8):L.isVector3||L.isColor?(z.boundary=16,z.storage=12):L.isVector4?(z.boundary=16,z.storage=16):L.isMatrix3?(z.boundary=48,z.storage=48):L.isMatrix4?(z.boundary=64,z.storage=64):L.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",L),z}function M(L){const z=L.target;z.removeEventListener("dispose",M);const N=h.indexOf(z.__bindingPointIndex);h.splice(N,1),s.deleteBuffer(l[z.id]),delete l[z.id],delete u[z.id]}function _(){for(const L in l)s.deleteBuffer(l[L]);h=[],l={},u={}}return{bind:m,update:g,dispose:_}}class OR{constructor(t={}){const{canvas:i=cT(),context:o=null,depth:l=!0,stencil:u=!1,alpha:h=!1,antialias:p=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:g=!1,powerPreference:x="default",failIfMajorPerformanceCaveat:v=!1,reversedDepthBuffer:S=!1}=t;this.isWebGLRenderer=!0;let E;if(o!==null){if(typeof WebGLRenderingContext<"u"&&o instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");E=o.getContextAttributes().alpha}else E=h;const b=new Uint32Array(4),T=new Int32Array(4);let M=null,_=null;const L=[],z=[];this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Es,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const N=this;let V=!1;this._outputColorSpace=ti;let H=0,I=0,Y=null,U=-1,R=null;const G=new Wt,ie=new Wt;let ue=null;const Z=new Nt(0);let B=0,O=i.width,k=i.height,X=1,ve=null,_e=null;const He=new Wt(0,0,O,k),$e=new Wt(0,0,O,k);let xt=!1;const j=new Lm;let de=!1,$=!1;const oe=new sn,Ee=new ae,Le=new Wt,Ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Te=!1;function Xe(){return Y===null?X:1}let D=o;function Ce(w,ee){return i.getContext(w,ee)}try{const w={alpha:!0,depth:l,stencil:u,antialias:p,premultipliedAlpha:m,preserveDrawingBuffer:g,powerPreference:x,failIfMajorPerformanceCaveat:v};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${Tm}`),i.addEventListener("webglcontextlost",Ie,!1),i.addEventListener("webglcontextrestored",Ke,!1),i.addEventListener("webglcontextcreationerror",be,!1),D===null){const ee="webgl2";if(D=Ce(ee,w),D===null)throw Ce(ee)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Ve,Qe,Be,lt,ke,Me,it,At,P,C,se,pe,xe,he,Ze,Ne,De,Ye,Se,Ue,at,Je,Oe,ft;function W(){Ve=new k2(D),Ve.init(),Je=new AR(D,Ve),Qe=new I2(D,Ve,t,Je),Be=new TR(D,Ve),Qe.reversedDepthBuffer&&S&&Be.buffers.depth.setReversed(!0),lt=new Y2(D),ke=new fR,Me=new bR(D,Ve,Be,ke,Qe,Je,lt),it=new F2(N),At=new V2(N),P=new $T(D),Oe=new z2(D,P),C=new X2(D,P,lt,Oe),se=new Z2(D,C,P,lt),Se=new W2(D,Qe,Me),Ne=new B2(ke),pe=new uR(N,it,At,Ve,Qe,Oe,Ne),xe=new UR(N,ke),he=new hR,Ze=new xR(Ve),Ye=new O2(N,it,At,Be,se,E,m),De=new MR(N,se,Qe),ft=new LR(D,lt,Qe,Be),Ue=new P2(D,Ve,lt),at=new q2(D,Ve,lt),lt.programs=pe.programs,N.capabilities=Qe,N.extensions=Ve,N.properties=ke,N.renderLists=he,N.shadowMap=De,N.state=Be,N.info=lt}W();const we=new NR(N,D);this.xr=we,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const w=Ve.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Ve.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(w){w!==void 0&&(X=w,this.setSize(O,k,!1))},this.getSize=function(w){return w.set(O,k)},this.setSize=function(w,ee,ce=!0){if(we.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=w,k=ee,i.width=Math.floor(w*X),i.height=Math.floor(ee*X),ce===!0&&(i.style.width=w+"px",i.style.height=ee+"px"),this.setViewport(0,0,w,ee)},this.getDrawingBufferSize=function(w){return w.set(O*X,k*X).floor()},this.setDrawingBufferSize=function(w,ee,ce){O=w,k=ee,X=ce,i.width=Math.floor(w*ce),i.height=Math.floor(ee*ce),this.setViewport(0,0,w,ee)},this.getCurrentViewport=function(w){return w.copy(G)},this.getViewport=function(w){return w.copy(He)},this.setViewport=function(w,ee,ce,fe){w.isVector4?He.set(w.x,w.y,w.z,w.w):He.set(w,ee,ce,fe),Be.viewport(G.copy(He).multiplyScalar(X).round())},this.getScissor=function(w){return w.copy($e)},this.setScissor=function(w,ee,ce,fe){w.isVector4?$e.set(w.x,w.y,w.z,w.w):$e.set(w,ee,ce,fe),Be.scissor(ie.copy($e).multiplyScalar(X).round())},this.getScissorTest=function(){return xt},this.setScissorTest=function(w){Be.setScissorTest(xt=w)},this.setOpaqueSort=function(w){ve=w},this.setTransparentSort=function(w){_e=w},this.getClearColor=function(w){return w.copy(Ye.getClearColor())},this.setClearColor=function(){Ye.setClearColor(...arguments)},this.getClearAlpha=function(){return Ye.getClearAlpha()},this.setClearAlpha=function(){Ye.setClearAlpha(...arguments)},this.clear=function(w=!0,ee=!0,ce=!0){let fe=0;if(w){let te=!1;if(Y!==null){const Re=Y.texture.format;te=Re===Dm||Re===Nm||Re===wm}if(te){const Re=Y.texture.type,je=Re===fa||Re===hr||Re===Pl||Re===Il||Re===Cm||Re===Rm,qe=Ye.getClearColor(),Pe=Ye.getClearAlpha(),et=qe.r,ct=qe.g,rt=qe.b;je?(b[0]=et,b[1]=ct,b[2]=rt,b[3]=Pe,D.clearBufferuiv(D.COLOR,0,b)):(T[0]=et,T[1]=ct,T[2]=rt,T[3]=Pe,D.clearBufferiv(D.COLOR,0,T))}else fe|=D.COLOR_BUFFER_BIT}ee&&(fe|=D.DEPTH_BUFFER_BIT),ce&&(fe|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(fe)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",Ie,!1),i.removeEventListener("webglcontextrestored",Ke,!1),i.removeEventListener("webglcontextcreationerror",be,!1),Ye.dispose(),he.dispose(),Ze.dispose(),ke.dispose(),it.dispose(),At.dispose(),se.dispose(),Oe.dispose(),ft.dispose(),pe.dispose(),we.dispose(),we.removeEventListener("sessionstart",_n),we.removeEventListener("sessionend",zn),ha.stop()};function Ie(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),V=!0}function Ke(){console.log("THREE.WebGLRenderer: Context Restored."),V=!1;const w=lt.autoReset,ee=De.enabled,ce=De.autoUpdate,fe=De.needsUpdate,te=De.type;W(),lt.autoReset=w,De.enabled=ee,De.autoUpdate=ce,De.needsUpdate=fe,De.type=te}function be(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function ye(w){const ee=w.target;ee.removeEventListener("dispose",ye),nt(ee)}function nt(w){ht(w),ke.remove(w)}function ht(w){const ee=ke.get(w).programs;ee!==void 0&&(ee.forEach(function(ce){pe.releaseProgram(ce)}),w.isShaderMaterial&&pe.releaseShaderCache(w))}this.renderBufferDirect=function(w,ee,ce,fe,te,Re){ee===null&&(ee=Ae);const je=te.isMesh&&te.matrixWorld.determinant()<0,qe=Zl(w,ee,ce,fe,te);Be.setMaterial(fe,je);let Pe=ce.index,et=1;if(fe.wireframe===!0){if(Pe=C.getWireframeAttribute(ce),Pe===void 0)return;et=2}const ct=ce.drawRange,rt=ce.attributes.position;let Et=ct.start*et,Ht=(ct.start+ct.count)*et;Re!==null&&(Et=Math.max(Et,Re.start*et),Ht=Math.min(Ht,(Re.start+Re.count)*et)),Pe!==null?(Et=Math.max(Et,0),Ht=Math.min(Ht,Pe.count)):rt!=null&&(Et=Math.max(Et,0),Ht=Math.min(Ht,rt.count));const en=Ht-Et;if(en<0||en===1/0)return;Oe.setup(te,fe,qe,ce,Pe);let It,Ot=Ue;if(Pe!==null&&(It=P.get(Pe),Ot=at,Ot.setIndex(It)),te.isMesh)fe.wireframe===!0?(Be.setLineWidth(fe.wireframeLinewidth*Xe()),Ot.setMode(D.LINES)):Ot.setMode(D.TRIANGLES);else if(te.isLine){let ot=fe.linewidth;ot===void 0&&(ot=1),Be.setLineWidth(ot*Xe()),te.isLineSegments?Ot.setMode(D.LINES):te.isLineLoop?Ot.setMode(D.LINE_LOOP):Ot.setMode(D.LINE_STRIP)}else te.isPoints?Ot.setMode(D.POINTS):te.isSprite&&Ot.setMode(D.TRIANGLES);if(te.isBatchedMesh)if(te._multiDrawInstances!==null)jl("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ot.renderMultiDrawInstances(te._multiDrawStarts,te._multiDrawCounts,te._multiDrawCount,te._multiDrawInstances);else if(Ve.get("WEBGL_multi_draw"))Ot.renderMultiDraw(te._multiDrawStarts,te._multiDrawCounts,te._multiDrawCount);else{const ot=te._multiDrawStarts,Bt=te._multiDrawCounts,yt=te._multiDrawCount,xn=Pe?P.get(Pe).bytesPerElement:1,ai=ke.get(fe).currentProgram.getUniforms();for(let zt=0;zt<yt;zt++)ai.setValue(D,"_gl_DrawID",zt),Ot.render(ot[zt]/xn,Bt[zt])}else if(te.isInstancedMesh)Ot.renderInstances(Et,en,te.count);else if(ce.isInstancedBufferGeometry){const ot=ce._maxInstanceCount!==void 0?ce._maxInstanceCount:1/0,Bt=Math.min(ce.instanceCount,ot);Ot.renderInstances(Et,en,Bt)}else Ot.render(Et,en)};function qt(w,ee,ce){w.transparent===!0&&w.side===ca&&w.forceSinglePass===!1?(w.side=ii,w.needsUpdate=!0,_i(w,ee,ce),w.side=Cs,w.needsUpdate=!0,_i(w,ee,ce),w.side=ca):_i(w,ee,ce)}this.compile=function(w,ee,ce=null){ce===null&&(ce=w),_=Ze.get(ce),_.init(ee),z.push(_),ce.traverseVisible(function(te){te.isLight&&te.layers.test(ee.layers)&&(_.pushLight(te),te.castShadow&&_.pushShadow(te))}),w!==ce&&w.traverseVisible(function(te){te.isLight&&te.layers.test(ee.layers)&&(_.pushLight(te),te.castShadow&&_.pushShadow(te))}),_.setupLights();const fe=new Set;return w.traverse(function(te){if(!(te.isMesh||te.isPoints||te.isLine||te.isSprite))return;const Re=te.material;if(Re)if(Array.isArray(Re))for(let je=0;je<Re.length;je++){const qe=Re[je];qt(qe,ce,te),fe.add(qe)}else qt(Re,ce,te),fe.add(Re)}),_=z.pop(),fe},this.compileAsync=function(w,ee,ce=null){const fe=this.compile(w,ee,ce);return new Promise(te=>{function Re(){if(fe.forEach(function(je){ke.get(je).currentProgram.isReady()&&fe.delete(je)}),fe.size===0){te(w);return}setTimeout(Re,10)}Ve.get("KHR_parallel_shader_compile")!==null?Re():setTimeout(Re,10)})};let Ct=null;function nn(w){Ct&&Ct(w)}function _n(){ha.stop()}function zn(){ha.start()}const ha=new tS;ha.setAnimationLoop(nn),typeof self<"u"&&ha.setContext(self),this.setAnimationLoop=function(w){Ct=w,we.setAnimationLoop(w),w===null?ha.stop():ha.start()},we.addEventListener("sessionstart",_n),we.addEventListener("sessionend",zn),this.render=function(w,ee){if(ee!==void 0&&ee.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(V===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),ee.parent===null&&ee.matrixWorldAutoUpdate===!0&&ee.updateMatrixWorld(),we.enabled===!0&&we.isPresenting===!0&&(we.cameraAutoUpdate===!0&&we.updateCamera(ee),ee=we.getCamera()),w.isScene===!0&&w.onBeforeRender(N,w,ee,Y),_=Ze.get(w,z.length),_.init(ee),z.push(_),oe.multiplyMatrices(ee.projectionMatrix,ee.matrixWorldInverse),j.setFromProjectionMatrix(oe,ua,ee.reversedDepth),$=this.localClippingEnabled,de=Ne.init(this.clippingPlanes,$),M=he.get(w,L.length),M.init(),L.push(M),we.enabled===!0&&we.isPresenting===!0){const Re=N.xr.getDepthSensingMesh();Re!==null&&Oo(Re,ee,-1/0,N.sortObjects)}Oo(w,ee,0,N.sortObjects),M.finish(),N.sortObjects===!0&&M.sort(ve,_e),Te=we.enabled===!1||we.isPresenting===!1||we.hasDepthSensing()===!1,Te&&Ye.addToRenderList(M,w),this.info.render.frame++,de===!0&&Ne.beginShadows();const ce=_.state.shadowsArray;De.render(ce,w,ee),de===!0&&Ne.endShadows(),this.info.autoReset===!0&&this.info.reset();const fe=M.opaque,te=M.transmissive;if(_.setupLights(),ee.isArrayCamera){const Re=ee.cameras;if(te.length>0)for(let je=0,qe=Re.length;je<qe;je++){const Pe=Re[je];ws(fe,te,w,Pe)}Te&&Ye.render(w);for(let je=0,qe=Re.length;je<qe;je++){const Pe=Re[je];Wl(M,w,Pe,Pe.viewport)}}else te.length>0&&ws(fe,te,w,ee),Te&&Ye.render(w),Wl(M,w,ee);Y!==null&&I===0&&(Me.updateMultisampleRenderTarget(Y),Me.updateRenderTargetMipmap(Y)),w.isScene===!0&&w.onAfterRender(N,w,ee),Oe.resetDefaultState(),U=-1,R=null,z.pop(),z.length>0?(_=z[z.length-1],de===!0&&Ne.setGlobalState(N.clippingPlanes,_.state.camera)):_=null,L.pop(),L.length>0?M=L[L.length-1]:M=null};function Oo(w,ee,ce,fe){if(w.visible===!1)return;if(w.layers.test(ee.layers)){if(w.isGroup)ce=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(ee);else if(w.isLight)_.pushLight(w),w.castShadow&&_.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||j.intersectsSprite(w)){fe&&Le.setFromMatrixPosition(w.matrixWorld).applyMatrix4(oe);const je=se.update(w),qe=w.material;qe.visible&&M.push(w,je,qe,ce,Le.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||j.intersectsObject(w))){const je=se.update(w),qe=w.material;if(fe&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Le.copy(w.boundingSphere.center)):(je.boundingSphere===null&&je.computeBoundingSphere(),Le.copy(je.boundingSphere.center)),Le.applyMatrix4(w.matrixWorld).applyMatrix4(oe)),Array.isArray(qe)){const Pe=je.groups;for(let et=0,ct=Pe.length;et<ct;et++){const rt=Pe[et],Et=qe[rt.materialIndex];Et&&Et.visible&&M.push(w,je,Et,ce,Le.z,rt)}}else qe.visible&&M.push(w,je,qe,ce,Le.z,null)}}const Re=w.children;for(let je=0,qe=Re.length;je<qe;je++)Oo(Re[je],ee,ce,fe)}function Wl(w,ee,ce,fe){const te=w.opaque,Re=w.transmissive,je=w.transparent;_.setupLightsView(ce),de===!0&&Ne.setGlobalState(N.clippingPlanes,ce),fe&&Be.viewport(G.copy(fe)),te.length>0&&pa(te,ee,ce),Re.length>0&&pa(Re,ee,ce),je.length>0&&pa(je,ee,ce),Be.buffers.depth.setTest(!0),Be.buffers.depth.setMask(!0),Be.buffers.color.setMask(!0),Be.setPolygonOffset(!1)}function ws(w,ee,ce,fe){if((ce.isScene===!0?ce.overrideMaterial:null)!==null)return;_.state.transmissionRenderTarget[fe.id]===void 0&&(_.state.transmissionRenderTarget[fe.id]=new Yi(1,1,{generateMipmaps:!0,type:Ve.has("EXT_color_buffer_half_float")||Ve.has("EXT_color_buffer_float")?Ia:fa,minFilter:fr,samples:4,stencilBuffer:u,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Lt.workingColorSpace}));const Re=_.state.transmissionRenderTarget[fe.id],je=fe.viewport||G;Re.setSize(je.z*N.transmissionResolutionScale,je.w*N.transmissionResolutionScale);const qe=N.getRenderTarget(),Pe=N.getActiveCubeFace(),et=N.getActiveMipmapLevel();N.setRenderTarget(Re),N.getClearColor(Z),B=N.getClearAlpha(),B<1&&N.setClearColor(16777215,.5),N.clear(),Te&&Ye.render(ce);const ct=N.toneMapping;N.toneMapping=Es;const rt=fe.viewport;if(fe.viewport!==void 0&&(fe.viewport=void 0),_.setupLightsView(fe),de===!0&&Ne.setGlobalState(N.clippingPlanes,fe),pa(w,ce,fe),Me.updateMultisampleRenderTarget(Re),Me.updateRenderTargetMipmap(Re),Ve.has("WEBGL_multisampled_render_to_texture")===!1){let Et=!1;for(let Ht=0,en=ee.length;Ht<en;Ht++){const It=ee[Ht],Ot=It.object,ot=It.geometry,Bt=It.material,yt=It.group;if(Bt.side===ca&&Ot.layers.test(fe.layers)){const xn=Bt.side;Bt.side=ii,Bt.needsUpdate=!0,Ns(Ot,ce,fe,ot,Bt,yt),Bt.side=xn,Bt.needsUpdate=!0,Et=!0}}Et===!0&&(Me.updateMultisampleRenderTarget(Re),Me.updateRenderTargetMipmap(Re))}N.setRenderTarget(qe,Pe,et),N.setClearColor(Z,B),rt!==void 0&&(fe.viewport=rt),N.toneMapping=ct}function pa(w,ee,ce){const fe=ee.isScene===!0?ee.overrideMaterial:null;for(let te=0,Re=w.length;te<Re;te++){const je=w[te],qe=je.object,Pe=je.geometry,et=je.group;let ct=je.material;ct.allowOverride===!0&&fe!==null&&(ct=fe),qe.layers.test(ce.layers)&&Ns(qe,ee,ce,Pe,ct,et)}}function Ns(w,ee,ce,fe,te,Re){w.onBeforeRender(N,ee,ce,fe,te,Re),w.modelViewMatrix.multiplyMatrices(ce.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),te.onBeforeRender(N,ee,ce,fe,w,Re),te.transparent===!0&&te.side===ca&&te.forceSinglePass===!1?(te.side=ii,te.needsUpdate=!0,N.renderBufferDirect(ce,ee,fe,te,w,Re),te.side=Cs,te.needsUpdate=!0,N.renderBufferDirect(ce,ee,fe,te,w,Re),te.side=ca):N.renderBufferDirect(ce,ee,fe,te,w,Re),w.onAfterRender(N,ee,ce,fe,te,Re)}function _i(w,ee,ce){ee.isScene!==!0&&(ee=Ae);const fe=ke.get(w),te=_.state.lights,Re=_.state.shadowsArray,je=te.state.version,qe=pe.getParameters(w,te.state,Re,ee,ce),Pe=pe.getProgramCacheKey(qe);let et=fe.programs;fe.environment=w.isMeshStandardMaterial?ee.environment:null,fe.fog=ee.fog,fe.envMap=(w.isMeshStandardMaterial?At:it).get(w.envMap||fe.environment),fe.envMapRotation=fe.environment!==null&&w.envMap===null?ee.environmentRotation:w.envMapRotation,et===void 0&&(w.addEventListener("dispose",ye),et=new Map,fe.programs=et);let ct=et.get(Pe);if(ct!==void 0){if(fe.currentProgram===ct&&fe.lightsStateVersion===je)return Ha(w,qe),ct}else qe.uniforms=pe.getUniforms(w),w.onBeforeCompile(qe,N),ct=pe.acquireProgram(qe,Pe),et.set(Pe,ct),fe.uniforms=qe.uniforms;const rt=fe.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(rt.clippingPlanes=Ne.uniform),Ha(w,qe),fe.needsLights=Kl(w),fe.lightsStateVersion=je,fe.needsLights&&(rt.ambientLightColor.value=te.state.ambient,rt.lightProbe.value=te.state.probe,rt.directionalLights.value=te.state.directional,rt.directionalLightShadows.value=te.state.directionalShadow,rt.spotLights.value=te.state.spot,rt.spotLightShadows.value=te.state.spotShadow,rt.rectAreaLights.value=te.state.rectArea,rt.ltc_1.value=te.state.rectAreaLTC1,rt.ltc_2.value=te.state.rectAreaLTC2,rt.pointLights.value=te.state.point,rt.pointLightShadows.value=te.state.pointShadow,rt.hemisphereLights.value=te.state.hemi,rt.directionalShadowMap.value=te.state.directionalShadowMap,rt.directionalShadowMatrix.value=te.state.directionalShadowMatrix,rt.spotShadowMap.value=te.state.spotShadowMap,rt.spotLightMatrix.value=te.state.spotLightMatrix,rt.spotLightMap.value=te.state.spotLightMap,rt.pointShadowMap.value=te.state.pointShadowMap,rt.pointShadowMatrix.value=te.state.pointShadowMatrix),fe.currentProgram=ct,fe.uniformsList=null,ct}function Ds(w){if(w.uniformsList===null){const ee=w.currentProgram.getUniforms();w.uniformsList=Wu.seqWithValue(ee.seq,w.uniforms)}return w.uniformsList}function Ha(w,ee){const ce=ke.get(w);ce.outputColorSpace=ee.outputColorSpace,ce.batching=ee.batching,ce.batchingColor=ee.batchingColor,ce.instancing=ee.instancing,ce.instancingColor=ee.instancingColor,ce.instancingMorph=ee.instancingMorph,ce.skinning=ee.skinning,ce.morphTargets=ee.morphTargets,ce.morphNormals=ee.morphNormals,ce.morphColors=ee.morphColors,ce.morphTargetsCount=ee.morphTargetsCount,ce.numClippingPlanes=ee.numClippingPlanes,ce.numIntersection=ee.numClipIntersection,ce.vertexAlphas=ee.vertexAlphas,ce.vertexTangents=ee.vertexTangents,ce.toneMapping=ee.toneMapping}function Zl(w,ee,ce,fe,te){ee.isScene!==!0&&(ee=Ae),Me.resetTextureUnits();const Re=ee.fog,je=fe.isMeshStandardMaterial?ee.environment:null,qe=Y===null?N.outputColorSpace:Y.isXRRenderTarget===!0?Y.texture.colorSpace:Ao,Pe=(fe.isMeshStandardMaterial?At:it).get(fe.envMap||je),et=fe.vertexColors===!0&&!!ce.attributes.color&&ce.attributes.color.itemSize===4,ct=!!ce.attributes.tangent&&(!!fe.normalMap||fe.anisotropy>0),rt=!!ce.morphAttributes.position,Et=!!ce.morphAttributes.normal,Ht=!!ce.morphAttributes.color;let en=Es;fe.toneMapped&&(Y===null||Y.isXRRenderTarget===!0)&&(en=N.toneMapping);const It=ce.morphAttributes.position||ce.morphAttributes.normal||ce.morphAttributes.color,Ot=It!==void 0?It.length:0,ot=ke.get(fe),Bt=_.state.lights;if(de===!0&&($===!0||w!==R)){const rn=w===R&&fe.id===U;Ne.setState(fe,w,rn)}let yt=!1;fe.version===ot.__version?(ot.needsLights&&ot.lightsStateVersion!==Bt.state.version||ot.outputColorSpace!==qe||te.isBatchedMesh&&ot.batching===!1||!te.isBatchedMesh&&ot.batching===!0||te.isBatchedMesh&&ot.batchingColor===!0&&te.colorTexture===null||te.isBatchedMesh&&ot.batchingColor===!1&&te.colorTexture!==null||te.isInstancedMesh&&ot.instancing===!1||!te.isInstancedMesh&&ot.instancing===!0||te.isSkinnedMesh&&ot.skinning===!1||!te.isSkinnedMesh&&ot.skinning===!0||te.isInstancedMesh&&ot.instancingColor===!0&&te.instanceColor===null||te.isInstancedMesh&&ot.instancingColor===!1&&te.instanceColor!==null||te.isInstancedMesh&&ot.instancingMorph===!0&&te.morphTexture===null||te.isInstancedMesh&&ot.instancingMorph===!1&&te.morphTexture!==null||ot.envMap!==Pe||fe.fog===!0&&ot.fog!==Re||ot.numClippingPlanes!==void 0&&(ot.numClippingPlanes!==Ne.numPlanes||ot.numIntersection!==Ne.numIntersection)||ot.vertexAlphas!==et||ot.vertexTangents!==ct||ot.morphTargets!==rt||ot.morphNormals!==Et||ot.morphColors!==Ht||ot.toneMapping!==en||ot.morphTargetsCount!==Ot)&&(yt=!0):(yt=!0,ot.__version=fe.version);let xn=ot.currentProgram;yt===!0&&(xn=_i(fe,ee,te));let ai=!1,zt=!1,ja=!1;const Qt=xn.getUniforms(),jn=ot.uniforms;if(Be.useProgram(xn.program)&&(ai=!0,zt=!0,ja=!0),fe.id!==U&&(U=fe.id,zt=!0),ai||R!==w){Be.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),Qt.setValue(D,"projectionMatrix",w.projectionMatrix),Qt.setValue(D,"viewMatrix",w.matrixWorldInverse);const Pn=Qt.map.cameraPosition;Pn!==void 0&&Pn.setValue(D,Ee.setFromMatrixPosition(w.matrixWorld)),Qe.logarithmicDepthBuffer&&Qt.setValue(D,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(fe.isMeshPhongMaterial||fe.isMeshToonMaterial||fe.isMeshLambertMaterial||fe.isMeshBasicMaterial||fe.isMeshStandardMaterial||fe.isShaderMaterial)&&Qt.setValue(D,"isOrthographic",w.isOrthographicCamera===!0),R!==w&&(R=w,zt=!0,ja=!0)}if(te.isSkinnedMesh){Qt.setOptional(D,te,"bindMatrix"),Qt.setOptional(D,te,"bindMatrixInverse");const rn=te.skeleton;rn&&(rn.boneTexture===null&&rn.computeBoneTexture(),Qt.setValue(D,"boneTexture",rn.boneTexture,Me))}te.isBatchedMesh&&(Qt.setOptional(D,te,"batchingTexture"),Qt.setValue(D,"batchingTexture",te._matricesTexture,Me),Qt.setOptional(D,te,"batchingIdTexture"),Qt.setValue(D,"batchingIdTexture",te._indirectTexture,Me),Qt.setOptional(D,te,"batchingColorTexture"),te._colorsTexture!==null&&Qt.setValue(D,"batchingColorTexture",te._colorsTexture,Me));const dn=ce.morphAttributes;if((dn.position!==void 0||dn.normal!==void 0||dn.color!==void 0)&&Se.update(te,ce,xn),(zt||ot.receiveShadow!==te.receiveShadow)&&(ot.receiveShadow=te.receiveShadow,Qt.setValue(D,"receiveShadow",te.receiveShadow)),fe.isMeshGouraudMaterial&&fe.envMap!==null&&(jn.envMap.value=Pe,jn.flipEnvMap.value=Pe.isCubeTexture&&Pe.isRenderTargetTexture===!1?-1:1),fe.isMeshStandardMaterial&&fe.envMap===null&&ee.environment!==null&&(jn.envMapIntensity.value=ee.environmentIntensity),zt&&(Qt.setValue(D,"toneMappingExposure",N.toneMappingExposure),ot.needsLights&&uf(jn,ja),Re&&fe.fog===!0&&xe.refreshFogUniforms(jn,Re),xe.refreshMaterialUniforms(jn,fe,X,k,_.state.transmissionRenderTarget[w.id]),Wu.upload(D,Ds(ot),jn,Me)),fe.isShaderMaterial&&fe.uniformsNeedUpdate===!0&&(Wu.upload(D,Ds(ot),jn,Me),fe.uniformsNeedUpdate=!1),fe.isSpriteMaterial&&Qt.setValue(D,"center",te.center),Qt.setValue(D,"modelViewMatrix",te.modelViewMatrix),Qt.setValue(D,"normalMatrix",te.normalMatrix),Qt.setValue(D,"modelMatrix",te.matrixWorld),fe.isShaderMaterial||fe.isRawShaderMaterial){const rn=fe.uniformsGroups;for(let Pn=0,pr=rn.length;Pn<pr;Pn++){const Ki=rn[Pn];ft.update(Ki,xn),ft.bind(Ki,xn)}}return xn}function uf(w,ee){w.ambientLightColor.needsUpdate=ee,w.lightProbe.needsUpdate=ee,w.directionalLights.needsUpdate=ee,w.directionalLightShadows.needsUpdate=ee,w.pointLights.needsUpdate=ee,w.pointLightShadows.needsUpdate=ee,w.spotLights.needsUpdate=ee,w.spotLightShadows.needsUpdate=ee,w.rectAreaLights.needsUpdate=ee,w.hemisphereLights.needsUpdate=ee}function Kl(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return Y},this.setRenderTargetTextures=function(w,ee,ce){const fe=ke.get(w);fe.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,fe.__autoAllocateDepthBuffer===!1&&(fe.__useRenderToTexture=!1),ke.get(w.texture).__webglTexture=ee,ke.get(w.depthTexture).__webglTexture=fe.__autoAllocateDepthBuffer?void 0:ce,fe.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,ee){const ce=ke.get(w);ce.__webglFramebuffer=ee,ce.__useDefaultFramebuffer=ee===void 0};const zo=D.createFramebuffer();this.setRenderTarget=function(w,ee=0,ce=0){Y=w,H=ee,I=ce;let fe=!0,te=null,Re=!1,je=!1;if(w){const Pe=ke.get(w);if(Pe.__useDefaultFramebuffer!==void 0)Be.bindFramebuffer(D.FRAMEBUFFER,null),fe=!1;else if(Pe.__webglFramebuffer===void 0)Me.setupRenderTarget(w);else if(Pe.__hasExternalTextures)Me.rebindTextures(w,ke.get(w.texture).__webglTexture,ke.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const rt=w.depthTexture;if(Pe.__boundDepthTexture!==rt){if(rt!==null&&ke.has(rt)&&(w.width!==rt.image.width||w.height!==rt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Me.setupDepthRenderbuffer(w)}}const et=w.texture;(et.isData3DTexture||et.isDataArrayTexture||et.isCompressedArrayTexture)&&(je=!0);const ct=ke.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(ct[ee])?te=ct[ee][ce]:te=ct[ee],Re=!0):w.samples>0&&Me.useMultisampledRTT(w)===!1?te=ke.get(w).__webglMultisampledFramebuffer:Array.isArray(ct)?te=ct[ce]:te=ct,G.copy(w.viewport),ie.copy(w.scissor),ue=w.scissorTest}else G.copy(He).multiplyScalar(X).floor(),ie.copy($e).multiplyScalar(X).floor(),ue=xt;if(ce!==0&&(te=zo),Be.bindFramebuffer(D.FRAMEBUFFER,te)&&fe&&Be.drawBuffers(w,te),Be.viewport(G),Be.scissor(ie),Be.setScissorTest(ue),Re){const Pe=ke.get(w.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Pe.__webglTexture,ce)}else if(je){const Pe=ee;for(let et=0;et<w.textures.length;et++){const ct=ke.get(w.textures[et]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+et,ct.__webglTexture,ce,Pe)}}else if(w!==null&&ce!==0){const Pe=ke.get(w.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Pe.__webglTexture,ce)}U=-1},this.readRenderTargetPixels=function(w,ee,ce,fe,te,Re,je,qe=0){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pe=ke.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&je!==void 0&&(Pe=Pe[je]),Pe){Be.bindFramebuffer(D.FRAMEBUFFER,Pe);try{const et=w.textures[qe],ct=et.format,rt=et.type;if(!Qe.textureFormatReadable(ct)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Qe.textureTypeReadable(rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}ee>=0&&ee<=w.width-fe&&ce>=0&&ce<=w.height-te&&(w.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+qe),D.readPixels(ee,ce,fe,te,Je.convert(ct),Je.convert(rt),Re))}finally{const et=Y!==null?ke.get(Y).__webglFramebuffer:null;Be.bindFramebuffer(D.FRAMEBUFFER,et)}}},this.readRenderTargetPixelsAsync=async function(w,ee,ce,fe,te,Re,je,qe=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pe=ke.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&je!==void 0&&(Pe=Pe[je]),Pe)if(ee>=0&&ee<=w.width-fe&&ce>=0&&ce<=w.height-te){Be.bindFramebuffer(D.FRAMEBUFFER,Pe);const et=w.textures[qe],ct=et.format,rt=et.type;if(!Qe.textureFormatReadable(ct))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Qe.textureTypeReadable(rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Et=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Et),D.bufferData(D.PIXEL_PACK_BUFFER,Re.byteLength,D.STREAM_READ),w.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+qe),D.readPixels(ee,ce,fe,te,Je.convert(ct),Je.convert(rt),0);const Ht=Y!==null?ke.get(Y).__webglFramebuffer:null;Be.bindFramebuffer(D.FRAMEBUFFER,Ht);const en=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await uT(D,en,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Et),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,Re),D.deleteBuffer(Et),D.deleteSync(en),Re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,ee=null,ce=0){const fe=Math.pow(2,-ce),te=Math.floor(w.image.width*fe),Re=Math.floor(w.image.height*fe),je=ee!==null?ee.x:0,qe=ee!==null?ee.y:0;Me.setTexture2D(w,0),D.copyTexSubImage2D(D.TEXTURE_2D,ce,0,0,je,qe,te,Re),Be.unbindTexture()};const Us=D.createFramebuffer(),ff=D.createFramebuffer();this.copyTextureToTexture=function(w,ee,ce=null,fe=null,te=0,Re=null){Re===null&&(te!==0?(jl("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Re=te,te=0):Re=0);let je,qe,Pe,et,ct,rt,Et,Ht,en;const It=w.isCompressedTexture?w.mipmaps[Re]:w.image;if(ce!==null)je=ce.max.x-ce.min.x,qe=ce.max.y-ce.min.y,Pe=ce.isBox3?ce.max.z-ce.min.z:1,et=ce.min.x,ct=ce.min.y,rt=ce.isBox3?ce.min.z:0;else{const dn=Math.pow(2,-te);je=Math.floor(It.width*dn),qe=Math.floor(It.height*dn),w.isDataArrayTexture?Pe=It.depth:w.isData3DTexture?Pe=Math.floor(It.depth*dn):Pe=1,et=0,ct=0,rt=0}fe!==null?(Et=fe.x,Ht=fe.y,en=fe.z):(Et=0,Ht=0,en=0);const Ot=Je.convert(ee.format),ot=Je.convert(ee.type);let Bt;ee.isData3DTexture?(Me.setTexture3D(ee,0),Bt=D.TEXTURE_3D):ee.isDataArrayTexture||ee.isCompressedArrayTexture?(Me.setTexture2DArray(ee,0),Bt=D.TEXTURE_2D_ARRAY):(Me.setTexture2D(ee,0),Bt=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,ee.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ee.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,ee.unpackAlignment);const yt=D.getParameter(D.UNPACK_ROW_LENGTH),xn=D.getParameter(D.UNPACK_IMAGE_HEIGHT),ai=D.getParameter(D.UNPACK_SKIP_PIXELS),zt=D.getParameter(D.UNPACK_SKIP_ROWS),ja=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,It.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,It.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,et),D.pixelStorei(D.UNPACK_SKIP_ROWS,ct),D.pixelStorei(D.UNPACK_SKIP_IMAGES,rt);const Qt=w.isDataArrayTexture||w.isData3DTexture,jn=ee.isDataArrayTexture||ee.isData3DTexture;if(w.isDepthTexture){const dn=ke.get(w),rn=ke.get(ee),Pn=ke.get(dn.__renderTarget),pr=ke.get(rn.__renderTarget);Be.bindFramebuffer(D.READ_FRAMEBUFFER,Pn.__webglFramebuffer),Be.bindFramebuffer(D.DRAW_FRAMEBUFFER,pr.__webglFramebuffer);for(let Ki=0;Ki<Pe;Ki++)Qt&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,ke.get(w).__webglTexture,te,rt+Ki),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,ke.get(ee).__webglTexture,Re,en+Ki)),D.blitFramebuffer(et,ct,je,qe,Et,Ht,je,qe,D.DEPTH_BUFFER_BIT,D.NEAREST);Be.bindFramebuffer(D.READ_FRAMEBUFFER,null),Be.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(te!==0||w.isRenderTargetTexture||ke.has(w)){const dn=ke.get(w),rn=ke.get(ee);Be.bindFramebuffer(D.READ_FRAMEBUFFER,Us),Be.bindFramebuffer(D.DRAW_FRAMEBUFFER,ff);for(let Pn=0;Pn<Pe;Pn++)Qt?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,dn.__webglTexture,te,rt+Pn):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,dn.__webglTexture,te),jn?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,rn.__webglTexture,Re,en+Pn):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,rn.__webglTexture,Re),te!==0?D.blitFramebuffer(et,ct,je,qe,Et,Ht,je,qe,D.COLOR_BUFFER_BIT,D.NEAREST):jn?D.copyTexSubImage3D(Bt,Re,Et,Ht,en+Pn,et,ct,je,qe):D.copyTexSubImage2D(Bt,Re,Et,Ht,et,ct,je,qe);Be.bindFramebuffer(D.READ_FRAMEBUFFER,null),Be.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else jn?w.isDataTexture||w.isData3DTexture?D.texSubImage3D(Bt,Re,Et,Ht,en,je,qe,Pe,Ot,ot,It.data):ee.isCompressedArrayTexture?D.compressedTexSubImage3D(Bt,Re,Et,Ht,en,je,qe,Pe,Ot,It.data):D.texSubImage3D(Bt,Re,Et,Ht,en,je,qe,Pe,Ot,ot,It):w.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,Re,Et,Ht,je,qe,Ot,ot,It.data):w.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,Re,Et,Ht,It.width,It.height,Ot,It.data):D.texSubImage2D(D.TEXTURE_2D,Re,Et,Ht,je,qe,Ot,ot,It);D.pixelStorei(D.UNPACK_ROW_LENGTH,yt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,xn),D.pixelStorei(D.UNPACK_SKIP_PIXELS,ai),D.pixelStorei(D.UNPACK_SKIP_ROWS,zt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,ja),Re===0&&ee.generateMipmaps&&D.generateMipmap(Bt),Be.unbindTexture()},this.initRenderTarget=function(w){ke.get(w).__webglFramebuffer===void 0&&Me.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?Me.setTextureCube(w,0):w.isData3DTexture?Me.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?Me.setTexture2DArray(w,0):Me.setTexture2D(w,0),Be.unbindTexture()},this.resetState=function(){H=0,I=0,Y=null,Be.reset(),Oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ua}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const i=this.getContext();i.drawingBufferColorSpace=Lt._getDrawingBufferColorSpace(t),i.unpackColorSpace=Lt._getUnpackColorSpace()}}const Zu={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Lo{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const zR=new of(-1,1,1,-1,0,1);class PR extends Zi{constructor(){super(),this.setAttribute("position",new Oi([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Oi([0,2,0,0,2,0],2))}}const IR=new PR;class Bm{constructor(t){this._mesh=new gi(IR,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,zR)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class rS extends Lo{constructor(t,i="tDiffuse"){super(),this.textureID=i,this.uniforms=null,this.material=null,t instanceof Yn?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Gl.clone(t.uniforms),this.material=new Yn({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Bm(this.material)}render(t,i,o){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=o.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class sy extends Lo{constructor(t,i){super(),this.scene=t,this.camera=i,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,i,o){const l=t.getContext(),u=t.state;u.buffers.color.setMask(!1),u.buffers.depth.setMask(!1),u.buffers.color.setLocked(!0),u.buffers.depth.setLocked(!0);let h,p;this.inverse?(h=0,p=1):(h=1,p=0),u.buffers.stencil.setTest(!0),u.buffers.stencil.setOp(l.REPLACE,l.REPLACE,l.REPLACE),u.buffers.stencil.setFunc(l.ALWAYS,h,4294967295),u.buffers.stencil.setClear(p),u.buffers.stencil.setLocked(!0),t.setRenderTarget(o),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),u.buffers.color.setLocked(!1),u.buffers.depth.setLocked(!1),u.buffers.color.setMask(!0),u.buffers.depth.setMask(!0),u.buffers.stencil.setLocked(!1),u.buffers.stencil.setFunc(l.EQUAL,1,4294967295),u.buffers.stencil.setOp(l.KEEP,l.KEEP,l.KEEP),u.buffers.stencil.setLocked(!0)}}class BR extends Lo{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class FR{constructor(t,i){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),i===void 0){const o=t.getSize(new pt);this._width=o.width,this._height=o.height,i=new Yi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ia}),i.texture.name="EffectComposer.rt1"}else this._width=i.width,this._height=i.height;this.renderTarget1=i,this.renderTarget2=i.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new rS(Zu),this.copyPass.material.blending=Pa,this.clock=new eS}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,i){this.passes.splice(i,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const i=this.passes.indexOf(t);i!==-1&&this.passes.splice(i,1)}isLastEnabledPass(t){for(let i=t+1;i<this.passes.length;i++)if(this.passes[i].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const i=this.renderer.getRenderTarget();let o=!1;for(let l=0,u=this.passes.length;l<u;l++){const h=this.passes[l];if(h.enabled!==!1){if(h.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(l),h.render(this.renderer,this.writeBuffer,this.readBuffer,t,o),h.needsSwap){if(o){const p=this.renderer.getContext(),m=this.renderer.state.buffers.stencil;m.setFunc(p.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),m.setFunc(p.EQUAL,1,4294967295)}this.swapBuffers()}sy!==void 0&&(h instanceof sy?o=!0:h instanceof BR&&(o=!1))}}this.renderer.setRenderTarget(i)}reset(t){if(t===void 0){const i=this.renderer.getSize(new pt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=i.width,this._height=i.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,i){this._width=t,this._height=i;const o=this._width*this._pixelRatio,l=this._height*this._pixelRatio;this.renderTarget1.setSize(o,l),this.renderTarget2.setSize(o,l);for(let u=0;u<this.passes.length;u++)this.passes[u].setSize(o,l)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class HR extends Lo{constructor(t,i,o=null,l=null,u=null){super(),this.scene=t,this.camera=i,this.overrideMaterial=o,this.clearColor=l,this.clearAlpha=u,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Nt}render(t,i,o){const l=t.autoClear;t.autoClear=!1;let u,h;this.overrideMaterial!==null&&(h=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(u=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:o),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(u),this.overrideMaterial!==null&&(this.scene.overrideMaterial=h),t.autoClear=l}}const jR={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Nt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Ro extends Lo{constructor(t,i=1,o,l){super(),this.strength=i,this.radius=o,this.threshold=l,this.resolution=t!==void 0?new pt(t.x,t.y):new pt(256,256),this.clearColor=new Nt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let u=Math.round(this.resolution.x/2),h=Math.round(this.resolution.y/2);this.renderTargetBright=new Yi(u,h,{type:Ia}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let x=0;x<this.nMips;x++){const v=new Yi(u,h,{type:Ia});v.texture.name="UnrealBloomPass.h"+x,v.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(v);const S=new Yi(u,h,{type:Ia});S.texture.name="UnrealBloomPass.v"+x,S.texture.generateMipmaps=!1,this.renderTargetsVertical.push(S),u=Math.round(u/2),h=Math.round(h/2)}const p=jR;this.highPassUniforms=Gl.clone(p.uniforms),this.highPassUniforms.luminosityThreshold.value=l,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Yn({uniforms:this.highPassUniforms,vertexShader:p.vertexShader,fragmentShader:p.fragmentShader}),this.separableBlurMaterials=[];const m=[3,5,7,9,11];u=Math.round(this.resolution.x/2),h=Math.round(this.resolution.y/2);for(let x=0;x<this.nMips;x++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(m[x])),this.separableBlurMaterials[x].uniforms.invSize.value=new pt(1/u,1/h),u=Math.round(u/2),h=Math.round(h/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=i,this.compositeMaterial.uniforms.bloomRadius.value=.1;const g=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=g,this.bloomTintColors=[new ae(1,1,1),new ae(1,1,1),new ae(1,1,1),new ae(1,1,1),new ae(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Gl.clone(Zu.uniforms),this.blendMaterial=new Yn({uniforms:this.copyUniforms,vertexShader:Zu.vertexShader,fragmentShader:Zu.fragmentShader,blending:Cp,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Nt,this._oldClearAlpha=1,this._basic=new So,this._fsQuad=new Bm(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,i){let o=Math.round(t/2),l=Math.round(i/2);this.renderTargetBright.setSize(o,l);for(let u=0;u<this.nMips;u++)this.renderTargetsHorizontal[u].setSize(o,l),this.renderTargetsVertical[u].setSize(o,l),this.separableBlurMaterials[u].uniforms.invSize.value=new pt(1/o,1/l),o=Math.round(o/2),l=Math.round(l/2)}render(t,i,o,l,u){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const h=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),u&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=o.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=o.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let p=this.renderTargetBright;for(let m=0;m<this.nMips;m++)this._fsQuad.material=this.separableBlurMaterials[m],this.separableBlurMaterials[m].uniforms.colorTexture.value=p.texture,this.separableBlurMaterials[m].uniforms.direction.value=Ro.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[m]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[m].uniforms.colorTexture.value=this.renderTargetsHorizontal[m].texture,this.separableBlurMaterials[m].uniforms.direction.value=Ro.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[m]),t.clear(),this._fsQuad.render(t),p=this.renderTargetsVertical[m];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,u&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(o),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=h}_getSeparableBlurMaterial(t){const i=[];for(let o=0;o<t;o++)i.push(.39894*Math.exp(-.5*o*o/(t*t))/t);return new Yn({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new pt(.5,.5)},direction:{value:new pt(.5,.5)},gaussianCoefficients:{value:i}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(t){return new Yn({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Ro.BlurDirectionX=new pt(1,0);Ro.BlurDirectionY=new pt(0,1);const ju={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class GR extends Lo{constructor(){super(),this.uniforms=Gl.clone(ju.uniforms),this.material=new FT({name:ju.name,uniforms:this.uniforms,vertexShader:ju.vertexShader,fragmentShader:ju.fragmentShader}),this._fsQuad=new Bm(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,i,o){this.uniforms.tDiffuse.value=o.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Lt.getTransfer(this._outputColorSpace)===Xt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ey?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ty?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===by?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===bm?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Cy?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ry?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Ay&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const Ts=s=>`./${s.replace(/^\/+/,"")}`,vi={repair:{name:"维修器具",en:"WORKSHOP",color:"#95afa3"},life:{name:"生活用品",en:"EVERYDAY",color:"#d4b77f"},collect:{name:"旧世珍藏",en:"RELICS",color:"#bf9d98"}},oS=s=>({.5:"破损",.75:"磨损",.8:"可用",.9:"良好",1:"近新"})[s]??"未知",VR=s=>s===1?"原装":s===.65?"兼容替代":"仿制纪念品",bs={condition:{name:"外观检查",minutes:4,hint:"寻找三处使用痕迹，确认真实品相。"},function:{name:"功能测试",minutes:8,hint:"启动密闭测试台，检查性能档位。"},authenticity:{name:"编号核验",minutes:12,hint:"对照旧站档案，辨认出厂与维修印记。"}},Hn=[{id:"I01",name:"磁扣工具盒",category:"repair",base:60,sprite:0,imitation:!1,subtitle:"南站维修班 · 制式工具",lore:"内盖刻着历任维修工的名字。盒子传了四双手，最小的那把扳手始终没有离开过它的位置。",appearance:["锁扣边缘被磨得发亮","内衬留下不齐的工具压痕","提手缠过两层旧帆布"],functionClue:["磁扣连续吸合，锁定机构可靠。","磁扣吸力衰减，需要反复按压才能扣牢。"],code:"NS–03 / △",originalClue:"内盖三角维修印与南站第三批目录一致。",alternateClue:"内盖为后配板，维修印来自兼容批次。"},{id:"I02",name:"旧式蓄电池",category:"repair",base:60,sprite:1,imitation:!1,subtitle:"旧陆工厂 · 储能单元",lore:"壳体上还贴着一张褪色的值班表。停电之后，有人用它守过整整一夜的站台信号灯。",appearance:["接线座有暗绿色氧化层","外壳侧面留着旧补胶","底部有搬运留下的擦痕"],functionClue:["密闭测试台显示：容量档位正常。","密闭测试台显示：容量仅余六成，降级可用。"],code:"DL–60 / B14",originalClue:"型号与第十四批出厂记录相符。",alternateClue:"壳体原装，内部为后期兼容储能单元。"},{id:"I03",name:"折叠测距镜",category:"repair",base:120,sprite:2,imitation:!1,subtitle:"铁路测绘所 · 光学仪器",lore:"一块蓝布塞在镜筒缝里，用来挡住风沙。镜片里最后测过的路，如今已经不在地图上。",appearance:["折叠镜架略有歪斜","镜片边缘有细小划痕","校准环上沾着灰白粉末"],functionClue:["标尺在测试轨上准确对齐。","标尺偏移，测距效率下降到六成。"],code:"CL–12 / 7",originalClue:"镜筒校准位与原厂登记编号相合。",alternateClue:"校准环来自民间兼容维修件。"},{id:"I04",name:"黄铜压力表",category:"repair",base:80,sprite:3,imitation:!1,subtitle:"东泵站 · 仪表备件",lore:"铜圈上的小凹痕像一弯月亮。原主人说，那是泵站恢复供水那天，大家太高兴留下的。",appearance:["表盘外圈有月牙压痕","指针轴稍微松动","铜背板的颜色深浅不一"],functionClue:["标准气囊台：偏差在正常范围。","标准气囊台：指针偏差较大，降级可用。"],code:"DB–08 / 22",originalClue:"背面泵站维修印与二十二号档案一致。",alternateClue:"背板是兼容件，原厂封印已被替换。"},{id:"I05",name:"保温水壶",category:"life",base:80,sprite:4,imitation:!1,subtitle:"北线运输队 · 随行物资",lore:"壶底被敲平了两次，仍能稳稳放在桌上。把手缠着蓝布，内侧藏着一个名字的首字。",appearance:["内胆有不规则暗斑","壶盖边缘有细裂纹","蓝色布条包住了提手"],functionClue:["密封台：保温与密封档位正常。","密封台：保温效率下降，仍可使用。"],code:"BX–08 / 41",originalClue:"壶底工厂码与运输队物资目录相符。",alternateClue:"壶底编码来自后期兼容生产批次。"},{id:"I06",name:"长明台灯",category:"life",base:100,sprite:5,imitation:!1,subtitle:"站务室旧藏 · 夜班的光",lore:"开关被一代代夜班人磨得发亮。灯罩内侧写着一句小字：末班车到站，再熄灯。",appearance:["灯罩边缘有一处缺角","开关被手指磨得光滑","底座还粘着半张纸条"],functionClue:["灯光稳定，续航达到原设计档位。","灯光偏暗，续航降至正常的六成。"],code:"ZW–10 / L3",originalClue:"底座线序与站务原装电路图一致。",alternateClue:"底座线序是后配兼容电路。"},{id:"I07",name:"手摇应急电台",category:"life",base:100,sprite:6,imitation:!1,subtitle:"旧陆防务 · 短波接收机",lore:"它陪跑腿员走过三次沙暴。调到最左边的频段，偶尔还能听见远处有人报平安。",appearance:["摇柄握位留下浅浅指痕","天线接口曾经仔细补焊","皮革提手边缘略微起毛"],functionClue:["摇柄转动顺畅，信号指示达到三格。","摇柄空转，信号只能维持一格。"],code:"YL–10 / R09",originalClue:"防拆封签完整，生产批次与旧陆目录吻合。",alternateClue:"封签重贴，接收模块为兼容替代。"},{id:"I08",name:"陶芯滤水壶",category:"life",base:110,sprite:7,imitation:!1,subtitle:"聚落水务 · 家庭净水器",lore:"奶白色的滤芯外套着一只手缝布袋。卖家说孩子把它叫作“小水塔”，从不许别人碰倒。",appearance:["滤芯接口有反复旋拧痕迹","陶壳边缘有轻微磕碰","壶嘴下方积着白色水垢"],functionClue:["封闭检测台：过滤机构正常。","封闭检测台：流量效率下降至六成。"],code:"SW–11 / F6",originalClue:"滤芯封签日期与型号相互匹配。",alternateClue:"滤芯来自登记过的兼容工坊。"},{id:"I09",name:"车站翻页钟",category:"collect",base:90,sprite:8,imitation:!0,subtitle:"旧中央站 · 时间的残页",lore:"它曾挂在第三候车室。最后一班车离开之后，钟没有停，只是再也没人急着看它。",appearance:["翻页纸片有一角缺失","黑色面板已经褪成灰色","玻璃后面落着细细的沙"],functionClue:["翻页顺畅，每一格都准确落位。","翻页机构偶尔卡住，效率下降。"],code:"ZY–09 / T2",originalClue:"纸片字体与中央站原厂印版相同。",alternateClue:"纸片是后期补印，字体与原厂不同。"},{id:"I10",name:"发条鸣鸟",category:"collect",base:75,sprite:9,imitation:!0,subtitle:"旧城百货 · 会唱歌的小东西",lore:"尾巴的蓝漆掉了一半，旋律却还完整。没有人记得歌名，每个听过的人都说有点熟悉。",appearance:["尾部蓝色漆面部分剥落","底座边缘有一条旧焊缝","发条钥匙磨成了亮铜色"],functionClue:["上弦后完整奏出四小节旋律。","旋律断续，发条机构效率下降。"],code:"JC–75 / B5",originalClue:"底板冲压标记与旧城百货目录一致。",alternateClue:"底板为后压，属于复刻生产批次。"},{id:"I11",name:"旧城投影匣",category:"collect",base:150,sprite:10,imitation:!0,subtitle:"城市档案馆 · 一帧往日",lore:"匣子里装着一帧雨天的老街。如今聚落的孩子没见过下雨，却都认得画面里那把红伞。",appearance:["透镜表面有一层薄雾","插槽边缘被反复磨损","匣盖留着档案馆贴纸残片"],functionClue:["旧城街景投射清晰，进片稳定。","投影偏暗，进片偶有停顿。"],code:"DA–15 / P8",originalClue:"胶片序号与八型原装外壳匹配。",alternateClue:"胶片与外壳版本不符，是后配组合。"},{id:"I12",name:"铜轨纪念章盒",category:"collect",base:70,sprite:11,imitation:!0,subtitle:"铁路通车纪念 · 留给后来人",lore:"红绒盒衬换过一次，铜章还留着手心的光。背面刻着通车日期，那条铁路曾经通向海。",appearance:["铜章边缘的齿纹已变浅","盒衬是后来更换的红绒布","铰链附近有一圈油迹"],functionClue:["盒锁及展示机构正常开合。","盒锁松动，展示机构降级可用。"],code:"TL–70 / M1",originalClue:"压印年份与首次通车发行目录吻合。",alternateClue:"压印版式与原年份不符，是后来制作的。"}],Zt=s=>Hn.find(t=>t.id===s);function lS(s){return s===6?{x:714,y:362,w:420,h:362}:{x:s%4*362,y:Math.floor(s/4)*362,w:362,h:362}}const wi=[{id:"lin",name:"林鹭",title:"穿行沙海的跑腿员",sprite:0,preferences:["life","repair"],floor:.7,ask:1.1,budget:1,risk:!1,color:"#b88965",bio:"她记得每条小路，也记得路尽头的人。肩上的包，总比看起来更重一点。",lines:{intro:"门口这只铃铛真好听。你就是新来的店主吧？",revisit:["又碰面啦，我趁下一趟出发前绕过来。","路过南站，给你带了点新消息。"],sell:["这台{item}跟我跑了不少路，给它找个新主人吧。","包里装不下了。{item}，你收不收？"],buy:["下一趟要走得远，我想挑件能靠得住的东西。","找点{category}，好用比好看要紧。"],counter:["这个数，我还不够付今晚的车费呢。","再添一点吧，你知道好东西不常见。","最后这口价了，我真该赶路了。"],deal:["好，就这么定。它跟着你，我放心。","票子收好了。下次有好东西先来找你。"],refuse:["没事，买卖不成，路上见。","那我再背一程，说不定有人正需要。"],noStock:"没找到合适的，明天我再来看看。",inspect:["慢慢看。摇柄的地方是我自己补过的。","有问题问我，别看我记不住那些编号。"],special:"它陪我穿过三次沙暴。卖家说法，你听听就好。"}},{id:"zhou",name:"周砾",title:"南站的老维修工",sprite:1,preferences:["repair"],floor:.78,ask:1.08,budget:1.05,risk:!0,color:"#779b8f",bio:"不爱解释，擅长修复。他总说，零件有脾气，听懂就不难相处。",lines:{intro:"周砾。南站修东西的，有事去机房找我。",revisit:["手头活儿做完了，过来转转。","刚擦过手，不弄脏你柜台。"],sell:["{item}。换下来的，还能用，自己检查。","这件{item}腾出来了，你看着给。"],buy:["要件维修器具，能干活就行。","兼容件也收。标清来路，我自己会判断。"],counter:["太低。材料都不止这个数。","这个价不行，再想想。","最后一次。机房还有活等着。"],deal:["成。说好的数，不改了。","东西拿稳。要修，来找我。"],refuse:["不合适就算了，省得彼此耽误。","行，我带回去。"],noStock:"没合适的零件。我先回机房。",inspect:["测吧。用台子，别拿手碰接头。","看功能，再看编号。两回事。"],special:"原装也有坏的，替代件也有顶用的。"}},{id:"tao",name:"陶叔",title:"公共厨房的掌勺人",sprite:2,preferences:["life","collect"],floor:.68,ask:1.12,budget:1.1,risk:!1,color:"#c8b17c",bio:"掌着六十个人的饭勺，也记着六十个人的口味。他不愿意浪费任何东西。",lines:{intro:"小店主，叫我陶叔就成。饿了来厨房。",revisit:["趁锅里慢炖着，出来走动走动。","又来叨扰你了，今天生意怎么样？"],sell:["收拾库房找到的{item}，放着怪可惜。","{item}还挺好，给需要的人用吧。"],buy:["厨房缺点生活用品，耐用最要紧。","想找件{category}，用得顺手就好。"],counter:["再商量商量，厨房的预算紧呀。","这个数，叔心里还有点舍不得。","就到这儿吧，汤可不能熬过了。"],deal:["好，好。东西总算找着用处了。","说定了。晚上来喝碗热汤。"],refuse:["没关系，生意不急这一回。","那就先放着，回头再说。"],noStock:"不凑合，叔改天再来。",inspect:["细看是好事，做饭也得看火候。","后来配的地方，你都给我标清楚。"],special:"我买的是能亮一晚的灯，不是墙上的影子。"}},{id:"wen",name:"闻苇",title:"为旧世界做注的人",sprite:3,preferences:["collect","repair"],floor:.8,ask:1.22,budget:1.15,risk:!1,color:"#8ca8ad",bio:"随身带着卡片簿，正在整理一座不再存在的城市。她相信记得也是一种修复。",lines:{intro:"我是闻苇，在整理车站旧档案。很高兴这里又亮灯了。",revisit:["上回的条目补好了，顺便来看看。","又有一页空白等着填，今天有新东西吗？"],sell:["这件{item}有重复藏品，愿意转给你。","{item}的出身值得记，你先看实物。"],buy:["想找件编号清楚的旧物，版本很重要。","今天在查{category}的目录，有合适的吗？"],counter:["这个价格，还没有把完整性算进去。","我理解你的考量，但得再接近一些。","这是最后的余地，我不急着出手。"],deal:["谢谢。它的故事会留在档案里。","成交。我会记下今天的日期。"],refuse:["没关系，好的去处值得等一等。","那留给下一位有缘的人吧。"],noStock:"没有合适的版本。我下次再来。",inspect:["编号和功能要分别看，别被外壳带偏。","这里有一处细节，目录上恰好有。"],special:"我记录旧物，不代表我相信每一个故事。"}},{id:"que",name:"鹊姐",title:"跟着商队来的掮客",sprite:4,preferences:["collect","life"],floor:.82,ask:1.25,budget:.95,risk:!1,color:"#b18381",bio:"敲两下柜台是她的习惯。她谈价寸步不让，谈好的事却从不失约。",lines:{intro:"鹊姐。商队过路，顺便认识一下新邻居。",revisit:["又见面了，看看你有没有练出眼力。","商队还没走，咱们再做一笔？"],sell:["这件{item}，路上已经有人问过价了。","给你先看{item}，别让我白跑一趟。"],buy:["找点好转手的{category}，你的货架呢？","我不靠故事吃饭，拿实物出来说。"],counter:["这可不叫还价，这叫让我做慈善。","再往中间走一步，别兜圈子。","最后一口，大家都省点时间。"],deal:["痛快。说定的事，鹊姐从不反悔。","成交。票子当面点，交情慢慢处。"],refuse:["眼光不同，各走各的路。","好，改天再做买卖。"],noStock:"今天的货不对路，回见。",inspect:["尽管查。做生意，明白比好听重要。","这点时间我等得起，别光听故事。"],special:"价钱明着谈，来路写清楚，咱们就能长久。"}},{id:"kou",name:"阿扣",title:"总有新点子的杂工",sprite:5,preferences:["repair","life","collect"],floor:.62,ask:1.05,budget:.9,risk:!0,color:"#b4a482",bio:"成年以后接过的第一份活，是把站台的钟修好。修没修好另说，他从不轻易放弃。",lines:{intro:"我叫阿扣，什么活都接。你这儿缺帮手吗？",revisit:["又是我！今天捡到个有意思的东西。","活干完啦，过来看看你的新货。"],sell:["{item}，我本来想留着自己研究的。","这件{item}你看看，我保证没乱拆。"],buy:["想挑件{category}，不过我口袋不太鼓。","不确定的也行，标出来让我自己选。"],counter:["再高一点？我就能把欠的饭钱还上。","差一点点，真的就一点点。","最后一次啦，我得去接活了。"],deal:["成交！我就知道能谈成。","谢啦，回头帮你把门轴上点油。"],refuse:["好吧，我先抱回去研究。","没事，下回再来碰运气。"],noStock:"没有合适的呀，那我先去干活。",inspect:["这个我没试过，你测测看？","编号不认识。我只知道它能不能动。"],special:"旧的也有旧的好嘛，修修还能陪人很久。"}}],ni=s=>wi.find(t=>t.id===s),_m=[["风从旧站台吹来","灰线旧货铺重新亮灯了。先做一笔踏实的生意，让这间屋子慢慢热闹起来。"],["有人记住了你的招牌","商队带来了新的消息。注意今日行情，手里的旧物，也许正是别人缺少的东西。"],["第一张租金单","今晚需支付 90 票租金。别把所有现金压在货架上；门口的社区委托也能帮上忙。"],["沙尘里的午后","午后有一场小沙尘，来客会带着满身风沙。好在灯还亮着，热水也还有。"],["旧物找到了新家","聚落开始习惯来这里找东西。每一件诚实标注的商品，都让招牌多一分可信。"],["最后一班商队","商队明天清早出发。留意货架上的珍藏，路过的人，也许会愿意带它们走远一点。"],["为明天留一盏灯","七日试营业的最后一天。结清 210 票租金，留足 120 票周转金，让故事继续。"]],xm=[{name:"旧铜线",category:"repair"},{name:"搪瓷杯",category:"life"},{name:"旧站车票",category:"collect"},{name:"齿轮零件",category:"repair"},{name:"棉布手套",category:"life"},{name:"褪色明信片",category:"collect"}],kR=()=>({condition:!0,function:!0,authenticity:!0});function XR(s){let t=2166136261;for(const i of s)t=Math.imul(t^i.charCodeAt(0),16777619);return t>>>0||1}function dr(s){let t=s.rng;return t^=t<<13,t^=t>>>17,t^=t<<5,s.rng=t>>>0,s.rng/4294967296}function ys(s,t){return t[Math.floor(dr(s)*t.length)]}function As(s,t){const i=Zt(s.defId);return Math.max(5,Math.floor(i.base*s.condition*s.function*s.authenticity*t[i.category]+.5+1e-9))}function ef(s,t){const i=Zt(s.defId),o=i.base*(s.revealed.condition?s.condition:s.claimed.condition)*(s.revealed.function?s.function:s.claimed.function)*(s.revealed.authenticity?s.authenticity:s.claimed.authenticity)*t[i.category],l=Object.values(s.revealed).every(Boolean);return{center:o,exact:l,low:Math.max(5,Math.floor(o*.7+.5)),high:Math.max(5,Math.floor(o*1.3+.5)),price:As(s,t)}}function Rs(s){var t;return((t=s.trade)==null?void 0:t.role)==="seller"?s.trade.item:s.inventory.find(i=>{var o;return i.uid===((o=s.trade)==null?void 0:o.selected)})}function tf(s){const t=Array(8).fill(void 0),i=[];for(const o of s.filter(l=>l.displayed)){const l=o.displaySlot;l!==void 0&&Number.isInteger(l)&&l>=0&&l<8&&!t[l]?t[l]=o:i.push(o)}for(const o of i){const l=t.findIndex(u=>!u);l>=0&&(t[l]=o)}return t}function Vl(s){if(!s.trade||s.trade.role!=="buyer")return[];const t=ni(s.trade.npc);return s.inventory.filter(i=>i.displayed&&Zt(i.defId).category===s.trade.category&&(i.revealed.authenticity||i.riskLabel&&t.risk))}function cS(s,t){if(!s.trade)return 0;const i=ni(s.trade.npc),o=As(t,s.market);return s.trade.role==="seller"?Math.ceil(o*i.floor-1e-9):Math.floor(o*i.budget*(t.revealed.authenticity?1:.8)+1e-9)}const uS=s=>`${String(10+Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`,cf=s=>s===3?90:s===7?210:0,fn=s=>360-s.minute;function nf(s){var t;return(t=s.trade)!=null&&t.locked?fn(s)<6?"剩余营业时间不足 6 分钟":s.trade.role==="seller"&&s.cash<s.trade.price?"现金不足，不能完成收购":s.trade.role==="seller"&&s.inventory.length>=12?"库存已满，需要一个空格":Rs(s)?"":"商品已不在柜台":"请先谈定价格"}function Mo(s,t,i,o,l,u=0,h=!1){return{uid:`item-${s.nextId++}`,defId:t,condition:i,function:o,authenticity:l,cost:u,displayed:h,riskLabel:!1,listPrice:0,claimed:{condition:.9,function:1,authenticity:1},revealed:h?kR():{condition:!1,function:!1,authenticity:!1}}}function fS(s){s.minute=0,s.cursor=0,s.trade=null,s.report=null,s.phase="open",s.commission="available",s.sorted=[],s.recycled=0,s.inspection=null;const t=[1.15,1,.85];for(let l=t.length-1;l>0;l--){const u=Math.floor(dr(s)*(l+1));[t[l],t[u]]=[t[u],t[l]]}s.market=s.day===1?{repair:1,life:1,collect:1}:{repair:t[0],life:t[1],collect:t[2]};const i=wi.flatMap(l=>[l.id,l.id]);s.queue=[];const o=s.day===1?["lin","tao","zhou"]:[];for(const l of o)s.queue.push(l),i.splice(i.indexOf(l),1);for(;s.queue.length<(s.day===1?6:8);){const l=Math.floor(dr(s)*i.length);s.queue.push(i.splice(l,1)[0])}s.notice=s.day===1?"瓶盖门铃响了。第一位客人已经等在门边。":`第 ${s.day} 天，开门营业。今日行情已更新。`}function Ku(s="TUTORIAL-001"){const t={version:1,seed:s,rng:XR(s),day:1,minute:0,cash:180,reputation:50,sold:0,phase:"open",inventory:[],market:{repair:1,life:1,collect:1},queue:[],cursor:0,trade:null,ledger:[],report:null,commission:"available",sorted:[],recycled:0,inspection:null,discovered:["I01","I05","I06"],notice:"",nextId:1};t.inventory=[Mo(t,"I01",.8,1,1,25,!0),Mo(t,"I05",.75,1,1,35,!0),Mo(t,"I06",.9,1,1,55,!0)];for(const[i,o]of t.inventory.entries())o.listPrice=Math.round(As(o,t.market)*1.1),o.displaySlot=i;return fS(t),t}function Ul(s,t,i,o,l,u){s.cash+=o,s.ledger.push({id:s.nextId++,day:s.day,minute:s.minute,kind:t,label:i,amount:o,cost:l,risk:u})}function un(s,t){return s.notice=t,s}function Gu(s,t){return s.trade=null,s.inspection=null,s.cursor++,(s.minute>=360||s.cursor>=s.queue.length)&&(s.phase="closing"),un(s,t)}function ry(s,t,i){return s.replaceAll("{item}",t).replaceAll("{category}",vi[i].name)}function oy(s,t){const i=s.trade,o=Vl(s).find(l=>l.uid===t);!o||i.locked||(i.selected=t,i.price=i.offers[t]??Math.floor(cS(s,o)*.78),i.offers[t]=i.price)}function ym(s,t){const i=Rs(s);if(!i||!s.trade||s.trade.offended)return!1;const o=s.trade.role==="seller"?Math.min(t,s.trade.price):Math.max(t,s.trade.price),l=ef(i,s.market).center;return s.trade.role==="seller"?o<l*.35:o>l*1.8}function Ep(s,t){var o,l,u,h,p,m,g,x,v,S,E,b;const i=structuredClone(s);if(i.phase==="ending")return s;if(t.type==="BACK")return i.phase==="closing"&&i.minute<360&&(i.phase="open"),i;if(t.type==="NEXT")return i.phase!=="report"?s:i.outcome||i.day===7?(i.phase="ending",i):(i.day++,fS(i),i);if(t.type==="SETTLE"){if(i.phase!=="closing")return s;if(i.inspection||i.commission==="active")return un(i,"请先完成进行中的鉴定或委托。");i.trade&&Gu(i,"打烊了，客人向你道别。");const T=i.ledger.filter(_=>_.day===i.day),M={day:i.day,income:T.filter(_=>_.amount>0).reduce((_,L)=>_+L.amount,0),purchases:-T.filter(_=>_.kind==="purchase").reduce((_,L)=>_+L.amount,0),gross:T.filter(_=>_.kind==="sale").reduce((_,L)=>_+L.amount-(L.cost??0),0),fees:0,cash:i.cash,missing:0};for(const[_,L,z]of[["supplies","每日耗材",15],["rent",`第 ${i.day} 天租金`,cf(i.day)]])if(z){if(i.cash<z){M.missing=z-i.cash,i.outcome="bankrupt";break}Ul(i,_,L,-z),M.fees+=z}return M.cash=i.cash,i.report=M,!i.outcome&&i.day===7&&(i.outcome=i.cash>=120&&i.reputation>=40&&i.sold>=12?"win":"survive"),i.phase="report",i}if(i.phase!=="open")return s;if(t.type==="CLOSE")return i.inspection||i.commission==="active"?un(i,"先完成手头的鉴定或分拣，再打烊吧。"):(i.phase="closing",i);if(t.type==="ARRIVE"){if(i.trade||i.inspection||i.commission==="active"||i.cursor>=i.queue.length)return s;if(fn(i)<6)return un(i,"剩余时间不足以接待新客人，可以打烊了。");i.minute+=6;const T=ni(i.queue[i.cursor]),M=i.cursor%2===0?"seller":"buyer",_=i.queue.slice(0,i.cursor).includes(T.id);i.trade={id:`trade-${i.nextId++}`,npc:T.id,role:M,category:ys(i,T.preferences),price:0,rounds:0,locked:!1,offended:!1,offers:{},line:"",repeat:_};const L=i.trade;if(M==="seller"){let N;if(i.day===1&&i.cursor===0)N=Mo(i,"I07",.9,1,1);else if(i.day===1&&i.cursor===2)N=Mo(i,"I02",.8,.6,1),N.claimed.condition=1;else{const V=ys(i,Hn),H=dr(i),I=H<.7?1:H<.9||!V.imitation?.65:.3,Y=dr(i),U=Y<.1?.5:Y<.3?.75:Y<.6?.8:Y<.85?.9:1;N=Mo(i,V.id,U,dr(i)<.8?1:.6,I)}L.item=N,L.category=Zt(N.defId).category,L.price=Math.ceil(As(N,i.market)*T.ask-1e-9),L.line=ry(ys(i,T.lines.sell),Zt(N.defId).name,L.category),i.discovered.includes(N.defId)||i.discovered.push(N.defId)}else{const N=i.inventory.filter(H=>H.displayed&&(H.revealed.authenticity||T.risk&&H.riskLabel));L.category=i.day===1&&i.cursor===1?"life":N.length&&dr(i)<.7?Zt(ys(i,N).defId).category:ys(i,Object.keys(vi)),L.line=ry(ys(i,T.lines.buy),"",L.category);const V=Vl(i);V.length&&oy(i,V[0].uid)}const z=_?ys(i,T.lines.revisit):i.day===1?T.lines.intro:"";return un(i,z||L.line)}if(t.type==="SELECT")return((o=i.trade)==null?void 0:o.role)==="buyer"&&!i.inspection&&oy(i,t.uid),i;if(t.type==="START_CHECK"){if(i.inspection||i.commission==="active"||(l=i.trade)!=null&&l.locked)return s;const T=((h=(u=i.trade)==null?void 0:u.item)==null?void 0:h.uid)===t.uid?i.trade.item:i.inventory.find(M=>M.uid===t.uid);return!T||T.revealed[t.check]?s:fn(i)<bs[t.check].minutes?un(i,"营业时间不足，无法开始这项检查。"):(i.minute+=bs[t.check].minutes,i.trade&&(i.trade.line=ni(i.trade.npc).lines.inspect[t.check==="authenticity"?1:0]),i.inspection={uid:T.uid,check:t.check,progress:0},i)}if(t.type==="CHECK_STEP"){const T=i.inspection;if(!T)return s;if(T.progress++,T.progress>=(T.check==="condition"?3:1)){const M=((m=(p=i.trade)==null?void 0:p.item)==null?void 0:m.uid)===T.uid?i.trade.item:i.inventory.find(_=>_.uid===T.uid);return M&&(M.revealed[T.check]=!0),i.inspection=null,i.minute>=360&&(i.phase="closing"),un(i,`${bs[T.check].name}完成。证据已记入物品档案。`)}return i}if(t.type==="OFFER"||t.type==="ACCEPT"){const T=i.trade,M=Rs(i);if(!T||!M||T.locked||i.inspection||T.rounds>=3)return s;if(fn(i)<10)return un(i,"报价和交割共需至少 10 分钟。");const _=t.type==="ACCEPT"?T.price:t.price;if(!Number.isFinite(_)||_<1||!Number.isInteger(_))return un(i,"请输入大于零的整数价格。");const L=T.role==="seller"?Math.min(_,T.price):Math.max(_,T.price);if(t.type==="OFFER"&&ym(i,L)&&!t.acknowledge)return s;t.type==="OFFER"&&ym(i,L)&&(i.reputation=Math.max(0,i.reputation-2),T.offended=!0),i.minute+=4,T.rounds++;const z=cS(i,M),N=ni(T.npc);return t.type==="ACCEPT"||(T.role==="seller"?L>=z:L<=z)?(T.price=L,T.locked=!0,T.line="价钱谈妥了。确认交割后，票子和旧物才会易手。",un(i,`双方同意 ${L} 票。请确认交割。`)):T.rounds===3?Gu(i,`${N.name}：${N.lines.refuse[0]}（三轮报价结束）`):(T.price=T.role==="seller"?Math.ceil((T.price+z)/2):Math.floor((T.price+z)/2),T.selected&&(T.offers[T.selected]=T.price),T.line=N.lines.counter[T.rounds-1],un(i,`${N.name}还价 ${T.price} 票。`))}if(t.type==="DELIVER"){const T=i.trade;if(!T||T.id!==t.tradeId||!T.locked)return s;const M=nf(i);if(M)return un(i,M);const _=Rs(i),L=Zt(_.defId).name;i.minute+=6,T.role==="seller"?(_.cost=T.price,_.listPrice=Math.round(As(_,i.market)*1.1),_.displayed=!1,i.inventory.push(_),Ul(i,"purchase",`收购 · ${L}`,-T.price)):(i.inventory=i.inventory.filter(N=>N.uid!==_.uid),i.sold++,Object.values(_.revealed).every(Boolean)&&(i.reputation=Math.min(100,i.reputation+1)),Ul(i,"sale",`出售 · ${L}`,T.price,_.cost,!_.revealed.authenticity));const z=`${ni(T.npc).name}：${ys(i,ni(T.npc).lines.deal)}`;return Gu(i,z)}if(t.type==="DISMISS"){if(!i.trade||i.inspection)return s;const T=ni(i.trade.npc).name;return i.minute=Math.min(360,i.minute+2),Gu(i,`${T}收好行囊，向你道别。没有成交，也没有信誉损失。`)}if(t.type==="DISPLAY"||t.type==="PLACE"){const T=i.inventory.find(z=>z.uid===t.uid);if(!T||((g=i.trade)==null?void 0:g.selected)===T.uid||((x=i.inspection)==null?void 0:x.uid)===T.uid)return s;const M=tf(i.inventory),_=t.type==="PLACE"?t.slot:T.displayed?null:M.findIndex(z=>!z);if(_!==null&&(!Number.isInteger(_)||_<0||_>=8))return un(i,"8 个陈列位已满，请先撤下一件商品。");const L=_===null?void 0:M[_];if(L&&(((v=i.trade)==null?void 0:v.selected)===L.uid||((S=i.inspection)==null?void 0:S.uid)===L.uid))return un(i,"这件旧物正在交易或检查中，暂时不能移动。");if(_!==null&&!T.revealed.authenticity&&!t.riskLabel)return un(i,"请先核验编号，或明确使用“未核验”标签。");for(const[z,N]of M.entries())N&&(N.displaySlot=z);if(_===null)return T.displayed=!1,delete T.displaySlot,un(i,"已移回仓库。");if(L&&L.uid!==T.uid){const z=M.findIndex(N=>(N==null?void 0:N.uid)===T.uid);z>=0?L.displaySlot=z:(L.displayed=!1,delete L.displaySlot)}return T.riskLabel=!T.revealed.authenticity,T.displayed=!0,T.displaySlot=_,un(i,`已放入 ${_+1} 号陈列格${T.riskLabel?"，标签：未核验":"，标签与已知属性一致"}。`)}if(t.type==="PRICE"){const T=i.inventory.find(M=>M.uid===t.uid);return T&&Number.isInteger(t.price)&&t.price>0&&((E=i.trade)==null?void 0:E.selected)!==T.uid&&(T.listPrice=t.price),i}if(t.type==="RECYCLE"){if(i.recycled>=2||fn(i)<6||i.inspection||i.commission==="active")return s;const T=i.inventory.find(_=>_.uid===t.uid);if(!T||((b=i.trade)==null?void 0:b.selected)===T.uid)return s;i.inventory=i.inventory.filter(_=>_.uid!==T.uid),i.minute+=6,i.recycled++;const M=Math.floor(As(T,i.market)*.35);return Ul(i,"recycle",`回收 · ${Zt(T.defId).name}`,M,T.cost),i.minute>=360&&(i.phase="closing"),un(i,`回收箱入账 ${M} 票。回收不计入售出成绩。`)}if(t.type==="COMMISSION")return i.trade||i.inspection||i.commission!=="available"||fn(i)<90?s:(i.minute+=90,i.commission="active",i.sorted=[],un(i,"将六件物资分入对应类别，完成可得 40 票。"));if(t.type==="SORT"||t.type==="SORT_ALL"){if(i.commission!=="active")return s;if(t.type==="SORT_ALL")i.sorted=xm.map((T,M)=>M);else{const T=xm[t.index];if(!T||T.category!==t.category)return un(i,"再想一想，这件物资更适合另一个类别。不会扣钱或信誉。");i.sorted.includes(t.index)||i.sorted.push(t.index)}return i.sorted.length===6?(i.commission="done",Ul(i,"commission","社区分拣委托",40),i.minute>=360&&(i.phase="closing"),un(i,"分拣完成！社区支付了 40 票报酬。")):i}return s}const Qu="greyline-save-v1";function dS(s){var t,i;if(!s)return null;try{let o=function(m){return!!m&&typeof m.uid=="string"&&Hn.some(g=>g.id===m.defId)&&!!m.claimed&&!!m.revealed&&p(m.condition,[.5,.75,.8,.9,1])&&p(m.function,[.6,1])&&p(m.authenticity,[.3,.65,1])&&p(m.claimed.condition,[.5,.75,.8,.9,1])&&p(m.claimed.function,[.6,1])&&p(m.claimed.authenticity,[.3,.65,1])&&["condition","function","authenticity"].every(g=>typeof m.revealed[g]=="boolean")&&h(m.cost,0)&&h(m.listPrice,0)&&typeof m.displayed=="boolean"&&(m.displaySlot===void 0||h(m.displaySlot,0,7))&&typeof m.riskLabel=="boolean"};const l=JSON.parse(s),u=["open","closing","report","ending"],h=(m,g,x=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(m)&&m>=g&&m<=x,p=(m,g)=>g.includes(m);if(l.version!==1||typeof l.seed!="string"||!h(l.day,1,7)||!u.includes(l.phase)||!h(l.cash,0)||!h(l.reputation,0,100)||!h(l.sold,0,54)||!h(l.minute,0,360)||!Array.isArray(l.inventory)||l.inventory.length>12||!l.inventory.every(o)||new Set(l.inventory.map(m=>m.uid)).size!==l.inventory.length||!Array.isArray(l.ledger)||!l.ledger.every(m=>m&&h(m.id,1)&&h(m.day,1,7)&&h(m.minute,0,360)&&Number.isSafeInteger(m.amount)&&typeof m.label=="string"&&["purchase","sale","commission","recycle","supplies","rent"].includes(m.kind)&&(m.cost===void 0||h(m.cost,0)))||!Array.isArray(l.queue)||l.queue.length!==(l.day===1?6:8)||!l.queue.every(m=>wi.some(g=>g.id===m))||!h(l.cursor,0,l.queue.length)||!l.market||!["repair","life","collect"].every(m=>p(l.market[m],[.85,1,1.15]))||!Array.isArray(l.sorted)||!l.sorted.every(m=>h(m,0,5))||new Set(l.sorted).size!==l.sorted.length||!["available","active","done"].includes(l.commission)||!h(l.recycled,0,2)||!Array.isArray(l.discovered)||!l.discovered.every(m=>Hn.some(g=>g.id===m))||!h(l.nextId,1)||!h(l.rng,0,4294967295)||typeof l.notice!="string")return null;if(l.trade){const m=l.trade;if(!wi.some(g=>g.id===m.npc)||!["seller","buyer"].includes(m.role)||!Object.hasOwn(vi,m.category)||typeof m.id!="string"||typeof m.line!="string"||typeof m.locked!="boolean"||typeof m.offended!="boolean"||!m.offers||!Object.values(m.offers).every(g=>h(g,0))||!h(m.price,0)||!h(m.rounds,0,3)||m.role==="seller"&&!o(m.item)||m.selected&&!l.inventory.some(g=>g.uid===m.selected))return null}return l.inspection&&(!Object.hasOwn(bs,l.inspection.check)||!h(l.inspection.progress,0,l.inspection.check==="condition"?2:0)||!(((i=(t=l.trade)==null?void 0:t.item)==null?void 0:i.uid)===l.inspection.uid||l.inventory.some(m=>m.uid===l.inspection.uid)))||l.outcome&&!["win","survive","bankrupt"].includes(l.outcome)||l.report&&!["day","income","purchases","gross","fees","cash","missing"].every(m=>Number.isSafeInteger(l.report[m]))||l.phase==="report"&&!l.report||l.phase==="ending"&&!l.outcome?null:l}catch{return null}}const qR={uniforms:{tDiffuse:{value:null},time:{value:0},texel:{value:new pt(.001,.001)}},vertexShader:"varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",fragmentShader:`uniform sampler2D tDiffuse; uniform float time; uniform vec2 texel; varying vec2 vUv;
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
    }`};function YR(s){const t=ze.useRef(null),i=ze.useRef(new Map),o=ze.useRef(s);o.current=s;const[l,u]=ze.useState(!1);return ze.useEffect(()=>{const h=t.current;if(!h)return;let p;try{p=new OR({antialias:!1,alpha:!1,powerPreference:"low-power"})}catch{u(!0);return}let m=!1;p.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),p.outputColorSpace=ti,p.toneMapping=bm,p.toneMappingExposure=1.12,p.setClearColor("#262a23"),p.domElement.setAttribute("aria-label","HD-2D 灰线旧货铺场景，人物与旧物立于暖光柜台前"),p.domElement.setAttribute("role","img"),h.appendChild(p.domElement);const g=new OT,x=new of(-8,8,4.5,-4.5,.1,60);x.position.set(0,0,18),x.lookAt(0,0,0);const v=new XT,S=[];function E(Me){const it=v.load(Me,void 0,void 0,()=>{m||u(!0)});return it.colorSpace=ti,it.magFilter=Li,it.minFilter=Xi,S.push(it),it}const b=E(Ts("art/shop.png")),T=E(Ts("art/characters.png")),M=E(Ts("art/items.png"));function _(Me,it,At,P,C,se){const pe=new Yl(Me,it),xe=new gi(pe,At);return xe.position.set(P,C,se),g.add(xe),S.push(pe,At),xe}_(16.35,9.2,new So({map:b}),0,0,-3);const L=b.clone();L.repeat.set(1,.22),L.offset.set(0,0),S.push(L),_(16.35,9.2*.22,new So({map:L,transparent:!1}),0,-9.2*.39,2),g.add(new KT("#ffe2b9",2.3));const z=new ZT("#ffe0a3",2.1);z.position.set(-7,4,6),g.add(z);const N=new YT("#ffad48",18,9,2);N.position.set(5.6,-1.6,4),g.add(N);const V=T.clone();V.repeat.set(1/6,1),S.push(V);const H=_(4.7,9.4,new hp({map:V,transparent:!0,alphaTest:.18,roughness:1,metalness:0,side:ca}),-2.5,-1.3,.4),I=new gi(new Om(1.25,32),new So({color:"#1a100a",transparent:!0,opacity:.25,depthWrite:!1}));I.scale.y=.16,I.position.set(-2.5,-3.3,.35),g.add(I),S.push(I.geometry,I.material);const Y=[],U=[];for(let Me=0;Me<9;Me++){const it=M.clone();it.repeat.set(.25,1/3),S.push(it),U.push(it);const At=new hp({map:it,transparent:!0,alphaTest:.12,roughness:.9,metalness:.05}),P=_(Me===8?2.1:.93,Me===8?2.1:.93,At,Me===8?.6:.85+Me%4*1.02,Me===8?-2.45:Me<4?1.24:-.46,Me===8?2.1:-2.4);Y.push(P)}const R=new hp({color:"#b8813f",metalness:.75,roughness:.4}),G=new gi(new Do(7,.022,.08),R);G.position.set(.2,-3.43,2.2),g.add(G),S.push(G.geometry,R);const ie=new Zi,ue=55,Z=new Float32Array(ue*3);for(let Me=0;Me<ue;Me++)Z[Me*3]=Math.sin(Me*79.31)*8,Z[Me*3+1]=Math.cos(Me*33.1)*4.5,Z[Me*3+2]=Math.sin(Me)*2;ie.setAttribute("position",new Wi(Z,3));const B=new Ky({color:"#ffdf9c",size:.025,transparent:!0,opacity:.42,depthWrite:!1}),O=new BT(ie,B);g.add(O),S.push(ie,B);const k=new FR(p);k.addPass(new HR(g,x));const X=new Ro(new pt(800,450),.19,.45,.85);k.addPass(X);const ve=new rS(qR);k.addPass(ve);const _e=new GR;k.addPass(_e);let He=0,$e=0;function xt(){He=h.clientWidth,$e=h.clientHeight,p.setSize(He,$e),k.setSize(He,$e);const Me=He/$e,it=Me>16/9?8:4.5*Me,At=Me>16/9?8/Me:4.5;x.left=-it,x.right=it,x.top=At,x.bottom=-At,x.updateProjectionMatrix(),ve.uniforms.texel.value.set(1/He,1/$e)}const j=new ResizeObserver(xt);j.observe(h),xt();let de=0,$=0;function oe(Me){const it=h.getBoundingClientRect();de=(Me.clientX-it.left)/it.width-.5,$=(Me.clientY-it.top)/it.height-.5}function Ee(){de=0,$=0}h.addEventListener("pointermove",oe),h.addEventListener("pointerleave",Ee);const Le=new eS,Ae=H.material;let Te=0,Xe=0,D=null,Ce=!1,Ve=null;const Qe=Array(9).fill(""),Be=Array(9).fill(-2);function lt(){if(Te=requestAnimationFrame(lt),document.hidden||o.current.suspended){Xe=Le.getElapsedTime();return}const Me=o.current,it=Le.getElapsedTime();if(it-Xe<1/30)return;const At=Math.min(.05,it-Xe);Xe=it;const P=1-Math.exp(-At*7);if(B.opacity=Me.day===4?.58:.35,Me.reducedMotion)D=Me.npc,Ce=Me.active,Ve=null,Ae.opacity=1;else if(Me.npc!==D||Ve!==null){if(D){Ve??(Ve=it);const De=Math.min(1,(it-Ve)/.46);H.position.x+=(-7-H.position.x)*P,Ae.opacity=1-De,De>=1&&(D=null,Ve=null)}!D&&Me.npc&&(D=Me.npc,Ce=Me.active,H.position.set(-6.4,-.58,-.3),H.scale.setScalar(.64),Ae.opacity=0)}D===Me.npc&&Ve===null&&(Ce=Me.active),H.visible=!!D,I.visible=!!D,V.offset.set((D?ni(D).sprite:0)/6,0);const C=Ce?-2.7:-4,se=Ce?-1.3:-.58,pe=Ce?Math.min(1,(x.top+1.2)/4.7):Math.min(.64,(x.top+.5)/4.7);if(Ve===null){const De=Me.reducedMotion?1:P;H.position.x+=(C-H.position.x)*De,H.position.y+=(se-H.position.y)*De,H.position.z+=((Ce?.6:-.3)-H.position.z)*De,H.scale.setScalar(H.scale.x+(pe-H.scale.x)*De),Ae.opacity+=(1-Ae.opacity)*De}const xe=Math.abs(H.position.x-C)>.08;H.rotation.z=Me.reducedMotion?0:Math.sin(it*(xe?11:1.8))*(xe?.012:.002),Me.reducedMotion||(H.position.y+=Math.sin(it*(xe?11:2))*(xe?.006:.001)),h.dataset.actorState=Ve!==null?"leaving":D?xe?"entering":Ce?"counter":"waiting":"empty",I.position.x=H.position.x;const he=tf(Me.inventory);for(let De=0;De<9;De++){const Ye=De===8?Me.item:he[De],Se=Y[De];if(Se.visible=!!Ye,Ye){Qe[De]!==Ye.uid&&(Qe[De]=Ye.uid,Be[De]=it);const Ue=lS(Zt(Ye.defId).sprite);U[De].repeat.set(Ue.w/1448,Ue.h/1086),U[De].offset.set(Ue.x/1448,1-(Ue.y+Ue.h)/1086);const at=Math.max(Ue.w,Ue.h),Oe=1-(1-(Me.reducedMotion?1:Math.min(1,(it-Be[De])/.45)))**3;Se.scale.set(Ue.w/at*(.8+Oe*.2),Ue.h/at*(.8+Oe*.2),1),Se.position.y=(De===8?-2.45:De<4?1.24:-.46)+(1-Oe)*.28,De===8&&(Se.position.x=.6-(1-Oe)*.8)}else Qe[De]=""}const Ze=Me.minute/360;p.toneMappingExposure=1.1-Ze*.15,N.intensity=18+(Me.reducedMotion?0:Math.sin(it*3)*.5);const Ne=He/$e<1.1?-2.1:0;Me.reducedMotion?(x.position.set(Ne,0,18),x.lookAt(Ne,0,0)):(x.position.x+=(Ne+de*.2-x.position.x)*.025,x.position.y+=(-$*.12-x.position.y)*.025,x.lookAt(Ne,0,0),O.position.y=it*.025%3,O.position.x=Math.sin(it*.08)*.2),ve.uniforms.time.value=Me.reducedMotion?0:it,k.render();for(const[De,Ye]of he.entries()){if(!Ye)continue;const Se=i.current.get(Ye.uid);if(!Se)continue;const Ue=Y[De],at=Ue.getWorldPosition(new ae).project(x),Je=Ue.localToWorld(new ae(.465,.465,0)).project(x),Oe=(at.x+1)*He/2,ft=(1-at.y)*$e/2,W=Math.max(48,Math.abs(Je.x-at.x)*He+12),we=Math.max(48,Math.abs(Je.y-at.y)*$e+12);Se.style.left=`${Oe}px`,Se.style.top=`${ft}px`,Se.style.width=`${W}px`,Se.style.height=`${we}px`,Se.style.visibility=Oe>0&&Oe<He&&ft>0&&ft<$e?"visible":"hidden"}}lt();const ke=Me=>{Me.preventDefault(),m||u(!0)};return p.domElement.addEventListener("webglcontextlost",ke),()=>{m=!0,cancelAnimationFrame(Te),j.disconnect(),h.removeEventListener("pointermove",oe),h.removeEventListener("pointerleave",Ee),p.domElement.removeEventListener("webglcontextlost",ke);for(const Me of S)Me.dispose();k.dispose(),X.dispose(),ve.dispose(),_e.dispose(),p.dispose(),p.domElement.remove()}},[]),d.jsxs("div",{ref:t,className:`shop-render ${l?"fallback":""}`,children:[d.jsx("div",{className:"scene-object-targets","aria-label":"店内可拿取的旧物",children:tf(s.inventory).map((h,p)=>h&&d.jsxs("button",{ref:m=>{m?i.current.set(h.uid,m):i.current.delete(h.uid)},className:"scene-item-target","data-testid":`scene-item-${p}`,"aria-label":`拿起陈列旧物 ${Zt(h.defId).name}`,disabled:s.suspended,onClick:()=>s.onItemSelect(h.uid),style:l?{left:`${55+p%4*6}%`,top:p<4?"36%":"55%",width:"7%",height:"12%",visibility:"visible"}:void 0,children:[d.jsxs("span",{children:[Zt(h.defId).name,d.jsx("small",{children:"拿到桌面细看"})]}),d.jsx("i",{"aria-hidden":"true",children:"＋"})]},h.uid))}),l&&d.jsxs(d.Fragment,{children:[d.jsx("div",{className:"fallback-room"}),s.npc&&d.jsx("div",{className:"fallback-person",style:{backgroundPositionX:`${ni(s.npc).sprite*20}%`}}),s.item&&d.jsx("div",{className:"fallback-item item-sprite",style:{backgroundPosition:`${Zt(s.item.defId).sprite%4*100/3}% ${Math.floor(Zt(s.item.defId).sprite/4)*50}%`}})]})]})}var WR=dy();const ZR={watch:0,purse:1,keys:2,seal:3,inspect:4,notes:5,deal:6,refuse:7};function Ln({name:s,className:t=""}){const i=ZR[s];return d.jsx("span",{className:`painted-icon painted-${s} ${t}`,"aria-hidden":"true",children:d.jsx("svg",{viewBox:`${i%4*256} ${Math.floor(i/4)*256} 256 256`,children:d.jsx("image",{href:Ts("art/ui-icons.png"),width:"1024",height:"512",preserveAspectRatio:"none"})})})}function af({className:s=""}){return d.jsxs("svg",{className:`rail-crest ${s}`,viewBox:"0 0 100 72",fill:"none","aria-hidden":"true",children:[d.jsx("path",{d:"M9 26h24m-20 7h18m-12 7h11M91 26H67m20 7H69m12 7H70",stroke:"currentColor",strokeWidth:"2"}),d.jsx("path",{d:"M50 5 70 17v29L50 62 30 46V17Z",stroke:"currentColor",strokeWidth:"1.6"}),d.jsx("path",{d:"M50 11 64 20v23L50 55 36 43V20Z",fill:"currentColor",opacity:".12"}),d.jsx("path",{d:"M41 41V26h18v15M39 30h22M44 22h12M47 35h6m-12 6h18m-14 1-4 7m14-7 4 7",stroke:"currentColor",strokeWidth:"2"}),d.jsx("path",{d:"M22 54c8 6 17 10 28 13 11-3 20-7 28-13M25 51l-7-1 2 7m55-6 7-1-2 7",stroke:"currentColor",strokeWidth:"1"}),d.jsx("circle",{cx:"50",cy:"5",r:"2.2",fill:"currentColor"})]})}function Fm({className:s=""}){return d.jsxs("svg",{className:`flourish ${s}`,viewBox:"0 0 240 22",fill:"none","aria-hidden":"true",children:[d.jsx("path",{d:"M8 11h75c9 0 12-9 4-9-6 0-5 10 3 10h18m124-1h-75c-9 0-12-9-4-9 6 0 5 10-3 10h-18",stroke:"currentColor",strokeWidth:".8"}),d.jsx("path",{d:"m120 4 7 7-7 7-7-7Z",stroke:"currentColor"}),d.jsx("path",{d:"m120 8 3 3-3 3-3-3Z",fill:"currentColor"}),d.jsx("circle",{cx:"7",cy:"11",r:"1.5",fill:"currentColor"}),d.jsx("circle",{cx:"233",cy:"11",r:"1.5",fill:"currentColor"})]})}function KR({minute:s}){return d.jsxs("svg",{viewBox:"0 0 100 100",className:"station-clock","aria-hidden":"true",children:[d.jsx("defs",{children:d.jsxs("radialGradient",{id:"clock-brass",children:[d.jsx("stop",{stopColor:"#f2d68e"}),d.jsx("stop",{offset:".7",stopColor:"#ab7536"}),d.jsx("stop",{offset:"1",stopColor:"#594021"})]})}),d.jsx("circle",{cx:"50",cy:"50",r:"48",fill:"url(#clock-brass)",stroke:"#f0d798",strokeWidth:"1"}),d.jsx("circle",{cx:"50",cy:"50",r:"40",fill:"#e8d7aa",stroke:"#473a28",strokeWidth:"2"}),d.jsx("circle",{cx:"50",cy:"50",r:"35",fill:"none",stroke:"#b29a68",strokeWidth:".5"}),Array.from({length:12},(t,i)=>d.jsx("line",{x1:"50",y1:"15",x2:"50",y2:i%3===0?22:19,transform:`rotate(${i*30} 50 50)`,stroke:"#55432a",strokeWidth:i%3===0?2:1},i)),d.jsx("path",{d:"M50 54V28",stroke:"#493823",strokeWidth:"3",strokeLinecap:"round",transform:`rotate(${(600+s)*.5} 50 50)`}),d.jsx("path",{d:"M50 55V20",stroke:"#8f4636",strokeWidth:"2",strokeLinecap:"round",transform:`rotate(${s*6} 50 50)`}),d.jsx("circle",{cx:"50",cy:"50",r:"3",fill:"#9b783c"})]})}function QR(){return d.jsx("span",{className:"painted-dialogue","aria-hidden":"true",children:[["frame-left","0 0 650 724"],["frame-middle","650 0 1000 724"],["frame-right","1650 0 522 724"]].map(([s,t])=>d.jsx("svg",{className:s,viewBox:t,preserveAspectRatio:"none",children:d.jsx("image",{href:Ts("art/frame-dialogue.png"),width:"2172",height:"724"})},s))})}function JR({row:s=0}){return d.jsx("span",{className:"document-header-art","aria-hidden":"true",children:[[0,250],[250,275],[525,204],[729,275],[1004,250]].map(([t,i])=>d.jsx("svg",{viewBox:`${t} ${s*313.5} ${i} 313.5`,preserveAspectRatio:"none",children:d.jsx("image",{href:Ts("art/frame-actions.png"),width:"1254",height:"1254"})},t))})}function Ll({frame:s,className:t=""}){const i=ze.useId(),o=s%3*512,l=Math.floor(s/3)*512;return d.jsx("span",{className:`commission-sprite ${t}`,"aria-hidden":"true",children:d.jsxs("svg",{viewBox:`${o} ${l} 512 512`,children:[d.jsx("defs",{children:d.jsx("clipPath",{id:i,children:d.jsx("rect",{x:o,y:l,width:"512",height:"512"})})}),d.jsx("image",{href:Ts("art/commission.png"),width:"1536",height:"1536",preserveAspectRatio:"none",clipPath:`url(#${i})`})]})})}const ly=[{check:"condition",label:"取用放大镜",name:"放大镜",icon:"inspect"},{check:"function",label:"取用测试器",name:"测试器",icon:"watch"},{check:"authenticity",label:"取用编号册",name:"编号册",icon:"notes"}],Ol={x:0,y:0,angle:0,zoom:1};function $R({item:s,art:t,markers:i,available:o,onTool:l}){const u=ze.useId(),h=ze.useRef(null),p=ze.useRef(null),m=ze.useRef(!1),[g,x]=ze.useState(Ol),[v,S]=ze.useState(!1),[E,b]=ze.useState(!1),[T,M]=ze.useState(!1),[_,L]=ze.useState(null),[z,N]=ze.useState("轻触拿起 · 拖动调整位置"),V=Zt(s.defId);function H(Z,B){var k;const O=(k=h.current)==null?void 0:k.getBoundingClientRect();return{x:Math.max(-((O==null?void 0:O.width)??400)*.23,Math.min(((O==null?void 0:O.width)??400)*.23,Z)),y:Math.max(-((O==null?void 0:O.height)??500)*.3,Math.min(((O==null?void 0:O.height)??500)*.45,B))}}function I(Z,B){var O;for(const k of((O=h.current)==null?void 0:O.querySelectorAll("[data-workbench-check]"))??[]){const X=k.getBoundingClientRect(),ve=k.dataset.workbenchCheck;if(Z>=X.left&&Z<=X.right&&B>=X.top&&B<=X.bottom&&o(ve))return ve}return null}function Y(Z){Z.button!==0||p.current||(Z.currentTarget.focus(),m.current=!1,Z.currentTarget.setPointerCapture(Z.pointerId),p.current={pointer:Z.pointerId,x:Z.clientX,y:Z.clientY,startX:g.x,startY:g.y,moved:!1},b(!0),M(!0),N("拿稳了 · 可拖到下方工具上开始检查"))}function U(Z){const B=p.current;if(!B||B.pointer!==Z.pointerId)return;const O=Z.clientX-B.x,k=Z.clientY-B.y;B.moved||(B.moved=Math.hypot(O,k)>5);const X=H(B.startX+O,B.startY+k);x(ve=>({...ve,...X})),L(I(Z.clientX,Z.clientY))}function R(Z,B=!1){const O=p.current;if(!O||O.pointer!==Z.pointerId)return;p.current=null,m.current=O.moved,M(!1),L(null),Z.currentTarget.hasPointerCapture(Z.pointerId)&&Z.currentTarget.releasePointerCapture(Z.pointerId);const k=B?null:I(Z.clientX,Z.clientY);k?(x(Ol),S(k==="authenticity"),b(!1),N(`已放到${ly.find(X=>X.check===k).name}旁`),l(k)):N(B?"已放稳 · 可继续查看":"已放在桌面 · 位置可自由调整")}function G(Z){x(B=>({...B,zoom:Math.max(.7,Math.min(1.6,Math.round((B.zoom+Z)*10)/10))}))}function ie(){S(Z=>!Z),N(v?"正面 · 查看使用痕迹":"翻到背面 · 查看铭牌与来路记录")}const ue={"--object-x":`${g.x}px`,"--object-y":`${g.y}px`,"--object-angle":`${g.angle}deg`,"--object-zoom":g.zoom};return d.jsxs("div",{ref:h,className:`workbench-interaction ${T?"object-dragging":""}`,children:[d.jsxs("div",{className:"object-handling-bar","aria-label":"旧物操作",children:[d.jsxs("span",{children:[d.jsx(gE,{size:14})," 拿起 · 细看"]}),d.jsxs("div",{children:[d.jsx("button",{"aria-label":"缩小物品",disabled:g.zoom<=.7,onClick:()=>G(-.1),children:d.jsx(Em,{size:16})}),d.jsxs("output",{"aria-label":"物品缩放",children:[Math.round(g.zoom*100),"%"]}),d.jsx("button",{"aria-label":"放大物品",disabled:g.zoom>=1.6,onClick:()=>G(.1),children:d.jsx(_y,{size:16})})]})]}),d.jsxs("div",{className:`object-movement ${E?"object-held":""} ${v?"object-reversed":""}`,style:ue,"data-testid":"movable-object","data-side":v?"back":"front",children:[d.jsxs("button",{className:"object-grip","aria-label":`拿起${V.name}`,"aria-pressed":E,"aria-describedby":`${u}-keys`,onClick:()=>{if(m.current){m.current=!1;return}b(Z=>!Z),N("方向键移动 · R 旋转 · F 翻面 · 加减号缩放")},onPointerDown:Y,onPointerMove:U,onPointerUp:Z=>R(Z),onPointerCancel:Z=>R(Z,!0),onLostPointerCapture:Z=>R(Z,!0),onKeyDown:Z=>{const B={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]};if(B[Z.key]){Z.preventDefault();const[O,k]=B[Z.key];x(X=>({...X,...H(X.x+O,X.y+k)}))}else Z.key.toLowerCase()==="r"?(Z.preventDefault(),x(O=>({...O,angle:O.angle+15}))):Z.key.toLowerCase()==="f"?(Z.preventDefault(),ie()):Z.key==="+"||Z.key==="="?(Z.preventDefault(),G(.1)):Z.key==="-"?(Z.preventDefault(),G(-.1)):Z.key==="Home"&&(Z.preventDefault(),x(Ol),S(!1))},children:[d.jsx("span",{className:"handled-item-art",children:t}),v&&d.jsxs("span",{className:"object-reverse-plate",children:[d.jsxs("small",{children:["底部铭牌 · ",V.id]}),d.jsx("b",{children:V.code}),d.jsx("span",{children:s.revealed.authenticity?"核验记录已收入右侧档案":"待核验 · 使用编号册读取证据"})]})]}),!v&&i]}),d.jsxs("div",{className:"object-manipulators",children:[d.jsxs("button",{onClick:()=>x(Z=>({...Z,angle:Z.angle+15})),"aria-label":"旋转物品",children:[d.jsx(xE,{size:17}),d.jsx("span",{children:"旋转"})]}),d.jsxs("button",{onClick:ie,"aria-label":v?"翻回正面":"翻到背面",children:[d.jsx(mE,{size:17}),d.jsx("span",{children:v?"正面":"背面"})]}),d.jsxs("button",{onClick:()=>{x(Ol),S(!1),b(!1),N("旧物已放回桌面原位")},"aria-label":"物品归位",children:[d.jsx(Ap,{size:17}),d.jsx("span",{children:"归位"})]})]}),d.jsx("div",{className:"physical-tools","aria-label":"桌面鉴定工具",children:ly.map(Z=>d.jsxs("button",{"aria-label":Z.label,"data-workbench-check":Z.check,"data-drop-active":_===Z.check,disabled:!o(Z.check),onClick:()=>{x(Ol),S(Z.check==="authenticity"),l(Z.check)},children:[d.jsx(Ln,{name:Z.icon}),d.jsx("span",{children:Z.name}),d.jsx("small",{children:s.revealed[Z.check]?d.jsxs(d.Fragment,{children:[d.jsx(Fa,{size:10})," 已验 · 复看"]}):`${bs[Z.check].minutes} 分钟`})]},Z.check))}),d.jsx("p",{className:"object-handling-hint","aria-live":"polite",children:z}),d.jsx("span",{id:`${u}-keys`,className:"sr-only",children:"拖动旧物；方向键移动，R 旋转，F 翻面，加减号缩放，Home 归位。也可使用桌边按钮。"})]})}function Ui({id:s,className:t=""}){const i=lS(Zt(s).sprite),o=ze.useId();return d.jsx("span",{role:"img","aria-label":Zt(s).name,className:`item-sprite ${t}`,children:d.jsxs("svg",{"aria-hidden":"true",viewBox:`${i.x} ${i.y} ${i.w} ${i.h}`,preserveAspectRatio:"xMidYMid meet",children:[d.jsx("defs",{children:d.jsx("clipPath",{id:o,children:d.jsx("rect",{x:i.x,y:i.y,width:i.w,height:i.h})})}),d.jsx("image",{href:Ts("art/items.png"),width:"1448",height:"1086",clipPath:`url(#${o})`})]})})}function Sm({index:s,className:t=""}){return d.jsx("span",{"aria-hidden":"true",className:`portrait ${t}`,style:{backgroundPositionX:`${s*20}%`}})}function Di({amount:s}){return d.jsxs("span",{className:"money",children:[s.toLocaleString(),d.jsx("small",{children:"票"})]})}function mi({title:s,subtitle:t,children:i,onClose:o,wide:l=!1,dismissible:u=!0,appearance:h="paper"}){const p=["notice","settings","guide","receipt","ticket","permit"].includes(h),m={paper:"seal",cabinet:"keys",ledger:"notes",book:"seal",workbench:"inspect",notice:"notes",settings:"watch",guide:"keys",receipt:"notes",ticket:"seal",permit:"keys",ending:"seal"},g=ze.useRef(null),x=ze.useRef(o);return x.current=o,ze.useEffect(()=>{var E;const v=document.activeElement;(E=g.current)==null||E.focus();function S(b){var M;const T=document.querySelectorAll('[role="dialog"][aria-modal="true"]');if(T.item(T.length-1)===g.current&&(b.key==="Escape"&&u&&(b.stopPropagation(),x.current()),b.key==="Tab")){const _=Array.from(((M=g.current)==null?void 0:M.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]'))??[]).filter(N=>N.getClientRects().length>0),L=_[0],z=_[_.length-1];b.shiftKey&&(document.activeElement===L||document.activeElement===g.current)?(b.preventDefault(),z==null||z.focus()):!b.shiftKey&&document.activeElement===z&&(b.preventDefault(),L==null||L.focus())}}return document.addEventListener("keydown",S),()=>{document.removeEventListener("keydown",S),v==null||v.focus()}},[u]),d.jsx("div",{className:"modal-backdrop",onMouseDown:v=>{v.target===v.currentTarget&&u&&o()},children:d.jsxs("div",{ref:g,tabIndex:-1,role:"dialog","aria-modal":"true","aria-label":s,className:`modal modal-${h} ${l?"modal-wide":""}`,children:[d.jsxs("header",{className:"modal-heading",children:[!p&&d.jsx(JR,{row:h==="book"||h==="ending"?3:h==="ledger"?1:0}),d.jsx("span",{className:"document-emblem","aria-hidden":"true",children:d.jsx(Ln,{name:m[h]})}),d.jsxs("div",{children:[d.jsx("span",{className:"eyebrow",children:t??"GREYLINE TRADING POST"}),d.jsx("h2",{children:s})]}),u&&d.jsx("button",{className:"icon-button","aria-label":"关闭窗口",onClick:o,children:d.jsx(yy,{size:22})})]}),p&&d.jsx(Fm,{className:"document-rule"}),d.jsx("div",{className:"modal-content",children:i})]})})}function Hm({item:s,state:t}){const i=ef(s,t.market);return d.jsxs("div",{className:`valuation ${i.exact?"is-verified":""}`,children:[d.jsxs("div",{children:[d.jsx("span",{children:i.exact?"今日参考价值":"当前估值区间"}),d.jsx("span",{className:i.exact?"verified-text":"",children:i.exact?d.jsxs(d.Fragment,{children:[d.jsx(my,{size:12})," 已核验"]}):"未经完整验证"})]}),d.jsxs("strong",{children:[i.exact?i.price:`${i.low} – ${i.high}`,d.jsx("small",{children:"票"})]}),!i.exact&&d.jsx("p",{children:"检查实物，缩小信息差。故事不等于证据。"})]})}function jm({item:s}){return d.jsxs("div",{className:"evidence-list",children:[d.jsxs("div",{children:[d.jsx("span",{children:"品相"}),d.jsx("b",{className:s.revealed.condition?"":"unknown",children:s.revealed.condition?oS(s.condition):"待检查"})]}),d.jsxs("div",{children:[d.jsx("span",{children:"功能"}),d.jsx("b",{className:s.revealed.function?"":"unknown",children:s.revealed.function?s.function===1?"正常":"降级可用 · 60%":"待测试"})]}),d.jsxs("div",{children:[d.jsx("span",{children:"来源"}),d.jsx("b",{className:s.revealed.authenticity?"":"unknown",children:s.revealed.authenticity?VR(s.authenticity):"待核验"})]})]})}function ew({state:s,targetUid:t,send:i,onClose:o,assist:l}){var I,Y,U,R,G,ie,ue,Z;const[u,h]=ze.useState("condition"),[p,m]=ze.useState([]),[g,x]=ze.useState(null),[v,S]=ze.useState(""),E=((I=s.inspection)==null?void 0:I.uid)??t,b=((U=(Y=s.trade)==null?void 0:Y.item)==null?void 0:U.uid)===E?s.trade.item:s.inventory.find(B=>B.uid===E)??Rs(s),T=((R=s.inspection)==null?void 0:R.check)??u;if(ze.useEffect(()=>{m([])},[(G=s.inspection)==null?void 0:G.uid,(ie=s.inspection)==null?void 0:ie.check]),!b)return d.jsx("p",{children:"请先在货架或柜台选择一件物品。"});const M=Zt(b.defId),_=((ue=s.inspection)==null?void 0:ue.uid)===b.uid;function L(B){if(g==="condition"){S(M.appearance[B%M.appearance.length]);return}p.includes(B)||(m(O=>[...O,B]),i({type:"CHECK_STEP"}))}function z(B){if(h(B),S(""),b.revealed[B]){x(B),B==="condition"&&S("已完成外观鉴定 · 点选痕迹可重新细看，不消耗时间");return}x(null),i({type:"START_CHECK",uid:b.uid,check:B})}function N(B){var O;return!b.revealed[B]&&!s.inspection&&!((O=s.trade)!=null&&O.locked)&&s.commission!=="active"&&fn(s)>=bs[B].minutes}function V(B){var O;return N(B)||b.revealed[B]&&!s.inspection&&!((O=s.trade)!=null&&O.locked)&&s.commission!=="active"}function H(){var O;const B=T==="condition"?3-(((O=s.inspection)==null?void 0:O.progress)??0):1;for(let k=0;k<B;k++)i({type:"CHECK_STEP"})}return d.jsxs("div",{className:"inspection-layout",children:[d.jsxs("div",{className:"inspection-art",children:[d.jsx("div",{className:"workbench-grid"}),d.jsxs("div",{className:"workbench-ruler","aria-hidden":"true",children:[d.jsx("span",{children:"10"}),d.jsx("span",{children:"20"}),d.jsx("span",{children:"30"}),d.jsx("span",{children:"40"})]}),d.jsxs("span",{className:"eyebrow",children:[M.id," / INSPECTION TABLE"]}),d.jsx($R,{item:b,art:d.jsx(Ui,{id:b.defId,className:"inspection-sprite"}),available:V,onTool:z,markers:(_&&T==="condition"&&!l||g==="condition")&&d.jsx("div",{className:"hotspots",children:[0,1,2].map(B=>d.jsx("button",{disabled:g!=="condition"&&p.includes(B),className:`hotspot hotspot-${B}`,onClick:()=>L(B),"aria-label":`检查第 ${B+1} 处痕迹`,children:p.includes(B)?d.jsx(Fa,{size:17}):B+1},B))})},b.uid),(_&&T!=="condition"||g&&g!=="condition")&&d.jsxs("div",{className:"test-instrument",children:[d.jsx("span",{children:T==="function"?`${M.name} · 功能测试台`:"旧站档案 · 编号比对"}),d.jsx("strong",{children:T==="function"?"READY":M.code}),d.jsxs("button",{className:"button primary",onClick:()=>{g?(S(T==="function"?M.functionClue[b.function===1?0:1]:b.authenticity===1?M.originalClue:b.authenticity===.3?"材质和压印与原厂不同，是仿制纪念品。":M.alternateClue),x(null)):H()},children:[T==="function"?d.jsx(Vu,{size:16}):d.jsx(xy,{size:16}),g?T==="function"?"试用一次":"查阅核验记录":T==="function"?"启动检测":"与目录比对"]})]}),d.jsx("div",{className:"inspection-art-caption",children:v||(_?"检查进行中 · 已扣除耗时，退出后可继续":"轻拿轻放，每一道划痕都有来处")})]}),d.jsxs("div",{className:"inspection-info",children:[d.jsx("span",{className:"category-label",children:vi[M.category].name}),d.jsx("h3",{children:M.name}),d.jsx(Hm,{item:b,state:s}),d.jsx(jm,{item:b}),d.jsx("div",{className:"inspection-actions",children:Object.keys(bs).map(B=>{const O=bs[B],k=b.revealed[B];return d.jsxs("button",{className:`check-button ${k?"done":""} ${T===B&&_?"active":""}`,disabled:!N(B),onClick:()=>z(B),children:[d.jsxs("span",{children:[B==="condition"?d.jsx(Tp,{size:18}):B==="function"?d.jsx(Vu,{size:18}):d.jsx(bp,{size:18}),O.name]}),d.jsx("small",{children:k?d.jsx(Fa,{size:15}):`${O.minutes} 分钟`})]},B)})}),_&&T==="condition"&&d.jsxs("div",{className:"inspection-guide",children:[d.jsxs("p",{children:["点击旧物上的三处标记，查看使用痕迹。",((Z=s.inspection)==null?void 0:Z.progress)??0," / 3"]}),d.jsxs("button",{className:"text-button",onClick:H,children:["辅助完成检查 ",d.jsx(Ms,{size:14})]})]}),d.jsxs("div",{className:"clue-notes",children:[b.revealed.condition&&d.jsxs("p",{children:[d.jsx(Tp,{size:14}),M.appearance.join("；"),"。品相：",oS(b.condition),"。"]}),b.revealed.function&&d.jsxs("p",{children:[d.jsx(Vu,{size:14}),M.functionClue[b.function===1?0:1]]}),b.revealed.authenticity&&d.jsxs("p",{children:[d.jsx(bp,{size:14}),b.authenticity===1?M.originalClue:b.authenticity===.3?"材质和压印与原厂不同，是仿制纪念品。":M.alternateClue]})]}),d.jsxs("button",{className:"button secondary full",onClick:o,children:["返回柜台",_?" · 保留检查进度":""]})]})]})}function tw({state:s,send:t,inspect:i,confirm:o,initialUid:l}){var R,G,ie,ue,Z;const[u,h]=ze.useState(((R=s.inventory.find(B=>B.uid===l))==null?void 0:R.uid)??((G=s.inventory[0])==null?void 0:G.uid)??""),[p,m]=ze.useState(null),[g,x]=ze.useState(null),[v,S]=ze.useState(null),E=ze.useRef(null),b=ze.useRef(!1),T=s.inventory.find(B=>B.uid===u),M=T&&Zt(T.defId),_=T&&(((ie=s.trade)==null?void 0:ie.selected)===T.uid||((ue=s.inspection)==null?void 0:ue.uid)===T.uid),L=tf(s.inventory),z=s.inventory.find(B=>B.uid===p),N=B=>{var O,k;return((O=s.trade)==null?void 0:O.selected)!==B&&((k=s.inspection)==null?void 0:k.uid)!==B&&s.phase==="open"};function V(B,O){t({type:"PLACE",uid:B,slot:O,riskLabel:!0}),m(null),x(null),h(B)}function H(B,O){return Array.from(document.querySelectorAll(".shelf-slots > button")).findIndex(k=>{const X=k.getBoundingClientRect();return B>=X.left&&B<=X.right&&O>=X.top&&O<=X.bottom})}function I(B,O){!O||!N(O)||B.button!==0||B.pointerType==="touch"||(B.preventDefault(),B.currentTarget.focus(),B.currentTarget.setPointerCapture(B.pointerId),E.current={uid:O,pointer:B.pointerId,x:B.clientX,y:B.clientY,moved:!1},b.current=!1)}function Y(B){const O=E.current;if(!O||O.pointer!==B.pointerId||(O.moved||(O.moved=Math.hypot(B.clientX-O.x,B.clientY-O.y)>6),!O.moved))return;m(O.uid),S({uid:O.uid,x:B.clientX,y:B.clientY});const k=H(B.clientX,B.clientY);x(k<0?null:k)}function U(B,O=!1){const k=E.current;if(!k||k.pointer!==B.pointerId||(E.current=null,b.current=k.moved,S(null),B.currentTarget.hasPointerCapture(B.pointerId)&&B.currentTarget.releasePointerCapture(B.pointerId),!k.moved))return;const X=O?-1:H(B.clientX,B.clientY);X>=0?V(k.uid,X):(m(null),x(null))}return d.jsxs("div",{className:"inventory-layout",children:[d.jsxs("div",{children:[d.jsxs("div",{className:"section-heading",children:[d.jsxs("h3",{children:["全部库存 ",d.jsxs("small",{children:[s.inventory.length," / 12"]})]}),d.jsx("span",{children:"点选查看 · 拖到下方木格摆放"})]}),d.jsx("div",{className:"inventory-grid",children:Array.from({length:12},(B,O)=>{const k=s.inventory[O];return k?d.jsxs("button",{className:`inventory-cell ${u===k.uid?"selected":""}`,"data-movable":N(k.uid),onDragStart:X=>X.preventDefault(),onPointerDown:X=>I(X,k.uid),onPointerMove:Y,onPointerUp:X=>U(X),onPointerCancel:X=>U(X,!0),onLostPointerCapture:X=>U(X,!0),onClick:()=>{if(b.current){b.current=!1;return}h(k.uid)},children:[d.jsx("span",{className:"slot-number",children:String(O+1).padStart(2,"0")}),d.jsx(Ui,{id:k.defId}),d.jsx("b",{children:Zt(k.defId).name}),d.jsxs("span",{className:`stock-status ${k.displayed?"on-shelf":""}`,children:[k.displayed?"● 陈列中":"仓库存放",k.revealed.authenticity?"":" · 未核验"]})]},k.uid):d.jsxs("div",{className:"inventory-cell empty",children:[d.jsx("span",{className:"slot-number",children:String(O+1).padStart(2,"0")}),d.jsx(_o,{size:24,strokeWidth:1}),d.jsx("span",{children:"空置"})]},O)})}),d.jsxs("div",{className:"section-heading shelf-title",children:[d.jsxs("h3",{children:["店内陈列 ",d.jsxs("small",{children:[L.filter(Boolean).length," / 8"]})]}),d.jsx("span",{children:z?`正拿着：${Zt(z.defId).name} · 选择木格放下`:"拿起摆放后，点木格放下；也可直接拖入"})]}),d.jsx("div",{className:"shelf-slots",children:Array.from({length:8},(B,O)=>d.jsxs("button",{className:g===O?"drop-ready":"","data-movable":!!L[O]&&N(L[O].uid),onDragStart:k=>k.preventDefault(),onPointerDown:k=>{var X;p||I(k,(X=L[O])==null?void 0:X.uid)},onPointerMove:Y,onPointerUp:k=>U(k),onPointerCancel:k=>U(k,!0),onLostPointerCapture:k=>U(k,!0),"aria-label":L[O]?`选择陈列商品 ${Zt(L[O].defId).name}`:`陈列位 ${O+1}`,onClick:()=>{if(b.current){b.current=!1;return}p?V(p,O):L[O]?h(L[O].uid):T&&!T.displayed&&V(T.uid,O)},children:[d.jsx("small",{className:"display-slot-number",children:String(O+1).padStart(2,"0")}),L[O]?d.jsx(Ui,{id:L[O].defId}):d.jsx("span",{children:"＋"})]},O))}),p&&d.jsxs("div",{className:"carried-controls",children:[d.jsx("span",{children:"已拿起 · 放置不消耗营业时间"}),d.jsx("button",{className:"text-button",onClick:()=>{m(null),x(null)},children:"取消拿取"})]})]}),d.jsx("aside",{className:"inventory-detail",children:T&&M?d.jsxs(d.Fragment,{children:[d.jsxs("button",{className:"catalogue-object","aria-label":`拿起${M.name}查看`,onClick:()=>i(T.uid),children:[d.jsx(Ui,{id:T.defId}),d.jsxs("span",{children:["轻触拿到桌面 · ",M.id]})]}),d.jsxs("span",{className:"category-label",children:[M.id," · ",vi[M.category].name]}),d.jsx("h3",{children:M.name}),d.jsx("p",{className:"item-lore",children:M.lore}),d.jsx(jm,{item:T}),d.jsx(Hm,{item:T,state:s}),d.jsxs("div",{className:"cost-row",children:[d.jsx("span",{children:"实际购入成本"}),d.jsx(Di,{amount:T.cost})]}),d.jsxs("label",{className:"list-price",children:["建议挂牌价"," ",d.jsxs("div",{children:[d.jsx("input",{"aria-label":"建议挂牌价",type:"number",min:"1",max:"9999",disabled:!!_,value:T.listPrice,onChange:B=>t({type:"PRICE",uid:T.uid,price:Number(B.target.value)})}),d.jsx("span",{children:"票"})]})]}),d.jsx("p",{className:"muted small",children:"挂牌价可作为你的起始要价，不保证买家接受。"}),d.jsxs("button",{className:"button secondary full",disabled:!N(T.uid),"aria-pressed":p===T.uid,onClick:()=>m(p===T.uid?null:T.uid),children:[d.jsx(_o,{size:16}),p===T.uid?"取消拿取":"拿起摆放 · 选择陈列格"]}),d.jsx("button",{className:"button primary full",disabled:!!_||s.inventory.filter(B=>B.displayed).length>=8&&!T.displayed,onClick:()=>t({type:"DISPLAY",uid:T.uid,riskLabel:!0}),children:T.displayed?"撤下陈列":T.revealed.authenticity?"诚实标注 · 上架":"标记“未核验”并上架"}),!T.revealed.authenticity&&d.jsx("p",{className:"muted small",children:"未核验商品仅周砾、阿扣接收，预算降低 20%。"}),d.jsxs("button",{className:"button secondary full",disabled:!!s.inspection||!!((Z=s.trade)!=null&&Z.locked),onClick:()=>i(T.uid),children:[d.jsx(xy,{size:16}),"送到鉴定台"]}),d.jsxs("button",{className:"text-button danger-text",disabled:!!_||s.recycled>=2||fn(s)<6||!!s.inspection||s.commission==="active",onClick:()=>o(T.uid),children:["回收变现 · ",Math.floor(As(T,s.market)*.35)," 票"," ",d.jsx(Ms,{size:14})]}),d.jsxs("p",{className:"muted small",children:["今日已回收 ",s.recycled," / 2 件 · 耗时 6 分钟"]})]}):d.jsxs("div",{className:"empty-detail",children:[d.jsx(_o,{size:36}),d.jsx("h3",{children:"货架在等新的故事"}),d.jsx("p",{children:"接待卖家，收购第一件旧物。"})]})}),v&&WR.createPortal(d.jsxs("div",{className:"inventory-drag-ghost",style:{left:v.x,top:v.y},"aria-hidden":"true",children:[d.jsx(Ui,{id:s.inventory.find(B=>B.uid===v.uid).defId}),d.jsx("span",{children:"放入木格 · 空间不足可交换"})]}),document.body)]})}function nw({state:s}){const[t,i]=ze.useState("today"),o=s.ledger.filter(p=>t==="all"||p.day===s.day),u=s.ledger.filter(p=>p.kind==="sale").reduce((p,m)=>p+m.amount-(m.cost??0),0),h=s.inventory.reduce((p,m)=>p+m.cost,0);return d.jsxs(d.Fragment,{children:[d.jsxs("div",{className:"ledger-stats",children:[d.jsxs("div",{children:[d.jsx("span",{children:"可用现金"}),d.jsx(Di,{amount:s.cash})]}),d.jsxs("div",{children:[d.jsx("span",{children:"已实现销售毛利"}),d.jsx(Di,{amount:u})]}),d.jsxs("div",{children:[d.jsx("span",{children:"未售库存成本"}),d.jsx(Di,{amount:h})]}),d.jsxs("div",{children:[d.jsx("span",{children:"今日到期费用"}),d.jsx(Di,{amount:15+cf(s.day)})]})]}),d.jsxs("div",{className:"tabs",children:[d.jsx("button",{className:t==="today"?"active":"",onClick:()=>i("today"),children:"今日流水"}),d.jsx("button",{className:t==="all"?"active":"",onClick:()=>i("all"),children:"全部流水"}),d.jsx("span",{children:"库存价值不计入现金"})]}),d.jsxs("div",{className:"ledger-table",children:[d.jsxs("div",{className:"ledger-row table-head",children:[d.jsx("span",{children:"时间"}),d.jsx("span",{children:"项目"}),d.jsx("span",{children:"金额"})]}),o.length===0?d.jsxs("div",{className:"empty-ledger",children:[d.jsx(py,{size:30}),d.jsx("p",{children:"账本的第一页，等你写下。"}),d.jsx("span",{children:"初始现金 180 票；3 件原有存货不再扣款。"})]}):o.slice().reverse().map(p=>d.jsxs("div",{className:"ledger-row",children:[d.jsxs("span",{children:["第 ",p.day," 天 · ",uS(p.minute)]}),d.jsxs("span",{children:[p.amount>0?d.jsx(lE,{size:15}):d.jsx(cE,{size:15}),p.label,p.risk&&d.jsx("small",{children:"未核验成交"})]}),d.jsxs("b",{className:p.amount>0?"income":"",children:[p.amount>0?"+":"−",Math.abs(p.amount),d.jsx("small",{children:"票"})]})]},p.id))]}),d.jsxs("div",{className:"ledger-note",children:[d.jsx(my,{size:20}),d.jsxs("p",{children:[d.jsx("b",{children:"七日租约"}),"每日耗材 15 票；第 3 天租金 90 票，第 7 天租金 210 票。结清后，保留 120 票现金、信誉 40 以上并累计售出 12 件，就能正式续业。"]})]})]})}function iw({state:s}){const[t,i]=ze.useState("objects"),[o,l]=ze.useState(0),[u,h]=ze.useState("all");return d.jsxs(d.Fragment,{children:[d.jsxs("div",{className:"tabs",children:[d.jsx("button",{className:t==="objects"?"active":"",onClick:()=>{i("objects"),l(0)},children:"旧物档案 · 12"}),d.jsx("button",{className:t==="people"?"active":"",onClick:()=>{i("people"),l(0)},children:"聚落居民 · 6"}),d.jsx("span",{children:"编号可查，故事慢慢听"})]}),t==="objects"?d.jsxs(d.Fragment,{children:[d.jsx("div",{className:"filter-chips",children:["all","repair","life","collect"].map(p=>d.jsx("button",{className:u===p?"active":"",onClick:()=>{h(p),l(Hn.findIndex(m=>p==="all"||m.category===p))},children:p==="all"?"全部旧物":vi[p].name},p))}),d.jsxs("div",{className:"codex-layout",children:[d.jsx("div",{className:"codex-grid",children:Hn.filter(p=>u==="all"||p.category===u).map(p=>{var m;return d.jsxs("button",{className:((m=Hn[o])==null?void 0:m.id)===p.id?"active":"",onClick:()=>l(Hn.indexOf(p)),children:[d.jsx("span",{className:"slot-number",children:p.id}),d.jsx(Ui,{id:p.id}),d.jsx("b",{children:p.name}),d.jsx("small",{children:s.discovered.includes(p.id)?"已遇见":"目录记录"})]},p.id)})}),d.jsxs("div",{className:"codex-entry",children:[d.jsxs("span",{className:"eyebrow",children:["FIELD NOTES / ",Hn[o].id]}),d.jsx("h3",{children:Hn[o].name}),d.jsx("p",{className:"item-subtitle",children:Hn[o].subtitle}),d.jsx("p",{className:"item-lore",children:Hn[o].lore}),d.jsxs("div",{className:"definition-row",children:[d.jsx("span",{children:"原始基础价"}),d.jsx(Di,{amount:Hn[o].base})]}),d.jsx("h4",{children:"可核验的证据"}),d.jsxs("p",{className:"clue-text",children:[d.jsx(Tp,{size:15}),Hn[o].appearance[0],"。"]}),d.jsxs("p",{className:"clue-text",children:[d.jsx(Vu,{size:15}),Hn[o].functionClue[0]]}),d.jsxs("p",{className:"clue-text",children:[d.jsx(bp,{size:15}),Hn[o].originalClue]}),d.jsx("div",{className:"field-stamp",children:"灰线旧站 · 旧物档案"})]})]})]}):d.jsxs("div",{className:"people-layout",children:[d.jsx("div",{className:"people-list",children:wi.map((p,m)=>d.jsxs("button",{className:o===m?"active":"",onClick:()=>l(m),children:[d.jsx(Sm,{index:p.sprite}),d.jsxs("span",{children:[d.jsx("b",{children:p.name}),d.jsx("small",{children:p.title})]}),d.jsx(Ms,{size:16})]},p.id))}),d.jsxs("div",{className:"people-entry",children:[d.jsx("div",{className:"full-character",style:{backgroundPositionX:`${wi[o].sprite*20}%`}}),d.jsxs("div",{children:[d.jsx("span",{className:"eyebrow",children:"PEOPLE OF GREYLINE"}),d.jsx("h3",{children:wi[o].name}),d.jsx("p",{className:"item-subtitle",children:wi[o].title}),d.jsx("p",{className:"item-lore",children:wi[o].bio}),d.jsxs("blockquote",{children:["“",wi[o].lines.special,"”"]}),d.jsx("div",{className:"preference-list",children:wi[o].preferences.map(p=>d.jsx("span",{children:vi[p].name},p))}),d.jsx("p",{className:"muted small",children:wi[o].risk?"愿意购买明确标注的未核验商品，预算会有所降低。":"只购买来源已经核验、诚实标注的商品。"})]})]})]})]})}function aw({state:s,send:t}){const[i,o]=ze.useState(null),l=s.commission==="active";return d.jsxs("div",{className:`community commission-${s.commission}`,children:[d.jsxs("div",{className:"community-intro",children:[d.jsxs("div",{className:"commission-copy",children:[d.jsx("span",{className:"eyebrow",children:"南站仓库 · 招募店主帮手"}),d.jsx("h3",{children:"给旧物分个家"}),d.jsx("p",{children:"南站仓库缺一双帮忙的手。把六件回收物资送到对应的箱子，不需要本钱，也不占库存。"}),d.jsx("span",{className:"notice-signature",children:"—— 南站仓库 · 聚落互助处"})]}),d.jsxs("div",{className:"commission-illustration","aria-hidden":"true",children:[d.jsx(Ll,{frame:6}),d.jsx(Ll,{frame:7}),d.jsx(Ll,{frame:8}),d.jsx("span",{children:"旧物归箱，故事继续。"})]}),d.jsxs("div",{className:"commission-terms",children:[d.jsxs("span",{children:[d.jsx(Ln,{name:"watch"}),d.jsxs("span",{children:[d.jsxs("b",{children:["90",d.jsx("small",{children:"分钟"})]}),d.jsx("em",{children:"游戏内耗时"})]})]}),d.jsxs("span",{children:[d.jsx(Ln,{name:"purse"}),d.jsxs("span",{children:[d.jsxs("b",{children:["40",d.jsx("small",{children:"票"})]}),d.jsx("em",{children:"完成后领取"})]})]}),d.jsxs("span",{children:[d.jsx(Ln,{name:"seal"}),d.jsxs("span",{children:[d.jsx("b",{children:"每日一次"}),d.jsx("em",{children:"不占用店铺库存"})]})]})]})]}),l?d.jsxs(d.Fragment,{children:[d.jsx("p",{className:"muted small",children:"拖动卡片，或先选卡片再点分类箱。分错不会产生惩罚。"}),d.jsx("div",{className:"sort-cards",children:xm.map((u,h)=>d.jsxs("button",{"aria-label":u.name,draggable:!s.sorted.includes(h),onDragStart:p=>p.dataTransfer.setData("text/plain",String(h)),disabled:s.sorted.includes(h),className:`${i===h?"selected":""} ${s.sorted.includes(h)?"sorted":""}`,onClick:()=>o(h),children:[d.jsx(Ll,{frame:h}),s.sorted.includes(h)&&d.jsx(Fa,{className:"sorted-mark",size:20}),d.jsx("span",{children:u.name})]},h))}),d.jsx("div",{className:"sort-bins",children:Object.keys(vi).map((u,h)=>d.jsxs("button",{onDragOver:p=>p.preventDefault(),onDrop:p=>{p.preventDefault();const m=Number(p.dataTransfer.getData("text/plain"));Number.isInteger(m)&&t({type:"SORT",index:m,category:u})},onClick:()=>{i!==null&&(t({type:"SORT",index:i,category:u}),o(null))},children:[d.jsx(Ll,{frame:6+h}),d.jsx("b",{children:vi[u].name}),d.jsx("small",{children:"将卡片放入此箱"})]},u))}),d.jsxs("div",{className:"community-footer",children:[d.jsxs("span",{children:["已分拣 ",s.sorted.length," / 6"]}),d.jsxs("button",{className:"text-button",onClick:()=>t({type:"SORT_ALL"}),children:[d.jsx(EE,{size:15}),"辅助完成"]})]})]}):s.commission==="done"?d.jsxs("div",{className:"community-complete",children:[d.jsx(Ln,{name:"deal"}),d.jsx("span",{className:"reward-stamp",children:"报酬已签收"}),d.jsx("h3",{children:"今天的委托完成了"}),d.jsx("p",{children:"40 票已经入账。仓库的伙伴托我说一声：谢谢。"})]}):d.jsx("button",{className:"button primary full",disabled:fn(s)<90||!!s.trade||!!s.inspection,onClick:()=>t({type:"COMMISSION"}),children:s.trade?"请先结束当前接待":fn(s)<90?"剩余时间不足 90 分钟":"领取分拣委托"})]})}function sw(){return d.jsxs("div",{className:"help-content",children:[d.jsx("p",{className:"help-lead",children:"在沙尘里留住一家小店，也为旧物找个新家。"}),d.jsxs("aside",{className:"guide-frontispiece","aria-hidden":"true",children:[d.jsx(af,{}),d.jsx("span",{children:"灰线旧站 · 店主手册"}),d.jsxs("div",{children:[d.jsx(Ui,{id:"I06"}),d.jsx(Ui,{id:"I07"})]}),d.jsxs("b",{children:["旧物有来处",d.jsx("br",{}),"灯火有归人"]}),d.jsx("small",{children:"翻开这一页，从第一声门铃开始。"})]}),d.jsx("div",{className:"help-steps",children:[["01","接待与鉴定","卖家带来旧物，买家寻找陈列商品。外观、功能、编号各揭示一类证据，只消耗游戏时间，不收鉴定费。"],["02","报价与交割","每次接待最多报价三轮。价格谈妥后，还需确认交割，现金和物品才会转移。报价 4 分钟，交割 6 分钟。"],["03","入库与陈列","新收购的货物先进入仓库，记得打开货架上架。未核验商品须明确标注，仅周砾和阿扣愿意接收。"],["04","周转与租金","现金不够时，可做每日社区分拣委托，或回收两件旧物。每天 15 票耗材，第 3 天与第 7 天另付租金。"],["05","保住这间店","七日内结清所有费用，期末现金至少 120、信誉至少 40，累计售出 12 件。普通拒绝和还价失败不会扣信誉。"]].map(([s,t,i])=>d.jsxs("div",{children:[d.jsx("span",{children:s}),d.jsxs("section",{children:[d.jsx("h3",{children:t}),d.jsx("p",{children:i})]})]},s))}),d.jsxs("div",{className:"ledger-note",children:[d.jsx(hE,{size:21}),d.jsx("p",{children:"阅读、停留、打开菜单都不推进时间。所有进度自动保存在本浏览器。空格接待，Esc 暂停，I 货架，B 账本，H 指南。"})]})]})}function rw({state:s,offer:t,setOffer:i,setView:o,send:l,submitOffer:u,inspect:h}){const p=s.trade;if(!p)return null;const m=ni(p.npc),g=Rs(s);return d.jsxs("div",{className:"trade-content",children:[d.jsxs("div",{className:"trade-header",children:[d.jsx("span",{className:"trade-role",children:p.role==="seller"?"收购委托":"顾客求购"}),d.jsxs("span",{className:"round-indicators",children:[[0,1,2].map(x=>d.jsx("i",{className:x<p.rounds?"used":""},x)),d.jsxs("small",{children:[3-p.rounds," 轮机会"]})]})]}),p.role==="buyer"&&d.jsxs("div",{className:"buyer-selection",children:[d.jsxs("p",{children:["想找 ",d.jsx("b",{children:vi[p.category].name}),(m==null?void 0:m.risk)&&d.jsx("span",{children:"接受未核验"})]}),Vl(s).length?d.jsx("div",{className:"candidate-list",children:Vl(s).map(x=>d.jsxs("button",{"aria-label":`选择商品 ${Zt(x.defId).name}`,className:p.selected===x.uid?"selected":"",onClick:()=>l({type:"SELECT",uid:x.uid}),disabled:p.locked||!!s.inspection,children:[d.jsx(Ui,{id:x.defId}),p.selected===x.uid&&d.jsx(Fa,{size:12})]},x.uid))}):d.jsxs("div",{className:"no-stock",children:[d.jsx(_o,{size:30}),d.jsx("p",{children:"货架上暂无合适的商品"}),d.jsxs("button",{className:"text-button",onClick:()=>o("inventory"),children:["查看库存、调整陈列 ",d.jsx(Ms,{size:14})]}),d.jsx("small",{children:"缺货送客不会扣除信誉。"})]})]}),g&&d.jsxs(d.Fragment,{children:[d.jsxs("section",{className:`artifact-exhibit ${p.role==="buyer"?"compact":""}`,children:[d.jsxs("span",{className:"artifact-catalogue",children:[g.defId," ",d.jsx("i",{})," ",vi[Zt(g.defId).category].name]}),d.jsxs("button",{className:"item-showcase","aria-label":`拿起交易旧物 ${Zt(g.defId).name}`,onClick:()=>h(g.uid),children:[d.jsx("span",{className:"artifact-halo"}),d.jsx("span",{className:"artifact-orbit"}),d.jsx(Ui,{id:g.defId}),d.jsxs("span",{className:`appraisal-seal ${g.revealed.authenticity?"verified":""}`,children:[d.jsx("b",{children:g.revealed.authenticity?"验":"待"}),d.jsx("small",{children:g.revealed.authenticity?"档案已录":"留待细看"})]})]}),d.jsxs("div",{className:"item-title",children:[d.jsx("h2",{children:Zt(g.defId).name}),d.jsx("p",{children:Zt(g.defId).subtitle})]})]}),d.jsx(Fm,{className:"artifact-divider"}),d.jsx("div",{className:"trade-findings",children:d.jsx(jm,{item:g})}),d.jsx(Hm,{item:g,state:s}),d.jsxs("div",{className:"asking-price",children:[d.jsx("span",{children:p.locked?"双方已谈定":p.role==="seller"?`${m==null?void 0:m.name}的要价`:`${m==null?void 0:m.name}的出价`}),d.jsx(Di,{amount:p.price})]}),p.locked?d.jsxs("div",{className:"locked-trade",children:[d.jsxs("div",{children:[d.jsx(ME,{size:17}),"钱货尚未交割"]}),d.jsxs("button",{className:"button primary full","data-testid":"deliver",disabled:!!nf(s),onClick:()=>l({type:"DELIVER",tradeId:p.id}),children:[p.role==="seller"?"确认收购":"确认出售"," · ",p.price," 票",d.jsx(go,{size:16})]}),d.jsx("p",{children:nf(s)||"交割耗时 6 分钟，成交后自动记账。"})]}):d.jsxs("div",{className:"bargain-controls",children:[d.jsxs("div",{className:"offer-label",children:[d.jsx("label",{htmlFor:"offer-price",children:p.role==="seller"?"你的收购报价":"你的出售要价"}),d.jsx("span",{children:"每轮 4 分钟"})]}),d.jsxs("form",{onSubmit:x=>{x.preventDefault(),u()},children:[d.jsxs("div",{className:"offer-input",children:[d.jsx("button",{type:"button","aria-label":"报价减少 5 票",disabled:!!s.inspection,onClick:()=>i(String(Math.max(1,Number(t)-5))),children:d.jsx(Em,{size:16})}),d.jsx("input",{id:"offer-price","aria-label":"你的报价",type:"number",min:"1",max:"9999",step:"1",value:t,disabled:!!s.inspection,onChange:x=>i(x.target.value)}),d.jsx("span",{children:"票"}),d.jsx("button",{type:"button","aria-label":"报价增加 5 票",disabled:!!s.inspection,onClick:()=>i(String(Math.min(9999,Number(t)+5))),children:d.jsx(_y,{size:16})})]}),d.jsxs("button",{className:"button primary",disabled:!!s.inspection||fn(s)<10||!Number.isInteger(Number(t))||Number(t)<1,type:"submit","data-testid":"offer",children:["报价 ",d.jsx(go,{size:15})]})]}),d.jsxs("button",{className:"text-button accept-current",disabled:!!s.inspection||fn(s)<10,onClick:()=>l({type:"ACCEPT"}),children:["接受对方当前价格"," ",d.jsxs("span",{children:[p.price," 票 ",d.jsx(Ms,{size:13})]})]})]})]})]})}function ow(s,t){const[i,o]=ze.useState(s),[l,u]=ze.useState(!1),h=ze.useRef(i);h.current=i;const p=ze.useRef(t);p.current=t;const m=ze.useRef(null);ze.useEffect(()=>()=>{m.current&&clearTimeout(m.current)},[]);const g=ze.useCallback(x=>{if(m.current&&clearTimeout(m.current),x===h.current){u(!1);return}h.current&&!p.current?(u(!0),m.current=setTimeout(()=>{o(x),u(!1)},170)):(o(x),u(!1))},[]);return[i,g,l]}function lw({text:s,reduced:t,onComplete:i}){const[o,l]=ze.useState(t?s.length:0),u=ze.useRef(!1);return ze.useEffect(()=>{if(u.current=!1,t){l(s.length);return}l(0);const h=performance.now();let p;function m(g){const x=u.current?s.length:Math.min(s.length,Math.floor((g-h)/23));l(x),x<s.length?p=requestAnimationFrame(m):i==null||i()}return p=requestAnimationFrame(m),()=>cancelAnimationFrame(p)},[s,t,i]),d.jsxs("span",{className:"typewriter",onClick:()=>{u.current=!0,l(s.length)},children:[d.jsx("span",{className:"sr-only",children:s}),d.jsxs("span",{"aria-hidden":"true",children:[s.slice(0,o),o<s.length&&d.jsx("i",{className:"typing-caret"})]})]})}function cw({value:s,reduced:t}){const[i,o]=ze.useState(s),l=ze.useRef(s);return ze.useEffect(()=>{const u=l.current;if(l.current=s,t||u===s){o(s);return}const h=performance.now();let p;const m=g=>{const x=Math.min(1,(g-h)/430);o(Math.round(u+(s-u)*(1-(1-x)**3))),x<1&&(p=requestAnimationFrame(m))};return p=requestAnimationFrame(m),()=>cancelAnimationFrame(p)},[s,t]),d.jsx("span",{"aria-label":String(s),children:i.toLocaleString()})}function uw({cue:s}){return d.jsxs("div",{className:`scene-transition ${s.night?"night":"dawn"}`,role:"status","aria-live":"polite","data-testid":"scene-transition",children:[d.jsx("div",{className:"transition-shutter shutter-top"}),d.jsx("div",{className:"transition-shutter shutter-bottom"}),d.jsxs("div",{className:"transition-lettering",children:[d.jsx("span",{className:"transition-ornament",children:"◇ ───────── ◇"}),s.night?d.jsx(vy,{size:34,strokeWidth:1.3}):d.jsx(bE,{size:34,strokeWidth:1.3}),d.jsx("h2",{children:s.title}),d.jsx("p",{children:s.subtitle}),d.jsx("span",{className:"transition-ornament",children:"灰 线 旧 货 铺"})]})]},s.id)}function fw({effect:s}){return d.jsxs("div",{className:`deal-feedback ${s.amount<0?"purchase-effect":"sale-effect"}`,"aria-live":"polite","data-testid":"deal-feedback",children:[d.jsxs("div",{className:"deal-stamp",children:[d.jsx(Fa,{size:24}),d.jsx("strong",{children:"成交"}),d.jsx("span",{children:s.label})]}),d.jsxs("div",{className:"deal-amount",children:[d.jsx(py,{size:22}),s.amount>0?"+":"−",Math.abs(s.amount),d.jsx("small",{children:"票"})]}),d.jsx("div",{className:"coin-particles","aria-hidden":"true",children:Array.from({length:7},(t,i)=>d.jsx("i",{style:{"--i":i}},i))})]},s.id)}function dw({state:s,prefs:t,view:i,setView:o,send:l,inspect:u,offer:h,setOffer:p,submitOffer:m,save:g,saveFailed:x,saveTick:v,onSound:S,onFullscreen:E,transitioning:b}){const[T,M]=ze.useState(!0),_=s.trade,L=Rs(s),z=_?ni(_.npc):null,N=s.phase==="report"||s.phase==="ending",V=s.cursor<s.queue.length?s.queue[s.cursor]:null,H=cf(s.day),I=s.day<=3?3:7,Y=!!s.inspection||s.commission==="active",U=z?_.line:s.notice;return d.jsxs("main",{className:`game-screen ${_?"at-counter":"between-visits"} ${i?"panel-is-open":""}`,"aria-label":"灰线旧货铺游戏画面","aria-busy":b,children:[d.jsx("div",{className:"world-stage",children:d.jsx(YR,{npc:N?null:(_==null?void 0:_.npc)??V,active:!!_,inventory:s.inventory,item:(_==null?void 0:_.role)==="seller"?L:void 0,reducedMotion:t.reducedMotion,day:s.day,minute:s.minute,suspended:!!i||s.phase!=="open"||b,onItemSelect:R=>{var G;((G=s.trade)==null?void 0:G.role)==="buyer"&&!s.trade.locked&&!s.inspection&&Vl(s).some(ie=>ie.uid===R)?l({type:"SELECT",uid:R}):u(R)}})}),d.jsx("div",{className:"world-shade","aria-hidden":"true"}),d.jsxs("div",{className:"screen-corners","aria-hidden":"true",children:[d.jsx("i",{}),d.jsx("i",{}),d.jsx("i",{}),d.jsx("i",{})]}),d.jsxs("header",{className:"game-hud",children:[d.jsxs("button",{className:"shop-sign",onClick:()=>o("help"),"aria-label":"灰线旧货铺 · 查看游戏指南",children:[d.jsx("span",{className:"sign-nail"}),d.jsx(af,{}),d.jsxs("span",{className:"sign-lettering",children:[d.jsx("small",{className:"sign-kicker",children:"旧站台 · 拾物记"}),d.jsx("strong",{children:"灰线旧货铺"}),d.jsx("small",{children:"每件旧物，都值得一个新故事"})]}),d.jsx("span",{className:"sign-nail"})]}),d.jsxs("div",{className:"hud-plates","aria-label":"经营状态",children:[d.jsxs("div",{className:"hud-plate day-plate",children:[d.jsx(Ln,{name:"watch"}),d.jsxs("div",{children:[d.jsx("small",{children:"七日试营业"}),d.jsxs("strong",{children:[d.jsx("b",{children:String(s.day).padStart(2,"0")}),d.jsx("em",{children:"日"})]})]}),d.jsx("div",{className:"seven-days","aria-label":`七日中的第${s.day}天`,children:[1,2,3,4,5,6,7].map(R=>d.jsx("i",{className:R<=s.day?"lit":""},R))})]}),d.jsxs("div",{className:"hud-plate cash-plate",children:[d.jsx(Ln,{name:"purse"}),d.jsxs("div",{children:[d.jsx("small",{children:"手头现金"}),d.jsxs("strong",{"data-testid":"cash",children:[d.jsx(cw,{value:s.cash,reduced:t.reducedMotion}),d.jsx("em",{children:"票"})]})]})]}),d.jsxs("button",{className:`hud-plate rent-plate ${H?"rent-due":""}`,onClick:()=>o("ledger"),"aria-label":"查看租金账本",children:[d.jsx(Ln,{name:"keys"}),d.jsxs("div",{children:[d.jsx("small",{children:H?"今晚结租":`第 ${I} 天结租`}),d.jsxs("strong",{children:[H||(I===3?90:210),d.jsx("em",{children:"票"})]})]})]}),d.jsxs("div",{className:"hud-plate reputation-plate",children:[d.jsx(Ln,{name:"seal"}),d.jsxs("div",{children:[d.jsx("small",{children:"信誉"}),d.jsxs("strong",{children:[s.reputation,d.jsx("em",{children:"/100"})]})]})]})]}),d.jsxs("div",{className:"game-system-controls",children:[d.jsx("button",{className:"game-icon","aria-label":t.sound?"关闭声音":"开启声音",onClick:S,children:t.sound?d.jsx(AE,{size:20}):d.jsx(CE,{size:20})}),d.jsx("button",{className:"game-icon fullscreen-button","aria-label":"全屏游戏",onClick:E,children:d.jsx(vE,{size:19})}),d.jsx("button",{className:"game-icon","aria-label":"暂停与设置",onClick:()=>o("settings"),children:d.jsx(SE,{size:20})})]})]}),d.jsxs("div",{className:"station-caption",children:[d.jsx("span",{className:"open-dot"}),d.jsx("span",{children:"灰线聚落 · 旧站台"}),d.jsx("i",{}),s.day===4?"沙尘渐起":"晴，微风"]}),d.jsxs("div",{className:"atmosphere","aria-hidden":"true",children:[d.jsx("i",{className:"window-beam"}),d.jsx("i",{className:"lantern-halo"}),d.jsx("i",{className:"drifting-motes"})]}),!N&&d.jsxs("aside",{className:"visitor-chain","aria-label":"即将到访的居民",children:[d.jsx("small",{children:"来客簿"}),s.queue.slice(s.cursor+(_?1:0),s.cursor+(_?4:3)).map((R,G)=>d.jsxs("span",{title:ni(R).name,children:[d.jsx(Sm,{index:ni(R).sprite}),d.jsx("i",{children:G+1})]},`${R}-${G}`)),d.jsx("em",{children:"待续"})]}),d.jsxs("button",{className:"world-hotspot shelf-trigger",onClick:()=>o("inventory"),"aria-label":"查看店内陈列",children:[d.jsx(_o,{size:17}),d.jsxs("span",{children:["货架 ",d.jsxs("b",{children:[s.inventory.filter(R=>R.displayed).length,"/8"]})]}),d.jsx(Ms,{size:13})]}),!i&&!N&&d.jsx("span",{className:"shelf-interaction-hint",children:"轻触架上旧物 · 拿起细看"}),!_&&V&&!N&&d.jsxs("button",{className:"door-bubble",disabled:Y||b||fn(s)<6,onClick:()=>l({type:"ARRIVE"}),"aria-label":"招呼门口的顾客",children:[d.jsx(ix,{size:15}),d.jsx("span",{children:"有客人来了"}),d.jsx("i",{})]},`door-${s.cursor}`),z&&d.jsxs("div",{className:"actor-name",children:[d.jsx("span",{children:_.role==="seller"?"卖家":"买家"}),d.jsx("strong",{children:z.name}),d.jsx("small",{children:z.title})]},`actor-${_.id}`),_&&L&&d.jsx("button",{className:"counter-artifact","aria-label":"近看柜台旧物",onClick:()=>u(L.uid),children:d.jsxs("span",{className:"artifact-stage","aria-hidden":"true",children:[d.jsx("i",{className:"stage-rays"}),d.jsx("i",{className:"stage-ring"}),d.jsx("span",{className:"stage-number",children:L.defId}),d.jsx(Ui,{id:L.defId}),d.jsxs("span",{className:"artifact-caption",children:[d.jsx("strong",{children:Zt(L.defId).name}),d.jsx("small",{children:"轻触旧物 · 放大鉴定"})]})]})}),d.jsxs("aside",{className:`wall-clipboard ${_?"trade-clipboard":"notice-clipboard"} ${!T&&!_?"folded-board":""}`,"aria-label":_?"柜台交易单":"今日告示",children:[d.jsx("div",{className:"clipboard-clamp","aria-hidden":"true",children:d.jsx("i",{})}),d.jsxs("header",{className:"clipboard-heading",children:[d.jsxs("div",{className:"clipboard-title",children:[d.jsx("small",{children:"灰线商行 · 旧物档案"}),d.jsx("span",{children:_?_.role==="seller"?"旧物收购单":"顾客求购单":"今日告示"})]}),!_&&d.jsx("button",{"aria-label":T?"收起今日告示":"展开今日告示",onClick:()=>M(R=>!R),children:d.jsx(fE,{size:18})}),d.jsx("span",{className:"clipboard-number",children:_?`NO. ${String(s.cursor+1).padStart(2,"0")}`:`第 ${s.day} 日`})]}),d.jsx(Fm,{className:"clipboard-flourish"}),_?d.jsx(rw,{state:s,inspect:u,offer:h,setOffer:p,setView:o,send:l,submitOffer:m}):d.jsxs("div",{className:"notice-paper",children:[d.jsxs("div",{className:"handwritten-note",children:[d.jsx("span",{className:"little-star",children:"✦"}),d.jsx("h2",{children:_m[s.day-1][0]}),d.jsx("p",{children:_m[s.day-1][1]})]}),d.jsxs("div",{className:"paper-market",children:[d.jsxs("h3",{children:[d.jsx(sx,{size:16}),"聚落行情",d.jsx("span",{children:"今日"})]}),Object.keys(vi).map(R=>d.jsxs("div",{children:[d.jsx("span",{children:vi[R].name}),d.jsx("i",{}),d.jsx("b",{className:s.market[R]>1?"rising":s.market[R]<1?"falling":"",children:s.market[R]===1?"— 平稳":`${s.market[R]>1?"↗ +":"↘ −"}15%`})]},R))]}),d.jsxs("div",{className:"lease-progress",children:[d.jsxs("div",{children:[d.jsx(pE,{size:16}),d.jsx("b",{children:"七日之约"}),d.jsxs("span",{children:[s.sold,"/12 件"]})]}),d.jsx("div",{className:"lease-track",children:d.jsx("span",{style:{width:`${Math.min(100,s.sold/12*100)}%`}})}),d.jsx("p",{children:"结清租金 · 余款 120 票 · 信誉 40"})]}),d.jsxs("button",{className:"paper-commission",onClick:()=>o("community"),children:[d.jsx("span",{className:"commission-seal",children:d.jsx(_o,{size:22})}),d.jsxs("span",{children:[d.jsx("b",{children:s.commission==="done"?"今日委托已完成":s.commission==="active"?"继续分拣委托":"社区分拣委托"}),d.jsx("small",{children:s.commission==="done"?"报酬已记入账本":"帮忙分拣 · 报酬 40 票"})]}),s.commission==="done"?d.jsx(Fa,{size:18}):d.jsx(Ms,{size:18})]})]}),d.jsxs("footer",{className:"clipboard-foot",children:[d.jsx("span",{className:"ink-dot"}),s.cursor>=s.queue.length?"今日来客已接待完毕":`今日剩余 ${s.queue.length-s.cursor} 位来客`]})]},_?`sheet-${_.id}`:`notice-${s.day}`),d.jsxs("section",{className:"game-dialogue","aria-label":"人物对话",children:[d.jsx(QR,{}),d.jsx("div",{className:"dialogue-medallion",children:z?d.jsx(Sm,{index:z.sprite}):d.jsx(TE,{size:35,strokeWidth:1.2})}),d.jsxs("div",{className:"game-dialogue-copy",children:[d.jsxs("div",{className:"speaker-line",children:[d.jsx("strong",{children:(z==null?void 0:z.name)??"店主手记"}),d.jsx("span",{children:z?z.title:`第 ${s.day} 天 · 开门迎客`}),_&&d.jsx("small",{children:_.repeat?"熟悉的面孔":"旧物与新故事"})]}),d.jsx("p",{"data-testid":"dialogue",children:d.jsx(lw,{text:U,reduced:t.reducedMotion})}),d.jsx("span",{className:"dialogue-continue","aria-hidden":"true",children:"◆"})]}),d.jsx(af,{className:"dialogue-watermark"})]},`speech-${(_==null?void 0:_.id)??"diary"}-${s.cursor}`),d.jsx("div",{className:"game-action-bar","aria-label":"柜台操作",children:_?d.jsxs(d.Fragment,{children:[d.jsxs("button",{className:"game-button inspect-action",disabled:!L||_.locked||Object.values((L==null?void 0:L.revealed)??{}).every(Boolean),onClick:()=>L&&u(L.uid),children:[d.jsx(Ln,{name:"inspect"}),d.jsxs("span",{children:[s.inspection?"继续检查":"检查旧物",d.jsx("small",{children:"4–12 分钟"})]})]}),d.jsxs("button",{className:"game-button price-action",disabled:!L||_.locked||!!s.inspection||fn(s)<10,onClick:()=>{var R;return(R=document.getElementById("offer-price"))==null?void 0:R.focus()},children:[d.jsx(Ln,{name:"notes"}),d.jsxs("span",{children:["商量报价",d.jsx("small",{children:"4 分钟 / 轮"})]})]}),d.jsxs("button",{className:"game-button accept-action",disabled:!L||!!s.inspection||(_.locked?!!nf(s):fn(s)<10),onClick:()=>_.locked?l({type:"DELIVER",tradeId:_.id}):l({type:"ACCEPT"}),children:[d.jsx(Ln,{name:"deal"}),d.jsxs("span",{children:[_.locked?"交割成交":"接受价格",d.jsxs("small",{children:[_.price," 票"]})]})]}),d.jsxs("button",{className:"game-button decline-action",disabled:!!s.inspection,onClick:()=>l({type:"DISMISS"}),children:[d.jsx(Ln,{name:"refuse"}),d.jsxs("span",{children:[_.locked?"取消交易":"礼貌送客",d.jsx("small",{children:"2 分钟"})]})]})]}):d.jsxs(d.Fragment,{children:[d.jsxs("button",{className:"game-button primary-game greet-button","data-testid":"greet",disabled:!V||fn(s)<6||Y||s.phase!=="open",onClick:()=>l({type:"ARRIVE"}),children:[d.jsx(ix,{size:23}),d.jsxs("span",{children:["招呼顾客",d.jsx("small",{children:"6 分钟"})]}),d.jsx(Ms,{size:20})]}),d.jsxs("button",{className:"game-button shelf-action",onClick:()=>s.inspection?u(s.inspection.uid):s.commission==="active"?o("community"):o("inventory"),children:[d.jsx(ax,{size:23}),d.jsx("span",{children:s.inspection?"继续鉴定":s.commission==="active"?"继续分拣":"整理货架"})]}),d.jsxs("button",{className:"game-button community-action",onClick:()=>o("community"),children:[d.jsx(sx,{size:22}),d.jsxs("span",{children:["社区委托",d.jsx("small",{children:"40 票报酬"})]})]})]})}),d.jsxs("nav",{className:"game-toolbelt","aria-label":"店铺工具",children:[d.jsxs("button",{"aria-label":"货架","aria-keyshortcuts":"i",className:i==="inventory"?"selected":"",onClick:()=>o("inventory"),children:[d.jsx(ax,{size:23}),d.jsx("span",{children:"货架"}),d.jsx("kbd",{"aria-hidden":"true",children:"I"})]}),d.jsxs("button",{className:i==="codex"?"selected":"",onClick:()=>o("codex"),children:[d.jsx(uE,{size:23}),d.jsx("span",{children:"图鉴"})]}),d.jsxs("button",{"aria-label":"账本","aria-keyshortcuts":"b",className:i==="ledger"?"selected":"",onClick:()=>o("ledger"),children:[d.jsx(_E,{size:23}),d.jsx("span",{children:"账本"}),d.jsx("kbd",{"aria-hidden":"true",children:"B"})]}),d.jsxs("button",{onClick:()=>o("help"),children:[d.jsx(dE,{size:22}),d.jsx("span",{children:"指南"})]})]}),d.jsxs("div",{className:"pocket-clock",children:[d.jsx("div",{className:"clock-ring",children:d.jsx(KR,{minute:s.minute})}),d.jsxs("span",{children:[d.jsx("strong",{children:uS(s.minute)}),d.jsxs("small",{children:[fn(s)," 分钟后打烊"]})]}),d.jsxs("button",{className:"close-shop",disabled:Y||s.phase!=="open",onClick:()=>l({type:"CLOSE"}),children:[d.jsx(vy,{size:17}),"打烊"]})]}),d.jsxs("button",{onClick:g,className:`in-game-save ${x?"save-error":""}`,children:[d.jsx(yE,{size:13}),x?"存档未保存":v?"已保存":"自动存档",d.jsx("span",{className:"open-dot"})]}),d.jsxs("div",{className:"chapter-ribbon",children:[d.jsx(gy,{size:12}),d.jsx("span",{children:"旧物有来处，灯火有归人"})]})]})}let sr=null;function cy(s,t){if(t)try{sr??(sr=new AudioContext),sr.state==="suspended"&&sr.resume(),(s==="bell"?[830,1245,1660]:s==="coin"?[880,1174,1568]:s==="check"?[392,523]:[260]).forEach((o,l)=>{const u=sr.currentTime+l*.075,h=sr.createOscillator(),p=sr.createGain();h.type=s==="click"?"triangle":"sine",h.frequency.value=o,p.gain.setValueAtTime(0,u),p.gain.linearRampToValueAtTime(s==="click"?.035:.065,u+.008),p.gain.exponentialRampToValueAtTime(.001,u+(s==="bell"?.8:.25)),h.connect(p).connect(sr.destination),h.start(u),h.stop(u+1)})}catch{}}const uy={sound:!1,largeText:!1,reducedMotion:!1,assist:!1};function hw(){try{return{...uy,reducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches,...JSON.parse(localStorage.getItem("greyline-prefs")??"{}")}}catch{return uy}}function pw(){try{const s=new URLSearchParams(window.location.search);return s.has("seed")?Ku(s.get("seed")||"TUTORIAL-001"):dS(localStorage.getItem(Qu))??Ku()}catch{return Ku()}}function mw(){var Te,Xe;const[s,t]=ze.useReducer((D,Ce)=>Ce.type==="RESET"?Ku(Ce.seed):Ep(D,Ce),void 0,pw),[i,o]=ze.useState(hw),[l,u,h]=ow(null,i.reducedMotion),[p,m]=ze.useState(""),g=ze.useRef(null),[x,v]=ze.useState(""),[S,E]=ze.useState(null),[b,T]=ze.useState(null),[M,_]=ze.useState(!1),[L,z]=ze.useState(!1),[N,V]=ze.useState(""),[H,I]=ze.useState("TUTORIAL-001"),[Y,U]=ze.useState(""),[R,G]=ze.useState(null),[ie,ue]=ze.useState(null),Z=ze.useRef(s);Z.current=s;const B=ze.useRef(!1),O=ze.useRef(0),k=ze.useRef([]),X=ze.useRef(i);X.current=i,ze.useEffect(()=>()=>k.current.forEach(clearTimeout),[]);const ve=ze.useCallback((D,Ce)=>{if(!B.current){if(X.current.reducedMotion){Ce();return}B.current=!0,G({...D,id:++O.current}),k.current.push(setTimeout(Ce,380)),k.current.push(setTimeout(()=>{G(null),B.current=!1},1350))}},[]),_e=ze.useCallback(D=>{if(B.current)return;const Ce=Z.current;if(D.type==="SETTLE"||D.type==="NEXT"){const Ve=Ep(Ce,D);if(Ve.phase!==Ce.phase||Ve.day!==Ce.day){ve({title:D.type==="SETTLE"?"今日打烊":Ve.phase==="ending"?"七日之约":`第 ${Ve.day} 天`,subtitle:D.type==="SETTLE"?"把今天的故事，留在账本里":Ve.phase==="ending"?"每件旧物，都值得一个新的归处":_m[Ve.day-1][0],night:D.type==="SETTLE"},()=>t(D));return}}if(D.type==="DELIVER"){const Ve=Ep(Ce,D);Ce.trade&&!Ve.trade&&Ve.cash!==Ce.cash&&(ue({id:++O.current,amount:Ve.cash-Ce.cash,label:Ce.trade.role==="seller"?"旧物入库":"好物有归"}),k.current.push(setTimeout(()=>ue(null),X.current.reducedMotion?500:1700)))}cy(D.type==="ARRIVE"?"bell":D.type==="DELIVER"||D.type==="SORT_ALL"?"coin":D.type==="CHECK_STEP"?"check":"click",X.current.sound),t(D)},[ve]);ze.useEffect(()=>{try{localStorage.setItem(Qu,JSON.stringify(s)),_(!1)}catch{_(!0)}},[s]),ze.useEffect(()=>{try{localStorage.setItem("greyline-prefs",JSON.stringify(i))}catch{}document.documentElement.classList.toggle("large-text",i.largeText),document.documentElement.classList.toggle("reduced-motion",i.reducedMotion)},[i]),ze.useEffect(()=>{function D(Ce){if(!B.current&&!(Ce.ctrlKey||Ce.metaKey||Ce.altKey||Ce.target instanceof HTMLElement&&/INPUT|TEXTAREA|SELECT/.test(Ce.target.tagName))){if(Ce.key==="Escape"&&!l&&s.phase==="open"){u("settings");return}if(!(l||s.phase!=="open"||S!==null||b)){if(Ce.code==="Space"){if(Ce.target instanceof HTMLElement&&Ce.target.closest('button,a,[role="button"]'))return;Ce.preventDefault(),s.trade||_e({type:"ARRIVE"})}Ce.key.toLowerCase()==="i"&&u("inventory"),Ce.key.toLowerCase()==="b"&&u("ledger"),Ce.key.toLowerCase()==="h"&&u("help")}}}return window.addEventListener("keydown",D),()=>window.removeEventListener("keydown",D)},[l,s.phase,s.trade,S,b,_e]),ze.useEffect(()=>{s.notice&&U(s.notice)},[s.notice]),ze.useEffect(()=>{if(!Y)return;const D=setTimeout(()=>U(""),5500);return()=>clearTimeout(D)},[Y]),ze.useLayoutEffect(()=>{var Ce;const D=Rs(s);v(D?String(((Ce=s.trade)==null?void 0:Ce.role)==="seller"?Math.max(1,Math.floor(ef(D,s.market).center*.7+1e-9)):D.listPrice||Math.round(ef(D,s.market).center*1.1)):"")},[(Te=s.trade)==null?void 0:Te.id,(Xe=s.trade)==null?void 0:Xe.selected]);const He=s.trade,$e=cf(s.day),xt=s.phase==="report"||s.phase==="ending",j=s.inventory.find(D=>D.uid===b);function de(D){var Ce;g.current=l==="inventory"?"inventory":null,m(((Ce=s.inspection)==null?void 0:Ce.uid)??D),u("inspect")}function $(){u(null)}function oe(){const D=Number(x);if(ym(s,D)&&Number.isFinite(D)&&D>0){E(D);return}_e({type:"OFFER",price:D})}function Ee(){try{localStorage.setItem(Qu,JSON.stringify(s)),_(!1),z(!0),setTimeout(()=>z(!1),2e3)}catch{_(!0)}}function Le(D){ve({title:"第一天",subtitle:"门铃响了，新的故事开始了",night:!1},()=>t({type:"RESET",seed:D.trim()||"TUTORIAL-001"}));const Ce=new URL(window.location.href);Ce.searchParams.delete("seed"),window.history.replaceState({},"",Ce),u(null),m(""),E(null),T(null)}async function Ae(D){if(D)try{if(D.size>5e5){V("文件过大，请选择灰线旧货铺导出的 JSON 存档。");return}const Ce=dS(await D.text());if(!Ce){V("存档无法读取：格式不正确或版本不兼容。原进度未改动。");return}localStorage.setItem(Qu,JSON.stringify(Ce)),window.location.assign(window.location.pathname)}catch{V("浏览器无法读取或保存这个文件，请检查本地存储权限。")}}return d.jsxs("div",{className:`game-app immersive-game crafted-game ${h?"panels-exit":""} ${R?"is-transitioning":""}`,children:[d.jsx(dw,{state:s,prefs:i,view:l,setView:u,send:_e,inspect:de,offer:x,setOffer:v,submitOffer:oe,save:Ee,saveFailed:M,saveTick:L,transitioning:!!R,onSound:()=>{cy("bell",!i.sound),o(D=>({...D,sound:!D.sound}))},onFullscreen:async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{U("当前浏览器暂不支持全屏，可以横屏继续游玩。")}}}),R&&d.jsx(uw,{cue:R}),ie&&d.jsx(fw,{effect:ie}),Y&&!l&&!xt&&s.phase!=="closing"&&d.jsxs("div",{className:"toast",role:"status",children:[d.jsx(Fa,{size:15}),d.jsx("span",{children:Y}),d.jsx("button",{"aria-label":"收起通知",onClick:()=>U(""),children:d.jsx(yy,{size:13})})]}),l==="inventory"&&d.jsx(mi,{title:"库存与陈列",subtitle:"THE SHELVES · 给旧物一个位置",appearance:"cabinet",wide:!0,onClose:$,children:d.jsx(tw,{state:s,send:_e,inspect:de,confirm:T,initialUid:p})}),l==="ledger"&&d.jsx(mi,{title:"店铺账本",appearance:"ledger",subtitle:"EVERY TICKET COUNTS · 每一票都有来处",wide:!0,onClose:$,children:d.jsx(nw,{state:s})}),l==="codex"&&d.jsx(mi,{title:"灰线见闻录",subtitle:"THINGS & PEOPLE · 旧物与故人",appearance:"book",wide:!0,onClose:$,children:d.jsx(iw,{state:s})}),l==="help"&&d.jsx(mi,{title:"新店主手册",subtitle:"灰线商行 · 给新店主的一封信",appearance:"guide",wide:!0,onClose:$,children:d.jsx(sw,{})}),l==="community"&&d.jsx(mi,{title:"社区告示板",subtitle:"聚落公共事务 · 今日委托",appearance:"notice",onClose:$,children:d.jsx(aw,{state:s,send:_e})}),l==="inspect"&&d.jsx(mi,{title:"旧物鉴定台",subtitle:"LOOK CLOSER · 让证据说话",appearance:"workbench",wide:!0,onClose:()=>u(g.current),children:d.jsx(ew,{state:s,targetUid:p,send:_e,onClose:()=>u(g.current),assist:i.assist})}),l==="settings"&&d.jsxs(mi,{title:"歇一歇，再开张",subtitle:"店主手册 · 营业时间暂停中",appearance:"settings",wide:!0,onClose:$,children:[d.jsxs("div",{className:"settings-list",children:[d.jsxs("h3",{className:"manual-section-title",children:[d.jsx("span",{children:"01"}),"把小店调成喜欢的样子"]}),[["sound","游戏音效","门铃、纸页与成交的声音。"],["largeText","放大字号","让对白与物品说明更容易阅读。"],["reducedMotion","减少动态","关闭镜头视差、浮尘位移和角色呼吸。"],["assist","鉴定辅助","允许直接完成检查动作，耗时不变。"]].map(([D,Ce,Ve])=>d.jsxs("button",{className:"setting-row",role:"switch","aria-checked":i[D],onClick:()=>o(Qe=>({...Qe,[D]:!Qe[D]})),children:[d.jsxs("span",{children:[d.jsx("b",{children:Ce}),d.jsx("small",{children:Ve})]}),d.jsx("i",{className:`toggle ${i[D]?"on":""}`})]},D))]}),d.jsxs("div",{className:"settings-actions",children:[d.jsxs("div",{className:"manual-keepsake",children:[d.jsx(af,{}),d.jsxs("span",{children:["灰线旧站 · 第 ",s.day," 天"]}),d.jsx("strong",{children:"这盏灯，等你回来。"}),d.jsx("small",{children:"调整设置和阅读，不会消耗营业时间。"})]}),d.jsxs("h3",{className:"manual-section-title",children:[d.jsx("span",{children:"02"}),"营业与存档"]}),d.jsxs("button",{className:"button primary full",onClick:$,children:[d.jsx(go,{size:17}),"继续营业"]}),d.jsxs("button",{className:"button secondary full",onClick:()=>u("restart"),children:[d.jsx(Ap,{size:16}),"开始新的七日"]}),d.jsxs("div",{className:"save-tools",children:[d.jsx("button",{className:"text-button",onClick:()=>{const D=new Blob([JSON.stringify(s)],{type:"application/json"}),Ce=document.createElement("a");Ce.href=URL.createObjectURL(D),Ce.download=`greyline-day${s.day}.json`,Ce.click(),setTimeout(()=>URL.revokeObjectURL(Ce.href),1e3)},children:"导出存档"}),d.jsxs("label",{className:"text-button import-save",role:"button",tabIndex:0,onKeyDown:D=>{var Ce;(D.key==="Enter"||D.key===" ")&&(D.preventDefault(),(Ce=D.currentTarget.querySelector("input"))==null||Ce.click())},children:["导入存档",d.jsx("input",{type:"file",accept:"application/json,.json",onChange:D=>{var Ce;Ae((Ce=D.target.files)==null?void 0:Ce[0]),D.target.value=""}})]})]}),N&&d.jsx("p",{className:"danger-text",role:"status",children:N}),d.jsxs("p",{className:"muted small centered",children:["种子 ",s.seed," · 无联网、无广告 · 进度保存在当前浏览器"]}),M&&d.jsx("p",{className:"danger-text",children:"本地存储不可用，请导出存档以免丢失进度。"})]})]}),l==="restart"&&d.jsx(mi,{title:"新的七日，新的故事",subtitle:"A NEW BEGINNING",appearance:"permit",onClose:()=>u("settings"),children:d.jsxs("div",{className:"restart-content",children:[d.jsx(Ln,{name:"keys"}),d.jsx("p",{children:"重新开店会替换本浏览器的当前进度。需要保留时，请先在设置中导出存档。"}),d.jsxs("label",{children:["经营种子",d.jsx("input",{value:H,maxLength:64,onChange:D=>I(D.target.value)})]}),d.jsx("p",{className:"muted small",children:"前两笔交易固定教学，之后的货物、行情与来客随种子变化。同一种子可复现同一过程。"}),d.jsxs("button",{className:"button primary full",onClick:()=>Le(H),children:["确认新开局 ",d.jsx(go,{size:17})]}),d.jsx("button",{className:"button secondary full",onClick:()=>{const D=`GREYLINE-${Date.now().toString(36).toUpperCase()}`;I(D),Le(D)},children:"随机种子开局"})]})}),S!==null&&d.jsx(mi,{title:"再斟酌一下报价？",subtitle:"REPUTATION MATTERS",appearance:"ticket",onClose:()=>E(null),children:d.jsxs("div",{className:"confirmation-content",children:[d.jsx(Ln,{name:"seal"}),d.jsxs("p",{children:["这个价格明显偏离你当前看到的估值。提交会使信誉下降 ",d.jsx("b",{children:"2 点"}),"，本次接待最多扣一次。"]}),d.jsxs("div",{className:"confirm-price",children:[d.jsx("span",{children:"即将提交的报价"}),d.jsx(Di,{amount:S})]}),d.jsx("button",{className:"button primary full",onClick:()=>{_e({type:"OFFER",price:S,acknowledge:!0}),E(null)},children:"仍然提交报价"}),d.jsx("button",{className:"button secondary full",onClick:()=>E(null),children:"返回修改 · 不消耗时间"})]})}),j&&d.jsx(mi,{title:"交给聚落回收箱？",subtitle:"A SECOND USE · 应急变现",appearance:"ticket",onClose:()=>T(null),children:d.jsxs("div",{className:"confirmation-content",children:[d.jsx(Ui,{id:j.defId,className:"confirm-sprite"}),d.jsx("h3",{children:Zt(j.defId).name}),d.jsxs("div",{className:"confirm-price",children:[d.jsxs("span",{children:["购入成本 ",j.cost," 票"]}),d.jsx(Di,{amount:Math.floor(As(j,s.market)*.35)})]}),d.jsxs("p",{children:["耗时 6 分钟，完成后无法取回。不计入售出件数，不增加信誉。今日剩余 ",2-s.recycled," ","次。"]}),d.jsx("button",{className:"button primary full",onClick:()=>{_e({type:"RECYCLE",uid:j.uid}),T(null)},children:"确认回收变现"})]})}),s.phase==="closing"&&d.jsx(mi,{title:"今天，就到这里吧",subtitle:`CLOSING TIME · 第 ${s.day} 天`,appearance:"receipt",dismissible:fn(s)>0,onClose:()=>_e({type:"BACK"}),children:d.jsxs("div",{className:"closing-content",children:[d.jsx(Ln,{name:"watch"}),d.jsx("p",{children:"合上账本前，再看一眼今天的收支。"}),d.jsxs("div",{className:"closing-rows",children:[d.jsxs("div",{children:[d.jsx("span",{children:"手头现金"}),d.jsx(Di,{amount:s.cash})]}),d.jsxs("div",{children:[d.jsx("span",{children:"每日耗材"}),d.jsx("span",{children:"−15 票"})]}),$e>0&&d.jsxs("div",{children:[d.jsx("span",{children:"今日到期租金"}),d.jsxs("span",{children:["−",$e," 票"]})]}),d.jsxs("div",{className:"total",children:[d.jsx("span",{children:"结算后现金"}),s.cash>=15+$e?d.jsx(Di,{amount:s.cash-15-$e}):d.jsx("span",{className:"danger-text",children:"无法结清"})]})]}),s.cash<15+$e&&d.jsxs("div",{className:"closing-warning",children:["距今日费用还差 ",15+$e-s.cash," 票。现在结算将无法续业。",fn(s)>0?"可以返回营业，尝试委托或回收变现。":"营业时间已经用尽。"]}),s.commission==="available"&&fn(s)>=90&&d.jsx("p",{className:"muted small",children:"今日社区委托尚未完成，仍可返回赚取 40 票。"}),He&&d.jsx("p",{className:"muted small",children:"当前未交割的交易将取消，不付款、不转移货物。"}),d.jsxs("button",{className:"button primary full",onClick:()=>{u(null),_e({type:"SETTLE"})},children:["确认打烊并结算 ",d.jsx(go,{size:17})]}),fn(s)>0&&d.jsx("button",{className:"button secondary full",onClick:()=>_e({type:"BACK"}),children:"再营业一会儿"})]})}),s.phase==="report"&&s.report&&d.jsx(mi,{title:`第 ${s.day} 天 · 营业札记`,subtitle:"THE DAY IN NUMBERS",appearance:"receipt",dismissible:!1,onClose:()=>{},children:d.jsxs("div",{className:"report-content",children:[d.jsx("span",{className:"report-stamp",children:s.outcome==="bankrupt"?"未能结清":"已结清"}),d.jsx("p",{children:"灯光慢慢暗下来，今天的故事都留在账本里。"}),d.jsxs("div",{className:"report-rows",children:[d.jsxs("div",{children:[d.jsxs("span",{children:["营业收入 ",d.jsx("small",{children:"销售、委托与回收"})]}),d.jsxs("b",{children:["+",s.report.income," 票"]})]}),d.jsxs("div",{children:[d.jsx("span",{children:"收购支出"}),d.jsxs("b",{children:["−",s.report.purchases," 票"]})]}),d.jsxs("div",{children:[d.jsx("span",{children:"已付固定费用"}),d.jsxs("b",{children:["−",s.report.fees," 票"]})]}),d.jsxs("div",{className:"gross-row",children:[d.jsx("span",{children:"其中：已实现销售毛利"}),d.jsxs("span",{children:[s.report.gross," 票"]})]}),d.jsxs("div",{className:"total",children:[d.jsx("span",{children:"期末现金"}),d.jsx(Di,{amount:s.cash})]})]}),s.report.missing>0&&d.jsxs("p",{className:"danger-text",children:["到期费用仍缺 ",s.report.missing," 票，租约未能继续。"]}),d.jsx("p",{className:"report-tomorrow",children:s.outcome?"七日之约，走到了这一页。":`明日提醒：${s.day+1===3?"准备 90 票租金，别忘了留出耗材。":s.day+1===7?"最后一天，准备 210 票租金与周转金。":"行情将更新，记得把新收的旧物上架。"}`}),d.jsxs("button",{className:"button primary full",onClick:()=>_e({type:"NEXT"}),children:[s.outcome?"翻到故事的最后一页":`迎接第 ${s.day+1} 天`,d.jsx(go,{size:17})]})]})}),s.phase==="ending"&&!l&&d.jsx(mi,{title:s.outcome==="win"?"这盏灯，会继续亮着":s.outcome==="survive"?"小店还在，故事待续":"暂时，把门轻轻带上",subtitle:s.outcome==="win"?"ENDING 01 · 长明的旧货铺":s.outcome==="survive"?"ENDING 02 · 勉强续业":"ENDING 03 · 来日再开张",dismissible:!1,wide:!0,appearance:"ending",onClose:()=>{},children:d.jsxs("div",{className:"ending-content",children:[d.jsxs("div",{className:"ending-art",children:[d.jsx("div",{}),d.jsx(gy,{size:38}),d.jsx("blockquote",{children:s.outcome==="win"?`旧物找到了新家，
你也一样。`:s.outcome==="survive"?`站台还有来客，
明天还有机会。`:`每一次重新开门，
都是新的开始。`})]}),d.jsxs("div",{className:"ending-story",children:[d.jsx("p",{children:s.outcome==="win"?"第七天的夜里，陶叔送来一碗热汤，周砾替门轴上了油。林鹭说，远处的商队已经记住了你的招牌。你把新的租约压在台灯下，门口的瓶盖铃铛，明天还会响。":s.outcome==="survive"?"租金结清了，但柜台上的票子和货架上的空位提醒你，经营还需要一点耐心。聚落愿意再给你一次机会。下一回，旧物会找到更合适的人。":"票子没能凑够，租约暂时停在了这一页。你把没卖出的旧物仔细收好，擦净台灯。门外仍有风，下一次，你会更懂得怎么和这座聚落做生意。"}),d.jsx("div",{className:"ending-goals",children:[[s.cash>=120,"期末现金",`${s.cash} / 120 票`],[s.reputation>=40,"店铺信誉",`${s.reputation} / 40`],[s.sold>=12,"累计售出",`${s.sold} / 12 件`]].map(([D,Ce,Ve])=>d.jsxs("div",{children:[D?d.jsx(Fa,{size:17}):d.jsx(Em,{size:17}),d.jsx("span",{children:Ce}),d.jsx("b",{children:Ve})]},String(Ce)))}),d.jsxs("p",{className:"muted small",children:["经营种子：",s.seed," · 已经营 ",s.day," 天"]}),d.jsxs("button",{className:"button primary full",onClick:()=>Le(`GREYLINE-${Date.now().toString(36).toUpperCase()}`),children:[d.jsx(Ap,{size:16}),"再开一次店"]}),d.jsx("button",{className:"button secondary full",onClick:()=>u("ledger"),children:"翻阅这次的账本"})]})]})})]})}aE.createRoot(document.getElementById("root")).render(d.jsx(Q1.StrictMode,{children:d.jsx(mw,{})}));
