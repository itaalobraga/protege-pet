import { Router } from "express";
import RacaController from "../controllers/RacaController.js";

const router = Router();
router.get("/racas", RacaController.listar);
router.post("/racas", RacaController.criar);
router.put("/racas/:id", RacaController.atualizar);
router.delete("/racas/:id", RacaController.excluir);

export default router;