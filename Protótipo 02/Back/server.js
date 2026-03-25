require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors());

const mensagensRoutes = require("./src/routes/comentario.routes");
const usuariosporgruposRoutes = require('./src/routes/usuariosporgrupos.routes');
const gruposRoutes = require('./src/routes/grupos.routes');
const comentarioRoutes = require('./src/routes/comentario.routes');
const hastagRoutes = require('./src/routes/hastag.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
const noticiasRoutes = require('./src/routes/noticias.routes');

app.use(mensagensRoutes);
app.use(usuariosporgruposRoutes);
app.use(gruposRoutes);
app.use(comentarioRoutes);
app.use(hastagRoutes);
app.use(usuariosRoutes);
app.use(noticiasRoutes);


app.listen(3000, () => {
  console.log('Servidor online na porta 3000');
});