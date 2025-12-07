import express from "express";
import VoluntarioController from "../controllers/VoluntarioController.js";

const router = express.Router();

router.get("/voluntarios", VoluntarioController.listar);
router.get("/voluntarios/:id", VoluntarioController.buscarPorId);
router.post("/voluntarios", VoluntarioController.criar);
router.put("/voluntarios/:id", VoluntarioController.atualizar);
router.delete("/voluntarios/:id", VoluntarioController.excluir);

export default router;
