import express from "express";
import CategoriaController from "../controllers/CategoriaController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
const validarPermissao = exigirPermissao("Gerenciar produtos");

router.get("/categorias", authJwt, validarPermissao, CategoriaController.listar);
router.get("/categorias/:id", authJwt, validarPermissao, CategoriaController.buscarPorId);
router.post("/categorias", authJwt, validarPermissao, CategoriaController.criar);
router.put("/categorias/:id", authJwt, validarPermissao, CategoriaController.atualizar);
router.delete("/categorias/:id", authJwt, validarPermissao, CategoriaController.deletar);

export default router;
