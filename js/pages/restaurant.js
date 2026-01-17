(async function(){
  const rid = qparam('id') || 'r1';
  const top = document.getElementById('restaurant-top');
  const grid = document.getElementById('menu-grid');
  if(!top || !grid) return;

  try{
    const [restaurants, menu] = await Promise.all([
      fetchJSON('data/restaurants.json'),
      fetchJSON('data/menu.json')
    ]);
    const r = restaurants.find(x => x.id === rid) || restaurants[0];
    if(!r){
      top.innerHTML = '<div class="card" style="padding:18px;">Restaurant not found.</div>';
      return;
    }
    top.innerHTML = `
      <div class="r">
        <div class="avatar">🍽️</div>
        <div>
          <h1 class="h1">${escapeHTML(r.name||'')}</h1>
          <div class="muted">⭐ ${escapeHTML(String(r.rating||''))} (${Number(r.ratings_count||0)}+)
            <span class="muted"> • ${escapeHTML(r.category||'')}</span>
          </div>
          <div class="promo">${escapeHTML(r.promo_text||'')}</div>
        </div>
      </div>
    `;

    const items = menu.filter(m => m.restaurant_id === r.id && Number(m.is_active) === 1);
    if(!items.length){
      grid.innerHTML = '<div class="card" style="padding:18px;">No menu items yet.</div>';
      return;
    }

    grid.innerHTML = items.map(it => {
      return `
        <div class="item card">
          <div class="thumb">🍔</div>
          <div class="title">${escapeHTML(it.name||'')}</div>
          <div class="price">৳ ${Number(it.price||0).toFixed(0)}</div>
          <div class="actions">
            <button class="btn btn-primary" data-add="${escapeHTML(it.id)}">Add to cart</button>
          </div>
        </div>
      `;
    }).join('');

    grid.addEventListener('click', (e)=>{
      const btn = e.target.closest('[data-add]');
      if(!btn) return;
      const id = btn.getAttribute('data-add');
      const it = items.find(x => x.id === id);
      if(!it) return;
      addToCart({
        id: it.id,
        name: it.name,
        price: Number(it.price||0),
        restaurant_id: r.id,
        restaurant_name: r.name
      });
      btn.textContent = 'Added!';
      setTimeout(()=>btn.textContent='Add to cart', 800);
    });
  }catch(e){
    console.error(e);
    top.innerHTML = '<div class="card" style="padding:18px;">Failed to load restaurant.</div>';
  }
})();

function escapeHTML(s){
  return String(s).replace(/[&<"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]||c));
}

(async function () {
  const params = new URLSearchParams(location.search);
  const rid = params.get("id") || "r1"; // default r1

  const res = await fetch("data/restaurants.json");
  const restaurants = await res.json();

  const r = restaurants.find(x => x.id === rid) || restaurants[0];

  // Update top info card
  document.getElementById("rest-name").textContent = r.name;
  document.getElementById("rest-sub").textContent = `${r.category} • ${r.location}`;
  document.getElementById("rest-rating").textContent = (r.rating ?? 0).toFixed(1);
  document.getElementById("rest-reviews").textContent = r.reviews ?? 0;

  // Promo dot show/hide
  const promoDot = document.querySelector(".promo-dot");
  if (promoDot) promoDot.style.display = r.promo ? "block" : "none";

  // (Optional) Page title update
  document.title = `${r.name} | SmartBite`;
})();
