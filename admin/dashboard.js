(async function(){
  const [users, rests, orders] = await Promise.all([
    fetch("data/users.json").then(r=>r.json()),
    fetch("data/restaurants.json").then(r=>r.json()),
    fetch("data/admin_orders.json").then(r=>r.json())
  ]);

  document.getElementById("stat-users").textContent = users.length;
  document.getElementById("stat-restaurants").textContent = rests.length;
  document.getElementById("stat-orders").textContent = orders.length;
})();
