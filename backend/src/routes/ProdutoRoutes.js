import express from "express";
import ProdutoController from "../controllers/ProdutoController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
const validarPermissao = exigirPermissao("Gerenciar produtos");

router.get("/produtos", authJwt, validarPermissao, ProdutoController.listar);
router.get(
  "/produtos/relatorio.csv",
  authJwt,
  validarPermissao,
  ProdutoController.exportarCsv
);
router.get("/produtos/:id", authJwt, validarPermissao, ProdutoController.buscarPorId);
router.post("/produtos", authJwt, validarPermissao, ProdutoController.criar);
router.put("/produtos/:id", authJwt, validarPermissao, ProdutoController.atualizar);
router.delete("/produtos/:id", authJwt, validarPermissao, ProdutoController.excluir);

export default router;
