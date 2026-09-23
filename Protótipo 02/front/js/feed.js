// ==============================
// ELEMENTOS E ESTADO
// ==============================
const btnPublicar = document.getElementById("publicar");
const texto = document.getElementById("texto");
const listaPublicacoes = document.getElementById("listaPublicacoes");

// Regex universal para hashtags com suporte a caracteres acentuados
const hashtagRegex = /#[a-zA-Z0-9_áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+/g;

// Carrega as publicações salvas
let publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];

document.addEventListener("DOMContentLoaded", function() {
    if (btnPublicar && texto && listaPublicacoes) {
        btnPublicar.addEventListener("click", criarPublicacao);
        renderizarFeed();
        atualizarNuvem();
    }
});

// ==============================
// UTILITÁRIO DE SANITIZAÇÃO (XSS)
// ==============================
function escaparHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==============================
// CRIAR PUBLICAÇÃO
// ==============================
function criarPublicacao() {
    const conteudo = texto.value.trim();

    if (!conteudo) {
        alert("Digite algo para publicar.");
        return;
    }

    publicacoes.unshift({
        id: Date.now(),
        texto: conteudo,
        data: new Date().toLocaleString("pt-BR"),
        curtidas: 0,
        curtido: false,
        denunciado: false,
        comentarios: []
    });

    salvar();
    texto.value = "";
    renderizarFeed();
    atualizarNuvem();
}

// ==============================
// SALVAR NO LOCALSTORAGE
// ==============================
function salvar() {
    localStorage.setItem("publicacoes", JSON.stringify(publicacoes));
}

// ==============================
// RENDERIZAR FEED
// ==============================
function renderizarFeed() {
    if (!listaPublicacoes) return;
    listaPublicacoes.innerHTML = "";

    publicacoes.forEach(function(pub) {
        // Se a publicação foi denunciada, exibe um aviso em vez do conteúdo completo
        if (pub.denunciado) {
            const divDenunciada = document.createElement("div");
            divDenunciada.className = "post post-denunciado";
            divDenunciada.innerHTML = `
                <p style="color: #777; font-size: 13px; font-style: italic;">
                    ⚠️ Esta publicação foi denunciada e está sob análise da moderação.
                </p>
            `;
            listaPublicacoes.appendChild(divDenunciada);
            return;
        }

        const div = document.createElement("div");
        div.className = "post";
        div.setAttribute("data-id", pub.id);

        const textoSeguro = escaparHtml(pub.texto);
        const textoFormatado = textoSeguro.replace(
            hashtagRegex,
            '<span class="hashtag">$&</span>'
        );

        pub.comentarios = pub.comentarios || [];

        div.innerHTML = `
            <div class="cabecalho-post">
                <div class="info-post">
                    <div class="data">${pub.data}</div>
                </div>
                <div class="menu-post">
                    <button class="btn-menu" aria-label="Menu">⋯</button>
                    <div class="dropdown-menu" id="menu-${pub.id}" style="display:none;">
                        <button class="btn-denunciar-post">🚩 Denunciar Post</button>
                        <button class="btn-deletar">Excluir Post</button>
                    </div>
                </div>
            </div>

            <div class="conteudo">${textoFormatado}</div>

            <div class="acoes">
                <button class="btn-curtir" data-curtido="${pub.curtido}">
                    <span class="icon-curtida">${pub.curtido ? "❤️" : "🤍"}</span>
                    <span class="texto-curtida">
                        ${pub.curtidas} ${pub.curtidas === 1 ? "curtida" : "curtidas"}
                    </span>
                </button>
                <button class="btn-comentar-toggle">
                    💬 <span class="qtd-comentarios">${pub.comentarios.length}</span>
                </button>
            </div>

            <!-- SEÇÃO DE COMENTÁRIOS -->
            <div class="secao-comentarios" style="display: none;">
                <div class="novo-comentario-box">
                    <input type="text" class="input-comentario" placeholder="Escreva um comentário...">
                    <button class="btn-enviar-comentario">Comentar</button>
                </div>
                <div class="lista-comentarios">
                    ${renderizarListaComentarios(pub.comentarios, pub.id)}
                </div>
            </div>
        `;

        // Eventos do Post
        div.querySelector(".btn-menu").addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMenu(pub.id);
        });

        div.querySelector(".btn-denunciar-post").addEventListener("click", () => denunciarPost(pub.id));
        div.querySelector(".btn-deletar").addEventListener("click", () => deletarPost(pub.id));
        div.querySelector(".btn-curtir").addEventListener("click", () => curtirPost(pub.id));

        // Toggle da caixa de comentários
        const secaoComentarios = div.querySelector(".secao-comentarios");
        div.querySelector(".btn-comentar-toggle").addEventListener("click", () => {
            const visivel = secaoComentarios.style.display === "block";
            secaoComentarios.style.display = visivel ? "none" : "block";
        });

        // Evento de adicionar comentário
        div.querySelector(".btn-enviar-comentario").addEventListener("click", () => {
            const input = div.querySelector(".input-comentario");
            adicionarComentario(pub.id, input.value.trim());
        });

        listaPublicacoes.appendChild(div);
    });

    vincularEventosComentarios();
}

// ==============================
// RENDERIZAR COMENTÁRIOS E RESPOSTAS
// ==============================
function renderizarListaComentarios(comentarios, postId) {
    if (!comentarios || comentarios.length === 0) {
        return '<p class="sem-comentarios">Nenhum comentário ainda.</p>';
    }

    return comentarios.map(c => {
        if (c.denunciado) {
            return `
                <div class="item-comentario" style="opacity: 0.6;">
                    <p style="font-size: 12px; color: #888; margin: 0;">⚠️ Comentário denunciado sob análise.</p>
                </div>
            `;
        }

        return `
            <div class="item-comentario" data-comentario-id="${c.id}">
                <div class="header-comentario">
                    <span class="data-comentario">${c.data}</span>
                    <div class="acoes-comentario">
                        <button class="btn-denunciar-comentario" data-post-id="${postId}" data-comentario-id="${c.id}" title="Denunciar comentário">🚩</button>
                        <button class="btn-deletar-comentario" data-post-id="${postId}" data-comentario-id="${c.id}" title="Excluir comentário">✕</button>
                    </div>
                </div>
                <div class="texto-comentario">${escaparHtml(c.texto)}</div>
                
                <button class="btn-responder" data-comentario-id="${c.id}">Responder</button>
                
                <div class="box-resposta" id="box-resposta-${c.id}" style="display: none;">
                    <input type="text" class="input-resposta" placeholder="Escreva uma resposta...">
                    <button class="btn-enviar-resposta" data-post-id="${postId}" data-comentario-id="${c.id}">Enviar</button>
                </div>

                <div class="lista-respostas">
                    ${(c.respostas || []).map(r => {
                        if (r.denunciado) {
                            return `<div class="item-resposta" style="opacity: 0.6; font-size: 11px; color: #888;">⚠️ Resposta denunciada.</div>`;
                        }
                        return `
                            <div class="item-resposta">
                                <div class="header-comentario">
                                    <span class="data-comentario">${r.data}</span>
                                    <button class="btn-denunciar-resposta" data-post-id="${postId}" data-comentario-id="${c.id}" data-resposta-id="${r.id}" title="Denunciar resposta">🚩</button>
                                </div>
                                <div class="texto-comentario">${escaparHtml(r.texto)}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// ==============================
// VINCULAR EVENTOS DOS COMENTÁRIOS
// ==============================
function vincularEventosComentarios() {
    // Exibir/ocultar box de resposta
    document.querySelectorAll(".btn-responder").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-comentario-id");
            const box = document.getElementById(`box-resposta-${id}`);
            if (box) {
                box.style.display = box.style.display === "none" ? "flex" : "none";
            }
        });
    });

    // Enviar resposta
    document.querySelectorAll(".btn-enviar-resposta").forEach(btn => {
        btn.addEventListener("click", function() {
            const postId = Number(this.getAttribute("data-post-id"));
            const comentarioId = Number(this.getAttribute("data-comentario-id"));
            const input = this.previousElementSibling;
            adicionarResposta(postId, comentarioId, input.value.trim());
        });
    });

    // Deletar comentário
    document.querySelectorAll(".btn-deletar-comentario").forEach(btn => {
        btn.addEventListener("click", function() {
            const postId = Number(this.getAttribute("data-post-id"));
            const comentarioId = Number(this.getAttribute("data-comentario-id"));
            deletarComentario(postId, comentarioId);
        });
    });

    // Denunciar comentário
    document.querySelectorAll(".btn-denunciar-comentario").forEach(btn => {
        btn.addEventListener("click", function() {
            const postId = Number(this.getAttribute("data-post-id"));
            const comentarioId = Number(this.getAttribute("data-comentario-id"));
            denunciarComentario(postId, comentarioId);
        });
    });

    // Denunciar resposta
    document.querySelectorAll(".btn-denunciar-resposta").forEach(btn => {
        btn.addEventListener("click", function() {
            const postId = Number(this.getAttribute("data-post-id"));
            const comentarioId = Number(this.getAttribute("data-comentario-id"));
            const respostaId = Number(this.getAttribute("data-resposta-id"));
            denunciarResposta(postId, comentarioId, respostaId);
        });
    });
}

// ==============================
// AÇÕES DE DENÚNCIA
// ==============================
function denunciarPost(pubId) {
    const motivo = prompt("Por qual motivo você está denunciando este post?\n(ex: Conteúdo inadequado, Spam, Discurso de ódio)");
    
    if (motivo === null) return; // Cancelou

    const pub = publicacoes.find(p => p.id === pubId);
    if (pub) {
        pub.denunciado = true;
        pub.motivoDenuncia = motivo.trim() || "Não informado";
        salvar();
        renderizarFeed();
        alert("Obrigado. Sua denúncia foi enviada à moderação.");
    }
}

function denunciarComentario(postId, comentarioId) {
    if (!confirm("Deseja denunciar este comentário para a moderação?")) return;

    const pub = publicacoes.find(p => p.id === postId);
    if (!pub) return;

    const comentario = pub.comentarios.find(c => c.id === comentarioId);
    if (comentario) {
        comentario.denunciado = true;
        salvar();
        renderizarFeed();
        alert("Comentário denunciado com sucesso.");
    }
}

function denunciarResposta(postId, comentarioId, respostaId) {
    if (!confirm("Deseja denunciar esta resposta?")) return;

    const pub = publicacoes.find(p => p.id === postId);
    if (!pub) return;

    const comentario = pub.comentarios.find(c => c.id === comentarioId);
    if (!comentario) return;

    const resposta = comentario.respostas.find(r => r.id === respostaId);
    if (resposta) {
        resposta.denunciado = true;
        salvar();
        renderizarFeed();
        alert("Resposta denunciada com sucesso.");
    }
}

// ==============================
// DEMAIS FUNÇÕES DO FEED
// ==============================
function adicionarComentario(postId, texto) {
    if (!texto) return;

    const pub = publicacoes.find(p => p.id === postId);
    if (!pub) return;

    pub.comentarios = pub.comentarios || [];
    pub.comentarios.push({
        id: Date.now(),
        texto: texto,
        data: new Date().toLocaleString("pt-BR"),
        denunciado: false,
        respostas: []
    });

    salvar();
    renderizarFeed();
    atualizarNuvem();
}

function adicionarResposta(postId, comentarioId, texto) {
    if (!texto) return;

    const pub = publicacoes.find(p => p.id === postId);
    if (!pub) return;

    const comentario = pub.comentarios.find(c => c.id === comentarioId);
    if (!comentario) return;

    comentario.respostas = comentario.respostas || [];
    comentario.respostas.push({
        id: Date.now(),
        texto: texto,
        denunciado: false,
        data: new Date().toLocaleString("pt-BR")
    });

    salvar();
    renderizarFeed();
    atualizarNuvem();
}

function deletarComentario(postId, comentarioId) {
    const pub = publicacoes.find(p => p.id === postId);
    if (!pub) return;

    pub.comentarios = pub.comentarios.filter(c => c.id !== comentarioId);
    salvar();
    renderizarFeed();
    atualizarNuvem();
}

function atualizarNuvem() {
    const contagem = {};

    publicacoes.forEach(function(pub) {
        if (pub.denunciado) return; // Ignora posts denunciados da nuvem

        let textoCompleto = pub.texto || "";

        (pub.comentarios || []).forEach(c => {
            if (!c.denunciado) {
                textoCompleto += " " + c.texto;
                (c.respostas || []).forEach(r => {
                    if (!r.denunciado) textoCompleto += " " + r.texto;
                });
            }
        });

        const tags = textoCompleto.match(hashtagRegex);
        if (!tags) return;

        tags.forEach(function(tag) {
            const tagMinusc = tag.toLowerCase();
            contagem[tagMinusc] = (contagem[tagMinusc] || 0) + 1;
        });
    });

    const hashtagsOrdenadas = Object.entries(contagem).sort((a, b) => b[1] - a[1]);

    const listaHashtags = document.getElementById("listaHashtags");
    if (listaHashtags) {
        listaHashtags.innerHTML = "";

        if (hashtagsOrdenadas.length === 0) {
            listaHashtags.innerHTML = "<li>Nenhuma hashtag utilizada ainda.</li>";
        } else {
            hashtagsOrdenadas.forEach(function(item, index) {
                const tag = item[0];
                const quantidade = item[1];
                const li = document.createElement("li");

                li.innerHTML = `<strong>${index + 1}º</strong> ${escaparHtml(tag)} - ${quantidade} ${quantidade === 1 ? "uso" : "usos"}`;
                listaHashtags.appendChild(li);
            });
        }
    }

    const nuvem = document.getElementById("nuvem");
    if (!nuvem || typeof WordCloud === "undefined") return;

    const listaNuvem = hashtagsOrdenadas.map(([tag, qtd]) => [tag, 15 + qtd * 12]);

    WordCloud(nuvem, {
        list: listaNuvem,
        gridSize: 10,
        weightFactor: 1,
        rotateRatio: 0.3,
        rotationSteps: 2,
        backgroundColor: "#ffffff",
        color: function() {
            const cores = ["#ff2d55", "#ff4d6d", "#e91e63", "#d81b60", "#9c27b0"];
            return cores[Math.floor(Math.random() * cores.length)];
        }
    });
}

function toggleMenu(pubId) {
    const menu = document.getElementById(`menu-${pubId}`);
    if (!menu) return;

    const isVisible = menu.style.display === "block";
    document.querySelectorAll(".dropdown-menu").forEach(m => m.style.display = "none");

    if (!isVisible) {
        menu.style.display = "block";
    }
}

function deletarPost(pubId) {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;

    publicacoes = publicacoes.filter(pub => pub.id !== pubId);
    salvar();
    renderizarFeed();
    atualizarNuvem();
}

function curtirPost(pubId) {
    const pub = publicacoes.find(p => p.id === pubId);
    if (!pub) return;

    if (!pub.curtido) {
        pub.curtido = true;
        pub.curtidas++;
    } else {
        pub.curtido = false;
        if (pub.curtidas > 0) pub.curtidas--;
    }

    salvar();
    renderizarFeed();
}

document.addEventListener("click", function(event) {
    if (!event.target.closest(".menu-post")) {
        document.querySelectorAll(".dropdown-menu").forEach(menu => menu.style.display = "none");
    }
});