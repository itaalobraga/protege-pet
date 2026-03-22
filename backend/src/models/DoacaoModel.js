import pool from "../config/database.js";

class DoacaoModel {
  static async listarTodas(termo = "") {
    let query = `
      SELECT
        d.id,
        d.doador_nome,
        d.doador_contato,
        d.tipo_doacao,
        d.valor,
        d.produto_id,
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
          OR COALESCE(d.observacao, '') LIKE ?
      `;
      const like = `%${termo}%`;
      params.push(like, like, like, like);
    }

    query += ` ORDER BY d.created_at DESC`;

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(
      `
      SELECT * FROM doacoes WHERE id = ?
      `,
      [id]
    );
    return rows[0] || null;
  }

  static async criarDoacao(dados, connectionParam) {
    const connection = connectionParam || await pool.getConnection();

    try {
      const {
        doador_nome,
        doador_contato,
        tipo_doacao,
        valor,
        produto_id, 
        quantidade,
        observacao,
      } = dados;

      const query = `
        INSERT INTO doacoes
        (doador_nome, doador_contato, tipo_doacao, valor, produto_id, quantidade, observacao)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        doador_nome || "Anônimo",
        doador_contato || null,
        tipo_doacao,
        valor || 0,
        produto_id || null,
        quantidade || 0,
        observacao || null,
      ];

      const [result] = await connection.query(query, values);

      return {
        id: result.insertId, 
        doador_nome: doador_nome || "Anônimo",
        doador_contato: doador_contato || null,
        tipo_doacao,
        valor: valor || 0,
        produto_id: produto_id || null,
        quantidade: quantidade || 0,
        observacao: observacao || null,
      };
    } finally {
      if (!connectionParam) {
        connection.release();
      }
    }
  }
}

export default DoacaoModel;
