const express = require("express");

const router = express.Router();

const { 
    cadastrar, 
    listar, 
    buscar, 
    atualizar, 
    excluir,
Login } = require("../controllers/usuarios.controller");
const { validate } = require("../middlewares/auth.js");

router.post("/usuarios/login", Login);
router.post("/usuarios/cadastrar", validate, cadastrar);
router.get("/usuarios/listar", validate, listar);
router.get("/usuarios/buscar/:id", validate,buscar);
router.put("/usuarios/atualizar/:id", validate, atualizar);
router.delete("/usuarios/excluir/:id", validate, excluir);

module.exports = router;
