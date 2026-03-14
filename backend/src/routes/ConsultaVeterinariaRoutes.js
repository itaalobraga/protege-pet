import express from "express";
import ConsultaVeterinariaController from "../controllers/ConsultaVeterinariaController.js";

const router = express.Router();

router.get("/consultas-veterinarias", ConsultaVeterinariaController.listar);
router.get("/consultas-veterinarias/:id", ConsultaVeterinariaController.buscarPorId);
router.post("/consultas-veterinarias", ConsultaVeterinariaController.criar);
router.put("/consultas-veterinarias/:id", ConsultaVeterinariaController.atualizar);
router.delete("/consultas-veterinarias/:id", ConsultaVeterinariaController.excluir);

export default router;
