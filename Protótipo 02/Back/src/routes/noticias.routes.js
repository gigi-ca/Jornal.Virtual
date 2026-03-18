const express = require("express");

const router = express.Router();

const { 
    cadastrar, 
    listar, 
    buscar, 
    atualizar, 
    excluir } = require("../controllers/noticias.controller");
const { validaAdm, validaVerificado } = require("../middlewares/validaCargo");

router.post("/cadastrar", cadastrar);
router.get("/listar", listar);
router.get("/buscar/:id", buscar);
router.put("/atualizar/:id", atualizar, validaVerificado);
router.delete("/excluir/:id", excluir, validaVerificado);

module.exports = router;
