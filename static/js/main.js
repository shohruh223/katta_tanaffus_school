
const PAGES=['home','courses','about','teachers','ai','gallery','branches','contact'];

// ── LOADING ──
window.addEventListener('load',()=>setTimeout(()=>document.getElementById('loading').classList.add('hidden'),1100));

// ── NAVIGATION ──
function go(page){
  PAGES.forEach(p=>{
    const s=document.getElementById(p);
    if(s){s.style.display='none';s.classList.remove('show');}
  });
  const s=document.getElementById(page);
  if(s){s.style.display='block';s.classList.add('show');window.scrollTo({top:0,behavior:'smooth'});}
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('active',a.dataset.p===page));
  setTimeout(aos,80);
}

// ── MOBILE NAV ──
function togglemob(){document.getElementById('mnav').classList.toggle('open')}
function closemob(){document.getElementById('mnav').classList.remove('open')}

// ── COUNTERS ──
document.querySelectorAll('[data-count]').forEach(el=>{
  const t=parseInt(el.dataset.count),inc=t/60;let c=0;
  const r=setInterval(()=>{c+=inc;if(c>=t){c=t;clearInterval(r)}el.textContent=Math.floor(c).toLocaleString()},16);
});

// ── AOS ──
function aos(){
  document.querySelectorAll('.aos,.aosl,.aosr').forEach(el=>{
    if(el.getBoundingClientRect().top<window.innerHeight*.93)el.classList.add('v');
  });
}
window.addEventListener('scroll',aos);aos();

// ── COURSE FILTER ──
function filter(cat,btn){
  document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('act'));
  btn.classList.add('act');
  document.querySelectorAll('.ccard').forEach(c=>{c.style.display=(cat==='all'||c.dataset.cat===cat)?'block':'none';});
}

// ── TOAST ──
function showToast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2800);
}

// ── MODALS ──
function openMod(type){
  const c=document.getElementById('mod-content');
  if(type==='register'){
    c.innerHTML=`<h2>Ro'yxatdan o'tish 🎓</h2><p>KATTA TANAFFUS SCHOOL ga xush kelibsiz!</p>
    <div class="fg"><label>To'liq ism</label><input type="text" placeholder="Ism va familiya"></div>
    <div class="fg"><label>Telefon</label><input type="tel" placeholder="+998 90 123 45 67"></div>
    <div class="fg"><label>Email</label><input type="email" placeholder="email@example.com"></div>
    <div class="fg"><label>Parol</label><input type="password" placeholder="Kamida 8 ta belgi"></div>
    <button class="btn btn-f" style="width:100%;padding:14px;font-size:1rem;border-radius:50px;margin-top:8px" onclick="closeMod();showToast('✅ Muvaffaqiyatli ro\'yxatdan o\'tdingiz! 🎉')">Ro'yxatdan o'tish</button>
    <p style="text-align:center;margin-top:14px;font-size:.85rem;font-weight:700;color:var(--txm)">Akkountingiz bormi? <a href="#" onclick="openMod('login')" style="color:var(--yd)">Kirish</a></p>`;
  }else{
    c.innerHTML=`<h2>Kirish 👋</h2><p>Akkauntingizga kiring</p>
    <div class="fg"><label>Telefon yoki Email</label><input type="text" placeholder="+998 90 123 45 67"></div>
    <div class="fg"><label>Parol</label><input type="password" placeholder="Parolingiz"></div>
    <button class="btn btn-f" style="width:100%;padding:14px;font-size:1rem;border-radius:50px;margin-top:8px" onclick="closeMod();showToast('✅ Muvaffaqiyatli kirdingiz! 🎉')">Kirish</button>
    <p style="text-align:center;margin-top:14px;font-size:.85rem;font-weight:700;color:var(--txm)">Akkountingiz yo'qmi? <a href="#" onclick="openMod('register')" style="color:var(--yd)">Ro'yxatdan o'ting</a></p>`;
  }
  document.getElementById('mod').classList.add('open');
}
function closeMod(){document.getElementById('mod').classList.remove('open')}
var _mod=document.getElementById('mod'); if(_mod){_mod.addEventListener('click',e=>{if(e.target===e.currentTarget)closeMod()});}
var _tmod=document.getElementById('tmod'); if(_tmod){_tmod.addEventListener('click',e=>{if(e.target===e.currentTarget)_tmod.classList.remove('open')});}
var _cmod=document.getElementById('cmod'); if(_cmod){_cmod.addEventListener('click',e=>{if(e.target===e.currentTarget)_cmod.classList.remove('open')});}

// ── SUBMIT ──
function submitForm(){showToast('✅ Xabaringiz yuborildi! Tez orada bog\'lanamiz. 💛')}

// ── COURSE MODAL ──
const COURSES={
  english:{title:'General English 🇬🇧',color:'#1d4ed8',bg:'#dbeafe',emoji:'🇬🇧',price:'350,000 so\'m/oy',duration:'3 oy',group:'8-10 kishi',age:'7+ yosh',rating:'4.9',desc:'Ushbu kurs ingliz tilini boshlang\'ich va o\'rta darajadan o\'rganmoqchi bo\'lgan o\'quvchilar uchun mo\'ljallangan. Suhbat, grammatika va lug\'at boyitish intensiv tarzda o\'rgatiladi.',topics:['Grammatika asoslari','Kundalik suhbat','Lug\'at boyitish','Yozma ko\'nikma','Tinglash ko\'nikmasi']},
  ielts:{title:'IELTS Tayyorlov 📝',color:'#6d28d9',bg:'#ede9fe',emoji:'📝',price:'400,000 so\'m/oy',duration:'4 oy',group:'6-8 kishi',age:'14+ yosh',rating:'4.8',desc:'IELTS imtihonida 6.0 dan 8.0 gacha ball olishga yo\'naltirilgan intensiv kurs. Listening, Reading, Writing va Speaking bo\'limlari alohida-alohida ishlanaladi.',topics:['Listening strategies','Academic Reading','Task 1 & Task 2 Writing','Speaking band 7+','Mock tests']},
  math:{title:'Chuqurlashtirilgan Matematika 🔢',color:'#065f46',bg:'#d1fae5',emoji:'🔢',price:'300,000 so\'m/oy',duration:'6 oy',group:'6-8 kishi',age:'10-18 yosh',rating:'4.8',desc:'DTM va xalqaro olimpiadalar uchun chuqurlashtirilgan matematika kursi. Mantiqiy fikrlash va muammo yechish ko\'nikmalarini rivojlantiradi.',topics:['Algebra','Geometriya','Trigonometriya','Kombinatorika','Olimpiada masalalari']},
  it:{title:'IT & Programming 💻',color:'#0369a1',bg:'#e0f2fe',emoji:'💻',price:'500,000 so\'m/oy',duration:'6 oy',group:'8-10 kishi',age:'12+ yosh',rating:'4.9',desc:'Python, Web development va AI asoslari bo\'yicha amaliy kurs. Kurs oxirida real loyiha yaratiladi.',topics:['Python dasturlash','HTML/CSS','JavaScript asoslari','AI & ML kirish','Real loyiha']},
  robotics:{title:'Robotika & Arduino 🤖',color:'#be123c',bg:'#ffe4e6',emoji:'🤖',price:'450,000 so\'m/oy',duration:'4 oy',group:'6 kishi',age:'8+ yosh',rating:'5.0',desc:'Arduino, Lego robotics va dasturlash orqali real robotlar yasash. Har dars yangi qurilma yig\'iladi.',topics:['Arduino asoslari','Sensorlar','Motor boshqaruvi','Dasturlash','Robot musobaqasi']},
  arithmetic:{title:'Mental Arifmetika 🧮',color:'#92400e',bg:'#fef3c7',emoji:'🧮',price:'280,000 so\'m/oy',duration:'1 yil',group:'8-12 kishi',age:'5-12 yosh',rating:'4.9',desc:'Abakus asosida tez hisoblash. Bolaning xotirasi, konsentratsiyasi va matematik qobiliyatini kuchaytiradi.',topics:['Abakus asoslari','Qo\'shish/ayirish','Ko\'paytirish','Bo\'lish','Xayoliy abakus']},
  preschool:{title:'Maktabgacha Ta\'lim 🎨',color:'#c2410c',bg:'#ffedd5',emoji:'🎨',price:'250,000 so\'m/oy',duration:'1 yil',group:'6-8 kishi',age:'3-6 yosh',rating:'5.0',desc:'3-6 yoshli bolalar uchun rivojlantiruvchi o\'yinlar, rasm, musiqa va ingliz tilini o\'rgatish. Maktabga tayyorlov.',topics:['Raqamlar va harflar','Rasm ishlash','Musiqa darslar','Ingliz tili asoslari','Mantiqiy o\'yinlar']},
  sport:{title:'Sport Mashg\'ulotlari ⚽',color:'#065f46',bg:'#d1fae5',emoji:'⚽',price:'200,000 so\'m/oy',duration:'Doimiy',group:'12-15 kishi',age:'5+ yosh',rating:'4.7',desc:'Futbol, gimnastika, karate va yengil atletika. Sog\'lom turmush tarzi va jamoa ruhi.',topics:['Futbol','Gimnastika','Karate','Yengil atletika','Musobaqa tayyorlovi']},
};

function openCourse(key){
  const c=COURSES[key];if(!c)return;
  document.getElementById('cmod-content').innerHTML=`
    <div style="text-align:center;margin-bottom:20px">
      <div style="width:80px;height:80px;border-radius:24px;background:${c.bg};display:flex;align-items:center;justify-content:center;font-size:3rem;margin:0 auto 14px;border:3px solid ${c.color}20">${c.emoji}</div>
      <h2 style="font-family:var(--fh);font-size:1.4rem;margin-bottom:4px">${c.title}</h2>
      <div style="font-size:.8rem;font-weight:800;color:${c.color};text-transform:uppercase;letter-spacing:.06em">⭐ ${c.rating} reyting</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:18px">
      <div style="background:${c.bg};border-radius:12px;padding:12px;text-align:center"><div style="font-size:1.2rem;margin-bottom:4px">⏱</div><div style="font-size:.75rem;font-weight:800;color:var(--txd)">${c.duration}</div></div>
      <div style="background:${c.bg};border-radius:12px;padding:12px;text-align:center"><div style="font-size:1.2rem;margin-bottom:4px">👥</div><div style="font-size:.75rem;font-weight:800;color:var(--txd)">${c.group}</div></div>
      <div style="background:${c.bg};border-radius:12px;padding:12px;text-align:center"><div style="font-size:1.2rem;margin-bottom:4px">🎂</div><div style="font-size:.75rem;font-weight:800;color:var(--txd)">${c.age}</div></div>
    </div>
    <p style="font-size:.875rem;color:var(--txd);font-weight:600;line-height:1.7;margin-bottom:16px">${c.desc}</p>
    <div style="margin-bottom:20px"><h4 style="font-size:.9rem;font-weight:800;margin-bottom:10px">📋 Kurs mavzulari:</h4>${c.topics.map(t=>`<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:.855rem;font-weight:600;color:var(--txd)"><span style="color:${c.color}">✓</span>${t}</div>`).join('')}</div>
    <div style="display:flex;align-items:center;justify-content:space-between;background:var(--yl);border-radius:14px;padding:14px 18px;margin-bottom:16px"><div><div style="font-size:.8rem;font-weight:700;color:var(--txd)">Oylik to'lov</div><div style="font-family:var(--fh);font-size:1.3rem;color:#059669">${c.price}</div></div><button class="btn btn-f" style="border-radius:50px" onclick="document.getElementById('cmod').classList.remove('open');openMod('register')">Hozir yozilish →</button></div>`;
  document.getElementById('cmod').classList.add('open');
}

// ── TEACHER MODAL ──
const TEACHERS={
  alisher:{name:'Alisher Nishonov',subj:'English & IELTS',color:'#1d4ed8',bg:'#dbeafe',init:'AN',exp:'8 yil',students:'250+',rating:'5.0',cert:['Cambridge CELTA','British Council','IELTS 8.5 band'],bio:'Cambridge CELTA sertifikatlangan ingliz tili o\'qituvchisi. 8 yil davomida 250+ o\'quvchiga dars bergan. O\'quvchilarining 90%+ IELTS da 7.0 dan yuqori ball olgan. Britaniyada malaka oshirgan.'},
  gulnora:{name:'Gulnora Xasanova',subj:'Matematika',color:'#065f46',bg:'#d1fae5',init:'GX',exp:'6 yil',students:'180+',rating:'4.9',cert:['NUUz matematika magistri','Olimpiada murabbiy sertifikati'],bio:'NUUz matematika fakultetini a\'lo baho bilan tamomlagan. 6 yil davomida 180+ o\'quvchiga chuqurlashtirilgan matematika o\'rgatgan. O\'quvchilari respublika olimpiadalarida ko\'p marta g\'olib bo\'lgan.'},
  sarvar:{name:'Sarvar Toshpulatov',subj:'IT & Robotika',color:'#be123c',bg:'#ffe4e6',init:'ST',exp:'10 yil',students:'300+',rating:'5.0',cert:['Google sertifikati','AWS Cloud Practitioner','Python Institute'],bio:'Ex-Google software engineer. 10 yil IT sohasida ishlagan. Hozirda KATTA TANAFFUS SCHOOL da IT va robotika bo\'limini boshqaradi. O\'quvchilaridan 50+ kishi IT sohasida ishlab yuribdi.'},
  zulfiya:{name:'Zulfiya Rahimova',subj:'Maktabgacha Ta\'lim',color:'#6d28d9',bg:'#ede9fe',init:'ZR',exp:'7 yil',students:'120+',rating:'5.0',cert:['Montessori International','Bolalar psixologiyasi PhD','Early Childhood Education'],bio:'Montessori metodikasi bo\'yicha xalqaro sertifikatga ega. Bolalar psixologiyasi bo\'yicha PhD dissertatsiyasini himoya qilgan. 7 yil davomida 120+ bolaga maktabgacha ta\'lim bergan.'},
  jahongir:{name:'Jahongir Murodov',subj:'Mental Arifmetika',color:'#92400e',bg:'#fef3c7',init:'JM',exp:'12 yil',students:'400+',rating:'5.0',cert:['Yaponiya Abakus Chempioni','UCMAS International','Mental Math Master'],bio:'O\'zbekistonda mental arifmetikani birinchi bo\'lib targ\'ib qilgan mutaxassis. Yaponiyada abakus bo\'yicha chempion bo\'lgan. 12 yillik tajribada 400+ o\'quvchiga dars bergan.'},
  bahodir:{name:'Bahodir Ergashev',subj:'Sport',color:'#c2410c',bg:'#ffedd5',init:'BE',exp:'15 yil',students:'200+',rating:'4.8',cert:['O\'zbekiston milliy jamoasi','UEFA C lisenziyasi','Sport murabbiyligi magistri'],bio:'O\'zbekiston milliy futbol jamoasining sobiq a\'zosi. UEFA C murabbiylik lisenziyasiga ega. 15 yil davomida 200+ o\'quvchiga sport o\'rgatgan. Ko\'plab o\'quvchilari professional sportchi bo\'lgan.'},
};

function openTeacher(key){
  const t=TEACHERS[key];if(!t)return;
  const photoEl=document.getElementById('photo-'+key);
  const hasRealPhoto=photoEl&&photoEl.querySelector('img');
  const photoHTML=hasRealPhoto
    ?`<div class="tmod-photo" style="border:4px solid ${t.color}30">${photoEl.innerHTML}</div>`
    :`<div class="tmod-photo" style="background:linear-gradient(135deg,${t.color},${t.color}99);border:4px solid ${t.color}40"><span style="font-size:2rem">${t.init}</span></div>`;
  document.getElementById('tmod-content').innerHTML=`
    <div style="text-align:center;margin-bottom:20px">
      ${photoHTML}
      <h2 style="font-family:var(--fh);font-size:1.4rem;margin-bottom:4px">${t.name}</h2>
      <div style="font-size:.82rem;font-weight:800;color:${t.color};text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px">${t.subj}</div>
      <div style="display:flex;justify-content:center;gap:14px;font-size:.8rem;font-weight:800;color:var(--txd)"><span>👨‍🎓 ${t.students} o'quvchi</span><span>⏱ ${t.exp}</span><span>⭐ ${t.rating}</span></div>
    </div>
    <p style="font-size:.875rem;color:var(--txd);font-weight:600;line-height:1.75;margin-bottom:18px">${t.bio}</p>
    <div style="margin-bottom:20px"><h4 style="font-size:.9rem;font-weight:800;margin-bottom:10px">🏆 Sertifikatlar:</h4>${t.cert.map(c=>`<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:${t.bg};border-radius:8px;margin-bottom:6px;font-size:.845rem;font-weight:700;color:${t.color}">🎖️ ${c}</div>`).join('')}</div>
    <button class="btn btn-f" style="width:100%;padding:13px;font-size:.95rem;border-radius:50px" onclick="document.getElementById('tmod').classList.remove('open');openMod('register')">Bu o'qituvchi bilan dars boshlash →</button>`;
  document.getElementById('tmod').classList.add('open');
}

// ── CHAT ──
let chatOpen=false;
function toggleChat(){chatOpen=!chatOpen;const w=document.getElementById('chatwin');if(!w)return;w.style.display=chatOpen?'flex':'none';if(chatOpen)w.classList.add('open');}
function openChat(){chatOpen=true;const w=document.getElementById('chatwin');if(w){w.style.display='flex';w.classList.add('open');}}
function addMsg(txt,role,cont='chat-msgs'){
  const el=document.getElementById(cont);if(!el)return;
  const d=document.createElement('div');d.className=`cmsg ${role}`;
  d.innerHTML=`<div class="mav">${role==='bot'?'🤖':'👤'}</div><div class="mbub">${String(txt).replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')}</div>`;
  el.appendChild(d);el.scrollTop=el.scrollHeight;
}
function localReply(text){
  const t=text.toLowerCase();
  if(t.includes('narx')||t.includes('price')||t.includes('qancha')) return "💰 O‘qish to‘lovi sinf va filialga qarab belgilanadi, to‘garaklar (Taekwondo, Gimnastika) — alohida. Aniq summani qabul bo‘limi aytadi: +998 71 234-56-78.";
  if(t.includes('manzil')||t.includes('filial')||t.includes('qayer')) return "📍 Filiallarimiz: Yunusobod, Novza va Samarqand. Ish vaqti: 09:00–21:00.";
  if(t.includes('kurs')||t.includes('dars')||t.includes('fan')) return "📚 Katta Tanaffus — xususiy maktab (1–11-sinflar). Ingliz tili, matematika, informatika, robotika va mental arifmetika darslarning o‘zida o‘tiladi. Darsdan keyin — Taekwondo va Gimnastika to‘garaklari.";
  if(t.includes('yozil')||t.includes('ariza')) return "✍️ Qabulga ariza: yozilish.html sahifasi yoki +998 71 234-56-78 — qabul bo‘limi.";
  return "Assalomu alaykum! 😊 Qabul, fanlar, to‘garaklar yoki filiallar bo‘yicha savol bering — yordam beraman.";
}
function sendChat(){const i=document.getElementById('chat-input');if(!i)return;const t=i.value.trim();if(!t)return;addMsg(t,'user','chat-msgs');i.value='';setTimeout(()=>addMsg(localReply(t),'bot','chat-msgs'),500);}
function sendQuick(t){const q=document.getElementById('qrps');if(q)q.style.display='none';addMsg(t,'user','chat-msgs');setTimeout(()=>addMsg(localReply(t),'bot','chat-msgs'),500);}
function sendPage(t){const i=document.getElementById('page-input');if(!t&&i){t=i.value.trim();if(!t)return;i.value='';}addMsg(t,'user','page-msgs');setTimeout(()=>addMsg(localReply(t),'bot','page-msgs'),500);}

function filterProducts(){
  const q=(document.getElementById('productSearch')?.value||'').toLowerCase();
  document.querySelectorAll('#productGrid .product-card').forEach(card=>{card.style.display=card.dataset.title.toLowerCase().includes(q)?'block':'none';});
}
function sortProducts(){
  const grid=document.getElementById('productGrid'); if(!grid)return;
  const val=document.getElementById('productSort').value;
  const cards=[...grid.children];
  cards.sort((a,b)=>{
    if(val==='title_asc')return a.dataset.title.localeCompare(b.dataset.title);
    if(val==='price_asc')return Number(a.dataset.price)-Number(b.dataset.price);
    if(val==='price_desc')return Number(b.dataset.price)-Number(a.dataset.price);
    if(val==='rating_desc')return Number(b.dataset.rating)-Number(a.dataset.rating);
    return 0;
  });
  cards.forEach(c=>grid.appendChild(c));
}


// USER REQUEST UPDATES: 4-card pagination + product/detail/cart rendering
const PRODUCTS=[
  {id:'english',title:'General English',emoji:'🇬🇧',cat:'English',price:350000,old:390000,rating:4.9,duration:'3 oy',group:'8-10',age:'7+',bg:'linear-gradient(135deg,#dbeafe,#bfdbfe)',desc:"Suhbat, grammatika va lug'at boyitish kursi. Darslar bolalar uchun quvnoq va amaliy metodika asosida o'tiladi.",topics:['Speaking club','Grammar foundation','Vocabulary builder','Listening practice']},
  {id:'ielts',title:'IELTS Tayyorlov',emoji:'📝',cat:'IELTS',price:400000,old:450000,rating:4.8,duration:'4 oy',group:'6-8',age:'14+',bg:'linear-gradient(135deg,#ede9fe,#ddd6fe)',desc:"Listening, Reading, Writing va Speaking bo'yicha to'liq tayyorlov. Maqsad — aniq strategiya va yuqori band.",topics:['Mock tests','Writing feedback','Speaking practice','Band strategy']},
  {id:'math',title:'Chuqurlashtirilgan Matematika',emoji:'🔢',cat:'Matematika',price:300000,old:340000,rating:4.8,duration:'6 oy',group:'6-8',age:'9+',bg:'linear-gradient(135deg,#d1fae5,#a7f3d0)',desc:"Olimpiada va imtihonlarga tayyorlov. Mantiqiy fikrlash, tez yechim va mustahkam baza.",topics:['Algebra','Geometriya','Mantiqiy masalalar','Olimpiada tayyorlov']},
  {id:'it',title:'IT & Dasturlash',emoji:'💻',cat:'IT',price:500000,old:560000,rating:4.9,duration:'6 oy',group:'8-10',age:'12+',bg:'linear-gradient(135deg,#e0f2fe,#bae6fd)',desc:"Python, web dasturlash va AI asoslari bo'yicha amaliy loyiha asosidagi kurs.",topics:['Python','HTML/CSS/JS','AI basics','Portfolio project']},
  {id:'robotics',title:'Robotika & Arduino',emoji:'🤖',cat:'Robotika',price:450000,old:500000,rating:5.0,duration:'4 oy',group:'6',age:'8+',bg:'linear-gradient(135deg,#ffe4e6,#fecdd3)',desc:"Arduino va sensorlar yordamida real robotlar yasash, muhandislik va algoritmik fikrlashni rivojlantirish.",topics:['Arduino','Sensorlar','Motorlar','Robot loyihasi']},
  {id:'mental',title:'Mental Arifmetika',emoji:'🧮',cat:'Mental',price:280000,old:320000,rating:4.9,duration:'1 yil',group:'8-12',age:'5-12',bg:'linear-gradient(135deg,#fef3c7,#fde68a)',desc:"Abakus orqali tez hisoblash, xotira, diqqat va konsentratsiyani kuchaytirish.",topics:['Abakus','Tez hisob','Xotira mashqlari','Konsentratsiya']},
  {id:'preschool',title:"Maktabgacha ta'lim",emoji:'🎨',cat:'Kids',price:250000,old:290000,rating:5.0,duration:'1 yil',group:'6-8',age:'3-6',bg:'linear-gradient(135deg,#ffedd5,#fed7aa)',desc:"3-6 yoshli bolalar uchun rivojlantiruvchi o'yinlar, rasm, musiqa va nutq mashg'ulotlari.",topics:['Rivojlantiruvchi o‘yinlar','Rasm','Musiqa','Nutq']},
  {id:'sport',title:'Sport mashg\'ulotlari',emoji:'⚽',cat:'Sport',price:200000,old:240000,rating:4.7,duration:'Doimiy',group:'12-15',age:'6+',bg:'linear-gradient(135deg,#dcfce7,#bbf7d0)',desc:"Futbol, gimnastika, karate va yengil atletika. Sog'lom va faol avlod uchun.",topics:['Futbol','Gimnastika','Karate','Yengil atletika']}
];
const money=n=>Number(n||0).toLocaleString('uz-UZ')+" so'm";
let productView=[...PRODUCTS], productPage=1, productSize=8;
function productCard(p){return `<div class="product-card" data-title="${p.title}" data-price="${p.price}" data-rating="${p.rating}"><div class="product-thumb" style="background:${p.bg}">${p.emoji}</div><div class="product-body"><div class="product-meta"><span>✍️ Katta Tanaffus</span><span>⭐ ${p.rating}</span></div><h3 class="product-title">${p.title}</h3><p class="product-desc">${p.desc}</p><div class="product-actions"><span class="price-tag">${money(p.price)}</span><div style="display:flex;gap:8px;flex-wrap:wrap"><a href="mahsulot-detail.html?id=${p.id}" class="mini-btn secondary">Ko'rish</a><a class="mini-btn primary" href="yozilish.html?course=${p.id}">✍️ Yozilish</a></div></div></div></div>`}
function renderProductList(){const grid=document.getElementById('productGrid'); if(!grid)return; grid.innerHTML=productView.map(productCard).join('') || `<div class="empty-cart" style="grid-column:1/-1">Hech narsa topilmadi 😕</div>`;}
function filterProducts(){const q=(document.getElementById('productSearch')?.value||'').toLowerCase().trim(); productView=PRODUCTS.filter(p=>(p.title+' '+p.cat+' '+p.desc).toLowerCase().includes(q)); sortProducts(false); renderProductList();}
function sortProducts(shouldRender=true){const val=document.getElementById('productSort')?.value||''; productView.sort((a,b)=>{if(val==='title_asc')return a.title.localeCompare(b.title);if(val==='price_asc')return a.price-b.price;if(val==='price_desc')return b.price-a.price;if(val==='rating_desc')return b.rating-a.rating;return PRODUCTS.indexOf(a)-PRODUCTS.indexOf(b)}); if(shouldRender)renderProductList();}
function getCart(){try{return JSON.parse(localStorage.getItem('kt_cart')||'[]')}catch(e){return []}}
function saveCart(c){localStorage.setItem('kt_cart',JSON.stringify(c)); updateCartBadges();}
// TZ F-2.4: kursni “miqdor” bilan savatga solish o‘rniga — Yozilish oqimi (farzand, filial, guruh, oferta, to‘lov)
function addToCart(id){location.href='yozilish.html?course='+encodeURIComponent(id);}
function updateCartBadges(){const count=getCart().reduce((s,i)=>s+i.qty,0); document.querySelectorAll('.cart-badge').forEach(b=>b.textContent=count);}
function getProductFromUrl(){const id=new URLSearchParams(location.search).get('id')||'english';return PRODUCTS.find(p=>p.id===id)||PRODUCTS[0];}
function renderProductDetail(){const el=document.getElementById('productDetail'); if(!el)return; const p=getProductFromUrl(); document.title=p.title+' — KATTA TANAFFUS SCHOOL'; el.innerHTML=`<div style="margin-bottom:24px"><a href="mahsulotlar.html" style="color:var(--yd);font-weight:900;text-decoration:none">← Barcha mahsulotlarga qaytish</a></div><div class="product-detail-card"><div class="product-detail-hero"><div class="detail-art" style="background:${p.bg}">${p.emoji}</div><div class="detail-info"><div class="detail-badges"><span class="detail-badge">${p.cat}</span><span class="detail-badge">⭐ ${p.rating} reyting</span><span class="detail-badge">-10% chegirma</span></div><h1>${p.title}</h1><p>${p.desc}</p><div class="detail-list"><div>⏱<br>${p.duration}</div><div>👥<br>${p.group}</div><div>🎂<br>${p.age}</div></div><div style="margin:20px 0"><h3 style="font-family:var(--fh);font-size:1.05rem;margin-bottom:10px">Kurs ichida:</h3>${p.topics.map(t=>`<span class="detail-badge" style="margin:0 7px 8px 0;background:#fffdf5">✓ ${t}</span>`).join('')}</div><div class="detail-price-box"><div><div style="font-weight:900;color:var(--txd);font-size:.86rem">Oylik to'lov</div><div class="detail-price">${money(p.price)}</div><span class="old-price">${money(p.old)}</span></div><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="mini-btn primary" href="yozilish.html?course=${p.id}">✍️ Kursga yozilish</a><a class="mini-btn secondary" href="diagnostika.html">🧭 Bepul diagnostika</a></div></div></div></div></div>`;}
function changeQty(id,delta){const cart=getCart(); const item=cart.find(i=>i.id===id); if(!item)return; item.qty+=delta; const next=cart.filter(i=>i.qty>0); saveCart(next); renderCart();}
function removeCart(id){saveCart(getCart().filter(i=>i.id!==id)); renderCart(); showToast('Mahsulot savatchadan olib tashlandi');}
function renderCart(){const el=document.getElementById('cartApp'); if(!el)return; const cart=getCart(); const rows=cart.map(i=>({...i,p:PRODUCTS.find(p=>p.id===i.id)})).filter(i=>i.p); const total=rows.reduce((s,i)=>s+i.p.price*i.qty,0); if(!rows.length){el.innerHTML=`<div style="margin-bottom:24px"><span class="stag">🛒 Savatcha</span><h2 class="stitle">Mening savatcham</h2></div><div class="empty-cart"><div style="font-size:3rem;margin-bottom:8px">✍️</div>Endi savatcha kerak emas: kursni tanlang — farzand, filial va AI tavsiya qilgan guruh bir oqimda.<br><a href="yozilish.html" class="mini-btn primary" style="margin-top:16px">Kursga yozilish</a> <a href="diagnostika.html" class="mini-btn secondary" style="margin-top:16px">Bepul diagnostika</a></div>`;return;} el.innerHTML=`<div style="margin-bottom:24px"><span class="stag">🛒 Savatcha</span><h2 class="stitle">Mening savatcham</h2></div><div class="cart-shell"><div class="cart-list">${rows.map(({p,qty})=>`<div class="cart-item"><div class="cart-icon" style="background:${p.bg}">${p.emoji}</div><div><h4 style="font-family:var(--fh);font-size:1rem;margin-bottom:4px">${p.title}</h4><div style="font-size:.85rem;color:var(--txd);font-weight:800">${money(p.price)}/oy</div></div><div class="qty-control"><button onclick="changeQty('${p.id}',-1)">−</button><b>${qty}</b><button onclick="changeQty('${p.id}',1)">+</button></div><div class="cart-line-price" style="font-family:var(--fh);color:#059669;min-width:120px;text-align:right">${money(p.price*qty)}</div><button class="cart-remove" onclick="removeCart('${p.id}')">✕</button></div>`).join('')}</div><aside class="cart-summary"><div style="font-size:.86rem;color:var(--txd);font-weight:900;margin-bottom:4px">Jami summa</div><div style="font-family:var(--fh);font-size:2rem;color:#059669;margin-bottom:16px">${money(total)}</div><button class="btn btn-f" style="width:100%;padding:14px;border-radius:50px" onclick="openAriza()">✅ Buyurtma berish</button><a href="mahsulotlar.html" class="mini-btn secondary" style="width:100%;margin-top:12px">← Xaridni davom ettirish</a></aside></div>`;}
const pagers={};
function initCardPagination(){setupCardPager('courses','#courses .cgrid','.ccard');setupCardPager('teachers','#teachers .tgrid','.tcard');setupCardPager('branches','#branches .bgrid','.bcard');}
function setupCardPager(name,gridSel,itemSel){const grid=document.querySelector(gridSel); if(!grid||pagers[name])return; let pager=document.createElement('div'); pager.className='pager'; grid.insertAdjacentElement('afterend',pager); pagers[name]={grid,itemSel,pager,page:1,size:4}; applyCardPager(name,1);}
function eligibleItems(cfg){return [...cfg.grid.querySelectorAll(cfg.itemSel)].filter(el=>el.dataset.filterHidden!=='1');}
function applyCardPager(name,page=1){const cfg=pagers[name]; if(!cfg)return; const items=[...cfg.grid.querySelectorAll(cfg.itemSel)]; const visible=eligibleItems(cfg); const pages=Math.max(1,Math.ceil(visible.length/cfg.size)); cfg.page=Math.min(Math.max(1,page),pages); items.forEach(el=>el.style.display='none'); visible.slice((cfg.page-1)*cfg.size,cfg.page*cfg.size).forEach(el=>el.style.display='block'); cfg.pager.style.display=visible.length>cfg.size?'flex':'none'; cfg.pager.innerHTML=`<button ${cfg.page===1?'disabled':''} onclick="applyCardPager('${name}',${cfg.page-1})">‹</button>`+Array.from({length:pages},(_,i)=>`<button class="${cfg.page===i+1?'active':''}" onclick="applyCardPager('${name}',${i+1})">${i+1}</button>`).join('')+`<button ${cfg.page===pages?'disabled':''} onclick="applyCardPager('${name}',${cfg.page+1})">›</button>`; if(typeof aos==='function')setTimeout(aos,50);}
function filter(cat,btn){document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('act')); if(btn)btn.classList.add('act'); document.querySelectorAll('#courses .ccard').forEach(c=>{c.dataset.filterHidden=(cat==='all'||c.dataset.cat===cat)?'0':'1'}); applyCardPager('courses',1);}
window.addEventListener('DOMContentLoaded',()=>{renderProductList();renderProductDetail();renderCart();updateCartBadges();setTimeout(initCardPagination,50);});
