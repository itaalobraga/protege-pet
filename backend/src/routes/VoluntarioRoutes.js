import express from "express";
import VoluntarioController from "../controllers/VoluntarioController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
const validarPermissao = exigirPermissao("Gerenciar voluntários");

router.get("/voluntarios", authJwt, validarPermissao, VoluntarioController.listar);
router.get("/voluntarios/:id", authJwt, validarPermissao, VoluntarioController.buscarPorId);
router.post("/voluntarios", authJwt, validarPermissao, VoluntarioController.criar);
router.put("/voluntarios/:id", authJwt, validarPermissao, VoluntarioController.atualizar);
router.delete("/voluntarios/:id", authJwt, validarPermissao, VoluntarioController.excluir);

export default router;
