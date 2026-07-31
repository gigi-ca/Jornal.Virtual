const express = require("express");
const router = express.Router();

const{
    denunciar,
    listar,
    buscar,
    excluir
} = require("../controllers/denunciasPublicacao.controller");

const controller = require("../controllers/denunciasPublicacao.controller");
const { validate } = require("../middlewares/auth");

router.post("/cadastrar", validate, denunciar);

router.get("/listar", validate, listar);

router.get("/buscar/:id", validate, buscar);

router.delete("/excluir/:id", validate, excluir);

module.exports = router;