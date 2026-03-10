import express from "express";
import MovimentacaoEstoqueController from "../controllers/MovimentacaoEstoqueController.js";

const router = express.Router();

router.get("/movimentacoes-estoque", MovimentacaoEstoqueController.listar);
router.post("/movimentacoes-estoque", MovimentacaoEstoqueController.criar);
router.post("/saidas-estoque", MovimentacaoEstoqueController.registrarSaida);

export default router;