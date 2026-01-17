function statusPill(s){
  return `<span class="status-pill">${s}</span>`;
}

(async function(){
  const data = await fetch("data/admin_orders.json").then(r=>r.json());
  const tbody = document.getElementById("orders-body");
  tbody.innerHTML = "";

  data.forEach(o=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${o.id}</td>
      <td>${o.restaurant}</td>
      <td>${o.customer}</td>
      <td class="muted">${o.rider || "—"}</td>
      <td>${statusPill(o.status)}</td>
      <td>৳ ${(Number(o.total)||0).toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
})();
