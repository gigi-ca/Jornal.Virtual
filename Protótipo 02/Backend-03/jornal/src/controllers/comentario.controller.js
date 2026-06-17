const prisma = require("../data/prisma");

// CRIAR comentário (ou resposta)
const cadastrar = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { publicacaoId, texto, comentarioPaiId } = req.body;

        if (!publicacaoId || !texto) {
            return res.status(400).json({
                mensagem: "publicacaoId e texto são obrigatórios"
            });
        }

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

        const comentario = await prisma.comentarios.create({
            data: {
                texto,
                publicacaoId: Number(publicacaoId),
                usuarioId,
                comentarioPaiId: comentarioPaiId ? Number(comentarioPaiId) : null
            }
        });

        return res.status(201).json(comentario);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao criar comentário",
            erro: erro.message
        });
    }
};

// LISTAR comentários por publicação
const listarPorPublicacao = async (req, res) => {
    try {
        const { publicacaoId } = req.params;

        const id = Number(publicacaoId);

        if (isNaN(id)) {
            return res.status(400).json({
                mensagem: "ID da publicação inválido"
            });
        }

        const publicacao = await prisma.publicacoes.findUnique({
            where: {
                id
            }
        });

        if (!publicacao) {
            return res.status(404).json({
                mensagem: "Publicação não encontrada"
            });
        }

        const comentarios = await prisma.comentarios.findMany({
            where: {
                publicacaoId: id,
                comentarioPaiId: null
            },
            include: {
                autor: true,
                respostas: {
                    include: {
                        autor: true
                    }
                }
            },
            orderBy: {
                dataPublicacao: "desc"
            }
        });

        return res.status(200).json(comentarios);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao listar comentários",
            erro: erro.message
        });
    }
};

// BUSCAR comentário por ID
const buscar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                mensagem: "ID inválido"
            });
        }

        const comentario = await prisma.comentarios.findUnique({
            where: { id },
            include: {
                autor: true,
                respostas: {
                    include: {
                        autor: true
                    }
                }
            }
        });

        if (!comentario) {
            return res.status(404).json({
                mensagem: "Comentário não encontrado"
            });
        }

        return res.status(200).json(comentario);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao buscar comentário",
            erro: erro.message
        });
    }
};

// ATUALIZAR comentário
// const atualizar = async (req, res) => {
//     try {
//         const usuarioId = req.user.id;
//         const id = Number(req.params.id);
//         const { texto } = req.body;

//         const comentario = await prisma.comentarios.findUnique({
//             where: { id }
//         });

//         if (!comentario) {
//             return res.status(404).json({
//                 mensagem: "Comentário não encontrado"
//             });
//         }

//         if (comentario.usuarioId !== usuarioId) {
//             return res.status(403).json({
//                 mensagem: "Você só pode editar seu próprio comentário"
//             });
//         }

//         const atualizado = await prisma.comentarios.update({
//             where: { id },
//             data: { texto }
//         });

//         return res.status(200).json(atualizado);

//     } catch (erro) {
//         return res.status(500).json({
//             mensagem: "Erro ao atualizar comentário",
//             erro: erro.message
//         });
//     }
// };

// EXCLUIR comentário (middleware já valida permissão)
const excluir = async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.comentarios.delete({
            where: { id }
        });

        return res.status(200).json({
            mensagem: "Comentário excluído com sucesso"
        });

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao excluir comentário",
            erro: erro.message
        });
    }
};

module.exports = {
    cadastrar,
    listarPorPublicacao,
    buscar,
    excluir
};