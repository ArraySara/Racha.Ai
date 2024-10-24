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

  const listaEventos = await JSON.parse(
    localStorage.getItem("eventos") || "[]"
  );
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

  const estabelecimentoComponente = document.getElementById(
    "campo-estabelecimento"
  );
  estabelecimentoComponente.value = nomeEstabelecimento;

  const dataeventoComponente = document.getElementById("campo-dataEvento");
  dataeventoComponente.value = evento.dataEvento;

  const enderecoComponente = document.getElementById("campo-endereco");
  enderecoComponente.value = evento?.endereco;

  const divPagantesTela = document.getElementById("lista-pagantes-com-preco");
  preencherPagantes = () => {
    evento?.pagantes.forEach((pagante) => {
      const linha = document.createElement("span");
      linha.className = "pagante";
      linha.innerText = `Pagante: ${pagante} - R$ 0,00`;

      divPagantesTela.appendChild(linha);
    });
  };

  preencherPagantes();

  const divPagantesEdicao = document.getElementById("lista-pagantes-edicao");
  preencherPagantesEdicao = () => {
    divPagantesEdicao.innerHTML = "";
    evento?.pagantes.forEach((pagante, index) => {
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.marginBottom = "10px";
      div.style.borderBottomWidth = "2px";
      div.style.borderBottomStyle = "dashed";
      div.style.borderBottomColor = "#000000";

      const btnExcluir = document.createElement("span");
      btnExcluir.textContent = "🗑️";
      btnExcluir.style.cursor = "pointer";
      btnExcluir.style.marginRight = "10px";
      btnExcluir.style.marginBottom = "3px";
      btnExcluir.onclick = () => {
        evento?.pagantes.splice(index, 1);
        preencherPagantesEdicao();
      };

      div.appendChild(btnExcluir);
      div.appendChild(document.createTextNode(pagante));
      divPagantesEdicao.appendChild(div);
    });
  };

  preencherPagantesEdicao();
});
