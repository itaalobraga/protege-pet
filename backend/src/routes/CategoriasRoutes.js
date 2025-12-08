import { Router } from "express";
import CategoriasController from "../controllers/CategoriasController.js";

const router = Router();

router.get("/", CategoriasController.listar);
router.post("/", CategoriasController.criar);
router.put("/:id", CategoriasController.atualizar);
router.delete("/:id", CategoriasController.excluir);

export default router;
