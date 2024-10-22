const modalAdicionarProduto = document.getElementById("modalAdicionarProduto");
const btnAdicionarProduto = document.getElementById(
  "btn-abrirModalCriarProduto"
);

btnAdicionarProduto.addEventListener("click", () =>
  abrirModal(modalAdicionarProduto)
);

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const nomeEstabelecimento = urlParams?.get("estabelecimento");

  const listaEventos = await JSON.parse(localStorage.getItem("eventos") || '[]');
  const evento = listaEventos?.find(
    (item) => item?.estabelecimento === nomeEstabelecimento
  );

  if (!evento?.estabelecimento) {
    window.location.href = "../evento/Evento.html";
    alert("Evento não identificado!");
    return null;
  }

  const nomeEventoComponente = document.getElementById("nome-evento");
  nomeEventoComponente.innerText = nomeEstabelecimento || "Comanda do evento";

  const divPagantes = document.getElementsByClassName("pagantes")[0];
  preencherPagantes = () => {
    evento?.pagantes.forEach((pagante) => {
      const linha = document.createElement("span");
      linha.className = "pagante";
      linha.innerText = `Pagante: ${pagante} - R$ 0,00`;

      divPagantes.appendChild(linha);
    });
  };

  preencherPagantes();
});
