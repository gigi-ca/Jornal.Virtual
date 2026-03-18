const express = require("express");

const router = express.Router();

const { 
    cadastrar, 
    listar, 
    buscar, 
    atualizar, 
    excluir } = require("../controllers/comentario.controller");
const { excluircomentario } = require("../middlewares/auth");
const e = require("express");

// const { validaAlunos, validaVerificado, validaAdm } = require("../middlewares/validaCargo");

router.post("/cadastrar", cadastrar);
router.get("/listar", listar);
router.get("/buscar/:id", buscar);
router.put("/atualizar/:id", atualizar, excluircomentario);
router.delete("/excluir/:id", excluir, excluircomentario);

module.exports = router;
