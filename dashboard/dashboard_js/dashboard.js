// =====================
// PROTEÇÃO UNIVERSAL
// =====================
const token = localStorage.getItem("token");
const userData = JSON.parse(localStorage.getItem("user"));

// Se não estiver logado → volta para login
if (!token || !userData) {
    window.location.href = "../login.html";
}


// =====================
// PREENCHER O DASHBOARD
// =====================
document.addEventListener("DOMContentLoaded", () => {

    const userNameEl = document.getElementById("userName");
    const userEmailEl = document.getElementById("userEmail");
    const userRoleEl  = document.getElementById("userRole");

    if (userNameEl)  userNameEl.textContent = userData.me_nome;
    if (userEmailEl) userEmailEl.textContent = userData.me_email;
    if (userRoleEl)  userRoleEl.textContent =
        userData.me_administrador ? "Administrador" : "Membro";

    // BOTÃO LOGOUT
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "../login.html";
        });
    }
});
