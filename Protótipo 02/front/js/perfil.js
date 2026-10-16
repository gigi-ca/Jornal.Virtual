const FOTO_PADRAO = "../img/avatar-padrao.png";
const TEMPLATE_PADRAO = "../img/template-padrao.png";

const modal = document.getElementById("modalFundo");

const foto = document.getElementById("foto");
const nome = document.getElementById("nome");
const rede = document.getElementById("rede");
const descricao = document.getElementById("descricao");
const categoria = document.getElementById("categoria");

const banner = document.querySelector(".topo img");

const inputFoto = document.getElementById("inputFoto");
const inputBanner = document.getElementById("inputBanner");
const inputDescricao = document.getElementById("inputDescricao");

const previewFoto = document.getElementById("previewFoto");
const previewBanner = document.getElementById("previewBanner");

const totalPublicacoes = document.getElementById("totalPublicacoes");
const totalComentarios = document.getElementById("totalComentarios");
const totalCurtidas = document.getElementById("totalCurtidas");

function obterUsuarioToken() {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        const partes = token.split(".");

        if (partes.length !== 3) return null;

        const payload = partes[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        return JSON.parse(
            decodeURIComponent(
                atob(payload)
                    .split("")
                    .map(c =>
                        "%" +
                        ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    )
                    .join("")
            )
        );
    } catch (erro) {
        console.error("Erro ao ler token:", erro);
        return null;
    }
}

function obterCaminhoImagem(caminho, padrao) {
    if (!caminho) return padrao;

    if (
        caminho.startsWith("http://") ||
        caminho.startsWith("https://")
    ) {
        return caminho;
    }

    return `${API_URL}/${caminho.replace(/^\/+/, "")}`;
}

function formatarTipo(tipo) {
    const tipos = {
        USUARIO: "Usuário",
        VERIFICADO: "Verificado",
        ADMINISTRADOR: "Administrador"
    };

    return tipos[tipo] || tipo || "Usuário";
}

async function carregarPerfil() {
    const token = localStorage.getItem("token");
    const usuarioToken = obterUsuarioToken();

    if (!token || !usuarioToken?.id) {
        window.location.href = "../login.html";
        return;
    }

    try {
        const resposta = await fetch(
            `${API_URL}/usuarios/buscar/${usuarioToken.id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem || "Erro ao carregar perfil."
            );
        }

        nome.textContent = dados.nome || "Usuário";

        descricao.textContent =
            dados.bio ||
            "Este usuário ainda não adicionou uma descrição.";

        categoria.textContent = formatarTipo(dados.tipo);

        rede.textContent =
            dados.empresa?.nome || "Não informado";

        foto.src = obterCaminhoImagem(
            dados.fotoPerfil,
            FOTO_PADRAO
        );

        banner.src = obterCaminhoImagem(
            dados.template,
            TEMPLATE_PADRAO
        );

        foto.onerror = () => {
            foto.src = FOTO_PADRAO;
        };

        banner.onerror = () => {
            banner.src = TEMPLATE_PADRAO;
        };

        prepararModal();

        await carregarEstatisticas(
            usuarioToken.id,
            token
        );

    } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);

        nome.textContent = "Não foi possível carregar";
        descricao.textContent =
            "Não foi possível carregar os dados do perfil.";
        categoria.textContent = "Usuário";
        rede.textContent = "Não informado";

        foto.src = FOTO_PADRAO;
        banner.src = TEMPLATE_PADRAO;
    }
}

async function carregarEstatisticas(usuarioId, token) {
    try {
        const resposta = await fetch(
            `${API_URL}/publicacoes/listar`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const publicacoes = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                publicacoes.mensagem ||
                "Erro ao carregar estatísticas."
            );
        }

        const minhasPublicacoes = publicacoes.filter(
            publicacao =>
                publicacao.autor?.id === usuarioId
        );

        let quantidadeComentarios = 0;
        let quantidadeCurtidas = 0;

        publicacoes.forEach(publicacao => {
            const comentarios = publicacao.comentarios || [];
            const curtidas = publicacao.curtidas || [];

            quantidadeComentarios += comentarios.filter(
                comentario =>
                    comentario.usuarioId === usuarioId
            ).length;

            quantidadeCurtidas += curtidas.filter(
                curtida =>
                    curtida.usuarioId === usuarioId
            ).length;
        });

        if (totalPublicacoes) {
            totalPublicacoes.textContent =
                minhasPublicacoes.length;
        }

        if (totalComentarios) {
            totalComentarios.textContent =
                quantidadeComentarios;
        }

        if (totalCurtidas) {
            totalCurtidas.textContent =
                quantidadeCurtidas;
        }

    } catch (erro) {
        console.error(
            "Erro ao carregar estatísticas:",
            erro
        );

        if (totalPublicacoes) {
            totalPublicacoes.textContent = "0";
        }

        if (totalComentarios) {
            totalComentarios.textContent = "0";
        }

        if (totalCurtidas) {
            totalCurtidas.textContent = "0";
        }
    }
}

function prepararModal() {
    inputDescricao.value =
        descricao.textContent !==
        "Este usuário ainda não adicionou uma descrição."
            ? descricao.textContent
            : "";

    previewFoto.src = foto.src;
    previewBanner.src = banner.src;
}

function abrirModal() {
    prepararModal();
    modal.style.display = "flex";
}

function fecharModal() {
    modal.style.display = "none";

    inputFoto.value = "";
    inputBanner.value = "";

    previewFoto.src = foto.src;
    previewBanner.src = banner.src;

    inputDescricao.value =
        descricao.textContent ===
        "Este usuário ainda não adicionou uma descrição."
            ? ""
            : descricao.textContent;
}

function mostrarPreview(input, preview) {
    const arquivo = input.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function(evento) {
        preview.src = evento.target.result;
    };

    leitor.readAsDataURL(arquivo);
}

inputFoto.addEventListener("change", () => {
    mostrarPreview(inputFoto, previewFoto);
});

inputBanner.addEventListener("change", () => {
    mostrarPreview(inputBanner, previewBanner);
});

async function salvarPerfil() {
    const token = localStorage.getItem("token");
    const usuarioToken = obterUsuarioToken();

    if (!token || !usuarioToken?.id) {
        alert("Sua sessão expirou. Faça login novamente.");
        window.location.href = "../login.html";
        return;
    }

    const descricaoNova = inputDescricao.value.trim();
    const fotoNova = inputFoto.files[0];
    const bannerNovo = inputBanner.files[0];

    const descricaoAtual =
        descricao.textContent ===
        "Este usuário ainda não adicionou uma descrição."
            ? ""
            : descricao.textContent;

    if (
        !fotoNova &&
        !bannerNovo &&
        descricaoNova === descricaoAtual
    ) {
        alert("Nenhuma alteração foi realizada.");
        return;
    }

    try {
        if (descricaoNova !== descricaoAtual) {
            const respostaDescricao = await fetch(
                `${API_URL}/usuarios/atualizar/${usuarioToken.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        bio: descricaoNova
                    })
                }
            );

            const dadosDescricao =
                await respostaDescricao.json();

            if (!respostaDescricao.ok) {
                throw new Error(
                    dadosDescricao.mensagem ||
                    "Erro ao atualizar descrição."
                );
            }
        }

        if (fotoNova) {
            const formDataFoto = new FormData();

            formDataFoto.append(
                "arquivo",
                fotoNova
            );

            const respostaFoto = await fetch(
                `${API_URL}/usuarios/foto-perfil`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formDataFoto
                }
            );

            const dadosFoto =
                await respostaFoto.json();

            if (!respostaFoto.ok) {
                throw new Error(
                    dadosFoto.mensagem ||
                    "Erro ao atualizar foto de perfil."
                );
            }
        }

        if (bannerNovo) {
            const formDataBanner = new FormData();

            formDataBanner.append(
                "arquivo",
                bannerNovo
            );

            const respostaBanner = await fetch(
                `${API_URL}/usuarios/template/${usuarioToken.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formDataBanner
                }
            );

            const dadosBanner =
                await respostaBanner.json();

            if (!respostaBanner.ok) {
                throw new Error(
                    dadosBanner.mensagem ||
                    "Erro ao atualizar template."
                );
            }
        }

        alert("Perfil atualizado com sucesso! ✅");

        fecharModal();

        await carregarPerfil();

    } catch (erro) {
        console.error(
            "Erro ao salvar perfil:",
            erro
        );

        alert(
            erro.message ||
            "Erro ao atualizar perfil."
        );
    }
}

window.onclick = function(event) {
    if (event.target === modal) {
        fecharModal();
    }
};

document.addEventListener(
    "DOMContentLoaded",
    carregarPerfil
);