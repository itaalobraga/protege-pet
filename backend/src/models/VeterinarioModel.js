import pool from "../config/database.js";

class Veterinario {
  static async listarTodos() {
    const [rows] = await pool.query("SELECT * FROM veterinarios ORDER BY nome");
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query("SELECT * FROM veterinarios WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  static async criar(veterinario) {
    const { nome, sobrenome, telefone, email, crmv } = veterinario;

    const [result] = await pool.query(
      `INSERT INTO veterinarios (nome, sobrenome, telefone, email, crmv)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, sobrenome, telefone, email, crmv]
    );

    return { id: result.insertId, nome, sobrenome, telefone, email, crmv };
  }

  static async atualizar(id, veterinario) {
    const { nome, sobrenome, telefone, email, crmv } = veterinario;

    const [result] = await pool.query(
      `UPDATE veterinarios
       SET nome = ?, sobrenome = ?, telefone = ?, email = ?, crmv = ?
       WHERE id = ?`,
      [nome, sobrenome, telefone, email, crmv, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return { id, nome, sobrenome, telefone, email, crmv };
  }

  static async excluir(id) {
    const [result] = await pool.query("DELETE FROM veterinarios WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }

  static async filtrar(termo) {
    const termoBusca = `%${termo}%`;
    const [rows] = await pool.query(
      `SELECT * FROM veterinarios
       WHERE nome LIKE ?
       OR sobrenome LIKE ?
       OR email LIKE ?
       OR crmv LIKE ?
       ORDER BY nome`,
      [termoBusca, termoBusca, termoBusca, termoBusca]
    );
    return rows;
  }

  static async buscarPorEmail(email) {
    const [rows] = await pool.query("SELECT * FROM veterinarios WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  static async contarConsultas(id) {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS total FROM consultas_veterinarias WHERE veterinario_id = ?",
      [id]
    );
    return rows[0]?.total || 0;
  }
}

export default Veterinario;
