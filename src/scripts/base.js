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

const abrirModalProduto = (produto = null) => {
  if (produto) {
    document.getElementById("nomeProduto").value = produto.nome;
    document.getElementById("precoProduto").value = produto.preco
      .toFixed(2)
      .replace(".", ",");
    document.getElementById("quantidadeProduto").value = produto.quantidade;
    document.querySelector("#formAdicionarProduto input[name='action']").value =
      "editar";
    document.querySelector("#formAdicionarProduto input[name='id']").value =
      produto.id;
  } else {
    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("quantidade").value = "";

    const campo = document.querySelector(
      "#formAdicionarProduto input[name='action']"
    );

    if (campo) {
      campo.value = "criar";
    }

    delete document.querySelector("#formAdicionarProduto input[name='id']");
  }
  abrirModal(modalProdutoForm);
};
adicionarEventoSeExistir("btn-abrirModalForm", () => abrirModalProduto());

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

document.addEventListener("DOMContentLoaded", async () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
  const usuarioComponente = document.getElementById("nome-usuario");
  usuarioComponente.innerText = usuarioLogado?.nome;

  const urlParams = new URLSearchParams(window.location.search);
  const eventoId = urlParams?.get("eventoId");
  const editando = eventoId !== undefined && eventoId !== null;
  if (editando) {
    const respostaGetPagantes = await fetch(
      `../../backend/pagantesEventos.php?id_evento=${eventoId}`,
      { method: "GET" }
    );

    if (!respostaGetPagantes.ok)
      throw new Error("Erro ao buscar pagantes do evento!");

    const listaUsuariosPagantes = await respostaGetPagantes.json();
    pagantes = pagantes.concat(listaUsuariosPagantes);
  }

  atualizarSelectPagantes();
});

const selectPagante = document.getElementById("select-listaPagantes");
const atualizarSelectPagantes = () => {
  if (selectPagante) {
    selectPagante.innerHTML = "";

    pagantes.forEach((pagante) => {
      const option = document.createElement("option");
      option.value = pagante.id;
      option.textContent = pagante.nome;
      selectPagante.appendChild(option);
    });
  }
};

const atualizarListaPagantes = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventoId = urlParams?.get("eventoId");
  const editando = eventoId !== undefined && eventoId !== null;
  const nomeListaPagantes = editando
    ? "lista-pagantes-edicao"
    : "listaPagantes";

  const listaPagantes = document.getElementById(nomeListaPagantes);
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
    div.appendChild(document.createTextNode(pagante?.nome || pagante));
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
