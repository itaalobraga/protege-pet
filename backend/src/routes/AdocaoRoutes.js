import express from "express";
import AdocaoController from "../controllers/AdocaoController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = express.Router();
const validarPermissao = exigirPermissao("Gerenciar adoções");

router.get("/adocoes", authJwt, validarPermissao, AdocaoController.listar);
router.get(
  "/adocoes/:id",
  authJwt,
  validarPermissao,
  AdocaoController.buscarPorId,
);
router.get(
  "/adocoes/cpf/:cpf",
  authJwt,
  validarPermissao,
  AdocaoController.buscarPorCPF,
);
router.get(
  "/adocoes/email/:email",
  authJwt,
  validarPermissao,
  AdocaoController.buscarPorEmail,
);
router.post("/adocoes", authJwt, validarPermissao, AdocaoController.criar);
router.put(
  "/adocoes/:id",
  authJwt,
  validarPermissao,
  AdocaoController.atualizar,
);
router.delete(
  "/adocoes/:id",
  authJwt,
  validarPermissao,
  AdocaoController.excluir,
);

export default router;
