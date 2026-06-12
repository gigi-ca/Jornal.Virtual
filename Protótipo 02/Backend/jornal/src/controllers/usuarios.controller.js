const prisma = require("../data/prisma");

const TIPOS_VALIDOS = ["ALUNO", "VERIFICADO", "ADMINISTRADOR"];

const cadastrar = async (req, res) => {
    try {
        let { nome, senha, email, tipo, imagem } = req.body;

        if (!nome || !senha || !email || !tipo) {
            return res.status(400).json({ mensagem: "Preencha todos os campos obrigatórios" });
        }

        email = email.toLowerCase();

        if (!email.includes("@") || !email.includes(".") || !email.includes("portalsesisp")) {
            return res.status(400).json({ mensagem: "Email inválido" });
        }

        const existe = await prisma.usuarios.findUnique({
            where: { email }
        });

        if (existe) {
            return res.status(400).json({ mensagem: "Já existe usuário com esse email" });
        }

        if (senha.length !== 4) {
            return res.status(400).json({ mensagem: "A senha deve ter 4 caracteres" });
        }

        const tipoFormatado = tipo.toUpperCase();

        if (!TIPOS_VALIDOS.includes(tipoFormatado)) {
            return res.status(400).json({ mensagem: "Tipo inválido" });
        }

        const novoUsuario = await prisma.usuarios.create({
            data: {
                nome,
                senha,
                email,
                tipo: tipoFormatado,
                imagem
            }
        });

        return res.status(201).json({
            mensagem: "Cadastro realizado com sucesso",
            usuario: novoUsuario
        });

    } catch (erro) {
        return res.status(500).json({ mensagem: "Erro ao cadastrar", erro });
    }
};

const listar = async (req, res) => {
    try {
        const lista = await prisma.usuarios.findMany();
        return res.status(200).json(lista);
    } catch (erro) {
        return res.status(500).json({ mensagem: "Erro ao listar usuários", erro });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await prisma.usuarios.findUnique({
            where: { id: Number(id) }
        });

        if (!item) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        return res.status(200).json(item);

    } catch (erro) {
        return res.status(500).json({ mensagem: "Erro ao buscar usuário", erro });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;

        const usuarioExiste = await prisma.usuarios.findUnique({
            where: { id: Number(id) }
        });

        if (!usuarioExiste) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        if (dados.tipo) {
            const tipoFormatado = dados.tipo.toUpperCase();

            if (!TIPOS_VALIDOS.includes(tipoFormatado)) {
                return res.status(400).json({ mensagem: "Tipo inválido" });
            }

            dados.tipo = tipoFormatado;
        }

        if (dados.senha && dados.senha.length !== 4) {
            return res.status(400).json({ mensagem: "A senha deve ter 4 caracteres" });
        }

        const item = await prisma.usuarios.update({
            where: { id: Number(id) },
            data: dados
        });

        return res.status(200).json(item);

    } catch (erro) {
        return res.status(500).json({ mensagem: "Erro ao atualizar usuário", erro });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        const usuarioExiste = await prisma.usuarios.findUnique({
            where: { id: Number(id) }
        });

        if (!usuarioExiste) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        await prisma.usuarios.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({ mensagem: "Usuário excluído com sucesso" });

    } catch (erro) {
        return res.status(500).json({ mensagem: "Erro ao excluir usuário", erro });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};