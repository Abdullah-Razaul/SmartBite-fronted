(async function(){
  const qRaw = qparam('q');
  const q = qRaw.trim().toLowerCase();
  const catRaw = qparam('cat');
  const cat = catRaw.trim().toLowerCase();

  const input = document.querySelector('input[name="q"]');
  if(input) input.value = qRaw;

  const grid = document.getElementById('browse-grid');
  if(!grid) return;

  try{
    const restaurants = await fetchJSON('data/restaurants.json');
    const filtered = restaurants.filter(r => {
      const name = String(r.name||'').toLowerCase();
      const category = String(r.category||'').toLowerCase();
      const matchesQ = !q || name.includes(q) || category.includes(q);
      const matchesCat = !cat || category.includes(cat);
      return matchesQ && matchesCat;
    }).sort((a,b) => (b.rating||0) - (a.rating||0));

    if(!filtered.length){
      grid.innerHTML = '<div class="card empty">No restaurants found.</div>';
      return;
    }

    grid.innerHTML = filtered.map(r => {
      return `
        <a class="r-card card" href="restaurant.html?id=${encodeURIComponent(r.id)}">
          <div class="promo">${escapeHTML(r.promo_text||'')}</div>
          <div class="img">🍽️</div>
          <div class="name">${escapeHTML(r.name||'')}</div>
          <div class="meta">
            ⭐ ${escapeHTML(String(r.rating||''))} (${Number(r.ratings_count||0)}+)
            <span class="muted"> • ${escapeHTML(r.category||'')}</span>
          </div>
        </a>
      `;
    }).join('');
  }catch(e){
    console.error(e);
    grid.innerHTML = '<div class="card empty">Failed to load data.</div>';
  }
})();

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
}
