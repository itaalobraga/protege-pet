import multer from "multer";
import ArquivoModel from "../models/ArquivoModel.js";
import { uploadParaS3, baixarDoS3 } from "../services/ArquivoService.js";
import { removerArquivoPorId } from "../services/ArquivoDeleteService.js";
import pool from "../config/database.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

class ArquivoController {
  // middleware exportado para a rota
  static uploadMiddleware() {
    return upload.single("arquivo");
  }

  static async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Arquivo é obrigatório (campo: arquivo)" });
      }

      const { originalname, mimetype, size, buffer } = req.file;

      const { bucket, key, etag } = await uploadParaS3({
        buffer,
        mimeType: mimetype,
        originalName: originalname,
        idPrefix: "arquivos",
      });

      const arquivo = await ArquivoModel.criar({
        nome_original: originalname,
        mime_type: mimetype,
        tamanho_bytes: size,
        s3_bucket: bucket,
        s3_key: key,
        s3_etag: etag,
        criado_por_usuario_id: req.usuarioId || null,
      });

      return res.status(201).json(arquivo);
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
      return res.status(500).json({ error: "Erro ao fazer upload do arquivo" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const arquivo = await ArquivoModel.buscarPorId(id);

      if (!arquivo) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
      }

      const obj = await baixarDoS3({ bucket: arquivo.s3_bucket, key: arquivo.s3_key });

      // AWS SDK v3: Body pode ser stream (Node.js Readable)
      const body = obj.Body;

      res.setHeader("Content-Type", arquivo.mime_type);
      // força download com nome original
      res.setHeader(
        "Content-Disposition",
        `attachment; filename*=UTF-8''${encodeURIComponent(arquivo.nome_original)}`,
      );

      if (body && typeof body.pipe === "function") {
        return body.pipe(res);
      }

      // fallback: caso venha como Uint8Array
      const buf = body ? await streamToBuffer(body) : Buffer.alloc(0);
      return res.send(buf);
    } catch (error) {
      console.error("Erro ao buscar arquivo por ID:", error);
      return res.status(500).json({ error: "Erro ao buscar arquivo" });
    }
  }

  static async excluir(req, res) {
    const connection = await pool.getConnection();
    let transacaoIniciada = false;

    try {
      const { id } = req.params;

      await connection.beginTransaction();
      transacaoIniciada = true;

      // se o arquivo estiver vinculado em alguma adoção, o FK ON DELETE SET NULL cuida do vínculo
      await removerArquivoPorId(id, connection);

      await connection.commit();
      transacaoIniciada = false;

      return res.status(204).send();
    } catch (error) {
      if (transacaoIniciada) {
        try { await connection.rollback(); } catch {}
      }
      console.error("Erro ao excluir arquivo:", error);
      return res.status(500).json({ error: "Erro ao excluir arquivo" });
    } finally {
      connection.release();
    }
  }

  static async buscarMetadadosPorId(req, res) {
    try {
      const { id } = req.params;
      const arquivo = await ArquivoModel.buscarPorId(id);

      if (!arquivo) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
      }

      return res.json(arquivo);
    } catch (error) {
      console.error("Erro ao buscar metadados do arquivo:", error);
      return res.status(500).json({ error: "Erro ao buscar metadados do arquivo" });
    }
  }
}

export default ArquivoController;
