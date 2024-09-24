// Seleciona os elementos necessários
const btnCriarEvento = document.getElementById("btnCriarEvento");
const btnEditarEvento = document.getElementById("btnEditar");
const btnAdicionarProduto = document.getElementById("btnAdicionarProduto");
const modalCriarEvento = document.getElementById("modalCriarEvento");
const modalEditarEvento = document.getElementById("modalEditarEvento");
const modalAdicionarProduto = document.getElementById("modalAdicionarProduto");
const closeButtons = document.querySelectorAll(".close");

// Função para abrir o modal
function abrirModal(modal) {
  modal.style.display = "flex";
}

// Função para fechar o modal
function fecharModal(modal) {
  modal.style.display = "none";
}

// Abre o modal de criar evento
btnCriarEvento.addEventListener("click", () => abrirModal(modalCriarEvento));

// Abre o modal de editar evento
btnEditarEvento.addEventListener("click", () => abrirModal(modalEditarEvento));

// Abre o modal de adicionar produto
btnAdicionarProduto.addEventListener("click", () =>
  abrirModal(modalAdicionarProduto)
);

// Fecha o modal quando clicar no botão de fechar
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    fecharModal(modal);
  });
});

// Fecha o modal quando clicar fora do conteúdo
window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    fecharModal(event.target);
  }
});
