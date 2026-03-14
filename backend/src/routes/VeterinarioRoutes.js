import express from "express";
import VeterinarioController from "../controllers/VeterinarioController.js";
import { authJwt } from "../middlewares/authJwt.js";

const router = express.Router();
router.use(authJwt);

router.get("/veterinarios", VeterinarioController.listar);
router.get("/veterinarios/:id", VeterinarioController.buscarPorId);
router.post("/veterinarios", VeterinarioController.criar);
router.put("/veterinarios/:id", VeterinarioController.atualizar);
router.delete("/veterinarios/:id", VeterinarioController.excluir);

export default router;

