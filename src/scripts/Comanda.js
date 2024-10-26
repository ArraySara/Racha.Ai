document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventoId = urlParams?.get("eventoId");

  if (!eventoId) {
    window.location.href = "../evento/Evento.html";
    alert("Evento não identificado!");
    return null;
  }

  let eventoOriginal = {};
  let pagantesOriginais = [];

  try {
    const respostaGetEvento = await fetch(
      `../../backend/eventos.php?eventoId=${eventoId}`,
      { method: "GET" }
    );

    if (!respostaGetEvento.ok)
      throw new Error("Erro ao buscar informações do evento!");

    const evento = await respostaGetEvento.json();
    eventoOriginal = { ...evento };
    const nomeEvento = evento?.nome;

    const respostaGetPagantes = await fetch(
      `../../backend/pagantesEventos.php?id_evento=${eventoId}`,
      { method: "GET" }
    );

    if (!respostaGetPagantes.ok)
      throw new Error("Erro ao buscar pagantes do evento!");

    const listaUsuariosPagantes = await respostaGetPagantes.json();
    pagantesOriginais = [...listaUsuariosPagantes];

    if (!nomeEvento) {
      window.location.href = "../evento/Evento.html";
      alert("Evento não identificado!");
      return null;
    }

    const nomeEventoComponente = document.getElementById("nome-evento");
    if (nomeEventoComponente) {
      nomeEventoComponente.innerText = nomeEvento || "Comanda do evento";
    }

    const estabelecimentoComponente = document.getElementById(
      "campo-estabelecimento"
    );
    if (estabelecimentoComponente) {
      estabelecimentoComponente.value = nomeEvento;
    }

    const dataEventoComponente = document.getElementById("campo-dataEvento");
    if (dataEventoComponente) {
      dataEventoComponente.value = evento.data_evento;
    }

    const enderecoComponente = document.getElementById("campo-endereco");
    if (enderecoComponente) {
      enderecoComponente.value = evento?.endereco || "N/A";
    }

    const divPagantesTela = document.getElementById("lista-pagantes-com-preco");
    if (divPagantesTela) {
      const preencherPagantes = () => {
        listaUsuariosPagantes?.forEach((pagante) => {
          const linha = document.createElement("span");
          linha.className = "pagante";
          linha.innerText = `Pagante: ${
            pagante?.nome || "Não identificado"
          } - R$ 0,00`;

          divPagantesTela.appendChild(linha);
        });
      };

      preencherPagantes();
    }

    const divPagantesEdicao = document.getElementById("lista-pagantes-edicao");
    const preencherPagantesEdicao = () => {
      divPagantesEdicao.innerHTML = "";
      listaUsuariosPagantes?.forEach((pagante, index) => {
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
          listaUsuariosPagantes.splice(index, 1);
          preencherPagantesEdicao();
        };

        div.appendChild(btnExcluir);
        div.appendChild(document.createTextNode(pagante.nome));
        divPagantesEdicao.appendChild(div);
      });
    };

    preencherPagantesEdicao();

    document
      .getElementById("btnSalvarEdicaoEvento")
      .addEventListener("click", async (e) => {
        e.preventDefault();

        const estabelecimento = estabelecimentoComponente.value;
        const dataEvento = dataEventoComponente.value;
        const endereco = enderecoComponente.value;

        let eventoAlterado =
          estabelecimento !== eventoOriginal.nome ||
          dataEvento !== eventoOriginal.data_evento ||
          endereco !== eventoOriginal.endereco;

        let pagantesAdicionados =
          listaUsuariosPagantes?.filter(
            (pagante) =>
              !pagantesOriginais.some((original) => original.id === pagante.id)
          ) || [];

        let pagantesRemovidos =
          pagantesOriginais?.filter(
            (original) =>
              !listaUsuariosPagantes.some(
                (pagante) => pagante.id === original.id
              )
          ) || [];

        const nadaPraAlterar =
          !eventoAlterado &&
          pagantesAdicionados?.length === 0 &&
          pagantesRemovidos?.length === 0;

        if (nadaPraAlterar) {
          alert("Nenhuma alteração foi detectada.");
          return;
        }

        modalEditarEvento.style.display = "none";

        if (eventoAlterado) {
          try {
            const respostaUpdateEvento = await fetch(
              `../../backend/eventos.php`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  eventoId,
                  estabelecimento,
                  dataEvento,
                  endereco,
                  operacao: "atualizar",
                }),
              }
            );

            if (!respostaUpdateEvento.ok)
              throw new Error("Erro ao atualizar evento!");

            eventoOriginal.nome = estabelecimento;
            eventoOriginal.data_evento = dataEvento;
            eventoOriginal.endereco = endereco;
            nomeEventoComponente.innerText = estabelecimento;

            alert("Evento atualizado com sucesso!");
          } catch (error) {
            console.error("Erro ao atualizar o evento:", error);
            alert("Erro ao atualizar evento. Tente novamente.");
          }
        }

        for (const pagante of pagantesAdicionados) {
          try {
            await fetch(`../../backend/pagantesEventos.php`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nome: pagante.nome,
                id_evento: eventoId,
                operacao: "adicionar",
              }),
            });
          } catch (error) {
            console.error("Erro ao adicionar pagante:", error);
          }
        }

        for (const pagante of pagantesRemovidos) {
          try {
            await fetch(`../../backend/pagantesEventos.php`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: pagante.id,
                operacao: "remover",
              }),
            });
          } catch (error) {
            console.error("Erro ao remover pagante:", error);
          }
        }
      });
  } catch (error) {
    console.error("Erro ao buscar informações do evento:", error);
    alert("Erro ao buscar informações do evento. Tente novamente.");
  }
});
