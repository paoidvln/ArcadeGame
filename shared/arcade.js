/* Pixel Arcade — shared kit: pixel sprites, avatars, profile, sound, music, particles,
   and a host-authoritative turn-based game shell with local + online (PeerJS) rooms.
   A game calls Arcade.run({...}) — see pirates/ and space/ for examples. */
(function(){
'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// fair RNG: crypto + rejection sampling
function rnd(n){const lim=Math.floor(4294967296/n)*n,a=new Uint32Array(1);let x;do{crypto.getRandomValues(a);x=a[0]}while(x>=lim);return x%n}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
const clean=(n,d)=>(String(n||'').replace(/\s+/g,' ').trim().slice(0,14))||d;

/* ---------- pixel sprites ---------- */
const PAL={k:'#12081f',w:'#ffffff',s:'#ffd9b3',y:'#ffd66b',r:'#ff4d6d',g:'#7dff8a',p:'#9d6bff',o:'#ff9a3c',n:'#9a9ab0',b:'#6ff7ff',e:'#2b2b3a',m:'#ff5df0',v:'#5b2fd6',G:'#dffcff',x:'#3a2a55',
  t:'#8a5a2b',T:'#5c3a1a',u:'#2f7fd6',U:'#1b4f96',a:'#e8d28a',A:'#c9a84f',h:'#3fae5a',H:'#2a7a3e',q:'#c2c2d6',Q:'#6b6b85',z:'#ff8a3c',Z:'#b84a1a'};
function shade(hex,f){const n=parseInt(hex.slice(1),16);return 'rgb('+[n>>16,n>>8&255,n&255].map(v=>Math.round(v*f))+')'}
function sprite(rows,color){
  color=color||'#9d6bff';const w=Math.max(...rows.map(r=>r.length));let s='';
  rows.forEach((row,y)=>{for(let x=0;x<row.length;x++){const ch=row[x];if(ch==='.'||ch===' ')continue;
    let x2=x;while(row[x2+1]===ch)x2++;
    const f=ch==='c'?color:ch==='d'?shade(color,.6):PAL[ch]||'#f0f';
    s+=`<rect x="${x}" y="${y}" width="${x2-x+1}" height="1.03" fill="${f}"/>`;x=x2}});
  return `<svg viewBox="0 0 ${w} ${rows.length}" shape-rendering="crispEdges">${s}</svg>`;
}
const AVATARS=[
 {n:'Knight',r:["....kkkk....","...knnnnk...","..knnnnnnk..","..knkkkknk..","..knbkkbnk..","..knnnnnnk..","...kcccck.y.","..kcccccckyk",".kncccccckyk","..kcdddck.k.","..kck.kck...","..kkk.kkk..."]},
 {n:'Witch',r:[".....kk.....","....kvvk....","...kvvvvk...","..kkvyyvkk..",".kvvvvvvvvk.","..kkkkkkkk..","..kskssksk..","..kssrrssk..","...kcccck...","..kcccccck..","..kcdccdck..","..kkk..kkk.."]},
 {n:'Bones',r:["...kkkkkk...","..kwwwwwwk..",".kwwwwwwwwk.",".kwkkwwkkwk.",".kwkkwwkkwk.",".kwwwkkwwwk.","..kwkwkwkk..","...kkkkkk...","..kcccccck..","..kwkwwkwk..","..kwkwwkwk..","..kkk..kkk.."]},
 {n:'Cat',r:[".kk......kk.",".kck....kck.",".kcckkkkcck.",".kcccccccck.",".kcwkccwkck.",".kcccccccck.",".kccckkccck.",".kcwccccwck.","..kkcccckk..","..kcccccck.k","..kcdccdckkk","..kkk..kkk.."]},
 {n:'Pumpkin',r:[".....gg.....","....kgk.....","..kkkookkk..",".kooooooook.",".koyyooyyok.",".kooooooook.",".koykykykok.","..kooooook..","...kkkkkk...","..kcccccck..","..kcdccdck..","..kkk..kkk.."]},
 {n:'Vampire',r:["...kkkkkk...","..keeeeeek..","..keGGGGek..","..kGrGGrGk..","..kGGGGGGk..","..kGGwwGGk..",".kkkGGGGkkk.",".kcckrrkcck.",".kcckeekcck.",".kcdkeekdck.","..kkkeekkk..","...kk..kk..."]},
 {n:'Robot',r:[".....r......",".....k......","..kkkkkkkk..","..knnnnnnk..","..knbbnbbk..","..knnnnnnk..","..knkkkknk..","..kkkkkkkk..",".nkcccccckn.",".nkcyccyckn.","..kcccccck..","..kkk..kkk.."]},
 {n:'Slime',r:["............","............","....kkkk....","..kkcccckk..",".kcwccccccck","kcwcccccccck","kcckwcckwcck","kcckkcckkcck","kccccrrcccck","kcccccccccck","kddddddddddk",".kkkkkkkkkk."]}
];
const COLORS=['#ff5d8f','#6ff7ff','#ffd66b','#7dffb0','#b796ff','#ff9a3c','#5aa9ff','#f1eaff'];
const avatar=p=>sprite(AVATARS[(p.av|0)%AVATARS.length].r,p.color);

/* ---------- profile (remembered on this device, shared by every game) ---------- */
function loadProfile(){const d={name:'',color:COLORS[0],av:0};try{const p=JSON.parse(localStorage.getItem('arcade-profile'));
  if(p){d.name=clean(p.name,'');if(COLORS.includes(p.color))d.color=p.color;d.av=Math.abs(p.av|0)%AVATARS.length}}catch(e){}return d}
function saveProfile(p){try{localStorage.setItem('arcade-profile',JSON.stringify({name:p.name,color:p.color,av:p.av}))}catch(e){}}
function playerCard(p,ph,setColor,changed){
  const c=el('div','pcard');c.style.setProperty('--pc',p.color);
  const av=el('div','av'),L=el('button','small','<'),R=el('button','small','>'),pic=el('div','pic'),nm=el('div','avn');
  L.title='Previous avatar';R.title='Next avatar';
  const draw=()=>{pic.innerHTML=avatar(p);nm.textContent=AVATARS[p.av].n};
  const cyc=d=>{p.av=(p.av+d+AVATARS.length)%AVATARS.length;draw();changed&&changed()};
  L.onclick=()=>cyc(-1);R.onclick=()=>cyc(1);av.append(L,pic,R);
  const inp=el('input');inp.maxLength=14;inp.placeholder=ph;inp.value=p.name;inp.oninput=()=>{p.name=inp.value;changed&&changed()};
  const sw=el('div','sw');COLORS.forEach(col=>{const b=el('b',p.color===col?'sel':'');b.style.background=col;b.onclick=()=>{setColor(col);changed&&changed()};sw.append(b)});
  draw();c.append(av,nm,inp,sw);return c;
}

/* ---------- sound effects + music (synthesised, no files) ---------- */
const SFX=(()=>{let ac=null,muted=false,nb=null;try{muted=localStorage.getItem('arcade-mute')==='1'}catch(e){}
  const ctx=()=>{if(!ac){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;ac=new A()}if(ac.state==='suspended')ac.resume();return ac};
  const tone=(f,t0,dur,type,vol,f2)=>{const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+t0;o.type=type||'square';o.frequency.setValueAtTime(f,t);
    if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);g.gain.setValueAtTime(vol||.07,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+dur+.03)};
  const noise=(t0,dur,vol,rate)=>{if(!nb){nb=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
    const n=ac.createBufferSource(),g=ac.createGain(),t=ac.currentTime+t0;n.buffer=nb;n.playbackRate.value=rate||1;g.gain.setValueAtTime(vol||.08,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    n.connect(g);g.connect(ac.destination);n.start(t);n.stop(t+dur+.03)};
  const seq=(notes,st,type,vol)=>notes.forEach((f,i)=>f&&tone(f,i*st,st*1.15,type,vol));
  const lib={
    click:()=>tone(660,0,.05,'square',.04),
    turn:()=>seq([660,880],.07,'square',.04),
    deny:()=>seq([196,196],.11,'square',.06),
    good:()=>seq([523,659,784,1047],.07,'square',.06),
    bad:()=>{noise(0,.3,.1,.6);tone(400,0,.4,'sawtooth',.08,70)},
    win:()=>seq([523,523,523,659,784,0,659,784,1047,1047],.12,'square',.08),
    lose:()=>seq([392,330,294,247,196,147],.2,'sawtooth',.07)};
  return{ctx,peek:()=>ac,tone,noise,seq,add(o){Object.assign(lib,o)},play(n){if(muted||!lib[n])return;try{if(ctx())lib[n]()}catch(e){}},
    get muted(){return muted},toggle(){muted=!muted;try{localStorage.setItem('arcade-mute',muted?'1':'0')}catch(e){}if(!muted)this.play('good');return muted}};
})();
const MUSIC=(()=>{let on=true,g=null,timer=0,next=0,si=0,song=null;try{on=localStorage.getItem('arcade-music')!=='0'}catch(e){}
  const F=n=>440*Math.pow(2,(n-69)/12);
  const note=(a,f,t,d,type,v)=>{const o=a.createOscillator(),e=a.createGain();o.type=type;o.frequency.value=f;e.gain.setValueAtTime(v,t);e.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(e);e.connect(g);o.start(t);o.stop(t+d+.03)};
  const sched=()=>{const a=SFX.peek();if(!a||a.state!=='running'||!song)return;if(next<a.currentTime)next=a.currentTime+.05;
    const ST=60/song.bpm/2,per=song.per||8,len=song.mel.length;
    while(next<a.currentTime+.35){const i=si%len,c=song.ch[Math.floor(i/per)%song.ch.length];
      if(i%(song.bassEvery||4)===0)note(a,F(c[0]),next,ST*3.6,'triangle',.13);
      note(a,F(c[1+i%3]),next,ST*.9,song.arp||'square',.018);
      if(song.mel[i])note(a,F(song.mel[i]),next,ST*1.7,song.lead||'square',.032);
      next+=ST;si++}};
  const start=()=>{if(timer||!song)return;const a=SFX.ctx();if(!a)return;if(!g){g=a.createGain();g.connect(a.destination)}
    g.gain.setTargetAtTime(1,a.currentTime,.05);next=0;timer=setInterval(sched,100)};
  const stop=()=>{clearInterval(timer);timer=0;if(g)g.gain.setTargetAtTime(0,SFX.ctx().currentTime,.05)};
  return{set(s){song=s;if(on)try{start()}catch(e){}},get on(){return on},kick(){if(on){start();SFX.ctx()}},toggle(){on=!on;try{localStorage.setItem('arcade-music',on?'1':'0')}catch(e){}on?start():stop();return on}};
})();
// browsers only allow sound after the visitor's first tap, click or key press — start on whichever comes first
['pointerdown','pointerup','touchend','keydown','click'].forEach(ev=>document.addEventListener(ev,()=>MUSIC.kick(),true));
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('button,a.gcard'))SFX.play('click')});

/* ---------- background pixels + particle bursts ---------- */
let burst=()=>{};
function initFx(colors,extra){
  let c=$('#fx');if(!c){c=el('canvas');c.id='fx';document.body.prepend(c)}
  const x=c.getContext('2d');let w,h,ps=[],bs=[];
  const size=()=>{w=c.width=innerWidth;h=c.height=innerHeight};size();addEventListener('resize',size);
  colors=colors||['#6ff7ff','#9d6bff','#ffffff'];
  for(let i=0;i<70;i++)ps.push({x:Math.random(),y:Math.random(),r:2+2*Math.floor(Math.random()*2),v:.0002+Math.random()*.0006,d:Math.random()*6.28,c:colors[i%colors.length]});
  burst=(bx,by,cols,n)=>{for(let i=0;i<(n||26);i++){const a=Math.random()*6.28,s=2+Math.random()*6;bs.push({x:bx,y:by,vx:Math.cos(a)*s,vy:Math.sin(a)*s-3,l:26+Math.random()*18,c:cols[i%cols.length],r:4+2*Math.floor(Math.random()*3)})}};
  const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  (function tick(t){x.clearRect(0,0,w,h);if(extra){x.globalAlpha=.5;extra(x,w,h,t)}
    for(const p of ps){if(!still){p.y-=p.v;if(p.y<-.02){p.y=1.02;p.x=Math.random()}}
      x.globalAlpha=(Math.floor(t/400+p.d*3)%3===0)?.15:.6;x.fillStyle=p.c;x.fillRect(Math.round(p.x*w/4)*4,Math.round(p.y*h/4)*4,p.r,p.r)}
    x.globalAlpha=1;bs=bs.filter(b=>b.l-->0);
    for(const b of bs){b.x+=b.vx;b.y+=b.vy;b.vy+=.35;x.fillStyle=b.c;x.fillRect(Math.round(b.x/2)*2,Math.round(b.y/2)*2,b.r,b.r)}
    requestAnimationFrame(tick)})(0);
}
const burstAt=(node,cols,n)=>{if(!node)return;const r=node.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,cols,n)};

/* ================= game shell ================= */
function run(game){
  const MIN=game.min||2,MAX=game.max||4,PREFIX='pixarcade-'+game.id+'-';
  document.body.insertAdjacentHTML('afterbegin',`
<section id="home" class="screen center on"><div class="card">
  <h1 class="title"></h1><p class="tag" id="hTag"></p>
  <button class="primary big" id="bLocal">Local game — one device</button>
  <button class="alt big" id="bOnline">Online game — room code</button>
  <button class="big" id="bArcade">&lt; Back to Arcade</button>
</div></section>
<section id="setup" class="screen center"><div class="card wide">
  <button class="back" data-go="home">&lt; Back</button><h2>Choose your crew</h2>
  <label class="l">Players</label><div class="seg" id="cnt"></div>
  <label class="l">Avatar, name &amp; colour</label><div id="rows" class="pcards"></div>
  <button class="primary big" id="bStart"></button>
</div></section>
<section id="online" class="screen center"><div class="card">
  <button class="back" data-go="home">&lt; Back</button><h2>Play online</h2>
  <label class="l">You</label><div id="oMe"></div>
  <button class="primary big" id="bCreate">Create a room</button>
  <label class="l">…or join one</label>
  <div class="row"><input id="oCode" maxlength="5" placeholder="ROOM CODE" style="text-transform:uppercase;letter-spacing:4px"><button class="alt" id="bJoin">Join</button></div>
  <div class="err" id="oErr"></div>
</div></section>
<section id="lobby" class="screen center"><div class="card">
  <button class="back" id="bLeaveLobby">&lt; Leave room</button>
  <div class="ph" style="text-align:center">Room code — share it with your friends</div>
  <div class="code" id="lCode"></div>
  <div style="text-align:center;margin:8px 0 14px"><button class="small" id="bCopy">Copy invite</button></div>
  <div id="lSeats"></div>
  <button class="primary big" id="bStartOnline"></button>
  <p class="tag" id="lWait" style="margin:14px 0 0">Waiting for the host to start…</p>
</div></section>
<section id="game" class="screen"><div id="stage"></div><aside>
  <div class="panel top"><span class="logo"></span><span><button class="small" id="bMus" title="Music on/off">♪</button> <button class="small" id="bSnd" title="Sound effects on/off">🔊</button> <button class="small" id="bRestart">Restart</button> <button class="small" id="bMenu">Menu</button></span></div>
  <div class="panel ctlp"><div id="turn"></div><div id="ctl"></div></div>
  <div class="panel"><div class="ph">Players</div><div id="players"></div></div>
  <div class="panel" id="logp"><div class="ph">Event log</div><div id="log"></div></div>
  <div class="panel"><details><summary>How to play</summary><div id="how"></div></details></div>
</aside></section>
<div id="toast"></div><div id="banner"><div class="bt"></div><div class="bs"></div></div>
<div class="overlay" id="end"><div class="card"><div id="endI"></div><h1 id="endT"></h1><p class="tag" id="endD"></p>
  <button class="primary big" id="bAgain">Play again</button><button class="big" id="bEndMenu">Menu</button><button class="big" id="bEndArcade">&lt; Back to Arcade</button></div></div>`);
  $('h1.title').textContent=game.title;$('.top .logo').textContent=game.title;$('#hTag').textContent=game.tag||'';
  $('#bStart').textContent=game.startLabel||'Start';$('#how').innerHTML=game.how||'';document.title=game.name||game.title;
  initFx(game.bgColors,game.bgDraw);
  if(game.sfx)SFX.add(game.sfx(SFX));
  MUSIC.set(game.song||{bpm:108,ch:[[45,57,60,64],[41,53,57,60],[38,50,53,57],[40,52,56,59]],mel:new Array(32).fill(0)});

  let S=null,V=null,builtGid=null;
  let net={mode:'local',seat:0,peer:null,hostConn:null,seatConns:[],code:'',iv:0};
  let lobby={seats:[]};
  const CANCEL={cancel:true};
  const authority=()=>net.mode!=='client';
  const controls=i=>net.mode==='local'||i===net.seat;
  const stage=$('#stage');
  function send(msg){if(net.mode==='host')net.seatConns.forEach(c=>{if(c&&c.open)try{c.send(msg)}catch(e){}})}
  const api={rnd,shuffle,sleep,
    async step(ms,fx){const s=S;s.seq++;send({t:'state',s,fx:fx||null});apply(s,fx);if(ms)await sleep(ms);if(S!==s)throw CANCEL},
    log(m,c){S.log.push({m,c:c||''});if(S.log.length>60)S.log.shift()}};

  /* ----- engine (local / host) ----- */
  function startGame(seats){
    const players=seats.map((p,i)=>({id:i,name:p.name,color:p.color,av:(p.av|0)%AVATARS.length,conn:p.conn!==false}));
    const s={gid:rnd(1e9),seq:0,players,log:[],turn:0,busy:false,over:false,winners:[]};
    Object.assign(s,game.init(players,api));S=s;
    if(game.intro)api.log(game.intro,'hi');
    api.step(0).catch(()=>{});autoIfAway();
  }
  async function dispatch(seat,a){
    const s=S;if(!s||s.over||s.busy||seat!==s.turn||!a||typeof a!=='object'||!game.valid(s,seat,a))return;
    s.busy=true;
    try{await game.act(s,seat,a,api);if(S===s){s.busy=false;await api.step(0)}}
    catch(e){if(e!==CANCEL)throw e;return}
    autoIfAway();
  }
  function autoIfAway(){const s=S;if(!s||s.over||s.busy)return;const i=s.turn;
    if(!s.players[i].conn)setTimeout(()=>{if(S===s&&!s.busy&&!s.over&&s.turn===i)dispatch(i,game.auto(s,i,api))},1300)}
  function restart(){if(!authority()||!S)return;startGame(S.players.map(p=>({name:p.name,color:p.color,av:p.av,conn:p.conn})))}

  /* ----- view ----- */
  const ctx={controls,sprite,avatar,burstAt,
    canAct:()=>!!V&&!V.over&&!V.busy&&controls(V.turn),
    act(a){if(!ctx.canAct())return;if(authority())dispatch(V.turn,a);else try{net.hostConn.send({t:'act',a})}catch(e){}},
    button(label,a,cls){const b=el('button',cls||'primary',label);b.disabled=!ctx.canAct();if(!b.disabled)b.classList.add('go');b.onclick=()=>ctx.act(a);return b}};
  function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id));if(id!=='game')$('#end').classList.remove('on')}
  let toastT=0,bannerT=0,turnKey='',logSig='',endGid=null;
  function playFx(fx){
    if(!fx)return;
    if(fx.sfx)SFX.play(fx.sfx);
    if(fx.toast){const t=$('#toast');t.textContent=fx.toast;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),1700)}
    if(fx.banner){const b=$('#banner');b.className='on '+(fx.banner.c||'');$('.bt',b).textContent=fx.banner.text;const s=$('.bs',b);s.textContent=fx.banner.sub||'';s.style.display=fx.banner.sub?'':'none';
      clearTimeout(bannerT);bannerT=setTimeout(()=>b.className='',1500)}
    if(fx.shake)stage.animate([{transform:'translate(0,0)'},{transform:'translate(-8px,4px)'},{transform:'translate(8px,-4px)'},{transform:'translate(-6px,-4px)'},{transform:'translate(6px,4px)'},{transform:'translate(0,0)'}],{duration:420,easing:'steps(6)'});
    if(fx.burst)burstAt(fx.burst.sel?$(fx.burst.sel,stage):stage,fx.burst.cols||['#ffd66b','#ffffff'],fx.burst.n);
    if(game.fx)game.fx(fx,V,ctx);
  }
  function apply(s,fx){
    V=s;show('game');
    if(builtGid!==s.gid){stage.innerHTML='';game.build(stage,s,ctx);builtGid=s.gid;logSig=''}
    render();playFx(fx);
  }
  function render(){
    const s=V;if(!s)return;
    const cur=s.players[s.turn],mine=controls(s.turn),tu=$('#turn');tu.innerHTML='';
    if(s.over)tu.textContent='Game over';
    else{const nm=el('span',null,net.mode!=='local'&&mine?'Your turn':cur.name+"'s turn");nm.style.color=cur.color;
      tu.append(nm,el('small',null,(game.status&&game.status(s,mine))||(s.busy?'…':mine?'Your move':'Waiting for '+cur.name)))}
    const tk=s.gid+':'+s.turn+':'+s.busy;if(!s.over&&!s.busy&&tk!==turnKey&&mine&&s.seq>1)SFX.play('turn');turnKey=tk;
    $('#ctl').innerHTML='';
    game.render(s,ctx,$('#ctl'));
    const pl=$('#players');pl.innerHTML='';
    s.players.forEach((p,i)=>{const r=el('div','pl'+(s.turn===i&&!s.over?' cur':''));const d=el('span','pa');d.innerHTML=avatar(p);
      const st=[];if(!p.conn)st.push('📡 away');if(game.badge){const b=game.badge(s,p);if(b)st.push(b)}
      r.append(d,el('span','nm',p.name+(net.mode!=='local'&&i===net.seat?' (you)':'')),el('span','st',st.join(' ')),el('span','ps',game.score?game.score(s,p):''));pl.append(r)});
    const lg=$('#log'),sig=s.gid+':'+s.log.length+':'+(s.log[s.log.length-1]||{}).m;
    if(sig!==logSig){logSig=sig;lg.innerHTML='';for(let i=s.log.length-1;i>=0;i--)lg.append(el('div',s.log[i].c,s.log[i].m))}
    const en=$('#end');
    if(s.over){
      const ws=s.winners.map(i=>s.players[i]),iWon=ws.some(p=>controls(p.id)),names=ws.map(p=>p.name).join(' & ');
      en.classList.toggle('lose',!iWon);
      $('#endI').innerHTML=ws.map(avatar).join('');
      $('#endT').textContent=ws.length>1?'Draw!':net.mode==='local'?names+' wins!':iWon?'Victory!':'Defeat';
      $('#endD').textContent=(game.endText&&game.endText(s))||(names+(ws.length>1?' share the win.':' takes the win.'));
      $('#bAgain').style.display=authority()?'':'none';
      if(endGid!==s.gid){endGid=s.gid;SFX.play(iWon?'win':'lose');
        if(iWon)for(let k=0;k<5;k++)setTimeout(()=>burst(innerWidth*(.2+.6*Math.random()),innerHeight*(.2+.4*Math.random()),['#ffd66b','#7dffb0','#6ff7ff','#ff5d8f'],40),k*350)}
      en.classList.add('on');
    }else en.classList.remove('on');
    $('#bRestart').style.display=authority()?'':'none';
  }

  /* ----- menus ----- */
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));
  const me=loadProfile();
  const setup={n:Math.max(MIN,2),p:COLORS.slice(0,4).map((c,i)=>({name:'',color:c,av:i}))};
  (function(){const p=setup.p[0];p.name=me.name;p.av=me.av;const o=setup.p.find(q=>q!==p&&q.color===me.color);if(o)o.color=p.color;p.color=me.color;
    setup.p.forEach((q,i)=>{if(i&&q.av===p.av)q.av=(q.av+i+3)%AVATARS.length})})();
  function drawSetup(){
    const cnt=$('#cnt');cnt.innerHTML='';for(let n=MIN;n<=MAX;n++){const b=el('button',setup.n===n?'sel':'',n+' players');b.onclick=()=>{setup.n=n;drawSetup()};cnt.append(b)}
    const rows=$('#rows');rows.innerHTML='';
    for(let i=0;i<setup.n;i++){const p=setup.p[i];
      rows.append(playerCard(p,'Player '+(i+1),c=>{const o=setup.p.find(q=>q.color===c);if(o)o.color=p.color;p.color=c;drawSetup()},i?null:()=>saveProfile(p)))}
  }
  $('#bLocal').onclick=()=>{drawSetup();show('setup')};
  $('#bStart').onclick=()=>{net.mode='local';startGame(setup.p.slice(0,setup.n).map((p,i)=>({name:clean(p.name,'Player '+(i+1)),color:p.color,av:p.av})))};
  $('#bAgain').onclick=restart;
  $('#bArcade').onclick=$('#bEndArcade').onclick=()=>{location.href='../'};
  $('#bRestart').onclick=function(){if(this.dataset.sure){delete this.dataset.sure;this.textContent='Restart';restart()}else{this.dataset.sure=1;this.textContent='Sure?';setTimeout(()=>{delete this.dataset.sure;this.textContent='Restart'},2500)}};
  function leave(){S=null;V=null;builtGid=null;const p=net.peer;clearInterval(net.iv);net={mode:'local',seat:0,peer:null,hostConn:null,seatConns:[],code:'',iv:0};if(p)try{p.destroy()}catch(e){}
    if(location.hash)history.replaceState(null,'',location.pathname+location.search);show('home')}
  $('#bMenu').onclick=$('#bEndMenu').onclick=$('#bLeaveLobby').onclick=leave;
  $('#bMus').classList.toggle('off',!MUSIC.on);$('#bMus').onclick=function(){this.classList.toggle('off',!MUSIC.toggle())};
  $('#bSnd').textContent=SFX.muted?'🔇':'🔊';$('#bSnd').onclick=function(){this.textContent=SFX.toggle()?'🔇':'🔊'};

  /* ----- online ----- */
  function drawOnline(){const b=$('#oMe');b.innerHTML='';b.append(playerCard(me,'Your name',c=>{me.color=c;drawOnline()},()=>saveProfile(me)))}
  $('#bOnline').onclick=()=>{drawOnline();$('#oErr').textContent='';show('online')};
  function oErr(m){$('#oErr').textContent=m;$('#bCreate').disabled=$('#bJoin').disabled=false}
  function needPeer(){if(typeof Peer==='undefined'){oErr('Online play needs an internet connection (could not load the networking library).');return false}
    $('#oErr').textContent='Connecting…';$('#bCreate').disabled=$('#bJoin').disabled=true;return true}
  function makeCode(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<5;i++)s+=A[rnd(A.length)];return s}
  $('#bCreate').onclick=()=>{if(needPeer())hostRoom()};
  function hostRoom(){
    const code=makeCode(),peer=new Peer(PREFIX+code,{debug:0});
    net={mode:'host',seat:0,peer,hostConn:null,seatConns:[],code,iv:0};
    peer.on('open',()=>{lobby={seats:[{name:clean(me.name,'Host'),color:me.color,av:me.av,conn:null}]};oErr('');drawLobby()});
    peer.on('connection',c=>{c._seen=Date.now();c.on('data',d=>{c._seen=Date.now();hostData(c,d)});c.on('close',()=>hostDrop(c));c.on('error',()=>hostDrop(c))});
    // heartbeat: a closed tab or dead network does not always fire 'close' promptly
    net.iv=setInterval(()=>{const cs=(S?net.seatConns:lobby.seats.map(s=>s.conn)).filter(Boolean);
      cs.forEach(c=>{if(Date.now()-c._seen>15000){hostDrop(c);try{c.close()}catch(e){}}else if(c.open)try{c.send({t:'ping'})}catch(e){}})},3000);
    peer.on('disconnected',()=>{if(net.peer===peer&&!peer.destroyed)try{peer.reconnect()}catch(e){}});
    peer.on('error',e=>{if(net.peer!==peer)return;if(e.type==='unavailable-id'){peer.destroy();hostRoom()}
      else if(!$('#game').classList.contains('on')&&e.type!=='peer-unavailable'){leave();show('online');oErr('Could not open a room: '+e.type)}});
  }
  const pubSeats=()=>lobby.seats.map(s=>({name:s.name,color:s.color,av:s.av}));
  function castLobby(){lobby.seats.forEach((s,i)=>{if(s.conn&&s.conn.open)s.conn.send({t:'lobby',seats:pubSeats(),you:i,code:net.code})});drawLobby()}
  function hostData(c,d){
    if(!d||typeof d!=='object'||net.mode!=='host')return;
    if(d.t==='join'){
      if(S||lobby.seats.length>=MAX||lobby.seats.some(s=>s.conn===c)){c.send({t:'reject',why:S?'That game has already started.':'That room is full.'});setTimeout(()=>c.close(),400);return}
      let color=COLORS.includes(d.color)?d.color:COLORS[0];if(lobby.seats.some(s=>s.color===color))color=COLORS.find(x=>!lobby.seats.some(s=>s.color===x));
      lobby.seats.push({name:clean(d.name,'Player '+(lobby.seats.length+1)),color,av:Math.abs(d.av|0)%AVATARS.length,conn:c});castLobby();
    }else if(S&&d.t==='act'){const i=net.seatConns.indexOf(c);if(i>=0)dispatch(i,d.a)}
  }
  function hostDrop(c){
    if(net.mode!=='host')return;
    if(!S){const i=lobby.seats.findIndex(s=>s.conn===c);if(i>0){lobby.seats.splice(i,1);castLobby()}return}
    const i=net.seatConns.indexOf(c);if(i<0)return;net.seatConns[i]=null;const p=S.players[i];if(!p.conn)return;p.conn=false;
    api.log(`📡 ${p.name} disconnected — the computer will play for them.`);S.seq++;send({t:'state',s:S,fx:null});apply(S);autoIfAway();
  }
  function drawLobby(view){
    const v=view||{seats:pubSeats(),you:0,code:net.code},host=net.mode==='host';
    show('lobby');$('#lCode').textContent=v.code;
    const b=$('#lSeats');b.innerHTML='';
    for(let i=0;i<MAX;i++){const s=v.seats[i],r=el('div','seat');if(s){const d=el('span');d.innerHTML=avatar(s);
        r.append(d,el('b',null,s.name),el('span','st',(i===0?'host':'')+(i===v.you?' · you':'')))}else{r.style.opacity=.4;r.textContent='Empty seat…'}b.append(r)}
    $('#bStartOnline').style.display=host?'':'none';$('#lWait').style.display=host?'none':'';
    $('#bStartOnline').disabled=v.seats.length<MIN;$('#bStartOnline').textContent=v.seats.length<MIN?'Waiting for players…':(game.startLabel||'Start');
  }
  $('#bStartOnline').onclick=()=>{if(net.mode!=='host'||lobby.seats.length<MIN)return;
    net.seatConns=lobby.seats.map(s=>s.conn);net.seatConns.forEach((c,i)=>{if(c&&c.open)c.send({t:'you',seat:i})});
    startGame(lobby.seats.map(s=>({name:s.name,color:s.color,av:s.av})))};
  $('#bCopy').onclick=function(){const code=$('#lCode').textContent,link=/^https?:/.test(location.protocol)?location.href.split('#')[0]+'#room='+code:'';
    const txt=link?`Join my ${game.name||game.title} room: ${link} (code ${code})`:`Join my ${game.name||game.title} room with code ${code}`;
    (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>this.textContent='Copied!',()=>this.textContent=code).finally(()=>setTimeout(()=>this.textContent='Copy invite',1600))};
  $('#bJoin').onclick=()=>{const code=$('#oCode').value.trim().toUpperCase();if(code.length!==5){oErr('Enter the 5-character room code.');return}if(needPeer())joinRoom(code)};
  function joinRoom(code){
    const peer=new Peer({debug:0});net={mode:'client',seat:-1,peer,hostConn:null,seatConns:[],code,iv:0};let seen=Date.now();
    const fail=m=>{if(net.peer!==peer)return;const was=$('#game').classList.contains('on')||$('#lobby').classList.contains('on');leave();show('online');drawOnline();oErr(m||(was?'Lost connection to the host.':'Could not connect.'))};
    const to=setTimeout(()=>{if(net.peer===peer&&net.seat<0)fail('Could not reach that room. Check the code and try again.')},15000);
    peer.on('open',()=>{const c=peer.connect(PREFIX+code,{reliable:true,serialization:'json'});net.hostConn=c;
      c.on('open',()=>c.send({t:'join',name:clean(me.name,''),color:me.color,av:me.av}));
      c.on('data',d=>{if(net.peer!==peer||!d)return;seen=Date.now();
        if(d.t==='lobby'){clearTimeout(to);net.seat=d.you;oErr('');drawLobby(d)}
        else if(d.t==='you')net.seat=d.seat;
        else if(d.t==='state')apply(d.s,d.fx);
        else if(d.t==='reject'){clearTimeout(to);fail(d.why)}
        else if(d.t==='ping')try{c.send({t:'pong'})}catch(e){}});
      c.on('close',()=>fail());c.on('error',()=>fail())});
    net.iv=setInterval(()=>{if(net.peer===peer&&net.seat>=0&&Date.now()-seen>15000)fail('Lost connection to the host.')},3000);
    peer.on('error',e=>{clearTimeout(to);fail(e.type==='peer-unavailable'?'No room with that code.':null)});
  }

  /* ----- top-bar menu: every in-game button except the game controls lives in one panel ----- */
  (function(){const top=document.querySelector('#game .top');if(!top)return;const span=top.querySelector('span:last-child');
    const ov=document.createElement('div');ov.className='overlay';ov.id='gmenu';
    ov.innerHTML='<div class="card"><h2>Menu</h2><div id="gmBox"></div><button class="big" type="button" id="gmArcade">&lt; Back to Arcade</button><button class="primary big" type="button" id="gmClose">Close</button></div>';
    document.body.append(ov);const box=ov.querySelector('#gmBox');
    [...span.querySelectorAll('button')].forEach(b=>{b.classList.remove('small');box.append(b)});
    const quit=box.querySelector('#bMenu');if(quit)quit.textContent='Main menu';
    const how=document.querySelector('#game details');if(how){const wrap=how.parentElement;box.append(how);if(wrap&&wrap.classList.contains('panel'))wrap.remove()}
    span.innerHTML='';const mb=document.createElement('button');mb.className='small';mb.type='button';mb.id='bGMenu';mb.textContent='Menu';span.append(mb);
    const close=()=>ov.classList.remove('on');mb.onclick=()=>ov.classList.add('on');ov.querySelector('#gmClose').onclick=close;
    ov.querySelector('#gmArcade').onclick=()=>{location.href='../'};
    box.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&(b.id==='bMenu'||(b.id==='bRestart'&&b.dataset.sure)))close()},true);
  })();
  
  const m=location.hash.match(/room=([A-Za-z0-9]{5})/);
  if(m){drawOnline();show('online');$('#oCode').value=m[1].toUpperCase()}
  // test hooks
  run._={get S(){return S},startGame,dispatch,api};
}

window.Arcade={$,el,sleep,rnd,shuffle,clean,PAL,sprite,AVATARS,COLORS,avatar,loadProfile,saveProfile,playerCard,SFX,MUSIC,initFx,burstAt,run,
  burst:(...a)=>burst(...a)};
})();
