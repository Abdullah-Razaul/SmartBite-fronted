const DELIVERY_CHARGE = 10;

(function(){
  render();

  document.addEventListener('click', (e)=>{
    const clearBtn = e.target.closest('[data-clear-cart]');
    if(clearBtn){
      clearCart();
      render();
      return;
    }

    const dec = e.target.closest('[data-dec]');
    const inc = e.target.closest('[data-inc]');
    const remove = e.target.closest('[data-remove]');
    if(dec || inc || remove){
      const id = (dec||inc||remove).getAttribute(dec?'data-dec':inc?'data-inc':'data-remove');
      const items = cartItems();
      const idx = items.findIndex(x=>x.id===id);
      if(idx<0) return;
      if(remove){
        items.splice(idx,1);
      } else if(dec){
        items[idx].qty = Math.max(0, (items[idx].qty||0)-1);
        if(items[idx].qty<=0) items.splice(idx,1);
      } else if(inc){
        items[idx].qty = (items[idx].qty||0)+1;
      }
      saveCart(items);
      render();
    }
  });
})();

function render(){
  const listEl = document.getElementById('cart-list');
  const sumEl = document.getElementById('cart-summary');
  if(!listEl || !sumEl) return;

  const items = cartItems();
  if(!items.length){
    listEl.innerHTML = '<div class="muted">Your cart is empty.</div>';
    sumEl.innerHTML = `
      <h2 class="h2">Summary</h2>
      <div class="row"><span>Subtotal</span><strong>৳ 0</strong></div>
      <div class="row"><span>Delivery</span><strong>৳ ${DELIVERY_CHARGE}</strong></div>
      <div class="row total"><span>Total</span><strong>৳ ${DELIVERY_CHARGE}</strong></div>
      <a class="btn btn-primary" href="browse.html" style="width:100%; margin-top:10px;">Browse restaurants</a>
    `;
    return;
  }

  let subtotal = 0;
  listEl.innerHTML = items.map(it => {
    const line = Number(it.price||0) * Number(it.qty||0);
    subtotal += line;
    return `
      <div class="item">
        <div class="name">${escapeHTML(it.name||'')}</div>
        <div class="muted small">${escapeHTML(it.restaurant_name||'')}</div>
        <div class="right">
          <div class="muted">৳ ${Number(it.price||0).toFixed(0)}</div>
          <div class="qtybox">
            <button class="btn" type="button" data-dec="${escapeHTML(it.id)}">-</button>
            <input class="input qty" value="${Number(it.qty||0)}" readonly>
            <button class="btn" type="button" data-inc="${escapeHTML(it.id)}">+</button>
            <button class="btn btn-danger" type="button" data-remove="${escapeHTML(it.id)}">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('') + `
    <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
      <button class="btn btn-danger" type="button" data-clear-cart>Clear cart</button>
      <a class="btn btn-primary" href="checkout.html">Checkout</a>
    </div>
  `;

  const total = subtotal + DELIVERY_CHARGE;
  sumEl.innerHTML = `
    <h2 class="h2">Summary</h2>
    <div class="row"><span>Subtotal</span><strong>৳ ${subtotal.toFixed(0)}</strong></div>
    <div class="row"><span>Delivery</span><strong>৳ ${DELIVERY_CHARGE}</strong></div>
    <div class="row total"><span>Total</span><strong>৳ ${total.toFixed(0)}</strong></div>
    <a class="btn btn-primary" href="checkout.html" style="width:100%; margin-top:10px;">Place order</a>
  `;
}

function escapeHTML(s){
  return String(s).replace(/[&<"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]||c));
}
