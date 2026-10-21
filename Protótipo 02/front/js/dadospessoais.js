
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

async function carregarDadosPessoais() {
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
                dados.mensagem || "Erro ao carregar seus dados."
            );
        }

        document.getElementById("nomeUsuario").textContent =
            dados.nome || "Não informado";

        document.getElementById("emailUsuario").textContent =
            dados.email || "Não informado";

    } catch (erro) {
        console.error("Erro:", erro);

        document.getElementById("nomeUsuario").textContent =
            "Não foi possível carregar";

        document.getElementById("emailUsuario").textContent =
            "Não foi possível carregar";
    }
}

document.addEventListener("DOMContentLoaded", carregarDadosPessoais);