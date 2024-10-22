// Seleciona os elementos necessários
const btnAdicionarProduto = document.getElementById("btnAdicionarProduto");
const modalAdicionarProduto = document.getElementById("modalAdicionarProduto");

// Abre o modal de adicionar produto
btnAdicionarProduto.addEventListener("click", () =>
  abrirModal(modalAdicionarProduto)
);
