const botaoEnviar = document.getElementById("aplicar");
const post = document.getElementsByClassName("pub-pub");
const formFiltro = document.getElementById("pr-filter");

formFiltro.addEventListener("submit", enviarFormulario);

function enviarFormulario(event) {
  event.preventDefault();

  let valorKeyWord = document
    .getElementById("palavra-chave")
    .value.toLowerCase();
  let valorData = document.getElementById("pr-date").value;
  let valorNome = document.getElementById("pr-nome").value.toLowerCase();

  for (let i = 0; i < post.length; i++) {
    let textPostCompleto = post[i].textContent.toLowerCase();
    let tituloPost = post[i].querySelector("h2").textContent.toLowerCase();

    let elementoData = post[i].querySelector("[data-date]");

    // trava de seguranca
    let dataPost = "";
    if (elementoData) {
      dataPost = elementoData.dataset.date; 
    }

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

    if (mostrarEstePost && valorData !== "" && dataPost !== valorData) {
      mostrarEstePost = false;
    }

    if (mostrarEstePost) {
      post[i].style.display = "flex";
    } else {
      post[i].style.display = "none";
    }
  }
}
