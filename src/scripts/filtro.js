const botaoEnviar = document.getElementById("aplicar");
const post = document.getElementsByTagName("article");
const formFiltro = document.getElementById("pr-filter");

formFiltro.addEventListener("submit", enviarFormulario);

function enviarFormulario(event) {
  event.preventDefault();

  let valorKeyWord = document
    .getElementById("palavra-chave")
    .value.toLowerCase();
  let valorStatus = document.getElementById("pr-status").value.toLowerCase();
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

    if (mostrarEstePost) {
      post[i].style.display = "flex";
    } else {
      post[i].style.display = "none";
    }
  }
  botaoPrev.style.opacity = "0";
  botaoProx.style.opacity = "0";
}
