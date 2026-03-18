const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    let { nome, senha, email, tipo, imagem } = req.body;

    email = email.toLowerCase();
    if (!email.includes("@") || !email.includes(".") || !email.includes("portalsesisp")) {
        return res.status(400).json({ mensagem: "Email inválido" });
    }

    const existe = await prisma.Usuarios.findUnique({
        where: { email }
    });
    if (existe) {
        return res.status(400).json({ mensagem: "Já existe usuario cadastrado com esse email" });
    }

    if (!tipo) {
        return res.status(400).json({ mensagem: "O tipo de usuário é obrigatório" });
    } else if (tipo !== "Aluno" || tipo !== "Verificado" || tipo !== "Administrador") {
        return res.status(400).json({ mensagem: "Tipo invalído" })
    }

    if(tipo.length !== 4){
        return res.status(400).json({mensagem: "A senha deve ter 4 caracteres"});
    }

     const novoUsuario = await prisma.Usuarios.create({
        data: {
            nome,
            senha,
            email,
            tipo,
            imagem
        }
    });

    return res.status(201).json({mensagem: "Cadastro realizado com sucesso",Usuario: novoUsuario});
};

const listar = async (req, res) => {
    const lista = await prisma.usuarios.findMany();

    res.json(lista).status(200).end();
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.usuarios.findUnique({
        where: { id: Number(id) }
    });

    res.json(item).status(200).end();
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;

    const item = await prisma.usuarios.update({
        where: { id: Number(id) },
        data: dados
    });

    res.json(item).status(200).end();
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.usuarios.delete({
        where: { id: Number(id) }
    });

    res.json(item).status(200).end();
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
}
