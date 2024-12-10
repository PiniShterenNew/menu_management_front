import{e as O,b as k,g as it,c as D,d as $e,_ as Et,a as wt,k as _t}from"./@babel-BZ1DyXOP.js";import{c as ze}from"./classnames-BK5ccKcQ.js";import{R as ut}from"./rc-resize-observer-DeFxiL4a.js";import{o as U,R as Lt,u as Se,i as Je}from"./rc-util-Dfq69fzz.js";import{r as t}from"./react-CeYxiRmC.js";import{r as Qe}from"./react-dom-Bwn-WS6j.js";var ot=t.forwardRef(function(e,h){var s=e.height,c=e.offsetY,f=e.offsetX,v=e.children,l=e.prefixCls,u=e.onInnerResize,b=e.innerProps,d=e.rtl,g=e.extra,n={},S={display:"flex",flexDirection:"column"};return c!==void 0&&(n={height:s,position:"relative",overflow:"hidden"},S=O(O({},S),{},k(k(k(k(k({transform:"translateY(".concat(c,"px)")},d?"marginRight":"marginLeft",-f),"position","absolute"),"left",0),"right",0),"top",0))),t.createElement("div",{style:n},t.createElement(ut,{onResize:function(R){var i=R.offsetHeight;i&&u&&u()}},t.createElement("div",it({style:S,className:ze(k({},"".concat(l,"-holder-inner"),l)),ref:h},b),v,g)))});ot.displayName="Filler";function zt(e){var h=e.children,s=e.setRef,c=t.useCallback(function(f){s(f)},[]);return t.cloneElement(h,{ref:c})}function Dt(e,h,s,c,f,v,l,u){var b=u.getKey;return e.slice(h,s+1).map(function(d,g){var n=h+g,S=l(d,n,{style:{width:c},offsetX:f}),o=b(d);return t.createElement(zt,{key:o,setRef:function(i){return v(d,i)}},S)})}function Tt(e,h,s){var c=e.length,f=h.length,v,l;if(c===0&&f===0)return null;c<f?(v=e,l=h):(v=h,l=e);var u={__EMPTY_ITEM__:!0};function b(R){return R!==void 0?s(R):u}for(var d=null,g=Math.abs(c-f)!==1,n=0;n<l.length;n+=1){var S=b(v[n]),o=b(l[n]);if(S!==o){d=n,g=g||S!==b(l[n+1]);break}}return d===null?null:{index:d,multiple:g}}function Ct(e,h,s){var c=t.useState(e),f=D(c,2),v=f[0],l=f[1],u=t.useState(null),b=D(u,2),d=b[0],g=b[1];return t.useEffect(function(){var n=Tt(v||[],e||[],h);(n==null?void 0:n.index)!==void 0&&g(e[n.index]),l(e)},[e]),[d]}var et=(typeof navigator>"u"?"undefined":$e(navigator))==="object"&&/Firefox/i.test(navigator.userAgent);const lt=function(e,h,s,c){var f=t.useRef(!1),v=t.useRef(null);function l(){clearTimeout(v.current),f.current=!0,v.current=setTimeout(function(){f.current=!1},50)}var u=t.useRef({top:e,bottom:h,left:s,right:c});return u.current.top=e,u.current.bottom=h,u.current.left=s,u.current.right=c,function(b,d){var g=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,n=b?d<0&&u.current.left||d>0&&u.current.right:d<0&&u.current.top||d>0&&u.current.bottom;return g&&n?(clearTimeout(v.current),f.current=!1):(!n||f.current)&&l(),!f.current&&n}};function It(e,h,s,c,f,v,l){var u=t.useRef(0),b=t.useRef(null),d=t.useRef(null),g=t.useRef(!1),n=lt(h,s,c,f);function S(m,y){if(U.cancel(b.current),!n(!1,y)){var _=m;if(!_._virtualHandled)_._virtualHandled=!0;else return;u.current+=y,d.current=y,et||_.preventDefault(),b.current=U(function(){var V=g.current?10:1;l(u.current*V,!1),u.current=0})}}function o(m,y){l(y,!0),et||m.preventDefault()}var R=t.useRef(null),i=t.useRef(null);function M(m){if(e){U.cancel(i.current),i.current=U(function(){R.current=null},2);var y=m.deltaX,_=m.deltaY,V=m.shiftKey,Y=y,x=_;(R.current==="sx"||!R.current&&V&&_&&!y)&&(Y=_,x=0,R.current="sx");var W=Math.abs(Y),$=Math.abs(x);R.current===null&&(R.current=v&&W>$?"x":"y"),R.current==="y"?S(m,x):o(m,Y)}}function w(m){e&&(g.current=m.detail===d.current)}return[M,w]}function Ht(e,h,s,c){var f=t.useMemo(function(){return[new Map,[]]},[e,s.id,c]),v=D(f,2),l=v[0],u=v[1],b=function(g){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:g,S=l.get(g),o=l.get(n);if(S===void 0||o===void 0)for(var R=e.length,i=u.length;i<R;i+=1){var M,w=e[i],m=h(w);l.set(m,i);var y=(M=s.get(m))!==null&&M!==void 0?M:c;if(u[i]=(u[i-1]||0)+y,m===g&&(S=i),m===n&&(o=i),S!==void 0&&o!==void 0)break}return{top:u[S-1]||0,bottom:u[o]}};return b}var Pt=function(){function e(){wt(this,e),k(this,"maps",void 0),k(this,"id",0),this.maps=Object.create(null)}return Et(e,[{key:"set",value:function(s,c){this.maps[s]=c,this.id+=1}},{key:"get",value:function(s){return this.maps[s]}}]),e}();function kt(e,h,s){var c=t.useState(0),f=D(c,2),v=f[0],l=f[1],u=t.useRef(new Map),b=t.useRef(new Pt),d=t.useRef();function g(){U.cancel(d.current)}function n(){var o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1;g();var R=function(){u.current.forEach(function(M,w){if(M&&M.offsetParent){var m=Lt(M),y=m.offsetHeight;b.current.get(w)!==y&&b.current.set(w,m.offsetHeight)}}),l(function(M){return M+1})};o?R():d.current=U(R)}function S(o,R){var i=e(o);u.current.get(i),R?(u.current.set(i,R),n()):u.current.delete(i)}return t.useEffect(function(){return g},[]),[S,n,b.current,v]}var tt=14/15;function Ot(e,h,s){var c=t.useRef(!1),f=t.useRef(0),v=t.useRef(0),l=t.useRef(null),u=t.useRef(null),b,d=function(o){if(c.current){var R=Math.ceil(o.touches[0].pageX),i=Math.ceil(o.touches[0].pageY),M=f.current-R,w=v.current-i,m=Math.abs(M)>Math.abs(w);m?f.current=R:v.current=i;var y=s(m,m?M:w,!1,o);y&&o.preventDefault(),clearInterval(u.current),y&&(u.current=setInterval(function(){m?M*=tt:w*=tt;var _=Math.floor(m?M:w);(!s(m,_,!0)||Math.abs(_)<=.1)&&clearInterval(u.current)},16))}},g=function(){c.current=!1,b()},n=function(o){b(),o.touches.length===1&&!c.current&&(c.current=!0,f.current=Math.ceil(o.touches[0].pageX),v.current=Math.ceil(o.touches[0].pageY),l.current=o.target,l.current.addEventListener("touchmove",d,{passive:!1}),l.current.addEventListener("touchend",g,{passive:!0}))};b=function(){l.current&&(l.current.removeEventListener("touchmove",d),l.current.removeEventListener("touchend",g))},Se(function(){return e&&h.current.addEventListener("touchstart",n,{passive:!0}),function(){var S;(S=h.current)===null||S===void 0||S.removeEventListener("touchstart",n),b(),clearInterval(u.current)}},[e])}var $t=10;function Nt(e,h,s,c,f,v,l,u){var b=t.useRef(),d=t.useState(null),g=D(d,2),n=g[0],S=g[1];return Se(function(){if(n&&n.times<$t){if(!e.current){S(function(T){return O({},T)});return}v();var o=n.targetAlign,R=n.originAlign,i=n.index,M=n.offset,w=e.current.clientHeight,m=!1,y=o,_=null;if(w){for(var V=o||R,Y=0,x=0,W=0,$=Math.min(h.length-1,i),G=0;G<=$;G+=1){var A=f(h[G]);x=Y;var J=s.get(A);W=x+(J===void 0?c:J),Y=W}for(var Q=V==="top"?M:w-M,N=$;N>=0;N-=1){var te=f(h[N]),H=s.get(te);if(H===void 0){m=!0;break}if(Q-=H,Q<=0)break}switch(V){case"top":_=x-M;break;case"bottom":_=W-w+M;break;default:{var q=e.current.scrollTop,B=q+w;x<q?y="top":W>B&&(y="bottom")}}_!==null&&l(_),_!==n.lastTop&&(m=!0)}m&&S(O(O({},n),{},{times:n.times+1,targetAlign:y,lastTop:_}))}},[n,e.current]),function(o){if(o==null){u();return}if(U.cancel(b.current),typeof o=="number")l(o);else if(o&&$e(o)==="object"){var R,i=o.align;"index"in o?R=o.index:R=h.findIndex(function(m){return f(m)===o.key});var M=o.offset,w=M===void 0?0:M;S({times:0,index:R,offset:w,originAlign:i})}}}function rt(e,h){var s="touches"in e?e.touches[0]:e;return s[h?"pageX":"pageY"]}var nt=t.forwardRef(function(e,h){var s=e.prefixCls,c=e.rtl,f=e.scrollOffset,v=e.scrollRange,l=e.onStartMove,u=e.onStopMove,b=e.onScroll,d=e.horizontal,g=e.spinSize,n=e.containerSize,S=e.style,o=e.thumbStyle,R=t.useState(!1),i=D(R,2),M=i[0],w=i[1],m=t.useState(null),y=D(m,2),_=y[0],V=y[1],Y=t.useState(null),x=D(Y,2),W=x[0],$=x[1],G=!c,A=t.useRef(),J=t.useRef(),Q=t.useState(!1),N=D(Q,2),te=N[0],H=N[1],q=t.useRef(),B=function(){clearTimeout(q.current),H(!0),q.current=setTimeout(function(){H(!1)},3e3)},T=v-n||0,oe=n-g||0,L=t.useMemo(function(){if(f===0||T===0)return 0;var P=f/T;return P*oe},[f,T,oe]),ee=function(E){E.stopPropagation(),E.preventDefault()},re=t.useRef({top:L,dragging:M,pageY:_,startTop:W});re.current={top:L,dragging:M,pageY:_,startTop:W};var ne=function(E){w(!0),V(rt(E,d)),$(re.current.top),l(),E.stopPropagation(),E.preventDefault()};t.useEffect(function(){var P=function(ae){ae.preventDefault()},E=A.current,X=J.current;return E.addEventListener("touchstart",P,{passive:!1}),X.addEventListener("touchstart",ne,{passive:!1}),function(){E.removeEventListener("touchstart",P),X.removeEventListener("touchstart",ne)}},[]);var ge=t.useRef();ge.current=T;var le=t.useRef();le.current=oe,t.useEffect(function(){if(M){var P,E=function(ae){var se=re.current,pe=se.dragging,Me=se.pageY,be=se.startTop;U.cancel(P);var ye=A.current.getBoundingClientRect(),ie=n/(d?ye.width:ye.height);if(pe){var ce=(rt(ae,d)-Me)*ie,fe=be;!G&&d?fe-=ce:fe+=ce;var xe=ge.current,Ee=le.current,De=Ee?fe/Ee:0,K=Math.ceil(De*xe);K=Math.max(K,0),K=Math.min(K,xe),P=U(function(){b(K,d)})}},X=function(){w(!1),u()};return window.addEventListener("mousemove",E,{passive:!0}),window.addEventListener("touchmove",E,{passive:!0}),window.addEventListener("mouseup",X,{passive:!0}),window.addEventListener("touchend",X,{passive:!0}),function(){window.removeEventListener("mousemove",E),window.removeEventListener("touchmove",E),window.removeEventListener("mouseup",X),window.removeEventListener("touchend",X),U.cancel(P)}}},[M]),t.useEffect(function(){return B(),function(){clearTimeout(q.current)}},[f]),t.useImperativeHandle(h,function(){return{delayHidden:B}});var C="".concat(s,"-scrollbar"),F={position:"absolute",visibility:te?null:"hidden"},j={position:"absolute",background:"rgba(0, 0, 0, 0.5)",borderRadius:99,cursor:"pointer",userSelect:"none"};return d?(F.height=8,F.left=0,F.right=0,F.bottom=0,j.height="100%",j.width=g,G?j.left=L:j.right=L):(F.width=8,F.top=0,F.bottom=0,G?F.right=0:F.left=0,j.width="100%",j.height=g,j.top=L),t.createElement("div",{ref:A,className:ze(C,k(k(k({},"".concat(C,"-horizontal"),d),"".concat(C,"-vertical"),!d),"".concat(C,"-visible"),te)),style:O(O({},F),S),onMouseDown:ee,onMouseMove:B},t.createElement("div",{ref:J,className:ze("".concat(C,"-thumb"),k({},"".concat(C,"-thumb-moving"),M)),style:O(O({},j),o),onMouseDown:ne}))}),Yt=20;function at(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0,h=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,s=e/h*e;return isNaN(s)&&(s=0),s=Math.max(s,Yt),Math.floor(s)}var Ft=["prefixCls","className","height","itemHeight","fullHeight","style","data","children","itemKey","virtual","direction","scrollWidth","component","onScroll","onVirtualScroll","onVisibleChange","innerProps","extraRender","styles"],Xt=[],Wt={overflowY:"auto",overflowAnchor:"none"};function Bt(e,h){var s=e.prefixCls,c=s===void 0?"rc-virtual-list":s,f=e.className,v=e.height,l=e.itemHeight,u=e.fullHeight,b=u===void 0?!0:u,d=e.style,g=e.data,n=e.children,S=e.itemKey,o=e.virtual,R=e.direction,i=e.scrollWidth,M=e.component,w=M===void 0?"div":M,m=e.onScroll,y=e.onVirtualScroll,_=e.onVisibleChange,V=e.innerProps,Y=e.extraRender,x=e.styles,W=_t(e,Ft),$=t.useCallback(function(a){return typeof S=="function"?S(a):a==null?void 0:a[S]},[S]),G=kt($),A=D(G,4),J=A[0],Q=A[1],N=A[2],te=A[3],H=!!(o!==!1&&v&&l),q=t.useMemo(function(){return Object.values(N.maps).reduce(function(a,r){return a+r},0)},[N.id,N.maps]),B=H&&g&&(Math.max(l*g.length,q)>v||!!i),T=R==="rtl",oe=ze(c,k({},"".concat(c,"-rtl"),T),f),L=g||Xt,ee=t.useRef(),re=t.useRef(),ne=t.useRef(),ge=t.useState(0),le=D(ge,2),C=le[0],F=le[1],j=t.useState(0),P=D(j,2),E=P[0],X=P[1],Re=t.useState(!1),ae=D(Re,2),se=ae[0],pe=ae[1],Me=function(){pe(!0)},be=function(){pe(!1)},ye={getKey:$};function ie(a){F(function(r){var p;typeof a=="function"?p=a(r):p=a;var z=ht(p);return ee.current.scrollTop=z,z})}var ce=t.useRef({start:0,end:L.length}),fe=t.useRef(),xe=Ct(L,$),Ee=D(xe,1),De=Ee[0];fe.current=De;var K=t.useMemo(function(){if(!H)return{scrollHeight:void 0,start:0,end:L.length-1,offset:void 0};if(!B){var a;return{scrollHeight:((a=re.current)===null||a===void 0?void 0:a.offsetHeight)||0,start:0,end:L.length-1,offset:void 0}}for(var r=0,p,z,I,Ze=L.length,me=0;me<Ze;me+=1){var yt=L[me],xt=$(yt),qe=N.get(xt),Oe=r+(qe===void 0?l:qe);Oe>=C&&p===void 0&&(p=me,z=r),Oe>C+v&&I===void 0&&(I=me),r=Oe}return p===void 0&&(p=0,z=0,I=Math.ceil(v/l)),I===void 0&&(I=L.length-1),I=Math.min(I+1,L.length-1),{scrollHeight:r,start:p,end:I,offset:z}},[B,H,C,L,te,v]),ue=K.scrollHeight,ve=K.start,de=K.end,Ne=K.offset;ce.current.start=ve,ce.current.end=de;var st=t.useState({width:0,height:v}),Ye=D(st,2),Z=Ye[0],ct=Ye[1],ft=function(r){ct({width:r.offsetWidth,height:r.offsetHeight})},Fe=t.useRef(),Xe=t.useRef(),vt=t.useMemo(function(){return at(Z.width,i)},[Z.width,i]),dt=t.useMemo(function(){return at(Z.height,ue)},[Z.height,ue]),Te=ue-v,Ce=t.useRef(Te);Ce.current=Te;function ht(a){var r=a;return Number.isNaN(Ce.current)||(r=Math.min(r,Ce.current)),r=Math.max(r,0),r}var we=C<=0,_e=C>=Te,We=E<=0,Be=E>=i,mt=lt(we,_e,We,Be),Ie=function(){return{x:T?-E:E,y:C}},He=t.useRef(Ie()),Le=Je(function(a){if(y){var r=O(O({},Ie()),a);(He.current.x!==r.x||He.current.y!==r.y)&&(y(r),He.current=r)}});function Ve(a,r){var p=a;r?(Qe.flushSync(function(){X(p)}),Le()):ie(p)}function St(a){var r=a.currentTarget.scrollTop;r!==C&&ie(r),m==null||m(a),Le()}var Pe=function(r){var p=r,z=i?i-Z.width:0;return p=Math.max(p,0),p=Math.min(p,z),p},gt=Je(function(a,r){r?(Qe.flushSync(function(){X(function(p){var z=p+(T?-a:a);return Pe(z)})}),Le()):ie(function(p){var z=p+a;return z})}),Rt=It(H,we,_e,We,Be,!!i,gt),Ae=D(Rt,2),ke=Ae[0],je=Ae[1];Ot(H,ee,function(a,r,p,z){var I=z;return mt(a,r,p)?!1:!I||!I._virtualHandled?(I&&(I._virtualHandled=!0),ke({preventDefault:function(){},deltaX:a?r:0,deltaY:a?0:r}),!0):!1}),Se(function(){function a(p){var z=we&&p.detail<0,I=_e&&p.detail>0;H&&!z&&!I&&p.preventDefault()}var r=ee.current;return r.addEventListener("wheel",ke,{passive:!1}),r.addEventListener("DOMMouseScroll",je,{passive:!0}),r.addEventListener("MozMousePixelScroll",a,{passive:!1}),function(){r.removeEventListener("wheel",ke),r.removeEventListener("DOMMouseScroll",je),r.removeEventListener("MozMousePixelScroll",a)}},[H,we,_e]),Se(function(){if(i){var a=Pe(E);X(a),Le({x:a})}},[Z.width,i]);var Ke=function(){var r,p;(r=Fe.current)===null||r===void 0||r.delayHidden(),(p=Xe.current)===null||p===void 0||p.delayHidden()},Ue=Nt(ee,L,N,l,$,function(){return Q(!0)},ie,Ke);t.useImperativeHandle(h,function(){return{nativeElement:ne.current,getScrollInfo:Ie,scrollTo:function(r){function p(z){return z&&$e(z)==="object"&&("left"in z||"top"in z)}p(r)?(r.left!==void 0&&X(Pe(r.left)),Ue(r.top)):Ue(r)}}}),Se(function(){if(_){var a=L.slice(ve,de+1);_(a,L)}},[ve,de,L]);var pt=Ht(L,$,N,l),Mt=Y==null?void 0:Y({start:ve,end:de,virtual:B,offsetX:E,offsetY:Ne,rtl:T,getSize:pt}),bt=Dt(L,ve,de,i,E,J,n,ye),he=null;v&&(he=O(k({},b?"height":"maxHeight",v),Wt),H&&(he.overflowY="hidden",i&&(he.overflowX="hidden"),se&&(he.pointerEvents="none")));var Ge={};return T&&(Ge.dir="rtl"),t.createElement("div",it({ref:ne,style:O(O({},d),{},{position:"relative"}),className:oe},Ge,W),t.createElement(ut,{onResize:ft},t.createElement(w,{className:"".concat(c,"-holder"),style:he,ref:ee,onScroll:St,onMouseEnter:Ke},t.createElement(ot,{prefixCls:c,height:ue,offsetX:E,offsetY:Ne,scrollWidth:i,onInnerResize:Q,ref:re,innerProps:V,rtl:T,extra:Mt},bt))),B&&ue>v&&t.createElement(nt,{ref:Fe,prefixCls:c,scrollOffset:C,scrollRange:ue,rtl:T,onScroll:Ve,onStartMove:Me,onStopMove:be,spinSize:dt,containerSize:Z.height,style:x==null?void 0:x.verticalScrollBar,thumbStyle:x==null?void 0:x.verticalScrollBarThumb}),B&&i>Z.width&&t.createElement(nt,{ref:Xe,prefixCls:c,scrollOffset:E,scrollRange:i,rtl:T,onScroll:Ve,onStartMove:Me,onStopMove:be,spinSize:vt,containerSize:Z.width,horizontal:!0,style:x==null?void 0:x.horizontalScrollBar,thumbStyle:x==null?void 0:x.horizontalScrollBarThumb}))}var Vt=t.forwardRef(Bt);Vt.displayName="List";export{Vt as L};
