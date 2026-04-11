import express from "express";
import AtendimentoController from "../controllers/AtendimentoController.js";
import { authJwt as verificarToken } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();

router.use(verificarToken);
router.use(exigirPermissao("Gerenciar atendimentos veterinários")); 

router.get("/atendimentos", AtendimentoController.listar);
router.post("/atendimentos", AtendimentoController.criar);

export default router;
