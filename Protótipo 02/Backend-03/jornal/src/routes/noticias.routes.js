const express = require("express");
const router = express.Router();

const {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
} = require("../controllers/noticias.controller");

const controller = require("../controllers/noticias.controller");
const { validate } = require("../middlewares/auth");

router.post("/cadastrar", validate, cadastrar);

router.get("/listar", controller.listar);

router.get("/buscar/:id", controller.buscar);

router.put("/atualizar/:id", validate, controller.atualizar);

router.delete("/excluir/:id", validate, controller.excluir);

module.exports = router;