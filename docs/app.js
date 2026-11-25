var be=Symbol("utu.closure");var ge=new WeakMap,ye=(r,c,h,E,_)=>{let I=c==null&&!(h&2),B=I&&ge.get(r);if(B)return B;let k=I?(...y)=>r(...y):(...y)=>r(c,...y),C=_?.[(h>>4)-1],A=C?(...y)=>{for(let S=0;S<C.length;S++){let M=C[S];if(M==="b")y[S]=y[S]?1:0;else if(M==="n")y[S]===void 0&&(y[S]=null);else if(M==="h"&&y[S]==null)throw new TypeError(`Wrong type from JavaScript: a closure's argument ${S+1} is ${y[S]}`)}return k(...y)}:k,T=h&1?(...y)=>!!A(...y):h&4?(...y)=>A(...y)>>>0:h&8?(...y)=>BigInt.asUintN(64,A(...y)):A;return T[be]=E,I&&ge.set(r,T),T},we=r=>r?.[be]??null,xe=(r,...c)=>r(...c);var $e=((r,c)=>globalThis.__utuWutu.mount(r,c)),Se=(r=>globalThis.__utuWutu.put(r)),ke=(r=>c=>r(c)?1:0)(r=>globalThis.__utuWutu.memoHit(r)),Ae=(()=>globalThis.__utuWutu.memoLast()),Ee=((r,c)=>globalThis.__utuWutu.memoKeep(r,c)),_e=(()=>globalThis.__utuWutu.slot()),Te=(r=>globalThis.__utuWutu.begin(r)),Ne=(()=>globalThis.__utuWutu.done()),We=(r=>{if(r===document.documentElement)return;let c=r.querySelector(":scope>head")??r.insertBefore(document.createElement("head"),r.firstChild);for(let h of document.head.querySelectorAll("style"))c.append(h);document.replaceChild(r,document.documentElement)}),Ie=(()=>{globalThis.__utuWutu??=(function(){let c=new WeakMap,h=new WeakMap;function E(e,t=!0){if(e.pending)return t?[e.start,...e.pending,e.end]:e.pending;let n=[];for(let o=t?e.start:e.start.nextSibling;o;o=o.nextSibling){if(o===e.end){t&&n.push(o);break}n.push(o)}return n}function _(e){if(Array.isArray(e))return e.every(_);let t=c.get(e);return t?t.start.isConnected&&t.end.isConnected:!!e?.isConnected}function I(e){let t=c.get(e);return t?E(t,!1).flatMap(n=>n.nodeType===1?[n,...n.querySelectorAll("[data-wutu]")]:[]):e?.querySelectorAll?.("[data-wutu]")??[]}function B(){let e=b.at(-1),t=0,n=!1,o=!1;for(let l=0;l<m.length;l++)m[l].global&&(t=l,n=m[l].depth===b.length),m[l].explicit&&(o=m[l].depth===b.length);let s=e?m.slice(t).map(l=>`${l.explicit?"k":"c"}${l.value.length}:${l.value}`).join(":"):f?.scope??"",i=`wutu:${d.h}:${encodeURIComponent(s)}`;te(e,i,n,o);let u=l=>{let g=new Map;for(let $ of l)if($.nodeType===8&&$.data.startsWith("wutu:")){let U=g.get($.data);U||g.set($.data,U={nodes:[],index:0}),U.nodes.push($)}return g},w=l=>{let g=l.get(i);for(;g&&g.index<g.nodes.length;){let $=g.nodes[g.index++];if(!e?.used.has($)&&!x?.used.has($))return $}},p=e&&w(e.ranges??=u(e.old));if(!p&&!e&&(p=c.get(f?.root)?.start),!p){let l=b[0]?.node;if((!x||x.root!==l)&&(x={root:l,index:null,used:new Set}),!x.comments){let g=[],$=O=>{O.nodeType===8&&(e||!h.has(O))&&g.push(O);for(let gt of O.childNodes??[])$(gt)},U=c.get(l);if(U)for(let O of E(U,!1))$(O);else $(l??document);x.comments=u(g)}p=w(x.comments)}let a=p&&h.get(p);if(!a&&p){let l=p.nextSibling;for(;l&&!(l.nodeType===8&&l.data==="/"+i);)l=l.nextSibling;l&&(a={start:p,end:l,value:document.createDocumentFragment()})}if(!a){let l=document.createDocumentFragment();a={value:l,start:document.createComment(i),end:document.createComment("/"+i)},l.append(a.start,a.end)}c.set(a.value,a),h.set(a.start,a),e&&e.used.add(a.start),x?.used.add(a.start),d.fragment=a,b.push({node:a.value,range:a,old:E(a,!1),used:new Set,wanted:[],byKey:null,keyed:null})}let k=new WeakMap,C=new WeakMap,A=new Set,T=new Map,y=new Set,S=[],M=new WeakSet,X=null,D=()=>m.map(e=>e.value.length+":"+e.value).join("|"),P=new WeakMap,b=[],f=null,m=[],z=!1,J=0,N=null,Ge=new Map,x=null;function L(){Y.autoSave?.()}function He(e){let t=T.get(e)?.deref();t&&(t.dirty=!0,W(t))}let Ve=new Set,Z=new WeakMap;function Ye(e,t){Z.set(e,t),e.value!==t&&(e.value=t)}function q(e){let t=P.get(e);return t===void 0&&P.set(e,t=e.getAttribute("data-wutu")),t}function ee(e,t,n=null){let o=n?E(n,!1):e.childNodes;if(o.length===t.length){let p=!0;for(let a=0;p&&a<t.length;a++)p=o[a]===t[a];if(p)return}let s=document.activeElement,i=s&&"selectionStart"in s?[s.selectionStart,s.selectionEnd,s.selectionDirection]:null,u=n?n.start.nextSibling:e.firstChild;for(let p of t){if(p===u){u=u.nextSibling;continue}e.moveBefore&&p.parentNode===e?e.moveBefore(p,u):e.insertBefore(p,u)}let w=new Set(t);for(let p of[...o])w.has(p)||p.nodeType===1&&(p.nodeName==="HEAD"||p.hasAttribute("data-wutu-style"))||(f?f.removals.add(p):(V(p),p.remove()));s?.isConnected&&document.activeElement!==s&&(s.focus({preventScroll:!0}),i?.[0]!=null&&s.setSelectionRange(...i))}function te(e,t,n,o){if(n&&f){if(f.globalClaims.has(t))throw new Error("Duplicate global Wutu key: "+t);f.globalClaims.add(t)}if(o&&e){if(e.keyed??=new Set,e.keyed.has(t))throw new Error("Duplicate Wutu key: "+m.findLast(s=>s.explicit).value);e.keyed.add(t)}}function Qe(e,t,n,o){let s=e?.old[e.wanted.length];if(s?.nodeType===1&&s.localName===n&&q(s)===t&&!e.used.has(s))return s;let i=e&&Xe(e).get(t);for(;i&&i.index<i.nodes.length;){let u=i.nodes[i.index++];if(!e.used.has(u)&&u.localName===n)return u}return o?Ze(t):void 0}function Xe(e){if(e.byKey)return e.byKey;e.byKey=new Map;for(let t of e.old){if(t.nodeType!==1)continue;let n=q(t),o=e.byKey.get(n);o||e.byKey.set(n,o={nodes:[],index:0}),o.nodes.push(t)}return e.byKey}function Ze(e){if(f){if(!f.globalNodes){f.globalNodes=new Map;for(let t of I(f.root))f.globalNodes.set(q(t),t)}return f.globalNodes.get(e)}}function et(e,t){let n=b[0]?.node;if(x?.root!==n&&(x={root:n,index:null,used:new Set}),!x.index){x.index=new Map;for(let s of I(n)){let i=q(s);x.index.has(i)||x.index.set(i,s)}}let o=x.index.get(e);if(!(!o||o.localName!==t||x.used.has(o)))return x.used.add(o),o}function G(e,t,n,o,s){let i=b.at(-1),u=e+(t?":"+t:""),w=!1,p=!1;if(m.length){let l=0;for(let g=0;g<m.length;g++)m[g].global&&(l=g,w=m[g].depth===b.length),m[g].explicit&&(p=m[g].depth===b.length);for(let g=l;g<m.length;g++){let $=m[g];u+=`:${$.explicit?"k":"c"}${$.value.length}:${$.value}`}}te(i,u,w,p);let a=Qe(i,u,n,w);if(s&&i?a??=et(u,n):a&&f?.retained.add(a),i||(a=f?.root??document.querySelector(`[data-wutu-root="${e}"][data-wutu-prerender]`)),a?.hasAttribute("data-wutu-prerender")){a.removeAttribute("data-wutu-prerender");for(let l of[a,...a.querySelectorAll("[data-wutu-pending]")])!l.hasAttribute("data-wutu-pending")||l.parentNode?.closest("[data-wutu-lazy]")||(l.disabled=!1,l.removeAttribute("data-wutu-pending"))}return(!a||a.localName!==n)&&(a=o()),i&&i.used.add(a),i&&!s&&(i.wanted.push(a),i.appended?.add(a)),P.get(a)!==u&&(a.setAttribute("data-wutu",u),P.set(a,u)),i||(a.getAttribute("data-wutu-root")!==e&&a.setAttribute("data-wutu-root",e),f&&(f.root=a)),a}function ne(e,t,n){let o=k.get(e),s=o?null:new Set([...e.attributes].map(i=>i.name).filter(i=>n?n.has(i):!i.startsWith("data-wutu")&&!t.includes(i)));return b.push({node:e,meta:o,before:s,old:e.childNodes,used:new Set,wanted:[],attrs:null,byKey:null,keyed:null}),e}function tt(e,t,n,o){return ne(G(n,o,e,()=>t?document.createElementNS("http://www.w3.org/2000/svg",e):document.createElement(e)),[])}let oe=new WeakMap;function re(e,t){let n=oe.get(e);return n||oe.set(e,n=nt(e,t)),n}function nt(e,t){let n=([o,s,...i],u)=>{u=u||o==="svg";let w=u?document.createElementNS("http://www.w3.org/2000/svg",o):document.createElement(o);for(let a in s)se(w,a,s[a]);let p=u&&o!=="foreignObject";for(let a of i)w.append(typeof a=="string"?a:n(a,p));return w};return[n(e,t),Object.keys(e[1])]}function v(e){let t=b.at(-1),n=c.get(e);if(n||Array.isArray(e)||e?.nodeType===11){for(let i of n?E(n):Array.isArray(e)?e:[...e.childNodes])v(i);return}if(e?.nodeType){t.appended??=new Set(t.wanted),t.appended.has(e)||(t.appended.add(e),t.used.add(e),t.wanted.push(e)),f?.retained.add(e);return}let o=String(e??""),s=t.old[t.wanted.length];!s||s.nodeType!==3||t.used.has(s)?s=document.createTextNode(o):s.data!==o&&(s.data=o),t.used.add(s),t.wanted.push(s)}function F(e,t,n){if((b.at(-1).attrs??=new Set).add(t),n===null||n===!1||!ie(e,t,n)){e.removeAttribute(t);return}let o=n===!0?"":String(n);e.getAttribute(t)!==o&&se(e,t,o)}function se(e,t,n){let o={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"}[t.split(":",1)[0]];o&&t.includes(":")?e.setAttributeNS(o,t,n):e.setAttribute(t,n)}let ot=new Set(["href","xlink:href","src","action","formaction","poster","cite","data","background","codebase","longdesc","manifest"]),rt=new Set(["ping","srcset","imagesrcset"]);function ie(e,t,n){return t=t.toLowerCase(),t==="srcdoc"?!1:n===!0?!0:(n=String(n),ot.has(t)?ce(e,t,n):rt.has(t)?n.split(/[ ,]+/).every(o=>ce(e,t,o)):t!=="content"||e.localName!=="meta"||!/javascript:|vbscript:|data:/.test(ae(n)))}function ae(e,t=1/0){let n="";for(let o of e)if(o>" "&&(n+=o).length>=t)break;return n.toLowerCase()}function ce(e,t,n){let o=ae(n,16),s=e.localName;return/^(java|vb)script:/.test(o)?!1:!o.startsWith("data:")||t==="href"&&(s==="a"||s==="area")&&e.hasAttribute("download")?!0:o.startsWith("data:image/svg")?s==="img"||s==="image":/^data:(image|audio|video)[/]/.test(o)}function st(e,t,n){ie(e,t,n)?e[t]=n:e.removeAttribute(t.toLowerCase())}function le(e,t,n){if(t==="mount"){if(M.has(e))return;M.add(e);let u=f;queueMicrotask(()=>{let w=N;N=[e,u];try{n(new Event("mount"))}finally{N=w}L(),u&&W(u)});return}let o=t[0]==="~";o&&(t=t.slice(1));let s=C.get(e);s||C.set(e,s=new Map);let i=s.get(t);i||(i={handlers:[],generation:-1,view:f},s.set(t,i),e.addEventListener(t,u=>{let w=!1,p=N;N=[e,i.view];try{for(let[a,l]of[...i.handlers]){l||(w=!0);let g=a(u);g?.then&&g.then(R,$=>{R(),setTimeout(()=>{throw $})})}}finally{N=p,w&&(L(),i.view&&W(i.view))}})),i.generation!==J&&(i.handlers=[],i.generation=J),i.handlers.push([n,o]),i.view=f}function ue(){let e=b.pop(),t=e.node,n=e.attrs??Ve;if(t.hasAttribute("data-wutu-unmanaged"))return e.meta||t.replaceChildren(),k.set(t,{...k.get(t),attrs:n}),t;let o=e.meta;for(let i of o?o.attrs:e.before)n.has(i)||t.removeAttribute(i);o?o.attrs=n:k.set(t,{attrs:n}),ee(t,e.wanted);let s=Z.get(t);return s!==void 0&&t.value!==s&&(t.value=s),t}let fe=new Map,de=["end"],d=null;function it(e){let t=fe.get(e);if(!t){let n=2166136261;for(let o=0;o<e.length;o++)n=Math.imul(n^e.charCodeAt(o),16777619);fe.set(e,t=[JSON.parse(e),(n>>>0).toString(36)])}d={h:t[1],nodes:[],stack:[{ops:t[0],pc:0,kind:"top"}],outer:d,pending:null,depth:b.length,fragment:null}}let pe=new WeakMap;function at(e,t){let n=pe.get(e);n||pe.set(e,n=[]);let o=n[t];if(!o){o=n[t]=new Set;for(let s=t;s<e.length;s++){let[i,u]=e[s];if(i==="a"||i==="b")o.add(u);else if(i==="m")o.add("class");else if(i!=="n"&&i!=="y")break}}return o}function j(){for(;;){let e=d.stack.at(-1);if(e.pc>=e.ops.length){if(e.kind==="arm"){d.stack.pop();continue}return e.kind==="body"?de:null}let t=e.ops[e.pc++];switch(t[0]){case"r":B();break;case"s":{let[n]=re(t[2],!!t[3]);d.nodes[t[1]]=G(`v${d.h}:${t[1]}`,"",n.localName,()=>n.cloneNode(!0),b.length===d.depth);break}case"o":{let[n,o]=re(t[2],!!t[3]);d.nodes[t[1]]=ne(G(`v${d.h}:${t[1]}`,"",n.localName,()=>n.cloneNode(!1),b.length===d.depth),o,at(e.ops,e.pc));break}case"c":ue();break;case"t":v(t[1]);break;default:return t}}}function ct(e){if(d?.pending){d.pending=null,v(e),m.pop();return}if(!d){v(e),m.pop();return}let t=j(),n=b.at(-1)?.node;switch(t[0]){case"a":F(n,t[1],e);break;case"m":F(n,"class",t[1]+e);break;case"b":F(n,t[1],!!e);break;case"y":(b.at(-1).attrs??=new Set).add("style"),n.style.setProperty(t[1],e);break;case"w":v(e);break;case"v":le(d.nodes[t[1]],t[2],e);break;default:throw new Error("Wutu: a value where the template has "+JSON.stringify(t?.[0]))}}function lt(){let e=j();m.push({value:`call:${d.h}:${e[1]}`,explicit:!1}),d.pending=e}function ut(e){let t=j();d.stack.push({ops:t[0]==="k"?t[1][e]:e?t[1]:t[2],pc:0,kind:"arm"})}function me(){let e=j();if(e!==de)return[e,null];let t=d.stack.at(-1);return m.pop(),t.loop[1]===0&&m.pop(),[t.loop,t]}function ft(e){let[t,n]=me();n?n.pc=0:d.stack.push({ops:t[3],pc:0,kind:"body",loop:t});let o=String(e),s=t[1];s===0?(m.push({value:`loop:${d.h}:${t[2]}`,explicit:!1}),m.push({value:o,explicit:!1})):m.push({value:o,explicit:!0,global:s===2,depth:b.length})}function dt(){let[,e]=me();e&&d.stack.pop()}function pt(){return d.nodes[j()[1]]}function mt(){for(;j()!==null;);let e=d.nodes[0];if(d.fragment){let t=b.pop(),n=d.fragment;if(ee(n.start.parentNode,t.wanted,n),f&&(n.pending=t.wanted,(f.pendingRanges??=new Set).add(n)),e=n.value,d.depth===0)for(let o of t.wanted)o.nodeType===1&&o.setAttribute("data-wutu-root",`fragment:${d.h}`)}return d=d.outer,d||(x=null),e}function H(e){let t=[b,f,m,x,d],n=document.activeElement;e.cleanupIndex=0,e.cleanupCallbacks??=[],e.intervalsSeen=new Set,e.removals=new Set,e.pendingRanges=null,e.retained=new Set,e.globalNodes=null,e.globalClaims=new Set,b=[],f=e,m=[],x=null,J++;try{e.root=e.render();for(let o of e.cleanupCallbacks.splice(e.cleanupIndex))o();for(let[o,s]of e.effects)!s.node&&!e.intervalsSeen.has(o)&&(clearInterval(s.id),e.effects.delete(o));for(let o of e.removals)e.retained.has(o)||(V(o),o.remove());n?.isConnected&&document.activeElement!==n&&n.focus({preventScroll:!0})}finally{if([b,f,m,x,d]=t,e.globalNodes=null,e.pendingRanges)for(let o of e.pendingRanges)o.pending=null;e.pendingRanges=null,e.removals.clear(),e.retained.clear()}return e.root}function ht(e,t=""){if(f&&!t)return e();if(t){let i=T.get(t)?.deref();if(i&&_(i.root))return i.dirty&&(i.dirty=!1,H(i)),i.root}let n={render:e,root:null,scope:t,dirty:!1,cleanupCallbacks:[],effects:new Map},o=H(n);A.add(new WeakRef(n)),t&&T.set(t,new WeakRef(n));let s=c.get(o)?.start??o;return k.set(s,{...k.get(s),view:n}),o}function he(){z=!1;let e=[...y];y.clear();for(let t of e)_(t.root)&&(t.dirty=!1,H(t));for(let t of S.splice(0))t()}function R(){for(let e of A){let t=e.deref();if(!t){A.delete(e);continue}_(t.root)&&y.add(t)}L(),he()}function W(e){e&&y.add(e),!z&&(z=!0,queueMicrotask(he))}function V(e){let t=k.get(e)?.view;if(t){for(let n of t.cleanupCallbacks.splice(0))n();for(let n of t.effects.values())clearInterval(n.id);t.effects.clear(),t.scope&&T.delete(t.scope)}for(let n of e.childNodes??[])V(n)}globalThis.addEventListener?.("hashchange",R),globalThis.addEventListener?.("popstate",R);let Y={enter:tt,append:v,attr:F,url:st,listen:le,leave:ue,mount:ht,refresh:R,invalidate:He,selectValue:Ye,here:D,put:ct,begin:it,slot:lt,arm:ut,item:ft,end:dt,node:pt,done:mt,nodes(e){let t=c.get(e);return t?E(t):Array.isArray(e)?e.flatMap(Y.nodes):e?.nodeType===11?[...e.childNodes]:[e]},storageError:"",notify(){for(let e of A){let t=e.deref();t&&_(t.root)&&W(t)}},interval(e,t,n){let[o,s]=f?[null,f]:N??[];if(!o){if(!s)return;s.intervalsSeen.add(e)}let i=s?.effects??Ge,u=i.get(e);if(u?.node===o){u.callback=n;return}u&&clearInterval(u.id);let w={callback:n,id:0,node:o};w.id=setInterval(()=>{if(o&&!o.isConnected){clearInterval(w.id),i.delete(e);return}w.callback(),L(),W(s)},Math.max(16,t)),i.set(e,w)},memoHit(e){if(!e||!f)return!1;let t=f.memo?.get(D());return t?.key!==e||!_(t.node)?!1:(X=t.node,!0)},memoLast(){return X},memoKeep(e,t){e&&f&&(f.memo??=new Map).set(D(),{key:e,node:t})},after(e){S.push(e),W()},focus(e){S.push(()=>document.getElementById(e)?.focus()),W()},cleanup(e){f&&(f.cleanupCallbacks[f.cleanupIndex++]=e)},pushGlobal:e=>m.push({value:String(e),explicit:!0,global:!0,depth:b.length}),pushKey:e=>m.push({value:String(e),explicit:!0,depth:b.length}),pushCall:e=>m.push({value:e,explicit:!1}),popKey:()=>m.pop()};return Y})()}),Ce=(()=>globalThis.__utuWutu.node()),Me=(r=>c=>r(!!c))(r=>globalThis.__utuWutu.put(r)),ve=(r=>r.preventDefault()),je=(r=>c=>r(BigInt.asUintN(64,c)))(r=>globalThis.__utuWutu.item(r)),Ue=(()=>globalThis.__utuWutu.end()),Oe=(()=>{if(!document.getElementById("wutu-cozim8")){let r=document.createElement("style");r.id="wutu-cozim8",r.setAttribute("data-wutu-style",""),r.textContent=`@layer wutu.document{
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
    }`,document.head.append(r)}}),K=((r,c)=>r[c]),Re=((r,c,h)=>{r[c]=h}),Be=(r=>globalThis[r]),Q=((r,c)=>r[c]()),Pe=((r,c)=>globalThis[r](c)),Le=((r,c)=>r[c]?1:0),qe=((r,c)=>new globalThis[r](c)),Fe=((r,c,h)=>r[c](h)),Ke=(()=>globalThis.__utuWutu?.refresh()),De=(r=>globalThis.__utuWutu?.after(r)),ze=(r=>c=>(h=>typeof h=="string"?h:(()=>{throw new TypeError(`Wrong type from JavaScript: a Str, not ${h===null?"null":h instanceof Promise?"a Promise (await it: Promise[Str])":typeof h}`)})())(r(c)))(r=>r.trim()),Je=(r=>c=>(h=>typeof h=="string"?h:(()=>{throw new TypeError(`Wrong type from JavaScript: a Str, not ${h===null?"null":h instanceof Promise?"a Promise (await it: Promise[Str])":typeof h}`)})())(r(c)))(r=>r.toLowerCase());try{let{instance:r}=await WebAssembly.instantiateStreaming(fetch(new URL("./app.wasm",import.meta.url)),{es:[$e,Se,ke,Ae,Ee,_e,Te,Ne,We,Ie,Ce,Me,ve,je,Ue,Oe,K,Re,Be,Q,Pe,Le,Q,qe,K,K,Fe,Ke,De,ze,Je],utu:{closure_new:ye,closure_call_0:xe,closure_rec:we}},{builtins:["js-string"],importedStringConstants:"'"}),c=r.exports;document.querySelectorAll("[data-utu-static]").forEach(h=>h.remove()),await c.main?.(),document.documentElement.setAttribute("data-utu-ready","")}catch(r){document.documentElement.setAttribute("data-utu-error",String(r.message??r));let c=document.createElement("p");c.setAttribute("role","status"),c.textContent="Interactive tools could not start. The page is still available to read. Try reloading in a browser with WebAssembly GC support.",document.body.append(c),console.error(r)}
