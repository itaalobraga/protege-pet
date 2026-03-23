import express from "express";
import MovimentacaoEstoqueController from "../controllers/MovimentacaoEstoqueController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
const validarPermissao = exigirPermissao("Gerenciar produtos");

router.get("/movimentacoes-estoque", authJwt, validarPermissao, MovimentacaoEstoqueController.listar);
router.get("/movimentacoes-estoque/:id", authJwt, validarPermissao, MovimentacaoEstoqueController.buscarPorId);
router.post("/movimentacoes-estoque", authJwt, validarPermissao, MovimentacaoEstoqueController.criar);

export default router;
