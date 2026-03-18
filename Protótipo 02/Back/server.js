const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const comentarioRoutes = require('./src/routes/comentario.routes');
const hastagRoutes = require('./src/routes/hastag.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
const noticiasRoutes = require('./src/routes/noticias.routes');


app.use(comentarioRoutes);
app.use(hastagRoutes);
app.use(usuariosRoutes);
app.use(noticiasRoutes);
app.use(express.json());

app.listen(3000, () => {
  console.log('Servidor online na porta 3000');
});