const express = require("express");
const router = express.Router();

const controller = require("../controllers/midia.controller");
const uploadMidia = require("../middlewares/upload.midia");

router.post("/:id", uploadMidia, controller.cadastrar);
router.get("/", controller.listar);
router.get("/:id", controller.buscar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.excluir);

module.exports = router;