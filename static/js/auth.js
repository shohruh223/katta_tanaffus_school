(function(){
  const USERS_KEY = 'kt_auth_users';
  const SESSION_KEY = 'kt_auth_session';
  const DEFAULT_AVATAR = 'https://i.pravatar.cc/80?img=12';
  const STUDENT_PAGES = ['dashboard.html','lessons.html','marks.html','shop.html','profile.html','payment.html','certificates.html','ranking.html'];

  function readJson(key, fallback){
    try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }catch(e){ return fallback; }
  }
  function writeJson(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
  function normalizeEmail(email){ return String(email || '').trim().toLowerCase(); }
  function makeId(email){ return normalizeEmail(email).replace(/[^a-z0-9]+/g,'_') || ('user_'+Date.now()); }
  function show(msg){
    if(typeof window.showToast === 'function') window.showToast(msg);
    else alert(msg);
  }
  function getUsers(){ return readJson(USERS_KEY, []); }
  function setUsers(users){ writeJson(USERS_KEY, users); }
  function firstName(full){ return String(full || 'O‘quvchi').trim().split(/\s+/)[0] || 'O‘quvchi'; }
  function currentUser(){
    const session = readJson(SESSION_KEY, null);
    if(!session || !session.email) return null;
    return getUsers().find(u => normalizeEmail(u.email) === normalizeEmail(session.email)) || null;
  }
  function setSession(user, remember){
    writeJson(SESSION_KEY, {email:user.email, id:user.id, remember:!!remember, loginAt:new Date().toISOString()});
  }
  function ensureDemoUser(){
    const users = getUsers();
    if(users.length) return;
    users.push({
      id:'demo_toxir',
      name:'Toxir Toirov',
      email:'toxir@example.com',
      password:'12345678',
      grade:'5-sinf',
      className:'5-sinf A',
      branch:'Xalqlar Dostligi',
      avatar:DEFAULT_AVATAR,
      createdAt:new Date().toISOString()
    });
    setUsers(users);
  }

  function handleRegister(event){
    event.preventDefault();
    const form = event.currentTarget;
    const inputs = form.querySelectorAll('input');
    const name = String(inputs[0]?.value || '').trim();
    const email = normalizeEmail(inputs[1]?.value || '');
    const password = String(inputs[2]?.value || '');
    const confirm = String(inputs[3]?.value || '');
    if(!name || !email || !password || !confirm){ show('Iltimos, barcha maydonlarni to‘ldiring.'); return false; }
    if(password.length < 8){ show('Parol kamida 8 belgidan iborat bo‘lishi kerak.'); return false; }
    if(password !== confirm){ show('Parollar mos kelmadi.'); return false; }
    const users = getUsers();
    if(users.some(u => normalizeEmail(u.email) === email)){ show('Bu email bilan akkaunt mavjud. Login qiling.'); return false; }
    const user = {id:makeId(email), name, email, password, grade:'5-sinf', className:'5-sinf A', branch:'Xalqlar Dostligi', avatar:DEFAULT_AVATAR, createdAt:new Date().toISOString()};
    users.push(user); setUsers(users); setSession(user, true);
    // yangi userga boshlang‘ich balans alohida ochiladi
    localStorage.setItem('kt_coin_balance_'+user.id, '500');
    localStorage.setItem('kt_coin_balance_initialized_v2_'+user.id, '1');
    show('✅ Ro‘yxatdan o‘tish muvaffaqiyatli! Student panelga o‘tilmoqda...');
    setTimeout(()=>{ location.href='dashboard.html'; }, 500);
    return false;
  }
  function handleLogin(event){
    event.preventDefault();
    ensureDemoUser();
    const form = event.currentTarget;
    const email = normalizeEmail(form.querySelector('input[type="email"]')?.value || '');
    const password = String(form.querySelector('input[type="password"]')?.value || '');
    const remember = !!form.querySelector('input[type="checkbox"]')?.checked;
    const user = getUsers().find(u => normalizeEmail(u.email) === email && String(u.password) === password);
    if(!user){ show('Email yoki parol noto‘g‘ri. Demo: toxir@example.com / 12345678'); return false; }
    setSession(user, remember);
    show('✅ Muvaffaqiyatli kirdingiz!');
    setTimeout(()=>{ location.href='dashboard.html'; }, 400);
    return false;
  }
  function logout(){
    localStorage.removeItem(SESSION_KEY);
    location.href='login.html';
  }
  function requireAuth(){
    const page = location.pathname.split('/').pop() || 'index.html';
    if(!STUDENT_PAGES.includes(page)) return;
    if(!currentUser()){
      localStorage.setItem('kt_after_login', page);
      location.href='login.html';
    }
  }
  function storageKey(key){
    const u=currentUser();
    return u ? (key + '_' + u.id) : key;
  }
  function replaceTextNodes(root, user){
    const name = user.name || 'O‘quvchi';
    const fname = firstName(name);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        const v=node.nodeValue;
        return (v && (v.includes('Toxir Toirov') || v.includes('Toxir!') || v.includes('Toxir'))) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n=>{
      n.nodeValue = n.nodeValue.replace(/Toxir Toirov/g, name).replace(/Toxir!/g, fname+'!').replace(/Toxir/g, fname);
    });
  }
  function applyStudentUser(){
    const user = currentUser();
    if(!user) return;
    document.querySelectorAll('.tb-name').forEach(el=>el.textContent=user.name);
    document.querySelectorAll('.tb-level').forEach(el=>el.textContent=user.grade || '5-sinf');
    document.querySelectorAll('.tb-user img,.prof-av-wrap img,.mini-rank-card img').forEach(img=>{ img.src=user.avatar || DEFAULT_AVATAR; });
    replaceTextNodes(document.body, user);
    document.querySelectorAll('[onclick*="Toxir Toirov"]').forEach(el=>{
      el.setAttribute('onclick', el.getAttribute('onclick').replace(/Toxir Toirov/g, user.name));
    });
  }

  window.KTAuth = {handleRegister,handleLogin,logout,currentUser,requireAuth,applyStudentUser,storageKey,firstName};
  requireAuth();
  document.addEventListener('DOMContentLoaded', function(){
    ensureDemoUser();
    applyStudentUser();
  });
})();
