const DELIVERY_CHARGE = 10;

(function(){
  renderSummary();
  const form = document.getElementById('checkout-form');
  const msg = document.getElementById('checkout-msg');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const user = getUser() || {name:'Guest', role:'customer'};
      const address = String(form.address.value||'').trim();
      if(address.length < 6){
        if(msg) msg.innerHTML = '<div class="error">Please enter a valid delivery address.</div>';
        return;
      }
      const items = cartItems();
      if(!items.length){
        if(msg) msg.innerHTML = '<div class="error">Your cart is empty.</div>';
        return;
      }
      const subtotal = items.reduce((s,i)=>s + Number(i.price||0)*Number(i.qty||0),0);
      const total = subtotal + DELIVERY_CHARGE;
      const order = {
        id: 'o' + Date.now(),
        created_at: new Date().toISOString(),
        customer_name: user.name,
        address,
        restaurant_name: items[0].restaurant_name || '',
        status: 'pending',
        subtotal,
        delivery: DELIVERY_CHARGE,
        total,
        items: items.map(i=>({id:i.id,name:i.name,qty:i.qty,price:i.price}))
      };
      addOrder(order);
      clearCart();
      renderSummary();
      form.reset();
      if(msg) msg.innerHTML = '<div class="ok">Order placed (demo). Check Orders page.</div>';
    });
  }
})();

function renderSummary(){
  const sumEl = document.getElementById('checkout-summary');
  if(!sumEl) return;
  const items = cartItems();
  const subtotal = items.reduce((s,i)=>s + Number(i.price||0)*Number(i.qty||0),0);
  const total = subtotal + DELIVERY_CHARGE;
  sumEl.innerHTML = `
    <h2 class="h2">Summary</h2>
    <div class="row"><span>Items</span><strong>${items.length}</strong></div>
    <div class="row"><span>Subtotal</span><strong>৳ ${subtotal.toFixed(0)}</strong></div>
    <div class="row"><span>Delivery</span><strong>৳ ${DELIVERY_CHARGE}</strong></div>
    <div class="row total"><span>Total</span><strong>৳ ${total.toFixed(0)}</strong></div>
  `;
}
