import { Router } from "express";
import RacaController from "../controllers/RacaController.js";
import { authJwt } from "../middlewares/authJwt.js";

const router = Router();
router.use(authJwt);
router.get("/racas", RacaController.listar);
router.post("/racas", RacaController.criar);
router.get("/racas/:id", RacaController.buscarPorId);
router.put("/racas/:id", RacaController.atualizar);
router.delete("/racas/:id", RacaController.excluir);

export default router;