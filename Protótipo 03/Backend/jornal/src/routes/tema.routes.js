const express = require("express");
const router = express.Router();

const {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
} = require("../controllers/tema.controller");

const { validate } = require("../middlewares/auth");
const { validaAdministrador } = require("../middlewares/validaCargo");

router.post("/cadastrar", validate, validaAdministrador, cadastrar);

router.get("/listar", validate, listar);

router.get("/buscar/:id", validate, buscar);

router.put("/atualizar/:id", validate, validaAdministrador, atualizar);

router.delete("/excluir/:id", validate, validaAdministrador, excluir);

module.exports = router;