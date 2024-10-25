const salvarDadosUsuarioLocalmente = (dados) => {
  if (dados) localStorage.setItem("usuario", JSON.stringify(dados));
};

const acessarSistema = (usuario) => {
  salvarDadosUsuarioLocalmente(usuario);
  window.location.href = "../evento/Evento.html";
};

const realizarLogin = async (usuario, senha) => {
  return fetch("../../backend/usuarios.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      acao: "login",
      usuario: usuario,
      senha: senha,
    }),
  })
    .then((response) => {
      if (!response.ok)
        throw new Error("Erro na requisição: " + response.statusText);
      return response.json();
    })
    .then((dados) => {
      if (dados?.mensagem === "Login bem-sucedido" && dados.usuario) {
        acessarSistema(dados.usuario);
      } else {
        throw new Error(dados.mensagem || "Erro desconhecido durante o login");
      }
    })
    .catch((error) => alert(error));
};

document.addEventListener("DOMContentLoaded", () => {
  const btnCriarUsuario = document.getElementById("btn-criar-usuario");
  if (btnCriarUsuario) {
    btnCriarUsuario.addEventListener("click", (event) => {
      event.preventDefault();
      createAccount();
    });
  }

  const btnAcessarConta = document.getElementById("btn-acessar-conta");
  if (btnAcessarConta) {
    btnAcessarConta.addEventListener("click", (event) => {
      event.preventDefault();
      const usuario = document.getElementById("usuario").value;
      const senha = document.getElementById("senha").value;
      if (!usuario || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
      }
      realizarLogin(usuario, senha);
    });
  }
});

const createAccount = () => {
  const nome = document.getElementById("nomeCompleto").value;
  const dataNascimento = document.getElementById("dataNascimento").value;
  const email = document.getElementById("email").value;
  const usuario = document.getElementById("nomeUsuario").value;
  const senha = document.getElementById("senha").value;

  if (!nome || !dataNascimento || !email || !usuario || !senha) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  fetch("../../backend/usuarios.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      acao: "criar",
      nome: nome,
      data_nascimento: dataNascimento,
      email: email,
      usuario: usuario,
      senha: senha,
    }),
  })
    .then((response) => {
      if (!response.ok)
        throw new Error("Erro na requisição: " + response.statusText);
      return response.json();
    })
    .then((dados) => {
      alert("Conta criada com sucesso!");
      realizarLogin(usuario, senha);
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
      alert("Erro ao criar conta. Tente novamente mais tarde.");
    });
};
