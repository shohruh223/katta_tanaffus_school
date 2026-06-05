(function(){
  const KEY='kt_portal_settings';
  const DEFAULTS={lang:'uz',theme:'light',font:'S',notifications:{grades:true,tests:true,schedule:false,ranking:true,olympiad:false},privacy:{profile:true,ranking:true,achievements:false}};
  const LANGS={
    uz:{name:"O'zbek",code:'uz'},
    ru:{name:'Русский',code:'ru'},
    en:{name:'English',code:'en'},
    ko:{name:'한국어',code:'ko'}
  };
  const DICT={
    ru:{
      'Bosh sahifa':'Главная','Darslar':'Уроки','Baholar':'Оценки',"Do'kon":'Магазин','Profil':'Профиль','Chiqish':'Выйти','Maktab portali':'Школьный портал','5-sinf':'5 класс',
      'Sozlamalar':'Настройки','Til':'Язык','Parol':'Пароль','Bildirishnomalar':'Уведомления',"Ko'rinish":'Внешний вид','Maxfiylik':'Конфиденциальность','Yordam markazi':'Центр помощи','Ilova haqida':'О приложении',
      "O'zgartirish ›":'Изменить ›',"Yorug' ›":'Светлая ›','Qorong‘i ›':'Тёмная ›','Avtomatik ›':'Авто ›','Interfeys tilini tanlang':'Выберите язык интерфейса','Til sozlamalari':'Настройки языка','Saqlash':'Сохранить',
      "Parolni o'zgartirish":'Изменить пароль','Joriy parol':'Текущий пароль','Yangi parol':'Новый пароль','Yangi parolni tasdiqlang':'Подтвердите новый пароль',
      "Yangi baho":'Новая оценка',"Baho qo'yilganda xabar berish":'Уведомлять при выставлении оценки','Test eslatmasi':'Напоминание о тесте','Test boshlanishidan 30 daqiqa oldin':'За 30 минут до теста',"Dars jadval o'zgarishi":'Изменение расписания','Jadval o\'zgarganda xabar':'Сообщать об изменениях расписания',"Reyting o'zgarishi":'Изменение рейтинга',"Reytingda o'rin o'zgarganda":'Когда изменилось место в рейтинге','Olimpiada eslatmasi':'Напоминание об олимпиаде','Olimpiada sanasidan 1 kun oldin':'За 1 день до олимпиады',
      'Mavzu tanlang':'Выберите тему',"Yorug'":'Светлая',"Qorong'i":'Тёмная',"Shrift o'lchami":'Размер шрифта','S — Kichik':'S — маленький',"M — O'rta":'M — средний','L — Katta':'L — большой',
      "Profilni ko'rsatish":'Показывать профиль',"Boshqa o'quvchilar profilingizni ko'ra olsin":'Другие ученики могут видеть ваш профиль',"Reytingda ko'rsatish":'Показывать в рейтинге',"Reytingda ismingiz ko'rinsin":'Ваше имя видно в рейтинге',"Yutuqlarni ulashish":'Делиться достижениями','Yutuqlar umumiy tasmada ko\'rinsin':'Показывать достижения в общей ленте',
      'Hisobdan chiqishni xohlaysizmi?':'Выйти из аккаунта?','Bekor qilish':'Отмена','Ha, chiqish':'Да, выйти','Yopish':'Закрыть','Balans':'Баланс'
    },
    en:{
      'Bosh sahifa':'Home','Darslar':'Lessons','Baholar':'Grades',"Do'kon":'Shop','Profil':'Profile','Chiqish':'Log out','Maktab portali':'School portal','5-sinf':'Grade 5',
      'Sozlamalar':'Settings','Til':'Language','Parol':'Password','Bildirishnomalar':'Notifications',"Ko'rinish":'Appearance','Maxfiylik':'Privacy','Yordam markazi':'Help center','Ilova haqida':'About app',
      "O'zgartirish ›":'Change ›',"Yorug' ›":'Light ›','Qorong‘i ›':'Dark ›','Avtomatik ›':'Auto ›','Interfeys tilini tanlang':'Choose interface language','Til sozlamalari':'Language settings','Saqlash':'Save',
      "Parolni o'zgartirish":'Change password','Joriy parol':'Current password','Yangi parol':'New password','Yangi parolni tasdiqlang':'Confirm new password',
      "Yangi baho":'New grade',"Baho qo'yilganda xabar berish":'Notify when a grade is added','Test eslatmasi':'Test reminder','Test boshlanishidan 30 daqiqa oldin':'30 minutes before the test',"Dars jadval o'zgarishi":'Schedule change','Jadval o\'zgarganda xabar':'Notify when the schedule changes',"Reyting o'zgarishi":'Ranking change',"Reytingda o'rin o'zgarganda":'When ranking position changes','Olimpiada eslatmasi':'Olympiad reminder','Olimpiada sanasidan 1 kun oldin':'1 day before the olympiad',
      'Mavzu tanlang':'Choose theme',"Yorug'":'Light',"Qorong'i":'Dark',"Shrift o'lchami":'Font size','S — Kichik':'S — Small',"M — O'rta":'M — Medium','L — Katta':'L — Large',
      "Profilni ko'rsatish":'Show profile',"Boshqa o'quvchilar profilingizni ko'ra olsin":'Other students can view your profile',"Reytingda ko'rsatish":'Show in ranking',"Reytingda ismingiz ko'rinsin":'Your name appears in ranking',"Yutuqlarni ulashish":'Share achievements','Yutuqlar umumiy tasmada ko\'rinsin':'Show achievements in the public feed',
      'Hisobdan chiqishni xohlaysizmi?':'Do you want to log out?','Bekor qilish':'Cancel','Ha, chiqish':'Yes, log out','Yopish':'Close','Balans':'Balance'
    },
    ko:{
      'Bosh sahifa':'홈','Darslar':'수업','Baholar':'성적',"Do'kon":'상점','Profil':'프로필','Chiqish':'로그아웃','Maktab portali':'학교 포털','5-sinf':'5학년',
      'Sozlamalar':'설정','Til':'언어','Parol':'비밀번호','Bildirishnomalar':'알림',"Ko'rinish":'화면 모드','Maxfiylik':'개인정보','Yordam markazi':'도움말 센터','Ilova haqida':'앱 정보',
      "O'zgartirish ›":'변경 ›',"Yorug' ›":'라이트 ›','Qorong‘i ›':'다크 ›','Avtomatik ›':'자동 ›','Interfeys tilini tanlang':'인터페이스 언어를 선택하세요','Til sozlamalari':'언어 설정','Saqlash':'저장',
      "Parolni o'zgartirish":'비밀번호 변경','Joriy parol':'현재 비밀번호','Yangi parol':'새 비밀번호','Yangi parolni tasdiqlang':'새 비밀번호 확인',
      "Yangi baho":'새 성적',"Baho qo'yilganda xabar berish":'성적이 등록되면 알림','Test eslatmasi':'시험 알림','Test boshlanishidan 30 daqiqa oldin':'시험 30분 전',"Dars jadval o'zgarishi":'시간표 변경','Jadval o\'zgarganda xabar':'시간표가 변경되면 알림',"Reyting o'zgarishi":'순위 변경',"Reytingda o'rin o'zgarganda":'순위가 바뀌면 알림','Olimpiada eslatmasi':'올림피아드 알림','Olimpiada sanasidan 1 kun oldin':'올림피아드 하루 전',
      'Mavzu tanlang':'테마 선택',"Yorug'":'라이트',"Qorong'i":'다크',"Shrift o'lchami":'글꼴 크기','S — Kichik':'S — 작게',"M — O'rta":'M — 보통','L — Katta':'L — 크게',
      "Profilni ko'rsatish":'프로필 표시',"Boshqa o'quvchilar profilingizni ko'ra olsin":'다른 학생이 프로필을 볼 수 있음',"Reytingda ko'rsatish":'랭킹에 표시',"Reytingda ismingiz ko'rinsin":'랭킹에 이름 표시',"Yutuqlarni ulashish":'성과 공유','Yutuqlar umumiy tasmada ko\'rinsin':'공개 피드에 성과 표시',
      'Hisobdan chiqishni xohlaysizmi?':'로그아웃하시겠습니까?','Bekor qilish':'취소','Ha, chiqish':'예, 로그아웃','Yopish':'닫기','Balans':'잔액'
    }
  };
  function read(){try{return {...DEFAULTS,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return {...DEFAULTS}}}
  function write(next){const cur=read();const settings={...cur,...next,notifications:{...cur.notifications,...(next.notifications||{})},privacy:{...cur.privacy,...(next.privacy||{})}};localStorage.setItem(KEY,JSON.stringify(settings));apply(settings);return settings;}
  function t(txt,lang){if(!txt)return txt;const clean=String(txt).replace(/\s+/g,' ').trim();return (DICT[lang]&&DICT[lang][clean])||clean;}
  function translateNode(root,lang){if(lang==='uz')return;const skip=new Set(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT']);const walker=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){const p=node.parentElement;if(!p||skip.has(p.tagName)||p.closest('[data-no-translate]'))return NodeFilter.FILTER_REJECT;return node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});let n;while((n=walker.nextNode())){const original=n.nodeValue.replace(/\s+/g,' ').trim();const translated=t(original,lang);if(translated!==original)n.nodeValue=n.nodeValue.replace(original,translated);}}
  function apply(settings){settings=settings||read();document.documentElement.lang=LANGS[settings.lang]?.code||'uz';document.body.classList.remove('kt-theme-light','kt-theme-dark','kt-font-s','kt-font-m','kt-font-l');document.body.classList.add(settings.theme==='dark'?'kt-theme-dark':'kt-theme-light','kt-font-'+String(settings.font||'S').toLowerCase());document.querySelectorAll('[data-setting-value="language"]').forEach(el=>el.textContent=(LANGS[settings.lang]?.name||"O'zbek")+' ›');document.querySelectorAll('[data-setting-value="appearance"]').forEach(el=>el.textContent=(settings.theme==='dark'?t("Qorong‘i ›",settings.lang):t("Yorug' ›",settings.lang)));translateNode(document.body,settings.lang);}
  window.KTSettings={KEY,DEFAULTS,LANGS,read,write,apply,t};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>apply());else apply();
})();
