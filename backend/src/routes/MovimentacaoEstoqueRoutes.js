import express from "express";
import MovimentacaoEstoqueController from "../controllers/MovimentacaoEstoqueController.js";

const router = express.Router();

router.get("/movimentacoes-estoque", MovimentacaoEstoqueController.listar);
router.get("/movimentacoes-estoque/:id", MovimentacaoEstoqueController.buscarPorId);
router.post("/movimentacoes-estoque", MovimentacaoEstoqueController.criar);

export default router;