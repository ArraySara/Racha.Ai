const listaPagantes = document.getElementById("listaPagantes");
const btnAdicionarPagante = document.getElementById("btn-adicionarPagante");
const modalCriarEvento = document.getElementById("modalCriarEvento");
const modalEditarEvento = document.getElementById("modalEditarEvento");
const butoesFecharModal = document.querySelectorAll(".close");
const botaoFab = document.getElementById("botao-fab");
const opcoesFab = document.getElementById("opcoes-fab");
let fabAberto = false;
let timer;

const pagantes = [];

const adicionarEventoSeExistir = (id, evento) => {
  const elemento = document.getElementById(id);
  if (elemento) {
    elemento.addEventListener("click", evento);
  }
};

const mudarTela = (urlTela) => {
  if (!urlTela) {
    console.error("URL inválida.");
    return;
  }

  const jaNaTela = window.location.href.includes(
    urlTela.replace(/\.\.\//g, "")
  );

  if (jaNaTela) {
    alert("Você já está nessa tela!");
    return;
  }

  window.location.href = urlTela;
};

const abrirModal = (modal) => {
  modal.style.display = "flex";
};

const fecharModal = (modal) => {
  modal.style.display = "none";
};

butoesFecharModal.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    fecharModal(modal);
  });
});

window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    fecharModal(event.target);
  }
});

adicionarEventoSeExistir("btn-listarEvento", () =>
  mudarTela("../evento/Evento.html")
);
adicionarEventoSeExistir("btn-abrirModalCriarEvento", () =>
  abrirModal(modalCriarEvento)
);
adicionarEventoSeExistir("btn-abrirModalEditarEvento", () =>
  abrirModal(modalEditarEvento)
);
adicionarEventoSeExistir("btn-criarEvento", (e) => {
  e.preventDefault();
  const estabelecimento = document.getElementById("estabelecimento").value;
  const dataEvento = document.getElementById("dataEvento").value;
  const endereco = document.getElementById("endereco").value;

  console.log({ estabelecimento, dataEvento, endereco, pagantes });

  fecharModal(modalCriarEvento);
  mudarTela("../comanda/Comanda.html");
});
adicionarEventoSeExistir("btn-creditos", () =>
  mudarTela("../creditos/Creditos.html")
);
adicionarEventoSeExistir("btn-feedback", () =>
  mudarTela("../feedbacks/Feedbacks.html")
);
adicionarEventoSeExistir("btn-voltar", () => window.history.back());
adicionarEventoSeExistir("btn-desconectar", () => {
  localStorage.removeItem("usuario");
  window.location.href = "../usuario/Login.html";
});

// Manter opções do FAB abertas
const manterOpcoesAbertas = () => {
  clearTimeout(timer);
  opcoesFab.classList.add("fab-visivel"); // Usar a classe CSS
  fabAberto = true;
  timer = setTimeout(() => {
    if (!fabAberto) {
      opcoesFab.classList.remove("fab-visivel"); // Remover a classe
    }
  }, 400);
};

// Quando o mouse está sobre o botão FAB
botaoFab.addEventListener("mouseover", manterOpcoesAbertas);

// Quando o mouse sai do botão FAB
botaoFab.addEventListener("mouseout", () => {
  if (!fabAberto) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      opcoesFab.classList.remove("fab-visivel"); // Remover a classe
    }, 400);
  }
});

// Quando o FAB é clicado
botaoFab.addEventListener("click", () => {
  fabAberto = !fabAberto;
  if (fabAberto) {
    manterOpcoesAbertas();
  } else {
    clearTimeout(timer);
    opcoesFab.classList.remove("fab-visivel"); // Remover a classe
  }
});

// Para as opções do FAB
opcoesFab.addEventListener("mouseover", manterOpcoesAbertas);
opcoesFab.addEventListener("mouseout", () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    opcoesFab.classList.remove("fab-visivel"); // Remover a classe
    fabAberto = false;
  }, 400);
});

// Se o mouse sair do FAB e não das opções, feche
document.addEventListener("mouseout", (event) => {
  if (!opcoesFab.contains(event.relatedTarget) && event.target !== botaoFab) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      opcoesFab.classList.remove("fab-visivel"); // Remover a classe
      fabAberto = false;
    }, 400);
  }
});

const adicionarPagante = () => {
  const nomePaganteInput = document.getElementById("nomePagante");
  const nome = nomePaganteInput.value.trim();

  if (nome) {
    pagantes.push(nome);
    nomePaganteInput.value = ""; // Limpar o campo de entrada
    atualizarListaPagantes();
  }
};

// Função para atualizar a lista de pagantes exibida
const atualizarListaPagantes = () => {
  listaPagantes.innerHTML = ""; // Limpar a lista atual

  pagantes.forEach((pagante, index) => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.alignItems = "center";

    // Botão para excluir o pagante
    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.style.marginRight = "10px"; // Espaço entre o botão e o nome
    btnExcluir.onclick = () => {
      pagantes.splice(index, 1); // Remover o pagante do array
      atualizarListaPagantes(); // Atualizar a lista
    };

    div.appendChild(btnExcluir);
    div.appendChild(document.createTextNode(pagante)); // Adicionar o nome do pagante
    listaPagantes.appendChild(div); // Adicionar a div à lista
  });
};

// Adicionar evento ao botão de adicionar pagante
btnAdicionarPagante.addEventListener("click", adicionarPagante);

document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
  const usuarioComponente = document.getElementById("nome-usuario");
  usuarioComponente.innerText = usuarioLogado?.nome;
});
