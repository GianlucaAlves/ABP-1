document.addEventListener("DOMContentLoaded", async () => {
  // 1. Acha o container. É a <section> dentro do <main>
  const container = document.querySelector("main section");

  // 2. Acha o ponto de referência (os botões de paginação)
  //    A gente vai inserir os projetos novos ANTES desses botões.
  const insertionPoint = container.querySelector(".main-buttons-pos");

  try {
    // 3. Busca na API os PROJETOS (tipo=3, de acordo com seu BD)
    const res = await fetch("http://localhost:3000/posts?tipo=3");
    const data = await res.json();

    // 4. Limpa só os <article> estáticos de exemplo
    //    (A gente NÃO dá innerHTML = "" pra não apagar o formulário de filtro)
    const staticArticles = container.querySelectorAll("article");
    staticArticles.forEach((article) => article.remove());

    // 5. Renderiza os projetos do banco
    data.forEach((projeto) => {
      const article = document.createElement("article");

      // Formata a data de início (do BD)
      const dataInicio = new Date(projeto.co_data_inicio).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );

      // 6. Monta o HTML do novo <article>
      //    Usando as colunas do BD: co_titulo, co_atividades, co_status, co_data_inicio
      //    E as classes do projetos.html
      article.innerHTML = `
        <img src="http://localhost:3000/uploads/${projeto.co_imagem}" alt="${projeto.co_titulo}"
        />
        <div class="article-text">
          <a href="./projeto-individual.html?id=${projeto.id_conteudo}">
            <h2>${projeto.co_titulo}</h2>
          </a>
          <p>${projeto.co_atividades}</p> <h5>Situação: ${projeto.co_status}</h5> <h6 data-date="${projeto.co_data_inicio}">Data de inicio: ${dataInicio}</h6>
        </div>
      `;

      // 7. Insere o novo projeto no container, antes dos botões
      container.insertBefore(article, insertionPoint);
    });
  } catch (err) {
    console.error("Erro ao carregar projetos:", err);
    // Mensagem de fallback caso dê ruim
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "Não foi possível carregar os projetos no momento.";
    errorMsg.style.textAlign = "center";
    errorMsg.style.color = "#fff";
    container.insertBefore(errorMsg, insertionPoint);
  }
});
