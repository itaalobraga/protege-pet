import express from "express";
import FuncaoController from "../controllers/FuncaoController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
const validarPermissao = exigirPermissao("Gerenciar usuários");

router.get("/funcoes", authJwt, validarPermissao, FuncaoController.listar);
router.get("/funcoes/permissoes", authJwt, validarPermissao, FuncaoController.listarPermissoes);
router.get("/funcoes/:id", authJwt, validarPermissao, FuncaoController.buscarPorId);
router.post("/funcoes", authJwt, validarPermissao, FuncaoController.criar);
router.put("/funcoes/:id", authJwt, validarPermissao, FuncaoController.atualizar);
router.delete("/funcoes/:id", authJwt, validarPermissao, FuncaoController.excluir);

export default router;
