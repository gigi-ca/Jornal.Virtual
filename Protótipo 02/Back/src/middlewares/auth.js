const jsonwebtoken = require("jsonwebtoken");
const prisma = require("../data/prisma"); 

const validate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).send({ message: "Access Denied. No token provided." });
    }
    
    try {
        const payload = jsonwebtoken.verify(token, process.env.SECRET_JWT);
        req.user = payload;  
        next();
    } catch (err) {
        console.error("Erro na validação do token:", err);  
        res.status(500).send({ message: "Token inválido" });  
    }
};

const excluircomentario = async (req, res, next) => {
    const usuario = req.user;  
    const { id } = req.params;

    try {
        
        const comentario = await prisma.comentario.findUnique({
            where: { id: Number(id) }
        });

        if (!comentario) {
            return res.status(404).json({ msg: "Comentário não encontrado" });
        }

        
        if (usuario.id === comentario.usuarioId ||
            usuario.tipo.toLowerCase() === 'Administrador' ||
            usuario.tipo.toLowerCase() === 'Verificado') {
            next();
        } else {
            res.status(401).json({
                msg: "usuário sem permissão"
            });
        }
    } catch (error) {
        console.error("Erro ao verificar comentário:", error);  
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

const excluirmensagem = async(req, res) => {
 const usuario = req.user;  
    const { id } = req.params;

    try {
        
        const comentario = await prisma.comentario.findUnique({
            where: { id: Number(id) }
        });

        if (!comentario) {
            return res.status(404).json({ msg: "Mensagem não encontrada" });
        }

        
        if (usuario.id === comentario.usuarioId ||
            usuario.tipo.toLowerCase() === 'Administrador' ||
            usuario.tipo.toLowerCase() === 'Verificado') {
            next();
        } else {
            res.status(401).json({
                msg: "usuário sem permissão"
            });
        }
    } catch (error) {
        console.error("Erro ao verificar mmensagem:", error);  
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
}


module.exports = {
    validate,
    excluircomentario,
    excluirmensagem
};

