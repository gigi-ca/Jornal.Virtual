// ============================================
// ELEMENTOS
// ============================================

const form = document.getElementById("formNoticia");

const titulo = document.getElementById("titulo");
const categoria = document.getElementById("categoria");
const autor = document.getElementById("autor");
const imagem = document.getElementById("imagem");
const resumo = document.getElementById("resumo");
const conteudo = document.getElementById("conteudo");

const contadorTitulo =
    document.getElementById("contadorTitulo");

const contadorResumo =
    document.getElementById("contadorResumo");

const previewTitulo =
    document.getElementById("previewTitulo");

const previewCategoria =
    document.getElementById("previewCategoria");

const previewAutor =
    document.getElementById("previewAutor");

const previewResumo =
    document.getElementById("previewResumo");

const previewFoto =
    document.getElementById("previewFoto");

const previewImagem =
    document.getElementById("previewImagem");

const mensagem =
    document.getElementById("mensagem");


// ============================================
// PRÉ-VISUALIZAÇÃO DO TÍTULO
// ============================================

titulo.addEventListener("input", function () {

    contadorTitulo.textContent =
        this.value.length;

    previewTitulo.textContent =
        this.value || "Título da notícia";

});


// ============================================
// PRÉ-VISUALIZAÇÃO DO RESUMO
// ============================================

resumo.addEventListener("input", function () {

    contadorResumo.textContent =
        this.value.length;

    previewResumo.textContent =
        this.value ||
        "O resumo da notícia aparecerá aqui.";

});


// ============================================
// PRÉ-VISUALIZAÇÃO DA CATEGORIA
// ============================================

categoria.addEventListener("change", function () {

    previewCategoria.textContent =
        this.value || "Categoria";

});


// ============================================
// PRÉ-VISUALIZAÇÃO DO AUTOR
// ============================================

autor.addEventListener("input", function () {

    previewAutor.textContent =
        this.value || "Autor";

});


// ============================================
// PRÉ-VISUALIZAÇÃO DA IMAGEM
// ============================================

imagem.addEventListener("change", function () {

    const arquivo = this.files[0];

    if (!arquivo) {
        return;
    }

    if (!arquivo.type.startsWith("image/")) {

        alert("Selecione uma imagem válida.");

        this.value = "";

        return;
    }

    const leitor = new FileReader();

    leitor.onload = function (event) {

        const imagemBase64 =
            event.target.result;

        // Preview abaixo do upload

        previewImagem.innerHTML = `
            <img src="${imagemBase64}" alt="Imagem da notícia">
        `;

        previewImagem.style.display = "block";


        // Preview do card

        previewFoto.innerHTML = `
            <img src="${imagemBase64}" alt="Imagem da notícia">
        `;

    };

    leitor.readAsDataURL(arquivo);

});


// ============================================
// PUBLICAR NOTÍCIA
// ============================================

form.addEventListener("submit", function (event) {

    event.preventDefault();


    // Verificar campos obrigatórios

    if (
        !titulo.value.trim() ||
        !categoria.value ||
        !autor.value.trim() ||
        !resumo.value.trim() ||
        !conteudo.value.trim()
    ) {

        alert(
            "Preencha todos os campos obrigatórios."
        );

        return;
    }


    // Verificar imagem

    const arquivo =
        imagem.files[0];


    if (arquivo) {

        const leitor =
            new FileReader();


        leitor.onload = function (event) {

            salvarNoticia(
                event.target.result
            );

        };


        leitor.readAsDataURL(arquivo);

    } else {

        salvarNoticia("");

    }

});


// ============================================
// SALVAR NOTÍCIA
// ============================================

function salvarNoticia(imagemBase64) {

    // Pegar notícias já existentes

    let noticias =
        JSON.parse(
            localStorage.getItem("noticias")
        ) || [];


    // Criar nova notícia

    const novaNoticia = {

        id: Date.now(),

        titulo:
            titulo.value.trim(),

        categoria:
            categoria.value,

        autor:
            autor.value.trim(),

        resumo:
            resumo.value.trim(),

        conteudo:
            conteudo.value.trim(),

        imagem:
            imagemBase64,

        data:
            new Date().toLocaleDateString("pt-BR")

    };


    // Adicionar a nova notícia
    // sem apagar as anteriores

    noticias.push(novaNoticia);


    // Salvar novamente

    localStorage.setItem(
        "noticias",
        JSON.stringify(noticias)
    );


    // Mostrar mensagem

    mostrarMensagem();


    // Limpar formulário

    form.reset();


    // Resetar contadores

    contadorTitulo.textContent = "0";

    contadorResumo.textContent = "0";


    // Resetar preview

    previewTitulo.textContent =
        "Título da notícia";

    previewCategoria.textContent =
        "Categoria";

    previewAutor.textContent =
        "Autor";

    previewResumo.textContent =
        "O resumo da notícia aparecerá aqui.";


    previewImagem.style.display =
        "none";

    previewImagem.innerHTML =
        "";


    previewFoto.innerHTML = `
        <i class="fa-solid fa-image"></i>
        <span>Sua imagem aparecerá aqui</span>
    `;

}


// ============================================
// MENSAGEM DE SUCESSO
// ============================================

function mostrarMensagem() {

    mensagem.classList.add("mostrar");


    setTimeout(function () {

        mensagem.classList.remove("mostrar");

    }, 3000);

}