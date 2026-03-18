const jsonwebtoken = require("jsonwebtoken");
const prisma = require("../data/prisma");  // Importar no topo para eficiência

const validate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).send({ message: "Access Denied. No token provided." });
    }
    
    try {
        const payload = jsonwebtoken.verify(token, process.env.SECRET_JWT);
        req.user = payload;  // Usar req.user em vez de req.headers['user']
        next();
    } catch (err) {
        console.error("Erro na validação do token:", err);  // Logar erro para depuração
        res.status(500).send({ message: "Token inválido" });  // Mensagem genérica
    }
};

const excluircomentario = async (req, res, next) => {
    const usuario = req.user;  // Usar req.user em vez de req.headers['user']
    const { id } = req.params;

    try {
        // Buscar o comentário para verificar o autor
        const comentario = await prisma.comentario.findUnique({
            where: { id: Number(id) }
        });

        if (!comentario) {
            return res.status(404).json({ msg: "Comentário não encontrado" });
        }

        // Verificar se o usuário é o autor, administrador ou verificado
        if (usuario.id === comentario.usuarioId ||
            usuario.tipo.toLowerCase() === 'administrador' ||
            usuario.tipo.toLowerCase() === 'verificado') {
            next();
        } else {
            res.status(401).json({
                msg: "usuário sem permissão"
            });
        }
    } catch (error) {
        console.error("Erro ao verificar comentário:", error);  // Logar erro
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

module.exports = {
    validate,
    excluircomentario
};
