const prisma = require("../data/prisma");

// CURTIR PUBLICAÇÃO
const curtir = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { publicacaoId } = req.body;

        if (!publicacaoId) {
            return res.status(400).json({
                mensagem: "publicacaoId obrigatório"
            });
        }

        const publicacaoExiste = await prisma.publicacoes.findUnique({
            where: { id: Number(publicacaoId) }
        });

        if (!publicacaoExiste) {
            return res.status(404).json({
                mensagem: "Publicação não encontrada"
            });
        }

        const jaCurtiu = await prisma.curtidas.findFirst({
            where: {
                usuarioId,
                publicacaoId: Number(publicacaoId)
            }
        });

        if (jaCurtiu) {
            return res.status(400).json({
                mensagem: "Você já curtiu essa publicação"
            });
        }

        const curtida = await prisma.curtidas.create({
            data: {
                usuarioId,
                publicacaoId: Number(publicacaoId)
            }
        });

        return res.status(201).json({
            mensagem: "Curtida realizada com sucesso",
            curtida
        });

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao curtir publicação",
            erro: erro.message
        });
    }
};

// DESCURTIR PUBLICAÇÃO
const descurtir = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { publicacaoId } = req.body;

        if (!publicacaoId) {
            return res.status(400).json({
                mensagem: "publicacaoId obrigatório"
            });
        }

        const curtida = await prisma.curtidas.findFirst({
            where: {
                usuarioId,
                publicacaoId: Number(publicacaoId)
            }
        });

        if (!curtida) {
            return res.status(404).json({
                mensagem: "Curtida não encontrada"
            });
        }

        await prisma.curtidas.delete({
            where: {
                id: curtida.id
            }
        });

        return res.status(200).json({
            mensagem: "Curtida removida com sucesso"
        });

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao remover curtida",
            erro: erro.message
        });
    }
};

// CONTAR CURTIDAS
const contarCurtidas = async (req, res) => {
    try {
        const { publicacaoId } = req.params;

        // 1. Verifica se a publicação existe
        const publicacao = await prisma.publicacoes.findUnique({
            where: {
                id: Number(publicacaoId)
            }
        });

        if (!publicacao) {
            return res.status(404).json({
                mensagem: "Publicação não encontrada"
            });
        }

        // 2. Conta as curtidas
        const totalCurtidas = await prisma.curtidas.count({
            where: {
                publicacaoId: Number(publicacaoId)
            }
        });

        return res.status(200).json({
            publicacaoId: Number(publicacaoId),
            curtidas: totalCurtidas
        });

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao contar curtidas",
            erro: erro.message
        });
    }
};

module.exports = {
    curtir,
    descurtir,
    contarCurtidas
};