const apiUrl = "http://localhost:3000/posts";

document.getElementById("conteudoForm").addEventListener("submit", async e => {
  e.preventDefault();

    const formData = new FormData();
  formData.append("co_titulo", document.getElementById("co_titulo").value);
  formData.append("co_autor", document.getElementById("co_autor").value);
  formData.append("co_tipo_conteudo", document.getElementById("co_tipo_conteudo").value);
  formData.append("co_pdf", document.getElementById("co_pdf").value || "");
  formData.append("co_citacao", document.getElementById("co_citacao").value || "");
  formData.append("co_doi", document.getElementById("co_doi").value || "");
  formData.append("co_lide", document.getElementById("co_lide").value || "");
  formData.append("co_status", document.getElementById("co_status").value || "");
  formData.append("co_data_inicio", document.getElementById("co_data_inicio").value || "");
  formData.append("co_data_termino", document.getElementById("co_data_termino").value || "");
  formData.append("co_objetivo", document.getElementById("co_objetivo").value || "");
  formData.append("co_requisitos", document.getElementById("co_requisitos").value || "");
  formData.append("co_plano_trabalho", document.getElementById("co_plano_trabalho").value || "");
  formData.append("co_atividades", document.getElementById("co_atividades").value || "");
  formData.append("co_conteudo", document.getElementById("co_conteudo").value || "");

  // 🧠 Aqui vem a diferença principal:
  const fileInput = document.getElementById("co_imagem");
  if (fileInput.files.length > 0) {
    formData.append("imagem", fileInput.files[0]);
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      body: formData, // ⚠️ sem JSON, sem headers Content-Type
    });

    if (!res.ok) throw new Error("Erro ao criar conteúdo");

    alert("Conteúdo criado com sucesso!");
    document.getElementById("conteudoForm").reset();
  } catch (err) {
    console.error("Erro ao enviar conteúdo:", err);
    alert("Erro ao criar conteúdo");
  }
});
