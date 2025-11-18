const apiUrl = "http://localhost:3000/membros";

const form = document.getElementById("membroForm");
const msg = document.getElementById("msg");
const cargoSelect = document.getElementById("me_cargo");

// Recupera token e usuário do localStorage
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");

console.log("Usuário armazenado:", user);
console.log("Token armazenado:", token);

// Verifica se o usuário é admin
const isAdmin =
  user.me_administrador === true ||
  user.me_administrador === "true" ||
  user.me_administrador === 1 ||
  user.me_administrador === "t" ||
  user.isAdmin === true;

if (!token || !isAdmin) {
  alert("Acesso negado. Apenas administradores podem criar membros.");
  window.location.href = "/dashboard/dashboard.html"; // ajuste conforme seu caminho
}

// =======================
// CARREGAR CARGOS
// =======================
async function loadCargos() {
  try {
    const res = await fetch("http://localhost:3000/membros/tipos-cargo"); // rota para listar cargos
    if (!res.ok) throw new Error("Erro ao buscar cargos");

    const cargos = await res.json();
    cargos.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id_cargo;
      option.textContent = c.ca_nome_cargo;
      cargoSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar cargos:", err);
    msg.textContent = "Não foi possível carregar cargos";
    msg.style.color = "red";
  }
}

// =======================
// ENVIO DO FORMULÁRIO
// =======================
form.addEventListener("submit", async e => {
  e.preventDefault();

  const payload = {
    me_nome: document.getElementById("me_nome").value.trim(),
    me_cpf: document.getElementById("me_cpf").value.trim(),
    me_email: document.getElementById("me_email").value.trim(),
    me_senha: document.getElementById("me_senha").value,
    me_cargo: cargoSelect.value || null,
    me_administrador: document.getElementById("me_administrador").checked
  };

  console.log("Payload enviado:", payload);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Resposta do backend:", data);

    if (!res.ok) {
      msg.textContent = data.error || "Erro ao criar membro";
      msg.style.color = "red";
      return;
    }

    msg.textContent = `Membro ${data.me_nome} criado com sucesso!`;
    msg.style.color = "green";
    form.reset();

  } catch (err) {
    console.error("Erro na requisição:", err);
    msg.textContent = "Erro ao criar membro";
    msg.style.color = "red";
  }
});

// =======================
// INICIALIZAÇÃO
// =======================
loadCargos();
