const prisma = require("../data/prisma");
const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

const TIPOS_VALIDOS = [
    "ALUNO",
    "VERIFICADO",
    "ADMINISTRADOR"
];



const Login = async (req, res) => {
    try {

        let { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "Email e senha obrigatórios"
            });
        }

        email = email.toLowerCase().trim();

        const senhaHash = crypto
            .createHash("md5")
            .update(senha)
            .digest("hex");

        const usuario = await prisma.usuarios.findUnique({
            where: { email },
            include: {
                empresa: true
            }
        });

        if (!usuario || usuario.senha !== senhaHash) {
            return res.status(401).json({
                mensagem: "Email ou senha inválidos"
            });
        }

        const token = jsonwebtoken.sign(
            {
                id: usuario.id,
                nome: usuario.nome,
                tipo: usuario.tipo,
                empresaId: usuario.empresaId
            },
            process.env.SECRET_JWT,
            {
                expiresIn: "120min"
            }
        );

        const { senha: _, ...usuarioSemSenha } = usuario;

        return res.status(200).json({
            mensagem: "Login realizado com sucesso",
            token,
            usuario: usuarioSemSenha
        });

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao realizar login",
            erro: erro.message
        });

    }
};



const cadastrar = async (req, res) => {
    try {

        let {
            nome,
            email,
            senha,
            bio,
            tipo,
            fotoPerfil,
            template,
            empresaId
        } = req.body;

        const usuarioLogado = req.user;

        if (usuarioLogado.tipo !== "ADMINISTRADOR") {
            return res.status(403).json({
                mensagem: "Somente administradores podem cadastrar usuários."
            });
        }

        if (!nome || !email || !senha || !tipo || !empresaId) {
            return res.status(400).json({
                mensagem: "Campos obrigatórios não preenchidos."
            });
        }

        empresaId = Number(empresaId);

        if (empresaId !== usuarioLogado.empresaId) {
            return res.status(403).json({
                mensagem: "Você só pode cadastrar usuários da sua empresa."
            });
        }

        const empresa = await prisma.empresa.findUnique({
            where: {
                id: empresaId
            }
        });

        if (!empresa) {
            return res.status(404).json({
                mensagem: "Empresa não encontrada."
            });
        }

        nome = nome.trim();
        email = email.toLowerCase().trim();
        tipo = tipo.toUpperCase();

        if (!TIPOS_VALIDOS.includes(tipo)) {
            return res.status(400).json({
                mensagem: "Tipo inválido."
            });
        }

        const existe = await prisma.usuarios.findUnique({
            where: {
                email
            }
        });

        if (existe) {
            return res.status(400).json({
                mensagem: "Email já cadastrado."
            });
        }

        const senhaHash = crypto
            .createHash("md5")
            .update(senha)
            .digest("hex");

        const novoUsuario = await prisma.usuarios.create({
            data: {
                nome,
                email,
                senha: senhaHash,
                bio,
                tipo,
                fotoPerfil,
                template,
                empresaId
            }
        });

        const { senha: _, ...usuarioCriado } = novoUsuario;

        return res.status(201).json({
            mensagem: "Usuário criado com sucesso.",
            usuario: usuarioCriado
        });

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao cadastrar usuário.",
            erro: erro.message
        });

    }
};




const listar = async (req, res) => {
    try {

        const lista = await prisma.usuarios.findMany({

            where: {
                empresaId: req.user.empresaId
            },

            include: {
                empresa: {
                    select: {
                        id: true,
                        nome: true,
                        logo: true
                    }
                }
            }

        });

        return res.status(200).json(lista);

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao listar usuários",
            erro: erro.message
        });

    }
};


const buscar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const usuario = await prisma.usuarios.findFirst({

            where: {
                id,
                empresaId: req.user.empresaId
            },

            include: {
                empresa: {
                    select: {
                        id: true,
                        nome: true,
                        logo: true
                    }
                }
            }

        });

        if (!usuario) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        const { senha, ...usuarioSemSenha } = usuario;

        return res.status(200).json(usuarioSemSenha);

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao buscar usuário",
            erro: erro.message
        });

    }
};


const atualizar = async (req, res) => {
    try {

        const id = Number(req.params.id);
        const dados = { ...req.body };

        const usuario = await prisma.usuarios.findFirst({
            where: {
                id,
                empresaId: req.user.empresaId
            }
        });

        if (!usuario) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        if (
            req.user.id !== id &&
            req.user.tipo !== "ADMINISTRADOR"
        ) {
            return res.status(403).json({
                mensagem: "Sem permissão."
            });
        }

        delete dados.id;
        delete dados.dataCriacao;

        if (req.user.tipo !== "ADMINISTRADOR") {

            delete dados.nome;
            delete dados.email;
            delete dados.tipo;
            delete dados.empresaId;
            delete dados.senha;

        } else {

            if (dados.empresaId) {

                dados.empresaId = Number(dados.empresaId);

                if (dados.empresaId !== req.user.empresaId) {
                    return res.status(403).json({
                        mensagem: "Não é permitido mover usuários para outra empresa."
                    });
                }

            }

            if (dados.tipo) {

                dados.tipo = dados.tipo.toUpperCase();

                if (!TIPOS_VALIDOS.includes(dados.tipo)) {
                    return res.status(400).json({
                        mensagem: "Tipo de usuário inválido."
                    });
                }

            }

        }

        if (dados.email) {
            dados.email = dados.email.toLowerCase().trim();
        }

        if (dados.nome) {
            dados.nome = dados.nome.trim();
        }

        if (dados.senha) {
            dados.senha = crypto
                .createHash("md5")
                .update(dados.senha)
                .digest("hex");
        }

        const atualizado = await prisma.usuarios.update({
            where: {
                id
            },
            data: dados
        });

        const { senha, ...usuarioFinal } = atualizado;

        return res.status(200).json({
            mensagem: "Usuário atualizado com sucesso.",
            usuario: usuarioFinal
        });

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao atualizar usuário.",
            erro: erro.message
        });

    }
};



const excluir = async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (req.user.tipo !== "ADMINISTRADOR") {

            return res.status(403).json({
                mensagem: "Somente administradores podem excluir usuários."
            });

        }

        const usuario = await prisma.usuarios.findFirst({

            where: {
                id,
                empresaId: req.user.empresaId
            }

        });

        if (!usuario) {

            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });

        }

        await prisma.usuarios.delete({

            where: {
                id
            }

        });

        return res.status(200).json({
            mensagem: "Usuário excluído com sucesso."
        });

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao excluir usuário.",
            erro: erro.message
        });

    }

};

const pesquisar = async (req, res) => {

    try {

        const { termo } = req.query;

        const usuarios = await prisma.usuarios.findMany({

            where: {

                empresaId: req.user.empresaId,

                nome: {
                    contains: termo,
                    mode: "insensitive"
                }

            }

        });

        return res.status(200).json({
            usuarios
        });

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao pesquisar usuários.",
            erro: erro.message
        });

    }

};

const fotoPerfil = async (req, res) => {
    const usuarioId = req.user.id;
    const arquivo = req.file;

    const fs = require("fs");

    const pasta = `uploads/perfil/${usuarioId}`;
    const caminho = `${pasta}/${arquivo.filename}`;

    if (!fs.existsSync(pasta)) {
        fs.mkdirSync(pasta, { recursive: true });
    }

    fs.renameSync(arquivo.path, caminho);

  await prisma.usuarios.update({
    where: {
        id: usuarioId
    },
    data: {
        fotoPerfil: caminho
    }
});

    return res.status(200).json({
        mensagem: "Foto de perfil atualizada",
        caminho
    });
};

const atualizarTemplate = async (req, res) => {
    try {

        const usuarioId = req.user.id;
        const arquivo = req.file;

        const fs = require("fs");

        const pasta = `uploads/templates/${usuarioId}`;
        const caminho = `${pasta}/${arquivo.filename}`;

        if (!fs.existsSync(pasta)) {
            fs.mkdirSync(pasta, { recursive: true });
        }

        fs.renameSync(arquivo.path, caminho);

      await prisma.usuarios.update({
    where: {
        id: usuarioId
    },
    data: {
        template: caminho
    }
});

        return res.status(200).json({
            mensagem: "Template atualizado com sucesso",
            caminho
        });

    } catch (erro) {

        return res.status(500).json({
            mensagem: "Erro ao atualizar template",
            erro: erro.message
        });
    }
};


module.exports = {
    Login,
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir,
    pesquisar,
    fotoPerfil,
    atualizarTemplate
};