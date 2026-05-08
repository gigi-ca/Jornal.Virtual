require('dotenv').config();
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const denuncia_comentarioRoutes = require('./src/routes/denuncia_comentario.routes');
app.use('/denuncia_comentario', denuncia_comentarioRoutes);


const denuncia_noticiaRoutes = require('./src/routes/denuncia_noticia.routes');
app.use('/denuncia_noticia', denuncia_noticiaRoutes);


const midiaRoutes = require('./src/routes/midia.routes');
app.use('/midia', midiaRoutes);


const comentarioRoutes = require('./src/routes/comentario.routes');
app.use('/comentario', comentarioRoutes);


const hastagRoutes = require('./src/routes/hastag.routes');
app.use('/hastag', hastagRoutes);


const usuariosRoutes = require('./src/routes/usuarios.routes');
app.use('/usuarios', usuariosRoutes);


const noticiasRoutes = require('./src/routes/noticias.routes');
app.use('/noticias', noticiasRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
