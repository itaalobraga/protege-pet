import express from "express";
import VeterinarioController from "../controllers/VeterinarioController.js";

const router = express.Router();

router.get("/veterinarios", VeterinarioController.listar);
router.get("/veterinarios/:id", VeterinarioController.buscarPorId);
router.post("/veterinarios", VeterinarioController.criar);
router.put("/veterinarios/:id", VeterinarioController.atualizar);
router.delete("/veterinarios/:id", VeterinarioController.excluir);

export default router;

