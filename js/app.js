// SmartBite Static Frontend (no backend)
(function(){
  const yearEl = document.getElementById('sb-year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- Demo Auth (optional) -----
  const user = getUser();
  const userArea = document.getElementById('sb-user-area');
  const guestArea = document.getElementById('sb-guest-area');
  if(user && userArea && guestArea){
    guestArea.style.display = 'none';
    userArea.style.display = 'flex';
    const roleEl = document.getElementById('sb-user-role');
    const nameEl = document.getElementById('sb-user-name');
    if(roleEl) roleEl.textContent = user.role;
    if(nameEl) nameEl.textContent = user.name;

    const show = (id, ok) => {
      const el = document.getElementById(id);
      if(el) el.style.display = ok ? 'inline' : 'none';
    };
    show('sb-admin-link', user.role === 'admin');
    show('sb-restaurant-link', user.role === 'restaurant');
    show('sb-delivery-link', user.role === 'delivery');

    const logoutBtn = document.getElementById('sb-logout');
    if(logoutBtn){
      logoutBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        localStorage.removeItem('sb_user');
        location.href = 'index.html';
      });
    }
  }

  // Cart badge (optional)
  const cartCount = cartItems().reduce((sum,i)=>sum + (i.qty||0),0);
  // If you want a badge later, you can add an element and set it here.

  // Load header/footer if placeholders exist
  includePartials();
})();

async function includePartials(){
  // If a page uses placeholders, load partials. If not, ignore.
  const h = document.getElementById('site-header');
  const f = document.getElementById('site-footer');
  if(h){
    h.innerHTML = await fetchText('partials/header.html');
  }
  if(f){
    f.innerHTML = await fetchText('partials/footer.html');
  }
  // Re-run year/user rendering after injecting header
  const yearEl = document.getElementById('sb-year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
  const user = getUser();
  const userArea = document.getElementById('sb-user-area');
  const guestArea = document.getElementById('sb-guest-area');
  if(user && userArea && guestArea){
    guestArea.style.display = 'none';
    userArea.style.display = 'flex';
    const roleEl = document.getElementById('sb-user-role');
    const nameEl = document.getElementById('sb-user-name');
    if(roleEl) roleEl.textContent = user.role;
    if(nameEl) nameEl.textContent = user.name;
    const show = (id, ok) => {
      const el = document.getElementById(id);
      if(el) el.style.display = ok ? 'inline' : 'none';
    };
    show('sb-admin-link', user.role === 'admin');
    show('sb-restaurant-link', user.role === 'restaurant');
    show('sb-delivery-link', user.role === 'delivery');
    const logoutBtn = document.getElementById('sb-logout');
    if(logoutBtn){
      logoutBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        localStorage.removeItem('sb_user');
        location.href = '../index.html';
      });
    }
  }
}

function getUser(){
  try{ return JSON.parse(localStorage.getItem('sb_user')||'null'); }
  catch{ return null; }
}

function setUser(user){
  localStorage.setItem('sb_user', JSON.stringify(user));
}

async function fetchJSON(path){
  const r = await fetch(path);
  if(!r.ok) throw new Error('Failed to load '+path);
  return r.json();
}

async function fetchText(path){
  const r = await fetch(path);
  if(!r.ok) throw new Error('Failed to load '+path);
  return r.text();
}

function qparam(name){
  const u = new URL(location.href);
  return u.searchParams.get(name) || '';
}

// ----- Cart Storage (localStorage) -----
function cartItems(){
  try{ return JSON.parse(localStorage.getItem('sb_cart')||'[]'); }
  catch{ return []; }
}
function saveCart(items){
  localStorage.setItem('sb_cart', JSON.stringify(items));
}
function clearCart(){
  localStorage.removeItem('sb_cart');
}
function addToCart(item){
  const items = cartItems();
  const idx = items.findIndex(i=>i.id===item.id);
  if(idx>=0) items[idx].qty = (items[idx].qty||0)+1;
  else items.push({...item, qty:1});
  saveCart(items);
}

// ----- Orders Storage (localStorage) -----
function orders(){
  try{ return JSON.parse(localStorage.getItem('sb_orders')||'[]'); }
  catch{ return []; }
}
function saveOrders(list){
  localStorage.setItem('sb_orders', JSON.stringify(list));
}
function addOrder(order){
  const list = orders();
  list.unshift(order);
  saveOrders(list);
}

const user = JSON.parse(localStorage.getItem("sb_user") || "null");

const userArea = document.getElementById("sb-user-area");
const guestArea = document.getElementById("sb-guest-area");

if(user){
  guestArea.style.display = "none";
  userArea.style.display = "flex";

  document.getElementById("sb-user-name").textContent = user.name;
  document.getElementById("sb-user-role").textContent = user.role;

  if(user.role === "admin")
    document.getElementById("sb-admin-link").style.display = "inline";
  if(user.role === "delivery")
    document.getElementById("sb-delivery-link").style.display = "inline";
}

document.getElementById("sb-logout")?.addEventListener("click", ()=>{
  localStorage.removeItem("sb_user");
  location.href = "login.html";
});

if(user?.role === "restaurant"){
  document.getElementById("sb-restaurant-link").style.display = "inline";
}
