/* * Este script combina o filtro.js e projetos.js
 * e espera o serverProjetos.js carregar o conteúdo antes de rodar.
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Acha o container que o serverProjetos.js vai preencher
  const container = document.querySelector("main section");

  if (!container) {
    console.error("ERRO: Container 'main section' não foi encontrado.");
    return;
  }

  // 2. Esta função contém TODO o código do filtro.js e projetos.js
  //    Ela só vai rodar DEPOIS que os artigos forem carregados.
  function inicializarProjetos() {
    console.log("Artigos carregados. Iniciando filtro e paginação...");

    // --- Início do código do projetos.js ---
    const articles = document.getElementsByTagName("article");
    if (articles.length === 0) {
      // Caso o server não retorne nada
      console.warn("Nenhum artigo encontrado para paginar.");
      return;
    }

    let marcador = 0;
    const itensPagina = 3;
    const botaoProx = document.getElementById("prox");
    const botaoPrev = document.getElementById("prev");
    let totalPaginas;

    function mostrarPagina(pagina) {
      // Pega *apenas* os artigos que NÃO estão escondidos pelo filtro
      let articlesVisiveis = [];
      for (let i = 0; i < articles.length; i++) {
        if (articles[i].style.display !== "none") {
          articlesVisiveis.push(articles[i]);
        }
      }

      totalPaginas = Math.ceil(articlesVisiveis.length / itensPagina);
      const indiceInicial = pagina * itensPagina;
      const indiceFinal = indiceInicial + itensPagina;

      // Esconde todos os artigos (que estavam visíveis)
      for (let i = 0; i < articlesVisiveis.length; i++) {
        articlesVisiveis[i].style.display = "none";
      }

      // Mostra apenas os da página atual
      for (
        let i = indiceInicial;
        i < indiceFinal && i < articlesVisiveis.length;
        i++
      ) {
        articlesVisiveis[i].style.display = "flex";
      }

      // Atualiza os botões
      botaoProx.style.opacity = pagina < totalPaginas - 1 ? "1" : "0";
      botaoPrev.style.opacity = pagina > 0 ? "1" : "0";
    }

    botaoProx.addEventListener("click", () => {
      if (marcador < totalPaginas - 1) {
        marcador++;
        mostrarPagina(marcador);
      }
    });

    botaoPrev.addEventListener("click", () => {
      if (marcador > 0) {
        marcador--;
        mostrarPagina(marcador);
      }
    });
    // --- Fim do código do projetos.js ---

    // --- Início do código do filtro.js ---
    const formFiltro = document.getElementById("pr-filter");

    formFiltro.addEventListener("submit", (event) => {
      event.preventDefault();
      const post = document.getElementsByTagName("article");

      let valorKeyWord = document
        .getElementById("palavra-chave")
        .value.toLowerCase();
      let valorStatus = document
        .getElementById("pr-status")
        .value.toLowerCase();
      let valorData = document.getElementById("pr-date").value;
      let valorNome = document.getElementById("pr-nome").value.toLowerCase();

      for (let i = 0; i < post.length; i++) {
        let textPostCompleto = post[i].textContent.toLowerCase();
        let tituloPost = post[i].querySelector("h2").textContent.toLowerCase();
        let statusPostTexto = post[i]
          .querySelector("h5")
          .textContent.toLowerCase();
        let dataPost = post[i].querySelector("h6").dataset.date;

        let mostrarEstePost = true;

        if (valorKeyWord !== "" && !textPostCompleto.includes(valorKeyWord)) {
          mostrarEstePost = false;
        }
        if (
          mostrarEstePost &&
          valorNome !== "" &&
          !tituloPost.includes(valorNome)
        ) {
          mostrarEstePost = false;
        }
        if (
          mostrarEstePost &&
          valorStatus !== "" &&
          !statusPostTexto.includes(valorStatus)
        ) {
          mostrarEstePost = false;
        }
        if (mostrarEstePost && valorData !== "" && dataPost !== valorData) {
          mostrarEstePost = false;
        }

        post[i].style.display = mostrarEstePost ? "flex" : "none";
      }

      // ---- CORREÇÃO CRÍTICA ----
      // Reseta a paginação para a página 1 após filtrar
      marcador = 0;
      mostrarPagina(marcador);
    });
    // --- Fim do código do filtro.js ---

    // --- INICIALIZAÇÃO ---
    // Mostra a primeira página assim que tudo estiver pronto
    mostrarPagina(marcador);
  }

  // 3. Configurar o "Vigia" (MutationObserver)
  // Este código vai ficar esperando o serverProjetos.js adicionar os <article>
  const observer = new MutationObserver((mutationsList, obs) => {
    for (const mutation of mutationsList) {
      // Se nós (elementos) foram adicionados...
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        // E se um desses nós é um <article>...
        let articleAdded = false;
        for (const node of mutation.addedNodes) {
          if (node.nodeName === "ARTICLE") {
            articleAdded = true;
            break;
          }
        }

        if (articleAdded) {
          // ...Nós encontramos! É hora de rodar nosso código!
          inicializarProjetos();

          // Para de vigiar (trabalho concluído)
          obs.disconnect();
          return;
        }
      }
    }
  });

  // 4. Ligar o "Vigia"
  // Diz ao vigia para observar o 'container' e avisar sobre 'childList' (adição/remoção de elementos)
  observer.observe(container, { childList: true });
  console.log(
    "Vigia (Observer) ligado. Esperando artigos do serverProjetos.js..."
  );
});
