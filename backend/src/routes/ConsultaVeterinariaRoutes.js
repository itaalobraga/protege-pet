import express from "express";
import ConsultaVeterinariaController from "../controllers/ConsultaVeterinariaController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
const validarPermissao = exigirPermissao("Gerenciar veterinários");

router.get("/consultas-veterinarias", authJwt, validarPermissao, ConsultaVeterinariaController.listar);
router.get("/consultas-veterinarias/:id", authJwt, validarPermissao, ConsultaVeterinariaController.buscarPorId);
router.post("/consultas-veterinarias", authJwt, validarPermissao, ConsultaVeterinariaController.criar);
router.put("/consultas-veterinarias/:id", authJwt, validarPermissao, ConsultaVeterinariaController.atualizar);
router.delete("/consultas-veterinarias/:id", authJwt, validarPermissao, ConsultaVeterinariaController.excluir);

export default router;
