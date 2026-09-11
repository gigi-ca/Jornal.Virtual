const form = document.getElementById("formNoticia");
const titulo = document.getElementById("titulo");
const categoria = document.getElementById("categoria");
const autor = document.getElementById("autor");
const imagem = document.getElementById("imagem");
const resumo = document.getElementById("resumo");
const conteudo = document.getElementById("conteudo");
const contadorTitulo = document.getElementById("contadorTitulo");
const contadorResumo = document.getElementById("contadorResumo");
const previewTitulo = document.getElementById("previewTitulo");
const previewCategoria = document.getElementById("previewCategoria");
const previewAutor = document.getElementById("previewAutor");
const previewResumo = document.getElementById("previewResumo");
const previewFoto = document.getElementById("previewFoto");
const previewImagem = document.getElementById("previewImagem");
const mensagem = document.getElementById("mensagem");

titulo.addEventListener("input", function () {
    contadorTitulo.textContent = this.value.length;
    previewTitulo.textContent = this.value || "Título da notícia";
});

resumo.addEventListener("input", function () {
    contadorResumo.textContent = this.value.length;
    previewResumo.textContent = this.value || "O resumo da notícia aparecerá aqui.";
});

categoria.addEventListener("change", function () {
    previewCategoria.textContent = this.value || "Categoria";
});

autor.addEventListener("input", function () {
    previewAutor.textContent = this.value || "Autor";
});

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
        const imagemBase64 = event.target.result;

        previewImagem.innerHTML = `
            <img src="${imagemBase64}" alt="Imagem da notícia">
        `;

        previewImagem.style.display = "block";

        previewFoto.innerHTML = `
            <img src="${imagemBase64}" alt="Imagem da notícia">
        `;
    };

    leitor.readAsDataURL(arquivo);
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (
        !titulo.value.trim() ||
        !categoria.value ||
        !autor.value.trim() ||
        !resumo.value.trim() ||
        !conteudo.value.trim()
    ) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const arquivo = imagem.files[0];

    if (arquivo) {
        const leitor = new FileReader();

        leitor.onload = function (event) {
            salvarNoticia(event.target.result);
        };

        leitor.readAsDataURL(arquivo);
    } else {
        salvarNoticia("");
    }
});

function salvarNoticia(imagemBase64) {
    let noticias = JSON.parse(localStorage.getItem("noticias")) || [];

    const novaNoticia = {
        id: Date.now(),
        titulo: titulo.value.trim(),
        categoria: categoria.value,
        autor: autor.value.trim(),
        resumo: resumo.value.trim(),
        conteudo: conteudo.value.trim(),
        imagem: imagemBase64,
        data: new Date().toLocaleDateString("pt-BR")
    };

    noticias.push(novaNoticia);

    localStorage.setItem("noticias", JSON.stringify(noticias));

    mostrarMensagem();

    form.reset();

    contadorTitulo.textContent = "0";
    contadorResumo.textContent = "0";

    previewTitulo.textContent = "Título da notícia";
    previewCategoria.textContent = "Categoria";
    previewAutor.textContent = "Autor";
    previewResumo.textContent = "O resumo da notícia aparecerá aqui.";

    previewImagem.style.display = "none";
    previewImagem.innerHTML = "";

    previewFoto.innerHTML = `
        <i class="fa-solid fa-image"></i>
        <span>Sua imagem aparecerá aqui</span>
    `;
}

function mostrarMensagem() {
    mensagem.classList.add("mostrar");

    setTimeout(function () {
        mensagem.classList.remove("mostrar");
    }, 3000);
}