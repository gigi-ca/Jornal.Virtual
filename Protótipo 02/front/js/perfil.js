const modal = document.getElementById("modalFundo");

const foto = document.getElementById("foto");
const nome = document.getElementById("nome");
const unidade = document.getElementById("unidade");
const descricao = document.getElementById("descricao");
const categoria = document.getElementById("categoria");

const inputFoto = document.getElementById("inputFoto");
const inputBanner = document.getElementById("inputBanner");
const inputDescricao = document.getElementById("inputDescricao");

function abrirModal(){
    modal.style.display = "flex";

    inputDescricao.value = descricao.innerText;
}

function fecharModal(){
    modal.style.display = "none";
}

window.onclick = function(event){

    if(event.target == modal){
        fecharModal();
    }

}

function salvarPerfil(){
    const fotoNova = inputFoto.value.trim();
    const bannerNovo = inputBanner.value.trim();
    const descricaoNova = inputDescricao.value.trim();
    if(fotoNova === "" && bannerNovo === "" && descricaoNova === ""){
        alert("Preencha pelo menos um campo para salvar as alterações.");
        return;
    }
    if(fotoNova !== ""){
        foto.src = fotoNova;
        localStorage.setItem("fotoPerfil", fotoNova);
    }
    if(bannerNovo !== ""){
        document.querySelector(".topo img").src = bannerNovo;
        localStorage.setItem("bannerPerfil", bannerNovo);
    }
    if(descricaoNova !== ""){
        descricao.innerText = descricaoNova;
        localStorage.setItem("descricaoPerfil", descricaoNova);
    }

    alert("Perfil atualizado com sucesso! ✅");

    fecharModal();
}