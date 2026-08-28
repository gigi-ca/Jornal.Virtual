const root = document.documentElement;

const temas = {

    Rosa: {
        primary: "#d81b60",
        primaryDark: "#ad1457",
        secondary: "#ff5b94",
        secondaryLight: "#ffadc9",
        background: "#fff0f5",
        surface: "#ffffff",
        text: "#3b0a1b",
        textLight: "#8a5268",
        border: "#f3b6ca",
        danger: "#d32f2f"
    },

    AzulEscuro: {
        primary: "#1e3a8a",
        primaryDark: "#172554",
        secondary: "#3b82f6",
        secondaryLight: "#93c5fd",
        background: "#eff6ff",
        surface: "#ffffff",
        text: "#1e293b",
        textLight: "#64748b",
        border: "#bfdbfe",
        danger: "#dc2626"
    },

    Verde: {
        primary: "#2e7d32",
        primaryDark: "#1b5e20",
        secondary: "#66bb6a",
        secondaryLight: "#a5d6a7",
        background: "#f1f8e9",
        surface: "#ffffff",
        text: "#1b4332",
        textLight: "#52796f",
        border: "#c8e6c9",
        danger: "#d32f2f"
    },

    Marrom: {
        primary: "#6f4e37",
        primaryDark: "#4a2f21",
        secondary: "#d9b382",
        secondaryLight: "#ead2b3",
        background: "#fffaf5",
        surface: "#ffffff",
        text: "#2f241f",
        textLight: "#6f625b",
        border: "#dfc8b0",
        danger: "#b3261e"
    },

    Cinza: {
        primary: "#616161",
        primaryDark: "#424242",
        secondary: "#9e9e9e",
        secondaryLight: "#d6d6d6",
        background: "#f5f5f5",
        surface: "#ffffff",
        text: "#212121",
        textLight: "#757575",
        border: "#d6d6d6",
        danger: "#d32f2f"
    },

    Laranja: {
        primary: "#ef6c00",
        primaryDark: "#e65100",
        secondary: "#ffb74d",
        secondaryLight: "#ffcc80",
        background: "#fff8f1",
        surface: "#ffffff",
        text: "#4e342e",
        textLight: "#795548",
        border: "#ffcc80",
        danger: "#d84315"
    },

    RosaClaro: {
        primary: "#ec407a",
        primaryDark: "#d81b60",
        secondary: "#f48fb1",
        secondaryLight: "#f8bbd0",
        background: "#fff0f6",
        surface: "#ffffff",
        text: "#4a1831",
        textLight: "#8e526d",
        border: "#f8bbd0",
        danger: "#d32f2f"
    },

    Amarelo: {
        primary: "#f9a825",
        primaryDark: "#f57f17",
        secondary: "#ffd54f",
        secondaryLight: "#ffe082",
        background: "#fffde7",
        surface: "#ffffff",
        text: "#5d4037",
        textLight: "#795548",
        border: "#ffe082",
        danger: "#c62828"
    },

    Roxo: {
        primary: "#7b1fa2",
        primaryDark: "#4a148c",
        secondary: "#ba68c8",
        secondaryLight: "#ce93d8",
        background: "#f8f0ff",
        surface: "#ffffff",
        text: "#311b92",
        textLight: "#6a4c93",
        border: "#e1bee7",
        danger: "#c62828"
    },

    Vinho: {
        primary: "#8e2430",
        primaryDark: "#5d1020",
        secondary: "#c85a6b",
        secondaryLight: "#df9ba6",
        background: "#fff5f5",
        surface: "#ffffff",
        text: "#3b0d16",
        textLight: "#75434c",
        border: "#e8b8bf",
        danger: "#b71c1c"
    },

    Azul: {
        primary: "#1565c0",
        primaryDark: "#0d47a1",
        secondary: "#42a5f5",
        secondaryLight: "#90caf9",
        background: "#eef6ff",
        surface: "#ffffff",
        text: "#0f172a",
        textLight: "#64748b",
        border: "#bbdefb",
        danger: "#d32f2f"
    },

    VerdeAgua: {
        primary: "#009688",
        primaryDark: "#00695c",
        secondary: "#4dd0e1",
        secondaryLight: "#80deea",
        background: "#e8f8f7",
        surface: "#ffffff",
        text: "#134e4a",
        textLight: "#527a78",
        border: "#b2dfdb",
        danger: "#d32f2f"
    }

};

function aplicarCores(cores) {

    if (!cores) {
        console.error("Nenhuma cor foi informada.");
        return;
    }

    const propriedades = [
        "primary",
        "primaryDark",
        "secondary",
        "secondaryLight",
        "background",
        "surface",
        "text",
        "textLight",
        "border",
        "danger"
    ];

    propriedades.forEach(propriedade => {

        if (cores[propriedade]) {

            root.style.setProperty(
                `--${propriedade}`,
                cores[propriedade]
            );

        }

    });
}

function aplicarTema(nomeTema) {

    const tema = temas[nomeTema];

    if (!tema) {

        console.error(
            "Tema não encontrado:",
            nomeTema
        );

        return false;
    }

    aplicarCores(tema);

    return true;
}

async function carregarTema(empresaId) {

    try {

        if (!empresaId) {

            console.error(
                "empresaId não informado."
            );

            aplicarTema("rosa");

            return;
        }

        const resposta = await fetch(
            `/tema/buscar/${empresaId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (!resposta.ok) {

            throw new Error(
                "Tema não encontrado."
            );

        }

        const dados = await resposta.json();

        /*
        O controller retorna:

        {
            id,
            primary,
            primaryDark,
            ...
            empresa: {...}
        }
        */

        aplicarCores(dados);

    } catch (erro) {

        console.error(
            "Erro ao carregar tema:",
            erro
        );

        aplicarTema("rosa");
    }
}

window.temas = temas;
window.aplicarTema = aplicarTema;
window.aplicarCores = aplicarCores;
window.carregarTema = carregarTema;