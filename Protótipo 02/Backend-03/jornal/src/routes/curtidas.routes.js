const express = require("express");
const router = express.Router();

const {
    curtir,
    descurtir,
    contarCurtidas
} = require("../controllers/curtidas.controller");

const { validate } = require("../middlewares/auth");

router.post("/curtir", validate, curtir);
router.delete("/descurtir", validate, descurtir);
router.get("/contar/:publicacaoId", contarCurtidas);

module.exports = router;