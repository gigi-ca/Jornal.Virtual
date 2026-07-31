const prisma = require("../data/prisma");

// DENUNCIAR COMENTÁRIO
const denunciar = async (req, res) => {
    try {

        const { comentarioId, motivo } = req.body;

        if (!comentarioId || !motivo) {
            return res.status(400).json({
                mensagem: "Comentário e motivo são obrigatórios"
            });
        }

        const comentario = await prisma.comentarios.findUnique({
            where: {
                id: Number(comentarioId)
            }
        });

        if (!comentario) {
            return res.status(404).json({
                mensagem: "Comentário não encontrado"
            });
        }

        const denunciaExistente = await prisma.denunciasComentario.findFirst({
            where: {
                usuarioId: req.user.id,
                comentarioId: Number(comentarioId)
            }
        });

        if (denunciaExistente) {
            return res.status(400).json({
                mensagem: "Você já denunciou este comentário"
            });
        }

        const denuncia = await prisma.denunciasComentario.create({
            data: {
                motivo,
                usuarioId: req.user.id,
                comentarioId: Number(comentarioId)
            }
        });

        return res.status(201).json({
            mensagem: "Comentário denunciado com sucesso",
            denuncia
        });

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao denunciar comentário",
            erro: erro.message
        });

    }
};

// LISTAR DENÚNCIAS
const listar = async (req, res) => {
    try {

        if (req.user.tipo !== "ADMINISTRADOR") {
            return res.status(403).json({
                mensagem: "Usuário sem permissão"
            });
        }

        const denuncias = await prisma.denunciasComentario.findMany({
            orderBy: {
                dataDenuncia: "desc"
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                comentario: true
            }
        });

        return res.status(200).json(denuncias);

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao listar denúncias",
            erro: erro.message
        });

    }
};

// BUSCAR DENÚNCIA
const buscar = async (req, res) => {
    try {

        if (req.user.tipo !== "ADMINISTRADOR") {
            return res.status(403).json({
                mensagem: "Usuário sem permissão"
            });
        }

        const id = Number(req.params.id);

        const denuncia = await prisma.denunciasComentario.findUnique({
            where: { id },
            include: {
                usuario: true,
                comentario: true
            }
        });

        if (!denuncia) {
            return res.status(404).json({
                mensagem: "Denúncia não encontrada"
            });
        }

        return res.status(200).json(denuncia);

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao buscar denúncia",
            erro: erro.message
        });

    }
};

// EXCLUIR DENÚNCIA
const excluir = async (req, res) => {
    try {

        if (req.user.tipo !== "ADMINISTRADOR") {
            return res.status(403).json({
                mensagem: "Usuário sem permissão"
            });
        }

        const id = Number(req.params.id);

        const denuncia = await prisma.denunciasComentario.findUnique({
            where: { id }
        });

        if (!denuncia) {
            return res.status(404).json({
                mensagem: "Denúncia não encontrada"
            });
        }

        await prisma.denunciasComentario.delete({
            where: { id }
        });

        return res.status(200).json({
            mensagem: "Denúncia excluída com sucesso"
        });

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao excluir denúncia",
            erro: erro.message
        });

    }
};

module.exports = {
    denunciar,
    listar,
    buscar,
    excluir
};