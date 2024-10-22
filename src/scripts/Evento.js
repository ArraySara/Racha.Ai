document.addEventListener("DOMContentLoaded", () => {
  const eventBody = document.getElementById("event-body");

  const eventosLocal = JSON.parse(localStorage.getItem("eventos")) || [];

  // Função para renderizar a lista de eventos
  function renderEvents() {
    eventosLocal.forEach((event) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${event.establishment}</td>
                <td>${event.address}</td>
                <td>${event.date}</td>
                <td>
                    <img src="../../assets/pencil.png" alt="Editar" class="action-icons edit-icon">
                    <img src="../../assets/trash.png" alt="Excluir" class="action-icons delete-icon">
                </td>
            `;

      eventBody.appendChild(row);
    });
  }

  renderEvents();
});
