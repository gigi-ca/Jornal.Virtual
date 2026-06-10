const express = require("express");
const router = express.Router();

const controller = require("../controllers/midiasNoticias.controller");
const upload = require("../middlewares/upload.midia");

router.post("/:id", upload, controller.cadastrar);
router.get("/", controller.listar);
router.delete("/:id", controller.excluir);

module.exports = router;