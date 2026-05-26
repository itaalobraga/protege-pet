import pool from "../config/database.js";
import { randomUUID } from "crypto";

class ArquivoModel {
  static async excluir(id, connectionParam = null) {
    const connection = connectionParam || pool;
    const [result] = await connection.query("DELETE FROM arquivos WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async criar({
    nome_original,
    mime_type,
    tamanho_bytes,
    s3_bucket,
    s3_key,
    s3_etag = null,
    criado_por_usuario_id = null,
  }) {

    const result = await pool.query(
      `
      INSERT INTO arquivos (
        nome_original,
        mime_type,
        tamanho_bytes,
        s3_bucket,
        s3_key,
        s3_etag,
        criado_por_usuario_id
      ) VALUES (?,?,?,?,?,?,?)
      `,
      [
        nome_original,
        mime_type,
        tamanho_bytes,
        s3_bucket,
        s3_key,
        s3_etag,
        criado_por_usuario_id,
      ],
    );

    return this.buscarPorId(result[0].insertId);
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        nome_original,
        mime_type,
        tamanho_bytes,
        s3_bucket,
        s3_key,
        s3_etag,
        criado_por_usuario_id,
        created_at,
        updated_at
      FROM arquivos
      WHERE id = ?
      LIMIT 1
      `,
      [id],
    );

    return rows?.[0] || null;
  }
}

export default ArquivoModel;
