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
            where: { email }
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
                unidadeEscolar: usuario.unidadeEscolar
            },
            process.env.SECRET_JWT,
            { expiresIn: "120min" }
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
            unidadeEscolar
        } = req.body;

        const usuarioLogado = req.user;

        // só TI cadastra
        if (usuarioLogado.tipo !== "ADMINISTRADOR") {
            return res.status(403).json({
                mensagem: "Somente TI pode cadastrar usuários"
            });
        }

        if (!nome || !email || !senha || !tipo || !unidadeEscolar) {
            return res.status(400).json({
                mensagem: "Campos obrigatórios não preenchidos"
            });
        }

        nome = nome.trim();
        email = email.toLowerCase().trim();
        tipo = tipo.toUpperCase();

        if (!TIPOS_VALIDOS.includes(tipo)) {
            return res.status(400).json({
                mensagem: "Tipo inválido"
            });
        }

        if (nome.length < 3) {
            return res.status(400).json({
                mensagem: "Nome muito curto"
            });
        }

        const existe = await prisma.usuarios.findUnique({
            where: { email }
        });

        if (existe) {
            return res.status(400).json({
                mensagem: "Email já cadastrado"
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
                unidadeEscolar
            }
        });

        const { senha: _, ...usuarioCriado } = novoUsuario;

        return res.status(201).json({
            mensagem: "Usuário criado com sucesso",
            usuario: usuarioCriado
        });

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao cadastrar usuário",
            erro: erro.message
        });
    }
};





const listar = async (req, res) => {
    try {
        const lista = await prisma.usuarios.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                bio: true,
                tipo: true,
                fotoPerfil: true,
                template: true,
                unidadeEscolar: true
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
        const { id } = req.params;

      const usuario = await prisma.usuarios.findUnique({
    where: { id: Number(id) },
    select: {
        id: true,
        nome: true,
        email: true,
        bio: true,
        tipo: true,
        fotoPerfil: true,
        template: true,
        unidadeEscolar: true
    }
});

        if (!usuario) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });
        }

        return res.status(200).json(usuario);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao buscar usuário",
            erro: erro.message
        });
    }
};



const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = { ...req.body };
        const usuarioLogado = req.user;

        const usuario = await prisma.usuarios.findUnique({
            where: { id: Number(id) }
        });

        if (!usuario) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });
        }

        if (
            usuarioLogado.id !== Number(id) &&
            usuarioLogado.tipo !== "ADMINISTRADOR"
        ) {
            return res.status(403).json({
                mensagem: "Sem permissão"
            });
        }

        // aluno e verificado só podem mudar foto e template e bio
        if (usuarioLogado.tipo !== "ADMINISTRADOR") {
            delete dados.tipo;
            delete dados.email;
            delete dados.unidadeEscolar;
            delete dados.senha;
            delete dados.nome;
        }

        if (dados.senha) {
            dados.senha = crypto
                .createHash("md5")
                .update(dados.senha)
                .digest("hex");
        }

        const atualizado = await prisma.usuarios.update({
            where: { id: Number(id) },
            data: dados
        });

        const { senha: _, ...usuarioFinal } = atualizado;

        return res.status(200).json({
            mensagem: "Usuário atualizado",
            usuario: usuarioFinal
        });

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao atualizar",
            erro: erro.message
        });
    }
};



const excluir = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioLogado = req.user;

        const usuario = await prisma.usuarios.findUnique({
            where: { id: Number(id) }
        });

        if (!usuario) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });
        }

        if (usuarioLogado.tipo !== "ADMINISTRADOR") {
            return res.status(403).json({
                mensagem: "Somente TI pode excluir usuários"
            });
        }

        await prisma.usuarios.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({
            mensagem: "Usuário excluído com sucesso"
        });

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao excluir usuário",
            erro: erro.message
        });
    }
};


const pesquisar = async (req, res) => {
    try {
        const { termo } = req.query;

        const usuarios = await prisma.usuarios.findMany({
            where: {
                nome: {
                    contains: termo,
                    mode: "insensitive"
                }
            },
            select: {
                id: true,
                nome: true,
                email: true,
                bio: true,
                tipo: true,
                fotoPerfil: true,
                template: true,
                unidadeEscolar: true
            }
        });

        return res.status(200).json({ usuarios });

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro na pesquisa",
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
        where: { id: usuarioId },
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
            where: { id: usuarioId },
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