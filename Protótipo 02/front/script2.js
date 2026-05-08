function editarPerfil(){

  let novoNome = prompt("Digite o nome:");
  let novaUnidade = prompt("Digite a unidade escolar:");
  let novaDescricao = prompt("Digite a descrição:");
  let novaCategoria = prompt("Digite a categoria:");
  let novaFoto = prompt("Cole o link da foto:");

  if(novoNome){
    document.getElementById("nome").innerHTML = novoNome;
  }

  if(novaUnidade){
    document.getElementById("unidade").innerHTML = novaUnidade;
  }

  if(novaDescricao){
    document.getElementById("descricao").innerHTML = novaDescricao;
  }

  if(novaCategoria){
    document.getElementById("categoria").innerHTML = novaCategoria;
  }

  if(novaFoto){
    document.getElementById("foto").src = novaFoto;
  }
}

// 🔥 ABRIR MODAL
function abrirModal(){
  document.getElementById("modalFundo").style.display = "flex";
}

// 🔥 FECHAR MODAL
function fecharModal(){
  document.getElementById("modalFundo").style.display = "none";
}

// 🔥 SALVAR DADOS DO MODAL
function salvarPerfil(){

  document.getElementById("nome").innerHTML =
  document.getElementById("inputNome").value;

  document.getElementById("unidade").innerHTML =
  document.getElementById("inputUnidade").value;

  document.getElementById("descricao").innerHTML =
  document.getElementById("inputDescricao").value;

  document.getElementById("categoria").innerHTML =
  document.getElementById("inputCategoria").value;

  document.getElementById("foto").src =
  document.getElementById("inputFoto").value;

  document.querySelector(".banner").src =
  document.getElementById("inputBanner").value;

  fecharModal();
}