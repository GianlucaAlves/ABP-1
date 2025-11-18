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
      <td>${c.co_tipo_conteudo}</td>
      <td>${c.co_data_inicio || ""}</td>
      <td class="actions">
        <button class="edit" onclick="editConteudo(${c.id_conteudo})">Editar</button>
        <button class="delete" onclick="deleteConteudo(${c.id_conteudo})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

let editingId = null;

async function editConteudo(id){
 console.log("Abrindo modal para ID:", id); // DEPURAÇÃO

  editingId = id;

  const res = await fetch(`${apiUrl}/${id}`);
  const data = await res.json();

  document.getElementById("editTitulo").value = data.co_titulo;
  document.getElementById("editAutor").value = data.co_autor || data.autor_nome;
  document.getElementById("editTipo").value = data.co_tipo_conteudo;
  document.getElementById("editData").value = data.co_data_inicio ? data.co_data_inicio.split("T")[0] : "";

  document.getElementById("editModal").style.display = "flex";
}

async function saveEdit() {
  const body = {
    co_titulo: document.getElementById("editTitulo").value,
    co_autor: document.getElementById("editAutor").value,
    co_tipo_conteudo: document.getElementById("editTipo").value,
    co_data_inicio: document.getElementById("editData").value
  };

  const res = await fetch(`${apiUrl}/${editingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

   if (res.ok) {
    closeModal();
    loadConteudos();
  } else {
    alert("Erro ao salvar");
  }
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
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
