const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    try {

        if (req.user.tipo !== "ADMINISTRADOR") {
            return res.status(403).json({
                mensagem: "Somente administradores podem cadastrar empresas."
            });
        }

        const { nome, logo, dominio } = req.body;

        if (!nome) {
            return res.status(400).json({
                mensagem: "Nome da empresa é obrigatório."
            });
        }

        const empresaExistente = await prisma.empresa.findFirst({
            where: {
                nome
            }
        });

        if (empresaExistente) {
            return res.status(400).json({
                mensagem: "Já existe uma empresa com esse nome."
            });
        }

        const empresa = await prisma.empresa.create({
            data: {
                nome,
                logo,
                dominio
            }
        });

        return res.status(201).json({
            mensagem: "Empresa cadastrada com sucesso.",
            empresa
        });

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao cadastrar empresa.",
            erro: erro.message
        });

    }
};

const listar = async (req, res) => {
    try {

        const empresas = await prisma.empresa.findMany({
            include: {
                usuarios: true
            },
            orderBy: {
                nome: "asc"
            }
        });

        return res.status(200).json(empresas);

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao listar empresas.",
            erro: erro.message
        });

    }
};

const buscar = async (req, res) => {
    try {

        const empresa = await prisma.empresa.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                usuarios: true,
                publicacoes: true,
                noticias: true,
                hashtags: true
            }
        });

        if (!empresa) {
            return res.status(404).json({
                mensagem: "Empresa não encontrada."
            });
        }

        return res.status(200).json(empresa);

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao buscar empresa.",
            erro: erro.message
        });

    }
};

const atualizar = async (req, res) => {
    try {

        if (req.user.tipo !== "ADMINISTRADOR") {
            return res.status(403).json({
                mensagem: "Somente administradores podem atualizar empresas."
            });
        }

        const empresa = await prisma.empresa.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!empresa) {
            return res.status(404).json({
                mensagem: "Empresa não encontrada."
            });
        }

        const empresaAtualizada = await prisma.empresa.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });

        return res.status(200).json({
            mensagem: "Empresa atualizada com sucesso.",
            empresa: empresaAtualizada
        });

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao atualizar empresa.",
            erro: erro.message
        });

    }
};

const excluir = async (req, res) => {
    try {

        if (req.user.tipo !== "ADMINISTRADOR") {
            return res.status(403).json({
                mensagem: "Somente administradores podem excluir empresas."
            });
        }

        const empresa = await prisma.empresa.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!empresa) {
            return res.status(404).json({
                mensagem: "Empresa não encontrada."
            });
        }

        await prisma.empresa.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        return res.status(200).json({
            mensagem: "Empresa excluída com sucesso."
        });

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao excluir empresa.",
            erro: erro.message
        });

    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};