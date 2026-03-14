import express from "express";
import AnimalController from "../controllers/AnimalController.js";
import { authJwt } from "../middlewares/authJwt.js";

const router = express.Router();
router.use(authJwt);

router.get("/animais", AnimalController.listar);
router.get("/animais/:id", AnimalController.buscarPorId);
router.post("/animais", AnimalController.criar);
router.put("/animais/:id", AnimalController.atualizar);
router.delete("/animais/:id", AnimalController.excluir);

export default router;

