import pool from "../config/database.js";

const parsePermissoes = (permissoes) => {
  if (Array.isArray(permissoes)) {
    return permissoes;
  }
  if (typeof permissoes === "string") {
    try {
      return JSON.parse(permissoes);
    } catch {
      return [];
    }
  }
  return [];
};

class Funcao {
  static async listarTodos() {
    const [rows] = await pool.query(
      "SELECT * FROM funcoes ORDER BY nome"
    );
    return rows.map(row => ({
      ...row,
      permissoes: parsePermissoes(row.permissoes)
    }));
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query("SELECT * FROM funcoes WHERE id = ?", [id]);
    if (rows[0]) {
      return {
        ...rows[0],
        permissoes: parsePermissoes(rows[0].permissoes)
      };
    }
    return null;
  }

  static async criar(funcao) {
    const { nome, permissoes } = funcao;
    const permissoesJson = JSON.stringify(permissoes);
    const [result] = await pool.query(
      `INSERT INTO funcoes (nome, permissoes) VALUES (?, ?)`,
      [nome, permissoesJson]
    );
    return { id: result.insertId, nome, permissoes };
  }

  static async atualizar(id, funcao) {
    const { nome, permissoes } = funcao;
    const permissoesJson = JSON.stringify(permissoes);
    const [result] = await pool.query(
      `UPDATE funcoes SET nome = ?, permissoes = ? WHERE id = ?`,
      [nome, permissoesJson, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }
    return { id: parseInt(id), nome, permissoes };
  }

  static async excluir(id) {
    const [result] = await pool.query("DELETE FROM funcoes WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async filtrar(termo) {
    const termoBusca = `%${termo}%`;
    const [rows] = await pool.query(
      `SELECT * FROM funcoes WHERE nome LIKE ? ORDER BY nome`,
      [termoBusca]
    );
    return rows.map(row => ({
      ...row,
      permissoes: parsePermissoes(row.permissoes)
    }));
  }

  static async buscarPorNome(nome) {
    const [rows] = await pool.query("SELECT * FROM funcoes WHERE nome = ?", [nome]);
    if (rows[0]) {
      return {
        ...rows[0],
        permissoes: parsePermissoes(rows[0].permissoes)
      };
    }
    return null;
  }

  static async contarUsuarios(funcaoId) {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as total FROM usuarios WHERE funcao_id = ?",
      [funcaoId]
    );
    return rows[0].total;
  }
}

export default Funcao;
