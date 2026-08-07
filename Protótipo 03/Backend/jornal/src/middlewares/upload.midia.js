const multer = require("multer");

const validarNomeArquivo = (req, file, callback) => {
  const nomePublicacao = req.body.nome || "arquivo";
  const nomeFormatado = nomePublicacao.toLowerCase().replaceAll(" ", "-");
  const ext = file.originalname.split(".").pop();
  const nomeFinal = Date.now() + "-" + nomeFormatado + "." + ext;
  callback(null, nomeFinal);
};

const definirDestino = (req, file, callback) => {
  callback(null, "uploads/temp");
};

const tiposPermitidos = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/mkv"
];

const filtrarExtensao = (req, file, callback) => {
  if (tiposPermitidos.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Arquivo não permitido"));
  }
};

const armazenamento = multer.diskStorage({
  destination: definirDestino,
  filename: validarNomeArquivo,
});

const uploadMidia = (req, res, next) => {
  const filemulter = multer({
    storage: armazenamento,
    fileFilter: filtrarExtensao,
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
  });

  filemulter.single("arquivo")(req, res, function (erro) {
    if (erro) {
      return res.status(400).json({ erro: erro.message });
    }

    if (!req.file) {
      return res.status(400).json({ erro: "Arquivo não enviado" });
    }

    next();
  });
};

module.exports = uploadMidia;