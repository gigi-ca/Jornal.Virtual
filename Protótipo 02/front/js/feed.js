const token = localStorage.getItem("token");

const btnPublicar = document.getElementById("publicar");
const texto = document.getElementById("texto");
const inputArquivo = document.getElementById("anexo");
const previewAnexo = document.getElementById("preview-anexo");
const listaPublicacoes = document.getElementById("listaPublicacoes");
const pesquisa = document.getElementById("pesquisaPublicacoes");
const btnFiltros = document.getElementById("btnFiltros");
const filtrosPesquisa = document.getElementById("filtrosPesquisa");
const modalHashtags = document.getElementById("modalHashtags");
const listaHashtags = document.getElementById("listaHashtags");
const btnVerTudo = document.getElementById("btnVerTudo");
const fecharModalHashtags = document.getElementById("fecharModalHashtags");
const modalDenuncia = document.getElementById("modalDenuncia");
const fecharModalDenuncia = document.getElementById("fecharModalDenuncia");
const cancelarDenuncia = document.getElementById("cancelarDenuncia");
const confirmarDenuncia = document.getElementById("confirmarDenuncia");
const tipoDenuncia = document.getElementById("tipoDenuncia");
const idDenuncia = document.getElementById("idDenuncia");
const motivoDenuncia = document.getElementById("motivoDenuncia");

let publicacoes = [];
let filtroAtual = "recentes";
let termoPesquisa = "";

const hashtagRegex = /#[a-zA-ZÀ-ÿ0-9_]+/g;

async function api(url, options = {}) {

    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`
    };

    const resposta = await fetch(`${API_URL}${url}`, {
        ...options,
        headers
    });

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        throw new Error(
            dados.mensagem || "Erro ao realizar operação."
        );
    }

    return dados;
}

function obterUsuarioToken() {
    if (!token) return null;

    try {
        const partes = token.split(".");
        if (partes.length !== 3) return null;

        const payload = partes[1].replace(/-/g, "+").replace(/\_/g, "/");
        const json = decodeURIComponent(
            atob(payload)
                .split("")
                .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        return JSON.parse(json);
    } catch (erro) {
        console.warn("Não foi possível ler o token.", erro);
        return null;
    }
}

const usuarioAtual = obterUsuarioToken();

function getIdUsuarioAtual() {
    if (!usuarioAtual) return null;

    return Number(
        usuarioAtual.id ||
        usuarioAtual.usuarioId ||
        usuarioAtual.userId
    );
}

function getTipoUsuarioAtual() {
    if (!usuarioAtual) return null;

    return (
        usuarioAtual.tipo ||
        usuarioAtual.tipoUsuario ||
        usuarioAtual.role
    );
}

function ehAdministrador() {
    return getTipoUsuarioAtual() === "ADMINISTRADOR";
}

function podeExcluirPublicacao(publicacao) {
    const usuarioId = getIdUsuarioAtual();

    return (
        ehAdministrador() ||
        Number(publicacao.usuarioId) === usuarioId
    );
}

function podeExcluirComentario(comentario, publicacao) {
    const usuarioId = getIdUsuarioAtual();

    return (
        ehAdministrador() ||
        Number(comentario.usuarioId) === usuarioId ||
        Number(publicacao.usuarioId) === usuarioId
    );
}

function escaparHtml(valor) {
    if (valor === null || valor === undefined) return "";

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/\</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatarData(data) {
    if (!data) return "";

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) return data;

    return dataObj.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

function formatarTexto(texto) {
    if (!texto) return "";

    const seguro = escaparHtml(texto);

    return seguro.replace(
        hashtagRegex,
        match => `<span class="hashtag">${match}</span>`
    );
}

async function carregarPublicacoes() {
    listaPublicacoes.innerHTML = `
        <div class="estado-feed">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Carregando publicações...</span>
        </div>
    `;

    try {
        const resposta = await api("/publicacoes/listar");

        publicacoes = Array.isArray(resposta)
            ? resposta
            : resposta.publicacoes || [];

        renderizarFeed();
    } catch (erro) {
        console.error(erro);

        listaPublicacoes.innerHTML = `
            <div class="estado-feed erro">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span>${escaparHtml(erro.message)}</span>
            </div>
        `;
    }
}

function obterPublicacoesFiltradas() {
    let lista = [...publicacoes];

    if (termoPesquisa.trim()) {
        const termo = termoPesquisa.toLowerCase().trim();

        lista = lista.filter(publicacao => {
            const texto = publicacao.texto || "";
            const nome = publicacao.autor?.nome || "";
            const hashtags = (publicacao.hashtags || [])
                .map(tag => tag.nome)
                .join(" ");

            return (
                texto.toLowerCase().includes(termo) ||
                nome.toLowerCase().includes(termo) ||
                hashtags.toLowerCase().includes(termo)
            );
        });
    }

    if (filtroAtual === "curtidas") {
        lista.sort(
            (a, b) =>
                (b.curtidas?.length || 0) -
                (a.curtidas?.length || 0)
        );
    } else if (filtroAtual === "comentarios") {
        lista.sort(
            (a, b) =>
                (b.comentarios?.length || 0) -
                (a.comentarios?.length || 0)
        );
    } else {
        lista.sort(
            (a, b) =>
                new Date(b.dataPublicacao) -
                new Date(a.dataPublicacao)
        );
    }

    return lista;
}

function renderizarFeed() {
    const lista = obterPublicacoesFiltradas();

    if (!lista.length) {
        listaPublicacoes.innerHTML = `
            <div class="estado-feed">
                <i class="fa-regular fa-newspaper"></i>
                <span>Nenhuma publicação encontrada.</span>
            </div>
        `;

        return;
    }

    listaPublicacoes.innerHTML = lista
        .map(publicacao => criarCardPublicacao(publicacao))
        .join("");
}

function criarCardPublicacao(publicacao) {
    const autor = publicacao.autor || {};
    const nomeAutor = autor.nome || "Usuário";
    const fotoAutor = autor.fotoPerfil || "/img/avatar-padrao.png";
    const quantidadeCurtidas = publicacao.curtidas?.length || 0;
    const quantidadeComentarios = publicacao.comentarios?.length || 0;
    const usuarioId = getIdUsuarioAtual();

    const curtiu = (publicacao.curtidas || []).some(
        curtida => Number(curtida.usuarioId) === usuarioId
    );

    const podeExcluir = podeExcluirPublicacao(publicacao);

    const menuExcluir = podeExcluir
        ? `
            <button type="button" class="btn-deletar" data-acao="excluir-publicacao" data-id="${publicacao.id}">
                <i class="fa-solid fa-trash"></i>
                Excluir
            </button>
        `
        : "";

    return `
        <article class="post" data-post-id="${publicacao.id}">
            <div class="cabecalho-post">
                <div class="autor-post">
                    <img class="avatar-post" src="${escaparHtml(fotoAutor)}" alt="Foto de ${escaparHtml(nomeAutor)}" onerror="this.src='/img/avatar-padrao.png'">

                    <div class="dados-autor">
                        <span class="nome-autor">${escaparHtml(nomeAutor)}</span>
                        <span class="usuario-autor">
                            ${autor.tipo === "ADMINISTRADOR"
            ? "Administrador"
            : autor.tipo === "VERIFICADO"
                ? "Verificado"
                : "Usuário"}
                        </span>
                        <span class="data">${formatarData(publicacao.dataPublicacao)}</span>
                    </div>
                </div>

                <div class="menu-post">
                    <button type="button" class="btn-menu" data-acao="menu" aria-label="Mais opções">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>

                    <div class="dropdown-menu">
                        <button type="button" data-acao="denunciar-publicacao" data-id="${publicacao.id}">
                            <i class="fa-solid fa-flag"></i>
                            Denunciar
                        </button>
                        ${menuExcluir}
                    </div>
                </div>
            </div>

            <div class="conteudo">
                ${formatarTexto(publicacao.texto)}
            </div>

            ${renderizarMidias(publicacao)}

            <div class="acoes">
                <button type="button" class="btn-curtir ${curtiu ? "curtido" : ""}" data-acao="curtir" data-id="${publicacao.id}">
                    <i class="${curtiu ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    <span>${quantidadeCurtidas}</span>
                </button>

                <button type="button" class="btn-comentarios" data-acao="comentarios" data-id="${publicacao.id}">
                    <i class="fa-regular fa-comment"></i>
                    <span>${quantidadeComentarios}</span>
                </button>

                <button type="button" class="btn-responder" data-acao="responder" data-id="${publicacao.id}">
                    <i class="fa-solid fa-reply"></i>
                    Responder
                </button>
            </div>

            <div class="comentarios" id="comentarios-${publicacao.id}">
                ${renderizarComentarios(publicacao)}
            </div>

            <div class="responder-container" id="responder-${publicacao.id}">
                <input type="text" class="input-resposta" id="input-resposta-${publicacao.id}" placeholder="Escreva uma resposta..." maxlength="1000">

                <button type="button" class="btn-enviar-resposta" data-acao="enviar-resposta" data-id="${publicacao.id}">
                    Enviar
                </button>
            </div>
        </article>
    `;
}

function renderizarMidias(publicacao) {
    if (!publicacao.midias?.length) return "";

    return publicacao.midias
        .map(midia => {
            const url =
                midia.url ||
                midia.caminho ||
                midia.arquivo ||
                midia.nomeArquivo;

            if (!url) return "";

            const tipo =
                midia.tipo ||
                midia.mimeType ||
                "";

            if (tipo.startsWith("image/")) {
                return `
                    <img class="post-midia" src="${escaparHtml(url)}" alt="Imagem da publicação">
                `;
            }

            if (tipo.startsWith("video/")) {
                return `
                    <video class="post-video" controls>
                        <source src="${escaparHtml(url)}" type="${escaparHtml(tipo)}">
                    </video>
                `;
            }

            return `
                <a class="midia-download" href="${escaparHtml(url)}" target="_blank" rel="noopener noreferrer">
                    <i class="fa-solid fa-file"></i>
                    Abrir arquivo
                </a>
            `;
        })
        .join("");
}

function renderizarComentarios(publicacao) {
    const comentarios = publicacao.comentarios || [];

    if (!comentarios.length) {
        return `
            <div class="comentario-vazio">
                Nenhum comentário ainda.
            </div>
        `;
    }

    return comentarios
        .map(comentario => criarComentario(comentario, publicacao))
        .join("");
}

function criarComentario(comentario, publicacao) {
    const autor = comentario.autor || {};
    const nomeAutor = autor.nome || "Usuário";
    const fotoAutor = autor.fotoPerfil || "/img/avatar-padrao.png";
    const podeExcluir = podeExcluirComentario(comentario, publicacao);
    const respostas = comentario.respostas || [];

    return `
        <div class="item-comentario" data-comentario-id="${comentario.id}">
            <div class="header-comentario">
                <img class="avatar-comentario" src="${escaparHtml(fotoAutor)}" alt="Foto de ${escaparHtml(nomeAutor)}" onerror="this.src='/img/avatar-padrao.png'">

                <div class="conteudo-comentario">
                    <div>
                        <span class="nome-comentario">${escaparHtml(nomeAutor)}</span>
                        <span class="data-comentario">${formatarData(comentario.dataPublicacao)}</span>
                    </div>

                    <div class="responde-para">
                        Respondendo à <strong>publicação</strong>
                    </div>

                    <div class="texto-comentario">
                        ${formatarTexto(comentario.texto)}
                    </div>

                    <div class="acoes-comentario">
                        <button type="button" data-acao="responder-comentario" data-id="${comentario.id}" data-publicacao="${publicacao.id}">
                            Responder
                        </button>

                        <button type="button" data-acao="denunciar-comentario" data-id="${comentario.id}">
                            Denunciar
                        </button>

                        ${podeExcluir
            ? `
                                <button type="button" class="btn-deletar-comentario" data-acao="excluir-comentario" data-id="${comentario.id}">
                                    Excluir
                                </button>
                            `
            : ""}
                    </div>

                    <div class="responder-container" id="responder-comentario-${comentario.id}">
                        <input type="text" class="input-resposta" id="input-comentario-${comentario.id}" placeholder="Responder a ${escaparHtml(nomeAutor)}..." maxlength="1000">

                        <button type="button" class="btn-enviar-resposta" data-acao="enviar-resposta-comentario" data-id="${comentario.id}" data-publicacao="${publicacao.id}">
                            Enviar
                        </button>
                    </div>

                    ${respostas.length
            ? `
                            <div class="respostas">
                                ${respostas
                .map(resposta => criarResposta(resposta, comentario, publicacao))
                .join("")}
                            </div>
                        `
            : ""}
                </div>
            </div>
        </div>
    `;
}

function criarResposta(resposta, comentario, publicacao) {
    const autor = resposta.autor || {};
    const nomeAutor = autor.nome || "Usuário";
    const fotoAutor = autor.fotoPerfil || "/img/avatar-padrao.png";
    const podeExcluir = podeExcluirComentario(resposta, publicacao);

    return `
        <div class="resposta" data-comentario-id="${resposta.id}">
            <div class="header-comentario">
                <img class="avatar-comentario" src="${escaparHtml(fotoAutor)}" alt="Foto de ${escaparHtml(nomeAutor)}" onerror="this.src='/img/avatar-padrao.png'">

                <div class="conteudo-comentario">
                    <div>
                        <span class="nome-comentario">${escaparHtml(nomeAutor)}</span>
                        <span class="data-comentario">${formatarData(resposta.dataPublicacao)}</span>
                    </div>

                    <div class="responde-para">
                        Respondendo a
                        <strong>${escaparHtml(comentario.autor?.nome || "Usuário")}</strong>
                    </div>

                    <div class="texto-comentario">
                        ${formatarTexto(resposta.texto)}
                    </div>

                    <div class="acoes-comentario">
                        <button type="button" data-acao="denunciar-comentario" data-id="${resposta.id}">
                            Denunciar
                        </button>

                        ${podeExcluir
            ? `
                                <button type="button" class="btn-deletar-comentario" data-acao="excluir-comentario" data-id="${resposta.id}">
                                    Excluir
                                </button>
                            `
            : ""}
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function criarPublicacao() {
    const textoValor = texto.value.trim();

    if (!textoValor) {
        alert("Digite algo antes de publicar.");
        return;
    }

    btnPublicar.disabled = true;
    btnPublicar.textContent = "Publicando...";

    try {
        const resposta = await api("/publicacoes/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                texto: textoValor
            })
        });

        const novaPublicacao = resposta.publicacao;
        const possuiHashtag = textoValor.match(hashtagRegex);

        texto.value = "";

        if (inputArquivo) {
            inputArquivo.value = "";
        }

        if (previewAnexo) {
            previewAnexo.innerHTML = "";
        }

        alert("Publicação criada com sucesso!");

        await carregarPublicacoes();

        if (possuiHashtag) {
            atualizarNuvem();
        }

        void novaPublicacao;
    } catch (erro) {
        console.error(erro);
        alert(erro.message || "Não foi possível publicar.");
    } finally {
        btnPublicar.disabled = false;
        btnPublicar.textContent = "Publicar";
    }
}

async function alternarCurtida(publicacaoId) {
    const publicacao = publicacoes.find(
        item => Number(item.id) === Number(publicacaoId)
    );

    if (!publicacao) return;

    const usuarioId = getIdUsuarioAtual();

    const jaCurtiu = (publicacao.curtidas || []).some(
        curtida => Number(curtida.usuarioId) === usuarioId
    );

    try {
        if (jaCurtiu) {
            await api("/curtidas/descurtir", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    publicacaoId
                })
            });
        } else {
            await api("/curtidas/curtir", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    publicacaoId
                })
            });
        }

        await carregarPublicacoes();
    } catch (erro) {
        alert(erro.message);
    }
}

async function carregarComentarios(publicacaoId) {
    try {
        const comentarios = await api(
            `/comentarios/publicacao/${publicacaoId}`
        );

        const publicacao = publicacoes.find(
            item => Number(item.id) === Number(publicacaoId)
        );

        if (publicacao) {
            publicacao.comentarios = comentarios;
        }

        const container = document.getElementById(
            `comentarios-${publicacaoId}`
        );

        if (container) {
            container.innerHTML = renderizarComentarios(publicacao);
        }
    } catch (erro) {
        console.error(erro);

        const container = document.getElementById(
            `comentarios-${publicacaoId}`
        );

        if (container) {
            container.innerHTML = `
                <div class="comentario-vazio">
                    Não foi possível carregar os comentários.
                </div>
            `;
        }
    }
}

async function adicionarComentario(
    publicacaoId,
    textoComentario,
    comentarioPaiId = null
) {
    const textoLimpo = textoComentario.trim();

    if (!textoLimpo) return;

    try {
        await api("/comentarios/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                publicacaoId,
                texto: textoLimpo,
                comentarioPaiId
            })
        });

        await carregarComentarios(publicacaoId);
        renderizarFeed();
        await atualizarNuvem();

        const comentarios = document.getElementById(
            `comentarios-${publicacaoId}`
        );

        if (comentarios) {
            comentarios.classList.add("aberto");
        }
    } catch (erro) {
        alert(erro.message);
    }
}
async function excluirComentario(comentarioId, publicacaoId) {
    const confirmar = confirm(
        "Deseja realmente excluir este comentário?"
    );

    if (!confirmar) return;

    try {
        await api(`/comentarios/${comentarioId}`, {
            method: "DELETE"
        });

        await carregarComentarios(publicacaoId);
        renderizarFeed();

        const comentarios = document.getElementById(
            `comentarios-${publicacaoId}`
        );

        if (comentarios) {
            comentarios.classList.add("aberto");
        }
    } catch (erro) {
        alert(erro.message);
    }
}

async function excluirPublicacao(publicacaoId) {
    const confirmar = confirm(
        "Deseja realmente excluir esta publicação?"
    );

    if (!confirmar) return;

    try {
        await api(`/publicacoes/excluir/${publicacaoId}`, {
            method: "DELETE"
        });

        publicacoes = publicacoes.filter(
            publicacao =>
                Number(publicacao.id) !== Number(publicacaoId)
        );

        renderizarFeed();
    } catch (erro) {
        alert(erro.message);
    }
}

function abrirModalDenuncia(tipo, id) {
    tipoDenuncia.value = tipo;
    idDenuncia.value = id;
    motivoDenuncia.value = "";

    modalDenuncia.classList.add("aberto");

    setTimeout(() => motivoDenuncia.focus(), 50);
}

function fecharModalDenunciaFunc() {
    modalDenuncia.classList.remove("aberto");
    tipoDenuncia.value = "";
    idDenuncia.value = "";
    motivoDenuncia.value = "";
}

async function enviarDenuncia() {
    const tipo = tipoDenuncia.value;
    const id = Number(idDenuncia.value);
    const motivo = motivoDenuncia.value.trim();

    if (!motivo) {
        alert("Informe o motivo da denúncia.");
        return;
    }

    confirmarDenuncia.disabled = true;

    try {
        if (tipo === "publicacao") {
            await api("/denuncias-publicacao/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    publicacaoId: id,
                    motivo
                })
            });
        } else {
            await api("/denuncias-comentario/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    comentarioId: id,
                    motivo
                })
            });
        }

        alert("Denúncia enviada com sucesso.");
        fecharModalDenunciaFunc();
    } catch (erro) {
        alert(erro.message);
    } finally {
        confirmarDenuncia.disabled = false;
    }
}

function fecharMenus() {
    document
        .querySelectorAll(".dropdown-menu.aberto")
        .forEach(menu => menu.classList.remove("aberto"));
}

function abrirRespostaPublicacao(publicacaoId) {
    const container = document.getElementById(
        `responder-${publicacaoId}`
    );

    if (!container) return;

    container.classList.toggle("aberto");

    if (container.classList.contains("aberto")) {
        const input = document.getElementById(
            `input-resposta-${publicacaoId}`
        );

        if (input) input.focus();
    }
}

function abrirRespostaComentario(comentarioId) {
    const container = document.getElementById(
        `responder-comentario-${comentarioId}`
    );

    if (!container) return;

    container.classList.toggle("aberto");

    if (container.classList.contains("aberto")) {
        const input = document.getElementById(
            `input-comentario-${comentarioId}`
        );

        if (input) input.focus();
    }
}

async function atualizarNuvem() {
    const canvas = document.getElementById("nuvem");

    if (!canvas) return;

    try {
        await Promise.all(
            publicacoes.map(async publicacao => {
                if (!Array.isArray(publicacao.comentarios)) {
                    try {
                        publicacao.comentarios = await api(
                            `/comentarios/publicacao/${publicacao.id}`
                        );
                    } catch (erro) {
                        console.warn(
                            `Não foi possível carregar os comentários da publicação ${publicacao.id}.`,
                            erro
                        );

                        publicacao.comentarios = [];
                    }
                }
            })
        );

        const contexto = canvas.getContext("2d");
        const contagem = {};

        function contarHashtags(texto) {
            if (!texto) return;

            const tags = texto.match(hashtagRegex);

            if (!tags) return;

            tags.forEach(tag => {
                const normalizada = tag.toLowerCase();

                contagem[normalizada] =
                    (contagem[normalizada] || 0) + 1;
            });
        }

        function contarComentarios(comentarios) {
            if (!Array.isArray(comentarios)) return;

            comentarios.forEach(comentario => {
                contarHashtags(comentario.texto);

                if (Array.isArray(comentario.respostas)) {
                    contarComentarios(comentario.respostas);
                }
            });
        }

        publicacoes.forEach(publicacao => {
            contarHashtags(publicacao.texto);
            contarComentarios(publicacao.comentarios);
        });

        const hashtags = Object.entries(contagem);

        contexto.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        if (!hashtags.length) {
            contexto.font = "14px Montserrat, sans-serif";
            contexto.fillStyle = "#888";
            contexto.textAlign = "center";

            contexto.fillText(
                "Nenhuma hashtag utilizada ainda.",
                canvas.width / 2,
                canvas.height / 2
            );

            renderizarListaHashtags([]);
            return;
        }

        const maior = Math.max(
            ...hashtags.map(item => item[1])
        );

        const menor = Math.min(
            ...hashtags.map(item => item[1])
        );

        const palavras = hashtags.map(([tag, quantidade]) => {
            const tamanho =
                maior === menor
                    ? 20
                    : 14 +
                    ((quantidade - menor) /
                        (maior - menor)) *
                    20;

            return {
                tag,
                quantidade,
                tamanho
            };
        });

        palavras.sort(() => Math.random() - 0.5);

        const usadas = [];

        palavras.forEach(palavra => {
            let tentativas = 0;
            let x;
            let y;

            contexto.font =
                `600 ${palavra.tamanho}px Montserrat, sans-serif`;

            const largura =
                contexto.measureText(palavra.tag).width +
                palavra.tamanho;

            while (tentativas < 100) {
                x =
                    15 +
                    Math.random() *
                    (canvas.width - largura - 30);

                y =
                    palavra.tamanho +
                    Math.random() *
                    (canvas.height -
                        palavra.tamanho -
                        25);

                const colisao = usadas.some(
                    item =>
                        Math.abs(item.x - x) < 80 &&
                        Math.abs(item.y - y) < 35
                );

                if (!colisao) break;

                tentativas++;
            }

            contexto.fillStyle = "var(--primary)";
            contexto.fillText(
                palavra.tag,
                x,
                y
            );

            usadas.push({
                x,
                y
            });
        });

        renderizarListaHashtags(hashtags);
    } catch (erro) {
        console.error(
            "Erro ao atualizar nuvem de hashtags:",
            erro
        );
    }
}

function renderizarListaHashtags(hashtags) {
    if (!listaHashtags) return;

    if (!hashtags.length) {
        listaHashtags.innerHTML =
            "<li>Nenhuma hashtag utilizada ainda.</li>";
        return;
    }

    hashtags.sort((a, b) => b[1] - a[1]);

    listaHashtags.innerHTML = hashtags
        .map(
            ([tag, quantidade], index) => `
                <li>
                    <strong>${index + 1}º</strong>
                    ${escaparHtml(tag)} -
                    ${quantidade}
                    ${quantidade === 1 ? "uso" : "usos"}
                </li>
            `
        )
        .join("");
}

btnPublicar.addEventListener(
    "click",
    criarPublicacao
);

texto.addEventListener(
    "keydown",
    evento => {
        if (
            (evento.ctrlKey || evento.metaKey) &&
            evento.key === "Enter"
        ) {
            criarPublicacao();
        }
    }
);

inputArquivo?.addEventListener(
    "change",
    () => {
        const arquivo = inputArquivo.files?.[0];

        if (!arquivo) {
            previewAnexo.innerHTML = "";
            return;
        }

        previewAnexo.innerHTML = `
            <i class="fa-solid fa-paperclip"></i>
            ${escaparHtml(arquivo.name)}
        `;
    }
);

btnFiltros.addEventListener(
    "click",
    () => {
        filtrosPesquisa.classList.toggle("aberto");
    }
);

pesquisa.addEventListener(
    "input",
    () => {
        termoPesquisa = pesquisa.value;
        renderizarFeed();
    }
);

filtrosPesquisa
    .querySelectorAll("button")
    .forEach(botao => {
        botao.addEventListener(
            "click",
            () => {
                filtrosPesquisa
                    .querySelectorAll("button")
                    .forEach(item =>
                        item.classList.remove("filtro-ativo")
                    );

                botao.classList.add("filtro-ativo");
                filtroAtual = botao.dataset.filtro;
                renderizarFeed();
            }
        );
    });

btnVerTudo?.addEventListener(
    "click",
    () => {
        modalHashtags.classList.add("aberto");
    }
);

fecharModalHashtags?.addEventListener(
    "click",
    () => {
        modalHashtags.classList.remove("aberto");
    }
);

fecharModalDenuncia?.addEventListener(
    "click",
    fecharModalDenunciaFunc
);

cancelarDenuncia?.addEventListener(
    "click",
    fecharModalDenunciaFunc
);

confirmarDenuncia?.addEventListener(
    "click",
    enviarDenuncia
);

listaPublicacoes.addEventListener(
    "click",
    async evento => {
        const botao = evento.target.closest("[data-acao]");

        if (!botao) return;

        const acao = botao.dataset.acao;
        const id = Number(botao.dataset.id);

        if (acao === "menu") {
            const menu = botao.parentElement.querySelector(
                ".dropdown-menu"
            );

            fecharMenus();
            menu?.classList.toggle("aberto");
            return;
        }

        if (acao === "curtir") {
            await alternarCurtida(id);
            return;
        }

        if (acao === "comentarios") {
            const container = document.getElementById(
                `comentarios-${id}`
            );

            if (!container) return;

            const aberto = container.classList.toggle("aberto");

            if (aberto) {
                await carregarComentarios(id);
            }

            return;
        }

        if (acao === "responder") {
            abrirRespostaPublicacao(id);
            return;
        }

        if (acao === "enviar-resposta") {
            const input = document.getElementById(
                `input-resposta-${id}`
            );

            if (!input) return;

            await adicionarComentario(
                id,
                input.value,
                null
            );

            input.value = "";
            return;
        }

        if (acao === "responder-comentario") {
            abrirRespostaComentario(id);
            return;
        }

        if (acao === "enviar-resposta-comentario") {
            const publicacaoId = Number(
                botao.dataset.publicacao
            );

            const input = document.getElementById(
                `input-comentario-${id}`
            );

            if (!input) return;

            await adicionarComentario(
                publicacaoId,
                input.value,
                id
            );

            input.value = "";
            return;
        }

        if (acao === "excluir-publicacao") {
            await excluirPublicacao(id);
            return;
        }

        if (acao === "excluir-comentario") {
            const post = botao.closest(".post");

            const publicacaoId = Number(
                post?.dataset.postId
            );

            await excluirComentario(
                id,
                publicacaoId
            );

            return;
        }

        if (acao === "denunciar-publicacao") {
            abrirModalDenuncia(
                "publicacao",
                id
            );

            fecharMenus();
            return;
        }

        if (acao === "denunciar-comentario") {
            abrirModalDenuncia(
                "comentario",
                id
            );
        }
    }
);

document.addEventListener(
    "click",
    evento => {
        if (!evento.target.closest(".menu-post")) {
            fecharMenus();
        }

        if (evento.target === modalHashtags) {
            modalHashtags.classList.remove("aberto");
        }

        if (evento.target === modalDenuncia) {
            fecharModalDenunciaFunc();
        }
    }
);

document.addEventListener(
    "keydown",
    evento => {
        if (evento.key !== "Escape") return;

        modalHashtags?.classList.remove("aberto");
        fecharModalDenunciaFunc();
        fecharMenus();
    }
);

document.addEventListener(
    "DOMContentLoaded",
    async () => {
        await carregarPublicacoes();
        atualizarNuvem();
    }
);