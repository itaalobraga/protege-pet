import pool from "../config/database.js";

class DiagnosticoModel {
  static async listarTodos(busca = "") {
    let query = "SELECT * FROM diagnosticos";
    const params = [];

    if (busca) {
      query += " WHERE nome LIKE ? OR descricao LIKE ?";
      const termo = `%${busca}%`;
      params.push(termo, termo);
    }

    query += " ORDER BY nome ASC";
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async criar(dados) {
    const { nome, descricao } = dados;
    const query = "INSERT INTO diagnosticos (nome, descricao) VALUES (?, ?)";
    const [result] = await pool.query(query, [nome, descricao || null]);
    return { id: result.insertId, nome, descricao };
  }
}

export default DiagnosticoModel;