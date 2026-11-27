/* Kirish tizimi (TZ F-1.1): ota-ona, o‘qituvchi va xodim — telefon + SMS kod, parolsiz;
   o‘quvchi — ota-ona ochgan login va parol (auth.js bilan bir xil saqlash: kt_auth_users / kt_auth_session).
   Demo: SMS yuborilmaydi, kod ekranda ko‘rsatiladi. Haqiqiy tizimda — SMS shlyuz, kod 2 daqiqa, 5 xato → 15 daqiqa blok. */
(function(){
  const esc = s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ROLES = {
    parent:{name:'Ota-ona', icon:'👩‍👦', color:'#41b6ff', sub:'Oila hisobi · SMS kod bilan', go:'ota-ona.html'},
    student:{name:'O‘quvchi', icon:'🎒', color:'#ff2fd5', sub:'Login va parol · hisobni ota-ona ochgan', go:'dashboard.html'},
    teacher:{name:'O‘qituvchi', icon:'🧑‍🏫', color:'#2fd39a', sub:'Jurnal va davomat · SMS kod bilan', go:'oqituvchi.html'},
    staff:{name:'Xodim', icon:'🗂️', color:'#ffc933', sub:'Administrator yoki rahbar · 2 bosqichli himoya', go:'admin.html'}
  };

  /* ---------- karta ---------- */
  function hash(s){ let h=2166136261; for(const c of String(s)) { h^=c.charCodeAt(0); h=Math.imul(h,16777619); } return h>>>0; }
  function qr(seed){
    let h=hash(seed||'kt'), cells='';
    const N=13, finder=(x,y)=>(x<4&&y<4)||(x>N-5&&y<4)||(x<4&&y>N-5);
    for(let y=0;y<N;y++) for(let x=0;x<N;x++){
      let on;
      if(finder(x,y)){ const fx=x<4?x:x-(N-4), fy=y<4?y:y-(N-4); on=(fx===0||fx===3||fy===0||fy===3)||(fx>=1&&fx<=2&&fy>=1&&fy<=2); }
      else { h=Math.imul(h^(h>>>13),1274126177)>>>0; on=(h&3)===0||(h&7)===3; }
      if(on) cells+=`<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
    return `<svg viewBox="0 0 ${N} ${N}" aria-hidden="true" fill="#2a1248" shape-rendering="crispEdges">${cells}</svg>`;
  }
  function initials(n){ return String(n||'').trim().split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase(); }
  function pass(el, o){
    o=Object.assign({role:'parent', name:'', ph:'Ismingiz', id:'KT-2026-0000', kids:[]}, o||{});
    el.innerHTML=`<div class="ghost g1"></div><div class="ghost g2"></div>
      <div class="pass" role="img"><i class="pass-holo"></i>
        <div class="pass-top"><img src="static/img/logo-brand.png" alt=""><b>KATTA TANAFFUS</b><span class="pass-role"></span></div>
        <div class="pass-mid"><span class="pass-av"></span><div><span class="pass-name"></span><span class="pass-sub"></span><div class="kids"></div></div></div>
        <div class="pass-bot"><span class="pass-chip"></span><span class="pass-id"></span><span class="pass-qr"></span></div>
        <span class="stamp">✓ Tasdiqlandi</span></div>`;
    const P=el.querySelector('.pass');
    const api={
      set(n){
        const prevRole=o.role; Object.assign(o,n||{}); const R=ROLES[o.role];
        if(prevRole!==o.role){ P.classList.remove('swap'); void P.offsetWidth; P.classList.add('swap'); }
        P.style.setProperty('--pc',R.color); document.documentElement.style.setProperty('--pc',R.color);
        P.querySelector('.pass-role').textContent=R.icon+' '+R.name;
        const nm=P.querySelector('.pass-name'); nm.textContent=o.name||o.ph; nm.classList.toggle('ph',!o.name);
        P.querySelector('.pass-av').textContent=initials(o.name)||R.icon;
        P.querySelector('.pass-sub').textContent=o.sub||R.sub;
        P.querySelector('.pass-id').textContent=o.id;
        P.querySelector('.pass-qr').innerHTML=qr((o.name||'')+o.role+o.id);
        P.querySelector('.kids').innerHTML=(o.kids||[]).map(k=>`<i>${esc(k)}</i>`).join('');
        P.setAttribute('aria-label',`Katta Tanaffus kartasi: ${R.name}${o.name?', '+o.name:''}`);
      },
      stamp(){ const s=P.querySelector('.stamp'); s.classList.remove('on'); void s.offsetWidth; s.classList.add('on'); }
    };
    api.set({}); return api;
  }

  /* ---------- telefon niqobi ---------- */
  function digits9(v){ let d=String(v||'').replace(/\D/g,''); if(d.startsWith('998')) d=d.slice(3); return d.slice(0,9); }
  function fmt(d){ const p=[d.slice(0,2),d.slice(2,5),d.slice(5,7),d.slice(7,9)].filter(Boolean); return '+998 '+p.join(' '); }
  function phoneMask(inp){
    inp.addEventListener('focus',()=>{ if(!inp.value) inp.value='+998 '; });
    inp.addEventListener('input',()=>{ const d=digits9(inp.value); inp.value=d?fmt(d):'+998 '; });
  }
  function maskPhone(p){ const d=digits9(p); return d.length===9?`+998 ${d.slice(0,2)} ••• ${d.slice(5,7)} ${d.slice(7)}`:p; }

  /* ---------- SMS kod ---------- */
  function lockLeft(){ const t=+(sessionStorage.getItem('ka:lock')||0); return Math.max(0,Math.ceil((t-Date.now())/60000)); }
  function otp(box, opt){
    opt=Object.assign({len:4, label:'SMS kod', note:'', onOk:()=>{}}, opt||{});
    let code='', tries=0, t=null, left=0;
    function gen(){ code=String(Math.floor(Math.random()*Math.pow(10,opt.len))).padStart(opt.len,'0'); if(code[0]==='0') code='7'+code.slice(1); }
    function render(){
      box.innerHTML=`<div class="ks-field"><label id="otpL">${esc(opt.label)}${opt.note?` <span class="au-hint">— ${esc(opt.note)}</span>`:''}</label>
        <div class="otp ${opt.len>4?'six':''}" role="group" aria-labelledby="otpL">${Array.from({length:opt.len},(_,i)=>`<input inputmode="numeric" autocomplete="${i?'off':'one-time-code'}" maxlength="1" aria-label="${i+1}-raqam">`).join('')}</div>
        <div class="au-row" style="margin-top:6px"><span class="demo-code">Demo: kod <b>${code}</b></span><span class="timer" aria-live="polite"></span></div>
        <div class="ks-err" role="alert"></div></div>`;
      const ins=[...box.querySelectorAll('.otp input')];
      ins.forEach((inp,i)=>{
        inp.addEventListener('input',()=>{ inp.value=inp.value.replace(/\D/g,'').slice(-1); if(inp.value&&ins[i+1]) ins[i+1].focus(); if(ins.every(x=>x.value)) check(); });
        inp.addEventListener('keydown',e=>{ if(e.key==='Backspace'&&!inp.value&&ins[i-1]){ ins[i-1].focus(); ins[i-1].value=''; } });
        inp.addEventListener('paste',e=>{ const d=(e.clipboardData.getData('text')||'').replace(/\D/g,'').slice(0,opt.len); if(d.length===opt.len){ e.preventDefault(); ins.forEach((x,k)=>x.value=d[k]); check(); } });
      });
      ins[0].focus(); tick();
    }
    function tick(){
      clearInterval(t); left=59; const el=box.querySelector('.timer');
      const draw=()=>{ if(!el) return; el.innerHTML = left>0 ? `Qayta yuborish: 0:${String(left).padStart(2,'0')}` : `<button type="button">Kodni qayta yuborish</button>`; const b=el.querySelector('button'); if(b) b.onclick=()=>{ gen(); tries=0; render(); }; };
      draw(); t=setInterval(()=>{ left--; draw(); if(left<=0) clearInterval(t); },1000);
    }
    function check(){
      const ins=[...box.querySelectorAll('.otp input')]; const v=ins.map(x=>x.value).join(''); const err=box.querySelector('.ks-err'); const g=box.querySelector('.otp');
      if(lockLeft()){ err.textContent=`Ko‘p urinish. ${lockLeft()} daqiqadan keyin qayta urinib ko‘ring.`; return; }
      if(v===code){ clearInterval(t); ins.forEach(x=>x.disabled=true); err.textContent=''; g.classList.remove('bad'); g.classList.add('good'); const tm=box.querySelector('.timer'); if(tm) tm.textContent='✓ Tasdiqlandi'; opt.onOk(); return; }
      tries++; g.classList.remove('bad'); void g.offsetWidth; g.classList.add('bad');
      if(tries>=5){ sessionStorage.setItem('ka:lock', String(Date.now()+15*60000)); err.textContent='5 marta noto‘g‘ri. Xavfsizlik uchun kirish 15 daqiqaga bloklandi.'; ins.forEach(x=>x.disabled=true); return; }
      err.textContent=`Kod noto‘g‘ri — yana ${5-tries} ta urinish qoldi.`; ins.forEach(x=>x.value=''); ins[0].focus();
    }
    gen(); render();
    return {resend(){ gen(); tries=0; render(); }, stop(){ clearInterval(t); }};
  }

  /* ---------- o‘quvchi hisoblari (auth.js bilan mos) ---------- */
  const UK='kt_auth_users', SK='kt_auth_session';
  const users=()=>{ try{ return JSON.parse(localStorage.getItem(UK)||'[]'); }catch(e){ return []; } };
  const saveUsers=u=>localStorage.setItem(UK, JSON.stringify(u));
  function ensureDemo(){ const u=users(); if(!u.some(x=>x.id==='demo_toxir')){ u.push({id:'demo_toxir',name:'Toxir Toirov',email:'toxir@example.com',password:'12345678',grade:'5-sinf',className:'5-sinf A',branch:'Yunusobod',parentPhone:'+998901234567',createdAt:new Date().toISOString()}); saveUsers(u); } }
  function findUser(login){ const l=String(login||'').trim().toLowerCase(); return users().find(u=>String(u.email).toLowerCase()===l || String(u.login||'').toLowerCase()===l); }
  function session(u, remember){ localStorage.setItem(SK, JSON.stringify({email:u.email, id:u.id, remember:!!remember, loginAt:new Date().toISOString()})); }
  function addStudent(o){ const u=users(); const id=(o.login||'').replace(/[^a-z0-9]+/gi,'_').toLowerCase()||('u_'+Date.now()); const rec={id, name:o.name, email:o.login, login:o.login, password:o.password, grade:o.grade||'', className:o.grade||'', branch:'', parentPhone:o.parentPhone||'', createdAt:new Date().toISOString()}; saveUsers(u.filter(x=>x.id!==id).concat([rec])); localStorage.setItem('kt_coin_balance_'+id,'0'); localStorage.setItem('kt_coin_balance_initialized_v2_'+id,'1'); return rec; }
  function setPassword(id, pw){ saveUsers(users().map(u=>u.id===id?{...u,password:pw}:u)); }
  function strength(pw){ let s=0; if(pw.length>=8) s++; if(/[A-Z]/.test(pw)&&/[a-z]/.test(pw)) s++; if(/\d/.test(pw)) s++; if(/[^A-Za-z0-9]/.test(pw)||pw.length>=12) s++; return Math.min(4,s); }
  function translit(s){ return String(s||'').toLowerCase().replace(/[ʻ'`’‘]/g,'').replace(/sh/g,'sh').replace(/[^a-z0-9 ]/g,'').trim().replace(/\s+/g,'.'); }

  function parentSession(o){ try{ localStorage.setItem('ktp:parentSession', JSON.stringify(Object.assign({ts:Date.now()},o))); }catch(e){} }
  /* ro‘yxatdan o‘tgan oilalar — telefon bo‘yicha (ktp:families). Ota-ona kabineti va qabul arizasi shu yerdan o‘qiydi. */
  const families=()=>{ try{ return JSON.parse(localStorage.getItem('ktp:families')||'[]'); }catch(e){ return []; } };
  function saveFamily(f){ const d=digits9(f.phone); const list=families().filter(x=>digits9(x.phone)!==d); list.push(Object.assign({createdAt:new Date().toISOString()},f)); try{ localStorage.setItem('ktp:families', JSON.stringify(list)); }catch(e){} return f; }
  function findFamily(phone){ const d=digits9(phone); return d.length===9 ? families().find(x=>digits9(x.phone)===d)||null : null; }
  function confetti(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c=document.createElement('div'); c.className='conf'; const col=['#ff2fd5','#7c3aed','#ffc933','#2fd39a','#41b6ff','#ff6b3d'];
    c.innerHTML=Array.from({length:70},(_,i)=>`<i style="left:${Math.random()*100}%;background:${col[i%6]};animation-delay:${Math.random()*.5}s;animation-duration:${1.4+Math.random()*1.2}s"></i>`).join('');
    document.body.appendChild(c); setTimeout(()=>c.remove(),3200);
  }
  function eye(btn, inp){ btn.addEventListener('click',()=>{ const s=inp.type==='password'; inp.type=s?'text':'password'; btn.textContent=s?'🙈':'👁️'; btn.setAttribute('aria-label',s?'Parolni yashirish':'Parolni ko‘rsatish'); }); }

  window.KA={ROLES,pass,otp,phoneMask,digits9,fmt,maskPhone,users,findUser,session,ensureDemo,addStudent,setPassword,strength,translit,parentSession,families,saveFamily,findFamily,confetti,eye,esc,initials};
})();
