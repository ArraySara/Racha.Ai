document.addEventListener('DOMContentLoaded', () => {
    const eventBody = document.getElementById('event-body');

    // Array de eventos simulados
    const events = [
        {
            establishment: '88 Bier',
            address: 'R. Nunes Valente, 1355 - Aldeota',
            date: '10/04/2024',
        },
        {
            establishment: '88 Bier',
            address: 'R. Nunes Valente, 1355 - Aldeota',
            date: '19/04/2024',
        },
        {
            establishment: 'Floresta Complexo',
            address: 'Av. Santos Dumont, 1788 - Aldeota',
            date: '30/06/2024',
        }
    ];

    // Função para renderizar a lista de eventos
    function renderEvents() {
        events.forEach(event => {
            const row = document.createElement('tr');
            
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
