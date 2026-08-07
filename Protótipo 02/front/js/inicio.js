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

  <div class="card-actions">
    <button class="btn-ver-mais" data-indice="${indice}">Ver mais</button>
    <button class="btn-excluir" onclick="excluirNoticia(${indice})">Excluir</button>
  </div>

  </div>

  `;

  });

  initVerMais();

}

function initVerMais() {
  document.querySelectorAll('.btn-ver-mais').forEach(btn => {
    btn.addEventListener('click', () => {
      const indice = Number(btn.dataset.indice);
      const noticia = noticias[indice];
      if (noticia) {
        abrirNoticia(noticia);
      }
    });
  });
}

function abrirNoticia(noticia) {
  document.getElementById("tituloNoticia").innerText = noticia.titulo;
  document.getElementById("imgNoticia").src = noticia.imagem;
  document.getElementById("textoNoticia").innerText = noticia.texto;
  document.getElementById("infoNoticia").innerText = `${noticia.autor} - ${noticia.data}`;
  document.getElementById("modalNoticia").classList.add("ativo");
}

function excluirNoticia(indice){

if(confirm("Tem certeza que deseja excluir esta notícia?")){

noticias.splice(indice, 1);

localStorage.setItem("noticias", JSON.stringify(noticias));

renderizarNoticias();

}

}

/* Carrossel da seção Destaque */
let slideIndex = 0;
let slideInterval;

function mostrarSlide(index) {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  slideIndex = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === slideIndex);
  });
}

function mudaSlide(delta) {
  mostrarSlide(slideIndex + delta);
  reiniciarIntervalo();
}

function reiniciarIntervalo() {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => mostrarSlide(slideIndex + 1), 5000);
}

function initCarousel() {
  mostrarSlide(0);
  reiniciarIntervalo();
}

// Inicializa o carrossel após o carregamento do DOM
window.addEventListener('DOMContentLoaded', initCarousel);

function abrirNoticiaSlide(slide) {
  const titulo = slide.querySelector("h1").innerText;
  const imagem = slide.querySelector("img").src;
  const texto = slide.dataset.text || "Texto completo não disponível.";

  document.getElementById("tituloNoticia").innerText = titulo;
  document.getElementById("imgNoticia").src = imagem;
  document.getElementById("textoNoticia").innerText = texto;

  document.getElementById("modalNoticia").classList.add("ativo");
}

function fecharNoticia() {
  document.getElementById("modalNoticia").classList.remove("ativo");
}

// adiciona clique em todos os botões "Ler mais" nos slides
function initLerMais() {
  document.querySelectorAll('.slide .ler-mais').forEach(btn => {
    btn.addEventListener('click', () => {
      const slide = btn.closest('.slide');
      if (slide) abrirNoticiaSlide(slide);
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initLerMais();
});

function mostrarSenha() {
  const input = document.getElementById("senha");
  const icon = document.getElementById("toggleSenha");

  if (input.type === "password") {
    input.type = "text";
    icon.textContent = ""; // opcional: muda o ícone
  } else {
    input.type = "password";
    icon.textContent = "olho";
  }
}
