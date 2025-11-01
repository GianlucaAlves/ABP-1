const apiUrl = "http://localhost:3000/membros"; 

// CARREGAR MEMBROS
async function loadMembros(cargo = "") {
  const url = cargo ? `${apiUrl}?cargo=${cargo}` : apiUrl;
  const res = await fetch(url);
  const data = await res.json();

  const tbody = document.querySelector("#membrosTable tbody");
  tbody.innerHTML = "";

  data.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.id_membro}</td>
      <td>${m.me_nome}</td>
      <td>${m.me_cpf}</td>
      <td>${m.me_email}</td>
      <td>${m.ca_nome_cargo || ""}</td>
      <td>${m.me_administrador ? "Sim" : "Não"}</td>
      <td class="actions">
        <button class="edit" onclick="editMembro(${m.id_membro})">Editar</button>
        <button class="delete" onclick="deleteMembro(${m.id_membro})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// EXCLUIR MEMBRO
async function deleteMembro(id) {
  if (!confirm("Deseja realmente excluir este membro?")) return;
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  loadMembros(document.getElementById("filterCargo").value);
}

// FILTRO POR CARGO
document.getElementById("filterCargo").addEventListener("change", e => {
  loadMembros(e.target.value);
});

// CARREGA MEMBROS AO INICIAR
loadMembros();
