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
        texto: conteudo,
        data: new Date().toLocaleString("pt-BR")
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

        const textoFormatado =
            pub.texto.replace(
                hashtagRegex,
                '<span class="hashtag">$&</span>'
            );

        div.innerHTML = `
            <div class="data">${pub.data}</div>
            <div>${textoFormatado}</div>
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