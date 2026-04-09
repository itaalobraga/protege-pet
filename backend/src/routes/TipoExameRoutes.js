import express from "express";
import TipoExameController from "../controllers/TipoExameController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
const validarPermissao = exigirPermissao("Gerenciar atendimentos veterinários");

router.get("/tipos-de-exames", authJwt, validarPermissao, TipoExameController.listar);
router.get(
  "/tipos-de-exames/:id",
  authJwt,
  validarPermissao,
  TipoExameController.buscarPorId,
);
router.post("/tipos-de-exames", authJwt, validarPermissao, TipoExameController.criar);
router.put(
  "/tipos-de-exames/:id",
  authJwt,
  validarPermissao,
  TipoExameController.atualizar,
);
router.delete(
  "/tipos-de-exames/:id",
  authJwt,
  validarPermissao,
  TipoExameController.excluir,
);

export default router;
