/* Princess Lizzy — extras: new chapter themes and scenes, mini-games, wardrobe + pet,
   daily notes, open-when letters, date surprises, her reply and the keepsake image.
   All personal text comes from the encrypted data (D); nothing readable lives here. */
const PALM=sprite(["..hh..hh..",".hhhhhhhh.","hhhkhhkhhh","hh.kttk.hh","h..kttk..h","...kttk...","...kTtk...","...kttk...","...kTtk...","...kkkk..."]);
const GIFT=sprite(["..rr.rr.","...rrr..","kkkkkkkk","kmmrrmmk","krrrrrrk","kmmrrmmk","kmmrrmmk","kkkkkkkk"]);
const LANTERN=sprite(["..kk..",".kyyk.","kyooyk","kyyyyk","kyooyk","kyyyyk",".kyyk.","..kk..","..rr.."]);
const CAKE=sprite(["....y.....","....r.....","..wwwwww..",".wmwmwmww.",".wwwwwwww.","kttttttttk","kTTTTTTTTk","kkkkkkkkkk"]);
const CAT=sprite(["k...k...","kk.kk...","kooook.k","kwokwo.k","kooooook",".koooook",".kk..kk."]);
const DOG=sprite(["kk...kk.","ktkkktk.","kttttttk","kwtkwttk","kttkkttk",".kttttk.",".kk..kk."]);
const BALLOON=sprite([".kkkk.","krrrrk","krwrrk","krrrrk","krrrrk",".krrk.","..kk..","..k...","..k..."]);
// one theme per chapter: map colours + what a blocked tile looks like
const TH=[{cls:'c0',block:TREE},{cls:'c1',block:TREE},{cls:'c2',block:ROCK},{cls:'c4',block:PALM},{cls:'c5',block:GIFT},{cls:'c6',block:LANTERN},{cls:'c3',block:TREE}];

document.head.insertAdjacentHTML('beforeend',`<style>
.c4 .t{background:#e8d28a}.c4 .t:nth-child(odd){background:#dfc67a}.c4 .t.w{background-color:#2f8fd6}
.c5 .t{background:#c8508c}.c5 .t:nth-child(odd){background:#bd4783}
.c6 .t{background:#1d1b45}.c6 .t:nth-child(odd){background:#1a1840}
#pet{position:absolute;width:11.11%;aspect-ratio:1;pointer-events:none;z-index:2;transition:left .14s steps(3),top .14s steps(3);display:flex;align-items:flex-end;justify-content:center}
#pet svg{width:62%;height:auto;filter:drop-shadow(2px 2px 0 #000)}
#g2 .card,#ow .card,#ward .card,#reply .card{text-align:center;max-height:94dvh;overflow:auto}
#g2a{margin:10px auto 0;position:relative}
.dg{display:grid;border:3px solid #000;margin:0 auto;width:min(100%,330px)}
.dg div{aspect-ratio:1;display:flex;align-items:center;justify-content:center;background:#16306a}
.dg div svg{width:80%;height:auto}.dg .shore{background:#3f8a4e}.dg .wave{background:#7fc8ff;box-shadow:inset 0 0 0 3px #fff}
.mg{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;width:min(100%,340px);margin:0 auto}
.mg button{aspect-ratio:1;padding:6px;display:flex;align-items:center;justify-content:center}
.mg button svg{width:80%;height:auto;visibility:hidden}.mg button.fl svg{visibility:visible}.mg button.fl{background:var(--panel2)}.mg button.ok{background:#2a7a3e}
.cg{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;width:min(100%,330px);margin:0 auto}
.cg button{aspect-ratio:1;padding:4px;background:var(--panel2);box-shadow:inset 0 0 0 2px var(--edge);display:flex;align-items:center;justify-content:center}
.cg button svg{width:80%;height:auto}.cg button.on{background:var(--accent)}.cg button.rock{background:#2c3340}
#g2c{display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap}
#g2m{min-height:24px;color:var(--gold);margin-top:8px}
.owl button{display:flex;align-items:center;gap:10px;width:100%;margin-bottom:8px;text-align:left;text-transform:none;font-family:VT323,monospace;font-size:21px;line-height:1.05}
.owl button svg{width:34px;height:auto;flex:none}.owl button.seen{opacity:.6}
#ward .pv{width:120px;margin:0 auto 6px;filter:drop-shadow(4px 4px 0 #000)}#ward .pv svg{width:100%;height:auto}
.wrow{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:6px}
.wrow button{width:44px;height:44px;padding:0;font-size:8px;color:#000}.wrow button.sel{border-color:#fff;box-shadow:0 0 0 3px var(--gold)}.wrow button:disabled{opacity:.35}
.wrow.pets button{width:auto;padding:0 10px;font-size:9px;color:#fff}
#reply textarea{width:100%;height:140px;font-family:VT323,monospace;font-size:22px;color:var(--text);background:var(--bg);border:3px solid #000;box-shadow:inset 3px 3px 0 #000,0 0 0 2px var(--edge);padding:8px;resize:none}
#side .row2{display:flex;gap:6px}#side .row2 button{flex:1}
</style>`);
document.body.insertAdjacentHTML('beforeend',`
<div class="overlay" id="g2"><div class="card"><h2 id="g2t"></h2><p class="tag" id="g2i" style="margin:0"></p><div id="g2a"></div><div id="g2m"></div><div id="g2c"></div></div></div>
<div class="overlay" id="ow"><div class="card"><h2>Buksan Kapag…</h2><div class="owl" id="owl"></div><button class="primary big" type="button" id="owx">Isara</button></div></div>
<div class="overlay" id="ward"><div class="card"><h2>Aparador ni Lizzy</h2><div class="pv" id="wpv"></div><p class="tag" id="wtag" style="margin:0 0 8px"></p>
  <div class="ph">Damit</div><div class="wrow" id="wd"></div><div class="ph">Korona</div><div class="wrow" id="wc"></div><div class="ph">Buhok</div><div class="wrow" id="wh"></div>
  <div class="ph">Alaga</div><div class="wrow pets" id="wp"></div><button class="primary big" type="button" id="wx">Ayos na</button></div></div>
<div class="overlay" id="reply"><div class="card"><h2 id="rt"></h2><p class="tag" id="rp" style="margin:0 0 10px"></p><textarea id="rtx" maxlength="1000"></textarea>
  <div class="err" id="rmsg" style="color:var(--gold)"></div><button class="primary big" type="button" id="rsend">Ipadala kay Paul</button><button class="big" type="button" id="rskip">Mamaya na</button></div></div>`);
$('#side').insertAdjacentHTML('beforeend','<span class="row2"><button class="small" type="button" id="bWard">Aparador</button><button class="small" type="button" id="bOw">Buksan Kapag</button></span>');
$('#bClose').insertAdjacentHTML('beforebegin','<button class="alt big" type="button" id="bKeep">I-save bilang larawan</button>');

/* ---------- wardrobe + pet ---------- */
const PR_ROWS=["...Y.YY.Y...","...YYYYYY...","..kRRRRRRk..",".kRssssssRk.",".kRskssksRk.",".kRssssssRk.",".kRRsrrsRRk.","..kRDDDDRk..","..kDDAADDk..",".kDDDDDDDDk.",".kDDDDDDDDk.","..kkkkkkkk.."];
const DRESSES=['#ff5df0','#5aa9ff','#9d6bff','#7dffb0','#ff4d6d','#ffd66b'],CROWNS=['#ffd66b','#dfe6f0','#ff8fc0'],HAIRS=['#8a5a2b','#2b2b3a','#f2c14e','#b5462a'];
const look=()=>{const L=P.look||(P.look={d:0,c:0,h:0,p:0});L.d=Math.abs(L.d|0)%DRESSES.length;L.c=Math.abs(L.c|0)%CROWNS.length;L.h=Math.abs(L.h|0)%HAIRS.length;L.p=Math.abs(L.p|0)%3;return L};
function mkPrincess(L){const map={Y:CROWNS[L.c],R:HAIRS[L.h],D:DRESSES[L.d],A:'#ffffff'};let s='';
  PR_ROWS.forEach((row,y)=>{for(let x=0;x<row.length;x++){const ch=row[x];if(ch==='.')continue;let x2=x;while(row[x2+1]===ch)x2++;
    s+=`<rect x="${x}" y="${y}" width="${x2-x+1}" height="1.03" fill="${map[ch]||Arcade.PAL[ch]}"/>`;x=x2}});
  return `<svg viewBox="0 0 12 12" shape-rendering="crispEdges">${s}</svg>`}
let petEl=null;
function spawnPet(){if(petEl)petEl.remove();petEl=null;const p=look().p;if(!p||!meEl||!meEl.isConnected)return;petEl=el('div');petEl.id='pet';petEl.innerHTML=p===1?CAT:DOG;$('#map').append(petEl);place(petEl,pos.x,pos.y)}
function petFollow(prev){if(petEl)place(petEl,prev.x,prev.y)}
function applyLook(){PRINCESS=mkPrincess(look());if(meEl&&meEl.isConnected){meEl.innerHTML=PRINCESS;spawnPet()}}
function openWard(){if(!D||busy)return;const n=P.got.length,L=look();
  const draw=()=>{$('#wpv').innerHTML=mkPrincess(L);$('#wtag').textContent='Mga pusong nakuha: '+n+'. Mas maraming puso, mas maraming mabubuksan.';
    const row=(id,arr,key,stepN)=>{const b=$(id);b.innerHTML='';arr.forEach((c,i)=>{const need=i*stepN,bt=el('button',L[key]===i?'sel':'');bt.type='button';bt.style.background=c;bt.disabled=n<need;
      if(bt.disabled){bt.textContent=need;bt.title='Kailangan ng '+need+' puso'}bt.onclick=()=>{L[key]=i;save();applyLook();draw()};b.append(bt)})};
    row('#wd',DRESSES,'d',3);row('#wc',CROWNS,'c',6);row('#wh',HAIRS,'h',4);
    const pb=$('#wp');pb.innerHTML='';[['Wala',0,0],['Pusa',1,2],['Aso',2,5]].forEach(([t,i,need])=>{const bt=el('button',L.p===i?'sel':'',n<need?t+' ('+need+' puso)':t);bt.type='button';bt.disabled=n<need;
      bt.onclick=()=>{L.p=i;save();applyLook();draw()};pb.append(bt)})};
  draw();$('#ward').classList.add('on')}
$('#bWard').onclick=openWard;$('#wx').onclick=()=>$('#ward').classList.remove('on');

/* ---------- scenes for the new chapters ---------- */
function chapterScene(n){if(n<3)return chPanel(n);if(n===6)return chPanel(3);const C=D.cine.ch2;return[
  {bg:'day',cap:C[0],build:st=>{A(st,'',SUN,'right:8%;top:8%;width:12%');A(st,'sea','','height:42%');A(st,'ground','','background:#e8d28a;box-shadow:inset 0 5px 0 #fff3c0');
    A(st,'',PALM,'left:4%;bottom:20%;width:16%');A(st,'',PALM,'right:6%;bottom:20%;width:16%');A(st,'meetL',PRINCESS,'bottom:20%;width:12%');A(st,'meetR',PRINCE,'bottom:20%;width:12%')}},
  {bg:'',cap:C[1],build:st=>{A(st,'','','inset:0;background:#8a2356');A(st,'ground','','background:#c8508c;box-shadow:inset 0 5px 0 #ff8fc0');A(st,'',CAKE,'left:41%;bottom:20%;width:18%');
    A(st,'bob',PRINCESS,'left:22%;bottom:20%;width:13%');A(st,'bob',PRINCE,'right:22%;bottom:20%;width:13%');[10,28,64,82].forEach((x,i)=>A(st,'up',BALLOON,`left:${x}%;bottom:30%;width:6%;animation-delay:${i*.5}s`))}},
  {bg:'night',cap:C[2],build:st=>{stars(st);A(st,'bob',MOON,'right:10%;top:8%;width:13%');A(st,'ground lav');A(st,'bob',PRINCESS,'left:36%;bottom:20%;width:13%');A(st,'bob',PRINCE,'left:51%;bottom:20%;width:13%');
    [12,30,66,84].forEach((x,i)=>A(st,'up',LANTERN,`left:${x}%;bottom:26%;width:5%;animation-delay:${i*.6}s`))}}][n-3]}

/* ---------- mini-games (one after each chapter) ---------- */
const G2=(t,i)=>{busy=true;$('#g2t').textContent=t;$('#g2i').textContent=i;$('#g2a').innerHTML='';$('#g2c').innerHTML='';$('#g2m').textContent='';$('#g2').classList.add('on');return $('#g2a')};
const G2done=async(icon,label,title,line,res)=>{$('#g2').classList.remove('on');hearts(3);await card({icon,label,title,lines:[line],ok:'Susunod na kabanata',sfx:'good'});res()};
function miniGame(ch){return [dodgeGame,catchGame,()=>memoryGame('memory'),connectGame,balloonGame,()=>memoryGame('memory2')][ch]()}
function dodgeGame(){return new Promise(res=>{const T=D.games.dodge,area=G2('Ihatid ang liham!',T.intro),C=7,R=8;let lx=3,ly=R-1,tick=0,done=false;
  const rows={};for(let y=1;y<R-1;y++)rows[y]={dir:y%2?1:-1,every:y%3===0?1:2,cells:[(y*2)%C,(y*2+3)%C]};
  const g=el('div','dg');g.style.gridTemplateColumns='repeat('+C+',1fr)';const cells=[];for(let i=0;i<C*R;i++){const d=el('div');cells.push(d);g.append(d)}area.append(g);
  const draw=()=>{for(let y=0;y<R;y++)for(let x=0;x<C;x++){const d=cells[y*C+x];d.className=(y===0||y===R-1)?'shore':(rows[y].cells.includes(x)?'wave':'');
    d.innerHTML=(x===lx&&y===ly)?ENVELOPE:(y===0&&x===3)?PRINCE:(y===R-1&&x===3)?PRINCESS:''}};
  const hit=()=>!!rows[ly]&&rows[ly].cells.includes(lx);
  const back=()=>{lx=3;ly=R-1;SFX.play('deny');$('#g2m').textContent=T.hit};
  const key=e=>{const d={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];if(d){e.preventDefault();mv(d[0],d[1])}};
  const finish=()=>{done=true;clearInterval(iv);removeEventListener('keydown',key);G2done(ENVELOPE,'NAIHATID!','Nakarating ang liham',T.done,res)};
  const mv=(dx,dy)=>{if(done)return;lx=Math.max(0,Math.min(C-1,lx+dx));ly=Math.max(0,Math.min(R-1,ly+dy));SFX.play('step');$('#g2m').textContent='';if(hit())back();draw();if(ly===0)finish()};
  const iv=setInterval(()=>{tick++;for(const y in rows){const r=rows[y];if(tick%r.every===0)r.cells=r.cells.map(c=>(c+r.dir+C)%C)}if(hit())back();draw()},480);
  addEventListener('keydown',key);
  [['◀',-1,0],['▲',0,-1],['▼',0,1],['▶',1,0]].forEach(([t,dx,dy])=>{const b=el('button','primary',t);b.type='button';b.onclick=()=>mv(dx,dy);$('#g2c').append(b)});draw()})}
function memoryGame(k){return new Promise(res=>{const T=D.games[k],area=G2('Laro ng Alaala',T.intro),icons=[HEART,FLOWER,ENVELOPE,MOON,SUN,STAR],deck=Arcade.shuffle([0,1,2,3,4,5,0,1,2,3,4,5]),g=el('div','mg');let open=[],lock=false,ok=0;
  deck.forEach(v=>{const b=el('button');b.type='button';b.innerHTML=icons[v];b.setAttribute('aria-label','Baraha');b.onclick=()=>{if(lock||b.classList.contains('fl'))return;b.classList.add('fl');SFX.play('step');open.push([b,v]);
    if(open.length===2){const [a,c]=open;open=[];if(a[1]===c[1]){a[0].classList.add('ok');c[0].classList.add('ok');SFX.play('pop');if(++ok===6)setTimeout(()=>G2done(HEART,'MAGKAPARES!','Lahat ng pares',T.done,res),500)}
      else{lock=true;setTimeout(()=>{a[0].classList.remove('fl');c[0].classList.remove('fl');lock=false},750)}}};g.append(b)});area.append(g)})}
function connectGame(){return new Promise(res=>{const T=D.games.connect,area=G2('Idugtong ang mga puso',T.intro),L=["S..#T",".#h..","...#h","h#...","....."],g=el('div','cg'),bs=[];let path=[[0,0]],done=false;
  const inP=(x,y)=>path.some(p=>p[0]===x&&p[1]===y);
  const draw=()=>{bs.forEach((b,i)=>{const x=i%5,y=Math.floor(i/5),c=L[y][x];b.className=(c==='#'?'rock ':'')+(inP(x,y)?'on':'');
    b.innerHTML=c==='#'?ROCK:c==='S'?PRINCESS:c==='T'?PRINCE:(c==='h'&&!inP(x,y))?HEART:''})};
  const tap=(x,y)=>{if(done)return;const c=L[y][x],[ex,ey]=path[path.length-1];$('#g2m').textContent='';
    if(path.length>1&&path[path.length-2][0]===x&&path[path.length-2][1]===y){path.pop();SFX.play('step')}
    else if(c!=='#'&&!inP(x,y)&&Math.abs(x-ex)+Math.abs(y-ey)===1){
      if(c==='T'&&path.filter(p=>L[p[1]][p[0]]==='h').length<3){SFX.play('deny');$('#g2m').textContent=T.need}
      else{path.push([x,y]);SFX.play(c==='h'?'pop':'step');if(c==='T'){done=true;draw();setTimeout(()=>G2done(HEART,'NAGDUGTONG!','Dalawang puso, iisang daan',T.done,res),400);return}}}
    draw()};
  for(let i=0;i<25;i++){const b=el('button');b.type='button';b.onclick=()=>tap(i%5,Math.floor(i/5));bs.push(b);g.append(b)}area.append(g);
  const r=el('button','small','Ulitin');r.type='button';r.onclick=()=>{if(!done){path=[[0,0]];draw()}};$('#g2c').append(r);draw()})}
function balloonGame(){return new Promise(res=>{const T=D.games.balloons,area=G2('Mga Lobo!',T.intro),need=8;let got=0,stop=false;const sky=el('div');sky.id='sky';area.append(sky);$('#g2m').textContent='0 / '+need;
  const spawn=()=>{if(stop)return;const b=el('button');b.type='button';b.innerHTML=BALLOON;b.style.left=(4+Math.random()*78)+'%';b.setAttribute('aria-label','Lobo');
    const hit=()=>{if(b.dataset.x||stop)return;b.dataset.x=1;got++;SFX.play('pop');Arcade.burstAt(b,['#ff4d6d','#ffd66b','#6ff7ff'],14);b.remove();$('#g2m').textContent=got+' / '+need;
      if(got>=need){stop=true;clearInterval(iv);G2done(CAKE,'HAPPY BIRTHDAY!','Maligayang kaarawan',T.done,res)}};
    b.onpointerdown=hit;b.onclick=hit;b.addEventListener('animationend',()=>b.remove());sky.append(b)};
  spawn();const iv=setInterval(spawn,650)})}

/* ---------- daily note + date surprises (shown right after she unlocks) ---------- */
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
async function afterStart(){const t=today();P.days=Array.isArray(P.days)?P.days:[];const isNew=!P.days.includes(t);if(isNew){P.days.push(t);save()}
  const sp=(D.specials||[]).find(s=>s.md&&s.md===t.slice(5));
  if(sp&&P.spSeen!==t){P.spSeen=t;save();
    await cine([{bg:'night',cap:sp.cap,fire:true,last:'Buksan ang liham',build:st=>{stars(st);A(st,'bob',MOON,'left:43%;top:6%;width:14%');A(st,'ground lav');A(st,'bob',PRINCESS,'left:36%;bottom:20%;width:13%');A(st,'bob',PRINCE,'left:51%;bottom:20%;width:13%');
      [14,30,66,82].forEach((x,i)=>A(st,'up',HEART,`left:${x}%;bottom:40%;width:6%;animation-delay:${i*.6}s`))}}]);
    await card({icon:PRINCESS+PRINCE,duo:true,label:sp.name.toUpperCase(),title:sp.title,lines:sp.lines,sfx:'win'})}
  if(isNew&&D.daily&&D.daily.length){const n=P.days.length;await card({label:'ARAW '+n,title:'Liham ngayong araw',lines:[D.daily[(n-1)%D.daily.length]]})}}

/* ---------- open-when letters ---------- */
function openOw(){if(!D||busy)return;P.ow=Array.isArray(P.ow)?P.ow:[];const l=$('#owl');l.innerHTML='';
  D.openWhen.forEach((o,i)=>{const b=el('button',P.ow.includes(i)?'seen':'');b.type='button';b.innerHTML=ENVELOPE;b.append(el('span',null,o.when));
    b.onclick=async()=>{$('#ow').classList.remove('on');if(!P.ow.includes(i)){P.ow.push(i);save()}await card({label:'BUKSAN KAPAG…',title:o.when,lines:o.lines})};l.append(b)});
  $('#ow').classList.add('on')}
$('#bOw').onclick=openOw;$('#owx').onclick=()=>$('#ow').classList.remove('on');

/* ---------- her reply ---------- */
function replyBox(){return new Promise(res=>{busy=true;const R=D.reply;$('#rt').textContent=R.title;$('#rp').textContent=R.prompt;$('#rtx').value=P.reply||'';$('#rmsg').textContent='';$('#rskip').textContent='Mamaya na';$('#reply').classList.add('on');
  const close=()=>{P.reply=$('#rtx').value;save();$('#reply').classList.remove('on');busy=false;res()};
  $('#rskip').onclick=close;
  $('#rsend').onclick=async()=>{const v=$('#rtx').value.trim();if(!v){$('#rtx').focus();return}const text=R.prefix+'\n\n'+v;P.reply=v;save();
    // straight to Paul's Telegram when a bot is set up (token and chat id come from the encrypted data)
    const T=D.telegram;if(T&&T.token&&T.chat){const b=$('#rsend');b.disabled=true;b.textContent='Ipinapadala…';let ok=false;
      try{const r=await fetch('https://api.telegram.org/bot'+T.token+'/sendMessage',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:T.chat,text})});ok=r.ok&&(await r.json()).ok}catch(e){}
      b.disabled=false;b.textContent='Ipadala kay Paul';
      if(ok){SFX.play('good');hearts(3);$('#rmsg').textContent=R.sent||'Naipadala na!';$('#rskip').textContent='Tapos na';return}}
    try{if(navigator.share){await navigator.share({text});return close()}}catch(e){if(e&&e.name==='AbortError')return}
    try{await navigator.clipboard.writeText(text);$('#rmsg').textContent=R.copied;$('#rskip').textContent='Tapos na'}
    catch(e){$('#rmsg').textContent='Piliin at kopyahin ang sinulat mo, tapos ipadala kay Paul.'}}})}

/* ---------- the last scene: light, a pixel portrait of the two of them, thank you ---------- */
document.head.insertAdjacentHTML('beforeend',`<style>
#fin{background:#000;overflow:hidden;transition:background 1.2s}#fin.lit{background:#fff4dc}
#fin .glow{position:absolute;left:50%;top:44%;width:24px;height:24px;margin:-12px;background:radial-gradient(circle,#fffdf5 0,#fff1cf 40%,#ffd9ec 62%,transparent 72%);animation:finglow 3.4s ease-in forwards}
@keyframes finglow{0%{transform:scale(0);opacity:0}12%{opacity:1}100%{transform:scale(260);opacity:1}}
.finbox{position:relative;z-index:2;text-align:center;width:min(92vw,460px);max-height:96dvh;overflow:auto;opacity:0;transition:opacity 2.6s}.finbox.in{opacity:1}
.frame{border:4px solid #000;box-shadow:0 0 0 4px #ffd66b,0 0 0 8px #000;background:#2a1a12;margin:10px auto 22px;width:min(100%,400px)}
.frame canvas{display:block;width:100%;height:auto;image-rendering:pixelated}
.frame .duo{display:flex;justify-content:center;gap:4%;padding:8% 6% 0;background:linear-gradient(#ffc2e0,#ffe9a8)}.frame .duo svg{width:44%;height:auto}
#fint{font-family:'Press Start 2P',monospace;font-size:clamp(12px,4vw,19px);line-height:1.6;color:#7a1f52;text-shadow:2px 2px 0 #ffd66b;min-height:1.7em;margin:0 0 10px}
#finl{font-size:23px;line-height:1.1;color:#3a1638;margin:0 0 10px}#finc2{font-family:'Press Start 2P',monospace;font-size:8px;line-height:1.6;color:#8a4a72;margin:0}
#finl,#finc2,#finb{opacity:0;transition:opacity 1.6s}#finl.in,#finc2.in,#finb.in{opacity:1}
#finb{margin-top:16px}
.spark{position:absolute;z-index:1;width:6px;height:6px;background:#ffd66b;animation:tw 1.3s steps(2) infinite}
.fh{position:absolute;z-index:1;bottom:-40px;width:26px;animation:rise 6s linear infinite}.fh svg{width:100%;height:auto;display:block}
</style>`);
document.body.insertAdjacentHTML('beforeend','<div class="overlay" id="fin"></div>');
function pixelize(im,cv,cfg){const [cx,cy,cw,ch]=cfg.crop||[0,0,1,1],sx=cx*im.naturalWidth,sy=cy*im.naturalHeight,sw=cw*im.naturalWidth,sh=ch*im.naturalHeight,Wp=cfg.px||96,Hp=Math.round(Wp*sh/sw);
  cv.width=Wp;cv.height=Hp;const x=cv.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(im,sx,sy,sw,sh,0,0,Wp,Hp);
  const d=x.getImageData(0,0,Wp,Hp),p=d.data,L=7; // stronger contrast, then a small fixed number of shades per channel = pixel-art look
  for(let i=0;i<p.length;i+=4)for(let k=0;k<3;k++){let v=(p[i+k]-128)*1.18+134;v=Math.max(0,Math.min(255,v));p[i+k]=Math.round(v/255*L)/L*255}
  x.putImageData(d,0,0)}
function thanksScene(){return new Promise(res=>{busy=true;const T=D.thanks||{title:'Thank you for playing',line:'',credit:''},o=$('#fin');const timers=[];
  o.innerHTML='<div class="glow"></div><div class="finbox"><div class="frame" id="finf"></div><h2 id="fint"></h2><p id="finl"></p><p id="finc2"></p><div id="finb"><button class="primary big" type="button" id="finok">💜 Tapos</button></div></div>';
  o.classList.add('on');$('#finl').textContent=T.line;$('#finc2').textContent=T.credit;
  const later=(f,ms)=>timers.push(setTimeout(f,ms));
  const done=()=>{timers.forEach(clearTimeout);o.classList.remove('on','lit');o.innerHTML='';busy=false;res()};$('#finok').onclick=done;
  const reveal=()=>{o.classList.add('lit');$('.finbox').classList.add('in');SFX.play('gate');
    for(let i=0;i<18;i++){const s=el('div','spark');s.style.cssText=`left:${Math.random()*96}%;top:${Math.random()*92}%;animation-delay:${Math.random()*1.3}s`;o.append(s)}
    for(let i=0;i<7;i++){const h=el('div','fh');h.innerHTML=HEART;h.style.cssText=`left:${4+Math.random()*88}%;animation-delay:${i*.85}s`;o.append(h)}
    later(()=>{let n=0;const t=T.title,iv=setInterval(()=>{$('#fint')?($('#fint').textContent=t.slice(0,++n)):clearInterval(iv);if(n>=t.length)clearInterval(iv)},70);timers.push(iv);SFX.play('win')},2400);
    later(()=>$('#finl').classList.add('in'),2400+T.title.length*70+500);
    later(()=>$('#finc2').classList.add('in'),2400+T.title.length*70+2200);
    later(()=>$('#finb').classList.add('in'),2400+T.title.length*70+3600)};
  const drawn=()=>{$('#finf').innerHTML='<div class="duo">'+PRINCESS+PRINCE+'</div>'};
  if(D.photo&&D.photo.src){const cv=document.createElement('canvas'),im=new Image();im.onload=()=>{try{pixelize(im,cv,D.photo);$('#finf').append(cv)}catch(e){drawn()}};im.onerror=drawn;im.src=D.photo.src}else drawn();
  later(reveal,3000)})}

/* ---------- book extras + keepsake image ---------- */
const dailySeen=()=>D.daily.slice(0,Math.min((P.days||[]).length,D.daily.length));
function bookExtras(l){dailySeen().forEach((t,i)=>{const e=el('div','e');e.append(el('b',null,'Araw '+(i+1)),t);l.append(e)});
  (P.ow||[]).forEach(i=>{const o=D.openWhen[i];if(!o)return;const e=el('div','e');e.append(el('b',null,o.when),o.lines.join(' '));l.append(e)});
  if(P.done){const b=el('button','big','Sumulat kay Paul');b.type='button';b.onclick=()=>{$('#book').classList.remove('on');replyBox()};
    const w=el('button','big','Panoorin ang wakas');w.type='button';w.onclick=()=>{$('#book').classList.remove('on');thanksScene()};l.append(b,w)}}
function letterItems(){const out=[];D.chapters.forEach((ch,ci)=>{ch.hearts.forEach((t,i)=>{if(P.got.includes(ci+'-'+i))out.push([ch.title+' · Liham '+(i+1),t])});
    if(ch.secret&&P.got.includes(ci+'-s'))out.push([ch.title+' · Lihim na puso',ch.secret])});
  if(P.done)out.push([D.finale.title,D.finale.lines.join(' ')]);dailySeen().forEach((t,i)=>out.push(['Araw '+(i+1),t]));
  (P.ow||[]).forEach(i=>{const o=D.openWhen[i];if(o)out.push([o.when,o.lines.join(' ')])});return out}
async function keepsake(){const items=letterItems();if(!items.length){SFX.play('deny');return null}
  try{await document.fonts.load('28px VT323');await document.fonts.load('14px "Press Start 2P"')}catch(e){}
  const Wd=900,pad=48,c=document.createElement('canvas'),x=c.getContext('2d'),body='28px VT323, monospace',head='13px "Press Start 2P", monospace';
  const wrap=t=>{x.font=body;const ls=[];let cur='';for(const w of t.split(' ')){const tr=cur?cur+' '+w:w;if(x.measureText(tr).width>Wd-pad*2-32&&cur){ls.push(cur);cur=w}else cur=tr}if(cur)ls.push(cur);return ls};
  const blocks=items.map(([h,t])=>({h,ls:wrap(t)}));let Ht=pad+100;blocks.forEach(b=>Ht+=56+b.ls.length*30+16);Ht+=pad;
  c.width=Wd;c.height=Ht;x.fillStyle='#1a0b1e';x.fillRect(0,0,Wd,Ht);x.strokeStyle='#c8508c';x.lineWidth=8;x.strokeRect(12,12,Wd-24,Ht-24);
  x.textBaseline='top';x.textAlign='center';x.fillStyle='#ffd66b';x.font='22px "Press Start 2P", monospace';x.fillText('Mga Liham ni Paul',Wd/2,pad);
  x.fillStyle='#ffc2e0';x.font=body;x.fillText('para kay Princess Lizzy',Wd/2,pad+40);x.textAlign='left';
  let y=pad+100;for(const b of blocks){const bh=56+b.ls.length*30;x.fillStyle='#260d26';x.fillRect(pad,y,Wd-pad*2,bh);x.fillStyle='#ffd66b';x.font=head;x.fillText(b.h,pad+16,y+14);
    x.fillStyle='#ffffff';x.font=body;b.ls.forEach((l,i)=>x.fillText(l,pad+16,y+40+i*30));y+=bh+16}
  return new Promise(r=>c.toBlob(bl=>{const a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download='mga-liham-ni-paul.png';document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),5000);r({w:c.width,h:c.height,items:items.length,bytes:bl.size})},'image/png'))}
$('#bKeep').onclick=()=>keepsake();
