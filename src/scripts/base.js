const listaPagantes = document.getElementById("listaPagantes");
const modalCriarEvento = document.getElementById("modalCriarEvento");
const modalEditarEvento = document.getElementById("modalEditarEvento");
const modalProdutoForm = document.getElementById("modalProdutoForm");
const butoesFecharModal = document.querySelectorAll(".close");
const botaoFab = document.getElementById("botao-fab");
const opcoesFab = document.getElementById("opcoes-fab");
let fabAberto = false;
let timer;

let pagantes = [];

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
adicionarEventoSeExistir("btn-abrirModalForm", () =>
  abrirModal(modalProdutoForm)
);
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

const manterOpcoesAbertas = () => {
  clearTimeout(timer);
  opcoesFab.classList.add("fab-visivel");
  fabAberto = true;
  timer = setTimeout(() => {
    if (!fabAberto) {
      opcoesFab.classList.remove("fab-visivel");
    }
  }, 400);
};

if (botaoFab) {
  botaoFab.addEventListener("mouseover", manterOpcoesAbertas);
  botaoFab.addEventListener("mouseout", () => {
    if (!fabAberto) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        opcoesFab.classList.remove("fab-visivel");
      }, 400);
    }
  });

  botaoFab.addEventListener("click", () => {
    fabAberto = !fabAberto;
    if (fabAberto) {
      manterOpcoesAbertas();
    } else {
      clearTimeout(timer);
      opcoesFab.classList.remove("fab-visivel");
    }
  });
}

if (opcoesFab) {
  opcoesFab.addEventListener("mouseover", manterOpcoesAbertas);
  opcoesFab.addEventListener("mouseout", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      opcoesFab.classList.remove("fab-visivel");
      fabAberto = false;
    }, 400);
  });
}

document.addEventListener("mouseout", (event) => {
  if (!opcoesFab.contains(event.relatedTarget) && event.target !== botaoFab) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      opcoesFab.classList.remove("fab-visivel");
      fabAberto = false;
    }, 400);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
  const usuarioComponente = document.getElementById("nome-usuario");
  usuarioComponente.innerText = usuarioLogado?.nome;
});

const atualizarListaPagantes = () => {
  const listaPagantes = document.getElementById("listaPagantes");
  listaPagantes.innerHTML = "";

  pagantes.forEach((pagante, index) => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.marginBottom = "10px";
    div.style.borderBottomWidth = "2px";
    div.style.borderBottomStyle = "dashed";
    div.style.borderBottomColor = "#000000";

    const btnRemover = document.createElement("span");
    btnRemover.textContent = "🗑️";
    btnRemover.style.cursor = "pointer";
    btnRemover.style.marginRight = "10px";
    btnRemover.style.marginBottom = "3px";
    btnRemover.onclick = () => {
      pagantes.splice(index, 1);
      atualizarListaPagantes();
    };

    div.appendChild(btnRemover);
    div.appendChild(document.createTextNode(pagante));
    listaPagantes.appendChild(div);
  });
};

const btnAdicionarPagante = document.getElementById("btn-adicionarPagante");
if (btnAdicionarPagante) {
  btnAdicionarPagante.addEventListener("click", () => {
    const nomePagante = document.getElementById("nomePagante").value;
    if (!nomePagante) {
      alert("Por favor, insira o nome do pagante!");
      return;
    }

    pagantes.push(nomePagante);
    atualizarListaPagantes();
    document.getElementById("nomePagante").value = "";
  });
}
