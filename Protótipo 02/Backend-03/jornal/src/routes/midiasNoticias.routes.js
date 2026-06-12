const express = require("express");
const router = express.Router();

const {
    cadastrar,
    listar,
    buscar,
    excluir
} = require("../controllers/midiasNoticias.controller.js");

const controller = require("../controllers/midiasNoticias.controller.js");

const uploadMidia = require("../middlewares/upload.midia.js");

const { validate } = require("../middlewares/auth.js");


router.post("/cadastrar/:id", validate, uploadMidia, cadastrar);
router.get("/listar", listar);
router.get("/buscar/:id", buscar);
router.delete("/excluir/:id", validate, excluir);

module.exports = router;