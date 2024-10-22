const mudarTela = (urlTela) => {
  if (!urlTela) {
    console.error("URL inválida.");
    return;
  }

  const jaNaTela = window.location.href.includes(
    urlTela.replace(/\.\.\//g, "")
  );

  if (jaNaTela) {
    alert("Você já está nessa tela!");
    return;
  }

  window.location.href = urlTela;
};

document
  .getElementById("btn-listarEvento")
  .addEventListener("click", () => mudarTela("../evento/Evento.html"));

document
  .getElementById("btn-criarEvento")
  .addEventListener("click", () => mudarTela("../comanda/Comanda.html"));

document
  .getElementById("btn-creditos")
  .addEventListener("click", () => mudarTela("../creditos/Creditos.html"));

document
  .getElementById("btn-feedback")
  .addEventListener("click", () => mudarTela("../feedbacks/Feedbacks.html"));

document.getElementById("btn-desconectar").addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "../usuario/Login.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
  const usuarioComponente = document.getElementById("nome-usuario");
  usuarioComponente.innerText = usuarioLogado?.nome;
});
