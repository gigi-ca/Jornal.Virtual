const btnPublicar = document.getElementById("publicar");
const texto = document.getElementById("texto");
const listaPublicacoes = document.getElementById("listaPublicacoes");
const hashtagRegex = /#[^\s#.,!?:;()]+/g;

let publicacoes =
    JSON.parse(localStorage.getItem("publicacoes")) || [];

btnPublicar.addEventListener("click", criarPublicacao);

renderizarFeed();
atualizarNuvem();

function criarPublicacao(){

    const conteudo = texto.value.trim();

    if(!conteudo){
        alert("Digite algo.");
        return;
    }

    publicacoes.unshift({
        id: Date.now(),
        texto: conteudo,
        data: new Date().toLocaleString("pt-BR"),
        curtidas: 0,
        curtido: false
    });

    salvar();

    texto.value = "";

    renderizarFeed();
    atualizarNuvem();
}

function salvar(){
    localStorage.setItem(
        "publicacoes",
        JSON.stringify(publicacoes)
    );
}

function renderizarFeed(){

    listaPublicacoes.innerHTML = "";

    publicacoes.forEach(pub => {

        const div = document.createElement("div");

        div.className = "post";
        div.setAttribute("data-id", pub.id);

        const textoFormatado =
            pub.texto.replace(
                hashtagRegex,
                '<span class="hashtag">$&</span>'
            );

        div.innerHTML = `
            <div class="cabecalho-post">
                <div class="info-post">
                    <div class="data">${pub.data}</div>
                </div>
                <div class="menu-post">
                    <button class="btn-menu" onclick="toggleMenu(${pub.id})" aria-label="Menu">⋯</button>
                    <div class="dropdown-menu" id="menu-${pub.id}" style="display:none;">
                        <button class="btn-deletar" onclick="deletarPost(${pub.id})">Excluir</button>
                    </div>
                </div>
            </div>
            <div class="conteudo">${textoFormatado}</div>
            <div class="acoes">
                <button class="btn-curtir" onclick="curtirPost(${pub.id})" data-curtido="${pub.curtido}">
                    <span class="icon-curtida">${pub.curtido ? '❤️' : '🤍'}</span>
                    <span class="texto-curtida">${pub.curtidas} ${pub.curtidas === 1 ? 'curtida' : 'curtidas'}</span>
                </button>
            
            </div>
        `;

        listaPublicacoes.appendChild(div);

    });

}

function atualizarNuvem(){

    const contagem = {};

    publicacoes.forEach(pub => {

        const tags = pub.texto.match(hashtagRegex);

        if(tags){

            tags.forEach(tag => {

                tag = tag.toLowerCase();

                contagem[tag] =
                    (contagem[tag] || 0) + 1;

            });

        }

    }); 

    const lista = [];

    Object.entries(contagem).forEach(([tag,qtd])=>{

        lista.push([
            tag,
            15 + qtd * 12
        ]);

    });

    WordCloud(
        document.getElementById("nuvem"),
        {
            list: lista,

            gridSize: 10,

            weightFactor: 1,

            rotateRatio: 0.3,

            rotationSteps: 2,

            backgroundColor: "#ffffff",

            color: function(){
                const cores = [
                    "#ff2d55",
                    "#ff4d6d",
                    "#e91e63",
                    "#d81b60",
                    "#9c27b0"
                ];

                return cores[
                    Math.floor(
                        Math.random() * cores.length
                    )
                ];
            }
        }
    );

}

function toggleMenu(pubId){
    const menu = document.getElementById(`menu-${pubId}`);
    const isVisible = menu.style.display === "block";
    
    // Fechar todos os menus
    document.querySelectorAll(".dropdown-menu").forEach(m => {
        m.style.display = "none";
    });
    
    // Abrir o menu clicado se estava fechado
    if(!isVisible){
        menu.style.display = "block";
    }
}

function deletarPost(pubId){
    if(confirm("Tem certeza que deseja excluir este post?")){
        publicacoes = publicacoes.filter(pub => pub.id !== pubId);
        salvar();
        renderizarFeed();
        atualizarNuvem();
    }
}

function curtirPost(pubId){
    const pub = publicacoes.find(p => p.id === pubId);
    
    if(pub){
        pub.curtido = !pub.curtido;
        pub.curtidas += pub.curtido ? 1 : -1;
        salvar();
        renderizarFeed();
    }
}

// Fechar menu ao clicar fora
document.addEventListener("click", function(event){
    if(!event.target.closest(".menu-post")){
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            menu.style.display = "none";
        });
    }
});