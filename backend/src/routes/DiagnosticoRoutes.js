import express from "express";
import DiagnosticoController from "../controllers/DiagnosticoController.js";
import { authJwt as verificarToken } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
router.use(verificarToken);
router.use(exigirPermissao("Gerenciar diagnósticos"));

router.get("/diagnosticos", DiagnosticoController.listar);
router.post("/diagnosticos", DiagnosticoController.criar);

export default router;
