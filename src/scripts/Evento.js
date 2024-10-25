const listarEventos = async () => {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || !usuario.id) {
      console.error("Usuário não encontrado ou ID ausente.");
      return;
    }

    const response = await fetch(
      `../../backend/eventos.php?fk_id_usuario=${usuario.id}`,
      { method: "GET" }
    );

    if (!response.ok) throw new Error("Erro ao listar eventos");

    const eventos = await response.json();
    mostrarEventos(eventos);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
  }
};

const mostrarEventos = (eventos) => {
  const eventBody = document.getElementById("event-body");
  eventBody.innerHTML = "";

  eventos.forEach((event) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${event.nome}</td>
      <td>${event.endereco || "N/A"}</td>
      <td>${new Date(event.data_evento).toLocaleDateString("pt-BR")}</td>
      <td>
        <img src="../../assets/pencil.png" alt="Editar" class="action-icons edit-icon">
        <img src="../../assets/trash.png" alt="Excluir" class="action-icons delete-icon">
      </td>
    `;

    const deleteIcon = row.querySelector(".delete-icon");
    deleteIcon.addEventListener("click", () => removerEvento(event.id));

    const editIcon = row.querySelector(".edit-icon");
    editIcon.addEventListener(
      "click",
      () =>
        (window.location.href = `../comanda/Comanda.html?eventoId=${event.id}`)
    );

    eventBody.appendChild(row);
  });
};

const criarEvento = async (dados) => {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || !usuario.id) {
      alert("Usuário não está logado.");
      return;
    }

    const response = await fetch("../../backend/eventos.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        nome: dados.estabelecimento,
        data_evento: dados.dataEvento,
        endereco: dados.endereco,
        fk_id_usuario: usuario.id,
      }),
    });

    if (!response.ok) throw new Error("Erro ao criar evento");

    const resultado = await response.json();
    alert(resultado.mensagem);

    document.getElementById("modalCriarEvento").style.display = "none";

    if (resultado.eventoId) {
      window.location.href = `../comanda/Comanda.html?eventoId=${resultado.eventoId}`;
    } else {
      listarEventos();
    }
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    alert("Erro ao criar evento. Tente novamente.");
  }
};

document.getElementById("btn-criarEvento").addEventListener("click", (e) => {
  e.preventDefault();
  const estabelecimento = document.getElementById("estabelecimento").value;
  const dataEvento = document.getElementById("dataEvento").value;
  const endereco = document.getElementById("endereco").value;

  if (!estabelecimento || !dataEvento || !endereco) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const dados = { estabelecimento, dataEvento, endereco };
  criarEvento(dados);
});

document.addEventListener("DOMContentLoaded", listarEventos);

const removerEvento = async (id) => {
  try {
    const response = await fetch("../../backend/eventos.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ id }),
    });

    if (!response.ok) throw new Error("Erro ao remover evento");

    const resultado = await response.json();
    alert(resultado.mensagem);
    listarEventos();
  } catch (error) {
    console.error("Erro ao remover evento:", error);
    alert("Erro ao remover evento. Tente novamente.");
  }
};
