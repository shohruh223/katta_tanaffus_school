/* AI qabul assistenti (TZ: AI-01, F-3.2) — Katta Tanaffus maktabi uchun.
   • Faqat bazadagi faktlardan javob beradi (AI-G5): sinflar, bo‘sh o‘rinlar, to‘garaklar, filiallar — KTD dan.
   • Fanlar darslarda o‘tiladi — alohida kurs sotilmaydi. Pullik to‘garak: Taekwondo va Gimnastika.
   • Narxni o‘zi aytmaydi — qabul bo‘limiga yo‘naltiradi va ariza yaratadi (AC-12).
   • Foydalanuvchi matni ekranlanadi. Natija: CRM dagi qabul arizasi (admin.html). */
(function(){
  if(!window.KT || !window.KTD) return;
  const {esc, store} = KT; const D = KTD;
  const S = Object.assign({age:null, grade:null, want:null, branch:null, name:null, phone:null, slot:null, leadId:null, stage:'start'}, safeRead());
  function safeRead(){ try{ return JSON.parse(sessionStorage.getItem('ktp:assist2')||'{}'); }catch(e){ return {}; } }
  function save(){ try{ sessionStorage.setItem('ktp:assist2', JSON.stringify(S)); }catch(e){} }

  function norm(t){ return ' '+String(t||'').toLowerCase().replace(/[ʻ'`’]/g,'‘')+' '; }
  function parse(text){
    const t=norm(text);
    const ageM=t.match(/(\d{1,2})\s*(yosh|yoshda|yashar|yoshli|years?)/) || t.match(/(?:yoshi|yosh)\s*(\d{1,2})/);
    if(ageM){ const a=+ageM[1]; if(a>=3&&a<=18) S.age=a; }
    const grM=t.match(/(\d{1,2})\s*-?\s*sinf/); if(grM){ const g=+grM[1]; if(g>=1&&g<=11) S.grade=g; }
    if(/taekvond|tekvand|taekwond|tekvond/.test(t)) S.want='taekwondo';
    else if(/gimnast/.test(t)) S.want='gymnastics';
    else if(/maktab|qabul|sinf|o‘qishga|o‘qitmoq|ingliz|matemat|informat|dastur|robot|mental|fan/.test(t) && !S.want) S.want='maktab';
    for(const b of D.BRANCHES){ if(b.near.some(n=>t.includes(n))){ S.branch=b.id; break; } }
    const ph=String(text).replace(/[\s\-()]/g,'').match(/(\+?998)?(\d{9})\b/);
    if(ph) S.phone='+998 '+ph[2].replace(/(\d{2})(\d{3})(\d{2})(\d{2})/,'$1 $2 $3 $4');
    if(S.want==='maktab' && !S.grade && S.age) S.grade=D.ageToGrade(S.age)||null;
    return t;
  }

  /* ---------- UI ---------- */
  function ensureUI(){
    if(document.getElementById('chatwin')) return;
    const fab=document.createElement('button'); fab.id='fab'; fab.setAttribute('aria-label','AI qabul assistenti'); fab.innerHTML='<img src="static/img/ai-bot.png" alt="">';
    fab.onclick=()=>window.toggleChat();
    const w=document.createElement('div'); w.id='chatwin'; w.setAttribute('role','dialog'); w.setAttribute('aria-label','AI qabul assistenti');
    w.innerHTML=`<div class="chdr"><div class="chdri"><div class="chav">🤖</div><div><div class="cname">KATTA TANAFFUS AI</div><div class="cst"><span class="stdot"></span>Qabul assistenti</div></div></div><button class="cx" aria-label="Yopish">✕</button></div>
      <div class="cmsgs" id="chat-msgs" aria-live="polite"></div><div class="qrps" id="qrps"></div>
      <div class="cinp"><input type="text" id="chat-input" placeholder="Savolingizni yozing…" aria-label="Xabar"><button class="csend" aria-label="Yuborish">➤</button></div>`;
    document.body.appendChild(fab); document.body.appendChild(w);
    w.querySelector('.cx').onclick=()=>window.toggleChat();
    w.querySelector('.csend').onclick=()=>window.sendChat();
    w.querySelector('#chat-input').addEventListener('keydown',e=>{ if(e.key==='Enter') window.sendChat(); });
  }
  const box=()=>document.getElementById('chat-msgs');
  function bubble(html, role){ const el=box(); if(!el) return; const d=document.createElement('div'); d.className='cmsg '+role; d.innerHTML=`<div class="mav">${role==='bot'?'🤖':'👤'}</div><div class="mbub">${html}</div>`; el.appendChild(d); el.scrollTop=el.scrollHeight; }
  function quick(list){ const q=document.getElementById('qrps'); if(!q) return; q.style.display=list&&list.length?'flex':'none'; q.innerHTML=(list||[]).map(x=>`<button class="qr" type="button">${esc(x)}</button>`).join(''); q.querySelectorAll('button').forEach(b=>b.onclick=()=>send(b.textContent)); }
  function botSay(html, chips){ const el=box(); if(!el) return; const t=document.createElement('div'); t.className='cmsg bot'; t.innerHTML='<div class="mav">🤖</div><div class="mbub">…</div>'; el.appendChild(t); el.scrollTop=el.scrollHeight; setTimeout(()=>{ t.remove(); bubble(html,'bot'); quick(chips); },480); }

  const CLUBTXT = ()=>D.CLUBS.map(c=>`• <b>${c.emoji} ${esc(c.title)}</b> — ${c.ageMin}–${c.ageMax} yosh`).join('<br>');
  function reply(text){
    const t=parse(text);
    if(/o‘zimni|o‘ldir|urish|zo‘rav|haqorat qil|bezoril/.test(t)) return ['Bu muhim mavzu. Men bu bo‘yicha maslahat bermayman — mas’ul xodimimiz bilan hoziroq bog‘laning: <b>+998 71 234-56-78</b>. Xavf bo‘lsa — 102 yoki 103.', []];
    if(S.stage==='contact'){
      if(!S.phone){ const nm=String(text).trim().split(/[,\s]+/)[0]; if(nm && /^[A-Za-zА-Яа-яЎўҚқҒғҲҳʻ‘’'-]{2,}$/.test(nm)) S.name=nm; return ['Telefon raqamingizni yozing (masalan, 90 123 45 67) — qabul bo‘limi shu raqamga qo‘ng‘iroq qiladi.', []]; }
      if(!S.name){ const nm=String(text).replace(/[+\d\s\-()]/g,' ').trim().split(/\s+/)[0]; if(nm && nm.length>1) S.name=nm; }
      return createLead();
    }
    if(/^(sh(anba)?\s*)?(11:00|15:00)$/.test(String(text).trim().toLowerCase())){ S.slot=/15/.test(t)?'Shanba 15:00':'Shanba 11:00'; S.stage='contact'; return [`Yaxshi, <b>${esc(S.slot)}</b> ga band qilaman. Ismingiz va telefon raqamingiz?`, []]; }
    if(/narx|qancha|to‘lov|necha pul|kontrakt|price/.test(t)) return ['O‘qish to‘lovi va to‘garak narxlari sinf va filialga qarab belgilanadi — aniq summani qabul bo‘limi aytadi: <b>+998 71 234-56-78</b>. Arizangizni yozib qo‘yaymi? Ular o‘zlari qo‘ng‘iroq qilishadi.', ['Ha, ariza qoldiraman', S.want==='taekwondo'?'Taekwondo haqida':S.want==='gymnastics'?'Gimnastika haqida':'Sinflar haqida']];
    if(/chegirma|skidka|aka-uka|ikki farzand/.test(t)) return ['Chegirmalar (masalan, aka-uka uchun) moliya bo‘limi tasdiqlagan qoidalar bo‘yicha beriladi — aniq shartni qabul bo‘limi aytadi. Arizangizni yozib qo‘yaymi?', ['Ha, ariza qoldiraman']];
    if(/ha, ariza|ariza qoldir/.test(t)){ S.stage='contact'; return ['Ismingiz va telefon raqamingiz?', []]; }
    if(/manzil|filial|qayerda|adres/.test(t) && !S.want) return ['Filiallarimiz:<br>'+D.BRANCHES.map(b=>`• <b>${esc(b.name)}</b> — ${esc(b.address)}, ${esc(b.hours)}`).join('<br>')+'<br>Qaysi biri sizga yaqin?', D.BRANCHES.slice(0,3).map(b=>b.name)];
    if(/kurs|ielts/.test(t) && /ingliz|matemat|informat|dastur|robot|mental|ielts/.test(t)) return ['Bu fan maktab dasturida — darslarda o‘tiladi, alohida kurs sotilmaydi. Farzandingizni maktabga qabul qilishimiz mumkin: nechanchi sinfga?', ['1-sinf','5-sinf','9-sinf']];
    if(/to‘garak|sport|kurs/.test(t) && !['taekwondo','gymnastics'].includes(S.want)) return ['Bizda fanlar maktab darslarida o‘tiladi — alohida kurs sotilmaydi. Darsdan keyingi to‘garaklar:<br>'+CLUBTXT()+'<br>Qaysi biri qiziqtiradi?', ['Taekwondo','Gimnastika']];
    if(/qanday fan|fanlar|dastur|sinflar haqida/.test(t)) return ['Davlat ta’lim standartidagi barcha fanlar va kuchaytirilgan yo‘nalishlar: '+D.SUBJECTS.filter(s=>s.id!=='pe').map(s=>`${s.emoji} ${esc(s.title)} (${esc(s.grades)})`).join(', ')+'. Hammasi darslarning ichida. Farzandingiz nechanchi sinfga?', ['1-sinf','5-sinf','9-sinf']];
    if(/savolim bor/.test(t)) return ['Marhamat: qabul, sinflar, to‘garaklar, filiallar yoki xavfsizlik haqida so‘rang.', ['Qanday fanlar bor?','To‘garaklar','Filiallar']];

    if(!S.want && !S.age && !S.grade) return ['Assalomu alaykum! Maktabga qabul yoki to‘garak (Taekwondo, Gimnastika) — qaysi biri qiziqtiradi? Farzandingiz necha yoshda?', ['5-sinfga qabul','Taekwondo','Gimnastika']];
    if(!S.want) S.want='maktab';

    // maktabga qabul
    if(S.want==='maktab'){
      if(!S.grade) return ['Farzandingiz nechanchi sinfga o‘qishga kiradi?', ['1-sinf','3-sinf','5-sinf','7-sinf','10-sinf']];
      if(!S.branch) return [`${S.grade}-sinf — yaxshi. Qaysi filial sizga yaqin? (Yunusobod, Novza, Samarqand)`, ['Yunusobod','Novza','Samarqand']];
      const recs=KT.ai.recommend({want:'maktab', grade:S.grade, branch:S.branch}).filter(r=>r.g.branch===S.branch);
      const lines=recs.length?recs.map(r=>`• <b>${esc(r.g.name)}</b> — ${r.free} o‘rin bo‘sh`).join('<br>'):`Hozir ${esc(D.branch(S.branch).name)} filialida ${S.grade}-sinflarda bo‘sh o‘rin yo‘q — kutish ro‘yxatiga yozamiz yoki boshqa filialni taklif qilamiz.`;
      S.stage='offer';
      return [`${esc(D.branch(S.branch).name)} filiali, ${S.grade}-sinf:<br>${lines}<br><br>Keyingi qadam — <b>bepul diagnostika va qabul suhbati</b> (30–40 daqiqa). Shanba 11:00 yoki 15:00?`, ['Shanba 11:00','Shanba 15:00','Avval savolim bor']];
    }
    // to‘garak
    const c=D.club(S.want);
    if(!S.age) return [`${c.emoji} <b>${esc(c.title)}</b> — ${c.ageMin}–${c.ageMax} yosh. ${esc(c.desc)}<br>Farzandingiz necha yoshda?`, ['6 yosh','9 yosh','12 yosh']];
    if(S.age<c.ageMin||S.age>c.ageMax){ const alt=D.CLUBS.find(x=>x.id!==c.id && S.age>=x.ageMin && S.age<=x.ageMax); return [`${esc(c.title)} ${c.ageMin}–${c.ageMax} yoshlilar uchun.${alt?` ${S.age} yoshga <b>${esc(alt.title)}</b> mos keladi.`:''}`, alt?[alt.title]:[]]; }
    if(!S.branch) return ['Qaysi filial sizga yaqin?', ['Yunusobod','Novza','Samarqand']];
    const recs=KT.ai.recommend({want:S.want, age:S.age, branch:S.branch});
    if(!recs.length) return [`Hozir ${esc(c.title)} guruhlarida bo‘sh o‘rin yo‘q. Arizangizni yozib qo‘yamiz — joy ochilganda xabar beramiz.`, ['Ha, ariza qoldiraman']];
    S.stage='offer';
    return [`${c.emoji} ${esc(c.title)} guruhlari:<br>`+recs.slice(0,2).map(r=>`• <b>${esc(r.g.name)}</b> — ${esc(r.g.days)} ${esc(r.g.time)}, ${esc(D.branch(r.g.branch).name)} (${r.free} o‘rin)`).join('<br>')+'<br><br>Avval <b>bepul sinov mashg‘uloti</b>. Shanba 11:00 yoki 15:00?', ['Shanba 11:00','Shanba 15:00']];
  }

  function createLead(){
    const lead={id:'L-'+(1043+Math.floor(Math.random()*900)), parent:S.name||'Mehmon', phone:S.phone||'—', child:'Farzand', age:S.age, grade:S.want==='maktab'?S.grade:null, want:S.want||'maktab', branch:S.branch, time:'', source:'AI assistent', stage:S.slot?'diagnostic':'new', createdAt:Date.now(), note:S.slot?`${S.want==='maktab'?'Diagnostika va qabul suhbati':'Sinov mashg‘uloti'}: ${S.slot}`:'Saytdagi AI assistent orqali', fromAssistant:true};
    store.update('leads', arr=>[lead].concat(arr||[]), []);
    S.leadId=lead.id; S.stage='done'; save();
    const sc=KT.ai.leadScore(lead);
    const what=lead.want==='maktab'?`${lead.grade?lead.grade+'-sinfga qabul':'Maktabga qabul'}`:D.WANT[lead.want];
    return [`Ariza yaratildi ✅ <b>${esc(lead.id)}</b><br>${esc(what)}${S.branch?', '+esc(D.branch(S.branch).name)+' filiali':''}${S.slot?'<br>Vaqt: <b>'+esc(S.slot)+'</b>':''}<br>Qabul bo‘limi ish vaqtida 15 daqiqa ichida bog‘lanadi.<br><small style="opacity:.7">Demo: ariza CRM da “${KT.TEMP[sc.temp].t}” — <a href="admin.html" style="color:inherit">administrator ekranini ochish</a></small>`, lead.want==='maktab'?['Diagnostikani hozir sinab ko‘rish','Rahmat!']:['Rahmat!']];
  }
  function send(text){
    text=String(text||'').trim(); if(!text) return;
    if(/diagnostikani hozir/i.test(text)){ location.href='diagnostika.html'; return; }
    if(/^rahmat/i.test(text)){ bubble(esc(text),'user'); botSay('Sizga ham rahmat! Savol bo‘lsa — shu yerdaman 🙂', []); return; }
    bubble(esc(text),'user'); quick([]);
    const [html, chips]=reply(text); save(); botSay(html, chips);
  }
  let open=false;
  window.toggleChat=function(){ ensureUI(); open=!open; const w=document.getElementById('chatwin'); w.style.display=open?'flex':'none'; if(open){ if(!box().children.length) greet(); setTimeout(()=>{ const i=document.getElementById('chat-input'); if(i) i.focus(); },50); } };
  window.openChat=function(){ if(!open) window.toggleChat(); };
  window.sendChat=function(){ const i=document.getElementById('chat-input'); if(!i) return; const v=i.value; i.value=''; send(v); };
  window.sendQuick=function(t){ send(t); };
  function greet(){ bubble('Assalomu alaykum! Men Katta Tanaffus maktabining qabul assistentiman. 1–11-sinflarga qabul, Taekwondo va Gimnastika to‘garaklari, filiallar bo‘yicha javob beraman.','bot'); quick(['5-sinfga qabul','Taekwondo','Gimnastika','Filiallar']); }
  window.KTAssistant={ open(prefill){ ensureUI(); if(!open) window.toggleChat(); if(prefill) setTimeout(()=>send(prefill),400); }, reset(){ Object.assign(S,{age:null,grade:null,want:null,branch:null,name:null,phone:null,slot:null,leadId:null,stage:'start'}); save(); } };
  function init(){ ensureUI(); const m=box(); if(m){ m.innerHTML=''; greet(); } const w=document.getElementById('chatwin'); if(w) w.style.display='none'; document.querySelectorAll('#chatwin .cmic').forEach(b=>b.remove()); if(new URLSearchParams(location.search).get('assistant')==='1') setTimeout(()=>window.KTAssistant.open(),300); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
