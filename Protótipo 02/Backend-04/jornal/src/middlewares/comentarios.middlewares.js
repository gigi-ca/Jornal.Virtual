const prisma = require("../data/prisma");

const validarExclusaoComentario = async (req, res, next) => {
    try {
        const usuario = req.user;
        const comentarioId = Number(req.params.id);

        const comentario = await prisma.comentarios.findUnique({
            where: { id: comentarioId }
        });

        if (!comentario) {
            return res.status(404).json({
                mensagem: "Comentário não encontrado"
            });
        }

        const ehDono = comentario.usuarioId === usuario.id;
        const ehPrivilegiado =
            usuario.tipo === "VERIFICADO" ||
            usuario.tipo === "ADMINISTRADOR";

        if (ehDono || ehPrivilegiado) {
            return next();
        }

        return res.status(403).json({
            mensagem: "Sem permissão para excluir comentário"
        });

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro interno",
            erro: erro.message
        });
    }
};

module.exports = {
    validarExclusaoComentario
};