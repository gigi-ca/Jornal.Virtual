const validaAdm = (req, res, next) => {
    const usuario = req.headers['user'];

    if (usuario.tipo.toLowerCase() === 'Administrador') {
        next();
    }else{
        res.status(401).json({
            msg: "usuario sem permissao"
        }).end();
    }
    
};

const validaVerificado= (req, res, next) => {
    const usuario = req.headers['user'];

    if (usuario.tipo.toLowerCase() === 'Verificado'|| usuario.tipo.toLowerCase() === 'Administrador') {
        next();
    }else{
        res.status(401).json({
            msg: "usuario sem permissao"
        }).end();
    }
    
};

const validaAlunos= (req, res, next) => {
    const usuario = req.headers['user'];

    if (usuario.tipo.toLowerCase() === 'Aluno'|| usuario.tipo.toLowerCase() === 'Administrador') {
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