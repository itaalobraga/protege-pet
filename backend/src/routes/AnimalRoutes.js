import express from "express";
import AnimalController from "../controllers/AnimalController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
const validarPermissao = exigirPermissao("Gerenciar animais");

router.get("/animais", authJwt, validarPermissao, AnimalController.listar);
router.get("/animais/relatorio.csv", authJwt, validarPermissao, AnimalController.exportarCsv);
router.get("/animais/:id", authJwt, validarPermissao, AnimalController.buscarPorId);
router.post("/animais", authJwt, validarPermissao, AnimalController.criar);
router.put("/animais/:id", authJwt, validarPermissao, AnimalController.atualizar);
router.delete("/animais/:id", authJwt, validarPermissao, AnimalController.excluir);

export default router;
