news = document.getElementsByTagName("article");
let marcador = 0;
const itensPagina = 3;
botaoProx = document.getElementById("prox");
botaoPrev = document.getElementById("prev");
totalPaginas = Math.ceil(news.length / itensPagina);

function mostrarPagina(pagina) {
  indiceInicial = pagina * itensPagina;
  indiceFinal = indiceInicial + itensPagina;

  for (let i = 0; i < news.length; i++) {
    news[i].style.display = "none";
  }
  for (let i = indiceInicial; i < indiceFinal && i < news.length; i++) {
    news[i].style.display = "flex";
  }
  if (marcador < totalPaginas && marcador < totalPaginas - 1) {
    botaoProx.style.opacity = "1";
  } else {
    botaoProx.style.opacity = "0";
  }
  if (marcador > 0) {
    botaoPrev.style.opacity = "1";
  } else {
    botaoPrev.style.opacity = "0";
  }
}

mostrarPagina(marcador);

botaoProx.addEventListener("click", () => {
  if (marcador < totalPaginas && marcador < totalPaginas - 1) {
    marcador = marcador + 1;
    mostrarPagina(marcador);
  } else {
    botaoProx.style.opacity = "0";
  }
});

botaoPrev.addEventListener("click", () => {
  if (marcador > 0) {
    marcador = marcador - 1;
    mostrarPagina(marcador);
  } else {
    botaoPrev.style.opacity = "0";
  }
});
