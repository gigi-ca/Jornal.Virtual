// ======================================================
// MODAL DE NOTÍCIA
// ======================================================

const modal = document.querySelector(".modal");
const fechar = document.querySelector(".close");

function fecharModal() {
    modal.classList.remove("ativo");
    document.body.style.overflow = "";
}

fechar.addEventListener("click", fecharModal);

modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        fecharModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        fecharModal();
    }
});


// ======================================================
// CARREGAR NOTÍCIAS SALVAS
// ======================================================

let noticias = JSON.parse(
    localStorage.getItem("noticias")
) || [];


// ======================================================
// ELEMENTOS
// ======================================================

const cardsContainer = document.querySelector(".cards");

const pesquisa = document.querySelector(".input-search input");

const banner = document.querySelector(".banner");

const tituloBanner = document.querySelector(".banner-info h1");

const descricaoBanner = document.querySelector(".banner-info p");

const categoriaBanner = document.querySelector(".banner-info .tag");

const botaoAnterior = document.querySelector(".arrow.left");

const botaoProximo = document.querySelector(".arrow.right");

const botaoLerMais = document.querySelector(".btn-banner");


// ======================================================
// CARROSSEL
// ======================================================

let indiceAtual = 0;


// Mostrar notícia no carrossel
function atualizarCarrossel() {

    if (noticias.length === 0) {

        tituloBanner.textContent =
            "Nenhuma notícia publicada";

        descricaoBanner.textContent =
            "Publique uma notícia para que ela apareça aqui.";

        categoriaBanner.textContent =
            "JORNAL ONLINE";

        banner.style.backgroundImage = `
            linear-gradient(
                90deg,
                rgba(65, 7, 30, 0.90) 0%,
                rgba(65, 7, 30, 0.65) 40%,
                rgba(65, 7, 30, 0.10) 100%
            ),
            url("../img/banner.jpg")
        `;

        return;
    }


    const noticia = noticias[indiceAtual];


    tituloBanner.textContent =
        noticia.titulo;

    descricaoBanner.textContent =
        noticia.resumo;

    categoriaBanner.textContent =
        noticia.categoria;


    const imagem =
        noticia.imagem || "../img/banner.jpg";


    banner.style.backgroundImage = `
        linear-gradient(
            90deg,
            rgba(65, 7, 30, 0.90) 0%,
            rgba(65, 7, 30, 0.65) 40%,
            rgba(65, 7, 30, 0.10) 100%
        ),
        url("${imagem}")
    `;
}


// ======================================================
// PRÓXIMA NOTÍCIA
// ======================================================

botaoProximo.addEventListener("click", function () {

    if (noticias.length === 0) return;

    indiceAtual++;

    if (indiceAtual >= noticias.length) {
        indiceAtual = 0;
    }

    atualizarCarrossel();

});


// ======================================================
// NOTÍCIA ANTERIOR
// ======================================================

botaoAnterior.addEventListener("click", function () {

    if (noticias.length === 0) return;

    indiceAtual--;

    if (indiceAtual < 0) {
        indiceAtual = noticias.length - 1;
    }

    atualizarCarrossel();

});


// ======================================================
// CARROSSEL AUTOMÁTICO
// ======================================================

setInterval(function () {

    if (noticias.length === 0) return;

    indiceAtual++;

    if (indiceAtual >= noticias.length) {
        indiceAtual = 0;
    }

    atualizarCarrossel();

}, 6000);


// ======================================================
// CRIAR CARDS DAS NOTÍCIAS PUBLICADAS
// ======================================================

function carregarNoticias() {

    // Limpa os cards padrões do HTML
    cardsContainer.innerHTML = "";


    // Se não houver notícias
    if (noticias.length === 0) {

        cardsContainer.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
                color: #777;
            ">
                <i class="fa-solid fa-newspaper"
                   style="
                       font-size: 40px;
                       color: #c62a63;
                       margin-bottom: 15px;
                   ">
                </i>

                <h3>
                    Nenhuma notícia publicada
                </h3>

                <p>
                    Crie uma notícia para ela aparecer aqui.
                </p>
            </div>
        `;

        return;
    }


    noticias.forEach(function (noticia) {

        const card = document.createElement("div");

        card.classList.add("card");


        const imagem =
            noticia.imagem || "../img/banner.jpg";


        card.innerHTML = `

            <img
                src="${imagem}"
                alt="${noticia.titulo}"
            >

            <div class="card-body">

                <span class="categoria">
                    ${noticia.categoria}
                </span>

                <h3>
                    ${noticia.titulo}
                </h3>

                <p>
                    ${noticia.resumo}
                </p>

                <div class="buttons">

                    <button
                        class="visualizar"
                        type="button"
                    >

                        <i class="fa-solid fa-eye"></i>

                        Visualizar

                    </button>

                    <button
                        class="excluir"
                        type="button"
                    >

                        <i class="fa-solid fa-trash"></i>

                        Excluir

                    </button>

                </div>

            </div>

        `;


        cardsContainer.appendChild(card);


        // ==================================================
        // VISUALIZAR
        // ==================================================

        const visualizar =
            card.querySelector(".visualizar");


        visualizar.addEventListener("click", function () {

            const imagemModal =
                modal.querySelector(".modal-content > img");

            const categoriaModal =
                modal.querySelector(".modal-body .categoria");

            const tituloModal =
                modal.querySelector(".modal-body h2");

            const autorModal =
                modal.querySelector(".modal-body .autor");

            const textosModal =
                modal.querySelectorAll(
                    ".modal-body > p:not(.autor)"
                );


            imagemModal.src =
                imagem;

            categoriaModal.textContent =
                noticia.categoria;

            tituloModal.textContent =
                noticia.titulo;

            autorModal.innerHTML = `
                <i class="fa-solid fa-user"></i>
                ${noticia.autor}
                •
                ${noticia.data}
            `;


            if (textosModal[0]) {
                textosModal[0].textContent =
                    noticia.conteudo;
            }


            if (textosModal[1]) {
                textosModal[1].textContent = "";
            }


            modal.classList.add("ativo");

            document.body.style.overflow = "hidden";

        });


        // ==================================================
        // EXCLUIR
        // ==================================================

        const excluir =
            card.querySelector(".excluir");


        excluir.addEventListener("click", function () {

            const confirmar = confirm(
                "Deseja realmente excluir esta notícia?"
            );


            if (!confirmar) {
                return;
            }


            noticias =
                noticias.filter(function (item) {

                    return item.id !== noticia.id;

                });


            localStorage.setItem(
                "noticias",
                JSON.stringify(noticias)
            );


            carregarNoticias();


            indiceAtual = 0;

            atualizarCarrossel();

        });

    });

}


// ======================================================
// PESQUISA
// ======================================================

pesquisa.addEventListener("input", function () {

    const texto =
        this.value.toLowerCase().trim();


    const cards =
        document.querySelectorAll(".card");


    cards.forEach(function (card) {

        const titulo =
            card.querySelector("h3")
                .textContent
                .toLowerCase();


        const resumo =
            card.querySelector("p")
                .textContent
                .toLowerCase();


        const categoria =
            card.querySelector(".categoria")
                .textContent
                .toLowerCase();


        if (
            titulo.includes(texto) ||
            resumo.includes(texto) ||
            categoria.includes(texto)
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

});


// ======================================================
// BOTÃO LER MAIS
// ======================================================

botaoLerMais.addEventListener("click", function () {

    if (noticias.length === 0) {
        return;
    }


    const noticia =
        noticias[indiceAtual];


    const imagemModal =
        modal.querySelector(".modal-content > img");

    const categoriaModal =
        modal.querySelector(".modal-body .categoria");

    const tituloModal =
        modal.querySelector(".modal-body h2");

    const autorModal =
        modal.querySelector(".modal-body .autor");

    const textosModal =
        modal.querySelectorAll(
            ".modal-body > p:not(.autor)"
        );


    imagemModal.src =
        noticia.imagem || "../img/banner.jpg";


    categoriaModal.textContent =
        noticia.categoria;


    tituloModal.textContent =
        noticia.titulo;


    autorModal.innerHTML = `
        <i class="fa-solid fa-user"></i>
        ${noticia.autor}
        •
        ${noticia.data}
    `;


    if (textosModal[0]) {
        textosModal[0].textContent =
            noticia.conteudo;
    }


    if (textosModal[1]) {
        textosModal[1].textContent = "";
    }


    modal.classList.add("ativo");

    document.body.style.overflow = "hidden";

});


// ======================================================
// INICIALIZAÇÃO
// ======================================================

carregarNoticias();

atualizarCarrossel();