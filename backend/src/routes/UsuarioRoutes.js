import express from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
const validarPermissao = exigirPermissao("Gerenciar usuários");

router.get("/usuarios", authJwt, validarPermissao, UsuarioController.listar);
router.get("/usuarios/:id", authJwt, validarPermissao, UsuarioController.buscarPorId);
router.post("/usuarios", authJwt, validarPermissao, UsuarioController.criar);
router.put("/usuarios/:id", authJwt, validarPermissao, UsuarioController.atualizar);
router.delete("/usuarios/:id", authJwt, validarPermissao, UsuarioController.excluir);

export default router;
