import express from "express";
import VoluntarioController from "../controllers/VoluntarioController.js";
import { authJwt } from "../middlewares/authJwt.js";

const router = express.Router();
router.use(authJwt);

router.get("/voluntarios", VoluntarioController.listar);
router.get("/voluntarios/:id", VoluntarioController.buscarPorId);
router.post("/voluntarios", VoluntarioController.criar);
router.put("/voluntarios/:id", VoluntarioController.atualizar);
router.delete("/voluntarios/:id", VoluntarioController.excluir);

export default router;
