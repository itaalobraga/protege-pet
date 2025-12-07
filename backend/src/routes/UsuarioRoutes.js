import express from "express";
import UsuarioController from "../controllers/UsuarioController.js";

const router = express.Router();

router.get("/usuarios", UsuarioController.listar);
router.get("/usuarios/:id", UsuarioController.buscarPorId);
router.post("/usuarios", UsuarioController.criar);
router.put("/usuarios/:id", UsuarioController.atualizar);
router.delete("/usuarios/:id", UsuarioController.excluir);

export default router;

