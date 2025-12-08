import express from "express";
import FuncaoController from "../controllers/FuncaoController.js";

const router = express.Router();

router.get("/funcoes", FuncaoController.listar);
router.get("/funcoes/permissoes", FuncaoController.listarPermissoes);
router.get("/funcoes/:id", FuncaoController.buscarPorId);
router.post("/funcoes", FuncaoController.criar);
router.put("/funcoes/:id", FuncaoController.atualizar);
router.delete("/funcoes/:id", FuncaoController.excluir);

export default router;
