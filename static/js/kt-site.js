/* Mavjud sayt sahifalarini platformaga ulash (TZ: F-3.1 — ariza va aloqa formalari → lead).
   Ariza endi “qabul qilindi” deb yozib qolmaydi: CRM da administrator navbatiga tushadi. */
(function(){
  if(!window.KT || !window.KTD) return;
  const D = KTD;
  function courseId(title){
    const t=String(title||'').toLowerCase();
    return /taekv|tekvand|taekwond/.test(t)?'taekwondo':/gimnast/.test(t)?'gymnastics':'maktab';
  }
  function addLead(o){
    const lead=Object.assign({id:'L-'+(1100+Math.floor(Math.random()*800)), child:'Farzand', age:null, branch:null, time:'', stage:'new', createdAt:Date.now()}, o);
    KT.store.update('leads', arr=>[lead].concat(arr||[]), []);
    return lead;
  }
  // “Ariza qoldirish” modal oynasi
  if(typeof window.submitAriza==='function'){
    const orig=window.submitAriza;
    window.submitAriza=function(){
      const n=(document.getElementById('ariza-ism')||{}).value||''; const p=(document.getElementById('ariza-tel')||{}).value||''; const k=(document.getElementById('ariza-kurs')||{}).value||'';
      orig.apply(this, arguments);
      if(n.trim() && p.trim()){ const l=addLead({parent:n.trim(), phone:p.trim(), want:courseId(k), source:'Sayt: ariza', note:k?`Qiziqish: ${k}`:'Sayt formasi'}); setTimeout(()=>KT.toast(`Ariza ${l.id} CRM ga tushdi — administrator 15 daqiqa ichida bog‘lanadi`), 600); }
    };
  }
  // Aloqa formasi (capture — forma o‘zini tozalashidan oldin o‘qiymiz)
  document.addEventListener('submit', e=>{
    const f=e.target; if(!(f instanceof HTMLFormElement)) return;
    const ph=f.querySelector('input[name="phone"]'), nm=f.querySelector('input[name="name"]'); if(!ph||!nm||!ph.value.trim()||!nm.value.trim()) return;
    const subj=(f.querySelector('[name="subject"]')||{}).value||''; const msg=(f.querySelector('[name="message"]')||{}).value||'';
    addLead({parent:nm.value.trim(), phone:ph.value.trim(), want:courseId(subj), source:'Sayt: aloqa', note:(subj?subj+': ':'')+msg.slice(0,120)});
  }, true);
})();
