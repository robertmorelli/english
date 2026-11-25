var he=Symbol("utu.closure");var me=new WeakMap,ge=(i,c,m,_,E)=>{let I=c==null&&!(m&2),R=I&&me.get(i);if(R)return R;let k=I?(...y)=>i(...y):(...y)=>i(c,...y),C=E?.[(m>>4)-1],A=C?(...y)=>{for(let S=0;S<C.length;S++){let M=C[S];if(M==="b")y[S]=y[S]?1:0;else if(M==="n")y[S]===void 0&&(y[S]=null);else if(M==="h"&&y[S]==null)throw new TypeError(`Wrong type from JavaScript: a closure's argument ${S+1} is ${y[S]}`)}return k(...y)}:k,T=m&1?(...y)=>!!A(...y):m&4?(...y)=>A(...y)>>>0:m&8?(...y)=>BigInt.asUintN(64,A(...y)):A;return T[he]=_,I&&me.set(i,T),T},be=i=>i?.[he]??null,ye=(i,...c)=>i(...c);var we=((i,c)=>globalThis.__utuWutu.mount(i,c)),xe=(i=>globalThis.__utuWutu.put(i)),$e=(i=>c=>i(c)?1:0)(i=>globalThis.__utuWutu.memoHit(i)),Se=(()=>globalThis.__utuWutu.memoLast()),ke=((i,c)=>globalThis.__utuWutu.memoKeep(i,c)),Ae=(()=>globalThis.__utuWutu.slot()),_e=(i=>globalThis.__utuWutu.begin(i)),Ee=(()=>globalThis.__utuWutu.done()),Te=(i=>{if(i===document.documentElement)return;let c=i.querySelector(":scope>head")??i.insertBefore(document.createElement("head"),i.firstChild);for(let m of document.head.querySelectorAll("style"))c.append(m);document.replaceChild(i,document.documentElement)}),Ne=(()=>{globalThis.__utuWutu??=(function(){let c=new WeakMap,m=new WeakMap;function _(e,t=!0){if(e.pending)return t?[e.start,...e.pending,e.end]:e.pending;let n=[];for(let o=t?e.start:e.start.nextSibling;o;o=o.nextSibling){if(o===e.end){t&&n.push(o);break}n.push(o)}return n}function E(e){if(Array.isArray(e))return e.every(E);let t=c.get(e);return t?t.start.isConnected&&t.end.isConnected:!!e?.isConnected}function I(e){let t=c.get(e);return t?_(t,!1).flatMap(n=>n.nodeType===1?[n,...n.querySelectorAll("[data-wutu]")]:[]):e?.querySelectorAll?.("[data-wutu]")??[]}function R(){let e=b.at(-1),t=0,n=!1,o=!1;for(let l=0;l<h.length;l++)h[l].global&&(t=l,n=h[l].depth===b.length),h[l].explicit&&(o=h[l].depth===b.length);let r=e?h.slice(t).map(l=>`${l.explicit?"k":"c"}${l.value.length}:${l.value}`).join(":"):f?.scope??"",s=`wutu:${d.h}:${encodeURIComponent(r)}`;Z(e,s,n,o);let u=l=>{let g=new Map;for(let $ of l)if($.nodeType===8&&$.data.startsWith("wutu:")){let j=g.get($.data);j||g.set($.data,j={nodes:[],index:0}),j.nodes.push($)}return g},w=l=>{let g=l.get(s);for(;g&&g.index<g.nodes.length;){let $=g.nodes[g.index++];if(!e?.used.has($)&&!x?.used.has($))return $}},p=e&&w(e.ranges??=u(e.old));if(!p&&!e&&(p=c.get(f?.root)?.start),!p){let l=b[0]?.node;if((!x||x.root!==l)&&(x={root:l,index:null,used:new Set}),!x.comments){let g=[],$=B=>{B.nodeType===8&&(e||!m.has(B))&&g.push(B);for(let mt of B.childNodes??[])$(mt)},j=c.get(l);if(j)for(let B of _(j,!1))$(B);else $(l??document);x.comments=u(g)}p=w(x.comments)}let a=p&&m.get(p);if(!a&&p){let l=p.nextSibling;for(;l&&!(l.nodeType===8&&l.data==="/"+s);)l=l.nextSibling;l&&(a={start:p,end:l,value:document.createDocumentFragment()})}if(!a){let l=document.createDocumentFragment();a={value:l,start:document.createComment(s),end:document.createComment("/"+s)},l.append(a.start,a.end)}c.set(a.value,a),m.set(a.start,a),e&&e.used.add(a.start),x?.used.add(a.start),d.fragment=a,b.push({node:a.value,range:a,old:_(a,!1),used:new Set,wanted:[],byKey:null,keyed:null})}let k=new WeakMap,C=new WeakMap,A=new Set,T=new Map,y=new Set,S=[],M=new WeakSet,Y=null,K=()=>h.map(e=>e.value.length+":"+e.value).join("|"),P=new WeakMap,b=[],f=null,h=[],D=!1,z=0,N=null,ze=new Map,x=null;function L(){V.autoSave?.()}function Je(e){let t=T.get(e)?.deref();t&&(t.dirty=!0,W(t))}let Ge=new Set,Q=new WeakMap;function He(e,t){Q.set(e,t),e.value!==t&&(e.value=t)}function q(e){let t=P.get(e);return t===void 0&&P.set(e,t=e.getAttribute("data-wutu")),t}function X(e,t,n=null){let o=n?_(n,!1):e.childNodes;if(o.length===t.length){let p=!0;for(let a=0;p&&a<t.length;a++)p=o[a]===t[a];if(p)return}let r=document.activeElement,s=r&&"selectionStart"in r?[r.selectionStart,r.selectionEnd,r.selectionDirection]:null,u=n?n.start.nextSibling:e.firstChild;for(let p of t){if(p===u){u=u.nextSibling;continue}e.moveBefore&&p.parentNode===e?e.moveBefore(p,u):e.insertBefore(p,u)}let w=new Set(t);for(let p of[...o])w.has(p)||p.nodeType===1&&(p.nodeName==="HEAD"||p.hasAttribute("data-wutu-style"))||(f?f.removals.add(p):(H(p),p.remove()));r?.isConnected&&document.activeElement!==r&&(r.focus({preventScroll:!0}),s?.[0]!=null&&r.setSelectionRange(...s))}function Z(e,t,n,o){if(n&&f){if(f.globalClaims.has(t))throw new Error("Duplicate global Wutu key: "+t);f.globalClaims.add(t)}if(o&&e){if(e.keyed??=new Set,e.keyed.has(t))throw new Error("Duplicate Wutu key: "+h.findLast(r=>r.explicit).value);e.keyed.add(t)}}function Ve(e,t,n,o){let r=e?.old[e.wanted.length];if(r?.nodeType===1&&r.localName===n&&q(r)===t&&!e.used.has(r))return r;let s=e&&Ye(e).get(t);for(;s&&s.index<s.nodes.length;){let u=s.nodes[s.index++];if(!e.used.has(u)&&u.localName===n)return u}return o?Qe(t):void 0}function Ye(e){if(e.byKey)return e.byKey;e.byKey=new Map;for(let t of e.old){if(t.nodeType!==1)continue;let n=q(t),o=e.byKey.get(n);o||e.byKey.set(n,o={nodes:[],index:0}),o.nodes.push(t)}return e.byKey}function Qe(e){if(f){if(!f.globalNodes){f.globalNodes=new Map;for(let t of I(f.root))f.globalNodes.set(q(t),t)}return f.globalNodes.get(e)}}function Xe(e,t){let n=b[0]?.node;if(x?.root!==n&&(x={root:n,index:null,used:new Set}),!x.index){x.index=new Map;for(let r of I(n)){let s=q(r);x.index.has(s)||x.index.set(s,r)}}let o=x.index.get(e);if(!(!o||o.localName!==t||x.used.has(o)))return x.used.add(o),o}function J(e,t,n,o,r){let s=b.at(-1),u=e+(t?":"+t:""),w=!1,p=!1;if(h.length){let l=0;for(let g=0;g<h.length;g++)h[g].global&&(l=g,w=h[g].depth===b.length),h[g].explicit&&(p=h[g].depth===b.length);for(let g=l;g<h.length;g++){let $=h[g];u+=`:${$.explicit?"k":"c"}${$.value.length}:${$.value}`}}Z(s,u,w,p);let a=Ve(s,u,n,w);if(r&&s?a??=Xe(u,n):a&&f?.retained.add(a),s||(a=f?.root??document.querySelector(`[data-wutu-root="${e}"][data-wutu-prerender]`)),a?.hasAttribute("data-wutu-prerender")){a.removeAttribute("data-wutu-prerender");for(let l of[a,...a.querySelectorAll("[data-wutu-pending]")])!l.hasAttribute("data-wutu-pending")||l.parentNode?.closest("[data-wutu-lazy]")||(l.disabled=!1,l.removeAttribute("data-wutu-pending"))}return(!a||a.localName!==n)&&(a=o()),s&&s.used.add(a),s&&!r&&(s.wanted.push(a),s.appended?.add(a)),P.get(a)!==u&&(a.setAttribute("data-wutu",u),P.set(a,u)),s||(a.getAttribute("data-wutu-root")!==e&&a.setAttribute("data-wutu-root",e),f&&(f.root=a)),a}function ee(e,t,n){let o=k.get(e),r=o?null:new Set([...e.attributes].map(s=>s.name).filter(s=>n?n.has(s):!s.startsWith("data-wutu")&&!t.includes(s)));return b.push({node:e,meta:o,before:r,old:e.childNodes,used:new Set,wanted:[],attrs:null,byKey:null,keyed:null}),e}function Ze(e,t,n,o){return ee(J(n,o,e,()=>t?document.createElementNS("http://www.w3.org/2000/svg",e):document.createElement(e)),[])}let te=new WeakMap;function ne(e,t){let n=te.get(e);return n||te.set(e,n=et(e,t)),n}function et(e,t){let n=([o,r,...s],u)=>{u=u||o==="svg";let w=u?document.createElementNS("http://www.w3.org/2000/svg",o):document.createElement(o);for(let a in r)oe(w,a,r[a]);let p=u&&o!=="foreignObject";for(let a of s)w.append(typeof a=="string"?a:n(a,p));return w};return[n(e,t),Object.keys(e[1])]}function v(e){let t=b.at(-1),n=c.get(e);if(n||Array.isArray(e)||e?.nodeType===11){for(let s of n?_(n):Array.isArray(e)?e:[...e.childNodes])v(s);return}if(e?.nodeType){t.appended??=new Set(t.wanted),t.appended.has(e)||(t.appended.add(e),t.used.add(e),t.wanted.push(e)),f?.retained.add(e);return}let o=String(e??""),r=t.old[t.wanted.length];!r||r.nodeType!==3||t.used.has(r)?r=document.createTextNode(o):r.data!==o&&(r.data=o),t.used.add(r),t.wanted.push(r)}function F(e,t,n){if((b.at(-1).attrs??=new Set).add(t),n===null||n===!1||!re(e,t,n)){e.removeAttribute(t);return}let o=n===!0?"":String(n);e.getAttribute(t)!==o&&oe(e,t,o)}function oe(e,t,n){let o={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"}[t.split(":",1)[0]];o&&t.includes(":")?e.setAttributeNS(o,t,n):e.setAttribute(t,n)}let tt=new Set(["href","xlink:href","src","action","formaction","poster","cite","data","background","codebase","longdesc","manifest"]),nt=new Set(["ping","srcset","imagesrcset"]);function re(e,t,n){return t=t.toLowerCase(),t==="srcdoc"?!1:n===!0?!0:(n=String(n),tt.has(t)?ie(e,t,n):nt.has(t)?n.split(/[ ,]+/).every(o=>ie(e,t,o)):t!=="content"||e.localName!=="meta"||!/javascript:|vbscript:|data:/.test(se(n)))}function se(e,t=1/0){let n="";for(let o of e)if(o>" "&&(n+=o).length>=t)break;return n.toLowerCase()}function ie(e,t,n){let o=se(n,16),r=e.localName;return/^(java|vb)script:/.test(o)?!1:!o.startsWith("data:")||t==="href"&&(r==="a"||r==="area")&&e.hasAttribute("download")?!0:o.startsWith("data:image/svg")?r==="img"||r==="image":/^data:(image|audio|video)[/]/.test(o)}function ot(e,t,n){re(e,t,n)?e[t]=n:e.removeAttribute(t.toLowerCase())}function ae(e,t,n){if(t==="mount"){if(M.has(e))return;M.add(e);let u=f;queueMicrotask(()=>{let w=N;N=[e,u];try{n(new Event("mount"))}finally{N=w}L(),u&&W(u)});return}let o=t[0]==="~";o&&(t=t.slice(1));let r=C.get(e);r||C.set(e,r=new Map);let s=r.get(t);s||(s={handlers:[],generation:-1,view:f},r.set(t,s),e.addEventListener(t,u=>{let w=!1,p=N;N=[e,s.view];try{for(let[a,l]of[...s.handlers]){l||(w=!0);let g=a(u);g?.then&&g.then(O,$=>{O(),setTimeout(()=>{throw $})})}}finally{N=p,w&&(L(),s.view&&W(s.view))}})),s.generation!==z&&(s.handlers=[],s.generation=z),s.handlers.push([n,o]),s.view=f}function ce(){let e=b.pop(),t=e.node,n=e.attrs??Ge;if(t.hasAttribute("data-wutu-unmanaged"))return e.meta||t.replaceChildren(),k.set(t,{...k.get(t),attrs:n}),t;let o=e.meta;for(let s of o?o.attrs:e.before)n.has(s)||t.removeAttribute(s);o?o.attrs=n:k.set(t,{attrs:n}),X(t,e.wanted);let r=Q.get(t);return r!==void 0&&t.value!==r&&(t.value=r),t}let le=new Map,ue=["end"],d=null;function rt(e){let t=le.get(e);if(!t){let n=2166136261;for(let o=0;o<e.length;o++)n=Math.imul(n^e.charCodeAt(o),16777619);le.set(e,t=[JSON.parse(e),(n>>>0).toString(36)])}d={h:t[1],nodes:[],stack:[{ops:t[0],pc:0,kind:"top"}],outer:d,pending:null,depth:b.length,fragment:null}}let fe=new WeakMap;function st(e,t){let n=fe.get(e);n||fe.set(e,n=[]);let o=n[t];if(!o){o=n[t]=new Set;for(let r=t;r<e.length;r++){let[s,u]=e[r];if(s==="a"||s==="b")o.add(u);else if(s==="m")o.add("class");else if(s!=="n"&&s!=="y")break}}return o}function U(){for(;;){let e=d.stack.at(-1);if(e.pc>=e.ops.length){if(e.kind==="arm"){d.stack.pop();continue}return e.kind==="body"?ue:null}let t=e.ops[e.pc++];switch(t[0]){case"r":R();break;case"s":{let[n]=ne(t[2],!!t[3]);d.nodes[t[1]]=J(`v${d.h}:${t[1]}`,"",n.localName,()=>n.cloneNode(!0),b.length===d.depth);break}case"o":{let[n,o]=ne(t[2],!!t[3]);d.nodes[t[1]]=ee(J(`v${d.h}:${t[1]}`,"",n.localName,()=>n.cloneNode(!1),b.length===d.depth),o,st(e.ops,e.pc));break}case"c":ce();break;case"t":v(t[1]);break;default:return t}}}function it(e){if(d?.pending){d.pending=null,v(e),h.pop();return}if(!d){v(e),h.pop();return}let t=U(),n=b.at(-1)?.node;switch(t[0]){case"a":F(n,t[1],e);break;case"m":F(n,"class",t[1]+e);break;case"b":F(n,t[1],!!e);break;case"y":(b.at(-1).attrs??=new Set).add("style"),n.style.setProperty(t[1],e);break;case"w":v(e);break;case"v":ae(d.nodes[t[1]],t[2],e);break;default:throw new Error("Wutu: a value where the template has "+JSON.stringify(t?.[0]))}}function at(){let e=U();h.push({value:`call:${d.h}:${e[1]}`,explicit:!1}),d.pending=e}function ct(e){let t=U();d.stack.push({ops:t[0]==="k"?t[1][e]:e?t[1]:t[2],pc:0,kind:"arm"})}function de(){let e=U();if(e!==ue)return[e,null];let t=d.stack.at(-1);return h.pop(),t.loop[1]===0&&h.pop(),[t.loop,t]}function lt(e){let[t,n]=de();n?n.pc=0:d.stack.push({ops:t[3],pc:0,kind:"body",loop:t});let o=String(e),r=t[1];r===0?(h.push({value:`loop:${d.h}:${t[2]}`,explicit:!1}),h.push({value:o,explicit:!1})):h.push({value:o,explicit:!0,global:r===2,depth:b.length})}function ut(){let[,e]=de();e&&d.stack.pop()}function ft(){return d.nodes[U()[1]]}function dt(){for(;U()!==null;);let e=d.nodes[0];if(d.fragment){let t=b.pop(),n=d.fragment;if(X(n.start.parentNode,t.wanted,n),f&&(n.pending=t.wanted,(f.pendingRanges??=new Set).add(n)),e=n.value,d.depth===0)for(let o of t.wanted)o.nodeType===1&&o.setAttribute("data-wutu-root",`fragment:${d.h}`)}return d=d.outer,d||(x=null),e}function G(e){let t=[b,f,h,x,d],n=document.activeElement;e.cleanupIndex=0,e.cleanupCallbacks??=[],e.intervalsSeen=new Set,e.removals=new Set,e.pendingRanges=null,e.retained=new Set,e.globalNodes=null,e.globalClaims=new Set,b=[],f=e,h=[],x=null,z++;try{e.root=e.render();for(let o of e.cleanupCallbacks.splice(e.cleanupIndex))o();for(let[o,r]of e.effects)!r.node&&!e.intervalsSeen.has(o)&&(clearInterval(r.id),e.effects.delete(o));for(let o of e.removals)e.retained.has(o)||(H(o),o.remove());n?.isConnected&&document.activeElement!==n&&n.focus({preventScroll:!0})}finally{if([b,f,h,x,d]=t,e.globalNodes=null,e.pendingRanges)for(let o of e.pendingRanges)o.pending=null;e.pendingRanges=null,e.removals.clear(),e.retained.clear()}return e.root}function pt(e,t=""){if(f&&!t)return e();if(t){let s=T.get(t)?.deref();if(s&&E(s.root))return s.dirty&&(s.dirty=!1,G(s)),s.root}let n={render:e,root:null,scope:t,dirty:!1,cleanupCallbacks:[],effects:new Map},o=G(n);A.add(new WeakRef(n)),t&&T.set(t,new WeakRef(n));let r=c.get(o)?.start??o;return k.set(r,{...k.get(r),view:n}),o}function pe(){D=!1;let e=[...y];y.clear();for(let t of e)E(t.root)&&(t.dirty=!1,G(t));for(let t of S.splice(0))t()}function O(){for(let e of A){let t=e.deref();if(!t){A.delete(e);continue}E(t.root)&&y.add(t)}L(),pe()}function W(e){e&&y.add(e),!D&&(D=!0,queueMicrotask(pe))}function H(e){let t=k.get(e)?.view;if(t){for(let n of t.cleanupCallbacks.splice(0))n();for(let n of t.effects.values())clearInterval(n.id);t.effects.clear(),t.scope&&T.delete(t.scope)}for(let n of e.childNodes??[])H(n)}globalThis.addEventListener?.("hashchange",O),globalThis.addEventListener?.("popstate",O);let V={enter:Ze,append:v,attr:F,url:ot,listen:ae,leave:ce,mount:pt,refresh:O,invalidate:Je,selectValue:He,here:K,put:it,begin:rt,slot:at,arm:ct,item:lt,end:ut,node:ft,done:dt,nodes(e){let t=c.get(e);return t?_(t):Array.isArray(e)?e.flatMap(V.nodes):e?.nodeType===11?[...e.childNodes]:[e]},storageError:"",notify(){for(let e of A){let t=e.deref();t&&E(t.root)&&W(t)}},interval(e,t,n){let[o,r]=f?[null,f]:N??[];if(!o){if(!r)return;r.intervalsSeen.add(e)}let s=r?.effects??ze,u=s.get(e);if(u?.node===o){u.callback=n;return}u&&clearInterval(u.id);let w={callback:n,id:0,node:o};w.id=setInterval(()=>{if(o&&!o.isConnected){clearInterval(w.id),s.delete(e);return}w.callback(),L(),W(r)},Math.max(16,t)),s.set(e,w)},memoHit(e){if(!e||!f)return!1;let t=f.memo?.get(K());return t?.key!==e||!E(t.node)?!1:(Y=t.node,!0)},memoLast(){return Y},memoKeep(e,t){e&&f&&(f.memo??=new Map).set(K(),{key:e,node:t})},after(e){S.push(e),W()},focus(e){S.push(()=>document.getElementById(e)?.focus()),W()},cleanup(e){f&&(f.cleanupCallbacks[f.cleanupIndex++]=e)},pushGlobal:e=>h.push({value:String(e),explicit:!0,global:!0,depth:b.length}),pushKey:e=>h.push({value:String(e),explicit:!0,depth:b.length}),pushCall:e=>h.push({value:e,explicit:!1}),popKey:()=>h.pop()};return V})()}),We=(()=>globalThis.__utuWutu.node()),Ie=(i=>c=>i(!!c))(i=>globalThis.__utuWutu.put(i)),Ce=(i=>i.preventDefault()),Me=(i=>c=>i(BigInt.asUintN(64,c)))(i=>globalThis.__utuWutu.item(i)),ve=(()=>globalThis.__utuWutu.end()),Ue=(()=>{if(!document.getElementById("wutu-cozim8")){let i=document.createElement("style");i.id="wutu-cozim8",i.setAttribute("data-wutu-style",""),i.textContent=`@layer wutu.document{
        @supports (width: calc(sibling-index() * 1px)) and (width: calc(sibling-count() * 1px)) {
            body {
                display: grid;
                width: 100%;
                height: 100vh;
                margin: 0;
                align-items: center;
                justify-items: center;
                --input-accent: none;
                --input-font-weight: normal;
                overflow: hidden;

                * {
                    box-sizing: border-box;
                    overflow: hidden;
                    font-family: Monaco,
                    monospace;
                }

                &.word-exists {
                    --input-accent: underline;
                    --input-font-weight: bolder;
                }

                #download {
                    grid-row: 1;
                    grid-column: 1;
                    width: 2rem;
                    height: 2rem;
                    background: black;
                    align-self: baseline;
                    justify-self: baseline;
                    color: white;
                }

                #search-box {
                    grid-row: 1;
                    grid-column: 1;
                    anchor-name: --hub;
                    display: grid;

                    > input {
                        grid-row: 1;
                        grid-column: 1;
                        padding: 1rem;

                        &[type="reset"] {
                            width: 2rem;
                            height: 2rem;
                            margin-right: 1rem;
                            background: white;
                            justify-self: right;
                            align-self: center;
                            color: black;
                            text-align: center;
                            padding: 0 0;
                        }

                        &[type="text"] {
                            anchor-name: --search;
                            font-size: 2rem;
                            width: 20rem;
                            background: black;
                            color: white;
                            text-decoration: var(--input-accent);
                            font-weight: var(--input-font-weight);
                        }
                    }
                }

                form ~ span {
                    position: fixed;
                    position-anchor: --hub;
                    top: anchor(center);
                    left: anchor(center);
                    white-space: nowrap;
                    font-weight: 600;
                    --i: sibling-index();
                    --n: sibling-count();
                    --angle: calc(var(--i) * 137.5deg);
                    --r: calc(2rem + calc(sqrt(var(--i)) * 6rem));
                    transform: translate(calc(cos(var(--angle)) * var(--r) - 50%), calc(sin(var(--angle)) * var(--r) - 50%));
                    --wave: calc(sin(var(--i) * 83deg) * 0.5 + 0.5);
                    font-size: calc(0.8rem + var(--wave) * 0.6rem);
                    padding: 0.2em 0.6em;
                    --box-color: oklch(0.65 0.2 calc(var(--i) / var(--n) * 360));
                    color: var(--box-color);
                    background: transparent;
                    animation: fade 600ms ease forwards calc(250ms + var(--i) * 10ms);
                }
            }

            @keyframes fade {
                to {
                    color: white;
                    background: var(--box-color);
                }
            }
        }

        @supports not ((width: calc(sibling-index() * 1px)) and (width: calc(sibling-count() * 1px))) {
            body {
                background: black;
                color: white;
                font-size: 2rem;
                font-family: monospace;
                font-weight: bolder;
                text-decoration: underline;
                display: grid;
                height: 100%;
                overflow: hidden;

                * {
                    display: none;
                }

                &::after {
                    text-align: center;
                    align-self: center;
                    text-wrap: balance;
                    content: "Use a real browser instead of a broken toy";
                }
            }
        }
    }`,document.head.append(i)}}),je=((i,c)=>i[c]),Be=((i,c,m)=>{i[c]=m}),Oe=(i=>globalThis[i]),Re=((i,c)=>i[c]()),Pe=((i,c)=>{fetch(i).then(m=>{if(!m.ok)throw new Error("fetch failed");return m.arrayBuffer()}).then(m=>{globalThis.__trieBytes=new Uint8Array(m),c(globalThis.__trieBytes.length)}).catch(()=>{})}),Le=(i=>globalThis.__trieBytes[i]),qe=(()=>globalThis.__utuWutu?.refresh()),Fe=(i=>globalThis.__utuWutu?.after(i)),Ke=(i=>c=>(m=>typeof m=="string"?m:(()=>{throw new TypeError(`Wrong type from JavaScript: a Str, not ${m===null?"null":m instanceof Promise?"a Promise (await it: Promise[Str])":typeof m}`)})())(i(c)))(i=>i.trim()),De=(i=>c=>(m=>typeof m=="string"?m:(()=>{throw new TypeError(`Wrong type from JavaScript: a Str, not ${m===null?"null":m instanceof Promise?"a Promise (await it: Promise[Str])":typeof m}`)})())(i(c)))(i=>i.toLowerCase());try{let{instance:i}=await WebAssembly.instantiateStreaming(fetch(new URL("./app.wasm",import.meta.url)),{es:[we,xe,$e,Se,ke,Ae,_e,Ee,Te,Ne,We,Ie,Ce,Me,ve,Ue,je,Be,Oe,Re,Pe,Le,qe,Fe,Ke,De],utu:{closure_new:ge,closure_call_0:ye,closure_rec:be}},{builtins:["js-string"],importedStringConstants:"'"}),c=i.exports;document.querySelectorAll("[data-utu-static]").forEach(m=>m.remove()),await c.main?.(),document.documentElement.setAttribute("data-utu-ready","")}catch(i){document.documentElement.setAttribute("data-utu-error",String(i.message??i));let c=document.createElement("p");c.setAttribute("role","status"),c.textContent="Interactive tools could not start. The page is still available to read. Try reloading in a browser with WebAssembly GC support.",document.body.append(c),console.error(i)}
