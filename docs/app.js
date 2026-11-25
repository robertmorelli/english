var pt=Symbol("utu.closure");var he=new WeakMap,ge=(i,a,l,w,k)=>{let T=a==null&&!(l&2),N=T&&he.get(i);if(N)return N;let E=T?(...y)=>i(...y):(...y)=>i(a,...y),M=k?.[(l>>4)-1],_=M?(...y)=>{for(let A=0;A<M.length;A++){let v=M[A];if(v==="b")y[A]=y[A]?1:0;else if(v==="n")y[A]===void 0&&(y[A]=null);else if(v==="h"&&y[A]==null)throw new TypeError(`Wrong type from JavaScript: a closure's argument ${A+1} is ${y[A]}`)}return E(...y)}:E,W=l&1?(...y)=>!!_(...y):l&4?(...y)=>_(...y)>>>0:l&8?(...y)=>BigInt.asUintN(64,_(...y)):_;return W[pt]=w,T&&he.set(i,W),W};var be=((i,a)=>globalThis.__utuWutu.mount(i,a)),we=(i=>globalThis.__utuWutu.put(i)),ye=(i=>a=>i(a)?1:0)(i=>globalThis.__utuWutu.memoHit(i)),xe=(()=>globalThis.__utuWutu.memoLast()),$e=((i,a)=>globalThis.__utuWutu.memoKeep(i,a)),Se=(()=>globalThis.__utuWutu.slot()),ke=(i=>globalThis.__utuWutu.begin(i)),Ae=(()=>globalThis.__utuWutu.done()),Ee=(i=>{if(i===document.documentElement)return;let a=i.querySelector(":scope>head")??i.insertBefore(document.createElement("head"),i.firstChild);for(let l of document.head.querySelectorAll("style"))a.append(l);document.replaceChild(i,document.documentElement)}),Te=(()=>{globalThis.__utuWutu??=(function(){let a=new WeakMap,l=new WeakMap;function w(e,t=!0){if(e.pending)return t?[e.start,...e.pending,e.end]:e.pending;let n=[];for(let o=t?e.start:e.start.nextSibling;o;o=o.nextSibling){if(o===e.end){t&&n.push(o);break}n.push(o)}return n}function k(e){if(Array.isArray(e))return e.every(k);let t=a.get(e);return t?t.start.isConnected&&t.end.isConnected:!!e?.isConnected}function T(e){let t=a.get(e);return t?w(t,!1).flatMap(n=>n.nodeType===1?[n,...n.querySelectorAll("[data-wutu]")]:[]):e?.querySelectorAll?.("[data-wutu]")??[]}function N(){let e=b.at(-1),t=0,n=!1,o=!1;for(let u=0;u<h.length;u++)h[u].global&&(t=u,n=h[u].depth===b.length),h[u].explicit&&(o=h[u].depth===b.length);let r=e?h.slice(t).map(u=>`${u.explicit?"k":"c"}${u.value.length}:${u.value}`).join(":"):d?.scope??"",s=`wutu:${p.h}:${encodeURIComponent(r)}`;ee(e,s,n,o);let f=u=>{let g=new Map;for(let S of u)if(S.nodeType===8&&S.data.startsWith("wutu:")){let O=g.get(S.data);O||g.set(S.data,O={nodes:[],index:0}),O.nodes.push(S)}return g},x=u=>{let g=u.get(s);for(;g&&g.index<g.nodes.length;){let S=g.nodes[g.index++];if(!e?.used.has(S)&&!$?.used.has(S))return S}},m=e&&x(e.ranges??=f(e.old));if(!m&&!e&&(m=a.get(d?.root)?.start),!m){let u=b[0]?.node;if((!$||$.root!==u)&&($={root:u,index:null,used:new Set}),!$.comments){let g=[],S=B=>{B.nodeType===8&&(e||!l.has(B))&&g.push(B);for(let dt of B.childNodes??[])S(dt)},O=a.get(u);if(O)for(let B of w(O,!1))S(B);else S(u??document);$.comments=f(g)}m=x($.comments)}let c=m&&l.get(m);if(!c&&m){let u=m.nextSibling;for(;u&&!(u.nodeType===8&&u.data==="/"+s);)u=u.nextSibling;u&&(c={start:m,end:u,value:document.createDocumentFragment()})}if(!c){let u=document.createDocumentFragment();c={value:u,start:document.createComment(s),end:document.createComment("/"+s)},u.append(c.start,c.end)}a.set(c.value,c),l.set(c.start,c),e&&e.used.add(c.start),$?.used.add(c.start),p.fragment=c,b.push({node:c.value,range:c,old:w(c,!1),used:new Set,wanted:[],byKey:null,keyed:null})}let E=new WeakMap,M=new WeakMap,_=new Set,W=new Map,y=new Set,A=[],v=new WeakSet,Q=null,D=()=>h.map(e=>e.value.length+":"+e.value).join("|"),P=new WeakMap,b=[],d=null,h=[],F=!1,K=0,I=null,De=new Map,$=null;function L(){V.autoSave?.()}function Fe(e){let t=W.get(e)?.deref();t&&(t.dirty=!0,C(t))}let Ke=new Set,X=new WeakMap;function Je(e,t){X.set(e,t),e.value!==t&&(e.value=t)}function q(e){let t=P.get(e);return t===void 0&&P.set(e,t=e.getAttribute("data-wutu")),t}function Z(e,t,n=null){let o=n?w(n,!1):e.childNodes;if(o.length===t.length){let m=!0;for(let c=0;m&&c<t.length;c++)m=o[c]===t[c];if(m)return}let r=document.activeElement,s=r&&"selectionStart"in r?[r.selectionStart,r.selectionEnd,r.selectionDirection]:null,f=n?n.start.nextSibling:e.firstChild;for(let m of t){if(m===f){f=f.nextSibling;continue}e.moveBefore&&m.parentNode===e?e.moveBefore(m,f):e.insertBefore(m,f)}let x=new Set(t);for(let m of[...o])x.has(m)||m.nodeType===1&&(m.nodeName==="HEAD"||m.hasAttribute("data-wutu-style"))||(d?d.removals.add(m):(H(m),m.remove()));r?.isConnected&&document.activeElement!==r&&(r.focus({preventScroll:!0}),s?.[0]!=null&&r.setSelectionRange(...s))}function ee(e,t,n,o){if(n&&d){if(d.globalClaims.has(t))throw new Error("Duplicate global Wutu key: "+t);d.globalClaims.add(t)}if(o&&e){if(e.keyed??=new Set,e.keyed.has(t))throw new Error("Duplicate Wutu key: "+h.findLast(r=>r.explicit).value);e.keyed.add(t)}}function Ge(e,t,n,o){let r=e?.old[e.wanted.length];if(r?.nodeType===1&&r.localName===n&&q(r)===t&&!e.used.has(r))return r;let s=e&&He(e).get(t);for(;s&&s.index<s.nodes.length;){let f=s.nodes[s.index++];if(!e.used.has(f)&&f.localName===n)return f}return o?Ve(t):void 0}function He(e){if(e.byKey)return e.byKey;e.byKey=new Map;for(let t of e.old){if(t.nodeType!==1)continue;let n=q(t),o=e.byKey.get(n);o||e.byKey.set(n,o={nodes:[],index:0}),o.nodes.push(t)}return e.byKey}function Ve(e){if(d){if(!d.globalNodes){d.globalNodes=new Map;for(let t of T(d.root))d.globalNodes.set(q(t),t)}return d.globalNodes.get(e)}}function Ye(e,t){let n=b[0]?.node;if($?.root!==n&&($={root:n,index:null,used:new Set}),!$.index){$.index=new Map;for(let r of T(n)){let s=q(r);$.index.has(s)||$.index.set(s,r)}}let o=$.index.get(e);if(!(!o||o.localName!==t||$.used.has(o)))return $.used.add(o),o}function J(e,t,n,o,r){let s=b.at(-1),f=e+(t?":"+t:""),x=!1,m=!1;if(h.length){let u=0;for(let g=0;g<h.length;g++)h[g].global&&(u=g,x=h[g].depth===b.length),h[g].explicit&&(m=h[g].depth===b.length);for(let g=u;g<h.length;g++){let S=h[g];f+=`:${S.explicit?"k":"c"}${S.value.length}:${S.value}`}}ee(s,f,x,m);let c=Ge(s,f,n,x);if(r&&s?c??=Ye(f,n):c&&d?.retained.add(c),s||(c=d?.root??document.querySelector(`[data-wutu-root="${e}"][data-wutu-prerender]`)),c?.hasAttribute("data-wutu-prerender")){c.removeAttribute("data-wutu-prerender");for(let u of[c,...c.querySelectorAll("[data-wutu-pending]")])!u.hasAttribute("data-wutu-pending")||u.parentNode?.closest("[data-wutu-lazy]")||(u.disabled=!1,u.removeAttribute("data-wutu-pending"))}return(!c||c.localName!==n)&&(c=o()),s&&s.used.add(c),s&&!r&&(s.wanted.push(c),s.appended?.add(c)),P.get(c)!==f&&(c.setAttribute("data-wutu",f),P.set(c,f)),s||(c.getAttribute("data-wutu-root")!==e&&c.setAttribute("data-wutu-root",e),d&&(d.root=c)),c}function te(e,t,n){let o=E.get(e),r=o?null:new Set([...e.attributes].map(s=>s.name).filter(s=>n?n.has(s):!s.startsWith("data-wutu")&&!t.includes(s)));return b.push({node:e,meta:o,before:r,old:e.childNodes,used:new Set,wanted:[],attrs:null,byKey:null,keyed:null}),e}function Qe(e,t,n,o){return te(J(n,o,e,()=>t?document.createElementNS("http://www.w3.org/2000/svg",e):document.createElement(e)),[])}let ne=new WeakMap;function oe(e,t){let n=ne.get(e);return n||ne.set(e,n=Xe(e,t)),n}function Xe(e,t){let n=([o,r,...s],f)=>{f=f||o==="svg";let x=f?document.createElementNS("http://www.w3.org/2000/svg",o):document.createElement(o);for(let c in r)re(x,c,r[c]);let m=f&&o!=="foreignObject";for(let c of s)x.append(typeof c=="string"?c:n(c,m));return x};return[n(e,t),Object.keys(e[1])]}function U(e){let t=b.at(-1),n=a.get(e);if(n||Array.isArray(e)||e?.nodeType===11){for(let s of n?w(n):Array.isArray(e)?e:[...e.childNodes])U(s);return}if(e?.nodeType){t.appended??=new Set(t.wanted),t.appended.has(e)||(t.appended.add(e),t.used.add(e),t.wanted.push(e)),d?.retained.add(e);return}let o=String(e??""),r=t.old[t.wanted.length];!r||r.nodeType!==3||t.used.has(r)?r=document.createTextNode(o):r.data!==o&&(r.data=o),t.used.add(r),t.wanted.push(r)}function z(e,t,n){if((b.at(-1).attrs??=new Set).add(t),n===null||n===!1||!se(e,t,n)){e.removeAttribute(t);return}let o=n===!0?"":String(n);e.getAttribute(t)!==o&&re(e,t,o)}function re(e,t,n){let o={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"}[t.split(":",1)[0]];o&&t.includes(":")?e.setAttributeNS(o,t,n):e.setAttribute(t,n)}let Ze=new Set(["href","xlink:href","src","action","formaction","poster","cite","data","background","codebase","longdesc","manifest"]),et=new Set(["ping","srcset","imagesrcset"]);function se(e,t,n){return t=t.toLowerCase(),t==="srcdoc"?!1:n===!0?!0:(n=String(n),Ze.has(t)?ae(e,t,n):et.has(t)?n.split(/[ ,]+/).every(o=>ae(e,t,o)):t!=="content"||e.localName!=="meta"||!/javascript:|vbscript:|data:/.test(ie(n)))}function ie(e,t=1/0){let n="";for(let o of e)if(o>" "&&(n+=o).length>=t)break;return n.toLowerCase()}function ae(e,t,n){let o=ie(n,16),r=e.localName;return/^(java|vb)script:/.test(o)?!1:!o.startsWith("data:")||t==="href"&&(r==="a"||r==="area")&&e.hasAttribute("download")?!0:o.startsWith("data:image/svg")?r==="img"||r==="image":/^data:(image|audio|video)[/]/.test(o)}function tt(e,t,n){se(e,t,n)?e[t]=n:e.removeAttribute(t.toLowerCase())}function ce(e,t,n){if(t==="mount"){if(v.has(e))return;v.add(e);let f=d;queueMicrotask(()=>{let x=I;I=[e,f];try{n(new Event("mount"))}finally{I=x}L(),f&&C(f)});return}let o=t[0]==="~";o&&(t=t.slice(1));let r=M.get(e);r||M.set(e,r=new Map);let s=r.get(t);s||(s={handlers:[],generation:-1,view:d},r.set(t,s),e.addEventListener(t,f=>{let x=!1,m=I;I=[e,s.view];try{for(let[c,u]of[...s.handlers]){u||(x=!0);let g=c(f);g?.then&&g.then(R,S=>{R(),setTimeout(()=>{throw S})})}}finally{I=m,x&&(L(),s.view&&C(s.view))}})),s.generation!==K&&(s.handlers=[],s.generation=K),s.handlers.push([n,o]),s.view=d}function le(){let e=b.pop(),t=e.node,n=e.attrs??Ke;if(t.hasAttribute("data-wutu-unmanaged"))return e.meta||t.replaceChildren(),E.set(t,{...E.get(t),attrs:n}),t;let o=e.meta;for(let s of o?o.attrs:e.before)n.has(s)||t.removeAttribute(s);o?o.attrs=n:E.set(t,{attrs:n}),Z(t,e.wanted);let r=X.get(t);return r!==void 0&&t.value!==r&&(t.value=r),t}let ue=new Map,fe=["end"],p=null;function nt(e){let t=ue.get(e);if(!t){let n=2166136261;for(let o=0;o<e.length;o++)n=Math.imul(n^e.charCodeAt(o),16777619);ue.set(e,t=[JSON.parse(e),(n>>>0).toString(36)])}p={h:t[1],nodes:[],stack:[{ops:t[0],pc:0,kind:"top"}],outer:p,pending:null,depth:b.length,fragment:null}}let de=new WeakMap;function ot(e,t){let n=de.get(e);n||de.set(e,n=[]);let o=n[t];if(!o){o=n[t]=new Set;for(let r=t;r<e.length;r++){let[s,f]=e[r];if(s==="a"||s==="b")o.add(f);else if(s==="m")o.add("class");else if(s!=="n"&&s!=="y")break}}return o}function j(){for(;;){let e=p.stack.at(-1);if(e.pc>=e.ops.length){if(e.kind==="arm"){p.stack.pop();continue}return e.kind==="body"?fe:null}let t=e.ops[e.pc++];switch(t[0]){case"r":N();break;case"s":{let[n]=oe(t[2],!!t[3]);p.nodes[t[1]]=J(`v${p.h}:${t[1]}`,"",n.localName,()=>n.cloneNode(!0),b.length===p.depth);break}case"o":{let[n,o]=oe(t[2],!!t[3]);p.nodes[t[1]]=te(J(`v${p.h}:${t[1]}`,"",n.localName,()=>n.cloneNode(!1),b.length===p.depth),o,ot(e.ops,e.pc));break}case"c":le();break;case"t":U(t[1]);break;default:return t}}}function rt(e){if(p?.pending){p.pending=null,U(e),h.pop();return}if(!p){U(e),h.pop();return}let t=j(),n=b.at(-1)?.node;switch(t[0]){case"a":z(n,t[1],e);break;case"m":z(n,"class",t[1]+e);break;case"b":z(n,t[1],!!e);break;case"y":(b.at(-1).attrs??=new Set).add("style"),n.style.setProperty(t[1],e);break;case"w":U(e);break;case"v":ce(p.nodes[t[1]],t[2],e);break;default:throw new Error("Wutu: a value where the template has "+JSON.stringify(t?.[0]))}}function st(){let e=j();h.push({value:`call:${p.h}:${e[1]}`,explicit:!1}),p.pending=e}function it(e){let t=j();p.stack.push({ops:t[0]==="k"?t[1][e]:e?t[1]:t[2],pc:0,kind:"arm"})}function pe(){let e=j();if(e!==fe)return[e,null];let t=p.stack.at(-1);return h.pop(),t.loop[1]===0&&h.pop(),[t.loop,t]}function at(e){let[t,n]=pe();n?n.pc=0:p.stack.push({ops:t[3],pc:0,kind:"body",loop:t});let o=String(e),r=t[1];r===0?(h.push({value:`loop:${p.h}:${t[2]}`,explicit:!1}),h.push({value:o,explicit:!1})):h.push({value:o,explicit:!0,global:r===2,depth:b.length})}function ct(){let[,e]=pe();e&&p.stack.pop()}function lt(){return p.nodes[j()[1]]}function ut(){for(;j()!==null;);let e=p.nodes[0];if(p.fragment){let t=b.pop(),n=p.fragment;if(Z(n.start.parentNode,t.wanted,n),d&&(n.pending=t.wanted,(d.pendingRanges??=new Set).add(n)),e=n.value,p.depth===0)for(let o of t.wanted)o.nodeType===1&&o.setAttribute("data-wutu-root",`fragment:${p.h}`)}return p=p.outer,p||($=null),e}function G(e){let t=[b,d,h,$,p],n=document.activeElement;e.cleanupIndex=0,e.cleanupCallbacks??=[],e.intervalsSeen=new Set,e.removals=new Set,e.pendingRanges=null,e.retained=new Set,e.globalNodes=null,e.globalClaims=new Set,b=[],d=e,h=[],$=null,K++;try{e.root=e.render();for(let o of e.cleanupCallbacks.splice(e.cleanupIndex))o();for(let[o,r]of e.effects)!r.node&&!e.intervalsSeen.has(o)&&(clearInterval(r.id),e.effects.delete(o));for(let o of e.removals)e.retained.has(o)||(H(o),o.remove());n?.isConnected&&document.activeElement!==n&&n.focus({preventScroll:!0})}finally{if([b,d,h,$,p]=t,e.globalNodes=null,e.pendingRanges)for(let o of e.pendingRanges)o.pending=null;e.pendingRanges=null,e.removals.clear(),e.retained.clear()}return e.root}function ft(e,t=""){if(d&&!t)return e();if(t){let s=W.get(t)?.deref();if(s&&k(s.root))return s.dirty&&(s.dirty=!1,G(s)),s.root}let n={render:e,root:null,scope:t,dirty:!1,cleanupCallbacks:[],effects:new Map},o=G(n);_.add(new WeakRef(n)),t&&W.set(t,new WeakRef(n));let r=a.get(o)?.start??o;return E.set(r,{...E.get(r),view:n}),o}function me(){F=!1;let e=[...y];y.clear();for(let t of e)k(t.root)&&(t.dirty=!1,G(t));for(let t of A.splice(0))t()}function R(){for(let e of _){let t=e.deref();if(!t){_.delete(e);continue}k(t.root)&&y.add(t)}L(),me()}function C(e){e&&y.add(e),!F&&(F=!0,queueMicrotask(me))}function H(e){let t=E.get(e)?.view;if(t){for(let n of t.cleanupCallbacks.splice(0))n();for(let n of t.effects.values())clearInterval(n.id);t.effects.clear(),t.scope&&W.delete(t.scope)}for(let n of e.childNodes??[])H(n)}globalThis.addEventListener?.("hashchange",R),globalThis.addEventListener?.("popstate",R);let V={enter:Qe,append:U,attr:z,url:tt,listen:ce,leave:le,mount:ft,refresh:R,invalidate:Fe,selectValue:Je,here:D,put:rt,begin:nt,slot:st,arm:it,item:at,end:ct,node:lt,done:ut,nodes(e){let t=a.get(e);return t?w(t):Array.isArray(e)?e.flatMap(V.nodes):e?.nodeType===11?[...e.childNodes]:[e]},storageError:"",notify(){for(let e of _){let t=e.deref();t&&k(t.root)&&C(t)}},interval(e,t,n){let[o,r]=d?[null,d]:I??[];if(!o){if(!r)return;r.intervalsSeen.add(e)}let s=r?.effects??De,f=s.get(e);if(f?.node===o){f.callback=n;return}f&&clearInterval(f.id);let x={callback:n,id:0,node:o};x.id=setInterval(()=>{if(o&&!o.isConnected){clearInterval(x.id),s.delete(e);return}x.callback(),L(),C(r)},Math.max(16,t)),s.set(e,x)},memoHit(e){if(!e||!d)return!1;let t=d.memo?.get(D());return t?.key!==e||!k(t.node)?!1:(Q=t.node,!0)},memoLast(){return Q},memoKeep(e,t){e&&d&&(d.memo??=new Map).set(D(),{key:e,node:t})},after(e){A.push(e),C()},focus(e){A.push(()=>document.getElementById(e)?.focus()),C()},cleanup(e){d&&(d.cleanupCallbacks[d.cleanupIndex++]=e)},pushGlobal:e=>h.push({value:String(e),explicit:!0,global:!0,depth:b.length}),pushKey:e=>h.push({value:String(e),explicit:!0,depth:b.length}),pushCall:e=>h.push({value:e,explicit:!1}),popKey:()=>h.pop()};return V})()}),_e=(()=>globalThis.__utuWutu.node()),We=(i=>a=>i(!!a))(i=>globalThis.__utuWutu.put(i)),Ne=(i=>i.preventDefault()),Ie=(i=>a=>i(BigInt.asUintN(64,a)))(i=>globalThis.__utuWutu.item(i)),Ce=(()=>globalThis.__utuWutu.end()),Me=(()=>{if(!document.getElementById("wutu-cozim8")){let i=document.createElement("style");i.id="wutu-cozim8",i.setAttribute("data-wutu-style",""),i.textContent=`@layer wutu.document{
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
    }`,document.head.append(i)}}),ve=((i,a)=>i[a]),Ue=((i,a,l)=>{i[a]=l}),je=(i=>globalThis[i]),Y=((i,a)=>i[a]()),Oe=((i,a)=>{fetch(i).then(l=>{if(!l.ok)throw new Error("fetch failed");return l.arrayBuffer()}).then(l=>WebAssembly.instantiate(l,{env:{}})).then(l=>{let w=l.instance.exports;w.init(),globalThis.__englishTrie={wasm:w,encoder:new TextEncoder,decoder:new TextDecoder},a()}).catch(()=>{})}),Be=(i=>a=>i(a)?1:0)(i=>{let a=globalThis.__englishTrie;if(!a)return!1;let l=i.trim().toLowerCase().replace(/[^a-z]/g,"");if(!l)return!1;let w=a.encoder.encode(l),k=a.wasm.getResultBuffer();return new Uint8Array(a.wasm.memory.buffer).set(w,k),!!a.wasm.contains(k,w.length)}),Re=(i=>(a,l)=>(w=>typeof w=="string"?w:(()=>{throw new TypeError(`Wrong type from JavaScript: a Str, not ${w===null?"null":w instanceof Promise?"a Promise (await it: Promise[Str])":typeof w}`)})())(i(a,l)))((i,a)=>{let l=globalThis.__englishTrie;if(!l)return"";let w=i.trim().toLowerCase().replace(/[^a-z]/g,"");if(!w)return"";let k=l.encoder.encode(w),T=l.wasm.getResultPtr();new Uint8Array(l.wasm.memory.buffer).set(k,T);let N=l.wasm.autocomplete(T,k.length,a);if(N<=0)return"";let E=new Uint8Array(l.wasm.memory.buffer,T,N);return l.decoder.decode(E).trim()}),Pe=(()=>globalThis.__utuWutu?.refresh()),Le=(i=>globalThis.__utuWutu?.after(i)),qe=(i=>a=>(l=>typeof l=="string"?l:(()=>{throw new TypeError(`Wrong type from JavaScript: a Str, not ${l===null?"null":l instanceof Promise?"a Promise (await it: Promise[Str])":typeof l}`)})())(i(a)))(i=>i.trim()),ze=((i,a,l)=>i.indexOf(a,l));try{let{instance:i}=await WebAssembly.instantiateStreaming(fetch(new URL("./app.wasm",import.meta.url)),{es:[be,we,ye,xe,$e,Se,ke,Ae,Ee,Te,_e,We,Ne,Ie,Ce,Me,ve,Ue,je,Y,Oe,Be,Re,Y,Pe,Le,qe,ze],utu:{closure_new:ge}},{builtins:["js-string"],importedStringConstants:"'"}),a=i.exports;document.querySelectorAll("[data-utu-static]").forEach(l=>l.remove()),await a.main?.(),document.documentElement.setAttribute("data-utu-ready","")}catch(i){document.documentElement.setAttribute("data-utu-error",String(i.message??i));let a=document.createElement("p");a.setAttribute("role","status"),a.textContent="Interactive tools could not start. The page is still available to read. Try reloading in a browser with WebAssembly GC support.",document.body.append(a),console.error(i)}
