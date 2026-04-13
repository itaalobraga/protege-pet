import express from "express";
import DiagnosticoController from "../controllers/DiagnosticoController.js";
import { authJwt as verificarToken } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
router.use(verificarToken);
router.use(exigirPermissao("Gerenciar diagnósticos"));

router.get("/diagnosticos", DiagnosticoController.listar);
router.get("/diagnosticos/:id", DiagnosticoController.buscarPorId);
router.post("/diagnosticos", DiagnosticoController.criar);
router.put("/diagnosticos/:id", DiagnosticoController.atualizar);
router.delete("/diagnosticos/:id", DiagnosticoController.excluir);

export default router;
