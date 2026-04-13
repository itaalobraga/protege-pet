import pool from "../config/database.js";

class DiagnosticoModel {
  static async listarTodos(busca = "") {
    let query = `
      SELECT d.*,
        (SELECT COUNT(*) FROM consultas_veterinarias c WHERE c.diagnostico_id = d.id) AS atendimentos_vinculados
      FROM diagnosticos d
    `;
    const params = [];

    if (busca) {
      query += " WHERE d.nome LIKE ? OR d.descricao LIKE ?";
      const termo = `%${busca}%`;
      params.push(termo, termo);
    }

    query += " ORDER BY d.nome ASC";
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async buscarPorId(id) {
    const query = `
      SELECT d.*,
        (SELECT COUNT(*) FROM consultas_veterinarias c WHERE c.diagnostico_id = d.id) AS atendimentos_vinculados
      FROM diagnosticos d
      WHERE d.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0] || null;
  }

  static async criar(dados) {
    const { nome, descricao } = dados;
    const query = "INSERT INTO diagnosticos (nome, descricao) VALUES (?, ?)";
    const [result] = await pool.query(query, [nome, descricao || null]);
    return { id: result.insertId, nome, descricao };
  }

  static async atualizar(id, dados) {
    const { nome, descricao } = dados;
    const [result] = await pool.query(
      "UPDATE diagnosticos SET nome = ?, descricao = ? WHERE id = ?",
      [nome, descricao || null, id]
    );
    return result.affectedRows > 0;
  }

  static async contarAtendimentosPorDiagnostico(id) {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS total FROM consultas_veterinarias WHERE diagnostico_id = ?",
      [id]
    );
    return Number(rows[0]?.total || 0);
  }

  static async excluir(id) {
    const vinculos = await this.contarAtendimentosPorDiagnostico(id);
    if (vinculos > 0) {
      return { removido: false, motivo: "vinculos" };
    }
    const [result] = await pool.query("DELETE FROM diagnosticos WHERE id = ?", [id]);
    return { removido: result.affectedRows > 0 };
  }
}

export default DiagnosticoModel;