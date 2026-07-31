const express = require("express");

const router = express.Router();

const { 
    denunciar, 
    listar, 
    buscar, 
    excluir } = require("../controllers/denunciasComentario.controller.js");
const { validate } = require("../middlewares/auth.js");
const { validaAdministrador } = require("../middlewares/validaCargo.js");

router.post("/cadastrar", validate, denunciar);
router.get("/listar", validate, listar);
router.get("/buscar/:id", validate, buscar);
router.delete("/excluir/:id", validate, excluir);

module.exports = router;
