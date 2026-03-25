const express = require("express");

const router = express.Router();

const { 
    cadastrar, 
    listar, 
    buscar, 
    atualizar, 
    excluir } = require("../controllers/mensagens.controller");
const { validate } = require("../middlewares/auth");

router.post("/cadastrar", cadastrar, validate);
router.get("/listar", listar, validate);
router.get("/buscar/:id", buscar, validate);
router.put("/atualizar/:id", atualizar, validate);
router.delete("/excluir/:id", excluir, validate);

module.exports = router;
