

(async function(){
  const data = await fetch("data/restaurants.json").then(r=>r.json());
  const tbody = document.getElementById("rests-body");
  tbody.innerHTML = "";

  data.forEach(r=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${r.id_num ?? r.id}</td>
      <td>${r.name}</td>
      <td>${r.owner_name || r.owner || "Owner"}</td>
      <td class="muted">${r.category}</td>
      <td><span class="star">⭐</span> ${Number(r.rating || 0).toFixed(1)}</td>
    `;
    tbody.appendChild(tr);
  });
})();
