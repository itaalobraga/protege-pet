import pool from "../config/database.js";

class PrescricaoModel {
  static async listarTodos(busca = "") {
    const termo = String(busca || "").trim();

    const sqlBase = `
      SELECT
        p.*,
        c.data_consulta,
        c.animal_id,
        a.nome AS animal_nome,
        m.nome AS medicamento_nome
      FROM prescricoes p
      INNER JOIN consultas_veterinarias c ON c.id = p.consulta_id
      INNER JOIN animais a ON a.id = c.animal_id
      INNER JOIN medicamentos m ON m.id = p.medicamento_id
    `;

    if (!termo) {
      const [rows] = await pool.query(`${sqlBase} ORDER BY p.created_at DESC`);
      return rows;
    }

    const termoBusca = `%${termo}%`;
    const [rows] = await pool.query(
      `${sqlBase}
       WHERE CAST(p.id AS CHAR) LIKE ?
          OR a.nome LIKE ?
          OR m.nome LIKE ?
          OR p.status LIKE ?
       ORDER BY p.created_at DESC`,
      [termoBusca, termoBusca, termoBusca, termoBusca]
    );

    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(
      `
        SELECT
          p.*,
          c.data_consulta,
          c.animal_id,
          a.nome AS animal_nome,
          m.nome AS medicamento_nome
        FROM prescricoes p
        INNER JOIN consultas_veterinarias c ON c.id = p.consulta_id
        INNER JOIN animais a ON a.id = c.animal_id
        INNER JOIN medicamentos m ON m.id = p.medicamento_id
        WHERE p.id = ?
        LIMIT 1
      `,
      [id]
    );

    return rows[0] || null;
  }

  static async criar(dados) {
    const {
      consulta_id,
      medicamento_id,
      dosagem,
      frequencia,
      duracao_dias,
      observacao,
      status,
    } = dados;

    const [result] = await pool.query(
      `
        INSERT INTO prescricoes
        (
          consulta_id,
          medicamento_id,
          dosagem,
          frequencia,
          duracao_dias,
          observacao,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        consulta_id,
        medicamento_id,
        dosagem,
        frequencia,
        duracao_dias,
        observacao || null,
        status || "ATIVA",
      ]
    );

    return this.buscarPorId(result.insertId);
  }

  static async atualizar(id, dados) {
    const {
      consulta_id,
      medicamento_id,
      dosagem,
      frequencia,
      duracao_dias,
      observacao,
      status,
    } = dados;

    const [result] = await pool.query(
      `
        UPDATE prescricoes
        SET
          consulta_id = ?,
          medicamento_id = ?,
          dosagem = ?,
          frequencia = ?,
          duracao_dias = ?,
          observacao = ?,
          status = ?
        WHERE id = ?
      `,
      [
        consulta_id,
        medicamento_id,
        dosagem,
        frequencia,
        duracao_dias,
        observacao || null,
        status,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.buscarPorId(id);
  }

  static async atualizarStatus(id, status) {
    const [result] = await pool.query(
      `
        UPDATE prescricoes
        SET status = ?
        WHERE id = ?
      `,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.buscarPorId(id);
  }

  static async excluir(id) {
    const [result] = await pool.query(
      `
        DELETE FROM prescricoes
        WHERE id = ?
      `,
      [id]
    );

    return result.affectedRows > 0;
  }
}

export default PrescricaoModel;
