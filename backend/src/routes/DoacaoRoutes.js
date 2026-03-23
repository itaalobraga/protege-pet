import express from "express";
import DoacaoController from "../controllers/DoacaoController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();

const validarPermissao = exigirPermissao("Gerenciar doações");

router.get("/doacoes", authJwt, validarPermissao, DoacaoController.listar);
router.get("/doacoes/:id", authJwt, validarPermissao, DoacaoController.buscarPorId);
router.post("/doacoes", authJwt, validarPermissao, DoacaoController.criar);

export default router;