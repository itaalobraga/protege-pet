import pool from "../config/database.js";
import { randomUUID } from "crypto";

class Produto {

  static async listarTodos() {
    const [rows] = await pool.query(`
      SELECT p.id,p.nome,p.sku,p.quantidade,p.categoria_id,c.nome AS categoria,p.descricao
      FROM produtos p 
      JOIN categorias_produtos c ON c.id = p.categoria_id
      ORDER BY p.nome
    `);
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(`
      SELECT p.id,p.nome,p.sku,p.quantidade,p.categoria_id,c.nome AS categoria,p.descricao
      FROM produtos p 
      JOIN categorias_produtos c ON c.id = p.categoria_id
      WHERE p.id=?
    `, [id]);
    return rows[0];
  }

  static async criar(produto) {
    const { nome, sku, quantidade, categoria_id, descricao } = produto;
    const id = randomUUID().substring(0, 8);

    await pool.query(`
      INSERT INTO produtos (id,nome,sku,quantidade,categoria_id,descricao)
      VALUES (?,?,?,?,?,?)`,
      [id,nome,sku,quantidade||0,categoria_id,descricao]
    );

    return { id,nome,sku,quantidade:quantidade||0,categoria_id,descricao };
  }

  static async atualizar(id, produto) {
    const { nome, sku, quantidade, categoria_id, descricao } = produto;

    const [result] = await pool.query(`
      UPDATE produtos SET nome=?,sku=?,quantidade=?,categoria_id=?,descricao=? WHERE id=?`,
      [nome,sku,quantidade,categoria_id,descricao,id]
    );

    return result.affectedRows>0 ? 
      { id,nome,sku,quantidade,categoria_id,descricao } : null;
  }

  static async excluir(id) {
    const [result] = await pool.query(`DELETE FROM produtos WHERE id=?`,[id]);
    return result.affectedRows>0;
  }

  static async filtrar(termo) {
    const like = `%${termo}%`;
    const [rows] = await pool.query(`
      SELECT p.id,p.nome,p.sku,p.quantidade,p.categoria_id,c.nome AS categoria,p.descricao
      FROM produtos p 
      JOIN categorias_produtos c ON c.id = p.categoria_id
      WHERE p.nome LIKE ? OR p.sku LIKE ? OR c.nome LIKE ? OR p.descricao LIKE ?
      ORDER BY p.nome`,
      [like,like,like,like]
    );
    return rows;
  }

  static async buscarPorSku(sku) {
    const [rows] = await pool.query(`SELECT * FROM produtos WHERE sku=?`,[sku]);
    return rows[0];
  }

  static async buscarPorNome(nome) {
    const [rows] = await pool.query(`SELECT * FROM produtos WHERE nome=?`,[nome]);
    return rows[0];
  }
}

export default Produto;
