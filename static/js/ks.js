/* Katta Tanaffus — sayt v2 umumiy skripti: mobil menyu, “Ariza qoldirish” oynasi, lead → CRM.
   Arizalar KT.store ga yoziladi va admin.html dagi navbatda darhol ko‘rinadi. */
(function(){
  const $ = (s,r)=>(r||document).querySelector(s);
  const esc = s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  /* ---------- mobil menyu ---------- */
  function initMenu(){
    const b=$('.ks-burger'), m=$('#ksMenu'); if(!b||!m) return;
    const set=open=>{ b.setAttribute('aria-expanded',String(open)); m.classList.toggle('open',open); document.documentElement.style.overflow=open?'hidden':''; document.documentElement.classList.toggle('ks-menu-on',open); };
    b.addEventListener('click',()=>set(b.getAttribute('aria-expanded')!=='true'));
    m.addEventListener('click',e=>{ if(e.target.closest('a')) set(false); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') set(false); });
    matchMedia('(min-width:1280px)').addEventListener('change',e=>{ if(e.matches) set(false); });
  }

  /* ---------- lead yaratish ---------- */
  function courseId(title){
    const t=String(title||'').toLowerCase();
    return /taekv|tekvand|taekwond/.test(t)?'taekwondo':/gimnast/.test(t)?'gymnastics':'maktab';
  }
  function addLead(o){
    if(!window.KT) return {id:'—'};
    const lead=Object.assign({id:'L-'+(1100+Math.floor(Math.random()*800)), child:'Farzand', age:null, branch:null, time:'', stage:'new', createdAt:Date.now()}, o);
    KT.store.update('leads', arr=>[lead].concat(arr||[]), []);
    return lead;
  }
  function phoneOk(v){ return String(v||'').replace(/\D/g,'').length>=9; }

  /* ---------- “Ariza qoldirish” oynasi ---------- */
  let modal;
  function buildModal(){
    if(modal) return modal;
    const grades = Array.from({length:11},(_,i)=>`<option value="${i+1}">${i+1}-sinf</option>`).join('');
    const branches = window.KTD ? KTD.BRANCHES.map(b=>`<option value="${b.id}">${esc(b.name)}</option>`).join('') : '';
    modal=document.createElement('div'); modal.className='ks-modal-bg'; modal.hidden=true;
    modal.innerHTML=`<div class="ks-modal" role="dialog" aria-modal="true" aria-labelledby="ksAH"><button class="ks-modal-x" type="button" aria-label="Yopish">✕</button>
      <div id="ksAB"><h3 id="ksAH">Ariza qoldirish</h3><p style="font-weight:700;color:var(--ink2);margin-top:8px">Qabul bo‘limi ish vaqtida 15 daqiqa ichida qo‘ng‘iroq qiladi.</p>
      <form class="ks-form" novalidate><div class="ks-field"><label for="ksN">Ismingiz</label><input class="ks-input" id="ksN" autocomplete="name" required></div>
      <div class="ks-field"><label for="ksP">Telefon</label><input class="ks-input" id="ksP" inputmode="tel" autocomplete="tel" placeholder="+998 90 123 45 67" required></div>
      <div class="ks-field"><label for="ksC">Nima qiziqtiradi?</label><select class="ks-input" id="ksC"><option value="maktab">Maktabga qabul</option><option value="taekwondo">Taekwondo to‘garagi</option><option value="gymnastics">Gimnastika to‘garagi</option></select></div>
      <div class="ks-field" id="ksGW"><label for="ksG">Qaysi sinfga?</label><select class="ks-input" id="ksG"><option value="">Hali bilmayman</option>${grades}</select></div>
      <div class="ks-field"><label for="ksB">Filial</label><select class="ks-input" id="ksB"><option value="">Farqi yo‘q</option>${branches}</select></div>
      <div class="ks-err" role="alert"></div><button class="ks-btn ks-btn-mag ks-btn-lg" type="submit">Arizani yuborish</button></form></div></div>`;
    document.body.appendChild(modal);
    const close=()=>{ modal.hidden=true; };
    modal.querySelector('.ks-modal-x').onclick=close;
    modal.querySelector('#ksC').addEventListener('change',e=>{ modal.querySelector('#ksGW').hidden=e.target.value!=='maktab'; });
    modal.addEventListener('click',e=>{ if(e.target===modal) close(); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape' && !modal.hidden) close(); });
    modal.querySelector('form').addEventListener('submit',e=>{
      e.preventDefault();
      const n=$('#ksN').value.trim(), p=$('#ksP').value.trim(), c=$('#ksC').value, b=$('#ksB').value, g=+$('#ksG').value||null; const err=modal.querySelector('.ks-err');
      if(n.length<2){ err.textContent='Ismingizni yozing'; $('#ksN').focus(); return; }
      if(!phoneOk(p)){ err.textContent='Telefon raqamni to‘liq kiriting — masalan, 90 123 45 67'; $('#ksP').focus(); return; }
      const W={maktab:'Maktabga qabul',taekwondo:'Taekwondo',gymnastics:'Gimnastika'};
      const l=addLead({parent:n, phone:p, want:c, grade:c==='maktab'?g:null, branch:b||null, source:'Sayt: ariza', note:W[c]+(c==='maktab'&&g?`, ${g}-sinf`:'')});
      $('#ksAB').innerHTML=`<div style="font-size:3rem">🎉</div><h3>Rahmat, ${esc(n)}!</h3><p style="font-weight:700;color:var(--ink2);margin-top:10px;line-height:1.6">Ariza <b>${esc(l.id)}</b> qabul qilindi. Qabul bo‘limi ish vaqtida 15 daqiqa ichida qo‘ng‘iroq qiladi.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px"><a class="ks-btn" href="diagnostika.html">Bepul diagnostikani hozir boshlash</a><button class="ks-btn ks-btn-white" type="button" data-close>Yopish</button></div>`;
      $('#ksAB [data-close]').onclick=close;
    });
    return modal;
  }
  window.openAriza=function(course){
    const m=buildModal(); m.hidden=false;
    if(course){ const sel=$('#ksC'); if(sel && ['maktab','taekwondo','gymnastics'].includes(course)){ sel.value=course; $('#ksGW').hidden=course!=='maktab'; } }
    setTimeout(()=>{ const n=$('#ksN'); if(n) n.focus(); },60);
  };
  document.addEventListener('click',e=>{ const a=e.target.closest('[data-ariza]'); if(a){ e.preventDefault(); window.openAriza(a.getAttribute('data-ariza')||null); } });

  /* ---------- formalar: data-lead ---------- */
  document.addEventListener('submit',e=>{
    const f=e.target; if(!f.matches||!f.matches('form[data-lead]')) return;
    e.preventDefault();
    const get=n=>{ const x=f.querySelector(`[name="${n}"]`); return x?x.value.trim():''; };
    const err=f.querySelector('.ks-err');
    if(get('name').length<2){ if(err) err.textContent='Ismingizni yozing'; f.querySelector('[name=name]').focus(); return; }
    if(!phoneOk(get('phone'))){ if(err) err.textContent='Telefon raqamni to‘liq kiriting — masalan, 90 123 45 67'; f.querySelector('[name=phone]').focus(); return; }
    const l=addLead({parent:get('name'), phone:get('phone'), want:courseId(get('subject')), source:f.dataset.lead||'Sayt', note:(get('subject')?get('subject')+': ':'')+get('message').slice(0,140)});
    f.dispatchEvent(new CustomEvent('ks:lead',{detail:l}));
  });

  /* ---------- footer yili ---------- */
  function year(){ document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear()); }

  window.KS={esc, addLead, courseId};
  function boot(){ initMenu(); year(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
