(async function(){
  try{
    const restaurants = await fetchJSON('data/restaurants.json');
    const grid = document.getElementById('popular-restaurants');
    if(!grid) return;
    if(!restaurants.length){
      grid.innerHTML = '<div class="card" style="padding:18px;">No restaurants yet.</div>';
      return;
    }
    grid.innerHTML = restaurants.slice(0,8).map(r => {
      return `
        <a class="r-card card" href="restaurant.html?id=${encodeURIComponent(r.id)}">
          <div class="promo">${escapeHTML(r.promo_text||'')}</div>
          <div class="r-img">🍽️</div>
          <div class="r-name">${escapeHTML(r.name)}</div>
          <div class="r-meta">
            ⭐ ${escapeHTML(String(r.rating))} (${Number(r.ratings_count||0)}+)
            <span class="muted"> • ${escapeHTML(r.category||'')}</span>
          </div>
        </a>
      `;
    }).join('');
  }catch(e){
    console.error(e);
  }
})();

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
}
