import pool from "../config/database.js";

class Categoria {
  static async listarTodas() {
    const [rows] = await pool.query(
      "SELECT id, nome, descricao FROM categorias_produtos ORDER BY nome"
    );
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(
      "SELECT id, nome, descricao FROM categorias_produtos WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  static async criar({ nome, descricao }) {
    const [result] = await pool.query(
      "INSERT INTO categorias_produtos (nome, descricao) VALUES (?, ?)",
      [nome, descricao]
    );
    return { id: result.insertId, nome, descricao };
  }

  static async atualizar(id, { nome, descricao }) {
    await pool.query(
      "UPDATE categorias_produtos SET nome = ?, descricao = ? WHERE id = ?",
      [nome, descricao, id]
    );
    return this.buscarPorId(id);
  }

  static async deletar(id) {
    const [result] = await pool.query(
      "DELETE FROM categorias_produtos WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

export default Categoria;
