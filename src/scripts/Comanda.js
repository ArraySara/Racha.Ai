document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventoId = urlParams?.get("eventoId");

  if (!eventoId) {
    window.location.href = "../evento/Evento.html";
    alert("Evento não identificado!");
    return;
  }

  try {
    const response = await fetch(
      `../../backend/eventos.php?eventoId=${eventoId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) throw new Error("Erro ao buscar informações do evento");

    const evento = await response.json();

    if (!evento?.nome) {
      window.location.href = "../evento/Evento.html";
      alert("Evento não identificado!");
      return;
    }

    const nomeEventoComponente = document.getElementById("nome-evento");
    nomeEventoComponente.innerText = evento.nome || "Comanda do evento";

    const estabelecimentoComponente = document.getElementById(
      "campo-estabelecimento"
    );
    estabelecimentoComponente.value = evento.nome;

    const dataEventoComponente = document.getElementById("campo-dataEvento");
    dataEventoComponente.value = evento.data_evento;

    const enderecoComponente = document.getElementById("campo-endereco");
    enderecoComponente.value = evento?.endereco || "N/A";

    const divPagantesTela = document.getElementById("lista-pagantes-com-preco");
    preencherPagantes = () => {
      evento?.pagantes?.forEach((pagante) => {
        const linha = document.createElement("span");
        linha.className = "pagante";
        linha.innerText = `Pagante: ${pagante.nome} - R$ 0,00`;

        divPagantesTela.appendChild(linha);
      });
    };

    preencherPagantes();

    const divPagantesEdicao = document.getElementById("lista-pagantes-edicao");
    preencherPagantesEdicao = () => {
      divPagantesEdicao.innerHTML = "";
      evento?.pagantes?.forEach((pagante, index) => {
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
        div.appendChild(document.createTextNode(pagante.nome));
        divPagantesEdicao.appendChild(div);
      });
    };

    preencherPagantesEdicao();
  } catch (error) {
    console.error("Erro ao buscar informações do evento:", error);
    alert("Erro ao buscar informações do evento. Tente novamente.");
  }
});
