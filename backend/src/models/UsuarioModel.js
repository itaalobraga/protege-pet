import pool from "../config/database.js";

class Usuario {
  static async listarTodos() {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios ORDER BY nome"
    );
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    return rows[0];
  }

  static async criar(usuario) {
    const { id, nome, funcao, telefone, email, disponibilidade, senha } = usuario;
    await pool.query(
      `INSERT INTO usuarios (id, nome, funcao, telefone, email, disponibilidade, senha) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, nome, funcao, telefone, email, disponibilidade, senha]
    );
    return { id, nome, funcao, telefone, email, disponibilidade };
  }

  static async atualizar(id, usuario) {
    const { nome, funcao, telefone, email, disponibilidade, senha } = usuario;
    const [result] = await pool.query(
      `UPDATE usuarios SET nome = ?, funcao = ?, telefone = ?, email = ?, disponibilidade = ?, senha = ? WHERE id = ?`,
      [nome, funcao, telefone, email, disponibilidade, senha, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }
    return { id, nome, funcao, telefone, email, disponibilidade };
  }

  static async excluir(id) {
    const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async filtrar(termo) {
    const termoBusca = `%${termo}%`;
    const [rows] = await pool.query(
      `SELECT * FROM usuarios 
       WHERE nome LIKE ? 
       OR email LIKE ? 
       OR funcao LIKE ?
       ORDER BY nome`,
      [termoBusca, termoBusca, termoBusca]
    );
    return rows;
  }

  static async buscarPorEmail(email) {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    return rows[0];
  }
}

export default Usuario;
