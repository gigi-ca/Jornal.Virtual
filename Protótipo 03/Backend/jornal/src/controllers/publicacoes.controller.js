const prisma = require("../data/prisma");


const cadastrar = async (req, res) => {
    try {
        const { texto, hashtags } = req.body;
        const usuarioId = req.user.id;

        if (!texto && (!hashtags || hashtags.length === 0)) {
            return res.status(400).json({
                mensagem: "Publicação vazia"
            });
        }

        const publicacao = await prisma.publicacoes.create({
            data: {
                texto,
                usuarioId
            }
        });

        if (hashtags && hashtags.length > 0) {
            for (let nome of hashtags) {

                let tag = await prisma.hashtags.findUnique({
                    where: { nome }
                });

                if (!tag) {
                    tag = await prisma.hashtags.create({
                        data: { nome }
                    });
                }

                await prisma.publicacoes.update({
                    where: { id: publicacao.id },
                    data: {
                        hashtags: {
                            connect: { id: tag.id }
                        }
                    }
                });
            }
        }

        return res.status(201).json(publicacao);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao criar publicação",
            erro: erro.message
        });
    }
};


const listar = async (req, res) => {
    try {
        const lista = await prisma.publicacoes.findMany({
            orderBy: {
                id: "desc"
            },
            include: {
                autor: true,
                hashtags: true,
                comentarios: true,
                curtidas: true,
                denuncias: true,
                midias: true
            }
        });

        return res.status(200).json(lista);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao listar publicações",
            erro: erro.message
        });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        const publicacao = await prisma.publicacoes.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                autor: true,
                hashtags: true,
                comentarios: true,
                curtidas: true,
                denuncias: true,
                midias: true
            }
        });

        if (!publicacao) {
            return res.status(404).json({
                mensagem: "Publicação não encontrada"
            });
        }

        return res.status(200).json(publicacao);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao buscar publicação",
            erro: erro.message
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { texto } = req.body;

        const publicacao = await prisma.publicacoes.findUnique({
            where: { id: Number(id) }
        });

        if (!publicacao) {
            return res.status(404).json({
                mensagem: "Publicação não encontrada"
            });
        }

        if (req.user.id !== publicacao.usuarioId && req.user.tipo !== "ADMINISTRADOR") {
            return res.status(403).json({
                mensagem: "Sem permissão"
            });
        }

        const updated = await prisma.publicacoes.update({
            where: { id: Number(id) },
            data: { texto }
        });

        return res.status(200).json({
            mensagem: "Publicação atualizada",
            updated
        });

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao atualizar publicação",
            erro: erro.message
        });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        const publicacao = await prisma.publicacoes.findUnique({
            where: { id: Number(id) }
        });

        if (!publicacao) {
            return res.status(404).json({
                mensagem: "Publicação não encontrada"
            });
        }

        if (req.user.id !== publicacao.usuarioId && req.user.tipo !== "ADMINISTRADOR") {
            return res.status(403).json({
                mensagem: "Sem permissão"
            });
        }

        await prisma.publicacoes.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({
            mensagem: "Publicação excluída com sucesso"
        });

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao excluir publicação",
            erro: erro.message
        });
    }
};


const listarPorUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const lista = await prisma.publicacoes.findMany({
            where: {
                usuarioId: Number(id)
            },
            include: {
                hashtags: true
            },
            orderBy: {
                id: "desc"
            }
        });

        return res.status(200).json(lista);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao listar publicações do usuário",
            erro: erro.message
        });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir,
    listarPorUsuario
};