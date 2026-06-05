(function(){
  const START_BALANCE = 500;
  const BALANCE_KEY_BASE = 'kt_coin_balance';
  const INIT_KEY_BASE = 'kt_coin_balance_initialized_v2';
  const HISTORY_KEY_BASE = 'kt_coin_history';
  const ORDERS_KEY_BASE = 'kt_reward_orders';
  function userSuffix(){
    const u = window.KTAuth && window.KTAuth.currentUser ? window.KTAuth.currentUser() : null;
    return u && u.id ? '_' + u.id : '';
  }
  function key(base){ return base + userSuffix(); }

  function readJson(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(e){ return fallback; }
  }
  function writeJson(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
  function formatCoin(value){ return Number(value || 0).toLocaleString('uz-UZ'); }
  function ensureDefaultBalance(){
    // Eski versiyada brauzerda 11 kabi qiymat saqlanib qolgan bo‘lsa,
    // yangi versiyada birinchi kirishda balansni default 500 ga qayta o‘rnatamiz.
    if(localStorage.getItem(key(INIT_KEY_BASE)) !== '1'){
      localStorage.setItem(key(BALANCE_KEY_BASE), String(START_BALANCE));
      localStorage.setItem(key(INIT_KEY_BASE), '1');
    }
  }
  function getBalance(){
    ensureDefaultBalance();
    const saved = Number(localStorage.getItem(key(BALANCE_KEY_BASE)));
    if(Number.isFinite(saved) && saved >= 0) return saved;
    localStorage.setItem(key(BALANCE_KEY_BASE), String(START_BALANCE));
    return START_BALANCE;
  }
  function setBalance(value){
    const balance = Math.max(0, Number(value || 0));
    localStorage.setItem(key(BALANCE_KEY_BASE), String(balance));
    updateCoinViews();
    return balance;
  }
  function addHistory(item){
    const history = readJson(key(HISTORY_KEY_BASE), []);
    history.unshift({ date:new Date().toISOString(), ...item });
    writeJson(key(HISTORY_KEY_BASE), history.slice(0, 50));
  }
  function addCoins(amount, reason){
    amount = Math.max(0, Number(amount || 0));
    if(!amount) return getBalance();
    const balance = setBalance(getBalance() + amount);
    addHistory({type:'earn', amount, reason:reason || 'Coin qo‘shildi', balance});
    window.dispatchEvent(new CustomEvent('kt:coin-change', {detail:{balance, amount, reason}}));
    return balance;
  }
  function spendCoins(amount, reason){
    amount = Math.max(0, Number(amount || 0));
    const current = getBalance();
    if(current < amount) return false;
    const balance = setBalance(current - amount);
    addHistory({type:'spend', amount:-amount, reason:reason || 'Sovg‘a olindi', balance});
    window.dispatchEvent(new CustomEvent('kt:coin-change', {detail:{balance, amount:-amount, reason}}));
    return true;
  }
  function saveOrder(order){
    const orders = readJson(key(ORDERS_KEY_BASE), []);
    orders.unshift({id:'KT-'+Date.now().toString().slice(-6), date:new Date().toISOString(), status:'Qabul qilindi', ...order});
    writeJson(key(ORDERS_KEY_BASE), orders.slice(0, 30));
    return orders[0];
  }
  function updateCoinViews(){
    const balance = getBalance();
    document.querySelectorAll('[data-coin-balance]').forEach(el=>el.textContent = formatCoin(balance));
    document.querySelectorAll('[data-coin-balance-full]').forEach(el=>el.textContent = formatCoin(balance) + ' ⭐');
    document.querySelectorAll('.shop-item[data-price]').forEach(item=>{
      const price = Number(item.dataset.price || 0);
      item.classList.toggle('can-buy', balance >= price);
      item.classList.toggle('cannot-buy', balance < price);
      const btn = item.querySelector('.reward-buy-btn');
      if(btn){
        btn.disabled = balance < price;
        btn.textContent = balance >= price ? 'Sovg‘a olish' : 'Coin yetmaydi';
      }
    });
  }
  function getHistory(){ return readJson(key(HISTORY_KEY_BASE), []); }
  function getOrders(){ return readJson(key(ORDERS_KEY_BASE), []); }

  window.KTRewards = {formatCoin,getBalance,setBalance,addCoins,spendCoins,saveOrder,getHistory,getOrders,updateCoinViews};
  document.addEventListener('DOMContentLoaded', updateCoinViews);
})();
