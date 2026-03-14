import express from "express";
import ProdutoController from "../controllers/ProdutoController.js";
import { authJwt } from "../middlewares/authJwt.js";

const router = express.Router();
router.use(authJwt);

router.get("/produtos", ProdutoController.listar);
router.get("/produtos/:id", ProdutoController.buscarPorId);
router.post("/produtos", ProdutoController.criar);
router.put("/produtos/:id", ProdutoController.atualizar);
router.delete("/produtos/:id", ProdutoController.excluir);

export default router;

