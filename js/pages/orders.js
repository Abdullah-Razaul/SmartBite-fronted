(function(){
  const wrap = document.getElementById('orders-wrap');
  if(!wrap) return;
  const list = orders();
  if(!list.length){
    wrap.innerHTML = '<div class="card" style="padding:18px;">No orders yet.</div>';
    return;
  }
  wrap.innerHTML = list.map(o => {
    const dt = new Date(o.created_at);
    return `
      <div class="card" style="padding:18px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
          <div>
            <div class="h2" style="margin:0;">${escapeHTML(o.restaurant_name||'Order')}</div>
            <div class="muted small">${dt.toLocaleString()}</div>
            <div class="muted small">Status: <span class="badge">${escapeHTML(o.status||'pending')}</span></div>
          </div>
          <div style="text-align:right;">
            <div class="muted">Total</div>
            <div class="h2" style="margin:0;">৳ ${Number(o.total||0).toFixed(0)}</div>
          </div>
        </div>
        <div style="margin-top:12px;" class="muted">Deliver to: ${escapeHTML(o.address||'')}</div>
        <hr style="border:none; border-top:1px solid var(--border); margin:12px 0;">
        <div>
          ${ (o.items||[]).map(it => `<div class="muted small">${escapeHTML(it.name)} × ${Number(it.qty||0)} — ৳ ${Number(it.price||0).toFixed(0)}</div>`).join('') }
        </div>
      </div>
    `;
  }).join('');
})();

function escapeHTML(s){
  return String(s).replace(/[&<"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]||c));
}
