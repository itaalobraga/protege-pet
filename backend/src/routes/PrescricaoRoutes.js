import express from "express";
import PrescricaoController from "../controllers/PrescricaoController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
const validarPermissao = exigirPermissao("Gerenciar prescrições e ministrações");

router.get("/prescricoes", authJwt, validarPermissao, PrescricaoController.listar);
router.get("/prescricoes/:id", authJwt, validarPermissao, PrescricaoController.buscarPorId);
router.post("/prescricoes", authJwt, validarPermissao, PrescricaoController.criar);
router.put("/prescricoes/:id", authJwt, validarPermissao, PrescricaoController.atualizar);
router.delete("/prescricoes/:id", authJwt, validarPermissao, PrescricaoController.excluir);

export default router;
