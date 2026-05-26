import pool from "../config/database.js";
import ArquivoModel from "../models/ArquivoModel.js";
import { removerDoS3 } from "./ArquivoStorageService.js";

/**
 * Remove um arquivo do S3 e também seu registro na tabela `arquivos`.
 * - Se o arquivo não existir no banco, não faz nada.
 * - Se falhar no S3, lança erro (para permitir rollback quando usado dentro de transação).
 */
export async function removerArquivoPorId(arquivoId, connectionParam = null) {
  if (!arquivoId) return false;

  const connection = connectionParam || pool;

  const arquivo = await ArquivoModel.buscarPorId(arquivoId);
  if (!arquivo) return false;

  await removerDoS3({ bucket: arquivo.s3_bucket, key: arquivo.s3_key });

  await connection.query("DELETE FROM arquivos WHERE id = ?", [arquivoId]);

  return true;
}
