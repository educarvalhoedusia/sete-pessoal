(function () {
  // ============ PARTE PARA EDITAR ============
  // Endereço do Worker do Cloudflare (veja worker/LEIAME.md). Enquanto não for preenchido, o chat não aparece.
  const API = "COLE-AQUI-O-ENDERECO-DO-WORKER";
  const TITULO = "Pergunte à IA";
  const SAUDACAO = "Olá! Sou o assistente virtual (IA) do Eduardo Carvalho. Posso tirar dúvidas sobre as palestras e o trabalho dele. Para combinar o seu evento, o caminho é o WhatsApp.";
  const AVISO = "Suas mensagens são enviadas a um serviço de IA para gerar a resposta. Não informe dados sensíveis.";

  // Mesma paleta do site: cada texto contrasta bem com o fundo atrás dele
  const CORES = {
    principal: "#C58B2B",           // botão, botão Enviar e suas mensagens
    textoSobrePrincipal: "#14110A", // texto em cima da cor principal
    fundo: "#15171C",               // janela do chat e campo de digitação
    texto: "#EDE7DA",               // respostas e o que o visitante digita
    balaoResposta: "#22262E",       // fundo das respostas da IA
    textoApagado: "#C9C2B3",        // texto de exemplo no campo
    borda: "#4A4F5A",
  };
  // ============ FIM DA PARTE PARA EDITAR ============

  // Sem endereço configurado, não mostra o chat
  if (!/^https?:\/\//.test(API)) return;

  const historico = [];
  const C = CORES;

  const css = document.createElement("style");
  css.textContent = `
    #cv-btn{position:fixed;left:16px;bottom:76px;min-height:48px;padding:0 20px;border-radius:999px;
      border:2px solid ${C.principal};background:${C.fundo};color:#fff;font:600 15px system-ui,sans-serif;
      cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.35);z-index:50}
    #cv-box{position:fixed;left:12px;right:12px;bottom:12px;height:min(78vh,520px);background:${C.fundo};color:${C.texto};
      border:1px solid ${C.principal};border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,.5);
      display:none;flex-direction:column;overflow:hidden;z-index:70;
      font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
    #cv-box.aberto{display:flex}
    #cv-topo{display:flex;justify-content:space-between;align-items:center;background:${C.fundo};color:#fff;
      padding:4px 4px 4px 16px;font-weight:700;border-bottom:1px solid ${C.borda}}
    #cv-fechar{background:none;border:0;color:#fff;font-size:28px;line-height:1;cursor:pointer;min-width:44px;min-height:44px}
    #cv-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
    .cv-m{padding:10px 14px;border-radius:14px;max-width:88%;line-height:1.5;font-size:15px;white-space:pre-wrap;overflow-wrap:anywhere}
    .cv-user{background:${C.principal};color:${C.textoSobrePrincipal};align-self:flex-end}
    .cv-bot{background:${C.balaoResposta};color:${C.texto};align-self:flex-start}
    #cv-form{display:flex;border-top:1px solid ${C.borda}}
    #cv-input{flex:1;min-width:0;border:none;padding:14px;font:inherit;font-size:16px;outline:none;
      background:${C.fundo};color:${C.texto}}
    #cv-input::placeholder{color:${C.textoApagado};opacity:1}
    #cv-input:focus-visible{box-shadow:inset 0 0 0 2px #F2C46D}
    #cv-enviar{border:none;background:${C.principal};color:${C.textoSobrePrincipal};font:inherit;
      font-size:15px;font-weight:600;padding:0 18px;cursor:pointer}
    #cv-enviar:disabled{opacity:.6;cursor:wait}
    #cv-btn:focus-visible,#cv-fechar:focus-visible,#cv-enviar:focus-visible{outline:3px solid #F2C46D;outline-offset:2px}
    #cv-aviso{margin:0;padding:6px 14px 10px;font-size:12px;color:${C.textoApagado}}
    @media(min-width:700px){#cv-box{left:24px;right:auto;bottom:24px;width:400px}}
  `;
  document.head.appendChild(css);

  document.body.insertAdjacentHTML("beforeend", `
    <button id="cv-btn" type="button" aria-haspopup="dialog">${TITULO}</button>
    <div id="cv-box" role="dialog" aria-labelledby="cv-topo">
      <div id="cv-topo"><span id="cv-titulo"></span><button id="cv-fechar" type="button" aria-label="Fechar chat">×</button></div>
      <div id="cv-msgs" role="log" aria-live="polite"></div>
      <form id="cv-form">
        <input id="cv-input" placeholder="Digite sua pergunta..." aria-label="Sua pergunta" maxlength="800" autocomplete="off">
        <button id="cv-enviar" type="submit">Enviar</button>
      </form>
      <p id="cv-aviso"></p>
    </div>`);

  const box = document.getElementById("cv-box");
  const msgs = document.getElementById("cv-msgs");
  const input = document.getElementById("cv-input");
  const btnEnviar = document.getElementById("cv-enviar");
  const btnAbrir = document.getElementById("cv-btn");
  document.getElementById("cv-titulo").textContent = TITULO;
  document.getElementById("cv-aviso").textContent = AVISO;

  function adicionar(texto, classe) {
    const div = document.createElement("div");
    div.className = "cv-m " + classe;
    div.textContent = texto; // textContent impede que alguém injete HTML
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  btnAbrir.onclick = () => {
    box.classList.add("aberto");
    if (!msgs.children.length) adicionar(SAUDACAO, "cv-bot");
    input.focus();
  };

  function fechar() {
    box.classList.remove("aberto");
    btnAbrir.focus();
  }
  document.getElementById("cv-fechar").onclick = fechar;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && box.classList.contains("aberto")) fechar();
  });

  document.getElementById("cv-form").onsubmit = async (e) => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto || btnEnviar.disabled) return;

    input.value = "";
    btnEnviar.disabled = true;
    adicionar(texto, "cv-user");
    historico.push({ role: "user", content: texto });
    const aguardando = adicionar("Digitando...", "cv-bot");

    try {
      const r = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historico.slice(-20) }),
      });
      const dados = await r.json();
      if (dados.resposta) {
        aguardando.textContent = dados.resposta;
        historico.push({ role: "assistant", content: dados.resposta });
      } else {
        aguardando.textContent = dados.erro || "Não consegui responder agora.";
        historico.pop();
      }
    } catch {
      aguardando.textContent = "Erro de conexão. Tente novamente.";
      historico.pop();
    } finally {
      btnEnviar.disabled = false;
      input.focus();
    }
  };
})();
