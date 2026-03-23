import express from "express";
import AdocaoController from "../controllers/AdocaoController.js";
import { authJwt } from "../middlewares/authJwt.js";

const router = express.Router();
router.use(authJwt);

router.get("/adocoes", AdocaoController.listar);
router.get("/adocoes/:id", AdocaoController.buscarPorId);
router.get("/adocoes/cpf/:cpf", AdocaoController.buscarPorCPF);
router.get("/adocoes/email/:email", AdocaoController.buscarPorEmail);
router.post("/adocoes", AdocaoController.criar);
router.put("/adocoes/:id", AdocaoController.atualizar);
router.delete("/adocoes/:id", AdocaoController.excluir);

export default router;
