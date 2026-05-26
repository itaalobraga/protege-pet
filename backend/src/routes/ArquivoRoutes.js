import express from "express";
import ArquivoController from "../controllers/ArquivoController.js";
import { authJwt } from "../middlewares/authJwt.js";

const router = express.Router();

// Upload (multipart/form-data, campo: arquivo)
router.post(
  "/arquivos",
  authJwt,
  ArquivoController.uploadMiddleware(),
  ArquivoController.upload,
);

// Download do arquivo pelo ID (stream do S3)
router.get("/arquivos/:id", authJwt, ArquivoController.buscarPorId);

// Apenas metadados
router.get("/arquivos/:id/metadata", authJwt, ArquivoController.buscarMetadadosPorId);

// Excluir arquivo (remove do S3 e do DB). FK da adoção fica NULL (ON DELETE SET NULL)
router.delete("/arquivos/:id", authJwt, ArquivoController.excluir);

export default router;
