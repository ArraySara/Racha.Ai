document
  .getElementById("btn-criarEvento")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const estabelecimento = document.getElementById("estabelecimento").value;
    const dataEvento = document.getElementById("dataEvento").value;
    const endereco = document.getElementById("endereco").value;

    const tudoPreenchido =
      estabelecimento !== "" &&
      dataEvento !== "" &&
      dataEvento?.length > 9 &&
      endereco !== "";

    if (!tudoPreenchido) {
      alert("É necessário informar todos os campos!");
      return null;
    }

    if (pagantes?.length <= 0) {
      alert("Você precisa adicionar pelo menos uma pessoa para o evento!");
      return null;
    }

    const dados = { estabelecimento, dataEvento, endereco, pagantes };
    const eventosCadastrados = await JSON.parse(
      localStorage.getItem("eventos") || "[]"
    );

    eventosCadastrados.push(dados);

    localStorage.setItem("eventos", JSON.stringify(eventosCadastrados));

    fecharModal(modalCriarEvento);
    mudarTela(`../comanda/Comanda.html?estabelecimento=${estabelecimento}`);
  });

const adicionarPagante = () => {
  const nomePaganteInput = document.getElementById("nomePagante");
  const nome = nomePaganteInput.value.trim();

  if (nome) {
    pagantes.push(nome);
    nomePaganteInput.value = "";
    atualizarListaPagantes();
  }
};

const atualizarListaPagantes = () => {
  listaPagantes.innerHTML = "";
  pagantes.forEach((pagante, index) => {
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
      pagantes.splice(index, 1);
      atualizarListaPagantes();
    };

    div.appendChild(btnExcluir);
    div.appendChild(document.createTextNode(pagante));
    listaPagantes.appendChild(div);
  });
};

document
  .getElementById("btn-adicionarPagante")
  .addEventListener("click", adicionarPagante);

document.addEventListener("DOMContentLoaded", () => {
  const eventBody = document.getElementById("event-body");
  const eventosLocal = JSON.parse(localStorage.getItem("eventos")) || [];

  const removerEvento = (nomeEstabelecimento) => {
    const listaEventos = JSON.parse(localStorage.getItem("eventos")) || [];
    const novaListaEventos = listaEventos.filter(
      (item) => item.estabelecimento !== nomeEstabelecimento
    );

    localStorage.setItem("eventos", JSON.stringify(novaListaEventos));

    window.location.reload();
  };

  const mostrarEventos = () => {
    eventosLocal.forEach((event) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td>${event.estabelecimento}</td>
          <td>${event.endereco}</td>
          <td>${new Date(event.dataEvento).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}</td>
          <td>
            <img src="../../assets/pencil.png" alt="Editar" class="action-icons edit-icon">
            <img src="../../assets/trash.png" alt="Excluir" class="action-icons delete-icon">
          </td>
        `;

      const deleteIcon = row.querySelector(".delete-icon");
      deleteIcon.addEventListener("click", () =>
        removerEvento(event.estabelecimento)
      );

      eventBody.appendChild(row);
    });
  };

  mostrarEventos();
});
