const prisma = require("../data/prisma");
const fs = require("fs");

const cadastrar = async (req, res) => {
    try {
        const publicacaoId = Number(req.params.id);
        const arquivo = req.file;

        const pasta = `uploads/publicacoes/${publicacaoId}`;
        const caminho = `${pasta}/${arquivo.filename}`;

        if (!fs.existsSync(pasta)) {
            fs.mkdirSync(pasta, { recursive: true });
        }

        fs.renameSync(arquivo.path, caminho);

        const midia = await prisma.midiasPublicacoes.create({
            data: {
                nomeOriginal: arquivo.originalname,
                nomeArquivo: arquivo.filename,
                mimeType: arquivo.mimetype,
                path: caminho,
                publicacaoId
            }
        });

        return res.status(201).json(midia);

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro ao cadastrar mídia de publicação",
            erro: erro.message
        });
    }
};

const listar = async (req, res) => {
    const lista = await prisma.midiasPublicacoes.findMany();
    return res.json(lista);
};

const excluir = async (req, res) => {
    const id = Number(req.params.id);

    await prisma.midiasPublicacoes.delete({
        where: { id }
    });

    return res.json({ mensagem: "Mídia excluída" });
};

module.exports = {
    cadastrar,
    listar,
    excluir
};