import express from "express";
import MinistracaoController from "../controllers/MinistracaoController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
const validarPermissao = exigirPermissao("Gerenciar prescrições e ministrações");

router.get("/ministracoes/responsaveis", authJwt, validarPermissao, MinistracaoController.listarResponsaveis);
router.get("/ministracoes", authJwt, validarPermissao, MinistracaoController.listar);
router.get("/ministracoes/:id", authJwt, validarPermissao, MinistracaoController.buscarPorId);
router.post("/ministracoes", authJwt, validarPermissao, MinistracaoController.criar);

export default router;
