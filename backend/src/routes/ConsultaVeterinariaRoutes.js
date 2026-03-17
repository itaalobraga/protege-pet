import express from "express";
import ConsultaVeterinariaController from "../controllers/ConsultaVeterinariaController.js";
import { authJwt } from "../middlewares/authJwt.js";

const router = express.Router();

router.use(authJwt);

router.get("/consultas-veterinarias", ConsultaVeterinariaController.listar);
router.get("/consultas-veterinarias/:id", ConsultaVeterinariaController.buscarPorId);
router.post("/consultas-veterinarias", ConsultaVeterinariaController.criar);
router.put("/consultas-veterinarias/:id", ConsultaVeterinariaController.atualizar);
router.delete("/consultas-veterinarias/:id", ConsultaVeterinariaController.excluir);

export default router;
