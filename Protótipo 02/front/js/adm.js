
let usuario = JSON.parse(localStorage.getItem("usuario")) || [];
let usuarioEditando = null;

function abrirModal() {
    document.getElementById("modal").style.display = "block";
}

function fecharModal() {
    document.getElementById("modal").style.display = "none";
    limparCampos();
    usuarioEditando = null;
}

function salvarUsuario() {
    const imagem = document.getElementById("inputImagem").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const ano = document.getElementById("ano").value;
    const nascimento = document.getElementById("nascimento").value;
    const RM = document.getElementById("RM").value;
    const tipo = document.getElementById("tipo").value.trim();

    if (!nome || !email || !senha) {
        alert("Preencha os campos obrigatórios!");
        return;
    }

    if (usuarioEditando !== null) {
        const index = usuario.findIndex(u => u.id === usuarioEditando);

        usuario[index] = {
            id: usuarioEditando,
            imagem,
            nome,
            email,
            senha,
            ano,
            nascimento,
            RM,
            tipo
        };

        usuarioEditando = null;

    } else {

        const existe = usuario.find(u => u.nome === nome);
        if (existe) {
            alert("Nome já cadastrado!");
            return;
        }

        const novoUsuario = {
            id: Date.now(),
            imagem,
            nome,
            email,
            senha,
            ano,
            nascimento,
            RM,
            tipo
        };

        usuario.push(novoUsuario);
    }

    atualizarLocalStorage();
    renderizarTabela();
    fecharModal();
}

function renderizarTabela() {
    const tabela = document.getElementById("cartao");

    tabela.innerHTML = "";

    usuario.forEach(u => {
        tabela.innerHTML += `
            <tr>
                <td><img src="${u.imagem}" width="60"></td>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.senha}</td>
                <td>${u.ano}</td>
                <td>${u.nascimento}</td>
                <td>${u.RM}</td>
                <td>${u.tipo}</td>
                <td>
                    <button onclick="editarUsuario(${u.id})">Editar</button>
                    <button onclick="excluirusuario(${u.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function editarUsuario(id) {
    const u = usuario.find(user => user.id === id);

    document.getElementById("inputImagem").value = u.imagem;
    document.getElementById("nome").value = u.nome;
    document.getElementById("email").value = u.email;
    document.getElementById("senha").value = u.senha;
    document.getElementById("ano").value = u.ano;
    document.getElementById("nascimento").value = u.nascimento;
    document.getElementById("RM").value = u.RM;
    document.getElementById("tipo").value = u.tipo;

    usuarioEditando = id;

    abrirModal();
}

function excluirusuario(id) {
    if (!confirm("Deseja excluir este usuário?")) return;

    usuario = usuario.filter(u => u.id !== id);

    atualizarLocalStorage();
    renderizarTabela();
}

function atualizarLocalStorage() {
    localStorage.setItem("usuario", JSON.stringify(usuario));
}

function limparCampos() {
    document.getElementById("inputImagem").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("ano").value = "";
    document.getElementById("nascimento").value = "";
    document.getElementById("RM").value = "";
    document.getElementById("tipo").value = "";
}

renderizarTabela();