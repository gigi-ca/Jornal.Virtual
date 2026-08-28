// const API_URL = "http://localhost:3000";
// const token = localStorage.getItem("token");

// if (!token) {
//     window.location.href = "../login.html";
// }

// function obterUsuarioToken() {
//     try {
//         const payload = token.split(".")[1];
//         const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
//         return JSON.parse(decodeURIComponent(atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")));
//     } catch (erro) {
//         console.error("Erro ao ler token:", erro);
//         return null;
//     }
// }

// const usuarioLogado = obterUsuarioToken();

// if (!usuarioLogado || usuarioLogado.tipo !== "ADMINISTRADOR") {
//     alert("Acesso permitido somente para administradores.");
//     localStorage.removeItem("token");
//     window.location.href = "../login.html";
// }

const secoes = document.querySelectorAll(".admin-section");
const botoesMenu = document.querySelectorAll(".menu-item[data-section]");
const tituloPagina = document.getElementById("tituloPagina");
const nomeAdministrador = document.getElementById("nomeAdministrador");
const nomeWelcome = document.getElementById("nomeWelcome");
const fotoAdministrador = document.getElementById("fotoAdministrador");
const nomeEmpresa = document.getElementById("nomeEmpresa");
const contadorDenuncias = document.getElementById("contadorDenuncias");

// async function api(url, options = {}) {
//     const resposta = await fetch(`${API_URL}${url}`, {
//         ...options,
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//             ...(options.headers || {})
//         }
//     });
//     const dados = await resposta.json().catch(() => ({}));
//     if (!resposta.ok) {
//         throw new Error(dados.mensagem || "Erro ao realizar operação.");
//     }
//     return dados;
// }

const nomesSecoes = {
    dashboard: "Dashboard",
    usuarios: "Gerenciar usuários",
    aparencia: "Personalizar aparência",
    empresa: "Informações da empresa",
    denuncias: "Denúncias"
};

botoesMenu.forEach(botao => {
    botao.addEventListener("click", () => trocarSecao(botao.dataset.section));
});

function trocarSecao(nome) {
    secoes.forEach(secao => secao.classList.remove("ativa"));

    const secaoSelecionada = document.getElementById(nome);

    if (secaoSelecionada) {
        secaoSelecionada.classList.add("ativa");
    }

    botoesMenu.forEach(botao => {
        botao.classList.toggle("ativo", botao.dataset.section === nome);
    });

    tituloPagina.textContent = nomesSecoes[nome] || "Painel";

    if (nome === "usuarios") carregarUsuarios();
    if (nome === "aparencia") carregarTemaEmpresa();
    if (nome === "empresa") carregarEmpresa();
    if (nome === "denuncias") carregarDenuncias();
}

async function carregarAdministrador() {
    if (!usuarioLogado) return;

    nomeAdministrador.textContent = usuarioLogado.nome || "Administrador";
    nomeWelcome.textContent = usuarioLogado.nome || "Administrador";

    try {
        const usuario = await api(`/usuarios/buscar/${usuarioLogado.id}`);

        nomeAdministrador.textContent = usuario.nome;
        nomeWelcome.textContent = usuario.nome;

        if (usuario.fotoPerfil) {
            fotoAdministrador.src = `${API_URL}/${usuario.fotoPerfil}`;
        }
    } catch (erro) {
        console.error("Erro ao carregar administrador:", erro);
    }
}

let empresaAtual = null;

async function carregarEmpresa() {
    try {
        const dados = await api(`/empresa/buscar/${usuarioLogado.empresaId}`);

        empresaAtual = dados.empresa || dados;
        const empresa = empresaAtual;

        preencherInformacoesEmpresa(empresa);
        nomeEmpresa.textContent = empresa.nome || "Empresa";
    } catch (erro) {
        console.error("Erro ao carregar empresa:", erro);
        nomeEmpresa.textContent = "Não foi possível carregar";

        const container = document.getElementById("informacoesEmpresa");

        if (container) {
            container.innerHTML = `<div class="empty-state">Não foi possível carregar as informações da empresa.</div>`;
        }
    }
}

function preencherInformacoesEmpresa(empresa) {
    if (!empresa) return;

    const campos = {
        empresaInfoNome: empresa.nome || "-",
        empresaInfoCnpj: empresa.cnpj || "-",
        empresaInfoEmail: empresa.email || "-",
        empresaInfoTelefone: empresa.telefone || "-",
        empresaInfoEndereco: empresa.endereco || "-",
        empresaInfoCidade: empresa.cidade || "-",
        empresaInfoEstado: empresa.estado || "-",
        empresaInfoCep: empresa.cep || ""
    };

    Object.entries(campos).forEach(([id, valor]) => {
        const campo = document.getElementById(id);
        if (campo) campo.textContent = valor;
    });
}

const modalEmpresa = document.getElementById("modalEmpresa");
const formEmpresa = document.getElementById("formEmpresa");

function abrirModalEmpresa() {
    if (!empresaAtual) {
        alert("As informações da empresa ainda não foram carregadas.");
        return;
    }

    const campos = {
        empresaNome: empresaAtual.nome,
        empresaCnpj: empresaAtual.cnpj,
        empresaEmail: empresaAtual.email,
        empresaTelefone: empresaAtual.telefone,
        empresaEndereco: empresaAtual.endereco,
        empresaCidade: empresaAtual.cidade,
        empresaEstado: empresaAtual.estado,
        empresaCep: empresaAtual.cep
    };

    Object.entries(campos).forEach(([id, valor]) => {
        document.getElementById(id).value = valor || "";
    });

    modalEmpresa.classList.add("aberto");
}

function fecharModalEmpresa() {
    modalEmpresa.classList.remove("aberto");
}

const btnModificarEmpresa = document.getElementById("btnModificarEmpresa");

if (btnModificarEmpresa) {
    btnModificarEmpresa.addEventListener("click", abrirModalEmpresa);
}

const btnFecharModalEmpresa = document.getElementById("fecharModalEmpresa");

if (btnFecharModalEmpresa) {
    btnFecharModalEmpresa.addEventListener("click", fecharModalEmpresa);
}

const btnCancelarEmpresa = document.getElementById("cancelarEmpresa");

if (btnCancelarEmpresa) {
    btnCancelarEmpresa.addEventListener("click", fecharModalEmpresa);
}

if (formEmpresa) {
    formEmpresa.addEventListener("submit", async evento => {
        evento.preventDefault();

        const campos = ["nome", "cnpj", "email", "telefone", "endereco", "cidade", "estado", "cep"];
        const dados = {};

        campos.forEach(campo => {
            dados[campo] = document.getElementById(`empresa${campo.charAt(0).toUpperCase() + campo.slice(1)}`).value.trim();
        });

        try {
            await api(`/empresa/atualizar/${usuarioLogado.empresaId}`, {
                method: "PUT",
                body: JSON.stringify(dados)
            });

            alert("Informações atualizadas com sucesso.");
            fecharModalEmpresa();
            await carregarEmpresa();
        } catch (erro) {
            alert(erro.message);
        }
    });
}

let usuarios = [];

async function carregarUsuarios() {
    const tabela = document.getElementById("tabelaUsuarios");

    tabela.innerHTML = `<tr><td colspan="5">Carregando usuários...</td></tr>`;

    try {
        usuarios = await api("/usuarios/listar");
        renderizarUsuarios(usuarios);
    } catch (erro) {
        tabela.innerHTML = `<tr><td colspan="5">Erro ao carregar usuários.</td></tr>`;
        console.error(erro);
    }
}

function renderizarUsuarios(lista) {
    const tabela = document.getElementById("tabelaUsuarios");

    document.getElementById("totalUsuarios").textContent = `${lista.length} usuário${lista.length === 1 ? "" : "s"}`;

    if (!lista.length) {
        tabela.innerHTML = `<tr><td colspan="5">Nenhum usuário encontrado.</td></tr>`;
        return;
    }

    tabela.innerHTML = lista.map(usuario => {
        const foto = usuario.fotoPerfil ? `${API_URL}/${usuario.fotoPerfil}` : "../assets/img/default-profile.png";
        const data = usuario.dataCriacao ? new Date(usuario.dataCriacao).toLocaleDateString("pt-BR") : "-";

        return `
            <tr>
                <td>
                    <div class="user-cell">
                        <img class="user-avatar" src="${foto}" alt="">
                        <div>
                            <div class="user-name">${esc(usuario.nome)}</div>
                        </div>
                    </div>
                </td>
                <td>${esc(usuario.email)}</td>
                <td><span class="type-badge">${formatarTipo(usuario.tipo)}</span></td>
                <td>${data}</td>
                <td>
                    <div class="action-buttons">
                        <button class="table-action" onclick="editarUsuario(${usuario.id})" title="Editar">✎</button>
                        <button class="table-action excluir" onclick="excluirUsuario(${usuario.id})" title="Excluir">×</button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function formatarTipo(tipo) {
    const tipos = {
        USUARIO: "Usuário",
        VERIFICADO: "Verificado",
        ADMINISTRADOR: "Administrador"
    };

    return tipos[tipo] || tipo;
}

document.getElementById("pesquisaUsuario").addEventListener("input", evento => {
    const termo = evento.target.value.toLowerCase().trim();

    const filtrados = usuarios.filter(usuario =>
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo)
    );

    renderizarUsuarios(filtrados);
});

const modalUsuario = document.getElementById("modalUsuario");
const modalConfirmar = document.getElementById("modalConfirmarUsuario");
let usuarioParaCadastrar = null;

document.getElementById("btnNovoUsuario").addEventListener("click", abrirCadastro);

function abrirCadastro() {
    document.getElementById("formUsuario").reset();
    document.getElementById("usuarioId").value = "";
    document.getElementById("tituloModalUsuario").textContent = "Cadastrar usuário";
    document.getElementById("campoSenha").style.display = "flex";
    modalUsuario.classList.add("aberto");
}

function fecharModalUsuario() {
    modalUsuario.classList.remove("aberto");
}

document.getElementById("fecharModalUsuario").addEventListener("click", fecharModalUsuario);
document.getElementById("cancelarUsuario").addEventListener("click", fecharModalUsuario);

document.getElementById("formUsuario").addEventListener("submit", evento => {
    evento.preventDefault();

    const id = document.getElementById("usuarioId").value;

    if (id) {
        atualizarUsuario();
        return;
    }

    usuarioParaCadastrar = {
        nome: document.getElementById("usuarioNome").value.trim(),
        email: document.getElementById("usuarioEmail").value.trim(),
        senha: document.getElementById("usuarioSenha").value,
        tipo: document.getElementById("usuarioTipo").value,
        bio: document.getElementById("usuarioBio").value.trim()
    };

    document.getElementById("resumoUsuario").innerHTML = `
        <strong>Nome:</strong> ${esc(usuarioParaCadastrar.nome)}
        <br>
        <strong>Email:</strong> ${esc(usuarioParaCadastrar.email)}
        <br>
        <strong>Tipo:</strong> ${formatarTipo(usuarioParaCadastrar.tipo)}
        <br>
        <strong>Bio:</strong> ${esc(usuarioParaCadastrar.bio || "Não informada")}
    `;

    fecharModalUsuario();
    modalConfirmar.classList.add("aberto");
});

document.getElementById("confirmarCadastro").addEventListener("click", async () => {
    if (!usuarioParaCadastrar) return;

    try {
        await api("/usuarios/cadastrar", {
            method: "POST",
            body: JSON.stringify({
                nome: usuarioParaCadastrar.nome,
                email: usuarioParaCadastrar.email,
                senha: usuarioParaCadastrar.senha,
                tipo: usuarioParaCadastrar.tipo,
                bio: usuarioParaCadastrar.bio,
                empresaId: usuarioLogado.empresaId
            })
        });

        alert("Usuário cadastrado com sucesso.");
        modalConfirmar.classList.remove("aberto");
        usuarioParaCadastrar = null;
        carregarUsuarios();
    } catch (erro) {
        alert(erro.message);
    }
});

document.getElementById("cancelarConfirmacao").addEventListener("click", () => {
    modalConfirmar.classList.remove("aberto");
    modalUsuario.classList.add("aberto");
});

async function editarUsuario(id) {
    try {
        const usuario = await api(`/usuarios/buscar/${id}`);

        document.getElementById("usuarioId").value = usuario.id;
        document.getElementById("usuarioNome").value = usuario.nome || "";
        document.getElementById("usuarioEmail").value = usuario.email || "";
        document.getElementById("usuarioTipo").value = usuario.tipo;
        document.getElementById("usuarioBio").value = usuario.bio || "";
        document.getElementById("usuarioSenha").value = "";
        document.getElementById("tituloModalUsuario").textContent = "Atualizar usuário";
        document.getElementById("campoSenha").style.display = "flex";
        modalUsuario.classList.add("aberto");
    } catch (erro) {
        alert(erro.message);
    }
}

async function atualizarUsuario() {
    const id = document.getElementById("usuarioId").value;

    const dados = {
        nome: document.getElementById("usuarioNome").value.trim(),
        email: document.getElementById("usuarioEmail").value.trim(),
        tipo: document.getElementById("usuarioTipo").value,
        bio: document.getElementById("usuarioBio").value.trim()
    };

    const senha = document.getElementById("usuarioSenha").value;

    if (senha.trim() !== "") {
        dados.senha = senha;
    }

    try {
        await api(`/usuarios/atualizar/${id}`, {
            method: "PUT",
            body: JSON.stringify(dados)
        });

        alert("Usuário atualizado com sucesso.");
        fecharModalUsuario();
        carregarUsuarios();
    } catch (erro) {
        alert(erro.message);
    }
}

async function excluirUsuario(id) {
    const usuario = usuarios.find(item => item.id === id);

    if (!usuario) return;

    if (id === usuarioLogado.id) {
        alert("Você não pode excluir o próprio usuário.");
        return;
    }

    const confirmar = confirm(`Deseja realmente excluir o usuário "${usuario.nome}"?`);

    if (!confirmar) return;

    try {
        await api(`/usuarios/excluir/${id}`, {
            method: "DELETE"
        });

        alert("Usuário excluído com sucesso.");
        carregarUsuarios();
    } catch (erro) {
        alert(erro.message);
    }
}

function criarTemas() {
    const container = document.getElementById("listaTemas");

    container.innerHTML = Object.entries(temas).map(([chave, tema]) => `
        <div class="theme-card" data-theme="${chave}">
            <div class="theme-preview" style="--theme-primary: ${tema.primary}; --theme-secondary: ${tema.secondary};">
                <div class="theme-preview-main"></div>
                <div class="theme-preview-secondary"></div>
            </div>
            <span>${chave}</span>
        </div>
    `).join("");

    document.querySelectorAll(".theme-card").forEach(card => {
        card.addEventListener("click", () => selecionarTemaPronto(card.dataset.theme));
    });
}

async function selecionarTemaPronto(nomeTema) {
    if (typeof window.aplicarTema !== "function") {
        console.error("tema.js não foi carregado.");
        return;
    }

    const tema = window.temas[nomeTema];

    if (!tema) return;

    window.aplicarTema(nomeTema);

    try {
        await salvarTemaBackend(tema);

        document.querySelectorAll(".theme-card").forEach(card => {
            card.classList.toggle("selecionado", card.dataset.theme === nomeTema);
        });

        preencherCoresPersonalizadas(tema);

        alert(`Tema "${nomeTema}" aplicado com sucesso.`);
    } catch (erro) {
        alert("O tema foi aplicado visualmente, mas não foi possível salvar no servidor.\n\n" + erro.message);
    }
}

async function carregarTemaEmpresa() {
    criarTemas();

    try {
        const tema = await api(`/tema/buscar/${usuarioLogado.empresaId}`);

        if (tema) {
            preencherCoresPersonalizadas(tema);
            aplicarCoresLocalmente(tema);
        }
    } catch (erro) {
        console.warn("Empresa ainda não possui tema salvo:", erro.message);
    }
}

function preencherCoresPersonalizadas(tema) {
    if (!tema) return;

    const campos = {
        corPrimary: tema.primary,
        corPrimaryDark: tema.primaryDark,
        corSecondary: tema.secondary,
        corSecondaryLight: tema.secondaryLight,
        corBackground: tema.background,
        corSurface: tema.surface,
        corText: tema.text,
        corTextLight: tema.textLight,
        corBorder: tema.border,
        corDanger: tema.danger
    };

    Object.entries(campos).forEach(([id, valor]) => {
        const campo = document.getElementById(id);

        if (campo && valor) {
            campo.value = valor;
        }
    });
}

document.getElementById("btnSalvarTema").addEventListener("click", async () => {
    const tema = {
        primary: document.getElementById("corPrimary").value,
        primaryDark: document.getElementById("corPrimaryDark").value,
        secondary: document.getElementById("corSecondary").value,
        secondaryLight: document.getElementById("corSecondaryLight").value,
        background: document.getElementById("corBackground").value,
        surface: document.getElementById("corSurface").value,
        text: document.getElementById("corText").value,
        textLight: document.getElementById("corTextLight").value,
        border: document.getElementById("corBorder").value,
        danger: document.getElementById("corDanger").value
    };

    aplicarCoresLocalmente(tema);

    try {
        await salvarTemaBackend(tema);
        alert("Tema personalizado salvo com sucesso.");
    } catch (erro) {
        alert(erro.message);
    }
});

function aplicarCoresLocalmente(tema) {
    if (typeof window.aplicarCores === "function") {
        window.aplicarCores(tema);
    }
}

async function salvarTemaBackend(tema) {
    try {
        await api(`/tema/atualizar/${usuarioLogado.empresaId}`, {
            method: "PUT",
            body: JSON.stringify(tema)
        });
    } catch (erro) {
        if (erro.message.includes("Tema não encontrado")) {
            await api("/tema/cadastrar", {
                method: "POST",
                body: JSON.stringify({
                    empresaId: usuarioLogado.empresaId,
                    ...tema
                })
            });
            return;
        }

        throw erro;
    }
}

let denuncias = [];
let filtroDenuncia = "todas";
let denunciaSelecionada = null;

async function carregarDenuncias() {
    const container = document.getElementById("listaDenuncias");

    container.innerHTML = `<div class="empty-state">Carregando denúncias...</div>`;

    try {
        const [denunciasPublicacoes, denunciasComentarios] = await Promise.all([
            api("/denuncias-publicacao/listar"),
            api("/denuncias-comentario/listar")
        ]);

        denuncias = [
            ...denunciasPublicacoes.map(denuncia => ({
                ...denuncia,
                tipo: "publicacao"
            })),
            ...denunciasComentarios.map(denuncia => ({
                ...denuncia,
                tipo: "comentario"
            }))
        ];

        denuncias.sort((a, b) => new Date(b.dataDenuncia) - new Date(a.dataDenuncia));

        atualizarContadorDenuncias();
        renderizarDenuncias();
    } catch (erro) {
        console.error(erro);

        container.innerHTML = `
            <div class="empty-state">
                <strong>Não foi possível carregar as denúncias.</strong>
                <span>${esc(erro.message)}</span>
            </div>
        `;
    }
}

function atualizarContadorDenuncias() {
    contadorDenuncias.textContent = denuncias.length;
}

function renderizarDenuncias() {
    const container = document.getElementById("listaDenuncias");

    let lista = denuncias;

    if (filtroDenuncia !== "todas") {
        lista = denuncias.filter(denuncia => denuncia.tipo === filtroDenuncia);
    }

    if (!lista.length) {
        container.innerHTML = `
            <div class="empty-state">
                <strong>Nenhuma denúncia encontrada.</strong>
                <span>Não existem denúncias neste filtro.</span>
            </div>
        `;
        return;
    }

    container.innerHTML = lista.map(denuncia => {
        const motivo = denuncia.motivo || "Sem motivo informado";
        const autor = denuncia.usuario?.nome || "Usuário";

        let conteudo = "";

        if (denuncia.tipo === "publicacao") {
            conteudo = denuncia.publicacao?.texto || "Publicação sem texto.";
        } else {
            conteudo = denuncia.comentario?.texto || "Comentário sem texto.";
        }

        const data = denuncia.dataDenuncia ? new Date(denuncia.dataDenuncia).toLocaleString("pt-BR") : "-";

        return `
            <article class="denuncia-card">
                <div class="denuncia-info">
                    <span class="denuncia-type">${denuncia.tipo === "publicacao" ? "Publicação" : "Comentário"}</span>
                    <h3>${esc(motivo)}</h3>
                    <p>${esc(limitarTexto(conteudo, 180))}</p>
                    <div class="denuncia-meta">
                        Denunciado por <strong>${esc(autor)}</strong> · ${data}
                    </div>
                </div>
                <button class="denuncia-action" onclick="analisarDenuncia(${denuncia.id}, '${denuncia.tipo}')">Analisar</button>
            </article>
        `;
    }).join("");
}

document.querySelectorAll(".denuncia-tab").forEach(botao => {
    botao.addEventListener("click", () => {
        document.querySelectorAll(".denuncia-tab").forEach(item => item.classList.remove("ativo"));
        botao.classList.add("ativo");
        filtroDenuncia = botao.dataset.tipo;
        renderizarDenuncias();
    });
});

async function analisarDenuncia(id, tipo) {
    try {
        const endpoint = tipo === "publicacao"
            ? `/denuncias-publicacao/buscar/${id}`
            : `/denuncias-comentario/buscar/${id}`;

        const denuncia = await api(endpoint);

        denuncia.tipo = tipo;
        denunciaSelecionada = denuncia;

        const conteudo = tipo === "publicacao"
            ? denuncia.publicacao?.texto
            : denuncia.comentario?.texto;

        const usuario = denuncia.usuario?.nome || "Usuário";

        document.getElementById("detalhesDenuncia").innerHTML = `
            <div class="denuncia-detail">
                <strong>Tipo</strong>
                <p>${tipo === "publicacao" ? "Publicação" : "Comentário"}</p>
            </div>
            <div class="denuncia-detail">
                <strong>Motivo da denúncia</strong>
                <p>${esc(denuncia.motivo)}</p>
            </div>
            <div class="denuncia-detail">
                <strong>Denunciado por</strong>
                <p>${esc(usuario)}</p>
            </div>
            <div class="denuncia-detail">
                <strong>Conteúdo denunciado</strong>
                <p>${esc(conteudo || "Conteúdo não disponível.")}</p>
            </div>
        `;

        document.getElementById("modalDenuncia").classList.add("aberto");
    } catch (erro) {
        alert(erro.message);
    }
}

document.getElementById("btnAceitarDenuncia").addEventListener("click", async () => {
    if (!denunciaSelecionada) return;

    const confirmar = confirm("Aceitar esta denúncia irá excluir o conteúdo denunciado. Deseja continuar?");

    if (!confirmar) return;

    try {
        if (denunciaSelecionada.tipo === "publicacao") {
            await api(`/publicacoes/excluir/${denunciaSelecionada.publicacaoId}`, {
                method: "DELETE"
            });

            await api(`/denuncias-publicacao/excluir/${denunciaSelecionada.id}`, {
                method: "DELETE"
            });
        }

        if (denunciaSelecionada.tipo === "comentario") {
            await api(`/comentarios/${denunciaSelecionada.comentarioId}`, {
                method: "DELETE"
            });

            await api(`/denuncias-comentario/excluir/${denunciaSelecionada.id}`, {
                method: "DELETE"
            });
        }

        alert("Denúncia aceita. O conteúdo foi excluído.");
        fecharModalDenuncia();
        carregarDenuncias();
    } catch (erro) {
        alert("Não foi possível aceitar a denúncia: " + erro.message);
    }
});

document.getElementById("btnRecusarDenuncia").addEventListener("click", async () => {
    if (!denunciaSelecionada) return;

    const confirmar = confirm("Deseja recusar esta denúncia? O conteúdo permanecerá na plataforma.");

    if (!confirmar) return;

    try {
        const endpoint = denunciaSelecionada.tipo === "publicacao"
            ? `/denuncias-publicacao/excluir/${denunciaSelecionada.id}`
            : `/denuncias-comentario/excluir/${denunciaSelecionada.id}`;

        await api(endpoint, {
            method: "DELETE"
        });

        alert("Denúncia recusada.");
        fecharModalDenuncia();
        carregarDenuncias();
    } catch (erro) {
        alert(erro.message);
    }
});

function fecharModalDenuncia() {
    document.getElementById("modalDenuncia").classList.remove("aberto");
    denunciaSelecionada = null;
}

document.getElementById("fecharModalDenuncia").addEventListener("click", fecharModalDenuncia);

document.getElementById("btnSair").addEventListener("click", () => {
    const confirmar = confirm("Deseja realmente sair?");

    if (!confirmar) return;

    localStorage.removeItem("token");
    window.location.href = "../html/configuracoes.html";
});

function esc(valor) {
    if (valor === null || valor === undefined) return "";

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function limitarTexto(texto, limite) {
    if (!texto) return "";
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + "...";
}

async function iniciarAdmin() {
    carregarAdministrador();
    await carregarEmpresa();
    await carregarDenuncias();
}

iniciarAdmin();