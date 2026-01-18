document.getElementById("login-form")?.addEventListener("submit", function(e){
  e.preventDefault();

  const email = this.email.value.trim();
  const password = this.password.value.trim();
  const msg = document.getElementById("login-msg");

  let user = null;

  if(email === "admin@smartbite.com" && password === "admin123"){
    user = { name: "Admin", role: "admin" };
  }
  else if(email === "customer@smartbite.com" && password === "customer123"){
    user = { name: "Customer", role: "customer" };
  }
  else if(email === "delivery@smartbite.com" && password === "delivery123"){
    user = { name: "Delivery Boy", role: "delivery" };
  }
  else if(email === "restaurant@smartbite.com" && password === "restaurant123"){
    user = { name: "Restaurant Owner", role: "restaurant" };
  }

  if(!user){
    msg.textContent = "Invalid demo credentials!";
    msg.style.color = "#c81d2c";
    return;
  }

  localStorage.setItem("sb_user", JSON.stringify(user));

  msg.textContent = "Login successful! Redirecting...";
  msg.style.color = "#137a38";

  setTimeout(()=>{
    if(user.role === "admin") location.href = "admin_dashboard.html";
    else if(user.role === "restaurant") location.href = "restaurant_dashboard.html";
    else if(user.role === "delivery") location.href = "delivery_dashboard.html";
    else location.href = "index.html";
  }, 800);
});

// Demo credential "Use" buttons
document.querySelectorAll(".demo-row .demo-fill").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const row = btn.closest(".demo-row");
    document.getElementById("email").value = row.dataset.email;
    document.getElementById("password").value = row.dataset.pass;
    document.getElementById("password").focus();
  });
});

// Copy all credentials
document.getElementById("copy-demo")?.addEventListener("click", async ()=>{
  const text =
`Admin: admin@smartbite.com / admin123
Customer: customer@smartbite.com / customer123
Delivery: delivery@smartbite.com / delivery123
Restaurant: restaurant@smartbite.com / restaurant123`;
  try{
    await navigator.clipboard.writeText(text);
    const msg = document.getElementById("login-msg");
    if(msg){ msg.textContent = "Demo credentials copied!"; msg.className="auth-msg ok"; }
  }catch(e){
    alert(text);
  }
});
