// ===== Rodapé: coloca o ano atual automaticamente =====
document.getElementById("ano").textContent = new Date().getFullYear();

// ===== Formulário de contato =====
// Pegamos os elementos da página que vamos usar
const formulario = document.getElementById("formulario");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoMensagem = document.getElementById("mensagem");
const retorno = document.getElementById("retorno");

// Verifica se o e-mail tem o formato texto@dominio.ext
function emailValido(email) {
  const padrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return padrao.test(email);
}

// Mostra uma mensagem na tela; "tipo" pode ser "erro" ou "sucesso"
function mostrarMensagem(texto, tipo) {
  retorno.textContent = texto;
  retorno.className = tipo; // aplica a cor definida no CSS
}

// Remove a marcação vermelha de todos os campos
function limparErros() {
  [campoNome, campoEmail, campoMensagem].forEach(function (campo) {
    campo.classList.remove("invalido");
  });
}

// Roda quando o usuário clica em "Enviar"
formulario.addEventListener("submit", function (evento) {
  // Impede o comportamento padrão (recarregar a página)
  evento.preventDefault();
  limparErros();

  // trim() tira espaços do começo e do fim do texto
  const nome = campoNome.value.trim();
  const email = campoEmail.value.trim();
  const mensagem = campoMensagem.value.trim();

  // Regra 1: nenhum campo pode ficar vazio
  if (nome === "") {
    campoNome.classList.add("invalido");
    campoNome.focus();
    mostrarMensagem("Por favor, preencha o seu nome.", "erro");
    return; // para aqui e não continua
  }

  if (email === "") {
    campoEmail.classList.add("invalido");
    campoEmail.focus();
    mostrarMensagem("Por favor, preencha o seu e-mail.", "erro");
    return;
  }

  // Regra 2: o e-mail precisa ter um formato válido
  if (!emailValido(email)) {
    campoEmail.classList.add("invalido");
    campoEmail.focus();
    mostrarMensagem("Esse e-mail parece inválido. Confira e tente de novo.", "erro");
    return;
  }

  if (mensagem === "") {
    campoMensagem.classList.add("invalido");
    campoMensagem.focus();
    mostrarMensagem("Por favor, escreva uma mensagem.", "erro");
    return;
  }

  // Tudo certo: mostra a confirmação e limpa o formulário.
  // Atenção: nenhum dado é enviado para lugar nenhum.
  mostrarMensagem("Obrigado, " + nome + "! Sua mensagem foi registrada.", "sucesso");
  formulario.reset();
});
