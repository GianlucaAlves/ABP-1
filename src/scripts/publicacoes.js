document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector(".pubs-grid");
 
  try {
    const res = await fetch("http://localhost:3000/posts?tipo=1"); // PUBLICAÇÕES
    const data = await res.json();
 
    // Limpa os cards estáticos
    grid.innerHTML = "";
 
    data.forEach(pub => {
      const div = document.createElement("div");
      div.classList.add("pub-pub");
 
      div.innerHTML = `
        <article class="pub-article" data-id="${pub.id_conteudo}">
          <div class="pub-card">
 
            <img class="pub-cover"
              src="../src/assets/image/co${pub.id_conteudo}.jpg"
              onerror="this.onerror=null; this.src='../src/assets/image/co${pub.id_conteudo}.png';"
              alt="capa"
            >
 
            <h2 class="pub-title">${pub.co_titulo}</h2>
            <p class="pub-authors">
              Por ${pub.autor_nome || pub.co_autor || "Autor desconhecido"} (${new Date(pub.co_data).getFullYear() || "s/ano"})
            </p>
          </div>
 
          <div class="pub-actions">
            <button class="btn" onclick="window.open('${pub.co_pdf}', '_blank')">PDF</button>
            <button class="btn" onclick="navigator.clipboard.writeText('${pub.co_citacao || ""}')">Citação</button>
            <button class="btn" onclick="window.open('https://doi.org/${pub.co_doi}', '_blank')">DOI</button>
          </div>
        </article>
      `;
 
      grid.appendChild(div);
    });
 
  } catch (err) {
    console.error("Erro ao carregar publicações:", err);
  }
});