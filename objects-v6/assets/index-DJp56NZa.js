(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))o(l);new MutationObserver(l=>{for(const u of l)if(u.type==="childList")for(const d of u.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function i(l){const u={};return l.integrity&&(u.integrity=l.integrity),l.referrerPolicy&&(u.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?u.credentials="include":l.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function o(l){if(l.ep)return;l.ep=!0;const u=i(l);fetch(l.href,u)}})();function cy(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Uh={exports:{}},Ml={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var q_;function V1(){if(q_)return Ml;q_=1;var s=Symbol.for("react.transitional.element"),t=Symbol.for("react.fragment");function i(o,l,u){var d=null;if(u!==void 0&&(d=""+u),l.key!==void 0&&(d=""+l.key),"key"in l){u={};for(var h in l)h!=="key"&&(u[h]=l[h])}else u=l;return l=u.ref,{$$typeof:s,type:o,key:d,ref:l!==void 0?l:null,props:u}}return Ml.Fragment=t,Ml.jsx=i,Ml.jsxs=i,Ml}var Y_;function j1(){return Y_||(Y_=1,Uh.exports=V1()),Uh.exports}var m=j1(),Lh={exports:{}},ut={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var W_;function k1(){if(W_)return ut;W_=1;var s=Symbol.for("react.transitional.element"),t=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),u=Symbol.for("react.consumer"),d=Symbol.for("react.context"),h=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),g=Symbol.for("react.memo"),x=Symbol.for("react.lazy"),v=Symbol.for("react.activity"),M=Symbol.for("react.view_transition"),S=Symbol.iterator;function T(B){return B===null||typeof B!="object"?null:(B=S&&B[S]||B["@@iterator"],typeof B=="function"?B:null)}var C={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},E=Object.assign,y={};function O(B,le,J){this.props=B,this.context=le,this.refs=y,this.updater=J||C}O.prototype.isReactComponent={},O.prototype.setState=function(B,le){if(typeof B!="object"&&typeof B!="function"&&B!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,B,le,"setState")},O.prototype.forceUpdate=function(B){this.updater.enqueueForceUpdate(this,B,"forceUpdate")};function P(){}P.prototype=O.prototype;function U(B,le,J){this.props=B,this.context=le,this.refs=y,this.updater=J||C}var F=U.prototype=new P;F.constructor=U,E(F,O.prototype),F.isPureReactComponent=!0;var H=Array.isArray;function I(){}var k={H:null,A:null,T:null,S:null},N=Object.prototype.hasOwnProperty;function w(B,le,J){var ie=J.ref;return{$$typeof:s,type:B,key:le,ref:ie!==void 0?ie:null,props:J}}function G(B,le){return w(B.type,le,B.props)}function ae(B){return typeof B=="object"&&B!==null&&B.$$typeof===s}function de(B){var le={"=":"=0",":":"=2"};return"$"+B.replace(/[=:]/g,function(J){return le[J]})}var _e=/\/+/g;function fe(B,le){return typeof B=="object"&&B!==null&&B.key!=null?de(""+B.key):le.toString(36)}function X(B){switch(B.status){case"fulfilled":return B.value;case"rejected":throw B.reason;default:switch(typeof B.status=="string"?B.then(I,I):(B.status="pending",B.then(function(le){B.status==="pending"&&(B.status="fulfilled",B.value=le)},function(le){B.status==="pending"&&(B.status="rejected",B.reason=le)})),B.status){case"fulfilled":return B.value;case"rejected":throw B.reason}}throw B}function se(B,le,J,ie,Te){var De=typeof B;(De==="undefined"||De==="boolean")&&(B=null);var Re=!1;if(B===null)Re=!0;else switch(De){case"bigint":case"string":case"number":Re=!0;break;case"object":switch(B.$$typeof){case s:case t:Re=!0;break;case x:return Re=B._init,se(Re(B._payload),le,J,ie,Te)}}if(Re)return Te=Te(B),Re=ie===""?"."+fe(B,0):ie,H(Te)?(J="",Re!=null&&(J=Re.replace(_e,"$&/")+"/"),se(Te,le,J,"",function(D){return D})):Te!=null&&(ae(Te)&&(Te=G(Te,J+(Te.key==null||B&&B.key===Te.key?"":(""+Te.key).replace(_e,"$&/")+"/")+Re)),le.push(Te)),1;Re=0;var be=ie===""?".":ie+":";if(H(B))for(var ce=0;ce<B.length;ce++)ie=B[ce],De=be+fe(ie,ce),Re+=se(ie,le,J,De,Te);else if(ce=T(B),typeof ce=="function")for(B=ce.call(B),ce=0;!(ie=B.next()).done;)ie=ie.value,De=be+fe(ie,ce++),Re+=se(ie,le,J,De,Te);else if(De==="object"){if(typeof B.then=="function")return se(X(B),le,J,ie,Te);throw le=String(B),Error("Objects are not valid as a React child (found: "+(le==="[object Object]"?"object with keys {"+Object.keys(B).join(", ")+"}":le)+"). If you meant to render a collection of children, use an array instead.")}return Re}function Y(B,le,J){if(B==null)return B;var ie=[],Te=0;return se(B,ie,"","",function(De){return le.call(J,De,Te++)}),ie}function xe(B){if(B._status===-1){var le=B._result,J=le();J.then(function(ie){(B._status===0||B._status===-1)&&(B._status=1,B._result=ie,J.status===void 0&&(J.status="fulfilled",J.value=ie))},function(ie){(B._status===0||B._status===-1)&&(B._status=2,B._result=ie,J.status===void 0&&(J.status="rejected",J.reason=ie))}),B._status===-1&&(B._status=0,B._result=J)}if(B._status===1)return B._result.default;throw B._result}var Me=typeof reportError=="function"?reportError:function(B){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var le=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof B=="object"&&B!==null&&typeof B.message=="string"?String(B.message):String(B),error:B});if(!window.dispatchEvent(le))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",B);return}console.error(B)};function ze(B){var le=k.T,J={};J.types=le!==null?le.types:null,k.T=J;try{var ie=B(),Te=k.S;Te!==null&&Te(J,ie),typeof ie=="object"&&ie!==null&&typeof ie.then=="function"&&ie.then(I,Me)}catch(De){Me(De)}finally{le!==null&&J.types!==null&&(le.types=J.types),k.T=le}}function ot(B){var le=k.T;if(le!==null){var J=le.types;J===null?le.types=[B]:J.indexOf(B)===-1&&J.push(B)}else ze(ot.bind(null,B))}var ht={map:Y,forEach:function(B,le,J){Y(B,function(){le.apply(this,arguments)},J)},count:function(B){var le=0;return Y(B,function(){le++}),le},toArray:function(B){return Y(B,function(le){return le})||[]},only:function(B){if(!ae(B))throw Error("React.Children.only expected to receive a single React element child.");return B}};return ut.Activity=v,ut.Children=ht,ut.Component=O,ut.Fragment=i,ut.Profiler=l,ut.PureComponent=U,ut.StrictMode=o,ut.Suspense=p,ut.ViewTransition=M,ut.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=k,ut.__COMPILER_RUNTIME={__proto__:null,c:function(B){return k.H.useMemoCache(B)}},ut.addTransitionType=ot,ut.cache=function(B){return function(){return B.apply(null,arguments)}},ut.cacheSignal=function(){return null},ut.cloneElement=function(B,le,J){if(B==null)throw Error("The argument must be a React element, but you passed "+B+".");var ie=E({},B.props),Te=B.key;if(le!=null)for(De in le.key!==void 0&&(Te=""+le.key),le)!N.call(le,De)||De==="key"||De==="__self"||De==="__source"||De==="ref"&&le.ref===void 0||(ie[De]=le[De]);var De=arguments.length-2;if(De===1)ie.children=J;else if(1<De){for(var Re=Array(De),be=0;be<De;be++)Re[be]=arguments[be+2];ie.children=Re}return w(B.type,Te,ie)},ut.createContext=function(B){return B={$$typeof:d,_currentValue:B,_currentValue2:B,_threadCount:0,Provider:null,Consumer:null},B.Provider=B,B.Consumer={$$typeof:u,_context:B},B},ut.createElement=function(B,le,J){var ie,Te={},De=null;if(le!=null)for(ie in le.key!==void 0&&(De=""+le.key),le)N.call(le,ie)&&ie!=="key"&&ie!=="__self"&&ie!=="__source"&&(Te[ie]=le[ie]);var Re=arguments.length-2;if(Re===1)Te.children=J;else if(1<Re){for(var be=Array(Re),ce=0;ce<Re;ce++)be[ce]=arguments[ce+2];Te.children=be}if(B&&B.defaultProps)for(ie in Re=B.defaultProps,Re)Te[ie]===void 0&&(Te[ie]=Re[ie]);return w(B,De,Te)},ut.createRef=function(){return{current:null}},ut.forwardRef=function(B){return{$$typeof:h,render:B}},ut.isValidElement=ae,ut.lazy=function(B){return{$$typeof:x,_payload:{_status:-1,_result:B},_init:xe}},ut.memo=function(B,le){return{$$typeof:g,type:B,compare:le===void 0?null:le}},ut.startTransition=ze,ut.unstable_useCacheRefresh=function(){return k.H.useCacheRefresh()},ut.use=function(B){return k.H.use(B)},ut.useActionState=function(B,le,J){return k.H.useActionState(B,le,J)},ut.useCallback=function(B,le){return k.H.useCallback(B,le)},ut.useContext=function(B){return k.H.useContext(B)},ut.useDebugValue=function(){},ut.useDeferredValue=function(B,le){return k.H.useDeferredValue(B,le)},ut.useEffect=function(B,le){return k.H.useEffect(B,le)},ut.useEffectEvent=function(B){return k.H.useEffectEvent(B)},ut.useId=function(){return k.H.useId()},ut.useImperativeHandle=function(B,le,J){return k.H.useImperativeHandle(B,le,J)},ut.useInsertionEffect=function(B,le){return k.H.useInsertionEffect(B,le)},ut.useLayoutEffect=function(B,le){return k.H.useLayoutEffect(B,le)},ut.useMemo=function(B,le){return k.H.useMemo(B,le)},ut.useOptimistic=function(B,le){return k.H.useOptimistic(B,le)},ut.useReducer=function(B,le,J){return k.H.useReducer(B,le,J)},ut.useRef=function(B){return k.H.useRef(B)},ut.useState=function(B){return k.H.useState(B)},ut.useSyncExternalStore=function(B,le,J){return k.H.useSyncExternalStore(B,le,J)},ut.useTransition=function(){return k.H.useTransition()},ut.version="19.3.1",ut}var Z_;function vm(){return Z_||(Z_=1,Lh.exports=k1()),Lh.exports}var Qe=vm();const X1=cy(Qe);var Oh={exports:{}},El={},zh={exports:{}},Ph={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var K_;function q1(){return K_||(K_=1,(function(s){function t(X,se){var Y=X.length;X.push(se);e:for(;0<Y;){var xe=Y-1>>>1,Me=X[xe];if(0<l(Me,se))X[xe]=se,X[Y]=Me,Y=xe;else break e}}function i(X){return X.length===0?null:X[0]}function o(X){if(X.length===0)return null;var se=X[0],Y=X.pop();if(Y!==se){X[0]=Y;e:for(var xe=0,Me=X.length,ze=Me>>>1;xe<ze;){var ot=2*(xe+1)-1,ht=X[ot],B=ot+1,le=X[B];if(0>l(ht,Y))B<Me&&0>l(le,ht)?(X[xe]=le,X[B]=Y,xe=B):(X[xe]=ht,X[ot]=Y,xe=ot);else if(B<Me&&0>l(le,Y))X[xe]=le,X[B]=Y,xe=B;else break e}}return se}function l(X,se){var Y=X.sortIndex-se.sortIndex;return Y!==0?Y:X.id-se.id}if(s.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var u=performance;s.unstable_now=function(){return u.now()}}else{var d=Date,h=d.now();s.unstable_now=function(){return d.now()-h}}var p=[],g=[],x=1,v=null,M=3,S=!1,T=!1,C=!1,E=!1,y=typeof setTimeout=="function"?setTimeout:null,O=typeof clearTimeout=="function"?clearTimeout:null,P=typeof setImmediate<"u"?setImmediate:null;function U(X){for(var se=i(g);se!==null;){if(se.callback===null)o(g);else if(se.startTime<=X)o(g),se.sortIndex=se.expirationTime,t(p,se);else break;se=i(g)}}function F(X){if(C=!1,U(X),!T)if(i(p)!==null)T=!0,H||(H=!0,ae());else{var se=i(g);se!==null&&fe(F,se.startTime-X)}}var H=!1,I=-1,k=5,N=-1;function w(){return E?!0:!(s.unstable_now()-N<k)}function G(){if(E=!1,H){var X=s.unstable_now();N=X;var se=!0;try{e:{T=!1,C&&(C=!1,O(I),I=-1),S=!0;var Y=M;try{t:{for(U(X),v=i(p);v!==null&&!(v.expirationTime>X&&w());){var xe=v.callback;if(typeof xe=="function"){v.callback=null,M=v.priorityLevel;var Me=xe(v.expirationTime<=X);if(X=s.unstable_now(),typeof Me=="function"){v.callback=Me,U(X),se=!0;break t}v===i(p)&&o(p),U(X)}else o(p);v=i(p)}if(v!==null)se=!0;else{var ze=i(g);ze!==null&&fe(F,ze.startTime-X),se=!1}}break e}finally{v=null,M=Y,S=!1}se=void 0}}finally{se?ae():H=!1}}}var ae;if(typeof P=="function")ae=function(){P(G)};else if(typeof MessageChannel<"u"){var de=new MessageChannel,_e=de.port2;de.port1.onmessage=G,ae=function(){_e.postMessage(null)}}else ae=function(){y(G,0)};function fe(X,se){I=y(function(){X(s.unstable_now())},se)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(X){X.callback=null},s.unstable_forceFrameRate=function(X){0>X||125<X?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):k=0<X?Math.floor(1e3/X):5},s.unstable_getCurrentPriorityLevel=function(){return M},s.unstable_next=function(X){switch(M){case 1:case 2:case 3:var se=3;break;default:se=M}var Y=M;M=se;try{return X()}finally{M=Y}},s.unstable_requestPaint=function(){E=!0},s.unstable_runWithPriority=function(X,se){switch(X){case 1:case 2:case 3:case 4:case 5:break;default:X=3}var Y=M;M=X;try{return se()}finally{M=Y}},s.unstable_scheduleCallback=function(X,se,Y){var xe=s.unstable_now();switch(typeof Y=="object"&&Y!==null?(Y=Y.delay,Y=typeof Y=="number"&&0<Y?xe+Y:xe):Y=xe,X){case 1:var Me=-1;break;case 2:Me=250;break;case 5:Me=1073741823;break;case 4:Me=1e4;break;default:Me=5e3}return Me=Y+Me,X={id:x++,callback:se,priorityLevel:X,startTime:Y,expirationTime:Me,sortIndex:-1},Y>xe?(X.sortIndex=Y,t(g,X),i(p)===null&&X===i(g)&&(C?(O(I),I=-1):C=!0,fe(F,Y-xe))):(X.sortIndex=Me,t(p,X),T||S||(T=!0,H||(H=!0,ae()))),X},s.unstable_shouldYield=w,s.unstable_wrapCallback=function(X){var se=M;return function(){var Y=M;M=se;try{return X.apply(this,arguments)}finally{M=Y}}}})(Ph)),Ph}var Q_;function Y1(){return Q_||(Q_=1,zh.exports=q1()),zh.exports}var Ih={exports:{}},Un={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var J_;function W1(){if(J_)return Un;J_=1;var s=vm();function t(x){var v="https://react.dev/errors/"+x;if(1<arguments.length){v+="?args[]="+encodeURIComponent(arguments[1]);for(var M=2;M<arguments.length;M++)v+="&args[]="+encodeURIComponent(arguments[M])}return"Minified React error #"+x+"; visit "+v+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var o={d:{f:i,r:function(){throw Error(t(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal"),u=Symbol.for("react.recoverable"),d=Symbol.for("react.optimistic_key");function h(x,v,M){var S=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:S==null?null:S===d?d:""+S,children:x,containerInfo:v,implementation:M}}var p=s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function g(x,v){if(x==="font")return"";if(typeof v=="string")return v==="use-credentials"?v:""}return Un.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=o,Un.browser=function(x){return{$$typeof:u,_reason:x}},Un.createPortal=function(x,v){var M=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!v||v.nodeType!==1&&v.nodeType!==9&&v.nodeType!==11)throw Error(t(299));return h(x,v,null,M)},Un.flushSync=function(x){var v=p.T,M=o.p;try{if(p.T=null,o.p=2,x)return x()}finally{p.T=v,o.p=M,o.d.f()}},Un.preconnect=function(x,v){typeof x=="string"&&(v?(v=v.crossOrigin,v=typeof v=="string"?v==="use-credentials"?v:"":void 0):v=null,o.d.C(x,v))},Un.prefetchDNS=function(x){typeof x=="string"&&o.d.D(x)},Un.preinit=function(x,v){if(typeof x=="string"&&v&&typeof v.as=="string"){var M=v.as,S=g(M,v.crossOrigin),T=typeof v.integrity=="string"?v.integrity:void 0,C=typeof v.fetchPriority=="string"?v.fetchPriority:void 0;M==="style"?o.d.S(x,typeof v.precedence=="string"?v.precedence:void 0,{crossOrigin:S,integrity:T,fetchPriority:C}):M==="script"&&o.d.X(x,{crossOrigin:S,integrity:T,fetchPriority:C,nonce:typeof v.nonce=="string"?v.nonce:void 0})}},Un.preinitModule=function(x,v){if(typeof x=="string")if(typeof v=="object"&&v!==null){if(v.as==null||v.as==="script"){var M=g(v.as,v.crossOrigin);o.d.M(x,{crossOrigin:M,integrity:typeof v.integrity=="string"?v.integrity:void 0,nonce:typeof v.nonce=="string"?v.nonce:void 0,fetchPriority:typeof v.fetchPriority=="string"?v.fetchPriority:void 0})}}else v==null&&o.d.M(x)},Un.preload=function(x,v){if(typeof x=="string"&&typeof v=="object"&&v!==null&&typeof v.as=="string"){var M=v.as,S=g(M,v.crossOrigin);o.d.L(x,M,{crossOrigin:S,integrity:typeof v.integrity=="string"?v.integrity:void 0,nonce:typeof v.nonce=="string"?v.nonce:void 0,type:typeof v.type=="string"?v.type:void 0,fetchPriority:typeof v.fetchPriority=="string"?v.fetchPriority:void 0,referrerPolicy:typeof v.referrerPolicy=="string"?v.referrerPolicy:void 0,imageSrcSet:typeof v.imageSrcSet=="string"?v.imageSrcSet:void 0,imageSizes:typeof v.imageSizes=="string"?v.imageSizes:void 0,media:typeof v.media=="string"?v.media:void 0})}},Un.preloadModule=function(x,v){if(typeof x=="string")if(v){var M=g(v.as,v.crossOrigin);o.d.m(x,{as:typeof v.as=="string"&&v.as!=="script"?v.as:void 0,crossOrigin:M,integrity:typeof v.integrity=="string"?v.integrity:void 0,nonce:typeof v.nonce=="string"?v.nonce:void 0,fetchPriority:typeof v.fetchPriority=="string"?v.fetchPriority:void 0})}else o.d.m(x)},Un.requestFormReset=function(x){o.d.r(x)},Un.unstable_batchedUpdates=function(x,v){return x(v)},Un.useFormState=function(x,v,M){return p.H.useFormState(x,v,M)},Un.useFormStatus=function(){return p.H.useHostTransitionStatus()},Un.version="19.3.1",Un}var $_;function Z1(){if($_)return Ih.exports;$_=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(t){console.error(t)}}return s(),Ih.exports=W1(),Ih.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ex;function K1(){if(ex)return El;ex=1;var s=Y1(),t=vm(),i=Z1();function o(e){var n="https://react.dev/errors/"+e;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function u(e){for(var n=e,a=n;a&&!a.alternate;)n=a,(n.flags&4098)!==0&&(e=n.return),a=n.return;for(;n.return;)n=n.return;return n.tag===3?e:null}function d(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function h(e){if(e.tag===31){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function p(e){if(u(e)!==e)throw Error(o(188))}function g(e){var n=e.alternate;if(!n){if(n=u(e),n===null)throw Error(o(188));return n!==e?null:e}for(var a=e,r=n;;){var c=a.return;if(c===null)break;var f=c.alternate;if(f===null){if(r=c.return,r!==null){a=r;continue}break}if(c.child===f.child){for(f=c.child;f;){if(f===a)return p(c),e;if(f===r)return p(c),n;f=f.sibling}throw Error(o(188))}if(a.return!==r.return)a=c,r=f;else{for(var _=!1,b=c.child;b;){if(b===a){_=!0,a=c,r=f;break}if(b===r){_=!0,r=c,a=f;break}b=b.sibling}if(!_){for(b=f.child;b;){if(b===a){_=!0,a=f,r=c;break}if(b===r){_=!0,r=f,a=c;break}b=b.sibling}if(!_)throw Error(o(189))}}if(a.alternate!==r)throw Error(o(190))}if(a.tag!==3)throw Error(o(188));return a.stateNode.current===a?e:n}function x(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e;for(e=e.child;e!==null;){if(n=x(e),n!==null)return n;e=e.sibling}return null}function v(e,n,a,r,c,f){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&a(e,r,c,f)||(e.tag!==22||e.memoizedState===null)&&(n||e.tag!==5&&e.tag!==27)&&v(e.child,n,a,r,c,f))return!0;e=e.sibling}return!1}function M(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function S(e){var n=!1;for(e=e.return;e!==null&&(e.tag===4&&(n=!0),!(e.tag===3||e.tag===5||e.tag===27));)e=e.return;return n}function T(e){var n=[null,null],a=M(e);return a===null||C(n,e,a.child,{foundSelf:!1}),n}function C(e,n,a,r){for(;a!==null;){if(a===n)r.foundSelf=!0;else if(a.tag===5||a.tag===27||a.tag===6){if(r.foundSelf)return e[1]=a,!0;e[0]=a}else if((a.tag!==22||a.memoizedState===null)&&C(e,n,a.child,r))return!0;a=a.sibling}return!1}function E(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(o(559))}}var y=null,O=null;function P(e,n,a){return e===a?!0:e===n?(y=e,!0):!1}function U(e,n,a){return e===a?(O=e,!1):e===n?(O!==null&&(y=e),!0):!1}function F(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function H(e,n,a){for(var r=0,c=e;c;c=a(c))r++;c=0;for(var f=n;f;f=a(f))c++;for(;0<r-c;)e=a(e),r--;for(;0<c-r;)n=a(n),c--;for(;r--;){if(e===n||n!==null&&e===n.alternate)return e;e=a(e),n=a(n)}return null}var I=Object.assign,k=Symbol.for("react.element"),N=Symbol.for("react.transitional.element"),w=Symbol.for("react.portal"),G=Symbol.for("react.fragment"),ae=Symbol.for("react.strict_mode"),de=Symbol.for("react.profiler"),_e=Symbol.for("react.consumer"),fe=Symbol.for("react.context"),X=Symbol.for("react.forward_ref"),se=Symbol.for("react.suspense"),Y=Symbol.for("react.suspense_list"),xe=Symbol.for("react.memo"),Me=Symbol.for("react.lazy"),ze=Symbol.for("react.activity"),ot=Symbol.for("react.legacy_hidden"),ht=Symbol.for("react.memo_cache_sentinel"),B=Symbol.for("react.view_transition"),le=Symbol.for("react.recoverable"),J=Symbol.iterator;function ie(e){return e===null||typeof e!="object"?null:(e=J&&e[J]||e["@@iterator"],typeof e=="function"?e:null)}var Te=Symbol.for("react.client.reference");function De(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Te?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case G:return"Fragment";case de:return"Profiler";case ae:return"StrictMode";case se:return"Suspense";case Y:return"SuspenseList";case ze:return"Activity";case B:return"ViewTransition"}if(typeof e=="object")switch(e.$$typeof){case w:return"Portal";case fe:return e.displayName||"Context";case _e:return(e._context.displayName||"Context")+".Consumer";case X:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case xe:return n=e.displayName||null,n!==null?n:De(e.type)||"Memo";case Me:n=e._payload,e=e._init;try{return De(e(n))}catch{}}return null}var Re=Array.isArray,be=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ce=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,D={pending:!1,data:null,method:null,action:null},lt=[],tt=-1;function $e(e){return{current:e}}function Pe(e){0>tt||(e.current=lt[tt],lt[tt]=null,tt--)}function at(e,n){tt++,lt[tt]=e.current,e.current=n}var me=$e(null),Oe=$e(null),Mt=$e(null),Ut=$e(null);function L(e,n){switch(at(Mt,n),at(Oe,e),at(me,null),n.nodeType){case 9:case 11:e=(e=n.documentElement)&&(e=e.namespaceURI)?t_(e):0;break;default:if(e=n.tagName,n=n.namespaceURI)n=t_(n),e=n_(n,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}Pe(me),at(me,e)}function A(){Pe(me),Pe(Oe),Pe(Mt)}function ee(e){var n=e.memoizedState;n!==null&&(Zr._currentValue=n.memoizedState,at(Ut,e)),n=me.current;var a=n_(n,e.type);n!==a&&(at(Oe,e),at(me,a))}function he(e){Oe.current===e&&(Pe(me),Pe(Oe)),Ut.current===e&&(Pe(Ut),Zr._currentValue=D)}var Ee,pe;function je(e){if(Ee===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);Ee=n&&n[1]||"",pe=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ee+e+pe}var ye=!1;function ke(e,n){if(!e||ye)return"";ye=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(n){var ve=function(){throw Error()};if(Object.defineProperty(ve.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(ve,[])}catch(Ie){var q=Ie}Reflect.construct(e,[],ve)}else{try{ve.call()}catch(Ie){q=Ie}ve=!1;try{var ne=Object.getOwnPropertyDescriptor(e.prototype,"props");Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),ve=!0,new e}finally{ve&&(ne!==void 0?Object.defineProperty(e.prototype,"props",ne):delete e.prototype.props)}}}else{try{throw Error()}catch(Ie){q=Ie}(ve=e())&&typeof ve.catch=="function"&&ve.catch(function(){})}}catch(Ie){if(Ie&&q&&typeof Ie.stack=="string")return[Ie.stack,q.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var c=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,"name");c&&c.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=r.DetermineComponentFrameRoot(),_=f[0],b=f[1];if(_&&b){var z=_.split(`
`),Z=b.split(`
`);for(c=r=0;r<z.length&&!z[r].includes("DetermineComponentFrameRoot");)r++;for(;c<Z.length&&!Z[c].includes("DetermineComponentFrameRoot");)c++;if(r===z.length||c===Z.length)for(r=z.length-1,c=Z.length-1;1<=r&&0<=c&&z[r]!==Z[c];)c--;for(;1<=r&&0<=c;r--,c--)if(z[r]!==Z[c]){if(r!==1||c!==1)do if(r--,c--,0>c||z[r]!==Z[c]){var re=`
`+z[r].replace(" at new "," at ");return e.displayName&&re.includes("<anonymous>")&&(re=re.replace("<anonymous>",e.displayName)),re}while(1<=r&&0<=c);break}}}finally{ye=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?je(a):""}function We(e,n){switch(e.tag){case 26:case 27:case 5:return je(e.type);case 16:return je("Lazy");case 13:return e.child!==n&&n!==null?je("Suspense Fallback"):je("Suspense");case 19:return je("SuspenseList");case 0:case 15:return ke(e.type,!1);case 11:return ke(e.type.render,!1);case 1:return ke(e.type,!0);case 31:return je("Activity");case 30:return je("ViewTransition");default:return""}}function Ae(e){try{var n="",a=null;do n+=We(e,a),a=e,e=e.return;while(e);return n}catch(r){return`
Error generating stack: `+r.message+`
`+r.stack}}var Be=Object.prototype.hasOwnProperty,rt=s.unstable_scheduleCallback,qe=s.unstable_cancelCallback,Fe=s.unstable_shouldYield,pt=s.unstable_requestPaint,j=s.unstable_now,Ne=s.unstable_getCurrentPriorityLevel,Le=s.unstable_ImmediatePriority,Ye=s.unstable_UserBlockingPriority,Ce=s.unstable_NormalPriority,Se=s.unstable_LowPriority,Je=s.unstable_IdlePriority,ft=s.log,qt=s.unstable_setDisableYieldValue,At=null,tn=null;function _n(e){if(typeof ft=="function"&&qt(e),tn&&typeof tn.setStrictMode=="function")try{tn.setStrictMode(At,e)}catch{}}var On=Math.clz32?Math.clz32:kl,fa=Math.log,Uo=Math.LN2;function kl(e){return e>>>=0,e===0?32:31-(fa(e)/Uo|0)|0}var bs=256,da=262144,As=4194304;function gi(e){var n=e&42;if(n!==0)return n;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Cs(e,n,a){var r=e.pendingLanes;if(r===0)return 0;var c=0,f=e.suspendedLanes,_=e.pingedLanes;e=e.warmLanes;var b=r&134217727;return b!==0?(r=b&~f,r!==0?c=gi(r):(_&=b,_!==0?c=gi(_):a||(a=b&~e,a!==0&&(c=gi(a))))):(b=r&~f,b!==0?c=gi(b):_!==0?c=gi(_):a||(a=r&~e,a!==0&&(c=gi(a)))),c===0?0:n!==0&&n!==c&&(n&f)===0&&(f=c&-c,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:c}function Ba(e,n){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&n)===0}function Xl(e,n){(n&8)!==0&&(n|=n&32);var a=e.entangledLanes;if(a!==0)for(e=e.entanglements,a&=n;0<a;){var r=31-On(a),c=1<<r;n|=e[r],a&=~c}return n}function rf(e,n){switch(e){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ql(){var e=As;return As<<=1,(As&62914560)===0&&(As=4194304),e}function Lo(e){for(var n=[],a=0;31>a;a++)n.push(e);return n}function Rs(e,n){e.pendingLanes|=n,n!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function of(e,n,a,r,c,f){var _=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var b=e.entanglements,z=e.expirationTimes,Z=e.hiddenUpdates;for(a=_&~a;0<a;){var re=31-On(a),ve=1<<re;b[re]=0,z[re]=-1;var q=Z[re];if(q!==null)for(Z[re]=null,re=0;re<q.length;re++){var ne=q[re];ne!==null&&(ne.lane&=-536870913)}a&=~ve}r!==0&&R(e,r,0),f!==0&&c===0&&e.tag!==0&&(e.suspendedLanes|=f&~(_&~n))}function R(e,n,a){e.pendingLanes|=n,e.suspendedLanes&=~n;var r=31-On(n);e.entangledLanes|=n,e.entanglements[r]=e.entanglements[r]|1073741824|a&261930}function K(e,n){var a=e.entangledLanes|=n;for(e=e.entanglements;a;){var r=31-On(a),c=1<<r;c&n|e[r]&n&&(e[r]|=n),a&=~c}}function oe(e,n){var a=n&-n;return a=(a&42)!==0?1:ue(a),(a&(e.suspendedLanes|n))!==0?0:a}function ue(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Q(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function we(){var e=ce.p;return e!==0?e:(e=window.event,e===void 0?32:F_(e.type))}function He(e,n){var a=ce.p;try{return ce.p=e,n()}finally{ce.p=a}}var Ve=Math.random().toString(36).slice(2),Ue="__reactFiber$"+Ve,Ze="__reactProps$"+Ve,st="__reactContainer$"+Ve,nt="__reactEvents$"+Ve,St="__reactListeners$"+Ve,Ht="__reactHandles$"+Ve,$t="__reactResources$"+Ve,It="__reactMarker$"+Ve,Ot="__reactLoad$"+Ve;function it(e){delete e[Ue],delete e[Ze],delete e[St],delete e[Ht]}function Bt(e){var n;if(n=e[Ue])return n;for(var a=e.parentNode;a;){if(n=a[st]||a[Ue]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(e=x_(e);e!==null;){if(a=e[Ue])return a;e=x_(e)}return n}e=a,a=e.parentNode}return null}function xt(e){if(e=e[Ue]||e[st]){var n=e.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return e}return null}function xn(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e.stateNode;throw Error(o(33))}function ni(e){var n=e[$t];return n||(n=e[$t]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function zt(e){e[It]=!0}function Fa(e){e[Ot]=void 0}var Kt=new Set,Hn={};function un(e,n){sn(e,n),sn(e+"Capture",n)}function sn(e,n){for(Hn[e]=n,e=0;e<n.length;e++)Kt.add(n[e])}var zn=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),dr={},Wi={};function oS(e){return Be.call(Wi,e)?!0:Be.call(dr,e)?!1:zn.test(e)?Wi[e]=!0:(dr[e]=!0,!1)}var Pt=!1;function Gm(){var e=Pt;return Pt=!1,e}function Yl(e,n,a){if(oS(n))if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(n);return;case"boolean":var r=n.toLowerCase().slice(0,5);if(r!=="data-"&&r!=="aria-"){e.removeAttribute(n);return}}e.setAttribute(n,a)}}function Wl(e,n,a){if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttribute(n,a)}}function ha(e,n,a,r){if(r===null)e.removeAttribute(a);else{switch(typeof r){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(n,a,r)}}function ii(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Vm(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function lS(e,n,a){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,n);if(!e.hasOwnProperty(n)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var c=r.get,f=r.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return c.call(this)},set:function(_){a=""+_,f.call(this,_)}}),Object.defineProperty(e,n,{enumerable:r.enumerable}),{getValue:function(){return a},setValue:function(_){a=""+_},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function lf(e){if(!e._valueTracker){var n=Vm(e)?"checked":"value";e._valueTracker=lS(e,n,""+e[n])}}function jm(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var a=n.getValue(),r="";return e&&(r=Vm(e)?e.checked?"true":"false":e.value),e=r,e!==a?(n.setValue(e),!0):!1}var cS=/[\n"\\]/g;function vi(e){return e.replace(cS,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function cf(e,n,a,r,c,f,_,b){e.name="",_!=null&&typeof _!="function"&&typeof _!="symbol"&&typeof _!="boolean"?e.type=_:e.removeAttribute("type"),n!=null?_==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+ii(n)):e.value!==""+ii(n)&&(e.value=""+ii(n)):_!=="submit"&&_!=="reset"||e.removeAttribute("value"),n!=null?_==="number"&&e.value==n?uf(e,ii(e.value)):uf(e,ii(n)):a!=null?uf(e,ii(a)):r!=null&&e.removeAttribute("value"),c==null&&f!=null&&(e.defaultChecked=!!f),c!=null&&(e.checked=c&&typeof c!="function"&&typeof c!="symbol"),b!=null&&typeof b!="function"&&typeof b!="symbol"&&typeof b!="boolean"?e.name=""+ii(b):e.removeAttribute("name")}function km(e,n,a,r,c,f,_,b){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(e.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null)){lf(e);return}a=a!=null?""+ii(a):"",n=n!=null?""+ii(n):a,b||n===e.value||(e.value=n),e.defaultValue=n}r=r??c,r=typeof r!="function"&&typeof r!="symbol"&&!!r,e.checked=b?e.checked:!!r,e.defaultChecked=!!r,_!=null&&typeof _!="function"&&typeof _!="symbol"&&typeof _!="boolean"&&(e.name=_),lf(e)}function uf(e,n){e.defaultValue!==""+n&&(e.defaultValue=""+n)}function hr(e,n,a,r){if(e=e.options,n){n={};for(var c=0;c<a.length;c++)n["$"+a[c]]=!0;for(a=0;a<e.length;a++)c=n.hasOwnProperty("$"+e[a].value),e[a].selected!==c&&(e[a].selected=c),c&&r&&(e[a].defaultSelected=!0)}else{for(a=""+ii(a),n=null,c=0;c<e.length;c++){if(e[c].value===a){e[c].selected=!0,r&&(e[c].defaultSelected=!0);return}n!==null||e[c].disabled||(n=e[c])}n!==null&&(n.selected=!0)}}function Xm(e,n,a){if(n!=null&&(n=""+ii(n),n!==e.value&&(e.value=n),a==null)){e.defaultValue!==n&&(e.defaultValue=n);return}e.defaultValue=a!=null?""+ii(a):""}function qm(e,n,a,r){if(n==null){if(r!=null){if(a!=null)throw Error(o(92));if(Re(r)){if(1<r.length)throw Error(o(93));r=r[0]}a=r}a==null&&(a=""),n=a}a=ii(n),e.defaultValue=a,r=e.textContent,r===a&&r!==""&&r!==null&&(e.value=r),lf(e)}function pr(e,n){if(n){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=n;return}}e.textContent=n}var uS=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Ym(e,n,a){var r=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?r?e.setProperty(n,""):n==="float"?e.cssFloat="":e[n]="":r?e.setProperty(n,a):typeof a!="number"||a===0||uS.has(n)?n==="float"?e.cssFloat=a:e[n]=(""+a).trim():e[n]=a+"px"}function Wm(e,n,a){if(n!=null&&typeof n!="object")throw Error(o(62));if(e=e.style,a!=null){for(var r in a)!a.hasOwnProperty(r)||n!=null&&n.hasOwnProperty(r)||(r.indexOf("--")===0?e.setProperty(r,""):r==="float"?e.cssFloat="":e[r]="",Pt=!0);for(var c in n)r=n[c],n.hasOwnProperty(c)&&a[c]!==r&&(Ym(e,c,r),Pt=!0)}else for(var f in n)n.hasOwnProperty(f)&&Ym(e,f,n[f])}function ff(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var fS=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),dS=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Zl(e){return dS.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Zi(){}var df=null;function hf(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var mr=null,gr=null;function Zm(e){var n=xt(e);if(n&&(e=n.stateNode)){var a=e[Ze]||null;e:switch(e=n.stateNode,n.type){case"input":if(cf(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+vi(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var r=a[n];if(r!==e&&r.form===e.form){var c=r[Ze]||null;if(!c)throw Error(o(90));cf(r,c.value,c.defaultValue,c.defaultValue,c.checked,c.defaultChecked,c.type,c.name)}}for(n=0;n<a.length;n++)r=a[n],r.form===e.form&&jm(r)}break e;case"textarea":Xm(e,a.value,a.defaultValue);break e;case"select":n=a.value,n!=null&&hr(e,!!a.multiple,n,!1)}}}var pf=!1;function Km(e,n,a){if(pf)return e(n,a);pf=!0;try{var r=e(n);return r}finally{if(pf=!1,(mr!==null||gr!==null)&&(Zc(),mr&&(n=mr,e=gr,gr=mr=null,Zm(n),e)))for(n=0;n<e.length;n++)Zm(e[n])}}function Oo(e,n){var a=e.stateNode;if(a===null)return null;var r=a[Ze]||null;if(r===null)return null;a=r[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(o(231,n,typeof a));return a}var pa=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),mf=!1;if(pa)try{var zo={};Object.defineProperty(zo,"passive",{get:function(){mf=!0}}),window.addEventListener("test",zo,zo),window.removeEventListener("test",zo,zo)}catch{mf=!1}var Ha=null,gf=null,Kl=null;function Qm(){if(Kl)return Kl;var e,n=gf,a=n.length,r,c="value"in Ha?Ha.value:Ha.textContent,f=c.length;for(e=0;e<a&&n[e]===c[e];e++);var _=a-e;for(r=1;r<=_&&n[a-r]===c[f-r];r++);return Kl=c.slice(e,1<r?1-r:void 0)}function Ql(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function Jl(){return!0}function Jm(){return!1}function Gn(e){function n(a,r,c,f,_){this._reactName=a,this._targetInst=c,this.type=r,this.nativeEvent=f,this.target=_,this.currentTarget=null;for(var b in e)e.hasOwnProperty(b)&&(a=e[b],this[b]=a?a(f):f[b]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?Jl:Jm,this.isPropagationStopped=Jm,this}return I(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Jl)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Jl)},persist:function(){},isPersistent:Jl}),n}var Ga={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},$l=Gn(Ga),Po=I({},Ga,{view:0,detail:0}),hS=Gn(Po),vf,_f,Io,ec=I({},Po,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:yf,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Io&&(Io&&e.type==="mousemove"?(vf=e.screenX-Io.screenX,_f=e.screenY-Io.screenY):_f=vf=0,Io=e),vf)},movementY:function(e){return"movementY"in e?e.movementY:_f}}),$m=Gn(ec),pS=I({},ec,{dataTransfer:0}),mS=Gn(pS),gS=I({},Po,{relatedTarget:0}),xf=Gn(gS),vS=I({},Ga,{animationName:0,elapsedTime:0,pseudoElement:0}),_S=Gn(vS),xS=I({},Ga,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),yS=Gn(xS),SS=I({},Ga,{data:0}),eg=Gn(SS),MS={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},ES={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},TS={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function bS(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=TS[e])?!!n[e]:!1}function yf(){return bS}var AS=I({},Po,{key:function(e){if(e.key){var n=MS[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=Ql(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?ES[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:yf,charCode:function(e){return e.type==="keypress"?Ql(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Ql(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),CS=Gn(AS),RS=I({},ec,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),tg=Gn(RS),wS=I({},Ga,{submitter:0}),NS=Gn(wS),DS=I({},Po,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:yf}),US=Gn(DS),LS=I({},Ga,{propertyName:0,elapsedTime:0,pseudoElement:0}),OS=Gn(LS),zS=I({},ec,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),PS=Gn(zS),IS=I({},Ga,{newState:0,oldState:0,source:0}),BS=Gn(IS),FS=[9,13,27,32],Sf=pa&&"CompositionEvent"in window,Bo=null;pa&&"documentMode"in document&&(Bo=document.documentMode);var HS=pa&&"TextEvent"in window&&!Bo,ng=pa&&(!Sf||Bo&&8<Bo&&11>=Bo),ig=" ",ag=!1;function sg(e,n){switch(e){case"keyup":return FS.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function rg(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var vr=!1;function GS(e,n){switch(e){case"compositionend":return rg(n);case"keypress":return n.which!==32?null:(ag=!0,ig);case"textInput":return e=n.data,e===ig&&ag?null:e;default:return null}}function VS(e,n){if(vr)return e==="compositionend"||!Sf&&sg(e,n)?(e=Qm(),Kl=gf=Ha=null,vr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return ng&&n.locale!=="ko"?null:n.data;default:return null}}var jS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function og(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!jS[e.type]:n==="textarea"}function lg(e,n,a,r){mr?gr?gr.push(r):gr=[r]:mr=r,n=tu(n,"onChange"),0<n.length&&(a=new $l("onChange","change",null,a,r),e.push({event:a,listeners:n}))}var Fo=null,Ho=null;function kS(e){Zv(e,0)}function tc(e){var n=xn(e);if(jm(n))return e}function cg(e,n){if(e==="change")return n}var ug=!1;if(pa){var Mf;if(pa){var Ef="oninput"in document;if(!Ef){var fg=document.createElement("div");fg.setAttribute("oninput","return;"),Ef=typeof fg.oninput=="function"}Mf=Ef}else Mf=!1;ug=Mf&&(!document.documentMode||9<document.documentMode)}function dg(){Fo&&(Fo.detachEvent("onpropertychange",hg),Ho=Fo=null)}function hg(e){if(e.propertyName==="value"&&tc(Ho)){var n=[];lg(n,Ho,e,hf(e)),Km(kS,n)}}function XS(e,n,a){e==="focusin"?(dg(),Fo=n,Ho=a,Fo.attachEvent("onpropertychange",hg)):e==="focusout"&&dg()}function qS(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return tc(Ho)}function YS(e,n){if(e==="click")return tc(n)}function WS(e,n){if(e==="input"||e==="change")return tc(n)}function ZS(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var ai=typeof Object.is=="function"?Object.is:ZS;function Go(e,n){if(ai(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var a=Object.keys(e),r=Object.keys(n);if(a.length!==r.length)return!1;for(r=0;r<a.length;r++){var c=a[r];if(!Be.call(n,c)||!ai(e[c],n[c]))return!1}return!0}function Tf(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function pg(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function mg(e,n){var a=pg(e);e=0;for(var r;a;){if(a.nodeType===3){if(r=e+a.textContent.length,e<=n&&r>=n)return{node:a,offset:n-e};e=r}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=pg(a)}}function gg(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?gg(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function vg(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var n=Tf(e.document);n instanceof e.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)e=n.contentWindow;else break;n=Tf(e.document)}return n}function bf(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}var KS=pa&&"documentMode"in document&&11>=document.documentMode,_r=null,Af=null,Vo=null,Cf=!1;function _g(e,n,a){var r=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Cf||_r==null||_r!==Tf(r)||(r=_r,"selectionStart"in r&&bf(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Vo&&Go(Vo,r)||(Vo=r,r=tu(Af,"onSelect"),0<r.length&&(n=new $l("onSelect","select",null,n,a),e.push({event:n,listeners:r}),n.target=_r)))}function ws(e,n){var a={};return a[e.toLowerCase()]=n.toLowerCase(),a["Webkit"+e]="webkit"+n,a["Moz"+e]="moz"+n,a}var xr={animationend:ws("Animation","AnimationEnd"),animationiteration:ws("Animation","AnimationIteration"),animationstart:ws("Animation","AnimationStart"),transitionrun:ws("Transition","TransitionRun"),transitionstart:ws("Transition","TransitionStart"),transitioncancel:ws("Transition","TransitionCancel"),transitionend:ws("Transition","TransitionEnd")},Rf={},xg={};pa&&(xg=document.createElement("div").style,"AnimationEvent"in window||(delete xr.animationend.animation,delete xr.animationiteration.animation,delete xr.animationstart.animation),"TransitionEvent"in window||delete xr.transitionend.transition);function Ns(e){if(Rf[e])return Rf[e];if(!xr[e])return e;var n=xr[e],a;for(a in n)if(n.hasOwnProperty(a)&&a in xg)return Rf[e]=n[a];return e}var yg=Ns("animationend"),Sg=Ns("animationiteration"),Mg=Ns("animationstart"),QS=Ns("transitionrun"),JS=Ns("transitionstart"),$S=Ns("transitioncancel"),Eg=Ns("transitionend"),Tg=new Map,wf="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");wf.push("scrollEnd");function Li(e,n){Tg.set(e,n),un(n,[e])}var eM=0;function ma(e,n){if(e.name!=null&&e.name!=="auto")return e.name;if(n.autoName!==null)return n.autoName;e=Ii.identifierPrefix;var a=eM++;return e="_"+e+"t_"+a.toString(32)+"_",n.autoName=e}function bg(e){if(e==null||typeof e=="string")return e;var n=null,a=Fr;if(a!==null)for(var r=0;r<a.length;r++){var c=e[a[r]];if(c!=null){if(c==="none")return"none";n=n==null?c:n+(" "+c)}}return n??e.default}function ga(e,n){return e=bg(e),n=bg(n),n==null?e==="auto"?null:e:n==="auto"?null:n}var nc=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},_i=[],yr=0,Nf=0;function ic(){for(var e=yr,n=Nf=yr=0;n<e;){var a=_i[n];_i[n++]=null;var r=_i[n];_i[n++]=null;var c=_i[n];_i[n++]=null;var f=_i[n];if(_i[n++]=null,r!==null&&c!==null){var _=r.pending;_===null?c.next=c:(c.next=_.next,_.next=c),r.pending=c}f!==0&&Ag(a,c,f)}}function ac(e,n,a,r){_i[yr++]=e,_i[yr++]=n,_i[yr++]=a,_i[yr++]=r,Nf|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function Df(e,n,a,r){return ac(e,n,a,r),sc(e)}function Ds(e,n){return ac(e,null,null,n),sc(e)}function Ag(e,n,a){e.lanes|=a;var r=e.alternate;r!==null&&(r.lanes|=a);for(var c=!1,f=e.return;f!==null;)f.childLanes|=a,r=f.alternate,r!==null&&(r.childLanes|=a),f.tag===22&&(e=f.stateNode,e===null||e._visibility&1||(c=!0)),e=f,f=f.return;return e.tag===3?(f=e.stateNode,c&&n!==null&&(c=31-On(a),e=f.hiddenUpdates,r=e[c],r===null?e[c]=[n]:r.push(n),n.lane=a|536870912),f):null}function sc(e){if(50<ul)throw ul=0,Wc=null,Error(o(185));for(var n=e.return;n!==null;)e=n,n=e.return;return e.tag===3?e.stateNode:null}var Sr={};function tM(e,n,a,r){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Wn(e,n,a,r){return new tM(e,n,a,r)}function Uf(e){return e=e.prototype,!(!e||!e.isReactComponent)}function va(e,n){var a=e.alternate;return a===null?(a=Wn(e.tag,n,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=n,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&1206910976,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,n=e.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function Cg(e,n){e.flags&=1206910978;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=n,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,n=a.dependencies,e.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),e}function rc(e,n,a,r,c,f){var _=0;if(r=e,typeof r=="function")Uf(r)&&(_=1);else if(typeof r=="string")_=w1(e,a,me.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(r){case ze:return e=Wn(31,a,n,c),e.elementType=ze,e.lanes=f,e;case G:return Us(a.children,c,f,n);case ae:_=8,c|=24;break;case de:return e=Wn(12,a,n,c|2),e.elementType=de,e.lanes=f,e;case se:return e=Wn(13,a,n,c),e.elementType=se,e.lanes=f,e;case Y:return e=Wn(19,a,n,c),e.elementType=Y,e.lanes=f,e;case ot:case B:return e=c|32,e=Wn(30,a,n,e),e.elementType=B,e.lanes=f,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof r=="object"&&r!==null)switch(r.$$typeof){case fe:_=10;break e;case _e:_=9;break e;case X:_=11;break e;case xe:_=14;break e;case Me:_=16,r=null;break e}_=29,a=Error(o(130,e===null?"null":typeof e,"")),r=null}return n=Wn(_,a,n,c),n.elementType=e,n.type=r,n.lanes=f,n}function Us(e,n,a,r){return e=Wn(7,e,r,n),e.lanes=a,e}function Lf(e,n,a){return e=Wn(6,e,null,n),e.lanes=a,e}function Rg(e){var n=Wn(18,null,null,0);return n.stateNode=e,n}function Of(e,n,a){return n=Wn(4,e.children!==null?e.children:[],e.key,n),n.lanes=a,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}var wg=new WeakMap;function xi(e,n){if(typeof e=="object"&&e!==null){var a=wg.get(e);return a!==void 0?a:(n={value:e,source:n,stack:Ae(n)},wg.set(e,n),n)}return{value:e,source:n,stack:Ae(n)}}var Mr=[],Er=0,oc=null,jo=0,yi=[],Si=0,Va=null,Ki=1,Qi="";function _a(e,n){Mr[Er++]=jo,Mr[Er++]=oc,oc=e,jo=n}function Ng(e,n,a){yi[Si++]=Ki,yi[Si++]=Qi,yi[Si++]=Va,Va=e;var r=Ki;e=Qi;var c=32-On(r)-1;r&=~(1<<c),a+=1;var f=32-On(n)+c;if(30<f){var _=c-c%5;f=(r&(1<<_)-1).toString(32),r>>=_,c-=_,Ki=1<<32-On(n)+c|a<<c|r,Qi=f+e}else Ki=1<<f|a<<c|r,Qi=e}function lc(e){e.return!==null&&(_a(e,1),Ng(e,1,0))}function zf(e){for(;e===oc;)oc=Mr[--Er],Mr[Er]=null,jo=Mr[--Er],Mr[Er]=null;for(;e===Va;)Va=yi[--Si],yi[Si]=null,Qi=yi[--Si],yi[Si]=null,Ki=yi[--Si],yi[Si]=null}function Dg(e,n){yi[Si++]=Ki,yi[Si++]=Qi,yi[Si++]=Va,Ki=n.id,Qi=n.overflow,Va=e}var En=null,Qt=null,yt=!1,ja=null,Mi=!1,Pf=Error(o(519));function ka(e){var n=Error(o(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw ko(xi(n,e)),Pf}function Ug(e){var n=e.stateNode,a=e.type,r=e.memoizedProps;switch(n[Ue]=e,n[Ze]=r,a){case"dialog":Tt("cancel",n),Tt("close",n);break;case"iframe":case"object":case"embed":Tt("load",n);break;case"video":case"audio":for(a=0;a<dl.length;a++)Tt(dl[a],n);break;case"source":Tt("error",n);break;case"img":case"image":case"link":Tt("error",n),Tt("load",n);break;case"details":Tt("toggle",n);break;case"input":Tt("invalid",n),km(n,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case"select":Tt("invalid",n);break;case"textarea":Tt("invalid",n),qm(n,r.value,r.defaultValue,r.children)}a=r.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||r.suppressHydrationWarning===!0||$v(n.textContent,a)?(r.popover!=null&&(Tt("beforetoggle",n),Tt("toggle",n)),r.onScroll!=null&&Tt("scroll",n),r.onScrollEnd!=null&&Tt("scrollend",n),r.onClick!=null&&(n.onclick=Zi),n=!0):n=!1,n||ka(e,!0)}function cc(e){for(En=e.return;En;)switch(En.tag){case 5:case 31:case 13:Mi=!1;return;case 27:case 3:Mi=!0;return;default:En=En.return}}function Tr(e){if(e!==En)return!1;if(!yt)return cc(e),yt=!0,!1;var n=e.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||dh(e.type,e.memoizedProps)),a=!a),a&&Qt&&ka(e),cc(e),n===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(317));Qt=__(e)}else if(n===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(317));Qt=__(e)}else n===27?(n=Qt,rs(e.type)?(e=Sh,Sh=null,Qt=e):Qt=n):Qt=En?Ti(e.stateNode.nextSibling):null;return!0}function Ls(){Qt=En=null,yt=!1}function If(){var e=ja;return e!==null&&(Qn===null?Qn=e:Qn.push.apply(Qn,e),ja=null),e}function ko(e){ja===null?ja=[e]:ja.push(e)}var Bf=$e(null),Os=null,xa=null;function Xa(e,n,a){at(Bf,n._currentValue),n._currentValue=a}function ya(e){e._currentValue=Bf.current,Pe(Bf)}function uc(e,n,a){for(;e!==null;){var r=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,r!==null&&(r.childLanes|=n)):r!==null&&(r.childLanes&n)!==n&&(r.childLanes|=n),e===a)break;e=e.return}}function Ff(e,n,a,r){var c=e.child;for(c!==null&&(c.return=e);c!==null;){var f=c.dependencies;if(f!==null){var _=c.child;f=f.firstContext;e:for(;f!==null;){var b=f;f=c;for(var z=0;z<n.length;z++)if(b.context===n[z]){f.lanes|=a,b=f.alternate,b!==null&&(b.lanes|=a),uc(f.return,a,e),r||(_=null);break e}f=b.next}}else if(c.tag===18){if(_=c.return,_===null)throw Error(o(341));_.lanes|=a,f=_.alternate,f!==null&&(f.lanes|=a),uc(_,a,e),_=null}else c.tag===13&&c.memoizedState!==null&&c.memoizedState.dehydrated===null?(c.lanes|=a,_=c.alternate,_!==null&&(_.lanes|=a),uc(c.return,a,e),_=c.child,_=_!==null?_.sibling:null):_=c.child;if(_!==null)_.return=c;else for(_=c;_!==null;){if(_===e){_=null;break}if(c=_.sibling,c!==null){c.return=_.return,_=c;break}_=_.return}c=_}}function zs(e,n,a,r){e=null;for(var c=n,f=!1;c!==null;){if(!f){if((c.flags&524288)!==0)f=!0;else if((c.flags&262144)!==0)break}if(c.tag===10){var _=c.alternate;if(_===null)throw Error(o(387));if(_=_.memoizedProps,_!==null){var b=c.type;ai(c.pendingProps.value,_.value)||(e!==null?e.push(b):e=[b])}}else if(c===Ut.current){if(_=c.alternate,_===null)throw Error(o(387));_.memoizedState.memoizedState!==c.memoizedState.memoizedState&&(e!==null?e.push(Zr):e=[Zr])}c=c.return}return e!==null&&Ff(n,e,a,r),n.flags|=262144,e!==null}function fc(e){for(e=e.firstContext;e!==null;){if(!ai(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Ps(e){Os=e,xa=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Cn(e){return Lg(Os,e)}function dc(e,n){return Os===null&&Ps(e),Lg(e,n)}function Lg(e,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},xa===null){if(e===null)throw Error(o(308));xa=n,e.dependencies={lanes:0,firstContext:n},e.flags|=524288}else xa=xa.next=n;return a}var nM=typeof AbortController<"u"?AbortController:function(){var e=[],n=this.signal={aborted:!1,addEventListener:function(a,r){e.push(r)}};this.abort=function(){n.aborted=!0,e.forEach(function(a){return a()})}},iM=s.unstable_scheduleCallback,aM=s.unstable_NormalPriority,fn={$$typeof:fe,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Hf(){return{controller:new nM,data:new Map,refCount:0}}function Xo(e){e.refCount--,e.refCount===0&&iM(aM,function(){e.controller.abort()})}function Og(e,n){if((e.pendingLanes&4194048)!==0){var a=e.transitionTypes;for(a===null&&(a=e.transitionTypes=[]),e=0;e<n.length;e++){var r=n[e];a.indexOf(r)===-1&&a.push(r)}}}var qo=null;function sM(e){var n=e.transitionTypes;return e.transitionTypes=null,n}var Yo=null,Gf=0,Is=0,br=null;function rM(e,n){if(Yo===null){var a=Yo=[];Gf=0,Is=ih(),br={status:"pending",value:void 0,then:function(r){a.push(r)}}}return Gf++,n.then(zg,zg),n}function zg(){if(--Gf===0&&(qo=null,Yo!==null)){br!==null&&(br.status="fulfilled");var e=Yo;Yo=null,Is=0,br=null;for(var n=0;n<e.length;n++)(0,e[n])()}}function oM(e,n){var a=[],r={status:"pending",value:null,reason:null,then:function(c){a.push(c)}};return e.then(function(){r.status="fulfilled",r.value=n;for(var c=0;c<a.length;c++)(0,a[c])(n)},function(c){for(r.status="rejected",r.reason=c,c=0;c<a.length;c++)(0,a[c])(void 0)}),r}var Pg=be.S;be.S=function(e,n){if(Rv=j(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&rM(e,n),qo!==null)for(var a=jr;a!==null;)Og(a,qo),a=a.next;if(a=e.types,a!==null){for(var r=jr;r!==null;)Og(r,a),r=r.next;if(Is!==0){r=qo,r===null&&(r=qo=[]);for(var c=0;c<a.length;c++){var f=a[c];r.indexOf(f)===-1&&r.push(f)}}}Pg!==null&&Pg(e,n)};var Bs=$e(null);function Vf(){var e=Bs.current;return e!==null?e:Zt.pooledCache}function hc(e,n){n===null?at(Bs,Bs.current):at(Bs,n.pool)}function Ig(){var e=Vf();return e===null?null:{parent:fn._currentValue,pool:e}}var Ar=Error(o(460)),jf=Error(o(474)),pc=Error(o(542)),mc={then:function(){}};function Bg(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Fg(e,n,a){switch(a=e[a],a===void 0?e.push(n):a!==n&&(n.then(Zi,Zi),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Gg(e),e===void 0&&!("reason"in n)?Error(o(600)):e;default:if(typeof n.status=="string")n.then(Zi,Zi);else{if(e=Zt,e!==null&&100<e.shellSuspendCounter)throw Error(o(482));e=n,e.status="pending",e.then(function(r){if(n.status==="pending"){var c=n;c.status="fulfilled",c.value=r}},function(r){if(n.status==="pending"){var c=n;c.status="rejected",c.reason=r}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Gg(e),e}throw Hs=n,Ar}}function Fs(e){try{var n=e._init;return n(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(Hs=a,Ar):a}}var Hs=null;function Hg(){if(Hs===null)throw Error(o(459));var e=Hs;return Hs=null,e}function Gg(e){if(e===Ar||e===pc)throw Error(o(483))}var Cr=null,Wo=0;function gc(e){var n=Wo;return Wo+=1,Cr===null&&(Cr=[]),Fg(Cr,e,n)}function qa(e,n){n=n.props.ref,e.ref=n!==void 0?n:null}function vc(e,n){throw n.$$typeof===k?Error(o(525)):(e=Object.prototype.toString.call(n),Error(o(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)))}function Vg(e){function n(W,V){if(e){var $=W.deletions;$===null?(W.deletions=[V],W.flags|=16):$.push(V)}}function a(W,V){if(!e)return null;for(;V!==null;)n(W,V),V=V.sibling;return null}function r(W){for(var V=new Map;W!==null;)W.key===null?V.set(W.index,W):V.set(W.key,W),W=W.sibling;return V}function c(W,V){return W=va(W,V),W.index=0,W.sibling=null,W}function f(W,V,$){return W.index=$,e?($=W.alternate,$!==null?($=$.index,$<V?(W.flags|=2,V):$):(W.flags|=134217730,V)):(W.flags|=1048576,V)}function _(W){return e&&W.alternate===null&&(W.flags|=134217730),W}function b(W,V,$,ge){return V===null||V.tag!==6?(V=Lf($,W.mode,ge),V.return=W,V):(V=c(V,$),V.return=W,V)}function z(W,V,$,ge){var Xe=$.type;return Xe===G?(W=re(W,V,$.props.children,ge,$.key),qa(W,$),W):V!==null&&(V.elementType===Xe||typeof Xe=="object"&&Xe!==null&&Xe.$$typeof===Me&&Fs(Xe)===V.type)?(V=c(V,$.props),qa(V,$),V.return=W,V):(V=rc($.type,$.key,$.props,null,W.mode,ge),qa(V,$),V.return=W,V)}function Z(W,V,$,ge){return V===null||V.tag!==4||V.stateNode.containerInfo!==$.containerInfo||V.stateNode.implementation!==$.implementation?(V=Of($,W.mode,ge),V.return=W,V):(V=c(V,$.children||[]),V.return=W,V)}function re(W,V,$,ge,Xe){return V===null||V.tag!==7?(V=Us($,W.mode,ge,Xe),V.return=W,V):(V=c(V,$),V.return=W,V)}function ve(W,V,$){if(typeof V=="string"&&V!==""||typeof V=="number"||typeof V=="bigint")return V=Lf(""+V,W.mode,$),V.return=W,V;if(typeof V=="object"&&V!==null){switch(V.$$typeof){case N:return $=rc(V.type,V.key,V.props,null,W.mode,$),qa($,V),$.return=W,$;case w:return V=Of(V,W.mode,$),V.return=W,V;case Me:return V=Fs(V),ve(W,V,$)}if(Re(V)||ie(V))return V=Us(V,W.mode,$,null),V.return=W,V;if(typeof V.then=="function")return ve(W,gc(V),$);if(V.$$typeof===fe)return ve(W,dc(W,V),$);vc(W,V)}return null}function q(W,V,$,ge){var Xe=V!==null?V.key:null;if(typeof $=="string"&&$!==""||typeof $=="number"||typeof $=="bigint")return Xe!==null?null:b(W,V,""+$,ge);if(typeof $=="object"&&$!==null){switch($.$$typeof){case N:return $.key===Xe?z(W,V,$,ge):null;case w:return $.key===Xe?Z(W,V,$,ge):null;case Me:return $=Fs($),q(W,V,$,ge)}if(Re($)||ie($))return Xe!==null?null:re(W,V,$,ge,null);if(typeof $.then=="function")return q(W,V,gc($),ge);if($.$$typeof===fe)return q(W,V,dc(W,$),ge);vc(W,$)}return null}function ne(W,V,$,ge,Xe){if(typeof ge=="string"&&ge!==""||typeof ge=="number"||typeof ge=="bigint")return W=W.get($)||null,b(V,W,""+ge,Xe);if(typeof ge=="object"&&ge!==null){switch(ge.$$typeof){case N:return W=W.get(ge.key===null?$:ge.key)||null,z(V,W,ge,Xe);case w:return W=W.get(ge.key===null?$:ge.key)||null,Z(V,W,ge,Xe);case Me:return ge=Fs(ge),ne(W,V,$,ge,Xe)}if(Re(ge)||ie(ge))return W=W.get($)||null,re(V,W,ge,Xe,null);if(typeof ge.then=="function")return ne(W,V,$,gc(ge),Xe);if(ge.$$typeof===fe)return ne(W,V,$,dc(V,ge),Xe);vc(V,ge)}return null}function Ie(W,V,$,ge){for(var Xe=null,Rt=null,et=V,ct=V=0,pn=null;et!==null&&ct<$.length;ct++){et.index>ct?(pn=et,et=null):pn=et.sibling;var Dt=q(W,et,$[ct],ge);if(Dt===null){et===null&&(et=pn);break}e&&et&&Dt.alternate===null&&n(W,et),V=f(Dt,V,ct),Rt===null?Xe=Dt:Rt.sibling=Dt,Rt=Dt,et=pn}if(ct===$.length)return a(W,et),yt&&_a(W,ct),Xe;if(et===null){for(;ct<$.length;ct++)et=ve(W,$[ct],ge),et!==null&&(V=f(et,V,ct),Rt===null?Xe=et:Rt.sibling=et,Rt=et);return yt&&_a(W,ct),Xe}for(et=r(et);ct<$.length;ct++)pn=ne(et,W,ct,$[ct],ge),pn!==null&&(e&&(Dt=pn.alternate,Dt!==null&&et.delete(Dt.key===null?ct:Dt.key)),V=f(pn,V,ct),Rt===null?Xe=pn:Rt.sibling=pn,Rt=pn);return e&&et.forEach(function(fs){return n(W,fs)}),yt&&_a(W,ct),Xe}function Ke(W,V,$,ge){if($==null)throw Error(o(151));for(var Xe=null,Rt=null,et=V,ct=V=0,pn=null,Dt=$.next();et!==null&&!Dt.done;ct++,Dt=$.next()){et.index>ct?(pn=et,et=null):pn=et.sibling;var fs=q(W,et,Dt.value,ge);if(fs===null){et===null&&(et=pn);break}e&&et&&fs.alternate===null&&n(W,et),V=f(fs,V,ct),Rt===null?Xe=fs:Rt.sibling=fs,Rt=fs,et=pn}if(Dt.done)return a(W,et),yt&&_a(W,ct),Xe;if(et===null){for(;!Dt.done;ct++,Dt=$.next())Dt=ve(W,Dt.value,ge),Dt!==null&&(V=f(Dt,V,ct),Rt===null?Xe=Dt:Rt.sibling=Dt,Rt=Dt);return yt&&_a(W,ct),Xe}for(et=r(et);!Dt.done;ct++,Dt=$.next())Dt=ne(et,W,ct,Dt.value,ge),Dt!==null&&(e&&(pn=Dt.alternate,pn!==null&&et.delete(pn.key===null?ct:pn.key)),V=f(Dt,V,ct),Rt===null?Xe=Dt:Rt.sibling=Dt,Rt=Dt);return e&&et.forEach(function(G1){return n(W,G1)}),yt&&_a(W,ct),Xe}function gt(W,V,$,ge){if(typeof $=="object"&&$!==null&&$.type===G&&$.key===null&&$.props.ref===void 0&&($=$.props.children),typeof $=="object"&&$!==null){switch($.$$typeof){case N:e:{for(var Xe=$.key;V!==null;){if(V.key===Xe){if(Xe=$.type,Xe===G){if(V.tag===7){a(W,V.sibling),ge=c(V,$.props.children),qa(ge,$),ge.return=W,W=ge;break e}}else if(V.elementType===Xe||typeof Xe=="object"&&Xe!==null&&Xe.$$typeof===Me&&Fs(Xe)===V.type){a(W,V.sibling),ge=c(V,$.props),qa(ge,$),ge.return=W,W=ge;break e}a(W,V);break}else n(W,V);V=V.sibling}$.type===G?(ge=Us($.props.children,W.mode,ge,$.key),qa(ge,$),ge.return=W,W=ge):(ge=rc($.type,$.key,$.props,null,W.mode,ge),qa(ge,$),ge.return=W,W=ge)}return _(W);case w:e:{for(Xe=$.key;V!==null;){if(V.key===Xe)if(V.tag===4&&V.stateNode.containerInfo===$.containerInfo&&V.stateNode.implementation===$.implementation){a(W,V.sibling),ge=c(V,$.children||[]),ge.return=W,W=ge;break e}else{a(W,V);break}else n(W,V);V=V.sibling}ge=Of($,W.mode,ge),ge.return=W,W=ge}return _(W);case Me:return $=Fs($),gt(W,V,$,ge)}if(Re($))return Ie(W,V,$,ge);if(ie($)){if(Xe=ie($),typeof Xe!="function")throw Error(o(150));return $=Xe.call($),Ke(W,V,$,ge)}if(typeof $.then=="function")return gt(W,V,gc($),ge);if($.$$typeof===fe)return gt(W,V,dc(W,$),ge);vc(W,$)}return typeof $=="string"&&$!==""||typeof $=="number"||typeof $=="bigint"?($=""+$,V!==null&&V.tag===6?(a(W,V.sibling),ge=c(V,$),ge.return=W,W=ge):(a(W,V),ge=Lf($,W.mode,ge),ge.return=W,W=ge),_(W)):a(W,V)}return function(W,V,$,ge){try{Wo=0;var Xe=gt(W,V,$,ge);return Cr=null,Xe}catch(et){if(et===Ar||et===pc)throw et;var Rt=Wn(29,et,null,W.mode);return Rt.lanes=ge,Rt.return=W,Rt}finally{}}}var Gs=Vg(!0),jg=Vg(!1),Ya=!1;function kf(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Xf(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Wa(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Za(e,n,a){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(Ft&2)!==0){var c=r.pending;return c===null?n.next=n:(n.next=c.next,c.next=n),r.pending=n,n=sc(e),Ag(e,null,a),n}return ac(e,r,n,a),sc(e)}function Zo(e,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var r=n.lanes;r&=e.pendingLanes,a|=r,n.lanes=a,K(e,a)}}function qf(e,n){var a=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,a===r)){var c=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var _={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?c=f=_:f=f.next=_,a=a.next}while(a!==null);f===null?c=f=n:f=f.next=n}else c=f=n;a={baseState:r.baseState,firstBaseUpdate:c,lastBaseUpdate:f,shared:r.shared,callbacks:r.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=n:e.next=n,a.lastBaseUpdate=n}var Yf=!1;function Ko(){if(Yf){var e=br;if(e!==null)throw e}}function Qo(e,n,a,r){Yf=!1;var c=e.updateQueue;Ya=!1;var f=c.firstBaseUpdate,_=c.lastBaseUpdate,b=c.shared.pending;if(b!==null){c.shared.pending=null;var z=b,Z=z.next;z.next=null,_===null?f=Z:_.next=Z,_=z;var re=e.alternate;re!==null&&(re=re.updateQueue,b=re.lastBaseUpdate,b!==_&&(b===null?re.firstBaseUpdate=Z:b.next=Z,re.lastBaseUpdate=z))}if(f!==null){var ve=c.baseState;_=0,re=Z=z=null,b=f;do{var q=b.lane&-536870913,ne=q!==b.lane;if(ne?(Ct&q)===q:(r&q)===q){q!==0&&q===Is&&(Yf=!0),re!==null&&(re=re.next={lane:0,tag:b.tag,payload:b.payload,callback:null,next:null});e:{var Ie=e,Ke=b;q=n;var gt=a;switch(Ke.tag){case 1:if(Ie=Ke.payload,typeof Ie=="function"){ve=Ie.call(gt,ve,q);break e}ve=Ie;break e;case 3:Ie.flags=Ie.flags&-65537|128;case 0:if(Ie=Ke.payload,q=typeof Ie=="function"?Ie.call(gt,ve,q):Ie,q==null)break e;ve=I({},ve,q);break e;case 2:Ya=!0}}q=b.callback,q!==null&&(e.flags|=64,ne&&(e.flags|=8192),ne=c.callbacks,ne===null?c.callbacks=[q]:ne.push(q))}else ne={lane:q,tag:b.tag,payload:b.payload,callback:b.callback,next:null},re===null?(Z=re=ne,z=ve):re=re.next=ne,_|=q;if(b=b.next,b===null){if(b=c.shared.pending,b===null)break;ne=b,b=ne.next,ne.next=null,c.lastBaseUpdate=ne,c.shared.pending=null}}while(!0);re===null&&(z=ve),c.baseState=z,c.firstBaseUpdate=Z,c.lastBaseUpdate=re,f===null&&(c.shared.lanes=0),ns|=_,e.lanes=_,e.memoizedState=ve}}function kg(e,n){if(typeof e!="function")throw Error(o(191,e));e.call(n)}function Xg(e,n){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)kg(a[e],n)}var Ka=$e(null),_c=$e(0);function qg(e,n){e=ba,at(_c,e),at(Ka,n),ba=e|n.baseLanes}function Wf(){at(_c,ba),at(Ka,Ka.current)}function Zf(){ba=_c.current,Pe(Ka),Pe(_c)}var Rn=$e(null),Pn=null;function Qa(e){var n=e.alternate;at(wn,wn.current&1),at(Rn,e),Pn===null&&(n===null||Ka.current!==null||n.memoizedState!==null)&&(Pn=e)}function Kf(e){at(wn,wn.current),at(Rn,e),Pn===null&&(Pn=e)}function Yg(e){e.tag===22?(at(wn,wn.current),at(Rn,e),Pn===null&&(Pn=e)):Ja()}function Ja(){at(wn,wn.current),at(Rn,Rn.current)}function si(e){Pe(Rn),Pn===e&&(Pn=null),Pe(wn)}var wn=$e(0);function Jo(e,n){at(Rn,Rn.current),at(wn,n)}function Qf(e){Pe(wn),Pe(Rn),Pn===e&&(Pn=null)}function xc(e){for(var n=e;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||xh(a)||yh(a)))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!=="independent"){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var Sa=0,mt=null,Yt=null,dn=null,yc=!1,Rr=!1,Vs=!1,Sc=0,$o=0,wr=null,lM=0;function rn(){throw Error(o(321))}function Jf(e,n){if(n===null)return!1;for(var a=0;a<n.length&&a<e.length;a++)if(!ai(e[a],n[a]))return!1;return!0}function $f(e,n,a,r,c,f){return Sa=f,mt=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,be.H=e===null||e.memoizedState===null?N0:D0,Vs=!1,f=a(r,c),Vs=!1,Rr&&(f=Zg(n,a,r,c)),Wg(e),f}function Wg(e){be.H=Rc;var n=Yt!==null&&Yt.next!==null;if(Sa=0,dn=Yt=mt=null,yc=!1,$o=0,wr=null,n)throw Error(o(300));e===null||hn||(e=e.dependencies,e!==null&&fc(e)&&(hn=!0))}function Zg(e,n,a,r){mt=e;var c=0;do{if(Rr&&(wr=null),$o=0,Rr=!1,25<=c)throw Error(o(301));if(c+=1,dn=Yt=null,e.updateQueue!=null){var f=e.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}be.H=gM,f=n(a,r)}while(Rr);return f}function cM(){var e=be.H,n=e.useState()[0];return n=typeof n.then=="function"?el(n):n,e=e.useState()[0],(Yt!==null?Yt.memoizedState:null)!==e&&(mt.flags|=1024),n}function ed(){var e=Sc!==0;return Sc=0,e}function td(e,n,a){n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~a}function nd(e){if(yc){for(e=e.memoizedState;e!==null;){var n=e.queue;n!==null&&(n.pending=null),e=e.next}yc=!1}Sa=0,dn=Yt=mt=null,Rr=!1,$o=Sc=0,wr=null}function Vn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return dn===null?mt.memoizedState=dn=e:dn=dn.next=e,dn}function cn(){if(Yt===null){var e=mt.alternate;e=e!==null?e.memoizedState:null}else e=Yt.next;var n=dn===null?mt.memoizedState:dn.next;if(n!==null)dn=n,Yt=e;else{if(e===null)throw mt.alternate===null?Error(o(467)):Error(o(310));Yt=e,e={memoizedState:Yt.memoizedState,baseState:Yt.baseState,baseQueue:Yt.baseQueue,queue:Yt.queue,next:null},dn===null?mt.memoizedState=dn=e:dn=dn.next=e}return dn}function Mc(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function el(e){var n=$o;return $o+=1,wr===null&&(wr=[]),e=Fg(wr,e,n),n=mt,(dn===null?n.memoizedState:dn.next)===null&&(n=n.alternate,be.H=n===null||n.memoizedState===null?N0:D0),e}function Ec(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return el(e);if(e.$$typeof===le)return;if(e.$$typeof===fe)return Cn(e)}throw Error(o(438,String(e)))}function id(e){var n=null,a=mt.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var r=mt.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(n={data:r.data.map(function(c){return c.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=Mc(),mt.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(e),r=0;r<e;r++)a[r]=ht;return n.index++,a}function Ma(e,n){return typeof n=="function"?n(e):n}function Tc(e){var n=cn();return ad(n,Yt,e)}function ad(e,n,a){var r=e.queue;if(r===null)throw Error(o(311));r.lastRenderedReducer=a;var c=e.baseQueue,f=r.pending;if(f!==null){if(c!==null){var _=c.next;c.next=f.next,f.next=_}n.baseQueue=c=f,r.pending=null}if(f=e.baseState,c===null)e.memoizedState=f;else{n=c.next;var b=_=null,z=null,Z=n,re=!1;do{var ve=Z.lane&-536870913;if(ve!==Z.lane?(Ct&ve)===ve:(Sa&ve)===ve){var q=Z.revertLane;if(q===0)z!==null&&(z=z.next={lane:0,revertLane:0,gesture:null,action:Z.action,hasEagerState:Z.hasEagerState,eagerState:Z.eagerState,next:null}),ve===Is&&(re=!0);else if((Sa&q)===q){Z=Z.next,q===Is&&(re=!0);continue}else ve={lane:0,revertLane:Z.revertLane,gesture:null,action:Z.action,hasEagerState:Z.hasEagerState,eagerState:Z.eagerState,next:null},z===null?(b=z=ve,_=f):z=z.next=ve,mt.lanes|=q,ns|=q;ve=Z.action,Vs&&a(f,ve),f=Z.hasEagerState?Z.eagerState:a(f,ve)}else q={lane:ve,revertLane:Z.revertLane,gesture:Z.gesture,action:Z.action,hasEagerState:Z.hasEagerState,eagerState:Z.eagerState,next:null},z===null?(b=z=q,_=f):z=z.next=q,mt.lanes|=ve,ns|=ve;Z=Z.next}while(Z!==null&&Z!==n);if(z===null?_=f:z.next=b,!ai(f,e.memoizedState)&&(hn=!0,re&&(a=br,a!==null)))throw a;e.memoizedState=f,e.baseState=_,e.baseQueue=z,r.lastRenderedState=f}return c===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function sd(e){var n=cn(),a=n.queue;if(a===null)throw Error(o(311));a.lastRenderedReducer=e;var r=a.dispatch,c=a.pending,f=n.memoizedState;if(c!==null){a.pending=null;var _=c=c.next;do f=e(f,_.action),_=_.next;while(_!==c);ai(f,n.memoizedState)||(hn=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,r]}function Kg(e,n,a){var r=mt,c=cn(),f=yt;if(f){if(a===void 0)throw Error(o(407));a=a()}else a=n();var _=!ai((Yt||c).memoizedState,a);if(_&&(c.memoizedState=a,hn=!0),c=c.queue,ld($g.bind(null,r,c,e),[e]),e=c.getSnapshot!==n||_||dn!==null&&(dn.memoizedState.tag&1)!==0,Nr(e?9:8,{destroy:void 0},Jg.bind(null,r,c,a,n),null),e){if(r.flags|=2048,Zt===null)throw Error(o(349));f||(Sa&127)!==0||Qg(r,n,a)}return a}function Qg(e,n,a){e.flags|=16384,e={getSnapshot:n,value:a},n=mt.updateQueue,n===null?(n=Mc(),mt.updateQueue=n,n.stores=[e]):(a=n.stores,a===null?n.stores=[e]:a.push(e))}function Jg(e,n,a,r){n.value=a,n.getSnapshot=r,e0(n)&&t0(e)}function $g(e,n,a){return a(function(){e0(n)&&t0(e)})}function e0(e){var n=e.getSnapshot;e=e.value;try{var a=n();return!ai(e,a)}catch{return!0}}function t0(e){var n=Ds(e,2);n!==null&&Jn(n,e,2)}function rd(e){var n=Vn();if(typeof e=="function"){var a=e;if(e=a(),Vs){_n(!0);try{a()}finally{_n(!1)}}}return n.memoizedState=n.baseState=e,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ma,lastRenderedState:e},n}function n0(e,n,a,r){return e.baseState=a,ad(e,Yt,typeof r=="function"?r:Ma)}function uM(e,n,a,r,c){if(Cc(e))throw Error(o(485));if(e=n.action,e!==null){var f={payload:c,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(_){f.listeners.push(_)}};be.T!==null?a(!0):f.isTransition=!1,r(f),a=n.pending,a===null?(f.next=n.pending=f,i0(n,f)):(f.next=a.next,n.pending=a.next=f)}}function i0(e,n){var a=n.action,r=n.payload,c=e.state;if(n.isTransition){var f=be.T,_={};_.types=f!==null?f.types:null,be.T=_;try{var b=a(c,r),z=be.S;z!==null&&z(_,b),a0(e,n,b)}catch(Z){od(e,n,Z)}finally{f!==null&&_.types!==null&&(f.types=_.types),be.T=f}}else try{f=a(c,r),a0(e,n,f)}catch(Z){od(e,n,Z)}}function a0(e,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(r){s0(e,n,r)},function(r){return od(e,n,r)}):s0(e,n,a)}function s0(e,n,a){n.status="fulfilled",n.value=a,r0(n),e.state=a,n=e.pending,n!==null&&(a=n.next,a===n?e.pending=null:(a=a.next,n.next=a,i0(e,a)))}function od(e,n,a){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do n.status="rejected",n.reason=a,r0(n),n=n.next;while(n!==r)}e.action=null}function r0(e){e=e.listeners;for(var n=0;n<e.length;n++)(0,e[n])()}function o0(e,n){return n}function l0(e,n){if(yt){var a=Zt.formState;if(a!==null){e:{var r=mt;if(yt){if(Qt){t:{for(var c=Qt,f=Mi;c.nodeType!==8;){if(!f){c=null;break t}if(c=Ti(c.nextSibling),c===null){c=null;break t}}f=c.data,c=f==="F!"||f==="F"?c:null}if(c){Qt=Ti(c.nextSibling),r=c.data==="F!";break e}}ka(r)}r=!1}r&&(n=a[0])}}return a=Vn(),a.memoizedState=a.baseState=n,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:o0,lastRenderedState:n},a.queue=r,a=C0.bind(null,mt,r),r.dispatch=a,r=rd(!1),f=hd.bind(null,mt,!1,r.queue),r=Vn(),c={state:n,dispatch:null,action:e,pending:null},r.queue=c,a=uM.bind(null,mt,c,f,a),c.dispatch=a,r.memoizedState=e,[n,a,!1]}function c0(e){var n=cn();return u0(n,Yt,e)}function u0(e,n,a){if(n=ad(e,n,o0)[0],e=Tc(Ma)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var r=el(n)}catch(_){throw _===Ar?pc:_}else r=n;n=cn();var c=n.queue,f=c.dispatch;return a!==n.memoizedState&&(mt.flags|=2048,Nr(9,{destroy:void 0},fM.bind(null,c,a),null)),[r,f,e]}function fM(e,n){e.action=n}function f0(e){var n=cn(),a=Yt;if(a!==null)return u0(n,a,e);cn(),n=n.memoizedState,a=cn();var r=a.queue.dispatch;return a.memoizedState=e,[n,r,!1]}function Nr(e,n,a,r){return e={tag:e,create:a,deps:r,inst:n,next:null},n=mt.updateQueue,n===null&&(n=Mc(),mt.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=e.next=e:(r=a.next,a.next=e,e.next=r,n.lastEffect=e),e}function d0(){return cn().memoizedState}function bc(e,n,a,r){var c=Vn();mt.flags|=e,c.memoizedState=Nr(1|n,{destroy:void 0},a,r===void 0?null:r)}function Ac(e,n,a,r){var c=cn();r=r===void 0?null:r;var f=c.memoizedState.inst;Yt!==null&&r!==null&&Jf(r,Yt.memoizedState.deps)?c.memoizedState=Nr(n,f,a,r):(mt.flags|=e,c.memoizedState=Nr(1|n,f,a,r))}function h0(e,n){bc(8390656,8,e,n)}function ld(e,n){Ac(2048,8,e,n)}function dM(e){mt.flags|=4;var n=mt.updateQueue;if(n===null)n=Mc(),mt.updateQueue=n,n.events=[e];else{var a=n.events;a===null?n.events=[e]:a.push(e)}}function p0(e){var n=cn().memoizedState;return dM({ref:n,nextImpl:e}),function(){if((Ft&2)!==0)throw Error(o(440));return n.impl.apply(void 0,arguments)}}function m0(e,n){return Ac(4,2,e,n)}function g0(e,n){return Ac(4,4,e,n)}function v0(e,n){if(typeof n=="function"){e=e();var a=n(e);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function _0(e,n,a){a=a!=null?a.concat([e]):null,Ac(4,4,v0.bind(null,n,e),a)}function cd(){}function x0(e,n){var a=cn();n=n===void 0?null:n;var r=a.memoizedState;return n!==null&&Jf(n,r[1])?r[0]:(a.memoizedState=[e,n],e)}function y0(e,n){var a=cn();n=n===void 0?null:n;var r=a.memoizedState;if(n!==null&&Jf(n,r[1]))return r[0];if(r=e(),Vs){_n(!0);try{e()}finally{_n(!1)}}return a.memoizedState=[r,n],r}function ud(e,n,a){return a===void 0||(Sa&1073741824)!==0&&(Ct&261930)===0?e.memoizedState=n:(e.memoizedState=a,e=Nv(),mt.lanes|=e,ns|=e,a)}function S0(e,n,a,r){return ai(a,n)?a:Ka.current!==null?(e=ud(e,a,r),ai(e,n)||(hn=!0),e):(Sa&106)===0||(Sa&1073741824)!==0&&(Ct&261930)===0?(hn=!0,e.memoizedState=a):(e=Nv(),mt.lanes|=e,ns|=e,n)}function M0(e,n,a,r,c){var f=ce.p;ce.p=f!==0&&8>f?f:8;var _=be.T,b={};b.types=_!==null?_.types:null,be.T=b,hd(e,!1,n,a);try{var z=c(),Z=be.S;if(Z!==null&&Z(b,z),z!==null&&typeof z=="object"&&typeof z.then=="function"){var re=oM(z,r);tl(e,n,re,ci(e))}else tl(e,n,r,ci(e))}catch(ve){tl(e,n,{then:function(){},status:"rejected",reason:ve},ci())}finally{ce.p=f,_!==null&&b.types!==null&&(_.types=b.types),be.T=_}}function hM(){}function fd(e,n,a,r){if(e.tag!==5)throw Error(o(476));var c=E0(e).queue;M0(e,c,n,D,a===null?hM:function(){return T0(e),a(r)})}function E0(e){var n=e.memoizedState;if(n!==null)return n;n={memoizedState:D,baseState:D,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ma,lastRenderedState:D},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ma,lastRenderedState:a},next:null},e.memoizedState=n,e=e.alternate,e!==null&&(e.memoizedState=n),n}function T0(e){var n=E0(e);n.next===null&&(n=e.alternate.memoizedState),tl(e,n.next.queue,{},ci())}function dd(){return Cn(Zr)}function b0(){return cn().memoizedState}function A0(){return cn().memoizedState}function pM(e){for(var n=e.return;n!==null;){switch(n.tag){case 24:case 3:var a=ci();e=Wa(a);var r=Za(n,e,a);r!==null&&(Jn(r,n,a),Zo(r,n,a)),n={cache:Hf()},e.payload=n;return}n=n.return}}function mM(e,n,a){var r=ci();a={lane:r,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Cc(e)?R0(n,a):(a=Df(e,n,a,r),a!==null&&(Jn(a,e,r),w0(a,n,r)))}function C0(e,n,a){var r=ci();tl(e,n,a,r)}function tl(e,n,a,r){var c={lane:r,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Cc(e))R0(n,c);else{var f=e.alternate;if(e.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var _=n.lastRenderedState,b=f(_,a);if(c.hasEagerState=!0,c.eagerState=b,ai(b,_))return ac(e,n,c,0),Zt===null&&ic(),!1}catch{}finally{}if(a=Df(e,n,c,r),a!==null)return Jn(a,e,r),w0(a,n,r),!0}return!1}function hd(e,n,a,r){if(r={lane:2,revertLane:ih(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},Cc(e)){if(n)throw Error(o(479))}else n=Df(e,a,r,2),n!==null&&Jn(n,e,2)}function Cc(e){var n=e.alternate;return e===mt||n!==null&&n===mt}function R0(e,n){Rr=yc=!0;var a=e.pending;a===null?n.next=n:(n.next=a.next,a.next=n),e.pending=n}function w0(e,n,a){if((a&4194048)!==0){var r=n.lanes;r&=e.pendingLanes,a|=r,n.lanes=a,K(e,a)}}var Rc={readContext:Cn,use:Ec,useCallback:rn,useContext:rn,useEffect:rn,useImperativeHandle:rn,useLayoutEffect:rn,useInsertionEffect:rn,useMemo:rn,useReducer:rn,useRef:rn,useState:rn,useDebugValue:rn,useDeferredValue:rn,useTransition:rn,useSyncExternalStore:rn,useId:rn,useHostTransitionStatus:rn,useFormState:rn,useActionState:rn,useOptimistic:rn,useMemoCache:rn,useCacheRefresh:rn,useEffectEvent:rn},N0={readContext:Cn,use:Ec,useCallback:function(e,n){return Vn().memoizedState=[e,n===void 0?null:n],e},useContext:Cn,useEffect:h0,useImperativeHandle:function(e,n,a){a=a!=null?a.concat([e]):null,bc(4194308,4,v0.bind(null,n,e),a)},useLayoutEffect:function(e,n){return bc(4194308,4,e,n)},useInsertionEffect:function(e,n){bc(4,2,e,n)},useMemo:function(e,n){var a=Vn();n=n===void 0?null:n;var r=e();if(Vs){_n(!0);try{e()}finally{_n(!1)}}return a.memoizedState=[r,n],r},useReducer:function(e,n,a){var r=Vn();if(a!==void 0){var c=a(n);if(Vs){_n(!0);try{a(n)}finally{_n(!1)}}}else c=n;return r.memoizedState=r.baseState=c,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:c},r.queue=e,e=e.dispatch=mM.bind(null,mt,e),[r.memoizedState,e]},useRef:function(e){var n=Vn();return e={current:e},n.memoizedState=e},useState:function(e){e=rd(e);var n=e.queue,a=C0.bind(null,mt,n);return n.dispatch=a,[e.memoizedState,a]},useDebugValue:cd,useDeferredValue:function(e,n){var a=Vn();return ud(a,e,n)},useTransition:function(){var e=rd(!1);return e=M0.bind(null,mt,e.queue,!0,!1),Vn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,n,a){var r=mt,c=Vn();if(yt){if(a===void 0)throw Error(o(407));a=a()}else{if(a=n(),Zt===null)throw Error(o(349));(Ct&127)!==0||Qg(r,n,a)}c.memoizedState=a;var f={value:a,getSnapshot:n};return c.queue=f,h0($g.bind(null,r,f,e),[e]),r.flags|=2048,Nr(9,{destroy:void 0},Jg.bind(null,r,f,a,n),null),a},useId:function(){var e=Vn(),n=Zt.identifierPrefix;if(yt){var a=Qi,r=Ki;a=(r&~(1<<32-On(r)-1)).toString(32)+a,n="_"+n+"R_"+a,a=Sc++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=lM++,n="_"+n+"r_"+a.toString(32)+"_";return e.memoizedState=n},useHostTransitionStatus:dd,useFormState:l0,useActionState:l0,useOptimistic:function(e){var n=Vn();n.memoizedState=n.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=hd.bind(null,mt,!0,a),a.dispatch=n,[e,n]},useMemoCache:id,useCacheRefresh:function(){return Vn().memoizedState=pM.bind(null,mt)},useEffectEvent:function(e){var n=Vn(),a={impl:e};return n.memoizedState=a,function(){if((Ft&2)!==0)throw Error(o(440));return a.impl.apply(void 0,arguments)}}},D0={readContext:Cn,use:Ec,useCallback:x0,useContext:Cn,useEffect:ld,useImperativeHandle:_0,useInsertionEffect:m0,useLayoutEffect:g0,useMemo:y0,useReducer:Tc,useRef:d0,useState:function(){return Tc(Ma)},useDebugValue:cd,useDeferredValue:function(e,n){var a=cn();return S0(a,Yt.memoizedState,e,n)},useTransition:function(){var e=Tc(Ma)[0],n=cn().memoizedState;return[typeof e=="boolean"?e:el(e),n]},useSyncExternalStore:Kg,useId:b0,useHostTransitionStatus:dd,useFormState:c0,useActionState:c0,useOptimistic:function(e,n){var a=cn();return n0(a,Yt,e,n)},useMemoCache:id,useCacheRefresh:A0,useEffectEvent:p0},gM={readContext:Cn,use:Ec,useCallback:x0,useContext:Cn,useEffect:ld,useImperativeHandle:_0,useInsertionEffect:m0,useLayoutEffect:g0,useMemo:y0,useReducer:sd,useRef:d0,useState:function(){return sd(Ma)},useDebugValue:cd,useDeferredValue:function(e,n){var a=cn();return Yt===null?ud(a,e,n):S0(a,Yt.memoizedState,e,n)},useTransition:function(){var e=sd(Ma)[0],n=cn().memoizedState;return[typeof e=="boolean"?e:el(e),n]},useSyncExternalStore:Kg,useId:b0,useHostTransitionStatus:dd,useFormState:f0,useActionState:f0,useOptimistic:function(e,n){var a=cn();return Yt!==null?n0(a,Yt,e,n):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:id,useCacheRefresh:A0,useEffectEvent:p0};function pd(e,n,a,r){n=e.memoizedState,a=a(r,n),a=a==null?n:I({},n,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var md={enqueueSetState:function(e,n,a){e=e._reactInternals;var r=ci(),c=Wa(r);c.payload=n,a!=null&&(c.callback=a),n=Za(e,c,r),n!==null&&(Jn(n,e,r),Zo(n,e,r))},enqueueReplaceState:function(e,n,a){e=e._reactInternals;var r=ci(),c=Wa(r);c.tag=1,c.payload=n,a!=null&&(c.callback=a),n=Za(e,c,r),n!==null&&(Jn(n,e,r),Zo(n,e,r))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var a=ci(),r=Wa(a);r.tag=2,n!=null&&(r.callback=n),n=Za(e,r,a),n!==null&&(Jn(n,e,a),Zo(n,e,a))}};function U0(e,n,a,r,c,f,_){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,f,_):n.prototype&&n.prototype.isPureReactComponent?!Go(a,r)||!Go(c,f):!0}function L0(e,n,a,r){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,r),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,r),n.state!==e&&md.enqueueReplaceState(n,n.state,null)}function js(e,n){var a=n;if("ref"in n){a={};for(var r in n)r!=="ref"&&(a[r]=n[r])}if(e=e.defaultProps){a===n&&(a=I({},a));for(var c in e)a[c]===void 0&&(a[c]=e[c])}return a}function O0(e){nc(e)}function z0(e){console.error(e)}function P0(e){nc(e)}function wc(e,n){try{var a=e.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(r){setTimeout(function(){throw r})}}function I0(e,n,a){try{var r=e.onCaughtError;r(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(c){setTimeout(function(){throw c})}}function gd(e,n,a){return a=Wa(a),a.tag=3,a.payload={element:null},a.callback=function(){wc(e,n)},a}function B0(e){return e=Wa(e),e.tag=3,e}function F0(e,n,a,r){var c=a.type.getDerivedStateFromError;if(typeof c=="function"){var f=r.value;e.payload=function(){return c(f)},e.callback=function(){I0(n,a,r)}}var _=a.stateNode;_!==null&&typeof _.componentDidCatch=="function"&&(e.callback=function(){I0(n,a,r),typeof c!="function"&&(is===null?is=new Set([this]):is.add(this));var b=r.stack;this.componentDidCatch(r.value,{componentStack:b!==null?b:""})})}function vM(e,n,a,r,c){if(a.flags|=32768,r!==null&&typeof r=="object"&&typeof r.then=="function"){if(n=a.alternate,n!==null&&zs(n,a,c,!0),a=Rn.current,a!==null){switch(a.tag){case 31:case 13:case 19:return Pn===null?Kc():a.alternate===null&&on===0&&(on=3),a.flags&=-257,a.flags|=65536,a.lanes=c,r===mc?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([r]):n.add(r),eh(e,r,c)),!1;case 22:return a.flags|=65536,r===mc?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([r])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([r]):a.add(r)),eh(e,r,c)),!1}throw Error(o(435,a.tag))}return eh(e,r,c),Kc(),!1}if(yt)return n=Rn.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=c,r!==Pf&&(e=Error(o(422),{cause:r}),ko(xi(e,a)))):(r!==Pf&&(n=Error(o(423),{cause:r}),ko(xi(n,a))),e=e.current.alternate,e.flags|=65536,c&=-c,e.lanes|=c,r=xi(r,a),c=gd(e.stateNode,r,c),qf(e,c),on!==4&&(on=2)),!1;var f=Error(o(520),{cause:r});if(f=xi(f,a),cl===null?cl=[f]:cl.push(f),on!==4&&(on=2),n===null)return!0;r=xi(r,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,e=c&-c,a.lanes|=e,e=gd(a.stateNode,r,e),qf(a,e),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(is===null||!is.has(f))))return a.flags|=65536,c&=-c,a.lanes|=c,c=B0(c),F0(c,e,a,r),qf(a,c),!1;break;case 22:if(a.memoizedState!==null)return a.flags|=65536,!1}a=a.return}while(a!==null);return!1}var vd=Error(o(461)),hn=!1;function yn(e,n,a,r){n.child=e===null?jg(n,null,a,r):Gs(n,e.child,a,r)}function H0(e,n,a,r,c){a=a.render;var f=n.ref;if("ref"in r){var _={};for(var b in r)b!=="ref"&&(_[b]=r[b])}else _=r;return Ps(n),r=$f(e,n,a,_,f,c),b=ed(),e!==null&&!hn?(td(e,n,c),Ea(e,n,c)):(yt&&b&&lc(n),n.flags|=1,yn(e,n,r,c),n.child)}function G0(e,n,a,r,c){if(e===null){var f=a.type;return typeof f=="function"&&!Uf(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,V0(e,n,f,r,c)):(e=rc(a.type,null,r,n,n.mode,c),e.ref=n.ref,e.return=n,n.child=e)}if(f=e.child,!bd(e,c)){var _=f.memoizedProps;if(a=a.compare,a=a!==null?a:Go,a(_,r)&&e.ref===n.ref)return Ea(e,n,c)}return n.flags|=1,e=va(f,r),e.ref=n.ref,e.return=n,n.child=e}function V0(e,n,a,r,c){if(e!==null){var f=e.memoizedProps;if(Go(f,r)&&e.ref===n.ref)if(hn=!1,n.pendingProps=r=f,bd(e,c))(e.flags&131072)!==0&&(hn=!0);else return n.lanes=e.lanes,Ea(e,n,c)}return _d(e,n,a,r,c)}function j0(e,n,a,r){var c=r.children,f=e!==null?e.memoizedState:null;if(e===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode==="hidden"){if((n.flags&128)!==0){if(f=f!==null?f.baseLanes|a:a,e!==null){for(r=n.child=e.child,c=0;r!==null;)c=c|r.lanes|r.childLanes,r=r.sibling;r=c&~f}else r=0,n.child=null;return k0(e,n,f,a,r)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},e!==null&&hc(n,f!==null?f.cachePool:null),f!==null?qg(n,f):Wf(),Yg(n);else return r=n.lanes=536870912,k0(e,n,f!==null?f.baseLanes|a:a,a,r)}else f!==null?(hc(n,f.cachePool),qg(n,f),Ja(),n.memoizedState=null):(e!==null&&hc(n,null),Wf(),Ja());return yn(e,n,c,a),n.child}function nl(e,n){return e!==null&&e.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function k0(e,n,a,r,c){var f=Vf();return f=f===null?null:{parent:fn._currentValue,pool:f},n.memoizedState={baseLanes:a,cachePool:f},e!==null&&hc(n,null),Wf(),Yg(n),e!==null&&zs(e,n,r,!0),n.childLanes=c,null}function Nc(e,n){return n=Dc({mode:n.mode,children:n.children},e.mode),n.ref=e.ref,e.child=n,n.return=e,n}function X0(e,n,a){return Gs(n,e.child,null,a),e=Nc(n,n.pendingProps),e.flags|=2,si(n),n.memoizedState=null,e}function _M(e,n,a){var r=n.pendingProps,c=(n.flags&128)!==0;if(n.flags&=-129,e===null){if(yt){if(r.mode==="hidden")return e=Nc(n,r),n.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},nl(null,e);if(Kf(n),(e=Qt)?(e=v_(e,Mi),e=e!==null&&e.data==="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Va!==null?{id:Ki,overflow:Qi}:null,retryLane:536870912,hydrationErrors:null},a=Rg(e),a.return=n,n.child=a,En=n,Qt=null)):e=null,e===null)throw ka(n);return n.lanes=536870912,null}return Nc(n,r)}var f=e.memoizedState;if(f!==null){var _=f.dehydrated;if(Kf(n),c)if(n.flags&256)n.flags&=-257,n=X0(e,n,a);else if(n.memoizedState!==null)n.child=e.child,n.flags|=128,n=null;else throw Error(o(558));else if(hn||zs(e,n,a,!1),c=(a&e.childLanes)!==0,hn||c){if(Ka.current===null){if(r=Zt,r!==null&&(_=oe(r,a),_!==0&&_!==f.retryLane))throw f.retryLane=_,Ds(e,_),Jn(r,e,_),vd;Kc()}n=X0(e,n,a)}else e=f.treeContext,Qt=Ti(_.nextSibling),En=n,yt=!0,ja=null,Mi=!1,e!==null&&Dg(n,e),n=Nc(n,r),n.flags|=134221824;return n}return e=va(e.child,{mode:r.mode,children:r.children}),e.ref=n.ref,n.child=e,e.return=n,e}function Dr(e,n){var a=n.ref;if(a===null)e!==null&&e.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(o(284));(e===null||e.ref!==a)&&(n.flags|=4194816)}}function _d(e,n,a,r,c){return Ps(n),a=$f(e,n,a,r,void 0,c),r=ed(),e!==null&&!hn?(td(e,n,c),Ea(e,n,c)):(yt&&r&&lc(n),n.flags|=1,yn(e,n,a,c),n.child)}function q0(e,n,a,r,c,f){return Ps(n),n.updateQueue=null,a=Zg(n,r,a,c),Wg(e),r=ed(),e!==null&&!hn?(td(e,n,f),Ea(e,n,f)):(yt&&r&&lc(n),n.flags|=1,yn(e,n,a,f),n.child)}function Y0(e,n,a,r,c){if(Ps(n),n.stateNode===null){var f=Sr,_=a.contextType;typeof _=="object"&&_!==null&&(f=Cn(_)),f=new a(r,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=md,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=r,f.state=n.memoizedState,f.refs={},kf(n),_=a.contextType,f.context=typeof _=="object"&&_!==null?Cn(_):Sr,f.state=n.memoizedState,_=a.getDerivedStateFromProps,typeof _=="function"&&(pd(n,a,_,r),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(_=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),_!==f.state&&md.enqueueReplaceState(f,f.state,null),Qo(n,r,f,c),Ko(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),r=!0}else if(e===null){f=n.stateNode;var b=n.memoizedProps,z=js(a,b);f.props=z;var Z=f.context,re=a.contextType;_=Sr,typeof re=="object"&&re!==null&&(_=Cn(re));var ve=a.getDerivedStateFromProps;re=typeof ve=="function"||typeof f.getSnapshotBeforeUpdate=="function",b=n.pendingProps!==b,re||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(b||Z!==_)&&L0(n,f,r,_),Ya=!1;var q=n.memoizedState;f.state=q,Qo(n,r,f,c),Ko(),Z=n.memoizedState,b||q!==Z||Ya?(typeof ve=="function"&&(pd(n,a,ve,r),Z=n.memoizedState),(z=Ya||U0(n,a,z,r,q,Z,_))?(re||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=r,n.memoizedState=Z),f.props=r,f.state=Z,f.context=_,r=z):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),r=!1)}else{f=n.stateNode,Xf(e,n),_=n.memoizedProps,re=js(a,_),f.props=re,ve=n.pendingProps,q=f.context,Z=a.contextType,z=Sr,typeof Z=="object"&&Z!==null&&(z=Cn(Z)),b=a.getDerivedStateFromProps,(Z=typeof b=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(_!==ve||q!==z)&&L0(n,f,r,z),Ya=!1,q=n.memoizedState,f.state=q,Qo(n,r,f,c),Ko();var ne=n.memoizedState;_!==ve||q!==ne||Ya||e!==null&&e.dependencies!==null&&fc(e.dependencies)?(typeof b=="function"&&(pd(n,a,b,r),ne=n.memoizedState),(re=Ya||U0(n,a,re,r,q,ne,z)||e!==null&&e.dependencies!==null&&fc(e.dependencies))?(Z||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(r,ne,z),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(r,ne,z)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||_===e.memoizedProps&&q===e.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||_===e.memoizedProps&&q===e.memoizedState||(n.flags|=1024),n.memoizedProps=r,n.memoizedState=ne),f.props=r,f.state=ne,f.context=z,r=re):(typeof f.componentDidUpdate!="function"||_===e.memoizedProps&&q===e.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||_===e.memoizedProps&&q===e.memoizedState||(n.flags|=1024),r=!1)}return f=r,Dr(e,n),r=(n.flags&128)!==0,f||r?(f=n.stateNode,a=r&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,e!==null&&r?(n.child=Gs(n,e.child,null,c),n.child=Gs(n,null,a,c)):yn(e,n,a,c),n.memoizedState=f.state,e=n.child):e=Ea(e,n,c),e}function W0(e,n,a,r){return Ls(),n.flags|=256,yn(e,n,a,r),n.child}var xd={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function yd(e){return{baseLanes:e,cachePool:Ig()}}function Sd(e,n,a){return e=e!==null?e.childLanes&~a:0,n&&(e|=li),e}function Z0(e,n,a){var r=n.pendingProps,c=!1,f=(n.flags&128)!==0,_;if((_=f)||(_=e!==null&&e.memoizedState===null?!1:(wn.current&2)!==0),_&&(c=!0,n.flags&=-129),_=(n.flags&32)!==0,n.flags&=-33,e===null){if(yt){if(c?Qa(n):Ja(),(e=Qt)?(e=v_(e,Mi),e=e!==null&&e.data!=="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Va!==null?{id:Ki,overflow:Qi}:null,retryLane:536870912,hydrationErrors:null},a=Rg(e),a.return=n,n.child=a,En=n,Qt=null)):e=null,e===null)throw ka(n);return yh(e)?n.lanes=32:n.lanes=536870912,null}return f=r.children,r=r.fallback,c?(Ja(),c=n.mode,f=Dc({mode:"hidden",children:f},c),r=Us(r,c,a,null),f.return=n,r.return=n,f.sibling=r,n.child=f,r=n.child,r.memoizedState=yd(a),r.childLanes=Sd(e,_,a),n.memoizedState=xd,nl(null,r)):(Qa(n),Md(n,f))}var b=e.memoizedState;if(b!==null){var z=b.dehydrated;if(z!==null)return xM(e,n,f,_,r,z,b,a)}return c?(Ja(),c=r.fallback,f=n.mode,b=e.child,z=b.sibling,r=va(b,{mode:"hidden",children:r.children}),r.subtreeFlags=b.subtreeFlags&1206910976,z!==null?c=va(z,c):(c=Us(c,f,a,null),c.flags|=2),c.return=n,r.return=n,r.sibling=c,n.child=r,nl(null,r),r=n.child,c=e.child.memoizedState,c===null?c=yd(a):(f=c.cachePool,f!==null?(b=fn._currentValue,f=f.parent!==b?{parent:b,pool:b}:f):f=Ig(),c={baseLanes:c.baseLanes|a,cachePool:f}),r.memoizedState=c,r.childLanes=Sd(e,_,a),n.memoizedState=xd,nl(e.child,r)):(Qa(n),a=e.child,e=a.sibling,a=va(a,{mode:"visible",children:r.children}),a.return=n,a.sibling=null,e!==null&&(_=n.deletions,_===null?(n.deletions=[e],n.flags|=16):_.push(e)),n.child=a,n.memoizedState=null,a)}function Md(e,n){return n=Dc({mode:"visible",children:n},e.mode),n.return=e,e.child=n}function Dc(e,n){return e=Wn(22,e,null,n),e.lanes=0,e}function Uc(e,n,a){return Gs(n,e.child,null,a),e=Md(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function xM(e,n,a,r,c,f,_,b){if(a)return n.flags&256?(Qa(n),n.flags&=-257,Uc(e,n,b)):n.memoizedState!==null?(Ja(),n.child=e.child,n.flags|=128,null):(Ja(),f=c.fallback,_=n.mode,c=Dc({mode:"visible",children:c.children},_),f=Us(f,_,b,null),f.flags|=2,c.return=n,f.return=n,c.sibling=f,n.child=c,Gs(n,e.child,null,b),c=n.child,c.memoizedState=yd(b),c.childLanes=Sd(e,r,b),n.memoizedState=xd,nl(null,c));if(Qa(n),yh(f)){if(r=f.nextSibling&&f.nextSibling.dataset,r)var z=r.dgst;return r=z,r!==""&&(c=Error(o(419)),c.stack="",c.digest=r,ko({value:c,source:null,stack:null})),Uc(e,n,b)}if(hn||zs(e,n,b,!1),r=(b&e.childLanes)!==0,hn||r){if(Ka.current!==null)return Uc(e,n,b);if(r=Zt,r!==null&&(c=oe(r,b),c!==0&&c!==_.retryLane))throw _.retryLane=c,Ds(e,c),Jn(r,e,c),vd;return xh(f)||Kc(),Uc(e,n,b)}return xh(f)?(n.flags|=192,n.child=e.child,null):(e=_.treeContext,Qt=Ti(f.nextSibling),En=n,yt=!0,ja=null,Mi=!1,e!==null&&Dg(n,e),n=Md(n,c.children),n.flags|=134221824,n)}function K0(e,n,a){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n),uc(e.return,n,a)}function Q0(e){for(var n=null;e!==null;){var a=e.alternate;a!==null&&xc(a)===null&&(n=e),e=e.sibling}return n}function Lc(e,n,a,r,c,f){var _=e.memoizedState;_===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:r,tail:a,tailMode:c,treeForkCount:f}:(_.isBackwards=n,_.rendering=null,_.renderingStartTime=0,_.last=r,_.tail=a,_.tailMode=c,_.treeForkCount=f)}function Ed(e){var n=e.child;for(e.child=null;n!==null;){var a=n.sibling;n.sibling=e.child,e.child=n,n=a}}function Td(e,n,a){var r=n.pendingProps,c=r.revealOrder,f=r.tail;r=r.children;var _=wn.current;if(n.flags&128)return Jo(n,_),null;var b=(_&2)!==0;if(b?(_=_&1|2,n.flags|=128):_&=1,Jo(n,_),c==="backwards"&&e!==null?(Ed(e),yn(e,n,r,a),Ed(e)):yn(e,n,r,a),r=yt?jo:0,!b&&e!==null&&(e.flags&128)!==0)e:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&K0(e,a,n);else if(e.tag===19)K0(e,a,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break e;for(;e.sibling===null;){if(e.return===null||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(c){case"backwards":a=Q0(n.child),a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null,Ed(n)),Lc(n,!0,c,null,f,r);break;case"unstable_legacy-backwards":for(a=null,c=n.child,n.child=null;c!==null;){if(e=c.alternate,e!==null&&xc(e)===null){n.child=c;break}e=c.sibling,c.sibling=a,a=c,c=e}Lc(n,!0,a,null,f,r);break;case"together":Lc(n,!1,null,null,void 0,r);break;case"independent":n.memoizedState=null;break;default:a=Q0(n.child),a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null),Lc(n,!1,c,a,f,r)}return n.child}function J0(e,n,a){var r=n.pendingProps;return Xa(n,n.type,r.value),yn(e,n,r.children,a),n.child}function Ea(e,n,a){if(e!==null&&(n.dependencies=e.dependencies),ns|=n.lanes,(a&n.childLanes)===0)if(e!==null){if(zs(e,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(e!==null&&n.child!==e.child)throw Error(o(153));if(n.child!==null){for(e=n.child,a=va(e,e.pendingProps),n.child=a,a.return=n;e.sibling!==null;)e=e.sibling,a=a.sibling=va(e,e.pendingProps),a.return=n;a.sibling=null}return n.child}function bd(e,n){return(e.lanes&n)!==0?!0:(e=e.dependencies,!!(e!==null&&fc(e)))}function yM(e,n,a){switch(n.tag){case 3:L(n,n.stateNode.containerInfo),Xa(n,fn,e.memoizedState.cache),Ls();break;case 27:case 5:ee(n);break;case 4:L(n,n.stateNode.containerInfo);break;case 10:Xa(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,Kf(n),null;break;case 13:var r=n.memoizedState;if(r!==null){if(r.dehydrated!==null)return Qa(n),n.flags|=128,null;r=zs(e,n,a,!1);var c=n.child.childLanes;return r||(a&c)!==0?Z0(e,n,a):(Qa(n),e=Ea(e,n,a),e!==null?e.sibling:null)}Qa(n);break;case 19:if(n.flags&128)return Td(e,n,a);if(c=(e.flags&128)!==0,r=(a&n.childLanes)!==0,r||(zs(e,n,a,!1),r=(a&n.childLanes)!==0),c){if(r)return Td(e,n,a);n.flags|=128}if(c=n.memoizedState,c!==null&&(c.rendering=null,c.tail=null,c.lastEffect=null),Jo(n,wn.current),r)break;return null;case 22:return n.lanes=0,j0(e,n,a,n.pendingProps);case 24:Xa(n,fn,e.memoizedState.cache)}return Ea(e,n,a)}function $0(e,n,a){if(e!==null)if(e.memoizedProps!==n.pendingProps)hn=!0;else{if(!bd(e,a)&&(n.flags&128)===0)return hn=!1,yM(e,n,a);hn=(e.flags&131072)!==0}else hn=!1,yt&&(n.flags&1048576)!==0&&Ng(n,jo,n.index);switch(n.lanes=0,n.tag){case 16:e:{var r=n.pendingProps;if(e=Fs(n.elementType),n.type=e,typeof e=="function")Uf(e)?(r=js(e,r),n.tag=1,n=Y0(null,n,e,r,a)):(n.tag=0,n=_d(null,n,e,r,a));else{if(e!=null){var c=e.$$typeof;if(c===X){n.tag=11,n=H0(null,n,e,r,a);break e}else if(c===xe){n.tag=14,n=G0(null,n,e,r,a);break e}else if(c===fe){n.tag=10,n.type=e,n=J0(null,n,a);break e}}throw n=De(e)||e,Error(o(306,n,""))}}return n;case 0:return _d(e,n,n.type,n.pendingProps,a);case 1:return r=n.type,c=js(r,n.pendingProps),Y0(e,n,r,c,a);case 3:e:{if(L(n,n.stateNode.containerInfo),e===null)throw Error(o(387));r=n.pendingProps;var f=n.memoizedState;c=f.element,Xf(e,n),Qo(n,r,null,a);var _=n.memoizedState;if(r=_.cache,Xa(n,fn,r),r!==f.cache&&Ff(n,[fn],a,!0),Ko(),r=_.element,f.isDehydrated)if(f={element:r,isDehydrated:!1,cache:_.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=W0(e,n,r,a);break e}else if(r!==c){c=xi(Error(o(424)),n),ko(c),n=W0(e,n,r,a);break e}else{switch(e=n.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(Qt=Ti(e.firstChild),En=n,yt=!0,ja=null,Mi=!0,a=jg(n,null,r,a),n.child=a;a;)a.flags=a.flags&-3|134221824,a=a.sibling}else{if(Ls(),r===c){n=Ea(e,n,a);break e}yn(e,n,r,a)}n=n.child}return n;case 26:return Dr(e,n),e===null?(a=T_(n.type,null,n.pendingProps,null))?n.memoizedState=a:yt||(n.stateNode=i_(n.type,n.pendingProps,Mt.current,n)):n.memoizedState=T_(n.type,e.memoizedProps,n.pendingProps,e.memoizedState),null;case 27:return ee(n),e===null&&yt&&(r=n.stateNode=y_(n.type,n.pendingProps,Mt.current),En=n,Mi=!0,c=Qt,rs(n.type)?(Sh=c,Qt=Ti(r.firstChild)):Qt=c),yn(e,n,n.pendingProps.children,a),Dr(e,n),e===null&&(n.flags|=4194304),n.child;case 5:return e===null&&yt&&((c=r=Qt)&&(r=p1(r,n.type,n.pendingProps,Mi),r!==null?(n.stateNode=r,En=n,Qt=Ti(r.firstChild),Mi=!1,c=!0):c=!1),c||ka(n)),ee(n),c=n.type,f=n.pendingProps,_=e!==null?e.memoizedProps:null,r=f.children,dh(c,f)?r=null:_!==null&&dh(c,_)&&(n.flags|=32),n.memoizedState!==null&&(c=$f(e,n,cM,null,null,a),Zr._currentValue=c),Dr(e,n),yn(e,n,r,a),n.child;case 6:return e===null&&yt&&((e=a=Qt)&&(a=m1(a,n.pendingProps,Mi),a!==null?(n.stateNode=a,En=n,Qt=null,e=!0):e=!1),e||ka(n)),null;case 13:return Z0(e,n,a);case 4:return L(n,n.stateNode.containerInfo),r=n.pendingProps,e===null?n.child=Gs(n,null,r,a):yn(e,n,r,a),n.child;case 11:return H0(e,n,n.type,n.pendingProps,a);case 7:return r=n.pendingProps,Dr(e,n),yn(e,n,r,a),n.child;case 8:return yn(e,n,n.pendingProps.children,a),n.child;case 12:return yn(e,n,n.pendingProps.children,a),n.child;case 10:return J0(e,n,a);case 9:return c=n.type._context,r=n.pendingProps.children,Ps(n),c=Cn(c),r=r(c),n.flags|=1,yn(e,n,r,a),n.child;case 14:return G0(e,n,n.type,n.pendingProps,a);case 15:return V0(e,n,n.type,n.pendingProps,a);case 19:return Td(e,n,a);case 31:return _M(e,n,a);case 22:return j0(e,n,a,n.pendingProps);case 24:return Ps(n),r=Cn(fn),e===null?(c=Vf(),c===null&&(c=Zt,f=Hf(),c.pooledCache=f,f.refCount++,f!==null&&(c.pooledCacheLanes|=a),c=f),n.memoizedState={parent:r,cache:c},kf(n),Xa(n,fn,c)):((e.lanes&a)!==0&&(Xf(e,n),Qo(n,null,null,a),Ko()),c=e.memoizedState,f=n.memoizedState,c.parent!==r?(c={parent:r,cache:r},n.memoizedState=c,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=c),Xa(n,fn,r)):(r=f.cache,Xa(n,fn,r),r!==c.cache&&Ff(n,[fn],a,!0))),yn(e,n,n.pendingProps.children,a),n.child;case 30:return n.stateNode===null&&(n.stateNode={autoName:null,paired:null,clones:null,ref:null}),r=n.pendingProps,r.name!=null&&r.name!=="auto"?n.flags|=e===null?18882560:18874368:yt&&lc(n),e!==null&&e.memoizedProps.name!==r.name?n.flags|=4194816:Dr(e,n),yn(e,n,r.children,a),n.child;case 29:throw n.pendingProps}throw Error(o(156,n.tag))}function Ta(e){e.flags|=4}function Ad(e,n,a,r,c){var f;if((f=(e.mode&32)!==0)&&(f=a===null?R_(n,r):R_(n,r)&&(r.src!==a.src||r.srcSet!==a.srcSet)),f){if(e.flags|=16777216,(c&335544128)===c)if(e.stateNode.complete)e.flags|=8192;else if(Ov())e.flags|=8192;else throw Hs=mc,jf}else e.flags&=-16777217}function ev(e,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!w_(n))if(Ov())e.flags|=8192;else throw Hs=mc,jf}function Oc(e,n){n!==null&&(e.flags|=4),e.flags&16384&&(n=e.tag!==22?ql():536870912,e.lanes|=n,Pr|=n)}function il(e,n){if(!yt)switch(e.tailMode){case"visible":break;case"collapsed":for(var a=e.tail,r=null;a!==null;)a.alternate!==null&&(r=a),a=a.sibling;r===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null;break;default:for(n=e.tail,a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?e.tail=null:a.sibling=null}}function Jt(e){var n=e.alternate!==null&&e.alternate.child===e.child,a=0,r=0;if(n)for(var c=e.child;c!==null;)a|=c.lanes|c.childLanes,r|=c.subtreeFlags&1206910976,r|=c.flags&1206910976,c.return=e,c=c.sibling;else for(c=e.child;c!==null;)a|=c.lanes|c.childLanes,r|=c.subtreeFlags,r|=c.flags,c.return=e,c=c.sibling;return e.subtreeFlags|=r,e.childLanes=a,n}function SM(e,n,a){var r=n.pendingProps;switch(zf(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Jt(n),null;case 1:return Jt(n),null;case 3:return a=n.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),n.memoizedState.cache!==r&&(n.flags|=2048),ya(fn),A(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(Tr(n)?Ta(n):e===null||e.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,If())),Jt(n),null;case 26:var c=n.type,f=n.memoizedState;return e===null?(Ta(n),f!==null?(Jt(n),ev(n,f)):(Jt(n),Ad(n,c,null,r,a))):f?f!==e.memoizedState?(Ta(n),Jt(n),ev(n,f)):(Jt(n),n.flags&=-16777217):(e=e.memoizedProps,e!==r&&Ta(n),Jt(n),Ad(n,c,e,r,a)),null;case 27:if(he(n),a=Mt.current,c=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==r&&Ta(n);else{if(!r){if(n.stateNode===null)throw Error(o(166));return Jt(n),n.subtreeFlags&=-33554433,null}e=me.current,Tr(n)?Ug(n):(e=y_(c,r,a),n.stateNode=e,Ta(n))}return Jt(n),n.subtreeFlags&=-33554433,null;case 5:if(he(n),c=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==r&&Ta(n);else{if(!r){if(n.stateNode===null)throw Error(o(166));return Jt(n),n.subtreeFlags&=-33554433,null}if(f=me.current,Tr(n))Ug(n);else{var _=pl(Mt.current);switch(f){case 1:f=_.createElementNS("http://www.w3.org/2000/svg",c);break;case 2:f=_.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;default:switch(c){case"svg":f=_.createElementNS("http://www.w3.org/2000/svg",c);break;case"math":f=_.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;case"script":f=_.createElement("div"),f.innerHTML="<script><\/script>",f=f.removeChild(f.firstChild);break;case"select":f=typeof r.is=="string"?_.createElement("select",{is:r.is}):_.createElement("select"),r.multiple?f.multiple=!0:r.size&&(f.size=r.size);break;default:f=typeof r.is=="string"?_.createElement(c,{is:r.is}):_.createElement(c)}}f[Ue]=n,f[Ze]=r;e:for(_=n.child;_!==null;){if(_.tag===5||_.tag===6)f.appendChild(_.stateNode);else if(_.tag!==4&&_.tag!==27&&_.child!==null){_.child.return=_,_=_.child;continue}if(_===n)break e;for(;_.sibling===null;){if(_.return===null||_.return===n)break e;_=_.return}_.sibling.return=_.return,_=_.sibling}n.stateNode=f;e:switch(Dn(f,c,r),c){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}r&&Ta(n)}}return Jt(n),n.subtreeFlags&=-33554433,Ad(n,n.type,e===null?null:e.memoizedProps,n.pendingProps,a),null;case 6:if(e&&n.stateNode!=null)e.memoizedProps!==r&&Ta(n);else{if(typeof r!="string"&&n.stateNode===null)throw Error(o(166));if(e=Mt.current,Tr(n)){if(e=n.stateNode,a=n.memoizedProps,r=null,c=En,c!==null)switch(c.tag){case 27:case 5:r=c.memoizedProps}e[Ue]=n,e=!!(e.nodeValue===a||r!==null&&r.suppressHydrationWarning===!0||$v(e.nodeValue,a)),e||ka(n,!0)}else e=pl(e).createTextNode(r),e[Ue]=n,n.stateNode=e}return Jt(n),null;case 31:if(a=n.memoizedState,e===null||e.memoizedState!==null){if(r=Tr(n),a!==null){if(e===null){if(!r)throw Error(o(318));if(e=n.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(557));e[Ue]=n}else Ls(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Jt(n),e=!1}else a=If(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return n.flags&256?(si(n),n):(si(n),null);if((n.flags&128)!==0)throw Error(o(558))}return Jt(n),null;case 13:if(r=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(c=Tr(n),r!==null&&r.dehydrated!==null){if(e===null){if(!c)throw Error(o(318));if(c=n.memoizedState,c=c!==null?c.dehydrated:null,!c)throw Error(o(317));c[Ue]=n}else Ls(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Jt(n),c=!1}else c=If(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=c),c=!0;if(!c)return n.flags&256?(si(n),n):(si(n),null)}return si(n),(n.flags&128)!==0?(n.lanes=a,n):(a=r!==null,e=e!==null&&e.memoizedState!==null,a&&(r=n.child,c=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(c=r.alternate.memoizedState.cachePool.pool),f=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(f=r.memoizedState.cachePool.pool),f!==c&&(r.flags|=2048)),a!==e&&a&&(n.child.flags|=8192),Oc(n,n.updateQueue),Jt(n),null);case 4:return A(),e===null&&oh(n.stateNode.containerInfo),n.flags|=67108864,Jt(n),null;case 10:return ya(n.type),Jt(n),null;case 19:if(Qf(n),r=n.memoizedState,r===null)return Jt(n),null;if(c=(n.flags&128)!==0,f=r.rendering,f===null)if(c)il(r,!1);else{if(on!==0||e!==null&&(e.flags&128)!==0)for(e=n.child;e!==null;){if(f=xc(e),f!==null){for(n.flags|=128,il(r,!1),e=f.updateQueue,n.updateQueue=e,Oc(n,e),n.subtreeFlags=0,e=a,a=n.child;a!==null;)Cg(a,e),a=a.sibling;return Jo(n,wn.current&1|2),yt&&_a(n,r.treeForkCount),n.child}e=e.sibling}r.tail!==null&&j()>qc&&(n.flags|=128,c=!0,il(r,!1),n.lanes=4194304)}else{if(!c)if(e=xc(f),e!==null){if(n.flags|=128,c=!0,e=e.updateQueue,n.updateQueue=e,Oc(n,e),il(r,!0),r.tail===null&&r.tailMode!=="collapsed"&&r.tailMode!=="visible"&&!f.alternate&&!yt)return Jt(n),null}else 2*j()-r.renderingStartTime>qc&&a!==536870912&&(n.flags|=128,c=!0,il(r,!1),n.lanes=4194304);r.isBackwards?(f.sibling=n.child,n.child=f):(e=r.last,e!==null?e.sibling=f:n.child=f,r.last=f)}if(r.tail!==null){e=r.tail;e:{for(a=e;a!==null;){if(a.alternate!==null){a=!1;break e}a=a.sibling}a=!0}return r.rendering=e,r.tail=e.sibling,r.renderingStartTime=j(),e.sibling=null,f=wn.current,f=c?f&1|2:f&1,r.tailMode==="visible"||r.tailMode==="collapsed"||!a||yt?Jo(n,f):(a=f,at(Rn,n),at(wn,a),Pn===null&&(Pn=n)),yt&&_a(n,r.treeForkCount),e}return Jt(n),null;case 22:case 23:return si(n),Zf(),r=n.memoizedState!==null,e!==null?e.memoizedState!==null!==r&&(n.flags|=8192):r&&(n.flags|=8192),r?(a&536870912)!==0&&(n.flags&128)===0&&(Jt(n),n.subtreeFlags&6&&(n.flags|=8192)):Jt(n),a=n.updateQueue,a!==null&&Oc(n,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),r=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(r=n.memoizedState.cachePool.pool),r!==a&&(n.flags|=2048),e!==null&&Pe(Bs),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),ya(fn),Jt(n),null;case 25:return null;case 30:return n.flags|=33554432,Jt(n),null}throw Error(o(156,n.tag))}function MM(e,n){switch(zf(n),n.tag){case 1:return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return ya(fn),A(),e=n.flags,(e&65536)!==0&&(e&128)===0?(n.flags=e&-65537|128,n):null;case 26:case 27:case 5:return he(n),null;case 31:if(n.memoizedState!==null){if(si(n),n.alternate===null)throw Error(o(340));Ls()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 13:if(si(n),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(o(340));Ls()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return Qf(n),e=n.flags,e&65536?(n.flags=e&-65537|128,e=n.memoizedState,e!==null&&(e.rendering=null,e.tail=null),n.flags|=4,n):null;case 4:return A(),null;case 10:return ya(n.type),null;case 22:case 23:return si(n),Zf(),e!==null&&Pe(Bs),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 24:return ya(fn),null;case 25:return null;default:return null}}function tv(e,n){switch(zf(n),n.tag){case 3:ya(fn),A();break;case 26:case 27:case 5:he(n);break;case 4:A();break;case 31:n.memoizedState!==null&&si(n);break;case 13:si(n);break;case 19:Qf(n);break;case 10:ya(n.type);break;case 22:case 23:si(n),Zf(),e!==null&&Pe(Bs);break;case 24:ya(fn)}}function al(e,n){try{var a=n.updateQueue,r=a!==null?a.lastEffect:null;if(r!==null){var c=r.next;a=c;do{if((a.tag&e)===e){r=void 0;var f=a.create,_=a.inst;r=f(),_.destroy=r}a=a.next}while(a!==c)}}catch(b){jt(n,n.return,b)}}function $a(e,n,a){try{var r=n.updateQueue,c=r!==null?r.lastEffect:null;if(c!==null){var f=c.next;r=f;do{if((r.tag&e)===e){var _=r.inst,b=_.destroy;if(b!==void 0){_.destroy=void 0,c=n;var z=a,Z=b;try{Z()}catch(re){jt(c,z,re)}}}r=r.next}while(r!==f)}}catch(re){jt(n,n.return,re)}}function nv(e){var n=e.updateQueue;if(n!==null){var a=e.stateNode;try{Xg(n,a)}catch(r){jt(e,e.return,r)}}}function iv(e,n,a){a.props=js(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(r){jt(e,n,r)}}function Ji(e,n){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:var c=e.stateNode,f=ma(e.memoizedProps,c);(c.ref===null||c.ref.name!==f)&&(c.ref=u_(f)),r=c.ref;break;case 7:if(e.stateNode===null){var _=new ui(e);v(e.child,!1,d1,_,void 0,void 0),e.stateNode=_}r=e.stateNode;break;default:r=e.stateNode}typeof a=="function"?e.refCleanup=a(r):a.current=r}}catch(b){jt(e,n,b)}}function Nn(e,n){var a=e.ref,r=e.refCleanup;if(a!==null)if(typeof r=="function")try{r()}catch(c){jt(e,n,c)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(c){jt(e,n,c)}else a.current=null}function zc(e,n){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&n!==null)for(var a=0;a<n.length;a++)g_(e.stateNode,n[a])}function av(e){for(var n=e.return;n!==null&&(Rd(n)&&g_(e.stateNode,n.stateNode),!Cd(n));)n=n.return}function sl(e){for(var n=e.return;n!==null&&(Rd(n)&&h1(e.stateNode,n.stateNode),!Cd(n));)n=n.return}function Cd(e){return e.tag===5||e.tag===3||e.tag===27}function Rd(e){return e&&e.tag===7&&e.stateNode!==null}function wd(e){var n=e.type,a=e.memoizedProps,r=e.stateNode;try{e:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&r.focus();break e;case"img":a.src?r.src=a.src:a.srcSet&&(r.srcset=a.srcSet)}}catch(c){jt(e,e.return,c)}}function Nd(e,n,a){try{var r=e.stateNode;WM(r,e.type,a,n),r[Ze]=n}catch(c){jt(e,e.return,c)}}function sv(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&rs(e.type)||e.tag===4}function Dd(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||sv(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&rs(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ud(e,n,a,r){var c=e.tag;if(c===5||c===6)c=e.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(c,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(c),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=Zi)),zc(e,r),Pt=!0;else if(c!==4&&(c===27&&(zc(e,r),r=null,rs(e.type)&&(a=e.stateNode,n=null)),e=e.child,e!==null))for(Ud(e,n,a,r),e=e.sibling;e!==null;)Ud(e,n,a,r),e=e.sibling}function Pc(e,n,a,r){var c=e.tag;if(c===5||c===6)c=e.stateNode,n?a.insertBefore(c,n):a.appendChild(c),zc(e,r),Pt=!0;else if(c!==4&&(c===27&&(zc(e,r),r=null,rs(e.type)&&(a=e.stateNode)),e=e.child,e!==null))for(Pc(e,n,a,r),e=e.sibling;e!==null;)Pc(e,n,a,r),e=e.sibling}function rv(e){var n=e.stateNode,a=e.memoizedProps;try{for(var r=e.type,c=n.attributes;c.length;)n.removeAttributeNode(c[0]);Dn(n,r,a),n[Ue]=e,n[Ze]=a}catch(f){jt(e,e.return,f)}}var Ic=!1,ri=null;function ov(e){(e.tag===30||(e.subtreeFlags&33554432)!==0)&&(Ic=!0)}var $i=null;function lv(){var e=$i;return $i=null,e}var Zn=0;function Ur(e,n,a,r,c){return Zn=0,cv(e.child,n,a,r,c)}function cv(e,n,a,r,c){for(var f=!1;e!==null;){if(e.tag===5){var _=e.stateNode;if(r!==null){var b=mh(_);r.push(b),b.view&&(f=!0)}else f||mh(_).view&&(f=!0);Ic=!0,l_(_,Zn===0?n:n+"_"+Zn,a),Zn++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&c||cv(e.child,n,a,r,c)&&(f=!0));e=e.sibling}return f}function ea(e,n){for(;e!==null;)e.tag===5?c_(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&n||ea(e.child,n)),e=e.sibling}function Bc(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Bc(e),e.tag===30&&(e.flags&18874368)!==0&&e.stateNode.paired)){var n=e.memoizedProps;if(n.name==null||n.name==="auto")throw Error(o(544));var a=n.name;n=ga(n.default,n.share),n!=="none"&&(Ur(e,a,n,null,!1)||ea(e.child,!1))}e=e.sibling}}function Ld(e,n){if(e.tag===30){var a=e.stateNode,r=e.memoizedProps,c=ma(r,a),f=ga(r.default,a.paired?r.share:r.enter);f!=="none"?Ur(e,c,f,null,!1)?(Bc(e),a.paired||n||Hr(e,r.onEnter)):ea(e.child,!1):Bc(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Ld(e,n),e=e.sibling;else Bc(e)}function Od(e){if(ri!==null&&ri.size!==0){var n=ri;if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var a=e.memoizedProps,r=a.name;if(r!=null&&r!=="auto"){var c=n.get(r);if(c!==void 0){var f=ga(a.default,a.share);if(f!=="none"&&(Ur(e,r,f,null,!1)?(f=e.stateNode,c.paired=f,f.paired=c,Hr(e,a.onShare)):ea(e.child,!1)),n.delete(r),n.size===0)break}}}Od(e)}e=e.sibling}}}function zd(e){if(e.tag===30){var n=e.memoizedProps,a=ma(n,e.stateNode),r=ri!==null?ri.get(a):void 0,c=ga(n.default,r!==void 0?n.share:n.exit);c!=="none"&&(Ur(e,a,c,null,!1)?r!==void 0?(c=e.stateNode,r.paired=c,c.paired=r,ri.delete(a),Hr(e,n.onShare)):Hr(e,n.onExit):ea(e.child,!1)),ri!==null&&Od(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)zd(e),e=e.sibling;else ri!==null&&Od(e)}function uv(e){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,a=ma(n,e.stateNode);n=ga(n.default,n.update),e.flags&=-5,n!=="none"&&Ur(e,a,n,e.memoizedState=[],!1)}else(e.subtreeFlags&33554432)!==0&&uv(e);e=e.sibling}}function Pd(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var n=e.stateNode;n.paired!==null&&(n.paired=null,ea(e.child,!1))}Pd(e)}e=e.sibling}}function Fc(e){if(e.tag===30)e.stateNode.paired=null,ea(e.child,!1),Pd(e);else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Fc(e),e=e.sibling;else Pd(e)}function fv(e){for(e=e.child;e!==null;)e.tag===30?ea(e.child,!1):(e.subtreeFlags&33554432)!==0&&fv(e),e=e.sibling}function Id(e,n,a,r,c,f,_){for(var b=!1;n!==null;){if(n.tag===5){var z=n.stateNode;if(f!==null&&Zn<f.length){var Z=f[Zn],re=mh(z);(Z.view||re.view)&&(b=!0);var ve;if(ve=(e.flags&4)===0)if(re.clip)ve=!0;else{ve=Z.rect;var q=re.rect;ve=ve.y!==q.y||ve.x!==q.x||ve.height!==q.height||ve.width!==q.width}ve&&(e.flags|=4),re.abs?re=!Z.abs:(Z=Z.rect,re=re.rect,re=Z.height!==re.height||Z.width!==re.width),re&&(e.flags|=32)}else e.flags|=32;(e.flags&4)!==0&&l_(z,Zn===0?a:a+"_"+Zn,c),b&&(e.flags&4)!==0||($i===null&&($i=[]),$i.push(z,Zn===0?r:r+"_"+Zn,n.memoizedProps)),Zn++}else(n.tag!==22||n.memoizedState===null)&&(n.tag===30&&_?e.flags|=n.flags&32:Id(e,n.child,a,r,c,f,_)&&(b=!0));n=n.sibling}return b}function dv(e,n){for(e=e.child;e!==null;){if(e.tag===30){var a=e.memoizedProps,r=e.stateNode,c=ma(a,r),f=ga(a.default,a.update),_;_=e.memoizedState,e.memoizedState=null,r=e;var b=e.child;Zn=0,c=Id(r,b,c,c,f,_,!1),(e.flags&4)!==0&&c&&Hr(e,a.onUpdate)}else(e.subtreeFlags&33554432)!==0&&dv(e);e=e.sibling}}var Tn=!1,Gt=!1,ta=!1,Bd=!1,hv=typeof WeakSet=="function"?WeakSet:Set,bn=null,na=!1,rl=!1,Hc=!1,Fd=!1;function EM(e,n,a){if(e=e.containerInfo,uh=Kr,e=vg(e),bf(e)){if("selectionStart"in e)var r={start:e.selectionStart,end:e.selectionEnd};else e:{r=(r=e.ownerDocument)&&r.defaultView||window;var c=r.getSelection&&r.getSelection();if(c&&c.rangeCount!==0){r=c.anchorNode;var f=c.anchorOffset,_=c.focusNode;c=c.focusOffset;try{r.nodeType,_.nodeType}catch{r=null;break e}var b=0,z=-1,Z=-1,re=0,ve=0,q=e,ne=null;t:for(;;){for(var Ie;q!==r||f!==0&&q.nodeType!==3||(z=b+f),q!==_||c!==0&&q.nodeType!==3||(Z=b+c),q.nodeType===3&&(b+=q.nodeValue.length),(Ie=q.firstChild)!==null;)ne=q,q=Ie;for(;;){if(q===e)break t;if(ne===r&&++re===f&&(z=b),ne===_&&++ve===c&&(Z=b),(Ie=q.nextSibling)!==null)break;q=ne,ne=q.parentNode}q=Ie}r=z===-1||Z===-1?null:{start:z,end:Z}}else r=null}r=r||{start:0,end:0}}else r=null;for(fh={focusedElem:e,selectionRange:r},Kr=!1,a=(a&335544064)===a,bn=n,n=a?9270:1024;bn!==null;){if(e=bn,a&&(r=e.deletions,r!==null))for(f=0;f<r.length;f++)a&&zd(r[f]);if(e.alternate===null&&(e.flags&2)!==0)a&&ov(e),Gc(a);else{if(e.tag===22){if(r=e.alternate,e.memoizedState!==null){r!==null&&r.memoizedState===null&&a&&zd(r),Gc(a);continue}else if(r!==null&&r.memoizedState!==null){a&&ov(e),Gc(a);continue}}r=e.child,(e.subtreeFlags&n)!==0&&r!==null?(r.return=e,bn=r):(a&&uv(e),Gc(a))}}ri=null}function Gc(e){for(;bn!==null;){var n=bn,a=e,r=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 15:break;case 1:if((c&1024)!==0&&r!==null){a=void 0,c=r.memoizedProps,r=r.memoizedState;var f=n.stateNode;try{var _=js(n.type,c);a=f.getSnapshotBeforeUpdate(_,r),f.__reactInternalSnapshotBeforeUpdate=a}catch(b){jt(n,n.return,b)}}break;case 3:if((c&1024)!==0){if(r=n.stateNode.containerInfo,a=r.nodeType,a===9)_h(r);else if(a===1)switch(r.nodeName){case"HEAD":case"HTML":case"BODY":_h(r);break;default:r.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:a&&r!==null&&(a=ma(r.memoizedProps,r.stateNode),c=n.memoizedProps,c=ga(c.default,c.update),c!=="none"&&Ur(r,a,c,r.memoizedState=[],!0));break;default:if((c&1024)!==0)throw Error(o(163))}if(r=n.sibling,r!==null){r.return=n.return,bn=r;break}bn=n.return}}function pv(e,n,a){var r=a.flags;switch(a.tag){case 0:case 11:case 15:ia(e,a),r&4&&al(5,a);break;case 1:if(ia(e,a),r&4)if(e=a.stateNode,n===null)try{e.componentDidMount()}catch(_){jt(a,a.return,_)}else{var c=js(a.type,n.memoizedProps);n=n.memoizedState;try{e.componentDidUpdate(c,n,e.__reactInternalSnapshotBeforeUpdate)}catch(_){jt(a,a.return,_)}}r&64&&nv(a),r&512&&Ji(a,a.return);break;case 3:if(ia(e,a),r&64&&(e=a.updateQueue,e!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{Xg(e,n)}catch(_){jt(a,a.return,_)}}break;case 27:n===null&&r&4&&rv(a);case 26:case 5:ia(e,a),n===null&&r&4&&wd(a),r&512&&Ji(a,a.return);break;case 12:ia(e,a);break;case 31:ia(e,a),r&4&&_v(e,a);break;case 13:ia(e,a),r&4&&xv(e,a),r&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=zM.bind(null,a),g1(e,a))));break;case 22:if(r=a.memoizedState!==null||Tn,!r){var f=n!==null&&n.memoizedState!==null||Gt;n=Tn,c=Gt,Tn=r,(Gt=f)&&!c?(r=2,(a.subtreeFlags&8772)!==0&&(r|=1),Pi(e,a,r)):ia(e,a),Tn=n,Gt=c}break;case 30:ia(e,a),r&512&&Ji(a,a.return);break;case 7:r&512&&Ji(a,a.return);default:ia(e,a)}}function Hd(e,n){for(e=e.child;e!==null;)mv(e,n),e=e.sibling}function mv(e,n){switch(e.tag){case 5:case 26:try{var a=e.stateNode;if(n){var r=a.style;typeof r.setProperty=="function"?r.setProperty("display","none","important"):r.display="none"}else{var c=e.stateNode,f=e.memoizedProps.style,_=f!=null&&f.hasOwnProperty("display")?f.display:null;c.style.display=_==null||typeof _=="boolean"?"":(""+_).trim()}}catch(z){jt(e,e.return,z)}Gd(e,n);break;case 6:try{e.stateNode.nodeValue=n?"":e.memoizedProps,Pt=!0}catch(z){jt(e,e.return,z)}break;case 18:try{var b=e.stateNode;n?o_(b,!0):o_(e.stateNode,!1)}catch(z){jt(e,e.return,z)}break;case 22:case 23:e.memoizedState===null&&Hd(e,n);break;default:Hd(e,n)}}function Gd(e,n){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){e:{var a=e,r=n;switch(a.tag){case 4:mv(a,r);break e;case 22:a.memoizedState===null&&Gd(a,r);break e;default:Gd(a,r)}}e=e.sibling}}function gv(e){var n=e.alternate;n!==null&&(e.alternate=null,gv(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&it(n)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var en=null,Kn=!1;function Oi(e,n,a){for(a=a.child;a!==null;)vv(e,n,a),a=a.sibling}function vv(e,n,a){if(tn&&typeof tn.onCommitFiberUnmount=="function")try{tn.onCommitFiberUnmount(At,a)}catch{}switch(a.tag){case 26:Gt||Nn(a,n),Oi(e,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&!Gt&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:Gt||Nn(a,n),sl(a);var r=en,c=Kn;rs(a.type)&&(en=a.stateNode,Kn=!1),Oi(e,n,a),S_(a.stateNode,a.type,a.memoizedProps),en=r,Kn=c;break;case 5:Gt||Nn(a,n),sl(a);case 6:if(a.tag===6&&sl(a),r=en,c=Kn,en=null,Oi(e,n,a),en=r,Kn=c,en!==null)if(Kn)try{(en.nodeType===9?en.body:en.nodeName==="HTML"?en.ownerDocument.body:en).removeChild(a.stateNode),Pt=!0}catch(f){jt(a,n,f)}else try{en.removeChild(a.stateNode),Pt=!0}catch(f){jt(a,n,f)}break;case 18:en!==null&&(Kn?(e=en,r_(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),Qr(e)):r_(en,a.stateNode));break;case 4:r=en,c=Kn,en=a.stateNode.containerInfo,Kn=!0,Oi(e,n,a),en=r,Kn=c;break;case 0:case 11:case 14:case 15:$a(2,a,n),Gt||$a(4,a,n),Oi(e,n,a);break;case 1:Gt||(Nn(a,n),r=a.stateNode,typeof r.componentWillUnmount=="function"&&iv(a,n,r)),Oi(e,n,a);break;case 21:Oi(e,n,a);break;case 22:Gt=(r=Gt)||a.memoizedState!==null,Oi(e,n,a),Gt=r;break;case 30:Nn(a,n),Oi(e,n,a);break;case 7:Gt||Nn(a,n),Oi(e,n,a);break;default:Oi(e,n,a)}}function _v(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Qr(e)}catch(a){jt(n,n.return,a)}}}function xv(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Qr(e)}catch(a){jt(n,n.return,a)}}function TM(e){switch(e.tag){case 31:case 13:case 19:var n=e.stateNode;return n===null&&(n=e.stateNode=new hv),n;case 22:return e=e.stateNode,n=e._retryCache,n===null&&(n=e._retryCache=new hv),n;default:throw Error(o(435,e.tag))}}function Vc(e,n){var a=TM(e);n.forEach(function(r){if(!a.has(r)){a.add(r);var c=PM.bind(null,e,r);r.then(c,c)}})}function jn(e,n,a){var r=n.deletions;if(r!==null)for(var c=0;c<r.length;c++){var f=r[c],_=e,b=n,z=b;e:for(;z!==null;){switch(z.tag){case 27:if(rs(z.type)){en=z.stateNode,Kn=!1;break e}break;case 5:en=z.stateNode,Kn=!1;break e;case 3:case 4:en=z.stateNode.containerInfo,Kn=!0;break e}z=z.return}if(en===null)throw Error(o(160));vv(_,b,f),en=null,Kn=!1,_=f.alternate,_!==null&&(_.return=null),f.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)yv(n,e,a),n=n.sibling}var zi=null;function yv(e,n,a){var r=e.alternate,c=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(c&4&&(r=e.updateQueue,r=r!==null?r.events:null,r!==null))for(var f=0;f<r.length;f++){var _=r[f];_.ref.impl=_.nextImpl}jn(n,e,a),kn(e),c&4&&($a(3,e,e.return),al(3,e),$a(5,e,e.return));break;case 1:jn(n,e,a),kn(e),c&512&&(Gt||r===null||Nn(r,r.return)),c&64&&Tn&&(e=e.updateQueue,e!==null&&(n=e.callbacks,n!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?n:a.concat(n))));break;case 26:if(f=zi,jn(n,e,a),kn(e),c&512&&(Gt||r===null||Nn(r,r.return)),c&4)if(c=r!==null?r.memoizedState:null,a=e.memoizedState,r===null)if(a===null)if(e.stateNode===null)if(Tn)e.stateNode=i_(e.type,e.memoizedProps,n.containerInfo,e);else{e:{n=e.type,a=e.memoizedProps,c=f.ownerDocument||f;t:switch(n){case"title":r=c.getElementsByTagName("title")[0],(!r||r[It]||r[Ue]||r.namespaceURI==="http://www.w3.org/2000/svg"||r.hasAttribute("itemprop"))&&(r=c.createElement(n),c.head.insertBefore(r,c.querySelector("head > title"))),Dn(r,n,a),r[Ue]=e,zt(r),n=r;break e;case"link":if(f=C_("link","href",c).get(n+(a.href||""))){for(_=0;_<f.length;_++)if(r=f[_],r.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&r.getAttribute("rel")===(a.rel==null?null:a.rel)&&r.getAttribute("title")===(a.title==null?null:a.title)&&r.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){f.splice(_,1);break t}}r=c.createElement(n),Dn(r,n,a),c.head.appendChild(r);break;case"meta":if(f=C_("meta","content",c).get(n+(a.content||""))){for(_=0;_<f.length;_++)if(r=f[_],r.getAttribute("content")===(a.content==null?null:""+a.content)&&r.getAttribute("name")===(a.name==null?null:a.name)&&r.getAttribute("property")===(a.property==null?null:a.property)&&r.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&r.getAttribute("charset")===(a.charSet==null?null:a.charSet)){f.splice(_,1);break t}}r=c.createElement(n),Dn(r,n,a),c.head.appendChild(r);break;default:throw Error(o(468,n))}r[Ue]=e,zt(r),n=r}e.stateNode=n}else Tn||bh(f,e.type,e.stateNode);else e.stateNode=A_(f,a,e.memoizedProps);else c!==a?(c===null?(n=r.stateNode,n===null||Gt||n.parentNode.removeChild(n)):c.count--,a===null?Tn||bh(f,e.type,e.stateNode):A_(f,a,e.memoizedProps)):a===null&&e.stateNode!==null&&Nd(e,e.memoizedProps,r.memoizedProps);break;case 27:jn(n,e,a),kn(e),c&512&&(Gt||r===null||Nn(r,r.return)),r!==null&&c&4&&Nd(e,e.memoizedProps,r.memoizedProps);break;case 5:if(f=ta,ta=!1,jn(n,e,a),ta=f,kn(e),c&512&&(Gt||r===null||Nn(r,r.return)),e.flags&32){n=e.stateNode;try{pr(n,""),Pt=!0}catch(re){jt(e,e.return,re)}}c&4&&e.stateNode!=null&&(n=e.memoizedProps,Nd(e,n,r!==null?r.memoizedProps:n)),c&1024&&(Bd=!0);break;case 6:if(jn(n,e,a),kn(e),c&4){if(e.stateNode===null)throw Error(o(162));n=e.memoizedProps,a=e.stateNode;try{a.nodeValue=n,Pt=!0}catch(re){jt(e,e.return,re)}}break;case 3:if(Pt=!1,iu=null,f=zi,zi=ml(n.containerInfo),jn(n,e,a),zi=f,kn(e),c&4&&r!==null&&r.memoizedState.isDehydrated)try{Qr(n.containerInfo)}catch(re){jt(e,e.return,re)}Bd&&(Bd=!1,Sv(e)),Pt=!1;break;case 4:c=ta,ta=Tn,r=Gm(),f=zi,zi=ml(e.stateNode.containerInfo),jn(n,e,a),kn(e),zi=f,Pt&&rl&&(Hc=!0),Pt=r,ta=c;break;case 12:jn(n,e,a),kn(e);break;case 31:jn(n,e,a),kn(e),c&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,Vc(e,n)));break;case 13:jn(n,e,a),kn(e),e.child.flags&8192&&e.memoizedState!==null!=(r!==null&&r.memoizedState!==null)&&(Xc=j()),c&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,Vc(e,n)));break;case 22:f=e.memoizedState!==null,_=r!==null&&r.memoizedState!==null;var b=Tn,z=Gt,Z=ta;Tn=b||f,ta=Z||f,Gt=z||_,jn(n,e,a),Gt=z,ta=Z,Tn=b,kn(e),c&8192&&(n=e.stateNode,n._visibility=f?n._visibility&-2:n._visibility|1,!f||r===null||_||Tn||Gt||(n=_||Gt,a=Tn,r=Gt,Tn=f||Tn,Gt=n,es(e,2),Tn=a,Gt=r),!f&&ta||Hd(e,f)),c&4&&(n=e.updateQueue,n!==null&&(a=n.retryQueue,a!==null&&(n.retryQueue=null,Vc(e,a))));break;case 19:jn(n,e,a),kn(e),c&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,Vc(e,n)));break;case 30:c&512&&(Gt||r===null||Nn(r,r.return)),c=Gm(),f=rl,_=(a&335544064)===a,b=e.memoizedProps,rl=_&&ga(b.default,b.update)!=="none",jn(n,e,a),kn(e),_&&r!==null&&Pt&&(e.flags|=4),rl=f,Pt=c;break;case 21:break;case 7:c&512&&(Gt||r===null||Nn(r,r.return)),r&&r.stateNode!==null&&(r.stateNode._fragmentFiber=e);default:jn(n,e,a),kn(e)}}function kn(e){var n=e.flags;if(n&2){try{for(var a,r=e.return;r!==null;){if(sv(r)){a=r;break}r=r.return}r=null;for(var c=e.return;c!==null;){if(Rd(c)){var f=c.stateNode;r===null?r=[f]:r.push(f)}if(Cd(c))break;c=c.return}var _=r;if(a==null)throw Error(o(160));switch(a.tag){case 27:var b=a.stateNode,z=Dd(e);Pc(e,z,b,_);break;case 5:var Z=a.stateNode;a.flags&32&&(pr(Z,""),a.flags&=-33);var re=Dd(e);Pc(e,re,Z,_);break;case 3:case 4:var ve=a.stateNode.containerInfo,q=Dd(e);Ud(e,q,ve,_);break;default:throw Error(o(161))}}catch(ne){jt(e,e.return,ne)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function Sv(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var n=e;Sv(n),n.tag===5&&n.flags&1024&&(n=n.stateNode,Kr=!0,n.reset(),Kr=!1),e=e.sibling}}function Lr(e,n){if(n.subtreeFlags&9270)for(n=n.child;n!==null;)Mv(n,e),n=n.sibling;else dv(n)}function Mv(e,n){var a=e.alternate;if(a===null)Ld(e,!1);else switch(e.tag){case 3:if(Fd=na=!1,lv(),Lr(n,e),!na&&!Hc){if(e=$i,e!==null)for(var r=0;r<e.length;r+=3){a=e[r];var c=e[r+1];c_(a,e[r+2]),a=a.ownerDocument.documentElement,a!==null&&a.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+c+")"})}e=n.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===""&&(e.style.viewTransitionName="none",e.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),Fd=!0}$i=null;break;case 5:Lr(n,e);break;case 4:r=na,na=!1,Lr(n,e),na&&(Hc=!0),na=r;break;case 22:e.memoizedState===null&&(a.memoizedState!==null?Ld(e,!1):Lr(n,e));break;case 30:r=na,c=lv(),na=!1,Lr(n,e),na&&(e.flags|=4);var f=e.memoizedProps,_=e.stateNode;n=ma(f,_),_=ma(a.memoizedProps,_);var b=ga(f.default,f.update);b==="none"?n=!1:(f=a.memoizedState,a.memoizedState=null,a=e.child,Zn=0,n=Id(e,a,n,_,b,f,!0),Zn!==(f===null?0:f.length)&&(e.flags|=32)),(e.flags&4)!==0&&n?(Hr(e,e.memoizedProps.onUpdate),$i=c):c!==null&&(c.push.apply(c,$i),$i=c),na=(e.flags&32)!==0?!0:r;break;default:Lr(n,e)}}function ia(e,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)pv(e,n.alternate,n),n=n.sibling}function es(e,n){for(e=e.child;e!==null;){var a=e,r=n;switch(a.tag){case 0:case 11:case 14:case 15:$a(4,a,a.return),es(a,r);break;case 1:Nn(a,a.return);var c=a.stateNode;typeof c.componentWillUnmount=="function"&&iv(a,a.return,c),es(a,r);break;case 27:(r&2)!==0&&S_(a.stateNode,a.type,a.memoizedProps);case 5:Nn(a,a.return),a.tag!==5&&a.tag!==27||sl(a),es(a,r);break;case 6:sl(a);break;case 26:Nn(a,a.return),c=a.stateNode,a.memoizedState!==null||c===null||Gt||c.parentNode.removeChild(c),es(a,r);break;case 22:a.memoizedState===null&&es(a,r);break;case 30:Nn(a,a.return),es(a,r);break;case 7:Nn(a,a.return);default:es(a,r)}e=e.sibling}}function Pi(e,n,a){for(a=(n.subtreeFlags&8772)!==0?a:a&-2,n=n.child;n!==null;){var r=n.alternate,c=e,f=n,_=f.flags,b=(a&1)!==0;switch(f.tag){case 0:case 11:case 15:Pi(c,f,a),al(4,f);break;case 1:if(Pi(c,f,a),r=f,c=r.stateNode,typeof c.componentDidMount=="function")try{c.componentDidMount()}catch(re){jt(r,r.return,re)}if(r=f,c=r.updateQueue,c!==null){var z=r.stateNode;try{var Z=c.shared.hiddenCallbacks;if(Z!==null)for(c.shared.hiddenCallbacks=null,c=0;c<Z.length;c++)kg(Z[c],z)}catch(re){jt(r,r.return,re)}}b&&_&64&&nv(f),Ji(f,f.return);break;case 27:(a&2)!==0&&rv(f);case 5:f.tag!==5&&f.tag!==27||av(f),Pi(c,f,a),b&&r===null&&_&4&&wd(f),Ji(f,f.return);break;case 6:av(f);break;case 26:z=f.stateNode,f.memoizedState!==null||z===null||Tn||bh(ml(z.ownerDocument),f.type,z),Pi(c,f,a),b&&r===null&&_&4&&wd(f),Ji(f,f.return);break;case 12:Pi(c,f,a);break;case 31:Pi(c,f,a),b&&_&4&&_v(c,f);break;case 13:Pi(c,f,a),b&&_&4&&xv(c,f);break;case 22:f.memoizedState===null&&Pi(c,f,a),Ji(f,f.return);break;case 30:Pi(c,f,a),Ji(f,f.return);break;case 7:Ji(f,f.return);default:Pi(c,f,a)}n=n.sibling}}function Vd(e,n){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(e=n.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&Xo(a))}function jd(e,n){e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&Xo(e))}function Ei(e,n,a,r){var c=(a&335544064)===a;if(n.subtreeFlags&(c?10262:10256))for(n=n.child;n!==null;)Ev(e,n,a,r),n=n.sibling;else c&&fv(n)}function Ev(e,n,a,r){var c=(a&335544064)===a;c&&n.alternate===null&&n.return!==null&&n.return.alternate!==null&&Fc(n);var f=n.flags;switch(n.tag){case 0:case 11:case 15:Ei(e,n,a,r),f&2048&&al(9,n);break;case 1:Ei(e,n,a,r);break;case 3:Ei(e,n,a,r),c&&Fd&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,e.style.viewTransitionName==="root"&&(e.style.viewTransitionName=""),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName==="none"&&(e.style.viewTransitionName="")),f&2048&&(f=null,n.alternate!==null&&(f=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==f&&(n.refCount++,f!=null&&Xo(f)));break;case 12:if(f&2048){Ei(e,n,a,r),f=n.stateNode;try{var _=n.memoizedProps,b=_.id,z=_.onPostCommit;typeof z=="function"&&z(b,n.alternate===null?"mount":"update",f.passiveEffectDuration,-0)}catch(Z){jt(n,n.return,Z)}}else Ei(e,n,a,r);break;case 31:Ei(e,n,a,r);break;case 13:Ei(e,n,a,r);break;case 23:break;case 22:_=n.stateNode,b=n.alternate,n.memoizedState!==null?(c&&b!==null&&b.memoizedState===null&&Fc(b),_._visibility&2?Ei(e,n,a,r):ol(e,n)):(c&&b!==null&&b.memoizedState!==null&&Fc(n),_._visibility&2?Ei(e,n,a,r):(_._visibility|=2,Or(e,n,a,r,(n.subtreeFlags&10256)!==0||!1))),f&2048&&Vd(b,n);break;case 24:Ei(e,n,a,r),f&2048&&jd(n.alternate,n);break;case 30:c&&(f=n.alternate,f!==null&&(ea(f.child,!0),ea(n.child,!0))),Ei(e,n,a,r);break;default:Ei(e,n,a,r)}}function Or(e,n,a,r,c){for(c=c&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var f=e,_=n,b=a,z=r,Z=_.flags;switch(_.tag){case 0:case 11:case 15:Or(f,_,b,z,c),al(8,_);break;case 23:break;case 22:var re=_.stateNode;_.memoizedState!==null?re._visibility&2?Or(f,_,b,z,c):ol(f,_):(re._visibility|=2,Or(f,_,b,z,c)),c&&Z&2048&&Vd(_.alternate,_);break;case 24:Or(f,_,b,z,c),c&&Z&2048&&jd(_.alternate,_);break;default:Or(f,_,b,z,c)}n=n.sibling}}function ol(e,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=e,r=n,c=r.flags;switch(r.tag){case 22:ol(a,r),c&2048&&Vd(r.alternate,r);break;case 24:ol(a,r),c&2048&&jd(r.alternate,r);break;default:ol(a,r)}n=n.sibling}}var ks=8192;function Xs(e,n,a){if(e.subtreeFlags&ks)for(e=e.child;e!==null;)Tv(e,n,a),e=e.sibling}function Tv(e,n,a){switch(e.tag){case 26:Xs(e,n,a),e.flags&ks&&(e.memoizedState!==null?N1(a,zi,e.memoizedState,e.memoizedProps):(e=e.stateNode,(n&335544128)===n&&D_(a,e)));break;case 5:Xs(e,n,a),e.flags&ks&&(e=e.stateNode,(n&335544128)===n&&D_(a,e));break;case 3:case 4:var r=zi;zi=ml(e.stateNode.containerInfo),Xs(e,n,a),zi=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=ks,ks=16777216,Xs(e,n,a),ks=r):Xs(e,n,a));break;case 30:if((e.flags&ks)!==0&&(r=e.memoizedProps.name,r!=null&&r!=="auto")){var c=e.stateNode;c.paired=null,ri===null&&(ri=new Map),ri.set(r,c)}Xs(e,n,a);break;default:Xs(e,n,a)}}function bv(e){var n=e.alternate;if(n!==null&&(e=n.child,e!==null)){n.child=null;do n=e.sibling,e.sibling=null,e=n;while(e!==null)}}function ll(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var r=n[a];bn=r,Cv(r,e)}bv(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Av(e),e=e.sibling}function Av(e){switch(e.tag){case 0:case 11:case 15:ll(e),e.flags&2048&&$a(9,e,e.return);break;case 3:ll(e);break;case 12:ll(e);break;case 22:var n=e.stateNode;e.memoizedState!==null&&n._visibility&2&&(e.return===null||e.return.tag!==13)?(n._visibility&=-3,jc(e)):ll(e);break;default:ll(e)}}function jc(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var r=n[a];bn=r,Cv(r,e)}bv(e)}for(e=e.child;e!==null;){switch(n=e,n.tag){case 0:case 11:case 15:$a(8,n,n.return),jc(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,jc(n));break;default:jc(n)}e=e.sibling}}function Cv(e,n){for(;bn!==null;){var a=bn;switch(a.tag){case 0:case 11:case 15:$a(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var r=a.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:Xo(a.memoizedState.cache)}if(r=a.child,r!==null)r.return=a,bn=r;else e:for(a=e;bn!==null;){r=bn;var c=r.sibling,f=r.return;if(gv(r),r===a){bn=null;break e}if(c!==null){c.return=f,bn=c;break e}bn=f}}}var bM={getCacheForType:function(e){var n=Cn(fn),a=n.data.get(e);return a===void 0&&(a=e(),n.data.set(e,a)),a},cacheSignal:function(){return Cn(fn).controller.signal}},AM=typeof WeakMap=="function"?WeakMap:Map,Ft=0,Zt=null,Et=null,Ct=0,Vt=0,oi=null,ts=!1,zr=!1,kd=!1,ba=0,on=0,ns=0,qs=0,kc=0,li=0,Pr=0,cl=null,Qn=null,Xd=!1,Xc=0,Rv=0,qc=1/0,Yc=null,is=null,nn=0,Ii=null,Ys=null,aa=0,qd=0,Yd=null,wv=null,Ir=null,Br=null,Fr=null,ul=0,Wc=null;function ci(){return(Ft&2)!==0&&Ct!==0?Ct&-Ct:be.T!==null?ih():we()}function Nv(){if(li===0)if((Ct&536870912)===0||yt){var e=da;da<<=1,(da&3932160)===0&&(da=262144),li=e}else li=536870912;return e=Rn.current,e!==null&&(e.flags|=32),li}function Hr(e,n){if(n!=null){var a=e.stateNode,r=a.ref;r===null&&(r=a.ref=u_(ma(e.memoizedProps,a))),Br===null&&(Br=[]),Br.push(n.bind(null,r))}}function Jn(e,n,a){(e===Zt&&(Vt===2||Vt===9)||e.cancelPendingCommit!==null)&&(Gr(e,0),as(e,Ct,li,!1)),Rs(e,a),((Ft&2)===0||e!==Zt)&&(e===Zt&&((Ft&2)===0&&(qs|=a),on===4&&as(e,Ct,li,!1)),sa(e))}function Dv(e,n,a){if((Ft&6)!==0)throw Error(o(327));var r=!a&&(n&127)===0&&(n&e.expiredLanes)===0||Ba(e,n),c=r?wM(e,n):Zd(e,n,!0),f=r;do{if(c===0){zr&&!r&&as(e,n,0,!1);break}else{if(a=e.current.alternate,f&&!CM(a)){c=Zd(e,n,!1),f=!1;continue}if(c===2){if(f=n,e.errorRecoveryDisabledLanes&f)var _=0;else _=e.pendingLanes&-536870913,_=_!==0?_:_&536870912?536870912:0;if(_!==0){n=_;e:{var b=e;c=cl;var z=b.current.memoizedState.isDehydrated;if(z&&(Gr(b,_).flags|=256),_=Zd(b,_,!1),_!==2&&_!==6){if(kd&&!z){b.errorRecoveryDisabledLanes|=f,qs|=f,c=4;break e}f=Qn,Qn=c,f!==null&&(Qn===null?Qn=f:Qn.push.apply(Qn,f))}c=_}if(f=!1,c!==2)continue}}if(c===1){Gr(e,0),as(e,n,0,!0);break}e:{switch(r=e,f=c,f){case 0:case 1:throw Error(o(345));case 4:if((n&4194048)!==n&&(n&62914560)!==n)break;case 6:as(r,n,li,!ts);break e;case 2:Qn=null;break;case 3:case 5:break;default:throw Error(o(329))}if((n&62914560)===n&&(c=Xc+300-j(),10<c)){if(as(r,n,li,!ts),Cs(r,0,!0)!==0)break e;aa=n,r.timeoutHandle=ph(Uv.bind(null,r,a,Qn,Yc,Xd,n,li,qs,Pr,ts,f,"Throttled",-0,0),c);break e}Uv(r,a,Qn,Yc,Xd,n,li,qs,Pr,ts,f,null,-0,0)}}break}while(!0);sa(e)}function Uv(e,n,a,r,c,f,_,b,z,Z,re,ve,q,ne){e.timeoutHandle=-1;var Ie=n.subtreeFlags,Ke=(f&335544064)===f;if(ve=null,(Ke||Ie&8192||(Ie&16785408)===16785408)&&(ve={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Zi},ri=null,Tv(n,f,ve),Ke&&(Ie=ve,Ke=e.containerInfo,Ke=(Ke.nodeType===9?Ke:Ke.ownerDocument).__reactViewTransition,Ke!=null&&(Ie.count++,Ie.waitingForViewTransition=!0,Ie=_l.bind(Ie),Ke.finished.then(Ie,Ie))),Ie=(f&62914560)===f?Xc-j():(f&4194048)===f?Rv-j():0,Ie=D1(ve,Ie),Ie!==null)){aa=f,e.cancelPendingCommit=Ie(Hv.bind(null,e,n,f,a,r,c,_,b,z,Z,re,ve,null,q,ne)),as(e,f,_,!Z);return}Hv(e,n,f,a,r,c,_,b,z,Z,re,ve)}function CM(e){for(var n=e;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var r=0;r<a.length;r++){var c=a[r],f=c.getSnapshot;c=c.value;try{if(!ai(f(),c))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function as(e,n,a,r){n=Xl(e,n),n&=~kc,n&=~qs,e.suspendedLanes|=n,e.pingedLanes&=~n,r&&(e.warmLanes|=n),r=e.expirationTimes;for(var c=n;0<c;){var f=31-On(c),_=1<<f;r[f]=-1,c&=~_}a!==0&&R(e,a,n)}function Zc(){return(Ft&6)===0?(fl(0),!1):!0}function Wd(){if(Et!==null){if(Vt===0)var e=Et.return;else e=Et,xa=Os=null,nd(e),Cr=null,Wo=0,e=Et;for(;e!==null;)tv(e.alternate,e),e=e.return;Et=null}}function Gr(e,n){var a=e.timeoutHandle;return a!==-1&&(e.timeoutHandle=-1,QM(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),aa=0,Wd(),Zt=e,Et=a=va(e.current,null),Ct=n,Vt=0,oi=null,ts=!1,zr=Ba(e,n),kd=!1,Pr=li=kc=qs=ns=on=0,Qn=cl=null,Xd=!1,ba=Xl(e,n),ic(),a}function Lv(e,n){mt=null,be.H=Rc,n===Ar||n===pc?(n=Hg(),Vt=3):n===jf?(n=Hg(),Vt=4):Vt=n===vd?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,oi=n,Et===null&&(on=1,wc(e,xi(n,e.current)))}function Ov(){var e=Rn.current;return e===null?!0:(Ct&4194048)===Ct?Pn===null:(Ct&62914560)===Ct||(Ct&536870912)!==0?e===Pn:!1}function zv(){var e=be.H;return be.H=Rc,e===null?Rc:e}function Pv(){var e=be.A;return be.A=bM,e}function Kc(){on=4,ts||(Ct&4194048)!==Ct&&Rn.current!==null||(zr=!0),(ns&134217727)===0&&(qs&134217727)===0||Zt===null||as(Zt,Ct,li,!1)}function Zd(e,n,a){var r=Ft;Ft|=2;var c=zv(),f=Pv();(Zt!==e||Ct!==n)&&(Yc=null,Gr(e,n)),n=!1;var _=on;e:do try{if(Vt!==0&&Et!==null){var b=Et,z=oi;switch(Vt){case 8:Wd(),_=6;break e;case 3:case 2:case 9:case 6:Rn.current===null&&(n=!0);var Z=Vt;if(Vt=0,oi=null,Vr(e,b,z,Z),a&&zr){_=0;break e}break;default:Z=Vt,Vt=0,oi=null,Vr(e,b,z,Z)}}RM(),_=on;break}catch(re){Lv(e,re)}while(!0);return n&&e.shellSuspendCounter++,xa=Os=null,Ft=r,be.H=c,be.A=f,Et===null&&(Zt=null,Ct=0,ic()),_}function RM(){for(;Et!==null;)Iv(Et)}function wM(e,n){var a=Ft;Ft|=2;var r=zv(),c=Pv();Zt!==e||Ct!==n?(Yc=null,qc=j()+500,Gr(e,n)):zr=Ba(e,n);e:do try{if(Vt!==0&&Et!==null){n=Et;var f=oi;t:switch(Vt){case 1:Vt=0,oi=null,Vr(e,n,f,1);break;case 2:case 9:if(Bg(f)){Vt=0,oi=null,Bv(n);break}n=function(){Vt!==2&&Vt!==9||Zt!==e||(Vt=7),sa(e)},f.then(n,n);break e;case 3:Vt=7;break e;case 4:Vt=5;break e;case 7:Bg(f)?(Vt=0,oi=null,Bv(n)):(Vt=0,oi=null,Vr(e,n,f,7));break;case 5:var _=null;switch(Et.tag){case 26:_=Et.memoizedState;case 5:case 27:var b=Et;if(_?w_(_):b.stateNode.complete){Vt=0,oi=null;var z=b.sibling;if(z!==null)Et=z;else{var Z=b.return;Z!==null?(Et=Z,Qc(Z)):Et=null}break t}}Vt=0,oi=null,Vr(e,n,f,5);break;case 6:Vt=0,oi=null,Vr(e,n,f,6);break;case 8:Wd(),on=6;break e;default:throw Error(o(462))}}NM();break}catch(re){Lv(e,re)}while(!0);return xa=Os=null,be.H=r,be.A=c,Ft=a,Et!==null?0:(Zt=null,Ct=0,ic(),on)}function NM(){for(;Et!==null&&!Fe();)Iv(Et)}function Iv(e){var n=$0(e.alternate,e,ba);e.memoizedProps=e.pendingProps,n===null?Qc(e):Et=n}function Bv(e){var n=e,a=n.alternate;switch(n.tag){case 15:case 0:n=q0(a,n,n.pendingProps,n.type,void 0,Ct);break;case 11:n=q0(a,n,n.pendingProps,n.type.render,n.ref,Ct);break;case 5:nd(n);var r=n;r===En&&(yt?(cc(r),r.tag===5&&r.stateNode!=null&&(Qt=r.stateNode)):(cc(r),yt=!0));default:tv(a,n),n=Et=Cg(n,ba),n=$0(a,n,ba)}e.memoizedProps=e.pendingProps,n===null?Qc(e):Et=n}function Vr(e,n,a,r){xa=Os=null,nd(n),Cr=null,Wo=0;var c=n.return;try{if(vM(e,c,n,a,Ct)){on=1,wc(e,xi(a,e.current)),Et=null;return}}catch(f){if(c!==null)throw Et=c,f;on=1,wc(e,xi(a,e.current)),Et=null;return}n.flags&32768?(yt||r===1?e=!0:zr||(Ct&536870912)!==0?e=!1:(ts=e=!0,(r===2||r===9||r===3||r===6)&&(r=Rn.current,r!==null&&r.tag===13&&(r.flags|=16384))),Fv(n,e)):Qc(n)}function Qc(e){var n=e;do{if((n.flags&32768)!==0){Fv(n,ts);return}e=n.return;var a=SM(n.alternate,n,ba);if(a!==null){Et=a;return}if(n=n.sibling,n!==null){Et=n;return}Et=n=e}while(n!==null);on===0&&(on=5)}function Fv(e,n){do{var a=MM(e.alternate,e);if(a!==null){a.flags&=32767,Et=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(e=e.sibling,e!==null)){Et=e;return}Et=e=a}while(e!==null);on=6,Et=null}function Hv(e,n,a,r,c,f,_,b,z,Z,re,ve){e.cancelPendingCommit=null;do Jc();while(nn!==0);if((Ft&6)!==0)throw Error(o(327));if(n!==null){if(n===e.current)throw Error(o(177));e===Zt&&(Et=Zt=null,Ct=0),Ys=n,Ii=e,aa=a,Yd=c,wv=r,DM(e,n,a,_,b,z,ve)}}function DM(e,n,a,r,c,f,_){var b=n.lanes|n.childLanes;if(qd=b,b|=Nf,of(e,a,b,r,c,f),Br=null,(a&335544064)===a?(Fr=sM(e),r=10262):(Fr=null,r=10256),(n.subtreeFlags&r)!==0||(n.flags&r)!==0?(e.callbackNode=null,e.callbackPriority=0,IM(Ce,function(){return $d(),null})):(e.callbackNode=null,e.callbackPriority=0),Ic=!1,r=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||r){r=be.T,be.T=null,c=ce.p,ce.p=2,f=Ft,Ft|=4;try{EM(e,n,a)}finally{Ft=f,ce.p=c,be.T=r}}nn=1,Ic?Ir=i1(_,e.containerInfo,Fr,Kd,Qd,LM,Jd,$d,UM):(Kd(),Qd(),Jd())}function UM(e){if(nn!==0){var n=Ii.onRecoverableError;n(e,{componentStack:null})}}function LM(){nn===3&&(nn=0,Mv(Ys,Ii),nn=4)}function Kd(){if(nn===1){nn=0;var e=Ii,n=Ys,a=aa,r=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||r){r=be.T,be.T=null;var c=ce.p;ce.p=2;var f=Ft;Ft|=4;try{rl=Hc=!1,yv(n,e,a),a=fh;var _=vg(e.containerInfo),b=a.focusedElem,z=a.selectionRange;if(_!==b&&b&&b.ownerDocument&&gg(b.ownerDocument.documentElement,b)){if(z!==null&&bf(b)){var Z=z.start,re=z.end;if(re===void 0&&(re=Z),"selectionStart"in b)b.selectionStart=Z,b.selectionEnd=Math.min(re,b.value.length);else{var ve=b.ownerDocument||document,q=ve&&ve.defaultView||window;if(q.getSelection){var ne=q.getSelection(),Ie=b.textContent.length,Ke=Math.min(z.start,Ie),gt=z.end===void 0?Ke:Math.min(z.end,Ie);!ne.extend&&Ke>gt&&(_=gt,gt=Ke,Ke=_);var W=mg(b,Ke),V=mg(b,gt);if(W&&V&&(ne.rangeCount!==1||ne.anchorNode!==W.node||ne.anchorOffset!==W.offset||ne.focusNode!==V.node||ne.focusOffset!==V.offset)){var $=ve.createRange();$.setStart(W.node,W.offset),ne.removeAllRanges(),Ke>gt?(ne.addRange($),ne.extend(V.node,V.offset)):($.setEnd(V.node,V.offset),ne.addRange($))}}}}for(ve=[],ne=b;ne=ne.parentNode;)ne.nodeType===1&&ve.push({element:ne,left:ne.scrollLeft,top:ne.scrollTop});for(typeof b.focus=="function"&&b.focus(),b=0;b<ve.length;b++){var ge=ve[b];ge.element.scrollLeft=ge.left,ge.element.scrollTop=ge.top}}Kr=!!uh,fh=uh=null}finally{Ft=f,ce.p=c,be.T=r}}e.current=n,nn=2}}function Qd(){if(nn===2){nn=0;var e=Ii,n=Ys,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=be.T,be.T=null;var r=ce.p;ce.p=2;var c=Ft;Ft|=4;try{pv(e,n.alternate,n)}finally{Ft=c,ce.p=r,be.T=a}}nn=3}}function Jd(){if(nn===4||nn===3){nn=0;var e=Ir;Ir=null,pt();var n=Ii,a=Ys,r=aa,c=wv,f=(r&335544064)===r?10262:10256;if((a.subtreeFlags&f)!==0||(a.flags&f)!==0?nn=5:(nn=0,Ys=Ii=null,Gv(n,n.pendingLanes)),f=n.pendingLanes,f===0&&(is=null),Q(r),a=a.stateNode,tn&&typeof tn.onCommitFiberRoot=="function")try{tn.onCommitFiberRoot(At,a,void 0,(a.current.flags&128)===128)}catch{}if(c!==null){a=be.T,f=ce.p,ce.p=2,be.T=null;try{for(var _=n.onRecoverableError,b=0;b<c.length;b++){var z=c[b];_(z.value,{componentStack:z.stack})}}finally{be.T=a,ce.p=f}}if(c=Br,_=Fr,Fr=null,c!==null&&(Br=null,_===null&&(_=[]),e!==null))for(z=0;z<c.length;z++)a=(0,c[z])(_),a!==void 0&&e.finished.finally(a);(aa&3)!==0&&Jc(),sa(n),f=n.pendingLanes,(r&261930)!==0&&(f&42)!==0?n===Wc?ul++:(ul=0,Wc=n):(ul=0,Wc=null),fl(0)}}function Gv(e,n){(e.pooledCacheLanes&=n)===0&&(n=e.pooledCache,n!=null&&(e.pooledCache=null,Xo(n)))}function Jc(){return Ir!==null&&(Ir.skipTransition(),Ir=null),Kd(),Qd(),Jd(),$d()}function $d(){if(nn!==5)return!1;var e=Ii,n=qd;qd=0;var a=Q(aa),r=be.T,c=ce.p;try{ce.p=32>a?32:a,be.T=null,a=Yd,Yd=null;var f=Ii,_=aa;if(nn=0,Ys=Ii=null,aa=0,(Ft&6)!==0)throw Error(o(331));var b=Ft;if(Ft|=4,Av(f.current),Ev(f,f.current,_,a),Ft=b,fl(0,!1),tn&&typeof tn.onPostCommitFiberRoot=="function")try{tn.onPostCommitFiberRoot(At,f)}catch{}return!0}finally{ce.p=c,be.T=r,Gv(e,n)}}function Vv(e,n,a){n=xi(a,n),n=gd(e.stateNode,n,2),e=Za(e,n,2),e!==null&&(Rs(e,2),sa(e))}function jt(e,n,a){if(e.tag===3)Vv(e,e,a);else for(;n!==null;){if(n.tag===3){Vv(n,e,a);break}else if(n.tag===1){var r=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(is===null||!is.has(r))){e=xi(a,e),a=B0(2),r=Za(n,a,2),r!==null&&(F0(a,r,n,e),Rs(r,2),sa(r));break}}n=n.return}}function eh(e,n,a){var r=e.pingCache;if(r===null){r=e.pingCache=new AM;var c=new Set;r.set(n,c)}else c=r.get(n),c===void 0&&(c=new Set,r.set(n,c));c.has(a)||(kd=!0,c.add(a),e=OM.bind(null,e,n,a),n.then(e,e))}function OM(e,n,a){var r=e.pingCache;r!==null&&r.delete(n),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,Zt===e&&(Ct&a)===a&&((on===4||on===3&&(Ct&62914560)===Ct&&300>j()-Xc)&&(Ft&2)===0?Gr(e,0):kc|=a,Pr===Ct&&(Pr=0)),sa(e)}function jv(e,n){n===0&&(n=ql()),e=Ds(e,n),e!==null&&(Rs(e,n),sa(e))}function zM(e){var n=e.memoizedState,a=0;n!==null&&(a=n.retryLane),jv(e,a)}function PM(e,n){var a=0;switch(e.tag){case 31:case 13:var r=e.stateNode,c=e.memoizedState;c!==null&&(a=c.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(o(314))}r!==null&&r.delete(n),jv(e,a)}function IM(e,n){return rt(e,n)}var jr=null,kr=null,th=!1,$c=!1,nh=!1,ss=0;function sa(e){e!==kr&&e.next===null&&(kr===null?jr=kr=e:kr=kr.next=e),$c=!0,th||(th=!0,FM())}function fl(e,n){if(!nh&&$c){nh=!0;do for(var a=!1,r=jr;r!==null;){if(e!==0){var c=r.pendingLanes;if(c===0)var f=0;else{var _=r.suspendedLanes,b=r.pingedLanes;f=(1<<31-On(42|e)+1)-1,f&=c&~(_&~b),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,Yv(r,f))}else f=Ct,f=Cs(r,r===Zt?f:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),(f&3)===0||Ba(r,f)||(a=!0,Yv(r,f));r=r.next}while(a);nh=!1}}function BM(){kv()}function kv(){$c=th=!1;var e=0;ss!==0&&KM()&&(e=ss);for(var n=j(),a=null,r=jr;r!==null;){var c=r.next,f=Xv(r,n);f===0?(r.next=null,a===null?jr=c:a.next=c,c===null&&(kr=a)):(a=r,(e!==0||(f&3)!==0)&&($c=!0)),r=c}nn!==0&&nn!==5||fl(e),ss!==0&&(ss=0)}function Xv(e,n){for(var a=e.suspendedLanes,r=e.pingedLanes,c=e.expirationTimes,f=e.pendingLanes&-62914561;0<f;){var _=31-On(f),b=1<<_,z=c[_];z===-1?((b&a)===0||(b&r)!==0)&&(c[_]=rf(b,n)):z<=n&&(e.expiredLanes|=b),f&=~b}if(n=Zt,a=Ct,a=Cs(e,e===n?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,a===0||e===n&&(Vt===2||Vt===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&qe(r),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||Ba(e,a)){if(n=a&-a,n===e.callbackPriority)return n;switch(r!==null&&qe(r),Q(a)){case 2:case 8:a=Ye;break;case 32:a=Ce;break;case 268435456:a=Je;break;default:a=Ce}return r=qv.bind(null,e),a=rt(a,r),e.callbackPriority=n,e.callbackNode=a,n}return r!==null&&r!==null&&qe(r),e.callbackPriority=2,e.callbackNode=null,2}function qv(e,n){if(nn!==0&&nn!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(Jc()&&e.callbackNode!==a)return null;var r=Ct;return r=Cs(e,e===Zt?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(Dv(e,r,n),Xv(e,j()),e.callbackNode!=null&&e.callbackNode===a?qv.bind(null,e):null)}function Yv(e,n){if(Jc())return null;Dv(e,n,!0)}function FM(){JM(function(){(Ft&6)!==0?rt(Le,BM):kv()})}function ih(){if(ss===0){var e=Is;e===0&&(e=bs,bs<<=1,(bs&261888)===0&&(bs=256)),ss=e}return ss}function Wv(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Zl(e)}function HM(e,n,a,r,c){if(n==="submit"&&a&&a.stateNode===c){var f=Wv((c[Ze]||null).action),_=r.submitter;_&&(n=(n=_[Ze]||null)?Wv(n.formAction):_.getAttribute("formAction"),n!==null&&(f=n,_=null));var b=new $l("action","action",null,r,c);e.push({event:b,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(ss!==0){var z=new FormData(c,_);fd(a,{pending:!0,data:z,method:c.method,action:f},null,z)}}else typeof f=="function"&&(b.preventDefault(),z=new FormData(c,_),fd(a,{pending:!0,data:z,method:c.method,action:f},f,z))},currentTarget:c}]})}}for(var ah=0;ah<wf.length;ah++){var sh=wf[ah],GM=sh.toLowerCase(),VM=sh[0].toUpperCase()+sh.slice(1);Li(GM,"on"+VM)}Li(yg,"onAnimationEnd"),Li(Sg,"onAnimationIteration"),Li(Mg,"onAnimationStart"),Li("dblclick","onDoubleClick"),Li("focusin","onFocus"),Li("focusout","onBlur"),Li(QS,"onTransitionRun"),Li(JS,"onTransitionStart"),Li($S,"onTransitionCancel"),Li(Eg,"onTransitionEnd"),sn("onMouseEnter",["mouseout","mouseover"]),sn("onMouseLeave",["mouseout","mouseover"]),sn("onPointerEnter",["pointerout","pointerover"]),sn("onPointerLeave",["pointerout","pointerover"]),un("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),un("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),un("onBeforeInput",["compositionend","keypress","textInput","paste"]),un("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),un("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),un("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var dl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),jM=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(dl));function Zv(e,n){n=(n&4)!==0;for(var a=0;a<e.length;a++){var r=e[a],c=r.event;r=r.listeners;e:{var f=void 0;if(n)for(var _=r.length-1;0<=_;_--){var b=r[_],z=b.instance,Z=b.currentTarget;if(b=b.listener,z!==f&&c.isPropagationStopped())break e;f=b,c.currentTarget=Z;try{f(c)}catch(re){nc(re)}c.currentTarget=null,f=z}else for(_=0;_<r.length;_++){if(b=r[_],z=b.instance,Z=b.currentTarget,b=b.listener,z!==f&&c.isPropagationStopped())break e;f=b,c.currentTarget=Z;try{f(c)}catch(re){nc(re)}c.currentTarget=null,f=z}}}}function Tt(e,n){var a=n[nt];a===void 0&&(a=n[nt]=new Set);var r=e+"__bubble";a.has(r)||(Kv(n,e,2,!1),a.add(r))}function rh(e,n,a){var r=0;n&&(r|=4),Kv(a,e,r,n)}var eu="_reactListening"+Math.random().toString(36).slice(2);function oh(e){if(!e[eu]){e[eu]=!0,Kt.forEach(function(a){a!=="selectionchange"&&(jM.has(a)||rh(a,!1,e),rh(a,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[eu]||(n[eu]=!0,rh("selectionchange",!1,n))}}function Kv(e,n,a,r){switch(F_(n)){case 2:var c=z1;break;case 8:c=P1;break;default:c=Ch}a=c.bind(null,n,a,e),c=void 0,!mf||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(c=!0),r?c!==void 0?e.addEventListener(n,a,{capture:!0,passive:c}):e.addEventListener(n,a,!0):c!==void 0?e.addEventListener(n,a,{passive:c}):e.addEventListener(n,a,!1)}function lh(e,n,a,r,c){var f=r;if((n&1)===0&&(n&2)===0&&r!==null)e:for(;;){if(r===null)return;var _=r.tag;if(_===3||_===4){var b=r.stateNode.containerInfo;if(b===c)break;if(_===4)for(_=r.return;_!==null;){var z=_.tag;if((z===3||z===4)&&_.stateNode.containerInfo===c)return;_=_.return}for(;b!==null;){if(_=Bt(b),_===null)return;if(z=_.tag,z===5||z===6||z===26||z===27){r=f=_;continue e}b=b.parentNode}}r=r.return}Km(function(){var Z=f,re=hf(a),ve=[];e:{var q=Tg.get(e);if(q!==void 0){var ne=$l,Ie=e;switch(e){case"keypress":if(Ql(a)===0)break e;case"keydown":case"keyup":ne=CS;break;case"focusin":Ie="focus",ne=xf;break;case"focusout":Ie="blur",ne=xf;break;case"beforeblur":case"afterblur":ne=xf;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ne=$m;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ne=mS;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ne=US;break;case yg:case Sg:case Mg:ne=_S;break;case Eg:ne=OS;break;case"scroll":case"scrollend":ne=hS;break;case"wheel":ne=PS;break;case"copy":case"cut":case"paste":ne=yS;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ne=tg;break;case"submit":ne=NS;break;case"toggle":case"beforetoggle":ne=BS}var Ke=(n&4)!==0,gt=!Ke&&(e==="scroll"||e==="scrollend"),W=Ke?q!==null?q+"Capture":null:q;Ke=[];for(var V=Z,$;V!==null;){var ge=V;if($=ge.stateNode,ge=ge.tag,ge!==5&&ge!==26&&ge!==27||$===null||W===null||(ge=Oo(V,W),ge!=null&&Ke.push(hl(V,ge,$))),gt)break;V=V.return}0<Ke.length&&(q=new ne(q,Ie,null,a,re),ve.push({event:q,listeners:Ke}))}}if((n&7)===0){e:{if(ne=e==="mouseover"||e==="pointerover",q=e==="mouseout"||e==="pointerout",ne&&a!==df&&(Ie=a.relatedTarget||a.fromElement)&&(Bt(Ie)||Ie[st]))break e;(q||ne)&&(Ie=re.window===re?re:(ne=re.ownerDocument)?ne.defaultView||ne.parentWindow:window,q?(ne=a.relatedTarget||a.toElement,q=Z,ne=ne?Bt(ne):null,ne!==null&&(gt=u(ne),Ke=ne.tag,ne!==gt||Ke!==5&&Ke!==27&&Ke!==6)&&(ne=null)):(q=null,ne=Z),q!==ne&&(Ke=$m,ge="onMouseLeave",W="onMouseEnter",V="mouse",(e==="pointerout"||e==="pointerover")&&(Ke=tg,ge="onPointerLeave",W="onPointerEnter",V="pointer"),gt=q==null?Ie:xn(q),$=ne==null?Ie:xn(ne),Ie=new Ke(ge,V+"leave",q,a,re),Ie.target=gt,Ie.relatedTarget=$,ge=null,Bt(re)===Z&&(Ke=new Ke(W,V+"enter",ne,a,re),Ke.target=$,Ke.relatedTarget=gt,ge=Ke),gt=ge,Ke=q&&ne?H(q,ne,kM):null,q!==null&&Qv(ve,Ie,q,Ke,!1),ne!==null&&gt!==null&&Qv(ve,gt,ne,Ke,!0)))}e:{if(q=Z?xn(Z):window,ne=q.nodeName&&q.nodeName.toLowerCase(),ne==="select"||ne==="input"&&q.type==="file")var Xe=cg;else if(og(q))if(ug)Xe=WS;else{Xe=qS;var Rt=XS}else ne=q.nodeName,!ne||ne.toLowerCase()!=="input"||q.type!=="checkbox"&&q.type!=="radio"?Z&&ff(Z.elementType)&&(Xe=cg):Xe=YS;if(Xe&&(Xe=Xe(e,Z))){lg(ve,Xe,a,re);break e}Rt&&Rt(e,q,Z)}switch(Rt=Z?xn(Z):window,e){case"focusin":(og(Rt)||Rt.contentEditable==="true")&&(_r=Rt,Af=Z,Vo=null);break;case"focusout":Vo=Af=_r=null;break;case"mousedown":Cf=!0;break;case"contextmenu":case"mouseup":case"dragend":Cf=!1,_g(ve,a,re);break;case"selectionchange":if(KS)break;case"keydown":case"keyup":_g(ve,a,re)}var et;if(Sf)e:{switch(e){case"compositionstart":var ct="onCompositionStart";break e;case"compositionend":ct="onCompositionEnd";break e;case"compositionupdate":ct="onCompositionUpdate";break e}ct=void 0}else vr?sg(e,a)&&(ct="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(ct="onCompositionStart");ct&&(ng&&a.locale!=="ko"&&(vr||ct!=="onCompositionStart"?ct==="onCompositionEnd"&&vr&&(et=Qm()):(Ha=re,gf="value"in Ha?Ha.value:Ha.textContent,vr=!0)),Rt=tu(Z,ct),0<Rt.length&&(ct=new eg(ct,e,null,a,re),ve.push({event:ct,listeners:Rt}),et?ct.data=et:(et=rg(a),et!==null&&(ct.data=et)))),(et=HS?GS(e,a):VS(e,a))&&(ct=tu(Z,"onBeforeInput"),0<ct.length&&(Rt=new eg("onBeforeInput","beforeinput",null,a,re),ve.push({event:Rt,listeners:ct}),Rt.data=et)),HM(ve,e,Z,a,re)}Zv(ve,n)})}function hl(e,n,a){return{instance:e,listener:n,currentTarget:a}}function tu(e,n){for(var a=n+"Capture",r=[];e!==null;){var c=e,f=c.stateNode;if(c=c.tag,c!==5&&c!==26&&c!==27||f===null||(c=Oo(e,a),c!=null&&r.unshift(hl(e,c,f)),c=Oo(e,n),c!=null&&r.push(hl(e,c,f))),e.tag===3)return r;e=e.return}return[]}function kM(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Qv(e,n,a,r,c){for(var f=n._reactName,_=[];a!==null&&a!==r;){var b=a,z=b.alternate,Z=b.stateNode;if(b=b.tag,z!==null&&z===r)break;b!==5&&b!==26&&b!==27||Z===null||(z=Z,c?(Z=Oo(a,f),Z!=null&&_.unshift(hl(a,Z,z))):c||(Z=Oo(a,f),Z!=null&&_.push(hl(a,Z,z)))),a=a.return}_.length!==0&&e.push({event:n,listeners:_})}var XM=/\r\n?/g,qM=/\u0000|\uFFFD/g;function Jv(e){return(typeof e=="string"?e:""+e).replace(XM,`
`).replace(qM,"")}function $v(e,n){return n=Jv(n),Jv(e)===n}function kt(e,n,a,r,c,f){switch(a){case"children":if(typeof r=="string")n==="body"||n==="textarea"&&r===""||pr(e,r);else if(typeof r=="number"||typeof r=="bigint")n!=="body"&&pr(e,""+r);else return;break;case"className":Wl(e,"class",r);break;case"tabIndex":Wl(e,"tabindex",r);break;case"dir":case"role":case"viewBox":case"width":case"height":Wl(e,a,r);break;case"style":Wm(e,r,f);return;case"data":if(n!=="object"){Wl(e,"data",r);break}case"src":case"href":if(r===""&&(n!=="a"||a!=="href")){e.removeAttribute(a);break}if(r==null||typeof r=="function"||typeof r=="symbol"||typeof r=="boolean"){e.removeAttribute(a);break}r=Zl(r),e.setAttribute(a,r);break;case"action":case"formAction":if(typeof r=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&kt(e,n,"name",c.name,c,null),kt(e,n,"formEncType",c.formEncType,c,null),kt(e,n,"formMethod",c.formMethod,c,null),kt(e,n,"formTarget",c.formTarget,c,null)):(kt(e,n,"encType",c.encType,c,null),kt(e,n,"method",c.method,c,null),kt(e,n,"target",c.target,c,null)));if(r==null||typeof r=="symbol"||typeof r=="boolean"){e.removeAttribute(a);break}r=Zl(r),e.setAttribute(a,r);break;case"onClick":r!=null&&(e.onclick=Zi);return;case"onScroll":r!=null&&Tt("scroll",e);return;case"onScrollEnd":r!=null&&Tt("scrollend",e);return;case"dangerouslySetInnerHTML":if(r!=null){if(typeof r!="object"||!("__html"in r))throw Error(o(61));if(a=r.__html,a!=null){if(c.children!=null)throw Error(o(60));(f!=null?f.__html:void 0)!==a&&(e.innerHTML=a)}}break;case"multiple":e.multiple=r&&typeof r!="function"&&typeof r!="symbol";break;case"muted":e.muted=r&&typeof r!="function"&&typeof r!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(r==null||typeof r=="function"||typeof r=="boolean"||typeof r=="symbol"){e.removeAttribute("xlink:href");break}a=Zl(r),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":r!=null&&typeof r!="function"&&typeof r!="symbol"?e.setAttribute(a,r):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":r&&typeof r!="function"&&typeof r!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":r===!0?e.setAttribute(a,""):r!==!1&&r!=null&&typeof r!="function"&&typeof r!="symbol"?e.setAttribute(a,r):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":r!=null&&typeof r!="function"&&typeof r!="symbol"&&!isNaN(r)&&1<=r?e.setAttribute(a,r):e.removeAttribute(a);break;case"rowSpan":case"start":r==null||typeof r=="function"||typeof r=="symbol"||isNaN(r)?e.removeAttribute(a):e.setAttribute(a,r);break;case"popover":Tt("beforetoggle",e),Tt("toggle",e),Yl(e,"popover",r);break;case"xlinkActuate":ha(e,"http://www.w3.org/1999/xlink","xlink:actuate",r);break;case"xlinkArcrole":ha(e,"http://www.w3.org/1999/xlink","xlink:arcrole",r);break;case"xlinkRole":ha(e,"http://www.w3.org/1999/xlink","xlink:role",r);break;case"xlinkShow":ha(e,"http://www.w3.org/1999/xlink","xlink:show",r);break;case"xlinkTitle":ha(e,"http://www.w3.org/1999/xlink","xlink:title",r);break;case"xlinkType":ha(e,"http://www.w3.org/1999/xlink","xlink:type",r);break;case"xmlBase":ha(e,"http://www.w3.org/XML/1998/namespace","xml:base",r);break;case"xmlLang":ha(e,"http://www.w3.org/XML/1998/namespace","xml:lang",r);break;case"xmlSpace":ha(e,"http://www.w3.org/XML/1998/namespace","xml:space",r);break;case"is":Yl(e,"is",r);break;case"innerText":case"textContent":return;default:if(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")a=fS.get(a)||a,Yl(e,a,r);else return}Pt=!0}function ch(e,n,a,r,c,f){switch(a){case"style":Wm(e,r,f);return;case"dangerouslySetInnerHTML":if(r!=null){if(typeof r!="object"||!("__html"in r))throw Error(o(61));if(a=r.__html,a!=null){if(c.children!=null)throw Error(o(60));(f!=null?f.__html:void 0)!==a&&(e.innerHTML=a)}}break;case"children":if(typeof r=="string")pr(e,r);else if(typeof r=="number"||typeof r=="bigint")pr(e,""+r);else return;break;case"onScroll":r!=null&&Tt("scroll",e);return;case"onScrollEnd":r!=null&&Tt("scrollend",e);return;case"onClick":r!=null&&(e.onclick=Zi);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!Hn.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(c=a.endsWith("Capture"),f=a.slice(2,c?a.length-7:void 0),n=e[Ze]||null,n=n!=null?n[a]:null,typeof n=="function"&&e.removeEventListener(f,n,c),typeof r=="function")){typeof n!="function"&&n!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(f,r,c);break e}Pt=!0,a in e?e[a]=r:r===!0?e.setAttribute(a,""):Yl(e,a,r)}return}Pt=!0}function Dn(e,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Tt("error",e),Tt("load",e);var r=!1,c=!1,f;for(f in a)if(a.hasOwnProperty(f)){var _=a[f];if(_!=null)switch(f){case"src":r=!0;break;case"srcSet":c=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(o(137,n));default:kt(e,n,f,_,a,null)}}c&&kt(e,n,"srcSet",a.srcSet,a,null),r&&kt(e,n,"src",a.src,a,null);return;case"input":Tt("invalid",e);var b=f=_=c=null,z=null,Z=null;for(r in a)if(a.hasOwnProperty(r)){var re=a[r];if(re!=null)switch(r){case"name":c=re;break;case"type":_=re;break;case"checked":z=re;break;case"defaultChecked":Z=re;break;case"value":f=re;break;case"defaultValue":b=re;break;case"children":case"dangerouslySetInnerHTML":if(re!=null)throw Error(o(137,n));break;default:kt(e,n,r,re,a,null)}}km(e,f,b,z,Z,_,c,!1);return;case"select":Tt("invalid",e),r=_=f=null;for(c in a)if(a.hasOwnProperty(c)&&(b=a[c],b!=null))switch(c){case"value":f=b;break;case"defaultValue":_=b;break;case"multiple":r=b;default:kt(e,n,c,b,a,null)}n=f,a=_,e.multiple=!!r,n!=null?hr(e,!!r,n,!1):a!=null&&hr(e,!!r,a,!0);return;case"textarea":Tt("invalid",e),f=c=r=null;for(_ in a)if(a.hasOwnProperty(_)&&(b=a[_],b!=null))switch(_){case"value":r=b;break;case"defaultValue":c=b;break;case"children":f=b;break;case"dangerouslySetInnerHTML":if(b!=null)throw Error(o(91));break;default:kt(e,n,_,b,a,null)}qm(e,r,c,f);return;case"option":for(z in a)if(a.hasOwnProperty(z)&&(r=a[z],r!=null))switch(z){case"selected":e.selected=r&&typeof r!="function"&&typeof r!="symbol";break;default:kt(e,n,z,r,a,null)}return;case"dialog":Tt("beforetoggle",e),Tt("toggle",e),Tt("cancel",e),Tt("close",e);break;case"iframe":case"object":Tt("load",e);break;case"video":case"audio":for(r=0;r<dl.length;r++)Tt(dl[r],e);break;case"image":Tt("error",e),Tt("load",e);break;case"details":Tt("toggle",e);break;case"embed":case"source":case"link":Tt("error",e),Tt("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(Z in a)if(a.hasOwnProperty(Z)&&(r=a[Z],r!=null))switch(Z){case"children":case"dangerouslySetInnerHTML":throw Error(o(137,n));default:kt(e,n,Z,r,a,null)}return;default:if(ff(n)){for(re in a)a.hasOwnProperty(re)&&(r=a[re],r!==void 0&&ch(e,n,re,r,a,void 0));return}}for(b in a)a.hasOwnProperty(b)&&(r=a[b],r!=null&&kt(e,n,b,r,a,null))}var YM={};function WM(e,n,a,r){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var c=null,f=null,_=null,b=null,z=null,Z=null,re=null;for(ne in a){var ve=a[ne];if(a.hasOwnProperty(ne)&&ve!=null)switch(ne){case"checked":break;case"value":break;case"defaultValue":z=ve;default:r.hasOwnProperty(ne)||kt(e,n,ne,null,r,ve)}}for(var q in r){var ne=r[q];if(ve=a[q],r.hasOwnProperty(q)&&(ne!=null||ve!=null))switch(q){case"type":ne!==ve&&(Pt=!0),f=ne;break;case"name":ne!==ve&&(Pt=!0),c=ne;break;case"checked":ne!==ve&&(Pt=!0),Z=ne;break;case"defaultChecked":ne!==ve&&(Pt=!0),re=ne;break;case"value":ne!==ve&&(Pt=!0),_=ne;break;case"defaultValue":ne!==ve&&(Pt=!0),b=ne;break;case"children":case"dangerouslySetInnerHTML":if(ne!=null)throw Error(o(137,n));break;default:ne!==ve&&kt(e,n,q,ne,r,ve)}}cf(e,_,b,z,Z,re,f,c);return;case"select":ne=_=b=q=null;for(f in a)if(z=a[f],a.hasOwnProperty(f)&&z!=null)switch(f){case"value":break;case"multiple":ne=z;default:r.hasOwnProperty(f)||kt(e,n,f,null,r,z)}for(c in r)if(f=r[c],z=a[c],r.hasOwnProperty(c)&&(f!=null||z!=null))switch(c){case"value":f!==z&&(Pt=!0),q=f;break;case"defaultValue":f!==z&&(Pt=!0),b=f;break;case"multiple":f!==z&&(Pt=!0),_=f;default:f!==z&&kt(e,n,c,f,r,z)}n=b,a=_,r=ne,q!=null?hr(e,!!a,q,!1):!!r!=!!a&&(n!=null?hr(e,!!a,n,!0):hr(e,!!a,a?[]:"",!1));return;case"textarea":ne=q=null;for(b in a)if(c=a[b],a.hasOwnProperty(b)&&c!=null&&!r.hasOwnProperty(b))switch(b){case"value":break;case"children":break;default:kt(e,n,b,null,r,c)}for(_ in r)if(c=r[_],f=a[_],r.hasOwnProperty(_)&&(c!=null||f!=null))switch(_){case"value":c!==f&&(Pt=!0),q=c;break;case"defaultValue":c!==f&&(Pt=!0),ne=c;break;case"children":break;case"dangerouslySetInnerHTML":if(c!=null)throw Error(o(91));break;default:c!==f&&kt(e,n,_,c,r,f)}Xm(e,q,ne);return;case"option":for(var Ie in a)if(q=a[Ie],a.hasOwnProperty(Ie)&&q!=null&&!r.hasOwnProperty(Ie))switch(Ie){case"selected":e.selected=!1;break;default:kt(e,n,Ie,null,r,q)}for(z in r)if(q=r[z],ne=a[z],r.hasOwnProperty(z)&&q!==ne&&(q!=null||ne!=null))switch(z){case"selected":q!==ne&&(Pt=!0),e.selected=q&&typeof q!="function"&&typeof q!="symbol";break;default:kt(e,n,z,q,r,ne)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var Ke in a)q=a[Ke],a.hasOwnProperty(Ke)&&q!=null&&!r.hasOwnProperty(Ke)&&kt(e,n,Ke,null,r,q);for(Z in r)if(q=r[Z],ne=a[Z],r.hasOwnProperty(Z)&&q!==ne&&(q!=null||ne!=null))switch(Z){case"children":case"dangerouslySetInnerHTML":if(q!=null)throw Error(o(137,n));break;default:kt(e,n,Z,q,r,ne)}return;default:if(ff(n)){for(var gt in a)q=a[gt],a.hasOwnProperty(gt)&&q!==void 0&&!r.hasOwnProperty(gt)&&ch(e,n,gt,void 0,r,q);for(re in r)q=r[re],ne=a[re],!r.hasOwnProperty(re)||q===ne||q===void 0&&ne===void 0||ch(e,n,re,q,r,ne);return}}for(var W in a)q=a[W],a.hasOwnProperty(W)&&q!=null&&!r.hasOwnProperty(W)&&kt(e,n,W,null,r,q);for(ve in r)q=r[ve],ne=a[ve],!r.hasOwnProperty(ve)||q===ne||q==null&&ne==null||kt(e,n,ve,q,r,ne)}function e_(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function ZM(){if(typeof performance.getEntriesByType=="function"){for(var e=0,n=0,a=performance.getEntriesByType("resource"),r=0;r<a.length;r++){var c=a[r],f=c.transferSize,_=c.initiatorType,b=c.duration;if(f&&b&&e_(_)){for(_=0,b=c.responseEnd,r+=1;r<a.length;r++){var z=a[r],Z=z.startTime;if(Z>b)break;var re=z.transferSize,ve=z.initiatorType;re&&e_(ve)&&(z=z.responseEnd,_+=re*(z<b?1:(b-Z)/(z-Z)))}if(--r,n+=8*(f+_)/(c.duration/1e3),e++,10<e)break}}if(0<e)return n/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var uh=null,fh=null;function pl(e){return e.nodeType===9?e:e.ownerDocument}function t_(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function n_(e,n){if(e===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&n==="foreignObject"?0:e}function i_(e,n,a,r){return a=pl(a).createElement(e),a[Ue]=r,a[Ze]=n,Dn(a,e,n),zt(a),a}function dh(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var hh=null;function KM(){var e=window.event;return e&&e.type==="popstate"?e===hh?!1:(hh=e,!0):(hh=null,!1)}var ph=typeof setTimeout=="function"?setTimeout:void 0,QM=typeof clearTimeout=="function"?clearTimeout:void 0,a_=typeof Promise=="function"?Promise:void 0,s_=typeof requestAnimationFrame=="function"?requestAnimationFrame:ph,JM=typeof queueMicrotask=="function"?queueMicrotask:typeof a_<"u"?function(e){return a_.resolve(null).then(e).catch($M)}:ph;function $M(e){setTimeout(function(){throw e})}function rs(e){return e==="head"}function r_(e,n){var a=n,r=0;do{var c=a.nextSibling;if(e.removeChild(a),c&&c.nodeType===8)if(a=c.data,a==="/$"||a==="/&"){if(r===0){e.removeChild(c),Qr(n);return}r--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")r++;else if(a==="html")Mh(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,Mh(a);for(var f=a.firstChild;f;){var _=f.nextSibling,b=f.nodeName;f[It]||b==="SCRIPT"||b==="STYLE"||b==="LINK"&&f.rel.toLowerCase()==="stylesheet"||a.removeChild(f),f=_}}else a==="body"&&Mh(e.ownerDocument.body);a=c}while(a);Qr(n)}function o_(e,n){var a=e;e=0;do{var r=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),r&&r.nodeType===8)if(a=r.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=r}while(a)}function l_(e,n,a){if(n=CSS.escape(n)!==n?"r-"+btoa(n).replace(/=/g,""):n,e.style.viewTransitionName=n,a!=null&&(e.style.viewTransitionClass=a),a=getComputedStyle(e),a.display==="inline"){if(n=e.getClientRects(),n.length===1)var r=1;else for(var c=r=0;c<n.length;c++){var f=n[c];0<f.width&&0<f.height&&r++}r===1&&(e=e.style,e.display=n.length===1?"inline-block":"block",e.marginTop="-"+a.paddingTop,e.marginBottom="-"+a.paddingBottom)}}function c_(e,n){e=e.style,n=n.style;var a=n!=null?n.hasOwnProperty("viewTransitionName")?n.viewTransitionName:n.hasOwnProperty("view-transition-name")?n["view-transition-name"]:null:null;e.viewTransitionName=a==null||typeof a=="boolean"?"":(""+a).trim(),a=n!=null?n.hasOwnProperty("viewTransitionClass")?n.viewTransitionClass:n.hasOwnProperty("view-transition-class")?n["view-transition-class"]:null:null,e.viewTransitionClass=a==null||typeof a=="boolean"?"":(""+a).trim(),e.display==="inline-block"&&(n==null?e.display=e.margin="":(a=n.display,e.display=a==null||typeof a=="boolean"?"":a,a=n.margin,a!=null?e.margin=a:(a=n.hasOwnProperty("marginTop")?n.marginTop:n["margin-top"],e.marginTop=a==null||typeof a=="boolean"?"":a,n=n.hasOwnProperty("marginBottom")?n.marginBottom:n["margin-bottom"],e.marginBottom=n==null||typeof n=="boolean"?"":n)))}function e1(e,n,a){return a=a.ownerDocument.defaultView,{rect:e,abs:n.position==="absolute"||n.position==="fixed",clip:n.clipPath!=="none"||n.overflow!=="visible"||n.filter!=="none"||n.mask!=="none"||n.mask!=="none"||n.borderRadius!=="0px",view:0<=e.bottom&&0<=e.right&&e.top<=a.innerHeight&&e.left<=a.innerWidth}}function mh(e){var n=e.getBoundingClientRect(),a=getComputedStyle(e);return e1(n,a,e)}function t1(e){return e.documentElement.clientHeight}function n1(e){this.addEventListener("load",e),this.addEventListener("error",e)}function i1(e,n,a,r,c,f,_,b,z){var Z=n.nodeType===9?n:n.ownerDocument;try{var re=Z.startViewTransition({update:function(){var q=Z.defaultView,ne=q.navigation&&q.navigation.transition,Ie=Z.fonts.status;r();var Ke=[];if(Ie==="loaded"&&(t1(Z),Z.fonts.status==="loading"&&Ke.push(Z.fonts.ready)),Ie=Ke.length,e!==null)for(var gt=e.suspenseyImages,W=0,V=0;V<gt.length;V++){var $=gt[V];if(!$.complete){var ge=$.getBoundingClientRect();if(0<ge.bottom&&0<ge.right&&ge.top<q.innerHeight&&ge.left<q.innerWidth){if(W+=N_($),W>au){Ke.length=Ie;break}$=new Promise(n1.bind($)),Ke.push($)}}}if(0<Ke.length)return q=Promise.race([Promise.all(Ke),new Promise(function(Xe){return setTimeout(Xe,500)})]).then(c,c),(ne?Promise.allSettled([ne.finished,q]):q).then(f,f);if(c(),ne)return ne.finished.then(f,f);f()},types:a});Z.__reactViewTransition=re;var ve=[];return re.ready.then(function(){for(var q=Z.documentElement.getAnimations({subtree:!0}),ne=0;ne<q.length;ne++){var Ie=q[ne],Ke=Ie.effect,gt=Ke.pseudoElement;if(gt!=null&&gt.startsWith("::view-transition")){ve.push(Ie),Ie=Ke.getKeyframes();for(var W=gt=void 0,V=!0,$=0;$<Ie.length;$++){var ge=Ie[$],Xe=ge.width;if(gt===void 0)gt=Xe;else if(gt!==Xe){V=!1;break}if(Xe=ge.height,W===void 0)W=Xe;else if(W!==Xe){V=!1;break}delete ge.width,delete ge.height,ge.transform==="none"&&delete ge.transform}V&&gt!==void 0&&W!==void 0&&(Ke.setKeyframes(Ie),V=getComputedStyle(Ke.target,Ke.pseudoElement),V.width!==gt||V.height!==W)&&(V=Ie[0],V.width=gt,V.height=W,V=Ie[Ie.length-1],V.width=gt,V.height=W,Ke.setKeyframes(Ie))}}_()},function(q){Z.__reactViewTransition===re&&(Z.__reactViewTransition=null);try{if(typeof q=="object"&&q!==null)switch(q.name){case"InvalidStateError":(q.message==="View transition was skipped because document visibility state is hidden."||q.message==="Skipping view transition because document visibility state has become hidden."||q.message==="Skipping view transition because viewport size changed."||q.message==="Transition was aborted because of invalid state")&&(q=null)}q!==null&&z(q)}finally{r(),c(),_()}}),re.finished.finally(function(){for(var q=0;q<ve.length;q++)ve[q].cancel();Z.__reactViewTransition===re&&(Z.__reactViewTransition=null),b()}),re}catch{return r(),c(),_(),null}}function Ws(e,n){this._scope=document.documentElement,this._selector="::view-transition-"+e+"("+n+")"}Ws.prototype.animate=function(e,n){return n=typeof n=="number"?{duration:n}:I({},n),n.pseudoElement=this._selector,this._scope.animate(e,n)},Ws.prototype.getAnimations=function(){for(var e=this._scope,n=this._selector,a=e.getAnimations({subtree:!0}),r=[],c=0;c<a.length;c++){var f=a[c].effect;f!==null&&f.target===e&&f.pseudoElement===n&&r.push(a[c])}return r},Ws.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function u_(e){return{name:e,group:new Ws("group",e),imagePair:new Ws("image-pair",e),old:new Ws("old",e),new:new Ws("new",e)}}function ui(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}ui.prototype.addEventListener=function(e,n,a){var r=null,c=null;if(!(a!=null&&typeof a!="boolean"&&(r=a.signal||null,r!==null&&r.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var f=this._eventListeners;if(d_(f,e,n,a)===-1){var _=this,b=n;a!=null&&typeof a!="boolean"&&a.once===!0&&(b=function(z){_.removeEventListener(e,n,a),typeof n=="function"?n.call(this,z):n.handleEvent(z)}),r!==null&&(c=_.removeEventListener.bind(_,e,n,a),r.addEventListener("abort",c,{once:!0}),c=r.removeEventListener.bind(r,"abort",c)),r=Xr(a),f.push({type:e,listener:n,optionsOrUseCapture:a,attachedListener:b,cleanup:c}),v(this._fragmentFiber.child,!1,a1,e,b,r)}this._eventListeners=f}};function a1(e,n,a,r){return E(e).addEventListener(n,a,r),!1}ui.prototype.removeEventListener=function(e,n,a){var r=this._eventListeners;if(r!==null&&(n=d_(r,e,n,a),n!==-1)){var c=r[n];a=c.attachedListener;var f=c.cleanup;c=Xr(c.optionsOrUseCapture),v(this._fragmentFiber.child,!1,s1,e,a,c),r.splice(n,1),f!==null&&f()}};function s1(e,n,a,r){return E(e).removeEventListener(n,a,r),!1}function Xr(e){return e!=null&&typeof e!="boolean"&&(e.once===!0||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function f_(e){return e==null?"c=0":typeof e=="boolean"?"c="+(e?"1":"0"):"c="+(e.capture?"1":"0")}function d_(e,n,a,r){if(e.length===0)return-1;r=f_(r);for(var c=0;c<e.length;c++){var f=e[c];if(f.type===n&&f.listener===a&&f_(f.optionsOrUseCapture)===r)return c}return-1}ui.prototype.dispatchEvent=function(e){var n=M(this._fragmentFiber);if(n===null)return!0;n=E(n);var a=this._eventListeners;if(a!==null&&0<a.length||!e.bubbles){var r=n.nodeType===9?n.createComment(""):document.createTextNode("");if(a)for(var c=0;c<a.length;c++){var f=a[c];r.addEventListener(f.type,f.attachedListener,Xr(f.optionsOrUseCapture))}if(n.appendChild(r),e=r.dispatchEvent(e),a)for(c=0;c<a.length;c++)f=a[c],r.removeEventListener(f.type,f.attachedListener,Xr(f.optionsOrUseCapture));return n.removeChild(r),e}return n.dispatchEvent(e)},ui.prototype.focus=function(e){v(this._fragmentFiber.child,!0,h_,e,void 0,void 0)};function h_(e,n){return e.tag===6?!1:(e=E(e),v1(e,n))}ui.prototype.focusLast=function(e){var n=[];v(this._fragmentFiber.child,!0,gh,n,void 0,void 0);for(var a=n.length-1;0<=a&&!h_(n[a],e);a--);};function gh(e,n){return n.push(e),!1}ui.prototype.blur=function(){var e=M(this._fragmentFiber);e!==null&&(e=E(e),e=pl(e).activeElement,e!==null&&v(this._fragmentFiber.child,!1,r1,e,void 0,void 0))};function r1(e,n){return e.tag===6?!1:(e=E(e),e===n||e.contains(n)?(n.blur(),!0):!1)}ui.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),v(this._fragmentFiber.child,!1,o1,e,void 0,void 0)};function o1(e,n){return e.tag===6||(e=E(e),n.observe(e)),!1}ui.prototype.unobserveUsing=function(e){var n=this._observers;if(n!==null&&n.has(e)){n.delete(e),v(this._fragmentFiber.child,!1,l1,e,void 0,void 0);for(var a=n=0;a<Bi.length;a++){var r=Bi[a];r.fragmentInstance===this&&r.observer===e?e.unobserve(r.instance):Bi[n++]=r}Bi.length=n}};function l1(e,n){return e.tag===6||(e=E(e),n.unobserve(e)),!1}var Bi=[],vh=!1;function c1(e,n,a){Bi.push({fragmentInstance:e,observer:n,instance:a}),vh||(vh=!0,_1(function(){vh=!1;var r=Bi;Bi=[];for(var c=0;c<r.length;c++){var f=r[c];f.observer.unobserve(f.instance)}}))}ui.prototype.getClientRects=function(){var e=[];return v(this._fragmentFiber.child,!1,u1,e,void 0,void 0),e};function u1(e,n){if(e.tag===6){e=e.stateNode;var a=e.ownerDocument.createRange();a.selectNodeContents(e),n.push.apply(n,a.getClientRects())}else e=E(e),n.push.apply(n,e.getClientRects());return!1}ui.prototype.getRootNode=function(e){var n=M(this._fragmentFiber);return n===null?this:E(n).getRootNode(e)},ui.prototype.compareDocumentPosition=function(e){var n=M(this._fragmentFiber);if(n===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var a=[];v(this._fragmentFiber.child,!1,gh,a,void 0,void 0);var r=E(n);if(a.length===0){if(a=r,S(this._fragmentFiber)){e:{for(n=this._fragmentFiber.return;n!==null;){if(n.tag===4){n=n.stateNode.containerInfo;break e}if(n.tag===3||n.tag===5||n.tag===27)break;n=n.return}n=null}n!=null&&(a=n)}n=this._fragmentFiber;var c=r=a.compareDocumentPosition(e);return a===e?c=Node.DOCUMENT_POSITION_CONTAINS:r&Node.DOCUMENT_POSITION_CONTAINED_BY&&(a=T(n)[1],a===null?c=Node.DOCUMENT_POSITION_PRECEDING:(e=E(a).compareDocumentPosition(e),c=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),c|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}n=E(a[0]),c=E(a[a.length-1]);var f=S(this._fragmentFiber)?n.parentElement:r;if(f==null)return Node.DOCUMENT_POSITION_DISCONNECTED;r=f.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_CONTAINED_BY,f=f.compareDocumentPosition(c)&Node.DOCUMENT_POSITION_CONTAINED_BY;var _=n.compareDocumentPosition(e),b=c.compareDocumentPosition(e),z=_&Node.DOCUMENT_POSITION_CONTAINED_BY||b&Node.DOCUMENT_POSITION_CONTAINED_BY;return b=r&&f&&_&Node.DOCUMENT_POSITION_FOLLOWING&&b&Node.DOCUMENT_POSITION_PRECEDING,n=r&&n===e||f&&c===e||z||b?Node.DOCUMENT_POSITION_CONTAINED_BY:!r&&n===e||!f&&c===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:_,n&Node.DOCUMENT_POSITION_DISCONNECTED||n&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||f1(n,this._fragmentFiber,a[0],a[a.length-1],e)?n:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function f1(e,n,a,r,c){var f=Bt(c);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(a=!!f)e:{for(;f!==null;){if(f.tag===7&&(f===n||f.alternate===n)){a=!0;break e}f=f.return}a=!1}return a}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(f===null)return f=c.ownerDocument,c===f||c===f.documentElement||c===f.body;e:{for(f=n,n=M(n);f!==null;){if(!(f.tag!==5&&f.tag!==3&&f.tag!==27||f!==n&&f.alternate!==n)){f=!0;break e}f=f.return}f=!1}return f}return e&Node.DOCUMENT_POSITION_PRECEDING?((n=!!f)&&!(n=f===a)&&(n=H(a,f,F),n===null?n=!1:(v(n,!0,P,f,a),f=y,y=null,n=f!==null)),n):e&Node.DOCUMENT_POSITION_FOLLOWING?((n=!!f)&&!(n=f===r)&&(n=H(r,f,F),n===null?n=!1:(v(n,!0,U,f,r),f=y,O=y=null,n=f!==null)),n):!1}function p_(e,n){var a=e.ownerDocument.createRange();a.selectNodeContents(e),e=a.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,n?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}ui.prototype.scrollIntoView=function(e){if(typeof e=="object")throw Error(o(566));var n=[];v(this._fragmentFiber.child,!1,gh,n,void 0,void 0);var a=e!==!1;if(n.length===0){var r=T(this._fragmentFiber);if(r=a?r[1]||r[0]||M(this._fragmentFiber):r[0]||r[1],r===null)return;if(r.tag===6){e=E(r),p_(e,a);return}if(r=E(r),r.nodeType!==9){if(r.nodeType===11){a="host"in r?r.host:null,a!==null&&a.scrollIntoView(e);return}r.scrollIntoView(e)}}for(r=a?n.length-1:0;r!==(a?-1:n.length);){var c=n[r];c.tag===6?(c=E(c),p_(c,a)):E(c).scrollIntoView(e),r+=a?-1:1}};function d1(e,n){return e=E(e),m_(e,n),!1}function m_(e,n){e.reactFragments==null&&(e.reactFragments=new Set),e.reactFragments.add(n)}function g_(e,n){var a=n._eventListeners;if(a!==null)for(var r=0;r<a.length;r++){var c=a[r];e.addEventListener(c.type,c.attachedListener,Xr(c.optionsOrUseCapture))}e.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(f){for(var _=0,b=0;b<Bi.length;b++){var z=Bi[b];(z.fragmentInstance!==n||z.observer!==f||z.instance!==e)&&(Bi[_++]=z)}Bi.length=_,f.observe(e)}),m_(e,n))}function h1(e,n){var a=n._eventListeners;if(a!==null)for(var r=0;r<a.length;r++){var c=a[r];e.removeEventListener(c.type,c.attachedListener,Xr(c.optionsOrUseCapture))}e.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(f){typeof f.rootMargin=="string"?c1(n,f,e):f.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(n))}function _h(e){var n=e.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":_h(a),it(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function p1(e,n,a,r){for(;e.nodeType===1;){var c=a;if(e.nodeName.toLowerCase()!==n.toLowerCase()){if(!r&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(r){if(!e[It])switch(n){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(f=e.getAttribute("rel"),f==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(f!==c.rel||e.getAttribute("href")!==(c.href==null||c.href===""?null:c.href)||e.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin)||e.getAttribute("title")!==(c.title==null?null:c.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(f=e.getAttribute("src"),(f!==(c.src==null?null:c.src)||e.getAttribute("type")!==(c.type==null?null:c.type)||e.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin))&&f&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(n==="input"&&e.type==="hidden"){var f=c.name==null?null:""+c.name;if(c.type==="hidden"&&e.getAttribute("name")===f)return e}else return e;if(e=Ti(e.nextSibling),e===null)break}return null}function m1(e,n,a){if(n==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=Ti(e.nextSibling),e===null))return null;return e}function v_(e,n){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Ti(e.nextSibling),e===null))return null;return e}function xh(e){return e.data==="$?"||e.data==="$~"}function yh(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function g1(e,n){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=n;else if(e.data!=="$?"||a.readyState!=="loading")n();else{var r=function(){n(),a.removeEventListener("DOMContentLoaded",r)};a.addEventListener("DOMContentLoaded",r),e._reactRetry=r}}function Ti(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return e}var Sh=null;function __(e){e=e.nextSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(n===0)return Ti(e.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}e=e.nextSibling}return null}function x_(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return e;n--}else a!=="/$"&&a!=="/&"||n++}e=e.previousSibling}return null}function v1(e,n){function a(){r=!0}if(e.ownerDocument.activeElement===e)return!0;var r=!1;try{e.ownerDocument.addEventListener("focus",a,!0),(e.focus||HTMLElement.prototype.focus).call(e,n)}finally{e.ownerDocument.removeEventListener("focus",a,!0)}return r}function _1(e){s_(function(){s_(function(n){return e(n)})})}function y_(e,n,a){switch(n=pl(a),e){case"html":if(e=n.documentElement,!e)throw Error(o(452));return e;case"head":if(e=n.head,!e)throw Error(o(453));return e;case"body":if(e=n.body,!e)throw Error(o(454));return e;default:throw Error(o(451))}}function S_(e,n,a){for(var r in a){var c=a[r];a.hasOwnProperty(r)&&c!=null&&kt(e,n,r,null,YM,c)}a.dangerouslySetInnerHTML!=null&&(e.textContent=""),e.onclick===Zi&&(e.onclick=null),it(e)}function Mh(e){for(var n=e.attributes;n.length;)e.removeAttributeNode(n[0]);it(e)}var bi=new Map,M_=new Set;function ml(e){if(typeof e.getRootNode=="function"){var n=e.getRootNode();if(n.nodeType===9||n.nodeType===11)return n}return e.nodeType===9?e:e.ownerDocument}var Aa=ce.d;ce.d={f:x1,r:y1,D:S1,C:M1,L:E1,m:T1,X:A1,S:b1,M:C1};function x1(){var e=Aa.f(),n=Zc();return e||n}function y1(e){var n=xt(e);n!==null&&n.tag===5&&n.type==="form"?T0(n):Aa.r(e)}var qr=typeof document>"u"?null:document;function E_(e,n,a){var r=qr;if(r&&typeof n=="string"&&n){var c=vi(n);c='link[rel="'+e+'"][href="'+c+'"]',typeof a=="string"&&(c+='[crossorigin="'+a+'"]'),M_.has(c)||(M_.add(c),e={rel:e,crossOrigin:a,href:n},r.querySelector(c)===null&&(n=r.createElement("link"),Dn(n,"link",e),zt(n),r.head.appendChild(n)))}}function S1(e){Aa.D(e),E_("dns-prefetch",e,null)}function M1(e,n){Aa.C(e,n),E_("preconnect",e,n)}function E1(e,n,a){Aa.L(e,n,a);var r=qr;if(r&&e&&n){var c='link[rel="preload"][as="'+vi(n)+'"]';n==="image"&&a&&a.imageSrcSet?(c+='[imagesrcset="'+vi(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(c+='[imagesizes="'+vi(a.imageSizes)+'"]')):c+='[href="'+vi(e)+'"]';var f=c;switch(n){case"style":f=Yr(e);break;case"script":f=Wr(e)}if(!(bi.has(f)||(e=I({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:e,as:n},a),bi.set(f,e),r.querySelector(c)!==null||n==="style"&&r.querySelector(gl(f))||n==="script"&&r.querySelector(vl(f))))){var _=r.createElement("link");Dn(_,"link",e),n==="style"&&(_[Ot]=!0,_.onload=_.onerror=function(){Fa(_)}),zt(_),r.head.appendChild(_)}}}function T1(e,n){Aa.m(e,n);var a=qr;if(a&&e){var r=n&&typeof n.as=="string"?n.as:"script",c='link[rel="modulepreload"][as="'+vi(r)+'"][href="'+vi(e)+'"]',f=c;switch(r){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=Wr(e)}if(!bi.has(f)&&(e=I({rel:"modulepreload",href:e},n),bi.set(f,e),a.querySelector(c)===null)){switch(r){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(vl(f)))return}r=a.createElement("link"),Dn(r,"link",e),zt(r),a.head.appendChild(r)}}}function b1(e,n,a){Aa.S(e,n,a);var r=qr;if(r&&e){var c=ni(r).hoistableStyles,f=Yr(e);n=n||"default";var _=c.get(f);if(!_){var b={loading:0,preload:null};if(_=r.querySelector(gl(f)))b.loading=5;else{e=I({rel:"stylesheet",href:e,"data-precedence":n},a),(a=bi.get(f))&&Eh(e,a);var z=_=r.createElement("link");zt(z),Dn(z,"link",e),z._p=new Promise(function(Z,re){z.onload=Z,z.onerror=re}),z.addEventListener("load",function(){b.loading|=1}),z.addEventListener("error",function(){b.loading|=2}),b.loading|=4,nu(_,n,r)}_={type:"stylesheet",instance:_,count:1,state:b},c.set(f,_)}}}function A1(e,n){Aa.X(e,n);var a=qr;if(a&&e){var r=ni(a).hoistableScripts,c=Wr(e),f=r.get(c);f||(f=a.querySelector(vl(c)),f||(e=I({src:e,async:!0},n),(n=bi.get(c))&&Th(e,n),f=a.createElement("script"),zt(f),Dn(f,"link",e),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},r.set(c,f))}}function C1(e,n){Aa.M(e,n);var a=qr;if(a&&e){var r=ni(a).hoistableScripts,c=Wr(e),f=r.get(c);f||(f=a.querySelector(vl(c)),f||(e=I({src:e,async:!0,type:"module"},n),(n=bi.get(c))&&Th(e,n),f=a.createElement("script"),zt(f),Dn(f,"link",e),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},r.set(c,f))}}function T_(e,n,a,r){var c=(c=Mt.current)?ml(c):null;if(!c)throw Error(o(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(a=Yr(a.href),n=ni(c).hoistableStyles,r=n.get(a),r||(r={type:"style",instance:null,count:0,state:null},n.set(a,r)),r):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=Yr(a.href);var f=ni(c).hoistableStyles,_=f.get(e);if(_||(c=c.ownerDocument||c,_={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(e,_),(f=c.querySelector(gl(e)))?f._p||(_.instance=f,_.state.loading=5):(f=bi.get(e),f||(f={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},bi.set(e,f)),R1(c,e,f,_.state))),n&&r===null)throw Error(o(528,""));return _}if(n&&r!==null)throw Error(o(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(a=Wr(a),n=ni(c).hoistableScripts,r=n.get(a),r||(r={type:"script",instance:null,count:0,state:null},n.set(a,r)),r):{type:"void",instance:null,count:0,state:null};default:throw Error(o(444,e))}}function Yr(e){return'href="'+vi(e)+'"'}function gl(e){return'link[rel="stylesheet"]['+e+"]"}function b_(e){return I({},e,{"data-precedence":e.precedence,precedence:null})}function R1(e,n,a,r){if(n=e.querySelector('link[rel="preload"][as="style"]['+n+"]")){if(n[Ot]!==!0){r.loading=1;return}}else n=e.createElement("link"),n[Ot]=!0,n.onload=n.onerror=Fa.bind(null,n),Dn(n,"link",a),zt(n),e.head.appendChild(n);r.preload=n,n.addEventListener("load",function(){return r.loading|=1}),n.addEventListener("error",function(){return r.loading|=2})}function Wr(e){return'[src="'+vi(e)+'"]'}function vl(e){return"script[async]"+e}function A_(e,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var r=e.querySelector('style[data-href~="'+vi(a.href)+'"]');if(r)return n.instance=r,zt(r),r;var c=I({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement("style"),zt(r),Dn(r,"style",c),nu(r,a.precedence,e),n.instance=r;case"stylesheet":c=Yr(a.href);var f=e.querySelector(gl(c));if(f)return n.state.loading|=4,n.instance=f,zt(f),f;r=b_(a),(c=bi.get(c))&&Eh(r,c),f=(e.ownerDocument||e).createElement("link"),zt(f);var _=f;return _._p=new Promise(function(b,z){_.onload=b,_.onerror=z}),Dn(f,"link",r),n.state.loading|=4,nu(f,a.precedence,e),n.instance=f;case"script":return f=Wr(a.src),(c=e.querySelector(vl(f)))?(n.instance=c,zt(c),c):(r=a,(c=bi.get(f))&&(r=I({},a),Th(r,c)),e=e.ownerDocument||e,c=e.createElement("script"),zt(c),Dn(c,"link",r),e.head.appendChild(c),n.instance=c);case"void":return null;default:throw Error(o(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(r=n.instance,n.state.loading|=4,nu(r,a.precedence,e));return n.instance}function nu(e,n,a){for(var r=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),c=r.length?r[r.length-1]:null,f=c,_=0;_<r.length;_++){var b=r[_];if(b.dataset.precedence===n)f=b;else if(f!==c)break}f?f.parentNode.insertBefore(e,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(e,n.firstChild))}function Eh(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.title==null&&(e.title=n.title)}function Th(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.integrity==null&&(e.integrity=n.integrity)}var iu=null;function C_(e,n,a){if(iu===null){var r=new Map,c=iu=new Map;c.set(a,r)}else c=iu,r=c.get(a),r||(r=new Map,c.set(a,r));if(r.has(e))return r;for(r.set(e,null),a=a.getElementsByTagName(e),c=0;c<a.length;c++){var f=a[c];if(!(f[It]||f[Ue]||e==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var _=f.getAttribute(n)||"";_=e+_;var b=r.get(_);b?b.push(f):r.set(_,[f])}}return r}function bh(e,n,a){e=e.ownerDocument||e,e.head.insertBefore(a,n==="title"?e.querySelector("head > title"):null)}function w1(e,n,a){if(a===1||n.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;switch(n.rel){case"stylesheet":return e=n.disabled,typeof n.precedence=="string"&&e==null;default:return!0}case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function R_(e,n){return e==="img"&&n.src!=null&&n.src!==""&&n.onLoad==null&&n.loading!=="lazy"}function w_(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function N_(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function D_(e,n){typeof n.decode=="function"&&(e.imgCount++,n.complete||(e.imgBytes+=N_(n),e.suspenseyImages.push(n)),e=U1.bind(e),n.decode().then(e,e))}function N1(e,n,a,r){if(a.type==="stylesheet"&&(typeof r.media!="string"||matchMedia(r.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var c=Yr(r.href),f=n.querySelector(gl(c));if(f){n=f._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(e.count++,e=_l.bind(e),n.then(e,e)),a.state.loading|=4,a.instance=f,zt(f);return}f=n.ownerDocument||n,r=b_(r),(c=bi.get(c))&&Eh(r,c),f=f.createElement("link"),zt(f);var _=f;_._p=new Promise(function(b,z){_.onload=b,_.onerror=z}),Dn(f,"link",r),a.instance=f}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=_l.bind(e),n.addEventListener("load",a),n.addEventListener("error",a))}}var au=0;function D1(e,n){return e.stylesheets&&e.count===0&&ru(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var r=setTimeout(function(){if(e.stylesheets&&ru(e,e.stylesheets),e.unsuspend){var f=e.unsuspend;e.unsuspend=null,f()}},6e4+n);0<e.imgBytes&&au===0&&(au=62500*ZM());var c=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&ru(e,e.stylesheets),e.unsuspend)){var f=e.unsuspend;e.unsuspend=null,f()}},(e.imgBytes>au?50:800)+n);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(c)}}:null}function U_(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)ru(e,e.stylesheets);else if(e.unsuspend){var n=e.unsuspend;e.unsuspend=null,n()}}}function _l(){this.count--,U_(this)}function U1(){this.imgCount--,U_(this)}var su=null;function ru(e,n){e.stylesheets=null,e.unsuspend!==null&&(e.count++,su=new Map,n.forEach(L1,e),su=null,_l.call(e))}function L1(e,n){if(!(n.state.loading&4)){var a=su.get(e);if(a)var r=a.get(null);else{a=new Map,su.set(e,a);for(var c=e.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<c.length;f++){var _=c[f];(_.nodeName==="LINK"||_.getAttribute("media")!=="not all")&&(a.set(_.dataset.precedence,_),r=_)}r&&a.set(null,r)}c=n.instance,_=c.getAttribute("data-precedence"),f=a.get(_)||r,f===r&&a.set(null,c),a.set(_,c),this.count++,r=_l.bind(this),c.addEventListener("load",r),c.addEventListener("error",r),f?f.parentNode.insertBefore(c,f.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(c,e.firstChild)),n.state.loading|=4}}var Zr={$$typeof:fe,Provider:null,Consumer:null,_currentValue:D,_currentValue2:D,_threadCount:0};function O1(e,n,a,r,c,f,_,b,z){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Lo(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Lo(0),this.hiddenUpdates=Lo(null),this.identifierPrefix=r,this.onUncaughtError=c,this.onCaughtError=f,this.onRecoverableError=_,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=z,this.transitionTypes=null,this.incompleteTransitions=new Map}function L_(e,n,a,r,c,f,_,b,z,Z,re,ve){return e=new O1(e,n,a,_,z,Z,re,ve,b),n=1,f===!0&&(n|=24),f=Wn(3,null,null,n),e.current=f,f.stateNode=e,n=Hf(),n.refCount++,e.pooledCache=n,n.refCount++,f.memoizedState={element:r,isDehydrated:a,cache:n},kf(f),e}function O_(e){return e?(e=Sr,e):Sr}function z_(e,n,a,r,c,f){c=O_(c),r.context===null?r.context=c:r.pendingContext=c,r=Wa(n),r.payload={element:a},f=f===void 0?null:f,f!==null&&(r.callback=f),a=Za(e,r,n),a!==null&&(Jn(a,e,n),Zo(a,e,n))}function P_(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<n?a:n}}function Ah(e,n){P_(e,n),(e=e.alternate)&&P_(e,n)}function I_(e){if(e.tag===13||e.tag===31){var n=Ds(e,67108864);n!==null&&Jn(n,e,67108864),Ah(e,67108864)}}function B_(e){if(e.tag===13||e.tag===31){var n=ci();n=ue(n);var a=Ds(e,n);a!==null&&Jn(a,e,n),Ah(e,n)}}var Kr=!0;function z1(e,n,a,r){var c=be.T;be.T=null;var f=ce.p;try{ce.p=2,Ch(e,n,a,r)}finally{ce.p=f,be.T=c}}function P1(e,n,a,r){var c=be.T;be.T=null;var f=ce.p;try{ce.p=8,Ch(e,n,a,r)}finally{ce.p=f,be.T=c}}function Ch(e,n,a,r){if(Kr){var c=Rh(r);if(c===null)lh(e,n,r,ou,a),H_(e,r);else if(B1(c,e,n,a,r))r.stopPropagation();else if(H_(e,r),n&4&&-1<I1.indexOf(e)){for(;c!==null;){var f=xt(c);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var _=gi(f.pendingLanes);if(_!==0){var b=f;for(b.pendingLanes|=2,b.entangledLanes|=2;_;){var z=1<<31-On(_);b.entanglements[1]|=z,_&=~z}sa(f),(Ft&6)===0&&(qc=j()+500,fl(0))}}break;case 31:case 13:b=Ds(f,2),b!==null&&Jn(b,f,2),Zc(),Ah(f,2)}if(f=Rh(r),f===null&&lh(e,n,r,ou,a),f===c)break;c=f}c!==null&&r.stopPropagation()}else lh(e,n,r,null,a)}}function Rh(e){return e=hf(e),wh(e)}var ou=null;function wh(e){if(ou=null,e=Bt(e),e!==null){var n=u(e);if(n===null)e=null;else{var a=n.tag;if(a===13){if(e=d(n),e!==null)return e;e=null}else if(a===31){if(e=h(n),e!==null)return e;e=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null)}}return ou=e,null}function F_(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Ne()){case Le:return 2;case Ye:return 8;case Ce:case Se:return 32;case Je:return 268435456;default:return 32}default:return 32}}var Nh=!1,os=null,ls=null,cs=null,xl=new Map,yl=new Map,us=[],I1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function H_(e,n){switch(e){case"focusin":case"focusout":os=null;break;case"dragenter":case"dragleave":ls=null;break;case"mouseover":case"mouseout":cs=null;break;case"pointerover":case"pointerout":xl.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":yl.delete(n.pointerId)}}function Sl(e,n,a,r,c,f){return e===null||e.nativeEvent!==f?(e={blockedOn:n,domEventName:a,eventSystemFlags:r,nativeEvent:f,targetContainers:[c]},n!==null&&(n=xt(n),n!==null&&I_(n)),e):(e.eventSystemFlags|=r,n=e.targetContainers,c!==null&&n.indexOf(c)===-1&&n.push(c),e)}function B1(e,n,a,r,c){switch(n){case"focusin":return os=Sl(os,e,n,a,r,c),!0;case"dragenter":return ls=Sl(ls,e,n,a,r,c),!0;case"mouseover":return cs=Sl(cs,e,n,a,r,c),!0;case"pointerover":var f=c.pointerId;return xl.set(f,Sl(xl.get(f)||null,e,n,a,r,c)),!0;case"gotpointercapture":return f=c.pointerId,yl.set(f,Sl(yl.get(f)||null,e,n,a,r,c)),!0}return!1}function G_(e){var n=Bt(e.target);if(n!==null){var a=u(n);if(a!==null){if(n=a.tag,n===13){if(n=d(a),n!==null){e.blockedOn=n,He(e.priority,function(){B_(a)});return}}else if(n===31){if(n=h(a),n!==null){e.blockedOn=n,He(e.priority,function(){B_(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function lu(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var a=Rh(e.nativeEvent);if(a===null){a=e.nativeEvent;var r=new a.constructor(a.type,a);df=r,a.target.dispatchEvent(r),df=null}else return n=xt(a),n!==null&&I_(n),e.blockedOn=a,!1;n.shift()}return!0}function V_(e,n,a){lu(e)&&a.delete(n)}function F1(){Nh=!1,os!==null&&lu(os)&&(os=null),ls!==null&&lu(ls)&&(ls=null),cs!==null&&lu(cs)&&(cs=null),xl.forEach(V_),yl.forEach(V_)}function cu(e,n){e.blockedOn===n&&(e.blockedOn=null,Nh||(Nh=!0,s.unstable_scheduleCallback(s.unstable_NormalPriority,F1)))}var uu=null;function j_(e){uu!==e&&(uu=e,s.unstable_scheduleCallback(s.unstable_NormalPriority,function(){uu===e&&(uu=null);for(var n=0;n<e.length;n+=3){var a=e[n],r=e[n+1],c=e[n+2];if(typeof r!="function"){if(wh(r||a)===null)continue;break}var f=xt(a);f!==null&&(e.splice(n,3),n-=3,fd(f,{pending:!0,data:c,method:a.method,action:r},r,c))}}))}function Qr(e){function n(z){return cu(z,e)}os!==null&&cu(os,e),ls!==null&&cu(ls,e),cs!==null&&cu(cs,e),xl.forEach(n),yl.forEach(n);for(var a=0;a<us.length;a++){var r=us[a];r.blockedOn===e&&(r.blockedOn=null)}for(;0<us.length&&(a=us[0],a.blockedOn===null);)G_(a),a.blockedOn===null&&us.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(r=0;r<a.length;r+=3){var c=a[r],f=a[r+1],_=c[Ze]||null;if(typeof f=="function")_||j_(a);else if(_){var b=null;if(f&&f.hasAttribute("formAction")){if(c=f,_=f[Ze]||null)b=_.formAction;else if(wh(c)!==null)continue}else b=_.action;typeof b=="function"?a[r+1]=b:(a.splice(r,3),r-=3),j_(a)}}}function k_(){function e(f){f.canIntercept&&f.info==="react-transition"&&f.intercept({handler:function(){return new Promise(function(_){return c=_})},focusReset:"manual",scroll:"manual"})}function n(){c!==null&&(c(),c=null),r||setTimeout(a,20)}function a(){if(!r&&!navigation.transition){var f=navigation.currentEntry;f&&f.url!=null&&navigation.navigate(f.url,{state:f.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var r=!1,c=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){r=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),c!==null&&(c(),c=null)}}}function Dh(e){this._internalRoot=e}fu.prototype.render=Dh.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(o(409));var a=n.current,r=ci();z_(a,r,e,n,null,null)},fu.prototype.unmount=Dh.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;z_(e.current,2,null,e,null,null),Zc(),n[st]=null}};function fu(e){this._internalRoot=e}fu.prototype.unstable_scheduleHydration=function(e){if(e){var n=we();e={blockedOn:null,target:e,priority:n};for(var a=0;a<us.length&&n!==0&&n<us[a].priority;a++);us.splice(a,0,e),a===0&&G_(e)}};var X_=t.version;if(X_!=="19.3.1")throw Error(o(527,X_,"19.3.1"));ce.findDOMNode=function(e){var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(o(188)):(e=Object.keys(e).join(","),Error(o(268,e)));return e=g(n),e=e!==null?x(e):null,e=e===null?null:e.stateNode,e};var H1={bundleType:0,version:"19.3.1",rendererPackageName:"react-dom",currentDispatcherRef:be,reconcilerVersion:"19.3.1"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var du=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!du.isDisabled&&du.supportsFiber)try{At=du.inject(H1),tn=du}catch{}}return El.createRoot=function(e,n){if(!l(e))throw Error(o(299));var a=!1,r="",c=O0,f=z0,_=P0;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(r=n.identifierPrefix),n.onUncaughtError!==void 0&&(c=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(_=n.onRecoverableError)),n=L_(e,1,!1,null,null,a,r,null,c,f,_,k_),e[st]=n.current,oh(e),new Dh(n)},El.hydrateRoot=function(e,n,a){if(!l(e))throw Error(o(299));var r=!1,c="",f=O0,_=z0,b=P0,z=null;return a!=null&&(a.unstable_strictMode===!0&&(r=!0),a.identifierPrefix!==void 0&&(c=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(_=a.onCaughtError),a.onRecoverableError!==void 0&&(b=a.onRecoverableError),a.formState!==void 0&&(z=a.formState)),n=L_(e,1,!0,n,a??null,r,c,z,f,_,b,k_),n.context=O_(null),a=n.current,r=ci(),r=ue(r),c=Wa(r),c.callback=null,Za(a,c,r),a=r,n.current.lanes=a,Rs(n,a),sa(n),e[st]=n.current,oh(e),new fu(n)},El.version="19.3.1",El}var tx;function Q1(){if(tx)return Oh.exports;tx=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(t){console.error(t)}}return s(),Oh.exports=K1(),Oh.exports}var J1=Q1();const $1=cy(J1);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eE=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),uy=(...s)=>s.filter((t,i,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===i).join(" ").trim();/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var tE={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nE=Qe.forwardRef(({color:s="currentColor",size:t=24,strokeWidth:i=2,absoluteStrokeWidth:o,className:l="",children:u,iconNode:d,...h},p)=>Qe.createElement("svg",{ref:p,...tE,width:t,height:t,stroke:s,strokeWidth:o?Number(i)*24/Number(t):i,className:uy("lucide",l),...h},[...d.map(([g,x])=>Qe.createElement(g,x)),...Array.isArray(u)?u:[u]]));/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bt=(s,t)=>{const i=Qe.forwardRef(({className:o,...l},u)=>Qe.createElement(nE,{ref:u,iconNode:t,className:uy(`lucide-${eE(s)}`,o),...l}));return i.displayName=`${s}`,i};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iE=bt("ArrowDownLeft",[["path",{d:"M17 7 7 17",key:"15tmo1"}],["path",{d:"M17 17H7V7",key:"1org7z"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const po=bt("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aE=bt("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nx=bt("Bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sE=bt("BookOpen",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ia=bt("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rE=bt("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ys=bt("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oE=bt("CircleHelp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _m=bt("Clock3",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16.5 12",key:"1aq6pp"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ul=bt("Coins",[["circle",{cx:"8",cy:"8",r:"6",key:"3yglwk"}],["path",{d:"M18.09 10.37A6 6 0 1 1 10.34 18",key:"t5s6rm"}],["path",{d:"M7 6h1v4",key:"1obek4"}],["path",{d:"m16.71 13.88.7.71-2.82 2.82",key:"1rbuyh"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sp=bt("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xm=bt("FileCheck2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",key:"1pf5j1"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"m3 15 2 2 4-4",key:"1lhrkk"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mp=bt("Fingerprint",[["path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",key:"1nerag"}],["path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88",key:"o46ks0"}],["path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02",key:"ptglia"}],["path",{d:"M2 12a10 10 0 0 1 18-6",key:"ydlgp0"}],["path",{d:"M2 16h.01",key:"1gqxmh"}],["path",{d:"M21.8 16c.2-2 .131-5.354 0-6",key:"drycrb"}],["path",{d:"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",key:"1tidbn"}],["path",{d:"M8.65 22c.21-.66.45-1.32.57-2",key:"13wd9y"}],["path",{d:"M9 6.8a6 6 0 0 1 9 5.2v2",key:"1fr1j5"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lE=bt("Flag",[["path",{d:"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z",key:"i9b6wo"}],["line",{x1:"4",x2:"4",y1:"22",y2:"15",key:"1cm3nv"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cE=bt("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ix=bt("LayoutGrid",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fy=bt("Leaf",[["path",{d:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",key:"nnexq3"}],["path",{d:"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",key:"mt58a7"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uE=bt("Maximize",[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3",key:"1dcmit"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3",key:"1e4gt3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3",key:"wsl5sc"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3",key:"18trek"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fE=bt("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dy=bt("Minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ym=bt("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cr=bt("Package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["path",{d:"m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7",key:"yx3hmr"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dE=bt("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bh=bt("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hE=bt("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sm=bt("ScanLine",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["path",{d:"M7 12h10",key:"b7w52i"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ax=bt("ScrollText",[["path",{d:"M15 12h-5",key:"r7krc0"}],["path",{d:"M15 8h-5",key:"1khuty"}],["path",{d:"M19 17V5a2 2 0 0 0-2-2H4",key:"zz82l3"}],["path",{d:"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",key:"1ph1d7"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pE=bt("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mm=bt("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mE=bt("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gE=bt("Store",[["path",{d:"m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7",key:"ztvudi"}],["path",{d:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",key:"1b2hhj"}],["path",{d:"M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4",key:"2ebpfo"}],["path",{d:"M2 7h20",key:"1fcdvo"}],["path",{d:"M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7",key:"6c3vgh"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hy=bt("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vE=bt("Volume2",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _E=bt("VolumeX",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Em=bt("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fu=bt("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Tm="180",xE=0,sx=1,yE=2,py=1,SE=2,Ua=3,Es=0,ti=1,oa=2,Oa=0,go=1,Ep=2,rx=3,ox=4,ME=5,ar=100,EE=101,TE=102,bE=103,AE=104,CE=200,RE=201,wE=202,NE=203,Tp=204,bp=205,DE=206,UE=207,LE=208,OE=209,zE=210,PE=211,IE=212,BE=213,FE=214,Ap=0,Cp=1,Rp=2,So=3,wp=4,Np=5,Dp=6,Up=7,my=0,HE=1,GE=2,Ss=0,gy=1,vy=2,_y=3,bm=4,xy=5,yy=6,Sy=7,My=300,Mo=301,Eo=302,Lp=303,Op=304,ef=306,zp=1e3,rr=1001,Pp=1002,Di=1003,VE=1004,hu=1005,ji=1006,Fh=1007,or=1008,ca=1009,Ey=1010,Ty=1011,Ll=1012,Am=1013,ur=1014,La=1015,za=1016,Cm=1017,Rm=1018,Ol=1020,by=35902,Ay=35899,Cy=1021,Ry=1022,ki=1023,zl=1026,Pl=1027,wy=1028,wm=1029,Ny=1030,Nm=1031,Dm=1033,Hu=33776,Gu=33777,Vu=33778,ju=33779,Ip=35840,Bp=35841,Fp=35842,Hp=35843,Gp=36196,Vp=37492,jp=37496,kp=37808,Xp=37809,qp=37810,Yp=37811,Wp=37812,Zp=37813,Kp=37814,Qp=37815,Jp=37816,$p=37817,em=37818,tm=37819,nm=37820,im=37821,am=36492,sm=36494,rm=36495,om=36283,lm=36284,cm=36285,um=36286,jE=3200,kE=3201,Dy=0,XE=1,xs="",ei="srgb",To="srgb-linear",Zu="linear",Xt="srgb",Jr=7680,lx=519,qE=512,YE=513,WE=514,Uy=515,ZE=516,KE=517,QE=518,JE=519,cx=35044,ux="300 es",la=2e3,Ku=2001;class Co{addEventListener(t,i){this._listeners===void 0&&(this._listeners={});const o=this._listeners;o[t]===void 0&&(o[t]=[]),o[t].indexOf(i)===-1&&o[t].push(i)}hasEventListener(t,i){const o=this._listeners;return o===void 0?!1:o[t]!==void 0&&o[t].indexOf(i)!==-1}removeEventListener(t,i){const o=this._listeners;if(o===void 0)return;const l=o[t];if(l!==void 0){const u=l.indexOf(i);u!==-1&&l.splice(u,1)}}dispatchEvent(t){const i=this._listeners;if(i===void 0)return;const o=i[t.type];if(o!==void 0){t.target=this;const l=o.slice(0);for(let u=0,d=l.length;u<d;u++)l[u].call(this,t);t.target=null}}}const In=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Hh=Math.PI/180,fm=180/Math.PI;function Hl(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0,o=Math.random()*4294967295|0;return(In[s&255]+In[s>>8&255]+In[s>>16&255]+In[s>>24&255]+"-"+In[t&255]+In[t>>8&255]+"-"+In[t>>16&15|64]+In[t>>24&255]+"-"+In[i&63|128]+In[i>>8&255]+"-"+In[i>>16&255]+In[i>>24&255]+In[o&255]+In[o>>8&255]+In[o>>16&255]+In[o>>24&255]).toLowerCase()}function Nt(s,t,i){return Math.max(t,Math.min(i,s))}function $E(s,t){return(s%t+t)%t}function Gh(s,t,i){return(1-i)*s+i*t}function Tl(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function $n(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class dt{constructor(t=0,i=0){dt.prototype.isVector2=!0,this.x=t,this.y=i}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,i){return this.x=t,this.y=i,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const i=this.x,o=this.y,l=t.elements;return this.x=l[0]*i+l[3]*o+l[6],this.y=l[1]*i+l[4]*o+l[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,i){return this.x=Nt(this.x,t.x,i.x),this.y=Nt(this.y,t.y,i.y),this}clampScalar(t,i){return this.x=Nt(this.x,t,i),this.y=Nt(this.y,t,i),this}clampLength(t,i){const o=this.length();return this.divideScalar(o||1).multiplyScalar(Nt(o,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const o=this.dot(t)/i;return Math.acos(Nt(o,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,o=this.y-t.y;return i*i+o*o}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this}lerpVectors(t,i,o){return this.x=t.x+(i.x-t.x)*o,this.y=t.y+(i.y-t.y)*o,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this}rotateAround(t,i){const o=Math.cos(i),l=Math.sin(i),u=this.x-t.x,d=this.y-t.y;return this.x=u*o-d*l+t.x,this.y=u*l+d*o+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Gl{constructor(t=0,i=0,o=0,l=1){this.isQuaternion=!0,this._x=t,this._y=i,this._z=o,this._w=l}static slerpFlat(t,i,o,l,u,d,h){let p=o[l+0],g=o[l+1],x=o[l+2],v=o[l+3];const M=u[d+0],S=u[d+1],T=u[d+2],C=u[d+3];if(h===0){t[i+0]=p,t[i+1]=g,t[i+2]=x,t[i+3]=v;return}if(h===1){t[i+0]=M,t[i+1]=S,t[i+2]=T,t[i+3]=C;return}if(v!==C||p!==M||g!==S||x!==T){let E=1-h;const y=p*M+g*S+x*T+v*C,O=y>=0?1:-1,P=1-y*y;if(P>Number.EPSILON){const F=Math.sqrt(P),H=Math.atan2(F,y*O);E=Math.sin(E*H)/F,h=Math.sin(h*H)/F}const U=h*O;if(p=p*E+M*U,g=g*E+S*U,x=x*E+T*U,v=v*E+C*U,E===1-h){const F=1/Math.sqrt(p*p+g*g+x*x+v*v);p*=F,g*=F,x*=F,v*=F}}t[i]=p,t[i+1]=g,t[i+2]=x,t[i+3]=v}static multiplyQuaternionsFlat(t,i,o,l,u,d){const h=o[l],p=o[l+1],g=o[l+2],x=o[l+3],v=u[d],M=u[d+1],S=u[d+2],T=u[d+3];return t[i]=h*T+x*v+p*S-g*M,t[i+1]=p*T+x*M+g*v-h*S,t[i+2]=g*T+x*S+h*M-p*v,t[i+3]=x*T-h*v-p*M-g*S,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,i,o,l){return this._x=t,this._y=i,this._z=o,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,i=!0){const o=t._x,l=t._y,u=t._z,d=t._order,h=Math.cos,p=Math.sin,g=h(o/2),x=h(l/2),v=h(u/2),M=p(o/2),S=p(l/2),T=p(u/2);switch(d){case"XYZ":this._x=M*x*v+g*S*T,this._y=g*S*v-M*x*T,this._z=g*x*T+M*S*v,this._w=g*x*v-M*S*T;break;case"YXZ":this._x=M*x*v+g*S*T,this._y=g*S*v-M*x*T,this._z=g*x*T-M*S*v,this._w=g*x*v+M*S*T;break;case"ZXY":this._x=M*x*v-g*S*T,this._y=g*S*v+M*x*T,this._z=g*x*T+M*S*v,this._w=g*x*v-M*S*T;break;case"ZYX":this._x=M*x*v-g*S*T,this._y=g*S*v+M*x*T,this._z=g*x*T-M*S*v,this._w=g*x*v+M*S*T;break;case"YZX":this._x=M*x*v+g*S*T,this._y=g*S*v+M*x*T,this._z=g*x*T-M*S*v,this._w=g*x*v-M*S*T;break;case"XZY":this._x=M*x*v-g*S*T,this._y=g*S*v-M*x*T,this._z=g*x*T+M*S*v,this._w=g*x*v+M*S*T;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+d)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,i){const o=i/2,l=Math.sin(o);return this._x=t.x*l,this._y=t.y*l,this._z=t.z*l,this._w=Math.cos(o),this._onChangeCallback(),this}setFromRotationMatrix(t){const i=t.elements,o=i[0],l=i[4],u=i[8],d=i[1],h=i[5],p=i[9],g=i[2],x=i[6],v=i[10],M=o+h+v;if(M>0){const S=.5/Math.sqrt(M+1);this._w=.25/S,this._x=(x-p)*S,this._y=(u-g)*S,this._z=(d-l)*S}else if(o>h&&o>v){const S=2*Math.sqrt(1+o-h-v);this._w=(x-p)/S,this._x=.25*S,this._y=(l+d)/S,this._z=(u+g)/S}else if(h>v){const S=2*Math.sqrt(1+h-o-v);this._w=(u-g)/S,this._x=(l+d)/S,this._y=.25*S,this._z=(p+x)/S}else{const S=2*Math.sqrt(1+v-o-h);this._w=(d-l)/S,this._x=(u+g)/S,this._y=(p+x)/S,this._z=.25*S}return this._onChangeCallback(),this}setFromUnitVectors(t,i){let o=t.dot(i)+1;return o<1e-8?(o=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=o):(this._x=0,this._y=-t.z,this._z=t.y,this._w=o)):(this._x=t.y*i.z-t.z*i.y,this._y=t.z*i.x-t.x*i.z,this._z=t.x*i.y-t.y*i.x,this._w=o),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Nt(this.dot(t),-1,1)))}rotateTowards(t,i){const o=this.angleTo(t);if(o===0)return this;const l=Math.min(1,i/o);return this.slerp(t,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,i){const o=t._x,l=t._y,u=t._z,d=t._w,h=i._x,p=i._y,g=i._z,x=i._w;return this._x=o*x+d*h+l*g-u*p,this._y=l*x+d*p+u*h-o*g,this._z=u*x+d*g+o*p-l*h,this._w=d*x-o*h-l*p-u*g,this._onChangeCallback(),this}slerp(t,i){if(i===0)return this;if(i===1)return this.copy(t);const o=this._x,l=this._y,u=this._z,d=this._w;let h=d*t._w+o*t._x+l*t._y+u*t._z;if(h<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,h=-h):this.copy(t),h>=1)return this._w=d,this._x=o,this._y=l,this._z=u,this;const p=1-h*h;if(p<=Number.EPSILON){const S=1-i;return this._w=S*d+i*this._w,this._x=S*o+i*this._x,this._y=S*l+i*this._y,this._z=S*u+i*this._z,this.normalize(),this}const g=Math.sqrt(p),x=Math.atan2(g,h),v=Math.sin((1-i)*x)/g,M=Math.sin(i*x)/g;return this._w=d*v+this._w*M,this._x=o*v+this._x*M,this._y=l*v+this._y*M,this._z=u*v+this._z*M,this._onChangeCallback(),this}slerpQuaternions(t,i,o){return this.copy(t).slerp(i,o)}random(){const t=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),o=Math.random(),l=Math.sqrt(1-o),u=Math.sqrt(o);return this.set(l*Math.sin(t),l*Math.cos(t),u*Math.sin(i),u*Math.cos(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,i=0){return this._x=t[i],this._y=t[i+1],this._z=t[i+2],this._w=t[i+3],this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._w,t}fromBufferAttribute(t,i){return this._x=t.getX(i),this._y=t.getY(i),this._z=t.getZ(i),this._w=t.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class te{constructor(t=0,i=0,o=0){te.prototype.isVector3=!0,this.x=t,this.y=i,this.z=o}set(t,i,o){return o===void 0&&(o=this.z),this.x=t,this.y=i,this.z=o,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}applyEuler(t){return this.applyQuaternion(fx.setFromEuler(t))}applyAxisAngle(t,i){return this.applyQuaternion(fx.setFromAxisAngle(t,i))}applyMatrix3(t){const i=this.x,o=this.y,l=this.z,u=t.elements;return this.x=u[0]*i+u[3]*o+u[6]*l,this.y=u[1]*i+u[4]*o+u[7]*l,this.z=u[2]*i+u[5]*o+u[8]*l,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const i=this.x,o=this.y,l=this.z,u=t.elements,d=1/(u[3]*i+u[7]*o+u[11]*l+u[15]);return this.x=(u[0]*i+u[4]*o+u[8]*l+u[12])*d,this.y=(u[1]*i+u[5]*o+u[9]*l+u[13])*d,this.z=(u[2]*i+u[6]*o+u[10]*l+u[14])*d,this}applyQuaternion(t){const i=this.x,o=this.y,l=this.z,u=t.x,d=t.y,h=t.z,p=t.w,g=2*(d*l-h*o),x=2*(h*i-u*l),v=2*(u*o-d*i);return this.x=i+p*g+d*v-h*x,this.y=o+p*x+h*g-u*v,this.z=l+p*v+u*x-d*g,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const i=this.x,o=this.y,l=this.z,u=t.elements;return this.x=u[0]*i+u[4]*o+u[8]*l,this.y=u[1]*i+u[5]*o+u[9]*l,this.z=u[2]*i+u[6]*o+u[10]*l,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,i){return this.x=Nt(this.x,t.x,i.x),this.y=Nt(this.y,t.y,i.y),this.z=Nt(this.z,t.z,i.z),this}clampScalar(t,i){return this.x=Nt(this.x,t,i),this.y=Nt(this.y,t,i),this.z=Nt(this.z,t,i),this}clampLength(t,i){const o=this.length();return this.divideScalar(o||1).multiplyScalar(Nt(o,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this}lerpVectors(t,i,o){return this.x=t.x+(i.x-t.x)*o,this.y=t.y+(i.y-t.y)*o,this.z=t.z+(i.z-t.z)*o,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,i){const o=t.x,l=t.y,u=t.z,d=i.x,h=i.y,p=i.z;return this.x=l*p-u*h,this.y=u*d-o*p,this.z=o*h-l*d,this}projectOnVector(t){const i=t.lengthSq();if(i===0)return this.set(0,0,0);const o=t.dot(this)/i;return this.copy(t).multiplyScalar(o)}projectOnPlane(t){return Vh.copy(this).projectOnVector(t),this.sub(Vh)}reflect(t){return this.sub(Vh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const o=this.dot(t)/i;return Math.acos(Nt(o,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,o=this.y-t.y,l=this.z-t.z;return i*i+o*o+l*l}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,i,o){const l=Math.sin(i)*t;return this.x=l*Math.sin(o),this.y=Math.cos(i)*t,this.z=l*Math.cos(o),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,i,o){return this.x=t*Math.sin(i),this.y=o,this.z=t*Math.cos(i),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(t){const i=this.setFromMatrixColumn(t,0).length(),o=this.setFromMatrixColumn(t,1).length(),l=this.setFromMatrixColumn(t,2).length();return this.x=i,this.y=o,this.z=l,this}setFromMatrixColumn(t,i){return this.fromArray(t.elements,i*4)}setFromMatrix3Column(t,i){return this.fromArray(t.elements,i*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,i=Math.random()*2-1,o=Math.sqrt(1-i*i);return this.x=o*Math.cos(t),this.y=i,this.z=o*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Vh=new te,fx=new Gl;class vt{constructor(t,i,o,l,u,d,h,p,g){vt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,i,o,l,u,d,h,p,g)}set(t,i,o,l,u,d,h,p,g){const x=this.elements;return x[0]=t,x[1]=l,x[2]=h,x[3]=i,x[4]=u,x[5]=p,x[6]=o,x[7]=d,x[8]=g,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const i=this.elements,o=t.elements;return i[0]=o[0],i[1]=o[1],i[2]=o[2],i[3]=o[3],i[4]=o[4],i[5]=o[5],i[6]=o[6],i[7]=o[7],i[8]=o[8],this}extractBasis(t,i,o){return t.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),o.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const i=t.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const o=t.elements,l=i.elements,u=this.elements,d=o[0],h=o[3],p=o[6],g=o[1],x=o[4],v=o[7],M=o[2],S=o[5],T=o[8],C=l[0],E=l[3],y=l[6],O=l[1],P=l[4],U=l[7],F=l[2],H=l[5],I=l[8];return u[0]=d*C+h*O+p*F,u[3]=d*E+h*P+p*H,u[6]=d*y+h*U+p*I,u[1]=g*C+x*O+v*F,u[4]=g*E+x*P+v*H,u[7]=g*y+x*U+v*I,u[2]=M*C+S*O+T*F,u[5]=M*E+S*P+T*H,u[8]=M*y+S*U+T*I,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[3]*=t,i[6]*=t,i[1]*=t,i[4]*=t,i[7]*=t,i[2]*=t,i[5]*=t,i[8]*=t,this}determinant(){const t=this.elements,i=t[0],o=t[1],l=t[2],u=t[3],d=t[4],h=t[5],p=t[6],g=t[7],x=t[8];return i*d*x-i*h*g-o*u*x+o*h*p+l*u*g-l*d*p}invert(){const t=this.elements,i=t[0],o=t[1],l=t[2],u=t[3],d=t[4],h=t[5],p=t[6],g=t[7],x=t[8],v=x*d-h*g,M=h*p-x*u,S=g*u-d*p,T=i*v+o*M+l*S;if(T===0)return this.set(0,0,0,0,0,0,0,0,0);const C=1/T;return t[0]=v*C,t[1]=(l*g-x*o)*C,t[2]=(h*o-l*d)*C,t[3]=M*C,t[4]=(x*i-l*p)*C,t[5]=(l*u-h*i)*C,t[6]=S*C,t[7]=(o*p-g*i)*C,t[8]=(d*i-o*u)*C,this}transpose(){let t;const i=this.elements;return t=i[1],i[1]=i[3],i[3]=t,t=i[2],i[2]=i[6],i[6]=t,t=i[5],i[5]=i[7],i[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const i=this.elements;return t[0]=i[0],t[1]=i[3],t[2]=i[6],t[3]=i[1],t[4]=i[4],t[5]=i[7],t[6]=i[2],t[7]=i[5],t[8]=i[8],this}setUvTransform(t,i,o,l,u,d,h){const p=Math.cos(u),g=Math.sin(u);return this.set(o*p,o*g,-o*(p*d+g*h)+d+t,-l*g,l*p,-l*(-g*d+p*h)+h+i,0,0,1),this}scale(t,i){return this.premultiply(jh.makeScale(t,i)),this}rotate(t){return this.premultiply(jh.makeRotation(-t)),this}translate(t,i){return this.premultiply(jh.makeTranslation(t,i)),this}makeTranslation(t,i){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,i,0,0,1),this}makeRotation(t){const i=Math.cos(t),o=Math.sin(t);return this.set(i,-o,0,o,i,0,0,0,1),this}makeScale(t,i){return this.set(t,0,0,0,i,0,0,0,1),this}equals(t){const i=this.elements,o=t.elements;for(let l=0;l<9;l++)if(i[l]!==o[l])return!1;return!0}fromArray(t,i=0){for(let o=0;o<9;o++)this.elements[o]=t[o+i];return this}toArray(t=[],i=0){const o=this.elements;return t[i]=o[0],t[i+1]=o[1],t[i+2]=o[2],t[i+3]=o[3],t[i+4]=o[4],t[i+5]=o[5],t[i+6]=o[6],t[i+7]=o[7],t[i+8]=o[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const jh=new vt;function Ly(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Il(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function eT(){const s=Il("canvas");return s.style.display="block",s}const dx={};function Bl(s){s in dx||(dx[s]=!0,console.warn(s))}function tT(s,t,i){return new Promise(function(o,l){function u(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:l();break;case s.TIMEOUT_EXPIRED:setTimeout(u,i);break;default:o()}}setTimeout(u,i)})}const hx=new vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),px=new vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function nT(){const s={enabled:!0,workingColorSpace:To,spaces:{},convert:function(l,u,d){return this.enabled===!1||u===d||!u||!d||(this.spaces[u].transfer===Xt&&(l.r=Pa(l.r),l.g=Pa(l.g),l.b=Pa(l.b)),this.spaces[u].primaries!==this.spaces[d].primaries&&(l.applyMatrix3(this.spaces[u].toXYZ),l.applyMatrix3(this.spaces[d].fromXYZ)),this.spaces[d].transfer===Xt&&(l.r=vo(l.r),l.g=vo(l.g),l.b=vo(l.b))),l},workingToColorSpace:function(l,u){return this.convert(l,this.workingColorSpace,u)},colorSpaceToWorking:function(l,u){return this.convert(l,u,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===xs?Zu:this.spaces[l].transfer},getToneMappingMode:function(l){return this.spaces[l].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(l,u=this.workingColorSpace){return l.fromArray(this.spaces[u].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,u,d){return l.copy(this.spaces[u].toXYZ).multiply(this.spaces[d].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(l,u){return Bl("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(l,u)},toWorkingColorSpace:function(l,u){return Bl("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(l,u)}},t=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],o=[.3127,.329];return s.define({[To]:{primaries:t,whitePoint:o,transfer:Zu,toXYZ:hx,fromXYZ:px,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:ei},outputColorSpaceConfig:{drawingBufferColorSpace:ei}},[ei]:{primaries:t,whitePoint:o,transfer:Xt,toXYZ:hx,fromXYZ:px,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:ei}}}),s}const Lt=nT();function Pa(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function vo(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let $r;class iT{static getDataURL(t,i="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let o;if(t instanceof HTMLCanvasElement)o=t;else{$r===void 0&&($r=Il("canvas")),$r.width=t.width,$r.height=t.height;const l=$r.getContext("2d");t instanceof ImageData?l.putImageData(t,0,0):l.drawImage(t,0,0,t.width,t.height),o=$r}return o.toDataURL(i)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const i=Il("canvas");i.width=t.width,i.height=t.height;const o=i.getContext("2d");o.drawImage(t,0,0,t.width,t.height);const l=o.getImageData(0,0,t.width,t.height),u=l.data;for(let d=0;d<u.length;d++)u[d]=Pa(u[d]/255)*255;return o.putImageData(l,0,0),i}else if(t.data){const i=t.data.slice(0);for(let o=0;o<i.length;o++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[o]=Math.floor(Pa(i[o]/255)*255):i[o]=Pa(i[o]);return{data:i,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let aT=0;class Um{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:aT++}),this.uuid=Hl(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const i=this.data;return typeof HTMLVideoElement<"u"&&i instanceof HTMLVideoElement?t.set(i.videoWidth,i.videoHeight,0):i instanceof VideoFrame?t.set(i.displayHeight,i.displayWidth,0):i!==null?t.set(i.width,i.height,i.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const o={uuid:this.uuid,url:""},l=this.data;if(l!==null){let u;if(Array.isArray(l)){u=[];for(let d=0,h=l.length;d<h;d++)l[d].isDataTexture?u.push(kh(l[d].image)):u.push(kh(l[d]))}else u=kh(l);o.url=u}return i||(t.images[this.uuid]=o),o}}function kh(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?iT.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let sT=0;const Xh=new te;class Yn extends Co{constructor(t=Yn.DEFAULT_IMAGE,i=Yn.DEFAULT_MAPPING,o=rr,l=rr,u=ji,d=or,h=ki,p=ca,g=Yn.DEFAULT_ANISOTROPY,x=xs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:sT++}),this.uuid=Hl(),this.name="",this.source=new Um(t),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=o,this.wrapT=l,this.magFilter=u,this.minFilter=d,this.anisotropy=g,this.format=h,this.internalFormat=null,this.type=p,this.offset=new dt(0,0),this.repeat=new dt(1,1),this.center=new dt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=x,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Xh).x}get height(){return this.source.getSize(Xh).y}get depth(){return this.source.getSize(Xh).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const i in t){const o=t[i];if(o===void 0){console.warn(`THREE.Texture.setValues(): parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Texture.setValues(): property '${i}' does not exist.`);continue}l&&o&&l.isVector2&&o.isVector2||l&&o&&l.isVector3&&o.isVector3||l&&o&&l.isMatrix3&&o.isMatrix3?l.copy(o):this[i]=o}}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const o={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(o.userData=this.userData),i||(t.textures[this.uuid]=o),o}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==My)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case zp:t.x=t.x-Math.floor(t.x);break;case rr:t.x=t.x<0?0:1;break;case Pp:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case zp:t.y=t.y-Math.floor(t.y);break;case rr:t.y=t.y<0?0:1;break;case Pp:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Yn.DEFAULT_IMAGE=null;Yn.DEFAULT_MAPPING=My;Yn.DEFAULT_ANISOTROPY=1;class Wt{constructor(t=0,i=0,o=0,l=1){Wt.prototype.isVector4=!0,this.x=t,this.y=i,this.z=o,this.w=l}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,i,o,l){return this.x=t,this.y=i,this.z=o,this.w=l,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this.w=t.w+i.w,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this.w+=t.w*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this.w=t.w-i.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const i=this.x,o=this.y,l=this.z,u=this.w,d=t.elements;return this.x=d[0]*i+d[4]*o+d[8]*l+d[12]*u,this.y=d[1]*i+d[5]*o+d[9]*l+d[13]*u,this.z=d[2]*i+d[6]*o+d[10]*l+d[14]*u,this.w=d[3]*i+d[7]*o+d[11]*l+d[15]*u,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const i=Math.sqrt(1-t.w*t.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/i,this.y=t.y/i,this.z=t.z/i),this}setAxisAngleFromRotationMatrix(t){let i,o,l,u;const p=t.elements,g=p[0],x=p[4],v=p[8],M=p[1],S=p[5],T=p[9],C=p[2],E=p[6],y=p[10];if(Math.abs(x-M)<.01&&Math.abs(v-C)<.01&&Math.abs(T-E)<.01){if(Math.abs(x+M)<.1&&Math.abs(v+C)<.1&&Math.abs(T+E)<.1&&Math.abs(g+S+y-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const P=(g+1)/2,U=(S+1)/2,F=(y+1)/2,H=(x+M)/4,I=(v+C)/4,k=(T+E)/4;return P>U&&P>F?P<.01?(o=0,l=.707106781,u=.707106781):(o=Math.sqrt(P),l=H/o,u=I/o):U>F?U<.01?(o=.707106781,l=0,u=.707106781):(l=Math.sqrt(U),o=H/l,u=k/l):F<.01?(o=.707106781,l=.707106781,u=0):(u=Math.sqrt(F),o=I/u,l=k/u),this.set(o,l,u,i),this}let O=Math.sqrt((E-T)*(E-T)+(v-C)*(v-C)+(M-x)*(M-x));return Math.abs(O)<.001&&(O=1),this.x=(E-T)/O,this.y=(v-C)/O,this.z=(M-x)/O,this.w=Math.acos((g+S+y-1)/2),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,i){return this.x=Nt(this.x,t.x,i.x),this.y=Nt(this.y,t.y,i.y),this.z=Nt(this.z,t.z,i.z),this.w=Nt(this.w,t.w,i.w),this}clampScalar(t,i){return this.x=Nt(this.x,t,i),this.y=Nt(this.y,t,i),this.z=Nt(this.z,t,i),this.w=Nt(this.w,t,i),this}clampLength(t,i){const o=this.length();return this.divideScalar(o||1).multiplyScalar(Nt(o,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this.w+=(t.w-this.w)*i,this}lerpVectors(t,i,o){return this.x=t.x+(i.x-t.x)*o,this.y=t.y+(i.y-t.y)*o,this.z=t.z+(i.z-t.z)*o,this.w=t.w+(i.w-t.w)*o,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this.w=t.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class rT extends Co{constructor(t=1,i=1,o={}){super(),o=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ji,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},o),this.isRenderTarget=!0,this.width=t,this.height=i,this.depth=o.depth,this.scissor=new Wt(0,0,t,i),this.scissorTest=!1,this.viewport=new Wt(0,0,t,i);const l={width:t,height:i,depth:o.depth},u=new Yn(l);this.textures=[];const d=o.count;for(let h=0;h<d;h++)this.textures[h]=u.clone(),this.textures[h].isRenderTargetTexture=!0,this.textures[h].renderTarget=this;this._setTextureOptions(o),this.depthBuffer=o.depthBuffer,this.stencilBuffer=o.stencilBuffer,this.resolveDepthBuffer=o.resolveDepthBuffer,this.resolveStencilBuffer=o.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=o.depthTexture,this.samples=o.samples,this.multiview=o.multiview}_setTextureOptions(t={}){const i={minFilter:ji,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(i.mapping=t.mapping),t.wrapS!==void 0&&(i.wrapS=t.wrapS),t.wrapT!==void 0&&(i.wrapT=t.wrapT),t.wrapR!==void 0&&(i.wrapR=t.wrapR),t.magFilter!==void 0&&(i.magFilter=t.magFilter),t.minFilter!==void 0&&(i.minFilter=t.minFilter),t.format!==void 0&&(i.format=t.format),t.type!==void 0&&(i.type=t.type),t.anisotropy!==void 0&&(i.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(i.colorSpace=t.colorSpace),t.flipY!==void 0&&(i.flipY=t.flipY),t.generateMipmaps!==void 0&&(i.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(i.internalFormat=t.internalFormat);for(let o=0;o<this.textures.length;o++)this.textures[o].setValues(i)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,i,o=1){if(this.width!==t||this.height!==i||this.depth!==o){this.width=t,this.height=i,this.depth=o;for(let l=0,u=this.textures.length;l<u;l++)this.textures[l].image.width=t,this.textures[l].image.height=i,this.textures[l].image.depth=o,this.textures[l].isArrayTexture=this.textures[l].image.depth>1;this.dispose()}this.viewport.set(0,0,t,i),this.scissor.set(0,0,t,i)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,o=t.textures.length;i<o;i++){this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},t.textures[i].image);this.textures[i].source=new Um(l)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Xi extends rT{constructor(t=1,i=1,o={}){super(t,i,o),this.isWebGLRenderTarget=!0}}class Oy extends Yn{constructor(t=null,i=1,o=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:i,height:o,depth:l},this.magFilter=Di,this.minFilter=Di,this.wrapR=rr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class oT extends Yn{constructor(t=null,i=1,o=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:i,height:o,depth:l},this.magFilter=Di,this.minFilter=Di,this.wrapR=rr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Vl{constructor(t=new te(1/0,1/0,1/0),i=new te(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=i}set(t,i){return this.min.copy(t),this.max.copy(i),this}setFromArray(t){this.makeEmpty();for(let i=0,o=t.length;i<o;i+=3)this.expandByPoint(Fi.fromArray(t,i));return this}setFromBufferAttribute(t){this.makeEmpty();for(let i=0,o=t.count;i<o;i++)this.expandByPoint(Fi.fromBufferAttribute(t,i));return this}setFromPoints(t){this.makeEmpty();for(let i=0,o=t.length;i<o;i++)this.expandByPoint(t[i]);return this}setFromCenterAndSize(t,i){const o=Fi.copy(i).multiplyScalar(.5);return this.min.copy(t).sub(o),this.max.copy(t).add(o),this}setFromObject(t,i=!1){return this.makeEmpty(),this.expandByObject(t,i)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,i=!1){t.updateWorldMatrix(!1,!1);const o=t.geometry;if(o!==void 0){const u=o.getAttribute("position");if(i===!0&&u!==void 0&&t.isInstancedMesh!==!0)for(let d=0,h=u.count;d<h;d++)t.isMesh===!0?t.getVertexPosition(d,Fi):Fi.fromBufferAttribute(u,d),Fi.applyMatrix4(t.matrixWorld),this.expandByPoint(Fi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),pu.copy(t.boundingBox)):(o.boundingBox===null&&o.computeBoundingBox(),pu.copy(o.boundingBox)),pu.applyMatrix4(t.matrixWorld),this.union(pu)}const l=t.children;for(let u=0,d=l.length;u<d;u++)this.expandByObject(l[u],i);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,i){return i.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Fi),Fi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let i,o;return t.normal.x>0?(i=t.normal.x*this.min.x,o=t.normal.x*this.max.x):(i=t.normal.x*this.max.x,o=t.normal.x*this.min.x),t.normal.y>0?(i+=t.normal.y*this.min.y,o+=t.normal.y*this.max.y):(i+=t.normal.y*this.max.y,o+=t.normal.y*this.min.y),t.normal.z>0?(i+=t.normal.z*this.min.z,o+=t.normal.z*this.max.z):(i+=t.normal.z*this.max.z,o+=t.normal.z*this.min.z),i<=-t.constant&&o>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(bl),mu.subVectors(this.max,bl),eo.subVectors(t.a,bl),to.subVectors(t.b,bl),no.subVectors(t.c,bl),ds.subVectors(to,eo),hs.subVectors(no,to),Zs.subVectors(eo,no);let i=[0,-ds.z,ds.y,0,-hs.z,hs.y,0,-Zs.z,Zs.y,ds.z,0,-ds.x,hs.z,0,-hs.x,Zs.z,0,-Zs.x,-ds.y,ds.x,0,-hs.y,hs.x,0,-Zs.y,Zs.x,0];return!qh(i,eo,to,no,mu)||(i=[1,0,0,0,1,0,0,0,1],!qh(i,eo,to,no,mu))?!1:(gu.crossVectors(ds,hs),i=[gu.x,gu.y,gu.z],qh(i,eo,to,no,mu))}clampPoint(t,i){return i.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Fi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Fi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ca[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ca[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ca[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ca[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ca[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ca[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ca[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ca[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ca),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Ca=[new te,new te,new te,new te,new te,new te,new te,new te],Fi=new te,pu=new Vl,eo=new te,to=new te,no=new te,ds=new te,hs=new te,Zs=new te,bl=new te,mu=new te,gu=new te,Ks=new te;function qh(s,t,i,o,l){for(let u=0,d=s.length-3;u<=d;u+=3){Ks.fromArray(s,u);const h=l.x*Math.abs(Ks.x)+l.y*Math.abs(Ks.y)+l.z*Math.abs(Ks.z),p=t.dot(Ks),g=i.dot(Ks),x=o.dot(Ks);if(Math.max(-Math.max(p,g,x),Math.min(p,g,x))>h)return!1}return!0}const lT=new Vl,Al=new te,Yh=new te;class tf{constructor(t=new te,i=-1){this.isSphere=!0,this.center=t,this.radius=i}set(t,i){return this.center.copy(t),this.radius=i,this}setFromPoints(t,i){const o=this.center;i!==void 0?o.copy(i):lT.setFromPoints(t).getCenter(o);let l=0;for(let u=0,d=t.length;u<d;u++)l=Math.max(l,o.distanceToSquared(t[u]));return this.radius=Math.sqrt(l),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const i=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=i*i}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,i){const o=this.center.distanceToSquared(t);return i.copy(t),o>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Al.subVectors(t,this.center);const i=Al.lengthSq();if(i>this.radius*this.radius){const o=Math.sqrt(i),l=(o-this.radius)*.5;this.center.addScaledVector(Al,l/o),this.radius+=l}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Yh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Al.copy(t.center).add(Yh)),this.expandByPoint(Al.copy(t.center).sub(Yh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Ra=new te,Wh=new te,vu=new te,ps=new te,Zh=new te,_u=new te,Kh=new te;class zy{constructor(t=new te,i=new te(0,0,-1)){this.origin=t,this.direction=i}set(t,i){return this.origin.copy(t),this.direction.copy(i),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,i){return i.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ra)),this}closestPointToPoint(t,i){i.subVectors(t,this.origin);const o=i.dot(this.direction);return o<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,o)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const i=Ra.subVectors(t,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(t):(Ra.copy(this.origin).addScaledVector(this.direction,i),Ra.distanceToSquared(t))}distanceSqToSegment(t,i,o,l){Wh.copy(t).add(i).multiplyScalar(.5),vu.copy(i).sub(t).normalize(),ps.copy(this.origin).sub(Wh);const u=t.distanceTo(i)*.5,d=-this.direction.dot(vu),h=ps.dot(this.direction),p=-ps.dot(vu),g=ps.lengthSq(),x=Math.abs(1-d*d);let v,M,S,T;if(x>0)if(v=d*p-h,M=d*h-p,T=u*x,v>=0)if(M>=-T)if(M<=T){const C=1/x;v*=C,M*=C,S=v*(v+d*M+2*h)+M*(d*v+M+2*p)+g}else M=u,v=Math.max(0,-(d*M+h)),S=-v*v+M*(M+2*p)+g;else M=-u,v=Math.max(0,-(d*M+h)),S=-v*v+M*(M+2*p)+g;else M<=-T?(v=Math.max(0,-(-d*u+h)),M=v>0?-u:Math.min(Math.max(-u,-p),u),S=-v*v+M*(M+2*p)+g):M<=T?(v=0,M=Math.min(Math.max(-u,-p),u),S=M*(M+2*p)+g):(v=Math.max(0,-(d*u+h)),M=v>0?u:Math.min(Math.max(-u,-p),u),S=-v*v+M*(M+2*p)+g);else M=d>0?-u:u,v=Math.max(0,-(d*M+h)),S=-v*v+M*(M+2*p)+g;return o&&o.copy(this.origin).addScaledVector(this.direction,v),l&&l.copy(Wh).addScaledVector(vu,M),S}intersectSphere(t,i){Ra.subVectors(t.center,this.origin);const o=Ra.dot(this.direction),l=Ra.dot(Ra)-o*o,u=t.radius*t.radius;if(l>u)return null;const d=Math.sqrt(u-l),h=o-d,p=o+d;return p<0?null:h<0?this.at(p,i):this.at(h,i)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const i=t.normal.dot(this.direction);if(i===0)return t.distanceToPoint(this.origin)===0?0:null;const o=-(this.origin.dot(t.normal)+t.constant)/i;return o>=0?o:null}intersectPlane(t,i){const o=this.distanceToPlane(t);return o===null?null:this.at(o,i)}intersectsPlane(t){const i=t.distanceToPoint(this.origin);return i===0||t.normal.dot(this.direction)*i<0}intersectBox(t,i){let o,l,u,d,h,p;const g=1/this.direction.x,x=1/this.direction.y,v=1/this.direction.z,M=this.origin;return g>=0?(o=(t.min.x-M.x)*g,l=(t.max.x-M.x)*g):(o=(t.max.x-M.x)*g,l=(t.min.x-M.x)*g),x>=0?(u=(t.min.y-M.y)*x,d=(t.max.y-M.y)*x):(u=(t.max.y-M.y)*x,d=(t.min.y-M.y)*x),o>d||u>l||((u>o||isNaN(o))&&(o=u),(d<l||isNaN(l))&&(l=d),v>=0?(h=(t.min.z-M.z)*v,p=(t.max.z-M.z)*v):(h=(t.max.z-M.z)*v,p=(t.min.z-M.z)*v),o>p||h>l)||((h>o||o!==o)&&(o=h),(p<l||l!==l)&&(l=p),l<0)?null:this.at(o>=0?o:l,i)}intersectsBox(t){return this.intersectBox(t,Ra)!==null}intersectTriangle(t,i,o,l,u){Zh.subVectors(i,t),_u.subVectors(o,t),Kh.crossVectors(Zh,_u);let d=this.direction.dot(Kh),h;if(d>0){if(l)return null;h=1}else if(d<0)h=-1,d=-d;else return null;ps.subVectors(this.origin,t);const p=h*this.direction.dot(_u.crossVectors(ps,_u));if(p<0)return null;const g=h*this.direction.dot(Zh.cross(ps));if(g<0||p+g>d)return null;const x=-h*ps.dot(Kh);return x<0?null:this.at(x/d,u)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class an{constructor(t,i,o,l,u,d,h,p,g,x,v,M,S,T,C,E){an.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,i,o,l,u,d,h,p,g,x,v,M,S,T,C,E)}set(t,i,o,l,u,d,h,p,g,x,v,M,S,T,C,E){const y=this.elements;return y[0]=t,y[4]=i,y[8]=o,y[12]=l,y[1]=u,y[5]=d,y[9]=h,y[13]=p,y[2]=g,y[6]=x,y[10]=v,y[14]=M,y[3]=S,y[7]=T,y[11]=C,y[15]=E,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new an().fromArray(this.elements)}copy(t){const i=this.elements,o=t.elements;return i[0]=o[0],i[1]=o[1],i[2]=o[2],i[3]=o[3],i[4]=o[4],i[5]=o[5],i[6]=o[6],i[7]=o[7],i[8]=o[8],i[9]=o[9],i[10]=o[10],i[11]=o[11],i[12]=o[12],i[13]=o[13],i[14]=o[14],i[15]=o[15],this}copyPosition(t){const i=this.elements,o=t.elements;return i[12]=o[12],i[13]=o[13],i[14]=o[14],this}setFromMatrix3(t){const i=t.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(t,i,o){return t.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),o.setFromMatrixColumn(this,2),this}makeBasis(t,i,o){return this.set(t.x,i.x,o.x,0,t.y,i.y,o.y,0,t.z,i.z,o.z,0,0,0,0,1),this}extractRotation(t){const i=this.elements,o=t.elements,l=1/io.setFromMatrixColumn(t,0).length(),u=1/io.setFromMatrixColumn(t,1).length(),d=1/io.setFromMatrixColumn(t,2).length();return i[0]=o[0]*l,i[1]=o[1]*l,i[2]=o[2]*l,i[3]=0,i[4]=o[4]*u,i[5]=o[5]*u,i[6]=o[6]*u,i[7]=0,i[8]=o[8]*d,i[9]=o[9]*d,i[10]=o[10]*d,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(t){const i=this.elements,o=t.x,l=t.y,u=t.z,d=Math.cos(o),h=Math.sin(o),p=Math.cos(l),g=Math.sin(l),x=Math.cos(u),v=Math.sin(u);if(t.order==="XYZ"){const M=d*x,S=d*v,T=h*x,C=h*v;i[0]=p*x,i[4]=-p*v,i[8]=g,i[1]=S+T*g,i[5]=M-C*g,i[9]=-h*p,i[2]=C-M*g,i[6]=T+S*g,i[10]=d*p}else if(t.order==="YXZ"){const M=p*x,S=p*v,T=g*x,C=g*v;i[0]=M+C*h,i[4]=T*h-S,i[8]=d*g,i[1]=d*v,i[5]=d*x,i[9]=-h,i[2]=S*h-T,i[6]=C+M*h,i[10]=d*p}else if(t.order==="ZXY"){const M=p*x,S=p*v,T=g*x,C=g*v;i[0]=M-C*h,i[4]=-d*v,i[8]=T+S*h,i[1]=S+T*h,i[5]=d*x,i[9]=C-M*h,i[2]=-d*g,i[6]=h,i[10]=d*p}else if(t.order==="ZYX"){const M=d*x,S=d*v,T=h*x,C=h*v;i[0]=p*x,i[4]=T*g-S,i[8]=M*g+C,i[1]=p*v,i[5]=C*g+M,i[9]=S*g-T,i[2]=-g,i[6]=h*p,i[10]=d*p}else if(t.order==="YZX"){const M=d*p,S=d*g,T=h*p,C=h*g;i[0]=p*x,i[4]=C-M*v,i[8]=T*v+S,i[1]=v,i[5]=d*x,i[9]=-h*x,i[2]=-g*x,i[6]=S*v+T,i[10]=M-C*v}else if(t.order==="XZY"){const M=d*p,S=d*g,T=h*p,C=h*g;i[0]=p*x,i[4]=-v,i[8]=g*x,i[1]=M*v+C,i[5]=d*x,i[9]=S*v-T,i[2]=T*v-S,i[6]=h*x,i[10]=C*v+M}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(t){return this.compose(cT,t,uT)}lookAt(t,i,o){const l=this.elements;return fi.subVectors(t,i),fi.lengthSq()===0&&(fi.z=1),fi.normalize(),ms.crossVectors(o,fi),ms.lengthSq()===0&&(Math.abs(o.z)===1?fi.x+=1e-4:fi.z+=1e-4,fi.normalize(),ms.crossVectors(o,fi)),ms.normalize(),xu.crossVectors(fi,ms),l[0]=ms.x,l[4]=xu.x,l[8]=fi.x,l[1]=ms.y,l[5]=xu.y,l[9]=fi.y,l[2]=ms.z,l[6]=xu.z,l[10]=fi.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const o=t.elements,l=i.elements,u=this.elements,d=o[0],h=o[4],p=o[8],g=o[12],x=o[1],v=o[5],M=o[9],S=o[13],T=o[2],C=o[6],E=o[10],y=o[14],O=o[3],P=o[7],U=o[11],F=o[15],H=l[0],I=l[4],k=l[8],N=l[12],w=l[1],G=l[5],ae=l[9],de=l[13],_e=l[2],fe=l[6],X=l[10],se=l[14],Y=l[3],xe=l[7],Me=l[11],ze=l[15];return u[0]=d*H+h*w+p*_e+g*Y,u[4]=d*I+h*G+p*fe+g*xe,u[8]=d*k+h*ae+p*X+g*Me,u[12]=d*N+h*de+p*se+g*ze,u[1]=x*H+v*w+M*_e+S*Y,u[5]=x*I+v*G+M*fe+S*xe,u[9]=x*k+v*ae+M*X+S*Me,u[13]=x*N+v*de+M*se+S*ze,u[2]=T*H+C*w+E*_e+y*Y,u[6]=T*I+C*G+E*fe+y*xe,u[10]=T*k+C*ae+E*X+y*Me,u[14]=T*N+C*de+E*se+y*ze,u[3]=O*H+P*w+U*_e+F*Y,u[7]=O*I+P*G+U*fe+F*xe,u[11]=O*k+P*ae+U*X+F*Me,u[15]=O*N+P*de+U*se+F*ze,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[4]*=t,i[8]*=t,i[12]*=t,i[1]*=t,i[5]*=t,i[9]*=t,i[13]*=t,i[2]*=t,i[6]*=t,i[10]*=t,i[14]*=t,i[3]*=t,i[7]*=t,i[11]*=t,i[15]*=t,this}determinant(){const t=this.elements,i=t[0],o=t[4],l=t[8],u=t[12],d=t[1],h=t[5],p=t[9],g=t[13],x=t[2],v=t[6],M=t[10],S=t[14],T=t[3],C=t[7],E=t[11],y=t[15];return T*(+u*p*v-l*g*v-u*h*M+o*g*M+l*h*S-o*p*S)+C*(+i*p*S-i*g*M+u*d*M-l*d*S+l*g*x-u*p*x)+E*(+i*g*v-i*h*S-u*d*v+o*d*S+u*h*x-o*g*x)+y*(-l*h*x-i*p*v+i*h*M+l*d*v-o*d*M+o*p*x)}transpose(){const t=this.elements;let i;return i=t[1],t[1]=t[4],t[4]=i,i=t[2],t[2]=t[8],t[8]=i,i=t[6],t[6]=t[9],t[9]=i,i=t[3],t[3]=t[12],t[12]=i,i=t[7],t[7]=t[13],t[13]=i,i=t[11],t[11]=t[14],t[14]=i,this}setPosition(t,i,o){const l=this.elements;return t.isVector3?(l[12]=t.x,l[13]=t.y,l[14]=t.z):(l[12]=t,l[13]=i,l[14]=o),this}invert(){const t=this.elements,i=t[0],o=t[1],l=t[2],u=t[3],d=t[4],h=t[5],p=t[6],g=t[7],x=t[8],v=t[9],M=t[10],S=t[11],T=t[12],C=t[13],E=t[14],y=t[15],O=v*E*g-C*M*g+C*p*S-h*E*S-v*p*y+h*M*y,P=T*M*g-x*E*g-T*p*S+d*E*S+x*p*y-d*M*y,U=x*C*g-T*v*g+T*h*S-d*C*S-x*h*y+d*v*y,F=T*v*p-x*C*p-T*h*M+d*C*M+x*h*E-d*v*E,H=i*O+o*P+l*U+u*F;if(H===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/H;return t[0]=O*I,t[1]=(C*M*u-v*E*u-C*l*S+o*E*S+v*l*y-o*M*y)*I,t[2]=(h*E*u-C*p*u+C*l*g-o*E*g-h*l*y+o*p*y)*I,t[3]=(v*p*u-h*M*u-v*l*g+o*M*g+h*l*S-o*p*S)*I,t[4]=P*I,t[5]=(x*E*u-T*M*u+T*l*S-i*E*S-x*l*y+i*M*y)*I,t[6]=(T*p*u-d*E*u-T*l*g+i*E*g+d*l*y-i*p*y)*I,t[7]=(d*M*u-x*p*u+x*l*g-i*M*g-d*l*S+i*p*S)*I,t[8]=U*I,t[9]=(T*v*u-x*C*u-T*o*S+i*C*S+x*o*y-i*v*y)*I,t[10]=(d*C*u-T*h*u+T*o*g-i*C*g-d*o*y+i*h*y)*I,t[11]=(x*h*u-d*v*u-x*o*g+i*v*g+d*o*S-i*h*S)*I,t[12]=F*I,t[13]=(x*C*l-T*v*l+T*o*M-i*C*M-x*o*E+i*v*E)*I,t[14]=(T*h*l-d*C*l-T*o*p+i*C*p+d*o*E-i*h*E)*I,t[15]=(d*v*l-x*h*l+x*o*p-i*v*p-d*o*M+i*h*M)*I,this}scale(t){const i=this.elements,o=t.x,l=t.y,u=t.z;return i[0]*=o,i[4]*=l,i[8]*=u,i[1]*=o,i[5]*=l,i[9]*=u,i[2]*=o,i[6]*=l,i[10]*=u,i[3]*=o,i[7]*=l,i[11]*=u,this}getMaxScaleOnAxis(){const t=this.elements,i=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],o=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],l=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(i,o,l))}makeTranslation(t,i,o){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,i,0,0,1,o,0,0,0,1),this}makeRotationX(t){const i=Math.cos(t),o=Math.sin(t);return this.set(1,0,0,0,0,i,-o,0,0,o,i,0,0,0,0,1),this}makeRotationY(t){const i=Math.cos(t),o=Math.sin(t);return this.set(i,0,o,0,0,1,0,0,-o,0,i,0,0,0,0,1),this}makeRotationZ(t){const i=Math.cos(t),o=Math.sin(t);return this.set(i,-o,0,0,o,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,i){const o=Math.cos(i),l=Math.sin(i),u=1-o,d=t.x,h=t.y,p=t.z,g=u*d,x=u*h;return this.set(g*d+o,g*h-l*p,g*p+l*h,0,g*h+l*p,x*h+o,x*p-l*d,0,g*p-l*h,x*p+l*d,u*p*p+o,0,0,0,0,1),this}makeScale(t,i,o){return this.set(t,0,0,0,0,i,0,0,0,0,o,0,0,0,0,1),this}makeShear(t,i,o,l,u,d){return this.set(1,o,u,0,t,1,d,0,i,l,1,0,0,0,0,1),this}compose(t,i,o){const l=this.elements,u=i._x,d=i._y,h=i._z,p=i._w,g=u+u,x=d+d,v=h+h,M=u*g,S=u*x,T=u*v,C=d*x,E=d*v,y=h*v,O=p*g,P=p*x,U=p*v,F=o.x,H=o.y,I=o.z;return l[0]=(1-(C+y))*F,l[1]=(S+U)*F,l[2]=(T-P)*F,l[3]=0,l[4]=(S-U)*H,l[5]=(1-(M+y))*H,l[6]=(E+O)*H,l[7]=0,l[8]=(T+P)*I,l[9]=(E-O)*I,l[10]=(1-(M+C))*I,l[11]=0,l[12]=t.x,l[13]=t.y,l[14]=t.z,l[15]=1,this}decompose(t,i,o){const l=this.elements;let u=io.set(l[0],l[1],l[2]).length();const d=io.set(l[4],l[5],l[6]).length(),h=io.set(l[8],l[9],l[10]).length();this.determinant()<0&&(u=-u),t.x=l[12],t.y=l[13],t.z=l[14],Hi.copy(this);const g=1/u,x=1/d,v=1/h;return Hi.elements[0]*=g,Hi.elements[1]*=g,Hi.elements[2]*=g,Hi.elements[4]*=x,Hi.elements[5]*=x,Hi.elements[6]*=x,Hi.elements[8]*=v,Hi.elements[9]*=v,Hi.elements[10]*=v,i.setFromRotationMatrix(Hi),o.x=u,o.y=d,o.z=h,this}makePerspective(t,i,o,l,u,d,h=la,p=!1){const g=this.elements,x=2*u/(i-t),v=2*u/(o-l),M=(i+t)/(i-t),S=(o+l)/(o-l);let T,C;if(p)T=u/(d-u),C=d*u/(d-u);else if(h===la)T=-(d+u)/(d-u),C=-2*d*u/(d-u);else if(h===Ku)T=-d/(d-u),C=-d*u/(d-u);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+h);return g[0]=x,g[4]=0,g[8]=M,g[12]=0,g[1]=0,g[5]=v,g[9]=S,g[13]=0,g[2]=0,g[6]=0,g[10]=T,g[14]=C,g[3]=0,g[7]=0,g[11]=-1,g[15]=0,this}makeOrthographic(t,i,o,l,u,d,h=la,p=!1){const g=this.elements,x=2/(i-t),v=2/(o-l),M=-(i+t)/(i-t),S=-(o+l)/(o-l);let T,C;if(p)T=1/(d-u),C=d/(d-u);else if(h===la)T=-2/(d-u),C=-(d+u)/(d-u);else if(h===Ku)T=-1/(d-u),C=-u/(d-u);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+h);return g[0]=x,g[4]=0,g[8]=0,g[12]=M,g[1]=0,g[5]=v,g[9]=0,g[13]=S,g[2]=0,g[6]=0,g[10]=T,g[14]=C,g[3]=0,g[7]=0,g[11]=0,g[15]=1,this}equals(t){const i=this.elements,o=t.elements;for(let l=0;l<16;l++)if(i[l]!==o[l])return!1;return!0}fromArray(t,i=0){for(let o=0;o<16;o++)this.elements[o]=t[o+i];return this}toArray(t=[],i=0){const o=this.elements;return t[i]=o[0],t[i+1]=o[1],t[i+2]=o[2],t[i+3]=o[3],t[i+4]=o[4],t[i+5]=o[5],t[i+6]=o[6],t[i+7]=o[7],t[i+8]=o[8],t[i+9]=o[9],t[i+10]=o[10],t[i+11]=o[11],t[i+12]=o[12],t[i+13]=o[13],t[i+14]=o[14],t[i+15]=o[15],t}}const io=new te,Hi=new an,cT=new te(0,0,0),uT=new te(1,1,1),ms=new te,xu=new te,fi=new te,mx=new an,gx=new Gl;class ua{constructor(t=0,i=0,o=0,l=ua.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=i,this._z=o,this._order=l}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,i,o,l=this._order){return this._x=t,this._y=i,this._z=o,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,i=this._order,o=!0){const l=t.elements,u=l[0],d=l[4],h=l[8],p=l[1],g=l[5],x=l[9],v=l[2],M=l[6],S=l[10];switch(i){case"XYZ":this._y=Math.asin(Nt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-x,S),this._z=Math.atan2(-d,u)):(this._x=Math.atan2(M,g),this._z=0);break;case"YXZ":this._x=Math.asin(-Nt(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(h,S),this._z=Math.atan2(p,g)):(this._y=Math.atan2(-v,u),this._z=0);break;case"ZXY":this._x=Math.asin(Nt(M,-1,1)),Math.abs(M)<.9999999?(this._y=Math.atan2(-v,S),this._z=Math.atan2(-d,g)):(this._y=0,this._z=Math.atan2(p,u));break;case"ZYX":this._y=Math.asin(-Nt(v,-1,1)),Math.abs(v)<.9999999?(this._x=Math.atan2(M,S),this._z=Math.atan2(p,u)):(this._x=0,this._z=Math.atan2(-d,g));break;case"YZX":this._z=Math.asin(Nt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-x,g),this._y=Math.atan2(-v,u)):(this._x=0,this._y=Math.atan2(h,S));break;case"XZY":this._z=Math.asin(-Nt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(M,g),this._y=Math.atan2(h,u)):(this._x=Math.atan2(-x,S),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,o===!0&&this._onChangeCallback(),this}setFromQuaternion(t,i,o){return mx.makeRotationFromQuaternion(t),this.setFromRotationMatrix(mx,i,o)}setFromVector3(t,i=this._order){return this.set(t.x,t.y,t.z,i)}reorder(t){return gx.setFromEuler(this),this.setFromQuaternion(gx,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ua.DEFAULT_ORDER="XYZ";class Py{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let fT=0;const vx=new te,ao=new Gl,wa=new an,yu=new te,Cl=new te,dT=new te,hT=new Gl,_x=new te(1,0,0),xx=new te(0,1,0),yx=new te(0,0,1),Sx={type:"added"},pT={type:"removed"},so={type:"childadded",child:null},Qh={type:"childremoved",child:null};class Ln extends Co{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:fT++}),this.uuid=Hl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ln.DEFAULT_UP.clone();const t=new te,i=new ua,o=new Gl,l=new te(1,1,1);function u(){o.setFromEuler(i,!1)}function d(){i.setFromQuaternion(o,void 0,!1)}i._onChange(u),o._onChange(d),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:o},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new an},normalMatrix:{value:new vt}}),this.matrix=new an,this.matrixWorld=new an,this.matrixAutoUpdate=Ln.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ln.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Py,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,i){this.quaternion.setFromAxisAngle(t,i)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,i){return ao.setFromAxisAngle(t,i),this.quaternion.multiply(ao),this}rotateOnWorldAxis(t,i){return ao.setFromAxisAngle(t,i),this.quaternion.premultiply(ao),this}rotateX(t){return this.rotateOnAxis(_x,t)}rotateY(t){return this.rotateOnAxis(xx,t)}rotateZ(t){return this.rotateOnAxis(yx,t)}translateOnAxis(t,i){return vx.copy(t).applyQuaternion(this.quaternion),this.position.add(vx.multiplyScalar(i)),this}translateX(t){return this.translateOnAxis(_x,t)}translateY(t){return this.translateOnAxis(xx,t)}translateZ(t){return this.translateOnAxis(yx,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(wa.copy(this.matrixWorld).invert())}lookAt(t,i,o){t.isVector3?yu.copy(t):yu.set(t,i,o);const l=this.parent;this.updateWorldMatrix(!0,!1),Cl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wa.lookAt(Cl,yu,this.up):wa.lookAt(yu,Cl,this.up),this.quaternion.setFromRotationMatrix(wa),l&&(wa.extractRotation(l.matrixWorld),ao.setFromRotationMatrix(wa),this.quaternion.premultiply(ao.invert()))}add(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Sx),so.child=t,this.dispatchEvent(so),so.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let o=0;o<arguments.length;o++)this.remove(arguments[o]);return this}const i=this.children.indexOf(t);return i!==-1&&(t.parent=null,this.children.splice(i,1),t.dispatchEvent(pT),Qh.child=t,this.dispatchEvent(Qh),Qh.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),wa.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),wa.multiply(t.parent.matrixWorld)),t.applyMatrix4(wa),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Sx),so.child=t,this.dispatchEvent(so),so.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,i){if(this[t]===i)return this;for(let o=0,l=this.children.length;o<l;o++){const d=this.children[o].getObjectByProperty(t,i);if(d!==void 0)return d}}getObjectsByProperty(t,i,o=[]){this[t]===i&&o.push(this);const l=this.children;for(let u=0,d=l.length;u<d;u++)l[u].getObjectsByProperty(t,i,o);return o}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cl,t,dT),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cl,hT,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return t.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(t){t(this);const i=this.children;for(let o=0,l=i.length;o<l;o++)i[o].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const i=this.children;for(let o=0,l=i.length;o<l;o++)i[o].traverseVisible(t)}traverseAncestors(t){const i=this.parent;i!==null&&(t(i),i.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const i=this.children;for(let o=0,l=i.length;o<l;o++)i[o].updateMatrixWorld(t)}updateWorldMatrix(t,i){const o=this.parent;if(t===!0&&o!==null&&o.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let u=0,d=l.length;u<d;u++)l[u].updateWorldMatrix(!1,!0)}}toJSON(t){const i=t===void 0||typeof t=="string",o={};i&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},o.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.geometryInfo=this._geometryInfo.map(h=>({...h,boundingBox:h.boundingBox?h.boundingBox.toJSON():void 0,boundingSphere:h.boundingSphere?h.boundingSphere.toJSON():void 0})),l.instanceInfo=this._instanceInfo.map(h=>({...h})),l.availableInstanceIds=this._availableInstanceIds.slice(),l.availableGeometryIds=this._availableGeometryIds.slice(),l.nextIndexStart=this._nextIndexStart,l.nextVertexStart=this._nextVertexStart,l.geometryCount=this._geometryCount,l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.matricesTexture=this._matricesTexture.toJSON(t),l.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(l.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(l.boundingBox=this.boundingBox.toJSON()));function u(h,p){return h[p.uuid]===void 0&&(h[p.uuid]=p.toJSON(t)),p.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=u(t.geometries,this.geometry);const h=this.geometry.parameters;if(h!==void 0&&h.shapes!==void 0){const p=h.shapes;if(Array.isArray(p))for(let g=0,x=p.length;g<x;g++){const v=p[g];u(t.shapes,v)}else u(t.shapes,p)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(u(t.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const h=[];for(let p=0,g=this.material.length;p<g;p++)h.push(u(t.materials,this.material[p]));l.material=h}else l.material=u(t.materials,this.material);if(this.children.length>0){l.children=[];for(let h=0;h<this.children.length;h++)l.children.push(this.children[h].toJSON(t).object)}if(this.animations.length>0){l.animations=[];for(let h=0;h<this.animations.length;h++){const p=this.animations[h];l.animations.push(u(t.animations,p))}}if(i){const h=d(t.geometries),p=d(t.materials),g=d(t.textures),x=d(t.images),v=d(t.shapes),M=d(t.skeletons),S=d(t.animations),T=d(t.nodes);h.length>0&&(o.geometries=h),p.length>0&&(o.materials=p),g.length>0&&(o.textures=g),x.length>0&&(o.images=x),v.length>0&&(o.shapes=v),M.length>0&&(o.skeletons=M),S.length>0&&(o.animations=S),T.length>0&&(o.nodes=T)}return o.object=l,o;function d(h){const p=[];for(const g in h){const x=h[g];delete x.metadata,p.push(x)}return p}}clone(t){return new this.constructor().copy(this,t)}copy(t,i=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),i===!0)for(let o=0;o<t.children.length;o++){const l=t.children[o];this.add(l.clone())}return this}}Ln.DEFAULT_UP=new te(0,1,0);Ln.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ln.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Gi=new te,Na=new te,Jh=new te,Da=new te,ro=new te,oo=new te,Mx=new te,$h=new te,ep=new te,tp=new te,np=new Wt,ip=new Wt,ap=new Wt;class Vi{constructor(t=new te,i=new te,o=new te){this.a=t,this.b=i,this.c=o}static getNormal(t,i,o,l){l.subVectors(o,i),Gi.subVectors(t,i),l.cross(Gi);const u=l.lengthSq();return u>0?l.multiplyScalar(1/Math.sqrt(u)):l.set(0,0,0)}static getBarycoord(t,i,o,l,u){Gi.subVectors(l,i),Na.subVectors(o,i),Jh.subVectors(t,i);const d=Gi.dot(Gi),h=Gi.dot(Na),p=Gi.dot(Jh),g=Na.dot(Na),x=Na.dot(Jh),v=d*g-h*h;if(v===0)return u.set(0,0,0),null;const M=1/v,S=(g*p-h*x)*M,T=(d*x-h*p)*M;return u.set(1-S-T,T,S)}static containsPoint(t,i,o,l){return this.getBarycoord(t,i,o,l,Da)===null?!1:Da.x>=0&&Da.y>=0&&Da.x+Da.y<=1}static getInterpolation(t,i,o,l,u,d,h,p){return this.getBarycoord(t,i,o,l,Da)===null?(p.x=0,p.y=0,"z"in p&&(p.z=0),"w"in p&&(p.w=0),null):(p.setScalar(0),p.addScaledVector(u,Da.x),p.addScaledVector(d,Da.y),p.addScaledVector(h,Da.z),p)}static getInterpolatedAttribute(t,i,o,l,u,d){return np.setScalar(0),ip.setScalar(0),ap.setScalar(0),np.fromBufferAttribute(t,i),ip.fromBufferAttribute(t,o),ap.fromBufferAttribute(t,l),d.setScalar(0),d.addScaledVector(np,u.x),d.addScaledVector(ip,u.y),d.addScaledVector(ap,u.z),d}static isFrontFacing(t,i,o,l){return Gi.subVectors(o,i),Na.subVectors(t,i),Gi.cross(Na).dot(l)<0}set(t,i,o){return this.a.copy(t),this.b.copy(i),this.c.copy(o),this}setFromPointsAndIndices(t,i,o,l){return this.a.copy(t[i]),this.b.copy(t[o]),this.c.copy(t[l]),this}setFromAttributeAndIndices(t,i,o,l){return this.a.fromBufferAttribute(t,i),this.b.fromBufferAttribute(t,o),this.c.fromBufferAttribute(t,l),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Gi.subVectors(this.c,this.b),Na.subVectors(this.a,this.b),Gi.cross(Na).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Vi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,i){return Vi.getBarycoord(t,this.a,this.b,this.c,i)}getInterpolation(t,i,o,l,u){return Vi.getInterpolation(t,this.a,this.b,this.c,i,o,l,u)}containsPoint(t){return Vi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Vi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,i){const o=this.a,l=this.b,u=this.c;let d,h;ro.subVectors(l,o),oo.subVectors(u,o),$h.subVectors(t,o);const p=ro.dot($h),g=oo.dot($h);if(p<=0&&g<=0)return i.copy(o);ep.subVectors(t,l);const x=ro.dot(ep),v=oo.dot(ep);if(x>=0&&v<=x)return i.copy(l);const M=p*v-x*g;if(M<=0&&p>=0&&x<=0)return d=p/(p-x),i.copy(o).addScaledVector(ro,d);tp.subVectors(t,u);const S=ro.dot(tp),T=oo.dot(tp);if(T>=0&&S<=T)return i.copy(u);const C=S*g-p*T;if(C<=0&&g>=0&&T<=0)return h=g/(g-T),i.copy(o).addScaledVector(oo,h);const E=x*T-S*v;if(E<=0&&v-x>=0&&S-T>=0)return Mx.subVectors(u,l),h=(v-x)/(v-x+(S-T)),i.copy(l).addScaledVector(Mx,h);const y=1/(E+C+M);return d=C*y,h=M*y,i.copy(o).addScaledVector(ro,d).addScaledVector(oo,h)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Iy={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},gs={h:0,s:0,l:0},Su={h:0,s:0,l:0};function sp(s,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?s+(t-s)*6*i:i<1/2?t:i<2/3?s+(t-s)*6*(2/3-i):s}class wt{constructor(t,i,o){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,i,o)}set(t,i,o){if(i===void 0&&o===void 0){const l=t;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(t,i,o);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,i=ei){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Lt.colorSpaceToWorking(this,i),this}setRGB(t,i,o,l=Lt.workingColorSpace){return this.r=t,this.g=i,this.b=o,Lt.colorSpaceToWorking(this,l),this}setHSL(t,i,o,l=Lt.workingColorSpace){if(t=$E(t,1),i=Nt(i,0,1),o=Nt(o,0,1),i===0)this.r=this.g=this.b=o;else{const u=o<=.5?o*(1+i):o+i-o*i,d=2*o-u;this.r=sp(d,u,t+1/3),this.g=sp(d,u,t),this.b=sp(d,u,t-1/3)}return Lt.colorSpaceToWorking(this,l),this}setStyle(t,i=ei){function o(u){u!==void 0&&parseFloat(u)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(t)){let u;const d=l[1],h=l[2];switch(d){case"rgb":case"rgba":if(u=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return o(u[4]),this.setRGB(Math.min(255,parseInt(u[1],10))/255,Math.min(255,parseInt(u[2],10))/255,Math.min(255,parseInt(u[3],10))/255,i);if(u=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return o(u[4]),this.setRGB(Math.min(100,parseInt(u[1],10))/100,Math.min(100,parseInt(u[2],10))/100,Math.min(100,parseInt(u[3],10))/100,i);break;case"hsl":case"hsla":if(u=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return o(u[4]),this.setHSL(parseFloat(u[1])/360,parseFloat(u[2])/100,parseFloat(u[3])/100,i);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(t)){const u=l[1],d=u.length;if(d===3)return this.setRGB(parseInt(u.charAt(0),16)/15,parseInt(u.charAt(1),16)/15,parseInt(u.charAt(2),16)/15,i);if(d===6)return this.setHex(parseInt(u,16),i);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,i);return this}setColorName(t,i=ei){const o=Iy[t.toLowerCase()];return o!==void 0?this.setHex(o,i):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Pa(t.r),this.g=Pa(t.g),this.b=Pa(t.b),this}copyLinearToSRGB(t){return this.r=vo(t.r),this.g=vo(t.g),this.b=vo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ei){return Lt.workingToColorSpace(Bn.copy(this),t),Math.round(Nt(Bn.r*255,0,255))*65536+Math.round(Nt(Bn.g*255,0,255))*256+Math.round(Nt(Bn.b*255,0,255))}getHexString(t=ei){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,i=Lt.workingColorSpace){Lt.workingToColorSpace(Bn.copy(this),i);const o=Bn.r,l=Bn.g,u=Bn.b,d=Math.max(o,l,u),h=Math.min(o,l,u);let p,g;const x=(h+d)/2;if(h===d)p=0,g=0;else{const v=d-h;switch(g=x<=.5?v/(d+h):v/(2-d-h),d){case o:p=(l-u)/v+(l<u?6:0);break;case l:p=(u-o)/v+2;break;case u:p=(o-l)/v+4;break}p/=6}return t.h=p,t.s=g,t.l=x,t}getRGB(t,i=Lt.workingColorSpace){return Lt.workingToColorSpace(Bn.copy(this),i),t.r=Bn.r,t.g=Bn.g,t.b=Bn.b,t}getStyle(t=ei){Lt.workingToColorSpace(Bn.copy(this),t);const i=Bn.r,o=Bn.g,l=Bn.b;return t!==ei?`color(${t} ${i.toFixed(3)} ${o.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(o*255)},${Math.round(l*255)})`}offsetHSL(t,i,o){return this.getHSL(gs),this.setHSL(gs.h+t,gs.s+i,gs.l+o)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,i){return this.r=t.r+i.r,this.g=t.g+i.g,this.b=t.b+i.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,i){return this.r+=(t.r-this.r)*i,this.g+=(t.g-this.g)*i,this.b+=(t.b-this.b)*i,this}lerpColors(t,i,o){return this.r=t.r+(i.r-t.r)*o,this.g=t.g+(i.g-t.g)*o,this.b=t.b+(i.b-t.b)*o,this}lerpHSL(t,i){this.getHSL(gs),t.getHSL(Su);const o=Gh(gs.h,Su.h,i),l=Gh(gs.s,Su.s,i),u=Gh(gs.l,Su.l,i);return this.setHSL(o,l,u),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const i=this.r,o=this.g,l=this.b,u=t.elements;return this.r=u[0]*i+u[3]*o+u[6]*l,this.g=u[1]*i+u[4]*o+u[7]*l,this.b=u[2]*i+u[5]*o+u[8]*l,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,i=0){return this.r=t[i],this.g=t[i+1],this.b=t[i+2],this}toArray(t=[],i=0){return t[i]=this.r,t[i+1]=this.g,t[i+2]=this.b,t}fromBufferAttribute(t,i){return this.r=t.getX(i),this.g=t.getY(i),this.b=t.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Bn=new wt;wt.NAMES=Iy;let mT=0;class Ro extends Co{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:mT++}),this.uuid=Hl(),this.name="",this.type="Material",this.blending=go,this.side=Es,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Tp,this.blendDst=bp,this.blendEquation=ar,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new wt(0,0,0),this.blendAlpha=0,this.depthFunc=So,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=lx,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Jr,this.stencilZFail=Jr,this.stencilZPass=Jr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const i in t){const o=t[i];if(o===void 0){console.warn(`THREE.Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(o):l&&l.isVector3&&o&&o.isVector3?l.copy(o):this[i]=o}}toJSON(t){const i=t===void 0||typeof t=="string";i&&(t={textures:{},images:{}});const o={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.color&&this.color.isColor&&(o.color=this.color.getHex()),this.roughness!==void 0&&(o.roughness=this.roughness),this.metalness!==void 0&&(o.metalness=this.metalness),this.sheen!==void 0&&(o.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(o.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(o.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(o.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(o.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(o.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(o.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(o.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(o.shininess=this.shininess),this.clearcoat!==void 0&&(o.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(o.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(o.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(o.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(o.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,o.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(o.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(o.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(o.dispersion=this.dispersion),this.iridescence!==void 0&&(o.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(o.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(o.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(o.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(o.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(o.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(o.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(o.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(o.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(o.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(o.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(o.lightMap=this.lightMap.toJSON(t).uuid,o.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(o.aoMap=this.aoMap.toJSON(t).uuid,o.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(o.bumpMap=this.bumpMap.toJSON(t).uuid,o.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(o.normalMap=this.normalMap.toJSON(t).uuid,o.normalMapType=this.normalMapType,o.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(o.displacementMap=this.displacementMap.toJSON(t).uuid,o.displacementScale=this.displacementScale,o.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(o.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(o.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(o.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(o.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(o.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(o.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(o.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(o.combine=this.combine)),this.envMapRotation!==void 0&&(o.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(o.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(o.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(o.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(o.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(o.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(o.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(o.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(o.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(o.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(o.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(o.size=this.size),this.shadowSide!==null&&(o.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(o.sizeAttenuation=this.sizeAttenuation),this.blending!==go&&(o.blending=this.blending),this.side!==Es&&(o.side=this.side),this.vertexColors===!0&&(o.vertexColors=!0),this.opacity<1&&(o.opacity=this.opacity),this.transparent===!0&&(o.transparent=!0),this.blendSrc!==Tp&&(o.blendSrc=this.blendSrc),this.blendDst!==bp&&(o.blendDst=this.blendDst),this.blendEquation!==ar&&(o.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(o.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(o.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(o.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(o.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(o.blendAlpha=this.blendAlpha),this.depthFunc!==So&&(o.depthFunc=this.depthFunc),this.depthTest===!1&&(o.depthTest=this.depthTest),this.depthWrite===!1&&(o.depthWrite=this.depthWrite),this.colorWrite===!1&&(o.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(o.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==lx&&(o.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(o.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(o.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Jr&&(o.stencilFail=this.stencilFail),this.stencilZFail!==Jr&&(o.stencilZFail=this.stencilZFail),this.stencilZPass!==Jr&&(o.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(o.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(o.rotation=this.rotation),this.polygonOffset===!0&&(o.polygonOffset=!0),this.polygonOffsetFactor!==0&&(o.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(o.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(o.linewidth=this.linewidth),this.dashSize!==void 0&&(o.dashSize=this.dashSize),this.gapSize!==void 0&&(o.gapSize=this.gapSize),this.scale!==void 0&&(o.scale=this.scale),this.dithering===!0&&(o.dithering=!0),this.alphaTest>0&&(o.alphaTest=this.alphaTest),this.alphaHash===!0&&(o.alphaHash=!0),this.alphaToCoverage===!0&&(o.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(o.premultipliedAlpha=!0),this.forceSinglePass===!0&&(o.forceSinglePass=!0),this.wireframe===!0&&(o.wireframe=!0),this.wireframeLinewidth>1&&(o.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(o.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(o.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(o.flatShading=!0),this.visible===!1&&(o.visible=!1),this.toneMapped===!1&&(o.toneMapped=!1),this.fog===!1&&(o.fog=!1),Object.keys(this.userData).length>0&&(o.userData=this.userData);function l(u){const d=[];for(const h in u){const p=u[h];delete p.metadata,d.push(p)}return d}if(i){const u=l(t.textures),d=l(t.images);u.length>0&&(o.textures=u),d.length>0&&(o.images=d)}return o}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const i=t.clippingPlanes;let o=null;if(i!==null){const l=i.length;o=new Array(l);for(let u=0;u!==l;++u)o[u]=i[u].clone()}return this.clippingPlanes=o,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class _o extends Ro{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ua,this.combine=my,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const mn=new te,Mu=new dt;let gT=0;class qi{constructor(t,i,o=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:gT++}),this.name="",this.array=t,this.itemSize=i,this.count=t!==void 0?t.length/i:0,this.normalized=o,this.usage=cx,this.updateRanges=[],this.gpuType=La,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,i,o){t*=this.itemSize,o*=i.itemSize;for(let l=0,u=this.itemSize;l<u;l++)this.array[t+l]=i.array[o+l];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let i=0,o=this.count;i<o;i++)Mu.fromBufferAttribute(this,i),Mu.applyMatrix3(t),this.setXY(i,Mu.x,Mu.y);else if(this.itemSize===3)for(let i=0,o=this.count;i<o;i++)mn.fromBufferAttribute(this,i),mn.applyMatrix3(t),this.setXYZ(i,mn.x,mn.y,mn.z);return this}applyMatrix4(t){for(let i=0,o=this.count;i<o;i++)mn.fromBufferAttribute(this,i),mn.applyMatrix4(t),this.setXYZ(i,mn.x,mn.y,mn.z);return this}applyNormalMatrix(t){for(let i=0,o=this.count;i<o;i++)mn.fromBufferAttribute(this,i),mn.applyNormalMatrix(t),this.setXYZ(i,mn.x,mn.y,mn.z);return this}transformDirection(t){for(let i=0,o=this.count;i<o;i++)mn.fromBufferAttribute(this,i),mn.transformDirection(t),this.setXYZ(i,mn.x,mn.y,mn.z);return this}set(t,i=0){return this.array.set(t,i),this}getComponent(t,i){let o=this.array[t*this.itemSize+i];return this.normalized&&(o=Tl(o,this.array)),o}setComponent(t,i,o){return this.normalized&&(o=$n(o,this.array)),this.array[t*this.itemSize+i]=o,this}getX(t){let i=this.array[t*this.itemSize];return this.normalized&&(i=Tl(i,this.array)),i}setX(t,i){return this.normalized&&(i=$n(i,this.array)),this.array[t*this.itemSize]=i,this}getY(t){let i=this.array[t*this.itemSize+1];return this.normalized&&(i=Tl(i,this.array)),i}setY(t,i){return this.normalized&&(i=$n(i,this.array)),this.array[t*this.itemSize+1]=i,this}getZ(t){let i=this.array[t*this.itemSize+2];return this.normalized&&(i=Tl(i,this.array)),i}setZ(t,i){return this.normalized&&(i=$n(i,this.array)),this.array[t*this.itemSize+2]=i,this}getW(t){let i=this.array[t*this.itemSize+3];return this.normalized&&(i=Tl(i,this.array)),i}setW(t,i){return this.normalized&&(i=$n(i,this.array)),this.array[t*this.itemSize+3]=i,this}setXY(t,i,o){return t*=this.itemSize,this.normalized&&(i=$n(i,this.array),o=$n(o,this.array)),this.array[t+0]=i,this.array[t+1]=o,this}setXYZ(t,i,o,l){return t*=this.itemSize,this.normalized&&(i=$n(i,this.array),o=$n(o,this.array),l=$n(l,this.array)),this.array[t+0]=i,this.array[t+1]=o,this.array[t+2]=l,this}setXYZW(t,i,o,l,u){return t*=this.itemSize,this.normalized&&(i=$n(i,this.array),o=$n(o,this.array),l=$n(l,this.array),u=$n(u,this.array)),this.array[t+0]=i,this.array[t+1]=o,this.array[t+2]=l,this.array[t+3]=u,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==cx&&(t.usage=this.usage),t}}class By extends qi{constructor(t,i,o){super(new Uint16Array(t),i,o)}}class Fy extends qi{constructor(t,i,o){super(new Uint32Array(t),i,o)}}class Ui extends qi{constructor(t,i,o){super(new Float32Array(t),i,o)}}let vT=0;const Ai=new an,rp=new Ln,lo=new te,di=new Vl,Rl=new Vl,An=new te;class Yi extends Co{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vT++}),this.uuid=Hl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ly(t)?Fy:By)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,i){return this.attributes[t]=i,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,i,o=0){this.groups.push({start:t,count:i,materialIndex:o})}clearGroups(){this.groups=[]}setDrawRange(t,i){this.drawRange.start=t,this.drawRange.count=i}applyMatrix4(t){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(t),i.needsUpdate=!0);const o=this.attributes.normal;if(o!==void 0){const u=new vt().getNormalMatrix(t);o.applyNormalMatrix(u),o.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(t),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ai.makeRotationFromQuaternion(t),this.applyMatrix4(Ai),this}rotateX(t){return Ai.makeRotationX(t),this.applyMatrix4(Ai),this}rotateY(t){return Ai.makeRotationY(t),this.applyMatrix4(Ai),this}rotateZ(t){return Ai.makeRotationZ(t),this.applyMatrix4(Ai),this}translate(t,i,o){return Ai.makeTranslation(t,i,o),this.applyMatrix4(Ai),this}scale(t,i,o){return Ai.makeScale(t,i,o),this.applyMatrix4(Ai),this}lookAt(t){return rp.lookAt(t),rp.updateMatrix(),this.applyMatrix4(rp.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(lo).negate(),this.translate(lo.x,lo.y,lo.z),this}setFromPoints(t){const i=this.getAttribute("position");if(i===void 0){const o=[];for(let l=0,u=t.length;l<u;l++){const d=t[l];o.push(d.x,d.y,d.z||0)}this.setAttribute("position",new Ui(o,3))}else{const o=Math.min(t.length,i.count);for(let l=0;l<o;l++){const u=t[l];i.setXYZ(l,u.x,u.y,u.z||0)}t.length>i.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vl);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new te(-1/0,-1/0,-1/0),new te(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),i)for(let o=0,l=i.length;o<l;o++){const u=i[o];di.setFromBufferAttribute(u),this.morphTargetsRelative?(An.addVectors(this.boundingBox.min,di.min),this.boundingBox.expandByPoint(An),An.addVectors(this.boundingBox.max,di.max),this.boundingBox.expandByPoint(An)):(this.boundingBox.expandByPoint(di.min),this.boundingBox.expandByPoint(di.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new tf);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new te,1/0);return}if(t){const o=this.boundingSphere.center;if(di.setFromBufferAttribute(t),i)for(let u=0,d=i.length;u<d;u++){const h=i[u];Rl.setFromBufferAttribute(h),this.morphTargetsRelative?(An.addVectors(di.min,Rl.min),di.expandByPoint(An),An.addVectors(di.max,Rl.max),di.expandByPoint(An)):(di.expandByPoint(Rl.min),di.expandByPoint(Rl.max))}di.getCenter(o);let l=0;for(let u=0,d=t.count;u<d;u++)An.fromBufferAttribute(t,u),l=Math.max(l,o.distanceToSquared(An));if(i)for(let u=0,d=i.length;u<d;u++){const h=i[u],p=this.morphTargetsRelative;for(let g=0,x=h.count;g<x;g++)An.fromBufferAttribute(h,g),p&&(lo.fromBufferAttribute(t,g),An.add(lo)),l=Math.max(l,o.distanceToSquared(An))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,i=this.attributes;if(t===null||i.position===void 0||i.normal===void 0||i.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const o=i.position,l=i.normal,u=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qi(new Float32Array(4*o.count),4));const d=this.getAttribute("tangent"),h=[],p=[];for(let k=0;k<o.count;k++)h[k]=new te,p[k]=new te;const g=new te,x=new te,v=new te,M=new dt,S=new dt,T=new dt,C=new te,E=new te;function y(k,N,w){g.fromBufferAttribute(o,k),x.fromBufferAttribute(o,N),v.fromBufferAttribute(o,w),M.fromBufferAttribute(u,k),S.fromBufferAttribute(u,N),T.fromBufferAttribute(u,w),x.sub(g),v.sub(g),S.sub(M),T.sub(M);const G=1/(S.x*T.y-T.x*S.y);isFinite(G)&&(C.copy(x).multiplyScalar(T.y).addScaledVector(v,-S.y).multiplyScalar(G),E.copy(v).multiplyScalar(S.x).addScaledVector(x,-T.x).multiplyScalar(G),h[k].add(C),h[N].add(C),h[w].add(C),p[k].add(E),p[N].add(E),p[w].add(E))}let O=this.groups;O.length===0&&(O=[{start:0,count:t.count}]);for(let k=0,N=O.length;k<N;++k){const w=O[k],G=w.start,ae=w.count;for(let de=G,_e=G+ae;de<_e;de+=3)y(t.getX(de+0),t.getX(de+1),t.getX(de+2))}const P=new te,U=new te,F=new te,H=new te;function I(k){F.fromBufferAttribute(l,k),H.copy(F);const N=h[k];P.copy(N),P.sub(F.multiplyScalar(F.dot(N))).normalize(),U.crossVectors(H,N);const G=U.dot(p[k])<0?-1:1;d.setXYZW(k,P.x,P.y,P.z,G)}for(let k=0,N=O.length;k<N;++k){const w=O[k],G=w.start,ae=w.count;for(let de=G,_e=G+ae;de<_e;de+=3)I(t.getX(de+0)),I(t.getX(de+1)),I(t.getX(de+2))}}computeVertexNormals(){const t=this.index,i=this.getAttribute("position");if(i!==void 0){let o=this.getAttribute("normal");if(o===void 0)o=new qi(new Float32Array(i.count*3),3),this.setAttribute("normal",o);else for(let M=0,S=o.count;M<S;M++)o.setXYZ(M,0,0,0);const l=new te,u=new te,d=new te,h=new te,p=new te,g=new te,x=new te,v=new te;if(t)for(let M=0,S=t.count;M<S;M+=3){const T=t.getX(M+0),C=t.getX(M+1),E=t.getX(M+2);l.fromBufferAttribute(i,T),u.fromBufferAttribute(i,C),d.fromBufferAttribute(i,E),x.subVectors(d,u),v.subVectors(l,u),x.cross(v),h.fromBufferAttribute(o,T),p.fromBufferAttribute(o,C),g.fromBufferAttribute(o,E),h.add(x),p.add(x),g.add(x),o.setXYZ(T,h.x,h.y,h.z),o.setXYZ(C,p.x,p.y,p.z),o.setXYZ(E,g.x,g.y,g.z)}else for(let M=0,S=i.count;M<S;M+=3)l.fromBufferAttribute(i,M+0),u.fromBufferAttribute(i,M+1),d.fromBufferAttribute(i,M+2),x.subVectors(d,u),v.subVectors(l,u),x.cross(v),o.setXYZ(M+0,x.x,x.y,x.z),o.setXYZ(M+1,x.x,x.y,x.z),o.setXYZ(M+2,x.x,x.y,x.z);this.normalizeNormals(),o.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let i=0,o=t.count;i<o;i++)An.fromBufferAttribute(t,i),An.normalize(),t.setXYZ(i,An.x,An.y,An.z)}toNonIndexed(){function t(h,p){const g=h.array,x=h.itemSize,v=h.normalized,M=new g.constructor(p.length*x);let S=0,T=0;for(let C=0,E=p.length;C<E;C++){h.isInterleavedBufferAttribute?S=p[C]*h.data.stride+h.offset:S=p[C]*x;for(let y=0;y<x;y++)M[T++]=g[S++]}return new qi(M,x,v)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new Yi,o=this.index.array,l=this.attributes;for(const h in l){const p=l[h],g=t(p,o);i.setAttribute(h,g)}const u=this.morphAttributes;for(const h in u){const p=[],g=u[h];for(let x=0,v=g.length;x<v;x++){const M=g[x],S=t(M,o);p.push(S)}i.morphAttributes[h]=p}i.morphTargetsRelative=this.morphTargetsRelative;const d=this.groups;for(let h=0,p=d.length;h<p;h++){const g=d[h];i.addGroup(g.start,g.count,g.materialIndex)}return i}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const p=this.parameters;for(const g in p)p[g]!==void 0&&(t[g]=p[g]);return t}t.data={attributes:{}};const i=this.index;i!==null&&(t.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const o=this.attributes;for(const p in o){const g=o[p];t.data.attributes[p]=g.toJSON(t.data)}const l={};let u=!1;for(const p in this.morphAttributes){const g=this.morphAttributes[p],x=[];for(let v=0,M=g.length;v<M;v++){const S=g[v];x.push(S.toJSON(t.data))}x.length>0&&(l[p]=x,u=!0)}u&&(t.data.morphAttributes=l,t.data.morphTargetsRelative=this.morphTargetsRelative);const d=this.groups;d.length>0&&(t.data.groups=JSON.parse(JSON.stringify(d)));const h=this.boundingSphere;return h!==null&&(t.data.boundingSphere=h.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=t.name;const o=t.index;o!==null&&this.setIndex(o.clone());const l=t.attributes;for(const g in l){const x=l[g];this.setAttribute(g,x.clone(i))}const u=t.morphAttributes;for(const g in u){const x=[],v=u[g];for(let M=0,S=v.length;M<S;M++)x.push(v[M].clone(i));this.morphAttributes[g]=x}this.morphTargetsRelative=t.morphTargetsRelative;const d=t.groups;for(let g=0,x=d.length;g<x;g++){const v=d[g];this.addGroup(v.start,v.count,v.materialIndex)}const h=t.boundingBox;h!==null&&(this.boundingBox=h.clone());const p=t.boundingSphere;return p!==null&&(this.boundingSphere=p.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ex=new an,Qs=new zy,Eu=new tf,Tx=new te,Tu=new te,bu=new te,Au=new te,op=new te,Cu=new te,bx=new te,Ru=new te;class pi extends Ln{constructor(t=new Yi,i=new _o){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,o=Object.keys(i);if(o.length>0){const l=i[o[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,d=l.length;u<d;u++){const h=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[h]=u}}}}getVertexPosition(t,i){const o=this.geometry,l=o.attributes.position,u=o.morphAttributes.position,d=o.morphTargetsRelative;i.fromBufferAttribute(l,t);const h=this.morphTargetInfluences;if(u&&h){Cu.set(0,0,0);for(let p=0,g=u.length;p<g;p++){const x=h[p],v=u[p];x!==0&&(op.fromBufferAttribute(v,t),d?Cu.addScaledVector(op,x):Cu.addScaledVector(op.sub(i),x))}i.add(Cu)}return i}raycast(t,i){const o=this.geometry,l=this.material,u=this.matrixWorld;l!==void 0&&(o.boundingSphere===null&&o.computeBoundingSphere(),Eu.copy(o.boundingSphere),Eu.applyMatrix4(u),Qs.copy(t.ray).recast(t.near),!(Eu.containsPoint(Qs.origin)===!1&&(Qs.intersectSphere(Eu,Tx)===null||Qs.origin.distanceToSquared(Tx)>(t.far-t.near)**2))&&(Ex.copy(u).invert(),Qs.copy(t.ray).applyMatrix4(Ex),!(o.boundingBox!==null&&Qs.intersectsBox(o.boundingBox)===!1)&&this._computeIntersections(t,i,Qs)))}_computeIntersections(t,i,o){let l;const u=this.geometry,d=this.material,h=u.index,p=u.attributes.position,g=u.attributes.uv,x=u.attributes.uv1,v=u.attributes.normal,M=u.groups,S=u.drawRange;if(h!==null)if(Array.isArray(d))for(let T=0,C=M.length;T<C;T++){const E=M[T],y=d[E.materialIndex],O=Math.max(E.start,S.start),P=Math.min(h.count,Math.min(E.start+E.count,S.start+S.count));for(let U=O,F=P;U<F;U+=3){const H=h.getX(U),I=h.getX(U+1),k=h.getX(U+2);l=wu(this,y,t,o,g,x,v,H,I,k),l&&(l.faceIndex=Math.floor(U/3),l.face.materialIndex=E.materialIndex,i.push(l))}}else{const T=Math.max(0,S.start),C=Math.min(h.count,S.start+S.count);for(let E=T,y=C;E<y;E+=3){const O=h.getX(E),P=h.getX(E+1),U=h.getX(E+2);l=wu(this,d,t,o,g,x,v,O,P,U),l&&(l.faceIndex=Math.floor(E/3),i.push(l))}}else if(p!==void 0)if(Array.isArray(d))for(let T=0,C=M.length;T<C;T++){const E=M[T],y=d[E.materialIndex],O=Math.max(E.start,S.start),P=Math.min(p.count,Math.min(E.start+E.count,S.start+S.count));for(let U=O,F=P;U<F;U+=3){const H=U,I=U+1,k=U+2;l=wu(this,y,t,o,g,x,v,H,I,k),l&&(l.faceIndex=Math.floor(U/3),l.face.materialIndex=E.materialIndex,i.push(l))}}else{const T=Math.max(0,S.start),C=Math.min(p.count,S.start+S.count);for(let E=T,y=C;E<y;E+=3){const O=E,P=E+1,U=E+2;l=wu(this,d,t,o,g,x,v,O,P,U),l&&(l.faceIndex=Math.floor(E/3),i.push(l))}}}}function _T(s,t,i,o,l,u,d,h){let p;if(t.side===ti?p=o.intersectTriangle(d,u,l,!0,h):p=o.intersectTriangle(l,u,d,t.side===Es,h),p===null)return null;Ru.copy(h),Ru.applyMatrix4(s.matrixWorld);const g=i.ray.origin.distanceTo(Ru);return g<i.near||g>i.far?null:{distance:g,point:Ru.clone(),object:s}}function wu(s,t,i,o,l,u,d,h,p,g){s.getVertexPosition(h,Tu),s.getVertexPosition(p,bu),s.getVertexPosition(g,Au);const x=_T(s,t,i,o,Tu,bu,Au,bx);if(x){const v=new te;Vi.getBarycoord(bx,Tu,bu,Au,v),l&&(x.uv=Vi.getInterpolatedAttribute(l,h,p,g,v,new dt)),u&&(x.uv1=Vi.getInterpolatedAttribute(u,h,p,g,v,new dt)),d&&(x.normal=Vi.getInterpolatedAttribute(d,h,p,g,v,new te),x.normal.dot(o.direction)>0&&x.normal.multiplyScalar(-1));const M={a:h,b:p,c:g,normal:new te,materialIndex:0};Vi.getNormal(Tu,bu,Au,M.normal),x.face=M,x.barycoord=v}return x}class wo extends Yi{constructor(t=1,i=1,o=1,l=1,u=1,d=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:i,depth:o,widthSegments:l,heightSegments:u,depthSegments:d};const h=this;l=Math.floor(l),u=Math.floor(u),d=Math.floor(d);const p=[],g=[],x=[],v=[];let M=0,S=0;T("z","y","x",-1,-1,o,i,t,d,u,0),T("z","y","x",1,-1,o,i,-t,d,u,1),T("x","z","y",1,1,t,o,i,l,d,2),T("x","z","y",1,-1,t,o,-i,l,d,3),T("x","y","z",1,-1,t,i,o,l,u,4),T("x","y","z",-1,-1,t,i,-o,l,u,5),this.setIndex(p),this.setAttribute("position",new Ui(g,3)),this.setAttribute("normal",new Ui(x,3)),this.setAttribute("uv",new Ui(v,2));function T(C,E,y,O,P,U,F,H,I,k,N){const w=U/I,G=F/k,ae=U/2,de=F/2,_e=H/2,fe=I+1,X=k+1;let se=0,Y=0;const xe=new te;for(let Me=0;Me<X;Me++){const ze=Me*G-de;for(let ot=0;ot<fe;ot++){const ht=ot*w-ae;xe[C]=ht*O,xe[E]=ze*P,xe[y]=_e,g.push(xe.x,xe.y,xe.z),xe[C]=0,xe[E]=0,xe[y]=H>0?1:-1,x.push(xe.x,xe.y,xe.z),v.push(ot/I),v.push(1-Me/k),se+=1}}for(let Me=0;Me<k;Me++)for(let ze=0;ze<I;ze++){const ot=M+ze+fe*Me,ht=M+ze+fe*(Me+1),B=M+(ze+1)+fe*(Me+1),le=M+(ze+1)+fe*Me;p.push(ot,ht,le),p.push(ht,B,le),Y+=6}h.addGroup(S,Y,N),S+=Y,M+=se}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wo(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function bo(s){const t={};for(const i in s){t[i]={};for(const o in s[i]){const l=s[i][o];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[i][o]=null):t[i][o]=l.clone():Array.isArray(l)?t[i][o]=l.slice():t[i][o]=l}}return t}function Xn(s){const t={};for(let i=0;i<s.length;i++){const o=bo(s[i]);for(const l in o)t[l]=o[l]}return t}function xT(s){const t=[];for(let i=0;i<s.length;i++)t.push(s[i].clone());return t}function Hy(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Lt.workingColorSpace}const Fl={clone:bo,merge:Xn};var yT=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ST=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class qn extends Ro{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=yT,this.fragmentShader=ST,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=bo(t.uniforms),this.uniformsGroups=xT(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const i=super.toJSON(t);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const d=this.uniforms[l].value;d&&d.isTexture?i.uniforms[l]={type:"t",value:d.toJSON(t).uuid}:d&&d.isColor?i.uniforms[l]={type:"c",value:d.getHex()}:d&&d.isVector2?i.uniforms[l]={type:"v2",value:d.toArray()}:d&&d.isVector3?i.uniforms[l]={type:"v3",value:d.toArray()}:d&&d.isVector4?i.uniforms[l]={type:"v4",value:d.toArray()}:d&&d.isMatrix3?i.uniforms[l]={type:"m3",value:d.toArray()}:d&&d.isMatrix4?i.uniforms[l]={type:"m4",value:d.toArray()}:i.uniforms[l]={value:d}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const o={};for(const l in this.extensions)this.extensions[l]===!0&&(o[l]=!0);return Object.keys(o).length>0&&(i.extensions=o),i}}class Gy extends Ln{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new an,this.projectionMatrix=new an,this.projectionMatrixInverse=new an,this.coordinateSystem=la,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,i){return super.copy(t,i),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,i){super.updateWorldMatrix(t,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const vs=new te,Ax=new dt,Cx=new dt;class Ri extends Gy{constructor(t=50,i=1,o=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=o,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const i=.5*this.getFilmHeight()/t;this.fov=fm*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Hh*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return fm*2*Math.atan(Math.tan(Hh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,i,o){vs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(vs.x,vs.y).multiplyScalar(-t/vs.z),vs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),o.set(vs.x,vs.y).multiplyScalar(-t/vs.z)}getViewSize(t,i){return this.getViewBounds(t,Ax,Cx),i.subVectors(Cx,Ax)}setViewOffset(t,i,o,l,u,d){this.aspect=t/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=o,this.view.offsetY=l,this.view.width=u,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let i=t*Math.tan(Hh*.5*this.fov)/this.zoom,o=2*i,l=this.aspect*o,u=-.5*l;const d=this.view;if(this.view!==null&&this.view.enabled){const p=d.fullWidth,g=d.fullHeight;u+=d.offsetX*l/p,i-=d.offsetY*o/g,l*=d.width/p,o*=d.height/g}const h=this.filmOffset;h!==0&&(u+=t*h/this.getFilmWidth()),this.projectionMatrix.makePerspective(u,u+l,i,i-o,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const co=-90,uo=1;class MT extends Ln{constructor(t,i,o){super(),this.type="CubeCamera",this.renderTarget=o,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new Ri(co,uo,t,i);l.layers=this.layers,this.add(l);const u=new Ri(co,uo,t,i);u.layers=this.layers,this.add(u);const d=new Ri(co,uo,t,i);d.layers=this.layers,this.add(d);const h=new Ri(co,uo,t,i);h.layers=this.layers,this.add(h);const p=new Ri(co,uo,t,i);p.layers=this.layers,this.add(p);const g=new Ri(co,uo,t,i);g.layers=this.layers,this.add(g)}updateCoordinateSystem(){const t=this.coordinateSystem,i=this.children.concat(),[o,l,u,d,h,p]=i;for(const g of i)this.remove(g);if(t===la)o.up.set(0,1,0),o.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),u.up.set(0,0,-1),u.lookAt(0,1,0),d.up.set(0,0,1),d.lookAt(0,-1,0),h.up.set(0,1,0),h.lookAt(0,0,1),p.up.set(0,1,0),p.lookAt(0,0,-1);else if(t===Ku)o.up.set(0,-1,0),o.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),u.up.set(0,0,1),u.lookAt(0,1,0),d.up.set(0,0,-1),d.lookAt(0,-1,0),h.up.set(0,-1,0),h.lookAt(0,0,1),p.up.set(0,-1,0),p.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const g of i)this.add(g),g.updateMatrixWorld()}update(t,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:o,activeMipmapLevel:l}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[u,d,h,p,g,x]=this.children,v=t.getRenderTarget(),M=t.getActiveCubeFace(),S=t.getActiveMipmapLevel(),T=t.xr.enabled;t.xr.enabled=!1;const C=o.texture.generateMipmaps;o.texture.generateMipmaps=!1,t.setRenderTarget(o,0,l),t.render(i,u),t.setRenderTarget(o,1,l),t.render(i,d),t.setRenderTarget(o,2,l),t.render(i,h),t.setRenderTarget(o,3,l),t.render(i,p),t.setRenderTarget(o,4,l),t.render(i,g),o.texture.generateMipmaps=C,t.setRenderTarget(o,5,l),t.render(i,x),t.setRenderTarget(v,M,S),t.xr.enabled=T,o.texture.needsPMREMUpdate=!0}}class Vy extends Yn{constructor(t=[],i=Mo,o,l,u,d,h,p,g,x){super(t,i,o,l,u,d,h,p,g,x),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ET extends Xi{constructor(t=1,i={}){super(t,t,i),this.isWebGLCubeRenderTarget=!0;const o={width:t,height:t,depth:1},l=[o,o,o,o,o,o];this.texture=new Vy(l),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const o={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},l=new wo(5,5,5),u=new qn({name:"CubemapFromEquirect",uniforms:bo(o.uniforms),vertexShader:o.vertexShader,fragmentShader:o.fragmentShader,side:ti,blending:Oa});u.uniforms.tEquirect.value=i;const d=new pi(l,u),h=i.minFilter;return i.minFilter===or&&(i.minFilter=ji),new MT(1,10,this).update(t,d),i.minFilter=h,d.geometry.dispose(),d.material.dispose(),this}clear(t,i=!0,o=!0,l=!0){const u=t.getRenderTarget();for(let d=0;d<6;d++)t.setRenderTarget(this,d),t.clear(i,o,l);t.setRenderTarget(u)}}class Nu extends Ln{constructor(){super(),this.isGroup=!0,this.type="Group"}}const TT={type:"move"};class lp{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Nu,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Nu,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new te,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new te),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Nu,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new te,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new te),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const i=this._hand;if(i)for(const o of t.hand.values())this._getHandJoint(i,o)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,i,o){let l=null,u=null,d=null;const h=this._targetRay,p=this._grip,g=this._hand;if(t&&i.session.visibilityState!=="visible-blurred"){if(g&&t.hand){d=!0;for(const C of t.hand.values()){const E=i.getJointPose(C,o),y=this._getHandJoint(g,C);E!==null&&(y.matrix.fromArray(E.transform.matrix),y.matrix.decompose(y.position,y.rotation,y.scale),y.matrixWorldNeedsUpdate=!0,y.jointRadius=E.radius),y.visible=E!==null}const x=g.joints["index-finger-tip"],v=g.joints["thumb-tip"],M=x.position.distanceTo(v.position),S=.02,T=.005;g.inputState.pinching&&M>S+T?(g.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!g.inputState.pinching&&M<=S-T&&(g.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else p!==null&&t.gripSpace&&(u=i.getPose(t.gripSpace,o),u!==null&&(p.matrix.fromArray(u.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,u.linearVelocity?(p.hasLinearVelocity=!0,p.linearVelocity.copy(u.linearVelocity)):p.hasLinearVelocity=!1,u.angularVelocity?(p.hasAngularVelocity=!0,p.angularVelocity.copy(u.angularVelocity)):p.hasAngularVelocity=!1));h!==null&&(l=i.getPose(t.targetRaySpace,o),l===null&&u!==null&&(l=u),l!==null&&(h.matrix.fromArray(l.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,l.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(l.linearVelocity)):h.hasLinearVelocity=!1,l.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(l.angularVelocity)):h.hasAngularVelocity=!1,this.dispatchEvent(TT)))}return h!==null&&(h.visible=l!==null),p!==null&&(p.visible=u!==null),g!==null&&(g.visible=d!==null),this}_getHandJoint(t,i){if(t.joints[i.jointName]===void 0){const o=new Nu;o.matrixAutoUpdate=!1,o.visible=!1,t.joints[i.jointName]=o,t.add(o)}return t.joints[i.jointName]}}class bT extends Ln{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ua,this.environmentIntensity=1,this.environmentRotation=new ua,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,i){return super.copy(t,i),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const i=super.toJSON(t);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}const cp=new te,AT=new te,CT=new vt;class nr{constructor(t=new te(1,0,0),i=0){this.isPlane=!0,this.normal=t,this.constant=i}set(t,i){return this.normal.copy(t),this.constant=i,this}setComponents(t,i,o,l){return this.normal.set(t,i,o),this.constant=l,this}setFromNormalAndCoplanarPoint(t,i){return this.normal.copy(t),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(t,i,o){const l=cp.subVectors(o,i).cross(AT.subVectors(t,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,i){return i.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,i){const o=t.delta(cp),l=this.normal.dot(o);if(l===0)return this.distanceToPoint(t.start)===0?i.copy(t.start):null;const u=-(t.start.dot(this.normal)+this.constant)/l;return u<0||u>1?null:i.copy(t.start).addScaledVector(o,u)}intersectsLine(t){const i=this.distanceToPoint(t.start),o=this.distanceToPoint(t.end);return i<0&&o>0||o<0&&i>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,i){const o=i||CT.getNormalMatrix(t),l=this.coplanarPoint(cp).applyMatrix4(t),u=this.normal.applyMatrix3(o).normalize();return this.constant=-l.dot(u),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Js=new tf,RT=new dt(.5,.5),Du=new te;class Lm{constructor(t=new nr,i=new nr,o=new nr,l=new nr,u=new nr,d=new nr){this.planes=[t,i,o,l,u,d]}set(t,i,o,l,u,d){const h=this.planes;return h[0].copy(t),h[1].copy(i),h[2].copy(o),h[3].copy(l),h[4].copy(u),h[5].copy(d),this}copy(t){const i=this.planes;for(let o=0;o<6;o++)i[o].copy(t.planes[o]);return this}setFromProjectionMatrix(t,i=la,o=!1){const l=this.planes,u=t.elements,d=u[0],h=u[1],p=u[2],g=u[3],x=u[4],v=u[5],M=u[6],S=u[7],T=u[8],C=u[9],E=u[10],y=u[11],O=u[12],P=u[13],U=u[14],F=u[15];if(l[0].setComponents(g-d,S-x,y-T,F-O).normalize(),l[1].setComponents(g+d,S+x,y+T,F+O).normalize(),l[2].setComponents(g+h,S+v,y+C,F+P).normalize(),l[3].setComponents(g-h,S-v,y-C,F-P).normalize(),o)l[4].setComponents(p,M,E,U).normalize(),l[5].setComponents(g-p,S-M,y-E,F-U).normalize();else if(l[4].setComponents(g-p,S-M,y-E,F-U).normalize(),i===la)l[5].setComponents(g+p,S+M,y+E,F+U).normalize();else if(i===Ku)l[5].setComponents(p,M,E,U).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Js.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const i=t.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),Js.copy(i.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Js)}intersectsSprite(t){Js.center.set(0,0,0);const i=RT.distanceTo(t.center);return Js.radius=.7071067811865476+i,Js.applyMatrix4(t.matrixWorld),this.intersectsSphere(Js)}intersectsSphere(t){const i=this.planes,o=t.center,l=-t.radius;for(let u=0;u<6;u++)if(i[u].distanceToPoint(o)<l)return!1;return!0}intersectsBox(t){const i=this.planes;for(let o=0;o<6;o++){const l=i[o];if(Du.x=l.normal.x>0?t.max.x:t.min.x,Du.y=l.normal.y>0?t.max.y:t.min.y,Du.z=l.normal.z>0?t.max.z:t.min.z,l.distanceToPoint(Du)<0)return!1}return!0}containsPoint(t){const i=this.planes;for(let o=0;o<6;o++)if(i[o].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class jy extends Ro{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new wt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Rx=new an,dm=new zy,Uu=new tf,Lu=new te;class wT extends Ln{constructor(t=new Yi,i=new jy){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,i){const o=this.geometry,l=this.matrixWorld,u=t.params.Points.threshold,d=o.drawRange;if(o.boundingSphere===null&&o.computeBoundingSphere(),Uu.copy(o.boundingSphere),Uu.applyMatrix4(l),Uu.radius+=u,t.ray.intersectsSphere(Uu)===!1)return;Rx.copy(l).invert(),dm.copy(t.ray).applyMatrix4(Rx);const h=u/((this.scale.x+this.scale.y+this.scale.z)/3),p=h*h,g=o.index,v=o.attributes.position;if(g!==null){const M=Math.max(0,d.start),S=Math.min(g.count,d.start+d.count);for(let T=M,C=S;T<C;T++){const E=g.getX(T);Lu.fromBufferAttribute(v,E),wx(Lu,E,p,l,t,i,this)}}else{const M=Math.max(0,d.start),S=Math.min(v.count,d.start+d.count);for(let T=M,C=S;T<C;T++)Lu.fromBufferAttribute(v,T),wx(Lu,T,p,l,t,i,this)}}updateMorphTargets(){const i=this.geometry.morphAttributes,o=Object.keys(i);if(o.length>0){const l=i[o[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,d=l.length;u<d;u++){const h=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[h]=u}}}}}function wx(s,t,i,o,l,u,d){const h=dm.distanceSqToPoint(s);if(h<i){const p=new te;dm.closestPointToPoint(s,p),p.applyMatrix4(o);const g=l.ray.origin.distanceTo(p);if(g<l.near||g>l.far)return;u.push({distance:g,distanceToRay:Math.sqrt(h),point:p,index:t,face:null,faceIndex:null,barycoord:null,object:d})}}class ky extends Yn{constructor(t,i,o=ur,l,u,d,h=Di,p=Di,g,x=zl,v=1){if(x!==zl&&x!==Pl)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const M={width:t,height:i,depth:v};super(M,l,u,d,h,p,x,o,g),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Um(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const i=super.toJSON(t);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class Xy extends Yn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Om extends Yi{constructor(t=1,i=32,o=0,l=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:i,thetaStart:o,thetaLength:l},i=Math.max(3,i);const u=[],d=[],h=[],p=[],g=new te,x=new dt;d.push(0,0,0),h.push(0,0,1),p.push(.5,.5);for(let v=0,M=3;v<=i;v++,M+=3){const S=o+v/i*l;g.x=t*Math.cos(S),g.y=t*Math.sin(S),d.push(g.x,g.y,g.z),h.push(0,0,1),x.x=(d[M]/t+1)/2,x.y=(d[M+1]/t+1)/2,p.push(x.x,x.y)}for(let v=1;v<=i;v++)u.push(v,v+1,0);this.setIndex(u),this.setAttribute("position",new Ui(d,3)),this.setAttribute("normal",new Ui(h,3)),this.setAttribute("uv",new Ui(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Om(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class jl extends Yi{constructor(t=1,i=1,o=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:i,widthSegments:o,heightSegments:l};const u=t/2,d=i/2,h=Math.floor(o),p=Math.floor(l),g=h+1,x=p+1,v=t/h,M=i/p,S=[],T=[],C=[],E=[];for(let y=0;y<x;y++){const O=y*M-d;for(let P=0;P<g;P++){const U=P*v-u;T.push(U,-O,0),C.push(0,0,1),E.push(P/h),E.push(1-y/p)}}for(let y=0;y<p;y++)for(let O=0;O<h;O++){const P=O+g*y,U=O+g*(y+1),F=O+1+g*(y+1),H=O+1+g*y;S.push(P,U,H),S.push(U,F,H)}this.setIndex(S),this.setAttribute("position",new Ui(T,3)),this.setAttribute("normal",new Ui(C,3)),this.setAttribute("uv",new Ui(E,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jl(t.width,t.height,t.widthSegments,t.heightSegments)}}class NT extends qn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class up extends Ro{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new wt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dy,this.normalScale=new dt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ua,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class DT extends Ro{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=jE,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class UT extends Ro{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const fp={enabled:!1,files:{},add:function(s,t){this.enabled!==!1&&(this.files[s]=t)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class LT{constructor(t,i,o){const l=this;let u=!1,d=0,h=0,p;const g=[];this.onStart=void 0,this.onLoad=t,this.onProgress=i,this.onError=o,this.abortController=new AbortController,this.itemStart=function(x){h++,u===!1&&l.onStart!==void 0&&l.onStart(x,d,h),u=!0},this.itemEnd=function(x){d++,l.onProgress!==void 0&&l.onProgress(x,d,h),d===h&&(u=!1,l.onLoad!==void 0&&l.onLoad())},this.itemError=function(x){l.onError!==void 0&&l.onError(x)},this.resolveURL=function(x){return p?p(x):x},this.setURLModifier=function(x){return p=x,this},this.addHandler=function(x,v){return g.push(x,v),this},this.removeHandler=function(x){const v=g.indexOf(x);return v!==-1&&g.splice(v,2),this},this.getHandler=function(x){for(let v=0,M=g.length;v<M;v+=2){const S=g[v],T=g[v+1];if(S.global&&(S.lastIndex=0),S.test(x))return T}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const OT=new LT;class zm{constructor(t){this.manager=t!==void 0?t:OT,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,i){const o=this;return new Promise(function(l,u){o.load(t,l,i,u)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}zm.DEFAULT_MATERIAL_NAME="__DEFAULT";const fo=new WeakMap;class zT extends zm{constructor(t){super(t)}load(t,i,o,l){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const u=this,d=fp.get(`image:${t}`);if(d!==void 0){if(d.complete===!0)u.manager.itemStart(t),setTimeout(function(){i&&i(d),u.manager.itemEnd(t)},0);else{let v=fo.get(d);v===void 0&&(v=[],fo.set(d,v)),v.push({onLoad:i,onError:l})}return d}const h=Il("img");function p(){x(),i&&i(this);const v=fo.get(this)||[];for(let M=0;M<v.length;M++){const S=v[M];S.onLoad&&S.onLoad(this)}fo.delete(this),u.manager.itemEnd(t)}function g(v){x(),l&&l(v),fp.remove(`image:${t}`);const M=fo.get(this)||[];for(let S=0;S<M.length;S++){const T=M[S];T.onError&&T.onError(v)}fo.delete(this),u.manager.itemError(t),u.manager.itemEnd(t)}function x(){h.removeEventListener("load",p,!1),h.removeEventListener("error",g,!1)}return h.addEventListener("load",p,!1),h.addEventListener("error",g,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(h.crossOrigin=this.crossOrigin),fp.add(`image:${t}`,h),u.manager.itemStart(t),h.src=t,h}}class PT extends zm{constructor(t){super(t)}load(t,i,o,l){const u=new Yn,d=new zT(this.manager);return d.setCrossOrigin(this.crossOrigin),d.setPath(this.path),d.load(t,function(h){u.image=h,u.needsUpdate=!0,i!==void 0&&i(u)},o,l),u}}class Pm extends Ln{constructor(t,i=1){super(),this.isLight=!0,this.type="Light",this.color=new wt(t),this.intensity=i}dispose(){}copy(t,i){return super.copy(t,i),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const i=super.toJSON(t);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,this.groundColor!==void 0&&(i.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(i.object.distance=this.distance),this.angle!==void 0&&(i.object.angle=this.angle),this.decay!==void 0&&(i.object.decay=this.decay),this.penumbra!==void 0&&(i.object.penumbra=this.penumbra),this.shadow!==void 0&&(i.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(i.object.target=this.target.uuid),i}}const dp=new an,Nx=new te,Dx=new te;class qy{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new dt(512,512),this.mapType=ca,this.map=null,this.mapPass=null,this.matrix=new an,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Lm,this._frameExtents=new dt(1,1),this._viewportCount=1,this._viewports=[new Wt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const i=this.camera,o=this.matrix;Nx.setFromMatrixPosition(t.matrixWorld),i.position.copy(Nx),Dx.setFromMatrixPosition(t.target.matrixWorld),i.lookAt(Dx),i.updateMatrixWorld(),dp.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(dp,i.coordinateSystem,i.reversedDepth),i.reversedDepth?o.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):o.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),o.multiply(dp)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Ux=new an,wl=new te,hp=new te;class IT extends qy{constructor(){super(new Ri(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new dt(4,2),this._viewportCount=6,this._viewports=[new Wt(2,1,1,1),new Wt(0,1,1,1),new Wt(3,1,1,1),new Wt(1,1,1,1),new Wt(3,0,1,1),new Wt(1,0,1,1)],this._cubeDirections=[new te(1,0,0),new te(-1,0,0),new te(0,0,1),new te(0,0,-1),new te(0,1,0),new te(0,-1,0)],this._cubeUps=[new te(0,1,0),new te(0,1,0),new te(0,1,0),new te(0,1,0),new te(0,0,1),new te(0,0,-1)]}updateMatrices(t,i=0){const o=this.camera,l=this.matrix,u=t.distance||o.far;u!==o.far&&(o.far=u,o.updateProjectionMatrix()),wl.setFromMatrixPosition(t.matrixWorld),o.position.copy(wl),hp.copy(o.position),hp.add(this._cubeDirections[i]),o.up.copy(this._cubeUps[i]),o.lookAt(hp),o.updateMatrixWorld(),l.makeTranslation(-wl.x,-wl.y,-wl.z),Ux.multiplyMatrices(o.projectionMatrix,o.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ux,o.coordinateSystem,o.reversedDepth)}}class BT extends Pm{constructor(t,i,o=0,l=2){super(t,i),this.isPointLight=!0,this.type="PointLight",this.distance=o,this.decay=l,this.shadow=new IT}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,i){return super.copy(t,i),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class nf extends Gy{constructor(t=-1,i=1,o=1,l=-1,u=.1,d=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=i,this.top=o,this.bottom=l,this.near=u,this.far=d,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,i,o,l,u,d){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=o,this.view.offsetY=l,this.view.width=u,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),o=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let u=o-t,d=o+t,h=l+i,p=l-i;if(this.view!==null&&this.view.enabled){const g=(this.right-this.left)/this.view.fullWidth/this.zoom,x=(this.top-this.bottom)/this.view.fullHeight/this.zoom;u+=g*this.view.offsetX,d=u+g*this.view.width,h-=x*this.view.offsetY,p=h-x*this.view.height}this.projectionMatrix.makeOrthographic(u,d,h,p,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class FT extends qy{constructor(){super(new nf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class HT extends Pm{constructor(t,i){super(t,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ln.DEFAULT_UP),this.updateMatrix(),this.target=new Ln,this.shadow=new FT}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class GT extends Pm{constructor(t,i){super(t,i),this.isAmbientLight=!0,this.type="AmbientLight"}}class VT extends Ri{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Yy{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const i=performance.now();t=(i-this.oldTime)/1e3,this.oldTime=i,this.elapsedTime+=t}return t}}function Lx(s,t,i,o){const l=jT(o);switch(i){case Cy:return s*t;case wy:return s*t/l.components*l.byteLength;case wm:return s*t/l.components*l.byteLength;case Ny:return s*t*2/l.components*l.byteLength;case Nm:return s*t*2/l.components*l.byteLength;case Ry:return s*t*3/l.components*l.byteLength;case ki:return s*t*4/l.components*l.byteLength;case Dm:return s*t*4/l.components*l.byteLength;case Hu:case Gu:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Vu:case ju:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Bp:case Hp:return Math.max(s,16)*Math.max(t,8)/4;case Ip:case Fp:return Math.max(s,8)*Math.max(t,8)/2;case Gp:case Vp:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case jp:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case kp:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Xp:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case qp:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Yp:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Wp:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Zp:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Kp:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case Qp:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Jp:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case $p:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case em:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case tm:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case nm:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case im:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case am:case sm:case rm:return Math.ceil(s/4)*Math.ceil(t/4)*16;case om:case lm:return Math.ceil(s/4)*Math.ceil(t/4)*8;case cm:case um:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function jT(s){switch(s){case ca:case Ey:return{byteLength:1,components:1};case Ll:case Ty:case za:return{byteLength:2,components:1};case Cm:case Rm:return{byteLength:2,components:4};case ur:case Am:case La:return{byteLength:4,components:1};case by:case Ay:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Tm}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Tm);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Wy(){let s=null,t=!1,i=null,o=null;function l(u,d){i(u,d),o=s.requestAnimationFrame(l)}return{start:function(){t!==!0&&i!==null&&(o=s.requestAnimationFrame(l),t=!0)},stop:function(){s.cancelAnimationFrame(o),t=!1},setAnimationLoop:function(u){i=u},setContext:function(u){s=u}}}function kT(s){const t=new WeakMap;function i(h,p){const g=h.array,x=h.usage,v=g.byteLength,M=s.createBuffer();s.bindBuffer(p,M),s.bufferData(p,g,x),h.onUploadCallback();let S;if(g instanceof Float32Array)S=s.FLOAT;else if(typeof Float16Array<"u"&&g instanceof Float16Array)S=s.HALF_FLOAT;else if(g instanceof Uint16Array)h.isFloat16BufferAttribute?S=s.HALF_FLOAT:S=s.UNSIGNED_SHORT;else if(g instanceof Int16Array)S=s.SHORT;else if(g instanceof Uint32Array)S=s.UNSIGNED_INT;else if(g instanceof Int32Array)S=s.INT;else if(g instanceof Int8Array)S=s.BYTE;else if(g instanceof Uint8Array)S=s.UNSIGNED_BYTE;else if(g instanceof Uint8ClampedArray)S=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+g);return{buffer:M,type:S,bytesPerElement:g.BYTES_PER_ELEMENT,version:h.version,size:v}}function o(h,p,g){const x=p.array,v=p.updateRanges;if(s.bindBuffer(g,h),v.length===0)s.bufferSubData(g,0,x);else{v.sort((S,T)=>S.start-T.start);let M=0;for(let S=1;S<v.length;S++){const T=v[M],C=v[S];C.start<=T.start+T.count+1?T.count=Math.max(T.count,C.start+C.count-T.start):(++M,v[M]=C)}v.length=M+1;for(let S=0,T=v.length;S<T;S++){const C=v[S];s.bufferSubData(g,C.start*x.BYTES_PER_ELEMENT,x,C.start,C.count)}p.clearUpdateRanges()}p.onUploadCallback()}function l(h){return h.isInterleavedBufferAttribute&&(h=h.data),t.get(h)}function u(h){h.isInterleavedBufferAttribute&&(h=h.data);const p=t.get(h);p&&(s.deleteBuffer(p.buffer),t.delete(h))}function d(h,p){if(h.isInterleavedBufferAttribute&&(h=h.data),h.isGLBufferAttribute){const x=t.get(h);(!x||x.version<h.version)&&t.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}const g=t.get(h);if(g===void 0)t.set(h,i(h,p));else if(g.version<h.version){if(g.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(g.buffer,h,p),g.version=h.version}}return{get:l,remove:u,update:d}}var XT=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,qT=`#ifdef USE_ALPHAHASH
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
#endif`,YT=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,WT=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ZT=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,KT=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,QT=`#ifdef USE_AOMAP
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
#endif`,JT=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,$T=`#ifdef USE_BATCHING
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
#endif`,eb=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,tb=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,nb=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ib=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,ab=`#ifdef USE_IRIDESCENCE
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
#endif`,sb=`#ifdef USE_BUMPMAP
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
#endif`,rb=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,ob=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,lb=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cb=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ub=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,fb=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,db=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,hb=`#if defined( USE_COLOR_ALPHA )
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
#endif`,pb=`#define PI 3.141592653589793
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
} // validated`,mb=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,gb=`vec3 transformedNormal = objectNormal;
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
#endif`,vb=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,_b=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xb=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,yb=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Sb="gl_FragColor = linearToOutputTexel( gl_FragColor );",Mb=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Eb=`#ifdef USE_ENVMAP
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
#endif`,Tb=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,bb=`#ifdef USE_ENVMAP
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
#endif`,Ab=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Cb=`#ifdef USE_ENVMAP
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
#endif`,Rb=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,wb=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Nb=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Db=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ub=`#ifdef USE_GRADIENTMAP
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
}`,Lb=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ob=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,zb=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Pb=`uniform bool receiveShadow;
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
#endif`,Ib=`#ifdef USE_ENVMAP
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
#endif`,Bb=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fb=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hb=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Gb=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vb=`PhysicalMaterial material;
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
#endif`,jb=`struct PhysicalMaterial {
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
}`,kb=`
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
#endif`,Xb=`#if defined( RE_IndirectDiffuse )
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
#endif`,qb=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Yb=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Wb=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zb=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kb=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Qb=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Jb=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$b=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,eA=`#if defined( USE_POINTS_UV )
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
#endif`,tA=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,nA=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,iA=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,aA=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,sA=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rA=`#ifdef USE_MORPHTARGETS
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
#endif`,oA=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lA=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,cA=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,uA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dA=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,hA=`#ifdef USE_NORMALMAP
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
#endif`,pA=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,mA=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,gA=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,vA=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,_A=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xA=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,yA=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,SA=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,MA=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,EA=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,TA=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,bA=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,AA=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,CA=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,RA=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,wA=`float getShadowMask() {
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
}`,NA=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,DA=`#ifdef USE_SKINNING
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
#endif`,UA=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,LA=`#ifdef USE_SKINNING
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
#endif`,OA=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,zA=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,PA=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,IA=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,BA=`#ifdef USE_TRANSMISSION
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
#endif`,FA=`#ifdef USE_TRANSMISSION
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
#endif`,HA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,GA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,VA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jA=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const kA=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,XA=`uniform sampler2D t2D;
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
}`,qA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,YA=`#ifdef ENVMAP_TYPE_CUBE
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
}`,WA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ZA=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,KA=`#include <common>
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
}`,QA=`#if DEPTH_PACKING == 3200
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
}`,JA=`#define DISTANCE
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
}`,$A=`#define DISTANCE
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
}`,e2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,t2=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n2=`uniform float scale;
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
}`,i2=`uniform vec3 diffuse;
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
}`,a2=`#include <common>
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
}`,s2=`uniform vec3 diffuse;
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
}`,r2=`#define LAMBERT
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
}`,o2=`#define LAMBERT
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
}`,l2=`#define MATCAP
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
}`,c2=`#define MATCAP
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
}`,u2=`#define NORMAL
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
}`,f2=`#define NORMAL
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
}`,d2=`#define PHONG
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
}`,h2=`#define PHONG
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
}`,p2=`#define STANDARD
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
}`,m2=`#define STANDARD
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
}`,g2=`#define TOON
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
}`,v2=`#define TOON
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
}`,_2=`uniform float size;
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
}`,x2=`uniform vec3 diffuse;
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
}`,y2=`#include <common>
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
}`,S2=`uniform vec3 color;
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
}`,M2=`uniform float rotation;
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
}`,E2=`uniform vec3 diffuse;
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
}`,_t={alphahash_fragment:XT,alphahash_pars_fragment:qT,alphamap_fragment:YT,alphamap_pars_fragment:WT,alphatest_fragment:ZT,alphatest_pars_fragment:KT,aomap_fragment:QT,aomap_pars_fragment:JT,batching_pars_vertex:$T,batching_vertex:eb,begin_vertex:tb,beginnormal_vertex:nb,bsdfs:ib,iridescence_fragment:ab,bumpmap_pars_fragment:sb,clipping_planes_fragment:rb,clipping_planes_pars_fragment:ob,clipping_planes_pars_vertex:lb,clipping_planes_vertex:cb,color_fragment:ub,color_pars_fragment:fb,color_pars_vertex:db,color_vertex:hb,common:pb,cube_uv_reflection_fragment:mb,defaultnormal_vertex:gb,displacementmap_pars_vertex:vb,displacementmap_vertex:_b,emissivemap_fragment:xb,emissivemap_pars_fragment:yb,colorspace_fragment:Sb,colorspace_pars_fragment:Mb,envmap_fragment:Eb,envmap_common_pars_fragment:Tb,envmap_pars_fragment:bb,envmap_pars_vertex:Ab,envmap_physical_pars_fragment:Ib,envmap_vertex:Cb,fog_vertex:Rb,fog_pars_vertex:wb,fog_fragment:Nb,fog_pars_fragment:Db,gradientmap_pars_fragment:Ub,lightmap_pars_fragment:Lb,lights_lambert_fragment:Ob,lights_lambert_pars_fragment:zb,lights_pars_begin:Pb,lights_toon_fragment:Bb,lights_toon_pars_fragment:Fb,lights_phong_fragment:Hb,lights_phong_pars_fragment:Gb,lights_physical_fragment:Vb,lights_physical_pars_fragment:jb,lights_fragment_begin:kb,lights_fragment_maps:Xb,lights_fragment_end:qb,logdepthbuf_fragment:Yb,logdepthbuf_pars_fragment:Wb,logdepthbuf_pars_vertex:Zb,logdepthbuf_vertex:Kb,map_fragment:Qb,map_pars_fragment:Jb,map_particle_fragment:$b,map_particle_pars_fragment:eA,metalnessmap_fragment:tA,metalnessmap_pars_fragment:nA,morphinstance_vertex:iA,morphcolor_vertex:aA,morphnormal_vertex:sA,morphtarget_pars_vertex:rA,morphtarget_vertex:oA,normal_fragment_begin:lA,normal_fragment_maps:cA,normal_pars_fragment:uA,normal_pars_vertex:fA,normal_vertex:dA,normalmap_pars_fragment:hA,clearcoat_normal_fragment_begin:pA,clearcoat_normal_fragment_maps:mA,clearcoat_pars_fragment:gA,iridescence_pars_fragment:vA,opaque_fragment:_A,packing:xA,premultiplied_alpha_fragment:yA,project_vertex:SA,dithering_fragment:MA,dithering_pars_fragment:EA,roughnessmap_fragment:TA,roughnessmap_pars_fragment:bA,shadowmap_pars_fragment:AA,shadowmap_pars_vertex:CA,shadowmap_vertex:RA,shadowmask_pars_fragment:wA,skinbase_vertex:NA,skinning_pars_vertex:DA,skinning_vertex:UA,skinnormal_vertex:LA,specularmap_fragment:OA,specularmap_pars_fragment:zA,tonemapping_fragment:PA,tonemapping_pars_fragment:IA,transmission_fragment:BA,transmission_pars_fragment:FA,uv_pars_fragment:HA,uv_pars_vertex:GA,uv_vertex:VA,worldpos_vertex:jA,background_vert:kA,background_frag:XA,backgroundCube_vert:qA,backgroundCube_frag:YA,cube_vert:WA,cube_frag:ZA,depth_vert:KA,depth_frag:QA,distanceRGBA_vert:JA,distanceRGBA_frag:$A,equirect_vert:e2,equirect_frag:t2,linedashed_vert:n2,linedashed_frag:i2,meshbasic_vert:a2,meshbasic_frag:s2,meshlambert_vert:r2,meshlambert_frag:o2,meshmatcap_vert:l2,meshmatcap_frag:c2,meshnormal_vert:u2,meshnormal_frag:f2,meshphong_vert:d2,meshphong_frag:h2,meshphysical_vert:p2,meshphysical_frag:m2,meshtoon_vert:g2,meshtoon_frag:v2,points_vert:_2,points_frag:x2,shadow_vert:y2,shadow_frag:S2,sprite_vert:M2,sprite_frag:E2},Ge={common:{diffuse:{value:new wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new vt},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new vt}},envmap:{envMap:{value:null},envMapRotation:{value:new vt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new vt},normalScale:{value:new dt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0},uvTransform:{value:new vt}},sprite:{diffuse:{value:new wt(16777215)},opacity:{value:1},center:{value:new dt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new vt},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0}}},ra={basic:{uniforms:Xn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.fog]),vertexShader:_t.meshbasic_vert,fragmentShader:_t.meshbasic_frag},lambert:{uniforms:Xn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,Ge.lights,{emissive:{value:new wt(0)}}]),vertexShader:_t.meshlambert_vert,fragmentShader:_t.meshlambert_frag},phong:{uniforms:Xn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,Ge.lights,{emissive:{value:new wt(0)},specular:{value:new wt(1118481)},shininess:{value:30}}]),vertexShader:_t.meshphong_vert,fragmentShader:_t.meshphong_frag},standard:{uniforms:Xn([Ge.common,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.roughnessmap,Ge.metalnessmap,Ge.fog,Ge.lights,{emissive:{value:new wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:_t.meshphysical_vert,fragmentShader:_t.meshphysical_frag},toon:{uniforms:Xn([Ge.common,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.gradientmap,Ge.fog,Ge.lights,{emissive:{value:new wt(0)}}]),vertexShader:_t.meshtoon_vert,fragmentShader:_t.meshtoon_frag},matcap:{uniforms:Xn([Ge.common,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,{matcap:{value:null}}]),vertexShader:_t.meshmatcap_vert,fragmentShader:_t.meshmatcap_frag},points:{uniforms:Xn([Ge.points,Ge.fog]),vertexShader:_t.points_vert,fragmentShader:_t.points_frag},dashed:{uniforms:Xn([Ge.common,Ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:_t.linedashed_vert,fragmentShader:_t.linedashed_frag},depth:{uniforms:Xn([Ge.common,Ge.displacementmap]),vertexShader:_t.depth_vert,fragmentShader:_t.depth_frag},normal:{uniforms:Xn([Ge.common,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,{opacity:{value:1}}]),vertexShader:_t.meshnormal_vert,fragmentShader:_t.meshnormal_frag},sprite:{uniforms:Xn([Ge.sprite,Ge.fog]),vertexShader:_t.sprite_vert,fragmentShader:_t.sprite_frag},background:{uniforms:{uvTransform:{value:new vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:_t.background_vert,fragmentShader:_t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new vt}},vertexShader:_t.backgroundCube_vert,fragmentShader:_t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:_t.cube_vert,fragmentShader:_t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:_t.equirect_vert,fragmentShader:_t.equirect_frag},distanceRGBA:{uniforms:Xn([Ge.common,Ge.displacementmap,{referencePosition:{value:new te},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:_t.distanceRGBA_vert,fragmentShader:_t.distanceRGBA_frag},shadow:{uniforms:Xn([Ge.lights,Ge.fog,{color:{value:new wt(0)},opacity:{value:1}}]),vertexShader:_t.shadow_vert,fragmentShader:_t.shadow_frag}};ra.physical={uniforms:Xn([ra.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new vt},clearcoatNormalScale:{value:new dt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new vt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new vt},sheen:{value:0},sheenColor:{value:new wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new vt},transmissionSamplerSize:{value:new dt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new vt},attenuationDistance:{value:0},attenuationColor:{value:new wt(0)},specularColor:{value:new wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new vt},anisotropyVector:{value:new dt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new vt}}]),vertexShader:_t.meshphysical_vert,fragmentShader:_t.meshphysical_frag};const Ou={r:0,b:0,g:0},$s=new ua,T2=new an;function b2(s,t,i,o,l,u,d){const h=new wt(0);let p=u===!0?0:1,g,x,v=null,M=0,S=null;function T(P){let U=P.isScene===!0?P.background:null;return U&&U.isTexture&&(U=(P.backgroundBlurriness>0?i:t).get(U)),U}function C(P){let U=!1;const F=T(P);F===null?y(h,p):F&&F.isColor&&(y(F,1),U=!0);const H=s.xr.getEnvironmentBlendMode();H==="additive"?o.buffers.color.setClear(0,0,0,1,d):H==="alpha-blend"&&o.buffers.color.setClear(0,0,0,0,d),(s.autoClear||U)&&(o.buffers.depth.setTest(!0),o.buffers.depth.setMask(!0),o.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function E(P,U){const F=T(U);F&&(F.isCubeTexture||F.mapping===ef)?(x===void 0&&(x=new pi(new wo(1,1,1),new qn({name:"BackgroundCubeMaterial",uniforms:bo(ra.backgroundCube.uniforms),vertexShader:ra.backgroundCube.vertexShader,fragmentShader:ra.backgroundCube.fragmentShader,side:ti,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),x.geometry.deleteAttribute("normal"),x.geometry.deleteAttribute("uv"),x.onBeforeRender=function(H,I,k){this.matrixWorld.copyPosition(k.matrixWorld)},Object.defineProperty(x.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(x)),$s.copy(U.backgroundRotation),$s.x*=-1,$s.y*=-1,$s.z*=-1,F.isCubeTexture&&F.isRenderTargetTexture===!1&&($s.y*=-1,$s.z*=-1),x.material.uniforms.envMap.value=F,x.material.uniforms.flipEnvMap.value=F.isCubeTexture&&F.isRenderTargetTexture===!1?-1:1,x.material.uniforms.backgroundBlurriness.value=U.backgroundBlurriness,x.material.uniforms.backgroundIntensity.value=U.backgroundIntensity,x.material.uniforms.backgroundRotation.value.setFromMatrix4(T2.makeRotationFromEuler($s)),x.material.toneMapped=Lt.getTransfer(F.colorSpace)!==Xt,(v!==F||M!==F.version||S!==s.toneMapping)&&(x.material.needsUpdate=!0,v=F,M=F.version,S=s.toneMapping),x.layers.enableAll(),P.unshift(x,x.geometry,x.material,0,0,null)):F&&F.isTexture&&(g===void 0&&(g=new pi(new jl(2,2),new qn({name:"BackgroundMaterial",uniforms:bo(ra.background.uniforms),vertexShader:ra.background.vertexShader,fragmentShader:ra.background.fragmentShader,side:Es,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),g.geometry.deleteAttribute("normal"),Object.defineProperty(g.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(g)),g.material.uniforms.t2D.value=F,g.material.uniforms.backgroundIntensity.value=U.backgroundIntensity,g.material.toneMapped=Lt.getTransfer(F.colorSpace)!==Xt,F.matrixAutoUpdate===!0&&F.updateMatrix(),g.material.uniforms.uvTransform.value.copy(F.matrix),(v!==F||M!==F.version||S!==s.toneMapping)&&(g.material.needsUpdate=!0,v=F,M=F.version,S=s.toneMapping),g.layers.enableAll(),P.unshift(g,g.geometry,g.material,0,0,null))}function y(P,U){P.getRGB(Ou,Hy(s)),o.buffers.color.setClear(Ou.r,Ou.g,Ou.b,U,d)}function O(){x!==void 0&&(x.geometry.dispose(),x.material.dispose(),x=void 0),g!==void 0&&(g.geometry.dispose(),g.material.dispose(),g=void 0)}return{getClearColor:function(){return h},setClearColor:function(P,U=1){h.set(P),p=U,y(h,p)},getClearAlpha:function(){return p},setClearAlpha:function(P){p=P,y(h,p)},render:C,addToRenderList:E,dispose:O}}function A2(s,t){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),o={},l=M(null);let u=l,d=!1;function h(w,G,ae,de,_e){let fe=!1;const X=v(de,ae,G);u!==X&&(u=X,g(u.object)),fe=S(w,de,ae,_e),fe&&T(w,de,ae,_e),_e!==null&&t.update(_e,s.ELEMENT_ARRAY_BUFFER),(fe||d)&&(d=!1,U(w,G,ae,de),_e!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(_e).buffer))}function p(){return s.createVertexArray()}function g(w){return s.bindVertexArray(w)}function x(w){return s.deleteVertexArray(w)}function v(w,G,ae){const de=ae.wireframe===!0;let _e=o[w.id];_e===void 0&&(_e={},o[w.id]=_e);let fe=_e[G.id];fe===void 0&&(fe={},_e[G.id]=fe);let X=fe[de];return X===void 0&&(X=M(p()),fe[de]=X),X}function M(w){const G=[],ae=[],de=[];for(let _e=0;_e<i;_e++)G[_e]=0,ae[_e]=0,de[_e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:G,enabledAttributes:ae,attributeDivisors:de,object:w,attributes:{},index:null}}function S(w,G,ae,de){const _e=u.attributes,fe=G.attributes;let X=0;const se=ae.getAttributes();for(const Y in se)if(se[Y].location>=0){const Me=_e[Y];let ze=fe[Y];if(ze===void 0&&(Y==="instanceMatrix"&&w.instanceMatrix&&(ze=w.instanceMatrix),Y==="instanceColor"&&w.instanceColor&&(ze=w.instanceColor)),Me===void 0||Me.attribute!==ze||ze&&Me.data!==ze.data)return!0;X++}return u.attributesNum!==X||u.index!==de}function T(w,G,ae,de){const _e={},fe=G.attributes;let X=0;const se=ae.getAttributes();for(const Y in se)if(se[Y].location>=0){let Me=fe[Y];Me===void 0&&(Y==="instanceMatrix"&&w.instanceMatrix&&(Me=w.instanceMatrix),Y==="instanceColor"&&w.instanceColor&&(Me=w.instanceColor));const ze={};ze.attribute=Me,Me&&Me.data&&(ze.data=Me.data),_e[Y]=ze,X++}u.attributes=_e,u.attributesNum=X,u.index=de}function C(){const w=u.newAttributes;for(let G=0,ae=w.length;G<ae;G++)w[G]=0}function E(w){y(w,0)}function y(w,G){const ae=u.newAttributes,de=u.enabledAttributes,_e=u.attributeDivisors;ae[w]=1,de[w]===0&&(s.enableVertexAttribArray(w),de[w]=1),_e[w]!==G&&(s.vertexAttribDivisor(w,G),_e[w]=G)}function O(){const w=u.newAttributes,G=u.enabledAttributes;for(let ae=0,de=G.length;ae<de;ae++)G[ae]!==w[ae]&&(s.disableVertexAttribArray(ae),G[ae]=0)}function P(w,G,ae,de,_e,fe,X){X===!0?s.vertexAttribIPointer(w,G,ae,_e,fe):s.vertexAttribPointer(w,G,ae,de,_e,fe)}function U(w,G,ae,de){C();const _e=de.attributes,fe=ae.getAttributes(),X=G.defaultAttributeValues;for(const se in fe){const Y=fe[se];if(Y.location>=0){let xe=_e[se];if(xe===void 0&&(se==="instanceMatrix"&&w.instanceMatrix&&(xe=w.instanceMatrix),se==="instanceColor"&&w.instanceColor&&(xe=w.instanceColor)),xe!==void 0){const Me=xe.normalized,ze=xe.itemSize,ot=t.get(xe);if(ot===void 0)continue;const ht=ot.buffer,B=ot.type,le=ot.bytesPerElement,J=B===s.INT||B===s.UNSIGNED_INT||xe.gpuType===Am;if(xe.isInterleavedBufferAttribute){const ie=xe.data,Te=ie.stride,De=xe.offset;if(ie.isInstancedInterleavedBuffer){for(let Re=0;Re<Y.locationSize;Re++)y(Y.location+Re,ie.meshPerAttribute);w.isInstancedMesh!==!0&&de._maxInstanceCount===void 0&&(de._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Re=0;Re<Y.locationSize;Re++)E(Y.location+Re);s.bindBuffer(s.ARRAY_BUFFER,ht);for(let Re=0;Re<Y.locationSize;Re++)P(Y.location+Re,ze/Y.locationSize,B,Me,Te*le,(De+ze/Y.locationSize*Re)*le,J)}else{if(xe.isInstancedBufferAttribute){for(let ie=0;ie<Y.locationSize;ie++)y(Y.location+ie,xe.meshPerAttribute);w.isInstancedMesh!==!0&&de._maxInstanceCount===void 0&&(de._maxInstanceCount=xe.meshPerAttribute*xe.count)}else for(let ie=0;ie<Y.locationSize;ie++)E(Y.location+ie);s.bindBuffer(s.ARRAY_BUFFER,ht);for(let ie=0;ie<Y.locationSize;ie++)P(Y.location+ie,ze/Y.locationSize,B,Me,ze*le,ze/Y.locationSize*ie*le,J)}}else if(X!==void 0){const Me=X[se];if(Me!==void 0)switch(Me.length){case 2:s.vertexAttrib2fv(Y.location,Me);break;case 3:s.vertexAttrib3fv(Y.location,Me);break;case 4:s.vertexAttrib4fv(Y.location,Me);break;default:s.vertexAttrib1fv(Y.location,Me)}}}}O()}function F(){k();for(const w in o){const G=o[w];for(const ae in G){const de=G[ae];for(const _e in de)x(de[_e].object),delete de[_e];delete G[ae]}delete o[w]}}function H(w){if(o[w.id]===void 0)return;const G=o[w.id];for(const ae in G){const de=G[ae];for(const _e in de)x(de[_e].object),delete de[_e];delete G[ae]}delete o[w.id]}function I(w){for(const G in o){const ae=o[G];if(ae[w.id]===void 0)continue;const de=ae[w.id];for(const _e in de)x(de[_e].object),delete de[_e];delete ae[w.id]}}function k(){N(),d=!0,u!==l&&(u=l,g(u.object))}function N(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:k,resetDefaultState:N,dispose:F,releaseStatesOfGeometry:H,releaseStatesOfProgram:I,initAttributes:C,enableAttribute:E,disableUnusedAttributes:O}}function C2(s,t,i){let o;function l(g){o=g}function u(g,x){s.drawArrays(o,g,x),i.update(x,o,1)}function d(g,x,v){v!==0&&(s.drawArraysInstanced(o,g,x,v),i.update(x,o,v))}function h(g,x,v){if(v===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(o,g,0,x,0,v);let S=0;for(let T=0;T<v;T++)S+=x[T];i.update(S,o,1)}function p(g,x,v,M){if(v===0)return;const S=t.get("WEBGL_multi_draw");if(S===null)for(let T=0;T<g.length;T++)d(g[T],x[T],M[T]);else{S.multiDrawArraysInstancedWEBGL(o,g,0,x,0,M,0,v);let T=0;for(let C=0;C<v;C++)T+=x[C]*M[C];i.update(T,o,1)}}this.setMode=l,this.render=u,this.renderInstances=d,this.renderMultiDraw=h,this.renderMultiDrawInstances=p}function R2(s,t,i,o){let l;function u(){if(l!==void 0)return l;if(t.has("EXT_texture_filter_anisotropic")===!0){const I=t.get("EXT_texture_filter_anisotropic");l=s.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function d(I){return!(I!==ki&&o.convert(I)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function h(I){const k=I===za&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(I!==ca&&o.convert(I)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==La&&!k)}function p(I){if(I==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let g=i.precision!==void 0?i.precision:"highp";const x=p(g);x!==g&&(console.warn("THREE.WebGLRenderer:",g,"not supported, using",x,"instead."),g=x);const v=i.logarithmicDepthBuffer===!0,M=i.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),S=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),T=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),C=s.getParameter(s.MAX_TEXTURE_SIZE),E=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),y=s.getParameter(s.MAX_VERTEX_ATTRIBS),O=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),P=s.getParameter(s.MAX_VARYING_VECTORS),U=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),F=T>0,H=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:u,getMaxPrecision:p,textureFormatReadable:d,textureTypeReadable:h,precision:g,logarithmicDepthBuffer:v,reversedDepthBuffer:M,maxTextures:S,maxVertexTextures:T,maxTextureSize:C,maxCubemapSize:E,maxAttributes:y,maxVertexUniforms:O,maxVaryings:P,maxFragmentUniforms:U,vertexTextures:F,maxSamples:H}}function w2(s){const t=this;let i=null,o=0,l=!1,u=!1;const d=new nr,h=new vt,p={value:null,needsUpdate:!1};this.uniform=p,this.numPlanes=0,this.numIntersection=0,this.init=function(v,M){const S=v.length!==0||M||o!==0||l;return l=M,o=v.length,S},this.beginShadows=function(){u=!0,x(null)},this.endShadows=function(){u=!1},this.setGlobalState=function(v,M){i=x(v,M,0)},this.setState=function(v,M,S){const T=v.clippingPlanes,C=v.clipIntersection,E=v.clipShadows,y=s.get(v);if(!l||T===null||T.length===0||u&&!E)u?x(null):g();else{const O=u?0:o,P=O*4;let U=y.clippingState||null;p.value=U,U=x(T,M,P,S);for(let F=0;F!==P;++F)U[F]=i[F];y.clippingState=U,this.numIntersection=C?this.numPlanes:0,this.numPlanes+=O}};function g(){p.value!==i&&(p.value=i,p.needsUpdate=o>0),t.numPlanes=o,t.numIntersection=0}function x(v,M,S,T){const C=v!==null?v.length:0;let E=null;if(C!==0){if(E=p.value,T!==!0||E===null){const y=S+C*4,O=M.matrixWorldInverse;h.getNormalMatrix(O),(E===null||E.length<y)&&(E=new Float32Array(y));for(let P=0,U=S;P!==C;++P,U+=4)d.copy(v[P]).applyMatrix4(O,h),d.normal.toArray(E,U),E[U+3]=d.constant}p.value=E,p.needsUpdate=!0}return t.numPlanes=C,t.numIntersection=0,E}}function N2(s){let t=new WeakMap;function i(d,h){return h===Lp?d.mapping=Mo:h===Op&&(d.mapping=Eo),d}function o(d){if(d&&d.isTexture){const h=d.mapping;if(h===Lp||h===Op)if(t.has(d)){const p=t.get(d).texture;return i(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const g=new ET(p.height);return g.fromEquirectangularTexture(s,d),t.set(d,g),d.addEventListener("dispose",l),i(g.texture,d.mapping)}else return null}}return d}function l(d){const h=d.target;h.removeEventListener("dispose",l);const p=t.get(h);p!==void 0&&(t.delete(h),p.dispose())}function u(){t=new WeakMap}return{get:o,dispose:u}}const mo=4,Ox=[.125,.215,.35,.446,.526,.582],sr=20,pp=new nf,zx=new wt;let mp=null,gp=0,vp=0,_p=!1;const ir=(1+Math.sqrt(5))/2,ho=1/ir,Px=[new te(-ir,ho,0),new te(ir,ho,0),new te(-ho,0,ir),new te(ho,0,ir),new te(0,ir,-ho),new te(0,ir,ho),new te(-1,1,-1),new te(1,1,-1),new te(-1,1,1),new te(1,1,1)],D2=new te;class Ix{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,i=0,o=.1,l=100,u={}){const{size:d=256,position:h=D2}=u;mp=this._renderer.getRenderTarget(),gp=this._renderer.getActiveCubeFace(),vp=this._renderer.getActiveMipmapLevel(),_p=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(d);const p=this._allocateTargets();return p.depthBuffer=!0,this._sceneToCubeUV(t,o,l,p,h),i>0&&this._blur(p,0,0,i),this._applyPMREM(p),this._cleanup(p),p}fromEquirectangular(t,i=null){return this._fromTexture(t,i)}fromCubemap(t,i=null){return this._fromTexture(t,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Hx(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Fx(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(mp,gp,vp),this._renderer.xr.enabled=_p,t.scissorTest=!1,zu(t,0,0,t.width,t.height)}_fromTexture(t,i){t.mapping===Mo||t.mapping===Eo?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),mp=this._renderer.getRenderTarget(),gp=this._renderer.getActiveCubeFace(),vp=this._renderer.getActiveMipmapLevel(),_p=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const o=i||this._allocateTargets();return this._textureToCubeUV(t,o),this._applyPMREM(o),this._cleanup(o),o}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,o={magFilter:ji,minFilter:ji,generateMipmaps:!1,type:za,format:ki,colorSpace:To,depthBuffer:!1},l=Bx(t,i,o);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bx(t,i,o);const{_lodMax:u}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=U2(u)),this._blurMaterial=L2(u,t,i)}return l}_compileMaterial(t){const i=new pi(this._lodPlanes[0],t);this._renderer.compile(i,pp)}_sceneToCubeUV(t,i,o,l,u){const p=new Ri(90,1,i,o),g=[1,-1,1,1,1,1],x=[1,1,1,-1,-1,-1],v=this._renderer,M=v.autoClear,S=v.toneMapping;v.getClearColor(zx),v.toneMapping=Ss,v.autoClear=!1,v.state.buffers.depth.getReversed()&&(v.setRenderTarget(l),v.clearDepth(),v.setRenderTarget(null));const C=new _o({name:"PMREM.Background",side:ti,depthWrite:!1,depthTest:!1}),E=new pi(new wo,C);let y=!1;const O=t.background;O?O.isColor&&(C.color.copy(O),t.background=null,y=!0):(C.color.copy(zx),y=!0);for(let P=0;P<6;P++){const U=P%3;U===0?(p.up.set(0,g[P],0),p.position.set(u.x,u.y,u.z),p.lookAt(u.x+x[P],u.y,u.z)):U===1?(p.up.set(0,0,g[P]),p.position.set(u.x,u.y,u.z),p.lookAt(u.x,u.y+x[P],u.z)):(p.up.set(0,g[P],0),p.position.set(u.x,u.y,u.z),p.lookAt(u.x,u.y,u.z+x[P]));const F=this._cubeSize;zu(l,U*F,P>2?F:0,F,F),v.setRenderTarget(l),y&&v.render(E,p),v.render(t,p)}E.geometry.dispose(),E.material.dispose(),v.toneMapping=S,v.autoClear=M,t.background=O}_textureToCubeUV(t,i){const o=this._renderer,l=t.mapping===Mo||t.mapping===Eo;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=Hx()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Fx());const u=l?this._cubemapMaterial:this._equirectMaterial,d=new pi(this._lodPlanes[0],u),h=u.uniforms;h.envMap.value=t;const p=this._cubeSize;zu(i,0,0,3*p,2*p),o.setRenderTarget(i),o.render(d,pp)}_applyPMREM(t){const i=this._renderer,o=i.autoClear;i.autoClear=!1;const l=this._lodPlanes.length;for(let u=1;u<l;u++){const d=Math.sqrt(this._sigmas[u]*this._sigmas[u]-this._sigmas[u-1]*this._sigmas[u-1]),h=Px[(l-u-1)%Px.length];this._blur(t,u-1,u,d,h)}i.autoClear=o}_blur(t,i,o,l,u){const d=this._pingPongRenderTarget;this._halfBlur(t,d,i,o,l,"latitudinal",u),this._halfBlur(d,t,o,o,l,"longitudinal",u)}_halfBlur(t,i,o,l,u,d,h){const p=this._renderer,g=this._blurMaterial;d!=="latitudinal"&&d!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const x=3,v=new pi(this._lodPlanes[l],g),M=g.uniforms,S=this._sizeLods[o]-1,T=isFinite(u)?Math.PI/(2*S):2*Math.PI/(2*sr-1),C=u/T,E=isFinite(u)?1+Math.floor(x*C):sr;E>sr&&console.warn(`sigmaRadians, ${u}, is too large and will clip, as it requested ${E} samples when the maximum is set to ${sr}`);const y=[];let O=0;for(let I=0;I<sr;++I){const k=I/C,N=Math.exp(-k*k/2);y.push(N),I===0?O+=N:I<E&&(O+=2*N)}for(let I=0;I<y.length;I++)y[I]=y[I]/O;M.envMap.value=t.texture,M.samples.value=E,M.weights.value=y,M.latitudinal.value=d==="latitudinal",h&&(M.poleAxis.value=h);const{_lodMax:P}=this;M.dTheta.value=T,M.mipInt.value=P-o;const U=this._sizeLods[l],F=3*U*(l>P-mo?l-P+mo:0),H=4*(this._cubeSize-U);zu(i,F,H,3*U,2*U),p.setRenderTarget(i),p.render(v,pp)}}function U2(s){const t=[],i=[],o=[];let l=s;const u=s-mo+1+Ox.length;for(let d=0;d<u;d++){const h=Math.pow(2,l);i.push(h);let p=1/h;d>s-mo?p=Ox[d-s+mo-1]:d===0&&(p=0),o.push(p);const g=1/(h-2),x=-g,v=1+g,M=[x,x,v,x,v,v,x,x,v,v,x,v],S=6,T=6,C=3,E=2,y=1,O=new Float32Array(C*T*S),P=new Float32Array(E*T*S),U=new Float32Array(y*T*S);for(let H=0;H<S;H++){const I=H%3*2/3-1,k=H>2?0:-1,N=[I,k,0,I+2/3,k,0,I+2/3,k+1,0,I,k,0,I+2/3,k+1,0,I,k+1,0];O.set(N,C*T*H),P.set(M,E*T*H);const w=[H,H,H,H,H,H];U.set(w,y*T*H)}const F=new Yi;F.setAttribute("position",new qi(O,C)),F.setAttribute("uv",new qi(P,E)),F.setAttribute("faceIndex",new qi(U,y)),t.push(F),l>mo&&l--}return{lodPlanes:t,sizeLods:i,sigmas:o}}function Bx(s,t,i){const o=new Xi(s,t,i);return o.texture.mapping=ef,o.texture.name="PMREM.cubeUv",o.scissorTest=!0,o}function zu(s,t,i,o,l){s.viewport.set(t,i,o,l),s.scissor.set(t,i,o,l)}function L2(s,t,i){const o=new Float32Array(sr),l=new te(0,1,0);return new qn({name:"SphericalGaussianBlur",defines:{n:sr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:o},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:Im(),fragmentShader:`

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
		`,blending:Oa,depthTest:!1,depthWrite:!1})}function Fx(){return new qn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Im(),fragmentShader:`

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
		`,blending:Oa,depthTest:!1,depthWrite:!1})}function Hx(){return new qn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Im(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Oa,depthTest:!1,depthWrite:!1})}function Im(){return`

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
	`}function O2(s){let t=new WeakMap,i=null;function o(h){if(h&&h.isTexture){const p=h.mapping,g=p===Lp||p===Op,x=p===Mo||p===Eo;if(g||x){let v=t.get(h);const M=v!==void 0?v.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==M)return i===null&&(i=new Ix(s)),v=g?i.fromEquirectangular(h,v):i.fromCubemap(h,v),v.texture.pmremVersion=h.pmremVersion,t.set(h,v),v.texture;if(v!==void 0)return v.texture;{const S=h.image;return g&&S&&S.height>0||x&&S&&l(S)?(i===null&&(i=new Ix(s)),v=g?i.fromEquirectangular(h):i.fromCubemap(h),v.texture.pmremVersion=h.pmremVersion,t.set(h,v),h.addEventListener("dispose",u),v.texture):null}}}return h}function l(h){let p=0;const g=6;for(let x=0;x<g;x++)h[x]!==void 0&&p++;return p===g}function u(h){const p=h.target;p.removeEventListener("dispose",u);const g=t.get(p);g!==void 0&&(t.delete(p),g.dispose())}function d(){t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:o,dispose:d}}function z2(s){const t={};function i(o){if(t[o]!==void 0)return t[o];let l;switch(o){case"WEBGL_depth_texture":l=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":l=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":l=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":l=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:l=s.getExtension(o)}return t[o]=l,l}return{has:function(o){return i(o)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(o){const l=i(o);return l===null&&Bl("THREE.WebGLRenderer: "+o+" extension not supported."),l}}}function P2(s,t,i,o){const l={},u=new WeakMap;function d(v){const M=v.target;M.index!==null&&t.remove(M.index);for(const T in M.attributes)t.remove(M.attributes[T]);M.removeEventListener("dispose",d),delete l[M.id];const S=u.get(M);S&&(t.remove(S),u.delete(M)),o.releaseStatesOfGeometry(M),M.isInstancedBufferGeometry===!0&&delete M._maxInstanceCount,i.memory.geometries--}function h(v,M){return l[M.id]===!0||(M.addEventListener("dispose",d),l[M.id]=!0,i.memory.geometries++),M}function p(v){const M=v.attributes;for(const S in M)t.update(M[S],s.ARRAY_BUFFER)}function g(v){const M=[],S=v.index,T=v.attributes.position;let C=0;if(S!==null){const O=S.array;C=S.version;for(let P=0,U=O.length;P<U;P+=3){const F=O[P+0],H=O[P+1],I=O[P+2];M.push(F,H,H,I,I,F)}}else if(T!==void 0){const O=T.array;C=T.version;for(let P=0,U=O.length/3-1;P<U;P+=3){const F=P+0,H=P+1,I=P+2;M.push(F,H,H,I,I,F)}}else return;const E=new(Ly(M)?Fy:By)(M,1);E.version=C;const y=u.get(v);y&&t.remove(y),u.set(v,E)}function x(v){const M=u.get(v);if(M){const S=v.index;S!==null&&M.version<S.version&&g(v)}else g(v);return u.get(v)}return{get:h,update:p,getWireframeAttribute:x}}function I2(s,t,i){let o;function l(M){o=M}let u,d;function h(M){u=M.type,d=M.bytesPerElement}function p(M,S){s.drawElements(o,S,u,M*d),i.update(S,o,1)}function g(M,S,T){T!==0&&(s.drawElementsInstanced(o,S,u,M*d,T),i.update(S,o,T))}function x(M,S,T){if(T===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(o,S,0,u,M,0,T);let E=0;for(let y=0;y<T;y++)E+=S[y];i.update(E,o,1)}function v(M,S,T,C){if(T===0)return;const E=t.get("WEBGL_multi_draw");if(E===null)for(let y=0;y<M.length;y++)g(M[y]/d,S[y],C[y]);else{E.multiDrawElementsInstancedWEBGL(o,S,0,u,M,0,C,0,T);let y=0;for(let O=0;O<T;O++)y+=S[O]*C[O];i.update(y,o,1)}}this.setMode=l,this.setIndex=h,this.render=p,this.renderInstances=g,this.renderMultiDraw=x,this.renderMultiDrawInstances=v}function B2(s){const t={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function o(u,d,h){switch(i.calls++,d){case s.TRIANGLES:i.triangles+=h*(u/3);break;case s.LINES:i.lines+=h*(u/2);break;case s.LINE_STRIP:i.lines+=h*(u-1);break;case s.LINE_LOOP:i.lines+=h*u;break;case s.POINTS:i.points+=h*u;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",d);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:t,render:i,programs:null,autoReset:!0,reset:l,update:o}}function F2(s,t,i){const o=new WeakMap,l=new Wt;function u(d,h,p){const g=d.morphTargetInfluences,x=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=x!==void 0?x.length:0;let M=o.get(h);if(M===void 0||M.count!==v){let w=function(){k.dispose(),o.delete(h),h.removeEventListener("dispose",w)};var S=w;M!==void 0&&M.texture.dispose();const T=h.morphAttributes.position!==void 0,C=h.morphAttributes.normal!==void 0,E=h.morphAttributes.color!==void 0,y=h.morphAttributes.position||[],O=h.morphAttributes.normal||[],P=h.morphAttributes.color||[];let U=0;T===!0&&(U=1),C===!0&&(U=2),E===!0&&(U=3);let F=h.attributes.position.count*U,H=1;F>t.maxTextureSize&&(H=Math.ceil(F/t.maxTextureSize),F=t.maxTextureSize);const I=new Float32Array(F*H*4*v),k=new Oy(I,F,H,v);k.type=La,k.needsUpdate=!0;const N=U*4;for(let G=0;G<v;G++){const ae=y[G],de=O[G],_e=P[G],fe=F*H*4*G;for(let X=0;X<ae.count;X++){const se=X*N;T===!0&&(l.fromBufferAttribute(ae,X),I[fe+se+0]=l.x,I[fe+se+1]=l.y,I[fe+se+2]=l.z,I[fe+se+3]=0),C===!0&&(l.fromBufferAttribute(de,X),I[fe+se+4]=l.x,I[fe+se+5]=l.y,I[fe+se+6]=l.z,I[fe+se+7]=0),E===!0&&(l.fromBufferAttribute(_e,X),I[fe+se+8]=l.x,I[fe+se+9]=l.y,I[fe+se+10]=l.z,I[fe+se+11]=_e.itemSize===4?l.w:1)}}M={count:v,texture:k,size:new dt(F,H)},o.set(h,M),h.addEventListener("dispose",w)}if(d.isInstancedMesh===!0&&d.morphTexture!==null)p.getUniforms().setValue(s,"morphTexture",d.morphTexture,i);else{let T=0;for(let E=0;E<g.length;E++)T+=g[E];const C=h.morphTargetsRelative?1:1-T;p.getUniforms().setValue(s,"morphTargetBaseInfluence",C),p.getUniforms().setValue(s,"morphTargetInfluences",g)}p.getUniforms().setValue(s,"morphTargetsTexture",M.texture,i),p.getUniforms().setValue(s,"morphTargetsTextureSize",M.size)}return{update:u}}function H2(s,t,i,o){let l=new WeakMap;function u(p){const g=o.render.frame,x=p.geometry,v=t.get(p,x);if(l.get(v)!==g&&(t.update(v),l.set(v,g)),p.isInstancedMesh&&(p.hasEventListener("dispose",h)===!1&&p.addEventListener("dispose",h),l.get(p)!==g&&(i.update(p.instanceMatrix,s.ARRAY_BUFFER),p.instanceColor!==null&&i.update(p.instanceColor,s.ARRAY_BUFFER),l.set(p,g))),p.isSkinnedMesh){const M=p.skeleton;l.get(M)!==g&&(M.update(),l.set(M,g))}return v}function d(){l=new WeakMap}function h(p){const g=p.target;g.removeEventListener("dispose",h),i.remove(g.instanceMatrix),g.instanceColor!==null&&i.remove(g.instanceColor)}return{update:u,dispose:d}}const Zy=new Yn,Gx=new ky(1,1),Ky=new Oy,Qy=new oT,Jy=new Vy,Vx=[],jx=[],kx=new Float32Array(16),Xx=new Float32Array(9),qx=new Float32Array(4);function No(s,t,i){const o=s[0];if(o<=0||o>0)return s;const l=t*i;let u=Vx[l];if(u===void 0&&(u=new Float32Array(l),Vx[l]=u),t!==0){o.toArray(u,0);for(let d=1,h=0;d!==t;++d)h+=i,s[d].toArray(u,h)}return u}function Sn(s,t){if(s.length!==t.length)return!1;for(let i=0,o=s.length;i<o;i++)if(s[i]!==t[i])return!1;return!0}function Mn(s,t){for(let i=0,o=t.length;i<o;i++)s[i]=t[i]}function af(s,t){let i=jx[t];i===void 0&&(i=new Int32Array(t),jx[t]=i);for(let o=0;o!==t;++o)i[o]=s.allocateTextureUnit();return i}function G2(s,t){const i=this.cache;i[0]!==t&&(s.uniform1f(this.addr,t),i[0]=t)}function V2(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(Sn(i,t))return;s.uniform2fv(this.addr,t),Mn(i,t)}}function j2(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else if(t.r!==void 0)(i[0]!==t.r||i[1]!==t.g||i[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),i[0]=t.r,i[1]=t.g,i[2]=t.b);else{if(Sn(i,t))return;s.uniform3fv(this.addr,t),Mn(i,t)}}function k2(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(Sn(i,t))return;s.uniform4fv(this.addr,t),Mn(i,t)}}function X2(s,t){const i=this.cache,o=t.elements;if(o===void 0){if(Sn(i,t))return;s.uniformMatrix2fv(this.addr,!1,t),Mn(i,t)}else{if(Sn(i,o))return;qx.set(o),s.uniformMatrix2fv(this.addr,!1,qx),Mn(i,o)}}function q2(s,t){const i=this.cache,o=t.elements;if(o===void 0){if(Sn(i,t))return;s.uniformMatrix3fv(this.addr,!1,t),Mn(i,t)}else{if(Sn(i,o))return;Xx.set(o),s.uniformMatrix3fv(this.addr,!1,Xx),Mn(i,o)}}function Y2(s,t){const i=this.cache,o=t.elements;if(o===void 0){if(Sn(i,t))return;s.uniformMatrix4fv(this.addr,!1,t),Mn(i,t)}else{if(Sn(i,o))return;kx.set(o),s.uniformMatrix4fv(this.addr,!1,kx),Mn(i,o)}}function W2(s,t){const i=this.cache;i[0]!==t&&(s.uniform1i(this.addr,t),i[0]=t)}function Z2(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(Sn(i,t))return;s.uniform2iv(this.addr,t),Mn(i,t)}}function K2(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(Sn(i,t))return;s.uniform3iv(this.addr,t),Mn(i,t)}}function Q2(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(Sn(i,t))return;s.uniform4iv(this.addr,t),Mn(i,t)}}function J2(s,t){const i=this.cache;i[0]!==t&&(s.uniform1ui(this.addr,t),i[0]=t)}function $2(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(Sn(i,t))return;s.uniform2uiv(this.addr,t),Mn(i,t)}}function eC(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(Sn(i,t))return;s.uniform3uiv(this.addr,t),Mn(i,t)}}function tC(s,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(Sn(i,t))return;s.uniform4uiv(this.addr,t),Mn(i,t)}}function nC(s,t,i){const o=this.cache,l=i.allocateTextureUnit();o[0]!==l&&(s.uniform1i(this.addr,l),o[0]=l);let u;this.type===s.SAMPLER_2D_SHADOW?(Gx.compareFunction=Uy,u=Gx):u=Zy,i.setTexture2D(t||u,l)}function iC(s,t,i){const o=this.cache,l=i.allocateTextureUnit();o[0]!==l&&(s.uniform1i(this.addr,l),o[0]=l),i.setTexture3D(t||Qy,l)}function aC(s,t,i){const o=this.cache,l=i.allocateTextureUnit();o[0]!==l&&(s.uniform1i(this.addr,l),o[0]=l),i.setTextureCube(t||Jy,l)}function sC(s,t,i){const o=this.cache,l=i.allocateTextureUnit();o[0]!==l&&(s.uniform1i(this.addr,l),o[0]=l),i.setTexture2DArray(t||Ky,l)}function rC(s){switch(s){case 5126:return G2;case 35664:return V2;case 35665:return j2;case 35666:return k2;case 35674:return X2;case 35675:return q2;case 35676:return Y2;case 5124:case 35670:return W2;case 35667:case 35671:return Z2;case 35668:case 35672:return K2;case 35669:case 35673:return Q2;case 5125:return J2;case 36294:return $2;case 36295:return eC;case 36296:return tC;case 35678:case 36198:case 36298:case 36306:case 35682:return nC;case 35679:case 36299:case 36307:return iC;case 35680:case 36300:case 36308:case 36293:return aC;case 36289:case 36303:case 36311:case 36292:return sC}}function oC(s,t){s.uniform1fv(this.addr,t)}function lC(s,t){const i=No(t,this.size,2);s.uniform2fv(this.addr,i)}function cC(s,t){const i=No(t,this.size,3);s.uniform3fv(this.addr,i)}function uC(s,t){const i=No(t,this.size,4);s.uniform4fv(this.addr,i)}function fC(s,t){const i=No(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,i)}function dC(s,t){const i=No(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,i)}function hC(s,t){const i=No(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,i)}function pC(s,t){s.uniform1iv(this.addr,t)}function mC(s,t){s.uniform2iv(this.addr,t)}function gC(s,t){s.uniform3iv(this.addr,t)}function vC(s,t){s.uniform4iv(this.addr,t)}function _C(s,t){s.uniform1uiv(this.addr,t)}function xC(s,t){s.uniform2uiv(this.addr,t)}function yC(s,t){s.uniform3uiv(this.addr,t)}function SC(s,t){s.uniform4uiv(this.addr,t)}function MC(s,t,i){const o=this.cache,l=t.length,u=af(i,l);Sn(o,u)||(s.uniform1iv(this.addr,u),Mn(o,u));for(let d=0;d!==l;++d)i.setTexture2D(t[d]||Zy,u[d])}function EC(s,t,i){const o=this.cache,l=t.length,u=af(i,l);Sn(o,u)||(s.uniform1iv(this.addr,u),Mn(o,u));for(let d=0;d!==l;++d)i.setTexture3D(t[d]||Qy,u[d])}function TC(s,t,i){const o=this.cache,l=t.length,u=af(i,l);Sn(o,u)||(s.uniform1iv(this.addr,u),Mn(o,u));for(let d=0;d!==l;++d)i.setTextureCube(t[d]||Jy,u[d])}function bC(s,t,i){const o=this.cache,l=t.length,u=af(i,l);Sn(o,u)||(s.uniform1iv(this.addr,u),Mn(o,u));for(let d=0;d!==l;++d)i.setTexture2DArray(t[d]||Ky,u[d])}function AC(s){switch(s){case 5126:return oC;case 35664:return lC;case 35665:return cC;case 35666:return uC;case 35674:return fC;case 35675:return dC;case 35676:return hC;case 5124:case 35670:return pC;case 35667:case 35671:return mC;case 35668:case 35672:return gC;case 35669:case 35673:return vC;case 5125:return _C;case 36294:return xC;case 36295:return yC;case 36296:return SC;case 35678:case 36198:case 36298:case 36306:case 35682:return MC;case 35679:case 36299:case 36307:return EC;case 35680:case 36300:case 36308:case 36293:return TC;case 36289:case 36303:case 36311:case 36292:return bC}}class CC{constructor(t,i,o){this.id=t,this.addr=o,this.cache=[],this.type=i.type,this.setValue=rC(i.type)}}class RC{constructor(t,i,o){this.id=t,this.addr=o,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=AC(i.type)}}class wC{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,i,o){const l=this.seq;for(let u=0,d=l.length;u!==d;++u){const h=l[u];h.setValue(t,i[h.id],o)}}}const xp=/(\w+)(\])?(\[|\.)?/g;function Yx(s,t){s.seq.push(t),s.map[t.id]=t}function NC(s,t,i){const o=s.name,l=o.length;for(xp.lastIndex=0;;){const u=xp.exec(o),d=xp.lastIndex;let h=u[1];const p=u[2]==="]",g=u[3];if(p&&(h=h|0),g===void 0||g==="["&&d+2===l){Yx(i,g===void 0?new CC(h,s,t):new RC(h,s,t));break}else{let v=i.map[h];v===void 0&&(v=new wC(h),Yx(i,v)),i=v}}}class ku{constructor(t,i){this.seq=[],this.map={};const o=t.getProgramParameter(i,t.ACTIVE_UNIFORMS);for(let l=0;l<o;++l){const u=t.getActiveUniform(i,l),d=t.getUniformLocation(i,u.name);NC(u,d,this)}}setValue(t,i,o,l){const u=this.map[i];u!==void 0&&u.setValue(t,o,l)}setOptional(t,i,o){const l=i[o];l!==void 0&&this.setValue(t,o,l)}static upload(t,i,o,l){for(let u=0,d=i.length;u!==d;++u){const h=i[u],p=o[h.id];p.needsUpdate!==!1&&h.setValue(t,p.value,l)}}static seqWithValue(t,i){const o=[];for(let l=0,u=t.length;l!==u;++l){const d=t[l];d.id in i&&o.push(d)}return o}}function Wx(s,t,i){const o=s.createShader(t);return s.shaderSource(o,i),s.compileShader(o),o}const DC=37297;let UC=0;function LC(s,t){const i=s.split(`
`),o=[],l=Math.max(t-6,0),u=Math.min(t+6,i.length);for(let d=l;d<u;d++){const h=d+1;o.push(`${h===t?">":" "} ${h}: ${i[d]}`)}return o.join(`
`)}const Zx=new vt;function OC(s){Lt._getMatrix(Zx,Lt.workingColorSpace,s);const t=`mat3( ${Zx.elements.map(i=>i.toFixed(4))} )`;switch(Lt.getTransfer(s)){case Zu:return[t,"LinearTransferOETF"];case Xt:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Kx(s,t,i){const o=s.getShaderParameter(t,s.COMPILE_STATUS),u=(s.getShaderInfoLog(t)||"").trim();if(o&&u==="")return"";const d=/ERROR: 0:(\d+)/.exec(u);if(d){const h=parseInt(d[1]);return i.toUpperCase()+`

`+u+`

`+LC(s.getShaderSource(t),h)}else return u}function zC(s,t){const i=OC(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}function PC(s,t){let i;switch(t){case gy:i="Linear";break;case vy:i="Reinhard";break;case _y:i="Cineon";break;case bm:i="ACESFilmic";break;case yy:i="AgX";break;case Sy:i="Neutral";break;case xy:i="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),i="Linear"}return"vec3 "+s+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const Pu=new te;function IC(){Lt.getLuminanceCoefficients(Pu);const s=Pu.x.toFixed(4),t=Pu.y.toFixed(4),i=Pu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function BC(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Dl).join(`
`)}function FC(s){const t=[];for(const i in s){const o=s[i];o!==!1&&t.push("#define "+i+" "+o)}return t.join(`
`)}function HC(s,t){const i={},o=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let l=0;l<o;l++){const u=s.getActiveAttrib(t,l),d=u.name;let h=1;u.type===s.FLOAT_MAT2&&(h=2),u.type===s.FLOAT_MAT3&&(h=3),u.type===s.FLOAT_MAT4&&(h=4),i[d]={type:u.type,location:s.getAttribLocation(t,d),locationSize:h}}return i}function Dl(s){return s!==""}function Qx(s,t){const i=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Jx(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const GC=/^[ \t]*#include +<([\w\d./]+)>/gm;function hm(s){return s.replace(GC,jC)}const VC=new Map;function jC(s,t){let i=_t[t];if(i===void 0){const o=VC.get(t);if(o!==void 0)i=_t[o],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,o);else throw new Error("Can not resolve #include <"+t+">")}return hm(i)}const kC=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $x(s){return s.replace(kC,XC)}function XC(s,t,i,o){let l="";for(let u=parseInt(t);u<parseInt(i);u++)l+=o.replace(/\[\s*i\s*\]/g,"[ "+u+" ]").replace(/UNROLLED_LOOP_INDEX/g,u);return l}function ey(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}function qC(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===py?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===SE?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Ua&&(t="SHADOWMAP_TYPE_VSM"),t}function YC(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Mo:case Eo:t="ENVMAP_TYPE_CUBE";break;case ef:t="ENVMAP_TYPE_CUBE_UV";break}return t}function WC(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Eo:t="ENVMAP_MODE_REFRACTION";break}return t}function ZC(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case my:t="ENVMAP_BLENDING_MULTIPLY";break;case HE:t="ENVMAP_BLENDING_MIX";break;case GE:t="ENVMAP_BLENDING_ADD";break}return t}function KC(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const i=Math.log2(t)-2,o=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:o,maxMip:i}}function QC(s,t,i,o){const l=s.getContext(),u=i.defines;let d=i.vertexShader,h=i.fragmentShader;const p=qC(i),g=YC(i),x=WC(i),v=ZC(i),M=KC(i),S=BC(i),T=FC(u),C=l.createProgram();let E,y,O=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(E=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter(Dl).join(`
`),E.length>0&&(E+=`
`),y=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter(Dl).join(`
`),y.length>0&&(y+=`
`)):(E=[ey(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+x:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+p:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Dl).join(`
`),y=[ey(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+g:"",i.envMap?"#define "+x:"",i.envMap?"#define "+v:"",M?"#define CUBEUV_TEXEL_WIDTH "+M.texelWidth:"",M?"#define CUBEUV_TEXEL_HEIGHT "+M.texelHeight:"",M?"#define CUBEUV_MAX_MIP "+M.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor||i.batchingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+p:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==Ss?"#define TONE_MAPPING":"",i.toneMapping!==Ss?_t.tonemapping_pars_fragment:"",i.toneMapping!==Ss?PC("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",_t.colorspace_pars_fragment,zC("linearToOutputTexel",i.outputColorSpace),IC(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(Dl).join(`
`)),d=hm(d),d=Qx(d,i),d=Jx(d,i),h=hm(h),h=Qx(h,i),h=Jx(h,i),d=$x(d),h=$x(h),i.isRawShaderMaterial!==!0&&(O=`#version 300 es
`,E=[S,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+E,y=["#define varying in",i.glslVersion===ux?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===ux?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const P=O+E+d,U=O+y+h,F=Wx(l,l.VERTEX_SHADER,P),H=Wx(l,l.FRAGMENT_SHADER,U);l.attachShader(C,F),l.attachShader(C,H),i.index0AttributeName!==void 0?l.bindAttribLocation(C,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(C,0,"position"),l.linkProgram(C);function I(G){if(s.debug.checkShaderErrors){const ae=l.getProgramInfoLog(C)||"",de=l.getShaderInfoLog(F)||"",_e=l.getShaderInfoLog(H)||"",fe=ae.trim(),X=de.trim(),se=_e.trim();let Y=!0,xe=!0;if(l.getProgramParameter(C,l.LINK_STATUS)===!1)if(Y=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(l,C,F,H);else{const Me=Kx(l,F,"vertex"),ze=Kx(l,H,"fragment");console.error("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(C,l.VALIDATE_STATUS)+`

Material Name: `+G.name+`
Material Type: `+G.type+`

Program Info Log: `+fe+`
`+Me+`
`+ze)}else fe!==""?console.warn("THREE.WebGLProgram: Program Info Log:",fe):(X===""||se==="")&&(xe=!1);xe&&(G.diagnostics={runnable:Y,programLog:fe,vertexShader:{log:X,prefix:E},fragmentShader:{log:se,prefix:y}})}l.deleteShader(F),l.deleteShader(H),k=new ku(l,C),N=HC(l,C)}let k;this.getUniforms=function(){return k===void 0&&I(this),k};let N;this.getAttributes=function(){return N===void 0&&I(this),N};let w=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=l.getProgramParameter(C,DC)),w},this.destroy=function(){o.releaseStatesOfProgram(this),l.deleteProgram(C),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=UC++,this.cacheKey=t,this.usedTimes=1,this.program=C,this.vertexShader=F,this.fragmentShader=H,this}let JC=0;class $C{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const i=t.vertexShader,o=t.fragmentShader,l=this._getShaderStage(i),u=this._getShaderStage(o),d=this._getShaderCacheForMaterial(t);return d.has(l)===!1&&(d.add(l),l.usedTimes++),d.has(u)===!1&&(d.add(u),u.usedTimes++),this}remove(t){const i=this.materialCache.get(t);for(const o of i)o.usedTimes--,o.usedTimes===0&&this.shaderCache.delete(o.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const i=this.materialCache;let o=i.get(t);return o===void 0&&(o=new Set,i.set(t,o)),o}_getShaderStage(t){const i=this.shaderCache;let o=i.get(t);return o===void 0&&(o=new eR(t),i.set(t,o)),o}}class eR{constructor(t){this.id=JC++,this.code=t,this.usedTimes=0}}function tR(s,t,i,o,l,u,d){const h=new Py,p=new $C,g=new Set,x=[],v=l.logarithmicDepthBuffer,M=l.vertexTextures;let S=l.precision;const T={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function C(N){return g.add(N),N===0?"uv":`uv${N}`}function E(N,w,G,ae,de){const _e=ae.fog,fe=de.geometry,X=N.isMeshStandardMaterial?ae.environment:null,se=(N.isMeshStandardMaterial?i:t).get(N.envMap||X),Y=se&&se.mapping===ef?se.image.height:null,xe=T[N.type];N.precision!==null&&(S=l.getMaxPrecision(N.precision),S!==N.precision&&console.warn("THREE.WebGLProgram.getParameters:",N.precision,"not supported, using",S,"instead."));const Me=fe.morphAttributes.position||fe.morphAttributes.normal||fe.morphAttributes.color,ze=Me!==void 0?Me.length:0;let ot=0;fe.morphAttributes.position!==void 0&&(ot=1),fe.morphAttributes.normal!==void 0&&(ot=2),fe.morphAttributes.color!==void 0&&(ot=3);let ht,B,le,J;if(xe){const At=ra[xe];ht=At.vertexShader,B=At.fragmentShader}else ht=N.vertexShader,B=N.fragmentShader,p.update(N),le=p.getVertexShaderID(N),J=p.getFragmentShaderID(N);const ie=s.getRenderTarget(),Te=s.state.buffers.depth.getReversed(),De=de.isInstancedMesh===!0,Re=de.isBatchedMesh===!0,be=!!N.map,ce=!!N.matcap,D=!!se,lt=!!N.aoMap,tt=!!N.lightMap,$e=!!N.bumpMap,Pe=!!N.normalMap,at=!!N.displacementMap,me=!!N.emissiveMap,Oe=!!N.metalnessMap,Mt=!!N.roughnessMap,Ut=N.anisotropy>0,L=N.clearcoat>0,A=N.dispersion>0,ee=N.iridescence>0,he=N.sheen>0,Ee=N.transmission>0,pe=Ut&&!!N.anisotropyMap,je=L&&!!N.clearcoatMap,ye=L&&!!N.clearcoatNormalMap,ke=L&&!!N.clearcoatRoughnessMap,We=ee&&!!N.iridescenceMap,Ae=ee&&!!N.iridescenceThicknessMap,Be=he&&!!N.sheenColorMap,rt=he&&!!N.sheenRoughnessMap,qe=!!N.specularMap,Fe=!!N.specularColorMap,pt=!!N.specularIntensityMap,j=Ee&&!!N.transmissionMap,Ne=Ee&&!!N.thicknessMap,Le=!!N.gradientMap,Ye=!!N.alphaMap,Ce=N.alphaTest>0,Se=!!N.alphaHash,Je=!!N.extensions;let ft=Ss;N.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(ft=s.toneMapping);const qt={shaderID:xe,shaderType:N.type,shaderName:N.name,vertexShader:ht,fragmentShader:B,defines:N.defines,customVertexShaderID:le,customFragmentShaderID:J,isRawShaderMaterial:N.isRawShaderMaterial===!0,glslVersion:N.glslVersion,precision:S,batching:Re,batchingColor:Re&&de._colorsTexture!==null,instancing:De,instancingColor:De&&de.instanceColor!==null,instancingMorph:De&&de.morphTexture!==null,supportsVertexTextures:M,outputColorSpace:ie===null?s.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:To,alphaToCoverage:!!N.alphaToCoverage,map:be,matcap:ce,envMap:D,envMapMode:D&&se.mapping,envMapCubeUVHeight:Y,aoMap:lt,lightMap:tt,bumpMap:$e,normalMap:Pe,displacementMap:M&&at,emissiveMap:me,normalMapObjectSpace:Pe&&N.normalMapType===XE,normalMapTangentSpace:Pe&&N.normalMapType===Dy,metalnessMap:Oe,roughnessMap:Mt,anisotropy:Ut,anisotropyMap:pe,clearcoat:L,clearcoatMap:je,clearcoatNormalMap:ye,clearcoatRoughnessMap:ke,dispersion:A,iridescence:ee,iridescenceMap:We,iridescenceThicknessMap:Ae,sheen:he,sheenColorMap:Be,sheenRoughnessMap:rt,specularMap:qe,specularColorMap:Fe,specularIntensityMap:pt,transmission:Ee,transmissionMap:j,thicknessMap:Ne,gradientMap:Le,opaque:N.transparent===!1&&N.blending===go&&N.alphaToCoverage===!1,alphaMap:Ye,alphaTest:Ce,alphaHash:Se,combine:N.combine,mapUv:be&&C(N.map.channel),aoMapUv:lt&&C(N.aoMap.channel),lightMapUv:tt&&C(N.lightMap.channel),bumpMapUv:$e&&C(N.bumpMap.channel),normalMapUv:Pe&&C(N.normalMap.channel),displacementMapUv:at&&C(N.displacementMap.channel),emissiveMapUv:me&&C(N.emissiveMap.channel),metalnessMapUv:Oe&&C(N.metalnessMap.channel),roughnessMapUv:Mt&&C(N.roughnessMap.channel),anisotropyMapUv:pe&&C(N.anisotropyMap.channel),clearcoatMapUv:je&&C(N.clearcoatMap.channel),clearcoatNormalMapUv:ye&&C(N.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ke&&C(N.clearcoatRoughnessMap.channel),iridescenceMapUv:We&&C(N.iridescenceMap.channel),iridescenceThicknessMapUv:Ae&&C(N.iridescenceThicknessMap.channel),sheenColorMapUv:Be&&C(N.sheenColorMap.channel),sheenRoughnessMapUv:rt&&C(N.sheenRoughnessMap.channel),specularMapUv:qe&&C(N.specularMap.channel),specularColorMapUv:Fe&&C(N.specularColorMap.channel),specularIntensityMapUv:pt&&C(N.specularIntensityMap.channel),transmissionMapUv:j&&C(N.transmissionMap.channel),thicknessMapUv:Ne&&C(N.thicknessMap.channel),alphaMapUv:Ye&&C(N.alphaMap.channel),vertexTangents:!!fe.attributes.tangent&&(Pe||Ut),vertexColors:N.vertexColors,vertexAlphas:N.vertexColors===!0&&!!fe.attributes.color&&fe.attributes.color.itemSize===4,pointsUvs:de.isPoints===!0&&!!fe.attributes.uv&&(be||Ye),fog:!!_e,useFog:N.fog===!0,fogExp2:!!_e&&_e.isFogExp2,flatShading:N.flatShading===!0&&N.wireframe===!1,sizeAttenuation:N.sizeAttenuation===!0,logarithmicDepthBuffer:v,reversedDepthBuffer:Te,skinning:de.isSkinnedMesh===!0,morphTargets:fe.morphAttributes.position!==void 0,morphNormals:fe.morphAttributes.normal!==void 0,morphColors:fe.morphAttributes.color!==void 0,morphTargetsCount:ze,morphTextureStride:ot,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:d.numPlanes,numClipIntersection:d.numIntersection,dithering:N.dithering,shadowMapEnabled:s.shadowMap.enabled&&G.length>0,shadowMapType:s.shadowMap.type,toneMapping:ft,decodeVideoTexture:be&&N.map.isVideoTexture===!0&&Lt.getTransfer(N.map.colorSpace)===Xt,decodeVideoTextureEmissive:me&&N.emissiveMap.isVideoTexture===!0&&Lt.getTransfer(N.emissiveMap.colorSpace)===Xt,premultipliedAlpha:N.premultipliedAlpha,doubleSided:N.side===oa,flipSided:N.side===ti,useDepthPacking:N.depthPacking>=0,depthPacking:N.depthPacking||0,index0AttributeName:N.index0AttributeName,extensionClipCullDistance:Je&&N.extensions.clipCullDistance===!0&&o.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Je&&N.extensions.multiDraw===!0||Re)&&o.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:o.has("KHR_parallel_shader_compile"),customProgramCacheKey:N.customProgramCacheKey()};return qt.vertexUv1s=g.has(1),qt.vertexUv2s=g.has(2),qt.vertexUv3s=g.has(3),g.clear(),qt}function y(N){const w=[];if(N.shaderID?w.push(N.shaderID):(w.push(N.customVertexShaderID),w.push(N.customFragmentShaderID)),N.defines!==void 0)for(const G in N.defines)w.push(G),w.push(N.defines[G]);return N.isRawShaderMaterial===!1&&(O(w,N),P(w,N),w.push(s.outputColorSpace)),w.push(N.customProgramCacheKey),w.join()}function O(N,w){N.push(w.precision),N.push(w.outputColorSpace),N.push(w.envMapMode),N.push(w.envMapCubeUVHeight),N.push(w.mapUv),N.push(w.alphaMapUv),N.push(w.lightMapUv),N.push(w.aoMapUv),N.push(w.bumpMapUv),N.push(w.normalMapUv),N.push(w.displacementMapUv),N.push(w.emissiveMapUv),N.push(w.metalnessMapUv),N.push(w.roughnessMapUv),N.push(w.anisotropyMapUv),N.push(w.clearcoatMapUv),N.push(w.clearcoatNormalMapUv),N.push(w.clearcoatRoughnessMapUv),N.push(w.iridescenceMapUv),N.push(w.iridescenceThicknessMapUv),N.push(w.sheenColorMapUv),N.push(w.sheenRoughnessMapUv),N.push(w.specularMapUv),N.push(w.specularColorMapUv),N.push(w.specularIntensityMapUv),N.push(w.transmissionMapUv),N.push(w.thicknessMapUv),N.push(w.combine),N.push(w.fogExp2),N.push(w.sizeAttenuation),N.push(w.morphTargetsCount),N.push(w.morphAttributeCount),N.push(w.numDirLights),N.push(w.numPointLights),N.push(w.numSpotLights),N.push(w.numSpotLightMaps),N.push(w.numHemiLights),N.push(w.numRectAreaLights),N.push(w.numDirLightShadows),N.push(w.numPointLightShadows),N.push(w.numSpotLightShadows),N.push(w.numSpotLightShadowsWithMaps),N.push(w.numLightProbes),N.push(w.shadowMapType),N.push(w.toneMapping),N.push(w.numClippingPlanes),N.push(w.numClipIntersection),N.push(w.depthPacking)}function P(N,w){h.disableAll(),w.supportsVertexTextures&&h.enable(0),w.instancing&&h.enable(1),w.instancingColor&&h.enable(2),w.instancingMorph&&h.enable(3),w.matcap&&h.enable(4),w.envMap&&h.enable(5),w.normalMapObjectSpace&&h.enable(6),w.normalMapTangentSpace&&h.enable(7),w.clearcoat&&h.enable(8),w.iridescence&&h.enable(9),w.alphaTest&&h.enable(10),w.vertexColors&&h.enable(11),w.vertexAlphas&&h.enable(12),w.vertexUv1s&&h.enable(13),w.vertexUv2s&&h.enable(14),w.vertexUv3s&&h.enable(15),w.vertexTangents&&h.enable(16),w.anisotropy&&h.enable(17),w.alphaHash&&h.enable(18),w.batching&&h.enable(19),w.dispersion&&h.enable(20),w.batchingColor&&h.enable(21),w.gradientMap&&h.enable(22),N.push(h.mask),h.disableAll(),w.fog&&h.enable(0),w.useFog&&h.enable(1),w.flatShading&&h.enable(2),w.logarithmicDepthBuffer&&h.enable(3),w.reversedDepthBuffer&&h.enable(4),w.skinning&&h.enable(5),w.morphTargets&&h.enable(6),w.morphNormals&&h.enable(7),w.morphColors&&h.enable(8),w.premultipliedAlpha&&h.enable(9),w.shadowMapEnabled&&h.enable(10),w.doubleSided&&h.enable(11),w.flipSided&&h.enable(12),w.useDepthPacking&&h.enable(13),w.dithering&&h.enable(14),w.transmission&&h.enable(15),w.sheen&&h.enable(16),w.opaque&&h.enable(17),w.pointsUvs&&h.enable(18),w.decodeVideoTexture&&h.enable(19),w.decodeVideoTextureEmissive&&h.enable(20),w.alphaToCoverage&&h.enable(21),N.push(h.mask)}function U(N){const w=T[N.type];let G;if(w){const ae=ra[w];G=Fl.clone(ae.uniforms)}else G=N.uniforms;return G}function F(N,w){let G;for(let ae=0,de=x.length;ae<de;ae++){const _e=x[ae];if(_e.cacheKey===w){G=_e,++G.usedTimes;break}}return G===void 0&&(G=new QC(s,w,N,u),x.push(G)),G}function H(N){if(--N.usedTimes===0){const w=x.indexOf(N);x[w]=x[x.length-1],x.pop(),N.destroy()}}function I(N){p.remove(N)}function k(){p.dispose()}return{getParameters:E,getProgramCacheKey:y,getUniforms:U,acquireProgram:F,releaseProgram:H,releaseShaderCache:I,programs:x,dispose:k}}function nR(){let s=new WeakMap;function t(d){return s.has(d)}function i(d){let h=s.get(d);return h===void 0&&(h={},s.set(d,h)),h}function o(d){s.delete(d)}function l(d,h,p){s.get(d)[h]=p}function u(){s=new WeakMap}return{has:t,get:i,remove:o,update:l,dispose:u}}function iR(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function ty(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function ny(){const s=[];let t=0;const i=[],o=[],l=[];function u(){t=0,i.length=0,o.length=0,l.length=0}function d(v,M,S,T,C,E){let y=s[t];return y===void 0?(y={id:v.id,object:v,geometry:M,material:S,groupOrder:T,renderOrder:v.renderOrder,z:C,group:E},s[t]=y):(y.id=v.id,y.object=v,y.geometry=M,y.material=S,y.groupOrder=T,y.renderOrder=v.renderOrder,y.z=C,y.group=E),t++,y}function h(v,M,S,T,C,E){const y=d(v,M,S,T,C,E);S.transmission>0?o.push(y):S.transparent===!0?l.push(y):i.push(y)}function p(v,M,S,T,C,E){const y=d(v,M,S,T,C,E);S.transmission>0?o.unshift(y):S.transparent===!0?l.unshift(y):i.unshift(y)}function g(v,M){i.length>1&&i.sort(v||iR),o.length>1&&o.sort(M||ty),l.length>1&&l.sort(M||ty)}function x(){for(let v=t,M=s.length;v<M;v++){const S=s[v];if(S.id===null)break;S.id=null,S.object=null,S.geometry=null,S.material=null,S.group=null}}return{opaque:i,transmissive:o,transparent:l,init:u,push:h,unshift:p,finish:x,sort:g}}function aR(){let s=new WeakMap;function t(o,l){const u=s.get(o);let d;return u===void 0?(d=new ny,s.set(o,[d])):l>=u.length?(d=new ny,u.push(d)):d=u[l],d}function i(){s=new WeakMap}return{get:t,dispose:i}}function sR(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let i;switch(t.type){case"DirectionalLight":i={direction:new te,color:new wt};break;case"SpotLight":i={position:new te,direction:new te,color:new wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new te,color:new wt,distance:0,decay:0};break;case"HemisphereLight":i={direction:new te,skyColor:new wt,groundColor:new wt};break;case"RectAreaLight":i={color:new wt,position:new te,halfWidth:new te,halfHeight:new te};break}return s[t.id]=i,i}}}function rR(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let i;switch(t.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=i,i}}}let oR=0;function lR(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function cR(s){const t=new sR,i=rR(),o={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let g=0;g<9;g++)o.probe.push(new te);const l=new te,u=new an,d=new an;function h(g){let x=0,v=0,M=0;for(let N=0;N<9;N++)o.probe[N].set(0,0,0);let S=0,T=0,C=0,E=0,y=0,O=0,P=0,U=0,F=0,H=0,I=0;g.sort(lR);for(let N=0,w=g.length;N<w;N++){const G=g[N],ae=G.color,de=G.intensity,_e=G.distance,fe=G.shadow&&G.shadow.map?G.shadow.map.texture:null;if(G.isAmbientLight)x+=ae.r*de,v+=ae.g*de,M+=ae.b*de;else if(G.isLightProbe){for(let X=0;X<9;X++)o.probe[X].addScaledVector(G.sh.coefficients[X],de);I++}else if(G.isDirectionalLight){const X=t.get(G);if(X.color.copy(G.color).multiplyScalar(G.intensity),G.castShadow){const se=G.shadow,Y=i.get(G);Y.shadowIntensity=se.intensity,Y.shadowBias=se.bias,Y.shadowNormalBias=se.normalBias,Y.shadowRadius=se.radius,Y.shadowMapSize=se.mapSize,o.directionalShadow[S]=Y,o.directionalShadowMap[S]=fe,o.directionalShadowMatrix[S]=G.shadow.matrix,O++}o.directional[S]=X,S++}else if(G.isSpotLight){const X=t.get(G);X.position.setFromMatrixPosition(G.matrixWorld),X.color.copy(ae).multiplyScalar(de),X.distance=_e,X.coneCos=Math.cos(G.angle),X.penumbraCos=Math.cos(G.angle*(1-G.penumbra)),X.decay=G.decay,o.spot[C]=X;const se=G.shadow;if(G.map&&(o.spotLightMap[F]=G.map,F++,se.updateMatrices(G),G.castShadow&&H++),o.spotLightMatrix[C]=se.matrix,G.castShadow){const Y=i.get(G);Y.shadowIntensity=se.intensity,Y.shadowBias=se.bias,Y.shadowNormalBias=se.normalBias,Y.shadowRadius=se.radius,Y.shadowMapSize=se.mapSize,o.spotShadow[C]=Y,o.spotShadowMap[C]=fe,U++}C++}else if(G.isRectAreaLight){const X=t.get(G);X.color.copy(ae).multiplyScalar(de),X.halfWidth.set(G.width*.5,0,0),X.halfHeight.set(0,G.height*.5,0),o.rectArea[E]=X,E++}else if(G.isPointLight){const X=t.get(G);if(X.color.copy(G.color).multiplyScalar(G.intensity),X.distance=G.distance,X.decay=G.decay,G.castShadow){const se=G.shadow,Y=i.get(G);Y.shadowIntensity=se.intensity,Y.shadowBias=se.bias,Y.shadowNormalBias=se.normalBias,Y.shadowRadius=se.radius,Y.shadowMapSize=se.mapSize,Y.shadowCameraNear=se.camera.near,Y.shadowCameraFar=se.camera.far,o.pointShadow[T]=Y,o.pointShadowMap[T]=fe,o.pointShadowMatrix[T]=G.shadow.matrix,P++}o.point[T]=X,T++}else if(G.isHemisphereLight){const X=t.get(G);X.skyColor.copy(G.color).multiplyScalar(de),X.groundColor.copy(G.groundColor).multiplyScalar(de),o.hemi[y]=X,y++}}E>0&&(s.has("OES_texture_float_linear")===!0?(o.rectAreaLTC1=Ge.LTC_FLOAT_1,o.rectAreaLTC2=Ge.LTC_FLOAT_2):(o.rectAreaLTC1=Ge.LTC_HALF_1,o.rectAreaLTC2=Ge.LTC_HALF_2)),o.ambient[0]=x,o.ambient[1]=v,o.ambient[2]=M;const k=o.hash;(k.directionalLength!==S||k.pointLength!==T||k.spotLength!==C||k.rectAreaLength!==E||k.hemiLength!==y||k.numDirectionalShadows!==O||k.numPointShadows!==P||k.numSpotShadows!==U||k.numSpotMaps!==F||k.numLightProbes!==I)&&(o.directional.length=S,o.spot.length=C,o.rectArea.length=E,o.point.length=T,o.hemi.length=y,o.directionalShadow.length=O,o.directionalShadowMap.length=O,o.pointShadow.length=P,o.pointShadowMap.length=P,o.spotShadow.length=U,o.spotShadowMap.length=U,o.directionalShadowMatrix.length=O,o.pointShadowMatrix.length=P,o.spotLightMatrix.length=U+F-H,o.spotLightMap.length=F,o.numSpotLightShadowsWithMaps=H,o.numLightProbes=I,k.directionalLength=S,k.pointLength=T,k.spotLength=C,k.rectAreaLength=E,k.hemiLength=y,k.numDirectionalShadows=O,k.numPointShadows=P,k.numSpotShadows=U,k.numSpotMaps=F,k.numLightProbes=I,o.version=oR++)}function p(g,x){let v=0,M=0,S=0,T=0,C=0;const E=x.matrixWorldInverse;for(let y=0,O=g.length;y<O;y++){const P=g[y];if(P.isDirectionalLight){const U=o.directional[v];U.direction.setFromMatrixPosition(P.matrixWorld),l.setFromMatrixPosition(P.target.matrixWorld),U.direction.sub(l),U.direction.transformDirection(E),v++}else if(P.isSpotLight){const U=o.spot[S];U.position.setFromMatrixPosition(P.matrixWorld),U.position.applyMatrix4(E),U.direction.setFromMatrixPosition(P.matrixWorld),l.setFromMatrixPosition(P.target.matrixWorld),U.direction.sub(l),U.direction.transformDirection(E),S++}else if(P.isRectAreaLight){const U=o.rectArea[T];U.position.setFromMatrixPosition(P.matrixWorld),U.position.applyMatrix4(E),d.identity(),u.copy(P.matrixWorld),u.premultiply(E),d.extractRotation(u),U.halfWidth.set(P.width*.5,0,0),U.halfHeight.set(0,P.height*.5,0),U.halfWidth.applyMatrix4(d),U.halfHeight.applyMatrix4(d),T++}else if(P.isPointLight){const U=o.point[M];U.position.setFromMatrixPosition(P.matrixWorld),U.position.applyMatrix4(E),M++}else if(P.isHemisphereLight){const U=o.hemi[C];U.direction.setFromMatrixPosition(P.matrixWorld),U.direction.transformDirection(E),C++}}}return{setup:h,setupView:p,state:o}}function iy(s){const t=new cR(s),i=[],o=[];function l(x){g.camera=x,i.length=0,o.length=0}function u(x){i.push(x)}function d(x){o.push(x)}function h(){t.setup(i)}function p(x){t.setupView(i,x)}const g={lightsArray:i,shadowsArray:o,camera:null,lights:t,transmissionRenderTarget:{}};return{init:l,state:g,setupLights:h,setupLightsView:p,pushLight:u,pushShadow:d}}function uR(s){let t=new WeakMap;function i(l,u=0){const d=t.get(l);let h;return d===void 0?(h=new iy(s),t.set(l,[h])):u>=d.length?(h=new iy(s),d.push(h)):h=d[u],h}function o(){t=new WeakMap}return{get:i,dispose:o}}const fR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,dR=`uniform sampler2D shadow_pass;
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
}`;function hR(s,t,i){let o=new Lm;const l=new dt,u=new dt,d=new Wt,h=new DT({depthPacking:kE}),p=new UT,g={},x=i.maxTextureSize,v={[Es]:ti,[ti]:Es,[oa]:oa},M=new qn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new dt},radius:{value:4}},vertexShader:fR,fragmentShader:dR}),S=M.clone();S.defines.HORIZONTAL_PASS=1;const T=new Yi;T.setAttribute("position",new qi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const C=new pi(T,M),E=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=py;let y=this.type;this.render=function(H,I,k){if(E.enabled===!1||E.autoUpdate===!1&&E.needsUpdate===!1||H.length===0)return;const N=s.getRenderTarget(),w=s.getActiveCubeFace(),G=s.getActiveMipmapLevel(),ae=s.state;ae.setBlending(Oa),ae.buffers.depth.getReversed()===!0?ae.buffers.color.setClear(0,0,0,0):ae.buffers.color.setClear(1,1,1,1),ae.buffers.depth.setTest(!0),ae.setScissorTest(!1);const de=y!==Ua&&this.type===Ua,_e=y===Ua&&this.type!==Ua;for(let fe=0,X=H.length;fe<X;fe++){const se=H[fe],Y=se.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",se,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;l.copy(Y.mapSize);const xe=Y.getFrameExtents();if(l.multiply(xe),u.copy(Y.mapSize),(l.x>x||l.y>x)&&(l.x>x&&(u.x=Math.floor(x/xe.x),l.x=u.x*xe.x,Y.mapSize.x=u.x),l.y>x&&(u.y=Math.floor(x/xe.y),l.y=u.y*xe.y,Y.mapSize.y=u.y)),Y.map===null||de===!0||_e===!0){const ze=this.type!==Ua?{minFilter:Di,magFilter:Di}:{};Y.map!==null&&Y.map.dispose(),Y.map=new Xi(l.x,l.y,ze),Y.map.texture.name=se.name+".shadowMap",Y.camera.updateProjectionMatrix()}s.setRenderTarget(Y.map),s.clear();const Me=Y.getViewportCount();for(let ze=0;ze<Me;ze++){const ot=Y.getViewport(ze);d.set(u.x*ot.x,u.y*ot.y,u.x*ot.z,u.y*ot.w),ae.viewport(d),Y.updateMatrices(se,ze),o=Y.getFrustum(),U(I,k,Y.camera,se,this.type)}Y.isPointLightShadow!==!0&&this.type===Ua&&O(Y,k),Y.needsUpdate=!1}y=this.type,E.needsUpdate=!1,s.setRenderTarget(N,w,G)};function O(H,I){const k=t.update(C);M.defines.VSM_SAMPLES!==H.blurSamples&&(M.defines.VSM_SAMPLES=H.blurSamples,S.defines.VSM_SAMPLES=H.blurSamples,M.needsUpdate=!0,S.needsUpdate=!0),H.mapPass===null&&(H.mapPass=new Xi(l.x,l.y)),M.uniforms.shadow_pass.value=H.map.texture,M.uniforms.resolution.value=H.mapSize,M.uniforms.radius.value=H.radius,s.setRenderTarget(H.mapPass),s.clear(),s.renderBufferDirect(I,null,k,M,C,null),S.uniforms.shadow_pass.value=H.mapPass.texture,S.uniforms.resolution.value=H.mapSize,S.uniforms.radius.value=H.radius,s.setRenderTarget(H.map),s.clear(),s.renderBufferDirect(I,null,k,S,C,null)}function P(H,I,k,N){let w=null;const G=k.isPointLight===!0?H.customDistanceMaterial:H.customDepthMaterial;if(G!==void 0)w=G;else if(w=k.isPointLight===!0?p:h,s.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0||I.alphaToCoverage===!0){const ae=w.uuid,de=I.uuid;let _e=g[ae];_e===void 0&&(_e={},g[ae]=_e);let fe=_e[de];fe===void 0&&(fe=w.clone(),_e[de]=fe,I.addEventListener("dispose",F)),w=fe}if(w.visible=I.visible,w.wireframe=I.wireframe,N===Ua?w.side=I.shadowSide!==null?I.shadowSide:I.side:w.side=I.shadowSide!==null?I.shadowSide:v[I.side],w.alphaMap=I.alphaMap,w.alphaTest=I.alphaToCoverage===!0?.5:I.alphaTest,w.map=I.map,w.clipShadows=I.clipShadows,w.clippingPlanes=I.clippingPlanes,w.clipIntersection=I.clipIntersection,w.displacementMap=I.displacementMap,w.displacementScale=I.displacementScale,w.displacementBias=I.displacementBias,w.wireframeLinewidth=I.wireframeLinewidth,w.linewidth=I.linewidth,k.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const ae=s.properties.get(w);ae.light=k}return w}function U(H,I,k,N,w){if(H.visible===!1)return;if(H.layers.test(I.layers)&&(H.isMesh||H.isLine||H.isPoints)&&(H.castShadow||H.receiveShadow&&w===Ua)&&(!H.frustumCulled||o.intersectsObject(H))){H.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,H.matrixWorld);const de=t.update(H),_e=H.material;if(Array.isArray(_e)){const fe=de.groups;for(let X=0,se=fe.length;X<se;X++){const Y=fe[X],xe=_e[Y.materialIndex];if(xe&&xe.visible){const Me=P(H,xe,N,w);H.onBeforeShadow(s,H,I,k,de,Me,Y),s.renderBufferDirect(k,null,de,Me,H,Y),H.onAfterShadow(s,H,I,k,de,Me,Y)}}}else if(_e.visible){const fe=P(H,_e,N,w);H.onBeforeShadow(s,H,I,k,de,fe,null),s.renderBufferDirect(k,null,de,fe,H,null),H.onAfterShadow(s,H,I,k,de,fe,null)}}const ae=H.children;for(let de=0,_e=ae.length;de<_e;de++)U(ae[de],I,k,N,w)}function F(H){H.target.removeEventListener("dispose",F);for(const k in g){const N=g[k],w=H.target.uuid;w in N&&(N[w].dispose(),delete N[w])}}}const pR={[Ap]:Cp,[Rp]:Dp,[wp]:Up,[So]:Np,[Cp]:Ap,[Dp]:Rp,[Up]:wp,[Np]:So};function mR(s,t){function i(){let j=!1;const Ne=new Wt;let Le=null;const Ye=new Wt(0,0,0,0);return{setMask:function(Ce){Le!==Ce&&!j&&(s.colorMask(Ce,Ce,Ce,Ce),Le=Ce)},setLocked:function(Ce){j=Ce},setClear:function(Ce,Se,Je,ft,qt){qt===!0&&(Ce*=ft,Se*=ft,Je*=ft),Ne.set(Ce,Se,Je,ft),Ye.equals(Ne)===!1&&(s.clearColor(Ce,Se,Je,ft),Ye.copy(Ne))},reset:function(){j=!1,Le=null,Ye.set(-1,0,0,0)}}}function o(){let j=!1,Ne=!1,Le=null,Ye=null,Ce=null;return{setReversed:function(Se){if(Ne!==Se){const Je=t.get("EXT_clip_control");Se?Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.ZERO_TO_ONE_EXT):Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.NEGATIVE_ONE_TO_ONE_EXT),Ne=Se;const ft=Ce;Ce=null,this.setClear(ft)}},getReversed:function(){return Ne},setTest:function(Se){Se?ie(s.DEPTH_TEST):Te(s.DEPTH_TEST)},setMask:function(Se){Le!==Se&&!j&&(s.depthMask(Se),Le=Se)},setFunc:function(Se){if(Ne&&(Se=pR[Se]),Ye!==Se){switch(Se){case Ap:s.depthFunc(s.NEVER);break;case Cp:s.depthFunc(s.ALWAYS);break;case Rp:s.depthFunc(s.LESS);break;case So:s.depthFunc(s.LEQUAL);break;case wp:s.depthFunc(s.EQUAL);break;case Np:s.depthFunc(s.GEQUAL);break;case Dp:s.depthFunc(s.GREATER);break;case Up:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Ye=Se}},setLocked:function(Se){j=Se},setClear:function(Se){Ce!==Se&&(Ne&&(Se=1-Se),s.clearDepth(Se),Ce=Se)},reset:function(){j=!1,Le=null,Ye=null,Ce=null,Ne=!1}}}function l(){let j=!1,Ne=null,Le=null,Ye=null,Ce=null,Se=null,Je=null,ft=null,qt=null;return{setTest:function(At){j||(At?ie(s.STENCIL_TEST):Te(s.STENCIL_TEST))},setMask:function(At){Ne!==At&&!j&&(s.stencilMask(At),Ne=At)},setFunc:function(At,tn,_n){(Le!==At||Ye!==tn||Ce!==_n)&&(s.stencilFunc(At,tn,_n),Le=At,Ye=tn,Ce=_n)},setOp:function(At,tn,_n){(Se!==At||Je!==tn||ft!==_n)&&(s.stencilOp(At,tn,_n),Se=At,Je=tn,ft=_n)},setLocked:function(At){j=At},setClear:function(At){qt!==At&&(s.clearStencil(At),qt=At)},reset:function(){j=!1,Ne=null,Le=null,Ye=null,Ce=null,Se=null,Je=null,ft=null,qt=null}}}const u=new i,d=new o,h=new l,p=new WeakMap,g=new WeakMap;let x={},v={},M=new WeakMap,S=[],T=null,C=!1,E=null,y=null,O=null,P=null,U=null,F=null,H=null,I=new wt(0,0,0),k=0,N=!1,w=null,G=null,ae=null,de=null,_e=null;const fe=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,se=0;const Y=s.getParameter(s.VERSION);Y.indexOf("WebGL")!==-1?(se=parseFloat(/^WebGL (\d)/.exec(Y)[1]),X=se>=1):Y.indexOf("OpenGL ES")!==-1&&(se=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),X=se>=2);let xe=null,Me={};const ze=s.getParameter(s.SCISSOR_BOX),ot=s.getParameter(s.VIEWPORT),ht=new Wt().fromArray(ze),B=new Wt().fromArray(ot);function le(j,Ne,Le,Ye){const Ce=new Uint8Array(4),Se=s.createTexture();s.bindTexture(j,Se),s.texParameteri(j,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(j,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Je=0;Je<Le;Je++)j===s.TEXTURE_3D||j===s.TEXTURE_2D_ARRAY?s.texImage3D(Ne,0,s.RGBA,1,1,Ye,0,s.RGBA,s.UNSIGNED_BYTE,Ce):s.texImage2D(Ne+Je,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Ce);return Se}const J={};J[s.TEXTURE_2D]=le(s.TEXTURE_2D,s.TEXTURE_2D,1),J[s.TEXTURE_CUBE_MAP]=le(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[s.TEXTURE_2D_ARRAY]=le(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),J[s.TEXTURE_3D]=le(s.TEXTURE_3D,s.TEXTURE_3D,1,1),u.setClear(0,0,0,1),d.setClear(1),h.setClear(0),ie(s.DEPTH_TEST),d.setFunc(So),$e(!1),Pe(sx),ie(s.CULL_FACE),lt(Oa);function ie(j){x[j]!==!0&&(s.enable(j),x[j]=!0)}function Te(j){x[j]!==!1&&(s.disable(j),x[j]=!1)}function De(j,Ne){return v[j]!==Ne?(s.bindFramebuffer(j,Ne),v[j]=Ne,j===s.DRAW_FRAMEBUFFER&&(v[s.FRAMEBUFFER]=Ne),j===s.FRAMEBUFFER&&(v[s.DRAW_FRAMEBUFFER]=Ne),!0):!1}function Re(j,Ne){let Le=S,Ye=!1;if(j){Le=M.get(Ne),Le===void 0&&(Le=[],M.set(Ne,Le));const Ce=j.textures;if(Le.length!==Ce.length||Le[0]!==s.COLOR_ATTACHMENT0){for(let Se=0,Je=Ce.length;Se<Je;Se++)Le[Se]=s.COLOR_ATTACHMENT0+Se;Le.length=Ce.length,Ye=!0}}else Le[0]!==s.BACK&&(Le[0]=s.BACK,Ye=!0);Ye&&s.drawBuffers(Le)}function be(j){return T!==j?(s.useProgram(j),T=j,!0):!1}const ce={[ar]:s.FUNC_ADD,[EE]:s.FUNC_SUBTRACT,[TE]:s.FUNC_REVERSE_SUBTRACT};ce[bE]=s.MIN,ce[AE]=s.MAX;const D={[CE]:s.ZERO,[RE]:s.ONE,[wE]:s.SRC_COLOR,[Tp]:s.SRC_ALPHA,[zE]:s.SRC_ALPHA_SATURATE,[LE]:s.DST_COLOR,[DE]:s.DST_ALPHA,[NE]:s.ONE_MINUS_SRC_COLOR,[bp]:s.ONE_MINUS_SRC_ALPHA,[OE]:s.ONE_MINUS_DST_COLOR,[UE]:s.ONE_MINUS_DST_ALPHA,[PE]:s.CONSTANT_COLOR,[IE]:s.ONE_MINUS_CONSTANT_COLOR,[BE]:s.CONSTANT_ALPHA,[FE]:s.ONE_MINUS_CONSTANT_ALPHA};function lt(j,Ne,Le,Ye,Ce,Se,Je,ft,qt,At){if(j===Oa){C===!0&&(Te(s.BLEND),C=!1);return}if(C===!1&&(ie(s.BLEND),C=!0),j!==ME){if(j!==E||At!==N){if((y!==ar||U!==ar)&&(s.blendEquation(s.FUNC_ADD),y=ar,U=ar),At)switch(j){case go:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ep:s.blendFunc(s.ONE,s.ONE);break;case rx:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ox:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}else switch(j){case go:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ep:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case rx:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ox:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}O=null,P=null,F=null,H=null,I.set(0,0,0),k=0,E=j,N=At}return}Ce=Ce||Ne,Se=Se||Le,Je=Je||Ye,(Ne!==y||Ce!==U)&&(s.blendEquationSeparate(ce[Ne],ce[Ce]),y=Ne,U=Ce),(Le!==O||Ye!==P||Se!==F||Je!==H)&&(s.blendFuncSeparate(D[Le],D[Ye],D[Se],D[Je]),O=Le,P=Ye,F=Se,H=Je),(ft.equals(I)===!1||qt!==k)&&(s.blendColor(ft.r,ft.g,ft.b,qt),I.copy(ft),k=qt),E=j,N=!1}function tt(j,Ne){j.side===oa?Te(s.CULL_FACE):ie(s.CULL_FACE);let Le=j.side===ti;Ne&&(Le=!Le),$e(Le),j.blending===go&&j.transparent===!1?lt(Oa):lt(j.blending,j.blendEquation,j.blendSrc,j.blendDst,j.blendEquationAlpha,j.blendSrcAlpha,j.blendDstAlpha,j.blendColor,j.blendAlpha,j.premultipliedAlpha),d.setFunc(j.depthFunc),d.setTest(j.depthTest),d.setMask(j.depthWrite),u.setMask(j.colorWrite);const Ye=j.stencilWrite;h.setTest(Ye),Ye&&(h.setMask(j.stencilWriteMask),h.setFunc(j.stencilFunc,j.stencilRef,j.stencilFuncMask),h.setOp(j.stencilFail,j.stencilZFail,j.stencilZPass)),me(j.polygonOffset,j.polygonOffsetFactor,j.polygonOffsetUnits),j.alphaToCoverage===!0?ie(s.SAMPLE_ALPHA_TO_COVERAGE):Te(s.SAMPLE_ALPHA_TO_COVERAGE)}function $e(j){w!==j&&(j?s.frontFace(s.CW):s.frontFace(s.CCW),w=j)}function Pe(j){j!==xE?(ie(s.CULL_FACE),j!==G&&(j===sx?s.cullFace(s.BACK):j===yE?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Te(s.CULL_FACE),G=j}function at(j){j!==ae&&(X&&s.lineWidth(j),ae=j)}function me(j,Ne,Le){j?(ie(s.POLYGON_OFFSET_FILL),(de!==Ne||_e!==Le)&&(s.polygonOffset(Ne,Le),de=Ne,_e=Le)):Te(s.POLYGON_OFFSET_FILL)}function Oe(j){j?ie(s.SCISSOR_TEST):Te(s.SCISSOR_TEST)}function Mt(j){j===void 0&&(j=s.TEXTURE0+fe-1),xe!==j&&(s.activeTexture(j),xe=j)}function Ut(j,Ne,Le){Le===void 0&&(xe===null?Le=s.TEXTURE0+fe-1:Le=xe);let Ye=Me[Le];Ye===void 0&&(Ye={type:void 0,texture:void 0},Me[Le]=Ye),(Ye.type!==j||Ye.texture!==Ne)&&(xe!==Le&&(s.activeTexture(Le),xe=Le),s.bindTexture(j,Ne||J[j]),Ye.type=j,Ye.texture=Ne)}function L(){const j=Me[xe];j!==void 0&&j.type!==void 0&&(s.bindTexture(j.type,null),j.type=void 0,j.texture=void 0)}function A(){try{s.compressedTexImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ee(){try{s.compressedTexImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function he(){try{s.texSubImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ee(){try{s.texSubImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function pe(){try{s.compressedTexSubImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function je(){try{s.compressedTexSubImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ye(){try{s.texStorage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ke(){try{s.texStorage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function We(){try{s.texImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ae(){try{s.texImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Be(j){ht.equals(j)===!1&&(s.scissor(j.x,j.y,j.z,j.w),ht.copy(j))}function rt(j){B.equals(j)===!1&&(s.viewport(j.x,j.y,j.z,j.w),B.copy(j))}function qe(j,Ne){let Le=g.get(Ne);Le===void 0&&(Le=new WeakMap,g.set(Ne,Le));let Ye=Le.get(j);Ye===void 0&&(Ye=s.getUniformBlockIndex(Ne,j.name),Le.set(j,Ye))}function Fe(j,Ne){const Ye=g.get(Ne).get(j);p.get(Ne)!==Ye&&(s.uniformBlockBinding(Ne,Ye,j.__bindingPointIndex),p.set(Ne,Ye))}function pt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),d.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),x={},xe=null,Me={},v={},M=new WeakMap,S=[],T=null,C=!1,E=null,y=null,O=null,P=null,U=null,F=null,H=null,I=new wt(0,0,0),k=0,N=!1,w=null,G=null,ae=null,de=null,_e=null,ht.set(0,0,s.canvas.width,s.canvas.height),B.set(0,0,s.canvas.width,s.canvas.height),u.reset(),d.reset(),h.reset()}return{buffers:{color:u,depth:d,stencil:h},enable:ie,disable:Te,bindFramebuffer:De,drawBuffers:Re,useProgram:be,setBlending:lt,setMaterial:tt,setFlipSided:$e,setCullFace:Pe,setLineWidth:at,setPolygonOffset:me,setScissorTest:Oe,activeTexture:Mt,bindTexture:Ut,unbindTexture:L,compressedTexImage2D:A,compressedTexImage3D:ee,texImage2D:We,texImage3D:Ae,updateUBOMapping:qe,uniformBlockBinding:Fe,texStorage2D:ye,texStorage3D:ke,texSubImage2D:he,texSubImage3D:Ee,compressedTexSubImage2D:pe,compressedTexSubImage3D:je,scissor:Be,viewport:rt,reset:pt}}function gR(s,t,i,o,l,u,d){const h=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),g=new dt,x=new WeakMap;let v;const M=new WeakMap;let S=!1;try{S=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function T(L,A){return S?new OffscreenCanvas(L,A):Il("canvas")}function C(L,A,ee){let he=1;const Ee=Ut(L);if((Ee.width>ee||Ee.height>ee)&&(he=ee/Math.max(Ee.width,Ee.height)),he<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const pe=Math.floor(he*Ee.width),je=Math.floor(he*Ee.height);v===void 0&&(v=T(pe,je));const ye=A?T(pe,je):v;return ye.width=pe,ye.height=je,ye.getContext("2d").drawImage(L,0,0,pe,je),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Ee.width+"x"+Ee.height+") to ("+pe+"x"+je+")."),ye}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Ee.width+"x"+Ee.height+")."),L;return L}function E(L){return L.generateMipmaps}function y(L){s.generateMipmap(L)}function O(L){return L.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?s.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function P(L,A,ee,he,Ee=!1){if(L!==null){if(s[L]!==void 0)return s[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let pe=A;if(A===s.RED&&(ee===s.FLOAT&&(pe=s.R32F),ee===s.HALF_FLOAT&&(pe=s.R16F),ee===s.UNSIGNED_BYTE&&(pe=s.R8)),A===s.RED_INTEGER&&(ee===s.UNSIGNED_BYTE&&(pe=s.R8UI),ee===s.UNSIGNED_SHORT&&(pe=s.R16UI),ee===s.UNSIGNED_INT&&(pe=s.R32UI),ee===s.BYTE&&(pe=s.R8I),ee===s.SHORT&&(pe=s.R16I),ee===s.INT&&(pe=s.R32I)),A===s.RG&&(ee===s.FLOAT&&(pe=s.RG32F),ee===s.HALF_FLOAT&&(pe=s.RG16F),ee===s.UNSIGNED_BYTE&&(pe=s.RG8)),A===s.RG_INTEGER&&(ee===s.UNSIGNED_BYTE&&(pe=s.RG8UI),ee===s.UNSIGNED_SHORT&&(pe=s.RG16UI),ee===s.UNSIGNED_INT&&(pe=s.RG32UI),ee===s.BYTE&&(pe=s.RG8I),ee===s.SHORT&&(pe=s.RG16I),ee===s.INT&&(pe=s.RG32I)),A===s.RGB_INTEGER&&(ee===s.UNSIGNED_BYTE&&(pe=s.RGB8UI),ee===s.UNSIGNED_SHORT&&(pe=s.RGB16UI),ee===s.UNSIGNED_INT&&(pe=s.RGB32UI),ee===s.BYTE&&(pe=s.RGB8I),ee===s.SHORT&&(pe=s.RGB16I),ee===s.INT&&(pe=s.RGB32I)),A===s.RGBA_INTEGER&&(ee===s.UNSIGNED_BYTE&&(pe=s.RGBA8UI),ee===s.UNSIGNED_SHORT&&(pe=s.RGBA16UI),ee===s.UNSIGNED_INT&&(pe=s.RGBA32UI),ee===s.BYTE&&(pe=s.RGBA8I),ee===s.SHORT&&(pe=s.RGBA16I),ee===s.INT&&(pe=s.RGBA32I)),A===s.RGB&&(ee===s.UNSIGNED_INT_5_9_9_9_REV&&(pe=s.RGB9_E5),ee===s.UNSIGNED_INT_10F_11F_11F_REV&&(pe=s.R11F_G11F_B10F)),A===s.RGBA){const je=Ee?Zu:Lt.getTransfer(he);ee===s.FLOAT&&(pe=s.RGBA32F),ee===s.HALF_FLOAT&&(pe=s.RGBA16F),ee===s.UNSIGNED_BYTE&&(pe=je===Xt?s.SRGB8_ALPHA8:s.RGBA8),ee===s.UNSIGNED_SHORT_4_4_4_4&&(pe=s.RGBA4),ee===s.UNSIGNED_SHORT_5_5_5_1&&(pe=s.RGB5_A1)}return(pe===s.R16F||pe===s.R32F||pe===s.RG16F||pe===s.RG32F||pe===s.RGBA16F||pe===s.RGBA32F)&&t.get("EXT_color_buffer_float"),pe}function U(L,A){let ee;return L?A===null||A===ur||A===Ol?ee=s.DEPTH24_STENCIL8:A===La?ee=s.DEPTH32F_STENCIL8:A===Ll&&(ee=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===ur||A===Ol?ee=s.DEPTH_COMPONENT24:A===La?ee=s.DEPTH_COMPONENT32F:A===Ll&&(ee=s.DEPTH_COMPONENT16),ee}function F(L,A){return E(L)===!0||L.isFramebufferTexture&&L.minFilter!==Di&&L.minFilter!==ji?Math.log2(Math.max(A.width,A.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?A.mipmaps.length:1}function H(L){const A=L.target;A.removeEventListener("dispose",H),k(A),A.isVideoTexture&&x.delete(A)}function I(L){const A=L.target;A.removeEventListener("dispose",I),w(A)}function k(L){const A=o.get(L);if(A.__webglInit===void 0)return;const ee=L.source,he=M.get(ee);if(he){const Ee=he[A.__cacheKey];Ee.usedTimes--,Ee.usedTimes===0&&N(L),Object.keys(he).length===0&&M.delete(ee)}o.remove(L)}function N(L){const A=o.get(L);s.deleteTexture(A.__webglTexture);const ee=L.source,he=M.get(ee);delete he[A.__cacheKey],d.memory.textures--}function w(L){const A=o.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),o.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let he=0;he<6;he++){if(Array.isArray(A.__webglFramebuffer[he]))for(let Ee=0;Ee<A.__webglFramebuffer[he].length;Ee++)s.deleteFramebuffer(A.__webglFramebuffer[he][Ee]);else s.deleteFramebuffer(A.__webglFramebuffer[he]);A.__webglDepthbuffer&&s.deleteRenderbuffer(A.__webglDepthbuffer[he])}else{if(Array.isArray(A.__webglFramebuffer))for(let he=0;he<A.__webglFramebuffer.length;he++)s.deleteFramebuffer(A.__webglFramebuffer[he]);else s.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&s.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&s.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let he=0;he<A.__webglColorRenderbuffer.length;he++)A.__webglColorRenderbuffer[he]&&s.deleteRenderbuffer(A.__webglColorRenderbuffer[he]);A.__webglDepthRenderbuffer&&s.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const ee=L.textures;for(let he=0,Ee=ee.length;he<Ee;he++){const pe=o.get(ee[he]);pe.__webglTexture&&(s.deleteTexture(pe.__webglTexture),d.memory.textures--),o.remove(ee[he])}o.remove(L)}let G=0;function ae(){G=0}function de(){const L=G;return L>=l.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+l.maxTextures),G+=1,L}function _e(L){const A=[];return A.push(L.wrapS),A.push(L.wrapT),A.push(L.wrapR||0),A.push(L.magFilter),A.push(L.minFilter),A.push(L.anisotropy),A.push(L.internalFormat),A.push(L.format),A.push(L.type),A.push(L.generateMipmaps),A.push(L.premultiplyAlpha),A.push(L.flipY),A.push(L.unpackAlignment),A.push(L.colorSpace),A.join()}function fe(L,A){const ee=o.get(L);if(L.isVideoTexture&&Oe(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&ee.__version!==L.version){const he=L.image;if(he===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(he.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(ee,L,A);return}}else L.isExternalTexture&&(ee.__webglTexture=L.sourceTexture?L.sourceTexture:null);i.bindTexture(s.TEXTURE_2D,ee.__webglTexture,s.TEXTURE0+A)}function X(L,A){const ee=o.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&ee.__version!==L.version){J(ee,L,A);return}i.bindTexture(s.TEXTURE_2D_ARRAY,ee.__webglTexture,s.TEXTURE0+A)}function se(L,A){const ee=o.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&ee.__version!==L.version){J(ee,L,A);return}i.bindTexture(s.TEXTURE_3D,ee.__webglTexture,s.TEXTURE0+A)}function Y(L,A){const ee=o.get(L);if(L.version>0&&ee.__version!==L.version){ie(ee,L,A);return}i.bindTexture(s.TEXTURE_CUBE_MAP,ee.__webglTexture,s.TEXTURE0+A)}const xe={[zp]:s.REPEAT,[rr]:s.CLAMP_TO_EDGE,[Pp]:s.MIRRORED_REPEAT},Me={[Di]:s.NEAREST,[VE]:s.NEAREST_MIPMAP_NEAREST,[hu]:s.NEAREST_MIPMAP_LINEAR,[ji]:s.LINEAR,[Fh]:s.LINEAR_MIPMAP_NEAREST,[or]:s.LINEAR_MIPMAP_LINEAR},ze={[qE]:s.NEVER,[JE]:s.ALWAYS,[YE]:s.LESS,[Uy]:s.LEQUAL,[WE]:s.EQUAL,[QE]:s.GEQUAL,[ZE]:s.GREATER,[KE]:s.NOTEQUAL};function ot(L,A){if(A.type===La&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===ji||A.magFilter===Fh||A.magFilter===hu||A.magFilter===or||A.minFilter===ji||A.minFilter===Fh||A.minFilter===hu||A.minFilter===or)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(L,s.TEXTURE_WRAP_S,xe[A.wrapS]),s.texParameteri(L,s.TEXTURE_WRAP_T,xe[A.wrapT]),(L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY)&&s.texParameteri(L,s.TEXTURE_WRAP_R,xe[A.wrapR]),s.texParameteri(L,s.TEXTURE_MAG_FILTER,Me[A.magFilter]),s.texParameteri(L,s.TEXTURE_MIN_FILTER,Me[A.minFilter]),A.compareFunction&&(s.texParameteri(L,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(L,s.TEXTURE_COMPARE_FUNC,ze[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Di||A.minFilter!==hu&&A.minFilter!==or||A.type===La&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||o.get(A).__currentAnisotropy){const ee=t.get("EXT_texture_filter_anisotropic");s.texParameterf(L,ee.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,l.getMaxAnisotropy())),o.get(A).__currentAnisotropy=A.anisotropy}}}function ht(L,A){let ee=!1;L.__webglInit===void 0&&(L.__webglInit=!0,A.addEventListener("dispose",H));const he=A.source;let Ee=M.get(he);Ee===void 0&&(Ee={},M.set(he,Ee));const pe=_e(A);if(pe!==L.__cacheKey){Ee[pe]===void 0&&(Ee[pe]={texture:s.createTexture(),usedTimes:0},d.memory.textures++,ee=!0),Ee[pe].usedTimes++;const je=Ee[L.__cacheKey];je!==void 0&&(Ee[L.__cacheKey].usedTimes--,je.usedTimes===0&&N(A)),L.__cacheKey=pe,L.__webglTexture=Ee[pe].texture}return ee}function B(L,A,ee){return Math.floor(Math.floor(L/ee)/A)}function le(L,A,ee,he){const pe=L.updateRanges;if(pe.length===0)i.texSubImage2D(s.TEXTURE_2D,0,0,0,A.width,A.height,ee,he,A.data);else{pe.sort((Ae,Be)=>Ae.start-Be.start);let je=0;for(let Ae=1;Ae<pe.length;Ae++){const Be=pe[je],rt=pe[Ae],qe=Be.start+Be.count,Fe=B(rt.start,A.width,4),pt=B(Be.start,A.width,4);rt.start<=qe+1&&Fe===pt&&B(rt.start+rt.count-1,A.width,4)===Fe?Be.count=Math.max(Be.count,rt.start+rt.count-Be.start):(++je,pe[je]=rt)}pe.length=je+1;const ye=s.getParameter(s.UNPACK_ROW_LENGTH),ke=s.getParameter(s.UNPACK_SKIP_PIXELS),We=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,A.width);for(let Ae=0,Be=pe.length;Ae<Be;Ae++){const rt=pe[Ae],qe=Math.floor(rt.start/4),Fe=Math.ceil(rt.count/4),pt=qe%A.width,j=Math.floor(qe/A.width),Ne=Fe,Le=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,pt),s.pixelStorei(s.UNPACK_SKIP_ROWS,j),i.texSubImage2D(s.TEXTURE_2D,0,pt,j,Ne,Le,ee,he,A.data)}L.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,ye),s.pixelStorei(s.UNPACK_SKIP_PIXELS,ke),s.pixelStorei(s.UNPACK_SKIP_ROWS,We)}}function J(L,A,ee){let he=s.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(he=s.TEXTURE_2D_ARRAY),A.isData3DTexture&&(he=s.TEXTURE_3D);const Ee=ht(L,A),pe=A.source;i.bindTexture(he,L.__webglTexture,s.TEXTURE0+ee);const je=o.get(pe);if(pe.version!==je.__version||Ee===!0){i.activeTexture(s.TEXTURE0+ee);const ye=Lt.getPrimaries(Lt.workingColorSpace),ke=A.colorSpace===xs?null:Lt.getPrimaries(A.colorSpace),We=A.colorSpace===xs||ye===ke?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,We);let Ae=C(A.image,!1,l.maxTextureSize);Ae=Mt(A,Ae);const Be=u.convert(A.format,A.colorSpace),rt=u.convert(A.type);let qe=P(A.internalFormat,Be,rt,A.colorSpace,A.isVideoTexture);ot(he,A);let Fe;const pt=A.mipmaps,j=A.isVideoTexture!==!0,Ne=je.__version===void 0||Ee===!0,Le=pe.dataReady,Ye=F(A,Ae);if(A.isDepthTexture)qe=U(A.format===Pl,A.type),Ne&&(j?i.texStorage2D(s.TEXTURE_2D,1,qe,Ae.width,Ae.height):i.texImage2D(s.TEXTURE_2D,0,qe,Ae.width,Ae.height,0,Be,rt,null));else if(A.isDataTexture)if(pt.length>0){j&&Ne&&i.texStorage2D(s.TEXTURE_2D,Ye,qe,pt[0].width,pt[0].height);for(let Ce=0,Se=pt.length;Ce<Se;Ce++)Fe=pt[Ce],j?Le&&i.texSubImage2D(s.TEXTURE_2D,Ce,0,0,Fe.width,Fe.height,Be,rt,Fe.data):i.texImage2D(s.TEXTURE_2D,Ce,qe,Fe.width,Fe.height,0,Be,rt,Fe.data);A.generateMipmaps=!1}else j?(Ne&&i.texStorage2D(s.TEXTURE_2D,Ye,qe,Ae.width,Ae.height),Le&&le(A,Ae,Be,rt)):i.texImage2D(s.TEXTURE_2D,0,qe,Ae.width,Ae.height,0,Be,rt,Ae.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){j&&Ne&&i.texStorage3D(s.TEXTURE_2D_ARRAY,Ye,qe,pt[0].width,pt[0].height,Ae.depth);for(let Ce=0,Se=pt.length;Ce<Se;Ce++)if(Fe=pt[Ce],A.format!==ki)if(Be!==null)if(j){if(Le)if(A.layerUpdates.size>0){const Je=Lx(Fe.width,Fe.height,A.format,A.type);for(const ft of A.layerUpdates){const qt=Fe.data.subarray(ft*Je/Fe.data.BYTES_PER_ELEMENT,(ft+1)*Je/Fe.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Ce,0,0,ft,Fe.width,Fe.height,1,Be,qt)}A.clearLayerUpdates()}else i.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Ce,0,0,0,Fe.width,Fe.height,Ae.depth,Be,Fe.data)}else i.compressedTexImage3D(s.TEXTURE_2D_ARRAY,Ce,qe,Fe.width,Fe.height,Ae.depth,0,Fe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else j?Le&&i.texSubImage3D(s.TEXTURE_2D_ARRAY,Ce,0,0,0,Fe.width,Fe.height,Ae.depth,Be,rt,Fe.data):i.texImage3D(s.TEXTURE_2D_ARRAY,Ce,qe,Fe.width,Fe.height,Ae.depth,0,Be,rt,Fe.data)}else{j&&Ne&&i.texStorage2D(s.TEXTURE_2D,Ye,qe,pt[0].width,pt[0].height);for(let Ce=0,Se=pt.length;Ce<Se;Ce++)Fe=pt[Ce],A.format!==ki?Be!==null?j?Le&&i.compressedTexSubImage2D(s.TEXTURE_2D,Ce,0,0,Fe.width,Fe.height,Be,Fe.data):i.compressedTexImage2D(s.TEXTURE_2D,Ce,qe,Fe.width,Fe.height,0,Fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):j?Le&&i.texSubImage2D(s.TEXTURE_2D,Ce,0,0,Fe.width,Fe.height,Be,rt,Fe.data):i.texImage2D(s.TEXTURE_2D,Ce,qe,Fe.width,Fe.height,0,Be,rt,Fe.data)}else if(A.isDataArrayTexture)if(j){if(Ne&&i.texStorage3D(s.TEXTURE_2D_ARRAY,Ye,qe,Ae.width,Ae.height,Ae.depth),Le)if(A.layerUpdates.size>0){const Ce=Lx(Ae.width,Ae.height,A.format,A.type);for(const Se of A.layerUpdates){const Je=Ae.data.subarray(Se*Ce/Ae.data.BYTES_PER_ELEMENT,(Se+1)*Ce/Ae.data.BYTES_PER_ELEMENT);i.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Se,Ae.width,Ae.height,1,Be,rt,Je)}A.clearLayerUpdates()}else i.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Ae.width,Ae.height,Ae.depth,Be,rt,Ae.data)}else i.texImage3D(s.TEXTURE_2D_ARRAY,0,qe,Ae.width,Ae.height,Ae.depth,0,Be,rt,Ae.data);else if(A.isData3DTexture)j?(Ne&&i.texStorage3D(s.TEXTURE_3D,Ye,qe,Ae.width,Ae.height,Ae.depth),Le&&i.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Ae.width,Ae.height,Ae.depth,Be,rt,Ae.data)):i.texImage3D(s.TEXTURE_3D,0,qe,Ae.width,Ae.height,Ae.depth,0,Be,rt,Ae.data);else if(A.isFramebufferTexture){if(Ne)if(j)i.texStorage2D(s.TEXTURE_2D,Ye,qe,Ae.width,Ae.height);else{let Ce=Ae.width,Se=Ae.height;for(let Je=0;Je<Ye;Je++)i.texImage2D(s.TEXTURE_2D,Je,qe,Ce,Se,0,Be,rt,null),Ce>>=1,Se>>=1}}else if(pt.length>0){if(j&&Ne){const Ce=Ut(pt[0]);i.texStorage2D(s.TEXTURE_2D,Ye,qe,Ce.width,Ce.height)}for(let Ce=0,Se=pt.length;Ce<Se;Ce++)Fe=pt[Ce],j?Le&&i.texSubImage2D(s.TEXTURE_2D,Ce,0,0,Be,rt,Fe):i.texImage2D(s.TEXTURE_2D,Ce,qe,Be,rt,Fe);A.generateMipmaps=!1}else if(j){if(Ne){const Ce=Ut(Ae);i.texStorage2D(s.TEXTURE_2D,Ye,qe,Ce.width,Ce.height)}Le&&i.texSubImage2D(s.TEXTURE_2D,0,0,0,Be,rt,Ae)}else i.texImage2D(s.TEXTURE_2D,0,qe,Be,rt,Ae);E(A)&&y(he),je.__version=pe.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version}function ie(L,A,ee){if(A.image.length!==6)return;const he=ht(L,A),Ee=A.source;i.bindTexture(s.TEXTURE_CUBE_MAP,L.__webglTexture,s.TEXTURE0+ee);const pe=o.get(Ee);if(Ee.version!==pe.__version||he===!0){i.activeTexture(s.TEXTURE0+ee);const je=Lt.getPrimaries(Lt.workingColorSpace),ye=A.colorSpace===xs?null:Lt.getPrimaries(A.colorSpace),ke=A.colorSpace===xs||je===ye?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke);const We=A.isCompressedTexture||A.image[0].isCompressedTexture,Ae=A.image[0]&&A.image[0].isDataTexture,Be=[];for(let Se=0;Se<6;Se++)!We&&!Ae?Be[Se]=C(A.image[Se],!0,l.maxCubemapSize):Be[Se]=Ae?A.image[Se].image:A.image[Se],Be[Se]=Mt(A,Be[Se]);const rt=Be[0],qe=u.convert(A.format,A.colorSpace),Fe=u.convert(A.type),pt=P(A.internalFormat,qe,Fe,A.colorSpace),j=A.isVideoTexture!==!0,Ne=pe.__version===void 0||he===!0,Le=Ee.dataReady;let Ye=F(A,rt);ot(s.TEXTURE_CUBE_MAP,A);let Ce;if(We){j&&Ne&&i.texStorage2D(s.TEXTURE_CUBE_MAP,Ye,pt,rt.width,rt.height);for(let Se=0;Se<6;Se++){Ce=Be[Se].mipmaps;for(let Je=0;Je<Ce.length;Je++){const ft=Ce[Je];A.format!==ki?qe!==null?j?Le&&i.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Je,0,0,ft.width,ft.height,qe,ft.data):i.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Je,pt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):j?Le&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Je,0,0,ft.width,ft.height,qe,Fe,ft.data):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Je,pt,ft.width,ft.height,0,qe,Fe,ft.data)}}}else{if(Ce=A.mipmaps,j&&Ne){Ce.length>0&&Ye++;const Se=Ut(Be[0]);i.texStorage2D(s.TEXTURE_CUBE_MAP,Ye,pt,Se.width,Se.height)}for(let Se=0;Se<6;Se++)if(Ae){j?Le&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,0,0,Be[Se].width,Be[Se].height,qe,Fe,Be[Se].data):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,pt,Be[Se].width,Be[Se].height,0,qe,Fe,Be[Se].data);for(let Je=0;Je<Ce.length;Je++){const qt=Ce[Je].image[Se].image;j?Le&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Je+1,0,0,qt.width,qt.height,qe,Fe,qt.data):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Je+1,pt,qt.width,qt.height,0,qe,Fe,qt.data)}}else{j?Le&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,0,0,qe,Fe,Be[Se]):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,pt,qe,Fe,Be[Se]);for(let Je=0;Je<Ce.length;Je++){const ft=Ce[Je];j?Le&&i.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Je+1,0,0,qe,Fe,ft.image[Se]):i.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Je+1,pt,qe,Fe,ft.image[Se])}}}E(A)&&y(s.TEXTURE_CUBE_MAP),pe.__version=Ee.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version}function Te(L,A,ee,he,Ee,pe){const je=u.convert(ee.format,ee.colorSpace),ye=u.convert(ee.type),ke=P(ee.internalFormat,je,ye,ee.colorSpace),We=o.get(A),Ae=o.get(ee);if(Ae.__renderTarget=A,!We.__hasExternalTextures){const Be=Math.max(1,A.width>>pe),rt=Math.max(1,A.height>>pe);Ee===s.TEXTURE_3D||Ee===s.TEXTURE_2D_ARRAY?i.texImage3D(Ee,pe,ke,Be,rt,A.depth,0,je,ye,null):i.texImage2D(Ee,pe,ke,Be,rt,0,je,ye,null)}i.bindFramebuffer(s.FRAMEBUFFER,L),me(A)?h.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,he,Ee,Ae.__webglTexture,0,at(A)):(Ee===s.TEXTURE_2D||Ee>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Ee<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,he,Ee,Ae.__webglTexture,pe),i.bindFramebuffer(s.FRAMEBUFFER,null)}function De(L,A,ee){if(s.bindRenderbuffer(s.RENDERBUFFER,L),A.depthBuffer){const he=A.depthTexture,Ee=he&&he.isDepthTexture?he.type:null,pe=U(A.stencilBuffer,Ee),je=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ye=at(A);me(A)?h.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ye,pe,A.width,A.height):ee?s.renderbufferStorageMultisample(s.RENDERBUFFER,ye,pe,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,pe,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,je,s.RENDERBUFFER,L)}else{const he=A.textures;for(let Ee=0;Ee<he.length;Ee++){const pe=he[Ee],je=u.convert(pe.format,pe.colorSpace),ye=u.convert(pe.type),ke=P(pe.internalFormat,je,ye,pe.colorSpace),We=at(A);ee&&me(A)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,We,ke,A.width,A.height):me(A)?h.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,We,ke,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,ke,A.width,A.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Re(L,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(i.bindFramebuffer(s.FRAMEBUFFER,L),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const he=o.get(A.depthTexture);he.__renderTarget=A,(!he.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),fe(A.depthTexture,0);const Ee=he.__webglTexture,pe=at(A);if(A.depthTexture.format===zl)me(A)?h.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Ee,0,pe):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Ee,0);else if(A.depthTexture.format===Pl)me(A)?h.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Ee,0,pe):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Ee,0);else throw new Error("Unknown depthTexture format")}function be(L){const A=o.get(L),ee=L.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==L.depthTexture){const he=L.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),he){const Ee=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,he.removeEventListener("dispose",Ee)};he.addEventListener("dispose",Ee),A.__depthDisposeCallback=Ee}A.__boundDepthTexture=he}if(L.depthTexture&&!A.__autoAllocateDepthBuffer){if(ee)throw new Error("target.depthTexture not supported in Cube render targets");const he=L.texture.mipmaps;he&&he.length>0?Re(A.__webglFramebuffer[0],L):Re(A.__webglFramebuffer,L)}else if(ee){A.__webglDepthbuffer=[];for(let he=0;he<6;he++)if(i.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer[he]),A.__webglDepthbuffer[he]===void 0)A.__webglDepthbuffer[he]=s.createRenderbuffer(),De(A.__webglDepthbuffer[he],L,!1);else{const Ee=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,pe=A.__webglDepthbuffer[he];s.bindRenderbuffer(s.RENDERBUFFER,pe),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ee,s.RENDERBUFFER,pe)}}else{const he=L.texture.mipmaps;if(he&&he.length>0?i.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer[0]):i.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=s.createRenderbuffer(),De(A.__webglDepthbuffer,L,!1);else{const Ee=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,pe=A.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,pe),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ee,s.RENDERBUFFER,pe)}}i.bindFramebuffer(s.FRAMEBUFFER,null)}function ce(L,A,ee){const he=o.get(L);A!==void 0&&Te(he.__webglFramebuffer,L,L.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),ee!==void 0&&be(L)}function D(L){const A=L.texture,ee=o.get(L),he=o.get(A);L.addEventListener("dispose",I);const Ee=L.textures,pe=L.isWebGLCubeRenderTarget===!0,je=Ee.length>1;if(je||(he.__webglTexture===void 0&&(he.__webglTexture=s.createTexture()),he.__version=A.version,d.memory.textures++),pe){ee.__webglFramebuffer=[];for(let ye=0;ye<6;ye++)if(A.mipmaps&&A.mipmaps.length>0){ee.__webglFramebuffer[ye]=[];for(let ke=0;ke<A.mipmaps.length;ke++)ee.__webglFramebuffer[ye][ke]=s.createFramebuffer()}else ee.__webglFramebuffer[ye]=s.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){ee.__webglFramebuffer=[];for(let ye=0;ye<A.mipmaps.length;ye++)ee.__webglFramebuffer[ye]=s.createFramebuffer()}else ee.__webglFramebuffer=s.createFramebuffer();if(je)for(let ye=0,ke=Ee.length;ye<ke;ye++){const We=o.get(Ee[ye]);We.__webglTexture===void 0&&(We.__webglTexture=s.createTexture(),d.memory.textures++)}if(L.samples>0&&me(L)===!1){ee.__webglMultisampledFramebuffer=s.createFramebuffer(),ee.__webglColorRenderbuffer=[],i.bindFramebuffer(s.FRAMEBUFFER,ee.__webglMultisampledFramebuffer);for(let ye=0;ye<Ee.length;ye++){const ke=Ee[ye];ee.__webglColorRenderbuffer[ye]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,ee.__webglColorRenderbuffer[ye]);const We=u.convert(ke.format,ke.colorSpace),Ae=u.convert(ke.type),Be=P(ke.internalFormat,We,Ae,ke.colorSpace,L.isXRRenderTarget===!0),rt=at(L);s.renderbufferStorageMultisample(s.RENDERBUFFER,rt,Be,L.width,L.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.RENDERBUFFER,ee.__webglColorRenderbuffer[ye])}s.bindRenderbuffer(s.RENDERBUFFER,null),L.depthBuffer&&(ee.__webglDepthRenderbuffer=s.createRenderbuffer(),De(ee.__webglDepthRenderbuffer,L,!0)),i.bindFramebuffer(s.FRAMEBUFFER,null)}}if(pe){i.bindTexture(s.TEXTURE_CUBE_MAP,he.__webglTexture),ot(s.TEXTURE_CUBE_MAP,A);for(let ye=0;ye<6;ye++)if(A.mipmaps&&A.mipmaps.length>0)for(let ke=0;ke<A.mipmaps.length;ke++)Te(ee.__webglFramebuffer[ye][ke],L,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ke);else Te(ee.__webglFramebuffer[ye],L,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0);E(A)&&y(s.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(je){for(let ye=0,ke=Ee.length;ye<ke;ye++){const We=Ee[ye],Ae=o.get(We);let Be=s.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(Be=L.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),i.bindTexture(Be,Ae.__webglTexture),ot(Be,We),Te(ee.__webglFramebuffer,L,We,s.COLOR_ATTACHMENT0+ye,Be,0),E(We)&&y(Be)}i.unbindTexture()}else{let ye=s.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ye=L.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),i.bindTexture(ye,he.__webglTexture),ot(ye,A),A.mipmaps&&A.mipmaps.length>0)for(let ke=0;ke<A.mipmaps.length;ke++)Te(ee.__webglFramebuffer[ke],L,A,s.COLOR_ATTACHMENT0,ye,ke);else Te(ee.__webglFramebuffer,L,A,s.COLOR_ATTACHMENT0,ye,0);E(A)&&y(ye),i.unbindTexture()}L.depthBuffer&&be(L)}function lt(L){const A=L.textures;for(let ee=0,he=A.length;ee<he;ee++){const Ee=A[ee];if(E(Ee)){const pe=O(L),je=o.get(Ee).__webglTexture;i.bindTexture(pe,je),y(pe),i.unbindTexture()}}}const tt=[],$e=[];function Pe(L){if(L.samples>0){if(me(L)===!1){const A=L.textures,ee=L.width,he=L.height;let Ee=s.COLOR_BUFFER_BIT;const pe=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,je=o.get(L),ye=A.length>1;if(ye)for(let We=0;We<A.length;We++)i.bindFramebuffer(s.FRAMEBUFFER,je.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+We,s.RENDERBUFFER,null),i.bindFramebuffer(s.FRAMEBUFFER,je.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+We,s.TEXTURE_2D,null,0);i.bindFramebuffer(s.READ_FRAMEBUFFER,je.__webglMultisampledFramebuffer);const ke=L.texture.mipmaps;ke&&ke.length>0?i.bindFramebuffer(s.DRAW_FRAMEBUFFER,je.__webglFramebuffer[0]):i.bindFramebuffer(s.DRAW_FRAMEBUFFER,je.__webglFramebuffer);for(let We=0;We<A.length;We++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(Ee|=s.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(Ee|=s.STENCIL_BUFFER_BIT)),ye){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,je.__webglColorRenderbuffer[We]);const Ae=o.get(A[We]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ae,0)}s.blitFramebuffer(0,0,ee,he,0,0,ee,he,Ee,s.NEAREST),p===!0&&(tt.length=0,$e.length=0,tt.push(s.COLOR_ATTACHMENT0+We),L.depthBuffer&&L.resolveDepthBuffer===!1&&(tt.push(pe),$e.push(pe),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,$e)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,tt))}if(i.bindFramebuffer(s.READ_FRAMEBUFFER,null),i.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ye)for(let We=0;We<A.length;We++){i.bindFramebuffer(s.FRAMEBUFFER,je.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+We,s.RENDERBUFFER,je.__webglColorRenderbuffer[We]);const Ae=o.get(A[We]).__webglTexture;i.bindFramebuffer(s.FRAMEBUFFER,je.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+We,s.TEXTURE_2D,Ae,0)}i.bindFramebuffer(s.DRAW_FRAMEBUFFER,je.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&p){const A=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[A])}}}function at(L){return Math.min(l.maxSamples,L.samples)}function me(L){const A=o.get(L);return L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Oe(L){const A=d.render.frame;x.get(L)!==A&&(x.set(L,A),L.update())}function Mt(L,A){const ee=L.colorSpace,he=L.format,Ee=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||ee!==To&&ee!==xs&&(Lt.getTransfer(ee)===Xt?(he!==ki||Ee!==ca)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",ee)),A}function Ut(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(g.width=L.naturalWidth||L.width,g.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(g.width=L.displayWidth,g.height=L.displayHeight):(g.width=L.width,g.height=L.height),g}this.allocateTextureUnit=de,this.resetTextureUnits=ae,this.setTexture2D=fe,this.setTexture2DArray=X,this.setTexture3D=se,this.setTextureCube=Y,this.rebindTextures=ce,this.setupRenderTarget=D,this.updateRenderTargetMipmap=lt,this.updateMultisampleRenderTarget=Pe,this.setupDepthRenderbuffer=be,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=me}function vR(s,t){function i(o,l=xs){let u;const d=Lt.getTransfer(l);if(o===ca)return s.UNSIGNED_BYTE;if(o===Cm)return s.UNSIGNED_SHORT_4_4_4_4;if(o===Rm)return s.UNSIGNED_SHORT_5_5_5_1;if(o===by)return s.UNSIGNED_INT_5_9_9_9_REV;if(o===Ay)return s.UNSIGNED_INT_10F_11F_11F_REV;if(o===Ey)return s.BYTE;if(o===Ty)return s.SHORT;if(o===Ll)return s.UNSIGNED_SHORT;if(o===Am)return s.INT;if(o===ur)return s.UNSIGNED_INT;if(o===La)return s.FLOAT;if(o===za)return s.HALF_FLOAT;if(o===Cy)return s.ALPHA;if(o===Ry)return s.RGB;if(o===ki)return s.RGBA;if(o===zl)return s.DEPTH_COMPONENT;if(o===Pl)return s.DEPTH_STENCIL;if(o===wy)return s.RED;if(o===wm)return s.RED_INTEGER;if(o===Ny)return s.RG;if(o===Nm)return s.RG_INTEGER;if(o===Dm)return s.RGBA_INTEGER;if(o===Hu||o===Gu||o===Vu||o===ju)if(d===Xt)if(u=t.get("WEBGL_compressed_texture_s3tc_srgb"),u!==null){if(o===Hu)return u.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===Gu)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===Vu)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===ju)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(u=t.get("WEBGL_compressed_texture_s3tc"),u!==null){if(o===Hu)return u.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===Gu)return u.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===Vu)return u.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===ju)return u.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===Ip||o===Bp||o===Fp||o===Hp)if(u=t.get("WEBGL_compressed_texture_pvrtc"),u!==null){if(o===Ip)return u.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===Bp)return u.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===Fp)return u.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===Hp)return u.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===Gp||o===Vp||o===jp)if(u=t.get("WEBGL_compressed_texture_etc"),u!==null){if(o===Gp||o===Vp)return d===Xt?u.COMPRESSED_SRGB8_ETC2:u.COMPRESSED_RGB8_ETC2;if(o===jp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:u.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===kp||o===Xp||o===qp||o===Yp||o===Wp||o===Zp||o===Kp||o===Qp||o===Jp||o===$p||o===em||o===tm||o===nm||o===im)if(u=t.get("WEBGL_compressed_texture_astc"),u!==null){if(o===kp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:u.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===Xp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:u.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===qp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:u.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===Yp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:u.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===Wp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:u.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===Zp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:u.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===Kp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:u.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===Qp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:u.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===Jp)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:u.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===$p)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:u.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===em)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:u.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===tm)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:u.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===nm)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:u.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===im)return d===Xt?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:u.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===am||o===sm||o===rm)if(u=t.get("EXT_texture_compression_bptc"),u!==null){if(o===am)return d===Xt?u.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:u.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===sm)return u.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===rm)return u.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===om||o===lm||o===cm||o===um)if(u=t.get("EXT_texture_compression_rgtc"),u!==null){if(o===om)return u.COMPRESSED_RED_RGTC1_EXT;if(o===lm)return u.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===cm)return u.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===um)return u.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===Ol?s.UNSIGNED_INT_24_8:s[o]!==void 0?s[o]:null}return{convert:i}}const _R=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,xR=`
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

}`;class yR{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,i){if(this.texture===null){const o=new Xy(t.texture);(t.depthNear!==i.depthNear||t.depthFar!==i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=o}}getMesh(t){if(this.texture!==null&&this.mesh===null){const i=t.cameras[0].viewport,o=new qn({vertexShader:_R,fragmentShader:xR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new pi(new jl(20,20),o)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class SR extends Co{constructor(t,i){super();const o=this;let l=null,u=1,d=null,h="local-floor",p=1,g=null,x=null,v=null,M=null,S=null,T=null;const C=typeof XRWebGLBinding<"u",E=new yR,y={},O=i.getContextAttributes();let P=null,U=null;const F=[],H=[],I=new dt;let k=null;const N=new Ri;N.viewport=new Wt;const w=new Ri;w.viewport=new Wt;const G=[N,w],ae=new VT;let de=null,_e=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ie=F[J];return ie===void 0&&(ie=new lp,F[J]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(J){let ie=F[J];return ie===void 0&&(ie=new lp,F[J]=ie),ie.getGripSpace()},this.getHand=function(J){let ie=F[J];return ie===void 0&&(ie=new lp,F[J]=ie),ie.getHandSpace()};function fe(J){const ie=H.indexOf(J.inputSource);if(ie===-1)return;const Te=F[ie];Te!==void 0&&(Te.update(J.inputSource,J.frame,g||d),Te.dispatchEvent({type:J.type,data:J.inputSource}))}function X(){l.removeEventListener("select",fe),l.removeEventListener("selectstart",fe),l.removeEventListener("selectend",fe),l.removeEventListener("squeeze",fe),l.removeEventListener("squeezestart",fe),l.removeEventListener("squeezeend",fe),l.removeEventListener("end",X),l.removeEventListener("inputsourceschange",se);for(let J=0;J<F.length;J++){const ie=H[J];ie!==null&&(H[J]=null,F[J].disconnect(ie))}de=null,_e=null,E.reset();for(const J in y)delete y[J];t.setRenderTarget(P),S=null,M=null,v=null,l=null,U=null,le.stop(),o.isPresenting=!1,t.setPixelRatio(k),t.setSize(I.width,I.height,!1),o.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){u=J,o.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){h=J,o.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return g||d},this.setReferenceSpace=function(J){g=J},this.getBaseLayer=function(){return M!==null?M:S},this.getBinding=function(){return v===null&&C&&(v=new XRWebGLBinding(l,i)),v},this.getFrame=function(){return T},this.getSession=function(){return l},this.setSession=async function(J){if(l=J,l!==null){if(P=t.getRenderTarget(),l.addEventListener("select",fe),l.addEventListener("selectstart",fe),l.addEventListener("selectend",fe),l.addEventListener("squeeze",fe),l.addEventListener("squeezestart",fe),l.addEventListener("squeezeend",fe),l.addEventListener("end",X),l.addEventListener("inputsourceschange",se),O.xrCompatible!==!0&&await i.makeXRCompatible(),k=t.getPixelRatio(),t.getSize(I),C&&"createProjectionLayer"in XRWebGLBinding.prototype){let Te=null,De=null,Re=null;O.depth&&(Re=O.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,Te=O.stencil?Pl:zl,De=O.stencil?Ol:ur);const be={colorFormat:i.RGBA8,depthFormat:Re,scaleFactor:u};v=this.getBinding(),M=v.createProjectionLayer(be),l.updateRenderState({layers:[M]}),t.setPixelRatio(1),t.setSize(M.textureWidth,M.textureHeight,!1),U=new Xi(M.textureWidth,M.textureHeight,{format:ki,type:ca,depthTexture:new ky(M.textureWidth,M.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,Te),stencilBuffer:O.stencil,colorSpace:t.outputColorSpace,samples:O.antialias?4:0,resolveDepthBuffer:M.ignoreDepthValues===!1,resolveStencilBuffer:M.ignoreDepthValues===!1})}else{const Te={antialias:O.antialias,alpha:!0,depth:O.depth,stencil:O.stencil,framebufferScaleFactor:u};S=new XRWebGLLayer(l,i,Te),l.updateRenderState({baseLayer:S}),t.setPixelRatio(1),t.setSize(S.framebufferWidth,S.framebufferHeight,!1),U=new Xi(S.framebufferWidth,S.framebufferHeight,{format:ki,type:ca,colorSpace:t.outputColorSpace,stencilBuffer:O.stencil,resolveDepthBuffer:S.ignoreDepthValues===!1,resolveStencilBuffer:S.ignoreDepthValues===!1})}U.isXRRenderTarget=!0,this.setFoveation(p),g=null,d=await l.requestReferenceSpace(h),le.setContext(l),le.start(),o.isPresenting=!0,o.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return E.getDepthTexture()};function se(J){for(let ie=0;ie<J.removed.length;ie++){const Te=J.removed[ie],De=H.indexOf(Te);De>=0&&(H[De]=null,F[De].disconnect(Te))}for(let ie=0;ie<J.added.length;ie++){const Te=J.added[ie];let De=H.indexOf(Te);if(De===-1){for(let be=0;be<F.length;be++)if(be>=H.length){H.push(Te),De=be;break}else if(H[be]===null){H[be]=Te,De=be;break}if(De===-1)break}const Re=F[De];Re&&Re.connect(Te)}}const Y=new te,xe=new te;function Me(J,ie,Te){Y.setFromMatrixPosition(ie.matrixWorld),xe.setFromMatrixPosition(Te.matrixWorld);const De=Y.distanceTo(xe),Re=ie.projectionMatrix.elements,be=Te.projectionMatrix.elements,ce=Re[14]/(Re[10]-1),D=Re[14]/(Re[10]+1),lt=(Re[9]+1)/Re[5],tt=(Re[9]-1)/Re[5],$e=(Re[8]-1)/Re[0],Pe=(be[8]+1)/be[0],at=ce*$e,me=ce*Pe,Oe=De/(-$e+Pe),Mt=Oe*-$e;if(ie.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Mt),J.translateZ(Oe),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Re[10]===-1)J.projectionMatrix.copy(ie.projectionMatrix),J.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const Ut=ce+Oe,L=D+Oe,A=at-Mt,ee=me+(De-Mt),he=lt*D/L*Ut,Ee=tt*D/L*Ut;J.projectionMatrix.makePerspective(A,ee,he,Ee,Ut,L),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ze(J,ie){ie===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ie.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(l===null)return;let ie=J.near,Te=J.far;E.texture!==null&&(E.depthNear>0&&(ie=E.depthNear),E.depthFar>0&&(Te=E.depthFar)),ae.near=w.near=N.near=ie,ae.far=w.far=N.far=Te,(de!==ae.near||_e!==ae.far)&&(l.updateRenderState({depthNear:ae.near,depthFar:ae.far}),de=ae.near,_e=ae.far),ae.layers.mask=J.layers.mask|6,N.layers.mask=ae.layers.mask&3,w.layers.mask=ae.layers.mask&5;const De=J.parent,Re=ae.cameras;ze(ae,De);for(let be=0;be<Re.length;be++)ze(Re[be],De);Re.length===2?Me(ae,N,w):ae.projectionMatrix.copy(N.projectionMatrix),ot(J,ae,De)};function ot(J,ie,Te){Te===null?J.matrix.copy(ie.matrixWorld):(J.matrix.copy(Te.matrixWorld),J.matrix.invert(),J.matrix.multiply(ie.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ie.projectionMatrix),J.projectionMatrixInverse.copy(ie.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=fm*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return ae},this.getFoveation=function(){if(!(M===null&&S===null))return p},this.setFoveation=function(J){p=J,M!==null&&(M.fixedFoveation=J),S!==null&&S.fixedFoveation!==void 0&&(S.fixedFoveation=J)},this.hasDepthSensing=function(){return E.texture!==null},this.getDepthSensingMesh=function(){return E.getMesh(ae)},this.getCameraTexture=function(J){return y[J]};let ht=null;function B(J,ie){if(x=ie.getViewerPose(g||d),T=ie,x!==null){const Te=x.views;S!==null&&(t.setRenderTargetFramebuffer(U,S.framebuffer),t.setRenderTarget(U));let De=!1;Te.length!==ae.cameras.length&&(ae.cameras.length=0,De=!0);for(let D=0;D<Te.length;D++){const lt=Te[D];let tt=null;if(S!==null)tt=S.getViewport(lt);else{const Pe=v.getViewSubImage(M,lt);tt=Pe.viewport,D===0&&(t.setRenderTargetTextures(U,Pe.colorTexture,Pe.depthStencilTexture),t.setRenderTarget(U))}let $e=G[D];$e===void 0&&($e=new Ri,$e.layers.enable(D),$e.viewport=new Wt,G[D]=$e),$e.matrix.fromArray(lt.transform.matrix),$e.matrix.decompose($e.position,$e.quaternion,$e.scale),$e.projectionMatrix.fromArray(lt.projectionMatrix),$e.projectionMatrixInverse.copy($e.projectionMatrix).invert(),$e.viewport.set(tt.x,tt.y,tt.width,tt.height),D===0&&(ae.matrix.copy($e.matrix),ae.matrix.decompose(ae.position,ae.quaternion,ae.scale)),De===!0&&ae.cameras.push($e)}const Re=l.enabledFeatures;if(Re&&Re.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&C){v=o.getBinding();const D=v.getDepthInformation(Te[0]);D&&D.isValid&&D.texture&&E.init(D,l.renderState)}if(Re&&Re.includes("camera-access")&&C){t.state.unbindTexture(),v=o.getBinding();for(let D=0;D<Te.length;D++){const lt=Te[D].camera;if(lt){let tt=y[lt];tt||(tt=new Xy,y[lt]=tt);const $e=v.getCameraImage(lt);tt.sourceTexture=$e}}}}for(let Te=0;Te<F.length;Te++){const De=H[Te],Re=F[Te];De!==null&&Re!==void 0&&Re.update(De,ie,g||d)}ht&&ht(J,ie),ie.detectedPlanes&&o.dispatchEvent({type:"planesdetected",data:ie}),T=null}const le=new Wy;le.setAnimationLoop(B),this.setAnimationLoop=function(J){ht=J},this.dispose=function(){}}}const er=new ua,MR=new an;function ER(s,t){function i(E,y){E.matrixAutoUpdate===!0&&E.updateMatrix(),y.value.copy(E.matrix)}function o(E,y){y.color.getRGB(E.fogColor.value,Hy(s)),y.isFog?(E.fogNear.value=y.near,E.fogFar.value=y.far):y.isFogExp2&&(E.fogDensity.value=y.density)}function l(E,y,O,P,U){y.isMeshBasicMaterial||y.isMeshLambertMaterial?u(E,y):y.isMeshToonMaterial?(u(E,y),v(E,y)):y.isMeshPhongMaterial?(u(E,y),x(E,y)):y.isMeshStandardMaterial?(u(E,y),M(E,y),y.isMeshPhysicalMaterial&&S(E,y,U)):y.isMeshMatcapMaterial?(u(E,y),T(E,y)):y.isMeshDepthMaterial?u(E,y):y.isMeshDistanceMaterial?(u(E,y),C(E,y)):y.isMeshNormalMaterial?u(E,y):y.isLineBasicMaterial?(d(E,y),y.isLineDashedMaterial&&h(E,y)):y.isPointsMaterial?p(E,y,O,P):y.isSpriteMaterial?g(E,y):y.isShadowMaterial?(E.color.value.copy(y.color),E.opacity.value=y.opacity):y.isShaderMaterial&&(y.uniformsNeedUpdate=!1)}function u(E,y){E.opacity.value=y.opacity,y.color&&E.diffuse.value.copy(y.color),y.emissive&&E.emissive.value.copy(y.emissive).multiplyScalar(y.emissiveIntensity),y.map&&(E.map.value=y.map,i(y.map,E.mapTransform)),y.alphaMap&&(E.alphaMap.value=y.alphaMap,i(y.alphaMap,E.alphaMapTransform)),y.bumpMap&&(E.bumpMap.value=y.bumpMap,i(y.bumpMap,E.bumpMapTransform),E.bumpScale.value=y.bumpScale,y.side===ti&&(E.bumpScale.value*=-1)),y.normalMap&&(E.normalMap.value=y.normalMap,i(y.normalMap,E.normalMapTransform),E.normalScale.value.copy(y.normalScale),y.side===ti&&E.normalScale.value.negate()),y.displacementMap&&(E.displacementMap.value=y.displacementMap,i(y.displacementMap,E.displacementMapTransform),E.displacementScale.value=y.displacementScale,E.displacementBias.value=y.displacementBias),y.emissiveMap&&(E.emissiveMap.value=y.emissiveMap,i(y.emissiveMap,E.emissiveMapTransform)),y.specularMap&&(E.specularMap.value=y.specularMap,i(y.specularMap,E.specularMapTransform)),y.alphaTest>0&&(E.alphaTest.value=y.alphaTest);const O=t.get(y),P=O.envMap,U=O.envMapRotation;P&&(E.envMap.value=P,er.copy(U),er.x*=-1,er.y*=-1,er.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(er.y*=-1,er.z*=-1),E.envMapRotation.value.setFromMatrix4(MR.makeRotationFromEuler(er)),E.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,E.reflectivity.value=y.reflectivity,E.ior.value=y.ior,E.refractionRatio.value=y.refractionRatio),y.lightMap&&(E.lightMap.value=y.lightMap,E.lightMapIntensity.value=y.lightMapIntensity,i(y.lightMap,E.lightMapTransform)),y.aoMap&&(E.aoMap.value=y.aoMap,E.aoMapIntensity.value=y.aoMapIntensity,i(y.aoMap,E.aoMapTransform))}function d(E,y){E.diffuse.value.copy(y.color),E.opacity.value=y.opacity,y.map&&(E.map.value=y.map,i(y.map,E.mapTransform))}function h(E,y){E.dashSize.value=y.dashSize,E.totalSize.value=y.dashSize+y.gapSize,E.scale.value=y.scale}function p(E,y,O,P){E.diffuse.value.copy(y.color),E.opacity.value=y.opacity,E.size.value=y.size*O,E.scale.value=P*.5,y.map&&(E.map.value=y.map,i(y.map,E.uvTransform)),y.alphaMap&&(E.alphaMap.value=y.alphaMap,i(y.alphaMap,E.alphaMapTransform)),y.alphaTest>0&&(E.alphaTest.value=y.alphaTest)}function g(E,y){E.diffuse.value.copy(y.color),E.opacity.value=y.opacity,E.rotation.value=y.rotation,y.map&&(E.map.value=y.map,i(y.map,E.mapTransform)),y.alphaMap&&(E.alphaMap.value=y.alphaMap,i(y.alphaMap,E.alphaMapTransform)),y.alphaTest>0&&(E.alphaTest.value=y.alphaTest)}function x(E,y){E.specular.value.copy(y.specular),E.shininess.value=Math.max(y.shininess,1e-4)}function v(E,y){y.gradientMap&&(E.gradientMap.value=y.gradientMap)}function M(E,y){E.metalness.value=y.metalness,y.metalnessMap&&(E.metalnessMap.value=y.metalnessMap,i(y.metalnessMap,E.metalnessMapTransform)),E.roughness.value=y.roughness,y.roughnessMap&&(E.roughnessMap.value=y.roughnessMap,i(y.roughnessMap,E.roughnessMapTransform)),y.envMap&&(E.envMapIntensity.value=y.envMapIntensity)}function S(E,y,O){E.ior.value=y.ior,y.sheen>0&&(E.sheenColor.value.copy(y.sheenColor).multiplyScalar(y.sheen),E.sheenRoughness.value=y.sheenRoughness,y.sheenColorMap&&(E.sheenColorMap.value=y.sheenColorMap,i(y.sheenColorMap,E.sheenColorMapTransform)),y.sheenRoughnessMap&&(E.sheenRoughnessMap.value=y.sheenRoughnessMap,i(y.sheenRoughnessMap,E.sheenRoughnessMapTransform))),y.clearcoat>0&&(E.clearcoat.value=y.clearcoat,E.clearcoatRoughness.value=y.clearcoatRoughness,y.clearcoatMap&&(E.clearcoatMap.value=y.clearcoatMap,i(y.clearcoatMap,E.clearcoatMapTransform)),y.clearcoatRoughnessMap&&(E.clearcoatRoughnessMap.value=y.clearcoatRoughnessMap,i(y.clearcoatRoughnessMap,E.clearcoatRoughnessMapTransform)),y.clearcoatNormalMap&&(E.clearcoatNormalMap.value=y.clearcoatNormalMap,i(y.clearcoatNormalMap,E.clearcoatNormalMapTransform),E.clearcoatNormalScale.value.copy(y.clearcoatNormalScale),y.side===ti&&E.clearcoatNormalScale.value.negate())),y.dispersion>0&&(E.dispersion.value=y.dispersion),y.iridescence>0&&(E.iridescence.value=y.iridescence,E.iridescenceIOR.value=y.iridescenceIOR,E.iridescenceThicknessMinimum.value=y.iridescenceThicknessRange[0],E.iridescenceThicknessMaximum.value=y.iridescenceThicknessRange[1],y.iridescenceMap&&(E.iridescenceMap.value=y.iridescenceMap,i(y.iridescenceMap,E.iridescenceMapTransform)),y.iridescenceThicknessMap&&(E.iridescenceThicknessMap.value=y.iridescenceThicknessMap,i(y.iridescenceThicknessMap,E.iridescenceThicknessMapTransform))),y.transmission>0&&(E.transmission.value=y.transmission,E.transmissionSamplerMap.value=O.texture,E.transmissionSamplerSize.value.set(O.width,O.height),y.transmissionMap&&(E.transmissionMap.value=y.transmissionMap,i(y.transmissionMap,E.transmissionMapTransform)),E.thickness.value=y.thickness,y.thicknessMap&&(E.thicknessMap.value=y.thicknessMap,i(y.thicknessMap,E.thicknessMapTransform)),E.attenuationDistance.value=y.attenuationDistance,E.attenuationColor.value.copy(y.attenuationColor)),y.anisotropy>0&&(E.anisotropyVector.value.set(y.anisotropy*Math.cos(y.anisotropyRotation),y.anisotropy*Math.sin(y.anisotropyRotation)),y.anisotropyMap&&(E.anisotropyMap.value=y.anisotropyMap,i(y.anisotropyMap,E.anisotropyMapTransform))),E.specularIntensity.value=y.specularIntensity,E.specularColor.value.copy(y.specularColor),y.specularColorMap&&(E.specularColorMap.value=y.specularColorMap,i(y.specularColorMap,E.specularColorMapTransform)),y.specularIntensityMap&&(E.specularIntensityMap.value=y.specularIntensityMap,i(y.specularIntensityMap,E.specularIntensityMapTransform))}function T(E,y){y.matcap&&(E.matcap.value=y.matcap)}function C(E,y){const O=t.get(y).light;E.referencePosition.value.setFromMatrixPosition(O.matrixWorld),E.nearDistance.value=O.shadow.camera.near,E.farDistance.value=O.shadow.camera.far}return{refreshFogUniforms:o,refreshMaterialUniforms:l}}function TR(s,t,i,o){let l={},u={},d=[];const h=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function p(O,P){const U=P.program;o.uniformBlockBinding(O,U)}function g(O,P){let U=l[O.id];U===void 0&&(T(O),U=x(O),l[O.id]=U,O.addEventListener("dispose",E));const F=P.program;o.updateUBOMapping(O,F);const H=t.render.frame;u[O.id]!==H&&(M(O),u[O.id]=H)}function x(O){const P=v();O.__bindingPointIndex=P;const U=s.createBuffer(),F=O.__size,H=O.usage;return s.bindBuffer(s.UNIFORM_BUFFER,U),s.bufferData(s.UNIFORM_BUFFER,F,H),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,P,U),U}function v(){for(let O=0;O<h;O++)if(d.indexOf(O)===-1)return d.push(O),O;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function M(O){const P=l[O.id],U=O.uniforms,F=O.__cache;s.bindBuffer(s.UNIFORM_BUFFER,P);for(let H=0,I=U.length;H<I;H++){const k=Array.isArray(U[H])?U[H]:[U[H]];for(let N=0,w=k.length;N<w;N++){const G=k[N];if(S(G,H,N,F)===!0){const ae=G.__offset,de=Array.isArray(G.value)?G.value:[G.value];let _e=0;for(let fe=0;fe<de.length;fe++){const X=de[fe],se=C(X);typeof X=="number"||typeof X=="boolean"?(G.__data[0]=X,s.bufferSubData(s.UNIFORM_BUFFER,ae+_e,G.__data)):X.isMatrix3?(G.__data[0]=X.elements[0],G.__data[1]=X.elements[1],G.__data[2]=X.elements[2],G.__data[3]=0,G.__data[4]=X.elements[3],G.__data[5]=X.elements[4],G.__data[6]=X.elements[5],G.__data[7]=0,G.__data[8]=X.elements[6],G.__data[9]=X.elements[7],G.__data[10]=X.elements[8],G.__data[11]=0):(X.toArray(G.__data,_e),_e+=se.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,ae,G.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function S(O,P,U,F){const H=O.value,I=P+"_"+U;if(F[I]===void 0)return typeof H=="number"||typeof H=="boolean"?F[I]=H:F[I]=H.clone(),!0;{const k=F[I];if(typeof H=="number"||typeof H=="boolean"){if(k!==H)return F[I]=H,!0}else if(k.equals(H)===!1)return k.copy(H),!0}return!1}function T(O){const P=O.uniforms;let U=0;const F=16;for(let I=0,k=P.length;I<k;I++){const N=Array.isArray(P[I])?P[I]:[P[I]];for(let w=0,G=N.length;w<G;w++){const ae=N[w],de=Array.isArray(ae.value)?ae.value:[ae.value];for(let _e=0,fe=de.length;_e<fe;_e++){const X=de[_e],se=C(X),Y=U%F,xe=Y%se.boundary,Me=Y+xe;U+=xe,Me!==0&&F-Me<se.storage&&(U+=F-Me),ae.__data=new Float32Array(se.storage/Float32Array.BYTES_PER_ELEMENT),ae.__offset=U,U+=se.storage}}}const H=U%F;return H>0&&(U+=F-H),O.__size=U,O.__cache={},this}function C(O){const P={boundary:0,storage:0};return typeof O=="number"||typeof O=="boolean"?(P.boundary=4,P.storage=4):O.isVector2?(P.boundary=8,P.storage=8):O.isVector3||O.isColor?(P.boundary=16,P.storage=12):O.isVector4?(P.boundary=16,P.storage=16):O.isMatrix3?(P.boundary=48,P.storage=48):O.isMatrix4?(P.boundary=64,P.storage=64):O.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",O),P}function E(O){const P=O.target;P.removeEventListener("dispose",E);const U=d.indexOf(P.__bindingPointIndex);d.splice(U,1),s.deleteBuffer(l[P.id]),delete l[P.id],delete u[P.id]}function y(){for(const O in l)s.deleteBuffer(l[O]);d=[],l={},u={}}return{bind:p,update:g,dispose:y}}class bR{constructor(t={}){const{canvas:i=eT(),context:o=null,depth:l=!0,stencil:u=!1,alpha:d=!1,antialias:h=!1,premultipliedAlpha:p=!0,preserveDrawingBuffer:g=!1,powerPreference:x="default",failIfMajorPerformanceCaveat:v=!1,reversedDepthBuffer:M=!1}=t;this.isWebGLRenderer=!0;let S;if(o!==null){if(typeof WebGLRenderingContext<"u"&&o instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");S=o.getContextAttributes().alpha}else S=d;const T=new Uint32Array(4),C=new Int32Array(4);let E=null,y=null;const O=[],P=[];this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ss,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const U=this;let F=!1;this._outputColorSpace=ei;let H=0,I=0,k=null,N=-1,w=null;const G=new Wt,ae=new Wt;let de=null;const _e=new wt(0);let fe=0,X=i.width,se=i.height,Y=1,xe=null,Me=null;const ze=new Wt(0,0,X,se),ot=new Wt(0,0,X,se);let ht=!1;const B=new Lm;let le=!1,J=!1;const ie=new an,Te=new te,De=new Wt,Re={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let be=!1;function ce(){return k===null?Y:1}let D=o;function lt(R,K){return i.getContext(R,K)}try{const R={alpha:!0,depth:l,stencil:u,antialias:h,premultipliedAlpha:p,preserveDrawingBuffer:g,powerPreference:x,failIfMajorPerformanceCaveat:v};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${Tm}`),i.addEventListener("webglcontextlost",Le,!1),i.addEventListener("webglcontextrestored",Ye,!1),i.addEventListener("webglcontextcreationerror",Ce,!1),D===null){const K="webgl2";if(D=lt(K,R),D===null)throw lt(K)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let tt,$e,Pe,at,me,Oe,Mt,Ut,L,A,ee,he,Ee,pe,je,ye,ke,We,Ae,Be,rt,qe,Fe,pt;function j(){tt=new z2(D),tt.init(),qe=new vR(D,tt),$e=new R2(D,tt,t,qe),Pe=new mR(D,tt),$e.reversedDepthBuffer&&M&&Pe.buffers.depth.setReversed(!0),at=new B2(D),me=new nR,Oe=new gR(D,tt,Pe,me,$e,qe,at),Mt=new N2(U),Ut=new O2(U),L=new kT(D),Fe=new A2(D,L),A=new P2(D,L,at,Fe),ee=new H2(D,A,L,at),Ae=new F2(D,$e,Oe),ye=new w2(me),he=new tR(U,Mt,Ut,tt,$e,Fe,ye),Ee=new ER(U,me),pe=new aR,je=new uR(tt),We=new b2(U,Mt,Ut,Pe,ee,S,p),ke=new hR(U,ee,$e),pt=new TR(D,at,$e,Pe),Be=new C2(D,tt,at),rt=new I2(D,tt,at),at.programs=he.programs,U.capabilities=$e,U.extensions=tt,U.properties=me,U.renderLists=pe,U.shadowMap=ke,U.state=Pe,U.info=at}j();const Ne=new SR(U,D);this.xr=Ne,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const R=tt.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=tt.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(R){R!==void 0&&(Y=R,this.setSize(X,se,!1))},this.getSize=function(R){return R.set(X,se)},this.setSize=function(R,K,oe=!0){if(Ne.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=R,se=K,i.width=Math.floor(R*Y),i.height=Math.floor(K*Y),oe===!0&&(i.style.width=R+"px",i.style.height=K+"px"),this.setViewport(0,0,R,K)},this.getDrawingBufferSize=function(R){return R.set(X*Y,se*Y).floor()},this.setDrawingBufferSize=function(R,K,oe){X=R,se=K,Y=oe,i.width=Math.floor(R*oe),i.height=Math.floor(K*oe),this.setViewport(0,0,R,K)},this.getCurrentViewport=function(R){return R.copy(G)},this.getViewport=function(R){return R.copy(ze)},this.setViewport=function(R,K,oe,ue){R.isVector4?ze.set(R.x,R.y,R.z,R.w):ze.set(R,K,oe,ue),Pe.viewport(G.copy(ze).multiplyScalar(Y).round())},this.getScissor=function(R){return R.copy(ot)},this.setScissor=function(R,K,oe,ue){R.isVector4?ot.set(R.x,R.y,R.z,R.w):ot.set(R,K,oe,ue),Pe.scissor(ae.copy(ot).multiplyScalar(Y).round())},this.getScissorTest=function(){return ht},this.setScissorTest=function(R){Pe.setScissorTest(ht=R)},this.setOpaqueSort=function(R){xe=R},this.setTransparentSort=function(R){Me=R},this.getClearColor=function(R){return R.copy(We.getClearColor())},this.setClearColor=function(){We.setClearColor(...arguments)},this.getClearAlpha=function(){return We.getClearAlpha()},this.setClearAlpha=function(){We.setClearAlpha(...arguments)},this.clear=function(R=!0,K=!0,oe=!0){let ue=0;if(R){let Q=!1;if(k!==null){const we=k.texture.format;Q=we===Dm||we===Nm||we===wm}if(Q){const we=k.texture.type,He=we===ca||we===ur||we===Ll||we===Ol||we===Cm||we===Rm,Ve=We.getClearColor(),Ue=We.getClearAlpha(),Ze=Ve.r,st=Ve.g,nt=Ve.b;He?(T[0]=Ze,T[1]=st,T[2]=nt,T[3]=Ue,D.clearBufferuiv(D.COLOR,0,T)):(C[0]=Ze,C[1]=st,C[2]=nt,C[3]=Ue,D.clearBufferiv(D.COLOR,0,C))}else ue|=D.COLOR_BUFFER_BIT}K&&(ue|=D.DEPTH_BUFFER_BIT),oe&&(ue|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(ue)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",Le,!1),i.removeEventListener("webglcontextrestored",Ye,!1),i.removeEventListener("webglcontextcreationerror",Ce,!1),We.dispose(),pe.dispose(),je.dispose(),me.dispose(),Mt.dispose(),Ut.dispose(),ee.dispose(),Fe.dispose(),pt.dispose(),he.dispose(),Ne.dispose(),Ne.removeEventListener("sessionstart",_n),Ne.removeEventListener("sessionend",On),fa.stop()};function Le(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),F=!0}function Ye(){console.log("THREE.WebGLRenderer: Context Restored."),F=!1;const R=at.autoReset,K=ke.enabled,oe=ke.autoUpdate,ue=ke.needsUpdate,Q=ke.type;j(),at.autoReset=R,ke.enabled=K,ke.autoUpdate=oe,ke.needsUpdate=ue,ke.type=Q}function Ce(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Se(R){const K=R.target;K.removeEventListener("dispose",Se),Je(K)}function Je(R){ft(R),me.remove(R)}function ft(R){const K=me.get(R).programs;K!==void 0&&(K.forEach(function(oe){he.releaseProgram(oe)}),R.isShaderMaterial&&he.releaseShaderCache(R))}this.renderBufferDirect=function(R,K,oe,ue,Q,we){K===null&&(K=Re);const He=Q.isMesh&&Q.matrixWorld.determinant()<0,Ve=Xl(R,K,oe,ue,Q);Pe.setMaterial(ue,He);let Ue=oe.index,Ze=1;if(ue.wireframe===!0){if(Ue=A.getWireframeAttribute(oe),Ue===void 0)return;Ze=2}const st=oe.drawRange,nt=oe.attributes.position;let St=st.start*Ze,Ht=(st.start+st.count)*Ze;we!==null&&(St=Math.max(St,we.start*Ze),Ht=Math.min(Ht,(we.start+we.count)*Ze)),Ue!==null?(St=Math.max(St,0),Ht=Math.min(Ht,Ue.count)):nt!=null&&(St=Math.max(St,0),Ht=Math.min(Ht,nt.count));const $t=Ht-St;if($t<0||$t===1/0)return;Fe.setup(Q,ue,Ve,oe,Ue);let It,Ot=Be;if(Ue!==null&&(It=L.get(Ue),Ot=rt,Ot.setIndex(It)),Q.isMesh)ue.wireframe===!0?(Pe.setLineWidth(ue.wireframeLinewidth*ce()),Ot.setMode(D.LINES)):Ot.setMode(D.TRIANGLES);else if(Q.isLine){let it=ue.linewidth;it===void 0&&(it=1),Pe.setLineWidth(it*ce()),Q.isLineSegments?Ot.setMode(D.LINES):Q.isLineLoop?Ot.setMode(D.LINE_LOOP):Ot.setMode(D.LINE_STRIP)}else Q.isPoints?Ot.setMode(D.POINTS):Q.isSprite&&Ot.setMode(D.TRIANGLES);if(Q.isBatchedMesh)if(Q._multiDrawInstances!==null)Bl("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ot.renderMultiDrawInstances(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount,Q._multiDrawInstances);else if(tt.get("WEBGL_multi_draw"))Ot.renderMultiDraw(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount);else{const it=Q._multiDrawStarts,Bt=Q._multiDrawCounts,xt=Q._multiDrawCount,xn=Ue?L.get(Ue).bytesPerElement:1,ni=me.get(ue).currentProgram.getUniforms();for(let zt=0;zt<xt;zt++)ni.setValue(D,"_gl_DrawID",zt),Ot.render(it[zt]/xn,Bt[zt])}else if(Q.isInstancedMesh)Ot.renderInstances(St,$t,Q.count);else if(oe.isInstancedBufferGeometry){const it=oe._maxInstanceCount!==void 0?oe._maxInstanceCount:1/0,Bt=Math.min(oe.instanceCount,it);Ot.renderInstances(St,$t,Bt)}else Ot.render(St,$t)};function qt(R,K,oe){R.transparent===!0&&R.side===oa&&R.forceSinglePass===!1?(R.side=ti,R.needsUpdate=!0,gi(R,K,oe),R.side=Es,R.needsUpdate=!0,gi(R,K,oe),R.side=oa):gi(R,K,oe)}this.compile=function(R,K,oe=null){oe===null&&(oe=R),y=je.get(oe),y.init(K),P.push(y),oe.traverseVisible(function(Q){Q.isLight&&Q.layers.test(K.layers)&&(y.pushLight(Q),Q.castShadow&&y.pushShadow(Q))}),R!==oe&&R.traverseVisible(function(Q){Q.isLight&&Q.layers.test(K.layers)&&(y.pushLight(Q),Q.castShadow&&y.pushShadow(Q))}),y.setupLights();const ue=new Set;return R.traverse(function(Q){if(!(Q.isMesh||Q.isPoints||Q.isLine||Q.isSprite))return;const we=Q.material;if(we)if(Array.isArray(we))for(let He=0;He<we.length;He++){const Ve=we[He];qt(Ve,oe,Q),ue.add(Ve)}else qt(we,oe,Q),ue.add(we)}),y=P.pop(),ue},this.compileAsync=function(R,K,oe=null){const ue=this.compile(R,K,oe);return new Promise(Q=>{function we(){if(ue.forEach(function(He){me.get(He).currentProgram.isReady()&&ue.delete(He)}),ue.size===0){Q(R);return}setTimeout(we,10)}tt.get("KHR_parallel_shader_compile")!==null?we():setTimeout(we,10)})};let At=null;function tn(R){At&&At(R)}function _n(){fa.stop()}function On(){fa.start()}const fa=new Wy;fa.setAnimationLoop(tn),typeof self<"u"&&fa.setContext(self),this.setAnimationLoop=function(R){At=R,Ne.setAnimationLoop(R),R===null?fa.stop():fa.start()},Ne.addEventListener("sessionstart",_n),Ne.addEventListener("sessionend",On),this.render=function(R,K){if(K!==void 0&&K.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),K.parent===null&&K.matrixWorldAutoUpdate===!0&&K.updateMatrixWorld(),Ne.enabled===!0&&Ne.isPresenting===!0&&(Ne.cameraAutoUpdate===!0&&Ne.updateCamera(K),K=Ne.getCamera()),R.isScene===!0&&R.onBeforeRender(U,R,K,k),y=je.get(R,P.length),y.init(K),P.push(y),ie.multiplyMatrices(K.projectionMatrix,K.matrixWorldInverse),B.setFromProjectionMatrix(ie,la,K.reversedDepth),J=this.localClippingEnabled,le=ye.init(this.clippingPlanes,J),E=pe.get(R,O.length),E.init(),O.push(E),Ne.enabled===!0&&Ne.isPresenting===!0){const we=U.xr.getDepthSensingMesh();we!==null&&Uo(we,K,-1/0,U.sortObjects)}Uo(R,K,0,U.sortObjects),E.finish(),U.sortObjects===!0&&E.sort(xe,Me),be=Ne.enabled===!1||Ne.isPresenting===!1||Ne.hasDepthSensing()===!1,be&&We.addToRenderList(E,R),this.info.render.frame++,le===!0&&ye.beginShadows();const oe=y.state.shadowsArray;ke.render(oe,R,K),le===!0&&ye.endShadows(),this.info.autoReset===!0&&this.info.reset();const ue=E.opaque,Q=E.transmissive;if(y.setupLights(),K.isArrayCamera){const we=K.cameras;if(Q.length>0)for(let He=0,Ve=we.length;He<Ve;He++){const Ue=we[He];bs(ue,Q,R,Ue)}be&&We.render(R);for(let He=0,Ve=we.length;He<Ve;He++){const Ue=we[He];kl(E,R,Ue,Ue.viewport)}}else Q.length>0&&bs(ue,Q,R,K),be&&We.render(R),kl(E,R,K);k!==null&&I===0&&(Oe.updateMultisampleRenderTarget(k),Oe.updateRenderTargetMipmap(k)),R.isScene===!0&&R.onAfterRender(U,R,K),Fe.resetDefaultState(),N=-1,w=null,P.pop(),P.length>0?(y=P[P.length-1],le===!0&&ye.setGlobalState(U.clippingPlanes,y.state.camera)):y=null,O.pop(),O.length>0?E=O[O.length-1]:E=null};function Uo(R,K,oe,ue){if(R.visible===!1)return;if(R.layers.test(K.layers)){if(R.isGroup)oe=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(K);else if(R.isLight)y.pushLight(R),R.castShadow&&y.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||B.intersectsSprite(R)){ue&&De.setFromMatrixPosition(R.matrixWorld).applyMatrix4(ie);const He=ee.update(R),Ve=R.material;Ve.visible&&E.push(R,He,Ve,oe,De.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||B.intersectsObject(R))){const He=ee.update(R),Ve=R.material;if(ue&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),De.copy(R.boundingSphere.center)):(He.boundingSphere===null&&He.computeBoundingSphere(),De.copy(He.boundingSphere.center)),De.applyMatrix4(R.matrixWorld).applyMatrix4(ie)),Array.isArray(Ve)){const Ue=He.groups;for(let Ze=0,st=Ue.length;Ze<st;Ze++){const nt=Ue[Ze],St=Ve[nt.materialIndex];St&&St.visible&&E.push(R,He,St,oe,De.z,nt)}}else Ve.visible&&E.push(R,He,Ve,oe,De.z,null)}}const we=R.children;for(let He=0,Ve=we.length;He<Ve;He++)Uo(we[He],K,oe,ue)}function kl(R,K,oe,ue){const Q=R.opaque,we=R.transmissive,He=R.transparent;y.setupLightsView(oe),le===!0&&ye.setGlobalState(U.clippingPlanes,oe),ue&&Pe.viewport(G.copy(ue)),Q.length>0&&da(Q,K,oe),we.length>0&&da(we,K,oe),He.length>0&&da(He,K,oe),Pe.buffers.depth.setTest(!0),Pe.buffers.depth.setMask(!0),Pe.buffers.color.setMask(!0),Pe.setPolygonOffset(!1)}function bs(R,K,oe,ue){if((oe.isScene===!0?oe.overrideMaterial:null)!==null)return;y.state.transmissionRenderTarget[ue.id]===void 0&&(y.state.transmissionRenderTarget[ue.id]=new Xi(1,1,{generateMipmaps:!0,type:tt.has("EXT_color_buffer_half_float")||tt.has("EXT_color_buffer_float")?za:ca,minFilter:or,samples:4,stencilBuffer:u,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Lt.workingColorSpace}));const we=y.state.transmissionRenderTarget[ue.id],He=ue.viewport||G;we.setSize(He.z*U.transmissionResolutionScale,He.w*U.transmissionResolutionScale);const Ve=U.getRenderTarget(),Ue=U.getActiveCubeFace(),Ze=U.getActiveMipmapLevel();U.setRenderTarget(we),U.getClearColor(_e),fe=U.getClearAlpha(),fe<1&&U.setClearColor(16777215,.5),U.clear(),be&&We.render(oe);const st=U.toneMapping;U.toneMapping=Ss;const nt=ue.viewport;if(ue.viewport!==void 0&&(ue.viewport=void 0),y.setupLightsView(ue),le===!0&&ye.setGlobalState(U.clippingPlanes,ue),da(R,oe,ue),Oe.updateMultisampleRenderTarget(we),Oe.updateRenderTargetMipmap(we),tt.has("WEBGL_multisampled_render_to_texture")===!1){let St=!1;for(let Ht=0,$t=K.length;Ht<$t;Ht++){const It=K[Ht],Ot=It.object,it=It.geometry,Bt=It.material,xt=It.group;if(Bt.side===oa&&Ot.layers.test(ue.layers)){const xn=Bt.side;Bt.side=ti,Bt.needsUpdate=!0,As(Ot,oe,ue,it,Bt,xt),Bt.side=xn,Bt.needsUpdate=!0,St=!0}}St===!0&&(Oe.updateMultisampleRenderTarget(we),Oe.updateRenderTargetMipmap(we))}U.setRenderTarget(Ve,Ue,Ze),U.setClearColor(_e,fe),nt!==void 0&&(ue.viewport=nt),U.toneMapping=st}function da(R,K,oe){const ue=K.isScene===!0?K.overrideMaterial:null;for(let Q=0,we=R.length;Q<we;Q++){const He=R[Q],Ve=He.object,Ue=He.geometry,Ze=He.group;let st=He.material;st.allowOverride===!0&&ue!==null&&(st=ue),Ve.layers.test(oe.layers)&&As(Ve,K,oe,Ue,st,Ze)}}function As(R,K,oe,ue,Q,we){R.onBeforeRender(U,K,oe,ue,Q,we),R.modelViewMatrix.multiplyMatrices(oe.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),Q.onBeforeRender(U,K,oe,ue,R,we),Q.transparent===!0&&Q.side===oa&&Q.forceSinglePass===!1?(Q.side=ti,Q.needsUpdate=!0,U.renderBufferDirect(oe,K,ue,Q,R,we),Q.side=Es,Q.needsUpdate=!0,U.renderBufferDirect(oe,K,ue,Q,R,we),Q.side=oa):U.renderBufferDirect(oe,K,ue,Q,R,we),R.onAfterRender(U,K,oe,ue,Q,we)}function gi(R,K,oe){K.isScene!==!0&&(K=Re);const ue=me.get(R),Q=y.state.lights,we=y.state.shadowsArray,He=Q.state.version,Ve=he.getParameters(R,Q.state,we,K,oe),Ue=he.getProgramCacheKey(Ve);let Ze=ue.programs;ue.environment=R.isMeshStandardMaterial?K.environment:null,ue.fog=K.fog,ue.envMap=(R.isMeshStandardMaterial?Ut:Mt).get(R.envMap||ue.environment),ue.envMapRotation=ue.environment!==null&&R.envMap===null?K.environmentRotation:R.envMapRotation,Ze===void 0&&(R.addEventListener("dispose",Se),Ze=new Map,ue.programs=Ze);let st=Ze.get(Ue);if(st!==void 0){if(ue.currentProgram===st&&ue.lightsStateVersion===He)return Ba(R,Ve),st}else Ve.uniforms=he.getUniforms(R),R.onBeforeCompile(Ve,U),st=he.acquireProgram(Ve,Ue),Ze.set(Ue,st),ue.uniforms=Ve.uniforms;const nt=ue.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(nt.clippingPlanes=ye.uniform),Ba(R,Ve),ue.needsLights=ql(R),ue.lightsStateVersion=He,ue.needsLights&&(nt.ambientLightColor.value=Q.state.ambient,nt.lightProbe.value=Q.state.probe,nt.directionalLights.value=Q.state.directional,nt.directionalLightShadows.value=Q.state.directionalShadow,nt.spotLights.value=Q.state.spot,nt.spotLightShadows.value=Q.state.spotShadow,nt.rectAreaLights.value=Q.state.rectArea,nt.ltc_1.value=Q.state.rectAreaLTC1,nt.ltc_2.value=Q.state.rectAreaLTC2,nt.pointLights.value=Q.state.point,nt.pointLightShadows.value=Q.state.pointShadow,nt.hemisphereLights.value=Q.state.hemi,nt.directionalShadowMap.value=Q.state.directionalShadowMap,nt.directionalShadowMatrix.value=Q.state.directionalShadowMatrix,nt.spotShadowMap.value=Q.state.spotShadowMap,nt.spotLightMatrix.value=Q.state.spotLightMatrix,nt.spotLightMap.value=Q.state.spotLightMap,nt.pointShadowMap.value=Q.state.pointShadowMap,nt.pointShadowMatrix.value=Q.state.pointShadowMatrix),ue.currentProgram=st,ue.uniformsList=null,st}function Cs(R){if(R.uniformsList===null){const K=R.currentProgram.getUniforms();R.uniformsList=ku.seqWithValue(K.seq,R.uniforms)}return R.uniformsList}function Ba(R,K){const oe=me.get(R);oe.outputColorSpace=K.outputColorSpace,oe.batching=K.batching,oe.batchingColor=K.batchingColor,oe.instancing=K.instancing,oe.instancingColor=K.instancingColor,oe.instancingMorph=K.instancingMorph,oe.skinning=K.skinning,oe.morphTargets=K.morphTargets,oe.morphNormals=K.morphNormals,oe.morphColors=K.morphColors,oe.morphTargetsCount=K.morphTargetsCount,oe.numClippingPlanes=K.numClippingPlanes,oe.numIntersection=K.numClipIntersection,oe.vertexAlphas=K.vertexAlphas,oe.vertexTangents=K.vertexTangents,oe.toneMapping=K.toneMapping}function Xl(R,K,oe,ue,Q){K.isScene!==!0&&(K=Re),Oe.resetTextureUnits();const we=K.fog,He=ue.isMeshStandardMaterial?K.environment:null,Ve=k===null?U.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:To,Ue=(ue.isMeshStandardMaterial?Ut:Mt).get(ue.envMap||He),Ze=ue.vertexColors===!0&&!!oe.attributes.color&&oe.attributes.color.itemSize===4,st=!!oe.attributes.tangent&&(!!ue.normalMap||ue.anisotropy>0),nt=!!oe.morphAttributes.position,St=!!oe.morphAttributes.normal,Ht=!!oe.morphAttributes.color;let $t=Ss;ue.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&($t=U.toneMapping);const It=oe.morphAttributes.position||oe.morphAttributes.normal||oe.morphAttributes.color,Ot=It!==void 0?It.length:0,it=me.get(ue),Bt=y.state.lights;if(le===!0&&(J===!0||R!==w)){const sn=R===w&&ue.id===N;ye.setState(ue,R,sn)}let xt=!1;ue.version===it.__version?(it.needsLights&&it.lightsStateVersion!==Bt.state.version||it.outputColorSpace!==Ve||Q.isBatchedMesh&&it.batching===!1||!Q.isBatchedMesh&&it.batching===!0||Q.isBatchedMesh&&it.batchingColor===!0&&Q.colorTexture===null||Q.isBatchedMesh&&it.batchingColor===!1&&Q.colorTexture!==null||Q.isInstancedMesh&&it.instancing===!1||!Q.isInstancedMesh&&it.instancing===!0||Q.isSkinnedMesh&&it.skinning===!1||!Q.isSkinnedMesh&&it.skinning===!0||Q.isInstancedMesh&&it.instancingColor===!0&&Q.instanceColor===null||Q.isInstancedMesh&&it.instancingColor===!1&&Q.instanceColor!==null||Q.isInstancedMesh&&it.instancingMorph===!0&&Q.morphTexture===null||Q.isInstancedMesh&&it.instancingMorph===!1&&Q.morphTexture!==null||it.envMap!==Ue||ue.fog===!0&&it.fog!==we||it.numClippingPlanes!==void 0&&(it.numClippingPlanes!==ye.numPlanes||it.numIntersection!==ye.numIntersection)||it.vertexAlphas!==Ze||it.vertexTangents!==st||it.morphTargets!==nt||it.morphNormals!==St||it.morphColors!==Ht||it.toneMapping!==$t||it.morphTargetsCount!==Ot)&&(xt=!0):(xt=!0,it.__version=ue.version);let xn=it.currentProgram;xt===!0&&(xn=gi(ue,K,Q));let ni=!1,zt=!1,Fa=!1;const Kt=xn.getUniforms(),Hn=it.uniforms;if(Pe.useProgram(xn.program)&&(ni=!0,zt=!0,Fa=!0),ue.id!==N&&(N=ue.id,zt=!0),ni||w!==R){Pe.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),Kt.setValue(D,"projectionMatrix",R.projectionMatrix),Kt.setValue(D,"viewMatrix",R.matrixWorldInverse);const zn=Kt.map.cameraPosition;zn!==void 0&&zn.setValue(D,Te.setFromMatrixPosition(R.matrixWorld)),$e.logarithmicDepthBuffer&&Kt.setValue(D,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(ue.isMeshPhongMaterial||ue.isMeshToonMaterial||ue.isMeshLambertMaterial||ue.isMeshBasicMaterial||ue.isMeshStandardMaterial||ue.isShaderMaterial)&&Kt.setValue(D,"isOrthographic",R.isOrthographicCamera===!0),w!==R&&(w=R,zt=!0,Fa=!0)}if(Q.isSkinnedMesh){Kt.setOptional(D,Q,"bindMatrix"),Kt.setOptional(D,Q,"bindMatrixInverse");const sn=Q.skeleton;sn&&(sn.boneTexture===null&&sn.computeBoneTexture(),Kt.setValue(D,"boneTexture",sn.boneTexture,Oe))}Q.isBatchedMesh&&(Kt.setOptional(D,Q,"batchingTexture"),Kt.setValue(D,"batchingTexture",Q._matricesTexture,Oe),Kt.setOptional(D,Q,"batchingIdTexture"),Kt.setValue(D,"batchingIdTexture",Q._indirectTexture,Oe),Kt.setOptional(D,Q,"batchingColorTexture"),Q._colorsTexture!==null&&Kt.setValue(D,"batchingColorTexture",Q._colorsTexture,Oe));const un=oe.morphAttributes;if((un.position!==void 0||un.normal!==void 0||un.color!==void 0)&&Ae.update(Q,oe,xn),(zt||it.receiveShadow!==Q.receiveShadow)&&(it.receiveShadow=Q.receiveShadow,Kt.setValue(D,"receiveShadow",Q.receiveShadow)),ue.isMeshGouraudMaterial&&ue.envMap!==null&&(Hn.envMap.value=Ue,Hn.flipEnvMap.value=Ue.isCubeTexture&&Ue.isRenderTargetTexture===!1?-1:1),ue.isMeshStandardMaterial&&ue.envMap===null&&K.environment!==null&&(Hn.envMapIntensity.value=K.environmentIntensity),zt&&(Kt.setValue(D,"toneMappingExposure",U.toneMappingExposure),it.needsLights&&rf(Hn,Fa),we&&ue.fog===!0&&Ee.refreshFogUniforms(Hn,we),Ee.refreshMaterialUniforms(Hn,ue,Y,se,y.state.transmissionRenderTarget[R.id]),ku.upload(D,Cs(it),Hn,Oe)),ue.isShaderMaterial&&ue.uniformsNeedUpdate===!0&&(ku.upload(D,Cs(it),Hn,Oe),ue.uniformsNeedUpdate=!1),ue.isSpriteMaterial&&Kt.setValue(D,"center",Q.center),Kt.setValue(D,"modelViewMatrix",Q.modelViewMatrix),Kt.setValue(D,"normalMatrix",Q.normalMatrix),Kt.setValue(D,"modelMatrix",Q.matrixWorld),ue.isShaderMaterial||ue.isRawShaderMaterial){const sn=ue.uniformsGroups;for(let zn=0,dr=sn.length;zn<dr;zn++){const Wi=sn[zn];pt.update(Wi,xn),pt.bind(Wi,xn)}}return xn}function rf(R,K){R.ambientLightColor.needsUpdate=K,R.lightProbe.needsUpdate=K,R.directionalLights.needsUpdate=K,R.directionalLightShadows.needsUpdate=K,R.pointLights.needsUpdate=K,R.pointLightShadows.needsUpdate=K,R.spotLights.needsUpdate=K,R.spotLightShadows.needsUpdate=K,R.rectAreaLights.needsUpdate=K,R.hemisphereLights.needsUpdate=K}function ql(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return k},this.setRenderTargetTextures=function(R,K,oe){const ue=me.get(R);ue.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,ue.__autoAllocateDepthBuffer===!1&&(ue.__useRenderToTexture=!1),me.get(R.texture).__webglTexture=K,me.get(R.depthTexture).__webglTexture=ue.__autoAllocateDepthBuffer?void 0:oe,ue.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,K){const oe=me.get(R);oe.__webglFramebuffer=K,oe.__useDefaultFramebuffer=K===void 0};const Lo=D.createFramebuffer();this.setRenderTarget=function(R,K=0,oe=0){k=R,H=K,I=oe;let ue=!0,Q=null,we=!1,He=!1;if(R){const Ue=me.get(R);if(Ue.__useDefaultFramebuffer!==void 0)Pe.bindFramebuffer(D.FRAMEBUFFER,null),ue=!1;else if(Ue.__webglFramebuffer===void 0)Oe.setupRenderTarget(R);else if(Ue.__hasExternalTextures)Oe.rebindTextures(R,me.get(R.texture).__webglTexture,me.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const nt=R.depthTexture;if(Ue.__boundDepthTexture!==nt){if(nt!==null&&me.has(nt)&&(R.width!==nt.image.width||R.height!==nt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Oe.setupDepthRenderbuffer(R)}}const Ze=R.texture;(Ze.isData3DTexture||Ze.isDataArrayTexture||Ze.isCompressedArrayTexture)&&(He=!0);const st=me.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(st[K])?Q=st[K][oe]:Q=st[K],we=!0):R.samples>0&&Oe.useMultisampledRTT(R)===!1?Q=me.get(R).__webglMultisampledFramebuffer:Array.isArray(st)?Q=st[oe]:Q=st,G.copy(R.viewport),ae.copy(R.scissor),de=R.scissorTest}else G.copy(ze).multiplyScalar(Y).floor(),ae.copy(ot).multiplyScalar(Y).floor(),de=ht;if(oe!==0&&(Q=Lo),Pe.bindFramebuffer(D.FRAMEBUFFER,Q)&&ue&&Pe.drawBuffers(R,Q),Pe.viewport(G),Pe.scissor(ae),Pe.setScissorTest(de),we){const Ue=me.get(R.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+K,Ue.__webglTexture,oe)}else if(He){const Ue=K;for(let Ze=0;Ze<R.textures.length;Ze++){const st=me.get(R.textures[Ze]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Ze,st.__webglTexture,oe,Ue)}}else if(R!==null&&oe!==0){const Ue=me.get(R.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Ue.__webglTexture,oe)}N=-1},this.readRenderTargetPixels=function(R,K,oe,ue,Q,we,He,Ve=0){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ue=me.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&He!==void 0&&(Ue=Ue[He]),Ue){Pe.bindFramebuffer(D.FRAMEBUFFER,Ue);try{const Ze=R.textures[Ve],st=Ze.format,nt=Ze.type;if(!$e.textureFormatReadable(st)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!$e.textureTypeReadable(nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}K>=0&&K<=R.width-ue&&oe>=0&&oe<=R.height-Q&&(R.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Ve),D.readPixels(K,oe,ue,Q,qe.convert(st),qe.convert(nt),we))}finally{const Ze=k!==null?me.get(k).__webglFramebuffer:null;Pe.bindFramebuffer(D.FRAMEBUFFER,Ze)}}},this.readRenderTargetPixelsAsync=async function(R,K,oe,ue,Q,we,He,Ve=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ue=me.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&He!==void 0&&(Ue=Ue[He]),Ue)if(K>=0&&K<=R.width-ue&&oe>=0&&oe<=R.height-Q){Pe.bindFramebuffer(D.FRAMEBUFFER,Ue);const Ze=R.textures[Ve],st=Ze.format,nt=Ze.type;if(!$e.textureFormatReadable(st))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$e.textureTypeReadable(nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const St=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,St),D.bufferData(D.PIXEL_PACK_BUFFER,we.byteLength,D.STREAM_READ),R.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Ve),D.readPixels(K,oe,ue,Q,qe.convert(st),qe.convert(nt),0);const Ht=k!==null?me.get(k).__webglFramebuffer:null;Pe.bindFramebuffer(D.FRAMEBUFFER,Ht);const $t=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await tT(D,$t,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,St),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,we),D.deleteBuffer(St),D.deleteSync($t),we}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,K=null,oe=0){const ue=Math.pow(2,-oe),Q=Math.floor(R.image.width*ue),we=Math.floor(R.image.height*ue),He=K!==null?K.x:0,Ve=K!==null?K.y:0;Oe.setTexture2D(R,0),D.copyTexSubImage2D(D.TEXTURE_2D,oe,0,0,He,Ve,Q,we),Pe.unbindTexture()};const Rs=D.createFramebuffer(),of=D.createFramebuffer();this.copyTextureToTexture=function(R,K,oe=null,ue=null,Q=0,we=null){we===null&&(Q!==0?(Bl("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),we=Q,Q=0):we=0);let He,Ve,Ue,Ze,st,nt,St,Ht,$t;const It=R.isCompressedTexture?R.mipmaps[we]:R.image;if(oe!==null)He=oe.max.x-oe.min.x,Ve=oe.max.y-oe.min.y,Ue=oe.isBox3?oe.max.z-oe.min.z:1,Ze=oe.min.x,st=oe.min.y,nt=oe.isBox3?oe.min.z:0;else{const un=Math.pow(2,-Q);He=Math.floor(It.width*un),Ve=Math.floor(It.height*un),R.isDataArrayTexture?Ue=It.depth:R.isData3DTexture?Ue=Math.floor(It.depth*un):Ue=1,Ze=0,st=0,nt=0}ue!==null?(St=ue.x,Ht=ue.y,$t=ue.z):(St=0,Ht=0,$t=0);const Ot=qe.convert(K.format),it=qe.convert(K.type);let Bt;K.isData3DTexture?(Oe.setTexture3D(K,0),Bt=D.TEXTURE_3D):K.isDataArrayTexture||K.isCompressedArrayTexture?(Oe.setTexture2DArray(K,0),Bt=D.TEXTURE_2D_ARRAY):(Oe.setTexture2D(K,0),Bt=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,K.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,K.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,K.unpackAlignment);const xt=D.getParameter(D.UNPACK_ROW_LENGTH),xn=D.getParameter(D.UNPACK_IMAGE_HEIGHT),ni=D.getParameter(D.UNPACK_SKIP_PIXELS),zt=D.getParameter(D.UNPACK_SKIP_ROWS),Fa=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,It.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,It.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ze),D.pixelStorei(D.UNPACK_SKIP_ROWS,st),D.pixelStorei(D.UNPACK_SKIP_IMAGES,nt);const Kt=R.isDataArrayTexture||R.isData3DTexture,Hn=K.isDataArrayTexture||K.isData3DTexture;if(R.isDepthTexture){const un=me.get(R),sn=me.get(K),zn=me.get(un.__renderTarget),dr=me.get(sn.__renderTarget);Pe.bindFramebuffer(D.READ_FRAMEBUFFER,zn.__webglFramebuffer),Pe.bindFramebuffer(D.DRAW_FRAMEBUFFER,dr.__webglFramebuffer);for(let Wi=0;Wi<Ue;Wi++)Kt&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,me.get(R).__webglTexture,Q,nt+Wi),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,me.get(K).__webglTexture,we,$t+Wi)),D.blitFramebuffer(Ze,st,He,Ve,St,Ht,He,Ve,D.DEPTH_BUFFER_BIT,D.NEAREST);Pe.bindFramebuffer(D.READ_FRAMEBUFFER,null),Pe.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(Q!==0||R.isRenderTargetTexture||me.has(R)){const un=me.get(R),sn=me.get(K);Pe.bindFramebuffer(D.READ_FRAMEBUFFER,Rs),Pe.bindFramebuffer(D.DRAW_FRAMEBUFFER,of);for(let zn=0;zn<Ue;zn++)Kt?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,un.__webglTexture,Q,nt+zn):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,un.__webglTexture,Q),Hn?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,sn.__webglTexture,we,$t+zn):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,sn.__webglTexture,we),Q!==0?D.blitFramebuffer(Ze,st,He,Ve,St,Ht,He,Ve,D.COLOR_BUFFER_BIT,D.NEAREST):Hn?D.copyTexSubImage3D(Bt,we,St,Ht,$t+zn,Ze,st,He,Ve):D.copyTexSubImage2D(Bt,we,St,Ht,Ze,st,He,Ve);Pe.bindFramebuffer(D.READ_FRAMEBUFFER,null),Pe.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else Hn?R.isDataTexture||R.isData3DTexture?D.texSubImage3D(Bt,we,St,Ht,$t,He,Ve,Ue,Ot,it,It.data):K.isCompressedArrayTexture?D.compressedTexSubImage3D(Bt,we,St,Ht,$t,He,Ve,Ue,Ot,It.data):D.texSubImage3D(Bt,we,St,Ht,$t,He,Ve,Ue,Ot,it,It):R.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,we,St,Ht,He,Ve,Ot,it,It.data):R.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,we,St,Ht,It.width,It.height,Ot,It.data):D.texSubImage2D(D.TEXTURE_2D,we,St,Ht,He,Ve,Ot,it,It);D.pixelStorei(D.UNPACK_ROW_LENGTH,xt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,xn),D.pixelStorei(D.UNPACK_SKIP_PIXELS,ni),D.pixelStorei(D.UNPACK_SKIP_ROWS,zt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Fa),we===0&&K.generateMipmaps&&D.generateMipmap(Bt),Pe.unbindTexture()},this.initRenderTarget=function(R){me.get(R).__webglFramebuffer===void 0&&Oe.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?Oe.setTextureCube(R,0):R.isData3DTexture?Oe.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?Oe.setTexture2DArray(R,0):Oe.setTexture2D(R,0),Pe.unbindTexture()},this.resetState=function(){H=0,I=0,k=null,Pe.reset(),Fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return la}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const i=this.getContext();i.drawingBufferColorSpace=Lt._getDrawingBufferColorSpace(t),i.unpackColorSpace=Lt._getUnpackColorSpace()}}const Xu={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Do{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const AR=new nf(-1,1,1,-1,0,1);class CR extends Yi{constructor(){super(),this.setAttribute("position",new Ui([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ui([0,2,0,0,2,0],2))}}const RR=new CR;class Bm{constructor(t){this._mesh=new pi(RR,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,AR)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class $y extends Do{constructor(t,i="tDiffuse"){super(),this.textureID=i,this.uniforms=null,this.material=null,t instanceof qn?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Fl.clone(t.uniforms),this.material=new qn({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Bm(this.material)}render(t,i,o){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=o.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class ay extends Do{constructor(t,i){super(),this.scene=t,this.camera=i,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,i,o){const l=t.getContext(),u=t.state;u.buffers.color.setMask(!1),u.buffers.depth.setMask(!1),u.buffers.color.setLocked(!0),u.buffers.depth.setLocked(!0);let d,h;this.inverse?(d=0,h=1):(d=1,h=0),u.buffers.stencil.setTest(!0),u.buffers.stencil.setOp(l.REPLACE,l.REPLACE,l.REPLACE),u.buffers.stencil.setFunc(l.ALWAYS,d,4294967295),u.buffers.stencil.setClear(h),u.buffers.stencil.setLocked(!0),t.setRenderTarget(o),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),u.buffers.color.setLocked(!1),u.buffers.depth.setLocked(!1),u.buffers.color.setMask(!0),u.buffers.depth.setMask(!0),u.buffers.stencil.setLocked(!1),u.buffers.stencil.setFunc(l.EQUAL,1,4294967295),u.buffers.stencil.setOp(l.KEEP,l.KEEP,l.KEEP),u.buffers.stencil.setLocked(!0)}}class wR extends Do{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class NR{constructor(t,i){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),i===void 0){const o=t.getSize(new dt);this._width=o.width,this._height=o.height,i=new Xi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:za}),i.texture.name="EffectComposer.rt1"}else this._width=i.width,this._height=i.height;this.renderTarget1=i,this.renderTarget2=i.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new $y(Xu),this.copyPass.material.blending=Oa,this.clock=new Yy}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,i){this.passes.splice(i,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const i=this.passes.indexOf(t);i!==-1&&this.passes.splice(i,1)}isLastEnabledPass(t){for(let i=t+1;i<this.passes.length;i++)if(this.passes[i].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const i=this.renderer.getRenderTarget();let o=!1;for(let l=0,u=this.passes.length;l<u;l++){const d=this.passes[l];if(d.enabled!==!1){if(d.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(l),d.render(this.renderer,this.writeBuffer,this.readBuffer,t,o),d.needsSwap){if(o){const h=this.renderer.getContext(),p=this.renderer.state.buffers.stencil;p.setFunc(h.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),p.setFunc(h.EQUAL,1,4294967295)}this.swapBuffers()}ay!==void 0&&(d instanceof ay?o=!0:d instanceof wR&&(o=!1))}}this.renderer.setRenderTarget(i)}reset(t){if(t===void 0){const i=this.renderer.getSize(new dt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=i.width,this._height=i.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,i){this._width=t,this._height=i;const o=this._width*this._pixelRatio,l=this._height*this._pixelRatio;this.renderTarget1.setSize(o,l),this.renderTarget2.setSize(o,l);for(let u=0;u<this.passes.length;u++)this.passes[u].setSize(o,l)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class DR extends Do{constructor(t,i,o=null,l=null,u=null){super(),this.scene=t,this.camera=i,this.overrideMaterial=o,this.clearColor=l,this.clearAlpha=u,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new wt}render(t,i,o){const l=t.autoClear;t.autoClear=!1;let u,d;this.overrideMaterial!==null&&(d=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(u=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:o),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(u),this.overrideMaterial!==null&&(this.scene.overrideMaterial=d),t.autoClear=l}}const UR={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new wt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Ao extends Do{constructor(t,i=1,o,l){super(),this.strength=i,this.radius=o,this.threshold=l,this.resolution=t!==void 0?new dt(t.x,t.y):new dt(256,256),this.clearColor=new wt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let u=Math.round(this.resolution.x/2),d=Math.round(this.resolution.y/2);this.renderTargetBright=new Xi(u,d,{type:za}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let x=0;x<this.nMips;x++){const v=new Xi(u,d,{type:za});v.texture.name="UnrealBloomPass.h"+x,v.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(v);const M=new Xi(u,d,{type:za});M.texture.name="UnrealBloomPass.v"+x,M.texture.generateMipmaps=!1,this.renderTargetsVertical.push(M),u=Math.round(u/2),d=Math.round(d/2)}const h=UR;this.highPassUniforms=Fl.clone(h.uniforms),this.highPassUniforms.luminosityThreshold.value=l,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new qn({uniforms:this.highPassUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader}),this.separableBlurMaterials=[];const p=[3,5,7,9,11];u=Math.round(this.resolution.x/2),d=Math.round(this.resolution.y/2);for(let x=0;x<this.nMips;x++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(p[x])),this.separableBlurMaterials[x].uniforms.invSize.value=new dt(1/u,1/d),u=Math.round(u/2),d=Math.round(d/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=i,this.compositeMaterial.uniforms.bloomRadius.value=.1;const g=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=g,this.bloomTintColors=[new te(1,1,1),new te(1,1,1),new te(1,1,1),new te(1,1,1),new te(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Fl.clone(Xu.uniforms),this.blendMaterial=new qn({uniforms:this.copyUniforms,vertexShader:Xu.vertexShader,fragmentShader:Xu.fragmentShader,blending:Ep,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new wt,this._oldClearAlpha=1,this._basic=new _o,this._fsQuad=new Bm(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,i){let o=Math.round(t/2),l=Math.round(i/2);this.renderTargetBright.setSize(o,l);for(let u=0;u<this.nMips;u++)this.renderTargetsHorizontal[u].setSize(o,l),this.renderTargetsVertical[u].setSize(o,l),this.separableBlurMaterials[u].uniforms.invSize.value=new dt(1/o,1/l),o=Math.round(o/2),l=Math.round(l/2)}render(t,i,o,l,u){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const d=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),u&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=o.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=o.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let h=this.renderTargetBright;for(let p=0;p<this.nMips;p++)this._fsQuad.material=this.separableBlurMaterials[p],this.separableBlurMaterials[p].uniforms.colorTexture.value=h.texture,this.separableBlurMaterials[p].uniforms.direction.value=Ao.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[p]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[p].uniforms.colorTexture.value=this.renderTargetsHorizontal[p].texture,this.separableBlurMaterials[p].uniforms.direction.value=Ao.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[p]),t.clear(),this._fsQuad.render(t),h=this.renderTargetsVertical[p];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,u&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(o),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=d}_getSeparableBlurMaterial(t){const i=[];for(let o=0;o<t;o++)i.push(.39894*Math.exp(-.5*o*o/(t*t))/t);return new qn({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new dt(.5,.5)},direction:{value:new dt(.5,.5)},gaussianCoefficients:{value:i}},vertexShader:`varying vec2 vUv;
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
				}`})}}Ao.BlurDirectionX=new dt(1,0);Ao.BlurDirectionY=new dt(0,1);const Iu={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class LR extends Do{constructor(){super(),this.uniforms=Fl.clone(Iu.uniforms),this.material=new NT({name:Iu.name,uniforms:this.uniforms,vertexShader:Iu.vertexShader,fragmentShader:Iu.fragmentShader}),this._fsQuad=new Bm(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,i,o){this.uniforms.tDiffuse.value=o.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Lt.getTransfer(this._outputColorSpace)===Xt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===gy?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===vy?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===_y?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===bm?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===yy?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Sy?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===xy&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const qu=s=>`./${s.replace(/^\/+/,"")}`,mi={repair:{name:"维修器具",en:"WORKSHOP",color:"#95afa3"},life:{name:"生活用品",en:"EVERYDAY",color:"#d4b77f"},collect:{name:"旧世珍藏",en:"RELICS",color:"#bf9d98"}},eS=s=>({.5:"破损",.75:"磨损",.8:"可用",.9:"良好",1:"近新"})[s]??"未知",OR=s=>s===1?"原装":s===.65?"兼容替代":"仿制纪念品",xo={condition:{name:"外观检查",minutes:4,hint:"寻找三处使用痕迹，确认真实品相。"},function:{name:"功能测试",minutes:8,hint:"启动密闭测试台，检查性能档位。"},authenticity:{name:"编号核验",minutes:12,hint:"对照旧站档案，辨认出厂与维修印记。"}},Fn=[{id:"I01",name:"磁扣工具盒",category:"repair",base:60,sprite:0,imitation:!1,subtitle:"南站维修班 · 制式工具",lore:"内盖刻着历任维修工的名字。盒子传了四双手，最小的那把扳手始终没有离开过它的位置。",appearance:["锁扣边缘被磨得发亮","内衬留下不齐的工具压痕","提手缠过两层旧帆布"],functionClue:["磁扣连续吸合，锁定机构可靠。","磁扣吸力衰减，需要反复按压才能扣牢。"],code:"NS–03 / △",originalClue:"内盖三角维修印与南站第三批目录一致。",alternateClue:"内盖为后配板，维修印来自兼容批次。"},{id:"I02",name:"旧式蓄电池",category:"repair",base:60,sprite:1,imitation:!1,subtitle:"旧陆工厂 · 储能单元",lore:"壳体上还贴着一张褪色的值班表。停电之后，有人用它守过整整一夜的站台信号灯。",appearance:["接线座有暗绿色氧化层","外壳侧面留着旧补胶","底部有搬运留下的擦痕"],functionClue:["密闭测试台显示：容量档位正常。","密闭测试台显示：容量仅余六成，降级可用。"],code:"DL–60 / B14",originalClue:"型号与第十四批出厂记录相符。",alternateClue:"壳体原装，内部为后期兼容储能单元。"},{id:"I03",name:"折叠测距镜",category:"repair",base:120,sprite:2,imitation:!1,subtitle:"铁路测绘所 · 光学仪器",lore:"一块蓝布塞在镜筒缝里，用来挡住风沙。镜片里最后测过的路，如今已经不在地图上。",appearance:["折叠镜架略有歪斜","镜片边缘有细小划痕","校准环上沾着灰白粉末"],functionClue:["标尺在测试轨上准确对齐。","标尺偏移，测距效率下降到六成。"],code:"CL–12 / 7",originalClue:"镜筒校准位与原厂登记编号相合。",alternateClue:"校准环来自民间兼容维修件。"},{id:"I04",name:"黄铜压力表",category:"repair",base:80,sprite:3,imitation:!1,subtitle:"东泵站 · 仪表备件",lore:"铜圈上的小凹痕像一弯月亮。原主人说，那是泵站恢复供水那天，大家太高兴留下的。",appearance:["表盘外圈有月牙压痕","指针轴稍微松动","铜背板的颜色深浅不一"],functionClue:["标准气囊台：偏差在正常范围。","标准气囊台：指针偏差较大，降级可用。"],code:"DB–08 / 22",originalClue:"背面泵站维修印与二十二号档案一致。",alternateClue:"背板是兼容件，原厂封印已被替换。"},{id:"I05",name:"保温水壶",category:"life",base:80,sprite:4,imitation:!1,subtitle:"北线运输队 · 随行物资",lore:"壶底被敲平了两次，仍能稳稳放在桌上。把手缠着蓝布，内侧藏着一个名字的首字。",appearance:["内胆有不规则暗斑","壶盖边缘有细裂纹","蓝色布条包住了提手"],functionClue:["密封台：保温与密封档位正常。","密封台：保温效率下降，仍可使用。"],code:"BX–08 / 41",originalClue:"壶底工厂码与运输队物资目录相符。",alternateClue:"壶底编码来自后期兼容生产批次。"},{id:"I06",name:"长明台灯",category:"life",base:100,sprite:5,imitation:!1,subtitle:"站务室旧藏 · 夜班的光",lore:"开关被一代代夜班人磨得发亮。灯罩内侧写着一句小字：末班车到站，再熄灯。",appearance:["灯罩边缘有一处缺角","开关被手指磨得光滑","底座还粘着半张纸条"],functionClue:["灯光稳定，续航达到原设计档位。","灯光偏暗，续航降至正常的六成。"],code:"ZW–10 / L3",originalClue:"底座线序与站务原装电路图一致。",alternateClue:"底座线序是后配兼容电路。"},{id:"I07",name:"手摇应急电台",category:"life",base:100,sprite:6,imitation:!1,subtitle:"旧陆防务 · 短波接收机",lore:"它陪跑腿员走过三次沙暴。调到最左边的频段，偶尔还能听见远处有人报平安。",appearance:["摇柄握位留下浅浅指痕","天线接口曾经仔细补焊","皮革提手边缘略微起毛"],functionClue:["摇柄转动顺畅，信号指示达到三格。","摇柄空转，信号只能维持一格。"],code:"YL–10 / R09",originalClue:"防拆封签完整，生产批次与旧陆目录吻合。",alternateClue:"封签重贴，接收模块为兼容替代。"},{id:"I08",name:"陶芯滤水壶",category:"life",base:110,sprite:7,imitation:!1,subtitle:"聚落水务 · 家庭净水器",lore:"奶白色的滤芯外套着一只手缝布袋。卖家说孩子把它叫作“小水塔”，从不许别人碰倒。",appearance:["滤芯接口有反复旋拧痕迹","陶壳边缘有轻微磕碰","壶嘴下方积着白色水垢"],functionClue:["封闭检测台：过滤机构正常。","封闭检测台：流量效率下降至六成。"],code:"SW–11 / F6",originalClue:"滤芯封签日期与型号相互匹配。",alternateClue:"滤芯来自登记过的兼容工坊。"},{id:"I09",name:"车站翻页钟",category:"collect",base:90,sprite:8,imitation:!0,subtitle:"旧中央站 · 时间的残页",lore:"它曾挂在第三候车室。最后一班车离开之后，钟没有停，只是再也没人急着看它。",appearance:["翻页纸片有一角缺失","黑色面板已经褪成灰色","玻璃后面落着细细的沙"],functionClue:["翻页顺畅，每一格都准确落位。","翻页机构偶尔卡住，效率下降。"],code:"ZY–09 / T2",originalClue:"纸片字体与中央站原厂印版相同。",alternateClue:"纸片是后期补印，字体与原厂不同。"},{id:"I10",name:"发条鸣鸟",category:"collect",base:75,sprite:9,imitation:!0,subtitle:"旧城百货 · 会唱歌的小东西",lore:"尾巴的蓝漆掉了一半，旋律却还完整。没有人记得歌名，每个听过的人都说有点熟悉。",appearance:["尾部蓝色漆面部分剥落","底座边缘有一条旧焊缝","发条钥匙磨成了亮铜色"],functionClue:["上弦后完整奏出四小节旋律。","旋律断续，发条机构效率下降。"],code:"JC–75 / B5",originalClue:"底板冲压标记与旧城百货目录一致。",alternateClue:"底板为后压，属于复刻生产批次。"},{id:"I11",name:"旧城投影匣",category:"collect",base:150,sprite:10,imitation:!0,subtitle:"城市档案馆 · 一帧往日",lore:"匣子里装着一帧雨天的老街。如今聚落的孩子没见过下雨，却都认得画面里那把红伞。",appearance:["透镜表面有一层薄雾","插槽边缘被反复磨损","匣盖留着档案馆贴纸残片"],functionClue:["旧城街景投射清晰，进片稳定。","投影偏暗，进片偶有停顿。"],code:"DA–15 / P8",originalClue:"胶片序号与八型原装外壳匹配。",alternateClue:"胶片与外壳版本不符，是后配组合。"},{id:"I12",name:"铜轨纪念章盒",category:"collect",base:70,sprite:11,imitation:!0,subtitle:"铁路通车纪念 · 留给后来人",lore:"红绒盒衬换过一次，铜章还留着手心的光。背面刻着通车日期，那条铁路曾经通向海。",appearance:["铜章边缘的齿纹已变浅","盒衬是后来更换的红绒布","铰链附近有一圈油迹"],functionClue:["盒锁及展示机构正常开合。","盒锁松动，展示机构降级可用。"],code:"TL–70 / M1",originalClue:"压印年份与首次通车发行目录吻合。",alternateClue:"压印版式与原年份不符，是后来制作的。"}],ln=s=>Fn.find(t=>t.id===s);function tS(s){return s===6?{x:714,y:362,w:420,h:362}:{x:s%4*362,y:Math.floor(s/4)*362,w:362,h:362}}const Ci=[{id:"lin",name:"林鹭",title:"穿行沙海的跑腿员",sprite:0,preferences:["life","repair"],floor:.7,ask:1.1,budget:1,risk:!1,color:"#b88965",bio:"她记得每条小路，也记得路尽头的人。肩上的包，总比看起来更重一点。",lines:{intro:"门口这只铃铛真好听。你就是新来的店主吧？",revisit:["又碰面啦，我趁下一趟出发前绕过来。","路过南站，给你带了点新消息。"],sell:["这台{item}跟我跑了不少路，给它找个新主人吧。","包里装不下了。{item}，你收不收？"],buy:["下一趟要走得远，我想挑件能靠得住的东西。","找点{category}，好用比好看要紧。"],counter:["这个数，我还不够付今晚的车费呢。","再添一点吧，你知道好东西不常见。","最后这口价了，我真该赶路了。"],deal:["好，就这么定。它跟着你，我放心。","票子收好了。下次有好东西先来找你。"],refuse:["没事，买卖不成，路上见。","那我再背一程，说不定有人正需要。"],noStock:"没找到合适的，明天我再来看看。",inspect:["慢慢看。摇柄的地方是我自己补过的。","有问题问我，别看我记不住那些编号。"],special:"它陪我穿过三次沙暴。卖家说法，你听听就好。"}},{id:"zhou",name:"周砾",title:"南站的老维修工",sprite:1,preferences:["repair"],floor:.78,ask:1.08,budget:1.05,risk:!0,color:"#779b8f",bio:"不爱解释，擅长修复。他总说，零件有脾气，听懂就不难相处。",lines:{intro:"周砾。南站修东西的，有事去机房找我。",revisit:["手头活儿做完了，过来转转。","刚擦过手，不弄脏你柜台。"],sell:["{item}。换下来的，还能用，自己检查。","这件{item}腾出来了，你看着给。"],buy:["要件维修器具，能干活就行。","兼容件也收。标清来路，我自己会判断。"],counter:["太低。材料都不止这个数。","这个价不行，再想想。","最后一次。机房还有活等着。"],deal:["成。说好的数，不改了。","东西拿稳。要修，来找我。"],refuse:["不合适就算了，省得彼此耽误。","行，我带回去。"],noStock:"没合适的零件。我先回机房。",inspect:["测吧。用台子，别拿手碰接头。","看功能，再看编号。两回事。"],special:"原装也有坏的，替代件也有顶用的。"}},{id:"tao",name:"陶叔",title:"公共厨房的掌勺人",sprite:2,preferences:["life","collect"],floor:.68,ask:1.12,budget:1.1,risk:!1,color:"#c8b17c",bio:"掌着六十个人的饭勺，也记着六十个人的口味。他不愿意浪费任何东西。",lines:{intro:"小店主，叫我陶叔就成。饿了来厨房。",revisit:["趁锅里慢炖着，出来走动走动。","又来叨扰你了，今天生意怎么样？"],sell:["收拾库房找到的{item}，放着怪可惜。","{item}还挺好，给需要的人用吧。"],buy:["厨房缺点生活用品，耐用最要紧。","想找件{category}，用得顺手就好。"],counter:["再商量商量，厨房的预算紧呀。","这个数，叔心里还有点舍不得。","就到这儿吧，汤可不能熬过了。"],deal:["好，好。东西总算找着用处了。","说定了。晚上来喝碗热汤。"],refuse:["没关系，生意不急这一回。","那就先放着，回头再说。"],noStock:"不凑合，叔改天再来。",inspect:["细看是好事，做饭也得看火候。","后来配的地方，你都给我标清楚。"],special:"我买的是能亮一晚的灯，不是墙上的影子。"}},{id:"wen",name:"闻苇",title:"为旧世界做注的人",sprite:3,preferences:["collect","repair"],floor:.8,ask:1.22,budget:1.15,risk:!1,color:"#8ca8ad",bio:"随身带着卡片簿，正在整理一座不再存在的城市。她相信记得也是一种修复。",lines:{intro:"我是闻苇，在整理车站旧档案。很高兴这里又亮灯了。",revisit:["上回的条目补好了，顺便来看看。","又有一页空白等着填，今天有新东西吗？"],sell:["这件{item}有重复藏品，愿意转给你。","{item}的出身值得记，你先看实物。"],buy:["想找件编号清楚的旧物，版本很重要。","今天在查{category}的目录，有合适的吗？"],counter:["这个价格，还没有把完整性算进去。","我理解你的考量，但得再接近一些。","这是最后的余地，我不急着出手。"],deal:["谢谢。它的故事会留在档案里。","成交。我会记下今天的日期。"],refuse:["没关系，好的去处值得等一等。","那留给下一位有缘的人吧。"],noStock:"没有合适的版本。我下次再来。",inspect:["编号和功能要分别看，别被外壳带偏。","这里有一处细节，目录上恰好有。"],special:"我记录旧物，不代表我相信每一个故事。"}},{id:"que",name:"鹊姐",title:"跟着商队来的掮客",sprite:4,preferences:["collect","life"],floor:.82,ask:1.25,budget:.95,risk:!1,color:"#b18381",bio:"敲两下柜台是她的习惯。她谈价寸步不让，谈好的事却从不失约。",lines:{intro:"鹊姐。商队过路，顺便认识一下新邻居。",revisit:["又见面了，看看你有没有练出眼力。","商队还没走，咱们再做一笔？"],sell:["这件{item}，路上已经有人问过价了。","给你先看{item}，别让我白跑一趟。"],buy:["找点好转手的{category}，你的货架呢？","我不靠故事吃饭，拿实物出来说。"],counter:["这可不叫还价，这叫让我做慈善。","再往中间走一步，别兜圈子。","最后一口，大家都省点时间。"],deal:["痛快。说定的事，鹊姐从不反悔。","成交。票子当面点，交情慢慢处。"],refuse:["眼光不同，各走各的路。","好，改天再做买卖。"],noStock:"今天的货不对路，回见。",inspect:["尽管查。做生意，明白比好听重要。","这点时间我等得起，别光听故事。"],special:"价钱明着谈，来路写清楚，咱们就能长久。"}},{id:"kou",name:"阿扣",title:"总有新点子的杂工",sprite:5,preferences:["repair","life","collect"],floor:.62,ask:1.05,budget:.9,risk:!0,color:"#b4a482",bio:"成年以后接过的第一份活，是把站台的钟修好。修没修好另说，他从不轻易放弃。",lines:{intro:"我叫阿扣，什么活都接。你这儿缺帮手吗？",revisit:["又是我！今天捡到个有意思的东西。","活干完啦，过来看看你的新货。"],sell:["{item}，我本来想留着自己研究的。","这件{item}你看看，我保证没乱拆。"],buy:["想挑件{category}，不过我口袋不太鼓。","不确定的也行，标出来让我自己选。"],counter:["再高一点？我就能把欠的饭钱还上。","差一点点，真的就一点点。","最后一次啦，我得去接活了。"],deal:["成交！我就知道能谈成。","谢啦，回头帮你把门轴上点油。"],refuse:["好吧，我先抱回去研究。","没事，下回再来碰运气。"],noStock:"没有合适的呀，那我先去干活。",inspect:["这个我没试过，你测测看？","编号不认识。我只知道它能不能动。"],special:"旧的也有旧的好嘛，修修还能陪人很久。"}}],wi=s=>Ci.find(t=>t.id===s),pm=[["风从旧站台吹来","灰线旧货铺重新亮灯了。先做一笔踏实的生意，让这间屋子慢慢热闹起来。"],["有人记住了你的招牌","商队带来了新的消息。注意今日行情，手里的旧物，也许正是别人缺少的东西。"],["第一张租金单","今晚需支付 90 票租金。别把所有现金压在货架上；门口的社区委托也能帮上忙。"],["沙尘里的午后","午后有一场小沙尘，来客会带着满身风沙。好在灯还亮着，热水也还有。"],["旧物找到了新家","聚落开始习惯来这里找东西。每一件诚实标注的商品，都让招牌多一分可信。"],["最后一班商队","商队明天清早出发。留意货架上的珍藏，路过的人，也许会愿意带它们走远一点。"],["为明天留一盏灯","七日试营业的最后一天。结清 210 票租金，留足 120 票周转金，让故事继续。"]],zR={uniforms:{tDiffuse:{value:null},time:{value:0},texel:{value:new dt(.001,.001)}},vertexShader:"varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",fragmentShader:`uniform sampler2D tDiffuse; uniform float time; uniform vec2 texel; varying vec2 vUv;
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
    }`};function PR(s){const t=Qe.useRef(null),i=Qe.useRef(s);i.current=s;const[o,l]=Qe.useState(!1);return Qe.useEffect(()=>{const u=t.current;if(!u)return;let d;try{d=new bR({antialias:!1,alpha:!1,powerPreference:"low-power"})}catch{l(!0);return}let h=!1;d.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),d.outputColorSpace=ei,d.toneMapping=bm,d.toneMappingExposure=1.12,d.setClearColor("#262a23"),d.domElement.setAttribute("aria-label","HD-2D 灰线旧货铺场景，人物与旧物立于暖光柜台前"),d.domElement.setAttribute("role","img"),u.appendChild(d.domElement);const p=new bT,g=new nf(-8,8,4.5,-4.5,.1,60);g.position.set(0,0,18),g.lookAt(0,0,0);const x=new PT,v=[];function M(me){const Oe=x.load(me,void 0,void 0,()=>{h||l(!0)});return Oe.colorSpace=ei,Oe.magFilter=Di,Oe.minFilter=ji,v.push(Oe),Oe}const S=M(qu("art/shop.png")),T=M(qu("art/characters.png")),C=M(qu("art/items.png"));function E(me,Oe,Mt,Ut,L,A){const ee=new jl(me,Oe),he=new pi(ee,Mt);return he.position.set(Ut,L,A),p.add(he),v.push(ee,Mt),he}E(16.35,9.2,new _o({map:S}),0,0,-3);const y=S.clone();y.repeat.set(1,.22),y.offset.set(0,0),v.push(y),E(16.35,9.2*.22,new _o({map:y,transparent:!1}),0,-9.2*.39,2),p.add(new GT("#ffe2b9",2.3));const O=new HT("#ffe0a3",2.1);O.position.set(-7,4,6),p.add(O);const P=new BT("#ffad48",18,9,2);P.position.set(5.6,-1.6,4),p.add(P);const U=T.clone();U.repeat.set(1/6,1),v.push(U);const F=E(4.7,9.4,new up({map:U,transparent:!0,alphaTest:.18,roughness:1,metalness:0,side:oa}),-2.5,-1.3,.4),H=new pi(new Om(1.25,32),new _o({color:"#1a100a",transparent:!0,opacity:.25,depthWrite:!1}));H.scale.y=.16,H.position.set(-2.5,-3.3,.35),p.add(H),v.push(H.geometry,H.material);const I=[],k=[];for(let me=0;me<9;me++){const Oe=C.clone();Oe.repeat.set(.25,1/3),v.push(Oe),k.push(Oe);const Mt=new up({map:Oe,transparent:!0,alphaTest:.12,roughness:.9,metalness:.05}),Ut=E(me===8?2.1:.93,me===8?2.1:.93,Mt,me===8?.6:.85+me%4*1.02,me===8?-2.45:me<4?1.24:-.46,me===8?2.1:-2.4);I.push(Ut)}const N=new up({color:"#b8813f",metalness:.75,roughness:.4}),w=new pi(new wo(7,.022,.08),N);w.position.set(.2,-3.43,2.2),p.add(w),v.push(w.geometry,N);const G=new Yi,ae=55,de=new Float32Array(ae*3);for(let me=0;me<ae;me++)de[me*3]=Math.sin(me*79.31)*8,de[me*3+1]=Math.cos(me*33.1)*4.5,de[me*3+2]=Math.sin(me)*2;G.setAttribute("position",new qi(de,3));const _e=new jy({color:"#ffdf9c",size:.025,transparent:!0,opacity:.42,depthWrite:!1}),fe=new wT(G,_e);p.add(fe),v.push(G,_e);const X=new NR(d);X.addPass(new DR(p,g));const se=new Ao(new dt(800,450),.19,.45,.85);X.addPass(se);const Y=new $y(zR);X.addPass(Y);const xe=new LR;X.addPass(xe);let Me=0,ze=0;function ot(){Me=u.clientWidth,ze=u.clientHeight,d.setSize(Me,ze),X.setSize(Me,ze);const me=Me/ze,Oe=me>16/9?8:4.5*me,Mt=me>16/9?8/me:4.5;g.left=-Oe,g.right=Oe,g.top=Mt,g.bottom=-Mt,g.updateProjectionMatrix(),Y.uniforms.texel.value.set(1/Me,1/ze)}const ht=new ResizeObserver(ot);ht.observe(u),ot();let B=0,le=0;function J(me){const Oe=u.getBoundingClientRect();B=(me.clientX-Oe.left)/Oe.width-.5,le=(me.clientY-Oe.top)/Oe.height-.5}function ie(){B=0,le=0}u.addEventListener("pointermove",J),u.addEventListener("pointerleave",ie);const Te=new Yy,De=F.material;let Re=0,be=0,ce=null,D=!1,lt=null;const tt=Array(9).fill(""),$e=Array(9).fill(-2);function Pe(){if(Re=requestAnimationFrame(Pe),document.hidden||i.current.suspended){be=Te.getElapsedTime();return}const me=i.current,Oe=Te.getElapsedTime();if(Oe-be<1/30)return;const Mt=Math.min(.05,Oe-be);be=Oe;const Ut=1-Math.exp(-Mt*7);if(_e.opacity=me.day===4?.58:.35,me.reducedMotion)ce=me.npc,D=me.active,lt=null,De.opacity=1;else if(me.npc!==ce||lt!==null){if(ce){lt??(lt=Oe);const ye=Math.min(1,(Oe-lt)/.46);F.position.x+=(-7-F.position.x)*Ut,De.opacity=1-ye,ye>=1&&(ce=null,lt=null)}!ce&&me.npc&&(ce=me.npc,D=me.active,F.position.set(-6.4,-.58,-.3),F.scale.setScalar(.64),De.opacity=0)}ce===me.npc&&lt===null&&(D=me.active),F.visible=!!ce,H.visible=!!ce,U.offset.set((ce?wi(ce).sprite:0)/6,0);const L=D?-2.7:-4,A=D?-1.3:-.58,ee=D?Math.min(1,(g.top+1.2)/4.7):Math.min(.64,(g.top+.5)/4.7);if(lt===null){const ye=me.reducedMotion?1:Ut;F.position.x+=(L-F.position.x)*ye,F.position.y+=(A-F.position.y)*ye,F.position.z+=((D?.6:-.3)-F.position.z)*ye,F.scale.setScalar(F.scale.x+(ee-F.scale.x)*ye),De.opacity+=(1-De.opacity)*ye}const he=Math.abs(F.position.x-L)>.08;F.rotation.z=me.reducedMotion?0:Math.sin(Oe*(he?11:1.8))*(he?.012:.002),me.reducedMotion||(F.position.y+=Math.sin(Oe*(he?11:2))*(he?.006:.001)),u.dataset.actorState=lt!==null?"leaving":ce?he?"entering":D?"counter":"waiting":"empty",H.position.x=F.position.x;const Ee=me.inventory.filter(ye=>ye.displayed);for(let ye=0;ye<9;ye++){const ke=ye===8?me.item:Ee[ye],We=I[ye];if(We.visible=!!ke,ke){tt[ye]!==ke.uid&&(tt[ye]=ke.uid,$e[ye]=Oe);const Ae=tS(ln(ke.defId).sprite);k[ye].repeat.set(Ae.w/1448,Ae.h/1086),k[ye].offset.set(Ae.x/1448,1-(Ae.y+Ae.h)/1086);const Be=Math.max(Ae.w,Ae.h),qe=1-(1-(me.reducedMotion?1:Math.min(1,(Oe-$e[ye])/.45)))**3;We.scale.set(Ae.w/Be*(.8+qe*.2),Ae.h/Be*(.8+qe*.2),1),We.position.y=(ye===8?-2.45:ye<4?1.24:-.46)+(1-qe)*.28,ye===8&&(We.position.x=.6-(1-qe)*.8)}else tt[ye]=""}const pe=me.minute/360;d.toneMappingExposure=1.1-pe*.15,P.intensity=18+(me.reducedMotion?0:Math.sin(Oe*3)*.5);const je=Me/ze<1.1?-2.1:0;me.reducedMotion?(g.position.set(je,0,18),g.lookAt(je,0,0)):(g.position.x+=(je+B*.2-g.position.x)*.025,g.position.y+=(-le*.12-g.position.y)*.025,g.lookAt(je,0,0),fe.position.y=Oe*.025%3,fe.position.x=Math.sin(Oe*.08)*.2),Y.uniforms.time.value=me.reducedMotion?0:Oe,X.render()}Pe();const at=me=>{me.preventDefault(),h||l(!0)};return d.domElement.addEventListener("webglcontextlost",at),()=>{h=!0,cancelAnimationFrame(Re),ht.disconnect(),u.removeEventListener("pointermove",J),u.removeEventListener("pointerleave",ie),d.domElement.removeEventListener("webglcontextlost",at);for(const me of v)me.dispose();X.dispose(),se.dispose(),Y.dispose(),xe.dispose(),d.dispose(),d.domElement.remove()}},[]),m.jsx("div",{ref:t,className:`shop-render ${o?"fallback":""}`,children:o&&m.jsxs(m.Fragment,{children:[m.jsx("div",{className:"fallback-room"}),s.npc&&m.jsx("div",{className:"fallback-person",style:{backgroundPositionX:`${wi(s.npc).sprite*20}%`}}),s.item&&m.jsx("div",{className:"fallback-item item-sprite",style:{backgroundPosition:`${ln(s.item.defId).sprite%4*100/3}% ${Math.floor(ln(s.item.defId).sprite/4)*50}%`}})]})})}const mm=[{name:"旧铜线",category:"repair"},{name:"搪瓷杯",category:"life"},{name:"旧站车票",category:"collect"},{name:"齿轮零件",category:"repair"},{name:"棉布手套",category:"life"},{name:"褪色明信片",category:"collect"}],IR=()=>({condition:!0,function:!0,authenticity:!0});function BR(s){let t=2166136261;for(const i of s)t=Math.imul(t^i.charCodeAt(0),16777619);return t>>>0||1}function lr(s){let t=s.rng;return t^=t<<13,t^=t>>>17,t^=t<<5,s.rng=t>>>0,s.rng/4294967296}function _s(s,t){return t[Math.floor(lr(s)*t.length)]}function Ms(s,t){const i=ln(s.defId);return Math.max(5,Math.floor(i.base*s.condition*s.function*s.authenticity*t[i.category]+.5+1e-9))}function Qu(s,t){const i=ln(s.defId),o=i.base*(s.revealed.condition?s.condition:s.claimed.condition)*(s.revealed.function?s.function:s.claimed.function)*(s.revealed.authenticity?s.authenticity:s.claimed.authenticity)*t[i.category],l=Object.values(s.revealed).every(Boolean);return{center:o,exact:l,low:Math.max(5,Math.floor(o*.7+.5)),high:Math.max(5,Math.floor(o*1.3+.5)),price:Ms(s,t)}}function Ts(s){var t;return((t=s.trade)==null?void 0:t.role)==="seller"?s.trade.item:s.inventory.find(i=>{var o;return i.uid===((o=s.trade)==null?void 0:o.selected)})}function Ju(s){if(!s.trade||s.trade.role!=="buyer")return[];const t=wi(s.trade.npc);return s.inventory.filter(i=>i.displayed&&ln(i.defId).category===s.trade.category&&(i.revealed.authenticity||i.riskLabel&&t.risk))}function nS(s,t){if(!s.trade)return 0;const i=wi(s.trade.npc),o=Ms(t,s.market);return s.trade.role==="seller"?Math.ceil(o*i.floor-1e-9):Math.floor(o*i.budget*(t.revealed.authenticity?1:.8)+1e-9)}const iS=s=>`${String(10+Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`,sf=s=>s===3?90:s===7?210:0,vn=s=>360-s.minute;function $u(s){var t;return(t=s.trade)!=null&&t.locked?vn(s)<6?"剩余营业时间不足 6 分钟":s.trade.role==="seller"&&s.cash<s.trade.price?"现金不足，不能完成收购":s.trade.role==="seller"&&s.inventory.length>=12?"库存已满，需要一个空格":Ts(s)?"":"商品已不在柜台":"请先谈定价格"}function yo(s,t,i,o,l,u=0,d=!1){return{uid:`item-${s.nextId++}`,defId:t,condition:i,function:o,authenticity:l,cost:u,displayed:d,riskLabel:!1,listPrice:0,claimed:{condition:.9,function:1,authenticity:1},revealed:d?IR():{condition:!1,function:!1,authenticity:!1}}}function aS(s){s.minute=0,s.cursor=0,s.trade=null,s.report=null,s.phase="open",s.commission="available",s.sorted=[],s.recycled=0,s.inspection=null;const t=[1.15,1,.85];for(let l=t.length-1;l>0;l--){const u=Math.floor(lr(s)*(l+1));[t[l],t[u]]=[t[u],t[l]]}s.market=s.day===1?{repair:1,life:1,collect:1}:{repair:t[0],life:t[1],collect:t[2]};const i=Ci.flatMap(l=>[l.id,l.id]);s.queue=[];const o=s.day===1?["lin","tao","zhou"]:[];for(const l of o)s.queue.push(l),i.splice(i.indexOf(l),1);for(;s.queue.length<(s.day===1?6:8);){const l=Math.floor(lr(s)*i.length);s.queue.push(i.splice(l,1)[0])}s.notice=s.day===1?"瓶盖门铃响了。第一位客人已经等在门边。":`第 ${s.day} 天，开门营业。今日行情已更新。`}function Yu(s="TUTORIAL-001"){const t={version:1,seed:s,rng:BR(s),day:1,minute:0,cash:180,reputation:50,sold:0,phase:"open",inventory:[],market:{repair:1,life:1,collect:1},queue:[],cursor:0,trade:null,ledger:[],report:null,commission:"available",sorted:[],recycled:0,inspection:null,discovered:["I01","I05","I06"],notice:"",nextId:1};t.inventory=[yo(t,"I01",.8,1,1,25,!0),yo(t,"I05",.75,1,1,35,!0),yo(t,"I06",.9,1,1,55,!0)];for(const i of t.inventory)i.listPrice=Math.round(Ms(i,t.market)*1.1);return aS(t),t}function Nl(s,t,i,o,l,u){s.cash+=o,s.ledger.push({id:s.nextId++,day:s.day,minute:s.minute,kind:t,label:i,amount:o,cost:l,risk:u})}function gn(s,t){return s.notice=t,s}function Bu(s,t){return s.trade=null,s.inspection=null,s.cursor++,(s.minute>=360||s.cursor>=s.queue.length)&&(s.phase="closing"),gn(s,t)}function sy(s,t,i){return s.replaceAll("{item}",t).replaceAll("{category}",mi[i].name)}function ry(s,t){const i=s.trade,o=Ju(s).find(l=>l.uid===t);!o||i.locked||(i.selected=t,i.price=i.offers[t]??Math.floor(nS(s,o)*.78),i.offers[t]=i.price)}function gm(s,t){const i=Ts(s);if(!i||!s.trade||s.trade.offended)return!1;const o=s.trade.role==="seller"?Math.min(t,s.trade.price):Math.max(t,s.trade.price),l=Qu(i,s.market).center;return s.trade.role==="seller"?o<l*.35:o>l*1.8}function yp(s,t){var o,l,u,d,h,p,g,x,v,M;const i=structuredClone(s);if(i.phase==="ending")return s;if(t.type==="BACK")return i.phase==="closing"&&i.minute<360&&(i.phase="open"),i;if(t.type==="NEXT")return i.phase!=="report"?s:i.outcome||i.day===7?(i.phase="ending",i):(i.day++,aS(i),i);if(t.type==="SETTLE"){if(i.phase!=="closing")return s;if(i.inspection||i.commission==="active")return gn(i,"请先完成进行中的鉴定或委托。");i.trade&&Bu(i,"打烊了，客人向你道别。");const S=i.ledger.filter(C=>C.day===i.day),T={day:i.day,income:S.filter(C=>C.amount>0).reduce((C,E)=>C+E.amount,0),purchases:-S.filter(C=>C.kind==="purchase").reduce((C,E)=>C+E.amount,0),gross:S.filter(C=>C.kind==="sale").reduce((C,E)=>C+E.amount-(E.cost??0),0),fees:0,cash:i.cash,missing:0};for(const[C,E,y]of[["supplies","每日耗材",15],["rent",`第 ${i.day} 天租金`,sf(i.day)]])if(y){if(i.cash<y){T.missing=y-i.cash,i.outcome="bankrupt";break}Nl(i,C,E,-y),T.fees+=y}return T.cash=i.cash,i.report=T,!i.outcome&&i.day===7&&(i.outcome=i.cash>=120&&i.reputation>=40&&i.sold>=12?"win":"survive"),i.phase="report",i}if(i.phase!=="open")return s;if(t.type==="CLOSE")return i.inspection||i.commission==="active"?gn(i,"先完成手头的鉴定或分拣，再打烊吧。"):(i.phase="closing",i);if(t.type==="ARRIVE"){if(i.trade||i.inspection||i.commission==="active"||i.cursor>=i.queue.length)return s;if(vn(i)<6)return gn(i,"剩余时间不足以接待新客人，可以打烊了。");i.minute+=6;const S=wi(i.queue[i.cursor]),T=i.cursor%2===0?"seller":"buyer",C=i.queue.slice(0,i.cursor).includes(S.id);i.trade={id:`trade-${i.nextId++}`,npc:S.id,role:T,category:_s(i,S.preferences),price:0,rounds:0,locked:!1,offended:!1,offers:{},line:"",repeat:C};const E=i.trade;if(T==="seller"){let O;if(i.day===1&&i.cursor===0)O=yo(i,"I07",.9,1,1);else if(i.day===1&&i.cursor===2)O=yo(i,"I02",.8,.6,1),O.claimed.condition=1;else{const P=_s(i,Fn),U=lr(i),F=U<.7?1:U<.9||!P.imitation?.65:.3,H=lr(i),I=H<.1?.5:H<.3?.75:H<.6?.8:H<.85?.9:1;O=yo(i,P.id,I,lr(i)<.8?1:.6,F)}E.item=O,E.category=ln(O.defId).category,E.price=Math.ceil(Ms(O,i.market)*S.ask-1e-9),E.line=sy(_s(i,S.lines.sell),ln(O.defId).name,E.category),i.discovered.includes(O.defId)||i.discovered.push(O.defId)}else{const O=i.inventory.filter(U=>U.displayed&&(U.revealed.authenticity||S.risk&&U.riskLabel));E.category=i.day===1&&i.cursor===1?"life":O.length&&lr(i)<.7?ln(_s(i,O).defId).category:_s(i,Object.keys(mi)),E.line=sy(_s(i,S.lines.buy),"",E.category);const P=Ju(i);P.length&&ry(i,P[0].uid)}const y=C?_s(i,S.lines.revisit):i.day===1?S.lines.intro:"";return gn(i,y||E.line)}if(t.type==="SELECT")return((o=i.trade)==null?void 0:o.role)==="buyer"&&!i.inspection&&ry(i,t.uid),i;if(t.type==="START_CHECK"){if(i.inspection||i.commission==="active"||(l=i.trade)!=null&&l.locked)return s;const S=((d=(u=i.trade)==null?void 0:u.item)==null?void 0:d.uid)===t.uid?i.trade.item:i.inventory.find(T=>T.uid===t.uid);return!S||S.revealed[t.check]?s:vn(i)<xo[t.check].minutes?gn(i,"营业时间不足，无法开始这项检查。"):(i.minute+=xo[t.check].minutes,i.trade&&(i.trade.line=wi(i.trade.npc).lines.inspect[t.check==="authenticity"?1:0]),i.inspection={uid:S.uid,check:t.check,progress:0},i)}if(t.type==="CHECK_STEP"){const S=i.inspection;if(!S)return s;if(S.progress++,S.progress>=(S.check==="condition"?3:1)){const T=((p=(h=i.trade)==null?void 0:h.item)==null?void 0:p.uid)===S.uid?i.trade.item:i.inventory.find(C=>C.uid===S.uid);return T&&(T.revealed[S.check]=!0),i.inspection=null,i.minute>=360&&(i.phase="closing"),gn(i,`${xo[S.check].name}完成。证据已记入物品档案。`)}return i}if(t.type==="OFFER"||t.type==="ACCEPT"){const S=i.trade,T=Ts(i);if(!S||!T||S.locked||i.inspection||S.rounds>=3)return s;if(vn(i)<10)return gn(i,"报价和交割共需至少 10 分钟。");const C=t.type==="ACCEPT"?S.price:t.price;if(!Number.isFinite(C)||C<1||!Number.isInteger(C))return gn(i,"请输入大于零的整数价格。");const E=S.role==="seller"?Math.min(C,S.price):Math.max(C,S.price);if(t.type==="OFFER"&&gm(i,E)&&!t.acknowledge)return s;t.type==="OFFER"&&gm(i,E)&&(i.reputation=Math.max(0,i.reputation-2),S.offended=!0),i.minute+=4,S.rounds++;const y=nS(i,T),O=wi(S.npc);return t.type==="ACCEPT"||(S.role==="seller"?E>=y:E<=y)?(S.price=E,S.locked=!0,S.line="价钱谈妥了。确认交割后，票子和旧物才会易手。",gn(i,`双方同意 ${E} 票。请确认交割。`)):S.rounds===3?Bu(i,`${O.name}：${O.lines.refuse[0]}（三轮报价结束）`):(S.price=S.role==="seller"?Math.ceil((S.price+y)/2):Math.floor((S.price+y)/2),S.selected&&(S.offers[S.selected]=S.price),S.line=O.lines.counter[S.rounds-1],gn(i,`${O.name}还价 ${S.price} 票。`))}if(t.type==="DELIVER"){const S=i.trade;if(!S||S.id!==t.tradeId||!S.locked)return s;const T=$u(i);if(T)return gn(i,T);const C=Ts(i),E=ln(C.defId).name;i.minute+=6,S.role==="seller"?(C.cost=S.price,C.listPrice=Math.round(Ms(C,i.market)*1.1),C.displayed=!1,i.inventory.push(C),Nl(i,"purchase",`收购 · ${E}`,-S.price)):(i.inventory=i.inventory.filter(O=>O.uid!==C.uid),i.sold++,Object.values(C.revealed).every(Boolean)&&(i.reputation=Math.min(100,i.reputation+1)),Nl(i,"sale",`出售 · ${E}`,S.price,C.cost,!C.revealed.authenticity));const y=`${wi(S.npc).name}：${_s(i,wi(S.npc).lines.deal)}`;return Bu(i,y)}if(t.type==="DISMISS"){if(!i.trade||i.inspection)return s;const S=wi(i.trade.npc).name;return i.minute=Math.min(360,i.minute+2),Bu(i,`${S}收好行囊，向你道别。没有成交，也没有信誉损失。`)}if(t.type==="DISPLAY"){const S=i.inventory.find(T=>T.uid===t.uid);return!S||((g=i.trade)==null?void 0:g.selected)===S.uid||((x=i.inspection)==null?void 0:x.uid)===S.uid?s:S.displayed?(S.displayed=!1,gn(i,"已移回仓库。")):i.inventory.filter(T=>T.displayed).length>=8?gn(i,"8 个陈列位已满，请先撤下一件商品。"):!S.revealed.authenticity&&!t.riskLabel?gn(i,"请先核验编号，或明确使用“未核验”标签。"):(S.riskLabel=!S.revealed.authenticity,S.displayed=!0,gn(i,`已上架${S.riskLabel?"，标签：未核验":"，标签与已知属性一致"}。`))}if(t.type==="PRICE"){const S=i.inventory.find(T=>T.uid===t.uid);return S&&Number.isInteger(t.price)&&t.price>0&&((v=i.trade)==null?void 0:v.selected)!==S.uid&&(S.listPrice=t.price),i}if(t.type==="RECYCLE"){if(i.recycled>=2||vn(i)<6||i.inspection||i.commission==="active")return s;const S=i.inventory.find(C=>C.uid===t.uid);if(!S||((M=i.trade)==null?void 0:M.selected)===S.uid)return s;i.inventory=i.inventory.filter(C=>C.uid!==S.uid),i.minute+=6,i.recycled++;const T=Math.floor(Ms(S,i.market)*.35);return Nl(i,"recycle",`回收 · ${ln(S.defId).name}`,T,S.cost),i.minute>=360&&(i.phase="closing"),gn(i,`回收箱入账 ${T} 票。回收不计入售出成绩。`)}if(t.type==="COMMISSION")return i.trade||i.inspection||i.commission!=="available"||vn(i)<90?s:(i.minute+=90,i.commission="active",i.sorted=[],gn(i,"将六件物资分入对应类别，完成可得 40 票。"));if(t.type==="SORT"||t.type==="SORT_ALL"){if(i.commission!=="active")return s;if(t.type==="SORT_ALL")i.sorted=mm.map((S,T)=>T);else{const S=mm[t.index];if(!S||S.category!==t.category)return gn(i,"再想一想，这件物资更适合另一个类别。不会扣钱或信誉。");i.sorted.includes(t.index)||i.sorted.push(t.index)}return i.sorted.length===6?(i.commission="done",Nl(i,"commission","社区分拣委托",40),i.minute>=360&&(i.phase="closing"),gn(i,"分拣完成！社区支付了 40 票报酬。")):i}return s}const Wu="greyline-save-v1";function sS(s){var t,i;if(!s)return null;try{let o=function(p){return!!p&&typeof p.uid=="string"&&Fn.some(g=>g.id===p.defId)&&!!p.claimed&&!!p.revealed&&h(p.condition,[.5,.75,.8,.9,1])&&h(p.function,[.6,1])&&h(p.authenticity,[.3,.65,1])&&h(p.claimed.condition,[.5,.75,.8,.9,1])&&h(p.claimed.function,[.6,1])&&h(p.claimed.authenticity,[.3,.65,1])&&["condition","function","authenticity"].every(g=>typeof p.revealed[g]=="boolean")&&d(p.cost,0)&&d(p.listPrice,0)&&typeof p.displayed=="boolean"&&typeof p.riskLabel=="boolean"};const l=JSON.parse(s),u=["open","closing","report","ending"],d=(p,g,x=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(p)&&p>=g&&p<=x,h=(p,g)=>g.includes(p);if(l.version!==1||typeof l.seed!="string"||!d(l.day,1,7)||!u.includes(l.phase)||!d(l.cash,0)||!d(l.reputation,0,100)||!d(l.sold,0,54)||!d(l.minute,0,360)||!Array.isArray(l.inventory)||l.inventory.length>12||!l.inventory.every(o)||new Set(l.inventory.map(p=>p.uid)).size!==l.inventory.length||!Array.isArray(l.ledger)||!l.ledger.every(p=>p&&d(p.id,1)&&d(p.day,1,7)&&d(p.minute,0,360)&&Number.isSafeInteger(p.amount)&&typeof p.label=="string"&&["purchase","sale","commission","recycle","supplies","rent"].includes(p.kind)&&(p.cost===void 0||d(p.cost,0)))||!Array.isArray(l.queue)||l.queue.length!==(l.day===1?6:8)||!l.queue.every(p=>Ci.some(g=>g.id===p))||!d(l.cursor,0,l.queue.length)||!l.market||!["repair","life","collect"].every(p=>h(l.market[p],[.85,1,1.15]))||!Array.isArray(l.sorted)||!l.sorted.every(p=>d(p,0,5))||new Set(l.sorted).size!==l.sorted.length||!["available","active","done"].includes(l.commission)||!d(l.recycled,0,2)||!Array.isArray(l.discovered)||!l.discovered.every(p=>Fn.some(g=>g.id===p))||!d(l.nextId,1)||!d(l.rng,0,4294967295)||typeof l.notice!="string")return null;if(l.trade){const p=l.trade;if(!Ci.some(g=>g.id===p.npc)||!["seller","buyer"].includes(p.role)||!Object.hasOwn(mi,p.category)||typeof p.id!="string"||typeof p.line!="string"||typeof p.locked!="boolean"||typeof p.offended!="boolean"||!p.offers||!Object.values(p.offers).every(g=>d(g,0))||!d(p.price,0)||!d(p.rounds,0,3)||p.role==="seller"&&!o(p.item)||p.selected&&!l.inventory.some(g=>g.uid===p.selected))return null}return l.inspection&&(!Object.hasOwn(xo,l.inspection.check)||!d(l.inspection.progress,0,l.inspection.check==="condition"?2:0)||!(((i=(t=l.trade)==null?void 0:t.item)==null?void 0:i.uid)===l.inspection.uid||l.inventory.some(p=>p.uid===l.inspection.uid)))||l.outcome&&!["win","survive","bankrupt"].includes(l.outcome)||l.report&&!["day","income","purchases","gross","fees","cash","missing"].every(p=>Number.isSafeInteger(l.report[p]))||l.phase==="report"&&!l.report||l.phase==="ending"&&!l.outcome?null:l}catch{return null}}function fr({id:s,className:t=""}){const i=tS(ln(s).sprite),o=Qe.useId();return m.jsx("span",{role:"img","aria-label":ln(s).name,className:`item-sprite ${t}`,children:m.jsxs("svg",{"aria-hidden":"true",viewBox:`${i.x} ${i.y} ${i.w} ${i.h}`,preserveAspectRatio:"xMidYMid meet",children:[m.jsx("defs",{children:m.jsx("clipPath",{id:o,children:m.jsx("rect",{x:i.x,y:i.y,width:i.w,height:i.h})})}),m.jsx("image",{href:qu("art/items.png"),width:"1448",height:"1086",clipPath:`url(#${o})`})]})})}function rS({index:s,className:t=""}){return m.jsx("span",{"aria-hidden":"true",className:`portrait ${t}`,style:{backgroundPositionX:`${s*20}%`}})}function Ni({amount:s}){return m.jsxs("span",{className:"money",children:[s.toLocaleString(),m.jsx("small",{children:"票"})]})}function hi({title:s,subtitle:t,children:i,onClose:o,wide:l=!1,dismissible:u=!0}){const d=Qe.useRef(null),h=Qe.useRef(o);return h.current=o,Qe.useEffect(()=>{var x;const p=document.activeElement;(x=d.current)==null||x.focus();function g(v){var M;if(v.key==="Escape"&&u&&(v.stopPropagation(),h.current()),v.key==="Tab"){const S=Array.from(((M=d.current)==null?void 0:M.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]'))??[]),T=S[0],C=S[S.length-1];v.shiftKey&&(document.activeElement===T||document.activeElement===d.current)?(v.preventDefault(),C==null||C.focus()):!v.shiftKey&&document.activeElement===C&&(v.preventDefault(),T==null||T.focus())}}return document.addEventListener("keydown",g),()=>{document.removeEventListener("keydown",g),p==null||p.focus()}},[u]),m.jsx("div",{className:"modal-backdrop",onMouseDown:p=>{p.target===p.currentTarget&&u&&o()},children:m.jsxs("div",{ref:d,tabIndex:-1,role:"dialog","aria-modal":"true","aria-label":s,className:`modal ${l?"modal-wide":""}`,children:[m.jsxs("header",{className:"modal-heading",children:[m.jsxs("div",{children:[m.jsx("span",{className:"eyebrow",children:t??"GREYLINE TRADING POST"}),m.jsx("h2",{children:s})]}),u&&m.jsx("button",{className:"icon-button","aria-label":"关闭窗口",onClick:o,children:m.jsx(Em,{size:22})})]}),m.jsx("div",{className:"modal-content",children:i})]})})}function Fm({item:s,state:t}){const i=Qu(s,t.market);return m.jsxs("div",{className:"valuation",children:[m.jsxs("div",{children:[m.jsx("span",{children:i.exact?"今日参考价值":"当前估值区间"}),m.jsx("span",{className:i.exact?"verified-text":"",children:i.exact?m.jsxs(m.Fragment,{children:[m.jsx(xm,{size:12})," 已核验"]}):"未经完整验证"})]}),m.jsxs("strong",{children:[i.exact?i.price:`${i.low} – ${i.high}`,m.jsx("small",{children:"票"})]}),!i.exact&&m.jsx("p",{children:"检查实物，缩小信息差。故事不等于证据。"})]})}function Hm({item:s}){return m.jsxs("div",{className:"evidence-list",children:[m.jsxs("div",{children:[m.jsx("span",{children:"品相"}),m.jsx("b",{className:s.revealed.condition?"":"unknown",children:s.revealed.condition?eS(s.condition):"待检查"})]}),m.jsxs("div",{children:[m.jsx("span",{children:"功能"}),m.jsx("b",{className:s.revealed.function?"":"unknown",children:s.revealed.function?s.function===1?"正常":"降级可用 · 60%":"待测试"})]}),m.jsxs("div",{children:[m.jsx("span",{children:"来源"}),m.jsx("b",{className:s.revealed.authenticity?"":"unknown",children:s.revealed.authenticity?OR(s.authenticity):"待核验"})]})]})}function FR({state:s,targetUid:t,send:i,onClose:o,assist:l}){var y,O,P,U,F,H,I,k;const[u,d]=Qe.useState("condition"),[h,p]=Qe.useState([]),g=((y=s.inspection)==null?void 0:y.uid)??t,x=((P=(O=s.trade)==null?void 0:O.item)==null?void 0:P.uid)===g?s.trade.item:s.inventory.find(N=>N.uid===g)??Ts(s),v=((U=s.inspection)==null?void 0:U.check)??u;if(Qe.useEffect(()=>{p([])},[(F=s.inspection)==null?void 0:F.uid,(H=s.inspection)==null?void 0:H.check]),!x)return m.jsx("p",{children:"请先在货架或柜台选择一件物品。"});const M=ln(x.defId),S=((I=s.inspection)==null?void 0:I.uid)===x.uid;function T(N){h.includes(N)||(p(w=>[...w,N]),i({type:"CHECK_STEP"}))}function C(N){d(N),i({type:"START_CHECK",uid:x.uid,check:N})}function E(){var w;const N=v==="condition"?3-(((w=s.inspection)==null?void 0:w.progress)??0):1;for(let G=0;G<N;G++)i({type:"CHECK_STEP"})}return m.jsxs("div",{className:"inspection-layout",children:[m.jsxs("div",{className:"inspection-art",children:[m.jsx("div",{className:"workbench-grid"}),m.jsxs("span",{className:"eyebrow",children:[M.id," / INSPECTION TABLE"]}),m.jsx(fr,{id:x.defId,className:"inspection-sprite"}),S&&v==="condition"&&!l&&m.jsx("div",{className:"hotspots",children:[0,1,2].map(N=>m.jsx("button",{disabled:h.includes(N),className:`hotspot hotspot-${N}`,onClick:()=>T(N),"aria-label":`检查第 ${N+1} 处痕迹`,children:h.includes(N)?m.jsx(Ia,{size:17}):N+1},N))}),S&&v!=="condition"&&m.jsxs("div",{className:"test-instrument",children:[m.jsx("span",{children:v==="function"?"密闭功能检测台":"旧站档案 · 编号比对"}),m.jsx("strong",{children:v==="function"?"READY":M.code}),m.jsxs("button",{className:"button primary",onClick:E,children:[v==="function"?m.jsx(Fu,{size:16}):m.jsx(Sm,{size:16}),v==="function"?"启动检测":"与目录比对"]})]}),m.jsx("div",{className:"inspection-art-caption",children:S?"检查进行中 · 已扣除耗时，退出后可继续":"轻拿轻放，每一道划痕都有来处"})]}),m.jsxs("div",{className:"inspection-info",children:[m.jsx("span",{className:"category-label",children:mi[M.category].name}),m.jsx("h3",{children:M.name}),m.jsx(Fm,{item:x,state:s}),m.jsx(Hm,{item:x}),m.jsx("div",{className:"inspection-actions",children:Object.keys(xo).map(N=>{var ae;const w=xo[N],G=x.revealed[N];return m.jsxs("button",{className:`check-button ${G?"done":""} ${v===N&&S?"active":""}`,disabled:G||!!s.inspection||vn(s)<w.minutes||!!((ae=s.trade)!=null&&ae.locked),onClick:()=>C(N),children:[m.jsxs("span",{children:[N==="condition"?m.jsx(Sp,{size:18}):N==="function"?m.jsx(Fu,{size:18}):m.jsx(Mp,{size:18}),w.name]}),m.jsx("small",{children:G?m.jsx(Ia,{size:15}):`${w.minutes} 分钟`})]},N)})}),S&&v==="condition"&&m.jsxs("div",{className:"inspection-guide",children:[m.jsxs("p",{children:["点击旧物上的三处标记，查看使用痕迹。",((k=s.inspection)==null?void 0:k.progress)??0," / 3"]}),m.jsxs("button",{className:"text-button",onClick:E,children:["辅助完成检查 ",m.jsx(ys,{size:14})]})]}),m.jsxs("div",{className:"clue-notes",children:[x.revealed.condition&&m.jsxs("p",{children:[m.jsx(Sp,{size:14}),M.appearance.join("；"),"。品相：",eS(x.condition),"。"]}),x.revealed.function&&m.jsxs("p",{children:[m.jsx(Fu,{size:14}),M.functionClue[x.function===1?0:1]]}),x.revealed.authenticity&&m.jsxs("p",{children:[m.jsx(Mp,{size:14}),x.authenticity===1?M.originalClue:x.authenticity===.3?"材质和压印与原厂不同，是仿制纪念品。":M.alternateClue]})]}),m.jsxs("button",{className:"button secondary full",onClick:o,children:["返回柜台",S?" · 保留检查进度":""]})]})]})}function HR({state:s,send:t,inspect:i,confirm:o}){var x,v,M,S;const[l,u]=Qe.useState(((x=s.inventory[0])==null?void 0:x.uid)??""),d=s.inventory.find(T=>T.uid===l),h=d&&ln(d.defId),p=d&&(((v=s.trade)==null?void 0:v.selected)===d.uid||((M=s.inspection)==null?void 0:M.uid)===d.uid),g=s.inventory.filter(T=>T.displayed);return m.jsxs("div",{className:"inventory-layout",children:[m.jsxs("div",{children:[m.jsxs("div",{className:"section-heading",children:[m.jsxs("h3",{children:["全部库存 ",m.jsxs("small",{children:[s.inventory.length," / 12"]})]}),m.jsx("span",{children:"选中旧物，查看详情"})]}),m.jsx("div",{className:"inventory-grid",children:Array.from({length:12},(T,C)=>{const E=s.inventory[C];return E?m.jsxs("button",{className:`inventory-cell ${l===E.uid?"selected":""}`,onClick:()=>u(E.uid),children:[m.jsx("span",{className:"slot-number",children:String(C+1).padStart(2,"0")}),m.jsx(fr,{id:E.defId}),m.jsx("b",{children:ln(E.defId).name}),m.jsxs("span",{className:`stock-status ${E.displayed?"on-shelf":""}`,children:[E.displayed?"● 陈列中":"仓库存放",E.revealed.authenticity?"":" · 未核验"]})]},E.uid):m.jsxs("div",{className:"inventory-cell empty",children:[m.jsx("span",{className:"slot-number",children:String(C+1).padStart(2,"0")}),m.jsx(cr,{size:24,strokeWidth:1}),m.jsx("span",{children:"空置"})]},C)})}),m.jsxs("div",{className:"section-heading shelf-title",children:[m.jsxs("h3",{children:["店内陈列 ",m.jsxs("small",{children:[g.length," / 8"]})]}),m.jsx("span",{children:"只有陈列中的商品会被买家选中"})]}),m.jsx("div",{className:"shelf-slots",children:Array.from({length:8},(T,C)=>m.jsx("button",{"aria-label":g[C]?`选择陈列商品 ${ln(g[C].defId).name}`:`陈列位 ${C+1}`,onClick:()=>{g[C]?u(g[C].uid):d&&!d.displayed&&t({type:"DISPLAY",uid:d.uid,riskLabel:!0})},children:g[C]?m.jsx(fr,{id:g[C].defId}):m.jsx("span",{children:"＋"})},C))})]}),m.jsx("aside",{className:"inventory-detail",children:d&&h?m.jsxs(m.Fragment,{children:[m.jsxs("span",{className:"category-label",children:[h.id," · ",mi[h.category].name]}),m.jsx("h3",{children:h.name}),m.jsx("p",{className:"item-lore",children:h.lore}),m.jsx(Hm,{item:d}),m.jsx(Fm,{item:d,state:s}),m.jsxs("div",{className:"cost-row",children:[m.jsx("span",{children:"实际购入成本"}),m.jsx(Ni,{amount:d.cost})]}),m.jsxs("label",{className:"list-price",children:["建议挂牌价"," ",m.jsxs("div",{children:[m.jsx("input",{"aria-label":"建议挂牌价",type:"number",min:"1",max:"9999",disabled:!!p,value:d.listPrice,onChange:T=>t({type:"PRICE",uid:d.uid,price:Number(T.target.value)})}),m.jsx("span",{children:"票"})]})]}),m.jsx("p",{className:"muted small",children:"挂牌价可作为你的起始要价，不保证买家接受。"}),m.jsx("button",{className:"button primary full",disabled:!!p||s.inventory.filter(T=>T.displayed).length>=8&&!d.displayed,onClick:()=>t({type:"DISPLAY",uid:d.uid,riskLabel:!0}),children:d.displayed?"撤下陈列":d.revealed.authenticity?"诚实标注 · 上架":"标记“未核验”并上架"}),!d.revealed.authenticity&&m.jsx("p",{className:"muted small",children:"未核验商品仅周砾、阿扣接收，预算降低 20%。"}),m.jsxs("button",{className:"button secondary full",disabled:!!s.inspection||Object.values(d.revealed).every(Boolean)||!!((S=s.trade)!=null&&S.locked),onClick:()=>i(d.uid),children:[m.jsx(Sm,{size:16}),"送到鉴定台"]}),m.jsxs("button",{className:"text-button danger-text",disabled:!!p||s.recycled>=2||vn(s)<6||!!s.inspection||s.commission==="active",onClick:()=>o(d.uid),children:["回收变现 · ",Math.floor(Ms(d,s.market)*.35)," 票"," ",m.jsx(ys,{size:14})]}),m.jsxs("p",{className:"muted small",children:["今日已回收 ",s.recycled," / 2 件 · 耗时 6 分钟"]})]}):m.jsxs("div",{className:"empty-detail",children:[m.jsx(cr,{size:36}),m.jsx("h3",{children:"货架在等新的故事"}),m.jsx("p",{children:"接待卖家，收购第一件旧物。"})]})})]})}function GR({state:s}){const[t,i]=Qe.useState("today"),o=s.ledger.filter(h=>t==="all"||h.day===s.day),u=s.ledger.filter(h=>h.kind==="sale").reduce((h,p)=>h+p.amount-(p.cost??0),0),d=s.inventory.reduce((h,p)=>h+p.cost,0);return m.jsxs(m.Fragment,{children:[m.jsxs("div",{className:"ledger-stats",children:[m.jsxs("div",{children:[m.jsx("span",{children:"可用现金"}),m.jsx(Ni,{amount:s.cash})]}),m.jsxs("div",{children:[m.jsx("span",{children:"已实现销售毛利"}),m.jsx(Ni,{amount:u})]}),m.jsxs("div",{children:[m.jsx("span",{children:"未售库存成本"}),m.jsx(Ni,{amount:d})]}),m.jsxs("div",{children:[m.jsx("span",{children:"今日到期费用"}),m.jsx(Ni,{amount:15+sf(s.day)})]})]}),m.jsxs("div",{className:"tabs",children:[m.jsx("button",{className:t==="today"?"active":"",onClick:()=>i("today"),children:"今日流水"}),m.jsx("button",{className:t==="all"?"active":"",onClick:()=>i("all"),children:"全部流水"}),m.jsx("span",{children:"库存价值不计入现金"})]}),m.jsxs("div",{className:"ledger-table",children:[m.jsxs("div",{className:"ledger-row table-head",children:[m.jsx("span",{children:"时间"}),m.jsx("span",{children:"项目"}),m.jsx("span",{children:"金额"})]}),o.length===0?m.jsxs("div",{className:"empty-ledger",children:[m.jsx(Ul,{size:30}),m.jsx("p",{children:"账本的第一页，等你写下。"}),m.jsx("span",{children:"初始现金 180 票；3 件原有存货不再扣款。"})]}):o.slice().reverse().map(h=>m.jsxs("div",{className:"ledger-row",children:[m.jsxs("span",{children:["第 ",h.day," 天 · ",iS(h.minute)]}),m.jsxs("span",{children:[h.amount>0?m.jsx(iE,{size:15}):m.jsx(aE,{size:15}),h.label,h.risk&&m.jsx("small",{children:"未核验成交"})]}),m.jsxs("b",{className:h.amount>0?"income":"",children:[h.amount>0?"+":"−",Math.abs(h.amount),m.jsx("small",{children:"票"})]})]},h.id))]}),m.jsxs("div",{className:"ledger-note",children:[m.jsx(xm,{size:20}),m.jsxs("p",{children:[m.jsx("b",{children:"七日租约"}),"每日耗材 15 票；第 3 天租金 90 票，第 7 天租金 210 票。结清后，保留 120 票现金、信誉 40 以上并累计售出 12 件，就能正式续业。"]})]})]})}function VR({state:s}){const[t,i]=Qe.useState("objects"),[o,l]=Qe.useState(0),[u,d]=Qe.useState("all");return m.jsxs(m.Fragment,{children:[m.jsxs("div",{className:"tabs",children:[m.jsx("button",{className:t==="objects"?"active":"",onClick:()=>{i("objects"),l(0)},children:"旧物档案 · 12"}),m.jsx("button",{className:t==="people"?"active":"",onClick:()=>{i("people"),l(0)},children:"聚落居民 · 6"}),m.jsx("span",{children:"编号可查，故事慢慢听"})]}),t==="objects"?m.jsxs(m.Fragment,{children:[m.jsx("div",{className:"filter-chips",children:["all","repair","life","collect"].map(h=>m.jsx("button",{className:u===h?"active":"",onClick:()=>{d(h),l(Fn.findIndex(p=>h==="all"||p.category===h))},children:h==="all"?"全部旧物":mi[h].name},h))}),m.jsxs("div",{className:"codex-layout",children:[m.jsx("div",{className:"codex-grid",children:Fn.filter(h=>u==="all"||h.category===u).map(h=>{var p;return m.jsxs("button",{className:((p=Fn[o])==null?void 0:p.id)===h.id?"active":"",onClick:()=>l(Fn.indexOf(h)),children:[m.jsx("span",{className:"slot-number",children:h.id}),m.jsx(fr,{id:h.id}),m.jsx("b",{children:h.name}),m.jsx("small",{children:s.discovered.includes(h.id)?"已遇见":"目录记录"})]},h.id)})}),m.jsxs("div",{className:"codex-entry",children:[m.jsxs("span",{className:"eyebrow",children:["FIELD NOTES / ",Fn[o].id]}),m.jsx("h3",{children:Fn[o].name}),m.jsx("p",{className:"item-subtitle",children:Fn[o].subtitle}),m.jsx("p",{className:"item-lore",children:Fn[o].lore}),m.jsxs("div",{className:"definition-row",children:[m.jsx("span",{children:"原始基础价"}),m.jsx(Ni,{amount:Fn[o].base})]}),m.jsx("h4",{children:"可核验的证据"}),m.jsxs("p",{className:"clue-text",children:[m.jsx(Sp,{size:15}),Fn[o].appearance[0],"。"]}),m.jsxs("p",{className:"clue-text",children:[m.jsx(Fu,{size:15}),Fn[o].functionClue[0]]}),m.jsxs("p",{className:"clue-text",children:[m.jsx(Mp,{size:15}),Fn[o].originalClue]}),m.jsx("div",{className:"field-stamp",children:"灰线旧站 · 旧物档案"})]})]})]}):m.jsxs("div",{className:"people-layout",children:[m.jsx("div",{className:"people-list",children:Ci.map((h,p)=>m.jsxs("button",{className:o===p?"active":"",onClick:()=>l(p),children:[m.jsx(rS,{index:h.sprite}),m.jsxs("span",{children:[m.jsx("b",{children:h.name}),m.jsx("small",{children:h.title})]}),m.jsx(ys,{size:16})]},h.id))}),m.jsxs("div",{className:"people-entry",children:[m.jsx("div",{className:"full-character",style:{backgroundPositionX:`${Ci[o].sprite*20}%`}}),m.jsxs("div",{children:[m.jsx("span",{className:"eyebrow",children:"PEOPLE OF GREYLINE"}),m.jsx("h3",{children:Ci[o].name}),m.jsx("p",{className:"item-subtitle",children:Ci[o].title}),m.jsx("p",{className:"item-lore",children:Ci[o].bio}),m.jsxs("blockquote",{children:["“",Ci[o].lines.special,"”"]}),m.jsx("div",{className:"preference-list",children:Ci[o].preferences.map(h=>m.jsx("span",{children:mi[h].name},h))}),m.jsx("p",{className:"muted small",children:Ci[o].risk?"愿意购买明确标注的未核验商品，预算会有所降低。":"只购买来源已经核验、诚实标注的商品。"})]})]})]})]})}function jR({state:s,send:t}){const[i,o]=Qe.useState(null),l=s.commission==="active";return m.jsxs("div",{className:"community",children:[m.jsxs("div",{className:"community-intro",children:[m.jsx("span",{className:"eyebrow",children:"GREYLINE COMMUNITY BOARD"}),m.jsx("h3",{children:"给旧物分个家"}),m.jsx("p",{children:"南站仓库缺一双帮忙的手。把六件回收物资送到对应的箱子，不需要本钱，也不占库存。"}),m.jsxs("div",{children:[m.jsxs("span",{children:[m.jsx(_m,{size:16}),"90 分钟"]}),m.jsxs("span",{children:[m.jsx(Ul,{size:16}),"报酬 40 票"]}),m.jsx("span",{children:"每日一次"})]})]}),l?m.jsxs(m.Fragment,{children:[m.jsx("p",{className:"muted small",children:"拖动卡片，或先选卡片再点分类箱。分错不会产生惩罚。"}),m.jsx("div",{className:"sort-cards",children:mm.map((u,d)=>m.jsxs("button",{draggable:!s.sorted.includes(d),onDragStart:h=>h.dataTransfer.setData("text/plain",String(d)),disabled:s.sorted.includes(d),className:`${i===d?"selected":""} ${s.sorted.includes(d)?"sorted":""}`,onClick:()=>o(d),children:[s.sorted.includes(d)?m.jsx(Ia,{size:20}):m.jsx(cr,{size:20}),m.jsx("span",{children:u.name})]},d))}),m.jsx("div",{className:"sort-bins",children:Object.keys(mi).map(u=>m.jsxs("button",{onDragOver:d=>d.preventDefault(),onDrop:d=>{d.preventDefault();const h=Number(d.dataTransfer.getData("text/plain"));Number.isInteger(h)&&t({type:"SORT",index:h,category:u})},onClick:()=>{i!==null&&(t({type:"SORT",index:i,category:u}),o(null))},children:[m.jsx(cr,{size:28}),m.jsx("b",{children:mi[u].name}),m.jsx("small",{children:"将卡片放入此箱"})]},u))}),m.jsxs("div",{className:"community-footer",children:[m.jsxs("span",{children:["已分拣 ",s.sorted.length," / 6"]}),m.jsxs("button",{className:"text-button",onClick:()=>t({type:"SORT_ALL"}),children:[m.jsx(mE,{size:15}),"辅助完成"]})]})]}):s.commission==="done"?m.jsxs("div",{className:"community-complete",children:[m.jsx(xm,{size:42}),m.jsx("h3",{children:"今天的委托完成了"}),m.jsx("p",{children:"40 票已经入账。仓库的伙伴托我说一声：谢谢。"})]}):m.jsx("button",{className:"button primary full",disabled:vn(s)<90||!!s.trade||!!s.inspection,onClick:()=>t({type:"COMMISSION"}),children:s.trade?"请先结束当前接待":vn(s)<90?"剩余时间不足 90 分钟":"领取分拣委托"})]})}function kR(){return m.jsxs("div",{className:"help-content",children:[m.jsx("p",{className:"help-lead",children:"在沙尘里留住一家小店，也为旧物找个新家。"}),m.jsx("div",{className:"help-steps",children:[["01","接待与鉴定","卖家带来旧物，买家寻找陈列商品。外观、功能、编号各揭示一类证据，只消耗游戏时间，不收鉴定费。"],["02","报价与交割","每次接待最多报价三轮。价格谈妥后，还需确认交割，现金和物品才会转移。报价 4 分钟，交割 6 分钟。"],["03","入库与陈列","新收购的货物先进入仓库，记得打开货架上架。未核验商品须明确标注，仅周砾和阿扣愿意接收。"],["04","周转与租金","现金不够时，可做每日社区分拣委托，或回收两件旧物。每天 15 票耗材，第 3 天与第 7 天另付租金。"],["05","保住这间店","七日内结清所有费用，期末现金至少 120、信誉至少 40，累计售出 12 件。普通拒绝和还价失败不会扣信誉。"]].map(([s,t,i])=>m.jsxs("div",{children:[m.jsx("span",{children:s}),m.jsxs("section",{children:[m.jsx("h3",{children:t}),m.jsx("p",{children:i})]})]},s))}),m.jsxs("div",{className:"ledger-note",children:[m.jsx(_m,{size:21}),m.jsx("p",{children:"阅读、停留、打开菜单都不推进时间。所有进度自动保存在本浏览器。空格接待，Esc 暂停，I 货架，B 账本，H 指南。"})]})]})}function XR({state:s,offer:t,setOffer:i,setView:o,send:l,submitOffer:u}){const d=s.trade;if(!d)return null;const h=wi(d.npc),p=Ts(s);return m.jsxs("div",{className:"trade-content",children:[m.jsxs("div",{className:"trade-header",children:[m.jsx("span",{className:"trade-role",children:d.role==="seller"?"收购委托":"顾客求购"}),m.jsxs("span",{className:"round-indicators",children:[[0,1,2].map(g=>m.jsx("i",{className:g<d.rounds?"used":""},g)),m.jsxs("small",{children:[3-d.rounds," 轮机会"]})]})]}),d.role==="buyer"&&m.jsxs("div",{className:"buyer-selection",children:[m.jsxs("p",{children:["想找 ",m.jsx("b",{children:mi[d.category].name}),(h==null?void 0:h.risk)&&m.jsx("span",{children:"接受未核验"})]}),Ju(s).length?m.jsx("div",{className:"candidate-list",children:Ju(s).map(g=>m.jsxs("button",{"aria-label":`选择商品 ${ln(g.defId).name}`,className:d.selected===g.uid?"selected":"",onClick:()=>l({type:"SELECT",uid:g.uid}),disabled:d.locked||!!s.inspection,children:[m.jsx(fr,{id:g.defId}),d.selected===g.uid&&m.jsx(Ia,{size:12})]},g.uid))}):m.jsxs("div",{className:"no-stock",children:[m.jsx(cr,{size:30}),m.jsx("p",{children:"货架上暂无合适的商品"}),m.jsxs("button",{className:"text-button",onClick:()=>o("inventory"),children:["查看库存、调整陈列 ",m.jsx(ys,{size:14})]}),m.jsx("small",{children:"缺货送客不会扣除信誉。"})]})]}),p&&m.jsxs(m.Fragment,{children:[m.jsxs("div",{className:`item-showcase ${d.role==="buyer"?"compact":""}`,children:[m.jsx("span",{className:"item-watermark",children:p.defId}),m.jsx(fr,{id:p.defId}),m.jsx("span",{className:"item-category",children:mi[ln(p.defId).category].en})]}),m.jsxs("div",{className:"item-title",children:[m.jsx("h2",{children:ln(p.defId).name}),m.jsx("p",{children:ln(p.defId).subtitle})]}),m.jsx(Hm,{item:p}),m.jsx(Fm,{item:p,state:s}),m.jsxs("div",{className:"asking-price",children:[m.jsx("span",{children:d.locked?"双方已谈定":d.role==="seller"?`${h==null?void 0:h.name}的要价`:`${h==null?void 0:h.name}的出价`}),m.jsx(Ni,{amount:d.price})]}),d.locked?m.jsxs("div",{className:"locked-trade",children:[m.jsxs("div",{children:[m.jsx(Mm,{size:17}),"钱货尚未交割"]}),m.jsxs("button",{className:"button primary full","data-testid":"deliver",disabled:!!$u(s),onClick:()=>l({type:"DELIVER",tradeId:d.id}),children:[d.role==="seller"?"确认收购":"确认出售"," · ",d.price," 票",m.jsx(po,{size:16})]}),m.jsx("p",{children:$u(s)||"交割耗时 6 分钟，成交后自动记账。"})]}):m.jsxs("div",{className:"bargain-controls",children:[m.jsxs("div",{className:"offer-label",children:[m.jsx("label",{htmlFor:"offer-price",children:d.role==="seller"?"你的收购报价":"你的出售要价"}),m.jsx("span",{children:"每轮 4 分钟"})]}),m.jsxs("form",{onSubmit:g=>{g.preventDefault(),u()},children:[m.jsxs("div",{className:"offer-input",children:[m.jsx("button",{type:"button","aria-label":"报价减少 5 票",disabled:!!s.inspection,onClick:()=>i(String(Math.max(1,Number(t)-5))),children:m.jsx(dy,{size:16})}),m.jsx("input",{id:"offer-price","aria-label":"你的报价",type:"number",min:"1",max:"9999",step:"1",value:t,disabled:!!s.inspection,onChange:g=>i(g.target.value)}),m.jsx("span",{children:"票"}),m.jsx("button",{type:"button","aria-label":"报价增加 5 票",disabled:!!s.inspection,onClick:()=>i(String(Math.min(9999,Number(t)+5))),children:m.jsx(dE,{size:16})})]}),m.jsxs("button",{className:"button primary",disabled:!!s.inspection||vn(s)<10||!Number.isInteger(Number(t))||Number(t)<1,type:"submit","data-testid":"offer",children:["报价 ",m.jsx(po,{size:15})]})]}),m.jsxs("button",{className:"text-button accept-current",disabled:!!s.inspection||vn(s)<10,onClick:()=>l({type:"ACCEPT"}),children:["接受对方当前价格"," ",m.jsxs("span",{children:[d.price," 票 ",m.jsx(ys,{size:13})]})]})]})]})]})}function qR(s,t){const[i,o]=Qe.useState(s),[l,u]=Qe.useState(!1),d=Qe.useRef(i);d.current=i;const h=Qe.useRef(t);h.current=t;const p=Qe.useRef(null);Qe.useEffect(()=>()=>{p.current&&clearTimeout(p.current)},[]);const g=Qe.useCallback(x=>{if(p.current&&clearTimeout(p.current),x===d.current){u(!1);return}d.current&&!h.current?(u(!0),p.current=setTimeout(()=>{o(x),u(!1)},170)):(o(x),u(!1))},[]);return[i,g,l]}function YR({text:s,reduced:t,onComplete:i}){const[o,l]=Qe.useState(t?s.length:0),u=Qe.useRef(!1);return Qe.useEffect(()=>{if(u.current=!1,t){l(s.length);return}l(0);const d=performance.now();let h;function p(g){const x=u.current?s.length:Math.min(s.length,Math.floor((g-d)/23));l(x),x<s.length?h=requestAnimationFrame(p):i==null||i()}return h=requestAnimationFrame(p),()=>cancelAnimationFrame(h)},[s,t,i]),m.jsxs("span",{className:"typewriter",onClick:()=>{u.current=!0,l(s.length)},children:[m.jsx("span",{className:"sr-only",children:s}),m.jsxs("span",{"aria-hidden":"true",children:[s.slice(0,o),o<s.length&&m.jsx("i",{className:"typing-caret"})]})]})}function WR({value:s,reduced:t}){const[i,o]=Qe.useState(s),l=Qe.useRef(s);return Qe.useEffect(()=>{const u=l.current;if(l.current=s,t||u===s){o(s);return}const d=performance.now();let h;const p=g=>{const x=Math.min(1,(g-d)/430);o(Math.round(u+(s-u)*(1-(1-x)**3))),x<1&&(h=requestAnimationFrame(p))};return h=requestAnimationFrame(p),()=>cancelAnimationFrame(h)},[s,t]),m.jsx("span",{"aria-label":String(s),children:i.toLocaleString()})}function ZR({cue:s}){return m.jsxs("div",{className:`scene-transition ${s.night?"night":"dawn"}`,role:"status","aria-live":"polite","data-testid":"scene-transition",children:[m.jsx("div",{className:"transition-shutter shutter-top"}),m.jsx("div",{className:"transition-shutter shutter-bottom"}),m.jsxs("div",{className:"transition-lettering",children:[m.jsx("span",{className:"transition-ornament",children:"◇ ───────── ◇"}),s.night?m.jsx(ym,{size:34,strokeWidth:1.3}):m.jsx(hy,{size:34,strokeWidth:1.3}),m.jsx("h2",{children:s.title}),m.jsx("p",{children:s.subtitle}),m.jsx("span",{className:"transition-ornament",children:"灰 线 旧 货 铺"})]})]},s.id)}function KR({effect:s}){return m.jsxs("div",{className:`deal-feedback ${s.amount<0?"purchase-effect":"sale-effect"}`,"aria-live":"polite","data-testid":"deal-feedback",children:[m.jsxs("div",{className:"deal-stamp",children:[m.jsx(Ia,{size:24}),m.jsx("strong",{children:"成交"}),m.jsx("span",{children:s.label})]}),m.jsxs("div",{className:"deal-amount",children:[m.jsx(Ul,{size:22}),s.amount>0?"+":"−",Math.abs(s.amount),m.jsx("small",{children:"票"})]}),m.jsx("div",{className:"coin-particles","aria-hidden":"true",children:Array.from({length:7},(t,i)=>m.jsx("i",{style:{"--i":i}},i))})]},s.id)}function QR({state:s,prefs:t,view:i,setView:o,send:l,inspect:u,offer:d,setOffer:h,submitOffer:p,save:g,saveFailed:x,saveTick:v,onSound:M,onFullscreen:S,transitioning:T}){const[C,E]=Qe.useState(!0),y=s.trade,O=Ts(s),P=y?wi(y.npc):null,U=s.phase==="report"||s.phase==="ending",F=s.cursor<s.queue.length?s.queue[s.cursor]:null,H=sf(s.day),I=s.day<=3?3:7,k=!!s.inspection||s.commission==="active",N=P?y.line:s.notice;return m.jsxs("main",{className:`game-screen ${y?"at-counter":"between-visits"} ${i?"panel-is-open":""}`,"aria-label":"灰线旧货铺游戏画面","aria-busy":T,children:[m.jsx("div",{className:"world-stage",children:m.jsx(PR,{npc:U?null:(y==null?void 0:y.npc)??F,active:!!y,inventory:s.inventory,item:(y==null?void 0:y.role)==="seller"?O:void 0,reducedMotion:t.reducedMotion,day:s.day,minute:s.minute,suspended:!!i||s.phase!=="open"||T})}),m.jsx("div",{className:"world-shade","aria-hidden":"true"}),m.jsxs("div",{className:"screen-corners","aria-hidden":"true",children:[m.jsx("i",{}),m.jsx("i",{}),m.jsx("i",{}),m.jsx("i",{})]}),m.jsxs("header",{className:"game-hud",children:[m.jsxs("button",{className:"shop-sign",onClick:()=>o("help"),"aria-label":"灰线旧货铺 · 查看游戏指南",children:[m.jsx("span",{className:"sign-nail"}),m.jsx("strong",{children:"灰线旧货铺"}),m.jsx("small",{children:"旧站务室 · 七日试营业"}),m.jsx("span",{className:"sign-nail"})]}),m.jsxs("div",{className:"hud-plates","aria-label":"经营状态",children:[m.jsxs("div",{className:"hud-plate day-plate",children:[m.jsx(hy,{size:24}),m.jsxs("div",{children:[m.jsx("small",{children:"试营业"}),m.jsxs("strong",{children:["第 ",m.jsx("b",{children:s.day})," 天"]})]}),m.jsx("div",{className:"seven-days","aria-label":`七日中的第${s.day}天`,children:[1,2,3,4,5,6,7].map(w=>m.jsx("i",{className:w<=s.day?"lit":""},w))})]}),m.jsxs("div",{className:"hud-plate cash-plate",children:[m.jsx(Ul,{size:25}),m.jsxs("div",{children:[m.jsx("small",{children:"手头现金"}),m.jsxs("strong",{"data-testid":"cash",children:[m.jsx(WR,{value:s.cash,reduced:t.reducedMotion}),m.jsx("em",{children:"票"})]})]})]}),m.jsxs("button",{className:`hud-plate rent-plate ${H?"rent-due":""}`,onClick:()=>o("ledger"),"aria-label":"查看租金账本",children:[m.jsx(cE,{size:24}),m.jsxs("div",{children:[m.jsx("small",{children:H?"今晚结租":`第 ${I} 天结租`}),m.jsxs("strong",{children:[H||(I===3?90:210),m.jsx("em",{children:"票"})]})]})]}),m.jsxs("div",{className:"hud-plate reputation-plate",children:[m.jsx(Mm,{size:23}),m.jsxs("div",{children:[m.jsx("small",{children:"信誉"}),m.jsxs("strong",{children:[s.reputation,m.jsx("em",{children:"/100"})]})]})]})]}),m.jsxs("div",{className:"game-system-controls",children:[m.jsx("button",{className:"game-icon","aria-label":t.sound?"关闭声音":"开启声音",onClick:M,children:t.sound?m.jsx(vE,{size:20}):m.jsx(_E,{size:20})}),m.jsx("button",{className:"game-icon fullscreen-button","aria-label":"全屏游戏",onClick:S,children:m.jsx(uE,{size:19})}),m.jsx("button",{className:"game-icon","aria-label":"暂停与设置",onClick:()=>o("settings"),children:m.jsx(pE,{size:20})})]})]}),m.jsxs("div",{className:"station-caption",children:[m.jsx("span",{className:"open-dot"}),m.jsx("span",{children:"灰线聚落 · 旧站台"}),m.jsx("i",{}),s.day===4?"沙尘渐起":"晴，微风"]}),m.jsxs("button",{className:"world-hotspot shelf-trigger",onClick:()=>o("inventory"),"aria-label":"查看店内陈列",children:[m.jsx(cr,{size:17}),m.jsxs("span",{children:["货架 ",m.jsxs("b",{children:[s.inventory.filter(w=>w.displayed).length,"/8"]})]}),m.jsx(ys,{size:13})]}),!y&&F&&!U&&m.jsxs("div",{className:"door-bubble",children:[m.jsx(nx,{size:15}),m.jsx("span",{children:"有客人来了"}),m.jsx("i",{})]},`door-${s.cursor}`),P&&m.jsxs("div",{className:"actor-name",children:[m.jsx("span",{children:y.role==="seller"?"卖家":"买家"}),m.jsx("strong",{children:P.name}),m.jsx("small",{children:P.title})]},`actor-${y.id}`),m.jsxs("aside",{className:`wall-clipboard ${y?"trade-clipboard":"notice-clipboard"} ${!C&&!y?"folded-board":""}`,"aria-label":y?"柜台交易单":"今日告示",children:[m.jsx("div",{className:"clipboard-clamp","aria-hidden":"true",children:m.jsx("i",{})}),m.jsxs("header",{className:"clipboard-heading",children:[m.jsx("span",{children:y?y.role==="seller"?"旧物收购单":"顾客求购单":"今日告示"}),!y&&m.jsx("button",{"aria-label":C?"收起今日告示":"展开今日告示",onClick:()=>E(w=>!w),children:m.jsx(rE,{size:18})}),m.jsx("span",{className:"clipboard-number",children:y?`NO. ${String(s.cursor+1).padStart(2,"0")}`:`第 ${s.day} 日`})]}),y?m.jsx(XR,{state:s,offer:d,setOffer:h,setView:o,send:l,submitOffer:p}):m.jsxs("div",{className:"notice-paper",children:[m.jsxs("div",{className:"handwritten-note",children:[m.jsx("span",{className:"little-star",children:"✦"}),m.jsx("h2",{children:pm[s.day-1][0]}),m.jsx("p",{children:pm[s.day-1][1]})]}),m.jsxs("div",{className:"paper-market",children:[m.jsxs("h3",{children:[m.jsx(ax,{size:16}),"聚落行情",m.jsx("span",{children:"今日"})]}),Object.keys(mi).map(w=>m.jsxs("div",{children:[m.jsx("span",{children:mi[w].name}),m.jsx("i",{}),m.jsx("b",{className:s.market[w]>1?"rising":s.market[w]<1?"falling":"",children:s.market[w]===1?"— 平稳":`${s.market[w]>1?"↗ +":"↘ −"}15%`})]},w))]}),m.jsxs("div",{className:"lease-progress",children:[m.jsxs("div",{children:[m.jsx(lE,{size:16}),m.jsx("b",{children:"七日之约"}),m.jsxs("span",{children:[s.sold,"/12 件"]})]}),m.jsx("div",{className:"lease-track",children:m.jsx("span",{style:{width:`${Math.min(100,s.sold/12*100)}%`}})}),m.jsx("p",{children:"结清租金 · 余款 120 票 · 信誉 40"})]}),m.jsxs("button",{className:"paper-commission",onClick:()=>o("community"),children:[m.jsx("span",{className:"commission-seal",children:m.jsx(cr,{size:22})}),m.jsxs("span",{children:[m.jsx("b",{children:s.commission==="done"?"今日委托已完成":s.commission==="active"?"继续分拣委托":"社区分拣委托"}),m.jsx("small",{children:s.commission==="done"?"报酬已记入账本":"帮忙分拣 · 报酬 40 票"})]}),s.commission==="done"?m.jsx(Ia,{size:18}):m.jsx(ys,{size:18})]})]}),m.jsxs("footer",{className:"clipboard-foot",children:[m.jsx("span",{className:"ink-dot"}),s.cursor>=s.queue.length?"今日来客已接待完毕":`今日剩余 ${s.queue.length-s.cursor} 位来客`]})]},y?`sheet-${y.id}`:`notice-${s.day}`),m.jsxs("section",{className:"game-dialogue","aria-label":"人物对话",children:[m.jsx("div",{className:"dialogue-medallion",children:P?m.jsx(rS,{index:P.sprite}):m.jsx(gE,{size:35,strokeWidth:1.2})}),m.jsxs("div",{className:"game-dialogue-copy",children:[m.jsxs("div",{className:"speaker-line",children:[m.jsx("strong",{children:(P==null?void 0:P.name)??"店主手记"}),m.jsx("span",{children:P?P.title:`第 ${s.day} 天 · 开门迎客`}),y&&m.jsx("small",{children:y.repeat?"熟悉的面孔":"旧物与新故事"})]}),m.jsx("p",{"data-testid":"dialogue",children:m.jsx(YR,{text:N,reduced:t.reducedMotion})}),m.jsx("span",{className:"dialogue-continue","aria-hidden":"true",children:"◆"})]})]},`speech-${(y==null?void 0:y.id)??"diary"}-${s.cursor}`),m.jsx("div",{className:"game-action-bar","aria-label":"柜台操作",children:y?m.jsxs(m.Fragment,{children:[m.jsxs("button",{className:"game-button inspect-action",disabled:!O||y.locked||Object.values((O==null?void 0:O.revealed)??{}).every(Boolean),onClick:()=>O&&u(O.uid),children:[m.jsx(Sm,{size:24}),m.jsxs("span",{children:[s.inspection?"继续检查":"检查旧物",m.jsx("small",{children:"4–12 分钟"})]})]}),m.jsxs("button",{className:"game-button price-action",disabled:!O||y.locked||!!s.inspection||vn(s)<10,onClick:()=>{var w;return(w=document.getElementById("offer-price"))==null?void 0:w.focus()},children:[m.jsx(Ul,{size:24}),m.jsxs("span",{children:["商量报价",m.jsx("small",{children:"4 分钟 / 轮"})]})]}),m.jsxs("button",{className:"game-button accept-action",disabled:!O||!!s.inspection||(y.locked?!!$u(s):vn(s)<10),onClick:()=>y.locked?l({type:"DELIVER",tradeId:y.id}):l({type:"ACCEPT"}),children:[m.jsx(Ia,{size:25}),m.jsxs("span",{children:[y.locked?"交割成交":"接受价格",m.jsxs("small",{children:[y.price," 票"]})]})]}),m.jsxs("button",{className:"game-button decline-action",disabled:!!s.inspection,onClick:()=>l({type:"DISMISS"}),children:[m.jsx(Em,{size:25}),m.jsxs("span",{children:[y.locked?"取消交易":"礼貌送客",m.jsx("small",{children:"2 分钟"})]})]})]}):m.jsxs(m.Fragment,{children:[m.jsxs("button",{className:"game-button primary-game greet-button","data-testid":"greet",disabled:!F||vn(s)<6||k||s.phase!=="open",onClick:()=>l({type:"ARRIVE"}),children:[m.jsx(nx,{size:23}),m.jsxs("span",{children:["招呼顾客",m.jsx("small",{children:"6 分钟"})]}),m.jsx(ys,{size:20})]}),m.jsxs("button",{className:"game-button",onClick:()=>s.inspection?u(s.inspection.uid):s.commission==="active"?o("community"):o("inventory"),children:[m.jsx(ix,{size:23}),m.jsx("span",{children:s.inspection?"继续鉴定":s.commission==="active"?"继续分拣":"整理货架"})]}),m.jsxs("button",{className:"game-button community-action",onClick:()=>o("community"),children:[m.jsx(ax,{size:22}),m.jsxs("span",{children:["社区委托",m.jsx("small",{children:"40 票报酬"})]})]})]})}),m.jsxs("nav",{className:"game-toolbelt","aria-label":"店铺工具",children:[m.jsxs("button",{"aria-label":"货架","aria-keyshortcuts":"i",className:i==="inventory"?"selected":"",onClick:()=>o("inventory"),children:[m.jsx(ix,{size:23}),m.jsx("span",{children:"货架"}),m.jsx("kbd",{"aria-hidden":"true",children:"I"})]}),m.jsxs("button",{className:i==="codex"?"selected":"",onClick:()=>o("codex"),children:[m.jsx(sE,{size:23}),m.jsx("span",{children:"图鉴"})]}),m.jsxs("button",{"aria-label":"账本","aria-keyshortcuts":"b",className:i==="ledger"?"selected":"",onClick:()=>o("ledger"),children:[m.jsx(fE,{size:23}),m.jsx("span",{children:"账本"}),m.jsx("kbd",{"aria-hidden":"true",children:"B"})]}),m.jsxs("button",{onClick:()=>o("help"),children:[m.jsx(oE,{size:22}),m.jsx("span",{children:"指南"})]})]}),m.jsxs("div",{className:"pocket-clock",children:[m.jsx("div",{className:"clock-ring",children:m.jsx(_m,{size:22})}),m.jsxs("span",{children:[m.jsx("strong",{children:iS(s.minute)}),m.jsxs("small",{children:[vn(s)," 分钟后打烊"]})]}),m.jsxs("button",{className:"close-shop",disabled:k||s.phase!=="open",onClick:()=>l({type:"CLOSE"}),children:[m.jsx(ym,{size:17}),"打烊"]})]}),m.jsxs("button",{onClick:g,className:`in-game-save ${x?"save-error":""}`,children:[m.jsx(hE,{size:13}),x?"存档未保存":v?"已保存":"自动存档",m.jsx("span",{className:"open-dot"})]}),m.jsxs("div",{className:"chapter-ribbon",children:[m.jsx(fy,{size:12}),m.jsx("span",{children:"旧物有来处，灯火有归人"})]})]})}let tr=null;function oy(s,t){if(t)try{tr??(tr=new AudioContext),tr.state==="suspended"&&tr.resume(),(s==="bell"?[830,1245,1660]:s==="coin"?[880,1174,1568]:s==="check"?[392,523]:[260]).forEach((o,l)=>{const u=tr.currentTime+l*.075,d=tr.createOscillator(),h=tr.createGain();d.type=s==="click"?"triangle":"sine",d.frequency.value=o,h.gain.setValueAtTime(0,u),h.gain.linearRampToValueAtTime(s==="click"?.035:.065,u+.008),h.gain.exponentialRampToValueAtTime(.001,u+(s==="bell"?.8:.25)),d.connect(h).connect(tr.destination),d.start(u),d.stop(u+1)})}catch{}}const ly={sound:!1,largeText:!1,reducedMotion:!1,assist:!1};function JR(){try{return{...ly,reducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches,...JSON.parse(localStorage.getItem("greyline-prefs")??"{}")}}catch{return ly}}function $R(){try{const s=new URLSearchParams(window.location.search);return s.has("seed")?Yu(s.get("seed")||"TUTORIAL-001"):sS(localStorage.getItem(Wu))??Yu()}catch{return Yu()}}function ew(){var Re,be;const[s,t]=Qe.useReducer((ce,D)=>D.type==="RESET"?Yu(D.seed):yp(ce,D),void 0,$R),[i,o]=Qe.useState(JR),[l,u,d]=qR(null,i.reducedMotion),[h,p]=Qe.useState(""),[g,x]=Qe.useState(""),[v,M]=Qe.useState(null),[S,T]=Qe.useState(null),[C,E]=Qe.useState(!1),[y,O]=Qe.useState(!1),[P,U]=Qe.useState(""),[F,H]=Qe.useState("TUTORIAL-001"),[I,k]=Qe.useState(""),[N,w]=Qe.useState(null),[G,ae]=Qe.useState(null),de=Qe.useRef(s);de.current=s;const _e=Qe.useRef(!1),fe=Qe.useRef(0),X=Qe.useRef([]),se=Qe.useRef(i);se.current=i,Qe.useEffect(()=>()=>X.current.forEach(clearTimeout),[]);const Y=Qe.useCallback((ce,D)=>{if(!_e.current){if(se.current.reducedMotion){D();return}_e.current=!0,w({...ce,id:++fe.current}),X.current.push(setTimeout(D,380)),X.current.push(setTimeout(()=>{w(null),_e.current=!1},1350))}},[]),xe=Qe.useCallback(ce=>{if(_e.current)return;const D=de.current;if(ce.type==="SETTLE"||ce.type==="NEXT"){const lt=yp(D,ce);if(lt.phase!==D.phase||lt.day!==D.day){Y({title:ce.type==="SETTLE"?"今日打烊":lt.phase==="ending"?"七日之约":`第 ${lt.day} 天`,subtitle:ce.type==="SETTLE"?"把今天的故事，留在账本里":lt.phase==="ending"?"每件旧物，都值得一个新的归处":pm[lt.day-1][0],night:ce.type==="SETTLE"},()=>t(ce));return}}if(ce.type==="DELIVER"){const lt=yp(D,ce);D.trade&&!lt.trade&&lt.cash!==D.cash&&(ae({id:++fe.current,amount:lt.cash-D.cash,label:D.trade.role==="seller"?"旧物入库":"好物有归"}),X.current.push(setTimeout(()=>ae(null),se.current.reducedMotion?500:1700)))}oy(ce.type==="ARRIVE"?"bell":ce.type==="DELIVER"||ce.type==="SORT_ALL"?"coin":ce.type==="CHECK_STEP"?"check":"click",se.current.sound),t(ce)},[Y]);Qe.useEffect(()=>{try{localStorage.setItem(Wu,JSON.stringify(s)),E(!1)}catch{E(!0)}},[s]),Qe.useEffect(()=>{try{localStorage.setItem("greyline-prefs",JSON.stringify(i))}catch{}document.documentElement.classList.toggle("large-text",i.largeText),document.documentElement.classList.toggle("reduced-motion",i.reducedMotion)},[i]),Qe.useEffect(()=>{function ce(D){if(!_e.current&&!(D.ctrlKey||D.metaKey||D.altKey||D.target instanceof HTMLElement&&/INPUT|TEXTAREA|SELECT/.test(D.target.tagName))){if(D.key==="Escape"&&!l&&s.phase==="open"){u("settings");return}l||s.phase!=="open"||v!==null||S||(D.code==="Space"&&(D.preventDefault(),s.trade||xe({type:"ARRIVE"})),D.key.toLowerCase()==="i"&&u("inventory"),D.key.toLowerCase()==="b"&&u("ledger"),D.key.toLowerCase()==="h"&&u("help"))}}return window.addEventListener("keydown",ce),()=>window.removeEventListener("keydown",ce)},[l,s.phase,s.trade,v,S,xe]),Qe.useEffect(()=>{s.notice&&k(s.notice)},[s.notice]),Qe.useEffect(()=>{if(!I)return;const ce=setTimeout(()=>k(""),5500);return()=>clearTimeout(ce)},[I]),Qe.useEffect(()=>{var D;const ce=Ts(s);x(ce?String(((D=s.trade)==null?void 0:D.role)==="seller"?Math.max(1,Math.floor(Qu(ce,s.market).center*.7+1e-9)):ce.listPrice||Math.round(Qu(ce,s.market).center*1.1)):"")},[(Re=s.trade)==null?void 0:Re.id,(be=s.trade)==null?void 0:be.selected]);const Me=s.trade,ze=sf(s.day),ot=s.phase==="report"||s.phase==="ending",ht=s.inventory.find(ce=>ce.uid===S);function B(ce){p(ce),u("inspect")}function le(){u(null)}function J(){const ce=Number(g);if(gm(s,ce)&&Number.isFinite(ce)&&ce>0){M(ce);return}xe({type:"OFFER",price:ce})}function ie(){try{localStorage.setItem(Wu,JSON.stringify(s)),E(!1),O(!0),setTimeout(()=>O(!1),2e3)}catch{E(!0)}}function Te(ce){Y({title:"第一天",subtitle:"门铃响了，新的故事开始了",night:!1},()=>t({type:"RESET",seed:ce.trim()||"TUTORIAL-001"}));const D=new URL(window.location.href);D.searchParams.delete("seed"),window.history.replaceState({},"",D),u(null),p(""),M(null),T(null)}async function De(ce){if(ce)try{if(ce.size>5e5){U("文件过大，请选择灰线旧货铺导出的 JSON 存档。");return}const D=sS(await ce.text());if(!D){U("存档无法读取：格式不正确或版本不兼容。原进度未改动。");return}localStorage.setItem(Wu,JSON.stringify(D)),window.location.assign(window.location.pathname)}catch{U("浏览器无法读取或保存这个文件，请检查本地存储权限。")}}return m.jsxs("div",{className:`game-app immersive-game ${d?"panels-exit":""} ${N?"is-transitioning":""}`,children:[m.jsx(QR,{state:s,prefs:i,view:l,setView:u,send:xe,inspect:B,offer:g,setOffer:x,submitOffer:J,save:ie,saveFailed:C,saveTick:y,transitioning:!!N,onSound:()=>{oy("bell",!i.sound),o(ce=>({...ce,sound:!ce.sound}))},onFullscreen:async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{k("当前浏览器暂不支持全屏，可以横屏继续游玩。")}}}),N&&m.jsx(ZR,{cue:N}),G&&m.jsx(KR,{effect:G}),I&&!l&&!ot&&s.phase!=="closing"&&m.jsxs("div",{className:"toast",role:"status",children:[m.jsx(Ia,{size:15}),m.jsx("span",{children:I}),m.jsx("button",{"aria-label":"收起通知",onClick:()=>k(""),children:m.jsx(Em,{size:13})})]}),l==="inventory"&&m.jsx(hi,{title:"库存与陈列",subtitle:"THE SHELVES · 给旧物一个位置",wide:!0,onClose:le,children:m.jsx(HR,{state:s,send:xe,inspect:B,confirm:T})}),l==="ledger"&&m.jsx(hi,{title:"店铺账本",subtitle:"EVERY TICKET COUNTS · 每一票都有来处",wide:!0,onClose:le,children:m.jsx(GR,{state:s})}),l==="codex"&&m.jsx(hi,{title:"灰线见闻录",subtitle:"THINGS & PEOPLE · 旧物与故人",wide:!0,onClose:le,children:m.jsx(VR,{state:s})}),l==="help"&&m.jsx(hi,{title:"新店主手册",subtitle:"A LITTLE GUIDE TO YOUR NEW LIFE",onClose:le,children:m.jsx(kR,{})}),l==="community"&&m.jsx(hi,{title:"社区告示板",subtitle:"A HELPING HAND · 聚落的日常",onClose:le,children:m.jsx(jR,{state:s,send:xe})}),l==="inspect"&&m.jsx(hi,{title:"旧物鉴定台",subtitle:"LOOK CLOSER · 让证据说话",wide:!0,onClose:le,children:m.jsx(FR,{state:s,targetUid:h,send:xe,onClose:le,assist:i.assist})}),l==="settings"&&m.jsxs(hi,{title:"歇一歇，再开张",subtitle:"PAUSED · 时间不会偷偷溜走",onClose:le,children:[m.jsx("div",{className:"settings-list",children:[["sound","游戏音效","门铃、纸页与成交的声音。"],["largeText","放大字号","让对白与物品说明更容易阅读。"],["reducedMotion","减少动态","关闭镜头视差、浮尘位移和角色呼吸。"],["assist","鉴定辅助","允许直接完成检查动作，耗时不变。"]].map(([ce,D,lt])=>m.jsxs("button",{className:"setting-row",role:"switch","aria-checked":i[ce],onClick:()=>o(tt=>({...tt,[ce]:!tt[ce]})),children:[m.jsxs("span",{children:[m.jsx("b",{children:D}),m.jsx("small",{children:lt})]}),m.jsx("i",{className:`toggle ${i[ce]?"on":""}`})]},ce))}),m.jsxs("div",{className:"settings-actions",children:[m.jsxs("button",{className:"button primary full",onClick:le,children:[m.jsx(po,{size:17}),"继续营业"]}),m.jsxs("button",{className:"button secondary full",onClick:()=>u("restart"),children:[m.jsx(Bh,{size:16}),"开始新的七日"]}),m.jsxs("div",{className:"save-tools",children:[m.jsx("button",{className:"text-button",onClick:()=>{const ce=new Blob([JSON.stringify(s)],{type:"application/json"}),D=document.createElement("a");D.href=URL.createObjectURL(ce),D.download=`greyline-day${s.day}.json`,D.click(),setTimeout(()=>URL.revokeObjectURL(D.href),1e3)},children:"导出存档"}),m.jsxs("label",{className:"text-button import-save",children:["导入存档",m.jsx("input",{type:"file",accept:"application/json,.json",onChange:ce=>{var D;De((D=ce.target.files)==null?void 0:D[0]),ce.target.value=""}})]})]}),P&&m.jsx("p",{className:"danger-text",role:"status",children:P}),m.jsxs("p",{className:"muted small centered",children:["种子 ",s.seed," · 无联网、无广告 · 进度保存在当前浏览器"]}),C&&m.jsx("p",{className:"danger-text",children:"本地存储不可用，请导出存档以免丢失进度。"})]})]}),l==="restart"&&m.jsx(hi,{title:"新的七日，新的故事",subtitle:"A NEW BEGINNING",onClose:()=>u("settings"),children:m.jsxs("div",{className:"restart-content",children:[m.jsx(Bh,{size:38,strokeWidth:1}),m.jsx("p",{children:"重新开店会替换本浏览器的当前进度。需要保留时，请先在设置中导出存档。"}),m.jsxs("label",{children:["经营种子",m.jsx("input",{value:F,maxLength:64,onChange:ce=>H(ce.target.value)})]}),m.jsx("p",{className:"muted small",children:"前两笔交易固定教学，之后的货物、行情与来客随种子变化。同一种子可复现同一过程。"}),m.jsxs("button",{className:"button primary full",onClick:()=>Te(F),children:["确认新开局 ",m.jsx(po,{size:17})]}),m.jsx("button",{className:"button secondary full",onClick:()=>{const ce=`GREYLINE-${Date.now().toString(36).toUpperCase()}`;H(ce),Te(ce)},children:"随机种子开局"})]})}),v!==null&&m.jsx(hi,{title:"再斟酌一下报价？",subtitle:"REPUTATION MATTERS",onClose:()=>M(null),children:m.jsxs("div",{className:"confirmation-content",children:[m.jsx(Mm,{size:40}),m.jsxs("p",{children:["这个价格明显偏离你当前看到的估值。提交会使信誉下降 ",m.jsx("b",{children:"2 点"}),"，本次接待最多扣一次。"]}),m.jsxs("div",{className:"confirm-price",children:[m.jsx("span",{children:"即将提交的报价"}),m.jsx(Ni,{amount:v})]}),m.jsx("button",{className:"button primary full",onClick:()=>{xe({type:"OFFER",price:v,acknowledge:!0}),M(null)},children:"仍然提交报价"}),m.jsx("button",{className:"button secondary full",onClick:()=>M(null),children:"返回修改 · 不消耗时间"})]})}),ht&&m.jsx(hi,{title:"交给聚落回收箱？",subtitle:"A SECOND USE · 应急变现",onClose:()=>T(null),children:m.jsxs("div",{className:"confirmation-content",children:[m.jsx(fr,{id:ht.defId,className:"confirm-sprite"}),m.jsx("h3",{children:ln(ht.defId).name}),m.jsxs("div",{className:"confirm-price",children:[m.jsxs("span",{children:["购入成本 ",ht.cost," 票"]}),m.jsx(Ni,{amount:Math.floor(Ms(ht,s.market)*.35)})]}),m.jsxs("p",{children:["耗时 6 分钟，完成后无法取回。不计入售出件数，不增加信誉。今日剩余 ",2-s.recycled," ","次。"]}),m.jsx("button",{className:"button primary full",onClick:()=>{xe({type:"RECYCLE",uid:ht.uid}),T(null)},children:"确认回收变现"})]})}),s.phase==="closing"&&m.jsx(hi,{title:"今天，就到这里吧",subtitle:`CLOSING TIME · 第 ${s.day} 天`,dismissible:vn(s)>0,onClose:()=>xe({type:"BACK"}),children:m.jsxs("div",{className:"closing-content",children:[m.jsx(ym,{size:38,strokeWidth:1.2}),m.jsx("p",{children:"合上账本前，再看一眼今天的收支。"}),m.jsxs("div",{className:"closing-rows",children:[m.jsxs("div",{children:[m.jsx("span",{children:"手头现金"}),m.jsx(Ni,{amount:s.cash})]}),m.jsxs("div",{children:[m.jsx("span",{children:"每日耗材"}),m.jsx("span",{children:"−15 票"})]}),ze>0&&m.jsxs("div",{children:[m.jsx("span",{children:"今日到期租金"}),m.jsxs("span",{children:["−",ze," 票"]})]}),m.jsxs("div",{className:"total",children:[m.jsx("span",{children:"结算后现金"}),s.cash>=15+ze?m.jsx(Ni,{amount:s.cash-15-ze}):m.jsx("span",{className:"danger-text",children:"无法结清"})]})]}),s.cash<15+ze&&m.jsxs("div",{className:"closing-warning",children:["距今日费用还差 ",15+ze-s.cash," 票。现在结算将无法续业。",vn(s)>0?"可以返回营业，尝试委托或回收变现。":"营业时间已经用尽。"]}),s.commission==="available"&&vn(s)>=90&&m.jsx("p",{className:"muted small",children:"今日社区委托尚未完成，仍可返回赚取 40 票。"}),Me&&m.jsx("p",{className:"muted small",children:"当前未交割的交易将取消，不付款、不转移货物。"}),m.jsxs("button",{className:"button primary full",onClick:()=>{u(null),xe({type:"SETTLE"})},children:["确认打烊并结算 ",m.jsx(po,{size:17})]}),vn(s)>0&&m.jsx("button",{className:"button secondary full",onClick:()=>xe({type:"BACK"}),children:"再营业一会儿"})]})}),s.phase==="report"&&s.report&&m.jsx(hi,{title:`第 ${s.day} 天 · 营业札记`,subtitle:"THE DAY IN NUMBERS",dismissible:!1,onClose:()=>{},children:m.jsxs("div",{className:"report-content",children:[m.jsx("span",{className:"report-stamp",children:s.outcome==="bankrupt"?"未能结清":"已结清"}),m.jsx("p",{children:"灯光慢慢暗下来，今天的故事都留在账本里。"}),m.jsxs("div",{className:"report-rows",children:[m.jsxs("div",{children:[m.jsxs("span",{children:["营业收入 ",m.jsx("small",{children:"销售、委托与回收"})]}),m.jsxs("b",{children:["+",s.report.income," 票"]})]}),m.jsxs("div",{children:[m.jsx("span",{children:"收购支出"}),m.jsxs("b",{children:["−",s.report.purchases," 票"]})]}),m.jsxs("div",{children:[m.jsx("span",{children:"已付固定费用"}),m.jsxs("b",{children:["−",s.report.fees," 票"]})]}),m.jsxs("div",{className:"gross-row",children:[m.jsx("span",{children:"其中：已实现销售毛利"}),m.jsxs("span",{children:[s.report.gross," 票"]})]}),m.jsxs("div",{className:"total",children:[m.jsx("span",{children:"期末现金"}),m.jsx(Ni,{amount:s.cash})]})]}),s.report.missing>0&&m.jsxs("p",{className:"danger-text",children:["到期费用仍缺 ",s.report.missing," 票，租约未能继续。"]}),m.jsx("p",{className:"report-tomorrow",children:s.outcome?"七日之约，走到了这一页。":`明日提醒：${s.day+1===3?"准备 90 票租金，别忘了留出耗材。":s.day+1===7?"最后一天，准备 210 票租金与周转金。":"行情将更新，记得把新收的旧物上架。"}`}),m.jsxs("button",{className:"button primary full",onClick:()=>xe({type:"NEXT"}),children:[s.outcome?"翻到故事的最后一页":`迎接第 ${s.day+1} 天`,m.jsx(po,{size:17})]})]})}),s.phase==="ending"&&!l&&m.jsx(hi,{title:s.outcome==="win"?"这盏灯，会继续亮着":s.outcome==="survive"?"小店还在，故事待续":"暂时，把门轻轻带上",subtitle:s.outcome==="win"?"ENDING 01 · 长明的旧货铺":s.outcome==="survive"?"ENDING 02 · 勉强续业":"ENDING 03 · 来日再开张",dismissible:!1,wide:!0,onClose:()=>{},children:m.jsxs("div",{className:"ending-content",children:[m.jsxs("div",{className:"ending-art",children:[m.jsx("div",{}),m.jsx(fy,{size:38}),m.jsx("blockquote",{children:s.outcome==="win"?`旧物找到了新家，
你也一样。`:s.outcome==="survive"?`站台还有来客，
明天还有机会。`:`每一次重新开门，
都是新的开始。`})]}),m.jsxs("div",{className:"ending-story",children:[m.jsx("p",{children:s.outcome==="win"?"第七天的夜里，陶叔送来一碗热汤，周砾替门轴上了油。林鹭说，远处的商队已经记住了你的招牌。你把新的租约压在台灯下，门口的瓶盖铃铛，明天还会响。":s.outcome==="survive"?"租金结清了，但柜台上的票子和货架上的空位提醒你，经营还需要一点耐心。聚落愿意再给你一次机会。下一回，旧物会找到更合适的人。":"票子没能凑够，租约暂时停在了这一页。你把没卖出的旧物仔细收好，擦净台灯。门外仍有风，下一次，你会更懂得怎么和这座聚落做生意。"}),m.jsx("div",{className:"ending-goals",children:[[s.cash>=120,"期末现金",`${s.cash} / 120 票`],[s.reputation>=40,"店铺信誉",`${s.reputation} / 40`],[s.sold>=12,"累计售出",`${s.sold} / 12 件`]].map(([ce,D,lt])=>m.jsxs("div",{children:[ce?m.jsx(Ia,{size:17}):m.jsx(dy,{size:17}),m.jsx("span",{children:D}),m.jsx("b",{children:lt})]},String(D)))}),m.jsxs("p",{className:"muted small",children:["经营种子：",s.seed," · 已经营 ",s.day," 天"]}),m.jsxs("button",{className:"button primary full",onClick:()=>Te(`GREYLINE-${Date.now().toString(36).toUpperCase()}`),children:[m.jsx(Bh,{size:16}),"再开一次店"]}),m.jsx("button",{className:"button secondary full",onClick:()=>u("ledger"),children:"翻阅这次的账本"})]})]})})]})}$1.createRoot(document.getElementById("root")).render(m.jsx(X1.StrictMode,{children:m.jsx(ew,{})}));
