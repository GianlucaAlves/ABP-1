// =============================
// LOGIN
// =============================
const form = document.getElementById("login-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("error-message");

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        errorMessage.textContent = data.error || "Erro no login.";
        return;
      }
      

      // salvar token localmente
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // redirecionar
      window.location.href = "./dashboard_html/dashboard.html";
    } catch (err) {
      console.error(err);
      errorMessage.textContent = "Falha na conexão com o servidor.";
    }
  });
}

// =============================
// DASHBOARD (protegido)
// =============================
if (window.location.pathname.endsWith("dashboard.html")) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
  }

  const userNameEl = document.getElementById("user-name");
  if (user && userNameEl) {
    userNameEl.textContent = user.name;
  }

  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "../dashboard_html/login.html";
    });
  }
}
