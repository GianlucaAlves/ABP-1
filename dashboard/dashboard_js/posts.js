const apiUrl = "http://localhost:3000/posts";

document.getElementById("conteudoForm").addEventListener("submit", async e => {
  e.preventDefault();

  const payload = {
    co_titulo: document.getElementById("co_titulo").value,
    co_autor: document.getElementById("co_autor").value,
    co_tipo_conteudo: document.getElementById("co_tipo_conteudo").value,
    co_pdf: document.getElementById("co_pdf").value || null,
    co_citacao: document.getElementById("co_citacao").value || null,
    co_doi: document.getElementById("co_doi").value || null,
    co_lide: document.getElementById("co_lide").value || null,
    co_status: document.getElementById("co_status").value || null,
    co_data_inicio: document.getElementById("co_data_inicio").value || null,
    co_data_termino: document.getElementById("co_data_termino").value || null,
    co_objetivo: document.getElementById("co_objetivo").value || null,
    co_requisitos: document.getElementById("co_requisitos").value || null,
    co_plano_trabalho: document.getElementById("co_plano_trabalho").value || null,
    co_atividades: document.getElementById("co_atividades").value || null
  };

  try {
    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    alert("Conteúdo criado com sucesso!");
    document.getElementById("conteudoForm").reset();
  } catch (err) {
    console.error(err);
    alert("Erro ao criar conteúdo");
  }
});
