import pool from "../config/database.js";
import { randomUUID } from "crypto";

class DoacaoModel {
  static async listarTodas(termo = "") {
    let query = `
      SELECT
        d.id,
        d.doador_nome,
        d.doador_contato,
        d.tipo_doacao,
        d.valor,
        d.item,
        d.quantidade,
        d.observacao,
        d.created_at
      FROM doacoes d
    `;

    const params = [];

    if (termo) {
      query += `
        WHERE
          d.doador_nome LIKE ?
          OR d.doador_contato LIKE ?
          OR d.tipo_doacao LIKE ?
          OR d.item LIKE ?
          OR COALESCE(d.observacao, '') LIKE ?
      `;
      const like = `%${termo}%`;
      params.push(like, like, like, like, like);
    }

    query += ` ORDER BY d.created_at DESC`;

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(
      `
      SELECT
        d.id,
        d.doador_nome,
        d.doador_contato,
        d.tipo_doacao,
        d.valor,
        d.item,
        d.quantidade,
        d.observacao,
        d.created_at
      FROM doacoes d
      WHERE d.id = ?
      `,
      [id]
    );
    return rows[0] || null;
  }

  static async criarDoacao(dados) {
    // Usando connection para gerenciar a transação
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const {
        doador_nome,
        doador_contato,
        tipo_doacao,
        valor,
        item,
        quantidade,
        observacao,
      } = dados;

      const id = randomUUID();

      await connection.query(
        `
          INSERT INTO doacoes
          (
            id,
            doador_nome,
            doador_contato,
            tipo_doacao,
            valor,
            item,
            quantidade,
            observacao
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          doador_nome || "Anônimo",
          doador_contato || null,
          tipo_doacao,
          valor || 0,
          item || null,
          quantidade || 0,
          observacao || null,
        ]
      );

      await connection.commit();

      return {
        id,
        doador_nome: doador_nome || "Anônimo",
        doador_contato: doador_contato || null,
        tipo_doacao,
        valor: valor || 0,
        item: item || null,
        quantidade: quantidade || 0,
        observacao: observacao || null,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default DoacaoModel;