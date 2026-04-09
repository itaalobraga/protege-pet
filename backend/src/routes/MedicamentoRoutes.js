import express from "express";
import MedicamentoController from "../controllers/MedicamentoController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
const validarPermissao = exigirPermissao("Gerenciar medicamentos");

router.get("/medicamentos", authJwt, validarPermissao, MedicamentoController.listar);
router.get("/medicamentos/:id", authJwt, validarPermissao, MedicamentoController.buscarPorId);
router.post("/medicamentos", authJwt, validarPermissao, MedicamentoController.criar);
router.put("/medicamentos/:id", authJwt, validarPermissao, MedicamentoController.atualizar);
router.delete("/medicamentos/:id", authJwt, validarPermissao, MedicamentoController.excluir);

export default router;
