const validaAdm = (req, res, next) => {
    const usuario = req.headers['user'];

    if (usuario.tipo.toLowerCase() === 'administrador') {
        next();
    }else{
        res.status(401).json({
            msg: "usuario sem permissao"
        }).end();
    }
    
};

const validaVerificado= (req, res, next) => {
    const usuario = req.headers['user'];

    if (usuario.tipo.toLowerCase() === 'verificado'|| usuario.tipo.toLowerCase() === 'administrador') {
        next();
    }else{
        res.status(401).json({
            msg: "usuario sem permissao"
        }).end();
    }
    
};

const validaAlunos= (req, res, next) => {
    const usuario = req.headers['user'];

    if (usuario.tipo.toLowerCase() === 'aluno'|| usuario.tipo.toLowerCase() === 'administrador') {
        next();
    }else{
        res.status(401).json({
            msg: "usuario sem permissao"
        }).end();
    }
    
};



module.exports = {
    validaAdm,
    validaVerificado,
    validaAlunos
}