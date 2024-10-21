const salvarDadosUsuarioLocalmente = (dados) =>
  localStorage.setItem("usuario", JSON.stringify(dados));

document
  .querySelector("#loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const usuarioInformado = document.getElementById("usuario").value;
    const senhaInformada = document.getElementById("senha").value;

    const usuariosSistema = [
      { nome: "Adrielly", usuario: "adrielly", senha: "123456" },
      { nome: "Lia", usuario: "lia", senha: "123456" },
      { nome: "Jamille", usuario: "jamille", senha: "123456" },
      { nome: "Sara", usuario: "sara", senha: "123456" },
    ];

    const usuarioLogado = usuariosSistema?.find(
      (item) =>
        item?.usuario === usuarioInformado && item?.senha === senhaInformada
    );

    if (usuarioLogado?.nome) {
      salvarDadosUsuarioLocalmente(usuarioLogado);
      window.location.href = "../evento/Evento.html";
    } else {
      alert("Usuário ou senha incorretos!");
    }
  });

// Função para criar uma nova conta
function createAccount() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Verifica se os campos estão preenchidos
  if (!username || !password) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Verifica se o usuário já existe
  if (localStorage.getItem(username)) {
    alert("Usuário já existe. Tente fazer login.");
  } else {
    // Armazena a nova conta no localStorage
    const user = {
      username: username,
      password: password,
    };
    localStorage.setItem(username, JSON.stringify(user));
    alert("Conta criada com sucesso! Faça login.");
  }
}

// Event listeners
document.querySelector("form").addEventListener("submit", login);
document.querySelector("a").addEventListener("click", function (event) {
  event.preventDefault();
  createAccount();
});
