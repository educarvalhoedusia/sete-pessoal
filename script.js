// Assistente de qualificação: fluxo guiado, sem IA, sem backend e sem guardar dados.
// No fim, monta uma mensagem e abre o WhatsApp com o texto pré-preenchido (o visitante revisa e envia).
(function () {
  'use strict';

  var NUMERO = '5519991808312';
  var TEMAS = ['Comportamento humano e DISC', 'Vendas e varejo', 'Liderança', 'Inteligência artificial aplicada', 'Ainda não sei'];

  // Passos do fluxo: tipo "opcoes" mostra botões; tipo "texto" mostra um campo livre.
  var PASSOS = [
    { chave: 'evento', pergunta: 'Que tipo de evento você está organizando?', tipo: 'opcoes', opcoes: ['Empresa', 'Associação/entidade', 'Congresso', 'Outro'] },
    { chave: 'tema', pergunta: 'Qual o tema de interesse?', tipo: 'opcoes', opcoes: TEMAS },
    { chave: 'local', pergunta: 'Cidade e data prevista?', tipo: 'texto', dica: 'Ex.: Campinas, outubro de 2026' },
    { chave: 'publico', pergunta: 'Quantas pessoas, aproximadamente?', tipo: 'texto', dica: 'Ex.: 150' },
    { chave: 'nome', pergunta: 'Para finalizar: seu nome e a empresa/entidade?', tipo: 'texto', dica: 'Ex.: Maria Souza, Associação X' }
  ];

  var painel = document.getElementById('assistente');
  var corpo = document.getElementById('assist-corpo');
  var entrada = document.getElementById('assist-entrada');
  var respostas = {};
  var passo = 0;
  var ultimoGatilho = null;

  function el(tag, classe, texto) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto) e.textContent = texto;
    return e;
  }

  function mensagem(texto, quem) {
    corpo.appendChild(el('div', 'msg msg--' + quem, texto));
    corpo.scrollTop = corpo.scrollHeight;
  }

  // Monta o texto final que será pré-preenchido no WhatsApp
  function montarTexto() {
    return [
      'Olá, Eduardo! Vim pelo seu site e gostaria de falar sobre uma palestra.',
      '',
      '• Tipo de evento: ' + respostas.evento,
      '• Tema de interesse: ' + respostas.tema,
      '• Cidade e data prevista: ' + respostas.local,
      '• Público aproximado: ' + respostas.publico,
      '• Nome e empresa/entidade: ' + respostas.nome,
      '',
      'Aguardo seu retorno.'
    ].join('\n');
  }

  function responder(valor) {
    var p = PASSOS[passo];
    respostas[p.chave] = valor;
    mensagem(valor, 'user');
    passo++;
    proximo();
  }

  function finalizar() {
    var texto = montarTexto();
    mensagem('Pronto! Revise a mensagem abaixo. Ao tocar no botão, o WhatsApp abre com ela preenchida e você decide se envia.', 'bot');
    mensagem(texto, 'bot');
    entrada.innerHTML = '';
    var link = el('a', 'botao botao--zap', 'Abrir no WhatsApp');
    link.href = 'https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(texto);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    var reiniciar = el('button', 'opcao', 'Recomeçar');
    reiniciar.type = 'button';
    reiniciar.addEventListener('click', function () { iniciar(); });
    entrada.appendChild(link);
    entrada.appendChild(reiniciar);
    link.focus();
  }

  function proximo() {
    // Pula perguntas já respondidas (ex.: tema vindo do botão "Quero essa palestra")
    while (passo < PASSOS.length && respostas[PASSOS[passo].chave]) passo++;
    if (passo >= PASSOS.length) return finalizar();

    var p = PASSOS[passo];
    mensagem(p.pergunta, 'bot');
    entrada.innerHTML = '';

    if (p.tipo === 'opcoes') {
      p.opcoes.forEach(function (o) {
        var b = el('button', 'opcao', o);
        b.type = 'button';
        b.addEventListener('click', function () { responder(o); });
        entrada.appendChild(b);
      });
      entrada.firstChild.focus();
    } else {
      var f = el('form');
      var campo = el('input');
      campo.type = 'text';
      campo.maxLength = 120;
      campo.placeholder = p.dica;
      campo.setAttribute('aria-label', p.pergunta);
      campo.autocomplete = 'off';
      var ok = el('button', 'botao botao--ouro', 'Enviar');
      ok.type = 'submit';
      f.appendChild(campo);
      f.appendChild(ok);
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var v = campo.value.trim();
        if (v) responder(v); else campo.focus();
      });
      entrada.appendChild(f);
      campo.focus();
    }
  }

  function iniciar(temaInicial) {
    respostas = {};
    passo = 0;
    corpo.innerHTML = '';
    if (temaInicial) respostas.tema = temaInicial;
    mensagem('Olá! Vou fazer algumas perguntas rápidas para montar sua mensagem para o Eduardo.', 'bot');
    if (temaInicial) mensagem('Tema escolhido: ' + temaInicial, 'bot');
    proximo();
  }

  function abrir(gatilho, tema) {
    ultimoGatilho = gatilho;
    painel.hidden = false;
    iniciar(tema);
  }

  function fechar() {
    painel.hidden = true;
    if (ultimoGatilho) ultimoGatilho.focus();
  }

  document.querySelectorAll('[data-abrir-assistente]').forEach(function (b) {
    b.addEventListener('click', function () { abrir(b, b.getAttribute('data-tema')); });
  });
  painel.querySelector('.assistente__fechar').addEventListener('click', fechar);
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && !painel.hidden) fechar();
  });
})();
