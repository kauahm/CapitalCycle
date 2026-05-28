function yE(t,e){for(var n=0;n<e.length;n++){const r=e[n];if(typeof r!="string"&&!Array.isArray(r)){for(const s in r)if(s!=="default"&&!(s in t)){const i=Object.getOwnPropertyDescriptor(r,s);i&&Object.defineProperty(t,s,i.get?i:{enumerable:!0,get:()=>r[s]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();function vE(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Hy={exports:{}},Yl={},Ky={exports:{}},ee={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var jo=Symbol.for("react.element"),_E=Symbol.for("react.portal"),wE=Symbol.for("react.fragment"),xE=Symbol.for("react.strict_mode"),EE=Symbol.for("react.profiler"),TE=Symbol.for("react.provider"),IE=Symbol.for("react.context"),SE=Symbol.for("react.forward_ref"),kE=Symbol.for("react.suspense"),CE=Symbol.for("react.memo"),AE=Symbol.for("react.lazy"),lm=Symbol.iterator;function RE(t){return t===null||typeof t!="object"?null:(t=lm&&t[lm]||t["@@iterator"],typeof t=="function"?t:null)}var Gy={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Qy=Object.assign,Yy={};function Qs(t,e,n){this.props=t,this.context=e,this.refs=Yy,this.updater=n||Gy}Qs.prototype.isReactComponent={};Qs.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Qs.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Xy(){}Xy.prototype=Qs.prototype;function uh(t,e,n){this.props=t,this.context=e,this.refs=Yy,this.updater=n||Gy}var ch=uh.prototype=new Xy;ch.constructor=uh;Qy(ch,Qs.prototype);ch.isPureReactComponent=!0;var um=Array.isArray,Jy=Object.prototype.hasOwnProperty,dh={current:null},Zy={key:!0,ref:!0,__self:!0,__source:!0};function ev(t,e,n){var r,s={},i=null,o=null;if(e!=null)for(r in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(i=""+e.key),e)Jy.call(e,r)&&!Zy.hasOwnProperty(r)&&(s[r]=e[r]);var l=arguments.length-2;if(l===1)s.children=n;else if(1<l){for(var u=Array(l),h=0;h<l;h++)u[h]=arguments[h+2];s.children=u}if(t&&t.defaultProps)for(r in l=t.defaultProps,l)s[r]===void 0&&(s[r]=l[r]);return{$$typeof:jo,type:t,key:i,ref:o,props:s,_owner:dh.current}}function bE(t,e){return{$$typeof:jo,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function hh(t){return typeof t=="object"&&t!==null&&t.$$typeof===jo}function NE(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var cm=/\/+/g;function Ju(t,e){return typeof t=="object"&&t!==null&&t.key!=null?NE(""+t.key):e.toString(36)}function Ma(t,e,n,r,s){var i=typeof t;(i==="undefined"||i==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(i){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case jo:case _E:o=!0}}if(o)return o=t,s=s(o),t=r===""?"."+Ju(o,0):r,um(s)?(n="",t!=null&&(n=t.replace(cm,"$&/")+"/"),Ma(s,e,n,"",function(h){return h})):s!=null&&(hh(s)&&(s=bE(s,n+(!s.key||o&&o.key===s.key?"":(""+s.key).replace(cm,"$&/")+"/")+t)),e.push(s)),1;if(o=0,r=r===""?".":r+":",um(t))for(var l=0;l<t.length;l++){i=t[l];var u=r+Ju(i,l);o+=Ma(i,e,n,u,s)}else if(u=RE(t),typeof u=="function")for(t=u.call(t),l=0;!(i=t.next()).done;)i=i.value,u=r+Ju(i,l++),o+=Ma(i,e,n,u,s);else if(i==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function ga(t,e,n){if(t==null)return t;var r=[],s=0;return Ma(t,r,"","",function(i){return e.call(n,i,s++)}),r}function PE(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var ut={current:null},Fa={transition:null},jE={ReactCurrentDispatcher:ut,ReactCurrentBatchConfig:Fa,ReactCurrentOwner:dh};function tv(){throw Error("act(...) is not supported in production builds of React.")}ee.Children={map:ga,forEach:function(t,e,n){ga(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return ga(t,function(){e++}),e},toArray:function(t){return ga(t,function(e){return e})||[]},only:function(t){if(!hh(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};ee.Component=Qs;ee.Fragment=wE;ee.Profiler=EE;ee.PureComponent=uh;ee.StrictMode=xE;ee.Suspense=kE;ee.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=jE;ee.act=tv;ee.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var r=Qy({},t.props),s=t.key,i=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(i=e.ref,o=dh.current),e.key!==void 0&&(s=""+e.key),t.type&&t.type.defaultProps)var l=t.type.defaultProps;for(u in e)Jy.call(e,u)&&!Zy.hasOwnProperty(u)&&(r[u]=e[u]===void 0&&l!==void 0?l[u]:e[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){l=Array(u);for(var h=0;h<u;h++)l[h]=arguments[h+2];r.children=l}return{$$typeof:jo,type:t.type,key:s,ref:i,props:r,_owner:o}};ee.createContext=function(t){return t={$$typeof:IE,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:TE,_context:t},t.Consumer=t};ee.createElement=ev;ee.createFactory=function(t){var e=ev.bind(null,t);return e.type=t,e};ee.createRef=function(){return{current:null}};ee.forwardRef=function(t){return{$$typeof:SE,render:t}};ee.isValidElement=hh;ee.lazy=function(t){return{$$typeof:AE,_payload:{_status:-1,_result:t},_init:PE}};ee.memo=function(t,e){return{$$typeof:CE,type:t,compare:e===void 0?null:e}};ee.startTransition=function(t){var e=Fa.transition;Fa.transition={};try{t()}finally{Fa.transition=e}};ee.unstable_act=tv;ee.useCallback=function(t,e){return ut.current.useCallback(t,e)};ee.useContext=function(t){return ut.current.useContext(t)};ee.useDebugValue=function(){};ee.useDeferredValue=function(t){return ut.current.useDeferredValue(t)};ee.useEffect=function(t,e){return ut.current.useEffect(t,e)};ee.useId=function(){return ut.current.useId()};ee.useImperativeHandle=function(t,e,n){return ut.current.useImperativeHandle(t,e,n)};ee.useInsertionEffect=function(t,e){return ut.current.useInsertionEffect(t,e)};ee.useLayoutEffect=function(t,e){return ut.current.useLayoutEffect(t,e)};ee.useMemo=function(t,e){return ut.current.useMemo(t,e)};ee.useReducer=function(t,e,n){return ut.current.useReducer(t,e,n)};ee.useRef=function(t){return ut.current.useRef(t)};ee.useState=function(t){return ut.current.useState(t)};ee.useSyncExternalStore=function(t,e,n){return ut.current.useSyncExternalStore(t,e,n)};ee.useTransition=function(){return ut.current.useTransition()};ee.version="18.3.1";Ky.exports=ee;var O=Ky.exports;const nv=vE(O),DE=yE({__proto__:null,default:nv},[O]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var OE=O,VE=Symbol.for("react.element"),LE=Symbol.for("react.fragment"),ME=Object.prototype.hasOwnProperty,FE=OE.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,UE={key:!0,ref:!0,__self:!0,__source:!0};function rv(t,e,n){var r,s={},i=null,o=null;n!==void 0&&(i=""+n),e.key!==void 0&&(i=""+e.key),e.ref!==void 0&&(o=e.ref);for(r in e)ME.call(e,r)&&!UE.hasOwnProperty(r)&&(s[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)s[r]===void 0&&(s[r]=e[r]);return{$$typeof:VE,type:t,key:i,ref:o,props:s,_owner:FE.current}}Yl.Fragment=LE;Yl.jsx=rv;Yl.jsxs=rv;Hy.exports=Yl;var c=Hy.exports,Lc={},sv={exports:{}},xt={},iv={exports:{}},ov={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(B,Q){var J=B.length;B.push(Q);e:for(;0<J;){var ye=J-1>>>1,ue=B[ye];if(0<s(ue,Q))B[ye]=Q,B[J]=ue,J=ye;else break e}}function n(B){return B.length===0?null:B[0]}function r(B){if(B.length===0)return null;var Q=B[0],J=B.pop();if(J!==Q){B[0]=J;e:for(var ye=0,ue=B.length,Ie=ue>>>1;ye<Ie;){var sn=2*(ye+1)-1,on=B[sn],an=sn+1,ln=B[an];if(0>s(on,J))an<ue&&0>s(ln,on)?(B[ye]=ln,B[an]=J,ye=an):(B[ye]=on,B[sn]=J,ye=sn);else if(an<ue&&0>s(ln,J))B[ye]=ln,B[an]=J,ye=an;else break e}}return Q}function s(B,Q){var J=B.sortIndex-Q.sortIndex;return J!==0?J:B.id-Q.id}if(typeof performance=="object"&&typeof performance.now=="function"){var i=performance;t.unstable_now=function(){return i.now()}}else{var o=Date,l=o.now();t.unstable_now=function(){return o.now()-l}}var u=[],h=[],p=1,m=null,y=3,k=!1,T=!1,R=!1,j=typeof setTimeout=="function"?setTimeout:null,S=typeof clearTimeout=="function"?clearTimeout:null,v=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function w(B){for(var Q=n(h);Q!==null;){if(Q.callback===null)r(h);else if(Q.startTime<=B)r(h),Q.sortIndex=Q.expirationTime,e(u,Q);else break;Q=n(h)}}function P(B){if(R=!1,w(B),!T)if(n(u)!==null)T=!0,ui(L);else{var Q=n(h);Q!==null&&rn(P,Q.startTime-B)}}function L(B,Q){T=!1,R&&(R=!1,S(_),_=-1),k=!0;var J=y;try{for(w(Q),m=n(u);m!==null&&(!(m.expirationTime>Q)||B&&!A());){var ye=m.callback;if(typeof ye=="function"){m.callback=null,y=m.priorityLevel;var ue=ye(m.expirationTime<=Q);Q=t.unstable_now(),typeof ue=="function"?m.callback=ue:m===n(u)&&r(u),w(Q)}else r(u);m=n(u)}if(m!==null)var Ie=!0;else{var sn=n(h);sn!==null&&rn(P,sn.startTime-Q),Ie=!1}return Ie}finally{m=null,y=J,k=!1}}var F=!1,I=null,_=-1,E=5,x=-1;function A(){return!(t.unstable_now()-x<E)}function b(){if(I!==null){var B=t.unstable_now();x=B;var Q=!0;try{Q=I(!0,B)}finally{Q?C():(F=!1,I=null)}}else F=!1}var C;if(typeof v=="function")C=function(){v(b)};else if(typeof MessageChannel<"u"){var Tt=new MessageChannel,xr=Tt.port2;Tt.port1.onmessage=b,C=function(){xr.postMessage(null)}}else C=function(){j(b,0)};function ui(B){I=B,F||(F=!0,C())}function rn(B,Q){_=j(function(){B(t.unstable_now())},Q)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(B){B.callback=null},t.unstable_continueExecution=function(){T||k||(T=!0,ui(L))},t.unstable_forceFrameRate=function(B){0>B||125<B?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):E=0<B?Math.floor(1e3/B):5},t.unstable_getCurrentPriorityLevel=function(){return y},t.unstable_getFirstCallbackNode=function(){return n(u)},t.unstable_next=function(B){switch(y){case 1:case 2:case 3:var Q=3;break;default:Q=y}var J=y;y=Q;try{return B()}finally{y=J}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(B,Q){switch(B){case 1:case 2:case 3:case 4:case 5:break;default:B=3}var J=y;y=B;try{return Q()}finally{y=J}},t.unstable_scheduleCallback=function(B,Q,J){var ye=t.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?ye+J:ye):J=ye,B){case 1:var ue=-1;break;case 2:ue=250;break;case 5:ue=1073741823;break;case 4:ue=1e4;break;default:ue=5e3}return ue=J+ue,B={id:p++,callback:Q,priorityLevel:B,startTime:J,expirationTime:ue,sortIndex:-1},J>ye?(B.sortIndex=J,e(h,B),n(u)===null&&B===n(h)&&(R?(S(_),_=-1):R=!0,rn(P,J-ye))):(B.sortIndex=ue,e(u,B),T||k||(T=!0,ui(L))),B},t.unstable_shouldYield=A,t.unstable_wrapCallback=function(B){var Q=y;return function(){var J=y;y=Q;try{return B.apply(this,arguments)}finally{y=J}}}})(ov);iv.exports=ov;var zE=iv.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var BE=O,wt=zE;function U(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var av=new Set,so={};function Gr(t,e){Ps(t,e),Ps(t+"Capture",e)}function Ps(t,e){for(so[t]=e,t=0;t<e.length;t++)av.add(e[t])}var wn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Mc=Object.prototype.hasOwnProperty,$E=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,dm={},hm={};function qE(t){return Mc.call(hm,t)?!0:Mc.call(dm,t)?!1:$E.test(t)?hm[t]=!0:(dm[t]=!0,!1)}function WE(t,e,n,r){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function HE(t,e,n,r){if(e===null||typeof e>"u"||WE(t,e,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function ct(t,e,n,r,s,i,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=r,this.attributeNamespace=s,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=i,this.removeEmptyString=o}var $e={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){$e[t]=new ct(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];$e[e]=new ct(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){$e[t]=new ct(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){$e[t]=new ct(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){$e[t]=new ct(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){$e[t]=new ct(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){$e[t]=new ct(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){$e[t]=new ct(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){$e[t]=new ct(t,5,!1,t.toLowerCase(),null,!1,!1)});var fh=/[\-:]([a-z])/g;function ph(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(fh,ph);$e[e]=new ct(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(fh,ph);$e[e]=new ct(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(fh,ph);$e[e]=new ct(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){$e[t]=new ct(t,1,!1,t.toLowerCase(),null,!1,!1)});$e.xlinkHref=new ct("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){$e[t]=new ct(t,1,!1,t.toLowerCase(),null,!0,!0)});function mh(t,e,n,r){var s=$e.hasOwnProperty(e)?$e[e]:null;(s!==null?s.type!==0:r||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(HE(e,n,s,r)&&(n=null),r||s===null?qE(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):s.mustUseProperty?t[s.propertyName]=n===null?s.type===3?!1:"":n:(e=s.attributeName,r=s.attributeNamespace,n===null?t.removeAttribute(e):(s=s.type,n=s===3||s===4&&n===!0?"":""+n,r?t.setAttributeNS(r,e,n):t.setAttribute(e,n))))}var An=BE.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ya=Symbol.for("react.element"),us=Symbol.for("react.portal"),cs=Symbol.for("react.fragment"),gh=Symbol.for("react.strict_mode"),Fc=Symbol.for("react.profiler"),lv=Symbol.for("react.provider"),uv=Symbol.for("react.context"),yh=Symbol.for("react.forward_ref"),Uc=Symbol.for("react.suspense"),zc=Symbol.for("react.suspense_list"),vh=Symbol.for("react.memo"),Ln=Symbol.for("react.lazy"),cv=Symbol.for("react.offscreen"),fm=Symbol.iterator;function Ti(t){return t===null||typeof t!="object"?null:(t=fm&&t[fm]||t["@@iterator"],typeof t=="function"?t:null)}var we=Object.assign,Zu;function Di(t){if(Zu===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Zu=e&&e[1]||""}return`
`+Zu+t}var ec=!1;function tc(t,e){if(!t||ec)return"";ec=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(h){var r=h}Reflect.construct(t,[],e)}else{try{e.call()}catch(h){r=h}t.call(e.prototype)}else{try{throw Error()}catch(h){r=h}t()}}catch(h){if(h&&r&&typeof h.stack=="string"){for(var s=h.stack.split(`
`),i=r.stack.split(`
`),o=s.length-1,l=i.length-1;1<=o&&0<=l&&s[o]!==i[l];)l--;for(;1<=o&&0<=l;o--,l--)if(s[o]!==i[l]){if(o!==1||l!==1)do if(o--,l--,0>l||s[o]!==i[l]){var u=`
`+s[o].replace(" at new "," at ");return t.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",t.displayName)),u}while(1<=o&&0<=l);break}}}finally{ec=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?Di(t):""}function KE(t){switch(t.tag){case 5:return Di(t.type);case 16:return Di("Lazy");case 13:return Di("Suspense");case 19:return Di("SuspenseList");case 0:case 2:case 15:return t=tc(t.type,!1),t;case 11:return t=tc(t.type.render,!1),t;case 1:return t=tc(t.type,!0),t;default:return""}}function Bc(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case cs:return"Fragment";case us:return"Portal";case Fc:return"Profiler";case gh:return"StrictMode";case Uc:return"Suspense";case zc:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case uv:return(t.displayName||"Context")+".Consumer";case lv:return(t._context.displayName||"Context")+".Provider";case yh:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case vh:return e=t.displayName||null,e!==null?e:Bc(t.type)||"Memo";case Ln:e=t._payload,t=t._init;try{return Bc(t(e))}catch{}}return null}function GE(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Bc(e);case 8:return e===gh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function cr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function dv(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function QE(t){var e=dv(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),r=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var s=n.get,i=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return s.call(this)},set:function(o){r=""+o,i.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function va(t){t._valueTracker||(t._valueTracker=QE(t))}function hv(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),r="";return t&&(r=dv(t)?t.checked?"true":"false":t.value),t=r,t!==n?(e.setValue(t),!0):!1}function il(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function $c(t,e){var n=e.checked;return we({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function pm(t,e){var n=e.defaultValue==null?"":e.defaultValue,r=e.checked!=null?e.checked:e.defaultChecked;n=cr(e.value!=null?e.value:n),t._wrapperState={initialChecked:r,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function fv(t,e){e=e.checked,e!=null&&mh(t,"checked",e,!1)}function qc(t,e){fv(t,e);var n=cr(e.value),r=e.type;if(n!=null)r==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(r==="submit"||r==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Wc(t,e.type,n):e.hasOwnProperty("defaultValue")&&Wc(t,e.type,cr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function mm(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var r=e.type;if(!(r!=="submit"&&r!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Wc(t,e,n){(e!=="number"||il(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Oi=Array.isArray;function Es(t,e,n,r){if(t=t.options,e){e={};for(var s=0;s<n.length;s++)e["$"+n[s]]=!0;for(n=0;n<t.length;n++)s=e.hasOwnProperty("$"+t[n].value),t[n].selected!==s&&(t[n].selected=s),s&&r&&(t[n].defaultSelected=!0)}else{for(n=""+cr(n),e=null,s=0;s<t.length;s++){if(t[s].value===n){t[s].selected=!0,r&&(t[s].defaultSelected=!0);return}e!==null||t[s].disabled||(e=t[s])}e!==null&&(e.selected=!0)}}function Hc(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(U(91));return we({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function gm(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(U(92));if(Oi(n)){if(1<n.length)throw Error(U(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:cr(n)}}function pv(t,e){var n=cr(e.value),r=cr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),r!=null&&(t.defaultValue=""+r)}function ym(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function mv(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Kc(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?mv(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var _a,gv=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,r,s){MSApp.execUnsafeLocalFunction(function(){return t(e,n,r,s)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(_a=_a||document.createElement("div"),_a.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=_a.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function io(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var qi={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},YE=["Webkit","ms","Moz","O"];Object.keys(qi).forEach(function(t){YE.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),qi[e]=qi[t]})});function yv(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||qi.hasOwnProperty(t)&&qi[t]?(""+e).trim():e+"px"}function vv(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var r=n.indexOf("--")===0,s=yv(n,e[n],r);n==="float"&&(n="cssFloat"),r?t.setProperty(n,s):t[n]=s}}var XE=we({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Gc(t,e){if(e){if(XE[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(U(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(U(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(U(61))}if(e.style!=null&&typeof e.style!="object")throw Error(U(62))}}function Qc(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Yc=null;function _h(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Xc=null,Ts=null,Is=null;function vm(t){if(t=Vo(t)){if(typeof Xc!="function")throw Error(U(280));var e=t.stateNode;e&&(e=tu(e),Xc(t.stateNode,t.type,e))}}function _v(t){Ts?Is?Is.push(t):Is=[t]:Ts=t}function wv(){if(Ts){var t=Ts,e=Is;if(Is=Ts=null,vm(t),e)for(t=0;t<e.length;t++)vm(e[t])}}function xv(t,e){return t(e)}function Ev(){}var nc=!1;function Tv(t,e,n){if(nc)return t(e,n);nc=!0;try{return xv(t,e,n)}finally{nc=!1,(Ts!==null||Is!==null)&&(Ev(),wv())}}function oo(t,e){var n=t.stateNode;if(n===null)return null;var r=tu(n);if(r===null)return null;n=r[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(U(231,e,typeof n));return n}var Jc=!1;if(wn)try{var Ii={};Object.defineProperty(Ii,"passive",{get:function(){Jc=!0}}),window.addEventListener("test",Ii,Ii),window.removeEventListener("test",Ii,Ii)}catch{Jc=!1}function JE(t,e,n,r,s,i,o,l,u){var h=Array.prototype.slice.call(arguments,3);try{e.apply(n,h)}catch(p){this.onError(p)}}var Wi=!1,ol=null,al=!1,Zc=null,ZE={onError:function(t){Wi=!0,ol=t}};function e1(t,e,n,r,s,i,o,l,u){Wi=!1,ol=null,JE.apply(ZE,arguments)}function t1(t,e,n,r,s,i,o,l,u){if(e1.apply(this,arguments),Wi){if(Wi){var h=ol;Wi=!1,ol=null}else throw Error(U(198));al||(al=!0,Zc=h)}}function Qr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Iv(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function _m(t){if(Qr(t)!==t)throw Error(U(188))}function n1(t){var e=t.alternate;if(!e){if(e=Qr(t),e===null)throw Error(U(188));return e!==t?null:t}for(var n=t,r=e;;){var s=n.return;if(s===null)break;var i=s.alternate;if(i===null){if(r=s.return,r!==null){n=r;continue}break}if(s.child===i.child){for(i=s.child;i;){if(i===n)return _m(s),t;if(i===r)return _m(s),e;i=i.sibling}throw Error(U(188))}if(n.return!==r.return)n=s,r=i;else{for(var o=!1,l=s.child;l;){if(l===n){o=!0,n=s,r=i;break}if(l===r){o=!0,r=s,n=i;break}l=l.sibling}if(!o){for(l=i.child;l;){if(l===n){o=!0,n=i,r=s;break}if(l===r){o=!0,r=i,n=s;break}l=l.sibling}if(!o)throw Error(U(189))}}if(n.alternate!==r)throw Error(U(190))}if(n.tag!==3)throw Error(U(188));return n.stateNode.current===n?t:e}function Sv(t){return t=n1(t),t!==null?kv(t):null}function kv(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=kv(t);if(e!==null)return e;t=t.sibling}return null}var Cv=wt.unstable_scheduleCallback,wm=wt.unstable_cancelCallback,r1=wt.unstable_shouldYield,s1=wt.unstable_requestPaint,ke=wt.unstable_now,i1=wt.unstable_getCurrentPriorityLevel,wh=wt.unstable_ImmediatePriority,Av=wt.unstable_UserBlockingPriority,ll=wt.unstable_NormalPriority,o1=wt.unstable_LowPriority,Rv=wt.unstable_IdlePriority,Xl=null,Qt=null;function a1(t){if(Qt&&typeof Qt.onCommitFiberRoot=="function")try{Qt.onCommitFiberRoot(Xl,t,void 0,(t.current.flags&128)===128)}catch{}}var Mt=Math.clz32?Math.clz32:c1,l1=Math.log,u1=Math.LN2;function c1(t){return t>>>=0,t===0?32:31-(l1(t)/u1|0)|0}var wa=64,xa=4194304;function Vi(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function ul(t,e){var n=t.pendingLanes;if(n===0)return 0;var r=0,s=t.suspendedLanes,i=t.pingedLanes,o=n&268435455;if(o!==0){var l=o&~s;l!==0?r=Vi(l):(i&=o,i!==0&&(r=Vi(i)))}else o=n&~s,o!==0?r=Vi(o):i!==0&&(r=Vi(i));if(r===0)return 0;if(e!==0&&e!==r&&!(e&s)&&(s=r&-r,i=e&-e,s>=i||s===16&&(i&4194240)!==0))return e;if(r&4&&(r|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=r;0<e;)n=31-Mt(e),s=1<<n,r|=t[n],e&=~s;return r}function d1(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function h1(t,e){for(var n=t.suspendedLanes,r=t.pingedLanes,s=t.expirationTimes,i=t.pendingLanes;0<i;){var o=31-Mt(i),l=1<<o,u=s[o];u===-1?(!(l&n)||l&r)&&(s[o]=d1(l,e)):u<=e&&(t.expiredLanes|=l),i&=~l}}function ed(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function bv(){var t=wa;return wa<<=1,!(wa&4194240)&&(wa=64),t}function rc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Do(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Mt(e),t[e]=n}function f1(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var r=t.eventTimes;for(t=t.expirationTimes;0<n;){var s=31-Mt(n),i=1<<s;e[s]=0,r[s]=-1,t[s]=-1,n&=~i}}function xh(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var r=31-Mt(n),s=1<<r;s&e|t[r]&e&&(t[r]|=e),n&=~s}}var ae=0;function Nv(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Pv,Eh,jv,Dv,Ov,td=!1,Ea=[],Qn=null,Yn=null,Xn=null,ao=new Map,lo=new Map,Fn=[],p1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function xm(t,e){switch(t){case"focusin":case"focusout":Qn=null;break;case"dragenter":case"dragleave":Yn=null;break;case"mouseover":case"mouseout":Xn=null;break;case"pointerover":case"pointerout":ao.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":lo.delete(e.pointerId)}}function Si(t,e,n,r,s,i){return t===null||t.nativeEvent!==i?(t={blockedOn:e,domEventName:n,eventSystemFlags:r,nativeEvent:i,targetContainers:[s]},e!==null&&(e=Vo(e),e!==null&&Eh(e)),t):(t.eventSystemFlags|=r,e=t.targetContainers,s!==null&&e.indexOf(s)===-1&&e.push(s),t)}function m1(t,e,n,r,s){switch(e){case"focusin":return Qn=Si(Qn,t,e,n,r,s),!0;case"dragenter":return Yn=Si(Yn,t,e,n,r,s),!0;case"mouseover":return Xn=Si(Xn,t,e,n,r,s),!0;case"pointerover":var i=s.pointerId;return ao.set(i,Si(ao.get(i)||null,t,e,n,r,s)),!0;case"gotpointercapture":return i=s.pointerId,lo.set(i,Si(lo.get(i)||null,t,e,n,r,s)),!0}return!1}function Vv(t){var e=Rr(t.target);if(e!==null){var n=Qr(e);if(n!==null){if(e=n.tag,e===13){if(e=Iv(n),e!==null){t.blockedOn=e,Ov(t.priority,function(){jv(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Ua(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=nd(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var r=new n.constructor(n.type,n);Yc=r,n.target.dispatchEvent(r),Yc=null}else return e=Vo(n),e!==null&&Eh(e),t.blockedOn=n,!1;e.shift()}return!0}function Em(t,e,n){Ua(t)&&n.delete(e)}function g1(){td=!1,Qn!==null&&Ua(Qn)&&(Qn=null),Yn!==null&&Ua(Yn)&&(Yn=null),Xn!==null&&Ua(Xn)&&(Xn=null),ao.forEach(Em),lo.forEach(Em)}function ki(t,e){t.blockedOn===e&&(t.blockedOn=null,td||(td=!0,wt.unstable_scheduleCallback(wt.unstable_NormalPriority,g1)))}function uo(t){function e(s){return ki(s,t)}if(0<Ea.length){ki(Ea[0],t);for(var n=1;n<Ea.length;n++){var r=Ea[n];r.blockedOn===t&&(r.blockedOn=null)}}for(Qn!==null&&ki(Qn,t),Yn!==null&&ki(Yn,t),Xn!==null&&ki(Xn,t),ao.forEach(e),lo.forEach(e),n=0;n<Fn.length;n++)r=Fn[n],r.blockedOn===t&&(r.blockedOn=null);for(;0<Fn.length&&(n=Fn[0],n.blockedOn===null);)Vv(n),n.blockedOn===null&&Fn.shift()}var Ss=An.ReactCurrentBatchConfig,cl=!0;function y1(t,e,n,r){var s=ae,i=Ss.transition;Ss.transition=null;try{ae=1,Th(t,e,n,r)}finally{ae=s,Ss.transition=i}}function v1(t,e,n,r){var s=ae,i=Ss.transition;Ss.transition=null;try{ae=4,Th(t,e,n,r)}finally{ae=s,Ss.transition=i}}function Th(t,e,n,r){if(cl){var s=nd(t,e,n,r);if(s===null)fc(t,e,r,dl,n),xm(t,r);else if(m1(s,t,e,n,r))r.stopPropagation();else if(xm(t,r),e&4&&-1<p1.indexOf(t)){for(;s!==null;){var i=Vo(s);if(i!==null&&Pv(i),i=nd(t,e,n,r),i===null&&fc(t,e,r,dl,n),i===s)break;s=i}s!==null&&r.stopPropagation()}else fc(t,e,r,null,n)}}var dl=null;function nd(t,e,n,r){if(dl=null,t=_h(r),t=Rr(t),t!==null)if(e=Qr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Iv(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return dl=t,null}function Lv(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(i1()){case wh:return 1;case Av:return 4;case ll:case o1:return 16;case Rv:return 536870912;default:return 16}default:return 16}}var Wn=null,Ih=null,za=null;function Mv(){if(za)return za;var t,e=Ih,n=e.length,r,s="value"in Wn?Wn.value:Wn.textContent,i=s.length;for(t=0;t<n&&e[t]===s[t];t++);var o=n-t;for(r=1;r<=o&&e[n-r]===s[i-r];r++);return za=s.slice(t,1<r?1-r:void 0)}function Ba(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Ta(){return!0}function Tm(){return!1}function Et(t){function e(n,r,s,i,o){this._reactName=n,this._targetInst=s,this.type=r,this.nativeEvent=i,this.target=o,this.currentTarget=null;for(var l in t)t.hasOwnProperty(l)&&(n=t[l],this[l]=n?n(i):i[l]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?Ta:Tm,this.isPropagationStopped=Tm,this}return we(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ta)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ta)},persist:function(){},isPersistent:Ta}),e}var Ys={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Sh=Et(Ys),Oo=we({},Ys,{view:0,detail:0}),_1=Et(Oo),sc,ic,Ci,Jl=we({},Oo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:kh,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Ci&&(Ci&&t.type==="mousemove"?(sc=t.screenX-Ci.screenX,ic=t.screenY-Ci.screenY):ic=sc=0,Ci=t),sc)},movementY:function(t){return"movementY"in t?t.movementY:ic}}),Im=Et(Jl),w1=we({},Jl,{dataTransfer:0}),x1=Et(w1),E1=we({},Oo,{relatedTarget:0}),oc=Et(E1),T1=we({},Ys,{animationName:0,elapsedTime:0,pseudoElement:0}),I1=Et(T1),S1=we({},Ys,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),k1=Et(S1),C1=we({},Ys,{data:0}),Sm=Et(C1),A1={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},R1={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},b1={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function N1(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=b1[t])?!!e[t]:!1}function kh(){return N1}var P1=we({},Oo,{key:function(t){if(t.key){var e=A1[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Ba(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?R1[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:kh,charCode:function(t){return t.type==="keypress"?Ba(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Ba(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),j1=Et(P1),D1=we({},Jl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),km=Et(D1),O1=we({},Oo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:kh}),V1=Et(O1),L1=we({},Ys,{propertyName:0,elapsedTime:0,pseudoElement:0}),M1=Et(L1),F1=we({},Jl,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),U1=Et(F1),z1=[9,13,27,32],Ch=wn&&"CompositionEvent"in window,Hi=null;wn&&"documentMode"in document&&(Hi=document.documentMode);var B1=wn&&"TextEvent"in window&&!Hi,Fv=wn&&(!Ch||Hi&&8<Hi&&11>=Hi),Cm=" ",Am=!1;function Uv(t,e){switch(t){case"keyup":return z1.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function zv(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var ds=!1;function $1(t,e){switch(t){case"compositionend":return zv(e);case"keypress":return e.which!==32?null:(Am=!0,Cm);case"textInput":return t=e.data,t===Cm&&Am?null:t;default:return null}}function q1(t,e){if(ds)return t==="compositionend"||!Ch&&Uv(t,e)?(t=Mv(),za=Ih=Wn=null,ds=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Fv&&e.locale!=="ko"?null:e.data;default:return null}}var W1={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Rm(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!W1[t.type]:e==="textarea"}function Bv(t,e,n,r){_v(r),e=hl(e,"onChange"),0<e.length&&(n=new Sh("onChange","change",null,n,r),t.push({event:n,listeners:e}))}var Ki=null,co=null;function H1(t){Zv(t,0)}function Zl(t){var e=ps(t);if(hv(e))return t}function K1(t,e){if(t==="change")return e}var $v=!1;if(wn){var ac;if(wn){var lc="oninput"in document;if(!lc){var bm=document.createElement("div");bm.setAttribute("oninput","return;"),lc=typeof bm.oninput=="function"}ac=lc}else ac=!1;$v=ac&&(!document.documentMode||9<document.documentMode)}function Nm(){Ki&&(Ki.detachEvent("onpropertychange",qv),co=Ki=null)}function qv(t){if(t.propertyName==="value"&&Zl(co)){var e=[];Bv(e,co,t,_h(t)),Tv(H1,e)}}function G1(t,e,n){t==="focusin"?(Nm(),Ki=e,co=n,Ki.attachEvent("onpropertychange",qv)):t==="focusout"&&Nm()}function Q1(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Zl(co)}function Y1(t,e){if(t==="click")return Zl(e)}function X1(t,e){if(t==="input"||t==="change")return Zl(e)}function J1(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Bt=typeof Object.is=="function"?Object.is:J1;function ho(t,e){if(Bt(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var s=n[r];if(!Mc.call(e,s)||!Bt(t[s],e[s]))return!1}return!0}function Pm(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function jm(t,e){var n=Pm(t);t=0;for(var r;n;){if(n.nodeType===3){if(r=t+n.textContent.length,t<=e&&r>=e)return{node:n,offset:e-t};t=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Pm(n)}}function Wv(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Wv(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function Hv(){for(var t=window,e=il();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=il(t.document)}return e}function Ah(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function Z1(t){var e=Hv(),n=t.focusedElem,r=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&Wv(n.ownerDocument.documentElement,n)){if(r!==null&&Ah(n)){if(e=r.start,t=r.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var s=n.textContent.length,i=Math.min(r.start,s);r=r.end===void 0?i:Math.min(r.end,s),!t.extend&&i>r&&(s=r,r=i,i=s),s=jm(n,i);var o=jm(n,r);s&&o&&(t.rangeCount!==1||t.anchorNode!==s.node||t.anchorOffset!==s.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(s.node,s.offset),t.removeAllRanges(),i>r?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var eT=wn&&"documentMode"in document&&11>=document.documentMode,hs=null,rd=null,Gi=null,sd=!1;function Dm(t,e,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;sd||hs==null||hs!==il(r)||(r=hs,"selectionStart"in r&&Ah(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Gi&&ho(Gi,r)||(Gi=r,r=hl(rd,"onSelect"),0<r.length&&(e=new Sh("onSelect","select",null,e,n),t.push({event:e,listeners:r}),e.target=hs)))}function Ia(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var fs={animationend:Ia("Animation","AnimationEnd"),animationiteration:Ia("Animation","AnimationIteration"),animationstart:Ia("Animation","AnimationStart"),transitionend:Ia("Transition","TransitionEnd")},uc={},Kv={};wn&&(Kv=document.createElement("div").style,"AnimationEvent"in window||(delete fs.animationend.animation,delete fs.animationiteration.animation,delete fs.animationstart.animation),"TransitionEvent"in window||delete fs.transitionend.transition);function eu(t){if(uc[t])return uc[t];if(!fs[t])return t;var e=fs[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in Kv)return uc[t]=e[n];return t}var Gv=eu("animationend"),Qv=eu("animationiteration"),Yv=eu("animationstart"),Xv=eu("transitionend"),Jv=new Map,Om="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function mr(t,e){Jv.set(t,e),Gr(e,[t])}for(var cc=0;cc<Om.length;cc++){var dc=Om[cc],tT=dc.toLowerCase(),nT=dc[0].toUpperCase()+dc.slice(1);mr(tT,"on"+nT)}mr(Gv,"onAnimationEnd");mr(Qv,"onAnimationIteration");mr(Yv,"onAnimationStart");mr("dblclick","onDoubleClick");mr("focusin","onFocus");mr("focusout","onBlur");mr(Xv,"onTransitionEnd");Ps("onMouseEnter",["mouseout","mouseover"]);Ps("onMouseLeave",["mouseout","mouseover"]);Ps("onPointerEnter",["pointerout","pointerover"]);Ps("onPointerLeave",["pointerout","pointerover"]);Gr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Gr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Gr("onBeforeInput",["compositionend","keypress","textInput","paste"]);Gr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Gr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Gr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Li="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),rT=new Set("cancel close invalid load scroll toggle".split(" ").concat(Li));function Vm(t,e,n){var r=t.type||"unknown-event";t.currentTarget=n,t1(r,e,void 0,t),t.currentTarget=null}function Zv(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var r=t[n],s=r.event;r=r.listeners;e:{var i=void 0;if(e)for(var o=r.length-1;0<=o;o--){var l=r[o],u=l.instance,h=l.currentTarget;if(l=l.listener,u!==i&&s.isPropagationStopped())break e;Vm(s,l,h),i=u}else for(o=0;o<r.length;o++){if(l=r[o],u=l.instance,h=l.currentTarget,l=l.listener,u!==i&&s.isPropagationStopped())break e;Vm(s,l,h),i=u}}}if(al)throw t=Zc,al=!1,Zc=null,t}function fe(t,e){var n=e[ud];n===void 0&&(n=e[ud]=new Set);var r=t+"__bubble";n.has(r)||(e0(e,t,2,!1),n.add(r))}function hc(t,e,n){var r=0;e&&(r|=4),e0(n,t,r,e)}var Sa="_reactListening"+Math.random().toString(36).slice(2);function fo(t){if(!t[Sa]){t[Sa]=!0,av.forEach(function(n){n!=="selectionchange"&&(rT.has(n)||hc(n,!1,t),hc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Sa]||(e[Sa]=!0,hc("selectionchange",!1,e))}}function e0(t,e,n,r){switch(Lv(e)){case 1:var s=y1;break;case 4:s=v1;break;default:s=Th}n=s.bind(null,e,n,t),s=void 0,!Jc||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(s=!0),r?s!==void 0?t.addEventListener(e,n,{capture:!0,passive:s}):t.addEventListener(e,n,!0):s!==void 0?t.addEventListener(e,n,{passive:s}):t.addEventListener(e,n,!1)}function fc(t,e,n,r,s){var i=r;if(!(e&1)&&!(e&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var l=r.stateNode.containerInfo;if(l===s||l.nodeType===8&&l.parentNode===s)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===s||u.nodeType===8&&u.parentNode===s))return;o=o.return}for(;l!==null;){if(o=Rr(l),o===null)return;if(u=o.tag,u===5||u===6){r=i=o;continue e}l=l.parentNode}}r=r.return}Tv(function(){var h=i,p=_h(n),m=[];e:{var y=Jv.get(t);if(y!==void 0){var k=Sh,T=t;switch(t){case"keypress":if(Ba(n)===0)break e;case"keydown":case"keyup":k=j1;break;case"focusin":T="focus",k=oc;break;case"focusout":T="blur",k=oc;break;case"beforeblur":case"afterblur":k=oc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":k=Im;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":k=x1;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":k=V1;break;case Gv:case Qv:case Yv:k=I1;break;case Xv:k=M1;break;case"scroll":k=_1;break;case"wheel":k=U1;break;case"copy":case"cut":case"paste":k=k1;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":k=km}var R=(e&4)!==0,j=!R&&t==="scroll",S=R?y!==null?y+"Capture":null:y;R=[];for(var v=h,w;v!==null;){w=v;var P=w.stateNode;if(w.tag===5&&P!==null&&(w=P,S!==null&&(P=oo(v,S),P!=null&&R.push(po(v,P,w)))),j)break;v=v.return}0<R.length&&(y=new k(y,T,null,n,p),m.push({event:y,listeners:R}))}}if(!(e&7)){e:{if(y=t==="mouseover"||t==="pointerover",k=t==="mouseout"||t==="pointerout",y&&n!==Yc&&(T=n.relatedTarget||n.fromElement)&&(Rr(T)||T[xn]))break e;if((k||y)&&(y=p.window===p?p:(y=p.ownerDocument)?y.defaultView||y.parentWindow:window,k?(T=n.relatedTarget||n.toElement,k=h,T=T?Rr(T):null,T!==null&&(j=Qr(T),T!==j||T.tag!==5&&T.tag!==6)&&(T=null)):(k=null,T=h),k!==T)){if(R=Im,P="onMouseLeave",S="onMouseEnter",v="mouse",(t==="pointerout"||t==="pointerover")&&(R=km,P="onPointerLeave",S="onPointerEnter",v="pointer"),j=k==null?y:ps(k),w=T==null?y:ps(T),y=new R(P,v+"leave",k,n,p),y.target=j,y.relatedTarget=w,P=null,Rr(p)===h&&(R=new R(S,v+"enter",T,n,p),R.target=w,R.relatedTarget=j,P=R),j=P,k&&T)t:{for(R=k,S=T,v=0,w=R;w;w=ss(w))v++;for(w=0,P=S;P;P=ss(P))w++;for(;0<v-w;)R=ss(R),v--;for(;0<w-v;)S=ss(S),w--;for(;v--;){if(R===S||S!==null&&R===S.alternate)break t;R=ss(R),S=ss(S)}R=null}else R=null;k!==null&&Lm(m,y,k,R,!1),T!==null&&j!==null&&Lm(m,j,T,R,!0)}}e:{if(y=h?ps(h):window,k=y.nodeName&&y.nodeName.toLowerCase(),k==="select"||k==="input"&&y.type==="file")var L=K1;else if(Rm(y))if($v)L=X1;else{L=Q1;var F=G1}else(k=y.nodeName)&&k.toLowerCase()==="input"&&(y.type==="checkbox"||y.type==="radio")&&(L=Y1);if(L&&(L=L(t,h))){Bv(m,L,n,p);break e}F&&F(t,y,h),t==="focusout"&&(F=y._wrapperState)&&F.controlled&&y.type==="number"&&Wc(y,"number",y.value)}switch(F=h?ps(h):window,t){case"focusin":(Rm(F)||F.contentEditable==="true")&&(hs=F,rd=h,Gi=null);break;case"focusout":Gi=rd=hs=null;break;case"mousedown":sd=!0;break;case"contextmenu":case"mouseup":case"dragend":sd=!1,Dm(m,n,p);break;case"selectionchange":if(eT)break;case"keydown":case"keyup":Dm(m,n,p)}var I;if(Ch)e:{switch(t){case"compositionstart":var _="onCompositionStart";break e;case"compositionend":_="onCompositionEnd";break e;case"compositionupdate":_="onCompositionUpdate";break e}_=void 0}else ds?Uv(t,n)&&(_="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(_="onCompositionStart");_&&(Fv&&n.locale!=="ko"&&(ds||_!=="onCompositionStart"?_==="onCompositionEnd"&&ds&&(I=Mv()):(Wn=p,Ih="value"in Wn?Wn.value:Wn.textContent,ds=!0)),F=hl(h,_),0<F.length&&(_=new Sm(_,t,null,n,p),m.push({event:_,listeners:F}),I?_.data=I:(I=zv(n),I!==null&&(_.data=I)))),(I=B1?$1(t,n):q1(t,n))&&(h=hl(h,"onBeforeInput"),0<h.length&&(p=new Sm("onBeforeInput","beforeinput",null,n,p),m.push({event:p,listeners:h}),p.data=I))}Zv(m,e)})}function po(t,e,n){return{instance:t,listener:e,currentTarget:n}}function hl(t,e){for(var n=e+"Capture",r=[];t!==null;){var s=t,i=s.stateNode;s.tag===5&&i!==null&&(s=i,i=oo(t,n),i!=null&&r.unshift(po(t,i,s)),i=oo(t,e),i!=null&&r.push(po(t,i,s))),t=t.return}return r}function ss(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Lm(t,e,n,r,s){for(var i=e._reactName,o=[];n!==null&&n!==r;){var l=n,u=l.alternate,h=l.stateNode;if(u!==null&&u===r)break;l.tag===5&&h!==null&&(l=h,s?(u=oo(n,i),u!=null&&o.unshift(po(n,u,l))):s||(u=oo(n,i),u!=null&&o.push(po(n,u,l)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var sT=/\r\n?/g,iT=/\u0000|\uFFFD/g;function Mm(t){return(typeof t=="string"?t:""+t).replace(sT,`
`).replace(iT,"")}function ka(t,e,n){if(e=Mm(e),Mm(t)!==e&&n)throw Error(U(425))}function fl(){}var id=null,od=null;function ad(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var ld=typeof setTimeout=="function"?setTimeout:void 0,oT=typeof clearTimeout=="function"?clearTimeout:void 0,Fm=typeof Promise=="function"?Promise:void 0,aT=typeof queueMicrotask=="function"?queueMicrotask:typeof Fm<"u"?function(t){return Fm.resolve(null).then(t).catch(lT)}:ld;function lT(t){setTimeout(function(){throw t})}function pc(t,e){var n=e,r=0;do{var s=n.nextSibling;if(t.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"){if(r===0){t.removeChild(s),uo(e);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=s}while(n);uo(e)}function Jn(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function Um(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Xs=Math.random().toString(36).slice(2),Kt="__reactFiber$"+Xs,mo="__reactProps$"+Xs,xn="__reactContainer$"+Xs,ud="__reactEvents$"+Xs,uT="__reactListeners$"+Xs,cT="__reactHandles$"+Xs;function Rr(t){var e=t[Kt];if(e)return e;for(var n=t.parentNode;n;){if(e=n[xn]||n[Kt]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=Um(t);t!==null;){if(n=t[Kt])return n;t=Um(t)}return e}t=n,n=t.parentNode}return null}function Vo(t){return t=t[Kt]||t[xn],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function ps(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(U(33))}function tu(t){return t[mo]||null}var cd=[],ms=-1;function gr(t){return{current:t}}function me(t){0>ms||(t.current=cd[ms],cd[ms]=null,ms--)}function de(t,e){ms++,cd[ms]=t.current,t.current=e}var dr={},nt=gr(dr),ft=gr(!1),Vr=dr;function js(t,e){var n=t.type.contextTypes;if(!n)return dr;var r=t.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===e)return r.__reactInternalMemoizedMaskedChildContext;var s={},i;for(i in n)s[i]=e[i];return r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=s),s}function pt(t){return t=t.childContextTypes,t!=null}function pl(){me(ft),me(nt)}function zm(t,e,n){if(nt.current!==dr)throw Error(U(168));de(nt,e),de(ft,n)}function t0(t,e,n){var r=t.stateNode;if(e=e.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var s in r)if(!(s in e))throw Error(U(108,GE(t)||"Unknown",s));return we({},n,r)}function ml(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||dr,Vr=nt.current,de(nt,t),de(ft,ft.current),!0}function Bm(t,e,n){var r=t.stateNode;if(!r)throw Error(U(169));n?(t=t0(t,e,Vr),r.__reactInternalMemoizedMergedChildContext=t,me(ft),me(nt),de(nt,t)):me(ft),de(ft,n)}var hn=null,nu=!1,mc=!1;function n0(t){hn===null?hn=[t]:hn.push(t)}function dT(t){nu=!0,n0(t)}function yr(){if(!mc&&hn!==null){mc=!0;var t=0,e=ae;try{var n=hn;for(ae=1;t<n.length;t++){var r=n[t];do r=r(!0);while(r!==null)}hn=null,nu=!1}catch(s){throw hn!==null&&(hn=hn.slice(t+1)),Cv(wh,yr),s}finally{ae=e,mc=!1}}return null}var gs=[],ys=0,gl=null,yl=0,It=[],St=0,Lr=null,fn=1,pn="";function kr(t,e){gs[ys++]=yl,gs[ys++]=gl,gl=t,yl=e}function r0(t,e,n){It[St++]=fn,It[St++]=pn,It[St++]=Lr,Lr=t;var r=fn;t=pn;var s=32-Mt(r)-1;r&=~(1<<s),n+=1;var i=32-Mt(e)+s;if(30<i){var o=s-s%5;i=(r&(1<<o)-1).toString(32),r>>=o,s-=o,fn=1<<32-Mt(e)+s|n<<s|r,pn=i+t}else fn=1<<i|n<<s|r,pn=t}function Rh(t){t.return!==null&&(kr(t,1),r0(t,1,0))}function bh(t){for(;t===gl;)gl=gs[--ys],gs[ys]=null,yl=gs[--ys],gs[ys]=null;for(;t===Lr;)Lr=It[--St],It[St]=null,pn=It[--St],It[St]=null,fn=It[--St],It[St]=null}var _t=null,vt=null,ge=!1,Vt=null;function s0(t,e){var n=Ct(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function $m(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,_t=t,vt=Jn(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,_t=t,vt=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Lr!==null?{id:fn,overflow:pn}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Ct(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,_t=t,vt=null,!0):!1;default:return!1}}function dd(t){return(t.mode&1)!==0&&(t.flags&128)===0}function hd(t){if(ge){var e=vt;if(e){var n=e;if(!$m(t,e)){if(dd(t))throw Error(U(418));e=Jn(n.nextSibling);var r=_t;e&&$m(t,e)?s0(r,n):(t.flags=t.flags&-4097|2,ge=!1,_t=t)}}else{if(dd(t))throw Error(U(418));t.flags=t.flags&-4097|2,ge=!1,_t=t}}}function qm(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;_t=t}function Ca(t){if(t!==_t)return!1;if(!ge)return qm(t),ge=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!ad(t.type,t.memoizedProps)),e&&(e=vt)){if(dd(t))throw i0(),Error(U(418));for(;e;)s0(t,e),e=Jn(e.nextSibling)}if(qm(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(U(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){vt=Jn(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}vt=null}}else vt=_t?Jn(t.stateNode.nextSibling):null;return!0}function i0(){for(var t=vt;t;)t=Jn(t.nextSibling)}function Ds(){vt=_t=null,ge=!1}function Nh(t){Vt===null?Vt=[t]:Vt.push(t)}var hT=An.ReactCurrentBatchConfig;function Ai(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(U(309));var r=n.stateNode}if(!r)throw Error(U(147,t));var s=r,i=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===i?e.ref:(e=function(o){var l=s.refs;o===null?delete l[i]:l[i]=o},e._stringRef=i,e)}if(typeof t!="string")throw Error(U(284));if(!n._owner)throw Error(U(290,t))}return t}function Aa(t,e){throw t=Object.prototype.toString.call(e),Error(U(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Wm(t){var e=t._init;return e(t._payload)}function o0(t){function e(S,v){if(t){var w=S.deletions;w===null?(S.deletions=[v],S.flags|=16):w.push(v)}}function n(S,v){if(!t)return null;for(;v!==null;)e(S,v),v=v.sibling;return null}function r(S,v){for(S=new Map;v!==null;)v.key!==null?S.set(v.key,v):S.set(v.index,v),v=v.sibling;return S}function s(S,v){return S=nr(S,v),S.index=0,S.sibling=null,S}function i(S,v,w){return S.index=w,t?(w=S.alternate,w!==null?(w=w.index,w<v?(S.flags|=2,v):w):(S.flags|=2,v)):(S.flags|=1048576,v)}function o(S){return t&&S.alternate===null&&(S.flags|=2),S}function l(S,v,w,P){return v===null||v.tag!==6?(v=Ec(w,S.mode,P),v.return=S,v):(v=s(v,w),v.return=S,v)}function u(S,v,w,P){var L=w.type;return L===cs?p(S,v,w.props.children,P,w.key):v!==null&&(v.elementType===L||typeof L=="object"&&L!==null&&L.$$typeof===Ln&&Wm(L)===v.type)?(P=s(v,w.props),P.ref=Ai(S,v,w),P.return=S,P):(P=Qa(w.type,w.key,w.props,null,S.mode,P),P.ref=Ai(S,v,w),P.return=S,P)}function h(S,v,w,P){return v===null||v.tag!==4||v.stateNode.containerInfo!==w.containerInfo||v.stateNode.implementation!==w.implementation?(v=Tc(w,S.mode,P),v.return=S,v):(v=s(v,w.children||[]),v.return=S,v)}function p(S,v,w,P,L){return v===null||v.tag!==7?(v=Dr(w,S.mode,P,L),v.return=S,v):(v=s(v,w),v.return=S,v)}function m(S,v,w){if(typeof v=="string"&&v!==""||typeof v=="number")return v=Ec(""+v,S.mode,w),v.return=S,v;if(typeof v=="object"&&v!==null){switch(v.$$typeof){case ya:return w=Qa(v.type,v.key,v.props,null,S.mode,w),w.ref=Ai(S,null,v),w.return=S,w;case us:return v=Tc(v,S.mode,w),v.return=S,v;case Ln:var P=v._init;return m(S,P(v._payload),w)}if(Oi(v)||Ti(v))return v=Dr(v,S.mode,w,null),v.return=S,v;Aa(S,v)}return null}function y(S,v,w,P){var L=v!==null?v.key:null;if(typeof w=="string"&&w!==""||typeof w=="number")return L!==null?null:l(S,v,""+w,P);if(typeof w=="object"&&w!==null){switch(w.$$typeof){case ya:return w.key===L?u(S,v,w,P):null;case us:return w.key===L?h(S,v,w,P):null;case Ln:return L=w._init,y(S,v,L(w._payload),P)}if(Oi(w)||Ti(w))return L!==null?null:p(S,v,w,P,null);Aa(S,w)}return null}function k(S,v,w,P,L){if(typeof P=="string"&&P!==""||typeof P=="number")return S=S.get(w)||null,l(v,S,""+P,L);if(typeof P=="object"&&P!==null){switch(P.$$typeof){case ya:return S=S.get(P.key===null?w:P.key)||null,u(v,S,P,L);case us:return S=S.get(P.key===null?w:P.key)||null,h(v,S,P,L);case Ln:var F=P._init;return k(S,v,w,F(P._payload),L)}if(Oi(P)||Ti(P))return S=S.get(w)||null,p(v,S,P,L,null);Aa(v,P)}return null}function T(S,v,w,P){for(var L=null,F=null,I=v,_=v=0,E=null;I!==null&&_<w.length;_++){I.index>_?(E=I,I=null):E=I.sibling;var x=y(S,I,w[_],P);if(x===null){I===null&&(I=E);break}t&&I&&x.alternate===null&&e(S,I),v=i(x,v,_),F===null?L=x:F.sibling=x,F=x,I=E}if(_===w.length)return n(S,I),ge&&kr(S,_),L;if(I===null){for(;_<w.length;_++)I=m(S,w[_],P),I!==null&&(v=i(I,v,_),F===null?L=I:F.sibling=I,F=I);return ge&&kr(S,_),L}for(I=r(S,I);_<w.length;_++)E=k(I,S,_,w[_],P),E!==null&&(t&&E.alternate!==null&&I.delete(E.key===null?_:E.key),v=i(E,v,_),F===null?L=E:F.sibling=E,F=E);return t&&I.forEach(function(A){return e(S,A)}),ge&&kr(S,_),L}function R(S,v,w,P){var L=Ti(w);if(typeof L!="function")throw Error(U(150));if(w=L.call(w),w==null)throw Error(U(151));for(var F=L=null,I=v,_=v=0,E=null,x=w.next();I!==null&&!x.done;_++,x=w.next()){I.index>_?(E=I,I=null):E=I.sibling;var A=y(S,I,x.value,P);if(A===null){I===null&&(I=E);break}t&&I&&A.alternate===null&&e(S,I),v=i(A,v,_),F===null?L=A:F.sibling=A,F=A,I=E}if(x.done)return n(S,I),ge&&kr(S,_),L;if(I===null){for(;!x.done;_++,x=w.next())x=m(S,x.value,P),x!==null&&(v=i(x,v,_),F===null?L=x:F.sibling=x,F=x);return ge&&kr(S,_),L}for(I=r(S,I);!x.done;_++,x=w.next())x=k(I,S,_,x.value,P),x!==null&&(t&&x.alternate!==null&&I.delete(x.key===null?_:x.key),v=i(x,v,_),F===null?L=x:F.sibling=x,F=x);return t&&I.forEach(function(b){return e(S,b)}),ge&&kr(S,_),L}function j(S,v,w,P){if(typeof w=="object"&&w!==null&&w.type===cs&&w.key===null&&(w=w.props.children),typeof w=="object"&&w!==null){switch(w.$$typeof){case ya:e:{for(var L=w.key,F=v;F!==null;){if(F.key===L){if(L=w.type,L===cs){if(F.tag===7){n(S,F.sibling),v=s(F,w.props.children),v.return=S,S=v;break e}}else if(F.elementType===L||typeof L=="object"&&L!==null&&L.$$typeof===Ln&&Wm(L)===F.type){n(S,F.sibling),v=s(F,w.props),v.ref=Ai(S,F,w),v.return=S,S=v;break e}n(S,F);break}else e(S,F);F=F.sibling}w.type===cs?(v=Dr(w.props.children,S.mode,P,w.key),v.return=S,S=v):(P=Qa(w.type,w.key,w.props,null,S.mode,P),P.ref=Ai(S,v,w),P.return=S,S=P)}return o(S);case us:e:{for(F=w.key;v!==null;){if(v.key===F)if(v.tag===4&&v.stateNode.containerInfo===w.containerInfo&&v.stateNode.implementation===w.implementation){n(S,v.sibling),v=s(v,w.children||[]),v.return=S,S=v;break e}else{n(S,v);break}else e(S,v);v=v.sibling}v=Tc(w,S.mode,P),v.return=S,S=v}return o(S);case Ln:return F=w._init,j(S,v,F(w._payload),P)}if(Oi(w))return T(S,v,w,P);if(Ti(w))return R(S,v,w,P);Aa(S,w)}return typeof w=="string"&&w!==""||typeof w=="number"?(w=""+w,v!==null&&v.tag===6?(n(S,v.sibling),v=s(v,w),v.return=S,S=v):(n(S,v),v=Ec(w,S.mode,P),v.return=S,S=v),o(S)):n(S,v)}return j}var Os=o0(!0),a0=o0(!1),vl=gr(null),_l=null,vs=null,Ph=null;function jh(){Ph=vs=_l=null}function Dh(t){var e=vl.current;me(vl),t._currentValue=e}function fd(t,e,n){for(;t!==null;){var r=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,r!==null&&(r.childLanes|=e)):r!==null&&(r.childLanes&e)!==e&&(r.childLanes|=e),t===n)break;t=t.return}}function ks(t,e){_l=t,Ph=vs=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(ht=!0),t.firstContext=null)}function Rt(t){var e=t._currentValue;if(Ph!==t)if(t={context:t,memoizedValue:e,next:null},vs===null){if(_l===null)throw Error(U(308));vs=t,_l.dependencies={lanes:0,firstContext:t}}else vs=vs.next=t;return e}var br=null;function Oh(t){br===null?br=[t]:br.push(t)}function l0(t,e,n,r){var s=e.interleaved;return s===null?(n.next=n,Oh(e)):(n.next=s.next,s.next=n),e.interleaved=n,En(t,r)}function En(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var Mn=!1;function Vh(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function u0(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function vn(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Zn(t,e,n){var r=t.updateQueue;if(r===null)return null;if(r=r.shared,se&2){var s=r.pending;return s===null?e.next=e:(e.next=s.next,s.next=e),r.pending=e,En(t,n)}return s=r.interleaved,s===null?(e.next=e,Oh(r)):(e.next=s.next,s.next=e),r.interleaved=e,En(t,n)}function $a(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,xh(t,n)}}function Hm(t,e){var n=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var s=null,i=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};i===null?s=i=o:i=i.next=o,n=n.next}while(n!==null);i===null?s=i=e:i=i.next=e}else s=i=e;n={baseState:r.baseState,firstBaseUpdate:s,lastBaseUpdate:i,shared:r.shared,effects:r.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function wl(t,e,n,r){var s=t.updateQueue;Mn=!1;var i=s.firstBaseUpdate,o=s.lastBaseUpdate,l=s.shared.pending;if(l!==null){s.shared.pending=null;var u=l,h=u.next;u.next=null,o===null?i=h:o.next=h,o=u;var p=t.alternate;p!==null&&(p=p.updateQueue,l=p.lastBaseUpdate,l!==o&&(l===null?p.firstBaseUpdate=h:l.next=h,p.lastBaseUpdate=u))}if(i!==null){var m=s.baseState;o=0,p=h=u=null,l=i;do{var y=l.lane,k=l.eventTime;if((r&y)===y){p!==null&&(p=p.next={eventTime:k,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var T=t,R=l;switch(y=e,k=n,R.tag){case 1:if(T=R.payload,typeof T=="function"){m=T.call(k,m,y);break e}m=T;break e;case 3:T.flags=T.flags&-65537|128;case 0:if(T=R.payload,y=typeof T=="function"?T.call(k,m,y):T,y==null)break e;m=we({},m,y);break e;case 2:Mn=!0}}l.callback!==null&&l.lane!==0&&(t.flags|=64,y=s.effects,y===null?s.effects=[l]:y.push(l))}else k={eventTime:k,lane:y,tag:l.tag,payload:l.payload,callback:l.callback,next:null},p===null?(h=p=k,u=m):p=p.next=k,o|=y;if(l=l.next,l===null){if(l=s.shared.pending,l===null)break;y=l,l=y.next,y.next=null,s.lastBaseUpdate=y,s.shared.pending=null}}while(!0);if(p===null&&(u=m),s.baseState=u,s.firstBaseUpdate=h,s.lastBaseUpdate=p,e=s.shared.interleaved,e!==null){s=e;do o|=s.lane,s=s.next;while(s!==e)}else i===null&&(s.shared.lanes=0);Fr|=o,t.lanes=o,t.memoizedState=m}}function Km(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var r=t[e],s=r.callback;if(s!==null){if(r.callback=null,r=n,typeof s!="function")throw Error(U(191,s));s.call(r)}}}var Lo={},Yt=gr(Lo),go=gr(Lo),yo=gr(Lo);function Nr(t){if(t===Lo)throw Error(U(174));return t}function Lh(t,e){switch(de(yo,e),de(go,t),de(Yt,Lo),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Kc(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Kc(e,t)}me(Yt),de(Yt,e)}function Vs(){me(Yt),me(go),me(yo)}function c0(t){Nr(yo.current);var e=Nr(Yt.current),n=Kc(e,t.type);e!==n&&(de(go,t),de(Yt,n))}function Mh(t){go.current===t&&(me(Yt),me(go))}var ve=gr(0);function xl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var gc=[];function Fh(){for(var t=0;t<gc.length;t++)gc[t]._workInProgressVersionPrimary=null;gc.length=0}var qa=An.ReactCurrentDispatcher,yc=An.ReactCurrentBatchConfig,Mr=0,_e=null,Ne=null,Oe=null,El=!1,Qi=!1,vo=0,fT=0;function Qe(){throw Error(U(321))}function Uh(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Bt(t[n],e[n]))return!1;return!0}function zh(t,e,n,r,s,i){if(Mr=i,_e=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,qa.current=t===null||t.memoizedState===null?yT:vT,t=n(r,s),Qi){i=0;do{if(Qi=!1,vo=0,25<=i)throw Error(U(301));i+=1,Oe=Ne=null,e.updateQueue=null,qa.current=_T,t=n(r,s)}while(Qi)}if(qa.current=Tl,e=Ne!==null&&Ne.next!==null,Mr=0,Oe=Ne=_e=null,El=!1,e)throw Error(U(300));return t}function Bh(){var t=vo!==0;return vo=0,t}function Ht(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Oe===null?_e.memoizedState=Oe=t:Oe=Oe.next=t,Oe}function bt(){if(Ne===null){var t=_e.alternate;t=t!==null?t.memoizedState:null}else t=Ne.next;var e=Oe===null?_e.memoizedState:Oe.next;if(e!==null)Oe=e,Ne=t;else{if(t===null)throw Error(U(310));Ne=t,t={memoizedState:Ne.memoizedState,baseState:Ne.baseState,baseQueue:Ne.baseQueue,queue:Ne.queue,next:null},Oe===null?_e.memoizedState=Oe=t:Oe=Oe.next=t}return Oe}function _o(t,e){return typeof e=="function"?e(t):e}function vc(t){var e=bt(),n=e.queue;if(n===null)throw Error(U(311));n.lastRenderedReducer=t;var r=Ne,s=r.baseQueue,i=n.pending;if(i!==null){if(s!==null){var o=s.next;s.next=i.next,i.next=o}r.baseQueue=s=i,n.pending=null}if(s!==null){i=s.next,r=r.baseState;var l=o=null,u=null,h=i;do{var p=h.lane;if((Mr&p)===p)u!==null&&(u=u.next={lane:0,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null}),r=h.hasEagerState?h.eagerState:t(r,h.action);else{var m={lane:p,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null};u===null?(l=u=m,o=r):u=u.next=m,_e.lanes|=p,Fr|=p}h=h.next}while(h!==null&&h!==i);u===null?o=r:u.next=l,Bt(r,e.memoizedState)||(ht=!0),e.memoizedState=r,e.baseState=o,e.baseQueue=u,n.lastRenderedState=r}if(t=n.interleaved,t!==null){s=t;do i=s.lane,_e.lanes|=i,Fr|=i,s=s.next;while(s!==t)}else s===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function _c(t){var e=bt(),n=e.queue;if(n===null)throw Error(U(311));n.lastRenderedReducer=t;var r=n.dispatch,s=n.pending,i=e.memoizedState;if(s!==null){n.pending=null;var o=s=s.next;do i=t(i,o.action),o=o.next;while(o!==s);Bt(i,e.memoizedState)||(ht=!0),e.memoizedState=i,e.baseQueue===null&&(e.baseState=i),n.lastRenderedState=i}return[i,r]}function d0(){}function h0(t,e){var n=_e,r=bt(),s=e(),i=!Bt(r.memoizedState,s);if(i&&(r.memoizedState=s,ht=!0),r=r.queue,$h(m0.bind(null,n,r,t),[t]),r.getSnapshot!==e||i||Oe!==null&&Oe.memoizedState.tag&1){if(n.flags|=2048,wo(9,p0.bind(null,n,r,s,e),void 0,null),Ve===null)throw Error(U(349));Mr&30||f0(n,e,s)}return s}function f0(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=_e.updateQueue,e===null?(e={lastEffect:null,stores:null},_e.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function p0(t,e,n,r){e.value=n,e.getSnapshot=r,g0(e)&&y0(t)}function m0(t,e,n){return n(function(){g0(e)&&y0(t)})}function g0(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Bt(t,n)}catch{return!0}}function y0(t){var e=En(t,1);e!==null&&Ft(e,t,1,-1)}function Gm(t){var e=Ht();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:_o,lastRenderedState:t},e.queue=t,t=t.dispatch=gT.bind(null,_e,t),[e.memoizedState,t]}function wo(t,e,n,r){return t={tag:t,create:e,destroy:n,deps:r,next:null},e=_e.updateQueue,e===null?(e={lastEffect:null,stores:null},_e.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(r=n.next,n.next=t,t.next=r,e.lastEffect=t)),t}function v0(){return bt().memoizedState}function Wa(t,e,n,r){var s=Ht();_e.flags|=t,s.memoizedState=wo(1|e,n,void 0,r===void 0?null:r)}function ru(t,e,n,r){var s=bt();r=r===void 0?null:r;var i=void 0;if(Ne!==null){var o=Ne.memoizedState;if(i=o.destroy,r!==null&&Uh(r,o.deps)){s.memoizedState=wo(e,n,i,r);return}}_e.flags|=t,s.memoizedState=wo(1|e,n,i,r)}function Qm(t,e){return Wa(8390656,8,t,e)}function $h(t,e){return ru(2048,8,t,e)}function _0(t,e){return ru(4,2,t,e)}function w0(t,e){return ru(4,4,t,e)}function x0(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function E0(t,e,n){return n=n!=null?n.concat([t]):null,ru(4,4,x0.bind(null,e,t),n)}function qh(){}function T0(t,e){var n=bt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Uh(e,r[1])?r[0]:(n.memoizedState=[t,e],t)}function I0(t,e){var n=bt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Uh(e,r[1])?r[0]:(t=t(),n.memoizedState=[t,e],t)}function S0(t,e,n){return Mr&21?(Bt(n,e)||(n=bv(),_e.lanes|=n,Fr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,ht=!0),t.memoizedState=n)}function pT(t,e){var n=ae;ae=n!==0&&4>n?n:4,t(!0);var r=yc.transition;yc.transition={};try{t(!1),e()}finally{ae=n,yc.transition=r}}function k0(){return bt().memoizedState}function mT(t,e,n){var r=tr(t);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},C0(t))A0(e,n);else if(n=l0(t,e,n,r),n!==null){var s=at();Ft(n,t,r,s),R0(n,e,r)}}function gT(t,e,n){var r=tr(t),s={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(C0(t))A0(e,s);else{var i=t.alternate;if(t.lanes===0&&(i===null||i.lanes===0)&&(i=e.lastRenderedReducer,i!==null))try{var o=e.lastRenderedState,l=i(o,n);if(s.hasEagerState=!0,s.eagerState=l,Bt(l,o)){var u=e.interleaved;u===null?(s.next=s,Oh(e)):(s.next=u.next,u.next=s),e.interleaved=s;return}}catch{}finally{}n=l0(t,e,s,r),n!==null&&(s=at(),Ft(n,t,r,s),R0(n,e,r))}}function C0(t){var e=t.alternate;return t===_e||e!==null&&e===_e}function A0(t,e){Qi=El=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function R0(t,e,n){if(n&4194240){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,xh(t,n)}}var Tl={readContext:Rt,useCallback:Qe,useContext:Qe,useEffect:Qe,useImperativeHandle:Qe,useInsertionEffect:Qe,useLayoutEffect:Qe,useMemo:Qe,useReducer:Qe,useRef:Qe,useState:Qe,useDebugValue:Qe,useDeferredValue:Qe,useTransition:Qe,useMutableSource:Qe,useSyncExternalStore:Qe,useId:Qe,unstable_isNewReconciler:!1},yT={readContext:Rt,useCallback:function(t,e){return Ht().memoizedState=[t,e===void 0?null:e],t},useContext:Rt,useEffect:Qm,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,Wa(4194308,4,x0.bind(null,e,t),n)},useLayoutEffect:function(t,e){return Wa(4194308,4,t,e)},useInsertionEffect:function(t,e){return Wa(4,2,t,e)},useMemo:function(t,e){var n=Ht();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var r=Ht();return e=n!==void 0?n(e):e,r.memoizedState=r.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},r.queue=t,t=t.dispatch=mT.bind(null,_e,t),[r.memoizedState,t]},useRef:function(t){var e=Ht();return t={current:t},e.memoizedState=t},useState:Gm,useDebugValue:qh,useDeferredValue:function(t){return Ht().memoizedState=t},useTransition:function(){var t=Gm(!1),e=t[0];return t=pT.bind(null,t[1]),Ht().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var r=_e,s=Ht();if(ge){if(n===void 0)throw Error(U(407));n=n()}else{if(n=e(),Ve===null)throw Error(U(349));Mr&30||f0(r,e,n)}s.memoizedState=n;var i={value:n,getSnapshot:e};return s.queue=i,Qm(m0.bind(null,r,i,t),[t]),r.flags|=2048,wo(9,p0.bind(null,r,i,n,e),void 0,null),n},useId:function(){var t=Ht(),e=Ve.identifierPrefix;if(ge){var n=pn,r=fn;n=(r&~(1<<32-Mt(r)-1)).toString(32)+n,e=":"+e+"R"+n,n=vo++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=fT++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},vT={readContext:Rt,useCallback:T0,useContext:Rt,useEffect:$h,useImperativeHandle:E0,useInsertionEffect:_0,useLayoutEffect:w0,useMemo:I0,useReducer:vc,useRef:v0,useState:function(){return vc(_o)},useDebugValue:qh,useDeferredValue:function(t){var e=bt();return S0(e,Ne.memoizedState,t)},useTransition:function(){var t=vc(_o)[0],e=bt().memoizedState;return[t,e]},useMutableSource:d0,useSyncExternalStore:h0,useId:k0,unstable_isNewReconciler:!1},_T={readContext:Rt,useCallback:T0,useContext:Rt,useEffect:$h,useImperativeHandle:E0,useInsertionEffect:_0,useLayoutEffect:w0,useMemo:I0,useReducer:_c,useRef:v0,useState:function(){return _c(_o)},useDebugValue:qh,useDeferredValue:function(t){var e=bt();return Ne===null?e.memoizedState=t:S0(e,Ne.memoizedState,t)},useTransition:function(){var t=_c(_o)[0],e=bt().memoizedState;return[t,e]},useMutableSource:d0,useSyncExternalStore:h0,useId:k0,unstable_isNewReconciler:!1};function Dt(t,e){if(t&&t.defaultProps){e=we({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function pd(t,e,n,r){e=t.memoizedState,n=n(r,e),n=n==null?e:we({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var su={isMounted:function(t){return(t=t._reactInternals)?Qr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var r=at(),s=tr(t),i=vn(r,s);i.payload=e,n!=null&&(i.callback=n),e=Zn(t,i,s),e!==null&&(Ft(e,t,s,r),$a(e,t,s))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var r=at(),s=tr(t),i=vn(r,s);i.tag=1,i.payload=e,n!=null&&(i.callback=n),e=Zn(t,i,s),e!==null&&(Ft(e,t,s,r),$a(e,t,s))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=at(),r=tr(t),s=vn(n,r);s.tag=2,e!=null&&(s.callback=e),e=Zn(t,s,r),e!==null&&(Ft(e,t,r,n),$a(e,t,r))}};function Ym(t,e,n,r,s,i,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,i,o):e.prototype&&e.prototype.isPureReactComponent?!ho(n,r)||!ho(s,i):!0}function b0(t,e,n){var r=!1,s=dr,i=e.contextType;return typeof i=="object"&&i!==null?i=Rt(i):(s=pt(e)?Vr:nt.current,r=e.contextTypes,i=(r=r!=null)?js(t,s):dr),e=new e(n,i),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=su,t.stateNode=e,e._reactInternals=t,r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=s,t.__reactInternalMemoizedMaskedChildContext=i),e}function Xm(t,e,n,r){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,r),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,r),e.state!==t&&su.enqueueReplaceState(e,e.state,null)}function md(t,e,n,r){var s=t.stateNode;s.props=n,s.state=t.memoizedState,s.refs={},Vh(t);var i=e.contextType;typeof i=="object"&&i!==null?s.context=Rt(i):(i=pt(e)?Vr:nt.current,s.context=js(t,i)),s.state=t.memoizedState,i=e.getDerivedStateFromProps,typeof i=="function"&&(pd(t,e,i,n),s.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(e=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),e!==s.state&&su.enqueueReplaceState(s,s.state,null),wl(t,n,s,r),s.state=t.memoizedState),typeof s.componentDidMount=="function"&&(t.flags|=4194308)}function Ls(t,e){try{var n="",r=e;do n+=KE(r),r=r.return;while(r);var s=n}catch(i){s=`
Error generating stack: `+i.message+`
`+i.stack}return{value:t,source:e,stack:s,digest:null}}function wc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function gd(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var wT=typeof WeakMap=="function"?WeakMap:Map;function N0(t,e,n){n=vn(-1,n),n.tag=3,n.payload={element:null};var r=e.value;return n.callback=function(){Sl||(Sl=!0,kd=r),gd(t,e)},n}function P0(t,e,n){n=vn(-1,n),n.tag=3;var r=t.type.getDerivedStateFromError;if(typeof r=="function"){var s=e.value;n.payload=function(){return r(s)},n.callback=function(){gd(t,e)}}var i=t.stateNode;return i!==null&&typeof i.componentDidCatch=="function"&&(n.callback=function(){gd(t,e),typeof r!="function"&&(er===null?er=new Set([this]):er.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function Jm(t,e,n){var r=t.pingCache;if(r===null){r=t.pingCache=new wT;var s=new Set;r.set(e,s)}else s=r.get(e),s===void 0&&(s=new Set,r.set(e,s));s.has(n)||(s.add(n),t=DT.bind(null,t,e,n),e.then(t,t))}function Zm(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function eg(t,e,n,r,s){return t.mode&1?(t.flags|=65536,t.lanes=s,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=vn(-1,1),e.tag=2,Zn(n,e,1))),n.lanes|=1),t)}var xT=An.ReactCurrentOwner,ht=!1;function ot(t,e,n,r){e.child=t===null?a0(e,null,n,r):Os(e,t.child,n,r)}function tg(t,e,n,r,s){n=n.render;var i=e.ref;return ks(e,s),r=zh(t,e,n,r,i,s),n=Bh(),t!==null&&!ht?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~s,Tn(t,e,s)):(ge&&n&&Rh(e),e.flags|=1,ot(t,e,r,s),e.child)}function ng(t,e,n,r,s){if(t===null){var i=n.type;return typeof i=="function"&&!Jh(i)&&i.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=i,j0(t,e,i,r,s)):(t=Qa(n.type,null,r,e,e.mode,s),t.ref=e.ref,t.return=e,e.child=t)}if(i=t.child,!(t.lanes&s)){var o=i.memoizedProps;if(n=n.compare,n=n!==null?n:ho,n(o,r)&&t.ref===e.ref)return Tn(t,e,s)}return e.flags|=1,t=nr(i,r),t.ref=e.ref,t.return=e,e.child=t}function j0(t,e,n,r,s){if(t!==null){var i=t.memoizedProps;if(ho(i,r)&&t.ref===e.ref)if(ht=!1,e.pendingProps=r=i,(t.lanes&s)!==0)t.flags&131072&&(ht=!0);else return e.lanes=t.lanes,Tn(t,e,s)}return yd(t,e,n,r,s)}function D0(t,e,n){var r=e.pendingProps,s=r.children,i=t!==null?t.memoizedState:null;if(r.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},de(ws,yt),yt|=n;else{if(!(n&1073741824))return t=i!==null?i.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,de(ws,yt),yt|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=i!==null?i.baseLanes:n,de(ws,yt),yt|=r}else i!==null?(r=i.baseLanes|n,e.memoizedState=null):r=n,de(ws,yt),yt|=r;return ot(t,e,s,n),e.child}function O0(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function yd(t,e,n,r,s){var i=pt(n)?Vr:nt.current;return i=js(e,i),ks(e,s),n=zh(t,e,n,r,i,s),r=Bh(),t!==null&&!ht?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~s,Tn(t,e,s)):(ge&&r&&Rh(e),e.flags|=1,ot(t,e,n,s),e.child)}function rg(t,e,n,r,s){if(pt(n)){var i=!0;ml(e)}else i=!1;if(ks(e,s),e.stateNode===null)Ha(t,e),b0(e,n,r),md(e,n,r,s),r=!0;else if(t===null){var o=e.stateNode,l=e.memoizedProps;o.props=l;var u=o.context,h=n.contextType;typeof h=="object"&&h!==null?h=Rt(h):(h=pt(n)?Vr:nt.current,h=js(e,h));var p=n.getDerivedStateFromProps,m=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function";m||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==r||u!==h)&&Xm(e,o,r,h),Mn=!1;var y=e.memoizedState;o.state=y,wl(e,r,o,s),u=e.memoizedState,l!==r||y!==u||ft.current||Mn?(typeof p=="function"&&(pd(e,n,p,r),u=e.memoizedState),(l=Mn||Ym(e,n,l,r,y,u,h))?(m||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=r,e.memoizedState=u),o.props=r,o.state=u,o.context=h,r=l):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),r=!1)}else{o=e.stateNode,u0(t,e),l=e.memoizedProps,h=e.type===e.elementType?l:Dt(e.type,l),o.props=h,m=e.pendingProps,y=o.context,u=n.contextType,typeof u=="object"&&u!==null?u=Rt(u):(u=pt(n)?Vr:nt.current,u=js(e,u));var k=n.getDerivedStateFromProps;(p=typeof k=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==m||y!==u)&&Xm(e,o,r,u),Mn=!1,y=e.memoizedState,o.state=y,wl(e,r,o,s);var T=e.memoizedState;l!==m||y!==T||ft.current||Mn?(typeof k=="function"&&(pd(e,n,k,r),T=e.memoizedState),(h=Mn||Ym(e,n,h,r,y,T,u)||!1)?(p||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,T,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,T,u)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&y===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&y===t.memoizedState||(e.flags|=1024),e.memoizedProps=r,e.memoizedState=T),o.props=r,o.state=T,o.context=u,r=h):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&y===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&y===t.memoizedState||(e.flags|=1024),r=!1)}return vd(t,e,n,r,i,s)}function vd(t,e,n,r,s,i){O0(t,e);var o=(e.flags&128)!==0;if(!r&&!o)return s&&Bm(e,n,!1),Tn(t,e,i);r=e.stateNode,xT.current=e;var l=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return e.flags|=1,t!==null&&o?(e.child=Os(e,t.child,null,i),e.child=Os(e,null,l,i)):ot(t,e,l,i),e.memoizedState=r.state,s&&Bm(e,n,!0),e.child}function V0(t){var e=t.stateNode;e.pendingContext?zm(t,e.pendingContext,e.pendingContext!==e.context):e.context&&zm(t,e.context,!1),Lh(t,e.containerInfo)}function sg(t,e,n,r,s){return Ds(),Nh(s),e.flags|=256,ot(t,e,n,r),e.child}var _d={dehydrated:null,treeContext:null,retryLane:0};function wd(t){return{baseLanes:t,cachePool:null,transitions:null}}function L0(t,e,n){var r=e.pendingProps,s=ve.current,i=!1,o=(e.flags&128)!==0,l;if((l=o)||(l=t!==null&&t.memoizedState===null?!1:(s&2)!==0),l?(i=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(s|=1),de(ve,s&1),t===null)return hd(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=r.children,t=r.fallback,i?(r=e.mode,i=e.child,o={mode:"hidden",children:o},!(r&1)&&i!==null?(i.childLanes=0,i.pendingProps=o):i=au(o,r,0,null),t=Dr(t,r,n,null),i.return=e,t.return=e,i.sibling=t,e.child=i,e.child.memoizedState=wd(n),e.memoizedState=_d,t):Wh(e,o));if(s=t.memoizedState,s!==null&&(l=s.dehydrated,l!==null))return ET(t,e,o,r,l,s,n);if(i){i=r.fallback,o=e.mode,s=t.child,l=s.sibling;var u={mode:"hidden",children:r.children};return!(o&1)&&e.child!==s?(r=e.child,r.childLanes=0,r.pendingProps=u,e.deletions=null):(r=nr(s,u),r.subtreeFlags=s.subtreeFlags&14680064),l!==null?i=nr(l,i):(i=Dr(i,o,n,null),i.flags|=2),i.return=e,r.return=e,r.sibling=i,e.child=r,r=i,i=e.child,o=t.child.memoizedState,o=o===null?wd(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},i.memoizedState=o,i.childLanes=t.childLanes&~n,e.memoizedState=_d,r}return i=t.child,t=i.sibling,r=nr(i,{mode:"visible",children:r.children}),!(e.mode&1)&&(r.lanes=n),r.return=e,r.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=r,e.memoizedState=null,r}function Wh(t,e){return e=au({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Ra(t,e,n,r){return r!==null&&Nh(r),Os(e,t.child,null,n),t=Wh(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function ET(t,e,n,r,s,i,o){if(n)return e.flags&256?(e.flags&=-257,r=wc(Error(U(422))),Ra(t,e,o,r)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(i=r.fallback,s=e.mode,r=au({mode:"visible",children:r.children},s,0,null),i=Dr(i,s,o,null),i.flags|=2,r.return=e,i.return=e,r.sibling=i,e.child=r,e.mode&1&&Os(e,t.child,null,o),e.child.memoizedState=wd(o),e.memoizedState=_d,i);if(!(e.mode&1))return Ra(t,e,o,null);if(s.data==="$!"){if(r=s.nextSibling&&s.nextSibling.dataset,r)var l=r.dgst;return r=l,i=Error(U(419)),r=wc(i,r,void 0),Ra(t,e,o,r)}if(l=(o&t.childLanes)!==0,ht||l){if(r=Ve,r!==null){switch(o&-o){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=s&(r.suspendedLanes|o)?0:s,s!==0&&s!==i.retryLane&&(i.retryLane=s,En(t,s),Ft(r,t,s,-1))}return Xh(),r=wc(Error(U(421))),Ra(t,e,o,r)}return s.data==="$?"?(e.flags|=128,e.child=t.child,e=OT.bind(null,t),s._reactRetry=e,null):(t=i.treeContext,vt=Jn(s.nextSibling),_t=e,ge=!0,Vt=null,t!==null&&(It[St++]=fn,It[St++]=pn,It[St++]=Lr,fn=t.id,pn=t.overflow,Lr=e),e=Wh(e,r.children),e.flags|=4096,e)}function ig(t,e,n){t.lanes|=e;var r=t.alternate;r!==null&&(r.lanes|=e),fd(t.return,e,n)}function xc(t,e,n,r,s){var i=t.memoizedState;i===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:s}:(i.isBackwards=e,i.rendering=null,i.renderingStartTime=0,i.last=r,i.tail=n,i.tailMode=s)}function M0(t,e,n){var r=e.pendingProps,s=r.revealOrder,i=r.tail;if(ot(t,e,r.children,n),r=ve.current,r&2)r=r&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&ig(t,n,e);else if(t.tag===19)ig(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}r&=1}if(de(ve,r),!(e.mode&1))e.memoizedState=null;else switch(s){case"forwards":for(n=e.child,s=null;n!==null;)t=n.alternate,t!==null&&xl(t)===null&&(s=n),n=n.sibling;n=s,n===null?(s=e.child,e.child=null):(s=n.sibling,n.sibling=null),xc(e,!1,s,n,i);break;case"backwards":for(n=null,s=e.child,e.child=null;s!==null;){if(t=s.alternate,t!==null&&xl(t)===null){e.child=s;break}t=s.sibling,s.sibling=n,n=s,s=t}xc(e,!0,n,null,i);break;case"together":xc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Ha(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Tn(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Fr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(U(153));if(e.child!==null){for(t=e.child,n=nr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=nr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function TT(t,e,n){switch(e.tag){case 3:V0(e),Ds();break;case 5:c0(e);break;case 1:pt(e.type)&&ml(e);break;case 4:Lh(e,e.stateNode.containerInfo);break;case 10:var r=e.type._context,s=e.memoizedProps.value;de(vl,r._currentValue),r._currentValue=s;break;case 13:if(r=e.memoizedState,r!==null)return r.dehydrated!==null?(de(ve,ve.current&1),e.flags|=128,null):n&e.child.childLanes?L0(t,e,n):(de(ve,ve.current&1),t=Tn(t,e,n),t!==null?t.sibling:null);de(ve,ve.current&1);break;case 19:if(r=(n&e.childLanes)!==0,t.flags&128){if(r)return M0(t,e,n);e.flags|=128}if(s=e.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),de(ve,ve.current),r)break;return null;case 22:case 23:return e.lanes=0,D0(t,e,n)}return Tn(t,e,n)}var F0,xd,U0,z0;F0=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};xd=function(){};U0=function(t,e,n,r){var s=t.memoizedProps;if(s!==r){t=e.stateNode,Nr(Yt.current);var i=null;switch(n){case"input":s=$c(t,s),r=$c(t,r),i=[];break;case"select":s=we({},s,{value:void 0}),r=we({},r,{value:void 0}),i=[];break;case"textarea":s=Hc(t,s),r=Hc(t,r),i=[];break;default:typeof s.onClick!="function"&&typeof r.onClick=="function"&&(t.onclick=fl)}Gc(n,r);var o;n=null;for(h in s)if(!r.hasOwnProperty(h)&&s.hasOwnProperty(h)&&s[h]!=null)if(h==="style"){var l=s[h];for(o in l)l.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else h!=="dangerouslySetInnerHTML"&&h!=="children"&&h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&h!=="autoFocus"&&(so.hasOwnProperty(h)?i||(i=[]):(i=i||[]).push(h,null));for(h in r){var u=r[h];if(l=s!=null?s[h]:void 0,r.hasOwnProperty(h)&&u!==l&&(u!=null||l!=null))if(h==="style")if(l){for(o in l)!l.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in u)u.hasOwnProperty(o)&&l[o]!==u[o]&&(n||(n={}),n[o]=u[o])}else n||(i||(i=[]),i.push(h,n)),n=u;else h==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,l=l?l.__html:void 0,u!=null&&l!==u&&(i=i||[]).push(h,u)):h==="children"?typeof u!="string"&&typeof u!="number"||(i=i||[]).push(h,""+u):h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&(so.hasOwnProperty(h)?(u!=null&&h==="onScroll"&&fe("scroll",t),i||l===u||(i=[])):(i=i||[]).push(h,u))}n&&(i=i||[]).push("style",n);var h=i;(e.updateQueue=h)&&(e.flags|=4)}};z0=function(t,e,n,r){n!==r&&(e.flags|=4)};function Ri(t,e){if(!ge)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null}}function Ye(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,r=0;if(e)for(var s=t.child;s!==null;)n|=s.lanes|s.childLanes,r|=s.subtreeFlags&14680064,r|=s.flags&14680064,s.return=t,s=s.sibling;else for(s=t.child;s!==null;)n|=s.lanes|s.childLanes,r|=s.subtreeFlags,r|=s.flags,s.return=t,s=s.sibling;return t.subtreeFlags|=r,t.childLanes=n,e}function IT(t,e,n){var r=e.pendingProps;switch(bh(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ye(e),null;case 1:return pt(e.type)&&pl(),Ye(e),null;case 3:return r=e.stateNode,Vs(),me(ft),me(nt),Fh(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(t===null||t.child===null)&&(Ca(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Vt!==null&&(Rd(Vt),Vt=null))),xd(t,e),Ye(e),null;case 5:Mh(e);var s=Nr(yo.current);if(n=e.type,t!==null&&e.stateNode!=null)U0(t,e,n,r,s),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!r){if(e.stateNode===null)throw Error(U(166));return Ye(e),null}if(t=Nr(Yt.current),Ca(e)){r=e.stateNode,n=e.type;var i=e.memoizedProps;switch(r[Kt]=e,r[mo]=i,t=(e.mode&1)!==0,n){case"dialog":fe("cancel",r),fe("close",r);break;case"iframe":case"object":case"embed":fe("load",r);break;case"video":case"audio":for(s=0;s<Li.length;s++)fe(Li[s],r);break;case"source":fe("error",r);break;case"img":case"image":case"link":fe("error",r),fe("load",r);break;case"details":fe("toggle",r);break;case"input":pm(r,i),fe("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!i.multiple},fe("invalid",r);break;case"textarea":gm(r,i),fe("invalid",r)}Gc(n,i),s=null;for(var o in i)if(i.hasOwnProperty(o)){var l=i[o];o==="children"?typeof l=="string"?r.textContent!==l&&(i.suppressHydrationWarning!==!0&&ka(r.textContent,l,t),s=["children",l]):typeof l=="number"&&r.textContent!==""+l&&(i.suppressHydrationWarning!==!0&&ka(r.textContent,l,t),s=["children",""+l]):so.hasOwnProperty(o)&&l!=null&&o==="onScroll"&&fe("scroll",r)}switch(n){case"input":va(r),mm(r,i,!0);break;case"textarea":va(r),ym(r);break;case"select":case"option":break;default:typeof i.onClick=="function"&&(r.onclick=fl)}r=s,e.updateQueue=r,r!==null&&(e.flags|=4)}else{o=s.nodeType===9?s:s.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=mv(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof r.is=="string"?t=o.createElement(n,{is:r.is}):(t=o.createElement(n),n==="select"&&(o=t,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):t=o.createElementNS(t,n),t[Kt]=e,t[mo]=r,F0(t,e,!1,!1),e.stateNode=t;e:{switch(o=Qc(n,r),n){case"dialog":fe("cancel",t),fe("close",t),s=r;break;case"iframe":case"object":case"embed":fe("load",t),s=r;break;case"video":case"audio":for(s=0;s<Li.length;s++)fe(Li[s],t);s=r;break;case"source":fe("error",t),s=r;break;case"img":case"image":case"link":fe("error",t),fe("load",t),s=r;break;case"details":fe("toggle",t),s=r;break;case"input":pm(t,r),s=$c(t,r),fe("invalid",t);break;case"option":s=r;break;case"select":t._wrapperState={wasMultiple:!!r.multiple},s=we({},r,{value:void 0}),fe("invalid",t);break;case"textarea":gm(t,r),s=Hc(t,r),fe("invalid",t);break;default:s=r}Gc(n,s),l=s;for(i in l)if(l.hasOwnProperty(i)){var u=l[i];i==="style"?vv(t,u):i==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&gv(t,u)):i==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&io(t,u):typeof u=="number"&&io(t,""+u):i!=="suppressContentEditableWarning"&&i!=="suppressHydrationWarning"&&i!=="autoFocus"&&(so.hasOwnProperty(i)?u!=null&&i==="onScroll"&&fe("scroll",t):u!=null&&mh(t,i,u,o))}switch(n){case"input":va(t),mm(t,r,!1);break;case"textarea":va(t),ym(t);break;case"option":r.value!=null&&t.setAttribute("value",""+cr(r.value));break;case"select":t.multiple=!!r.multiple,i=r.value,i!=null?Es(t,!!r.multiple,i,!1):r.defaultValue!=null&&Es(t,!!r.multiple,r.defaultValue,!0);break;default:typeof s.onClick=="function"&&(t.onclick=fl)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Ye(e),null;case 6:if(t&&e.stateNode!=null)z0(t,e,t.memoizedProps,r);else{if(typeof r!="string"&&e.stateNode===null)throw Error(U(166));if(n=Nr(yo.current),Nr(Yt.current),Ca(e)){if(r=e.stateNode,n=e.memoizedProps,r[Kt]=e,(i=r.nodeValue!==n)&&(t=_t,t!==null))switch(t.tag){case 3:ka(r.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&ka(r.nodeValue,n,(t.mode&1)!==0)}i&&(e.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Kt]=e,e.stateNode=r}return Ye(e),null;case 13:if(me(ve),r=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(ge&&vt!==null&&e.mode&1&&!(e.flags&128))i0(),Ds(),e.flags|=98560,i=!1;else if(i=Ca(e),r!==null&&r.dehydrated!==null){if(t===null){if(!i)throw Error(U(318));if(i=e.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(U(317));i[Kt]=e}else Ds(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Ye(e),i=!1}else Vt!==null&&(Rd(Vt),Vt=null),i=!0;if(!i)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(r=r!==null,r!==(t!==null&&t.memoizedState!==null)&&r&&(e.child.flags|=8192,e.mode&1&&(t===null||ve.current&1?Pe===0&&(Pe=3):Xh())),e.updateQueue!==null&&(e.flags|=4),Ye(e),null);case 4:return Vs(),xd(t,e),t===null&&fo(e.stateNode.containerInfo),Ye(e),null;case 10:return Dh(e.type._context),Ye(e),null;case 17:return pt(e.type)&&pl(),Ye(e),null;case 19:if(me(ve),i=e.memoizedState,i===null)return Ye(e),null;if(r=(e.flags&128)!==0,o=i.rendering,o===null)if(r)Ri(i,!1);else{if(Pe!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=xl(t),o!==null){for(e.flags|=128,Ri(i,!1),r=o.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),e.subtreeFlags=0,r=n,n=e.child;n!==null;)i=n,t=r,i.flags&=14680066,o=i.alternate,o===null?(i.childLanes=0,i.lanes=t,i.child=null,i.subtreeFlags=0,i.memoizedProps=null,i.memoizedState=null,i.updateQueue=null,i.dependencies=null,i.stateNode=null):(i.childLanes=o.childLanes,i.lanes=o.lanes,i.child=o.child,i.subtreeFlags=0,i.deletions=null,i.memoizedProps=o.memoizedProps,i.memoizedState=o.memoizedState,i.updateQueue=o.updateQueue,i.type=o.type,t=o.dependencies,i.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return de(ve,ve.current&1|2),e.child}t=t.sibling}i.tail!==null&&ke()>Ms&&(e.flags|=128,r=!0,Ri(i,!1),e.lanes=4194304)}else{if(!r)if(t=xl(o),t!==null){if(e.flags|=128,r=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Ri(i,!0),i.tail===null&&i.tailMode==="hidden"&&!o.alternate&&!ge)return Ye(e),null}else 2*ke()-i.renderingStartTime>Ms&&n!==1073741824&&(e.flags|=128,r=!0,Ri(i,!1),e.lanes=4194304);i.isBackwards?(o.sibling=e.child,e.child=o):(n=i.last,n!==null?n.sibling=o:e.child=o,i.last=o)}return i.tail!==null?(e=i.tail,i.rendering=e,i.tail=e.sibling,i.renderingStartTime=ke(),e.sibling=null,n=ve.current,de(ve,r?n&1|2:n&1),e):(Ye(e),null);case 22:case 23:return Yh(),r=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==r&&(e.flags|=8192),r&&e.mode&1?yt&1073741824&&(Ye(e),e.subtreeFlags&6&&(e.flags|=8192)):Ye(e),null;case 24:return null;case 25:return null}throw Error(U(156,e.tag))}function ST(t,e){switch(bh(e),e.tag){case 1:return pt(e.type)&&pl(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Vs(),me(ft),me(nt),Fh(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Mh(e),null;case 13:if(me(ve),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(U(340));Ds()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return me(ve),null;case 4:return Vs(),null;case 10:return Dh(e.type._context),null;case 22:case 23:return Yh(),null;case 24:return null;default:return null}}var ba=!1,Ze=!1,kT=typeof WeakSet=="function"?WeakSet:Set,$=null;function _s(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Te(t,e,r)}else n.current=null}function Ed(t,e,n){try{n()}catch(r){Te(t,e,r)}}var og=!1;function CT(t,e){if(id=cl,t=Hv(),Ah(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var s=r.anchorOffset,i=r.focusNode;r=r.focusOffset;try{n.nodeType,i.nodeType}catch{n=null;break e}var o=0,l=-1,u=-1,h=0,p=0,m=t,y=null;t:for(;;){for(var k;m!==n||s!==0&&m.nodeType!==3||(l=o+s),m!==i||r!==0&&m.nodeType!==3||(u=o+r),m.nodeType===3&&(o+=m.nodeValue.length),(k=m.firstChild)!==null;)y=m,m=k;for(;;){if(m===t)break t;if(y===n&&++h===s&&(l=o),y===i&&++p===r&&(u=o),(k=m.nextSibling)!==null)break;m=y,y=m.parentNode}m=k}n=l===-1||u===-1?null:{start:l,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(od={focusedElem:t,selectionRange:n},cl=!1,$=e;$!==null;)if(e=$,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,$=t;else for(;$!==null;){e=$;try{var T=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(T!==null){var R=T.memoizedProps,j=T.memoizedState,S=e.stateNode,v=S.getSnapshotBeforeUpdate(e.elementType===e.type?R:Dt(e.type,R),j);S.__reactInternalSnapshotBeforeUpdate=v}break;case 3:var w=e.stateNode.containerInfo;w.nodeType===1?w.textContent="":w.nodeType===9&&w.documentElement&&w.removeChild(w.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(U(163))}}catch(P){Te(e,e.return,P)}if(t=e.sibling,t!==null){t.return=e.return,$=t;break}$=e.return}return T=og,og=!1,T}function Yi(t,e,n){var r=e.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var s=r=r.next;do{if((s.tag&t)===t){var i=s.destroy;s.destroy=void 0,i!==void 0&&Ed(e,n,i)}s=s.next}while(s!==r)}}function iu(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var r=n.create;n.destroy=r()}n=n.next}while(n!==e)}}function Td(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function B0(t){var e=t.alternate;e!==null&&(t.alternate=null,B0(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Kt],delete e[mo],delete e[ud],delete e[uT],delete e[cT])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function $0(t){return t.tag===5||t.tag===3||t.tag===4}function ag(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||$0(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Id(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=fl));else if(r!==4&&(t=t.child,t!==null))for(Id(t,e,n),t=t.sibling;t!==null;)Id(t,e,n),t=t.sibling}function Sd(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(r!==4&&(t=t.child,t!==null))for(Sd(t,e,n),t=t.sibling;t!==null;)Sd(t,e,n),t=t.sibling}var Me=null,Ot=!1;function On(t,e,n){for(n=n.child;n!==null;)q0(t,e,n),n=n.sibling}function q0(t,e,n){if(Qt&&typeof Qt.onCommitFiberUnmount=="function")try{Qt.onCommitFiberUnmount(Xl,n)}catch{}switch(n.tag){case 5:Ze||_s(n,e);case 6:var r=Me,s=Ot;Me=null,On(t,e,n),Me=r,Ot=s,Me!==null&&(Ot?(t=Me,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Me.removeChild(n.stateNode));break;case 18:Me!==null&&(Ot?(t=Me,n=n.stateNode,t.nodeType===8?pc(t.parentNode,n):t.nodeType===1&&pc(t,n),uo(t)):pc(Me,n.stateNode));break;case 4:r=Me,s=Ot,Me=n.stateNode.containerInfo,Ot=!0,On(t,e,n),Me=r,Ot=s;break;case 0:case 11:case 14:case 15:if(!Ze&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){s=r=r.next;do{var i=s,o=i.destroy;i=i.tag,o!==void 0&&(i&2||i&4)&&Ed(n,e,o),s=s.next}while(s!==r)}On(t,e,n);break;case 1:if(!Ze&&(_s(n,e),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(l){Te(n,e,l)}On(t,e,n);break;case 21:On(t,e,n);break;case 22:n.mode&1?(Ze=(r=Ze)||n.memoizedState!==null,On(t,e,n),Ze=r):On(t,e,n);break;default:On(t,e,n)}}function lg(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new kT),e.forEach(function(r){var s=VT.bind(null,t,r);n.has(r)||(n.add(r),r.then(s,s))})}}function Pt(t,e){var n=e.deletions;if(n!==null)for(var r=0;r<n.length;r++){var s=n[r];try{var i=t,o=e,l=o;e:for(;l!==null;){switch(l.tag){case 5:Me=l.stateNode,Ot=!1;break e;case 3:Me=l.stateNode.containerInfo,Ot=!0;break e;case 4:Me=l.stateNode.containerInfo,Ot=!0;break e}l=l.return}if(Me===null)throw Error(U(160));q0(i,o,s),Me=null,Ot=!1;var u=s.alternate;u!==null&&(u.return=null),s.return=null}catch(h){Te(s,e,h)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)W0(e,t),e=e.sibling}function W0(t,e){var n=t.alternate,r=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Pt(e,t),Wt(t),r&4){try{Yi(3,t,t.return),iu(3,t)}catch(R){Te(t,t.return,R)}try{Yi(5,t,t.return)}catch(R){Te(t,t.return,R)}}break;case 1:Pt(e,t),Wt(t),r&512&&n!==null&&_s(n,n.return);break;case 5:if(Pt(e,t),Wt(t),r&512&&n!==null&&_s(n,n.return),t.flags&32){var s=t.stateNode;try{io(s,"")}catch(R){Te(t,t.return,R)}}if(r&4&&(s=t.stateNode,s!=null)){var i=t.memoizedProps,o=n!==null?n.memoizedProps:i,l=t.type,u=t.updateQueue;if(t.updateQueue=null,u!==null)try{l==="input"&&i.type==="radio"&&i.name!=null&&fv(s,i),Qc(l,o);var h=Qc(l,i);for(o=0;o<u.length;o+=2){var p=u[o],m=u[o+1];p==="style"?vv(s,m):p==="dangerouslySetInnerHTML"?gv(s,m):p==="children"?io(s,m):mh(s,p,m,h)}switch(l){case"input":qc(s,i);break;case"textarea":pv(s,i);break;case"select":var y=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!i.multiple;var k=i.value;k!=null?Es(s,!!i.multiple,k,!1):y!==!!i.multiple&&(i.defaultValue!=null?Es(s,!!i.multiple,i.defaultValue,!0):Es(s,!!i.multiple,i.multiple?[]:"",!1))}s[mo]=i}catch(R){Te(t,t.return,R)}}break;case 6:if(Pt(e,t),Wt(t),r&4){if(t.stateNode===null)throw Error(U(162));s=t.stateNode,i=t.memoizedProps;try{s.nodeValue=i}catch(R){Te(t,t.return,R)}}break;case 3:if(Pt(e,t),Wt(t),r&4&&n!==null&&n.memoizedState.isDehydrated)try{uo(e.containerInfo)}catch(R){Te(t,t.return,R)}break;case 4:Pt(e,t),Wt(t);break;case 13:Pt(e,t),Wt(t),s=t.child,s.flags&8192&&(i=s.memoizedState!==null,s.stateNode.isHidden=i,!i||s.alternate!==null&&s.alternate.memoizedState!==null||(Gh=ke())),r&4&&lg(t);break;case 22:if(p=n!==null&&n.memoizedState!==null,t.mode&1?(Ze=(h=Ze)||p,Pt(e,t),Ze=h):Pt(e,t),Wt(t),r&8192){if(h=t.memoizedState!==null,(t.stateNode.isHidden=h)&&!p&&t.mode&1)for($=t,p=t.child;p!==null;){for(m=$=p;$!==null;){switch(y=$,k=y.child,y.tag){case 0:case 11:case 14:case 15:Yi(4,y,y.return);break;case 1:_s(y,y.return);var T=y.stateNode;if(typeof T.componentWillUnmount=="function"){r=y,n=y.return;try{e=r,T.props=e.memoizedProps,T.state=e.memoizedState,T.componentWillUnmount()}catch(R){Te(r,n,R)}}break;case 5:_s(y,y.return);break;case 22:if(y.memoizedState!==null){cg(m);continue}}k!==null?(k.return=y,$=k):cg(m)}p=p.sibling}e:for(p=null,m=t;;){if(m.tag===5){if(p===null){p=m;try{s=m.stateNode,h?(i=s.style,typeof i.setProperty=="function"?i.setProperty("display","none","important"):i.display="none"):(l=m.stateNode,u=m.memoizedProps.style,o=u!=null&&u.hasOwnProperty("display")?u.display:null,l.style.display=yv("display",o))}catch(R){Te(t,t.return,R)}}}else if(m.tag===6){if(p===null)try{m.stateNode.nodeValue=h?"":m.memoizedProps}catch(R){Te(t,t.return,R)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===t)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===t)break e;for(;m.sibling===null;){if(m.return===null||m.return===t)break e;p===m&&(p=null),m=m.return}p===m&&(p=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:Pt(e,t),Wt(t),r&4&&lg(t);break;case 21:break;default:Pt(e,t),Wt(t)}}function Wt(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if($0(n)){var r=n;break e}n=n.return}throw Error(U(160))}switch(r.tag){case 5:var s=r.stateNode;r.flags&32&&(io(s,""),r.flags&=-33);var i=ag(t);Sd(t,i,s);break;case 3:case 4:var o=r.stateNode.containerInfo,l=ag(t);Id(t,l,o);break;default:throw Error(U(161))}}catch(u){Te(t,t.return,u)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function AT(t,e,n){$=t,H0(t)}function H0(t,e,n){for(var r=(t.mode&1)!==0;$!==null;){var s=$,i=s.child;if(s.tag===22&&r){var o=s.memoizedState!==null||ba;if(!o){var l=s.alternate,u=l!==null&&l.memoizedState!==null||Ze;l=ba;var h=Ze;if(ba=o,(Ze=u)&&!h)for($=s;$!==null;)o=$,u=o.child,o.tag===22&&o.memoizedState!==null?dg(s):u!==null?(u.return=o,$=u):dg(s);for(;i!==null;)$=i,H0(i),i=i.sibling;$=s,ba=l,Ze=h}ug(t)}else s.subtreeFlags&8772&&i!==null?(i.return=s,$=i):ug(t)}}function ug(t){for(;$!==null;){var e=$;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Ze||iu(5,e);break;case 1:var r=e.stateNode;if(e.flags&4&&!Ze)if(n===null)r.componentDidMount();else{var s=e.elementType===e.type?n.memoizedProps:Dt(e.type,n.memoizedProps);r.componentDidUpdate(s,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var i=e.updateQueue;i!==null&&Km(e,i,r);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}Km(e,o,n)}break;case 5:var l=e.stateNode;if(n===null&&e.flags&4){n=l;var u=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var h=e.alternate;if(h!==null){var p=h.memoizedState;if(p!==null){var m=p.dehydrated;m!==null&&uo(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(U(163))}Ze||e.flags&512&&Td(e)}catch(y){Te(e,e.return,y)}}if(e===t){$=null;break}if(n=e.sibling,n!==null){n.return=e.return,$=n;break}$=e.return}}function cg(t){for(;$!==null;){var e=$;if(e===t){$=null;break}var n=e.sibling;if(n!==null){n.return=e.return,$=n;break}$=e.return}}function dg(t){for(;$!==null;){var e=$;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{iu(4,e)}catch(u){Te(e,n,u)}break;case 1:var r=e.stateNode;if(typeof r.componentDidMount=="function"){var s=e.return;try{r.componentDidMount()}catch(u){Te(e,s,u)}}var i=e.return;try{Td(e)}catch(u){Te(e,i,u)}break;case 5:var o=e.return;try{Td(e)}catch(u){Te(e,o,u)}}}catch(u){Te(e,e.return,u)}if(e===t){$=null;break}var l=e.sibling;if(l!==null){l.return=e.return,$=l;break}$=e.return}}var RT=Math.ceil,Il=An.ReactCurrentDispatcher,Hh=An.ReactCurrentOwner,At=An.ReactCurrentBatchConfig,se=0,Ve=null,Re=null,ze=0,yt=0,ws=gr(0),Pe=0,xo=null,Fr=0,ou=0,Kh=0,Xi=null,dt=null,Gh=0,Ms=1/0,dn=null,Sl=!1,kd=null,er=null,Na=!1,Hn=null,kl=0,Ji=0,Cd=null,Ka=-1,Ga=0;function at(){return se&6?ke():Ka!==-1?Ka:Ka=ke()}function tr(t){return t.mode&1?se&2&&ze!==0?ze&-ze:hT.transition!==null?(Ga===0&&(Ga=bv()),Ga):(t=ae,t!==0||(t=window.event,t=t===void 0?16:Lv(t.type)),t):1}function Ft(t,e,n,r){if(50<Ji)throw Ji=0,Cd=null,Error(U(185));Do(t,n,r),(!(se&2)||t!==Ve)&&(t===Ve&&(!(se&2)&&(ou|=n),Pe===4&&Un(t,ze)),mt(t,r),n===1&&se===0&&!(e.mode&1)&&(Ms=ke()+500,nu&&yr()))}function mt(t,e){var n=t.callbackNode;h1(t,e);var r=ul(t,t===Ve?ze:0);if(r===0)n!==null&&wm(n),t.callbackNode=null,t.callbackPriority=0;else if(e=r&-r,t.callbackPriority!==e){if(n!=null&&wm(n),e===1)t.tag===0?dT(hg.bind(null,t)):n0(hg.bind(null,t)),aT(function(){!(se&6)&&yr()}),n=null;else{switch(Nv(r)){case 1:n=wh;break;case 4:n=Av;break;case 16:n=ll;break;case 536870912:n=Rv;break;default:n=ll}n=e_(n,K0.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function K0(t,e){if(Ka=-1,Ga=0,se&6)throw Error(U(327));var n=t.callbackNode;if(Cs()&&t.callbackNode!==n)return null;var r=ul(t,t===Ve?ze:0);if(r===0)return null;if(r&30||r&t.expiredLanes||e)e=Cl(t,r);else{e=r;var s=se;se|=2;var i=Q0();(Ve!==t||ze!==e)&&(dn=null,Ms=ke()+500,jr(t,e));do try{PT();break}catch(l){G0(t,l)}while(!0);jh(),Il.current=i,se=s,Re!==null?e=0:(Ve=null,ze=0,e=Pe)}if(e!==0){if(e===2&&(s=ed(t),s!==0&&(r=s,e=Ad(t,s))),e===1)throw n=xo,jr(t,0),Un(t,r),mt(t,ke()),n;if(e===6)Un(t,r);else{if(s=t.current.alternate,!(r&30)&&!bT(s)&&(e=Cl(t,r),e===2&&(i=ed(t),i!==0&&(r=i,e=Ad(t,i))),e===1))throw n=xo,jr(t,0),Un(t,r),mt(t,ke()),n;switch(t.finishedWork=s,t.finishedLanes=r,e){case 0:case 1:throw Error(U(345));case 2:Cr(t,dt,dn);break;case 3:if(Un(t,r),(r&130023424)===r&&(e=Gh+500-ke(),10<e)){if(ul(t,0)!==0)break;if(s=t.suspendedLanes,(s&r)!==r){at(),t.pingedLanes|=t.suspendedLanes&s;break}t.timeoutHandle=ld(Cr.bind(null,t,dt,dn),e);break}Cr(t,dt,dn);break;case 4:if(Un(t,r),(r&4194240)===r)break;for(e=t.eventTimes,s=-1;0<r;){var o=31-Mt(r);i=1<<o,o=e[o],o>s&&(s=o),r&=~i}if(r=s,r=ke()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*RT(r/1960))-r,10<r){t.timeoutHandle=ld(Cr.bind(null,t,dt,dn),r);break}Cr(t,dt,dn);break;case 5:Cr(t,dt,dn);break;default:throw Error(U(329))}}}return mt(t,ke()),t.callbackNode===n?K0.bind(null,t):null}function Ad(t,e){var n=Xi;return t.current.memoizedState.isDehydrated&&(jr(t,e).flags|=256),t=Cl(t,e),t!==2&&(e=dt,dt=n,e!==null&&Rd(e)),t}function Rd(t){dt===null?dt=t:dt.push.apply(dt,t)}function bT(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var s=n[r],i=s.getSnapshot;s=s.value;try{if(!Bt(i(),s))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Un(t,e){for(e&=~Kh,e&=~ou,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Mt(e),r=1<<n;t[n]=-1,e&=~r}}function hg(t){if(se&6)throw Error(U(327));Cs();var e=ul(t,0);if(!(e&1))return mt(t,ke()),null;var n=Cl(t,e);if(t.tag!==0&&n===2){var r=ed(t);r!==0&&(e=r,n=Ad(t,r))}if(n===1)throw n=xo,jr(t,0),Un(t,e),mt(t,ke()),n;if(n===6)throw Error(U(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Cr(t,dt,dn),mt(t,ke()),null}function Qh(t,e){var n=se;se|=1;try{return t(e)}finally{se=n,se===0&&(Ms=ke()+500,nu&&yr())}}function Ur(t){Hn!==null&&Hn.tag===0&&!(se&6)&&Cs();var e=se;se|=1;var n=At.transition,r=ae;try{if(At.transition=null,ae=1,t)return t()}finally{ae=r,At.transition=n,se=e,!(se&6)&&yr()}}function Yh(){yt=ws.current,me(ws)}function jr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,oT(n)),Re!==null)for(n=Re.return;n!==null;){var r=n;switch(bh(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&pl();break;case 3:Vs(),me(ft),me(nt),Fh();break;case 5:Mh(r);break;case 4:Vs();break;case 13:me(ve);break;case 19:me(ve);break;case 10:Dh(r.type._context);break;case 22:case 23:Yh()}n=n.return}if(Ve=t,Re=t=nr(t.current,null),ze=yt=e,Pe=0,xo=null,Kh=ou=Fr=0,dt=Xi=null,br!==null){for(e=0;e<br.length;e++)if(n=br[e],r=n.interleaved,r!==null){n.interleaved=null;var s=r.next,i=n.pending;if(i!==null){var o=i.next;i.next=s,r.next=o}n.pending=r}br=null}return t}function G0(t,e){do{var n=Re;try{if(jh(),qa.current=Tl,El){for(var r=_e.memoizedState;r!==null;){var s=r.queue;s!==null&&(s.pending=null),r=r.next}El=!1}if(Mr=0,Oe=Ne=_e=null,Qi=!1,vo=0,Hh.current=null,n===null||n.return===null){Pe=1,xo=e,Re=null;break}e:{var i=t,o=n.return,l=n,u=e;if(e=ze,l.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var h=u,p=l,m=p.tag;if(!(p.mode&1)&&(m===0||m===11||m===15)){var y=p.alternate;y?(p.updateQueue=y.updateQueue,p.memoizedState=y.memoizedState,p.lanes=y.lanes):(p.updateQueue=null,p.memoizedState=null)}var k=Zm(o);if(k!==null){k.flags&=-257,eg(k,o,l,i,e),k.mode&1&&Jm(i,h,e),e=k,u=h;var T=e.updateQueue;if(T===null){var R=new Set;R.add(u),e.updateQueue=R}else T.add(u);break e}else{if(!(e&1)){Jm(i,h,e),Xh();break e}u=Error(U(426))}}else if(ge&&l.mode&1){var j=Zm(o);if(j!==null){!(j.flags&65536)&&(j.flags|=256),eg(j,o,l,i,e),Nh(Ls(u,l));break e}}i=u=Ls(u,l),Pe!==4&&(Pe=2),Xi===null?Xi=[i]:Xi.push(i),i=o;do{switch(i.tag){case 3:i.flags|=65536,e&=-e,i.lanes|=e;var S=N0(i,u,e);Hm(i,S);break e;case 1:l=u;var v=i.type,w=i.stateNode;if(!(i.flags&128)&&(typeof v.getDerivedStateFromError=="function"||w!==null&&typeof w.componentDidCatch=="function"&&(er===null||!er.has(w)))){i.flags|=65536,e&=-e,i.lanes|=e;var P=P0(i,l,e);Hm(i,P);break e}}i=i.return}while(i!==null)}X0(n)}catch(L){e=L,Re===n&&n!==null&&(Re=n=n.return);continue}break}while(!0)}function Q0(){var t=Il.current;return Il.current=Tl,t===null?Tl:t}function Xh(){(Pe===0||Pe===3||Pe===2)&&(Pe=4),Ve===null||!(Fr&268435455)&&!(ou&268435455)||Un(Ve,ze)}function Cl(t,e){var n=se;se|=2;var r=Q0();(Ve!==t||ze!==e)&&(dn=null,jr(t,e));do try{NT();break}catch(s){G0(t,s)}while(!0);if(jh(),se=n,Il.current=r,Re!==null)throw Error(U(261));return Ve=null,ze=0,Pe}function NT(){for(;Re!==null;)Y0(Re)}function PT(){for(;Re!==null&&!r1();)Y0(Re)}function Y0(t){var e=Z0(t.alternate,t,yt);t.memoizedProps=t.pendingProps,e===null?X0(t):Re=e,Hh.current=null}function X0(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=ST(n,e),n!==null){n.flags&=32767,Re=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Pe=6,Re=null;return}}else if(n=IT(n,e,yt),n!==null){Re=n;return}if(e=e.sibling,e!==null){Re=e;return}Re=e=t}while(e!==null);Pe===0&&(Pe=5)}function Cr(t,e,n){var r=ae,s=At.transition;try{At.transition=null,ae=1,jT(t,e,n,r)}finally{At.transition=s,ae=r}return null}function jT(t,e,n,r){do Cs();while(Hn!==null);if(se&6)throw Error(U(327));n=t.finishedWork;var s=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(U(177));t.callbackNode=null,t.callbackPriority=0;var i=n.lanes|n.childLanes;if(f1(t,i),t===Ve&&(Re=Ve=null,ze=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Na||(Na=!0,e_(ll,function(){return Cs(),null})),i=(n.flags&15990)!==0,n.subtreeFlags&15990||i){i=At.transition,At.transition=null;var o=ae;ae=1;var l=se;se|=4,Hh.current=null,CT(t,n),W0(n,t),Z1(od),cl=!!id,od=id=null,t.current=n,AT(n),s1(),se=l,ae=o,At.transition=i}else t.current=n;if(Na&&(Na=!1,Hn=t,kl=s),i=t.pendingLanes,i===0&&(er=null),a1(n.stateNode),mt(t,ke()),e!==null)for(r=t.onRecoverableError,n=0;n<e.length;n++)s=e[n],r(s.value,{componentStack:s.stack,digest:s.digest});if(Sl)throw Sl=!1,t=kd,kd=null,t;return kl&1&&t.tag!==0&&Cs(),i=t.pendingLanes,i&1?t===Cd?Ji++:(Ji=0,Cd=t):Ji=0,yr(),null}function Cs(){if(Hn!==null){var t=Nv(kl),e=At.transition,n=ae;try{if(At.transition=null,ae=16>t?16:t,Hn===null)var r=!1;else{if(t=Hn,Hn=null,kl=0,se&6)throw Error(U(331));var s=se;for(se|=4,$=t.current;$!==null;){var i=$,o=i.child;if($.flags&16){var l=i.deletions;if(l!==null){for(var u=0;u<l.length;u++){var h=l[u];for($=h;$!==null;){var p=$;switch(p.tag){case 0:case 11:case 15:Yi(8,p,i)}var m=p.child;if(m!==null)m.return=p,$=m;else for(;$!==null;){p=$;var y=p.sibling,k=p.return;if(B0(p),p===h){$=null;break}if(y!==null){y.return=k,$=y;break}$=k}}}var T=i.alternate;if(T!==null){var R=T.child;if(R!==null){T.child=null;do{var j=R.sibling;R.sibling=null,R=j}while(R!==null)}}$=i}}if(i.subtreeFlags&2064&&o!==null)o.return=i,$=o;else e:for(;$!==null;){if(i=$,i.flags&2048)switch(i.tag){case 0:case 11:case 15:Yi(9,i,i.return)}var S=i.sibling;if(S!==null){S.return=i.return,$=S;break e}$=i.return}}var v=t.current;for($=v;$!==null;){o=$;var w=o.child;if(o.subtreeFlags&2064&&w!==null)w.return=o,$=w;else e:for(o=v;$!==null;){if(l=$,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:iu(9,l)}}catch(L){Te(l,l.return,L)}if(l===o){$=null;break e}var P=l.sibling;if(P!==null){P.return=l.return,$=P;break e}$=l.return}}if(se=s,yr(),Qt&&typeof Qt.onPostCommitFiberRoot=="function")try{Qt.onPostCommitFiberRoot(Xl,t)}catch{}r=!0}return r}finally{ae=n,At.transition=e}}return!1}function fg(t,e,n){e=Ls(n,e),e=N0(t,e,1),t=Zn(t,e,1),e=at(),t!==null&&(Do(t,1,e),mt(t,e))}function Te(t,e,n){if(t.tag===3)fg(t,t,n);else for(;e!==null;){if(e.tag===3){fg(e,t,n);break}else if(e.tag===1){var r=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(er===null||!er.has(r))){t=Ls(n,t),t=P0(e,t,1),e=Zn(e,t,1),t=at(),e!==null&&(Do(e,1,t),mt(e,t));break}}e=e.return}}function DT(t,e,n){var r=t.pingCache;r!==null&&r.delete(e),e=at(),t.pingedLanes|=t.suspendedLanes&n,Ve===t&&(ze&n)===n&&(Pe===4||Pe===3&&(ze&130023424)===ze&&500>ke()-Gh?jr(t,0):Kh|=n),mt(t,e)}function J0(t,e){e===0&&(t.mode&1?(e=xa,xa<<=1,!(xa&130023424)&&(xa=4194304)):e=1);var n=at();t=En(t,e),t!==null&&(Do(t,e,n),mt(t,n))}function OT(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),J0(t,n)}function VT(t,e){var n=0;switch(t.tag){case 13:var r=t.stateNode,s=t.memoizedState;s!==null&&(n=s.retryLane);break;case 19:r=t.stateNode;break;default:throw Error(U(314))}r!==null&&r.delete(e),J0(t,n)}var Z0;Z0=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||ft.current)ht=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return ht=!1,TT(t,e,n);ht=!!(t.flags&131072)}else ht=!1,ge&&e.flags&1048576&&r0(e,yl,e.index);switch(e.lanes=0,e.tag){case 2:var r=e.type;Ha(t,e),t=e.pendingProps;var s=js(e,nt.current);ks(e,n),s=zh(null,e,r,t,s,n);var i=Bh();return e.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,pt(r)?(i=!0,ml(e)):i=!1,e.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,Vh(e),s.updater=su,e.stateNode=s,s._reactInternals=e,md(e,r,t,n),e=vd(null,e,r,!0,i,n)):(e.tag=0,ge&&i&&Rh(e),ot(null,e,s,n),e=e.child),e;case 16:r=e.elementType;e:{switch(Ha(t,e),t=e.pendingProps,s=r._init,r=s(r._payload),e.type=r,s=e.tag=MT(r),t=Dt(r,t),s){case 0:e=yd(null,e,r,t,n);break e;case 1:e=rg(null,e,r,t,n);break e;case 11:e=tg(null,e,r,t,n);break e;case 14:e=ng(null,e,r,Dt(r.type,t),n);break e}throw Error(U(306,r,""))}return e;case 0:return r=e.type,s=e.pendingProps,s=e.elementType===r?s:Dt(r,s),yd(t,e,r,s,n);case 1:return r=e.type,s=e.pendingProps,s=e.elementType===r?s:Dt(r,s),rg(t,e,r,s,n);case 3:e:{if(V0(e),t===null)throw Error(U(387));r=e.pendingProps,i=e.memoizedState,s=i.element,u0(t,e),wl(e,r,null,n);var o=e.memoizedState;if(r=o.element,i.isDehydrated)if(i={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=i,e.memoizedState=i,e.flags&256){s=Ls(Error(U(423)),e),e=sg(t,e,r,n,s);break e}else if(r!==s){s=Ls(Error(U(424)),e),e=sg(t,e,r,n,s);break e}else for(vt=Jn(e.stateNode.containerInfo.firstChild),_t=e,ge=!0,Vt=null,n=a0(e,null,r,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Ds(),r===s){e=Tn(t,e,n);break e}ot(t,e,r,n)}e=e.child}return e;case 5:return c0(e),t===null&&hd(e),r=e.type,s=e.pendingProps,i=t!==null?t.memoizedProps:null,o=s.children,ad(r,s)?o=null:i!==null&&ad(r,i)&&(e.flags|=32),O0(t,e),ot(t,e,o,n),e.child;case 6:return t===null&&hd(e),null;case 13:return L0(t,e,n);case 4:return Lh(e,e.stateNode.containerInfo),r=e.pendingProps,t===null?e.child=Os(e,null,r,n):ot(t,e,r,n),e.child;case 11:return r=e.type,s=e.pendingProps,s=e.elementType===r?s:Dt(r,s),tg(t,e,r,s,n);case 7:return ot(t,e,e.pendingProps,n),e.child;case 8:return ot(t,e,e.pendingProps.children,n),e.child;case 12:return ot(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(r=e.type._context,s=e.pendingProps,i=e.memoizedProps,o=s.value,de(vl,r._currentValue),r._currentValue=o,i!==null)if(Bt(i.value,o)){if(i.children===s.children&&!ft.current){e=Tn(t,e,n);break e}}else for(i=e.child,i!==null&&(i.return=e);i!==null;){var l=i.dependencies;if(l!==null){o=i.child;for(var u=l.firstContext;u!==null;){if(u.context===r){if(i.tag===1){u=vn(-1,n&-n),u.tag=2;var h=i.updateQueue;if(h!==null){h=h.shared;var p=h.pending;p===null?u.next=u:(u.next=p.next,p.next=u),h.pending=u}}i.lanes|=n,u=i.alternate,u!==null&&(u.lanes|=n),fd(i.return,n,e),l.lanes|=n;break}u=u.next}}else if(i.tag===10)o=i.type===e.type?null:i.child;else if(i.tag===18){if(o=i.return,o===null)throw Error(U(341));o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),fd(o,n,e),o=i.sibling}else o=i.child;if(o!==null)o.return=i;else for(o=i;o!==null;){if(o===e){o=null;break}if(i=o.sibling,i!==null){i.return=o.return,o=i;break}o=o.return}i=o}ot(t,e,s.children,n),e=e.child}return e;case 9:return s=e.type,r=e.pendingProps.children,ks(e,n),s=Rt(s),r=r(s),e.flags|=1,ot(t,e,r,n),e.child;case 14:return r=e.type,s=Dt(r,e.pendingProps),s=Dt(r.type,s),ng(t,e,r,s,n);case 15:return j0(t,e,e.type,e.pendingProps,n);case 17:return r=e.type,s=e.pendingProps,s=e.elementType===r?s:Dt(r,s),Ha(t,e),e.tag=1,pt(r)?(t=!0,ml(e)):t=!1,ks(e,n),b0(e,r,s),md(e,r,s,n),vd(null,e,r,!0,t,n);case 19:return M0(t,e,n);case 22:return D0(t,e,n)}throw Error(U(156,e.tag))};function e_(t,e){return Cv(t,e)}function LT(t,e,n,r){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ct(t,e,n,r){return new LT(t,e,n,r)}function Jh(t){return t=t.prototype,!(!t||!t.isReactComponent)}function MT(t){if(typeof t=="function")return Jh(t)?1:0;if(t!=null){if(t=t.$$typeof,t===yh)return 11;if(t===vh)return 14}return 2}function nr(t,e){var n=t.alternate;return n===null?(n=Ct(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Qa(t,e,n,r,s,i){var o=2;if(r=t,typeof t=="function")Jh(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case cs:return Dr(n.children,s,i,e);case gh:o=8,s|=8;break;case Fc:return t=Ct(12,n,e,s|2),t.elementType=Fc,t.lanes=i,t;case Uc:return t=Ct(13,n,e,s),t.elementType=Uc,t.lanes=i,t;case zc:return t=Ct(19,n,e,s),t.elementType=zc,t.lanes=i,t;case cv:return au(n,s,i,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case lv:o=10;break e;case uv:o=9;break e;case yh:o=11;break e;case vh:o=14;break e;case Ln:o=16,r=null;break e}throw Error(U(130,t==null?t:typeof t,""))}return e=Ct(o,n,e,s),e.elementType=t,e.type=r,e.lanes=i,e}function Dr(t,e,n,r){return t=Ct(7,t,r,e),t.lanes=n,t}function au(t,e,n,r){return t=Ct(22,t,r,e),t.elementType=cv,t.lanes=n,t.stateNode={isHidden:!1},t}function Ec(t,e,n){return t=Ct(6,t,null,e),t.lanes=n,t}function Tc(t,e,n){return e=Ct(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function FT(t,e,n,r,s){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=rc(0),this.expirationTimes=rc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=rc(0),this.identifierPrefix=r,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}function Zh(t,e,n,r,s,i,o,l,u){return t=new FT(t,e,n,l,u),e===1?(e=1,i===!0&&(e|=8)):e=0,i=Ct(3,null,null,e),t.current=i,i.stateNode=t,i.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Vh(i),t}function UT(t,e,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:us,key:r==null?null:""+r,children:t,containerInfo:e,implementation:n}}function t_(t){if(!t)return dr;t=t._reactInternals;e:{if(Qr(t)!==t||t.tag!==1)throw Error(U(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(pt(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(U(171))}if(t.tag===1){var n=t.type;if(pt(n))return t0(t,n,e)}return e}function n_(t,e,n,r,s,i,o,l,u){return t=Zh(n,r,!0,t,s,i,o,l,u),t.context=t_(null),n=t.current,r=at(),s=tr(n),i=vn(r,s),i.callback=e??null,Zn(n,i,s),t.current.lanes=s,Do(t,s,r),mt(t,r),t}function lu(t,e,n,r){var s=e.current,i=at(),o=tr(s);return n=t_(n),e.context===null?e.context=n:e.pendingContext=n,e=vn(i,o),e.payload={element:t},r=r===void 0?null:r,r!==null&&(e.callback=r),t=Zn(s,e,o),t!==null&&(Ft(t,s,o,i),$a(t,s,o)),o}function Al(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function pg(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function ef(t,e){pg(t,e),(t=t.alternate)&&pg(t,e)}function zT(){return null}var r_=typeof reportError=="function"?reportError:function(t){console.error(t)};function tf(t){this._internalRoot=t}uu.prototype.render=tf.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(U(409));lu(t,e,null,null)};uu.prototype.unmount=tf.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Ur(function(){lu(null,t,null,null)}),e[xn]=null}};function uu(t){this._internalRoot=t}uu.prototype.unstable_scheduleHydration=function(t){if(t){var e=Dv();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Fn.length&&e!==0&&e<Fn[n].priority;n++);Fn.splice(n,0,t),n===0&&Vv(t)}};function nf(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function cu(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function mg(){}function BT(t,e,n,r,s){if(s){if(typeof r=="function"){var i=r;r=function(){var h=Al(o);i.call(h)}}var o=n_(e,r,t,0,null,!1,!1,"",mg);return t._reactRootContainer=o,t[xn]=o.current,fo(t.nodeType===8?t.parentNode:t),Ur(),o}for(;s=t.lastChild;)t.removeChild(s);if(typeof r=="function"){var l=r;r=function(){var h=Al(u);l.call(h)}}var u=Zh(t,0,!1,null,null,!1,!1,"",mg);return t._reactRootContainer=u,t[xn]=u.current,fo(t.nodeType===8?t.parentNode:t),Ur(function(){lu(e,u,n,r)}),u}function du(t,e,n,r,s){var i=n._reactRootContainer;if(i){var o=i;if(typeof s=="function"){var l=s;s=function(){var u=Al(o);l.call(u)}}lu(e,o,t,s)}else o=BT(n,e,t,s,r);return Al(o)}Pv=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Vi(e.pendingLanes);n!==0&&(xh(e,n|1),mt(e,ke()),!(se&6)&&(Ms=ke()+500,yr()))}break;case 13:Ur(function(){var r=En(t,1);if(r!==null){var s=at();Ft(r,t,1,s)}}),ef(t,1)}};Eh=function(t){if(t.tag===13){var e=En(t,134217728);if(e!==null){var n=at();Ft(e,t,134217728,n)}ef(t,134217728)}};jv=function(t){if(t.tag===13){var e=tr(t),n=En(t,e);if(n!==null){var r=at();Ft(n,t,e,r)}ef(t,e)}};Dv=function(){return ae};Ov=function(t,e){var n=ae;try{return ae=t,e()}finally{ae=n}};Xc=function(t,e,n){switch(e){case"input":if(qc(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var r=n[e];if(r!==t&&r.form===t.form){var s=tu(r);if(!s)throw Error(U(90));hv(r),qc(r,s)}}}break;case"textarea":pv(t,n);break;case"select":e=n.value,e!=null&&Es(t,!!n.multiple,e,!1)}};xv=Qh;Ev=Ur;var $T={usingClientEntryPoint:!1,Events:[Vo,ps,tu,_v,wv,Qh]},bi={findFiberByHostInstance:Rr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},qT={bundleType:bi.bundleType,version:bi.version,rendererPackageName:bi.rendererPackageName,rendererConfig:bi.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:An.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Sv(t),t===null?null:t.stateNode},findFiberByHostInstance:bi.findFiberByHostInstance||zT,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Pa=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Pa.isDisabled&&Pa.supportsFiber)try{Xl=Pa.inject(qT),Qt=Pa}catch{}}xt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=$T;xt.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!nf(e))throw Error(U(200));return UT(t,e,null,n)};xt.createRoot=function(t,e){if(!nf(t))throw Error(U(299));var n=!1,r="",s=r_;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(r=e.identifierPrefix),e.onRecoverableError!==void 0&&(s=e.onRecoverableError)),e=Zh(t,1,!1,null,null,n,!1,r,s),t[xn]=e.current,fo(t.nodeType===8?t.parentNode:t),new tf(e)};xt.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(U(188)):(t=Object.keys(t).join(","),Error(U(268,t)));return t=Sv(e),t=t===null?null:t.stateNode,t};xt.flushSync=function(t){return Ur(t)};xt.hydrate=function(t,e,n){if(!cu(e))throw Error(U(200));return du(null,t,e,!0,n)};xt.hydrateRoot=function(t,e,n){if(!nf(t))throw Error(U(405));var r=n!=null&&n.hydratedSources||null,s=!1,i="",o=r_;if(n!=null&&(n.unstable_strictMode===!0&&(s=!0),n.identifierPrefix!==void 0&&(i=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=n_(e,null,t,1,n??null,s,!1,i,o),t[xn]=e.current,fo(t),r)for(t=0;t<r.length;t++)n=r[t],s=n._getVersion,s=s(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,s]:e.mutableSourceEagerHydrationData.push(n,s);return new uu(e)};xt.render=function(t,e,n){if(!cu(e))throw Error(U(200));return du(null,t,e,!1,n)};xt.unmountComponentAtNode=function(t){if(!cu(t))throw Error(U(40));return t._reactRootContainer?(Ur(function(){du(null,null,t,!1,function(){t._reactRootContainer=null,t[xn]=null})}),!0):!1};xt.unstable_batchedUpdates=Qh;xt.unstable_renderSubtreeIntoContainer=function(t,e,n,r){if(!cu(n))throw Error(U(200));if(t==null||t._reactInternals===void 0)throw Error(U(38));return du(t,e,n,!1,r)};xt.version="18.3.1-next-f1338f8080-20240426";function s_(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s_)}catch(t){console.error(t)}}s_(),sv.exports=xt;var WT=sv.exports,gg=WT;Lc.createRoot=gg.createRoot,Lc.hydrateRoot=gg.hydrateRoot;/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Eo(){return Eo=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},Eo.apply(this,arguments)}var Kn;(function(t){t.Pop="POP",t.Push="PUSH",t.Replace="REPLACE"})(Kn||(Kn={}));const yg="popstate";function HT(t){t===void 0&&(t={});function e(r,s){let{pathname:i,search:o,hash:l}=r.location;return bd("",{pathname:i,search:o,hash:l},s.state&&s.state.usr||null,s.state&&s.state.key||"default")}function n(r,s){return typeof s=="string"?s:Rl(s)}return GT(e,n,null,t)}function Ce(t,e){if(t===!1||t===null||typeof t>"u")throw new Error(e)}function rf(t,e){if(!t){typeof console<"u"&&console.warn(e);try{throw new Error(e)}catch{}}}function KT(){return Math.random().toString(36).substr(2,8)}function vg(t,e){return{usr:t.state,key:t.key,idx:e}}function bd(t,e,n,r){return n===void 0&&(n=null),Eo({pathname:typeof t=="string"?t:t.pathname,search:"",hash:""},typeof e=="string"?Js(e):e,{state:n,key:e&&e.key||r||KT()})}function Rl(t){let{pathname:e="/",search:n="",hash:r=""}=t;return n&&n!=="?"&&(e+=n.charAt(0)==="?"?n:"?"+n),r&&r!=="#"&&(e+=r.charAt(0)==="#"?r:"#"+r),e}function Js(t){let e={};if(t){let n=t.indexOf("#");n>=0&&(e.hash=t.substr(n),t=t.substr(0,n));let r=t.indexOf("?");r>=0&&(e.search=t.substr(r),t=t.substr(0,r)),t&&(e.pathname=t)}return e}function GT(t,e,n,r){r===void 0&&(r={});let{window:s=document.defaultView,v5Compat:i=!1}=r,o=s.history,l=Kn.Pop,u=null,h=p();h==null&&(h=0,o.replaceState(Eo({},o.state,{idx:h}),""));function p(){return(o.state||{idx:null}).idx}function m(){l=Kn.Pop;let j=p(),S=j==null?null:j-h;h=j,u&&u({action:l,location:R.location,delta:S})}function y(j,S){l=Kn.Push;let v=bd(R.location,j,S);h=p()+1;let w=vg(v,h),P=R.createHref(v);try{o.pushState(w,"",P)}catch(L){if(L instanceof DOMException&&L.name==="DataCloneError")throw L;s.location.assign(P)}i&&u&&u({action:l,location:R.location,delta:1})}function k(j,S){l=Kn.Replace;let v=bd(R.location,j,S);h=p();let w=vg(v,h),P=R.createHref(v);o.replaceState(w,"",P),i&&u&&u({action:l,location:R.location,delta:0})}function T(j){let S=s.location.origin!=="null"?s.location.origin:s.location.href,v=typeof j=="string"?j:Rl(j);return v=v.replace(/ $/,"%20"),Ce(S,"No window.location.(origin|href) available to create URL for href: "+v),new URL(v,S)}let R={get action(){return l},get location(){return t(s,o)},listen(j){if(u)throw new Error("A history only accepts one active listener");return s.addEventListener(yg,m),u=j,()=>{s.removeEventListener(yg,m),u=null}},createHref(j){return e(s,j)},createURL:T,encodeLocation(j){let S=T(j);return{pathname:S.pathname,search:S.search,hash:S.hash}},push:y,replace:k,go(j){return o.go(j)}};return R}var _g;(function(t){t.data="data",t.deferred="deferred",t.redirect="redirect",t.error="error"})(_g||(_g={}));function QT(t,e,n){return n===void 0&&(n="/"),YT(t,e,n)}function YT(t,e,n,r){let s=typeof e=="string"?Js(e):e,i=sf(s.pathname||"/",n);if(i==null)return null;let o=i_(t);XT(o);let l=null;for(let u=0;l==null&&u<o.length;++u){let h=uI(i);l=oI(o[u],h)}return l}function i_(t,e,n,r){e===void 0&&(e=[]),n===void 0&&(n=[]),r===void 0&&(r="");let s=(i,o,l)=>{let u={relativePath:l===void 0?i.path||"":l,caseSensitive:i.caseSensitive===!0,childrenIndex:o,route:i};u.relativePath.startsWith("/")&&(Ce(u.relativePath.startsWith(r),'Absolute route path "'+u.relativePath+'" nested under path '+('"'+r+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),u.relativePath=u.relativePath.slice(r.length));let h=rr([r,u.relativePath]),p=n.concat(u);i.children&&i.children.length>0&&(Ce(i.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+h+'".')),i_(i.children,e,p,h)),!(i.path==null&&!i.index)&&e.push({path:h,score:sI(h,i.index),routesMeta:p})};return t.forEach((i,o)=>{var l;if(i.path===""||!((l=i.path)!=null&&l.includes("?")))s(i,o);else for(let u of o_(i.path))s(i,o,u)}),e}function o_(t){let e=t.split("/");if(e.length===0)return[];let[n,...r]=e,s=n.endsWith("?"),i=n.replace(/\?$/,"");if(r.length===0)return s?[i,""]:[i];let o=o_(r.join("/")),l=[];return l.push(...o.map(u=>u===""?i:[i,u].join("/"))),s&&l.push(...o),l.map(u=>t.startsWith("/")&&u===""?"/":u)}function XT(t){t.sort((e,n)=>e.score!==n.score?n.score-e.score:iI(e.routesMeta.map(r=>r.childrenIndex),n.routesMeta.map(r=>r.childrenIndex)))}const JT=/^:[\w-]+$/,ZT=3,eI=2,tI=1,nI=10,rI=-2,wg=t=>t==="*";function sI(t,e){let n=t.split("/"),r=n.length;return n.some(wg)&&(r+=rI),e&&(r+=eI),n.filter(s=>!wg(s)).reduce((s,i)=>s+(JT.test(i)?ZT:i===""?tI:nI),r)}function iI(t,e){return t.length===e.length&&t.slice(0,-1).every((r,s)=>r===e[s])?t[t.length-1]-e[e.length-1]:0}function oI(t,e,n){let{routesMeta:r}=t,s={},i="/",o=[];for(let l=0;l<r.length;++l){let u=r[l],h=l===r.length-1,p=i==="/"?e:e.slice(i.length)||"/",m=aI({path:u.relativePath,caseSensitive:u.caseSensitive,end:h},p),y=u.route;if(!m)return null;Object.assign(s,m.params),o.push({params:s,pathname:rr([i,m.pathname]),pathnameBase:pI(rr([i,m.pathnameBase])),route:y}),m.pathnameBase!=="/"&&(i=rr([i,m.pathnameBase]))}return o}function aI(t,e){typeof t=="string"&&(t={path:t,caseSensitive:!1,end:!0});let[n,r]=lI(t.path,t.caseSensitive,t.end),s=e.match(n);if(!s)return null;let i=s[0],o=i.replace(/(.)\/+$/,"$1"),l=s.slice(1);return{params:r.reduce((h,p,m)=>{let{paramName:y,isOptional:k}=p;if(y==="*"){let R=l[m]||"";o=i.slice(0,i.length-R.length).replace(/(.)\/+$/,"$1")}const T=l[m];return k&&!T?h[y]=void 0:h[y]=(T||"").replace(/%2F/g,"/"),h},{}),pathname:i,pathnameBase:o,pattern:t}}function lI(t,e,n){e===void 0&&(e=!1),n===void 0&&(n=!0),rf(t==="*"||!t.endsWith("*")||t.endsWith("/*"),'Route path "'+t+'" will be treated as if it were '+('"'+t.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+t.replace(/\*$/,"/*")+'".'));let r=[],s="^"+t.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(o,l,u)=>(r.push({paramName:l,isOptional:u!=null}),u?"/?([^\\/]+)?":"/([^\\/]+)"));return t.endsWith("*")?(r.push({paramName:"*"}),s+=t==="*"||t==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?s+="\\/*$":t!==""&&t!=="/"&&(s+="(?:(?=\\/|$))"),[new RegExp(s,e?void 0:"i"),r]}function uI(t){try{return t.split("/").map(e=>decodeURIComponent(e).replace(/\//g,"%2F")).join("/")}catch(e){return rf(!1,'The URL path "'+t+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+e+").")),t}}function sf(t,e){if(e==="/")return t;if(!t.toLowerCase().startsWith(e.toLowerCase()))return null;let n=e.endsWith("/")?e.length-1:e.length,r=t.charAt(n);return r&&r!=="/"?null:t.slice(n)||"/"}const cI=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,dI=t=>cI.test(t);function hI(t,e){e===void 0&&(e="/");let{pathname:n,search:r="",hash:s=""}=typeof t=="string"?Js(t):t,i;if(n)if(dI(n))i=n;else{if(n.includes("//")){let o=n;n=n.replace(/\/\/+/g,"/"),rf(!1,"Pathnames cannot have embedded double slashes - normalizing "+(o+" -> "+n))}n.startsWith("/")?i=xg(n.substring(1),"/"):i=xg(n,e)}else i=e;return{pathname:i,search:mI(r),hash:gI(s)}}function xg(t,e){let n=e.replace(/\/+$/,"").split("/");return t.split("/").forEach(s=>{s===".."?n.length>1&&n.pop():s!=="."&&n.push(s)}),n.length>1?n.join("/"):"/"}function Ic(t,e,n,r){return"Cannot include a '"+t+"' character in a manually specified "+("`to."+e+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function fI(t){return t.filter((e,n)=>n===0||e.route.path&&e.route.path.length>0)}function of(t,e){let n=fI(t);return e?n.map((r,s)=>s===n.length-1?r.pathname:r.pathnameBase):n.map(r=>r.pathnameBase)}function af(t,e,n,r){r===void 0&&(r=!1);let s;typeof t=="string"?s=Js(t):(s=Eo({},t),Ce(!s.pathname||!s.pathname.includes("?"),Ic("?","pathname","search",s)),Ce(!s.pathname||!s.pathname.includes("#"),Ic("#","pathname","hash",s)),Ce(!s.search||!s.search.includes("#"),Ic("#","search","hash",s)));let i=t===""||s.pathname==="",o=i?"/":s.pathname,l;if(o==null)l=n;else{let m=e.length-1;if(!r&&o.startsWith("..")){let y=o.split("/");for(;y[0]==="..";)y.shift(),m-=1;s.pathname=y.join("/")}l=m>=0?e[m]:"/"}let u=hI(s,l),h=o&&o!=="/"&&o.endsWith("/"),p=(i||o===".")&&n.endsWith("/");return!u.pathname.endsWith("/")&&(h||p)&&(u.pathname+="/"),u}const rr=t=>t.join("/").replace(/\/\/+/g,"/"),pI=t=>t.replace(/\/+$/,"").replace(/^\/*/,"/"),mI=t=>!t||t==="?"?"":t.startsWith("?")?t:"?"+t,gI=t=>!t||t==="#"?"":t.startsWith("#")?t:"#"+t;function yI(t){return t!=null&&typeof t.status=="number"&&typeof t.statusText=="string"&&typeof t.internal=="boolean"&&"data"in t}const a_=["post","put","patch","delete"];new Set(a_);const vI=["get",...a_];new Set(vI);/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function To(){return To=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},To.apply(this,arguments)}const lf=O.createContext(null),_I=O.createContext(null),vr=O.createContext(null),hu=O.createContext(null),Rn=O.createContext({outlet:null,matches:[],isDataRoute:!1}),l_=O.createContext(null);function wI(t,e){let{relative:n}=e===void 0?{}:e;Zs()||Ce(!1);let{basename:r,navigator:s}=O.useContext(vr),{hash:i,pathname:o,search:l}=c_(t,{relative:n}),u=o;return r!=="/"&&(u=o==="/"?r:rr([r,o])),s.createHref({pathname:u,search:l,hash:i})}function Zs(){return O.useContext(hu)!=null}function _r(){return Zs()||Ce(!1),O.useContext(hu).location}function u_(t){O.useContext(vr).static||O.useLayoutEffect(t)}function Mo(){let{isDataRoute:t}=O.useContext(Rn);return t?OI():xI()}function xI(){Zs()||Ce(!1);let t=O.useContext(lf),{basename:e,future:n,navigator:r}=O.useContext(vr),{matches:s}=O.useContext(Rn),{pathname:i}=_r(),o=JSON.stringify(of(s,n.v7_relativeSplatPath)),l=O.useRef(!1);return u_(()=>{l.current=!0}),O.useCallback(function(h,p){if(p===void 0&&(p={}),!l.current)return;if(typeof h=="number"){r.go(h);return}let m=af(h,JSON.parse(o),i,p.relative==="path");t==null&&e!=="/"&&(m.pathname=m.pathname==="/"?e:rr([e,m.pathname])),(p.replace?r.replace:r.push)(m,p.state,p)},[e,r,o,i,t])}const EI=O.createContext(null);function TI(t){let e=O.useContext(Rn).outlet;return e&&O.createElement(EI.Provider,{value:t},e)}function c_(t,e){let{relative:n}=e===void 0?{}:e,{future:r}=O.useContext(vr),{matches:s}=O.useContext(Rn),{pathname:i}=_r(),o=JSON.stringify(of(s,r.v7_relativeSplatPath));return O.useMemo(()=>af(t,JSON.parse(o),i,n==="path"),[t,o,i,n])}function II(t,e){return SI(t,e)}function SI(t,e,n,r){Zs()||Ce(!1);let{navigator:s}=O.useContext(vr),{matches:i}=O.useContext(Rn),o=i[i.length-1],l=o?o.params:{};o&&o.pathname;let u=o?o.pathnameBase:"/";o&&o.route;let h=_r(),p;if(e){var m;let j=typeof e=="string"?Js(e):e;u==="/"||(m=j.pathname)!=null&&m.startsWith(u)||Ce(!1),p=j}else p=h;let y=p.pathname||"/",k=y;if(u!=="/"){let j=u.replace(/^\//,"").split("/");k="/"+y.replace(/^\//,"").split("/").slice(j.length).join("/")}let T=QT(t,{pathname:k}),R=bI(T&&T.map(j=>Object.assign({},j,{params:Object.assign({},l,j.params),pathname:rr([u,s.encodeLocation?s.encodeLocation(j.pathname).pathname:j.pathname]),pathnameBase:j.pathnameBase==="/"?u:rr([u,s.encodeLocation?s.encodeLocation(j.pathnameBase).pathname:j.pathnameBase])})),i,n,r);return e&&R?O.createElement(hu.Provider,{value:{location:To({pathname:"/",search:"",hash:"",state:null,key:"default"},p),navigationType:Kn.Pop}},R):R}function kI(){let t=DI(),e=yI(t)?t.status+" "+t.statusText:t instanceof Error?t.message:JSON.stringify(t),n=t instanceof Error?t.stack:null,s={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return O.createElement(O.Fragment,null,O.createElement("h2",null,"Unexpected Application Error!"),O.createElement("h3",{style:{fontStyle:"italic"}},e),n?O.createElement("pre",{style:s},n):null,null)}const CI=O.createElement(kI,null);class AI extends O.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,n){return n.location!==e.location||n.revalidation!=="idle"&&e.revalidation==="idle"?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error!==void 0?e.error:n.error,location:n.location,revalidation:e.revalidation||n.revalidation}}componentDidCatch(e,n){console.error("React Router caught the following error during render",e,n)}render(){return this.state.error!==void 0?O.createElement(Rn.Provider,{value:this.props.routeContext},O.createElement(l_.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function RI(t){let{routeContext:e,match:n,children:r}=t,s=O.useContext(lf);return s&&s.static&&s.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(s.staticContext._deepestRenderedBoundaryId=n.route.id),O.createElement(Rn.Provider,{value:e},r)}function bI(t,e,n,r){var s;if(e===void 0&&(e=[]),n===void 0&&(n=null),r===void 0&&(r=null),t==null){var i;if(!n)return null;if(n.errors)t=n.matches;else if((i=r)!=null&&i.v7_partialHydration&&e.length===0&&!n.initialized&&n.matches.length>0)t=n.matches;else return null}let o=t,l=(s=n)==null?void 0:s.errors;if(l!=null){let p=o.findIndex(m=>m.route.id&&(l==null?void 0:l[m.route.id])!==void 0);p>=0||Ce(!1),o=o.slice(0,Math.min(o.length,p+1))}let u=!1,h=-1;if(n&&r&&r.v7_partialHydration)for(let p=0;p<o.length;p++){let m=o[p];if((m.route.HydrateFallback||m.route.hydrateFallbackElement)&&(h=p),m.route.id){let{loaderData:y,errors:k}=n,T=m.route.loader&&y[m.route.id]===void 0&&(!k||k[m.route.id]===void 0);if(m.route.lazy||T){u=!0,h>=0?o=o.slice(0,h+1):o=[o[0]];break}}}return o.reduceRight((p,m,y)=>{let k,T=!1,R=null,j=null;n&&(k=l&&m.route.id?l[m.route.id]:void 0,R=m.route.errorElement||CI,u&&(h<0&&y===0?(VI("route-fallback"),T=!0,j=null):h===y&&(T=!0,j=m.route.hydrateFallbackElement||null)));let S=e.concat(o.slice(0,y+1)),v=()=>{let w;return k?w=R:T?w=j:m.route.Component?w=O.createElement(m.route.Component,null):m.route.element?w=m.route.element:w=p,O.createElement(RI,{match:m,routeContext:{outlet:p,matches:S,isDataRoute:n!=null},children:w})};return n&&(m.route.ErrorBoundary||m.route.errorElement||y===0)?O.createElement(AI,{location:n.location,revalidation:n.revalidation,component:R,error:k,children:v(),routeContext:{outlet:null,matches:S,isDataRoute:!0}}):v()},null)}var d_=function(t){return t.UseBlocker="useBlocker",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t}(d_||{}),h_=function(t){return t.UseBlocker="useBlocker",t.UseLoaderData="useLoaderData",t.UseActionData="useActionData",t.UseRouteError="useRouteError",t.UseNavigation="useNavigation",t.UseRouteLoaderData="useRouteLoaderData",t.UseMatches="useMatches",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t.UseRouteId="useRouteId",t}(h_||{});function NI(t){let e=O.useContext(lf);return e||Ce(!1),e}function PI(t){let e=O.useContext(_I);return e||Ce(!1),e}function jI(t){let e=O.useContext(Rn);return e||Ce(!1),e}function f_(t){let e=jI(),n=e.matches[e.matches.length-1];return n.route.id||Ce(!1),n.route.id}function DI(){var t;let e=O.useContext(l_),n=PI(),r=f_();return e!==void 0?e:(t=n.errors)==null?void 0:t[r]}function OI(){let{router:t}=NI(d_.UseNavigateStable),e=f_(h_.UseNavigateStable),n=O.useRef(!1);return u_(()=>{n.current=!0}),O.useCallback(function(s,i){i===void 0&&(i={}),n.current&&(typeof s=="number"?t.navigate(s):t.navigate(s,To({fromRouteId:e},i)))},[t,e])}const Eg={};function VI(t,e,n){Eg[t]||(Eg[t]=!0)}function LI(t,e){t==null||t.v7_startTransition,t==null||t.v7_relativeSplatPath}function p_(t){let{to:e,replace:n,state:r,relative:s}=t;Zs()||Ce(!1);let{future:i,static:o}=O.useContext(vr),{matches:l}=O.useContext(Rn),{pathname:u}=_r(),h=Mo(),p=af(e,of(l,i.v7_relativeSplatPath),u,s==="path"),m=JSON.stringify(p);return O.useEffect(()=>h(JSON.parse(m),{replace:n,state:r,relative:s}),[h,m,s,n,r]),null}function MI(t){return TI(t.context)}function jt(t){Ce(!1)}function FI(t){let{basename:e="/",children:n=null,location:r,navigationType:s=Kn.Pop,navigator:i,static:o=!1,future:l}=t;Zs()&&Ce(!1);let u=e.replace(/^\/*/,"/"),h=O.useMemo(()=>({basename:u,navigator:i,static:o,future:To({v7_relativeSplatPath:!1},l)}),[u,l,i,o]);typeof r=="string"&&(r=Js(r));let{pathname:p="/",search:m="",hash:y="",state:k=null,key:T="default"}=r,R=O.useMemo(()=>{let j=sf(p,u);return j==null?null:{location:{pathname:j,search:m,hash:y,state:k,key:T},navigationType:s}},[u,p,m,y,k,T,s]);return R==null?null:O.createElement(vr.Provider,{value:h},O.createElement(hu.Provider,{children:n,value:R}))}function UI(t){let{children:e,location:n}=t;return II(Nd(e),n)}new Promise(()=>{});function Nd(t,e){e===void 0&&(e=[]);let n=[];return O.Children.forEach(t,(r,s)=>{if(!O.isValidElement(r))return;let i=[...e,s];if(r.type===O.Fragment){n.push.apply(n,Nd(r.props.children,i));return}r.type!==jt&&Ce(!1),!r.props.index||!r.props.children||Ce(!1);let o={id:r.props.id||i.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,loader:r.props.loader,action:r.props.action,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(o.children=Nd(r.props.children,i)),n.push(o)}),n}/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Pd(){return Pd=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},Pd.apply(this,arguments)}function zI(t,e){if(t==null)return{};var n={},r=Object.keys(t),s,i;for(i=0;i<r.length;i++)s=r[i],!(e.indexOf(s)>=0)&&(n[s]=t[s]);return n}function BI(t){return!!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)}function $I(t,e){return t.button===0&&(!e||e==="_self")&&!BI(t)}const qI=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],WI="6";try{window.__reactRouterVersion=WI}catch{}const HI="startTransition",Tg=DE[HI];function KI(t){let{basename:e,children:n,future:r,window:s}=t,i=O.useRef();i.current==null&&(i.current=HT({window:s,v5Compat:!0}));let o=i.current,[l,u]=O.useState({action:o.action,location:o.location}),{v7_startTransition:h}=r||{},p=O.useCallback(m=>{h&&Tg?Tg(()=>u(m)):u(m)},[u,h]);return O.useLayoutEffect(()=>o.listen(p),[o,p]),O.useEffect(()=>LI(r),[r]),O.createElement(FI,{basename:e,children:n,location:l.location,navigationType:l.action,navigator:o,future:r})}const GI=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",QI=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,is=O.forwardRef(function(e,n){let{onClick:r,relative:s,reloadDocument:i,replace:o,state:l,target:u,to:h,preventScrollReset:p,viewTransition:m}=e,y=zI(e,qI),{basename:k}=O.useContext(vr),T,R=!1;if(typeof h=="string"&&QI.test(h)&&(T=h,GI))try{let w=new URL(window.location.href),P=h.startsWith("//")?new URL(w.protocol+h):new URL(h),L=sf(P.pathname,k);P.origin===w.origin&&L!=null?h=L+P.search+P.hash:R=!0}catch{}let j=wI(h,{relative:s}),S=YI(h,{replace:o,state:l,target:u,preventScrollReset:p,relative:s,viewTransition:m});function v(w){r&&r(w),w.defaultPrevented||S(w)}return O.createElement("a",Pd({},y,{href:T||j,onClick:R||i?r:v,ref:n,target:u}))});var Ig;(function(t){t.UseScrollRestoration="useScrollRestoration",t.UseSubmit="useSubmit",t.UseSubmitFetcher="useSubmitFetcher",t.UseFetcher="useFetcher",t.useViewTransitionState="useViewTransitionState"})(Ig||(Ig={}));var Sg;(function(t){t.UseFetcher="useFetcher",t.UseFetchers="useFetchers",t.UseScrollRestoration="useScrollRestoration"})(Sg||(Sg={}));function YI(t,e){let{target:n,replace:r,state:s,preventScrollReset:i,relative:o,viewTransition:l}=e===void 0?{}:e,u=Mo(),h=_r(),p=c_(t,{relative:o});return O.useCallback(m=>{if($I(m,n)){m.preventDefault();let y=r!==void 0?r:Rl(h)===Rl(p);u(t,{replace:y,state:s,preventScrollReset:i,relative:o,viewTransition:l})}},[h,u,p,r,s,n,t,i,o,l])}var kg={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m_=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let s=t.charCodeAt(r);s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):(s&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},XI=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const s=t[n++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=t[n++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=t[n++],o=t[n++],l=t[n++],u=((s&7)<<18|(i&63)<<12|(o&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const i=t[n++],o=t[n++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},g_={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<t.length;s+=3){const i=t[s],o=s+1<t.length,l=o?t[s+1]:0,u=s+2<t.length,h=u?t[s+2]:0,p=i>>2,m=(i&3)<<4|l>>4;let y=(l&15)<<2|h>>6,k=h&63;u||(k=64,o||(y=64)),r.push(n[p],n[m],n[y],n[k])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(m_(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):XI(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<t.length;){const i=n[t.charAt(s++)],l=s<t.length?n[t.charAt(s)]:0;++s;const h=s<t.length?n[t.charAt(s)]:64;++s;const m=s<t.length?n[t.charAt(s)]:64;if(++s,i==null||l==null||h==null||m==null)throw new JI;const y=i<<2|l>>4;if(r.push(y),h!==64){const k=l<<4&240|h>>2;if(r.push(k),m!==64){const T=h<<6&192|m;r.push(T)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class JI extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const ZI=function(t){const e=m_(t);return g_.encodeByteArray(e,!0)},bl=function(t){return ZI(t).replace(/\./g,"")},y_=function(t){try{return g_.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eS(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tS=()=>eS().__FIREBASE_DEFAULTS__,nS=()=>{if(typeof process>"u"||typeof kg>"u")return;const t=kg.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},rS=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&y_(t[1]);return e&&JSON.parse(e)},fu=()=>{try{return tS()||nS()||rS()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},v_=t=>{var e,n;return(n=(e=fu())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},sS=t=>{const e=v_(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},__=()=>{var t;return(t=fu())===null||t===void 0?void 0:t.config},w_=t=>{var e;return(e=fu())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iS{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oS(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",s=t.iat||0,i=t.sub||t.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},t);return[bl(JSON.stringify(n)),bl(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function aS(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(rt())}function lS(){var t;const e=(t=fu())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function uS(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function cS(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function dS(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function hS(){const t=rt();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function fS(){return!lS()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function pS(){try{return typeof indexedDB=="object"}catch{return!1}}function mS(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var i;e(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gS="FirebaseError";class bn extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=gS,Object.setPrototypeOf(this,bn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Fo.prototype.create)}}class Fo{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?yS(i,r):"Error",l=`${this.serviceName}: ${o} (${s}).`;return new bn(s,l,r)}}function yS(t,e){return t.replace(vS,(n,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const vS=/\{\$([^}]+)}/g;function _S(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Nl(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const s of n){if(!r.includes(s))return!1;const i=t[s],o=e[s];if(Cg(i)&&Cg(o)){if(!Nl(i,o))return!1}else if(i!==o)return!1}for(const s of r)if(!n.includes(s))return!1;return!0}function Cg(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uo(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Mi(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function Fi(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function wS(t,e){const n=new xS(t,e);return n.subscribe.bind(n)}class xS{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let s;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");ES(e,["next","error","complete"])?s=e:s={next:e,error:n,complete:r},s.next===void 0&&(s.next=Sc),s.error===void 0&&(s.error=Sc),s.complete===void 0&&(s.complete=Sc);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function ES(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Sc(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qe(t){return t&&t._delegate?t._delegate:t}class zr{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ar="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TS{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new iS;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(SS(e))try{this.getOrInitializeService({instanceIdentifier:Ar})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=Ar){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ar){return this.instances.has(e)}getOptions(e=Ar){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[i,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);r===l&&o.resolve(s)}return s}onInit(e,n){var r;const s=this.normalizeInstanceIdentifier(n),i=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;i.add(e),this.onInitCallbacks.set(s,i);const o=this.instances.get(s);return o&&e(o,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const s of r)try{s(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:IS(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Ar){return this.component?this.component.multipleInstances?e:Ar:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function IS(t){return t===Ar?void 0:t}function SS(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kS{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new TS(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ne;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(ne||(ne={}));const CS={debug:ne.DEBUG,verbose:ne.VERBOSE,info:ne.INFO,warn:ne.WARN,error:ne.ERROR,silent:ne.SILENT},AS=ne.INFO,RS={[ne.DEBUG]:"log",[ne.VERBOSE]:"log",[ne.INFO]:"info",[ne.WARN]:"warn",[ne.ERROR]:"error"},bS=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),s=RS[e];if(s)console[s](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class uf{constructor(e){this.name=e,this._logLevel=AS,this._logHandler=bS,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ne))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?CS[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ne.DEBUG,...e),this._logHandler(this,ne.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ne.VERBOSE,...e),this._logHandler(this,ne.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ne.INFO,...e),this._logHandler(this,ne.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ne.WARN,...e),this._logHandler(this,ne.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ne.ERROR,...e),this._logHandler(this,ne.ERROR,...e)}}const NS=(t,e)=>e.some(n=>t instanceof n);let Ag,Rg;function PS(){return Ag||(Ag=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function jS(){return Rg||(Rg=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const x_=new WeakMap,jd=new WeakMap,E_=new WeakMap,kc=new WeakMap,cf=new WeakMap;function DS(t){const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("success",i),t.removeEventListener("error",o)},i=()=>{n(sr(t.result)),s()},o=()=>{r(t.error),s()};t.addEventListener("success",i),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&x_.set(n,t)}).catch(()=>{}),cf.set(e,t),e}function OS(t){if(jd.has(t))return;const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",o),t.removeEventListener("abort",o)},i=()=>{n(),s()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",i),t.addEventListener("error",o),t.addEventListener("abort",o)});jd.set(t,e)}let Dd={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return jd.get(t);if(e==="objectStoreNames")return t.objectStoreNames||E_.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return sr(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function VS(t){Dd=t(Dd)}function LS(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Cc(this),e,...n);return E_.set(r,e.sort?e.sort():[e]),sr(r)}:jS().includes(t)?function(...e){return t.apply(Cc(this),e),sr(x_.get(this))}:function(...e){return sr(t.apply(Cc(this),e))}}function MS(t){return typeof t=="function"?LS(t):(t instanceof IDBTransaction&&OS(t),NS(t,PS())?new Proxy(t,Dd):t)}function sr(t){if(t instanceof IDBRequest)return DS(t);if(kc.has(t))return kc.get(t);const e=MS(t);return e!==t&&(kc.set(t,e),cf.set(e,t)),e}const Cc=t=>cf.get(t);function FS(t,e,{blocked:n,upgrade:r,blocking:s,terminated:i}={}){const o=indexedDB.open(t,e),l=sr(o);return r&&o.addEventListener("upgradeneeded",u=>{r(sr(o.result),u.oldVersion,u.newVersion,sr(o.transaction),u)}),n&&o.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),l.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",h=>s(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const US=["get","getKey","getAll","getAllKeys","count"],zS=["put","add","delete","clear"],Ac=new Map;function bg(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Ac.get(e))return Ac.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,s=zS.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(s||US.includes(n)))return;const i=async function(o,...l){const u=this.transaction(o,s?"readwrite":"readonly");let h=u.store;return r&&(h=h.index(l.shift())),(await Promise.all([h[n](...l),s&&u.done]))[0]};return Ac.set(e,i),i}VS(t=>({...t,get:(e,n,r)=>bg(e,n)||t.get(e,n,r),has:(e,n)=>!!bg(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BS{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if($S(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function $S(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Od="@firebase/app",Ng="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const In=new uf("@firebase/app"),qS="@firebase/app-compat",WS="@firebase/analytics-compat",HS="@firebase/analytics",KS="@firebase/app-check-compat",GS="@firebase/app-check",QS="@firebase/auth",YS="@firebase/auth-compat",XS="@firebase/database",JS="@firebase/data-connect",ZS="@firebase/database-compat",e2="@firebase/functions",t2="@firebase/functions-compat",n2="@firebase/installations",r2="@firebase/installations-compat",s2="@firebase/messaging",i2="@firebase/messaging-compat",o2="@firebase/performance",a2="@firebase/performance-compat",l2="@firebase/remote-config",u2="@firebase/remote-config-compat",c2="@firebase/storage",d2="@firebase/storage-compat",h2="@firebase/firestore",f2="@firebase/vertexai-preview",p2="@firebase/firestore-compat",m2="firebase",g2="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vd="[DEFAULT]",y2={[Od]:"fire-core",[qS]:"fire-core-compat",[HS]:"fire-analytics",[WS]:"fire-analytics-compat",[GS]:"fire-app-check",[KS]:"fire-app-check-compat",[QS]:"fire-auth",[YS]:"fire-auth-compat",[XS]:"fire-rtdb",[JS]:"fire-data-connect",[ZS]:"fire-rtdb-compat",[e2]:"fire-fn",[t2]:"fire-fn-compat",[n2]:"fire-iid",[r2]:"fire-iid-compat",[s2]:"fire-fcm",[i2]:"fire-fcm-compat",[o2]:"fire-perf",[a2]:"fire-perf-compat",[l2]:"fire-rc",[u2]:"fire-rc-compat",[c2]:"fire-gcs",[d2]:"fire-gcs-compat",[h2]:"fire-fst",[p2]:"fire-fst-compat",[f2]:"fire-vertex","fire-js":"fire-js",[m2]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pl=new Map,v2=new Map,Ld=new Map;function Pg(t,e){try{t.container.addComponent(e)}catch(n){In.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Fs(t){const e=t.name;if(Ld.has(e))return In.debug(`There were multiple attempts to register component ${e}.`),!1;Ld.set(e,t);for(const n of Pl.values())Pg(n,t);for(const n of v2.values())Pg(n,t);return!0}function df(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Gt(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _2={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ir=new Fo("app","Firebase",_2);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w2{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new zr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ir.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ei=g2;function T_(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Vd,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw ir.create("bad-app-name",{appName:String(s)});if(n||(n=__()),!n)throw ir.create("no-options");const i=Pl.get(s);if(i){if(Nl(n,i.options)&&Nl(r,i.config))return i;throw ir.create("duplicate-app",{appName:s})}const o=new kS(s);for(const u of Ld.values())o.addComponent(u);const l=new w2(n,r,o);return Pl.set(s,l),l}function I_(t=Vd){const e=Pl.get(t);if(!e&&t===Vd&&__())return T_();if(!e)throw ir.create("no-app",{appName:t});return e}function or(t,e,n){var r;let s=(r=y2[t])!==null&&r!==void 0?r:t;n&&(s+=`-${n}`);const i=s.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const l=[`Unable to register library "${s}" with version "${e}":`];i&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),In.warn(l.join(" "));return}Fs(new zr(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x2="firebase-heartbeat-database",E2=1,Io="firebase-heartbeat-store";let Rc=null;function S_(){return Rc||(Rc=FS(x2,E2,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Io)}catch(n){console.warn(n)}}}}).catch(t=>{throw ir.create("idb-open",{originalErrorMessage:t.message})})),Rc}async function T2(t){try{const n=(await S_()).transaction(Io),r=await n.objectStore(Io).get(k_(t));return await n.done,r}catch(e){if(e instanceof bn)In.warn(e.message);else{const n=ir.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});In.warn(n.message)}}}async function jg(t,e){try{const r=(await S_()).transaction(Io,"readwrite");await r.objectStore(Io).put(e,k_(t)),await r.done}catch(n){if(n instanceof bn)In.warn(n.message);else{const r=ir.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});In.warn(r.message)}}}function k_(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const I2=1024,S2=30*24*60*60*1e3;class k2{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new A2(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Dg();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=S2}),this._storage.overwrite(this._heartbeatsCache))}catch(r){In.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Dg(),{heartbeatsToSend:r,unsentEntries:s}=C2(this._heartbeatsCache.heartbeats),i=bl(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(n){return In.warn(n),""}}}function Dg(){return new Date().toISOString().substring(0,10)}function C2(t,e=I2){const n=[];let r=t.slice();for(const s of t){const i=n.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),Og(n)>e){i.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),Og(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class A2{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return pS()?mS().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await T2(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return jg(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return jg(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Og(t){return bl(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function R2(t){Fs(new zr("platform-logger",e=>new BS(e),"PRIVATE")),Fs(new zr("heartbeat",e=>new k2(e),"PRIVATE")),or(Od,Ng,t),or(Od,Ng,"esm2017"),or("fire-js","")}R2("");function hf(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(t);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(t,r[s])&&(n[r[s]]=t[r[s]]);return n}function C_(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const b2=C_,A_=new Fo("auth","Firebase",C_());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jl=new uf("@firebase/auth");function N2(t,...e){jl.logLevel<=ne.WARN&&jl.warn(`Auth (${ei}): ${t}`,...e)}function Ya(t,...e){jl.logLevel<=ne.ERROR&&jl.error(`Auth (${ei}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $t(t,...e){throw ff(t,...e)}function Xt(t,...e){return ff(t,...e)}function R_(t,e,n){const r=Object.assign(Object.assign({},b2()),{[e]:n});return new Fo("auth","Firebase",r).create(e,{appName:t.name})}function _n(t){return R_(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function ff(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return A_.create(t,...e)}function K(t,e,...n){if(!t)throw ff(e,...n)}function mn(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Ya(e),new Error(e)}function Sn(t,e){t||mn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Md(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function P2(){return Vg()==="http:"||Vg()==="https:"}function Vg(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j2(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(P2()||cS()||"connection"in navigator)?navigator.onLine:!0}function D2(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zo{constructor(e,n){this.shortDelay=e,this.longDelay=n,Sn(n>e,"Short delay should be less than long delay!"),this.isMobile=aS()||dS()}get(){return j2()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pf(t,e){Sn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b_{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;mn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;mn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;mn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O2={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V2=new zo(3e4,6e4);function wr(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function Nn(t,e,n,r,s={}){return N_(t,s,async()=>{let i={},o={};r&&(e==="GET"?o=r:i={body:JSON.stringify(r)});const l=Uo(Object.assign({key:t.config.apiKey},o)).slice(1),u=await t._getAdditionalHeaders();u["Content-Type"]="application/json",t.languageCode&&(u["X-Firebase-Locale"]=t.languageCode);const h=Object.assign({method:e,headers:u},i);return uS()||(h.referrerPolicy="no-referrer"),b_.fetch()(P_(t,t.config.apiHost,n,l),h)})}async function N_(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},O2),e);try{const s=new M2(t),i=await Promise.race([n(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw ja(t,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const l=i.ok?o.errorMessage:o.error.message,[u,h]=l.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw ja(t,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw ja(t,"email-already-in-use",o);if(u==="USER_DISABLED")throw ja(t,"user-disabled",o);const p=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw R_(t,p,h);$t(t,p)}}catch(s){if(s instanceof bn)throw s;$t(t,"network-request-failed",{message:String(s)})}}async function Bo(t,e,n,r,s={}){const i=await Nn(t,e,n,r,s);return"mfaPendingCredential"in i&&$t(t,"multi-factor-auth-required",{_serverResponse:i}),i}function P_(t,e,n,r){const s=`${e}${n}?${r}`;return t.config.emulator?pf(t.config,s):`${t.config.apiScheme}://${s}`}function L2(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class M2{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(Xt(this.auth,"network-request-failed")),V2.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function ja(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const s=Xt(t,e,r);return s.customData._tokenResponse=n,s}function Lg(t){return t!==void 0&&t.enterprise!==void 0}class F2{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return L2(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function U2(t,e){return Nn(t,"GET","/v2/recaptchaConfig",wr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function z2(t,e){return Nn(t,"POST","/v1/accounts:delete",e)}async function j_(t,e){return Nn(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zi(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function B2(t,e=!1){const n=qe(t),r=await n.getIdToken(e),s=mf(r);K(s&&s.exp&&s.auth_time&&s.iat,n.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:Zi(bc(s.auth_time)),issuedAtTime:Zi(bc(s.iat)),expirationTime:Zi(bc(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function bc(t){return Number(t)*1e3}function mf(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Ya("JWT malformed, contained fewer than 3 sections"),null;try{const s=y_(n);return s?JSON.parse(s):(Ya("Failed to decode base64 JWT payload"),null)}catch(s){return Ya("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function Mg(t){const e=mf(t);return K(e,"internal-error"),K(typeof e.exp<"u","internal-error"),K(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Us(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof bn&&$2(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function $2({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q2{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fd{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Zi(this.lastLoginAt),this.creationTime=Zi(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dl(t){var e;const n=t.auth,r=await t.getIdToken(),s=await Us(t,j_(n,{idToken:r}));K(s==null?void 0:s.users.length,n,"internal-error");const i=s.users[0];t._notifyReloadListener(i);const o=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?D_(i.providerUserInfo):[],l=H2(t.providerData,o),u=t.isAnonymous,h=!(t.email&&i.passwordHash)&&!(l!=null&&l.length),p=u?h:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new Fd(i.createdAt,i.lastLoginAt),isAnonymous:p};Object.assign(t,m)}async function W2(t){const e=qe(t);await Dl(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function H2(t,e){return[...t.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function D_(t){return t.map(e=>{var{providerId:n}=e,r=hf(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function K2(t,e){const n=await N_(t,{},async()=>{const r=Uo({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=t.config,o=P_(t,s,"/v1/token",`key=${i}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",b_.fetch()(o,{method:"POST",headers:l,body:r})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function G2(t,e){return Nn(t,"POST","/v2/accounts:revokeToken",wr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class As{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){K(e.idToken,"internal-error"),K(typeof e.idToken<"u","internal-error"),K(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Mg(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){K(e.length!==0,"internal-error");const n=Mg(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(K(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:s,expiresIn:i}=await K2(e,n);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:s,expirationTime:i}=n,o=new As;return r&&(K(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),s&&(K(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(K(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new As,this.toJSON())}_performRefresh(){return mn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vn(t,e){K(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class gn{constructor(e){var{uid:n,auth:r,stsTokenManager:s}=e,i=hf(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new q2(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Fd(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Us(this,this.stsTokenManager.getToken(this.auth,e));return K(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return B2(this,e)}reload(){return W2(this)}_assign(e){this!==e&&(K(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new gn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){K(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await Dl(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Gt(this.auth.app))return Promise.reject(_n(this.auth));const e=await this.getIdToken();return await Us(this,z2(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,s,i,o,l,u,h,p;const m=(r=n.displayName)!==null&&r!==void 0?r:void 0,y=(s=n.email)!==null&&s!==void 0?s:void 0,k=(i=n.phoneNumber)!==null&&i!==void 0?i:void 0,T=(o=n.photoURL)!==null&&o!==void 0?o:void 0,R=(l=n.tenantId)!==null&&l!==void 0?l:void 0,j=(u=n._redirectEventId)!==null&&u!==void 0?u:void 0,S=(h=n.createdAt)!==null&&h!==void 0?h:void 0,v=(p=n.lastLoginAt)!==null&&p!==void 0?p:void 0,{uid:w,emailVerified:P,isAnonymous:L,providerData:F,stsTokenManager:I}=n;K(w&&I,e,"internal-error");const _=As.fromJSON(this.name,I);K(typeof w=="string",e,"internal-error"),Vn(m,e.name),Vn(y,e.name),K(typeof P=="boolean",e,"internal-error"),K(typeof L=="boolean",e,"internal-error"),Vn(k,e.name),Vn(T,e.name),Vn(R,e.name),Vn(j,e.name),Vn(S,e.name),Vn(v,e.name);const E=new gn({uid:w,auth:e,email:y,emailVerified:P,displayName:m,isAnonymous:L,photoURL:T,phoneNumber:k,tenantId:R,stsTokenManager:_,createdAt:S,lastLoginAt:v});return F&&Array.isArray(F)&&(E.providerData=F.map(x=>Object.assign({},x))),j&&(E._redirectEventId=j),E}static async _fromIdTokenResponse(e,n,r=!1){const s=new As;s.updateFromServerResponse(n);const i=new gn({uid:n.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Dl(i),i}static async _fromGetAccountInfoResponse(e,n,r){const s=n.users[0];K(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?D_(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),l=new As;l.updateFromIdToken(r);const u=new gn({uid:s.localId,auth:e,stsTokenManager:l,isAnonymous:o}),h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Fd(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(u,h),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fg=new Map;function yn(t){Sn(t instanceof Function,"Expected a class definition");let e=Fg.get(t);return e?(Sn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Fg.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O_{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}O_.type="NONE";const Ug=O_;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xa(t,e,n){return`firebase:${t}:${e}:${n}`}class Rs{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=Xa(this.userKey,s.apiKey,i),this.fullPersistenceKey=Xa("persistence",s.apiKey,i),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?gn._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new Rs(yn(Ug),e,r);const s=(await Promise.all(n.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let i=s[0]||yn(Ug);const o=Xa(r,e.config.apiKey,e.name);let l=null;for(const h of n)try{const p=await h._get(o);if(p){const m=gn._fromJSON(e,p);h!==i&&(l=m),i=h;break}}catch{}const u=s.filter(h=>h._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new Rs(i,e,r):(i=u[0],l&&await i._set(o,l.toJSON()),await Promise.all(n.map(async h=>{if(h!==i)try{await h._remove(o)}catch{}})),new Rs(i,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zg(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(F_(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(V_(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(z_(e))return"Blackberry";if(B_(e))return"Webos";if(L_(e))return"Safari";if((e.includes("chrome/")||M_(e))&&!e.includes("edge/"))return"Chrome";if(U_(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function V_(t=rt()){return/firefox\//i.test(t)}function L_(t=rt()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function M_(t=rt()){return/crios\//i.test(t)}function F_(t=rt()){return/iemobile/i.test(t)}function U_(t=rt()){return/android/i.test(t)}function z_(t=rt()){return/blackberry/i.test(t)}function B_(t=rt()){return/webos/i.test(t)}function gf(t=rt()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Q2(t=rt()){var e;return gf(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Y2(){return hS()&&document.documentMode===10}function $_(t=rt()){return gf(t)||U_(t)||B_(t)||z_(t)||/windows phone/i.test(t)||F_(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function q_(t,e=[]){let n;switch(t){case"Browser":n=zg(rt());break;case"Worker":n=`${zg(rt())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${ei}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X2{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=i=>new Promise((o,l)=>{try{const u=e(i);o(u)}catch(u){l(u)}});r.onAbort=n,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const s of n)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function J2(t,e={}){return Nn(t,"GET","/v2/passwordPolicy",wr(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z2=6;class ek{constructor(e){var n,r,s,i;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:Z2,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,s,i,o,l;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(n=u.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),u.isValid&&(u.isValid=(r=u.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),u.isValid&&(u.isValid=(s=u.containsLowercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(i=u.containsUppercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(o=u.containsNumericCharacter)!==null&&o!==void 0?o:!0),u.isValid&&(u.isValid=(l=u.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),u}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),s&&(n.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tk{constructor(e,n,r,s){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Bg(this),this.idTokenSubscription=new Bg(this),this.beforeStateQueue=new X2(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=A_,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=yn(n)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await Rs.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await j_(this,{idToken:e}),r=await gn._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(Gt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=s==null?void 0:s._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===l)&&(u!=null&&u.user)&&(s=u.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(o){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return K(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Dl(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=D2()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Gt(this.app))return Promise.reject(_n(this));const n=e?qe(e):null;return n&&K(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&K(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Gt(this.app)?Promise.reject(_n(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Gt(this.app)?Promise.reject(_n(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(yn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await J2(this),n=new ek(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Fo("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await G2(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&yn(e)||this._popupRedirectResolver;K(n,this,"argument-error"),this.redirectPersistenceManager=await Rs.create(this,[yn(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,s){if(this._deleted)return()=>{};const i=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(K(l,this,"internal-error"),l.then(()=>{o||i(this.currentUser)}),typeof n=="function"){const u=e.addObserver(n,r,s);return()=>{o=!0,u()}}else{const u=e.addObserver(n);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return K(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=q_(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(n["X-Firebase-AppCheck"]=s),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&N2(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function Yr(t){return qe(t)}class Bg{constructor(e){this.auth=e,this.observer=null,this.addObserver=wS(n=>this.observer=n)}get next(){return K(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pu={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function nk(t){pu=t}function W_(t){return pu.loadJS(t)}function rk(){return pu.recaptchaEnterpriseScript}function sk(){return pu.gapiScript}function ik(t){return`__${t}${Math.floor(Math.random()*1e6)}`}const ok="recaptcha-enterprise",ak="NO_RECAPTCHA";class lk{constructor(e){this.type=ok,this.auth=Yr(e)}async verify(e="verify",n=!1){async function r(i){if(!n){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,l)=>{U2(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const h=new F2(u);return i.tenantId==null?i._agentRecaptchaConfig=h:i._tenantRecaptchaConfigs[i.tenantId]=h,o(h.siteKey)}}).catch(u=>{l(u)})})}function s(i,o,l){const u=window.grecaptcha;Lg(u)?u.enterprise.ready(()=>{u.enterprise.execute(i,{action:e}).then(h=>{o(h)}).catch(()=>{o(ak)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,o)=>{r(this.auth).then(l=>{if(!n&&Lg(window.grecaptcha))s(l,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=rk();u.length!==0&&(u+=l),W_(u).then(()=>{s(l,i,o)}).catch(h=>{o(h)})}}).catch(l=>{o(l)})})}}async function $g(t,e,n,r=!1){const s=new lk(t);let i;try{i=await s.verify(n)}catch{i=await s.verify(n,!0)}const o=Object.assign({},e);return r?Object.assign(o,{captchaResp:i}):Object.assign(o,{captchaResponse:i}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Ud(t,e,n,r){var s;if(!((s=t._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await $g(t,e,n,n==="getOobCode");return r(t,i)}else return r(t,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await $g(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(i)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uk(t,e){const n=df(t,"auth");if(n.isInitialized()){const s=n.getImmediate(),i=n.getOptions();if(Nl(i,e??{}))return s;$t(s,"already-initialized")}return n.initialize({options:e})}function ck(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(yn);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function dk(t,e,n){const r=Yr(t);K(r._canInitEmulator,r,"emulator-config-failed"),K(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=H_(e),{host:o,port:l}=hk(e),u=l===null?"":`:${l}`;r.config.emulator={url:`${i}//${o}${u}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:o,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})}),fk()}function H_(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function hk(t){const e=H_(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:qg(r.substr(i.length+1))}}else{const[i,o]=r.split(":");return{host:i,port:qg(o)}}}function qg(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function fk(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yf{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return mn("not implemented")}_getIdTokenResponse(e){return mn("not implemented")}_linkToIdToken(e,n){return mn("not implemented")}_getReauthenticationResolver(e){return mn("not implemented")}}async function pk(t,e){return Nn(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mk(t,e){return Bo(t,"POST","/v1/accounts:signInWithPassword",wr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gk(t,e){return Bo(t,"POST","/v1/accounts:signInWithEmailLink",wr(t,e))}async function yk(t,e){return Bo(t,"POST","/v1/accounts:signInWithEmailLink",wr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class So extends yf{constructor(e,n,r,s=null){super("password",r),this._email=e,this._password=n,this._tenantId=s}static _fromEmailAndPassword(e,n){return new So(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new So(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Ud(e,n,"signInWithPassword",mk);case"emailLink":return gk(e,{email:this._email,oobCode:this._password});default:$t(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Ud(e,r,"signUpPassword",pk);case"emailLink":return yk(e,{idToken:n,email:this._email,oobCode:this._password});default:$t(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bs(t,e){return Bo(t,"POST","/v1/accounts:signInWithIdp",wr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vk="http://localhost";class Br extends yf{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Br(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):$t("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=n,i=hf(n,["providerId","signInMethod"]);if(!r||!s)return null;const o=new Br(r,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return bs(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,bs(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,bs(e,n)}buildRequest(){const e={requestUri:vk,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Uo(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _k(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function wk(t){const e=Mi(Fi(t)).link,n=e?Mi(Fi(e)).deep_link_id:null,r=Mi(Fi(t)).deep_link_id;return(r?Mi(Fi(r)).link:null)||r||n||e||t}class vf{constructor(e){var n,r,s,i,o,l;const u=Mi(Fi(e)),h=(n=u.apiKey)!==null&&n!==void 0?n:null,p=(r=u.oobCode)!==null&&r!==void 0?r:null,m=_k((s=u.mode)!==null&&s!==void 0?s:null);K(h&&p&&m,"argument-error"),this.apiKey=h,this.operation=m,this.code=p,this.continueUrl=(i=u.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(o=u.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(l=u.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const n=wk(e);try{return new vf(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ti{constructor(){this.providerId=ti.PROVIDER_ID}static credential(e,n){return So._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=vf.parseLink(n);return K(r,"argument-error"),So._fromEmailAndCode(e,r.code,r.tenantId)}}ti.PROVIDER_ID="password";ti.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ti.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K_{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $o extends K_{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zn extends $o{constructor(){super("facebook.com")}static credential(e){return Br._fromParams({providerId:zn.PROVIDER_ID,signInMethod:zn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return zn.credentialFromTaggedObject(e)}static credentialFromError(e){return zn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return zn.credential(e.oauthAccessToken)}catch{return null}}}zn.FACEBOOK_SIGN_IN_METHOD="facebook.com";zn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bn extends $o{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Br._fromParams({providerId:Bn.PROVIDER_ID,signInMethod:Bn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Bn.credentialFromTaggedObject(e)}static credentialFromError(e){return Bn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return Bn.credential(n,r)}catch{return null}}}Bn.GOOGLE_SIGN_IN_METHOD="google.com";Bn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $n extends $o{constructor(){super("github.com")}static credential(e){return Br._fromParams({providerId:$n.PROVIDER_ID,signInMethod:$n.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return $n.credentialFromTaggedObject(e)}static credentialFromError(e){return $n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return $n.credential(e.oauthAccessToken)}catch{return null}}}$n.GITHUB_SIGN_IN_METHOD="github.com";$n.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn extends $o{constructor(){super("twitter.com")}static credential(e,n){return Br._fromParams({providerId:qn.PROVIDER_ID,signInMethod:qn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return qn.credentialFromTaggedObject(e)}static credentialFromError(e){return qn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return qn.credential(n,r)}catch{return null}}}qn.TWITTER_SIGN_IN_METHOD="twitter.com";qn.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xk(t,e){return Bo(t,"POST","/v1/accounts:signUp",wr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $r{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,s=!1){const i=await gn._fromIdTokenResponse(e,r,s),o=Wg(r);return new $r({user:i,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const s=Wg(r);return new $r({user:e,providerId:s,_tokenResponse:r,operationType:n})}}function Wg(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ol extends bn{constructor(e,n,r,s){var i;super(n.code,n.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Ol.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,s){return new Ol(e,n,r,s)}}function G_(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Ol._fromErrorAndOperation(t,i,e,r):i})}async function Ek(t,e,n=!1){const r=await Us(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return $r._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Tk(t,e,n=!1){const{auth:r}=t;if(Gt(r.app))return Promise.reject(_n(r));const s="reauthenticate";try{const i=await Us(t,G_(r,s,e,t),n);K(i.idToken,r,"internal-error");const o=mf(i.idToken);K(o,r,"internal-error");const{sub:l}=o;return K(t.uid===l,r,"user-mismatch"),$r._forOperation(t,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&$t(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Q_(t,e,n=!1){if(Gt(t.app))return Promise.reject(_n(t));const r="signIn",s=await G_(t,r,e),i=await $r._fromIdTokenResponse(t,r,s);return n||await t._updateCurrentUser(i.user),i}async function Ik(t,e){return Q_(Yr(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Y_(t){const e=Yr(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Sk(t,e,n){if(Gt(t.app))return Promise.reject(_n(t));const r=Yr(t),o=await Ud(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",xk).catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&Y_(t),u}),l=await $r._fromIdTokenResponse(r,"signIn",o);return await r._updateCurrentUser(l.user),l}function kk(t,e,n){return Gt(t.app)?Promise.reject(_n(t)):Ik(qe(t),ti.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Y_(t),r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ck(t,e){return Nn(t,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ak(t,{displayName:e,photoURL:n}){if(e===void 0&&n===void 0)return;const r=qe(t),i={idToken:await r.getIdToken(),displayName:e,photoUrl:n,returnSecureToken:!0},o=await Us(r,Ck(r.auth,i));r.displayName=o.displayName||null,r.photoURL=o.photoUrl||null;const l=r.providerData.find(({providerId:u})=>u==="password");l&&(l.displayName=r.displayName,l.photoURL=r.photoURL),await r._updateTokensIfNecessary(o)}function Rk(t,e,n,r){return qe(t).onIdTokenChanged(e,n,r)}function bk(t,e,n){return qe(t).beforeAuthStateChanged(e,n)}function Nk(t,e,n,r){return qe(t).onAuthStateChanged(e,n,r)}function Hg(t){return qe(t).signOut()}const Vl="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X_{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Vl,"1"),this.storage.removeItem(Vl),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pk=1e3,jk=10;class J_ extends X_{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=$_(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),s=this.localCache[n];r!==s&&e(n,s,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,u)=>{this.notifyListeners(o,u)});return}const r=e.key;n?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},i=this.storage.getItem(r);Y2()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,jk):s()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},Pk)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}J_.type="LOCAL";const Dk=J_;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z_ extends X_{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Z_.type="SESSION";const ew=Z_;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ok(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mu{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(s=>s.isListeningto(e));if(n)return n;const r=new mu(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:s,data:i}=n.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const l=Array.from(o).map(async h=>h(n.origin,i)),u=await Ok(l);n.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:u})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}mu.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _f(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vk{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((l,u)=>{const h=_f("",20);s.port1.start();const p=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:s,onMessage(m){const y=m;if(y.data.eventId===h)switch(y.data.status){case"ack":clearTimeout(p),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(y.data.response);break;default:clearTimeout(p),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:n},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jt(){return window}function Lk(t){Jt().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tw(){return typeof Jt().WorkerGlobalScope<"u"&&typeof Jt().importScripts=="function"}async function Mk(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Fk(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function Uk(){return tw()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nw="firebaseLocalStorageDb",zk=1,Ll="firebaseLocalStorage",rw="fbase_key";class qo{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function gu(t,e){return t.transaction([Ll],e?"readwrite":"readonly").objectStore(Ll)}function Bk(){const t=indexedDB.deleteDatabase(nw);return new qo(t).toPromise()}function zd(){const t=indexedDB.open(nw,zk);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(Ll,{keyPath:rw})}catch(s){n(s)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(Ll)?e(r):(r.close(),await Bk(),e(await zd()))})})}async function Kg(t,e,n){const r=gu(t,!0).put({[rw]:e,value:n});return new qo(r).toPromise()}async function $k(t,e){const n=gu(t,!1).get(e),r=await new qo(n).toPromise();return r===void 0?null:r.value}function Gg(t,e){const n=gu(t,!0).delete(e);return new qo(n).toPromise()}const qk=800,Wk=3;class sw{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await zd(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>Wk)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return tw()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=mu._getInstance(Uk()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await Mk(),!this.activeServiceWorker)return;this.sender=new Vk(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Fk()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await zd();return await Kg(e,Vl,"1"),await Gg(e,Vl),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Kg(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>$k(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Gg(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=gu(s,!1).getAll();return new qo(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),n.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),n.push(s));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),qk)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}sw.type="LOCAL";const Hk=sw;new zo(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kk(t,e){return e?yn(e):(K(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wf extends yf{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return bs(e,this._buildIdpRequest())}_linkToIdToken(e,n){return bs(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return bs(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Gk(t){return Q_(t.auth,new wf(t),t.bypassAuthState)}function Qk(t){const{auth:e,user:n}=t;return K(n,e,"internal-error"),Tk(n,new wf(t),t.bypassAuthState)}async function Yk(t){const{auth:e,user:n}=t;return K(n,e,"internal-error"),Ek(n,new wf(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iw{constructor(e,n,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:s,tenantId:i,error:o,type:l}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:n,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(u))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Gk;case"linkViaPopup":case"linkViaRedirect":return Yk;case"reauthViaPopup":case"reauthViaRedirect":return Qk;default:$t(this.auth,"internal-error")}}resolve(e){Sn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Sn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xk=new zo(2e3,1e4);class xs extends iw{constructor(e,n,r,s,i){super(e,n,s,i),this.provider=r,this.authWindow=null,this.pollId=null,xs.currentPopupAction&&xs.currentPopupAction.cancel(),xs.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return K(e,this.auth,"internal-error"),e}async onExecution(){Sn(this.filter.length===1,"Popup operations only handle one event");const e=_f();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Xt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Xt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,xs.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Xt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Xk.get())};e()}}xs.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jk="pendingRedirect",Ja=new Map;class Zk extends iw{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Ja.get(this.auth._key());if(!e){try{const r=await eC(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Ja.set(this.auth._key(),e)}return this.bypassAuthState||Ja.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function eC(t,e){const n=rC(e),r=nC(t);if(!await r._isAvailable())return!1;const s=await r._get(n)==="true";return await r._remove(n),s}function tC(t,e){Ja.set(t._key(),e)}function nC(t){return yn(t._redirectPersistence)}function rC(t){return Xa(Jk,t.config.apiKey,t.name)}async function sC(t,e,n=!1){if(Gt(t.app))return Promise.reject(_n(t));const r=Yr(t),s=Kk(r,e),o=await new Zk(r,s,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iC=10*60*1e3;class oC{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!aC(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!ow(e)){const s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(Xt(this.auth,s))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=iC&&this.cachedEventUids.clear(),this.cachedEventUids.has(Qg(e))}saveEventToCache(e){this.cachedEventUids.add(Qg(e)),this.lastProcessedEventTime=Date.now()}}function Qg(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function ow({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function aC(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ow(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lC(t,e={}){return Nn(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uC=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,cC=/^https?/;async function dC(t){if(t.config.emulator)return;const{authorizedDomains:e}=await lC(t);for(const n of e)try{if(hC(n))return}catch{}$t(t,"unauthorized-domain")}function hC(t){const e=Md(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!cC.test(n))return!1;if(uC.test(t))return r===t;const s=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fC=new zo(3e4,6e4);function Yg(){const t=Jt().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function pC(t){return new Promise((e,n)=>{var r,s,i;function o(){Yg(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Yg(),n(Xt(t,"network-request-failed"))},timeout:fC.get()})}if(!((s=(r=Jt().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((i=Jt().gapi)===null||i===void 0)&&i.load)o();else{const l=ik("iframefcb");return Jt()[l]=()=>{gapi.load?o():n(Xt(t,"network-request-failed"))},W_(`${sk()}?onload=${l}`).catch(u=>n(u))}}).catch(e=>{throw Za=null,e})}let Za=null;function mC(t){return Za=Za||pC(t),Za}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gC=new zo(5e3,15e3),yC="__/auth/iframe",vC="emulator/auth/iframe",_C={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},wC=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function xC(t){const e=t.config;K(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?pf(e,vC):`https://${t.config.authDomain}/${yC}`,r={apiKey:e.apiKey,appName:t.name,v:ei},s=wC.get(t.config.apiHost);s&&(r.eid=s);const i=t._getFrameworks();return i.length&&(r.fw=i.join(",")),`${n}?${Uo(r).slice(1)}`}async function EC(t){const e=await mC(t),n=Jt().gapi;return K(n,t,"internal-error"),e.open({where:document.body,url:xC(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:_C,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const o=Xt(t,"network-request-failed"),l=Jt().setTimeout(()=>{i(o)},gC.get());function u(){Jt().clearTimeout(l),s(r)}r.ping(u).then(u,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TC={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},IC=500,SC=600,kC="_blank",CC="http://localhost";class Xg{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function AC(t,e,n,r=IC,s=SC){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const u=Object.assign(Object.assign({},TC),{width:r.toString(),height:s.toString(),top:i,left:o}),h=rt().toLowerCase();n&&(l=M_(h)?kC:n),V_(h)&&(e=e||CC,u.scrollbars="yes");const p=Object.entries(u).reduce((y,[k,T])=>`${y}${k}=${T},`,"");if(Q2(h)&&l!=="_self")return RC(e||"",l),new Xg(null);const m=window.open(e||"",l,p);K(m,t,"popup-blocked");try{m.focus()}catch{}return new Xg(m)}function RC(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bC="__/auth/handler",NC="emulator/auth/handler",PC=encodeURIComponent("fac");async function Jg(t,e,n,r,s,i){K(t.config.authDomain,t,"auth-domain-config-required"),K(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:ei,eventId:s};if(e instanceof K_){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",_S(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[p,m]of Object.entries({}))o[p]=m}if(e instanceof $o){const p=e.getScopes().filter(m=>m!=="");p.length>0&&(o.scopes=p.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const p of Object.keys(l))l[p]===void 0&&delete l[p];const u=await t._getAppCheckToken(),h=u?`#${PC}=${encodeURIComponent(u)}`:"";return`${jC(t)}?${Uo(l).slice(1)}${h}`}function jC({config:t}){return t.emulator?pf(t,NC):`https://${t.authDomain}/${bC}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nc="webStorageSupport";class DC{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=ew,this._completeRedirectFn=sC,this._overrideRedirectResult=tC}async _openPopup(e,n,r,s){var i;Sn((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const o=await Jg(e,n,r,Md(),s);return AC(e,o,_f())}async _openRedirect(e,n,r,s){await this._originValidation(e);const i=await Jg(e,n,r,Md(),s);return Lk(i),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:s,promise:i}=this.eventManagers[n];return s?Promise.resolve(s):(Sn(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await EC(e),r=new oC(e);return n.register("authEvent",s=>(K(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Nc,{type:Nc},s=>{var i;const o=(i=s==null?void 0:s[0])===null||i===void 0?void 0:i[Nc];o!==void 0&&n(!!o),$t(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=dC(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return $_()||L_()||gf()}}const OC=DC;var Zg="@firebase/auth",ey="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VC{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){K(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function LC(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function MC(t){Fs(new zr("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=r.options;K(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:q_(t)},h=new tk(r,s,i,u);return ck(h,n),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Fs(new zr("auth-internal",e=>{const n=Yr(e.getProvider("auth").getImmediate());return(r=>new VC(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),or(Zg,ey,LC(t)),or(Zg,ey,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FC=5*60,UC=w_("authIdTokenMaxAge")||FC;let ty=null;const zC=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>UC)return;const s=n==null?void 0:n.token;ty!==s&&(ty=s,await fetch(t,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function BC(t=I_()){const e=df(t,"auth");if(e.isInitialized())return e.getImmediate();const n=uk(t,{popupRedirectResolver:OC,persistence:[Hk,Dk,ew]}),r=w_("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const o=zC(i.toString());bk(n,o,()=>o(n.currentUser)),Rk(n,l=>o(l))}}const s=v_("auth");return s&&dk(n,`http://${s}`),n}function $C(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}nk({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=s=>{const i=Xt("internal-error");i.customData=s,n(i)},r.type="text/javascript",r.charset="UTF-8",$C().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});MC("Browser");var ny=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Or,aw;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,_){function E(){}E.prototype=_.prototype,I.D=_.prototype,I.prototype=new E,I.prototype.constructor=I,I.C=function(x,A,b){for(var C=Array(arguments.length-2),Tt=2;Tt<arguments.length;Tt++)C[Tt-2]=arguments[Tt];return _.prototype[A].apply(x,C)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(I,_,E){E||(E=0);var x=Array(16);if(typeof _=="string")for(var A=0;16>A;++A)x[A]=_.charCodeAt(E++)|_.charCodeAt(E++)<<8|_.charCodeAt(E++)<<16|_.charCodeAt(E++)<<24;else for(A=0;16>A;++A)x[A]=_[E++]|_[E++]<<8|_[E++]<<16|_[E++]<<24;_=I.g[0],E=I.g[1],A=I.g[2];var b=I.g[3],C=_+(b^E&(A^b))+x[0]+3614090360&4294967295;_=E+(C<<7&4294967295|C>>>25),C=b+(A^_&(E^A))+x[1]+3905402710&4294967295,b=_+(C<<12&4294967295|C>>>20),C=A+(E^b&(_^E))+x[2]+606105819&4294967295,A=b+(C<<17&4294967295|C>>>15),C=E+(_^A&(b^_))+x[3]+3250441966&4294967295,E=A+(C<<22&4294967295|C>>>10),C=_+(b^E&(A^b))+x[4]+4118548399&4294967295,_=E+(C<<7&4294967295|C>>>25),C=b+(A^_&(E^A))+x[5]+1200080426&4294967295,b=_+(C<<12&4294967295|C>>>20),C=A+(E^b&(_^E))+x[6]+2821735955&4294967295,A=b+(C<<17&4294967295|C>>>15),C=E+(_^A&(b^_))+x[7]+4249261313&4294967295,E=A+(C<<22&4294967295|C>>>10),C=_+(b^E&(A^b))+x[8]+1770035416&4294967295,_=E+(C<<7&4294967295|C>>>25),C=b+(A^_&(E^A))+x[9]+2336552879&4294967295,b=_+(C<<12&4294967295|C>>>20),C=A+(E^b&(_^E))+x[10]+4294925233&4294967295,A=b+(C<<17&4294967295|C>>>15),C=E+(_^A&(b^_))+x[11]+2304563134&4294967295,E=A+(C<<22&4294967295|C>>>10),C=_+(b^E&(A^b))+x[12]+1804603682&4294967295,_=E+(C<<7&4294967295|C>>>25),C=b+(A^_&(E^A))+x[13]+4254626195&4294967295,b=_+(C<<12&4294967295|C>>>20),C=A+(E^b&(_^E))+x[14]+2792965006&4294967295,A=b+(C<<17&4294967295|C>>>15),C=E+(_^A&(b^_))+x[15]+1236535329&4294967295,E=A+(C<<22&4294967295|C>>>10),C=_+(A^b&(E^A))+x[1]+4129170786&4294967295,_=E+(C<<5&4294967295|C>>>27),C=b+(E^A&(_^E))+x[6]+3225465664&4294967295,b=_+(C<<9&4294967295|C>>>23),C=A+(_^E&(b^_))+x[11]+643717713&4294967295,A=b+(C<<14&4294967295|C>>>18),C=E+(b^_&(A^b))+x[0]+3921069994&4294967295,E=A+(C<<20&4294967295|C>>>12),C=_+(A^b&(E^A))+x[5]+3593408605&4294967295,_=E+(C<<5&4294967295|C>>>27),C=b+(E^A&(_^E))+x[10]+38016083&4294967295,b=_+(C<<9&4294967295|C>>>23),C=A+(_^E&(b^_))+x[15]+3634488961&4294967295,A=b+(C<<14&4294967295|C>>>18),C=E+(b^_&(A^b))+x[4]+3889429448&4294967295,E=A+(C<<20&4294967295|C>>>12),C=_+(A^b&(E^A))+x[9]+568446438&4294967295,_=E+(C<<5&4294967295|C>>>27),C=b+(E^A&(_^E))+x[14]+3275163606&4294967295,b=_+(C<<9&4294967295|C>>>23),C=A+(_^E&(b^_))+x[3]+4107603335&4294967295,A=b+(C<<14&4294967295|C>>>18),C=E+(b^_&(A^b))+x[8]+1163531501&4294967295,E=A+(C<<20&4294967295|C>>>12),C=_+(A^b&(E^A))+x[13]+2850285829&4294967295,_=E+(C<<5&4294967295|C>>>27),C=b+(E^A&(_^E))+x[2]+4243563512&4294967295,b=_+(C<<9&4294967295|C>>>23),C=A+(_^E&(b^_))+x[7]+1735328473&4294967295,A=b+(C<<14&4294967295|C>>>18),C=E+(b^_&(A^b))+x[12]+2368359562&4294967295,E=A+(C<<20&4294967295|C>>>12),C=_+(E^A^b)+x[5]+4294588738&4294967295,_=E+(C<<4&4294967295|C>>>28),C=b+(_^E^A)+x[8]+2272392833&4294967295,b=_+(C<<11&4294967295|C>>>21),C=A+(b^_^E)+x[11]+1839030562&4294967295,A=b+(C<<16&4294967295|C>>>16),C=E+(A^b^_)+x[14]+4259657740&4294967295,E=A+(C<<23&4294967295|C>>>9),C=_+(E^A^b)+x[1]+2763975236&4294967295,_=E+(C<<4&4294967295|C>>>28),C=b+(_^E^A)+x[4]+1272893353&4294967295,b=_+(C<<11&4294967295|C>>>21),C=A+(b^_^E)+x[7]+4139469664&4294967295,A=b+(C<<16&4294967295|C>>>16),C=E+(A^b^_)+x[10]+3200236656&4294967295,E=A+(C<<23&4294967295|C>>>9),C=_+(E^A^b)+x[13]+681279174&4294967295,_=E+(C<<4&4294967295|C>>>28),C=b+(_^E^A)+x[0]+3936430074&4294967295,b=_+(C<<11&4294967295|C>>>21),C=A+(b^_^E)+x[3]+3572445317&4294967295,A=b+(C<<16&4294967295|C>>>16),C=E+(A^b^_)+x[6]+76029189&4294967295,E=A+(C<<23&4294967295|C>>>9),C=_+(E^A^b)+x[9]+3654602809&4294967295,_=E+(C<<4&4294967295|C>>>28),C=b+(_^E^A)+x[12]+3873151461&4294967295,b=_+(C<<11&4294967295|C>>>21),C=A+(b^_^E)+x[15]+530742520&4294967295,A=b+(C<<16&4294967295|C>>>16),C=E+(A^b^_)+x[2]+3299628645&4294967295,E=A+(C<<23&4294967295|C>>>9),C=_+(A^(E|~b))+x[0]+4096336452&4294967295,_=E+(C<<6&4294967295|C>>>26),C=b+(E^(_|~A))+x[7]+1126891415&4294967295,b=_+(C<<10&4294967295|C>>>22),C=A+(_^(b|~E))+x[14]+2878612391&4294967295,A=b+(C<<15&4294967295|C>>>17),C=E+(b^(A|~_))+x[5]+4237533241&4294967295,E=A+(C<<21&4294967295|C>>>11),C=_+(A^(E|~b))+x[12]+1700485571&4294967295,_=E+(C<<6&4294967295|C>>>26),C=b+(E^(_|~A))+x[3]+2399980690&4294967295,b=_+(C<<10&4294967295|C>>>22),C=A+(_^(b|~E))+x[10]+4293915773&4294967295,A=b+(C<<15&4294967295|C>>>17),C=E+(b^(A|~_))+x[1]+2240044497&4294967295,E=A+(C<<21&4294967295|C>>>11),C=_+(A^(E|~b))+x[8]+1873313359&4294967295,_=E+(C<<6&4294967295|C>>>26),C=b+(E^(_|~A))+x[15]+4264355552&4294967295,b=_+(C<<10&4294967295|C>>>22),C=A+(_^(b|~E))+x[6]+2734768916&4294967295,A=b+(C<<15&4294967295|C>>>17),C=E+(b^(A|~_))+x[13]+1309151649&4294967295,E=A+(C<<21&4294967295|C>>>11),C=_+(A^(E|~b))+x[4]+4149444226&4294967295,_=E+(C<<6&4294967295|C>>>26),C=b+(E^(_|~A))+x[11]+3174756917&4294967295,b=_+(C<<10&4294967295|C>>>22),C=A+(_^(b|~E))+x[2]+718787259&4294967295,A=b+(C<<15&4294967295|C>>>17),C=E+(b^(A|~_))+x[9]+3951481745&4294967295,I.g[0]=I.g[0]+_&4294967295,I.g[1]=I.g[1]+(A+(C<<21&4294967295|C>>>11))&4294967295,I.g[2]=I.g[2]+A&4294967295,I.g[3]=I.g[3]+b&4294967295}r.prototype.u=function(I,_){_===void 0&&(_=I.length);for(var E=_-this.blockSize,x=this.B,A=this.h,b=0;b<_;){if(A==0)for(;b<=E;)s(this,I,b),b+=this.blockSize;if(typeof I=="string"){for(;b<_;)if(x[A++]=I.charCodeAt(b++),A==this.blockSize){s(this,x),A=0;break}}else for(;b<_;)if(x[A++]=I[b++],A==this.blockSize){s(this,x),A=0;break}}this.h=A,this.o+=_},r.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var _=1;_<I.length-8;++_)I[_]=0;var E=8*this.o;for(_=I.length-8;_<I.length;++_)I[_]=E&255,E/=256;for(this.u(I),I=Array(16),_=E=0;4>_;++_)for(var x=0;32>x;x+=8)I[E++]=this.g[_]>>>x&255;return I};function i(I,_){var E=l;return Object.prototype.hasOwnProperty.call(E,I)?E[I]:E[I]=_(I)}function o(I,_){this.h=_;for(var E=[],x=!0,A=I.length-1;0<=A;A--){var b=I[A]|0;x&&b==_||(E[A]=b,x=!1)}this.g=E}var l={};function u(I){return-128<=I&&128>I?i(I,function(_){return new o([_|0],0>_?-1:0)}):new o([I|0],0>I?-1:0)}function h(I){if(isNaN(I)||!isFinite(I))return m;if(0>I)return j(h(-I));for(var _=[],E=1,x=0;I>=E;x++)_[x]=I/E|0,E*=4294967296;return new o(_,0)}function p(I,_){if(I.length==0)throw Error("number format error: empty string");if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(I.charAt(0)=="-")return j(p(I.substring(1),_));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var E=h(Math.pow(_,8)),x=m,A=0;A<I.length;A+=8){var b=Math.min(8,I.length-A),C=parseInt(I.substring(A,A+b),_);8>b?(b=h(Math.pow(_,b)),x=x.j(b).add(h(C))):(x=x.j(E),x=x.add(h(C)))}return x}var m=u(0),y=u(1),k=u(16777216);t=o.prototype,t.m=function(){if(R(this))return-j(this).m();for(var I=0,_=1,E=0;E<this.g.length;E++){var x=this.i(E);I+=(0<=x?x:4294967296+x)*_,_*=4294967296}return I},t.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(T(this))return"0";if(R(this))return"-"+j(this).toString(I);for(var _=h(Math.pow(I,6)),E=this,x="";;){var A=P(E,_).g;E=S(E,A.j(_));var b=((0<E.g.length?E.g[0]:E.h)>>>0).toString(I);if(E=A,T(E))return b+x;for(;6>b.length;)b="0"+b;x=b+x}},t.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function T(I){if(I.h!=0)return!1;for(var _=0;_<I.g.length;_++)if(I.g[_]!=0)return!1;return!0}function R(I){return I.h==-1}t.l=function(I){return I=S(this,I),R(I)?-1:T(I)?0:1};function j(I){for(var _=I.g.length,E=[],x=0;x<_;x++)E[x]=~I.g[x];return new o(E,~I.h).add(y)}t.abs=function(){return R(this)?j(this):this},t.add=function(I){for(var _=Math.max(this.g.length,I.g.length),E=[],x=0,A=0;A<=_;A++){var b=x+(this.i(A)&65535)+(I.i(A)&65535),C=(b>>>16)+(this.i(A)>>>16)+(I.i(A)>>>16);x=C>>>16,b&=65535,C&=65535,E[A]=C<<16|b}return new o(E,E[E.length-1]&-2147483648?-1:0)};function S(I,_){return I.add(j(_))}t.j=function(I){if(T(this)||T(I))return m;if(R(this))return R(I)?j(this).j(j(I)):j(j(this).j(I));if(R(I))return j(this.j(j(I)));if(0>this.l(k)&&0>I.l(k))return h(this.m()*I.m());for(var _=this.g.length+I.g.length,E=[],x=0;x<2*_;x++)E[x]=0;for(x=0;x<this.g.length;x++)for(var A=0;A<I.g.length;A++){var b=this.i(x)>>>16,C=this.i(x)&65535,Tt=I.i(A)>>>16,xr=I.i(A)&65535;E[2*x+2*A]+=C*xr,v(E,2*x+2*A),E[2*x+2*A+1]+=b*xr,v(E,2*x+2*A+1),E[2*x+2*A+1]+=C*Tt,v(E,2*x+2*A+1),E[2*x+2*A+2]+=b*Tt,v(E,2*x+2*A+2)}for(x=0;x<_;x++)E[x]=E[2*x+1]<<16|E[2*x];for(x=_;x<2*_;x++)E[x]=0;return new o(E,0)};function v(I,_){for(;(I[_]&65535)!=I[_];)I[_+1]+=I[_]>>>16,I[_]&=65535,_++}function w(I,_){this.g=I,this.h=_}function P(I,_){if(T(_))throw Error("division by zero");if(T(I))return new w(m,m);if(R(I))return _=P(j(I),_),new w(j(_.g),j(_.h));if(R(_))return _=P(I,j(_)),new w(j(_.g),_.h);if(30<I.g.length){if(R(I)||R(_))throw Error("slowDivide_ only works with positive integers.");for(var E=y,x=_;0>=x.l(I);)E=L(E),x=L(x);var A=F(E,1),b=F(x,1);for(x=F(x,2),E=F(E,2);!T(x);){var C=b.add(x);0>=C.l(I)&&(A=A.add(E),b=C),x=F(x,1),E=F(E,1)}return _=S(I,A.j(_)),new w(A,_)}for(A=m;0<=I.l(_);){for(E=Math.max(1,Math.floor(I.m()/_.m())),x=Math.ceil(Math.log(E)/Math.LN2),x=48>=x?1:Math.pow(2,x-48),b=h(E),C=b.j(_);R(C)||0<C.l(I);)E-=x,b=h(E),C=b.j(_);T(b)&&(b=y),A=A.add(b),I=S(I,C)}return new w(A,I)}t.A=function(I){return P(this,I).h},t.and=function(I){for(var _=Math.max(this.g.length,I.g.length),E=[],x=0;x<_;x++)E[x]=this.i(x)&I.i(x);return new o(E,this.h&I.h)},t.or=function(I){for(var _=Math.max(this.g.length,I.g.length),E=[],x=0;x<_;x++)E[x]=this.i(x)|I.i(x);return new o(E,this.h|I.h)},t.xor=function(I){for(var _=Math.max(this.g.length,I.g.length),E=[],x=0;x<_;x++)E[x]=this.i(x)^I.i(x);return new o(E,this.h^I.h)};function L(I){for(var _=I.g.length+1,E=[],x=0;x<_;x++)E[x]=I.i(x)<<1|I.i(x-1)>>>31;return new o(E,I.h)}function F(I,_){var E=_>>5;_%=32;for(var x=I.g.length-E,A=[],b=0;b<x;b++)A[b]=0<_?I.i(b+E)>>>_|I.i(b+E+1)<<32-_:I.i(b+E);return new o(A,I.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,aw=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=p,Or=o}).apply(typeof ny<"u"?ny:typeof self<"u"?self:typeof window<"u"?window:{});var Da=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var lw,Ui,uw,el,Bd,cw,dw,hw;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,d,f){return a==Array.prototype||a==Object.prototype||(a[d]=f.value),a};function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Da=="object"&&Da];for(var d=0;d<a.length;++d){var f=a[d];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var r=n(this);function s(a,d){if(d)e:{var f=r;a=a.split(".");for(var g=0;g<a.length-1;g++){var N=a[g];if(!(N in f))break e;f=f[N]}a=a[a.length-1],g=f[a],d=d(g),d!=g&&d!=null&&e(f,a,{configurable:!0,writable:!0,value:d})}}function i(a,d){a instanceof String&&(a+="");var f=0,g=!1,N={next:function(){if(!g&&f<a.length){var D=f++;return{value:d(D,a[D]),done:!1}}return g=!0,{done:!0,value:void 0}}};return N[Symbol.iterator]=function(){return N},N}s("Array.prototype.values",function(a){return a||function(){return i(this,function(d,f){return f})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function u(a){var d=typeof a;return d=d!="object"?d:a?Array.isArray(a)?"array":d:"null",d=="array"||d=="object"&&typeof a.length=="number"}function h(a){var d=typeof a;return d=="object"&&a!=null||d=="function"}function p(a,d,f){return a.call.apply(a.bind,arguments)}function m(a,d,f){if(!a)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var N=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(N,g),a.apply(d,N)}}return function(){return a.apply(d,arguments)}}function y(a,d,f){return y=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?p:m,y.apply(null,arguments)}function k(a,d){var f=Array.prototype.slice.call(arguments,1);return function(){var g=f.slice();return g.push.apply(g,arguments),a.apply(this,g)}}function T(a,d){function f(){}f.prototype=d.prototype,a.aa=d.prototype,a.prototype=new f,a.prototype.constructor=a,a.Qb=function(g,N,D){for(var z=Array(arguments.length-2),ce=2;ce<arguments.length;ce++)z[ce-2]=arguments[ce];return d.prototype[N].apply(g,z)}}function R(a){const d=a.length;if(0<d){const f=Array(d);for(let g=0;g<d;g++)f[g]=a[g];return f}return[]}function j(a,d){for(let f=1;f<arguments.length;f++){const g=arguments[f];if(u(g)){const N=a.length||0,D=g.length||0;a.length=N+D;for(let z=0;z<D;z++)a[N+z]=g[z]}else a.push(g)}}class S{constructor(d,f){this.i=d,this.j=f,this.h=0,this.g=null}get(){let d;return 0<this.h?(this.h--,d=this.g,this.g=d.next,d.next=null):d=this.i(),d}}function v(a){return/^[\s\xa0]*$/.test(a)}function w(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function P(a){return P[" "](a),a}P[" "]=function(){};var L=w().indexOf("Gecko")!=-1&&!(w().toLowerCase().indexOf("webkit")!=-1&&w().indexOf("Edge")==-1)&&!(w().indexOf("Trident")!=-1||w().indexOf("MSIE")!=-1)&&w().indexOf("Edge")==-1;function F(a,d,f){for(const g in a)d.call(f,a[g],g,a)}function I(a,d){for(const f in a)d.call(void 0,a[f],f,a)}function _(a){const d={};for(const f in a)d[f]=a[f];return d}const E="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function x(a,d){let f,g;for(let N=1;N<arguments.length;N++){g=arguments[N];for(f in g)a[f]=g[f];for(let D=0;D<E.length;D++)f=E[D],Object.prototype.hasOwnProperty.call(g,f)&&(a[f]=g[f])}}function A(a){var d=1;a=a.split(":");const f=[];for(;0<d&&a.length;)f.push(a.shift()),d--;return a.length&&f.push(a.join(":")),f}function b(a){l.setTimeout(()=>{throw a},0)}function C(){var a=Q;let d=null;return a.g&&(d=a.g,a.g=a.g.next,a.g||(a.h=null),d.next=null),d}class Tt{constructor(){this.h=this.g=null}add(d,f){const g=xr.get();g.set(d,f),this.h?this.h.next=g:this.g=g,this.h=g}}var xr=new S(()=>new ui,a=>a.reset());class ui{constructor(){this.next=this.g=this.h=null}set(d,f){this.h=d,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let rn,B=!1,Q=new Tt,J=()=>{const a=l.Promise.resolve(void 0);rn=()=>{a.then(ye)}};var ye=()=>{for(var a;a=C();){try{a.h.call(a.g)}catch(f){b(f)}var d=xr;d.j(a),100>d.h&&(d.h++,a.next=d.g,d.g=a)}B=!1};function ue(){this.s=this.s,this.C=this.C}ue.prototype.s=!1,ue.prototype.ma=function(){this.s||(this.s=!0,this.N())},ue.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Ie(a,d){this.type=a,this.g=this.target=d,this.defaultPrevented=!1}Ie.prototype.h=function(){this.defaultPrevented=!0};var sn=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,d=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const f=()=>{};l.addEventListener("test",f,d),l.removeEventListener("test",f,d)}catch{}return a}();function on(a,d){if(Ie.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var f=this.type=a.type,g=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=d,d=a.relatedTarget){if(L){e:{try{P(d.nodeName);var N=!0;break e}catch{}N=!1}N||(d=null)}}else f=="mouseover"?d=a.fromElement:f=="mouseout"&&(d=a.toElement);this.relatedTarget=d,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:an[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&on.aa.h.call(this)}}T(on,Ie);var an={2:"touch",3:"pen",4:"mouse"};on.prototype.h=function(){on.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var ln="closure_listenable_"+(1e6*Math.random()|0),Ux=0;function zx(a,d,f,g,N){this.listener=a,this.proxy=null,this.src=d,this.type=f,this.capture=!!g,this.ha=N,this.key=++Ux,this.da=this.fa=!1}function Jo(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Zo(a){this.src=a,this.g={},this.h=0}Zo.prototype.add=function(a,d,f,g,N){var D=a.toString();a=this.g[D],a||(a=this.g[D]=[],this.h++);var z=bu(a,d,g,N);return-1<z?(d=a[z],f||(d.fa=!1)):(d=new zx(d,this.src,D,!!g,N),d.fa=f,a.push(d)),d};function Ru(a,d){var f=d.type;if(f in a.g){var g=a.g[f],N=Array.prototype.indexOf.call(g,d,void 0),D;(D=0<=N)&&Array.prototype.splice.call(g,N,1),D&&(Jo(d),a.g[f].length==0&&(delete a.g[f],a.h--))}}function bu(a,d,f,g){for(var N=0;N<a.length;++N){var D=a[N];if(!D.da&&D.listener==d&&D.capture==!!f&&D.ha==g)return N}return-1}var Nu="closure_lm_"+(1e6*Math.random()|0),Pu={};function up(a,d,f,g,N){if(Array.isArray(d)){for(var D=0;D<d.length;D++)up(a,d[D],f,g,N);return null}return f=hp(f),a&&a[ln]?a.K(d,f,h(g)?!!g.capture:!1,N):Bx(a,d,f,!1,g,N)}function Bx(a,d,f,g,N,D){if(!d)throw Error("Invalid event type");var z=h(N)?!!N.capture:!!N,ce=Du(a);if(ce||(a[Nu]=ce=new Zo(a)),f=ce.add(d,f,g,z,D),f.proxy)return f;if(g=$x(),f.proxy=g,g.src=a,g.listener=f,a.addEventListener)sn||(N=z),N===void 0&&(N=!1),a.addEventListener(d.toString(),g,N);else if(a.attachEvent)a.attachEvent(dp(d.toString()),g);else if(a.addListener&&a.removeListener)a.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return f}function $x(){function a(f){return d.call(a.src,a.listener,f)}const d=qx;return a}function cp(a,d,f,g,N){if(Array.isArray(d))for(var D=0;D<d.length;D++)cp(a,d[D],f,g,N);else g=h(g)?!!g.capture:!!g,f=hp(f),a&&a[ln]?(a=a.i,d=String(d).toString(),d in a.g&&(D=a.g[d],f=bu(D,f,g,N),-1<f&&(Jo(D[f]),Array.prototype.splice.call(D,f,1),D.length==0&&(delete a.g[d],a.h--)))):a&&(a=Du(a))&&(d=a.g[d.toString()],a=-1,d&&(a=bu(d,f,g,N)),(f=-1<a?d[a]:null)&&ju(f))}function ju(a){if(typeof a!="number"&&a&&!a.da){var d=a.src;if(d&&d[ln])Ru(d.i,a);else{var f=a.type,g=a.proxy;d.removeEventListener?d.removeEventListener(f,g,a.capture):d.detachEvent?d.detachEvent(dp(f),g):d.addListener&&d.removeListener&&d.removeListener(g),(f=Du(d))?(Ru(f,a),f.h==0&&(f.src=null,d[Nu]=null)):Jo(a)}}}function dp(a){return a in Pu?Pu[a]:Pu[a]="on"+a}function qx(a,d){if(a.da)a=!0;else{d=new on(d,this);var f=a.listener,g=a.ha||a.src;a.fa&&ju(a),a=f.call(g,d)}return a}function Du(a){return a=a[Nu],a instanceof Zo?a:null}var Ou="__closure_events_fn_"+(1e9*Math.random()>>>0);function hp(a){return typeof a=="function"?a:(a[Ou]||(a[Ou]=function(d){return a.handleEvent(d)}),a[Ou])}function He(){ue.call(this),this.i=new Zo(this),this.M=this,this.F=null}T(He,ue),He.prototype[ln]=!0,He.prototype.removeEventListener=function(a,d,f,g){cp(this,a,d,f,g)};function st(a,d){var f,g=a.F;if(g)for(f=[];g;g=g.F)f.push(g);if(a=a.M,g=d.type||d,typeof d=="string")d=new Ie(d,a);else if(d instanceof Ie)d.target=d.target||a;else{var N=d;d=new Ie(g,a),x(d,N)}if(N=!0,f)for(var D=f.length-1;0<=D;D--){var z=d.g=f[D];N=ea(z,g,!0,d)&&N}if(z=d.g=a,N=ea(z,g,!0,d)&&N,N=ea(z,g,!1,d)&&N,f)for(D=0;D<f.length;D++)z=d.g=f[D],N=ea(z,g,!1,d)&&N}He.prototype.N=function(){if(He.aa.N.call(this),this.i){var a=this.i,d;for(d in a.g){for(var f=a.g[d],g=0;g<f.length;g++)Jo(f[g]);delete a.g[d],a.h--}}this.F=null},He.prototype.K=function(a,d,f,g){return this.i.add(String(a),d,!1,f,g)},He.prototype.L=function(a,d,f,g){return this.i.add(String(a),d,!0,f,g)};function ea(a,d,f,g){if(d=a.i.g[String(d)],!d)return!0;d=d.concat();for(var N=!0,D=0;D<d.length;++D){var z=d[D];if(z&&!z.da&&z.capture==f){var ce=z.listener,Le=z.ha||z.src;z.fa&&Ru(a.i,z),N=ce.call(Le,g)!==!1&&N}}return N&&!g.defaultPrevented}function fp(a,d,f){if(typeof a=="function")f&&(a=y(a,f));else if(a&&typeof a.handleEvent=="function")a=y(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(d)?-1:l.setTimeout(a,d||0)}function pp(a){a.g=fp(()=>{a.g=null,a.i&&(a.i=!1,pp(a))},a.l);const d=a.h;a.h=null,a.m.apply(null,d)}class Wx extends ue{constructor(d,f){super(),this.m=d,this.l=f,this.h=null,this.i=!1,this.g=null}j(d){this.h=arguments,this.g?this.i=!0:pp(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ci(a){ue.call(this),this.h=a,this.g={}}T(ci,ue);var mp=[];function gp(a){F(a.g,function(d,f){this.g.hasOwnProperty(f)&&ju(d)},a),a.g={}}ci.prototype.N=function(){ci.aa.N.call(this),gp(this)},ci.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Vu=l.JSON.stringify,Hx=l.JSON.parse,Kx=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function Lu(){}Lu.prototype.h=null;function yp(a){return a.h||(a.h=a.i())}function vp(){}var di={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Mu(){Ie.call(this,"d")}T(Mu,Ie);function Fu(){Ie.call(this,"c")}T(Fu,Ie);var Er={},_p=null;function ta(){return _p=_p||new He}Er.La="serverreachability";function wp(a){Ie.call(this,Er.La,a)}T(wp,Ie);function hi(a){const d=ta();st(d,new wp(d))}Er.STAT_EVENT="statevent";function xp(a,d){Ie.call(this,Er.STAT_EVENT,a),this.stat=d}T(xp,Ie);function it(a){const d=ta();st(d,new xp(d,a))}Er.Ma="timingevent";function Ep(a,d){Ie.call(this,Er.Ma,a),this.size=d}T(Ep,Ie);function fi(a,d){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},d)}function pi(){this.g=!0}pi.prototype.xa=function(){this.g=!1};function Gx(a,d,f,g,N,D){a.info(function(){if(a.g)if(D)for(var z="",ce=D.split("&"),Le=0;Le<ce.length;Le++){var ie=ce[Le].split("=");if(1<ie.length){var Ke=ie[0];ie=ie[1];var Ge=Ke.split("_");z=2<=Ge.length&&Ge[1]=="type"?z+(Ke+"="+ie+"&"):z+(Ke+"=redacted&")}}else z=null;else z=D;return"XMLHTTP REQ ("+g+") [attempt "+N+"]: "+d+`
`+f+`
`+z})}function Qx(a,d,f,g,N,D,z){a.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+N+"]: "+d+`
`+f+`
`+D+" "+z})}function es(a,d,f,g){a.info(function(){return"XMLHTTP TEXT ("+d+"): "+Xx(a,f)+(g?" "+g:"")})}function Yx(a,d){a.info(function(){return"TIMEOUT: "+d})}pi.prototype.info=function(){};function Xx(a,d){if(!a.g)return d;if(!d)return null;try{var f=JSON.parse(d);if(f){for(a=0;a<f.length;a++)if(Array.isArray(f[a])){var g=f[a];if(!(2>g.length)){var N=g[1];if(Array.isArray(N)&&!(1>N.length)){var D=N[0];if(D!="noop"&&D!="stop"&&D!="close")for(var z=1;z<N.length;z++)N[z]=""}}}}return Vu(f)}catch{return d}}var na={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Tp={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Uu;function ra(){}T(ra,Lu),ra.prototype.g=function(){return new XMLHttpRequest},ra.prototype.i=function(){return{}},Uu=new ra;function Pn(a,d,f,g){this.j=a,this.i=d,this.l=f,this.R=g||1,this.U=new ci(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Ip}function Ip(){this.i=null,this.g="",this.h=!1}var Sp={},zu={};function Bu(a,d,f){a.L=1,a.v=aa(un(d)),a.m=f,a.P=!0,kp(a,null)}function kp(a,d){a.F=Date.now(),sa(a),a.A=un(a.v);var f=a.A,g=a.R;Array.isArray(g)||(g=[String(g)]),Up(f.i,"t",g),a.C=0,f=a.j.J,a.h=new Ip,a.g=sm(a.j,f?d:null,!a.m),0<a.O&&(a.M=new Wx(y(a.Y,a,a.g),a.O)),d=a.U,f=a.g,g=a.ca;var N="readystatechange";Array.isArray(N)||(N&&(mp[0]=N.toString()),N=mp);for(var D=0;D<N.length;D++){var z=up(f,N[D],g||d.handleEvent,!1,d.h||d);if(!z)break;d.g[z.key]=z}d=a.H?_(a.H):{},a.m?(a.u||(a.u="POST"),d["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,d)):(a.u="GET",a.g.ea(a.A,a.u,null,d)),hi(),Gx(a.i,a.u,a.A,a.l,a.R,a.m)}Pn.prototype.ca=function(a){a=a.target;const d=this.M;d&&cn(a)==3?d.j():this.Y(a)},Pn.prototype.Y=function(a){try{if(a==this.g)e:{const Ge=cn(this.g);var d=this.g.Ba();const rs=this.g.Z();if(!(3>Ge)&&(Ge!=3||this.g&&(this.h.h||this.g.oa()||Kp(this.g)))){this.J||Ge!=4||d==7||(d==8||0>=rs?hi(3):hi(2)),$u(this);var f=this.g.Z();this.X=f;t:if(Cp(this)){var g=Kp(this.g);a="";var N=g.length,D=cn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Tr(this),mi(this);var z="";break t}this.h.i=new l.TextDecoder}for(d=0;d<N;d++)this.h.h=!0,a+=this.h.i.decode(g[d],{stream:!(D&&d==N-1)});g.length=0,this.h.g+=a,this.C=0,z=this.h.g}else z=this.g.oa();if(this.o=f==200,Qx(this.i,this.u,this.A,this.l,this.R,Ge,f),this.o){if(this.T&&!this.K){t:{if(this.g){var ce,Le=this.g;if((ce=Le.g?Le.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!v(ce)){var ie=ce;break t}}ie=null}if(f=ie)es(this.i,this.l,f,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,qu(this,f);else{this.o=!1,this.s=3,it(12),Tr(this),mi(this);break e}}if(this.P){f=!0;let Nt;for(;!this.J&&this.C<z.length;)if(Nt=Jx(this,z),Nt==zu){Ge==4&&(this.s=4,it(14),f=!1),es(this.i,this.l,null,"[Incomplete Response]");break}else if(Nt==Sp){this.s=4,it(15),es(this.i,this.l,z,"[Invalid Chunk]"),f=!1;break}else es(this.i,this.l,Nt,null),qu(this,Nt);if(Cp(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ge!=4||z.length!=0||this.h.h||(this.s=1,it(16),f=!1),this.o=this.o&&f,!f)es(this.i,this.l,z,"[Invalid Chunked Response]"),Tr(this),mi(this);else if(0<z.length&&!this.W){this.W=!0;var Ke=this.j;Ke.g==this&&Ke.ba&&!Ke.M&&(Ke.j.info("Great, no buffering proxy detected. Bytes received: "+z.length),Yu(Ke),Ke.M=!0,it(11))}}else es(this.i,this.l,z,null),qu(this,z);Ge==4&&Tr(this),this.o&&!this.J&&(Ge==4?em(this.j,this):(this.o=!1,sa(this)))}else mE(this.g),f==400&&0<z.indexOf("Unknown SID")?(this.s=3,it(12)):(this.s=0,it(13)),Tr(this),mi(this)}}}catch{}finally{}};function Cp(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function Jx(a,d){var f=a.C,g=d.indexOf(`
`,f);return g==-1?zu:(f=Number(d.substring(f,g)),isNaN(f)?Sp:(g+=1,g+f>d.length?zu:(d=d.slice(g,g+f),a.C=g+f,d)))}Pn.prototype.cancel=function(){this.J=!0,Tr(this)};function sa(a){a.S=Date.now()+a.I,Ap(a,a.I)}function Ap(a,d){if(a.B!=null)throw Error("WatchDog timer not null");a.B=fi(y(a.ba,a),d)}function $u(a){a.B&&(l.clearTimeout(a.B),a.B=null)}Pn.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(Yx(this.i,this.A),this.L!=2&&(hi(),it(17)),Tr(this),this.s=2,mi(this)):Ap(this,this.S-a)};function mi(a){a.j.G==0||a.J||em(a.j,a)}function Tr(a){$u(a);var d=a.M;d&&typeof d.ma=="function"&&d.ma(),a.M=null,gp(a.U),a.g&&(d=a.g,a.g=null,d.abort(),d.ma())}function qu(a,d){try{var f=a.j;if(f.G!=0&&(f.g==a||Wu(f.h,a))){if(!a.K&&Wu(f.h,a)&&f.G==3){try{var g=f.Da.g.parse(d)}catch{g=null}if(Array.isArray(g)&&g.length==3){var N=g;if(N[0]==0){e:if(!f.u){if(f.g)if(f.g.F+3e3<a.F)fa(f),da(f);else break e;Qu(f),it(18)}}else f.za=N[1],0<f.za-f.T&&37500>N[2]&&f.F&&f.v==0&&!f.C&&(f.C=fi(y(f.Za,f),6e3));if(1>=Np(f.h)&&f.ca){try{f.ca()}catch{}f.ca=void 0}}else Sr(f,11)}else if((a.K||f.g==a)&&fa(f),!v(d))for(N=f.Da.g.parse(d),d=0;d<N.length;d++){let ie=N[d];if(f.T=ie[0],ie=ie[1],f.G==2)if(ie[0]=="c"){f.K=ie[1],f.ia=ie[2];const Ke=ie[3];Ke!=null&&(f.la=Ke,f.j.info("VER="+f.la));const Ge=ie[4];Ge!=null&&(f.Aa=Ge,f.j.info("SVER="+f.Aa));const rs=ie[5];rs!=null&&typeof rs=="number"&&0<rs&&(g=1.5*rs,f.L=g,f.j.info("backChannelRequestTimeoutMs_="+g)),g=f;const Nt=a.g;if(Nt){const ma=Nt.g?Nt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ma){var D=g.h;D.g||ma.indexOf("spdy")==-1&&ma.indexOf("quic")==-1&&ma.indexOf("h2")==-1||(D.j=D.l,D.g=new Set,D.h&&(Hu(D,D.h),D.h=null))}if(g.D){const Xu=Nt.g?Nt.g.getResponseHeader("X-HTTP-Session-Id"):null;Xu&&(g.ya=Xu,he(g.I,g.D,Xu))}}f.G=3,f.l&&f.l.ua(),f.ba&&(f.R=Date.now()-a.F,f.j.info("Handshake RTT: "+f.R+"ms")),g=f;var z=a;if(g.qa=rm(g,g.J?g.ia:null,g.W),z.K){Pp(g.h,z);var ce=z,Le=g.L;Le&&(ce.I=Le),ce.B&&($u(ce),sa(ce)),g.g=z}else Jp(g);0<f.i.length&&ha(f)}else ie[0]!="stop"&&ie[0]!="close"||Sr(f,7);else f.G==3&&(ie[0]=="stop"||ie[0]=="close"?ie[0]=="stop"?Sr(f,7):Gu(f):ie[0]!="noop"&&f.l&&f.l.ta(ie),f.v=0)}}hi(4)}catch{}}var Zx=class{constructor(a,d){this.g=a,this.map=d}};function Rp(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function bp(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Np(a){return a.h?1:a.g?a.g.size:0}function Wu(a,d){return a.h?a.h==d:a.g?a.g.has(d):!1}function Hu(a,d){a.g?a.g.add(d):a.h=d}function Pp(a,d){a.h&&a.h==d?a.h=null:a.g&&a.g.has(d)&&a.g.delete(d)}Rp.prototype.cancel=function(){if(this.i=jp(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function jp(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let d=a.i;for(const f of a.g.values())d=d.concat(f.D);return d}return R(a.i)}function eE(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(u(a)){for(var d=[],f=a.length,g=0;g<f;g++)d.push(a[g]);return d}d=[],f=0;for(g in a)d[f++]=a[g];return d}function tE(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(u(a)||typeof a=="string"){var d=[];a=a.length;for(var f=0;f<a;f++)d.push(f);return d}d=[],f=0;for(const g in a)d[f++]=g;return d}}}function Dp(a,d){if(a.forEach&&typeof a.forEach=="function")a.forEach(d,void 0);else if(u(a)||typeof a=="string")Array.prototype.forEach.call(a,d,void 0);else for(var f=tE(a),g=eE(a),N=g.length,D=0;D<N;D++)d.call(void 0,g[D],f&&f[D],a)}var Op=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function nE(a,d){if(a){a=a.split("&");for(var f=0;f<a.length;f++){var g=a[f].indexOf("="),N=null;if(0<=g){var D=a[f].substring(0,g);N=a[f].substring(g+1)}else D=a[f];d(D,N?decodeURIComponent(N.replace(/\+/g," ")):"")}}}function Ir(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof Ir){this.h=a.h,ia(this,a.j),this.o=a.o,this.g=a.g,oa(this,a.s),this.l=a.l;var d=a.i,f=new vi;f.i=d.i,d.g&&(f.g=new Map(d.g),f.h=d.h),Vp(this,f),this.m=a.m}else a&&(d=String(a).match(Op))?(this.h=!1,ia(this,d[1]||"",!0),this.o=gi(d[2]||""),this.g=gi(d[3]||"",!0),oa(this,d[4]),this.l=gi(d[5]||"",!0),Vp(this,d[6]||"",!0),this.m=gi(d[7]||"")):(this.h=!1,this.i=new vi(null,this.h))}Ir.prototype.toString=function(){var a=[],d=this.j;d&&a.push(yi(d,Lp,!0),":");var f=this.g;return(f||d=="file")&&(a.push("//"),(d=this.o)&&a.push(yi(d,Lp,!0),"@"),a.push(encodeURIComponent(String(f)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.s,f!=null&&a.push(":",String(f))),(f=this.l)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push(yi(f,f.charAt(0)=="/"?iE:sE,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",yi(f,aE)),a.join("")};function un(a){return new Ir(a)}function ia(a,d,f){a.j=f?gi(d,!0):d,a.j&&(a.j=a.j.replace(/:$/,""))}function oa(a,d){if(d){if(d=Number(d),isNaN(d)||0>d)throw Error("Bad port number "+d);a.s=d}else a.s=null}function Vp(a,d,f){d instanceof vi?(a.i=d,lE(a.i,a.h)):(f||(d=yi(d,oE)),a.i=new vi(d,a.h))}function he(a,d,f){a.i.set(d,f)}function aa(a){return he(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function gi(a,d){return a?d?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function yi(a,d,f){return typeof a=="string"?(a=encodeURI(a).replace(d,rE),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function rE(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Lp=/[#\/\?@]/g,sE=/[#\?:]/g,iE=/[#\?]/g,oE=/[#\?@]/g,aE=/#/g;function vi(a,d){this.h=this.g=null,this.i=a||null,this.j=!!d}function jn(a){a.g||(a.g=new Map,a.h=0,a.i&&nE(a.i,function(d,f){a.add(decodeURIComponent(d.replace(/\+/g," ")),f)}))}t=vi.prototype,t.add=function(a,d){jn(this),this.i=null,a=ts(this,a);var f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(d),this.h+=1,this};function Mp(a,d){jn(a),d=ts(a,d),a.g.has(d)&&(a.i=null,a.h-=a.g.get(d).length,a.g.delete(d))}function Fp(a,d){return jn(a),d=ts(a,d),a.g.has(d)}t.forEach=function(a,d){jn(this),this.g.forEach(function(f,g){f.forEach(function(N){a.call(d,N,g,this)},this)},this)},t.na=function(){jn(this);const a=Array.from(this.g.values()),d=Array.from(this.g.keys()),f=[];for(let g=0;g<d.length;g++){const N=a[g];for(let D=0;D<N.length;D++)f.push(d[g])}return f},t.V=function(a){jn(this);let d=[];if(typeof a=="string")Fp(this,a)&&(d=d.concat(this.g.get(ts(this,a))));else{a=Array.from(this.g.values());for(let f=0;f<a.length;f++)d=d.concat(a[f])}return d},t.set=function(a,d){return jn(this),this.i=null,a=ts(this,a),Fp(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[d]),this.h+=1,this},t.get=function(a,d){return a?(a=this.V(a),0<a.length?String(a[0]):d):d};function Up(a,d,f){Mp(a,d),0<f.length&&(a.i=null,a.g.set(ts(a,d),R(f)),a.h+=f.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],d=Array.from(this.g.keys());for(var f=0;f<d.length;f++){var g=d[f];const D=encodeURIComponent(String(g)),z=this.V(g);for(g=0;g<z.length;g++){var N=D;z[g]!==""&&(N+="="+encodeURIComponent(String(z[g]))),a.push(N)}}return this.i=a.join("&")};function ts(a,d){return d=String(d),a.j&&(d=d.toLowerCase()),d}function lE(a,d){d&&!a.j&&(jn(a),a.i=null,a.g.forEach(function(f,g){var N=g.toLowerCase();g!=N&&(Mp(this,g),Up(this,N,f))},a)),a.j=d}function uE(a,d){const f=new pi;if(l.Image){const g=new Image;g.onload=k(Dn,f,"TestLoadImage: loaded",!0,d,g),g.onerror=k(Dn,f,"TestLoadImage: error",!1,d,g),g.onabort=k(Dn,f,"TestLoadImage: abort",!1,d,g),g.ontimeout=k(Dn,f,"TestLoadImage: timeout",!1,d,g),l.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=a}else d(!1)}function cE(a,d){const f=new pi,g=new AbortController,N=setTimeout(()=>{g.abort(),Dn(f,"TestPingServer: timeout",!1,d)},1e4);fetch(a,{signal:g.signal}).then(D=>{clearTimeout(N),D.ok?Dn(f,"TestPingServer: ok",!0,d):Dn(f,"TestPingServer: server error",!1,d)}).catch(()=>{clearTimeout(N),Dn(f,"TestPingServer: error",!1,d)})}function Dn(a,d,f,g,N){try{N&&(N.onload=null,N.onerror=null,N.onabort=null,N.ontimeout=null),g(f)}catch{}}function dE(){this.g=new Kx}function hE(a,d,f){const g=f||"";try{Dp(a,function(N,D){let z=N;h(N)&&(z=Vu(N)),d.push(g+D+"="+encodeURIComponent(z))})}catch(N){throw d.push(g+"type="+encodeURIComponent("_badmap")),N}}function la(a){this.l=a.Ub||null,this.j=a.eb||!1}T(la,Lu),la.prototype.g=function(){return new ua(this.l,this.j)},la.prototype.i=function(a){return function(){return a}}({});function ua(a,d){He.call(this),this.D=a,this.o=d,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}T(ua,He),t=ua.prototype,t.open=function(a,d){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=d,this.readyState=1,wi(this)},t.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const d={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(d.body=a),(this.D||l).fetch(new Request(this.A,d)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,_i(this)),this.readyState=0},t.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,wi(this)),this.g&&(this.readyState=3,wi(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;zp(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function zp(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}t.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var d=a.value?a.value:new Uint8Array(0);(d=this.v.decode(d,{stream:!a.done}))&&(this.response=this.responseText+=d)}a.done?_i(this):wi(this),this.readyState==3&&zp(this)}},t.Ra=function(a){this.g&&(this.response=this.responseText=a,_i(this))},t.Qa=function(a){this.g&&(this.response=a,_i(this))},t.ga=function(){this.g&&_i(this)};function _i(a){a.readyState=4,a.l=null,a.j=null,a.v=null,wi(a)}t.setRequestHeader=function(a,d){this.u.append(a,d)},t.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],d=this.h.entries();for(var f=d.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=d.next();return a.join(`\r
`)};function wi(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(ua.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Bp(a){let d="";return F(a,function(f,g){d+=g,d+=":",d+=f,d+=`\r
`}),d}function Ku(a,d,f){e:{for(g in f){var g=!1;break e}g=!0}g||(f=Bp(f),typeof a=="string"?f!=null&&encodeURIComponent(String(f)):he(a,d,f))}function Ee(a){He.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}T(Ee,He);var fE=/^https?$/i,pE=["POST","PUT"];t=Ee.prototype,t.Ha=function(a){this.J=a},t.ea=function(a,d,f,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);d=d?d.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Uu.g(),this.v=this.o?yp(this.o):yp(Uu),this.g.onreadystatechange=y(this.Ea,this);try{this.B=!0,this.g.open(d,String(a),!0),this.B=!1}catch(D){$p(this,D);return}if(a=f||"",f=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var N in g)f.set(N,g[N]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const D of g.keys())f.set(D,g.get(D));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(f.keys()).find(D=>D.toLowerCase()=="content-type"),N=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(pE,d,void 0))||g||N||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[D,z]of f)this.g.setRequestHeader(D,z);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Hp(this),this.u=!0,this.g.send(a),this.u=!1}catch(D){$p(this,D)}};function $p(a,d){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=d,a.m=5,qp(a),ca(a)}function qp(a){a.A||(a.A=!0,st(a,"complete"),st(a,"error"))}t.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,st(this,"complete"),st(this,"abort"),ca(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ca(this,!0)),Ee.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?Wp(this):this.bb())},t.bb=function(){Wp(this)};function Wp(a){if(a.h&&typeof o<"u"&&(!a.v[1]||cn(a)!=4||a.Z()!=2)){if(a.u&&cn(a)==4)fp(a.Ea,0,a);else if(st(a,"readystatechange"),cn(a)==4){a.h=!1;try{const z=a.Z();e:switch(z){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var d=!0;break e;default:d=!1}var f;if(!(f=d)){var g;if(g=z===0){var N=String(a.D).match(Op)[1]||null;!N&&l.self&&l.self.location&&(N=l.self.location.protocol.slice(0,-1)),g=!fE.test(N?N.toLowerCase():"")}f=g}if(f)st(a,"complete"),st(a,"success");else{a.m=6;try{var D=2<cn(a)?a.g.statusText:""}catch{D=""}a.l=D+" ["+a.Z()+"]",qp(a)}}finally{ca(a)}}}}function ca(a,d){if(a.g){Hp(a);const f=a.g,g=a.v[0]?()=>{}:null;a.g=null,a.v=null,d||st(a,"ready");try{f.onreadystatechange=g}catch{}}}function Hp(a){a.I&&(l.clearTimeout(a.I),a.I=null)}t.isActive=function(){return!!this.g};function cn(a){return a.g?a.g.readyState:0}t.Z=function(){try{return 2<cn(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(a){if(this.g){var d=this.g.responseText;return a&&d.indexOf(a)==0&&(d=d.substring(a.length)),Hx(d)}};function Kp(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function mE(a){const d={};a=(a.g&&2<=cn(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<a.length;g++){if(v(a[g]))continue;var f=A(a[g]);const N=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const D=d[N]||[];d[N]=D,D.push(f)}I(d,function(g){return g.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function xi(a,d,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||d}function Gp(a){this.Aa=0,this.i=[],this.j=new pi,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=xi("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=xi("baseRetryDelayMs",5e3,a),this.cb=xi("retryDelaySeedMs",1e4,a),this.Wa=xi("forwardChannelMaxRetries",2,a),this.wa=xi("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new Rp(a&&a.concurrentRequestLimit),this.Da=new dE,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=Gp.prototype,t.la=8,t.G=1,t.connect=function(a,d,f,g){it(0),this.W=a,this.H=d||{},f&&g!==void 0&&(this.H.OSID=f,this.H.OAID=g),this.F=this.X,this.I=rm(this,null,this.W),ha(this)};function Gu(a){if(Qp(a),a.G==3){var d=a.U++,f=un(a.I);if(he(f,"SID",a.K),he(f,"RID",d),he(f,"TYPE","terminate"),Ei(a,f),d=new Pn(a,a.j,d),d.L=2,d.v=aa(un(f)),f=!1,l.navigator&&l.navigator.sendBeacon)try{f=l.navigator.sendBeacon(d.v.toString(),"")}catch{}!f&&l.Image&&(new Image().src=d.v,f=!0),f||(d.g=sm(d.j,null),d.g.ea(d.v)),d.F=Date.now(),sa(d)}nm(a)}function da(a){a.g&&(Yu(a),a.g.cancel(),a.g=null)}function Qp(a){da(a),a.u&&(l.clearTimeout(a.u),a.u=null),fa(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function ha(a){if(!bp(a.h)&&!a.s){a.s=!0;var d=a.Ga;rn||J(),B||(rn(),B=!0),Q.add(d,a),a.B=0}}function gE(a,d){return Np(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=d.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=fi(y(a.Ga,a,d),tm(a,a.B)),a.B++,!0)}t.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const N=new Pn(this,this.j,a);let D=this.o;if(this.S&&(D?(D=_(D),x(D,this.S)):D=this.S),this.m!==null||this.O||(N.H=D,D=null),this.P)e:{for(var d=0,f=0;f<this.i.length;f++){t:{var g=this.i[f];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(d+=g,4096<d){d=f;break e}if(d===4096||f===this.i.length-1){d=f+1;break e}}d=1e3}else d=1e3;d=Xp(this,N,d),f=un(this.I),he(f,"RID",a),he(f,"CVER",22),this.D&&he(f,"X-HTTP-Session-Id",this.D),Ei(this,f),D&&(this.O?d="headers="+encodeURIComponent(String(Bp(D)))+"&"+d:this.m&&Ku(f,this.m,D)),Hu(this.h,N),this.Ua&&he(f,"TYPE","init"),this.P?(he(f,"$req",d),he(f,"SID","null"),N.T=!0,Bu(N,f,null)):Bu(N,f,d),this.G=2}}else this.G==3&&(a?Yp(this,a):this.i.length==0||bp(this.h)||Yp(this))};function Yp(a,d){var f;d?f=d.l:f=a.U++;const g=un(a.I);he(g,"SID",a.K),he(g,"RID",f),he(g,"AID",a.T),Ei(a,g),a.m&&a.o&&Ku(g,a.m,a.o),f=new Pn(a,a.j,f,a.B+1),a.m===null&&(f.H=a.o),d&&(a.i=d.D.concat(a.i)),d=Xp(a,f,1e3),f.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),Hu(a.h,f),Bu(f,g,d)}function Ei(a,d){a.H&&F(a.H,function(f,g){he(d,g,f)}),a.l&&Dp({},function(f,g){he(d,g,f)})}function Xp(a,d,f){f=Math.min(a.i.length,f);var g=a.l?y(a.l.Na,a.l,a):null;e:{var N=a.i;let D=-1;for(;;){const z=["count="+f];D==-1?0<f?(D=N[0].g,z.push("ofs="+D)):D=0:z.push("ofs="+D);let ce=!0;for(let Le=0;Le<f;Le++){let ie=N[Le].g;const Ke=N[Le].map;if(ie-=D,0>ie)D=Math.max(0,N[Le].g-100),ce=!1;else try{hE(Ke,z,"req"+ie+"_")}catch{g&&g(Ke)}}if(ce){g=z.join("&");break e}}}return a=a.i.splice(0,f),d.D=a,g}function Jp(a){if(!a.g&&!a.u){a.Y=1;var d=a.Fa;rn||J(),B||(rn(),B=!0),Q.add(d,a),a.v=0}}function Qu(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=fi(y(a.Fa,a),tm(a,a.v)),a.v++,!0)}t.Fa=function(){if(this.u=null,Zp(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=fi(y(this.ab,this),a)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,it(10),da(this),Zp(this))};function Yu(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function Zp(a){a.g=new Pn(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var d=un(a.qa);he(d,"RID","rpc"),he(d,"SID",a.K),he(d,"AID",a.T),he(d,"CI",a.F?"0":"1"),!a.F&&a.ja&&he(d,"TO",a.ja),he(d,"TYPE","xmlhttp"),Ei(a,d),a.m&&a.o&&Ku(d,a.m,a.o),a.L&&(a.g.I=a.L);var f=a.g;a=a.ia,f.L=1,f.v=aa(un(d)),f.m=null,f.P=!0,kp(f,a)}t.Za=function(){this.C!=null&&(this.C=null,da(this),Qu(this),it(19))};function fa(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function em(a,d){var f=null;if(a.g==d){fa(a),Yu(a),a.g=null;var g=2}else if(Wu(a.h,d))f=d.D,Pp(a.h,d),g=1;else return;if(a.G!=0){if(d.o)if(g==1){f=d.m?d.m.length:0,d=Date.now()-d.F;var N=a.B;g=ta(),st(g,new Ep(g,f)),ha(a)}else Jp(a);else if(N=d.s,N==3||N==0&&0<d.X||!(g==1&&gE(a,d)||g==2&&Qu(a)))switch(f&&0<f.length&&(d=a.h,d.i=d.i.concat(f)),N){case 1:Sr(a,5);break;case 4:Sr(a,10);break;case 3:Sr(a,6);break;default:Sr(a,2)}}}function tm(a,d){let f=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(f*=2),f*d}function Sr(a,d){if(a.j.info("Error code "+d),d==2){var f=y(a.fb,a),g=a.Xa;const N=!g;g=new Ir(g||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||ia(g,"https"),aa(g),N?uE(g.toString(),f):cE(g.toString(),f)}else it(2);a.G=0,a.l&&a.l.sa(d),nm(a),Qp(a)}t.fb=function(a){a?(this.j.info("Successfully pinged google.com"),it(2)):(this.j.info("Failed to ping google.com"),it(1))};function nm(a){if(a.G=0,a.ka=[],a.l){const d=jp(a.h);(d.length!=0||a.i.length!=0)&&(j(a.ka,d),j(a.ka,a.i),a.h.i.length=0,R(a.i),a.i.length=0),a.l.ra()}}function rm(a,d,f){var g=f instanceof Ir?un(f):new Ir(f);if(g.g!="")d&&(g.g=d+"."+g.g),oa(g,g.s);else{var N=l.location;g=N.protocol,d=d?d+"."+N.hostname:N.hostname,N=+N.port;var D=new Ir(null);g&&ia(D,g),d&&(D.g=d),N&&oa(D,N),f&&(D.l=f),g=D}return f=a.D,d=a.ya,f&&d&&he(g,f,d),he(g,"VER",a.la),Ei(a,g),g}function sm(a,d,f){if(d&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return d=a.Ca&&!a.pa?new Ee(new la({eb:f})):new Ee(a.pa),d.Ha(a.J),d}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function im(){}t=im.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function pa(){}pa.prototype.g=function(a,d){return new gt(a,d)};function gt(a,d){He.call(this),this.g=new Gp(d),this.l=a,this.h=d&&d.messageUrlParams||null,a=d&&d.messageHeaders||null,d&&d.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=d&&d.initMessageHeaders||null,d&&d.messageContentType&&(a?a["X-WebChannel-Content-Type"]=d.messageContentType:a={"X-WebChannel-Content-Type":d.messageContentType}),d&&d.va&&(a?a["X-WebChannel-Client-Profile"]=d.va:a={"X-WebChannel-Client-Profile":d.va}),this.g.S=a,(a=d&&d.Sb)&&!v(a)&&(this.g.m=a),this.v=d&&d.supportsCrossDomainXhr||!1,this.u=d&&d.sendRawJson||!1,(d=d&&d.httpSessionIdParam)&&!v(d)&&(this.g.D=d,a=this.h,a!==null&&d in a&&(a=this.h,d in a&&delete a[d])),this.j=new ns(this)}T(gt,He),gt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},gt.prototype.close=function(){Gu(this.g)},gt.prototype.o=function(a){var d=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.u&&(f={},f.__data__=Vu(a),a=f);d.i.push(new Zx(d.Ya++,a)),d.G==3&&ha(d)},gt.prototype.N=function(){this.g.l=null,delete this.j,Gu(this.g),delete this.g,gt.aa.N.call(this)};function om(a){Mu.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var d=a.__sm__;if(d){e:{for(const f in d){a=f;break e}a=void 0}(this.i=a)&&(a=this.i,d=d!==null&&a in d?d[a]:void 0),this.data=d}else this.data=a}T(om,Mu);function am(){Fu.call(this),this.status=1}T(am,Fu);function ns(a){this.g=a}T(ns,im),ns.prototype.ua=function(){st(this.g,"a")},ns.prototype.ta=function(a){st(this.g,new om(a))},ns.prototype.sa=function(a){st(this.g,new am)},ns.prototype.ra=function(){st(this.g,"b")},pa.prototype.createWebChannel=pa.prototype.g,gt.prototype.send=gt.prototype.o,gt.prototype.open=gt.prototype.m,gt.prototype.close=gt.prototype.close,hw=function(){return new pa},dw=function(){return ta()},cw=Er,Bd={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},na.NO_ERROR=0,na.TIMEOUT=8,na.HTTP_ERROR=6,el=na,Tp.COMPLETE="complete",uw=Tp,vp.EventType=di,di.OPEN="a",di.CLOSE="b",di.ERROR="c",di.MESSAGE="d",He.prototype.listen=He.prototype.K,Ui=vp,Ee.prototype.listenOnce=Ee.prototype.L,Ee.prototype.getLastError=Ee.prototype.Ka,Ee.prototype.getLastErrorCode=Ee.prototype.Ba,Ee.prototype.getStatus=Ee.prototype.Z,Ee.prototype.getResponseJson=Ee.prototype.Oa,Ee.prototype.getResponseText=Ee.prototype.oa,Ee.prototype.send=Ee.prototype.ea,Ee.prototype.setWithCredentials=Ee.prototype.Ha,lw=Ee}).apply(typeof Da<"u"?Da:typeof self<"u"?self:typeof window<"u"?window:{});const ry="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Je=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};Je.UNAUTHENTICATED=new Je(null),Je.GOOGLE_CREDENTIALS=new Je("google-credentials-uid"),Je.FIRST_PARTY=new Je("first-party-uid"),Je.MOCK_USER=new Je("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ni="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qr=new uf("@firebase/firestore");function Ni(){return qr.logLevel}function W(t,...e){if(qr.logLevel<=ne.DEBUG){const n=e.map(xf);qr.debug(`Firestore (${ni}): ${t}`,...n)}}function kn(t,...e){if(qr.logLevel<=ne.ERROR){const n=e.map(xf);qr.error(`Firestore (${ni}): ${t}`,...n)}}function zs(t,...e){if(qr.logLevel<=ne.WARN){const n=e.map(xf);qr.warn(`Firestore (${ni}): ${t}`,...n)}}function xf(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function G(t="Unexpected state"){const e=`FIRESTORE (${ni}) INTERNAL ASSERTION FAILED: `+t;throw kn(e),new Error(e)}function le(t,e){t||G()}function X(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class q extends bn{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ar{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fw{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class qC{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(Je.UNAUTHENTICATED))}shutdown(){}}class WC{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class HC{constructor(e){this.t=e,this.currentUser=Je.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){le(this.o===void 0);let r=this.i;const s=u=>this.i!==r?(r=this.i,n(u)):Promise.resolve();let i=new ar;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new ar,e.enqueueRetryable(()=>s(this.currentUser))};const o=()=>{const u=i;e.enqueueRetryable(async()=>{await u.promise,await s(this.currentUser)})},l=u=>{W("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>l(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?l(u):(W("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new ar)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?(W("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(le(typeof r.accessToken=="string"),new fw(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return le(e===null||typeof e=="string"),new Je(e)}}class KC{constructor(e,n,r){this.l=e,this.h=n,this.P=r,this.type="FirstParty",this.user=Je.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class GC{constructor(e,n,r){this.l=e,this.h=n,this.P=r}getToken(){return Promise.resolve(new KC(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(Je.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class QC{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class YC{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){le(this.o===void 0);const r=i=>{i.error!=null&&W("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.R;return this.R=i.token,W("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>r(i))};const s=i=>{W("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?s(i):W("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(le(typeof n.token=="string"),this.R=n.token,new QC(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function XC(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pw{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const s=XC(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<n&&(r+=e.charAt(s[i]%e.length))}return r}}function oe(t,e){return t<e?-1:t>e?1:0}function Bs(t,e,n){return t.length===e.length&&t.every((r,s)=>n(r,e[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new q(V.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new q(V.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new q(V.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new q(V.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return je.fromMillis(Date.now())}static fromDate(e){return je.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*n));return new je(n,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?oe(this.nanoseconds,e.nanoseconds):oe(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y{constructor(e){this.timestamp=e}static fromTimestamp(e){return new Y(e)}static min(){return new Y(new je(0,0))}static max(){return new Y(new je(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ko{constructor(e,n,r){n===void 0?n=0:n>e.length&&G(),r===void 0?r=e.length-n:r>e.length-n&&G(),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return ko.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof ko?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let s=0;s<r;s++){const i=e.get(s),o=n.get(s);if(i<o)return-1;if(i>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class pe extends ko{construct(e,n,r){return new pe(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new q(V.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(s=>s.length>0))}return new pe(n)}static emptyPath(){return new pe([])}}const JC=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ue extends ko{construct(e,n,r){return new Ue(e,n,r)}static isValidIdentifier(e){return JC.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ue.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Ue(["__name__"])}static fromServerFormat(e){const n=[];let r="",s=0;const i=()=>{if(r.length===0)throw new q(V.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;s<e.length;){const l=e[s];if(l==="\\"){if(s+1===e.length)throw new q(V.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new q(V.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,s+=2}else l==="`"?(o=!o,s++):l!=="."||o?(r+=l,s++):(i(),s++)}if(i(),o)throw new q(V.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ue(n)}static emptyPath(){return new Ue([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H{constructor(e){this.path=e}static fromPath(e){return new H(pe.fromString(e))}static fromName(e){return new H(pe.fromString(e).popFirst(5))}static empty(){return new H(pe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&pe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return pe.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new H(new pe(e.slice()))}}function ZC(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,s=Y.fromTimestamp(r===1e9?new je(n+1,0):new je(n,r));return new hr(s,H.empty(),e)}function eA(t){return new hr(t.readTime,t.key,-1)}class hr{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new hr(Y.min(),H.empty(),-1)}static max(){return new hr(Y.max(),H.empty(),-1)}}function tA(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=H.comparator(t.documentKey,e.documentKey),n!==0?n:oe(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nA="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class rA{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wo(t){if(t.code!==V.FAILED_PRECONDITION||t.message!==nA)throw t;W("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&G(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new M((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(n,i).next(r,s)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof M?n:M.resolve(n)}catch(n){return M.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):M.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):M.reject(n)}static resolve(e){return new M((n,r)=>{n(e)})}static reject(e){return new M((n,r)=>{r(e)})}static waitFor(e){return new M((n,r)=>{let s=0,i=0,o=!1;e.forEach(l=>{++s,l.next(()=>{++i,o&&i===s&&n()},u=>r(u))}),o=!0,i===s&&n()})}static or(e){let n=M.resolve(!1);for(const r of e)n=n.next(s=>s?M.resolve(s):r());return n}static forEach(e,n){const r=[];return e.forEach((s,i)=>{r.push(n.call(this,s,i))}),this.waitFor(r)}static mapArray(e,n){return new M((r,s)=>{const i=e.length,o=new Array(i);let l=0;for(let u=0;u<i;u++){const h=u;n(e[h]).next(p=>{o[h]=p,++l,l===i&&r(o)},p=>s(p))}})}static doWhile(e,n){return new M((r,s)=>{const i=()=>{e()===!0?n().next(()=>{i()},s):r()};i()})}}function sA(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Ho(t){return t.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ef{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this.ie(r),this.se=r=>n.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Ef.oe=-1;function yu(t){return t==null}function Ml(t){return t===0&&1/t==-1/0}function iA(t){return typeof t=="number"&&Number.isInteger(t)&&!Ml(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sy(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function ri(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function mw(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e,n){this.comparator=e,this.root=n||Fe.EMPTY}insert(e,n){return new xe(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,Fe.BLACK,null,null))}remove(e){return new xe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Fe.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return n+r.left.size;s<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Oa(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Oa(this.root,e,this.comparator,!1)}getReverseIterator(){return new Oa(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Oa(this.root,e,this.comparator,!0)}}class Oa{constructor(e,n,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=n?r(e.key,n):1,n&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Fe{constructor(e,n,r,s,i){this.key=e,this.value=n,this.color=r??Fe.RED,this.left=s??Fe.EMPTY,this.right=i??Fe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,s,i){return new Fe(e??this.key,n??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,n,r),null):i===0?s.copy(null,n,null,null,null):s.copy(null,null,null,null,s.right.insert(e,n,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Fe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,s=this;if(n(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,n),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),n(e,s.key)===0){if(s.right.isEmpty())return Fe.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,n))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Fe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Fe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw G();const e=this.left.check();if(e!==this.right.check())throw G();return e+(this.isRed()?0:1)}}Fe.EMPTY=null,Fe.RED=!0,Fe.BLACK=!1;Fe.EMPTY=new class{constructor(){this.size=0}get key(){throw G()}get value(){throw G()}get color(){throw G()}get left(){throw G()}get right(){throw G()}copy(e,n,r,s,i){return this}insert(e,n,r){return new Fe(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{constructor(e){this.comparator=e,this.data=new xe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;n(s.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new iy(this.data.getIterator())}getIteratorFrom(e){return new iy(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof Be)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const s=n.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new Be(this.comparator);return n.data=e,n}}class iy{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt{constructor(e){this.fields=e,e.sort(Ue.comparator)}static empty(){return new Lt([])}unionWith(e){let n=new Be(Ue.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new Lt(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return Bs(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gw extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new gw("Invalid base64 string: "+i):i}}(e);return new We(n)}static fromUint8Array(e){const n=function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i}(e);return new We(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let s=0;s<n.length;s++)r[s]=n.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return oe(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}We.EMPTY_BYTE_STRING=new We("");const oA=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function fr(t){if(le(!!t),typeof t=="string"){let e=0;const n=oA.exec(t);if(le(!!n),n[1]){let s=n[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Se(t.seconds),nanos:Se(t.nanos)}}function Se(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Wr(t){return typeof t=="string"?We.fromBase64String(t):We.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tf(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function If(t){const e=t.mapValue.fields.__previous_value__;return Tf(e)?If(e):e}function Co(t){const e=fr(t.mapValue.fields.__local_write_time__.timestampValue);return new je(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aA{constructor(e,n,r,s,i,o,l,u,h){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=u,this.useFetchStreams=h}}class Ao{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new Ao("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Ao&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Va={mapValue:{}};function Hr(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?Tf(t)?4:uA(t)?9007199254740991:lA(t)?10:11:G()}function nn(t,e){if(t===e)return!0;const n=Hr(t);if(n!==Hr(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return Co(t).isEqual(Co(e));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=fr(s.timestampValue),l=fr(i.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(s,i){return Wr(s.bytesValue).isEqual(Wr(i.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(s,i){return Se(s.geoPointValue.latitude)===Se(i.geoPointValue.latitude)&&Se(s.geoPointValue.longitude)===Se(i.geoPointValue.longitude)}(t,e);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return Se(s.integerValue)===Se(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=Se(s.doubleValue),l=Se(i.doubleValue);return o===l?Ml(o)===Ml(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return Bs(t.arrayValue.values||[],e.arrayValue.values||[],nn);case 10:case 11:return function(s,i){const o=s.mapValue.fields||{},l=i.mapValue.fields||{};if(sy(o)!==sy(l))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(l[u]===void 0||!nn(o[u],l[u])))return!1;return!0}(t,e);default:return G()}}function Ro(t,e){return(t.values||[]).find(n=>nn(n,e))!==void 0}function $s(t,e){if(t===e)return 0;const n=Hr(t),r=Hr(e);if(n!==r)return oe(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return oe(t.booleanValue,e.booleanValue);case 2:return function(i,o){const l=Se(i.integerValue||i.doubleValue),u=Se(o.integerValue||o.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1}(t,e);case 3:return oy(t.timestampValue,e.timestampValue);case 4:return oy(Co(t),Co(e));case 5:return oe(t.stringValue,e.stringValue);case 6:return function(i,o){const l=Wr(i),u=Wr(o);return l.compareTo(u)}(t.bytesValue,e.bytesValue);case 7:return function(i,o){const l=i.split("/"),u=o.split("/");for(let h=0;h<l.length&&h<u.length;h++){const p=oe(l[h],u[h]);if(p!==0)return p}return oe(l.length,u.length)}(t.referenceValue,e.referenceValue);case 8:return function(i,o){const l=oe(Se(i.latitude),Se(o.latitude));return l!==0?l:oe(Se(i.longitude),Se(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return ay(t.arrayValue,e.arrayValue);case 10:return function(i,o){var l,u,h,p;const m=i.fields||{},y=o.fields||{},k=(l=m.value)===null||l===void 0?void 0:l.arrayValue,T=(u=y.value)===null||u===void 0?void 0:u.arrayValue,R=oe(((h=k==null?void 0:k.values)===null||h===void 0?void 0:h.length)||0,((p=T==null?void 0:T.values)===null||p===void 0?void 0:p.length)||0);return R!==0?R:ay(k,T)}(t.mapValue,e.mapValue);case 11:return function(i,o){if(i===Va.mapValue&&o===Va.mapValue)return 0;if(i===Va.mapValue)return 1;if(o===Va.mapValue)return-1;const l=i.fields||{},u=Object.keys(l),h=o.fields||{},p=Object.keys(h);u.sort(),p.sort();for(let m=0;m<u.length&&m<p.length;++m){const y=oe(u[m],p[m]);if(y!==0)return y;const k=$s(l[u[m]],h[p[m]]);if(k!==0)return k}return oe(u.length,p.length)}(t.mapValue,e.mapValue);default:throw G()}}function oy(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return oe(t,e);const n=fr(t),r=fr(e),s=oe(n.seconds,r.seconds);return s!==0?s:oe(n.nanos,r.nanos)}function ay(t,e){const n=t.values||[],r=e.values||[];for(let s=0;s<n.length&&s<r.length;++s){const i=$s(n[s],r[s]);if(i)return i}return oe(n.length,r.length)}function qs(t){return $d(t)}function $d(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const r=fr(n);return`time(${r.seconds},${r.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return Wr(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return H.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let r="[",s=!0;for(const i of n.values||[])s?s=!1:r+=",",r+=$d(i);return r+"]"}(t.arrayValue):"mapValue"in t?function(n){const r=Object.keys(n.fields||{}).sort();let s="{",i=!0;for(const o of r)i?i=!1:s+=",",s+=`${o}:${$d(n.fields[o])}`;return s+"}"}(t.mapValue):G()}function ly(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function qd(t){return!!t&&"integerValue"in t}function Sf(t){return!!t&&"arrayValue"in t}function uy(t){return!!t&&"nullValue"in t}function cy(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function tl(t){return!!t&&"mapValue"in t}function lA(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="__vector__"}function eo(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return ri(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=eo(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=eo(t.arrayValue.values[n]);return e}return Object.assign({},t)}function uA(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kt{constructor(e){this.value=e}static empty(){return new kt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!tl(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=eo(n)}setAll(e){let n=Ue.emptyPath(),r={},s=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const u=this.getFieldsMap(n);this.applyChanges(u,r,s),r={},s=[],n=l.popLast()}o?r[l.lastSegment()]=eo(o):s.push(l.lastSegment())});const i=this.getFieldsMap(n);this.applyChanges(i,r,s)}delete(e){const n=this.field(e.popLast());tl(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return nn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=n.mapValue.fields[e.get(r)];tl(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=s),n=s}return n.mapValue.fields}applyChanges(e,n,r){ri(n,(s,i)=>e[s]=i);for(const s of r)delete e[s]}clone(){return new kt(eo(this.value))}}function yw(t){const e=[];return ri(t.fields,(n,r)=>{const s=new Ue([n]);if(tl(r)){const i=yw(r.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)}),new Lt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e,n,r,s,i,o,l){this.key=e,this.documentType=n,this.version=r,this.readTime=s,this.createTime=i,this.data=o,this.documentState=l}static newInvalidDocument(e){return new et(e,0,Y.min(),Y.min(),Y.min(),kt.empty(),0)}static newFoundDocument(e,n,r,s){return new et(e,1,n,Y.min(),r,s,0)}static newNoDocument(e,n){return new et(e,2,n,Y.min(),Y.min(),kt.empty(),0)}static newUnknownDocument(e,n){return new et(e,3,n,Y.min(),Y.min(),kt.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(Y.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=kt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=kt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Y.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof et&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new et(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fl{constructor(e,n){this.position=e,this.inclusive=n}}function dy(t,e,n){let r=0;for(let s=0;s<t.position.length;s++){const i=e[s],o=t.position[s];if(i.field.isKeyField()?r=H.comparator(H.fromName(o.referenceValue),n.key):r=$s(o,n.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function hy(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!nn(t.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bo{constructor(e,n="asc"){this.field=e,this.dir=n}}function cA(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vw{}class be extends vw{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new hA(e,n,r):n==="array-contains"?new mA(e,r):n==="in"?new gA(e,r):n==="not-in"?new yA(e,r):n==="array-contains-any"?new vA(e,r):new be(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new fA(e,r):new pA(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison($s(n,this.value)):n!==null&&Hr(this.value)===Hr(n)&&this.matchesComparison($s(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return G()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class qt extends vw{constructor(e,n){super(),this.filters=e,this.op=n,this.ae=null}static create(e,n){return new qt(e,n)}matches(e){return _w(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function _w(t){return t.op==="and"}function ww(t){return dA(t)&&_w(t)}function dA(t){for(const e of t.filters)if(e instanceof qt)return!1;return!0}function Wd(t){if(t instanceof be)return t.field.canonicalString()+t.op.toString()+qs(t.value);if(ww(t))return t.filters.map(e=>Wd(e)).join(",");{const e=t.filters.map(n=>Wd(n)).join(",");return`${t.op}(${e})`}}function xw(t,e){return t instanceof be?function(r,s){return s instanceof be&&r.op===s.op&&r.field.isEqual(s.field)&&nn(r.value,s.value)}(t,e):t instanceof qt?function(r,s){return s instanceof qt&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((i,o,l)=>i&&xw(o,s.filters[l]),!0):!1}(t,e):void G()}function Ew(t){return t instanceof be?function(n){return`${n.field.canonicalString()} ${n.op} ${qs(n.value)}`}(t):t instanceof qt?function(n){return n.op.toString()+" {"+n.getFilters().map(Ew).join(" ,")+"}"}(t):"Filter"}class hA extends be{constructor(e,n,r){super(e,n,r),this.key=H.fromName(r.referenceValue)}matches(e){const n=H.comparator(e.key,this.key);return this.matchesComparison(n)}}class fA extends be{constructor(e,n){super(e,"in",n),this.keys=Tw("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class pA extends be{constructor(e,n){super(e,"not-in",n),this.keys=Tw("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function Tw(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(r=>H.fromName(r.referenceValue))}class mA extends be{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Sf(n)&&Ro(n.arrayValue,this.value)}}class gA extends be{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&Ro(this.value.arrayValue,n)}}class yA extends be{constructor(e,n){super(e,"not-in",n)}matches(e){if(Ro(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!Ro(this.value.arrayValue,n)}}class vA extends be{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Sf(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>Ro(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _A{constructor(e,n=null,r=[],s=[],i=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=o,this.endAt=l,this.ue=null}}function fy(t,e=null,n=[],r=[],s=null,i=null,o=null){return new _A(t,e,n,r,s,i,o)}function kf(t){const e=X(t);if(e.ue===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(r=>Wd(r)).join(","),n+="|ob:",n+=e.orderBy.map(r=>function(i){return i.field.canonicalString()+i.dir}(r)).join(","),yu(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(r=>qs(r)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(r=>qs(r)).join(",")),e.ue=n}return e.ue}function Cf(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!cA(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!xw(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!hy(t.startAt,e.startAt)&&hy(t.endAt,e.endAt)}function Hd(t){return H.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si{constructor(e,n=null,r=[],s=[],i=null,o="F",l=null,u=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=o,this.startAt=l,this.endAt=u,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function wA(t,e,n,r,s,i,o,l){return new si(t,e,n,r,s,i,o,l)}function vu(t){return new si(t)}function py(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function Iw(t){return t.collectionGroup!==null}function to(t){const e=X(t);if(e.ce===null){e.ce=[];const n=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),n.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new Be(Ue.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(h=>{h.isInequality()&&(l=l.add(h.field))})}),l})(e).forEach(i=>{n.has(i.canonicalString())||i.isKeyField()||e.ce.push(new bo(i,r))}),n.has(Ue.keyField().canonicalString())||e.ce.push(new bo(Ue.keyField(),r))}return e.ce}function Zt(t){const e=X(t);return e.le||(e.le=xA(e,to(t))),e.le}function xA(t,e){if(t.limitType==="F")return fy(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new bo(s.field,i)});const n=t.endAt?new Fl(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new Fl(t.startAt.position,t.startAt.inclusive):null;return fy(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}function Kd(t,e){const n=t.filters.concat([e]);return new si(t.path,t.collectionGroup,t.explicitOrderBy.slice(),n,t.limit,t.limitType,t.startAt,t.endAt)}function Gd(t,e,n){return new si(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function _u(t,e){return Cf(Zt(t),Zt(e))&&t.limitType===e.limitType}function Sw(t){return`${kf(Zt(t))}|lt:${t.limitType}`}function os(t){return`Query(target=${function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map(s=>Ew(s)).join(", ")}]`),yu(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map(s=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(s)).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map(s=>qs(s)).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map(s=>qs(s)).join(",")),`Target(${r})`}(Zt(t))}; limitType=${t.limitType})`}function wu(t,e){return e.isFoundDocument()&&function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):H.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)}(t,e)&&function(r,s){for(const i of to(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(t,e)&&function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0}(t,e)&&function(r,s){return!(r.startAt&&!function(o,l,u){const h=dy(o,l,u);return o.inclusive?h<=0:h<0}(r.startAt,to(r),s)||r.endAt&&!function(o,l,u){const h=dy(o,l,u);return o.inclusive?h>=0:h>0}(r.endAt,to(r),s))}(t,e)}function EA(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function kw(t){return(e,n)=>{let r=!1;for(const s of to(t)){const i=TA(s,e,n);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function TA(t,e,n){const r=t.field.isKeyField()?H.comparator(e.key,n.key):function(i,o,l){const u=o.data.field(i),h=l.data.field(i);return u!==null&&h!==null?$s(u,h):G()}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return G()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ii{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,n]);s.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[n]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){ri(this.inner,(n,r)=>{for(const[s,i]of r)e(s,i)})}isEmpty(){return mw(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const IA=new xe(H.comparator);function Cn(){return IA}const Cw=new xe(H.comparator);function zi(...t){let e=Cw;for(const n of t)e=e.insert(n.key,n);return e}function Aw(t){let e=Cw;return t.forEach((n,r)=>e=e.insert(n,r.overlayedDocument)),e}function Pr(){return no()}function Rw(){return no()}function no(){return new ii(t=>t.toString(),(t,e)=>t.isEqual(e))}const SA=new xe(H.comparator),kA=new Be(H.comparator);function te(...t){let e=kA;for(const n of t)e=e.add(n);return e}const CA=new Be(oe);function AA(){return CA}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Af(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Ml(e)?"-0":e}}function bw(t){return{integerValue:""+t}}function RA(t,e){return iA(e)?bw(e):Af(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xu{constructor(){this._=void 0}}function bA(t,e,n){return t instanceof Ul?function(s,i){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Tf(i)&&(i=If(i)),i&&(o.fields.__previous_value__=i),{mapValue:o}}(n,e):t instanceof No?Pw(t,e):t instanceof Po?jw(t,e):function(s,i){const o=Nw(s,i),l=my(o)+my(s.Pe);return qd(o)&&qd(s.Pe)?bw(l):Af(s.serializer,l)}(t,e)}function NA(t,e,n){return t instanceof No?Pw(t,e):t instanceof Po?jw(t,e):n}function Nw(t,e){return t instanceof zl?function(r){return qd(r)||function(i){return!!i&&"doubleValue"in i}(r)}(e)?e:{integerValue:0}:null}class Ul extends xu{}class No extends xu{constructor(e){super(),this.elements=e}}function Pw(t,e){const n=Dw(e);for(const r of t.elements)n.some(s=>nn(s,r))||n.push(r);return{arrayValue:{values:n}}}class Po extends xu{constructor(e){super(),this.elements=e}}function jw(t,e){let n=Dw(e);for(const r of t.elements)n=n.filter(s=>!nn(s,r));return{arrayValue:{values:n}}}class zl extends xu{constructor(e,n){super(),this.serializer=e,this.Pe=n}}function my(t){return Se(t.integerValue||t.doubleValue)}function Dw(t){return Sf(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}function PA(t,e){return t.field.isEqual(e.field)&&function(r,s){return r instanceof No&&s instanceof No||r instanceof Po&&s instanceof Po?Bs(r.elements,s.elements,nn):r instanceof zl&&s instanceof zl?nn(r.Pe,s.Pe):r instanceof Ul&&s instanceof Ul}(t.transform,e.transform)}class jA{constructor(e,n){this.version=e,this.transformResults=n}}class Ut{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new Ut}static exists(e){return new Ut(void 0,e)}static updateTime(e){return new Ut(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function nl(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class Eu{}function Ow(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new Rf(t.key,Ut.none()):new Ko(t.key,t.data,Ut.none());{const n=t.data,r=kt.empty();let s=new Be(Ue.comparator);for(let i of e.fields)if(!s.has(i)){let o=n.field(i);o===null&&i.length>1&&(i=i.popLast(),o=n.field(i)),o===null?r.delete(i):r.set(i,o),s=s.add(i)}return new Xr(t.key,r,new Lt(s.toArray()),Ut.none())}}function DA(t,e,n){t instanceof Ko?function(s,i,o){const l=s.value.clone(),u=yy(s.fieldTransforms,i,o.transformResults);l.setAll(u),i.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(t,e,n):t instanceof Xr?function(s,i,o){if(!nl(s.precondition,i))return void i.convertToUnknownDocument(o.version);const l=yy(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(Vw(s)),u.setAll(l),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(t,e,n):function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function ro(t,e,n,r){return t instanceof Ko?function(i,o,l,u){if(!nl(i.precondition,o))return l;const h=i.value.clone(),p=vy(i.fieldTransforms,u,o);return h.setAll(p),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(t,e,n,r):t instanceof Xr?function(i,o,l,u){if(!nl(i.precondition,o))return l;const h=vy(i.fieldTransforms,u,o),p=o.data;return p.setAll(Vw(i)),p.setAll(h),o.convertToFoundDocument(o.version,p).setHasLocalMutations(),l===null?null:l.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(t,e,n,r):function(i,o,l){return nl(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(t,e,n)}function OA(t,e){let n=null;for(const r of t.fieldTransforms){const s=e.data.field(r.field),i=Nw(r.transform,s||null);i!=null&&(n===null&&(n=kt.empty()),n.set(r.field,i))}return n||null}function gy(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Bs(r,s,(i,o)=>PA(i,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class Ko extends Eu{constructor(e,n,r,s=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Xr extends Eu{constructor(e,n,r,s,i=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Vw(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function yy(t,e,n){const r=new Map;le(t.length===n.length);for(let s=0;s<n.length;s++){const i=t[s],o=i.transform,l=e.data.field(i.field);r.set(i.field,NA(o,l,n[s]))}return r}function vy(t,e,n){const r=new Map;for(const s of t){const i=s.transform,o=n.data.field(s.field);r.set(s.field,bA(i,o,e))}return r}class Rf extends Eu{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class VA extends Eu{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LA{constructor(e,n,r,s){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&DA(i,e,r[s])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=ro(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=ro(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=Rw();return this.mutations.forEach(s=>{const i=e.get(s.key),o=i.overlayedDocument;let l=this.applyToLocalView(o,i.mutatedFields);l=n.has(s.key)?null:l;const u=Ow(o,l);u!==null&&r.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(Y.min())}),r}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),te())}isEqual(e){return this.batchId===e.batchId&&Bs(this.mutations,e.mutations,(n,r)=>gy(n,r))&&Bs(this.baseMutations,e.baseMutations,(n,r)=>gy(n,r))}}class bf{constructor(e,n,r,s){this.batch=e,this.commitVersion=n,this.mutationResults=r,this.docVersions=s}static from(e,n,r){le(e.mutations.length===r.length);let s=function(){return SA}();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,r[o].version);return new bf(e,n,r,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MA{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FA{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ae,re;function UA(t){switch(t){default:return G();case V.CANCELLED:case V.UNKNOWN:case V.DEADLINE_EXCEEDED:case V.RESOURCE_EXHAUSTED:case V.INTERNAL:case V.UNAVAILABLE:case V.UNAUTHENTICATED:return!1;case V.INVALID_ARGUMENT:case V.NOT_FOUND:case V.ALREADY_EXISTS:case V.PERMISSION_DENIED:case V.FAILED_PRECONDITION:case V.ABORTED:case V.OUT_OF_RANGE:case V.UNIMPLEMENTED:case V.DATA_LOSS:return!0}}function Lw(t){if(t===void 0)return kn("GRPC error has no .code"),V.UNKNOWN;switch(t){case Ae.OK:return V.OK;case Ae.CANCELLED:return V.CANCELLED;case Ae.UNKNOWN:return V.UNKNOWN;case Ae.DEADLINE_EXCEEDED:return V.DEADLINE_EXCEEDED;case Ae.RESOURCE_EXHAUSTED:return V.RESOURCE_EXHAUSTED;case Ae.INTERNAL:return V.INTERNAL;case Ae.UNAVAILABLE:return V.UNAVAILABLE;case Ae.UNAUTHENTICATED:return V.UNAUTHENTICATED;case Ae.INVALID_ARGUMENT:return V.INVALID_ARGUMENT;case Ae.NOT_FOUND:return V.NOT_FOUND;case Ae.ALREADY_EXISTS:return V.ALREADY_EXISTS;case Ae.PERMISSION_DENIED:return V.PERMISSION_DENIED;case Ae.FAILED_PRECONDITION:return V.FAILED_PRECONDITION;case Ae.ABORTED:return V.ABORTED;case Ae.OUT_OF_RANGE:return V.OUT_OF_RANGE;case Ae.UNIMPLEMENTED:return V.UNIMPLEMENTED;case Ae.DATA_LOSS:return V.DATA_LOSS;default:return G()}}(re=Ae||(Ae={}))[re.OK=0]="OK",re[re.CANCELLED=1]="CANCELLED",re[re.UNKNOWN=2]="UNKNOWN",re[re.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",re[re.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",re[re.NOT_FOUND=5]="NOT_FOUND",re[re.ALREADY_EXISTS=6]="ALREADY_EXISTS",re[re.PERMISSION_DENIED=7]="PERMISSION_DENIED",re[re.UNAUTHENTICATED=16]="UNAUTHENTICATED",re[re.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",re[re.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",re[re.ABORTED=10]="ABORTED",re[re.OUT_OF_RANGE=11]="OUT_OF_RANGE",re[re.UNIMPLEMENTED=12]="UNIMPLEMENTED",re[re.INTERNAL=13]="INTERNAL",re[re.UNAVAILABLE=14]="UNAVAILABLE",re[re.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zA(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const BA=new Or([4294967295,4294967295],0);function _y(t){const e=zA().encode(t),n=new aw;return n.update(e),new Uint8Array(n.digest())}function wy(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Or([n,r],0),new Or([s,i],0)]}class Nf{constructor(e,n,r){if(this.bitmap=e,this.padding=n,this.hashCount=r,n<0||n>=8)throw new Bi(`Invalid padding: ${n}`);if(r<0)throw new Bi(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Bi(`Invalid hash count: ${r}`);if(e.length===0&&n!==0)throw new Bi(`Invalid padding when bitmap length is 0: ${n}`);this.Ie=8*e.length-n,this.Te=Or.fromNumber(this.Ie)}Ee(e,n,r){let s=e.add(n.multiply(Or.fromNumber(r)));return s.compare(BA)===1&&(s=new Or([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const n=_y(e),[r,s]=wy(n);for(let i=0;i<this.hashCount;i++){const o=this.Ee(r,s,i);if(!this.de(o))return!1}return!0}static create(e,n,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new Nf(i,s,n);return r.forEach(l=>o.insert(l)),o}insert(e){if(this.Ie===0)return;const n=_y(e),[r,s]=wy(n);for(let i=0;i<this.hashCount;i++){const o=this.Ee(r,s,i);this.Ae(o)}}Ae(e){const n=Math.floor(e/8),r=e%8;this.bitmap[n]|=1<<r}}class Bi extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tu{constructor(e,n,r,s,i){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,n,r){const s=new Map;return s.set(e,Go.createSynthesizedTargetChangeForCurrentChange(e,n,r)),new Tu(Y.min(),s,new xe(oe),Cn(),te())}}class Go{constructor(e,n,r,s,i){this.resumeToken=e,this.current=n,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,n,r){return new Go(r,n,te(),te(),te())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl{constructor(e,n,r,s){this.Re=e,this.removedTargetIds=n,this.key=r,this.Ve=s}}class Mw{constructor(e,n){this.targetId=e,this.me=n}}class Fw{constructor(e,n,r=We.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=n,this.resumeToken=r,this.cause=s}}class xy{constructor(){this.fe=0,this.ge=Ty(),this.pe=We.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=te(),n=te(),r=te();return this.ge.forEach((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:n=n.add(s);break;case 1:r=r.add(s);break;default:G()}}),new Go(this.pe,this.ye,e,n,r)}Ce(){this.we=!1,this.ge=Ty()}Fe(e,n){this.we=!0,this.ge=this.ge.insert(e,n)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,le(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class $A{constructor(e){this.Le=e,this.Be=new Map,this.ke=Cn(),this.qe=Ey(),this.Qe=new xe(oe)}Ke(e){for(const n of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(n,e.Ve):this.Ue(n,e.key,e.Ve);for(const n of e.removedTargetIds)this.Ue(n,e.key,e.Ve)}We(e){this.forEachTarget(e,n=>{const r=this.Ge(n);switch(e.state){case 0:this.ze(n)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(n);break;case 3:this.ze(n)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(n)&&(this.je(n),r.De(e.resumeToken));break;default:G()}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Be.forEach((r,s)=>{this.ze(s)&&n(s)})}He(e){const n=e.targetId,r=e.me.count,s=this.Je(n);if(s){const i=s.target;if(Hd(i))if(r===0){const o=new H(i.path);this.Ue(n,o,et.newNoDocument(o,Y.min()))}else le(r===1);else{const o=this.Ye(n);if(o!==r){const l=this.Ze(e),u=l?this.Xe(l,e,o):1;if(u!==0){this.je(n);const h=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(n,h)}}}}}Ze(e){const n=e.me.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=n;let o,l;try{o=Wr(r).toUint8Array()}catch(u){if(u instanceof gw)return zs("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{l=new Nf(o,s,i)}catch(u){return zs(u instanceof Bi?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return l.Ie===0?null:l}Xe(e,n,r){return n.me.count===r-this.nt(e,n.targetId)?0:2}nt(e,n){const r=this.Le.getRemoteKeysForTarget(n);let s=0;return r.forEach(i=>{const o=this.Le.tt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(l)||(this.Ue(n,i,null),s++)}),s}rt(e){const n=new Map;this.Be.forEach((i,o)=>{const l=this.Je(o);if(l){if(i.current&&Hd(l.target)){const u=new H(l.target.path);this.ke.get(u)!==null||this.it(o,u)||this.Ue(o,u,et.newNoDocument(u,e))}i.be&&(n.set(o,i.ve()),i.Ce())}});let r=te();this.qe.forEach((i,o)=>{let l=!0;o.forEachWhile(u=>{const h=this.Je(u);return!h||h.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(i))}),this.ke.forEach((i,o)=>o.setReadTime(e));const s=new Tu(e,n,this.Qe,this.ke,r);return this.ke=Cn(),this.qe=Ey(),this.Qe=new xe(oe),s}$e(e,n){if(!this.ze(e))return;const r=this.it(e,n.key)?2:0;this.Ge(e).Fe(n.key,r),this.ke=this.ke.insert(n.key,n),this.qe=this.qe.insert(n.key,this.st(n.key).add(e))}Ue(e,n,r){if(!this.ze(e))return;const s=this.Ge(e);this.it(e,n)?s.Fe(n,1):s.Me(n),this.qe=this.qe.insert(n,this.st(n).delete(e)),r&&(this.ke=this.ke.insert(n,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const n=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let n=this.Be.get(e);return n||(n=new xy,this.Be.set(e,n)),n}st(e){let n=this.qe.get(e);return n||(n=new Be(oe),this.qe=this.qe.insert(e,n)),n}ze(e){const n=this.Je(e)!==null;return n||W("WatchChangeAggregator","Detected inactive target",e),n}Je(e){const n=this.Be.get(e);return n&&n.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new xy),this.Le.getRemoteKeysForTarget(e).forEach(n=>{this.Ue(e,n,null)})}it(e,n){return this.Le.getRemoteKeysForTarget(e).has(n)}}function Ey(){return new xe(H.comparator)}function Ty(){return new xe(H.comparator)}const qA={asc:"ASCENDING",desc:"DESCENDING"},WA={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},HA={and:"AND",or:"OR"};class KA{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function Qd(t,e){return t.useProto3Json||yu(e)?e:{value:e}}function Bl(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Uw(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function GA(t,e){return Bl(t,e.toTimestamp())}function en(t){return le(!!t),Y.fromTimestamp(function(n){const r=fr(n);return new je(r.seconds,r.nanos)}(t))}function Pf(t,e){return Yd(t,e).canonicalString()}function Yd(t,e){const n=function(s){return new pe(["projects",s.projectId,"databases",s.database])}(t).child("documents");return e===void 0?n:n.child(e)}function zw(t){const e=pe.fromString(t);return le(Hw(e)),e}function Xd(t,e){return Pf(t.databaseId,e.path)}function Pc(t,e){const n=zw(e);if(n.get(1)!==t.databaseId.projectId)throw new q(V.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new q(V.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new H($w(n))}function Bw(t,e){return Pf(t.databaseId,e)}function QA(t){const e=zw(t);return e.length===4?pe.emptyPath():$w(e)}function Jd(t){return new pe(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function $w(t){return le(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function Iy(t,e,n){return{name:Xd(t,e),fields:n.value.mapValue.fields}}function YA(t,e){let n;if("targetChange"in e){e.targetChange;const r=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:G()}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=function(h,p){return h.useProto3Json?(le(p===void 0||typeof p=="string"),We.fromBase64String(p||"")):(le(p===void 0||p instanceof Buffer||p instanceof Uint8Array),We.fromUint8Array(p||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(h){const p=h.code===void 0?V.UNKNOWN:Lw(h.code);return new q(p,h.message||"")}(o);n=new Fw(r,s,i,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=Pc(t,r.document.name),i=en(r.document.updateTime),o=r.document.createTime?en(r.document.createTime):Y.min(),l=new kt({mapValue:{fields:r.document.fields}}),u=et.newFoundDocument(s,i,o,l),h=r.targetIds||[],p=r.removedTargetIds||[];n=new rl(h,p,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=Pc(t,r.document),i=r.readTime?en(r.readTime):Y.min(),o=et.newNoDocument(s,i),l=r.removedTargetIds||[];n=new rl([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=Pc(t,r.document),i=r.removedTargetIds||[];n=new rl([],i,s,null)}else{if(!("filter"in e))return G();{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,o=new FA(s,i),l=r.targetId;n=new Mw(l,o)}}return n}function XA(t,e){let n;if(e instanceof Ko)n={update:Iy(t,e.key,e.value)};else if(e instanceof Rf)n={delete:Xd(t,e.key)};else if(e instanceof Xr)n={update:Iy(t,e.key,e.data),updateMask:oR(e.fieldMask)};else{if(!(e instanceof VA))return G();n={verify:Xd(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(i,o){const l=o.transform;if(l instanceof Ul)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof No)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Po)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof zl)return{fieldPath:o.field.canonicalString(),increment:l.Pe};throw G()}(0,r))),e.precondition.isNone||(n.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:GA(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:G()}(t,e.precondition)),n}function JA(t,e){return t&&t.length>0?(le(e!==void 0),t.map(n=>function(s,i){let o=s.updateTime?en(s.updateTime):en(i);return o.isEqual(Y.min())&&(o=en(i)),new jA(o,s.transformResults||[])}(n,e))):[]}function ZA(t,e){return{documents:[Bw(t,e.path)]}}function eR(t,e){const n={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=Bw(t,s);const i=function(h){if(h.length!==0)return Ww(qt.create(h,"and"))}(e.filters);i&&(n.structuredQuery.where=i);const o=function(h){if(h.length!==0)return h.map(p=>function(y){return{field:as(y.field),direction:rR(y.dir)}}(p))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=Qd(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{_t:n,parent:s}}function tR(t){let e=QA(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let s=null;if(r>0){le(r===1);const p=n.from[0];p.allDescendants?s=p.collectionId:e=e.child(p.collectionId)}let i=[];n.where&&(i=function(m){const y=qw(m);return y instanceof qt&&ww(y)?y.getFilters():[y]}(n.where));let o=[];n.orderBy&&(o=function(m){return m.map(y=>function(T){return new bo(ls(T.field),function(j){switch(j){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(T.direction))}(y))}(n.orderBy));let l=null;n.limit&&(l=function(m){let y;return y=typeof m=="object"?m.value:m,yu(y)?null:y}(n.limit));let u=null;n.startAt&&(u=function(m){const y=!!m.before,k=m.values||[];return new Fl(k,y)}(n.startAt));let h=null;return n.endAt&&(h=function(m){const y=!m.before,k=m.values||[];return new Fl(k,y)}(n.endAt)),wA(e,s,o,i,l,"F",u,h)}function nR(t,e){const n=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return G()}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function qw(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=ls(n.unaryFilter.field);return be.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=ls(n.unaryFilter.field);return be.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=ls(n.unaryFilter.field);return be.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=ls(n.unaryFilter.field);return be.create(o,"!=",{nullValue:"NULL_VALUE"});default:return G()}}(t):t.fieldFilter!==void 0?function(n){return be.create(ls(n.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return G()}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return qt.create(n.compositeFilter.filters.map(r=>qw(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return G()}}(n.compositeFilter.op))}(t):G()}function rR(t){return qA[t]}function sR(t){return WA[t]}function iR(t){return HA[t]}function as(t){return{fieldPath:t.canonicalString()}}function ls(t){return Ue.fromServerFormat(t.fieldPath)}function Ww(t){return t instanceof be?function(n){if(n.op==="=="){if(cy(n.value))return{unaryFilter:{field:as(n.field),op:"IS_NAN"}};if(uy(n.value))return{unaryFilter:{field:as(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(cy(n.value))return{unaryFilter:{field:as(n.field),op:"IS_NOT_NAN"}};if(uy(n.value))return{unaryFilter:{field:as(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:as(n.field),op:sR(n.op),value:n.value}}}(t):t instanceof qt?function(n){const r=n.getFilters().map(s=>Ww(s));return r.length===1?r[0]:{compositeFilter:{op:iR(n.op),filters:r}}}(t):G()}function oR(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function Hw(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gn{constructor(e,n,r,s,i=Y.min(),o=Y.min(),l=We.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=n,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=u}withSequenceNumber(e){return new Gn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new Gn(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Gn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Gn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aR{constructor(e){this.ct=e}}function lR(t){const e=tR({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?Gd(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uR{constructor(){this.un=new cR}addToCollectionParentIndex(e,n){return this.un.add(n),M.resolve()}getCollectionParents(e,n){return M.resolve(this.un.getEntries(n))}addFieldIndex(e,n){return M.resolve()}deleteFieldIndex(e,n){return M.resolve()}deleteAllFieldIndexes(e){return M.resolve()}createTargetIndexes(e,n){return M.resolve()}getDocumentsMatchingTarget(e,n){return M.resolve(null)}getIndexType(e,n){return M.resolve(0)}getFieldIndexes(e,n){return M.resolve([])}getNextCollectionGroupToUpdate(e){return M.resolve(null)}getMinOffset(e,n){return M.resolve(hr.min())}getMinOffsetFromCollectionGroup(e,n){return M.resolve(hr.min())}updateCollectionGroup(e,n,r){return M.resolve()}updateIndexEntries(e,n){return M.resolve()}}class cR{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),s=this.index[n]||new Be(pe.comparator),i=!s.has(r);return this.index[n]=s.add(r),i}has(e){const n=e.lastSegment(),r=e.popLast(),s=this.index[n];return s&&s.has(r)}getEntries(e){return(this.index[e]||new Be(pe.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ws{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Ws(0)}static kn(){return new Ws(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dR{constructor(){this.changes=new ii(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,et.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?M.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hR{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fR{constructor(e,n,r,s){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,n))).next(s=>(r!==null&&ro(r.mutation,s,Lt.empty(),je.now()),s))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.getLocalViewOfDocuments(e,r,te()).next(()=>r))}getLocalViewOfDocuments(e,n,r=te()){const s=Pr();return this.populateOverlays(e,s,n).next(()=>this.computeViews(e,n,s,r).next(i=>{let o=zi();return i.forEach((l,u)=>{o=o.insert(l,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const r=Pr();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,te()))}populateOverlays(e,n,r){const s=[];return r.forEach(i=>{n.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(e,s).next(i=>{i.forEach((o,l)=>{n.set(o,l)})})}computeViews(e,n,r,s){let i=Cn();const o=no(),l=function(){return no()}();return n.forEach((u,h)=>{const p=r.get(h.key);s.has(h.key)&&(p===void 0||p.mutation instanceof Xr)?i=i.insert(h.key,h):p!==void 0?(o.set(h.key,p.mutation.getFieldMask()),ro(p.mutation,h,p.mutation.getFieldMask(),je.now())):o.set(h.key,Lt.empty())}),this.recalculateAndSaveOverlays(e,i).next(u=>(u.forEach((h,p)=>o.set(h,p)),n.forEach((h,p)=>{var m;return l.set(h,new hR(p,(m=o.get(h))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,n){const r=no();let s=new xe((o,l)=>o-l),i=te();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const l of o)l.keys().forEach(u=>{const h=n.get(u);if(h===null)return;let p=r.get(u)||Lt.empty();p=l.applyToLocalView(h,p),r.set(u,p);const m=(s.get(l.batchId)||te()).add(u);s=s.insert(l.batchId,m)})}).next(()=>{const o=[],l=s.getReverseIterator();for(;l.hasNext();){const u=l.getNext(),h=u.key,p=u.value,m=Rw();p.forEach(y=>{if(!i.has(y)){const k=Ow(n.get(y),r.get(y));k!==null&&m.set(y,k),i=i.add(y)}}),o.push(this.documentOverlayCache.saveOverlays(e,h,m))}return M.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,n,r,s){return function(o){return H.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):Iw(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,s):this.getDocumentsMatchingCollectionQuery(e,n,r,s)}getNextDocuments(e,n,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,s).next(i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,s-i.size):M.resolve(Pr());let l=-1,u=i;return o.next(h=>M.forEach(h,(p,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),i.get(p)?M.resolve():this.remoteDocumentCache.getEntry(e,p).next(y=>{u=u.insert(p,y)}))).next(()=>this.populateOverlays(e,h,i)).next(()=>this.computeViews(e,u,h,te())).next(p=>({batchId:l,changes:Aw(p)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new H(n)).next(r=>{let s=zi();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,n,r,s){const i=n.collectionGroup;let o=zi();return this.indexManager.getCollectionParents(e,i).next(l=>M.forEach(l,u=>{const h=function(m,y){return new si(y,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(n,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,h,r,s).next(p=>{p.forEach((m,y)=>{o=o.insert(m,y)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next(o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,i,s))).next(o=>{i.forEach((u,h)=>{const p=h.getKey();o.get(p)===null&&(o=o.insert(p,et.newInvalidDocument(p)))});let l=zi();return o.forEach((u,h)=>{const p=i.get(u);p!==void 0&&ro(p.mutation,h,Lt.empty(),je.now()),wu(n,h)&&(l=l.insert(u,h))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pR{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,n){return M.resolve(this.hr.get(n))}saveBundleMetadata(e,n){return this.hr.set(n.id,function(s){return{id:s.id,version:s.version,createTime:en(s.createTime)}}(n)),M.resolve()}getNamedQuery(e,n){return M.resolve(this.Pr.get(n))}saveNamedQuery(e,n){return this.Pr.set(n.name,function(s){return{name:s.name,query:lR(s.bundledQuery),readTime:en(s.readTime)}}(n)),M.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mR{constructor(){this.overlays=new xe(H.comparator),this.Ir=new Map}getOverlay(e,n){return M.resolve(this.overlays.get(n))}getOverlays(e,n){const r=Pr();return M.forEach(n,s=>this.getOverlay(e,s).next(i=>{i!==null&&r.set(s,i)})).next(()=>r)}saveOverlays(e,n,r){return r.forEach((s,i)=>{this.ht(e,n,i)}),M.resolve()}removeOverlaysForBatchId(e,n,r){const s=this.Ir.get(r);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(r)),M.resolve()}getOverlaysForCollection(e,n,r){const s=Pr(),i=n.length+1,o=new H(n.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const u=l.getNext().value,h=u.getKey();if(!n.isPrefixOf(h.path))break;h.path.length===i&&u.largestBatchId>r&&s.set(u.getKey(),u)}return M.resolve(s)}getOverlaysForCollectionGroup(e,n,r,s){let i=new xe((h,p)=>h-p);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===n&&h.largestBatchId>r){let p=i.get(h.largestBatchId);p===null&&(p=Pr(),i=i.insert(h.largestBatchId,p)),p.set(h.getKey(),h)}}const l=Pr(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((h,p)=>l.set(h,p)),!(l.size()>=s)););return M.resolve(l)}ht(e,n,r){const s=this.overlays.get(r.key);if(s!==null){const o=this.Ir.get(s.largestBatchId).delete(r.key);this.Ir.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new MA(n,r));let i=this.Ir.get(n);i===void 0&&(i=te(),this.Ir.set(n,i)),this.Ir.set(n,i.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gR{constructor(){this.sessionToken=We.EMPTY_BYTE_STRING}getSessionToken(e){return M.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,M.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jf{constructor(){this.Tr=new Be(De.Er),this.dr=new Be(De.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,n){const r=new De(e,n);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,n){e.forEach(r=>this.addReference(r,n))}removeReference(e,n){this.Vr(new De(e,n))}mr(e,n){e.forEach(r=>this.removeReference(r,n))}gr(e){const n=new H(new pe([])),r=new De(n,e),s=new De(n,e+1),i=[];return this.dr.forEachInRange([r,s],o=>{this.Vr(o),i.push(o.key)}),i}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const n=new H(new pe([])),r=new De(n,e),s=new De(n,e+1);let i=te();return this.dr.forEachInRange([r,s],o=>{i=i.add(o.key)}),i}containsKey(e){const n=new De(e,0),r=this.Tr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class De{constructor(e,n){this.key=e,this.wr=n}static Er(e,n){return H.comparator(e.key,n.key)||oe(e.wr,n.wr)}static Ar(e,n){return oe(e.wr,n.wr)||H.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yR{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Sr=1,this.br=new Be(De.Er)}checkEmpty(e){return M.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,s){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new LA(i,n,r,s);this.mutationQueue.push(o);for(const l of s)this.br=this.br.add(new De(l.key,i)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return M.resolve(o)}lookupMutationBatch(e,n){return M.resolve(this.Dr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,s=this.vr(r),i=s<0?0:s;return M.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return M.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return M.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new De(n,0),s=new De(n,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([r,s],o=>{const l=this.Dr(o.wr);i.push(l)}),M.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new Be(oe);return n.forEach(s=>{const i=new De(s,0),o=new De(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,o],l=>{r=r.add(l.wr)})}),M.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,s=r.length+1;let i=r;H.isDocumentKey(i)||(i=i.child(""));const o=new De(new H(i),0);let l=new Be(oe);return this.br.forEachWhile(u=>{const h=u.key.path;return!!r.isPrefixOf(h)&&(h.length===s&&(l=l.add(u.wr)),!0)},o),M.resolve(this.Cr(l))}Cr(e){const n=[];return e.forEach(r=>{const s=this.Dr(r);s!==null&&n.push(s)}),n}removeMutationBatch(e,n){le(this.Fr(n.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return M.forEach(n.mutations,s=>{const i=new De(s.key,n.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,n){const r=new De(n,0),s=this.br.firstAfterOrEqual(r);return M.resolve(n.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,M.resolve()}Fr(e,n){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const n=this.vr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vR{constructor(e){this.Mr=e,this.docs=function(){return new xe(H.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,s=this.docs.get(r),i=s?s.size:0,o=this.Mr(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return M.resolve(r?r.document.mutableCopy():et.newInvalidDocument(n))}getEntries(e,n){let r=Cn();return n.forEach(s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():et.newInvalidDocument(s))}),M.resolve(r)}getDocumentsMatchingQuery(e,n,r,s){let i=Cn();const o=n.path,l=new H(o.child("")),u=this.docs.getIteratorFrom(l);for(;u.hasNext();){const{key:h,value:{document:p}}=u.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||tA(eA(p),r)<=0||(s.has(p.key)||wu(n,p))&&(i=i.insert(p.key,p.mutableCopy()))}return M.resolve(i)}getAllFromCollectionGroup(e,n,r,s){G()}Or(e,n){return M.forEach(this.docs,r=>n(r))}newChangeBuffer(e){return new _R(this)}getSize(e){return M.resolve(this.size)}}class _R extends dR{constructor(e){super(),this.cr=e}applyChanges(e){const n=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?n.push(this.cr.addEntry(e,s)):this.cr.removeEntry(r)}),M.waitFor(n)}getFromCache(e,n){return this.cr.getEntry(e,n)}getAllFromCache(e,n){return this.cr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wR{constructor(e){this.persistence=e,this.Nr=new ii(n=>kf(n),Cf),this.lastRemoteSnapshotVersion=Y.min(),this.highestTargetId=0,this.Lr=0,this.Br=new jf,this.targetCount=0,this.kr=Ws.Bn()}forEachTarget(e,n){return this.Nr.forEach((r,s)=>n(s)),M.resolve()}getLastRemoteSnapshotVersion(e){return M.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return M.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),M.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.Lr&&(this.Lr=n),M.resolve()}Kn(e){this.Nr.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.kr=new Ws(n),this.highestTargetId=n),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,n){return this.Kn(n),this.targetCount+=1,M.resolve()}updateTargetData(e,n){return this.Kn(n),M.resolve()}removeTargetData(e,n){return this.Nr.delete(n.target),this.Br.gr(n.targetId),this.targetCount-=1,M.resolve()}removeTargets(e,n,r){let s=0;const i=[];return this.Nr.forEach((o,l)=>{l.sequenceNumber<=n&&r.get(l.targetId)===null&&(this.Nr.delete(o),i.push(this.removeMatchingKeysForTargetId(e,l.targetId)),s++)}),M.waitFor(i).next(()=>s)}getTargetCount(e){return M.resolve(this.targetCount)}getTargetData(e,n){const r=this.Nr.get(n)||null;return M.resolve(r)}addMatchingKeys(e,n,r){return this.Br.Rr(n,r),M.resolve()}removeMatchingKeys(e,n,r){this.Br.mr(n,r);const s=this.persistence.referenceDelegate,i=[];return s&&n.forEach(o=>{i.push(s.markPotentiallyOrphaned(e,o))}),M.waitFor(i)}removeMatchingKeysForTargetId(e,n){return this.Br.gr(n),M.resolve()}getMatchingKeysForTargetId(e,n){const r=this.Br.yr(n);return M.resolve(r)}containsKey(e,n){return M.resolve(this.Br.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xR{constructor(e,n){this.qr={},this.overlays={},this.Qr=new Ef(0),this.Kr=!1,this.Kr=!0,this.$r=new gR,this.referenceDelegate=e(this),this.Ur=new wR(this),this.indexManager=new uR,this.remoteDocumentCache=function(s){return new vR(s)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new aR(n),this.Gr=new pR(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new mR,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this.qr[e.toKey()];return r||(r=new yR(n,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,n,r){W("MemoryPersistence","Starting transaction:",e);const s=new ER(this.Qr.next());return this.referenceDelegate.zr(),r(s).next(i=>this.referenceDelegate.jr(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}Hr(e,n){return M.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,n)))}}class ER extends rA{constructor(e){super(),this.currentSequenceNumber=e}}class Df{constructor(e){this.persistence=e,this.Jr=new jf,this.Yr=null}static Zr(e){return new Df(e)}get Xr(){if(this.Yr)return this.Yr;throw G()}addReference(e,n,r){return this.Jr.addReference(r,n),this.Xr.delete(r.toString()),M.resolve()}removeReference(e,n,r){return this.Jr.removeReference(r,n),this.Xr.add(r.toString()),M.resolve()}markPotentiallyOrphaned(e,n){return this.Xr.add(n.toString()),M.resolve()}removeTarget(e,n){this.Jr.gr(n.targetId).forEach(s=>this.Xr.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next(s=>{s.forEach(i=>this.Xr.add(i.toString()))}).next(()=>r.removeTargetData(e,n))}zr(){this.Yr=new Set}jr(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return M.forEach(this.Xr,r=>{const s=H.fromPath(r);return this.ei(e,s).next(i=>{i||n.removeEntry(s,Y.min())})}).next(()=>(this.Yr=null,n.apply(e)))}updateLimboDocument(e,n){return this.ei(e,n).next(r=>{r?this.Xr.delete(n.toString()):this.Xr.add(n.toString())})}Wr(e){return 0}ei(e,n){return M.or([()=>M.resolve(this.Jr.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Hr(e,n)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Of{constructor(e,n,r,s){this.targetId=e,this.fromCache=n,this.$i=r,this.Ui=s}static Wi(e,n){let r=te(),s=te();for(const i of n.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Of(e,n.fromCache,r,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TR{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IR{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return fS()?8:sA(rt())>0?6:4}()}initialize(e,n){this.Ji=e,this.indexManager=n,this.Gi=!0}getDocumentsMatchingQuery(e,n,r,s){const i={result:null};return this.Yi(e,n).next(o=>{i.result=o}).next(()=>{if(!i.result)return this.Zi(e,n,s,r).next(o=>{i.result=o})}).next(()=>{if(i.result)return;const o=new TR;return this.Xi(e,n,o).next(l=>{if(i.result=l,this.zi)return this.es(e,n,o,l.size)})}).next(()=>i.result)}es(e,n,r,s){return r.documentReadCount<this.ji?(Ni()<=ne.DEBUG&&W("QueryEngine","SDK will not create cache indexes for query:",os(n),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),M.resolve()):(Ni()<=ne.DEBUG&&W("QueryEngine","Query:",os(n),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Hi*s?(Ni()<=ne.DEBUG&&W("QueryEngine","The SDK decides to create cache indexes for query:",os(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Zt(n))):M.resolve())}Yi(e,n){if(py(n))return M.resolve(null);let r=Zt(n);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(n.limit!==null&&s===1&&(n=Gd(n,null,"F"),r=Zt(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next(i=>{const o=te(...i);return this.Ji.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,r).next(u=>{const h=this.ts(n,l);return this.ns(n,h,o,u.readTime)?this.Yi(e,Gd(n,null,"F")):this.rs(e,h,n,u)}))})))}Zi(e,n,r,s){return py(n)||s.isEqual(Y.min())?M.resolve(null):this.Ji.getDocuments(e,r).next(i=>{const o=this.ts(n,i);return this.ns(n,o,r,s)?M.resolve(null):(Ni()<=ne.DEBUG&&W("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),os(n)),this.rs(e,o,n,ZC(s,-1)).next(l=>l))})}ts(e,n){let r=new Be(kw(e));return n.forEach((s,i)=>{wu(e,i)&&(r=r.add(i))}),r}ns(e,n,r,s){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const i=e.limitType==="F"?n.last():n.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Xi(e,n,r){return Ni()<=ne.DEBUG&&W("QueryEngine","Using full collection scan to execute query:",os(n)),this.Ji.getDocumentsMatchingQuery(e,n,hr.min(),r)}rs(e,n,r,s){return this.Ji.getDocumentsMatchingQuery(e,r,s).next(i=>(n.forEach(o=>{i=i.insert(o.key,o)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SR{constructor(e,n,r,s){this.persistence=e,this.ss=n,this.serializer=s,this.os=new xe(oe),this._s=new ii(i=>kf(i),Cf),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new fR(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.os))}}function kR(t,e,n,r){return new SR(t,e,n,r)}async function Kw(t,e){const n=X(t);return await n.persistence.runTransaction("Handle user change","readonly",r=>{let s;return n.mutationQueue.getAllMutationBatches(r).next(i=>(s=i,n.ls(e),n.mutationQueue.getAllMutationBatches(r))).next(i=>{const o=[],l=[];let u=te();for(const h of s){o.push(h.batchId);for(const p of h.mutations)u=u.add(p.key)}for(const h of i){l.push(h.batchId);for(const p of h.mutations)u=u.add(p.key)}return n.localDocuments.getDocuments(r,u).next(h=>({hs:h,removedBatchIds:o,addedBatchIds:l}))})})}function CR(t,e){const n=X(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=e.batch.keys(),i=n.cs.newChangeBuffer({trackRemovals:!0});return function(l,u,h,p){const m=h.batch,y=m.keys();let k=M.resolve();return y.forEach(T=>{k=k.next(()=>p.getEntry(u,T)).next(R=>{const j=h.docVersions.get(T);le(j!==null),R.version.compareTo(j)<0&&(m.applyToRemoteDocument(R,h),R.isValidDocument()&&(R.setReadTime(h.commitVersion),p.addEntry(R)))})}),k.next(()=>l.mutationQueue.removeMutationBatch(u,m))}(n,r,e,i).next(()=>i.apply(r)).next(()=>n.mutationQueue.performConsistencyCheck(r)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let u=te();for(let h=0;h<l.mutationResults.length;++h)l.mutationResults[h].transformResults.length>0&&(u=u.add(l.batch.mutations[h].key));return u}(e))).next(()=>n.localDocuments.getDocuments(r,s))})}function Gw(t){const e=X(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Ur.getLastRemoteSnapshotVersion(n))}function AR(t,e){const n=X(t),r=e.snapshotVersion;let s=n.os;return n.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const o=n.cs.newChangeBuffer({trackRemovals:!0});s=n.os;const l=[];e.targetChanges.forEach((p,m)=>{const y=s.get(m);if(!y)return;l.push(n.Ur.removeMatchingKeys(i,p.removedDocuments,m).next(()=>n.Ur.addMatchingKeys(i,p.addedDocuments,m)));let k=y.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?k=k.withResumeToken(We.EMPTY_BYTE_STRING,Y.min()).withLastLimboFreeSnapshotVersion(Y.min()):p.resumeToken.approximateByteSize()>0&&(k=k.withResumeToken(p.resumeToken,r)),s=s.insert(m,k),function(R,j,S){return R.resumeToken.approximateByteSize()===0||j.snapshotVersion.toMicroseconds()-R.snapshotVersion.toMicroseconds()>=3e8?!0:S.addedDocuments.size+S.modifiedDocuments.size+S.removedDocuments.size>0}(y,k,p)&&l.push(n.Ur.updateTargetData(i,k))});let u=Cn(),h=te();if(e.documentUpdates.forEach(p=>{e.resolvedLimboDocuments.has(p)&&l.push(n.persistence.referenceDelegate.updateLimboDocument(i,p))}),l.push(RR(i,o,e.documentUpdates).next(p=>{u=p.Ps,h=p.Is})),!r.isEqual(Y.min())){const p=n.Ur.getLastRemoteSnapshotVersion(i).next(m=>n.Ur.setTargetsMetadata(i,i.currentSequenceNumber,r));l.push(p)}return M.waitFor(l).next(()=>o.apply(i)).next(()=>n.localDocuments.getLocalViewOfDocuments(i,u,h)).next(()=>u)}).then(i=>(n.os=s,i))}function RR(t,e,n){let r=te(),s=te();return n.forEach(i=>r=r.add(i)),e.getEntries(t,r).next(i=>{let o=Cn();return n.forEach((l,u)=>{const h=i.get(l);u.isFoundDocument()!==h.isFoundDocument()&&(s=s.add(l)),u.isNoDocument()&&u.version.isEqual(Y.min())?(e.removeEntry(l,u.readTime),o=o.insert(l,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||u.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(u),o=o.insert(l,u)):W("LocalStore","Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",u.version)}),{Ps:o,Is:s}})}function bR(t,e){const n=X(t);return n.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function NR(t,e){const n=X(t);return n.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return n.Ur.getTargetData(r,e).next(i=>i?(s=i,M.resolve(s)):n.Ur.allocateTargetId(r).next(o=>(s=new Gn(e,o,"TargetPurposeListen",r.currentSequenceNumber),n.Ur.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=n.os.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(n.os=n.os.insert(r.targetId,r),n._s.set(e,r.targetId)),r})}async function Zd(t,e,n){const r=X(t),s=r.os.get(e),i=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",i,o=>r.persistence.referenceDelegate.removeTarget(o,s))}catch(o){if(!Ho(o))throw o;W("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}r.os=r.os.remove(e),r._s.delete(s.target)}function Sy(t,e,n){const r=X(t);let s=Y.min(),i=te();return r.persistence.runTransaction("Execute query","readwrite",o=>function(u,h,p){const m=X(u),y=m._s.get(p);return y!==void 0?M.resolve(m.os.get(y)):m.Ur.getTargetData(h,p)}(r,o,Zt(e)).next(l=>{if(l)return s=l.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(o,l.targetId).next(u=>{i=u})}).next(()=>r.ss.getDocumentsMatchingQuery(o,e,n?s:Y.min(),n?i:te())).next(l=>(PR(r,EA(e),l),{documents:l,Ts:i})))}function PR(t,e,n){let r=t.us.get(e)||Y.min();n.forEach((s,i)=>{i.readTime.compareTo(r)>0&&(r=i.readTime)}),t.us.set(e,r)}class ky{constructor(){this.activeTargetIds=AA()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class jR{constructor(){this.so=new ky,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e,n=!0){return n&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,n,r){this.oo[e]=n}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new ky,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DR{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cy{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){W("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){W("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let La=null;function jc(){return La===null?La=function(){return 268435456+Math.round(2147483648*Math.random())}():La++,"0x"+La.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OR={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VR{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xe="WebChannelConnection";class LR extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const r=n.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+n.host,this.vo=`projects/${s}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${i}`}get Fo(){return!1}Mo(n,r,s,i,o){const l=jc(),u=this.xo(n,r.toUriEncodedString());W("RestConnection",`Sending RPC '${n}' ${l}:`,u,s);const h={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(h,i,o),this.No(n,u,h,s).then(p=>(W("RestConnection",`Received RPC '${n}' ${l}: `,p),p),p=>{throw zs("RestConnection",`RPC '${n}' ${l} failed with error: `,p,"url: ",u,"request:",s),p})}Lo(n,r,s,i,o,l){return this.Mo(n,r,s,i,o)}Oo(n,r,s){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+ni}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((i,o)=>n[o]=i),s&&s.headers.forEach((i,o)=>n[o]=i)}xo(n,r){const s=OR[n];return`${this.Do}/v1/${r}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,n,r,s){const i=jc();return new Promise((o,l)=>{const u=new lw;u.setWithCredentials(!0),u.listenOnce(uw.COMPLETE,()=>{try{switch(u.getLastErrorCode()){case el.NO_ERROR:const p=u.getResponseJson();W(Xe,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(p)),o(p);break;case el.TIMEOUT:W(Xe,`RPC '${e}' ${i} timed out`),l(new q(V.DEADLINE_EXCEEDED,"Request time out"));break;case el.HTTP_ERROR:const m=u.getStatus();if(W(Xe,`RPC '${e}' ${i} failed with status:`,m,"response text:",u.getResponseText()),m>0){let y=u.getResponseJson();Array.isArray(y)&&(y=y[0]);const k=y==null?void 0:y.error;if(k&&k.status&&k.message){const T=function(j){const S=j.toLowerCase().replace(/_/g,"-");return Object.values(V).indexOf(S)>=0?S:V.UNKNOWN}(k.status);l(new q(T,k.message))}else l(new q(V.UNKNOWN,"Server responded with status "+u.getStatus()))}else l(new q(V.UNAVAILABLE,"Connection failed."));break;default:G()}}finally{W(Xe,`RPC '${e}' ${i} completed.`)}});const h=JSON.stringify(s);W(Xe,`RPC '${e}' ${i} sending request:`,s),u.send(n,"POST",h,r,15)})}Bo(e,n,r){const s=jc(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=hw(),l=dw(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(u.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Oo(u.initMessageHeaders,n,r),u.encodeInitMessageHeaders=!0;const p=i.join("");W(Xe,`Creating RPC '${e}' stream ${s}: ${p}`,u);const m=o.createWebChannel(p,u);let y=!1,k=!1;const T=new VR({Io:j=>{k?W(Xe,`Not sending because RPC '${e}' stream ${s} is closed:`,j):(y||(W(Xe,`Opening RPC '${e}' stream ${s} transport.`),m.open(),y=!0),W(Xe,`RPC '${e}' stream ${s} sending:`,j),m.send(j))},To:()=>m.close()}),R=(j,S,v)=>{j.listen(S,w=>{try{v(w)}catch(P){setTimeout(()=>{throw P},0)}})};return R(m,Ui.EventType.OPEN,()=>{k||(W(Xe,`RPC '${e}' stream ${s} transport opened.`),T.yo())}),R(m,Ui.EventType.CLOSE,()=>{k||(k=!0,W(Xe,`RPC '${e}' stream ${s} transport closed`),T.So())}),R(m,Ui.EventType.ERROR,j=>{k||(k=!0,zs(Xe,`RPC '${e}' stream ${s} transport errored:`,j),T.So(new q(V.UNAVAILABLE,"The operation could not be completed")))}),R(m,Ui.EventType.MESSAGE,j=>{var S;if(!k){const v=j.data[0];le(!!v);const w=v,P=w.error||((S=w[0])===null||S===void 0?void 0:S.error);if(P){W(Xe,`RPC '${e}' stream ${s} received error:`,P);const L=P.status;let F=function(E){const x=Ae[E];if(x!==void 0)return Lw(x)}(L),I=P.message;F===void 0&&(F=V.INTERNAL,I="Unknown error status: "+L+" with message "+P.message),k=!0,T.So(new q(F,I)),m.close()}else W(Xe,`RPC '${e}' stream ${s} received:`,v),T.bo(v)}}),R(l,cw.STAT_EVENT,j=>{j.stat===Bd.PROXY?W(Xe,`RPC '${e}' stream ${s} detected buffering proxy`):j.stat===Bd.NOPROXY&&W(Xe,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{T.wo()},0),T}}function Dc(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Iu(t){return new KA(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qw{constructor(e,n,r=1e3,s=1.5,i=6e4){this.ui=e,this.timerId=n,this.ko=r,this.qo=s,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const n=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),s=Math.max(0,n-r);s>0&&W("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yw{constructor(e,n,r,s,i,o,l,u){this.ui=e,this.Ho=r,this.Jo=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=u,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Qw(e,n)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,n){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():n&&n.code===V.RESOURCE_EXHAUSTED?(kn(n.toString()),kn("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):n&&n.code===V.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(n)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),n=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.Yo===n&&this.P_(r,s)},r=>{e(()=>{const s=new q(V.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(s)})})}P_(e,n){const r=this.h_(this.Yo);this.stream=this.T_(e,n),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{r(()=>this.I_(s))}),this.stream.onMessage(s=>{r(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return W("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return n=>{this.ui.enqueueAndForget(()=>this.Yo===e?n():(W("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class MR extends Yw{constructor(e,n,r,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,s,o),this.serializer=i}T_(e,n){return this.connection.Bo("Listen",e,n)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const n=YA(this.serializer,e),r=function(i){if(!("targetChange"in i))return Y.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?Y.min():o.readTime?en(o.readTime):Y.min()}(e);return this.listener.d_(n,r)}A_(e){const n={};n.database=Jd(this.serializer),n.addTarget=function(i,o){let l;const u=o.target;if(l=Hd(u)?{documents:ZA(i,u)}:{query:eR(i,u)._t},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=Uw(i,o.resumeToken);const h=Qd(i,o.expectedCount);h!==null&&(l.expectedCount=h)}else if(o.snapshotVersion.compareTo(Y.min())>0){l.readTime=Bl(i,o.snapshotVersion.toTimestamp());const h=Qd(i,o.expectedCount);h!==null&&(l.expectedCount=h)}return l}(this.serializer,e);const r=nR(this.serializer,e);r&&(n.labels=r),this.a_(n)}R_(e){const n={};n.database=Jd(this.serializer),n.removeTarget=e,this.a_(n)}}class FR extends Yw{constructor(e,n,r,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,r,s,o),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,n){return this.connection.Bo("Write",e,n)}E_(e){return le(!!e.streamToken),this.lastStreamToken=e.streamToken,le(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){le(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const n=JA(e.writeResults,e.commitTime),r=en(e.commitTime);return this.listener.g_(r,n)}p_(){const e={};e.database=Jd(this.serializer),this.a_(e)}m_(e){const n={streamToken:this.lastStreamToken,writes:e.map(r=>XA(this.serializer,r))};this.a_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UR extends class{}{constructor(e,n,r,s){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new q(V.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,n,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.Mo(e,Yd(n,r),s,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===V.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new q(V.UNKNOWN,i.toString())})}Lo(e,n,r,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Lo(e,Yd(n,r),s,o,l,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===V.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new q(V.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class zR{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(kn(n),this.D_=!1):W("OnlineStateTracker",n)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BR{constructor(e,n,r,s,i){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(o=>{r.enqueueAndForget(async()=>{Jr(this)&&(W("RemoteStore","Restarting streams for network reachability change."),await async function(u){const h=X(u);h.L_.add(4),await Qo(h),h.q_.set("Unknown"),h.L_.delete(4),await Su(h)}(this))})}),this.q_=new zR(r,s)}}async function Su(t){if(Jr(t))for(const e of t.B_)await e(!0)}async function Qo(t){for(const e of t.B_)await e(!1)}function Xw(t,e){const n=X(t);n.N_.has(e.targetId)||(n.N_.set(e.targetId,e),Ff(n)?Mf(n):oi(n).r_()&&Lf(n,e))}function Vf(t,e){const n=X(t),r=oi(n);n.N_.delete(e),r.r_()&&Jw(n,e),n.N_.size===0&&(r.r_()?r.o_():Jr(n)&&n.q_.set("Unknown"))}function Lf(t,e){if(t.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Y.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}oi(t).A_(e)}function Jw(t,e){t.Q_.xe(e),oi(t).R_(e)}function Mf(t){t.Q_=new $A({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.N_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),oi(t).start(),t.q_.v_()}function Ff(t){return Jr(t)&&!oi(t).n_()&&t.N_.size>0}function Jr(t){return X(t).L_.size===0}function Zw(t){t.Q_=void 0}async function $R(t){t.q_.set("Online")}async function qR(t){t.N_.forEach((e,n)=>{Lf(t,e)})}async function WR(t,e){Zw(t),Ff(t)?(t.q_.M_(e),Mf(t)):t.q_.set("Unknown")}async function HR(t,e,n){if(t.q_.set("Online"),e instanceof Fw&&e.state===2&&e.cause)try{await async function(s,i){const o=i.cause;for(const l of i.targetIds)s.N_.has(l)&&(await s.remoteSyncer.rejectListen(l,o),s.N_.delete(l),s.Q_.removeTarget(l))}(t,e)}catch(r){W("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await $l(t,r)}else if(e instanceof rl?t.Q_.Ke(e):e instanceof Mw?t.Q_.He(e):t.Q_.We(e),!n.isEqual(Y.min()))try{const r=await Gw(t.localStore);n.compareTo(r)>=0&&await function(i,o){const l=i.Q_.rt(o);return l.targetChanges.forEach((u,h)=>{if(u.resumeToken.approximateByteSize()>0){const p=i.N_.get(h);p&&i.N_.set(h,p.withResumeToken(u.resumeToken,o))}}),l.targetMismatches.forEach((u,h)=>{const p=i.N_.get(u);if(!p)return;i.N_.set(u,p.withResumeToken(We.EMPTY_BYTE_STRING,p.snapshotVersion)),Jw(i,u);const m=new Gn(p.target,u,h,p.sequenceNumber);Lf(i,m)}),i.remoteSyncer.applyRemoteEvent(l)}(t,n)}catch(r){W("RemoteStore","Failed to raise snapshot:",r),await $l(t,r)}}async function $l(t,e,n){if(!Ho(e))throw e;t.L_.add(1),await Qo(t),t.q_.set("Offline"),n||(n=()=>Gw(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{W("RemoteStore","Retrying IndexedDB access"),await n(),t.L_.delete(1),await Su(t)})}function ex(t,e){return e().catch(n=>$l(t,n,e))}async function ku(t){const e=X(t),n=pr(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;KR(e);)try{const s=await bR(e.localStore,r);if(s===null){e.O_.length===0&&n.o_();break}r=s.batchId,GR(e,s)}catch(s){await $l(e,s)}tx(e)&&nx(e)}function KR(t){return Jr(t)&&t.O_.length<10}function GR(t,e){t.O_.push(e);const n=pr(t);n.r_()&&n.V_&&n.m_(e.mutations)}function tx(t){return Jr(t)&&!pr(t).n_()&&t.O_.length>0}function nx(t){pr(t).start()}async function QR(t){pr(t).p_()}async function YR(t){const e=pr(t);for(const n of t.O_)e.m_(n.mutations)}async function XR(t,e,n){const r=t.O_.shift(),s=bf.from(r,e,n);await ex(t,()=>t.remoteSyncer.applySuccessfulWrite(s)),await ku(t)}async function JR(t,e){e&&pr(t).V_&&await async function(r,s){if(function(o){return UA(o)&&o!==V.ABORTED}(s.code)){const i=r.O_.shift();pr(r).s_(),await ex(r,()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s)),await ku(r)}}(t,e),tx(t)&&nx(t)}async function Ay(t,e){const n=X(t);n.asyncQueue.verifyOperationInProgress(),W("RemoteStore","RemoteStore received new credentials");const r=Jr(n);n.L_.add(3),await Qo(n),r&&n.q_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.L_.delete(3),await Su(n)}async function ZR(t,e){const n=X(t);e?(n.L_.delete(2),await Su(n)):e||(n.L_.add(2),await Qo(n),n.q_.set("Unknown"))}function oi(t){return t.K_||(t.K_=function(n,r,s){const i=X(n);return i.w_(),new MR(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(t.datastore,t.asyncQueue,{Eo:$R.bind(null,t),Ro:qR.bind(null,t),mo:WR.bind(null,t),d_:HR.bind(null,t)}),t.B_.push(async e=>{e?(t.K_.s_(),Ff(t)?Mf(t):t.q_.set("Unknown")):(await t.K_.stop(),Zw(t))})),t.K_}function pr(t){return t.U_||(t.U_=function(n,r,s){const i=X(n);return i.w_(),new FR(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(t.datastore,t.asyncQueue,{Eo:()=>Promise.resolve(),Ro:QR.bind(null,t),mo:JR.bind(null,t),f_:YR.bind(null,t),g_:XR.bind(null,t)}),t.B_.push(async e=>{e?(t.U_.s_(),await ku(t)):(await t.U_.stop(),t.O_.length>0&&(W("RemoteStore",`Stopping write stream with ${t.O_.length} pending writes`),t.O_=[]))})),t.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uf{constructor(e,n,r,s,i){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new ar,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,s,i){const o=Date.now()+r,l=new Uf(e,n,o,s,i);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new q(V.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function zf(t,e){if(kn("AsyncQueue",`${e}: ${t}`),Ho(t))return new q(V.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ns{constructor(e){this.comparator=e?(n,r)=>e(n,r)||H.comparator(n.key,r.key):(n,r)=>H.comparator(n.key,r.key),this.keyedMap=zi(),this.sortedSet=new xe(this.comparator)}static emptySet(e){return new Ns(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,r)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof Ns)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;n.hasNext();){const s=n.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const r=new Ns;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=n,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ry{constructor(){this.W_=new xe(H.comparator)}track(e){const n=e.doc.key,r=this.W_.get(n);r?e.type!==0&&r.type===3?this.W_=this.W_.insert(n,e):e.type===3&&r.type!==1?this.W_=this.W_.insert(n,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.W_=this.W_.insert(n,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.W_=this.W_.remove(n):e.type===1&&r.type===2?this.W_=this.W_.insert(n,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):G():this.W_=this.W_.insert(n,e)}G_(){const e=[];return this.W_.inorderTraversal((n,r)=>{e.push(r)}),e}}class Hs{constructor(e,n,r,s,i,o,l,u,h){this.query=e,this.docs=n,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=u,this.hasCachedResults=h}static fromInitialDocuments(e,n,r,s,i){const o=[];return n.forEach(l=>{o.push({type:0,doc:l})}),new Hs(e,n,Ns.emptySet(n),o,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&_u(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,r=e.docChanges;if(n.length!==r.length)return!1;for(let s=0;s<n.length;s++)if(n[s].type!==r[s].type||!n[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eb{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class tb{constructor(){this.queries=by(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(n,r){const s=X(n),i=s.queries;s.queries=by(),i.forEach((o,l)=>{for(const u of l.j_)u.onError(r)})})(this,new q(V.ABORTED,"Firestore shutting down"))}}function by(){return new ii(t=>Sw(t),_u)}async function rx(t,e){const n=X(t);let r=3;const s=e.query;let i=n.queries.get(s);i?!i.H_()&&e.J_()&&(r=2):(i=new eb,r=e.J_()?0:1);try{switch(r){case 0:i.z_=await n.onListen(s,!0);break;case 1:i.z_=await n.onListen(s,!1);break;case 2:await n.onFirstRemoteStoreListen(s)}}catch(o){const l=zf(o,`Initialization of query '${os(e.query)}' failed`);return void e.onError(l)}n.queries.set(s,i),i.j_.push(e),e.Z_(n.onlineState),i.z_&&e.X_(i.z_)&&Bf(n)}async function sx(t,e){const n=X(t),r=e.query;let s=3;const i=n.queries.get(r);if(i){const o=i.j_.indexOf(e);o>=0&&(i.j_.splice(o,1),i.j_.length===0?s=e.J_()?0:1:!i.H_()&&e.J_()&&(s=2))}switch(s){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function nb(t,e){const n=X(t);let r=!1;for(const s of e){const i=s.query,o=n.queries.get(i);if(o){for(const l of o.j_)l.X_(s)&&(r=!0);o.z_=s}}r&&Bf(n)}function rb(t,e,n){const r=X(t),s=r.queries.get(e);if(s)for(const i of s.j_)i.onError(n);r.queries.delete(e)}function Bf(t){t.Y_.forEach(e=>{e.next()})}var eh,Ny;(Ny=eh||(eh={})).ea="default",Ny.Cache="cache";class ix{constructor(e,n,r){this.query=e,this.ta=n,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new Hs(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.na?this.ia(e)&&(this.ta.next(e),n=!0):this.sa(e,this.onlineState)&&(this.oa(e),n=!0),this.ra=e,n}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let n=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),n=!0),n}sa(e,n){if(!e.fromCache||!this.J_())return!0;const r=n!=="Offline";return(!this.options._a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const n=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}oa(e){e=Hs.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==eh.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ox{constructor(e){this.key=e}}class ax{constructor(e){this.key=e}}class sb{constructor(e,n){this.query=e,this.Ta=n,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=te(),this.mutatedKeys=te(),this.Aa=kw(e),this.Ra=new Ns(this.Aa)}get Va(){return this.Ta}ma(e,n){const r=n?n.fa:new Ry,s=n?n.Ra:this.Ra;let i=n?n.mutatedKeys:this.mutatedKeys,o=s,l=!1;const u=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,h=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((p,m)=>{const y=s.get(p),k=wu(this.query,m)?m:null,T=!!y&&this.mutatedKeys.has(y.key),R=!!k&&(k.hasLocalMutations||this.mutatedKeys.has(k.key)&&k.hasCommittedMutations);let j=!1;y&&k?y.data.isEqual(k.data)?T!==R&&(r.track({type:3,doc:k}),j=!0):this.ga(y,k)||(r.track({type:2,doc:k}),j=!0,(u&&this.Aa(k,u)>0||h&&this.Aa(k,h)<0)&&(l=!0)):!y&&k?(r.track({type:0,doc:k}),j=!0):y&&!k&&(r.track({type:1,doc:y}),j=!0,(u||h)&&(l=!0)),j&&(k?(o=o.add(k),i=R?i.add(p):i.delete(p)):(o=o.delete(p),i=i.delete(p)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const p=this.query.limitType==="F"?o.last():o.first();o=o.delete(p.key),i=i.delete(p.key),r.track({type:1,doc:p})}return{Ra:o,fa:r,ns:l,mutatedKeys:i}}ga(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,r,s){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((p,m)=>function(k,T){const R=j=>{switch(j){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return G()}};return R(k)-R(T)}(p.type,m.type)||this.Aa(p.doc,m.doc)),this.pa(r),s=s!=null&&s;const l=n&&!s?this.ya():[],u=this.da.size===0&&this.current&&!s?1:0,h=u!==this.Ea;return this.Ea=u,o.length!==0||h?{snapshot:new Hs(this.query,e.Ra,i,o,e.mutatedKeys,u===0,h,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new Ry,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(n=>this.Ta=this.Ta.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ta=this.Ta.delete(n)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=te(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const n=[];return e.forEach(r=>{this.da.has(r)||n.push(new ax(r))}),this.da.forEach(r=>{e.has(r)||n.push(new ox(r))}),n}ba(e){this.Ta=e.Ts,this.da=te();const n=this.ma(e.documents);return this.applyChanges(n,!0)}Da(){return Hs.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class ib{constructor(e,n,r){this.query=e,this.targetId=n,this.view=r}}class ob{constructor(e){this.key=e,this.va=!1}}class ab{constructor(e,n,r,s,i,o){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new ii(l=>Sw(l),_u),this.Ma=new Map,this.xa=new Set,this.Oa=new xe(H.comparator),this.Na=new Map,this.La=new jf,this.Ba={},this.ka=new Map,this.qa=Ws.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function lb(t,e,n=!0){const r=fx(t);let s;const i=r.Fa.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Da()):s=await lx(r,e,n,!0),s}async function ub(t,e){const n=fx(t);await lx(n,e,!0,!1)}async function lx(t,e,n,r){const s=await NR(t.localStore,Zt(e)),i=s.targetId,o=t.sharedClientState.addLocalQueryTarget(i,n);let l;return r&&(l=await cb(t,e,i,o==="current",s.resumeToken)),t.isPrimaryClient&&n&&Xw(t.remoteStore,s),l}async function cb(t,e,n,r,s){t.Ka=(m,y,k)=>async function(R,j,S,v){let w=j.view.ma(S);w.ns&&(w=await Sy(R.localStore,j.query,!1).then(({documents:I})=>j.view.ma(I,w)));const P=v&&v.targetChanges.get(j.targetId),L=v&&v.targetMismatches.get(j.targetId)!=null,F=j.view.applyChanges(w,R.isPrimaryClient,P,L);return jy(R,j.targetId,F.wa),F.snapshot}(t,m,y,k);const i=await Sy(t.localStore,e,!0),o=new sb(e,i.Ts),l=o.ma(i.documents),u=Go.createSynthesizedTargetChangeForCurrentChange(n,r&&t.onlineState!=="Offline",s),h=o.applyChanges(l,t.isPrimaryClient,u);jy(t,n,h.wa);const p=new ib(e,n,o);return t.Fa.set(e,p),t.Ma.has(n)?t.Ma.get(n).push(e):t.Ma.set(n,[e]),h.snapshot}async function db(t,e,n){const r=X(t),s=r.Fa.get(e),i=r.Ma.get(s.targetId);if(i.length>1)return r.Ma.set(s.targetId,i.filter(o=>!_u(o,e))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Zd(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),n&&Vf(r.remoteStore,s.targetId),th(r,s.targetId)}).catch(Wo)):(th(r,s.targetId),await Zd(r.localStore,s.targetId,!0))}async function hb(t,e){const n=X(t),r=n.Fa.get(e),s=n.Ma.get(r.targetId);n.isPrimaryClient&&s.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),Vf(n.remoteStore,r.targetId))}async function fb(t,e,n){const r=wb(t);try{const s=await function(o,l){const u=X(o),h=je.now(),p=l.reduce((k,T)=>k.add(T.key),te());let m,y;return u.persistence.runTransaction("Locally write mutations","readwrite",k=>{let T=Cn(),R=te();return u.cs.getEntries(k,p).next(j=>{T=j,T.forEach((S,v)=>{v.isValidDocument()||(R=R.add(S))})}).next(()=>u.localDocuments.getOverlayedDocuments(k,T)).next(j=>{m=j;const S=[];for(const v of l){const w=OA(v,m.get(v.key).overlayedDocument);w!=null&&S.push(new Xr(v.key,w,yw(w.value.mapValue),Ut.exists(!0)))}return u.mutationQueue.addMutationBatch(k,h,S,l)}).next(j=>{y=j;const S=j.applyToLocalDocumentSet(m,R);return u.documentOverlayCache.saveOverlays(k,j.batchId,S)})}).then(()=>({batchId:y.batchId,changes:Aw(m)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),function(o,l,u){let h=o.Ba[o.currentUser.toKey()];h||(h=new xe(oe)),h=h.insert(l,u),o.Ba[o.currentUser.toKey()]=h}(r,s.batchId,n),await Yo(r,s.changes),await ku(r.remoteStore)}catch(s){const i=zf(s,"Failed to persist write");n.reject(i)}}async function ux(t,e){const n=X(t);try{const r=await AR(n.localStore,e);e.targetChanges.forEach((s,i)=>{const o=n.Na.get(i);o&&(le(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?o.va=!0:s.modifiedDocuments.size>0?le(o.va):s.removedDocuments.size>0&&(le(o.va),o.va=!1))}),await Yo(n,r,e)}catch(r){await Wo(r)}}function Py(t,e,n){const r=X(t);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const s=[];r.Fa.forEach((i,o)=>{const l=o.view.Z_(e);l.snapshot&&s.push(l.snapshot)}),function(o,l){const u=X(o);u.onlineState=l;let h=!1;u.queries.forEach((p,m)=>{for(const y of m.j_)y.Z_(l)&&(h=!0)}),h&&Bf(u)}(r.eventManager,e),s.length&&r.Ca.d_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function pb(t,e,n){const r=X(t);r.sharedClientState.updateQueryState(e,"rejected",n);const s=r.Na.get(e),i=s&&s.key;if(i){let o=new xe(H.comparator);o=o.insert(i,et.newNoDocument(i,Y.min()));const l=te().add(i),u=new Tu(Y.min(),new Map,new xe(oe),o,l);await ux(r,u),r.Oa=r.Oa.remove(i),r.Na.delete(e),$f(r)}else await Zd(r.localStore,e,!1).then(()=>th(r,e,n)).catch(Wo)}async function mb(t,e){const n=X(t),r=e.batch.batchId;try{const s=await CR(n.localStore,e);dx(n,r,null),cx(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await Yo(n,s)}catch(s){await Wo(s)}}async function gb(t,e,n){const r=X(t);try{const s=await function(o,l){const u=X(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let p;return u.mutationQueue.lookupMutationBatch(h,l).next(m=>(le(m!==null),p=m.keys(),u.mutationQueue.removeMutationBatch(h,m))).next(()=>u.mutationQueue.performConsistencyCheck(h)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(h,p,l)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,p)).next(()=>u.localDocuments.getDocuments(h,p))})}(r.localStore,e);dx(r,e,n),cx(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await Yo(r,s)}catch(s){await Wo(s)}}function cx(t,e){(t.ka.get(e)||[]).forEach(n=>{n.resolve()}),t.ka.delete(e)}function dx(t,e,n){const r=X(t);let s=r.Ba[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(n?i.reject(n):i.resolve(),s=s.remove(e)),r.Ba[r.currentUser.toKey()]=s}}function th(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const r of t.Ma.get(e))t.Fa.delete(r),n&&t.Ca.$a(r,n);t.Ma.delete(e),t.isPrimaryClient&&t.La.gr(e).forEach(r=>{t.La.containsKey(r)||hx(t,r)})}function hx(t,e){t.xa.delete(e.path.canonicalString());const n=t.Oa.get(e);n!==null&&(Vf(t.remoteStore,n),t.Oa=t.Oa.remove(e),t.Na.delete(n),$f(t))}function jy(t,e,n){for(const r of n)r instanceof ox?(t.La.addReference(r.key,e),yb(t,r)):r instanceof ax?(W("SyncEngine","Document no longer in limbo: "+r.key),t.La.removeReference(r.key,e),t.La.containsKey(r.key)||hx(t,r.key)):G()}function yb(t,e){const n=e.key,r=n.path.canonicalString();t.Oa.get(n)||t.xa.has(r)||(W("SyncEngine","New document in limbo: "+n),t.xa.add(r),$f(t))}function $f(t){for(;t.xa.size>0&&t.Oa.size<t.maxConcurrentLimboResolutions;){const e=t.xa.values().next().value;t.xa.delete(e);const n=new H(pe.fromString(e)),r=t.qa.next();t.Na.set(r,new ob(n)),t.Oa=t.Oa.insert(n,r),Xw(t.remoteStore,new Gn(Zt(vu(n.path)),r,"TargetPurposeLimboResolution",Ef.oe))}}async function Yo(t,e,n){const r=X(t),s=[],i=[],o=[];r.Fa.isEmpty()||(r.Fa.forEach((l,u)=>{o.push(r.Ka(u,e,n).then(h=>{var p;if((h||n)&&r.isPrimaryClient){const m=h?!h.fromCache:(p=n==null?void 0:n.targetChanges.get(u.targetId))===null||p===void 0?void 0:p.current;r.sharedClientState.updateQueryState(u.targetId,m?"current":"not-current")}if(h){s.push(h);const m=Of.Wi(u.targetId,h);i.push(m)}}))}),await Promise.all(o),r.Ca.d_(s),await async function(u,h){const p=X(u);try{await p.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>M.forEach(h,y=>M.forEach(y.$i,k=>p.persistence.referenceDelegate.addReference(m,y.targetId,k)).next(()=>M.forEach(y.Ui,k=>p.persistence.referenceDelegate.removeReference(m,y.targetId,k)))))}catch(m){if(!Ho(m))throw m;W("LocalStore","Failed to update sequence numbers: "+m)}for(const m of h){const y=m.targetId;if(!m.fromCache){const k=p.os.get(y),T=k.snapshotVersion,R=k.withLastLimboFreeSnapshotVersion(T);p.os=p.os.insert(y,R)}}}(r.localStore,i))}async function vb(t,e){const n=X(t);if(!n.currentUser.isEqual(e)){W("SyncEngine","User change. New user:",e.toKey());const r=await Kw(n.localStore,e);n.currentUser=e,function(i,o){i.ka.forEach(l=>{l.forEach(u=>{u.reject(new q(V.CANCELLED,o))})}),i.ka.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Yo(n,r.hs)}}function _b(t,e){const n=X(t),r=n.Na.get(e);if(r&&r.va)return te().add(r.key);{let s=te();const i=n.Ma.get(e);if(!i)return s;for(const o of i){const l=n.Fa.get(o);s=s.unionWith(l.view.Va)}return s}}function fx(t){const e=X(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=ux.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=_b.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=pb.bind(null,e),e.Ca.d_=nb.bind(null,e.eventManager),e.Ca.$a=rb.bind(null,e.eventManager),e}function wb(t){const e=X(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=mb.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=gb.bind(null,e),e}class ql{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Iu(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,n){return null}Ha(e,n){return null}za(e){return kR(this.persistence,new IR,e.initialUser,this.serializer)}Ga(e){return new xR(Df.Zr,this.serializer)}Wa(e){return new jR}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}ql.provider={build:()=>new ql};class nh{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Py(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=vb.bind(null,this.syncEngine),await ZR(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new tb}()}createDatastore(e){const n=Iu(e.databaseInfo.databaseId),r=function(i){return new LR(i)}(e.databaseInfo);return function(i,o,l,u){return new UR(i,o,l,u)}(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return function(r,s,i,o,l){return new BR(r,s,i,o,l)}(this.localStore,this.datastore,e.asyncQueue,n=>Py(this.syncEngine,n,0),function(){return Cy.D()?new Cy:new DR}())}createSyncEngine(e,n){return function(s,i,o,l,u,h,p){const m=new ab(s,i,o,l,u,h);return p&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(s){const i=X(s);W("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await Qo(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}nh.provider={build:()=>new nh};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class px{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):kn("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xb{constructor(e,n,r,s,i){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this.databaseInfo=s,this.user=Je.UNAUTHENTICATED,this.clientId=pw.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,async o=>{W("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(r,o=>(W("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new ar;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=zf(n,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function Oc(t,e){t.asyncQueue.verifyOperationInProgress(),W("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async s=>{r.isEqual(s)||(await Kw(e.localStore,s),r=s)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function Dy(t,e){t.asyncQueue.verifyOperationInProgress();const n=await Eb(t);W("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(r=>Ay(e.remoteStore,r)),t.setAppCheckTokenChangeListener((r,s)=>Ay(e.remoteStore,s)),t._onlineComponents=e}async function Eb(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){W("FirestoreClient","Using user provided OfflineComponentProvider");try{await Oc(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(s){return s.name==="FirebaseError"?s.code===V.FAILED_PRECONDITION||s.code===V.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(n))throw n;zs("Error using user provided cache. Falling back to memory cache: "+n),await Oc(t,new ql)}}else W("FirestoreClient","Using default OfflineComponentProvider"),await Oc(t,new ql);return t._offlineComponents}async function mx(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(W("FirestoreClient","Using user provided OnlineComponentProvider"),await Dy(t,t._uninitializedComponentsProvider._online)):(W("FirestoreClient","Using default OnlineComponentProvider"),await Dy(t,new nh))),t._onlineComponents}function Tb(t){return mx(t).then(e=>e.syncEngine)}async function rh(t){const e=await mx(t),n=e.eventManager;return n.onListen=lb.bind(null,e.syncEngine),n.onUnlisten=db.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=ub.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=hb.bind(null,e.syncEngine),n}function Ib(t,e,n={}){const r=new ar;return t.asyncQueue.enqueueAndForget(async()=>function(i,o,l,u,h){const p=new px({next:y=>{p.Za(),o.enqueueAndForget(()=>sx(i,m));const k=y.docs.has(l);!k&&y.fromCache?h.reject(new q(V.UNAVAILABLE,"Failed to get document because the client is offline.")):k&&y.fromCache&&u&&u.source==="server"?h.reject(new q(V.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(y)},error:y=>h.reject(y)}),m=new ix(vu(l.path),p,{includeMetadataChanges:!0,_a:!0});return rx(i,m)}(await rh(t),t.asyncQueue,e,n,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gx(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oy=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yx(t,e,n){if(!n)throw new q(V.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function Sb(t,e,n,r){if(e===!0&&r===!0)throw new q(V.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function Vy(t){if(!H.isDocumentKey(t))throw new q(V.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function Ly(t){if(H.isDocumentKey(t))throw new q(V.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function Cu(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":G()}function tn(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new q(V.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Cu(t);throw new q(V.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class My{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new q(V.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new q(V.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Sb("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=gx((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new q(V.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new q(V.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new q(V.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Au{constructor(e,n,r,s){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new My({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new q(V.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new q(V.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new My(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new qC;switch(r.type){case"firstParty":return new GC(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new q(V.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=Oy.get(n);r&&(W("ComponentProvider","Removing Datastore"),Oy.delete(n),r.terminate())}(this),Promise.resolve()}}function kb(t,e,n,r={}){var s;const i=(t=tn(t,Au))._getSettings(),o=`${e}:${n}`;if(i.host!=="firestore.googleapis.com"&&i.host!==o&&zs("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},i),{host:o,ssl:!1})),r.mockUserToken){let l,u;if(typeof r.mockUserToken=="string")l=r.mockUserToken,u=Je.MOCK_USER;else{l=oS(r.mockUserToken,(s=t._app)===null||s===void 0?void 0:s.options.projectId);const h=r.mockUserToken.sub||r.mockUserToken.user_id;if(!h)throw new q(V.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");u=new Je(h)}t._authCredentials=new WC(new fw(l,u))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zr{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Zr(this.firestore,e,this._query)}}class lt{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new lr(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new lt(this.firestore,e,this._key)}}class lr extends Zr{constructor(e,n,r){super(e,n,vu(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new lt(this.firestore,null,new H(e))}withConverter(e){return new lr(this.firestore,e,this._path)}}function zt(t,e,...n){if(t=qe(t),yx("collection","path",e),t instanceof Au){const r=pe.fromString(e,...n);return Ly(r),new lr(t,null,r)}{if(!(t instanceof lt||t instanceof lr))throw new q(V.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(pe.fromString(e,...n));return Ly(r),new lr(t.firestore,null,r)}}function Ks(t,e,...n){if(t=qe(t),arguments.length===1&&(e=pw.newId()),yx("doc","path",e),t instanceof Au){const r=pe.fromString(e,...n);return Vy(r),new lt(t,null,new H(r))}{if(!(t instanceof lt||t instanceof lr))throw new q(V.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(pe.fromString(e,...n));return Vy(r),new lt(t.firestore,t instanceof lr?t.converter:null,new H(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fy{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Qw(this,"async_queue_retry"),this.Vu=()=>{const r=Dc();r&&W("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const n=Dc();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const n=Dc();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const n=new ar;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Ho(e))throw e;W("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const n=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const s=function(o){let l=o.message||"";return o.stack&&(l=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),l}(r);throw kn("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.du=!1,r))));return this.mu=n,n}enqueueAfterDelay(e,n,r){this.fu(),this.Ru.indexOf(e)>-1&&(n=0);const s=Uf.createAndSchedule(this,e,n,r,i=>this.yu(i));return this.Tu.push(s),s}fu(){this.Eu&&G()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const n of this.Tu)if(n.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.Tu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const n=this.Tu.indexOf(e);this.Tu.splice(n,1)}}function Uy(t){return function(n,r){if(typeof n!="object"||n===null)return!1;const s=n;for(const i of r)if(i in s&&typeof s[i]=="function")return!0;return!1}(t,["next","error","complete"])}class Kr extends Au{constructor(e,n,r,s){super(e,n,r,s),this.type="firestore",this._queue=new Fy,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Fy(e),this._firestoreClient=void 0,await e}}}function Cb(t,e){const n=typeof t=="object"?t:I_(),r=typeof t=="string"?t:"(default)",s=df(n,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=sS("firestore");i&&kb(s,...i)}return s}function qf(t){if(t._terminated)throw new q(V.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||Ab(t),t._firestoreClient}function Ab(t){var e,n,r;const s=t._freezeSettings(),i=function(l,u,h,p){return new aA(l,u,h,p.host,p.ssl,p.experimentalForceLongPolling,p.experimentalAutoDetectLongPolling,gx(p.experimentalLongPollingOptions),p.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,s);t._componentsProvider||!((n=s.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(t._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),t._firestoreClient=new xb(t._authCredentials,t._appCheckCredentials,t._queue,i,t._componentsProvider&&function(l){const u=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(u),_online:u}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gs{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Gs(We.fromBase64String(e))}catch(n){throw new q(V.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Gs(We.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wf{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new q(V.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ue(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vx{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hf{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new q(V.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new q(V.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return oe(this._lat,e._lat)||oe(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kf{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rb=/^__.*__$/;class bb{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new Xr(e,this.data,this.fieldMask,n,this.fieldTransforms):new Ko(e,this.data,n,this.fieldTransforms)}}function _x(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw G()}}class Gf{constructor(e,n,r,s,i,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new Gf(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),s=this.Fu({path:r,xu:!1});return s.Ou(e),s}Nu(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),s=this.Fu({path:r,xu:!1});return s.vu(),s}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Wl(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(_x(this.Cu)&&Rb.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class Nb{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||Iu(e)}Qu(e,n,r,s=!1){return new Gf({Cu:e,methodName:n,qu:r,path:Ue.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Qf(t){const e=t._freezeSettings(),n=Iu(t._databaseId);return new Nb(t._databaseId,!!e.ignoreUndefinedProperties,n)}function wx(t,e,n,r,s,i={}){const o=t.Qu(i.merge||i.mergeFields?2:0,e,n,s);Tx("Data must be an object, but it was:",o,r);const l=xx(r,o);let u,h;if(i.merge)u=new Lt(o.fieldMask),h=o.fieldTransforms;else if(i.mergeFields){const p=[];for(const m of i.mergeFields){const y=jb(e,m,n);if(!o.contains(y))throw new q(V.INVALID_ARGUMENT,`Field '${y}' is specified in your field mask but missing from your input data.`);Ob(p,y)||p.push(y)}u=new Lt(p),h=o.fieldTransforms.filter(m=>u.covers(m.field))}else u=null,h=o.fieldTransforms;return new bb(new kt(l),u,h)}function Pb(t,e,n,r=!1){return Yf(n,t.Qu(r?4:3,e))}function Yf(t,e){if(Ex(t=qe(t)))return Tx("Unsupported field value:",e,t),xx(t,e);if(t instanceof vx)return function(r,s){if(!_x(s.Cu))throw s.Bu(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${r._methodName}() is not currently supported inside arrays`);const i=r._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,s){const i=[];let o=0;for(const l of r){let u=Yf(l,s.Lu(o));u==null&&(u={nullValue:"NULL_VALUE"}),i.push(u),o++}return{arrayValue:{values:i}}}(t,e)}return function(r,s){if((r=qe(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return RA(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const i=je.fromDate(r);return{timestampValue:Bl(s.serializer,i)}}if(r instanceof je){const i=new je(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Bl(s.serializer,i)}}if(r instanceof Hf)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Gs)return{bytesValue:Uw(s.serializer,r._byteString)};if(r instanceof lt){const i=s.databaseId,o=r.firestore._databaseId;if(!o.isEqual(i))throw s.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Pf(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Kf)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(u=>{if(typeof u!="number")throw l.Bu("VectorValues must only contain numeric values.");return Af(l.serializer,u)})}}}}}}(r,s);throw s.Bu(`Unsupported field value: ${Cu(r)}`)}(t,e)}function xx(t,e){const n={};return mw(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ri(t,(r,s)=>{const i=Yf(s,e.Mu(r));i!=null&&(n[r]=i)}),{mapValue:{fields:n}}}function Ex(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof je||t instanceof Hf||t instanceof Gs||t instanceof lt||t instanceof vx||t instanceof Kf)}function Tx(t,e,n){if(!Ex(n)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(n)){const r=Cu(n);throw r==="an object"?e.Bu(t+" a custom object"):e.Bu(t+" "+r)}}function jb(t,e,n){if((e=qe(e))instanceof Wf)return e._internalPath;if(typeof e=="string")return Ix(t,e);throw Wl("Field path arguments must be of type string or ",t,!1,void 0,n)}const Db=new RegExp("[~\\*/\\[\\]]");function Ix(t,e,n){if(e.search(Db)>=0)throw Wl(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Wf(...e.split("."))._internalPath}catch{throw Wl(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function Wl(t,e,n,r,s){const i=r&&!r.isEmpty(),o=s!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${r}`),o&&(u+=` in document ${s}`),u+=")"),new q(V.INVALID_ARGUMENT,l+t+u)}function Ob(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sx{constructor(e,n,r,s,i){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new lt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Vb(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(Xf("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class Vb extends Sx{data(){return super.data()}}function Xf(t,e){return typeof e=="string"?Ix(t,e):e instanceof Wf?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lb(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new q(V.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Jf{}class kx extends Jf{}function Hl(t,e,...n){let r=[];e instanceof Jf&&r.push(e),r=r.concat(n),function(i){const o=i.filter(u=>u instanceof ep).length,l=i.filter(u=>u instanceof Zf).length;if(o>1||o>0&&l>0)throw new q(V.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const s of r)t=s._apply(t);return t}class Zf extends kx{constructor(e,n,r){super(),this._field=e,this._op=n,this._value=r,this.type="where"}static _create(e,n,r){return new Zf(e,n,r)}_apply(e){const n=this._parse(e);return Cx(e._query,n),new Zr(e.firestore,e.converter,Kd(e._query,n))}_parse(e){const n=Qf(e.firestore);return function(i,o,l,u,h,p,m){let y;if(h.isKeyField()){if(p==="array-contains"||p==="array-contains-any")throw new q(V.INVALID_ARGUMENT,`Invalid Query. You can't perform '${p}' queries on documentId().`);if(p==="in"||p==="not-in"){By(m,p);const k=[];for(const T of m)k.push(zy(u,i,T));y={arrayValue:{values:k}}}else y=zy(u,i,m)}else p!=="in"&&p!=="not-in"&&p!=="array-contains-any"||By(m,p),y=Pb(l,o,m,p==="in"||p==="not-in");return be.create(h,p,y)}(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}class ep extends Jf{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new ep(e,n)}_parse(e){const n=this._queryConstraints.map(r=>r._parse(e)).filter(r=>r.getFilters().length>0);return n.length===1?n[0]:qt.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:(function(s,i){let o=s;const l=i.getFlattenedFilters();for(const u of l)Cx(o,u),o=Kd(o,u)}(e._query,n),new Zr(e.firestore,e.converter,Kd(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class tp extends kx{constructor(e,n){super(),this._field=e,this._direction=n,this.type="orderBy"}static _create(e,n){return new tp(e,n)}_apply(e){const n=function(s,i,o){if(s.startAt!==null)throw new q(V.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new q(V.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new bo(i,o)}(e._query,this._field,this._direction);return new Zr(e.firestore,e.converter,function(s,i){const o=s.explicitOrderBy.concat([i]);return new si(s.path,s.collectionGroup,o,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)}(e._query,n))}}function Kl(t,e="asc"){const n=e,r=Xf("orderBy",t);return tp._create(r,n)}function zy(t,e,n){if(typeof(n=qe(n))=="string"){if(n==="")throw new q(V.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Iw(e)&&n.indexOf("/")!==-1)throw new q(V.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=e.path.child(pe.fromString(n));if(!H.isDocumentKey(r))throw new q(V.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return ly(t,new H(r))}if(n instanceof lt)return ly(t,n._key);throw new q(V.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Cu(n)}.`)}function By(t,e){if(!Array.isArray(t)||t.length===0)throw new q(V.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Cx(t,e){const n=function(s,i){for(const o of s)for(const l of o.getFlattenedFilters())if(i.indexOf(l.op)>=0)return l.op;return null}(t.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(n!==null)throw n===e.op?new q(V.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new q(V.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}class Mb{convertValue(e,n="none"){switch(Hr(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Se(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Wr(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw G()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const r={};return ri(e,(s,i)=>{r[s]=this.convertValue(i,n)}),r}convertVectorValue(e){var n,r,s;const i=(s=(r=(n=e.fields)===null||n===void 0?void 0:n.value.arrayValue)===null||r===void 0?void 0:r.values)===null||s===void 0?void 0:s.map(o=>Se(o.doubleValue));return new Kf(i)}convertGeoPoint(e){return new Hf(Se(e.latitude),Se(e.longitude))}convertArray(e,n){return(e.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(e,n){switch(n){case"previous":const r=If(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(Co(e));default:return null}}convertTimestamp(e){const n=fr(e);return new je(n.seconds,n.nanos)}convertDocumentKey(e,n){const r=pe.fromString(e);le(Hw(r));const s=new Ao(r.get(1),r.get(3)),i=new H(r.popFirst(5));return s.isEqual(n)||kn(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ax(t,e,n){let r;return r=t?t.toFirestore(e):e,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $i{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Rx extends Sx{constructor(e,n,r,s,i,o){super(e,n,r,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new sl(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const r=this._document.data.field(Xf("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}}class sl extends Rx{data(e={}){return super.data(e)}}class Fb{constructor(e,n,r,s){this._firestore=e,this._userDataWriter=n,this._snapshot=s,this.metadata=new $i(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(r=>{e.call(n,new sl(this._firestore,this._userDataWriter,r.key,r,new $i(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new q(V.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map(l=>{const u=new sl(s._firestore,s._userDataWriter,l.doc.key,l.doc,new $i(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(l=>i||l.type!==3).map(l=>{const u=new sl(s._firestore,s._userDataWriter,l.doc.key,l.doc,new $i(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let h=-1,p=-1;return l.type!==0&&(h=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),p=o.indexOf(l.doc.key)),{type:Ub(l.type),doc:u,oldIndex:h,newIndex:p}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function Ub(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return G()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zb(t){t=tn(t,lt);const e=tn(t.firestore,Kr);return Ib(qf(e),t._key).then(n=>Nx(e,t,n))}class bx extends Mb{constructor(e){super(),this.firestore=e}convertBytes(e){return new Gs(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new lt(this.firestore,null,n)}}function Bb(t,e,n){t=tn(t,lt);const r=tn(t.firestore,Kr),s=Ax(t.converter,e);return sp(r,[wx(Qf(r),"setDoc",t._key,s,t.converter!==null,n).toMutation(t._key,Ut.none())])}function np(t){return sp(tn(t.firestore,Kr),[new Rf(t._key,Ut.none())])}function rp(t,e){const n=tn(t.firestore,Kr),r=Ks(t),s=Ax(t.converter,e);return sp(n,[wx(Qf(t.firestore),"addDoc",r._key,s,t.converter!==null,{}).toMutation(r._key,Ut.exists(!1))]).then(()=>r)}function ur(t,...e){var n,r,s;t=qe(t);let i={includeMetadataChanges:!1,source:"default"},o=0;typeof e[o]!="object"||Uy(e[o])||(i=e[o],o++);const l={includeMetadataChanges:i.includeMetadataChanges,source:i.source};if(Uy(e[o])){const m=e[o];e[o]=(n=m.next)===null||n===void 0?void 0:n.bind(m),e[o+1]=(r=m.error)===null||r===void 0?void 0:r.bind(m),e[o+2]=(s=m.complete)===null||s===void 0?void 0:s.bind(m)}let u,h,p;if(t instanceof lt)h=tn(t.firestore,Kr),p=vu(t._key.path),u={next:m=>{e[o]&&e[o](Nx(h,t,m))},error:e[o+1],complete:e[o+2]};else{const m=tn(t,Zr);h=tn(m.firestore,Kr),p=m._query;const y=new bx(h);u={next:k=>{e[o]&&e[o](new Fb(h,y,m,k))},error:e[o+1],complete:e[o+2]},Lb(t._query)}return function(y,k,T,R){const j=new px(R),S=new ix(k,j,T);return y.asyncQueue.enqueueAndForget(async()=>rx(await rh(y),S)),()=>{j.Za(),y.asyncQueue.enqueueAndForget(async()=>sx(await rh(y),S))}}(qf(h),p,l,u)}function sp(t,e){return function(r,s){const i=new ar;return r.asyncQueue.enqueueAndForget(async()=>fb(await Tb(r),s,i)),i.promise}(qf(t),e)}function Nx(t,e,n){const r=n.docs.get(e._key),s=new bx(t);return new Rx(t,s,e._key,r,new $i(n.hasPendingWrites,n.fromCache),e.converter)}(function(e,n=!0){(function(s){ni=s})(ei),Fs(new zr("firestore",(r,{instanceIdentifier:s,options:i})=>{const o=r.getProvider("app").getImmediate(),l=new Kr(new HC(r.getProvider("auth-internal")),new YC(r.getProvider("app-check-internal")),function(h,p){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new q(V.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ao(h.options.projectId,p)}(o,s),o);return i=Object.assign({useFetchStreams:n},i),l._setSettings(i),l},"PUBLIC").setMultipleInstances(!0)),or(ry,"4.7.3",e),or(ry,"4.7.3","esm2017")})();var $b="firebase",qb="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */or($b,qb,"app");const Wb={apiKey:"AIzaSyD9m5XuiwaPOKeoLrbg88gIdQtK1_caTdU",authDomain:"capitalcycle-tcc.firebaseapp.com",projectId:"capitalcycle-tcc",storageBucket:"capitalcycle-tcc.firebasestorage.app",messagingSenderId:"188739395268",appId:"1:188739395268:web:d2d783a1bb54c86c3ff391"},Px=T_(Wb),Pi=BC(Px),tt=Cb(Px),jx=O.createContext({});function Hb({children:t}){const[e,n]=O.useState(null),[r,s]=O.useState(null),[i,o]=O.useState(!0);O.useEffect(()=>Nk(Pi,async m=>{if(n(m),m)try{const y=Ks(tt,"usuarios",m.uid),k=await zb(y);if(k.exists()){const T=k.data();T.situacao==="inativa"?(await Hg(Pi),n(null),s(null)):s(T)}}catch(y){console.error("Erro ao buscar perfil:",y)}else s(null);o(!1)}),[]);const l=(p,m)=>kk(Pi,p,m),u=()=>Hg(Pi),h=async(p,m,y,k)=>{const{user:T}=await Sk(Pi,m,y);await Ak(T,{displayName:p}),await Bb(Ks(tt,"usuarios",T.uid),{name:p,email:m,plan:k,createdAt:new Date})};return c.jsx(jx.Provider,{value:{currentUser:e,userProfile:r,register:h,login:l,logout:u,loading:i},children:!i&&t})}const ai=()=>{const t=O.useContext(jx);if(!t)throw new Error("useAuth deve ser usado dentro de um AuthProvider");return t};/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Kb={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gb=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase().trim(),Z=(t,e)=>{const n=O.forwardRef(({color:r="currentColor",size:s=24,strokeWidth:i=2,absoluteStrokeWidth:o,className:l="",children:u,...h},p)=>O.createElement("svg",{ref:p,...Kb,width:s,height:s,stroke:r,strokeWidth:o?Number(i)*24/Number(s):i,className:["lucide",`lucide-${Gb(t)}`,l].join(" "),...h},[...e.map(([m,y])=>O.createElement(m,y)),...Array.isArray(u)?u:[u]]));return n.displayName=`${t}`,n};/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qb=Z("Activity",[["path",{d:"M22 12h-4l-3 9L9 3l-3 9H2",key:"d5dnw9"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yb=Z("AlertCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dx=Z("AlertTriangle",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"c3ski4"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xb=Z("ArrowDownCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 8v8",key:"napkw2"}],["path",{d:"m8 12 4 4 4-4",key:"k98ssh"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jb=Z("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sh=Z("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zb=Z("ArrowUpCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 12-4-4-4 4",key:"177agl"}],["path",{d:"M12 16V8",key:"1sbj14"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eN=Z("BarChart3",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tN=Z("Bell",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $y=Z("Bot",[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nN=Z("Building2",[["path",{d:"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",key:"1b4qmf"}],["path",{d:"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",key:"i71pzd"}],["path",{d:"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",key:"10jefs"}],["path",{d:"M10 6h4",key:"1itunk"}],["path",{d:"M10 10h4",key:"tcdvrf"}],["path",{d:"M10 14h4",key:"kelpxr"}],["path",{d:"M10 18h4",key:"1ulq68"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rN=Z("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sN=Z("CheckCircle",[["path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14",key:"g774vq"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ji=Z("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iN=Z("CircleUser",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}],["path",{d:"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662",key:"154egf"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ih=Z("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oh=Z("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ah=Z("Landmark",[["line",{x1:"3",x2:"21",y1:"22",y2:"22",key:"j8o0r"}],["line",{x1:"6",x2:"6",y1:"18",y2:"11",key:"10tf0k"}],["line",{x1:"10",x2:"10",y1:"18",y2:"11",key:"54lgf6"}],["line",{x1:"14",x2:"14",y1:"18",y2:"11",key:"380y"}],["line",{x1:"18",x2:"18",y1:"18",y2:"11",key:"1kevvc"}],["polygon",{points:"12 2 20 7 4 7",key:"jkujk7"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oN=Z("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aN=Z("Lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lh=Z("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lN=Z("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ox=Z("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uN=Z("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vx=Z("PieChart",[["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}],["path",{d:"M22 12A10 10 0 0 0 12 2v10z",key:"1rfc4y"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ip=Z("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cN=Z("Receipt",[["path",{d:"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",key:"q3az6g"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 17.5v-11",key:"1jc1ny"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dN=Z("RefreshCcw",[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hN=Z("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fN=Z("Send",[["path",{d:"m22 2-7 20-4-9-9-4Z",key:"1q3vgg"}],["path",{d:"M22 2 11 13",key:"nzbqef"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const op=Z("Sparkles",[["path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",key:"17u4zn"}],["path",{d:"M5 3v4",key:"bklmnn"}],["path",{d:"M19 17v4",key:"iiml17"}],["path",{d:"M3 5h4",key:"nem4j1"}],["path",{d:"M17 19h4",key:"lbex7p"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gl=Z("Target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ap=Z("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ql=Z("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lx=Z("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mx=Z("Wallet",[["path",{d:"M21 12V7H5a2 2 0 0 1 0-4h14v4",key:"195gfw"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h16v-5",key:"195n9w"}],["path",{d:"M18 12a2 2 0 0 0 0 4h4v-4Z",key:"vllfpd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pN=Z("XCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xo=Z("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),lp="/assets/logo-topo-BNRq55p7.png";function mN({isMobileMenuOpen:t,setIsMobileMenuOpen:e}){const n=_r(),r=Mo(),{logout:s}=ai(),i=[{icon:oN,label:"Dashboard",path:"/capital/dashboard"},{icon:cN,label:"Transações",path:"/capital/transacoes"},{icon:ah,label:"Contas e Caixas",path:"/capital/contas"},{icon:Vx,label:"Ciclos e Metas",path:"/capital/ciclos"},{icon:op,label:"Capital Advisor (IA)",path:"/capital/analise-ia"}],o=async()=>{try{await s(),r("/login")}catch(l){console.error("Erro ao sair:",l)}};return c.jsxs(c.Fragment,{children:[t&&c.jsx("div",{className:"fixed inset-0 bg-black/50 z-40 md:hidden",onClick:()=>e(!1)}),c.jsxs("aside",{className:`
        fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-50 transition-transform duration-300
        ${t?"translate-x-0":"-translate-x-full"}
        md:translate-x-0 border-r border-slate-800
      `,children:[c.jsxs("div",{className:"p-6 flex items-center justify-between",children:[c.jsx("div",{className:"flex items-center gap-3",children:c.jsx("img",{src:lp,alt:"Logo",className:"w-[300px] h-[100px] object-contain"})}),c.jsx("button",{className:"md:hidden",onClick:()=>e(!1),children:c.jsx(Xo,{size:20})})]}),c.jsx("nav",{className:"mt-4 px-4 space-y-1",children:i.map(l=>{const u=n.pathname===l.path;return c.jsxs(is,{to:l.path,onClick:()=>e(!1),className:`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${u?"bg-indigo-600 text-white shadow-lg shadow-indigo-500/20":"text-slate-400 hover:bg-slate-800 hover:text-white"}
                `,children:[c.jsx(l.icon,{size:20}),l.label]},l.path)})}),c.jsx("div",{className:"absolute bottom-0 w-full p-4 border-t border-slate-800",children:c.jsxs("button",{onClick:o,className:"flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors",children:[c.jsx(lN,{size:20}),"Sair"]})})]})]})}function gN({onMenuClick:t}){const e=_r(),{userProfile:n}=ai(),r=()=>{const s=e.pathname;return s.includes("dashboard")?"Dashboard":s.includes("transacoes")?"Transações":s.includes("contas")?"Contas e Caixas":s.includes("ciclos")?"Ciclos e Metas":s.includes("analise-ia")?"Capital Advisor":"CapitalCycle"};return c.jsxs("header",{className:"bg-[#101623] shadow-sm h-16 flex items-center justify-between px-6 md:ml-64 w-full md:w-[calc(100%-16rem)] fixed top-0 z-10 border-b border-[#1e293b]",children:[c.jsxs("div",{className:"flex items-center gap-3",children:[c.jsx("button",{onClick:t,className:"p-2 text-slate-400 hover:bg-[#1a2234] rounded-lg md:hidden transition-colors",children:c.jsx(uN,{size:24})}),c.jsx("h2",{className:"text-xl font-bold text-white",children:r()})]}),c.jsxs("div",{className:"flex items-center gap-4",children:[c.jsxs("button",{className:"text-slate-400 hover:text-white transition-colors relative",children:[c.jsx(tN,{size:20}),c.jsx("span",{className:"absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#101623]"})]}),c.jsx("div",{className:"h-6 w-px bg-[#1e293b]"}),c.jsxs("div",{className:"flex items-center gap-3",children:[c.jsxs("div",{className:"text-right hidden sm:block",children:[c.jsx("p",{className:"text-sm font-medium text-white",children:(n==null?void 0:n.nome)||"Usuário"}),c.jsx("p",{className:"text-xs text-indigo-400 capitalize",children:(n==null?void 0:n.perfil)||"Investidor"})]}),c.jsx(iN,{className:"w-8 h-8 text-slate-400"})]})]})]})}function yN(){const[t,e]=O.useState(!1);return c.jsxs("div",{className:"flex h-screen bg-[#070b14] overflow-clip font-sans text-slate-100",children:[c.jsx(mN,{isMobileMenuOpen:t,setIsMobileMenuOpen:e}),c.jsxs("div",{className:"flex-1 flex flex-col min-w-0",children:[c.jsx(gN,{onMenuClick:()=>e(!0)}),c.jsx("main",{className:"flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-24 md:ml-64",children:c.jsx("div",{className:"max-w-7xl mx-auto",children:c.jsx(MI,{})})})]})]})}function Fx({message:t,type:e="success",onClose:n}){O.useEffect(()=>{const i=setTimeout(()=>{n()},3e3);return()=>clearTimeout(i)},[n]);const r={success:"bg-green-100 text-green-800 border-green-200",error:"bg-red-100 text-red-800 border-red-200",warning:"bg-orange-100 text-orange-800 border-orange-200"},s={success:c.jsx(sN,{className:"w-5 h-5 text-green-600"}),error:c.jsx(pN,{className:"w-5 h-5 text-red-600"}),warning:c.jsx(Yb,{className:"w-5 h-5 text-orange-600"})};return t?c.jsxs("div",{className:`fixed top-4 right-4 z-50 flex items-center p-4 border rounded shadow-lg transition-all duration-300 ${r[e]}`,children:[c.jsx("div",{className:"mr-3",children:s[e]}),c.jsx("p",{className:"flex-1 font-medium",children:t}),c.jsx("button",{onClick:n,className:"ml-4 text-gray-500 hover:text-gray-700",children:c.jsx(Xo,{className:"w-4 h-4"})})]}):null}function li({size:t="md",color:e="text-primary"}){const n={sm:"w-4 h-4",md:"w-8 h-8",lg:"w-12 h-12"};return c.jsx("div",{className:"flex justify-center items-center h-full w-full",children:c.jsxs("svg",{className:`animate-spin ${n[t]} ${e}`,xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[c.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),c.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]})})}function vN(){const[t,e]=O.useState(""),[n,r]=O.useState(""),[s,i]=O.useState(!1),[o,l]=O.useState(!1),[u,h]=O.useState({show:!1,message:"",type:"success"}),{login:p}=ai(),m=Mo(),y=async k=>{k.preventDefault(),l(!0);try{await p(t,n),m("/capital/dashboard")}catch(T){console.error("Erro no login:",T),h({show:!0,message:"Credenciais inválidas ou erro de conexão.",type:"error"}),l(!1)}};return c.jsxs("div",{className:"min-h-screen flex grid lg:grid-cols-2 bg-white",children:[c.jsxs("div",{className:"flex flex-col justify-between py-12 px-8 sm:px-12 lg:px-16 xl:px-24",children:[c.jsxs("div",{className:"flex-1 flex flex-col justify-center max-w-sm mx-auto w-full",children:[c.jsxs("div",{className:"flex flex-col mb-12",children:[c.jsx("h2",{className:"text-4xl font-extrabold text-slate-900 tracking-tight",children:"CapitalCycle"}),c.jsx("p",{className:"mt-2 text-sm text-slate-500 font-medium",children:"Acesse sua conta para continuar"})]}),c.jsxs("form",{className:"space-y-8",onSubmit:y,children:[c.jsxs("div",{className:"relative border-b-2 border-slate-300 peer focus-within:border-slate-900 transition-colors",children:[c.jsx(Ox,{className:"absolute left-0 top-3 h-5 w-5 text-slate-400 peer-focus:text-slate-900"}),c.jsx("input",{type:"email",id:"email",required:!0,value:t,onChange:k=>e(k.target.value),placeholder:"E-mail",className:"block w-full pl-8 pr-3 py-3 text-slate-900 placeholder-transparent focus:outline-none bg-transparent sm:text-sm peer"}),c.jsx("label",{htmlFor:"email",className:"absolute left-8 -top-3.5 text-slate-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-900 peer-focus:text-sm",children:"E-mail"})]}),c.jsxs("div",{className:"relative border-b-2 border-slate-300 peer focus-within:border-slate-900 transition-colors",children:[c.jsx(lh,{className:"absolute left-0 top-3 h-5 w-5 text-slate-400 peer-focus:text-slate-900"}),c.jsx("input",{type:s?"text":"password",id:"password",required:!0,value:n,onChange:k=>r(k.target.value),placeholder:"Senha",className:"block w-full pl-8 pr-10 py-3 text-slate-900 placeholder-transparent focus:outline-none bg-transparent sm:text-sm peer"}),c.jsx("label",{htmlFor:"password",className:"absolute left-8 -top-3.5 text-slate-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-900 peer-focus:text-sm",children:"Senha"}),c.jsx("button",{type:"button",onClick:()=>i(!s),className:"absolute right-0 top-3 text-slate-400 hover:text-slate-600 focus:outline-none",children:s?c.jsx(ih,{size:20}):c.jsx(oh,{size:20})})]}),c.jsxs("div",{className:"flex justify-between items-center text-sm mt-4",children:[c.jsxs("div",{className:"flex items-center",children:[c.jsx("input",{id:"remember-me",type:"checkbox",className:"h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 rounded"}),c.jsx("label",{htmlFor:"remember-me",className:"ml-2 block text-slate-700",children:"Lembrar de mim"})]}),c.jsx("a",{href:"#",className:"font-medium text-slate-900 hover:text-slate-700",children:"Esqueceu a senha?"})]}),c.jsx("div",{className:"pt-2",children:c.jsx("button",{type:"submit",disabled:o,className:"w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed",children:o?c.jsx(li,{size:"sm",color:"text-white"}):"Acessar Sistema"})})]})]}),c.jsx("div",{className:"text-center text-xs text-slate-400 font-medium pt-8",children:"CapitalCycle © 2024 - TCC Solutions"})]}),c.jsx("div",{className:"hidden lg:flex items-center justify-center bg-slate-900",children:c.jsx("div",{className:"text-center flex flex-col items-center",children:c.jsx("img",{src:lp,alt:"CapitalCycle Logo",className:"w-[500px] h-auto object-contain mb-2 hover:scale-105 transition-transform duration-300"})})}),u.show&&c.jsx(Fx,{message:u.message,type:u.type,onClose:()=>h({...u,show:!1})})]})}const _N=`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;0,9..40,900&family=DM+Mono:wght@400;500&display=swap');

  .cc-home * { box-sizing: border-box; margin: 0; padding: 0; }
  .cc-home { font-family: 'DM Sans', sans-serif; background: #05070e; color: #fff; overflow-x: hidden; }

  /* Nav */
  .cc-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 50;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 3rem; height: 68px;
    background: rgba(5,7,14,0.8); backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .cc-nav-logo {
    font-size: 1rem; font-weight: 800; letter-spacing: -0.01em;
    color: #fff; text-decoration: none; display: flex; align-items: center; gap: 10px;
  }
  .cc-nav-logo-sq {
    width: 30px; height: 30px; background: #6366f1;
    border-radius: 7px; display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; line-height: 1;
  }

  .cc-nav-logo-img {
    height: 62px; /* Ajuste o tamanho da sua logo aqui */
    width: auto;
    display: block;
  }

  .cc-nav-links { display: flex; gap: 2.5rem; }
  .cc-nav-links a {
    font-size: 0.82rem; font-weight: 500; color: rgba(255,255,255,0.45);
    text-decoration: none; letter-spacing: 0.01em;
    transition: color 0.2s;
  }
  .cc-nav-links a:hover { color: #fff; }

  /* Container para os botões da direita */
  .cc-nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  /* Botão Premium (Alto Contraste) */
  .cc-btn-premium {
    background: #ffffff; 
    color: #05070e; /* Texto escuro */
    padding: 0.6rem 1.6rem;
    border-radius: 8px; 
    font-weight: 700; 
    font-size: 0.85rem;
    text-decoration: none; 
    transition: all 0.3s ease;
    display: inline-flex; align-items: center; gap: 6px;
    box-shadow: 0 4px 14px rgba(255,255,255,0.1);
  }
  .cc-btn-premium:hover { 
    background: #f0f0f0; 
    transform: translateY(-2px); 
    box-shadow: 0 6px 20px rgba(255,255,255,0.2);
  }

  /* Botão Ghost Premium */
  .cc-btn-ghost {
    background: transparent; 
    color: #ffffff;
    padding: 0.6rem 1.6rem; 
    border-radius: 8px; 
    font-weight: 500; 
    font-size: 0.85rem;
    text-decoration: none; 
    border: 1px solid rgba(255,255,255,0.2);
    transition: all 0.3s ease; 
    display: inline-flex; align-items: center; gap: 6px;
  }
  .cc-btn-ghost:hover { 
    border-color: #ffffff; 
    background: rgba(255,255,255,0.05);
  }
  /* Hero */
  .cc-hero {
    min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
    align-items: center; gap: 2rem;
    padding: 9rem 3rem 5rem; max-width: 1400px; margin: 0 auto;
  }
  .cc-hero-headline {
    font-size: clamp(4rem, 7vw, 7.5rem);
    font-weight: 900; line-height: 0.92;
    letter-spacing: -0.04em; text-transform: uppercase;
  }
  .cc-hero-headline span { color: #6366f1; }

  .cc-hero-sub {
    font-size: 0.9rem; color: rgba(255,255,255,0.38); line-height: 1.7;
    max-width: 380px; margin: 1.75rem 0 2.25rem;
    font-weight: 400;
  }
  .cc-hero-ctas { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 3.5rem; }

  /* Progress bars */
  .cc-bars { display: flex; flex-direction: column; gap: 1rem; }
  .cc-bar-label {
    font-size: 0.72rem; font-weight: 600; color: rgba(255,255,255,0.35);
    letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.5rem;
  }
  .cc-bar-track {
    height: 3px; background: rgba(255,255,255,0.07); border-radius: 100px; overflow: hidden;
  }
  .cc-bar-fill {
    height: 100%; background: #6366f1; border-radius: 100px;
    transition: width 1.4s cubic-bezier(0.4,0,0.2,1);
  }
  .cc-bar-fill.emerald { background: #22d3a0; }

  /* 3D Cards Visual */
  .cc-cards-scene {
    position: relative; height: 480px;
    display: flex; align-items: center; justify-content: center;
  }
  .cc-card {
    position: absolute; width: 300px; height: 180px;
    border-radius: 20px; padding: 1.5rem;
    display: flex; flex-direction: column; justify-content: space-between;
    transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
  }
  .cc-card:hover { transform: var(--hover-transform) !important; }
  .cc-card-back {
    background: linear-gradient(135deg, #1c1f3a 0%, #2d2f6e 100%);
    border: 1px solid rgba(99,102,241,0.25);
    transform: rotate(-12deg) translateX(-40px) translateY(20px) perspective(800px) rotateY(12deg);
    --hover-transform: rotate(-8deg) translateX(-30px) translateY(10px) perspective(800px) rotateY(6deg);
    z-index: 1;
  }
  .cc-card-front {
    background: linear-gradient(135deg, #6366f1 0%, #4338ca 60%, #3730a3 100%);
    border: 1px solid rgba(255,255,255,0.15);
    transform: rotate(-4deg) translateX(30px) translateY(-10px) perspective(800px) rotateY(-6deg);
    --hover-transform: rotate(-1deg) translateX(20px) translateY(-15px) perspective(800px) rotateY(-3deg);
    z-index: 2;
    box-shadow: 0 40px 80px rgba(99,102,241,0.35), 0 10px 30px rgba(0,0,0,0.5);
  }
  .cc-card-shadow {
    position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
    width: 260px; height: 30px; z-index: 0;
    background: radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, transparent 70%);
    filter: blur(8px);
  }
  .cc-card-chip {
    width: 34px; height: 26px; border-radius: 5px;
    background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
    border: 1px solid rgba(255,255,255,0.25);
  }
  .cc-card-chip-dark {
    background: linear-gradient(135deg, rgba(99,102,241,0.4), rgba(99,102,241,0.15));
    border: 1px solid rgba(99,102,241,0.3);
  }
  .cc-card-num {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem; letter-spacing: 0.18em; color: rgba(255,255,255,0.7);
  }
  .cc-card-label { font-size: 0.6rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; }
  .cc-card-value { font-size: 1.1rem; font-weight: 700; color: #fff; }
  .cc-card-logo {
    width: 36px; height: 22px; display: flex; align-items: center; gap: -4px;
  }
  .cc-card-logo span {
    width: 22px; height: 22px; border-radius: 50%; display: block;
  }
  .cc-card-logo-a { background: rgba(255,255,255,0.5); }
  .cc-card-logo-b { background: rgba(255,255,255,0.25); margin-left: -8px; }

  /* Stats */
  .cc-stats {
    position: absolute; right: 0; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 1.5rem;
  }
  .cc-stat-item { text-align: left; }
  .cc-stat-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #6366f1;
    display: inline-block; margin-right: 6px; vertical-align: middle;
  }
  .cc-stat-dot.em { background: #22d3a0; }
  .cc-stat-micro { font-size: 0.65rem; color: rgba(255,255,255,0.3); letter-spacing: 0.08em; text-transform: uppercase; }
  .cc-stat-num {
    font-family: 'DM Mono', monospace; font-size: 2rem;
    font-weight: 500; letter-spacing: -0.04em; line-height: 1;
  }

  /* Marquee divider */
  .cc-marquee-wrap {
    overflow: hidden; border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 1.25rem 0; white-space: nowrap;
  }
  .cc-marquee-track {
    display: inline-flex; gap: 0;
    animation: marqueeScroll 24s linear infinite;
  }
  .cc-marquee-item {
    display: inline-flex; align-items: center; gap: 1.25rem;
    padding: 0 2.5rem; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.2);
  }
  .cc-marquee-item span { color: #6366f1; font-size: 1.1rem; }
  @keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* Section: GESTÃO */
  .cc-section-big { max-width: 1400px; margin: 0 auto; padding: 7rem 3rem; }
  .cc-section-eyebrow {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 10px;
  }
  .cc-section-eyebrow::before {
    content: ''; display: inline-block; width: 20px; height: 1px;
    background: rgba(255,255,255,0.25);
  }
  .cc-gestao-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: end; margin-bottom: 5rem; }
  .cc-big-text {
    font-size: clamp(3rem, 5.5vw, 5.5rem); font-weight: 900;
    line-height: 0.93; letter-spacing: -0.04em; text-transform: uppercase;
  }
  .cc-gestao-right { padding-bottom: 0.5rem; }
  .cc-gestao-desc {
    font-size: 0.9rem; color: rgba(255,255,255,0.38); line-height: 1.75;
    margin-bottom: 2rem; max-width: 380px;
  }

  /* Feature cards */
  .cc-feat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; }
  .cc-feat-card {
    background: #05070e; padding: 2rem 1.5rem;
    transition: background 0.25s;
    cursor: default;
  }
  .cc-feat-card:hover { background: #0c101e; }
  .cc-feat-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2);
    display: flex; align-items: center; justify-content: center;
    color: #6366f1; margin-bottom: 1.25rem;
  }
  .cc-feat-title { font-size: 0.9rem; font-weight: 700; margin-bottom: 0.6rem; line-height: 1.3; }
  .cc-feat-desc { font-size: 0.78rem; color: rgba(255,255,255,0.3); line-height: 1.6; }

  /* Pricing */
  .cc-pricing-wrap { 
    padding: 7rem 3rem; 
    max-width: 1400px; 
    margin: 0 auto; 
    display: flex; /* Adicionado para facilitar o alinhamento */
    flex-direction: column; 
    align-items: center; /* Centraliza tudo dentro do wrap */
  }.cc-pricing-header {
    text-align: center;
    margin-bottom: 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .cc-plans-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 1px; 
    background: rgba(255,255,255,0.07); 
    border: 1px solid rgba(255,255,255,0.07); 
    border-radius: 20px; 
    overflow: hidden; 
    max-width: 820px; 
    margin: 0 auto; /* Isso garante que a grid fique no centro */
    width: 100%;
  }
  .cc-plan { background: #05070e; padding: 3rem; transition: background 0.25s; }
  .cc-plan:hover { background: #080b16; }
  .cc-plan.featured { background: #0f1128; }
  .cc-plan-tag {
    font-size: 0.62rem; font-weight: 800; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.25);
    margin-bottom: 2rem; display: flex; align-items: center; gap: 8px;
  }
  .cc-plan-tag-badge {
    background: rgba(99,102,241,0.15); color: #a5b4fc;
    border: 1px solid rgba(99,102,241,0.25); border-radius: 100px;
    padding: 0.15rem 0.6rem; font-size: 0.6rem;
  }
  .cc-plan-price { margin-bottom: 0.5rem; display: flex; align-items: baseline; gap: 4px; }
  .cc-plan-currency { font-size: 1.25rem; font-weight: 700; color: rgba(255,255,255,0.4); margin-top: 8px; }
  .cc-plan-val {
    font-family: 'DM Mono', monospace; font-size: 5rem; font-weight: 500;
    letter-spacing: -0.05em; line-height: 1; color: #fff;
  }
  .cc-plan-period { font-size: 0.8rem; color: rgba(255,255,255,0.25); align-self: flex-end; margin-bottom: 8px; }
  .cc-plan-desc { font-size: 0.8rem; color: rgba(255,255,255,0.28); line-height: 1.6; margin-bottom: 2.5rem; }
  .cc-plan-cta {
    display: block; width: 100%; text-align: center;
    padding: 0.85rem 1.5rem; border-radius: 10px;
    font-weight: 700; font-size: 0.85rem; text-decoration: none;
    margin-bottom: 2.5rem; transition: opacity 0.2s, transform 0.2s;
  }
  .cc-plan-cta:hover { opacity: 0.85; transform: translateY(-2px); }
  .cc-cta-filled { background: #6366f1; color: #fff; }
  .cc-cta-outline { background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.15); }
  .cc-plan-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 0 0 2rem; }
  .cc-plan-feats { list-style: none; display: flex; flex-direction: column; gap: 0.8rem; }
  .cc-plan-feats li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.82rem; color: rgba(255,255,255,0.38); }
  .cc-feat-check { color: #22d3a0; flex-shrink: 0; font-size: 0.8rem; margin-top: 1px; }

  /* Footer */
  .cc-footer {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 2.5rem 3rem; display: flex; justify-content: space-between; align-items: center;
    max-width: 1400px; margin: 0 auto;
  }
  .cc-footer-logo { font-size: 0.85rem; font-weight: 800; display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.3); text-decoration: none; }
  .cc-footer-links { display: flex; gap: 2rem; }
  .cc-footer-links a { font-size: 0.75rem; color: rgba(255,255,255,0.2); text-decoration: none; transition: color 0.2s; }
  .cc-footer-links a:hover { color: rgba(255,255,255,0.5); }
  .cc-copy { font-size: 0.75rem; color: rgba(255,255,255,0.15); }

  /* Fade in */
  .cc-fadein { opacity: 0; transform: translateY(28px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .cc-fadein.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 1024px) {
    .cc-hero { grid-template-columns: 1fr; padding: 8rem 1.5rem 4rem; min-height: auto; gap: 4rem; }
    .cc-cards-scene { height: 320px; }
    .cc-card { width: 240px; height: 145px; }
    .cc-stats { position: relative; top: auto; right: auto; transform: none; flex-direction: row; justify-content: center; gap: 2.5rem; margin-top: 1.5rem; }
    .cc-gestao-grid { grid-template-columns: 1fr; gap: 2rem; margin-bottom: 3rem; }
    .cc-feat-grid { grid-template-columns: 1fr 1fr; }
    .cc-plans-grid { grid-template-columns: 1fr; max-width: 420px; }
    .cc-nav-links { display: none; }
    .cc-footer { flex-direction: column; gap: 1.5rem; text-align: center; }
    .cc-footer-links { flex-wrap: wrap; justify-content: center; }
  }
  @media (max-width: 640px) {
    .cc-feat-grid { grid-template-columns: 1fr; }
    .cc-hero-headline { font-size: 3.5rem; }
    .cc-big-text { font-size: 3rem; }
    .cc-section-big, .cc-pricing-wrap { padding: 5rem 1.5rem; }
  }
`;function qy({label:t,pct:e,color:n}){const[r,s]=O.useState(0);return O.useEffect(()=>{const i=setTimeout(()=>s(e),300);return()=>clearTimeout(i)},[e]),c.jsxs("div",{children:[c.jsx("div",{className:"cc-bar-label",children:t}),c.jsx("div",{className:"cc-bar-track",children:c.jsx("div",{className:`cc-bar-fill${n==="emerald"?" emerald":""}`,style:{width:`${r}%`}})})]})}function wN(){return c.jsxs("div",{className:"cc-cards-scene",children:[c.jsxs("div",{className:"cc-card cc-card-back",children:[c.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"},children:[c.jsx("div",{className:"cc-card-chip cc-card-chip-dark"}),c.jsxs("div",{style:{textAlign:"right"},children:[c.jsx("div",{className:"cc-card-label",children:"Ciclo Ativo"}),c.jsx("div",{className:"cc-card-value",style:{fontSize:"0.85rem"},children:"Maio 2026"})]})]}),c.jsxs("div",{children:[c.jsx("div",{className:"cc-card-num",children:"•••• •••• •••• 2034"}),c.jsx("div",{className:"cc-card-label",style:{marginTop:"4px"},children:"Capital Cycle"})]})]}),c.jsxs("div",{className:"cc-card cc-card-front",children:[c.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"},children:[c.jsx("div",{className:"cc-card-chip"}),c.jsxs("div",{className:"cc-card-logo",children:[c.jsx("span",{className:"cc-card-logo-a"}),c.jsx("span",{className:"cc-card-logo-b"})]})]}),c.jsxs("div",{children:[c.jsx("div",{className:"cc-card-label",children:"Saldo Consolidado"}),c.jsx("div",{className:"cc-card-value",children:"R$ 18.240,00"}),c.jsxs("div",{style:{display:"flex",gap:"1.5rem",marginTop:"0.35rem"},children:[c.jsxs("div",{children:[c.jsx("div",{className:"cc-card-label",children:"Entradas/mês"}),c.jsx("div",{style:{fontFamily:"'DM Mono', monospace",fontSize:"0.75rem",color:"#22d3a0",fontWeight:600},children:"+R$ 6.800"})]}),c.jsxs("div",{children:[c.jsx("div",{className:"cc-card-label",children:"Saídas/mês"}),c.jsx("div",{style:{fontFamily:"'DM Mono', monospace",fontSize:"0.75rem",color:"#f87171",fontWeight:600},children:"-R$ 2.340"})]})]})]})]}),c.jsx("div",{className:"cc-card-shadow"})]})}const xN=[{icon:c.jsx(eN,{size:20}),title:"Dashboard Financeiro",desc:"Saldo consolidado de todas as contas com indicadores de fluxo em tempo real."},{icon:c.jsx(dN,{size:20}),title:"Transações Inteligentes",desc:"Registre entradas e saídas com categorias, filtros avançados e histórico completo."},{icon:c.jsx(Gl,{size:20}),title:"Ciclos de Investimento",desc:"Metas de orçamento por período com progresso calculado automaticamente."},{icon:c.jsx(op,{size:20}),title:"Capital Advisor IA",desc:"Análise dos seus dados financeiros em linguagem natural. Disponível 24/7."}],EN=[{id:"jovem",name:"Jovem",price:"24",desc:"Para quem está começando a organizar as finanças com controle prático.",cta:"Começar com o Jovem",ctaClass:"cc-cta-outline",featured:!1,feats:["Dashboard financeiro completo","Transações ilimitadas","Até 3 contas bancárias","Ciclos de investimento (2 ativos)","Capital Advisor — 50 consultas/mês","Sincronização em tempo real"]},{id:"adulto",name:"Adulto",price:"46",desc:"Controle avançado com IA ilimitada, múltiplas contas e relatórios completos.",cta:"Começar com o Adulto",ctaClass:"cc-cta-filled",featured:!0,badge:"Mais popular",feats:["Tudo do plano Jovem","Contas bancárias ilimitadas","Ciclos de investimento ilimitados","Capital Advisor — consultas ilimitadas","Relatórios exportáveis PDF/CSV","Análise comparativa de períodos","Suporte prioritário"]}],Wy=["Dashboard em Tempo Real","Capital Advisor IA","Ciclos de Investimento","Contas Bancárias","Análise de Fluxo","Transações Inteligentes","Relatórios Automáticos","Segurança Firebase"];function TN(){return O.useEffect(()=>{const t=document.createElement("style");return t.setAttribute("data-cc-home","1"),t.textContent=_N,document.head.appendChild(t),()=>t.remove()},[]),O.useEffect(()=>{const t=document.querySelectorAll(".cc-fadein"),e=new IntersectionObserver(n=>n.forEach(r=>{r.isIntersecting&&r.target.classList.add("visible")}),{threshold:.12});return t.forEach(n=>e.observe(n)),()=>e.disconnect()},[]),c.jsxs("div",{className:"cc-home",children:[c.jsxs("nav",{className:"cc-nav",children:[c.jsx(is,{to:"/",className:"cc-nav-logo",children:c.jsx("img",{src:lp,alt:"CapitalCycle Logo",className:"cc-nav-logo-img"})}),c.jsxs("div",{className:"cc-nav-links",children:[c.jsx("a",{href:"#recursos",children:"Recursos"}),c.jsx("a",{href:"#advisor",children:"Capital Advisor"}),c.jsx("a",{href:"#planos",children:"Planos"})]}),c.jsxs("div",{className:"cc-nav-actions",children:[c.jsx(is,{to:"/login",className:"cc-btn-ghost",children:"Login"}),c.jsxs(is,{to:"/cadastro",className:"cc-btn-premium",children:["Cadastro ",c.jsx(sh,{size:14})]})]})]}),c.jsxs("div",{className:"cc-hero",children:[c.jsxs("div",{children:[c.jsxs("h1",{className:"cc-hero-headline",children:["SUA",c.jsx("br",{}),"JORNADA",c.jsx("br",{}),c.jsx("span",{children:"FINANCEIRA"})]}),c.jsx("p",{className:"cc-hero-sub",children:"Da primeira transação ao ciclo de investimento completo — controle total do seu capital com inteligência artificial integrada."}),c.jsxs("div",{className:"cc-hero-ctas",children:[c.jsx("a",{href:"#planos",className:"cc-btn-primary",children:"Começar agora"}),c.jsx(is,{to:"/login",className:"cc-btn-ghost",children:"Já tenho conta"})]}),c.jsxs("div",{className:"cc-bars",children:[c.jsx(qy,{label:"Precisão do Capital Advisor",pct:95}),c.jsx(qy,{label:"Satisfação dos usuários",pct:88,color:"emerald"})]})]}),c.jsxs("div",{style:{position:"relative"},children:[c.jsx(wN,{}),c.jsxs("div",{className:"cc-stats",children:[c.jsxs("div",{className:"cc-stat-item",children:[c.jsxs("div",{className:"cc-stat-micro",children:[c.jsx("span",{className:"cc-stat-dot"})," Fluxo Positivo"]}),c.jsx("div",{className:"cc-stat-num",children:"R$ 18k"})]}),c.jsxs("div",{className:"cc-stat-item",children:[c.jsxs("div",{className:"cc-stat-micro",children:[c.jsx("span",{className:"cc-stat-dot em"})," Ciclos Ativos"]}),c.jsx("div",{className:"cc-stat-num",children:"4+"})]})]})]})]}),c.jsx("div",{className:"cc-marquee-wrap",children:c.jsx("div",{className:"cc-marquee-track",children:[...Wy,...Wy].map((t,e)=>c.jsxs("div",{className:"cc-marquee-item",children:[c.jsx("span",{children:"✦"})," ",t]},e))})}),c.jsxs("div",{id:"recursos",className:"cc-section-big",children:[c.jsxs("div",{className:"cc-gestao-grid cc-fadein",children:[c.jsxs("div",{children:[c.jsx("div",{className:"cc-section-eyebrow",children:"Recursos"}),c.jsxs("div",{className:"cc-big-text",children:["GESTÃO",c.jsx("br",{}),"QUE EVOLUI",c.jsx("br",{}),"COM VOCÊ"]})]}),c.jsxs("div",{className:"cc-gestao-right",children:[c.jsx("p",{className:"cc-gestao-desc",children:"Ferramentas profissionais para controle total do seu dinheiro — do lançamento individual à inteligência financeira por IA."}),c.jsxs("a",{href:"#planos",className:"cc-btn-primary",children:["Ver planos ",c.jsx(sh,{size:14})]})]})]}),c.jsx("div",{className:"cc-feat-grid cc-fadein",children:xN.map((t,e)=>c.jsxs("div",{className:"cc-feat-card",children:[c.jsx("div",{className:"cc-feat-icon",children:t.icon}),c.jsx("div",{className:"cc-feat-title",children:t.title}),c.jsx("div",{className:"cc-feat-desc",children:t.desc})]},e))})]}),c.jsxs("div",{id:"planos",className:"cc-pricing-wrap",children:[c.jsxs("div",{className:"cc-fadein",style:{marginBottom:"4rem"},children:[c.jsx("div",{className:"cc-section-eyebrow",children:"Planos"}),c.jsxs("div",{className:"cc-big-text",children:["ESCOLHA",c.jsx("br",{}),"SEU PLANO"]})]}),c.jsx("div",{className:"cc-plans-grid cc-fadein",children:EN.map(t=>c.jsxs("div",{className:`cc-plan${t.featured?" featured":""}`,children:[c.jsxs("div",{className:"cc-plan-tag",children:[t.name,t.badge&&c.jsx("span",{className:"cc-plan-tag-badge",children:t.badge})]}),c.jsxs("div",{className:"cc-plan-price",children:[c.jsx("span",{className:"cc-plan-currency",children:"R$"}),c.jsx("span",{className:"cc-plan-val",children:t.price}),c.jsx("span",{className:"cc-plan-period",children:"/mês"})]}),c.jsx("p",{className:"cc-plan-desc",children:t.desc}),c.jsx(is,{to:"/cadastro",state:{plan:t.id},className:`cc-plan-cta ${t.ctaClass}`,children:t.cta}),c.jsx("hr",{className:"cc-plan-divider"}),c.jsx("ul",{className:"cc-plan-feats",children:t.feats.map((e,n)=>c.jsxs("li",{children:[c.jsx("span",{className:"cc-feat-check",children:"✓"}),e]},n))})]},t.name))}),c.jsx("p",{style:{marginTop:"2rem",fontSize:"0.75rem",color:"rgba(255,255,255,0.15)"},children:"Pagamento seguro · Cancele quando quiser · Sem fidelidade"})]}),c.jsx("div",{style:{borderTop:"1px solid rgba(255,255,255,0.06)"},children:c.jsxs("footer",{className:"cc-footer",children:[c.jsx("span",{className:"cc-copy",children:"© 2026 CapitalCycle  "}),c.jsxs("div",{className:"cc-footer-links",children:[c.jsx("a",{href:"#",children:"Termos"}),c.jsx("a",{href:"#",children:"Privacidade"}),c.jsx("a",{href:"#",children:"Contato"})]})]})})]})}const Vc=[{id:"jovem",name:"Jovem",price:"24",desc:"Para quem está começando a organizar as finanças com controle prático.",featured:!1,feats:["Dashboard financeiro completo","Transações ilimitadas","Até 3 contas bancárias","Ciclos de investimento (2 ativos)","Capital Advisor — 50 consultas/mês","Sincronização em tempo real"]},{id:"adulto",name:"Adulto",price:"46",desc:"Controle avançado com IA ilimitada, múltiplas contas e relatórios completos.",featured:!0,badge:"Mais popular",feats:["Tudo do plano Jovem","Contas bancárias ilimitadas","Ciclos de investimento ilimitados","Capital Advisor — consultas ilimitadas","Relatórios exportáveis PDF/CSV","Análise comparativa de períodos","Suporte prioritário"]}];function IN(){const[t,e]=O.useState(1),[n,r]=O.useState(null),s=_r(),[i,o]=O.useState(""),[l,u]=O.useState(""),[h,p]=O.useState(""),[m,y]=O.useState(""),[k,T]=O.useState(!1),[R,j]=O.useState(!1),[S,v]=O.useState(!1),[w,P]=O.useState({show:!1,message:"",type:"success"}),{register:L}=ai(),F=Mo();O.useEffect(()=>{var x;(x=s.state)!=null&&x.plan&&(r(s.state.plan),e(2))},[]);const I=x=>{r(x),e(2)},_=async x=>{if(x.preventDefault(),h!==m){P({show:!0,message:"As senhas não coincidem.",type:"error"});return}if(h.length<6){P({show:!0,message:"A senha deve ter pelo menos 6 caracteres.",type:"error"});return}v(!0);try{await L(i,l,h,n),F("/capital/dashboard")}catch(A){console.error("Erro no cadastro:",A),P({show:!0,message:"Erro ao criar conta. Tente novamente.",type:"error"}),v(!1)}},E=Vc.find(x=>x.id===n);return c.jsxs("div",{className:"min-h-screen flex grid lg:grid-cols-2 bg-white",children:[c.jsxs("div",{className:"flex flex-col justify-between py-12 px-8 sm:px-12 lg:px-16 xl:px-24",children:[c.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[c.jsxs("div",{className:"flex items-center gap-2",children:[c.jsx("div",{className:"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors bg-slate-900 text-white",children:t>1?c.jsx(ji,{size:12}):"1"}),c.jsx("span",{className:`text-xs font-semibold ${t===1?"text-slate-900":"text-slate-400"}`,children:"Escolha o plano"})]}),c.jsx("div",{className:"flex-1 h-px bg-slate-200 max-w-[40px]"}),c.jsxs("div",{className:"flex items-center gap-2",children:[c.jsx("div",{className:`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${t===2?"bg-slate-900 text-white":"bg-slate-200 text-slate-400"}`,children:"2"}),c.jsx("span",{className:`text-xs font-semibold ${t===2?"text-slate-900":"text-slate-400"}`,children:"Seus dados"})]})]}),t===1&&c.jsxs("div",{className:"flex-1 flex flex-col justify-center max-w-sm mx-auto w-full",children:[c.jsxs("div",{className:"mb-10",children:[c.jsx("h2",{className:"text-4xl font-extrabold text-slate-900 tracking-tight",children:"CapitalCycle"}),c.jsx("p",{className:"mt-2 text-sm text-slate-500 font-medium",children:"Escolha o plano ideal para você"})]}),c.jsx("div",{className:"flex flex-col gap-4",children:Vc.map(x=>c.jsxs("button",{onClick:()=>I(x.id),className:`w-full text-left rounded-xl border-2 p-5 transition-all duration-200 group focus:outline-none ${x.featured?"border-slate-900 bg-slate-900 text-white hover:bg-slate-800":"border-slate-200 bg-white text-slate-900 hover:border-slate-900"}`,children:[c.jsxs("div",{className:"flex items-start justify-between mb-3",children:[c.jsxs("div",{children:[c.jsxs("div",{className:"flex items-center gap-2",children:[c.jsx("span",{className:`text-xs font-bold uppercase tracking-widest ${x.featured,"text-slate-400"}`,children:x.name}),x.badge&&c.jsx("span",{className:"text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wide",children:x.badge})]}),c.jsxs("div",{className:"flex items-baseline gap-1 mt-1",children:[c.jsx("span",{className:`text-xs font-medium ${x.featured,"text-slate-400"}`,children:"R$"}),c.jsx("span",{className:"text-3xl font-extrabold tracking-tight",children:x.price}),c.jsx("span",{className:`text-xs ${x.featured,"text-slate-400"}`,children:"/mês"})]})]}),c.jsx(sh,{size:18,className:`mt-1 transition-transform group-hover:translate-x-1 ${x.featured?"text-white":"text-slate-400"}`})]}),c.jsx("p",{className:`text-xs leading-relaxed mb-3 ${x.featured?"text-slate-300":"text-slate-500"}`,children:x.desc}),c.jsxs("ul",{className:"flex flex-col gap-1.5",children:[x.feats.slice(0,3).map((A,b)=>c.jsxs("li",{className:"flex items-center gap-2",children:[c.jsx(ji,{size:11,className:x.featured?"text-emerald-400":"text-emerald-600"}),c.jsx("span",{className:`text-xs ${x.featured?"text-slate-300":"text-slate-600"}`,children:A})]},b)),x.feats.length>3&&c.jsxs("li",{className:`text-xs ${x.featured,"text-slate-400"}`,children:["+ ",x.feats.length-3," recursos incluídos"]})]})]},x.id))}),c.jsxs("p",{className:"text-center text-xs text-slate-400 mt-6",children:["Já tem conta?"," ",c.jsx("a",{href:"/login",className:"font-semibold text-slate-900 hover:underline",children:"Fazer login"})]})]}),t===2&&c.jsxs("div",{className:"flex-1 flex flex-col justify-center max-w-sm mx-auto w-full",children:[c.jsxs("div",{className:"mb-10",children:[c.jsxs("button",{onClick:()=>e(1),className:"flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-900 transition-colors mb-6 font-medium",children:[c.jsx(Jb,{size:14}),"Trocar plano"]}),c.jsx("h2",{className:"text-4xl font-extrabold text-slate-900 tracking-tight",children:"CapitalCycle"}),c.jsxs("p",{className:"mt-2 text-sm text-slate-500 font-medium",children:["Crie sua conta — plano"," ",c.jsx("span",{className:"font-bold text-slate-900",children:E==null?void 0:E.name})]})]}),c.jsxs("form",{className:"space-y-8",onSubmit:_,children:[c.jsxs("div",{className:"relative border-b-2 border-slate-300 focus-within:border-slate-900 transition-colors",children:[c.jsx(Lx,{className:"absolute left-0 top-3 h-5 w-5 text-slate-400"}),c.jsx("input",{type:"text",id:"name",required:!0,value:i,onChange:x=>o(x.target.value),placeholder:"Nome completo",className:"block w-full pl-8 pr-3 py-3 text-slate-900 placeholder-transparent focus:outline-none bg-transparent sm:text-sm peer"}),c.jsx("label",{htmlFor:"name",className:"absolute left-8 -top-3.5 text-slate-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-900 peer-focus:text-sm",children:"Nome completo"})]}),c.jsxs("div",{className:"relative border-b-2 border-slate-300 focus-within:border-slate-900 transition-colors",children:[c.jsx(Ox,{className:"absolute left-0 top-3 h-5 w-5 text-slate-400"}),c.jsx("input",{type:"email",id:"email",required:!0,value:l,onChange:x=>u(x.target.value),placeholder:"E-mail",className:"block w-full pl-8 pr-3 py-3 text-slate-900 placeholder-transparent focus:outline-none bg-transparent sm:text-sm peer"}),c.jsx("label",{htmlFor:"email",className:"absolute left-8 -top-3.5 text-slate-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-900 peer-focus:text-sm",children:"E-mail"})]}),c.jsxs("div",{className:"relative border-b-2 border-slate-300 focus-within:border-slate-900 transition-colors",children:[c.jsx(lh,{className:"absolute left-0 top-3 h-5 w-5 text-slate-400"}),c.jsx("input",{type:k?"text":"password",id:"password",required:!0,value:h,onChange:x=>p(x.target.value),placeholder:"Senha",className:"block w-full pl-8 pr-10 py-3 text-slate-900 placeholder-transparent focus:outline-none bg-transparent sm:text-sm peer"}),c.jsx("label",{htmlFor:"password",className:"absolute left-8 -top-3.5 text-slate-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-900 peer-focus:text-sm",children:"Senha"}),c.jsx("button",{type:"button",onClick:()=>T(!k),className:"absolute right-0 top-3 text-slate-400 hover:text-slate-600 focus:outline-none",children:k?c.jsx(ih,{size:20}):c.jsx(oh,{size:20})})]}),c.jsxs("div",{className:"relative border-b-2 border-slate-300 focus-within:border-slate-900 transition-colors",children:[c.jsx(lh,{className:"absolute left-0 top-3 h-5 w-5 text-slate-400"}),c.jsx("input",{type:R?"text":"password",id:"confirmPassword",required:!0,value:m,onChange:x=>y(x.target.value),placeholder:"Confirmar senha",className:"block w-full pl-8 pr-10 py-3 text-slate-900 placeholder-transparent focus:outline-none bg-transparent sm:text-sm peer"}),c.jsx("label",{htmlFor:"confirmPassword",className:"absolute left-8 -top-3.5 text-slate-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-900 peer-focus:text-sm",children:"Confirmar senha"}),c.jsx("button",{type:"button",onClick:()=>j(!R),className:"absolute right-0 top-3 text-slate-400 hover:text-slate-600 focus:outline-none",children:R?c.jsx(ih,{size:20}):c.jsx(oh,{size:20})})]}),c.jsxs("div",{className:"flex items-start gap-3 text-sm",children:[c.jsx("input",{id:"terms",type:"checkbox",required:!0,className:"mt-0.5 h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 rounded"}),c.jsxs("label",{htmlFor:"terms",className:"text-slate-600 leading-relaxed",children:["Concordo com os"," ",c.jsx("a",{href:"#",className:"font-semibold text-slate-900 hover:underline",children:"Termos de Uso"})," ","e a"," ",c.jsx("a",{href:"#",className:"font-semibold text-slate-900 hover:underline",children:"Política de Privacidade"})]})]}),c.jsx("div",{className:"pt-2",children:c.jsx("button",{type:"submit",disabled:S,className:"w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed",children:S?c.jsx(li,{size:"sm",color:"text-white"}):"Criar minha conta"})})]}),c.jsxs("p",{className:"text-center text-xs text-slate-400 mt-6",children:["Já tem conta?"," ",c.jsx("a",{href:"/login",className:"font-semibold text-slate-900 hover:underline",children:"Fazer login"})]})]}),c.jsx("div",{className:"text-center text-xs text-slate-400 font-medium pt-8",children:"CapitalCycle © 2024 - TCC Solutions"})]}),c.jsx("div",{className:"hidden lg:flex items-center justify-center bg-slate-900",children:c.jsxs("div",{className:"text-center flex flex-col items-center px-12 max-w-sm w-full",children:[t===1&&c.jsxs("div",{className:"w-full",children:[c.jsx("p",{className:"text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-8",children:"Compare os planos"}),c.jsx("div",{className:"flex flex-col gap-3 w-full",children:Vc.map(x=>c.jsxs("div",{className:`rounded-xl p-5 text-left border ${x.featured?"bg-indigo-600/20 border-indigo-500/40":"bg-slate-800/60 border-slate-700/50"}`,children:[c.jsxs("div",{className:"flex justify-between items-center mb-3",children:[c.jsx("span",{className:"text-xs font-bold uppercase tracking-widest text-slate-400",children:x.name}),c.jsxs("div",{className:"flex items-baseline gap-1",children:[c.jsx("span",{className:"text-xs text-slate-500",children:"R$"}),c.jsx("span",{className:"text-2xl font-extrabold text-white",children:x.price}),c.jsx("span",{className:"text-xs text-slate-500",children:"/mês"})]})]}),c.jsx("ul",{className:"flex flex-col gap-1.5",children:x.feats.slice(0,4).map((A,b)=>c.jsxs("li",{className:"flex items-center gap-2",children:[c.jsx(ji,{size:10,className:"text-emerald-400 flex-shrink-0"}),c.jsx("span",{className:"text-xs text-slate-400",children:A})]},b))})]},x.id))}),c.jsx("p",{className:"text-[10px] text-slate-600 mt-6",children:"Pagamento seguro · Cancele quando quiser"})]}),t===2&&E&&c.jsxs("div",{className:"w-full",children:[c.jsx("p",{className:"text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6",children:"Seu plano escolhido"}),c.jsxs("div",{className:`rounded-2xl p-6 text-left border w-full ${E.featured?"bg-indigo-600/20 border-indigo-500/40":"bg-slate-800/60 border-slate-700/50"}`,children:[c.jsxs("div",{className:"flex justify-between items-start mb-4",children:[c.jsxs("div",{children:[c.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[c.jsx("span",{className:"text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400",children:E.name}),E.badge&&c.jsx("span",{className:"text-[9px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wide",children:E.badge})]}),c.jsxs("div",{className:"flex items-baseline gap-1",children:[c.jsx("span",{className:"text-sm text-slate-500",children:"R$"}),c.jsx("span",{className:"text-4xl font-extrabold text-white",children:E.price}),c.jsx("span",{className:"text-sm text-slate-500",children:"/mês"})]})]}),c.jsx("div",{className:"w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center",children:c.jsx(ji,{size:14,className:"text-emerald-400"})})]}),c.jsx("p",{className:"text-xs text-slate-400 leading-relaxed mb-4",children:E.desc}),c.jsxs("div",{className:"border-t border-slate-700/50 pt-4",children:[c.jsx("p",{className:"text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3",children:"Incluído no plano"}),c.jsx("ul",{className:"flex flex-col gap-2",children:E.feats.map((x,A)=>c.jsxs("li",{className:"flex items-start gap-2",children:[c.jsx(ji,{size:11,className:"text-emerald-400 flex-shrink-0 mt-0.5"}),c.jsx("span",{className:"text-xs text-slate-300",children:x})]},A))})]})]}),c.jsx("button",{onClick:()=>e(1),className:"mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2",children:"Trocar de plano"}),c.jsx("p",{className:"text-[10px] text-slate-600 mt-4",children:"Pagamento seguro · Cancele quando quiser · Sem fidelidade"})]})]})}),w.show&&c.jsx(Fx,{message:w.message,type:w.type,onClose:()=>P({...w,show:!1})})]})}function SN(){const{userProfile:t}=ai(),[e,n]=O.useState(!0),[r,s]=O.useState([]),[i,o]=O.useState([]),[l,u]=O.useState([]);O.useEffect(()=>{const w=ur(zt(tt,"accounts"),_=>{s(_.docs.map(E=>({id:E.id,...E.data()})))}),P=Hl(zt(tt,"transactions"),Kl("data","desc")),L=ur(P,_=>{o(_.docs.map(E=>({id:E.id,...E.data()})))}),F=Hl(zt(tt,"ciclos"),Kl("fim","asc")),I=ur(F,_=>{u(_.docs.map(E=>({id:E.id,...E.data()}))),n(!1)});return()=>{w(),L(),I()}},[]);const h=w=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(w||0),p=r.filter(w=>w.tipo!=="Investimentos").reduce((w,P)=>w+(parseFloat(P.saldo)||0),0),m=r.filter(w=>w.tipo==="Investimentos").reduce((w,P)=>w+(parseFloat(P.saldo)||0),0),y=new Date,k=`${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,"0")}`,T=i.filter(w=>w.tipo==="saida"&&w.data&&w.data.startsWith(k)).reduce((w,P)=>(w[P.categoria]=(w[P.categoria]||0)+(parseFloat(P.valor)||0),w),{}),R=Object.entries(T).map(([w,P])=>({categoria:w,valor:P})).sort((w,P)=>P.valor-w.valor).slice(0,3),j=i.filter(w=>w.tipo==="entrada"&&w.data&&w.data.startsWith(k)).reduce((w,P)=>w+(parseFloat(P.valor)||0),0),S=Object.values(T).reduce((w,P)=>w+P,0),v=j>=S;return e?c.jsx("div",{className:"h-[80vh] flex items-center justify-center",children:c.jsx(li,{size:"lg",color:"text-indigo-500"})}):c.jsxs("div",{className:"space-y-6",children:[c.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[c.jsxs("div",{className:"lg:col-span-2 flex flex-col justify-center",children:[c.jsxs("h1",{className:"text-3xl font-bold text-white tracking-tight mb-2",children:["Olá, ",t&&t.nome?t.nome.split(" ")[0]:"Investidor"]}),c.jsx("p",{className:"text-slate-400",children:"Acompanhe a evolução real do seu capital."})]}),c.jsxs("div",{className:"bg-[#101623] p-6 rounded-2xl border border-[#1e293b] shadow-lg flex flex-col justify-center relative overflow-hidden group hover:border-indigo-500/50 transition-colors",children:[c.jsx("div",{className:"absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity group-hover:scale-110 duration-500",children:c.jsx(Mx,{size:80})}),c.jsx("p",{className:"text-slate-400 text-xs uppercase font-bold tracking-widest mb-1",children:"Saldo Disponível"}),c.jsx("h2",{className:"text-4xl font-black text-indigo-400",children:h(p)}),c.jsxs("div",{className:`mt-2 text-xs font-medium flex items-center gap-1 ${v?"text-emerald-400":"text-rose-400"}`,children:[c.jsx(Ql,{size:14,className:v?"":"rotate-180"}),v?"Fluxo positivo este mês":"Fluxo negativo este mês"]})]})]}),c.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[c.jsxs("div",{className:"lg:col-span-2 bg-[#101623] p-6 rounded-2xl border border-[#1e293b] relative overflow-hidden",children:[c.jsxs("div",{className:"flex justify-between items-start mb-6",children:[c.jsxs("div",{children:[c.jsx("p",{className:"text-slate-400 text-sm font-medium mb-1",children:"Total Investido"}),c.jsx("h3",{className:"text-3xl font-bold text-emerald-400",children:h(m)})]}),c.jsx("div",{className:"bg-emerald-500/10 text-emerald-400 p-3 rounded-xl",children:c.jsx(Ql,{size:24})})]}),c.jsx("div",{className:"h-32 border-b border-[#1e293b] flex items-end gap-3 px-2",children:[30,50,40,70,60,85,Math.max(10,Math.min(100,m/1e4*100))].map((w,P)=>c.jsx("div",{className:"flex-1 bg-indigo-500/20 hover:bg-indigo-500 transition-colors rounded-t-md cursor-pointer",style:{height:`${w}%`}},P))})]}),c.jsxs("div",{className:"space-y-6",children:[c.jsxs("h3",{className:"text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2",children:[c.jsx(Gl,{size:16})," Suas Metas"]}),l.length===0?c.jsx("div",{className:"bg-[#101623] p-6 rounded-2xl border border-[#1e293b] text-center text-slate-500 text-sm",children:"Nenhuma meta ou ciclo cadastrado."}):l.slice(0,2).map((w,P)=>{const L=i.filter(_=>_.tipo==="saida"&&_.data>=w.inicio&&_.data<=w.fim).reduce((_,E)=>_+(parseFloat(E.valor)||0),0),F=Math.min(100,L/w.orcamento*100),I=P===0;return c.jsxs("div",{className:`${I?"bg-indigo-600 shadow-indigo-900/50 shadow-lg text-white":"bg-[#101623] border border-[#1e293b] text-slate-200"} p-6 rounded-2xl`,children:[c.jsxs("div",{className:"flex justify-between items-start mb-4",children:[c.jsx("h4",{className:`font-bold ${I?"text-white":"text-slate-200"} text-sm`,children:w.nome}),c.jsxs("span",{className:`text-xs ${I?"text-indigo-200":"text-slate-400"}`,children:["Teto: ",h(w.orcamento)]})]}),c.jsx("div",{className:"flex justify-between items-end",children:c.jsxs("span",{className:"text-xl font-bold text-white",children:["Utilizado: ",h(L)]})}),c.jsx("div",{className:`w-full ${I?"bg-indigo-950/30":"bg-[#1e293b]"} h-2 rounded-full mt-3 overflow-hidden`,children:c.jsx("div",{className:`${I?"bg-white":"bg-indigo-400"} h-full rounded-full transition-all`,style:{width:`${F}%`}})})]},w.id)})]})]}),c.jsxs("div",{className:"bg-[#101623] p-6 rounded-2xl border border-[#1e293b]",children:[c.jsxs("div",{className:"flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4",children:[c.jsxs("h3",{className:"text-lg font-bold text-white flex items-center gap-2",children:[c.jsx(Qb,{size:20,className:"text-indigo-400"})," Maiores Despesas no Mês"]}),R.length>0&&R[0].valor>j*.5&&c.jsxs("div",{className:"flex items-center gap-2 text-rose-400 bg-rose-400/10 px-3 py-1.5 rounded-lg text-xs font-bold w-fit",children:[c.jsx(Dx,{size:14})," Alerta: Gasto elevado em ",R[0].categoria]})]}),R.length===0?c.jsx("div",{className:"text-center text-slate-500 py-4",children:"Nenhuma despesa registrada neste mês."}):c.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:R.map((w,P)=>{const L=Math.max(w.valor*1.2,1e3),F=["bg-rose-500","bg-warning","bg-indigo-400"];return c.jsx(kN,{label:w.categoria,atual:w.valor,limite:L,color:F[P%3]},w.categoria)})})]})]})}function kN({label:t,atual:e,limite:n,color:r}){const s=e/n*100,i=o=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(o);return c.jsxs("div",{className:"space-y-3",children:[c.jsxs("div",{className:"flex justify-between items-end",children:[c.jsx("span",{className:"text-slate-400 text-sm font-medium",children:t}),c.jsx("span",{className:"font-bold text-white",children:i(e)})]}),c.jsx("div",{className:"w-full bg-[#1e293b] h-2 rounded-full overflow-hidden",children:c.jsx("div",{className:`h-full ${r} transition-all duration-1000`,style:{width:`${s>100?100:s}%`}})})]})}function CN(){const[t,e]=O.useState([]),[n,r]=O.useState([]),[s,i]=O.useState(!0),[o,l]=O.useState(!1),[u,h]=O.useState(""),[p,m]=O.useState({descricao:"",valor:"",tipo:"saida",categoria:"Alimentação",conta_id:"",data:new Date().toISOString().split("T")[0]}),y={entrada:["Salário","Investimento","Rendimento","Venda","Outros"],saida:["Alimentação","Moradia","Transporte","Saúde","Lazer","Educação","Outros"]};O.useEffect(()=>{const v=ur(zt(tt,"accounts"),L=>{r(L.docs.map(F=>({id:F.id,...F.data()})))}),w=Hl(zt(tt,"transactions"),Kl("data","desc")),P=ur(w,L=>{e(L.docs.map(F=>({id:F.id,...F.data()}))),i(!1)});return()=>{v(),P()}},[]);const k=async v=>{v.preventDefault();try{await rp(zt(tt,"transactions"),{...p,valor:parseFloat(p.valor),criadoEm:new Date}),l(!1),m({...p,descricao:"",valor:""})}catch(w){console.error("Erro ao adicionar transação: ",w),alert("Erro ao salvar transação.")}},T=async v=>{window.confirm("Tem certeza que deseja excluir esta transação?")&&await np(Ks(tt,"transactions",v))},R=v=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v),j=v=>{const[w,P,L]=v.split("-");return`${L}/${P}/${w}`},S=t.filter(v=>v.descricao.toLowerCase().includes(u.toLowerCase())||v.categoria.toLowerCase().includes(u.toLowerCase()));return s?c.jsx("div",{className:"h-[80vh] flex items-center justify-center",children:c.jsx(li,{size:"lg",color:"text-indigo-500"})}):c.jsxs("div",{className:"space-y-6",children:[c.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-start md:items-center gap-4",children:[c.jsxs("div",{children:[c.jsx("h1",{className:"text-3xl font-bold text-white tracking-tight",children:"Transações"}),c.jsx("p",{className:"text-slate-400 text-sm",children:"Gerencie suas entradas e saídas."})]}),c.jsxs("div",{className:"flex items-center gap-3 w-full md:w-auto",children:[c.jsxs("div",{className:"relative flex-1 md:w-64",children:[c.jsx(hN,{className:"absolute left-3 top-1/2 -translate-y-1/2 text-slate-500",size:18}),c.jsx("input",{type:"text",placeholder:"Buscar...",value:u,onChange:v=>h(v.target.value),className:"w-full bg-[#101623] border border-[#1e293b] rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"})]}),c.jsxs("button",{onClick:()=>l(!0),className:"bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg shadow-indigo-600/20",children:[c.jsx(ip,{size:18}),"Nova"]})]})]}),c.jsx("div",{className:"bg-[#101623] border border-[#1e293b] rounded-3xl overflow-hidden",children:S.length===0?c.jsx("div",{className:"p-8 text-center text-slate-500",children:"Nenhuma transação encontrada."}):c.jsx("div",{className:"divide-y divide-[#1e293b]",children:S.map(v=>c.jsxs("div",{className:"p-4 md:p-5 flex items-center justify-between hover:bg-[#151d2d] transition-colors group",children:[c.jsxs("div",{className:"flex items-center gap-4",children:[c.jsx("div",{className:`p-3 rounded-2xl ${v.tipo==="entrada"?"bg-emerald-500/10 text-emerald-400":"bg-rose-500/10 text-rose-400"}`,children:v.tipo==="entrada"?c.jsx(Zb,{size:24}):c.jsx(Xb,{size:24})}),c.jsxs("div",{children:[c.jsx("h4",{className:"text-white font-medium",children:v.descricao}),c.jsxs("div",{className:"flex items-center gap-2 text-xs text-slate-400 mt-1",children:[c.jsx("span",{className:"bg-[#1e293b] px-2 py-0.5 rounded-md",children:v.categoria}),c.jsx("span",{children:"•"}),c.jsx("span",{children:j(v.data)})]})]})]}),c.jsxs("div",{className:"flex items-center gap-4",children:[c.jsxs("span",{className:`font-bold ${v.tipo==="entrada"?"text-emerald-400":"text-white"}`,children:[v.tipo==="entrada"?"+ ":"- ",R(v.valor)]}),c.jsx("button",{onClick:()=>T(v.id),className:"text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all p-2",title:"Excluir",children:c.jsx(ap,{size:18})})]})]},v.id))})}),o&&c.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4",children:c.jsxs("div",{className:"bg-[#101623] border border-[#1e293b] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200",children:[c.jsxs("div",{className:"p-6 border-b border-[#1e293b] flex justify-between items-center",children:[c.jsx("h2",{className:"text-xl font-bold text-white",children:"Nova Transação"}),c.jsx("button",{onClick:()=>l(!1),className:"text-slate-400 hover:text-white",children:c.jsx(Xo,{size:24})})]}),c.jsxs("form",{onSubmit:k,className:"p-6 space-y-4",children:[c.jsxs("div",{className:"flex p-1 bg-[#070b14] rounded-xl border border-[#1e293b]",children:[c.jsx("button",{type:"button",onClick:()=>m({...p,tipo:"saida",categoria:y.saida[0]}),className:`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${p.tipo==="saida"?"bg-rose-500 text-white":"text-slate-400 hover:text-white"}`,children:"Saída"}),c.jsx("button",{type:"button",onClick:()=>m({...p,tipo:"entrada",categoria:y.entrada[0]}),className:`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${p.tipo==="entrada"?"bg-emerald-500 text-white":"text-slate-400 hover:text-white"}`,children:"Entrada"})]}),c.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[c.jsxs("div",{className:"col-span-2",children:[c.jsx("label",{className:"block text-xs font-medium text-slate-400 mb-1",children:"Descrição"}),c.jsx("input",{required:!0,type:"text",value:p.descricao,onChange:v=>m({...p,descricao:v.target.value}),className:"w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none",placeholder:"Ex: Supermercado"})]}),c.jsxs("div",{children:[c.jsx("label",{className:"block text-xs font-medium text-slate-400 mb-1",children:"Valor (R$)"}),c.jsx("input",{required:!0,type:"number",step:"0.01",min:"0",value:p.valor,onChange:v=>m({...p,valor:v.target.value}),className:"w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none",placeholder:"0,00"})]}),c.jsxs("div",{children:[c.jsx("label",{className:"block text-xs font-medium text-slate-400 mb-1",children:"Data"}),c.jsx("input",{required:!0,type:"date",value:p.data,onChange:v=>m({...p,data:v.target.value}),className:"w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none [color-scheme:dark]"})]})]}),c.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[c.jsxs("div",{children:[c.jsx("label",{className:"block text-xs font-medium text-slate-400 mb-1",children:"Categoria"}),c.jsx("select",{required:!0,value:p.categoria,onChange:v=>m({...p,categoria:v.target.value}),className:"w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none",children:y[p.tipo].map(v=>c.jsx("option",{value:v,children:v},v))})]}),c.jsxs("div",{children:[c.jsx("label",{className:"block text-xs font-medium text-slate-400 mb-1",children:"Conta/Carteira"}),c.jsxs("select",{required:!0,value:p.conta_id,onChange:v=>m({...p,conta_id:v.target.value}),className:"w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none",children:[c.jsx("option",{value:"",children:"Selecione..."}),n.map(v=>c.jsxs("option",{value:v.id,children:[v.nome," (",v.banco,")"]},v.id))]})]})]}),c.jsx("button",{type:"submit",className:"w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors mt-4",children:"Salvar Transação"})]})]})})]})}function AN(){const[t,e]=O.useState([]),[n,r]=O.useState(!0),[s,i]=O.useState(!1),[o,l]=O.useState({nome:"",banco:"",tipo:"Corrente",saldo:""}),u=["Corrente","Poupança","Investimentos","Carteira Física"];O.useEffect(()=>{const T=ur(zt(tt,"accounts"),R=>{e(R.docs.map(j=>({id:j.id,...j.data()}))),r(!1)});return()=>T()},[]);const h=async T=>{T.preventDefault();try{await rp(zt(tt,"accounts"),{...o,saldo:parseFloat(o.saldo)||0,criadoEm:new Date}),i(!1),l({nome:"",banco:"",tipo:"Corrente",saldo:""})}catch(R){console.error("Erro ao adicionar conta: ",R)}},p=async T=>{window.confirm("Atenção: Excluir esta conta NÃO exclui as transações vinculadas a ela. Deseja continuar?")&&await np(Ks(tt,"accounts",T))},m=T=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(T),y=T=>{switch(T){case"Investimentos":return{icon:Ql,cor:"text-indigo-400",bg:"bg-indigo-500/10",border:"hover:border-indigo-500/50"};case"Carteira Física":return{icon:Mx,cor:"text-emerald-400",bg:"bg-emerald-500/10",border:"hover:border-emerald-500/50"};case"Poupança":return{icon:nN,cor:"text-blue-400",bg:"bg-blue-500/10",border:"hover:border-blue-500/50"};default:return{icon:ah,cor:"text-slate-200",bg:"bg-slate-700/30",border:"hover:border-slate-500/50"}}};if(n)return c.jsx("div",{className:"h-[80vh] flex items-center justify-center",children:c.jsx(li,{size:"lg",color:"text-indigo-500"})});const k=t.reduce((T,R)=>T+(parseFloat(R.saldo)||0),0);return c.jsxs("div",{className:"space-y-6",children:[c.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-start md:items-center gap-4",children:[c.jsxs("div",{children:[c.jsx("h1",{className:"text-3xl font-bold text-white tracking-tight",children:"Contas e Caixas"}),c.jsx("p",{className:"text-slate-400 text-sm",children:"Gerencie de onde o dinheiro sai e para onde vai."})]}),c.jsxs("div",{className:"flex items-center gap-4",children:[c.jsxs("div",{className:"text-right hidden sm:block mr-4",children:[c.jsx("p",{className:"text-xs text-slate-400 uppercase tracking-widest font-bold",children:"Patrimônio Total"}),c.jsx("p",{className:"text-xl font-black text-emerald-400",children:m(k)})]}),c.jsxs("button",{onClick:()=>i(!0),className:"bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20",children:[c.jsx(ip,{size:18})," Nova Conta"]})]})]}),t.length===0?c.jsxs("div",{className:"bg-[#101623] border border-[#1e293b] rounded-3xl p-12 text-center",children:[c.jsx(ah,{size:48,className:"mx-auto text-slate-600 mb-4"}),c.jsx("h3",{className:"text-lg font-bold text-white mb-2",children:"Nenhuma conta cadastrada"}),c.jsx("p",{className:"text-slate-400",children:"Adicione sua primeira conta bancária ou carteira para começar."})]}):c.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",children:t.map(T=>{const R=y(T.tipo),j=R.icon;return c.jsxs("div",{className:`bg-[#101623] border border-[#1e293b] p-6 rounded-3xl relative overflow-hidden group transition-all duration-300 ${R.border}`,children:[c.jsx("button",{onClick:()=>p(T.id),className:"absolute top-4 right-4 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity bg-[#070b14] p-2 rounded-lg",title:"Excluir Conta",children:c.jsx(ap,{size:16})}),c.jsxs("div",{className:"flex items-center gap-4 mb-6",children:[c.jsx("div",{className:`p-4 rounded-2xl ${R.bg} ${R.cor}`,children:c.jsx(j,{size:28})}),c.jsxs("div",{children:[c.jsx("h3",{className:"text-lg font-bold text-white",children:T.nome}),c.jsxs("p",{className:"text-sm text-slate-400",children:[T.banco," • ",T.tipo]})]})]}),c.jsxs("div",{className:"mt-4",children:[c.jsx("p",{className:"text-xs text-slate-500 font-medium uppercase tracking-wider mb-1",children:"Saldo Atual"}),c.jsx("h2",{className:`text-3xl font-black ${R.cor}`,children:m(T.saldo)})]}),c.jsx("div",{className:"absolute -bottom-6 -right-6 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500",children:c.jsx(j,{size:120})})]},T.id)})}),s&&c.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4",children:c.jsxs("div",{className:"bg-[#101623] border border-[#1e293b] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200",children:[c.jsxs("div",{className:"p-6 border-b border-[#1e293b] flex justify-between items-center",children:[c.jsx("h2",{className:"text-xl font-bold text-white",children:"Adicionar Conta"}),c.jsx("button",{onClick:()=>i(!1),className:"text-slate-400 hover:text-white",children:c.jsx(Xo,{size:24})})]}),c.jsxs("form",{onSubmit:h,className:"p-6 space-y-4",children:[c.jsxs("div",{children:[c.jsx("label",{className:"block text-xs font-medium text-slate-400 mb-1",children:"Nome (Apelido)"}),c.jsx("input",{required:!0,type:"text",value:o.nome,onChange:T=>l({...o,nome:T.target.value}),className:"w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none",placeholder:"Ex: Reserva Nu"})]}),c.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[c.jsxs("div",{children:[c.jsx("label",{className:"block text-xs font-medium text-slate-400 mb-1",children:"Instituição/Banco"}),c.jsx("input",{required:!0,type:"text",value:o.banco,onChange:T=>l({...o,banco:T.target.value}),className:"w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none",placeholder:"Ex: Nubank"})]}),c.jsxs("div",{children:[c.jsx("label",{className:"block text-xs font-medium text-slate-400 mb-1",children:"Tipo de Conta"}),c.jsx("select",{required:!0,value:o.tipo,onChange:T=>l({...o,tipo:T.target.value}),className:"w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none",children:u.map(T=>c.jsx("option",{value:T,children:T},T))})]})]}),c.jsxs("div",{children:[c.jsx("label",{className:"block text-xs font-medium text-slate-400 mb-1",children:"Saldo Inicial (R$)"}),c.jsx("input",{required:!0,type:"number",step:"0.01",value:o.saldo,onChange:T=>l({...o,saldo:T.target.value}),className:"w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none",placeholder:"0,00"})]}),c.jsx("button",{type:"submit",className:"w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors mt-4",children:"Salvar Conta"})]})]})})]})}function RN(){const[t,e]=O.useState([]),[n,r]=O.useState([]),[s,i]=O.useState(!0),[o,l]=O.useState(!1),[u,h]=O.useState({nome:"",tipo:"Orçamento",orcamento:"",inicio:"",fim:""});O.useEffect(()=>{const T=Hl(zt(tt,"ciclos"),Kl("fim","asc")),R=ur(T,S=>{e(S.docs.map(v=>({id:v.id,...v.data()})))}),j=ur(zt(tt,"transactions"),S=>{r(S.docs.map(v=>({id:v.id,...v.data()}))),i(!1)});return()=>{R(),j()}},[]);const p=async T=>{T.preventDefault();try{await rp(zt(tt,"ciclos"),{...u,orcamento:parseFloat(u.orcamento)||0,criadoEm:new Date}),l(!1),h({nome:"",tipo:"Orçamento",orcamento:"",inicio:"",fim:""})}catch(R){console.error("Erro ao adicionar ciclo: ",R)}},m=async T=>{window.confirm("Deseja realmente excluir esta meta/orçamento?")&&await np(Ks(tt,"ciclos",T))},y=T=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(T),k=T=>T?T.split("-").reverse().join("/"):"";return s?c.jsx("div",{className:"h-[80vh] flex items-center justify-center",children:c.jsx(li,{size:"lg",color:"text-indigo-500"})}):c.jsxs("div",{className:"space-y-6",children:[c.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-start md:items-center gap-4",children:[c.jsxs("div",{children:[c.jsx("h1",{className:"text-3xl font-bold text-white tracking-tight",children:"Ciclos e Metas"}),c.jsx("p",{className:"text-slate-400 text-sm",children:"Defina seus orçamentos mensais e acompanhe seus grandes objetivos."})]}),c.jsxs("button",{onClick:()=>l(!0),className:"bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20",children:[c.jsx(ip,{size:18})," Novo Objetivo"]})]}),t.length===0?c.jsxs("div",{className:"bg-[#101623] border border-[#1e293b] rounded-3xl p-12 text-center",children:[c.jsx(Gl,{size:48,className:"mx-auto text-slate-600 mb-4"}),c.jsx("h3",{className:"text-lg font-bold text-white mb-2",children:"Nenhum ciclo ativo"}),c.jsx("p",{className:"text-slate-400",children:"Crie um orçamento para o mês ou uma meta financeira (ex: Reserva de Emergência)."})]}):c.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",children:t.map(T=>{const R=n.filter(w=>w.data>=T.inicio&&w.data<=T.fim);let j=0;T.tipo==="Orçamento"?j=R.filter(w=>w.tipo==="saida").reduce((w,P)=>w+(parseFloat(P.valor)||0),0):j=R.filter(w=>w.tipo==="entrada").reduce((w,P)=>w+(parseFloat(P.valor)||0),0);const S=Math.min(100,j/T.orcamento*100),v=T.tipo==="Orçamento"&&S>=100;return c.jsxs("div",{className:"bg-[#101623] border border-[#1e293b] p-6 rounded-3xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors",children:[c.jsx("button",{onClick:()=>m(T.id),className:"absolute top-4 right-4 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity bg-[#070b14] p-2 rounded-lg",title:"Excluir",children:c.jsx(ap,{size:16})}),c.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[c.jsx("div",{className:`p-3 rounded-xl ${T.tipo==="Meta"?"bg-indigo-500/10 text-indigo-400":"bg-emerald-500/10 text-emerald-400"}`,children:T.tipo==="Meta"?c.jsx(Gl,{size:20}):c.jsx(Vx,{size:20})}),c.jsxs("div",{children:[c.jsx("h3",{className:"text-white font-bold",children:T.nome}),c.jsx("span",{className:"text-xs text-slate-400",children:T.tipo})]})]}),c.jsxs("div",{className:"flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium",children:[c.jsx(rN,{size:14}),k(T.inicio)," até ",k(T.fim)]}),c.jsxs("div",{className:"space-y-2",children:[c.jsxs("div",{className:"flex justify-between items-end",children:[c.jsx("span",{className:"text-slate-400 text-xs uppercase font-bold tracking-wider",children:T.tipo==="Orçamento"?"Gasto":"Acumulado"}),c.jsx("span",{className:`font-bold ${v?"text-rose-400":"text-white"}`,children:y(j)})]}),c.jsx("div",{className:"w-full bg-[#1e293b] h-2 rounded-full overflow-hidden",children:c.jsx("div",{className:`h-full transition-all duration-1000 ${T.tipo==="Meta"?"bg-indigo-500":v?"bg-rose-500":"bg-emerald-400"}`,style:{width:`${S}%`}})}),c.jsxs("p",{className:"text-xs text-slate-500 text-right",children:["Alvo: ",y(T.orcamento)]})]})]},T.id)})}),o&&c.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4",children:c.jsxs("div",{className:"bg-[#101623] border border-[#1e293b] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200",children:[c.jsxs("div",{className:"p-6 border-b border-[#1e293b] flex justify-between items-center",children:[c.jsx("h2",{className:"text-xl font-bold text-white",children:"Novo Ciclo / Meta"}),c.jsx("button",{onClick:()=>l(!1),className:"text-slate-400 hover:text-white",children:c.jsx(Xo,{size:24})})]}),c.jsxs("form",{onSubmit:p,className:"p-6 space-y-4",children:[c.jsxs("div",{className:"flex p-1 bg-[#070b14] rounded-xl border border-[#1e293b]",children:[c.jsx("button",{type:"button",onClick:()=>h({...u,tipo:"Orçamento"}),className:`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${u.tipo==="Orçamento"?"bg-emerald-500 text-white":"text-slate-400 hover:text-white"}`,children:"Orçamento Mensal"}),c.jsx("button",{type:"button",onClick:()=>h({...u,tipo:"Meta"}),className:`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${u.tipo==="Meta"?"bg-indigo-600 text-white":"text-slate-400 hover:text-white"}`,children:"Meta / Viagem"})]}),c.jsxs("div",{children:[c.jsx("label",{className:"block text-xs font-medium text-slate-400 mb-1",children:"Nome do Objetivo"}),c.jsx("input",{required:!0,type:"text",value:u.nome,onChange:T=>h({...u,nome:T.target.value}),className:"w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none",placeholder:u.tipo==="Meta"?"Ex: Viagem Japão":"Ex: Orçamento de Junho"})]}),c.jsxs("div",{children:[c.jsx("label",{className:"block text-xs font-medium text-slate-400 mb-1",children:"Valor Alvo/Limite (R$)"}),c.jsx("input",{required:!0,type:"number",step:"0.01",value:u.orcamento,onChange:T=>h({...u,orcamento:T.target.value}),className:"w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none",placeholder:"0,00"})]}),c.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[c.jsxs("div",{children:[c.jsx("label",{className:"block text-xs font-medium text-slate-400 mb-1",children:"Data de Início"}),c.jsx("input",{required:!0,type:"date",value:u.inicio,onChange:T=>h({...u,inicio:T.target.value}),className:"w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none [color-scheme:dark]"})]}),c.jsxs("div",{children:[c.jsx("label",{className:"block text-xs font-medium text-slate-400 mb-1",children:"Data Final"}),c.jsx("input",{required:!0,type:"date",value:u.fim,onChange:T=>h({...u,fim:T.target.value}),className:"w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none [color-scheme:dark]"})]})]}),c.jsxs("button",{type:"submit",className:"w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors mt-4",children:["Salvar ",u.tipo]})]})]})})]})}function bN(){const[t,e]=O.useState([{id:1,role:"ai",text:"Olá! Sou o Capital Advisor, sua inteligência artificial financeira. Analisei seu padrão de gastos recentes. Como posso ajudar você a otimizar seu patrimônio hoje?"}]),[n,r]=O.useState(""),[s,i]=O.useState(!1),o=O.useRef(null),l=()=>{var h;(h=o.current)==null||h.scrollIntoView({behavior:"smooth"})};O.useEffect(()=>{l()},[t,s]);const u=h=>{if(h.preventDefault(),!n.trim())return;const p={id:Date.now(),role:"user",text:n};e(m=>[...m,p]),r(""),i(!0),setTimeout(()=>{i(!1);const m={id:Date.now()+1,role:"ai",text:"Nesta versão de demonstração, estou simulando uma resposta. Para que eu leia seus dados reais, basta conectar minha API (OpenAI/Gemini) no seu backend! Baseado nos seus últimos registros, recomendo investir 20% do saldo atual no Tesouro Selic para compor sua Reserva de Emergência."};e(y=>[...y,m])},1500)};return c.jsxs("div",{className:"space-y-6 flex flex-col h-[calc(100vh-8rem)]",children:[c.jsx("div",{className:"flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0",children:c.jsxs("div",{children:[c.jsxs("h1",{className:"text-3xl font-bold text-white tracking-tight flex items-center gap-2",children:[c.jsx(op,{className:"text-indigo-400",size:28})," Capital Advisor"]}),c.jsx("p",{className:"text-slate-400 text-sm",children:"Seu assistente financeiro movido a Inteligência Artificial."})]})}),c.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0",children:[c.jsxs("div",{className:"bg-[#101623] border border-[#1e293b] p-5 rounded-2xl flex gap-4 items-start",children:[c.jsx("div",{className:"p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0",children:c.jsx(Ql,{size:20})}),c.jsxs("div",{children:[c.jsx("h4",{className:"text-white font-bold text-sm mb-1",children:"Oportunidade"}),c.jsx("p",{className:"text-xs text-slate-400 leading-relaxed",children:"Seu fluxo de caixa está positivo. Considere transferir R$ 500 para sua conta de Investimentos."})]})]}),c.jsxs("div",{className:"bg-[#101623] border border-[#1e293b] p-5 rounded-2xl flex gap-4 items-start",children:[c.jsx("div",{className:"p-3 bg-rose-500/10 text-rose-400 rounded-xl shrink-0",children:c.jsx(Dx,{size:20})}),c.jsxs("div",{children:[c.jsx("h4",{className:"text-white font-bold text-sm mb-1",children:"Alerta de Gasto"}),c.jsx("p",{className:"text-xs text-slate-400 leading-relaxed",children:'Os gastos com "Alimentação" subiram 18% em relação ao mês passado.'})]})]}),c.jsxs("div",{className:"bg-indigo-600 p-5 rounded-2xl flex gap-4 items-start shadow-lg shadow-indigo-600/20 text-white",children:[c.jsx("div",{className:"p-3 bg-white/20 rounded-xl shrink-0",children:c.jsx(aN,{size:20})}),c.jsxs("div",{children:[c.jsx("h4",{className:"font-bold text-sm mb-1",children:"Dica do Advisor"}),c.jsx("p",{className:"text-xs text-indigo-100 leading-relaxed",children:'A meta "Viagem Japão" está atrasada. Tente poupar mais R$ 150/mês.'})]})]})]}),c.jsxs("div",{className:"flex-1 bg-[#101623] border border-[#1e293b] rounded-3xl flex flex-col overflow-hidden min-h-[400px]",children:[c.jsxs("div",{className:"flex-1 overflow-y-auto p-6 space-y-6",children:[t.map(h=>c.jsxs("div",{className:`flex gap-4 ${h.role==="user"?"flex-row-reverse":""}`,children:[c.jsx("div",{className:`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${h.role==="user"?"bg-slate-700 text-white":"bg-indigo-600 text-white"}`,children:h.role==="user"?c.jsx(Lx,{size:20}):c.jsx($y,{size:20})}),c.jsx("div",{className:`max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${h.role==="user"?"bg-[#1e293b] text-white rounded-tr-sm":"bg-indigo-500/10 border border-indigo-500/20 text-slate-200 rounded-tl-sm"}`,children:h.text})]},h.id)),s&&c.jsxs("div",{className:"flex gap-4",children:[c.jsx("div",{className:"w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0",children:c.jsx($y,{size:20,className:"text-white"})}),c.jsxs("div",{className:"bg-indigo-500/10 border border-indigo-500/20 rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center",children:[c.jsx("div",{className:"w-2 h-2 bg-indigo-400 rounded-full animate-bounce"}),c.jsx("div",{className:"w-2 h-2 bg-indigo-400 rounded-full animate-bounce",style:{animationDelay:"0.2s"}}),c.jsx("div",{className:"w-2 h-2 bg-indigo-400 rounded-full animate-bounce",style:{animationDelay:"0.4s"}})]})]}),c.jsx("div",{ref:o})]}),c.jsxs("div",{className:"p-4 border-t border-[#1e293b] bg-[#070b14]",children:[c.jsxs("form",{onSubmit:u,className:"relative flex items-center",children:[c.jsx("input",{type:"text",value:n,onChange:h=>r(h.target.value),placeholder:"Pergunte sobre seus investimentos, gastos ou metas...",className:"w-full bg-[#101623] border border-[#1e293b] text-white rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:border-indigo-500 transition-colors"}),c.jsx("button",{type:"submit",disabled:!n.trim()||s,className:"absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-colors",children:c.jsx(fN,{size:18})})]}),c.jsx("p",{className:"text-center text-[10px] text-slate-500 mt-3 font-medium",children:"O Capital Advisor pode cometer erros. Considere verificar informações importantes."})]})]})]})}function NN({children:t}){const{currentUser:e,loading:n}=ai();return n?c.jsx("div",{className:"h-screen flex items-center justify-center bg-slate-900 text-white font-bold",children:"Carregando CapitalCycle..."}):e?t:c.jsx(p_,{to:"/login",replace:!0})}function PN(){return c.jsx(Hb,{children:c.jsx(KI,{children:c.jsxs(UI,{children:[c.jsx(jt,{path:"/",element:c.jsx(TN,{})}),c.jsx(jt,{path:"/login",element:c.jsx(vN,{})}),c.jsxs(jt,{path:"/capital",element:c.jsx(NN,{children:c.jsx(yN,{})}),children:[c.jsx(jt,{path:"dashboard",element:c.jsx(SN,{})}),c.jsx(jt,{path:"transacoes",element:c.jsx(CN,{})}),c.jsx(jt,{path:"contas",element:c.jsx(AN,{})}),c.jsx(jt,{path:"ciclos",element:c.jsx(RN,{})}),c.jsx(jt,{path:"analise-ia",element:c.jsx(bN,{})})]}),c.jsx(jt,{path:"*",element:c.jsx(p_,{to:"/",replace:!0})}),c.jsx(jt,{path:"/cadastro",element:c.jsx(IN,{})})]})})})}Lc.createRoot(document.getElementById("root")).render(c.jsx(nv.StrictMode,{children:c.jsx(PN,{})}));
