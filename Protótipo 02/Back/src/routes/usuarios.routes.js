const express = require("express");

const router = express.Router();

const { 
    cadastrar, 
    listar, 
    buscar, 
    atualizar, 
    excluir } = require("../controllers/usuarios.controller");
const { validaAdm } = require("../middlewares/validaCargo");

router.post("/cadastrar", cadastrar, validaAdm);
router.get("/listar", listar, validaAdm);
router.get("/buscar/:id", buscar, validaAdm);
router.put("/atualizar/:id", atualizar, validaAdm);
router.delete("/excluir/:id", excluir, validaAdm);

module.exports = router;
