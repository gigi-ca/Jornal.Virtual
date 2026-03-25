const express = require("express");

const router = express.Router();

const { 
    cadastrar, 
    listar, 
    buscar, 
    atualizar, 
    excluir } = require("../controllers/comentario.controller");
    
const { excluircomentario } = require("../middlewares/auth.js");
const { validate } = require("../middlewares/auth");

router.post("/comentarios/cadastrar", cadastrar, validate);
router.get("/comentarios/listar", listar, validate);
router.get("/comentarios/buscar/:id", buscar, validate);
router.put("/comentarios/atualizar/:id", atualizar, validate);
router.delete("/comentarios/excluir/:id", excluir, validate);

module.exports = router;
