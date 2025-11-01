const apiUrl = "http://localhost:3000/posts";

async function loadConteudos(tipo = "") {
  const url = tipo ? `${apiUrl}?tipo=${tipo}` : apiUrl;
  const res = await fetch(url);
  const data = await res.json();

  const tbody = document.querySelector("#conteudoTable tbody");
  tbody.innerHTML = "";

  data.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id_conteudo}</td>
      <td>${c.co_titulo}</td>
      <td>${c.autor_nome || c.co_autor}</td>
      <td>${c.tc_conteudo}</td>
      <td>${c.co_data_inicio || ""}</td>
      <td class="actions">
        <button class="edit" onclick="editConteudo(${c.id_conteudo})">Editar</button>
        <button class="delete" onclick="deleteConteudo(${c.id_conteudo})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// EXCLUIR
async function deleteConteudo(id) {
  if (!confirm("Deseja realmente excluir este conteúdo?")) return;
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  loadConteudos(document.getElementById("filterTipo").value);
}

// FILTRO POR TIPO
document.getElementById("filterTipo").addEventListener("change", e => {
  loadConteudos(e.target.value);
});

// CARREGA CONTEÚDOS AO INICIAR
loadConteudos();
