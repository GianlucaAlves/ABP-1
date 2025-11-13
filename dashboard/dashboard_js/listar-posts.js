const apiUrl = "http://localhost:3000/posts";



let currentFilter = ""; // variável global

document.getElementById("filterTipo").addEventListener("change", e => {
  currentFilter = e.target.value;
  loadConteudos(currentFilter);
});




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
      <td>${c.co_autor}</td>
      <td>${c.co_tipo_conteudo}</td>
      <td>${c.co_data_inicio || ""}</td>
      <td class="actions">
        <button type="button" class="edit" onclick="editConteudo(${c.id_conteudo})">Editar</button>
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

  currentFilter = document.getElementById("filterTipo").value; // salva filtro atual
  console.log("Filtro salvo:", currentFilter);

  const res = await fetch(`${apiUrl}/${id}`);
  const data = await res.json();

  document.getElementById("editTitulo").value = data.co_titulo;
  document.getElementById("editAutor").value = data.co_autor || data.autor_nome;
  document.getElementById("editTipo").value = data.co_tipo_conteudo;
  document.getElementById("editData").value = data.co_data_inicio ? data.co_data_inicio.split("T")[0] : "";

  document.getElementById("editModal").style.display = "flex";
}

async function saveEdit() {
  const formData = new FormData();
  formData.append("co_titulo", document.getElementById("editTitulo").value);
  formData.append("co_autor", document.getElementById("editAutor").value);
  formData.append("co_tipo_conteudo", document.getElementById("editTipo").value);
  formData.append("co_data_inicio", document.getElementById("editData").value);

  const fileInput = document.getElementById("editImagem");
  if (fileInput.files.length > 0) {
    formData.append("imagem", fileInput.files[0]);
  }

  const res = await fetch(`${apiUrl}/${editingId}`, {
    method: "PUT",
    body: formData
  });

  if (res.ok) {
    closeModal();
    console.log("Antes do reload, filtro:", document.getElementById("filterTipo").value);
    loadConteudos(currentFilter);

  } else {
    alert("Erro ao salvar");
  }

  console.log("Filtro atual:", currentFilter);
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
