import express from "express";
import AtendimentoController from "../controllers/AtendimentoController.js";
import { authJwt as verificarToken } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();

router.use(verificarToken);
router.use(exigirPermissao("Gerenciar atendimentos veterinários")); 

router.get("/atendimentos", AtendimentoController.listar);
router.get("/atendimentos/:id", AtendimentoController.buscarPorId);
router.put("/atendimentos/:id", AtendimentoController.atualizar);
router.post("/atendimentos", AtendimentoController.criar);

export default router;
