var rt=Symbol("utu.closure");var me=new WeakMap,he=(a,p,h,E,N)=>{let _=p==null&&!(h&2),P=_&&me.get(a);if(P)return P;let $=_?(...y)=>a(...y):(...y)=>a(p,...y),C=N?.[(h>>4)-1],A=C?(...y)=>{for(let k=0;k<C.length;k++){let M=C[k];if(M==="b")y[k]=y[k]?1:0;else if(M==="n")y[k]===void 0&&(y[k]=null);else if(M==="h"&&y[k]==null)throw new TypeError(`Wrong type from JavaScript: a closure's argument ${k+1} is ${y[k]}`)}return $(...y)}:$,T=h&1?(...y)=>!!A(...y):h&4?(...y)=>A(...y)>>>0:h&8?(...y)=>BigInt.asUintN(64,A(...y)):A;return T[rt]=E,_&&me.set(a,T),T};var ge=((a,p)=>globalThis.__utuWutu.mount(a,p)),be=(a=>globalThis.__utuWutu.put(a)),ye=(()=>globalThis.__utuWutu.node()),we=(a=>a.preventDefault()),xe=(a=>globalThis.__utuWutu.item(a)),Se=(()=>globalThis.__utuWutu.slot()),ke=(()=>globalThis.__utuWutu.end()),$e=(a=>globalThis.__utuWutu.begin(a)),Ae=(()=>globalThis.__utuWutu.done()),Ee=(()=>{if(!document.getElementById("wutu-1i1s3nk")){let a=document.createElement("style");a.id="wutu-1i1s3nk",a.setAttribute("data-wutu-style",""),a.textContent=`@layer wutu.document{
        @supports (width: calc(sibling-index() * 1px)) and (width: calc(sibling-count() * 1px)) {
            body {
                display: grid;
                width: 100%;
                height: 100vh;
                align-items: center;
                justify-items: center;
                --input-accent: none;
                --input-font-weight: normal;
                overflow: hidden;

                * {
                    box-sizing: border-box;
                    overflow: hidden;
                    font-family: Monaco;
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

                * { display: none ;}

                &::after {
                    text-align: center;
                    align-self: center;
                    text-wrap: balance;
                    content: "Use a real browser instead of a broken toy";
                }
            }
        }
    }`,document.head.append(a)}}),Ne=((a,p)=>a[p]),Te=((a,p,h)=>{a[p]=h}),We=(a=>globalThis[a]),Ie=((a,p)=>a[p]()),_e=(a=>{if(a===document.documentElement)return;let p=a.querySelector(":scope>head")??a.insertBefore(document.createElement("head"),a.firstChild);for(let h of document.head.querySelectorAll("style"))p.append(h);document.replaceChild(a,document.documentElement)}),Ce=(()=>{globalThis.__utuWutu??=(function(){let p=new WeakMap,h=new WeakMap;function E(e,t=!0){if(e.pending)return t?[e.start,...e.pending,e.end]:e.pending;let n=[];for(let o=t?e.start:e.start.nextSibling;o;o=o.nextSibling){if(o===e.end){t&&n.push(o);break}n.push(o)}return n}function N(e){if(Array.isArray(e))return e.every(N);let t=p.get(e);return t?t.start.isConnected&&t.end.isConnected:!!e?.isConnected}function _(e){let t=p.get(e);return t?E(t,!1).flatMap(n=>n.nodeType===1?[n,...n.querySelectorAll("[data-wutu]")]:[]):e?.querySelectorAll?.("[data-wutu]")??[]}function P(){let e=b.at(-1),t=0,n=!1,o=!1;for(let c=0;c<m.length;c++)m[c].global&&(t=c,n=m[c].depth===b.length),m[c].explicit&&(o=m[c].depth===b.length);let r=e?m.slice(t).map(c=>`${c.explicit?"k":"c"}${c.value.length}:${c.value}`).join(":"):u?.scope??"",s=`wutu:${f.h}:${encodeURIComponent(r)}`;Z(e,s,n,o);let l=c=>{let g=new Map;for(let S of c)if(S.nodeType===8&&S.data.startsWith("wutu:")){let O=g.get(S.data);O||g.set(S.data,O={nodes:[],index:0}),O.nodes.push(S)}return g},w=c=>{let g=c.get(s);for(;g&&g.index<g.nodes.length;){let S=g.nodes[g.index++];if(!e?.used.has(S)&&!x?.used.has(S))return S}},d=e&&w(e.ranges??=l(e.old));if(!d&&!e&&(d=p.get(u?.root)?.start),!d){let c=b[0]?.node;if((!x||x.root!==c)&&(x={root:c,index:null,used:new Set}),!x.comments){let g=[],S=U=>{U.nodeType===8&&(e||!h.has(U))&&g.push(U);for(let ot of U.childNodes??[])S(ot)},O=p.get(c);if(O)for(let U of E(O,!1))S(U);else S(c??document);x.comments=l(g)}d=w(x.comments)}let i=d&&h.get(d);if(!i&&d){let c=d.nextSibling;for(;c&&!(c.nodeType===8&&c.data==="/"+s);)c=c.nextSibling;c&&(i={start:d,end:c,value:document.createDocumentFragment()})}if(!i){let c=document.createDocumentFragment();i={value:c,start:document.createComment(s),end:document.createComment("/"+s)},c.append(i.start,i.end)}p.set(i.value,i),h.set(i.start,i),e&&e.used.add(i.start),x?.used.add(i.start),f.fragment=i,b.push({node:i.value,range:i,old:E(i,!1),used:new Set,wanted:[],byKey:null,keyed:null})}let $=new WeakMap,C=new WeakMap,A=new Set,T=new Map,y=new Set,k=[],M=new WeakSet,Y=null,D=()=>m.map(e=>e.value.length+":"+e.value).join("|"),B=new WeakMap,b=[],u=null,m=[],K=!1,J=0,W=null,je=new Map,x=null;function L(){V.autoSave?.()}function Oe(e){let t=T.get(e)?.deref();t&&(t.dirty=!0,I(t))}let Ue=new Set,Q=new WeakMap;function Re(e,t){Q.set(e,t),e.value!==t&&(e.value=t)}function q(e){let t=B.get(e);return t===void 0&&B.set(e,t=e.getAttribute("data-wutu")),t}function X(e,t,n=null){let o=n?E(n,!1):e.childNodes;if(o.length===t.length){let d=!0;for(let i=0;d&&i<t.length;i++)d=o[i]===t[i];if(d)return}let r=document.activeElement,s=r&&"selectionStart"in r?[r.selectionStart,r.selectionEnd,r.selectionDirection]:null,l=n?n.start.nextSibling:e.firstChild;for(let d of t){if(d===l){l=l.nextSibling;continue}e.moveBefore&&d.parentNode===e?e.moveBefore(d,l):e.insertBefore(d,l)}let w=new Set(t);for(let d of[...o])w.has(d)||d.nodeType===1&&(d.nodeName==="HEAD"||d.hasAttribute("data-wutu-style"))||(u?u.removals.add(d):(H(d),d.remove()));r?.isConnected&&document.activeElement!==r&&(r.focus({preventScroll:!0}),s?.[0]!=null&&r.setSelectionRange(...s))}function Z(e,t,n,o){if(n&&u){if(u.globalClaims.has(t))throw new Error("Duplicate global Wutu key: "+t);u.globalClaims.add(t)}if(o&&e){if(e.keyed??=new Set,e.keyed.has(t))throw new Error("Duplicate Wutu key: "+m.findLast(r=>r.explicit).value);e.keyed.add(t)}}function Pe(e,t,n,o){let r=e?.old[e.wanted.length];if(r?.nodeType===1&&r.localName===n&&q(r)===t&&!e.used.has(r))return r;let s=e&&Be(e).get(t);for(;s&&s.index<s.nodes.length;){let l=s.nodes[s.index++];if(!e.used.has(l)&&l.localName===n)return l}return o?Le(t):void 0}function Be(e){if(e.byKey)return e.byKey;e.byKey=new Map;for(let t of e.old){if(t.nodeType!==1)continue;let n=q(t),o=e.byKey.get(n);o||e.byKey.set(n,o={nodes:[],index:0}),o.nodes.push(t)}return e.byKey}function Le(e){if(u){if(!u.globalNodes){u.globalNodes=new Map;for(let t of _(u.root))u.globalNodes.set(q(t),t)}return u.globalNodes.get(e)}}function qe(e,t){let n=b[0]?.node;if(x?.root!==n&&(x={root:n,index:null,used:new Set}),!x.index){x.index=new Map;for(let r of _(n)){let s=q(r);x.index.has(s)||x.index.set(s,r)}}let o=x.index.get(e);if(!(!o||o.localName!==t||x.used.has(o)))return x.used.add(o),o}function z(e,t,n,o,r){let s=b.at(-1),l=e+(t?":"+t:""),w=!1,d=!1;if(m.length){let c=0;for(let g=0;g<m.length;g++)m[g].global&&(c=g,w=m[g].depth===b.length),m[g].explicit&&(d=m[g].depth===b.length);for(let g=c;g<m.length;g++){let S=m[g];l+=`:${S.explicit?"k":"c"}${S.value.length}:${S.value}`}}Z(s,l,w,d);let i=Pe(s,l,n,w);if(r&&s?i??=qe(l,n):i&&u?.retained.add(i),s||(i=u?.root??document.querySelector(`[data-wutu-root="${e}"][data-wutu-prerender]`)),i?.hasAttribute("data-wutu-prerender")){i.removeAttribute("data-wutu-prerender");for(let c of[i,...i.querySelectorAll("[data-wutu-pending]")])!c.hasAttribute("data-wutu-pending")||c.parentNode?.closest("[data-wutu-lazy]")||(c.disabled=!1,c.removeAttribute("data-wutu-pending"))}return(!i||i.localName!==n)&&(i=o()),s&&s.used.add(i),s&&!r&&(s.wanted.push(i),s.appended?.add(i)),B.get(i)!==l&&(i.setAttribute("data-wutu",l),B.set(i,l)),s||(i.getAttribute("data-wutu-root")!==e&&i.setAttribute("data-wutu-root",e),u&&(u.root=i)),i}function ee(e,t,n){let o=$.get(e),r=o?null:new Set([...e.attributes].map(s=>s.name).filter(s=>n?n.has(s):!s.startsWith("data-wutu")&&!t.includes(s)));return b.push({node:e,meta:o,before:r,old:e.childNodes,used:new Set,wanted:[],attrs:null,byKey:null,keyed:null}),e}function Fe(e,t,n,o){return ee(z(n,o,e,()=>t?document.createElementNS("http://www.w3.org/2000/svg",e):document.createElement(e)),[])}let te=new WeakMap;function ne(e,t){let n=te.get(e);return n||te.set(e,n=De(e,t)),n}function De(e,t){let n=([o,r,...s],l)=>{l=l||o==="svg";let w=l?document.createElementNS("http://www.w3.org/2000/svg",o):document.createElement(o);for(let i in r)oe(w,i,r[i]);let d=l&&o!=="foreignObject";for(let i of s)w.append(typeof i=="string"?i:n(i,d));return w};return[n(e,t),Object.keys(e[1])]}function v(e){let t=b.at(-1),n=p.get(e);if(n||Array.isArray(e)||e?.nodeType===11){for(let s of n?E(n):Array.isArray(e)?e:[...e.childNodes])v(s);return}if(e?.nodeType){t.appended??=new Set(t.wanted),t.appended.has(e)||(t.appended.add(e),t.used.add(e),t.wanted.push(e)),u?.retained.add(e);return}let o=String(e??""),r=t.old[t.wanted.length];!r||r.nodeType!==3||t.used.has(r)?r=document.createTextNode(o):r.data!==o&&(r.data=o),t.used.add(r),t.wanted.push(r)}function F(e,t,n){if((b.at(-1).attrs??=new Set).add(t),n===null||n===!1||!re(e,t,n)){e.removeAttribute(t);return}let o=n===!0?"":String(n);e.getAttribute(t)!==o&&oe(e,t,o)}function oe(e,t,n){let o={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"}[t.split(":",1)[0]];o&&t.includes(":")?e.setAttributeNS(o,t,n):e.setAttribute(t,n)}let Ke=new Set(["href","xlink:href","src","action","formaction","poster","cite","data","background","codebase","longdesc","manifest"]),Je=new Set(["ping","srcset","imagesrcset"]);function re(e,t,n){return t=t.toLowerCase(),t==="srcdoc"?!1:n===!0?!0:(n=String(n),Ke.has(t)?ie(e,t,n):Je.has(t)?n.split(/[ ,]+/).every(o=>ie(e,t,o)):t!=="content"||e.localName!=="meta"||!/javascript:|vbscript:|data:/.test(se(n)))}function se(e,t=1/0){let n="";for(let o of e)if(o>" "&&(n+=o).length>=t)break;return n.toLowerCase()}function ie(e,t,n){let o=se(n,16),r=e.localName;return/^(java|vb)script:/.test(o)?!1:!o.startsWith("data:")||t==="href"&&(r==="a"||r==="area")&&e.hasAttribute("download")?!0:o.startsWith("data:image/svg")?r==="img"||r==="image":/^data:(image|audio|video)[/]/.test(o)}function ze(e,t,n){re(e,t,n)?e[t]=n:e.removeAttribute(t.toLowerCase())}function ae(e,t,n){if(t==="mount"){if(M.has(e))return;M.add(e);let l=u;queueMicrotask(()=>{let w=W;W=[e,l];try{n(new Event("mount"))}finally{W=w}L(),l&&I(l)});return}let o=t[0]==="~";o&&(t=t.slice(1));let r=C.get(e);r||C.set(e,r=new Map);let s=r.get(t);s||(s={handlers:[],generation:-1,view:u},r.set(t,s),e.addEventListener(t,l=>{let w=!1,d=W;W=[e,s.view];try{for(let[i,c]of[...s.handlers]){c||(w=!0);let g=i(l);g?.then&&g.then(R,S=>{R(),setTimeout(()=>{throw S})})}}finally{W=d,w&&(L(),s.view&&I(s.view))}})),s.generation!==J&&(s.handlers=[],s.generation=J),s.handlers.push([n,o]),s.view=u}function ce(){let e=b.pop(),t=e.node,n=e.attrs??Ue;if(t.hasAttribute("data-wutu-unmanaged"))return e.meta||t.replaceChildren(),$.set(t,{...$.get(t),attrs:n}),t;let o=e.meta;for(let s of o?o.attrs:e.before)n.has(s)||t.removeAttribute(s);o?o.attrs=n:$.set(t,{attrs:n}),X(t,e.wanted);let r=Q.get(t);return r!==void 0&&t.value!==r&&(t.value=r),t}let le=new Map,ue=["end"],f=null;function Ge(e){let t=le.get(e);if(!t){let n=2166136261;for(let o=0;o<e.length;o++)n=Math.imul(n^e.charCodeAt(o),16777619);le.set(e,t=[JSON.parse(e),(n>>>0).toString(36)])}f={h:t[1],nodes:[],stack:[{ops:t[0],pc:0,kind:"top"}],outer:f,pending:null,depth:b.length,fragment:null}}let fe=new WeakMap;function He(e,t){let n=fe.get(e);n||fe.set(e,n=[]);let o=n[t];if(!o){o=n[t]=new Set;for(let r=t;r<e.length;r++){let[s,l]=e[r];if(s==="a"||s==="b")o.add(l);else if(s==="m")o.add("class");else if(s!=="n"&&s!=="y")break}}return o}function j(){for(;;){let e=f.stack.at(-1);if(e.pc>=e.ops.length){if(e.kind==="arm"){f.stack.pop();continue}return e.kind==="body"?ue:null}let t=e.ops[e.pc++];switch(t[0]){case"r":P();break;case"s":{let[n]=ne(t[2],!!t[3]);f.nodes[t[1]]=z(`v${f.h}:${t[1]}`,"",n.localName,()=>n.cloneNode(!0),b.length===f.depth);break}case"o":{let[n,o]=ne(t[2],!!t[3]);f.nodes[t[1]]=ee(z(`v${f.h}:${t[1]}`,"",n.localName,()=>n.cloneNode(!1),b.length===f.depth),o,He(e.ops,e.pc));break}case"c":ce();break;case"t":v(t[1]);break;default:return t}}}function Ve(e){if(f?.pending){f.pending=null,v(e),m.pop();return}if(!f){v(e),m.pop();return}let t=j(),n=b.at(-1)?.node;switch(t[0]){case"a":F(n,t[1],e);break;case"m":F(n,"class",t[1]+e);break;case"b":F(n,t[1],!!e);break;case"y":(b.at(-1).attrs??=new Set).add("style"),n.style.setProperty(t[1],e);break;case"w":v(e);break;case"v":ae(f.nodes[t[1]],t[2],e);break;default:throw new Error("Wutu: a value where the template has "+JSON.stringify(t?.[0]))}}function Ye(){let e=j();m.push({value:`call:${f.h}:${e[1]}`,explicit:!1}),f.pending=e}function Qe(e){let t=j();f.stack.push({ops:t[0]==="k"?t[1][e]:e?t[1]:t[2],pc:0,kind:"arm"})}function de(){let e=j();if(e!==ue)return[e,null];let t=f.stack.at(-1);return m.pop(),t.loop[1]===0&&m.pop(),[t.loop,t]}function Xe(e){let[t,n]=de();n?n.pc=0:f.stack.push({ops:t[3],pc:0,kind:"body",loop:t});let o=String(e),r=t[1];r===0?(m.push({value:`loop:${f.h}:${t[2]}`,explicit:!1}),m.push({value:o,explicit:!1})):m.push({value:o,explicit:!0,global:r===2,depth:b.length})}function Ze(){let[,e]=de();e&&f.stack.pop()}function et(){return f.nodes[j()[1]]}function tt(){for(;j()!==null;);let e=f.nodes[0];if(f.fragment){let t=b.pop(),n=f.fragment;if(X(n.start.parentNode,t.wanted,n),u&&(n.pending=t.wanted,(u.pendingRanges??=new Set).add(n)),e=n.value,f.depth===0)for(let o of t.wanted)o.nodeType===1&&o.setAttribute("data-wutu-root",`fragment:${f.h}`)}return f=f.outer,f||(x=null),e}function G(e){let t=[b,u,m,x,f],n=document.activeElement;e.cleanupIndex=0,e.cleanupCallbacks??=[],e.intervalsSeen=new Set,e.removals=new Set,e.pendingRanges=null,e.retained=new Set,e.globalNodes=null,e.globalClaims=new Set,b=[],u=e,m=[],x=null,J++;try{e.root=e.render();for(let o of e.cleanupCallbacks.splice(e.cleanupIndex))o();for(let[o,r]of e.effects)!r.node&&!e.intervalsSeen.has(o)&&(clearInterval(r.id),e.effects.delete(o));for(let o of e.removals)e.retained.has(o)||(H(o),o.remove());n?.isConnected&&document.activeElement!==n&&n.focus({preventScroll:!0})}finally{if([b,u,m,x,f]=t,e.globalNodes=null,e.pendingRanges)for(let o of e.pendingRanges)o.pending=null;e.pendingRanges=null,e.removals.clear(),e.retained.clear()}return e.root}function nt(e,t=""){if(u&&!t)return e();if(t){let s=T.get(t)?.deref();if(s&&N(s.root))return s.dirty&&(s.dirty=!1,G(s)),s.root}let n={render:e,root:null,scope:t,dirty:!1,cleanupCallbacks:[],effects:new Map},o=G(n);A.add(new WeakRef(n)),t&&T.set(t,new WeakRef(n));let r=p.get(o)?.start??o;return $.set(r,{...$.get(r),view:n}),o}function pe(){K=!1;let e=[...y];y.clear();for(let t of e)N(t.root)&&(t.dirty=!1,G(t));for(let t of k.splice(0))t()}function R(){for(let e of A){let t=e.deref();if(!t){A.delete(e);continue}N(t.root)&&y.add(t)}L(),pe()}function I(e){e&&y.add(e),!K&&(K=!0,queueMicrotask(pe))}function H(e){let t=$.get(e)?.view;if(t){for(let n of t.cleanupCallbacks.splice(0))n();for(let n of t.effects.values())clearInterval(n.id);t.effects.clear(),t.scope&&T.delete(t.scope)}for(let n of e.childNodes??[])H(n)}globalThis.addEventListener?.("hashchange",R),globalThis.addEventListener?.("popstate",R);let V={enter:Fe,append:v,attr:F,url:ze,listen:ae,leave:ce,mount:nt,refresh:R,invalidate:Oe,selectValue:Re,here:D,put:Ve,begin:Ge,slot:Ye,arm:Qe,item:Xe,end:Ze,node:et,done:tt,nodes(e){let t=p.get(e);return t?E(t):Array.isArray(e)?e.flatMap(V.nodes):e?.nodeType===11?[...e.childNodes]:[e]},storageError:"",notify(){for(let e of A){let t=e.deref();t&&N(t.root)&&I(t)}},interval(e,t,n){let[o,r]=u?[null,u]:W??[];if(!o){if(!r)return;r.intervalsSeen.add(e)}let s=r?.effects??je,l=s.get(e);if(l?.node===o){l.callback=n;return}l&&clearInterval(l.id);let w={callback:n,id:0,node:o};w.id=setInterval(()=>{if(o&&!o.isConnected){clearInterval(w.id),s.delete(e);return}w.callback(),L(),I(r)},Math.max(16,t)),s.set(e,w)},memoHit(e){if(!e||!u)return!1;let t=u.memo?.get(D());return t?.key!==e||!N(t.node)?!1:(Y=t.node,!0)},memoLast(){return Y},memoKeep(e,t){e&&u&&(u.memo??=new Map).set(D(),{key:e,node:t})},after(e){k.push(e),I()},focus(e){k.push(()=>document.getElementById(e)?.focus()),I()},cleanup(e){u&&(u.cleanupCallbacks[u.cleanupIndex++]=e)},pushGlobal:e=>m.push({value:String(e),explicit:!0,global:!0,depth:b.length}),pushKey:e=>m.push({value:String(e),explicit:!0,depth:b.length}),pushCall:e=>m.push({value:e,explicit:!1}),popKey:()=>m.pop()};return V})()}),Me=(a=>p=>(h=>typeof h=="string"?h:(()=>{throw new TypeError(`Wrong type from JavaScript: a Str, not ${h===null?"null":h instanceof Promise?"a Promise (await it: Promise[Str])":typeof h}`)})())(a(p)))(a=>a.trim()),ve=(a=>p=>(h=>typeof h=="string"?h:(()=>{throw new TypeError(`Wrong type from JavaScript: a Str, not ${h===null?"null":h instanceof Promise?"a Promise (await it: Promise[Str])":typeof h}`)})())(a(p)))(a=>a.toLowerCase());try{let{instance:a}=await WebAssembly.instantiateStreaming(fetch(new URL("./app.wasm",import.meta.url)),{es:[ge,be,ye,we,xe,Se,ke,$e,Ae,Ee,Ne,Te,We,Ie,_e,Ce,Me,ve],utu:{closure_new:he}},{builtins:["js-string"],importedStringConstants:"'"}),p=a.exports;document.querySelectorAll("[data-utu-static]").forEach(h=>h.remove()),await p.main?.(),document.documentElement.setAttribute("data-utu-ready","")}catch(a){document.documentElement.setAttribute("data-utu-error",String(a.message??a));let p=document.createElement("p");p.setAttribute("role","status"),p.textContent="Interactive tools could not start. The page is still available to read. Try reloading in a browser with WebAssembly GC support.",document.body.append(p),console.error(a)}
