const prisma = require("../data/prisma");
const jsonwebtoken = require("jsonwebtoken");
const crypto = require("crypto");


const Login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const senhahash = crypto.createHash('MD5').update(senha).digest('hex').toString();
        console.log(senhahash)
        const usuario = await prisma.usuarios.findUnique({
            where: { email, senha: senhahash }
        });

        if (!usuario) {
            return res.status(401).send({ message: 'E-mail or Password incorrect!' });
        }

        const token = jsonwebtoken.sign(
            {
                id: usuario.id,
                nome: usuario.nome,
                cargo: usuario.tipo
            },
            process.env.SECRET_JWT,
            { expiresIn: "120min" }
        );

        res.status(200).json({ token: token });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};


const cadastrar = async (req, res) => {
    let { nome, senha, email, tipo, imagem } = req.body;

    email = email.toLowerCase();

    if (!email.includes("@") || !email.includes(".") || !email.includes("portalsesisp")) {
        return res.status(400).json({ mensagem: "Email inválido" });
    }

    const existe = await prisma.usuarios.findUnique({
        where: { email }
    });

    if (existe) {
        return res.status(400).json({ mensagem: "Já existe usuario cadastrado com esse email" });
    }

    if (!tipo) {
        return res.status(400).json({ mensagem: "O tipo de usuário é obrigatório" });
    } else if (tipo !== "Aluno" && tipo !== "Verificado" && tipo !== "Administrador") { 
        return res.status(400).json({ mensagem: "Tipo inválido" });
    }

    if (senha.length < 4) {
        return res.status(400).json({ mensagem: "A senha deve ter no mínimo 4 caracteres" });
    }

    const senhahash = crypto.createHash('MD5')
        .update(senha)
        .digest('hex');

    const novoUsuario = await prisma.usuarios.create({
        data: {
            nome,
            senha: senhahash,
            email,
            tipo,
            imagem
        }
    });

    delete novoUsuario.senha;

    return res.status(201).json({
        mensagem: "Cadastro realizado com sucesso",
        Usuario: novoUsuario
    });
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
    try {
        const { id } = req.params;
        const { senha } = req.body;

        const dados = { ...req.body };

        if (senha) {
            dados.senha = crypto.createHash('MD5')
                .update(senha)
                .digest('hex');
        }

        const item = await prisma.usuarios.update({ 
            where: { id: Number(id) }, 
            data: dados
        }); 

        delete item.senha;
        
        return res.status(200).json(item);

    } catch (error) {
        return res.status(500).json({
            erro: "Erro ao atualizar usuário",
            detalhe: error.message
        });
    }
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.usuarios.delete({
        where: { id: Number(id) }
    });

    res.json(item).status(200).end();
};

module.exports = {
    Login,
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
}
