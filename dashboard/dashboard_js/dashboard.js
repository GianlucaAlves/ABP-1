// Verifica se o usuário está logado
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }
// Busca dados do usuário logado
async function loadUserInfo() {
  try {
    const res = await fetch("http://localhost:3000/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401 || res.status === 403) {
      alert("Sessão expirada ou inválida. Faça login novamente.");
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    const user = await res.json();

    document.getElementById("userName").textContent = user.name;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userRole").textContent =
      user.role === "admin" ? "Administrador" : "Membro";
  } catch (error) {
    console.error("Erro ao carregar informações:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");
  const userRole = document.getElementById("userRole");
  const logoutBtn = document.getElementById("logoutBtn");

  // Recupera dados do usuário do localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));

  // Se não houver login, redireciona para a página de login
  if (!userData) {
    window.location.href = "login.html";
    return;
  }

  // Exibe informações do usuário
  userName.textContent = userData.name;
  userEmail.textContent = userData.email;
  userRole.textContent = userData.role;

  // Exibe ou oculta itens de acordo com a função
  const adminElements = document.querySelectorAll(".admin-only");

  if (userData.role !== "admin") {
    adminElements.forEach((el) => (el.style.display = "none"));
  }

  // Botão de sair
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../login.html";
  });
});

  loadUserInfo();