var ge=Symbol("utu.closure");var he=new WeakMap,be=(r,a,h,E,_)=>{let I=a==null&&!(h&2),B=I&&he.get(r);if(B)return B;let k=I?(...y)=>r(...y):(...y)=>r(a,...y),C=_?.[(h>>4)-1],A=C?(...y)=>{for(let S=0;S<C.length;S++){let M=C[S];if(M==="b")y[S]=y[S]?1:0;else if(M==="n")y[S]===void 0&&(y[S]=null);else if(M==="h"&&y[S]==null)throw new TypeError(`Wrong type from JavaScript: a closure's argument ${S+1} is ${y[S]}`)}return k(...y)}:k,T=h&1?(...y)=>!!A(...y):h&4?(...y)=>A(...y)>>>0:h&8?(...y)=>BigInt.asUintN(64,A(...y)):A;return T[ge]=E,I&&he.set(r,T),T},ye=r=>r?.[ge]??null,we=(r,...a)=>r(...a);var xe=((r,a)=>globalThis.__utuWutu.mount(r,a)),$e=(r=>globalThis.__utuWutu.put(r)),Se=(r=>a=>r(a)?1:0)(r=>globalThis.__utuWutu.memoHit(r)),ke=(()=>globalThis.__utuWutu.memoLast()),Ae=((r,a)=>globalThis.__utuWutu.memoKeep(r,a)),Ee=(()=>globalThis.__utuWutu.slot()),_e=(r=>globalThis.__utuWutu.begin(r)),Te=(()=>globalThis.__utuWutu.done()),Ne=(r=>{if(r===document.documentElement)return;let a=r.querySelector(":scope>head")??r.insertBefore(document.createElement("head"),r.firstChild);for(let h of document.head.querySelectorAll("style"))a.append(h);document.replaceChild(r,document.documentElement)}),We=(()=>{globalThis.__utuWutu??=(function(){let a=new WeakMap,h=new WeakMap;function E(e,t=!0){if(e.pending)return t?[e.start,...e.pending,e.end]:e.pending;let n=[];for(let o=t?e.start:e.start.nextSibling;o;o=o.nextSibling){if(o===e.end){t&&n.push(o);break}n.push(o)}return n}function _(e){if(Array.isArray(e))return e.every(_);let t=a.get(e);return t?t.start.isConnected&&t.end.isConnected:!!e?.isConnected}function I(e){let t=a.get(e);return t?E(t,!1).flatMap(n=>n.nodeType===1?[n,...n.querySelectorAll("[data-wutu]")]:[]):e?.querySelectorAll?.("[data-wutu]")??[]}function B(){let e=b.at(-1),t=0,n=!1,o=!1;for(let l=0;l<m.length;l++)m[l].global&&(t=l,n=m[l].depth===b.length),m[l].explicit&&(o=m[l].depth===b.length);let s=e?m.slice(t).map(l=>`${l.explicit?"k":"c"}${l.value.length}:${l.value}`).join(":"):f?.scope??"",i=`wutu:${d.h}:${encodeURIComponent(s)}`;ee(e,i,n,o);let u=l=>{let g=new Map;for(let $ of l)if($.nodeType===8&&$.data.startsWith("wutu:")){let U=g.get($.data);U||g.set($.data,U={nodes:[],index:0}),U.nodes.push($)}return g},w=l=>{let g=l.get(i);for(;g&&g.index<g.nodes.length;){let $=g.nodes[g.index++];if(!e?.used.has($)&&!x?.used.has($))return $}},p=e&&w(e.ranges??=u(e.old));if(!p&&!e&&(p=a.get(f?.root)?.start),!p){let l=b[0]?.node;if((!x||x.root!==l)&&(x={root:l,index:null,used:new Set}),!x.comments){let g=[],$=O=>{O.nodeType===8&&(e||!h.has(O))&&g.push(O);for(let wt of O.childNodes??[])$(wt)},U=a.get(l);if(U)for(let O of E(U,!1))$(O);else $(l??document);x.comments=u(g)}p=w(x.comments)}let c=p&&h.get(p);if(!c&&p){let l=p.nextSibling;for(;l&&!(l.nodeType===8&&l.data==="/"+i);)l=l.nextSibling;l&&(c={start:p,end:l,value:document.createDocumentFragment()})}if(!c){let l=document.createDocumentFragment();c={value:l,start:document.createComment(i),end:document.createComment("/"+i)},l.append(c.start,c.end)}a.set(c.value,c),h.set(c.start,c),e&&e.used.add(c.start),x?.used.add(c.start),d.fragment=c,b.push({node:c.value,range:c,old:E(c,!1),used:new Set,wanted:[],byKey:null,keyed:null})}let k=new WeakMap,C=new WeakMap,A=new Set,T=new Map,y=new Set,S=[],M=new WeakSet,Q=null,K=()=>m.map(e=>e.value.length+":"+e.value).join("|"),P=new WeakMap,b=[],f=null,m=[],D=!1,z=0,N=null,Ye=new Map,x=null;function L(){V.autoSave?.()}function Qe(e){let t=T.get(e)?.deref();t&&(t.dirty=!0,W(t))}let Xe=new Set,X=new WeakMap;function Ze(e,t){X.set(e,t),e.value!==t&&(e.value=t)}function q(e){let t=P.get(e);return t===void 0&&P.set(e,t=e.getAttribute("data-wutu")),t}function Z(e,t,n=null){let o=n?E(n,!1):e.childNodes;if(o.length===t.length){let p=!0;for(let c=0;p&&c<t.length;c++)p=o[c]===t[c];if(p)return}let s=document.activeElement,i=s&&"selectionStart"in s?[s.selectionStart,s.selectionEnd,s.selectionDirection]:null,u=n?n.start.nextSibling:e.firstChild;for(let p of t){if(p===u){u=u.nextSibling;continue}e.moveBefore&&p.parentNode===e?e.moveBefore(p,u):e.insertBefore(p,u)}let w=new Set(t);for(let p of[...o])w.has(p)||p.nodeType===1&&(p.nodeName==="HEAD"||p.hasAttribute("data-wutu-style"))||(f?f.removals.add(p):(H(p),p.remove()));s?.isConnected&&document.activeElement!==s&&(s.focus({preventScroll:!0}),i?.[0]!=null&&s.setSelectionRange(...i))}function ee(e,t,n,o){if(n&&f){if(f.globalClaims.has(t))throw new Error("Duplicate global Wutu key: "+t);f.globalClaims.add(t)}if(o&&e){if(e.keyed??=new Set,e.keyed.has(t))throw new Error("Duplicate Wutu key: "+m.findLast(s=>s.explicit).value);e.keyed.add(t)}}function et(e,t,n,o){let s=e?.old[e.wanted.length];if(s?.nodeType===1&&s.localName===n&&q(s)===t&&!e.used.has(s))return s;let i=e&&tt(e).get(t);for(;i&&i.index<i.nodes.length;){let u=i.nodes[i.index++];if(!e.used.has(u)&&u.localName===n)return u}return o?nt(t):void 0}function tt(e){if(e.byKey)return e.byKey;e.byKey=new Map;for(let t of e.old){if(t.nodeType!==1)continue;let n=q(t),o=e.byKey.get(n);o||e.byKey.set(n,o={nodes:[],index:0}),o.nodes.push(t)}return e.byKey}function nt(e){if(f){if(!f.globalNodes){f.globalNodes=new Map;for(let t of I(f.root))f.globalNodes.set(q(t),t)}return f.globalNodes.get(e)}}function ot(e,t){let n=b[0]?.node;if(x?.root!==n&&(x={root:n,index:null,used:new Set}),!x.index){x.index=new Map;for(let s of I(n)){let i=q(s);x.index.has(i)||x.index.set(i,s)}}let o=x.index.get(e);if(!(!o||o.localName!==t||x.used.has(o)))return x.used.add(o),o}function J(e,t,n,o,s){let i=b.at(-1),u=e+(t?":"+t:""),w=!1,p=!1;if(m.length){let l=0;for(let g=0;g<m.length;g++)m[g].global&&(l=g,w=m[g].depth===b.length),m[g].explicit&&(p=m[g].depth===b.length);for(let g=l;g<m.length;g++){let $=m[g];u+=`:${$.explicit?"k":"c"}${$.value.length}:${$.value}`}}ee(i,u,w,p);let c=et(i,u,n,w);if(s&&i?c??=ot(u,n):c&&f?.retained.add(c),i||(c=f?.root??document.querySelector(`[data-wutu-root="${e}"][data-wutu-prerender]`)),c?.hasAttribute("data-wutu-prerender")){c.removeAttribute("data-wutu-prerender");for(let l of[c,...c.querySelectorAll("[data-wutu-pending]")])!l.hasAttribute("data-wutu-pending")||l.parentNode?.closest("[data-wutu-lazy]")||(l.disabled=!1,l.removeAttribute("data-wutu-pending"))}return(!c||c.localName!==n)&&(c=o()),i&&i.used.add(c),i&&!s&&(i.wanted.push(c),i.appended?.add(c)),P.get(c)!==u&&(c.setAttribute("data-wutu",u),P.set(c,u)),i||(c.getAttribute("data-wutu-root")!==e&&c.setAttribute("data-wutu-root",e),f&&(f.root=c)),c}function te(e,t,n){let o=k.get(e),s=o?null:new Set([...e.attributes].map(i=>i.name).filter(i=>n?n.has(i):!i.startsWith("data-wutu")&&!t.includes(i)));return b.push({node:e,meta:o,before:s,old:e.childNodes,used:new Set,wanted:[],attrs:null,byKey:null,keyed:null}),e}function rt(e,t,n,o){return te(J(n,o,e,()=>t?document.createElementNS("http://www.w3.org/2000/svg",e):document.createElement(e)),[])}let ne=new WeakMap;function oe(e,t){let n=ne.get(e);return n||ne.set(e,n=st(e,t)),n}function st(e,t){let n=([o,s,...i],u)=>{u=u||o==="svg";let w=u?document.createElementNS("http://www.w3.org/2000/svg",o):document.createElement(o);for(let c in s)re(w,c,s[c]);let p=u&&o!=="foreignObject";for(let c of i)w.append(typeof c=="string"?c:n(c,p));return w};return[n(e,t),Object.keys(e[1])]}function v(e){let t=b.at(-1),n=a.get(e);if(n||Array.isArray(e)||e?.nodeType===11){for(let i of n?E(n):Array.isArray(e)?e:[...e.childNodes])v(i);return}if(e?.nodeType){t.appended??=new Set(t.wanted),t.appended.has(e)||(t.appended.add(e),t.used.add(e),t.wanted.push(e)),f?.retained.add(e);return}let o=String(e??""),s=t.old[t.wanted.length];!s||s.nodeType!==3||t.used.has(s)?s=document.createTextNode(o):s.data!==o&&(s.data=o),t.used.add(s),t.wanted.push(s)}function F(e,t,n){if((b.at(-1).attrs??=new Set).add(t),n===null||n===!1||!se(e,t,n)){e.removeAttribute(t);return}let o=n===!0?"":String(n);e.getAttribute(t)!==o&&re(e,t,o)}function re(e,t,n){let o={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"}[t.split(":",1)[0]];o&&t.includes(":")?e.setAttributeNS(o,t,n):e.setAttribute(t,n)}let it=new Set(["href","xlink:href","src","action","formaction","poster","cite","data","background","codebase","longdesc","manifest"]),at=new Set(["ping","srcset","imagesrcset"]);function se(e,t,n){return t=t.toLowerCase(),t==="srcdoc"?!1:n===!0?!0:(n=String(n),it.has(t)?ae(e,t,n):at.has(t)?n.split(/[ ,]+/).every(o=>ae(e,t,o)):t!=="content"||e.localName!=="meta"||!/javascript:|vbscript:|data:/.test(ie(n)))}function ie(e,t=1/0){let n="";for(let o of e)if(o>" "&&(n+=o).length>=t)break;return n.toLowerCase()}function ae(e,t,n){let o=ie(n,16),s=e.localName;return/^(java|vb)script:/.test(o)?!1:!o.startsWith("data:")||t==="href"&&(s==="a"||s==="area")&&e.hasAttribute("download")?!0:o.startsWith("data:image/svg")?s==="img"||s==="image":/^data:(image|audio|video)[/]/.test(o)}function ct(e,t,n){se(e,t,n)?e[t]=n:e.removeAttribute(t.toLowerCase())}function ce(e,t,n){if(t==="mount"){if(M.has(e))return;M.add(e);let u=f;queueMicrotask(()=>{let w=N;N=[e,u];try{n(new Event("mount"))}finally{N=w}L(),u&&W(u)});return}let o=t[0]==="~";o&&(t=t.slice(1));let s=C.get(e);s||C.set(e,s=new Map);let i=s.get(t);i||(i={handlers:[],generation:-1,view:f},s.set(t,i),e.addEventListener(t,u=>{let w=!1,p=N;N=[e,i.view];try{for(let[c,l]of[...i.handlers]){l||(w=!0);let g=c(u);g?.then&&g.then(R,$=>{R(),setTimeout(()=>{throw $})})}}finally{N=p,w&&(L(),i.view&&W(i.view))}})),i.generation!==z&&(i.handlers=[],i.generation=z),i.handlers.push([n,o]),i.view=f}function le(){let e=b.pop(),t=e.node,n=e.attrs??Xe;if(t.hasAttribute("data-wutu-unmanaged"))return e.meta||t.replaceChildren(),k.set(t,{...k.get(t),attrs:n}),t;let o=e.meta;for(let i of o?o.attrs:e.before)n.has(i)||t.removeAttribute(i);o?o.attrs=n:k.set(t,{attrs:n}),Z(t,e.wanted);let s=X.get(t);return s!==void 0&&t.value!==s&&(t.value=s),t}let ue=new Map,fe=["end"],d=null;function lt(e){let t=ue.get(e);if(!t){let n=2166136261;for(let o=0;o<e.length;o++)n=Math.imul(n^e.charCodeAt(o),16777619);ue.set(e,t=[JSON.parse(e),(n>>>0).toString(36)])}d={h:t[1],nodes:[],stack:[{ops:t[0],pc:0,kind:"top"}],outer:d,pending:null,depth:b.length,fragment:null}}let de=new WeakMap;function ut(e,t){let n=de.get(e);n||de.set(e,n=[]);let o=n[t];if(!o){o=n[t]=new Set;for(let s=t;s<e.length;s++){let[i,u]=e[s];if(i==="a"||i==="b")o.add(u);else if(i==="m")o.add("class");else if(i!=="n"&&i!=="y")break}}return o}function j(){for(;;){let e=d.stack.at(-1);if(e.pc>=e.ops.length){if(e.kind==="arm"){d.stack.pop();continue}return e.kind==="body"?fe:null}let t=e.ops[e.pc++];switch(t[0]){case"r":B();break;case"s":{let[n]=oe(t[2],!!t[3]);d.nodes[t[1]]=J(`v${d.h}:${t[1]}`,"",n.localName,()=>n.cloneNode(!0),b.length===d.depth);break}case"o":{let[n,o]=oe(t[2],!!t[3]);d.nodes[t[1]]=te(J(`v${d.h}:${t[1]}`,"",n.localName,()=>n.cloneNode(!1),b.length===d.depth),o,ut(e.ops,e.pc));break}case"c":le();break;case"t":v(t[1]);break;default:return t}}}function ft(e){if(d?.pending){d.pending=null,v(e),m.pop();return}if(!d){v(e),m.pop();return}let t=j(),n=b.at(-1)?.node;switch(t[0]){case"a":F(n,t[1],e);break;case"m":F(n,"class",t[1]+e);break;case"b":F(n,t[1],!!e);break;case"y":(b.at(-1).attrs??=new Set).add("style"),n.style.setProperty(t[1],e);break;case"w":v(e);break;case"v":ce(d.nodes[t[1]],t[2],e);break;default:throw new Error("Wutu: a value where the template has "+JSON.stringify(t?.[0]))}}function dt(){let e=j();m.push({value:`call:${d.h}:${e[1]}`,explicit:!1}),d.pending=e}function pt(e){let t=j();d.stack.push({ops:t[0]==="k"?t[1][e]:e?t[1]:t[2],pc:0,kind:"arm"})}function pe(){let e=j();if(e!==fe)return[e,null];let t=d.stack.at(-1);return m.pop(),t.loop[1]===0&&m.pop(),[t.loop,t]}function mt(e){let[t,n]=pe();n?n.pc=0:d.stack.push({ops:t[3],pc:0,kind:"body",loop:t});let o=String(e),s=t[1];s===0?(m.push({value:`loop:${d.h}:${t[2]}`,explicit:!1}),m.push({value:o,explicit:!1})):m.push({value:o,explicit:!0,global:s===2,depth:b.length})}function ht(){let[,e]=pe();e&&d.stack.pop()}function gt(){return d.nodes[j()[1]]}function bt(){for(;j()!==null;);let e=d.nodes[0];if(d.fragment){let t=b.pop(),n=d.fragment;if(Z(n.start.parentNode,t.wanted,n),f&&(n.pending=t.wanted,(f.pendingRanges??=new Set).add(n)),e=n.value,d.depth===0)for(let o of t.wanted)o.nodeType===1&&o.setAttribute("data-wutu-root",`fragment:${d.h}`)}return d=d.outer,d||(x=null),e}function G(e){let t=[b,f,m,x,d],n=document.activeElement;e.cleanupIndex=0,e.cleanupCallbacks??=[],e.intervalsSeen=new Set,e.removals=new Set,e.pendingRanges=null,e.retained=new Set,e.globalNodes=null,e.globalClaims=new Set,b=[],f=e,m=[],x=null,z++;try{e.root=e.render();for(let o of e.cleanupCallbacks.splice(e.cleanupIndex))o();for(let[o,s]of e.effects)!s.node&&!e.intervalsSeen.has(o)&&(clearInterval(s.id),e.effects.delete(o));for(let o of e.removals)e.retained.has(o)||(H(o),o.remove());n?.isConnected&&document.activeElement!==n&&n.focus({preventScroll:!0})}finally{if([b,f,m,x,d]=t,e.globalNodes=null,e.pendingRanges)for(let o of e.pendingRanges)o.pending=null;e.pendingRanges=null,e.removals.clear(),e.retained.clear()}return e.root}function yt(e,t=""){if(f&&!t)return e();if(t){let i=T.get(t)?.deref();if(i&&_(i.root))return i.dirty&&(i.dirty=!1,G(i)),i.root}let n={render:e,root:null,scope:t,dirty:!1,cleanupCallbacks:[],effects:new Map},o=G(n);A.add(new WeakRef(n)),t&&T.set(t,new WeakRef(n));let s=a.get(o)?.start??o;return k.set(s,{...k.get(s),view:n}),o}function me(){D=!1;let e=[...y];y.clear();for(let t of e)_(t.root)&&(t.dirty=!1,G(t));for(let t of S.splice(0))t()}function R(){for(let e of A){let t=e.deref();if(!t){A.delete(e);continue}_(t.root)&&y.add(t)}L(),me()}function W(e){e&&y.add(e),!D&&(D=!0,queueMicrotask(me))}function H(e){let t=k.get(e)?.view;if(t){for(let n of t.cleanupCallbacks.splice(0))n();for(let n of t.effects.values())clearInterval(n.id);t.effects.clear(),t.scope&&T.delete(t.scope)}for(let n of e.childNodes??[])H(n)}globalThis.addEventListener?.("hashchange",R),globalThis.addEventListener?.("popstate",R);let V={enter:rt,append:v,attr:F,url:ct,listen:ce,leave:le,mount:yt,refresh:R,invalidate:Qe,selectValue:Ze,here:K,put:ft,begin:lt,slot:dt,arm:pt,item:mt,end:ht,node:gt,done:bt,nodes(e){let t=a.get(e);return t?E(t):Array.isArray(e)?e.flatMap(V.nodes):e?.nodeType===11?[...e.childNodes]:[e]},storageError:"",notify(){for(let e of A){let t=e.deref();t&&_(t.root)&&W(t)}},interval(e,t,n){let[o,s]=f?[null,f]:N??[];if(!o){if(!s)return;s.intervalsSeen.add(e)}let i=s?.effects??Ye,u=i.get(e);if(u?.node===o){u.callback=n;return}u&&clearInterval(u.id);let w={callback:n,id:0,node:o};w.id=setInterval(()=>{if(o&&!o.isConnected){clearInterval(w.id),i.delete(e);return}w.callback(),L(),W(s)},Math.max(16,t)),i.set(e,w)},memoHit(e){if(!e||!f)return!1;let t=f.memo?.get(K());return t?.key!==e||!_(t.node)?!1:(Q=t.node,!0)},memoLast(){return Q},memoKeep(e,t){e&&f&&(f.memo??=new Map).set(K(),{key:e,node:t})},after(e){S.push(e),W()},focus(e){S.push(()=>document.getElementById(e)?.focus()),W()},cleanup(e){f&&(f.cleanupCallbacks[f.cleanupIndex++]=e)},pushGlobal:e=>m.push({value:String(e),explicit:!0,global:!0,depth:b.length}),pushKey:e=>m.push({value:String(e),explicit:!0,depth:b.length}),pushCall:e=>m.push({value:e,explicit:!1}),popKey:()=>m.pop()};return V})()}),Ie=(()=>globalThis.__utuWutu.node()),Ce=(r=>a=>r(!!a))(r=>globalThis.__utuWutu.put(r)),Me=(r=>r.preventDefault()),ve=(r=>a=>r(BigInt.asUintN(64,a)))(r=>globalThis.__utuWutu.item(r)),je=(()=>globalThis.__utuWutu.end()),Ue=(()=>{if(!document.getElementById("wutu-cozim8")){let r=document.createElement("style");r.id="wutu-cozim8",r.setAttribute("data-wutu-style",""),r.textContent=`@layer wutu.document{
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
    }`,document.head.append(r)}}),Oe=((r,a)=>r[a]),Re=((r,a,h)=>{r[a]=h}),Be=(r=>globalThis[r]),Y=((r,a)=>r[a]()),Pe=((r,a)=>globalThis[r](a)),Le=((r,a)=>r[a]?1:0),qe=((r,a)=>new globalThis[r](a)),Fe=((r,a,h)=>r[a](h)),Ke=(r=>r.length),De=((r,a)=>r[a]|r[a+1]<<8|r[a+2]<<16|r[a+3]<<24),ze=((r,a)=>r[a]),Je=(()=>globalThis.__utuWutu?.refresh()),Ge=(r=>globalThis.__utuWutu?.after(r)),He=(r=>a=>(h=>typeof h=="string"?h:(()=>{throw new TypeError(`Wrong type from JavaScript: a Str, not ${h===null?"null":h instanceof Promise?"a Promise (await it: Promise[Str])":typeof h}`)})())(r(a)))(r=>r.trim()),Ve=(r=>a=>(h=>typeof h=="string"?h:(()=>{throw new TypeError(`Wrong type from JavaScript: a Str, not ${h===null?"null":h instanceof Promise?"a Promise (await it: Promise[Str])":typeof h}`)})())(r(a)))(r=>r.toLowerCase());try{let{instance:r}=await WebAssembly.instantiateStreaming(fetch(new URL("./app.wasm",import.meta.url)),{es:[xe,$e,Se,ke,Ae,Ee,_e,Te,Ne,We,Ie,Ce,Me,ve,je,Ue,Oe,Re,Be,Y,Pe,Le,Y,qe,Fe,Ke,De,ze,Je,Ge,He,Ve],utu:{closure_new:be,closure_call_0:we,closure_rec:ye}},{builtins:["js-string"],importedStringConstants:"'"}),a=r.exports;document.querySelectorAll("[data-utu-static]").forEach(h=>h.remove()),await a.main?.(),document.documentElement.setAttribute("data-utu-ready","")}catch(r){document.documentElement.setAttribute("data-utu-error",String(r.message??r));let a=document.createElement("p");a.setAttribute("role","status"),a.textContent="Interactive tools could not start. The page is still available to read. Try reloading in a browser with WebAssembly GC support.",document.body.append(a),console.error(r)}
