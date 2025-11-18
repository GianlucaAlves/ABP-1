/*
  Função MESTRE para checar imagens.
  Ela é async e retorna a URL que funcionar, ou null.
*/
async function findImage(base) {
  const exts = ["webp", "jpg", "png"]; // Ordem de prioridade

  // Função helper que usa Promise
  const check = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject();
      img.src = url;
    });

  for (const ext of exts) {
    const path = `${base}.${ext}`;
    try {
      await check(path); // Tenta carregar
      return path; // Sucesso! Retorna o caminho
    } catch (e) {
      // Falhou, tenta o próximo
    }
  }

  return null; // Nenhuma funcionou
}

/*
  Nosso script principal
*/
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/posts?tipo=2"); // notícias
    const noticias = await res.json();

    const cards = document.querySelectorAll(".no-content");

    // O forEach precisa ser async pra gente poder usar await dentro dele
    cards.forEach(async (card, i) => {
      const pub = noticias[i];

      if (!pub) {
        card.style.display = "none";
        return;
      }

      // ===============================
      //   IMAGEM (O Jeito Certo)
      // ===============================
      const imgDiv = card.querySelector("[class^='no-img']");
      if (imgDiv) {
        // CORREÇÃO DO ERRO DE DIGITAÇÃO AQUI:
        const base = `../src/assets/image/co${pub.id_conteudo}`;

        const imageUrl = await findImage(base); // Usa a função mestre

        if (imageUrl) {
          imgDiv.style.backgroundImage = `url('${imageUrl}')`;
        } else {
          // Usa a imagem padrão se não achar NENHUMA
          imgDiv.style.backgroundImage = `url('../src/assets/image/default.png')`;
        }
      }

      // ===============================
      //   TÍTULO + RESUMO (LIDE)
      // ===============================
      const h3 = card.querySelector("h3");
      if (h3) h3.textContent = pub.co_titulo;

      const p = card.querySelector("p");
      if (p) p.textContent = pub.co_lide ?? "Sem resumo disponível.";

      // ===============================
      //   CLIQUE NA DIV → NOTÍCIA INDIVIDUAL
      // ===============================
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        window.location.href = `notindividual.html?id=${pub.id_conteudo}`;
      });

      // ===============================
      //   REMOVER LINKS INTERFERENTES
      // ===============================
      const a = card.querySelector("a");
      if (a) a.removeAttribute("href");
    });
  } catch (err) {
    console.error("Erro ao carregar notícias:", err);
  }
});
