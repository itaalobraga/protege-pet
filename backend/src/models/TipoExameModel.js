import pool from "../config/database.js";

class TipoExame {
  static async listarTodos() {
    const [rows] = await pool.query("SELECT * FROM tipos_exames ORDER BY nome");
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query("SELECT * FROM tipos_exames WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  static async criar(tipoExame) {
    const { nome, descricao } = tipoExame;

    const [result] = await pool.query(
      `INSERT INTO tipos_exames (nome, descricao)
       VALUES (?, ?)`,
      [nome, descricao],
    );

    return { id: result.insertId, nome, descricao };
  }

  static async atualizar(id, tipoExame) {
    const { nome, descricao } = tipoExame;

    const [result] = await pool.query(
      `UPDATE tipos_exames
       SET nome = ?, descricao = ?
       WHERE id = ?`,
      [nome, descricao, id],
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return { id, nome, descricao };
  }

  static async excluir(id) {
    const [result] = await pool.query("DELETE FROM tipos_exames WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }

  static async filtrar(termo) {
    const termoBusca = `%${termo}%`;
    const [rows] = await pool.query(
      `SELECT * FROM tipos_exames
       WHERE nome LIKE ?
       OR descricao LIKE ?
       ORDER BY nome`,
      [termoBusca, termoBusca],
    );
    return rows;
  }
}

export default TipoExame;
