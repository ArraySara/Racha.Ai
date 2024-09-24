document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Pegando os valores dos campos
    const nomeCompleto = document.getElementById('nomeCompleto').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const nomeUsuario = document.getElementById('nomeUsuario').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirmaSenha').value;

    // Verificando se as senhas coincidem
    if (senha !== confirmaSenha) {
        alert('As senhas não coincidem. Por favor, verifique.');
        return;
    }

    // Salvar no localStorage (opcional, apenas para teste)
    localStorage.setItem('nomeCompleto', nomeCompleto);
    localStorage.setItem('dataNascimento', dataNascimento);
    localStorage.setItem('nomeUsuario', nomeUsuario);
    localStorage.setItem('email', email);
    localStorage.setItem('senha', senha);  // Nota: não salve senhas em localStorage no mundo real.

    // Exibir mensagem de sucesso
    alert('Cadastro realizado com sucesso!');

    // Redirecionar para outra página (ex: página de login)
    window.location.href = 'login.html';
});
