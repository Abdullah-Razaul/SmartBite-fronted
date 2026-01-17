let ALL = [];

function badge(role){
  return `<span class="role-badge">${role}</span>`;
}

function render(list){
  const tbody = document.getElementById("users-body");
  tbody.innerHTML = "";

  if(!list.length){
    tbody.innerHTML = `<tr><td class="muted" colspan="5">No users found.</td></tr>`;
    return;
  }

  list.forEach(u=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${u.id}</td>
      <td>${badge(u.role)}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td style="text-align:center;">
        <button class="btn-del" data-id="${u.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll(".btn-del").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = Number(btn.dataset.id);
      if(!confirm("Delete this user? (demo)")) return;
      ALL = ALL.filter(x=>x.id !== id);
      render(ALL);
    });
  });
}

function applySearch(){
  const q = (document.getElementById("user-q").value || "").toLowerCase().trim();
  if(!q) return render(ALL);
  const filtered = ALL.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    u.role.toLowerCase().includes(q) ||
    String(u.id).includes(q)
  );
  render(filtered);
}

(async function(){
  ALL = await fetch("data/users.json").then(r=>r.json());
  render(ALL);

  document.getElementById("user-search").addEventListener("click", applySearch);
  document.getElementById("user-q").addEventListener("keydown", (e)=>{ if(e.key==="Enter") applySearch(); });
  document.getElementById("user-reset").addEventListener("click", ()=>{
    document.getElementById("user-q").value = "";
    render(ALL);
  });
})();
