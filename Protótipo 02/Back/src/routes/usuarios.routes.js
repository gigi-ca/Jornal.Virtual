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

router.post("/login", Login);
router.post("/cadastrar", validate, cadastrar);
router.get("/listar", validate, listar);
router.get("/buscar/:id", validate,buscar);
router.put("/atualizar/:id", validate, atualizar);
router.delete("/excluir/:id", validate, excluir);

module.exports = router;
