// Função para lidar com o login
function login(event) {
    event.preventDefault(); // Impede o envio do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verifica se os campos estão preenchidos
    if (!username || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Verifica se já existe uma conta no localStorage
    const storedUser = localStorage.getItem(username);

    if (storedUser) {
        // Se a conta existe, valida a senha
        const storedPassword = JSON.parse(storedUser).password;
        if (storedPassword === password) {
            alert('Login bem-sucedido! Bem-vindo(a) ' + username);
        } else {
            alert('Senha incorreta. Tente novamente.');
        }
    } else {
        alert('Usuário não encontrado. Crie uma conta.');
    }
}

// Função para criar uma nova conta
function createAccount() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verifica se os campos estão preenchidos
    if (!username || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Verifica se o usuário já existe
    if (localStorage.getItem(username)) {
        alert('Usuário já existe. Tente fazer login.');
    } else {
        // Armazena a nova conta no localStorage
        const user = {
            username: username,
            password: password
        };
        localStorage.setItem(username, JSON.stringify(user));
        alert('Conta criada com sucesso! Faça login.');
    }
}

// Event listeners
document.querySelector('form').addEventListener('submit', login);
document.querySelector('a').addEventListener('click', function(event) {
    event.preventDefault();
    createAccount();
});