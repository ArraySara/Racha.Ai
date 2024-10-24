const salvarDadosUsuarioLocalmente = (dados) =>
  localStorage.setItem("usuario", JSON.stringify(dados));

const acessarSistema = (usuario) => {
  salvarDadosUsuarioLocalmente(usuario);
  window.location.href = "../evento/Evento.html";
};

const realizarLogin = async (email, senha) => {
  return fetch("../../backend/usuarios.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      acao: "login",
      email: email,
      senha: senha,
    }),
  }).then((response) => {
    if (!response.ok)
      throw new Error("Erro na requisição: " + response.statusText);
    return response.json();
  });
};

const botaoLogin = document.querySelector("#loginForm");

if (botaoLogin) {
  botaoLogin.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailInformado = document.getElementById("usuario").value;
    const senhaInformada = document.getElementById("senha").value;

    realizarLogin(emailInformado, senhaInformada)
      .then((dados) => acessarSistema(dados.usuario))
      .catch((error) => {
        console.error("Erro na requisição:", error);
        alert("Erro ao fazer login. Tente novamente mais tarde!");
      });
  });
}

const createAccount = () => {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (!nome || !email || !senha) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  fetch("../../backend/usuarios.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      acao: "criar",
      nome: nome,
      email: email,
      senha: senha,
    }),
  })
    .then((response) => {
      if (!response.ok)
        throw new Error("Erro na requisição: " + response.statusText);
      return response.json();
    })
    .then((dados) => realizarLogin(email, senha))
    .then((dados) => acessarSistema(dados.usuario))
    .catch((error) => {
      console.error("Erro na requisição:", error);
      alert("Erro ao criar conta ou fazer login. Tente novamente mais tarde!");
    });
};

const botaoCriarUsuario = document.querySelector("#btn-criar-usuario");
if (botaoCriarUsuario) {
  botaoCriarUsuario.addEventListener("submit", (event) => {
    event.preventDefault();
    createAccount();
  });
}
