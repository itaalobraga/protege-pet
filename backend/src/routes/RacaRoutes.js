import { Router } from "express";
import RacaController from "../controllers/RacaController.js";
import { authJwt } from "../middlewares/authJwt.js";
import { exigirPermissao } from "../middlewares/exigirPermissao.js";

const router = Router();
const validarPermissao = exigirPermissao("Gerenciar animais");

router.get("/racas", authJwt, validarPermissao, RacaController.listar);
router.post("/racas", authJwt, validarPermissao, RacaController.criar);
router.get("/racas/:id", authJwt, validarPermissao, RacaController.buscarPorId);
router.put("/racas/:id", authJwt, validarPermissao, RacaController.atualizar);
router.delete("/racas/:id", authJwt, validarPermissao, RacaController.excluir);

export default router;
