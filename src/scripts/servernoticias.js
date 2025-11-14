async function findImage(base) {
  const exts = ["webp", "jpg", "png"];
  const check = url =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject();
      img.src = url;
    });
  for (const ext of exts) {
    const path = `${base}.${ext}`;
    try {
      await check(path);
      return path;
    } catch (e) {}
  }
  return null;
}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector(".noticias-grid"); // container no HTML
  try {
    const res = await fetch("http://localhost:3000/posts?tipo=2"); // notícias
    const noticias = await res.json();

    grid.innerHTML = ""; // limpa os cards estáticos

    for (const pub of noticias) {
      const div = document.createElement("div");
      div.classList.add("no-content");

      // Imagem
      const imgDiv = document.createElement("div");
      imgDiv.classList.add("no-img");
      imgDiv.innerHTML = `<img src="http://localhost:3000/uploads/${pub.co_imagem}" alt="${pub.co_titulo}"
        />`

     const div2 = document.createElement("div");
     div2.classList.add("no-text");
        // Título
      const h3 = document.createElement("h3");
      h3.classList.add("no-sub");
      h3.textContent = pub.co_titulo;

      // Resumo
      const p = document.createElement("p");
      p.textContent = pub.co_lide ?? "Sem resumo disponível.";

      // Monta card
      div.appendChild(imgDiv);
      div.appendChild(div2);
      div2.appendChild(h3);
      div2.appendChild(p);
      
      // Clique para abrir notícia individual
      div.style.cursor = "pointer";
      div.addEventListener("click", () => {
        window.location.href = `notindividual.html?id=${pub.id_conteudo}`;
      });

      grid.appendChild(div);
    }
  } catch (err) {
    console.error("Erro ao carregar notícias:", err);
  }
});