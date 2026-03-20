import express from "express";
import VeterinarioController from "../controllers/VeterinarioController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
const validarPermissao = exigirPermissao("Gerenciar veterinários");

router.get("/veterinarios", authJwt, validarPermissao, VeterinarioController.listar);
router.get("/veterinarios/:id", authJwt, validarPermissao, VeterinarioController.buscarPorId);
router.post("/veterinarios", authJwt, validarPermissao, VeterinarioController.criar);
router.put("/veterinarios/:id", authJwt, validarPermissao, VeterinarioController.atualizar);
router.delete("/veterinarios/:id", authJwt, validarPermissao, VeterinarioController.excluir);

export default router;
