/* Katta Tanaffus platformasi — yagona demo ma’lumotlar manbai.
   Sayt, assistent, kabinetlar va pitch sahifasi shu fayldan o‘qiydi (TZ: F-2.1, KM-09 → bitta katalog).
   Haqiqiy tizimda bu ma’lumot API dan keladi: GET /api/v1/courses/, /branches/, /groups/ ... */
(function(){
  // Katta Tanaffus — xususiy umumta’lim maktabi. Fanlar darslarda o‘tiladi (alohida sotilmaydi).
  // Pullik qo‘shimcha mashg‘ulot — faqat ikki to‘garak: Taekwondo va Gimnastika.
  const SCHOOL = {name:'Katta Tanaffus School', type:'Xususiy umumta’lim maktabi', grades:'1–11', since:2019, phone:'+998 71 234-56-78'};
  const SUBJECTS = [
    {id:'english', title:'Ingliz tili', emoji:'🇬🇧', color:'#1f86d9', grades:'1–11-sinflar', gMin:1, gMax:11, teacher:'alisher',
      desc:'1-sinfdan boshlab: suhbat, grammatika va lug‘at. Yuqori sinflarda — IELTS tayyorgarligi.', topics:['Kundalik suhbat','Grammatika','Lug‘at boyitish','Yozma nutq','IELTS tayyorgarligi (9–11-sinflar)'],
      units:['Present Simple','Daily routines','Past Simple','Past Continuous','Vocabulary: School','Comparatives','Reading: short stories','Listening: dialogues']},
    {id:'math', title:'Matematika', emoji:'🔢', color:'#0f9f6e', grades:'1–11-sinflar', gMin:1, gMax:11, teacher:'gulnora',
      desc:'Chuqurlashtirilgan dastur: mantiqiy fikrlash, masala yechish, olimpiada va DTM tayyorgarligi.', topics:['Algebra','Geometriya','Mantiqiy masalalar','Olimpiada masalalari','DTM tayyorgarligi'],
      units:['Kasrlar','Tenglamalar','Tengsizliklar','Foizlar','Geometriya: burchaklar','Mantiqiy masalalar']},
    {id:'it', title:'Informatika va dasturlash', emoji:'💻', color:'#0ea5e9', grades:'6–11-sinflar', gMin:6, gMax:11, teacher:'sarvar',
      desc:'Python, web va sun’iy intellekt asoslari — amaliy loyihalar bilan.', topics:['Python','HTML va CSS','JavaScript asoslari','AI asoslari','Yakuniy loyiha'], units:['Python asoslari','Shart va sikllar','HTML/CSS','JavaScript','Mini loyiha']},
    {id:'robotics', title:'Robotika', emoji:'🤖', color:'#e11d48', grades:'2–9-sinflar', gMin:2, gMax:9, teacher:'sarvar',
      desc:'Arduino bilan haqiqiy robotlar yasash: sensorlar, motorlar va dasturlash.', topics:['Elektr zanjir','Arduino','Sensorlar','Motorlar','Robot musobaqasi'], units:['Elektr zanjir','Arduino IDE','Sensorlar','Motorlar','Robot loyihasi']},
    {id:'mental', title:'Mental arifmetika', emoji:'🧮', color:'#e8890c', grades:'1–4-sinflar', gMin:1, gMax:4, teacher:'jahongir',
      desc:'Boshlang‘ich sinflarda abakus bilan tez hisoblash: xotira va diqqatni kuchaytiradi.', topics:['Abakus asoslari','Qo‘shish va ayirish','Ko‘paytirish','Bo‘lish','Xayoliy abakus'], units:['Abakus bilan tanishuv','Kichik do‘stlar','Katta do‘stlar','Tez hisob','Flesh-kartalar']},
    {id:'pe', title:'Jismoniy tarbiya', emoji:'🏃', color:'#16a34a', grades:'1–11-sinflar', gMin:1, gMax:11, teacher:'bahodir',
      desc:'Har bir sinf uchun sport darslari: chaqqonlik, chidamlilik va jamoa o‘yinlari.', topics:['Umumiy jismoniy tayyorgarlik','Jamoa o‘yinlari','Yengil atletika'], units:[]}
  ];
  const CLUBS = [
    {id:'taekwondo', title:'Taekwondo', emoji:'🥋', color:'#e11d48', ageMin:5, ageMax:17, price:null,
      desc:'Olimpiya sport turi: intizom, kuch va o‘ziga ishonch. Kamar imtihonlari va musobaqalarga tayyorgarlik.', perks:['Intizom va o‘zini boshqarish','Kuch va chaqqonlik','Kamar imtihonlari','Musobaqalar']},
    {id:'gymnastics', title:'Gimnastika', emoji:'🤸', color:'#a855f7', ageMin:4, ageMax:14, price:null,
      desc:'Egiluvchanlik, muvozanat va to‘g‘ri qad-qomat. Kichkintoylardan boshlab.', perks:['Egiluvchanlik','Muvozanat','To‘g‘ri qad-qomat','Chiqishlar va bayramlar']}
  ];
  const ageToGrade = a => Math.max(0, Math.min(11, (+a||0) - 6));

  const BRANCHES = [
    {id:'yunusobod', name:'Yunusobod', city:'Toshkent', address:'Yunusobod tumani', phone:'+998 71 221-38-06', hours:'09:00–21:00', students:650, near:['yunusobod','minor','bodomzor','shahriston','yakkasaroy']},
    {id:'novza', name:'Novza', city:'Toshkent', address:'Novza mahallasi, Chilonzor tumani', phone:'+998 71 273-59-40', hours:'09:00–21:00', students:500, near:['novza','chilonzor','qatortol','olmazor','sergeli']},
    {id:'samarqand', name:'Samarqand', city:'Samarqand', address:'Registon ko‘chasi, 22-uy', phone:'+998 66 234-56-78', hours:'09:00–20:00', students:380, near:['samarqand','samarkand']}
  ];

  const TEACHERS = [
    {id:'dilnoza', name:'Dilnoza Karimova', subj:'Ingliz tili', color:'#1f86d9'},
    {id:'alisher', name:'Alisher Nishonov', subj:'English & IELTS', color:'#7c3aed'},
    {id:'gulnora', name:'Gulnora Xasanova', subj:'Matematika', color:'#0f9f6e'},
    {id:'sarvar', name:'Sarvar Toshpulatov', subj:'Informatika va robotika', color:'#e11d48'},
    {id:'zulfiya', name:'Zulfiya Rahimova', subj:'Boshlang‘ich sinflar', color:'#a855f7'},
    {id:'jahongir', name:'Jahongir Murodov', subj:'Mental arifmetika', color:'#e8890c'},
    {id:'bahodir', name:'Bahodir Ergashev', subj:'Jismoniy tarbiya', color:'#16a34a'}
  ];

  // Sinflar (namuna): qabulda AI sinf tavsiyasi bo‘sh o‘rin, filial va sinf bo‘yicha ishlaydi (AI-04)
  const CLASSES = [
    {id:'1a', name:'1-A', grade:1, branch:'yunusobod', cap:20, enrolled:19, room:'103'},
    {id:'1b', name:'1-B', grade:1, branch:'yunusobod', cap:20, enrolled:18, room:'104'},
    {id:'3b', name:'3-B', grade:3, branch:'yunusobod', cap:20, enrolled:20, room:'108'},
    {id:'5a', name:'5-A', grade:5, branch:'yunusobod', cap:20, enrolled:18, room:'204'},
    {id:'5b', name:'5-B', grade:5, branch:'yunusobod', cap:20, enrolled:16, room:'205'},
    {id:'7a', name:'7-A', grade:7, branch:'yunusobod', cap:20, enrolled:17, room:'301'},
    {id:'9a', name:'9-A', grade:9, branch:'yunusobod', cap:20, enrolled:19, room:'305'},
    {id:'11a', name:'11-A', grade:11, branch:'yunusobod', cap:20, enrolled:14, room:'401'},
    {id:'n2a', name:'2-A', grade:2, branch:'novza', cap:20, enrolled:15, room:'12'},
    {id:'n5a', name:'5-A', grade:5, branch:'novza', cap:20, enrolled:20, room:'21'},
    {id:'n6a', name:'6-A', grade:6, branch:'novza', cap:20, enrolled:18, room:'22'},
    {id:'n10a', name:'10-A', grade:10, branch:'novza', cap:20, enrolled:12, room:'31'},
    {id:'s1a', name:'1-A', grade:1, branch:'samarqand', cap:20, enrolled:17, room:'7'},
    {id:'s4a', name:'4-A', grade:4, branch:'samarqand', cap:20, enrolled:19, room:'9'},
    {id:'s8a', name:'8-A', grade:8, branch:'samarqand', cap:20, enrolled:16, room:'14'}
  ];
  // To‘garak guruhlari (namuna jadval)
  const CLUB_GROUPS = [
    {id:'tkd1', club:'taekwondo', name:'Taekwondo · kichiklar', branch:'yunusobod', days:'Du/Chor/Ju', time:'15:00', cap:14, enrolled:11, ageMin:5, ageMax:10, room:'Sport zali'},
    {id:'tkd2', club:'taekwondo', name:'Taekwondo · o‘smirlar', branch:'yunusobod', days:'Du/Chor/Ju', time:'16:30', cap:14, enrolled:12, ageMin:11, ageMax:17, room:'Sport zali'},
    {id:'tkd3', club:'taekwondo', name:'Taekwondo', branch:'novza', days:'Se/Pa/Sh', time:'15:30', cap:14, enrolled:14, ageMin:7, ageMax:14, room:'Sport zali'},
    {id:'gym1', club:'gymnastics', name:'Gimnastika · kichkintoylar', branch:'yunusobod', days:'Se/Pa', time:'15:00', cap:12, enrolled:9, ageMin:4, ageMax:7, room:'Gimnastika zali'},
    {id:'gym2', club:'gymnastics', name:'Gimnastika', branch:'yunusobod', days:'Se/Pa', time:'16:30', cap:12, enrolled:7, ageMin:8, ageMax:14, room:'Gimnastika zali'},
    {id:'gym3', club:'gymnastics', name:'Gimnastika', branch:'samarqand', days:'Du/Chor', time:'15:30', cap:12, enrolled:10, ageMin:5, ageMax:11, room:'Sport zali'}
  ];

  // 5-A sinf ro‘yxati (o‘qituvchi kabineti, davomat)
  const STUDENTS = [
    ['sardor','Sardor Yusupov'],['bekzod','Bekzod Anvarov'],['farzona','Farzona Saidalieva'],['omadbek','Omadbek Solijonov'],['nilufar','Nilufar Qodirova'],['jasur','Jasur Toshmatov'],
    ['sevinch','Sevinch Hasanova'],['doniyor','Doniyor Rahimov'],['aziza','Aziza Karimova'],['bobur','Bobur Aliyev'],['dilnura','Dilnura Rasulova'],['elyor','Elyor Nazarov'],
    ['feruza','Feruza Ismoilova'],['iroda','Iroda Yo‘ldosheva'],['kamron','Kamron Mirzayev'],['laylo','Laylo Abdullayeva'],['mirjalol','Mirjalol Hakimov'],['ruxshona','Ruxshona Sobirova']
  ].map(([id,name])=>({id, name, age:11, cls:'5a'}));

  // Namuna oila (TZ, 5-bo‘lim): Malika opa va farzandlari. Ismlar shartli.
  /* qo‘ng‘iroqlar va namunaviy dars jadvali (demo) */
  const BELLS = [['08:30','09:15'],['09:20','10:05'],['10:15','11:00'],['11:05','11:50'],['12:00','12:45'],['13:00','13:45']];
  const TIMETABLE = {
    '5a':['Ona tili va adabiyot','Matematika','Informatika','Ingliz tili','Tarix'],
    '1b':['Ona tili','Matematika','Mental arifmetika','Jismoniy tarbiya'],
    '3b':['Matematika','Ingliz tili','Ona tili','Tabiiy fan'],
    '7a':['Algebra','Fizika','Ona tili','Tarix','Geografiya','Ingliz tili']
  };

  const FAMILY = {
    id:'yusupov', guardian:'Malika Yusupova', relation:'Ona', phone:'+998 90 ••• 45 67', telegram:'@malika_yu', lang:'uz',
    children:[
      {id:'sardor', name:'Sardor', full:'Sardor Yusupov', age:11, grade:'5-sinf', cls:'5a', subject:'english', clubs:['tkd2'], aiMode:'kids', coins:86, color:'#1f86d9'},
      {id:'madina', name:'Madina', full:'Madina Yusupova', age:7, grade:'1-sinf', cls:'1b', subject:'mental', clubs:['gym1'], aiMode:'kids', coins:41, color:'#e8890c'}
    ]
  };

  // Mavzu bo‘yicha o‘zlashtirish (AI-12, Bayes knowledge tracing natijasi). p — ehtimol (0..1)
  const MASTERY = {
    sardor:[
      {topic:'Present Simple', p:.94}, {topic:'Daily routines', p:.82}, {topic:'Listening: dialogues', p:.76},
      {topic:'Past Simple', p:.58}, {topic:'Reading: short stories', p:.52}, {topic:'Vocabulary: School', p:.34},
      {topic:'Past Continuous', p:0}, {topic:'Comparatives', p:0}
    ],
    madina:[
      {topic:'Abakus bilan tanishuv', p:.95}, {topic:'Kichik do‘stlar', p:.71}, {topic:'Katta do‘stlar', p:.38}, {topic:'Tez hisob', p:0}, {topic:'Flesh-kartalar', p:0}
    ]
  };
  const LEVELS = [
    {key:'none', name:'Boshlanmagan', hint:'Mavzu hali o‘tilmagan', min:-1, max:0, color:'#d9d2e6'},
    {key:'intro', name:'Tanishuv', hint:'O‘tilgan, ehtimol < 40%', min:0, max:.4, color:'#fda4af'},
    {key:'learning', name:'O‘rganmoqda', hint:'40–70%: mashq tavsiya qilinadi', min:.4, max:.7, color:'#fbbf24'},
    {key:'mastered', name:'O‘zlashtirdi', hint:'70–90%: 1 haftadan keyin takror', min:.7, max:.9, color:'#34d399'},
    {key:'solid', name:'Mustahkam', hint:'≥ 90% va 2 hafta saqlangan', min:.9, max:1.01, color:'#059669'}
  ];
  function levelOf(p){ if(!p) return LEVELS[0]; return LEVELS.find(l=>l.key!=='none' && p>=l.min && p<l.max) || LEVELS[4]; }

  // Coin qoidalari (TZ, 12-bo‘lim)
  const COIN_RULES = [
    {act:'Darsga keldi', coin:'+2', limit:'Kechikmasdan; sababli qoldirish ayirmaydi'},
    {act:'Uy vazifasini o‘z vaqtida topshirdi', coin:'+3', limit:'O‘qituvchi qabul qilgandan keyin'},
    {act:'Test — birinchi urinish', coin:'+1 … +5', limit:'Natijaga qarab; qayta yechish coin bermaydi'},
    {act:'Mavzu “O‘zlashtirdi” ga chiqdi', coin:'+10', limit:'Har mavzuga bir marta'},
    {act:'7 kunlik mashq seriyasi', coin:'+5', limit:'Kuniga ko‘pi bilan 15 daqiqa hisoblanadi'},
    {act:'Olimpiada va tanlov', coin:'+20 … +100', limit:'Administrator tasdiqlaydi'},
    {act:'Oylik chegara', coin:'≤ 300', limit:'Coin pulga sotilmaydi va almashtirilmaydi'}
  ];

  // Sovg‘alar: arzon va foydali (LC-7)
  const REWARDS = [
    {id:'stickers', title:'Stikerlar to‘plami', emoji:'🌈', price:40},
    {id:'notebooks', title:'3 ta daftar', emoji:'📓', price:60},
    {id:'pencils', title:'Rangli qalamlar', emoji:'🖍️', price:80},
    {id:'helper', title:'Bir kun “o‘qituvchi yordamchisi”', emoji:'🧑‍🏫', price:120},
    {id:'book', title:'Sarguzasht kitobi', emoji:'📚', price:150},
    {id:'speaking', title:'Tanaffusda speaking klubi', emoji:'🎙️', price:200},
    {id:'museum', title:'Muzeyga sinf ekskursiyasi', emoji:'🏛️', price:300}
  ];

  // To‘lov summalari — demo (shartli)
  const INVOICES = [
    {id:'inv-11-s', child:'sardor', period:'Noyabr 2026', item:'O‘qish to‘lovi · 5-A', amount:2400000, discount:0, due:'05.11.2026', status:'paid', paidVia:'Click', paidAt:'03.11.2026'},
    {id:'inv-11-st', child:'sardor', period:'Noyabr 2026', item:'Taekwondo to‘garagi', amount:300000, discount:0, due:'05.11.2026', status:'paid', paidVia:'Click', paidAt:'03.11.2026'},
    {id:'inv-11-m', child:'madina', period:'Noyabr 2026', item:'O‘qish to‘lovi · 1-B', amount:2400000, discount:10, due:'05.11.2026', status:'paid', paidVia:'Payme', paidAt:'04.11.2026'},
    {id:'inv-12-s', child:'sardor', period:'Dekabr 2026', item:'O‘qish to‘lovi · 5-A', amount:2400000, discount:0, due:'05.12.2026', status:'created'},
    {id:'inv-12-st', child:'sardor', period:'Dekabr 2026', item:'Taekwondo to‘garagi', amount:300000, discount:0, due:'05.12.2026', status:'created'},
    {id:'inv-12-m', child:'madina', period:'Dekabr 2026', item:'O‘qish to‘lovi · 1-B', amount:2400000, discount:10, due:'05.12.2026', status:'created'},
    {id:'inv-12-mg', child:'madina', period:'Dekabr 2026', item:'Gimnastika to‘garagi', amount:250000, discount:0, due:'05.12.2026', status:'created'}
  ];
  const INVOICE_STATUS = {
    created:{t:'Yaratildi', c:'#7c3aed'}, soon:{t:'Muddati yaqin', c:'#e8890c'}, late:{t:'Kechikdi', c:'#f97316'},
    debt:{t:'Qarzdor', c:'#e11d48'}, paid:{t:'To‘landi', c:'#0f9f6e'}, frozen:{t:'Muzlatildi', c:'#64748b'}, refunded:{t:'Qaytarildi', c:'#64748b'}
  };

  // CRM: boshlang‘ich leadlar (TZ, 13-bo‘lim A)
  // Qabul arizalari (CRM). want: 'maktab' | 'taekwondo' | 'gymnastics'
  const LEAD_STAGES = [
    {id:'new', name:'Yangi'}, {id:'contacted', name:'Aloqa qilindi'}, {id:'diagnostic', name:'Diagnostika va suhbat'},
    {id:'trial', name:'Hujjatlar'}, {id:'enrolled', name:'Qabul qilindi'}
  ];
  const WANT = {maktab:'Maktabga qabul', taekwondo:'Taekwondo', gymnastics:'Gimnastika'};
  const LEADS = [
    {id:'L-1042', parent:'Nodira Ahmedova', phone:'+998 93 ••• 12 40', child:'Asal', age:9, grade:3, want:'maktab', branch:'yunusobod', time:'', source:'Telegram bot', stage:'new', minutesAgo:12, note:'“Hozir davlat maktabida, 3-sinfga o‘tkazmoqchimiz”'},
    {id:'L-1041', parent:'Dilshod Karimov', phone:'+998 90 ••• 77 18', child:'Ozod', age:8, want:'taekwondo', branch:'yunusobod', time:'kechki', source:'Sayt', stage:'new', minutesAgo:38, note:'Jadvalni so‘radi, 17:00 dan keyin'},
    {id:'L-1039', parent:'Rustam Qosimov', phone:'+998 97 ••• 03 55', child:'Iskandar', age:12, grade:6, want:'maktab', branch:'yunusobod', time:'', source:'Instagram', stage:'contacted', minutesAgo:180, note:'Matematika olimpiadasi qiziqtiradi'},
    {id:'L-1037', parent:'Gulchehra Saidova', phone:'+998 99 ••• 64 21', child:'Mohinur', age:6, want:'gymnastics', branch:'yunusobod', time:'kunduzgi', source:'Qo‘ng‘iroq', stage:'diagnostic', minutesAgo:1440, note:'Sinov mashg‘uloti: shanba 11:00'},
    {id:'L-1034', parent:'Akmal Turg‘unov', phone:'+998 94 ••• 90 02', child:'Sanjar', age:15, grade:10, want:'maktab', branch:'yunusobod', time:'', source:'Sayt', stage:'trial', minutesAgo:2880, note:'Diagnostika: ingliz tili B1. Hujjatlar topshirilmoqda'},
    {id:'L-1030', parent:'Shahnoza Yo‘ldosheva', phone:'+998 91 ••• 33 81', child:'Diyor', age:10, want:'taekwondo', branch:'yunusobod', time:'dam olish', source:'Telegram bot', stage:'contacted', minutesAgo:4300, note:'Javob bermadi, qayta qo‘ng‘iroq'},
    {id:'L-1026', parent:'Malika Yusupova', phone:'+998 90 ••• 45 67', child:'Sardor', age:11, grade:5, want:'maktab', branch:'yunusobod', time:'', source:'Telegram bot', stage:'enrolled', minutesAgo:20160, note:'5-A sinfiga qabul qilindi'}
  ];

  // Diagnostika uchun savollar banki (namuna; haqiqiy tizimda to‘g‘ri javob faqat serverda — DS-1)
  const DIAG_BANK = [
    {d:1, topic:'Vocabulary', q:'Which word is a colour?', o:['table','green','run','happy'], a:1},
    {d:1, topic:'Present Simple', q:'She ___ a cat.', o:['have','has','having','is have'], a:1},
    {d:1, topic:'Vocabulary', q:'I wash my hands with ___.', o:['soap','bread','chair','rain'], a:0},
    {d:2, topic:'Present Simple', q:'My brother ___ football every Sunday.', o:['play','plays','playing','is play'], a:1},
    {d:2, topic:'Daily routines', q:'I ___ up at 7 o‘clock.', o:['get','gets','am get','getting'], a:0},
    {d:2, topic:'Vocabulary', q:'Opposite of “cheap” is ___.', o:['small','expensive','old','fast'], a:1},
    {d:3, topic:'Past Simple', q:'Yesterday we ___ to the park.', o:['go','goes','went','gone'], a:2},
    {d:3, topic:'Past Simple', q:'___ you see the film last night?', o:['Do','Did','Does','Were'], a:1},
    {d:3, topic:'Comparatives', q:'An elephant is ___ than a horse.', o:['big','bigger','biggest','more big'], a:1},
    {d:3, topic:'Prepositions', q:'The book is ___ the table.', o:['on','at','of','to'], a:0},
    {d:4, topic:'Past Continuous', q:'I ___ TV when you called.', o:['watched','was watching','am watching','watch'], a:1},
    {d:4, topic:'Present Perfect', q:'She ___ never been to London.', o:['has','have','is','did'], a:0},
    {d:4, topic:'Future', q:'Look at the clouds! It ___ rain.', o:['will','is going to','goes to','shall to'], a:1},
    {d:4, topic:'Comparatives', q:'This is the ___ day of my life!', o:['good','better','best','most good'], a:2},
    {d:5, topic:'Conditionals', q:'If it rains, we ___ at home.', o:['stay','will stay','stayed','would stayed'], a:1},
    {d:5, topic:'Passive', q:'The letter ___ yesterday.', o:['was sent','sent','is send','was send'], a:0},
    {d:5, topic:'Reported speech', q:'He said he ___ tired.', o:['is','was','be','were being'], a:1},
    {d:5, topic:'Vocabulary', q:'A person who writes books is an ___.', o:['actor','author','artist','army'], a:1}
  ];

  // 20 ta AI funksiya (TZ, 11-bo‘lim). lvl — avtonomiya darajasi, st — bosqich
  const AI_FEATURES = [
    {id:'AI-01', name:'Qabul assistenti', lvl:'A3', st:'MVP', who:'Ota-ona', d:'Qabul, sinflar, to‘garaklar va filiallar bo‘yicha javob beradi, ariza yaratadi'},
    {id:'AI-02', name:'Lead baholash', lvl:'A2', st:'MVP', who:'Administrator', d:'“Issiq / iliq / sovuq” va keyingi qadam'},
    {id:'AI-03', name:'Adaptiv diagnostika', lvl:'A3', st:'MVP', who:'O‘quvchi', d:'Savol qiyinligi javobga qarab o‘zgaradi'},
    {id:'AI-04', name:'Sinf va guruh tavsiyasi', lvl:'A1', st:'MVP', who:'Administrator', d:'Sinf, yosh, filial va bo‘sh o‘rin bo‘yicha 1–3 variant'},
    {id:'AI-05', name:'Jadval optimizatori', lvl:'A1', st:'2', who:'Administrator', d:'O‘qituvchi, xona va vaqt bo‘yicha konfliktsiz jadval'},
    {id:'AI-06', name:'Test generatori', lvl:'A1', st:'2', who:'Metodist', d:'Mavzu bo‘yicha savollar — tasdiqlanmaguncha bolaga bormaydi'},
    {id:'AI-07', name:'Avtomatik tekshiruv', lvl:'A3', st:'MVP', who:'O‘qituvchi', d:'Yopiq savollar — serverda, ochiq javob — mezon bo‘yicha taklif'},
    {id:'AI-08', name:'Uy vazifasi rasmi', lvl:'A1', st:'2', who:'O‘qituvchi', d:'Rasm → matn, yechim qadamlarini tekshiradi'},
    {id:'AI-09', name:'Yozma ish fikri', lvl:'A1', st:'2', who:'O‘quvchi', d:'Insho va IELTS Writing uchun mezonli fikr'},
    {id:'AI-10', name:'Speaking mashqi', lvl:'A3', st:'3', who:'O‘quvchi 13+', d:'Ravonlik va talaffuz bo‘yicha fikr'},
    {id:'AI-11', name:'Sokratik repetitor', lvl:'A3', st:'2', who:'O‘quvchi 13+', d:'Javobni bermaydi — yo‘naltiruvchi savol beradi'},
    {id:'AI-12', name:'Bilim bo‘shlig‘i', lvl:'A3', st:'MVP', who:'O‘quvchi', d:'Har mavzu bo‘yicha o‘zlashtirish va 5 daqiqalik mashq'},
    {id:'AI-13', name:'Haftalik hisobot', lvl:'A2', st:'MVP', who:'Ota-ona', d:'Jurnal faktlari + o‘qituvchi izohi → oddiy tilda'},
    {id:'AI-14', name:'Erta ogohlantirish', lvl:'A2', st:'2', who:'Administrator', d:'Ketish va o‘zlashtirish xavfi, sabablar bilan'},
    {id:'AI-15', name:'To‘lov eslatmasi', lvl:'A2', st:'MVP', who:'Ota-ona', d:'Qulay vaqtda muloyim eslatma, oyiga ≤ 3'},
    {id:'AI-16', name:'O‘qituvchi yordamchisi', lvl:'A1', st:'2', who:'O‘qituvchi', d:'Dars rejasi qoralamasi, differensial varaqalar'},
    {id:'AI-17', name:'Murojaatlarni saralash', lvl:'A2', st:'2', who:'Administrator', d:'Mavzu va shoshilinchlik bo‘yicha saralash'},
    {id:'AI-18', name:'Kontent xavfsizligi', lvl:'A2', st:'MVP', who:'Tizim', d:'Haqorat, shaxsiy ma’lumot, xavfli kontentni yashiradi'},
    {id:'AI-19', name:'Rahbar uchun tahlil', lvl:'A1', st:'2', who:'Rahbar', d:'Oddiy savolga agregat ma’lumotdan javob va grafik'},
    {id:'AI-20', name:'Sifat monitoringi', lvl:'A1', st:'2', who:'Admin', d:'Har oy tekshiruv; sifat pasaysa — avvalgi versiya'}
  ];
  const AUTONOMY = [
    {lvl:'A3', name:'To‘liq avtonom', who:'Mahsulot jamoasi jurnal orqali kuzatadi', ex:'Savollarga javob, diagnostika, yopiq testlar, shaxsiy mashq'},
    {lvl:'A2', name:'Avtomatik, inson bekor qila oladi', who:'Administrator, o‘qituvchi', ex:'Kelmaganlik xabari, to‘lov eslatmasi, haftalik hisobot'},
    {lvl:'A1', name:'AI taklif qiladi, inson qaror qiladi', who:'O‘qituvchi, metodist, administrator', ex:'Guruh tavsiyasi, AI test, uy vazifasi bahosi'},
    {lvl:'A0', name:'Faqat inson', who:'Mas’ul xodim, audit jurnaliga', ex:'Yakuniy baho, guruhdan chiqarish, pulni qaytarish'}
  ];

  const SAFETY = [
    {id:'BR-01', t:'Hisobni ota-ona ochadi', d:'Rozilikni ota-ona beradi; 13+ o‘quvchi logini ota-ona hisobiga bog‘lanadi.'},
    {id:'BR-02', t:'Faqat o‘z natijasi', d:'Bola va ota-ona faqat o‘z baho, davomat va to‘lovini ko‘radi.'},
    {id:'BR-03', t:'Bahoni o‘qituvchi qo‘yadi', d:'AI faqat taklif beradi; jurnalga baho tasdiqdan keyin yoziladi.'},
    {id:'BR-04', t:'13 yoshgacha erkin AI suhbat yo‘q', d:'Faqat o‘qituvchi bergan mashqlar va qisqa tushuntirishlar.'},
    {id:'BR-05', t:'Rasm va ism — roziliksiz chiqmaydi', d:'Sayt, galereya va reklamada faqat ota-ona roziligi bilan.'},
    {id:'BR-12', t:'Ma’lumot O‘zbekistonda', d:'Serverlar mahalliy data-markazda; LLM ga bola ismi yuborilmaydi.'}
  ];

  const MARKET = [
    {n:'551', u:'ta', l:'nodavlat umumta’lim tashkiloti (2025/2026); bir yilda +21,1%', s:'stat.uz'},
    {n:'39,6', u:'trln so‘m', l:'2025-yilda ta’lim xizmatlari hajmi; +10,4%', s:'stat.uz'},
    {n:'300+', u:'tashkilot', l:'2022-yil oxirida bitta ta’lim CRM idan har kuni foydalangan — talab bor', s:'spot.uz'}
  ];

  const KPIS = [
    {k:'Arizadan qabulgacha', t:'≥ 35%', now:38, goal:35, unit:'%', fmt:'pct'},
    {k:'Arizaga javob vaqti (median)', t:'≤ 15 daq', now:11, goal:15, unit:' daq', inv:true},
    {k:'Oydan oyga qolish', t:'≥ 92%', now:93.4, goal:92, unit:'%'},
    {k:'O‘z vaqtida to‘lov', t:'≥ 90%', now:91.2, goal:90, unit:'%'},
    {k:'O‘rtacha davomat', t:'≥ 90%', now:89.1, goal:90, unit:'%'},
    {k:'Haftalik hisobotni ochish', t:'≥ 70%', now:76, goal:70, unit:'%'},
    {k:'Mashqdan keyingi o‘sish', t:'≥ 15 p.p.', now:17, goal:15, unit:' p.p.'},
    {k:'AI takliflari o‘zgarishsiz qabul', t:'≥ 70%', now:72, goal:70, unit:'%'}
  ];

  const ROADMAP = [
    {f:'Faza 0', n:'Xavfsizlik va tayyorgarlik', w:'0–3 hafta', len:3, d:'Xavfsizlik auditi, yurist (rozilik, oferta), to‘lov provayderi bilan shartnoma, ma’lumot importi rejasi'},
    {f:'Faza 1', n:'MVP', w:'3–15 hafta', len:12, d:'Backend, oila va kirish, CRM va AI assistent, diagnostika, davomat, to‘lov, Telegram bot, haftalik hisobot, coin ledger'},
    {f:'Pilot', n:'1–2 filial', w:'15–21 hafta', len:6, d:'300–500 o‘quvchi; konversiya, xabar, hisobot va AI aniqligi o‘lchanadi'},
    {f:'Faza 2', n:'AI va boshqaruv', w:'21–29 hafta', len:8, d:'Test generatori, uy vazifasi tekshiruvi, Sokratik repetitor, erta ogohlantirish, rahbar paneli'},
    {f:'Faza 3', n:'Kengayish', w:'29–35 hafta', len:6, d:'Speaking, eMaktab eksporti, Mini App, sertifikatlar, ko‘p tashkilotli rejim (SaaS)'}
  ];

  // Baholar — faqat o‘z farzandi (BR-02). Bahoni o‘qituvchi qo‘yadi (BR-03). Kundalik baho — 5 ballik
  const GRADES = {
    sardor:[
      {date:'20.11', topic:'Ingliz tili · Past Simple', kind:'Test', v:'9/10', note:'Mashqdan keyin ancha yaxshi'},
      {date:'19.11', topic:'Matematika · Kasrlar', kind:'Nazorat ishi', v:'5', note:'Barcha masalalar to‘g‘ri'},
      {date:'18.11', topic:'Ingliz tili · Daily routines', kind:'Og‘zaki', v:'4', note:'Faol, talaffuz yaxshi'},
      {date:'15.11', topic:'Informatika · Algoritmlar', kind:'Amaliy', v:'5', note:'Topshiriqni birinchi bajardi'},
      {date:'13.11', topic:'Ingliz tili · Vocabulary', kind:'Test', v:'6/10', note:'Lug‘atni takrorlash kerak'}
    ],
    madina:[
      {date:'19.11', topic:'Mental arifmetika · Kichik do‘stlar', kind:'Test', v:'8/10', note:'Tezligi oshdi'},
      {date:'18.11', topic:'Ona tili · Harflar', kind:'Yozma', v:'5', note:'Chiroyli yozadi'},
      {date:'12.11', topic:'Matematika · 10 ichida qo‘shish', kind:'Og‘zaki', v:'4', note:'Barmoq bilan sanamaslikka harakat qilsin'}
    ]
  };

  // Haftalik hisobot faktlari (AI-13 kirishi) — matndagi har raqam shu faktlardan tekshiriladi (AC-11)
  const WEEKLY = {
    sardor:{days:[5,5], lessons:[30,30], results:[['Ingliz tili','test 7/10 → 9/10'],['Matematika','nazorat ishi — 5'],['Informatika','amaliy ish — 5']], club:['Taekwondo',3,3], topics:['Past Simple','Kasrlar'], test:[7,9], coins:12,
      teacherNote:'Faol, darsda ko‘p gapirdi. Ingliz tilidan lug‘atni takrorlash kerak.', noteBy:'Dilnoza Karimova, sinf rahbari', next:'Ingliz tili — Past Continuous, matematika — foizlar',
      dinnerQ:'“What did you do yesterday?” deb so‘rang — Sardor Past Simple’da javob bersin: “I played…”, “I watched…”'},
    madina:{days:[5,5], lessons:[25,25], results:[['Mental arifmetika','test 6/10 → 8/10'],['Ona tili','yozma ish — 5']], club:['Gimnastika',2,2], topics:['Kichik do‘stlar','Harflar'], test:[6,8], coins:9,
      teacherNote:'Diqqati yaxshilandi, abakusda tezroq ishlayapti.', noteBy:'Sinf rahbari', next:'Mental arifmetika — Katta do‘stlar',
      dinnerQ:'Do‘kondan qaytganda “5 + 4 nechchi?” kabi 3 ta misolni og‘zaki so‘rang — barmoq bilan emas, “boshida abakus” bilan.'}
  };

  window.KTD = {SCHOOL,SUBJECTS,CLUBS,CLASSES,CLUB_GROUPS,WANT,BELLS,TIMETABLE,ageToGrade,BRANCHES,TEACHERS,STUDENTS,FAMILY,MASTERY,LEVELS,levelOf,COIN_RULES,REWARDS,INVOICES,INVOICE_STATUS,LEAD_STAGES,LEADS,DIAG_BANK,AI_FEATURES,AUTONOMY,SAFETY,MARKET,KPIS,ROADMAP,WEEKLY,GRADES,
    subject:id=>SUBJECTS.find(c=>c.id===id), club:id=>CLUBS.find(c=>c.id===id), cls:id=>CLASSES.find(c=>c.id===id), cgroup:id=>CLUB_GROUPS.find(g=>g.id===id),
    branch:id=>BRANCHES.find(b=>b.id===id), teacher:id=>TEACHERS.find(t=>t.id===id), student:id=>STUDENTS.find(s=>s.id===id)};
})();
