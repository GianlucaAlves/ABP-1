const botaoEnviar = document.getElementById("aplicar");
const post = document.getElementsByClassName("pub-pub");
const formFiltro = document.getElementById("pr-filter");

formFiltro.addEventListener("submit", enviarFormulario);

function enviarFormulario(event) {
  event.preventDefault();

  let valorKeyWord = document
    .getElementById("palavra-chave")
    .value.toLowerCase();
  let valorData = document.getElementById("pr-date").value; // Pega o ANO (ex: "2007")
  let valorNome = document.getElementById("pr-nome").value.toLowerCase(); // Pega o AUTOR

  for (let i = 0; i < post.length; i++) {
    let textPostCompleto = post[i].textContent.toLowerCase();

    // MUDANÇA 1: Precisamos buscar o texto dos autores
    let autoresPost = post[i]
      .querySelector(".pub-authors")
      .textContent.toLowerCase();

    let elementoData = post[i].querySelector("[data-date]");

    // trava de seguranca
    let dataPost = "";
    if (elementoData) {
      // MUDANÇA 2: Usamos .substring(0, 4) para pegar SÓ o ano
      dataPost = elementoData.dataset.date.substring(0, 4); // Pega "2007" de "2007-10-31"
    }

    let mostrarEstePost = true;

    if (valorKeyWord !== "" && !textPostCompleto.includes(valorKeyWord)) {
      mostrarEstePost = false;
    }

    if (
      mostrarEstePost &&
      valorNome !== "" &&
      !autoresPost.includes(valorNome) // MUDANÇA 3: Comparamos com 'autoresPost'
    ) {
      mostrarEstePost = false;
    }

    // Esta comparação agora funciona (ex: "2007" === "2007")
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
