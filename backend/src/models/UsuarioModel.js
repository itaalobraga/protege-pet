import pool from "../config/database.js";

class Usuario {
  static async listarTodos() {
    const [rows] = await pool.query(
      `SELECT u.*, f.nome as funcao_nome,
         (SELECT GROUP_CONCAT(p.nome ORDER BY p.nome)
          FROM funcoes_permissoes fp
          INNER JOIN permissoes p ON fp.permissao_id = p.id
          WHERE fp.funcao_id = f.id) as funcao_permissoes
       FROM usuarios u
       INNER JOIN funcoes f ON u.funcao_id = f.id
       ORDER BY u.nome`
    );
    return rows.map((r) => ({
      ...r,
      funcao_permissoes: r.funcao_permissoes
        ? r.funcao_permissoes.split(",").map((p) => p.trim()).filter(Boolean)
        : [],
    }));
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(
      `SELECT u.*, f.nome as funcao_nome,
         (SELECT GROUP_CONCAT(p.nome ORDER BY p.nome)
          FROM funcoes_permissoes fp
          INNER JOIN permissoes p ON fp.permissao_id = p.id
          WHERE fp.funcao_id = f.id) as funcao_permissoes
       FROM usuarios u
       INNER JOIN funcoes f ON u.funcao_id = f.id
       WHERE u.id = ?`,
      [id]
    );
    if (!rows[0]) return null;
    const r = rows[0];
    return {
      ...r,
      funcao_permissoes: r.funcao_permissoes
        ? r.funcao_permissoes.split(",").map((p) => p.trim()).filter(Boolean)
        : [],
    };
  }

  static async criar(usuario) {
    const { id, nome, funcao_id, telefone, email, disponibilidade, senha } = usuario;
    await pool.query(
      `INSERT INTO usuarios (id, nome, funcao_id, telefone, email, disponibilidade, senha) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, nome, funcao_id, telefone, email, disponibilidade, senha]
    );
    return { id, nome, funcao_id, telefone, email, disponibilidade };
  }

  static async atualizar(id, usuario) {
    const { nome, funcao_id, telefone, email, disponibilidade, senha } = usuario;
    const [result] = await pool.query(
      `UPDATE usuarios SET nome = ?, funcao_id = ?, telefone = ?, email = ?, disponibilidade = ?, senha = ? WHERE id = ?`,
      [nome, funcao_id, telefone, email, disponibilidade, senha, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }
    return { id, nome, funcao_id, telefone, email, disponibilidade };
  }

  static async excluir(id) {
    const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async filtrar(termo) {
    const termoBusca = `%${termo}%`;
    const [rows] = await pool.query(
      `SELECT u.*, f.nome as funcao_nome,
         (SELECT GROUP_CONCAT(p.nome ORDER BY p.nome)
          FROM funcoes_permissoes fp
          INNER JOIN permissoes p ON fp.permissao_id = p.id
          WHERE fp.funcao_id = f.id) as funcao_permissoes
       FROM usuarios u
       INNER JOIN funcoes f ON u.funcao_id = f.id
       WHERE u.nome LIKE ?
       OR u.email LIKE ?
       OR f.nome LIKE ?
       ORDER BY u.nome`,
      [termoBusca, termoBusca, termoBusca]
    );
    return rows.map((r) => ({
      ...r,
      funcao_permissoes: r.funcao_permissoes
        ? r.funcao_permissoes.split(",").map((p) => p.trim()).filter(Boolean)
        : [],
    }));
  }

  static async buscarPorEmail(email) {
    const [rows] = await pool.query(
      `SELECT u.*, f.nome as funcao_nome
       FROM usuarios u
       INNER JOIN funcoes f ON u.funcao_id = f.id
       WHERE u.email = ?`,
      [email]
    );
    return rows[0];
  }
}

export default Usuario;
