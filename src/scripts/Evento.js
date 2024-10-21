document.addEventListener("DOMContentLoaded", () => {
  const corpoEventos = document.getElementById("event-body");

  function renderizarEventos(eventos) {
    eventos.forEach((evento) => {
      const linha = document.createElement("tr");

      linha.innerHTML = `
                  <td>${evento.nome}</td>
                  <td>${evento.endereco}</td>
                  <td>${evento.data_evento}</td>
                  <td>
                      <img src="../../assets/pencil.png" alt="Editar" class="action-icons edit-icon">
                      <img src="../../assets/trash.png" alt="Excluir" class="action-icons delete-icon">
                  </td>
              `;

      corpoEventos.appendChild(linha);
    });
  }

  function buscarEventos() {
    fetch("../../backend/eventos.php")
      .then((response) => response.json())
      .then((data) => {
        renderizarEventos(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar eventos:", error);
      });
  }

  buscarEventos();
});
