const modal = document.querySelector("#modal");
const form = document.querySelector("#formNoticia");
const noticiasContainer = document.querySelector("#noticias");

let noticias = JSON.parse(localStorage.getItem("noticias")) || [];

renderizarNoticias();


function abrirModal(){
modal.style.display="block";
}

function fecharModal(){
modal.style.display="none";
}


form.addEventListener("submit", function(e){

e.preventDefault();

const imagemInput = document.querySelector("#imagem").files[0];
const titulo = document.querySelector("#titulo").value;
const autor = document.querySelector("#autor").value;
const data = document.querySelector("#data").value;
const texto = document.querySelector("#texto").value;

const leitor = new FileReader();

leitor.onload = function(){

const noticia = {

imagem: leitor.result,
titulo: titulo,
autor: autor,
data: data,
texto: texto

};

noticias.push(noticia);

localStorage.setItem("noticias", JSON.stringify(noticias));

renderizarNoticias();

form.reset();

fecharModal();

}

if(imagemInput){
leitor.readAsDataURL(imagemInput);
}

});


function renderizarNoticias(){

noticiasContainer.innerHTML="";

noticias.forEach((n, indice) =>{

noticiasContainer.innerHTML += `

<div class="card">

<img src="${n.imagem}">

<h3>${n.titulo}</h3>

<p>${n.texto}</p>

<small>${n.autor} - ${n.data}</small>

<button class="btn-excluir" onclick="excluirNoticia(${indice})">Excluir</button>

</div>

`;

});

}

function excluirNoticia(indice){

if(confirm("Tem certeza que deseja excluir esta notícia?")){

noticias.splice(indice, 1);

localStorage.setItem("noticias", JSON.stringify(noticias));

renderizarNoticias();

}

}