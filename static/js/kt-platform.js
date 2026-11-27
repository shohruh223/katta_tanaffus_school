/* Katta Tanaffus platformasi — umumiy yadro.
   • KT.store   — demo “backend”: localStorage + tablar orasida jonli sinxron (storage hodisasi)
   • KT.ai      — lead baholash (AI-02) va guruh tavsiyasi (AI-04) qoidalari
   • KT.phone   — Telegram uslubidagi telefon maketi
   • Demo panel — rol almashtirgich va “Investor turi” (bosqichma-bosqich ko‘rsatish)
   Haqiqiy tizimda store o‘rniga /api/v1/ chaqiruvlari bo‘ladi (TZ, 17-bo‘lim). */
(function(){
  const D = window.KTD;
  const PREFIX = 'ktp:';
  const VERSION = '2.0.0';
  const listeners = [];

  /* ---------- yordamchilar ---------- */
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num = n => Math.round(Number(n)||0).toLocaleString('ru-RU').replace(/ /g,' ');
  const money = n => num(n)+' so‘m';
  const initials = name => String(name||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  const avatar = (name,color,size) => `<span class="kp-av" style="--av:${color||'#7c3aed'};${size?`width:${size}px;height:${size}px;font-size:${Math.round(size*.38)}px`:''}" aria-hidden="true">${esc(initials(name))}</span>`;
  const pad = n => String(n).padStart(2,'0');
  const hm = d => pad(d.getHours())+':'+pad(d.getMinutes());
  const DAYS = ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'];
  const MONTHS = ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'];
  const today = () => { const d=new Date(); return `${DAYS[d.getDay()]}, ${d.getDate()}-${MONTHS[d.getMonth()]}`; };
  const ago = ts => { const m=Math.max(0,Math.round((Date.now()-ts)/60000)); if(m<1) return 'hozir'; if(m<60) return m+' daq oldin'; const h=Math.round(m/60); if(h<24) return h+' soat oldin'; return Math.round(h/24)+' kun oldin'; };
  const uid = p => (p||'id')+'-'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  const WD = {Ya:0,Du:1,Se:2,Chor:3,Pa:4,Ju:5,Sh:6};
  const groupDays = g => { if(g.days.includes('–')){ const [a,b]=g.days.split('–'); const r=[]; for(let i=WD[a];i<=WD[b];i++) r.push(i); return r; } return g.days.split('/').map(x=>WD[x]); };
  const dayKey = d => { d=d||new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
  const qs = (s,r) => (r||document).querySelector(s);
  const qsa = (s,r) => Array.from((r||document).querySelectorAll(s));
  const page = () => (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /* ---------- store ---------- */
  function get(key, fallback){ try{ const raw=localStorage.getItem(PREFIX+key); return raw==null?fallback:JSON.parse(raw); }catch(e){ return fallback; } }
  function set(key, val){ try{ localStorage.setItem(PREFIX+key, JSON.stringify(val)); }catch(e){} emit(key); return val; }
  function update(key, fn, fallback){ return set(key, fn(get(key, fallback))); }
  function push(key, item, max){ return update(key, arr=>{ arr=arr||[]; arr.unshift(item); return max?arr.slice(0,max):arr; }, []); }
  function on(keys, fn){ listeners.push({keys:[].concat(keys), fn}); }
  function emit(key){ listeners.forEach(l=>{ if(l.keys.includes(key)||l.keys.includes('*')) try{ l.fn(key); }catch(e){ console.error(e); } }); }
  window.addEventListener('storage', e=>{ if(e.key && e.key.startsWith(PREFIX)){ const k=e.key.slice(PREFIX.length); emit(k); if(k==='events') pulse(); } });

  function seed(force){
    if(!force && get('version')===VERSION) return;
    const now = Date.now();
    set('leads', D.LEADS.map(l=>({...l, createdAt: now - l.minutesAgo*60000})));
    set('invoices', D.INVOICES.map(i=>({...i})));
    set('attendance', {});
    set('suggestions', null);
    set('rewardOrders', [
      {id:'RO-1', child:'sardor', reward:'book', status:'requested', ts: now - 3*3600000}
    ]);
    set('coins', {sardor: D.FAMILY.children[0].coins, madina: D.FAMILY.children[1].coins});
    set('ledger', [
      {child:'sardor', delta:+3, reason:'Uy vazifasi o‘z vaqtida (ingliz tili)', ts: now-26*3600000},
      {child:'sardor', delta:+2, reason:'Darsga keldi', ts: now-26*3600000},
      {child:'sardor', delta:+4, reason:'Test, 1-urinish: 7/10', ts: now-50*3600000},
      {child:'madina', delta:+2, reason:'Darsga keldi', ts: now-30*3600000}
    ]);
    set('events', [
      {id:'e1', child:'sardor', kind:'report', title:'Haftalik hisobot', text:'Sardor: 5/5 kun maktabda. Ingliz tili 7/10 → 9/10, matematika nazorat ishi — 5. Taekwondo 3/3.', ts: now-3*86400000},
      {id:'e2', child:'madina', kind:'grade', title:'Yangi baho', text:'Madina: mental arifmetika, “Kichik do‘stlar” testi — 8/10. O‘qituvchi: “Tezligi oshdi”.', ts: now-30*3600000},
      {id:'e3', child:'sardor', kind:'attendance', title:'Maktabda', text:'Sardor maktabga keldi (08:24). +2 coin.', ts: now-26*3600000}
    ]);
    set('diag', null);
    set('enroll', null);
    set('practice', {sardor:{streak:5, today:0}});
    set('goal', {child:'sardor', text:'3 ta mavzu “O‘zlashtirdi” bo‘lsa — oilaviy hayvonot bog‘iga sayohat', target:3, done:1});
    set('excuses', {});
    set('seen', now - 2*86400000);
    set('consents', {data:true, ai:true, notify:true, sms:true, photo:false, marketing:false, hideName:true, screen:15});
    set('grades', null);
    set('mastery', null);
    set('journal', null);
    set('version', VERSION);
  }

  /* ---------- AI qoidalari (demo; haqiqiy tizimda — model + jurnal AI-G1) ---------- */
  const ai = {
    // AI-02: lead baholash. Faqat navbat tartibini belgilaydi, leadni o‘chirmaydi.
    leadScore(l){
      let s=0; const why=[];
      if(l.age){ s+=15; why.push('yosh aniq'); }
      if(l.want){ s+=15; why.push(l.want==='maktab'?'maktabga qabul':'to‘garak tanlangan'); }
      if(l.grade){ s+=5; why.push(l.grade+'-sinf aniq'); }
      if(l.branch){ s+=15; why.push('filial aniq'); }
      if(l.time){ s+=7; why.push('qulay vaqt aytilgan'); }
      if(/telegram|qo‘ng‘iroq|assistent/i.test(l.source||'')){ s+=10; why.push('faol kanal'); } else if(/sayt/i.test(l.source||'')) s+=6; else s+=3;
      const mins=(Date.now()-(l.createdAt||Date.now()))/60000;
      if(mins<60){ s+=15; why.push('yangi ariza'); } else if(mins<1440) s+=8;
      if(/\d{1,2}[:.]\d{2}|kechki|ishdan keyin|shanba/i.test(l.note||'')){ s+=8; why.push('aniq vaqt so‘ragan'); }
      if(l.diag){ s+=12; why.push('diagnostikadan o‘tgan'); }
      if(['diagnostic','trial'].includes(l.stage)) s+=8;
      s=Math.min(99,s);
      const temp = s>=70?'hot':s>=45?'warm':'cold';
      const next = temp==='hot' ? (l.want==='maktab'?'15 daqiqa ichida qo‘ng‘iroq qiling: bepul diagnostika va qabul suhbatini taklif qiling':'15 daqiqa ichida qo‘ng‘iroq qiling va sinov mashg‘ulotini taklif qiling')
                 : temp==='warm' ? 'Bugun qo‘ng‘iroq qiling; sinf, filial va vaqtni aniqlang'
                 : 'Telegramda eslatma yuboring; javob bo‘lmasa 30 kundan keyin qayta aloqa';
      return {score:s, temp, why, next};
    },
    // AI-04: sinf va guruh tavsiyasi — 1–3 variant; to‘lgan sinf/guruh taklif qilinmaydi; tasdiq — administratorda.
    recommend({want, grade, age, branch}){
      if(want==='maktab' || !want){
        const g = grade || (age?D.ageToGrade(age):null);
        return D.CLASSES.filter(c=>(!g||c.grade===g) && c.enrolled<c.cap).map(c=>{
          let s=50; const why=[`${c.grade}-sinf`];
          if(branch){ if(c.branch===branch){ s+=30; why.push(D.branch(c.branch).name+' filiali'); } else s-=10; }
          const free=c.cap-c.enrolled; s+=Math.min(15,free*3); why.push(free<=2?`faqat ${free} o‘rin`:`${free} o‘rin bo‘sh`);
          return {kind:'class', g:{...c, title:c.name+' sinf', time:'08:30', days:'Du–Sh'}, score:Math.max(5,Math.min(98,s)), why, free};
        }).sort((a,b)=>b.score-a.score).slice(0,3);
      }
      return D.CLUB_GROUPS.filter(g=>g.club===want && g.enrolled<g.cap).map(g=>{
        let s=40; const why=[];
        if(age){ if(age>=g.ageMin && age<=g.ageMax){ s+=30; why.push(`${g.ageMin}–${g.ageMax} yosh`); } else s-=25; }
        if(branch){ if(g.branch===branch){ s+=20; why.push(D.branch(g.branch).name+' filiali'); } else s-=8; }
        const free=g.cap-g.enrolled; why.push(free<=2?`faqat ${free} o‘rin`:`${free} o‘rin bo‘sh`);
        return {kind:'club', g:{...g, title:g.name}, score:Math.max(5,Math.min(98,s)), why, free};
      }).sort((a,b)=>b.score-a.score).slice(0,3);
    },
    level(p){ return D.levelOf(p); }
  };
  const TEMP = {hot:{t:'Issiq', i:'🔥'}, warm:{t:'Iliq', i:'🌤️'}, cold:{t:'Sovuq', i:'❄️'}};

  /* ---------- xabarlar (ota-onaga) ---------- */
  function notifyParent(ev){
    const d=new Date(); const h=d.getHours();
    const quiet = (h>=21||h<8) && ev.kind!=='safety'; // SR-08: 21:00–08:00 jim vaqt
    const item = {id:uid('e'), ts:Date.now(), quiet, ...ev};
    push('events', item, 60);
    return item;
  }

  /* ---------- toast ---------- */
  let toastEl, toastT;
  function toast(msg, kind){
    if(!toastEl){ toastEl=document.createElement('div'); toastEl.className='kp-toast'; toastEl.setAttribute('role','status'); document.body.appendChild(toastEl); }
    toastEl.textContent=msg; toastEl.dataset.kind=kind||''; toastEl.classList.add('show');
    clearTimeout(toastT); toastT=setTimeout(()=>toastEl.classList.remove('show'), 3200);
  }
  function pulse(){ qsa('[data-kp-bell]').forEach(b=>{ b.classList.remove('ring'); void b.offsetWidth; b.classList.add('ring'); }); }

  /* ---------- telefon maketi (Telegram uslubi) ---------- */
  function phone(el, opts){
    opts=opts||{};
    el.classList.add('kp-phone');
    el.innerHTML = `<div class="kp-phone-notch"></div>
      <div class="kp-phone-screen">
        <div class="kp-tg-head"><span class="kp-tg-back" aria-hidden="true">‹</span>${avatar(opts.title||'KT','#ff2fd5',34)}<div><b>${esc(opts.title||'Katta Tanaffus')}</b><small>${esc(opts.sub||'bot')}</small></div></div>
        <div class="kp-tg-body" aria-live="polite"></div>
        <div class="kp-tg-input"><span>Xabar</span><i aria-hidden="true">🎤</i></div>
      </div>`;
    const body = el.querySelector('.kp-tg-body');
    const api = {
      body,
      add(m){
        const row=document.createElement('div');
        if(m.sep){ row.className='kp-tg-sep'; row.textContent=m.sep; body.appendChild(row); body.scrollTop=body.scrollHeight; return row; }
        row.className='kp-tg-msg '+(m.me?'me':'bot')+(m.alert?' alert':'');
        row.innerHTML = `${m.label?`<span class="kp-tg-label">${esc(m.label)}</span>`:''}<div class="kp-tg-text">${m.html||esc(m.text)}</div><span class="kp-tg-time">${esc(m.time||hm(new Date()))}${m.me?' ✓✓':''}</span>${m.buttons?`<div class="kp-tg-kb">${m.buttons.map(b=>`<span>${esc(b)}</span>`).join('')}</div>`:''}`;
        body.appendChild(row); body.scrollTop=body.scrollHeight; return row;
      },
      typing(){ const t=document.createElement('div'); t.className='kp-tg-msg bot typing'; t.innerHTML='<i></i><i></i><i></i>'; body.appendChild(t); body.scrollTop=body.scrollHeight; return ()=>t.remove(); },
      clear(){ body.innerHTML=''; }
    };
    return api;
  }

  /* ---------- rollar, demo panel, investor turi ---------- */
  const ROLES = [
    {id:'guest', name:'Mehmon', icon:'🌐', href:'index.html', color:'#ff2fd5', who:'Sayt va AI assistent'},
    {id:'parent', name:'Ota-ona', icon:'👩‍👦', href:'ota-ona.html', color:'#229ED9', who:'Malika Yusupova'},
    {id:'student', name:'O‘quvchi', icon:'🎒', href:'bilim.html', color:'#d61bb6', who:'Sardor, 11 yosh'},
    {id:'teacher', name:'O‘qituvchi', icon:'🧑‍🏫', href:'oqituvchi.html', color:'#0f9f6e', who:'Dilnoza Karimova'},
    {id:'admin', name:'Administrator', icon:'🗂️', href:'admin.html', color:'#e8890c', who:'Qabul bo‘limi · Yunusobod'},
    {id:'director', name:'Rahbar', icon:'📈', href:'rahbar.html', color:'#331459', who:'Barcha filiallar'}
  ];
  const TOUR = [
    {page:'index.html', role:'Ota-ona', title:'Du 21:10 — ariza', text:'Malika opa saytda AI assistentga yozadi: “O‘g‘lim 11 yoshda, 5-sinfga, Yunusobodga yaqin maktab kerak”. Assistent bo‘sh o‘rinli sinflarni aytadi va qabul arizasini yaratadi.', act:'Assistentni ochish', run:()=>{ if(window.KTAssistant) KTAssistant.open('O‘g‘lim 11 yoshda, 5-sinfga, Yunusobodga yaqin maktab kerak'); }},
    {page:'admin.html', role:'Administrator', title:'Se 10:00 — ariza “issiq”', text:'Qabul arizasi CRM ga tushdi. AI uni baholadi va keyingi qadamni aytdi. Administrator bir bosishda diagnostika va suhbatga yozadi.'},
    {page:'diagnostika.html', role:'O‘quvchi', title:'Sh 11:00 — adaptiv test', text:'Ingliz tili bo‘yicha adaptiv test: savol qiyinligi javobga qarab o‘zgaradi. Oxirida — daraja, zaif mavzular va bo‘sh o‘rinli sinflar.'},
    {page:'yozilish.html', role:'Ota-ona', title:'Sh 11:30 — qabul arizasi', text:'Farzand, sinf, filial va AI tavsiya qilgan sinf; xohlasa — Taekwondo yoki Gimnastika to‘garagi. Rozilik va qabul suhbati vaqti.'},
    {page:'oqituvchi.html', role:'O‘qituvchi', title:'2-hafta, Du 11:05 — davomat', text:'4-dars, 5-A sinf: “hammasi keldi” + istisno. Kelmagan bolaning ota-onasiga xabar avtomatik ketadi. Ota-ona kabinetini yonma-yon tabda oching — xabar jonli keladi.', act:'Ota-ona ekranini yangi tabda ochish', run:()=>window.open('ota-ona.html','_blank')},
    {page:'bilim.html', role:'O‘quvchi', title:'Chor 19:40 — uyda 5 daqiqa', text:'Ingliz tili bilim xaritasi zaif mavzuni topadi va 5 daqiqalik mashq beradi. 13 yoshgacha erkin AI suhbat yo‘q.'},
    {page:'ota-ona.html', role:'Ota-ona', title:'Ju 18:00 — haftalik hisobot', text:'Davomat, baholar va to‘garak — jurnaldan; matnni AI tayyorlaydi, sinf rahbari izoh qo‘shadi. Plyus: “kechki savol” va oilaviy maqsad.'},
    {page:'rahbar.html', role:'Rahbar', title:'Butun tarmoq bitta panelda', text:'Qabul, qolish, to‘lov va filiallar taqqoslovi. Ismlar yo‘q — faqat agregat raqamlar.'}
  ];
  function tourState(){ return get('tour', null); }
  function tourStart(){ set('tour', {i:0}); location.href = TOUR[0].page; }
  function tourStop(){ set('tour', null); qsa('.kp-tour').forEach(e=>e.remove()); }
  function mountTour(){
    const st=tourState(); if(!st) return;
    const step=TOUR[st.i]; if(!step || step.page!==page()) return;
    const el=document.createElement('div'); el.className='kp-tour'; el.setAttribute('role','dialog'); el.setAttribute('aria-label','Investor turi');
    const last = st.i===TOUR.length-1;
    el.innerHTML = `<div class="kp-tour-top"><span class="kp-tour-step">${st.i+1}/${TOUR.length} · ${esc(step.role)}</span><button class="kp-tour-x" aria-label="Turni yopish">✕</button></div>
      <h4>${esc(step.title)}</h4><p>${esc(step.text)}</p>
      <div class="kp-tour-dots">${TOUR.map((_,i)=>`<i class="${i<=st.i?'on':''}"></i>`).join('')}</div>
      <div class="kp-tour-acts">${step.act?`<button class="kp-btn kp-btn-ghost kp-btn-sm" data-act>${esc(step.act)}</button>`:''}<button class="kp-btn kp-btn-brand kp-btn-sm" data-next>${last?'Turni yakunlash':'Keyingi: '+esc(TOUR[st.i+1].role)}</button></div>`;
    document.body.appendChild(el);
    el.querySelector('.kp-tour-x').onclick=tourStop;
    if(step.act) el.querySelector('[data-act]').onclick=step.run;
    el.querySelector('[data-next]').onclick=()=>{ if(last){ tourStop(); location.href='platforma.html#rollar'; } else { set('tour',{i:st.i+1}); location.href=TOUR[st.i+1].page; } };
  }
  function mountDock(){
    if(qs('.kp-dock')) return;
    const cur = document.body.dataset.role;
    const d=document.createElement('div'); d.className='kp-dock';
    d.innerHTML = `<button class="kp-dock-btn" aria-expanded="false" aria-controls="kpDockPop"><span class="kp-dock-live"></span>Demo</button>
      <div class="kp-dock-pop" id="kpDockPop" hidden>
        <div class="kp-dock-h">Rolni almashtiring</div>
        ${ROLES.map(r=>`<a href="${r.href}" class="${r.id===cur?'cur':''}" style="--rc:${r.color}"><span>${r.icon}</span><b>${esc(r.name)}</b><small>${esc(r.who)}</small></a>`).join('')}
        <div class="kp-dock-sep"></div>
        <button data-tour>▶ Investor turi (8 qadam)</button>
        <a href="platforma.html" class="plain">Platforma haqida</a>
        <a href="pitch.html" class="plain">Taqdimot rejimi</a>
        <button data-reset class="plain">Demo ma’lumotni tiklash</button>
      </div>`;
    document.body.appendChild(d);
    const btn=d.querySelector('.kp-dock-btn'), pop=d.querySelector('.kp-dock-pop');
    btn.onclick=()=>{ const open=pop.hidden; pop.hidden=!open; btn.setAttribute('aria-expanded',String(open)); };
    document.addEventListener('click',e=>{ if(!d.contains(e.target)){ pop.hidden=true; btn.setAttribute('aria-expanded','false'); } });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ pop.hidden=true; btn.setAttribute('aria-expanded','false'); } });
    d.querySelector('[data-tour]').onclick=tourStart;
    d.querySelector('[data-reset]').onclick=()=>{ seed(true); try{ localStorage.removeItem(PREFIX+'parentSession'); }catch(e){} toast('Demo ma’lumotlar boshlang‘ich holatga qaytdi'); setTimeout(()=>location.reload(),600); };
  }

  /* ---------- kabinet yon paneli ---------- */
  function mountSide(opts){
    const side=qs('#kpSide'); if(!side) return;
    const role=ROLES.find(r=>r.id===opts.role)||ROLES[0];
    side.innerHTML = `<a class="kp-brand" href="index.html"><img src="static/img/logo-brand.png" alt="" width="40" height="40"><span><b>Katta Tanaffus</b><small>platforma</small></span></a>
      <div class="kp-rolecard"><span class="kp-roleicon">${role.icon}</span><div><b>${esc(opts.label||role.name+' kabineti')}</b><small>${esc(opts.who||role.who)}</small></div></div>
      <nav class="kp-nav" aria-label="Bo‘limlar">${opts.nav.map(n=>`<a href="${n.href}" ${n.href===opts.active?'class="active" aria-current="page"':''}><span aria-hidden="true">${n.icon}</span>${esc(n.label)}${n.badge?`<em data-badge="${n.badge}"></em>`:''}</a>`).join('')}</nav>
      <div class="kp-side-foot"><a href="platforma.html">✨ Platforma haqida</a><a href="index.html">← Saytga qaytish</a></div>`;
    // ichki havolalar uchun aktiv holat
    const links=qsa('.kp-nav a[href^="#"]', side);
    if(links.length && 'IntersectionObserver' in window){
      const io=new IntersectionObserver(es=>{ es.forEach(en=>{ if(en.isIntersecting){ links.forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+en.target.id)); } }); },{rootMargin:'-30% 0px -60% 0px'});
      links.forEach(a=>{ const t=qs(a.getAttribute('href')); if(t && t.tagName!=='ASIDE') io.observe(t); });
    }
  }

  function bindTopbar(){
    qsa('[data-kp-today]').forEach(e=>e.textContent=today());
  }

  window.KT = {esc,num,money,initials,avatar,hm,today,ago,uid,qs,qsa,page,groupDays,dayKey,MONTHS,DAYS,store:{get,set,update,push,on},seed,ai,TEMP,notifyParent,toast,pulse,phone,ROLES,TOUR,tourStart,tourStop,mountSide,mountDock};

  seed(false);
  function boot(){ bindTopbar(); mountDock(); mountTour(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
