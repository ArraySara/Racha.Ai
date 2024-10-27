const removerProdutoComprado = async (id) => {
  try {
    const response = await fetch("../../backend/produtosComprados.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ acao: "remover", id }),
    });

    if (!response.ok) throw new Error("Erro ao remover produto!");
    window.location.reload();
  } catch (error) {
    console.error("Erro ao remover produto:", error);
    alert("Erro ao remover produto. Tente novamente!");
  }
};

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

    const porcentagemGarcomComponente =
      document.getElementById("campo-taxaGarcom");
    if (porcentagemGarcomComponente) {
      porcentagemGarcomComponente.value = evento?.taxa_garcom || 0;
    }

    const divPagantesTela = document.getElementById("lista-pagantes-com-preco");
    if (divPagantesTela) {
      const preencherPagantes = () => {
        listaUsuariosPagantes?.forEach((pagante) => {
          const linha = document.createElement("span");
          linha.style.cursor = "pointer";
          linha.style.backgroundColor = "#fff";
          linha.style.padding = "10px";
          linha.style.marginBottom = "10px";
          linha.style.borderRadius = "5px";
          linha.style.fontSize = "16px";
          linha.style.transition = "background-color 0.3s";

          linha.innerText = `Pagante: ${pagante?.nome || "Não identificado"}`;

          linha.onmouseover = () => {
            linha.style.backgroundColor = "#e0e0e0";
          };
          linha.onmouseout = () => {
            linha.style.backgroundColor = "#fff";
          };

          linha.onclick = async () => {
            const detalhesAberto = divPagantesTela.querySelector(".detalhes");
            if (detalhesAberto && detalhesAberto !== linha.nextSibling) {
              detalhesAberto.remove();
            }

            const detalhes = document.createElement("div");
            detalhes.style.padding = "5px 10px";
            detalhes.style.marginBottom = "15px";
            detalhes.style.borderLeft = "2px solid #4caf50";
            detalhes.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            detalhes.style.backgroundColor = "#ffffff";
            detalhes.className = "detalhes";

            const produtosContainer = document.createElement("div");
            produtosContainer.style.overflowY = "auto";
            produtosContainer.style.maxHeight = "150px";
            produtosContainer.style.whiteSpace = "normal";
            produtosContainer.style.wordWrap = "break-word";
            produtosContainer.style.marginBottom = "10px";

            const response = await fetch(
              `../../backend/produtosComprados.php?id_pagante=${pagante.id}`
            );

            let totalGeral = 0;

            if (response.ok) {
              const produtos = await response.json();

              const listaProdutos = [...produtos];
              totalGeral = produtos?.reduce((total, produto) => {
                const quantidade = produto.quantidade || 1;
                return total + quantidade * produto.preco;
              }, 0);

              const taxaGarcomInformada = evento?.taxa_garcom;
              const temTaxaGarcom =
                taxaGarcomInformada && taxaGarcomInformada > 0;

              if (temTaxaGarcom) {
                const porcentagemTaxaGarcom = taxaGarcomInformada / 100;
                const taxaGarcom = totalGeral * porcentagemTaxaGarcom;
                listaProdutos.push({
                  nome: `Taxa do garçom (${taxaGarcomInformada}%)`,
                  preco: taxaGarcom,
                  eTaxa: true,
                });

                totalGeral += taxaGarcom;
              }

              if (produtos.length === 0) {
                produtosContainer.innerHTML = `<strong>Sem produtos comprados!</strong>`;
              } else {
                listaProdutos.forEach((produto) => {
                  const eTaxa = produto?.eTaxa === true;
                  produto.id_pagante = pagante?.id;

                  const nome = produto?.nome;
                  const quantidade = produto?.quantidade || 1;
                  const preco = produto?.preco;
                  const precoEmReal = preco?.toFixed(2)?.replace(".", ",");
                  const total = (quantidade * preco)
                    .toFixed(2)
                    .replace(".", ",");

                  const divProduto = document.createElement("div");
                  divProduto.style.border = "1px dashed #ccc";
                  divProduto.style.margin = "5px 0";
                  divProduto.style.padding = "10px";
                  divProduto.style.display = "flex";
                  divProduto.style.justifyContent = "space-between";
                  divProduto.style.alignItems = "center";

                  const infoProduto = document.createElement("div");
                  const valorComQuantidades = eTaxa
                    ? ""
                    : `<br />x${quantidade} = R$ ${total}`;

                  infoProduto.innerHTML = `
                    <strong>${nome}</strong> - R$ ${precoEmReal}
                    ${valorComQuantidades}
                    `;

                  divProduto.appendChild(infoProduto);
                  if (!eTaxa) {
                    const containerBotoes = document.createElement("div");

                    const btnEditar = document.createElement("img");
                    btnEditar.src = "../../assets/pencil.png";
                    btnEditar.alt = "Editar";
                    btnEditar.style.cursor = "pointer";
                    btnEditar.style.width = "22px";
                    btnEditar.style.height = "22px";
                    btnEditar.style.marginRight = "5px";
                    btnEditar.id = "btn-editarProduto";
                    btnEditar.onclick = () => abrirModalProduto(produto);

                    const btnExcluir = document.createElement("img");
                    btnExcluir.src = "../../assets/trash.png";
                    btnExcluir.alt = "Excluir";
                    btnExcluir.style.cursor = "pointer";
                    btnExcluir.style.width = "24px";
                    btnExcluir.style.height = "24px";
                    btnExcluir.id = "btn-excluirProduto";
                    btnExcluir.onclick = () =>
                      removerProdutoComprado(produto?.id);

                    containerBotoes.appendChild(btnEditar);
                    containerBotoes.appendChild(btnExcluir);
                    divProduto.appendChild(containerBotoes);
                  }

                  produtosContainer.appendChild(divProduto);
                });
              }
            } else {
              produtosContainer.innerHTML = `<strong>Erro ao carregar produtos.</strong>`;
            }

            detalhes.appendChild(produtosContainer);

            const totalContainer = document.createElement("div");
            totalContainer.innerHTML = `<strong>Total: R$ ${totalGeral
              ?.toFixed(2)
              ?.replace(".", ",")}</strong>`;
            detalhes.appendChild(totalContainer);

            const jaTemPaganteComDetalhe =
              linha.nextSibling && linha.nextSibling.className === "detalhes";

            if (jaTemPaganteComDetalhe) {
              linha.nextSibling.remove();
            } else {
              linha.parentNode.insertBefore(detalhes, linha.nextSibling);
            }
          };

          divPagantesTela.appendChild(linha);
        });
      };

      preencherPagantes();
    }

    const divPagantesEdicao = document.getElementById("lista-pagantes-edicao");
    if (divPagantesEdicao) {
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
    }

    document
      .getElementById("btnSalvarEdicaoEvento")
      .addEventListener("click", async (e) => {
        e.preventDefault();

        const estabelecimento = estabelecimentoComponente.value;
        const dataEvento = dataEventoComponente.value;
        const endereco = enderecoComponente.value;
        const taxaGarcom = porcentagemGarcomComponente.value;

        if (taxaGarcom < 0) {
          alert('Taxa do garçom não pode ser negativa!')
          return null
        }

        let eventoAlterado =
          estabelecimento !== eventoOriginal.nome ||
          dataEvento !== eventoOriginal.data_evento ||
          endereco !== eventoOriginal.endereco ||
          taxaGarcom !== eventoOriginal?.taxa_garcom;

        let pagantesAdicionados =
          pagantes?.filter(
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
            const parametrosEdicao = {
              eventoId,
              estabelecimento,
              dataEvento,
              endereco,
              taxaGarcom,
              operacao: "atualizar",
            };

            const respostaUpdateEvento = await fetch(
              `../../backend/eventos.php`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parametrosEdicao),
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
            alert("Erro ao atualizar evento!");
          }
        }

        if (pagantesAdicionados?.length > 0) {
          await fetch("../../backend/pagantesEventos.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              acao: "adicionar",
              id_evento: eventoId,
              pagantes: JSON.stringify(
                pagantesAdicionados?.map((nome) => ({ nome }))
              ),
            }),
          });
        }

        for (const pagante of pagantesRemovidos) {
          try {
            await fetch("../../backend/pagantesEventos.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                acao: "remover",
                id_pagante: pagante?.id,
              }),
            });

            removerProdutosPorPagante(pagante?.id);
          } catch (error) {
            console.error("Erro ao remover pagante:", error);
          }
        }

        window.location.reload();
      });
  } catch (error) {
    console.error("Erro ao buscar informações do evento:", error);
    alert("Erro ao buscar informações do evento. Tente novamente.");
  }
});

const formAdicionarProduto = document.getElementById("formAdicionarProduto");
formAdicionarProduto.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(formAdicionarProduto);
  const idProduto = formData.get("idProduto");
  const nome = formData.get("nome");
  const preco = parseFloat(formData.get("preco"));
  const quantidade = parseInt(formData.get("quantidade"));
  const id_pagante = Number(formData.get("id_pagante"));

  const acao = idProduto ? "editar" : "criar";
  let dados = { acao, nome, preco, quantidade, id_pagante };
  if (idProduto) dados.id = idProduto;

  const resposta = await fetch("../../backend/produtosComprados.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(dados),
  });

  if (resposta.ok) {
    const resultado = await resposta.json();
    alert(resultado.mensagem);
    window.location.reload();
  } else {
    const erro = await resposta.json();
    alert(erro.mensagem);
  }
});

const removerProdutosPorPagante = async (id_pagante) =>
  await fetch("../../backend/produtosComprados.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ acao: "remover-por-pagante", id_pagante }),
  });
