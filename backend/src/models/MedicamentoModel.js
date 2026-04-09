import pool from "../config/database.js";

class Medicamento {
  static async listarTodos() {
    const [rows] = await pool.query("SELECT * FROM medicamentos ORDER BY nome");
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(
      "SELECT * FROM medicamentos WHERE id = ?",
      [id],
    );
    return rows[0];
  }

  static async criar(medicamento) {
    const { nome, principio_ativo, dosagem, forma_farmaceutica, fabricante, descricao } =
      medicamento;

    const [result] = await pool.query(
      `INSERT INTO medicamentos (nome, principio_ativo, dosagem, forma_farmaceutica, fabricante, descricao)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, principio_ativo, dosagem, forma_farmaceutica, fabricante, descricao],
    );

    return { id: result.insertId, nome, principio_ativo, dosagem, forma_farmaceutica, fabricante, descricao };
  }

  static async atualizar(id, medicamento) {
    const { nome, principio_ativo, dosagem, forma_farmaceutica, fabricante, descricao } =
      medicamento;

    const [result] = await pool.query(
      `UPDATE medicamentos
       SET nome = ?, principio_ativo = ?, dosagem = ?, forma_farmaceutica = ?, fabricante = ?, descricao = ?
       WHERE id = ?`,
      [nome, principio_ativo, dosagem, forma_farmaceutica, fabricante, descricao, id],
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return { id, nome, principio_ativo, dosagem, forma_farmaceutica, fabricante, descricao };
  }

  static async excluir(id) {
    const [result] = await pool.query(
      "DELETE FROM medicamentos WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }

  static async filtrar(termo) {
    const termoBusca = `%${termo}%`;
    const [rows] = await pool.query(
      `SELECT * FROM medicamentos
       WHERE nome LIKE ?
       OR principio_ativo LIKE ?
       OR fabricante LIKE ?
       OR forma_farmaceutica LIKE ?
       ORDER BY nome`,
      [termoBusca, termoBusca, termoBusca, termoBusca],
    );
    return rows;
  }
}

export default Medicamento;
