import{k as se,h as xe,i as be,a as Ne,_ as Oe,d as me,c as D,e as l,b as g,j as Ce,g as Je}from"./@babel-BZ1DyXOP.js";import{c as Xe}from"./classnames-BK5ccKcQ.js";import{c as pe,o as ke,A as ce,Q as Ye,i as Ze,h as et,s as tt,R as nt}from"./rc-util-Dfq69fzz.js";import{r as o}from"./react-CeYxiRmC.js";var rt=["children"],De=o.createContext({});function Pt(e){var t=e.children,n=se(e,rt);return o.createElement(De.Provider,{value:n},t)}var at=function(e){xe(n,e);var t=be(n);function n(){return Ne(this,n),t.apply(this,arguments)}return Oe(n,[{key:"render",value:function(){return this.props.children}}]),n}(o.Component),O="none",X="appear",Y="enter",Z="leave",Re="none",R="prepare",Q="start",$="active",Ee="end",Ue="prepared";function Le(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit".concat(e)]="webkit".concat(t),n["Moz".concat(e)]="moz".concat(t),n["ms".concat(e)]="MS".concat(t),n["O".concat(e)]="o".concat(t.toLowerCase()),n}function it(e,t){var n={animationend:Le("Animation","AnimationEnd"),transitionend:Le("Transition","TransitionEnd")};return e&&("AnimationEvent"in t||delete n.animationend.animation,"TransitionEvent"in t||delete n.transitionend.transition),n}var ot=it(pe(),typeof window<"u"?window:{}),Ve={};if(pe()){var ut=document.createElement("div");Ve=ut.style}var ee={};function we(e){if(ee[e])return ee[e];var t=ot[e];if(t)for(var n=Object.keys(t),r=n.length,a=0;a<r;a+=1){var u=n[a];if(Object.prototype.hasOwnProperty.call(t,u)&&u in Ve)return ee[e]=t[u],ee[e]}return""}var Fe=we("animationend"),Ke=we("transitionend"),je=!!(Fe&&Ke),Pe=Fe||"animationend",_e=Ke||"transitionend";function Me(e,t){if(!e)return null;if(me(e)==="object"){var n=t.replace(/-\w/g,function(r){return r[1].toUpperCase()});return e[n]}return"".concat(e,"-").concat(t)}const st=function(e){var t=o.useRef();function n(a){a&&(a.removeEventListener(_e,e),a.removeEventListener(Pe,e))}function r(a){t.current&&t.current!==a&&n(t.current),a&&a!==t.current&&(a.addEventListener(_e,e),a.addEventListener(Pe,e),t.current=a)}return o.useEffect(function(){return function(){n(t.current)}},[]),[r,n]};var Ie=pe()?o.useLayoutEffect:o.useEffect;const ct=function(){var e=o.useRef(null);function t(){ke.cancel(e.current)}function n(r){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:2;t();var u=ke(function(){a<=1?r({isCanceled:function(){return u!==e.current}}):n(r,a-1)});e.current=u}return o.useEffect(function(){return function(){t()}},[]),[n,t]};var vt=[R,Q,$,Ee],ft=[R,Ue],Qe=!1,lt=!0;function $e(e){return e===$||e===Ee}const dt=function(e,t,n){var r=ce(Re),a=D(r,2),u=a[0],c=a[1],m=ct(),p=D(m,2),i=p[0],v=p[1];function s(){c(R,!0)}var f=t?ft:vt;return Ie(function(){if(u!==Re&&u!==Ee){var d=f.indexOf(u),S=f[d+1],C=n(u);C===Qe?c(S,!0):S&&i(function(y){function M(){y.isCanceled()||c(S,!0)}C===!0?M():Promise.resolve(C).then(M)})}},[e,u]),o.useEffect(function(){return function(){v()}},[]),[s,u]};function mt(e,t,n,r){var a=r.motionEnter,u=a===void 0?!0:a,c=r.motionAppear,m=c===void 0?!0:c,p=r.motionLeave,i=p===void 0?!0:p,v=r.motionDeadline,s=r.motionLeaveImmediately,f=r.onAppearPrepare,d=r.onEnterPrepare,S=r.onLeavePrepare,C=r.onAppearStart,y=r.onEnterStart,M=r.onLeaveStart,x=r.onAppearActive,_=r.onEnterActive,W=r.onLeaveActive,b=r.onAppearEnd,T=r.onEnterEnd,U=r.onLeaveEnd,V=r.onVisibleChanged,te=ce(),I=D(te,2),k=I[0],w=I[1],h=Ye(O),F=D(h,2),N=F[0],K=F[1],ne=ce(null),q=D(ne,2),z=q[0],Se=q[1],L=N(),re=o.useRef(!1),ae=o.useRef(null);function B(){return n()}var ye=o.useRef(!1);function he(){K(O),Se(null,!0)}var Ae=Ze(function(A){var E=N();if(E!==O){var P=B();if(!(A&&!A.deadline&&A.target!==P)){var G=ye.current,J;E===X&&G?J=b==null?void 0:b(P,A):E===Y&&G?J=T==null?void 0:T(P,A):E===Z&&G&&(J=U==null?void 0:U(P,A)),G&&J!==!1&&he()}}}),We=st(Ae),ze=D(We,1),He=ze[0],ge=function(E){switch(E){case X:return g(g(g({},R,f),Q,C),$,x);case Y:return g(g(g({},R,d),Q,y),$,_);case Z:return g(g(g({},R,S),Q,M),$,W);default:return{}}},H=o.useMemo(function(){return ge(L)},[L]),qe=dt(L,!e,function(A){if(A===R){var E=H[R];return E?E(B()):Qe}if(j in H){var P;Se(((P=H[j])===null||P===void 0?void 0:P.call(H,B(),null))||null)}return j===$&&L!==O&&(He(B()),v>0&&(clearTimeout(ae.current),ae.current=setTimeout(function(){Ae({deadline:!0})},v))),j===Ue&&he(),lt}),Te=D(qe,2),Be=Te[0],j=Te[1],Ge=$e(j);ye.current=Ge,Ie(function(){w(t);var A=re.current;re.current=!0;var E;!A&&t&&m&&(E=X),A&&t&&u&&(E=Y),(A&&!t&&i||!A&&s&&!t&&i)&&(E=Z);var P=ge(E);E&&(e||P[R])?(K(E),Be()):K(O)},[t]),o.useEffect(function(){(L===X&&!m||L===Y&&!u||L===Z&&!i)&&K(O)},[m,u,i]),o.useEffect(function(){return function(){re.current=!1,clearTimeout(ae.current)}},[]);var ie=o.useRef(!1);o.useEffect(function(){k&&(ie.current=!0),k!==void 0&&L===O&&((ie.current||k)&&(V==null||V(k)),ie.current=!0)},[k,L]);var oe=z;return H[R]&&j===Q&&(oe=l({transition:"none"},oe)),[L,j,oe,k??t]}function pt(e){var t=e;me(e)==="object"&&(t=e.transitionSupport);function n(a,u){return!!(a.motionName&&t&&u!==!1)}var r=o.forwardRef(function(a,u){var c=a.visible,m=c===void 0?!0:c,p=a.removeOnLeave,i=p===void 0?!0:p,v=a.forceRender,s=a.children,f=a.motionName,d=a.leavedClassName,S=a.eventProps,C=o.useContext(De),y=C.motion,M=n(a,y),x=o.useRef(),_=o.useRef();function W(){try{return x.current instanceof HTMLElement?x.current:nt(_.current)}catch{return null}}var b=mt(M,m,W,a),T=D(b,4),U=T[0],V=T[1],te=T[2],I=T[3],k=o.useRef(I);I&&(k.current=!0);var w=o.useCallback(function(z){x.current=z,et(u,z)},[u]),h,F=l(l({},S),{},{visible:m});if(!s)h=null;else if(U===O)I?h=s(l({},F),w):!i&&k.current&&d?h=s(l(l({},F),{},{className:d}),w):v||!i&&!d?h=s(l(l({},F),{},{style:{display:"none"}}),w):h=null;else{var N;V===R?N="prepare":$e(V)?N="active":V===Q&&(N="start");var K=Me(f,"".concat(U,"-").concat(N));h=s(l(l({},F),{},{className:Xe(Me(f,U),g(g({},K,K&&N),f,typeof f=="string")),style:te}),w)}if(o.isValidElement(h)&&tt(h)){var ne=h,q=ne.ref;q||(h=o.cloneElement(h,{ref:w}))}return o.createElement(at,{ref:_},h)});return r.displayName="CSSMotion",r}const Et=pt(je);var ve="add",fe="keep",le="remove",ue="removed";function St(e){var t;return e&&me(e)==="object"&&"key"in e?t=e:t={key:e},l(l({},t),{},{key:String(t.key)})}function de(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[];return e.map(St)}function yt(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[],t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[],n=[],r=0,a=t.length,u=de(e),c=de(t);u.forEach(function(i){for(var v=!1,s=r;s<a;s+=1){var f=c[s];if(f.key===i.key){r<s&&(n=n.concat(c.slice(r,s).map(function(d){return l(l({},d),{},{status:ve})})),r=s),n.push(l(l({},f),{},{status:fe})),r+=1,v=!0;break}}v||n.push(l(l({},i),{},{status:le}))}),r<a&&(n=n.concat(c.slice(r).map(function(i){return l(l({},i),{},{status:ve})})));var m={};n.forEach(function(i){var v=i.key;m[v]=(m[v]||0)+1});var p=Object.keys(m).filter(function(i){return m[i]>1});return p.forEach(function(i){n=n.filter(function(v){var s=v.key,f=v.status;return s!==i||f!==le}),n.forEach(function(v){v.key===i&&(v.status=fe)})}),n}var ht=["component","children","onVisibleChanged","onAllRemoved"],At=["status"],gt=["eventProps","visible","children","motionName","motionAppear","motionEnter","motionLeave","motionLeaveImmediately","motionDeadline","removeOnLeave","leavedClassName","onAppearPrepare","onAppearStart","onAppearActive","onAppearEnd","onEnterStart","onEnterActive","onEnterEnd","onLeaveStart","onLeaveActive","onLeaveEnd"];function Tt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:Et,n=function(r){xe(u,r);var a=be(u);function u(){var c;Ne(this,u);for(var m=arguments.length,p=new Array(m),i=0;i<m;i++)p[i]=arguments[i];return c=a.call.apply(a,[this].concat(p)),g(Ce(c),"state",{keyEntities:[]}),g(Ce(c),"removeKey",function(v){c.setState(function(s){var f=s.keyEntities.map(function(d){return d.key!==v?d:l(l({},d),{},{status:ue})});return{keyEntities:f}},function(){var s=c.state.keyEntities,f=s.filter(function(d){var S=d.status;return S!==ue}).length;f===0&&c.props.onAllRemoved&&c.props.onAllRemoved()})}),c}return Oe(u,[{key:"render",value:function(){var m=this,p=this.state.keyEntities,i=this.props,v=i.component,s=i.children,f=i.onVisibleChanged;i.onAllRemoved;var d=se(i,ht),S=v||o.Fragment,C={};return gt.forEach(function(y){C[y]=d[y],delete d[y]}),delete d.keys,o.createElement(S,d,p.map(function(y,M){var x=y.status,_=se(y,At),W=x===ve||x===fe;return o.createElement(t,Je({},C,{key:_.key,visible:W,eventProps:_,onVisibleChanged:function(T){f==null||f(T,{key:_.key}),T||m.removeKey(_.key)}}),function(b,T){return s(l(l({},b),{},{index:M}),T)})}))}}],[{key:"getDerivedStateFromProps",value:function(m,p){var i=m.keys,v=p.keyEntities,s=de(i),f=yt(v,s);return{keyEntities:f.filter(function(d){var S=v.find(function(C){var y=C.key;return d.key===y});return!(S&&S.status===ue&&d.status===le)})}}}]),u}(o.Component);return g(n,"defaultProps",{component:"div"}),n}const _t=Tt(je);export{Et as C,Pt as M,_t as a};
