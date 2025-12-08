import pool from "../config/database.js";
import { randomUUID } from "crypto";

const TABLE = "categorias"; 

class Categoria {
  static async listarTodos() {
    const [rows] = await pool.query(
      `SELECT * FROM ${TABLE} ORDER BY nome`
    );
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(
      `SELECT * FROM ${TABLE} WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  static async criar(categoria) {
    const { nome, descricao } = categoria;
    const id = randomUUID().substring(0, 8);

    await pool.query(
      `INSERT INTO ${TABLE} (id, nome, descricao) VALUES (?, ?, ?)`,
      [id, nome, descricao || null]
    );

    return { id, nome, descricao: descricao || null };
  }

  static async atualizar(id, categoria) {
    const { nome, descricao } = categoria;

    const [result] = await pool.query(
      `UPDATE ${TABLE} SET nome = ?, descricao = ? WHERE id = ?`,
      [nome, descricao || null, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return { id, nome, descricao: descricao || null };
  }

  static async excluir(id) {
    const [result] = await pool.query(
      `DELETE FROM ${TABLE} WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  static async filtrar(termo) {
    const termoBusca = `%${termo}%`;
    const [rows] = await pool.query(
      `SELECT * FROM ${TABLE}
       WHERE nome LIKE ?
       OR descricao LIKE ?
       ORDER BY nome`,
      [termoBusca, termoBusca]
    );
    return rows;
  }
}

export default Categoria;
