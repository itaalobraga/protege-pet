import express from "express";
import MovimentacaoEstoqueController from "../controllers/MovimentacaoEstoqueController.js";
import { authJwt } from "../middlewares/authJwt.js";

const router = express.Router();
router.use(authJwt);

router.get("/movimentacoes-estoque", MovimentacaoEstoqueController.listar);
router.get("/movimentacoes-estoque/:id", MovimentacaoEstoqueController.buscarPorId);
router.post("/movimentacoes-estoque", MovimentacaoEstoqueController.criar);

export default router;