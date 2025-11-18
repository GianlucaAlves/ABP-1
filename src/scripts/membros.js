// =========================
// CONFIGURAÇÃO
// =========================
const API_URL = "http://localhost:3000/membros"; // ajuste se necessário
const containerPrincipal = document.querySelector("#membros-container");

// =========================
// LIMPAR OS ELEMENTOS ESTÁTICOS (subtitles + cards) DENTRO DO CONTAINER PRINCIPAL
// Removemos apenas .mb-subtitle e .mb-cards que são filhos diretos do #membros-container,
// preservando outros elementos (ex: título, linhas, etc).
// =========================
function limparEstruturaEstatica() {
  if (!containerPrincipal) return;
  // Seleciona apenas filhos diretos para evitar remover subtítulos em outros lugares
  const filhosDiretos = Array.from(containerPrincipal.children);

  filhosDiretos.forEach(child => {
    if (child.classList && (child.classList.contains("mb-subtitle") || child.classList.contains("mb-cards"))) {
      child.remove();
    }
  });

  console.log("[membros.js] Estrutura estática (subtitles + mb-cards) removida.");
}

// =========================
// FUNÇÃO PARA CRIAR SUBTÍTULO (idêntico ao HTML original)
// =========================
function criarSubtitulo(cargoName) {
  const subtitleWrapper = document.createElement("div");
  subtitleWrapper.classList.add("mb-subtitle");
  subtitleWrapper.innerHTML = `<p class="mb-name">${cargoName}</p>`;
  return subtitleWrapper;
}

// =========================
// FUNÇÃO PARA CRIAR WRAPPER .mb-cards
// =========================
function criarWrapperCards() {
  const cardsWrapper = document.createElement("div");
  cardsWrapper.classList.add("mb-cards");
  return cardsWrapper;
}

// =========================
// MODELO DO CARD (HTML IGUAL AO ORIGINAL)
// =========================
function criarCardHTML(m) {
  const nome = m.me_nome || "Nome não informado";
  const cargo = m.ca_nome_cargo || "Cargo não informado";
  const descricao = m.me_descricao || "";
  const imagem = m.me_imagem || "../src/assets/image/default.jpg";
  const lattes = m.me_lattes || "";

  return `
    <div class="mb-card-container">
      <div class="mb-card">
        <div class="mb-img">
          <img src="http://localhost:3000/uploads/${imagem}" alt="">
        </div>
        <div class="mb-bottom">
          <p class="mb-name">${nome}</p>
          <p class="mb-desc">${cargo}</p>
        </div>
      </div>

      <div class="mb-overlay">
        <div class="mb-bottom mb-upper">
          <p class="mb-name">${nome}</p>
          <p class="mb-desc">${cargo}</p>
        </div>

        <div class="mb-content">
          <div class="mb-bio">
            <p>${descricao}</p>
          </div>

          ${lattes ? `<a href="${lattes}"><button class="button" role="button">lattes</button></a>` : ""}
        </div>
      </div>
    </div>
  `;
}

// =========================
// RENDERIZAÇÃO: cria subtítulo + wrapper de cards + cards para cada cargo
// Ordem dos cargos ficará conforme a ordem das chaves do objeto 'porCargo'.
// =========================
// =========================
// ORDEM FIXA DOS CARGOS
// =========================
const ordemCargos = [
  "Coordenador",
  "Pesquisador",
  "Bolsista",
  "Doutorando",
  "Mestrando",
  "Sem cargo"
];

// =========================
// RENDERIZAÇÃO (MODIFICADA)
// =========================
function renderizarPorCargo(porCargo) {

  ordemCargos.forEach(cargoName => {
    if (!porCargo[cargoName]) return; // pula cargos que não vieram do backend

    // Ordena os membros dentro de cada cargo
    porCargo[cargoName].sort((a, b) => a.me_nome.localeCompare(b.me_nome));

    // Cria subtítulo
    const subs = criarSubtitulo(cargoName);

    // Cria wrapper
    const wrapper = criarWrapperCards();

    // Adiciona cards
    porCargo[cargoName].forEach(m => {
      wrapper.innerHTML += criarCardHTML(m);
    });

    // Insere na página
    containerPrincipal.appendChild(subs);
    containerPrincipal.appendChild(wrapper);
  });

  console.log("Renderização com ordem fixa:", ordemCargos);
}


// =========================
// CARREGA MEMBROS DO BACKEND
// =========================
async function carregarMembros() {
  try {
    if (!containerPrincipal) {
      console.error("[membros.js] #membros-container não encontrado no DOM.");
      return;
    }

    // 1) Limpa o HTML estático (subtitles + cards)
    limparEstruturaEstatica();

    // 2) Busca os membros
    console.log("[membros.js] buscando membros em", API_URL);
    const resp = await fetch(API_URL, { cache: "no-store" });

    if (!resp.ok) {
      console.error(`[membros.js] Erro HTTP: ${resp.status} ${resp.statusText}`);
      // opcional: reexibir conteúdo estático se quiser (não estamos fazendo isso aqui)
      return;
    }

    const membros = await resp.json();

    if (!Array.isArray(membros)) {
      console.error("[membros.js] Resposta inesperada (não é array):", membros);
      return;
    }

    // 3) Agrupar por cargo
    const porCargo = {};
    membros.forEach(m => {
      const cargo = (m.ca_nome_cargo || "Sem cargo").trim();
      if (!porCargo[cargo]) porCargo[cargo] = [];
      porCargo[cargo].push(m);
    });

    // 4) Renderizar
    renderizarPorCargo(porCargo);

  } catch (err) {
    console.error("[membros.js] Erro ao carregar membros:", err);
  }
}

// executa
carregarMembros();
