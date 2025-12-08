import express from "express";
import CategoriaController from "../controllers/CategoriaController.js";

const router = express.Router();

router.get("/categorias", CategoriaController.listar);
router.get("/categorias/:id", CategoriaController.buscarPorId);
router.post("/categorias", CategoriaController.criar);
router.put("/categorias/:id", CategoriaController.atualizar);
router.delete("/categorias/:id", CategoriaController.deletar);

export default router;
