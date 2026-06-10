require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const usuariosRoutes = require("./src/routes/usuarios.routes");
const publicacoesRoutes = require("./src/routes/publicacoes.routes");
const curtidasRoutes = require("./src/routes/curtidas.routes");
const comentarioRoutes = require("./src/routes/comentario.routes");

// const noticiasRoutes = require("./src/routes/noticias.routes");
// const comentariosRoutes = require("./src/routes/comentarios.routes");
// const publicacoesRoutes = require("./src/routes/publicacoes.routes");
// const curtidasRoutes = require("./src/routes/curtidas.routes");
// const hashtagsRoutes = require("./src/routes/hashtags.routes");
// const denunciasPublicacaoRoutes = require("./src/routes/denunciasPublicacao.routes");
// const denunciasComentarioRoutes = require("./src/routes/denunciasComentario.routes");
// const midiasNoticiasRoutes = require("./src/routes/midiasNoticias.routes");
// const midiasPublicacoesRoutes = require("./src/routes/midiasPublicacoes.routes");

app.use("/usuarios", usuariosRoutes);
app.use("/publicacoes", publicacoesRoutes);
app.use("/curtidas", curtidasRoutes);
app.use("/comentarios", comentarioRoutes);
// app.use("/noticias", noticiasRoutes);
// app.use("/comentarios", comentariosRoutes);
// app.use("/publicacoes", publicacoesRoutes);
// app.use("/curtidas", curtidasRoutes);
// app.use("/hashtags", hashtagsRoutes);
// app.use("/denuncias-publicacao", denunciasPublicacaoRoutes);
// app.use("/denuncias-comentario", denunciasComentarioRoutes);
// app.use("/midias-noticias", midiasNoticiasRoutes);
// app.use("/midias-publicacoes", midiasPublicacoesRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});