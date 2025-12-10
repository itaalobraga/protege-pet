import pool from "../config/database.js";
import { randomUUID } from "crypto";

class Produto {
  static async listarTodos() {
    const [rows] = await pool.query("SELECT * FROM produtos ORDER BY nome");
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query("SELECT * FROM produtos WHERE id = ?", [id]);
    return rows[0];
  }

  static async criar(produto) {
    const { nome, sku, quantidade, categoria, descricao } = produto;
    const id = randomUUID().substring(0, 8);

    await pool.query(
      `INSERT INTO produtos (id, nome, sku, quantidade, categoria, descricao) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, nome, sku, quantidade || 0, categoria, descricao]
    );

    return { id, nome, sku, quantidade: quantidade || 0, categoria, descricao };
  }

  static async atualizar(id, produto) {
    const { nome, sku, quantidade, categoria, descricao } = produto;

    const [result] = await pool.query(
      `UPDATE produtos SET nome = ?, sku = ?, quantidade = ?, categoria = ?, descricao = ? WHERE id = ?`,
      [nome, sku, quantidade, categoria, descricao, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }
    return { id, nome, sku, quantidade, categoria, descricao };
  }

  static async excluir(id) {
    const [result] = await pool.query("DELETE FROM produtos WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async filtrar(termo) {
    const termoBusca = `%${termo}%`;
    const [rows] = await pool.query(
      `SELECT * FROM produtos 
       WHERE nome LIKE ? 
       OR sku LIKE ? 
       OR categoria LIKE ?
       OR descricao LIKE ?
       ORDER BY nome`,
      [termoBusca, termoBusca, termoBusca, termoBusca]
    );
    return rows;
  }

  static async buscarPorSku(sku) {
    const [rows] = await pool.query("SELECT * FROM produtos WHERE sku = ?", [sku]);
    return rows[0];
  }
}

export default Produto;

